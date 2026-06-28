'use client'

/**
 * Stackwise Demo Dashboard Wrapper for Next.js
 * 
 * This component wraps the original Stackwise-Demo dashboard
 * to make it compatible with Next.js App Router
 */

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { Toaster } from './components/ui/toaster'
import { TooltipProvider } from './components/ui/tooltip'
import { AppSidebar } from './components/AppSidebar'
import { NavBar } from './components/NavBar'
import { WebinarDrawer } from './components/WebinarDrawer'
import { ReactNode } from 'react'

interface StackwiseDemoWrapperProps {
  children: ReactNode
}

/**
 * Wrapper component that provides all necessary context providers
 * for the Stackwise-Demo dashboard
 */
export default function StackwiseDemoWrapper({ children }: StackwiseDemoWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <NavBar />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
        <WebinarDrawer />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

// Re-export all pages for easy access
export { default as Home } from './pages/Home'

// Strategy Studio
export { default as StrategyStudioDashboard } from './pages/strategy-studio/Dashboard'
export { default as StrategyOnboarding } from './pages/strategy-studio/Onboarding'
export { default as QuarterlyReview } from './pages/strategy-studio/QuarterlyReview'
export { default as MyPlays } from './pages/strategy-studio/MyPlays'
export { default as QuarterlyStrategyCall } from './pages/strategy-studio/QuarterlyStrategyCall'
export { default as StackNavigator } from './pages/strategy-studio/StackNavigator'
export { default as ReviewPrep } from './pages/strategy-studio/ReviewPrep'
export { default as AnnualSetup } from './pages/strategy-studio/AnnualSetup'
export { default as BudgetFeature } from './pages/strategy-studio/BudgetFeature'

// Pulse Hub
export { default as PulseHub } from './pages/PulseHub'
export { default as Audit } from './pages/pulse-hub/Audit'
export { default as ViewAudits } from './pages/pulse-hub/ViewAudits'
export { default as AuditResults } from './pages/pulse-hub/AuditResults'
export { default as AnalyticsIntelligence } from './pages/pulse-hub/AnalyticsIntelligence'
export { default as RoadmapsConnections } from './pages/pulse-hub/RoadmapsConnections'
export { default as ABMCommandCenter } from './pages/pulse-hub/ABMCommandCenter'
export { default as CompetitorAnalysis } from './pages/pulse-hub/CompetitorAnalysis'
export { default as LeadershipSalesReports } from './pages/pulse-hub/LeadershipSalesReports'
export { default as GTMTestPit } from './pages/pulse-hub/GTMTestPit'

// Brand Craft
export { default as BrandCraft } from './pages/BrandCraft'
export { default as MessagingHouse } from './pages/brand-craft/MessagingHouse'
export { default as ContentStrategy } from './pages/brand-craft/ContentStrategy'
export { default as KeywordResearch } from './pages/brand-craft/KeywordResearch'
export { default as ContentCreation } from './pages/brand-craft/ContentCreation'
export { default as CampaignBuilder } from './pages/brand-craft/CampaignBuilder'
export { default as ContentAudit } from './pages/brand-craft/ContentAudit'
export { default as BrandToneCheck } from './pages/brand-craft/BrandToneCheck'
export { default as ExecVisibility } from './pages/brand-craft/ExecVisibility'

// Flight Deck
export { default as FlightDeck } from './pages/FlightDeck'
export { default as FlightBoard } from './pages/flight-deck/FlightBoard'
export { default as ContentCalendar } from './pages/flight-deck/ContentCalendar'
export { default as Distribution } from './pages/flight-deck/Distribution'
export { default as Budget } from './pages/flight-deck/Budget'
export { default as AssetManagement } from './pages/flight-deck/AssetManagement'
export { default as CollaborationTools } from './pages/flight-deck/CollaborationTools'
export { default as CampaignInsights } from './pages/flight-deck/CampaignInsights'
export { default as AudienceEngine } from './pages/flight-deck/AudienceEngine'

// Resources
export { default as Resources } from './pages/Resources'
export { default as RecycleBin } from './pages/RecycleBin'

