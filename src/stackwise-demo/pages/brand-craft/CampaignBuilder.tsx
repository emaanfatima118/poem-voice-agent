import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/stackwise-demo/components/ui/select'
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/stackwise-demo/config/modules'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { 
  Lightbulb, Sparkles, Search, ChevronRight, Upload, 
  Link as LinkIcon, Image as ImageIcon, Palette, Download, Plus, FileText,
  Target, Share2, CheckCircle2, Send, DollarSign, CalendarIcon, ChevronDown,
  Trash2, X, FolderOpen
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/stackwise-demo/hooks/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/stackwise-demo/components/ui/popover'
import { Calendar } from '@/stackwise-demo/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/stackwise-demo/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/stackwise-demo/components/ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/stackwise-demo/components/ui/dialog'

type Step = 'brief' | 'content-creative'

interface CampaignFormData {
  name: string
  goal: string
  primaryPersona: string
  targetSegment: string
  keyProblem: string
  coreOffer: string
  heroMessage: string
  primaryCta: string
  startDate: string
  endDate: string
  successMetrics: string
  estimatedBudget: string
  estimatedHours: string
  channels: string
  secondaryPersonas: string
  campaignPillar: string
  supportingEvidence: string
  competitiveContext: string
  usp: string
  keyRisks: string
  stakeholders: string
  integrationNeeds: string
  initialAssets: string
}

interface Asset {
  id: string
  name: string
  type: string
  persona: string
  stage: string
}

interface CreativeAsset {
  id: string
  channel: string
  creativeType: string
  format: string
  size: string
  headline: string
  bodyContent: string
  ctaLink: string
  assetLink: string
}

interface ContentPiece {
  id: string
  name: string
  type: string
  description: string
  attachedCreative: string[]
  selected: boolean
  selectedContentFromCreation: string[] // IDs of content pieces from Content Creation
}

interface SavedContentFromCreation {
  id: string
  title: string
  contentType: string
  persona: string
  pillar: string
  status: 'draft' | 'approved' | 'published'
}

interface CreativeLibraryItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  thumbnail: string
}

export default function CampaignBuilder() {
  const module = getModuleById('brand-craft')
  const feature = module?.features?.find(f => f.id === 'campaign-builder')
  const moduleColor = '#c009ba'
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState<Step>('brief')
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    goal: '',
    primaryPersona: '',
    targetSegment: '',
    keyProblem: '',
    coreOffer: '',
    heroMessage: '',
    primaryCta: '',
    startDate: '',
    endDate: '',
    successMetrics: '',
    estimatedBudget: '',
    estimatedHours: '',
    channels: '',
    secondaryPersonas: '',
    campaignPillar: '',
    supportingEvidence: '',
    competitiveContext: '',
    usp: '',
    keyRisks: '',
    stakeholders: '',
    integrationNeeds: '',
    initialAssets: ''
  })

  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [showAssetSearch, setShowAssetSearch] = useState(false)
  const [assetFilters, setAssetFilters] = useState({
    contentType: '',
    channel: '',
    persona: '',
    stage: '',
    goal: ''
  })

  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>([])
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [showStockBrowser, setShowStockBrowser] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File[]}>({})

  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([])
  
  // Mock saved content from Content Creation feature
  const [savedContentFromCreation] = useState<SavedContentFromCreation[]>([
    { id: 'cc-1', title: 'Welcome Email - New Users', contentType: 'Email', persona: 'New Customer', pillar: 'Onboarding', status: 'approved' },
    { id: 'cc-2', title: 'Feature Announcement Email', contentType: 'Email', persona: 'Existing Customer', pillar: 'Product Updates', status: 'draft' },
    { id: 'cc-3', title: 'Quarterly Newsletter', contentType: 'Newsletter', persona: 'All Customers', pillar: 'Engagement', status: 'approved' },
    { id: 'cc-4', title: 'Product Demo Video', contentType: 'Video', persona: 'Prospect', pillar: 'Education', status: 'approved' },
    { id: 'cc-5', title: 'AI Marketing Trends Post', contentType: 'Social Post', persona: 'Marketing Leader', pillar: 'Thought Leadership', status: 'approved' },
    { id: 'cc-6', title: 'Case Study: Enterprise Success', contentType: 'Case Study', persona: 'Enterprise Buyer', pillar: 'Social Proof', status: 'published' },
    { id: 'cc-7', title: 'Best Practices Guide', contentType: 'Article / Thought Leadership', persona: 'Marketing Manager', pillar: 'Education', status: 'published' },
    { id: 'cc-8', title: 'Q4 Strategy Webinar', contentType: 'Webinar', persona: 'CMO', pillar: 'Thought Leadership', status: 'draft' },
    { id: 'cc-9', title: 'ROI Calculator Whitepaper', contentType: 'Whitepaper', persona: 'CFO', pillar: 'Business Value', status: 'approved' },
    { id: 'cc-10', title: 'Customer Success Story', contentType: 'Customer Story / Testimonial', persona: 'Buyer', pillar: 'Trust', status: 'published' },
    { id: 'cc-11', title: 'Product Launch Landing Page', contentType: 'Landing Page', persona: 'Prospect', pillar: 'Conversion', status: 'draft' },
    { id: 'cc-12', title: 'Marketing Analytics eBook', contentType: 'E-Book', persona: 'Data-Driven Marketer', pillar: 'Education', status: 'approved' }
  ])
  const [creativeLibrary, setCreativeLibrary] = useState<CreativeLibraryItem[]>([
    { id: 'c1', name: 'Hero Banner - Purple Gradient', url: '/images/hero-banner.png', type: 'image', thumbnail: '/images/hero-banner-thumb.png' },
    { id: 'c2', name: 'Product Screenshot', url: '/images/product.png', type: 'image', thumbnail: '/images/product-thumb.png' },
    { id: 'c3', name: 'Brand Video 30s', url: '/videos/brand.mp4', type: 'video', thumbnail: '/videos/brand-thumb.png' },
    { id: 'c4', name: 'Infographic - Stats', url: '/images/infographic.png', type: 'image', thumbnail: '/images/infographic-thumb.png' },
    { id: 'c5', name: 'Logo Variations', url: '/docs/logo-pack.pdf', type: 'document', thumbnail: '/docs/logo-thumb.png' }
  ])
  const [showCreativeLibraryDialog, setShowCreativeLibraryDialog] = useState(false)
  const [openContentPieces, setOpenContentPieces] = useState<{[key: string]: boolean}>({
    '1': true,
    '2': false
  })

  const handleFileUpload = (channelId: string, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setUploadedFiles(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), ...fileArray]
    }))
    toast({
      title: "Files uploaded",
      description: `${fileArray.length} file(s) uploaded successfully`,
    })
  }

  const dummyAssets: Asset[] = [
    { id: '1', name: 'ABM Nurture Email Series', type: 'Email', persona: 'Marketing Director', stage: 'Consideration' },
    { id: '2', name: 'LinkedIn Ad Creative – Awareness', type: 'Ad', persona: 'CMO', stage: 'Awareness' },
    { id: '3', name: 'Ebook · Building Your ABM Playbook', type: 'Download', persona: 'Sales Leader', stage: 'Conversion' },
    { id: '4', name: 'Case Study: Enterprise Tech Success', type: 'PDF', persona: 'IT Director', stage: 'Decision' },
    { id: '5', name: 'Webinar: Human + AI GTM Strategy', type: 'Video', persona: 'Founder', stage: 'Awareness' },
    { id: '6', name: 'Landing Page: PulseHub ROI Calculator', type: 'Landing Page', persona: 'Marketing Ops', stage: 'Conversion' }
  ]

  const steps = [
    { id: 'brief' as Step, label: 'Campaign Brief', number: 1 },
    { id: 'content-creative' as Step, label: 'Content and Creative', number: 2 }
  ]

  // Channel and Content Type options
  const channelOptions = [
    'Email',
    'LinkedIn',
    'Facebook',
    'Instagram',
    'X (Twitter)',
    'YouTube',
    'TikTok',
    'Pinterest',
    'Google Ads',
    'Display Network',
    'Programmatic Display',
    'Direct Mail',
    'SMS/Text',
    'Webinars',
    'Podcasts',
    'Events (In-person / Virtual)',
    'Trade Shows',
    'Press Releases',
    'Blogs',
    'Website',
    'SEO / Organic Search',
    'Paid Search (PPC)'
  ]

  const contentTypeOptions = [
    'Article / Thought Leadership',
    'Whitepaper',
    'Case Study',
    'E-Book',
    'Infographic',
    'One-Pager / Sell Sheet',
    'Presentation / Slide Deck',
    'Video',
    'Webinar',
    'Podcast',
    'Social Post',
    'Email',
    'Newsletter',
    'Press Release',
    'Landing Page',
    'Website Page',
    'Product Page',
    'Guide / Checklist',
    'Template / Toolkit',
    'Report / Benchmark Study',
    'Ad / Creative Asset',
    'Event Material (Booth, Flyer, Handout)',
    'Customer Story / Testimonial',
    'Internal Enablement Asset (Battlecard, Script, Training Deck)',
    'Interactive Content (Quiz, Calculator, Poll)',
    'Microsite / Campaign Hub'
  ]


  const toggleAsset = (id: string) => {
    setSelectedAssets(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const updateFormField = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addContentPiece = () => {
    const newId = `cp-${Date.now()}`
    const newPiece: ContentPiece = {
      id: newId,
      name: '',
      type: '',
      description: '',
      attachedCreative: [],
      selected: true,
      selectedContentFromCreation: []
    }
    setContentPieces(prev => [...prev, newPiece])
    setOpenContentPieces(prev => ({ ...prev, [newId]: true }))
  }

  const toggleContentPieceSelection = (id: string) => {
    setContentPieces(prev => prev.map(cp => 
      cp.id === id ? { ...cp, selected: !cp.selected } : cp
    ))
  }

  const toggleContentFromCreation = (contentPieceId: string, savedContentId: string) => {
    setContentPieces(prev => prev.map(cp => {
      if (cp.id === contentPieceId) {
        const isSelected = cp.selectedContentFromCreation.includes(savedContentId)
        return {
          ...cp,
          selectedContentFromCreation: isSelected
            ? cp.selectedContentFromCreation.filter(id => id !== savedContentId)
            : [...cp.selectedContentFromCreation, savedContentId]
        }
      }
      return cp
    }))
  }

  const updateContentPiece = (id: string, field: keyof ContentPiece, value: string | string[]) => {
    setContentPieces(prev => prev.map(cp => cp.id === id ? { ...cp, [field]: value } : cp))
  }

  const deleteContentPiece = (id: string) => {
    setContentPieces(prev => prev.filter(cp => cp.id !== id))
    setOpenContentPieces(prev => {
      const newOpen = { ...prev }
      delete newOpen[id]
      return newOpen
    })
  }

  const attachCreativeToContent = (contentId: string, creativeId: string) => {
    setContentPieces(prev => prev.map(cp => 
      cp.id === contentId 
        ? { ...cp, attachedCreative: [...cp.attachedCreative, creativeId] }
        : cp
    ))
  }

  const removeCreativeFromContent = (contentId: string, creativeId: string) => {
    setContentPieces(prev => prev.map(cp =>
      cp.id === contentId
        ? { ...cp, attachedCreative: cp.attachedCreative.filter(id => id !== creativeId) }
        : cp
    ))
  }

  const handleCreativeUpload = (contentId: string, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    
    fileArray.forEach(file => {
      const newCreativeId = `c-upload-${Date.now()}-${Math.random()}`
      const newCreative: CreativeLibraryItem = {
        id: newCreativeId,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        thumbnail: URL.createObjectURL(file)
      }
      
      setCreativeLibrary(prev => [...prev, newCreative])
      attachCreativeToContent(contentId, newCreativeId)
    })
    
    toast({
      title: "Creative uploaded",
      description: `${fileArray.length} file(s) uploaded and attached successfully`,
    })
  }

  const toggleContentPieceOpen = (id: string) => {
    setOpenContentPieces(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handlePushToFlightDeck = () => {
    const hasContent = contentPieces.some(p => p.selected && (p.selectedContentFromCreation.length > 0 || p.attachedCreative.length > 0))
    
    if (!hasContent) {
      toast({
        title: "No Content Selected",
        description: "Please select or attach content before pushing to Flight Deck.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Campaign Pushed to Flight Deck!",
      description: "Your campaign has been successfully sent to Flight Deck for scheduling and distribution.",
    })
  }


  const content = (
    <div className="h-full overflow-y-auto bg-background brandcraft-input-focus">
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
      <div className="sticky top-0 z-10 bg-background border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: moduleColor }}>
              Campaign Builder
            </h1>
            <p className="text-sm text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.label}
              {currentStep === 'content-creative' && formData.name && (
                <span className="font-medium text-foreground"> • {formData.name}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {currentStep === 'brief' && (
              <Button variant="outline" size="sm" data-testid="button-upload-brief">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your Own Brief
              </Button>
            )}
            <Badge variant="outline" className="whitespace-nowrap" style={{ borderColor: moduleColor, color: moduleColor }}>
              Step {steps.find(s => s.id === currentStep)?.number} of {steps.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {currentStep === 'brief' && (
            <motion.div
              key="brief"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Coaching Prompt */}
              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <strong className="font-semibold">Coaching Prompts:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>What behavior do you want your target to take — click, signup, buy, refer?</li>
                        <li>Would someone on your sales team instantly recognize this campaign's purpose?</li>
                        <li>Is the offer clear enough to the target — or too vague?</li>
                        <li>Which channel will carry your core message, and is that aligned to the persona's context?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Essential Fields */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Essential Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input
                      placeholder="Enter campaign name manually"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      data-testid="input-campaign-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Goal</label>
                    <Select value={formData.goal} onValueChange={(val) => updateFormField('goal', val)}>
                      <SelectTrigger data-testid="select-campaign-goal">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awareness">Awareness</SelectItem>
                        <SelectItem value="consideration">Consideration</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Persona</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-persona">
                        Pull from Messaging House
                      </Button>
                    </div>
                    <Input
                      placeholder="Manual input"
                      value={formData.primaryPersona}
                      onChange={(e) => updateFormField('primaryPersona', e.target.value)}
                      data-testid="input-primary-persona"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Segment</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-icp">
                        Pull from ICP Library
                      </Button>
                    </div>
                    <Input
                      placeholder="Company size, industry, geography"
                      value={formData.targetSegment}
                      onChange={(e) => updateFormField('targetSegment', e.target.value)}
                      data-testid="input-target-segment"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Key Problem or Insight</label>
                    <Textarea
                      rows={2}
                      placeholder="Describe the core challenge your campaign addresses"
                      value={formData.keyProblem}
                      onChange={(e) => updateFormField('keyProblem', e.target.value)}
                      data-testid="textarea-key-problem"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Core Offer or Value Exchange</label>
                    <Textarea
                      rows={2}
                      placeholder="What are you offering and why it matters"
                      value={formData.coreOffer}
                      onChange={(e) => updateFormField('coreOffer', e.target.value)}
                      data-testid="textarea-core-offer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hero Message</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-hero-message">
                        Pull from Messaging House
                      </Button>
                    </div>
                    <Input
                      placeholder="Enter or edit tagline"
                      value={formData.heroMessage}
                      onChange={(e) => updateFormField('heroMessage', e.target.value)}
                      data-testid="input-hero-message"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary CTA</label>
                    <Input
                      placeholder="Action you want them to take"
                      value={formData.primaryCta}
                      onChange={(e) => updateFormField('primaryCta', e.target.value)}
                      data-testid="input-primary-cta"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Success Metrics</label>
                    <Input
                      placeholder="Pipeline $, Engagement, Conversions (auto-sync from PulseHub)"
                      value={formData.successMetrics}
                      onChange={(e) => updateFormField('successMetrics', e.target.value)}
                      data-testid="input-success-metrics"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Budget <span className="text-muted-foreground text-xs">(Optional)</span></label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter estimated spend (syncs with PulseHub)"
                        value={formData.estimatedBudget}
                        onChange={(e) => updateFormField('estimatedBudget', e.target.value)}
                        data-testid="input-estimated-budget"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Campaign Dates <span className="text-muted-foreground text-xs">(Optional)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.startDate && "text-muted-foreground"
                              )}
                              data-testid="button-start-date"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.startDate ? format(new Date(formData.startDate), "PPP") : <span>Start Date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.startDate ? new Date(formData.startDate) : undefined}
                              onSelect={(date) => updateFormField('startDate', date ? date.toISOString().split('T')[0] : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.endDate && "text-muted-foreground"
                              )}
                              data-testid="button-end-date"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.endDate ? format(new Date(formData.endDate), "PPP") : <span>End Date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.endDate ? new Date(formData.endDate) : undefined}
                              onSelect={(date) => updateFormField('endDate', date ? date.toISOString().split('T')[0] : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Hours</label>
                    <Input
                      placeholder="Enter estimated hours (syncs with PulseHub)"
                      value={formData.estimatedHours}
                      onChange={(e) => updateFormField('estimatedHours', e.target.value)}
                      data-testid="input-estimated-hours"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Optional Fields */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Details (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary Personas</label>
                    <Input
                      placeholder="Optional"
                      value={formData.secondaryPersonas}
                      onChange={(e) => updateFormField('secondaryPersonas', e.target.value)}
                      data-testid="input-secondary-personas"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Pillar</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-pillar">
                        Pull from Pillars
                      </Button>
                    </div>
                    <Input
                      placeholder="Enter or confirm sub-topic"
                      value={formData.campaignPillar}
                      onChange={(e) => updateFormField('campaignPillar', e.target.value)}
                      data-testid="input-campaign-pillar"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Supporting Evidence</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-evidence">
                        Pull from Messaging House
                      </Button>
                    </div>
                    <Textarea
                      rows={2}
                      placeholder="Stats, proof points, or insights"
                      value={formData.supportingEvidence}
                      onChange={(e) => updateFormField('supportingEvidence', e.target.value)}
                      data-testid="textarea-supporting-evidence"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Competitive Context</label>
                    <Textarea
                      rows={2}
                      placeholder="Market or timing factors"
                      value={formData.competitiveContext}
                      onChange={(e) => updateFormField('competitiveContext', e.target.value)}
                      data-testid="textarea-competitive-context"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">USP or Differentiator</label>
                    <Input
                      placeholder="What makes this unique"
                      value={formData.usp}
                      onChange={(e) => updateFormField('usp', e.target.value)}
                      data-testid="input-usp"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Key Risks or Assumptions</label>
                    <Textarea
                      rows={2}
                      placeholder="What could impact success?"
                      value={formData.keyRisks}
                      onChange={(e) => updateFormField('keyRisks', e.target.value)}
                      data-testid="textarea-key-risks"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stakeholders & Roles</label>
                    <Input
                      placeholder="Sales, Creative, Ops"
                      value={formData.stakeholders}
                      onChange={(e) => updateFormField('stakeholders', e.target.value)}
                      data-testid="input-stakeholders"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Integration Needs</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-integrations">
                        Pull from Integrations
                      </Button>
                    </div>
                    <Input
                      placeholder="HubSpot, Salesforce, etc."
                      value={formData.integrationNeeds}
                      onChange={(e) => updateFormField('integrationNeeds', e.target.value)}
                      data-testid="input-integration-needs"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Initial Asset Inventory</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-pull-assets">
                        Pull from Projects
                      </Button>
                    </div>
                    <Textarea
                      rows={3}
                      placeholder="List or describe existing assets (auto-pull from Projects)"
                      value={formData.initialAssets}
                      onChange={(e) => updateFormField('initialAssets', e.target.value)}
                      data-testid="textarea-initial-assets"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" data-testid="button-save-draft">
                  Save Draft
                </Button>
                <Button
                  onClick={() => setCurrentStep('content-creative')}
                  data-testid="button-proceed-content-creative"
                  style={{ backgroundColor: moduleColor }}
                  className="text-white"
                >
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'content-creative' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Campaign Name - Editable */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaign Name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Enter campaign name"
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                    className="text-lg font-semibold"
                    data-testid="input-campaign-name-content-step"
                  />
                </CardContent>
              </Card>

              {/* Coaching Prompt */}
              <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <strong className="font-semibold">Coaching Prompts:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>What content pieces do you need for this campaign?</li>
                        <li>Which creative assets (images, graphics, thumbnails) support each piece?</li>
                        <li>Are you reusing existing creative or creating new assets?</li>
                        <li>Does each piece align with your campaign goal and persona?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Pieces Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Content Pieces</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      For each channel, select content pieces from Content Creation and attach creative assets
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" style={{ borderColor: moduleColor, color: moduleColor }}>
                      {contentPieces.filter(p => p.selected).length} of {contentPieces.length} selected
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showCreativeLibraryDialog} onOpenChange={setShowCreativeLibraryDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" data-testid="button-browse-creative-library">
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Browse Creative Library
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Creative Library</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {creativeLibrary.map(creative => (
                          <Card key={creative.id} className="hover-elevate">
                            <CardContent className="p-3">
                              <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                                {creative.type === 'image' ? (
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                ) : creative.type === 'video' ? (
                                  <span className="text-xs">Video</span>
                                ) : (
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <p className="text-xs font-medium truncate">{creative.name}</p>
                              <Badge variant="outline" className="text-xs mt-1">{creative.type}</Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    onClick={addContentPiece}
                    style={{ backgroundColor: moduleColor, borderColor: moduleColor }}
                    className="text-white !bg-[#c009ba] !border-[#c009ba]"
                    data-testid="button-add-content-piece"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content Piece
                  </Button>
                </div>
              </div>

              {/* Content Piece Cards */}
              <div className="space-y-3">
                {contentPieces.map((piece, idx) => (
                  <Collapsible
                    key={piece.id}
                    open={openContentPieces[piece.id]}
                    onOpenChange={() => toggleContentPieceOpen(piece.id)}
                  >
                    <Card 
                      data-testid={`card-content-piece-${idx}`}
                      className={cn(
                        "transition-all !border-[#c009ba]",
                        piece.selected && "ring-2"
                      )}
                      style={{ borderColor: moduleColor }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                data-testid={`button-toggle-content-${idx}`}
                              >
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform",
                                    openContentPieces[piece.id] ? "rotate-0" : "-rotate-90"
                                  )}
                                />
                              </Button>
                            </CollapsibleTrigger>
                            <div className="flex-1 min-w-0">
                              <Input
                                placeholder="Content name (e.g., Email Campaign Series)"
                                value={piece.name}
                                onChange={(e) => updateContentPiece(piece.id, 'name', e.target.value)}
                                className="font-medium"
                                data-testid={`input-content-name-${idx}`}
                              />
                            </div>
                            <Badge variant="outline" data-testid={`badge-content-type-${idx}`}>
                              {piece.type || 'No type'}
                            </Badge>
                            {piece.selectedContentFromCreation.length > 0 && (
                              <Badge variant="secondary" data-testid={`badge-content-count-${idx}`}>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {piece.selectedContentFromCreation.length} content
                              </Badge>
                            )}
                            <Badge variant="secondary" data-testid={`badge-creative-count-${idx}`}>
                              {piece.attachedCreative.length} creative
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteContentPiece(piece.id)}
                            className="h-8 w-8 text-destructive"
                            data-testid={`button-delete-content-${idx}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CollapsibleContent>
                        <CardContent className="space-y-4 pt-0">
                          {/* Content Metadata */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Content Type</label>
                              <Select
                                value={piece.type}
                                onValueChange={(val) => updateContentPiece(piece.id, 'type', val)}
                              >
                                <SelectTrigger data-testid={`select-content-type-${idx}`}>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {contentTypeOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Input
                                placeholder="Brief description"
                                value={piece.description}
                                onChange={(e) => updateContentPiece(piece.id, 'description', e.target.value)}
                                data-testid={`input-content-description-${idx}`}
                              />
                            </div>
                          </div>

                          {/* Select Content Section 
                              
                              DEVELOPER NOTE - MODULAR CONSIDERATION:
                              - If user doesn't have BrandCraft content library, replace this section with:
                                * "Upload Content" button
                                * "Upload Creative Assets" button
                              - Check: !user.modules.includes('brandcraft') || user.contentLibrary.length === 0
                              - Allow users to build campaigns even without BrandCraft content
                          */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Select Content from Library</label>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" data-testid={`button-select-content-${idx}`}>
                                  <Search className="h-4 w-4 mr-2" />
                                  Select Content from Library
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Select Content from Content Creation</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 mt-4">
                                  {piece.selectedContentFromCreation.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <CheckCircle2 className="h-4 w-4" style={{ color: moduleColor }} />
                                      <span>{piece.selectedContentFromCreation.length} content piece{piece.selectedContentFromCreation.length !== 1 ? 's' : ''} selected</span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-3">
                                    {savedContentFromCreation
                                      .filter(content => !piece.type || content.contentType === piece.type)
                                      .map(content => {
                                        const isSelected = piece.selectedContentFromCreation.includes(content.id)
                                        return (
                                          <Card
                                            key={content.id}
                                            className={cn(
                                              "cursor-pointer transition-all hover-elevate !border-[#c009ba]",
                                              isSelected && "ring-2"
                                            )}
                                            style={{ borderColor: moduleColor, backgroundColor: isSelected ? `${moduleColor}05` : 'transparent' }}
                                            onClick={() => toggleContentFromCreation(piece.id, content.id)}
                                            data-testid={`card-content-${content.id}`}
                                          >
                                            <CardContent className="p-3">
                                              <div className="flex items-start gap-2">
                                                <Checkbox
                                                  checked={isSelected}
                                                  onCheckedChange={() => toggleContentFromCreation(piece.id, content.id)}
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="mt-1"
                                                />
                                                <div className="flex-1 min-w-0 space-y-2">
                                                  <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium line-clamp-2">{content.title}</p>
                                                    {isSelected && (
                                                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: moduleColor }} />
                                                    )}
                                                  </div>
                                                  <div className="flex flex-wrap gap-1">
                                                    <Badge variant="outline" className="text-xs">{content.persona}</Badge>
                                                    <Badge variant="outline" className="text-xs">{content.pillar}</Badge>
                                                    <Badge 
                                                      variant={content.status === 'published' ? 'default' : content.status === 'approved' ? 'secondary' : 'outline'}
                                                      className="text-xs"
                                                    >
                                                      {content.status}
                                                    </Badge>
                                                  </div>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        )
                                      })}
                                  </div>
                                  {savedContentFromCreation.filter(content => !piece.type || content.contentType === piece.type).length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                      <p>No content found for {piece.type || 'this channel'}</p>
                                      <p className="text-sm mt-1">Create content in Content Creation first</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Display Selected Content */}
                            {piece.selectedContentFromCreation.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <label className="text-sm font-medium">Selected Content ({piece.selectedContentFromCreation.length})</label>
                                  <span className="text-xs text-muted-foreground">- You can rename these titles for the campaign</span>
                                </div>
                                <div className="space-y-2">
                                  {piece.selectedContentFromCreation.map((contentId, contentIdx) => {
                                    const content = savedContentFromCreation.find(c => c.id === contentId)
                                    if (!content) return null
                                    return (
                                      <div
                                        key={contentId}
                                        className="flex items-center gap-2 p-2 border rounded-md !border-[#c009ba]"
                                        style={{ borderColor: moduleColor }}
                                        data-testid={`selected-content-${contentId}`}
                                      >
                                        <div className="flex-1 min-w-0">
                                          <Input
                                            placeholder={`E.g., CA_Email${contentIdx + 1}`}
                                            defaultValue={content.title}
                                            className="text-sm"
                                            data-testid={`input-rename-content-${contentId}`}
                                          />
                                        </div>
                                        <div className="flex gap-1">
                                          <Badge variant="outline" className="text-xs">{content.persona}</Badge>
                                          <Badge variant="outline" className="text-xs">{content.pillar}</Badge>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 flex-shrink-0"
                                          onClick={() => toggleContentFromCreation(piece.id, contentId)}
                                          data-testid={`button-remove-content-${contentId}`}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Attach Creative Section */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Attach Creative</label>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.multiple = true
                                  input.accept = 'image/*,video/*,.pdf,.doc,.docx'
                                  input.onchange = (e) => {
                                    const target = e.target as HTMLInputElement
                                    handleCreativeUpload(piece.id, target.files)
                                  }
                                  input.click()
                                }}
                                data-testid={`button-upload-creative-${idx}`}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload New
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" data-testid={`button-select-from-library-${idx}`}>
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Select from Library
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Select Creative from Library</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-3 gap-3 mt-4">
                                    {creativeLibrary.map(creative => (
                                      <Card
                                        key={creative.id}
                                        className={cn(
                                          "cursor-pointer transition-all hover-elevate !border-[#c009ba]",
                                          piece.attachedCreative.includes(creative.id) && "ring-2"
                                        )}
                                        style={{ borderColor: moduleColor }}
                                        onClick={() => {
                                          if (piece.attachedCreative.includes(creative.id)) {
                                            removeCreativeFromContent(piece.id, creative.id)
                                          } else {
                                            attachCreativeToContent(piece.id, creative.id)
                                          }
                                        }}
                                        data-testid={`card-library-creative-${creative.id}`}
                                      >
                                        <CardContent className="p-3">
                                          <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                                            {creative.type === 'image' ? (
                                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            ) : creative.type === 'video' ? (
                                              <span className="text-xs">Video</span>
                                            ) : (
                                              <FileText className="h-8 w-8 text-muted-foreground" />
                                            )}
                                          </div>
                                          <p className="text-xs font-medium truncate">{creative.name}</p>
                                          <div className="flex items-center justify-between mt-1">
                                            <Badge variant="outline" className="text-xs">{creative.type}</Badge>
                                            {piece.attachedCreative.includes(creative.id) && (
                                              <CheckCircle2 className="h-4 w-4" style={{ color: moduleColor }} />
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          {/* Attached Creative Thumbnails */}
                          {piece.attachedCreative.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Attached Creative ({piece.attachedCreative.length})</label>
                              <div className="grid grid-cols-4 gap-2">
                                {piece.attachedCreative.map(creativeId => {
                                  const creative = creativeLibrary.find(c => c.id === creativeId)
                                  if (!creative) return null
                                  return (
                                    <div
                                      key={creativeId}
                                      className="relative group"
                                      data-testid={`thumbnail-creative-${creativeId}`}
                                    >
                                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                                        {creative.type === 'image' ? (
                                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                        ) : creative.type === 'video' ? (
                                          <span className="text-xs">Video</span>
                                        ) : (
                                          <FileText className="h-6 w-6 text-muted-foreground" />
                                        )}
                                      </div>
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeCreativeFromContent(piece.id, creativeId)}
                                        data-testid={`button-remove-creative-${creativeId}`}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                      <p className="text-xs truncate mt-1">{creative.name}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>

              {contentPieces.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-2">No content pieces yet</p>
                    <p className="text-sm">Click "Add Content Piece" to get started</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('brief')}
                  data-testid="button-back-to-brief"
                >
                  Back to Brief
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" data-testid="button-save-content-creative">
                    Save Progress
                  </Button>
                  
                  {/* DEVELOPER NOTE - MODULAR CONSIDERATION:
                      - If user doesn't have Flight Deck module:
                        * Change button to "Upgrade to Enable Distribution"
                        * onClick -> show upgrade modal/dialog
                        * Check: !user.modules.includes('flightdeck')
                      - Without Flight Deck, user must export and distribute manually
                  */}
                  <Button
                    onClick={handlePushToFlightDeck}
                    data-testid="button-push-to-flight-deck"
                    style={{ backgroundColor: moduleColor, borderColor: moduleColor }}
                    className="text-white !bg-[#c009ba] !border-[#c009ba]"
                  >
                    <Send className="mr-2 w-4 h-4" />
                    Push to Flight Deck
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  const campaignSteps = [
    { id: 'brief', label: 'Campaign Brief', description: 'Define campaign objectives' },
    { id: 'content-creative', label: 'Content & Creative', description: 'Create content and creative assets' }
  ]

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={campaignSteps}
      currentStep={currentStep}
      onStepChange={(stepId) => setCurrentStep(stepId as Step)}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
            <QuickActions module="BrandCraft" />
          </div>
          {content}
        </div>
      }
      moduleColor={moduleColor}
      featureName="Campaign Builder"
    />
  )
}
