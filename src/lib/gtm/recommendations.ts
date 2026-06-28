/**
 * Recommendations Generator
 * Converted from Django backend utils.py generate_recommendations
 */

import { calculateBudgetEfficiency } from './utils';

export interface RecommendationsInput {
  kpis: {
    awareness: number;
    velocity: number;
    efficiency: number;
    retention: number;
    credibility: number;
  };
  systemLoad: number;
  balanceIndex: number;
  channelFocus: Record<string, number>;
  contentFocus: Record<string, number>;
  funnelStageFocus: Record<string, number>;
  executiveVisibility: Record<string, number>;
  paidBudget: Record<string, number>;
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  issue: string;
  recommendation: string;
  expected_impact: string;
}

export function generateRecommendations(input: RecommendationsInput): Recommendation[] {
  const {
    kpis,
    systemLoad,
    balanceIndex,
    channelFocus: CM,
    contentFocus: CT,
    funnelStageFocus: FS,
    executiveVisibility: Exec,
    paidBudget: Paid,
  } = input;

  const recommendations: Recommendation[] = [];

  // System load recommendations (check first as it affects everything)
  if (systemLoad > 70) {
    const activeChannels = Object.values(CM).filter(v => v > 5).length;
    const activeContent = Object.values(CT).filter(v => v > 5).length;
    const activePaid = Paid ? Object.values(Paid).filter(v => v > 8).length : 0;

    recommendations.push({
      priority: 'critical',
      category: 'operations',
      issue: `Critically high operational complexity: ${activeChannels} channels, ${activeContent} content types, ${activePaid} major paid channels`,
      recommendation: 'Immediately consolidate to 3-4 core channels and 3-4 content types. Your team cannot execute this many initiatives effectively.',
      expected_impact: `-${Math.round((systemLoad - 55) * 0.6)} points in system load, +15-25% improvement in content quality and campaign performance`,
    });
  } else if (systemLoad > 55) {
    const activeChannels = Object.values(CM).filter(v => v > 5).length;
    const activeContent = Object.values(CT).filter(v => v > 5).length;

    if (activeChannels > 5 || activeContent > 5) {
      recommendations.push({
        priority: 'medium',
        category: 'operations',
        issue: `Moderate operational complexity (${activeChannels} channels, ${activeContent} content types)`,
        recommendation: 'Consider consolidating to your top 4 performing channels and content types. Focus beats dispersion.',
        expected_impact: `-${Math.round((systemLoad - 45) * 0.5)} points in system load, improved execution quality`,
      });
    }
  }

  // Credibility recommendations
  if (kpis.credibility < 30) {
    const prFocus = CM.pr || 0;
    const execValues = Object.values(Exec || {});
    const execScore = execValues.length > 0
      ? execValues.reduce((sum, v) => sum + v, 0) / execValues.length
      : 0;

    if (prFocus > 15 && execScore < 15) {
      recommendations.push({
        priority: 'high',
        category: 'credibility',
        issue: `PR focus (${Math.round(prFocus)}%) undermined by low executive visibility (avg: ${execScore.toFixed(1)}/100)`,
        recommendation: 'Activate 2-3 executives for thought leadership. Target: speaking engagements, contributed articles, podcast appearances. PR without visible leaders generates minimal credibility.',
        expected_impact: '+25-40 points in credibility score',
      });
    } else if (execScore < 20) {
      recommendations.push({
        priority: 'medium',
        category: 'credibility',
        issue: `Low executive visibility (avg: ${execScore.toFixed(1)}/100)`,
        recommendation: 'Build executive personal brands through LinkedIn, industry events, and media appearances. Start with your CEO/CTO.',
        expected_impact: '+15-25 points in credibility score',
      });
    }
  }

  // Velocity recommendations
  if (kpis.velocity < 40) {
    const conversionFocus = FS.conversion || 0;
    const considerationFocus = FS.consideration || 0;
    const velocityContent = ['case_studies', 'whitepapers', 'webinars'].reduce(
      (sum, ct) => sum + (CT[ct] || 0),
      0
    );

    if ((conversionFocus + considerationFocus) > 40 && velocityContent < 25) {
      recommendations.push({
        priority: 'high',
        category: 'velocity',
        issue: `Mid/bottom funnel focus (${Math.round(conversionFocus + considerationFocus)}%) but insufficient supporting content (${Math.round(velocityContent)}%)`,
        recommendation: 'Create conversion assets: 5-8 case studies, product comparison guides, ROI calculators, and demo videos. Without these, prospects stall.',
        expected_impact: '+20-35 points in velocity score, 15-25% improvement in conversion rates',
      });
    }

    const googleAds = (Paid?.google_ads || 0) + (Paid?.google_pmax || 0);
    if (googleAds > 10 && velocityContent < 20) {
      recommendations.push({
        priority: 'high',
        category: 'velocity',
        issue: `Spending ${Math.round(googleAds)}% of budget on Google Ads without sufficient landing page content`,
        recommendation: 'Build conversion-optimized landing pages with case studies, testimonials, and clear CTAs. Paid search without strong conversion content wastes budget.',
        expected_impact: '+10-20 points in velocity, 30-50% improvement in paid search ROAS',
      });
    }
  }

  // Retention recommendations
  if (kpis.retention < 20) {
    const retentionGoal = FS.retention || 0;
    const emailNewsletters = CT.email_newsletters || 0;

    if (retentionGoal < 10) {
      recommendations.push({
        priority: 'medium',
        category: 'retention',
        issue: `Low retention focus (${Math.round(retentionGoal)}%)`,
        recommendation: 'Increase retention funnel allocation to at least 15-20%. Customer retention is more cost-effective than acquisition.',
        expected_impact: '+15-25 points in retention score',
      });
    }

    if (emailNewsletters === 0) {
      recommendations.push({
        priority: 'high',
        category: 'retention',
        issue: 'No email newsletter content',
        recommendation: 'Launch regular customer newsletters with product updates, success stories, and educational content.',
        expected_impact: '+10-15 points in retention score',
      });
    }
  }

  // Balance recommendations
  if (balanceIndex < 50) {
    const linkedinFocus = CM.linkedin || 0;
    const linkedinContent = CT.linkedin_posts || 0;

    if (linkedinFocus > 30 && linkedinContent === 0) {
      recommendations.push({
        priority: 'high',
        category: 'alignment',
        issue: `LinkedIn channel focus (${Math.round(linkedinFocus)}%) without LinkedIn content`,
        recommendation: 'Create LinkedIn-native content to support channel strategy. Aim for 2-3 posts per week.',
        expected_impact: '+15-20 points in balance index, +10-15 points in awareness',
      });
    }
  }

  // Efficiency recommendations
  if (kpis.efficiency < 50) {
    if (Paid) {
      const budgetEff = calculateBudgetEfficiency(CM, Paid);

      if (budgetEff < 40) {
        recommendations.push({
          priority: 'medium',
          category: 'efficiency',
          issue: `Paid budget misaligned with organic strategy (${Math.round(budgetEff)}% efficiency)`,
          recommendation: 'Reallocate paid budget to match organic channel focus. Example: High LinkedIn focus should have proportional LinkedIn ads.',
          expected_impact: '+15-25 points in efficiency score, improved ROAS',
        });
      }
    }
  }

  // System load recommendations (duplicate check)
  if (systemLoad > 70) {
    const activeChannels = Object.values(CM).filter(v => v > 5).length;
    const activeContent = Object.values(CT).filter(v => v > 5).length;

    if (activeChannels > 5 || activeContent > 6) {
      recommendations.push({
        priority: 'medium',
        category: 'operations',
        issue: `High operational complexity (${activeChannels} active channels, ${activeContent} content types)`,
        recommendation: 'Focus on 3-4 core channels and 4-5 content types for better execution quality.',
        expected_impact: '-20-30 points in system load, improved content quality',
      });
    }
  }

  // Awareness recommendations
  if (kpis.awareness < 40) {
    const awarenessFocus = FS.awareness || 0;

    if (awarenessFocus < 40) {
      recommendations.push({
        priority: 'high',
        category: 'awareness',
        issue: `Insufficient top-of-funnel focus (${Math.round(awarenessFocus)}%)`,
        recommendation: 'Increase awareness stage allocation to 50-60% for sustainable growth. Focus on SEO, content marketing, and PR.',
        expected_impact: '+20-30 points in awareness score',
      });
    }
  }

  return recommendations;
}

