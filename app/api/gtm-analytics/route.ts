/**
 * GTM Analytics API Route
 * Converted from Django DRF views.py
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateKPIs } from '@/lib/gtm/kpi-calculator';
import { calculateBalanceIndex } from '@/lib/gtm/balance-index-calculator';
import { calculateMarketCoverage, calculatePipelinePredictability } from '@/lib/gtm/market-metrics-calculator';
import { calculateSystemLoad } from '@/lib/gtm/system-load-calculator';
import { generateGTMStrategicAnalysis } from '@/lib/gtm/gtm-gpt';
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

export interface GTMResponse {
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
  strategic_analysis?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();

    // Log request body in development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n========================================');
      console.log('[GTM API] 📥 POST /api/gtm-analytics');
      console.log('========================================');
      console.log('Request Body:');
      console.log(JSON.stringify(body, null, 2));
      console.log('========================================\n');
    }

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

    // Calculate all metrics in backend
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

    // Generate recommendations (always generate, uses calculated metrics)

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

    // Build response
    const response: GTMResponse = {
      kpis: roundedKPIs,
      system_load: roundedSystemLoad,
      balance_index: roundedBalanceIndex,
      market_coverage: roundedMarketCoverage,
      pipeline_predictability: roundedPipelinePredictability,
      budget_analysis: budgetAnalysis,
      recommendations,
    };

    // Generate GPT analysis using calculated metrics
    try {
      const kpiResponse = {
        kpis: roundedKPIs,
        system_load: roundedSystemLoad,
        balance_index: roundedBalanceIndex,
        market_coverage: roundedMarketCoverage,
        pipeline_predictability: roundedPipelinePredictability,
        budget_analysis: budgetAnalysis,
      };

      const aiAnalysis = await generateGTMStrategicAnalysis(
        kpiResponse,
        body as GTMInput
      );

      if (aiAnalysis) {
        response.strategic_analysis = aiAnalysis;
        console.log('[GTM API] ✅ AI analysis generated successfully');
      } else {
        response.strategic_analysis = null;
        (response as any).strategic_analysis_error = 'AI analysis generation failed';
        console.log('[GTM API] ⚠️ AI analysis generation failed');
      }
    } catch (error: any) {
      console.error('[GTM API] ⚠️ GPT analysis error:', error);
      response.strategic_analysis = null;
    }

    // Log response body in development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n========================================');
      console.log('[GTM API] 📤 Response');
      console.log('========================================');
      console.log('Response Body:');
      console.log(JSON.stringify(response, null, 2));
      console.log('========================================\n');
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('[GTM API] Error:', error);
    return NextResponse.json(
      { error: 'Calculation error', details: error.message },
      { status: 500 }
    );
  }
}

