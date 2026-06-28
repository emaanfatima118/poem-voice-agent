/**
 * System Load Calculator
 * Converted from Django backend system_load_calculator.py
 */

import { calculateHerfindahlIndex } from './utils';

export interface SystemLoadInput {
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  personaFocus: Record<string, number>;
  executiveVisibility: Record<string, number>;
  strategicPillars: Record<string, number>;
  paidBudget: Record<string, number>;
}

export function calculateSystemLoad(input: SystemLoadInput): number {
  const {
    channelFocus: CM,
    contentFocus: CT,
    personaFocus: Persona,
    executiveVisibility: Exec,
    strategicPillars: Pillars,
    paidBudget: Paid,
  } = input;

  // Count meaningfully active channels/content (>5% = active)
  const activeChannels = Object.values(CM).filter(v => v > 5).length;
  const activeContentTypes = Object.values(CT).filter(v => v > 5).length;

  // Paid channels requiring dedicated management (>8%)
  const activePaidChannels = Paid ? Object.values(Paid).filter(v => v > 8).length : 0;

  // Base complexity - recalibrated for 0-35 range for normal strategies
  const executionComplexity = (
    activeChannels * 3.5 +
    activeContentTypes * 3 +
    activePaidChannels * 2.5
  );

  // Concentration score (0-100, higher = more focused)
  const channelConcentration = calculateHerfindahlIndex(CM);
  const contentConcentration = calculateHerfindahlIndex(CT);

  // Dispersion penalty (0-20 range)
  const channelDispersionPenalty = Math.max(0, (50 - channelConcentration) * 0.25);
  const contentDispersionPenalty = Math.max(0, (50 - contentConcentration) * 0.25);

  const dispersionImpact = channelDispersionPenalty + contentDispersionPenalty;

  // Persona complexity (0-15 range)
  const activePersonas = Persona ? Object.values(Persona).filter(v => v > 15).length : 0;
  const personaComplexity = Math.min(activePersonas * 3.5, 15);

  // Executive coordination (0-10 range)
  const activeExecs = Exec ? Object.values(Exec).filter(v => v > 15).length : 0;
  const execCoordination = Math.min(activeExecs * 2.5, 10);

  // Strategic messaging variance (0-10 range)
  let messagingComplexity = 0;
  if (Pillars && Object.keys(Pillars).length > 1) {
    const pillarValues = Object.values(Pillars);
    const mean = pillarValues.reduce((sum, v) => sum + v, 0) / pillarValues.length;
    const variance = pillarValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / pillarValues.length;
    const pillarStd = Math.sqrt(variance);
    messagingComplexity = Math.min(pillarStd * 0.2, 10);
  }

  // Total system load
  const systemLoad = (
    executionComplexity +  // 0-50 range
    dispersionImpact +  // 0-20 range
    personaComplexity +  // 0-15 range
    execCoordination +  // 0-10 range
    messagingComplexity  // 0-10 range
  );

  return Math.round(Math.min(systemLoad, 100) * 100) / 100;
}

