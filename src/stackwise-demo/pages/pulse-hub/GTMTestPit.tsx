import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Slider } from "@/stackwise-demo/components/ui/slider";
import { Switch } from "@/stackwise-demo/components/ui/switch";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/stackwise-demo/components/ui/select";
import { Checkbox } from "@/stackwise-demo/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/stackwise-demo/components/ui/tabs";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { getModuleById } from "@/stackwise-demo/config/modules";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { MOCK_EXECUTIVES, MOCK_PILLARS, MOCK_GOALS, MOCK_CONTENT_TYPES } from "@/stackwise-demo/data/mockExecutives";
import { QuickGuidance } from "@/stackwise-demo/components/GuidanceTooltip";
import { GTM_QUESTIONNAIRE, calculateRecommendedArchetype } from "@/stackwise-demo/data/gtmQuestionnaire";
import { generateRecommendations, compareModels } from "@/stackwise-demo/data/gtmRecommendations";
import { 
  Rocket, Target, TrendingUp, TrendingDown, Zap, Shield, AlertTriangle, AlertCircle,
  Info, ArrowLeftRight, FileDown, Play, Save, Copy, Trash2, Search,
  Gauge, Activity, Users2, Layers, BookOpen, CheckCircle, XCircle,
  HelpCircle, Lightbulb, TrendingUp as TrendUp, BarChart2, PieChart,
  ArrowRight, Plus, Minus, ChevronRight, Trophy, Sparkles, Edit, Scale
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, FunnelChart, Funnel, LabelList, Cell } from "recharts";
import { useToast } from "@/stackwise-demo/hooks/use-toast";

// ===== TYPES =====
type KPIKey = 'awareness' | 'velocity' | 'efficiency' | 'retention' | 'credibility';
type StageKey = 'awareness' | 'consideration' | 'conversion' | 'retention';
type ChannelKey = 'linkedin' | 'email' | 'paid_search' | 'paid_social' | 'web' | 'events' | 'pr' | 'seo';
type BudgetActivityKey = 
  | 'webinar_sponsorship'
  | 'podcast_sponsorship'
  | 'event_sponsorship'
  | 'events_tradeshows'
  | 'linkedin_ads'
  | 'meta_ads'
  | 'youtube_ads'
  | 'x_ads'
  | 'tiktok_ads'
  | 'reddit_ads'
  | 'google_ads'
  | 'google_pmax'
  | 'programmatic_display'
  | 'digital_ads'
  | 'pr_distribution';

interface Persona {
  id: string;
  name: string;
  weight: number;
}

interface Channel {
  key: ChannelKey;
  label: string;
  budgetPct: number;
  intensity: number;
}

interface WeightedItem {
  id: string;
  weight: number;
}

interface BudgetActivity {
  key: BudgetActivityKey;
  label: string;
  allocation: number; // percentage 0-1
}

interface GTMModelConfig {
  personas: Persona[];
  stages: Record<StageKey, number>;
  channels: Channel[];
  budgetMix?: BudgetActivity[]; // NEW: Paid activities budget allocation
  totalBudget?: number | null; // NEW: Optional total budget in dollars
  executives?: WeightedItem[];
  pillars?: WeightedItem[];
  goals?: WeightedItem[];
  contentTypes?: WeightedItem[];
  channelsCategoryWeight?: number;
  stagesCategoryWeight?: number;
  contentTypesCategoryWeight?: number;
  personasCategoryWeight?: number;
  executivesCategoryWeight?: number;
  pillarsCategoryWeight?: number;
  goalsCategoryWeight?: number;
}

interface GTMModel {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  archetype?: string;
  tags?: string[];
  config: GTMModelConfig;
  kpis: Record<KPIKey, number>;
  systemLoad: number;
  balance: number;
  marketCoverage: number;
  pipelinePredictability: number;
  warnings: string[];
  analysis?: string;
  recommendations?: Recommendation[];
  createdAt?: string;
}

interface Recommendation {
  id: string;
  category: string;
  text: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

// ===== UTILITIES =====
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const elastic = (x: number, k = 1.15) => 1 - Math.exp(-k * clamp(x));
const pct = (x: number) => `${Math.round(x * 100)}%`;

// ===== HELPER: Rebalance weights to sum to 100% =====
// When you adjust one item, others adjust proportionally to maintain 100% total
function rebalanceWeights<T extends { weight: number }>(
  items: T[],
  changedIndex: number,
  newValue: number
): T[] {
  if (items.length === 0) return items;
  
  const oldValue = items[changedIndex].weight;
  const delta = newValue - oldValue;
  
  // If no change, return as-is
  if (Math.abs(delta) < 0.001) return items;
  
  // Calculate the sum of all OTHER items (not the changed one)
  const otherItemsSum = items.reduce((sum, item, idx) => 
    idx === changedIndex ? sum : sum + item.weight, 0
  );
  
  // If all other items are 0, we can't redistribute
  if (otherItemsSum < 0.001) {
    // Set changed item to newValue, distribute remainder equally among others
    const remainder = 1 - newValue;
    const perItem = remainder / (items.length - 1);
    return items.map((item, idx) => ({
      ...item,
      weight: idx === changedIndex ? newValue : perItem
    }));
  }
  
  // Redistribute the delta proportionally across other items
  return items.map((item, idx) => {
    if (idx === changedIndex) {
      return { ...item, weight: newValue };
    }
    // Adjust this item proportionally to its share of the "other items"
    const proportion = item.weight / otherItemsSum;
    const adjustment = -delta * proportion;
    return { ...item, weight: Math.max(0, item.weight + adjustment) };
  });
}

// Rebalance channel budgets (similar but for Channel type)
function rebalanceChannelBudgets(
  channels: Channel[],
  changedIndex: number,
  newBudgetPct: number
): Channel[] {
  if (channels.length === 0) return channels;
  
  const oldValue = channels[changedIndex].budgetPct;
  const delta = newBudgetPct - oldValue;
  
  if (Math.abs(delta) < 0.001) return channels;
  
  const otherBudgetsSum = channels.reduce((sum, ch, idx) => 
    idx === changedIndex ? sum : sum + ch.budgetPct, 0
  );
  
  if (otherBudgetsSum < 0.001) {
    const remainder = 1 - newBudgetPct;
    const perChannel = remainder / (channels.length - 1);
    return channels.map((ch, idx) => ({
      ...ch,
      budgetPct: idx === changedIndex ? newBudgetPct : perChannel
    }));
  }
  
  return channels.map((ch, idx) => {
    if (idx === changedIndex) {
      return { ...ch, budgetPct: newBudgetPct };
    }
    const proportion = ch.budgetPct / otherBudgetsSum;
    const adjustment = -delta * proportion;
    return { ...ch, budgetPct: Math.max(0, ch.budgetPct + adjustment) };
  });
}

// Rebalance stages (Record<StageKey, number>)
function rebalanceStages(
  stages: Record<StageKey, number>,
  changedStage: StageKey,
  newValue: number
): Record<StageKey, number> {
  const stageKeys: StageKey[] = ['awareness', 'consideration', 'conversion', 'retention'];
  const oldValue = stages[changedStage];
  const delta = newValue - oldValue;
  
  if (Math.abs(delta) < 0.001) return stages;
  
  const otherStagesSum = stageKeys.reduce((sum, key) => 
    key === changedStage ? sum : sum + stages[key], 0
  );
  
  if (otherStagesSum < 0.001) {
    const remainder = 1 - newValue;
    const perStage = remainder / (stageKeys.length - 1);
    const result: Record<StageKey, number> = { ...stages };
    stageKeys.forEach(key => {
      result[key] = key === changedStage ? newValue : perStage;
    });
    return result;
  }
  
  const result: Record<StageKey, number> = { ...stages };
  stageKeys.forEach(key => {
    if (key === changedStage) {
      result[key] = newValue;
    } else {
      const proportion = stages[key] / otherStagesSum;
      const adjustment = -delta * proportion;
      result[key] = Math.max(0, stages[key] + adjustment);
    }
  });
  return result;
}

// Rebalance budget activities (BudgetActivity[])
function rebalanceBudgetActivities(
  activities: BudgetActivity[],
  changedIndex: number,
  newValue: number
): BudgetActivity[] {
  if (activities.length === 0) return activities;
  
  const oldValue = activities[changedIndex].allocation;
  const delta = newValue - oldValue;
  
  if (Math.abs(delta) < 0.001) return activities;
  
  const otherActivitiesSum = activities.reduce((sum, act, idx) => 
    idx === changedIndex ? sum : sum + act.allocation, 0
  );
  
  if (otherActivitiesSum < 0.001) {
    const remainder = 1 - newValue;
    const perActivity = remainder / (activities.length - 1);
    return activities.map((act, idx) => ({
      ...act,
      allocation: idx === changedIndex ? newValue : perActivity
    }));
  }
  
  return activities.map((act, idx) => {
    if (idx === changedIndex) {
      return { ...act, allocation: newValue };
    } else {
      const proportion = act.allocation / otherActivitiesSum;
      const adjustment = -delta * proportion;
      return { ...act, allocation: Math.max(0, act.allocation + adjustment) };
    }
  });
}

// ===== DEFAULT BUDGET MIX =====
const DEFAULT_BUDGET_MIX: BudgetActivity[] = [
  { key: 'webinar_sponsorship', label: 'Webinar Sponsorship', allocation: 0.10 },
  { key: 'podcast_sponsorship', label: 'Podcast Sponsorship', allocation: 0.07 },
  { key: 'event_sponsorship', label: 'Event Sponsorship', allocation: 0.08 },
  { key: 'events_tradeshows', label: 'Events (Tradeshows/Conferences)', allocation: 0.13 },
  { key: 'linkedin_ads', label: 'LinkedIn Ads', allocation: 0.14 },
  { key: 'meta_ads', label: 'Meta Ads', allocation: 0.08 },
  { key: 'youtube_ads', label: 'YouTube Ads', allocation: 0.09 },
  { key: 'x_ads', label: 'X (Twitter) Ads', allocation: 0.05 },
  { key: 'tiktok_ads', label: 'TikTok Ads', allocation: 0.04 },
  { key: 'reddit_ads', label: 'Reddit Ads', allocation: 0.03 },
  { key: 'google_ads', label: 'Google Ads', allocation: 0.09 },
  { key: 'google_pmax', label: 'Google PMax', allocation: 0.07 },
  { key: 'programmatic_display', label: 'Programmatic Display', allocation: 0.04 },
  { key: 'digital_ads', label: 'Digital Ads (Pubs/Native)', allocation: 0.07 },
  { key: 'pr_distribution', label: 'PR Distribution', allocation: 0.02 }
];

// ===== ARCHETYPES =====
const ARCHETYPE_MODELS: GTMModel[] = [
  {
    name: "The Blitz",
    archetype: "blitz",
    description: "Fast market capture with aggressive multi-channel push. High awareness, high velocity.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.35 },
        { id: 'ops', name: 'Operations Lead', weight: 0.45 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.35, consideration: 0.40, conversion: 0.20, retention: 0.05 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.22, intensity: 0.75 },
        { key: 'email', label: 'Email', budgetPct: 0.15, intensity: 0.70 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.25, intensity: 0.80 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.25, intensity: 0.75 },
        { key: 'web', label: 'Web', budgetPct: 0.05, intensity: 0.50 },
        { key: 'events', label: 'Events', budgetPct: 0.03, intensity: 0.30 },
        { key: 'pr', label: 'PR', budgetPct: 0.03, intensity: 0.25 },
        { key: 'seo', label: 'SEO', budgetPct: 0.02, intensity: 0.40 }
      ]
    },
    kpis: { awareness: 88, velocity: 92, efficiency: 68, retention: 42, credibility: 72 },
    systemLoad: 89,
    balance: 76,
    marketCoverage: 65,
    pipelinePredictability: 60,
    warnings: ['Very high system load - team strain likely', 'Retention severely underweighted'],
    analysis: "The Blitz is designed for rapid market penetration. Expect immediate visibility and lead flow, but be prepared for high operational demands. Best for product launches or market entry scenarios where speed matters more than sustainability."
  },
  {
    name: "The Marathon",
    archetype: "marathon",
    description: "Sustainable, balanced growth. Moderate across all KPIs with focus on efficiency and retention.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.33 },
        { id: 'ops', name: 'Operations Lead', weight: 0.33 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.34 }
      ],
      stages: { awareness: 0.25, consideration: 0.30, conversion: 0.25, retention: 0.20 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.15, intensity: 0.55 },
        { key: 'email', label: 'Email', budgetPct: 0.18, intensity: 0.60 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.15, intensity: 0.50 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.12, intensity: 0.50 },
        { key: 'web', label: 'Web', budgetPct: 0.12, intensity: 0.55 },
        { key: 'events', label: 'Events', budgetPct: 0.12, intensity: 0.40 },
        { key: 'pr', label: 'PR', budgetPct: 0.08, intensity: 0.35 },
        { key: 'seo', label: 'SEO', budgetPct: 0.08, intensity: 0.50 }
      ]
    },
    kpis: { awareness: 65, velocity: 68, efficiency: 82, retention: 78, credibility: 75 },
    systemLoad: 58,
    balance: 94,
    marketCoverage: 85,
    pipelinePredictability: 92,
    warnings: [],
    analysis: "The Marathon prioritizes sustainable growth over quick wins. Highly balanced allocation reduces risk and team strain. Ideal for established companies focusing on steady ARR growth and customer retention."
  },
  {
    name: "The Fortress",
    archetype: "fortress",
    description: "Retention-first defensive strategy. Protect and expand existing customer base.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.25 },
        { id: 'ops', name: 'Operations Lead', weight: 0.40 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.35 }
      ],
      stages: { awareness: 0.15, consideration: 0.25, conversion: 0.25, retention: 0.35 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.10, intensity: 0.40 },
        { key: 'email', label: 'Email', budgetPct: 0.30, intensity: 0.70 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.10, intensity: 0.45 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.08, intensity: 0.40 },
        { key: 'web', label: 'Web', budgetPct: 0.15, intensity: 0.60 },
        { key: 'events', label: 'Events', budgetPct: 0.15, intensity: 0.55 },
        { key: 'pr', label: 'PR', budgetPct: 0.05, intensity: 0.30 },
        { key: 'seo', label: 'SEO', budgetPct: 0.07, intensity: 0.50 }
      ]
    },
    kpis: { awareness: 48, velocity: 58, efficiency: 85, retention: 94, credibility: 68 },
    systemLoad: 61,
    balance: 83,
    marketCoverage: 70,
    pipelinePredictability: 75,
    warnings: ['Low awareness may create future pipeline gaps', 'Consider periodic brand campaigns'],
    analysis: "The Fortress focuses on customer success and retention. Lower acquisition costs with higher lifetime value. Best for SaaS companies facing churn challenges or defending market position against competitors."
  },
  {
    name: "Brand-Heavy",
    archetype: "brand-heavy",
    description: "Build credibility and awareness through thought leadership and executive visibility.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.50 },
        { id: 'ops', name: 'Operations Lead', weight: 0.30 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.45, consideration: 0.35, conversion: 0.12, retention: 0.08 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.28, intensity: 0.75 },
        { key: 'email', label: 'Email', budgetPct: 0.10, intensity: 0.50 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.16, intensity: 0.55 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.22, intensity: 0.65 },
        { key: 'web', label: 'Web', budgetPct: 0.08, intensity: 0.50 },
        { key: 'events', label: 'Events', budgetPct: 0.07, intensity: 0.60 },
        { key: 'pr', label: 'PR', budgetPct: 0.06, intensity: 0.70 },
        { key: 'seo', label: 'SEO', budgetPct: 0.03, intensity: 0.45 }
      ]
    },
    kpis: { awareness: 92, velocity: 54, efficiency: 60, retention: 46, credibility: 96 },
    systemLoad: 66,
    balance: 72,
    marketCoverage: 75,
    pipelinePredictability: 55,
    warnings: ['Top-heavy awareness may slow MQL→SQL velocity', 'Consider adding conversion accelerators'],
    analysis: "Brand-Heavy builds long-term market position through credibility. High executive involvement drives awareness and trust. Best for category creation, repositioning, or entering enterprise markets where trust is paramount."
  },
  {
    name: "Demand Surge",
    archetype: "demand-surge",
    description: "Near-term revenue focus with aggressive paid and email campaigns.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.30 },
        { id: 'ops', name: 'Operations Lead', weight: 0.50 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.20, consideration: 0.45, conversion: 0.28, retention: 0.07 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.18, intensity: 0.65 },
        { key: 'email', label: 'Email', budgetPct: 0.20, intensity: 0.75 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.28, intensity: 0.80 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.20, intensity: 0.70 },
        { key: 'web', label: 'Web', budgetPct: 0.06, intensity: 0.55 },
        { key: 'events', label: 'Events', budgetPct: 0.03, intensity: 0.35 },
        { key: 'pr', label: 'PR', budgetPct: 0.02, intensity: 0.25 },
        { key: 'seo', label: 'SEO', budgetPct: 0.03, intensity: 0.45 }
      ]
    },
    kpis: { awareness: 66, velocity: 95, efficiency: 78, retention: 52, credibility: 62 },
    systemLoad: 86,
    balance: 74,
    marketCoverage: 55,
    pipelinePredictability: 82,
    warnings: ['High system load - protect team capacity', 'Retention underweight vs churn risk'],
    analysis: "Demand Surge maximizes near-term pipeline and revenue. High conversion focus with aggressive paid campaigns. Best for quarter-end pushes, pipeline gaps, or when board needs immediate results."
  },
  {
    name: "The Amplifier",
    archetype: "amplifier",
    description: "Leverage existing customer base for expansion and advocacy.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.30 },
        { id: 'ops', name: 'Operations Lead', weight: 0.35 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.35 }
      ],
      stages: { awareness: 0.18, consideration: 0.28, conversion: 0.22, retention: 0.32 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.12, intensity: 0.55 },
        { key: 'email', label: 'Email', budgetPct: 0.25, intensity: 0.68 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.12, intensity: 0.50 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.10, intensity: 0.48 },
        { key: 'web', label: 'Web', budgetPct: 0.14, intensity: 0.58 },
        { key: 'events', label: 'Events', budgetPct: 0.16, intensity: 0.62 },
        { key: 'pr', label: 'PR', budgetPct: 0.06, intensity: 0.40 },
        { key: 'seo', label: 'SEO', budgetPct: 0.05, intensity: 0.48 }
      ]
    },
    kpis: { awareness: 56, velocity: 64, efficiency: 88, retention: 86, credibility: 74 },
    systemLoad: 64,
    balance: 88,
    marketCoverage: 80,
    pipelinePredictability: 80,
    warnings: ['Monitor new customer acquisition rates'],
    analysis: "The Amplifier focuses on customer expansion and advocacy. High efficiency through referrals and upsells. Best for companies with strong product-market fit looking to scale through existing relationships."
  },
  {
    name: "The Disruptor",
    archetype: "disruptor",
    description: "Challenge market leader with bold positioning and aggressive campaigns.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.45 },
        { id: 'ops', name: 'Operations Lead', weight: 0.35 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.38, consideration: 0.38, conversion: 0.18, retention: 0.06 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.24, intensity: 0.78 },
        { key: 'email', label: 'Email', budgetPct: 0.14, intensity: 0.68 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.22, intensity: 0.75 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.24, intensity: 0.78 },
        { key: 'web', label: 'Web', budgetPct: 0.06, intensity: 0.55 },
        { key: 'events', label: 'Events', budgetPct: 0.04, intensity: 0.45 },
        { key: 'pr', label: 'PR', budgetPct: 0.04, intensity: 0.60 },
        { key: 'seo', label: 'SEO', budgetPct: 0.02, intensity: 0.42 }
      ]
    },
    kpis: { awareness: 86, velocity: 82, efficiency: 64, retention: 44, credibility: 84 },
    systemLoad: 82,
    balance: 70,
    marketCoverage: 72,
    pipelinePredictability: 65,
    warnings: ['High-intensity campaigns require strong creative', 'Low retention - add nurture programs'],
    analysis: "The Disruptor challenges incumbents with provocative messaging and high visibility. Strong awareness and credibility through bold positioning. Best for well-funded challengers ready to make noise."
  },
  {
    name: "Mid-Market Focus",
    archetype: "mid-market",
    description: "Optimized for 50-500 employee companies with balanced, efficient approach.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.35 },
        { id: 'ops', name: 'Operations Lead', weight: 0.40 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.25 }
      ],
      stages: { awareness: 0.28, consideration: 0.35, conversion: 0.24, retention: 0.13 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.20, intensity: 0.62 },
        { key: 'email', label: 'Email', budgetPct: 0.18, intensity: 0.65 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.18, intensity: 0.58 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.14, intensity: 0.55 },
        { key: 'web', label: 'Web', budgetPct: 0.12, intensity: 0.58 },
        { key: 'events', label: 'Events', budgetPct: 0.08, intensity: 0.48 },
        { key: 'pr', label: 'PR', budgetPct: 0.05, intensity: 0.38 },
        { key: 'seo', label: 'SEO', budgetPct: 0.05, intensity: 0.52 }
      ]
    },
    kpis: { awareness: 72, velocity: 76, efficiency: 80, retention: 68, credibility: 76 },
    systemLoad: 68,
    balance: 86,
    marketCoverage: 78,
    pipelinePredictability: 85,
    warnings: [],
    analysis: "Mid-Market Focus balances reach and efficiency for companies targeting 50-500 employee segment. Moderate intensity across channels with strong conversion focus. Best for SaaS companies with proven PMF expanding into mid-market."
  }
];

// ===== KPI CALCULATION =====
function computeKPIs(config: GTMModelConfig): { 
  kpis: Record<KPIKey, number>; 
  systemLoad: number; 
  balance: number; 
  marketCoverage: number;
  pipelinePredictability: number;
  warnings: string[] 
} {
  const { personas, stages, channels, executives, pillars, contentTypes } = config;
  
  // Calculate channel total
  const chTotal = channels.reduce((a, c) => a + c.budgetPct, 0) || 1;
  
  // Base KPI calculation
  let k: Record<KPIKey, number> = {
    awareness: 0,
    velocity: 0,
    efficiency: 0,
    retention: 0,
    credibility: 0
  };
  
  // Channel contribution
  channels.forEach(c => {
    const base = (c.budgetPct / chTotal) * elastic(c.intensity);
    
    switch (c.key) {
      case 'paid_social':
      case 'pr':
      case 'linkedin':
        k.awareness += base * 1.2;
        k.credibility += base * 0.8;
        break;
      case 'paid_search':
      case 'email':
        k.velocity += base * 1.3;
        k.efficiency += base * 0.9;
        break;
      case 'seo':
      case 'web':
        k.efficiency += base * 1.2;
        break;
      case 'events':
        k.credibility += base * 1.1;
        k.retention += base * 0.8;
        break;
    }
  });
  
  // Stage contribution
  k.awareness += stages.awareness * 0.8;
  k.velocity += (stages.consideration * 0.9 + stages.conversion * 1.0);
  k.retention += stages.retention * 1.2;
  
  // Persona contribution
  const personaTotal = personas.reduce((a, p) => a + p.weight, 0) || 1;
  personas.forEach(p => {
    const share = p.weight / personaTotal;
    k.awareness += share * 0.4;
    k.velocity += share * 0.3;
  });
  
  // Scale to 0-100
  const scale = (x: number) => Math.round(clamp(x / 2.5, 0, 1) * 100);
  const kpis: Record<KPIKey, number> = {
    awareness: scale(k.awareness),
    velocity: scale(k.velocity),
    efficiency: scale(k.efficiency),
    retention: scale(k.retention),
    credibility: scale(k.credibility)
  };
  
  // System load
  const avgInt = channels.reduce((a, c) => a + c.intensity, 0) / channels.length;
  const systemLoad = Math.round(clamp(avgInt, 0, 1) * 100);
  
  // Balance
  const variance = (arr: number[]) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  };
  const personaVar = variance(personas.map(p => p.weight));
  const stageVar = variance(Object.values(stages));
  const channelVar = variance(channels.map(c => c.budgetPct));
  const balance = Math.round(clamp(1 - (personaVar + stageVar + channelVar) * 2, 0, 1) * 100);
  
  // MARKET COVERAGE: How comprehensively the model covers target market
  // Factors: persona diversity, channel breadth, content variety, exec visibility
  const getWeightedArray = (items: WeightedItem[] | string[] | undefined): WeightedItem[] => {
    if (!items) return [];
    if (typeof items[0] === 'string') return (items as string[]).map(id => ({ id, weight: 0.5 }));
    return items as WeightedItem[];
  };
  
  const personaDiversity = Math.min(getWeightedArray(personas).length / 5, 1) * 35; // Max 5 personas
  const channelBreadth = Math.min(channels.length / 8, 1) * 30; // Max 8 channels
  const contentVariety = Math.min(getWeightedArray(contentTypes).length / 6, 1) * 20; // Max 6 types
  const execVisibility = Math.min(getWeightedArray(executives).length / 4, 1) * 15; // Max 4 execs
  
  const marketCoverage = Math.round(personaDiversity + channelBreadth + contentVariety + execVisibility);
  
  // PIPELINE PREDICTABILITY: Consistency and reliability of pipeline generation
  // Factors: funnel balance, stage evenness, conversion path strength
  const stageValues = Object.values(stages);
  const stageBalance = 100 - (variance(stageValues) * 200); // Low variance = high balance
  const conversionStrength = (stages.consideration + stages.conversion) * 50; // Strong middle funnel
  const funnelCompleteness = Math.min(stageValues.filter(v => v > 0.1).length / 4, 1) * 100; // All stages covered
  
  const pipelinePredictability = Math.round(
    clamp((stageBalance * 0.4 + conversionStrength * 0.3 + funnelCompleteness * 0.3), 0, 100)
  );
  
  // Warnings
  const warnings: string[] = [];
  if (kpis.velocity < 50 && stages.conversion < 0.25) warnings.push('Velocity weak; conversion underweighted');
  if (kpis.awareness > 75 && kpis.velocity < 55) warnings.push('Top-heavy awareness; pipeline may lag');
  if (systemLoad > 80) warnings.push('High system load - team strain likely');
  if (balance < 60) warnings.push('Imbalanced allocation across mix');
  if (kpis.retention < 50) warnings.push('Low retention - add nurture programs');
  if (marketCoverage < 50) warnings.push('Limited market coverage - consider expanding reach');
  if (pipelinePredictability < 50) warnings.push('Pipeline may be unpredictable - balance funnel stages');
  
  return { kpis, systemLoad, balance, marketCoverage, pipelinePredictability, warnings };
}

export default function GTMTestPit() {
  // Load from localStorage with fallback (only on client-side)
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    // Always return fallback during SSR
    if (typeof window === 'undefined') {
      return fallback;
    }
    
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [currentStep, setCurrentStep] = useState('start'); // Always start with default on SSR
  const [startMode, setStartMode] = useState<'questionnaire' | 'browse' | 'scratch' | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<GTMModel | null>(null);
  const [currentModel, setCurrentModel] = useState<GTMModel | null>(null);
  const [compareModels, setCompareModels] = useState<(GTMModel | null)[]>([null, null, null]);
  const [savedModels, setSavedModels] = useState<GTMModel[]>([]);

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    setCurrentStep(loadFromStorage('gtm_currentStep', 'start'));
    setStartMode(loadFromStorage('gtm_startMode', null));
    setSelectedArchetype(loadFromStorage('gtm_selectedArchetype', null));
    setCurrentModel(loadFromStorage('gtm_currentModel', null));
    setCompareModels(loadFromStorage('gtm_compareModels', [null, null, null]));
    setSavedModels(loadFromStorage('gtm_savedModels', []));
    setQuestionnaireAnswers(loadFromStorage('gtm_questionnaireAnswers', {}));
    setCurrentQuestionIndex(loadFromStorage('gtm_currentQuestionIndex', 0));
  }, []); // Run only once after mount
  const [searchQuery, setSearchQuery] = useState('');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const module = getModuleById('pulse-hub');
  const moduleColor = '#6218df';
  const { toast } = useToast();

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('gtm_currentStep', JSON.stringify(currentStep));
    } catch (e) {
      console.error('Failed to save currentStep:', e);
    }
  }, [currentStep]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_currentModel', JSON.stringify(currentModel));
    } catch (e) {
      console.error('Failed to save currentModel:', e);
    }
  }, [currentModel]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_compareModels', JSON.stringify(compareModels));
    } catch (e) {
      console.error('Failed to save compareModels:', e);
    }
  }, [compareModels]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_savedModels', JSON.stringify(savedModels));
    } catch (e) {
      console.error('Failed to save savedModels:', e);
    }
  }, [savedModels]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_startMode', JSON.stringify(startMode));
    } catch (e) {
      console.error('Failed to save startMode:', e);
    }
  }, [startMode]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_selectedArchetype', JSON.stringify(selectedArchetype));
    } catch (e) {
      console.error('Failed to save selectedArchetype:', e);
    }
  }, [selectedArchetype]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_questionnaireAnswers', JSON.stringify(questionnaireAnswers));
    } catch (e) {
      console.error('Failed to save questionnaireAnswers:', e);
    }
  }, [questionnaireAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('gtm_currentQuestionIndex', JSON.stringify(currentQuestionIndex));
    } catch (e) {
      console.error('Failed to save currentQuestionIndex:', e);
    }
  }, [currentQuestionIndex]);


  const steps = [
    { id: 'start', label: 'Start', description: 'Choose your path' },
    { id: 'builder', label: 'Model Builder', description: 'Configure GTM model' },
    { id: 'analysis', label: 'Analysis', description: 'Selected model insights' },
    { id: 'compare', label: 'Compare', description: 'Deep 3-way comparison' },
    { id: 'library', label: 'My Models', description: 'Saved models library' },
  ];

  // Compute current model KPIs
  const currentKPIs = useMemo(() => {
    if (!currentModel) return null;
    return computeKPIs(currentModel.config);
  }, [currentModel]);

  const renderContent = () => {
    // START MODE
    if (currentStep === 'start') {
      return (
        <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            <div className="text-center mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: moduleColor }}>GTM Test Pit</h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Pull levers, test strategies, compare models. Your GTM laboratory.
              </p>
            </div>

            <div className="grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">
              <Card 
                className="cursor-pointer border-2 hover:shadow-lg transition-all"
                onClick={() => { 
                  setStartMode('questionnaire'); 
                  setCurrentQuestionIndex(0);
                  setQuestionnaireAnswers({});
                  setCurrentStep('questionnaire'); 
                }}
                data-testid="card-questionnaire"
              >
                <CardHeader>
                  <div className="p-4 rounded-lg inline-block mb-2" style={{ backgroundColor: `${moduleColor}20` }}>
                    <Target className="w-8 h-8" style={{ color: moduleColor }} />
                  </div>
                  <CardTitle>Guided Questionnaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Answer strategic questions and get a recommended archetype model tailored to your goals.
                  </p>
                  <Badge className="text-xs font-semibold bg-purple-100 text-purple-700 border-0">
                    Recommended for beginners
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer border-2 hover:shadow-lg transition-all"
                onClick={() => { setStartMode('browse'); setCurrentStep('library'); }}
                data-testid="card-browse"
              >
                <CardHeader>
                  <div className="p-4 rounded-lg inline-block mb-2" style={{ backgroundColor: `${moduleColor}20` }}>
                    <BookOpen className="w-8 h-8" style={{ color: moduleColor }} />
                  </div>
                  <CardTitle>Browse Archetypes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore {ARCHETYPE_MODELS.length} pre-built archetype models with detailed analysis and use cases.
                  </p>
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-0">
                    {ARCHETYPE_MODELS.length} archetypes available
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer border-2 hover:shadow-lg transition-all"
                onClick={() => { 
                  setStartMode('scratch');
                  setCurrentModel({
                    name: 'Custom Model',
                    config: {
                      personas: [
                        { id: 'exec', name: 'Executive Buyer', weight: 0.33 },
                        { id: 'ops', name: 'Operations Lead', weight: 0.33 },
                        { id: 'fin', name: 'Finance Stakeholder', weight: 0.34 }
                      ],
                      stages: { awareness: 0.25, consideration: 0.25, conversion: 0.25, retention: 0.25 },
                      channels: [
                        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'email', label: 'Email', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'web', label: 'Web', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'events', label: 'Events', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'pr', label: 'PR', budgetPct: 0.125, intensity: 0.5 },
                        { key: 'seo', label: 'SEO', budgetPct: 0.125, intensity: 0.5 }
                      ]
                    },
                    kpis: { awareness: 50, velocity: 50, efficiency: 50, retention: 50, credibility: 50 },
                    systemLoad: 50,
                    balance: 100,
                    marketCoverage: 50,
                    pipelinePredictability: 50,
                    warnings: []
                  });
                  setCurrentStep('builder');
                }}
                data-testid="card-scratch"
              >
                <CardHeader>
                  <div className="p-4 rounded-lg inline-block mb-2" style={{ backgroundColor: `${moduleColor}20` }}>
                    <Rocket className="w-8 h-8" style={{ color: moduleColor }} />
                  </div>
                  <CardTitle>Build from Scratch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start with a blank canvas and configure every aspect of your GTM model manually.
                  </p>
                  <Badge className="text-xs bg-purple-100 text-purple-700 border-0">
                    Full control
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {savedModels.length > 0 && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedModels.slice(0, 3).map((model, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => { setCurrentModel(model); setCurrentStep('builder'); }}
                        data-testid={`recent-model-${idx}`}
                      >
                        <div>
                          <p className="font-semibold">{model.name}</p>
                          <p className="text-xs text-gray-600">{model.code}</p>
                        </div>
                        <Badge className="text-xs" variant="outline">{model.archetype}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Quick Guidance</p>
                    <ul className="space-y-1">
                      <li><strong>Want reach?</strong> Brand-Heavy — keep credibility high; add 2–3 conversion accelerators</li>
                      <li><strong>Want near-term revenue?</strong> Demand Surge — protect team capacity; add light retention touches</li>
                      <li><strong>Want to defend ARR?</strong> Retention Focused (Fortress) — schedule periodic awareness bursts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // QUESTIONNAIRE - Guided questionnaire flow
    if (currentStep === 'questionnaire') {
      const currentQuestion = GTM_QUESTIONNAIRE[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / GTM_QUESTIONNAIRE.length) * 100;
      const isLastQuestion = currentQuestionIndex === GTM_QUESTIONNAIRE.length - 1;

      const handleAnswerSelect = (value: string) => {
        const newAnswers = { ...questionnaireAnswers, [currentQuestion.id]: value };
        setQuestionnaireAnswers(newAnswers);

        if (isLastQuestion) {
          // Calculate recommended archetype
          const recommendedArchetype = calculateRecommendedArchetype(newAnswers);
          const archetypeModel = ARCHETYPE_MODELS.find(m => 
            m.archetype === recommendedArchetype || 
            m.name.toLowerCase().includes(recommendedArchetype)
          );

          if (archetypeModel) {
            setCurrentModel(JSON.parse(JSON.stringify(archetypeModel)));
            setCurrentStep('builder');
          }
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      };

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentStep('start')}
                data-testid="button-back-to-start"
              >
                ← Back to Start
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: moduleColor }}>Guided GTM Questionnaire</h1>
              <p className="text-lg text-muted-foreground">
                Answer 6 strategic questions to get your personalized archetype recommendation
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Question {currentQuestionIndex + 1} of {GTM_QUESTIONNAIRE.length}</span>
                <span className="font-semibold" style={{ color: moduleColor }}>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${progress}%`, backgroundColor: moduleColor }}
                />
              </div>
            </div>

            {/* Current Question */}
            <Card className="border-2" style={{ borderColor: `${moduleColor}40` }}>
              <CardHeader>
                <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{currentQuestion.guidance}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                      questionnaireAnswers[currentQuestion.id] === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(option.value)}
                    data-testid={`option-${option.value}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          questionnaireAnswers[currentQuestion.id] === option.value
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {questionnaireAnswers[currentQuestion.id] === option.value && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{option.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                data-testid="button-previous-question"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => {
                  if (questionnaireAnswers[currentQuestion.id]) {
                    handleAnswerSelect(questionnaireAnswers[currentQuestion.id]);
                  }
                }}
                disabled={!questionnaireAnswers[currentQuestion.id]}
                data-testid="button-next-question"
                style={{ backgroundColor: questionnaireAnswers[currentQuestion.id] ? moduleColor : undefined }}
              >
                {isLastQuestion ? 'Get My Recommendation →' : 'Next →'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // LIBRARY - Browse Archetypes & Saved Models
    if (currentStep === 'library') {
      const displayModels = startMode === 'browse' ? ARCHETYPE_MODELS : [...ARCHETYPE_MODELS, ...savedModels];
      const filtered = searchQuery 
        ? displayModels.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.archetype?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : displayModels;

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: moduleColor }}>
                    {startMode === 'browse' ? 'Browse Archetype Models' : 'My Models Library'}
                  </h2>
                  <QuickGuidance guidanceKey={startMode === 'browse' ? 'archetype' : 'gtm_model'} iconSize={16} />
                </div>
                <p className="text-muted-foreground">
                  {startMode === 'browse' ? 'Explore pre-built GTM archetypes' : 'Manage your saved GTM models'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Input 
                placeholder="Search models..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
                data-testid="input-search-models"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((model, idx) => {
                const isArchetype = ARCHETYPE_MODELS.includes(model);
                const savedModelIndex = savedModels.findIndex(m => m.id === model.id || (m.name === model.name && !isArchetype));
                
                return (
                  <Card key={idx} className="border border-gray-200" data-testid={`model-card-${idx}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg" style={{ color: moduleColor }}>{model.name}</CardTitle>
                          {model.description && (
                            <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          )}
                        </div>
                        {isArchetype && (
                          <Badge className="text-xs bg-purple-100 text-purple-700 border-0">Archetype</Badge>
                        )}
                        {!isArchetype && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 border-0">Custom</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
                        {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => (
                          <div key={kpi}>
                            <p className="text-2xl font-bold" style={{ color: moduleColor }}>{model.kpis[kpi]}</p>
                            <div className="flex items-center justify-center gap-1">
                              <p className="text-xs text-gray-600 capitalize">{kpi}</p>
                              <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={10} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Load: {model.systemLoad}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Balance: {model.balance}</span>
                        </div>
                      </div>

                      {model.analysis && (
                        <p className="text-sm text-gray-700 line-clamp-2">{model.analysis}</p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          onClick={() => { setCurrentModel(JSON.parse(JSON.stringify(model))); setCurrentStep('builder'); }}
                          data-testid={`button-use-${idx}`}
                        >
                          <Play className="w-3 h-3 mr-1" /> Use This Model
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => { setCurrentModel(JSON.parse(JSON.stringify(model))); setCurrentStep('analysis'); }}
                          data-testid={`button-analyze-${idx}`}
                        >
                          View Analysis
                        </Button>
                        
                        {/* Clone button for both archetype and saved models */}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const cloned = JSON.parse(JSON.stringify(model));
                            cloned.id = `model-${Date.now()}`;
                            cloned.name = `${model.name} (Copy)`;
                            cloned.createdAt = new Date().toISOString();
                            setSavedModels([...savedModels, cloned]);
                            toast({
                              title: "Model Cloned",
                              description: `"${cloned.name}" has been added to your library.`,
                            });
                          }}
                          data-testid={`button-clone-${idx}`}
                        >
                          <Copy className="w-3 h-3 mr-1" /> Clone
                        </Button>
                        
                        {/* Edit and Delete only for saved models */}
                        {!isArchetype && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setCurrentModel(JSON.parse(JSON.stringify(model)));
                                setCurrentStep('builder');
                                toast({
                                  title: "Editing Model",
                                  description: `Now editing "${model.name}"`,
                                });
                              }}
                              data-testid={`button-edit-${idx}`}
                            >
                              <Edit className="w-3 h-3 mr-1" /> Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (savedModelIndex >= 0) {
                                  const modelName = model.name;
                                  const updated = savedModels.filter((_, i) => i !== savedModelIndex);
                                  setSavedModels(updated);
                                  toast({
                                    title: "Model Deleted",
                                    description: `"${modelName}" has been removed from your library.`,
                                    variant: "destructive",
                                  });
                                }
                              }}
                              data-testid={`button-delete-${idx}`}
                            >
                              <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="pt-12 pb-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No models found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    }

    // BUILDER - Cockpit with tabs
    if (currentStep === 'builder') {
      if (!currentModel) return <div className="p-8">Please select a model from the library first.</div>;

      const kpis = currentKPIs || computeKPIs(currentModel.config);

      // Helper functions to work with weighted items
      const getWeightedItems = (items: WeightedItem[] | string[] | undefined, defaultWeight = 0.5): WeightedItem[] => {
        if (!items) return [];
        if (typeof items[0] === 'string') {
          return (items as string[]).map(id => ({ id, weight: defaultWeight }));
        }
        return items as WeightedItem[];
      };

      const isItemSelected = (items: WeightedItem[] | string[] | undefined, id: string): boolean => {
        if (!items) return false;
        if (typeof items[0] === 'string') {
          return (items as string[]).includes(id);
        }
        return (items as WeightedItem[]).some(item => item.id === id);
      };

      const getItemWeight = (items: WeightedItem[] | string[] | undefined, id: string): number => {
        if (!items) return 0.5;
        if (typeof items[0] === 'string') return 0.5;
        const item = (items as WeightedItem[]).find(i => i.id === id);
        return item ? item.weight : 0.5;
      };

      const toggleItem = (items: WeightedItem[] | string[] | undefined, id: string, checked: boolean): WeightedItem[] => {
        const weighted = getWeightedItems(items);
        if (checked) {
          return [...weighted, { id, weight: 0.5 }];
        }
        return weighted.filter(item => item.id !== id);
      };

      const updateItemWeight = (items: WeightedItem[] | string[] | undefined, id: string, weight: number): WeightedItem[] => {
        const weighted = getWeightedItems(items);
        return weighted.map(item => item.id === id ? { ...item, weight } : item);
      };

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: moduleColor }}>Model Builder: {currentModel.name}</h2>
                <p className="text-muted-foreground">Configure channels, content, messaging, and goals with granular control</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const modelToSave = {
                      ...currentModel,
                      id: currentModel.id || `model-${Date.now()}`,
                      createdAt: new Date().toISOString(),
                      kpis: kpis.kpis,
                      systemLoad: kpis.systemLoad,
                      balance: kpis.balance,
                      warnings: kpis.warnings
                    };
                    const updated = [...savedModels.filter(m => m.id !== modelToSave.id), modelToSave];
                    setSavedModels(updated);
                    toast({
                      title: "Model Saved Successfully",
                      description: `${currentModel.name} with System Load: ${kpis.systemLoad}%, Balance: ${kpis.balance}%`
                    });
                  }}
                  data-testid="button-save-model"
                >
                  <Save className="w-3 h-3 mr-1" /> Save Model
                </Button>
                <Button size="sm" onClick={() => setCurrentStep('compare')} data-testid="button-go-compare">
                  <ArrowLeftRight className="w-3 h-3 mr-1" /> Compare Models
                </Button>
              </div>
            </div>

            {/* KPI Dashboard */}
            <div className="grid !grid-cols-2 sm:!grid-cols-3 lg:!grid-cols-5 gap-4">
              {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => (
                <Card key={kpi} className="border border-gray-200">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1" style={{ color: moduleColor }}>{kpis.kpis[kpi]}</p>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-sm text-gray-600 capitalize">{kpi}</p>
                      <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={14} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border border-gray-200">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gauge className="w-5 h-5 text-gray-600" />
                    <p className="text-sm text-gray-600">System Load</p>
                    <QuickGuidance guidanceKey="system_load" iconSize={14} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: kpis.systemLoad > 80 ? '#ef4444' : moduleColor }}>
                    {kpis.systemLoad}%
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <p className="text-sm text-gray-600">Balance Index</p>
                    <QuickGuidance guidanceKey="balance_score" iconSize={14} />
                  </div>
                  <p className="text-3xl font-bold" style={{ color: kpis.balance < 60 ? '#ef4444' : moduleColor }}>
                    {kpis.balance}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Warnings */}
            {kpis.warnings.length > 0 && (
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-900 mb-2">Warnings</p>
                      <ul className="space-y-1">
                        {kpis.warnings.map((w, i) => (
                          <li key={i} className="text-sm text-yellow-800">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overall Budget Level - Above All Tabs */}
            <Card className="border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Overall Budget Level</CardTitle>
                  <QuickGuidance guidanceKey="budget" iconSize={14} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Global budget multiplier - scales total investment up or down across all channels and stages
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Budget Multiplier</Label>
                    <span className="text-sm font-bold text-emerald-700">
                      {Math.round(((currentModel.config.channelsCategoryWeight || 1) + (currentModel.config.stagesCategoryWeight || 1)) / 2 * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[Math.round(((currentModel.config.channelsCategoryWeight || 1) + (currentModel.config.stagesCategoryWeight || 1)) / 2 * 100)]}
                    onValueChange={([v]) => {
                      const newWeight = v / 100;
                      setCurrentModel({
                        ...currentModel,
                        config: {
                          ...currentModel.config,
                          channelsCategoryWeight: newWeight,
                          stagesCategoryWeight: newWeight
                        }
                      });
                    }}
                    min={50}
                    max={150}
                    step={5}
                    data-testid="slider-budget-intensity"
                  />
                  
                  {/* Coaching Insights */}
                  <div className="pt-2 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>How to use:</strong> Set your overall budget reality first, then fine-tune allocation in each tab.
                      </p>
                    </div>
                    <div className="bg-white/60 border border-emerald-200 rounded p-2 space-y-1">
                      <p className="text-gray-600">
                        <strong className="text-emerald-700">85%</strong> = Budget cut scenario (15% reduction)
                      </p>
                      <p className="text-gray-600">
                        <strong className="text-emerald-700">100%</strong> = Baseline budget (no change)
                      </p>
                      <p className="text-gray-600">
                        <strong className="text-emerald-700">120%</strong> = Growth scenario (20% increase)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Builder Configuration */}
            <Tabs defaultValue="budget" className="w-full">
            
<TabsList className="grid w-full !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-6 h-auto gap-1">
  <TabsTrigger value="budget" data-testid="tab-budget" className="py-3">
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs sm:text-sm">Paid Budget</span>
      <span className="text-[10px] text-muted-foreground">$$</span>
    </div>
  </TabsTrigger>
  <TabsTrigger value="channels" data-testid="tab-channels" className="py-3">
    <span className="text-xs sm:text-sm">Channel Mix</span>
  </TabsTrigger>
  <TabsTrigger value="content" data-testid="tab-content" className="py-3">
    <span className="text-xs sm:text-sm">Content Types</span>
  </TabsTrigger>
  <TabsTrigger value="stages" data-testid="tab-stages" className="py-3">
    <span className="text-xs sm:text-sm">Funnel Stages</span>
  </TabsTrigger>
  <TabsTrigger value="messaging" data-testid="tab-messaging" className="py-3">
    <span className="text-xs sm:text-sm">Messaging Mix</span>
  </TabsTrigger>
  <TabsTrigger value="goals" data-testid="tab-goals" className="py-3">
    <span className="text-xs sm:text-sm">Goals</span>
  </TabsTrigger>
</TabsList>
              {/* BUDGET MIX TAB */}
              <TabsContent value="budget" className="space-y-6 mt-6">
                <Card className="border border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Paid Activities Budget</CardTitle>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        $ Budget Only
                      </Badge>
                      <QuickGuidance guidanceKey="budget_mix" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>This tab is for paid activities only.</strong> Allocate your actual marketing budget across paid channels and sponsorships. It does not include creation, tools, or any other budget item.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Optional Total Budget Input */}
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Total Budget (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">$</span>
                        <Input
                          type="number"
                          placeholder="e.g., 500000"
                          value={currentModel.config.totalBudget || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            setCurrentModel({
                              ...currentModel,
                              config: { ...currentModel.config, totalBudget: val }
                            });
                          }}
                          className="max-w-xs"
                          data-testid="input-total-budget"
                        />
                      </div>
                      <p className="text-xs text-emerald-700 mt-2">
                        Enter your total paid budget for dollar calculations. Leave blank to work with percentages only.
                      </p>
                    </div>

                    {/* Budget Activities */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {(currentModel.config.budgetMix || DEFAULT_BUDGET_MIX).map((activity, idx) => {
                        const budgetMix = currentModel.config.budgetMix || DEFAULT_BUDGET_MIX;
                        const totalBudget = currentModel.config.totalBudget;
                        const dollarAmount = totalBudget ? totalBudget * activity.allocation : null;
                        
                        return (
                          <div key={activity.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">{activity.label}</Label>
                              <div className="flex items-center gap-3">
                                {dollarAmount && (
                                  <span className="text-xs text-emerald-600 font-medium">
                                    ${Math.round(dollarAmount).toLocaleString()}
                                  </span>
                                )}
                                <span className="text-xs text-gray-600 w-12 text-right">
                                  {Math.round(activity.allocation * 100)}%
                                </span>
                              </div>
                            </div>
                            <Slider
                              value={[activity.allocation * 100]}
                              onValueChange={([v]) => {
                                const newAllocation = v / 100;
                                const rebalanced = rebalanceBudgetActivities(budgetMix, idx, newAllocation);
                                setCurrentModel({
                                  ...currentModel,
                                  config: { ...currentModel.config, budgetMix: rebalanced }
                                });
                              }}
                              min={0}
                              max={100}
                              step={1}
                              data-testid={`slider-budget-${activity.key}`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Verification */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Allocation</span>
                        <span className="text-sm font-bold text-emerald-700">
                          {Math.round((currentModel.config.budgetMix || DEFAULT_BUDGET_MIX).reduce((sum, a) => sum + a.allocation, 0) * 100)}%
                        </span>
                      </div>
                      {currentModel.config.totalBudget && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">Total Dollars</span>
                          <span className="text-xs font-semibold text-emerald-600">
                            ${Math.round(currentModel.config.totalBudget).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CHANNEL MIX TAB */}
              <TabsContent value="channels" className="space-y-6 mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Channel Focus</CardTitle>
                      <QuickGuidance guidanceKey="channel_focus" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strategic allocation across channels.
                    </p>
                  </CardHeader>
                  <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Individual Channel Sliders */}
                  {currentModel.config.channels.map((ch, idx) => (
                    <div key={ch.key} className="space-y-3 p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium capitalize">{ch.label}</Label>
                        <QuickGuidance guidanceKey={`channel_${ch.key}`} iconSize={12} />
                      </div>
                      
                      {/* Intensity Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Intensity</span>
                          <span className="text-xs text-gray-600">{pct(ch.intensity)}</span>
                        </div>
                        <Slider
                          value={[ch.intensity * 100]}
                          onValueChange={([v]) => {
                            const updated = [...currentModel.config.channels];
                            updated[idx].intensity = v / 100;
                            setCurrentModel({ ...currentModel, config: { ...currentModel.config, channels: updated } });
                          }}
                          max={100}
                          step={1}
                          data-testid={`slider-intensity-${ch.key}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Validation for Intensity */}
                <div className="mt-6 pt-4 border-t">
                  {(() => {
                    const total = Math.round(
                      currentModel.config.channels.reduce((sum, ch) => sum + ch.intensity, 0) * 100
                    );
                    const isValid = total === 100;
                    return (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Intensity Allocation</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                            {total}%
                          </span>
                          {isValid ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  {(() => {
                    const total = Math.round(
                      currentModel.config.channels.reduce((sum, ch) => sum + ch.intensity, 0) * 100
                    );
                    return total !== 100 && (
                      <p className="text-xs text-red-600 mt-2 text-right">
                        Total must equal 100% to proceed
                      </p>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
              </TabsContent>

              {/* CONTENT TYPES TAB */}
              <TabsContent value="content" className="space-y-6 mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Content Focus</CardTitle>
                      <QuickGuidance guidanceKey="content_types" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strategic content format allocation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Individual Content Type Sliders */}
                      {MOCK_CONTENT_TYPES.map((content) => {
                        const weighted = getWeightedItems(currentModel.config.contentTypes, 0);
                        const item = weighted.find(w => w.id === content.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={content.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{content.name}</Label>
                                <span className="text-xs text-muted-foreground block">{content.channel}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <Slider
                              value={[weight * 100]}
                              onValueChange={([v]) => {
                                const newWeight = v / 100;
                                let updated = getWeightedItems(currentModel.config.contentTypes, 0);
                                
                                if (newWeight === 0) {
                                  // Remove if set to 0 and rebalance remaining
                                  updated = updated.filter(w => w.id !== content.id);
                                  if (updated.length > 0) {
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                } else {
                                  const idx = updated.findIndex(w => w.id === content.id);
                                  if (idx >= 0) {
                                    // Existing item - rebalance
                                    updated = rebalanceWeights(updated, idx, newWeight);
                                  } else {
                                    // New item - add and rebalance
                                    updated = [...updated, { id: content.id, weight: newWeight }];
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                }
                                
                                setCurrentModel({ ...currentModel, config: { ...currentModel.config, contentTypes: updated } });
                              }}
                              max={100}
                              step={1}
                              data-testid={`slider-content-${content.id}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Total Validation */}
                    <div className="mt-6 pt-4 border-t">
                      {(() => {
                        const weighted = getWeightedItems(currentModel.config.contentTypes, 0);
                        const total = Math.round(weighted.reduce((sum, w) => sum + w.weight, 0) * 100);
                        const isValid = total === 100;
                        return (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Total Allocation</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                                {total}%
                              </span>
                              {isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const weighted = getWeightedItems(currentModel.config.contentTypes, 0);
                        const total = Math.round(weighted.reduce((sum, w) => sum + w.weight, 0) * 100);
                        return total !== 100 && (
                          <p className="text-xs text-red-600 mt-2 text-right">
                            Total must equal 100% to proceed
                          </p>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FUNNEL STAGES TAB */}
              <TabsContent value="stages" className="space-y-6 mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Funnel Stage Focus</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Strategic allocation across funnel stages.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Individual Stage Sliders */}
                      {(['awareness', 'consideration', 'conversion', 'retention'] as StageKey[]).map(stage => (
                        <div key={stage} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium capitalize">{stage}</Label>
                              <QuickGuidance guidanceKey={`stage_${stage}`} iconSize={12} />
                            </div>
                            <span className="text-xs text-gray-600">{pct(currentModel.config.stages[stage])}</span>
                          </div>
                          <Slider
                            value={[currentModel.config.stages[stage] * 100]}
                            onValueChange={([v]) => {
                              const rebalanced = rebalanceStages(
                                currentModel.config.stages,
                                stage,
                                v / 100
                              );
                              setCurrentModel({
                                ...currentModel,
                                config: {
                                  ...currentModel.config,
                                  stages: rebalanced
                                }
                              });
                            }}
                            max={100}
                            step={1}
                            data-testid={`slider-stage-${stage}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Validation */}
                    <div className="mt-6 pt-4 border-t">
                      {(() => {
                        const total = Math.round(
                          Object.values(currentModel.config.stages).reduce((sum, val) => sum + val, 0) * 100
                        );
                        const isValid = total === 100;
                        return (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Total Allocation</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                                {total}%
                              </span>
                              {isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const total = Math.round(
                          Object.values(currentModel.config.stages).reduce((sum, val) => sum + val, 0) * 100
                        );
                        return total !== 100 && (
                          <p className="text-xs text-red-600 mt-2 text-right">
                            Total must equal 100% to proceed
                          </p>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MESSAGING MIX TAB */}
              <TabsContent value="messaging" className="space-y-6 mt-6">
                {/* Personas */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Persona Focus</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Target persona allocation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Individual Persona Sliders */}
                      {currentModel.config.personas.map((persona, idx) => (
                        <div key={persona.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">{persona.name}</Label>
                            <span className="text-xs text-gray-600">{pct(persona.weight)}</span>
                          </div>
                          <Slider
                            value={[persona.weight * 100]}
                            onValueChange={([v]) => {
                              const rebalanced = rebalanceWeights(
                                currentModel.config.personas,
                                idx,
                                v / 100
                              );
                              setCurrentModel({ ...currentModel, config: { ...currentModel.config, personas: rebalanced } });
                            }}
                            max={100}
                            step={1}
                            data-testid={`slider-persona-${persona.id}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Validation */}
                    <div className="mt-6 pt-4 border-t">
                      {(() => {
                        const total = Math.round(
                          currentModel.config.personas.reduce((sum, p) => sum + p.weight, 0) * 100
                        );
                        const isValid = total === 100;
                        return (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Total Allocation</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                                {total}%
                              </span>
                              {isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const total = Math.round(
                          currentModel.config.personas.reduce((sum, p) => sum + p.weight, 0) * 100
                        );
                        return total !== 100 && (
                          <p className="text-xs text-red-600 mt-2 text-right">
                            Total must equal 100% to proceed
                          </p>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Executive Visibility */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Executive Visibility</CardTitle>
                      <QuickGuidance guidanceKey="executives" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Executive influence allocation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Individual Executive Sliders */}
                      {MOCK_EXECUTIVES.map((exec) => {
                        const weighted = getWeightedItems(currentModel.config.executives, 0);
                        const item = weighted.find(w => w.id === exec.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={exec.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{exec.name}</Label>
                                <span className="text-xs text-muted-foreground block">{exec.title}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <Slider
                              value={[weight * 100]}
                              onValueChange={([v]) => {
                                const newWeight = v / 100;
                                let updated = getWeightedItems(currentModel.config.executives, 0);
                                
                                if (newWeight === 0) {
                                  // Remove if set to 0 and rebalance remaining
                                  updated = updated.filter(w => w.id !== exec.id);
                                  if (updated.length > 0) {
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                } else {
                                  const idx = updated.findIndex(w => w.id === exec.id);
                                  if (idx >= 0) {
                                    // Existing item - rebalance
                                    updated = rebalanceWeights(updated, idx, newWeight);
                                  } else {
                                    // New item - add and rebalance
                                    updated = [...updated, { id: exec.id, weight: newWeight }];
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                }
                                
                                setCurrentModel({ ...currentModel, config: { ...currentModel.config, executives: updated } });
                              }}
                              max={100}
                              step={1}
                              data-testid={`slider-exec-${exec.id}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Strategic Pillars */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Strategic Pillars</CardTitle>
                      <QuickGuidance guidanceKey="pillars" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Messaging weight for core strategic themes.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Individual Pillar Sliders */}
                      {MOCK_PILLARS.map((pillar) => {
                        const weighted = getWeightedItems(currentModel.config.pillars, 0);
                        const item = weighted.find(w => w.id === pillar.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={pillar.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{pillar.name}</Label>
                                <span className="text-xs text-muted-foreground block">{pillar.description}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <Slider
                              value={[weight * 100]}
                              onValueChange={([v]) => {
                                const newWeight = v / 100;
                                let updated = getWeightedItems(currentModel.config.pillars, 0);
                                
                                if (newWeight === 0) {
                                  // Remove if set to 0 and rebalance remaining
                                  updated = updated.filter(w => w.id !== pillar.id);
                                  if (updated.length > 0) {
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                } else {
                                  const idx = updated.findIndex(w => w.id === pillar.id);
                                  if (idx >= 0) {
                                    // Existing item - rebalance
                                    updated = rebalanceWeights(updated, idx, newWeight);
                                  } else {
                                    // New item - add and rebalance
                                    updated = [...updated, { id: pillar.id, weight: newWeight }];
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                }
                                
                                setCurrentModel({ ...currentModel, config: { ...currentModel.config, pillars: updated } });
                              }}
                              max={100}
                              step={1}
                              data-testid={`slider-pillar-${pillar.id}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* GOALS TAB */}
              <TabsContent value="goals" className="space-y-6 mt-6">
                {/* Business Goals */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Business Goals</CardTitle>
                      <QuickGuidance guidanceKey="goals" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Priority for each business objective.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Individual Goal Sliders */}
                      {MOCK_GOALS.map((goal) => {
                        const weighted = getWeightedItems(currentModel.config.goals, 0);
                        const item = weighted.find(w => w.id === goal.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={goal.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{goal.name}</Label>
                                <span className="text-xs text-muted-foreground block">{goal.category}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <Slider
                              value={[weight * 100]}
                              onValueChange={([v]) => {
                                const newWeight = v / 100;
                                let updated = getWeightedItems(currentModel.config.goals, 0);
                                
                                if (newWeight === 0) {
                                  // Remove if set to 0 and rebalance remaining
                                  updated = updated.filter(w => w.id !== goal.id);
                                  if (updated.length > 0) {
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                } else {
                                  const idx = updated.findIndex(w => w.id === goal.id);
                                  if (idx >= 0) {
                                    // Existing item - rebalance
                                    updated = rebalanceWeights(updated, idx, newWeight);
                                  } else {
                                    // New item - add and rebalance
                                    updated = [...updated, { id: goal.id, weight: newWeight }];
                                    const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                    if (total > 0) {
                                      updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                    }
                                  }
                                }
                                
                                setCurrentModel({ ...currentModel, config: { ...currentModel.config, goals: updated } });
                              }}
                              max={100}
                              step={1}
                              data-testid={`slider-goal-${goal.id}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    }

    // COMPARE - Deep 3-way comparison
    if (currentStep === 'compare') {
      const allModels = [...ARCHETYPE_MODELS, ...savedModels];
      
      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: moduleColor }}>Compare Models</h2>
              <p className="text-muted-foreground">Deep 3-way comparison with tradeoff analysis</p>
            </div>

            {/* Model Selection */}
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map(slot => (
                <Card key={slot} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Model {slot + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {compareModels[slot] ? (
                      <div>
                        <p className="font-semibold mb-2">{compareModels[slot]!.name}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const updated = [...compareModels];
                            updated[slot] = null;
                            setCompareModels(updated);
                          }}
                          data-testid={`button-clear-${slot}`}
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Clear
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {allModels.slice(0, 5).map((model, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              const updated = [...compareModels];
                              updated[slot] = model;
                              setCompareModels(updated);
                            }}
                            data-testid={`button-select-${slot}-${idx}`}
                          >
                            {model.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Table */}
            {compareModels.filter(m => m !== null).length >= 2 && (
              <>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">KPI Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Metric</th>
                            {compareModels.map((model, idx) => model && (
                              <th key={idx} className="text-center p-2">{model.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => (
                            <tr key={kpi} className="border-b">
                              <td className="p-2 capitalize font-medium">
                                <div className="flex items-center gap-2">
                                  {kpi}
                                  <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={12} />
                                </div>
                              </td>
                              {compareModels.map((model, idx) => model && (
                                <td key={idx} className="text-center p-2">
                                  <span className="text-lg font-bold" style={{ color: moduleColor }}>
                                    {model.kpis[kpi]}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr className="border-b">
                            <td className="p-2 font-medium">
                              <div className="flex items-center gap-2">
                                System Load
                                <QuickGuidance guidanceKey="system_load" iconSize={12} />
                              </div>
                            </td>
                            {compareModels.map((model, idx) => model && (
                              <td key={idx} className="text-center p-2">
                                <span className={`text-lg font-bold ${model.systemLoad > 80 ? 'text-red-500' : ''}`}>
                                  {model.systemLoad}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">
                              <div className="flex items-center gap-2">
                                Balance
                                <QuickGuidance guidanceKey="balance_score" iconSize={12} />
                              </div>
                            </td>
                            {compareModels.map((model, idx) => model && (
                              <td key={idx} className="text-center p-2">
                                <span className="text-lg font-bold" style={{ color: moduleColor }}>
                                  {model.balance}
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Funnel Visualizations */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Funnel Flow Comparison</CardTitle>
                      <QuickGuidance guidanceKey="funnel_stages" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">Visual comparison of customer journey emphasis across models</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {compareModels.map((model, idx) => model && (
                        <div key={idx} className="space-y-3">
                          <p className="font-semibold text-center text-sm mb-4">{model.name}</p>
                          <div className="space-y-2">
                            {(['awareness', 'consideration', 'conversion', 'retention'] as StageKey[]).map((stage, stageIdx) => {
                              const value = model.config.stages[stage];
                              const width = (value * 100).toFixed(0);
                              const colors = {
                                awareness: 'bg-blue-500',
                                consideration: 'bg-purple-500',
                                conversion: 'bg-pink-500',
                                retention: 'bg-green-500'
                              };
                              
                              return (
                                <div key={stage}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs capitalize text-gray-600">{stage}</span>
                                    <span className="text-xs font-semibold">{width}%</span>
                                  </div>
                                  <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                                    <div 
                                      className={`h-full ${colors[stage]} transition-all duration-300`}
                                      style={{ width: `${width}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Win Scenarios */}
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-lg text-green-900">When Each Model Wins</CardTitle>
                    </div>
                    <p className="text-sm text-green-700">Strategic contexts where each approach excels</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {compareModels.map((model, idx) => model && (
                        <div key={idx} className="p-4 bg-white rounded-lg border border-green-200 space-y-3">
                          <p className="font-bold text-green-900">{model.name}</p>
                          <div className="space-y-2">
                            {/* Generate win scenarios based on model characteristics */}
                            {model.kpis.awareness > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Maximum brand awareness and market visibility needed</p>
                              </div>
                            )}
                            {model.kpis.velocity > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Speed to market is critical competitive advantage</p>
                              </div>
                            )}
                            {model.kpis.efficiency > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Budget constraints require maximum ROI optimization</p>
                              </div>
                            )}
                            {model.kpis.retention > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Long-term customer value and loyalty are priorities</p>
                              </div>
                            )}
                            {model.kpis.credibility > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Trust and authority building in competitive market</p>
                              </div>
                            )}
                            {model.systemLoad < 60 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Team has limited resources or bandwidth</p>
                              </div>
                            )}
                            {model.balance > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Balanced approach across all funnel stages needed</p>
                              </div>
                            )}
                            {model.config.stages.awareness > 0.35 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">New market entry or category creation</p>
                              </div>
                            )}
                            {model.config.stages.conversion > 0.35 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Established brand needs to maximize conversions</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tradeoff Analysis */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Tradeoff Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground">What you gain vs what you give up</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {compareModels[0] && compareModels[1] && (
                        <div className="p-4 rounded-lg bg-gray-50">
                          <p className="font-semibold mb-2">{compareModels[0].name} vs {compareModels[1].name}</p>
                          <ul className="space-y-1 text-sm">
                            {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => {
                              const diff = compareModels[0]!.kpis[kpi] - compareModels[1]!.kpis[kpi];
                              if (Math.abs(diff) > 5) {
                                return (
                                  <li key={kpi} className={diff > 0 ? 'text-green-700' : 'text-red-700'}>
                                    {diff > 0 ? '↑' : '↓'} {Math.abs(diff)} points in {kpi}
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={() => {
                    if (compareModels[0]) {
                      setCurrentModel(compareModels[0]);
                      setCurrentStep('analysis');
                    }
                  }} data-testid="button-analyze-selected">
                    Analyze Selected Model
                  </Button>
                  <Button variant="outline" onClick={exportComparison} data-testid="button-export-comparison">
                    <FileDown className="w-3 h-3 mr-1" /> Export Comparison
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    // ANALYSIS - Selected model deep dive
    if (currentStep === 'analysis') {
      const allModels = [...ARCHETYPE_MODELS, ...savedModels];
      
      const kpis = currentModel ? (currentKPIs || computeKPIs(currentModel.config)) : null;

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>
                  {currentModel ? currentModel.name : 'Analysis'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentModel ? (currentModel.description || 'Deep analysis of this GTM model') : 'Select a model to analyze'}
                </p>
              </div>
              <div className="w-64">
                <Label className="text-sm mb-2 block">Select Model to Analyze</Label>
                <Select
                  value={currentModel?.id || currentModel?.name || ''}
                  onValueChange={(value) => {
                    const selected = allModels.find(m => (m.id || m.name) === value);
                    if (selected) {
                      setCurrentModel(JSON.parse(JSON.stringify(selected)));
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-analysis-model">
                    <SelectValue placeholder="Choose a model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allModels.map((model) => (
                      <SelectItem key={model.id || model.name} value={model.id || model.name}>
                        {model.name} {model.archetype && `(${model.archetype})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!currentModel && (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Model Selected</h3>
                  <p className="text-gray-600 mb-4">Select a model from the dropdown above to view detailed analysis</p>
                  <Button onClick={() => setCurrentStep('library')} variant="outline">
                    Browse Model Library
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentModel && kpis && (
              <div className="space-y-8">

            {/* Two Cards - KPI Profile + 2x2 Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KPI Profile with Radar */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">KPI Profile</CardTitle>
                  <p className="text-xs text-muted-foreground">Core funnel performance metrics</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Radar Chart */}
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={[
                      { metric: 'Awareness', value: kpis.kpis.awareness },
                      { metric: 'Velocity', value: kpis.kpis.velocity },
                      { metric: 'Efficiency', value: kpis.kpis.efficiency },
                      { metric: 'Retention', value: kpis.kpis.retention },
                      { metric: 'Credibility', value: kpis.kpis.credibility }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="KPIs" dataKey="value" stroke={moduleColor} fill={moduleColor} fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                  
                  {/* Metric Numbers */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => (
                      <div key={kpi} className="text-center">
                        <p className="text-lg font-bold" style={{ color: moduleColor }}>{kpis.kpis[kpi]}</p>
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-xs text-gray-600 capitalize">{kpi.substring(0, 4)}</p>
                          <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 2x2 Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Market Coverage */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Market Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: moduleColor }}>
                        {kpis.marketCoverage}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.marketCoverage}%`,
                            backgroundColor: kpis.marketCoverage >= 70 ? '#22c55e' : kpis.marketCoverage >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.marketCoverage >= 70 ? 'Comprehensive' : kpis.marketCoverage >= 50 ? 'Moderate' : 'Limited'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pipeline Predictability */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pipeline Predictability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: moduleColor }}>
                        {kpis.pipelinePredictability}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.pipelinePredictability}%`,
                            backgroundColor: kpis.pipelinePredictability >= 70 ? '#22c55e' : kpis.pipelinePredictability >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.pipelinePredictability >= 70 ? 'Highly stable' : kpis.pipelinePredictability >= 50 ? 'Moderate' : 'Volatile'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* System Load */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      System Load
                      <QuickGuidance guidanceKey="system_load" iconSize={12} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className={`text-3xl font-bold mb-1 ${kpis.systemLoad > 80 ? 'text-red-500' : ''}`} style={kpis.systemLoad <= 80 ? { color: moduleColor } : {}}>
                        {kpis.systemLoad}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.systemLoad}%`,
                            backgroundColor: kpis.systemLoad > 80 ? '#ef4444' : kpis.systemLoad > 60 ? '#eab308' : '#22c55e'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.systemLoad > 80 ? 'High risk' : kpis.systemLoad > 60 ? 'Moderate' : 'Sustainable'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Balance */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      Balance
                      <QuickGuidance guidanceKey="balance_score" iconSize={12} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: moduleColor }}>
                        {kpis.balance}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.balance}%`,
                            backgroundColor: kpis.balance >= 70 ? '#22c55e' : kpis.balance >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.balance >= 70 ? 'Well balanced' : kpis.balance >= 50 ? 'Moderate' : 'Unbalanced'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Analysis */}
            {currentModel.analysis && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: moduleColor }} />
                    Strategic Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{currentModel.analysis}</p>
                </CardContent>
              </Card>
            )}

            {/* AI Recommendations with Eval Buttons */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">AI Strategic Recommendations</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Powered by Stackwise Sage
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">Context-aware insights with confidence scoring for Eval Matrix</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generate recommendations based on model characteristics */}
                {[
                  {
                    id: 'rec-1',
                    category: 'Channel Optimization',
                    recommendation: kpis.kpis.awareness > 70 
                      ? 'Your high awareness focus suggests adding PR and podcast outreach to amplify reach beyond paid channels'
                      : 'Consider increasing LinkedIn and content marketing budget to build awareness foundation',
                    confidence: kpis.kpis.awareness > 70 ? 92 : 78,
                    rationale: 'Based on current channel mix and awareness KPI target',
                    impact: 'High'
                  },
                  {
                    id: 'rec-2',
                    category: 'Funnel Balance',
                    recommendation: kpis.balance < 60
                      ? `Balance score of ${kpis.balance}% indicates over-concentration. Redistribute ${Math.round((100 - kpis.balance) / 2)}% from top stage to conversion/retention`
                      : 'Your funnel balance is healthy. Maintain current stage distribution while optimizing execution',
                    confidence: kpis.balance < 60 ? 88 : 85,
                    rationale: `Balance index: ${kpis.balance}% - ${kpis.balance < 60 ? 'Below' : 'Above'} threshold`,
                    impact: kpis.balance < 60 ? 'Critical' : 'Medium'
                  },
                  {
                    id: 'rec-3',
                    category: 'Resource Management',
                    recommendation: kpis.systemLoad > 80
                      ? `System load at ${kpis.systemLoad}% risks team burnout. Consider reducing channel count or extending timeline by 30%`
                      : `System load at ${kpis.systemLoad}% is sustainable. You have capacity for 1-2 additional experimental channels`,
                    confidence: kpis.systemLoad > 80 ? 94 : 81,
                    rationale: `Team capacity analysis based on ${kpis.systemLoad}% load factor`,
                    impact: kpis.systemLoad > 80 ? 'Critical' : 'Low'
                  },
                  {
                    id: 'rec-4',
                    category: 'Quick Win Tactics',
                    recommendation: kpis.kpis.efficiency > 75
                      ? 'Your efficiency focus enables A/B testing at scale. Run 3-5 landing page variants to optimize conversion'
                      : 'Focus on proven channels first. Allocate 10% budget to test new tactics once baseline performs',
                    confidence: 73,
                    rationale: 'Efficiency KPI alignment with testing capability',
                    impact: 'Medium'
                  }
                ].map((rec) => (
                  <Card key={rec.id} className="bg-white border border-blue-200">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  rec.impact === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                                  rec.impact === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                  rec.impact === 'Medium' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                  'border-green-500 text-green-700 bg-green-50'
                                }`}
                              >
                                {rec.impact} Impact
                              </Badge>
                              <span className="text-xs font-semibold text-gray-600">{rec.category}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-2">{rec.recommendation}</p>
                            <p className="text-xs text-gray-600 mb-2">
                              <span className="font-semibold">Rationale:</span> {rec.rationale}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-700 font-semibold">
                                  {rec.confidence}% Confidence
                                </span>
                              </div>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  style={{ width: `${rec.confidence}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0 border-blue-500 text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              // TODO: Implement actual push to Strategy Studio Eval Matrix
                              alert(`Recommendation "${rec.category}" pushed to Strategy Studio Eval Matrix!\n\nThis would integrate with your Eval Matrix to track and prioritize this insight.`);
                            }}
                            data-testid={`button-eval-${rec.id}`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Eval
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-blue-600">
                    💡 Tip: Click "Eval" on any recommendation to add it to your Strategy Studio Eval Matrix for prioritization
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-700"
                    onClick={() => {
                      alert('All 4 recommendations pushed to Strategy Studio Eval Matrix!\n\nYou can now prioritize and track these insights in your quarterly strategy workflow.');
                    }}
                    data-testid="button-eval-all"
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    Push All to Eval
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NEW: Budget vs Focus Alignment Analysis */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">Budget vs Focus Alignment</CardTitle>
                </div>
                <p className="text-sm text-purple-700">Detecting mismatches between budget allocation and strategic focus</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const budgetMix = currentModel.config.budgetMix || DEFAULT_BUDGET_MIX;
                  const misalignments = [];
                  
                  // Calculate total paid social budget (LinkedIn, Meta, YouTube, X, TikTok, Reddit)
                  const paidSocialBudget = budgetMix
                    .filter(b => ['linkedin_ads', 'meta_ads', 'youtube_ads', 'x_ads', 'tiktok_ads', 'reddit_ads'].includes(b.key))
                    .reduce((sum, b) => sum + b.allocation, 0);
                  
                  // Get paid_social channel focus
                  const paidSocialChannel = currentModel.config.channels.find(c => c.key === 'paid_social');
                  const paidSocialFocus = paidSocialChannel ? paidSocialChannel.budgetPct : 0;
                  
                  // Check for mismatch (>15% difference)
                  const socialMismatch = Math.abs(paidSocialBudget - paidSocialFocus);
                  if (socialMismatch > 0.15) {
                    misalignments.push({
                      area: 'Paid Social',
                      budgetAllocation: Math.round(paidSocialBudget * 100),
                      focusAllocation: Math.round(paidSocialFocus * 100),
                      gap: Math.round(socialMismatch * 100),
                      severity: socialMismatch > 0.25 ? 'High' : 'Medium',
                      recommendation: paidSocialBudget > paidSocialFocus
                        ? `You've allocated ${Math.round(paidSocialBudget * 100)}% of budget to paid social but only ${Math.round(paidSocialFocus * 100)}% strategic focus. Either increase social focus or reallocate budget.`
                        : `Strategic focus (${Math.round(paidSocialFocus * 100)}%) exceeds budget allocation (${Math.round(paidSocialBudget * 100)}%). Consider increasing paid social budget or reducing focus expectations.`
                    });
                  }
                  
                  // Calculate total events budget
                  const eventsBudget = budgetMix
                    .filter(b => ['webinar_sponsorship', 'podcast_sponsorship', 'event_sponsorship', 'events_tradeshows'].includes(b.key))
                    .reduce((sum, b) => sum + b.allocation, 0);
                  
                  const eventsChannel = currentModel.config.channels.find(c => c.key === 'events');
                  const eventsFocus = eventsChannel ? eventsChannel.budgetPct : 0;
                  
                  const eventsMismatch = Math.abs(eventsBudget - eventsFocus);
                  if (eventsMismatch > 0.15) {
                    misalignments.push({
                      area: 'Events & Sponsorships',
                      budgetAllocation: Math.round(eventsBudget * 100),
                      focusAllocation: Math.round(eventsFocus * 100),
                      gap: Math.round(eventsMismatch * 100),
                      severity: eventsMismatch > 0.25 ? 'High' : 'Medium',
                      recommendation: eventsBudget > eventsFocus
                        ? `Events budget (${Math.round(eventsBudget * 100)}%) significantly exceeds strategic focus (${Math.round(eventsFocus * 100)}%). Increase events focus allocation or redistribute budget.`
                        : `Events focus (${Math.round(eventsFocus * 100)}%) exceeds budget (${Math.round(eventsBudget * 100)}%). You may need more sponsorship/event budget to execute this strategy.`
                    });
                  }
                  
                  // Check if top-heavy budget doesn't match awareness focus
                  const topFunnelBudget = paidSocialBudget + eventsBudget;
                  const awarenessStage = currentModel.config.stages.awareness || 0;
                  
                  if (topFunnelBudget > 0.6 && awarenessStage < 0.3) {
                    misalignments.push({
                      area: 'Funnel Stage Mismatch',
                      budgetAllocation: Math.round(topFunnelBudget * 100),
                      focusAllocation: Math.round(awarenessStage * 100),
                      gap: Math.round((topFunnelBudget - awarenessStage) * 100),
                      severity: 'High',
                      recommendation: `${Math.round(topFunnelBudget * 100)}% of your budget goes to top-funnel channels, but only ${Math.round(awarenessStage * 100)}% of strategic focus is on awareness. This creates execution confusion.`
                    });
                  }
                  
                  return misalignments.length > 0 ? (
                    <div className="space-y-3">
                      {misalignments.map((item, idx) => (
                        <Card key={idx} className="bg-white border-2 border-purple-300">
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline"
                                    className={`${
                                      item.severity === 'High' ? 'border-red-500 text-red-700 bg-red-50' : 
                                      'border-yellow-500 text-yellow-700 bg-yellow-50'
                                    }`}
                                  >
                                    {item.severity} Priority
                                  </Badge>
                                  <span className="font-semibold text-sm">{item.area}</span>
                                </div>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  {item.gap}% Gap
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-yellow-700 font-medium">Paid Budget</p>
                                  <p className="text-lg font-bold text-yellow-900">{item.budgetAllocation}%</p>
                                </div>
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-blue-700 font-medium">Strategic Focus</p>
                                  <p className="text-lg font-bold text-blue-900">{item.focusAllocation}%</p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">⚠️ Misalignment:</span> {item.recommendation}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="pt-2 text-xs text-purple-700 bg-purple-100 p-3 rounded-lg border border-purple-300">
                        <strong>Analysis Insight:</strong> Budget-focus misalignment often leads to confusion in execution. Your team may struggle to prioritize when budget dollars don't match strategic emphasis. Align these within ±15% for optimal clarity.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-green-300">
                      <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-green-900">Strong Budget-Focus Alignment</p>
                      <p className="text-xs text-green-700 mt-1">Your paid budget allocation matches your strategic focus areas (within ±15%). This creates clarity for execution.</p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* NEW: Comprehensive Tradeoff Insights */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Strategic Tradeoffs</CardTitle>
                </div>
                <p className="text-sm text-orange-700">Understanding what you're optimizing for—and what you're sacrificing</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const tradeoffs = [];
                  
                  // High awareness vs low retention tradeoff
                  if (kpis.kpis.awareness > 75 && kpis.kpis.retention < 40) {
                    tradeoffs.push({
                      type: 'Top-Heavy Model',
                      winning: `High Awareness (${kpis.kpis.awareness})`,
                      losing: `Low Retention (${kpis.kpis.retention})`,
                      insight: 'You\'re optimized for maximum reach and new logo acquisition. This is ideal for land-grab scenarios or brand launches, but customer LTV will suffer. Expect higher churn rates.',
                      action: 'If retention becomes critical, shift 15-20% budget from awareness channels to customer success, community, and retention programs.'
                    });
                  }
                  
                  // High efficiency vs low velocity tradeoff
                  if (kpis.kpis.efficiency > 75 && kpis.kpis.velocity < 50) {
                    tradeoffs.push({
                      type: 'Efficiency-First Model',
                      winning: `Strong Efficiency (${kpis.kpis.efficiency})`,
                      losing: `Slower Velocity (${kpis.kpis.velocity})`,
                      insight: 'You\'re optimized for ROI and cost-per-acquisition. Perfect for capital-efficient growth, but pipeline generation will be slower. This extends your sales cycle.',
                      action: 'To accelerate pipeline velocity, consider adding demand gen campaigns even if CPA is higher. Sometimes speed > efficiency.'
                    });
                  }
                  
                  // High velocity vs low efficiency
                  if (kpis.kpis.velocity > 75 && kpis.kpis.efficiency < 50) {
                    tradeoffs.push({
                      type: 'Speed-First Model',
                      winning: `Fast Velocity (${kpis.kpis.velocity})`,
                      losing: `Lower Efficiency (${kpis.kpis.efficiency})`,
                      insight: 'You\'re optimized for pipeline volume and speed-to-close. Great for hitting aggressive growth targets, but cost-per-acquisition will be higher. Burn rate increases.',
                      action: 'If burn becomes a concern, shift budget from high-volume/low-conversion channels to proven efficient channels like referrals and partnerships.'
                    });
                  }
                  
                  // High credibility vs low awareness
                  if (kpis.kpis.credibility > 80 && kpis.kpis.awareness < 50) {
                    tradeoffs.push({
                      type: 'Authority-First Model',
                      winning: `High Credibility (${kpis.kpis.credibility})`,
                      losing: `Limited Awareness (${kpis.kpis.awareness})`,
                      insight: 'You\'re building deep authority with a narrow audience. Ideal for high-ACV enterprise sales where trust matters more than reach. But total addressable market penetration will be slow.',
                      action: 'Once authority is established (6-12 months), layer in broader awareness tactics like PR and social to amplify your credibility to new audiences.'
                    });
                  }
                  
                  // System overload tradeoff
                  if (kpis.systemLoad > 85) {
                    tradeoffs.push({
                      type: 'Capacity Risk',
                      winning: 'Multi-Channel Coverage',
                      losing: `Team Bandwidth (${kpis.systemLoad}% load)`,
                      insight: `Your model activates many channels simultaneously, which provides diversification but risks team burnout at ${kpis.systemLoad}% capacity. Quality of execution may suffer across all channels.`,
                      action: 'Consider a phased rollout: Launch 3-4 core channels first, prove them out, then add 1-2 new channels per quarter. Quality > Quantity.'
                    });
                  }
                  
                  // Balanced model
                  if (tradeoffs.length === 0 && kpis.balance > 70) {
                    tradeoffs.push({
                      type: 'Balanced Approach',
                      winning: 'Diversified Strategy',
                      losing: 'Maximum Specialization',
                      insight: `Your model is well-balanced across awareness, efficiency, and velocity. This reduces risk and provides optionality, but you won\'t dominate any single dimension. ${kpis.balance}% balance score indicates good equilibrium.`,
                      action: 'Monitor which channels over-perform in first 60 days, then shift 10-15% budget toward winners while maintaining overall balance.'
                    });
                  }
                  
                  return (
                    <div className="space-y-3">
                      {tradeoffs.map((item, idx) => (
                        <Card key={idx} className="bg-white border-2 border-orange-300">
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-orange-500 text-orange-700 bg-orange-100">
                                  {item.type}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                                  <p className="text-xs text-green-700 font-medium mb-1">✓ What You're Winning</p>
                                  <p className="text-sm font-bold text-green-900">{item.winning}</p>
                                </div>
                                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                                  <p className="text-xs text-red-700 font-medium mb-1">✗ What You're Sacrificing</p>
                                  <p className="text-sm font-bold text-red-900">{item.losing}</p>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700 font-semibold mb-1">💡 Strategic Insight</p>
                                <p className="text-sm text-blue-900">{item.insight}</p>
                              </div>
                              
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-xs text-purple-700 font-semibold mb-1">→ Adjustment Option</p>
                                <p className="text-sm text-purple-900">{item.action}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Risk Assessment & Implementation Roadmap - Horizontal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Assessment */}
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-900">
                    <Shield className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Potential challenges to monitor</p>
                </CardHeader>
                <CardContent>
                  {kpis.warnings.length > 0 ? (
                    <ul className="space-y-2">
                      {kpis.warnings.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-yellow-800">
                          <AlertTriangle className="w-4 h-4 mt-0.5" />
                          <span className="text-sm">{w}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No significant risks detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Implementation Roadmap */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Implementation Roadmap</CardTitle>
                  <p className="text-sm text-muted-foreground">Recommended steps to execute this model</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { phase: '30 Days', action: 'Set up channel infrastructure and initial campaigns', icon: Target },
                      { phase: '60 Days', action: 'Optimize based on early data, adjust mix', icon: TrendingUp },
                      { phase: '90 Days', action: 'Full-scale execution with proven tactics', icon: Rocket }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <item.icon className="w-5 h-5 mt-0.5" style={{ color: moduleColor }} />
                        <div>
                          <p className="font-semibold text-sm">{item.phase}</p>
                          <p className="text-sm text-gray-700">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setCurrentStep('builder')} data-testid="button-edit-model">
                Edit Model
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep('compare')} data-testid="button-compare-others">
                Compare with Others
              </Button>
              <Button variant="outline" data-testid="button-push-to-eval">
                <CheckCircle className="w-3 h-3 mr-1" /> Push to Eval Matrix
              </Button>
            </div>
            </div>
            )}
          </div>
        </div>
      );
    }

    return <div className="p-8">Unknown step</div>;
  };

  const exportComparison = () => {
    const data = {
      models: compareModels.filter(m => m !== null),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gtm-comparison.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-4 sm:px-6 lg:px-8 pt-4">
            <QuickActions module="PulseHub" />
          </div>
          {renderContent()}
        </div>
      }
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="GTM Test Pit"
    />
  );
}
