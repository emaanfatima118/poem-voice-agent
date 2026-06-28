"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/config/modules'
import { QuickActions } from '@/components/QuickActions'
import { Plus, Trash2, Upload, Sparkles, FileText, CheckCircle2, Info, Lightbulb } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
  contentFit: string
  tier: string
  type: string
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

  const contentTypeOptions = [
    'Blog', 'Guide', 'Case Study', 'Video', 'Webinar', 'Infographic',
    'Email', 'Landing Page', 'Social Post', 'Podcast', 'Whitepaper', 'Article'
  ]
  const statusOptions = ['Keep', 'Refresh', 'Archive']
  const evergreenOptions = ['Evergreen', 'Campaign']

  // Journey Mapping state - 13 questions across 4 stages
  const journeyStages = ['Awareness', 'Consideration', 'Decision', 'Retention']
  const journeyQuestions = [
    { q: 'What are they thinking?', tip: 'e.g., Recognizing a problem, comparing solutions, evaluating vendors, or reviewing results.' },
    { q: 'What are they feeling?', tip: 'e.g., Curious, uncertain, confident, or reassured at each stage.' },
    { q: 'What are they doing?', tip: 'e.g., Searching online, reading reviews, requesting demos, or renewing contracts.' },
    { q: 'What do they need from us?', tip: 'e.g., Educational insights, reassurance, validation, or value proof.' },
    { q: 'What barriers or objections exist?', tip: 'e.g., Budget, time, trust, risk, internal approval.' },
    { q: 'What content or message helps them move forward?', tip: 'e.g., Thought leadership, guides, ROI calculator, case study.' },
    { q: 'What triggers their interest or need?', tip: 'e.g., Market changes, leadership pressure, growth goals, or pain symptoms.' },
    { q: 'What action do we want them to take?', tip: 'e.g., Download guide, schedule demo, share internally, sign contract.' },
    { q: 'What success looks like for them?', tip: 'e.g., Reduced risk, proven ROI, smoother workflow, better outcomes.' },
    { q: 'Who influences their decisions?', tip: 'e.g., Peers, managers, clients, analysts, industry experts.' },
    { q: 'Where are they seeking information?', tip: 'e.g., LinkedIn, Google, peers, industry events, communities.' },
    { q: "What's slowing their progress?", tip: 'e.g., Lack of clarity, budget delay, competing priorities.' },
    { q: "What signals show they're ready to move forward?", tip: 'e.g., Increased engagement, pricing page visits, direct outreach.' }
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

  const [channelMatrix, setChannelMatrix] = useState<ChannelStage[]>(
    channelPlanningStages.map(stage => ({
      stage,
      entries: [
        { channel: '', purpose: '', contentFit: '', tier: '', type: '' },
        { channel: '', purpose: '', contentFit: '', tier: '', type: '' },
        { channel: '', purpose: '', contentFit: '', tier: '', type: '' }
      ]
    }))
  )

  const [showChannelGaps, setShowChannelGaps] = useState(false)
  const [channelGapInsights, setChannelGapInsights] = useState<{
    insights: string[]
    recommendations: string[]
  }>({ insights: [], recommendations: [] })

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
${filledChannels.length > 0 ? filledChannels.map(e => `- **${e.channel}** (${e.type || 'N/A'}) → ${e.purpose || 'Purpose TBD'} | Tier: ${e.tier || 'N/A'} | Fit: ${e.contentFit || 'N/A'}`).join('\n') : 'No channels defined yet.'}`
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
  const updateChannelEntry = (stageIndex: number, entryIndex: number, field: keyof ChannelEntry, value: string) => {
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
    <div className="p-4 md:p-8 space-y-6 max-w-full overflow-x-hidden">
      <QuickActions module="BrandCraft" />

      {/* STEP 1: Goals & Objectives */}
      {currentStep === 'goals-objectives' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Goals & Objectives</h1>
            <p className="text-gray-600">Define clear goals that map to measurable KPIs and outcomes</p>
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
                  <li><strong className="text-foreground">Content Type Planning</strong> — Map content formats to the journey</li>
                  <li><strong className="text-foreground">Channel Strategy</strong> — Choose where to show up and why</li>
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

              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Define 2-3 clear content marketing goals that connect to business objectives and customer journey stages. Map each goal to a specific stage (Awareness, Consideration, Decision, Retention), select measurable KPIs, and describe expected outcomes.</p>
                      <p><strong>Expected outcome:</strong> A focused set of goals that guide content creation priorities and provide clear success metrics aligned with business objectives.</p>
                      <p><strong>Tip:</strong> Ask yourself: What business objective is this supporting? How will you measure success? What does success look like in tangible terms (pipeline, engagement, retention)?</p>
                    </div>
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Audiences & Personas</h1>
            <p className="text-gray-600">Build personas to guide content strategy and tone with real behavioral insights</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Target Personas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Define your audiences. Build personas to guide content strategy and tone. Add real behavioral and emotional insights.
              </p>

              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Build 2-3 detailed buyer personas representing your core customer groups. Define their name, role, goals & motivations, challenges & pain points, and behaviors & buying triggers. Focus on real behavioral and emotional insights that will guide content strategy and tone.</p>
                      <p><strong>Expected outcome:</strong> Well-defined personas that bring clarity to who you're creating content for and what matters to them, enabling more targeted and effective content decisions.</p>
                      <p><strong>Tip:</strong> Be specific about their goals and challenges. Think about what motivates them and how they make decisions. Focus on real insights, not assumptions or wishful thinking.</p>
                    </div>
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

      {/* STEP 3: Content Identification & Gaps */}
      {currentStep === 'content-identification-gaps' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Content Identification & Gaps</h1>
            <p className="text-gray-600">Catalog existing content across stages and spot coverage gaps</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Inventory by Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Catalog your existing content across stages, assign a persona, and mark status. Keep it simple — two key pieces per stage to quickly spot coverage.
              </p>

              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Catalog your existing content across all journey stages (Awareness, Consideration, Decision, Retention). For each stage, add 2 representative pieces with topic/name, URL, status (Keep/Refresh/Archive), persona assignment, evergreen/campaign classification, and content type.</p>
                      <p><strong>Expected outcome:</strong> A clear inventory showing what content you have, where gaps exist, and what needs to be refreshed or retired. This creates a foundation for strategic content planning.</p>
                      <p><strong>Tip:</strong> Choose one persona per entry from your saved personas. Mark status honestly (Keep/Refresh/Archive). Diversify formats to cover different audience preferences. Then use "Spot Gaps" to identify strategic opportunities.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stage Cards */}
              <div className="space-y-5">
                {contentStages.map((stage) => (
                  <div key={stage} className="bg-card border rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold" style={{ color: moduleColor }}>{stage}</h4>
                      <span className="text-xs text-muted-foreground">2 entries</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[0, 1].map((idx) => (
                        <div key={idx} className="border border-primary/20 rounded-lg p-3 bg-primary/5">
                          <div className="text-xs font-semibold mb-2" style={{ color: moduleColor }}>Content {idx + 1}</div>

                          <div className="space-y-2">
                            <Label className="text-xs font-semibold" style={{ color: moduleColor }}>Topic / Name</Label>
                            <Input
                              placeholder="e.g., ABM 101 Guide"
                              value={contentMap[stage][idx].topic}
                              onChange={(e) => updateContentEntry(stage, idx, 'topic', e.target.value)}
                              data-testid={`input-topic-${stage}-${idx}`}
                            />
                          </div>

                          <div className="space-y-2 mt-3">
                            <Label className="text-xs font-semibold" style={{ color: moduleColor }}>URL</Label>
                            <Input
                              placeholder="https://..."
                              value={contentMap[stage][idx].url}
                              onChange={(e) => updateContentEntry(stage, idx, 'url', e.target.value)}
                              data-testid={`input-url-${stage}-${idx}`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold" style={{ color: moduleColor }}>Status</Label>
                              <Select value={contentMap[stage][idx].status} onValueChange={(v) => updateContentEntry(stage, idx, 'status', v)}>
                                <SelectTrigger data-testid={`select-status-${stage}-${idx}`}>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map(o => (
                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold" style={{ color: moduleColor }}>Persona</Label>
                              <Select value={contentMap[stage][idx].persona} onValueChange={(v) => updateContentEntry(stage, idx, 'persona', v)}>
                                <SelectTrigger data-testid={`select-persona-${stage}-${idx}`}>
                                  <SelectValue placeholder={personas.filter(p => p.name).length ? 'Choose' : 'No personas'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {personas.filter(p => p.name).map(p => (
                                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold" style={{ color: moduleColor }}>Evergreen vs Campaign</Label>
                              <Select value={contentMap[stage][idx].evergreen} onValueChange={(v) => updateContentEntry(stage, idx, 'evergreen', v)}>
                                <SelectTrigger data-testid={`select-evergreen-${stage}-${idx}`}>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {evergreenOptions.map(o => (
                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold" style={{ color: moduleColor }}>Type of Content</Label>
                              <Select value={contentMap[stage][idx].type} onValueChange={(v) => updateContentEntry(stage, idx, 'type', v)}>
                                <SelectTrigger data-testid={`select-type-${stage}-${idx}`}>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {contentTypeOptions.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button onClick={analyzeGaps} variant="default" data-testid="button-analyze-gaps">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Spot Gaps & Suggestions
                </Button>
              </div>

              {/* Inline Gaps & Suggestions */}
              {showGaps && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4">
                  <h4 className="text-base font-semibold mb-2" style={{ color: moduleColor }}>Insights & Recommendations</h4>
                  {gapInsights.findings.length === 0 && gapInsights.recs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Looks solid! No obvious gaps detected. Consider adding more variety over time.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold mb-1" style={{ color: moduleColor }}>Gaps Detected</div>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {gapInsights.findings.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-1" style={{ color: moduleColor }}>Recommendations</div>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {gapInsights.recs.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 4: Journey Mapping */}
      {currentStep === 'journey-mapping' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Journey Mapping</h1>
            <p className="text-gray-600">Map how your buyers move from awareness to decision with real actions and emotions</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Buyer Journey Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Map how your buyers move from awareness to decision. Focus on real actions and emotions — what they actually do, think, and feel at each stage.
              </p>

              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Map how your buyers move from awareness to decision across 13 key questions and 4 journey stages. Capture what they're thinking, feeling, doing, needing, and what barriers exist at each stage. Focus on real actions and emotions, not marketing assumptions.</p>
                      <p><strong>Expected outcome:</strong> A comprehensive journey map revealing the critical transitions between stages, helping you understand when and why buyers move forward (or get stuck), which directly informs content creation priorities.</p>
                      <p><strong>Tip:</strong> Be honest about gaps—this isn't wishful thinking. Capture emotional and behavioral signals, not just actions. Use the field examples for inspiration. Think about what transitions buyers between stages.</p>
                    </div>
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
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4">
                  <h4 className="text-base font-semibold mb-2" style={{ color: moduleColor }}>Insights & Recommendations</h4>
                  <p className="text-sm text-muted-foreground">Looks comprehensive — ready to move into Content Type planning.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 5: Content Type Planning */}
      {currentStep === 'content-type-planning' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Content Type Planning</h1>
            <p className="text-gray-600">Map content formats to each journey stage with clear KPIs</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Type Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Map content formats to each journey stage (Awareness, Consideration, Conversion, Retention) by selecting content types and pairing them with appropriate KPIs. For each entry, write a custom statement explaining how the content type and KPI work together (e.g., "Blog + Traffic → Educate top-funnel audiences").</p>
                      <p><strong>Expected outcome:</strong> A content type matrix showing which formats serve each journey stage, with clear KPIs and strategic rationale that makes execution straightforward and measurable.</p>
                      <p><strong>Tip:</strong> Each stage plays a unique role in moving your audience forward. Awareness captures attention, Consideration builds trust, Conversion drives decisions, and Retention reinforces loyalty. Use suggested types or choose from the full list, then "Spot Gaps" to ensure balanced coverage.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stage Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-primary/20 rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      {contentPlanningStages.map(stage => (
                        <th key={stage} className="p-2 text-center font-semibold bg-primary/10" style={{ color: moduleColor }}>
                          {stage}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {contentTypeMatrix.map((stageData, stageIndex) => (
                        <td key={stageData.stage} className="p-3 align-top bg-background border-t border-primary/10">
                          <div className="space-y-4">
                            <label className="text-[10px] font-semibold text-muted-foreground">Choose Type and Define KPI</label>
                            {stageData.entries.map((entry, entryIndex) => (
                              <div key={entryIndex} className="flex flex-col gap-2 border-b border-border pb-3">
                                <div className="flex gap-1 items-center">
                                  <Select
                                    value={entry.type}
                                    onValueChange={(val) => updateContentTypeEntry(stageIndex, entryIndex, 'type', val)}
                                  >
                                    <SelectTrigger className="text-xs border bg-background flex-1" data-testid={`select-type-${stageData.stage}-${entryIndex}`}>
                                      <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {globalContentList.map(ct => (
                                        <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={entry.kpi}
                                    onValueChange={(val) => updateContentTypeEntry(stageIndex, entryIndex, 'kpi', val)}
                                  >
                                    <SelectTrigger className="text-xs border bg-background min-w-[90px]" data-testid={`select-kpi-${stageData.stage}-${entryIndex}`}>
                                      <SelectValue placeholder="KPI" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {stageKPIs[stageData.stage as keyof typeof stageKPIs].map(k => (
                                        <SelectItem key={k} value={k}>{k}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Textarea
                                  placeholder="Write your own KPI + format statement (e.g., 'Blog + Traffic → Educate top-funnel audiences')"
                                  className="text-[10px] resize-none h-16 bg-background"
                                  value={entry.statement}
                                  onChange={(e) => updateContentTypeEntry(stageIndex, entryIndex, 'statement', e.target.value)}
                                  data-testid={`textarea-statement-${stageData.stage}-${entryIndex}`}
                                />
                              </div>
                            ))}
                            <div className="text-[10px] text-muted-foreground italic mt-2">
                              {stageData.stage === 'Awareness' && 'Example: Blog + Traffic → Educate top-funnel audiences. Infographic + Engagement → Visual summaries for easy sharing.'}
                              {stageData.stage === 'Consideration' && 'Example: Webinar + Leads → Convert interest into leads. eBook + Time on Site → Deepen research and credibility.'}
                              {stageData.stage === 'Conversion' && 'Example: Landing Page + Conversions → Streamline action. Demo Video + Sales Calls → Show value clearly.'}
                              {stageData.stage === 'Retention' && 'Example: Newsletter + CLV → Keep customers informed. Podcast + Loyalty → Strengthen long-term connection.'}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <Button onClick={analyzeContentGaps} variant="default" data-testid="button-content-gaps">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Spot Gaps
                </Button>
              </div>

              {showContentGaps && (
                <div className="bg-card border rounded-xl p-4 text-sm space-y-4">
                  <div>
                    <h4 className="text-base font-semibold mb-2" style={{ color: moduleColor }}>Gap Analysis</h4>
                    
                    {contentTypeGapInsights.insights.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">📊 Key Findings:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-xs">
                          {contentTypeGapInsights.insights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {contentTypeGapInsights.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5">💡 Recommendations:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-xs">
                          {contentTypeGapInsights.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {contentTypeGapInsights.insights.length === 0 && contentTypeGapInsights.recommendations.length === 0 && (
                      <p className="text-sm text-muted-foreground">✅ Looking good! Your content type matrix is well-balanced and comprehensive.</p>
                    )}
                  </div>

                  <div className="pt-3 border-t text-xs text-muted-foreground italic">
                    This analysis cross-references your personas, goals, journey mapping, and content selections to identify strategic gaps.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* STEP 6: Content Channel Planning */}
      {currentStep === 'content-channel-planning' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Channel Strategy Grid</h1>
            <p className="text-gray-600">Map channels to journey stages with purpose, fit, and priority</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Channel Planning Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Map 2-3 channels to each journey stage, defining their Purpose/Role (Educate, Nurture, Convert, Retain), Content Fit (what content style they support), Tier (Core/Campaign/Test), and Type (Organic/Paid/Hybrid). Focus on channels that match your audience's mindset and behaviors at each stage.</p>
                      <p><strong>Expected outcome:</strong> A comprehensive channel strategy showing where to distribute content across the buyer journey, with clear channel continuity and balanced paid/organic mix aligned with your content types.</p>
                      <p><strong>Tip:</strong> Meet your audience where they are—choose channels that match their mindset, not just your reach goals. Keep 1-2 core channels consistent across multiple stages for continuity (e.g., LinkedIn, Email). Use "Spot Gaps" to check stage coverage, paid/organic balance, and alignment with your content types.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-primary/20 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-card">
                      <th className="p-2 font-semibold text-center border-r">Stage</th>
                      <th className="p-2 font-semibold text-center">Channel</th>
                      <th className="p-2 font-semibold text-center">Purpose / Role</th>
                      <th className="p-2 font-semibold text-center">Content Fit</th>
                      <th className="p-2 font-semibold text-center">Tier / Priority</th>
                      <th className="p-2 font-semibold text-center">Type</th>
                      <th className="p-2 font-semibold text-center">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelMatrix.map((stageData, stageIndex) => (
                      stageData.entries.map((entry, entryIndex) => (
                        <tr key={`${stageIndex}-${entryIndex}`} className="border-t border-primary/10 bg-background">
                          {entryIndex === 0 && (
                            <td rowSpan={3} className="p-2 font-semibold text-xs text-center align-top border-r" style={{ color: moduleColor }}>
                              {stageData.stage}
                            </td>
                          )}
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
                            <Select
                              value={entry.purpose}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'purpose', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-purpose-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder={entryIndex === 0 ? 'Educate, Nurture, Convert, Retain' : 'Select Purpose'} />
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
                              value={entry.contentFit}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'contentFit', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-fit-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder={entryIndex === 0 ? 'Best for visual storytelling or authority' : 'Select Fit'} />
                              </SelectTrigger>
                              <SelectContent>
                                {contentFitOptions.map(f => (
                                  <SelectItem key={f} value={f}>{f}</SelectItem>
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
                                <SelectValue placeholder={entryIndex === 0 ? 'Core / Campaign / Test' : 'Select Tier'} />
                              </SelectTrigger>
                              <SelectContent>
                                {tierOptions.map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Select
                              value={entry.type}
                              onValueChange={(val) => updateChannelEntry(stageIndex, entryIndex, 'type', val)}
                            >
                              <SelectTrigger className="text-xs border bg-background w-full" data-testid={`select-channel-type-${stageData.stage}-${entryIndex}`}>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {channelTypeOptions.map(t => (
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Activation Grid</h1>
            <p className="text-gray-600">Turn strategy into action — plan your content activation and distribution</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Activation Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                    <div className="text-sm space-y-2">
                      <p><strong>What to do:</strong> Turn strategy into action by planning content activation and distribution. For each journey stage, define your core asset (anchor content), create 3 derivatives (repurposed snippets), then map each to specific channels, cadence, goals, KPIs, and effort/impact levels. Use the "Pull from Content ID" button to import assets from previous steps.</p>
                      <p><strong>Expected outcome:</strong> A complete activation matrix showing exactly how each piece of content will be distributed, when, where, with what goals, and how you'll measure success—transforming your strategy into an executable content calendar.</p>
                      <p><strong>Tip:</strong> Every strong piece can multiply—think snippets, summaries, or teasers (e.g., Webinar → Blog recap → LinkedIn carousel → Email teaser). Connect to your messaging pillars, set realistic cadence (Daily/Weekly/Monthly/Quarterly/Evergreen), and use industry benchmarks: Awareness (CTR 1-3%), Consideration (Engagement 5-10%), Conversion (Form Fills 2-5%), Retention (Open Rate 20-30%).</p>
                    </div>
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Generate Strategy</h1>
            <p className="text-gray-600">Pull together your complete content strategy document</p>
          </div>

          <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px]" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Pull together your complete content strategy by clicking "Generate Strategy" to synthesize all your previous inputs (goals, personas, content inventory, journey mapping, content types, channels, and activation plans) into comprehensive Executive Summary and full Strategy documents.</p>
                  <p><strong>Expected outcome:</strong> Professional strategy documents ready to share with stakeholders, providing both a high-level executive summary and detailed comprehensive strategy that connects all elements into a cohesive, actionable plan.</p>
                  <p><strong>Tip:</strong> Review for balance—do your assets, audiences, and goals align? Is anything missing or over-weighted? If you make changes to any previous step, regenerate these documents to keep them current. Export or share these docs to guide your team's execution.</p>
                </div>
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

  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto sticky top-16 z-10">
      <div className="flex gap-2 min-w-max">
        {feature.steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              currentStep === step.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={currentStep === step.id ? { backgroundColor: moduleColor } : {}}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {mobileStepsNav}
      <ThreeColumnLayout
        leftNav={leftNav}
        steps={feature.steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        content={content}
        moduleColor={module?.color}
        featureName="Content Strategy"
      />
    </>
  )
}

