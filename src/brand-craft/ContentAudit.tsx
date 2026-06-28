"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/config/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, Filter, Target, Brain, Lightbulb, ChevronDown, ChevronUp, 
  Save, Send, AlertTriangle, Upload, Search, FileText, TrendingUp,
  AlertCircle, CheckCircle2, RefreshCw, Download, Star, ArrowRight,
  Eye, Edit3, Sparkles, Plus
} from 'lucide-react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

type Step = 'audit' | 'competitors' | 'gaps' | 'action-plan'

interface ContentPiece {
  id: string
  name: string
  score: number
  persona: string
  stage: string
  pillar: string
  suggestion: string
  refreshNeeded: boolean
  impact: string
  ctr: string
  avgTime: string
  bounce: string
}

interface Competitor {
  id: string
  name: string
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  keywords: string[]
  strategy: string
  beatPlan: string[]
}

interface Gap {
  id: string
  area: string
  context: string
  actions: string[]
  priority: 'high' | 'medium' | 'low'
}

export default function ContentAudit() {
  const module = getModuleById('brand-craft')
  const feature = module?.features?.find(f => f.id === 'content-audit')
  const moduleColor = '#c009ba'

  const [currentStep, setCurrentStep] = useState<Step>('audit')
  const [expandedPiece, setExpandedPiece] = useState<string | null>(null)
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null)
  const [expandedGap, setExpandedGap] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  
  // Filter states
  const [filters, setFilters] = useState({
    persona: '',
    stage: '',
    goal: '',
    pillar: '',
    subtopic: '',
    campaign: ''
  })

  // Mock data
  const personas = ['Lab Manager', 'Ops Lead', 'EHS Director', 'C-Suite Executive']
  const stages = ['Awareness', 'Consideration', 'Conversion', 'Retention']
  const goals = ['Inbound Leads', 'Thought Leadership', 'Engagement', 'Retention']
  const pillars = ['Sustainability', 'EHS Compliance', 'Operational Efficiency', 'Innovation']
  const subtopics = ['Waste Management', 'Green Safety', 'Lab Efficiency', 'Cost Optimization']
  const campaigns = ['Q1 Awareness', 'ROI Calculator Launch', 'Sustainability Push', 'Compliance Update']

  const overallHealth = 82
  const totalPieces = 47
  const needsRefresh = 8

  const alerts = [
    { id: '1', message: '3 pieces flagged for outdated stats or visuals', action: 'Review and refresh visuals + update links', severity: 'medium' },
    { id: '2', message: 'SEO performance drop in "Green Labs" blogs', action: 'Audit metadata, update keywords, improve internal linking', severity: 'high' },
    { id: '3', message: '5 pieces missing CTAs or conversion paths', action: 'Add strategic CTAs aligned with buyer journey', severity: 'medium' },
  ]

  const contentPieces: ContentPiece[] = [
    { 
      id: '1', 
      name: 'Waste Management Best Practices', 
      score: 85, 
      persona: 'Lab Manager',
      stage: 'Awareness',
      pillar: 'Sustainability',
      suggestion: 'Add cost-benefit data, customer quote, and ROI calculator link.',
      refreshNeeded: true,
      impact: 'Medium lift, high impact',
      ctr: '+8%',
      avgTime: '2:45',
      bounce: '34%'
    },
    { 
      id: '2', 
      name: 'Eco Waste FAQ', 
      score: 65, 
      persona: 'Ops Lead',
      stage: 'Consideration',
      pillar: 'Sustainability',
      suggestion: 'Update for 2025 standards and add internal links to case studies.',
      refreshNeeded: true,
      impact: 'Low lift, moderate impact',
      ctr: '-3%',
      avgTime: '1:32',
      bounce: '52%'
    },
    { 
      id: '3', 
      name: 'EHS Compliance Guide', 
      score: 92, 
      persona: 'EHS Director',
      stage: 'Consideration',
      pillar: 'EHS Compliance',
      suggestion: 'Strong performer. Add video walkthrough for enhanced engagement.',
      refreshNeeded: false,
      impact: 'Low lift, high impact',
      ctr: '+15%',
      avgTime: '4:12',
      bounce: '22%'
    },
  ]

  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'EcoWaste Labs',
      score: 87,
      summary: 'Leading in sustainability storytelling, lagging in conversion optimization.',
      strengths: ['Thought leadership content', 'Strong SEO performance', 'Regular blog cadence (3x/week)'],
      weaknesses: ['Weak CTAs on landing pages', 'Outdated gated content', 'Limited video content'],
      opportunities: ['ROI calculators', 'Interactive webinars', 'Customer success stories'],
      threats: ['Emerging startups in sustainability tech', 'AI-powered compliance tools'],
      keywords: ['lab waste reduction', 'eco-friendly compliance', 'green laboratory practices'],
      strategy: 'Develop interactive tools and explainer videos to strengthen conversion. Target sustainability keywords and crosslink to gated tools.',
      beatPlan: [
        'Launch Sustainability Benchmark Guide (whitepaper)',
        'Refresh landing page visuals with modern design',
        'Expand LinkedIn thought leadership on eco compliance',
        'Host quarterly webinars with industry partners'
      ]
    },
    {
      id: '2',
      name: 'SafeLab Solutions',
      score: 78,
      summary: 'Strong in compliance content, weak in awareness-stage materials.',
      strengths: ['Comprehensive compliance guides', 'Strong brand recognition', 'Active trade show presence'],
      weaknesses: ['Limited top-of-funnel content', 'Slow content publishing pace', 'Minimal social media presence'],
      opportunities: ['Thought leadership blog series', 'Video tutorials', 'LinkedIn expansion'],
      threats: ['Digital-first competitors', 'Content marketing maturity gap'],
      keywords: ['lab safety compliance', 'EHS regulations', 'workplace safety standards'],
      strategy: 'Dominate top-of-funnel with educational content series and video tutorials.',
      beatPlan: [
        'Create "Safety Compliance 101" video series',
        'Launch weekly LinkedIn tips campaign',
        'Develop interactive compliance checklist tool',
        'Partner with industry influencers for content'
      ]
    },
  ]

  const gaps: Gap[] = [
    {
      id: '1',
      area: 'Awareness → Sustainability',
      context: 'Facility managers care about cost savings, compliance, and reputation. Current content lacks ROI focus.',
      actions: [
        'Create 3–5 short Sustainability Explainer videos showing cost-saving examples',
        'Add visuals displaying ROI and safety compliance data',
        'Target search terms: sustainable waste management, green facility checklist',
        'Include interactive checklist PDFs post-video'
      ],
      priority: 'high'
    },
    {
      id: '2',
      area: 'Consideration → EHS Compliance',
      context: 'Decision-makers need comparison frameworks and proof points. Missing competitive comparison content.',
      actions: [
        'Develop "EHS Solutions Comparison Guide" (us vs. competitors)',
        'Add customer testimonials and case study videos',
        'Create ROI calculator specifically for compliance savings',
        'Build comparison matrix showing feature advantages'
      ],
      priority: 'high'
    },
    {
      id: '3',
      area: 'Conversion → All Pillars',
      context: 'Strong top/middle funnel, but conversion content lacks urgency and clear next steps.',
      actions: [
        'Strengthen CTAs across all bottom-funnel content',
        'Add "Book Demo" and "Get ROI Report" CTAs',
        'Create urgency with limited-time assessment offers',
        'Implement exit-intent popups with value propositions'
      ],
      priority: 'medium'
    },
  ]

  const leftNav = (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-lg font-bold mb-1" style={{ color: moduleColor }}>
        {module?.label}
      </h2>
      <p className="text-xs text-muted-foreground mb-4">{feature?.label}</p>
    </div>
  )

  const contentAuditSteps = [
    { id: 'audit', label: 'Audit', description: 'Inventory and health analysis' },
    { id: 'competitors', label: 'Competitors', description: 'Competitive intelligence' },
    { id: 'gaps', label: 'Gaps', description: 'Strategic gap identification' },
    { id: 'action-plan', label: 'Action Plan', description: 'Prioritized recommendations' }
  ]

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getHealthColor = (score: number) => {
    if (score >= 76) return '#22c55e'
    if (score >= 51) return '#f59e0b'
    return '#ef4444'
  }

  const mainContent = (
    <div className="space-y-6 p-8">
      <AnimatePresence mode="wait">
        {/* STEP 1: Audit */}
        {currentStep === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Content Inventory & Health</h1>
                <p className="text-muted-foreground">Analyze your content library performance and identify refresh opportunities</p>
              </div>
            </div>

            {/* Coaching Prompt */}
            <Card className="border-l-4 mb-6" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">📊 Content Audit Best Practices</p>
                    <p className="text-muted-foreground">
                      A healthy content library drives consistent results. Look for content with declining performance, 
                      outdated information, or misalignment with current messaging. Use filters to segment by persona, 
                      stage, or pillar. <strong>Pro tip:</strong> Content scoring below 70 typically needs refresh or 
                      retirement. Flag high-potential pieces for the Evaluation Matrix.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 size={20} style={{ color: moduleColor }} />
                    <span className="text-2xl font-bold" style={{ color: getHealthColor(overallHealth) }}>
                      {overallHealth}%
                    </span>
                  </div>
                  <Progress value={overallHealth} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Overall Health Score</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText size={20} style={{ color: moduleColor }} />
                    <span className="text-2xl font-bold">{totalPieces}</span>
                  </div>
                  <div className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Total Content Pieces</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <RefreshCw size={20} className="text-orange-500" />
                    <span className="text-2xl font-bold text-orange-500">{needsRefresh}</span>
                  </div>
                  <div className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Needs Refresh</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    <span className="text-2xl font-bold text-red-500">{alerts.length}</span>
                  </div>
                  <div className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Active Alerts</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <Card className="mb-6 border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle size={18} className="text-orange-500" />
                    Content Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 p-3 bg-orange-50 rounded-md">
                      <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900">{alert.message}</p>
                        <p className="text-xs text-orange-700 mt-1">Next Step: {alert.action}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upload & Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex gap-2 items-center">
                    <Input type="file" className="text-sm" data-testid="input-upload-content" />
                    <Button variant="outline" size="sm" data-testid="button-upload-content">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload for Audit
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" style={{ color: moduleColor }} data-testid="button-apply-filters">
                    <Search className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Filter size={16} style={{ color: moduleColor }} />
                  <h3 className="text-sm font-semibold">Filters</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Select value={filters.persona} onValueChange={(v) => setFilters({...filters, persona: v})}>
                    <SelectTrigger data-testid="select-filter-persona">
                      <SelectValue placeholder="Persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filters.stage} onValueChange={(v) => setFilters({...filters, stage: v})}>
                    <SelectTrigger data-testid="select-filter-stage">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filters.goal} onValueChange={(v) => setFilters({...filters, goal: v})}>
                    <SelectTrigger data-testid="select-filter-goal">
                      <SelectValue placeholder="Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filters.pillar} onValueChange={(v) => setFilters({...filters, pillar: v})}>
                    <SelectTrigger data-testid="select-filter-pillar">
                      <SelectValue placeholder="Pillar" />
                    </SelectTrigger>
                    <SelectContent>
                      {pillars.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filters.subtopic} onValueChange={(v) => setFilters({...filters, subtopic: v})}>
                    <SelectTrigger data-testid="select-filter-subtopic">
                      <SelectValue placeholder="Subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {subtopics.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filters.campaign} onValueChange={(v) => setFilters({...filters, campaign: v})}>
                    <SelectTrigger data-testid="select-filter-campaign">
                      <SelectValue placeholder="Campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Content Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentPieces.map(piece => (
                  <Card key={piece.id} className="border-l-4" style={{ borderLeftColor: getHealthColor(piece.score) }}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={selectedItems.includes(piece.id)}
                          onCheckedChange={() => toggleSelection(piece.id)}
                          data-testid={`checkbox-content-${piece.id}`}
                        />
                        <div className="flex-1">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedPiece(expandedPiece === piece.id ? null : piece.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{piece.name}</h4>
                                {piece.refreshNeeded && (
                                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                    <RefreshCw size={12} className="mr-1" />
                                    Needs Refresh
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{piece.persona}</span>
                                <span>•</span>
                                <span>{piece.stage}</span>
                                <span>•</span>
                                <span>{piece.pillar}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-2xl font-bold" style={{ color: getHealthColor(piece.score) }}>
                                  {piece.score}
                                </div>
                                <div className="text-xs text-muted-foreground">Health Score</div>
                              </div>
                              {expandedPiece === piece.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>

                          {expandedPiece === piece.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t space-y-3"
                            >
                              <div>
                                <p className="text-sm font-medium mb-1">AI Suggestion</p>
                                <p className="text-sm text-muted-foreground">{piece.suggestion}</p>
                              </div>

                              {piece.refreshNeeded && (
                                <div className="bg-orange-50 p-3 rounded-md">
                                  <p className="text-sm font-medium text-orange-900 mb-1">Refresh Impact</p>
                                  <p className="text-sm text-orange-700">{piece.impact}</p>
                                </div>
                              )}

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">CTR Change</p>
                                  <p className="text-sm font-semibold">{piece.ctr}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Avg. Time</p>
                                  <p className="text-sm font-semibold">{piece.avgTime}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Bounce Rate</p>
                                  <p className="text-sm font-semibold">{piece.bounce}</p>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" style={{ color: moduleColor }} data-testid={`button-eval-matrix-${piece.id}`}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Send to Eval Matrix
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`button-export-${piece.id}`}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Export Analysis
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-save-audit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
                <Button size="sm" style={{ backgroundColor: moduleColor, color: 'white' }} data-testid="button-next-competitors">
                  Next: Competitors
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Competitors */}
        {currentStep === 'competitors' && (
          <motion.div
            key="competitors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Competitive Intelligence</h1>
                <p className="text-muted-foreground">Analyze competitor content strategies and identify opportunities to win</p>
              </div>
              <Button variant="outline" size="sm" data-testid="button-add-competitor">
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </div>

            {/* Coaching Prompt */}
            <Card className="border-l-4 mb-6" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Brain size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">🎯 Competitive Analysis Strategy</p>
                    <p className="text-muted-foreground">
                      Understanding your competitors' content strategies reveals gaps you can exploit. Focus on their 
                      <strong> strengths</strong> (what's working for them), <strong>weaknesses</strong> (where you can 
                      differentiate), <strong>opportunities</strong> (what they're missing), and <strong>threats</strong> 
                      (what they might do next). Use this intelligence to build your "beat plan"—specific tactics to 
                      outperform them in search, engagement, and conversion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitors List */}
            <div className="space-y-6">
              {competitors.map(competitor => (
                <Card key={competitor.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover-elevate"
                    onClick={() => setExpandedCompetitor(expandedCompetitor === competitor.id ? null : competitor.id)}
                    style={{ backgroundColor: `${moduleColor}10` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedItems.includes(competitor.id)}
                          onCheckedChange={() => toggleSelection(competitor.id)}
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`checkbox-competitor-${competitor.id}`}
                        />
                        <div>
                          <CardTitle className="text-lg">{competitor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{competitor.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: getHealthColor(competitor.score) }}>
                            {competitor.score}
                          </div>
                          <div className="text-xs text-muted-foreground">Content Score</div>
                        </div>
                        {expandedCompetitor === competitor.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </CardHeader>

                  {expandedCompetitor === competitor.id && (
                    <CardContent className="pt-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {/* SWOT Analysis */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Target size={16} style={{ color: moduleColor }} />
                            SWOT Analysis
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-green-50 border-green-200">
                              <CardContent className="pt-4">
                                <h4 className="font-semibold text-sm mb-2 text-green-900">Strengths</h4>
                                <ul className="text-sm space-y-1">
                                  {competitor.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-green-700">
                                      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
                                      <span>{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-red-50 border-red-200">
                              <CardContent className="pt-4">
                                <h4 className="font-semibold text-sm mb-2 text-red-900">Weaknesses</h4>
                                <ul className="text-sm space-y-1">
                                  {competitor.weaknesses.map((w, i) => (
                                    <li key={i} className="flex items-start gap-2 text-red-700">
                                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                      <span>{w}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-blue-50 border-blue-200">
                              <CardContent className="pt-4">
                                <h4 className="font-semibold text-sm mb-2 text-blue-900">Opportunities</h4>
                                <ul className="text-sm space-y-1">
                                  {competitor.opportunities.map((o, i) => (
                                    <li key={i} className="flex items-start gap-2 text-blue-700">
                                      <TrendingUp size={14} className="flex-shrink-0 mt-0.5" />
                                      <span>{o}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-orange-50 border-orange-200">
                              <CardContent className="pt-4">
                                <h4 className="font-semibold text-sm mb-2 text-orange-900">Threats</h4>
                                <ul className="text-sm space-y-1">
                                  {competitor.threats.map((t, i) => (
                                    <li key={i} className="flex items-start gap-2 text-orange-700">
                                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                                      <span>{t}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Target Keywords */}
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">Target Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {competitor.keywords.map((kw, i) => (
                              <Badge key={i} variant="outline" style={{ borderColor: moduleColor, color: moduleColor }}>
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Beat Strategy */}
                        <div>
                          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                            <Sparkles size={16} style={{ color: moduleColor }} />
                            Recommended Beat Strategy
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{competitor.strategy}</p>
                          <Card className="bg-purple-50 border-purple-200">
                            <CardContent className="pt-4">
                              <h4 className="font-semibold text-sm mb-2 text-purple-900">Beat Plan</h4>
                              <ol className="text-sm space-y-2">
                                {competitor.beatPlan.map((step, i) => (
                                  <li key={i} className="flex gap-2 text-purple-700">
                                    <span className="font-semibold">{i + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" style={{ color: moduleColor }} data-testid={`button-add-beat-plan-${competitor.id}`}>
                            <Star className="h-4 w-4 mr-2" />
                            Add Beat Plan to Action Items
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-export-competitor-${competitor.id}`}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Analysis
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6">
              <div className="text-sm text-muted-foreground">
                {selectedItems.length} competitor{selectedItems.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('audit')} data-testid="button-back-audit">
                  Back to Audit
                </Button>
                <Button size="sm" style={{ backgroundColor: moduleColor, color: 'white' }} data-testid="button-next-gaps">
                  Next: Gaps
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Gaps */}
        {currentStep === 'gaps' && (
          <motion.div
            key="gaps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Strategic Gap Analysis</h1>
                <p className="text-muted-foreground">Identify content gaps and prioritize opportunities across the buyer journey</p>
              </div>
            </div>

            {/* Coaching Prompt */}
            <Card className="border-l-4 mb-6" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">🔍 Identifying Strategic Gaps</p>
                    <p className="text-muted-foreground">
                      Content gaps occur when your library doesn't address key audience questions at critical journey stages. 
                      Look for gaps in <strong>persona coverage</strong> (are you speaking to all decision-makers?), 
                      <strong>funnel stages</strong> (missing awareness or conversion content?), and <strong>content types</strong> 
                      (need more video, interactive tools?). Prioritize gaps that align with business goals and competitive opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gap Cards */}
            <div className="space-y-4">
              {gaps.map(gap => (
                <Card 
                  key={gap.id} 
                  className="border-l-4"
                  style={{ 
                    borderLeftColor: gap.priority === 'high' ? '#ef4444' : gap.priority === 'medium' ? '#f59e0b' : '#22c55e' 
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={selectedItems.includes(gap.id)}
                        onCheckedChange={() => toggleSelection(gap.id)}
                        data-testid={`checkbox-gap-${gap.id}`}
                      />
                      <div className="flex-1">
                        <div 
                          className="flex items-center justify-between cursor-pointer mb-3"
                          onClick={() => setExpandedGap(expandedGap === gap.id ? null : gap.id)}
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{gap.area}</h3>
                            <Badge 
                              variant="outline" 
                              className={
                                gap.priority === 'high' 
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : gap.priority === 'medium'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }
                            >
                              {gap.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          {expandedGap === gap.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>

                        <div className="bg-muted/30 p-3 rounded-md mb-3">
                          <p className="text-sm text-muted-foreground">{gap.context}</p>
                        </div>

                        {expandedGap === gap.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3"
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Recommended Actions</h4>
                              <ul className="space-y-2">
                                {gap.actions.map((action, i) => (
                                  <li key={i} className="flex gap-2 text-sm">
                                    <span className="font-semibold" style={{ color: moduleColor }}>{i + 1}.</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" style={{ color: moduleColor }} data-testid={`button-add-to-plan-${gap.id}`}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Action Plan
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`button-create-brief-${gap.id}`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Create Content Brief
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6">
              <div className="text-sm text-muted-foreground">
                {selectedItems.length} gap{selectedItems.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('competitors')} data-testid="button-back-competitors">
                  Back to Competitors
                </Button>
                <Button size="sm" style={{ backgroundColor: moduleColor, color: 'white' }} data-testid="button-next-action-plan">
                  Next: Action Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Action Plan */}
        {currentStep === 'action-plan' && (
          <motion.div
            key="action-plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Prioritized Action Plan</h1>
                <p className="text-muted-foreground">Consolidated recommendations ready for execution</p>
              </div>
            </div>

            {/* Coaching Prompt */}
            <Card className="border-l-4 mb-6" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Sparkles size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">✅ From Analysis to Action</p>
                    <p className="text-muted-foreground">
                      Your Action Plan consolidates audit findings, competitive insights, and gap analysis into prioritized 
                      next steps. <strong>High-impact items</strong> should be tackled first—these are quick wins with 
                      measurable ROI. Use "Send to Eval Matrix" to track progress, or export to share with stakeholders. 
                      Remember: great strategy without execution is just planning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
              <CardHeader style={{ backgroundColor: `${moduleColor}10` }}>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target size={18} style={{ color: moduleColor }} />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* High Priority Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <h3 className="font-semibold text-sm">High Priority</h3>
                    </div>
                    <ul className="space-y-2 ml-5">
                      <li className="flex items-start gap-3 p-3 bg-red-50 rounded-md">
                        <Checkbox data-testid="checkbox-action-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Refresh "Waste Management Best Practices" with updated ROI data and customer visuals</p>
                          <p className="text-xs text-muted-foreground mt-1">Impact: Medium lift, high impact • Est. Time: 4-6 hours</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-red-50 rounded-md">
                        <Checkbox data-testid="checkbox-action-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Create 3–5 Sustainability Explainer videos showing cost-saving examples</p>
                          <p className="text-xs text-muted-foreground mt-1">Impact: High lift, high impact • Est. Time: 2-3 weeks</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-red-50 rounded-md">
                        <Checkbox data-testid="checkbox-action-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Implement Beat Plan vs EcoWaste Labs (target keywords: lab waste reduction, eco-friendly compliance)</p>
                          <p className="text-xs text-muted-foreground mt-1">Impact: High lift, high impact • Est. Time: Ongoing</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Medium Priority Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <h3 className="font-semibold text-sm">Medium Priority</h3>
                    </div>
                    <ul className="space-y-2 ml-5">
                      <li className="flex items-start gap-3 p-3 bg-orange-50 rounded-md">
                        <Checkbox data-testid="checkbox-action-4" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Fix SEO on "Green Labs" articles: improve meta titles, update keywords</p>
                          <p className="text-xs text-muted-foreground mt-1">Impact: Medium lift, medium impact • Est. Time: 2-3 hours</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-orange-50 rounded-md">
                        <Checkbox data-testid="checkbox-action-5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Strengthen CTAs across all bottom-funnel content with urgency and clear next steps</p>
                          <p className="text-xs text-muted-foreground mt-1">Impact: Low lift, medium impact • Est. Time: 1-2 days</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                  <Button size="sm" style={{ backgroundColor: moduleColor, color: 'white' }} data-testid="button-send-selected-eval">
                    <Star className="h-4 w-4 mr-2" />
                    Send Selected to Eval Matrix
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-send-all-eval">
                    <Send className="h-4 w-4 mr-2" />
                    Send All to Eval Matrix
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-export-plan">
                    <Download className="h-4 w-4 mr-2" />
                    Export Action Plan
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-create-campaign">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign from Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-muted/30 border rounded-md text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Once actions are complete, re-run this audit in 60-90 days to measure improvement 
              and identify new opportunities. Great content strategies are iterative.
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep('gaps')} data-testid="button-back-gaps">
                Back to Gaps
              </Button>
              <Button size="sm" style={{ backgroundColor: moduleColor, color: 'white' }} data-testid="button-complete-audit">
                <Save className="h-4 w-4 mr-2" />
                Save & Complete Audit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={contentAuditSteps}
      currentStep={currentStep}
      onStepChange={(stepId) => setCurrentStep(stepId as Step)}
      content={mainContent}
      moduleColor={moduleColor}
      featureName="Content Audit & Gap Analysis"
    />
  )
}
