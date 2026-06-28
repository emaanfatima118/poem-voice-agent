import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Slider } from "@/stackwise-demo/components/ui/slider";
import { Switch } from "@/stackwise-demo/components/ui/switch";
import { Label } from "@/stackwise-demo/components/ui/label";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { getModuleById } from "@/stackwise-demo/config/modules";
import { 
  Rocket, Target, TrendingUp, TrendingDown, Zap, Shield, AlertTriangle, 
  Info, ArrowLeftRight, FileDown, Play, Save, Copy, Trash2, Search,
  Gauge, Activity, Users2, Layers, BookOpen, CheckCircle, XCircle
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

// ===== TYPES =====
type KPIKey = 'awareness' | 'velocity' | 'efficiency' | 'retention' | 'credibility';
type StageKey = 'awareness' | 'consideration' | 'conversion' | 'retention';
type ChannelKey = 'linkedin' | 'email' | 'paid_search' | 'paid_social' | 'web' | 'events' | 'pr' | 'seo';

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

interface GTMModelConfig {
  personas: Persona[];
  stages: Record<StageKey, number>;
  channels: Channel[];
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
  warnings: string[];
  analysis?: string;
  createdAt?: string;
}

// ===== UTILITIES =====
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const elastic = (x: number, k = 1.15) => 1 - Math.exp(-k * clamp(x));
const pct = (x: number) => `${Math.round(x * 100)}%`;

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
    warnings: [],
    analysis: "Mid-Market Focus balances reach and efficiency for companies targeting 50-500 employee segment. Moderate intensity across channels with strong conversion focus. Best for SaaS companies with proven PMF expanding into mid-market."
  }
];

// ===== KPI CALCULATION =====
function computeKPIs(config: GTMModelConfig): { kpis: Record<KPIKey, number>; systemLoad: number; balance: number; warnings: string[] } {
  const { personas, stages, channels } = config;
  
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
  
  // Warnings
  const warnings: string[] = [];
  if (kpis.velocity < 50 && stages.conversion < 0.25) warnings.push('Velocity weak; conversion underweighted');
  if (kpis.awareness > 75 && kpis.velocity < 55) warnings.push('Top-heavy awareness; pipeline may lag');
  if (systemLoad > 80) warnings.push('High system load - team strain likely');
  if (balance < 60) warnings.push('Imbalanced allocation across mix');
  if (kpis.retention < 50) warnings.push('Low retention - add nurture programs');
  
  return { kpis, systemLoad, balance, warnings };
}

export default function GTMTestPit() {
  const [currentStep, setCurrentStep] = useState('start');
  const [startMode, setStartMode] = useState<'questionnaire' | 'browse' | 'scratch' | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<GTMModel | null>(null);
  const [currentModel, setCurrentModel] = useState<GTMModel | null>(null);
  const [compareModels, setCompareModels] = useState<(GTMModel | null)[]>([null, null, null]);
  const [savedModels, setSavedModels] = useState<GTMModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const module = getModuleById('pulse-hub');
  const moduleColor = '#6218df';

  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>
        Pulse Hub
      </h2>
    </div>
  );

  const steps = [
    { id: 'start', label: 'Start', description: 'Choose your path' },
    { id: 'builder', label: 'Model Builder', description: 'Configure GTM model' },
    { id: 'compare', label: 'Compare', description: 'Deep 3-way comparison' },
    { id: 'analysis', label: 'Analysis', description: 'Selected model insights' },
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
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3" style={{ color: moduleColor }}>GTM Test Pit</h1>
              <p className="text-lg text-muted-foreground">
                Pull levers, test strategies, compare models. Your GTM laboratory.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card 
                className="cursor-pointer border-2 hover:shadow-lg transition-all"
                onClick={() => { setStartMode('questionnaire'); setCurrentStep('builder'); }}
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
                  <Badge className="text-xs" style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}>
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
                <h2 className="text-2xl font-bold mb-2" style={{ color: moduleColor }}>
                  {startMode === 'browse' ? 'Browse Archetype Models' : 'My Models Library'}
                </h2>
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
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => (
                          <div key={kpi}>
                            <p className="text-2xl font-bold" style={{ color: moduleColor }}>{model.kpis[kpi]}</p>
                            <p className="text-xs text-gray-600 capitalize">{kpi}</p>
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
                        {!isArchetype && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const cloned = JSON.parse(JSON.stringify(model));
                                cloned.name = `${model.name} (Copy)`;
                                setSavedModels([...savedModels, cloned]);
                              }}
                              data-testid={`button-clone-${idx}`}
                            >
                              <Copy className="w-3 h-3 mr-1" /> Clone
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSavedModels(savedModels.filter((_, i) => i !== (idx - ARCHETYPE_MODELS.length)));
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

    // BUILDER - Cockpit with sliders
    if (currentStep === 'builder') {
      if (!currentModel) return <div className="p-8">Please select a model from the library first.</div>;

      const kpis = currentKPIs || computeKPIs(currentModel.config);

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: moduleColor }}>Model Builder: {currentModel.name}</h2>
                <p className="text-muted-foreground">Pull levers, adjust mix, watch KPIs respond in real-time</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-save-model">
                  <Save className="w-3 h-3 mr-1" /> Save Model
                </Button>
                <Button size="sm" onClick={() => setCurrentStep('compare')} data-testid="button-go-compare">
                  <ArrowLeftRight className="w-3 h-3 mr-1" /> Compare Models
                </Button>
              </div>
            </div>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-5 gap-4">
              {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility'] as KPIKey[]).map(kpi => (
                <Card key={kpi} className="border border-gray-200">
                  <CardContent className="pt-6 text-center">
                    <p className="text-4xl font-bold mb-1" style={{ color: moduleColor }}>{kpis.kpis[kpi]}</p>
                    <p className="text-sm text-gray-600 capitalize">{kpi}</p>
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
                  </div>
                  <p className="text-3xl font-bold" style={{ color: kpis.systemLoad > 80 ? '#ef4444' : moduleColor }}>
                    {kpis.systemLoad}%
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <p className="text-sm text-gray-600">Balance Index</p>
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

            {/* Channel Sliders */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Channel Mix & Intensity</CardTitle>
                <p className="text-sm text-muted-foreground">Adjust budget allocation and intensity per channel</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentModel.config.channels.map((ch, idx) => (
                    <div key={ch.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium capitalize">{ch.label}</Label>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>Budget: {pct(ch.budgetPct)}</span>
                          <span>Intensity: {pct(ch.intensity)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Slider
                          value={[ch.budgetPct * 100]}
                          onValueChange={([v]) => {
                            const updated = [...currentModel.config.channels];
                            updated[idx].budgetPct = v / 100;
                            setCurrentModel({ ...currentModel, config: { ...currentModel.config, channels: updated } });
                          }}
                          max={100}
                          step={1}
                          data-testid={`slider-budget-${ch.key}`}
                        />
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
              </CardContent>
            </Card>

            {/* Stage Mix */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Stage Mix</CardTitle>
                <p className="text-sm text-muted-foreground">Allocate focus across funnel stages</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['awareness', 'consideration', 'conversion', 'retention'] as StageKey[]).map(stage => (
                    <div key={stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium capitalize">{stage}</Label>
                        <span className="text-xs text-gray-600">{pct(currentModel.config.stages[stage])}</span>
                      </div>
                      <Slider
                        value={[currentModel.config.stages[stage] * 100]}
                        onValueChange={([v]) => {
                          setCurrentModel({
                            ...currentModel,
                            config: {
                              ...currentModel.config,
                              stages: { ...currentModel.config.stages, [stage]: v / 100 }
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
              </CardContent>
            </Card>

            {/* Persona Mix */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Persona Mix</CardTitle>
                <p className="text-sm text-muted-foreground">Weight target personas</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentModel.config.personas.map((persona, idx) => (
                    <div key={persona.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{persona.name}</Label>
                        <span className="text-xs text-gray-600">{pct(persona.weight)}</span>
                      </div>
                      <Slider
                        value={[persona.weight * 100]}
                        onValueChange={([v]) => {
                          const updated = [...currentModel.config.personas];
                          updated[idx].weight = v / 100;
                          setCurrentModel({ ...currentModel, config: { ...currentModel.config, personas: updated } });
                        }}
                        max={100}
                        step={1}
                        data-testid={`slider-persona-${persona.id}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                              <td className="p-2 capitalize font-medium">{kpi}</td>
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
                            <td className="p-2 font-medium">System Load</td>
                            {compareModels.map((model, idx) => model && (
                              <td key={idx} className="text-center p-2">
                                <span className={`text-lg font-bold ${model.systemLoad > 80 ? 'text-red-500' : ''}`}>
                                  {model.systemLoad}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">Balance</td>
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
      if (!currentModel) return <div className="p-8">Please select a model first.</div>;

      const kpis = currentKPIs || computeKPIs(currentModel.config);

      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>{currentModel.name}</h2>
              <p className="text-lg text-muted-foreground">{currentModel.description || 'Deep analysis of this GTM model'}</p>
            </div>

            {/* KPI Radar Chart */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">KPI Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { metric: 'Awareness', value: kpis.kpis.awareness },
                    { metric: 'Velocity', value: kpis.kpis.velocity },
                    { metric: 'Efficiency', value: kpis.kpis.efficiency },
                    { metric: 'Retention', value: kpis.kpis.retention },
                    { metric: 'Credibility', value: kpis.kpis.credibility }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="KPIs" dataKey="value" stroke={moduleColor} fill={moduleColor} fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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

            {/* Warnings & Risks */}
            {kpis.warnings.length > 0 && (
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-900">
                    <Shield className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {kpis.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-yellow-800">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

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
                        <p className="font-semibold">{item.phase}</p>
                        <p className="text-sm text-gray-700">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
      leftNav={leftNav}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderContent()}
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="GTM Test Pit"
    />
  );
}
