import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Progress } from '@/stackwise-demo/components/ui/progress';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/stackwise-demo/components/ui/avatar';
import { ArrowUp, ArrowDown, Lightbulb, TrendingUp, AlertCircle, Plus, Search } from 'lucide-react';
import { QuickActions } from '@/stackwise-demo/components/QuickActions';
import { Link } from 'wouter';

export default function PulseHub() {
  const accountData = [
    { name: 'Acme Corp', logo: '🔵', tier: 1, engagement: 86 },
    { name: 'Helix Systems', logo: '🔴', tier: 2, engagement: 88 },
    { name: 'Vertex Labs', logo: '🔴', tier: 1, engagement: 86 },
    { name: 'Yakima', logo: '🔵', tier: 2, engagement: 86 },
    { name: 'ACME, Inc.', logo: '🔴', tier: 2, engagement: 71 },
  ];

  const kpiProgress = [
    { label: 'KPI 1', progress: 52, color: 'bg-green-500' },
    { label: 'KPI 2', progress: 30, color: 'bg-red-500' },
    { label: 'KPI 3', progress: 85, color: 'bg-teal-500' },
  ];

  const insights = [
    { 
      label: 'Insight 1:', 
      text: 'Conversion -3%: tighten mid-funnel nurture (A/B new CTAs).',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    { 
      label: 'Insight 2:', 
      text: 'Top-of-funnel +10%: scale winning awareness creative.',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    { 
      label: 'Insight 3:', 
      text: '3 Tier 1 accounts inactive 30+ days; assign AE tasks today.',
      icon: Lightbulb,
      color: 'text-blue-600'
    },
  ];

  const funnelStages = [
    { stage: 'Awareness', value: 300, color: 'bg-blue-400' },
    { stage: 'Engagement', value: 220, color: 'bg-blue-300' },
    { stage: 'Consideration', value: 150, color: 'bg-pink-400' },
    { stage: 'Pipeline', value: 90, color: 'bg-yellow-400' },
    { stage: 'Closed', value: 40, color: 'bg-green-500' },
  ];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6">
          {/* Left: Greeting */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="heading-pulse-hub">
              Hey there, Brian Ford!
            </h1>
            <p className="text-sm text-muted-foreground">
              Pulse check — your data's got something to say.
            </p>
          </div>

          {/* Center: Search */}
          <div className="w-full lg:flex-1 lg:max-w-md">
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

          {/* Right: Customize Button + User Profile */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full lg:w-auto justify-between lg:justify-start">
            <Button
              className="bg-[#6218df] hover:bg-[#6218df]/90 text-white"
              data-testid="button-customize"
            >
              Customize
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Cristopher Calzoni" />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
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
        <QuickActions module="PulseHub" />

        {/* Top KPIs */}
        <div className="grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Overall Grade</div>
              <div className="text-3xl font-bold text-green-600">B+</div>
              <div className="text-xs text-green-600 mt-1">Growth</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Pipeline</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">$7.1M</span>
                <Badge variant="secondary" className="text-green-600 bg-green-50">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  5%
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Revenue</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">$2.8M</span>
                <Badge variant="secondary" className="text-red-600 bg-red-50">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  3%
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Loss</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="text-left pb-2 font-medium">Name</th>
                      <th className="text-center pb-2 font-medium">Tier</th>
                      <th className="text-center pb-2 font-medium">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountData.map((account, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{account.logo}</span>
                            <span className="font-medium text-sm">{account.name}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <Badge variant="secondary" className="text-xs">{account.tier}</Badge>
                        </td>
                        <td className="text-center font-semibold text-sm">{account.engagement}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Business Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Goals Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 gap-6">
                  {kpiProgress.map((kpi, idx) => (
                    <div key={idx} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - kpi.progress / 100)}`}
                            className={kpi.color.replace('bg-', 'text-')}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{kpi.label}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Progress: {kpi.progress}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Intel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Intel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <insight.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${insight.color}`} />
                    <div>
                      <span className="font-semibold text-sm">{insight.label}</span>
                      <p className="text-sm text-muted-foreground">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Funnel Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funnel Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {funnelStages.map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-muted-foreground">{stage.stage}</div>
                      <div className="flex-1 relative">
                        <div className={`h-8 ${stage.color} rounded`} style={{ width: `${(stage.value / 300) * 100}%` }} />
                        <span className="absolute right-2 top-1 text-sm font-semibold text-white">{stage.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm text-muted-foreground mb-1">Top Funnel Health</div>
              <div className="text-3xl font-bold text-green-600">+10%</div>
              <div className="text-xs text-green-600 mt-1">Growth</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
              <div className="text-3xl font-bold text-red-600">-3%</div>
              <div className="text-xs text-red-600 mt-1">Loss</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm text-muted-foreground mb-1">Revenue</div>
              <div className="text-3xl font-bold text-green-600">+5%</div>
              <div className="text-xs text-green-600 mt-1">Growth</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 gap-4">
          <Button 
            className="w-full h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center gap-2"
            data-testid="button-start-audit"
          >
            <Plus className="w-5 h-5" />
            <span>Start Audit</span>
          </Button>

          <Button 
            asChild
            className="w-full h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center gap-2"
            data-testid="button-abm-command"
          >
            <Link href="/pulse-hub/abm-command-center">
              <Plus className="w-5 h-5" />
              <span>Launch ABM Command Center</span>
            </Link>
          </Button>

          <Button 
            className="w-full h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center gap-2"
            data-testid="button-generate-report"
          >
            <Plus className="w-5 h-5" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
