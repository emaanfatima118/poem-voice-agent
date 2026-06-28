import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/stackwise-demo/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/stackwise-demo/components/ui/dialog'
import { Input } from '@/stackwise-demo/components/ui/input'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { 
  Brain, 
  Layers, 
  Target, 
  Users, 
  BarChart3, 
  ClipboardCheck, 
  Workflow, 
  AlertTriangle,
  FileText,
  Download,
  TrendingUp,
  Calendar,
  Save
} from 'lucide-react'

export default function CampaignInsights() {
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly')
  const [activeSection, setActiveSection] = useState('exec-summary')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [reportName, setReportName] = useState('')
  const mainContentRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'exec-summary', label: 'Executive Summary', icon: FileText },
    { id: 'key-learnings', label: 'Key Learnings & SWOT', icon: Brain },
    { id: 'performance', label: 'Campaign Performance', icon: Layers },
    { id: 'goals', label: 'Goal Alignment', icon: Target },
    { id: 'audience', label: 'Audience & Messaging', icon: Users },
    { id: 'channels', label: 'Channel & Execution', icon: BarChart3 },
    { id: 'process', label: 'Process & Optimization', icon: ClipboardCheck },
    { id: 'operations', label: 'Operational Efficiency', icon: Workflow },
    { id: 'root', label: 'Root Cause & Future Focus', icon: AlertTriangle }
  ]

  // Get specific time period string
  const getSpecificTimePeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.toLocaleDateString('en-US', { month: 'long' })
    const quarter = Math.floor(now.getMonth() / 3) + 1
    
    switch (timePeriod) {
      case 'monthly':
        return `${month} ${year}`
      case 'quarterly':
        return `Q${quarter} ${year}`
      case 'annual':
        return `${year}`
      default:
        return ''
    }
  }

  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element && mainContentRef.current) {
      const mainTop = mainContentRef.current.offsetTop
      const elementTop = element.offsetTop
      mainContentRef.current.scrollTo({
        top: elementTop - mainTop - 20,
        behavior: 'smooth'
      })
    }
  }

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return
      
      const scrollPosition = mainContentRef.current.scrollTop + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition + mainContentRef.current.offsetTop) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    const mainContent = mainContentRef.current
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll)
      return () => mainContent.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  const handleSaveReport = () => {
    if (!reportName.trim()) {
      alert('Please enter a report name')
      return
    }
    // In a real app, this would save to backend
    alert(`Report "${reportName}" for ${getSpecificTimePeriod()} saved successfully!`)
    setSaveDialogOpen(false)
    setReportName('')
  }

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF/Excel
    alert(`Exporting ${getSpecificTimePeriod()} Campaign Insights Report...`)
  }

  return (
    <div className="h-full flex bg-background">
      {/* Left Navigation - Column 1 */}
      <div className="w-64 border-r p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-flightdeck-start to-flightdeck-end bg-clip-text text-transparent mb-2">
            Campaign Insights
          </h2>
          <p className="text-xs text-muted-foreground">
            Comprehensive campaign performance analysis
          </p>
        </div>

        {/* Time Period Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Time Period</label>
          <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)}>
            <TabsList className="w-full grid grid-cols-3" data-testid="tabs-time-period">
              <TabsTrigger value="monthly" className="text-xs" data-testid="tab-monthly">
                <Calendar className="w-3 h-3 mr-1" />
                Month
              </TabsTrigger>
              <TabsTrigger value="quarterly" className="text-xs" data-testid="tab-quarterly">
                <Calendar className="w-3 h-3 mr-1" />
                Qtr
              </TabsTrigger>
              <TabsTrigger value="annual" className="text-xs" data-testid="tab-annual">
                <Calendar className="w-3 h-3 mr-1" />
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Section Navigation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Sections</label>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                    activeSection === section.id
                      ? 'bg-flightdeck-start/10 text-flightdeck-start font-medium'
                      : 'hover-elevate'
                  }`}
                  data-testid={`nav-${section.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" data-testid="button-save">
                <Save className="w-4 h-4 mr-2" />
                Save Report
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-save-report">
              <DialogHeader>
                <DialogTitle>Save Campaign Insights Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Name</label>
                  <Input
                    placeholder="e.g., Q4 2024 Campaign Review"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    data-testid="input-report-name"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Time Period: {getSpecificTimePeriod()}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)} data-testid="button-cancel-save">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveReport} data-testid="button-confirm-save">
                    Save Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="w-full" onClick={handleExportReport} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Content Area - Column 2 */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto p-8 space-y-8">
        <QuickActions module="FlightDeck" />
        
        {/* Header with Specific Period Display */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-flightdeck-start to-flightdeck-end bg-clip-text text-transparent">
              Campaign Insights Report
            </h1>
            <p className="text-lg font-semibold mt-1">
              {getSpecificTimePeriod()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive analysis and strategic recommendations
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Last updated: Today</span>
          </div>
        </div>

        {/* Executive Summary */}
        <section id="exec-summary" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-flightdeck-start" />
            Executive Summary
          </h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm leading-relaxed">
                Campaigns this {timePeriod === 'monthly' ? 'month' : timePeriod === 'quarterly' ? 'quarter' : 'year'} showed strong alignment with strategic objectives, high engagement in digital-first channels, and measurable ROI impact. The team executed 24 campaigns, 19 launched on time, and 16 exceeded primary KPIs. Performance highlights include improved audience precision, greater creative consistency, and significant collaboration improvements across sales and marketing.
              </p>
              <p className="text-sm leading-relaxed">
                Key takeaways point to a maturing system of feedback and execution. Strategic alignment remains strong, but there are opportunities to tighten pre-launch readiness, reduce approval delays, and expand data quality checks to improve real-time optimization.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Learnings & SWOT */}
        <section id="key-learnings" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-flightdeck-start" />
            Key Learnings & SWOT Overview
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths & Weaknesses */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-green-600">Strengths</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Strategic cohesion across campaigns and departments improved by 22%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Early testing and feedback loops led to higher optimization success</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Clearer messaging frameworks from BrandCraft boosted consistency</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-red-600">Weaknesses</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>Creative delays impacted 16% of campaign timelines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>Inconsistent data tagging limited cross-channel attribution</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Opportunities & Threats */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-600">Opportunities</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">→</span>
                        <span>Automate budget pacing, asset readiness, and A/B testing insights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">→</span>
                        <span>Strengthen coordination between strategy and content teams pre-launch</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">→</span>
                        <span>Expand benchmarking to identify competitive white space</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-orange-600">Threats</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">!</span>
                        <span>External market volatility and algorithmic changes impacting CPMs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">!</span>
                        <span>Resource dependency on manual QA and review cycles</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Campaign Performance */}
        <section id="performance" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-flightdeck-start" />
            Campaign Performance Overview
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Key Performance Insights</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• High-performing campaigns shared consistent goals and channel fit</li>
                      <li>• Campaigns launched on time performed 1.3x better than delayed ones</li>
                      <li>• Root cause failures: timing slippage, unclear ownership, approval drag</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Optimization Results</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• 4 campaigns required mid-flight optimization—average uplift 18%</li>
                      <li>• Predictive lift models achieved 92% accuracy for top 5 campaigns</li>
                      <li>• Common characteristics of top performers identified</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>
                      <p>✓ Which campaigns performed well?</p>
                      <p>✓ What did they have in common?</p>
                      <p>✓ If campaigns didn't perform well, what might have helped?</p>
                    </div>
                    <div>
                      <p>✓ Can we identify a root cause?</p>
                      <p>✓ What patterns emerged across successes?</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Goal Alignment */}
        <section id="goals" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-flightdeck-start" />
            Goal Alignment & KPI Fit
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Business Alignment</h3>
                  <p className="text-sm mb-3">Goal alignment score: 89%. Campaigns tightly mapped to growth priorities.</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-flightdeck-start to-flightdeck-end" style={{ width: '89%' }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">Relevance</h3>
                  <p className="text-sm mb-3">Adaptability to market shifts improved KPI completion by 14%.</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-flightdeck-start to-flightdeck-end" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">Outcome</h3>
                  <p className="text-sm mb-3">Lead Gen +10%, Pipeline Influence +18%, ROI +15% vs last period.</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-flightdeck-start to-flightdeck-end" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p>✓ Did the campaign align with overall business objectives?</p>
                    <p>✓ Were the original campaign goals still relevant at execution?</p>
                  </div>
                  <div>
                    <p>✓ Did we achieve our specific, measurable goals (KPIs)?</p>
                    <p>✓ Did market conditions change during the campaign?</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Audience & Messaging */}
        <section id="audience" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-flightdeck-start" />
            Audience & Messaging Insights
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Audience Reach & Engagement</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 74% of impressions reached target persona segments</li>
                    <li>• Outcome-based storytelling outperformed product copy 2.4x</li>
                    <li>• Multi-touch engagement up 12%, driven by personalized follow-ups</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Content Performance</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Content resonance strongest with executive-level messaging</li>
                    <li>• Sentiment tracking reveals 9% improvement in trust and recall</li>
                    <li>• Demographics matched target profiles within 8% variance</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p>✓ Did we reach our ideal target audience?</p>
                    <p>✓ Were demographics/psychographics as expected?</p>
                    <p>✓ Which content types performed best per channel?</p>
                  </div>
                  <div>
                    <p>✓ What messaging resonated most strongly?</p>
                    <p>✓ What does data reveal about customer motivations?</p>
                    <p>✓ What pain points did we uncover?</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Channel & Execution */}
        <section id="channels" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-flightdeck-start" />
            Channel & Execution Effectiveness
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Channel ROI Analysis</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Top ROI channels: LinkedIn (+156%), Email (+88%), Paid Search (+74%)</li>
                    <li>• Display and webinars underperformed due to low engagement intent</li>
                    <li>• Multi-device continuity 84%—improved UX consistency by 9%</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Execution Quality</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 5 campaigns required optimization—avg. post-lift +1.5x CTR</li>
                    <li>• Landing page bounce rates improved by 11% post-QA automation</li>
                    <li>• Quality leads progressed through funnel at 67% rate</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p>✓ Which channels delivered highest ROI?</p>
                    <p>✓ Was experience consistent across all channels?</p>
                    <p>✓ Were there bottlenecks in the customer journey?</p>
                  </div>
                  <div>
                    <p>✓ Did we generate quality or just high-volume leads?</p>
                    <p>✓ What traffic sources produced highest-value leads?</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Process & Optimization */}
        <section id="process" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-flightdeck-start" />
            Process Adherence & Optimization
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Process Compliance</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• On-time launches: 83%; delays linked to creative and review bottlenecks</li>
                    <li>• 94% checklist adherence; skipped reviews correlated with -12% KPI score</li>
                    <li>• Budget variance +7%—caused by late campaign pivots</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Optimization Wins</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 4 automation wins—A/B optimization, bidding, and asset scheduling</li>
                    <li>• Inter-team collaboration up 21% via HITL sync reviews</li>
                    <li>• Approval cycle time reduced by 15% with new workflow</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p>✓ Were campaigns launched on time?</p>
                    <p>✓ What held up campaign launches?</p>
                    <p>✓ How many campaigns required re-optimization?</p>
                  </div>
                  <div>
                    <p>✓ Were all pre-launch checklists followed?</p>
                    <p>✓ Did any team become a bottleneck?</p>
                    <p>✓ Where can we improve next time?</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Operational Efficiency */}
        <section id="operations" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="w-6 h-6 text-flightdeck-start" />
            Operational Efficiency & Process Health
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Team Efficiency</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Communication clarity: +19% fewer revisions and rework</li>
                    <li>• 87% of assets were production-ready on time</li>
                    <li>• Key bottlenecks: QA turnaround, CRM sync lag, format conversions</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Resource Management</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Budget adherence: 92%; overages mainly from paid experiment scaling</li>
                    <li>• Start: Enforcing readiness reviews</li>
                    <li>• Stop: Skipping QA steps</li>
                    <li>• Continue: Proactive team huddles</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p>✓ Was communication between teams clear?</p>
                    <p>✓ Did miscommunication cause delays?</p>
                    <p>✓ Were creative assets ready on time?</p>
                  </div>
                  <div>
                    <p>✓ Was campaign executed within budget?</p>
                    <p>✓ Were there unexpected costs?</p>
                    <p>✓ What are the Start, Stop, Continue actions?</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Root Cause & Future Focus */}
        <section id="root" className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-flightdeck-start" />
            Root Cause Analysis & Future Focus
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-3">Primary Findings</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Primary breakdowns: timing delays, review bottlenecks, inconsistent ownership</li>
                  <li>• Comparative benchmark: top 20% of peers in engagement, below avg. in creative readiness</li>
                  <li>• Future roadmap: formalize pre-launch QA, expand dashboard alerts, implement predictive flight monitoring</li>
                </ul>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-sm mb-3">Diagnostic Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <p>✓ What were the primary breakdowns across campaigns?</p>
                    <p>✓ What patterns emerged across failures or delays?</p>
                  </div>
                  <div>
                    <p>✓ How can findings inform predictive improvements?</p>
                    <p>✓ How do we compare to industry benchmarks?</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  className="bg-gradient-to-r from-flightdeck-start to-flightdeck-end" 
                  onClick={handleExportReport}
                  data-testid="button-download-full-report"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
