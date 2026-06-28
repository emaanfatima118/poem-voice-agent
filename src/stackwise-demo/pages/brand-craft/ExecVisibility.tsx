import { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/stackwise-demo/lib/queryClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/stackwise-demo/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Textarea } from '@/stackwise-demo/components/ui/textarea';
import { Progress } from '@/stackwise-demo/components/ui/progress';
import { Slider } from '@/stackwise-demo/components/ui/slider';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/stackwise-demo/components/ui/select';
import { Label } from '@/stackwise-demo/components/ui/label';
import { useToast } from '@/stackwise-demo/hooks/use-toast';
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout';
import { QuickActions } from '@/stackwise-demo/components/QuickActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/stackwise-demo/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/stackwise-demo/components/ui/dialog';
import {
  Sparkles,
  BarChart3,
  Settings,
  Workflow,
  Save,
  PlusCircle,
  Plus,
  UploadCloud,
  TrendingUp,
  Lightbulb,
  PenLine,
  CheckSquare,
  Link2,
  CalendarDays,
  MessageSquare,
  Check,
  X,
  Info,
  BookOpen,
  Megaphone,
  LineChart,
  Gauge,
  ClipboardList,
  Users,
  Loader2,
  Trash2,
  Activity,
  Target,
  Eye,
  CheckCircle,
  ArrowLeft,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Strikethrough,
  Subscript,
  Superscript,
  Quote,
  Minus,
  ChevronRight,
  ChevronLeft,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Code,
  User,
  Play,
  AlertCircle,
  XCircle,
  Edit3,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Download,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
} from 'recharts';

type StepKey = 'overview' | 'create' | 'insights' | 'draft-approvals' | 'content-calendar';

type Executive = {
  id: string;
  name: string;
  title: string;
  company: string;
  audience: string;
  goals: string;
  bio: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  reddit: string;
  wechat: string;
  website: string;
  expertise: string[];
  followPeople: string[];
  follows: string[];
  eventsInterest: string[];
  phrasesUse: string;
  phrasesAvoid: string;
  communities: string[];
  newsSources: string[];
  industry: string;
  vertical: string;
  motivates: string;
  personality: string;
  visibilityScore: number;
  toneScore: number;
  engagementScore: number;
  personaScore: number;
  toneMapping: {
    emotional: {
      reflective: number;
      inspirational: number;
      optimistic: number;
      compassionate: number;
      humor: number;
    };
    persuasive: {
      assertive: number;
      persuasive: number;
      authoritative: number;
    };
    communication: {
      serious: number;
      conversational: number;
      informative: number;
      curious: number;
      matterOfFact: number;
    };
  };
};

function ChipsInput({
  value = [],
  onChange,
  placeholder,
  max = 999,
}: {
  value?: string[];
  onChange?: (v: string[]) => void;
  placeholder: string;
  max?: number;
}) {
  const [text, setText] = useState('');
  const add = () => {
    const t = text.trim();
    if (!t) return;
    if (value.length >= max) return;
    onChange?.([...value, t]);
    setText('');
  };
  const remove = (idx: number) => onChange?.(value.filter((_, i) => i !== idx));
  return (
    <div className="border rounded-md p-2" data-testid="chips-input">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((chip, i) => (
          <span
            key={i}
            className="px-2 py-1 rounded-full text-xs bg-muted flex items-center gap-1"
            data-testid={`chip-${i}`}
          >
            {chip}
            <button
              className="hover:text-destructive"
              onClick={() => remove(i)}
              data-testid={`button-remove-chip-${i}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          data-testid="input-chip-text"
        />
        <Button type="button" onClick={add} variant="outline" size="sm" data-testid="button-add-chip">
          Add
        </Button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="p-4 text-center border shadow-sm">
      <h4 className="text-sm text-muted-foreground mb-1">{label}</h4>
      <div className="text-2xl font-semibold">{value}</div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </Card>
  );
}

export default function ExecVisibilityWorkspace() {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<StepKey>('overview');
  const [createTab, setCreateTab] = useState('persona');
  const [calendarTab, setCalendarTab] = useState('timeline');
  const [reviewTab, setReviewTab] = useState('voice-check');
  const [analyticsTab, setAnalyticsTab] = useState('program');
  const [approvalStage, setApprovalStage] = useState('drafts-view');
  const [activeExecId, setActiveExecId] = useState<string>('');
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<number[]>([]);
  const [showFinalPreview, setShowFinalPreview] = useState(false);
  const [timelineFilterExec, setTimelineFilterExec] = useState<string>('all');
  const [timelineFilterStatus, setTimelineFilterStatus] = useState<string>('all');
  const [voiceCheckScore, setVoiceCheckScore] = useState(0);
  const [voiceCheckRun, setVoiceCheckRun] = useState(false);
  const [povDialogOpen, setPovDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{id: number, topic: string} | null>(null);
  const [selectedPovFilter, setSelectedPovFilter] = useState<string>('all');
  const [editingDraft, setEditingDraft] = useState<{id: number, title: string, content: string} | null>(null);
  const [approvalChecklists, setApprovalChecklists] = useState<{[itemId: number]: {[key: string]: boolean}}>({});
  const [approvalStatuses, setApprovalStatuses] = useState<{[itemId: number]: 'approved' | 'pending'}>({
    1: 'approved',
    2: 'pending',
  });
  const [draftContent, setDraftContent] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    contentType: 'LinkedIn Post',
    launchDate: '',
    endDate: '',
    bodyContent: ''
  });

  // WYSIWYG Editor States
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16');
  const [lineSpacing, setLineSpacing] = useState('1.6');
  const [verticalAlign, setVerticalAlign] = useState('top');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');
  const [showSourceView, setShowSourceView] = useState(false);
  const [showReviewSourceView, setShowReviewSourceView] = useState(false);
  const [showAlignmentDetails, setShowAlignmentDetails] = useState(false);
  const [currentDraft, setCurrentDraft] = useState('');
  const [alignmentScore] = useState(75);

  // Default content for the editor
  const defaultContent = `<h1>Executive Thought Leadership Content</h1><p>This is where your executive content will be created and refined to match their unique voice and expertise.</p><h2>About This Content</h2><p>AI-assisted content generation helps you maintain consistency while preserving the executive's authentic voice and perspective.</p>`;

  // WYSIWYG formatting helper
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  // Mock content timeline data
  const contentTimeline = [
    { id: 1, title: 'AI Leadership in 2025', execId: 'exec-1', execName: 'Sarah Chen', startDate: '2024-12-01', endDate: '2024-12-15', status: 'published', type: 'article', color: '#3b82f6' },
    { id: 2, title: 'Building Trust Through Transparency', execId: 'exec-2', execName: 'Marcus Rodriguez', startDate: '2024-12-10', endDate: '2024-12-20', status: 'in-review', type: 'linkedin', color: '#10b981' },
    { id: 3, title: 'Future of Tech Innovation', execId: 'exec-1', execName: 'Sarah Chen', startDate: '2024-12-18', endDate: '2025-01-05', status: 'draft', type: 'blog', color: '#3b82f6' },
    { id: 4, title: 'Customer-Centric Marketing', execId: 'exec-3', execName: 'Jamie Park', startDate: '2024-12-22', endDate: '2025-01-10', status: 'draft', type: 'article', color: '#f59e0b' },
    { id: 5, title: 'Ethical AI Practices', execId: 'exec-2', execName: 'Marcus Rodriguez', startDate: '2025-01-02', endDate: '2025-01-15', status: 'draft', type: 'linkedin', color: '#10b981' },
    { id: 6, title: 'Data-Driven Decision Making', execId: 'exec-1', execName: 'Sarah Chen', startDate: '2025-01-08', endDate: '2025-01-22', status: 'draft', type: 'whitepaper', color: '#3b82f6' },
    { id: 7, title: 'Leadership in Crisis', execId: 'exec-3', execName: 'Jamie Park', startDate: '2025-01-15', endDate: '2025-01-28', status: 'draft', type: 'article', color: '#f59e0b' },
  ];

  // Fetch executives
  const { data: executives = [], isLoading } = useQuery<Executive[]>({
    queryKey: ['/api/executives'],
  });

  // Create executive mutation
  const createMutation = useMutation({
    mutationFn: async (executive: Partial<Executive>) => {
      const res = await apiRequest('POST', '/api/executives', executive);
      return await res.json() as Executive;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/executives'] });
      // Set the newly created executive as active
      if (data?.id) {
        setActiveExecId(data.id);
      }
      toast({
        title: 'Success',
        description: 'Executive created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create executive',
        variant: 'destructive',
      });
    },
  });

  // Update executive mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Executive> }) => {
      return await apiRequest('PATCH', `/api/executives/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executives'] });
      toast({
        title: 'Success',
        description: 'Executive updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update executive',
        variant: 'destructive',
      });
    },
  });

  // Delete executive mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/executives/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executives'] });
      setDeleteDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Executive deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete executive',
        variant: 'destructive',
      });
    },
  });

  // Local state for tone mapping (optimistic updates)
  const [localToneMapping, setLocalToneMapping] = useState<Executive['toneMapping'] | null>(null);

  // Set active exec ID when executives load
  useEffect(() => {
    if (executives.length > 0 && !activeExecId) {
      setActiveExecId(executives[0].id);
    }
  }, [executives, activeExecId]);

  // Sync local tone mapping with server state when active exec changes
  useEffect(() => {
    const activeExec = executives.find((e) => e.id === activeExecId);
    if (activeExec?.toneMapping) {
      setLocalToneMapping(activeExec.toneMapping);
    }
  }, [activeExecId, executives]);

  const avg = (key: keyof Executive) => {
    if (executives.length === 0) return 0;
    return Math.round(
      executives.reduce((a, e) => a + ((e[key] as number) || 0), 0) / executives.length
    );
  };

  const activeExec = executives.find((e) => e.id === activeExecId);
  
  const updateExec = (patch: Partial<Executive>) => {
    if (!activeExecId) return;
    updateMutation.mutate({ id: activeExecId, data: patch });
  };

  const handleDeleteExecutive = () => {
    if (!activeExecId) return;
    
    // If deleting the active executive, switch to another one first
    const remainingExecs = executives.filter((e) => e.id !== activeExecId);
    if (remainingExecs.length > 0) {
      setActiveExecId(remainingExecs[0].id);
    }
    
    deleteMutation.mutate(activeExecId);
  };

  const addNewExecutive = () => {
    const newExec: Partial<Executive> = {
      name: 'New Executive',
      title: '',
      company: '',
      audience: '',
      goals: '',
      bio: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      reddit: '',
      wechat: '',
      website: '',
      expertise: [],
      followPeople: [],
      follows: [],
      eventsInterest: [],
      phrasesUse: '',
      phrasesAvoid: '',
      communities: [],
      newsSources: [],
      industry: '',
      vertical: '',
      motivates: '',
      personality: '',
      visibilityScore: 0,
      toneScore: 0,
      engagementScore: 0,
      personaScore: 0,
      toneMapping: {
        emotional: {
          reflective: 50,
          inspirational: 50,
          optimistic: 50,
          compassionate: 50,
          humor: 50,
        },
        persuasive: {
          assertive: 50,
          persuasive: 50,
          authoritative: 50,
        },
        communication: {
          serious: 50,
          conversational: 50,
          informative: 50,
          curious: 50,
          matterOfFact: 50,
        },
      },
    };
    createMutation.mutate(newExec);
  };

  // Helper to generate insights based on scores
  const generateProgramInsights = () => {
    const avgVisibility = avg('visibilityScore');
    const avgTone = avg('toneScore');
    const avgEngagement = avg('engagementScore');
    const avgPersona = avg('personaScore');
    
    const insights = [];
    const recommendations = [];
    
    if (avgVisibility >= 80) {
      insights.push('Strong visibility across the program with consistent executive presence.');
    } else if (avgVisibility >= 60) {
      insights.push('Moderate visibility levels - room for growth in reach and frequency.');
    } else {
      insights.push('Visibility below target - prioritize content cadence and channel expansion.');
    }
    
    if (avgTone >= 80) {
      insights.push('Brand voice is well-established and consistently applied.');
      recommendations.push('Maintain tone consistency while exploring new content formats.');
    } else if (avgTone >= 60) {
      insights.push('Tone mapping needs refinement for stronger brand differentiation.');
      recommendations.push('Review tone sliders and align with target audience expectations.');
    } else {
      insights.push('Significant tone alignment gaps identified across executives.');
      recommendations.push('Schedule brand voice workshop to calibrate messaging.');
    }
    
    if (avgEngagement >= 80) {
      insights.push('High engagement rates indicate strong audience resonance.');
    } else {
      recommendations.push('Test different content types and posting times to boost engagement.');
    }
    
    if (avgPersona >= 80) {
      insights.push('Executive personas are well-defined and audience-targeted.');
    } else {
      recommendations.push('Deepen persona profiles with audience research and competitive analysis.');
    }
    
    return { insights, recommendations };
  };

  const generateExecInsights = (exec: Executive) => {
    const insights = [];
    const recommendations = [];
    
    // Visibility insights
    if (exec.visibilityScore >= 80) {
      insights.push(`${exec.name} has excellent visibility and consistent presence.`);
    } else if (exec.visibilityScore >= 60) {
      insights.push(`Visibility is moderate - increase posting frequency on ${exec.linkedin ? 'LinkedIn' : 'active channels'}.`);
      recommendations.push('Target 3-4 posts per week with a mix of original content and curated insights.');
    } else {
      insights.push(`Low visibility score requires immediate attention to content cadence.`);
      recommendations.push('Start with 2 posts per week and gradually increase as rhythm is established.');
    }
    
    // Tone insights
    const topTones = Object.entries(exec.toneMapping.emotional)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([tone]) => tone);
    
    insights.push(`Dominant emotional tones: ${topTones.join(', ')} - aligns well with ${exec.audience.toLowerCase()} audience.`);
    
    if (exec.toneScore >= 80) {
      insights.push('Brand voice is consistent and authentic.');
    } else {
      recommendations.push('Review recent content against tone guidelines and adjust messaging.');
    }
    
    // Engagement insights
    if (exec.engagementScore >= 80) {
      insights.push('Strong engagement suggests content resonates with target audience.');
      recommendations.push('Double down on high-performing content themes and formats.');
    } else if (exec.engagementScore >= 60) {
      recommendations.push('Experiment with more interactive content: polls, questions, and personal stories.');
    } else {
      recommendations.push('Audit content for audience fit - ensure topics align with stated goals and expertise.');
    }
    
    // Persona insights
    if (exec.personaScore < 70) {
      recommendations.push('Complete all persona fields including expertise areas and communities for better targeting.');
    }
    
    // Expertise-based recommendations
    if (exec.expertise.length > 0) {
      recommendations.push(`Leverage expertise in ${exec.expertise.slice(0, 2).join(' and ')} for thought leadership content.`);
    }
    
    return { insights, recommendations };
  };

  const analyticsWeights = {
    Reach: 20,
    Engagement: 25,
    Authority: 25,
    Relationship: 15,
    Impact: 15,
  };

  const trendData = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        month: `M${i + 1}`,
        reach: 60 + ((i * 3) % 20),
        engage: 55 + ((i * 5) % 25),
        authority: 50 + ((i * 4) % 30),
        relation: 45 + ((i * 6) % 25),
        impact: 40 + ((i * 5) % 30),
      })),
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading executives...</p>
        </div>
      </div>
    );
  }

  if (executives.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <Card className="max-w-md text-center p-8">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Executives Yet</h2>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first executive profile to manage their visibility and brand voice.
          </p>
          <Button onClick={addNewExecutive} size="lg" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4 mr-2" />
            )}
            Create First Executive
          </Button>
        </Card>
      </div>
    );
  }

  // For overview step, we don't need activeExec - it works with executives array
  // For other steps, we need activeExec - the useEffect will auto-select first executive
  // But we allow overview to render even without activeExec

  const moduleColor = '#c009ba'; // Brand Craft pink

  const steps = [
    { id: 'overview', label: 'Overview', description: 'Program summary and executive roster' },
    { id: 'create', label: 'Set Up Execs', description: 'Build executive profiles and tone mapping' },
    { id: 'insights', label: 'Insights', description: 'Discover people to follow, trending topics, and engagement opportunities' },
    { id: 'draft-approvals', label: 'Draft & Approvals', description: 'Create content, review, and approve for publication' },
    { id: 'content-calendar', label: 'Content Calendar', description: 'Timeline visualization and scheduling' }
  ];

  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>
        Brand Craft
      </h2>
      <p className="text-sm text-muted-foreground mt-1">Executive Visibility</p>
    </div>
  );

  const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto bg-white relative brandcraft-buttons">
        <style>{`
          /* Override all default buttons to use BrandCraft pink */
          .brandcraft-buttons button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]) {
            background-color: ${moduleColor} !important;
            border-color: ${moduleColor} !important;
            color: white !important;
          }
          .brandcraft-buttons button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]):hover {
            opacity: 0.9 !important;
          }
        `}</style>
        <div className="p-8">
          <QuickActions module="BrandCraft" />
        </div>
        
        {/* Exec Voice Check - Right Side Panel */}
        {showVoicePanel && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed right-0 top-0 h-screen w-[25%] bg-background border-l shadow-2xl z-50 overflow-y-auto"
          data-testid="voice-helper-panel"
        >
          <div className="p-4 border-b sticky top-0 bg-background z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Exec Voice Check</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVoicePanel(false)}
              data-testid="button-close-voice-helper"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Select Executive</Label>
              <Select value={activeExecId} onValueChange={setActiveExecId}>
                <SelectTrigger className="w-full" data-testid="select-voice-check-exec">
                  <SelectValue placeholder="Choose executive..." />
                </SelectTrigger>
                <SelectContent>
                  {executives.map((exec) => (
                    <SelectItem key={exec.id} value={exec.id}>
                      {exec.name} - {exec.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Voice Analysis for {activeExec?.name || 'Executive'}</h4>
              <p className="text-xs text-muted-foreground">
                AI-powered evaluation against persona and brand voice guidelines
              </p>
            </div>

            {/* Scores Grid */}
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Tone Match</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Persona Fit</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">88%</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Voice Consistency</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">75%</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Overall Score</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">85%</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold flex items-center gap-1">
                <Info className="w-3 h-3" />
                Recommendations
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-md border border-yellow-200 dark:border-yellow-900">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      Voice Consistency Alert
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                      Recent draft uses phrases flagged in "Avoid" list. Consider: "synergy", "low-hanging fruit"
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 h-6 text-xs">
                      Review Flagged Phrases
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-900">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-800 dark:text-green-200">
                      Tone Mapping Strong
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                      Draft aligns well with target emotional tone: compassionate (85%), conversational (85%)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">💡</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                      Opportunity for Improvement
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                      Consider adding more "curious" tone elements to match persona target (current: 65%, target: 80%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

        <div className="bg-white px-8 py-4 border-b border-pink-100 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Executive Visibility</h1>
              <p className="text-gray-600 max-w-3xl">
                Build executive profiles, manage thought leadership content, and track visibility metrics.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVoicePanel(!showVoicePanel)}
              className={`flex items-center gap-2 relative ${showVoicePanel ? 'bg-primary/10' : ''}`}
              data-testid="button-toggle-voice-check"
            >
              <Sparkles className={`w-4 h-4 ${showVoicePanel ? 'text-primary' : ''}`} />
              Exec Voice Check
              <motion.span
                className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                data-testid="voice-helper-alert"
              />
            </Button>
          </div>
        </div>

        <div className="p-8">

      {/* Overview */}
      {activeStep === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Program Summary
              </h3>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Visibility', value: avg('visibilityScore') },
                { label: 'Avg Tone', value: avg('toneScore') },
                { label: 'Avg Engagement', value: avg('engagementScore') },
                { label: 'Avg Persona', value: avg('personaScore') },
              ].map(({ label, value }) => (
                <MetricCard key={label} label={label} value={`${value}%`} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Workflow className="w-4 h-4" /> Executive Summaries
              </h3>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {executives.map((e) => (
                <Card key={e.id} className="p-4 border shadow-sm bg-background">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-base font-medium">{e.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {e.title}
                        {e.company ? ` • ${e.company}` : ''}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={e.id === activeExecId ? 'default' : 'outline'}
                      onClick={() => setActiveExecId(e.id)}
                      data-testid={`button-focus-${e.id}`}
                    >
                      Focus
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Progress value={e.visibilityScore} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Visibility: {e.visibilityScore}%
                      </p>
                    </div>
                    <div>
                      <Progress value={e.toneScore} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tone: {e.toneScore}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs">
                      <strong>Audience:</strong> {e.audience}
                    </p>
                    <p className="text-xs">
                      <strong>Goals:</strong> {e.goals}
                    </p>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create / Edit Executives */}
      {activeStep === 'create' && activeExec && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Executive Selector */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Viewing Profile:</Label>
                <Select value={activeExecId} onValueChange={setActiveExecId}>
                  <SelectTrigger className="w-[280px]" data-testid="select-active-exec">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executives.map(exec => (
                      <SelectItem key={exec.id} value={exec.id}>
                        {exec.name} — {exec.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Settings className="w-4 h-4" /> Create / Edit Executives
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNewExecutive}
                  disabled={createMutation.isPending}
                  data-testid="button-new-executive"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <PlusCircle className="w-4 h-4 mr-1" />
                  )}
                  New Executive
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-save" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={executives.length <= 1 || deleteMutation.isPending}
                  data-testid="button-delete-executive"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Exec switcher */}
              <div className="flex flex-wrap gap-2">
                {executives.map((e) => (
                  <Button
                    key={e.id}
                    variant={e.id === activeExecId ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveExecId(e.id)}
                    data-testid={`button-select-exec-${e.id}`}
                  >
                    {e.name}
                  </Button>
                ))}
              </div>

              <Tabs value={createTab} onValueChange={setCreateTab}>
                <TabsList className="flex flex-wrap gap-2 bg-muted/30 p-2 rounded-md w-full justify-start">
                  <TabsTrigger value="persona" data-testid="tab-persona">
                    Persona Builder
                  </TabsTrigger>
                  <TabsTrigger value="tone" data-testid="tab-tone">
                    Tone Mapping
                  </TabsTrigger>
                  <TabsTrigger value="links" data-testid="tab-links">
                    Links & Presence
                  </TabsTrigger>
                  <TabsTrigger value="pov" data-testid="tab-pov">
                    POV
                  </TabsTrigger>
                </TabsList>

                {/* Persona Builder */}
                <TabsContent value="persona" className="space-y-4 py-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <Input
                        value={activeExec.name}
                        onChange={(e) => updateExec({ name: e.target.value })}
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Title</label>
                      <Input
                        value={activeExec.title}
                        onChange={(e) => updateExec({ title: e.target.value })}
                        data-testid="input-title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Company</label>
                      <Input
                        value={activeExec.company || ''}
                        onChange={(e) => updateExec({ company: e.target.value })}
                        data-testid="input-company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Bio</label>
                    <Textarea
                      rows={3}
                      value={activeExec.bio}
                      onChange={(e) => updateExec({ bio: e.target.value })}
                      data-testid="textarea-bio"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Audience</label>
                      <Input
                        value={activeExec.audience}
                        onChange={(e) => updateExec({ audience: e.target.value })}
                        data-testid="input-audience"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Goals</label>
                      <Input
                        value={activeExec.goals}
                        onChange={(e) => updateExec({ goals: e.target.value })}
                        data-testid="input-goals"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Areas of Expertise (up to 5)
                    </label>
                    <ChipsInput
                      value={activeExec.expertise}
                      onChange={(v) => updateExec({ expertise: v.slice(0, 5) })}
                      placeholder="Add an expertise and press Enter"
                      max={5}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        People you follow
                      </label>
                      <ChipsInput
                        value={activeExec.followPeople}
                        onChange={(v) => updateExec({ followPeople: v })}
                        placeholder="Add a person"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Publications / Podcasts you follow
                      </label>
                      <ChipsInput
                        value={activeExec.follows}
                        onChange={(v) => updateExec({ follows: v })}
                        placeholder="Add a publication or podcast"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Events of Interest
                    </label>
                    <ChipsInput
                      value={activeExec.eventsInterest}
                      onChange={(v) => updateExec({ eventsInterest: v })}
                      placeholder="Add an event"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Industry</label>
                      <Input
                        value={activeExec.industry}
                        onChange={(e) => updateExec({ industry: e.target.value })}
                        data-testid="input-industry"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Vertical</label>
                      <Input
                        value={activeExec.vertical}
                        onChange={(e) => updateExec({ vertical: e.target.value })}
                        data-testid="input-vertical"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        What motivates you
                      </label>
                      <Input
                        value={activeExec.motivates}
                        onChange={(e) => updateExec({ motivates: e.target.value })}
                        data-testid="input-motivates"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Describe your personality
                    </label>
                    <Textarea
                      rows={2}
                      value={activeExec.personality}
                      onChange={(e) => updateExec({ personality: e.target.value })}
                      data-testid="textarea-personality"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Communities & Associations
                      </label>
                      <ChipsInput
                        value={activeExec.communities}
                        onChange={(v) => updateExec({ communities: v })}
                        placeholder="Add a community"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Where you get news & information
                      </label>
                      <ChipsInput
                        value={activeExec.newsSources}
                        onChange={(v) => updateExec({ newsSources: v })}
                        placeholder="Add a source"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tone Mapping */}
                <TabsContent value="tone" className="space-y-6 py-4">
                  <div className="grid gap-6">
                    {/* Emotional Tones */}
                    <Card className="p-4">
                      <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                        <Gauge className="w-4 h-4" /> Emotional Tones
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(localToneMapping?.emotional || {}).map(([k, v]) => (
                          <div key={k} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium items-center">
                              <span className="capitalize">{k}</span>
                              <span className="text-muted-foreground">{v}%</span>
                            </div>
                            <Slider
                              value={[v]}
                              max={100}
                              step={1}
                              onValueChange={([val]) =>
                                setLocalToneMapping({
                                  ...localToneMapping!,
                                  emotional: {
                                    ...localToneMapping!.emotional,
                                    [k]: val,
                                  },
                                })
                              }
                              onValueCommit={([val]) =>
                                updateExec({
                                  toneMapping: {
                                    ...localToneMapping!,
                                    emotional: {
                                      ...localToneMapping!.emotional,
                                      [k]: val,
                                    },
                                  },
                                })
                              }
                              data-testid={`slider-emotional-${k.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Persuasive Tones */}
                    <Card className="p-4">
                      <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                        <Megaphone className="w-4 h-4" /> Persuasive Tones
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(localToneMapping?.persuasive || {}).map(([k, v]) => (
                          <div key={k} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium items-center">
                              <span className="capitalize">{k}</span>
                              <span className="text-muted-foreground">{v}%</span>
                            </div>
                            <Slider
                              value={[v]}
                              max={100}
                              step={1}
                              onValueChange={([val]) =>
                                setLocalToneMapping({
                                  ...localToneMapping!,
                                  persuasive: {
                                    ...localToneMapping!.persuasive,
                                    [k]: val,
                                  },
                                })
                              }
                              onValueCommit={([val]) =>
                                updateExec({
                                  toneMapping: {
                                    ...localToneMapping!,
                                    persuasive: {
                                      ...localToneMapping!.persuasive,
                                      [k]: val,
                                    },
                                  },
                                })
                              }
                              data-testid={`slider-persuasive-${k.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Communication Tones */}
                    <Card className="p-4">
                      <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Communication Tones
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(localToneMapping?.communication || {}).map(([k, v]) => (
                          <div key={k} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium items-center">
                              <span className="capitalize">{k === 'matterOfFact' ? 'Matter of Fact' : k}</span>
                              <span className="text-muted-foreground">{v}%</span>
                            </div>
                            <Slider
                              value={[v]}
                              max={100}
                              step={1}
                              onValueChange={([val]) =>
                                setLocalToneMapping({
                                  ...localToneMapping!,
                                  communication: {
                                    ...localToneMapping!.communication,
                                    [k]: val,
                                  },
                                })
                              }
                              onValueCommit={([val]) =>
                                updateExec({
                                  toneMapping: {
                                    ...localToneMapping!,
                                    communication: {
                                      ...localToneMapping!.communication,
                                      [k]: val,
                                    },
                                  },
                                })
                              }
                              data-testid={`slider-communication-${k.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Language & Phrases and Voice Rules in a row */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      {/* Language & Phrases */}
                      <Card className="p-4">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> Language & Phrases
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Signature Phrases
                            </label>
                            <Textarea
                              rows={2}
                              value={activeExec.phrasesUse}
                              onChange={(e) => updateExec({ phrasesUse: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">Avoid</label>
                            <Textarea
                              rows={2}
                              value={activeExec.phrasesAvoid}
                              onChange={(e) => updateExec({ phrasesAvoid: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Examples (short excerpts)
                            </label>
                            <Textarea
                              rows={3}
                              placeholder="Paste 2–3 short samples that feel on‑voice"
                            />
                          </div>
                        </div>
                      </Card>

                      {/* Voice Rules */}
                      <Card className="p-4">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" /> Voice Rules & Guardrails
                        </h4>
                        <ul className="text-xs space-y-2 list-disc pl-5 text-muted-foreground">
                          <li>Prefer short paragraphs and plain language.</li>
                          <li>Lead with clarity; avoid hype and filler.</li>
                          <li>Coach, don't posture. Tie ideas to outcomes.</li>
                        </ul>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          <Save className="w-4 h-4 mr-1" /> Save Tone Profile
                        </Button>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Links & Presence */}
                <TabsContent value="links" className="space-y-4 py-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Website URL"
                      value={activeExec.website}
                      onChange={(e) => updateExec({ website: e.target.value })}
                      data-testid="input-website"
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      value={activeExec.linkedin}
                      onChange={(e) => updateExec({ linkedin: e.target.value })}
                      data-testid="input-linkedin"
                    />
                    <Input
                      placeholder="X / Twitter URL"
                      value={activeExec.twitter}
                      onChange={(e) => updateExec({ twitter: e.target.value })}
                      data-testid="input-twitter"
                    />
                    <Input
                      placeholder="Facebook URL"
                      value={activeExec.facebook}
                      onChange={(e) => updateExec({ facebook: e.target.value })}
                      data-testid="input-facebook"
                    />
                    <Input
                      placeholder="Instagram URL"
                      value={activeExec.instagram}
                      onChange={(e) => updateExec({ instagram: e.target.value })}
                      data-testid="input-instagram"
                    />
                    <Input
                      placeholder="YouTube URL"
                      value={activeExec.youtube}
                      onChange={(e) => updateExec({ youtube: e.target.value })}
                      data-testid="input-youtube"
                    />
                    <Input
                      placeholder="TikTok URL"
                      value={activeExec.tiktok}
                      onChange={(e) => updateExec({ tiktok: e.target.value })}
                      data-testid="input-tiktok"
                    />
                    <Input
                      placeholder="Reddit URL"
                      value={activeExec.reddit}
                      onChange={(e) => updateExec({ reddit: e.target.value })}
                      data-testid="input-reddit"
                    />
                    <Input
                      placeholder="WeChat URL"
                      value={activeExec.wechat}
                      onChange={(e) => updateExec({ wechat: e.target.value })}
                      data-testid="input-wechat"
                    />
                  </div>
                </TabsContent>

                {/* POV */}
                <TabsContent value="pov" className="space-y-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Points of View (POV)
                      </label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newPov = {
                            id: crypto.randomUUID(),
                            topic: '',
                            povText: '',
                          };
                          updateExec({
                            povs: [...((activeExec as any).povs || []), newPov],
                          } as any);
                        }}
                        data-testid="button-add-pov"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add POVs
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Capture topics and your perspective on them for content drafting
                    </p>
                    
                    {(activeExec as any).povs && (activeExec as any).povs.length > 0 ? (
                      <div className="space-y-3">
                        {(activeExec as any).povs.map((pov: any, index: number) => (
                          <Card key={pov.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Topic
                                  </label>
                                  <Input
                                    value={pov.topic}
                                    onChange={(e) => {
                                      const updatedPovs = [...(activeExec as any).povs!];
                                      updatedPovs[index] = {
                                        ...pov,
                                        topic: e.target.value,
                                      };
                                      updateExec({ povs: updatedPovs } as any);
                                    }}
                                    placeholder="e.g., AI in Marketing"
                                    data-testid={`input-pov-topic-${index}`}
                                  />
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 mt-5"
                                  onClick={() => {
                                    const updatedPovs = (activeExec as any).povs!.filter(
                                      (_: any, i: number) => i !== index
                                    );
                                    updateExec({ povs: updatedPovs } as any);
                                  }}
                                  data-testid={`button-delete-pov-${index}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                  Your Point of View
                                </label>
                                <Textarea
                                  rows={3}
                                  value={pov.povText}
                                  onChange={(e) => {
                                    const updatedPovs = [...(activeExec as any).povs!];
                                    updatedPovs[index] = {
                                      ...pov,
                                      povText: e.target.value,
                                    };
                                    updateExec({ povs: updatedPovs } as any);
                                  }}
                                  placeholder="Describe your perspective on this topic..."
                                  data-testid={`textarea-pov-text-${index}`}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-6 text-center text-sm text-muted-foreground">
                        No POVs added yet. Click "Add POV" to get started.
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Insights */}
      {activeStep === 'insights' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Executive Selector */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Viewing Profile:</Label>
                <Select value={activeExecId} onValueChange={setActiveExecId}>
                  <SelectTrigger className="w-[280px]" data-testid="select-active-exec">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executives.map(exec => (
                      <SelectItem key={exec.id} value={exec.id}>
                        {exec.name} — {exec.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Insights & Intelligence
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Discover engagement opportunities, trending topics, and thought leadership ideas to amplify executive visibility.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Three Insight Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <CardHeader className="p-0 mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />Industry Trends
                    </h4>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="text-sm space-y-2">
                      <li className="flex gap-2"><span>⚡</span><span>Thought leadership on sustainability driving engagement</span></li>
                      <li className="flex gap-2"><span>📊</span><span>Increased posts on AI ethics and leadership tone</span></li>
                      <li className="flex gap-2"><span>🎙️</span><span>Brand storytelling content outperforming product posts</span></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardHeader className="p-0 mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" />Peers to Engage
                    </h4>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="text-sm space-y-2">
                      <li><strong>Sarah Lin</strong> — CMO at DataStream → <span className="text-primary cursor-pointer underline">Comment on her AI adoption thread</span></li>
                      <li><strong>James Porter</strong> — VP Marketing, FinEdge → <span className="text-primary cursor-pointer underline">Engage with his POV on leadership tone</span></li>
                      <li><strong>Lena Cruz</strong> — Brand Strategist → <span className="text-primary cursor-pointer underline">Share her insights on community engagement</span></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardHeader className="p-0 mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4" />Signals to Monitor
                    </h4>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="text-sm space-y-2">
                      <li className="flex gap-2"><span>🔔</span><span>Surge in engagement on B2B influencer partnerships</span></li>
                      <li className="flex gap-2"><span>📈</span><span>Growing trend: exec-led video commentary</span></li>
                      <li className="flex gap-2"><span>💬</span><span>High-performing hashtags: #LeadershipInAction, #CMOChat</span></li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Topics for Consideration */}
              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-semibold">Topics for Consideration</h2>
                <p className="text-sm text-muted-foreground">
                  Recommended content topics based on trending conversations, peer activity, and {activeExec?.name || 'the executive'}'s expertise areas.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 1, topic: 'AI in Marketing Strategy', insight: 'Rising CMO adoption of AI-driven content orchestration.', fit: 80, impact: 85, hasPOV: true },
                    { id: 2, topic: 'Human-Led Brand Building', insight: 'Execs gaining traction on leadership content and culture-driven narratives.', fit: 90, impact: 92, hasPOV: true },
                    { id: 3, topic: 'Ethical Use of AI', insight: 'CMOs emphasizing responsible data practices in thought leadership.', fit: 75, impact: 88, hasPOV: true },
                    { id: 4, topic: 'Brand Storytelling Trends', insight: 'Shift from product-led to story-led marketing strategies.', fit: 85, impact: 89, hasPOV: true },
                    { id: 5, topic: 'Customer Advocacy Programs', insight: 'Brands investing more in peer-driven campaigns for authenticity.', fit: 78, impact: 80, hasPOV: true },
                    { id: 6, topic: 'Cross-Functional GTM Alignment', insight: 'Need for tighter sync between marketing, sales, and success.', fit: 82, impact: 87, hasPOV: true },
                    { id: 7, topic: 'Data-Driven Creativity', insight: 'Teams blending analytics and creativity for more resonant campaigns.', fit: 88, impact: 90, hasPOV: false },
                    { id: 8, topic: 'Leadership Tone in Public Channels', insight: 'Executives balancing professional and personal voice for reach.', fit: 93, impact: 95, hasPOV: false },
                    { id: 9, topic: 'Sustainable Marketing Practices', insight: 'Growing focus on eco-conscious brand positioning and operations.', fit: 77, impact: 83, hasPOV: false },
                    { id: 10, topic: 'Community-Driven Growth', insight: 'Brands building engaged communities for long-term loyalty.', fit: 84, impact: 86, hasPOV: false },
                    { id: 11, topic: 'Marketing Technology Integration', insight: 'Teams streamlining tech stacks for better data flow and efficiency.', fit: 79, impact: 81, hasPOV: false },
                    { id: 12, topic: 'Employee Advocacy Programs', insight: 'Empowering employees as brand ambassadors for authentic reach.', fit: 86, impact: 88, hasPOV: false },
                  ].map(t => (
                    <Card key={t.id} className="p-3">
                      <h3 className="font-medium text-sm mb-1">{t.topic}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{t.insight}</p>
                      <div className="flex justify-between items-center text-xs gap-2">
                        <span className="text-muted-foreground">Fit: {t.fit}%</span>
                        <span className="text-muted-foreground">Impact: {t.impact}%</span>
                        <Button 
                          size="sm" 
                          variant={t.hasPOV ? 'default' : 'outline'}
                          data-testid={`button-${t.hasPOV ? 'draft' : 'pov'}-topic-${t.id}`}
                          onClick={() => {
                            if (t.hasPOV) {
                              toast({
                                title: "Added to Drafts",
                                description: `${t.topic} added to Draft & Approvals`,
                              });
                              setActiveStep('draft-approvals');
                            } else {
                              setSelectedTopic({ id: t.id, topic: t.topic });
                              setPovDialogOpen(true);
                            }
                          }}
                        >
                          {t.hasPOV ? 'Draft' : 'Need POV'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setActiveStep('draft-approvals')}
              style={{ backgroundColor: moduleColor }}
              className="text-white"
              data-testid="button-continue-draft"
            >
              Continue to Draft & Approvals <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Content Calendar */}
      {activeStep === 'content-calendar' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Executive Selector */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Viewing Profile:</Label>
                <Select value={activeExecId} onValueChange={setActiveExecId}>
                  <SelectTrigger className="w-[280px]" data-testid="select-active-exec">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executives.map(exec => (
                      <SelectItem key={exec.id} value={exec.id}>
                        {exec.name} — {exec.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Content Calendar
              </h3>
              {/* View Controls */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Group by:</label>
                <Select value={calendarTab} onValueChange={setCalendarTab}>
                  <SelectTrigger className="w-[150px]" data-testid="select-calendar-view">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timeline">Timeline View</SelectItem>
                    <SelectItem value="executive">By Executive</SelectItem>
                    <SelectItem value="month">By Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={calendarTab} onValueChange={setCalendarTab}>
                <TabsList className="grid grid-cols-3 w-full mb-6 bg-[#c009ba] dark:bg-[#a00898]">
                  <TabsTrigger value="timeline" data-testid="tab-timeline-view" className="data-[state=active]:bg-[#9008a0] data-[state=active]:text-white dark:data-[state=active]:bg-[#b009c0] data-[state=inactive]:text-white/70">Timeline View</TabsTrigger>
                  <TabsTrigger value="executive" data-testid="tab-executive-view" className="data-[state=active]:bg-[#9008a0] data-[state=active]:text-white dark:data-[state=active]:bg-[#b009c0] data-[state=inactive]:text-white/70">By Executive</TabsTrigger>
                  <TabsTrigger value="month" data-testid="tab-month-view" className="data-[state=active]:bg-[#9008a0] data-[state=active]:text-white dark:data-[state=active]:bg-[#b009c0] data-[state=inactive]:text-white/70">By Month</TabsTrigger>
                </TabsList>

                {/* Timeline View Tab */}
                <TabsContent value="timeline" className="space-y-6">
                  {/* Filters */}
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Executive:</label>
                      <Select value={timelineFilterExec} onValueChange={setTimelineFilterExec}>
                        <SelectTrigger className="w-[180px]" data-testid="filter-exec">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Executives</SelectItem>
                          {executives.map(exec => (
                            <SelectItem key={exec.id} value={exec.id}>{exec.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Status:</label>
                      <Select value={timelineFilterStatus} onValueChange={setTimelineFilterStatus}>
                        <SelectTrigger className="w-[150px]" data-testid="filter-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="in-review">In Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button size="sm" variant="outline" data-testid="button-add-content">
                        <Plus className="w-4 h-4 mr-1" />Add Content
                      </Button>
                    </div>
                  </div>

                  {/* Gantt Timeline */}
                  <Card className="p-6">
                    <h3 className="text-base font-semibold mb-4">Content Timeline</h3>
                    <div className="space-y-3">
                      {contentTimeline
                        .filter(item => 
                          (timelineFilterExec === 'all' || item.execId === timelineFilterExec) &&
                          (timelineFilterStatus === 'all' || item.status === timelineFilterStatus)
                        )
                        .map((item) => {
                          const startDate = new Date(item.startDate);
                          const endDate = new Date(item.endDate);
                          const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                          const daysFromStart = Math.ceil((startDate.getTime() - new Date('2024-12-01').getTime()) / (1000 * 60 * 60 * 24));
                          const leftPosition = (daysFromStart / 60) * 100;
                          const barWidth = (totalDays / 60) * 100;

                          return (
                            <div key={item.id} className="relative" data-testid={`timeline-item-${item.id}`}>
                              <div className="flex items-center gap-3 mb-1">
                                <div className="w-48 text-sm font-medium truncate">{item.title}</div>
                                <div className="flex-1 relative h-10 bg-muted/20 rounded-md overflow-hidden">
                                  <div
                                    className="absolute top-1 h-8 rounded-md flex items-center px-2 text-xs text-white font-medium"
                                    style={{
                                      left: `${leftPosition}%`,
                                      width: `${barWidth}%`,
                                      backgroundColor: item.color,
                                      minWidth: '60px'
                                    }}
                                  >
                                    <span className="truncate">{item.execName}</span>
                                  </div>
                                </div>
                                <div className="w-24 flex items-center gap-2">
                                  <div className={`text-xs px-2 py-1 rounded-full ${
                                    item.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                    item.status === 'in-review' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {item.status === 'published' ? 'Published' : item.status === 'in-review' ? 'In Review' : 'Draft'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground pl-48">
                                <span>{startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}</span>
                                <span className="capitalize">{item.type}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {contentTimeline.filter(item => 
                      (timelineFilterExec === 'all' || item.execId === timelineFilterExec) &&
                      (timelineFilterStatus === 'all' || item.status === timelineFilterStatus)
                    ).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No content matches the selected filters
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* By Executive Tab */}
                <TabsContent value="executive" className="space-y-6">
                  {/* Group content by executive */}
                  {executives.map((exec) => {
                    const execContent = contentTimeline.filter(item => item.execId === exec.id ||  item.execName === exec.name);
                    if (execContent.length === 0) return null;
                    
                    return (
                      <Card key={exec.id} className="p-6">
                        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" />{exec.name} - {execContent.length} Content Pieces
                        </h3>
                        <div className="space-y-2">
                          {execContent.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  item.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                  item.status === 'in-review' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}>
                                  {item.status === 'published' ? 'Published' : item.status === 'in-review' ? 'In Review' : 'Draft'}
                                </div>
                                <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </TabsContent>

                {/* By Month Tab */}
                <TabsContent value="month" className="space-y-6">
                  {/* Group content by month */}
                  {['December 2024', 'January 2025'].map((month) => {
                    const monthContent = month === 'December 2024' 
                      ? contentTimeline.filter(item => item.startDate.startsWith('2024-12'))
                      : contentTimeline.filter(item => item.startDate.startsWith('2025-01'));
                    
                    if (monthContent.length === 0) return null;
                    
                    return (
                      <Card key={month} className="p-6">
                        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />{month} - {monthContent.length} Content Pieces
                        </h3>
                        <div className="space-y-2">
                          {monthContent.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()} • {item.execName}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  item.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                  item.status === 'in-review' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}>
                                  {item.status === 'published' ? 'Published' : item.status === 'in-review' ? 'In Review' : 'Draft'}
                                </div>
                                <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Draft & Approvals */}
      {activeStep === 'draft-approvals' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                Step 4 of 5
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Draft & Approvals</h1>
            <p className="text-muted-foreground">Create AI-assisted drafts, format content, and manage the approval workflow</p>
          </div>

          {/* Executive Selector */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Viewing Profile:</Label>
                <Select value={activeExecId} onValueChange={setActiveExecId}>
                  <SelectTrigger className="w-[280px]" data-testid="select-active-exec">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {executives.map(exec => (
                      <SelectItem key={exec.id} value={exec.id}>
                        {exec.name} — {exec.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Coaching Prompt */}
          <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Review AI-generated drafts for {activeExec?.name || 'the executive'}, edit content in the comprehensive WYSIWYG editor, and manage the three-stage approval workflow (Drafts → Review → Approval).</p>
                  <p><strong>Expected outcome:</strong> Executive thought leadership content with authentic voice and proper formatting ready for publication. Track versions and collaboration through the color-coded workflow stages.</p>
                  <p><strong>Tip:</strong> AI creates first drafts—your role is to inject the executive's authentic voice and unique perspective. Use the full formatting toolbar to structure content professionally.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Selector - Color-coded for workflow visibility */}
          <div className="flex gap-3 p-1 bg-muted/30 rounded-md">
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 ${
                approvalStage === 'drafts-view' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300' 
                  : 'border-transparent'
              }`}
              onClick={() => setApprovalStage('drafts-view')}
              data-testid="button-stage-drafts"
            >
              Drafts
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 ${
                approvalStage === 'review' 
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300' 
                  : 'border-transparent'
              }`}
              onClick={() => setApprovalStage('review')}
              data-testid="button-stage-review"
            >
              Review
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 ${
                approvalStage === 'approval' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300' 
                  : 'border-transparent'
              }`}
              onClick={() => setApprovalStage('approval')}
              data-testid="button-stage-approval"
            >
              Approval
            </Button>
          </div>

          {/* DRAFTS VIEW */}
          {approvalStage === 'drafts-view' && !editingDraft && (
            <div className="space-y-4">
              {/* Draft Items List */}
              <div className="grid gap-3">
                {[
                  { 
                    id: 1, 
                    title: 'The Future of AI in Executive Decision-Making',
                    type: 'LinkedIn Article',
                    status: 'draft',
                    lastEdit: '2 hours ago',
                    author: activeExec?.name || 'Executive',
                    wordCount: 1890,
                    content: '<h1>The Future of AI in Executive Decision-Making</h1><p>As an executive leader, I\'ve witnessed firsthand how AI is reshaping how we make strategic decisions...</p>'
                  },
                  { 
                    id: 2, 
                    title: 'Building High-Performance Teams in a Hybrid World',
                    type: 'Blog Post',
                    status: 'review',
                    lastEdit: '1 day ago',
                    author: activeExec?.name || 'Executive',
                    wordCount: 2145,
                    content: '<h1>Building High-Performance Teams</h1><p>The landscape of team leadership has fundamentally changed...</p>'
                  }
                ].map((draft) => (
                  <Card key={draft.id} className="hover:bg-muted/30 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{draft.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              draft.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {draft.status === 'draft' ? 'Draft' : 'In Review'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{draft.type}</span>
                            <span>•</span>
                            <span>{draft.wordCount} words</span>
                            <span>•</span>
                            <span>{draft.author}</span>
                            <span>•</span>
                            <span>{draft.lastEdit}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingDraft({ id: draft.id, title: draft.title, content: draft.content })
                              setCurrentDraft(draft.content)
                            }}
                            data-testid={`button-edit-draft-${draft.id}`}
                          >
                            <Edit3 className="w-4 h-4 mr-1"/>Edit
                          </Button>
                          <Button size="sm" variant="ghost" data-testid={`button-delete-draft-${draft.id}`}>
                            <X className="w-4 h-4"/>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                data-testid="button-create-draft"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-1"/>Create New Draft for {activeExec?.name || 'Executive'}
              </Button>
            </div>
          )}

          {/* DRAFT EDITOR */}
          {approvalStage === 'drafts-view' && editingDraft && (
            <div className="space-y-4">
              {/* Editor Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingDraft(null)}
                    data-testid="button-back-to-drafts"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1"/>Back to Drafts
                  </Button>
                  <h3 className="text-base font-semibold">{editingDraft.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{currentDraft.split(' ').filter(w => w).length} words</span>
              </div>

              {/* AI Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles size={16} style={{ color: moduleColor }} />
                    AI Draft Generator for {activeExec?.name || 'Executive'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/30 border rounded-md p-3 text-xs space-y-1">
                    <p><strong>Executive:</strong> {activeExec?.name || 'Executive'} — {activeExec?.title || ''}</p>
                    <p><strong>Voice Profile:</strong> {activeExec?.personality || ''}</p>
                    <p><strong>Expertise:</strong> {activeExec?.expertise?.join(', ') || ''}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const generatedContent = currentDraft + "\n\n[AI-generated content based on " + (activeExec?.name || 'the executive') + "'s voice profile and expertise would appear here. This demonstrates the Generate Content feature that leverages AI to expand on ideas while maintaining the executive's authentic voice and perspective.]"
                        setCurrentDraft(generatedContent)
                        toast({
                          title: "Content generated",
                          description: "New content has been added to your draft",
                        })
                      }}
                      data-testid="button-generate-draft"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Generate AI Draft
                    </Button>
                    <Button size="sm" variant="outline" data-testid="button-save-draft">
                      <Save className="h-4 w-4 mr-1"/>Save
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Sent to review",
                          description: "Draft has been sent for review",
                        })
                        setEditingDraft(null)
                        setApprovalStage('review')
                      }}
                      data-testid="button-send-to-review"
                    >
                      <Send className="h-4 w-4 mr-1"/>Send to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Template Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText size={16} />
                    Template Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'Thought Leadership',
                      'Industry Insights',
                      'Leadership Lessons',
                      'Market Analysis',
                      'Innovation Story',
                      'Executive Perspective'
                    ].map((template) => (
                      <Button 
                        key={template}
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Template Applied",
                            description: `${template} template has been applied to your draft`,
                          })
                        }}
                        data-testid={`button-template-${template.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* WYSIWYG Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Content Editor</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={showSourceView ? 'default' : 'ghost'}
                        onClick={() => setShowSourceView(!showSourceView)}
                        data-testid="button-toggle-source-view"
                      >
                        <Code className="h-4 w-4 mr-1"/>
                        {showSourceView ? 'Visual' : 'Source'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* COMPREHENSIVE Formatting Toolbar */}
                  {!showSourceView && (
                    <div className="space-y-2">
                      {/* Row 1: Font, Size, Color, Background */}
                      <div className="flex flex-wrap gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-md border border-purple-200 dark:border-purple-800">
                        <Select value={fontFamily} onValueChange={(value) => { setFontFamily(value); applyFormat('fontName', value) }}>
                          <SelectTrigger className="h-8 w-[140px]" data-testid="select-font-family">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={fontSize} onValueChange={(value) => { setFontSize(value); applyFormat('fontSize', value) }}>
                          <SelectTrigger className="h-8 w-[80px]" data-testid="select-font-size">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">8pt</SelectItem>
                            <SelectItem value="2">10pt</SelectItem>
                            <SelectItem value="3">12pt</SelectItem>
                            <SelectItem value="4">14pt</SelectItem>
                            <SelectItem value="5">16pt</SelectItem>
                            <SelectItem value="6">18pt</SelectItem>
                            <SelectItem value="7">24pt</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Color:</label>
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => { setTextColor(e.target.value); applyFormat('foreColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-text-color"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Highlight:</label>
                          <input 
                            type="color" 
                            value={bgColor}
                            onChange={(e) => { setBgColor(e.target.value); applyFormat('backColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-bg-color"
                          />
                        </div>
                        <div className="w-px bg-border mx-1" />
                        <Select value={lineSpacing} onValueChange={(value) => { setLineSpacing(value); document.execCommand('formatBlock', false, 'p'); const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { const range = sel.getRangeAt(0); let parent = range.commonAncestorContainer.parentElement; while (parent && parent.tagName !== 'P' && parent.tagName !== 'DIV') { parent = parent.parentElement; } if (parent) parent.style.lineHeight = value; } }}>
                          <SelectTrigger className="h-8 w-[110px]" data-testid="select-line-spacing">
                            <SelectValue placeholder="Line Spacing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.0">Single</SelectItem>
                            <SelectItem value="1.15">1.15</SelectItem>
                            <SelectItem value="1.5">1.5 lines</SelectItem>
                            <SelectItem value="1.6">1.6 lines</SelectItem>
                            <SelectItem value="2.0">Double</SelectItem>
                            <SelectItem value="2.5">2.5 lines</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'top'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Top" 
                          data-testid="button-valign-top"
                        >
                          <AlignVerticalJustifyStart className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'middle'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Middle" 
                          data-testid="button-valign-middle"
                        >
                          <AlignVerticalJustifyCenter className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'bottom'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Bottom" 
                          data-testid="button-valign-bottom"
                        >
                          <AlignVerticalJustifyEnd className="w-4 h-4" />
                        </Button>
                        <div className="w-px bg-border mx-1" />
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('removeFormat')} className="h-8 px-2" title="Clear Formatting" data-testid="button-format-clear">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Row 2: Text Style & All Other Formatting */}
                      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md border">
                        {/* Text Style */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('bold')} className="h-8 px-2" data-testid="button-format-bold">
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('italic')} className="h-8 px-2" data-testid="button-format-italic">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('underline')} className="h-8 px-2" data-testid="button-format-underline">
                          <Underline className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('strikeThrough')} className="h-8 px-2" data-testid="button-format-strike">
                          <Strikethrough className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('subscript')} className="h-8 px-2" title="Subscript" data-testid="button-format-sub">
                          <Subscript className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('superscript')} className="h-8 px-2" title="Superscript" data-testid="button-format-super">
                          <Superscript className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Headings */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h1>')} className="h-8 px-2" data-testid="button-format-h1">
                          <Heading1 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h2>')} className="h-8 px-2" data-testid="button-format-h2">
                          <Heading2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h3>')} className="h-8 px-2" data-testid="button-format-h3">
                          <Heading3 className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Lists */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertUnorderedList')} className="h-8 px-2" data-testid="button-format-ul">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertOrderedList')} className="h-8 px-2" data-testid="button-format-ol">
                          <ListOrdered className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<blockquote>')} className="h-8 px-2" title="Block Quote" data-testid="button-format-quote">
                          <Quote className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('indent')} className="h-8 px-2" title="Indent" data-testid="button-format-indent">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('outdent')} className="h-8 px-2" title="Outdent" data-testid="button-format-outdent">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Alignment */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyLeft')} className="h-8 px-2" title="Align Left" data-testid="button-format-left">
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyCenter')} className="h-8 px-2" title="Align Center" data-testid="button-format-center">
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyRight')} className="h-8 px-2" title="Align Right" data-testid="button-format-right">
                          <AlignRight className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyFull')} className="h-8 px-2" title="Justify" data-testid="button-format-justify">
                          <AlignJustify className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Links & Media */}
                        <Button size="sm" variant="ghost" onClick={() => {
                          const url = prompt('Enter URL:')
                          if (url) applyFormat('createLink', url)
                        }} className="h-8 px-2" title="Insert Link" data-testid="button-format-link">
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          const url = prompt('Enter image URL:')
                          if (url) applyFormat('insertImage', url)
                        }} className="h-8 px-2" title="Insert Image" data-testid="button-format-image">
                          <Image className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Table & Formatting */}
                        <Button size="sm" variant="ghost" onClick={() => {
                          const rows = prompt('Number of rows:', '3')
                          const cols = prompt('Number of columns:', '3')
                          if (rows && cols) {
                            let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>'
                            for (let i = 0; i < parseInt(rows); i++) {
                              table += '<tr>'
                              for (let j = 0; j < parseInt(cols); j++) {
                                table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>'
                              }
                              table += '</tr>'
                            }
                            table += '</tbody></table>'
                            applyFormat('insertHTML', table)
                          }
                        }} className="h-8 px-2" title="Insert Table" data-testid="button-format-table">
                          <Table className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertHorizontalRule')} className="h-8 px-2" title="Horizontal Line" data-testid="button-format-hr">
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground px-2">
                        <strong>💡 COMPLETE WYSIWYG:</strong> Font Family, Font Size, Text Color, Background Highlight, Line Spacing, Vertical Alignment, Clear Formatting, Bold, Italic, Underline, Strikethrough, Sub/Superscript, Headings (H1-H3), Lists, Quotes, Indent/Outdent, Text Alignment, Links, Images, Tables, Horizontal Rules
                      </div>
                    </div>
                  )}

                  {/* Editor Content */}
                  {showSourceView ? (
                    <Textarea
                      value={currentDraft}
                      onChange={(e) => setCurrentDraft(e.target.value)}
                      className="min-h-[400px] font-mono text-xs"
                      data-testid="textarea-source-editor"
                    />
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setCurrentDraft(e.currentTarget.innerHTML)}
                      className="min-h-[400px] border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-ring"
                      dangerouslySetInnerHTML={{ __html: currentDraft || defaultContent }}
                      data-testid="div-wysiwyg-editor"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* REVIEW STAGE */}
          {approvalStage === 'review' && (
            <div className="space-y-4">
              {/* Status Indicator */}
              <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="font-medium">Review in Progress</span>
                    <span className="text-muted-foreground">— Awaiting stakeholder feedback on draft for {activeExec?.name || 'the executive'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* COMPREHENSIVE WYSIWYG Editor for Review - EXACT SAME as Draft Editor */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Edit3 size={16} className="text-pink-600" />
                        Comprehensive Content Editor (Review)
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Edit content directly with full formatting options based on reviewer feedback
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowReviewSourceView(!showReviewSourceView)}
                      data-testid="button-toggle-review-source"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      {showReviewSourceView ? 'Visual' : 'Source'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* COMPREHENSIVE Formatting Toolbar - SAME AS DRAFT */}
                  {!showReviewSourceView && (
                    <div className="space-y-2">
                      {/* Row 1: Font, Size, Color, Background */}
                      <div className="flex flex-wrap gap-2 p-2 bg-pink-50 dark:bg-pink-950/20 rounded-md border border-pink-200 dark:border-pink-800">
                        <Select value={fontFamily} onValueChange={(value) => { setFontFamily(value); applyFormat('fontName', value) }}>
                          <SelectTrigger className="h-8 w-[140px]" data-testid="select-review-font-family">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={fontSize} onValueChange={(value) => { setFontSize(value); applyFormat('fontSize', value) }}>
                          <SelectTrigger className="h-8 w-[80px]" data-testid="select-review-font-size">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">8pt</SelectItem>
                            <SelectItem value="2">10pt</SelectItem>
                            <SelectItem value="3">12pt</SelectItem>
                            <SelectItem value="4">14pt</SelectItem>
                            <SelectItem value="5">16pt</SelectItem>
                            <SelectItem value="6">18pt</SelectItem>
                            <SelectItem value="7">24pt</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Color:</label>
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => { setTextColor(e.target.value); applyFormat('foreColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-review-text-color"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Highlight:</label>
                          <input 
                            type="color" 
                            value={bgColor}
                            onChange={(e) => { setBgColor(e.target.value); applyFormat('backColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-review-bg-color"
                          />
                        </div>
                        <div className="w-px bg-border mx-1" />
                        <Select value={lineSpacing} onValueChange={(value) => { setLineSpacing(value); document.execCommand('formatBlock', false, 'p'); const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { const range = sel.getRangeAt(0); let parent = range.commonAncestorContainer.parentElement; while (parent && parent.tagName !== 'P' && parent.tagName !== 'DIV') { parent = parent.parentElement; } if (parent) parent.style.lineHeight = value; } }}>
                          <SelectTrigger className="h-8 w-[110px]" data-testid="select-review-line-spacing">
                            <SelectValue placeholder="Line Spacing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.0">Single</SelectItem>
                            <SelectItem value="1.15">1.15</SelectItem>
                            <SelectItem value="1.5">1.5 lines</SelectItem>
                            <SelectItem value="1.6">1.6 lines</SelectItem>
                            <SelectItem value="2.0">Double</SelectItem>
                            <SelectItem value="2.5">2.5 lines</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'top'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Top" 
                          data-testid="button-review-valign-top"
                        >
                          <AlignVerticalJustifyStart className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'middle'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Middle" 
                          data-testid="button-review-valign-middle"
                        >
                          <AlignVerticalJustifyCenter className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'bottom'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Bottom" 
                          data-testid="button-review-valign-bottom"
                        >
                          <AlignVerticalJustifyEnd className="w-4 h-4" />
                        </Button>
                        <div className="w-px bg-border mx-1" />
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('removeFormat')} className="h-8 px-2" title="Clear Formatting" data-testid="button-review-format-clear">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Row 2: Text Style & All Other Formatting */}
                      <div className="flex flex-wrap gap-1 p-2 bg-pink-50 dark:bg-pink-950/20 rounded-md border border-pink-200 dark:border-pink-800">
                        {/* Text Style */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('bold')} className="h-8 px-2" data-testid="button-review-format-bold"><Bold className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('italic')} className="h-8 px-2" data-testid="button-review-format-italic"><Italic className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('underline')} className="h-8 px-2" data-testid="button-review-format-underline"><Underline className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('strikeThrough')} className="h-8 px-2" data-testid="button-review-format-strike"><Strikethrough className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('subscript')} className="h-8 px-2" title="Subscript" data-testid="button-review-format-sub"><Subscript className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('superscript')} className="h-8 px-2" title="Superscript" data-testid="button-review-format-super"><Superscript className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Headings */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h1>')} className="h-8 px-2" data-testid="button-review-format-h1"><Heading1 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h2>')} className="h-8 px-2" data-testid="button-review-format-h2"><Heading2 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h3>')} className="h-8 px-2" data-testid="button-review-format-h3"><Heading3 className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Lists */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertUnorderedList')} className="h-8 px-2" data-testid="button-review-format-ul"><List className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertOrderedList')} className="h-8 px-2" data-testid="button-review-format-ol"><ListOrdered className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<blockquote>')} className="h-8 px-2" title="Block Quote" data-testid="button-review-format-quote"><Quote className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('indent')} className="h-8 px-2" title="Indent" data-testid="button-review-format-indent"><ChevronRight className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('outdent')} className="h-8 px-2" title="Outdent" data-testid="button-review-format-outdent"><ChevronLeft className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Alignment */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyLeft')} className="h-8 px-2" title="Align Left" data-testid="button-review-format-left"><AlignLeft className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyCenter')} className="h-8 px-2" title="Align Center" data-testid="button-review-format-center"><AlignCenter className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyRight')} className="h-8 px-2" title="Align Right" data-testid="button-review-format-right"><AlignRight className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyFull')} className="h-8 px-2" title="Justify" data-testid="button-review-format-justify"><AlignJustify className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Links & Media */}
                        <Button size="sm" variant="ghost" onClick={() => { const url = prompt('Enter URL:'); if (url) applyFormat('createLink', url) }} className="h-8 px-2" title="Insert Link" data-testid="button-review-format-link"><LinkIcon className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => { const url = prompt('Enter image URL:'); if (url) applyFormat('insertImage', url) }} className="h-8 px-2" title="Insert Image" data-testid="button-review-format-image"><Image className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Table & Formatting */}
                        <Button size="sm" variant="ghost" onClick={() => {
                          const rows = prompt('Number of rows:', '3'); const cols = prompt('Number of columns:', '3')
                          if (rows && cols) { let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>'
                            for (let i = 0; i < parseInt(rows); i++) { table += '<tr>'; for (let j = 0; j < parseInt(cols); j++) { table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>' } table += '</tr>' }
                            table += '</tbody></table>'; applyFormat('insertHTML', table) }
                        }} className="h-8 px-2" title="Insert Table" data-testid="button-review-format-table"><Table className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertHorizontalRule')} className="h-8 px-2" title="Horizontal Line" data-testid="button-review-format-hr"><Minus className="w-4 h-4" /></Button>
                      </div>
                      <div className="text-xs text-muted-foreground px-2">
                        <strong>💡 COMPLETE WYSIWYG:</strong> Font Family, Font Size, Text Color, Background Highlight, Line Spacing, Vertical Alignment, Clear Formatting, Bold, Italic, Underline, Strikethrough, Sub/Superscript, Headings (H1-H3), Lists, Quotes, Indent/Outdent, Text Alignment, Links, Images, Tables, Horizontal Rules
                      </div>
                    </div>
                  )}

                  {/* WYSIWYG Content Area OR Source View */}
                  {showReviewSourceView ? (
                    <Textarea
                      value={currentDraft}
                      onChange={(e) => setCurrentDraft(e.target.value)}
                      className="w-full min-h-[500px] font-mono text-xs"
                      placeholder="HTML source code..."
                      data-testid="editor-review-source"
                    />
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setCurrentDraft(e.currentTarget.innerHTML || '')}
                      dangerouslySetInnerHTML={{ __html: currentDraft || defaultContent }}
                      className="w-full min-h-[500px] p-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-background prose prose-sm max-w-none"
                      data-testid="editor-review-wysiwyg"
                      style={{ lineHeight: '1.6' }}
                    />
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { toast({ title: "Changes saved", description: "Your edits have been saved" }) }} data-testid="button-save-review-edits">
                      <Save className="h-4 w-4 mr-1"/>Save Edits
                    </Button>
                    <Button size="sm" variant="outline" data-testid="button-add-review-comment">
                      <MessageSquare className="h-4 w-4 mr-1"/>Add Comment
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    💡 <strong>Comprehensive Editor:</strong> Includes tables, line spacing, images, links, source view toggle, and all formatting options. Final content exports to DOCX, PDF, HTML, and Markdown with proper formatting.
                  </div>
                </CardContent>
              </Card>

              {/* Reviewer Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Reviewer Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { author: 'Marketing Director', comment: 'Great opening! Consider adding more data points to support the argument in paragraph 3.', time: '2 hours ago' },
                    { author: activeExec?.name || 'Executive', comment: 'I want to emphasize the human element more. Let\'s add a personal anecdote in the intro.', time: '1 hour ago' }
                  ].map((comment, idx) => (
                    <div key={idx} className="border-l-4 border-muted pl-3 py-2" data-testid={`comment-${idx}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Textarea 
                      placeholder="Add your comment..." 
                      className="min-h-[80px]"
                      data-testid="textarea-new-comment"
                    />
                    <Button size="sm" className="mt-2" data-testid="button-post-comment">
                      <MessageSquare className="h-4 w-4 mr-1"/>Post Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => setApprovalStage('approval')}
                  data-testid="button-send-for-approval"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1"/>
                  Send for Approval
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setApprovalStage('drafts-view')}
                  data-testid="button-back-to-drafts-from-review"
                >
                  <ArrowLeft className="h-4 w-4 mr-1"/>
                  Back to Drafts
                </Button>
              </div>
            </div>
          )}

          {/* APPROVAL STAGE */}
          {approvalStage === 'approval' && (
            <div className="space-y-4">
              {/* Strategic Alignment Check */}
              <Card className={`border-2 ${alignmentScore >= 80 ? 'bg-green-50 dark:bg-green-950/20 border-green-500' : alignmentScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' : 'bg-red-50 dark:bg-red-950/20 border-red-500'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alignmentScore >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : alignmentScore >= 60 ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Strategic Alignment Check</span>
                          <Badge variant={alignmentScore >= 80 ? "default" : alignmentScore >= 60 ? "secondary" : "destructive"}>
                            {alignmentScore}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alignmentScore >= 80 ? 'Content is strategically aligned and ready to publish' :
                           alignmentScore >= 60 ? 'Minor alignment issues detected - review recommended' :
                           'Critical alignment gaps - must fix before publishing'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAlignmentDetails(!showAlignmentDetails)}
                      data-testid="button-toggle-alignment-details"
                    >
                      {showAlignmentDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {showAlignmentDetails && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="grid gap-2">
                        {[
                          { key: 'execMatch', label: 'Aligns with Executive Expertise', pass: true },
                          { key: 'voiceConsistent', label: 'Voice Profile Consistency', pass: true },
                          { key: 'thoughtLeadership', label: 'Thought Leadership Quality', pass: true },
                          { key: 'audienceRelevance', label: 'Target Audience Relevance', pass: false },
                          { key: 'ctaPresent', label: 'Clear Call-to-Action', pass: true }
                        ].map(check => (
                          <div key={check.key} className="flex items-center justify-between text-xs p-2 rounded bg-background">
                            <span className={check.pass ? 'text-foreground' : 'text-muted-foreground'}>{check.label}</span>
                            {check.pass ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      {alignmentScore < 80 && (
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
                          <strong>Quick Fix:</strong> Review the executive's profile and ensure content addresses their key expertise areas.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Executive Voice Check - NEW QUALITY GATE */}
              <Card className={`border-2 ${!voiceCheckRun ? 'bg-gray-50 dark:bg-gray-950/20 border-gray-300' : voiceCheckScore >= 80 ? 'bg-green-50 dark:bg-green-950/20 border-green-500' : voiceCheckScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' : 'bg-red-50 dark:bg-red-950/20 border-red-500'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!voiceCheckRun ? (
                        <Sparkles className="w-5 h-5 text-gray-600" />
                      ) : voiceCheckScore >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : voiceCheckScore >= 60 ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Executive Voice Check</span>
                          {voiceCheckRun && (
                            <Badge variant={voiceCheckScore >= 80 ? "default" : voiceCheckScore >= 60 ? "secondary" : "destructive"}>
                              {voiceCheckScore}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {!voiceCheckRun ? 'Run check to verify content matches ' + (activeExec?.name || 'the executive') + '\'s voice profile' :
                           voiceCheckScore >= 80 ? 'Content voice aligns with executive profile' :
                           voiceCheckScore >= 70 ? 'Minor voice adjustments recommended' :
                           voiceCheckScore >= 60 ? 'Content needs voice refinement to meet approval threshold (≥80)' :
                           'Critical voice issues - must fix before publishing'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!voiceCheckRun && (
                    <div className="mt-3">
                      <Button
                        onClick={() => {
                          setVoiceCheckRun(true);
                          setTimeout(() => setVoiceCheckScore(Math.floor(Math.random() * 20) + 75), 1000);
                        }}
                        className="w-full"
                        data-testid="button-run-voice-check"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Run Executive Voice Check
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Content must score ≥80 to enable approval
                      </p>
                    </div>
                  )}

                  {voiceCheckRun && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      {/* Overall Voice Score */}
                      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Overall Voice Alignment</h4>
                          <span className={`text-2xl font-bold ${voiceCheckScore >= 80 ? 'text-green-600' : voiceCheckScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {voiceCheckScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${voiceCheckScore >= 80 ? 'bg-green-600' : voiceCheckScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${voiceCheckScore}%` }}
                          />
                        </div>
                      </Card>

                      {/* Dimension Scores */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4">
                          <h5 className="text-sm font-medium mb-2">Emotional Tone</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span>Inspirational</span><span className="font-medium">85%</span></div>
                            <div className="flex justify-between"><span>Optimistic</span><span className="font-medium">78%</span></div>
                            <div className="flex justify-between"><span>Compassionate</span><span className="font-medium">72%</span></div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <h5 className="text-sm font-medium mb-2">Persuasive Style</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span>Assertive</span><span className="font-medium">82%</span></div>
                            <div className="flex justify-between"><span>Authoritative</span><span className="font-medium">76%</span></div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <h5 className="text-sm font-medium mb-2">Communication</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span>Informative</span><span className="font-medium">88%</span></div>
                            <div className="flex justify-between"><span>Conversational</span><span className="font-medium">74%</span></div>
                          </div>
                        </Card>
                      </div>

                      {/* Recommendations */}
                      <Card className="p-4">
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />Voice Check Recommendations
                        </h5>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                          <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Strong alignment with executive's inspirational tone</span></li>
                          <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Consider adding more data points to strengthen authoritative voice</span></li>
                          <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><span>Conversational style matches executive's LinkedIn presence</span></li>
                        </ul>
                      </Card>

                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVoiceCheckRun(true);
                          setTimeout(() => setVoiceCheckScore(Math.floor(Math.random() * 20) + 75), 1000);
                        }}
                        className="w-full mt-2"
                        data-testid="button-recheck-voice"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Re-check Voice
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Export & Publish */}
              <Card className="border-2" style={{ borderColor: moduleColor }}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send size={16} style={{ color: moduleColor }} />
                    Export & Publish
                  </CardTitle>
                  {(alignmentScore < 60 || (voiceCheckRun && voiceCheckScore < 80)) && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ Export disabled - {alignmentScore < 60 ? 'fix alignment issues' : ''}{alignmentScore < 60 && voiceCheckRun && voiceCheckScore < 80 ? ' and ' : ''}{voiceCheckRun && voiceCheckScore < 80 ? 'improve voice score (≥80 required)' : ''}
                    </p>
                  )}
                  {alignmentScore >= 60 && !voiceCheckRun && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⚠️ Run Executive Voice Check before publishing
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !voiceCheckRun || voiceCheckScore < 80} data-testid="button-export-docx">
                      <Download className="h-4 w-4 mr-2" />
                      Export .DOCX
                    </Button>
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !voiceCheckRun || voiceCheckScore < 80} data-testid="button-export-pdf">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !voiceCheckRun || voiceCheckScore < 80} data-testid="button-export-html">
                      <Download className="h-4 w-4 mr-2" />
                      Export HTML
                    </Button>
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !voiceCheckRun || voiceCheckScore < 80} data-testid="button-copy-markdown">
                      <Download className="h-4 w-4 mr-2" />
                      Copy Markdown
                    </Button>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold mb-2">Integrate with Other Modules</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" disabled={alignmentScore < 60 || !voiceCheckRun || voiceCheckScore < 80} data-testid="button-send-flight-deck">
                        <Link2 className="h-4 w-4 mr-2" />
                        Add to Flight Deck Campaign
                      </Button>
                      <Button size="sm" variant="outline" disabled={alignmentScore < 60 || !voiceCheckRun || voiceCheckScore < 80} data-testid="button-flag-eval">
                        <Star className="h-4 w-4 mr-2" />
                        Flag for Eval Matrix
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/30 border rounded-md p-2 text-xs text-muted-foreground">
                    💡 Published content is automatically saved to your <strong>Content Calendar</strong> for tracking and distribution.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Coaching Footer */}
          <div className="text-xs italic text-muted-foreground border-t pt-3">
            "Great executive content is never 'done'—it's refined through collaboration while preserving authentic voice. Use feedback loops to strengthen messaging while maintaining strategic alignment."
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setActiveStep('content-calendar')}
              style={{ backgroundColor: moduleColor }}
              className="text-white"
              data-testid="button-continue-calendar"
            >
              Continue to Content Calendar <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
        </div>
      </div>
    )
  };

  return (
    <>
      <ThreeColumnLayout
        leftNav={leftNav}
        steps={steps}
        currentStep={activeStep}
        onStepChange={(stepId) => setActiveStep(stepId as StepKey)}
        content={renderContent()}
        moduleColor={moduleColor}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Executive</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {activeExec?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExecutive}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* POV Creation Dialog */}
      <Dialog open={povDialogOpen} onOpenChange={setPovDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create POV for {selectedTopic?.topic}</DialogTitle>
            <DialogDescription>
              Define your point of view on this topic to align content with your perspective.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">POV Statement</label>
              <Textarea
                placeholder="Describe your perspective on this topic..."
                className="min-h-[120px]"
                data-testid="textarea-pov-statement"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Themes (comma-separated)</label>
                <Input
                  placeholder="e.g., Innovation, Ethics, Leadership"
                  data-testid="input-pov-themes"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Input
                  placeholder="e.g., CMOs, Tech Leaders"
                  data-testid="input-pov-audience"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Supporting Evidence</label>
              <Textarea
                placeholder="Stats, case studies, or examples that support your POV..."
                className="min-h-[80px]"
                data-testid="textarea-pov-evidence"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPovDialogOpen(false)}
              data-testid="button-cancel-pov"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setPovDialogOpen(false);
                toast({
                  title: "POV Created",
                  description: `Your perspective on "${selectedTopic?.topic}" has been saved to POVs.`,
                });
              }}
              data-testid="button-save-pov"
            >
              Save to POVs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Executive Content for {activeExec?.name}</DialogTitle>
            <DialogDescription>
              Draft thought leadership content that will be reviewed and approved before publishing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Content Title</Label>
              <Input
                placeholder="e.g., The Future of AI in Marketing"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                data-testid="input-content-title"
              />
            </div>
            <div>
              <Label>Content Type</Label>
              <Select value={newContent.contentType} onValueChange={(val) => setNewContent({ ...newContent, contentType: val })}>
                <SelectTrigger data-testid="select-content-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn Post">LinkedIn Post</SelectItem>
                  <SelectItem value="Twitter Thread">Twitter Thread</SelectItem>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="Video Script">Video Script</SelectItem>
                  <SelectItem value="Newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newContent.launchDate}
                  onChange={(e) => setNewContent({ ...newContent, launchDate: e.target.value })}
                  data-testid="input-launch-date"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newContent.endDate}
                  onChange={(e) => setNewContent({ ...newContent, endDate: e.target.value })}
                  data-testid="input-end-date"
                />
              </div>
            </div>
            <div>
              <Label>Content Body</Label>
              <Textarea
                placeholder="Write your content here..."
                rows={8}
                value={newContent.bodyContent}
                onChange={(e) => setNewContent({ ...newContent, bodyContent: e.target.value })}
                data-testid="textarea-content-body"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDraftContent([...draftContent, { ...newContent, id: Date.now() }]);
                setNewContent({ title: '', contentType: 'LinkedIn Post', launchDate: '', endDate: '', bodyContent: '' });
                setShowCreateDialog(false);
                toast({ title: "Content Created", description: "Draft content has been saved" });
              }}
              style={{ backgroundColor: moduleColor }}
              className="text-white"
              data-testid="button-create"
            >
              Create Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
