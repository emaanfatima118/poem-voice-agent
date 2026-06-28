import { Card, CardHeader, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/stackwise-demo/components/ui/avatar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Link, useLocation } from 'wouter'
import { Lightbulb, Activity, Brush, Settings, Search } from 'lucide-react'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { useEffect } from 'react'

export default function Home() {
  const [, setLocation] = useLocation();

  // First-time redirect: Check if user has completed orientation
  useEffect(() => {
    const orientationCompleted = localStorage.getItem('orientationCompleted');
    if (!orientationCompleted) {
      setLocation('/strategy-studio/onboarding?step=orientation');
    }
  }, [setLocation]);
  const moduleColors = {
    home: '#6218df',
    pulse: '#6218df',
    brand: '#c009ba',
    flight: '#1e40f2'
  }

  const budgetTrend = [
    { month: 'Jan', spend: 95000 },
    { month: 'Feb', spend: 110000 },
    { month: 'Mar', spend: 132000 },
    { month: 'Apr', spend: 125000 },
    { month: 'May', spend: 139000 }
  ]

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-8 text-gray-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-6 mb-6">
          {/* Left: Greeting */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="heading-overview">
              Hey there, Brian Ford!
            </h1>
            <p className="text-sm text-muted-foreground">
              Ready to level up today?
            </p>
          </div>

          {/* Center: Search */}
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

          {/* Right: Customize Button + User Profile */}
          <div className="flex items-center gap-3 flex-shrink-0">
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

        {/* Quick Actions + Launch Modules - All on one line */}
        <div className="mb-6 flex gap-2 items-center flex-wrap">
          <QuickActions module="StrategyStudio" inline />
          
          {/* Separator */}
          <div className="h-8 w-px bg-gray-300 mx-1" />
          
          {/* Launch Label */}
          <span className="text-sm font-medium text-gray-600">Launch:</span>
          
          {/* Module Launch Buttons */}
          {[
            { name: 'Strategy Studio', path: '/strategy-studio', icon: Lightbulb, gradient: 'from-[#6218df] via-[#c009ba] to-[#1e40f2]' },
            { name: 'Pulse Hub', path: '/pulse-hub', icon: Activity, gradient: 'from-[#6218df] to-[#4a0fb8]' },
            { name: 'Brand Craft', path: '/brand-craft', icon: Brush, gradient: 'from-[#c009ba] to-[#900890]' },
            { name: 'Flight Deck', path: '/flight-deck', icon: Settings, gradient: 'from-[#1e40f2] to-[#1530c0]' },
          ].map((module) => (
            <Link key={module.name} href={module.path}>
              <Button
                size="icon"
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.gradient} hover:opacity-90 transition-all shadow-sm hover:shadow-md`}
                data-testid={`button-launch-${module.name.toLowerCase().replace(' ', '-')}`}
              >
                <module.icon className="w-5 h-5 text-white" />
              </Button>
            </Link>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Marketing Score', value: 85, color: '#6218df' },
            { label: 'Critical Alerts', value: 3, color: '#FF6B6B' },
            { label: 'Pipeline Activity', value: '$7.1M', color: '#00BFA6' }
          ].map((k, i) => (
            <Card key={i} className="text-center shadow-md border" data-testid={`card-kpi-${i}`}>
              <CardHeader className="font-bold">{k.label}</CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: k.color }}>
                  {k.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center border shadow-sm" data-testid="card-total-spend">
            <CardHeader className="font-bold">Total Spend</CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">$139,000</p>
            </CardContent>
          </Card>
          <Card className="text-center border shadow-sm" data-testid="card-over-under-budget">
            <CardHeader className="font-bold">Over/Under Budget</CardHeader>
            <CardContent>
              <p className="text-green-600 font-semibold">+$12,000</p>
            </CardContent>
          </Card>
          <Card className="text-center border shadow-sm" data-testid="card-spend-by-month">
            <CardHeader className="font-bold">Spend by Month</CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={budgetTrend}>
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis hide />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="spend" fill="#6218df" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights summary */}
        <Card className="mb-8 border shadow-sm" data-testid="card-ai-insights">
          <CardHeader className="font-bold" style={{ color: moduleColors.home }}>
            AI Insights Summary
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <span className="font-bold" style={{ color: moduleColors.pulse }}>
                  Pulse:
                </span>{' '}
                Strengthen Tier 1 account tracking (+8%).
              </li>
              <li>
                <span className="font-bold" style={{ color: moduleColors.brand }}>
                  Brand:
                </span>{' '}
                Amplify AI campaign content (+25%).
              </li>
              <li>
                <span className="font-bold" style={{ color: moduleColors.flight }}>
                  Flight:
                </span>{' '}
                Scale video ads (+12% lift).
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Module snapshots */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border shadow-sm" data-testid="card-pulse-snapshot">
            <CardHeader className="font-bold text-lg" style={{ color: moduleColors.pulse }}>
              Pulse Hub Snapshot
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Top funnel engagement <span className="text-green-600 font-semibold">+10%</span>
              </p>
              <p className="text-sm">
                Conversion rate <span className="text-red-500 font-semibold">-3%</span>
              </p>
              <p className="text-sm">
                Pipeline velocity <span className="text-blue-600 font-semibold">+5%</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm" data-testid="card-brand-snapshot">
            <CardHeader className="font-bold text-lg" style={{ color: moduleColors.brand }}>
              Brand Craft Snapshot
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Messaging: <span className="font-semibold">Strong</span>
              </p>
              <p className="text-sm">
                Top Theme: <span className="font-semibold">AI Strategy</span>
              </p>
              <p className="text-sm">
                Rising Topic: <span className="font-semibold">Compliance</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border shadow-sm" data-testid="card-flight-snapshot">
            <CardHeader className="font-bold text-lg" style={{ color: moduleColors.flight }}>
              Flight Deck Snapshot
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Lift <span className="text-green-600 font-semibold">+8%</span>, Lag stable
              </p>
              <p className="text-sm">3 campaigns above CTR target</p>
              <p className="text-sm">Budget pacing: on track</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent + Keywords */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border shadow-sm" data-testid="card-recent-activity">
            <CardHeader className="font-bold" style={{ color: moduleColors.home }}>
              Recent Activity
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Webinar drove 3 Tier 1 accounts, 1 Discovery Call</li>
                <li>Email campaign produced 4 Tier 2 form fills</li>
                <li>Audit Tool Demo engaged 2 enterprise accounts</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border shadow-sm" data-testid="card-trending-keywords">
            <CardHeader className="font-bold" style={{ color: moduleColors.home }}>
              Trending Keywords
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 text-xs">
                {['AI marketing strategy', 'B2B acceleration', 'content attribution', 'dashboard automation'].map((k) => (
                  <span key={k} className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700">
                    {k}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
