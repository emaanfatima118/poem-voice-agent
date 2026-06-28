import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './button'
import { Input } from './input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export function QuickActions({ module = 'BrandCraft', onNewInsight, inline = false }) {
  const [activeAction, setActiveAction] = useState(null)
  const [output, setOutput] = useState(null)
  const [question, setQuestion] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)

  const moduleColors = {
    BrandCraft: '#c009ba',
    PulseHub: '#6218df',
    FlightDeck: '#1e40f2',
    StrategyStudio: '#6218df',
    Overview: '#6218df',
  }

  const moduleGradients = {
    'Strategy Studio': 'from-[#6218df] via-[#c009ba] to-[#1e40f2]',
    StrategyStudio: 'from-[#6218df] via-[#c009ba] to-[#1e40f2]',
  }

  const moduleColor = moduleColors[module] || '#6218df'
  const isStrategyStudio = module === 'Strategy Studio' || module === 'StrategyStudio'
  const gradient = moduleGradients[module]

  const simulateResponse = (msg, cb) => {
    setLoading(true)
    setOutput({ title: 'Processing...', description: msg, results: [] })
    setTimeout(() => {
      setLoading(false)
      cb()
    }, 1000)
  }

  const handleAction = (action) => {
    if (activeAction === action) {
      setActiveAction(null)
      setOutput(null)
      return
    }

    setActiveAction(action)

    if (action === 'analyze') {
      simulateResponse('Analyzing framework...', () => {
        setOutput({
          title: 'Framework Analysis',
          description: `Assessment of ${module} structure and goal alignment:`,
          results: [
            'Clarify each section with measurable success indicators.',
            'Simplify navigation by grouping similar activities together.',
            'Reorder goals by strategic impact for clarity and prioritization.',
          ],
        })
      })
    }

    if (action === 'optimize') {
      simulateResponse('Optimizing current step...', () => {
        setOutput({
          title: 'Optimization Suggestions',
          description: 'Context-based improvements you can apply now:',
          results: [
            'Refine headline to emphasize the audience outcome.',
            'Use contrast and white space for visual hierarchy.',
            'Cut redundant words for better clarity and rhythm.',
            'Position your strongest proof point earlier in the flow.',
          ],
        })
      })
    }

    if (action === 'insight') {
      setOutput({
        title: 'Noodling...',
        description: 'Ask a question and generate insights instantly from connected data.',
        results: [],
      })
    }
  }

  const handleAsk = () => {
    if (!question.trim()) return

    simulateResponse('Generating insights...', () => {
      const insightBank = [
        'Start with the user problem, then tie it to your solution.',
        'If engagement dips, test a benefit-driven headline variation.',
        'Tone mismatched? Rewrite for clarity and brevity — impact over style.',
        'Bring proof earlier in copy — trust grows before conversion.',
        'Simplify visuals and language: one message per frame beats five.',
      ]
      const selected = insightBank.sort(() => 0.5 - Math.random()).slice(0, 3)

      setOutput({
        title: 'Insight Recommendations',
        description: `Question: "${question}"`,
        results: selected,
      })

      if (onNewInsight) onNewInsight(`New Insight from Question: ${question}`)
      setQuestion('')
    })
  }

  const handleAccept = (item) => {
    setOutput((prev) => ({
      ...prev,
      results: prev.results.map((r) => (r === item ? `✔️ Accepted: ${item}` : r)),
    }))
  }

  const actions = [
    { id: 'analyze', label: 'Analyze Framework' },
    { id: 'optimize', label: 'Optimize Current Step' },
    { id: 'insight', label: 'Noodling...', tooltip: 'See if it stacks up' },
  ]

  return (
    <div className={inline ? "contents" : "flex flex-col gap-4 w-full mb-6"}>
      <div className="flex gap-2">
        <TooltipProvider>
          {actions.map((action) => (
            <motion.div key={action.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              {action.tooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isStrategyStudio ? (
                      <div className={`bg-gradient-to-r ${gradient} p-[2px] rounded-lg`}>
                        <Button
                          variant="outline"
                          onClick={() => handleAction(action.id)}
                          className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm bg-white hover:bg-gray-50"
                          style={{ borderColor: 'transparent', color: moduleColor }}
                          data-testid={`button-quick-action-${action.id}`}
                        >
                          {action.label}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        style={{ borderColor: moduleColor, color: moduleColor }}
                        onClick={() => handleAction(action.id)}
                        className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:bg-opacity-10"
                        data-testid={`button-quick-action-${action.id}`}
                      >
                        {action.label}
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                isStrategyStudio ? (
                  <div className={`bg-gradient-to-r ${gradient} p-[2px] rounded-lg`}>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(action.id)}
                      className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm bg-white hover:bg-gray-50"
                      style={{ borderColor: 'transparent', color: moduleColor }}
                      data-testid={`button-quick-action-${action.id}`}
                    >
                      {action.label}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    style={{ borderColor: moduleColor, color: moduleColor }}
                    onClick={() => handleAction(action.id)}
                    className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:bg-opacity-10"
                    data-testid={`button-quick-action-${action.id}`}
                  >
                    {action.label}
                  </Button>
                )
              )}
            </motion.div>
          ))}
        </TooltipProvider>
      </div>

      <AnimatePresence>
        {output && (
          <motion.div
            key={output.title}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 25 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-800 text-left bg-gray-50 p-4 rounded-md border border-gray-200 w-full shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold mb-1">{output.title}</h3>
              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 text-xs" onClick={() => {setActiveAction(null); setOutput(null)}} data-testid="button-close-output">
                Close
              </Button>
            </div>
            <p className="mb-3 text-gray-600 whitespace-pre-line text-sm">{output.description}</p>

            {output.title.includes('Noodling') && (
              <div className="flex gap-2 items-center mb-4">
                <Input
                  type="text"
                  placeholder="e.g., Which campaigns are driving the most high-intent traffic?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="text-sm flex-1"
                  data-testid="input-insight-question"
                />
                <Button size="sm" style={{ backgroundColor: moduleColor, color: 'white' }} onClick={handleAsk} data-testid="button-ask">
                  Generate Insight
                </Button>
              </div>
            )}

            <ul className="space-y-2">
              {output.results.map((item, i) => (
                <li key={i} className="bg-white border border-gray-200 p-2 rounded-md hover:shadow-sm transition flex justify-between items-center">
                  <span className="text-gray-700 text-sm whitespace-pre-line flex-1">{item}</span>
                  {!item.startsWith('✔️') && (
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1" style={{ borderColor: moduleColor, color: moduleColor }} onClick={() => handleAccept(item)} data-testid={`button-accept-${i}`}>
                      Accept
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}