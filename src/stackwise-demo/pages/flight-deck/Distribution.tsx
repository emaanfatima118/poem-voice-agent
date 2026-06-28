import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/stackwise-demo/components/ui/tabs'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Label } from '@/stackwise-demo/components/ui/label'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select'
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox'
import { Switch } from '@/stackwise-demo/components/ui/switch'
import { Progress } from '@/stackwise-demo/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/stackwise-demo/components/ui/dialog'
import { 
  Upload,
  Settings,
  Shield,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  DollarSign,
  Link2,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Plane,
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  Image,
  Paperclip,
  Zap,
  X,
  FileImage,
  Info
} from 'lucide-react'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { RequestBudgetChangeDialog } from '@/stackwise-demo/components/RequestBudgetChangeDialog'

const FLIGHT_DECK_COLOR = '#1e40f2'

// Aviation status system
export const AVIATION_STATUS = {
  boarding: { label: 'Now Boarding', color: '#9ca3af', icon: Upload },
  safety_checks: { label: 'Safety Checks', color: '#fbbf24', icon: Shield },
  in_flight: { label: 'In Flight', color: '#10b981', icon: Rocket },
  landed: { label: 'Landed', color: '#6366f1', icon: CheckCircle2 },
}

type DistributionStep = 'load' | 'schedule-optimize' | 'flight-check' | 'takeoff'

const STEPS = [
  { id: 'load', label: 'Load', icon: Upload },
  { id: 'schedule-optimize', label: 'Schedule + Optimize', icon: Settings },
  { id: 'flight-check', label: 'Flight Check', icon: Shield },
  { id: 'takeoff', label: 'Take Off', icon: Rocket },
]

// Mock campaign data
const mockCampaigns = [
  {
    id: 'camp-1',
    name: 'Q1 Product Launch Campaign',
    status: 'boarding' as keyof typeof AVIATION_STATUS,
    channels: ['email', 'linkedin', 'facebook', 'instagram', 'tiktok'],
    assets: 12,
    contentBlocks: 8,
    budget: 25000,
  },
  {
    id: 'camp-2',
    name: 'Executive Thought Leadership Series',
    status: 'safety_checks' as keyof typeof AVIATION_STATUS,
    channels: ['email', 'linkedin'],
    assets: 6,
    contentBlocks: 4,
    budget: 10000,
  },
  {
    id: 'camp-3',
    name: 'Customer Success Stories Campaign',
    status: 'boarding' as keyof typeof AVIATION_STATUS,
    channels: ['email', 'linkedin', 'facebook'],
    assets: 8,
    contentBlocks: 5,
    budget: 15000,
  },
]

// Mock exec vis programs
const mockExecVisPrograms = [
  {
    id: 'exec-1',
    programTitle: 'CEO Insights Series',
    executive: 'Sarah Chen',
    title: 'CEO',
    pieces: 12,
    channels: ['linkedin', 'email'],
  },
  {
    id: 'exec-2',
    programTitle: 'VP Marketing POV Series',
    executive: 'Marcus Johnson',
    title: 'VP Marketing',
    pieces: 8,
    channels: ['linkedin'],
  },
  {
    id: 'exec-3',
    programTitle: 'CMO Strategy Corner',
    executive: 'Lisa Park',
    title: 'CMO',
    pieces: 10,
    channels: ['linkedin', 'email', 'facebook'],
  },
]

// Mock audience lists
const mockEmailLists = [
  { id: 'list-1', name: 'Enterprise Prospects', size: 2840 },
  { id: 'list-2', name: 'Current Customers', size: 1520 },
  { id: 'list-3', name: 'Trial Users', size: 890 },
]

// Mock audience segments (from Audience Engine)
const mockAudienceSegments = [
  { id: 'seg-1', name: 'High-Intent Tech Leaders', size: 1247 },
  { id: 'seg-2', name: 'Expanding Accounts', size: 423 },
  { id: 'seg-3', name: 'Competitive Switch Candidates', size: 856 },
]

// Mock connected ad platforms (auto-populated from integrations)
const connectedAdPlatforms = [
  { platform: 'linkedin', campaigns: ['Lead Gen Campaign', 'Brand Awareness Q1', 'Retargeting'] },
  { platform: 'googleAds', campaigns: ['Search Campaign', 'Display Network', 'Shopping Ads'] },
  { platform: 'facebook', campaigns: ['Conversion Campaign', 'Traffic Campaign', 'Engagement Campaign'] },
  { platform: 'instagram', campaigns: ['Story Ads', 'Feed Ads', 'Reels Campaign'] },
  { platform: 'tiktok', campaigns: ['Video Views', 'Traffic Campaign', 'App Installs'] },
  { platform: 'displayProgrammatic', campaigns: ['Display Banner Campaign', 'Programmatic Video', 'Retargeting Display'] },
]

// Mock assets for campaigns
const mockAssets = [
  { id: 'asset-1', name: 'Product Hero Image.png', type: 'Image', size: '2.4 MB' },
  { id: 'asset-2', name: 'Email Template.html', type: 'HTML', size: '124 KB' },
  { id: 'asset-3', name: 'Social Media Graphic.jpg', type: 'Image', size: '1.8 MB' },
  { id: 'asset-4', name: 'Video Promo.mp4', type: 'Video', size: '15 MB' },
]

type CampaignData = {
  [campaignId: string]: {
    name: string
    channels: {
      email?: {
        launchDate: string
        time: string
        subject: string
        preview: string
        pacing: boolean
        list: string
        segment: string
        personalization: {
          subject: string[]
          preview: string[]
          flow: string[]
          cta: string[]
        }
        personalizationAccepted: boolean
        assets?: string[]
      }
      linkedin?: {
        posts: Array<{
          content: string
          launchDate: string
          time: string
          assets: string[]
        }>
      }
      facebook?: {
        posts: Array<{
          content: string
          launchDate: string
          time: string
          assets: string[]
        }>
      }
      instagram?: {
        posts: Array<{
          content: string
          launchDate: string
          time: string
          assets: string[]
        }>
      }
      tiktok?: {
        posts: Array<{
          content: string
          launchDate: string
          time: string
          assets: string[]
        }>
      }
    }
    paidAds: {
      linkedin?: { 
        startDate: string
        endDate: string
        dailyBudget: number
        campaignBudget: number
        subCampaignName?: string
        assets?: string[]
      }
      googleAds?: { 
        startDate: string
        endDate: string
        dailyBudget: number
        campaignBudget: number
        subCampaignName?: string
        assets?: string[]
      }
      facebook?: { 
        startDate: string
        endDate: string
        dailyBudget: number
        campaignBudget: number
        subCampaignName?: string
        assets?: string[]
      }
      instagram?: { 
        startDate: string
        endDate: string
        dailyBudget: number
        campaignBudget: number
        subCampaignName?: string
        assets?: string[]
      }
      tiktok?: { 
        startDate: string
        endDate: string
        dailyBudget: number
        campaignBudget: number
        subCampaignName?: string
        assets?: string[]
      }
      displayProgrammatic?: { 
        startDate: string
        endDate: string
        dailyBudget: number
        campaignBudget: number
        subCampaignName?: string
        assets?: string[]
      }
    }
    urlTracking: {
      urls: { label: string, url: string, channel: string }[]
    }
  }
}

export default function Distribution() {
  const [currentStep, setCurrentStep] = useState<DistributionStep>('load')
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [selectedExecProgram, setSelectedExecProgram] = useState<string | null>(null)
  const [campaignData, setCampaignData] = useState<CampaignData>({})
  const [isFullyStacked] = useState(true) // Mock tier - would come from user data

  // Flight Check validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const currentCampaign = selectedCampaign ? mockCampaigns.find(c => c.id === selectedCampaign) : null
  const currentExecProgram = selectedExecProgram ? mockExecVisPrograms.find(e => e.id === selectedExecProgram) : null

  const updateCampaignData = (campaignId: string, updates: any) => {
    setCampaignData(prev => ({
      ...prev,
      [campaignId]: {
        ...prev[campaignId],
        ...updates
      }
    }))
  }

  const validateCampaign = (campaignId: string) => {
    const errors: string[] = []
    const data = campaignData[campaignId]
    
    if (!data) {
      errors.push('No campaign data found')
      return errors
    }

    // Email validation
    if (data.channels?.email) {
      if (!data.channels.email.subject) errors.push('Email: Missing subject line')
      if (!data.channels.email.preview) errors.push('Email: Missing preview text')
      if (!data.channels.email.list && !data.channels.email.segment) errors.push('Email: Missing list or segment')
      if (!data.channels.email.launchDate) errors.push('Email: Missing launch date')
    }

    // Social validation
    const socials = ['linkedin', 'facebook', 'instagram', 'tiktok'] as const
    socials.forEach(social => {
      if (data.channels?.[social]?.posts) {
        const posts = data.channels[social]?.posts || []
        posts.forEach((post: any, index: number) => {
          if (!post.launchDate) errors.push(`${social} Post #${index + 1}: Missing launch date`)
          if ((post.content?.length || 0) > getCharacterLimit(social)) {
            errors.push(`${social} Post #${index + 1}: Character count exceeded`)
          }
        })
      }
    })

    // Paid ads validation
    if (data.paidAds) {
      Object.entries(data.paidAds).forEach(([platform, adData]) => {
        if (adData) {
          if (!adData.endDate) errors.push(`${platform} ads: Missing end date`)
          if (!adData.dailyBudget) errors.push(`${platform} ads: Missing daily budget`)
          if (!adData.campaignBudget) errors.push(`${platform} ads: Missing campaign budget`)
        }
      })
    }

    // URL validation - check for broken/missing URLs
    if (!data.urlTracking?.urls || data.urlTracking.urls.length === 0) {
      errors.push('URL Tracking: No URLs generated')
    }

    return errors
  }

  const getCharacterLimit = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 3000
      case 'facebook': return 63206
      case 'instagram': return 2200
      case 'tiktok': return 2200
      default: return 280
    }
  }

  const runFlightCheck = () => {
    const allErrors: Record<string, string[]> = {}
    mockCampaigns.forEach(campaign => {
      const errors = validateCampaign(campaign.id)
      if (errors.length > 0) {
        allErrors[campaign.id] = errors
      }
    })
    setValidationErrors(allErrors)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'load':
        return <LoadStep 
          campaigns={mockCampaigns}
          execPrograms={mockExecVisPrograms}
          selectedCampaign={selectedCampaign}
          setSelectedCampaign={setSelectedCampaign}
          selectedExecProgram={selectedExecProgram}
          setSelectedExecProgram={setSelectedExecProgram}
          campaignData={campaignData}
          updateCampaignData={updateCampaignData}
          onLoad={() => setCurrentStep('schedule-optimize')}
        />

      case 'schedule-optimize':
        return <ScheduleOptimizeStep 
          campaigns={mockCampaigns}
          selectedCampaign={selectedCampaign}
          setSelectedCampaign={setSelectedCampaign}
          campaignData={campaignData}
          updateCampaignData={updateCampaignData}
          isFullyStacked={isFullyStacked}
        />

      case 'flight-check':
        return <FlightCheckStep 
          campaigns={mockCampaigns}
          validationErrors={validationErrors}
          runFlightCheck={runFlightCheck}
          setCurrentStep={setCurrentStep}
        />

      case 'takeoff':
        return <TakeOffStep 
          campaigns={mockCampaigns}
          campaignData={campaignData}
        />

      default:
        return null
    }
  }

  const leftContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: FLIGHT_DECK_COLOR }}>
          Distribution Steps
        </h3>
        <p className="text-xs text-muted-foreground">Campaign deployment workflow</p>
      </div>

      <div className="space-y-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isPast = STEPS.findIndex(s => s.id === currentStep) > index
          
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as DistributionStep)}
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800' 
                  : isPast
                  ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                  : 'border border-transparent hover-elevate'
              }`}
              data-testid={`button-step-${step.id}`}
            >
              <div className={`p-2 rounded-md ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : isPast
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-muted'
              }`}>
                <Icon className={`w-4 h-4 ${
                  isActive 
                    ? 'text-blue-600' 
                    : isPast
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${isActive ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                  {step.label}
                </div>
              </div>
              {isPast && <CheckCircle2 className="w-4 h-4 text-green-600" />}
            </button>
          )
        })}
      </div>
    </div>
  )

  const centerContent = (
    <div className="space-y-6">
      {/* QuickActions - Sticky */}
      <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b">
        <QuickActions module="FlightDeck" />
      </div>

      {/* Flight Stats Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
              <h3 className="font-semibold">Flight Stats</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-md bg-muted">
              <div className="text-2xl font-bold" style={{ color: FLIGHT_DECK_COLOR }}>
                {mockCampaigns.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total Campaigns</div>
            </div>
            <div className="text-center p-3 rounded-md bg-muted">
              <div className="text-2xl font-bold text-green-600">
                {mockCampaigns.filter(c => c.status === 'in_flight').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">In Flight</div>
            </div>
            <div className="text-center p-3 rounded-md bg-muted">
              <div className="text-2xl font-bold text-yellow-600">
                {mockCampaigns.filter(c => c.status === 'boarding' || c.status === 'safety_checks').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Pre-Flight</div>
            </div>
          </div>

          {/* Aviation Status */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(AVIATION_STATUS).map(([key, status]) => {
                const StatusIcon = status.icon
                const count = mockCampaigns.filter(c => c.status === key).length
                return (
                  <div 
                    key={key} 
                    className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted"
                  >
                    <StatusIcon className="w-3 h-3" style={{ color: status.color }} />
                    <span className="text-xs font-medium">{status.label}</span>
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderStepContent()}
      </motion.div>
    </div>
  )

  const rightContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: FLIGHT_DECK_COLOR }}>
          Campaign Details
        </h3>
        <p className="text-xs text-muted-foreground">
          {currentCampaign ? currentCampaign.name : 'Select a campaign to view details'}
        </p>
      </div>

      {currentCampaign && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Channels</span>
                <span className="text-sm font-semibold">{currentCampaign.channels.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Assets</span>
                <span className="text-sm font-semibold">{currentCampaign.assets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Content Blocks</span>
                <span className="text-sm font-semibold">{currentCampaign.contentBlocks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Budget</span>
                <span className="text-sm font-semibold">${currentCampaign.budget.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {(() => {
                  const StatusIcon = AVIATION_STATUS[currentCampaign.status].icon
                  return (
                    <>
                      <StatusIcon 
                        className="w-4 h-4" 
                        style={{ color: AVIATION_STATUS[currentCampaign.status].color }} 
                      />
                      <span className="text-sm font-medium">
                        {AVIATION_STATUS[currentCampaign.status].label}
                      </span>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r overflow-y-auto p-6 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20">
        {leftContent}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {centerContent}
      </div>
    </div>
  )
}

/* ========================================
   STEP 1: LOAD
   
   DEVELOPER NOTES - MODULAR CONSIDERATIONS:
   - Executive Visibility Programs section should ONLY show for:
     * Users with BrandCraft module
     * Fully Stacked tier users
   - Upload Content & Assets section should:
     * Show for all users (standalone Flight Deck support)
     * Hide for BrandCraft users (they use content library)
   - Implementation: Check user.modules.includes('brandcraft') 
     and user.tier === 'fully_stacked'
   ======================================== */

function LoadStep({ 
  campaigns, 
  execPrograms,
  selectedCampaign, 
  setSelectedCampaign,
  selectedExecProgram,
  setSelectedExecProgram,
  campaignData,
  updateCampaignData,
  onLoad
}: {
  campaigns: typeof mockCampaigns
  execPrograms: typeof mockExecVisPrograms
  selectedCampaign: string | null
  setSelectedCampaign: (id: string | null) => void
  selectedExecProgram: string | null
  setSelectedExecProgram: (id: string | null) => void
  campaignData: CampaignData
  updateCampaignData: (id: string, data: any) => void
  onLoad: () => void
}) {
  const [campaignSearch, setCampaignSearch] = useState('')
  const [execSearch, setExecSearch] = useState('')

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(campaignSearch.toLowerCase())
  )

  const filteredExecPrograms = execPrograms.filter(e => 
    e.programTitle.toLowerCase().includes(execSearch.toLowerCase()) ||
    e.executive.toLowerCase().includes(execSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Load Campaigns & Programs</h2>
        <p className="text-muted-foreground">
          Select campaigns or executive visibility programs for distribution
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT: Campaigns */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Rocket className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
              Campaigns
            </h3>
            <Input 
              value={campaignSearch}
              onChange={(e) => setCampaignSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="mb-3"
              data-testid="input-search-campaigns"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredCampaigns.map(campaign => {
              const StatusIcon = AVIATION_STATUS[campaign.status].icon
              const isSelected = selectedCampaign === campaign.id

              return (
                <Card 
                  key={campaign.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 border-2' : 'hover-elevate'
                  }`}
                  onClick={() => {
                    setSelectedCampaign(campaign.id)
                    setSelectedExecProgram(null)
                  }}
                  data-testid={`card-campaign-${campaign.id}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{campaign.name}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" style={{ color: AVIATION_STATUS[campaign.status].color }} />
                        <span className="text-xs">{AVIATION_STATUS[campaign.status].label}</span>
                      </Badge>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3">
                        <Label className="text-xs mb-1 block">Campaign Name</Label>
                        <Input 
                          value={campaignData[campaign.id]?.name || campaign.name}
                          onChange={(e) => updateCampaignData(campaign.id, { name: e.target.value })}
                          placeholder="Enter campaign name"
                          className="text-sm"
                          data-testid={`input-campaign-name-${campaign.id}`}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs mt-3">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{campaign.channels.length} ch</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{campaign.assets} assets</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">${(campaign.budget / 1000).toFixed(0)}k</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-muted-foreground mb-2">Channels:</div>
                        <div className="flex flex-wrap gap-1">
                          {campaign.channels.map(channel => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Executive Visibility Programs */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
              Executive Visibility Programs
            </h3>
            <Input 
              value={execSearch}
              onChange={(e) => setExecSearch(e.target.value)}
              placeholder="Search programs..."
              className="mb-3"
              data-testid="input-search-exec-programs"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredExecPrograms.map(program => {
              const isSelected = selectedExecProgram === program.id

              return (
                <Card 
                  key={program.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 border-2' : 'hover-elevate'
                  }`}
                  onClick={() => {
                    setSelectedExecProgram(program.id)
                    setSelectedCampaign(null)
                  }}
                  data-testid={`card-exec-program-${program.id}`}
                >
                  <CardContent className="pt-4">
                    <div className="mb-2">
                      <h4 className="font-semibold text-sm mb-1">{program.programTitle}</h4>
                      <p className="text-xs text-muted-foreground">
                        {program.executive}, {program.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs mt-3">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{program.pieces} pieces</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{program.channels.length} channels</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-muted-foreground mb-2">Channels:</div>
                        <div className="flex flex-wrap gap-1">
                          {program.channels.map(channel => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Upload Content & Assets - For standalone Flight Deck users */}
      <div className="mt-6 pt-6 border-t">
        <div className="mb-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
            Upload Content & Assets
          </h3>
          <p className="text-sm text-muted-foreground">
            Don't have BrandCraft? Upload your content and assets directly here
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Upload Assets */}
          <Card className="hover-elevate">
            <CardContent className="pt-4">
              <div className="text-center py-8">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                    <FileImage className="w-6 h-6" style={{ color: FLIGHT_DECK_COLOR }} />
                  </div>
                </div>
                <h4 className="font-semibold mb-1">Upload Assets</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Images, videos, PDFs, documents
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-upload-assets"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supports JPG, PNG, MP4, PDF up to 50MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Content */}
          <Card className="hover-elevate">
            <CardContent className="pt-4">
              <div className="text-center py-8">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                    <FileText className="w-6 h-6" style={{ color: FLIGHT_DECK_COLOR }} />
                  </div>
                </div>
                <h4 className="font-semibold mb-1">Upload Content</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Emails, blog posts, social copy
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-upload-content"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Content
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supports TXT, DOCX, HTML, MD
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-xs">
              <strong className="text-blue-900 dark:text-blue-100">Pro Tip:</strong>
              <span className="text-blue-800 dark:text-blue-200 ml-1">
                BrandCraft users can skip this step - your content library will auto-populate here
              </span>
            </div>
          </div>
        </div>
      </div>

      {(selectedCampaign || selectedExecProgram) && (
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onLoad}
            data-testid="button-load-selection"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Load Selection
          </Button>
        </div>
      )}
    </div>
  )
}

/* ========================================
   STEP 2: SCHEDULE + OPTIMIZE
   ======================================== */

function ScheduleOptimizeStep({ 
  campaigns, 
  selectedCampaign,
  setSelectedCampaign,
  campaignData,
  updateCampaignData,
  isFullyStacked 
}: {
  campaigns: typeof mockCampaigns
  selectedCampaign: string | null
  setSelectedCampaign: (id: string | null) => void
  campaignData: CampaignData
  updateCampaignData: (id: string, data: any) => void
  isFullyStacked: boolean
}) {
  const [showPersonalization, setShowPersonalization] = useState(false)
  const [budgetInsightsOpen, setBudgetInsightsOpen] = useState(false)
  const [paidAdCards, setPaidAdCards] = useState<string[]>(['linkedin', 'googleAds', 'facebook', 'instagram', 'tiktok', 'displayProgrammatic'])
  const [showChannelSelector, setShowChannelSelector] = useState(false)
  const [selectedNewChannel, setSelectedNewChannel] = useState<string>('linkedin')
  const [showIntelligence, setShowIntelligence] = useState(false)
  const [showBudgetRequestDialog, setShowBudgetRequestDialog] = useState(false)
  const [showSocialPostDialog, setShowSocialPostDialog] = useState(false)
  const [showToneCheck, setShowToneCheck] = useState(false)
  const [toneCheckScore, setToneCheckScore] = useState(0)
  
  /* DEVELOPER NOTE - MODULAR CONSIDERATION:
   * Brand tone check should gracefully degrade based on:
   * - hasBrandTone = user.modules.includes('brandcraft') && user.brandToneConfigured
   * - If no brand tone: Skip check, allow immediate scheduling
   * - If brand tone exists: Run check, require ≥70% to schedule
   * - NEVER block scheduling due to missing BrandCraft module
   */
  const [hasBrandTone] = useState(Math.random() > 0.3) // Mock: 70% have brand tone, 30% don't
  const [socialPosts, setSocialPosts] = useState<Array<{
    id: number
    content: string
    channel: string
    pillarOrCampaign: string
    scheduleDate: string
    scheduleTime: string
  }>>([{ id: 1, content: '', channel: 'linkedin', pillarOrCampaign: '', scheduleDate: '', scheduleTime: '' }])
  
  const addPaidAdCard = () => {
    if (selectedNewChannel) {
      setPaidAdCards([...paidAdCards, selectedNewChannel])
      setShowChannelSelector(false)
      setSelectedNewChannel('linkedin')
    }
  }
  
  const availableChannels = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'googleAds', label: 'Google Ads' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'displayProgrammatic', label: 'Display/Programmatic' },
  ]

  if (!selectedCampaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Schedule + Optimize</h2>
            <p className="text-muted-foreground">
              Create social posts or select a campaign to configure full multi-channel distribution
            </p>
          </div>
          
          {/* Quick Action Button - Always Available */}
          <Button
            onClick={() => setShowSocialPostDialog(true)}
            size="sm"
            className="hover:shadow-lg transition-shadow"
            style={{ backgroundColor: FLIGHT_DECK_COLOR }}
            data-testid="button-create-social-posts"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Social Posts
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select a campaign from the Load step to configure full distribution settings
              </p>
              <p className="text-xs text-muted-foreground">
                Or use the "Create Social Posts" button above for quick, standalone social content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Post Series Dialog - Available without campaign */}
        <Dialog open={showSocialPostDialog} onOpenChange={setShowSocialPostDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Social Post Series</DialogTitle>
              <DialogDescription>
                Create multiple social posts with channel targeting and strategic anchoring
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {socialPosts.map((post, index) => (
                <Card key={post.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Post #{index + 1}</CardTitle>
                      {socialPosts.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSocialPosts(socialPosts.filter(p => p.id !== post.id))}
                          data-testid={`button-remove-post-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Channel</Label>
                        <Select
                          value={post.channel}
                          onValueChange={(val) => {
                            const updated = [...socialPosts]
                            updated[index].channel = val
                            setSocialPosts(updated)
                          }}
                        >
                          <SelectTrigger data-testid={`select-channel-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">Twitter/X</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Anchor to Pillar/Campaign</Label>
                        <Input
                          placeholder="e.g., Q1 Launch, Brand Awareness"
                          value={post.pillarOrCampaign}
                          onChange={(e) => {
                            const updated = [...socialPosts]
                            updated[index].pillarOrCampaign = e.target.value
                            setSocialPosts(updated)
                          }}
                          data-testid={`input-pillar-${index}`}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Schedule Date</Label>
                        <Input
                          type="date"
                          value={post.scheduleDate}
                          onChange={(e) => {
                            const updated = [...socialPosts]
                            updated[index].scheduleDate = e.target.value
                            setSocialPosts(updated)
                          }}
                          data-testid={`input-date-${index}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Schedule Time</Label>
                        <Input
                          type="time"
                          value={post.scheduleTime}
                          onChange={(e) => {
                            const updated = [...socialPosts]
                            updated[index].scheduleTime = e.target.value
                            setSocialPosts(updated)
                          }}
                          data-testid={`input-time-${index}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Content</Label>
                      <Textarea
                        placeholder="Write your social post content here..."
                        value={post.content}
                        onChange={(e) => {
                          const updated = [...socialPosts]
                          updated[index].content = e.target.value
                          setSocialPosts(updated)
                        }}
                        rows={4}
                        data-testid={`textarea-content-${index}`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.content.length} characters
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newId = Math.max(...socialPosts.map(p => p.id)) + 1
                  setSocialPosts([...socialPosts, {
                    id: newId,
                    content: '',
                    channel: 'linkedin',
                    pillarOrCampaign: '',
                    scheduleDate: '',
                    scheduleTime: ''
                  }])
                }}
                data-testid="button-add-another-post"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add Another Post
              </Button>
            </div>
            
            {/* Brand Tone Check - Graceful Degradation */}
            {showToneCheck && (
              <Card className={`border-2 ${
                !hasBrandTone 
                  ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500' 
                  : toneCheckScore >= 70 
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-500' 
                    : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500'
              }`}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {!hasBrandTone ? (
                          <Info className="w-5 h-5 text-blue-600" />
                        ) : toneCheckScore >= 70 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {!hasBrandTone ? 'No Brand Tone Configured' : 'Quick Brand Tone Check'}
                            </span>
                            {hasBrandTone && (
                              <Badge variant={toneCheckScore >= 70 ? "default" : "secondary"}>
                                {toneCheckScore}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {!hasBrandTone 
                              ? 'Skipping tone check - ready to schedule!' 
                              : toneCheckScore >= 70 
                                ? 'Posts align with brand voice - ready to schedule!' 
                                : 'Minor tone adjustments recommended'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {!hasBrandTone ? (
                      <div className="text-xs bg-background p-2 rounded border">
                        <strong>Tip:</strong> Set up brand tone in BrandCraft to enable AI-powered consistency checks
                      </div>
                    ) : toneCheckScore < 70 && (
                      <div className="text-xs bg-background p-2 rounded border">
                        <strong>Quick Tips:</strong> Consider using more professional language and aligning with brand values.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSocialPostDialog(false)
                  setShowToneCheck(false)
                  setSocialPosts([{ id: 1, content: '', channel: 'linkedin', pillarOrCampaign: '', scheduleDate: '', scheduleTime: '' }])
                }}
                data-testid="button-cancel-social-posts"
              >
                Cancel
              </Button>
              
              {!showToneCheck ? (
                <Button
                  onClick={() => {
                    if (hasBrandTone) {
                      // Run quick brand tone check
                      const score = Math.floor(Math.random() * 26) + 70 // 70-95
                      setToneCheckScore(score)
                    }
                    setShowToneCheck(true)
                  }}
                  style={{ backgroundColor: FLIGHT_DECK_COLOR }}
                  data-testid="button-check-and-schedule"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {hasBrandTone ? 'Check & Schedule' : 'Schedule Posts'}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowSocialPostDialog(false)
                    setShowToneCheck(false)
                    alert(`${socialPosts.length} social posts scheduled successfully!`)
                    setSocialPosts([{ id: 1, content: '', channel: 'linkedin', pillarOrCampaign: '', scheduleDate: '', scheduleTime: '' }])
                  }}
                  style={{ backgroundColor: FLIGHT_DECK_COLOR }}
                  data-testid="button-schedule-posts"
                  disabled={hasBrandTone && toneCheckScore < 70}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {!hasBrandTone 
                    ? 'Schedule Posts' 
                    : toneCheckScore >= 70 
                      ? 'Schedule Posts' 
                      : 'Fix Tone Issues First'}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const campaign = campaigns.find(c => c.id === selectedCampaign)
  if (!campaign) return null

  const data = campaignData[selectedCampaign] || {}

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Schedule + Optimize</h2>
          <p className="text-muted-foreground">
            Configure timing, content, and personalization for {campaign.name}
          </p>
        </div>
        
        {/* Action Buttons - Top Right */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={() => setShowSocialPostDialog(true)}
            variant="outline"
            size="sm"
            style={{
              borderColor: FLIGHT_DECK_COLOR,
            }}
            data-testid="button-create-social-posts"
          >
            <Sparkles className="w-4 h-4 mr-2" style={{ color: FLIGHT_DECK_COLOR }} />
            Create Social Posts
          </Button>
          
          <Button
            onClick={() => setShowBudgetRequestDialog(true)}
            variant="outline"
            size="sm"
            style={{
              borderColor: FLIGHT_DECK_COLOR,
            }}
            data-testid="button-request-budget-change"
          >
            <DollarSign className="w-4 h-4 mr-2" style={{ color: FLIGHT_DECK_COLOR }} />
            Request Budget Change
          </Button>
          
          <Button
            onClick={() => setBudgetInsightsOpen(true)}
            size="sm"
            className="hover:shadow-lg transition-shadow"
            style={{ backgroundColor: FLIGHT_DECK_COLOR }}
            data-testid="button-budget-insights"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Budget Insights
          </Button>
        </div>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="email" data-testid="tab-email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="linkedin" data-testid="tab-linkedin">
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="facebook" data-testid="tab-facebook">
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" data-testid="tab-instagram">
            <Instagram className="w-4 h-4 mr-2" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="tiktok" data-testid="tab-tiktok">
            TikTok
          </TabsTrigger>
          <TabsTrigger value="paid-ads" data-testid="tab-paid-ads">
            <DollarSign className="w-4 h-4 mr-2" />
            Paid Ads
          </TabsTrigger>
          <TabsTrigger value="url-tracking" data-testid="tab-url-tracking">
            <Link2 className="w-4 h-4 mr-2" />
            URLs
          </TabsTrigger>
        </TabsList>

        {/* EMAIL TAB */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Schedule and configure email campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Launch Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Launch Date</Label>
                  <Input 
                    type="date" 
                    value={data.channels?.email?.launchDate || ''}
                    onChange={(e) => updateCampaignData(selectedCampaign, {
                      channels: {
                        ...data.channels,
                        email: { ...data.channels?.email, launchDate: e.target.value }
                      }
                    })}
                    data-testid="input-email-launch-date"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Time</Label>
                  <Input 
                    type="time" 
                    value={data.channels?.email?.time || ''}
                    onChange={(e) => updateCampaignData(selectedCampaign, {
                      channels: {
                        ...data.channels,
                        email: { ...data.channels?.email, time: e.target.value }
                      }
                    })}
                    data-testid="input-email-time"
                  />
                </div>
              </div>

              {/* Subject & Preview */}
              <div>
                <Label className="mb-2 block">Subject Line</Label>
                <Input 
                  placeholder="Enter email subject..."
                  value={data.channels?.email?.subject || ''}
                  onChange={(e) => updateCampaignData(selectedCampaign, {
                    channels: {
                      ...data.channels,
                      email: { ...data.channels?.email, subject: e.target.value }
                    }
                  })}
                  data-testid="input-email-subject"
                />
              </div>

              <div>
                <Label className="mb-2 block">Preview Text</Label>
                <Input 
                  placeholder="Enter preview text..."
                  value={data.channels?.email?.preview || ''}
                  onChange={(e) => updateCampaignData(selectedCampaign, {
                    channels: {
                      ...data.channels,
                      email: { ...data.channels?.email, preview: e.target.value }
                    }
                  })}
                  data-testid="input-email-preview"
                />
              </div>

              {/* Pacing Toggle */}
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <Label className="text-sm font-medium">Enable Pacing</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Distribute sends over time to avoid spam filters
                  </p>
                </div>
                <Switch 
                  checked={data.channels?.email?.pacing || false}
                  onCheckedChange={(checked) => updateCampaignData(selectedCampaign, {
                    channels: {
                      ...data.channels,
                      email: { ...data.channels?.email, pacing: checked }
                    }
                  })}
                  data-testid="switch-email-pacing"
                />
              </div>

              {/* List / Segment Selection */}
              <div>
                <Label className="mb-2 block">Email List</Label>
                <Select 
                  value={data.channels?.email?.list || ''}
                  onValueChange={(value) => updateCampaignData(selectedCampaign, {
                    channels: {
                      ...data.channels,
                      email: { ...data.channels?.email, list: value }
                    }
                  })}
                >
                  <SelectTrigger data-testid="select-email-list">
                    <SelectValue placeholder="Choose email list..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmailLists.map(list => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name} ({list.size.toLocaleString()} contacts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isFullyStacked && (
                <div>
                  <Label className="mb-2 block">Or Choose Audience Segment</Label>
                  <Select 
                    value={data.channels?.email?.segment || ''}
                    onValueChange={(value) => updateCampaignData(selectedCampaign, {
                      channels: {
                        ...data.channels,
                        email: { ...data.channels?.email, segment: value }
                      }
                    })}
                  >
                    <SelectTrigger data-testid="select-email-segment">
                      <SelectValue placeholder="Choose audience segment..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAudienceSegments.map(seg => (
                        <SelectItem key={seg.id} value={seg.id}>
                          {seg.name} ({seg.size.toLocaleString()} contacts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Personalization (Fully Stacked Only) */}
              {isFullyStacked && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      AI Personalization Suggestions
                    </CardTitle>
                    <CardDescription>Optimize your email for better engagement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => setShowPersonalization(!showPersonalization)}
                      variant="outline"
                      className="w-full"
                      data-testid="button-show-personalization"
                    >
                      {showPersonalization ? 'Hide' : 'View'} Suggestions
                    </Button>

                    {showPersonalization && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-white dark:bg-gray-900 border">
                          <Label className="text-xs font-semibold mb-2 block">Subject Line Suggestions</Label>
                          <div className="space-y-2">
                            {['Add urgency: "Limited spots remaining"', 'Personalize: Use first name token'].map((suggestion, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Checkbox id={`subject-${i}`} />
                                <label htmlFor={`subject-${i}`} className="text-xs">{suggestion}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-md bg-white dark:bg-gray-900 border">
                          <Label className="text-xs font-semibold mb-2 block">Preview Text Suggestions</Label>
                          <div className="space-y-2">
                            {['Highlight key benefit first', 'Keep under 90 characters'].map((suggestion, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Checkbox id={`preview-${i}`} />
                                <label htmlFor={`preview-${i}`} className="text-xs">{suggestion}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              updateCampaignData(selectedCampaign, {
                                channels: {
                                  ...data.channels,
                                  email: { ...data.channels?.email, personalizationAccepted: true }
                                }
                              })
                            }}
                            data-testid="button-accept-all-personalization"
                          >
                            Accept All
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            data-testid="button-dismiss-personalization"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Email Assets Section */}
              <div>
                <Label className="mb-2 block flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Email Assets
                </Label>
                
                {/* Display Attached Assets */}
                {data.channels?.email?.assets && data.channels.email.assets.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {data.channels.email.assets.map((assetId: string) => {
                      const asset = mockAssets.find(a => a.id === assetId)
                      if (!asset) return null
                      return (
                        <div key={assetId} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                          <Image className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm flex-1">{asset.name}</span>
                          <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                          <span className="text-xs text-muted-foreground">{asset.size}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const currentAssets = data.channels?.email?.assets || []
                              updateCampaignData(selectedCampaign, {
                                channels: {
                                  ...data.channels,
                                  email: { 
                                    ...data.channels?.email, 
                                    assets: currentAssets.filter((id: string) => id !== assetId) 
                                  }
                                }
                              })
                            }}
                            className="h-6 w-6"
                            data-testid={`button-remove-email-asset-${assetId}`}
                          >
                            ×
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Add Assets Button with Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      data-testid="button-add-email-assets"
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      Add Assets
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Select Email Assets</DialogTitle>
                      <DialogDescription>
                        Choose assets to include in your email campaign
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {mockAssets.map((asset) => {
                        const isSelected = data.channels?.email?.assets?.includes(asset.id)
                        return (
                          <Card 
                            key={asset.id} 
                            className={`cursor-pointer hover-elevate ${isSelected ? 'border-primary' : ''}`}
                            onClick={() => {
                              const currentAssets = data.channels?.email?.assets || []
                              if (isSelected) {
                                updateCampaignData(selectedCampaign, {
                                  channels: {
                                    ...data.channels,
                                    email: { 
                                      ...data.channels?.email, 
                                      assets: currentAssets.filter((id: string) => id !== asset.id) 
                                    }
                                  }
                                })
                              } else {
                                updateCampaignData(selectedCampaign, {
                                  channels: {
                                    ...data.channels,
                                    email: { 
                                      ...data.channels?.email, 
                                      assets: [...currentAssets, asset.id] 
                                    }
                                  }
                                })
                              }
                            }}
                            data-testid={`email-asset-card-${asset.id}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-md bg-muted">
                                  <Image className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{asset.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                                    <span className="text-xs text-muted-foreground">{asset.size}</span>
                                  </div>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  className="w-full"
                  data-testid="button-preview-email"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Email
                </Button>
                <Button 
                  className="w-full"
                  data-testid="button-schedule-email"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOCIAL TABS (LinkedIn, Facebook, Instagram, TikTok) */}
        {['linkedin', 'facebook', 'instagram', 'tiktok'].map(social => (
          <TabsContent key={social} value={social} className="space-y-4">
            <SocialChannelTab 
              platform={social}
              selectedCampaign={selectedCampaign}
              data={data}
              updateCampaignData={updateCampaignData}
            />
          </TabsContent>
        ))}

        {/* PAID ADS TAB */}
        <TabsContent value="paid-ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paid Ads Budget Tracking</CardTitle>
              <CardDescription>
                Link to overall campaign and track sub-campaigns within each platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    This links to your overall campaign <strong>{data.name || 'Q1 Product Launch Campaign'}</strong>. 
                    Select connected platform campaigns below to match different efforts within the same campaign.
                  </p>
                </div>
              </div>

              {paidAdCards.map((platform, index) => {
                const platformData = connectedAdPlatforms.find(p => p.platform === platform)
                const currentPaidAd = data.paidAds?.[platform as keyof typeof data.paidAds]
                
                return (
                  <Card key={`${platform}-${index}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm capitalize flex items-center gap-2">
                          {platform === 'googleAds' ? 'Google Ads' : platform === 'displayProgrammatic' ? 'Display/Programmatic' : platform}
                          <Badge variant="outline" className="text-xs">
                            Connected
                          </Badge>
                        </CardTitle>
                        {index >= 5 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPaidAdCards(paidAdCards.filter((_, i) => i !== index))}
                            data-testid={`button-remove-paid-card-${index}`}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Sub-Campaign Selector from Connected Platform */}
                      <div>
                        <Label className="text-xs mb-1 block flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          Platform Campaign Name (Sub-Campaign)
                        </Label>
                        <Select
                          value={currentPaidAd?.subCampaignName || ''}
                          onValueChange={(value) => updateCampaignData(selectedCampaign, {
                            paidAds: {
                              ...data.paidAds,
                              [platform]: { 
                                ...currentPaidAd, 
                                subCampaignName: value 
                              }
                            }
                          })}
                        >
                          <SelectTrigger data-testid={`select-paid-${platform}-subcampaign`}>
                            <SelectValue placeholder="Select platform campaign..." />
                          </SelectTrigger>
                          <SelectContent>
                            {platformData?.campaigns.map((campaign) => (
                              <SelectItem key={campaign} value={campaign}>
                                {campaign}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Auto-populated from your connected {platform === 'googleAds' ? 'Google Ads' : platform === 'displayProgrammatic' ? 'Display/Programmatic' : platform} account
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs mb-1 block">Start Date</Label>
                          <Input 
                            type="date" 
                            value={currentPaidAd?.startDate || ''}
                            onChange={(e) => updateCampaignData(selectedCampaign, {
                              paidAds: {
                                ...data.paidAds,
                                [platform]: { 
                                  ...currentPaidAd, 
                                  startDate: e.target.value 
                                }
                              }
                            })}
                            data-testid={`input-paid-${platform}-start`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">End Date</Label>
                          <Input 
                            type="date" 
                            value={currentPaidAd?.endDate || ''}
                            onChange={(e) => updateCampaignData(selectedCampaign, {
                              paidAds: {
                                ...data.paidAds,
                                [platform]: { 
                                  ...currentPaidAd, 
                                  endDate: e.target.value 
                                }
                              }
                            })}
                            data-testid={`input-paid-${platform}-end`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs mb-1 block">Daily Budget</Label>
                          <Input 
                            type="number" 
                            placeholder="$0"
                            value={currentPaidAd?.dailyBudget || ''}
                            onChange={(e) => updateCampaignData(selectedCampaign, {
                              paidAds: {
                                ...data.paidAds,
                                [platform]: { 
                                  ...currentPaidAd, 
                                  dailyBudget: parseFloat(e.target.value) 
                                }
                              }
                            })}
                            data-testid={`input-paid-${platform}-daily`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Campaign Budget</Label>
                          <Input 
                            type="number" 
                            placeholder="$0"
                            value={currentPaidAd?.campaignBudget || ''}
                            onChange={(e) => updateCampaignData(selectedCampaign, {
                              paidAds: {
                                ...data.paidAds,
                                [platform]: { 
                                  ...currentPaidAd, 
                                  campaignBudget: parseFloat(e.target.value) 
                                }
                              }
                            })}
                            data-testid={`input-paid-${platform}-campaign`}
                          />
                        </div>
                      </div>

                      {/* Attached Assets */}
                      {currentPaidAd?.assets && currentPaidAd.assets.length > 0 && (
                        <div>
                          <Label className="text-xs mb-1 block flex items-center gap-2">
                            <Paperclip className="w-3 h-3" />
                            Attached Assets
                          </Label>
                          <div className="space-y-2">
                            {currentPaidAd.assets.map((assetId: string) => {
                              const asset = mockAssets.find(a => a.id === assetId)
                              if (!asset) return null
                              return (
                                <div key={assetId} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                                  <Image className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs flex-1">{asset.name}</span>
                                  <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                                  <span className="text-xs text-muted-foreground">{asset.size}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowChannelSelector(true)}
                data-testid="button-add-paid-ad-card"
              >
                + Add More Paid Channel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Channel Selector Dialog */}
        {showChannelSelector && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowChannelSelector(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-xl z-50 w-96">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Select Paid Ad Channel</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose which platform to add to your campaign
                  </p>
                </div>
                
                <div>
                  <Label className="text-xs mb-2 block">Channel</Label>
                  <Select
                    value={selectedNewChannel}
                    onValueChange={setSelectedNewChannel}
                  >
                    <SelectTrigger data-testid="select-new-paid-channel">
                      <SelectValue placeholder="Select a channel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableChannels.map((channel) => (
                        <SelectItem key={channel.value} value={channel.value}>
                          {channel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowChannelSelector(false)}
                    data-testid="button-cancel-channel"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addPaidAdCard}
                    style={{ backgroundColor: FLIGHT_DECK_COLOR }}
                    data-testid="button-confirm-channel"
                  >
                    Add Channel
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* URL TRACKING TAB */}
        <TabsContent value="url-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>URL Tracking</CardTitle>
              <CardDescription>Auto-generated tracking URLs for all campaign links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-xs text-green-900 dark:text-green-100">
                    URLs are automatically generated and stored in Strategy Studio's URL Tracker
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(data.urlTracking?.urls || [
                  { label: 'Email CTA', url: 'https://example.com?utm_source=email&utm_campaign=q1-launch', channel: 'Email' },
                  { label: 'LinkedIn Post', url: 'https://example.com?utm_source=linkedin&utm_campaign=q1-launch', channel: 'LinkedIn' },
                  { label: 'Facebook Ad', url: 'https://example.com?utm_source=facebook&utm_campaign=q1-launch', channel: 'Facebook' }
                ]).map((urlItem, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-xs font-semibold">{urlItem.label}</Label>
                            <Badge variant="secondary" className="text-xs">{urlItem.channel}</Badge>
                          </div>
                          <Input 
                            value={urlItem.url} 
                            readOnly 
                            className="font-mono text-xs"
                            data-testid={`input-url-${i}`}
                          />
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(urlItem.url)}
                          data-testid={`button-copy-url-${i}`}
                        >
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Budget Insights Drawer */}
      {budgetInsightsOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setBudgetInsightsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl z-50 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-bold text-lg">Budget Insights</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Channel-specific risks & recommendations
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBudgetInsightsOpen(false)}
                  data-testid="button-close-budget-insights"
                >
                  ×
                </Button>
              </div>

              {/* Overall Campaign Budget */}
              <Card className="border-2" style={{ borderColor: FLIGHT_DECK_COLOR }}>
                <CardHeader>
                  <CardTitle className="text-sm">Campaign Budget Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Budget</span>
                    <span className="font-bold">${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Allocated to Channels</span>
                    <span className="font-semibold text-green-600">${(campaign.budget * 0.75).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Remaining</span>
                    <span className="font-semibold">${(campaign.budget * 0.25).toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </CardContent>
              </Card>

              {/* Email Channel Budget */}
              {campaign.channels.includes('email') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Channel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Budget Allocated</span>
                        <span className="font-semibold">$3,500</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Spent to Date</span>
                        <span className="font-semibold">$1,575</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Projected Total Spend</span>
                        <span className="font-semibold text-green-600">$3,200</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <p className="text-xs text-muted-foreground">45% of budget spent (12 of 30 days)</p>
                    </div>
                    
                    <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                            Projected to Underspend
                          </p>
                          <p className="text-xs text-green-800 dark:text-green-200 mb-2">
                            At current pace, you'll spend $3,200 of your $3,500 budget, leaving $300 unused.
                          </p>
                          <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                            • Consider adding 1-2 additional email sends ($150 each)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Optimization Opportunity
                          </p>
                          <p className="text-xs text-blue-800 dark:text-blue-200">
                            Segment your audience for better targeting or reallocate unused $300 to higher-performing channels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* LinkedIn Channel Budget */}
              {campaign.channels.includes('linkedin') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn Paid Ads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Campaign Budget</span>
                        <span className="font-semibold">$8,500</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Daily Budget</span>
                        <span className="font-semibold">$280/day</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Spent to Date</span>
                        <span className="font-semibold">$5,780</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Projected Total Spend</span>
                        <span className="font-semibold text-green-600">$8,400</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <p className="text-xs text-muted-foreground">68% of budget spent (21 of 30 days)</p>
                    </div>
                    
                    <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                            Healthy Pacing
                          </p>
                          <p className="text-xs text-green-800 dark:text-green-200 mb-2">
                            Daily spend is aligned with campaign duration. Projected to finish at $8,400 (98% of budget).
                          </p>
                          <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                            • Current daily budget of $280 is optimal for remaining 9 days
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Performance Insight
                          </p>
                          <p className="text-xs text-blue-800 dark:text-blue-200">
                            CPM is 18% lower than industry average. Consider increasing daily budget by $30-50 to maximize reach while costs are favorable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Facebook Channel Budget */}
              {campaign.channels.includes('facebook') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook Paid Ads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Campaign Budget</span>
                        <span className="font-semibold">$4,200</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Daily Budget</span>
                        <span className="font-semibold text-red-600">$175/day</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Spent to Date</span>
                        <span className="font-semibold">$3,528</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Projected Total Spend</span>
                        <span className="font-semibold text-red-600">$4,900</span>
                      </div>
                      <Progress value={84} className="h-2 bg-red-100" />
                      <p className="text-xs text-muted-foreground">84% of budget spent (20 of 30 days)</p>
                    </div>
                    
                    <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-red-900 dark:text-red-100 mb-1">
                            Projected to Overspend by $700 (16%)
                          </p>
                          <p className="text-xs text-red-800 dark:text-red-200 mb-2">
                            At current daily spend of $175, you'll exceed budget by end of campaign. Immediate action required.
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-red-900 dark:text-red-100">
                              • Reduce daily budget to $67 to stay within budget
                            </p>
                            <p className="text-xs font-semibold text-red-900 dark:text-red-100">
                              • OR allocate $700 from contingency fund
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Budget Adjustment Options
                          </p>
                          <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                            <p>1. Lower daily budget from $175 → $67 (maintains reach at lower intensity)</p>
                            <p>2. Pause lowest-performing ad sets to reduce spend</p>
                            <p>3. Use contingency budget if ROI justifies the overage</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contingency Budget */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2">
                <CardHeader>
                  <CardTitle className="text-sm">Contingency Buffer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Available</span>
                    <span className="font-bold">${(campaign.budget * 0.05).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5% of total budget reserved for unexpected opportunities or adjustments
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Request Budget Change Dialog */}
      <RequestBudgetChangeDialog
        open={showBudgetRequestDialog}
        onOpenChange={setShowBudgetRequestDialog}
        availableChannels={['Google Ads', 'LinkedIn Ads', 'Facebook Ads', 'Instagram Ads', 'Display/Programmatic', 'Twitter Ads']}
        channelBudgets={{
          'Google Ads': 15000,
          'LinkedIn Ads': 12000,
          'Facebook Ads': 8000,
          'Instagram Ads': 5000,
          'Display/Programmatic': 7000,
          'Twitter Ads': 3000,
        }}
        recommendationContext="Budget adjustment for paid ads campaign optimization"
        sourceFeature="flight-deck-distribution"
      />

      {/* Social Post Series Dialog */}
      <Dialog open={showSocialPostDialog} onOpenChange={setShowSocialPostDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Social Post Series</DialogTitle>
            <DialogDescription>
              Create multiple social posts with channel targeting and strategic anchoring
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {socialPosts.map((post, index) => (
              <Card key={post.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Post #{index + 1}</CardTitle>
                    {socialPosts.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSocialPosts(socialPosts.filter(p => p.id !== post.id))}
                        data-testid={`button-remove-post-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Channel</Label>
                      <Select
                        value={post.channel}
                        onValueChange={(val) => {
                          const updated = [...socialPosts]
                          updated[index].channel = val
                          setSocialPosts(updated)
                        }}
                      >
                        <SelectTrigger data-testid={`select-channel-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter/X</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Anchor to Pillar/Campaign</Label>
                      <Input
                        placeholder="e.g., Q1 Launch, Brand Awareness"
                        value={post.pillarOrCampaign}
                        onChange={(e) => {
                          const updated = [...socialPosts]
                          updated[index].pillarOrCampaign = e.target.value
                          setSocialPosts(updated)
                        }}
                        data-testid={`input-pillar-${index}`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Schedule Date</Label>
                      <Input
                        type="date"
                        value={post.scheduleDate}
                        onChange={(e) => {
                          const updated = [...socialPosts]
                          updated[index].scheduleDate = e.target.value
                          setSocialPosts(updated)
                        }}
                        data-testid={`input-date-${index}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Schedule Time</Label>
                      <Input
                        type="time"
                        value={post.scheduleTime}
                        onChange={(e) => {
                          const updated = [...socialPosts]
                          updated[index].scheduleTime = e.target.value
                          setSocialPosts(updated)
                        }}
                        data-testid={`input-time-${index}`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Content</Label>
                    <Textarea
                      placeholder="Write your social post content here..."
                      value={post.content}
                      onChange={(e) => {
                        const updated = [...socialPosts]
                        updated[index].content = e.target.value
                        setSocialPosts(updated)
                      }}
                      rows={4}
                      data-testid={`textarea-content-${index}`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.content.length} characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const newId = Math.max(...socialPosts.map(p => p.id)) + 1
                setSocialPosts([...socialPosts, {
                  id: newId,
                  content: '',
                  channel: 'linkedin',
                  pillarOrCampaign: '',
                  scheduleDate: '',
                  scheduleTime: ''
                }])
              }}
              data-testid="button-add-another-post"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Add Another Post
            </Button>
          </div>
          
          {/* Brand Tone Check - Graceful Degradation */}
          {showToneCheck && (
            <Card className={`border-2 ${
              !hasBrandTone 
                ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500' 
                : toneCheckScore >= 70 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-500' 
                  : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500'
            }`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!hasBrandTone ? (
                        <Info className="w-5 h-5 text-blue-600" />
                      ) : toneCheckScore >= 70 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {!hasBrandTone ? 'No Brand Tone Configured' : 'Quick Brand Tone Check'}
                          </span>
                          {hasBrandTone && (
                            <Badge variant={toneCheckScore >= 70 ? "default" : "secondary"}>
                              {toneCheckScore}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {!hasBrandTone 
                            ? 'Skipping tone check - ready to schedule!' 
                            : toneCheckScore >= 70 
                              ? 'Posts align with brand voice - ready to schedule!' 
                              : 'Minor tone adjustments recommended'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {!hasBrandTone ? (
                    <div className="text-xs bg-background p-2 rounded border">
                      <strong>Tip:</strong> Set up brand tone in BrandCraft to enable AI-powered consistency checks
                    </div>
                  ) : toneCheckScore < 70 && (
                    <div className="text-xs bg-background p-2 rounded border">
                      <strong>Quick Tips:</strong> Consider using more professional language and aligning with brand values.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowSocialPostDialog(false)
                setShowToneCheck(false)
                setSocialPosts([{ id: 1, content: '', channel: 'linkedin', pillarOrCampaign: '', scheduleDate: '', scheduleTime: '' }])
              }}
              data-testid="button-cancel-social-posts"
            >
              Cancel
            </Button>
            
            {!showToneCheck ? (
              <Button
                onClick={() => {
                  if (hasBrandTone) {
                    // Run quick brand tone check
                    const score = Math.floor(Math.random() * 26) + 70 // 70-95
                    setToneCheckScore(score)
                  }
                  setShowToneCheck(true)
                }}
                style={{ backgroundColor: FLIGHT_DECK_COLOR }}
                data-testid="button-check-and-schedule"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {hasBrandTone ? 'Check & Schedule' : 'Schedule Posts'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setShowSocialPostDialog(false)
                  setShowToneCheck(false)
                  alert(`${socialPosts.length} social posts scheduled successfully!`)
                  setSocialPosts([{ id: 1, content: '', channel: 'linkedin', pillarOrCampaign: '', scheduleDate: '', scheduleTime: '' }])
                }}
                style={{ backgroundColor: FLIGHT_DECK_COLOR }}
                data-testid="button-schedule-posts"
                disabled={hasBrandTone && toneCheckScore < 70}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {!hasBrandTone 
                  ? 'Schedule Posts' 
                  : toneCheckScore >= 70 
                    ? 'Schedule Posts' 
                    : 'Fix Tone Issues First'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* Social Channel Tab Component */
function SocialChannelTab({
  platform,
  selectedCampaign,
  data,
  updateCampaignData
}: {
  platform: string
  selectedCampaign: string
  data: any
  updateCampaignData: (id: string, data: any) => void
}) {
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({ 0: true })
  
  const limits = {
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
    tiktok: 2200
  }

  const limit = limits[platform as keyof typeof limits]
  
  // Support multiple posts per channel
  const posts = data.channels?.[platform]?.posts || [{ 
    content: '', 
    launchDate: '', 
    time: '09:00',
    assets: [] 
  }]

  const addNewPost = () => {
    // Auto-populate content from first post if it exists
    const firstPostContent = posts[0]?.content || ''
    const newPosts = [...posts, { 
      content: firstPostContent, // Copy content from first post
      launchDate: '', 
      time: '09:00', 
      assets: [] 
    }]
    updateCampaignData(selectedCampaign, {
      channels: {
        ...data.channels,
        [platform]: { posts: newPosts }
      }
    })
    setExpandedPosts({ ...expandedPosts, [newPosts.length - 1]: true })
  }

  const addAssetToPost = (postIndex: number, assetId: string) => {
    const currentAssets = posts[postIndex]?.assets || []
    if (!currentAssets.includes(assetId)) {
      updatePost(postIndex, { assets: [...currentAssets, assetId] })
    }
  }

  const removeAssetFromPost = (postIndex: number, assetId: string) => {
    const currentAssets = posts[postIndex]?.assets || []
    updatePost(postIndex, { assets: currentAssets.filter((id: string) => id !== assetId) })
  }

  const updatePost = (index: number, updates: any) => {
    const newPosts = [...posts]
    newPosts[index] = { ...newPosts[index], ...updates }
    updateCampaignData(selectedCampaign, {
      channels: {
        ...data.channels,
        [platform]: { posts: newPosts }
      }
    })
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any, index: number) => {
        const charCount = post.content?.length || 0
        const isExpanded = expandedPosts[index] !== false
        
        return (
          <Card key={index}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedPosts({ ...expandedPosts, [index]: !isExpanded })}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="capitalize text-base flex items-center gap-2">
                    {platform} Post {posts.length > 1 && `#${index + 1}`}
                    {post.launchDate && (
                      <Badge variant="outline" className="text-xs ml-2">
                        {post.launchDate} at {post.time}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isExpanded ? 'Click to collapse' : 'Click to expand'}
                  </CardDescription>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-2 block">Launch Date</Label>
                    <Input 
                      type="date" 
                      value={post.launchDate || ''}
                      onChange={(e) => updatePost(index, { launchDate: e.target.value })}
                      data-testid={`input-${platform}-launch-date-${index}`}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Launch Time</Label>
                    <Input 
                      type="time" 
                      value={post.time || '09:00'}
                      onChange={(e) => updatePost(index, { time: e.target.value })}
                      data-testid={`input-${platform}-launch-time-${index}`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Content</Label>
                    <span className={`text-xs ${charCount > limit ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                      {charCount} / {limit.toLocaleString()}
                    </span>
                  </div>
                  <Textarea 
                    rows={6}
                    placeholder={`Enter your ${platform} post content...`}
                    value={post.content || ''}
                    onChange={(e) => {
                      updatePost(index, { 
                        content: e.target.value
                      })
                    }}
                    data-testid={`textarea-${platform}-content-${index}`}
                  />
                  {charCount > limit && (
                    <p className="text-xs text-red-600 mt-1">
                      Character limit exceeded by {charCount - limit} characters
                    </p>
                  )}
                </div>

                {/* Assets Section */}
                <div>
                  <Label className="mb-2 block flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Assets
                  </Label>
                  
                  {/* Display Attached Assets */}
                  {post.assets && post.assets.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {post.assets.map((assetId: string) => {
                        const asset = mockAssets.find(a => a.id === assetId)
                        if (!asset) return null
                        return (
                          <div key={assetId} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                            <Image className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm flex-1">{asset.name}</span>
                            <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                            <span className="text-xs text-muted-foreground">{asset.size}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeAssetFromPost(index, assetId)
                              }}
                              className="h-6 w-6"
                              data-testid={`button-remove-asset-${index}-${assetId}`}
                            >
                              ×
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add Assets Button with Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        data-testid={`button-add-assets-${platform}-${index}`}
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Add Assets
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Select Assets</DialogTitle>
                        <DialogDescription>
                          Choose assets to attach to this {platform} post
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {mockAssets.map((asset) => {
                          const isSelected = post.assets?.includes(asset.id)
                          return (
                            <Card 
                              key={asset.id} 
                              className={`cursor-pointer hover-elevate ${isSelected ? 'border-primary' : ''}`}
                              onClick={() => {
                                if (isSelected) {
                                  removeAssetFromPost(index, asset.id)
                                } else {
                                  addAssetToPost(index, asset.id)
                                }
                              }}
                              data-testid={`asset-card-${asset.id}`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-md bg-muted">
                                    <Image className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{asset.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                                      <span className="text-xs text-muted-foreground">{asset.size}</span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button 
                  className="w-full"
                  data-testid={`button-schedule-${platform}-${index}`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule {platform} Post
                </Button>
              </CardContent>
            )}
          </Card>
        )
      })}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={addNewPost}
        data-testid={`button-add-${platform}-post`}
      >
        + Add Another {platform} Post
      </Button>
    </div>
  )
}

/* ========================================
   STEP 3: FLIGHT CHECK
   ======================================== */

function FlightCheckStep({
  campaigns,
  validationErrors,
  runFlightCheck,
  setCurrentStep
}: {
  campaigns: typeof mockCampaigns
  validationErrors: Record<string, string[]>
  runFlightCheck: () => void
  setCurrentStep: (step: DistributionStep) => void
}) {
  const allPassed = Object.keys(validationErrors).length === 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Flight Check</h2>
        <p className="text-muted-foreground">
          Validate all campaigns before launch
        </p>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Validation Checklist
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  All fields are filled
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  No missing assets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  No broken links or missing URLs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Emails have subject and preview text
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Character counts not exceeded (social)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Email has list or segment selected
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Paid ads have end dates and budgets
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={runFlightCheck}
        className="w-full"
        size="lg"
        data-testid="button-run-flight-check"
      >
        <Shield className="w-5 h-5 mr-2" />
        Run Flight Check
      </Button>

      {/* Validation Results */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-red-600">Validation Errors Found</h3>
            <Button 
              variant="outline"
              onClick={() => setCurrentStep('schedule-optimize')}
              data-testid="button-back-to-schedule"
            >
              Back to Schedule + Optimize
            </Button>
          </div>

          {campaigns.map(campaign => {
            const errors = validationErrors[campaign.id]
            if (!errors || errors.length === 0) return null

            return (
              <Card key={campaign.id} className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    {campaign.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {errors.map((error, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {allPassed && Object.keys(validationErrors).length === 0 && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Ready for takeoff!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Run the flight check to validate all campaigns
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* ========================================
   STEP 4: TAKE OFF
   ======================================== */

function TakeOffStep({
  campaigns,
  campaignData
}: {
  campaigns: typeof mockCampaigns
  campaignData: CampaignData
}) {
  const [manifestGenerated, setManifestGenerated] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Take Off</h2>
        <p className="text-muted-foreground">
          Launch campaigns individually or all at once
        </p>
      </div>

      {/* Flight Manifesto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
            Flight Manifesto
          </CardTitle>
          <CardDescription>
            Auto-generated launch summary (can also generate manually)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!manifestGenerated ? (
            <Button 
              onClick={() => setManifestGenerated(true)}
              className="w-full"
              data-testid="button-generate-manifest"
            >
              Generate Flight Manifesto
            </Button>
          ) : (
            <div className="p-4 rounded-md bg-muted space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Campaigns</span>
                <span className="text-sm">{campaigns.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Channels</span>
                <span className="text-sm">
                  {campaigns.reduce((sum, c) => sum + c.channels.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Budget</span>
                <span className="text-sm">
                  ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Assets</span>
                <span className="text-sm">
                  {campaigns.reduce((sum, c) => sum + c.assets, 0)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Launch Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Launch Campaigns</h3>
          <Button 
            size="lg"
            data-testid="button-launch-all"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Launch All Campaigns
          </Button>
        </div>

        {campaigns.map(campaign => {
          const StatusIcon = AVIATION_STATUS[campaign.status].icon
          
          return (
            <Card key={campaign.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <StatusIcon 
                          className="w-3 h-3" 
                          style={{ color: AVIATION_STATUS[campaign.status].color }} 
                        />
                        {AVIATION_STATUS[campaign.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{campaign.channels.length} channels</span>
                      <span>{campaign.assets} assets</span>
                      <span>${campaign.budget.toLocaleString()} budget</span>
                    </div>
                  </div>
                  <Button data-testid={`button-launch-${campaign.id}`}>
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
