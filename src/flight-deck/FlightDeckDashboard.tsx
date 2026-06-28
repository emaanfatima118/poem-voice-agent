"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Search, Plus, TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight, Calendar, Lightbulb, Rocket } from 'lucide-react'
import { QuickActions } from '@/components/QuickActions'

const FLIGHT_DECK_COLOR = '#1e40f2'

export default function FlightDeckDashboard() {
  // Lift & Lag data
  const liftLagData = [
    {
      stage: "Awareness",
      lift: { metric: "Impressions", change: "+18%" },
      lag: { metric: "Opportunities Created", change: "+5%" },
      insight: "Increased visibility is starting to influence early-stage pipeline.",
      status: "success" as const,
    },
    {
      stage: "Engagement",
      lift: { metric: "CTR", change: "+20%" },
      lag: { metric: "Pipeline Value", change: "0%" },
      insight: "Strong engagement, but lag flat — review lead quality and handoff.",
      status: "warning" as const,
    },
    {
      stage: "Consideration",
      lift: { metric: "Form Fills", change: "+25%" },
      lag: { metric: "Revenue", change: "+10%" },
      insight: "Healthy mid-funnel motion — nurture programs working effectively.",
      status: "success" as const,
    },
    {
      stage: "Conversion",
      lift: { metric: "Account Engagement", change: "+15%" },
      lag: { metric: "SQL → Customer Rate", change: "-5%" },
      insight: "Accounts are active, but late-stage messaging may need refinement.",
      status: "warning" as const,
    },
    {
      stage: "Retention",
      lift: { metric: "Engagement Rate", change: "-10%" },
      lag: { metric: "ROI by Campaign", change: "-12%" },
      insight: "Decreasing engagement and ROI — refresh creative and audience mix.",
      status: "danger" as const,
    },
  ]

  const statusColor = {
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  }

  const statusIcon = {
    success: <ArrowUpRight className="w-4 h-4" />,
    warning: <ArrowRight className="w-4 h-4" />,
    danger: <ArrowDownRight className="w-4 h-4" />,
  }

  // Mock data for campaigns
  const mockCampaigns = [
    { id: 1, name: 'Sustainability - Tier 1', activity: 'In Flight', status: 'in_flight', ctr: '4.8%', leads: 12 },
    { id: 2, name: 'Brand Awareness -Robotics', activity: 'Delayed', status: 'delayed', ctr: '1.7%', leads: 0 },
    { id: 3, name: 'EXPO World - Follow Up', activity: 'Taxiing', status: 'taxiing', ctr: '-', leads: '-' },
  ]

  // Channel Performance data
  const channelData = [
    { channel: 'Email', value: 45, color: '#60a5fa' },
    { channel: 'Ads', value: 55, color: '#818cf8' },
    { channel: 'SEO', value: 70, color: '#a78bfa' },
    { channel: 'Social', value: 65, color: '#c084fc' },
    { channel: 'Website', value: 80, color: '#e879f9' },
    { channel: 'Content', value: 90, color: '#f472b6' },
  ]

  const maxValue = Math.max(...channelData.map(d => d.value))

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'in_flight':
        return 'default'
      case 'delayed':
        return 'secondary'
      case 'taxiing':
        return 'outline'
      case 'landed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background min-w-0">
      <div className="p-4 md:p-8 space-y-6 overflow-x-hidden max-w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="heading-flight-deck">
              Hey there, Brian Ford!
            </h1>
            <p className="text-sm text-muted-foreground">
              Strap in — it's go time!
            </p>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or ID"
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              style={{ backgroundColor: FLIGHT_DECK_COLOR }}
              className="text-white"
              data-testid="button-customize"
            >
              Customize
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Cristopher Calzoni" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  CC
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold" data-testid="text-user-name">
                  Cristopher Calzoni
                </span>
                <span className="text-xs text-muted-foreground" data-testid="text-user-role">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions module="FlightDeck" />

        {/* Row 1: Full-Width Lift & Lag Performance Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lift & Lag Performance Dashboard</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Connecting <strong>Lift Metrics</strong> (leading indicators) with <strong>Lag Metrics</strong> (outcomes) across the funnel.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-4 text-xs font-semibold text-muted-foreground border-b pb-2">
                <span>Stage</span>
                <span>Lift Metric</span>
                <span>Lag Metric</span>
                <span>AI Insight</span>
              </div>

              {/* Table Rows */}
              {liftLagData.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 items-center border-b last:border-0 py-3 text-sm"
                  data-testid={`row-lift-lag-${i}`}
                >
                  <span className="font-semibold">{row.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${statusColor[row.status]} font-semibold flex items-center gap-1`}>
                      {statusIcon[row.status]} {row.lift.metric}
                    </span>
                    <span className="text-muted-foreground text-xs">{row.lift.change}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${statusColor[row.status]} font-semibold flex items-center gap-1`}>
                      {statusIcon[row.status]} {row.lag.metric}
                    </span>
                    <span className="text-muted-foreground text-xs">{row.lag.change}</span>
                  </div>
                  <span className="text-muted-foreground italic text-xs">{row.insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Row 2: Channel Performance + AI Insights */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {channelData.map((channel) => (
                  <div key={channel.channel} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">{channel.channel}</span>
                    <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(channel.value / maxValue) * 100}%`,
                          backgroundColor: channel.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{channel.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="text-sm flex items-start gap-2">
                  <span className="text-foreground font-medium">1.</span>
                  <span className="text-muted-foreground">LinkedIn POV posts driving 2x engagement—scale frequency to 3x/week</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-foreground font-medium">2.</span>
                  <span className="text-muted-foreground">Paid Social underperforming—test new creative variations this week</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-foreground font-medium">3.</span>
                  <span className="text-muted-foreground">Email cadence optimal—maintain current schedule through Q1</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Campaigns Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 pb-2 border-b text-xs font-semibold text-muted-foreground">
                <span>Name</span>
                <span className="text-center">Activity</span>
                <span className="text-center">Status</span>
                <span className="text-center">CTR</span>
                <span className="text-center">Leads</span>
              </div>

              {/* Table Rows */}
              {mockCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="grid grid-cols-5 gap-4 py-3 border-b last:border-0 text-sm items-center"
                  data-testid={`row-campaign-${campaign.id}`}
                >
                  <span className="font-medium">{campaign.name}</span>
                  <span className="text-center text-muted-foreground">{campaign.activity}</span>
                  <div className="flex justify-center">
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>
                      {campaign.activity}
                    </Badge>
                  </div>
                  <span className="text-center font-medium">{campaign.ctr}</span>
                  <span className="text-center font-medium">{campaign.leads}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Row 4: Budget Board */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Budget Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Allocated</p>
                  <p className="text-2xl font-bold">$125,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">$87,450</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold" style={{ color: FLIGHT_DECK_COLOR }}>$37,550</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Budget Utilization</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '70%',
                      backgroundColor: FLIGHT_DECK_COLOR,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Pulse Style */}
        <div className="grid grid-cols-3 gap-4">
          <Button 
            asChild
            className="w-full h-20 text-white flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: FLIGHT_DECK_COLOR }}
            data-testid="button-distribute"
          >
            <Link href="/flight-deck/distribution">
              <Plus className="w-5 h-5" />
              <span>Distribute Campaign</span>
            </Link>
          </Button>

          <Button 
            asChild
            className="w-full h-20 text-white flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: FLIGHT_DECK_COLOR }}
            data-testid="button-calendar"
          >
            <Link href="/flight-deck/content-calendar">
              <Calendar className="w-5 h-5" />
              <span>View Calendar</span>
            </Link>
          </Button>

          <Button 
            asChild
            className="w-full h-20 text-white flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: FLIGHT_DECK_COLOR }}
            data-testid="button-insights"
          >
            <Link href="/flight-deck/campaign-insights">
              <TrendingUp className="w-5 h-5" />
              <span>Campaign Insights</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

