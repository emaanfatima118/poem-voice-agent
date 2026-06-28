/**
 * Local GTM Calculator
 * Unified calculation function that matches Python backend exactly
 * Can be used in frontend for real-time calculations
 */

import { calculateKPIs } from './kpi-calculator';
import { calculateBalanceIndex } from './balance-index-calculator';
import { calculateMarketCoverage, calculatePipelinePredictability } from './market-metrics-calculator';
import { calculateSystemLoad } from './system-load-calculator';

export interface UnifiedConfig {
  // API format (snake_case) - preferred
  channel_focus?: Record<string, number>;
  content_focus?: Record<string, number>;
  funnel_stage_focus?: Record<string, number>;
  goals?: Record<string, number>;
  persona_focus?: Record<string, number>;
  executive_visibility?: Record<string, number>;
  strategic_pillars?: Record<string, number>;
  paid_budget?: Record<string, number>;
  total_paid_budget?: number;
  budget_multiplier?: number;
  
  // Old format (camelCase arrays) - for backward compatibility
  channels?: Array<{ key: string; budgetPct: number; intensity?: number }>;
  contentTypes?: Array<{ id?: string; name?: string; weight: number }>;
  stages?: Record<string, number>;
  personas?: Array<{ id?: string; name?: string; weight: number }>;
  executives?: Array<{ id?: string; name?: string; weight: number }>;
  goals?: Array<{ id?: string; name?: string; weight: number }>;
  strategicPillars?: Array<{ id?: string; name?: string; weight: number }>;
  paidBudget?: Record<string, number>;
  totalBudget?: number;
  budgetMultiplier?: number;
}

export interface CalculationResult {
  kpis: {
    awareness: number;
    velocity: number;
    efficiency: number;
    retention: number;
    credibility: number;
  };
  systemLoad: number;
  balanceIndex: number;
  marketCoverage: number;
  pipelinePredictability: number;
  budgetAnalysis?: {
    effective_paid_budget: number;
    budget_multiplier_effective: number;
    calculated_roi_factor: number;
  };
}

/**
 * Normalize config to unified API format
 */
function normalizeConfig(config: UnifiedConfig): {
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  funnelStageFocus: Record<string, number>;
  goals: Record<string, number>;
  personaFocus: Record<string, number>;
  executiveVisibility: Record<string, number>;
  strategicPillars: Record<string, number>;
  paidBudget: Record<string, number>;
  totalPaidBudget: number;
  budgetMultiplier: number;
} {
  // If already in API format, use directly
  if (config.channel_focus || config.content_focus) {
    return {
      channelFocus: config.channel_focus || {},
      contentFocus: config.content_focus || {},
      funnelStageFocus: config.funnel_stage_focus || {},
      goals: config.goals || {},
      personaFocus: config.persona_focus || {},
      executiveVisibility: config.executive_visibility || {},
      strategicPillars: config.strategic_pillars || {},
      paidBudget: config.paid_budget || {},
      totalPaidBudget: config.total_paid_budget || 0,
      budgetMultiplier: config.budget_multiplier || 100,
    };
  }

  // Convert old format to API format
  const channelFocus: Record<string, number> = {};
  if (config.channels) {
    config.channels.forEach(ch => {
      channelFocus[ch.key] = ch.budgetPct * 100;
    });
  }

  const contentFocus: Record<string, number> = {};
  if (config.contentTypes) {
    config.contentTypes.forEach(ct => {
      const nameMap: Record<string, string> = {
        'blog_posts': 'blog_posts',
        'whitepapers': 'whitepapers',
        'case_studies': 'case_studies',
        'linkedin_posts': 'linkedin_posts',
        'email_newsletters': 'email_newsletters',
        'webinars': 'webinars',
        'video_content': 'video_content',
        'infographics': 'infographics',
        'podcasts': 'podcasts',
        'press_releases': 'press_releases'
      };
      const key = ct.id || nameMap[ct.name?.toLowerCase().replace(/\s+/g, '_') || ''] || ct.name?.toLowerCase().replace(/\s+/g, '_');
      contentFocus[key] = ct.weight * 100;
    });
  }

  const funnelStageFocus: Record<string, number> = {};
  if (config.stages) {
    Object.keys(config.stages).forEach(stage => {
      funnelStageFocus[stage] = config.stages![stage] * 100;
    });
  }

  const personaFocus: Record<string, number> = {};
  if (config.personas) {
    config.personas.forEach(p => {
      const nameMap: Record<string, string> = {
        'exec': 'executive_buyer',
        'executive_buyer': 'executive_buyer',
        'ops': 'operations_lead',
        'operations_lead': 'operations_lead',
        'fin': 'finance_stakeholder',
        'finance_stakeholder': 'finance_stakeholder'
      };
      const key = p.id || nameMap[p.name?.toLowerCase().replace(/\s+/g, '_') || ''] || p.name?.toLowerCase().replace(/\s+/g, '_');
      personaFocus[key] = p.weight * 100;
    });
  }

  const executiveVisibility: Record<string, number> = {};
  if (config.executives) {
    config.executives.forEach(exec => {
      const key = exec.id || exec.name?.toLowerCase().replace(/\s+/g, '_');
      executiveVisibility[key] = exec.weight * 100;
    });
  }

  const goals: Record<string, number> = {};
  if (Array.isArray(config.goals)) {
    config.goals.forEach(goal => {
      const key = goal.id || goal.name?.toLowerCase().replace(/\s+/g, '_');
      goals[key] = goal.weight * 100;
    });
  } else if (config.goals) {
    Object.assign(goals, config.goals);
  }

  const strategicPillars: Record<string, number> = {};
  if (config.strategicPillars) {
    config.strategicPillars.forEach(pillar => {
      const key = pillar.id || pillar.name?.toLowerCase().replace(/\s+/g, '_');
      strategicPillars[key] = pillar.weight * 100;
    });
  }

  const paidBudget: Record<string, number> = {};
  if (config.paidBudget) {
    Object.keys(config.paidBudget).forEach(key => {
      paidBudget[key] = config.paidBudget![key] * 100;
    });
  }

  return {
    channelFocus,
    contentFocus,
    funnelStageFocus,
    goals,
    personaFocus,
    executiveVisibility,
    strategicPillars,
    paidBudget,
    totalPaidBudget: config.totalBudget || 0,
    budgetMultiplier: config.budgetMultiplier || 100,
  };
}

/**
 * Calculate all GTM metrics locally using exact Python backend logic
 */
export function calculateGTMMetricsLocally(config: UnifiedConfig): CalculationResult {
  const normalized = normalizeConfig(config);

  // Calculate KPIs
  const kpis = calculateKPIs(normalized);

  // Calculate system load
  const systemLoad = calculateSystemLoad({
    channelFocus: normalized.channelFocus,
    contentFocus: normalized.contentFocus,
    personaFocus: normalized.personaFocus,
    executiveVisibility: normalized.executiveVisibility,
    strategicPillars: normalized.strategicPillars,
    paidBudget: normalized.paidBudget,
  });

  // Calculate balance index
  const balanceIndex = calculateBalanceIndex({
    channelFocus: normalized.channelFocus,
    contentFocus: normalized.contentFocus,
    funnelStageFocus: normalized.funnelStageFocus,
    personaFocus: normalized.personaFocus,
    goals: normalized.goals,
    paidBudget: normalized.paidBudget,
  });

  // Calculate market coverage
  const marketCoverage = calculateMarketCoverage({
    channelFocus: normalized.channelFocus,
    contentFocus: normalized.contentFocus,
    funnelStageFocus: normalized.funnelStageFocus,
    personaFocus: normalized.personaFocus,
    paidBudget: normalized.paidBudget,
  });

  // Calculate pipeline predictability
  const pipelinePredictability = calculatePipelinePredictability(
    kpis,
    balanceIndex,
    systemLoad
  );

  // Calculate budget analysis
  const effectiveBudget = normalized.totalPaidBudget 
    ? normalized.totalPaidBudget * (normalized.budgetMultiplier / 100) 
    : 0;
  
  let roiFactor = 1.0;
  if (effectiveBudget > 0) {
    roiFactor = Math.min(Math.log10(Math.max(effectiveBudget / 100000, 0.01)) * 0.3 + 1, 2.0);
  }

  return {
    kpis,
    systemLoad,
    balanceIndex,
    marketCoverage,
    pipelinePredictability,
    budgetAnalysis: {
      effective_paid_budget: Math.round(effectiveBudget * 100) / 100,
      budget_multiplier_effective: normalized.budgetMultiplier,
      calculated_roi_factor: Math.round(roiFactor * 100) / 100,
    },
  };
}

