"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Plus, FileText, Sparkles } from 'lucide-react'
import { QuickActions } from '@/components/QuickActions'
import Link from 'next/link'

export default function BrandCraftDashboard() {
  const moduleColor = '#c009ba'
  
  const contentPerf = [
    { name: "Blog", value: 75 },
    { name: "Video", value: 35 },
    { name: "Guides", value: 60 },
    { name: "Webinars", value: 45 },
    { name: "Social", value: 80 }
  ]
  
  const contentEngagementRows = [
    ["Sustainability - Terminus", "0.68%", 1, 0, "AI"],
    ["Compliance WP", "—", 58, "—", "Compliance"],
    ["Robotics Infographic", "—", 18, "—", "Compliance"]
  ]

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-8 bg-white text-gray-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-6 mb-6">
          {/* Left: Greeting */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="heading-brand-craft">
              Hey there, Brian Ford!
            </h1>
            <p className="text-sm text-muted-foreground">
              Light it up — your story deserves the spotlight.
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

        {/* Brand Craft Dashboard Title */}
        <h2 className="text-2xl font-bold mb-4" style={{ color: moduleColor }}>
          Brand Craft Dashboard
        </h2>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center border shadow-sm">
            <CardHeader className="font-bold" style={{ color: moduleColor }}>
              Messaging Strength
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 font-bold text-lg">Strong</p>
            </CardContent>
          </Card>
          <Card className="text-center border shadow-sm">
            <CardHeader className="font-bold" style={{ color: moduleColor }}>
              Top Theme
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 font-bold text-lg">AI Strategy</p>
            </CardContent>
          </Card>
          <Card className="text-center border shadow-sm">
            <CardHeader className="font-bold" style={{ color: moduleColor }}>
              Rising Topic
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 font-bold text-lg">Compliance</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights & Recommendations */}
        <Card className="border mb-6 shadow-sm">
          <CardHeader className="font-bold" style={{ color: moduleColor }}>
            AI Insights & Recommendations
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>
        AI content +25% engagement: produce 3 additional shorts this week.
              </li>
              <li>
 Compliance pillars flat: A/B test subject lines on 2 assets.
              </li>
              <li>
  Rewrite 2 lowest CTR assets; add clearer CTA.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card className="border mb-6 shadow-sm">
          <CardHeader className="font-bold" style={{ color: moduleColor }}>
            Content Performance
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentPerf.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-20">{item.name}</span>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: moduleColor
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-10 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Engagement */}
        <Card className="border mb-6 shadow-sm">
          <CardHeader className="font-bold" style={{ color: moduleColor }}>
            Content Engagement
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="opacity-80">
                  <tr>
                    <th className="text-left">Name</th>
                    <th>CTR</th>
                    <th>Downloads</th>
                    <th>Shares</th>
                    <th>Pillar</th>
                  </tr>
                </thead>
                <tbody>
                  {contentEngagementRows.map((r, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-2">{r[0]}</td>
                      <td className="text-center">{r[1]}</td>
                      <td className="text-center">{r[2]}</td>
                      <td className="text-center">{r[3]}</td>
                      <td className="text-center">
                        <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                          {r[4]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/brand-craft/content-creation" className="w-full">
            <Button 
              className="text-white flex flex-col items-center justify-center gap-2 w-full py-8 text-base font-semibold rounded-lg shadow-sm" 
              style={{ backgroundColor: moduleColor }}
            >
              <Plus className="w-6 h-6" />
              Create Content
            </Button>
          </Link>
          <Link href="/brand-craft/content-audit" className="w-full">
            <Button 
              className="text-white flex flex-col items-center justify-center gap-2 w-full py-8 text-base font-semibold rounded-lg shadow-sm" 
              style={{ backgroundColor: moduleColor }}
            >
              <FileText className="w-6 h-6" />
              Content Audit
            </Button>
          </Link>
          <Link href="/brand-craft/campaign-builder" className="w-full">
            <Button 
              className="text-white flex flex-col items-center justify-center gap-2 w-full py-8 text-base font-semibold rounded-lg shadow-sm" 
              style={{ backgroundColor: moduleColor }}
            >
              <Sparkles className="w-6 h-6" />
              Campaign Builder
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
