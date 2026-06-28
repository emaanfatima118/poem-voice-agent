/**
 * Market Metrics Calculator
 * Converted from Django backend market_metrics_calculator.py
 */

import { calculateHerfindahlIndex } from './utils';

export interface MarketMetricsInput {
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  funnelStageFocus: Record<string, number>;
  personaFocus: Record<string, number>;
  paidBudget: Record<string, number>;
}

export interface MarketMetrics {
  marketCoverage: number;
  pipelinePredictability: number;
}

export function calculateMarketCoverage(input: MarketMetricsInput): number {
  const {
    channelFocus: CM,
    contentFocus: CT,
    funnelStageFocus: FS,
    personaFocus: Persona,
    paidBudget: Paid,
  } = input;

  // Component 1: Channel breadth (0-25 points)
  const activeChannels = Object.values(CM).filter(v => v > 5).length;
  const totalChannels = Object.keys(CM).length;
  const channelBreadth = (activeChannels / totalChannels) * 25;

  // Component 2: Content variety (0-20 points)
  const activeContent = Object.values(CT).filter(v => v > 5).length;
  const totalContentTypes = Object.keys(CT).length;
  const contentVariety = (activeContent / totalContentTypes) * 20;

  // Component 3: Funnel coverage (0-25 points)
  const funnelValues = Object.values(FS);
  let funnelCoverage = 0;
  if (funnelValues.length > 0) {
    const mean = funnelValues.reduce((sum, v) => sum + v, 0) / funnelValues.length;
    const variance = funnelValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / funnelValues.length;
    const funnelStd = Math.sqrt(variance);
    const funnelBalance = Math.max(0, 25 - (funnelStd * 0.5));

    const stagesCovered = funnelValues.filter(v => v > 5).length;
    const stageCoverageBonus = (stagesCovered / funnelValues.length) * 10;

    funnelCoverage = Math.min(funnelBalance + stageCoverageBonus, 25);
  }

  // Component 4: Persona reach (0-15 points)
  let personaReach = 0;
  if (Persona && Object.keys(Persona).length > 0) {
    const activePersonas = Object.values(Persona).filter(v => v > 10).length;
    const totalPersonas = Object.keys(Persona).length;
    personaReach = (activePersonas / totalPersonas) * 15;
  }

  // Component 5: Paid channel diversification (0-15 points)
  let paidReach = 0;
  if (Paid && Object.keys(Paid).length > 0) {
    const activePaid = Object.values(Paid).filter(v => v > 5).length;
    const totalPaid = Object.keys(Paid).length;
    paidReach = (activePaid / totalPaid) * 15;
  }

  // Total market coverage
  const marketCoverage = (
    channelBreadth +
    contentVariety +
    funnelCoverage +
    personaReach +
    paidReach
  );

  return Math.round(marketCoverage * 100) / 100;
}

export function calculatePipelinePredictability(
  kpis: Record<string, number>,
  balanceIndex: number,
  systemLoad: number
): number {
  // Component 1: Strategic balance (0-30 points)
  const balanceContribution = (balanceIndex / 100) * 30;

  // Component 2: Efficiency score (0-25 points)
  const efficiency = kpis.efficiency || 0;
  const efficiencyContribution = (efficiency / 100) * 25;

  // Component 3: Retention focus (0-20 points)
  const retention = kpis.retention || 0;
  const retentionContribution = (retention / 100) * 20;

  // Component 4: System load penalty (0-15 points)
  const systemLoadFactor = Math.max(0, (100 - systemLoad) / 100);
  const loadContribution = systemLoadFactor * 15;

  // Component 5: Velocity stability (0-10 points)
  const velocity = kpis.velocity || 0;
  let velocityContribution = 4;
  if (velocity >= 40 && velocity <= 70) {
    velocityContribution = 10;
  } else if ((velocity >= 30 && velocity < 40) || (velocity > 70 && velocity <= 80)) {
    velocityContribution = 7;
  }

  // Total pipeline predictability
  const predictability = (
    balanceContribution +
    efficiencyContribution +
    retentionContribution +
    loadContribution +
    velocityContribution
  );

  return Math.round(predictability * 100) / 100;
}

export function getMarketCoverageLabel(score: number): string {
  if (score >= 80) return "Comprehensive";
  if (score >= 65) return "Broad";
  if (score >= 45) return "Moderate";
  if (score >= 25) return "Focused";
  return "Narrow";
}

export function getPipelinePredictabilityLabel(score: number): string {
  if (score >= 80) return "Highly stable";
  if (score >= 65) return "Stable";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Inconsistent";
  return "Volatile";
}

