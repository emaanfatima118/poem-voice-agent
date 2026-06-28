import { PlaceholderFeaturePage } from '@/stackwise-demo/components/layouts/PlaceholderFeaturePage'

export default function G2M() {
  return (
    <PlaceholderFeaturePage
      moduleId="pulse-hub"
      featureId="g2m"
      featureName="G2M"
      steps={[
        { id: 'strategy', label: 'GTM Strategy', description: 'Define go-to-market strategy' },
        { id: 'execution', label: 'Execution', description: 'Track GTM execution' },
        { id: 'results', label: 'Results', description: 'Measure GTM performance' },
      ]}
    />
  )
}
