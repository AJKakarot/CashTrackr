"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import { getFinancialAdvice } from "@/actions/financial-advice";
import { toast } from "sonner";

const SUGGESTED_QUESTIONS = [
  "How can I save more money?",
  "What are my biggest expenses?",
  "Am I spending too much?",
  "How can I improve my budget?",
];

export function FinancialAssistant() {
  const [question, setQuestion] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAdvice("");

    try {
      const result = await getFinancialAdvice(question);
      if (result.success) {
        setAdvice(result.advice);
      } else {
        if (result.error === "QUOTA_EXCEEDED") {
          toast.warning("API quota exceeded. Please try again later.");
        } else {
          toast.error(result.message || "Failed to get financial advice.");
        }
      }
    } catch (error) {
      toast.error("Failed to get financial advice. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Financial Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((suggested, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuestion(suggested)}
              className="text-xs"
            >
              {suggested}
            </Button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask me anything about your finances..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !question.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Advice Display */}
        {advice && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
              <h3 className="font-semibold text-blue-900">Advice</h3>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {advice}
            </div>
          </div>
        )}

        {!advice && !loading && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Ask a question to get personalized financial advice</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
