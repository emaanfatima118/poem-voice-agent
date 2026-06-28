/**
 * AI-Powered Marketing Audit - Start New Audit Form
 * 
 * This page provides a form to start new marketing audits:
 * - Enter website URL to analyze
 * - Optionally name your audit
 * - Select from 9 marketing areas to analyze
 * - Audits are queued and processed in the background
 * 
 * After starting an audit:
 * - Navigate to "View Audits" to see status and monitor progress
 * - Click on completed audits to view detailed results
 * - Results include findings, insights, 30/60/90 plan, and competitor analysis
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Checkbox } from "@/stackwise-demo/components/ui/checkbox";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { useUser } from "@/stackwise-demo/contexts/UserContext";
import { Loader2 } from "lucide-react";
import {
  Globe,
  MessageSquare,
  Search,
  PenTool,
  Share2,
  Mail,
  Target,
  Users,
  BarChart3,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

type AuditTopic = {
  id: string;
  label: string;
  description: string;
  icon: any;
};

const auditTopics: AuditTopic[] = [
  {
    id: "brand-messaging",
    label: "Brand Messaging",
    description: "Logo, value proposition, visual identity consistency",
    icon: MessageSquare,
  },
  {
    id: "website-seo",
    label: "Website SEO",
    description: "Meta tags, headers, site speed, mobile optimization",
    icon: Search,
  },
  {
    id: "content-marketing",
    label: "Content Marketing",
    description: "Blog presence, content quality, strategy assessment",
    icon: PenTool,
  },
  {
    id: "social-media",
    label: "Social Media",
    description: "Platform integration, social proof, engagement",
    icon: Share2,
  },
  {
    id: "email-marketing",
    label: "Email Marketing",
    description: "Newsletter signup, capture forms, automation",
    icon: Mail,
  },
  {
    id: "paid-advertising",
    label: "Paid Advertising",
    description: "Tracking pixels, conversion setup, campaign evidence",
    icon: Target,
  },
  {
    id: "lead-generation",
    label: "Lead Generation",
    description: "Contact forms, lead magnets, conversion paths",
    icon: Users,
  },
  {
    id: "analytics-tracking",
    label: "Analytics & Tracking",
    description: "Google Analytics, goal tracking, data implementation",
    icon: BarChart3,
  },
  {
    id: "competitor-comparison",
    label: "Competitor Comparison",
    description: "Competitive landscape analysis, positioning, market gaps",
    icon: TrendingUp,
  },
];



export default function Audit() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState("start");
  const [formData, setFormData] = useState({
    websiteUrl: "",
    auditName: "",
    selectedTopics: [] as string[],
  });
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const moduleColor = "#6218df";
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  const steps = [
    { id: "start", label: "Audit", description: "Start new audit" },
    { id: "view-audits", label: "View Audits", description: "Audit history" },
  ];

  // Handle step changes with special navigation for View Audits
  const handleStepChange = (stepId: string) => {
    if (stepId === "view-audits") {
      // Navigate to View Audits page
      setLocation("/pulse-hub/view-audits");
    } else {
      setCurrentStep(stepId);
    }
  };

  const toggleTopic = (topicId: string) => {
    setFormData({
      ...formData,
      selectedTopics: formData.selectedTopics.includes(topicId)
        ? formData.selectedTopics.filter((id) => id !== topicId)
        : [...formData.selectedTopics, topicId],
    });
  };

  const selectAll = () => {
    setFormData({
      ...formData,
      selectedTopics: auditTopics.map((t) => t.id),
    });
  };

  const clearAll = () => {
    setFormData({
      ...formData,
      selectedTopics: [],
    });
  };

  const handleStartAudit = async () => {
    if (formData.selectedTopics.length === 0) {
      toast({
        title: "No topics selected",
        description: "Please select at least one topic to audit.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.websiteUrl) {
      toast({
        title: "URL required",
        description: "Please enter a website URL to audit.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to run an audit.",
        variant: "destructive"
      });
      return;
    }

    setIsRunningAudit(true);

    // Show initial toast that audit is starting
    toast({
      title: "Audit Started",
      description: "Your audit is processing. This may take a few minutes. You can check the status in View Audits.",
      duration: 5000,
    });

    try {
      // Normalize URL
      const normalizedUrl = formData.websiteUrl.startsWith("http://") || formData.websiteUrl.startsWith("https://")
        ? formData.websiteUrl
        : `https://${formData.websiteUrl}`;

      // Map topic IDs to topic labels for the API
      const selectedTopicLabels = formData.selectedTopics
        .map(topicId => auditTopics.find(t => t.id === topicId)?.label)
        .filter(Boolean);

      const requestBody = {
        url: normalizedUrl,
        audit_name: formData.auditName || undefined,
        topics: selectedTopicLabels,
        user_id: user.userid || user.id,
        debug: false,
        model: "gpt-4o"
      };

      console.log('[Audit] Starting audit with params:', requestBody);
      console.log('[Audit] Audit name from form:', formData.auditName);

      const response = await fetch('/api/pulsehub/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Audit failed' }));
        throw new Error(errorData.error || 'Audit failed');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Audit failed');
      }

      console.log('[Audit] Audit queued successfully:', data);
      
      // Reset button state immediately so user can start another audit
      setIsRunningAudit(false);
      
      // Show toast based on queue status
      const queueInfo = data.queue_position !== undefined && data.queue_position > 0
        ? ` (Queue position: ${data.queue_position})`
        : '';
      
      const statusMessage = data.status === 'processing' 
        ? 'Your audit is now processing. Go to View Audits to monitor progress.'
        : `Your audit has been queued${queueInfo}. It will start after current audits complete.`;
      
      toast({
        title: data.status === 'processing' ? "✓ Audit Processing" : "✓ Audit Queued",
        description: statusMessage,
        duration: 6000,
      });

    } catch (error: any) {
      console.error('[Audit] Error:', error);
      toast({
        title: "Audit Failed",
        description: error.message || "Failed to complete audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunningAudit(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case "start":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">AI-Powered Marketing Audit</h1>
              <p className="text-lg text-muted-foreground">
                Select from 9 marketing areas you want to analyze and get targeted insights with actionable recommendations powered by AI.
              </p>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Start Your Audit</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter your website URL and select the marketing topics you want to analyze. Our AI will provide detailed insights for your chosen areas.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Website URL */}
                <div className="space-y-2">
                  <Label htmlFor="website-url">
                    Website URL <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website-url"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="pl-10"
                      data-testid="input-website-url"
                    />
                  </div>
                </div>

                {/* Audit Name */}
                <div className="space-y-2">
                  <Label htmlFor="audit-name">Audit Name (Optional)</Label>
                  <Input
                    id="audit-name"
                    placeholder="Company Website Audit"
                    value={formData.auditName}
                    onChange={(e) => setFormData({ ...formData, auditName: e.target.value })}
                    data-testid="input-audit-name"
                  />
                </div>

                {/* Select Topics */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>
                      Select Audit Topics <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                        data-testid="button-select-all"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        data-testid="button-clear-all"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {auditTopics.map((topic) => {
                      const Icon = topic.icon;
                      const isSelected = formData.selectedTopics.includes(topic.id);
                      return (
                        <Card
                          key={topic.id}
                          className={`cursor-pointer transition-all hover-elevate ${
                            isSelected ? "border-primary border-2 bg-primary/5" : ""
                          }`}
                          onClick={() => toggleTopic(topic.id)}
                          data-testid={`topic-${topic.id}`}
                        >
                          <CardContent className="p-4 flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              className="mt-1"
                              data-testid={`checkbox-${topic.id}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <h3 className="font-semibold">{topic.label}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground">{topic.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStartAudit}
                  disabled={formData.selectedTopics.length === 0 || !formData.websiteUrl || isRunningAudit || userLoading}
                  data-testid="button-start-audit"
                >
                  {isRunningAudit ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running Audit...
                    </>
                  ) : (
                    <>Start Audit ({formData.selectedTopics.length} Topic{formData.selectedTopics.length !== 1 ? 's' : ''})</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Value Props */}
            <Card className="max-w-4xl mx-auto bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Targeted Marketing Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the specific marketing areas you want to focus on and get detailed, actionable insights tailored to your business needs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Choose your focus areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>AI-powered insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Actionable recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Detailed scoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
            <QuickActions module="PulseHub" />
          </div>
          <div className="px-8 py-6">
            {renderContent()}
          </div>
        </div>
      }
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="Marketing Audit"
    />
  );
}
