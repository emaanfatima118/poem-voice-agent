import { useState } from 'react'
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout'
import { Card, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Progress } from '@/stackwise-demo/components/ui/progress'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { RequestBudgetChangeDialog } from '@/stackwise-demo/components/RequestBudgetChangeDialog'
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const FLIGHT_DECK_COLOR = '#1e40f2'

const steps = [
  { id: 'overview', label: 'Overview', description: 'Budget status and alerts' },
  { id: 'channel-details', label: 'Channel Details', description: 'Deep dive by channel' },
  { id: 'audit-trail', label: 'Audit Trail', description: 'Change history' },
]

// Mock data for demo
const mockBudgetData = {
  currentMonth: {
    month: 'November 2025',
    monthCode: '2025-11',
    totalBudget: 50000,
    totalSpent: 32500,
    totalCommitted: 12000,
    totalAvailable: 5500,
    contingencyRemaining: 5000,
    contingencyTotal: 10000,
    daysRemaining: 12,
    daysInMonth: 30,
  },
  channels: [
    { 
      name: 'Google Ads', 
      allocated: 15000, 
      spent: 12000, 
      committed: 2500, 
      available: 500,
      status: 'warning',
      campaigns: [
        { name: 'Q4 Lead Gen', budget: 8000, spent: 6500, status: 'on_track' },
        { name: 'Brand Awareness', budget: 4500, spent: 3800, status: 'on_track' },
        { name: 'Retargeting', budget: 2500, spent: 1700, status: 'under' },
      ]
    },
    { 
      name: 'LinkedIn Ads', 
      allocated: 12000, 
      spent: 8500, 
      committed: 3000, 
      available: 500,
      status: 'on_track',
      campaigns: [
        { name: 'Executive Outreach', budget: 6000, spent: 4200, status: 'on_track' },
        { name: 'Content Syndication', budget: 6000, spent: 4300, status: 'on_track' },
      ]
    },
    { 
      name: 'Facebook Ads', 
      allocated: 8000, 
      spent: 5000, 
      committed: 2000, 
      available: 1000,
      status: 'on_track',
      campaigns: [
        { name: 'Community Building', budget: 5000, spent: 3200, status: 'on_track' },
        { name: 'Event Promo', budget: 3000, spent: 1800, status: 'under' },
      ]
    },
    { 
      name: 'Instagram Ads', 
      allocated: 5000, 
      spent: 3000, 
      committed: 1500, 
      available: 500,
      status: 'on_track',
      campaigns: [
        { name: 'Visual Storytelling', budget: 5000, spent: 3000, status: 'on_track' },
      ]
    },
    { 
      name: 'X (Twitter) Ads', 
      allocated: 3000, 
      spent: 2000, 
      committed: 1000, 
      available: 0,
      status: 'on_track',
      campaigns: [
        { name: 'Thought Leadership', budget: 3000, spent: 2000, status: 'on_track' },
      ]
    },
    { 
      name: 'Display/Retargeting', 
      allocated: 7000, 
      spent: 2000, 
      committed: 2000, 
      available: 3000,
      status: 'under',
      campaigns: [
        { name: 'Programmatic Display', budget: 4000, spent: 1200, status: 'under' },
        { name: 'Remarketing', budget: 3000, spent: 800, status: 'under' },
      ]
    },
  ],
  auditTrail: [
    {
      id: '1',
      timestamp: '2025-11-06 14:32',
      user: 'Brian Ford',
      source: 'flight_deck',
      changeType: 'reallocation',
      description: 'Reallocated $2,000 from Display to Google Ads',
      approved: true,
      approvedBy: 'Campaign Manager',
    },
    {
      id: '2',
      timestamp: '2025-11-05 09:15',
      user: 'Sarah Chen',
      source: 'strategy_studio',
      changeType: 'monthly_update',
      description: 'Updated October spend data',
      approved: true,
      approvedBy: 'Auto-approved',
    },
    {
      id: '3',
      timestamp: '2025-11-01 11:00',
      user: 'System',
      source: 'flight_deck',
      changeType: 'contingency_use',
      description: 'Used $1,500 contingency for LinkedIn overspend',
      approved: true,
      approvedBy: 'Brian Ford',
    },
  ],
  alerts: [
    {
      type: 'warning',
      channel: 'Google Ads',
      message: 'Budget 93% depleted with 12 days remaining',
      severity: 'medium',
    },
    {
      type: 'info',
      channel: 'Display/Retargeting',
      message: 'Under-pacing: On track to spend only 57% of budget',
      severity: 'low',
    },
    {
      type: 'warning',
      channel: 'Contingency',
      message: 'Contingency at 50% - consider budget adjustments',
      severity: 'medium',
    },
  ],
}

export default function Budget() {
  const [currentStep, setCurrentStep] = useState('overview')
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [showBudgetRequestDialog, setShowBudgetRequestDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'over': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'under': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track': return 'On Track'
      case 'warning': return 'Warning'
      case 'over': return 'Over Budget'
      case 'under': return 'Under-Pacing'
      default: return status
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Read-only Info Banner */}
            <Card className="border-l-4" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">Budget Tracking & Monitoring</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      This dashboard provides read-only tracking of your budget allocation, spending, and performance across all channels. Use this to monitor progress and identify variances.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Need to adjust your budget?</strong> Go to <a href="/strategy-studio/budget" className="underline" style={{ color: FLIGHT_DECK_COLOR }}>Strategy Studio → Budget</a> to make year-round budget changes and channel reallocations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card data-testid="card-total-budget">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">${mockBudgetData.currentMonth.totalBudget.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{mockBudgetData.currentMonth.month}</div>
                </CardContent>
              </Card>

              <Card data-testid="card-total-spent">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">${mockBudgetData.currentMonth.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((mockBudgetData.currentMonth.totalSpent / mockBudgetData.currentMonth.totalBudget) * 100)}% of budget
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-total-available">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">${mockBudgetData.currentMonth.totalAvailable.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{mockBudgetData.currentMonth.daysRemaining} days left</div>
                </CardContent>
              </Card>
            </div>

            {/* Pacing Indicator */}
            <Card data-testid="card-pacing">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Budget Pacing</h3>
                    <p className="text-sm text-muted-foreground">
                      Day {mockBudgetData.currentMonth.daysInMonth - mockBudgetData.currentMonth.daysRemaining} of {mockBudgetData.currentMonth.daysInMonth}
                    </p>
                  </div>
                  <Badge className={getStatusColor('on_track')}>On Track</Badge>
                </div>
                <Progress 
                  value={(mockBudgetData.currentMonth.totalSpent / mockBudgetData.currentMonth.totalBudget) * 100} 
                  className="h-3 mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${mockBudgetData.currentMonth.totalSpent.toLocaleString()} spent</span>
                  <span>${mockBudgetData.currentMonth.totalBudget.toLocaleString()} total</span>
                </div>
              </CardContent>
            </Card>

            {/* Contingency */}
            <Card data-testid="card-contingency">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Contingency Reserve</h3>
                    <p className="text-sm text-muted-foreground">Emergency budget pool</p>
                  </div>
                  <Badge className={getStatusColor('warning')}>50% Remaining</Badge>
                </div>
                <Progress 
                  value={(mockBudgetData.currentMonth.contingencyRemaining / mockBudgetData.currentMonth.contingencyTotal) * 100} 
                  className="h-3 mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${mockBudgetData.currentMonth.contingencyRemaining.toLocaleString()} available</span>
                  <span>${mockBudgetData.currentMonth.contingencyTotal.toLocaleString()} total</span>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            {mockBudgetData.alerts.length > 0 && (
              <Card data-testid="card-alerts">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Budget Alerts
                  </h3>
                  <div className="space-y-3">
                    {mockBudgetData.alerts.map((alert, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        data-testid={`alert-${idx}`}
                      >
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alert.channel}</div>
                          <div className="text-sm text-muted-foreground">{alert.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={() => setShowBudgetRequestDialog(true)}
                      variant="outline"
                      className="w-full"
                      style={{ borderColor: FLIGHT_DECK_COLOR }}
                      data-testid="button-request-budget-change-overview"
                    >
                      <DollarSign className="w-4 h-4 mr-2" style={{ color: FLIGHT_DECK_COLOR }} />
                      Request Budget Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Channel Summary */}
            <Card data-testid="card-channel-summary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Channel Budget Overview</h3>
                <div className="space-y-4">
                  {mockBudgetData.channels.map((channel) => (
                    <div key={channel.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{channel.name}</span>
                        <Badge className={getStatusColor(channel.status)}>{getStatusLabel(channel.status)}</Badge>
                      </div>
                      <Progress value={(channel.spent / channel.allocated) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${channel.spent.toLocaleString()} / ${channel.allocated.toLocaleString()}</span>
                        <span>{Math.round((channel.spent / channel.allocated) * 100)}% used</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 'channel-details':
        return (
          <motion.div
            key="channel-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Channel Budget Suggestions */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">Channel Budgeting Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Allocate 15-25% of total budget to your top-performing channel</li>
                      <li>Reserve 10-15% as contingency for unexpected opportunities</li>
                      <li>Test new channels with 5-10% of budget before scaling</li>
                      <li>Review channel performance monthly and reallocate based on ROI</li>
                      <li>Consider seasonality when setting monthly channel budgets</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {mockBudgetData.channels.map((channel) => (
              <Card key={channel.name} data-testid={`channel-card-${channel.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${channel.spent.toLocaleString()} spent • ${channel.committed.toLocaleString()} committed • ${channel.available.toLocaleString()} available
                      </p>
                    </div>
                    <Badge className={getStatusColor(channel.status)}>{getStatusLabel(channel.status)}</Badge>
                  </div>

                  <div className="space-y-3">
                    {channel.campaigns.map((campaign) => (
                      <div 
                        key={campaign.name}
                        className="p-3 rounded-lg bg-muted/30 space-y-2"
                        data-testid={`campaign-${campaign.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{campaign.name}</span>
                          <Badge variant="outline" className={getStatusColor(campaign.status)}>
                            {getStatusLabel(campaign.status)}
                          </Badge>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                          <span>{Math.round((campaign.spent / campaign.budget) * 100)}% used</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Request Budget Change Button */}
            <Card data-testid="card-budget-request-channel-details">
              <CardContent className="pt-6">
                <Button
                  onClick={() => setShowBudgetRequestDialog(true)}
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: FLIGHT_DECK_COLOR }}
                  data-testid="button-request-budget-change-channel-details"
                >
                  <DollarSign className="w-4 h-4 mr-2" style={{ color: FLIGHT_DECK_COLOR }} />
                  Request Budget Change
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 'audit-trail':
        return (
          <motion.div
            key="audit-trail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card data-testid="card-audit-trail">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Budget Change History</h3>
                  <Badge variant="outline">Bidirectional Sync Active</Badge>
                </div>
                <div className="space-y-3">
                  {mockBudgetData.auditTrail.map((entry) => (
                    <div 
                      key={entry.id}
                      className="p-4 rounded-lg border space-y-2"
                      data-testid={`audit-entry-${entry.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {entry.approved ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="font-medium text-sm">{entry.description}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{entry.user}</span>
                            <span>•</span>
                            <span>{entry.timestamp}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.source === 'flight_deck' ? 'Flight Deck' : 'Strategy Studio'}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className={entry.approved ? 'bg-green-50 dark:bg-green-950' : ''}>
                          {entry.approved ? `Approved by ${entry.approvedBy}` : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Request Budget Change Button */}
            <Card data-testid="card-budget-request-audit-trail">
              <CardContent className="pt-6">
                <Button
                  onClick={() => setShowBudgetRequestDialog(true)}
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: FLIGHT_DECK_COLOR }}
                  data-testid="button-request-budget-change-audit-trail"
                >
                  <DollarSign className="w-4 h-4 mr-2" style={{ color: FLIGHT_DECK_COLOR }} />
                  Request Budget Change
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return <div>Select a step</div>
    }
  }

  const content = renderStepContent()

  return (
    <>
      <ThreeColumnLayout
        leftNav={null}
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        content={
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
              <QuickActions module="FlightDeck" />
            </div>
            <div className="px-8 py-6">
              {content}
            </div>
          </div>
        }
        moduleColor={FLIGHT_DECK_COLOR}
        featureName="Budget Tracking"
      />
      <RequestBudgetChangeDialog
        open={showBudgetRequestDialog}
        onOpenChange={setShowBudgetRequestDialog}
        availableChannels={mockBudgetData.channels.map(ch => ch.name)}
        channelBudgets={Object.fromEntries(
          mockBudgetData.channels.map(ch => [ch.name, ch.allocated])
        )}
        recommendationContext="Budget adjustment based on current alerts and spending patterns"
        sourceFeature="flight-deck-budget-overview"
      />
    </>
  )
}
