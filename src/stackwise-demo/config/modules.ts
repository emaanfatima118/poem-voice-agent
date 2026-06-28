import { LucideIcon, Home, Lightbulb, Activity, Brush, Settings, BookOpen } from 'lucide-react'

export interface ModuleStep {
  id: string
  label: string
  description?: string
}

export interface ModuleFeature {
  id: string
  label: string
  path: string
  description?: string
  steps?: ModuleStep[]
  hasToggleInfo?: boolean
}

export interface Module {
  id: string
  label: string
  path: string
  icon: LucideIcon
  color: string
  gradient?: string
  features?: ModuleFeature[]
}

export const modules: Module[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/',
    icon: Home,
    color: '#6218df',
  },
  {
    id: 'strategy-studio',
    label: 'Strategy Studio',
    path: '/strategy-studio',
    icon: Lightbulb,
    color: '#6218df',
    gradient: 'from-[#6218df] via-[#c009ba] to-[#1e40f2]',
    features: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        path: '/strategy-studio/onboarding',
        steps: [
          { id: 'foundations', label: 'Foundations', description: 'Build your marketing strategy foundation' },
          { id: 'gtm-motions', label: 'GTM Motions', description: 'Define your go-to-market approach' },
          { id: 'channels', label: 'Channels', description: 'Select your marketing channels' },
          { id: 'finalize', label: 'Finalize', description: 'Review and export your strategy' },
        ],
      },
      {
        id: 'stack-navigator',
        label: 'Stack Navigator',
        path: '/strategy-studio/stack-navigator',
        description: 'Evaluation Matrix + 30/60/90 Milestones',
        steps: [
          { id: 'eval-matrix', label: 'Eval Matrix', description: 'Priority and risk routing' },
          { id: '30-60-90', label: '30/60/90', description: 'Quarterly milestones' },
          { id: 'stacks', label: 'Stacks', description: 'View-only asset library' },
          { id: 'my-plays', label: 'My Plays', description: 'Strategic idea collection' },
          { id: 'ad-tracking', label: 'Ad Tracking URLs', description: 'UTM & QR code generation' },
        ],
      },
      {
        id: 'quarterly-review',
        label: 'Quarterly Review & Refresh',
        path: '/strategy-studio/quarterly-review',
        steps: [
          { id: 'review-prep', label: 'Review Prep', description: 'Pre-review staging and readiness' },
          { id: 'cycle-overview', label: 'Cycle Overview', description: 'Review quarterly performance' },
          { id: 'quarterly-goals', label: 'Quarterly Goals', description: 'Set quarterly objectives' },
          { id: 'budget-adjustment', label: 'Budget Adjustment Review', description: 'Adjust budget allocation' },
          { id: 'finalize', label: 'Finalize', description: 'Complete review process' },
        ],
      },
      {
        id: 'quarterly-strategy-call',
        label: 'Quarterly Strategy Call',
        path: '/strategy-studio/quarterly-strategy-call',
        description: 'Fully Stacked only',
        steps: [
          { id: 'overview', label: 'Overview' },
          { id: 'qoq-trends', label: 'QoQ Trends' },
          { id: 'insights', label: 'Insights' },
          { id: 'notes-actions', label: 'Notes + Action Items' },
          { id: 'archive', label: 'Archive' },
        ],
      },
      {
        id: 'annual-setup',
        label: 'Annual Setup',
        path: '/strategy-studio/annual-setup',
        description: 'Annual business goals and planning',
        steps: [
          { id: 'review-prep', label: 'Review Prep', description: 'Prepare for annual review' },
          { id: 'annual-goals', label: 'Annual Setup', description: 'Define annual business goals' },
        ],
      },
      {
        id: 'budget',
        label: 'Budget',
        path: '/strategy-studio/budget',
        description: 'Budget allocation and tracking',
        steps: [
          { id: 'budget', label: 'Budget Allocation', description: 'Set annual budget and allocations' },
          { id: 'channels', label: 'Channel Focus', description: 'Define channel strategy' },
          { id: 'spend-tracking', label: 'Spend Tracking', description: 'Track actual spend vs. budget' },
          { id: 'reallocation-center', label: 'Reallocation Center', description: 'Manage budget reallocation requests' },
          { id: 'executive-insight', label: 'Executive Insight', description: 'Strategic budget insights and recommendations' },
        ],
      },
    ],
  },
  {
    id: 'pulse-hub',
    label: 'Pulse Hub',
    path: '/pulse-hub',
    icon: Activity,
    color: '#6218df',
    features: [
      {
        id: 'audit',
        label: 'Audit',
        path: '/pulse-hub/audit',
      },
      {
        id: 'analytics-intelligence',
        label: 'Analytics and Intelligence',
        path: '/pulse-hub/analytics-intelligence',
        description: 'Data insights and AI recommendations',
      },
      {
        id: 'roadmaps-connections',
        label: 'Roadmaps & Connections',
        path: '/pulse-hub/roadmaps-connections',
        description: 'Strategic Thread & Impact Horizon',
      },
      {
        id: 'abm-command-center',
        label: 'ABM Command Center',
        path: '/pulse-hub/abm-command-center',
      },
      {
        id: 'competitor-analysis',
        label: 'Competitor Analysis & Benchmarking',
        path: '/pulse-hub/competitor-analysis',
      },
      {
        id: 'leadership-sales-reports',
        label: 'Leadership + Sales Reports',
        path: '/pulse-hub/leadership-sales-reports',
      },
      {
        id: 'gtm-test-pit',
        label: 'GTM Test Pit',
        path: '/pulse-hub/gtm-test-pit',
        description: 'Model, compare, and optimize your GTM strategy',
      },
    ],
  },
  {
    id: 'brand-craft',
    label: 'Brand Craft',
    path: '/brand-craft',
    icon: Brush,
    color: '#c009ba',
    features: [
      {
        id: 'messaging-house',
        label: 'Messaging House',
        path: '/brand-craft/messaging-house',
      },
      {
        id: 'content-strategy',
        label: 'Content Strategy',
        path: '/brand-craft/content-strategy',
        steps: [
          { id: 'goals-objectives', label: 'Goals & Objectives' },
          { id: 'audiences-personas', label: 'Audiences & Personas' },
          { id: 'content-identification-gaps', label: 'Content Audit + Gap Analysis' },
          { id: 'journey-mapping', label: 'Journey Mapping' },
          { id: 'content-channel-planning', label: 'Content Planning' },
          { id: 'generate-strategy', label: 'Generate Strategy' },
        ],
      },
      {
        id: 'keyword-research',
        label: 'Keyword Research',
        path: '/brand-craft/keyword-research',
        steps: [
          { id: 'source-seed', label: 'Source & Seed' },
          { id: 'keyword-analysis', label: 'Keyword Analysis' },
          { id: 'topic-clusters', label: 'Topic Clusters' },
          { id: 'summary', label: 'Summary' },
        ],
      },
      {
        id: 'content-creation',
        label: 'Content Creation',
        path: '/brand-craft/content-creation',
        steps: [
          { id: 'brief', label: 'Brief' },
          { id: 'alignment', label: 'Alignment' },
          { id: 'draft-approvals', label: 'Draft & Approvals' },
        ],
      },
      {
        id: 'campaign-builder',
        label: 'Campaign Builder',
        path: '/brand-craft/campaign-builder',
        steps: [
          { id: 'brief', label: 'Brief' },
          { id: 'assets', label: 'Assets' },
          { id: 'channel-placement', label: 'Channel Placement' },
        ],
      },
      {
        id: 'brand-tone-check',
        label: 'Brand Tone Check',
        path: '/brand-craft/brand-tone-check',
        steps: [
          { id: 'dashboard', label: 'Dashboard', description: 'Summary metrics and alerts' },
          { id: 'insights', label: 'Insights & Analytics', description: 'Performance trends and metrics' },
        ],
      },
      {
        id: 'exec-visibility',
        label: 'Thought Leadership & Executive Visibility',
        path: '/brand-craft/exec-visibility',
        steps: [
          { id: 'overview', label: 'Overview', description: 'Program metrics and analytics' },
          { id: 'create-edit', label: 'Create & Edit Executives', description: 'Persona and tone mapping' },
          { id: 'content-calendar', label: 'Content Calendar', description: 'Content planning and timeline management' },
          { id: 'review', label: 'Review & Approve', description: 'Voice check and approval workflow' },
          { id: 'analytics', label: 'Analytics', description: 'Program and executive performance' },
        ],
      },
    ],
  },
  {
    id: 'flight-deck',
    label: 'Flight Deck',
    path: '/flight-deck',
    icon: Settings,
    color: '#1e40f2',
    features: [
      {
        id: 'flight-board',
        label: 'Flight Board',
        path: '/flight-deck/flight-board',
        description: 'Monitor live campaigns',
      },
      {
        id: 'campaign-insights',
        label: 'Campaign Insights',
        path: '/flight-deck/campaign-insights',
      },
      {
        id: 'content-calendar',
        label: 'Content & Campaign Calendar',
        path: '/flight-deck/content-calendar',
      },
      {
        id: 'budget',
        label: 'Spend Tracking',
        path: '/flight-deck/budget',
        description: 'Set in Strategy Studio, managed here',
      },
      {
        id: 'audience-engine',
        label: 'Audience Engine',
        path: '/flight-deck/audience-engine',
        description: 'Fully Stacked only',
      },
      {
        id: 'distribute',
        label: 'Scheduling',
        path: '/flight-deck/distribute',
      },
      {
        id: 'collaboration-workflows',
        label: 'Collaboration + Workflows',
        path: '/flight-deck/collaboration-workflows',
      },
      {
        id: 'asset-management',
        label: 'Asset Management',
        path: '/flight-deck/asset-management',
      },
    ],
  },
]

export const resourcesLink = {
  id: 'resources',
  label: 'Resources',
  path: '/resources',
  icon: BookOpen,
}

// Helper functions
export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id)
}

export function getFeatureByPath(path: string): { module: Module; feature: ModuleFeature } | undefined {
  for (const module of modules) {
    if (module.features) {
      const feature = module.features.find(f => f.path === path)
      if (feature) {
        return { module, feature }
      }
    }
  }
  return undefined
}

export function getModuleColor(moduleId: string): string {
  const module = getModuleById(moduleId)
  return module?.color || '#6218df'
}
