import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/stackwise-demo/components/ui/avatar'
import { Link } from 'wouter'
import { Search, Plus, Lightbulb, FileText, Sparkles, TrendingUp } from 'lucide-react'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'

const BRANDCRAFT_COLOR = '#c009ba'

export default function BrandCraft() {
  // Content Performance Data
  const contentPerformance = [
    { type: 'Blog', value: 75 },
    { type: 'Video', value: 35 },
    { type: 'Guides', value: 60 },
    { type: 'Webinars', value: 45 },
    { type: 'Social', value: 80 },
  ]

  const maxPerformance = Math.max(...contentPerformance.map(c => c.value))

  // Content Engagement Data
  const contentEngagement = [
    { name: 'Sustainability - Terminus', ctr: '0.68%', downloads: 1, shares: 0, pillar: 'AI' },
    { name: 'Compliance WP', ctr: '---', downloads: 58, shares: '---', pillar: 'Compliance' },
    { name: 'Robotics Infographic', ctr: '---', downloads: 18, shares: '---', pillar: 'Compliance' },
  ]

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="heading-brand-craft">
              Hey there, Brian Ford!
            </h1>
            <p className="text-sm text-muted-foreground">
              Light it up — your story deserves the spotlight.
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
              className="bg-[#c009ba] hover:bg-[#c009ba]/90 text-white"
              data-testid="button-customize"
            >
              Customize
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Cristopher Calzoni" />
                <AvatarFallback className="bg-pink-100 text-pink-700 font-semibold">
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
        <QuickActions module="BrandCraft" />

        {/* Title */}
        <h2 className="text-lg font-bold" style={{ color: BRANDCRAFT_COLOR }} data-testid="heading-dashboard">
          Brand Craft Dashboard
        </h2>

        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm" style={{ color: BRANDCRAFT_COLOR }} data-testid="label-messaging-strength">
                Messaging Strength
              </div>
              <div className="text-2xl font-bold mt-2" data-testid="value-messaging-strength">Strong</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm" style={{ color: BRANDCRAFT_COLOR }} data-testid="label-top-theme">
                Top Theme
              </div>
              <div className="text-2xl font-bold mt-2" data-testid="value-top-theme">AI Strategy</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm" style={{ color: BRANDCRAFT_COLOR }} data-testid="label-rising-topic">
                Rising Topic
              </div>
              <div className="text-2xl font-bold mt-2" data-testid="value-rising-topic">Compliance</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights & Recommendations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base" style={{ color: BRANDCRAFT_COLOR }}>
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2" data-testid="insight-1">
                <span className="text-muted-foreground">•</span>
                <span>AI content +25% engagement: produce 3 additional shorts this week.</span>
              </li>
              <li className="flex items-start gap-2" data-testid="insight-2">
                <span className="text-muted-foreground">•</span>
                <span>Compliance short has A/B test subject map on 2 assets.</span>
              </li>
              <li className="flex items-start gap-2" data-testid="insight-3">
                <span className="text-muted-foreground">•</span>
                <span>Rewrite 2 lowest CTR shorts; add clearer CTA.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Content Performance Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base" style={{ color: BRANDCRAFT_COLOR }}>
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentPerformance.map((content) => (
                <div key={content.type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{content.type}</span>
                    <span className="text-sm font-medium">{content.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(content.value / maxPerformance) * 100}%`,
                        backgroundColor: BRANDCRAFT_COLOR,
                      }}
                      data-testid={`bar-${content.type.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Engagement Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base" style={{ color: BRANDCRAFT_COLOR }}>
              Content Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 pb-2 border-b text-xs font-semibold text-muted-foreground">
                <span>Name</span>
                <span className="text-center">CTR</span>
                <span className="text-center">Downloads</span>
                <span className="text-center">Shares</span>
                <span className="text-center">Pillar</span>
              </div>

              {/* Table Rows */}
              {contentEngagement.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 gap-4 py-3 border-b last:border-0 text-sm items-center"
                  data-testid={`row-content-${idx}`}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-center text-muted-foreground">{item.ctr}</span>
                  <span className="text-center font-medium">{item.downloads}</span>
                  <span className="text-center text-muted-foreground">{item.shares}</span>
                  <div className="flex justify-center">
                    <Badge variant="secondary">{item.pillar}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <Button 
            asChild
            className="w-full h-20 text-white flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: BRANDCRAFT_COLOR }}
            data-testid="button-create-content"
          >
            <Link href="/brand-craft/content-creation">
              <Plus className="w-5 h-5" />
              <span>Create Content</span>
            </Link>
          </Button>

          <Button 
            asChild
            className="w-full h-20 text-white flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: BRANDCRAFT_COLOR }}
            data-testid="button-content-audit"
          >
            <Link href="/brand-craft/content-audit">
              <FileText className="w-5 h-5" />
              <span>Content Audit</span>
            </Link>
          </Button>

          <Button 
            asChild
            className="w-full h-20 text-white flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: BRANDCRAFT_COLOR }}
            data-testid="button-campaign-builder"
          >
            <Link href="/brand-craft/campaign-builder">
              <Sparkles className="w-5 h-5" />
              <span>Campaign Builder</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
