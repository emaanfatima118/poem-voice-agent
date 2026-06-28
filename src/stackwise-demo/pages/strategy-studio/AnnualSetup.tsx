import { useState } from "react";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Checkbox } from "@/stackwise-demo/components/ui/checkbox";
import { Slider } from "@/stackwise-demo/components/ui/slider";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { getModuleById } from "@/stackwise-demo/config/modules";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { Progress } from "@/stackwise-demo/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/stackwise-demo/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/stackwise-demo/components/ui/dialog";
import { goalOptions, motionOptions, recipeOptions } from "./onboardingSteps";
import { BudgetStep } from "@/stackwise-demo/components/shared/BudgetStep";
import { ChannelBudgetStep } from "@/stackwise-demo/components/shared/ChannelBudgetStep";
import { 
  CheckCircle2, 
  Circle, 
  StickyNote, 
  ChevronDown, 
  ChevronUp,
  Tag,
  Download,
  Send,
  Plus,
  Trash2,
  Target,
  X,
  Lightbulb
} from "lucide-react";

interface ReviewItem {
  id: number;
  title: string;
  source: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'complete';
  note?: string;
  carryover: boolean;
}

interface Note {
  id: number;
  content: string;
  category: 'Win' | 'Risk' | 'Lesson' | 'Idea';
  source: string;
  timestamp: string;
}

interface AnnualGoal {
  id: number;
  goalName: string;
  target: string;
  kpiMetric: string;
  unit: string;
  dataSource: string;
  status: 'on-track' | 'lagging' | 'at-risk';
}

export default function AnnualSetup() {
  const [currentStep, setCurrentStep] = useState("review-prep");
  const { toast } = useToast();

  // Review Prep state
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isItemNoteModalOpen, setIsItemNoteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Win' | 'Risk' | 'Lesson' | 'Idea'>('Win');
  const [itemNoteContent, setItemNoteContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [setupDate, setSetupDate] = useState('');

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    { id: 1, title: 'All users submitted notes/reflections', source: 'Strategy Studio', priority: 'critical', status: 'pending', carryover: false },
    { id: 2, title: 'Annual setup date scheduled and confirmed', source: 'Strategy Studio', priority: 'critical', status: 'pending', carryover: false },
    { id: 3, title: 'Received stakeholder feedback (sales, leadership)', source: 'Strategy Studio', priority: 'high', status: 'pending', carryover: false },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'Year-over-year revenue grew 23% while customer retention remained steady.', category: 'Win', source: 'PulseHub', timestamp: '1 week ago' },
    { id: 2, content: 'Brand consistency improved but requires ongoing quarterly reviews.', category: 'Lesson', source: 'BrandCraft', timestamp: '3 days ago' },
  ]);

  const [swot, setSwot] = useState({
    strengths: 'Strong revenue growth\nIncreased brand awareness',
    weaknesses: 'Limited market expansion\nInconsistent messaging in Q3',
    opportunities: 'New market segments\nPartnership opportunities',
    threats: 'Increased competition\nEconomic uncertainty'
  });

  // Foundations state (auto-populated from previous year)
  const [goals, setGoals] = useState<string[]>([
    'Grow Revenue',
    'Generate More Leads',
    'Increase Brand Awareness'
  ]);
  const [audiences, setAudiences] = useState<string[]>([
    'Marketing Directors',
    'CMOs',
    'VP of Marketing'
  ]);
  const [focusAreas, setFocusAreas] = useState<string[]>([
    'Content Marketing',
    'Demand Generation',
    'Brand Building'
  ]);

  // GTM Motions state (auto-populated from previous year)
  const [selectedMotions, setSelectedMotions] = useState<string[]>([
    'inbound_outbound',
    'demand_gen'
  ]);

  // Budget state (auto-populated from previous year)
  const [yearlyBudget, setYearlyBudget] = useState<number>(250000);
  const [budgetAllocation, setBudgetAllocation] = useState({
    contentCreation: 20,
    paidAdvertising: 25,
    seoSem: 10,
    socialMedia: 15,
    eventsSponsorships: 10,
    toolsSoftware: 10,
    creativePro: 5,
    contingency: 5,
  });
  const [channelAllocations, setChannelAllocations] = useState({
    contentCreation: { blog: 30, video: 30, whitepapersEbooks: 20, webinars: 20 },
    paidAdvertising: { googleAds: 40, linkedInAds: 30, displayAds: 20, retargeting: 10 },
    seoSem: { organicSeo: 60, paidSearch: 40 },
    socialMedia: { linkedin: 30, twitter: 25, facebook: 25, instagram: 20 },
    eventsSponsorships: { conferences: 50, webinars: 30, sponsorships: 20 },
    toolsSoftware: { marketingAutomation: 40, analytics: 30, contentTools: 20, other: 10 },
    creativePro: { design: 50, videoProduction: 30, photography: 20 },
    contingency: { buffer: 100 },
  });

  // Channels state (auto-populated from previous year)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'LinkedIn',
    'Blog / SEO',
    'Email Nurture',
  ]);
  const [customChannel, setCustomChannel] = useState<string>('');
  const [channelDetails, setChannelDetails] = useState<Record<string, any>>({
    linkedin: {
      goal: 'Thought leadership and lead generation',
      audience: 'B2B decision makers',
      contentType: 'Industry insights and company updates',
      successMetric: 'Engagement rate and leads generated'
    }
  });

  // Recipes state (auto-populated from previous year)
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([
    'exec_pov',
    'optimization',
    'advocacy_loop'
  ]);

  // Annual Goals state
  const [annualGoals, setAnnualGoals] = useState<AnnualGoal[]>([
    {
      id: 1,
      goalName: 'Revenue Growth',
      target: '+20%',
      kpiMetric: 'Pipeline Value',
      unit: '%',
      dataSource: 'HubSpot',
      status: 'on-track'
    },
    {
      id: 2,
      goalName: 'Retention & Loyalty',
      target: '+5%',
      kpiMetric: 'Renewal Rate',
      unit: '%',
      dataSource: 'CRM',
      status: 'lagging'
    },
    {
      id: 3,
      goalName: 'Brand Health',
      target: '≥90',
      kpiMetric: 'Tone Match',
      unit: 'score',
      dataSource: 'BrandCraft',
      status: 'on-track'
    },
  ]);

  const module = getModuleById('strategy-studio');
  const moduleColor = '#6218df';

  const steps = [
    { id: "review-prep", label: "Review Prep", description: "Prepare for annual review" },
    { id: "foundations", label: "Foundations", description: "Goals, audiences & focus areas" },
    { id: "annual-goals", label: "Annual Goals", description: "Define annual business goals" },
    { id: "gtm-motions", label: "GTM Motions", description: "Go-to-market strategies" },
    { id: "budget", label: "Budget", description: "Annual budget allocation" },
    { id: "channel-budget", label: "Channel Budget", description: "Distribute budget across channels" },
  ];

  const calculateReadiness = () => {
    const total = reviewItems.length;
    const completed = reviewItems.filter(item => item.status === 'complete').length;
    return Math.round((completed / total) * 100);
  };

  const cycleHealth = 82;

  const toggleItemStatus = (id: number) => {
    if (isLocked) return;
    setReviewItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          let newStatus: ReviewItem['status'];
          if (item.status === 'pending') newStatus = 'in-progress';
          else if (item.status === 'in-progress') newStatus = 'complete';
          else newStatus = 'pending';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const toggleCarryover = (id: number) => {
    if (isLocked) return;
    setReviewItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, carryover: !item.carryover } : item
      )
    );
  };

  const addNote = () => {
    const newNote: Note = {
      id: notes.length + 1,
      content: newNoteContent,
      category: newNoteCategory,
      source: 'Manual Entry',
      timestamp: 'Just now'
    };
    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setNewNoteCategory('Win');
    setIsNoteModalOpen(false);
    toast({
      title: 'Note added',
      description: 'Your note has been added to the review.',
    });
  };

  const addItemNote = () => {
    if (selectedItemId === null) return;
    setReviewItems(prev =>
      prev.map(item =>
        item.id === selectedItemId ? { ...item, note: itemNoteContent } : item
      )
    );
    setItemNoteContent('');
    setSelectedItemId(null);
    setIsItemNoteModalOpen(false);
    toast({
      title: 'Note added',
      description: 'Note has been added to the item.',
    });
  };

  const sendToReview = () => {
    setIsLocked(true);
    setCurrentStep("annual-goals");
    toast({
      title: 'Moving to Annual Setup',
      description: 'Review prep locked. Proceeding to Annual Setup.',
    });
  };

  const exportSummary = () => {
    toast({
      title: 'Export Started',
      description: 'Your summary PDF is being generated...',
    });
  };

  const addGoal = () => {
    const newGoal: AnnualGoal = {
      id: annualGoals.length + 1,
      goalName: '',
      target: '',
      kpiMetric: '',
      unit: '%',
      dataSource: '',
      status: 'on-track'
    };
    setAnnualGoals([...annualGoals, newGoal]);
  };

  const updateGoal = (id: number, field: keyof AnnualGoal, value: string) => {
    setAnnualGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const deleteGoal = (id: number) => {
    setAnnualGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const saveAnnualGoals = () => {
    toast({
      title: 'Annual Goals Saved',
      description: 'Your annual business goals have been saved successfully.',
    });
  };

  const getStatusIcon = (status: ReviewItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Circle className="h-4 w-4 text-orange-600 fill-orange-600" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: ReviewItem['priority']) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      normal: 'bg-blue-100 text-blue-700',
      low: 'bg-gray-100 text-gray-700'
    };
    return (
      <Badge variant="secondary" className={colors[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getCategoryColor = (category: Note['category']) => {
    const colors = {
      Win: 'text-green-600',
      Risk: 'text-red-600',
      Lesson: 'text-blue-700',
      Idea: 'text-purple-600'
    };
    return colors[category];
  };

  const getStatusBadge = (status: AnnualGoal['status']) => {
    const colors = {
      'on-track': 'bg-green-100 text-green-700',
      'lagging': 'bg-yellow-100 text-yellow-700',
      'at-risk': 'bg-red-100 text-red-700'
    };
    const labels = {
      'on-track': 'On Track',
      'lagging': 'Lagging',
      'at-risk': 'At Risk'
    };
    return (
      <Badge variant="secondary" className={colors[status]}>
        {labels[status]}
      </Badge>
    );
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
      case "review-prep":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold" data-testid="heading-annual-review-prep">
                    Annual Review Prep
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Confirm readiness and capture context for your Annual Setup
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportSummary}
                    data-testid="button-export"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Summary
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] text-white hover:opacity-90"
                    onClick={sendToReview}
                    disabled={isLocked}
                    data-testid="button-proceed-to-setup"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isLocked ? 'Locked' : 'Proceed to Annual Setup'}
                  </Button>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">Year Health</div>
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">
                      {cycleHealth}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">Readiness</div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl sm:text-2xl font-bold">{calculateReadiness()}%</div>
                      <Progress value={calculateReadiness()} className="flex-1 h-2" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">Date Scheduled</div>
                    <Input
                      type="date"
                      value={setupDate}
                      onChange={(e) => setSetupDate(e.target.value)}
                      disabled={isLocked}
                      className="mt-2"
                      data-testid="input-setup-date"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: SWOT + Readiness Checklist */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                {/* SWOT Block */}
                <Card>
                  <CardHeader>
                    <CardTitle>Annual SWOT Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Year-end strategic context for annual planning
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-green-700 block mb-2">Strengths</label>
                        <Textarea
                          value={swot.strengths}
                          onChange={(e) => setSwot({ ...swot, strengths: e.target.value })}
                          rows={4}
                          disabled={isLocked}
                          className="text-xs"
                          data-testid="textarea-strengths"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-red-700 block mb-2">Weaknesses</label>
                        <Textarea
                          value={swot.weaknesses}
                          onChange={(e) => setSwot({ ...swot, weaknesses: e.target.value })}
                          rows={4}
                          disabled={isLocked}
                          className="text-xs"
                          data-testid="textarea-weaknesses"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-blue-700 block mb-2">Opportunities</label>
                        <Textarea
                          value={swot.opportunities}
                          onChange={(e) => setSwot({ ...swot, opportunities: e.target.value })}
                          rows={4}
                          disabled={isLocked}
                          className="text-xs"
                          data-testid="textarea-opportunities"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-orange-700 block mb-2">Threats</label>
                        <Textarea
                          value={swot.threats}
                          onChange={(e) => setSwot({ ...swot, threats: e.target.value })}
                          rows={4}
                          disabled={isLocked}
                          className="text-xs"
                          data-testid="textarea-threats"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Readiness Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle>Annual Review Readiness Checklist</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {isLocked ? 'Checklist locked' : 'Track pending items for your annual review'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Legend */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-md border">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-muted-foreground">
                        <span className="font-semibold">Actions Legend:</span>
                        <div className="flex items-center gap-1.5">
                          <StickyNote className="h-3 w-3" />
                          <span>Add Note</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3 w-3" />
                          <span>Tag for Carryover</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Table Header - Hidden on mobile */}
                      <div className="hidden lg:grid grid-cols-12 gap-2 pb-2 border-b text-xs font-semibold text-muted-foreground">
                        <div className="col-span-1"></div>
                        <div className="col-span-5">Item</div>
                        <div className="col-span-2">Source</div>
                        <div className="col-span-2">Priority</div>
                        <div className="col-span-2">Actions</div>
                      </div>

                      {/* Table Rows */}
                      {reviewItems.map((item) => (
                        <div 
                          key={item.id}
                          className={`flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-2 p-3 rounded-md border ${
                            isLocked ? 'bg-muted/50' : 'bg-card hover-elevate'
                          }`}
                          data-testid={`review-item-${item.id}`}
                        >
                          {/* Mobile/Tablet Layout */}
                          <div className="flex lg:hidden items-start gap-3">
                            <button 
                              onClick={() => toggleItemStatus(item.id)}
                              disabled={isLocked}
                              className={`${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} flex-shrink-0 mt-0.5`}
                              data-testid={`button-toggle-${item.id}`}
                            >
                              {getStatusIcon(item.status)}
                            </button>
                            <div className="flex-1 space-y-2">
                              <div>
                                <span className={`text-sm font-medium block ${item.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
                                  {item.title}
                                </span>
                                {item.note && (
                                  <span className="text-xs text-muted-foreground italic block mt-1">
                                    Note: {item.note}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-muted-foreground">{item.source}</span>
                                <span className="text-muted-foreground">•</span>
                                {getPriorityBadge(item.priority)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItemId(item.id);
                                    setItemNoteContent(item.note || '');
                                    setIsItemNoteModalOpen(true);
                                  }}
                                  disabled={isLocked}
                                  className="h-7 px-2"
                                  data-testid={`button-add-note-${item.id}`}
                                >
                                  <StickyNote className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCarryover(item.id)}
                                  disabled={isLocked}
                                  className={`h-7 px-2 ${item.carryover ? 'bg-purple-100 text-purple-700' : ''}`}
                                  data-testid={`button-tag-carryover-${item.id}`}
                                >
                                  <Tag className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop Layout */}
                          <div className="hidden lg:contents">
                          <div className="col-span-1 flex items-center">
                            <button 
                              onClick={() => toggleItemStatus(item.id)}
                              disabled={isLocked}
                              className={isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                              data-testid={`button-toggle-${item.id}`}
                            >
                              {getStatusIcon(item.status)}
                            </button>
                          </div>
                          <div className="col-span-5 flex flex-col">
                            <span className={`text-sm font-medium ${item.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
                              {item.title}
                            </span>
                            {item.note && (
                              <span className="text-xs text-muted-foreground italic mt-1">
                                Note: {item.note}
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 flex items-center">
                            <span className="text-xs text-muted-foreground">{item.source}</span>
                          </div>
                          <div className="col-span-2 flex items-center">
                            {getPriorityBadge(item.priority)}
                          </div>
                          <div className="col-span-2 flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => {
                                setSelectedItemId(item.id);
                                setItemNoteContent(item.note || '');
                                setIsItemNoteModalOpen(true);
                              }}
                              disabled={isLocked}
                              data-testid={`button-add-note-${item.id}`}
                            >
                              <StickyNote className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 ${item.carryover ? 'text-purple-600' : ''}`}
                              onClick={() => toggleCarryover(item.id)}
                              disabled={isLocked}
                              data-testid={`button-carryover-${item.id}`}
                            >
                              <Tag className="h-3 w-3" />
                            </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isLocked && (
                      <div className="mt-4 text-xs text-muted-foreground">
                        Click status icons to update progress • Add notes for context • Tag items for carryover
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Notes & Reflections */}
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Notes & Reflections</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsNotesOpen(!isNotesOpen)}
                        data-testid="button-toggle-notes"
                      >
                        {isNotesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Year-end reflections and insights
                    </p>
                  </CardHeader>
                  {isNotesOpen && (
                    <CardContent className="space-y-3">
                      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            variant="outline" 
                            size="sm"
                            disabled={isLocked}
                            data-testid="button-add-new-note"
                          >
                            <StickyNote className="h-4 w-4 mr-1" />
                            Add New Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent data-testid="dialog-add-note">
                          <DialogHeader>
                            <DialogTitle>Add Note</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Category</label>
                              <Select value={newNoteCategory} onValueChange={(value: any) => setNewNoteCategory(value)}>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Win">Win</SelectItem>
                                  <SelectItem value="Risk">Risk</SelectItem>
                                  <SelectItem value="Lesson">Lesson</SelectItem>
                                  <SelectItem value="Idea">Idea</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Note</label>
                              <Textarea
                                placeholder="Enter your reflection..."
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                rows={4}
                                data-testid="textarea-new-note"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={addNote}
                                className="flex-1"
                                disabled={!newNoteContent.trim()}
                                data-testid="button-save-new-note"
                              >
                                Save Note
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => setIsNoteModalOpen(false)}
                                data-testid="button-cancel-new-note"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Notes List */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {notes.map((note) => (
                          <div 
                            key={note.id}
                            className="p-3 rounded-md border bg-card"
                            data-testid={`note-${note.id}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="secondary" className={getCategoryColor(note.category)}>
                                {note.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                            </div>
                            <p className="text-xs leading-relaxed">{note.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">Source: {note.source}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>

            {/* Item Note Modal */}
            <Dialog open={isItemNoteModalOpen} onOpenChange={setIsItemNoteModalOpen}>
              <DialogContent data-testid="dialog-item-note">
                <DialogHeader>
                  <DialogTitle>Add Note to Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add context or notes for this item..."
                    value={itemNoteContent}
                    onChange={(e) => setItemNoteContent(e.target.value)}
                    rows={4}
                    data-testid="textarea-item-note"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={addItemNote}
                      className="flex-1"
                      data-testid="button-save-item-note"
                    >
                      Save Note
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsItemNoteModalOpen(false);
                        setItemNoteContent('');
                        setSelectedItemId(null);
                      }}
                      data-testid="button-cancel-item-note"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "foundations":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Foundations</h2>
              <p className="text-sm text-muted-foreground">
                Update your goals, audiences, and focus areas for the new year (populated from last year)
              </p>
            </div>

            <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-[18px] h-[18px] mt-0.5" style={{ color: moduleColor }} />
                  <div className="text-sm space-y-2">
                    <p><strong>What to do:</strong> Review and update your strategic foundations based on last year's data. Add or remove goals, audiences, and focus areas as needed to reflect your evolving business priorities.</p>
                    <p><strong>Expected outcome:</strong> Refreshed foundation data that accurately represents your marketing priorities for the upcoming year, building on lessons learned from the previous year.</p>
                    <p><strong>Tip:</strong> Keep what worked well last year, refine what didn't, and add new elements to address emerging opportunities or challenges identified in your annual review.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Goals</CardTitle>
                <p className="text-sm text-muted-foreground">What are your main marketing objectives?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={goals.includes(goal)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGoals([...goals, goal]);
                          } else {
                            setGoals(goals.filter(g => g !== goal));
                          }
                        }}
                        data-testid={`checkbox-goal-${goal}`}
                      />
                      <Label htmlFor={`goal-${goal}`} className="cursor-pointer">{goal}</Label>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Label className="text-sm font-medium mb-2 block">Custom Goal</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Add custom goal..." data-testid="input-custom-goal" />
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audiences */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audiences</CardTitle>
                <p className="text-sm text-muted-foreground">Who are you marketing to?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {audiences.map((audience, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {audience}
                      <button
                        onClick={() => setAudiences(audiences.filter((_, i) => i !== idx))}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add audience segment..." data-testid="input-audience" />
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Areas</CardTitle>
                <p className="text-sm text-muted-foreground">What areas will you prioritize?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {area}
                      <button
                        onClick={() => setFocusAreas(focusAreas.filter((_, i) => i !== idx))}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add focus area..." data-testid="input-focus-area" />
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep("annual-goals")} data-testid="button-save-foundations">
                Save & Continue
              </Button>
            </div>
          </div>
        );

      case "annual-goals":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold" data-testid="heading-annual-setup">
                Annual Goals
              </h2>
              <p className="text-sm text-muted-foreground">
                Define your business goals with measurable KPIs
              </p>
            </div>

            <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-[18px] h-[18px] mt-0.5" style={{ color: moduleColor }} />
                  <div className="text-sm space-y-2">
                    <p><strong>What to do:</strong> Define specific, measurable business goals for the year. For each goal, identify the KPI metric that will track progress, set a target, and specify where the data comes from.</p>
                    <p><strong>Expected outcome:</strong> A clear set of annual business goals with trackable metrics that align with your strategic foundations and provide accountability throughout the year.</p>
                    <p><strong>Tip:</strong> Start with 3-5 key goals. More goals dilute focus—it's better to achieve excellence on a few priorities than mediocrity on many.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annual Goals Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg sm:text-xl">Annual Business Goals</CardTitle>
                  <Button size="sm" onClick={addGoal} data-testid="button-add-goal" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Table Header - Hidden on mobile */}
                  <div className="hidden lg:grid grid-cols-12 gap-2 pb-2 border-b text-xs font-semibold text-muted-foreground">
                    <div className="col-span-2">Goal Name</div>
                    <div className="col-span-2">KPI Metric</div>
                    <div className="col-span-1">Target</div>
                    <div className="col-span-1">Unit</div>
                    <div className="col-span-2">Data Source</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {/* Table Rows */}
                  {annualGoals.map((goal) => (
                    <div key={goal.id} className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-2 lg:items-center p-3 lg:p-0 border lg:border-0 rounded-lg lg:rounded-none">
                      {/* Mobile Layout */}
                      <div className="flex flex-col gap-3 lg:hidden">
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Goal Name</Label>
                          <Input
                            value={goal.goalName}
                            onChange={(e) => updateGoal(goal.id, 'goalName', e.target.value)}
                            placeholder="Goal name"
                            className="text-sm"
                            data-testid={`input-goal-name-${goal.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1 block">KPI Metric</Label>
                          <Input
                            value={goal.kpiMetric}
                            onChange={(e) => updateGoal(goal.id, 'kpiMetric', e.target.value)}
                            placeholder="KPI metric"
                            className="text-sm"
                            data-testid={`input-kpi-metric-${goal.id}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Target</Label>
                            <Input
                              value={goal.target}
                              onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
                              placeholder="Target"
                              className="text-sm"
                              data-testid={`input-target-${goal.id}`}
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Unit</Label>
                            <Select
                              value={goal.unit}
                              onValueChange={(value) => updateGoal(goal.id, 'unit', value)}
                            >
                              <SelectTrigger className="text-sm" data-testid={`select-unit-${goal.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="%">%</SelectItem>
                                <SelectItem value="$">$</SelectItem>
                                <SelectItem value="score">Score</SelectItem>
                                <SelectItem value="count">#</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Data Source</Label>
                          <Input
                            value={goal.dataSource}
                            onChange={(e) => updateGoal(goal.id, 'dataSource', e.target.value)}
                            placeholder="Data source"
                            className="text-sm"
                            data-testid={`input-data-source-${goal.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Status</Label>
                          <Select
                            value={goal.status}
                            onValueChange={(value) => updateGoal(goal.id, 'status', value as AnnualGoal['status'])}
                          >
                            <SelectTrigger className="text-sm" data-testid={`select-status-${goal.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="on-track">On Track</SelectItem>
                              <SelectItem value="lagging">Lagging</SelectItem>
                              <SelectItem value="at-risk">At Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          {getStatusBadge(goal.status)}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteGoal(goal.id)}
                            data-testid={`button-delete-goal-${goal.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:contents">
                      <div className="col-span-2">
                        <Input
                          value={goal.goalName}
                          onChange={(e) => updateGoal(goal.id, 'goalName', e.target.value)}
                          placeholder="Goal name"
                          className="text-sm"
                          data-testid={`input-goal-name-${goal.id}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={goal.kpiMetric}
                          onChange={(e) => updateGoal(goal.id, 'kpiMetric', e.target.value)}
                          placeholder="KPI metric"
                          className="text-sm"
                          data-testid={`input-kpi-metric-${goal.id}`}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          value={goal.target}
                          onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
                          placeholder="Target"
                          className="text-sm"
                          data-testid={`input-target-${goal.id}`}
                        />
                      </div>
                      <div className="col-span-1">
                        <Select
                          value={goal.unit}
                          onValueChange={(value) => updateGoal(goal.id, 'unit', value)}
                        >
                          <SelectTrigger className="text-sm" data-testid={`select-unit-${goal.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="$">$</SelectItem>
                            <SelectItem value="score">Score</SelectItem>
                            <SelectItem value="count">#</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={goal.dataSource}
                          onChange={(e) => updateGoal(goal.id, 'dataSource', e.target.value)}
                          placeholder="Data source"
                          className="text-sm"
                          data-testid={`input-data-source-${goal.id}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={goal.status}
                          onValueChange={(value) => updateGoal(goal.id, 'status', value as AnnualGoal['status'])}
                        >
                          <SelectTrigger className="text-sm" data-testid={`select-status-${goal.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on-track">On Track</SelectItem>
                            <SelectItem value="lagging">Lagging</SelectItem>
                            <SelectItem value="at-risk">At Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        {getStatusBadge(goal.status)}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteGoal(goal.id)}
                          data-testid={`button-delete-goal-${goal.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep("gtm-motions")} data-testid="button-save-annual-goals">
                Save & Continue
              </Button>
            </div>
          </div>
        );

      case "gtm-motions":
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">GTM Motions</h2>
              <p className="text-sm text-muted-foreground">
                Review and update your go-to-market strategies for the new year
              </p>
            </div>

            <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-[18px] h-[18px] mt-0.5" style={{ color: moduleColor }} />
                  <div className="text-sm space-y-2">
                    <p><strong>What to do:</strong> Review your GTM strategies from last year and select the motions you'll focus on this year. Consider which approaches delivered the best results and which need to be adjusted or replaced.</p>
                    <p><strong>Expected outcome:</strong> A refined set of GTM motions aligned with your updated goals and market conditions.</p>
                    <p><strong>Tip:</strong> Don't try to do everything—focus on 2-3 motions you can execute exceptionally well rather than spreading resources too thin.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {motionOptions.map((motion) => (
                <Card 
                  key={motion.id}
                  className={`cursor-pointer transition-all ${selectedMotions.includes(motion.id) ? 'border-2 border-purple-500 bg-purple-50' : ''}`}
                  onClick={() => {
                    if (selectedMotions.includes(motion.id)) {
                      setSelectedMotions(selectedMotions.filter(m => m !== motion.id));
                    } else {
                      setSelectedMotions([...selectedMotions, motion.id]);
                    }
                  }}
                  data-testid={`card-motion-${motion.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{motion.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{motion.description}</p>
                      </div>
                      {selectedMotions.includes(motion.id) && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep("channels")} data-testid="button-save-motions">
                Save & Continue
              </Button>
            </div>
          </div>
        );

      case "budget":
        return (
          <BudgetStep
            yearlyBudget={yearlyBudget}
            budgetAllocation={budgetAllocation}
            channelAllocations={channelAllocations}
            onYearlyBudgetChange={setYearlyBudget}
            onBudgetAllocationChange={setBudgetAllocation}
            onChannelAllocationsChange={setChannelAllocations}
            onNext={() => setCurrentStep("channel-budget")}
            onBack={() => setCurrentStep("gtm-motions")}
            title="Budget"
            description="Set your total annual marketing budget for the new year"
            coachingPrompt="Review your total marketing budget from last year and set your budget for the upcoming year. Consider business growth targets, market conditions, and lessons learned. If last year's budget was insufficient, now is the time to make the case for an increase based on performance data and growth objectives."
            moduleColor={moduleColor}
            previousBudget={250000}
          />
        );

      case "channel-budget":
        return (
          <ChannelBudgetStep
            yearlyBudget={yearlyBudget}
            budgetAllocation={budgetAllocation}
            channelAllocations={channelAllocations}
            onChannelAllocationsChange={setChannelAllocations}
            onNext={() => {
              toast({
                title: "Annual Setup Complete",
                description: "Your budget and channel allocations have been saved successfully.",
              });
              setCurrentStep("review-prep");
            }}
            onBack={() => setCurrentStep("budget")}
            showNavigation={true}
            title="Channel Budget Distribution"
            description="Distribute your category budgets across specific channels"
            coachingPrompt="Allocate budget within each category to specific channels based on performance and strategic priorities. Each category should total 100%."
            moduleColor={moduleColor}
          />
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
      moduleColor="#6218df"
      featureName="Annual Setup"
      content={
        <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b sticky top-0 z-10 bg-white">
            <QuickActions module="StrategyStudio" />
          </div>
          {renderStepContent()}
        </div>
      }
    />
  );
}
