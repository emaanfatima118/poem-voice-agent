// Roadmaps & Connections Dummy Dataset

import type {
  StrategicThread,
  AccountNode,
  PlayMotion,
  RoadmapDataset,
  Stage
} from './roadmaps-types';

export const THREADS: StrategicThread[] = [
  { name: 'Revenue Expansion', description: 'Pipeline and ACV growth via targeted ABM.' },
  { name: 'Thought Leadership', description: 'Executive visibility and authority.' },
  { name: 'Retention Lift', description: 'Stickiness via advocacy, onboarding, CS motions.' },
  { name: 'Innovation Partnerships', description: 'Co-build programs with strategic partners.' },
  { name: 'Market Penetration', description: 'New logo capture in priority verticals.' }
];

export const ACCOUNTS: AccountNode[] = [
  {
    id: 'acc-001',
    name: 'FormFactor',
    stage: 'Engagement',
    threads: ['Revenue Expansion'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 72 },
    owner: 'Sarah Chen',
    industry: 'Semiconductor',
    persona: ['VP Engineering', 'CTO'],
    pillar: ['Innovation', 'Operational Excellence'],
    linkedPlays: ['play-001', 'play-003'],
    lastActivity: '2 days ago',
    nextPlaySuggestion: 'play-002'
  },
  {
    id: 'acc-002',
    name: 'Novartis',
    stage: 'Opportunity',
    threads: ['Innovation Partnerships', 'Thought Leadership'],
    horizon: { time: 'Long-Term', magnitude: 'Transformational', score: 88 },
    owner: 'Mike Rodriguez',
    industry: 'Life Sciences',
    persona: ['Chief Digital Officer', 'Head of R&D'],
    pillar: ['Sustainability', 'Innovation'],
    linkedPlays: ['play-004', 'play-005'],
    lastActivity: '1 day ago',
    nextPlaySuggestion: 'play-006'
  },
  {
    id: 'acc-003',
    name: 'UC (University of California)',
    stage: 'Activation',
    threads: ['Revenue Expansion', 'Market Penetration'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 65 },
    owner: 'Jessica Liu',
    industry: 'Higher Education',
    persona: ['CIO', 'VP Academic Affairs'],
    pillar: ['Operational Excellence', 'Student Success'],
    linkedPlays: ['play-001', 'play-007'],
    lastActivity: '4 hours ago',
    nextPlaySuggestion: 'play-002'
  },
  {
    id: 'acc-004',
    name: 'Roche',
    stage: 'Negotiation',
    threads: ['Innovation Partnerships'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 79 },
    owner: 'David Kim',
    industry: 'Life Sciences',
    persona: ['CFO', 'VP Procurement'],
    pillar: ['Sustainability', 'Innovation'],
    linkedPlays: ['play-005'],
    lastActivity: '3 days ago',
    nextPlaySuggestion: 'play-008'
  },
  {
    id: 'acc-005',
    name: 'Tesla Energy',
    stage: 'Awareness',
    threads: ['Thought Leadership', 'Market Penetration'],
    horizon: { time: 'Long-Term', magnitude: 'Transformational', score: 82 },
    owner: 'Amanda Torres',
    industry: 'Energy',
    persona: ['Head of Infrastructure', 'VP Operations'],
    pillar: ['Sustainability', 'Innovation'],
    linkedPlays: ['play-003'],
    lastActivity: '1 week ago',
    nextPlaySuggestion: 'play-001'
  },
  {
    id: 'acc-006',
    name: 'Salesforce',
    stage: 'Closed Won',
    threads: ['Retention Lift', 'Thought Leadership'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 70 },
    owner: 'Marcus Johnson',
    industry: 'SaaS',
    persona: ['VP Customer Success', 'CMO'],
    pillar: ['Customer Centricity', 'Innovation'],
    linkedPlays: ['play-006', 'play-007'],
    lastActivity: '2 days ago',
    nextPlaySuggestion: 'play-009'
  },
  {
    id: 'acc-007',
    name: 'Stripe',
    stage: 'Expansion',
    threads: ['Revenue Expansion', 'Retention Lift'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 75 },
    owner: 'Emily Zhang',
    industry: 'FinTech',
    persona: ['CFO', 'VP Product'],
    pillar: ['Operational Excellence', 'Innovation'],
    linkedPlays: ['play-002', 'play-009'],
    lastActivity: '5 hours ago',
    nextPlaySuggestion: 'play-010'
  },
  {
    id: 'acc-008',
    name: 'Adobe',
    stage: 'Closed Lost',
    threads: ['Market Penetration'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 45 },
    owner: 'Robert Lee',
    industry: 'SaaS',
    persona: ['CTO'],
    pillar: ['Innovation'],
    linkedPlays: [],
    lastActivity: '3 weeks ago'
  }
];

export const PLAYS: PlayMotion[] = [
  {
    id: 'play-001',
    name: 'Exec POV Series',
    type: '1:1',
    threads: ['Thought Leadership', 'Revenue Expansion'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 78 },
    channels: ['LinkedIn', 'Email', 'Webinar'],
    owner: 'Sarah Chen',
    targetStages: ['Awareness', 'Engagement', 'Activation'],
    pillar: 'Thought Leadership',
    persona: ['CTO', 'VP Engineering', 'CIO'],
    accounts: ['acc-001', 'acc-003']
  },
  {
    id: 'play-002',
    name: 'Paid Social - Conversion Focus',
    type: 'Awareness',
    threads: ['Market Penetration', 'Revenue Expansion'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 68 },
    channels: ['LinkedIn Ads', 'Twitter Ads', 'Google Ads'],
    owner: 'Jessica Liu',
    targetStages: ['Awareness', 'Engagement'],
    pillar: 'Brand Visibility',
    persona: ['VP Marketing', 'CMO'],
    accounts: []
  },
  {
    id: 'play-003',
    name: 'Industry Webinar Series',
    type: 'Cluster',
    threads: ['Thought Leadership', 'Market Penetration'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 74 },
    channels: ['Webinar', 'Email', 'Content Hub'],
    owner: 'Amanda Torres',
    targetStages: ['Awareness', 'Engagement'],
    pillar: 'Thought Leadership',
    persona: ['VP Operations', 'Head of Infrastructure'],
    accounts: ['acc-001', 'acc-005']
  },
  {
    id: 'play-004',
    name: 'Co-Marketing with Partner X',
    type: '1:1',
    threads: ['Innovation Partnerships'],
    horizon: { time: 'Long-Term', magnitude: 'Transformational', score: 85 },
    channels: ['Events', 'Co-branded Content', 'PR'],
    owner: 'Mike Rodriguez',
    targetStages: ['Engagement', 'Opportunity', 'Negotiation'],
    pillar: 'Strategic Partnerships',
    persona: ['Chief Digital Officer', 'Head of R&D'],
    accounts: ['acc-002']
  },
  {
    id: 'play-005',
    name: 'Customer Advocacy Program',
    type: 'Cluster',
    threads: ['Retention Lift', 'Innovation Partnerships'],
    horizon: { time: 'Long-Term', magnitude: 'Transformational', score: 82 },
    channels: ['Case Studies', 'Reference Calls', 'Events'],
    owner: 'David Kim',
    targetStages: ['Opportunity', 'Negotiation', 'Closed Won', 'Expansion'],
    pillar: 'Customer Centricity',
    persona: ['VP Customer Success', 'CFO'],
    accounts: ['acc-002', 'acc-004']
  },
  {
    id: 'play-006',
    name: 'Executive Roundtable',
    type: '1:1',
    threads: ['Thought Leadership', 'Retention Lift'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 76 },
    channels: ['In-person Events', 'Executive Briefing'],
    owner: 'Marcus Johnson',
    targetStages: ['Opportunity', 'Negotiation', 'Expansion'],
    pillar: 'Executive Engagement',
    persona: ['CEO', 'CMO', 'CFO'],
    accounts: ['acc-006']
  },
  {
    id: 'play-007',
    name: 'Content Marketing - ROI Focus',
    type: 'Awareness',
    threads: ['Market Penetration', 'Revenue Expansion'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 66 },
    channels: ['Blog', 'Email', 'Social Media'],
    owner: 'Jessica Liu',
    targetStages: ['Awareness', 'Engagement', 'Activation'],
    pillar: 'Content Excellence',
    persona: ['VP Marketing', 'Director of Growth'],
    accounts: ['acc-003', 'acc-006']
  },
  {
    id: 'play-008',
    name: 'Deal Acceleration Workshop',
    type: '1:1',
    threads: ['Revenue Expansion'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 72 },
    channels: ['Virtual Workshop', 'Sales Enablement'],
    owner: 'David Kim',
    targetStages: ['Negotiation', 'Closed Won'],
    pillar: 'Sales Excellence',
    persona: ['VP Procurement', 'CFO'],
    accounts: []
  },
  {
    id: 'play-009',
    name: 'Customer Success Playbook',
    type: 'Cluster',
    threads: ['Retention Lift', 'Revenue Expansion'],
    horizon: { time: 'Near-Term', magnitude: 'Programmatic', score: 77 },
    channels: ['Email', 'In-app', 'Webinar'],
    owner: 'Emily Zhang',
    targetStages: ['Closed Won', 'Expansion'],
    pillar: 'Customer Centricity',
    persona: ['VP Customer Success', 'Account Manager'],
    accounts: ['acc-007']
  },
  {
    id: 'play-010',
    name: 'Upsell Campaign - Premium Tier',
    type: 'Cluster',
    threads: ['Revenue Expansion'],
    horizon: { time: 'Immediate', magnitude: 'Tactical', score: 69 },
    channels: ['Email', 'Sales Outreach', 'Product Demo'],
    owner: 'Emily Zhang',
    targetStages: ['Expansion'],
    pillar: 'Revenue Growth',
    persona: ['VP Product', 'CFO'],
    accounts: []
  }
];

export const DATASET: RoadmapDataset = {
  threads: THREADS,
  accounts: ACCOUNTS,
  plays: PLAYS
};
