"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get comprehensive monthly financial data
 */
async function getMonthlyFinancialData(userId, month = null) {
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      budgets: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const currentDate = month || new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Previous month for comparison
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevStartDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
  const prevEndDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);

  // Get current month transactions
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

  // Get previous month transactions
  const prevTransactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: prevStartDate,
        lte: prevEndDate,
      },
    },
  });

  // Calculate current month totals
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount.toNumber(), 0);

  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const totalExpenses = expenses.reduce(
    (sum, t) => sum + t.amount.toNumber(),
    0
  );

  // Category-wise spending
  const categorySpending = expenses.reduce((acc, t) => {
    const category = t.category || "other";
    acc[category] = (acc[category] || 0) + t.amount.toNumber();
    return acc;
  }, {});

  // Previous month totals
  const prevTotalIncome = prevTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount.toNumber(), 0);

  const prevExpenses = prevTransactions.filter((t) => t.type === "EXPENSE");
  const prevTotalExpenses = prevExpenses.reduce(
    (sum, t) => sum + t.amount.toNumber(),
    0
  );

  // Previous month category spending
  const prevCategorySpending = prevExpenses.reduce((acc, t) => {
    const category = t.category || "other";
    acc[category] = (acc[category] || 0) + t.amount.toNumber();
    return acc;
  }, {});

  // Get budget data
  const budget = user.budgets?.[0];
  const budgetLimits = budget
    ? {
        total: budget.amount.toNumber(),
        byCategory: {}, // Can be extended if category budgets exist
      }
    : null;

  return {
    currentMonth: {
      month: currentDate.toISOString().slice(0, 7), // YYYY-MM
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      categorySpending,
      transactionCount: transactions.length,
    },
    previousMonth: {
      month: prevMonth.toISOString().slice(0, 7),
      totalIncome: prevTotalIncome,
      totalExpenses: prevTotalExpenses,
      netIncome: prevTotalIncome - prevTotalExpenses,
      categorySpending: prevCategorySpending,
    },
    budgetLimits,
  };
}

/**
 * Generate monthly financial report
 */
export async function generateMonthlyReport(month = null) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get financial data
    const financialData = await getMonthlyFinancialData(userId, month);

    // Prepare the prompt
    const prompt = `You are a professional financial analyst.

Analyze the user's monthly financial data and generate a clear, personalized report.

Input data includes:
- Total income
- Total expenses
- Category-wise spending
- Budget limits
- Comparison with previous month

Tasks:
- Summarize overall financial performance
- Identify best and worst spending categories
- Point out key problem areas
- Suggest realistic improvements
- Provide a simple action plan for next month

Rules:
- Be concise and data-driven
- Avoid generic advice
- Use specific categories and amounts
- Keep output short and practical

Financial data:
${JSON.stringify(financialData, null, 2)}

Output format (JSON):
{
  "monthlySummary": "2-3 sentence summary of the month",
  "keyObservations": [
    "Observation 1",
    "Observation 2",
    "Observation 3"
  ],
  "problemAreas": [
    {
      "category": "Category name",
      "issue": "Description of the problem",
      "impact": "Impact description"
    }
  ],
  "aiRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "nextMonthActionPlan": [
    "Action step 1",
    "Action step 2",
    "Action step 3"
  ]
}

Only return valid JSON. Be specific with numbers and categories from the data.`;

    // Generate report using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      let report = {};

      try {
        report = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Error parsing report JSON:", parseError);
        // Fallback structure
        report = {
          monthlySummary: "Unable to generate report. Please try again.",
          keyObservations: [],
          problemAreas: [],
          aiRecommendations: [],
          nextMonthActionPlan: [],
        };
      }

      return {
        success: true,
        report,
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
          report: null,
          data: financialData,
        };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error generating monthly report:", error);
    return {
      success: false,
      error: "GENERAL_ERROR",
      message: error.message || "Failed to generate monthly report",
      report: null,
      data: null,
    };
  }
}
