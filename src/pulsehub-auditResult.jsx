"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Sidebar from "./components/pulsehub-sidebar"
import { NavBar } from "./components/NavBar"
import DashboardHeader from "./components/pulsehub-header"
import { ChevronDown, BarChart3, ChevronUp } from "lucide-react"

// ====================== Reusable Components ======================

const GradeDisplay = ({ score, grade, performanceLevel }) => {
    const getGradientColor = (score) => {
      if (score >= 80) return "bg-yellow-500"
      if (score >= 60) return "bg-yellow-400"
      return "bg-red-500"
    }
  
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-center">
            <div className="text-6xl font-bold text-gray-900">{score}</div>
            <div className="text-xl text-[#4A5565] mt-1">Grade {grade}</div>
          </div>
  
          <div className="flex-1 ml-12">
            <div className="h-6 mt-7 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${getGradientColor(score)} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
  
            <div className="text-sm text-gray-600 text-right">
              Performance Level:{" "}
              <span className="text-yellow-600 font-semibold">{performanceLevel || "Good"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

const ExecutiveSummary = ({ summary, summaryCards }) => (
  <div>
    {/* Summary Section */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">Executive Summary</h2>
      <p className="text-sm text-[#4A5565] mb-5 sm:mb-6">{summary}</p>
    </div>

    {/* Summary Cards Grid */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 relative">
        {/* Overlay grid lines (visible only for multi-column layouts) */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:grid sm:grid-cols-2 sm:grid-rows-2"
        >
          <div className="border-b border-r border-gray-200"></div>
          <div className="border-b border-gray-200"></div>
          <div className="border-r border-gray-200"></div>
          <div></div>
        </div>

        {/* Top Strengths */}
        <div className="p-4 sm:p-6 relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-1">Top Strengths:</h3>
          <ul className="text-sm text-[#364153] space-y-1">
            {summaryCards?.["Top Strengths"]?.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Top Gaps */}
        <div className="p-4 sm:p-6 relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-1">Top Gaps:</h3>
          <ul className="text-sm text-[#364153] space-y-1">
            {summaryCards?.["Top Gaps"]?.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Top Priorities */}
        <div className="p-4 sm:p-6 relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-1">Top Priorities:</h3>
          <ul className="text-sm text-[#364153] space-y-1">
            {summaryCards?.["Top Priorities"]?.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Quick Wins */}
        <div className="p-4 sm:p-6 relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-1">Quick Wins:</h3>
          <ul className="text-sm text-[#364153] space-y-1">
            {summaryCards?.["Quick Wins"]?.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);




const TabNavigation = ({ activeTab, setActiveTab }) => (
    <div className="w-fit mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 p-2 bg-[#F4F4F4] rounded-xl border border-[#EAEBF0]">
        <button
          onClick={() => setActiveTab("findings")}
          className={`w-auto sm:w-auto flex-1 sm:flex-none px-16 py-2 font-semibold text-sm transition-colors rounded-xl ${
            activeTab === "findings"
              ? "text-white bg-[#3D0E8B] shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          Findings
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`w-auto sm:w-auto flex-1 sm:flex-none px-16 py-2 font-semibold text-sm transition-colors rounded-xl ${
            activeTab === "insights"
              ? "text-white bg-[#3D0E8B] shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab("30/60/90")}
          className={`w-auto sm:w-auto flex-1 sm:flex-none px-16 py-2 font-semibold text-sm transition-colors rounded-xl ${
            activeTab === "30/60/90"
              ? "text-white bg-[#3D0E8B]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          30/60/90
        </button>
      </div>
    </div>
  )

const ThirtyDayPlan = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">30 / 60 / 90 Day Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-md font-bold text-gray-900 mb-4">30 Days</h3>
          <ul className="space-y-3 list-disc list-inside">
            {plan?.["30_days"]?.map((task, i) => (
              <li key={i} className="text-sm text-[#364153] leading-snug">
                {task}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-bold text-gray-900 mb-4">60 Days</h3>
          <ul className="space-y-3 list-disc list-inside">
            {plan?.["60_days"]?.map((task, i) => (
              <li key={i} className="text-sm text-[#364153] leading-snug">
                {task}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-bold text-gray-900 mb-4">90 Days</h3>
          <ul className="space-y-3 list-disc list-inside">
            {plan?.["90_days"]?.map((task, i) => (
              <li key={i} className="text-sm text-[#364153] leading-snug">
                {task}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const FindingItem = ({ severity, title }) => {
    const getIconPath = () => {
      switch (severity?.toLowerCase()) {
        case "important":
          return "/pulsehub-dashboard/important.svg"
        case "critical":
          return "/pulsehub-dashboard/critical.svg"
        case "quick win":
          return "/pulsehub-dashboard/quickwin.svg"
        default:
          return null
      }
    }
  
    const getSeverityColor = () => {
      switch (severity?.toLowerCase()) {
        case "important":
          return "#D08700"
        case "critical":
          return "#E7000B"
        case "quick win":
          return "#00A63E"
        default:
          return "#6B7280"
      }
    }
  
    const iconPath = getIconPath()
    const color = getSeverityColor()
  
    return (
      <div className="flex items-start gap-3">
        {iconPath && (
          <img
            src={iconPath}
            alt={severity}
            className="w-5 h-5 flex-shrink-0 mt-0.5"
          />
        )}
  
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color }}
          >
            {severity}
          </span>
          <span className="text-sm text-gray-700">{title}</span>
        </div>
      </div>
    )
  }

const AuditSection = ({ title, score, findings, expanded, onToggle }) => {
    const visibleFindings = expanded ? findings : findings.slice(0, 3);
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{score}/100</span>
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-6 py-3 border-t border-b border-gray-200">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Finding
          </h4>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Why It Matters
          </h4>
        </div>
  
        <div className="divide-y divide-gray-200">
          {visibleFindings.map((f, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-6 py-4"
            >
              <div>
                <FindingItem severity={f.severity} title={f.title} />
              </div>
              <div>
                <p className="text-sm text-gray-600 italic">{f.why_it_matters}</p>
              </div>
            </div>
          ))}
        </div>
  
        {findings.length > 3 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onToggle}
              className="text-sm text-[#6A7282] flex items-center gap-1 hover:underline"
            >
              {expanded ? "View Less" : "View More"}
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

const InsightsTable = ({ insights }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 w-full">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center sm:text-left">
          AI Insights & Recommendations
        </h2>

        <div className="hidden md:grid md:grid-cols-5 gap-4 pb-3 border-b border-gray-200 mb-4">
          <div className="text-sm font-bold text-black text-center">Category</div>
          <div className="text-sm font-bold text-black text-center">Insight</div>
          <div className="text-sm font-bold text-black text-center">Recommendation</div>
          <div className="text-sm font-bold text-black text-center">Impact</div>
          <div className="text-sm font-bold text-black text-center">Assign</div>
        </div>

        <div className="divide-y divide-gray-200">
          {insights?.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:grid md:grid-cols-5 gap-3 md:gap-4 py-4"
            >
              <div className="text-sm font-medium text-[#0F172A] break-words">
                <span className="md:hidden font-semibold text-gray-600">Category: </span>
                {item.category}
              </div>

              <div className="text-sm text-[#0F172A] break-words">
                <span className="md:hidden font-semibold text-gray-600">Insight: </span>
                {item.insight}
              </div>

              <div className="text-sm text-[#0F172A] break-words">
                <span className="md:hidden font-semibold text-gray-600">Recommendation: </span>
                {item.recommendation}
              </div>

              <div className="text-sm font-semibold text-green-600 break-words">
                <span className="md:hidden font-semibold text-gray-600">Impact: </span>
                {item.impact}
              </div>

              <div className="mt-2 md:mt-0">
                <button className="w-full bg-[#3D0E8B] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#2D0A6B] transition-colors">
                  {item.assign || "Assign"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompetitorComparison = ({ competitor }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Competitor Comparison</h2>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Gaps</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-none p-0 m-0">
              {competitor?.gaps?.map((gap, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-gray-400">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
  
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Opportunities</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-none p-0 m-0">
              {competitor?.opportunities?.map((opp, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-gray-400">•</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-none p-0 m-0">
              {competitor?.insights?.map((insight, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-gray-400">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
  
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-none p-0 m-0">
              {competitor?.recommendations?.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-gray-400">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

// ====================== Main Component ======================

const AuditResultsPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("findings")
  const [expandedSections, setExpandedSections] = useState({})
  const [auditData, setAuditData] = useState(null)

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleExport = async (format) => {
    // Get the appropriate URL from the audit data
    const storedData = sessionStorage.getItem('auditData')
    if (!storedData) {
      alert('Audit data not available')
      return
    }

    const state = JSON.parse(storedData)
    const files = state?.files || {}
    
    let fileUrl
    if (format === 'md') {
      fileUrl = files.markdown
    } else if (format === 'json') {
      fileUrl = files.json
    } else if (format === 'pdf') {
      fileUrl = files.pdf
    }

    if (!fileUrl) {
      alert(`${format.toUpperCase()} file not available`)
      return
    }
    
    try {
      // Files are now GCS URLs, just open them directly
      window.open(fileUrl, '_blank')
    } catch (error) {
      console.error("Download error:", error)
      alert(`Failed to download ${format.toUpperCase()}. Please try again.`)
    }
  }

  useEffect(() => {
    const storedData = sessionStorage.getItem('auditData')
    if (!storedData) {
      // If no audit data, redirect back to performance audit page
      router.push('/performance-audit')
      return
    }

    const state = JSON.parse(storedData)
    const result = state.auditData
    const sections = Object.entries(result.sections || {}).map(([key, section], index) => ({
      id: index + 1,
      title: key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      score: section.score,
      findings: section.findings || []
    }))

    setAuditData({
      score: result.overall_score,
      grade: result.overall_grade,
      performanceLevel: result.performance_level,
      summary: result.executive_summary,
      summaryCards: result.summary_cards,
      sections: sections,
      insights: result.insights_tab,
      plan: result.plan_30_60_90,
      competitor: result.competitor_snapshot,
      files: state.files || {},
      websiteUrl: state.websiteUrl,
      auditName: state.auditName
    })
  }, [])

  if (!auditData) return null

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <Sidebar
        selectedMenuItem="Performance Audit"
        onMenuItemClick={() => {}}
      />

      <div className="flex-1 flex flex-col">
        <NavBar />

        <main className="flex-1 p-6 overflow-y-auto">
          <DashboardHeader
            heading="AI-Powered Marketing Audit"
            subtext="AI Findings, Insights & Recommendations"
            exportOptions={["pdf", "md", "json"]}
            onExport={handleExport}
          />

          <GradeDisplay
            score={auditData.score}
            grade={auditData.grade}
            performanceLevel={auditData.performanceLevel}
          />
          <ExecutiveSummary
            summary={auditData.summary}
            summaryCards={auditData.summaryCards}
          />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          {activeTab === "findings" && (
            <>
              {auditData.sections.map((section) => (
                <AuditSection
                  key={section.id}
                  {...section}
                  expanded={expandedSections[section.id]}
                  onToggle={() => toggleSection(section.id)}
                />
              ))}
              <CompetitorComparison competitor={auditData.competitor} />
            </>
          )}

          {activeTab === "insights" && (
            <InsightsTable insights={auditData.insights} />
          )}

          {activeTab === "30/60/90" && (
            <ThirtyDayPlan plan={auditData.plan} />
          )}
        </main>
      </div>
    </div>
  )
}

export default AuditResultsPage