// Guided GTM Questionnaire
// Generates recommended archetype based on business context

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  guidance: string;
  options: {
    value: string;
    label: string;
    weight: Record<string, number>; // Maps to archetype weights
  }[];
}

export const GTM_QUESTIONNAIRE: QuestionnaireQuestion[] = [
  {
    id: 'business_stage',
    question: 'What stage is your business currently in?',
    guidance: 'Your business stage determines the right balance between brand building and revenue generation.',
    options: [
      {
        value: 'early_startup',
        label: 'Early Startup (Pre-PMF, <$1M ARR)',
        weight: { blitz: 0.3, experimenter: 0.4, foundation: 0.3 }
      },
      {
        value: 'growth_startup',
        label: 'Growth Startup (Post-PMF, $1M-$10M ARR)',
        weight: { blitz: 0.4, amplifier: 0.3, 'mid-market': 0.3 }
      },
      {
        value: 'scale_up',
        label: 'Scale-Up ($10M-$50M ARR)',
        weight: { marathon: 0.4, amplifier: 0.3, 'mid-market': 0.3 }
      },
      {
        value: 'established',
        label: 'Established Company (>$50M ARR)',
        weight: { marathon: 0.3, fortress: 0.4, 'brand-heavy': 0.3 }
      }
    ]
  },
  {
    id: 'primary_goal',
    question: 'What is your primary marketing goal for the next quarter?',
    guidance: 'Your goal should align with board expectations and current business priorities.',
    options: [
      {
        value: 'awareness',
        label: 'Build brand awareness and thought leadership',
        weight: { 'brand-heavy': 0.5, blitz: 0.3, disruptor: 0.2 }
      },
      {
        value: 'pipeline',
        label: 'Generate qualified pipeline immediately',
        weight: { 'demand-surge': 0.5, blitz: 0.3, 'mid-market': 0.2 }
      },
      {
        value: 'efficiency',
        label: 'Improve conversion rates and ROI',
        weight: { marathon: 0.4, amplifier: 0.3, fortress: 0.3 }
      },
      {
        value: 'retention',
        label: 'Reduce churn and expand existing accounts',
        weight: { fortress: 0.5, amplifier: 0.4, marathon: 0.1 }
      },
      {
        value: 'disruption',
        label: 'Challenge market leader and gain share',
        weight: { disruptor: 0.6, blitz: 0.3, 'brand-heavy': 0.1 }
      }
    ]
  },
  {
    id: 'market_position',
    question: 'How would you describe your current market position?',
    guidance: 'Your position determines whether you need offensive or defensive strategies.',
    options: [
      {
        value: 'new_entrant',
        label: 'New entrant - need to establish presence',
        weight: { blitz: 0.4, 'brand-heavy': 0.3, disruptor: 0.3 }
      },
      {
        value: 'challenger',
        label: 'Challenger - competing with established players',
        weight: { disruptor: 0.5, blitz: 0.3, 'mid-market': 0.2 }
      },
      {
        value: 'leader',
        label: 'Market leader - defending position',
        weight: { fortress: 0.4, marathon: 0.4, 'brand-heavy': 0.2 }
      },
      {
        value: 'niche',
        label: 'Niche player - focused on specific segment',
        weight: { 'mid-market': 0.5, marathon: 0.3, amplifier: 0.2 }
      }
    ]
  },
  {
    id: 'team_capacity',
    question: 'What is your marketing team capacity?',
    guidance: 'Team size impacts how many channels you can effectively manage simultaneously.',
    options: [
      {
        value: 'minimal',
        label: '1-2 people - need high leverage activities',
        weight: { marathon: 0.4, 'mid-market': 0.3, amplifier: 0.3 }
      },
      {
        value: 'small',
        label: '3-5 people - can handle moderate complexity',
        weight: { marathon: 0.3, 'mid-market': 0.4, blitz: 0.3 }
      },
      {
        value: 'medium',
        label: '6-15 people - ready for multi-channel execution',
        weight: { blitz: 0.4, 'demand-surge': 0.3, disruptor: 0.3 }
      },
      {
        value: 'large',
        label: '15+ people - can execute complex campaigns',
        weight: { blitz: 0.3, 'brand-heavy': 0.4, disruptor: 0.3 }
      }
    ]
  },
  {
    id: 'budget',
    question: 'What is your quarterly marketing budget?',
    guidance: 'Budget determines channel mix and campaign intensity.',
    options: [
      {
        value: 'bootstrap',
        label: 'Bootstrap (<$50K/quarter) - organic-first',
        weight: { marathon: 0.4, amplifier: 0.3, 'mid-market': 0.3 }
      },
      {
        value: 'moderate',
        label: 'Moderate ($50K-$250K/quarter) - balanced mix',
        weight: { 'mid-market': 0.4, marathon: 0.3, blitz: 0.3 }
      },
      {
        value: 'strong',
        label: 'Strong ($250K-$1M/quarter) - aggressive growth',
        weight: { blitz: 0.4, 'demand-surge': 0.3, disruptor: 0.3 }
      },
      {
        value: 'substantial',
        label: 'Substantial (>$1M/quarter) - full-stack execution',
        weight: { 'brand-heavy': 0.4, blitz: 0.3, disruptor: 0.3 }
      }
    ]
  },
  {
    id: 'urgency',
    question: 'What is your timeline for results?',
    guidance: 'Urgency affects the balance between quick wins and sustainable growth.',
    options: [
      {
        value: 'immediate',
        label: 'Immediate (this quarter) - need results now',
        weight: { 'demand-surge': 0.5, blitz: 0.4, disruptor: 0.1 }
      },
      {
        value: 'near_term',
        label: 'Near-term (2-3 quarters) - balanced approach',
        weight: { 'mid-market': 0.4, marathon: 0.3, blitz: 0.3 }
      },
      {
        value: 'long_term',
        label: 'Long-term (1+ years) - building for future',
        weight: { marathon: 0.5, 'brand-heavy': 0.3, fortress: 0.2 }
      }
    ]
  }
];

// Calculate recommended archetype based on answers
export function calculateRecommendedArchetype(answers: Record<string, string>): string {
  const archetypeScores: Record<string, number> = {
    'blitz': 0,
    'marathon': 0,
    'fortress': 0,
    'brand-heavy': 0,
    'demand-surge': 0,
    'amplifier': 0,
    'disruptor': 0,
    'mid-market': 0
  };

  // Sum up weights from all answers
  GTM_QUESTIONNAIRE.forEach(question => {
    const answer = answers[question.id];
    if (answer) {
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        Object.entries(option.weight).forEach(([archetype, weight]) => {
          archetypeScores[archetype] = (archetypeScores[archetype] || 0) + weight;
        });
      }
    }
  });

  // Find archetype with highest score
  let maxScore = 0;
  let recommended = 'marathon'; // Default fallback
  Object.entries(archetypeScores).forEach(([archetype, score]) => {
    if (score > maxScore) {
      maxScore = score;
      recommended = archetype;
    }
  });

  return recommended;
}
