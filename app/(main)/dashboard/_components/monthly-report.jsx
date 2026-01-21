"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  CheckCircle2,
  Loader2,
  Download,
} from "lucide-react";
import { generateMonthlyReport } from "@/actions/monthly-report";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function MonthlyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setReport(null);

    try {
      const result = await generateMonthlyReport();
      if (result.success) {
        setReport(result.report);
        setData(result.data);
      } else {
        if (result.error === "QUOTA_EXCEEDED") {
          toast.warning("API quota exceeded. Please try again later.");
        } else {
          toast.error(result.message || "Failed to generate report.");
        }
      }
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report || !data) return;

    const reportText = `
MONTHLY FINANCIAL REPORT
${data.currentMonth.month}

${"=".repeat(50)}

MONTHLY SUMMARY
${report.monthlySummary || "No summary available"}

${"=".repeat(50)}

KEY OBSERVATIONS
${report.keyObservations?.map((obs, i) => `${i + 1}. ${obs}`).join("\n") || "None"}

${"=".repeat(50)}

PROBLEM AREAS
${report.problemAreas?.map((area, i) => 
  `${i + 1}. ${area.category}: ${area.issue}\n   Impact: ${area.impact}`
).join("\n\n") || "None identified"}

${"=".repeat(50)}

AI RECOMMENDATIONS
${report.aiRecommendations?.map((rec, i) => `${i + 1}. ${rec}`).join("\n") || "None"}

${"=".repeat(50)}

NEXT MONTH ACTION PLAN
${report.nextMonthActionPlan?.map((action, i) => `${i + 1}. ${action}`).join("\n") || "None"}

${"=".repeat(50)}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${data.currentMonth.month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Monthly Financial Report
          </CardTitle>
          {report && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report && !loading && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate a comprehensive monthly financial report
            </p>
            <Button onClick={handleGenerateReport} className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Generating report...
            </span>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            {/* Monthly Summary */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-sm">Monthly Summary</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {report.monthlySummary}
              </p>
            </div>

            {/* Key Observations */}
            {report.keyObservations && report.keyObservations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-sm">Key Observations</h3>
                </div>
                <ul className="space-y-2">
                  {report.keyObservations.map((obs, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Problem Areas */}
            {report.problemAreas && report.problemAreas.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <h3 className="font-semibold text-sm">Problem Areas</h3>
                </div>
                <div className="space-y-3">
                  {report.problemAreas.map((area, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">
                          {area.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{area.issue}</p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Impact:</span> {area.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {report.aiRecommendations && report.aiRecommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-semibold text-sm">AI Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {report.aiRecommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start gap-2 p-2 bg-yellow-50 rounded border border-yellow-200"
                    >
                      <span className="text-yellow-600 mt-1">💡</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Month Action Plan */}
            {report.nextMonthActionPlan && report.nextMonthActionPlan.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  <h3 className="font-semibold text-sm">Next Month Action Plan</h3>
                </div>
                <ol className="space-y-2">
                  {report.nextMonthActionPlan.map((action, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start gap-2 p-2 bg-purple-50 rounded border border-purple-200"
                    >
                      <span className="font-semibold text-purple-600 min-w-[20px]">
                        {index + 1}.
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Regenerate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
