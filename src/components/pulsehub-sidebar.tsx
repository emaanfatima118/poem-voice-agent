"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface MenuItem {
  id: string
  icon: string
  label: string
  route: string
}

interface Module {
  name: string
  route: string
}

interface User {
  username?: string
  email?: string
}

interface SidebarProps {
  selectedMenuItem?: string
  onMenuItemClick?: (itemId: string) => void
}

const Sidebar = ({ selectedMenuItem, onMenuItemClick }: SidebarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isModulesOpen, setIsModulesOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string>('Pulse Hub')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Update selected module based on current route
  useEffect(() => {
    if (pathname) {
      if (pathname.startsWith('/brand-craft')) {
        setSelectedModule('Brand Craft')
      } else if (pathname.startsWith('/flight-deck')) {
        setSelectedModule('Flight Deck')
      } else if (pathname.startsWith('/pulse-hub') || pathname.startsWith('/pulse-hub-dashboard')) {
        setSelectedModule('Pulse Hub')
      }
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user')
      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const modules: Module[] = [
    { name: 'Pulse Hub', route: '/pulse-hub-dashboard' },
    { name: 'Flight Deck', route: '/flight-deck' },
    { name: 'Brand Craft', route: '/brand-craft' }
  ]

  // Default menu items for Pulse Hub
  const defaultMenuItems: MenuItem[] = [
    { id: 'Dashboard', icon: 'home', label: 'Dashboard', route: '/pulse-hub-dashboard' },
    { id: 'Performance Audit', icon: 'clipboard', label: 'Performance Audit', route: '/performance-audit' },
    { id: 'AI Intelligence', icon: 'lightbulb', label: 'AI Intelligence', route: '/ai-intelligence' },
    { id: 'Roadmaps and Recommendations', icon: 'chart', label: 'Roadmaps & Recommendations', route: '/roadmaps' },
    { id: 'ABM Command Center', icon: 'fire', label: 'ABM Command Center', route: '/abm-command' },
    { id: 'Competitor Analysis & Benchmarking', icon: 'bar-chart', label: 'Competitor Analysis', route: '/competitor-analysis' },
    { id: 'Leadership & Sales Reports', icon: 'document', label: 'Leadership Reports', route: '/leadership-reports' },
    { id: 'GTM Test Pit', icon: 'flask', label: 'GTM Test Pit', route: '/gtm-test-pit' }
  ]

  // Brand Craft menu items
  const brandCraftMenuItems: MenuItem[] = [
    { id: 'Dashboard', icon: 'home', label: 'Dashboard', route: '/brand-craft' },
    { id: 'Messaging House', icon: 'home', label: 'Messaging House', route: '/brand-craft/messaging-house' },
    { id: 'Content Strategy', icon: 'clipboard', label: 'Content Strategy', route: '/brand-craft/content-strategy' },
    { id: 'Keyword Research', icon: 'lightbulb', label: 'Keyword Research', route: '/brand-craft/keyword-research' },
    { id: 'Content Creation', icon: 'chart', label: 'Content Creation', route: '/brand-craft/content-creation' },
    { id: 'Campaign Builder', icon: 'fire', label: 'Campaign Builder', route: '/brand-craft/campaign-builder' },
    { id: 'Brand Tone Check', icon: 'bar-chart', label: 'Brand Tone Check', route: '/brand-craft/brand-tone-check' },
    { id: 'Thought Leadership & Executive Visibility', icon: 'document', label: 'Thought Leadership & Executive Visibility', route: '/brand-craft/thought-leadership' }
  ]

  // Flight Deck menu items
  const flightDeckMenuItems: MenuItem[] = [
    { id: 'Dashboard', icon: 'home', label: 'Dashboard', route: '/flight-deck' },
    { id: 'Flight Board', icon: 'globe', label: 'Flight Board', route: '/flight-deck/distribution' },
    { id: 'Campaign Insights', icon: 'chart', label: 'Campaign Insights', route: '/flight-deck/campaign-insights' },
    { id: 'Content & Campaign Calendar', icon: 'clipboard', label: 'Content & Campaign Calendar', route: '/flight-deck/content-calendar' },
    { id: 'Spend Tracking', icon: 'document', label: 'Spend Tracking', route: '/flight-deck/budget' },
    { id: 'Audience Engine', icon: 'lightbulb', label: 'Audience Engine', route: '/flight-deck/personalization-engine' },
    { id: 'Scheduling', icon: 'phone', label: 'Scheduling', route: '/flight-deck/content-calendar' },
    { id: 'Collaboration + Workflows', icon: 'fire', label: 'Collaboration + Workflows', route: '/flight-deck/collaboration-tools' },
    { id: 'Asset Management', icon: 'bar-chart', label: 'Asset Management', route: '/flight-deck/asset-management' }
  ]

  // Get menu items based on selected module
  const getMenuItems = (): MenuItem[] => {
    if (selectedModule === 'Brand Craft') {
      return brandCraftMenuItems
    }
    if (selectedModule === 'Flight Deck') {
      return flightDeckMenuItems
    }
    return defaultMenuItems
  }

  const menuItems = getMenuItems()

  // Get background image based on selected module
  const getBackgroundImage = (): string => {
    if (selectedModule === 'Brand Craft') {
      return 'url("/brandcraft/dashboard-sidemenu-bg.svg")'
    }
    if (selectedModule === 'Flight Deck') {
      return 'url("/flightdeck/dashboard-sidemenu-bg.svg")'
    }
    return 'url("/pulsehub-dashboard/sidemenu.svg")'
  }

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      clipboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
      lightbulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
      chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      fire: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />,
      'bar-chart': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      document: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      globe: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      flask: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
      phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    }
    return icons[iconName] || icons.home
  }

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module.name)
    setIsModulesOpen(false)
    handleNavigation(module.route)
    setIsMobileMenuOpen(false)
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item.id)
    }
    handleNavigation(item.route)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div 
        className="hidden lg:block w-64 text-white min-h-screen relative"
        style={{
          backgroundImage: getBackgroundImage(),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="p-6 relative z-10">
          {/* Modules Dropdown */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">MODULES</h3>
            <div className="space-y-2">
              <div className="relative">
                <button
                  onClick={() => setIsModulesOpen(!isModulesOpen)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-transparent text-white rounded-lg border border-white hover:bg-white/10 transition-colors"
                >
                  <span className="font-semibold text-base">{selectedModule}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isModulesOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isModulesOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                    {modules.map((module) => (
                      <button
                        key={module.name}
                        onClick={() => handleModuleClick(module)}
                        className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors ${
                          selectedModule === module.name ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {module.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div>
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">OVERVIEW</h3>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center py-3 px-4 -mx-6 cursor-pointer transition-colors ${
                    selectedMenuItem === item.id 
                      ? selectedModule === 'Brand Craft'
                        ? 'bg-white text-[#c009ba] border-l-4 border-[#c009ba]'
                        : selectedModule === 'Flight Deck'
                        ? 'bg-white text-[#1e40f2] border-l-4 border-[#1e40f2]'
                        : 'bg-white text-blue-900 border-l-4 border-blue-900'
                      : 'text-white hover:text-white hover:bg-[#5D3FD3]'
                  }`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(item.icon)}
                  </svg>
                  <span className={selectedMenuItem === item.id ? 'font-semibold text-base' : ''}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[10000] text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 shadow-md bg-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            style={{ top: '4rem', bottom: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div 
            className="fixed left-0 right-0 bg-white shadow-lg z-50 lg:hidden overflow-y-auto"
            style={{ top: '4rem', height: 'calc(100vh - 4rem)' }}
          >
            <div className="p-4 pt-8 pb-6 min-h-full">
              {/* Modules Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">MODULES</h3>
                <div className="relative">
                  <button
                    onClick={() => setIsModulesOpen(!isModulesOpen)}
                    className="w-full flex items-center justify-between py-3 px-4 bg-white text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-base">{selectedModule}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isModulesOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isModulesOpen && (
                    <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      {modules.map((module) => (
                        <button
                          key={module.name}
                          onClick={() => handleModuleClick(module)}
                          className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-200 last:border-b-0 ${
                            selectedModule === module.name ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {module.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Items Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">OVERVIEW</h3>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors ${
                        selectedMenuItem === item.id 
                          ? selectedModule === 'Brand Craft'
                            ? 'bg-pink-50 text-[#c009ba] border-2 border-[#c009ba]'
                            : selectedModule === 'Flight Deck'
                            ? 'bg-blue-50 text-[#1e40f2] border-2 border-[#1e40f2]'
                            : 'bg-indigo-100 text-indigo-700 border-2 border-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getIcon(item.icon)}
                      </svg>
                      <span className={selectedMenuItem === item.id ? 'font-semibold text-base' : ''}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Section for Mobile */}
              {mounted && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-full flex items-center space-x-3 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</div>
                        <div className="text-xs text-gray-500">{user?.email || ''}</div>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isProfileOpen && (
                      <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => router.push('/integrations')}
                          className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors text-gray-700 font-medium flex items-center space-x-2 border-b border-gray-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span>Integrations</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-medium flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Fixed User Icon at Bottom Left Corner */}
      {mounted && (
        <div className="fixed bottom-6 left-6 z-[10001]">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-700 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-indigo-200"
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</div>
                  <div className="text-xs text-gray-500 mt-1">{user?.email || ''}</div>
                </div>
                <button
                  onClick={() => router.push('/integrations')}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors text-gray-700 font-medium flex items-center space-x-2 border-b border-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Integrations</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar

