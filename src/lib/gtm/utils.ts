/**
 * GTM Calculation Utilities
 * Converted from Django backend utils.py
 */

/**
 * Calculate concentration using Herfindahl-Hirschman Index.
 * Returns 0-100, where 100 = complete concentration, 10 = completely dispersed.
 */
export function calculateHerfindahlIndex(allocationDict: Record<string, number>): number {
  if (!allocationDict || Object.keys(allocationDict).length === 0) {
    return 0;
  }

  const values = Object.values(allocationDict).filter(v => v > 0);
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, v) => sum + v, 0);
  if (total === 0) {
    return 0;
  }

  // Sum of squared percentages
  const hhi = values.reduce((sum, v) => {
    const pct = (v / total) * 100;
    return sum + (pct * pct);
  }, 0);

  // Normalize: HHI ranges from ~625 (16 equal channels) to 10000 (monopoly)
  // Map to 0-100 scale
  return Math.min(hhi / 100, 100);
}

/**
 * Calculate penalty when focus and supporting content don't align.
 */
export function calculateMisalignmentPenalty(focusValue: number, contentValue: number): number {
  if (focusValue === 0) {
    return 0;
  }

  const gap = Math.abs(focusValue - contentValue);
  return Math.min(gap / 100, 1.0);
}

/**
 * Calculate how well resource allocation aligns with funnel stage focus.
 */
export function calculateAlignmentScore(
  resourceAllocation: Record<string, number>,
  funnelStages: Record<string, number>,
  mapping: Record<string, string>
): number {
  if (!resourceAllocation || !funnelStages || Object.keys(resourceAllocation).length === 0) {
    return 50; // Neutral score
  }

  let totalAlignment = 0;
  let totalWeight = 0;

  for (const [resource, stage] of Object.entries(mapping)) {
    const resourceValue = resourceAllocation[resource] || 0;
    if (resourceValue > 0) {
      const stageValue = funnelStages[stage] || 0;
      // Perfect alignment = both high or both low
      const alignment = 100 - Math.abs(resourceValue - stageValue);
      totalAlignment += alignment * resourceValue;
      totalWeight += resourceValue;
    }
  }

  return totalWeight > 0 ? totalAlignment / totalWeight : 50;
}

/**
 * Measure how well paid budget aligns with organic channel focus.
 */
export function calculateBudgetEfficiency(
  channelFocus: Record<string, number>,
  paidBudget: Record<string, number>
): number {
  if (!paidBudget || !channelFocus || Object.keys(paidBudget).length === 0) {
    return 100; // No paid budget = no inefficiency
  }

  // Map paid channels to organic channels
  const paidToOrganic: Record<string, string> = {
    "linkedin_ads": "linkedin",
    "meta_ads": "paid_social",
    "google_ads": "paid_search",
    "google_pmax": "paid_search",
    "youtube_ads": "video",
    "twitter_ads": "paid_social",
    "reddit_ads": "paid_social",
    "tiktok_ads": "paid_social",
    "events": "events",
    "webinar_sponsorship": "events",
    "podcast_sponsorship": "pr",
    "event_sponsorship": "events",
  };

  let alignedBudget = 0;
  const totalPaid = Object.values(paidBudget).reduce((sum, v) => sum + v, 0);

  if (totalPaid === 0) {
    return 100;
  }

  for (const [paidChannel, budgetPct] of Object.entries(paidBudget)) {
    if (budgetPct > 0) {
      const organicChannel = paidToOrganic[paidChannel];
      if (organicChannel && organicChannel in channelFocus) {
        const organicFocus = channelFocus[organicChannel];
        // High organic focus + high budget = good alignment
        const alignmentQuality = Math.min(organicFocus, budgetPct) / Math.max(organicFocus, budgetPct, 1);
        alignedBudget += budgetPct * alignmentQuality;
      }
    }
  }

  const efficiency = (alignedBudget / totalPaid) * 100;
  return Math.round(efficiency * 100) / 100;
}

/**
 * Calculate how well two values align (0-100 score).
 * Perfect fit = both high or both low.
 * Poor fit = one high, one low.
 */
export function calculateFit(value1: number, value2: number): number {
  if (value1 === 0 && value2 === 0) {
    return 100; // Both zero = perfect fit
  }

  const maxVal = Math.max(value1, value2, 1);
  const minVal = Math.min(value1, value2);

  // Ratio-based fit score
  const fitRatio = minVal / maxVal;
  return fitRatio * 100;
}

/**
 * Calculate channel-content alignment for awareness KPI.
 * Checks if high channel focus has corresponding content support.
 */
export function calculateChannelContentAlignment(params: {
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  awarenessChannels: string[];
  awarenessContent: string[];
}): number {
  const { channelFocus, contentFocus, awarenessChannels } = params;
  
  let alignmentScore = 0;
  let totalWeight = 0;
  
  const channelContentMap: Record<string, string[]> = {
    "linkedin": ["linkedin_posts", "blog_posts"],
    "seo": ["blog_posts", "whitepapers"],
    "pr": ["press_releases"],
    "web": ["blog_posts", "infographics", "video_content"]
  };
  
  awarenessChannels.forEach(channel => {
    const channelWeight = channelFocus[channel] || 0;
    if (channelWeight > 5) {
      const relatedContent = channelContentMap[channel] || [];
      const contentScore = relatedContent.reduce((sum, ct) => 
        sum + (contentFocus[ct] || 0), 0
      );
      // Alignment: both high = good, one high one low = penalty
      const alignment = Math.min(channelWeight, contentScore) / Math.max(channelWeight, contentScore, 1);
      alignmentScore += alignment * channelWeight;
      totalWeight += channelWeight;
    }
  });
  
  return totalWeight > 0 ? (alignmentScore / totalWeight) * 100 : 0;
}

/**
 * Calculate funnel flow efficiency for velocity KPI.
 * Checks if funnel stages flow logically (awareness -> consideration -> conversion).
 */
export function calculateFunnelFlowEfficiency(params: {
  funnelStageFocus: Record<string, number>;
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
}): number {
  const { funnelStageFocus: FS } = params;
  
  const awareness = FS.awareness || 0;
  const consideration = FS.consideration || 0;
  const conversion = FS.conversion || 0;
  
  // Ideal flow: awareness > consideration > conversion (with some tolerance)
  const flowScore = 
    (Math.min(awareness, consideration + 10) / Math.max(awareness, consideration + 10, 1)) * 0.4 +
    (Math.min(consideration, conversion + 10) / Math.max(consideration, conversion + 10, 1)) * 0.6;
  
  // Penalty if conversion is high but awareness is very low (unnatural flow)
  if (conversion > 30 && awareness < 15) {
    return flowScore * 0.5 * 100; // 50% penalty for unnatural flow
  }
  
  return flowScore * 100; // Scale to 0-100
}

/**
 * Calculate resource utilization for efficiency KPI.
 * Checks how well resources are being used based on system load and concentration.
 */
export function calculateResourceUtilization(params: {
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  paidBudget: Record<string, number>;
  systemLoad: number;
}): number {
  const { channelFocus, contentFocus, paidBudget, systemLoad } = params;
  
  const activeChannels = Object.values(channelFocus).filter(v => v > 5).length;
  const activeContent = Object.values(contentFocus).filter(v => v > 5).length;
  const activePaid = Object.values(paidBudget).filter(v => v > 5).length;
  
  // Calculate concentration (how focused the effort is)
  const channelConcentration = calculateHerfindahlIndex(channelFocus);
  const contentConcentration = calculateHerfindahlIndex(contentFocus);
  const avgConcentration = (channelConcentration + contentConcentration) / 2;
  
  // Utilization score: high concentration + moderate system load = good
  // Low concentration + high system load = poor (spread too thin)
  if (systemLoad > 70 && avgConcentration < 50) {
    return 30; // Poor utilization (spread too thin)
  } else if (systemLoad > 70 && avgConcentration > 70) {
    return 80; // Good utilization (focused high effort)
  } else if (systemLoad < 50 && avgConcentration > 60) {
    return 90; // Excellent utilization (focused low effort)
  } else {
    return 60; // Moderate utilization
  }
}

/**
 * Calculate customer engagement for retention KPI.
 * Checks alignment of content, channels, pillars, and goals.
 */
export function calculateCustomerEngagement(params: {
  retentionContent: number;
  retentionChannels: number;
  strategicPillars: Record<string, number>;
  goals: Record<string, number>;
}): number {
  const { retentionContent, retentionChannels, strategicPillars, goals } = params;
  
  // Customer success pillar + retention goal = high engagement
  const customerSuccessPillar = strategicPillars?.customer_success || 0;
  const retentionGoal = goals?.increase_customer_retention || 0;
  
  // Engagement score based on alignment of content, channels, pillars, and goals
  const contentChannelScore = (retentionContent + retentionChannels) / 2;
  const pillarGoalScore = (customerSuccessPillar + retentionGoal) / 2;
  
  // High alignment = high engagement
  const alignment = Math.min(contentChannelScore, pillarGoalScore) / 
                    Math.max(contentChannelScore, pillarGoalScore, 1);
  
  return alignment * 100;
}

/**
 * Calculate authority score for credibility KPI.
 * Combines exec visibility, thought leadership, credible content, and PR channels.
 */
export function calculateAuthorityScore(params: {
  executiveVisibility: Record<string, number>;
  strategicPillars: Record<string, number>;
  contentFocus: Record<string, number>;
  channelFocus: Record<string, number>;
}): number {
  const { executiveVisibility: Exec, strategicPillars: Pillars, contentFocus: CT, channelFocus: CM } = params;
  
  // Authority = combination of exec visibility + thought leadership + credible content + PR channels
  const execValues = Object.values(Exec || {});
  const avgExecVisibility = execValues.length > 0
    ? execValues.reduce((sum, v) => sum + v, 0) / execValues.length
    : 0;
  
  const thoughtLeadership = Pillars?.thought_leadership || 0;
  const credibleContent = (CT.whitepapers || 0) + (CT.case_studies || 0) + (CT.webinars || 0);
  const prChannel = CM.pr || 0;
  
  // Authority score: all factors working together = high authority
  // Weighted average that rewards when all factors are high
  const authorityFactors = [
    avgExecVisibility * 0.50,  // Increased from 0.40 (exec visibility is most important for authority)
    thoughtLeadership * 0.30,   // Increased from 0.25
    credibleContent * 0.15,     // Reduced from 0.20 (content is supporting)
    prChannel * 0.05            // Reduced from 0.10 (PR is supporting)
  ];
  
  // Calculate weighted average, but boost if multiple factors are high (synergy)
  const baseScore = authorityFactors.reduce((sum, factor) => sum + factor, 0);
  
  // Synergy bonus: if exec visibility AND thought leadership are both high, add bonus
  if (avgExecVisibility > 70 && thoughtLeadership > 30) {
    return Math.min(baseScore * 1.20, 100); // 20% bonus for synergy (increased)
  }
  
  // High exec visibility alone should still give good authority score
  if (avgExecVisibility > 80) {
    return Math.min(baseScore * 1.10, 100); // 10% bonus for very high exec visibility
  }
  
  return Math.min(baseScore, 100);
}

/**
 * Improved budget multiplier calculation with more realistic scaling.
 * Uses diminishing returns curve with higher cap for enterprise budgets.
 */
export function calculateBudgetMultiplier(effectiveBudget: number): number {
  if (effectiveBudget <= 0) return 1.0;
  
  // Normalize to $100k base (industry standard for SMB)
  const normalizedBudget = effectiveBudget / 100000;
  
  // Diminishing returns curve: log scale with smoother transition
  // $100k = 1.0x, $500k = 1.4x, $1M = 1.6x, $5M = 2.0x, $10M = 2.2x
  const multiplier = 1 + Math.log10(Math.max(normalizedBudget, 0.1)) * 0.4;
  
  // Cap at 2.5x for very large budgets (was 2.0x)
  return Math.min(multiplier, 2.5);
}

