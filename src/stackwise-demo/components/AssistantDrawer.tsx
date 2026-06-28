import { useState } from "react";
import { Link } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/stackwise-demo/components/ui/sheet";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/stackwise-demo/components/ui/tabs";
import { Card } from "@/stackwise-demo/components/ui/card";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, RefreshCw, X, BookOpen, FileText, ExternalLink } from "lucide-react";

interface AssistantInsight {
  id: string;
  title: string;
  message: string;
  type: "performance" | "suggestion" | "warning";
  confidence?: number;
  module?: string;
}

interface AssistantDrawerProps {
  context?: string;
}

export function AssistantDrawer({ context = "strategy_studio" }: AssistantDrawerProps) {
  const [open, setOpen] = useState(false);

  const mockInsights: AssistantInsight[] = [
    {
      id: "1",
      title: "Top Performing Motion",
      message: "Inbound/Outbound drove +11% engagement QoQ. Keep momentum steady.",
      type: "performance",
      confidence: 92,
      module: "PulseHub",
    },
    {
      id: "2",
      title: "Channel Dip Detected",
      message: "Email engagement dropped -9%. Consider refreshing content or cadence.",
      type: "warning",
      confidence: 84,
      module: "BrandCraft",
    },
    {
      id: "3",
      title: "Next Move",
      message: "Add Optimization Sprint to maintain consistency gains.",
      type: "suggestion",
      confidence: 88,
      module: "Strategy Studio",
    },
  ];

  const mockRecommendations = [
    {
      id: "r1",
      title: "Rerun Executive POV Sprint",
      reason: "+18% engagement last time",
      confidence: 91,
    },
    {
      id: "r2",
      title: "Add Optimization Sprint",
      reason: "Aligns with current consistency goals",
      confidence: 88,
    },
    {
      id: "r3",
      title: "Try Advocacy Loop",
      reason: "Strong fit for retention focus",
      confidence: 76,
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "suggestion":
        return <Lightbulb className="w-4 h-4 text-purple-module" />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="relative bg-gradient-purple"
          data-testid="button-assistant-toggle"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Stackwise Sage
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-module" />
              Stackwise Sage
            </SheetTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              data-testid="button-close-assistant"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Your strategic coaching companion
          </p>
        </SheetHeader>

        <Tabs defaultValue="insights" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights" data-testid="tab-insights">
              Insights
            </TabsTrigger>
            <TabsTrigger value="simulations" data-testid="tab-simulations">
              Simulations
            </TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="tab-recommendations">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Here's what's happening now
            </div>
            {mockInsights.map((insight) => (
              <Card key={insight.id} className="p-4 space-y-2" data-testid={`insight-${insight.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  {insight.confidence && (
                    <Badge variant="secondary" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{insight.message}</p>
                {insight.module && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      data-testid={`button-view-details-${insight.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      data-testid={`button-simulate-${insight.id}`}
                    >
                      Simulate Change
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="simulations" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Model "what if" scenarios
            </div>
            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-purple-module/10 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 text-purple-module" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Run a Simulation</h4>
                <p className="text-sm text-muted-foreground">
                  Test strategic changes before committing
                </p>
              </div>
              <Button className="w-full" data-testid="button-new-simulation">
                New Simulation
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Suggested next steps
            </div>
            {mockRecommendations.map((rec) => (
              <Card key={rec.id} className="p-4 space-y-3" data-testid={`recommendation-${rec.id}`}>
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {rec.confidence}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 h-8 text-xs"
                    data-testid={`button-add-to-plays-${rec.id}`}
                  >
                    Add to My Plays
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8 text-xs"
                    data-testid={`button-simulate-impact-${rec.id}`}
                  >
                    Simulate Impact
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Documentation & Learning Resources
            </div>
            
            <Link href="/resources/documentation">
              <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid="card-link-documentation">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Documentation</h4>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive guides and templates for all modules
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            </Link>

            <Link href="/resources/glossary">
              <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid="card-link-glossary">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Glossary & Definitions</h4>
                    <p className="text-xs text-muted-foreground">
                      Key terms and framework concepts
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            </Link>

            <Card className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold mb-1 text-indigo-900 dark:text-indigo-200">Budget Management Flow</h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Budget is set in <strong>Strategy Studio</strong> during onboarding, 
                    reviewed quarterly, and managed in <strong>Flight Deck</strong> for execution.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Your workspace shows strategic focus. Consider expanding channel mix next quarter.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
