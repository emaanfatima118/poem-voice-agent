"use client"

import { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

type StepKey = 'overview' | 'create' | 'plan' | 'analytics';

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
  const [planTab, setPlanTab] = useState('insights');
  const [analyticsTab, setAnalyticsTab] = useState('program');
  const [approvalStage, setApprovalStage] = useState('drafts-view');
  const [activeExecId, setActiveExecId] = useState<string>('');
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<number[]>([]);
  const [showFinalPreview, setShowFinalPreview] = useState(false);
  const [povDialogOpen, setPovDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{id: number, topic: string} | null>(null);
  const [selectedPovFilter, setSelectedPovFilter] = useState<string>('all');
  const [editingDraft, setEditingDraft] = useState<{id: number, title: string, content: string} | null>(null);
  const [draftContent, setDraftContent] = useState<string>('');
  const [approvalChecklists, setApprovalChecklists] = useState<{[itemId: number]: {[key: string]: boolean}}>({});
  const [approvalStatuses, setApprovalStatuses] = useState<{[itemId: number]: 'approved' | 'pending'}>({
    1: 'approved',
    2: 'pending',
  });

  // WYSIWYG Editor States
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('12pt');
  const [lineSpacing, setLineSpacing] = useState('1.5');
  const [verticalAlign, setVerticalAlign] = useState('top');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');
  const [showSourceView, setShowSourceView] = useState(false);

  // WYSIWYG formatting helper
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  // Fetch executives
  const { data: executives = [], isLoading } = useQuery<Executive[]>({
    queryKey: ['/api/executives'],
  });

  // Create executive mutation
  const createMutation = useMutation({
    mutationFn: async (executive: Partial<Executive>) => {
      return await apiRequest('POST', '/api/executives', executive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executives'] });
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

  if (!activeExec && executives.length === 0) {
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

  if (!activeExec) return null;

  const moduleColor = '#c009ba'; // Brand Craft pink

  const steps = [
    { id: 'overview', label: 'Overview', description: 'Program summary and executive roster' },
    { id: 'create', label: 'Create / Edit', description: 'Build executive profiles and tone mapping' },
    { id: 'plan', label: 'Plan & Pipeline', description: 'Content planning and approval workflows' },
    { id: 'analytics', label: 'Analytics', description: 'Performance metrics and insights' }
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
      <div className="h-full overflow-y-auto bg-white relative">
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
              <h4 className="text-sm font-semibold mb-1">Voice Analysis for {activeExec.name}</h4>
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

      {/* Plan & Pipeline */}
      {activeStep === 'plan' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="font-semibold text-base">Plan & Pipeline</h3>
              {/* Executive Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Working on:</label>
                <select
                  value={activeExecId}
                  onChange={(e) => setActiveExecId(e.target.value)}
                  className="text-sm border rounded-md px-3 py-1.5 bg-background"
                  data-testid="select-plan-exec"
                >
                  {executives.map((exec) => (
                    <option key={exec.id} value={exec.id}>
                      {exec.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={planTab} onValueChange={setPlanTab}>
                <TabsList className="grid grid-cols-3 w-full mb-6 bg-blue-600 dark:bg-blue-700">
                  <TabsTrigger value="insights" data-testid="tab-plan-insights" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:data-[state=active]:bg-blue-800 data-[state=inactive]:text-blue-100">Insights</TabsTrigger>
                  <TabsTrigger value="plotting" data-testid="tab-plan-plotting" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:data-[state=active]:bg-blue-800 data-[state=inactive]:text-blue-100">Plotting Content</TabsTrigger>
                  <TabsTrigger value="drafts" data-testid="tab-plan-drafts" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:data-[state=active]:bg-blue-800 data-[state=inactive]:text-blue-100">Draft & Approvals</TabsTrigger>
                </TabsList>

                {/* Insights Tab */}
                <TabsContent value="insights" className="space-y-6">
                  {/* Summary Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <h4 className="text-sm font-medium mb-1">Alignment Strength</h4>
                      <p className="text-2xl font-semibold text-green-600 dark:text-green-500">88%</p>
                      <p className="text-xs text-muted-foreground mt-1">Steady upward trend</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <h4 className="text-sm font-medium mb-1">Content Gaps</h4>
                      <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-500">3</p>
                      <p className="text-xs text-muted-foreground mt-1">Needs focus on engagement POVs</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <h4 className="text-sm font-medium mb-1">Engagement Opportunities</h4>
                      <p className="text-2xl font-semibold text-blue-600 dark:text-blue-500">5</p>
                      <p className="text-xs text-muted-foreground mt-1">Peers and signals identified</p>
                    </Card>
                  </div>

                  {/* Program Insights */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Program Insights</h2>
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
                  </div>

                  {/* Unified Workspace: Topics and Recommendations */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Left two columns: Topics for Consideration */}
                    <div className="col-span-2 space-y-3">
                      <h2 className="text-lg font-semibold">Topics for Consideration</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 1, topic: 'AI in Marketing Strategy', insight: 'Rising CMO adoption of AI-driven content orchestration.', fit: 80, impact: 85, hasPov: false },
                          { id: 2, topic: 'Human-Led Brand Building', insight: 'Execs gaining traction on leadership content and culture-driven narratives.', fit: 90, impact: 92, hasPov: true },
                          { id: 3, topic: 'Ethical Use of AI', insight: 'CMOs emphasizing responsible data practices in thought leadership.', fit: 75, impact: 88, hasPov: false },
                          { id: 4, topic: 'Brand Storytelling Trends', insight: 'Shift from product-led to story-led marketing strategies.', fit: 85, impact: 89, hasPov: true },
                          { id: 5, topic: 'Customer Advocacy Programs', insight: 'Brands investing more in peer-driven campaigns for authenticity.', fit: 78, impact: 80, hasPov: false },
                          { id: 6, topic: 'Cross-Functional GTM Alignment', insight: 'Need for tighter sync between marketing, sales, and success.', fit: 82, impact: 87, hasPov: false },
                          { id: 7, topic: 'Data-Driven Creativity', insight: 'Teams blending analytics and creativity for more resonant campaigns.', fit: 88, impact: 90, hasPov: false },
                          { id: 8, topic: 'Leadership Tone in Public Channels', insight: 'Executives balancing professional and personal voice for reach.', fit: 93, impact: 95, hasPov: true },
                        ].map(t => (
                          <Card key={t.id} className="p-3">
                            <h3 className="font-medium text-sm mb-1">{t.topic}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{t.insight}</p>
                            <div className="flex justify-between items-center text-xs gap-2">
                              <span className="text-muted-foreground">Fit: {t.fit}%</span>
                              <span className="text-muted-foreground">Impact: {t.impact}%</span>
                              {t.hasPov ? (
                                <Button 
                                  size="sm" 
                                  data-testid={`button-plot-topic-${t.id}`}
                                  onClick={() => {
                                    toast({
                                      title: "Added to Plot",
                                      description: `${t.topic} added to Plotting Content`,
                                    });
                                  }}
                                >
                                  Plot
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  data-testid={`button-needs-pov-topic-${t.id}`}
                                  onClick={() => {
                                    setSelectedTopic({ id: t.id, topic: t.topic });
                                    setPovDialogOpen(true);
                                  }}
                                >
                                  Needs POV
                                </Button>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Right column: Top 3 Recommended Moves */}
                    <div className="col-span-1 border-l pl-4 space-y-3">
                      <h2 className="text-lg font-semibold">Top 3 Recommended Moves</h2>
                      <div className="space-y-3">
                        <Card className="p-3">
                          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Lightbulb className="w-4 h-4"/>Promote a POV Series
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">Create a 3-part post series around AI & human leadership.</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" data-testid="button-needs-pov-1">Needs POV</Button>
                            <Button size="sm" variant="ghost" disabled data-testid="button-plot-1">Plot</Button>
                          </div>
                        </Card>
                        <Card className="p-3">
                          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Target className="w-4 h-4"/>Refine Leadership Narrative
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">Update tone guidelines for clarity and audience resonance.</p>
                          <div className="flex gap-2">
                            <Button size="sm" data-testid="button-plot-2">Plot</Button>
                          </div>
                        </Card>
                        <Card className="p-3">
                          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <TrendingUp className="w-4 h-4"/>Amplify Industry Engagement
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">Engage with peers leading conversations on AI and brand storytelling.</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" data-testid="button-needs-pov-3">Needs POV</Button>
                            <Button size="sm" variant="ghost" disabled data-testid="button-plot-3">Plot</Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Plotting Content Tab */}
                <TabsContent value="plotting" className="space-y-6 py-4">
                  {/* Funnel Visualization - Moved to Top */}
                  <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/20">
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4"/>Content Funnel Stage Breakdown
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-background rounded-md border shadow-sm">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedContentIds.filter(id => [1,3,8].includes(id)).length}</div>
                        <div className="text-sm text-muted-foreground mt-1">Awareness</div>
                      </div>
                      <div className="text-center p-4 bg-background rounded-md border shadow-sm">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedContentIds.filter(id => [2,5].includes(id)).length}</div>
                        <div className="text-sm text-muted-foreground mt-1">Consideration</div>
                      </div>
                      <div className="text-center p-4 bg-background rounded-md border shadow-sm">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{selectedContentIds.filter(id => [4,6,7].includes(id)).length}</div>
                        <div className="text-sm text-muted-foreground mt-1">Decision</div>
                      </div>
                    </div>
                    {selectedContentIds.length > 0 && (
                      <div className="mt-4 p-3 bg-background rounded-md border">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{selectedContentIds.length} content pieces</span>
                          <span className="text-muted-foreground">added to plot</span>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* POV Filter */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        <Lightbulb className="w-4 h-4"/>Filter by POV Foundation
                      </h3>
                      <select
                        value={selectedPovFilter}
                        onChange={(e) => setSelectedPovFilter(e.target.value)}
                        className="text-sm border rounded-md px-3 py-1.5 bg-background"
                        data-testid="select-pov-filter"
                      >
                        <option value="all">All POVs</option>
                        {(activeExec as any)?.povs && (activeExec as any).povs.length > 0 ? (
                          (activeExec as any).povs.map((pov: any) => (
                            <option key={pov.id} value={pov.id}>
                              {pov.topic}
                            </option>
                          ))
                        ) : (
                          <option value="none" disabled>No POVs defined</option>
                        )}
                      </select>
                    </div>
                    {selectedPovFilter !== 'all' && (
                      <div className="mt-3 p-2 bg-primary/10 rounded-md text-xs">
                        <p className="text-muted-foreground">
                          Showing content aligned with: <span className="font-medium text-foreground">
                            {(activeExec as any)?.povs?.find((p: any) => p.id === selectedPovFilter)?.topic || 'Selected POV'}
                          </span>
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Strategic Content Ideas - Specific & Prioritized */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold">Strategic Content Ideas</h3>
                      <span className="text-xs text-muted-foreground">Sorted by priority</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        {
                          id: 1, 
                          type: "3-Part Email Series",
                          title: "AI Ethics in Marketing Leadership", 
                          pov: "AI & Human Creativity",
                          parts: [
                            "Email 1: The Human Cost of AI Automation",
                            "Email 2: Building Ethical Frameworks for AI Use",
                            "Email 3: Leading with Transparency in an AI-First World"
                          ],
                          takeaway: "Establish thought leadership on responsible AI adoption while humanizing the technology conversation",
                          fit: 95, 
                          impact: 92, 
                          priority: 1,
                          funnel: "Awareness"
                        },
                        {
                          id: 2,
                          type: "LinkedIn Post + Article Combo",
                          title: "Why Brand Authenticity Beats Scale",
                          pov: "Authentic Brand Building",
                          parts: [
                            "LinkedIn Post: The personal story of choosing quality over quantity",
                            "Long-form Article: Data-backed framework for authentic brand building"
                          ],
                          takeaway: "Position as contrarian voice against growth-at-all-costs mentality, resonating with quality-focused leaders",
                          fit: 91,
                          impact: 88,
                          priority: 2,
                          funnel: "Consideration"
                        },
                        {
                          id: 3,
                          type: "Twitter Thread → Newsletter",
                          title: "The 5 Stages of Executive Visibility",
                          pov: "Leadership Tone",
                          parts: [
                            "Thread: Hook with surprising stat, break down 5 stages with examples",
                            "Newsletter Deep-Dive: Detailed playbook for each stage with templates"
                          ],
                          takeaway: "Create actionable framework that drives newsletter signups and positions as tactical expert",
                          fit: 89,
                          impact: 94,
                          priority: 3,
                          funnel: "Awareness"
                        },
                        {
                          id: 4,
                          type: "Webinar Series (3 Parts)",
                          title: "Building Your Leadership Brand in 2025",
                          pov: "Authentic Brand Building",
                          parts: [
                            "Session 1: Defining Your Unique POV",
                            "Session 2: Content Distribution Strategy",
                            "Session 3: Measuring Executive Visibility ROI"
                          ],
                          takeaway: "High-engagement format that generates qualified leads and showcases expertise through live Q&A",
                          fit: 86,
                          impact: 90,
                          priority: 4,
                          funnel: "Decision"
                        },
                        {
                          id: 5,
                          type: "Guest Podcast Appearances",
                          title: "The Future of B2B Marketing Leadership",
                          pov: "Leadership Tone",
                          parts: [
                            "Podcast 1: Marketing AI podcast - discussing human-led strategies",
                            "Podcast 2: SaaS leadership show - brand building in crowded markets",
                            "Podcast 3: CMO insights - authentic executive positioning"
                          ],
                          takeaway: "Leverage existing audiences while building personal brand through authentic conversations",
                          fit: 88,
                          impact: 85,
                          priority: 5,
                          funnel: "Consideration"
                        },
                        {
                          id: 6,
                          type: "Case Study Video Series",
                          title: "How 3 Execs Built Their Visibility",
                          pov: "Leadership Tone",
                          parts: [
                            "Video 1: Tech Founder - from zero to thought leader in 6 months",
                            "Video 2: CMO - turning visibility into pipeline",
                            "Video 3: CEO - managing reputation during hypergrowth"
                          ],
                          takeaway: "Social proof through storytelling, highly shareable, demonstrates tangible results",
                          fit: 83,
                          impact: 87,
                          priority: 6,
                          funnel: "Decision"
                        },
                        {
                          id: 7,
                          type: "Interactive LinkedIn Poll Series",
                          title: "Marketing Leadership Pulse Check 2025",
                          pov: "AI & Human Creativity",
                          parts: [
                            "Poll 1: Biggest challenge in executive visibility?",
                            "Poll 2: AI tools you're actually using?",
                            "Poll 3: Content format that gets you the best engagement?",
                            "Follow-up Post: Analyze results + hot takes"
                          ],
                          takeaway: "Drive engagement, gather audience insights, and create data for follow-up content",
                          fit: 79,
                          impact: 81,
                          priority: 7,
                          funnel: "Decision"
                        },
                        {
                          id: 8,
                          type: "Keynote → Repurpose Strategy",
                          title: "The AI-Human Balance in Modern Marketing",
                          pov: "AI & Human Creativity",
                          parts: [
                            "Conference Keynote: 30-min presentation",
                            "LinkedIn Carousel: Key slides + commentary",
                            "Blog Post: Full transcript with added depth",
                            "Video Clips: 5 quotable moments for social"
                          ],
                          takeaway: "Maximize ROI from single speaking engagement through multi-channel distribution",
                          fit: 90,
                          impact: 93,
                          priority: 8,
                          funnel: "Awareness"
                        },
                      ].filter((content) => {
                        // Filter by selected POV
                        if (selectedPovFilter === 'all') return true;
                        // Check if content POV matches any exec POV topic
                        const matchingPov = (activeExec as any)?.povs?.find((p: any) => p.id === selectedPovFilter);
                        return matchingPov && content.pov === matchingPov.topic;
                      }).sort((a, b) => a.priority - b.priority).map((content) => (
                        <Card 
                          key={content.id} 
                          className={`p-4 hover-elevate cursor-pointer transition-all ${
                            selectedContentIds.includes(content.id) 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0 mt-0.5">
                                #{content.priority}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded font-medium">
                                    {content.type}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                    {content.funnel}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3"/>
                                    {content.pov}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold">{content.title}</h4>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content Parts */}
                          <div className="mb-3 pl-8 space-y-1">
                            {content.parts.map((part: string, idx: number) => (
                              <div key={idx} className="text-xs text-muted-foreground flex gap-2">
                                <span className="text-primary">•</span>
                                <span>{part}</span>
                              </div>
                            ))}
                          </div>

                          {/* Takeaway */}
                          <div className="mb-3 pl-8 p-2 bg-muted/30 rounded-md">
                            <p className="text-xs font-medium text-muted-foreground">
                              <span className="text-foreground">Takeaway:</span> {content.takeaway}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mb-3 pl-8">
                            <div className="flex gap-3 text-xs">
                              <div>
                                <span className="text-muted-foreground">Fit: </span>
                                <span className={content.fit >= 85 ? "text-green-600 dark:text-green-400 font-medium" : "text-yellow-600 dark:text-yellow-400 font-medium"}>
                                  {content.fit}%
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Impact: </span>
                                <span className={content.impact >= 85 ? "text-green-600 dark:text-green-400 font-medium" : "text-yellow-600 dark:text-yellow-400 font-medium"}>
                                  {content.impact}%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Persona & Channel Mapping */}
                          <div className="space-y-2 mb-3 pl-8 p-2 bg-muted/30 rounded-md">
                            <div className="text-xs">
                              <span className="text-muted-foreground">Persona: </span>
                              <select className="text-xs bg-transparent border-none focus:outline-none" data-testid={`select-persona-${content.id}`}>
                                <option>CMO / Marketing Leader</option>
                                <option>VP Product</option>
                                <option>Tech Founder</option>
                              </select>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Channel: </span>
                              <select className="text-xs bg-transparent border-none focus:outline-none" data-testid={`select-channel-${content.id}`}>
                                <option>LinkedIn</option>
                                <option>Twitter</option>
                                <option>Blog Post</option>
                                <option>Newsletter</option>
                              </select>
                            </div>
                          </div>

                          <Button 
                            size="sm" 
                            className="w-full" 
                            variant={selectedContentIds.includes(content.id) ? 'default' : 'outline'}
                            onClick={() => {
                              if (selectedContentIds.includes(content.id)) {
                                setSelectedContentIds(selectedContentIds.filter(id => id !== content.id));
                              } else {
                                setSelectedContentIds([...selectedContentIds, content.id]);
                              }
                            }}
                            data-testid={`button-add-to-plot-${content.id}`}
                          >
                            {selectedContentIds.includes(content.id) ? (
                              <>
                                <Check className="w-3 h-3 mr-1"/>Added to Plot
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 mr-1"/>Add to Plot
                              </>
                            )}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm">
                      <span className="font-medium text-foreground">{selectedContentIds.length}</span>
                      <span className="text-muted-foreground"> content pieces added to plot</span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" data-testid="button-save-plot">
                        <Save className="w-4 h-4 mr-1"/>Save Progress
                      </Button>
                      <Button variant="outline" data-testid="button-export-plot">
                        <UploadCloud className="w-4 h-4 mr-1"/>Export to Project
                      </Button>
                      <Button 
                        data-testid="button-push-to-drafts"
                        disabled={selectedContentIds.length === 0}
                        onClick={() => {
                          toast({
                            title: "Pushed to Drafts",
                            description: `${selectedContentIds.length} content pieces moved to Draft & Approvals`,
                          });
                        }}
                      >
                        <PenLine className="w-4 h-4 mr-1"/>Push to Drafts ({selectedContentIds.length})
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Draft & Approvals Tab */}
                <TabsContent value="drafts" className="space-y-4 py-4">
                  {/* Stage Selector - Color-coded for workflow visibility */}
                  <div className="flex gap-3 p-1 bg-muted/30 rounded-md">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setApprovalStage('drafts-view')}
                      data-testid="tab-drafts-view"
                      className={`flex-1 transition-all border-2 ${
                        approvalStage === 'drafts-view'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                          : 'border-transparent'
                      }`}
                    >
                      Drafts
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setApprovalStage('review')}
                      data-testid="tab-review"
                      className={`flex-1 transition-all border-2 ${
                        approvalStage === 'review'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                          : 'border-transparent'
                      }`}
                    >
                      Review & Recos
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setApprovalStage('approval')}
                      data-testid="tab-approval"
                      className={`flex-1 transition-all border-2 ${
                        approvalStage === 'approval'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                          : 'border-transparent'
                      }`}
                    >
                      Final Approval
                    </Button>
                  </div>

                  {/* Drafts View */}
                  {approvalStage === 'drafts-view' && !editingDraft && (
                    <div className="space-y-4">
                      {/* Draft Items List */}
                      <div className="grid gap-3">
                        {[
                          { 
                            id: 1, 
                            title: "AI in Marketing: Finding the Balance", 
                            status: "draft", 
                            wordCount: 450, 
                            created: "2 days ago",
                            content: "Artificial intelligence is transforming the marketing landscape at an unprecedented pace. As leaders, we face a critical question: how do we leverage AI's power while maintaining the human touch that builds genuine connections?\n\nThe challenge isn't whether to use AI—it's how to use it responsibly. In my years leading marketing teams, I've seen technology enhance our capabilities, but never replace the empathy and creativity that define great marketing.\n\nHere's my framework for finding balance..."
                          },
                          { 
                            id: 2, 
                            title: "Why Human Leadership Still Matters", 
                            status: "draft", 
                            wordCount: 520, 
                            created: "1 week ago",
                            content: "Despite all the automation and AI tools flooding the market, one truth remains: people follow people, not algorithms.\n\nLeadership in the age of AI requires us to double down on the uniquely human qualities that technology can't replicate. Vision, empathy, and authentic connection matter more than ever..."
                          },
                          { 
                            id: 3, 
                            title: "Building Brand Trust in 2025", 
                            status: "in_review", 
                            wordCount: 380, 
                            created: "3 days ago", 
                            reviewers: ["Sarah Lin", "James Porter"],
                            content: "Trust is the currency of modern branding. In an era where consumers are bombarded with messages and skeptical of corporate speak, authenticity isn't just a buzzword—it's a survival strategy..."
                          },
                        ].map((draft) => (
                          <Card key={draft.id} className="p-4 hover-elevate" data-testid={`draft-item-${draft.id}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium">{draft.title}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    draft.status === 'draft' 
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  }`}>
                                    {draft.status === 'draft' ? 'Draft' : 'In Review'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{draft.wordCount} words</span>
                                  <span>•</span>
                                  <span>Created {draft.created}</span>
                                  {draft.reviewers && (
                                    <>
                                      <span>•</span>
                                      <span>Reviewers: {draft.reviewers.join(', ')}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    setEditingDraft({ id: draft.id, title: draft.title, content: draft.content });
                                    setDraftContent(draft.content);
                                  }}
                                  data-testid={`button-edit-draft-${draft.id}`}
                                >
                                  Edit
                                </Button>
                                {draft.status === 'draft' && (
                                  <Button size="sm" data-testid={`button-send-review-${draft.id}`}>
                                    Send to Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      <Button className="w-full" variant="outline" data-testid="button-create-draft">
                        <Plus className="w-4 h-4 mr-1"/>Create New Draft
                      </Button>
                    </div>
                  )}
                  
                  {/* Draft Editor */}
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
                        <span className="text-xs text-muted-foreground">{draftContent.split(' ').length} words</span>
                      </div>

                      {/* Editor Toolbar */}
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Generating content...",
                                  description: "AI is creating content based on your POV and brand voice",
                                });
                                setTimeout(() => {
                                  const generatedContent = draftContent + "\n\n[AI-generated content based on your brand voice and POV would appear here. This demonstrates the Generate Content feature that leverages OpenAI to expand on your ideas while maintaining consistency with your executive persona.]";
                                  setDraftContent(generatedContent);
                                  toast({
                                    title: "Content generated",
                                    description: "New content has been added to your draft",
                                  });
                                }, 1500);
                              }}
                              data-testid="button-generate-content"
                            >
                              <Sparkles className="w-4 h-4 mr-1"/>
                              Generate Content
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Draft saved",
                                  description: "Your changes have been saved",
                                });
                              }}
                              data-testid="button-save-draft"
                            >
                              <Save className="w-4 h-4 mr-1"/>
                              Save
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Sent to review",
                                  description: "Draft has been sent to reviewers",
                                });
                                setEditingDraft(null);
                                setApprovalStage('review');
                              }}
                              data-testid="button-send-to-review"
                            >
                              <Send className="w-4 h-4 mr-1"/>
                              Send to Review
                            </Button>
                          </div>
                        </div>
                      </Card>

                      {/* WYSIWYG Editor */}
                      <Card className="border-blue-200 dark:border-blue-800">
                        {!showSourceView && (
                          <div className="p-3 space-y-2 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
                            {/* Row 1: Font, Size, Color & Spacing */}
                            <div className="flex items-center gap-1 flex-wrap">
                              <Select value={fontFamily} onValueChange={(val) => { setFontFamily(val); applyFormat('fontName', val); }}>
                                <SelectTrigger className="h-8 w-36" data-testid="select-font-family">
                                  <SelectValue />
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
                              <Select value={fontSize} onValueChange={(val) => { setFontSize(val); applyFormat('fontSize', val === '8pt' ? '1' : val === '10pt' ? '2' : val === '12pt' ? '3' : val === '14pt' ? '4' : val === '16pt' ? '5' : val === '18pt' ? '6' : '7'); }}>
                                <SelectTrigger className="h-8 w-20" data-testid="select-font-size">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="8pt">8pt</SelectItem>
                                  <SelectItem value="10pt">10pt</SelectItem>
                                  <SelectItem value="12pt">12pt</SelectItem>
                                  <SelectItem value="14pt">14pt</SelectItem>
                                  <SelectItem value="16pt">16pt</SelectItem>
                                  <SelectItem value="18pt">18pt</SelectItem>
                                  <SelectItem value="24pt">24pt</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center gap-1">
                                <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); applyFormat('foreColor', e.target.value); }} className="h-8 w-10 rounded border cursor-pointer" title="Text Color" data-testid="input-text-color" />
                                <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); applyFormat('backColor', e.target.value); }} className="h-8 w-10 rounded border cursor-pointer" title="Background Highlight" data-testid="input-bg-color" />
                              </div>
                              <div className="w-px bg-border mx-1" />
                              <Select value={lineSpacing} onValueChange={setLineSpacing}>
                                <SelectTrigger className="h-8 w-24" data-testid="select-line-spacing">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Single</SelectItem>
                                  <SelectItem value="1.15">1.15</SelectItem>
                                  <SelectItem value="1.5">1.5</SelectItem>
                                  <SelectItem value="1.6">1.6</SelectItem>
                                  <SelectItem value="2">Double</SelectItem>
                                  <SelectItem value="2.5">2.5</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex gap-0.5">
                                <Button size="sm" variant="ghost" onClick={() => setVerticalAlign('top')} className={`h-8 px-2 ${verticalAlign === 'top' ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Align Top" data-testid="button-valign-top"><AlignVerticalJustifyStart className="w-4 h-4" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => setVerticalAlign('middle')} className={`h-8 px-2 ${verticalAlign === 'middle' ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Align Middle" data-testid="button-valign-middle"><AlignVerticalJustifyCenter className="w-4 h-4" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => setVerticalAlign('bottom')} className={`h-8 px-2 ${verticalAlign === 'bottom' ? 'bg-blue-100 dark:bg-blue-900' : ''}`} title="Align Bottom" data-testid="button-valign-bottom"><AlignVerticalJustifyEnd className="w-4 h-4" /></Button>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('removeFormat')} className="h-8 px-2" title="Clear Formatting" data-testid="button-clear-format"><X className="w-4 h-4" /></Button>
                            </div>

                            {/* Row 2: Text & Structure Formatting */}
                            <div className="flex items-center gap-1 flex-wrap">
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('bold')} className="h-8 px-2" title="Bold" data-testid="button-format-bold"><Bold className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('italic')} className="h-8 px-2" title="Italic" data-testid="button-format-italic"><Italic className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('underline')} className="h-8 px-2" title="Underline" data-testid="button-format-underline"><Underline className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('strikeThrough')} className="h-8 px-2" title="Strikethrough" data-testid="button-format-strike"><Strikethrough className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('subscript')} className="h-8 px-2" title="Subscript" data-testid="button-format-sub"><Subscript className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('superscript')} className="h-8 px-2" title="Superscript" data-testid="button-format-super"><Superscript className="w-4 h-4" /></Button>
                              <div className="w-px bg-border mx-1" />
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h1>')} className="h-8 px-2" title="Heading 1" data-testid="button-format-h1"><Heading1 className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h2>')} className="h-8 px-2" title="Heading 2" data-testid="button-format-h2"><Heading2 className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h3>')} className="h-8 px-2" title="Heading 3" data-testid="button-format-h3"><Heading3 className="w-4 h-4" /></Button>
                              <div className="w-px bg-border mx-1" />
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('insertUnorderedList')} className="h-8 px-2" title="Bullet List" data-testid="button-format-ul"><List className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('insertOrderedList')} className="h-8 px-2" title="Numbered List" data-testid="button-format-ol"><ListOrdered className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<blockquote>')} className="h-8 px-2" title="Block Quote" data-testid="button-format-quote"><Quote className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('indent')} className="h-8 px-2" title="Indent" data-testid="button-format-indent"><ChevronRight className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('outdent')} className="h-8 px-2" title="Outdent" data-testid="button-format-outdent"><ChevronLeft className="w-4 h-4" /></Button>
                              <div className="w-px bg-border mx-1" />
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyLeft')} className="h-8 px-2" title="Align Left" data-testid="button-format-left"><AlignLeft className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyCenter')} className="h-8 px-2" title="Align Center" data-testid="button-format-center"><AlignCenter className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyRight')} className="h-8 px-2" title="Align Right" data-testid="button-format-right"><AlignRight className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyFull')} className="h-8 px-2" title="Justify" data-testid="button-format-justify"><AlignJustify className="w-4 h-4" /></Button>
                              <div className="w-px bg-border mx-1" />
                              <Button size="sm" variant="ghost" onClick={() => { const url = prompt('Enter URL:'); if (url) applyFormat('createLink', url); }} className="h-8 px-2" title="Insert Link" data-testid="button-format-link"><LinkIcon className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => { const url = prompt('Enter image URL:'); if (url) applyFormat('insertImage', url); }} className="h-8 px-2" title="Insert Image" data-testid="button-format-image"><Image className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => { const rows = prompt('Rows:'); const cols = prompt('Columns:'); if (rows && cols) { let table = '<table border="1">'; for (let i = 0; i < parseInt(rows); i++) { table += '<tr>'; for (let j = 0; j < parseInt(cols); j++) { table += '<td>&nbsp;</td>'; } table += '</tr>'; } table += '</table>'; applyFormat('insertHTML', table); } }} className="h-8 px-2" title="Insert Table" data-testid="button-format-table"><Table className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => applyFormat('insertHorizontalRule')} className="h-8 px-2" title="Horizontal Line" data-testid="button-format-hr"><Minus className="w-4 h-4" /></Button>
                            </div>
                            <div className="text-xs text-muted-foreground px-2">
                              <strong>💡 COMPLETE WYSIWYG:</strong> Font Family, Font Size, Text Color, Background Highlight, Line Spacing, Vertical Alignment, Clear Formatting, Bold, Italic, Underline, Strikethrough, Sub/Superscript, Headings (H1-H3), Lists, Quotes, Indent/Outdent, Text Alignment, Links, Images, Tables, Horizontal Rules
                            </div>
                          </div>
                        )}

                        {/* WYSIWYG Content OR Source View */}
                        {!showSourceView ? (
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-[400px] p-4 focus:outline-none bg-background"
                            style={{
                              fontFamily: fontFamily,
                              fontSize: fontSize,
                              lineHeight: lineSpacing,
                              verticalAlign: verticalAlign
                            }}
                            dangerouslySetInnerHTML={{ __html: draftContent }}
                            onInput={(e) => setDraftContent(e.currentTarget.innerHTML)}
                            data-testid="wysiwyg-draft-content"
                          />
                        ) : (
                          <Textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            className="min-h-[400px] font-mono text-xs"
                            placeholder="HTML source code..."
                            data-testid="textarea-source-view"
                          />
                        )}

                        {/* Source View Toggle */}
                        <div className="p-2 border-t flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{draftContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length} words</span>
                          <Button size="sm" variant="ghost" onClick={() => setShowSourceView(!showSourceView)} data-testid="button-toggle-source">
                            <Code className="w-4 h-4 mr-1" />
                            {showSourceView ? 'Visual Editor' : 'Source View'}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Review & Recommendations */}
                  {approvalStage === 'review' && (
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Draft Content with Comments */}
                      <div className="md:col-span-2 space-y-4">
                        {/* Preview Toggle */}
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {showFinalPreview ? 'Showing Final Version' : 'Showing Original with Comments'}
                            </span>
                            {acceptedSuggestions.length > 0 && (
                              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                {acceptedSuggestions.length} suggestion{acceptedSuggestions.length !== 1 ? 's' : ''} accepted
                              </span>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant={showFinalPreview ? 'default' : 'outline'}
                            onClick={() => setShowFinalPreview(!showFinalPreview)}
                            data-testid="button-toggle-preview"
                          >
                            <Eye className="w-4 h-4 mr-1"/>
                            {showFinalPreview ? 'Show Original' : 'Preview Final'}
                          </Button>
                        </div>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold">AI in Marketing: Finding the Balance</h3>
                            {!showFinalPreview && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" data-testid="button-add-comment">
                                  <MessageSquare className="w-4 h-4 mr-1"/>Add Comment
                                </Button>
                                <Button size="sm" variant="outline" data-testid="button-suggest-edit">
                                  <PenLine className="w-4 h-4 mr-1"/>Suggest Edit
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Draft Text - Original with Comments */}
                          {!showFinalPreview && (
                            <div className="prose prose-sm max-w-none space-y-4">
                              <p className="text-sm leading-relaxed">
                                <span className="bg-yellow-100 dark:bg-yellow-900/30 relative group cursor-pointer" data-comment-id="1">
                                  The marketing landscape is changing faster than ever.
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                    1
                                  </span>
                                </span> With AI tools becoming more accessible, marketers face a critical question: how do we leverage these powerful technologies without losing the human touch that makes brands relatable?
                              </p>
                              <p className="text-sm leading-relaxed">
                                In my experience working with dozens of B2B companies, I've seen two extremes. Some teams rush to automate everything, treating AI as a magic solution. <span className="bg-blue-100 dark:bg-blue-900/30 relative group cursor-pointer" data-comment-id="2">
                                  Others resist change entirely, clinging to manual processes that can't scale.
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                    2
                                  </span>
                                </span> Neither approach works.
                              </p>
                              <p className="text-sm leading-relaxed">
                                The sweet spot? Use AI for what it does best—data analysis, pattern recognition, and content amplification—while keeping humans in charge of strategy, creativity, and authentic storytelling.
                              </p>
                            </div>
                          )}

                          {/* Final Version Preview */}
                          {showFinalPreview && (
                            <div className="space-y-4">
                              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                  <Check className="w-4 h-4"/>
                                  <span className="font-medium">Final version with {acceptedSuggestions.length} accepted suggestion{acceptedSuggestions.length !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              <div className="prose prose-sm max-w-none space-y-4">
                                <p className="text-sm leading-relaxed">
                                  {acceptedSuggestions.includes(1) ? (
                                    <span className="bg-green-100 dark:bg-green-900/30 px-1 rounded">
                                      The marketing landscape is evolving at unprecedented speed.
                                    </span>
                                  ) : (
                                    'The marketing landscape is changing faster than ever.'
                                  )} With AI tools becoming more accessible, marketers face a critical question: how do we leverage these powerful technologies without losing the human touch that makes brands relatable?
                                </p>
                                <p className="text-sm leading-relaxed">
                                  In my experience working with dozens of B2B companies, I've seen two extremes. Some teams rush to automate everything, treating AI as a magic solution. {acceptedSuggestions.includes(2) ? (
                                    <span className="bg-green-100 dark:bg-green-900/30 px-1 rounded">
                                      Others resist entirely, holding onto manual workflows that limit growth.
                                    </span>
                                  ) : (
                                    'Others resist change entirely, clinging to manual processes that can\'t scale.'
                                  )} Neither approach works.
                                </p>
                                <p className="text-sm leading-relaxed">
                                  The sweet spot? Use AI for what it does best—data analysis, pattern recognition, and content amplification—while keeping humans in charge of strategy, creativity, and authentic storytelling.
                                </p>
                              </div>
                              
                              {/* Final Actions */}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    setApprovalStage('approval');
                                    toast({
                                      title: "Ready for Approval",
                                      description: "Content moved to Final Approval stage",
                                    });
                                  }}
                                  data-testid="button-move-to-approval"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1"/>
                                  Move to Final Approval
                                </Button>
                                <Button size="sm" variant="outline" data-testid="button-request-more-changes">
                                  <MessageSquare className="w-4 h-4 mr-1"/>
                                  Request More Changes
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>

                        {/* Suggested Edits */}
                        {!showFinalPreview && (
                          <Card className="p-4">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <CheckSquare className="w-4 h-4"/>Suggested Edits (2)
                            </h4>
                            <div className="space-y-3">
                              {/* Suggestion 1 */}
                              <div className={`p-3 rounded-md transition-all ${
                                acceptedSuggestions.includes(1) 
                                  ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                  : 'bg-muted/30'
                              }`}>
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    SL
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs font-medium flex items-center gap-2">
                                      Sarah Lin
                                      {acceptedSuggestions.includes(1) && (
                                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px] font-medium">
                                          ACCEPTED
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                                  </div>
                                </div>
                                <div className="text-xs space-y-1 pl-8">
                                  <div className="text-red-600 dark:text-red-400 line-through">
                                    "The marketing landscape is changing faster than ever."
                                  </div>
                                  <div className="text-green-600 dark:text-green-400">
                                    "The marketing landscape is evolving at unprecedented speed."
                                  </div>
                                  <p className="text-muted-foreground mt-2">More impactful phrasing that avoids cliché</p>
                                </div>
                                <div className="flex gap-2 mt-3 pl-8">
                                  {!acceptedSuggestions.includes(1) ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => {
                                          setAcceptedSuggestions([...acceptedSuggestions, 1]);
                                          toast({
                                            title: "Suggestion Accepted",
                                            description: "Changes will appear in the final version",
                                          });
                                        }}
                                        data-testid="button-accept-suggestion-1"
                                      >
                                        <Check className="w-3 h-3 mr-1"/>Accept
                                      </Button>
                                      <Button size="sm" variant="ghost" data-testid="button-reject-suggestion-1">
                                        <X className="w-3 h-3 mr-1"/>Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => {
                                        setAcceptedSuggestions(acceptedSuggestions.filter(id => id !== 1));
                                        toast({
                                          title: "Suggestion Reverted",
                                          description: "Original text restored",
                                        });
                                      }}
                                      data-testid="button-undo-suggestion-1"
                                    >
                                      <X className="w-3 h-3 mr-1"/>Undo
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Suggestion 2 */}
                              <div className={`p-3 rounded-md transition-all ${
                                acceptedSuggestions.includes(2) 
                                  ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                  : 'bg-muted/30'
                              }`}>
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                    JP
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs font-medium flex items-center gap-2">
                                      James Porter
                                      {acceptedSuggestions.includes(2) && (
                                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px] font-medium">
                                          ACCEPTED
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                                  </div>
                                </div>
                                <div className="text-xs space-y-1 pl-8">
                                  <div className="text-red-600 dark:text-red-400 line-through">
                                    "Others resist change entirely, clinging to manual processes that can't scale."
                                  </div>
                                  <div className="text-green-600 dark:text-green-400">
                                    "Others resist entirely, holding onto manual workflows that limit growth."
                                  </div>
                                  <p className="text-muted-foreground mt-2">Tighter phrasing with stronger impact</p>
                                </div>
                                <div className="flex gap-2 mt-3 pl-8">
                                  {!acceptedSuggestions.includes(2) ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => {
                                          setAcceptedSuggestions([...acceptedSuggestions, 2]);
                                          toast({
                                            title: "Suggestion Accepted",
                                            description: "Changes will appear in the final version",
                                          });
                                        }}
                                        data-testid="button-accept-suggestion-2"
                                      >
                                        <Check className="w-3 h-3 mr-1"/>Accept
                                      </Button>
                                      <Button size="sm" variant="ghost" data-testid="button-reject-suggestion-2">
                                        <X className="w-3 h-3 mr-1"/>Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => {
                                        setAcceptedSuggestions(acceptedSuggestions.filter(id => id !== 2));
                                        toast({
                                          title: "Suggestion Reverted",
                                          description: "Original text restored",
                                        });
                                      }}
                                      data-testid="button-undo-suggestion-2"
                                    >
                                      <X className="w-3 h-3 mr-1"/>Undo
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>

                      {/* Comments Sidebar */}
                      <div className="space-y-3">
                        <Card className="p-4">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4"/>Comments (3)
                          </h4>
                          <div className="space-y-3">
                            {[
                              { id: 1, author: "Sarah Lin", avatar: "SL", comment: "Great opening! Consider adding a specific stat to make it more concrete.", time: "2 hours ago", status: "open" },
                              { id: 2, author: "James Porter", avatar: "JP", comment: "This could use an example. Maybe from one of your client cases?", time: "1 hour ago", status: "open" },
                              { id: 3, author: "Lena Cruz", avatar: "LC", comment: "Love the balanced perspective here. Very on-brand.", time: "30 min ago", status: "resolved" },
                            ].map((comment) => (
                              <div key={comment.id} className={`p-3 rounded-md border ${comment.status === 'resolved' ? 'opacity-50' : ''}`} data-testid={`comment-${comment.id}`}>
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                    {comment.avatar}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium">{comment.author}</div>
                                    <div className="text-xs text-muted-foreground">{comment.time}</div>
                                  </div>
                                  {comment.status === 'resolved' && (
                                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                      <Check className="w-3 h-3"/>Resolved
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground pl-8">{comment.comment}</p>
                                {comment.status === 'open' && (
                                  <Button size="sm" variant="ghost" className="mt-2 ml-8 h-6 text-xs" data-testid={`button-resolve-comment-${comment.id}`}>
                                    Mark Resolved
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </Card>

                        {/* Reviewers */}
                        <Card className="p-4">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4"/>Reviewers
                          </h4>
                          <div className="space-y-2">
                            {["Sarah Lin", "James Porter", "Lena Cruz"].map((reviewer, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs" data-testid={`reviewer-${reviewer.toLowerCase().replace(' ', '-')}`}>
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-medium flex-shrink-0">
                                  {reviewer.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span>{reviewer}</span>
                              </div>
                            ))}
                          </div>
                          <Button size="sm" variant="outline" className="w-full mt-3" data-testid="button-add-reviewer">
                            <Plus className="w-3 h-3 mr-1"/>Add Reviewer
                          </Button>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Final Approval */}
                  {approvalStage === 'approval' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h3 className="text-base font-semibold mb-4">Ready for Approval</h3>
                        
                        {/* Approval Summary */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-md">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
                            <div className="text-sm text-muted-foreground mt-1">Approved</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-md">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">1</div>
                            <div className="text-sm text-muted-foreground mt-1">Pending Review</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</div>
                            <div className="text-sm text-muted-foreground mt-1">Total Comments</div>
                          </div>
                        </div>

                        {/* Approval Items */}
                        <div className="space-y-3">
                          {[
                            { id: 1, title: "AI in Marketing: Finding the Balance", comments: 3, suggestions: 2, allResolved: true },
                            { id: 2, title: "Why Human Leadership Still Matters", comments: 5, suggestions: 1, allResolved: false },
                          ].map((item) => {
                            const itemStatus = approvalStatuses[item.id] || 'pending';
                            const itemChecklist = approvalChecklists[item.id] || {};
                            const checksCompleted = Object.values(itemChecklist).filter(v => v).length;
                            
                            return (
                            <Card key={item.id} className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-sm font-medium">{item.title}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      itemStatus === 'approved'
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    }`}>
                                      {itemStatus === 'approved' ? 'Approved' : 'Pending'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                    <span>{item.comments} comments</span>
                                    <span>•</span>
                                    <span>{item.suggestions} suggestions</span>
                                    <span>•</span>
                                    <span className={item.allResolved ? 'text-green-600 dark:text-green-400' : ''}>
                                      {item.allResolved ? 'All resolved' : 'Has open items'}
                                    </span>
                                  </div>
                                  
                                  {/* Approval Checklist for Pending Items */}
                                  {itemStatus === 'pending' && (
                                    <>
                                      <div className="mb-4 p-3 bg-muted/30 rounded-md">
                                        <h5 className="text-xs font-semibold mb-3 flex items-center gap-2">
                                          <CheckSquare className="w-3 h-3"/>
                                          Approval Checklist
                                        </h5>
                                        <div className="space-y-2">
                                          {[
                                            { id: 'exec-voice', label: 'Exec voice is good', key: 'exec-voice' },
                                            { id: 'brand-alignment', label: 'Brand alignment checked', key: 'brand-alignment' },
                                            { id: 'tone-consistency', label: 'Tone consistency verified', key: 'tone-consistency' },
                                            { id: 'no-errors', label: 'No factual errors', key: 'no-errors' },
                                            { id: 'clear-cta', label: 'Clear call-to-action', key: 'clear-cta' },
                                            { id: 'grammar-spelling', label: 'Grammar and spelling checked', key: 'grammar-spelling' },
                                            { id: 'human-review', label: 'Human review & Approval', key: 'human-review' },
                                          ].map((checkItem) => (
                                            <div key={checkItem.id} className="flex items-center gap-2">
                                              <input
                                                type="checkbox"
                                                id={`${item.id}-${checkItem.id}`}
                                                checked={itemChecklist[checkItem.key] || false}
                                                onChange={(e) => {
                                                  setApprovalChecklists({
                                                    ...approvalChecklists,
                                                    [item.id]: {
                                                      ...itemChecklist,
                                                      [checkItem.key]: e.target.checked
                                                    }
                                                  });
                                                }}
                                                className="w-4 h-4 rounded border-gray-300"
                                                data-testid={`checkbox-${checkItem.id}-${item.id}`}
                                              />
                                              <label
                                                htmlFor={`${item.id}-${checkItem.id}`}
                                                className="text-xs text-muted-foreground cursor-pointer"
                                              >
                                                {checkItem.label}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t text-xs">
                                          <span className="text-muted-foreground">
                                            {checksCompleted} of 7 checks completed
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Run Final Check Button */}
                                      <div className="mb-3">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="w-full"
                                          onClick={() => {
                                            // Auto-check the first 6 automated items
                                            setApprovalChecklists({
                                              ...approvalChecklists,
                                              [item.id]: {
                                                ...itemChecklist,
                                                'exec-voice': true,
                                                'brand-alignment': true,
                                                'tone-consistency': true,
                                                'no-errors': true,
                                                'clear-cta': true,
                                                'grammar-spelling': true,
                                                // Leave human-review unchecked for manual approval
                                              }
                                            });
                                            toast({
                                              title: "Automated Checks Complete",
                                              description: "All automated validations passed. Please review and approve manually.",
                                            });
                                          }}
                                          data-testid={`button-run-check-${item.id}`}
                                        >
                                          <CheckSquare className="w-3 h-3 mr-1"/>Run Final Check
                                        </Button>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          variant="default" 
                                          disabled={checksCompleted < 7}
                                          onClick={() => {
                                            // Update status to approved
                                            setApprovalStatuses({
                                              ...approvalStatuses,
                                              [item.id]: 'approved'
                                            });
                                            // Clean up checklist state after approval
                                            const updatedChecklists = { ...approvalChecklists };
                                            delete updatedChecklists[item.id];
                                            setApprovalChecklists(updatedChecklists);
                                            
                                            toast({
                                              title: "Content Approved",
                                              description: `${item.title} has been approved and is ready for publication`,
                                            });
                                          }}
                                          data-testid={`button-approve-${item.id}`}
                                        >
                                          <Check className="w-3 h-3 mr-1"/>Approve
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => {
                                            toast({
                                              title: "Changes Requested",
                                              description: `${item.title} has been sent back for revisions`,
                                            });
                                          }}
                                          data-testid={`button-request-changes-${item.id}`}
                                        >
                                          Request Changes
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Card>
                            );
                          })}
                        </div>
                      </Card>

                      {/* Export Actions */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" data-testid="button-save-to-projects">
                          <Save className="w-4 h-4 mr-1"/>Save to Projects
                        </Button>
                        <Button variant="outline" data-testid="button-export-package">
                          <UploadCloud className="w-4 h-4 mr-1"/>Export Package
                        </Button>
                        <Button data-testid="button-schedule-flight-deck">
                          <CalendarDays className="w-4 h-4 mr-1"/>Schedule in Flight Deck
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" className="flex items-center gap-2" data-testid="button-export-project">
                  <UploadCloud className="w-4 h-4"/>Export to Project
                </Button>
                <Button className="flex items-center gap-2" data-testid="button-save-progress">
                  <Save className="w-4 h-4"/>Save Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analytics */}
      {activeStep === 'analytics' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <LineChart className="w-4 h-4" /> Insights & Analytics
              </h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Save className="w-4 h-4 mr-1" /> Save Summary
                </Button>
                <Button size="sm" variant="default">
                  <UploadCloud className="w-4 h-4 mr-1" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={analyticsTab} onValueChange={setAnalyticsTab}>
                <TabsList className="flex flex-wrap gap-2 bg-muted/30 p-2 rounded-md w-full justify-start">
                  <TabsTrigger value="program">Program Overview</TabsTrigger>
                  <TabsTrigger value="exec">Executives</TabsTrigger>
                </TabsList>

                {/* Program Overview */}
                <TabsContent value="program" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <MetricCard label="Post Freq" value="4.2/wk" hint="Consistency" />
                    <MetricCard label="Audience Growth" value="+8.3%" hint="MoM" />
                    <MetricCard label="Profile Views" value="+12%" hint="LinkedIn" />
                    <MetricCard
                      label="Share of Voice"
                      value="17%"
                      hint="vs peer set"
                    />
                    <MetricCard
                      label="Channels"
                      value="5"
                      hint="active & consistent"
                    />
                  </div>

                  {/* Charts */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3">MoM Engagement</h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <RLineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="engage"
                            strokeWidth={2}
                            stroke="hsl(var(--chart-1))"
                          />
                        </RLineChart>
                      </ResponsiveContainer>
                    </Card>
                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3">QoQ Authority</h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <RBarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                            }}
                          />
                          <Bar dataKey="authority" fill="hsl(var(--chart-2))" />
                        </RBarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  <Card className="p-4">
                    <h4 className="text-sm font-semibold mb-3">Scoring Model</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      {Object.entries(analyticsWeights).map(([k, v]) => (
                        <div key={k} className="border rounded-md p-3">
                          <div className="font-medium">{k}</div>
                          <div className="text-muted-foreground">{v}% weight</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Trends compare last 8 intervals; insights link back to POV &
                      Plotting.
                    </p>
                  </Card>

                  {/* Program Insights and Recommendations */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Key Insights
                      </h4>
                      <div className="space-y-2">
                        {generateProgramInsights().insights.map((insight, i) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <span className="text-primary mt-0.5">•</span>
                            <p className="text-muted-foreground">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Recommendations
                      </h4>
                      <div className="space-y-2">
                        {generateProgramInsights().recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <span className="text-chart-1 mt-0.5">→</span>
                            <p className="text-muted-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Selected Exec */}
                <TabsContent value="exec" className="space-y-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Exec:</span>
                    <select
                      className="text-sm border rounded-md px-2 py-1.5 bg-background"
                      value={activeExecId}
                      onChange={(e) => setActiveExecId(e.target.value)}
                    >
                      {executives.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <MetricCard label="Post Freq" value="3.4/wk" />
                    <MetricCard label="Audience Growth" value="+6.1%" />
                    <MetricCard label="Profile Views" value="+9%" />
                    <MetricCard label="SOV" value="14%" />
                    <MetricCard label="Channels" value="4" />
                  </div>

                  {/* Charts */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3">
                        MoM Relationship Health
                      </h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <RLineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="relation"
                            strokeWidth={2}
                            stroke="hsl(var(--chart-3))"
                          />
                        </RLineChart>
                      </ResponsiveContainer>
                    </Card>
                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3">QoQ Impact</h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <RBarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                            }}
                          />
                          <Bar dataKey="impact" fill="hsl(var(--chart-4))" />
                        </RBarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  {/* Executive Insights and Recommendations */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Key Insights for {activeExec.name}
                      </h4>
                      <div className="space-y-2">
                        {generateExecInsights(activeExec).insights.map((insight, i) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <span className="text-primary mt-0.5">•</span>
                            <p className="text-muted-foreground">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Action Items
                      </h4>
                      <div className="space-y-2">
                        {generateExecInsights(activeExec).recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm group">
                            <span className="text-chart-1 mt-0.5">→</span>
                            <p className="text-muted-foreground flex-1">{rec}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                toast({
                                  title: "Added to Pipeline",
                                  description: "This recommendation will appear in your Plan & Pipeline section.",
                                });
                              }}
                              data-testid={`button-add-to-plotting-${i}`}
                            >
                              Plot
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
        </div>
      </div>
    );
  };

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={steps}
      currentStep={activeStep}
      onStepChange={(stepId) => setActiveStep(stepId as StepKey)}
      content={renderContent()}
      moduleColor={moduleColor}
    />
  );
}

