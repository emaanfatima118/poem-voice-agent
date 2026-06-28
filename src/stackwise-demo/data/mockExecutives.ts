// Mock data for executives across Stackwise
// Pulled from Brand Craft Exec Visibility feature

export interface Executive {
  id: string;
  name: string;
  title: string;
  department: string;
  linkedinUrl?: string;
  photoUrl?: string;
}

export const MOCK_EXECUTIVES: Executive[] = [
  {
    id: 'exec-1',
    name: 'Sarah Chen',
    title: 'Chief Executive Officer',
    department: 'Executive',
  },
  {
    id: 'exec-2',
    name: 'Michael Torres',
    title: 'Chief Marketing Officer',
    department: 'Marketing',
  },
  {
    id: 'exec-3',
    name: 'Jennifer Park',
    title: 'VP of Product',
    department: 'Product',
  },
  {
    id: 'exec-4',
    name: 'David Kim',
    title: 'VP of Sales',
    department: 'Sales',
  },
  {
    id: 'exec-5',
    name: 'Rachel Stevens',
    title: 'Chief Financial Officer',
    department: 'Finance',
  },
  {
    id: 'exec-6',
    name: 'James Rodriguez',
    title: 'VP of Engineering',
    department: 'Engineering',
  },
];

export interface Pillar {
  id: string;
  name: string;
  description: string;
}

export const MOCK_PILLARS: Pillar[] = [
  {
    id: 'pillar-1',
    name: 'Thought Leadership',
    description: 'Establish brand authority and industry expertise',
  },
  {
    id: 'pillar-2',
    name: 'Product Innovation',
    description: 'Showcase product capabilities and competitive advantages',
  },
  {
    id: 'pillar-3',
    name: 'Customer Success',
    description: 'Highlight customer outcomes and case studies',
  },
  {
    id: 'pillar-4',
    name: 'Industry Insights',
    description: 'Provide market analysis and trend forecasting',
  },
];

export interface Goal {
  id: string;
  name: string;
  category: 'awareness' | 'consideration' | 'conversion' | 'retention';
}

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-1',
    name: 'Increase brand awareness',
    category: 'awareness',
  },
  {
    id: 'goal-2',
    name: 'Generate qualified leads',
    category: 'consideration',
  },
  {
    id: 'goal-3',
    name: 'Drive product demos',
    category: 'conversion',
  },
  {
    id: 'goal-4',
    name: 'Increase customer retention',
    category: 'retention',
  },
  {
    id: 'goal-5',
    name: 'Expand market share',
    category: 'awareness',
  },
  {
    id: 'goal-6',
    name: 'Accelerate sales cycles',
    category: 'consideration',
  },
];

export interface ContentType {
  id: string;
  name: string;
  channel: string;
}

export const MOCK_CONTENT_TYPES: ContentType[] = [
  { id: 'content-1', name: 'Blog Posts', channel: 'web' },
  { id: 'content-2', name: 'Whitepapers', channel: 'web' },
  { id: 'content-3', name: 'Case Studies', channel: 'web' },
  { id: 'content-4', name: 'LinkedIn Posts', channel: 'linkedin' },
  { id: 'content-5', name: 'Email Newsletters', channel: 'email' },
  { id: 'content-6', name: 'Webinars', channel: 'events' },
  { id: 'content-7', name: 'Video Content', channel: 'paid_social' },
  { id: 'content-8', name: 'Infographics', channel: 'paid_social' },
  { id: 'content-9', name: 'Podcasts', channel: 'pr' },
  { id: 'content-10', name: 'Press Releases', channel: 'pr' },
];
