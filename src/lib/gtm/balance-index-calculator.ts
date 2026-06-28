/**
 * Balance Index Calculator
 * Converted from Django backend balance_index_calculator.py
 */

import { calculateFit, calculateBudgetEfficiency } from './utils';

export interface BalanceIndexInput {
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  funnelStageFocus: Record<string, number>;
  personaFocus: Record<string, number>;
  goals: Record<string, number>;
  paidBudget: Record<string, number>;
}

export function calculateBalanceIndex(input: BalanceIndexInput): number {
  const {
    channelFocus: CM,
    contentFocus: CT,
    funnelStageFocus: FS,
    personaFocus: Persona,
    goals: Goals,
    paidBudget: Paid,
  } = input;

  // Component 1: Channel-Content fit
  const linkedinFit = calculateFit(
    CM.linkedin || 0,
    (CT.linkedin_posts || 0) + (CT.blog_posts || 0) * 0.5
  );
  const emailFit = calculateFit(
    CM.email || 0,
    CT.email_newsletters || 0
  );
  const prFit = calculateFit(
    CM.pr || 0,
    (CT.press_releases || 0) + (CT.whitepapers || 0) * 0.3
  );
  const eventsFit = calculateFit(
    CM.events || 0,
    CT.webinars || 0
  );

  const channelContentFit = (linkedinFit + emailFit + prFit + eventsFit) / 4;

  // Component 2: Funnel-Strategy alignment
  const awarenessChannels = ["linkedin", "seo", "pr", "web"];
  const awarenessChannelsSum = awarenessChannels.reduce((sum, ch) => sum + (CM[ch] || 0), 0);
  const awarenessContent = ["blog_posts", "press_releases", "infographics"];
  const awarenessContentSum = awarenessContent.reduce((sum, ct) => sum + (CT[ct] || 0), 0);
  const awarenessStrategy = awarenessChannelsSum * 0.5 + awarenessContentSum * 0.3;

  const conversionContent = ["case_studies", "webinars", "whitepapers"];
  const conversionContentSum = conversionContent.reduce((sum, ct) => sum + (CT[ct] || 0), 0);
  const conversionChannels = ["paid_search", "email"];
  const conversionChannelsSum = conversionChannels.reduce((sum, ch) => sum + (CM[ch] || 0), 0);
  const conversionStrategy = conversionContentSum * 0.5 + conversionChannelsSum * 0.3;

  const awarenessStrategyFit = calculateFit(FS.awareness || 0, awarenessStrategy);
  const conversionStrategyFit = calculateFit(FS.conversion || 0, conversionStrategy);

  const funnelStrategyFit = (awarenessStrategyFit + conversionStrategyFit) / 2;

  // Component 3: Goal-Execution alignment
  let goalExecutionFit = 100;
  if (Goals) {
    const brandGoal = Goals.increase_brand_awareness || 0;
    if (brandGoal > 0) {
      const brandExecution = (FS.awareness || 0) + awarenessChannelsSum * 0.3;
      goalExecutionFit = Math.min(goalExecutionFit, calculateFit(brandGoal, brandExecution));
    }

    const retentionGoal = Goals.increase_customer_retention || 0;
    if (retentionGoal > 0) {
      const retentionExecution = (FS.retention || 0) + (CM.email || 0) * 0.3;
      goalExecutionFit = Math.min(goalExecutionFit, calculateFit(retentionGoal, retentionExecution));
    }
  }

  // Component 4: Budget-Strategy alignment
  const budgetStrategyFit = Paid ? calculateBudgetEfficiency(CM, Paid) : 100;

  // Combined balance index
  const balanceIndex = (
    channelContentFit * 0.30 +
    funnelStrategyFit * 0.25 +
    goalExecutionFit * 0.25 +
    budgetStrategyFit * 0.20
  );

  return Math.round(balanceIndex * 100) / 100;
}

