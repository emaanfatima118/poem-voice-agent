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
          { id: 'recipes', label: 'Recipes', description: 'Choose campaign recipes' },
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
          { id: 'finalize', label: 'Finalize', description: 'Complete review process' },
          { id: 'budget-adjustment', label: 'Budget Adjustment Review', description: 'Adjust budget allocation' },
          { id: 'next-moves', label: 'Next Moves', description: 'Plan next quarter actions' },
          { id: 'quarterly-goals', label: 'Quarterly Goals', description: 'Set quarterly objectives' },
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
          { id: 'call-notes', label: 'Call Notes' },
          { id: 'action-items', label: 'Action Items' },
          { id: 'insights', label: 'Insights' },
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
          { id: 'content-identification-gaps', label: 'Content Identification & Gaps' },
          { id: 'journey-mapping', label: 'Journey Mapping' },
          { id: 'content-type-planning', label: 'Content Type Planning' },
          { id: 'content-channel-planning', label: 'Content Channel Planning' },
          { id: 'activation-grid', label: 'Activation Grid' },
          { id: 'generate-strategy', label: 'Generate Strategy' },
        ],
      },
      {
        id: 'keyword-research',
        label: 'Keyword Research',
        path: '/brand-craft/keyword-research',
        steps: [
          { id: 'purpose', label: 'Purpose' },
          { id: 'source-seed', label: 'Source & Seed' },
          { id: 'keyword-analysis', label: 'Keyword Analysis' },
          { id: 'keyword-content-alignment', label: 'Keyword & Content Alignment' },
          { id: 'topic-clusters', label: 'Topic Clusters' },
          { id: 'outputs-integrations', label: 'Outputs & Integrations' },
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
          { id: 'creative', label: 'Creative' },
        ],
      },
      {
        id: 'content-audit',
        label: 'Content Audit & Gap Analysis',
        path: '/brand-craft/content-audit',
        description: 'Brand & Competitors',
      },
      {
        id: 'brand-voice-enforcement',
        label: 'Brand Voice Enforcement',
        path: '/brand-craft/brand-voice-enforcement',
        steps: [
          { id: 'dashboard', label: 'Dashboard', description: 'Summary metrics and alerts' },
          { id: 'overview', label: 'Overview', description: 'Insights preview by dimension' },
          { id: 'insights-preview', label: 'Insights Preview', description: 'Detailed voice analysis' },
          { id: 'create-edit', label: 'Create & Edit', description: 'Executive-to-tone mapping' },
        ],
      },
      {
        id: 'exec-visibility',
        label: 'Thought Leadership & Executive Visibility',
        path: '/brand-craft/exec-visibility',
        steps: [
          { id: 'overview', label: 'Overview', description: 'Program metrics and analytics' },
          { id: 'create-edit', label: 'Create & Edit Executives', description: 'Persona and tone mapping' },
          { id: 'plan-pipeline', label: 'Plan & Pipeline', description: 'Content planning and POV management' },
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
        id: 'content-calendar',
        label: 'Content & Campaign Calendar',
        path: '/flight-deck/content-calendar',
      },
      {
        id: 'distribution',
        label: 'Distribution',
        path: '/flight-deck/distribution',
      },
      {
        id: 'budget',
        label: 'Budget',
        path: '/flight-deck/budget',
        description: 'Set in Strategy Studio, managed here',
      },
      {
        id: 'asset-management',
        label: 'Asset Management',
        path: '/flight-deck/asset-management',
      },
      {
        id: 'collaboration-tools',
        label: 'Collaboration Tools & Workflows',
        path: '/flight-deck/collaboration-tools',
      },
      {
        id: 'campaign-insights',
        label: 'Campaign Insights',
        path: '/flight-deck/campaign-insights',
      },
      {
        id: 'personalization-engine',
        label: 'Personalization Engine',
        path: '/flight-deck/personalization-engine',
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

