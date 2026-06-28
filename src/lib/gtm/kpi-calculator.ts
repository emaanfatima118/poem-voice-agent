/**
 * KPI Calculator
 * Converted from Django backend kpi_calculator.py
 */

import {
  calculateHerfindahlIndex,
  calculateMisalignmentPenalty,
  calculateAlignmentScore,
  calculateBudgetEfficiency,
  calculateChannelContentAlignment,
  calculateFunnelFlowEfficiency,
  calculateResourceUtilization,
  calculateCustomerEngagement,
  calculateAuthorityScore,
  calculateBudgetMultiplier,
} from './utils';
import { calculateSystemLoad } from './system-load-calculator';

export interface KPICalculationInput {
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
}

export interface KPIs {
  awareness: number;
  velocity: number;
  efficiency: number;
  retention: number;
  credibility: number;
}

export function calculateKPIs(input: KPICalculationInput): KPIs {
  const {
    channelFocus: CM,
    contentFocus: CT,
    funnelStageFocus: FS,
    goals: Goals,
    personaFocus: Persona,
    executiveVisibility: Exec,
    strategicPillars: Pillars,
    paidBudget: Paid,
    totalPaidBudget: TotalBudget,
    budgetMultiplier: Multiplier = 100,
  } = input;

  // Calculate effective budget
  const effectiveBudget = TotalBudget ? TotalBudget * (Multiplier / 100) : 0;

  // Improved budget multiplier calculation with more realistic scaling
  const calculatedBudgetMultiplier = calculateBudgetMultiplier(effectiveBudget);

  // Helper: Executive visibility average (0-100)
  const execValues = Object.values(Exec || {});
  const execScore = execValues.length > 0
    ? execValues.reduce((sum, v) => sum + v, 0) / execValues.length
    : 0;

  // -----------------------
  // AWARENESS KPI
  // -----------------------
  const awarenessChannels = ["linkedin", "seo", "pr", "web"];
  const organicChannelScore = awarenessChannels.reduce((sum, ch) => sum + (CM[ch] || 0), 0);

  const awarenessContent = ["blog_posts", "press_releases", "infographics", "video_content"];
  const contentScore = awarenessContent.reduce((sum, ct) => sum + (CT[ct] || 0), 0);

  const funnelAlignment = FS.awareness || 0;

  // Paid channels that amplify awareness
  const awarenessPaidChannels = [
    "linkedin_ads", "meta_ads", "google_ads", "youtube_ads",
    "tiktok_ads", "programmatic_display", "twitter_ads", "reddit_ads"
  ];
  const paidAwarenessPct = awarenessPaidChannels.reduce((sum, p) => sum + (Paid[p] || 0), 0);
  const paidBoost = paidAwarenessPct * calculatedBudgetMultiplier * 0.15;

  // Executive visibility + thought leadership amplify awareness (optimized weights)
  const execBoost = execScore * 0.18; // Reduced from 0.20 (10% reduction, less aggressive)
  const pillarBoost = (Pillars?.thought_leadership || 0) * 0.14; // Reduced from 0.15 (7% reduction)

  // Add channel-content alignment factor (improves accuracy)
  const channelContentAlignment = calculateChannelContentAlignment({
    channelFocus: CM,
    contentFocus: CT,
    awarenessChannels: awarenessChannels,
    awarenessContent: awarenessContent
  });

  // Calculate base score with refined weights
  const baseAwareness = (
    organicChannelScore * 0.30 + // Keep original (channels are core)
    contentScore * 0.25 +         // Keep same
    funnelAlignment * 0.25       // Keep same
  );

  // Paid boost (optimized)
  const paidBoostRefined = paidAwarenessPct * calculatedBudgetMultiplier * 0.14; // Slightly reduced from 0.15

  // Total awareness with paid, amplification, and alignment
  // Channel-content alignment adds up to 6% boost when well-aligned
  let awareness = baseAwareness + paidBoostRefined + execBoost + pillarBoost + (channelContentAlignment * 0.06);

  // Penalty for channel-content misalignment
  const linkedinPenalty = calculateMisalignmentPenalty(
    CM.linkedin || 0,
    (CT.linkedin_posts || 0) + (CT.blog_posts || 0) * 0.3
  );
  awareness = awareness * (1 - linkedinPenalty * 0.15);

  // -----------------------
  // VELOCITY KPI
  // -----------------------
  const velocityContent = ["case_studies", "whitepapers", "webinars", "video_content"];
  const velocityContentScore = velocityContent.reduce((sum, ct) => sum + (CT[ct] || 0), 0);

  const velocityChannels = ["paid_search", "paid_social", "email", "webinars"];
  const velocityChannelScore = velocityChannels.reduce((sum, ch) => sum + (CM[ch] || 0), 0);

  const considerationScore = FS.consideration || 0;
  const conversionScore = FS.conversion || 0;

  // Paid search & retargeting accelerate velocity (optimized weight)
  const velocityPaid = ["google_ads", "google_pmax", "linkedin_ads"];
  const paidVelocityPct = velocityPaid.reduce((sum, p) => sum + (Paid[p] || 0), 0);
  const paidAcceleration = paidVelocityPct * calculatedBudgetMultiplier * 0.25; // Keep original (paid is important for velocity)

  // Add funnel flow efficiency (improves accuracy)
  const funnelFlowEfficiency = calculateFunnelFlowEfficiency({
    funnelStageFocus: FS,
    channelFocus: CM,
    contentFocus: CT
  });

  const baseVelocity = (
    velocityContentScore * 0.26 +  // Slightly increased from 0.25 (content is important)
    velocityChannelScore * 0.20 +  // Keep same
    considerationScore * 0.20 +    // Keep same
    conversionScore * 0.26         // Slightly increased from 0.25 (conversion is important)
  );

  // Funnel flow efficiency adds up to 8% boost when flow is natural
  let velocity = baseVelocity + paidAcceleration + (funnelFlowEfficiency * 0.08);

  // Gradual penalty instead of binary
  if (conversionScore > 20 && velocityContentScore < 20) {
    const gap = 20 - velocityContentScore;
    const penaltyFactor = Math.min(gap / 20, 0.5); // Max 50% penalty, scales with gap
    velocity = velocity * (1 - penaltyFactor * 0.6); // Max 30% reduction (less harsh)
  }

  // -----------------------
  // EFFICIENCY KPI
  // -----------------------
  const channelConcentration = calculateHerfindahlIndex(CM);
  const contentConcentration = calculateHerfindahlIndex(CT);
  const paidConcentration = Paid ? calculateHerfindahlIndex(Paid) : 0;

  const concentrationScore = (channelConcentration + contentConcentration + paidConcentration) / 3;

  // Strategic alignment
  const channelFunnelAlignment = calculateAlignmentScore(CM, FS, {
    "linkedin": "awareness", "seo": "awareness", "pr": "awareness",
    "paid_search": "consideration", "email": "conversion",
    "events": "consideration", "web": "awareness"
  });

  const contentFunnelAlignment = calculateAlignmentScore(CT, FS, {
    "blog_posts": "awareness", "press_releases": "awareness",
    "whitepapers": "consideration", "case_studies": "conversion",
    "webinars": "consideration", "email_newsletters": "retention",
    "infographics": "awareness", "video_content": "awareness"
  });

  const alignmentScore = (channelFunnelAlignment + contentFunnelAlignment) / 2;

  // Budget efficiency
  const budgetEfficiency = calculateBudgetEfficiency(CM, Paid);

  // Message consistency
  let messageConsistency = 50;
  if (Pillars && Object.keys(Pillars).length > 0) {
    const pillarValues = Object.values(Pillars);
    const mean = pillarValues.reduce((sum, v) => sum + v, 0) / pillarValues.length;
    const variance = pillarValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / pillarValues.length;
    const pillarStd = Math.sqrt(variance);
    messageConsistency = Math.max(0, 100 - pillarStd * 2);
  }

  // Calculate system load for resource utilization
  const systemLoad = calculateSystemLoad({
    channelFocus: CM,
    contentFocus: CT,
    personaFocus: Persona,
    executiveVisibility: Exec,
    strategicPillars: Pillars,
    paidBudget: Paid,
  });

  // Add resource utilization factor (improves accuracy)
  const resourceUtilization = calculateResourceUtilization({
    channelFocus: CM,
    contentFocus: CT,
    paidBudget: Paid,
    systemLoad: systemLoad
  });

  // More balanced efficiency formula
  const efficiency = (
    concentrationScore * 0.28 +         // Slightly reduced from 0.30
    alignmentScore * 0.33 +              // Reduced from 0.35 (less aggressive)
    budgetEfficiency * 0.27 +            // Slightly increased from 0.25
    messageConsistency * 0.10 +          // Keep same
    resourceUtilization * 0.02            // NEW: Improves accuracy (2% boost, small contribution)
  );

  // -----------------------
  // RETENTION KPI
  // -----------------------
  const retentionContent = ["email_newsletters", "case_studies", "podcasts", "webinars"];
  const retentionContentScore = retentionContent.reduce((sum, ct) => sum + (CT[ct] || 0), 0);

  const retentionChannels = ["email", "events"];
  const retentionChannelScore = retentionChannels.reduce((sum, ch) => sum + (CM[ch] || 0), 0);

  const retentionFocus = FS.retention || 0;

  const retentionPillarBoost = (Pillars?.customer_success || 0) * 0.18; // Reduced from 0.20 (10% reduction, less aggressive)
  const retentionGoalWeight = (Goals?.increase_customer_retention || 0) * 0.09; // Reduced from 0.10 (10% reduction)

  // Add customer engagement factor (improves accuracy)
  const customerEngagement = calculateCustomerEngagement({
    retentionContent: retentionContentScore,
    retentionChannels: retentionChannelScore,
    strategicPillars: Pillars,
    goals: Goals
  });

  // More balanced retention formula
  let retention = (
    retentionContentScore * 0.25 +      // Keep same
    retentionChannelScore * 0.20 +      // Keep same
    retentionFocus * 0.43 +              // Reduced from 0.45 (less aggressive)
    retentionPillarBoost +
    retentionGoalWeight +
    customerEngagement * 0.03            // NEW: Improves accuracy (3% boost, small contribution)
  );

  // Gradual penalty instead of harsh binary
  const retentionGoal = Goals?.increase_customer_retention || 0;
  if (retentionGoal > 20 && retentionFocus < 15) {
    const gap = 15 - retentionFocus;
    const penaltyFactor = Math.min(gap / 15, 0.6); // Max 60% penalty
    retention = retention * (1 - penaltyFactor * 0.5); // Max 30% reduction (less harsh)
  }

  // -----------------------
  // CREDIBILITY KPI
  // -----------------------
  const credibilityContent = ["whitepapers", "case_studies", "podcasts", "webinars"];
  const credibilityContentScore = credibilityContent.reduce((sum, ct) => sum + (CT[ct] || 0), 0);

  const credibilityChannels = ["pr", "events"];
  const credibilityChannelScore = credibilityChannels.reduce((sum, ch) => sum + (CM[ch] || 0), 0);

  // Paid credibility investments
  const credibilityPaid = ["podcast_sponsorship", "event_sponsorship", "webinar_sponsorship", "pr_distribution"];
  const paidCredibilityPct = credibilityPaid.reduce((sum, p) => sum + (Paid[p] || 0), 0);
  const paidCredibilityBoost = paidCredibilityPct * calculatedBudgetMultiplier * 0.12; // Increased from 0.10

  // Executive visibility (critical for credibility - boost when very high)
  let execImpact = execScore * 0.38; // Base weight increased from 0.35
  // Bonus for very high exec visibility (exec visibility is the strongest credibility signal)
  if (execScore > 80) {
    execImpact = execScore * 0.45; // 45% weight when exec visibility is very high (>80)
  } else if (execScore > 60) {
    execImpact = execScore * 0.40; // 40% weight when exec visibility is high (60-80)
  }

  // Strategic pillars (increased weight - pillars are important)
  let pillarScore = 0;
  if (Pillars) {
    const thoughtLeadership = Pillars.thought_leadership || 0;
    pillarScore = (
      thoughtLeadership * 0.25 + // Increased from 0.22 (thought leadership is key for credibility)
      (Pillars.customer_success || 0) * 0.12 +   // Increased from 0.10
      (Pillars.industry_insights || 0) * 0.12     // Increased from 0.10
    );
    
    // Synergy bonus: very high exec visibility + high thought leadership = strong credibility
    if (execScore > 80 && thoughtLeadership > 35) {
      pillarScore = pillarScore * 1.15; // 15% bonus for synergy
    }
  }

  // Add authority score factor (improves accuracy)
  const authorityScore = calculateAuthorityScore({
    executiveVisibility: Exec,
    strategicPillars: Pillars,
    contentFocus: CT,
    channelFocus: CM
  });

  // More balanced credibility formula
  // Authority score adds up to 15% boost when all factors align
  let credibility = (
    credibilityContentScore * 0.18 +    // Slightly reduced (content is supporting, not core)
    credibilityChannelScore * 0.15 +     // Keep same
    execImpact +
    pillarScore +
    paidCredibilityBoost +
    authorityScore * 0.15                 // NEW: Improves accuracy (15% boost, increased)
  );
  
  // Additional boost for very high exec visibility + thought leadership combination
  if (execScore > 85 && (Pillars?.thought_leadership || 0) > 35) {
    credibility = credibility * 1.10; // 10% bonus for exceptional exec + thought leadership combo
  }

  // Gradual penalty instead of harsh binary
  const prFocus = CM.pr || 0;
  if (prFocus > 20 && execScore < 30) {
    const gap = 30 - execScore;
    const penaltyFactor = Math.min(gap / 30, 0.7); // Max 70% penalty
    credibility = credibility * (1 - penaltyFactor * 0.5); // Max 35% reduction
  }

  return {
    awareness: Math.round(Math.min(awareness, 100) * 100) / 100,
    velocity: Math.round(Math.min(velocity, 100) * 100) / 100,
    efficiency: Math.round(Math.min(efficiency, 100) * 100) / 100,
    retention: Math.round(Math.min(retention, 100) * 100) / 100,
    credibility: Math.round(Math.min(credibility, 100) * 100) / 100,
  };
}

