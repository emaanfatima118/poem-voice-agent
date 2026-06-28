import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout'
import { Link } from 'wouter'
import { getModuleById } from '@/stackwise-demo/config/modules'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { PushToEvalButton } from '@/stackwise-demo/components/PushToEvalButton'
import { Lightbulb, AlertTriangle, TrendingUp, CheckCircle, Circle, Target, ArrowUpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/stackwise-demo/components/ui/tooltip"

export default function AIIntelligence() {
  const module = getModuleById('pulse-hub')
  const [currentStep, setCurrentStep] = useState('insights')
  const [noodleInput, setNoodleInput] = useState('')
  const moduleColor = '#6218df'
  
  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Pulse Hub</h2>
    </div>
  )

  const steps = [
    { id: 'insights', label: 'Insights', description: 'AI-powered insights' },
    { id: 'eval-matrix', label: 'Eval Matrix', description: 'Smart routing' },
    { id: '30-60-90', label: '30/60/90', description: 'Milestones' },
  ]

  const evalMatrixItems = [
    {
      id: 1,
      title: 'Launch LinkedIn POV Series',
      priority: 'High',
      risk: 'Low',
      status: 'pending',
      impact: '+15% reach, +9% conversions',
      recommendedBy: 'Stackwise Sage'
    },
    {
      id: 2,
      title: 'Email Nurture on HITL',
      priority: 'High',
      risk: 'Medium',
      status: 'in-review',
      impact: '+22% engagement',
      recommendedBy: 'Quarterly Review'
    },
    {
      id: 3,
      title: 'Pulse-to-Flight Sync Experiment',
      priority: 'Medium',
      risk: 'High',
      status: 'pending',
      impact: '+18% efficiency',
      recommendedBy: 'Stackwise Sage'
    }
  ]

  const milestones = {
    '30-day': [
      { title: 'Complete Q4 Strategy Review', status: 'completed' },
      { title: 'Launch HITL Email Series Part 1', status: 'in-progress' },
      { title: 'Set up Pulse-Flight Integration', status: 'pending' }
    ],
    '60-day': [
      { title: 'Launch LinkedIn POV Series (Posts 1-2)', status: 'pending' },
      { title: 'Complete HITL Email Series', status: 'pending' },
      { title: 'Measure Pulse-Flight Efficiency', status: 'pending' }
    ],
    '90-day': [
      { title: 'Complete LinkedIn POV Series (Posts 3-4)', status: 'pending' },
      { title: 'Quarterly Performance Review', status: 'pending' },
      { title: 'Finalize Q1 2026 Strategy', status: 'pending' }
    ]
  }

  const insights = [
    { 
      category: 'Paid Ads - LinkedIn',
      finding: 'CTR up 25%, CPC stable, conversions improving on retargeting ads.',
      insight: 'LinkedIn engagement peaking — leverage momentum while CPC remains efficient.',
      reco: 'Increase retargeting spend by 10% and test creative variant B.',
      priority: '⚡ Important',
      effort: 'Low Effort / High Impact',
      trend: 'up',
      why: 'LinkedIn engagement peaking — leverage momentum while CPC remains efficient.'
    },
    {
      category: 'SEO / Web',
      finding: 'Organic sessions up 14%, conversion rate down 9% on service pages.',
      insight: 'High traffic with weak conversions suggests misaligned messaging or friction.',
      reco: 'Revise CTA placement and test new headline messaging.',
      priority: '🔥 Critical',
      effort: 'Medium Effort / High Impact',
      trend: 'down',
      why: 'High traffic with weak conversions suggests misaligned messaging or friction.'
    },
    {
      category: 'Email / Content',
      finding: 'Open rate steady at 41%, but CTR dropped 6%.',
      insight: 'Improving engagement requires small, fast creative tweaks.',
      reco: 'Add dynamic preview text and introduce mid-funnel offers.',
      priority: '🪶 Quick Win',
      effort: 'Low Effort / Medium Impact',
      trend: 'flat',
      why: 'Improving engagement requires small, fast creative tweaks.'
    }
  ]

  const getPriorityColor = (priority: string) => {
    if (priority.includes('Critical') || priority.includes('🔥')) return 'bg-red-100 text-red-700 border-red-300'
    if (priority.includes('Important') || priority.includes('⚡')) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    if (priority.includes('Quick Win') || priority.includes('🪶')) return 'bg-green-100 text-green-700 border-green-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const renderStepContent = () => {
    if (currentStep === 'insights') {
      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <QuickActions module="PulseHub" />
          
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Insights</h1>
            <p className="text-muted-foreground">Real-time insights and recommendations across your marketing strategy</p>
          </div>

          <div className="grid gap-4">
            {insights.map((item, idx) => (
              <Card key={idx} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-100 hover:shadow-md transition-all" data-testid={`insight-card-${idx}`}>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={`w-4 h-4 ${item.trend==='up'?'text-green-500':item.trend==='down'?'text-red-500':'text-gray-400'}`} />
                    <p className="font-semibold" style={{ color: moduleColor }}>{item.category}</p>
                  </div>
                  <p className="text-gray-700"><strong>Finding:</strong> {item.finding}</p>
                  <p className="text-gray-700"><strong>Insight:</strong> {item.insight}</p>
                  <div className="rounded-lg p-3" style={{ backgroundColor: `${moduleColor}10`, borderColor: `${moduleColor}33`, borderWidth: '1px' }}>
                    <p className="font-semibold flex items-center gap-1" style={{ color: moduleColor }}>
                      <ArrowUpCircle className="w-4 h-4" /> Recommended Action:
                    </p>
                    <p className="text-gray-800">{item.reco}</p>
                  </div>
                  <p className="text-sm text-gray-600"><strong>Why it matters:</strong> {item.why}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(item.priority)} text-xs border-0`}>{item.priority}</Badge>
                    <Badge className="text-xs border-0" style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}>{item.effort}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <Button variant="outline" size="sm" className={`${getPriorityColor(item.priority)} border-0 font-medium`} data-testid={`button-add-to-plan-${idx}`}>
                    Add to 30/60/90
                  </Button>
                  <Button size="sm" data-testid={`button-view-details-${idx}`}>View Details</Button>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Noodle on It</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask Stackwise Sage to explore strategic possibilities
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="e.g., What if we increased LinkedIn posting frequency to 3x/week?"
                value={noodleInput}
                onChange={(e) => setNoodleInput(e.target.value)}
                className="min-h-20"
                data-testid="input-noodle"
              />
              <Button size="sm" data-testid="button-noodle">
                <Lightbulb className="w-4 h-4 mr-2" />
                Explore Scenario
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (currentStep === 'eval-matrix') {
      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Evaluation Matrix</h1>
            <p className="text-muted-foreground">Smart routing based on priority and risk</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations Queue</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review and route strategic recommendations
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evalMatrixItems.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-blue-500 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-700 mb-2">{item.impact}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">Priority: {item.priority}</Badge>
                            <Badge variant="outline" className="text-xs">Risk: {item.risk}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{item.status}</Badge>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Target className="w-5 h-5 text-blue-600" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Recommended by: {item.recommendedBy}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <PushToEvalButton />
                        <Button size="sm" variant="outline" data-testid={`button-defer-${item.id}`}>Defer</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (currentStep === '30-60-90') {
      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">30/60/90 Milestones</h1>
            <p className="text-muted-foreground">Track your quarterly roadmap progress</p>
          </div>

          {Object.entries(milestones).map(([period, items]) => (
            <Card key={period}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{period} Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 border rounded">
                      {milestone.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {milestone.status === 'in-progress' && <Circle className="w-5 h-5 text-blue-600 fill-blue-200" />}
                      {milestone.status === 'pending' && <Circle className="w-5 h-5 text-gray-400" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{milestone.title}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">{milestone.status.replace('-', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderStepContent()}
      moduleColor={moduleColor}
      featureName="AI Intelligence"
    />
  )
}
