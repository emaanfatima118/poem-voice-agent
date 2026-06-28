/**
 * Catch-all route for Stackwise Demo Dashboard
 * 
 * Captures all routes under /stackwise-dashboard/* and lets wouter handle internal routing
 * This enables the sidebar navigation to work properly
 */

'use client'

import { Router, Route, Switch } from 'wouter'
import { usePathname, useRouter } from 'next/navigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/stackwise-demo/lib/queryClient'
import { Toaster } from '@/stackwise-demo/components/ui/toaster'
import { TooltipProvider } from '@/stackwise-demo/components/ui/tooltip'
import { AppSidebar } from '@/stackwise-demo/components/AppSidebar'
import { NavBar } from '@/stackwise-demo/components/NavBar'
import { WebinarDrawer } from '@/stackwise-demo/components/WebinarDrawer'
import { UserProvider } from '@/stackwise-demo/contexts/UserContext'

// Pages
import Home from '@/stackwise-demo/pages/Home'
import NotFound from '@/stackwise-demo/pages/not-found'

// Strategy Studio
import StrategyStudioDashboard from '@/stackwise-demo/pages/strategy-studio/Dashboard'
import StrategyOnboarding from '@/stackwise-demo/pages/strategy-studio/Onboarding'
import QuarterlyReview from '@/stackwise-demo/pages/strategy-studio/QuarterlyReview'
import MyPlays from '@/stackwise-demo/pages/strategy-studio/MyPlays'
import QuarterlyStrategyCall from '@/stackwise-demo/pages/strategy-studio/QuarterlyStrategyCall'
import StackNavigator from '@/stackwise-demo/pages/strategy-studio/StackNavigator'
import ReviewPrep from '@/stackwise-demo/pages/strategy-studio/ReviewPrep'
import AnnualSetup from '@/stackwise-demo/pages/strategy-studio/AnnualSetup'
import BudgetFeature from '@/stackwise-demo/pages/strategy-studio/BudgetFeature'

// Pulse Hub
import PulseHub from '@/stackwise-demo/pages/PulseHub'
import Audit from '@/stackwise-demo/pages/pulse-hub/Audit'
import ViewAudits from '@/stackwise-demo/pages/pulse-hub/ViewAudits'
import AuditResults from '@/stackwise-demo/pages/pulse-hub/AuditResults'
import AnalyticsIntelligence from '@/stackwise-demo/pages/pulse-hub/AnalyticsIntelligence'
import RoadmapsConnections from '@/stackwise-demo/pages/pulse-hub/RoadmapsConnections'
import ABMCommandCenter from '@/stackwise-demo/pages/pulse-hub/ABMCommandCenter'
import CompetitorAnalysis from '@/stackwise-demo/pages/pulse-hub/CompetitorAnalysis'
import LeadershipSalesReports from '@/stackwise-demo/pages/pulse-hub/LeadershipSalesReports'
import GTMTestPit from '@/stackwise-demo/pages/pulse-hub/GTMTestPit'

// Brand Craft
import BrandCraft from '@/stackwise-demo/pages/BrandCraft'
import MessagingHouse from '@/stackwise-demo/pages/brand-craft/MessagingHouse'
import ContentStrategy from '@/stackwise-demo/pages/brand-craft/ContentStrategy'
import KeywordResearch from '@/stackwise-demo/pages/brand-craft/KeywordResearch'
import ContentCreation from '@/stackwise-demo/pages/brand-craft/ContentCreation'
import CampaignBuilder from '@/stackwise-demo/pages/brand-craft/CampaignBuilder'
import ContentAudit from '@/stackwise-demo/pages/brand-craft/ContentAudit'
import BrandToneCheck from '@/stackwise-demo/pages/brand-craft/BrandToneCheck'
import ExecVisibility from '@/stackwise-demo/pages/brand-craft/ExecVisibility'

// Flight Deck
import FlightDeck from '@/stackwise-demo/pages/FlightDeck'
import FlightBoard from '@/stackwise-demo/pages/flight-deck/FlightBoard'
import ContentCalendar from '@/stackwise-demo/pages/flight-deck/ContentCalendar'
import Distribution from '@/stackwise-demo/pages/flight-deck/Distribution'
import Budget from '@/stackwise-demo/pages/flight-deck/Budget'
import AssetManagement from '@/stackwise-demo/pages/flight-deck/AssetManagement'
import CollaborationTools from '@/stackwise-demo/pages/flight-deck/CollaborationTools'
import CampaignInsights from '@/stackwise-demo/pages/flight-deck/CampaignInsights'
import AudienceEngine from '@/stackwise-demo/pages/flight-deck/AudienceEngine'

// Resources
import Resources from '@/stackwise-demo/pages/Resources'
import RecycleBin from '@/stackwise-demo/pages/RecycleBin'
import Settings from '@/stackwise-demo/pages/Settings'

function RouterContent() {
  return (
    <Switch>
      {/* Overview */}
      <Route path="/" component={Home} />
      
      {/* Strategy Studio */}
      <Route path="/strategy-studio" component={StrategyStudioDashboard} />
      <Route path="/strategy-studio/onboarding" component={StrategyOnboarding} />
      <Route path="/strategy-studio/quarterly-review" component={QuarterlyReview} />
      <Route path="/strategy-studio/my-plays" component={MyPlays} />
      <Route path="/strategy-studio/quarterly-strategy-call" component={QuarterlyStrategyCall} />
      <Route path="/strategy-studio/annual-setup" component={AnnualSetup} />
      <Route path="/strategy-studio/stack-navigator" component={StackNavigator} />
      <Route path="/strategy-studio/review-prep" component={ReviewPrep} />
      <Route path="/strategy-studio/budget" component={BudgetFeature} />
      
      {/* Pulse Hub */}
      <Route path="/pulse-hub" component={PulseHub} />
      <Route path="/pulse-hub/audit" component={Audit} />
      <Route path="/pulse-hub/view-audits" component={ViewAudits} />
      <Route path="/pulse-hub/audit-results" component={AuditResults} />
      <Route path="/pulse-hub/analytics-intelligence" component={AnalyticsIntelligence} />
      <Route path="/pulse-hub/roadmaps-connections" component={RoadmapsConnections} />
      <Route path="/pulse-hub/abm-command-center" component={ABMCommandCenter} />
      <Route path="/pulse-hub/competitor-analysis" component={CompetitorAnalysis} />
      <Route path="/pulse-hub/leadership-sales-reports" component={LeadershipSalesReports} />
      <Route path="/pulse-hub/gtm-test-pit" component={GTMTestPit} />
      
      {/* Brand Craft */}
      <Route path="/brand-craft" component={BrandCraft} />
      <Route path="/brand-craft/messaging-house" component={MessagingHouse} />
      <Route path="/brand-craft/content-strategy" component={ContentStrategy} />
      <Route path="/brand-craft/keyword-research" component={KeywordResearch} />
      <Route path="/brand-craft/content-creation" component={ContentCreation} />
      <Route path="/brand-craft/campaign-builder" component={CampaignBuilder} />
      <Route path="/brand-craft/content-audit" component={ContentAudit} />
      <Route path="/brand-craft/brand-tone-check" component={BrandToneCheck} />
      <Route path="/brand-craft/exec-visibility" component={ExecVisibility} />
      
      {/* Flight Deck */}
      <Route path="/flight-deck" component={FlightDeck} />
      <Route path="/flight-deck/flight-board" component={FlightBoard} />
      <Route path="/flight-deck/campaign-insights" component={CampaignInsights} />
      <Route path="/flight-deck/content-calendar" component={ContentCalendar} />
      <Route path="/flight-deck/budget" component={Budget} />
      <Route path="/flight-deck/audience-engine" component={AudienceEngine} />
      <Route path="/flight-deck/distribute" component={Distribution} />
      <Route path="/flight-deck/collaboration-workflows" component={CollaborationTools} />
      <Route path="/flight-deck/asset-management" component={AssetManagement} />
      
      {/* Resources */}
      <Route path="/resources" component={Resources} />
      
      {/* Recycle Bin */}
      <Route path="/recycle-bin" component={RecycleBin} />
      
      {/* Settings */}
      <Route path="/settings" component={Settings} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  )
}

export default function App() {
  const pathname = usePathname()
  const nextRouter = useRouter()
  
  // Custom hook for wouter that syncs with Next.js
  const useNextRouter = (): [string, (to: string) => void] => {
    // Remove /stackwise-dashboard prefix for wouter
    const wouterPath = pathname?.replace('/stackwise-dashboard', '') || '/'
    
    const navigate = (to: string) => {
      // Add /stackwise-dashboard prefix when navigating
      nextRouter.push(`/stackwise-dashboard${to}`)
    }
    
    return [wouterPath, navigate]
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Router hook={useNextRouter}>
            <div className="flex h-screen overflow-hidden bg-background">
              <AppSidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <NavBar />
                <main className="flex-1 overflow-hidden">
                  <RouterContent />
                </main>
              </div>
            </div>
            <Toaster />
            <WebinarDrawer />
          </Router>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  )
}

