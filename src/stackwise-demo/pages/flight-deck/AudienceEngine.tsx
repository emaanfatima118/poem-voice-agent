import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Label } from '@/stackwise-demo/components/ui/label';
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox';
import { Progress } from '@/stackwise-demo/components/ui/progress';
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout';
import { QuickActions } from '@/stackwise-demo/components/QuickActions';
import { getModuleById } from '@/stackwise-demo/config/modules';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  Target, 
  FileText,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  BarChart3,
  Play,
  Send
} from 'lucide-react';

const FLIGHT_DECK_COLOR = '#1e40f2';

const steps = [
  { id: 'build-audience', label: 'Build or Select Audience', description: 'Filter and segment' },
  { id: 'match-content', label: 'Match Content & Assets', description: 'Auto-match high performers' },
  { id: 'output-path', label: 'Choose Output Path', description: 'Campaign or Play activation' },
];

// Mock data for Smart Segment Suggestions
const smartSegments = [
  {
    id: 'high-intent-tech',
    name: 'High-Intent Tech Leaders',
    description: 'VPs/Directors in Technology with recent engagement',
    audienceSize: 1247,
    engagementLevel: 'high',
    matchScore: 94,
    topTopics: ['AI/ML', 'Cloud Infrastructure', 'DevOps'],
  },
  {
    id: 'expanding-accounts',
    name: 'Expanding Accounts',
    description: 'Existing customers showing expansion signals',
    audienceSize: 423,
    engagementLevel: 'medium',
    matchScore: 87,
    topTopics: ['Product Features', 'Enterprise Scale', 'Integration'],
  },
  {
    id: 'competitive-switch',
    name: 'Competitive Switch Candidates',
    description: 'Using competitor products, high pain signals',
    audienceSize: 856,
    engagementLevel: 'high',
    matchScore: 82,
    topTopics: ['Cost Optimization', 'Better Support', 'Easier Setup'],
  },
  {
    id: 'dormant-reactivation',
    name: 'Dormant Account Reactivation',
    description: 'Previously active accounts showing reduced activity',
    audienceSize: 612,
    engagementLevel: 'low',
    matchScore: 78,
    topTopics: ['Win-Back', 'Product Updates', 'Success Stories'],
  },
];


// Mock content with relevance scores
const contentLibrary = [
  {
    id: 'content-1',
    title: 'The Future of AI-Powered Marketing Automation',
    type: 'Whitepaper',
    funnelStage: 'awareness',
    relevanceScore: 92,
    performance: { views: 2840, clicks: 412, conversions: 48 },
    topics: ['AI/ML', 'Automation', 'Marketing Tech'],
  },
  {
    id: 'content-2',
    title: 'Case Study: Enterprise Cloud Migration Success',
    type: 'Case Study',
    funnelStage: 'consideration',
    relevanceScore: 88,
    performance: { views: 1920, clicks: 298, conversions: 62 },
    topics: ['Cloud Infrastructure', 'Enterprise Scale', 'Migration'],
  },
  {
    id: 'content-3',
    title: 'ROI Calculator: Marketing Automation Platform',
    type: 'Interactive Tool',
    funnelStage: 'decision',
    relevanceScore: 85,
    performance: { views: 1450, clicks: 356, conversions: 89 },
    topics: ['Cost Optimization', 'ROI', 'Product Value'],
  },
];

// Mock plays/playbooks
const availablePlays = [
  {
    id: 'play-1',
    name: 'Executive POV Sprint',
    category: 'Awareness',
    steps: 5,
    estimatedDuration: '2 weeks',
    description: 'Thought leadership content from executives',
  },
  {
    id: 'play-2',
    name: 'Nurture Sequence',
    category: 'Engagement',
    steps: 7,
    estimatedDuration: '4 weeks',
    description: 'Multi-touch educational campaign',
  },
  {
    id: 'play-3',
    name: 'Expansion Play',
    category: 'Retention',
    steps: 4,
    estimatedDuration: '3 weeks',
    description: 'Upsell and cross-sell to existing customers',
  },
];

export default function AudienceEngine() {
  const module = getModuleById('flight-deck');
  const [currentStep, setCurrentStep] = useState('build-audience');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Step 1: Audience filters
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSmartSegment, setSelectedSmartSegment] = useState<string | null>(null);

  // Step 2: Content selection
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  // Step 3: Output path
  const [outputPath, setOutputPath] = useState<'campaign' | 'play' | null>(null);
  const [selectedPlay, setSelectedPlay] = useState<string | null>(null);

  // Mock tier check - in real app, this would come from user/subscription data
  const isFullyStacked = true; // Change to false to see upgrade prompts

  const industries = ['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail'];
  const roles = ['VP', 'Director', 'Manager', 'Individual Contributor'];
  const sizes = ['Enterprise (1000+)', 'Mid-Market (100-999)', 'SMB (1-99)'];
  const funnelStages = ['Awareness', 'Consideration', 'Decision', 'Retention'];

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    handleStepComplete(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    if (!isFullyStacked) {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Fully Stacked Required</CardTitle>
              </div>
              <CardDescription>
                The Audience Engine is available exclusively for Fully Stacked users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Unlock automated segmentation, tailored content delivery, and intelligent audience matching to maximize campaign effectiveness.
              </p>
              <Button className="w-full" data-testid="button-upgrade">
                Upgrade to Fully Stacked
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (currentStep) {
      case 'build-audience':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Build or Select Audience</h2>
                <p className="text-muted-foreground">
                  Filter by role, industry, size, and funnel stage, or choose a Smart Segment Suggestion.
                </p>
              </div>
              <Button 
                className="flex items-center gap-2"
                data-testid="button-create-audience"
                onClick={() => {
                  // In real app, this would open a modal or navigate to audience creation page
                  console.log('Create new audience clicked');
                }}
              >
                <Users className="w-4 h-4" />
                Create New Audience
              </Button>
            </div>

            {/* Smart Segment Suggestions - 2 across */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                  <CardTitle className="text-base">Smart Segment Suggestions</CardTitle>
                </div>
                <CardDescription>AI-driven high-value audience segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {smartSegments.map((segment) => (
                    <div
                      key={segment.id}
                      className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                        selectedSmartSegment === segment.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-gray-800 hover-elevate'
                      }`}
                      onClick={() => setSelectedSmartSegment(segment.id)}
                      data-testid={`smart-segment-${segment.id}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm flex-1">{segment.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {segment.matchScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{segment.description}</p>
                      <div className="flex items-center gap-3 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {segment.audienceSize.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {segment.engagementLevel}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {segment.topTopics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Build List - Manual Filters with CRM Mapping */}
            <Card>
                <CardHeader>
                  <CardTitle className="text-base">Build List</CardTitle>
                  <CardDescription>Filter manually & map to CRM</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* CRM Mapping Notice */}
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <Lightbulb className="w-3 h-3 inline mr-1" />
                      Map these filters to your CRM fields for precise targeting
                    </p>
                  </div>

                  {/* Industry Filter */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Industry (CRM Field: industry)</Label>
                    <div className="space-y-2">
                      {industries.map((industry) => (
                        <div key={industry} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedIndustries.includes(industry)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIndustries([...selectedIndustries, industry]);
                              } else {
                                setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
                              }
                            }}
                            data-testid={`checkbox-industry-${industry}`}
                          />
                          <span className="text-sm">{industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Role/Level (CRM Field: title_level)</Label>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <div key={role} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedRoles.includes(role)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRoles([...selectedRoles, role]);
                              } else {
                                setSelectedRoles(selectedRoles.filter(r => r !== role));
                              }
                            }}
                            data-testid={`checkbox-role-${role}`}
                          />
                          <span className="text-sm">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Size Filter */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Company Size (CRM Field: company_size)</Label>
                    <div className="space-y-2">
                      {sizes.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSizes([...selectedSizes, size]);
                              } else {
                                setSelectedSizes(selectedSizes.filter(s => s !== size));
                              }
                            }}
                            data-testid={`checkbox-size-${size}`}
                          />
                          <span className="text-sm">{size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Funnel Stage Filter */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Funnel Stage (CRM Field: lifecycle_stage)</Label>
                    <div className="space-y-2">
                      {funnelStages.map((stage) => (
                        <div key={stage} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedStages.includes(stage)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStages([...selectedStages, stage]);
                              } else {
                                setSelectedStages(selectedStages.filter(s => s !== stage));
                              }
                            }}
                            data-testid={`checkbox-stage-${stage}`}
                          />
                          <span className="text-sm">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleNext} data-testid="button-next-step">
                Next: Match Content
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'match-content':
        const selectedSegment = smartSegments.find(s => s.id === selectedSmartSegment);
        
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Match Content & Assets</h2>
              <p className="text-muted-foreground">
                Auto-matched high-performing content tailored to your selected audience.
              </p>
            </div>

            {/* Selected Audience Summary */}
            {selectedSegment && (
              <Card className="border-2" style={{ borderColor: FLIGHT_DECK_COLOR }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                    <CardTitle className="text-sm">Selected Audience</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{selectedSegment.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedSegment.audienceSize.toLocaleString()} contacts</p>
                    </div>
                    <Badge variant="secondary">
                      {selectedSegment.engagementLevel} engagement
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended (LEFT) and Choose (RIGHT) Content */}
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT: Recommended Content */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                    <CardTitle className="text-base">Recommended</CardTitle>
                  </div>
                  <CardDescription>AI-matched to your audience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {contentLibrary.map((content) => (
                    <div
                      key={content.id}
                      className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                        selectedContent.includes(content.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-gray-800 hover-elevate'
                      }`}
                      onClick={() => {
                        if (selectedContent.includes(content.id)) {
                          setSelectedContent(selectedContent.filter(c => c !== content.id));
                        } else {
                          setSelectedContent([...selectedContent, content.id]);
                        }
                      }}
                      data-testid={`content-${content.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Checkbox
                              checked={selectedContent.includes(content.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedContent([...selectedContent, content.id]);
                                } else {
                                  setSelectedContent(selectedContent.filter(c => c !== content.id));
                                }
                              }}
                            />
                            <h3 className="font-semibold text-sm">{content.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 ml-6">
                            <Badge variant="outline" className="text-xs">{content.type}</Badge>
                            <Badge variant="secondary" className="text-xs capitalize">{content.funnelStage}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold">{content.relevanceScore}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-6">
                        <span>{content.performance.views} views</span>
                        <span>{content.performance.clicks} clicks</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* RIGHT: Choose Content (Fully Stacked Only) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                    <CardTitle className="text-base">Choose</CardTitle>
                  </div>
                  <CardDescription>Filter & select manually</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isFullyStacked && (
                    <div className="p-4 rounded-md bg-muted text-center">
                      <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Available for Fully Stacked users
                      </p>
                    </div>
                  )}
                  
                  {isFullyStacked && (
                    <>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm mb-2 block">Content Type</Label>
                          <div className="flex flex-wrap gap-2">
                            {['Whitepaper', 'Case Study', 'Interactive Tool', 'Blog Post', 'Video'].map((type) => (
                              <Badge key={type} variant="outline" className="cursor-pointer hover-elevate">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Funnel Stage</Label>
                          <div className="flex flex-wrap gap-2">
                            {['Awareness', 'Consideration', 'Decision', 'Retention'].map((stage) => (
                              <Badge key={stage} variant="outline" className="cursor-pointer hover-elevate capitalize">
                                {stage}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Performance</Label>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="cursor-pointer hover-elevate">Top 10%</Badge>
                            <Badge variant="outline" className="cursor-pointer hover-elevate">High Engagement</Badge>
                            <Badge variant="outline" className="cursor-pointer hover-elevate">Recent</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-3">All Content (filtered view):</p>
                        <div className="space-y-2 max-h-[350px] overflow-y-auto">
                          {contentLibrary.map((content) => (
                            <div
                              key={content.id}
                              className={`p-2 rounded-md border cursor-pointer transition-all text-xs ${
                                selectedContent.includes(content.id)
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                  : 'border-gray-200 dark:border-gray-800 hover-elevate'
                              }`}
                              onClick={() => {
                                if (selectedContent.includes(content.id)) {
                                  setSelectedContent(selectedContent.filter(c => c !== content.id));
                                } else {
                                  setSelectedContent([...selectedContent, content.id]);
                                }
                              }}
                            >
                              <div className="font-medium">{content.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{content.type}</Badge>
                                <span className="text-muted-foreground">{content.relevanceScore}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handlePrev} data-testid="button-prev-step">
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={selectedContent.length === 0}
                data-testid="button-next-step"
              >
                Next: Choose Output
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'output-path':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Output Path</h2>
              <p className="text-muted-foreground">
                Push to a new campaign or activate a pre-made play with your audience and content.
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedSmartSegment 
                        ? smartSegments.find(s => s.id === selectedSmartSegment)?.name 
                        : 'Custom audience'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedContent.length} pieces</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Path Options */}
            <div className="grid grid-cols-2 gap-4">
              {/* Push to Campaign */}
              <Card
                className={`cursor-pointer transition-all ${
                  outputPath === 'campaign'
                    ? 'border-2 bg-blue-50'
                    : 'border hover-elevate'
                }`}
                style={{ borderColor: outputPath === 'campaign' ? FLIGHT_DECK_COLOR : undefined }}
                onClick={() => setOutputPath('campaign')}
                data-testid="output-campaign"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                    <CardTitle className="text-base">Push to Campaign</CardTitle>
                  </div>
                  <CardDescription>
                    Pre-fill a new campaign with audience, content, and assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Audience definition auto-populated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Recommended content and assets included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Suggested messaging angles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>CTA recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Activate a Play */}
              <Card
                className={`cursor-pointer transition-all ${
                  outputPath === 'play'
                    ? 'border-2 bg-blue-50'
                    : 'border hover-elevate'
                }`}
                style={{ borderColor: outputPath === 'play' ? FLIGHT_DECK_COLOR : undefined }}
                onClick={() => setOutputPath('play')}
                data-testid="output-play"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                    <CardTitle className="text-base">Activate a Pre-Made Play</CardTitle>
                  </div>
                  <CardDescription>
                    Launch a structured multi-step play tied to the audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Proven templates for specific goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Multi-channel, multi-step sequences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Prepared content moves to Distribute</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Auto-scheduled timing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Available Plays (if Play output selected) */}
            {outputPath === 'play' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Available Plays</CardTitle>
                  <CardDescription>Select a play to activate with your audience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availablePlays.map((play) => (
                    <div
                      key={play.id}
                      className={`p-4 rounded-md border-2 cursor-pointer transition-all ${
                        selectedPlay === play.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover-elevate'
                      }`}
                      onClick={() => setSelectedPlay(play.id)}
                      data-testid={`play-${play.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{play.name}</h3>
                            <Badge variant="secondary" className="text-xs">{play.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{play.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{play.steps} steps</span>
                            <span>•</span>
                            <span>{play.estimatedDuration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handlePrev} data-testid="button-prev-step">
                Back
              </Button>
              <Button 
                onClick={() => {
                  handleStepComplete(currentStep);
                  // In real app, this would navigate or create campaign/play
                }}
                disabled={!outputPath || (outputPath === 'play' && !selectedPlay)}
                data-testid="button-complete"
                style={{ backgroundColor: FLIGHT_DECK_COLOR }}
              >
                {outputPath === 'campaign' ? 'Create Campaign' : 'Activate Play'}
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const rightContent = (
    <div className="space-y-4">
      {/* Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Steps Completed</span>
              <span className="font-semibold">{completedSteps.length}/{steps.length}</span>
            </div>
            <Progress value={(completedSteps.length / steps.length) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
            <div>
              <CardTitle className="text-sm">Audience Engine Benefits</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Automated Segmentation</p>
            <p>Smart filters and AI-suggested segments reduce manual targeting work</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Content-Audience Alignment</p>
            <p>Relevance scoring ensures the right content reaches the right people</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Improved Performance</p>
            <p>Targeted campaigns consistently outperform generic messaging by 2-3x</p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p><strong>After Campaign:</strong> Content moves to Campaign Builder for refinement</p>
          <p><strong>After Play:</strong> Prepared content moves to Distribute for scheduling</p>
          <p><strong>Performance:</strong> Track results in Campaign Insights</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
            <QuickActions module="FlightDeck" />
          </div>
          <div className="p-8">
            {renderStepContent()}
          </div>
        </div>
      }
      moduleColor={module?.color}
      completedSteps={completedSteps}
      featureName="Audience Engine"
    />
  );
}
