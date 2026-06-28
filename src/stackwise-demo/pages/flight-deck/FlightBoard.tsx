import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { 
  ClipboardCheck, 
  Shield, 
  Rocket, 
  CheckCircle2,
  Lightbulb,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  Flame,
  Target,
  FileText,
  Sparkles,
  Brain,
  ChevronRight,
  Zap
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/stackwise-demo/components/ui/sheet";
import { QuickActions } from '@/stackwise-demo/components/QuickActions';

const FLIGHT_DECK_COLOR = '#1e40f2';

// Aviation-themed status
export const AVIATION_STATUS = {
  now_boarding: { label: 'Now Boarding', color: '#9ca3af', icon: ClipboardCheck },
  in_flight: { label: 'In Flight', color: '#10b981', icon: Rocket },
  landed: { label: 'Landed', color: '#6366f1', icon: CheckCircle2 },
  delayed: { label: 'Delayed', color: '#ef4444', icon: Clock },
  at_risk: { label: 'At Risk', color: '#f59e0b', icon: AlertTriangle },
  needs_review: { label: 'Needs Review', color: '#8b5cf6', icon: Shield },
};

// Dummy campaign data
const DUMMY_CAMPAIGNS = [
  {
    key: 'campaign-1',
    campaignName: 'Q4 Product Launch',
    channels: ['Email', 'LinkedIn', 'Facebook'],
    totalBudget: 45000,
    status: 'in_flight',
    launchDate: '2024-11-10',
    audience: '32,450 contacts',
    performance: {
      impressions: 125000,
      clicks: 4800,
      ctr: '3.84',
      conversions: 215,
      engScore: 87,
      spend: 32500,
    },
    alerts: {
      underperforming: false,
      slowSpend: false,
      abmSpike: true,
    },
  },
  {
    key: 'campaign-2',
    campaignName: 'Holiday Special Promotion',
    channels: ['Email', 'Instagram', 'TikTok'],
    totalBudget: 28000,
    status: 'now_boarding',
    launchDate: '2024-11-18',
    audience: '18,200 contacts',
    performance: {
      impressions: 0,
      clicks: 0,
      ctr: '0.00',
      conversions: 0,
      engScore: 0,
      spend: 0,
    },
    alerts: {
      underperforming: false,
      slowSpend: false,
      abmSpike: false,
    },
  },
  {
    key: 'campaign-3',
    campaignName: 'Enterprise ABM Campaign',
    channels: ['LinkedIn', 'Email'],
    totalBudget: 65000,
    status: 'in_flight',
    launchDate: '2024-10-28',
    audience: '8,750 contacts',
    performance: {
      impressions: 78000,
      clicks: 1950,
      ctr: '2.50',
      conversions: 89,
      engScore: 72,
      spend: 58500,
    },
    alerts: {
      underperforming: true,
      slowSpend: false,
      abmSpike: false,
    },
  },
  {
    key: 'campaign-4',
    campaignName: 'Content Marketing Series',
    channels: ['LinkedIn', 'Facebook', 'Email'],
    totalBudget: 22000,
    status: 'delayed',
    launchDate: '2024-11-05',
    audience: '45,600 contacts',
    performance: {
      impressions: 52000,
      clicks: 1200,
      ctr: '2.31',
      conversions: 56,
      engScore: 65,
      spend: 8200,
    },
    alerts: {
      underperforming: false,
      slowSpend: true,
      abmSpike: false,
    },
  },
  {
    key: 'campaign-5',
    campaignName: 'Customer Retention Drive',
    channels: ['Email', 'LinkedIn'],
    totalBudget: 18500,
    status: 'at_risk',
    launchDate: '2024-11-08',
    audience: '12,300 contacts',
    performance: {
      impressions: 34000,
      clicks: 890,
      ctr: '2.62',
      conversions: 42,
      engScore: 58,
      spend: 16800,
    },
    alerts: {
      underperforming: true,
      slowSpend: false,
      abmSpike: false,
    },
  },
  {
    key: 'campaign-6',
    campaignName: 'New Feature Announcement',
    channels: ['Email', 'LinkedIn', 'Facebook', 'Instagram'],
    totalBudget: 38000,
    status: 'landed',
    launchDate: '2024-10-15',
    audience: '56,800 contacts',
    performance: {
      impressions: 245000,
      clicks: 8950,
      ctr: '3.65',
      conversions: 412,
      engScore: 92,
      spend: 37200,
    },
    alerts: {
      underperforming: false,
      slowSpend: false,
      abmSpike: false,
    },
  },
];

// Dummy channel activities
const CHANNEL_ACTIVITIES: Record<string, any[]> = {
  'Email': [
    { name: 'Welcome Email', type: 'Email', status: 'Completed', scheduled: 'Nov 10, 2:00 PM', output: '4.2% CTR', notes: 'Top performer' },
    { name: 'Follow-up #1', type: 'Email', status: 'In Flight', scheduled: 'Nov 15, 10:00 AM', output: '3.8% CTR', notes: '–' },
    { name: 'Follow-up #2', type: 'Email', status: 'Scheduled', scheduled: 'Nov 20, 2:00 PM', output: 'Draft v2', notes: 'Pending approval' },
  ],
  'LinkedIn': [
    { name: 'LI Post #1', type: 'Social', status: 'Completed', scheduled: 'Nov 12, 9:00 AM', output: '5.3% CTR', notes: 'Top performer' },
    { name: 'LI Post #2', type: 'Social', status: 'In Flight', scheduled: 'Nov 14, 3:00 PM', output: '4.1% CTR', notes: '–' },
    { name: 'LI Sponsored Ad', type: 'Paid', status: 'In Flight', scheduled: 'Nov 10, 12:00 PM', output: '2.8% CTR', notes: 'Under budget' },
  ],
  'Facebook': [
    { name: 'FB Post #1', type: 'Social', status: 'Completed', scheduled: 'Nov 11, 1:00 PM', output: '3.2% CTR', notes: '–' },
    { name: 'FB Ad Campaign', type: 'Paid', status: 'In Flight', scheduled: 'Nov 13, 11:00 AM', output: '2.9% CTR', notes: 'On track' },
    { name: 'FB Post #2', type: 'Social', status: 'Scheduled', scheduled: 'Nov 18, 4:00 PM', output: 'Draft v1', notes: 'Missing image' },
  ],
  'Instagram': [
    { name: 'IG Story #1', type: 'Social', status: 'Completed', scheduled: 'Nov 9, 10:00 AM', output: '6.1% CTR', notes: 'Excellent reach' },
    { name: 'IG Post #1', type: 'Social', status: 'In Flight', scheduled: 'Nov 14, 2:00 PM', output: '4.7% CTR', notes: '–' },
    { name: 'IG Reel', type: 'Social', status: 'Needs Fix', scheduled: '–', output: '–', notes: 'Video missing' },
  ],
  'TikTok': [
    { name: 'TT Video #1', type: 'Social', status: 'Scheduled', scheduled: 'Nov 20, 5:00 PM', output: 'Draft v1', notes: 'Ready to publish' },
    { name: 'TT Video #2', type: 'Social', status: 'Scheduled', scheduled: 'Nov 22, 3:00 PM', output: 'Draft v1', notes: '–' },
  ],
};

export default function FlightBoard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);

  const campaigns = DUMMY_CAMPAIGNS;

  // Calculate TODAY metrics
  const todayMetrics = {
    scheduledToday: 2,
    launchingThisWeek: 3,
    delayed: campaigns.filter(c => c.status === 'delayed').length,
    audienceSpikes: 2,
    atRisk: campaigns.filter(c => c.status === 'at_risk').length,
    overBudget: campaigns.filter(c => (c.performance.spend / c.totalBudget) > 0.9).length,
    underperforming: campaigns.filter(c => c.alerts.underperforming).length,
  };

  // Apply status filter
  const filteredCampaigns = statusFilter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === statusFilter);

  const currentCampaign = filteredCampaigns.find(c => c.key === selectedCampaign);

  return (
    <div className="h-full overflow-hidden">
      {/* Main content - Full width */}
      <div className="h-full overflow-y-auto bg-white">
        <div className="p-8 space-y-6">
          <QuickActions module="FlightDeck" />
          
          {/* Header with Sticky Intelligence Button */}
          <div className="flex items-start justify-between sticky top-0 bg-white z-50 pb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Flight Board</h1>
              <p className="text-muted-foreground">
                Real-time campaign monitoring and intelligence
              </p>
            </div>
            <Sheet open={intelligenceOpen} onOpenChange={setIntelligenceOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="default"
                  className="relative"
                  data-testid="button-intelligence"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-20 blur animate-pulse"></div>
                  <Zap className="w-4 h-4 mr-2 relative" style={{ color: FLIGHT_DECK_COLOR }} />
                  <span className="relative">Intelligence</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[450px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" style={{ color: FLIGHT_DECK_COLOR }} />
                    Campaign Intelligence
                  </SheetTitle>
                  <SheetDescription>
                    {currentCampaign 
                      ? `AI-powered insights for ${currentCampaign.campaignName}`
                      : 'Select a campaign to view insights'
                    }
                  </SheetDescription>
                </SheetHeader>
                
                {!currentCampaign ? (
                  <div className="mt-12 text-center">
                    <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold mb-2">No Campaign Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a campaign from the list to view AI-powered insights, recommendations, and performance predictions.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    {/* Performance Benchmarks for campaign - FIRST */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Performance vs. Benchmarks</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Industry Avg CTR</span>
                          <span className="font-semibold">2.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">This Campaign CTR</span>
                          <span className={`font-semibold ${parseFloat(currentCampaign.performance.ctr) > 2.3 ? 'text-green-600' : 'text-red-600'}`}>
                            {currentCampaign.performance.ctr}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engagement Score</span>
                          <span className={`font-semibold ${currentCampaign.performance.engScore > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                            {currentCampaign.performance.engScore} / 100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget Efficiency</span>
                          <span className="font-semibold">
                            ${(currentCampaign.performance.spend / Math.max(currentCampaign.performance.conversions, 1)).toFixed(0)} / conv
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Audience Activity for this campaign */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Audience Activity</CardTitle>
                        <CardDescription className="text-xs">
                          {currentCampaign.audience} engaged
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium">Engagement Rate</p>
                              <p className="text-xs text-muted-foreground">
                                {((currentCampaign.performance.clicks / currentCampaign.performance.impressions) * 100).toFixed(1)}% interaction rate
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {parseFloat(currentCampaign.performance.ctr) > 3 ? 'High' : 'Moderate'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">Conversion Velocity</p>
                              <p className="text-xs text-muted-foreground">
                                {currentCampaign.performance.conversions} conversions
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {(currentCampaign.performance.conversions / parseInt(currentCampaign.audience.replace(/,/g, '')) * 100).toFixed(2)}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Smart Predictions based on campaign */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
                          Smart Predictions
                        </CardTitle>
                        <CardDescription className="text-xs">
                          AI insights for {currentCampaign.campaignName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {currentCampaign.performance.spend > 0 && (
                          <div className="p-3 rounded-md bg-muted">
                            <p className="font-medium mb-1">Budget Forecast</p>
                            <p className="text-xs text-muted-foreground">
                              At current pace, you'll spend ${Math.round(currentCampaign.totalBudget * 0.95).toLocaleString()} 
                              {' '}({Math.round((currentCampaign.performance.spend / currentCampaign.totalBudget) * 100)}% of budget used)
                            </p>
                          </div>
                        )}
                        {currentCampaign.channels.includes('LinkedIn') && (
                          <div className="p-3 rounded-md bg-muted">
                            <p className="font-medium mb-1">Channel Performance</p>
                            <p className="text-xs text-muted-foreground">
                              LinkedIn driving {Math.floor(Math.random() * 30 + 40)}% of conversions - consider increasing allocation
                            </p>
                          </div>
                        )}
                        <div className="p-3 rounded-md bg-muted">
                          <p className="font-medium mb-1">Optimal Send Time</p>
                          <p className="text-xs text-muted-foreground">
                            Best engagement window: Tuesday-Thursday, 2-4 PM EST
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Campaign-Specific Next Plays */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: FLIGHT_DECK_COLOR }} />
                          <div>
                            <CardTitle className="text-sm">Next Plays</CardTitle>
                            <CardDescription className="text-xs">
                              Recommended for {currentCampaign.campaignName}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {currentCampaign.alerts.underperforming && (
                          <div className="p-3 rounded-md border hover-elevate cursor-pointer">
                            <div className="flex items-start gap-3">
                              <Target className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Optimize Underperforming Content</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Campaign is below target - refresh creative and adjust messaging
                                </p>
                                <Button size="sm" variant="outline">+ Eval</Button>
                              </div>
                            </div>
                          </div>
                        )}
                        {currentCampaign.alerts.slowSpend && (
                          <div className="p-3 rounded-md border hover-elevate cursor-pointer">
                            <div className="flex items-start gap-3">
                              <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Accelerate Budget Spend</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Only {Math.round((currentCampaign.performance.spend / currentCampaign.totalBudget) * 100)}% spent - increase bids or expand targeting
                                </p>
                                <Button size="sm" variant="outline">+ Eval</Button>
                              </div>
                            </div>
                          </div>
                        )}
                        {currentCampaign.alerts.abmSpike && (
                          <div className="p-3 rounded-md border hover-elevate cursor-pointer">
                            <div className="flex items-start gap-3">
                              <Flame className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Capitalize on ABM Spike</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  High-value accounts showing increased engagement - launch personalized follow-up
                                </p>
                                <Button size="sm" variant="outline">+ Eval</Button>
                              </div>
                            </div>
                          </div>
                        )}
                        {currentCampaign.performance.engScore > 80 && (
                          <div className="p-3 rounded-md border hover-elevate cursor-pointer">
                            <div className="flex items-start gap-3">
                              <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Scale High-Performing Campaign</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Engagement score of {currentCampaign.performance.engScore} - expand to similar audiences
                                </p>
                                <Button size="sm" variant="outline">+ Eval</Button>
                              </div>
                            </div>
                          </div>
                        )}
                        {currentCampaign.status === 'now_boarding' && (
                          <div className="p-3 rounded-md border hover-elevate cursor-pointer">
                            <div className="flex items-start gap-3">
                              <Rocket className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Pre-Launch Checklist</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Review targeting, creative assets, and budget allocation before launch
                                </p>
                                <Button size="sm" variant="outline">+ Eval</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Linked Assets for this campaign - LAST */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Linked Assets</CardTitle>
                        <CardDescription className="text-xs">
                          Content for {currentCampaign.campaignName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentCampaign.channels.map((channel, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-md border text-sm">
                              <span className="truncate flex-1">{channel} Creative Pack.zip</span>
                              <Button size="sm" variant="ghost">View</Button>
                            </div>
                          ))}
                          <div className="flex items-center justify-between p-2 rounded-md border text-sm">
                            <span className="truncate flex-1">Campaign Landing Page.html</span>
                            <Button size="sm" variant="ghost">View</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* TODAY Section - 3 columns */}
          <div>
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground">TODAY</h2>
            <div className="grid grid-cols-3 gap-4">
              <Card className="hover-elevate" data-testid="metric-scheduled-today">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Scheduled Today</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.scheduledToday}</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate" data-testid="metric-launching-week">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="w-5 h-5 text-green-500" />
                    <p className="text-sm text-muted-foreground">Launching This Week</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.launchingThisWeek}</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate" data-testid="metric-delayed">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-muted-foreground">Delayed</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.delayed}</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate" data-testid="metric-audience-spikes">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <p className="text-sm text-muted-foreground">Audience Spikes</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.audienceSpikes}</p>
                  <p className="text-xs text-muted-foreground mt-1">Fully Stacked</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate" data-testid="metric-at-risk">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <p className="text-sm text-muted-foreground">At-Risk</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.atRisk}</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate" data-testid="metric-over-budget">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-muted-foreground">Over Budget</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.overBudget}</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate col-span-3" data-testid="metric-underperforming">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">Underperforming Campaigns</p>
                  </div>
                  <p className="text-3xl font-bold">{todayMetrics.underperforming}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters Section */}
          <div>
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground">FILTERS</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={statusFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('all')}
                data-testid="filter-all"
              >
                All ({campaigns.length})
              </Button>
              {Object.entries(AVIATION_STATUS).map(([key, value]) => {
                const Icon = value.icon;
                const count = campaigns.filter(c => c.status === key).length;
                return (
                  <Button
                    key={key}
                    variant={statusFilter === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(key)}
                    data-testid={`filter-${key}`}
                  >
                    <Icon className="w-4 h-4 mr-2" style={{ color: statusFilter === key ? 'white' : value.color }} />
                    {value.label} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Campaign Cards - 3 columns grid */}
          <div>
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground">
              CAMPAIGNS ({filteredCampaigns.length})
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {filteredCampaigns.map((campaign) => {
                const statusInfo = AVIATION_STATUS[campaign.status as keyof typeof AVIATION_STATUS];
                const StatusIcon = statusInfo.icon;
                const isSelected = selectedCampaign === campaign.key;
                const pacingPercent = (campaign.performance.spend / campaign.totalBudget) * 100;
                
                return (
                  <Card
                    key={campaign.key}
                    className={`cursor-pointer transition-all hover-elevate ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCampaign(campaign.key)}
                    data-testid={`campaign-card-${campaign.key}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-sm">{campaign.campaignName}</CardTitle>
                        <Badge 
                          variant="outline"
                          className="text-xs flex-shrink-0"
                          style={{ borderColor: statusInfo.color, color: statusInfo.color }}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{campaign.audience}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Channel Snapshot */}
                      <div className="text-xs space-y-1">
                        <p className="font-medium text-muted-foreground mb-2">Channels</p>
                        <div className="flex flex-wrap gap-1">
                          {campaign.channels.map((ch: string) => (
                            <Badge key={ch} variant="secondary" className="text-[10px]">
                              {ch}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="p-2 rounded-md bg-muted/50 text-xs">
                        <div className="grid grid-cols-5 gap-2 text-center">
                          <div>
                            <p className="text-[10px] text-muted-foreground">Impr</p>
                            <p className="font-semibold">{(campaign.performance.impressions / 1000).toFixed(0)}k</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Clicks</p>
                            <p className="font-semibold">{campaign.performance.clicks}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">CTR</p>
                            <p className="font-semibold">{campaign.performance.ctr}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Conv</p>
                            <p className="font-semibold">{campaign.performance.conversions}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Eng</p>
                            <p className="font-semibold">{campaign.performance.engScore}</p>
                          </div>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            ${(campaign.totalBudget / 1000).toFixed(0)}k budget
                          </span>
                          <span className="font-semibold">
                            ${(campaign.performance.spend / 1000).toFixed(1)}k spent
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full transition-all" 
                            style={{ 
                              width: `${Math.min(pacingPercent, 100)}%`,
                              backgroundColor: pacingPercent > 90 ? '#ef4444' : pacingPercent > 70 ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </div>
                      </div>

                      {/* Alert Icons */}
                      {(campaign.alerts.underperforming || campaign.alerts.slowSpend || campaign.alerts.abmSpike) && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {campaign.alerts.underperforming && (
                            <Badge variant="secondary" className="text-[10px]">
                              ⚠️ Underperforming
                            </Badge>
                          )}
                          {campaign.alerts.slowSpend && (
                            <Badge variant="secondary" className="text-[10px]">
                              ⚠️ Slow spend
                            </Badge>
                          )}
                          {campaign.alerts.abmSpike && (
                            <Badge variant="secondary" className="text-[10px]">
                              🔥 ABM spike
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Channel Breakdown Table - Shows when campaign selected */}
          {currentCampaign && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Channel Breakdown</CardTitle>
                    <CardDescription>
                      Activity details for {currentCampaign.campaignName}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCampaign(null)}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentCampaign.channels.map((channel: string) => {
                  const activities = CHANNEL_ACTIVITIES[channel] || [];
                  return (
                    <div key={channel} className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                        <div>
                          <h3 className="font-semibold text-sm">{channel}</h3>
                          <p className="text-xs text-muted-foreground">{activities.length} activities</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Activity</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Scheduled</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Output</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activities.map((activity: any, idx: number) => (
                              <tr key={idx} className="border-b last:border-0 hover-elevate">
                                <td className="py-3 px-3">{activity.name}</td>
                                <td className="py-3 px-3">{activity.type}</td>
                                <td className="py-3 px-3">
                                  <Badge variant="secondary" className="text-xs">{activity.status}</Badge>
                                </td>
                                <td className="py-3 px-3">{activity.scheduled}</td>
                                <td className="py-3 px-3 font-medium">{activity.output}</td>
                                <td className="py-3 px-3 text-muted-foreground">{activity.notes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
