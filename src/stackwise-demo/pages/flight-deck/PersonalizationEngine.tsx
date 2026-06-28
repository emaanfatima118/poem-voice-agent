import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/stackwise-demo/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select';
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { 
  Lightbulb, 
  Users, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  Filter,
  Target,
  BarChart3,
  Calendar,
  Zap,
  Info,
  ArrowRight,
  Activity,
  Play,
  Workflow
} from 'lucide-react';

type Audience = {
  id: number;
  userId: string;
  name: string;
  description: string;
  industries: string[];
  titles: string[];
  accountSizes: string[];
  funnelStages: string[];
  engagementLevel: string;
  contentPreferences: string[];
  topTopics: string[];
  painPoints: string[];
  bestPerformingContent: string[];
  audienceSize: number;
  createdAt: Date;
  updatedAt: Date;
};

type ContentPairing = {
  id: number;
  userId: string;
  audienceId: number;
  contentTitle: string;
  contentType: string;
  contentUrl: string;
  journeyStage: string;
  relevanceScore: number;
  views: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
  status: 'active' | 'paused' | 'draft';
  createdAt: Date;
  updatedAt: Date;
};

type PersonalizationInsight = {
  id: number;
  userId: string;
  audienceId: number;
  periodStart: Date;
  periodEnd: Date;
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  engagementLift: number;
  conversionRate: number;
  topPerformingAssets: string[];
  underPerformingAssets: string[];
  recommendations: Array<{
    type: string;
    message: string;
    action: string;
  }>;
  dropOffPoints: Record<string, number>;
  createdAt: Date;
};

type PlaybookTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  triggerBehaviors: string[];
  triggerConditions: any;
  totalSteps: number;
  estimatedDuration: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type IntentTier = {
  id: string;
  templateId: string;
  tierName: string;
  tierOrder: number;
  exampleBehaviors: string[];
  nurtureFocus: string;
  tone: string;
  contentTypes: string[];
  suggestedContent: any[];
  createdAt: Date;
};

export default function PersonalizationEngine() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [selectedPairings, setSelectedPairings] = useState<number[]>([]);
  const [reviewTab, setReviewTab] = useState('insights');
  const [step1Tab, setStep1Tab] = useState('audiences');

  // Filters state
  const [industryFilter, setIndustryFilter] = useState('all');
  const [engagementFilter, setEngagementFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  // Fetch audiences
  const { data: audiences = [] } = useQuery<Audience[]>({
    queryKey: ['/api/personalization/audiences'],
  });

  // Fetch pairings for selected audience
  const { data: pairings = [] } = useQuery<ContentPairing[]>({
    queryKey: ['/api/personalization/pairings', selectedAudience?.id],
    enabled: !!selectedAudience,
  });

  // Fetch insights for selected audience
  const { data: insights } = useQuery<PersonalizationInsight[]>({
    queryKey: ['/api/personalization/insights', selectedAudience?.id],
    enabled: !!selectedAudience,
  });

  // Fetch playbook templates
  const { data: playbookTemplates = [] } = useQuery<PlaybookTemplate[]>({
    queryKey: ['/api/playbooks/templates'],
  });

  // Fetch intent tiers for playbook templates
  const { data: intentTiers = [] } = useQuery<IntentTier[]>({
    queryKey: ['/api/playbooks/intent-tiers'],
  });

  // Filter audiences
  const filteredAudiences = audiences.filter(aud => {
    if (industryFilter !== 'all' && !aud.industries.includes(industryFilter)) return false;
    if (engagementFilter !== 'all' && aud.engagementLevel !== engagementFilter) return false;
    if (stageFilter !== 'all' && !aud.funnelStages.includes(stageFilter)) return false;
    return true;
  });

  // Get unique values for filters
  const allIndustries = Array.from(new Set(audiences.flatMap(a => a.industries)));
  const allStages = Array.from(new Set(audiences.flatMap(a => a.funnelStages)));

  const steps = [
    { id: 1, label: 'Select/Build Audience', icon: Users },
    { id: 2, label: 'Pair Content', icon: FileText },
    { id: 3, label: 'Review & Improve', icon: Sparkles },
  ];

  const handleSelectAudience = (audience: Audience) => {
    setSelectedAudience(audience);
    setCurrentStep(2);
  };

  const handlePairContent = () => {
    setCurrentStep(3);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* LEFT COLUMN: Progress Steps */}
      <div className="w-72 border-r flex flex-col overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold">Personalization Engine</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered content matching for every audience
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="relative">
                  {index < steps.length - 1 && (
                    <div className={`absolute left-4 top-10 bottom-0 w-0.5 ${
                      isCompleted ? 'bg-gradient-to-b from-purple-500 to-pink-500' : 'bg-border'
                    }`} />
                  )}
                  <button
                    onClick={() => {
                      if (step.id === 1 || (step.id === 2 && selectedAudience) || (step.id === 3 && selectedPairings.length > 0)) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={step.id === 2 && !selectedAudience || step.id === 3 && selectedPairings.length === 0}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors relative ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30' 
                        : isCompleted
                        ? 'hover-elevate'
                        : 'opacity-50'
                    }`}
                    data-testid={`button-step-${step.id}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${
                          isActive ? 'text-purple-600 dark:text-purple-400' : ''
                        }`}>
                          Step {step.id}
                        </span>
                      </div>
                      <p className={`text-sm font-medium mt-0.5 ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Coaching Prompt */}
          <Card className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Coaching Tip
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {currentStep === 1 && "Start with your best-performing audience or create a new segment based on engagement patterns."}
                  {currentStep === 2 && "Match content to buyer journey stages. AI recommendations show what's working across similar audiences."}
                  {currentStep === 3 && "Review insights weekly to refine your approach. Small tweaks compound into major performance gains."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MIDDLE COLUMN: Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentStep === 1 && (
          <Tabs value={step1Tab} onValueChange={setStep1Tab} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Select or Build Your Audience</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose an existing segment, define new criteria, or use behavior-based playbooks
                  </p>
                </div>
                {step1Tab === 'audiences' && (
                  <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 hover-elevate" data-testid="button-create-audience">
                    <Users className="w-4 h-4 mr-2" />
                    Create New Audience
                  </Button>
                )}
              </div>

              <TabsList className="w-full justify-start" data-testid="tabs-step1">
                <TabsTrigger value="audiences" className="flex items-center gap-2" data-testid="tab-audiences">
                  <Users className="w-4 h-4" />
                  Audiences
                </TabsTrigger>
                <TabsTrigger value="playbooks" className="flex items-center gap-2" data-testid="tab-playbooks">
                  <Activity className="w-4 h-4" />
                  Playbooks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="audiences" className="flex-1 flex flex-col overflow-hidden mt-0">
                <div className="p-6 border-b">
                  {/* Filters */}
                  <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-48" data-testid="select-industry">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {allIndustries.map(ind => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={engagementFilter} onValueChange={setEngagementFilter}>
                  <SelectTrigger className="w-48" data-testid="select-engagement">
                    <SelectValue placeholder="Engagement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-48" data-testid="select-stage">
                    <SelectValue placeholder="Funnel Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {allStages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(industryFilter !== 'all' || engagementFilter !== 'all' || stageFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setIndustryFilter('all');
                      setEngagementFilter('all');
                      setStageFilter('all');
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredAudiences.map(audience => (
                  <Card 
                    key={audience.id} 
                    className="p-5 hover-elevate cursor-pointer"
                    onClick={() => handleSelectAudience(audience)}
                    data-testid={`card-audience-${audience.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{audience.name}</h3>
                          <Badge variant="secondary" className="text-xs" data-testid={`badge-engagement-${audience.id}`}>
                            {audience.engagementLevel} engagement
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{audience.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{audience.audienceSize.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {audience.industries.slice(0, 3).map(ind => (
                        <Badge key={ind} variant="outline" className="text-xs">
                          {ind}
                        </Badge>
                      ))}
                      {audience.funnelStages.slice(0, 2).map(stage => (
                        <Badge key={stage} variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                          {stage}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Top Topics</p>
                        <p className="text-xs font-medium">{audience.topTopics.slice(0, 2).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pain Points</p>
                        <p className="text-xs font-medium">{audience.painPoints.slice(0, 2).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Best Content</p>
                        <p className="text-xs font-medium">{audience.bestPerformingContent[0]}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
              </TabsContent>

              <TabsContent value="playbooks" className="flex-1 flex flex-col overflow-hidden mt-0">
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {playbookTemplates.map(template => {
                      const templateTiers = intentTiers.filter(tier => tier.templateId === template.id);

                      return (
                        <Card 
                          key={template.id} 
                          className="p-6 hover-elevate cursor-pointer"
                          data-testid={`card-playbook-${template.id}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <Activity className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{template.name}</h3>
                                  {template.isDefault && (
                                    <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{template.totalSteps} steps</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{template.estimatedDuration}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Target className="w-3.5 h-3.5" />
                                    <span>{templateTiers.length} intent tiers</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant="default" 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover-elevate"
                                data-testid={`button-load-playbook-${template.id}`}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Load Playbook
                              </Button>
                              <Link href="/flight-deck/collaboration-tools">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  data-testid={`button-build-play-${template.id}`}
                                >
                                  <Workflow className="w-4 h-4 mr-2" />
                                  Build a Play
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Intent Tiers Preview */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Intent Tiers</p>
                            <div className="grid grid-cols-3 gap-3">
                              {templateTiers.sort((a, b) => a.tierOrder - b.tierOrder).map(tier => (
                                <div 
                                  key={tier.id}
                                  className="p-3 rounded-lg border bg-card/50"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      tier.tierOrder === 1 ? 'bg-blue-500' :
                                      tier.tierOrder === 2 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`} />
                                    <p className="text-xs font-semibold">{tier.tierName}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">{tier.nurtureFocus}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {tier.exampleBehaviors.slice(0, 2).map((behavior, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0">
                                        {behavior}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trigger Behaviors */}
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Triggered by behaviors like:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {template.triggerBehaviors.slice(0, 3).map((behavior, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {behavior.split('_').join(' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {playbookTemplates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">No Playbooks Available</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Playbook templates help you create behavior-based nurture campaigns. Check back soon for new templates.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
        )}

        {currentStep === 2 && selectedAudience && (
          <>
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="hover:text-foreground transition-colors"
                  data-testid="button-back-to-audiences"
                >
                  Audiences
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{selectedAudience.name}</span>
              </div>
              <h2 className="text-xl font-semibold mb-1">Pair Content to Audience</h2>
              <p className="text-sm text-muted-foreground">
                Match {selectedAudience.audienceSize.toLocaleString()} contacts with personalized content
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* AI Recommendations Header */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">AI-Recommended Content</h3>
                <Badge variant="outline" className="ml-auto" data-testid="badge-total-pairings">
                  {pairings.length} matches
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pairings.map(pairing => {
                  const isSelected = selectedPairings.includes(pairing.id);

                  return (
                    <Card 
                      key={pairing.id} 
                      className={`p-5 cursor-pointer transition-all ${
                        isSelected 
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/30' 
                          : 'hover-elevate'
                      }`}
                      onClick={() => {
                        setSelectedPairings(prev => 
                          prev.includes(pairing.id)
                            ? prev.filter(id => id !== pairing.id)
                            : [...prev, pairing.id]
                        );
                      }}
                      data-testid={`card-pairing-${pairing.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          checked={isSelected}
                          className="mt-1"
                          data-testid={`checkbox-pairing-${pairing.id}`}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{pairing.contentTitle}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {pairing.contentType}
                                </Badge>
                                <span>•</span>
                                <span className="capitalize">{pairing.journeyStage}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                  {pairing.relevanceScore}%
                                </div>
                                <div className="text-xs text-muted-foreground">relevance</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Views</p>
                              <p className="font-semibold">{pairing.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                              <p className="font-semibold">{pairing.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                              <p className="font-semibold">{pairing.conversions.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">Engagement:</p>
                              <p className="font-semibold">{pairing.engagementRate}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {selectedPairings.length > 0 && (
                <div className="sticky bottom-0 pt-6">
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-semibold">
                          {selectedPairings.length} content piece{selectedPairings.length !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <Button 
                        onClick={handlePairContent}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover-elevate"
                        data-testid="button-continue-review"
                      >
                        Continue to Review
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}

        {currentStep === 3 && selectedAudience && (
          <>
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="hover:text-foreground transition-colors"
                  data-testid="button-back-to-audiences-from-review"
                >
                  Audiences
                </button>
                <ChevronRight className="w-4 h-4" />
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="hover:text-foreground transition-colors"
                  data-testid="button-back-to-pairings"
                >
                  {selectedAudience.name}
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">Review & Improve</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Tabs value={reviewTab} onValueChange={setReviewTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 mx-6">
                  <TabsTrigger value="insights" data-testid="tab-insights">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Insights
                  </TabsTrigger>
                  <TabsTrigger value="delivery" data-testid="tab-delivery">
                    <Calendar className="w-4 h-4 mr-2" />
                    Delivery
                  </TabsTrigger>
                  <TabsTrigger value="coaching" data-testid="tab-coaching">
                    <Zap className="w-4 h-4 mr-2" />
                    Live Coaching
                  </TabsTrigger>
                </TabsList>

              <TabsContent value="insights" className="mt-0 p-6 flex-1">
                {insights && insights.length > 0 ? (
                  <div className="space-y-6">
                    {/* Performance Overview */}
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Performance Overview
                      </h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                          <p className="text-2xl font-bold">{insights[0].totalViews.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
                          <p className="text-2xl font-bold">{insights[0].totalClicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                          <p className="text-2xl font-bold">{insights[0].totalConversions.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t">
                        <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {insights[0].conversionRate}%
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                            +{insights[0].engagementLift}% Engagement Lift
                          </span>
                        </div>
                        <p className="text-xs text-green-800 dark:text-green-200">
                          Compared to baseline performance
                        </p>
                      </div>
                    </Card>

                    {/* Top Performing Assets */}
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Top Performing Assets
                      </h3>
                      <div className="space-y-2">
                        {insights[0].topPerformingAssets.map((asset, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Badge variant="outline" className="shrink-0">#{idx + 1}</Badge>
                            <span className="text-sm font-medium">{asset}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* AI Recommendations */}
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        AI Recommendations
                      </h3>
                      <div className="space-y-3">
                        {insights[0].recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-950 rounded-lg">
                            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">{rec.message}</p>
                              <Badge variant="outline" className="text-xs">
                                {rec.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Insights Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Insights will appear once your personalization rules start collecting data
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="delivery" className="mt-0 p-6 flex-1">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Delivery Schedule
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure when and how personalized content is delivered to this audience
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Delivery Frequency</label>
                      <Select defaultValue="weekly">
                        <SelectTrigger data-testid="select-frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Channels</label>
                      <div className="space-y-2">
                        {['Email', 'LinkedIn', 'Slack', 'In-App'].map(channel => (
                          <div key={channel} className="flex items-center gap-2">
                            <Checkbox id={channel} defaultChecked={channel === 'Email' || channel === 'LinkedIn'} />
                            <label htmlFor={channel} className="text-sm cursor-pointer">
                              {channel}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Best Send Time</label>
                      <p className="text-sm text-muted-foreground mb-2">
                        AI Analysis: Tuesday-Thursday, 9-11 AM based on engagement patterns
                      </p>
                      <Select defaultValue="auto">
                        <SelectTrigger data-testid="select-send-time">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-optimize (AI)</SelectItem>
                          <SelectItem value="morning">Morning (9 AM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (2 PM)</SelectItem>
                          <SelectItem value="evening">Evening (6 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="coaching" className="mt-0 p-6 flex-1">
                <div className="space-y-4">
                  <Card className="p-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                    <div className="flex gap-4">
                      <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                          Quick Wins for This Audience
                        </h3>
                        <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Shift 20% of budget to interactive tools - they convert 50% higher</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Test Tuesday-Thursday 10 AM send times for optimal engagement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Create industry-specific versions of top assets for better relevance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Next Steps
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium text-muted-foreground">1.</span>
                        <span className="text-sm">Review and activate selected content pairings</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium text-muted-foreground">2.</span>
                        <span className="text-sm">Set up delivery schedule based on AI recommendations</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium text-muted-foreground">3.</span>
                        <span className="text-sm">Monitor performance for 2 weeks, then refine</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover-elevate"
                      data-testid="button-activate-personalization"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Activate Personalization
                    </Button>
                  </Card>
                </div>
              </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
