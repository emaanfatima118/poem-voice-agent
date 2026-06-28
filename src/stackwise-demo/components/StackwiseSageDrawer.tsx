import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Card, CardHeader, CardContent } from '@/stackwise-demo/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/stackwise-demo/components/ui/tabs'
import { Lightbulb, Zap, FilePlus2, AlertTriangle, ArrowUpCircle, MinusCircle, TrendingUp, Flame, BarChart3, ChevronUp, Info } from 'lucide-react'
import { Input } from '@/stackwise-demo/components/ui/input'
import { PushToEvalButton } from '@/stackwise-demo/components/PushToEvalButton'

const emblemIcon = '/stackwise-demo/stackwise-emblem-white.png';

interface StackwiseSageDrawerProps {
  module?: 'Strategy' | 'PulseHub' | 'BrandCraft' | 'FlightDeck'
}

export function StackwiseSageDrawer({ module = 'BrandCraft' }: StackwiseSageDrawerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('insights')
  const [runningSim, setRunningSim] = useState(false)
  const [simQuestion, setSimQuestion] = useState('')
  const [simResult, setSimResult] = useState<{ text: string; impact: string } | null>(null)
  const [activityInput, setActivityInput] = useState('')

  const moduleStyles: Record<string, { border: string; bgLight: string; bgSelected: string; bgSelectedColor: string; hover: string; text: string; textColor: string; isGradient?: boolean }> = {
    Strategy: { border: 'border-[#6218df]', bgLight: 'bg-[#ede9fe]', bgSelected: 'bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2]', bgSelectedColor: '#9c88f5', hover: 'hover:bg-[#cbbdf9]', text: 'text-[#6218df]', textColor: '#6218df', isGradient: true },
    PulseHub: { border: 'border-[#6218df]', bgLight: 'bg-[#ede9fe]', bgSelected: 'bg-[#9c88f5]', bgSelectedColor: '#9c88f5', hover: 'hover:bg-[#cbbdf9]', text: 'text-[#6218df]', textColor: '#6218df' },
    BrandCraft: { border: 'border-[#c009ba]', bgLight: 'bg-[#fbe6f4]', bgSelected: 'bg-[#d950aa]', bgSelectedColor: '#d950aa', hover: 'hover:bg-[#eca5d2]', text: 'text-[#c009ba]', textColor: '#c009ba' },
    FlightDeck: { border: 'border-[#1e40f2]', bgLight: 'bg-[#e0e7ff]', bgSelected: 'bg-[#768cff]', bgSelectedColor: '#768cff', hover: 'hover:bg-[#a3b5ff]', text: 'text-[#1e40f2]', textColor: '#1e40f2' }
  }
  const style = moduleStyles[module] || { border: 'border-pink-600', bgLight: 'bg-pink-50', bgSelected: 'bg-pink-400', bgSelectedColor: '#ec4899', hover: 'hover:bg-pink-200', text: 'text-pink-600', textColor: '#ec4899' }

  const insights = [
    { label: 'AI Visibility', detail: 'HITL and AI-integrated content outperform generic automation posts by 2.2x.', alert: 'high' },
    { label: 'Market Trend', detail: 'B2B adoption of human-in-the-loop AI rose 41% YoY. Position HITL as "growth accelerator."', alert: 'critical' },
    { label: 'SEO Trend', detail: 'Searches for "ethical AI marketing" up 67% QoQ; long-form content favored.', alert: 'medium' },
    { label: 'Engagement Channels', detail: 'LinkedIn video posts show +14% dwell time vs. static images.', alert: 'high' },
    { label: 'Email Cadence', detail: 'Open rates dip after 3+ emails/week; segment sends for better timing.', alert: 'medium' }
  ]

  const recos = [
    {
      priority: 1,
      name: 'Develop & Launch 3-Part Email Nurture Series on HITL',
      impact: '+22% engagement, +10% lead quality',
      why: 'Leads show strong intent on HITL topics; nurture opportunity exists.',
      expected:
        'Each email delivers a single key insight:\n1. Trends & Current State of AI\n2. What is HITL + practical applications\n3. Steps to become a better HITL operator',
      support: 'Supporting content: 3 articles, 1 webinar clip, 2 client examples.',
      action: 'Add to Eval Matrix'
    },
    {
      priority: 2,
      name: 'Run Pulse-to-Flight Experiment',
      impact: '+18% efficiency',
      why: 'Disconnected data between analytics & execution causing delays.',
      expected: 'Test direct campaign sync from PulseHub → FlightDeck for 2 campaigns; measure delivery & response lag.',
      support: 'Setup required: HubSpot + PulseHub data sync.',
      action: 'Add to Eval Matrix'
    },
    {
      priority: 3,
      name: 'Rebuild LinkedIn POV Series',
      impact: '+15% reach, +9% conversions',
      why: 'Exec-level posts outperform company content. Revive POV leadership content.',
      expected:
        '4-part post series:\n1. Future of Human + AI collaboration\n2. Leadership role in data ethics\n3. Reframing automation anxiety\n4. Bringing empathy back to marketing.',
      support: 'Supporting content: Use BrandCraft tone analysis insights.',
      action: 'Add to Eval Matrix'
    }
  ].sort((a, b) => a.priority - b.priority)

  const myPlays = [
    { name: 'Customer Proof Sprint', note: 'Considering for Q1' },
    { name: 'ABM Campaign Tune-up', note: 'Pending approval' },
    { name: 'Awareness Reboot', note: 'Draft under review' }
  ]

  const alertColor = (type: string) => {
    if (type === 'critical') return 'bg-red-100 text-red-700 border-red-300'
    if (type === 'high') return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    if (type === 'medium') return 'bg-blue-100 text-blue-700 border-blue-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getImpactIcon = (impact: string) => {
    if (impact.includes('high')) return <ArrowUpCircle className="w-3 h-3 text-green-600 inline-block mr-1" />
    if (impact.includes('medium')) return <MinusCircle className="w-3 h-3 text-yellow-600 inline-block mr-1" />
    return <AlertTriangle className="w-3 h-3 text-red-600 inline-block mr-1" />
  }

  const runSimulation = () => {
    if (!simQuestion.trim()) return
    setRunningSim(true)
    setTimeout(() => {
      const rand = Math.random()
      let impactLevel = 'medium'
      if (rand > 0.7) impactLevel = 'high'
      else if (rand < 0.3) impactLevel = 'low'
      setSimResult({
        text: `Predicted outcome: ${Math.floor(Math.random() * 10 + 5)}% improvement. Contextual factors apply.`,
        impact: impactLevel
      })
      setRunningSim(false)
    }, 1200)
  }

  const clearSimulation = () => {
    setSimQuestion('')
    setSimResult(null)
    setActivityInput('')
  }

  // Gradient configuration based on module
  const getGradientClasses = () => {
    if (module === 'Strategy') {
      return 'from-[#6218df] via-[#c009ba] to-[#1e40f2]'
    }
    return 'from-pink-600 to-indigo-600'
  }

  return (
    <>
      {/* Trigger button - renders inline in NavBar */}
      {!open && (
        <Button 
          onClick={() => setOpen(true)} 
          size="sm" 
          className={`bg-gradient-to-r ${getGradientClasses()} text-white shadow-lg hover:opacity-90`}
          data-testid="button-stackwise-sage"
        >
          <img src={emblemIcon} alt="" className="w-4 h-4 mr-1.5" /> Stackwise Sage
        </Button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 right-0 left-[256px] border border-pink-200 bg-white rounded-b-2xl p-3 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-bold flex items-center" style={{ color: style.textColor }}>
                <img src={emblemIcon} alt="" className="w-5 h-5 mr-2 p-0.5 rounded" style={{ backgroundColor: style.bgSelectedColor }} /> Stackwise Sage
              </h2>
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="text-gray-500 hover:text-pink-600" data-testid="button-close-sage">
                Close
              </Button>
            </div>

            {/* Tabs bar - Now at the top */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-3 text-xs border border-gray-200 rounded-md bg-white p-1">
                {[
                  { value: 'ask-sage', label: 'Ask Sage' },
                  { value: 'insights', label: 'Insights' },
                  { value: 'simulations', label: 'Run Simulations' },
                  { value: 'recos', label: 'Recos' },
                  { value: 'myplay', label: 'My Plays' }
                ].map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    style={activeTab === tab.value && !style.isGradient ? { 
                      backgroundColor: style.bgSelectedColor,
                      color: 'white'
                    } : undefined}
                    className={`px-2 py-1 rounded-sm text-xs transition-all ${style.hover} data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:text-white ${activeTab === tab.value && style.isGradient ? style.bgSelected : ''}`}
                    data-testid={`tab-${tab.value}`}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Plan / Act / Coach - Now smaller and under tabs */}
              <div className="flex gap-2 mb-2 text-xs p-2 bg-gray-50 border border-gray-200 rounded-md">
                {[{ label: 'Plan', desc: 'Frame objective' }, { label: 'Act', desc: 'Run simulations' }, { label: 'Coach', desc: 'Review & refine' }].map((item, i) => (
                  <div key={i} className="flex-1 flex items-center gap-1.5">
                    <Zap className={`w-3 h-3 ${style.text}`} />
                    <div>
                      <span className="font-semibold text-[10px] block">{item.label}</span>
                      <span className="text-[9px] text-gray-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ask Sage Tab */}
              <TabsContent value="ask-sage">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-2 bg-purple-50 border border-purple-200 rounded-md text-[10px]">
                    <Lightbulb className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Ask Stackwise Sage anything:</strong> How to find features, navigate the platform, interpret insights, or get strategic guidance.
                    </p>
                  </div>
                  
                  <Card className="border border-gray-200 bg-white p-3">
                    <div className="mb-2">
                      <Input
                        placeholder="Ask Sage: Where can I find campaign analytics? How do I create a new play?"
                        className="text-xs mb-2"
                        data-testid="input-ask-sage"
                      />
                      <Button 
                        size="sm" 
                        className={`w-full text-xs ${style.bgSelected} text-white`}
                        data-testid="button-ask-sage"
                      >
                        Ask Sage
                      </Button>
                    </div>
                  </Card>

                  {/* Quick Links */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-700 mb-2">Common Questions:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Where are my campaign insights?",
                        "How do I create content?",
                        "Where is the budget tracker?",
                        "How do I collaborate with my team?",
                        "Where can I see my plays?",
                        "How do I export reports?"
                      ].map((question, idx) => (
                        <Button 
                          key={idx}
                          variant="outline" 
                          size="sm"
                          className="text-[10px] justify-start h-auto py-2 px-2"
                          data-testid={`button-quick-question-${idx}`}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Insights */}
              <TabsContent value="insights">
                <div className="flex items-start gap-2 mb-2 text-[10px] p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <Info className="w-3 h-3 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px]">
                    <p className="font-semibold mb-1">Insight Color Key</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      <span><span className="text-red-600 font-semibold">Critical:</span> Urgent—act now</span>
                      <span><span className="text-yellow-600 font-semibold">High:</span> Near-term impact</span>
                      <span><span className="text-blue-600 font-semibold">Medium:</span> Worth testing</span>
                      <span><span className="text-gray-600 font-semibold">Info:</span> For awareness</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2">
                  {insights.map((i, idx) => (
                    <Card key={idx} className={`border ${alertColor(i.alert)} p-2 flex-shrink-0 text-[10px]`}>
                      <CardHeader className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-1 text-[11px] font-semibold">
                          {i.alert === 'critical' ? <Flame className="w-3 h-3 text-red-600" /> : <TrendingUp className={`w-3 h-3 ${style.text}`} />}
                          {i.label}
                        </div>
                        <BarChart3 className="w-3 h-3 opacity-70" />
                      </CardHeader>
                      <CardContent className="text-[10px] text-gray-700 leading-tight">
                        <p>{i.detail}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Run Simulations */}
              <TabsContent value="simulations">
                <Card className="border border-gray-200 bg-white p-3 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 text-sm">What If...?</span>
                    <div className="flex gap-2">
                      {simResult && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] h-6 px-2"
                          onClick={clearSimulation}
                          data-testid="button-clear-sim"
                        >
                          Clear & Run New
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className={`text-[10px] h-6 px-3 ${style.text} ${style.border}`}
                        onClick={runSimulation}
                        disabled={!simQuestion.trim() || runningSim}
                        data-testid="button-run-sim"
                      >
                        {runningSim ? 'Running...' : 'Run'}
                      </Button>
                    </div>
                  </div>
                  
                  <Input
                    placeholder="Describe your what-if scenario..."
                    value={simQuestion}
                    onChange={(e) => setSimQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && simQuestion.trim() && !runningSim) {
                        runSimulation()
                      }
                    }}
                    className="mb-2 text-xs"
                    disabled={runningSim}
                    data-testid="input-sim-question"
                  />
                  
                  <div className="text-gray-800 text-xs flex flex-col gap-2">
                    {runningSim ? (
                      <motion.div 
                        className="text-center py-4 text-gray-500"
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1.0 }}
                      >
                        Simulating...
                      </motion.div>
                    ) : simResult ? (
                      <>
                        <div className="bg-gray-50 p-2 rounded border border-gray-200">
                          <p className="font-semibold text-[10px] text-gray-600 mb-1">Expected Outcome:</p>
                          <span className="flex items-center text-xs">
                            {getImpactIcon(simResult.impact)}
                            {simResult.text}
                          </span>
                        </div>
                        
                        <div>
                          <label className="block font-semibold text-xs text-gray-700 mb-1">
                            What activity do you want to send to the Eval Matrix?
                          </label>
                          <Input
                            placeholder="Describe the specific activity..."
                            value={activityInput}
                            onChange={(e) => setActivityInput(e.target.value)}
                            className="mb-2 text-xs"
                            data-testid="input-activity"
                          />
                          <PushToEvalButton 
                            size="sm" 
                            variant="outline"
                            className="text-[10px] h-6 px-3"
                            moduleColor={style.text.replace('text-', '')}
                            disabled={!activityInput.trim()}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-4 text-gray-400 text-xs">Enter a what-if scenario and click Run to see predicted outcomes</p>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Recommendations */}
              <TabsContent value="recos">
                <div className="grid grid-cols-2 gap-2">
                  {recos.map((r, i) => (
                    <Card key={i} className="border border-purple-200 bg-purple-50 p-2 text-[10px] relative">
                      <div className="absolute top-1 right-1 flex items-center text-[9px] text-purple-700 font-semibold">
                        <ChevronUp className="w-3 h-3 mr-0.5" /> Priority {r.priority}
                      </div>
                      <CardHeader className="text-[10px] font-semibold text-purple-700 pb-1 flex items-center">
                        {getImpactIcon('high')} {r.name}
                      </CardHeader>
                      <CardContent className="text-[10px] text-gray-700 space-y-0.5">
                        <p><strong>Impact:</strong> {r.impact}</p>
                        <p><strong>Why:</strong> {r.why}</p>
                        <p><strong>Expected:</strong> {r.expected}</p>
                        <p><strong>Support:</strong> {r.support}</p>
                        <PushToEvalButton size="sm" className="text-[9px] h-5 px-2 mt-1" moduleColor="#6218df" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* My Play */}
              <TabsContent value="myplay">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {myPlays.map((p, i) => (
                    <Card key={i} className="min-w-[180px] border border-pink-100 bg-white p-2 flex-shrink-0 text-[10px]">
                      <CardHeader className="text-[10px] font-semibold pb-1 flex items-center text-indigo-700">
                        <FilePlus2 className="w-3 h-3 mr-1 text-pink-600" /> {p.name}
                      </CardHeader>
                      <CardContent className="text-[10px] text-gray-600 flex gap-2 items-center">
                        <span className="flex-1 truncate">{p.note}</span>
                        <PushToEvalButton size="sm" className="text-[9px] h-5 px-2 flex-shrink-0" moduleColor="#c009ba" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
