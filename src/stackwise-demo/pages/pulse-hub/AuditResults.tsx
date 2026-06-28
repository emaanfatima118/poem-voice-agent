/**
 * Audit Results Display - Pulse Hub
 * 
 * Dedicated page for displaying audit results without the "start new audit" form
 * Loads audit data from URL parameter (?id=) and displays findings, insights, and action plans
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card, CardContent } from "@/stackwise-demo/components/ui/card";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/stackwise-demo/components/ui/tabs";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { apiRequest } from "@/stackwise-demo/lib/queryClient";
import {
  Loader2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Edit3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  LineChart,
  Lightbulb,
  Sparkles,
  Plus,
  Calendar,
  Target,
  ArrowLeft,
} from "lucide-react";

type PriorityLevel = "Critical" | "Important" | "Quick Win" | "General";

type CategoryFindings = {
  category: string;
  score: number;
  change: number;
  issues: Array<{
    text: string;
    why: string;
    priority: PriorityLevel;
  }>;
};

export default function AuditResults() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('results');
  const [activeTab, setActiveTab] = useState("findings");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addingToEval, setAddingToEval] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const moduleColor = '#6218df';

  // Get audit ID from URL on client side only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log('[AuditResults] Extracted ID from URL:', id);
    setAuditId(id);
  }, [location]); // Re-run when location changes

  // Steps for navigation
  const steps = [
    { id: "start", label: "Audit", description: "Select topics" },
    { id: "view-audits", label: "View Audits", description: "Audit history" },
    { id: "results", label: "Results", description: "Audit results" },
  ];

  // Handle step changes
  const handleStepChange = (stepId: string) => {
    if (stepId === "start") {
      setLocation("/pulse-hub/audit");
    } else if (stepId === "view-audits") {
      setLocation("/pulse-hub/view-audits");
    } else if (stepId === "results") {
      // Already on results page - do nothing or scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentStep(stepId);
    }
  };

  // Fetch audit data
  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit', auditId],
    queryFn: async () => {
      if (!auditId) throw new Error('No audit ID provided');
      
      console.log('[AuditResults] Fetching audit:', auditId);
      const response = await fetch(`/api/audits/${auditId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AuditResults] Failed to fetch audit:', response.status, errorText);
        throw new Error('Failed to fetch audit');
      }
      
      const result = await response.json();
      console.log('[AuditResults] Audit data:', result);
      return result.data;
    },
    enabled: !!auditId,
  });

  // Parse audit results from the audit_data field
  const auditResult = audit?.audit_data || null;

  // Parse findings data from 'sections' field
  const findings: CategoryFindings[] = auditResult?.sections ? 
    Object.entries(auditResult.sections).map(([category, data]: [string, any]) => ({
      category,
      score: data.score || 0,
      change: 0,
      issues: (data.findings || []).map((finding: any) => ({
        text: finding.title || finding.text || "No title",
        why: finding.why_it_matters || finding.why || "No explanation provided",
        priority: finding.severity || finding.priority || "General",
      })),
    }))
    : [];

  // Parse audit results for grade card
  const auditResults = auditResult ? {
    grade: auditResult.overall_score || 0,
    gradeLabel: auditResult.score_label || "Unknown",
    performanceLevel: auditResult.performance_level || "Needs Improvement",
    change: auditResult.change_vs_last || 0,
    executive: {
      summary: auditResult.executive_summary || "No summary available",
      topStrengths: Array.isArray(auditResult.summary_cards?.["Top Strengths"]) 
        ? auditResult.summary_cards["Top Strengths"].join(", ") 
        : "N/A",
      topGaps: Array.isArray(auditResult.summary_cards?.["Top Gaps"]) 
        ? auditResult.summary_cards["Top Gaps"].join(", ") 
        : "N/A",
      topPriority: Array.isArray(auditResult.summary_cards?.["Top Priorities"]) 
        ? auditResult.summary_cards["Top Priorities"][0] || "N/A"
        : "N/A",
      quickWins: Array.isArray(auditResult.summary_cards?.["Quick Wins"]) 
        ? auditResult.summary_cards["Quick Wins"][0] || "N/A"
        : "N/A",
    }
  } : null;

  // Parse competitor data from 'competitor_snapshot' field
  const competitor = auditResult?.competitor_snapshot ? {
    gaps: auditResult.competitor_snapshot.gaps || [],
    opportunities: auditResult.competitor_snapshot.opportunities || [],
    insights: auditResult.competitor_snapshot.insights || [],
    recommendations: auditResult.competitor_snapshot.recommendations || [],
  } : {
    gaps: [],
    opportunities: [],
    insights: [],
    recommendations: [],
  };

  // Parse action plan data from 'plan_30_60_90' field
  const actionPlan = auditResult?.plan_30_60_90 ? {
    "30-day": (auditResult.plan_30_60_90["30_days"] || []).map((task: string) => ({
      task,
      owner: "Team",
      status: "pending"
    })),
    "60-day": (auditResult.plan_30_60_90["60_days"] || []).map((task: string) => ({
      task,
      owner: "Team",
      status: "pending"
    })),
    "90-day": (auditResult.plan_30_60_90["90_days"] || []).map((task: string) => ({
      task,
      owner: "Team",
      status: "pending"
    })),
  } : {
    "30-day": [],
    "60-day": [],
    "90-day": [],
  };

  // Check if competitor analysis was performed
  const hasCompetitorAnalysis = competitor.gaps.length > 0 || 
    competitor.opportunities.length > 0 || 
    competitor.insights.length > 0 || 
    competitor.recommendations.length > 0;

  const toggleExpand = (category: string) => {
    setExpanded(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Add item to Eval Matrix in Strategy Studio
  const handleAddToEval = async (task: string, timeframe: string, idx: number) => {
    const evalKey = `${timeframe}-${idx}`;
    setAddingToEval(evalKey);

    try {
      // Map timeframe to priority and risk
      const priorityMap: Record<string, { priority: string; risk: string }> = {
        "30-day": { priority: "High", risk: "Low" },
        "60-day": { priority: "Medium", risk: "Medium" },
        "90-day": { priority: "Medium", risk: "High" },
      };

      const { priority, risk } = priorityMap[timeframe] || { priority: "Medium", risk: "Medium" };

      const newMilestone = {
        name: task,
        priority,
        risk,
        status: "Not Started",
        description: `From ${audit?.audit_name || 'Marketing Audit'} - ${timeframe} recommendation`,
      };

      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMilestone),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add milestone');
      }

      toast({
        title: "Added to Eval Matrix",
        description: `"${task}" has been added to your Strategy Studio Eval Matrix.`,
      });
    } catch (error) {
      console.error('Error adding to eval:', error);
      toast({
        title: "Failed to add",
        description: "Could not add item to Eval Matrix. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToEval(null);
    }
  };

  const PriorityBadge = ({ priority }: { priority: PriorityLevel }) => {
    const config = {
      Critical: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
      Important: { icon: Edit3, color: "text-yellow-400", bg: "bg-yellow-500/10" },
      "Quick Win": { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
      General: { icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-500/10" },
    };
    const { icon: Icon, color, bg } = config[priority] || config.General;
    return (
      <Badge variant="outline" className={`${bg} ${color} border-0 gap-1`}>
        <Icon className="w-3 h-3" />
        {priority}
      </Badge>
    );
  };

  const content = (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
        <QuickActions module="PulseHub" />
      </div>
      
      <div className="px-8 py-6">
        {!mounted ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Initializing...</h3>
              <p className="text-muted-foreground">Please wait...</p>
            </CardContent>
          </Card>
        ) : !auditId ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Audit Selected</h3>
              <p className="text-muted-foreground mb-4">Please select an audit from the View Audits page.</p>
              <Button onClick={() => setLocation('/pulse-hub/view-audits')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Audits
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Loading Audit Results</h3>
              <p className="text-muted-foreground">Please wait while we load your audit data...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Audit</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load audit'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setLocation('/pulse-hub/view-audits')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Audits
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : auditResults ? (
          <div className="space-y-6">
            {/* Grade Card */}
            <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-200">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-5xl font-bold">{auditResults.grade}</h2>
                  <p className="text-yellow-600 text-xl font-semibold">{auditResults.gradeLabel}</p>
                  <p className="text-sm text-muted-foreground">Performance Level: {auditResults.performanceLevel}</p>
                </div>
                <div className="flex-1 max-w-2xl">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-yellow-500 transition-all duration-1000"
                      style={{ width: `${auditResults.grade}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-muted-foreground mt-1 flex items-center justify-end gap-1">
                    <LineChart className="w-4 h-4" /> {auditResults.change > 0 ? '+' : ''}{auditResults.change} vs Last Audit
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Executive Summary */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Executive Summary</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {auditResults.executive.summary}
                </p>
                <div className="grid md:grid-cols-4 gap-4 text-sm pt-4 border-t">
                  <div>
                    <p className="font-semibold mb-1">Top Strengths:</p>
                    <p className="text-muted-foreground">{auditResults.executive.topStrengths}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Top Gaps:</p>
                    <p className="text-muted-foreground">{auditResults.executive.topGaps}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Top Priority:</p>
                    <p className="text-muted-foreground">{auditResults.executive.topPriority}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Quick Wins:</p>
                    <p className="text-muted-foreground">{auditResults.executive.quickWins}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${hasCompetitorAnalysis ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <TabsTrigger value="findings" data-testid="tab-findings">Findings</TabsTrigger>
                <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
                <TabsTrigger value="roadmap" data-testid="tab-roadmap">30/60/90</TabsTrigger>
                {hasCompetitorAnalysis && (
                  <TabsTrigger value="competitors" data-testid="tab-competitors">Competitor Analysis</TabsTrigger>
                )}
              </TabsList>

              {/* Findings Tab */}
              <TabsContent value="findings" className="space-y-6 mt-6">
                {findings.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">No Audit Results Yet</h3>
                      <p className="text-muted-foreground mb-4">Run an audit to see detailed findings and recommendations.</p>
                      <Button onClick={() => setLocation("/pulse-hub/audit")}>Start New Audit</Button>
                    </CardContent>
                  </Card>
                ) : findings.map((section, i) => {
                  // Format category name: remove underscores and capitalize words
                  const formattedCategory = section.category
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  return (
                  <Card key={i}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" /> {formattedCategory}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">{section.score}/100</span>
                          <span
                            className={`text-sm ${
                              section.change > 0
                                ? "text-green-600"
                                : section.change < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {section.change > 0 ? `+${section.change}` : section.change}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 text-sm font-semibold border-b pb-2 text-muted-foreground">
                        <span>Finding</span>
                        <span>Why It Matters</span>
                      </div>

                      {(expanded[section.category] ? section.issues : section.issues.slice(0, 3)).map((issue, j) => (
                        <div key={j} className="grid grid-cols-2 gap-4 text-sm border-b pb-3 last:border-0">
                          <div className="flex items-start gap-2">
                            <PriorityBadge priority={issue.priority} />
                            <span>{issue.text}</span>
                          </div>
                          <span className="text-muted-foreground italic">{issue.why}</span>
                        </div>
                      ))}

                      {section.issues.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(section.category)}
                          className="w-full"
                          data-testid={`expand-${section.category}`}
                        >
                          {expanded[section.category] ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" /> Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" /> View More ({section.issues.length - 3} more)
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  );
                })}
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-xl font-semibold">Strategic Insights</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        AI-powered analysis of your audit results with actionable recommendations prioritized by impact.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Quick Wins */}
                      <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-green-900">Quick Wins (0-30 days)</h4>
                              <p className="text-xs text-green-700 mt-1">High impact, low effort improvements</p>
                            </div>
                          </div>
                          <ul className="text-sm space-y-2 mt-3">
                            {(auditResult?.summary_cards?.["Quick Wins"] || []).map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Critical Priorities */}
                      <Card className="border-yellow-200 bg-yellow-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Target className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-yellow-900">Critical Priorities</h4>
                              <p className="text-xs text-yellow-700 mt-1">Must-fix issues blocking growth</p>
                            </div>
                          </div>
                          <ul className="text-sm space-y-2 mt-3">
                            {(auditResult?.summary_cards?.["Top Priorities"] || []).map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Growth Opportunities */}
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-900">Growth Opportunities</h4>
                              <p className="text-xs text-blue-700 mt-1">Long-term strategic plays</p>
                            </div>
                          </div>
                          <ul className="text-sm space-y-2 mt-3">
                            {(auditResult?.summary_cards?.["Top Gaps"] || []).map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Innovation Plays - Top Strengths */}
                      <Card className="border-purple-200 bg-purple-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-purple-900">Innovation Plays</h4>
                              <p className="text-xs text-purple-700 mt-1">Differentiation opportunities</p>
                            </div>
                          </div>
                          <ul className="text-sm space-y-2 mt-3">
                            {(auditResult?.summary_cards?.["Top Strengths"] || []).map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 30/60/90 Roadmap Tab */}
              <TabsContent value="roadmap" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-semibold">AI-Generated Implementation Roadmap</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Based on your audit findings, here's a prioritized action plan organized by timeframe. Add items to your Eval Matrix to build your official 30/60/90 plan in Strategy Studio.
                      </p>
                      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border border-purple-200/60 rounded-lg">
                        <div className="p-1.5 rounded-md bg-purple-100 flex-shrink-0">
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed min-w-0 flex-1">
                          <strong className="text-purple-900">AI-powered suggestions</strong> — Click "+Eval" to add recommendations to your Eval Matrix and create official milestones in Stack Navigator
                        </p>
                      </div>
                    </div>

                    {actionPlan["30-day"].length === 0 && actionPlan["60-day"].length === 0 && actionPlan["90-day"].length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="mb-2 font-medium">No roadmap recommendations yet</p>
                        <p className="text-xs">Run an audit to generate a prioritized 30/60/90 action plan based on your findings.</p>
                      </div>
                    ) : (
                      <>
                        {/* 30 Days */}
                        {actionPlan["30-day"].length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                                <span className="text-base font-bold text-green-700">30</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold">First 30 Days</h4>
                                <p className="text-xs text-muted-foreground">Quick wins & immediate priorities</p>
                              </div>
                              <Badge variant="secondary" className="ml-auto">{actionPlan["30-day"].length} items</Badge>
                            </div>
                            <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
                              <CardContent className="p-4 space-y-2">
                                {actionPlan["30-day"].map((item: any, idx: number) => (
                                  <div key={idx} className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-green-100 hover:border-green-300 hover:shadow-md transition-all">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{item.task}</p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-shrink-0 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-400 font-semibold shadow-sm hover:shadow transition-all"
                                      onClick={() => handleAddToEval(item.task, '30-day', idx)}
                                      disabled={addingToEval === `30-day-${idx}`}
                                      data-testid={`btn-eval-30-${idx}`}
                                    >
                                      {addingToEval === `30-day-${idx}` ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      ) : (
                                        <Plus className="w-3 h-3 mr-1" />
                                      )}
                                      Eval
                                    </Button>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* 60 Days */}
                        {actionPlan["60-day"].length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                                <span className="text-base font-bold text-blue-700">60</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold">Days 31-60</h4>
                                <p className="text-xs text-muted-foreground">Foundation building & optimization</p>
                              </div>
                              <Badge variant="secondary" className="ml-auto">{actionPlan["60-day"].length} items</Badge>
                            </div>
                            <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
                              <CardContent className="p-4 space-y-2">
                                {actionPlan["60-day"].map((item: any, idx: number) => (
                                  <div key={idx} className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{item.task}</p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-shrink-0 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-400 font-semibold shadow-sm hover:shadow transition-all"
                                      onClick={() => handleAddToEval(item.task, '60-day', idx)}
                                      disabled={addingToEval === `60-day-${idx}`}
                                      data-testid={`btn-eval-60-${idx}`}
                                    >
                                      {addingToEval === `60-day-${idx}` ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      ) : (
                                        <Plus className="w-3 h-3 mr-1" />
                                      )}
                                      Eval
                                    </Button>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* 90 Days */}
                        {actionPlan["90-day"].length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center shadow-sm">
                                <span className="text-base font-bold text-purple-700">90</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold">Days 61-90</h4>
                                <p className="text-xs text-muted-foreground">Strategic initiatives & growth plays</p>
                              </div>
                              <Badge variant="secondary" className="ml-auto">{actionPlan["90-day"].length} items</Badge>
                            </div>
                            <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-violet-50/30">
                              <CardContent className="p-4 space-y-2">
                                {actionPlan["90-day"].map((item: any, idx: number) => (
                                  <div key={idx} className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-700">
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{item.task}</p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-shrink-0 border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 font-semibold shadow-sm hover:shadow transition-all"
                                      onClick={() => handleAddToEval(item.task, '90-day', idx)}
                                      disabled={addingToEval === `90-day-${idx}`}
                                      data-testid={`btn-eval-90-${idx}`}
                                    >
                                      {addingToEval === `90-day-${idx}` ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      ) : (
                                        <Plus className="w-3 h-3 mr-1" />
                                      )}
                                      Eval
                                    </Button>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Competitor Analysis Tab - Only show if data exists */}
              {hasCompetitorAnalysis && (
                <TabsContent value="competitors" className="mt-6 space-y-6">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Competitor Analysis
                      </h3>
                      <div className="space-y-4">
                        {competitor.gaps.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-yellow-600 mb-2">Gaps</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            {competitor.gaps.map((gap: string, i: number) => (
                              <li key={i}>{gap}</li>
                            ))}
                            </ul>
                          </div>
                        )}
                        {competitor.opportunities.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-600 mb-2">Opportunities</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            {competitor.opportunities.map((opp: string, i: number) => (
                              <li key={i}>{opp}</li>
                            ))}
                            </ul>
                          </div>
                        )}
                        {competitor.insights.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-blue-600 mb-2">Insights</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            {competitor.insights.map((ins: string, i: number) => (
                              <li key={i}>{ins}</li>
                            ))}
                            </ul>
                          </div>
                        )}
                        {competitor.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-pink-600 mb-2">Recommendations</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            {competitor.recommendations.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/pulse-hub/view-audits")}
                data-testid="button-back-to-audits"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Audits
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/pulse-hub/audit")}
                  data-testid="button-start-new"
                >
                  Start New Audit
                </Button>
                <Button variant="outline" data-testid="button-export">
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep="results"
      onStepChange={handleStepChange}
      content={content}
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="Audit Results"
    />
  );
}
