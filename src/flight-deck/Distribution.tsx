"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Lightbulb, 
  ChevronRight, 
  Calendar, 
  Rocket, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Target, 
  ClipboardCheck, 
  Plane, 
  FileText,
  PlayCircle,
  PauseCircle,
  Upload,
  Settings,
  Shield,
  Activity,
  Link2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Info,
  Save
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { apiRequest, queryClient } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'

const FLIGHT_DECK_COLOR = '#1e40f2'

type DistributionStep = 'load' | 'optimize' | 'preflight' | 'takeoff' | 'flightboard'

type StepConfig = {
  id: DistributionStep
  label: string
  description: string
  icon: any
}

const DISTRIBUTION_STEPS: StepConfig[] = [
  { 
    id: 'load', 
    label: 'Load & Configure', 
    description: 'Import campaigns & programs',
    icon: Upload
  },
  { 
    id: 'optimize', 
    label: 'Optimize', 
    description: 'AI recommendations & budget',
    icon: TrendingUp
  },
  { 
    id: 'preflight', 
    label: 'Pre-Flight Check', 
    description: 'Validation & safety',
    icon: Shield
  },
  { 
    id: 'takeoff', 
    label: 'Take Off', 
    description: 'Flight manifest & launch',
    icon: Rocket
  },
  { 
    id: 'flightboard', 
    label: 'Flight Board', 
    description: 'Monitor live campaigns',
    icon: Activity
  },
]

// Aviation-themed status
export const AVIATION_STATUS = {
  not_launched: { label: 'Now Boarding', color: '#9ca3af', icon: ClipboardCheck },
  safety_checks: { label: 'Safety Checks', color: '#fbbf24', icon: Shield },
  taxiing: { label: 'Taxiing', color: '#60a5fa', icon: Plane },
  in_flight: { label: 'In Flight', color: '#10b981', icon: Rocket },
  landed: { label: 'Landed', color: '#6366f1', icon: CheckCircle2 },
}

/* ========================================
   RIGHT DRAWER - Context-Specific Info
   ======================================== */

function RightDrawerContent({ 
  currentStep, 
  selectedCampaignKey, 
  campaignChecks,
  campaignAutoChecks,
  setCampaignChecks,
  checklistItems,
}: { 
  currentStep: DistributionStep
  selectedCampaignKey: string | null
  campaignChecks?: Record<string, any>
  campaignAutoChecks?: Record<string, any>
  setCampaignChecks?: (value: any) => void
  checklistItems?: any[]
}) {
  const { data: distributionCards = [] } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards'],
  })

  const groupedCards = distributionCards.reduce((acc: any, card: any) => {
    const campaignKey = card.sourceCampaignId || card.campaignName || 'Unknown'
    if (!acc[campaignKey]) {
      acc[campaignKey] = {
        campaignName: card.campaignName,
        cards: [],
        totalBudget: 0,
      }
    }
    acc[campaignKey].cards.push(card)
    acc[campaignKey].totalBudget += card.cards?.reduce((sum: number, c: any) => sum + (c.budget || 0), 0) || 0
    return acc
  }, {})

  const selectedCampaign = selectedCampaignKey ? groupedCards[selectedCampaignKey] : null
  
  // Get checks for selected campaign (for Pre-Flight step)
  const selectedChecks = selectedCampaignKey && campaignChecks ? campaignChecks[selectedCampaignKey] : null
  const selectedAutoChecks = selectedCampaignKey && campaignAutoChecks ? campaignAutoChecks[selectedCampaignKey] : null
  const selectedCampaignComplete = selectedChecks ? Object.values(selectedChecks).every(Boolean) : false

  if (currentStep === 'optimize') {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: FLIGHT_DECK_COLOR }}>
            Campaign Insights
          </h3>
          <p className="text-xs text-muted-foreground">
            {selectedCampaign ? 'Budget, risks, and recommendations' : 'Click a campaign to view details'}
          </p>
        </div>

        {selectedCampaign ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Budget</span>
                  <span className="text-sm font-semibold">${selectedCampaign.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Channels</span>
                  <span className="text-sm font-semibold">{selectedCampaign.cards.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Assets</span>
                  <span className="text-sm font-semibold">
                    {selectedCampaign.cards.reduce((sum: number, c: any) => sum + (c.assetCount || 0), 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                  <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Budget Concentration</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    65% of budget allocated to a single channel
                  </p>
                </div>
                <div className="p-2 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                  <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Timeline Constraint</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Launch window overlaps with competitor event
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 rounded-md border border-l-2" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-medium">Increase LinkedIn Budget</p>
                    </div>
                    <Badge variant="outline" className="text-xs">High Impact</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    LinkedIn posts show 3x higher engagement than other channels. Consider reallocating 20% more budget.
                  </p>
                  <div className="flex items-center gap-2 mt-1 ml-5">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: FLIGHT_DECK_COLOR }} />
                    </div>
                    <span className="text-xs font-medium">85%</span>
                  </div>
                </div>
                <div className="p-2 rounded-md border border-l-2" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-medium">Adjust Launch Timing</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Medium Impact</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    Historical data suggests Tuesday-Thursday launches perform 40% better for B2B audiences.
                  </p>
                  <div className="flex items-center gap-2 mt-1 ml-5">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: FLIGHT_DECK_COLOR }} />
                    </div>
                    <span className="text-xs font-medium">72%</span>
                  </div>
                </div>
                <div className="p-2 rounded-md border border-l-2" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-medium">Add Email Channel</p>
                    </div>
                    <Badge variant="outline" className="text-xs">High Impact</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5">
                    Email complements LinkedIn well for executive audiences, with 2.5x ROI on similar campaigns.
                  </p>
                  <div className="flex items-center gap-2 mt-1 ml-5">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '78%', backgroundColor: FLIGHT_DECK_COLOR }} />
                    </div>
                    <span className="text-xs font-medium">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Info className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Select a campaign to view budget details, risks, and AI-powered recommendations
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (currentStep === 'preflight') {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: FLIGHT_DECK_COLOR }}>
            Safety Checklist
          </h3>
          <p className="text-xs text-muted-foreground">
            {selectedCampaignKey ? 'Campaign validation checks' : 'Select a campaign to run checks'}
          </p>
        </div>

        {selectedCampaignKey && selectedChecks && selectedAutoChecks ? (
          <Card className="border-l-4" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Pre-Flight Checks</CardTitle>
                <Badge variant={selectedCampaignComplete ? 'default' : 'destructive'} className="text-xs">
                  {Object.values(selectedChecks).filter(Boolean).length} / 5
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklistItems?.map((item: any) => {
                const autoStatus = selectedAutoChecks[item.id as keyof typeof selectedAutoChecks]
                const isChecked = selectedChecks[item.id as keyof typeof selectedChecks]
                
                return (
                  <div key={item.id} className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 pt-0.5">
                      {autoStatus === 'pass' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" data-testid={`auto-pass-${item.id}`} />
                      )}
                      {autoStatus === 'fail' && (
                        <AlertTriangle className="w-4 h-4 text-destructive" data-testid={`auto-fail-${item.id}`} />
                      )}
                      {autoStatus === 'pending' && (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" data-testid={`auto-pending-${item.id}`} />
                      )}
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (setCampaignChecks && selectedCampaignKey) {
                            setCampaignChecks((prev: Record<string, any>) => ({
                              ...prev,
                              [selectedCampaignKey]: {
                                ...prev[selectedCampaignKey],
                                [item.id]: checked
                              }
                            }))
                          }
                        }}
                        data-testid={`checkbox-${item.id}`}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs font-medium cursor-pointer">
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      {autoStatus !== 'pending' && (
                        <p className={`text-xs mt-1 ${autoStatus === 'pass' ? 'text-green-600' : 'text-destructive'}`}>
                          {autoStatus === 'pass' ? '✓ Auto-Validated' : '✗ Needs Fix'}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
              <div className="pt-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => {
                    // Navigate back to Optimize step
                    const event = new CustomEvent('navigate-to-optimize')
                    window.dispatchEvent(event)
                  }}
                  data-testid="button-back-to-optimization"
                >
                  Back to Optimization
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Info className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Click a campaign card to run pre-flight validation checks
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}

export default function Distribution() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<DistributionStep>('load')
  const [activeFlight, setActiveFlight] = useState<any>(null)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [selectedExecPrograms, setSelectedExecPrograms] = useState<string[]>([])
  
  // Search and toggle states for Load step
  const [campaignSearch, setCampaignSearch] = useState('')
  const [execProgramSearch, setExecProgramSearch] = useState('')
  const [showAllCampaigns, setShowAllCampaigns] = useState(false)
  const [showAllExecPrograms, setShowAllExecPrograms] = useState(false)
  
  // Right drawer - selected campaign for context-specific info
  const [selectedCampaignKey, setSelectedCampaignKey] = useState<string | null>(null)
  
  // Pre-Flight check state (shared between PreFlightStep and RightDrawerContent)
  const [campaignChecks, setCampaignChecks] = useState<Record<string, any>>({})
  const [campaignAutoChecks, setCampaignAutoChecks] = useState<Record<string, any>>({})
  
  // Workflow collapse state - open on 'load' step, closed on all others
  const workflowCollapsed = currentStep !== 'load'
  const [workflowExpanded, setWorkflowExpanded] = useState(true)

  // Sync workflow expansion with step changes
  useEffect(() => {
    setWorkflowExpanded(!workflowCollapsed)
  }, [workflowCollapsed])

  // Add event listener for "Back to Optimization" button in Pre-Flight checklist
  useEffect(() => {
    const handleNavigateToOptimize = () => {
      setCurrentStep('optimize')
    }
    
    window.addEventListener('navigate-to-optimize', handleNavigateToOptimize)
    
    return () => {
      window.removeEventListener('navigate-to-optimize', handleNavigateToOptimize)
    }
  }, [])

  // Fetch campaigns for Load step
  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery<any[]>({
    queryKey: ['/api/campaigns'],
  })

  // Fetch executives for Load step
  const { data: executives = [], isLoading: loadingExecutives } = useQuery<any[]>({
    queryKey: ['/api/executives'],
  })

  // Fetch active flight
  const { data: flights = [] } = useQuery<any[]>({
    queryKey: ['/api/distribution/flights'],
  })

  const currentFlight = flights[0] // For now, use the most recent flight

  // Create flight mutation
  const createFlightMutation = useMutation({
    mutationFn: async (flightData: any) => {
      return await apiRequest('POST', '/api/distribution/flights', flightData)
    },
    onSuccess: (newFlight) => {
      setActiveFlight(newFlight)
      queryClient.invalidateQueries({ queryKey: ['/api/distribution/flights'] })
      toast({
        title: 'Flight Created',
        description: 'Distribution flight session created successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create flight',
        variant: 'destructive',
      })
    },
  })

  const handleNextStep = () => {
    const currentIndex = DISTRIBUTION_STEPS.findIndex(s => s.id === currentStep)
    if (currentIndex < DISTRIBUTION_STEPS.length - 1) {
      setCurrentStep(DISTRIBUTION_STEPS[currentIndex + 1].id)
    }
  }

  const handlePrevStep = () => {
    const currentIndex = DISTRIBUTION_STEPS.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(DISTRIBUTION_STEPS[currentIndex - 1].id)
    }
  }

  const leftColumn = (
    <div className="space-y-2">
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-1" style={{ color: FLIGHT_DECK_COLOR }}>
          Distribution Workflow
        </h2>
        <p className="text-xs text-muted-foreground">
          5-step campaign deployment
        </p>
      </div>

      {DISTRIBUTION_STEPS.map((step, index) => {
        const isActive = currentStep === step.id
        const isPast = DISTRIBUTION_STEPS.findIndex(s => s.id === currentStep) > index
        const Icon = step.icon

        return (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`
              w-full text-left p-3 rounded-md transition-all
              ${isActive 
                ? 'bg-card border-l-4 shadow-sm' 
                : isPast
                  ? 'hover-elevate opacity-75'
                  : 'hover-elevate opacity-60'
              }
            `}
            style={{
              borderLeftColor: isActive ? FLIGHT_DECK_COLOR : 'transparent',
            }}
            data-testid={`button-step-${step.id}`}
          >
            <div className="flex items-start gap-3">
              <div 
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'text-white' : 'text-muted-foreground'
                }`}
                style={{
                  backgroundColor: isActive ? FLIGHT_DECK_COLOR : 'transparent',
                  border: isActive ? 'none' : '2px solid currentColor',
                }}
              >
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isActive ? '' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}

      {/* Quick Stats */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Flight Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Flights:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Channels:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Spend:</span>
            <span className="font-medium">$0</span>
          </div>
        </CardContent>
      </Card>

      {/* Aviation Status Legend */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Aviation Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(AVIATION_STATUS).map(([key, status]) => {
            const Icon = status.icon
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <Icon className="w-3.5 h-3.5" style={{ color: status.color }} />
                <span className="font-medium" style={{ color: status.color }}>
                  {status.label}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )

  const [sheetOpen, setSheetOpen] = useState(false)

  const centerColumn = (
    <div className="h-full flex flex-col">
      {/* Header with Help Button */}
      <div className="flex items-center justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSheetOpen(true)}
          data-testid="button-open-help"
        >
          <Info className="w-4 h-4 mr-2" />
          Workflow Guide
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {currentStep === 'load' && <LoadStep 
            campaigns={campaigns}
            executives={executives}
            selectedCampaigns={selectedCampaigns}
            setSelectedCampaigns={setSelectedCampaigns}
            selectedExecPrograms={selectedExecPrograms}
            setSelectedExecPrograms={setSelectedExecPrograms}
            onNext={handleNextStep}
          />}
          {currentStep === 'optimize' && <OptimizeStep 
            selectedCampaignKey={selectedCampaignKey}
            setSelectedCampaignKey={setSelectedCampaignKey}
            onNext={handleNextStep} 
            onPrev={handlePrevStep} 
          />}
          {currentStep === 'preflight' && <PreFlightStep 
            onNext={handleNextStep} 
            onPrev={handlePrevStep}
            selectedCampaignKey={selectedCampaignKey}
            setSelectedCampaignKey={setSelectedCampaignKey}
            campaignChecks={campaignChecks}
            setCampaignChecks={setCampaignChecks}
            campaignAutoChecks={campaignAutoChecks}
            setCampaignAutoChecks={setCampaignAutoChecks}
          />}
          {currentStep === 'takeoff' && <TakeOffStep onNext={handleNextStep} onPrev={handlePrevStep} />}
          {currentStep === 'flightboard' && <FlightBoardStep onPrev={handlePrevStep} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  // Determine if right drawer should be shown
  const showRightDrawer = currentStep === 'optimize' || currentStep === 'preflight'

  // Mobile step navigation
  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto sticky top-16 z-10">
      <div className="flex gap-2 min-w-max">
        {DISTRIBUTION_STEPS.map((step) => {
          const isActive = step.id === currentStep
          const Icon = step.icon
          const currentIndex = DISTRIBUTION_STEPS.findIndex(s => s.id === currentStep)
          const stepIndex = DISTRIBUTION_STEPS.findIndex(s => s.id === step.id)
          const isPast = stepIndex < currentIndex
          
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'text-white'
                  : isPast
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={isActive ? { backgroundColor: FLIGHT_DECK_COLOR } : {}}
              data-testid={`mobile-step-${step.id}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {step.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {mobileStepsNav}
      <div className="flex h-full overflow-hidden overflow-x-hidden">
        {/* Left Column - Step Navigation - Hidden on mobile */}
        <div className="hidden md:block w-64 border-r overflow-y-auto overflow-x-hidden bg-muted/20 p-4">
          {leftColumn}
        </div>

        {/* Center Column - Main Content */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden min-w-0 p-4 md:p-6`}>
          <div className="max-w-full overflow-x-hidden">
            {centerColumn}
          </div>
        </div>

        {/* Right Drawer - Context-Specific Info - Hidden on mobile */}
        {showRightDrawer && (
          <div className="hidden lg:block w-80 border-l overflow-y-auto overflow-x-hidden bg-muted/20 p-4">
            <RightDrawerContent 
              currentStep={currentStep} 
              selectedCampaignKey={selectedCampaignKey}
              campaignChecks={campaignChecks}
              campaignAutoChecks={campaignAutoChecks}
              setCampaignChecks={setCampaignChecks}
              checklistItems={[
                { id: 'budget', label: 'Budget', description: 'All budgets configured', severity: 'critical' },
                { id: 'brandVoice', label: 'Brand Voice', description: 'Content matches brand guidelines', severity: 'critical' },
                { id: 'assets', label: 'Assets', description: 'All assets attached', severity: 'critical' },
                { id: 'launchDate', label: 'Launch Date', description: 'Dates set and validated', severity: 'critical' },
                { id: 'trackingCodes', label: 'Tracking Codes', description: 'UTM codes generated', severity: 'critical' },
              ]}
            />
          </div>
        )}
      </div>

      {/* Coaching Prompts Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
              <div>
                <SheetTitle>Distribution Workflow Guide</SheetTitle>
                <SheetDescription>
                  Step-by-step guidance for campaign deployment
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <Card className="border-l-4" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">What to do:</p>
                  <p className="text-muted-foreground text-xs">
                    Follow the 5-step workflow to deploy campaigns across channels. Each step builds on the previous one to ensure quality and readiness.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Expected outcome:</p>
                  <p className="text-muted-foreground text-xs">
                    Campaigns launched with confidence, proper validation, and full tracking across all distribution channels.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Tip:</p>
                  <p className="text-muted-foreground text-xs">
                    Use the step navigation on the left to move between steps. Complete each step before proceeding to the next.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Workflow Steps</h3>
              {DISTRIBUTION_STEPS.map((step, index) => {
                const Icon = step.icon
                return (
                  <Card key={step.id} className={currentStep === step.id ? 'border-l-4' : ''} style={currentStep === step.id ? { borderLeftColor: FLIGHT_DECK_COLOR } : {}}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: currentStep === step.id ? FLIGHT_DECK_COLOR : 'transparent',
                            border: currentStep === step.id ? 'none' : '2px solid hsl(var(--border))',
                            color: currentStep === step.id ? 'white' : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{step.label}</CardTitle>
                          <CardDescription className="text-xs">{step.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

/* ========================================
   STEP 1: LOAD & CONFIGURE
   ======================================== */

function LoadStep({ 
  campaigns, 
  executives,
  selectedCampaigns, 
  setSelectedCampaigns,
  selectedExecPrograms,
  setSelectedExecPrograms,
  onNext 
}: any) {
  const { toast } = useToast()
  const [showLoaded, setShowLoaded] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [assetEditDialogOpen, setAssetEditDialogOpen] = useState(false)
  const [workflowCollapsed, setWorkflowCollapsed] = useState(false)
  const [showAllCampaigns, setShowAllCampaigns] = useState(false)
  const [showAllExecPrograms, setShowAllExecPrograms] = useState(false)
  const [campaignSearch, setCampaignSearch] = useState('')
  const [execProgramSearch, setExecProgramSearch] = useState('')

  // Fetch distribution cards (loaded campaigns)
  const { data: distributionCards = [], refetch: refetchCards } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards'],
    enabled: showLoaded,
  })

  // Fetch executive content to get program titles
  const { data: executiveContent = [] } = useQuery<any[]>({
    queryKey: ['/api/executive-content'],
  })

  // Load campaigns mutation
  const loadCampaignsMutation = useMutation({
    mutationFn: async () => {
      const promises = []
      if (selectedCampaigns.length > 0) {
        promises.push(apiRequest('POST', '/api/distribution/load-campaigns', { campaignIds: selectedCampaigns }))
      }
      if (selectedExecPrograms.length > 0) {
        promises.push(apiRequest('POST', '/api/distribution/load-executives', { executiveIds: selectedExecPrograms }))
      }
      const results = await Promise.all(promises)
      
      // Auto-generate tracking codes for all loaded cards
      const allCards = results.flat()
      const trackingPromises = allCards.map((card: any) => 
        apiRequest('POST', `/api/distribution/cards/${card.id}/generate-tracking`, {})
          .catch((err) => console.warn(`Failed to generate tracking for card ${card.id}:`, err))
      )
      await Promise.all(trackingPromises)
      
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/distribution/cards'] })
      toast({
        title: 'Loaded Successfully',
        description: `${selectedCampaigns.length} campaign(s) and ${selectedExecPrograms.length} exec program(s) loaded with tracking codes. Advancing to Optimize...`,
      })
      setShowLoaded(true)
      setSelectedCampaigns([])
      setSelectedExecPrograms([])
      refetchCards()
      
      // Auto-advance to Optimize step after short delay
      setTimeout(() => {
        onNext()
      }, 1000)
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load campaigns',
        variant: 'destructive',
      })
    },
  })

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PATCH', `/api/distribution/assets/${data.id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/distribution/cards'] })
      toast({
        title: 'Asset Updated',
        description: 'Asset dates and budget updated successfully.',
      })
      setAssetEditDialogOpen(false)
      setEditingAsset(null)
    },
  })

  const handleLoadCampaigns = async () => {
    if (selectedCampaigns.length === 0 && selectedExecPrograms.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select at least one campaign or executive program to load.',
        variant: 'destructive',
      })
      return
    }

    loadCampaignsMutation.mutate()
  }

  const handleSaveAsset = () => {
    if (editingAsset) {
      updateAssetMutation.mutate(editingAsset)
    }
  }

  // Group executive content by program title
  const execProgramsGrouped = executiveContent.reduce((acc: any, content: any) => {
    const programKey = content.programTitle || 'Untitled Program'
    if (!acc[programKey]) {
      acc[programKey] = {
        programTitle: content.programTitle,
        programType: content.programType,
        executiveId: content.executiveId,
        pieces: [],
      }
    }
    acc[programKey].pieces.push(content)
    return acc
  }, {})
  
  const execPrograms = Object.values(execProgramsGrouped)

  // Filter campaigns by search
  const filteredCampaigns = campaigns.filter((c: any) => 
    c.name.toLowerCase().includes(campaignSearch.toLowerCase())
  )

  // Filter exec programs by search
  const filteredExecPrograms = execPrograms.filter((p: any) => 
    p.programTitle.toLowerCase().includes(execProgramSearch.toLowerCase())
  )

  // Limit display to 5 unless expanded
  const displayedCampaigns = showAllCampaigns ? filteredCampaigns : filteredCampaigns.slice(0, 5)
  const displayedExecPrograms = showAllExecPrograms ? filteredExecPrograms : filteredExecPrograms.slice(0, 5)

  // Group cards by campaign
  const groupedCards = distributionCards.reduce((acc: any, card: any) => {
    const campaignId = card.sourceCampaignId || card.sourceExecutiveId || 'unknown'
    if (!acc[campaignId]) {
      acc[campaignId] = {
        campaignName: card.campaignName,
        cards: [],
        channelGroups: {},
      }
    }
    acc[campaignId].cards.push(card)
    
    // Group by unique channel names to avoid duplicate tabs
    const channelName = card.channelName
    if (!acc[campaignId].channelGroups[channelName]) {
      acc[campaignId].channelGroups[channelName] = []
    }
    acc[campaignId].channelGroups[channelName].push(card)
    
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Distribution</h1>
        <p className="text-muted-foreground">
          Load & Configure: Import campaigns from Campaign Builder or Executive Visibility programs to begin distribution.
        </p>
      </div>

      {/* Collapsible Distribution Workflow */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover-elevate"
          onClick={() => setWorkflowCollapsed(!workflowCollapsed)}
          data-testid="button-toggle-workflow"
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Distribution Workflow</CardTitle>
              <CardDescription>5-step campaign deployment</CardDescription>
            </div>
            {workflowCollapsed ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {!workflowCollapsed && (
          <CardContent>
            <Card className="border-l-4" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
                  <div>
                    <CardTitle className="text-sm">Load Campaigns</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">What to do:</p>
                  <p className="text-muted-foreground text-xs">
                    Select campaigns from Campaign Builder or Executive Visibility programs. The system will automatically create distribution cards and populate channel tabs with individual assets.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Expected outcome:</p>
                  <p className="text-muted-foreground text-xs">
                    Each selected campaign/program will be loaded with its channel placements and assets ready for optimization.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Tip:</p>
                  <p className="text-muted-foreground text-xs">
                    You can load multiple campaigns at once. Executive Visibility programs will be automatically integrated if they're part of a campaign.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        )}
      </Card>

      {/* Aviation Status (moved up when workflow is collapsed) */}
      {workflowCollapsed && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aviation Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(AVIATION_STATUS).map(([key, status]) => {
              const Icon = status.icon
              return (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <Icon className="w-3.5 h-3.5" style={{ color: status.color }} />
                  <span className="font-medium" style={{ color: status.color }}>
                    {status.label}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Side-by-Side Campaign and Exec Program Boxes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Campaign Builder Box */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-base">Campaigns</CardTitle>
              <Badge variant="outline">{filteredCampaigns.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
                className="pl-8"
                data-testid="input-search-campaigns"
              />
            </div>
          </CardHeader>
          <CardContent>
            {displayedCampaigns.length > 0 ? (
              <div className="space-y-2">
                {displayedCampaigns.map((campaign: any) => (
                  <div 
                    key={campaign.id}
                    className="flex items-start gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                    onClick={() => {
                      if (selectedCampaigns.includes(campaign.id)) {
                        setSelectedCampaigns(selectedCampaigns.filter((id: string) => id !== campaign.id))
                      } else {
                        setSelectedCampaigns([...selectedCampaigns, campaign.id])
                      }
                    }}
                    data-testid={`campaign-item-${campaign.id}`}
                  >
                    <Checkbox 
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id])
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter((id: string) => id !== campaign.id))
                        }
                      }}
                      data-testid={`checkbox-campaign-${campaign.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.goal}</p>
                      {campaign.estimatedBudget && (
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">${campaign.estimatedBudget}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredCampaigns.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCampaigns(!showAllCampaigns)}
                    className="w-full"
                    data-testid="button-toggle-campaigns"
                  >
                    {showAllCampaigns ? 'Show Less' : `Show All (${filteredCampaigns.length})`}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {campaignSearch ? 'No campaigns match your search' : 'No campaigns available'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Exec Program Box */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-base">Exec Programs</CardTitle>
              <Badge variant="outline">{filteredExecPrograms.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={execProgramSearch}
                onChange={(e) => setExecProgramSearch(e.target.value)}
                className="pl-8"
                data-testid="input-search-exec-programs"
              />
            </div>
          </CardHeader>
          <CardContent>
            {displayedExecPrograms.length > 0 ? (
              <div className="space-y-2">
                {displayedExecPrograms.map((program: any) => (
                  <div 
                    key={program.programTitle}
                    className="flex items-start gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                    onClick={() => {
                      if (selectedExecPrograms.includes(program.executiveId)) {
                        setSelectedExecPrograms(selectedExecPrograms.filter((id: string) => id !== program.executiveId))
                      } else {
                        setSelectedExecPrograms([...selectedExecPrograms, program.executiveId])
                      }
                    }}
                    data-testid={`exec-program-item-${program.programTitle}`}
                  >
                    <Checkbox 
                      checked={selectedExecPrograms.includes(program.executiveId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedExecPrograms([...selectedExecPrograms, program.executiveId])
                        } else {
                          setSelectedExecPrograms(selectedExecPrograms.filter((id: string) => id !== program.executiveId))
                        }
                      }}
                      data-testid={`checkbox-exec-${program.executiveId}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{program.programTitle}</p>
                      <p className="text-xs text-muted-foreground capitalize">{program.programType?.replace('_', ' ')}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {program.pieces.length} {program.pieces.length === 1 ? 'piece' : 'pieces'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredExecPrograms.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllExecPrograms(!showAllExecPrograms)}
                    className="w-full"
                    data-testid="button-toggle-exec-programs"
                  >
                    {showAllExecPrograms ? 'Show Less' : `Show All (${filteredExecPrograms.length})`}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {execProgramSearch ? 'No programs match your search' : 'No exec programs available'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {!showLoaded && (
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedCampaigns.length + selectedExecPrograms.length} selected
          </div>
          <Button 
            onClick={handleLoadCampaigns}
            disabled={selectedCampaigns.length === 0 && selectedExecPrograms.length === 0 || loadCampaignsMutation.isPending}
            data-testid="button-load-campaigns"
          >
            {loadCampaignsMutation.isPending ? 'Loading...' : 'Load'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Loaded Campaigns with Channel Tabs */}
      {showLoaded && distributionCards.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Loaded Campaigns</CardTitle>
              <CardDescription>
                {Object.keys(groupedCards).length} campaign(s) loaded with channel tabs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedCards).map(([campaignId, group]: [string, any]) => (
                <div key={campaignId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{group.campaignName}</h3>
                    <Badge variant="outline">{group.cards.length} channels</Badge>
                  </div>

                  {/* Channel Tabs + Tracking Tab */}
                  <Tabs defaultValue={Object.keys(group.channelGroups)[0] || 'tracking'} className="w-full">
                    <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                      {Object.entries(group.channelGroups).map(([channelName, channelCards]: [string, any]) => {
                        const totalAssets = channelCards.reduce((sum: number, card: any) => sum + (card.assetCount || 0), 0)
                        return (
                          <TabsTrigger 
                            key={channelName} 
                            value={channelName}
                            className="text-xs"
                            data-testid={`tab-${channelName}`}
                          >
                            {channelName}
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {totalAssets}
                            </Badge>
                          </TabsTrigger>
                        )
                      })}
                      <TabsTrigger 
                        value="tracking"
                        className="text-xs"
                        data-testid="tab-tracking"
                      >
                        Tracking
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(group.channelGroups).map(([channelName, channelCards]: [string, any]) => (
                      <TabsContent key={channelName} value={channelName} className="space-y-3 mt-4">
                        {channelCards.map((card: any) => (
                          <div key={card.id} className="mb-4">
                            <ChannelTabContent 
                              card={card}
                              setEditingAsset={setEditingAsset}
                              setAssetEditDialogOpen={setAssetEditDialogOpen}
                            />
                          </div>
                        ))}
                      </TabsContent>
                    ))}
                    
                    <TabsContent value="tracking" className="space-y-3 mt-4">
                      <TrackingTabContent campaignId={campaignId} campaignName={group.campaignName} />
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Continue to Next Step */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onNext} data-testid="button-continue-optimize">
              Continue to Optimize
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </>
      )}

      {/* Asset Edit Dialog */}
      <Dialog open={assetEditDialogOpen} onOpenChange={setAssetEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update launch date, end date, and budget for this asset
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Asset Name</Label>
              <Input
                value={editingAsset?.assetName || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, assetName: e.target.value })}
                data-testid="input-asset-name"
              />
            </div>
            <div>
              <Label>Launch Date</Label>
              <Input
                type="date"
                value={editingAsset?.launchDate || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, launchDate: e.target.value })}
                data-testid="input-launch-date"
              />
            </div>
            <div>
              <Label>End Date (Optional)</Label>
              <Input
                type="date"
                value={editingAsset?.endDate || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, endDate: e.target.value })}
                data-testid="input-end-date"
              />
            </div>
            <div>
              <Label>Budget ($)</Label>
              <Input
                type="number"
                value={editingAsset?.budget !== undefined && editingAsset?.budget !== null ? editingAsset.budget : (editingAsset?.estimatedSpend || '')}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value) || 0
                  setEditingAsset({ ...editingAsset, budget: value, estimatedSpend: value })
                }}
                data-testid="input-budget"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssetEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAsset}
              disabled={updateAssetMutation.isPending}
              data-testid="button-save-asset"
            >
              {updateAssetMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Channel Tab Content Component
function ChannelTabContent({ card, setEditingAsset, setAssetEditDialogOpen }: any) {
  const { data: assets = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards', card.id, 'assets'],
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading assets...</p>
  }

  const totalBudget = assets.reduce((sum: number, asset: any) => sum + (asset.estimatedSpend || 0), 0)

  return (
    <div className="space-y-4">
      {/* Channel Summary */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Assets:</span>
          <span className="font-medium">{assets.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Total Budget:</span>
          <span className="font-medium">${totalBudget}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Launch:</span>
          <span className="font-medium">{card.startDate || 'Not set'}</span>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="space-y-2">
        {assets.length > 0 ? (
          assets.map((asset: any, idx: number) => (
            <div 
              key={asset.id}
              className="flex items-start gap-3 p-3 rounded-md border hover-elevate"
              data-testid={`asset-card-${idx}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="font-medium truncate">{asset.assetName}</p>
                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                  <div>
                    <span>Budget: </span>
                    <span className="font-medium text-foreground">${asset.estimatedSpend || 0}</span>
                  </div>
                  <div>
                    <span>Launch: </span>
                    <span className="font-medium text-foreground">{asset.launchDate || 'Not set'}</span>
                  </div>
                  {asset.endDate && (
                    <div>
                      <span>End: </span>
                      <span className="font-medium text-foreground">{asset.endDate}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingAsset({
                    id: asset.id,
                    distributionCardId: card.id,
                    assetName: asset.assetName,
                    assetNumber: asset.assetNumber,
                    launchDate: asset.launchDate,
                    endDate: asset.endDate,
                    estimatedSpend: asset.estimatedSpend,
                  })
                  setAssetEditDialogOpen(true)
                }}
                data-testid={`button-edit-asset-${idx}`}
              >
                Edit
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No assets attached to this channel</p>
        )}
      </div>
    </div>
  )
}

// Tracking Tab Content Component
function TrackingTabContent({ campaignId, campaignName }: { campaignId: string; campaignName: string }) {
  const { data: trackingCodes = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/tracking-codes', { campaignId }],
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tracking codes...</p>
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Tracking Codes:</span>
          <span className="font-medium">{trackingCodes.length}</span>
        </div>
      </div>

      {/* UTM Tracking Codes Table */}
      {trackingCodes.length > 0 ? (
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-medium">Channel</th>
                <th className="text-left p-2 font-medium">Asset</th>
                <th className="text-left p-2 font-medium">UTM Source</th>
                <th className="text-left p-2 font-medium">UTM Medium</th>
                <th className="text-left p-2 font-medium">UTM Campaign</th>
                <th className="text-left p-2 font-medium">UTM Content</th>
                <th className="text-left p-2 font-medium">Tracking URL</th>
              </tr>
            </thead>
            <tbody>
              {trackingCodes.map((code: any) => (
                <tr key={code.id} className="border-t hover-elevate" data-testid={`tracking-code-${code.id}`}>
                  <td className="p-2">{code.channelName}</td>
                  <td className="p-2">{code.assetName}</td>
                  <td className="p-2 font-mono text-[10px]">{code.utmSource}</td>
                  <td className="p-2">{code.utmMedium}</td>
                  <td className="p-2 font-mono text-[10px]">{code.utmCampaign}</td>
                  <td className="p-2 font-mono text-[10px]">{code.utmContent || '-'}</td>
                  <td className="p-2">
                    <a 
                      href={code.destinationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-[10px]"
                      data-testid={`link-tracking-url-${code.id}`}
                    >
                      {code.destinationUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-3">No UTM tracking codes generated yet</p>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // TODO: Implement generate tracking codes for this campaign
              console.log('Generate tracking codes for campaign:', campaignId)
            }}
            data-testid="button-generate-tracking-codes"
          >
            Generate Tracking Codes
          </Button>
        </div>
      )}
    </div>
  )
}

/* ========================================
   STEP 2: OPTIMIZE
   ======================================== */

function OptimizeStep({ selectedCampaignKey, setSelectedCampaignKey, onNext, onPrev }: any) {
  const { toast } = useToast()
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [assetDialogOpen, setAssetDialogOpen] = useState(false)
  const [campaignAssets, setCampaignAssets] = useState<any>({})

  const { data: distributionCards = [] } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards'],
  })

  // Fetch assets for all distribution cards when they change
  useEffect(() => {
    const fetchAllAssets = async () => {
      const assetsMap: any = {}
      for (const card of distributionCards) {
        try {
          const response = await fetch(`/api/distribution/cards/${card.id}/assets`)
          const assets = await response.json()
          assetsMap[card.id] = assets
        } catch (error) {
          console.error(`Failed to fetch assets for card ${card.id}:`, error)
          assetsMap[card.id] = []
        }
      }
      setCampaignAssets(assetsMap)
    }

    if (distributionCards.length > 0) {
      fetchAllAssets()
    }
  }, [distributionCards])

  // Group cards by campaign
  const groupedCards = distributionCards.reduce((acc: any, card: any) => {
    const campaignKey = card.sourceCampaignId || card.campaignName || 'Unknown'
    if (!acc[campaignKey]) {
      acc[campaignKey] = {
        campaignName: card.campaignName,
        cards: [],
        totalBudget: 0,
        totalAssets: 0,
      }
    }
    acc[campaignKey].cards.push(card)
    acc[campaignKey].totalBudget += card.cards?.reduce((sum: number, c: any) => sum + (c.budget || 0), 0) || 0
    acc[campaignKey].totalAssets += card.assetCount || 0
    return acc
  }, {})

  // Group cards by channel within a campaign
  const groupCardsByChannel = (cards: any[]) => {
    const channelGroups: any = {}
    cards.forEach((card) => {
      const channelName = card.channelName || 'Unknown'
      if (!channelGroups[channelName]) {
        channelGroups[channelName] = []
      }
      channelGroups[channelName].push(card)
    })
    return channelGroups
  }

  const handleCampaignClick = (key: string, campaign: any) => {
    setSelectedCampaign({ key, ...campaign })
    setCampaignDialogOpen(true)
    setSelectedCampaignKey(key)
  }

  const handleAssetClick = (asset: any) => {
    setEditingAsset(asset)
    setAssetDialogOpen(true)
  }

  const updateAssetMutation = useMutation({
    mutationFn: async (assetData: any) => {
      const payload = {
        budget: assetData.budget !== undefined ? assetData.budget : null,
        launchDate: assetData.launchDate || null,
        endDate: assetData.endDate || null,
      }
      return await apiRequest('PATCH', `/api/distribution/assets/${assetData.id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/distribution/cards'] })
      setAssetDialogOpen(false)
      setEditingAsset(null)
      // Refetch assets to update the display
      const fetchAllAssets = async () => {
        const assetsMap: any = {}
        for (const card of distributionCards) {
          try {
            const response = await fetch(`/api/distribution/cards/${card.id}/assets`)
            const assets = await response.json()
            assetsMap[card.id] = assets
          } catch (error) {
            console.error(`Failed to fetch assets for card ${card.id}:`, error)
            assetsMap[card.id] = []
          }
        }
        setCampaignAssets(assetsMap)
      }
      fetchAllAssets()
    },
  })

  const handleSaveAsset = () => {
    if (editingAsset && editingAsset.id) {
      updateAssetMutation.mutate({
        id: editingAsset.id,
        budget: editingAsset.budget,
        launchDate: editingAsset.launchDate,
        endDate: editingAsset.endDate,
      })
    }
  }

  const recommendations = [
    {
      id: 'rec-1',
      type: 'budget',
      title: 'Increase LinkedIn Budget',
      description: 'LinkedIn posts show 3x higher engagement than other channels. Consider reallocating 20% more budget.',
      impact: 'High',
      confidence: 85,
    },
    {
      id: 'rec-2',
      type: 'timing',
      title: 'Adjust Launch Timing',
      description: 'Historical data suggests Tuesday-Thursday launches perform 40% better for B2B audiences.',
      impact: 'Medium',
      confidence: 72,
    },
    {
      id: 'rec-3',
      type: 'channel',
      title: 'Add Email Channel',
      description: 'Email complements LinkedIn well for executive audiences, with 2.5x ROI on similar campaigns.',
      impact: 'High',
      confidence: 78,
    },
  ]

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Optimize</h1>
          <p className="text-muted-foreground">
            Click a campaign to optimize budget and timing across channels.
          </p>
        </div>

        <Card className="border-l-4" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
              <div>
                <CardTitle className="text-sm">Quick Optimization</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">What to do:</p>
              <p className="text-muted-foreground text-xs">
                Click any campaign below to adjust budgets and dates for each channel's activities. Changes are saved automatically.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Tip:</p>
              <p className="text-muted-foreground text-xs">
                Review the budget breakdown in the right panel. Click individual activities to fine-tune start/end dates and budgets.
              </p>
            </div>
          </CardContent>
        </Card>

        {distributionCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(groupedCards).map(([key, group]: [string, any]) => (
              <Card 
                key={key} 
                className={`cursor-pointer hover-elevate active-elevate-2 relative ${
                  selectedCampaignKey === key ? 'border-2' : ''
                }`}
                style={selectedCampaignKey === key ? { borderColor: FLIGHT_DECK_COLOR } : {}}
                onClick={() => handleCampaignClick(key, group)}
                data-testid={`campaign-card-${key}`}
              >
                <div 
                  className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-background"
                  style={{
                    borderColor: selectedCampaignKey === key ? FLIGHT_DECK_COLOR : 'hsl(var(--border))',
                    backgroundColor: selectedCampaignKey === key ? FLIGHT_DECK_COLOR : 'transparent',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCampaignKey(selectedCampaignKey === key ? null : key)
                  }}
                  data-testid={`checkbox-campaign-${key}`}
                >
                  {selectedCampaignKey === key && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-base pr-8">{group.campaignName}</CardTitle>
                  <CardDescription>
                    {group.cards.length} channel(s) • {group.totalAssets} assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                    <div className="text-lg font-semibold">${group.totalBudget.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No campaigns loaded. Return to Load step to select campaigns.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onPrev} data-testid="button-prev-step">
            Back
          </Button>
          <Button onClick={onNext} data-testid="button-next-step">
            Continue to Pre-Flight
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Campaign Details Dialog */}
      <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle>{selectedCampaign?.campaignName}</DialogTitle>
                <DialogDescription>
                  Optimize budgets and timing for each channel and activity
                </DialogDescription>
              </div>
              <Button 
                size="sm" 
                onClick={async () => {
                  // Invalidate queries to refetch fresh data
                  await queryClient.invalidateQueries({ queryKey: ['/api/distribution/cards'] })
                  
                  // Refetch all assets to show latest data
                  const assetsMap: any = {}
                  for (const card of distributionCards) {
                    try {
                      const response = await fetch(`/api/distribution/cards/${card.id}/assets`)
                      const assets = await response.json()
                      assetsMap[card.id] = assets
                    } catch (error) {
                      console.error(`Failed to fetch assets for card ${card.id}:`, error)
                      assetsMap[card.id] = []
                    }
                  }
                  setCampaignAssets(assetsMap)
                  
                  toast({
                    title: 'Changes Saved',
                    description: 'All budget and date changes have been saved.',
                  })
                }}
                data-testid="button-save-all"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </DialogHeader>
          
          {selectedCampaign && (
            <Tabs defaultValue={Object.keys(groupCardsByChannel(selectedCampaign.cards))[0]} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="flex-wrap h-auto gap-1 mb-4">
                {Object.entries(groupCardsByChannel(selectedCampaign.cards)).map(([channelName, cards]: [string, any]) => (
                  <TabsTrigger 
                    key={channelName} 
                    value={channelName}
                    data-testid={`tab-${channelName}`}
                  >
                    {channelName}
                    <Badge variant="secondary" className="ml-2">
                      {(cards as any[]).reduce((sum, c) => sum + (c.assetCount || 0), 0)}
                    </Badge>
                  </TabsTrigger>
                ))}
                <TabsTrigger 
                  value="tracking"
                  data-testid="tab-tracking"
                >
                  Tracking URLs
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                {Object.entries(groupCardsByChannel(selectedCampaign.cards)).map(([channelName, cards]: [string, any]) => (
                  <TabsContent key={channelName} value={channelName} className="mt-0">
                    <div className="grid grid-cols-3 gap-3 auto-rows-auto">
                      {(cards as any[]).flatMap(card => {
                        const assets = campaignAssets[card.id] || []
                        return assets.map((asset: any, idx: number) => (
                          <motion.div key={`${card.id}-${idx}`} whileHover={{ scale: 1.03 }}>
                            <Card
                              className="cursor-pointer hover-elevate flex flex-col justify-between p-4 min-h-[7rem]"
                              onClick={() => handleAssetClick({ ...asset, cardId: card.id, channelName })}
                              data-testid={`activity-card-${asset.assetName}`}
                            >
                              <div>
                                <p className="font-medium text-sm mb-1 line-clamp-2">{asset.assetName || 'Untitled Asset'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {asset.budget ? `$${asset.budget.toLocaleString()}` : 'No budget set'}
                                </p>
                                {asset.launchDate && (
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(asset.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {asset.endDate && ` - ${new Date(asset.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                  </p>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))
                      })}
                    </div>
                  </TabsContent>
                ))}
                
                <TabsContent value="tracking" className="mt-0">
                  <TrackingTabContent 
                    campaignId={selectedCampaign.key} 
                    campaignName={selectedCampaign.campaignName} 
                  />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Asset Edit Dialog */}
      <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAsset?.assetName || 'Edit Activity'}</DialogTitle>
            <DialogDescription>
              Update budget, start date, and end date
            </DialogDescription>
          </DialogHeader>
          
          {editingAsset && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Budget ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={editingAsset.budget !== undefined && editingAsset.budget !== null ? editingAsset.budget : ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : parseInt(e.target.value) || 0
                    setEditingAsset({ ...editingAsset, budget: value })
                  }}
                  data-testid="input-budget"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Start Date</Label>
                <Input
                  type="date"
                  value={editingAsset.launchDate || ''}
                  onChange={(e) => {
                    const newStartDate = e.target.value
                    setEditingAsset({ 
                      ...editingAsset, 
                      launchDate: newStartDate,
                      // Default end date to start date if end date is empty
                      endDate: editingAsset.endDate || newStartDate
                    })
                  }}
                  data-testid="input-start-date"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-1.5 block">End Date (Optional)</Label>
                <Input
                  type="date"
                  value={editingAsset.endDate || ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, endDate: e.target.value })}
                  data-testid="input-end-date"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAsset} data-testid="button-save-activity">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ========================================
   STEP 3: PRE-FLIGHT CHECK
   ======================================== */

function PreFlightStep({ 
  onNext, 
  onPrev,
  selectedCampaignKey,
  setSelectedCampaignKey,
  campaignChecks,
  setCampaignChecks,
  campaignAutoChecks,
  setCampaignAutoChecks,
}: {
  onNext: () => void
  onPrev: () => void
  selectedCampaignKey: string | null
  setSelectedCampaignKey: (key: string | null) => void
  campaignChecks: Record<string, any>
  setCampaignChecks: (value: any) => void
  campaignAutoChecks: Record<string, any>
  setCampaignAutoChecks: (value: any) => void
}) {

  const { data: distributionCards = [] } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards'],
  })
  
  const { data: trackingCodes = [] } = useQuery<any[]>({
    queryKey: ['/api/tracking-codes'],
  })

  const groupedCards = distributionCards.reduce((acc: any, card: any) => {
    const campaignKey = card.sourceCampaignId || card.campaignName || 'Unknown'
    if (!acc[campaignKey]) {
      acc[campaignKey] = {
        campaignName: card.campaignName,
        cards: [],
        totalBudget: 0,
        assetCount: 0,
      }
    }
    acc[campaignKey].cards.push(card)
    acc[campaignKey].totalBudget += card.cards?.reduce((sum: number, c: any) => sum + (c.budget || 0), 0) || 0
    acc[campaignKey].assetCount += card.assetCount || 0
    return acc
  }, {})
  
  // Run checks for a specific campaign
  const runCampaignChecks = (campaignKey: string, campaignData: any) => {
    const budget = campaignData.totalBudget || 0
    const assets = campaignData.assetCount || 0
    const campaignTrackingCodes = trackingCodes.filter((tc: any) => 
      campaignData.cards.some((card: any) => card.id === tc.distributionCardId)
    )
    
    const newAutoChecks = {
      budget: budget > 0 ? 'pass' : 'fail',
      assets: assets > 0 ? 'pass' : 'fail',
      launchDate: campaignData.cards.length > 0 ? 'pass' : 'pending',
      trackingCodes: campaignTrackingCodes.length > 0 ? 'pass' : 'fail',
      brandVoice: 'pending', // Always needs manual review
    }
    
    setCampaignAutoChecks((prev: Record<string, any>) => ({
      ...prev,
      [campaignKey]: newAutoChecks
    }))
    
    // Auto-check boxes when validation passes
    const newChecks = {
      budget: newAutoChecks.budget === 'pass',
      assets: newAutoChecks.assets === 'pass',
      launchDate: newAutoChecks.launchDate === 'pass',
      trackingCodes: newAutoChecks.trackingCodes === 'pass',
      brandVoice: false, // Always needs manual review
    }
    
    setCampaignChecks((prev: Record<string, any>) => ({
      ...prev,
      [campaignKey]: newChecks
    }))
  }

  const checklistItems = [
    {
      id: 'budget',
      label: 'Budget',
      description: 'All budgets configured',
      severity: 'critical',
    },
    {
      id: 'brandVoice',
      label: 'Brand Voice',
      description: 'Content matches brand guidelines',
      severity: 'critical',
    },
    {
      id: 'assets',
      label: 'Assets',
      description: 'All assets attached',
      severity: 'critical',
    },
    {
      id: 'launchDate',
      label: 'Launch Date',
      description: 'Dates set and validated',
      severity: 'critical',
    },
    {
      id: 'trackingCodes',
      label: 'Tracking Codes',
      description: 'UTM codes generated',
      severity: 'critical',
    },
  ]

  const criticalChecks = checklistItems.filter(item => item.severity === 'critical')
  
  // Get checks for selected campaign
  const selectedChecks = selectedCampaignKey ? campaignChecks[selectedCampaignKey] : null
  const selectedAutoChecks = selectedCampaignKey ? campaignAutoChecks[selectedCampaignKey] : null
  
  // Check if selected campaign is fully validated
  const selectedCampaignComplete = selectedChecks ? Object.values(selectedChecks).every(Boolean) : false
  
  // Check if all campaigns are fully validated
  const allCampaignsComplete = Object.keys(groupedCards).length > 0 && 
    Object.keys(groupedCards).every(key => {
      const checks = campaignChecks[key]
      return checks && Object.values(checks).every(Boolean)
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pre-Flight Check</h1>
        <p className="text-muted-foreground">
          Validation and safety checks before launch.
        </p>
      </div>

      {Object.keys(groupedCards).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Validation</CardTitle>
            <CardDescription>
              Click a campaign to run pre-flight checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(groupedCards).map(([key, group]: [string, any]) => {
                const campaignComplete = campaignChecks[key] && Object.values(campaignChecks[key]).every(Boolean)
                const isSelected = selectedCampaignKey === key
                
                return (
                  <div 
                    key={key} 
                    className={`p-3 rounded-md border cursor-pointer hover-elevate ${isSelected ? 'border-primary' : ''}`}
                    onClick={() => {
                      setSelectedCampaignKey(key)
                      runCampaignChecks(key, group)
                    }}
                    data-testid={`campaign-card-${key}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{group.campaignName}</h4>
                        {campaignComplete && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" data-testid={`campaign-complete-${key}`} />
                        )}
                      </div>
                      <Badge variant="outline">{group.cards.length} channels</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Total Budget: ${group.totalBudget.toLocaleString()}</div>
                      <div>Assets: {group.assetCount}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onPrev} data-testid="button-prev-step">
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!allCampaignsComplete}
          data-testid="button-next-step"
        >
          Continue to Take Off
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

/* ========================================
   STEP 4: TAKE OFF
   ======================================== */

function TakeOffStep({ onNext, onPrev }: any) {
  const { toast } = useToast()
  const [manifestGenerated, setManifestGenerated] = useState(false)
  const [manifestData, setManifestData] = useState<any>(null)

  const { data: distributionCards = [] } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards'],
  })

  // Group cards by campaign
  const groupedCampaigns = distributionCards.reduce((acc: any, card: any) => {
    const campaignKey = card.sourceCampaignId || card.campaignName || 'Unknown'
    if (!acc[campaignKey]) {
      acc[campaignKey] = {
        campaignName: card.campaignName,
        cards: [],
        totalBudget: 0,
        totalAssets: 0,
        channels: new Set(),
      }
    }
    acc[campaignKey].cards.push(card)
    acc[campaignKey].totalBudget += card.cards?.reduce((sum: number, c: any) => sum + (c.budget || 0), 0) || 0
    acc[campaignKey].totalAssets += card.assetCount || 0
    card.cards?.forEach((c: any) => {
      if (c.channel) acc[campaignKey].channels.add(c.channel)
    })
    return acc
  }, {})

  const launchFlightMutation = useMutation({
    mutationFn: async (manifestData: any) => {
      return await apiRequest('POST', '/api/distribution/launch', { manifest: manifestData })
    },
    onSuccess: () => {
      toast({
        title: 'Campaigns Launched!',
        description: 'All campaigns have been launched with Flight Manifest attached.',
      })
      onNext()
    },
    onError: (error: any) => {
      toast({
        title: 'Launch Failed',
        description: error.message || 'Failed to launch campaigns',
        variant: 'destructive',
      })
    },
  })

  const handleGenerateManifest = () => {
    const manifest = {
      generatedAt: new Date().toISOString(),
      campaigns: Object.entries(groupedCampaigns).map(([key, group]: [string, any]) => ({
        campaignName: group.campaignName,
        channels: Array.from(group.channels),
        totalBudget: group.totalBudget,
        totalAssets: group.totalAssets,
        readinessScore: 95, // Mock score
        riskLevel: 'low',
        launchDate: new Date().toISOString(),
      })),
      totalCampaigns: Object.keys(groupedCampaigns).length,
      totalChannels: new Set(Object.values(groupedCampaigns).flatMap((g: any) => Array.from(g.channels))).size,
      totalBudget: Object.values(groupedCampaigns).reduce((sum: number, g: any) => sum + g.totalBudget, 0),
      totalAssets: Object.values(groupedCampaigns).reduce((sum: number, g: any) => sum + g.totalAssets, 0),
    }
    
    setManifestData(manifest)
    setManifestGenerated(true)
    
    toast({
      title: 'Manifest Generated',
      description: 'Flight Manifest created successfully. Review and launch when ready.',
    })
  }

  const handleLaunch = () => {
    if (manifestData) {
      launchFlightMutation.mutate(manifestData)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Take Off</h1>
        <p className="text-muted-foreground">
          Generate Flight Manifest and launch campaigns.
        </p>
      </div>

      <Card className="border-l-4" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
            <div>
              <CardTitle className="text-sm">Flight Manifest</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">What to do:</p>
            <p className="text-muted-foreground text-xs">
              Review the Flight Manifest showing all campaigns, channels, and launch dates. Confirm and launch all campaigns or individually.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Expected outcome:</p>
            <p className="text-muted-foreground text-xs">
              Campaigns launched to all channels with full tracking enabled and calendar updates applied.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Tip:</p>
            <p className="text-muted-foreground text-xs">
              The Flight Manifest is permanently attached to each campaign for future reference and compliance.
            </p>
          </div>
        </CardContent>
      </Card>

      {!manifestGenerated ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate Flight Manifest</CardTitle>
            <CardDescription>Create comprehensive launch documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-md border bg-muted/50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Campaigns Ready:</p>
                  <p className="font-semibold text-lg">{Object.keys(groupedCampaigns).length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Channels:</p>
                  <p className="font-semibold text-lg">
                    {new Set(Object.values(groupedCampaigns).flatMap((g: any) => Array.from(g.channels))).size}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleGenerateManifest}
              className="w-full"
              data-testid="button-generate-manifest"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Flight Manifest
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Flight Manifest</CardTitle>
                <CardDescription>
                  Generated {new Date(manifestData.generatedAt).toLocaleString()}
                </CardDescription>
              </div>
              <Badge variant="default">Ready for Launch</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-md border bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">Total Campaigns</p>
                <p className="text-lg font-semibold">{manifestData.totalCampaigns}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Channels</p>
                <p className="text-lg font-semibold">{manifestData.totalChannels}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="text-lg font-semibold">${manifestData.totalBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Assets</p>
                <p className="text-lg font-semibold">{manifestData.totalAssets}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Campaign Breakdown</h4>
              {manifestData.campaigns.map((campaign: any, index: number) => (
                <div key={index} className="p-3 rounded-md border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{campaign.campaignName}</h5>
                    <Badge variant="outline" className="text-xs">
                      {campaign.channels.length} channels
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>Budget: ${campaign.totalBudget.toLocaleString()}</div>
                    <div>Assets: {campaign.totalAssets}</div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      Ready
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onPrev} data-testid="button-prev-step">
          Back
        </Button>
        <Button 
          onClick={handleLaunch}
          disabled={!manifestGenerated || launchFlightMutation.isPending}
          data-testid="button-launch-campaigns"
        >
          {launchFlightMutation.isPending ? 'Launching...' : 'Launch Campaigns'}
          <Rocket className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

/* ========================================
   STEP 5: FLIGHT BOARD
   ======================================== */

function FlightBoardStep({ onPrev }: any) {
  const { data: distributionCards = [] } = useQuery<any[]>({
    queryKey: ['/api/distribution/cards'],
  })

  // Group cards by campaign
  const groupedCampaigns = distributionCards.reduce((acc: any, card: any) => {
    const campaignKey = card.sourceCampaignId || card.campaignName || 'Unknown'
    if (!acc[campaignKey]) {
      acc[campaignKey] = {
        campaignName: card.campaignName,
        cards: [],
        totalBudget: 0,
        totalAssets: 0,
        channels: new Set(),
        // Assign aviation status based on campaign index (for demo purposes)
        status: 'in_flight',
      }
    }
    acc[campaignKey].cards.push(card)
    acc[campaignKey].totalBudget += card.cards?.reduce((sum: number, c: any) => sum + (c.budget || 0), 0) || 0
    acc[campaignKey].totalAssets += card.assetCount || 0
    card.cards?.forEach((c: any) => {
      if (c.channel) acc[campaignKey].channels.add(c.channel)
    })
    return acc
  }, {})

  // Assign different statuses to campaigns for demo
  const campaignsWithStatus = Object.entries(groupedCampaigns).map(([key, campaign]: [string, any], index: number) => {
    const statuses = ['in_flight', 'taxiing', 'safety_checks', 'landed', 'not_launched']
    const statusKey = statuses[index % statuses.length] as keyof typeof AVIATION_STATUS
    return {
      key,
      ...campaign,
      channels: Array.from(campaign.channels),
      status: statusKey,
      launchDate: new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000)).toISOString(), // Stagger dates
      performance: {
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 5000) + 500,
        conversions: Math.floor(Math.random() * 500) + 50,
        spend: Math.floor(campaign.totalBudget * (Math.random() * 0.3 + 0.4)), // 40-70% of budget
      }
    }
  })

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const filteredCampaigns = statusFilter === 'all' 
    ? campaignsWithStatus 
    : campaignsWithStatus.filter(c => c.status === statusFilter)

  // Summary stats
  const totalInFlight = campaignsWithStatus.filter(c => c.status === 'in_flight').length
  const totalTaxiing = campaignsWithStatus.filter(c => c.status === 'taxiing').length
  const totalLanded = campaignsWithStatus.filter(c => c.status === 'landed').length
  const totalBudget = campaignsWithStatus.reduce((sum, c) => sum + c.totalBudget, 0)
  const totalSpend = campaignsWithStatus.reduce((sum, c) => sum + c.performance.spend, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Flight Board</h1>
        <p className="text-muted-foreground">
          Monitor live campaigns and track performance.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">In Flight</p>
              <p className="text-2xl font-bold">{totalInFlight}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Taxiing</p>
              <p className="text-2xl font-bold">{totalTaxiing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Landed</p>
              <p className="text-2xl font-bold">{totalLanded}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Budget Used</p>
              <p className="text-2xl font-bold">{Math.round((totalSpend / totalBudget) * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium mr-2">Status:</p>
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
              data-testid="filter-all"
            >
              All
            </Button>
            {Object.entries(AVIATION_STATUS).map(([key, value]) => (
              <Button
                key={key}
                variant={statusFilter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(key)}
                data-testid={`filter-${key}`}
              >
                {value.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} campaign(s) • Real-time monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <div className="space-y-3">
              {filteredCampaigns.map((campaign) => {
                const statusInfo = AVIATION_STATUS[campaign.status as keyof typeof AVIATION_STATUS]
                const StatusIcon = statusInfo.icon
                const ctr = ((campaign.performance.clicks / campaign.performance.impressions) * 100).toFixed(2)
                const conversionRate = ((campaign.performance.conversions / campaign.performance.clicks) * 100).toFixed(2)
                
                return (
                  <div key={campaign.key} className="p-4 rounded-md border hover-elevate">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm">{campaign.campaignName}</h3>
                          <Badge 
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: statusInfo.color, color: statusInfo.color }}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{campaign.channels.length} channels</span>
                          <span>•</span>
                          <span>Launched {new Date(campaign.launchDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-semibold">${campaign.totalBudget.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-5 gap-3 p-3 rounded-md bg-muted/30">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Impressions</p>
                        <p className="text-sm font-semibold">{campaign.performance.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                        <p className="text-sm font-semibold">{campaign.performance.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">CTR</p>
                        <p className="text-sm font-semibold">{ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                        <p className="text-sm font-semibold">{campaign.performance.conversions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Spend</p>
                        <p className="text-sm font-semibold">${campaign.performance.spend.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Budget Used</span>
                        <span>{Math.round((campaign.performance.spend / campaign.totalBudget) * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full transition-all" 
                          style={{ 
                            width: `${Math.min((campaign.performance.spend / campaign.totalBudget) * 100, 100)}%`,
                            backgroundColor: statusInfo.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No campaigns match the selected filter.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onPrev} data-testid="button-prev-step">
          Back
        </Button>
        <Button variant="outline" data-testid="button-new-flight">
          Start New Flight
        </Button>
      </div>
    </div>
  )
}
