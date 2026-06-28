"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout'
import { QuickActions } from '@/components/QuickActions'
import { getModuleById } from '@/config/modules'
import { Upload, Sparkles, FileText, Gauge, Megaphone, MessageSquare, Plus, Lightbulb } from 'lucide-react'

type StepKey = 'mission-values' | 'core-messaging' | 'content-pillars' | 'pain-proof' | 'differentiators' | 'tone-voice' | 'keywords' | 'summary'

type Pillar = {
  name: string
  subtopics: [string, string, string]
}

type PainProofRow = {
  id: string
  subtopic: string
  pain: string
  proof: string
}

type ToneMapping = {
  emotional: {
    reflective: number
    inspirational: number
    optimistic: number
    compassionate: number
    humor: number
  }
  persuasive: {
    assertive: number
    persuasive: number
    authoritative: number
  }
  communication: {
    serious: number
    conversational: number
    informative: number
    curious: number
    matterOfFact: number
  }
}

export default function MessagingHouse() {
  const module = getModuleById('brand-craft')
  const feature = module?.features?.find(f => f.id === 'messaging-house')
  const [currentStep, setCurrentStep] = useState<StepKey>('mission-values')
  const moduleColor = '#c009ba'

  // Content Pillars state
  const [pillars, setPillars] = useState<Pillar[]>([
    { name: '', subtopics: ['', '', ''] },
    { name: '', subtopics: ['', '', ''] },
    { name: '', subtopics: ['', '', ''] },
    { name: '', subtopics: ['', '', ''] },
    { name: '', subtopics: ['', '', ''] },
  ])

  // Pain & Proof Points state
  const [painProofRows, setPainProofRows] = useState<PainProofRow[]>([
    { id: '1', subtopic: '', pain: '', proof: '' },
    { id: '2', subtopic: '', pain: '', proof: '' },
    { id: '3', subtopic: '', pain: '', proof: '' },
  ])

  // Tone Mapping state (exact same as exec feature)
  const [toneMapping, setToneMapping] = useState<ToneMapping>({
    emotional: {
      reflective: 50,
      inspirational: 50,
      optimistic: 50,
      compassionate: 50,
      humor: 50,
    },
    persuasive: {
      assertive: 50,
      persuasive: 50,
      authoritative: 50,
    },
    communication: {
      serious: 50,
      conversational: 50,
      informative: 50,
      curious: 50,
      matterOfFact: 50,
    },
  })

  const updatePillar = (index: number, name: string) => {
    const newPillars = [...pillars]
    newPillars[index] = { ...newPillars[index], name }
    setPillars(newPillars)
  }

  const updateSubtopic = (pillarIndex: number, subtopicIndex: number, value: string) => {
    const newPillars = [...pillars]
    newPillars[pillarIndex].subtopics[subtopicIndex] = value
    setPillars(newPillars)
  }

  // Pain & Proof helpers
  const updatePainProofRow = (id: string, field: 'subtopic' | 'pain' | 'proof', value: string) => {
    setPainProofRows(rows => rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ))
  }

  const addPainProofRow = () => {
    const newId = String(Date.now())
    setPainProofRows(rows => [...rows, { id: newId, subtopic: '', pain: '', proof: '' }])
  }

  // Get all available subtopics from pillars
  const availableSubtopics = pillars.flatMap(pillar => 
    pillar.subtopics.filter(s => s)
  )

  const steps = [
    { id: 'mission-values', label: 'Mission & Values', description: 'Define your core purpose' },
    { id: 'core-messaging', label: 'Core Messaging', description: 'Establish your unique value' },
    { id: 'content-pillars', label: 'Content Pillars', description: 'Set content themes' },
    { id: 'pain-proof', label: 'Pain & Proof Points', description: 'Problems and evidence' },
    { id: 'differentiators', label: 'Differentiators', description: 'What sets you apart' },
    { id: 'tone-voice', label: 'Tone & Voice', description: 'How you communicate' },
    { id: 'keywords', label: 'Keywords', description: 'Brand terminology' },
    { id: 'summary', label: 'Summary', description: 'WHO-WHAT-WHY statement' },
  ]

  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4" style={{ color: moduleColor }}>Brand Craft</h2>
      <p className="text-sm text-muted-foreground">
        Build your complete messaging framework
      </p>
    </div>
  )

  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto sticky top-16 z-10">
      <div className="flex gap-2 min-w-max">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id as StepKey)}
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

  const content = (
    <div className="p-4 md:p-8 space-y-6 max-w-full overflow-x-hidden">
      <QuickActions module="BrandCraft" />

      {/* Step: Mission & Values */}
      {currentStep === 'mission-values' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Mission & Values</h1>
            <p className="text-gray-600">Define your organization's core purpose and guiding principles</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm">
                  <strong>Coaching Prompt:</strong> Define mission (why you exist) and core values (how you operate). Keep them authentic and actionable.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Mission Statement
                  </label>
                  <p className="text-sm font-normal text-gray-700">What is your organization's core purpose and reason for existing?</p>
                </div>
                <Textarea 
                  placeholder="Enter your mission statement" 
                  className="h-20" 
                  data-testid="textarea-mission-statement"
                />
              </div>

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Core Values
                  </label>
                  <p className="text-sm font-normal text-gray-700">What principles guide your organization's decisions and behavior?</p>
                </div>
                <Textarea 
                  placeholder="List 3–7 core values" 
                  className="h-20"
                  data-testid="textarea-core-values"
                />
              </div>

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Purpose Statement
                  </label>
                  <p className="text-sm font-normal text-gray-700">How does your organization make a positive impact in the world?</p>
                </div>
                <Textarea 
                  placeholder="Write your purpose statement" 
                  className="h-20"
                  data-testid="textarea-purpose-statement"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Core Messaging */}
      {currentStep === 'core-messaging' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Core Messaging</h1>
            <p className="text-gray-600">Define what makes you unique and valuable to your target audience</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm">
                  <strong>Coaching Prompt:</strong> Define value proposition, market positioning, and key messages. Focus on benefits over features that resonate with target personas.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Value Proposition
                  </label>
                  <p className="text-sm font-normal text-gray-700">What unique value do you deliver to your customers that competitors don't?</p>
                </div>
                <Textarea 
                  placeholder="Describe your value proposition" 
                  className="h-20"
                  data-testid="textarea-value-proposition"
                />
              </div>

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Market Positioning
                  </label>
                  <p className="text-sm font-normal text-gray-700">How do you want to be perceived in the market relative to competitors?</p>
                </div>
                <Textarea 
                  placeholder="Describe your positioning" 
                  className="h-20"
                  data-testid="textarea-market-positioning"
                />
              </div>

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Key Messages
                  </label>
                  <p className="text-sm font-normal text-gray-700">What are the main messages you want to communicate to your audience?</p>
                </div>
                <Textarea 
                  placeholder="Write your key messages" 
                  className="h-20"
                  data-testid="textarea-key-messages"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Content Pillars - WITH 3 SUB-TOPICS */}
      {currentStep === 'content-pillars' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Content Pillars</h1>
            <p className="text-gray-600">Define the main themes that will guide all your content creation</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm">
                  <strong>Coaching Prompt:</strong> Define 3–5 content pillars with 3 sub-topics each. Choose pillars covering different aspects of expertise and customer needs.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              <div className="space-y-6">
                {pillars.map((pillar, i) => (
                  <div key={i} className="space-y-3">
                    <Input 
                      placeholder={`Content Pillar ${i + 1}`}
                      value={pillar.name}
                      onChange={(e) => updatePillar(i, e.target.value)}
                      className="font-semibold"
                      data-testid={`input-pillar-${i + 1}`}
                    />
                    {pillar.name && (
                      <div className="pl-6 space-y-2 border-l-2 border-gray-300">
                        {pillar.subtopics.map((subtopic, j) => (
                          <Input
                            key={j}
                            placeholder={`Sub-topic ${j + 1}`}
                            value={subtopic}
                            onChange={(e) => updateSubtopic(i, j, e.target.value)}
                            className="text-sm"
                            data-testid={`input-pillar-${i + 1}-subtopic-${j + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Pain & Proof Points - 3 COLUMN TABLE */}
      {currentStep === 'pain-proof' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Pain & Proof Points</h1>
            <p className="text-gray-600">Identify challenges and demonstrate how you solve them</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm">
                  <strong>Coaching Prompt:</strong> For each sub-topic, link pain points (challenges) to proof points (evidence of solutions). Upload supporting documents.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              {availableSubtopics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Please add sub-topics in the Content Pillars step first
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-semibold text-sm text-pink-700 pb-2 border-b-2 border-gray-300">
                    <div className="md:col-span-3">Sub Topic</div>
                    <div className="md:col-span-4">Pain Point</div>
                    <div className="md:col-span-5">Proof Point</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-3">
                    {painProofRows.map((row, index) => (
                      <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-3">
                          <select
                            value={row.subtopic}
                            onChange={(e) => updatePainProofRow(row.id, 'subtopic', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c009ba] focus-visible:ring-offset-2"
                            data-testid={`select-subtopic-${index + 1}`}
                          >
                            <option value="">Select sub-topic</option>
                            {availableSubtopics.map((subtopic, i) => (
                              <option key={i} value={subtopic}>{subtopic}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            value={row.pain}
                            onChange={(e) => updatePainProofRow(row.id, 'pain', e.target.value)}
                            placeholder="Enter pain point"
                            data-testid={`input-pain-${index + 1}`}
                          />
                        </div>
                        <div className="md:col-span-5">
                          <Input
                            value={row.proof}
                            onChange={(e) => updatePainProofRow(row.id, 'proof', e.target.value)}
                            placeholder="Enter proof point"
                            data-testid={`input-proof-${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add More Button */}
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="outline" 
                      onClick={addPainProofRow}
                      className="flex items-center"
                      data-testid="button-add-more-row"
                    >
                      <Plus className="w-4 h-4 mr-1"/> Add More
                    </Button>
                  </div>

                  {/* Upload Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-gray-300">
                    <div className="hidden md:block md:col-span-3"></div>
                    <div className="md:col-span-4">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center"
                        data-testid="button-upload-docs"
                      >
                        <Upload className="w-4 h-4 mr-1"/> Upload Docs
                      </Button>
                    </div>
                    <div className="md:col-span-5">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center"
                        data-testid="button-upload-evidence"
                      >
                        <Upload className="w-4 h-4 mr-1"/> Upload Evidence
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Differentiators - BIGGER FIELD + LABELED EXAMPLES */}
      {currentStep === 'differentiators' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Competitive Differentiators</h1>
            <p className="text-gray-600">Define what sets you apart from competitors</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Identify 3–7 unique advantages that set you apart from competitors across product/service, business model, company, and customer experience dimensions.</p>
                  <p><strong>Expected outcome:</strong> Specific, provable differentiators that are valuable to your target audience and support your competitive positioning.</p>
                  <p><strong>Tip:</strong> Focus on differentiators that are truly unique and matter to customers. Use the category framework provided to ensure comprehensive coverage.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">
                    Your Competitive Differentiators
                  </label>
                  <p className="text-sm font-normal text-gray-700">List your key differentiators below. Consider the example categories when crafting your response.</p>
                </div>
                <Textarea 
                  placeholder="Describe your competitive differentiators in detail..." 
                  className="h-40"
                  data-testid="textarea-differentiators"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-pink-700">Consider these differentiator categories:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Product/Service', examples: ['Unique features or capabilities', 'Superior performance metrics', 'Innovative technology or approach', 'Better user experience'] },
                    { type: 'Business Model', examples: ['Pricing advantages', 'Delivery model innovation', 'Partnership ecosystem', 'Service level guarantees'] },
                    { type: 'Company', examples: ['Team expertise and credentials', 'Company culture and values', 'Market position and reputation', 'Customer success track record'] },
                    { type: 'Customer Experience', examples: ['Onboarding and training', 'Support and service quality', 'Community and resources', 'Customization options'] }
                  ].map(({ type, examples }, i) => (
                    <div key={i} className="bg-pink-50 border border-gray-300 rounded-md p-4">
                      <h5 className="font-semibold mb-2 text-gray-800">{type}</h5>
                      <p className="text-xs text-gray-600 mb-2 font-medium">Examples to address:</p>
                      <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                        {examples.map((ex, j) => <li key={j}>{ex}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Tone & Voice - WITH 13 SLIDERS */}
      {currentStep === 'tone-voice' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Tone & Voice</h1>
            <p className="text-gray-600">Define how you communicate with your audience</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Use the sliders to define your brand's communication style across emotional, persuasive, and communication dimensions. Add specific guidelines with examples.</p>
                  <p><strong>Expected outcome:</strong> A comprehensive tone and voice framework with clear parameters and practical guidelines to ensure consistent communication across all channels.</p>
                  <p><strong>Tip:</strong> Balance authenticity with strategic positioning. Upload existing style guides if available to maintain consistency.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              {/* Emotional Tones */}
              <Card className="p-4">
                <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Emotional Tones
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(toneMapping.emotional).map(([k, v]) => (
                    <div key={k} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium items-center">
                        <span className="capitalize">{k}</span>
                        <span className="text-muted-foreground">{v}%</span>
                      </div>
                      <Slider
                        value={[v]}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setToneMapping({
                            ...toneMapping,
                            emotional: {
                              ...toneMapping.emotional,
                              [k]: val,
                            },
                          })
                        }
                        data-testid={`slider-emotional-${k.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Persuasive Tones */}
              <Card className="p-4">
                <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <Megaphone className="w-4 h-4" /> Persuasive Tones
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(toneMapping.persuasive).map(([k, v]) => (
                    <div key={k} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium items-center">
                        <span className="capitalize">{k}</span>
                        <span className="text-muted-foreground">{v}%</span>
                      </div>
                      <Slider
                        value={[v]}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setToneMapping({
                            ...toneMapping,
                            persuasive: {
                              ...toneMapping.persuasive,
                              [k]: val,
                            },
                          })
                        }
                        data-testid={`slider-persuasive-${k.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Communication Tones */}
              <Card className="p-4">
                <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Communication Tones
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(toneMapping.communication).map(([k, v]) => (
                    <div key={k} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium items-center">
                        <span className="capitalize">{k === 'matterOfFact' ? 'Matter of Fact' : k}</span>
                        <span className="text-muted-foreground">{v}%</span>
                      </div>
                      <Slider
                        value={[v]}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setToneMapping({
                            ...toneMapping,
                            communication: {
                              ...toneMapping.communication,
                              [k]: val,
                            },
                          })
                        }
                        data-testid={`slider-communication-${k.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <div>
                <div className="mb-2">
                  <label className="text-sm font-semibold text-pink-700 block mb-1">Communication Guidelines</label>
                </div>
                <Textarea 
                  placeholder="Communication Guidelines (rules + examples)" 
                  className="h-28"
                  data-testid="textarea-communication-guidelines"
                />
              </div>

              <Button variant="outline" className="flex items-center" data-testid="button-upload-guidelines">
                <Upload className="w-4 h-4 mr-1"/> Upload existing guidelines
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Keywords */}
      {currentStep === 'keywords' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Brand Keywords & Terminology</h1>
            <p className="text-gray-600">Define key terms for consistent use across all communications</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Define key terms and phrases across 5 categories: Primary Brand Terms, Industry Keywords, SEO Keywords, Pain Point Keywords, and Solution Keywords.</p>
                  <p><strong>Expected outcome:</strong> A comprehensive keyword library for consistent use in content creation, SEO optimization, and marketing campaigns.</p>
                  <p><strong>Tip:</strong> Balance keyword density with readability. Focus on user intent over keyword stuffing. Use keywords in titles, meta descriptions, social posts, and email subject lines.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              {['Primary Brand Terms', 'Industry Keywords', 'SEO Keywords', 'Pain Point Keywords', 'Solution Keywords'].map((type, i) => (
                <div key={i}>
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-pink-700 block mb-1">{type}</h4>
                  </div>
                  <Textarea 
                    placeholder={`Enter ${type.toLowerCase()} separated by commas`} 
                    className="h-24"
                    data-testid={`textarea-${type.toLowerCase().replace(/\s/g, '-')}`}
                  />
                </div>
              ))}

              <Button variant="outline" className="flex items-center" data-testid="button-upload-keywords">
                <Upload className="w-4 h-4 mr-1"/> Upload keyword lists
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step: Summary - TWO DELIVERABLES */}
      {currentStep === 'summary' && (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Messaging Framework Summary</h1>
            <p className="text-gray-600">Generate your complete messaging deliverables</p>
          </div>

          <Card className="border-l-4 border-t border-r border-b border-gray-300" style={{ borderLeftColor: moduleColor }}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: moduleColor }} />
                <div className="text-sm space-y-2">
                  <p><strong>What to do:</strong> Generate two key deliverables: (1) WHO-WHAT-WHY Statement capturing your brand essence, and (2) Full Message House Document compiling all 8 steps.</p>
                  <p><strong>Expected outcome:</strong> Production-ready messaging deliverables for team alignment, board presentations, website copy, sales presentations, and marketing campaigns.</p>
                  <p><strong>Tip:</strong> Both deliverables will be saved to Strategy Studio Stacks for easy access and distribution across your organization.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">

              {/* WHO-WHAT-WHY Statement */}
              <div className="space-y-3">
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-pink-700 block mb-1">1. WHO-WHAT-WHY Statement</h4>
                </div>
                <Textarea 
                  placeholder="Your WHO–WHAT–WHY statement will appear here after generation" 
                  className="h-32"
                  data-testid="textarea-summary-statement"
                />
                <div className="flex gap-3">
                  <Button 
                    className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white hover:from-pink-700 hover:to-indigo-700"
                    data-testid="button-generate-statement"
                  >
                    <Sparkles className="w-4 h-4 mr-1"/>Generate Statement
                  </Button>
                  <Button variant="outline" data-testid="button-save-statement-to-stacks">
                    <FileText className="w-4 h-4 mr-1"/>Save to Stacks
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-6">
                {/* Full Message House Document */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-pink-700">2. Full Message House Document</h4>
                  <p className="text-sm text-gray-700">
                    Comprehensive document including Mission & Values, Core Messaging, Content Pillars, Pain & Proof Points, Differentiators, Tone & Voice, Keywords, and Summary.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white hover:from-pink-700 hover:to-indigo-700"
                      data-testid="button-generate-full-doc"
                    >
                      <Sparkles className="w-4 h-4 mr-1"/>Generate Full Document
                    </Button>
                    <Button variant="outline" data-testid="button-save-full-doc-to-stacks">
                      <FileText className="w-4 h-4 mr-1"/>Save to Stacks
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  return (
    <>
      {mobileStepsNav}
      <ThreeColumnLayout
        leftNav={leftNav}
        steps={steps}
        currentStep={currentStep}
        onStepChange={(stepId) => setCurrentStep(stepId as StepKey)}
        content={content}
        moduleColor={moduleColor}
        featureName="Messaging House"
      />
    </>
  )
}

