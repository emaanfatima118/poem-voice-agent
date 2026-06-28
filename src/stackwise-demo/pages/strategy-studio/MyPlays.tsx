import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Label } from '@/stackwise-demo/components/ui/label';
import { Textarea } from '@/stackwise-demo/components/ui/textarea';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/stackwise-demo/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select';
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout';
import { getModuleById } from '@/stackwise-demo/config/modules';
import { recipeOptions } from './onboardingSteps';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Target,
  Lightbulb,
  Star,
  Minus,
  Search,
  X,
  Clock,
  Trophy,
  CheckCircle2,
} from 'lucide-react';

interface Play {
  id: string;
  title: string;
  description: string;
  goal: string;
  stage: string;
  pillar: string;
  persona?: string;
  effort: number;
  impact: number;
  status: 'Draft' | 'Active' | 'Accepted';
  executionStatus?: 'Inflight' | 'Grounded' | 'Planned';
  timeline?: '30-day' | '60-day' | '90-day';
  lastRun?: {
    date: string;
    engagement: number;
    conversion: number;
    roi: number;
  };
  currentRun?: {
    engagement: number;
    conversion: number;
    roi: number;
  };
}

export default function MyPlays() {
  const module = getModuleById('strategy-studio');
  const [currentStep, setCurrentStep] = useState('all-plays');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const moduleColor = '#6218df';

  // Search/Filter state
  const [searchFilters, setSearchFilters] = useState({
    status: 'all',
    effortLevel: 'all',
    impactPotential: 'all',
    stage: 'all',
    goal: 'all',
    persona: 'all',
    pillar: 'all',
  });

  // Form state for new play
  const [newPlay, setNewPlay] = useState({
    title: '',
    description: '',
    goal: '',
    stage: '',
    pillar: '',
    effort: 3,
    impact: 3,
  });

  // Recipe template selection
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const applyTemplate = (templateId: string) => {
    const template = recipeOptions.find(r => r.id === templateId);
    if (template) {
      setNewPlay({
        title: template.name,
        description: template.description,
        goal: template.category,
        stage: template.category === 'Awareness' ? 'Top' : template.category === 'Conversion' ? 'Bottom' : 'Mid',
        pillar: template.category === 'Efficiency' ? 'Content' : 'Demand',
        effort: 4,
        impact: 4,
      });
      setSelectedTemplate(templateId);
    }
  };

  // Dummy plays data
  const [plays, setPlays] = useState<Play[]>([
    {
      id: '1',
      title: 'LinkedIn Thought Leadership Series',
      description: 'Weekly executive posts showcasing industry insights and company innovations',
      goal: 'Awareness',
      stage: 'Top',
      pillar: 'Brand',
      persona: 'C-Suite',
      effort: 4,
      impact: 5,
      status: 'Active',
      lastRun: {
        date: 'Sep 2025',
        engagement: 2.4,
        conversion: 0.8,
        roi: 145,
      },
      currentRun: {
        engagement: 3.1,
        conversion: 1.2,
        roi: 187,
      },
    },
    {
      id: '2',
      title: 'Product Demo Webinar Campaign',
      description: 'Monthly webinars targeting mid-market decision makers with live product demonstrations',
      goal: 'Conversion',
      stage: 'Mid',
      pillar: 'Demand',
      persona: 'VP → EVP',
      effort: 5,
      impact: 5,
      status: 'Active',
      lastRun: {
        date: 'Aug 2025',
        engagement: 4.2,
        conversion: 3.5,
        roi: 210,
      },
      currentRun: {
        engagement: 3.8,
        conversion: 3.2,
        roi: 198,
      },
    },
    {
      id: '3',
      title: 'Customer Success Stories',
      description: 'Case study content featuring quantifiable results and customer testimonials',
      goal: 'Conversion',
      stage: 'Bottom',
      pillar: 'Content',
      persona: 'Manager → Senior Director',
      effort: 3,
      impact: 4,
      status: 'Active',
      lastRun: {
        date: 'Sep 2025',
        engagement: 3.2,
        conversion: 4.5,
        roi: 223,
      },
      currentRun: {
        engagement: 3.9,
        conversion: 5.1,
        roi: 251,
      },
    },
    {
      id: '4',
      title: 'Email Nurture Sequence',
      description: '8-part educational email series for MQLs with industry insights and best practices',
      goal: 'Engagement',
      stage: 'Mid',
      pillar: 'Demand',
      persona: 'Manager → Senior Director',
      effort: 2,
      impact: 4,
      status: 'Active',
      lastRun: {
        date: 'Oct 2025',
        engagement: 5.1,
        conversion: 2.8,
        roi: 165,
      },
      currentRun: {
        engagement: 5.4,
        conversion: 3.1,
        roi: 178,
      },
    },
    {
      id: '5',
      title: 'Paid Social Retargeting',
      description: 'LinkedIn and Meta ads targeting website visitors with personalized messaging',
      goal: 'Conversion',
      stage: 'Bottom',
      pillar: 'Demand',
      persona: 'VP → EVP',
      effort: 3,
      impact: 4,
      status: 'Draft',
    },
    {
      id: '6',
      title: 'SEO Content Hub Launch',
      description: 'Comprehensive resource center with 50+ articles targeting high-intent keywords',
      goal: 'Awareness',
      stage: 'Top',
      pillar: 'Content',
      persona: 'Entry-level → Team Lead',
      effort: 5,
      impact: 5,
      status: 'Accepted',
      executionStatus: 'Inflight',
      timeline: '30-day',
      lastRun: {
        date: 'Jul 2025',
        engagement: 6.2,
        conversion: 2.1,
        roi: 189,
      },
      currentRun: {
        engagement: 7.8,
        conversion: 2.9,
        roi: 215,
      },
    },
    {
      id: '7',
      title: 'Account-Based Marketing Pilot',
      description: 'Targeted campaigns for 20 enterprise accounts with personalized content',
      goal: 'Conversion',
      stage: 'Bottom',
      pillar: 'Demand',
      persona: 'C-Suite',
      effort: 4,
      impact: 5,
      status: 'Accepted',
      executionStatus: 'Planned',
      timeline: '60-day',
    },
    {
      id: '8',
      title: 'Customer Referral Program',
      description: 'Incentivized referral system with tiered rewards for existing customers',
      goal: 'Retention',
      stage: 'Bottom',
      pillar: 'Customer',
      persona: 'Manager → Senior Director',
      effort: 3,
      impact: 4,
      status: 'Accepted',
      executionStatus: 'Grounded',
      timeline: '90-day',
      lastRun: {
        date: 'Jun 2025',
        engagement: 4.5,
        conversion: 6.2,
        roi: 298,
      },
      currentRun: {
        engagement: 3.8,
        conversion: 4.9,
        roi: 256,
      },
    },
  ]);

  const steps = [
    { id: 'all-plays', label: 'All Plays', description: 'View all ideas' },
    { id: 'active', label: 'Active Plays', description: 'Running campaigns' },
    { id: 'accepted', label: 'Accepted', description: 'Plotted to 30/60/90' },
    { id: 'drafts', label: 'Drafts', description: 'Ideas in development' },
  ];

  const handleAddPlay = () => {
    const play: Play = {
      id: Date.now().toString(),
      title: newPlay.title,
      description: newPlay.description,
      goal: newPlay.goal,
      stage: newPlay.stage,
      pillar: newPlay.pillar,
      effort: newPlay.effort,
      impact: newPlay.impact,
      status: 'Draft',
    };

    setPlays([play, ...plays]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewPlay({
      title: '',
      description: '',
      goal: '',
      stage: '',
      pillar: '',
      effort: 3,
      impact: 3,
    });
  };

  const getPerformanceChange = (current: number, last: number) => {
    const change = ((current - last) / last) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNeutral: Math.abs(change) < 1,
    };
  };

  const renderPlayCard = (play: Play) => {
    const hasStats = play.lastRun && play.currentRun;

    return (
      <Card key={play.id} className="hover-elevate">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{play.goal}</Badge>
                <Badge variant="secondary">{play.stage}</Badge>
                <Badge variant="secondary">{play.pillar}</Badge>
                {play.impact >= 4 && play.effort <= 3 && (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <CardTitle className="text-lg" data-testid={`play-title-${play.id}`}>
                {play.title}
              </CardTitle>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge 
                variant={play.status === 'Active' ? 'default' : play.status === 'Draft' ? 'secondary' : 'outline'}
              >
                {play.status}
              </Badge>
              {play.status === 'Accepted' && play.executionStatus && (
                <Badge 
                  variant={
                    play.executionStatus === 'Inflight' ? 'default' :
                    play.executionStatus === 'Grounded' ? 'destructive' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {play.executionStatus}
                </Badge>
              )}
              {play.timeline && (
                <Badge variant="outline" className="text-xs">
                  {play.timeline}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{play.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Effort/Impact */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Effort:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-4 rounded-sm ${
                        i <= play.effort ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Impact:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-4 rounded-sm ${
                        i <= play.impact ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            {hasStats && (
              <>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">vs. {play.lastRun!.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {/* Engagement */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Engagement</div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{play.currentRun!.engagement}%</span>
                        {(() => {
                          const change = getPerformanceChange(
                            play.currentRun!.engagement,
                            play.lastRun!.engagement
                          );
                          return change.isNeutral ? (
                            <Minus className="w-3 h-3 text-gray-400" />
                          ) : change.isPositive ? (
                            <div className="flex items-center gap-0.5 text-green-600">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-xs">{change.value}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-0.5 text-red-600">
                              <TrendingDown className="w-3 h-3" />
                              <span className="text-xs">{change.value}%</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Conversion */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Conversion</div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{play.currentRun!.conversion}%</span>
                        {(() => {
                          const change = getPerformanceChange(
                            play.currentRun!.conversion,
                            play.lastRun!.conversion
                          );
                          return change.isNeutral ? (
                            <Minus className="w-3 h-3 text-gray-400" />
                          ) : change.isPositive ? (
                            <div className="flex items-center gap-0.5 text-green-600">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-xs">{change.value}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-0.5 text-red-600">
                              <TrendingDown className="w-3 h-3" />
                              <span className="text-xs">{change.value}%</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">ROI</div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{play.currentRun!.roi}%</span>
                        {(() => {
                          const change = getPerformanceChange(
                            play.currentRun!.roi,
                            play.lastRun!.roi
                          );
                          return change.isNeutral ? (
                            <Minus className="w-3 h-3 text-gray-400" />
                          ) : change.isPositive ? (
                            <div className="flex items-center gap-0.5 text-green-600">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-xs">{change.value}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-0.5 text-red-600">
                              <TrendingDown className="w-3 h-3" />
                              <span className="text-xs">{change.value}%</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="gap-1" data-testid={`button-view-${play.id}`}>
                View Details
                <ArrowRight className="w-3 h-3" />
              </Button>
              {play.status === 'Draft' && (
                <Button size="sm" data-testid={`button-activate-${play.id}`}>
                  Activate Play
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Left navigation (module nav)
  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Strategy Studio</h2>
    </div>
  );

  // Clear all filters
  const clearFilters = () => {
    setSearchFilters({
      status: 'all',
      effortLevel: 'all',
      impactPotential: 'all',
      stage: 'all',
      goal: 'all',
      persona: 'all',
      pillar: 'all',
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(searchFilters).some(v => v !== 'all');

  // Get featured plays (only for all-plays step)
  const getFeaturedPlays = () => {
    // Most recently used - plays with lastRun, sorted by date (most recent first)
    const playsWithRuns = plays.filter(p => p.lastRun);
    const recentlyUsed = [...playsWithRuns]
      .sort((a, b) => {
        const dateA = new Date(a.lastRun!.date);
        const dateB = new Date(b.lastRun!.date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 2);

    // Highest performance - plays with currentRun, sorted by ROI (highest first)
    const playsWithPerformance = plays.filter(p => p.currentRun);
    const highestPerformance = [...playsWithPerformance]
      .sort((a, b) => b.currentRun!.roi - a.currentRun!.roi)
      .slice(0, 2);

    return { recentlyUsed, highestPerformance };
  };

  // Main content based on current step
  const renderStepContent = () => {
    // First filter by step
    let filteredPlays = 
      currentStep === 'active' ? plays.filter(p => p.status === 'Active') :
      currentStep === 'accepted' ? plays.filter(p => p.status === 'Accepted') :
      currentStep === 'drafts' ? plays.filter(p => p.status === 'Draft') :
      plays;

    // Then apply search filters (only on "all-plays" step)
    if (currentStep === 'all-plays') {
      if (searchFilters.status !== 'all') {
        filteredPlays = filteredPlays.filter(p => p.status === searchFilters.status);
      }
      if (searchFilters.effortLevel !== 'all') {
        const effortRange = searchFilters.effortLevel.split('-').map(Number);
        filteredPlays = filteredPlays.filter(p => p.effort >= effortRange[0] && p.effort <= effortRange[1]);
      }
      if (searchFilters.impactPotential !== 'all') {
        const impactRange = searchFilters.impactPotential.split('-').map(Number);
        filteredPlays = filteredPlays.filter(p => p.impact >= impactRange[0] && p.impact <= impactRange[1]);
      }
      if (searchFilters.stage !== 'all') {
        filteredPlays = filteredPlays.filter(p => p.stage === searchFilters.stage);
      }
      if (searchFilters.goal !== 'all') {
        filteredPlays = filteredPlays.filter(p => p.goal === searchFilters.goal);
      }
      if (searchFilters.persona !== 'all') {
        filteredPlays = filteredPlays.filter(p => p.persona === searchFilters.persona);
      }
      if (searchFilters.pillar !== 'all') {
        filteredPlays = filteredPlays.filter(p => p.pillar === searchFilters.pillar);
      }
    }

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Plays</h1>
            <p className="text-muted-foreground">
              Your action layer — where strategy turns into execution
            </p>
          </div>

          {/* Add Play Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-play" style={{ background: moduleColor }}>
                <PlusCircle className="w-4 h-4" />
                Add Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" style={{ color: moduleColor }} />
                  Add New Play
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Recipe Templates Section */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-600" />
                        <Label className="text-sm font-semibold text-purple-900">
                          Start from a Recipe Template (Optional)
                        </Label>
                      </div>
                      <p className="text-xs text-purple-800">
                        Select a proven play template to get started, or build your own from scratch
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {recipeOptions.map((recipe) => (
                          <Card
                            key={recipe.id}
                            className={`cursor-pointer transition-all hover-elevate ${
                              selectedTemplate === recipe.id
                                ? 'border-2 border-purple-500 bg-white'
                                : 'bg-white/80'
                            }`}
                            onClick={() => applyTemplate(recipe.id)}
                            data-testid={`template-${recipe.id}`}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm">{recipe.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {recipe.category}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {recipe.description}
                                  </p>
                                </div>
                                {selectedTemplate === recipe.id && (
                                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {selectedTemplate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(null);
                            setNewPlay({
                              title: '',
                              description: '',
                              goal: '',
                              stage: '',
                              pillar: '',
                              effort: 3,
                              impact: 3,
                            });
                          }}
                          className="text-xs"
                          data-testid="button-clear-template"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear template and start from scratch
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Play Title */}
                <div className="space-y-2">
                  <Label htmlFor="play-title">Play Title *</Label>
                  <Input
                    id="play-title"
                    placeholder="e.g., LinkedIn Thought Leadership Series"
                    value={newPlay.title}
                    onChange={(e) => setNewPlay({ ...newPlay, title: e.target.value })}
                    data-testid="input-play-title"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="play-description">Description / Intent *</Label>
                  <Textarea
                    id="play-description"
                    placeholder="Describe the play's purpose and expected outcomes..."
                    value={newPlay.description}
                    onChange={(e) => setNewPlay({ ...newPlay, description: e.target.value })}
                    rows={3}
                    data-testid="textarea-play-description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="play-goal">Goal *</Label>
                    <Select value={newPlay.goal} onValueChange={(v) => setNewPlay({ ...newPlay, goal: v })}>
                      <SelectTrigger data-testid="select-play-goal">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Awareness">Awareness</SelectItem>
                        <SelectItem value="Engagement">Engagement</SelectItem>
                        <SelectItem value="Conversion">Conversion</SelectItem>
                        <SelectItem value="Retention">Retention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stage */}
                  <div className="space-y-2">
                    <Label htmlFor="play-stage">Stage *</Label>
                    <Select value={newPlay.stage} onValueChange={(v) => setNewPlay({ ...newPlay, stage: v })}>
                      <SelectTrigger data-testid="select-play-stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Top">Top of Funnel</SelectItem>
                        <SelectItem value="Mid">Mid Funnel</SelectItem>
                        <SelectItem value="Bottom">Bottom of Funnel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pillar */}
                  <div className="space-y-2">
                    <Label htmlFor="play-pillar">Pillar *</Label>
                    <Select value={newPlay.pillar} onValueChange={(v) => setNewPlay({ ...newPlay, pillar: v })}>
                      <SelectTrigger data-testid="select-play-pillar">
                        <SelectValue placeholder="Select pillar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brand">Brand</SelectItem>
                        <SelectItem value="Demand">Demand</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Effort */}
                <div className="space-y-2">
                  <Label>Effort (1 = Low, 5 = High)</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={newPlay.effort === value ? 'default' : 'outline'}
                        className="w-12 h-12"
                        onClick={() => setNewPlay({ ...newPlay, effort: value })}
                        data-testid={`button-effort-${value}`}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className="space-y-2">
                  <Label>Impact (1 = Low, 5 = High)</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={newPlay.impact === value ? 'default' : 'outline'}
                        className="w-12 h-12"
                        onClick={() => setNewPlay({ ...newPlay, impact: value })}
                        data-testid={`button-impact-${value}`}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Suggested KPIs */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900 mb-1">Suggested KPIs</p>
                        <p className="text-xs text-purple-800">
                          Based on {newPlay.goal || 'your goal'}: Engagement Rate, Click-Through Rate, Time on Page
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel-play">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPlay}
                    disabled={!newPlay.title || !newPlay.description || !newPlay.goal || !newPlay.stage || !newPlay.pillar}
                    style={{ background: moduleColor }}
                    data-testid="button-save-play"
                  >
                    Save Play
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{plays.length}</div>
              <div className="text-sm text-muted-foreground">Total Plays</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{plays.filter(p => p.status === 'Active').length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{plays.filter(p => p.status === 'Accepted').length}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{plays.filter(p => p.status === 'Draft').length}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {plays.filter(p => p.impact >= 4 && p.effort <= 3).length}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                Quick Wins
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter (only on "all-plays" step) */}
        {currentStep === 'all-plays' && (
          <Card className="bg-muted/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Find your next play from your library.</span>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1"
                    data-testid="button-clear-filters"
                  >
                    <X className="w-3 h-3" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-7 gap-3">
                {/* Status Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select
                    value={searchFilters.status}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, status: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Draft">Drafts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Effort Level Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Effort Level</Label>
                  <Select
                    value={searchFilters.effortLevel}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, effortLevel: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-effort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1-2">Low (1-2)</SelectItem>
                      <SelectItem value="3-3">Medium (3)</SelectItem>
                      <SelectItem value="4-5">High (4-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Impact Potential Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Impact Potential</Label>
                  <Select
                    value={searchFilters.impactPotential}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, impactPotential: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-impact">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1-2">Low (1-2)</SelectItem>
                      <SelectItem value="3-3">Medium (3)</SelectItem>
                      <SelectItem value="4-5">High (4-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stage Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Stage</Label>
                  <Select
                    value={searchFilters.stage}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, stage: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-stage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Top">Top of Funnel</SelectItem>
                      <SelectItem value="Mid">Mid Funnel</SelectItem>
                      <SelectItem value="Bottom">Bottom of Funnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Goal Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Goal</Label>
                  <Select
                    value={searchFilters.goal}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, goal: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-goal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Awareness">Awareness</SelectItem>
                      <SelectItem value="Engagement">Engagement</SelectItem>
                      <SelectItem value="Conversion">Conversion</SelectItem>
                      <SelectItem value="Retention">Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Persona Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Persona</Label>
                  <Select
                    value={searchFilters.persona}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, persona: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-persona">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="C-Suite">C-Suite</SelectItem>
                      <SelectItem value="VP → EVP">VP → EVP</SelectItem>
                      <SelectItem value="Manager → Senior Director">Manager → Senior Director</SelectItem>
                      <SelectItem value="Entry-level → Team Lead">Entry-level → Team Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pillar Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Pillar</Label>
                  <Select
                    value={searchFilters.pillar}
                    onValueChange={(v) => setSearchFilters({ ...searchFilters, pillar: v })}
                  >
                    <SelectTrigger className="h-9" data-testid="filter-pillar">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Brand">Brand</SelectItem>
                      <SelectItem value="Demand">Demand</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="Customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {Object.entries(searchFilters).map(([key, value]) => {
                    if (value === 'all') return null;
                    const labels: Record<string, string> = {
                      status: 'Status',
                      effortLevel: 'Effort',
                      impactPotential: 'Impact',
                      stage: 'Stage',
                      goal: 'Goal',
                      persona: 'Persona',
                      pillar: 'Pillar',
                    };
                    return (
                      <Badge key={key} variant="secondary" className="gap-1">
                        <span className="text-xs">{labels[key]}: {value}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSearchFilters({ ...searchFilters, [key]: 'all' })}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Featured Plays (only on "all-plays" step) */}
        {currentStep === 'all-plays' && (() => {
          const { recentlyUsed, highestPerformance } = getFeaturedPlays();
          return (
            <div className="grid grid-cols-2 gap-6">
              {/* Most Recently Used */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Most Recently Used</h3>
                </div>
                <div className="space-y-3">
                  {recentlyUsed.map((play) => (
                    <Card key={play.id} className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{play.goal}</Badge>
                              <Badge variant="secondary" className="text-xs">{play.pillar}</Badge>
                            </div>
                            <h4 className="font-semibold text-sm mb-1 truncate">{play.title}</h4>
                            <p className="text-xs text-muted-foreground">Last run: {play.lastRun?.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{play.currentRun?.roi}%</div>
                            <div className="text-xs text-muted-foreground">ROI</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Highest Performance */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <h3 className="text-sm font-semibold">Highest Performance</h3>
                </div>
                <div className="space-y-3">
                  {highestPerformance.map((play) => (
                    <Card key={play.id} className="hover-elevate border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{play.goal}</Badge>
                              <Badge variant="secondary" className="text-xs">{play.pillar}</Badge>
                            </div>
                            <h4 className="font-semibold text-sm mb-1 truncate">{play.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Engagement: {play.currentRun?.engagement}%</span>
                              <span>Conv: {play.currentRun?.conversion}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-yellow-600">{play.currentRun?.roi}%</div>
                            <div className="text-xs text-muted-foreground">ROI</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Plays Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredPlays.map((play) => renderPlayCard(play))}
        </div>

        {filteredPlays.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No plays found in this category</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderStepContent()}
      moduleColor={moduleColor}
      featureName="My Plays"
    />
  );
}
