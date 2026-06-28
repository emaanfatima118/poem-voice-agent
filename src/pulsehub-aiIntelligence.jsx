"use client"

import { useState } from "react"
import { NavBar } from './components/NavBar'
import Sidebar from './components/pulsehub-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui-replit/card"
import { Button } from "./components/ui-replit/button"
import { Badge } from "./components/ui-replit/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { ThreeColumnLayout } from "./components/ui-replit/three-column-layout"
import { QuickActions } from "./components/ui-replit/quick-actions"
import { 
  Brain, CheckCircle2, ArrowUpCircle, ArrowDownCircle, 
  AlertTriangle, Lightbulb
} from "lucide-react"

export default function AIIntelligence() {
  const moduleColor = '#6218df'
  
  const [selectedMenuItem, setSelectedMenuItem] = useState('AI Intelligence')
  const [currentStep, setCurrentStep] = useState("analytics")
  
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem)
  }

  const steps = [
    { id: "analytics", label: "Analytics", description: "Performance metrics and KPIs" },
    { id: "intelligence", label: "Intelligence", description: "AI-powered insights and recommendations" },
  ]

  const getPriorityColor = (priority) => {
    if (priority.includes('Critical')) return 'bg-red-100 text-red-700 border-red-300'
    if (priority.includes('Important')) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    if (priority.includes('Quick Win')) return 'bg-green-100 text-green-700 border-green-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const leftNav = (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-bold" style={{ color: moduleColor }}>
        Pulse Hub
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground mt-1">Analytics & Intelligence</p>
    </div>
  )

  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              currentStep === step.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={currentStep === step.id ? { backgroundColor: moduleColor } : {}}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="bg-white px-4 md:px-8 py-4 border-b border-purple-100 sticky top-0 z-10">
          <h1 className="text-xl md:text-3xl font-bold mb-2" style={{ color: moduleColor }}>
            Analytics & Intelligence
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Performance metrics, KPIs, and AI-powered insights and recommendations for your marketing strategy.
          </p>
        </div>

        <div className="p-4 md:p-8">
          {currentStep === "analytics" && (
            <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
            {/* Business Goals */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4" style={{ color: moduleColor }}>Business Goals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {['Pipeline Growth', 'SQL Volume', 'Conversion Efficiency'].map((goal, i) => (
                  <Card key={i} className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3 md:pb-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle className="text-base md:text-lg font-semibold text-gray-800 leading-tight">{goal}</CardTitle>
                        <span className="text-green-600 font-semibold text-sm md:text-base whitespace-nowrap">▲ +8%</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1" style={{ color: moduleColor }}>+12%</p>
                      <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-1">vs last 30 days</p>
                      <p className="text-xs md:text-sm italic text-gray-600 leading-relaxed">
                        <span className="text-gray-500">AI Insight: </span>
                        Efficiency gains driven by reallocated paid media and content refresh.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Visibility + Performance */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: moduleColor }}>Visibility + Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
                {[
                  {label:'Sessions',value:'12,450',trend:'+9%',color:'text-green-600'},
                  {label:'Visitors',value:'9,880',trend:'+6%',color:'text-green-600'},
                  {label:'Pageviews',value:'37,200',trend:'+11%',color:'text-green-600'},
                  {label:'Avg. Time on Site',value:'2m 14s',trend:'-3%',color:'text-red-500'}
                ].map((metric,i)=>(
                  <div key={i} className="p-4 border border-gray-200 rounded-md shadow-sm flex flex-col justify-center min-h-[100px] md:min-h-[120px]">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5" style={{ color: moduleColor }}>{metric.value}</p>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className={`text-xs font-semibold ${metric.color}`}>{metric.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Indicators */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: moduleColor }}>Engagement Indicators</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
                {[
                  {label:'CTR',value:'3.4%',trend:'-2%',color:'text-red-500'},
                  {label:'Engagement Rate',value:'6.1%',trend:'+5%',color:'text-green-600'},
                  {label:'Form Fills',value:'420',trend:'+9%',color:'text-green-600'},
                  {label:'Returning Visitors',value:'44%',trend:'+3%',color:'text-green-600'}
                ].map((metric,i)=>(
                  <div key={i} className="p-4 border border-gray-200 rounded-md shadow-sm flex flex-col justify-center min-h-[100px] md:min-h-[120px]">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5" style={{ color: moduleColor }}>{metric.value}</p>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className={`text-xs font-semibold ${metric.color}`}>{metric.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Web Traffic Overview */}
            <div>
              <div className="flex flex-wrap justify-end gap-2 md:gap-3 mb-3">
                {['7D', '14D', '30D', 'MoM', 'QoQ', 'YoY'].map((filter, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="text-xs border-gray-300 text-gray-700 hover:text-[#351c75] hover:border-[#351c75]"
                    style={{
                      color: 'inherit',
                      borderColor: 'rgb(209, 213, 219)'
                    }}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: moduleColor }}>Web Traffic Overview</h3>
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="pt-4 md:pt-6">
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer width="100%" height={250} minHeight={200}>
                      <LineChart data={[
                        {name:'Week 1',visits:4000,unique:3000},
                        {name:'Week 2',visits:5200,unique:3900},
                        {name:'Week 3',visits:6100,unique:4500},
                        {name:'Week 4',visits:7200,unique:5600}
                      ]}> 
                        <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                        <YAxis tick={{ fontSize: 12 }}/>
                        <RechartsTooltip/>
                        <Line type="monotone" dataKey="visits" stroke="#004aad" strokeWidth={2}/>
                        <Line type="monotone" dataKey="unique" stroke="#cb6ce6" strokeWidth={2}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lead Quality & Pipeline Health */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: moduleColor }}>Lead Quality & Pipeline Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
                {[
                  {label:'Lead Quality Score',value:'8.2/10',trend:'+5%',color:'text-green-600'},
                  {label:'# Leads → Opps',value:'72%',trend:'+3%',color:'text-green-600'},
                  {label:'Opportunity Creation Rate',value:'28%',trend:'-1%',color:'text-yellow-500'},
                  {label:'Cost per SQL',value:'$142',trend:'-12%',color:'text-green-600'}
                ].map((metric,i)=>(
                  <div key={i} className="p-4 border border-gray-200 rounded-md shadow-sm flex flex-col justify-center min-h-[100px] md:min-h-[120px]">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5" style={{ color: moduleColor }}>{metric.value}</p>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className={`text-xs font-semibold ${metric.color}`}>{metric.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Engagements */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: moduleColor }}>Campaign Engagements</h3>
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="pt-4 md:pt-6">
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer width="100%" height={250} minHeight={200}>
                      <BarChart data={[
                        {name:'Email',value:85},
                        {name:'Social',value:68},
                        {name:'Paid',value:54},
                        {name:'Content',value:92}
                      ]}> 
                        <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                        <YAxis tick={{ fontSize: 12 }}/>
                        <RechartsTooltip/>
                        <Bar dataKey="value" fill="#004aad" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs md:text-sm mt-3 text-gray-600 leading-relaxed">AI: Email and content campaigns outperform in engagement rate. Social engagement stable, Paid declining — refine creative on underperforming ads.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === "intelligence" && (
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: moduleColor }}>AI Findings, Insights & Recommendations</h2>
                
                {/* Summary Overview */}
              <Card className="bg-white border border-gray-100 shadow-sm mb-4 md:mb-6">
                <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2" style={{ color: moduleColor }}>
                      <Brain className="w-4 h-4 md:w-5 md:h-5" /> Summary Overview
                    </h3>
                    <Badge variant="secondary">Updated 2 hrs ago</Badge>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 flex flex-wrap items-center gap-2">
                    <ArrowUpCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <span className="text-green-700 font-medium">Performance improving overall</span>
                    <ArrowDownCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    <span className="text-red-600">Conversions trending slightly down</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <Card className="p-3 md:p-4 border-l-4 border-green-500 bg-green-50">
                      <p className="flex items-center gap-1 font-semibold text-green-800 text-sm md:text-base">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> Top Strength:
                      </p>
                      <p className="text-gray-700 text-xs md:text-sm mt-2">Paid Ads (LinkedIn) delivering 32% higher CTR; creative A/B #2 performing best.</p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Why it matters: Indicates strong audience resonance — scale winning creatives.</p>
                    </Card>
                    <Card className="p-3 md:p-4 border-l-4 border-red-500 bg-red-50">
                      <p className="flex items-center gap-1 font-semibold text-red-800 text-sm md:text-base">
                        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" /> Top Gap:
                      </p>
                      <p className="text-gray-700 text-xs md:text-sm mt-2">Organic traffic declined 15% MoM; top blogs lost SEO rank.</p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Why it matters: Lost visibility impacts pipeline long-term — address urgently.</p>
                    </Card>
                    <Card className="p-3 md:p-4 border-l-4 border-blue-500 bg-blue-50">
                      <p className="flex items-center gap-1 font-semibold text-blue-800 text-sm md:text-base">
                        <Lightbulb className="w-3 h-3 md:w-4 md:h-4" /> Quick Win:
                      </p>
                      <p className="text-gray-700 text-xs md:text-sm mt-2">Move CTA above fold on landing page — high engagement, low conversion.</p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Why it matters: Simple change, high ROI — implement within 48 hours.</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Insights */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="pt-4 md:pt-6">
                  <ul className="space-y-4 md:space-y-6">
                    <li className="border-b pb-3 md:pb-4 last:border-0">
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Finding:</strong> Landing page engagement high but conversions lag.
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Insight:</strong> CTA is positioned below the fold, reducing immediate action.
                      </div>
                      <div className="mb-3">
                        <strong className="text-gray-800 text-sm md:text-base">Recommendation (Quick Win):</strong> Move primary CTA above fold and test contrasting button colors.
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">
                          Predicted Impact: +6% conversions | Confidence: <span className="text-green-600 font-semibold">High</span>
                        </span>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: moduleColor, color: 'white' }}
                          data-testid="button-add-eval-0"
                        >
                          +Eval
                        </Button>
                      </div>
                    </li>

                    <li className="border-b pb-3 md:pb-4 last:border-0">
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Finding:</strong> Paid LinkedIn campaigns outperform in SQL quality metrics.
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Insight:</strong> Underinvestment in best-performing channel while over-spending on lower-performing Terminus ads.
                      </div>
                      <div className="mb-3">
                        <strong className="text-gray-800 text-sm md:text-base">Recommendation (Important):</strong> Shift 15% of budget from Terminus to LinkedIn and A/B test new creative variations.
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">
                          Predicted Impact: +8% pipeline quality | Confidence: <span className="text-green-600 font-semibold">High</span>
                        </span>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: moduleColor, color: 'white' }}
                          data-testid="button-add-eval-1"
                        >
                          +Eval
                        </Button>
                      </div>
                    </li>

                    <li className="border-b pb-3 md:pb-4 last:border-0">
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Finding:</strong> Organic traffic declined 15% month-over-month.
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Insight:</strong> High-value blog posts lost search engine rankings due to outdated content and reduced backlink authority.
                      </div>
                      <div className="mb-3">
                        <strong className="text-gray-800 text-sm md:text-base">Recommendation (Critical):</strong> Refresh top 10 blog posts with current data, rebuild backlinks, and optimize for target keywords.
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">
                          Predicted Impact: +12% organic traffic | Confidence: <span className="text-yellow-500 font-semibold">Medium</span>
                        </span>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: moduleColor, color: 'white' }}
                          data-testid="button-add-eval-2"
                        >
                          +Eval
                        </Button>
                      </div>
                    </li>

                    <li className="border-b pb-3 md:pb-4 last:border-0">
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Finding:</strong> Email click-through rate dropped 12% over last 60 days.
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Insight:</strong> Long-form email content causing reader fatigue and declining engagement.
                      </div>
                      <div className="mb-3">
                        <strong className="text-gray-800 text-sm md:text-base">Recommendation (Quick Win):</strong> Shorten email copy to 3-4 short paragraphs, rotate CTA styles, and A/B test subject lines.
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">
                          Predicted Impact: +5% engagement | Confidence: <span className="text-green-600 font-semibold">High</span>
                        </span>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: moduleColor, color: 'white' }}
                          data-testid="button-add-eval-3"
                        >
                          +Eval
                        </Button>
                      </div>
                    </li>

                    <li className="border-b pb-3 md:pb-4 last:border-0">
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Finding:</strong> Mobile users spend 40% less time on page compared to desktop users.
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800 text-sm md:text-base">Insight:</strong> Page speed issues and suboptimal mobile layout causing poor user experience.
                      </div>
                      <div className="mb-3">
                        <strong className="text-gray-800 text-sm md:text-base">Recommendation (Critical):</strong> Optimize mobile page speed, implement mobile-first responsive design, and compress images.
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">
                          Predicted Impact: +9% session time | Confidence: <span className="text-yellow-500 font-semibold">Medium</span>
                        </span>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: moduleColor, color: 'white' }}
                          data-testid="button-add-eval-4"
                        >
                          +Eval
                        </Button>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMainContent = () => (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
      <div className="px-4 md:px-8 py-4 border-b sticky top-0 z-10 bg-white">
        <QuickActions module="PulseHub" />
      </div>
      {renderContent()}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16">
        <Sidebar selectedMenuItem={selectedMenuItem} onMenuItemClick={handleMenuItemClick} />

        <div className="flex-1 min-w-0">
          <NavBar />

          {mobileStepsNav}

          <ThreeColumnLayout
            leftNav={leftNav}
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            content={renderMainContent()}
            moduleColor={moduleColor}
            completedSteps={[]}
            featureName="Analytics & Intelligence"
          />
        </div>
      </div>
    </div>
  )
}
