"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { NavBar } from "./components/NavBar"
import Sidebar from "./components/pulsehub-sidebar"
import DashboardHeader from "./components/pulsehub-header"
import AuditTopicCard from "./components/pulsehub-performanceAudit/topicCard"
import FormInput from "./components/pulsehub-performanceAudit/formInput"
import SectionHeader from "./components/pulsehub-performanceAudit/sectionHeader"

const PerformanceAudit = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState({ audit: false })
  const [selectedMenuItem, setSelectedMenuItem] = useState("Performance Audit")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [auditName, setAuditName] = useState("")
  const [selectedTopics, setSelectedTopics] = useState({})
  const [urlError, setUrlError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const auditTopics = [
    { id: 1, title: "Brand Messaging", subtitle: "Logo, Value Proposition, Visual Identity Consistency" },
    { id: 2, title: "Website SEO", subtitle: "Keywords, Metadata, Technical SEO" },
    { id: 3, title: "Content Marketing", subtitle: "Blog Quality, Frequency, Relevance" },
    { id: 4, title: "Social Media", subtitle: "Engagement, Branding, Consistency" },
    { id: 5, title: "Lead Generation", subtitle: "Load Speed, UX, Accessibility" },
    { id: 6, title: "Email Marketing", subtitle: "Campaign Design, Conversion Rates" },
    { id: 7, title: "Paid Advertising", subtitle: "Targeting, ROI, Ad Quality" },
    { id: 8, title: "Analytics & Tracking", subtitle: "Loyalty Programs, Feedback Loops" },
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => setIsVisible({ audit: true }), 100)
  }, [])

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem)
  }

  const handleTopicToggle = (id) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSelectAll = () => {
    const allSelected = {}
    auditTopics.forEach((topic) => {
      allSelected[topic.id] = true
    })
    setSelectedTopics(allSelected)
  }

  const handleClearAll = () => {
    setSelectedTopics({})
  }

  const validateUrl = (value) => {
    // Accepts URLs with or without protocol, multiple subdomains, and optional paths/query strings
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
  
    if (!value.trim()) {
      setUrlError("Website URL is required.");
      return false;
    }
  
    // Auto-add https:// if missing
    const normalizedUrl = value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;
  
    if (!urlPattern.test(normalizedUrl)) {
      setUrlError("Please enter a valid website URL (e.g., https://example.com).");
      return false;
    }
  
    setUrlError("");
    return true;
  };
  

  const handleUrlChange = (e) => {
    const value = e.target.value
    setWebsiteUrl(value)
    validateUrl(value)
  }


  const handleStartAudit = async () => {
    const isValid = validateUrl(websiteUrl)
    if (!isValid) return
  
    const selected = auditTopics.filter((topic) => selectedTopics[topic.id])
    if (selected.length === 0) {
      alert("Please select at least one topic before starting the audit.")
      return
    }

    // Show loading state
    setIsLoading(true)
    setLoadingMessage("Analyzing website...")

    try {
      // Normalize URL
      const normalizedUrl = websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://")
        ? websiteUrl
        : `https://${websiteUrl}`

      // Prepare API request
      // Get user ID from localStorage (set during login)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user.userid || user.id || 2 // Default to userid=2 (first real user)

      const requestBody = {
        url: normalizedUrl,
        audit_name: auditName || undefined,
        selected_topics: selected.map(t => t.title),
        user_id: userId,
        debug: false,
        model: "gpt-4o"
      }

      setLoadingMessage("Running audit (this may take 30-60 seconds)...")

      // Call the Next.js API endpoint
      const response = await fetch('/api/audit/run-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Audit failed')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Audit failed')
      }

      setLoadingMessage("Audit complete! Loading results...")

      // Store audit data in sessionStorage for the results page
      sessionStorage.setItem('auditData', JSON.stringify({
        auditData: data.result,
        files: data.files || {},
        websiteUrl: normalizedUrl,
        auditName: auditName || normalizedUrl
      }))

      // Navigate to results page
      router.push('/audit-results')
    } catch (error) {
      console.error("Audit error:", error)
      alert(`Audit failed: ${error.message}. Please try again.`)
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
    }
  }

  const handleExport = (format) => {
    const selected = auditTopics.filter((topic) => selectedTopics[topic.id])
    const exportData = {
      websiteUrl,
      auditName,
      selectedTopics: selected.map(topic => ({
        id: topic.id,
        title: topic.title,
        subtitle: topic.subtitle
      })),
      timestamp: new Date().toISOString()
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `performance-audit-config-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else if (format === 'csv') {
      const csvRows = [
        ['Field', 'Value'],
        ['Website URL', websiteUrl],
        ['Audit Name', auditName || 'N/A'],
        ['Selected Topics', selected.map(t => t.title).join('; ')],
        ['Timestamp', exportData.timestamp]
      ]
      const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `performance-audit-config-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else if (format === 'pdf') {
      // For PDF, we could use a library or create a simple text representation
      // For now, we'll create a text file that can be converted to PDF
      const textContent = `Performance Audit Configuration\n\n` +
        `Website URL: ${websiteUrl}\n` +
        `Audit Name: ${auditName || 'N/A'}\n\n` +
        `Selected Topics:\n${selected.map(t => `- ${t.title}: ${t.subtitle}`).join('\n')}\n\n` +
        `Generated: ${new Date().toLocaleString()}`
      const blob = new Blob([textContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `performance-audit-config-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }
  

  const globeIcon = (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.5 2.5 7.5 0 10s-2.5 7.5 0 10m0-20a10 10 0 010 20m0 0a10 10 0 01-10-10m10 10a10 10 0 0010-10"
    />
  )

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
        {/* Sidebar */}
        <Sidebar selectedMenuItem={selectedMenuItem} onMenuItemClick={handleMenuItemClick} />

        {/* Main Content */}
        <div className="flex-1">
          <NavBar 
            exportOptions={["json", "csv", "pdf"]}
            onExport={handleExport}
          />

          <div className="p-4 sm:p-6">
            <div
              className={`transition-all duration-1000 ease-in-text ${
                isVisible.audit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              {/* Dashboard Header */}
              <DashboardHeader
                heading="AI-Powered Marketing Audit"
                subtext="AI Findings, Insights & Recommendations"
                exportOptions={["json", "csv", "pdf"]}
                onExport={handleExport}
              />

              {/* Main Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                {/* Start Audit Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Start your Audit</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Lorem ipsum dolor sit amet consectetur. Vel odio pharetra at valus tellor
                    vitam. Semper etiam arcu, vehicula proin. Eu pulvinar commodo tempor ridicula.
                    Vulputate etiam sociis quis mauris.
                  </p>

                  {/* Website URL Input */}
                  <FormInput
                 
                    label="Website URL"
                    placeholder="https://www.youtube.com"
                    value={websiteUrl}
                    onChange={handleUrlChange}
                    required={true}
                    icon={globeIcon}
                  />
                  {urlError && (
                    <p className="text-red-500 text-sm mt-[-3] mb-4">{urlError}</p>
                  )}

                  {/* Audit Name Input */}
                  <FormInput
                    label="Audit Name (optional)"
                    placeholder="Company Website Audit"
                    value={auditName}
                    onChange={(e) => setAuditName(e.target.value)}
                  />
                </div>

                {/* Select Audit Topics Section */}
                <div>
                  <SectionHeader
                    title="Select Audit Topics"
                    actions={
                      <>
                        <button
                          onClick={handleSelectAll}
                          className="px-4 py-2 bg-[#3D0E8B] text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Clear All
                        </button>
                      </>
                    }
                  />

                  {/* Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {auditTopics.map((topic) => (
                      <AuditTopicCard
                        key={topic.id}
                        title={topic.title}
                        subtitle={topic.subtitle}
                        isChecked={selectedTopics[topic.id] || false}
                        onChange={() => handleTopicToggle(topic.id)}
                      />
                    ))}
                  </div>

                  {/* Start Audit Button */}
                  <button
                    onClick={handleStartAudit}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#3D0E8B] text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {loadingMessage}
                      </span>
                    ) : (
                      "Start Audit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-[#3D0E8B] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Running Audit</h3>
              <p className="text-sm text-gray-600 mb-4">{loadingMessage}</p>
              <p className="text-xs text-gray-500">This may take 30-60 seconds. Please do not close this window.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerformanceAudit
