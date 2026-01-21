"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, RefreshCw, CheckCircle2 } from "lucide-react";
import { detectSpendingAnomalies } from "@/actions/spending-anomaly";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RISK_COLORS = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-red-100 text-red-800 border-red-200",
};

const RISK_ICONS = {
  Low: CheckCircle2,
  Medium: TrendingUp,
  High: AlertTriangle,
};

export function SpendingAlerts() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    setQuotaExceeded(false);
    try {
      const result = await detectSpendingAnomalies();
      if (result.success) {
        setInsights(result.insights || []);
        setQuotaExceeded(false);
      } else {
        // Handle quota or other errors gracefully
        if (result.error === "QUOTA_EXCEEDED") {
          setQuotaExceeded(true);
          setInsights([]);
        } else {
          toast.error(result.message || "Failed to load spending insights.");
          setInsights([]);
        }
      }
    } catch (error) {
      toast.error("Failed to load spending insights. Please try again.");
      console.error(error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Spending Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0 && !quotaExceeded) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Spending Alerts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadInsights}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">No spending anomalies detected</p>
            <p className="text-xs mt-1">Your spending patterns look normal</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quotaExceeded) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Spending Alerts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadInsights}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-sm font-medium mb-1">API Quota Exceeded</p>
            <p className="text-xs text-muted-foreground mb-4">
              The free tier limit has been reached. Please try again later or upgrade your plan.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadInsights}
              disabled={loading}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Spending Alerts
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadInsights}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = RISK_ICONS[insight.riskLevel] || AlertTriangle;
          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border",
                RISK_COLORS[insight.riskLevel] || RISK_COLORS.Medium
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    RISK_COLORS[insight.riskLevel] || RISK_COLORS.Medium
                  )}
                >
                  {insight.riskLevel} Risk
                </Badge>
              </div>
              <p className="text-sm mb-2 opacity-90">{insight.explanation}</p>
              <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                <p className="text-xs font-medium">Suggested Action:</p>
                <p className="text-xs mt-1">{insight.suggestedAction}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
