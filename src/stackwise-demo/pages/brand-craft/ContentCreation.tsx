import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/stackwise-demo/config/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Sparkles, CheckCircle2, Upload, Download, 
  AlertCircle, Users, Target, Layers, Calendar as CalendarIcon, Tag,
  BookOpen, BarChart2, Link2, PlusCircle, Star, Save,
  Eye, Edit3, Send, Clock, ChevronDown, ChevronRight, ChevronUp,
  Brain, Lightbulb, MessageSquare, PenLine, Check, X,
  ArrowLeft, Bold, Italic, Underline, List, ListOrdered,
  Heading1, Heading2, Link as LinkIcon, Image, Code, Plus,
  Table, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Strikethrough, Subscript, Superscript, Quote, Minus, MoreHorizontal,
  Heading3, ChevronLeft, AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, TrendingUp, Flag, AlertTriangle, DollarSign
} from 'lucide-react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/stackwise-demo/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/stackwise-demo/components/ui/tabs'
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox'
import { Label } from '@/stackwise-demo/components/ui/label'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/stackwise-demo/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/stackwise-demo/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/stackwise-demo/components/ui/popover'
import { Calendar } from '@/stackwise-demo/components/ui/calendar'
import { useToast } from '@/stackwise-demo/hooks/use-toast'
import { MOCK_PILLARS, MOCK_GOALS } from '@/stackwise-demo/data/mockExecutives'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { cn } from '@/stackwise-demo/lib/utils'

type Step = 'brief' | 'alignment' | 'draft-approvals'

type ContentBrief = {
  title: string
  goal: string
  contentType: string
  pillar: string
  subtopic: string
  keywords: string
  targetAudience: string
  keyMessage: string
  supportingPoints: string[]
  tone: string
  channel: string
  cta: string
}

type AlignmentItem = {
  id: string
  source: string
  type: string
  content: string
  aligned: boolean
}

type Draft = {
  id: string
  version: number
  content: string
  status: 'draft' | 'review' | 'approved' | 'published'
  reviewer: string
  feedback: string
  timestamp: string
}

// Zod schema for Create New Draft form
const createDraftSchema = z.object({
  contentType: z.string().min(1, 'Content type is required'),
  topicTitle: z.string().min(1, 'Topic/Title is required'),
  targetPersona: z.string().optional(),
  pillarAssociation: z.string().optional(),
  tonePreference: z.string().optional(),
  keyPoints: z.string().optional(),
  budgetEstimate: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

type CreateDraftFormValues = z.infer<typeof createDraftSchema>

export default function ContentCreation() {
  const module = getModuleById('brand-craft')
  const moduleColor = module?.color || '#c009ba'
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState<Step>('brief')

  // Step 1: Brief state
  const [brief, setBrief] = useState<ContentBrief>({
    title: '',
    goal: '',
    contentType: '',
    pillar: '',
    subtopic: '',
    keywords: '',
    targetAudience: '',
    keyMessage: '',
    supportingPoints: ['', '', ''],
    tone: '',
    channel: '',
    cta: ''
  })
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedCluster, setSelectedCluster] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [showProofPointOptions, setShowProofPointOptions] = useState(false)
  const [showSourceView, setShowSourceView] = useState(false)
  const [showReviewSourceView, setShowReviewSourceView] = useState(false)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontSize, setFontSize] = useState('16')
  const [textColor, setTextColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffff00')
  const [lineSpacing, setLineSpacing] = useState('1.6')
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [alignmentPassed, setAlignmentPassed] = useState(false)
  const [showAlignmentDetails, setShowAlignmentDetails] = useState(false)

  // Brand Tone Check state
  const [toneCheckRun, setToneCheckRun] = useState(false)
  const [toneScore, setToneScore] = useState(0)
  const [toneDimensions, setToneDimensions] = useState({
    vocabularyStyle: 0,
    tonePersonality: 0,
    formalityLevel: 0,
    brandValuesAlignment: 0
  })
  const [showToneDetails, setShowToneDetails] = useState(false)
  const [toneCheckIssues, setToneCheckIssues] = useState<string[]>([])
  const [isRunningToneCheck, setIsRunningToneCheck] = useState(false)

  // Alignment check logic
  const alignmentChecks = {
    pillarMatch: brief.pillar && MOCK_PILLARS.some(p => p.name === brief.pillar),
    goalAlignment: brief.goal && MOCK_GOALS.some(g => g.name.toLowerCase().includes(brief.goal.toLowerCase())),
    personaMatch: brief.targetAudience?.length > 3,
    ctaPresent: brief.cta?.length > 5,
    keywordOptimized: brief.keywords?.split(',').length >= 2
  }
  
  const alignmentScore = Math.round(
    (Object.values(alignmentChecks).filter(Boolean).length / Object.values(alignmentChecks).length) * 100
  )

  const defaultContent = `<h1>The Ultimate Guide to Enterprise ABM Frameworks</h1><p>Enterprise ABM is transforming B2B marketing. With the right framework, marketing teams can achieve predictable pipeline growth and measurable ROI.</p><h2>Why ABM Matters</h2><p>In today's competitive landscape, generic marketing approaches fall short. Account-Based Marketing (ABM) enables precise targeting and personalized engagement at scale.</p><h3>Key Benefits:</h3><ul><li>Higher ROI compared to traditional marketing</li><li>Better alignment between sales and marketing</li><li>Deeper relationships with high-value accounts</li><li>More efficient use of marketing resources</li></ul>`

  // Content Templates
  const contentTemplates = [
    {
      id: 'blog-thought-leadership',
      name: 'Thought Leadership Blog Post',
      category: 'Blog',
      description: 'Establish authority with expert insights and industry analysis',
      preview: 'Industry analysis format with expert perspective...',
      content: `<h1>[Insert Compelling Thought Leadership Title]</h1><p class="lead"><strong>Introduction:</strong> Establish credibility and preview your unique perspective on the industry trend or challenge.</p><h2>The Current State of [Topic]</h2><p>Provide context about the current landscape. Use data, recent trends, or industry shifts to ground your perspective in reality.</p><h3>Key Trends Shaping [Industry/Topic]:</h3><ul><li><strong>Trend 1:</strong> Description and impact</li><li><strong>Trend 2:</strong> Description and impact</li><li><strong>Trend 3:</strong> Description and impact</li></ul><h2>Our Perspective: What Others Are Missing</h2><p>Share your unique take. This is where you differentiate from generic industry commentary. Use frameworks, methodologies, or proprietary insights.</p><blockquote>"Insert a memorable, quotable statement that encapsulates your core thesis."</blockquote><h2>What This Means for [Target Audience]</h2><p>Make it practical. Connect your insights to actionable implications for your reader's role and responsibilities.</p><h3>Three Strategic Actions:</h3><ol><li><strong>Action 1:</strong> Specific step with rationale</li><li><strong>Action 2:</strong> Specific step with rationale</li><li><strong>Action 3:</strong> Specific step with rationale</li></ol><h2>Looking Ahead</h2><p>Share your prediction or vision for where this is heading. Position your organization as the guide for navigating this future.</p><p><strong>Call-to-Action:</strong> [Download our framework / Schedule a consultation / Join our webinar]</p>`
    },
    {
      id: 'blog-how-to',
      name: 'How-To Guide Blog Post',
      category: 'Blog',
      description: 'Step-by-step guide solving a specific problem',
      preview: 'Practical tutorial format with numbered steps...',
      content: `<h1>How to [Achieve Specific Outcome]: A Step-by-Step Guide</h1><p class="lead">Learn how to [solve problem] with our proven framework that has helped [social proof metric].</p><h2>Why This Matters</h2><p>Establish the pain point. Explain why traditional approaches fall short and what's at stake if the reader doesn't solve this problem.</p><h2>What You'll Need</h2><p>Prerequisites, tools, or resources required before starting:</p><ul><li>Tool/Resource 1</li><li>Tool/Resource 2</li><li>Time estimate: [X hours/days]</li></ul><h2>Step 1: [First Major Action]</h2><p>Detailed explanation of the first step. Include screenshots, examples, or specific instructions.</p><h3>Pro Tip:</h3><p>Insider advice or common pitfall to avoid in this step.</p><h2>Step 2: [Second Major Action]</h2><p>Continue with clear, actionable guidance. Use specific examples relevant to your audience.</p><h2>Step 3: [Third Major Action]</h2><p>Maintain momentum with detailed but digestible instructions.</p><h2>Measuring Success</h2><p>Define what good looks like. Provide specific KPIs, benchmarks, or success criteria:</p><ul><li>Metric 1: [Target]</li><li>Metric 2: [Target]</li><li>Metric 3: [Target]</li></ul><h2>Common Mistakes to Avoid</h2><ul><li><strong>Mistake 1:</strong> Why it happens and how to prevent it</li><li><strong>Mistake 2:</strong> Why it happens and how to prevent it</li></ul><p><strong>Next Steps:</strong> [Related resource or CTA]</p>`
    },
    {
      id: 'linkedin-exec-pov',
      name: 'LinkedIn Executive POV',
      category: 'LinkedIn',
      description: 'Executive perspective piece for LinkedIn thought leadership',
      preview: 'Personal narrative with professional insights...',
      content: `<h2>[Hook: Personal Observation or Contrarian Take]</h2><p>Start with a story, surprising stat, or contrarian opinion that stops the scroll.</p><p>I've been thinking about [topic] a lot lately, and here's what I'm seeing...</p><h3>The Problem Everyone's Talking About (But Solving Wrong)</h3><p>Describe the common approach and why it's insufficient. Use a brief example or anecdote that humanizes the issue.</p><h3>What I've Learned [From X Years / At Y Companies / Building Z]:</h3><p><strong>1. [First Insight]</strong><br/>Brief explanation with a specific, memorable example.</p><p><strong>2. [Second Insight]</strong><br/>Connect to broader implications or industry shift.</p><p><strong>3. [Third Insight]</strong><br/>End with your unique perspective or prediction.</p><h3>Why This Matters Now</h3><p>Create urgency. Connect to a current event, market shift, or inflection point that makes this timely.</p><p><strong>The Bottom Line:</strong><br/>[One-sentence summation of your core message]</p><p>What's your take? How are you approaching [topic] at your organization?</p><p class="small-text">#Leadership #[Industry] #[Topic]</p>`
    },
    {
      id: 'case-study',
      name: 'Customer Success Case Study',
      category: 'Case Study',
      description: 'Showcase customer results with before/after narrative',
      preview: 'Problem-solution-results framework...',
      content: `<h1>[Customer Name] Case Study: [Impressive Result Headline]</h1><div class="meta-info"><p><strong>Industry:</strong> [Industry]<br/><strong>Company Size:</strong> [Size]<br/><strong>Use Case:</strong> [Primary Use Case]</p></div><h2>Executive Summary</h2><p>Brief overview of the challenge, solution, and results in 2-3 sentences. Lead with the most impressive metric.</p><blockquote class="highlight-stat">"[Impressive result]: [X%] improvement in [key metric] within [timeframe]"</blockquote><h2>The Challenge</h2><p>Describe the customer's situation before your solution. Be specific about:</p><ul><li>The core problem they were trying to solve</li><li>What they had tried previously</li><li>Why existing solutions weren't working</li><li>The impact on their business</li></ul><h3>Key Pain Points:</h3><ul><li>Pain point 1 with business impact</li><li>Pain point 2 with business impact</li><li>Pain point 3 with business impact</li></ul><h2>The Solution</h2><p>Explain what you implemented and why it worked. Focus on the approach, not just features.</p><h3>Implementation Highlights:</h3><ul><li><strong>Phase 1:</strong> What was deployed and why</li><li><strong>Phase 2:</strong> Scaling and optimization</li><li><strong>Phase 3:</strong> Advanced capabilities</li></ul><h2>The Results</h2><p>Lead with the most impressive metrics. Use specific numbers, percentages, and timeframes.</p><div class="results-grid"><ul><li><strong>[X%]</strong> increase in [metric]</li><li><strong>[Y%]</strong> reduction in [metric]</li><li><strong>[Z]</strong> improvement in [qualitative outcome]</li><li><strong>ROI:</strong> [Specific timeframe to value]</li></ul></div><h3>Customer Quote:</h3><blockquote>"[Authentic quote from customer highlighting the most compelling benefit or transformation]"<br/><cite>— [Name, Title, Company]</cite></blockquote><h2>Key Takeaways</h2><p>What other companies in this industry or facing similar challenges can learn:</p><ol><li>Lesson 1</li><li>Lesson 2</li><li>Lesson 3</li></ol><p><strong>Ready to achieve similar results?</strong> [CTA: Schedule consultation, Download full report, etc.]</p>`
    },
    {
      id: 'webinar-recap',
      name: 'Webinar Recap Blog',
      category: 'Blog',
      description: 'Convert webinar content into standalone blog post',
      preview: 'Webinar highlights with key takeaways...',
      content: `<h1>[Webinar Topic]: Key Takeaways and Insights</h1><p class="lead">Missed our recent webinar on [topic]? Here's everything you need to know from our conversation with [speaker/expert].</p><div class="webinar-meta"><p><strong>Featured Expert:</strong> [Name, Title]<br/><strong>Date:</strong> [Date]<br/><strong>Watch the full recording:</strong> [Link]</p></div><h2>Overview</h2><p>Brief context about why you hosted this webinar and what ground you covered. Set expectations for what the reader will learn.</p><h2>The Big Questions We Tackled</h2><h3>1. [First Major Question/Topic]</h3><p><strong>Key Insight:</strong> [Expert's main point or recommendation]</p><p>Expand on the insight with supporting details, data, or examples shared during the webinar.</p><blockquote>"[Memorable quote from speaker]"</blockquote><h3>2. [Second Major Question/Topic]</h3><p><strong>Key Insight:</strong> [Expert's main point or recommendation]</p><p>Continue with detailed takeaways. Include frameworks, methodologies, or tactical advice shared.</p><h3>3. [Third Major Question/Topic]</h3><p><strong>Key Insight:</strong> [Expert's main point or recommendation]</p><p>Maintain the pattern of insight + elaboration + practical application.</p><h2>Audience Q&A Highlights</h2><p>Share 2-3 of the best questions from the audience with the expert's responses:</p><p><strong>Q: [Question]</strong><br/><strong>A:</strong> [Response]</p><h2>Resources and Next Steps</h2><ul><li><a href="#">Download the slide deck</a></li><li><a href="#">Watch the full recording</a></li><li><a href="#">Download [related resource]</a></li><li><a href="#">Register for our next webinar on [topic]</a></li></ul><p><strong>Want to dive deeper?</strong> [CTA relevant to webinar topic]</p>`
    },
    {
      id: 'email-newsletter',
      name: 'Email Newsletter',
      category: 'Email',
      description: 'Engaging newsletter format with multiple content blocks',
      preview: 'Multi-topic newsletter with clear sections...',
      content: `<div class="email-header"><h1>[Newsletter Name]</h1><p class="subtitle">[Tagline or value proposition] • [Date]</p></div><div class="intro-section"><p>Hi [First Name],</p><p>[Personal greeting or context-setting intro that explains the theme or timing of this newsletter edition.]</p></div><hr/><h2>🔥 This Month's Spotlight</h2><h3>[Main Feature Headline]</h3><p>Brief, compelling description of your main content piece, product update, or announcement. Include a clear benefit statement.</p><p><a href="#" class="cta-button">Read More →</a></p><hr/><h2>📚 What We're Reading</h2><ul><li><strong><a href="#">[Article Title 1]</a></strong><br/><span class="small-text">One-sentence description of why this is worth reading</span></li><li><strong><a href="#">[Article Title 2]</a></strong><br/><span class="small-text">One-sentence description of why this is worth reading</span></li><li><strong><a href="#">[Article Title 3]</a></strong><br/><span class="small-text">One-sentence description of why this is worth reading</span></li></ul><hr/><h2>💡 Quick Tip of the Week</h2><p><strong>[Actionable tip headline]</strong></p><p>Brief, tactical advice your audience can implement immediately. Keep it focused and specific.</p><hr/><h2>📅 Upcoming Events</h2><ul><li><strong>[Event Name]</strong> • [Date]<br/><span class="small-text">[Brief description] • <a href="#">Register now</a></span></li><li><strong>[Event Name]</strong> • [Date]<br/><span class="small-text">[Brief description] • <a href="#">Register now</a></span></li></ul><hr/><div class="closing"><p>Until next time,<br/>[Your Name]<br/>[Your Title]</p><p class="small-text">P.S. [Optional personal note, ask, or secondary CTA]</p></div><div class="footer"><p class="small-text">You're receiving this because you subscribed to [Newsletter Name].<br/><a href="#">Update preferences</a> • <a href="#">Unsubscribe</a></p></div>`
    }
  ]

  const handleLoadTemplate = (template: typeof contentTemplates[0]) => {
    setCurrentDraft(template.content)
    setShowTemplateLibrary(false)
    toast({
      title: "Template loaded",
      description: `"${template.name}" loaded into editor`,
    })
  }

  // Pillar subtopics mapping (from Messaging House)
  const pillarSubtopics: {[key: string]: string[]} = {
    'BrandCraft': ['Content Strategy', 'Brand Voice', 'Messaging Framework', 'Content Creation', 'SEO & Keywords'],
    'ABM Ops': ['Account Targeting', 'Pipeline Velocity', 'Sales Alignment', 'Account Intelligence', 'Multi-Channel Orchestration'],
    'Flight Deck': ['Campaign Planning', 'Budget Management', 'Asset Management', 'Performance Tracking', 'Campaign Execution'],
    'Pulse Hub': ['Performance Analytics', 'Channel Analytics', 'Strategic Health', 'Competitive Intelligence', 'Roadmap Planning'],
    'Custom Pillar': []
  }

  // Step 2: Alignment state
  const [fitScore, setFitScore] = useState(72)
  const [insight, setInsight] = useState('This brief aligns with the Brand Storytelling pillar and Awareness-stage intent for Marketing Directors.')
  const [gap, setGap] = useState('Pipeline Velocity keywords missing from the awareness content cluster.')
  const [alignmentResponses, setAlignmentResponses] = useState<{[key: string]: {[key: string]: string}}>({})
  const [alignmentFeedback, setAlignmentFeedback] = useState('')
  const [promptIndex, setPromptIndex] = useState(0)
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    strategic: true,
    brand: false,
    keyword: false,
    persona: false,
    gaps: false,
    cta: false,
  })

  // Step 3: Draft & Approvals state
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: '1',
      version: 1,
      content: '',
      status: 'draft',
      reviewer: '',
      feedback: '',
      timestamp: new Date().toISOString()
    }
  ])
  const [currentDraft, setCurrentDraft] = useState('')
  const [editingDraft, setEditingDraft] = useState<{id: string, title: string} | null>(null)
  const [approvalStage, setApprovalStage] = useState<'drafts-view' | 'review' | 'approval'>('drafts-view')
  const [showFinalPreview, setShowFinalPreview] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'bold' | 'italic' | 'underline' | null>(null)

  // Create New Draft Dialog state
  const [createDraftDialogOpen, setCreateDraftDialogOpen] = useState(false)
  const createDraftForm = useForm<CreateDraftFormValues>({
    resolver: zodResolver(createDraftSchema),
    defaultValues: {
      contentType: '',
      topicTitle: '',
      targetPersona: '',
      pillarAssociation: '',
      tonePreference: '',
      keyPoints: '',
      budgetEstimate: '',
      startDate: undefined,
      endDate: undefined,
    },
  })

  // Handle Create New Draft form submission
  const handleCreateDraftSubmit = (values: CreateDraftFormValues) => {
    console.log('Create Draft Form Values:', values)
    
    toast({
      title: "Draft generation started",
      description: `Creating ${values.contentType} draft: "${values.topicTitle}"`,
    })
    
    // Close dialog and reset form
    setCreateDraftDialogOpen(false)
    createDraftForm.reset()
  }

  // Rotating prompts for alignment
  const prompts = [
    "Does this content solve a real customer question or just add noise?",
    "Which KPI will signal success — traffic, engagement, pipeline influence?",
    "Does this content move your audience from awareness → consideration → action?",
    "Is the tone consistent with your BrandCraft voice (e.g., confident, grounded, helpful)?",
    "What's this persona's headspace when they see this content?",
    "What's the next logical action after this content?"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex(prev => (prev + 1) % prompts.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  // Handlers
  const handleSaveProgress = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setLastSaved(new Date().toLocaleTimeString())
      toast({
        title: "Progress saved",
        description: "Your work has been saved",
      })
    }, 800)
  }

  const handleAlignmentQuestionChange = (section: string, question: string, value: string) => {
    setAlignmentResponses(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: value,
      },
    }))
  }

  const handleRecalculateFit = () => {
    let newScore = 72
    Object.values(alignmentResponses).forEach(section => {
      Object.values(section).forEach(answer => {
        if (answer && answer.length > 0) newScore += 1.5
      })
    })
    setFitScore(Math.min(Math.round(newScore), 100))
    setAlignmentFeedback('Fit recalculated based on user responses and contextual alignment inputs.')
    toast({
      title: "Fit score updated",
      description: `New fit score: ${Math.min(Math.round(newScore), 100)}%`,
    })
  }

  // Brand Tone Check function
  const handleRunBrandToneCheck = () => {
    setIsRunningToneCheck(true)
    
    // Simulate AI analysis delay
    setTimeout(() => {
      // Mock analysis based on brief tone and content
      const hasContent = currentDraft && currentDraft.length > 100
      const hasBriefTone = brief.tone && brief.tone.length > 0
      const hasPillar = brief.pillar && brief.pillar.length > 0
      
      // Generate mock scores with some variance
      const baseScore = hasContent && hasBriefTone && hasPillar ? 75 : 60
      const variance = Math.floor(Math.random() * 20) - 10
      
      const vocabularyScore = Math.max(50, Math.min(100, baseScore + variance + 5))
      const tonePersonalityScore = Math.max(50, Math.min(100, baseScore + variance))
      const formalityScore = Math.max(50, Math.min(100, baseScore + variance + 3))
      const brandValuesScore = Math.max(50, Math.min(100, baseScore + variance - 2))
      
      const overallScore = Math.round((vocabularyScore + tonePersonalityScore + formalityScore + brandValuesScore) / 4)
      
      setToneDimensions({
        vocabularyStyle: vocabularyScore,
        tonePersonality: tonePersonalityScore,
        formalityLevel: formalityScore,
        brandValuesAlignment: brandValuesScore
      })
      setToneScore(overallScore)
      setToneCheckRun(true)
      
      // Generate issues if score is low
      const issues: string[] = []
      if (vocabularyScore < 80) issues.push("Consider using more industry-standard terminology that aligns with your brand pillar")
      if (tonePersonalityScore < 80) issues.push(`Tone doesn't fully match ${brief.tone || 'expected brand'} voice - review key phrases`)
      if (formalityScore < 80) issues.push("Formality level inconsistent with target audience expectations")
      if (brandValuesScore < 80) issues.push("Some statements don't clearly reflect brand values from Messaging House")
      
      setToneCheckIssues(issues)
      setIsRunningToneCheck(false)
      
      toast({
        title: "Brand Tone Check Complete",
        description: `Overall tone score: ${overallScore}%`,
      })
    }, 1500)
  }

  // WYSIWYG formatting functions
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const alignmentSections: {[key: string]: string[]} = {
    strategic: [
      "Is this content solving a real customer question or just adding noise?",
      "Which KPI will signal success?",
      "Does this piece support a current campaign?",
    ],
    brand: [
      "Does the message ladder up to your brand promise?",
      "Is the tone consistent with your BrandCraft voice?",
      "Which brand pillar does this reinforce?",
    ],
    keyword: [
      "Which keyword reflects audience language?",
      "Is keyword intent aligned with funnel stage?",
      "Add seasonal or campaign terms to include.",
    ],
    persona: [
      "What's this persona's mindset at this stage?",
      "What question do they need answered right now?",
      "Would this resonate with influencer or decision-maker?",
    ],
    gaps: [
      "Do you already have similar content?",
      "Would it be more impactful to refresh?",
      "Is there a competitor outperforming on this keyword?",
    ],
    cta: [
      "What's the next logical action after this content?",
      "Should you add a related download or link?",
      "Could this be part of a campaign or series?",
    ],
  }

  // Main content area
  const mainContent = (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 brandcraft-input-focus">
      <style>{`
        /* Override input focus colors to use BrandCraft module color */
        .brandcraft-input-focus input:focus-visible,
        .brandcraft-input-focus textarea:focus-visible {
          --tw-ring-color: ${moduleColor} !important;
          border-color: ${moduleColor} !important;
          box-shadow: 0 0 0 2px ${moduleColor}40 !important;
        }
        .brandcraft-input-focus [role="combobox"]:focus,
        .brandcraft-input-focus [data-radix-select-trigger]:focus,
        .brandcraft-input-focus button[data-radix-select-trigger]:focus {
          --tw-ring-color: ${moduleColor} !important;
          border-color: ${moduleColor} !important;
          box-shadow: 0 0 0 2px ${moduleColor}40 !important;
        }
        /* Override all default buttons to use BrandCraft pink */
        .brandcraft-input-focus button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]) {
          background-color: ${moduleColor} !important;
          border-color: ${moduleColor} !important;
          color: white !important;
        }
        .brandcraft-input-focus button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]):hover {
          opacity: 0.9 !important;
        }
      `}</style>
      <QuickActions module="BrandCraft" />
      
      {/* Save indicator */}
      {lastSaved && (
        <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? 'Saving…' : `Last saved ${lastSaved}`}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: Brief */}
        {currentStep === 'brief' && (
          <motion.div
            key="brief"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                  Step 1 of 3
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Content Brief</h1>
              <p className="text-muted-foreground">Define your content requirements and strategic foundation</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-upload-brief">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your Own Brief
            </Button>
          </div>

          {/* Coaching Prompt */}
          <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <p className="text-sm">
                  <strong>Coaching Prompt:</strong> Define what you're creating, who it's for, and why it matters. Auto-populate from existing strategies to save time and ensure alignment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Auto-populate from modules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload size={16} style={{ color: moduleColor }} />
                Auto-populate from Modules
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Start with insights from Content Strategy or Keyword Research. This will prepopulate fields below.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">From Content Strategy</Label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger data-testid="select-content-strategy">
                    <SelectValue placeholder="Select a saved strategy..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1-2024">Q1 2024 Enterprise ABM Strategy</SelectItem>
                    <SelectItem value="thought-leadership">Thought Leadership Series</SelectItem>
                    <SelectItem value="product-launch">Product Launch Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">From Keyword Research</Label>
                <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                  <SelectTrigger data-testid="select-keyword-cluster">
                    <SelectValue placeholder="Select a keyword cluster..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abm-frameworks">ABM Frameworks Cluster (12 keywords)</SelectItem>
                    <SelectItem value="enterprise-sales">Enterprise Sales Enablement (8 keywords)</SelectItem>
                    <SelectItem value="pipeline-growth">Pipeline Growth Strategies (15 keywords)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                size="sm" 
                className="w-full" 
                data-testid="button-auto-populate"
                onClick={() => {
                  // Auto-populate from Content Strategy or Keyword Research
                  setBrief({
                    ...brief,
                    title: 'The Ultimate Guide to Enterprise ABM Frameworks',
                    goal: 'Awareness',
                    contentType: 'Blog',
                    pillar: 'ABM Ops',
                    subtopic: 'Account Targeting',
                    keywords: 'enterprise ABM, account-based marketing, ABM frameworks',
                    targetAudience: 'Marketing Director',
                    keyMessage: 'ABM transforms B2B marketing by enabling precise targeting and measurable ROI',
                    supportingPoints: [
                      'Forrester reports 208% ROI increase with ABM',
                      'Alignment with sales improves close rates by 38%',
                      'Strategic account relationships deepen over time'
                    ],
                    tone: 'Professional', // Auto-set from Messaging House
                    channel: 'Blog'
                  })
                  toast({
                    title: "Brief auto-populated",
                    description: "Content details loaded from Content Strategy & Messaging House",
                  })
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Auto-populate Brief
              </Button>
            </CardContent>
          </Card>

          {/* Manual Brief Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={16} style={{ color: moduleColor }} />
                Content Brief Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Title or Working Concept</Label>
                <p className="text-xs text-muted-foreground mb-1">Give your piece a simple working title or headline idea. Don't overthink it — you can refine later.</p>
                <Input 
                  placeholder="Enter a draft title or headline idea..."
                  value={brief.title}
                  onChange={(e) => setBrief({ ...brief, title: e.target.value })}
                  data-testid="input-content-title"
                />
              </div>

              {/* Goal */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Goal / Objective</Label>
                <p className="text-xs text-muted-foreground mb-1">What's the main job of this content? (e.g., educate, inspire, convert)</p>
                <Select value={brief.goal} onValueChange={(val) => setBrief({ ...brief, goal: val })}>
                  <SelectTrigger data-testid="select-goal">
                    <SelectValue placeholder="Select or type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {['Awareness', 'Engagement', 'Lead Gen', 'Nurture', 'Conversion', 'Retention'].map((goal, i) => (
                      <SelectItem key={i} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Content Type */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Primary Content Type</Label>
                <p className="text-xs text-muted-foreground mb-1">Select one main format for this piece. This will prepopulate in the Create Content step.</p>
                <Select value={brief.contentType} onValueChange={(val) => setBrief({ ...brief, contentType: val })}>
                  <SelectTrigger data-testid="select-content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Blog','Social Media','Ad Copy (H1/H2/CTA)','FAQ','Opinion Piece / Article','Infographic','Email / Newsletter','Landing Page','Video Storyboard','eBook / Guide','Webinar Slides','LinkedIn Carousel','Long-form / Whitepaper','Case Study (Short Form)','Case Study (Long Form)'].map((t, idx) => (
                      <SelectItem key={idx} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pillar and Subtopic - Dynamic from Messaging House */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Pillar & Subtopic</Label>
                <p className="text-xs text-muted-foreground mb-1">Pull from Messaging House. Subtopics update based on your pillar selection.</p>
                <div className="grid grid-cols-2 gap-2">
                  <Select 
                    value={brief.pillar} 
                    onValueChange={(val) => {
                      setBrief({ ...brief, pillar: val, subtopic: '' }) // Reset subtopic when pillar changes
                    }}
                  >
                    <SelectTrigger data-testid="select-pillar">
                      <SelectValue placeholder="Select Pillar from Messaging House" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(pillarSubtopics).map((p, i) => (
                        <SelectItem key={i} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={brief.subtopic}
                    onValueChange={(val) => setBrief({ ...brief, subtopic: val })}
                    disabled={!brief.pillar || brief.pillar === 'Custom Pillar'}
                  >
                    <SelectTrigger data-testid="select-subtopic">
                      <SelectValue placeholder={brief.pillar ? "Select Subtopic..." : "Select Pillar first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {brief.pillar && pillarSubtopics[brief.pillar]?.map((sub, i) => (
                        <SelectItem key={i} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {brief.pillar === 'Custom Pillar' && (
                  <Input 
                    placeholder="Enter custom subtopic..." 
                    className="mt-2"
                    value={brief.subtopic}
                    onChange={(e) => setBrief({ ...brief, subtopic: e.target.value })}
                    data-testid="input-custom-subtopic"
                  />
                )}
              </div>

              {/* Keywords */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Keywords or Topics</Label>
                <p className="text-xs text-muted-foreground mb-1">Select or add keywords that anchor your topic and signal search intent.</p>
                <Input 
                  placeholder="Add keywords or select from Keyword Research / Topic Clusters..."
                  value={brief.keywords}
                  onChange={(e) => setBrief({ ...brief, keywords: e.target.value })}
                  data-testid="input-keywords"
                />
              </div>

              {/* Audience - Dropdown from Messaging House */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Target Audience / Persona</Label>
                <p className="text-xs text-muted-foreground mb-1">Select from Messaging House personas. These are strategically aligned with your brand positioning.</p>
                <Select value={brief.targetAudience} onValueChange={(val) => setBrief({ ...brief, targetAudience: val })}>
                  <SelectTrigger data-testid="select-target-audience">
                    <SelectValue placeholder="Select persona from Messaging House" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing Director">Marketing Director (Strategic Thinker)</SelectItem>
                    <SelectItem value="VP of Marketing">VP of Marketing (Decision Maker)</SelectItem>
                    <SelectItem value="Content Manager">Content Manager (Executor)</SelectItem>
                    <SelectItem value="CMO">CMO (Visionary Leader)</SelectItem>
                    <SelectItem value="Demand Gen Lead">Demand Gen Lead (Performance Focused)</SelectItem>
                    <SelectItem value="Sales Leader">Sales Leader (Revenue Driven)</SelectItem>
                    <SelectItem value="Growth Marketer">Growth Marketer (Data Obsessed)</SelectItem>
                    <SelectItem value="Brand Manager">Brand Manager (Creative Guardian)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Key Message or Insight</Label>
                <p className="text-xs text-muted-foreground mb-1">What's the one idea you want them to remember or feel after reading?</p>
                <Textarea 
                  placeholder="Write your core message or insight..."
                  value={brief.keyMessage}
                  onChange={(e) => setBrief({ ...brief, keyMessage: e.target.value })}
                  data-testid="textarea-key-message"
                />
              </div>

              {/* Proof Points - Pull from Modules, Manual, or Upload */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Supporting Points or Proof</Label>
                <p className="text-xs text-muted-foreground mb-1">Pull data from other modules, add manually, or upload files to support your main point.</p>
                
                {/* Pull from Modules Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mb-3"
                  onClick={() => setShowProofPointOptions(!showProofPointOptions)}
                  data-testid="button-pull-proof-points"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Pull Proof Points from Content Strategy or Keyword Research
                </Button>

                {showProofPointOptions && (
                  <Card className="mb-3 bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Select proof points to add:</p>
                        {[
                          'Forrester reports 208% ROI increase with ABM',
                          'Alignment with sales improves close rates by 38%',
                          'Strategic account relationships deepen over time',
                          '70% of marketers see higher engagement with ABM',
                          'Enterprise buyers prefer personalized content experiences'
                        ].map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => {
                                const points = [...brief.supportingPoints]
                                const emptyIndex = points.findIndex(p => !p)
                                if (emptyIndex !== -1) {
                                  points[emptyIndex] = point
                                  setBrief({ ...brief, supportingPoints: points })
                                  toast({
                                    title: "Proof point added",
                                    description: `Added to supporting point ${emptyIndex + 1}`,
                                  })
                                }
                              }}
                              data-testid={`button-add-proof-${idx}`}
                            >
                              <Plus className="w-3 h-3 mr-1" />Add
                            </Button>
                            <span className="text-muted-foreground">{point}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Manual Entry Fields */}
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Input 
                      placeholder={`Supporting point ${i + 1} (manual entry or pull from above)`}
                      value={brief.supportingPoints[i] || ''}
                      onChange={(e) => {
                        const points = [...brief.supportingPoints]
                        points[i] = e.target.value
                        setBrief({ ...brief, supportingPoints: points })
                      }}
                      className="flex-1"
                      data-testid={`input-supporting-point-${i + 1}`}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Upload proof point",
                          description: "File upload feature - attach case studies, reports, or data files",
                        })
                      }}
                      data-testid={`button-upload-proof-${i + 1}`}
                    >
                      <Upload className="w-4 h-4 mr-1" />Upload
                    </Button>
                  </div>
                ))}
              </div>

              {/* Tone */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Tone & Voice</Label>
                <p className="text-xs text-muted-foreground mb-1">How should this sound? Pulls directly from Messaging House guidelines.</p>
                <Select value={brief.tone} onValueChange={(val) => setBrief({ ...brief, tone: val })}>
                  <SelectTrigger data-testid="select-tone">
                    <SelectValue placeholder="Select tone from Messaging House" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Professional','Conversational','Bold','Thoughtful','Playful','Empowering','Grounded','Inspirational','Analytical','Human','Visionary'].map((tone, i) => (
                      <SelectItem key={i} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Channel */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>Channel or Placement</Label>
                <p className="text-xs text-muted-foreground mb-1">Where will this live? Choose a primary placement or select other.</p>
                <Select value={brief.channel} onValueChange={(val) => setBrief({ ...brief, channel: val })}>
                  <SelectTrigger data-testid="select-channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Blog','LinkedIn Post','Email Newsletter','Landing Page','Website Page','Webinar Slides','eBook / Guide','Ad Copy','Social Ad','Video Script','Podcast Outline','Press Release','Case Study','FAQ Page','Brochure','Sales Enablement Deck'].map((ch, i) => (
                      <SelectItem key={i} value={ch}>{ch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* CTA */}
              <div>
                <Label className="text-sm font-semibold" style={{ color: moduleColor }}>CTA or Next Step</Label>
                <p className="text-xs text-muted-foreground mb-1">What do you want them to do next? (e.g., download, schedule, share)</p>
                <Input 
                  placeholder="Enter desired action..."
                  value={brief.cta}
                  onChange={(e) => setBrief({ ...brief, cta: e.target.value })}
                  data-testid="input-cta"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Brief */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleSaveProgress} data-testid="button-save-brief">
              <Save className="h-4 w-4 mr-2" />
              Save Brief
            </Button>
            <Button variant="outline" data-testid="button-save-template">
              Save as Template
            </Button>
          </div>

          {/* Coaching Footer */}
          <div className="text-xs italic text-muted-foreground border-t pt-3">
            "A clear brief saves hours in revisions. Take time here to define success criteria and alignment points."
          </div>
          </motion.div>
        )}

        {/* STEP 2: Alignment */}
        {currentStep === 'alignment' && (
          <motion.div
            key="alignment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                Step 2 of 3
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Content Alignment</h1>
            <p className="text-muted-foreground">Ensure your content aligns with brand strategy, messaging, and keyword priorities</p>
          </div>

          {/* Coaching Prompt */}
          <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <p className="text-sm">
                  <strong>Coaching Prompt:</strong> Validate your content against brand messaging, business goals, and strategic framework. Aim for 85%+ alignment to ensure strategic fit.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Overall Fit Score */}
          <Card className="border-2" style={{ background: `linear-gradient(to right, ${moduleColor}15, ${moduleColor}25)`, borderColor: moduleColor }}>
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-2" style={{ color: moduleColor }}>Overall Fit Score</h4>
              <div className="flex items-center justify-between">
                <div className="text-5xl font-bold" style={{ color: moduleColor }}>{fitScore}%</div>
                <div className="text-sm text-muted-foreground text-right">
                  {fitScore >= 85 ? '✓ Excellent — fully aligned' : fitScore >= 60 ? '→ Good — needs refinement' : '⚠ Low — requires attention'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Alignment Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: moduleColor }} />
                Strategic Alignment Checks
              </CardTitle>
              <CardDescription>Cross-reference with Messaging House, Business Goals, and Annual Strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messaging House Alignment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Messaging House</h4>
                  <Badge variant={brief.pillar ? "default" : "secondary"}>
                    {brief.pillar ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {brief.pillar ? 'Aligned' : 'Not Set'}
                  </Badge>
                </div>
                {brief.pillar ? (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                    <div className="text-sm">
                      <strong>Pillar:</strong> {brief.pillar}
                      {brief.subtopic && <> • <strong>Subtopic:</strong> {brief.subtopic}</>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {MOCK_PILLARS.find(p => p.name === brief.pillar)?.description || 'Aligns with your messaging framework'}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-md border border-yellow-200 dark:border-yellow-800 text-sm text-muted-foreground">
                    Select a pillar in Step 1 to validate messaging alignment
                  </div>
                )}
              </div>

              {/* Business Goals Alignment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Business Goals</h4>
                  <Badge variant={brief.goal ? "default" : "secondary"}>
                    {brief.goal ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {brief.goal ? 'Aligned' : 'Not Set'}
                  </Badge>
                </div>
                {brief.goal ? (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                    <div className="text-sm">
                      <strong>Goal:</strong> {brief.goal}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {MOCK_GOALS.find(g => g.category.toLowerCase() === brief.goal.toLowerCase())?.name || 
                       `Supports ${brief.goal.toLowerCase()} stage objectives`}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-md border border-yellow-200 dark:border-yellow-800 text-sm text-muted-foreground">
                    Set a goal in Step 1 to validate business objectives alignment
                  </div>
                )}
              </div>

              {/* Annual Goals Check */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Annual Strategy Goals</h4>
                  <Badge variant="outline">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    3 Active Goals
                  </Badge>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Increase brand awareness by 40% (Current: {brief.goal === 'Awareness' ? 'Aligned ✓' : 'Not aligned'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Generate 500 qualified leads/month (Current: {brief.goal === 'Lead Gen' ? 'Aligned ✓' : 'Partial'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Improve sales velocity by 25% (Current: {brief.goal === 'Conversion' ? 'Aligned ✓' : 'Partial'})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Framework */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Strategic Framework</h4>
                  <Badge variant="outline">
                    <Flag className="w-3 h-3 mr-1" />
                    Q4 2025 Strategy
                  </Badge>
                </div>
                <div className="p-3 rounded-md border" style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Focus Areas</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Retention</Badge>
                        <Badge variant="outline" className="text-xs">Brand Consistency</Badge>
                        <Badge variant="outline" className="text-xs">Exec POV</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Target Personas</div>
                      <div className="text-xs">Marketing Directors, VP Marketing</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Match Insight & Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold" style={{ color: moduleColor }}>Auto-Match Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={insight} 
                  onChange={(e) => setInsight(e.target.value)}
                  className="text-sm min-h-[100px] border"
                  style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}
                  data-testid="textarea-insight"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold" style={{ color: moduleColor }}>Spotted Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={gap} 
                  onChange={(e) => setGap(e.target.value)}
                  className="text-sm min-h-[100px] border"
                  style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}
                  data-testid="textarea-gap"
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm font-medium py-2" style={{ color: moduleColor }}>
            ✨ Let's get that Fit Score higher — answer a few quick prompts below ✨
          </div>

          {/* Alignment Prompts */}
          <div className="space-y-3">
            {Object.entries(alignmentSections).map(([id, questions]) => (
              <Card key={id}>
                <button
                  type="button"
                  onClick={() => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold bg-muted/30 hover:bg-muted/50 transition-colors rounded-t-md"
                  data-testid={`toggle-${id}`}
                >
                  <span className="uppercase">{id} PROMPTS</span>
                  <span className="text-xs text-muted-foreground">{openSections[id] ? 'Hide' : 'Show'}</span>
                </button>
                {openSections[id] && (
                  <CardContent className="pt-3 space-y-3">
                    {questions.map((q, i) => (
                      <div key={i}>
                        <Label className="text-xs text-muted-foreground mb-1">{q}</Label>
                        <Input
                          placeholder="Your response..."
                          value={alignmentResponses[id]?.[q] || ''}
                          onChange={(e) => handleAlignmentQuestionChange(id, q, e.target.value)}
                          data-testid={`input-${id}-${i}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Apply Answers */}
          <div className="flex flex-col gap-3">
            <Button className="w-full" onClick={handleRecalculateFit} data-testid="button-recalculate-fit">
              <Sparkles className="w-4 h-4 mr-2" />
              Apply Answers & Recalculate Fit
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Tip: Completing prompts and contextual inputs improves alignment accuracy and makes Projects fully searchable.
            </p>
          </div>

          {alignmentFeedback && (
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-4 text-sm">
                <strong>Updated Alignment:</strong> {alignmentFeedback}
              </CardContent>
            </Card>
          )}

          {/* Example Output */}
          <Card className="border" style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}>
            <CardContent className="pt-4 text-xs space-y-2">
              <strong>Example Output:</strong>
              <p>Fit Score: {fitScore}% — Aligned with <strong>Brand Storytelling</strong> pillar, targeting <strong>Marketing Director</strong> at the <strong>Awareness</strong> stage.</p>
              <p>Detected Gap: {gap}</p>
              {fitScore < 60 && <p className="text-red-600 dark:text-red-400">⚠️ Low alignment — add more inputs or adjust persona.</p>}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setCurrentStep('draft-approvals')} data-testid="button-proceed-to-draft">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Alignment & Proceed to Draft
            </Button>
            <Button variant="outline" onClick={() => setCurrentStep('brief')} data-testid="button-revise-brief">
              <Edit3 className="h-4 w-4 mr-2" />
              Revise Brief
            </Button>
          </div>

          {/* Coaching Footer */}
          <div className="text-xs italic text-muted-foreground border-t pt-3">
            "Alignment isn't about perfection—it's about intentionality. If something doesn't align, decide: adjust the brief or document why this is a strategic exception."
          </div>
          </motion.div>
        )}

        {/* STEP 3: Draft & Approvals */}
        {currentStep === 'draft-approvals' && (
          <motion.div
            key="draft-approvals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                Step 3 of 3
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Draft & Approvals</h1>
            <p className="text-muted-foreground">Create AI-assisted drafts, format content, and manage the approval workflow</p>
          </div>

          {/* Coaching Prompt */}
          <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Review AI-generated drafts, edit content in the comprehensive WYSIWYG editor, and manage the three-stage approval workflow (Drafts → Review → Approval).</p>
                  <p><strong>Expected outcome:</strong> Polished, brand-aligned content with proper formatting ready for publication. Track versions and collaboration through the color-coded workflow stages.</p>
                  <p><strong>Tip:</strong> AI creates first drafts—your role is to inject authentic brand voice and refine messaging. Use the full formatting toolbar to structure content professionally.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Selector - Color-coded for workflow visibility */}
          <div className="flex gap-3 p-1 bg-muted/30 rounded-md">
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 rounded-md ${
                approvalStage === 'drafts-view' 
                  ? '' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              style={approvalStage === 'drafts-view' ? {
                borderColor: moduleColor,
                backgroundColor: `${moduleColor}15`,
                color: moduleColor
              } : {}}
              onClick={() => setApprovalStage('drafts-view')}
              data-testid="button-stage-drafts"
            >
              Drafts
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 rounded-md ${
                approvalStage === 'review' 
                  ? '' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              style={approvalStage === 'review' ? {
                borderColor: moduleColor,
                backgroundColor: `${moduleColor}15`,
                color: moduleColor
              } : {}}
              onClick={() => setApprovalStage('review')}
              data-testid="button-stage-review"
            >
              Review
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 rounded-md ${
                approvalStage === 'approval' 
                  ? '' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              style={approvalStage === 'approval' ? {
                borderColor: moduleColor,
                backgroundColor: `${moduleColor}15`,
                color: moduleColor
              } : {}}
              onClick={() => setApprovalStage('approval')}
              data-testid="button-stage-approval"
            >
              Approval
            </Button>
          </div>

          {/* DRAFTS VIEW */}
          {approvalStage === 'drafts-view' && !editingDraft && (
            <div className="space-y-4">
              {/* Draft Items List */}
              <div className="grid gap-3">
                {[
                  { 
                    id: 1, 
                    title: 'The Ultimate Guide to Enterprise ABM Frameworks',
                    type: 'Blog Post',
                    status: 'draft',
                    lastEdit: '2 hours ago',
                    author: 'You',
                    wordCount: 2453,
                    content: 'Enterprise ABM is transforming B2B marketing...'
                  },
                  { 
                    id: 2, 
                    title: 'How AI Enhances (Not Replaces) Marketing Teams',
                    type: 'LinkedIn Article',
                    status: 'review',
                    lastEdit: '1 day ago',
                    author: 'Sarah Chen',
                    wordCount: 1890,
                    content: 'The marketing landscape is changing faster than ever...'
                  }
                ].map((draft) => (
                  <Card key={draft.id} className="hover:bg-muted/30 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{draft.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              draft.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {draft.status === 'draft' ? 'Draft' : 'In Review'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{draft.type}</span>
                            <span>•</span>
                            <span>{draft.wordCount} words</span>
                            <span>•</span>
                            <span>{draft.author}</span>
                            <span>•</span>
                            <span>{draft.lastEdit}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingDraft({ id: String(draft.id), title: draft.title })
                              setCurrentDraft(draft.content)
                            }}
                            data-testid={`button-edit-draft-${draft.id}`}
                          >
                            <Edit3 className="w-4 h-4 mr-1"/>Edit
                          </Button>
                          <Button size="sm" variant="ghost" data-testid={`button-delete-draft-${draft.id}`}>
                            <X className="w-4 h-4"/>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                data-testid="button-create-draft"
                onClick={() => setCreateDraftDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1"/>Create New Draft
              </Button>
            </div>
          )}

          {/* DRAFT EDITOR */}
          {approvalStage === 'drafts-view' && editingDraft && (
            <div className="space-y-4">
              {/* Editor Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingDraft(null)}
                    data-testid="button-back-to-drafts"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1"/>Back to Drafts
                  </Button>
                  <h3 className="text-base font-semibold">{editingDraft.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{currentDraft.split(' ').filter(w => w).length} words</span>
              </div>

              {/* AI Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles size={16} style={{ color: moduleColor }} />
                    AI Draft Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/30 border rounded-md p-3 text-xs space-y-1">
                    <p><strong>Brief:</strong> {brief.title || 'The Ultimate Guide to Enterprise ABM Frameworks'}</p>
                    <p><strong>Type:</strong> {brief.contentType || 'Blog Post'}</p>
                    <p><strong>Persona:</strong> {brief.targetAudience || 'CMO / VP Marketing'}</p>
                    <p><strong>Keywords:</strong> {brief.keywords || 'ABM frameworks, enterprise marketing'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const generatedContent = currentDraft + "\n\n[AI-generated content based on your brand voice and brief would appear here. This demonstrates the Generate Content feature that leverages AI to expand on your ideas while maintaining consistency with your messaging framework.]"
                        setCurrentDraft(generatedContent)
                        toast({
                          title: "Content generated",
                          description: "New content has been added to your draft",
                        })
                      }}
                      data-testid="button-generate-draft"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Generate AI Draft
                    </Button>
                    <Button size="sm" variant="outline" data-testid="button-save-draft">
                      <Save className="h-4 w-4 mr-1"/>Save
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Sent to review",
                          description: "Draft has been sent to reviewers",
                        })
                        setEditingDraft(null)
                        setApprovalStage('review')
                      }}
                      data-testid="button-send-to-review"
                    >
                      <Send className="h-4 w-4 mr-1"/>Send to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Template Library */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText size={16} style={{ color: moduleColor }} />
                      Template Library
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
                      data-testid="button-toggle-templates"
                    >
                      {showTemplateLibrary ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start with a professional template and customize to your needs
                  </p>
                </CardHeader>
                {showTemplateLibrary && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contentTemplates.map((template) => (
                        <Card key={template.id} className="border hover:border-primary/50 transition-colors">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold">{template.name}</h4>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {template.category}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleLoadTemplate(template)}
                                data-testid={`button-load-template-${template.id}`}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Load
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                            <div className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded border">
                              {template.preview}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* COMPREHENSIVE WYSIWYG Editor */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Edit3 size={16} style={{ color: moduleColor }} />
                      Comprehensive Content Editor
                    </CardTitle>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowSourceView(!showSourceView)}
                      data-testid="button-toggle-source"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      {showSourceView ? 'Visual' : 'Source'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* COMPREHENSIVE Formatting Toolbar */}
                  {!showSourceView && (
                    <div className="space-y-2">
                      {/* Row 1: Font, Size, Color, Background */}
                      <div className="flex flex-wrap gap-2 p-2 rounded-md border" style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}>
                        <Select value={fontFamily} onValueChange={(value) => { setFontFamily(value); applyFormat('fontName', value) }}>
                          <SelectTrigger className="h-8 w-[140px]" data-testid="select-font-family">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={fontSize} onValueChange={(value) => { setFontSize(value); applyFormat('fontSize', value) }}>
                          <SelectTrigger className="h-8 w-[80px]" data-testid="select-font-size">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">8pt</SelectItem>
                            <SelectItem value="2">10pt</SelectItem>
                            <SelectItem value="3">12pt</SelectItem>
                            <SelectItem value="4">14pt</SelectItem>
                            <SelectItem value="5">16pt</SelectItem>
                            <SelectItem value="6">18pt</SelectItem>
                            <SelectItem value="7">24pt</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Color:</label>
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => { setTextColor(e.target.value); applyFormat('foreColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-text-color"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Highlight:</label>
                          <input 
                            type="color" 
                            value={bgColor}
                            onChange={(e) => { setBgColor(e.target.value); applyFormat('backColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-bg-color"
                          />
                        </div>
                        <div className="w-px bg-border mx-1" />
                        <Select value={lineSpacing} onValueChange={(value) => { setLineSpacing(value); document.execCommand('formatBlock', false, 'p'); const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { const range = sel.getRangeAt(0); let parent = range.commonAncestorContainer.parentElement; while (parent && parent.tagName !== 'P' && parent.tagName !== 'DIV') { parent = parent.parentElement; } if (parent) parent.style.lineHeight = value; } }}>
                          <SelectTrigger className="h-8 w-[110px]" data-testid="select-line-spacing">
                            <SelectValue placeholder="Line Spacing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.0">Single</SelectItem>
                            <SelectItem value="1.15">1.15</SelectItem>
                            <SelectItem value="1.5">1.5 lines</SelectItem>
                            <SelectItem value="1.6">1.6 lines</SelectItem>
                            <SelectItem value="2.0">Double</SelectItem>
                            <SelectItem value="2.5">2.5 lines</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'top'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Top" 
                          data-testid="button-valign-top"
                        >
                          <AlignVerticalJustifyStart className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'middle'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Middle" 
                          data-testid="button-valign-middle"
                        >
                          <AlignVerticalJustifyCenter className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'bottom'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Bottom" 
                          data-testid="button-valign-bottom"
                        >
                          <AlignVerticalJustifyEnd className="w-4 h-4" />
                        </Button>
                        <div className="w-px bg-border mx-1" />
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('removeFormat')} className="h-8 px-2" title="Clear Formatting" data-testid="button-format-clear">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Row 2: Text Style & All Other Formatting */}
                      <div className="flex flex-wrap gap-1 p-2 rounded-md border" style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}>
                        {/* Text Style */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('bold')} className="h-8 px-2" data-testid="button-format-bold">
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('italic')} className="h-8 px-2" data-testid="button-format-italic">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('underline')} className="h-8 px-2" data-testid="button-format-underline">
                          <Underline className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('strikeThrough')} className="h-8 px-2" data-testid="button-format-strike">
                          <Strikethrough className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('subscript')} className="h-8 px-2" title="Subscript" data-testid="button-format-sub">
                          <Subscript className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('superscript')} className="h-8 px-2" title="Superscript" data-testid="button-format-super">
                          <Superscript className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Headings */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h1>')} className="h-8 px-2" data-testid="button-format-h1">
                          <Heading1 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h2>')} className="h-8 px-2" data-testid="button-format-h2">
                          <Heading2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h3>')} className="h-8 px-2" data-testid="button-format-h3">
                          <Heading3 className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Lists */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertUnorderedList')} className="h-8 px-2" data-testid="button-format-ul">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertOrderedList')} className="h-8 px-2" data-testid="button-format-ol">
                          <ListOrdered className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<blockquote>')} className="h-8 px-2" title="Block Quote" data-testid="button-format-quote">
                          <Quote className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('indent')} className="h-8 px-2" title="Indent" data-testid="button-format-indent">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('outdent')} className="h-8 px-2" title="Outdent" data-testid="button-format-outdent">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Alignment */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyLeft')} className="h-8 px-2" title="Align Left" data-testid="button-format-left">
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyCenter')} className="h-8 px-2" title="Align Center" data-testid="button-format-center">
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyRight')} className="h-8 px-2" title="Align Right" data-testid="button-format-right">
                          <AlignRight className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyFull')} className="h-8 px-2" title="Justify" data-testid="button-format-justify">
                          <AlignJustify className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Links & Media */}
                        <Button size="sm" variant="ghost" onClick={() => {
                          const url = prompt('Enter URL:')
                          if (url) applyFormat('createLink', url)
                        }} className="h-8 px-2" title="Insert Link" data-testid="button-format-link">
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          const url = prompt('Enter image URL:')
                          if (url) applyFormat('insertImage', url)
                        }} className="h-8 px-2" title="Insert Image" data-testid="button-format-image">
                          <Image className="w-4 h-4" />
                        </Button>

                        <div className="w-px bg-border mx-1" />

                        {/* Table & Formatting */}
                        <Button size="sm" variant="ghost" onClick={() => {
                          const rows = prompt('Number of rows:', '3')
                          const cols = prompt('Number of columns:', '3')
                          if (rows && cols) {
                            let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>'
                            for (let i = 0; i < parseInt(rows); i++) {
                              table += '<tr>'
                              for (let j = 0; j < parseInt(cols); j++) {
                                table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>'
                              }
                              table += '</tr>'
                            }
                            table += '</tbody></table>'
                            applyFormat('insertHTML', table)
                          }
                        }} className="h-8 px-2" title="Insert Table" data-testid="button-format-table">
                          <Table className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertHorizontalRule')} className="h-8 px-2" title="Horizontal Line" data-testid="button-format-hr">
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground px-2">
                        <strong>💡 COMPLETE WYSIWYG:</strong> Font Family, Font Size, Text Color, Background Highlight, Line Spacing, Vertical Alignment, Clear Formatting, Bold, Italic, Underline, Strikethrough, Sub/Superscript, Headings (H1-H3), Lists, Quotes, Indent/Outdent, Text Alignment, Links, Images, Tables, Horizontal Rules
                      </div>
                    </div>
                  )}

                  {/* WYSIWYG Content Area OR Source View */}
                  {showSourceView ? (
                    <Textarea
                      value={currentDraft}
                      onChange={(e) => setCurrentDraft(e.target.value)}
                      className="w-full min-h-[500px] font-mono text-xs"
                      placeholder="HTML source code..."
                      data-testid="editor-source"
                    />
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setCurrentDraft(e.currentTarget.innerHTML || '')}
                      dangerouslySetInnerHTML={{ __html: currentDraft || defaultContent }}
                      className="w-full min-h-[500px] p-4 text-sm border rounded-md focus:outline-none bg-background prose prose-sm max-w-none"
                      style={{ lineHeight: '1.6', borderColor: moduleColor }}
                      data-testid="editor-wysiwyg"
                    />
                  )}

                  <div className="text-xs text-muted-foreground">
                    💡 <strong>Comprehensive Editor:</strong> Includes tables, line spacing, images, links, source view toggle, and all formatting options. Final content exports to DOCX, PDF, HTML, and Markdown with proper formatting.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* REVIEW STAGE */}
          {approvalStage === 'review' && (
            <div className="space-y-4">
              <Card style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }} className="border-2">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4" style={{ color: moduleColor }} />
                    <span className="font-medium" style={{ color: moduleColor }}>Review in Progress</span>
                    <span className="text-muted-foreground">— Sarah Chen is reviewing your draft</span>
                  </div>
                </CardContent>
              </Card>

              {/* COMPREHENSIVE WYSIWYG Editor for Review - EXACT SAME as Draft Editor */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Edit3 size={16} style={{ color: moduleColor }} />
                        Comprehensive Content Editor (Review)
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Edit content directly with full formatting options based on reviewer feedback
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowReviewSourceView(!showReviewSourceView)}
                      data-testid="button-toggle-review-source"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      {showReviewSourceView ? 'Visual' : 'Source'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* COMPREHENSIVE Formatting Toolbar - SAME AS DRAFT */}
                  {!showReviewSourceView && (
                    <div className="space-y-2">
                      {/* Row 1: Font, Size, Color, Background */}
                      <div className="flex flex-wrap gap-2 p-2 rounded-md border" style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}>
                        <Select value={fontFamily} onValueChange={(value) => { setFontFamily(value); applyFormat('fontName', value) }}>
                          <SelectTrigger className="h-8 w-[140px]" data-testid="select-review-font-family">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                            <SelectItem value="Impact">Impact</SelectItem>
                            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={fontSize} onValueChange={(value) => { setFontSize(value); applyFormat('fontSize', value) }}>
                          <SelectTrigger className="h-8 w-[80px]" data-testid="select-review-font-size">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">8pt</SelectItem>
                            <SelectItem value="2">10pt</SelectItem>
                            <SelectItem value="3">12pt</SelectItem>
                            <SelectItem value="4">14pt</SelectItem>
                            <SelectItem value="5">16pt</SelectItem>
                            <SelectItem value="6">18pt</SelectItem>
                            <SelectItem value="7">24pt</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Color:</label>
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => { setTextColor(e.target.value); applyFormat('foreColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-review-text-color"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-muted-foreground">Highlight:</label>
                          <input 
                            type="color" 
                            value={bgColor}
                            onChange={(e) => { setBgColor(e.target.value); applyFormat('backColor', e.target.value) }}
                            className="h-8 w-12 rounded border cursor-pointer"
                            data-testid="input-review-bg-color"
                          />
                        </div>
                        <div className="w-px bg-border mx-1" />
                        <Select value={lineSpacing} onValueChange={(value) => { setLineSpacing(value); document.execCommand('formatBlock', false, 'p'); const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { const range = sel.getRangeAt(0); let parent = range.commonAncestorContainer.parentElement; while (parent && parent.tagName !== 'P' && parent.tagName !== 'DIV') { parent = parent.parentElement; } if (parent) parent.style.lineHeight = value; } }}>
                          <SelectTrigger className="h-8 w-[110px]" data-testid="select-review-line-spacing">
                            <SelectValue placeholder="Line Spacing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.0">Single</SelectItem>
                            <SelectItem value="1.15">1.15</SelectItem>
                            <SelectItem value="1.5">1.5 lines</SelectItem>
                            <SelectItem value="1.6">1.6 lines</SelectItem>
                            <SelectItem value="2.0">Double</SelectItem>
                            <SelectItem value="2.5">2.5 lines</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'top'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Top" 
                          data-testid="button-review-valign-top"
                        >
                          <AlignVerticalJustifyStart className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'middle'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Middle" 
                          data-testid="button-review-valign-middle"
                        >
                          <AlignVerticalJustifyCenter className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            const sel = window.getSelection()
                            if (sel && sel.rangeCount > 0) {
                              const range = sel.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.verticalAlign = 'bottom'
                              range.surroundContents(span)
                            }
                          }} 
                          className="h-8 px-2" 
                          title="Vertical Align Bottom" 
                          data-testid="button-review-valign-bottom"
                        >
                          <AlignVerticalJustifyEnd className="w-4 h-4" />
                        </Button>
                        <div className="w-px bg-border mx-1" />
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('removeFormat')} className="h-8 px-2" title="Clear Formatting" data-testid="button-review-format-clear">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Row 2: Text Style & All Other Formatting */}
                      <div className="flex flex-wrap gap-1 p-2 rounded-md border" style={{ backgroundColor: `${moduleColor}15`, borderColor: moduleColor }}>
                        {/* Text Style */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('bold')} className="h-8 px-2" data-testid="button-review-format-bold"><Bold className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('italic')} className="h-8 px-2" data-testid="button-review-format-italic"><Italic className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('underline')} className="h-8 px-2" data-testid="button-review-format-underline"><Underline className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('strikeThrough')} className="h-8 px-2" data-testid="button-review-format-strike"><Strikethrough className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('subscript')} className="h-8 px-2" title="Subscript" data-testid="button-review-format-sub"><Subscript className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('superscript')} className="h-8 px-2" title="Superscript" data-testid="button-review-format-super"><Superscript className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Headings */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h1>')} className="h-8 px-2" data-testid="button-review-format-h1"><Heading1 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h2>')} className="h-8 px-2" data-testid="button-review-format-h2"><Heading2 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<h3>')} className="h-8 px-2" data-testid="button-review-format-h3"><Heading3 className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Lists */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertUnorderedList')} className="h-8 px-2" data-testid="button-review-format-ul"><List className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertOrderedList')} className="h-8 px-2" data-testid="button-review-format-ol"><ListOrdered className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('formatBlock', '<blockquote>')} className="h-8 px-2" title="Block Quote" data-testid="button-review-format-quote"><Quote className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('indent')} className="h-8 px-2" title="Indent" data-testid="button-review-format-indent"><ChevronRight className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('outdent')} className="h-8 px-2" title="Outdent" data-testid="button-review-format-outdent"><ChevronLeft className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Alignment */}
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyLeft')} className="h-8 px-2" title="Align Left" data-testid="button-review-format-left"><AlignLeft className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyCenter')} className="h-8 px-2" title="Align Center" data-testid="button-review-format-center"><AlignCenter className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyRight')} className="h-8 px-2" title="Align Right" data-testid="button-review-format-right"><AlignRight className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('justifyFull')} className="h-8 px-2" title="Justify" data-testid="button-review-format-justify"><AlignJustify className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Links & Media */}
                        <Button size="sm" variant="ghost" onClick={() => { const url = prompt('Enter URL:'); if (url) applyFormat('createLink', url) }} className="h-8 px-2" title="Insert Link" data-testid="button-review-format-link"><LinkIcon className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => { const url = prompt('Enter image URL:'); if (url) applyFormat('insertImage', url) }} className="h-8 px-2" title="Insert Image" data-testid="button-review-format-image"><Image className="w-4 h-4" /></Button>
                        <div className="w-px bg-border mx-1" />
                        {/* Table & Formatting */}
                        <Button size="sm" variant="ghost" onClick={() => {
                          const rows = prompt('Number of rows:', '3'); const cols = prompt('Number of columns:', '3')
                          if (rows && cols) { let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>'
                            for (let i = 0; i < parseInt(rows); i++) { table += '<tr>'; for (let j = 0; j < parseInt(cols); j++) { table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>' } table += '</tr>' }
                            table += '</tbody></table>'; applyFormat('insertHTML', table) }
                        }} className="h-8 px-2" title="Insert Table" data-testid="button-review-format-table"><Table className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => applyFormat('insertHorizontalRule')} className="h-8 px-2" title="Horizontal Line" data-testid="button-review-format-hr"><Minus className="w-4 h-4" /></Button>
                      </div>
                      <div className="text-xs text-muted-foreground px-2">
                        <strong>💡 COMPLETE WYSIWYG:</strong> Font Family, Font Size, Text Color, Background Highlight, Line Spacing, Vertical Alignment, Clear Formatting, Bold, Italic, Underline, Strikethrough, Sub/Superscript, Headings (H1-H3), Lists, Quotes, Indent/Outdent, Text Alignment, Links, Images, Tables, Horizontal Rules
                      </div>
                    </div>
                  )}

                  {/* WYSIWYG Content Area OR Source View */}
                  {showReviewSourceView ? (
                    <Textarea
                      value={currentDraft}
                      onChange={(e) => setCurrentDraft(e.target.value)}
                      className="w-full min-h-[500px] font-mono text-xs"
                      placeholder="HTML source code..."
                      data-testid="editor-review-source"
                    />
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setCurrentDraft(e.currentTarget.innerHTML || '')}
                      dangerouslySetInnerHTML={{ __html: currentDraft || defaultContent }}
                      className="w-full min-h-[500px] p-4 text-sm border rounded-md focus:outline-none bg-background prose prose-sm max-w-none"
                      style={{ lineHeight: '1.6', borderColor: moduleColor }}
                      data-testid="editor-review-wysiwyg"
                    />
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => { toast({ title: "Changes saved", description: "Your edits have been saved" }) }} 
                      data-testid="button-save-review-edits"
                      style={{ backgroundColor: moduleColor, color: 'white', borderColor: moduleColor }}
                      className="hover:opacity-90 !bg-[#c009ba] !border-[#c009ba]"
                    >
                      <Save className="h-4 w-4 mr-1"/>Save Edits
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      data-testid="button-add-review-comment"
                      style={{ borderColor: moduleColor, color: moduleColor }}
                      className="hover:bg-[#c009ba]15"
                    >
                      <MessageSquare className="h-4 w-4 mr-1"/>Add Comment
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    💡 <strong>Comprehensive Editor:</strong> Includes tables, line spacing, images, links, source view toggle, and all formatting options. Final content exports to DOCX, PDF, HTML, and Markdown with proper formatting.
                  </div>
                </CardContent>
              </Card>

              {/* Reviewer Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare size={16} style={{ color: moduleColor }} />
                    Reviewer Comments & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-2 pl-3 py-2" style={{ borderLeftColor: moduleColor, backgroundColor: `${moduleColor}15` }}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <strong>Sarah Chen</strong> • 1 hour ago
                    </div>
                    <p className="text-sm">Strong opening! Consider adding a specific stat about ABM ROI in the first paragraph to hook readers immediately.</p>
                  </div>
                  <div className="border-l-2 pl-3 py-2" style={{ borderLeftColor: 'green', backgroundColor: '#32CD3215' }}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <strong>You</strong> • 30 min ago
                    </div>
                    <p className="text-sm">Great suggestion! I'll add the Forrester stat about 208% ROI.</p>
                  </div>
                  <Textarea 
                    placeholder="Add your response to feedback..."
                    rows={3}
                    data-testid="textarea-add-feedback-response"
                    className="border-2 focus:border-2 focus:ring-0"
                    style={{ borderColor: moduleColor }}
                    onFocus={(e) => e.target.style.borderColor = moduleColor}
                    onBlur={(e) => e.target.style.borderColor = moduleColor}
                  />
                  <Button 
                    size="sm" 
                    data-testid="button-post-comment"
                    style={{ backgroundColor: moduleColor, color: 'white', borderColor: moduleColor }}
                    className="hover:opacity-90 !bg-[#c009ba] !border-[#c009ba]"
                  >
                    <Send className="h-4 w-4 mr-1"/>Post Comment
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1 hover:opacity-90 !bg-[#c009ba] !border-[#c009ba]"
                  onClick={() => setApprovalStage('approval')}
                  data-testid="button-send-for-approval"
                  style={{ backgroundColor: moduleColor, color: 'white', borderColor: moduleColor }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1"/>
                  Send for Approval
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setApprovalStage('drafts-view')}
                  data-testid="button-back-to-drafts-from-review"
                  style={{ borderColor: moduleColor, color: moduleColor }}
                  className="hover:bg-[#32CD3215]"
                >
                  <ArrowLeft className="h-4 w-4 mr-1"/>
                  Back to Drafts
                </Button>
              </div>
            </div>
          )}

          {/* APPROVAL STAGE */}
          {approvalStage === 'approval' && (
            <div className="space-y-4">
              {/* Alignment Quality Gate */}
              <Card className={`border-2 ${alignmentScore >= 80 ? 'bg-green-50 dark:bg-green-950/20 border-green-500' : alignmentScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' : 'bg-red-50 dark:bg-red-950/20 border-red-500'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alignmentScore >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : alignmentScore >= 60 ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Strategic Alignment Check</span>
                          <Badge variant={alignmentScore >= 80 ? "default" : alignmentScore >= 60 ? "secondary" : "destructive"}>
                            {alignmentScore}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alignmentScore >= 80 ? 'Content is strategically aligned and ready to publish' :
                           alignmentScore >= 60 ? 'Minor alignment issues detected - review recommended' :
                           'Critical alignment gaps - must fix before publishing'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAlignmentDetails(!showAlignmentDetails)}
                      data-testid="button-toggle-alignment-details"
                    >
                      {showAlignmentDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {showAlignmentDetails && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="grid gap-2">
                        {[
                          { key: 'pillarMatch', label: 'Content Pillar Selected', pass: alignmentChecks.pillarMatch },
                          { key: 'goalAlignment', label: 'Aligns with Business Goals', pass: alignmentChecks.goalAlignment },
                          { key: 'personaMatch', label: 'Target Audience Defined', pass: alignmentChecks.personaMatch },
                          { key: 'ctaPresent', label: 'Clear Call-to-Action', pass: alignmentChecks.ctaPresent },
                          { key: 'keywordOptimized', label: 'Keyword Strategy (2+ keywords)', pass: alignmentChecks.keywordOptimized }
                        ].map(check => (
                          <div key={check.key} className="flex items-center justify-between text-xs p-2 rounded bg-background">
                            <span className={check.pass ? 'text-foreground' : 'text-muted-foreground'}>{check.label}</span>
                            {check.pass ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      {alignmentScore < 80 && (
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
                          <strong>Quick Fix:</strong> Go back to Brief step and complete missing fields to improve alignment.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Brand Tone Check - NEW QUALITY GATE */}
              <Card className={`border-2 ${!toneCheckRun ? 'bg-gray-50 dark:bg-gray-950/20 border-gray-300' : toneScore >= 80 ? 'bg-green-50 dark:bg-green-950/20 border-green-500' : toneScore >= 50 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' : 'bg-red-50 dark:bg-red-950/20 border-red-500'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!toneCheckRun ? (
                        <Brain className="w-5 h-5 text-gray-600" />
                      ) : toneScore >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : toneScore >= 50 ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Brand Tone Check</span>
                          {toneCheckRun && (
                            <Badge variant={toneScore >= 80 ? "default" : toneScore >= 50 ? "secondary" : "destructive"}>
                              {toneScore}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {!toneCheckRun ? 'Run check to verify content matches brand voice from Messaging House' :
                           toneScore >= 80 ? 'Content tone aligns with brand voice guidelines' :
                           toneScore >= 70 ? 'Minor tone adjustments recommended' :
                           toneScore >= 50 ? 'Content needs tone refinement to meet approval threshold (≥70)' :
                           'Critical tone issues - must fix before publishing'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {toneCheckRun && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowToneDetails(!showToneDetails)}
                          data-testid="button-toggle-tone-details"
                        >
                          {showToneDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {!toneCheckRun && (
                    <div className="mt-3">
                      <Button
                        onClick={handleRunBrandToneCheck}
                        disabled={isRunningToneCheck}
                        className="w-full"
                        data-testid="button-run-tone-check"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {isRunningToneCheck ? 'Analyzing Tone...' : 'Run Brand Tone Check'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Content must score ≥70 to enable approval
                      </p>
                    </div>
                  )}

                  {toneCheckRun && showToneDetails && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="grid gap-3">
                        {[
                          { key: 'vocabularyStyle', label: 'Vocabulary & Language Style', score: toneDimensions.vocabularyStyle },
                          { key: 'tonePersonality', label: 'Tone & Personality', score: toneDimensions.tonePersonality },
                          { key: 'formalityLevel', label: 'Formality Level', score: toneDimensions.formalityLevel },
                          { key: 'brandValuesAlignment', label: 'Brand Values Alignment', score: toneDimensions.brandValuesAlignment }
                        ].map(dimension => (
                          <div key={dimension.key} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">{dimension.label}</span>
                              <div className="flex items-center gap-2">
                                <span className={dimension.score >= 80 ? 'text-green-600' : dimension.score >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                                  {dimension.score}%
                                </span>
                                {dimension.score >= 80 ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : dimension.score >= 50 ? (
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                ) : (
                                  <X className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${dimension.score >= 80 ? 'bg-green-600' : dimension.score >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                style={{ width: `${dimension.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {toneCheckIssues.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md space-y-1">
                          <p className="text-xs font-semibold flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            Recommendations:
                          </p>
                          <ul className="text-xs space-y-1 ml-4 list-disc text-muted-foreground">
                            {toneCheckIssues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRunBrandToneCheck}
                        disabled={isRunningToneCheck}
                        className="w-full mt-2"
                        data-testid="button-recheck-tone"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {isRunningToneCheck ? 'Re-analyzing...' : 'Re-check Tone'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2" style={{ borderColor: moduleColor }}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send size={16} style={{ color: moduleColor }} />
                    Export & Publish
                  </CardTitle>
                  {(alignmentScore < 60 || (toneCheckRun && toneScore < 70)) && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ Export disabled - {alignmentScore < 60 ? 'fix alignment issues' : ''}{alignmentScore < 60 && toneCheckRun && toneScore < 70 ? ' and ' : ''}{toneCheckRun && toneScore < 70 ? 'improve tone score (≥70 required)' : ''}
                    </p>
                  )}
                  {alignmentScore >= 60 && !toneCheckRun && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⚠️ Run Brand Tone Check before publishing
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !toneCheckRun || toneScore < 70} data-testid="button-export-docx">
                      <Download className="h-4 w-4 mr-2" />
                      Export .DOCX
                    </Button>
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !toneCheckRun || toneScore < 70} data-testid="button-export-pdf">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !toneCheckRun || toneScore < 70} data-testid="button-export-html">
                      <Download className="h-4 w-4 mr-2" />
                      Export HTML
                    </Button>
                    <Button variant="outline" size="sm" disabled={alignmentScore < 60 || !toneCheckRun || toneScore < 70} data-testid="button-copy-markdown">
                      <Download className="h-4 w-4 mr-2" />
                      Copy Markdown
                    </Button>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold mb-2">Integrate with Other Modules</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" disabled={alignmentScore < 60 || !toneCheckRun || toneScore < 70} data-testid="button-send-flight-deck">
                        <Link2 className="h-4 w-4 mr-2" />
                        Add to Flight Deck Campaign
                      </Button>
                      <Button size="sm" variant="outline" disabled={alignmentScore < 60 || !toneCheckRun || toneScore < 70} data-testid="button-flag-eval">
                        <Star className="h-4 w-4 mr-2" />
                        Flag for Eval Matrix
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/30 border rounded-md p-2 text-xs text-muted-foreground">
                    💡 Published content is automatically saved to your <strong>Projects</strong> tab for future reference and reuse.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Coaching Footer */}
          <div className="text-xs italic text-muted-foreground border-t pt-3">
            "Great content is never 'done'—it's refined through collaboration. Use feedback loops to strengthen your voice while maintaining strategic alignment."
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const contentCreationSteps = [
    { id: 'brief', label: 'Brief', description: 'Define content parameters' },
    { id: 'draft-approvals', label: 'Draft & Approvals', description: 'Create and review content' }
  ]

  const feature = module?.features?.find(f => f.id === 'content-creation')

  const leftNav = (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-lg font-bold mb-1" style={{ color: moduleColor }}>
        {module?.label}
      </h2>
      <p className="text-xs text-muted-foreground mb-4">{feature?.label}</p>
    </div>
  )

  return (
    <>
      <ThreeColumnLayout
        leftNav={leftNav}
        steps={contentCreationSteps}
        currentStep={currentStep}
        onStepChange={(stepId) => setCurrentStep(stepId as Step)}
        content={mainContent}
        moduleColor={moduleColor}
        featureName="Content Creation"
      />

      {/* Create New Draft Dialog */}
      <Dialog open={createDraftDialogOpen} onOpenChange={setCreateDraftDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" style={{ color: moduleColor }} />
              Create New Draft
            </DialogTitle>
            <DialogDescription>
              Define the requirements for your new content draft. Required fields are marked with *.
            </DialogDescription>
          </DialogHeader>

          <Form {...createDraftForm}>
            <form onSubmit={createDraftForm.handleSubmit(handleCreateDraftSubmit)} className="space-y-4">
              {/* Content Type - Required */}
              <FormField
                control={createDraftForm.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-draft-content-type">
                          <SelectValue placeholder="Select content type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Blog">Blog</SelectItem>
                        <SelectItem value="Guide">Guide</SelectItem>
                        <SelectItem value="Case Study">Case Study</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Webinar">Webinar</SelectItem>
                        <SelectItem value="Whitepaper">Whitepaper</SelectItem>
                        <SelectItem value="Podcast">Podcast</SelectItem>
                        <SelectItem value="Infographic">Infographic</SelectItem>
                        <SelectItem value="Social Post">Social Post</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Topic/Title - Required */}
              <FormField
                control={createDraftForm.control}
                name="topicTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic/Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the topic or title for this content" 
                        data-testid="input-draft-topic-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Persona - Optional */}
              <FormField
                control={createDraftForm.control}
                name="targetPersona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Persona</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Marketing Director, CTO, Sales Manager" 
                        data-testid="input-draft-target-persona"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter target persona or select from available personas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pillar Association - Optional */}
              <FormField
                control={createDraftForm.control}
                name="pillarAssociation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pillar Association</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-draft-pillar">
                          <SelectValue placeholder="Select pillar (from Messaging House)..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Product Innovation">Product Innovation</SelectItem>
                        <SelectItem value="Thought Leadership">Thought Leadership</SelectItem>
                        <SelectItem value="Customer Success">Customer Success</SelectItem>
                        <SelectItem value="Industry Insights">Industry Insights</SelectItem>
                        <SelectItem value="Best Practices">Best Practices</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Align with your Messaging House pillars
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tone Preference - Optional */}
              <FormField
                control={createDraftForm.control}
                name="tonePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone Preference</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-draft-tone">
                          <SelectValue placeholder="Select tone (defaults to brand tone)..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Conversational">Conversational</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Optional - defaults to your brand tone settings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Key Points to Cover - Optional */}
              <FormField
                control={createDraftForm.control}
                name="keyPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Points to Cover</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter key points, themes, or messages to include in the content..."
                        className="min-h-[100px]"
                        data-testid="textarea-draft-key-points"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional guidance for AI content generation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget Estimate - Optional */}
              <FormField
                control={createDraftForm.control}
                name="budgetEstimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Estimate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number"
                          placeholder="0.00" 
                          className="pl-9"
                          data-testid="input-draft-budget"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Optional budget allocation for this content piece
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date - Optional */}
                <FormField
                  control={createDraftForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-draft-start-date"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Optional start date for content creation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date - Optional */}
                <FormField
                  control={createDraftForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-draft-end-date"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Optional target completion date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dialog Footer */}
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateDraftDialogOpen(false)
                    createDraftForm.reset()
                  }}
                  data-testid="button-cancel-draft"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: moduleColor }}
                  className="text-white"
                  data-testid="button-generate-draft"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Draft
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
