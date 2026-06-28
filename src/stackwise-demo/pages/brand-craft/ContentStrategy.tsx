import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/stackwise-demo/config/modules'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { Plus, Trash2, Upload, Sparkles, FileText, CheckCircle2, Info, Lightbulb, Search, BarChart3, TrendingUp, AlertCircle, Target, Eye, RefreshCw } from 'lucide-react'
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox'
import { Label } from '@/stackwise-demo/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/stackwise-demo/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/stackwise-demo/components/ui/popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/stackwise-demo/components/ui/tabs'

type Goal = {
  id: string
  goal: string
  stage: string
  kpi: string
  outcome: string
}

type Persona = {
  id: string
  name: string
  role: string
  goals: string
  challenges: string
  behaviors: string
}

type ContentEntry = {
  topic: string
  url: string
  status: string
  persona: string
  evergreen: string
  type: string
  score?: number
}

type ContentMap = {
  [stage: string]: ContentEntry[]
}

type JourneyQuestion = {
  question: string
  tip: string
  responses: {
    Awareness: string
    Consideration: string
    Decision: string
    Retention: string
  }
}

type ContentTypeEntry = {
  type: string
  kpi: string
  statement: string
}

type ContentTypeStage = {
  stage: string
  entries: ContentTypeEntry[]
}

type ChannelEntry = {
  channel: string
  purpose: string
  contentType: string
  derivatives: string[]
  persona: string
  tier: string
  type: string
  pillar: string
}

type ChannelStage = {
  stage: string
  entries: ChannelEntry[]
}

type ActivationCell = {
  persona: string
  contentType: string
  journeyStage: string
  channels: string[]
  priority: 'high' | 'medium' | 'low'
}

type ActivationRow = {
  stage: string
  asset: string
  derivatives: string[]
  pillar: string
  cadence: string
  goal: string
  kpi: string
  effort: string
  impact: string
  channels: string
}

export default function ContentStrategy() {
  const module = getModuleById('brand-craft')
  const feature = module?.features?.find(f => f.id === 'content-strategy')
  const [currentStep, setCurrentStep] = useState('goals-objectives')
  const moduleColor = '#c009ba'

  // Goals state
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', goal: '', stage: '', kpi: '', outcome: '' },
    { id: '2', goal: '', stage: '', kpi: '', outcome: '' },
    { id: '3', goal: '', stage: '', kpi: '', outcome: '' }
  ])

  const goalOptions = [
    'Increase Brand Awareness',
    'Establish Thought Leadership',
    'Generate & Nurture Leads',
    'Improve Customer Engagement & Loyalty',
    'Reduce Marketing Costs',
    'Drive Sales & Revenue',
    'Boost SEO & Organic Traffic'
  ]

  const stageOptions = ['Awareness', 'Consideration', 'Decision', 'Retention']

  // Personas state
  const [personas, setPersonas] = useState<Persona[]>([
    { id: '1', name: '', role: '', goals: '', challenges: '', behaviors: '' },
    { id: '2', name: '', role: '', goals: '', challenges: '', behaviors: '' }
  ])

  // Content Inventory state - stage-based mapping
  const contentStages = ['Awareness', 'Consideration', 'Decision', 'Retention']
  const emptyEntry = (): ContentEntry => ({ topic: '', url: '', status: '', persona: '', evergreen: '', type: '' })
  
  const [contentMap, setContentMap] = useState<ContentMap>({
    'Awareness': [emptyEntry(), emptyEntry()],
    'Consideration': [emptyEntry(), emptyEntry()],
    'Decision': [emptyEntry(), emptyEntry()],
    'Retention': [emptyEntry(), emptyEntry()]
  })

  const [showGaps, setShowGaps] = useState(false)
  const [gapInsights, setGapInsights] = useState<{ findings: string[], recs: string[] }>({ findings: [], recs: [] })
  
  // Automated Scanning State
  const [enableWebsiteCrawl, setEnableWebsiteCrawl] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [enableFileUpload, setEnableFileUpload] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const contentTypeOptions = [
    'Blog', 'Guide', 'Case Study', 'Video', 'Webinar', 'Infographic',
    'Email', 'Landing Page', 'Social Post', 'Podcast', 'Whitepaper', 'Article'
  ]
  const statusOptions = ['Keep', 'Refresh', 'Archive']
  const evergreenOptions = ['Evergreen', 'Campaign']

  // Journey Mapping state - 6 consolidated strategic questions across 4 stages
  const journeyStages = ['Awareness', 'Consideration', 'Decision', 'Retention']
  const journeyQuestions = [
    { q: 'What are they thinking & feeling?', tip: 'Their awareness, concerns, confidence level, and emotional state at this stage' },
    { q: 'What are they doing & where are they looking?', tip: 'Their actions, research behaviors, and where they seek information' },
    { q: 'What do they need from us to move forward?', tip: 'The content, messages, or resources that help them progress' },
    { q: "What's blocking or slowing them down?", tip: 'Objections, concerns, barriers, or obstacles preventing progress' },
    { q: 'What triggers readiness & what are the signals?', tip: 'What sparks their interest AND what signals they\'re ready to advance' },
    { q: 'What action do we want & what does success look like?', tip: 'Our desired action for them AND what success means from their perspective' }
  ]

  const [journeyMap, setJourneyMap] = useState<JourneyQuestion[]>(
    journeyQuestions.map(q => ({
      question: q.q,
      tip: q.tip,
      responses: { Awareness: '', Consideration: '', Decision: '', Retention: '' }
    }))
  )
  
  const [showJourneyInsights, setShowJourneyInsights] = useState(false)

  // Content Type Planning state - matrix approach
  const contentPlanningStages = ['Awareness', 'Consideration', 'Conversion', 'Retention']
  
  const suggestedContentTypes = {
    'Awareness': ['Blog / Article', 'Infographic', 'Short-form Video / Social'],
    'Consideration': ['eBook / Guide', 'Webinar / Live Session', 'Case Study (Short)'],
    'Conversion': ['Landing Page', 'Product Sheet / One-Pager', 'Demo Video / Consultation'],
    'Retention': ['Email Newsletter', 'Customer Story', 'Podcast']
  }

  const globalContentList = [
    'Blog / Article', 'Infographic', 'Short-form Video / Social',
    'eBook / Guide', 'Webinar / Live Session', 'Case Study (Short)',
    'Case Study (Long)', 'Landing Page', 'Product Sheet / One-Pager',
    'Demo Video / Consultation', 'Email Newsletter', 'Customer Story', 'Podcast'
  ]

  const stageKPIs = {
    'Awareness': ['Traffic', 'Engagement', 'Authority'],
    'Consideration': ['Leads', 'Time on Site', 'Engagement'],
    'Conversion': ['Conversions', 'Sales Calls'],
    'Retention': ['CLV', 'Referrals', 'Loyalty']
  }

  const [contentTypeMatrix, setContentTypeMatrix] = useState<ContentTypeStage[]>(
    contentPlanningStages.map(stage => ({
      stage,
      entries: [
        { type: '', kpi: '', statement: '' },
        { type: '', kpi: '', statement: '' },
        { type: '', kpi: '', statement: '' }
      ]
    }))
  )

  const [showContentGaps, setShowContentGaps] = useState(false)
  const [contentTypeGapInsights, setContentTypeGapInsights] = useState<{
    insights: string[]
    recommendations: string[]
  }>({ insights: [], recommendations: [] })

  // Channel Planning state - grid approach
  const channelPlanningStages = ['Awareness', 'Consideration', 'Conversion', 'Retention']
  
  const suggestedChannels = {
    'Awareness': ['LinkedIn', 'YouTube', 'TikTok', 'Blog', 'Display', 'PR'],
    'Consideration': ['Email', 'LinkedIn', 'YouTube', 'Webinars', 'Retargeting', 'Industry Sites'],
    'Conversion': ['Email Nurture', 'Website Landing Page', 'Retargeting', 'Demo Calls', 'LinkedIn DM'],
    'Retention': ['Email', 'Podcast', 'Customer Community', 'Slack Group', 'Customer Events', 'LinkedIn']
  }

  const purposeOptions = ['Educate', 'Nurture', 'Convert', 'Retain']
  const contentFitOptions = [
    'Visual storytelling', 
    'Trust-building', 
    'Community-driven', 
    'Short-form', 
    'Long-form',
    'Brand',
    'Education',
    'Nurture',
    'Demand Gen',
    'Product Launch',
    'Thought Leadership',
    'Community',
    'Paid/Organic Mix'
  ]
  const tierOptions = ['Core', 'Campaign', 'Test']
  const channelTypeOptions = ['Organic', 'Paid', 'Hybrid']

  // Pillar options (from Messaging House)
  const pillarOptions = ['Product Innovation', 'Thought Leadership', 'Customer Success', 'Industry Insights', 'Best Practices']

  const [channelMatrix, setChannelMatrix] = useState<ChannelStage[]>(
    channelPlanningStages.map(stage => ({
      stage,
      entries: [
        { channel: '', purpose: '', contentType: '', derivatives: [], persona: '', tier: '', type: '', pillar: '' },
        { channel: '', purpose: '', contentType: '', derivatives: [], persona: '', tier: '', type: '', pillar: '' },
        { channel: '', purpose: '', contentType: '', derivatives: [], persona: '', tier: '', type: '', pillar: '' }
      ]
    }))
  )

  const [showChannelGaps, setShowChannelGaps] = useState(false)
  const [channelGapInsights, setChannelGapInsights] = useState<{
    insights: string[]
    recommendations: string[]
  }>({ insights: [], recommendations: [] })

  // Row selection state for Content Planning
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Activation Grid state
  const activationStages = ['Awareness', 'Consideration', 'Conversion', 'Retention']
  const goalOptionsActivation = ['Brand Awareness', 'Lead Generation', 'Demand Capture', 'Engagement', 'Thought Leadership', 'Retention']
  const kpiOptionsActivation = ['Impressions', 'CTR', 'Form Fills', 'Engagement', 'Leads', 'Conversions']
  const effortOptions = ['Low', 'Medium', 'High']
  const impactOptions = ['Low', 'Medium', 'High']
  const cadenceOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Evergreen']
  const channelOptionsActivation = ['LinkedIn', 'YouTube', 'TikTok', 'Email', 'Webinar', 'Podcast', 'Display', 'PR', 'Website', 'Newsletter', 'Community', 'Slack', 'Events']
  const derivativeOptions = ['Blog', 'Social Post', 'Video', 'Email', 'Webinar', 'Infographic', 'Podcast', 'Whitepaper', 'Case Study', 'Guide']
  
  const [activationRows, setActivationRows] = useState<ActivationRow[]>(
    activationStages.map(stage => ({
      stage,
      asset: '',
      derivatives: ['', '', ''],
      pillar: '',
      cadence: '',
      goal: '',
      kpi: '',
      effort: '',
      impact: '',
      channels: ''
    }))
  )

  // Generate Strategy state
  const [strategyDocument, setStrategyDocument] = useState('')
  const [executiveSummary, setExecutiveSummary] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)

  // Auto-populate strategy document
  const generateDraftDocument = () => {
    const selectedContentTypes = contentTypeMatrix.flatMap(s => 
      s.entries.filter(e => e.type).map(e => e.type)
    ).filter((v, i, a) => a.indexOf(v) === i) // unique types
    
    const selectedChannels = channelMatrix.flatMap(s =>
      s.entries.filter(e => e.channel).map(e => e.channel)
    ).filter((v, i, a) => a.indexOf(v) === i) // unique channels
    
    const draft = `# Content Strategy Document

## Executive Summary
This content strategy outlines our approach to content marketing based on ${goals.length} defined goals, targeting ${personas.length} key personas across ${selectedContentTypes.length} content formats and ${selectedChannels.length} distribution channels.

## Goals & Objectives
${goals.filter(g => g.goal).length > 0 ? goals.filter(g => g.goal).map(g => `- **${g.goal}** (${g.stage})
  - KPI: ${g.kpi}
  - Expected Outcome: ${g.outcome}`).join('\n') : 'No goals defined yet.'}

## Target Personas
${personas.filter(p => p.name).length > 0 ? personas.filter(p => p.name).map(p => `### ${p.name}
- Role: ${p.role}
- Goals & Motivations: ${p.goals}
- Challenges & Pain Points: ${p.challenges}
- Behaviors & Buying Triggers: ${p.behaviors}`).join('\n\n') : 'No personas created yet.'}

## Content Inventory Analysis
Content mapped across ${contentStages.length} customer journey stages:

${contentStages.map(stage => {
  const entries = contentMap[stage].filter(e => e.topic || e.url)
  return `### ${stage}
${entries.length > 0 ? entries.map(e => `- **${e.topic || 'Untitled'}** ${e.type ? `(${e.type})` : ''} - Status: ${e.status || 'N/A'} | Persona: ${e.persona || 'N/A'} | ${e.evergreen || 'N/A'}`).join('\n') : 'No content identified yet.'}`
}).join('\n\n')}

## Customer Journey Mapping
Buyer journey insights captured across ${journeyStages.length} stages:

${journeyStages.map(stage => {
  const responses = journeyMap.filter(q => q.responses[stage as keyof JourneyQuestion['responses']]).slice(0, 3)
  return `### ${stage}
${responses.length > 0 ? responses.map(r => `**${r.question}**\n${r.responses[stage as keyof JourneyQuestion['responses']]}`).join('\n\n') : 'No journey insights captured yet.'}`
}).join('\n\n')}

## Content Type Strategy
We will focus on the following content formats mapped to journey stages:

${contentTypeMatrix.map(stageData => {
  const filledEntries = stageData.entries.filter(e => e.type && e.kpi)
  return `### ${stageData.stage}
${filledEntries.length > 0 ? filledEntries.map(e => `- **${e.type}** → ${e.kpi}${e.statement ? `: ${e.statement}` : ''}`).join('\n') : 'No content types defined yet.'}`
}).join('\n\n')}

## Distribution Channels
Our channel strategy mapped to journey stages:

${channelMatrix.map(stageData => {
  const filledChannels = stageData.entries.filter(e => e.channel)
  return `### ${stageData.stage}
${filledChannels.length > 0 ? filledChannels.map(e => `- **${e.channel}** (${e.type || 'N/A'}) → ${e.purpose || 'Purpose TBD'} | Tier: ${e.tier || 'N/A'} | Content Type: ${e.contentType || 'N/A'} | Persona: ${e.persona || 'N/A'}`).join('\n') : 'No channels defined yet.'}`
}).join('\n\n')}

## Activation Grid
${personas.length > 0 && selectedContentTypes.length > 0 ? `Our content activation plan connects personas, content types, journey stages, and channels to ensure maximum impact.` : 'Complete previous steps to view your activation grid.'}

## Next Steps
1. Review and refine this strategy document
2. Share with stakeholders for feedback
3. Begin content production based on identified gaps
4. Monitor performance against defined metrics
5. Iterate and optimize based on results`

    return draft
  }

  // Initialize draft when step loads
  if (currentStep === 'generate-strategy' && strategyDocument === '') {
    setStrategyDocument(generateDraftDocument())
  }

  // Generate Executive Summary
  const generateExecutiveSummary = () => {
    const topGoals = goals.filter(g => g.goal).slice(0, 3)
    const topPersonas = personas.filter(p => p.name).slice(0, 2)
    const selectedContentTypes = contentTypeMatrix.flatMap(s => 
      s.entries.filter(e => e.type).map(e => e.type)
    ).filter((v, i, a) => a.indexOf(v) === i)
    const selectedChannels = channelMatrix.flatMap(s =>
      s.entries.filter(e => e.channel).map(e => e.channel)
    ).filter((v, i, a) => a.indexOf(v) === i)
    
    const summary = `# Executive Summary

## Strategic Overview
This content strategy outlines our approach to content marketing across ${contentStages.length} key journey stages. We're targeting ${personas.filter(p => p.name).length} core personas with ${selectedContentTypes.length} content formats distributed through ${selectedChannels.length} primary channels.

## Primary Goals
${topGoals.length > 0 ? topGoals.map(g => `- **${g.goal}** (${g.stage})
  - KPI: ${g.kpi}
  - Expected Outcome: ${g.outcome}`).join('\n') : '- No goals defined'}

## Target Personas
${topPersonas.length > 0 ? topPersonas.map(p => `- **${p.name}** (${p.role}) — ${p.goals ? p.goals.substring(0, 80) + '...' : 'Goals TBD'}`).join('\n') : '- No personas defined'}

## Content Priorities by Stage
${contentTypeMatrix.map(stageData => {
  const filledEntries = stageData.entries.filter(e => e.type && e.kpi)
  return `**${stageData.stage}:** ${filledEntries.length > 0 ? filledEntries.map(e => e.type).join(', ') : 'TBD'}`
}).join('\n')}

## Primary Channels
${selectedChannels.slice(0, 5).join(', ')}${selectedChannels.length > 5 ? ` (and ${selectedChannels.length - 5} more)` : ''}

## Content Activation Highlights
${activationRows.filter(r => r.asset).length > 0 ? `${activationRows.filter(r => r.asset).length} core assets mapped to ${activationStages.length} journey stages with defined goals, KPIs, and distribution plans.` : 'Complete Activation Grid to see highlights'}

## Next Steps
1. Review and validate this strategy with stakeholders
2. Prioritize content production based on identified gaps
3. Establish content calendar and assignment workflow
4. Monitor performance against defined KPIs
5. Schedule quarterly strategy reviews for optimization`

    return summary
  }

  const handleGenerate = () => {
    const comprehensive = generateDraftDocument()
    const summary = generateExecutiveSummary()
    
    setStrategyDocument(comprehensive)
    setExecutiveSummary(summary)
    setIsGenerated(true)
  }

  // Goal handlers
  const updateGoal = (id: string, field: keyof Goal, value: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  const addGoal = () => {
    setGoals([...goals, { id: Date.now().toString(), goal: '', stage: '', kpi: '', outcome: '' }])
  }

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  // Persona handlers
  const updatePersona = (id: string, field: keyof Persona, value: string) => {
    setPersonas(personas.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const addPersona = () => {
    setPersonas([...personas, { id: Date.now().toString(), name: '', role: '', goals: '', challenges: '', behaviors: '' }])
  }

  const removePersona = (id: string) => {
    if (personas.length > 2) {
      setPersonas(personas.filter(p => p.id !== id))
    }
  }

  // Content Map handlers
  const updateContentEntry = (stage: string, index: number, field: keyof ContentEntry, value: string) => {
    setContentMap(prev => {
      const next = { ...prev }
      const rows = [...next[stage]]
      const row = { ...rows[index], [field]: value }
      rows[index] = row
      next[stage] = rows
      return next
    })
  }

  // Journey Map handlers
  const updateJourneyResponse = (questionIndex: number, stage: keyof JourneyQuestion['responses'], value: string) => {
    setJourneyMap(prev => {
      const next = [...prev]
      next[questionIndex] = {
        ...next[questionIndex],
        responses: {
          ...next[questionIndex].responses,
          [stage]: value
        }
      }
      return next
    })
  }

  const analyzeJourneyInsights = () => {
    setShowJourneyInsights(true)
  }

  // Gap analysis
  const analyzeGaps = () => {
    const findings: string[] = []
    const recs: string[] = []

    contentStages.forEach(stage => {
      const rows = contentMap[stage]
      const filled = rows.filter(r => r.topic || r.url || r.persona)
      
      if (filled.length === 0) {
        findings.push(`${stage}: No content entries added.`)
        recs.push(`Add at least one ${stage.toLowerCase()}-stage asset (e.g., ${stage === 'Decision' ? 'Case Study' : stage === 'Awareness' ? 'Blog or Podcast' : 'Guide or Webinar'}).`)
      }
      
      // Persona coverage
      const covered = new Set(rows.map(r => r.persona).filter(Boolean))
      if (covered.size < 1 && filled.length > 0) {
        findings.push(`${stage}: No persona coverage selected.`)
        const p0 = personas[0]?.name || 'a primary persona'
        recs.push(`Assign at least one entry to ${p0} at ${stage} stage.`)
      }
      
      // Variety of types
      const types = new Set(rows.map(r => r.type).filter(Boolean))
      if (types.size === 1 && filled.length > 1) {
        const onlyType = rows.find(r => r.type)?.type
        findings.push(`${stage}: Single content type (${onlyType}).`)
        const alt = contentTypeOptions.find(t => t !== onlyType) || 'Video'
        recs.push(`Add another format at ${stage} to diversify (e.g., ${alt}).`)
      }
      
      // Evergreen/Campaign balance
      const e = rows.filter(r => r.evergreen === 'Evergreen').length
      const c = rows.filter(r => r.evergreen === 'Campaign').length
      if (e > 0 && c === 0 && filled.length > 1) {
        findings.push(`${stage}: All assets marked Evergreen.`)
        recs.push(`Introduce a Campaign asset at ${stage} to test time-bound offers.`)
      }
    })

    setGapInsights({ findings, recs })
    setShowGaps(true)
  }

  // Content Type Matrix handlers
  const updateContentTypeEntry = (stageIndex: number, entryIndex: number, field: keyof ContentTypeEntry, value: string) => {
    setContentTypeMatrix(prev => {
      const next = [...prev]
      next[stageIndex] = {
        ...next[stageIndex],
        entries: next[stageIndex].entries.map((entry, idx) =>
          idx === entryIndex ? { ...entry, [field]: value } : entry
        )
      }
      return next
    })
  }

  const analyzeContentGaps = () => {
    const insights: string[] = []
    const recommendations: string[] = []

    // 1. Analyze matrix completeness
    contentTypeMatrix.forEach(stageData => {
      const filledEntries = stageData.entries.filter(e => e.type && e.kpi)
      const completeStatements = stageData.entries.filter(e => e.statement.trim())
      
      if (filledEntries.length === 0) {
        insights.push(`${stageData.stage}: No content types selected`)
        recommendations.push(`Add at least 2-3 content types for ${stageData.stage} stage`)
      } else if (filledEntries.length < 2) {
        insights.push(`${stageData.stage}: Only ${filledEntries.length} content type selected`)
        recommendations.push(`Consider adding more variety to ${stageData.stage} stage`)
      }

      if (completeStatements.length < filledEntries.length) {
        recommendations.push(`${stageData.stage}: ${filledEntries.length - completeStatements.length} entries missing custom statements`)
      }
    })

    // 2. Check format diversity
    const allTypes = contentTypeMatrix.flatMap(s => s.entries.filter(e => e.type).map(e => e.type))
    const visualFormats = ['Infographic', 'Short-form Video / Social', 'Demo Video / Consultation']
    const interactiveFormats = ['Webinar / Live Session', 'Podcast']
    const writtenFormats = ['Blog / Article', 'eBook / Guide', 'Case Study (Short)', 'Case Study (Long)', 'Email Newsletter']
    
    const hasVisual = allTypes.some(t => visualFormats.includes(t))
    const hasInteractive = allTypes.some(t => interactiveFormats.includes(t))
    const hasWritten = allTypes.some(t => writtenFormats.includes(t))

    if (!hasVisual) {
      insights.push('No visual content formats selected')
      recommendations.push('Add visual formats (Infographics, Videos) to increase engagement and shareability')
    }
    if (!hasInteractive) {
      insights.push('No interactive content formats selected')
      recommendations.push('Consider adding Webinars or Podcasts for deeper audience connection')
    }

    // 3. Cross-reference with Personas
    const filledPersonas = personas.filter(p => p.name.trim() || p.role.trim() || p.behaviors.trim())
    if (filledPersonas.length > 0) {
      filledPersonas.forEach(persona => {
        const behaviorText = persona.behaviors.toLowerCase()
        const goalsText = persona.goals.toLowerCase()
        
        if ((behaviorText.includes('video') || goalsText.includes('video')) && !hasVisual) {
          recommendations.push(`${persona.name || 'Persona'} prefers video content - consider adding video formats`)
        }
        if (behaviorText.includes('webinar') || behaviorText.includes('live session') || goalsText.includes('webinar')) {
          const hasWebinar = allTypes.includes('Webinar / Live Session')
          if (!hasWebinar) {
            recommendations.push(`${persona.name || 'Persona'} responds to webinars - add to Consideration stage`)
          }
        }
        if (behaviorText.includes('case study') || behaviorText.includes('proof') || goalsText.includes('evidence')) {
          const hasCaseStudy = allTypes.some(t => t.includes('Case Study'))
          if (!hasCaseStudy) {
            recommendations.push(`${persona.name || 'Persona'} needs proof points - add case studies to Consideration/Conversion`)
          }
        }
      })
    }

    // 4. Cross-reference with Goals
    const filledGoals = goals.filter(g => g.goal.trim())
    filledGoals.forEach(goal => {
      const goalLower = goal.goal.toLowerCase()
      if (goalLower.includes('awareness') || goalLower.includes('traffic')) {
        const awarenessEntries = contentTypeMatrix.find(s => s.stage === 'Awareness')?.entries.filter(e => e.type) || []
        if (awarenessEntries.length < 2) {
          recommendations.push(`Goal "${goal.goal}" requires strong Awareness content - add more top-funnel formats`)
        }
      }
      if (goalLower.includes('lead') || goalLower.includes('conversion')) {
        const conversionEntries = contentTypeMatrix.find(s => s.stage === 'Conversion')?.entries.filter(e => e.type) || []
        if (conversionEntries.length < 2) {
          recommendations.push(`Goal "${goal.goal}" needs conversion-focused content - strengthen Conversion stage`)
        }
      }
      if (goalLower.includes('retention') || goalLower.includes('loyalty')) {
        const retentionEntries = contentTypeMatrix.find(s => s.stage === 'Retention')?.entries.filter(e => e.type) || []
        if (retentionEntries.length === 0) {
          recommendations.push(`Goal "${goal.goal}" requires Retention content - add newsletters or customer stories`)
        }
      }
    })

    // 5. Journey Mapping cross-check
    const journeyQuestionsWithContent = journeyMap.filter(q => {
      const responses = q.responses
      return Object.values(responses).some(r => 
        typeof r === 'string' && (r.toLowerCase().includes('content') || r.toLowerCase().includes('resource'))
      )
    })
    
    if (journeyQuestionsWithContent.length > 0) {
      journeyQuestionsWithContent.forEach(q => {
        const responses = Object.entries(q.responses) as [string, string][]
        responses.forEach(([stage, response]) => {
          if (typeof response === 'string' && response.toLowerCase().includes('webinar')) {
            const hasWebinarInStage = contentTypeMatrix.find(s => s.stage === stage)?.entries.some(e => e.type.includes('Webinar'))
            if (!hasWebinarInStage) {
              recommendations.push(`Journey mapping suggests webinar for ${stage} - not reflected in content types`)
            }
          }
        })
      })
    }

    // 6. Stage balance check
    const stageCounts = contentTypeMatrix.map(s => ({
      stage: s.stage,
      count: s.entries.filter(e => e.type && e.kpi).length
    }))
    const maxCount = Math.max(...stageCounts.map(s => s.count))
    const minCount = Math.min(...stageCounts.map(s => s.count))
    
    if (maxCount - minCount > 2) {
      const lightStages = stageCounts.filter(s => s.count === minCount).map(s => s.stage)
      insights.push(`Unbalanced coverage across stages`)
      recommendations.push(`${lightStages.join(', ')} ${lightStages.length > 1 ? 'are' : 'is'} underserved - balance content distribution`)
    }

    setContentTypeGapInsights({ insights, recommendations })
    setShowContentGaps(true)
  }

  // Activation Grid handlers
  const updateActivationRow = (index: number, field: keyof ActivationRow, value: string) => {
    setActivationRows(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const updateActivationDerivative = (rowIndex: number, derivativeIndex: number, value: string) => {
    setActivationRows(prev => {
      const next = [...prev]
      const newDerivatives = [...next[rowIndex].derivatives]
      newDerivatives[derivativeIndex] = value
      next[rowIndex] = { ...next[rowIndex], derivatives: newDerivatives }
      return next
    })
  }

  const pullFromContentIdentification = (stageIndex: number) => {
    // Find content from the content identification step for this stage
    const stage = activationStages[stageIndex]
    const stageContent = contentMap[stage] || []
    const firstContent = stageContent.find(c => c.topic || c.type)
    
    if (firstContent) {
      updateActivationRow(stageIndex, 'asset', firstContent.topic || firstContent.type || 'Content from Identification')
    } else {
      updateActivationRow(stageIndex, 'asset', 'Pulled from Content Identification')
    }
  }

  // Channel Matrix handlers
  const updateChannelEntry = (stageIndex: number, entryIndex: number, field: keyof ChannelEntry, value: string | string[]) => {
    setChannelMatrix(prev => {
      const next = [...prev]
      next[stageIndex] = {
        ...next[stageIndex],
        entries: next[stageIndex].entries.map((entry, idx) =>
          idx === entryIndex ? { ...entry, [field]: value } : entry
        )
      }
      return next
    })
  }

  // Row selection helpers
  const toggleRowSelection = (stageIndex: number, entryIndex: number) => {
    const rowId = `${stageIndex}-${entryIndex}`
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === channelMatrix.length * 3) {
      setSelectedRows(new Set())
    } else {
      const allRows = new Set<string>()
      channelMatrix.forEach((_, stageIndex) => {
        for (let entryIndex = 0; entryIndex < 3; entryIndex++) {
          allRows.add(`${stageIndex}-${entryIndex}`)
        }
      })
      setSelectedRows(allRows)
    }
  }

  const sendToEvalMatrix = () => {
    if (selectedRows.size === 0) {
      alert('Please select at least one row to send to Eval Matrix')
      return
    }
    
    // TODO: Implement actual send to Eval Matrix functionality
    alert(`Sending ${selectedRows.size} selected content play(s) to Eval Matrix for HITL approval`)
  }

  const analyzeChannelGaps = () => {
    const insights: string[] = []
    const recommendations: string[] = []

    // 1. Check stage completeness
    channelMatrix.forEach(stageData => {
      const filledChannels = stageData.entries.filter(e => e.channel)
      
      if (filledChannels.length === 0) {
        insights.push(`${stageData.stage}: No channels selected`)
        recommendations.push(`Add at least 2-3 channels for ${stageData.stage} stage`)
      } else if (filledChannels.length < 2) {
        insights.push(`${stageData.stage}: Only ${filledChannels.length} channel selected`)
        recommendations.push(`Consider adding more channels to ${stageData.stage} for better reach`)
      }

      // Check for incomplete entries
      const incompleteEntries = filledChannels.filter(e => !e.purpose || !e.tier || !e.type)
      if (incompleteEntries.length > 0) {
        recommendations.push(`${stageData.stage}: ${incompleteEntries.length} channel(s) missing purpose, tier, or type`)
      }
    })

    // 2. Paid vs Organic balance
    const allChannels = channelMatrix.flatMap(s => s.entries.filter(e => e.channel && e.type))
    const paidCount = allChannels.filter(e => e.type === 'Paid').length
    const organicCount = allChannels.filter(e => e.type === 'Organic').length
    const hybridCount = allChannels.filter(e => e.type === 'Hybrid').length

    if (paidCount === 0 && organicCount === 0 && hybridCount === 0) {
      // No types selected yet
    } else if (paidCount > organicCount * 2) {
      insights.push('Heavy reliance on paid channels')
      recommendations.push('Balance with more organic channels for sustainable long-term growth')
    } else if (organicCount > paidCount * 2 && paidCount === 0) {
      insights.push('Fully organic strategy')
      recommendations.push('Consider adding paid channels for faster scaling and targeting precision')
    }

    // 3. Core channel continuity
    const coreChannels = channelMatrix.flatMap(s => 
      s.entries.filter(e => e.tier === 'Core').map(e => ({ stage: s.stage, channel: e.channel }))
    )
    
    const channelNames = coreChannels.map(c => c.channel)
    const uniqueChannelNames = Array.from(new Set(channelNames))
    const recurring = uniqueChannelNames.filter(name => 
      channelNames.filter(n => n === name).length > 1
    )

    if (coreChannels.length > 0 && recurring.length === 0) {
      insights.push('No consistent core channels across stages')
      recommendations.push('Consider using 1-2 core channels across multiple stages for continuity (e.g., LinkedIn, Email)')
    } else if (recurring.length > 0) {
      insights.push(`Good continuity: ${recurring.join(', ')} used across multiple stages`)
    }

    // 4. Cross-reference with content types
    const selectedContentTypes = contentTypeMatrix.flatMap(s => 
      s.entries.filter(e => e.type).map(e => e.type)
    )
    
    const hasVideo = selectedContentTypes.some(t => t.toLowerCase().includes('video'))
    const hasWebinar = selectedContentTypes.some(t => t.toLowerCase().includes('webinar'))
    const hasPodcast = selectedContentTypes.some(t => t.toLowerCase().includes('podcast'))

    const selectedChannelNames = channelMatrix.flatMap(s => s.entries.filter(e => e.channel).map(e => e.channel.toLowerCase()))
    
    if (hasVideo && !selectedChannelNames.some(c => c.includes('youtube') || c.includes('tiktok'))) {
      recommendations.push('You have video content but no video-focused channels (YouTube, TikTok)')
    }
    
    if (hasWebinar && !selectedChannelNames.some(c => c.includes('webinar') || c.includes('email'))) {
      recommendations.push('You have webinars in content mix - ensure Webinars + Email channels for promotion and nurture')
    }
    
    if (hasPodcast && !selectedChannelNames.some(c => c.includes('podcast'))) {
      recommendations.push('You have podcast content but Podcast channel not selected for distribution')
    }

    // 5. Stage-specific recommendations
    const retentionChannels = channelMatrix.find(s => s.stage === 'Retention')?.entries.filter(e => e.channel) || []
    if (retentionChannels.length === 0) {
      insights.push('No retention channels selected')
      recommendations.push('Add retention-focused channels (Email, Community, Podcast) to maintain customer relationships')
    }

    setChannelGapInsights({ insights, recommendations })
    setShowChannelGaps(true)
  }

  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Brand Craft</h2>
    </div>
  )

  const content = (
    <div className="p-8 space-y-6 brandcraft-buttons">
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

      {/* STEP 1: Goals & Objectives */}
      {currentStep === 'goals-objectives' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Goals & Objectives</h1>
            <p className="text-muted-foreground">Define clear goals that map to measurable KPIs and outcomes</p>
          </div>

          {/* Welcome Message */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-3" style={{ color: moduleColor }}>Welcome to Content Strategy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're working through a series of guided exercises designed to help you build a comprehensive content strategy. 
                This strategy will serve as your roadmap as you create content, plan campaigns, and make strategic marketing decisions.
              </p>
              
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-foreground">What to expect:</p>
                <ul className="space-y-1 text-muted-foreground pl-5">
                  <li><strong className="text-foreground">Goals & Objectives</strong> — Define what success looks like</li>
                  <li><strong className="text-foreground">Audiences & Personas</strong> — Identify who you're talking to and how</li>
                  <li><strong className="text-foreground">Content Identification & Gaps</strong> — Discover what content you need</li>
                  <li><strong className="text-foreground">Journey Mapping</strong> — Understand buyer questions at each stage</li>
                  <li><strong className="text-foreground">Content Planning</strong> — Map content types and channels to the journey</li>
                  <li><strong className="text-foreground">Activation Grid</strong> — Plan your content execution and distribution</li>
                  <li><strong className="text-foreground">Generate Strategy</strong> — Pull it all together into a unified plan</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground mt-4 italic">
                Take your time with each step — your answers will build on each other to create a strategy tailored to your business.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Marketing Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Before you start content planning, define clear goals that map to measurable KPIs and outcomes. Each goal should connect back to your business objectives and customer journey stage.
              </p>

              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <p className="text-sm">
                      <strong>Coaching Prompt:</strong> Define 2-3 goals connecting business objectives to journey stages, with KPIs that measure success in tangible terms (pipeline, engagement, retention).
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-4 gap-3 text-sm font-semibold" style={{ color: moduleColor }}>
                <div>Goal</div>
                <div>Stage</div>
                <div>KPI</div>
                <div>Outcome</div>
              </div>

              {goals.map((goal) => (
                <div key={goal.id} className="grid grid-cols-4 gap-3 items-start">
                  <Select value={goal.goal} onValueChange={(val) => updateGoal(goal.id, 'goal', val)}>
                    <SelectTrigger data-testid={`select-goal-${goal.id}`}>
                      <SelectValue placeholder="Select Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={goal.stage} onValueChange={(val) => updateGoal(goal.id, 'stage', val)}>
                    <SelectTrigger data-testid={`select-stage-${goal.id}`}>
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="KPI (e.g., CTR, MQLs, Conversions)"
                    value={goal.kpi}
                    onChange={(e) => updateGoal(goal.id, 'kpi', e.target.value)}
                    data-testid={`input-kpi-${goal.id}`}
                  />

                  <div className="flex gap-2">
                    <Input
                      placeholder="Expected Outcome (e.g., +10% conversions)"
                      value={goal.outcome}
                      onChange={(e) => updateGoal(goal.id, 'outcome', e.target.value)}
                      className="flex-1"
                      data-testid={`input-outcome-${goal.id}`}
                    />
                    {goals.length > 3 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeGoal(goal.id)}
                        data-testid={`button-remove-goal-${goal.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button onClick={addGoal} size="sm" variant="outline" data-testid="button-add-goal">
                <Plus className="h-4 w-4 mr-2" />
                Add More Goals
              </Button>

              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4" style={{ color: moduleColor }}>Example Goals & KPIs</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { title: 'Increase Brand Awareness', desc: 'KPIs: reach, impressions, branded search volume. Expected outcome: +30% traffic growth.' },
                    { title: 'Establish Thought Leadership', desc: 'KPIs: backlinks, content shares, expert mentions. Expected outcome: improved authority score.' },
                    { title: 'Generate & Nurture Leads', desc: 'KPIs: MQLs, form fills, demo requests. Outcome: 15% lift in conversion rate.' },
                    { title: 'Improve Engagement & Loyalty', desc: 'KPIs: CTR, repeat visitors, email opens. Outcome: 20% higher retention.' },
                    { title: 'Reduce Marketing Costs', desc: 'KPIs: support ticket reduction, CAC. Outcome: 10% cost savings.' },
                    { title: 'Drive Sales & Revenue', desc: 'KPIs: pipeline growth, revenue attribution. Outcome: $250k in influenced revenue.' },
                    { title: 'Boost SEO & Organic Traffic', desc: 'KPIs: keyword rank, organic sessions. Outcome: +25% new users from search.' }
                  ].map((example, idx) => (
                    <div key={idx} className="bg-card border rounded-lg p-3 shadow-sm">
                      <h5 className="font-semibold text-sm mb-1" style={{ color: moduleColor }}>{example.title}</h5>
                      <p className="text-muted-foreground text-xs">{example.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 2: Audiences & Personas */}
      {currentStep === 'audiences-personas' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Audiences & Personas</h1>
            <p className="text-muted-foreground">Build personas to guide content strategy and tone with real behavioral insights</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Target Personas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Define your audiences. Build personas to guide content strategy and tone. Add real behavioral and emotional insights.
              </p>

              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <p className="text-sm">
                      <strong>Coaching Prompt:</strong> Build 2-3 detailed personas representing core customers. Focus on real behavioral insights, motivations, and buying triggers—not assumptions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personas.map((persona, index) => (
                  <div key={persona.id} className="bg-card border rounded-lg p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold" style={{ color: moduleColor }}>
                        {index === 0 ? 'Primary Persona' : 'Secondary Persona'} — focus on {index === 0 ? 'your main buyer or user group' : 'secondary influencers or decision supporters'}
                      </div>
                      {personas.length > 2 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePersona(persona.id)}
                          data-testid={`button-remove-persona-${persona.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Persona Name</Label>
                      <Input
                        placeholder="e.g., Marketing Manager Mia"
                        value={persona.name}
                        onChange={(e) => updatePersona(persona.id, 'name', e.target.value)}
                        data-testid={`input-persona-name-${persona.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Role / Job Title</Label>
                      <Input
                        placeholder="Who are they? e.g., Director of Operations"
                        value={persona.role}
                        onChange={(e) => updatePersona(persona.id, 'role', e.target.value)}
                        data-testid={`input-persona-role-${persona.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Goals & Motivations</Label>
                      <Textarea
                        placeholder="What are they trying to achieve? What does success look like for them?"
                        value={persona.goals}
                        onChange={(e) => updatePersona(persona.id, 'goals', e.target.value)}
                        data-testid={`input-persona-goals-${persona.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Challenges & Pain Points</Label>
                      <Textarea
                        placeholder="What gets in their way? What frustrations or blockers do they face?"
                        value={persona.challenges}
                        onChange={(e) => updatePersona(persona.id, 'challenges', e.target.value)}
                        data-testid={`input-persona-challenges-${persona.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Behaviors & Buying Triggers</Label>
                      <Textarea
                        placeholder="How do they research? What triggers action or engagement?"
                        value={persona.behaviors}
                        onChange={(e) => updatePersona(persona.id, 'behaviors', e.target.value)}
                        data-testid={`input-persona-behaviors-${persona.id}`}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs flex items-center gap-2" data-testid={`button-generate-persona-${persona.id}`}>
                        <Sparkles className="w-4 h-4" />
                        Generate Persona
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={addPersona} size="sm" variant="outline" data-testid="button-add-persona">
                <Plus className="h-4 w-4 mr-2" />
                Add More Personas
              </Button>

              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4" style={{ color: moduleColor }}>Example Personas</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { title: 'Marketing Director Dana', desc: 'Focuses on brand awareness, campaign ROI, and leadership visibility. Cares about metrics and executive reporting.' },
                    { title: 'Sales Manager Sam', desc: 'Needs enablement tools and mid-funnel content. Motivated by conversions and CRM performance.' },
                    { title: 'Operations Olivia', desc: 'Wants efficiency and simplified workflows. Looks for clear implementation guidance and vendor reliability.' }
                  ].map((example, idx) => (
                    <div key={idx} className="bg-card border rounded-lg p-3 shadow-sm">
                      <h5 className="font-semibold text-sm mb-1" style={{ color: moduleColor }}>{example.title}</h5>
                      <p className="text-muted-foreground text-xs">{example.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 3: Content Audit + Gap Analysis - ENHANCED WITH AUTOMATED SCANNING */}
      {currentStep === 'content-identification-gaps' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Audit + Gap Analysis</h1>
            <p className="text-muted-foreground">Auto-scan your content library or manually catalog - then get comprehensive AI-powered gap analysis with content scoring</p>
          </div>

          {/* 
            ╔══════════════════════════════════════════════════════════════════════╗
            ║  DEV NOTES: AUTOMATED CONTENT SCANNING & ANALYSIS                    ║
            ╠══════════════════════════════════════════════════════════════════════╣
            ║                                                                      ║
            ║  OVERVIEW:                                                           ║
            ║  This feature combines deep website crawling + file uploads with     ║
            ║  OpenAI-powered analysis to auto-classify and analyze content.       ║
            ║                                                                      ║
            ║  TECH STACK:                                                         ║
            ║  • Firecrawl API - Deep website crawling ($20-$500/month)           ║
            ║  • OpenAI (via Replit AI Integrations) - Content classification     ║
            ║  • File parsing - PDF, DOCX extraction                              ║
            ║                                                                      ║
            ║  WORKFLOW:                                                           ║
            ║  1. User checks "Crawl Website" checkbox → enters URL               ║
            ║  2. User checks "Upload Content Files" → uploads PDFs/DOCX          ║
            ║  3. Clicks "Start Scan" → triggers comprehensive analysis           ║
            ║  4. Backend processes:                                               ║
            ║     a. Firecrawl crawls entire site (all pages, blogs, resources)   ║
            ║     b. File parser extracts content from uploaded docs              ║
            ║     c. OpenAI analyzes each piece:                                   ║
            ║        - Content type (Blog, Guide, Video, etc.)                    ║
            ║        - Buyer journey stage (Awareness/Consideration/etc.)         ║
            ║        - Status recommendation (Keep/Refresh/Archive)               ║
            ║        - Evergreen vs Campaign classification                       ║
            ║        - Persona mapping (based on personas from Step 2)            ║
            ║        - Pillar topic assignment                                    ║
            ║  5. Returns comprehensive analysis dashboard with:                   ║
            ║     - Executive Summary                                              ║
            ║     - Scoring breakdowns (personas, stages, topics, types)          ║
            ║     - Content mapping visualization                                 ║
            ║     - Gap identification with prioritized recommendations           ║
            ║     - + Eval buttons to send recs to Eval Matrix                    ║
            ║                                                                      ║
            ║  API ENDPOINTS NEEDED:                                               ║
            ║  POST /api/content/scan                                              ║
            ║    Body: {                                                           ║
            ║      websiteUrl?: string,                                            ║
            ║      files?: File[],                                                 ║
            ║      personas: string[] // from Step 2                              ║
            ║    }                                                                 ║
            ║    Response: {                                                       ║
            ║      executiveSummary: {...},                                        ║
            ║      personaScores: {...},                                           ║
            ║      stageScores: {...},                                             ║
            ║      pillarScores: {...},                                            ║
            ║      contentTypeBreakdown: {...},                                    ║
            ║      statusBreakdown: {...},                                         ║
            ║      evergreenVsCampaign: {...},                                     ║
            ║      contentMap: [...],                                              ║
            ║      gaps: [...],                                                    ║
            ║      recommendations: [...]                                          ║
            ║    }                                                                 ║
            ║                                                                      ║
            ║  FIRECRAWL INTEGRATION:                                              ║
            ║  const firecrawl = new Firecrawl(process.env.FIRECRAWL_API_KEY);    ║
            ║  const crawlResult = await firecrawl.crawl({                         ║
            ║    url: websiteUrl,                                                  ║
            ║    maxDepth: 999, // unlimited depth                                 ║
            ║    limit: 10000, // max pages                                        ║
            ║    excludes: ['/admin/*', '/login/*'],                               ║
            ║    crawlEntireDomain: true                                           ║
            ║  });                                                                 ║
            ║  // Returns array of pages with markdown content                     ║
            ║                                                                      ║
            ║  OPENAI CLASSIFICATION (per page/doc):                               ║
            ║  const analysis = await openai.chat.completions.create({            ║
            ║    model: "gpt-4o",                                                  ║
            ║    messages: [{                                                      ║
            ║      role: "system",                                                 ║
            ║      content: "You are a content strategist analyzing content..."    ║
            ║    }, {                                                              ║
            ║      role: "user",                                                   ║
            ║      content: `Analyze this content:                                 ║
            ║        URL: ${url}                                                   ║
            ║        Title: ${title}                                               ║
            ║        Content: ${content}                                           ║
            ║        Available Personas: ${personas.join(', ')}                    ║
            ║                                                                      ║
            ║        Classify:                                                     ║
            ║        - Status: Keep/Refresh/Archive                                ║
            ║        - Type: Blog/Guide/Case Study/Video/etc.                      ║
            ║        - Stage: Awareness/Consideration/Decision/Retention           ║
            ║        - Evergreen: true/false                                       ║
            ║        - Persona: [match to provided list]                           ║
            ║        - Pillar: [topic category]                                    ║
            ║        - Confidence: 0-1                                             ║
            ║        - Reasoning: [brief explanation]`                             ║
            ║    }],                                                               ║
            ║    response_format: { type: "json_object" }                          ║
            ║  });                                                                 ║
            ║                                                                      ║
            ║  COST ESTIMATES:                                                     ║
            ║  • Firecrawl: ~$0.001 per page (500 pages = $0.50)                  ║
            ║  • OpenAI: ~$0.01 per page analyzed (~500 tokens in + 200 out)      ║
            ║  • Total for 500 pages: ~$5.50                                       ║
            ║                                                                      ║
            ║  MOCK DATA BELOW:                                                    ║
            ║  For prototype/demo purposes, clicking "Start Scan" generates        ║
            ║  realistic mock analysis data showing what the real integration      ║
            ║  would return. Replace with actual API calls in production.          ║
            ║                                                                      ║
            ╚══════════════════════════════════════════════════════════════════════╝
          */}

          {/* Automated Scanning Interface */}
          {!scanComplete && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: moduleColor }} />
                  Automated Content Discovery
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Let AI scan and analyze your entire content library in minutes
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Coaching Prompt */}
                <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                      <p className="text-sm">
                        <strong>How it works:</strong> Check the boxes below to scan your website and/or upload content files. 
                        AI will crawl every page, analyze each piece, classify it across 6 dimensions (status, type, stage, persona, pillar, evergreen), 
                        identify gaps, and deliver actionable recommendations. One click, complete analysis.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Website Crawl Option */}
                  <Card className={`border-2 transition-all ${enableWebsiteCrawl ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          id="enable-crawl"
                          checked={enableWebsiteCrawl}
                          onCheckedChange={(checked) => setEnableWebsiteCrawl(!!checked)}
                          data-testid="checkbox-enable-crawl"
                        />
                        <div className="flex-1">
                          <Label htmlFor="enable-crawl" className="text-base font-semibold cursor-pointer" style={{ color: moduleColor }}>
                            Crawl Website
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Deep scan entire website - all pages, blog posts, resources, landing pages
                          </p>
                        </div>
                      </div>
                      {enableWebsiteCrawl && (
                        <div className="space-y-2 pl-8">
                          <Label className="text-xs font-semibold">Website URL</Label>
                          <Input
                            placeholder="https://yoursite.com"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            data-testid="input-website-url"
                          />
                          <p className="text-xs text-muted-foreground">
                            AI will crawl all discoverable pages (respects robots.txt)
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* File Upload Option */}
                  <Card className={`border-2 transition-all ${enableFileUpload ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          id="enable-upload"
                          checked={enableFileUpload}
                          onCheckedChange={(checked) => setEnableFileUpload(!!checked)}
                          data-testid="checkbox-enable-upload"
                        />
                        <div className="flex-1">
                          <Label htmlFor="enable-upload" className="text-base font-semibold cursor-pointer" style={{ color: moduleColor }}>
                            Upload Content Files
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload PDFs, DOCX, whitepapers, guides, case studies
                          </p>
                        </div>
                      </div>
                      {enableFileUpload && (
                        <div className="space-y-2 pl-8">
                          <Button variant="outline" className="w-full" data-testid="button-choose-files">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Files
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            {uploadedFiles.length > 0 ? `${uploadedFiles.length} files selected` : 'Supports: PDF, DOCX, TXT'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Start Scan Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    disabled={!enableWebsiteCrawl && !enableFileUpload}
                    onClick={() => {
                      setIsScanning(true)
                      // Simulate scan process
                      setTimeout(() => {
                        setIsScanning(false)
                        setScanComplete(true)
                        setShowAnalysis(true)
                      }, 3000)
                    }}
                    data-testid="button-start-scan"
                    className="px-8"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Start Scan
                      </>
                    )}
                  </Button>
                </div>

                {(!enableWebsiteCrawl && !enableFileUpload) && (
                  <p className="text-sm text-center text-muted-foreground italic">
                    Select at least one option above to begin
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Comprehensive Analysis Dashboard */}
          {scanComplete && showAnalysis && (
            <div className="space-y-6 mt-6">
              {/* Executive Summary */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: moduleColor }}>
                    <Sparkles className="w-5 h-5" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background/60 rounded-lg p-4 border border-primary/20">
                      <div className="text-2xl font-bold mb-1" style={{ color: moduleColor }}>142</div>
                      <div className="text-sm text-muted-foreground">Total Content Pieces</div>
                      <div className="text-xs text-muted-foreground mt-1">63 blog posts, 28 case studies, 51 resources</div>
                    </div>
                    <div className="bg-background/60 rounded-lg p-4 border border-primary/20">
                      <div className="text-2xl font-bold mb-1" style={{ color: moduleColor }}>68%</div>
                      <div className="text-sm text-muted-foreground">Stage Coverage</div>
                      <div className="text-xs text-muted-foreground mt-1">Strong Awareness, weak Retention</div>
                    </div>
                    <div className="bg-background/60 rounded-lg p-4 border border-primary/20">
                      <div className="text-2xl font-bold mb-1" style={{ color: moduleColor }}>23</div>
                      <div className="text-sm text-muted-foreground">Critical Gaps Identified</div>
                      <div className="text-xs text-muted-foreground mt-1">12 high priority, 11 medium</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your content library shows strong Awareness-stage coverage with educational blogs and thought leadership. However, significant gaps exist in Consideration (comparison content) and Retention (customer success resources). Persona alignment is uneven—Marketing Manager content is robust, but Sales Leader and IT Director personas are underserved.
                  </p>
                </CardContent>
              </Card>

              {/* Scoring Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Health Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Persona Coverage */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Persona Alignment</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">Marketing Manager</span>
                          <span className="text-muted-foreground">85% (58 pieces)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">Sales Leader</span>
                          <span className="text-muted-foreground">42% (31 pieces)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">IT Director</span>
                          <span className="text-muted-foreground">38% (24 pieces)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">C-Suite Executive</span>
                          <span className="text-muted-foreground">51% (29 pieces)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '51%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Journey Stage Coverage */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Journey Stage Distribution</h5>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-background border rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-green-500">78%</div>
                        <div className="text-xs text-muted-foreground mt-1">Awareness</div>
                        <div className="text-xs font-semibold mt-1">52 pieces</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-yellow-500">64%</div>
                        <div className="text-xs text-muted-foreground mt-1">Consideration</div>
                        <div className="text-xs font-semibold mt-1">48 pieces</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-orange-500">59%</div>
                        <div className="text-xs text-muted-foreground mt-1">Conversion</div>
                        <div className="text-xs font-semibold mt-1">28 pieces</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-red-500">32%</div>
                        <div className="text-xs text-muted-foreground mt-1">Retention</div>
                        <div className="text-xs font-semibold mt-1">14 pieces</div>
                      </div>
                    </div>
                  </div>

                  {/* Pillar Topics */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Content Pillar Coverage</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold">Marketing Automation</span>
                          <span className="text-xs text-green-500 font-semibold">Strong</span>
                        </div>
                        <div className="text-xs text-muted-foreground">41 pieces • Well-distributed across stages</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold">Lead Generation</span>
                          <span className="text-xs text-green-500 font-semibold">Strong</span>
                        </div>
                        <div className="text-xs text-muted-foreground">38 pieces • High engagement metrics</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold">Analytics & Reporting</span>
                          <span className="text-xs text-yellow-500 font-semibold">Moderate</span>
                        </div>
                        <div className="text-xs text-muted-foreground">27 pieces • Missing Retention content</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold">Integration & APIs</span>
                          <span className="text-xs text-red-500 font-semibold">Weak</span>
                        </div>
                        <div className="text-xs text-muted-foreground">12 pieces • Critical gap for IT Director</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold">ROI & Business Value</span>
                          <span className="text-xs text-orange-500 font-semibold">Needs Work</span>
                        </div>
                        <div className="text-xs text-muted-foreground">19 pieces • Weak C-Suite coverage</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold">Customer Success</span>
                          <span className="text-xs text-red-500 font-semibold">Critical Gap</span>
                        </div>
                        <div className="text-xs text-muted-foreground">5 pieces • Retention stage underserved</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Type & Format Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Type Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Type Distribution */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Format Distribution</h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-background border rounded-lg p-3">
                        <div className="text-lg font-bold mb-1">63</div>
                        <div className="text-xs text-muted-foreground mb-2">Blog Posts</div>
                        <div className="text-xs font-semibold text-green-500">44% of total</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="text-lg font-bold mb-1">28</div>
                        <div className="text-xs text-muted-foreground mb-2">Case Studies</div>
                        <div className="text-xs font-semibold text-green-500">20% of total</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="text-lg font-bold mb-1">18</div>
                        <div className="text-xs text-muted-foreground mb-2">Whitepapers</div>
                        <div className="text-xs font-semibold text-yellow-500">13% of total</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="text-lg font-bold mb-1">14</div>
                        <div className="text-xs text-muted-foreground mb-2">Webinars</div>
                        <div className="text-xs font-semibold text-yellow-500">10% of total</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="text-lg font-bold mb-1">11</div>
                        <div className="text-xs text-muted-foreground mb-2">eBooks</div>
                        <div className="text-xs font-semibold text-orange-500">8% of total</div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="text-lg font-bold mb-1">8</div>
                        <div className="text-xs text-muted-foreground mb-2">Infographics</div>
                        <div className="text-xs font-semibold text-orange-500">6% of total</div>
                      </div>
                    </div>
                  </div>

                  {/* Evergreen vs Campaign */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Evergreen vs Campaign Split</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">72%</div>
                        <div className="text-sm font-semibold mb-1">Evergreen Content</div>
                        <div className="text-xs text-muted-foreground">102 pieces • Long-term value assets</div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Good balance for sustainable growth</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">28%</div>
                        <div className="text-sm font-semibold mb-1">Campaign Content</div>
                        <div className="text-xs text-muted-foreground">40 pieces • Time-sensitive promotions</div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">⚠ Could increase for seasonal pushes</div>
                      </div>
                    </div>
                  </div>

                  {/* Content Status */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Content Health Status</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-semibold">Keep - High Performing</span>
                        </div>
                        <span className="text-sm text-muted-foreground">89 pieces (63%)</span>
                      </div>
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm font-semibold">Refresh - Needs Update</span>
                        </div>
                        <span className="text-sm text-muted-foreground">38 pieces (27%)</span>
                      </div>
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm font-semibold">Archive - Low Value</span>
                        </div>
                        <span className="text-sm text-muted-foreground">15 pieces (11%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Critical Gap Analysis */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Critical Gaps & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* High Priority Gaps */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3 text-red-500">🔴 High Priority Gaps</h5>
                    <div className="space-y-3">
                      <div className="bg-background border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">Retention Stage: Customer Success Resources</p>
                            <p className="text-xs text-muted-foreground mb-2">Only 14 pieces (10% of library) address existing customers. Missing onboarding guides, product updates, best practices, and community content.</p>
                            <div className="flex gap-2 text-xs">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">Retention -68%</span>
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">All Personas</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" data-testid="button-eval-retention">
                            + Eval
                          </Button>
                        </div>
                      </div>

                      <div className="bg-background border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">IT Director Persona: Technical Integration Content</p>
                            <p className="text-xs text-muted-foreground mb-2">Only 24 pieces (17%) target IT Directors. Missing API documentation, security whitepapers, architecture diagrams, and technical case studies.</p>
                            <div className="flex gap-2 text-xs">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">IT Director -62%</span>
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">Consideration</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" data-testid="button-eval-it-director">
                            + Eval
                          </Button>
                        </div>
                      </div>

                      <div className="bg-background border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">Comparison & Competitive Content</p>
                            <p className="text-xs text-muted-foreground mb-2">Minimal head-to-head comparisons, alternative evaluations, or "vs" content. Buyers researching alternatives have no guided resources.</p>
                            <div className="flex gap-2 text-xs">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">Consideration -71%</span>
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">Sales Leader</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" data-testid="button-eval-comparison">
                            + Eval
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medium Priority Opportunities */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3 text-yellow-600 dark:text-yellow-500">🟡 Medium Priority Opportunities</h5>
                    <div className="space-y-2">
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">Video & Interactive Content Formats</p>
                            <p className="text-xs text-muted-foreground">Heavy reliance on text-based formats. Add product demos, tutorial videos, and interactive calculators.</p>
                          </div>
                          <Button size="sm" variant="ghost" data-testid="button-eval-video">
                            + Eval
                          </Button>
                        </div>
                      </div>
                      <div className="bg-background border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">C-Suite ROI & Strategic Business Cases</p>
                            <p className="text-xs text-muted-foreground">Limited executive-level content focused on strategic value, business transformation, and board-ready metrics.</p>
                          </div>
                          <Button size="sm" variant="ghost" data-testid="button-eval-csuite">
                            + Eval
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-primary/5 border-primary/30">
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-primary mt-0.5">1.</span>
                        <span className="text-sm">Address critical Retention gap with customer success content series (onboarding, best practices, community)</span>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-eval-nextstep-1">
                        + Eval
                      </Button>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-primary mt-0.5">2.</span>
                        <span className="text-sm">Build IT Director persona content library (technical docs, security whitepapers, integration guides)</span>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-eval-nextstep-2">
                        + Eval
                      </Button>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-primary mt-0.5">3.</span>
                        <span className="text-sm">Create comparison content hub for Consideration stage buyers evaluating alternatives</span>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-eval-nextstep-3">
                        + Eval
                      </Button>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-primary mt-0.5">4.</span>
                        <span className="text-sm">Refresh 38 yellow-flagged pieces to maintain relevance and SEO performance</span>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-eval-nextstep-4">
                        + Eval
                      </Button>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-primary mt-0.5">5.</span>
                        <span className="text-sm">Diversify content formats with video demos and interactive tools for higher engagement</span>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-eval-nextstep-5">
                        + Eval
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Inventory with Score & Competitors Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: moduleColor }} />
                    Content Inventory & Competitive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="your-content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="your-content" data-testid="tab-your-content">
                        Your Content
                      </TabsTrigger>
                      <TabsTrigger value="competitors" data-testid="tab-competitors">
                        Competitors
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="your-content" className="space-y-6">
                      {contentStages.map((stage) => {
                        // Generate mock content with scores for demonstration
                        const mockContent: ContentEntry[] = [
                          {
                            topic: `${stage} Stage Guide: Getting Started`,
                            url: '/blog/getting-started',
                            type: 'Blog',
                            status: 'Keep',
                            persona: personas[0]?.name || 'Marketing Director',
                            evergreen: 'Evergreen',
                            score: 85
                          },
                          {
                            topic: `Ultimate ${stage} Playbook`,
                            url: '/resources/playbook',
                            type: 'Guide',
                            status: 'Keep',
                            persona: personas[1]?.name || 'Sales Leader',
                            evergreen: 'Evergreen',
                            score: 92
                          },
                          {
                            topic: `${stage}: Case Study Collection`,
                            url: '/case-studies',
                            type: 'Case Study',
                            status: 'Refresh',
                            persona: personas[0]?.name || 'Marketing Director',
                            evergreen: 'Campaign',
                            score: 67
                          },
                          {
                            topic: `${stage} Video Series`,
                            url: '/videos',
                            type: 'Video',
                            status: 'Keep',
                            persona: personas[1]?.name || 'Sales Leader',
                            evergreen: 'Evergreen',
                            score: 78
                          },
                          {
                            topic: `Quick ${stage} Tips`,
                            url: '/blog/quick-tips',
                            type: 'Blog',
                            status: 'Archive',
                            persona: personas[0]?.name || 'Marketing Director',
                            evergreen: 'Campaign',
                            score: 45
                          }
                        ]

                        const getScoreColor = (score: number) => {
                          if (score >= 80) return 'text-green-600 dark:text-green-400'
                          if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
                          return 'text-red-600 dark:text-red-400'
                        }

                        const getScoreBgColor = (score: number) => {
                          if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
                          if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30'
                          return 'bg-red-100 dark:bg-red-900/30'
                        }

                        return (
                          <div key={stage}>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: moduleColor }}>
                              <Target className="w-4 h-4" />
                              {stage} Stage Content
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border border-border rounded-lg">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="p-2 text-left font-semibold">Topic</th>
                                    <th className="p-2 text-left font-semibold">Type</th>
                                    <th className="p-2 text-left font-semibold">Status</th>
                                    <th className="p-2 text-left font-semibold">Persona</th>
                                    <th className="p-2 text-left font-semibold">Category</th>
                                    <th className="p-2 text-center font-semibold">Score</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mockContent.map((entry, idx) => (
                                    <tr key={idx} className="border-t border-border hover-elevate">
                                      <td className="p-2">
                                        <div className="font-medium text-foreground">{entry.topic}</div>
                                        <div className="text-muted-foreground text-[10px] mt-0.5">{entry.url}</div>
                                      </td>
                                      <td className="p-2 text-muted-foreground">{entry.type}</td>
                                      <td className="p-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                          entry.status === 'Keep' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                          entry.status === 'Refresh' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                          {entry.status}
                                        </span>
                                      </td>
                                      <td className="p-2 text-muted-foreground">{entry.persona}</td>
                                      <td className="p-2 text-muted-foreground">{entry.evergreen}</td>
                                      <td className="p-2 text-center">
                                        <div className={`inline-flex items-center justify-center w-12 h-8 rounded font-bold ${getScoreBgColor(entry.score || 0)} ${getScoreColor(entry.score || 0)}`}>
                                          {entry.score}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      })}

                      <Card className="bg-muted/30 border-dashed">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Info className="w-4 h-4 mt-0.5" style={{ color: moduleColor }} />
                            <div className="text-xs space-y-1">
                              <p className="font-semibold">Content Score Breakdown (0-100)</p>
                              <ul className="text-muted-foreground space-y-0.5 ml-4">
                                <li>• <strong>Freshness:</strong> Publication date and last update</li>
                                <li>• <strong>Performance:</strong> Traffic, engagement, conversions</li>
                                <li>• <strong>SEO Strength:</strong> Rankings, backlinks, on-page optimization</li>
                                <li>• <strong>Brand Alignment:</strong> Messaging consistency, tone accuracy</li>
                                <li>• <strong>Completeness:</strong> Depth, comprehensiveness, CTAs</li>
                              </ul>
                              <div className="mt-2 flex gap-3">
                                <span className="inline-flex items-center gap-1">
                                  <div className="w-3 h-3 rounded bg-green-500"></div>
                                  <span className="text-muted-foreground">80-100: Excellent</span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                                  <span className="text-muted-foreground">50-79: Needs Work</span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <div className="w-3 h-3 rounded bg-red-500"></div>
                                  <span className="text-muted-foreground">0-49: Poor</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="competitors" className="space-y-6">
                      <div className="space-y-6">
                        {/* Comparison Legend */}
                        <Card className="bg-muted/30 border-dashed">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Info className="w-4 h-4 mt-0.5" style={{ color: moduleColor }} />
                              <div className="text-xs">
                                <p className="font-semibold mb-2">Competitive Content Gap Analysis</p>
                                <p className="text-muted-foreground">
                                  This analysis shows topic coverage comparison across key buyer journey stages. Green indicates strong coverage, yellow shows gaps, and red highlights critical missing content.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Competitive Comparison Grid */}
                        {contentStages.map((stage) => {
                          const topics = [
                            'Product Overview & Features',
                            'Use Cases & Applications',
                            'Pricing & Plans',
                            'Integration Capabilities',
                            'Security & Compliance',
                            'Customer Success Stories',
                            'Implementation Guide',
                            'ROI & Business Value'
                          ]

                          const competitors = ['Your Brand', 'Competitor A', 'Competitor B', 'Competitor C']

                          // Mock coverage data (percentage)
                          const getCoverage = (competitor: string, topic: string) => {
                            if (competitor === 'Your Brand') {
                              // Your brand has mixed coverage
                              const random = Math.random()
                              if (stage === 'Awareness') return random > 0.3 ? 85 : 45
                              if (stage === 'Consideration') return random > 0.4 ? 70 : 40
                              if (stage === 'Decision') return random > 0.5 ? 60 : 35
                              return random > 0.6 ? 50 : 30
                            } else if (competitor === 'Competitor A') {
                              return Math.floor(Math.random() * 30) + 70 // 70-100
                            } else if (competitor === 'Competitor B') {
                              return Math.floor(Math.random() * 40) + 50 // 50-90
                            } else {
                              return Math.floor(Math.random() * 50) + 40 // 40-90
                            }
                          }

                          const getCoverageColor = (coverage: number) => {
                            if (coverage >= 70) return 'bg-green-500/80'
                            if (coverage >= 40) return 'bg-yellow-500/80'
                            return 'bg-red-500/80'
                          }

                          return (
                            <div key={stage}>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: moduleColor }}>
                                <TrendingUp className="w-4 h-4" />
                                {stage} Stage - Competitive Coverage
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border border-border rounded-lg">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="p-2 text-left font-semibold w-1/4">Topic Area</th>
                                      {competitors.map((comp) => (
                                        <th key={comp} className="p-2 text-center font-semibold">
                                          {comp === 'Your Brand' ? <span className="font-bold" style={{ color: moduleColor }}>{comp}</span> : comp}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topics.map((topic, idx) => (
                                      <tr key={idx} className="border-t border-border">
                                        <td className="p-2 font-medium text-foreground">{topic}</td>
                                        {competitors.map((comp) => {
                                          const coverage = getCoverage(comp, topic)
                                          return (
                                            <td key={comp} className="p-2 text-center">
                                              <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                                                  <div
                                                    className={`h-2 ${getCoverageColor(coverage)}`}
                                                    style={{ width: `${coverage}%` }}
                                                  />
                                                </div>
                                                <span className="text-muted-foreground text-[10px] w-8 text-right">{coverage}%</span>
                                              </div>
                                            </td>
                                          )
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Stage-specific Gap Insights */}
                              <div className="mt-3 bg-muted/30 rounded-lg p-3 border border-border">
                                <p className="text-xs font-semibold mb-2" style={{ color: moduleColor }}>Key Gaps in {stage}</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li className="flex items-start gap-2">
                                    <AlertCircle className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />
                                    <span>Competitors have stronger coverage in Implementation Guide (+35% vs your content)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <AlertCircle className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />
                                    <span>Missing comprehensive Security & Compliance content for {stage} stage</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                                    <span>Strong performance in Customer Success Stories - maintain and expand</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )
                        })}

                        {/* Overall Competitive Position */}
                        <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                          <CardHeader>
                            <CardTitle className="text-base">Overall Competitive Position</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-background/60 rounded-lg p-4 border">
                                <div className="text-2xl font-bold mb-1 text-green-600 dark:text-green-400">Ahead</div>
                                <div className="text-sm text-muted-foreground mb-2">3 Topic Areas</div>
                                <div className="text-xs text-muted-foreground">Customer Stories, Use Cases, ROI Content</div>
                              </div>
                              <div className="bg-background/60 rounded-lg p-4 border">
                                <div className="text-2xl font-bold mb-1 text-yellow-600 dark:text-yellow-400">On Par</div>
                                <div className="text-sm text-muted-foreground mb-2">2 Topic Areas</div>
                                <div className="text-xs text-muted-foreground">Product Features, Pricing</div>
                              </div>
                              <div className="bg-background/60 rounded-lg p-4 border">
                                <div className="text-2xl font-bold mb-1 text-red-600 dark:text-red-400">Behind</div>
                                <div className="text-sm text-muted-foreground mb-2">3 Topic Areas</div>
                                <div className="text-xs text-muted-foreground">Security, Integration, Implementation</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold">Recommended Priority Actions</h5>
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-3 bg-background/60 rounded-lg p-3 border">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold">1. Close Security & Compliance Gap</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Competitors have 2-3x more security content. Create security whitepaper series and compliance guides.
                                    </p>
                                  </div>
                                  <Button size="sm" variant="outline" data-testid="button-eval-security-gap">
                                    + Eval
                                  </Button>
                                </div>
                                <div className="flex items-start justify-between gap-3 bg-background/60 rounded-lg p-3 border">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold">2. Expand Integration Documentation</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Build comprehensive API docs, integration playbooks, and technical guides to match competitor coverage.
                                    </p>
                                  </div>
                                  <Button size="sm" variant="outline" data-testid="button-eval-integration-gap">
                                    + Eval
                                  </Button>
                                </div>
                                <div className="flex items-start justify-between gap-3 bg-background/60 rounded-lg p-3 border">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold">3. Strengthen Implementation Resources</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Create step-by-step implementation guides, video tutorials, and onboarding checklists.
                                    </p>
                                  </div>
                                  <Button size="sm" variant="outline" data-testid="button-eval-implementation-gap">
                                    + Eval
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* STEP 4: Journey Mapping */}
      {currentStep === 'journey-mapping' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Journey Mapping</h1>
            <p className="text-muted-foreground">Map how your buyers move from awareness to decision with real actions and emotions</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Buyer Journey Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Map how your buyers move from awareness to decision. Focus on real actions and emotions — what they actually do, think, and feel at each stage.
              </p>

              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <p className="text-sm">
                      <strong>Coaching Prompt:</strong> Map buyer movement across 4 journey stages. Capture real actions and emotions, not assumptions. Focus on what transitions buyers forward or gets them stuck.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Journey Mapping Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-primary/20 rounded-lg overflow-hidden">
                  <thead className="bg-primary/10">
                    <tr>
                      <th className="p-2 text-left w-64" style={{ color: moduleColor }}>Buyer Question</th>
                      {journeyStages.map(s => (
                        <th key={s} className="p-2 text-center" style={{ color: moduleColor }}>{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {journeyMap.map((row, qi) => (
                      <tr key={qi} className="border-t border-primary/10">
                        <td className="p-2 font-semibold text-muted-foreground align-top">
                          <div>{row.question}</div>
                          <div className="text-[10px] italic mt-1 text-muted-foreground/70">{row.tip}</div>
                        </td>
                        {journeyStages.map(stage => (
                          <td key={stage} className="p-2 align-top">
                            <Textarea
                              placeholder={row.tip}
                              className="text-xs resize-none h-20 bg-background"
                              value={row.responses[stage as keyof JourneyQuestion['responses']]}
                              onChange={(e) => updateJourneyResponse(qi, stage as keyof JourneyQuestion['responses'], e.target.value)}
                              data-testid={`textarea-journey-${qi}-${stage}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={analyzeJourneyInsights} variant="default" data-testid="button-journey-insights">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insights
                </Button>
              </div>

              {/* Insights */}
              {showJourneyInsights && (
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: moduleColor }}>
                      <Sparkles className="w-5 h-5" />
                      Journey Insights & Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Critical Transition Points */}
                    <div>
                      <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Critical Transition Points</h5>
                      <div className="space-y-3">
                        <div className="bg-background/60 rounded-lg p-3 border border-primary/20">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">Awareness → Consideration Gap</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Buyers struggle to connect product value to their specific pain points. Consider adding comparison guides and ROI calculators to bridge this gap.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-background/60 rounded-lg p-3 border border-primary/20">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold">Conversion Strength</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Strong alignment between decision criteria and proof points. Demo-to-purchase conversion appears well-supported.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Friction Areas */}
                    <div>
                      <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Friction Areas Detected</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Buyers express uncertainty about implementation complexity during Consideration stage</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Limited peer validation content in Awareness phase may slow early momentum</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Post-purchase onboarding appears disconnected from initial buyer questions</span>
                        </li>
                      </ul>
                    </div>

                    {/* Content Recommendations */}
                    <div>
                      <h5 className="text-sm font-semibold mb-3" style={{ color: moduleColor }}>Recommended Content Plays</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-background/60 rounded-lg p-3 border border-primary/20">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Implementation Playbook Series</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Address complexity concerns with step-by-step guides for Consideration stage</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="ml-3"
                            data-testid="button-eval-implementation"
                          >
                            + Eval
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-background/60 rounded-lg p-3 border border-primary/20">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Customer Success Story Hub</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Build trust in Awareness with peer validation and use case examples</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="ml-3"
                            data-testid="button-eval-stories"
                          >
                            + Eval
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-background/60 rounded-lg p-3 border border-primary/20">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Value Realization Dashboard</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Connect initial buyer questions to post-purchase success metrics in Retention</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="ml-3"
                            data-testid="button-eval-dashboard"
                          >
                            + Eval
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Journey Health Score */}
                    <div className="bg-background/60 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold" style={{ color: moduleColor }}>Journey Alignment Score</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold" style={{ color: moduleColor }}>7.2</span>
                          <span className="text-xs text-muted-foreground">/10</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stage Coverage</span>
                          <span className="font-semibold">85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transition Clarity</span>
                          <span className="font-semibold">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emotional Mapping</span>
                          <span className="font-semibold">72%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 5: Content Planning */}
      {currentStep === 'content-channel-planning' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Planning</h1>
            <p className="text-muted-foreground">Map content types, channels, and personas across the journey</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Planning Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <p className="text-sm">
                      <strong>Coaching Prompt:</strong> Map 2-3 content plays per stage. Define the primary content type, select derivatives for repurposing, choose distribution channels, identify target personas, and assign to a pillar/theme. Plan your mix of paid vs organic distribution and set priority tiers.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-primary/20 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-card">
                      <th className="p-2 w-10">
                        <Checkbox 
                          checked={selectedRows.size === channelMatrix.length * 3}
                          onCheckedChange={toggleSelectAll}
                          data-testid="checkbox-select-all"
                        />
                      </th>
                      <th className="p-2 font-semibold text-center border-r">Stage</th>
                      <th className="p-2 font-semibold text-center">Content Type</th>
                      <th className="p-2 font-semibold text-center">Derivatives</th>
                      <th className="p-2 font-semibold text-center">Channel</th>
                      <th className="p-2 font-semibold text-center">Persona</th>
                      <th className="p-2 font-semibold text-center">Purpose / Role</th>
                      <th className="p-2 font-semibold text-center">Paid/Organic</th>
                      <th className="p-2 font-semibold text-center">Pillar</th>
                      <th className="p-2 font-semibold text-center">Tier / Priority</th>
                      <th className="p-2 font-semibold text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelMatrix.map((stageData, stageIndex) => (
                      stageData.entries.map((entry, entryIndex) => (
                        <tr key={`${stageIndex}-${entryIndex}`} className="border-t border-primary/10 bg-background">
                          <td className="p-2 text-center">
                            <Checkbox 
                              checked={selectedRows.has(`${stageIndex}-${entryIndex}`)}
                              onCheckedChange={() => toggleRowSelection(stageIndex, entryIndex)}
                              data-testid={`checkbox-row-${stageIndex}-${entryIndex}`}
                            />
                          </td>
                          {entryIndex === 0 && (
                            <td rowSpan={3} className="p-2 font-semibold text-xs text-center align-top border-r" style={{ color: moduleColor }}>
                              {stageData.stage}
                            </td>
                          )}
                          <td className="p-2">
                            <Select
                              value={entry.contentType}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'contentType', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-content-type-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Select Content Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {contentTypeOptions.map(ct => (
                                  <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs h-8" data-testid={`button-derivatives-${stageData.stage}-${entryIndex}`}>
                                  {entry.derivatives.length > 0 ? `${entry.derivatives.length} selected` : 'Select Derivatives'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64">
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold mb-2">Select Derivatives</p>
                                  {derivativeOptions.map(deriv => (
                                    <div key={deriv} className="flex items-center space-x-2">
                                      <Checkbox
                                        checked={entry.derivatives.includes(deriv)}
                                        onCheckedChange={(checked) => {
                                          const newDerivatives = checked
                                            ? [...entry.derivatives, deriv]
                                            : entry.derivatives.filter(d => d !== deriv)
                                          updateChannelEntry(stageIndex, entryIndex, 'derivatives', newDerivatives)
                                        }}
                                        data-testid={`checkbox-derivative-${deriv.toLowerCase().replace(/\s+/g, '-')}`}
                                      />
                                      <label className="text-xs">{deriv}</label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </td>
                          <td className="p-2">
                            <Select
                              value={entry.channel}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'channel', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-channel-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Select Channel" />
                              </SelectTrigger>
                              <SelectContent>
                                {suggestedChannels[stageData.stage as keyof typeof suggestedChannels].map(ch => (
                                  <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Input
                              value={entry.persona}
                              onChange={(e) => updateChannelEntry(stageIndex, entryIndex, 'persona', e.target.value)}
                              placeholder="Target Persona"
                              className="text-xs border bg-background"
                              data-testid={`input-persona-${stageData.stage}-${entryIndex}`}
                            />
                          </td>
                          <td className="p-2">
                            <Select
                              value={entry.purpose}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'purpose', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-purpose-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Select Purpose" />
                              </SelectTrigger>
                              <SelectContent>
                                {purposeOptions.map(p => (
                                  <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Select
                              value={entry.type}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'type', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-paid-organic-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Paid/Organic" />
                              </SelectTrigger>
                              <SelectContent>
                                {channelTypeOptions.map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Select
                              value={entry.pillar}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'pillar', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-pillar-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Select Pillar" />
                              </SelectTrigger>
                              <SelectContent>
                                {pillarOptions.map(p => (
                                  <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Select
                              value={entry.tier}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'tier', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-tier-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Select Tier" />
                              </SelectTrigger>
                              <SelectContent>
                                {tierOptions.map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2 text-center">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              entryIndex === 0 ? 'bg-green-400' : entryIndex === 1 ? 'bg-yellow-400' : 'bg-red-400'
                            }`} />
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <Button onClick={analyzeChannelGaps} variant="default" data-testid="button-channel-gaps">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Spot Gaps
                </Button>
                <Button 
                  onClick={sendToEvalMatrix} 
                  variant="default" 
                  style={{ backgroundColor: moduleColor }}
                  data-testid="button-send-eval-matrix"
                  disabled={selectedRows.size === 0}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Send to Eval Matrix {selectedRows.size > 0 && `(${selectedRows.size})`}
                </Button>
              </div>

              {showChannelGaps && (
                <div className="bg-card border rounded-xl p-4 text-sm space-y-4">
                  <div>
                    <h4 className="text-base font-semibold mb-2" style={{ color: moduleColor }}>Gap Analysis</h4>
                    
                    {channelGapInsights.insights.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">📊 Key Findings:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-xs">
                          {channelGapInsights.insights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {channelGapInsights.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">💡 Recommendations:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-xs">
                          {channelGapInsights.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {channelGapInsights.insights.length === 0 && channelGapInsights.recommendations.length === 0 && (
                      <p className="text-sm text-muted-foreground">✅ Looking good! Your channel strategy is well-balanced and aligned with your content types.</p>
                    )}
                  </div>

                  <div className="pt-3 border-t text-xs text-muted-foreground italic">
                    This analysis checks stage coverage, paid/organic balance, core channel continuity, and alignment with your content types.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 7: Activation Grid */}
      {currentStep === 'activation-grid' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Activation Grid</h1>
            <p className="text-muted-foreground">Turn strategy into action — plan your content activation and distribution</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Activation Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <p className="text-sm">
                      <strong>Coaching Prompt:</strong> Plan content activation: define core assets, create 3 derivatives per piece, then map to channels, cadence, goals, and KPIs. Every strong piece can multiply.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Derivatives Builder */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold" style={{ color: moduleColor }}>Derivatives Builder</h4>
                <p className="text-xs italic text-muted-foreground">
                  Every strong piece can multiply — think snippets, summaries, or teasers. Example: Webinar → Blog recap → LinkedIn carousel → Email teaser
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activationRows.map((row, i) => (
                    <div key={row.stage} className="border rounded-md p-3 bg-muted/20">
                      <h5 className="font-semibold text-xs mb-2" style={{ color: moduleColor }}>{row.stage}</h5>
                      <div className="flex flex-col gap-3">
                        {/* Core Asset Input */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] font-semibold">Core Asset</label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => pullFromContentIdentification(i)}
                              className="text-[10px] h-6 px-2"
                              data-testid={`button-pull-${row.stage}`}
                            >
                              Pull from Content ID
                            </Button>
                          </div>
                          <Input
                            value={row.asset}
                            placeholder="e.g., Webinar Recording, Whitepaper, or Core Video Asset"
                            onChange={e => updateActivationRow(i, 'asset', e.target.value)}
                            className="text-xs"
                            data-testid={`input-asset-${row.stage}`}
                          />
                          <p className="text-[10px] italic text-muted-foreground">
                            Tip: Start with your anchor asset — something that can fuel multiple derivatives
                          </p>
                        </div>
                        
                        {/* Derivative Inputs */}
                        {[0, 1, 2].map(di => (
                          <Select
                            key={di}
                            value={row.derivatives[di]}
                            onValueChange={v => updateActivationDerivative(i, di, v)}
                          >
                            <SelectTrigger className="text-xs" data-testid={`select-derivative-${row.stage}-${di}`}>
                              <SelectValue placeholder={`Derivative ${di + 1}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {derivativeOptions.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activation Grid Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold" style={{ color: moduleColor }}>Activation Grid</h4>
                <p className="text-xs italic text-muted-foreground">
                  Connect your assets to campaigns and KPIs. Example: Webinar recap → LinkedIn + Email (Weekly) → Goal: Awareness, KPI: CTR 3%.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border border-primary/20 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-card">
                        <th className="p-2 text-left font-semibold">Stage</th>
                        <th className="p-2 text-left font-semibold">Core Asset</th>
                        <th className="p-2 text-left font-semibold">Derivative</th>
                        <th className="p-2 text-left font-semibold">Pillar / Subtopic</th>
                        <th className="p-2 text-left font-semibold">Channel</th>
                        <th className="p-2 text-left font-semibold">Cadence</th>
                        <th className="p-2 text-left font-semibold">Goal</th>
                        <th className="p-2 text-left font-semibold">KPI</th>
                        <th className="p-2 text-left font-semibold">Effort</th>
                        <th className="p-2 text-left font-semibold">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activationRows.flatMap((row, i) =>
                        row.derivatives.map((der, di) => (
                          <tr key={`${i}-${di}`} className="border-t border-primary/10 bg-background">
                            {di === 0 && (
                              <td rowSpan={3} className="p-2 font-semibold text-center align-top" style={{ color: moduleColor }}>
                                {row.stage}
                              </td>
                            )}
                            <td className="p-2">{row.asset || '—'}</td>
                            <td className="p-2">{der || '—'}</td>
                            <td className="p-2">
                              <Input
                                value={row.pillar}
                                placeholder="Enter pillar or subtopic"
                                onChange={e => updateActivationRow(i, 'pillar', e.target.value)}
                                className="text-xs"
                                data-testid={`input-pillar-${row.stage}`}
                              />
                            </td>
                            <td className="p-2">
                              <Select
                                value={row.channels}
                                onValueChange={v => updateActivationRow(i, 'channels', v)}
                              >
                                <SelectTrigger className="text-xs" data-testid={`select-channel-activation-${row.stage}`}>
                                  <SelectValue placeholder="Select Channel" />
                                </SelectTrigger>
                                <SelectContent>
                                  {channelOptionsActivation.map(ch => (
                                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Select
                                value={row.cadence}
                                onValueChange={v => updateActivationRow(i, 'cadence', v)}
                              >
                                <SelectTrigger className="text-xs" data-testid={`select-cadence-${row.stage}`}>
                                  <SelectValue placeholder="Select Cadence" />
                                </SelectTrigger>
                                <SelectContent>
                                  {cadenceOptions.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Select
                                value={row.goal}
                                onValueChange={v => updateActivationRow(i, 'goal', v)}
                              >
                                <SelectTrigger className="text-xs" data-testid={`select-goal-activation-${row.stage}`}>
                                  <SelectValue placeholder="Select Goal" />
                                </SelectTrigger>
                                <SelectContent>
                                  {goalOptionsActivation.map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Select
                                value={row.kpi}
                                onValueChange={v => updateActivationRow(i, 'kpi', v)}
                              >
                                <SelectTrigger className="text-xs" data-testid={`select-kpi-activation-${row.stage}`}>
                                  <SelectValue placeholder="Select KPI" />
                                </SelectTrigger>
                                <SelectContent>
                                  {kpiOptionsActivation.map(k => (
                                    <SelectItem key={k} value={k}>{k}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Select
                                value={row.effort}
                                onValueChange={v => updateActivationRow(i, 'effort', v)}
                              >
                                <SelectTrigger className="text-xs" data-testid={`select-effort-${row.stage}`}>
                                  <SelectValue placeholder="Effort" />
                                </SelectTrigger>
                                <SelectContent>
                                  {effortOptions.map(e => (
                                    <SelectItem key={e} value={e}>{e}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Select
                                value={row.impact}
                                onValueChange={v => updateActivationRow(i, 'impact', v)}
                              >
                                <SelectTrigger className="text-xs" data-testid={`select-impact-${row.stage}`}>
                                  <SelectValue placeholder="Impact" />
                                </SelectTrigger>
                                <SelectContent>
                                  {impactOptions.map(imp => (
                                    <SelectItem key={imp} value={imp}>{imp}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 8: Generate Strategy */}
      {currentStep === 'generate-strategy' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2">Generate Strategy</h1>
            <p className="text-muted-foreground">Pull together your complete content strategy document</p>
          </div>

          <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <p className="text-sm">
                  <strong>Coaching Prompt:</strong> Synthesize all inputs into professional strategy documents. Review for balance—do assets, audiences, and goals align? Regenerate after changes to keep current.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Strategy Document</CardTitle>
                {!isGenerated && (
                  <Button onClick={handleGenerate} size="sm" data-testid="button-generate-strategy">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Strategy
                  </Button>
                )}
                {isGenerated && (
                  <Button onClick={handleGenerate} size="sm" variant="outline" data-testid="button-regenerate-strategy">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isGenerated && (
                <div className="border rounded-lg p-8 text-center bg-muted/20">
                  <p className="text-sm text-muted-foreground mb-4">
                    Click <strong>"Generate Strategy"</strong> to create your Executive Summary and Comprehensive Strategy document based on all your inputs from the previous steps.
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    If you make changes to any previous step, simply regenerate to update the documents.
                  </p>
                </div>
              )}

              {isGenerated && (
                <Tabs defaultValue="executive" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="executive">Executive Summary</TabsTrigger>
                    <TabsTrigger value="comprehensive">Comprehensive Strategy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="executive" className="mt-4">
                    <div className="border rounded-lg p-6 min-h-[600px] bg-background prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {executiveSummary}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="comprehensive" className="mt-4">
                    <div className="border rounded-lg p-6 min-h-[600px] bg-background prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {strategyDocument}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  if (!feature || !feature.steps) {
    return <div>Feature not found</div>
  }

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={feature.steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={content}
      moduleColor={module?.color}
      featureName="Content Strategy"
    />
  )
}
