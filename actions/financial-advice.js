"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get financial data for a user
 */
async function getFinancialData(userId, month = null) {
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      accounts: true,
      budgets: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Calculate date range
  const startDate = month
    ? new Date(month.getFullYear(), month.getMonth(), 1)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDate = month
    ? new Date(month.getFullYear(), month.getMonth() + 1, 0)
    : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  // Get transactions for the month
  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  // Calculate monthly income
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount.toNumber(), 0);

  // Calculate expenses by category
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const totalExpenses = expenses.reduce(
    (sum, t) => sum + t.amount.toNumber(),
    0
  );

  const byCategory = expenses.reduce((acc, t) => {
    const category = t.category || "other";
    acc[category] = (acc[category] || 0) + t.amount.toNumber();
    return acc;
  }, {});

  // Get budget data
  const budget = user.budgets?.[0];
  const monthlyBudget = budget ? budget.amount.toNumber() : null;

  return {
    monthlyIncome: totalIncome,
    expenseTransactions: expenses.map((t) => ({
      category: t.category,
      amount: t.amount.toNumber(),
      date: t.date.toISOString(),
      description: t.description,
    })),
    monthlyBudgets: monthlyBudget
      ? {
          total: monthlyBudget,
          byCategory: {}, // Can be extended if you have category budgets
        }
      : null,
  };
}

/**
 * Generate personalized financial advice based on user's data
 */
export async function getFinancialAdvice(userQuestion) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get financial data
    const financialData = await getFinancialData(userId);

    // Prepare the prompt
    const prompt = `You are an intelligent personal finance assistant.

You are given a user's financial data including:
- Monthly income
- Expense transactions (category, amount, date)
- Monthly budgets per category

Your task:
- Analyze the data carefully
- Answer the user's question with clear, actionable advice
- Be concise, friendly, and practical
- Do NOT give generic tips
- Base every suggestion strictly on the provided data

User question:
"${userQuestion}"

Financial data:
${JSON.stringify(financialData, null, 2)}

Output format:
- Short explanation (2–3 sentences)
- Bullet list of actionable suggestions
- Mention specific categories and amounts when relevant`;

    // Generate advice using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const advice = response.text();

      return {
        success: true,
        advice,
        data: financialData,
      };
    } catch (apiError) {
      // Handle rate limit errors gracefully
      if (
        apiError.message?.includes("429") ||
        apiError.message?.includes("quota") ||
        apiError.message?.includes("rate limit")
      ) {
        console.warn("Gemini API quota exceeded:", apiError.message);
        return {
          success: false,
          error: "QUOTA_EXCEEDED",
          message: "API quota exceeded. Please try again later or upgrade your plan.",
          advice: null,
          data: financialData,
        };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error generating financial advice:", error);
    return {
      success: false,
      error: "GENERAL_ERROR",
      message: error.message || "Failed to generate financial advice",
      advice: null,
      data: null,
    };
  }
}
