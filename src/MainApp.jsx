// "use client"

// import { useState, useEffect } from "react"
// import StackwiseLanding from "./App"
// import PulseHub from "./PulseHub"
// import PulseHubDashboard from "./PulseHubDashboard"
// import BrandCraft from "./BrandCraft"
// import FlightDeck from "./FlightDeck"
// import Pricing from "./Pricing"
// import SignUp from "./SignUp"
// import LoginPage from "./Login"
// import StrategyStudio from "./strategy-studio"
// import PerformanceAudit from "./pulsehub-performanceAudit"
// import ForgotPasswordPage from "./ForgotPassword"
// import AuditResultsPage from "./pulsehub-auditResult"
// const AIIntelligence = () => <div className="p-8"><h1 className="text-3xl font-bold">AI Intelligence</h1></div>
// const Roadmaps = () => <div className="p-8"><h1 className="text-3xl font-bold">Roadmaps and Recommendations</h1></div>
// const ABMCommand = () => <div className="p-8"><h1 className="text-3xl font-bold">ABM Command Center</h1></div>
// const CompetitorAnalysis = () => <div className="p-8"><h1 className="text-3xl font-bold">Competitor Analysis & Benchmarking</h1></div>
// const LeadershipReports = () => <div className="p-8"><h1 className="text-3xl font-bold">Leadership & Sales Reports</h1></div>
// const GoToMarket = () => <div className="p-8"><h1 className="text-3xl font-bold">Go-To Market</h1></div>
// const StrategyCalls = () => <div className="p-8"><h1 className="text-3xl font-bold">Strategy Calls</h1></div>

// const MainApp = () => {
//   const getPageFromPath = (path) => {
//     const cleanPath = path.split('?')[0].replace(/\/+$/, '');

//   const routes = {
//     '': 'landing',
//     '/pulse-hub': 'pulse-hub',
//     '/pulse-hub-dashboard': 'pulse-hub-dashboard',
//     '/brand-craft': 'brand-craft',
//     '/flight-deck': 'flight-deck',
//     '/pricing': 'pricing',
//     '/sign-up': 'sign-up',
//     '/login': 'login',
//     '/strategy-studio': 'strategy-studio',
//     '/audit-results': 'audit-results',
//     '/forgot-password': 'forgot-password',
//     '/performance-audit': 'performance-audit',
//     '/ai-intelligence': 'ai-intelligence',
//     '/roadmaps': 'roadmaps',
//     '/abm-command': 'abm-command',
//     '/competitor-analysis': 'competitor-analysis',
//     '/leadership-reports': 'leadership-reports',
//     '/go-to-market': 'go-to-market',
//     '/strategy-calls': 'strategy-calls'
//   };

//   return routes[cleanPath] || 'landing';
// };
//  const [currentPage, setCurrentPage] = useState(() => {
//   const cleanPath = window.location.pathname.split('?')[0].replace(/\/+$/, '');
//   return getPageFromPath(cleanPath);
// });




// useEffect(() => {
//   const handleLinkClick = (e) => {
//     const link = e.target.closest('a'); // make sure we capture parent <a>
//     if (!link) return;

//     const href = link.getAttribute('href');
//     if (href && href.startsWith('/')) {
//       const page = getPageFromPath(href);
//       e.preventDefault();
//       navigate(page);
//     }
//   };

//   document.addEventListener('click', handleLinkClick);
//   return () => document.removeEventListener('click', handleLinkClick);
// }, []);


//   // Handle navigation
//   const navigate = (page) => {
//     setCurrentPage(page)
//     const routes = {
//       'pulse-hub': '/pulse-hub',
//       'pulse-hub-dashboard': '/pulse-hub-dashboard',
//       'brand-craft': '/brand-craft',
//       'flight-deck': '/flight-deck',
//       'strategy-studio': '/strategy-studio',
//       'pricing': '/pricing',
//       'sign-up': '/sign-up',
//       'login': '/login',
//       'audit-results': '/audit-results', 
//       'forgot-password': '/forgot-password',
//       'performance-audit': '/performance-audit',
//       'ai-intelligence': '/ai-intelligence',
//       'roadmaps': '/roadmaps',
//       'abm-command': '/abm-command',
//       'competitor-analysis': '/competitor-analysis',
//       'leadership-reports': '/leadership-reports',
//       'go-to-market': '/go-to-market',
//       'strategy-calls': '/strategy-calls',
//       'landing': '/'
//     }
//     const route = routes[page] || '/'
//     window.history.pushState({}, '', route)
//   }

//   // Override link clicks to use our navigation
//   useEffect(() => {
//     const handleLinkClick = (e) => {
//       const href = e.target.getAttribute('href')
//       if (href && href.startsWith('/')) {
//         const page = getPageFromPath(href)
//         if (page !== 'landing' || href === '/') {
//           e.preventDefault()
//           navigate(page)
//         }
//       }
//     }

//     document.addEventListener('click', handleLinkClick)
//     return () => document.removeEventListener('click', handleLinkClick)
//   }, [])

//   // Render the appropriate page
//   const renderPage = () => {
//     switch (currentPage) {
//       case 'pulse-hub':
//         return <PulseHub />
//       case 'pulse-hub-dashboard':
//         return <PulseHubDashboard />
//       case 'brand-craft':
//         return <BrandCraft />
//       case 'flight-deck':
//         return <FlightDeck />
//       case 'strategy-studio':
//         return <StrategyStudio />
//       case 'pricing':
//         return <Pricing />
//       case 'audit-results':
//         return <AuditResultsPage />
//       case 'sign-up':
//         return <SignUp />
//       case 'login':
//         return <LoginPage />
//       case 'forgot-password':
//         return <ForgotPasswordPage />
//       case 'performance-audit':
//         return <PerformanceAudit />
//       case 'ai-intelligence':
//         return <AIIntelligence />
//       case 'roadmaps':
//         return <Roadmaps />
//       case 'abm-command':
//         return <ABMCommand />
//       case 'competitor-analysis':
//         return <CompetitorAnalysis />
//       case 'leadership-reports':
//         return <LeadershipReports />
//       case 'go-to-market':
//         return <GoToMarket />
//       case 'strategy-calls':
//         return <StrategyCalls />
//       default:
//         return <StackwiseLanding />
//     }
//   }

//   return renderPage()
// }

// export default MainApp

// This file is no longer needed - Next.js App Router handles all routing
// Keeping for backward compatibility, but it just exports the landing page

import StackwiseLanding from "./App"

export default StackwiseLanding