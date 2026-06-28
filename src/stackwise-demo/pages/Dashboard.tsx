import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Progress } from "@/stackwise-demo/components/ui/progress";
import { NavBar } from "@/stackwise-demo/components/NavBar";
import { AssistantDrawer } from "@/stackwise-demo/components/AssistantDrawer";
import { QuarterlyCountdown } from "@/stackwise-demo/components/QuarterlyCountdown";
import type { CampaignRecipe, StrategySnapshot, Milestone } from "@shared/schema";
import {
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Plus,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { data: recipes, isLoading: recipesLoading } = useQuery<CampaignRecipe[]>({
    queryKey: ["/api/campaign-recipes"],
  });

  const { data: latestStrategy, isLoading: strategyLoading } = useQuery<StrategySnapshot>({
    queryKey: ["/api/strategy-snapshots/latest"],
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"],
  });

  const activeRecipes = recipes?.filter(r => r.status === "active") || [];

  const insights = [
    {
      type: "win",
      message: "LinkedIn engagement up 14% QoQ",
      metric: "+14%",
    },
    {
      type: "watchout",
      message: "Email open rate dropped 9%",
      metric: "-9%",
    },
    {
      type: "next",
      message: "Consider adding Optimization Sprint",
      metric: null,
    },
  ];

  const isLoading = recipesLoading || strategyLoading || milestonesLoading;

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your strategy dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const modules = [
    {
      name: "Pulse Hub",
      description: "Performance metrics and analytics",
      path: "/pulse-hub",
      gradient: "gradient-blue",
      icon: BarChart3,
      stats: "+12% engagement this quarter",
    },
    {
      name: "Brand Craft",
      description: "Content creation and brand voice",
      path: "/brand-craft",
      gradient: "gradient-magenta",
      icon: Lightbulb,
      stats: "83% tone consistency",
    },
    {
      name: "Flight Deck",
      description: "Campaign planning and execution",
      path: "/flight-deck",
      gradient: "gradient-purple",
      icon: Target,
      stats: "2 campaigns active",
    },
  ];

  const getPerformanceBadge = (tag: string | null) => {
    switch (tag) {
      case "high_performing":
        return <Badge className="bg-green-600 text-white">High Performing</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return null;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "win":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "watchout":
        return <TrendingUp className="w-5 h-5 text-amber-600" />;
      case "next":
        return <Sparkles className="w-5 h-5 text-purple-module" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Strategy Dashboard</h1>
            <p className="text-muted-foreground">
              Q1 2025 • Your strategic command center
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/strategy-studio/quarterly-review">
              <Button variant="outline" data-testid="button-quarterly-review">
                <Calendar className="w-4 h-4 mr-2" />
                Quarterly Review
              </Button>
            </Link>
            <AssistantDrawer />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quarterly Countdown */}
            <Card className="p-6">
              <QuarterlyCountdown daysRemaining={37} />
            </Card>

            {/* Insights */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quarterly Insights</h2>
                <Button variant="ghost" size="sm" data-testid="button-view-all-insights">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover-elevate"
                    data-testid={`insight-${insight.type}-${index}`}
                  >
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <p className="text-sm">{insight.message}</p>
                    </div>
                    {insight.metric && (
                      <span className="text-sm font-medium">{insight.metric}</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* My Playbook */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Playbook</h2>
                <Link href="/playbook">
                  <Button variant="ghost" size="sm" data-testid="button-manage-playbook">
                    Manage
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {activeRecipes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-4">No active recipes yet</p>
                    <Link href="/strategy-studio/onboarding">
                      <Button variant="outline" size="sm">
                        Complete Onboarding
                      </Button>
                    </Link>
                  </div>
                )}
                {activeRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="p-4 border border-border rounded-lg hover-elevate"
                    data-testid={`recipe-${recipe.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium mb-1">{recipe.name}</h3>
                        {recipe.performanceTag && getPerformanceBadge(recipe.performanceTag)}
                      </div>
                      <Badge variant={recipe.status === "active" ? "default" : "secondary"}>
                        {recipe.status}
                      </Badge>
                    </div>
                    {recipe.lastRun && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last run: {new Date(recipe.lastRun).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid="button-add-recipe"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recipe to Playbook
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/evaluation-matrix">
                <Card className="p-6 hover-elevate cursor-pointer">
                  <Target className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Evaluation Matrix</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Prioritize and route milestones strategically
                  </p>
                  <Button variant="ghost" size="sm" className="p-0" data-testid="button-open-matrix">
                    Open Matrix <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Card>
              </Link>
              <Link href="/milestones">
                <Card className="p-6 hover-elevate cursor-pointer">
                  <Calendar className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">30/60/90 Milestones</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    View and manage your milestone timeline
                  </p>
                  <Button variant="ghost" size="sm" className="p-0" data-testid="button-open-milestones">
                    Open Milestones <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Card>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Quick Links */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Modules</h2>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <Link key={index} href={module.path}>
                    <div
                      className="p-4 rounded-lg border border-border hover-elevate cursor-pointer"
                      data-testid={`module-${module.name.toLowerCase().replace(/ /g, "-")}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 bg-${module.gradient} rounded-lg flex items-center justify-center`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{module.name}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {module.description}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {module.stats}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Strategy Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Strategy Summary</h2>
              {latestStrategy ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Primary Goals:</span>
                    <p className="font-medium">
                      {(latestStrategy.foundations as any)?.goals?.join(", ") || "Not set"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">GTM Motions:</span>
                    <p className="font-medium">
                      {(latestStrategy.gtmMotions as any)?.length || 0} active
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Channels:</span>
                    <p className="font-medium">
                      {(latestStrategy.channels as any)?.length || 0} channels
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">
                      {latestStrategy.budget
                        ? `$${latestStrategy.budget.toLocaleString()}/quarter`
                        : "Not set"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="mb-4">No strategy defined yet</p>
                  <Link href="/strategy-studio/onboarding">
                    <Button variant="outline" size="sm" data-testid="button-start-onboarding">
                      Start Onboarding
                    </Button>
                  </Link>
                </div>
              )}
              <Link href="/strategy-studio">
                <Button variant="outline" size="sm" className="w-full mt-4" data-testid="button-edit-strategy">
                  Edit Strategy
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
