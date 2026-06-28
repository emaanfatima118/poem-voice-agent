/**
 * GTM Calculations API Route
 * Fast calculation-only endpoint for real-time KPI updates
 * Does NOT include GPT analysis (use /api/gtm-analytics for that)
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateKPIs } from '@/lib/gtm/kpi-calculator';
import { calculateBalanceIndex } from '@/lib/gtm/balance-index-calculator';
import { calculateMarketCoverage, calculatePipelinePredictability } from '@/lib/gtm/market-metrics-calculator';
import { calculateSystemLoad } from '@/lib/gtm/system-load-calculator';
import { generateRecommendations } from '@/lib/gtm/recommendations';

export interface GTMInput {
  channel_focus: Record<string, number>;
  content_focus: Record<string, number>;
  funnel_stage_focus: Record<string, number>;
  goals: Record<string, number>;
  persona_focus: Record<string, number>;
  executive_visibility: Record<string, number>;
  strategic_pillars: Record<string, number>;
  paid_budget: Record<string, number>;
  total_paid_budget: number;
  budget_multiplier: number;
}

export interface GTMCalculationsResponse {
  kpis: {
    awareness: number;
    velocity: number;
    efficiency: number;
    retention: number;
    credibility: number;
  };
  system_load: number;
  balance_index: number;
  market_coverage: number;
  pipeline_predictability: number;
  budget_analysis: {
    effective_paid_budget: number;
    budget_multiplier_effective: number;
    calculated_roi_factor: number;
  };
  recommendations?: Array<{
    priority: string;
    category: string;
    issue: string;
    recommendation: string;
    expected_impact: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();

    // Validate required fields
    if (!body.channel_focus || !body.content_focus || !body.funnel_stage_focus) {
      return NextResponse.json(
        { error: 'Invalid input data', details: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract inputs
    const CM = body.channel_focus || {};
    const CT = body.content_focus || {};
    const FS = body.funnel_stage_focus || {};
    const Goals = body.goals || {};
    const Persona = body.persona_focus || {};
    const Exec = body.executive_visibility || {};
    const Pillars = body.strategic_pillars || {};
    const Paid = body.paid_budget || {};
    const TotalBudget = body.total_paid_budget || 0;
    const Multiplier = body.budget_multiplier || 100;

    // Calculate all metrics in backend (fast calculations only, no GPT)
    const kpis = calculateKPIs({
      channelFocus: CM,
      contentFocus: CT,
      funnelStageFocus: FS,
      goals: Goals,
      personaFocus: Persona,
      executiveVisibility: Exec,
      strategicPillars: Pillars,
      paidBudget: Paid,
      totalPaidBudget: TotalBudget,
      budgetMultiplier: Multiplier,
    });

    // Calculate system load
    const systemLoad = calculateSystemLoad({
      channelFocus: CM,
      contentFocus: CT,
      personaFocus: Persona,
      executiveVisibility: Exec,
      strategicPillars: Pillars,
      paidBudget: Paid,
    });

    // Calculate balance index
    const balanceIndex = calculateBalanceIndex({
      channelFocus: CM,
      contentFocus: CT,
      funnelStageFocus: FS,
      personaFocus: Persona,
      goals: Goals,
      paidBudget: Paid,
    });

    // Calculate market metrics
    const marketCoverage = calculateMarketCoverage({
      channelFocus: CM,
      contentFocus: CT,
      funnelStageFocus: FS,
      personaFocus: Persona,
      paidBudget: Paid,
    });

    const pipelinePredictability = calculatePipelinePredictability(
      kpis,
      balanceIndex,
      systemLoad
    );

    // Calculate budget analysis
    const effectiveBudget = TotalBudget ? TotalBudget * (Multiplier / 100) : 0;
    let roiFactor = 1.0;
    if (effectiveBudget > 0) {
      roiFactor = Math.min(Math.log10(Math.max(effectiveBudget / 100000, 0.01)) * 0.3 + 1, 2.0);
    }

    const budgetAnalysis = {
      effective_paid_budget: Math.round(effectiveBudget),
      budget_multiplier_effective: Math.round(Multiplier),
      calculated_roi_factor: Math.round(roiFactor * 100) / 100, // Keep 2 decimals for ROI factor
    };

    // Generate recommendations (fast, uses calculated metrics only)
    const recommendations = generateRecommendations({
      kpis,
      systemLoad,
      balanceIndex,
      channelFocus: CM,
      contentFocus: CT,
      funnelStageFocus: FS,
      executiveVisibility: Exec,
      paidBudget: Paid,
    });

    // Convert all decimal values to integers
    const roundedKPIs = {
      awareness: Math.round(kpis.awareness),
      velocity: Math.round(kpis.velocity),
      efficiency: Math.round(kpis.efficiency),
      retention: Math.round(kpis.retention),
      credibility: Math.round(kpis.credibility),
    };
    const roundedSystemLoad = Math.round(systemLoad);
    const roundedBalanceIndex = Math.round(balanceIndex);
    const roundedMarketCoverage = Math.round(marketCoverage);
    const roundedPipelinePredictability = Math.round(pipelinePredictability);

    // Build response (NO GPT analysis - this is fast calculation only)
    const response: GTMCalculationsResponse = {
      kpis: roundedKPIs,
      system_load: roundedSystemLoad,
      balance_index: roundedBalanceIndex,
      market_coverage: roundedMarketCoverage,
      pipeline_predictability: roundedPipelinePredictability,
      budget_analysis: budgetAnalysis,
      recommendations,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('[GTM Calculations API] Error:', error);
    return NextResponse.json(
      { error: 'Calculation error', details: error.message },
      { status: 500 }
    );
  }
}

