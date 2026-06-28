import { ReactNode } from 'react'
import { Check } from 'lucide-react'

interface Step {
  id: string
  label: string
  description?: string
}

interface ThreeColumnLayoutProps {
  leftNav: ReactNode
  steps: Step[]
  currentStep: string
  onStepChange: (stepId: string) => void
  content: ReactNode
  moduleColor?: string
  completedSteps?: string[]
  featureName?: string
}

export function ThreeColumnLayout({ 
  leftNav, 
  steps, 
  currentStep, 
  onStepChange, 
  content,
  moduleColor,
  completedSteps = [],
  featureName
}: ThreeColumnLayoutProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  
  // Mobile step navigation
  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto sticky top-16 z-10">
      <div className="flex gap-2 min-w-max">
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-white'
                  : isCompleted
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={isActive ? { backgroundColor: moduleColor || '#1e40f2' } : {}}
              data-testid={`mobile-step-${step.id}`}
            >
              {step.label}
            </button>
          )
        })}
      </div>
    </div>
  )
  
  return (
    <>
      {mobileStepsNav}
      <div className="flex h-full overflow-hidden overflow-x-hidden">
        {/* Left navigation column - module nav with steps - Hidden on mobile */}
        <div 
          className="hidden md:block w-64 border-r overflow-y-auto"
          style={{
            background: moduleColor ? `linear-gradient(180deg, ${moduleColor}15 0%, ${moduleColor}05 100%)` : undefined
          }}
        >
        {leftNav && (
          <div className="p-4 border-b">
            {leftNav}
          </div>
        )}
        
        {/* Feature Name Header */}
        {featureName && (
          <div className="px-6 pt-4 pb-3 border-b">
            <h3 className="font-semibold text-sm text-gray-900">{featureName}</h3>
          </div>
        )}
        
        {/* Steps inside the module nav */}
        <div className="p-6 space-y-2">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = completedSteps.includes(step.id)
            
            return (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`relative w-full text-left p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-white shadow-sm border-2'
                    : isCompleted
                    ? 'bg-white/50 hover:bg-white/70'
                    : 'hover:bg-white/30'
                }`}
                style={{
                  borderColor: isActive ? moduleColor : undefined
                }}
                data-testid={`step-${step.id}`}
              >
                {/* Completion checkmark in top-right corner */}
                {isCompleted && (
                  <div 
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: moduleColor || '#6218df' }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'text-white'
                        : isActive
                        ? 'text-white'
                        : 'bg-white/50 text-gray-600'
                    }`}
                    style={{
                      backgroundColor: isCompleted || isActive ? moduleColor : undefined
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className={`font-semibold text-sm ${
                      isActive ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
        {/* Right content column */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white min-w-0">
          <div className="p-4 md:p-8 max-w-full overflow-x-hidden">
            {content}
          </div>
        </div>
      </div>
    </>
  )
}

