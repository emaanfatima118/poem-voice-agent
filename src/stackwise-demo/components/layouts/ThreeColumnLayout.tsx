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
  
  // Mobile step navigation - shown ONLY on mobile
  const mobileStepsNav = (
    <div 
      className="md:hidden border-b overflow-x-auto"
      style={{
        background: moduleColor ? `linear-gradient(180deg, ${moduleColor}15 0%, ${moduleColor}05 100%)` : undefined
      }}
    >
      {featureName && (
        <div className="px-4 pt-3 pb-2">
          <h3 className="font-semibold text-sm text-gray-900">{featureName}</h3>
        </div>
      )}
      
      <div className="px-4 pb-4">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = completedSteps.includes(step.id)
            
            return (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`relative flex-shrink-0 w-40 text-left p-3 rounded-lg transition-all ${
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
                {isCompleted && (
                  <div 
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: moduleColor || '#6218df' }}
                  >
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${
                      isActive ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
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
    </div>
  )
  
  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      {mobileStepsNav}
    <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        {/* Left navigation column - module nav with steps - Hidden on mobile */}
      <div 
          className="w-64 border-r overflow-y-auto overflow-x-hidden max-md:hidden"
        style={{
          background: moduleColor ? `linear-gradient(180deg, ${moduleColor}15 0%, ${moduleColor}05 100%)` : undefined
        }}
      >
        {leftNav}
        
        {/* Feature Name Header */}
        {featureName && (
          <div className="px-6 pt-6 pb-3 border-b">
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white min-h-0 min-w-0">
        <div className="pb-20 md:pb-0">
        {content}
        </div>
      </div>
    </div>
    </div>
  )
}
