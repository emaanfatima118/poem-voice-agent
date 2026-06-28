"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout'
import { getModuleById } from '@/config/modules'
import { QuickActions } from '@/components/QuickActions'
import { 
  Lightbulb, Sparkles, Search, ChevronRight, Upload, 
  Link as LinkIcon, Image as ImageIcon, Palette, Download, Plus, FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

type Step = 'brief' | 'assets' | 'channel-placement' | 'creative'

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

interface ChannelPlacement {
  id: string
  contentName: string
  contentType: string
  channel: string
  assetCount: number
  spend: string
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

  const [channelPlacements, setChannelPlacements] = useState<ChannelPlacement[]>([
    { id: '1', contentName: '', contentType: '', channel: '', assetCount: 0, spend: '' },
    { id: '2', contentName: '', contentType: '', channel: '', assetCount: 0, spend: '' }
  ])

  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>([])
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [showStockBrowser, setShowStockBrowser] = useState(false)

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
    { id: 'assets' as Step, label: 'Assets', number: 2 },
    { id: 'channel-placement' as Step, label: 'Channel Placement', number: 3 },
    { id: 'creative' as Step, label: 'Creative', number: 4 }
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

  // Auto-populate content name, content type, and asset count from selected assets
  useEffect(() => {
    if (currentStep === 'channel-placement' && selectedAssets.length > 0) {
      const assetCount = selectedAssets.length
      const firstAsset = dummyAssets.find(a => a.id === selectedAssets[0])
      
      // Update first channel placement with data from selected assets
      if (channelPlacements.length > 0 && channelPlacements[0].contentName === '') {
        setChannelPlacements(prev => prev.map((ch, idx) => 
          idx === 0 ? { 
            ...ch, 
            contentName: firstAsset?.name || '',
            contentType: firstAsset?.type || '',
            assetCount 
          } : ch
        ))
      }
    }
  }, [currentStep, selectedAssets.length])

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const updateFormField = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addChannelPlacement = () => {
    const newId = (channelPlacements.length + 1).toString()
    setChannelPlacements(prev => [...prev, { id: newId, contentName: '', contentType: '', channel: '', assetCount: 0, spend: '' }])
  }

  const updateChannelPlacement = (id: string, field: keyof ChannelPlacement, value: string | number) => {
    setChannelPlacements(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeChannelPlacement = (id: string) => {
    setChannelPlacements(prev => prev.filter(c => c.id !== id))
  }

  const proceedToCreative = () => {
    const validPlacements = channelPlacements.filter(c => c.channel.trim())
    
    if (validPlacements.length === 0) {
      toast({
        title: "No Channel Placements",
        description: "Please add at least one channel placement before proceeding. Going back to Assets step.",
        variant: "destructive"
      })
      setTimeout(() => setCurrentStep('assets'), 1500)
      return
    }
    
    setCurrentStep('creative')
  }

  const getAllSelectedChannels = () => {
    return channelPlacements.filter(c => c.channel.trim())
  }

  const leftNav = (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-lg font-bold mb-1" style={{ color: moduleColor }}>
        {module?.label}
      </h2>
      <p className="text-xs text-muted-foreground mb-4">{feature?.label}</p>
    </div>
  )

  const content = (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="sticky top-0 z-10 bg-gray-50 border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: moduleColor }}>
              Campaign Builder
            </h1>
            <p className="text-sm text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.label}
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
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
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
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormField('startDate', e.target.value)}
                        data-testid="input-start-date"
                      />
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateFormField('endDate', e.target.value)}
                        data-testid="input-end-date"
                      />
                    </div>
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
                    <label className="text-sm font-medium">Estimated Budget</label>
                    <Input
                      placeholder="Enter estimated spend ($) (syncs with PulseHub)"
                      value={formData.estimatedBudget}
                      onChange={(e) => updateFormField('estimatedBudget', e.target.value)}
                      data-testid="input-estimated-budget"
                    />
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Channels</label>
                    <Input
                      placeholder="Owned, Paid, Earned, Shared (syncs with Flight Deck)"
                      value={formData.channels}
                      onChange={(e) => updateFormField('channels', e.target.value)}
                      data-testid="input-channels"
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
                  onClick={() => setCurrentStep('assets')}
                  data-testid="button-proceed-assets"
                  style={{ backgroundColor: moduleColor }}
                  className="text-white"
                >
                  Proceed to Assets <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Coaching Prompt */}
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <strong className="font-semibold">Coaching Prompts:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Which existing assets could you reuse or repurpose?</li>
                        <li>Does each align with your persona and pillar?</li>
                        <li>Would this asset move the needle — or just fill a gap?</li>
                        <li>Are visuals, copy, and tone still current?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Assets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Suggested Assets (from Projects + BrandCraft)</CardTitle>
                  <Button variant="outline" size="sm" data-testid="button-pull-from-projects">
                    Pull from Projects
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {dummyAssets.map(asset => (
                      <motion.div
                        key={asset.id}
                        whileHover={{ scale: 1.02 }}
                        className={`border rounded-md p-3 cursor-pointer transition-all ${
                          selectedAssets.includes(asset.id)
                            ? 'bg-white shadow-sm'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        style={selectedAssets.includes(asset.id) ? { borderColor: moduleColor } : {}}
                        onClick={() => toggleAsset(asset.id)}
                        data-testid={`card-asset-${asset.id}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{asset.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {asset.type} · {asset.persona} · {asset.stage}
                            </p>
                          </div>
                          <Checkbox
                            checked={selectedAssets.includes(asset.id)}
                            data-testid={`checkbox-asset-${asset.id}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add New Asset / Find Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Asset / Find Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content Type</label>
                      <Select
                        value={assetFilters.contentType}
                        onValueChange={(val) => setAssetFilters(prev => ({ ...prev, contentType: val }))}
                      >
                        <SelectTrigger data-testid="select-content-type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ad">Ad</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Channel</label>
                      <Select
                        value={assetFilters.channel}
                        onValueChange={(val) => setAssetFilters(prev => ({ ...prev, channel: val }))}
                      >
                        <SelectTrigger data-testid="select-channel-filter">
                          <SelectValue placeholder="Select or write in channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="custom">Other (write in below)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Persona</label>
                      <Select
                        value={assetFilters.persona}
                        onValueChange={(val) => setAssetFilters(prev => ({ ...prev, persona: val }))}
                      >
                        <SelectTrigger data-testid="select-persona-filter">
                          <SelectValue placeholder="Select persona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cmo">CMO</SelectItem>
                          <SelectItem value="marketing">Marketing Director</SelectItem>
                          <SelectItem value="sales">Sales Leader</SelectItem>
                          <SelectItem value="it">IT Director</SelectItem>
                          <SelectItem value="founder">Founder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stage</label>
                      <Select
                        value={assetFilters.stage}
                        onValueChange={(val) => setAssetFilters(prev => ({ ...prev, stage: val }))}
                      >
                        <SelectTrigger data-testid="select-stage-filter">
                          <SelectValue placeholder="Select stage" />
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
                      <label className="text-sm font-medium">Goal</label>
                      <Select
                        value={assetFilters.goal}
                        onValueChange={(val) => setAssetFilters(prev => ({ ...prev, goal: val }))}
                      >
                        <SelectTrigger data-testid="select-goal-filter">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traffic">Increase Traffic</SelectItem>
                          <SelectItem value="engagement">Boost Engagement</SelectItem>
                          <SelectItem value="pipeline">Grow Pipeline</SelectItem>
                          <SelectItem value="retention">Improve Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium invisible">Action</label>
                      <Button
                        onClick={() => setShowAssetSearch(!showAssetSearch)}
                        className="w-full"
                        style={{ backgroundColor: moduleColor }}
                        data-testid="button-search-assets"
                      >
                        <Search className="w-4 h-4 mr-2" /> Search Assets
                      </Button>
                    </div>
                  </div>

                  {showAssetSearch && (
                    <div className="p-4 border rounded-md bg-white">
                      <p className="text-sm text-muted-foreground">
                        Search results would appear here based on the filters above
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes / Creative Direction</label>
                    <Textarea
                      rows={2}
                      placeholder="Add details or ideas"
                      data-testid="textarea-asset-notes"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Selection Summary */}
              {selectedAssets.length > 0 && (
                <Card style={{ borderColor: moduleColor }} className="border-2">
                  <CardContent className="pt-6">
                    <p className="text-sm mb-3">
                      <strong>{selectedAssets.length}</strong> asset(s) selected. These will be added to your campaign project.
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {selectedAssets.map(id => {
                        const asset = dummyAssets.find(a => a.id === id)
                        return (
                          <div key={id} className="border rounded-md p-2 text-xs bg-white">
                            <p className="font-medium" style={{ color: moduleColor }}>{asset?.name}</p>
                            <p className="text-muted-foreground">{asset?.type} · {asset?.persona}</p>
                          </div>
                        )
                      })}
                    </div>
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
                  <Button variant="outline" data-testid="button-save-assets">
                    Save Progress
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('channel-placement')}
                    data-testid="button-proceed-channel-placement"
                    style={{ backgroundColor: moduleColor }}
                    className="text-white"
                  >
                    Proceed to Channel Placement <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'channel-placement' && (
            <motion.div
              key="channel-placement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Coaching Prompt */}
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <strong className="font-semibold">Coaching Prompts:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Where does your persona actually spend time and seek information?</li>
                        <li>Are you over-indexing on paid while neglecting owned or earned?</li>
                        <li>Can you achieve your goal without paid spend — or does it amplify owned?</li>
                        <li>Which channel will carry your hero message, and which support it?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Mix Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles size={18} style={{ color: moduleColor }} />
                    Channel Mix Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Total Channels</div>
                      <div className="text-2xl font-semibold" style={{ color: moduleColor }}>
                        {channelPlacements.filter(c => c.channel.trim()).length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Total Assets</div>
                      <div className="text-2xl font-semibold" style={{ color: moduleColor }}>
                        {channelPlacements.reduce((sum, c) => sum + c.assetCount, 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Total Spend</div>
                      <div className="text-2xl font-semibold" style={{ color: moduleColor }}>
                        ${channelPlacements.reduce((sum, c) => sum + (parseFloat(c.spend) || 0), 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Placements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Channel Placements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Header Row */}
                  <div className="flex gap-2 text-xs font-medium text-muted-foreground">
                    <div className="flex-1">Content Name</div>
                    <div className="flex-1">Content Type</div>
                    <div className="flex-1">Channel</div>
                    <div className="w-16 text-center">Assets</div>
                    <div className="w-20 text-center">Spend ($)</div>
                  </div>
                  
                  {/* Channel Rows */}
                  {channelPlacements.map((channel, idx) => (
                    <div key={channel.id} className="flex gap-2">
                      <Input
                        placeholder="Auto-populated from assets"
                        className="flex-1"
                        value={channel.contentName}
                        onChange={(e) => updateChannelPlacement(channel.id, 'contentName', e.target.value)}
                        data-testid={`input-content-name-${idx}`}
                      />
                      <Select 
                        value={channel.contentType} 
                        onValueChange={(value) => updateChannelPlacement(channel.id, 'contentType', value)}
                      >
                        <SelectTrigger className="flex-1" data-testid={`select-content-type-${idx}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypeOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select 
                        value={channel.channel} 
                        onValueChange={(value) => updateChannelPlacement(channel.id, 'channel', value)}
                      >
                        <SelectTrigger className="flex-1" data-testid={`select-channel-${idx}`}>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {channelOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="0"
                        className="w-16"
                        type="number"
                        value={channel.assetCount || ''}
                        onChange={(e) => updateChannelPlacement(channel.id, 'assetCount', parseInt(e.target.value) || 0)}
                        data-testid={`input-assets-${idx}`}
                      />
                      <Input
                        placeholder="0"
                        className="w-20"
                        value={channel.spend}
                        onChange={(e) => updateChannelPlacement(channel.id, 'spend', e.target.value)}
                        data-testid={`input-spend-${idx}`}
                      />
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addChannelPlacement}
                    className="w-full"
                    data-testid="button-add-channel"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Channel Placement
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('assets')}
                  data-testid="button-back-to-assets"
                >
                  Back to Assets
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" data-testid="button-save-channels">
                    Save Progress
                  </Button>
                  <Button
                    onClick={proceedToCreative}
                    data-testid="button-proceed-creative"
                    style={{ backgroundColor: moduleColor }}
                    className="text-white"
                  >
                    Proceed to Creative <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'creative' && (
            <motion.div
              key="creative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Coaching Prompt */}
              <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Lightbulb size={18} style={{ color: moduleColor }} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <strong className="font-semibold">Coaching Prompts:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Upload final creative assets or provide links from Canva/Figma design tools</li>
                        <li>Don't have design software? Use our Stock Image browser or AI Image Generator</li>
                        <li>Include all metadata (headlines, copy, CTAs) so Flight Deck can package everything together</li>
                        <li>Each channel can have multiple creative variations — organize them clearly</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creative Cards */}
              {getAllSelectedChannels().length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>No channels selected. Please go back to Channel Placement and add channels.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {getAllSelectedChannels().map((channel, idx) => (
                    <Card key={channel.id} className="overflow-hidden">
                      <CardHeader style={{ backgroundColor: `${moduleColor}10` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{channel.contentName || 'Untitled Content'}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {channel.channel}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column: Creative Specs & Import */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Upload size={16} style={{ color: moduleColor }} />
                                Creative Specifications
                              </h4>
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Creative Type</label>
                                  <Select>
                                    <SelectTrigger data-testid={`select-creative-type-${idx}`}>
                                      <SelectValue placeholder="Select creative type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="single-image">Single Image</SelectItem>
                                      <SelectItem value="carousel">Carousel</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="story">Story</SelectItem>
                                      <SelectItem value="banner">Display Banner</SelectItem>
                                      <SelectItem value="email">Email Graphic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Creative Size/Format</label>
                                  <Input
                                    placeholder="e.g., 1200x627, 1080x1080"
                                    className="text-sm"
                                    data-testid={`input-size-${idx}`}
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <ImageIcon size={16} style={{ color: moduleColor }} />
                                Import Creative Assets
                              </h4>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  data-testid={`button-upload-${idx}`}
                                >
                                  <Upload className="w-4 h-4 mr-2" /> Upload Files
                                </Button>
                                <Input
                                  placeholder="Figma link (e.g., figma.com/file/...)"
                                  className="text-sm"
                                  data-testid={`input-figma-link-${idx}`}
                                />
                                <Input
                                  placeholder="Canva link (e.g., canva.com/design/...)"
                                  className="text-sm"
                                  data-testid={`input-canva-link-${idx}`}
                                />
                                <div className="pt-2 border-t">
                                  <p className="text-xs text-muted-foreground mb-2">Don't have design tools?</p>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowStockBrowser(true)}
                                      data-testid={`button-stock-images-${idx}`}
                                    >
                                      <ImageIcon className="w-3 h-3 mr-1" /> Stock Images
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowImageGenerator(true)}
                                      data-testid={`button-ai-generate-${idx}`}
                                    >
                                      <Sparkles className="w-3 h-3 mr-1" /> AI Generate
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Creative Metadata */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <FileText size={16} style={{ color: moduleColor }} />
                                Creative Metadata
                              </h4>
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Headline</label>
                                  <Input
                                    placeholder="Main headline for this creative"
                                    className="text-sm"
                                    data-testid={`input-headline-${idx}`}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Subheading (optional)</label>
                                  <Input
                                    placeholder="Supporting headline"
                                    className="text-sm"
                                    data-testid={`input-subheading-${idx}`}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Body Copy</label>
                                  <Textarea
                                    rows={3}
                                    placeholder="Ad copy, description, or message"
                                    className="text-sm"
                                    data-testid={`textarea-body-${idx}`}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">CTA Text</label>
                                  <Input
                                    placeholder="e.g., Learn More, Sign Up, Get Started"
                                    className="text-sm"
                                    data-testid={`input-cta-text-${idx}`}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Target URL</label>
                                  <Input
                                    placeholder="https://..."
                                    className="text-sm"
                                    data-testid={`input-target-url-${idx}`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* AI Image Generator Modal (placeholder) */}
              {showImageGenerator && (
                <Card style={{ borderColor: moduleColor }} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles size={18} style={{ color: moduleColor }} />
                        AI Image Generator
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowImageGenerator(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Describe the image you'd like to generate for your campaign
                    </p>
                    <Textarea
                      rows={3}
                      placeholder="e.g., Professional marketing team collaborating around a laptop, modern office setting, bright natural lighting..."
                      data-testid="textarea-ai-prompt"
                    />
                    <Button
                      className="mt-3"
                      style={{ backgroundColor: moduleColor }}
                      data-testid="button-generate-image"
                    >
                      Generate Image
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Stock Image Browser Modal (placeholder) */}
              {showStockBrowser && (
                <Card style={{ borderColor: moduleColor }} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon size={18} style={{ color: moduleColor }} />
                        Browse Stock Images
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStockBrowser(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Search stock images..."
                      className="mb-3"
                      data-testid="input-stock-search"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="aspect-square bg-white rounded-md flex items-center justify-center cursor-pointer hover-elevate"
                          data-testid={`stock-image-${i}`}
                        >
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('channel-placement')}
                  data-testid="button-back-to-channels"
                >
                  Back to Channel Placement
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" data-testid="button-save-creative">
                    Save Progress
                  </Button>
                  <Button
                    variant="outline"
                    data-testid="button-export-assets"
                  >
                    <Download className="w-4 h-4 mr-2" /> Export Assets
                  </Button>
                  <Button
                    style={{ backgroundColor: moduleColor }}
                    className="text-white"
                    data-testid="button-finalize-campaign"
                  >
                    Finalize Campaign
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
    { id: 'assets', label: 'Assets', description: 'Gather campaign assets' },
    { id: 'channel-placement', label: 'Channel Placement', description: 'Select distribution channels' },
    { id: 'creative', label: 'Creative', description: 'Design campaign creative' }
  ]

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={campaignSteps}
      currentStep={currentStep}
      onStepChange={(stepId) => setCurrentStep(stepId as Step)}
      content={content}
      moduleColor={moduleColor}
      featureName="Campaign Builder"
    />
  )
}

