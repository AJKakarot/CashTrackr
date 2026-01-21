"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get monthly expense data for comparison
 */
async function getMonthlyExpenseData(userId, months = 3) {
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      budgets: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const monthlyData = [];
  const currentDate = new Date();

  for (let i = 0; i < months; i++) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Group by category
    const byCategory = transactions.reduce((acc, t) => {
      const category = t.category || "other";
      acc[category] = (acc[category] || 0) + t.amount.toNumber();
      return acc;
    }, {});

    const totalExpenses = transactions.reduce(
      (sum, t) => sum + t.amount.toNumber(),
      0
    );

    monthlyData.push({
      month: month.toISOString().slice(0, 7), // YYYY-MM format
      totalExpenses,
      byCategory,
      transactionCount: transactions.length,
    });
  }

  // Get budget data
  const budget = user.budgets?.[0];
  const budgetLimits = budget
    ? {
        total: budget.amount.toNumber(),
        byCategory: {}, // Can be extended if category budgets exist
      }
    : null;

  return {
    monthlyData: monthlyData.reverse(), // Oldest to newest
    budgetLimits,
  };
}

/**
 * Detect spending anomalies and risky behavior
 */
export async function detectSpendingAnomalies() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get expense data for current and previous months
    const expenseData = await getMonthlyExpenseData(userId, 3);

    // Prepare the prompt
    const prompt = `You are an AI system that detects unusual or risky spending behavior.

Given:
- Expense data for the current month
- Expense data for previous months
- Budget limits per category

Your task:
- Compare current spending with historical data
- Detect anomalies, spikes, or risky trends
- Identify categories with abnormal growth
- Predict if the user may exceed their budget

Rules:
- Highlight only meaningful insights
- Avoid repeating obvious information
- Explain the reason behind each insight

Financial data:
${JSON.stringify(expenseData, null, 2)}

Output format (JSON array):
[
  {
    "title": "Insight title",
    "explanation": "1-2 sentences explaining the insight",
    "riskLevel": "Low" | "Medium" | "High",
    "suggestedAction": "Actionable suggestion"
  }
]

Only return valid JSON array. If no significant anomalies are found, return an empty array.`;

    // Generate insights using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      let insights = [];

      try {
        insights = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Error parsing insights JSON:", parseError);
        insights = [];
      }

      return {
        success: true,
        insights: Array.isArray(insights) ? insights : [],
        data: expenseData,
      };
    } catch (apiError) {
      // Handle rate limit errors gracefully
      if (apiError.message?.includes("429") || apiError.message?.includes("quota") || apiError.message?.includes("rate limit")) {
        console.warn("Gemini API quota exceeded:", apiError.message);
        return {
          success: false,
          error: "QUOTA_EXCEEDED",
          message: "API quota exceeded. Please try again later or upgrade your plan.",
          insights: [],
          data: expenseData,
        };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error detecting spending anomalies:", error);
    
    // Return graceful error instead of throwing
    return {
      success: false,
      error: "GENERAL_ERROR",
      message: error.message || "Failed to detect spending anomalies",
      insights: [],
      data: null,
    };
  }
}
