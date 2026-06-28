"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Info, Sparkles, Save, Filter, Star, Tag, XCircle, Lightbulb, 
  ArrowRightCircle, AlertTriangle, Eye, Check, X, PlusCircle,
  ChevronDown, ChevronRight, Layers, Trash2, Brain, Link2,
  FileText, BarChart2, FolderOpen
} from 'lucide-react'
import { TwoColumnLayout } from '@/components/layouts/TwoColumnLayout'

const moduleColor = '#c009ba' // BrandCraft pink

type Step = 'purpose' | 'source-seed' | 'keyword-analysis' | 'keyword-content-alignment' | 'topic-clusters' | 'outputs-integrations' | 'summary'

interface Goal {
  id: string
  goal: string
}

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
  score: number
}

interface Alignment {
  keyword: string
  intent: string
  pillar: string
  stage: string
  type: string
  current: string
  fit: number | null
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
  const [currentStep, setCurrentStep] = useState<Step>('purpose')
  
  // Step 1: Purpose
  const [context, setContext] = useState('')
  const [customContext, setCustomContext] = useState('')
  const [topic, setTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [purpose, setPurpose] = useState('')
  const [purposeNotes, setPurposeNotes] = useState('')
  
  // Step 2: Source & Seed
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])
  const [additionalSeeds, setAdditionalSeeds] = useState('')
  const [businessKeywords, setBusinessKeywords] = useState('')
  const [audienceKeywords, setAudienceKeywords] = useState('')
  const [competitorKeywords, setCompetitorKeywords] = useState('')
  const [toolKeywords, setToolKeywords] = useState('')
  
  // Step 3: Keyword Analysis
  const [keywords] = useState<Keyword[]>([
    { keyword: 'ABM operations', volume: 540, intent: 'Commercial', difficulty: 45, rank: 23, priority: 'High', trend: '📈', cpc: '$3.20', pillar: 'Strategy Systems', stage: 'Awareness', type: 'Blog', competitors: 'Terminus, RollWorks', score: 82 },
    { keyword: 'content strategy', volume: 1300, intent: 'Informational', difficulty: 38, rank: '-', priority: 'Medium', trend: '📉', cpc: '$1.90', pillar: 'Content Frameworks', stage: 'Consideration', type: 'Guide', competitors: 'HubSpot, SEMrush', score: 67 },
    { keyword: 'pipeline acceleration', volume: 720, intent: 'Transactional', difficulty: 52, rank: 45, priority: 'High', trend: '📈', cpc: '$4.10', pillar: 'Revenue Growth', stage: 'Conversion', type: 'Landing Page', competitors: '6sense, Demandbase', score: 89 },
  ])
  const [analysisReflection, setAnalysisReflection] = useState('')
  
  // Step 4: Alignment
  const [alignments, setAlignments] = useState<Alignment[]>([
    { keyword: 'ABM strategy', intent: 'Informational', pillar: 'ABM Ops', stage: 'Awareness', type: 'Blog', current: 'ABM 101 Guide', fit: 82, action: 'Refresh', notes: 'Add data, update CTA' },
    { keyword: 'AI in content strategy', intent: 'Informational', pillar: 'BrandCraft', stage: 'Awareness', type: 'Blog + Video', current: 'None', fit: null, action: 'Create', notes: 'Align with thought leadership pillar' },
    { keyword: 'ABM dashboard template', intent: 'Transactional', pillar: 'Flight Deck', stage: 'Conversion', type: 'Template', current: 'Dashboard Library', fit: 94, action: 'Optimize', notes: 'Add demo CTA' },
  ])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([
    { keyword: 'buyer enablement framework', suggestion: 'Suggest pillar: BrandCraft | Stage: Consideration', action: 'Create' },
    { keyword: 'intent signal tracking', suggestion: 'Suggest pillar: ABM Ops | Stage: Awareness', action: 'Optimize' },
  ])
  
  // Step 5: Topic Clusters
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newSubKeyword, setNewSubKeyword] = useState('')
  const [clusterNarrative, setClusterNarrative] = useState(
    'Analysis reveals 3 primary opportunity clusters around ABM Ops and BrandCraft. The ABM Ops cluster shows strong transactional intent with pipeline acceleration keywords, while BrandCraft demonstrates educational content gaps in thought leadership and content pillar strategy. Consider prioritizing awareness-stage content in BrandCraft to capture early-stage buyers.'
  )
  
  const [clusters, setClusters] = useState<Cluster[]>([
    {
      id: 1,
      name: 'ABM Ops',
      color: 'from-indigo-400 to-indigo-600',
      description: 'Keywords and topics focused on ABM operations, frameworks, and performance measurement.',
      keywords: ['account based marketing', 'pipeline velocity', 'intent signals'],
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
          keywords: ['pipeline velocity', 'deal acceleration', 'sales cycle insights'],
          relatedPages: ['/pipeline-optimization', '/abm-metrics-dashboard'],
          metrics: { volume: '1.8K', rank: 32, trend: '+9%' }
        }
      ]
    },
    {
      id: 2,
      name: 'BrandCraft',
      color: 'from-pink-400 to-purple-500',
      description: 'Focuses on storytelling, brand positioning, and content strategy alignment.',
      keywords: ['brand storytelling', 'content pillars', 'thought leadership'],
      relatedPages: ['/brand-storytelling-guide', '/content-strategy-playbook'],
      subtopics: [
        {
          id: '2-1',
          name: 'Tone of Voice Development',
          description: 'Creating a consistent and authentic brand tone.',
          stage: 'Awareness',
          intent: 'Informational',
          keywords: ['brand tone', 'voice consistency', 'copywriting framework'],
          relatedPages: ['/tone-of-voice-guide'],
          metrics: { volume: '2.9K', rank: 28, trend: '+12%' }
        },
        {
          id: '2-2',
          name: 'Content Pillar Strategy',
          description: 'Structuring content around audience-driven themes.',
          stage: 'Consideration',
          intent: 'Commercial',
          keywords: ['content pillars', 'topic clusters', 'content mapping'],
          relatedPages: ['/content-pillar-templates', '/content-hub-framework'],
          metrics: { volume: '4.1K', rank: 19, trend: '+22%' }
        },
        {
          id: '2-3',
          name: 'Thought Leadership Campaigns',
          description: 'Using expertise-based content to establish authority.',
          stage: 'Conversion',
          intent: 'Transactional',
          keywords: ['executive visibility', 'leadership content', 'industry insights'],
          relatedPages: ['/thought-leadership-tactics'],
          metrics: { volume: '3.6K', rank: 15, trend: '+15%' }
        }
      ]
    }
  ])
  
  // Step 6: Outputs & Integrations
  const [insightText, setInsightText] = useState(
    'BrandCraft found 3 key opportunity clusters around "ABM frameworks," "AI content strategy," and "buyer enablement." Awareness-stage gaps are strongest in the BrandCraft pillar — consider launching an educational blog or video series before Q1.'
  )

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
    { id: 'purpose', label: 'Purpose' },
    { id: 'source-seed', label: 'Source & Seed' },
    { id: 'keyword-analysis', label: 'Keyword Analysis' },
    { id: 'keyword-content-alignment', label: 'Keyword & Content Alignment' },
    { id: 'topic-clusters', label: 'Topic Clusters' },
    { id: 'outputs-integrations', label: 'Outputs & Integrations' },
    { id: 'summary', label: '📊 Summary' },
  ]

  // Handlers
  const handleApplySuggestion = (sugg: any) => {
    setAlignments([...alignments, { 
      keyword: sugg.keyword, 
      intent: 'Informational', 
      pillar: sugg.suggestion.split('|')[0].replace('Suggest pillar: ', '').trim(), 
      stage: sugg.suggestion.split('|')[1].replace('Stage:', '').trim(), 
      type: '-', 
      current: 'None', 
      fit: 70, 
      action: sugg.action, 
      notes: 'Added via AI suggestion' 
    }])
    setSuggestions(suggestions.filter(s => s.keyword !== sugg.keyword))
  }

  const handleDismissSuggestion = (sugg: any) => {
    setSuggestions(suggestions.filter(s => s.keyword !== sugg.keyword))
  }

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

  const handleAISuggestions = () => {
    setLoadingAI(true)
    setTimeout(() => {
      setAiSuggestions([
        { keyword: 'brand storytelling examples', use: 'Best for case studies and awareness blogs' },
        { keyword: 'pipeline optimization tools', use: 'Ideal for commercial pages or comparison guides' },
        { keyword: 'executive content strategy', use: 'Useful for thought leadership and industry positioning' }
      ])
      setLoadingAI(false)
    }, 1000)
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
    <div className="space-y-6 p-4 md:p-8 max-w-full overflow-x-hidden">
      {/* STEP 1: Purpose */}
      {currentStep === 'purpose' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Purpose</h1>
            <p className="text-gray-600">Define the strategic intent behind your keyword research</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Define the strategic intent behind your keyword research by selecting your Context (brand-wide, campaign-specific, SEO, product launch, or other) and Topic/Theme. Write a clear purpose statement explaining why you're doing this research and what you aim to achieve.</p>
                  <p><strong>Expected outcome:</strong> A clear foundation showing how this keyword research connects to your broader marketing strategy—not standalone SEO, but the bridge between Messaging House → Content Strategy → Content Creation.</p>
                  <p><strong>Tip:</strong> Keyword research translates your brand's messaging and positioning into search-driven opportunities organized by topic, intent, and difficulty—so every keyword ladders up to strategy, not vanity metrics. Use the Notes field to capture ideas or connections for future steps.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Context & Topic</CardTitle>
              <p className="text-xs text-muted-foreground">Select the context and topic for this keyword research. You can also add your own.</p>
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
                    placeholder="If other, enter your custom context..."
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
                    placeholder="If other, enter your custom topic or theme..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="text-xs"
                    data-testid="input-custom-topic"
                  />
                </div>
              )}

              <p className="text-xs text-muted-foreground italic">
                Tip: Knowing your context and topic helps the AI recommend relevant intent tiers, topic clusters, and difficulty thresholds.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Define Your Purpose</CardTitle>
              <p className="text-xs text-muted-foreground italic">
                What do you want keyword research to reveal — gaps, opportunities, or validation? How will it shape your roadmap?
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Examples:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                <li>"Find high-intent phrases that match our ABM services."</li>
                <li>"Validate our messaging themes with search data."</li>
                <li>"Identify under-served topics like 'marketing ops for small teams.'"</li>
              </ul>

              <Textarea
                placeholder="Example: Validate our content pillars using search data insights..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="text-xs"
                rows={4}
                data-testid="textarea-purpose"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes & Reflections</CardTitle>
              <p className="text-xs text-muted-foreground">
                Use this space to jot down ideas or connections for how this insight ties to future steps.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Optional: Add any ideas or takeaways here..."
                value={purposeNotes}
                onChange={(e) => setPurposeNotes(e.target.value)}
                className="text-xs"
                rows={3}
                data-testid="textarea-purpose-notes"
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 2: Source & Seed */}
      {currentStep === 'source-seed' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Source & Seed</h1>
            <p className="text-gray-600">Start with what you already know — your brand, your audience, and the language they use</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Start with human insight—import keywords from your Messaging House (brand pillars, pain points, positioning), add your own seed words, or upload a CSV. You can also ask AI to suggest related search terms based on your inputs.</p>
                  <p><strong>Expected outcome:</strong> A comprehensive list of seed keywords that reflect your brand's authentic language, audience needs, and strategic themes—ready to be expanded and analyzed in the next step.</p>
                  <p><strong>Tip:</strong> The best research starts with what you already know—your brand, your audience, and the language they use. Don't rely solely on tools; blend your strategic insight with AI suggestions for the most relevant keyword foundation.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Path 1 — Pull from Messaging House</CardTitle>
              <p className="text-xs text-muted-foreground">
                Auto-suggests keywords from your Messaging House — brand pillars, audience pain points, and positioning statements.
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
              <p className="text-xs text-muted-foreground italic">
                Keywords above auto-populate from the Purpose step based on your selected context and topic.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Path 2 — Add Additional Seed Words</CardTitle>
              <p className="text-xs text-muted-foreground">
                Add or upload more terms you want to explore. You can also ask AI to suggest related search terms.
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
              <CardTitle className="text-base">Path 3 — Broaden Your Inputs</CardTitle>
              <p className="text-xs text-muted-foreground">
                Explore multiple perspectives to make your research well-rounded. Use the prompts below to spark ideas and keep your thinking human-centered.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Business */}
                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Your Business</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    List terms tied directly to your products, services, or niche.
                  </p>
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Example: "ABM strategy," "fractional CMO," "marketing ops tools."
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="Add your business-related keywords here..."
                    value={businessKeywords}
                    onChange={(e) => setBusinessKeywords(e.target.value)}
                    data-testid="textarea-business-keywords"
                  />
                </div>

                {/* Audience */}
                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Your Audience</h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    Think like your buyer. What would they search when they're curious, overwhelmed, or comparing options?
                  </p>
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Tip: Pull from sales calls, LinkedIn comments, community threads, or customer support notes.
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="List audience-centered keywords or questions..."
                    value={audienceKeywords}
                    onChange={(e) => setAudienceKeywords(e.target.value)}
                    data-testid="textarea-audience-keywords"
                  />
                </div>

                {/* Competitors */}
                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Your Competitors</h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    What topics or keywords do your competitors seem to dominate?
                  </p>
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Prompt: "Which competitor content is winning search attention that aligns with our topics?"
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="Add competitor-focused keywords or ideas..."
                    value={competitorKeywords}
                    onChange={(e) => setCompetitorKeywords(e.target.value)}
                    data-testid="textarea-competitor-keywords"
                  />
                </div>

                {/* Google & Tools */}
                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Google & Tools</h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    Look at autocomplete, "People Also Ask," or related searches for phrasing patterns.
                  </p>
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Example: "How to build a B2B content engine," "what is ABM?"
                  </p>
                  <Textarea
                    className="text-xs"
                    rows={3}
                    placeholder="Add observations or keyword ideas from tools..."
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
              <p className="text-xs italic text-muted-foreground mb-2">
                "Don't start with tools — start with people. Your best keywords come from the language your customers use."
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                When you're done, click <strong>Generate Keyword Set</strong> to pull volume, intent, and ranking insights for your selected seeds.
              </p>
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

      {/* STEP 3: Keyword Analysis */}
      {currentStep === 'keyword-analysis' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Keyword Analysis</h1>
            <p className="text-gray-600">Review volume, intent, and ranking to focus on the keywords that will move metrics</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Review the pre-populated keyword table with search volume, difficulty, intent, rank, and trends. Use filters (Intent, Difficulty, Stage, Pillar, Priority, Trend) to explore patterns, star high-potential terms, tag keywords to pillars/stages, and hide irrelevant ones. Click "Generate Insights" for AI recommendations on quick wins.</p>
                  <p><strong>Expected outcome:</strong> Strategic insight into which keywords will move metrics (not just traffic), with clear priorities marked and patterns identified—showing what's ranking, what's missing, what's rising, and which opportunities deserve focus.</p>
                  <p><strong>Tip:</strong> This is a review step—don't build data, understand it. Look for the sweet spot: high intent, mid-difficulty, and rising trends. Keep the human-in-the-loop experience strong—the system runs the data, you apply the strategy lens. Add a reflection at the bottom noting which opportunities stand out or need further exploration.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Keyword Analysis</CardTitle>
                <Button variant="outline" size="sm" data-testid="button-generate-insights">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Translate your keyword list into strategic insight. Review volume, intent, and ranking to focus on the keywords that will move metrics — not just traffic.
              </p>
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
                  <select className="border rounded-md p-1 text-xs bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2">
                    <option>Intent</option>
                    <option>Informational</option>
                    <option>Commercial</option>
                    <option>Transactional</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2">
                    <option>Difficulty</option>
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Hard</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2">
                    <option>Stage</option>
                    <option>Awareness</option>
                    <option>Consideration</option>
                    <option>Conversion</option>
                    <option>Retention</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2">
                    <option>Pillar</option>
                    <option>Strategy Systems</option>
                    <option>Content Frameworks</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2">
                    <option>Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <select className="border rounded-md p-1 text-xs bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2">
                    <option>Trend</option>
                    <option>📈 Rising</option>
                    <option>📉 Falling</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  "Start with the sweet spot: High intent, mid-difficulty, and rising trend."
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border px-2 py-1 text-left">Keyword / Phrase</th>
                      <th className="border px-2 py-1">Volume</th>
                      <th className="border px-2 py-1">Intent</th>
                      <th className="border px-2 py-1">Difficulty</th>
                      <th className="border px-2 py-1">Rank</th>
                      <th className="border px-2 py-1">Priority</th>
                      <th className="border px-2 py-1">Trend</th>
                      <th className="border px-2 py-1">CPC</th>
                      <th className="border px-2 py-1">Pillar / Theme</th>
                      <th className="border px-2 py-1">Stage</th>
                      <th className="border px-2 py-1">Content Type</th>
                      <th className="border px-2 py-1">Competitors</th>
                      <th className="border px-2 py-1">Opportunity Score</th>
                      <th className="border px-2 py-1">Send to Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((k, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="border px-2 py-1 font-medium">{k.keyword}</td>
                        <td className="border px-2 py-1 text-center">{k.volume}</td>
                        <td className="border px-2 py-1 text-center">{k.intent}</td>
                        <td className="border px-2 py-1 text-center">{k.difficulty}</td>
                        <td className="border px-2 py-1 text-center">{k.rank}</td>
                        <td className="border px-2 py-1 text-center font-semibold">{k.priority}</td>
                        <td className="border px-2 py-1 text-center">{k.trend}</td>
                        <td className="border px-2 py-1 text-center">{k.cpc}</td>
                        <td className="border px-2 py-1 text-center">{k.pillar}</td>
                        <td className="border px-2 py-1 text-center">{k.stage}</td>
                        <td className="border px-2 py-1 text-center">{k.type}</td>
                        <td className="border px-2 py-1 text-center text-muted-foreground">{k.competitors}</td>
                        <td className="border px-2 py-1">
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${k.score >= 80 ? 'bg-green-500' : k.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                style={{ width: `${k.score}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] mt-1 text-muted-foreground">{k.score}/100</span>
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" data-testid={`button-add-keyword-${i}`}>
                            <ArrowRightCircle size={10} className="mr-1" /> Add
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reflection */}
              <div className="border-t pt-4 space-y-2">
                <label className="text-xs font-semibold">Reflection</label>
                <p className="text-xs text-muted-foreground italic">
                  "Which keyword opportunities stand out? Which need further exploration or content updates?"
                </p>
                <Textarea
                  className="text-xs"
                  rows={3}
                  placeholder="Add your quick notes or reflections here..."
                  value={analysisReflection}
                  onChange={(e) => setAnalysisReflection(e.target.value)}
                  data-testid="textarea-analysis-reflection"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 4: Keyword & Content Alignment */}
      {currentStep === 'keyword-content-alignment' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Keyword & Content Alignment</h1>
            <p className="text-gray-600">Review how your keywords map to pillars, stages, and content — then decide what to create, refresh, or retire</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Review how your keywords map to pillars, stages, and existing content. Check the Alignment Grid for fit scores (Green=aligned, Yellow=partial, Red=gap), review AI suggestions for keyword-to-content mappings (Accept/Dismiss), and decide next actions (Create, Refresh, Optimize, or Retire). Use Auto-Match, Analyze Fit, and Spot Gaps buttons to speed up review.</p>
                  <p><strong>Expected outcome:</strong> Clear decisions on which keywords need new content creation, which existing assets to refresh or optimize, and which to retire—with every keyword mapped to the right pillar, stage, and content opportunity.</p>
                  <p><strong>Tip:</strong> This is a review and decision step—you've done the heavy lifting in Keyword Analysis. Now connect your keyword research to actionable content strategy. The better your alignment, the stronger your SEO and messaging impact. This hybrid keeps human-in-the-loop intact—AI suggests, you approve.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Alignment Grid</CardTitle>
                  <p className="text-xs text-muted-foreground italic">
                    Purpose: Connect each keyword to the right pillar, stage, and content opportunity — identifying whether to Create, Refresh, Optimize, or Retire existing assets.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSuggestions(true)} data-testid="button-auto-match">
                    Auto-Match to Pillars
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowSuggestions(true)} data-testid="button-analyze-fit">
                    Analyze Fit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowSuggestions(true)} data-testid="button-spot-gaps">
                    Spot Gaps
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showSuggestions && suggestions.length > 0 && (
                <div className="border rounded-md p-3 mt-3 bg-muted/30">
                  <h3 className="text-xs font-semibold mb-2 flex items-center gap-1">
                    <Eye size={12} /> AI Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {suggestions.map((s, i) => (
                      <li key={i} className="flex justify-between items-center bg-background border rounded-md px-3 py-2">
                        <div>
                          <p className="text-xs font-semibold">{s.keyword}</p>
                          <p className="text-[10px] text-muted-foreground">{s.suggestion}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => handleApplySuggestion(s)} data-testid={`button-apply-suggestion-${i}`}>
                            <Check size={10} className="mr-1" /> Apply
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => handleDismissSuggestion(s)} data-testid={`button-dismiss-suggestion-${i}`}>
                            <X size={10} className="mr-1" /> Dismiss
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border px-2 py-1 text-left">Keyword</th>
                      <th className="border px-2 py-1">Intent</th>
                      <th className="border px-2 py-1">Pillar</th>
                      <th className="border px-2 py-1">Stage</th>
                      <th className="border px-2 py-1">Content Type</th>
                      <th className="border px-2 py-1">Current Content</th>
                      <th className="border px-2 py-1">Fit Score</th>
                      <th className="border px-2 py-1">Action</th>
                      <th className="border px-2 py-1">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alignments.map((a, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="border px-2 py-1 font-medium">{a.keyword}</td>
                        <td className="border px-2 py-1 text-center">{a.intent}</td>
                        <td className="border px-2 py-1 text-center">{a.pillar}</td>
                        <td className="border px-2 py-1 text-center">{a.stage}</td>
                        <td className="border px-2 py-1 text-center">{a.type}</td>
                        <td className="border px-2 py-1 text-center text-muted-foreground">{a.current}</td>
                        <td className="border px-2 py-1 text-center">
                          {a.fit ? (
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full ${a.fit >= 80 ? 'bg-green-500' : a.fit >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                  style={{ width: `${a.fit}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] mt-1 text-muted-foreground">{a.fit}%</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-red-400 font-semibold">—</span>
                          )}
                        </td>
                        <td className="border px-2 py-1 text-center font-semibold">{a.action}</td>
                        <td className="border px-2 py-1 text-muted-foreground">{a.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-3 text-xs text-muted-foreground italic">
                🔚 Next Step: Topic Clusters — groups aligned keywords under each pillar and feeds into Content Creation + Activation Grids.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-1">
                <AlertTriangle size={12} style={{ color: moduleColor }} /> Why This Hybrid Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Shows AI suggestions without overwriting data — user approval is required before applying.</li>
                <li>Keeps the human-in-the-loop experience intact.</li>
                <li>Ensures clarity between auto-generated insights and manual strategy inputs.</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 5: Topic Clusters */}
      {currentStep === 'topic-clusters' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Topic Clusters</h1>
            <p className="text-gray-600">Organize keywords into strategic topic groups that guide your content creation and SEO authority</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Organize keywords into strategic topic clusters (thematic groups strengthening SEO authority). Review the AI-generated narrative summary (edit as needed), use AI suggestions to auto-populate keywords into clusters/subtopics, expand clusters to see related pages/keywords/metrics, and add or remove keywords at cluster and subtopic levels. Click "+Eval" to flag items for strategic prioritization in Stack Navigator.</p>
                  <p><strong>Expected outcome:</strong> Topic clusters saved to your Project Archive and accessible across all modules (Content Strategy for pillar planning, Content Creation for blog topics, PulseHub for performance tracking, Flight Deck for campaign themes)—creating content hubs search engines love.</p>
                  <p><strong>Tip:</strong> Think of each cluster as a "content neighborhood"—the pillar is the main street, and subtopics are side streets that all point back to it. This structure boosts both SEO and user experience, transforming keywords into actionable content architecture.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary/Narrative at TOP */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={16} style={{ color: moduleColor }} />
                Cluster Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground italic">
                AI-generated narrative summarizing your topic cluster insights. Edit as needed before saving.
              </p>
              <Textarea
                value={clusterNarrative}
                onChange={(e) => setClusterNarrative(e.target.value)}
                className="text-xs"
                rows={4}
                data-testid="textarea-cluster-narrative"
              />
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" data-testid="button-regenerate-narrative">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Re-generate Narrative
                </Button>
                <Button size="sm" data-testid="button-save-narrative">
                  <Save className="h-4 w-4 mr-2" />
                  Save Narrative
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-2 text-xs mb-3">
                <Brain size={14} style={{ color: moduleColor }} className="mt-0.5" />
                <div>
                  <p className="font-semibold">AI-Powered Clustering</p>
                  <p className="text-muted-foreground italic">
                    Let AI analyze your keywords and suggest smart groupings and placements.
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleAISuggestions} 
                size="sm" 
                className="mt-3"
                data-testid="button-ai-suggest-clusters"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Suggest Keywords & Placements
              </Button>
              {loadingAI && <p className="text-[10px] italic text-muted-foreground mt-2">Analyzing clusters...</p>}
              {aiSuggestions.length > 0 && (
                <div className="mt-2 border-t pt-2">
                  <p className="text-xs font-semibold mb-1">AI Suggestions</p>
                  <ul className="text-[10px] space-y-1 text-muted-foreground">
                    {aiSuggestions.map((s, i) => (
                      <li key={i}>
                        <strong>{s.keyword}</strong> – {s.use}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cluster Cards */}
          {clusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{cluster.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid={`button-eval-cluster-${cluster.id}`}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add to Eval
                    </Button>
                  </div>
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

                <button
                  onClick={() => toggleExpand(cluster.id)}
                  className="flex items-center gap-1 text-[10px] font-semibold hover:underline"
                  style={{ color: moduleColor }}
                >
                  {expandedCluster === cluster.id ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                  {expandedCluster === cluster.id ? 'Hide Subtopics' : 'Show Subtopics'}
                </button>

                {expandedCluster === cluster.id && cluster.subtopics.map(sub => (
                  <div key={sub.id} className="border-t pt-2 mt-2 space-y-2">
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
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Link2 size={9} style={{ color: moduleColor }} /> 
                      Linked Pages: {sub.relatedPages.join(', ')}
                    </div>
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
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* STEP 6: Outputs & Integrations */}
      {currentStep === 'outputs-integrations' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Outputs & Integrations</h1>
            <p className="text-gray-600">Package your insights for sharing across Stackwise modules and strategic prioritization</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Package your keyword insights for sharing and strategic review. Review the Summary Snapshot of opportunities and blind spots, edit the Insights Narrative (AI+HITL), push specific insights to other modules using "+Eval" buttons, and export outputs (CSV, Deck Summary) for presentations. Two options: (1) Save to Project = auto-sync across all modules, (2) +Eval = flag for strategic prioritization in Eval Matrix.</p>
                  <p><strong>Expected outcome:</strong> Your keyword insights, clusters, and narratives stored in Project Archive and accessible across all Stackwise modules (Content Strategy, Content Creation, PulseHub, Flight Deck), with high-impact findings flagged for strategic review in your 30/60/90 roadmap.</p>
                  <p><strong>Tip:</strong> Think of "Save to Project" as "shared memory" across Stackwise—everyone has access to the same insights. Use "+Eval" only for high-impact findings that deserve strategic attention in your Eval Matrix. Make decisions, not just downloads—which insights are ready to activate now vs. which need team review?</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Snapshot at TOP */}
          <Card className="border-2" style={{ borderColor: moduleColor }}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 size={16} style={{ color: moduleColor }} />
                Summary Snapshot
              </CardTitle>
              <p className="text-xs text-muted-foreground italic">
                See where your biggest opportunities — and blind spots — live.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-xs space-y-1">
                <li><strong>Top Pillars:</strong> ABM Ops, BrandCraft</li>
                <li><strong>Biggest Gaps:</strong> Awareness-stage content on AI storytelling</li>
                <li><strong>Next Actions:</strong> Refresh older blogs, build new "how-to" pillar content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Insights Narrative */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles size={16} style={{ color: moduleColor }} />
                Insights Narrative (AI + HITL)
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                An auto-generated strategist-style summary you can edit or re-generate before saving to your Project Archive.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={insightText}
                onChange={(e) => setInsightText(e.target.value)}
                className="text-xs"
                rows={4}
                data-testid="textarea-insight-narrative"
              />
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" data-testid="button-regenerate-insights">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Re-generate
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-export-narrative">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Narrative
                  </Button>
                </div>
                <Button size="sm" data-testid="button-save-insights">
                  <Save className="h-4 w-4 mr-2" />
                  Save to Project
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export & Connect with +Eval buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 size={16} style={{ color: moduleColor }} />
                Push to Other Modules
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Send your keyword insights where they'll make an impact across Stackwise modules.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 border">Destination</th>
                    <th className="text-left p-2 border">What's Passed</th>
                    <th className="text-left p-2 border">Purpose</th>
                    <th className="text-left p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dest: 'Strategy Studio (Eval Matrix)', pass: 'Top opportunities, gaps, priorities', purpose: 'Evaluate keyword-driven initiatives' },
                    { dest: 'Content Strategy', pass: 'Pillars, clusters, intent, fit scores', purpose: 'Build content journey grids' },
                    { dest: 'Content Creation', pass: 'Topic & intent data', purpose: 'Create and brief assets' },
                    { dest: 'PulseHub', pass: 'Keyword KPIs, growth metrics', purpose: 'Feed dashboards and 30/60/90 roadmaps' },
                    { dest: 'Flight Deck', pass: 'Actions & priorities', purpose: 'Translate insights into campaign tasks' }
                  ].map((row, i) => (
                    <tr key={i} className="border-t hover:bg-muted/50">
                      <td className="p-2 border font-semibold">{row.dest}</td>
                      <td className="p-2 border text-muted-foreground">{row.pass}</td>
                      <td className="p-2 border text-muted-foreground">{row.purpose}</td>
                      <td className="p-2 border">
                        <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" data-testid={`button-eval-${i}`}>
                          <PlusCircle size={10} className="mr-1" />
                          Add to Eval
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" data-testid="button-export-csv">
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button size="sm" data-testid="button-export-deck">
                  <Save className="h-4 w-4 mr-2" />
                  Export Deck Summary
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen size={16} style={{ color: moduleColor }} />
                Projects Tab Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                All exports, saved insights, and connected module data are automatically available under your <strong>Projects</strong> tab for future reference and integration reuse.
              </p>
              <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                <li>Access exports from <strong>Outputs & Integrations</strong> or any prior Keyword Research steps.</li>
                <li>Each export is version-stamped and tagged with the originating module.</li>
                <li>Projects serve as your single source of truth across BrandCraft modules.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Coaching Footer */}
          <div className="text-xs italic text-muted-foreground border-t pt-3">
            "Use this step to make decisions — not just downloads. Which insights are ready to activate now, and which need review with your team?"
          </div>
        </>
      )}

      {/* STEP 7: Summary */}
      {currentStep === 'summary' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>📊 Keyword Research Summary</h1>
            <p className="text-gray-600">Your complete keyword research overview at a glance</p>
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
                <CardTitle className="text-xs text-muted-foreground">Avg Opportunity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: moduleColor }}>
                  {Math.round(keywords.reduce((sum, k) => sum + k.score, 0) / keywords.length)}
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
                    Complete list of all keywords with key metrics and priority
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
                      <th className="border px-2 py-1">Stage</th>
                      <th className="border px-2 py-1">Pillar</th>
                      <th className="border px-2 py-1">Opp Score</th>
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
                        <td className="border px-2 py-1 text-center">{k.stage}</td>
                        <td className="border px-2 py-1 text-center">{k.pillar}</td>
                        <td className="border px-2 py-1 text-center">
                          <span className={`font-semibold ${
                            k.score >= 80 ? 'text-green-600 dark:text-green-400' :
                            k.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {k.score}
                          </span>
                        </td>
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
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-semibold">{cluster.name}</h4>
                      <p className="text-xs text-muted-foreground">{cluster.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {cluster.keywords.length} keywords
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cluster.subtopics.length} subtopics
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cluster.keywords.slice(0, 5).map((k, i) => (
                      <span key={i} className="bg-background border text-[10px] px-2 py-0.5 rounded">
                        {k}
                      </span>
                    ))}
                    {cluster.keywords.length > 5 && (
                      <span className="text-[10px] text-muted-foreground px-2">
                        +{cluster.keywords.length - 5} more
                      </span>
                    )}
                  </div>
                  {cluster.subtopics.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">Subtopics:</p>
                      <div className="space-y-1">
                        {cluster.subtopics.map((sub) => (
                          <div key={sub.id} className="flex justify-between text-[10px]">
                            <span>{sub.name}</span>
                            <span className="text-muted-foreground">{sub.keywords.length} keywords</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Items Flagged for Eval Matrix */}
          <Card className="border-2" style={{ borderColor: moduleColor }}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star size={16} style={{ color: moduleColor }} />
                Items Flagged for Eval Matrix
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                High-priority insights ready for strategic review in Strategy Studio
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted/30 border rounded-md p-2">
                  <div className="flex items-start gap-2">
                    <PlusCircle size={14} style={{ color: moduleColor }} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">ABM Frameworks Cluster</p>
                      <p className="text-[10px] text-muted-foreground">From: Topic Clusters → Flagged for strategic prioritization</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" data-testid="button-view-eval-1">
                      View in Eval
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 border rounded-md p-2">
                  <div className="flex items-start gap-2">
                    <PlusCircle size={14} style={{ color: moduleColor }} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">Content Strategy Integration</p>
                      <p className="text-[10px] text-muted-foreground">From: Outputs & Integrations → High-impact finding</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" data-testid="button-view-eval-2">
                      View in Eval
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 border rounded-md p-2">
                  <div className="flex items-start gap-2">
                    <PlusCircle size={14} style={{ color: moduleColor }} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">Awareness-Stage Content Gap</p>
                      <p className="text-[10px] text-muted-foreground">From: Keyword & Content Alignment → Strategic gap identified</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" data-testid="button-view-eval-3">
                      View in Eval
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground italic">
                  💡 These items are synced to your Strategy Studio Eval Matrix for priority/risk assessment and 30/60/90 roadmap planning.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={16} style={{ color: moduleColor }} />
                Export & Share
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Download your complete keyword research for presentations, reports, or team collaboration
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start" data-testid="button-export-full-csv">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Full CSV (All Data)
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-export-clusters-only">
                  <Layers className="h-4 w-4 mr-2" />
                  Export Clusters Only
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-export-deck-summary">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Export Deck Summary (PPT-ready)
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-export-eval-items">
                  <Star className="h-4 w-4 mr-2" />
                  Export +Eval Items
                </Button>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  All exports are automatically saved to your <strong>Projects</strong> tab for future reference and version tracking.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" data-testid="button-start-new-research">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start New Research
                </Button>
                <Button variant="outline" size="sm" data-testid="button-go-to-content-strategy">
                  <Link2 className="h-4 w-4 mr-2" />
                  Go to Content Strategy
                </Button>
                <Button variant="outline" size="sm" data-testid="button-go-to-eval-matrix">
                  <ArrowRightCircle className="h-4 w-4 mr-2" />
                  Go to Eval Matrix
                </Button>
                <Button variant="outline" size="sm" data-testid="button-go-to-pulsehub">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Go to PulseHub
                </Button>
              </div>
            </CardContent>
          </Card>
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

