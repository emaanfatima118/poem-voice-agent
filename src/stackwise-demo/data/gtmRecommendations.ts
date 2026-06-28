// GTM Model Recommendations Generator
// Creates contextual recommendations based on model configuration

export interface GTMRecommendation {
  id: string;
  category: 'channels' | 'content' | 'budget' | 'team' | 'metrics' | 'timeline';
  text: string;
  rationale: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number; // 1-10
}

export function generateRecommendations(
  model: any, // GTMModel type
  archetypeName?: string
): GTMRecommendation[] {
  const recommendations: GTMRecommendation[] = [];
  const { config, kpis, systemLoad, balance, warnings } = model;

  // High system load recommendations
  if (systemLoad > 80) {
    recommendations.push({
      id: 'rec-load-1',
      category: 'team',
      text: 'Add 2-3 specialized contractors to handle high-intensity campaigns',
      rationale: `System load at ${systemLoad}% indicates team strain. Temporary specialists can maintain quality without burnout.`,
      impact: 'high',
      effort: 'medium',
      priority: 9
    });
    
    recommendations.push({
      id: 'rec-load-2',
      category: 'timeline',
      text: 'Phase campaign launches over 6 weeks instead of simultaneous launch',
      rationale: 'Staggered rollout reduces peak load while maintaining momentum.',
      impact: 'medium',
      effort: 'low',
      priority: 7
    });
  }

  // Low retention recommendations
  if (kpis.retention < 50) {
    recommendations.push({
      id: 'rec-retention-1',
      category: 'content',
      text: 'Launch monthly customer newsletter with product tips and success stories',
      rationale: `Retention score at ${kpis.retention} suggests need for ongoing engagement. Regular touchpoints reduce churn.`,
      impact: 'high',
      effort: 'medium',
      priority: 8
    });

    recommendations.push({
      id: 'rec-retention-2',
      category: 'channels',
      text: 'Increase email budget by 15% and add automated nurture sequences',
      rationale: 'Email is highest-ROI channel for retention. Automation scales personalization.',
      impact: 'high',
      effort: 'medium',
      priority: 8
    });
  }

  // Low awareness recommendations
  if (kpis.awareness < 55) {
    recommendations.push({
      id: 'rec-awareness-1',
      category: 'channels',
      text: 'Allocate 20% budget to thought leadership content on LinkedIn',
      rationale: `Awareness at ${kpis.awareness} limits top-of-funnel. Executive visibility builds credibility.`,
      impact: 'high',
      effort: 'medium',
      priority: 7
    });

    recommendations.push({
      id: 'rec-awareness-2',
      category: 'content',
      text: 'Publish 2-3 data-driven industry reports per quarter',
      rationale: 'Original research generates PR coverage and inbound links.',
      impact: 'medium',
      effort: 'high',
      priority: 6
    });
  }

  // High awareness but low velocity
  if (kpis.awareness > 75 && kpis.velocity < 60) {
    recommendations.push({
      id: 'rec-velocity-1',
      category: 'channels',
      text: 'Launch intent-based retargeting campaigns for high-awareness prospects',
      rationale: 'You have visibility but not enough pipeline velocity. Retargeting converts awareness into action.',
      impact: 'high',
      effort: 'low',
      priority: 9
    });

    recommendations.push({
      id: 'rec-velocity-2',
      category: 'content',
      text: 'Create gated bottom-funnel assets (ROI calculators, comparison guides)',
      rationale: 'Awareness is strong; need conversion assets to capture intent.',
      impact: 'high',
      effort: 'medium',
      priority: 8
    });
  }

  // Imbalanced mix
  if (balance < 65) {
    recommendations.push({
      id: 'rec-balance-1',
      category: 'budget',
      text: 'Rebalance channel mix: reduce top 2 channels by 10%, distribute to underweighted channels',
      rationale: `Balance score at ${balance} indicates over-concentration. Diversification reduces risk.`,
      impact: 'medium',
      effort: 'low',
      priority: 6
    });
  }

  // Strong efficiency - double down
  if (kpis.efficiency > 80) {
    recommendations.push({
      id: 'rec-efficiency-1',
      category: 'budget',
      text: 'Increase budget 25% for top-performing channels while maintaining current strategy',
      rationale: `Efficiency at ${kpis.efficiency} suggests strong PMF. Scale what's working.`,
      impact: 'high',
      effort: 'low',
      priority: 9
    });
  }

  // Archetype-specific recommendations
  if (archetypeName === 'blitz' || archetypeName === 'The Blitz') {
    recommendations.push({
      id: 'rec-blitz-1',
      category: 'metrics',
      text: 'Set up daily pipeline dashboards and weekly war room reviews',
      rationale: 'Blitz requires real-time visibility to course-correct fast.',
      impact: 'medium',
      effort: 'low',
      priority: 7
    });
  }

  if (archetypeName === 'marathon' || archetypeName === 'The Marathon') {
    recommendations.push({
      id: 'rec-marathon-1',
      category: 'metrics',
      text: 'Implement cohort analysis to track long-term customer value',
      rationale: 'Marathon strategy needs LTV metrics to validate sustainable approach.',
      impact: 'medium',
      effort: 'medium',
      priority: 6
    });
  }

  // Sort by priority
  return recommendations.sort((a, b) => b.priority - a.priority);
}

export interface ComparisonInsight {
  category: string;
  winner: number; // Model index (0, 1, 2)
  insight: string;
  magnitude: 'significant' | 'moderate' | 'minor';
}

export function compareModels(models: any[]): {
  insights: ComparisonInsight[];
  winScenarios: Record<number, string[]>;
  funnelData: any[];
} {
  const validModels = models.filter(m => m !== null);
  
  if (validModels.length < 2) {
    return { insights: [], winScenarios: {}, funnelData: [] };
  }

  const insights: ComparisonInsight[] = [];

  // Compare key metrics
  const awarenessScores = validModels.map(m => m.kpis.awareness);
  const maxAwareness = Math.max(...awarenessScores);
  const winnerIdx = awarenessScores.indexOf(maxAwareness);
  const diff = maxAwareness - Math.min(...awarenessScores);

  if (diff > 20) {
    insights.push({
      category: 'Awareness',
      winner: winnerIdx,
      insight: `Model ${winnerIdx + 1} generates ${diff}% more awareness through heavier investment in brand channels`,
      magnitude: 'significant'
    });
  }

  // Generate win scenarios for each model
  const winScenarios: Record<number, string[]> = {};
  
  validModels.forEach((model, idx) => {
    const scenarios: string[] = [];
    
    if (model.systemLoad < 65) {
      scenarios.push('Team has capacity - sustainable long-term');
    }
    if (model.kpis.efficiency > 75) {
      scenarios.push('High ROI - efficient use of budget');
    }
    if (model.kpis.velocity > 75) {
      scenarios.push('Fast pipeline generation - meets quarterly targets');
    }
    if (model.balance > 80) {
      scenarios.push('Balanced approach - reduces single-channel risk');
    }
    if (model.kpis.retention > 75) {
      scenarios.push('Strong retention - compounds growth over time');
    }

    winScenarios[idx] = scenarios;
  });

  // Generate funnel data for visualization
  const funnelData = validModels.map((model, idx) => ({
    modelName: model.name || `Model ${idx + 1}`,
    awareness: model.kpis.awareness * 100,
    consideration: model.kpis.awareness * 0.4 * 100,
    conversion: model.kpis.velocity * 0.3 * 100,
    retention: model.kpis.retention * 0.5 * 100
  }));

  return { insights, winScenarios, funnelData };
}
