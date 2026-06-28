"use client"

import { useState } from 'react'
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QuickActions } from '@/components/QuickActions'
import { Lightbulb, AlertCircle, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const FLIGHT_DECK_COLOR = '#1e40f2'

const steps = [
  { id: 'overview', label: 'Overview', description: 'Budget status and alerts' },
  { id: 'channel-details', label: 'Channel Details', description: 'Deep dive by channel' },
  { id: 'reallocation', label: 'Reallocation', description: 'HITL budget adjustments' },
  { id: 'audit-trail', label: 'Audit Trail', description: 'Change history' },
  { id: 'optimization', label: 'Optimization', description: 'Campaign adjustments' },
  { id: 'forecasting', label: 'Forecasting & Pacing', description: 'Future projections' },
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

  const renderCoachingPrompt = (step: string) => {
    const prompts: Record<string, { whatToDo: string; expectedOutcome: string; tip: string }> = {
      overview: {
        whatToDo: 'Review your budget status at a glance. Check alerts, pacing indicators, and contingency levels to understand your current financial position.',
        expectedOutcome: 'You\'ll quickly identify any channels requiring attention, understand your burn rate, and see which budgets need reallocation or approval.',
        tip: 'Address yellow/red alerts first. Contingency below 20% requires action - either reallocate or request increase approval.',
      },
      'channel-details': {
        whatToDo: 'Drill down into each channel to see campaign-level budget breakdown, spend patterns, and performance metrics.',
        expectedOutcome: 'You\'ll see exactly where money is going, which campaigns are performing efficiently, and where adjustments are needed.',
        tip: 'Look for campaigns with high spend but low ROI - these are prime candidates for optimization or reallocation.',
      },
      reallocation: {
        whatToDo: 'Reallocate budget between channels as needed. All reallocations require HITL approval to ensure strategic alignment.',
        expectedOutcome: 'You\'ll optimize budget distribution to match current priorities and performance, while maintaining total budget limits.',
        tip: 'High-priority campaigns get budget preference. If total budget increase is needed, escalate to Admin for approval.',
      },
      'audit-trail': {
        whatToDo: 'Review all budget changes with full transparency - see who changed what, when, and why. Tracks changes from both Strategy Studio and Flight Deck.',
        expectedOutcome: 'You\'ll have complete accountability and traceability for all budget decisions and adjustments.',
        tip: 'This bidirectional sync ensures Strategy Studio and Flight Deck always show the same budget data - changes anywhere reflect everywhere.',
      },
      optimization: {
        whatToDo: 'Make campaign-level budget adjustments within pre-defined guardrails. Different campaign types have different optimization ranges.',
        expectedOutcome: 'You\'ll fine-tune individual campaign budgets to maximize performance while staying within approved limits.',
        tip: 'Brand Awareness campaigns allow ±10-15% adjustments. Sales/Lead Gen campaigns have tighter ±5-10% guardrails for efficiency.',
      },
      forecasting: {
        whatToDo: 'Analyze burn rate, project month-end spend, and model "what-if" scenarios to plan ahead and avoid surprises.',
        expectedOutcome: 'You\'ll see if you\'re on track to spend your full budget, identify under/over-spend trends early, and plan corrections.',
        tip: 'Use scenario modeling to test budget changes before committing - see the impact of increasing LinkedIn by 20% on overall allocation.',
      },
    }

    const prompt = prompts[step] || prompts.overview

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-l-4 mb-6" style={{ borderLeftColor: FLIGHT_DECK_COLOR }}>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">What to do:</span>
                  <span className="text-muted-foreground ml-1">{prompt.whatToDo}</span>
                </div>
                <div>
                  <span className="font-semibold">Expected outcome:</span>
                  <span className="text-muted-foreground ml-1">{prompt.expectedOutcome}</span>
                </div>
                <div>
                  <span className="font-semibold">Tip:</span>
                  <span className="text-muted-foreground ml-1">{prompt.tip}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
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
            {renderCoachingPrompt('overview')}

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
            {renderCoachingPrompt('channel-details')}

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
          </motion.div>
        )

      case 'reallocation':
        return (
          <motion.div
            key="reallocation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {renderCoachingPrompt('reallocation')}

            <Card data-testid="card-reallocation-info">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">HITL Approval Required</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      All budget reallocations require Campaign Manager approval. Total budget cannot be exceeded without Admin approval.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-reallocation-form">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Reallocate Budget</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">From Channel</label>
                      <select className="w-full p-2 border rounded" data-testid="select-from-channel">
                        <option>Select channel...</option>
                        {mockBudgetData.channels.map(ch => (
                          <option key={ch.name} value={ch.name}>{ch.name} (${ch.available.toLocaleString()} available)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">To Channel</label>
                      <select className="w-full p-2 border rounded" data-testid="select-to-channel">
                        <option>Select channel...</option>
                        {mockBudgetData.channels.map(ch => (
                          <option key={ch.name} value={ch.name}>{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded" 
                      placeholder="Enter amount..."
                      data-testid="input-reallocation-amount"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reason</label>
                    <textarea 
                      className="w-full p-2 border rounded" 
                      rows={3}
                      placeholder="Explain why this reallocation is needed..."
                      data-testid="textarea-reallocation-reason"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" data-testid="button-request-reallocation">
                      Request Reallocation Approval
                    </Button>
                    <Button variant="outline" data-testid="button-use-contingency">
                      Use Contingency
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-pending-requests">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Pending Approval Requests</h3>
                <div className="text-sm text-muted-foreground text-center py-8">
                  No pending reallocation requests
                </div>
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
            {renderCoachingPrompt('audit-trail')}

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
          </motion.div>
        )

      case 'optimization':
        return (
          <motion.div
            key="optimization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {renderCoachingPrompt('optimization')}

            <Card data-testid="card-optimization-guardrails">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Campaign Type Guardrails</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Brand Awareness', range: '±10-15%', focus: 'Reach, CPM' },
                    { type: 'Lead Generation', range: '±5-10%', focus: 'CPL, Conversion Rate' },
                    { type: 'Engagement/Retargeting', range: '±8-12%', focus: 'CTR, ROAS' },
                    { type: 'Sales/Bottom-Funnel', range: '±5-8%', focus: 'ROAS, CPA' },
                    { type: 'Lifecycle/Nurture', range: '±10-15%', focus: 'CTR, Assists' },
                  ].map((guardrail) => (
                    <div key={guardrail.type} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium text-sm">{guardrail.type}</div>
                        <div className="text-xs text-muted-foreground">{guardrail.focus}</div>
                      </div>
                      <Badge variant="outline">{guardrail.range}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-campaign-optimization">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Active Campaigns - Optimization Controls</h3>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Campaign optimization controls coming soon
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 'forecasting':
        return (
          <motion.div
            key="forecasting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {renderCoachingPrompt('forecasting')}

            <Card data-testid="card-burn-rate">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Burn Rate Analysis</h3>
                    <p className="text-sm text-muted-foreground">Daily spend vs ideal pace</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="h-48 flex items-center justify-center border rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Burn rate chart visualization</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-month-end-projection">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Month-End Projection</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-900 dark:text-green-100">On Track</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      At current rate, projected to spend $47,800 of $50,000 budget (95.6%)
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Current Daily Rate</div>
                      <div className="text-xl font-bold">$1,805</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Ideal Daily Rate</div>
                      <div className="text-xl font-bold">$1,667</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-scenario-modeling">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Scenario Modeling</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Test Budget Adjustment</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="p-2 border rounded" data-testid="select-scenario-channel">
                        <option>Select channel...</option>
                        {mockBudgetData.channels.map(ch => (
                          <option key={ch.name}>{ch.name}</option>
                        ))}
                      </select>
                      <select className="p-2 border rounded" data-testid="select-scenario-change">
                        <option>+20%</option>
                        <option>+10%</option>
                        <option>-10%</option>
                        <option>-20%</option>
                      </select>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" data-testid="button-run-scenario">
                    Run Scenario
                  </Button>
                  <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
                    Scenario results will appear here
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return <div>Select a step</div>
    }
  }

  const content = (
    <div className="space-y-6">
      <QuickActions module="FlightDeck" />
      {renderStepContent()}
    </div>
  )

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={content}
      moduleColor={FLIGHT_DECK_COLOR}
      featureName="Budget Management"
    />
  )
}
