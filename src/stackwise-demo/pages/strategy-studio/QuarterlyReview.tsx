import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Slider } from "@/stackwise-demo/components/ui/slider";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { getModuleById } from "@/stackwise-demo/config/modules";
import { TrendingUp, TrendingDown, Sparkles, CheckCircle2, Calendar, DollarSign, Lightbulb, AlertCircle, Download, Plus, Target, StickyNote, ChevronDown, ChevronUp, Tag, Send, Circle } from "lucide-react";
import { Progress } from "@/stackwise-demo/components/ui/progress";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/stackwise-demo/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/stackwise-demo/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/stackwise-demo/components/ui/tabs";

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

export default function QuarterlyReview() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState("review-prep");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // Review Prep state
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isItemNoteModalOpen, setIsItemNoteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Win' | 'Risk' | 'Lesson' | 'Idea'>('Win');
  const [itemNoteContent, setItemNoteContent] = useState('');
  const [isReviewPrepLocked, setIsReviewPrepLocked] = useState(false);
  const [reviewDate, setReviewDate] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    { id: 1, title: 'Monthly budget update completed', source: 'Strategy Studio', priority: 'critical', status: 'pending', carryover: false },
    { id: 2, title: 'All users have added notes/reflections', source: 'Strategy Studio', priority: 'critical', status: 'pending', carryover: false },
    { id: 3, title: 'No outstanding budget requests', source: 'Strategy Studio', priority: 'high', status: 'pending', carryover: false },
    { id: 4, title: 'Review date scheduled and confirmed', source: 'Strategy Studio', priority: 'critical', status: 'pending', carryover: false },
    { id: 5, title: 'Received stakeholder feedback (sales, leadership)', source: 'Strategy Studio', priority: 'high', status: 'pending', carryover: false },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'Social engagement rose 12% while retention programs slowed.', category: 'Lesson', source: 'PulseHub', timestamp: '2 days ago' },
    { id: 2, content: 'Exec POV adoption is increasing but needs consistency.', category: 'Risk', source: 'Strategy Studio', timestamp: '1 day ago' },
    { id: 3, content: 'LinkedIn content performance exceeded targets by 18%.', category: 'Win', source: 'BrandCraft', timestamp: '3 days ago' },
  ]);

  const [swot, setSwot] = useState({
    strengths: 'High exec POV engagement\nStrong content cadence',
    weaknesses: 'Retention lag\nLimited refresh cycles',
    opportunities: 'LinkedIn growth\nExpansion into owned media',
    threats: 'Rising paid cost\nCompetitor POV series'
  });

  const [formData, setFormData] = useState({
    wins: [] as string[],
    misses: [] as string[],
    nextMoves: [] as string[],
    goalsUpdate: "",
    monthlyBudget: 41667, // Previous monthly budget (from master budget)
    newMonthlyBudget: 41667, // New monthly budget going forward (autopopulated from master)
    previousQuarterSpend: 125000, // Previous quarter total spend
    budgetAllocations: {
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
  });

  // Modal and form states
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isNextMoveModalOpen, setIsNextMoveModalOpen] = useState(false);
  const [selectedWinId, setSelectedWinId] = useState<string | null>(null);
  const [selectedNextMoveId, setSelectedNextMoveId] = useState<string | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [nextMoveMilestone, setNextMoveMilestone] = useState("");
  const [winPrompts, setWinPrompts] = useState<{[key: string]: {worked: string, why: string, continue: string, dependencies: string}}>({});
  const [missPrompts, setMissPrompts] = useState<{[key: string]: {didntWork: string, why: string, critical: string, action: string, resources: string, differently: string}}>({});
  const [budgetTab, setBudgetTab] = useState("review");
  const [cycleTab, setCycleTab] = useState("exec-summary");

  // Next Moves 4-column panel state
  const [nextMovesPanel, setNextMovesPanel] = useState({
    start: [
      "Implement ABM playbook for top 10 accounts",
      "Launch new thought leadership series",
      "Start weekly competitive intelligence digest"
    ],
    stop: [
      "Low-engagement event sponsorships",
      "Manual social media posting",
      "Unfocused content topics"
    ],
    continue: [
      "Executive POV publishing strategy",
      "High-performing LinkedIn ads campaign",
      "Monthly customer case study production"
    ],
    explore: [
      "Podcast or video series pilot",
      "Partner co-marketing opportunities",
      "Intent-based display advertising"
    ]
  });
  const [newItemInput, setNewItemInput] = useState({ start: "", stop: "", continue: "", explore: "" });

  const module = getModuleById('strategy-studio');
  const moduleColor = '#6218df';

  const steps = [
    { id: "review-prep", label: "Review Prep", description: "Prepare for review" },
    { id: "cycle-overview", label: "Cycle Overview", description: "Review performance" },
    { id: "quarterly-goals", label: "Quarterly Goals", description: "Set goals for quarter" },
    { id: "budget", label: "Budget Adjustment", description: "Review & adjust" },
    { id: "finalize", label: "Finalize", description: "Confirm & sync" },
  ];

  const suggestedWins = [
    { 
      id: "w1", 
      text: "LinkedIn engagement up 14% QoQ", 
      metric: "+14%", 
      source: "PulseHub",
      why: "Consistent posting schedule combined with executive thought leadership content resonated strongly with target audience. Video content performed 3x better than static posts.",
      nextSteps: "Double down on executive content, increase video production to 2-3x per week, and experiment with LinkedIn Live sessions for real-time engagement."
    },
    { 
      id: "w2", 
      text: "Email workflow automation increased consistency", 
      metric: "+18%", 
      source: "BrandCraft",
      why: "AI-powered content generation reduced production time by 40% while maintaining brand voice. Automated scheduling ensured timely delivery aligned with customer journey stages.",
      nextSteps: "Expand automation to additional customer segments, A/B test AI-generated subject lines, and implement predictive send-time optimization."
    },
    { 
      id: "w3", 
      text: "Executive POV Sprint drove +11% awareness", 
      metric: "+11%", 
      source: "FlightDeck",
      why: "Coordinated multi-channel campaign featuring CEO insights on industry trends gained traction in key publications. Earned media coverage amplified reach beyond paid channels.",
      nextSteps: "Establish monthly POV content calendar, pitch byline articles to top-tier publications, and create video series expanding on written content."
    },
  ];

  const suggestedMisses = [
    { 
      id: "m1", 
      text: "Email open rate dropped", 
      metric: "-9%", 
      source: "PulseHub",
      why: "Subject lines became repetitive and predictable. Send frequency increased without segmentation, leading to list fatigue. Mobile preview text was often cut off or missing.",
      improvements: "Implement dynamic subject line testing with AI variations, reduce overall send frequency by 20%, create 3-5 segment-specific campaigns instead of broadcast sends, and optimize for mobile-first preview text.",
      quickWins: "Start with A/B testing 3 subject line styles this week, and immediately pause the daily newsletter in favor of 3x weekly targeted sends."
    },
    { 
      id: "m2", 
      text: "Paid ad CTR underperformed", 
      metric: "-6%", 
      source: "FlightDeck",
      why: "Ad creative didn't reflect updated brand messaging. Landing page experience had 3.2-second load time and lacked mobile optimization. Targeting parameters were too broad, reaching low-intent audiences.",
      improvements: "Refresh all ad creative to align with new brand voice and value props, optimize landing pages for sub-2-second load times, implement tighter audience targeting based on behavioral signals, and add retargeting campaigns for engaged but non-converting visitors.",
      quickWins: "Compress landing page images immediately (potential 40% speed improvement), and narrow targeting to exclude bottom 30% performing audience segments this week."
    },
  ];

  const suggestedNextMoves = [
    { id: "n1", text: "Rerun Executive POV Sprint (high performing)", confidence: 92 },
    { id: "n2", text: "Add Optimization Sprint for consistency", confidence: 88 },
    { id: "n3", text: "Refresh email cadence and content", confidence: 84 },
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
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

  // Review Prep helper functions
  const calculateReadiness = () => {
    const total = reviewItems.length;
    const completed = reviewItems.filter(item => item.status === 'complete').length;
    return Math.round((completed / total) * 100);
  };

  const cycleHealth = 76;

  const toggleItemStatus = (id: number) => {
    if (isReviewPrepLocked) return;
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
    if (isReviewPrepLocked) return;
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
    setIsReviewPrepLocked(true);
    handleNext();
    toast({
      title: 'Moving to Cycle Overview',
      description: 'Review prep locked. Proceeding to Cycle Overview.',
    });
  };

  const exportSummary = () => {
    toast({
      title: 'Export Started',
      description: 'Your summary PDF is being generated...',
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
      Lesson: 'text-blue-600',
      Idea: 'text-purple-600'
    };
    return colors[category];
  };

  // Left navigation
  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Strategy Studio</h2>
    </div>
  )

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
                  <h2 className="text-2xl sm:text-3xl font-bold" data-testid="heading-review-prep">
                    Review Prep — Q4 Strategy Cycle
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Confirm readiness and capture context ahead of your Q1 Review
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
                    Export Summary (PDF)
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] text-white hover:opacity-90"
                    onClick={sendToReview}
                    disabled={isReviewPrepLocked}
                    data-testid="button-send-to-review"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isReviewPrepLocked ? 'Sent to Review' : 'Send to Review'}
                  </Button>
                </div>
              </div>

              {/* Date of Review */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor="review-date" className="text-sm font-semibold">Date of Review</Label>
                      <Input
                        id="review-date"
                        type="date"
                        value={reviewDate}
                        onChange={(e) => setReviewDate(e.target.value)}
                        disabled={isReviewPrepLocked}
                        className="mt-1"
                        data-testid="input-review-date"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">Cycle Health</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">
                      {cycleHealth}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">Readiness</div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">{calculateReadiness()}%</div>
                      <Progress value={calculateReadiness()} className="flex-1 h-2" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">Date of Next Review</div>
                    <Input
                      type="date"
                      value={nextReviewDate}
                      onChange={(e) => setNextReviewDate(e.target.value)}
                      disabled={isReviewPrepLocked}
                      className="mt-2"
                      data-testid="input-next-review-date"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Left Column: SWOT + Readiness Checklist */}
              <div className="col-span-2 space-y-6">
                {/* SWOT Block */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Context & SWOT</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Simple lens for review discussion prep
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-green-700 block mb-2">Strengths</label>
                        <Textarea
                          value={swot.strengths}
                          onChange={(e) => setSwot({ ...swot, strengths: e.target.value })}
                          rows={4}
                          disabled={isReviewPrepLocked}
                          className="text-xs"
                          data-testid="textarea-strengths"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-red-700 block mb-2">Weaknesses</label>
                        <Textarea
                          value={swot.weaknesses}
                          onChange={(e) => setSwot({ ...swot, weaknesses: e.target.value })}
                          rows={4}
                          disabled={isReviewPrepLocked}
                          className="text-xs"
                          data-testid="textarea-weaknesses"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-blue-700 block mb-2">Opportunities</label>
                        <Textarea
                          value={swot.opportunities}
                          onChange={(e) => setSwot({ ...swot, opportunities: e.target.value })}
                          rows={4}
                          disabled={isReviewPrepLocked}
                          className="text-xs"
                          data-testid="textarea-opportunities"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-orange-700 block mb-2">Threats</label>
                        <Textarea
                          value={swot.threats}
                          onChange={(e) => setSwot({ ...swot, threats: e.target.value })}
                          rows={4}
                          disabled={isReviewPrepLocked}
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
                    <CardTitle>Review Readiness Checklist</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {isReviewPrepLocked ? 'Checklist locked and sent to review' : 'Track pending items for your quarterly review'}
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
                            isReviewPrepLocked ? 'bg-muted/50' : 'bg-card hover-elevate'
                          }`}
                          data-testid={`review-item-${item.id}`}
                        >
                          {/* Mobile/Tablet Layout */}
                          <div className="flex lg:hidden items-start gap-3">
                            <button 
                              onClick={() => toggleItemStatus(item.id)}
                              disabled={isReviewPrepLocked}
                              className={`${isReviewPrepLocked ? 'cursor-not-allowed' : 'cursor-pointer'} flex-shrink-0 mt-0.5`}
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
                                  disabled={isReviewPrepLocked}
                                  className="h-7 px-2"
                                  data-testid={`button-add-note-${item.id}`}
                                >
                                  <StickyNote className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCarryover(item.id)}
                                  disabled={isReviewPrepLocked}
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
                              disabled={isReviewPrepLocked}
                              className={isReviewPrepLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
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
                              disabled={isReviewPrepLocked}
                              data-testid={`button-add-note-${item.id}`}
                            >
                              <StickyNote className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 ${item.carryover ? 'text-purple-600' : ''}`}
                              onClick={() => toggleCarryover(item.id)}
                              disabled={isReviewPrepLocked}
                              data-testid={`button-carryover-${item.id}`}
                            >
                              <Tag className="h-3 w-3" />
                            </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isReviewPrepLocked && (
                      <div className="mt-4 text-xs text-muted-foreground">
                        Click status icons to update progress • Add notes for context • Tag items for next cycle carryover
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
                      Compiled notes from across modules
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
                            disabled={isReviewPrepLocked}
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

      case "cycle-overview":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Q4 2024 Cycle Overview</h2>
              <p className="text-muted-foreground">
                Final performance snapshot and strategic context for this quarter
              </p>
            </div>

            <Tabs value={cycleTab} onValueChange={setCycleTab} data-testid="tabs-cycle-overview">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
                <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-4 sm:min-w-0">
                  <TabsTrigger value="exec-summary" data-testid="tab-exec-summary" className="whitespace-nowrap flex-shrink-0 sm:flex-shrink">Exec Summary</TabsTrigger>
                  <TabsTrigger value="wins" data-testid="tab-wins" className="whitespace-nowrap flex-shrink-0 sm:flex-shrink">Wins</TabsTrigger>
                  <TabsTrigger value="misses" data-testid="tab-misses" className="whitespace-nowrap flex-shrink-0 sm:flex-shrink">Misses</TabsTrigger>
                  <TabsTrigger value="next-moves" data-testid="tab-next-moves" className="whitespace-nowrap flex-shrink-0 sm:flex-shrink">Next Moves</TabsTrigger>
              </TabsList>
              </div>

              <TabsContent value="exec-summary" className="space-y-6 mt-6">
                {/* Executive Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      Q4 delivered strong momentum in thought leadership and social engagement, with LinkedIn 
                      outperforming targets by 14% and executive POV content driving 11% awareness lift. Email 
                      performance declined due to fatigue and segmentation gaps. Budget utilization at 94% with 
                      content and paid channels leading spend. Team maintained quarterly cadence while scaling 
                      automation capabilities.
                    </p>
                  </CardContent>
                </Card>

                {/* Final Metrics Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Cycle Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold" style={{ color: moduleColor }}>76</span>
                        <span className="text-lg text-muted-foreground">/100</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Strong overall execution</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Top Motion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700">LinkedIn Engagement</span>
                        </div>
                        <p className="text-xs text-muted-foreground">+14% QoQ growth</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Bottom Motion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-700">Email Open Rate</span>
                        </div>
                        <p className="text-xs text-muted-foreground">-9% QoQ decline</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue & Goal Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quarter Revenue & Goal Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Q4 Marketing-Attributed Revenue</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-bold">$2.4M</span>
                            <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +8.2%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">vs Q3: $2.22M</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Progress to Yearly Goal</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-bold" style={{ color: moduleColor }}>87%</span>
                            <span className="text-sm text-muted-foreground">of $10M target</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">$8.7M achieved YTD</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SWOT Context */}
                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Context</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                        This Cycle in a Sentence
                      </label>
                      <p className="text-sm">
                        Thought leadership momentum accelerated through LinkedIn and executive content while 
                        email engagement exposed segmentation and cadence challenges.
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                        Main Theme or Focus
                      </label>
                      <Badge variant="secondary" className="text-sm">
                        Retention & Messaging Consistency
                      </Badge>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                        One Thing That Changed
                      </label>
                      <p className="text-sm">
                        Executive team increased POV content participation from 1x/month to 2x/week, 
                        fundamentally shifting our thought leadership velocity.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Export CTA */}
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-6 text-center">
                    <Button 
                      size="lg" 
                      style={{ background: `linear-gradient(135deg, ${moduleColor}, #c009ba)`, color: 'white' }}
                      data-testid="button-export-overview"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Leadership Summary (PDF)
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Export-ready section summary for leadership deck
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wins" className="space-y-4 mt-6">
                {suggestedWins.map((win) => (
                  <Card
                    key={win.id}
                    className="hover-elevate"
                    data-testid={`win-${win.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-700 text-lg">{win.metric}</span>
                            <Badge variant="secondary">{win.source}</Badge>
                          </div>
                          <p className="font-medium">{win.text}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              wins: toggleArrayItem(formData.wins, win.id),
                            });
                          }}
                          data-testid={`button-eval-${win.id}`}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          +Eval
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Why This Worked</p>
                            <p className="text-sm text-muted-foreground">{win.why}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Recommended Next Steps</p>
                            <p className="text-sm text-muted-foreground">{win.nextSteps}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="misses" className="space-y-4 mt-6">
                {suggestedMisses.map((miss) => (
                  <Card
                    key={miss.id}
                    className="hover-elevate"
                    data-testid={`miss-${miss.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-5 h-5 text-yellow-600" />
                            <span className="font-semibold text-yellow-700 text-lg">{miss.metric}</span>
                            <Badge variant="secondary">{miss.source}</Badge>
                          </div>
                          <p className="font-medium">{miss.text}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              misses: toggleArrayItem(formData.misses, miss.id),
                            });
                          }}
                          data-testid={`button-eval-${miss.id}`}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          +Eval
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="space-y-3">
                        <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/30 border border-orange-200/60 rounded-lg p-3">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 rounded-md bg-orange-100 flex-shrink-0">
                              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-700" />
                          </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Why This Happened</p>
                              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{miss.why}</p>
                        </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border border-purple-200/60 rounded-lg p-3">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 rounded-md bg-purple-100 flex-shrink-0">
                              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">How To Improve</p>
                              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{miss.improvements}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-200/60 rounded-lg p-3">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 rounded-md bg-blue-100 flex-shrink-0">
                              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Quick Wins</p>
                              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{miss.quickWins}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="next-moves" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      AI-powered recommendations from wins, My Plays, and performance data
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {suggestedNextMoves.map((move, index) => (
                      <div key={move.id} className="flex items-start gap-3 p-3 rounded-md border hover-elevate" data-testid={`next-move-${move.id}`}>
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <Badge variant="secondary" className="text-xs">
                              {move.confidence}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{move.text}</p>
                        </div>
                        <Dialog open={isNextMoveModalOpen && selectedNextMoveId === move.id} onOpenChange={(open) => {
                          setIsNextMoveModalOpen(open);
                          if (!open) {
                            setSelectedNextMoveId(null);
                            setNextMoveMilestone("");
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedNextMoveId(move.id);
                                setIsNextMoveModalOpen(true);
                              }}
                              data-testid={`button-eval-${move.id}`}
                            >
                              <Target className="w-3 h-3 mr-1" />
                              +Eval
                            </Button>
                          </DialogTrigger>
                          <DialogContent data-testid="dialog-next-move-milestone">
                            <DialogHeader>
                              <DialogTitle>Add to 30/60/90 Plan</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-semibold mb-2">Recommended Action</Label>
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{move.text}</p>
                              </div>
                              <div>
                                <Label htmlFor="next-move-milestone">Specific Milestone</Label>
                                <Textarea
                                  id="next-move-milestone"
                                  placeholder="Describe the specific milestone or deliverable..."
                                  rows={3}
                                  value={nextMoveMilestone}
                                  onChange={(e) => setNextMoveMilestone(e.target.value)}
                                  data-testid="input-next-move-milestone"
                                  className="mt-1"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  This will be automatically added to your 30/60/90 plan
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setIsNextMoveModalOpen(false);
                                    setSelectedNextMoveId(null);
                                    setNextMoveMilestone("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      nextMoves: toggleArrayItem(formData.nextMoves, move.id),
                                    });
                                    setIsNextMoveModalOpen(false);
                                    setSelectedNextMoveId(null);
                                    setNextMoveMilestone("");
                                  }} 
                                  data-testid="button-save-next-move-milestone"
                                >
                                  Add to 30/60/90
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 4-Column Interactive Panel: Start, Stop, Continue, Explore */}
                <Card>
                  <CardHeader>
                    <CardTitle>Action Framework</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Organize your next quarter strategy using Start, Stop, Continue, Explore
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* START Column */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <h3 className="font-semibold text-sm">Start</h3>
                        </div>
                        <div className="space-y-2">
                          {nextMovesPanel.start.map((item, index) => (
                            <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`start-item-${index}`}>
                              <p className="text-sm pr-6">{item}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newStart = nextMovesPanel.start.filter((_, i) => i !== index);
                                  setNextMovesPanel({ ...nextMovesPanel, start: newStart });
                                }}
                                data-testid={`button-remove-start-${index}`}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new..."
                            value={newItemInput.start}
                            onChange={(e) => setNewItemInput({ ...newItemInput, start: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newItemInput.start.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  start: [...nextMovesPanel.start, newItemInput.start.trim()]
                                });
                                setNewItemInput({ ...newItemInput, start: "" });
                              }
                            }}
                            className="text-sm"
                            data-testid="input-add-start"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (newItemInput.start.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  start: [...nextMovesPanel.start, newItemInput.start.trim()]
                                });
                                setNewItemInput({ ...newItemInput, start: "" });
                              }
                            }}
                            data-testid="button-add-start"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* STOP Column */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <h3 className="font-semibold text-sm">Stop</h3>
                        </div>
                        <div className="space-y-2">
                          {nextMovesPanel.stop.map((item, index) => (
                            <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`stop-item-${index}`}>
                              <p className="text-sm pr-6">{item}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newStop = nextMovesPanel.stop.filter((_, i) => i !== index);
                                  setNextMovesPanel({ ...nextMovesPanel, stop: newStop });
                                }}
                                data-testid={`button-remove-stop-${index}`}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new..."
                            value={newItemInput.stop}
                            onChange={(e) => setNewItemInput({ ...newItemInput, stop: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newItemInput.stop.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  stop: [...nextMovesPanel.stop, newItemInput.stop.trim()]
                                });
                                setNewItemInput({ ...newItemInput, stop: "" });
                              }
                            }}
                            className="text-sm"
                            data-testid="input-add-stop"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (newItemInput.stop.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  stop: [...nextMovesPanel.stop, newItemInput.stop.trim()]
                                });
                                setNewItemInput({ ...newItemInput, stop: "" });
                              }
                            }}
                            data-testid="button-add-stop"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* CONTINUE Column */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <h3 className="font-semibold text-sm">Continue</h3>
                        </div>
                        <div className="space-y-2">
                          {nextMovesPanel.continue.map((item, index) => (
                            <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`continue-item-${index}`}>
                              <p className="text-sm pr-6">{item}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newContinue = nextMovesPanel.continue.filter((_, i) => i !== index);
                                  setNextMovesPanel({ ...nextMovesPanel, continue: newContinue });
                                }}
                                data-testid={`button-remove-continue-${index}`}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new..."
                            value={newItemInput.continue}
                            onChange={(e) => setNewItemInput({ ...newItemInput, continue: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newItemInput.continue.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  continue: [...nextMovesPanel.continue, newItemInput.continue.trim()]
                                });
                                setNewItemInput({ ...newItemInput, continue: "" });
                              }
                            }}
                            className="text-sm"
                            data-testid="input-add-continue"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (newItemInput.continue.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  continue: [...nextMovesPanel.continue, newItemInput.continue.trim()]
                                });
                                setNewItemInput({ ...newItemInput, continue: "" });
                              }
                            }}
                            data-testid="button-add-continue"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* EXPLORE Column */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <h3 className="font-semibold text-sm">Explore</h3>
                        </div>
                        <div className="space-y-2">
                          {nextMovesPanel.explore.map((item, index) => (
                            <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`explore-item-${index}`}>
                              <p className="text-sm pr-6">{item}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newExplore = nextMovesPanel.explore.filter((_, i) => i !== index);
                                  setNextMovesPanel({ ...nextMovesPanel, explore: newExplore });
                                }}
                                data-testid={`button-remove-explore-${index}`}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new..."
                            value={newItemInput.explore}
                            onChange={(e) => setNewItemInput({ ...newItemInput, explore: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newItemInput.explore.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  explore: [...nextMovesPanel.explore, newItemInput.explore.trim()]
                                });
                                setNewItemInput({ ...newItemInput, explore: "" });
                              }
                            }}
                            className="text-sm"
                            data-testid="input-add-explore"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (newItemInput.explore.trim()) {
                                setNextMovesPanel({
                                  ...nextMovesPanel,
                                  explore: [...nextMovesPanel.explore, newItemInput.explore.trim()]
                                });
                                setNewItemInput({ ...newItemInput, explore: "" });
                              }
                            }}
                            data-testid="button-add-explore"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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
                data-testid="button-next"
              >
                Continue to Quarterly Goals
              </Button>
            </div>
          </div>
        );

      case "wins":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Wins</h2>
              <p className="text-muted-foreground">
                Select wins to evaluate and capture key insights
              </p>
            </div>

            <div className="space-y-4">
              {suggestedWins.map((win) => (
                <Card
                  key={win.id}
                  className="hover-elevate"
                  data-testid={`win-${win.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700 text-lg">{win.metric}</span>
                          <Badge variant="secondary">{win.source}</Badge>
                        </div>
                        <p className="font-medium">{win.text}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            wins: toggleArrayItem(formData.wins, win.id),
                          });
                        }}
                        data-testid={`button-eval-${win.id}`}
                      >
                        <Target className="w-3 h-3 mr-1" />
                        +Eval
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Why This Worked</p>
                          <p className="text-sm text-muted-foreground">{win.why}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Recommended Next Steps</p>
                          <p className="text-sm text-muted-foreground">{win.nextSteps}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                Continue to Review Misses
              </Button>
            </div>
          </div>
        );

      case "misses":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Misses</h2>
              <p className="text-muted-foreground">
                Select challenges to evaluate and plan improvements
              </p>
            </div>

            <div className="space-y-4">
              {suggestedMisses.map((miss) => (
                <Card
                  key={miss.id}
                  className="hover-elevate"
                  data-testid={`miss-${miss.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingDown className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-700 text-lg">{miss.metric}</span>
                          <Badge variant="secondary">{miss.source}</Badge>
                        </div>
                        <p className="font-medium">{miss.text}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            misses: toggleArrayItem(formData.misses, miss.id),
                          });
                        }}
                        data-testid={`button-eval-${miss.id}`}
                      >
                        <Target className="w-3 h-3 mr-1" />
                        +Eval
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/30 border border-orange-200/60 rounded-lg p-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-md bg-orange-100 flex-shrink-0">
                            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-700" />
                        </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Why This Happened</p>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{miss.why}</p>
                      </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border border-purple-200/60 rounded-lg p-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-md bg-purple-100 flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">How To Improve</p>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{miss.improvements}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-200/60 rounded-lg p-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-md bg-blue-100 flex-shrink-0">
                            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Quick Wins</p>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{miss.quickWins}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                Continue to Next Moves
              </Button>
            </div>
          </div>
        );

      case "budget":
        const totalBudget = Object.values(formData.budgetAllocations).reduce((sum, val) => sum + val, 0);
        const isBudgetValid = totalBudget === 100;
        const newYearlyBudget = formData.newMonthlyBudget * 12;
        const budgetChange = formData.newMonthlyBudget - formData.monthlyBudget;
        const budgetChangePercent = ((budgetChange / formData.monthlyBudget) * 100).toFixed(1);
        
        const budgetCategories = [
          { 
            key: 'contentCreation', 
            label: 'Content Creation', 
            channels: [
              { key: 'blog', label: 'Blog & Articles' },
              { key: 'video', label: 'Video Content' },
              { key: 'whitepapersEbooks', label: 'Whitepapers & Ebooks' },
              { key: 'webinars', label: 'Webinars' }
            ]
          },
          { 
            key: 'paidAdvertising', 
            label: 'Paid Advertising', 
            channels: [
              { key: 'googleAds', label: 'Google Ads' },
              { key: 'linkedInAds', label: 'LinkedIn Ads' },
              { key: 'displayAds', label: 'Display Ads' },
              { key: 'retargeting', label: 'Retargeting' }
            ]
          },
          { 
            key: 'seoSem', 
            label: 'SEO / SEM', 
            channels: [
              { key: 'organicSeo', label: 'Organic SEO' },
              { key: 'paidSearch', label: 'Paid Search' }
            ]
          },
          { 
            key: 'socialMedia', 
            label: 'Social Media', 
            channels: [
              { key: 'linkedin', label: 'LinkedIn' },
              { key: 'twitter', label: 'Twitter / X' },
              { key: 'facebook', label: 'Facebook' },
              { key: 'instagram', label: 'Instagram' }
            ]
          },
          { 
            key: 'eventsSponsorships', 
            label: 'Events & Sponsorships', 
            channels: [
              { key: 'conferences', label: 'Conferences' },
              { key: 'webinars', label: 'Webinars' },
              { key: 'sponsorships', label: 'Sponsorships' }
            ]
          },
          { 
            key: 'toolsSoftware', 
            label: 'Tools & Software', 
            channels: [
              { key: 'marketingAutomation', label: 'Marketing Automation' },
              { key: 'analytics', label: 'Analytics' },
              { key: 'contentTools', label: 'Content Tools' },
              { key: 'other', label: 'Other Tools' }
            ]
          },
          { 
            key: 'creativePro', 
            label: 'Creative & Production', 
            channels: [
              { key: 'design', label: 'Design' },
              { key: 'videoProduction', label: 'Video Production' },
              { key: 'photography', label: 'Photography' }
            ]
          },
          { 
            key: 'contingency', 
            label: 'Contingency', 
            channels: [
              { key: 'buffer', label: 'Contingency Buffer' }
            ]
          },
        ];
        
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Budget Adjustment</h2>
              <p className="text-muted-foreground">
                Review last quarter's spend and plan next quarter's allocation
              </p>
            </div>

            <Tabs value={budgetTab} onValueChange={setBudgetTab} data-testid="tabs-budget">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="review" data-testid="tab-review">Review</TabsTrigger>
                <TabsTrigger value="adjustments" data-testid="tab-adjustments">Adjustments</TabsTrigger>
              </TabsList>

              <TabsContent value="review" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Planned (Q4 2024)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${formData.monthlyBudget.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">per month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Actual Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${formData.previousQuarterSpend.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">total quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {((formData.previousQuarterSpend / (formData.monthlyBudget * 3)) * 100).toFixed(0)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">of planned</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline & Revenue Impact</CardTitle>
                    <p className="text-sm text-muted-foreground">Marketing contribution to business goals</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Q4 2024 Pipeline</div>
                        <div className="text-2xl font-bold">$8.7M</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+12% vs Q3</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Q4 2024 Revenue</div>
                        <div className="text-2xl font-bold">$2.3M</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+8% vs Q3</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Est. Q1 2025 Revenue</div>
                        <div className="text-2xl font-bold">$2.5M</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-purple-600 font-medium">+9% projected</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Channel Spend Variance</CardTitle>
                    <p className="text-sm text-muted-foreground">Planned vs. Actual by category</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { category: 'Content Creation', planned: 10417, actual: 9500, variance: -8.8 },
                        { category: 'Paid Advertising', planned: 8333, actual: 10200, variance: 22.4 },
                        { category: 'SEO / SEM', planned: 6250, actual: 5800, variance: -7.2 },
                        { category: 'Social Media', planned: 5000, actual: 4900, variance: -2.0 },
                        { category: 'Events & Sponsorships', planned: 4167, actual: 3800, variance: -8.8 },
                        { category: 'Tools & Software', planned: 3333, actual: 3400, variance: 2.0 },
                        { category: 'Creative & Production', planned: 2917, actual: 2600, variance: -10.9 },
                        { category: 'Contingency', planned: 1250, actual: 800, variance: -36.0 },
                      ].map((row, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 items-center py-2 border-b last:border-0">
                          <div className="text-sm font-medium">{row.category}</div>
                          <div className="text-sm text-right">${row.planned.toLocaleString()}</div>
                          <div className="text-sm text-right">${row.actual.toLocaleString()}</div>
                          <div className={`text-sm text-right font-medium ${row.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {row.variance >= 0 ? '+' : ''}{row.variance}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-4 pt-3 mt-3 border-t font-semibold">
                      <div className="text-sm">TOTAL</div>
                      <div className="text-sm text-right">${(formData.monthlyBudget * 3).toLocaleString()}</div>
                      <div className="text-sm text-right">${formData.previousQuarterSpend.toLocaleString()}</div>
                      <div className="text-sm text-right text-green-600">
                        {(((formData.previousQuarterSpend - (formData.monthlyBudget * 3)) / (formData.monthlyBudget * 3)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI-Powered Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Recommendations</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      AI-generated insights based on performance data
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* High ROI Channels */}
                      <div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-emerald-50/50 to-green-50/30 border-emerald-200/60 hover:border-emerald-300/80 transition-colors">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-md bg-emerald-100 flex-shrink-0">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base text-emerald-900">Strong ROI Channels</h4>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                              <strong>LinkedIn Ads</strong> (18% ROI, $0.42 CPL) and <strong>Content Marketing</strong> (22% engagement lift) are delivering exceptional results. Consider increasing allocation by 10-15% to maximize impact.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Underperforming Channels */}
                      <div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-amber-50/50 to-orange-50/30 border-amber-200/60 hover:border-amber-300/80 transition-colors">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-md bg-amber-100 flex-shrink-0">
                            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base text-amber-900">Underperforming Channels</h4>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                              <strong>Display Ads</strong> (0.08% CTR, 64% below benchmark) and <strong>Event Sponsorships</strong> (12 leads, $850 CPL) are underperforming. Recommend reducing allocation by 20% or pausing for Q1.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Strategic Shifts */}
                      <div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border-purple-200/60 hover:border-purple-300/80 transition-colors">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-md bg-purple-100 flex-shrink-0">
                            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base text-purple-900">Recommended Budget Shifts</h4>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                              Reallocate $5,000/mo from Display Ads → LinkedIn Ads. Reduce Event Sponsorships by 50% ($2,000/mo) and redirect to SEO/Content. Total estimated impact: +15% pipeline, +$120K ARR.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="adjustments" className="space-y-6 mt-6">
                {/* Coaching Prompt */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-purple-900">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      <strong>Coaching Insight:</strong> Budget changes are tracked in history. Previous spend is maintained while new allocations apply to future months.
                    </p>
                  </CardContent>
                </Card>

                {/* Budget Summary & Adjustment */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Previous Quarter Performance */}
                  <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">Previous Quarter</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Spend</span>
                      <span className="text-lg font-bold">
                        ${formData.previousQuarterSpend.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Budget</span>
                      <span className="text-sm font-medium">
                        ${formData.monthlyBudget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Yearly Projection</span>
                      <span className="text-sm font-medium">
                        ${(formData.monthlyBudget * 12).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* New Budget Input */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">New Monthly Budget</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-monthly-budget">Monthly Budget Going Forward</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="new-monthly-budget"
                        type="number"
                        value={formData.newMonthlyBudget || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, newMonthlyBudget: parseFloat(e.target.value) || 0 })
                        }
                        className="pl-8"
                        data-testid="input-new-monthly-budget"
                      />
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">New Yearly Projection</span>
                        <span className="text-sm font-bold text-blue-600">
                          ${newYearlyBudget.toLocaleString()}
                        </span>
                      </div>
                      {budgetChange !== 0 && (
                        <div className={`flex items-center justify-between text-xs ${budgetChange > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          <span>Change from Previous</span>
                          <span className="font-semibold">
                            {budgetChange > 0 ? '+' : ''}{budgetChangePercent}% ({budgetChange > 0 ? '+' : ''}${budgetChange.toLocaleString()}/mo)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Allocation Status */}
            <Card className={`p-4 ${isBudgetValid ? 'border-green-500' : 'border-orange-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Total Allocation</span>
                <span className={`text-xl font-bold ${isBudgetValid ? 'text-green-600' : 'text-orange-600'}`}>
                  {totalBudget}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isBudgetValid ? '✓ Budget is balanced' : '⚠ Budget must total 100%'}
              </p>
            </Card>

            {/* Category Cards with Sliders */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetCategories.map((category) => {
                const categoryValue = formData.budgetAllocations[category.key as keyof typeof formData.budgetAllocations];
                const channels = formData.channelAllocations[category.key as keyof typeof formData.channelAllocations];
                const channelTotal = Object.values(channels).reduce((sum: number, val) => sum + (val as number), 0);
                const monthlyAmount = (formData.newMonthlyBudget * categoryValue) / 100;
                
                return (
                  <Card key={category.key} className="p-4">
                    <div className="space-y-4">
                      {/* Category Header */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{category.label}</h3>
                          <Badge variant="secondary">{categoryValue || 0}%</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          ${monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                        </div>
                        <Slider
                          value={[categoryValue || 0]}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              budgetAllocations: { 
                                ...formData.budgetAllocations, 
                                [category.key]: value[0] 
                              }
                            });
                          }}
                          max={100}
                          step={1}
                          className="mb-2"
                          data-testid={`slider-budget-${category.key}`}
                        />
                      </div>

                      {/* Channel Breakdown */}
                      <div className="space-y-3 pt-2 border-t">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Channel Breakdown</p>
                        {category.channels.map((channel) => {
                          const channelValue = channels[channel.key as keyof typeof channels] as number || 0;
                          return (
                            <div key={channel.key} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">{channel.label}</Label>
                                <span className="text-xs font-medium">{channelValue}%</span>
                              </div>
                              <Slider
                                value={[channelValue]}
                                onValueChange={(value) => {
                                  setFormData({
                                    ...formData,
                                    channelAllocations: {
                                      ...formData.channelAllocations,
                                      [category.key]: {
                                        ...channels,
                                        [channel.key]: value[0]
                                      }
                                    }
                                  });
                                }}
                                max={100}
                                step={5}
                                className="h-1"
                                data-testid={`slider-channel-${category.key}-${channel.key}`}
                              />
                            </div>
                          );
                        })}
                        <div className={`text-xs pt-2 ${channelTotal === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                          Total: {channelTotal}% {channelTotal === 100 ? '✓' : '⚠'}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
              </TabsContent>
            </Tabs>

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
                disabled={budgetTab === 'adjustments' && !isBudgetValid}
                data-testid="button-next"
              >
                Continue to Next Moves
              </Button>
            </div>
          </div>
        );

      case "next-moves":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Next Moves</h2>
              <p className="text-muted-foreground">
                Turn insights into clear next-quarter action
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered recommendations from wins, My Plays, and performance data
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedNextMoves.map((move, index) => (
                  <div key={move.id} className="flex items-start gap-3 p-3 rounded-md border hover-elevate" data-testid={`next-move-${move.id}`}>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {move.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{move.text}</p>
                    </div>
                    <Dialog open={isNextMoveModalOpen && selectedNextMoveId === move.id} onOpenChange={(open) => {
                      setIsNextMoveModalOpen(open);
                      if (!open) {
                        setSelectedNextMoveId(null);
                        setNextMoveMilestone("");
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedNextMoveId(move.id);
                            setIsNextMoveModalOpen(true);
                          }}
                          data-testid={`button-eval-${move.id}`}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          +Eval
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-next-move-milestone">
                        <DialogHeader>
                          <DialogTitle>Add to 30/60/90 Plan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-semibold mb-2">Recommended Action</Label>
                            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{move.text}</p>
                          </div>
                          <div>
                            <Label htmlFor="next-move-milestone">Specific Milestone</Label>
                            <Textarea
                              id="next-move-milestone"
                              placeholder="Describe the specific milestone or deliverable..."
                              rows={3}
                              value={nextMoveMilestone}
                              onChange={(e) => setNextMoveMilestone(e.target.value)}
                              data-testid="input-next-move-milestone"
                              className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              This will be automatically added to your 30/60/90 plan
                            </p>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsNextMoveModalOpen(false);
                                setSelectedNextMoveId(null);
                                setNextMoveMilestone("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  nextMoves: toggleArrayItem(formData.nextMoves, move.id),
                                });
                                setIsNextMoveModalOpen(false);
                                setSelectedNextMoveId(null);
                                setNextMoveMilestone("");
                              }} 
                              data-testid="button-save-next-move-milestone"
                            >
                              Add to 30/60/90
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 4-Column Interactive Panel: Start, Stop, Continue, Explore */}
            <Card>
              <CardHeader>
                <CardTitle>Action Framework</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Organize your next quarter strategy using Start, Stop, Continue, Explore
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {/* START Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <h3 className="font-semibold text-sm">Start</h3>
                    </div>
                    <div className="space-y-2">
                      {nextMovesPanel.start.map((item, index) => (
                        <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`start-item-${index}`}>
                          <p className="text-sm pr-6">{item}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newStart = nextMovesPanel.start.filter((_, i) => i !== index);
                              setNextMovesPanel({ ...nextMovesPanel, start: newStart });
                            }}
                            data-testid={`button-remove-start-${index}`}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new..."
                        value={newItemInput.start}
                        onChange={(e) => setNewItemInput({ ...newItemInput, start: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newItemInput.start.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              start: [...nextMovesPanel.start, newItemInput.start.trim()]
                            });
                            setNewItemInput({ ...newItemInput, start: "" });
                          }
                        }}
                        className="text-sm"
                        data-testid="input-add-start"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (newItemInput.start.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              start: [...nextMovesPanel.start, newItemInput.start.trim()]
                            });
                            setNewItemInput({ ...newItemInput, start: "" });
                          }
                        }}
                        data-testid="button-add-start"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* STOP Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <h3 className="font-semibold text-sm">Stop</h3>
                    </div>
                    <div className="space-y-2">
                      {nextMovesPanel.stop.map((item, index) => (
                        <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`stop-item-${index}`}>
                          <p className="text-sm pr-6">{item}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newStop = nextMovesPanel.stop.filter((_, i) => i !== index);
                              setNextMovesPanel({ ...nextMovesPanel, stop: newStop });
                            }}
                            data-testid={`button-remove-stop-${index}`}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new..."
                        value={newItemInput.stop}
                        onChange={(e) => setNewItemInput({ ...newItemInput, stop: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newItemInput.stop.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              stop: [...nextMovesPanel.stop, newItemInput.stop.trim()]
                            });
                            setNewItemInput({ ...newItemInput, stop: "" });
                          }
                        }}
                        className="text-sm"
                        data-testid="input-add-stop"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (newItemInput.stop.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              stop: [...nextMovesPanel.stop, newItemInput.stop.trim()]
                            });
                            setNewItemInput({ ...newItemInput, stop: "" });
                          }
                        }}
                        data-testid="button-add-stop"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* CONTINUE Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <h3 className="font-semibold text-sm">Continue</h3>
                    </div>
                    <div className="space-y-2">
                      {nextMovesPanel.continue.map((item, index) => (
                        <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`continue-item-${index}`}>
                          <p className="text-sm pr-6">{item}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newContinue = nextMovesPanel.continue.filter((_, i) => i !== index);
                              setNextMovesPanel({ ...nextMovesPanel, continue: newContinue });
                            }}
                            data-testid={`button-remove-continue-${index}`}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new..."
                        value={newItemInput.continue}
                        onChange={(e) => setNewItemInput({ ...newItemInput, continue: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newItemInput.continue.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              continue: [...nextMovesPanel.continue, newItemInput.continue.trim()]
                            });
                            setNewItemInput({ ...newItemInput, continue: "" });
                          }
                        }}
                        className="text-sm"
                        data-testid="input-add-continue"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (newItemInput.continue.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              continue: [...nextMovesPanel.continue, newItemInput.continue.trim()]
                            });
                            setNewItemInput({ ...newItemInput, continue: "" });
                          }
                        }}
                        data-testid="button-add-continue"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* EXPLORE Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <h3 className="font-semibold text-sm">Explore</h3>
                    </div>
                    <div className="space-y-2">
                      {nextMovesPanel.explore.map((item, index) => (
                        <div key={index} className="group relative p-2 rounded-md border bg-card hover-elevate" data-testid={`explore-item-${index}`}>
                          <p className="text-sm pr-6">{item}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newExplore = nextMovesPanel.explore.filter((_, i) => i !== index);
                              setNextMovesPanel({ ...nextMovesPanel, explore: newExplore });
                            }}
                            data-testid={`button-remove-explore-${index}`}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new..."
                        value={newItemInput.explore}
                        onChange={(e) => setNewItemInput({ ...newItemInput, explore: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newItemInput.explore.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              explore: [...nextMovesPanel.explore, newItemInput.explore.trim()]
                            });
                            setNewItemInput({ ...newItemInput, explore: "" });
                          }
                        }}
                        className="text-sm"
                        data-testid="input-add-explore"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (newItemInput.explore.trim()) {
                            setNextMovesPanel({
                              ...nextMovesPanel,
                              explore: [...nextMovesPanel.explore, newItemInput.explore.trim()]
                            });
                            setNewItemInput({ ...newItemInput, explore: "" });
                          }
                        }}
                        data-testid="button-add-explore"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
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
                Continue to Quarterly Goals
              </Button>
            </div>
          </div>
        );

      case "quarterly-goals":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quarterly Goals</h2>
              <p className="text-muted-foreground">
                Set specific, measurable goals for the upcoming quarter
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Q1 2025 Business Goals</CardTitle>
                <p className="text-sm text-muted-foreground">
                  These goals will guide your strategy and be tracked in PulseHub throughout the quarter
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Goal 1: Revenue & Growth</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">KPI Metric</Label>
                      <Input
                        placeholder="e.g., Pipeline Value"
                        className="mt-1"
                        data-testid="input-goal1-metric"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Target</Label>
                      <Input
                        placeholder="e.g., +15%"
                        className="mt-1"
                        data-testid="input-goal1-target"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Goal 2: Retention & Loyalty</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">KPI Metric</Label>
                      <Input
                        placeholder="e.g., Customer Retention Rate"
                        className="mt-1"
                        data-testid="input-goal2-metric"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Target</Label>
                      <Input
                        placeholder="e.g., +5%"
                        className="mt-1"
                        data-testid="input-goal2-target"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Goal 3: Brand Health</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">KPI Metric</Label>
                      <Input
                        placeholder="e.g., Brand Sentiment Score"
                        className="mt-1"
                        data-testid="input-goal3-metric"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Target</Label>
                      <Input
                        placeholder="e.g., ≥85"
                        className="mt-1"
                        data-testid="input-goal3-target"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    data-testid="button-add-goal"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Goal
                  </Button>
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
                Continue to Budget
              </Button>
            </div>
          </div>
        );

      case "finalize":
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${moduleColor}, #c009ba)` }}>
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Q4 2024 Review Complete</h2>
                <p className="text-lg text-muted-foreground mt-2">
                  Export-ready summary for leadership and team alignment
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground">
                      Q4 2024 delivered strong momentum in content marketing (+28% engagement) and email performance (+15% open rates), 
                      though paid advertising underperformed expectations (-12% vs. target). Strategic focus on quality over volume 
                      drove meaningful progress toward annual revenue goals. Budget execution came in 1% under plan, allowing for strategic 
                      reallocation into Q1 2025.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                      <div className="text-2xl font-bold text-green-700">A-</div>
                      <p className="text-xs text-muted-foreground mt-1">Cycle Health</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="text-2xl font-bold text-blue-700">${formData.previousQuarterSpend.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">Total Spend</p>
                      <p className="text-xs text-muted-foreground">99% of budget</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <div className="text-2xl font-bold text-purple-700">$8.7M</div>
                      <p className="text-xs text-muted-foreground mt-1">Pipeline/Revenue</p>
                      <p className="text-xs text-muted-foreground">87% to goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Key Wins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suggestedWins.slice(0, 3).map((win) => (
                        <div key={win.id} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{win.metric}</p>
                            <p className="text-xs text-muted-foreground">{win.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      Key Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suggestedMisses.slice(0, 3).map((miss) => (
                        <div key={miss.id} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{miss.metric}</p>
                            <p className="text-xs text-muted-foreground">{miss.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>SWOT Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-green-700">Strengths</h4>
                      <p className="text-sm text-muted-foreground">
                        Content quality, email engagement, organic social growth
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-red-700">Weaknesses</h4>
                      <p className="text-sm text-muted-foreground">
                        Paid ad conversion, event attendance, partner outreach
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-blue-700">Opportunities</h4>
                      <p className="text-sm text-muted-foreground">
                        Video content expansion, AI-driven personalization, community building
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-orange-700">Threats</h4>
                      <p className="text-sm text-muted-foreground">
                        Increased competition, ad costs rising, platform algorithm changes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Q1 2025 Next Moves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestedNextMoves.slice(0, 5).map((move, index) => (
                      <div key={move.id} className="flex items-start gap-3 p-2 rounded border">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{move.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Previous Monthly Budget</p>
                      <p className="text-2xl font-bold">${formData.monthlyBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">New Monthly Budget (Q1 2025)</p>
                      <p className="text-2xl font-bold">${formData.newMonthlyBudget.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Next quarterly review scheduled for <strong>April 1, 2025</strong>. All insights synced to Pulse Hub, Brand Craft, and Flight Deck.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {}}
                  data-testid="button-export-pdf"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Report (PDF)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {}}
                  data-testid="button-export-summary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Leadership Summary
                </Button>
                <div className="flex-1" />
                <Button
                  onClick={() => setLocation("/strategy-studio")}
                  data-testid="button-complete"
                  style={{ background: `linear-gradient(135deg, ${moduleColor}, #c009ba)`, color: 'white' }}
                >
                  Return to Dashboard
                </Button>
              </div>
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
      featureName="Quarterly Review & Refresh"
    />
  );
}
