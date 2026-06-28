"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/config/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Sparkles, CheckCircle2, Upload, Download, 
  AlertCircle, Users, Target, Layers, Calendar, Tag,
  BookOpen, BarChart2, Link2, PlusCircle, Star, Save,
  Eye, Edit3, Send, Clock, ChevronDown, ChevronRight,
  Brain, Lightbulb, MessageSquare, PenLine, Check, X,
  ArrowLeft, Bold, Italic, Underline, List, ListOrdered,
  Heading1, Heading2, Link as LinkIcon, Image, Code, Plus,
  Table, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Strikethrough, Subscript, Superscript, Quote, Minus, MoreHorizontal,
  Heading3, ChevronLeft, AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter, AlignVerticalJustifyEnd
} from 'lucide-react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

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

  const defaultContent = `<h1>The Ultimate Guide to Enterprise ABM Frameworks</h1><p>Enterprise ABM is transforming B2B marketing. With the right framework, marketing teams can achieve predictable pipeline growth and measurable ROI.</p><h2>Why ABM Matters</h2><p>In today's competitive landscape, generic marketing approaches fall short. Account-Based Marketing (ABM) enables precise targeting and personalized engagement at scale.</p><h3>Key Benefits:</h3><ul><li>Higher ROI compared to traditional marketing</li><li>Better alignment between sales and marketing</li><li>Deeper relationships with high-value accounts</li><li>More efficient use of marketing resources</li></ul>`

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
    <div className="space-y-6 p-4 md:p-8 max-w-full overflow-x-hidden">
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
          >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                  Step 1 of 3
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Content Brief</h1>
              <p className="text-gray-600">Define your content requirements and strategic foundation</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-upload-brief">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your Own Brief
            </Button>
          </div>

          {/* Coaching Prompt */}
          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Define your content requirements by answering: What are we creating? (format, topic) Who is it for? (persona, stage) Why does it matter? (goal, CTA) How should it sound? (tone, keywords)</p>
                  <p><strong>Expected outcome:</strong> A comprehensive brief that bridges strategy and execution, providing clear direction for AI-assisted drafting and human refinement.</p>
                  <p><strong>Tip:</strong> Start with a simple working title—you can refine later. Auto-populate from Content Strategy or Keyword Research to save time and ensure alignment.</p>
                </div>
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
            <p className="text-gray-600">Ensure your content aligns with brand strategy, messaging, and keyword priorities</p>
          </div>

          {/* Coaching Prompt */}
          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Answer alignment prompts to validate your content's strategic fit with brand messaging, target persona, and buyer journey stage.</p>
                  <p><strong>Expected outcome:</strong> A fit score showing how well your content aligns with BrandCraft's framework, plus insights on detected gaps and improvement opportunities.</p>
                  <p><strong>Tip:</strong> Aim for 85%+ alignment. Your responses are saved and used to improve auto-matching for future content.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rotating Prompt */}
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-semibold">Prompt of the Moment:</p>
                <p className="text-sm text-muted-foreground">{prompts[promptIndex]}</p>
              </div>
            </CardContent>
          </Card>

          {/* Overall Fit Score */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-2" style={{ borderColor: moduleColor }}>
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
                  className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800 text-sm min-h-[100px]"
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
                  className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-sm min-h-[100px]"
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
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
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
          >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                Step 3 of 3
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Draft & Approvals</h1>
            <p className="text-gray-600">Create AI-assisted drafts, format content, and manage the approval workflow</p>
          </div>

          {/* Coaching Prompt */}
          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
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
              className={`flex-1 transition-all border-2 ${
                approvalStage === 'drafts-view' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300' 
                  : 'border-transparent'
              }`}
              onClick={() => setApprovalStage('drafts-view')}
              data-testid="button-stage-drafts"
            >
              Drafts
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 ${
                approvalStage === 'review' 
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300' 
                  : 'border-transparent'
              }`}
              onClick={() => setApprovalStage('review')}
              data-testid="button-stage-review"
            >
              Review
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className={`flex-1 transition-all border-2 ${
                approvalStage === 'approval' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300' 
                  : 'border-transparent'
              }`}
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

              <Button className="w-full" variant="outline" data-testid="button-create-draft">
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
                      <div className="flex flex-wrap gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-md border border-purple-200 dark:border-purple-800">
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
                      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md border">
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
                      className="w-full min-h-[500px] p-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background prose prose-sm max-w-none"
                      data-testid="editor-wysiwyg"
                      style={{ lineHeight: '1.6' }}
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
              <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="font-medium">Review in Progress</span>
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
                      <div className="flex flex-wrap gap-2 p-2 bg-pink-50 dark:bg-pink-950/20 rounded-md border border-pink-200 dark:border-pink-800">
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
                      <div className="flex flex-wrap gap-1 p-2 bg-pink-50 dark:bg-pink-950/20 rounded-md border border-pink-200 dark:border-pink-800">
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
                      className="w-full min-h-[500px] p-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-background prose prose-sm max-w-none"
                      data-testid="editor-review-wysiwyg"
                      style={{ lineHeight: '1.6' }}
                    />
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { toast({ title: "Changes saved", description: "Your edits have been saved" }) }} data-testid="button-save-review-edits">
                      <Save className="h-4 w-4 mr-1"/>Save Edits
                    </Button>
                    <Button size="sm" variant="outline" data-testid="button-add-review-comment">
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
                  <div className="border-l-2 border-pink-500 pl-3 py-2 bg-pink-50 dark:bg-pink-950/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <strong>Sarah Chen</strong> • 1 hour ago
                    </div>
                    <p className="text-sm">Strong opening! Consider adding a specific stat about ABM ROI in the first paragraph to hook readers immediately.</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3 py-2 bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <strong>You</strong> • 30 min ago
                    </div>
                    <p className="text-sm">Great suggestion! I'll add the Forrester stat about 208% ROI.</p>
                  </div>
                  <Textarea 
                    placeholder="Add your response to feedback..."
                    rows={3}
                    data-testid="textarea-add-feedback-response"
                  />
                  <Button size="sm" data-testid="button-post-comment">
                    <Send className="h-4 w-4 mr-1"/>Post Comment
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => setApprovalStage('approval')}
                  data-testid="button-send-for-approval"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1"/>
                  Send for Approval
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setApprovalStage('drafts-view')}
                  data-testid="button-back-to-drafts-from-review"
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
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium">Ready for Approval</span>
                    <span className="text-muted-foreground">— All reviewers have signed off</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" style={{ borderColor: moduleColor }}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send size={16} style={{ color: moduleColor }} />
                    Export & Publish
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" data-testid="button-export-docx">
                      <Download className="h-4 w-4 mr-2" />
                      Export .DOCX
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-export-pdf">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-export-html">
                      <Download className="h-4 w-4 mr-2" />
                      Export HTML
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-copy-markdown">
                      <Download className="h-4 w-4 mr-2" />
                      Copy Markdown
                    </Button>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold mb-2">Integrate with Other Modules</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" data-testid="button-send-flight-deck">
                        <Link2 className="h-4 w-4 mr-2" />
                        Add to Flight Deck Campaign
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-flag-eval">
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
    { id: 'alignment', label: 'Alignment', description: 'Strategic alignment check' },
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

  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto sticky top-16 z-10">
      <div className="flex gap-2 min-w-max">
        {contentCreationSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id as Step)}
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
        steps={contentCreationSteps}
        currentStep={currentStep}
        onStepChange={(stepId) => setCurrentStep(stepId as Step)}
        content={mainContent}
        moduleColor={moduleColor}
        featureName="Content Creation"
      />
    </>
  )
}

