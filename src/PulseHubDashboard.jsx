"use client"

import { useEffect, useState } from "react"
import KPICards from "./components/pulsehub-kpicard"
import { NavBar } from "./components/NavBar"
import Sidebar from "./components/pulsehub-sidebar"
import PulseHubHeader from "./components/pulsehub-header"

// Main Dashboard Component
const PulseHubDashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isVisible, setIsVisible] = useState({ dashboard: false })
  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard')

  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, dashboard: true })), 100)
  }, [])

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem)
  }

  const mockData = {
    overallGrade: "B+",
    pipeline: "$7.1M",
    revenue: "$2.8M",
    accounts: [
      { name: "Acme Corp", tier: "Tier 1", engagement: "86%" },
      { name: "Hella Systems", tier: "Tier 2", engagement: "86%" },
      { name: "Vertex Labs", tier: "Tier 1", engagement: "85%" },
      { name: "Yakima", tier: "Tier 2", engagement: "88%" },
      { name: "ACME, Inc.", tier: "Tier 2", engagement: "71%" }
    ],
    aiInsights: [
      { 
        type: "warning", 
        text: "A Conversion -3%: tighten mid-funnel nurture (A/B new CTAs)." 
      },
      { 
        type: "success", 
        text: "Top-of-funnel +10%: scale winning awareness creative." 
      },
      { 
        type: "alert", 
        text: "3 Tier-1 accounts inactive 30+ days: assign AE tasks today." 
      }
    ],
    businessGoals: [
      { progress: 72, color: "#0CF113" },
      { progress: 20, color: "#C70226" },
      { progress: 90, color: "#05C772" }
    ],
    funnelData: [
      { stage: 'Awareness', value: 300, color: '#2D9CDB' },
      { stage: 'Engagement', value: 220, color: '#56CCF2' },
      { stage: 'Consideration', value: 150, color: '#EB5757' },
      { stage: 'Pipeline', value: '$90', color: '#F2C94C' },
      { stage: 'Closed', value: 40, color: '#27AE60' }
    ]
  }

  // KPI data for top cards
  const topKPIData = [
    {
      title: "Overall Grade",
      value: mockData.overallGrade,
      status: "growth",
      valueColor: '#4323F8'
    },
    {
      title: "Pipeline",
      value: mockData.pipeline,
      trend: { direction: 'up', value: '5%' },
      status: "growth",
      valueColor: '#4323F8'
    },
    {
      title: "Revenue",
      value: mockData.revenue,
      trend: { direction: 'down', value: '3%' },
      status: "loss",
      valueColor: '#4323F8'
    }
  ]

  // KPI data for bottom cards
  const bottomKPIData = [
    {
      title: "Top Funnel Health",
      value: "+10%",
      status: "growth",
      valueColor: '#374151'
    },
    {
      title: "Conversion Rate",
      value: "-3%",
      status: "loss",
      valueColor: '#374151'
    },
    {
      title: "Revenue",
      value: "+5%",
      status: "growth",
      valueColor: '#374151'
    }
  ]

  const getInsightIcon = (type) => {
    switch(type) {
      case "warning":
        return (
          <img 
            src="/pulsehub-dashboard/warning.svg" 
            alt="Warning" 
            className="mt-1 w-4 h-4"
          />
        )
      case "success":
        return (
          <img 
            src="/pulsehub-dashboard/tick.svg" 
            alt="Success" 
            className="mt-1 w-4 h-4"
          />
        )
      case "alert":
        return (
          <img 
            src="/pulsehub-dashboard/minus.png" 
            alt="Alert" 
            className="mt-1 w-4 h-4"
          />
        )
      default:
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">i</span>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .ease-in-text {
          /* Animation removed - using transition-all instead */
        }
      `}</style>

      <div className="flex pt-16">
        <Sidebar selectedMenuItem={selectedMenuItem} onMenuItemClick={handleMenuItemClick} />

        <div className="flex-1">
          <NavBar />

          <div className="p-4 sm:p-6">
            <div className={`transition-all duration-1000 ease-in-text ${isVisible.dashboard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              
            <PulseHubHeader heading="Dashboard" />


              <div className="mb-8">
                <KPICards data={topKPIData} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Engagement</h3>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white">
                          <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-500">Tier</th>
                          <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-500">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockData.accounts.map((account, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="py-2 sm:py-4 px-4 sm:px-6">
                              <div className="flex items-center">
                                <div 
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 flex items-center justify-center text-white text-xs sm:text-sm font-semibold"
                                  style={{ backgroundColor: index % 2 === 0 ? '#4169E1' : '#DC143C' }}
                                >
                                  {account.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-900">{account.name}</span>
                              </div>
                            </td>
                            <td className="py-2 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-900">{account.tier.split(' ')[1]}</td>
                            <td className="py-2 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-900">{account.engagement}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                  <div className="px-6 py-5 flex-shrink-0">
                    <h3 className="text-xl font-semibold text-gray-900">AI Intel</h3>
                  </div>
                  
                  <div className="border-t border-gray-200 flex-shrink-0"></div>
                  
                  <div className="flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto">
                    {mockData.aiInsights.map((insight, index) => (
                      <div key={index} className="flex-1 px-6 py-5 flex flex-col justify-center">
                        <div className="text-base font-semibold text-gray-900 mb-2">
                          Insight {index + 1}:
                        </div>
                        <div className="flex items-start gap-2">
                          {getInsightIcon(insight.type)}
                          <p className="text-base text-gray-900 leading-relaxed">
                            {insight.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 pb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Goals Progress</h3>
                  </div>
                  <div className="border-b border-gray-200"></div>
                  <div className="p-4 sm:p-6 pt-4 sm:pt-6">
  <div className="flex flex-col items-center justify-center w-full">
    {/* KPI Circles Wrapper */}
    <div className="flex flex-wrap justify-center gap-10 sm:gap-12 w-full">
      {mockData.businessGoals.map((goal, index) => (
        <div
          key={index}
          className="flex justify-center text-center"
          style={{
            width: 'min(45vw, 160px)',
            height: 'min(45vw, 160px)',
          }}
        >
          <div className="relative w-full h-full">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              {/* Background circle */}
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                color={goal.color}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${goal.progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            {/* Text inside circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                KPI {index + 1}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm">
                Progress: {goal.progress}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Funnel Overview</h3>
                  </div>
                  <div className="border-b border-gray-200"></div>
                  <div className="p-6 pt-6">
                    <div className="flex items-center justify-center min-h-[300px] px-2">
                      <div className="relative w-full max-w-xl">
                        <svg viewBox="0 0 500 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                          <image 
                            href="/pulsehub-dashboard/funnel.svg" 
                            x="150" 
                            y="-80" 
                            width="230" 
                            height="550"
                            preserveAspectRatio="xMidYMid meet"
                          />
                          
                          {mockData.funnelData.map((stage, index) => {
                            const customPositions = [
                              { side: 'left', lineX1: 160, lineY: 80, lineX2: 80, textX: 75 },
                              { side: 'right', lineX1: 340, lineY: 145, lineX2: 410, textX: 415 },
                              { side: 'left', lineX1: 210, lineY: 210, lineX2: 140, textX: 135 },
                              { side: 'right', lineX1: 315, lineY: 270, lineX2: 385, textX: 390 },
                              { side: 'left', lineX1: 215, lineY: 330, lineX2: 145, textX: 140 }
                            ];
                            
                            const pos = customPositions[index];
                            
                            return (
                              <g key={index}>
                                {pos.side === 'left' ? (
                                  <>
                                    <line
                                      x1={pos.lineX1}
                                      y1={pos.lineY}
                                      x2={pos.lineX2}
                                      y2={pos.lineY}
                                      stroke="#d1d5db"
                                      strokeWidth="1"
                                      strokeDasharray="3 3"
                                    />
                                    <text
                                      x={pos.textX}
                                      y={pos.lineY - 6}
                                      textAnchor="end"
                                      className="fill-gray-600"
                                      style={{ fontSize: '12px' }}
                                    >
                                      {stage.stage}
                                    </text>
                                    <text
                                      x={pos.textX}
                                      y={pos.lineY + 10}
                                      textAnchor="end"
                                      className="fill-gray-900"
                                      style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                      {stage.value}
                                    </text>
                                  </>
                                ) : (
                                  <>
                                    <line
                                      x1={pos.lineX1}
                                      y1={pos.lineY}
                                      x2={pos.lineX2}
                                      y2={pos.lineY}
                                      stroke="#d1d5db"
                                      strokeWidth="1"
                                      strokeDasharray="3 3"
                                    />
                                    <text
                                      x={pos.textX}
                                      y={pos.lineY - 6}
                                      textAnchor="start"
                                      className="fill-gray-600"
                                      style={{ fontSize: '12px' }}
                                    >
                                      {stage.stage}
                                    </text>
                                    <text
                                      x={pos.textX}
                                      y={pos.lineY + 10}
                                      textAnchor="start"
                                      className="fill-gray-900"
                                      style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                      {stage.value}
                                    </text>
                                  </>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <KPICards data={bottomKPIData} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                <button 
                  className="flex-1 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex flex-col items-center justify-center space-y-3"
                  style={{
                    background: 'linear-gradient(180deg, #3D0E8B, #7A27C1)',
                    height: '148px',
                    padding: '16px 12px'
                  }}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium text-xs sm:text-sm lg:text-base text-center leading-tight">Start Audit</span>
                </button>
                
                <button 
                  className="flex-1 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex flex-col items-center justify-center space-y-3"
                  style={{
                    background: 'linear-gradient(180deg, #3D0E8B, #7A27C1)',
                    height: '148px',
                    padding: '16px 12px'
                  }}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium text-xs sm:text-sm lg:text-base text-center leading-tight">Launch ABM Command Center</span>
                </button>
                
                <button 
                  className="flex-1 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex flex-col items-center justify-center space-y-3"
                  style={{
                    background: 'linear-gradient(180deg, #3D0E8B, #7A27C1)',
                    height: '148px',
                    padding: '16px 12px'
                  }}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium text-xs sm:text-sm lg:text-base text-center leading-tight">Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PulseHubDashboard