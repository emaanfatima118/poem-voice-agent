import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { 
  Sparkles, Save, Filter, Star, Tag, XCircle, 
  PlusCircle, ChevronDown, ChevronRight, Layers, Trash2, Brain,
  FileText, BarChart2
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/stackwise-demo/components/ui/select'
import { TwoColumnLayout } from '@/stackwise-demo/components/layouts/TwoColumnLayout'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/stackwise-demo/components/ui/collapsible'

const moduleColor = '#c009ba' // BrandCraft pink

type Step = 'source-seed' | 'keyword-analysis' | 'topic-clusters' | 'summary'

interface Keyword {
  keyword: string
  volume: number
  intent: string
  difficulty: number
  rank: string | number
  priority: string
  trend: string
  cpc: string
  pillar: string
  stage: string
  type: string
  competitors: string
  fitScore: number
  action: string
  notes: string
}

interface Subtopic {
  id: string
  name: string
  description: string
  stage: string
  intent: string
  keywords: string[]
  relatedPages: string[]
  metrics: { volume: string; rank: number; trend: string }
}

interface Cluster {
  id: number
  name: string
  color: string
  description: string
  keywords: string[]
  relatedPages: string[]
  subtopics: Subtopic[]
}

export default function KeywordResearch() {
  const [currentStep, setCurrentStep] = useState<Step>('source-seed')
  
  // Step 1: Source & Seed
  const [context, setContext] = useState('')
  const [customContext, setCustomContext] = useState('')
  const [topic, setTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])
  const [additionalSeeds, setAdditionalSeeds] = useState('')
  const [businessKeywords, setBusinessKeywords] = useState('')
  const [audienceKeywords, setAudienceKeywords] = useState('')
  const [competitorKeywords, setCompetitorKeywords] = useState('')
  const [toolKeywords, setToolKeywords] = useState('')
  
  // Step 2: Keyword Analysis
  const [keywords, setKeywords] = useState<Keyword[]>([
    { keyword: 'ABM operations', volume: 540, intent: 'Commercial', difficulty: 45, rank: 23, priority: 'High', trend: '📈', cpc: '$3.20', pillar: 'Product Innovation', stage: 'Awareness', type: 'Blog', competitors: 'Terminus, RollWorks', fitScore: 82, action: 'Target Now', notes: 'Strong alignment with core offering' },
    { keyword: 'content strategy framework', volume: 1300, intent: 'Informational', difficulty: 38, rank: '-', priority: 'Medium', trend: '📉', cpc: '$1.90', pillar: 'Best Practices', stage: 'Consideration', type: 'Guide', competitors: 'HubSpot, SEMrush', fitScore: 67, action: 'Watch', notes: 'Monitor competition' },
    { keyword: 'pipeline acceleration tactics', volume: 720, intent: 'Transactional', difficulty: 52, rank: 45, priority: 'High', trend: '📈', cpc: '$4.10', pillar: 'Customer Success', stage: 'Conversion', type: 'Landing Page', competitors: '6sense, Demandbase', fitScore: 89, action: 'Target Now', notes: 'High conversion potential' },
    { keyword: 'thought leadership content', volume: 890, intent: 'Informational', difficulty: 41, rank: '-', priority: 'Medium', trend: '📈', cpc: '$2.30', pillar: 'Thought Leadership', stage: 'Awareness', type: 'Blog', competitors: 'LinkedIn, Forbes', fitScore: 75, action: 'Target Now', notes: 'Build authority' },
    { keyword: 'industry insights dashboard', volume: 450, intent: 'Commercial', difficulty: 48, rank: 32, priority: 'Low', trend: '📉', cpc: '$3.80', pillar: 'Industry Insights', stage: 'Consideration', type: 'Tool', competitors: 'Tableau, PowerBI', fitScore: 58, action: 'Watch', notes: 'Consider for Q2' },
    { keyword: 'competitor ABM strategy', volume: 320, intent: 'Informational', difficulty: 35, rank: '-', priority: 'Low', trend: '📈', cpc: '$1.50', pillar: 'Product Innovation', stage: 'Awareness', type: 'Blog', competitors: 'Various', fitScore: 45, action: 'Competitive Defense', notes: 'Defensive content needed' },
  ])
  
  // Step 3: Topic Clusters
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newSubKeyword, setNewSubKeyword] = useState('')
  
  const [clusters, setClusters] = useState<Cluster[]>([
    {
      id: 1,
      name: 'ABM Operations & Strategy',
      color: 'from-indigo-400 to-indigo-600',
      description: 'Keywords focused on ABM operations, frameworks, and performance measurement.',
      keywords: ['account based marketing', 'pipeline velocity', 'intent signals', 'ABM operations'],
      relatedPages: ['/abm-ops-framework', '/intent-data-playbook'],
      subtopics: [
        {
          id: '1-1',
          name: 'Intent Signal Tracking',
          description: 'Tracking and interpreting buyer intent data.',
          stage: 'Awareness',
          intent: 'Informational',
          keywords: ['buyer behavior data', '6sense signals', 'intent analysis'],
          relatedPages: ['/intent-signal-guide'],
          metrics: { volume: '3.2K', rank: 24, trend: '+18%' }
        },
        {
          id: '1-2',
          name: 'Pipeline Velocity Optimization',
          description: 'Improving deal flow and speed through ABM orchestration.',
          stage: 'Consideration',
          intent: 'Commercial',
          keywords: ['pipeline velocity', 'deal acceleration', 'pipeline acceleration tactics'],
          relatedPages: ['/pipeline-optimization', '/abm-metrics-dashboard'],
          metrics: { volume: '1.8K', rank: 32, trend: '+9%' }
        }
      ]
    },
    {
      id: 2,
      name: 'Content & Thought Leadership',
      color: 'from-pink-400 to-purple-500',
      description: 'Storytelling, brand positioning, and content strategy alignment.',
      keywords: ['brand storytelling', 'content pillars', 'thought leadership', 'content strategy framework'],
      relatedPages: ['/brand-storytelling-guide', '/content-strategy-playbook'],
      subtopics: [
        {
          id: '2-1',
          name: 'Thought Leadership Development',
          description: 'Using expertise-based content to establish authority.',
          stage: 'Awareness',
          intent: 'Informational',
          keywords: ['thought leadership content', 'executive visibility', 'industry insights'],
          relatedPages: ['/thought-leadership-tactics'],
          metrics: { volume: '3.6K', rank: 15, trend: '+15%' }
        },
        {
          id: '2-2',
          name: 'Content Strategy Framework',
          description: 'Structuring content around audience-driven themes.',
          stage: 'Consideration',
          intent: 'Commercial',
          keywords: ['content pillars', 'topic clusters', 'content mapping'],
          relatedPages: ['/content-pillar-templates', '/content-hub-framework'],
          metrics: { volume: '4.1K', rank: 19, trend: '+22%' }
        }
      ]
    }
  ])

  // Auto-populate suggested keywords based on topic/context
  useEffect(() => {
    if (topic || context) {
      const base = topic?.toLowerCase() || ''
      let auto: string[] = []
      if (base.includes('abm')) auto = ['ABM operations', 'account-based marketing', 'pipeline acceleration']
      else if (base.includes('content')) auto = ['content strategy', 'pillar content', 'topic clusters']
      else if (base.includes('seo')) auto = ['keyword analysis', 'on-page optimization', 'evergreen content']
      else auto = ['brand strategy', 'messaging alignment', 'market positioning']
      setSuggestedKeywords(auto)
    }
  }, [topic, context])

  const steps: { id: Step; label: string }[] = [
    { id: 'source-seed', label: 'Source & Seed' },
    { id: 'keyword-analysis', label: 'Keyword Analysis' },
    { id: 'topic-clusters', label: 'Topic Clusters' },
    { id: 'summary', label: '📊 Summary' },
  ]

  // Handlers
  const toggleExpand = (id: number) => setExpandedCluster(expandedCluster === id ? null : id)

  const addClusterKeyword = (clusterId: number) => {
    if (!newKeyword.trim()) return
    setClusters(clusters.map(c => c.id === clusterId ? { ...c, keywords: [...c.keywords, newKeyword.trim()] } : c))
    setNewKeyword('')
  }

  const removeClusterKeyword = (clusterId: number, keyword: string) => {
    setClusters(clusters.map(c => c.id === clusterId ? { ...c, keywords: c.keywords.filter(k => k !== keyword) } : c))
  }

  const addSubtopicKeyword = (clusterId: number, subId: string) => {
    if (!newSubKeyword.trim()) return
    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          subtopics: c.subtopics.map(s =>
            s.id === subId ? { ...s, keywords: [...s.keywords, newSubKeyword.trim()] } : s
          )
        }
      }
      return c
    }))
    setNewSubKeyword('')
  }

  const removeSubtopicKeyword = (clusterId: number, subId: string, keyword: string) => {
    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          subtopics: c.subtopics.map(s =>
            s.id === subId ? { ...s, keywords: s.keywords.filter(k => k !== keyword) } : s
          )
        }
      }
      return c
    }))
  }

  const handleGenerateClusterSuggestions = () => {
    setLoadingAI(true)
    setTimeout(() => {
      // Simulate AI generating new cluster suggestion
      const newCluster: Cluster = {
        id: clusters.length + 1,
        name: 'Customer Success & Enablement',
        color: 'from-green-400 to-teal-500',
        description: 'Keywords focused on customer success, onboarding, and enablement strategies.',
        keywords: ['customer onboarding', 'success metrics', 'user adoption', 'customer enablement'],
        relatedPages: ['/customer-success-playbook'],
        subtopics: [
          {
            id: `${clusters.length + 1}-1`,
            name: 'Onboarding Best Practices',
            description: 'Effective strategies for customer onboarding.',
            stage: 'Conversion',
            intent: 'Transactional',
            keywords: ['onboarding checklist', 'user training', 'getting started'],
            relatedPages: ['/onboarding-guide'],
            metrics: { volume: '2.1K', rank: 28, trend: '+12%' }
          }
        ]
      }
      setClusters([...clusters, newCluster])
      setLoadingAI(false)
    }, 1500)
  }

  const updateKeywordField = (index: number, field: keyof Keyword, value: any) => {
    setKeywords(keywords.map((k, i) => i === index ? { ...k, [field]: value } : k))
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getFitScoreDot = (score: number) => {
    if (score >= 80) return '🟢'
    if (score >= 50) return '🟡'
    return '🔴'
  }

  const leftColumn = (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: moduleColor }}>
        Keyword Research Steps
      </h3>
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => setCurrentStep(step.id)}
          className={`w-full text-left text-xs px-3 py-2 rounded-md transition-all ${
            currentStep === step.id
              ? 'bg-card border font-semibold'
              : 'hover:bg-muted/50'
          }`}
          style={currentStep === step.id ? { borderColor: moduleColor, color: moduleColor } : {}}
          data-testid={`button-step-${step.id}`}
        >
          {step.label}
        </button>
      ))}
    </div>
  )

  const mainContent = (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 brandcraft-buttons">
      <style>{`
        /* Override all default buttons to use BrandCraft pink */
        .brandcraft-buttons button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]) {
          background-color: ${moduleColor} !important;
          border-color: ${moduleColor} !important;
          color: white !important;
        }
        .brandcraft-buttons button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]):hover {
          opacity: 0.9 !important;
        }
      `}</style>
      <QuickActions module="BrandCraft" />
      
      {/* STEP 1: Source & Seed */}
      {currentStep === 'source-seed' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Source & Seed</h1>
            <p className="text-muted-foreground">Start with what you already know — your brand, your audience, and the language they use</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Context & Topic</CardTitle>
              <p className="text-xs text-muted-foreground">Select the context and topic for this keyword research.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Context</label>
                <select 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full border rounded-md p-2 text-xs bg-background"
                  data-testid="select-context"
                >
                  <option value="">Select context...</option>
                  <option value="brand">Brand-wide Content Strategy</option>
                  <option value="campaign">Campaign-specific (e.g., Q4 ABM push)</option>
                  <option value="seo">Foundational SEO / Evergreen Optimization</option>
                  <option value="product">Product Launch or Go-to-Market</option>
                  <option value="other">Other (enter manually below)</option>
                </select>
              </div>

              {context === 'other' && (
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter your custom context..."
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                    className="text-xs"
                    data-testid="input-custom-context"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium">Topic / Theme</label>
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full border rounded-md p-2 text-xs bg-background"
                  data-testid="select-topic"
                >
                  <option value="">Select topic or theme...</option>
                  <option value="abm">ABM & Demand Generation</option>
                  <option value="content">Content Strategy & Messaging</option>
                  <option value="product">Product Marketing</option>
                  <option value="brand">Brand Positioning & Narrative</option>
                  <option value="other">Other (enter manually below)</option>
                </select>
              </div>

              {topic === 'other' && (
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter your custom topic or theme..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="text-xs"
                    data-testid="input-custom-topic"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pull from Messaging House</CardTitle>
              <p className="text-xs text-muted-foreground">
                Auto-suggests keywords from your Messaging House.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" data-testid="button-import-messaging">
                Import from Messaging House
              </Button>

              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedKeywords.map((k, i) => (
                  <span key={i} className="bg-muted border text-xs px-2 py-1 rounded-md" style={{ borderColor: moduleColor }}>
                    {k}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Seed Words</CardTitle>
              <p className="text-xs text-muted-foreground">
                Add or upload terms you want to explore.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Enter or paste seed keywords, separated by commas..."
                value={additionalSeeds}
                onChange={(e) => setAdditionalSeeds(e.target.value)}
                className="text-xs"
                rows={3}
                data-testid="textarea-additional-seeds"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-upload-csv">
                  Upload CSV
                </Button>
                <Button size="sm" data-testid="button-ai-suggest">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Suggest Related Terms
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Broaden Your Inputs</CardTitle>
              <p className="text-xs text-muted-foreground">
                Explore multiple perspectives to make your research well-rounded.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Your Business</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Terms tied directly to your products, services, or niche.
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="Add your business-related keywords..."
                    value={businessKeywords}
                    onChange={(e) => setBusinessKeywords(e.target.value)}
                    data-testid="textarea-business-keywords"
                  />
                </div>

                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Your Audience</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    What would they search when curious, overwhelmed, or comparing?
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="List audience-centered keywords..."
                    value={audienceKeywords}
                    onChange={(e) => setAudienceKeywords(e.target.value)}
                    data-testid="textarea-audience-keywords"
                  />
                </div>

                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Your Competitors</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Topics or keywords your competitors dominate.
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="Add competitor-focused keywords..."
                    value={competitorKeywords}
                    onChange={(e) => setCompetitorKeywords(e.target.value)}
                    data-testid="textarea-competitor-keywords"
                  />
                </div>

                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Google & Tools</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Autocomplete, "People Also Ask," or related searches.
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="Add observations from tools..."
                    value={toolKeywords}
                    onChange={(e) => setToolKeywords(e.target.value)}
                    data-testid="textarea-tool-keywords"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" data-testid="button-preview-seeds">
                  Preview Seeds
                </Button>
                <Button size="sm" data-testid="button-generate-keyword-set">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Keyword Set
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 2: Keyword Analysis */}
      {currentStep === 'keyword-analysis' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Keyword Analysis</h1>
            <p className="text-muted-foreground">Review volume, intent, and ranking to focus on the keywords that will move metrics</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Keyword Analysis</CardTitle>
                <Button variant="outline" size="sm" data-testid="button-generate-insights">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="border rounded-md p-3 bg-muted/30 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-semibold flex items-center gap-1">
                    <Filter size={12} /> Filter & Prioritize
                  </h3>
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2" data-testid="button-reset-filters">
                    Reset
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  <select className="border rounded-md p-1 text-xs bg-background">
                    <option>Intent</option>
                    <option>Informational</option>
                    <option>Commercial</option>
                    <option>Transactional</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background">
                    <option>Difficulty</option>
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Hard</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background">
                    <option>Stage</option>
                    <option>Awareness</option>
                    <option>Consideration</option>
                    <option>Conversion</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background">
                    <option>Pillar</option>
                    <option>Product Innovation</option>
                    <option>Thought Leadership</option>
                    <option>Customer Success</option>
                    <option>Industry Insights</option>
                    <option>Best Practices</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background">
                    <option>Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background">
                    <option>Trend</option>
                    <option>📈 Rising</option>
                    <option>📉 Falling</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border px-2 py-1 text-left">Keyword</th>
                      <th className="border px-2 py-1">Volume</th>
                      <th className="border px-2 py-1">Intent</th>
                      <th className="border px-2 py-1">Difficulty</th>
                      <th className="border px-2 py-1">Rank</th>
                      <th className="border px-2 py-1">Pillar</th>
                      <th className="border px-2 py-1">Fit Score</th>
                      <th className="border px-2 py-1">Action</th>
                      <th className="border px-2 py-1">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((k, index) => (
                      <tr key={index} className="hover:bg-muted/50 transition-colors">
                        <td className="border px-2 py-1 font-medium">{k.keyword}</td>
                        <td className="border px-2 py-1 text-center">{k.volume}</td>
                        <td className="border px-2 py-1 text-center">{k.intent}</td>
                        <td className="border px-2 py-1 text-center">{k.difficulty}</td>
                        <td className="border px-2 py-1 text-center">{k.rank}</td>
                        <td className="border px-2 py-1 text-center text-[10px]">{k.pillar}</td>
                        <td className="border px-2 py-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span>{getFitScoreDot(k.fitScore)}</span>
                            <span className={`font-semibold ${getFitScoreColor(k.fitScore)}`}>
                              {k.fitScore}
                            </span>
                          </div>
                        </td>
                        <td className="border px-2 py-1">
                          <Select 
                            value={k.action} 
                            onValueChange={(value) => updateKeywordField(index, 'action', value)}
                          >
                            <SelectTrigger className="h-6 text-[10px] w-full" data-testid={`select-action-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Target Now">Target Now</SelectItem>
                              <SelectItem value="Watch">Watch</SelectItem>
                              <SelectItem value="Ignore">Ignore</SelectItem>
                              <SelectItem value="Competitive Defense">Competitive Defense</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border px-2 py-1">
                          <Input
                            value={k.notes}
                            onChange={(e) => updateKeywordField(index, 'notes', e.target.value)}
                            placeholder="Add notes..."
                            className="h-6 text-[10px] w-full min-w-[120px]"
                            data-testid={`input-notes-${index}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm" data-testid="button-export-keywords">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Keywords
                </Button>
                <Button size="sm" data-testid="button-save-analysis">
                  <Save className="h-4 w-4 mr-2" />
                  Save Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 3: Topic Clusters */}
      {currentStep === 'topic-clusters' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Topic Clusters</h1>
            <p className="text-muted-foreground">Group keywords into strategic themes to guide your content roadmap</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-2 text-xs mb-3">
                <Brain size={14} style={{ color: moduleColor }} className="mt-0.5" />
                <div>
                  <p className="font-semibold">AI-Powered Clustering</p>
                  <p className="text-muted-foreground">
                    Let AI analyze your keywords and suggest smart groupings based on semantic similarity.
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleGenerateClusterSuggestions} 
                size="sm" 
                className="mt-3"
                disabled={loadingAI}
                data-testid="button-generate-cluster-suggestions"
              >
                <Brain className="h-4 w-4 mr-2" />
                {loadingAI ? 'Generating...' : 'Generate Cluster Suggestions'}
              </Button>
            </CardContent>
          </Card>

          {/* Cluster Cards */}
          {clusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{cluster.name}</CardTitle>
                  <Button variant="outline" size="sm" data-testid={`button-eval-cluster-${cluster.id}`}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add to Eval
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{cluster.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Tag size={9} style={{ color: moduleColor }} /> 
                  Related Pages: {cluster.relatedPages.join(', ')}
                </div>

                <div className="flex flex-wrap gap-1">
                  {cluster.keywords.map((k, i) => (
                    <span key={i} className="bg-muted border text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                      {k}
                      <Trash2 
                        size={9} 
                        className="text-muted-foreground hover:text-destructive cursor-pointer" 
                        onClick={() => removeClusterKeyword(cluster.id, k)}
                      />
                    </span>
                  ))}
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword..."
                    className="border text-[10px] rounded-md p-1 px-2 w-32 h-6"
                    data-testid={`input-new-keyword-${cluster.id}`}
                  />
                  <Button 
                    onClick={() => addClusterKeyword(cluster.id)} 
                    size="sm" 
                    className="h-6 px-2 text-[10px]"
                    data-testid={`button-add-keyword-${cluster.id}`}
                  >
                    Add
                  </Button>
                </div>

                <Collapsible open={expandedCluster === cluster.id} onOpenChange={() => toggleExpand(cluster.id)}>
                  <CollapsibleTrigger asChild>
                    <button
                      className="flex items-center gap-1 text-[10px] font-semibold hover:underline"
                      style={{ color: moduleColor }}
                      data-testid={`button-toggle-subtopics-${cluster.id}`}
                    >
                      {expandedCluster === cluster.id ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                      {expandedCluster === cluster.id ? 'Hide Subtopics' : 'Show Subtopics'}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {cluster.subtopics.map(sub => (
                      <div key={sub.id} className="border-t pt-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold flex items-center gap-1">
                            <Layers size={10} /> {sub.name}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-6 px-2 text-[10px]"
                            data-testid={`button-eval-subtopic-${sub.id}`}
                          >
                            <PlusCircle size={9} className="mr-1" />
                            Add to Eval
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{sub.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {sub.keywords.map((kw, j) => (
                            <span key={j} className="bg-muted border text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                              {kw}
                              <Trash2
                                size={9}
                                className="text-muted-foreground hover:text-destructive cursor-pointer"
                                onClick={() => removeSubtopicKeyword(cluster.id, sub.id, kw)}
                              />
                            </span>
                          ))}
                          <Input
                            value={newSubKeyword}
                            onChange={(e) => setNewSubKeyword(e.target.value)}
                            placeholder="Add subtopic keyword..."
                            className="border text-[10px] rounded-md p-1 px-2 w-40 h-6"
                            data-testid={`input-new-subkeyword-${sub.id}`}
                          />
                          <Button
                            onClick={() => addSubtopicKeyword(cluster.id, sub.id)}
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            data-testid={`button-add-subkeyword-${sub.id}`}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Stage: {sub.stage} | Intent: {sub.intent} | Volume: {sub.metrics.volume} | Rank: {sub.metrics.rank} | Trend: {sub.metrics.trend}
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* STEP 4: Summary */}
      {currentStep === 'summary' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>📊 Keyword Research Summary</h1>
            <p className="text-muted-foreground">Your complete keyword research overview at a glance</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">Total Keywords Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: moduleColor }}>{keywords.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">Clusters Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: moduleColor }}>{clusters.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">High Priority Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: moduleColor }}>
                  {keywords.filter(k => k.priority === 'High').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">Avg Fit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: moduleColor }}>
                  {Math.round(keywords.reduce((sum, k) => sum + k.fitScore, 0) / keywords.length)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* All Keywords Analyzed */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tag size={16} style={{ color: moduleColor }} />
                    All Keywords Analyzed
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete list of all keywords with key metrics and fit scores
                  </p>
                </div>
                <Button variant="outline" size="sm" data-testid="button-export-all-keywords">
                  <FileText className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border px-2 py-1 text-left">Keyword</th>
                      <th className="border px-2 py-1">Volume</th>
                      <th className="border px-2 py-1">Priority</th>
                      <th className="border px-2 py-1">Difficulty</th>
                      <th className="border px-2 py-1">Intent</th>
                      <th className="border px-2 py-1">Pillar</th>
                      <th className="border px-2 py-1">Fit Score</th>
                      <th className="border px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((k, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="border px-2 py-1 font-medium">{k.keyword}</td>
                        <td className="border px-2 py-1 text-center">{k.volume}</td>
                        <td className="border px-2 py-1 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            k.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            k.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {k.priority}
                          </span>
                        </td>
                        <td className="border px-2 py-1 text-center">{k.difficulty}</td>
                        <td className="border px-2 py-1 text-center">{k.intent}</td>
                        <td className="border px-2 py-1 text-center text-[10px]">{k.pillar}</td>
                        <td className="border px-2 py-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span>{getFitScoreDot(k.fitScore)}</span>
                            <span className={`font-semibold ${getFitScoreColor(k.fitScore)}`}>
                              {k.fitScore}
                            </span>
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-[10px]">{k.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* All Clusters Created */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers size={16} style={{ color: moduleColor }} />
                    All Clusters Created
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Topic clusters with subtopics and keyword counts
                  </p>
                </div>
                <Button variant="outline" size="sm" data-testid="button-export-all-clusters">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Clusters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {clusters.map((cluster) => (
                <div key={cluster.id} className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-sm font-semibold mb-1">{cluster.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{cluster.description}</p>
                  <div className="text-xs">
                    <strong>Keywords ({cluster.keywords.length}):</strong> {cluster.keywords.join(', ')}
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Subtopics ({cluster.subtopics.length}):</strong> {cluster.subtopics.map(s => s.name).join(', ')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 size={16} style={{ color: moduleColor }} />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-xs space-y-1">
                <li><strong>Top Performing Pillars:</strong> {Array.from(new Set(keywords.filter(k => k.fitScore >= 80).map(k => k.pillar))).join(', ') || 'None'}</li>
                <li><strong>Target Now Keywords:</strong> {keywords.filter(k => k.action === 'Target Now').length} keywords ready for immediate action</li>
                <li><strong>Watch List:</strong> {keywords.filter(k => k.action === 'Watch').length} keywords to monitor</li>
                <li><strong>Competitive Defense:</strong> {keywords.filter(k => k.action === 'Competitive Defense').length} keywords requiring defensive content</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" data-testid="button-export-summary">
              <FileText className="h-4 w-4 mr-2" />
              Export Summary Report
            </Button>
            <Button size="sm" data-testid="button-save-to-project">
              <Save className="h-4 w-4 mr-2" />
              Save to Project
            </Button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <TwoColumnLayout
      leftNav={leftColumn}
      content={mainContent}
      moduleColor={moduleColor}
    />
  )
}
