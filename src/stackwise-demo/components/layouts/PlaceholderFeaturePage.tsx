import { Card, CardContent, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card'
import { ThreeColumnLayout } from './ThreeColumnLayout'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Link } from 'wouter'
import { getModuleById } from '@/stackwise-demo/config/modules'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { useState } from 'react'
import { Lightbulb } from 'lucide-react'

interface PlaceholderFeaturePageProps {
  moduleId: string
  featureId: string
  featureName: string
  steps?: Array<{ id: string; label: string; description?: string }>
}

export function PlaceholderFeaturePage({ moduleId, featureId, featureName, steps }: PlaceholderFeaturePageProps) {
  const module = getModuleById(moduleId)
  const defaultSteps = steps || [
    { id: 'overview', label: 'Overview', description: 'Getting started' },
    { id: 'setup', label: 'Setup', description: 'Configure settings' },
    { id: 'complete', label: 'Complete', description: 'Finish and review' },
  ]
  const [currentStep, setCurrentStep] = useState(defaultSteps[0].id)

  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: module?.color }}>{module?.label}</h2>
    </div>
  )

  const renderStepContent = () => {
    const step = defaultSteps.find(s => s.id === currentStep)
    
    // Map moduleId to QuickActions module name
    const moduleMap: Record<string, string> = {
      'strategy-studio': 'StrategyStudio',
      'pulse-hub': 'PulseHub',
      'brand-craft': 'BrandCraft',
      'flight-deck': 'FlightDeck'
    }
    const quickActionsModule = moduleMap[moduleId] || 'StrategyStudio'
    
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="bg-white px-8 py-4 border-b sticky top-0 z-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: module?.color }}>{featureName}</h1>
          <p className="text-muted-foreground">{step?.description || 'Feature in development'}</p>
        </div>
        
        <div className="px-8 py-4">
          <QuickActions module={quickActionsModule} />
        </div>
        
        <div className="p-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" style={{ color: module?.color }} />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This feature is currently under development. The full functionality will be available soon.
              </p>
              <p className="text-sm text-muted-foreground">
                In the meantime, you can explore other features from the left navigation menu.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={defaultSteps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderStepContent()}
      moduleColor={module?.color}
    />
  )
}
