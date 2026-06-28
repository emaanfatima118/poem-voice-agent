import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card } from "@/stackwise-demo/components/ui/card";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Slider } from "@/stackwise-demo/components/ui/slider";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { StackwiseSageDrawer } from "@/stackwise-demo/components/StackwiseSageDrawer";
import { getModuleById } from "@/stackwise-demo/config/modules";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { BudgetStep } from "@/stackwise-demo/components/shared/BudgetStep";
import { ChannelBudgetStep } from "@/stackwise-demo/components/shared/ChannelBudgetStep";
import { ChannelsStep } from "@/stackwise-demo/components/shared/ChannelsStep";
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Mail,
  Linkedin,
  CheckCircle2,
  Loader2,
  DollarSign,
  Lightbulb,
  Activity,
  Brush,
  Settings,
  MessageCircle,
  BarChart3,
  Calendar,
  Zap,
} from "lucide-react";
import { Input } from "@/stackwise-demo/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";

export default function StrategyOnboarding() {
  const [, setLocation] = useLocation();
  
  // Check URL parameters for initial step (client-side only)
  const getInitialStep = () => {
    if (typeof window === 'undefined') return 'orientation';
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('step') || 'orientation';
  };
  
  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessGoals: [
      { goalName: "", target: "" },
      { goalName: "", target: "" },
      { goalName: "", target: "" },
    ],
    goals: [] as string[],
    customGoal: "",
    audiences: [] as string[],
    audienceLevels: [] as string[],
    brandIntent: "",
    yearlyBudget: 0,
    budgetAllocation: {
      contentCreation: 25,
      paidAdvertising: 20,
      seoSem: 15,
      socialMedia: 12,
      eventsSponsorships: 10,
      toolsSoftware: 8,
      creativePro: 7,
      contingency: 3,
    },
    channelAllocations: {
      contentCreation: { blog: 40, video: 30, whitepapersEbooks: 20, webinars: 10 },
      paidAdvertising: { googleAds: 35, linkedInAds: 30, displayAds: 20, retargeting: 15 },
      seoSem: { organicSeo: 60, paidSearch: 40 },
      socialMedia: { linkedin: 40, twitter: 25, facebook: 20, instagram: 15 },
      eventsSponsorships: { conferences: 50, webinars: 30, sponsorships: 20 },
      toolsSoftware: { marketingAutomation: 40, analytics: 30, contentTools: 20, other: 10 },
      creativePro: { design: 50, videoProduction: 30, photography: 20 },
      contingency: { buffer: 100 },
    },
    gtmMotions: [] as string[],
    customGtmMotion: "",
    gtmOutcomes: {} as Record<string, string>,
    selectedOutcomes: [] as string[],
    kpis: {
      engagementScore: true,
      ctr: true,
      contentCompletionRate: true,
    },
    channels: [] as string[],
    customChannel: "",
    channelDetails: {} as Record<string, {
      goal: string;
      audience: string;
      contentType: string;
      successMetric: string;
    }>,
    selectedRecipes: [] as string[],
  });

  const module = getModuleById('strategy-studio');
  const moduleColor = '#6218df';

  const steps = [
    { id: "orientation", label: "Orientation", description: "Welcome tour" },
    { id: "integrate-tools", label: "Integrate Tools", description: "Connect your stack" },
    { id: "foundations", label: "Foundations", description: "Goals & audiences" },
    { id: "gtm-motions", label: "GTM Motions", description: "Go-to-market approach" },
    { id: "budget", label: "Budget", description: "Resource planning" },
    { id: "channel-budget", label: "Channel Budget", description: "Distribute budget across channels" },
    { id: "finalize", label: "Finalize", description: "Review & launch" },
  ];

  const goalOptions = [
    "Grow pipeline",
    "Increase engagement",
    "Launch a new campaign",
    "Improve conversion rates",
    "Build brand awareness",
    "Expand into new markets",
    "Demand Generation",
    "Content Marketing",
    "Brand Visibility",
    "Conversion Optimization",
    "Customer Retention",
    "Product Marketing",
    "ABM (Account-Based Marketing)",
    "Thought Leadership",
  ];

  const audienceLevelOptions = [
    "C-Suite",
    "VP → EVP",
    "Manager → Senior Director",
    "Entry-level → Team Lead",
  ];

  const motionOptions = [
    {
      id: "abm",
      name: "Account-Based Marketing (ABM)",
      exampleOutcome: "Engage 15 Tier-1 accounts or Increase ICP conversion by 20%",
    },
    {
      id: "demand_gen",
      name: "Demand Generation",
      exampleOutcome: "Generate 500 MQLs per quarter",
    },
    {
      id: "plg",
      name: "Product-Led Growth (PLG)",
      exampleOutcome: "Grow free-to-paid conversions by 15%",
    },
    {
      id: "partner_channel",
      name: "Partner / Channel-Driven",
      exampleOutcome: "Establish 10 strategic partnerships",
    },
    {
      id: "thought_leadership",
      name: "Thought Leadership",
      exampleOutcome: "Drive +25% increase in branded search volume",
    },
    {
      id: "community_led",
      name: "Community-Led",
      exampleOutcome: "Grow community to 5,000+ active members",
    },
    {
      id: "content_led",
      name: "Content-Led",
      exampleOutcome: "Publish 50+ high-quality pieces per quarter",
    },
    {
      id: "retention_expansion",
      name: "Retention / Expansion",
      exampleOutcome: "Increase NRR by 15%",
    },
    {
      id: "event_driven",
      name: "Event-Driven",
      exampleOutcome: "Host 4 major events with 200+ attendees each",
    },
    {
      id: "brand_led",
      name: "Brand-Led",
      exampleOutcome: "Increase brand awareness by 30%",
    },
  ];

  const suggestedOutcomes = [
    "Generate more qualified leads",
    "Increase engagement with ideal personas",
    "Strengthen pipeline conversion rate",
  ];

  const channelOptions = [
    "LinkedIn",
    "Paid Search",
    "Organic Search (SEO)",
    "Email",
    "Website / Blog",
    "Events / Webinars",
    "PR / Media",
    "Influencer / Creator Partnerships",
    "Community Platforms (Slack, Reddit, Discord)",
    "Video / YouTube",
    "Podcasts",
    "Paid Social (Meta, TikTok, Reddit Ads, etc.)",
  ];

  const suggestedChannelSetup = [
    {
      name: "LinkedIn",
      focus: "Awareness + Engagement",
      description: "Thought leadership, company POV posts",
    },
    {
      name: "Email",
      focus: "Nurture + Conversion",
      description: "3-part drip sequence aligned to your goals",
    },
    {
      name: "Website / Blog",
      focus: "Visibility + SEO",
      description: "Update core message, optimize landing page",
    },
  ];

  const recipeOptions = [
    {
      id: "awareness_reboot",
      name: "Awareness Reboot",
      tagline: "Rebuild awareness and relevance.",
      description: "Reintroduce your brand or message to your audience through thought leadership, storytelling, and visibility campaigns.",
      includes: ["3-post POV series", "1 paid awareness campaign", "Refreshed hero landing page"],
      bestFor: "Brand or positioning updates, launches, or visibility dips.",
      category: "Awareness",
      icon: "💡",
    },
    {
      id: "customer_proof",
      name: "Customer Proof Sprint",
      tagline: "Turn trust into traction.",
      description: "Spotlight your customer successes through proof-based storytelling.",
      includes: ["2 short-form video testimonials", "1 written case study", "Social snippets for reuse across channels"],
      bestFor: "Nurturing warm leads or re-engaging inactive prospects.",
      category: "Conversion",
      icon: "🎯",
    },
    {
      id: "pipeline_pulse",
      name: "Pipeline Pulse",
      tagline: "Reignite momentum in your funnel.",
      description: "Bring stalled or quiet opportunities back into motion with targeted, contextual outreach.",
      includes: ["3-step re-engagement email series", "1 retargeting ad set", "Live or on-demand webinar invite"],
      bestFor: "Mid-funnel engagement and sales collaboration.",
      category: "Conversion",
      icon: "🎯",
    },
    {
      id: "content_momentum",
      name: "Content Momentum Builder",
      tagline: "Maximize the value of what you've already created.",
      description: "Repurpose top-performing content across multiple formats and channels.",
      includes: ["1 flagship asset → 3 derivative pieces", "1 quarterly content audit checklist"],
      bestFor: "Maintaining consistency and extending reach with minimal lift.",
      category: "Growth",
      icon: "🪜",
    },
    {
      id: "abm_acceleration",
      name: "ABM Acceleration Loop",
      tagline: "Bring focus to high-value accounts.",
      description: "Unify marketing and sales motions for priority targets.",
      includes: ["Account segmentation and scoring template", "1 executive POV email", "1 personalized landing page", "1 multi-channel nurture sequence"],
      bestFor: "Account-based or sales-assisted motions where focus beats volume.",
      category: "ABM",
      icon: "🤝",
    },
    {
      id: "launch_amplifier",
      name: "Launch Amplifier",
      tagline: "Make your next launch impossible to miss.",
      description: "Coordinate messaging, creative, and timing across paid, organic, and owned channels.",
      includes: ["Pre-launch teaser plan", "Launch-day social blitz", "Email announcement", "Performance dashboard setup"],
      bestFor: "Product updates, campaign launches, or major announcements.",
      category: "Awareness",
      icon: "💡",
    },
    {
      id: "brand_refresh",
      name: "Brand Refresh Mini",
      tagline: "Reintroduce your story with confidence.",
      description: "Bring creative consistency and clarity back to your brand narrative.",
      includes: ["1 brand narrative rewrite", "Updated tone-of-voice guide", "3 creative templates (social, web, or video)"],
      bestFor: "Repositioning or scaling brands adding new lines, regions, or personas.",
      category: "Growth",
      icon: "🪜",
    },
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const markStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handleNext = () => {
    markStepComplete();
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      setLocation("/strategy-studio");
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Left navigation
  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Strategy Studio</h2>
    </div>
  );

  // Main content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "foundations":
        return (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Step 2 — Strategic Foundations</h2>
              <p className="text-muted-foreground">
                Define your core direction.
              </p>
            </div>

            {/* Coaching Prompt */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-900">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  <strong>Coaching Prompt:</strong> Be clear, not perfect. You'll revisit this every quarter.
                </p>
              </CardContent>
            </Card>

            {/* Business Goals (Annual) */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Define Your Business Goals</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Set 3 measurable business goals to track progress throughout the year (e.g., Revenue Growth: $500K)
                </p>
              </div>
              
              {formData.businessGoals.map((goal, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`goal-name-${index}`}>
                      Goal {index + 1} Name
                    </Label>
                    <Input
                      id={`goal-name-${index}`}
                      placeholder="e.g., Revenue Growth"
                      value={goal.goalName}
                      onChange={(e) => {
                        const newGoals = [...formData.businessGoals];
                        newGoals[index].goalName = e.target.value;
                        setFormData({ ...formData, businessGoals: newGoals });
                      }}
                      data-testid={`input-business-goal-name-${index}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`goal-target-${index}`}>
                      Target
                    </Label>
                    <Input
                      id={`goal-target-${index}`}
                      placeholder="e.g., $500K or +20%"
                      value={goal.target}
                      onChange={(e) => {
                        const newGoals = [...formData.businessGoals];
                        newGoals[index].target = e.target.value;
                        setFormData({ ...formData, businessGoals: newGoals });
                      }}
                      data-testid={`input-business-goal-target-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Question 1: Top 3 Goals */}
            <div className="space-y-4">
              <Label>What are your top 3 goals for the next 90 days?</Label>
              <p className="text-xs text-muted-foreground -mt-2">
                e.g., grow pipeline, increase engagement, launch a new campaign
              </p>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <Button
                    key={goal}
                    variant={formData.goals.includes(goal) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        goals: toggleArrayItem(formData.goals, goal),
                      })
                    }
                    disabled={formData.goals.length >= 3 && !formData.goals.includes(goal)}
                    data-testid={`goal-${goal.toLowerCase().replace(/ /g, "-").replace(/\(/g, "").replace(/\)/g, "")}`}
                  >
                    {formData.goals.includes(goal) && (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    {goal}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="custom-goal">Or add your own goal:</Label>
                <Textarea
                  id="custom-goal"
                  placeholder="Describe a custom goal..."
                  value={formData.customGoal}
                  onChange={(e) =>
                    setFormData({ ...formData, customGoal: e.target.value })
                  }
                  rows={2}
                  data-testid="input-custom-goal"
                />
              </div>
            </div>

            {/* Question 2: Primary Audience */}
            <div className="space-y-4">
              <Label>Who is your primary audience or persona?</Label>
              <p className="text-xs text-muted-foreground -mt-2">
                e.g., mid-market IT leaders, sustainability officers, creative agencies
              </p>
              <Textarea
                placeholder="Describe your primary audience..."
                value={formData.audiences[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    audiences: e.target.value ? [e.target.value] : [],
                  })
                }
                rows={2}
                data-testid="input-audience"
              />
              
              <Label className="mt-4">What level are they at?</Label>
              <div className="grid grid-cols-2 gap-3">
                {audienceLevelOptions.map((level) => (
                  <Button
                    key={level}
                    variant={formData.audienceLevels.includes(level) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        audienceLevels: toggleArrayItem(formData.audienceLevels, level),
                      })
                    }
                    data-testid={`level-${level.toLowerCase().replace(/\s+/g, "-").replace(/→/g, "to")}`}
                  >
                    {formData.audienceLevels.includes(level) && (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Question 3: Brand Intent */}
            <div className="space-y-2">
              <Label htmlFor="brand-intent">
                What's your brand intent in this phase?
              </Label>
              <p className="text-xs text-muted-foreground">
                e.g., establish credibility, reposition narrative, accelerate acquisition
              </p>
              <Textarea
                id="brand-intent"
                placeholder="Describe your brand intent..."
                value={formData.brandIntent}
                onChange={(e) =>
                  setFormData({ ...formData, brandIntent: e.target.value })
                }
                rows={3}
                data-testid="input-brand-intent"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={true}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.brandIntent.trim()}
                data-testid="button-next"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "gtm-motions":
        return (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Step 3 — GTM Motions</h2>
              <p className="text-muted-foreground mb-1">
                Align plays with outcomes.
              </p>
              <p className="text-sm text-muted-foreground">
                Choose the go-to-market motions that best fit how you operate today. You can start small and refine over time — Strategy Studio will adapt as your experience and data grow.
              </p>
            </div>

            {/* Coaching Prompt */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-900">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  <strong>Coaching Prompt:</strong> Think of motions as rhythms — they define how your brand shows up and how your team moves. Start simple, stay flexible, and let experience refine the rest.
                </p>
              </CardContent>
            </Card>

            {/* Primary GTM Motions */}
            <div className="space-y-4">
              <div>
                <Label>Primary GTM Motions (choose up to 3)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Select the motions that describe how your brand brings work to market. (You can also add your own.)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {motionOptions.map((motion) => (
                  <Button
                    key={motion.id}
                    variant={formData.gtmMotions.includes(motion.id) ? "default" : "outline"}
                    className="justify-start h-auto py-3"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        gtmMotions: toggleArrayItem(formData.gtmMotions, motion.id),
                      })
                    }
                    disabled={formData.gtmMotions.length >= 3 && !formData.gtmMotions.includes(motion.id)}
                    data-testid={`motion-${motion.id}`}
                  >
                    {formData.gtmMotions.includes(motion.id) && (
                      <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-left">{motion.name}</span>
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-motion">Add your own →</Label>
                <Textarea
                  id="custom-motion"
                  placeholder="Describe your custom GTM motion..."
                  value={formData.customGtmMotion}
                  onChange={(e) =>
                    setFormData({ ...formData, customGtmMotion: e.target.value })
                  }
                  rows={2}
                  data-testid="input-custom-motion"
                />
              </div>
            </div>

            {/* Desired Outcomes for Selected Motions */}
            {formData.gtmMotions.length > 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Desired Outcomes (linked to your selected GTM Motions)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Define what success looks like for each motion. Examples shown by default — editable at any time.
                  </p>
                </div>

                {formData.gtmMotions.map((motionId) => {
                  const motion = motionOptions.find(m => m.id === motionId);
                  if (!motion) return null;

                  return (
                    <div key={motionId} className="space-y-2">
                      <Label htmlFor={`outcome-${motionId}`} className="text-sm font-medium">
                        {motion.name}
                      </Label>
                      <Textarea
                        id={`outcome-${motionId}`}
                        placeholder={motion.exampleOutcome}
                        value={formData.gtmOutcomes[motionId] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gtmOutcomes: { ...formData.gtmOutcomes, [motionId]: e.target.value },
                          })
                        }
                        rows={2}
                        data-testid={`outcome-${motionId}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Suggested Outcomes for Getting Started */}
            <div className="space-y-4">
              <div>
                <Label>If you're just getting started, choose up to three suggested outcomes:</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Give your strategy direction (you can edit or replace these later as your feedback loop builds)
                </p>
              </div>

              <div className="space-y-2">
                {suggestedOutcomes.map((outcome) => (
                  <Button
                    key={outcome}
                    variant={formData.selectedOutcomes.includes(outcome) ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        selectedOutcomes: toggleArrayItem(formData.selectedOutcomes, outcome),
                      })
                    }
                    disabled={formData.selectedOutcomes.length >= 3 && !formData.selectedOutcomes.includes(outcome)}
                    data-testid={`suggested-outcome-${outcome.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {formData.selectedOutcomes.includes(outcome) && (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    {outcome}
                  </Button>
                ))}
              </div>
            </div>

            {/* Default KPI Suggestions */}
            <div className="space-y-4">
              <div>
                <Label>Default KPI Suggestions (editable)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Each KPI field starts prefilled but can be manually adjusted or replaced. Pulse Hub data will later refine these metrics based on your live performance.
                </p>
              </div>

              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">Engagement Score</h4>
                      <p className="text-xs text-muted-foreground">
                        Measures overall interaction and resonance
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">Enabled</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">Click-Through Rate (CTR)</h4>
                      <p className="text-xs text-muted-foreground">
                        Tracks how often audiences take action after seeing your content
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">Enabled</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">Content Completion Rate</h4>
                      <p className="text-xs text-muted-foreground">
                        Shows how much of your material is actually consumed
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">Enabled</div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                data-testid="button-next"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "budget":
        return (
          <BudgetStep
            yearlyBudget={formData.yearlyBudget}
            budgetAllocation={formData.budgetAllocation}
            channelAllocations={formData.channelAllocations}
            onYearlyBudgetChange={(value) => setFormData({ ...formData, yearlyBudget: value })}
            onBudgetAllocationChange={(value) => setFormData({ ...formData, budgetAllocation: value })}
            onChannelAllocationsChange={(value) => setFormData({ ...formData, channelAllocations: value })}
            onNext={handleNext}
            onBack={handleBack}
            showNavigation={true}
            title="Step 4 — Budget & Resource Planning"
            description="Build a budget that flexes with your strategy."
            coachingPrompt="Budgets don't predict performance — they make decisions visible. Let Flight Deck flag the risks before they become problems."
            moduleColor={moduleColor}
          />
        );

      case "channel-budget":
        return (
          <ChannelBudgetStep
            yearlyBudget={formData.yearlyBudget}
            budgetAllocation={formData.budgetAllocation}
            channelAllocations={formData.channelAllocations}
            onChannelAllocationsChange={(value) => setFormData({ ...formData, channelAllocations: value })}
            onNext={handleNext}
            onBack={handleBack}
            showNavigation={true}
            title="Step 5 — Channel Budget Distribution"
            description="Distribute your category budgets across specific channels"
            coachingPrompt="Allocate budget within each category to specific channels based on performance and strategic priorities. Each category should total 100%."
            moduleColor={moduleColor}
          />
        );

      case "orientation":
        return (
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-3" style={{ color: moduleColor }}>
                Welcome to Stackwise Strategy Studio
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your AI-powered marketing intelligence platform for strategic planning, performance monitoring, and campaign execution
              </p>
            </div>

            {/* 4 Modules Overview */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Four Integrated Modules</h3>
              <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                <Card className="border-2 hover-elevate transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6218df] via-[#c009ba] to-[#1e40f2] flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg" style={{ color: '#6218df' }}>Strategy Studio</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Free central hub for quarterly strategy planning, Eval Matrix prioritization, and 30/60/90 execution milestones
                    </p>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover-elevate transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6218df] to-[#4a0fb8] flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg" style={{ color: '#6218df' }}>Pulse Hub</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Premium performance analytics, GTM modeling, competitive intelligence, and leadership reporting
                    </p>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover-elevate transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c009ba] to-[#900890] flex items-center justify-center">
                        <Brush className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg" style={{ color: '#c009ba' }}>Brand Craft</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Premium AI-driven content generation, brand voice consistency, and multi-format optimization
                    </p>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover-elevate transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e40f2] to-[#1530c0] flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg" style={{ color: '#1e40f2' }}>Flight Deck</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Premium campaign planning, budget tracking, asset management, and multi-channel execution
                    </p>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Navigation Pattern + Quick Actions */}
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base">How Navigation Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-700">1</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Left Navigation:</strong> Select a module (Strategy Studio, Pulse Hub, etc.)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-700">2</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Modules:</strong> Select a feature (e.g., Audit, Content Creation, etc.)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-700">3</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Features:</strong> Work through the guided steps of your workspace
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions & Launches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Quick Actions (Overview page):</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Analyze Framework</Badge>
                      <Badge variant="outline" className="text-xs">Optimize Step</Badge>
                      <Badge variant="outline" className="text-xs">Noodling...</Badge>
                      <Badge variant="outline" className="text-xs">📋 My Plays</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Launch Icons:</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link href="/strategy-studio">
                        <div className="flex items-center gap-2 p-2 rounded border hover-elevate cursor-pointer transition-all">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6218df] via-[#c009ba] to-[#1e40f2] flex items-center justify-center">
                            <Lightbulb className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium">Strategy Studio</span>
                        </div>
                      </Link>
                      <Link href="/pulse-hub">
                        <div className="flex items-center gap-2 p-2 rounded border hover-elevate cursor-pointer transition-all">
                          <div className="w-6 h-6 rounded bg-[#6218df] flex items-center justify-center">
                            <Activity className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium">Pulse Hub</span>
                        </div>
                      </Link>
                      <Link href="/brand-craft">
                        <div className="flex items-center gap-2 p-2 rounded border hover-elevate cursor-pointer transition-all">
                          <div className="w-6 h-6 rounded bg-[#c009ba] flex items-center justify-center">
                            <Brush className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium">Brand Craft</span>
                        </div>
                      </Link>
                      <Link href="/flight-deck">
                        <div className="flex items-center gap-2 p-2 rounded border hover-elevate cursor-pointer transition-all">
                          <div className="w-6 h-6 rounded bg-[#1e40f2] flex items-center justify-center">
                            <Settings className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium">Flight Deck</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Plays and Stacks Info */}
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    Understanding My Plays & Stacks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <h4 className="font-semibold text-sm mb-2 text-purple-900">📋 My Plays</h4>
                      <p className="text-xs text-gray-700 mb-2">
                        Your strategic idea inbox - capture recommendations before evaluating them
                      </p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>• <strong>Sources:</strong> GTM Test Pit, Competitor Analysis, Reports, Manual</p>
                        <p>• <strong>Workflow:</strong> My Plays → +Eval → Prioritize → 30/60/90</p>
                        <p>• <strong>Access:</strong> Quick Action or Stack Navigator</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <h4 className="font-semibold text-sm mb-2 text-purple-900">🎯 Stacks</h4>
                      <p className="text-xs text-gray-700 mb-2">
                        Themed collections of plays organized around strategic initiatives
                      </p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>• <strong>Purpose:</strong> Group related plays into campaigns</p>
                        <p>• <strong>Examples:</strong> "Q1 ABM Push", "Product Launch Stack"</p>
                        <p>• <strong>Benefit:</strong> See how plays work together strategically</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                    <p className="text-xs text-purple-900">
                      <strong>💡 Key Insight:</strong> My Plays is your capture tool - it's where AI recommendations land before you decide which ones make it to your Eval Matrix for prioritization. Stacks help you organize multiple plays into cohesive strategic themes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Framework + Stackwise Sage */}
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Your Strategic Framework
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-700" />
                      </div>
                      <h4 className="font-semibold text-sm">Eval Matrix</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      2×2 grid prioritizing plays by priority × risk. Helps you focus on high-impact, low-risk wins
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-700" />
                      </div>
                      <h4 className="font-semibold text-sm">30/60/90 Milestones</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Track execution across 3 time horizons. Shared between Strategy Studio and Pulse Hub
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-700" />
                      </div>
                      <h4 className="font-semibold text-sm">Quarterly Rhythm</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auto-scheduled quarterly reviews keep your strategy fresh and aligned with market reality
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Meet Stackwise Sage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Your AI strategic advisor, available throughout the platform with a persistent chat interface
                  </p>
                  <div className="bg-white border border-purple-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-900 mb-2">Sample Questions:</p>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>• "How should I prioritize this play?"</li>
                      <li>• "What's my pipeline velocity trend?"</li>
                      <li>• "Suggest content for this campaign"</li>
                    </ul>
                  </div>
                  <div className="flex flex-col items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <Zap className="w-4 h-4" />
                      <span className="font-semibold">Try it now:</span>
                    </div>
                    <StackwiseSageDrawer module="Strategy" />
                    <p className="text-xs text-purple-700 italic text-center">
                      Context-aware across all modules — always accessible from the top nav bar
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] hover:opacity-90 text-white px-12 py-6 text-lg"
                onClick={() => {
                  // Mark orientation as completed in localStorage
                  localStorage.setItem('orientationCompleted', 'true');
                  // Proceed to next step
                  handleNext();
                }}
                data-testid="button-start-strategy"
              >
                Start Your Strategy
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                You can revisit this tour anytime from the Resources section
              </p>
            </div>
          </div>
        );

      case "integrate-tools":
        return (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Step 1 — Integrate Tools</h2>
              <p className="text-muted-foreground mb-1">
                Connect your marketing stack to Stackwise.
              </p>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon. You'll be able to integrate your existing marketing tools and platforms to create a unified command center.
              </p>
            </div>

            {/* Placeholder Card */}
            <Card className="bg-muted/30">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" style={{ color: moduleColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tool Integration Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Soon you'll be able to connect platforms like HubSpot, Salesforce, Google Analytics, Mailchimp, and more to centralize your marketing data and workflows.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto">
                  <div className="p-3 bg-background rounded-md border">
                    <p className="text-xs font-medium">CRM</p>
                    <p className="text-xs text-muted-foreground">HubSpot, Salesforce</p>
                  </div>
                  <div className="p-3 bg-background rounded-md border">
                    <p className="text-xs font-medium">Analytics</p>
                    <p className="text-xs text-muted-foreground">Google Analytics, Mixpanel</p>
                  </div>
                  <div className="p-3 bg-background rounded-md border">
                    <p className="text-xs font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">Mailchimp, SendGrid</p>
                  </div>
                  <div className="p-3 bg-background rounded-md border">
                    <p className="text-xs font-medium">Social</p>
                    <p className="text-xs text-muted-foreground">LinkedIn, Twitter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                data-testid="button-next"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "finalize":
        return (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Step 7 — Finalize & Save</h2>
              <p className="text-muted-foreground mb-1">
                Confirm, connect, and activate your foundation.
              </p>
              <p className="text-sm text-muted-foreground">
                This is where everything you've built comes together — goals, GTM motions, channels, and plays — forming the base for your next 90 days. Strategy Studio saves your setup, syncs across all modules, and captures a snapshot you can revisit at any time.
              </p>
            </div>

            {/* Coaching Prompt */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-900">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  <strong>Coaching Prompt:</strong> Strategy isn't a one-and-done. Every plan changes, evolves, and sharpens with time. The key is not perfection — it's momentum. You've built your base. Now, keep it in motion.
                </p>
              </CardContent>
            </Card>

            {/* Summary Section */}
            <div className="space-y-4">
              <Label className="text-base">Finalize Setup</Label>
              <p className="text-xs text-muted-foreground">
                Before saving, review your summary. Each element can be edited in-line before final confirmation.
              </p>

              {/* Goals & Focus Areas */}
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">Goals & Focus Areas</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentStep("foundations")}
                    data-testid="edit-goals"
                  >
                    Edit
                  </Button>
                </div>
                {formData.goals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.goals.map((goal) => (
                      <Badge key={goal} variant="secondary">{goal}</Badge>
                    ))}
                    {formData.customGoal && (
                      <Badge variant="secondary">{formData.customGoal}</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No goals selected</p>
                )}
              </Card>

              {/* Annual Budget */}
              {formData.yearlyBudget > 0 && (
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium">Annual Marketing Budget</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentStep("foundations")}
                      data-testid="edit-budget"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">${formData.yearlyBudget.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">per year</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { key: "paidAds", label: "Paid Ads" },
                        { key: "contentProduction", label: "Content" },
                        { key: "events", label: "Events" },
                        { key: "tools", label: "Tools" },
                        { key: "pr", label: "PR" },
                        { key: "design", label: "Design" },
                        { key: "agency", label: "Agency" },
                        { key: "freelancers", label: "Freelancers" },
                      ].map(({ key, label }) => {
                        const percentage = formData.budgetAllocation[key as keyof typeof formData.budgetAllocation];
                        if (!percentage) return null;
                        return (
                          <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )}

              {/* Selected GTM Motions */}
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">Selected GTM Motions</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentStep("gtm-motions")}
                    data-testid="edit-motions"
                  >
                    Edit
                  </Button>
                </div>
                {formData.gtmMotions.length > 0 ? (
                  <div className="space-y-2">
                    {formData.gtmMotions.map((motionId) => {
                      const motion = motionOptions.find(m => m.id === motionId);
                      return (
                        <div key={motionId} className="text-sm">
                          <span className="font-medium">{motion?.name}</span>
                          {formData.gtmOutcomes[motionId] && (
                            <p className="text-xs text-muted-foreground mt-1">
                              → {formData.gtmOutcomes[motionId]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {formData.customGtmMotion && (
                      <div className="text-sm">
                        <span className="font-medium">Custom: {formData.customGtmMotion}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No GTM motions selected</p>
                )}
              </Card>

              {/* Primary Channels & KPIs */}
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">Primary Channels & KPIs</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentStep("channels")}
                    data-testid="edit-channels"
                  >
                    Edit
                  </Button>
                </div>
                {formData.channels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.channels.map((channel) => (
                      <Badge key={channel} variant="secondary">{channel}</Badge>
                    ))}
                    {formData.customChannel && (
                      <Badge variant="secondary">{formData.customChannel}</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No channels selected</p>
                )}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium mb-2">Default KPIs:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Engagement Score</Badge>
                    <Badge variant="outline" className="text-xs">Click-Through Rate</Badge>
                    <Badge variant="outline" className="text-xs">Content Completion Rate</Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* System Behavior on Save */}
            <div className="space-y-3">
              <Label className="text-base">System Behavior on Save</Label>
              <p className="text-xs text-muted-foreground mb-3">
                Once you click Finalize Setup:
              </p>

              <Card className="p-4 bg-muted/30">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Syncs Across Modules</h4>
                    <p className="text-xs text-muted-foreground">
                      Strategy data connects instantly to Pulse Hub, BrandCraft, and Flight Deck. GTM motions and KPIs become filters for tracking and reporting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Creates Your First Snapshot</h4>
                    <p className="text-xs text-muted-foreground">
                      Baseline recorded for performance comparison next quarter. Accessible anytime from Stack Navigator → Strategy Snapshots.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Activates Background Coaching</h4>
                    <p className="text-xs text-muted-foreground">
                      Stackwise Sage begins tracking progress and surfacing insights. Relevant plays and next-step prompts appear contextually across modules.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Auto-Save + Versioning</h4>
                    <p className="text-xs text-muted-foreground">
                      Auto-save runs every 3 minutes (timestamped). Full restore window: 30 days from archive or deletion.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  markStepComplete();
                  setIsFinalizing(true);
                  
                  // Show success toast
                  toast({
                    title: "✅ Your strategy has been saved and synced across Stackwise.",
                    description: "Stackwise Sage is now active — insights will update as data syncs.",
                    action: (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation("/strategy-studio")}
                      >
                        View in Strategy Studio
                      </Button>
                    ),
                  });

                  // Auto-redirect after 2 seconds
                  setTimeout(() => {
                    setLocation("/strategy-studio");
                  }, 2000);
                }}
                disabled={isFinalizing}
                data-testid="button-finalize"
                style={{ background: `linear-gradient(135deg, ${moduleColor}, #c009ba)`, color: 'white' }}
              >
                {isFinalizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Populating your Strategy Studio workspace...
                  </>
                ) : (
                  "Finalize Setup"
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={
        <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b sticky top-0 z-10 bg-white">
            <QuickActions module="StrategyStudio" />
          </div>
          {renderStepContent()}
        </div>
      }
      moduleColor={moduleColor}
      completedSteps={completedSteps}
      featureName="5-Step Onboarding"
    />
  );
}
