import { Link, useLocation } from 'wouter'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Trash2, Menu, X } from 'lucide-react'
import { modules, resourcesLink } from '@/stackwise-demo/config/modules'
import { Button } from '@/stackwise-demo/components/ui/button'

export function AppSidebar() {
  const [location] = useLocation()
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Check if we're on desktop
  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // Auto-expand when navigating to a module (only on location change)
  useEffect(() => {
    const currentModule = modules.find(m => 
      location.startsWith(m.path) && m.path !== '/'
    )
    if (currentModule && currentModule.features && currentModule.features.length > 0) {
      setExpandedModule(currentModule.id)
    } else if (location === '/') {
      setExpandedModule(null)
    }
  }, [location])

  const toggleModule = (moduleId: string) => {
    setExpandedModule(prev => prev === moduleId ? null : moduleId)
  }

  const isActiveLink = (path: string) => {
    if (path === '/') return location === '/'
    return location.startsWith(path)
  }

  // Get sidebar background based on current module
  const getSidebarBackground = () => {
    if (location === '/') return { type: 'gradient', value: 'from-[#6218df] to-[#6218df]' } // Solid purple for Overview
    if (location.startsWith('/strategy-studio')) return { type: 'image', value: '/strategy-studio/sidemenu-bg.svg' }
    if (location.startsWith('/pulse-hub')) return { type: 'image', value: '/pulsehub-dashboard/sidemenu.svg' } // Pulse Hub uses same as Strategy Studio
    if (location.startsWith('/brand-craft')) return { type: 'image', value: '/brandcraft/dashboard-sidemenu-bg.svg' }
    if (location.startsWith('/flight-deck')) return { type: 'image', value: '/flightdeck/dashboard-sidemenu-bg.svg' }
    return { type: 'gradient', value: 'from-[#6218df] to-[#6218df]' }
  }
  
  const sidebarBg = getSidebarBackground()

  const SidebarContent = () => (
    <>
      {/* White top area with logo */}
      <div className="h-16 bg-white border-b flex items-center justify-start px-4">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src="/stackwise-demo/stackwise-logo-full.png" 
            alt="Stackwise" 
            className="h-10 cursor-pointer" 
            data-testid="logo-sidebar"
          />
        </Link>
      </div>

      {/* Colored navigation area with gradient or background image */}
      <nav 
        className={`flex-1 overflow-y-auto p-3 space-y-1 text-white transition-all duration-300 ${
          sidebarBg.type === 'gradient' ? `bg-gradient-to-b ${sidebarBg.value}` : 'bg-cover bg-center bg-no-repeat'
        }`}
        style={sidebarBg.type === 'image' ? { backgroundImage: `url(${sidebarBg.value})` } : {}}
      >
        {modules.map((module) => {
          const isExpanded = expandedModule === module.id
          const hasFeatures = module.features && module.features.length > 0
          const isActive = isActiveLink(module.path)
          const ModuleIcon = module.icon

          return (
            <div key={module.id} className="space-y-1">
              {/* Module button */}
              <div className="flex items-center gap-1">
                <Link href={module.path} className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 text-white hover:bg-white/10 ${
                      isActive && !hasFeatures ? 'bg-white/20' : ''
                    }`}
                    data-testid={`nav-${module.id}`}
                  >
                    <ModuleIcon className="w-4 h-4 text-white" />
                    <span className="flex-1 text-left text-sm">{module.label}</span>
                  </Button>
                </Link>
                
                {hasFeatures && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-white hover:bg-white/10"
                    onClick={() => toggleModule(module.id)}
                    data-testid={`toggle-${module.id}`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* Features submenu */}
              {hasFeatures && isExpanded && (
                <div className="ml-6 space-y-1 border-l-2 border-white/30 pl-3">
                  {module.features!.map((feature) => {
                    const isFeatureActive = location === feature.path
                    
                    return (
                      <Link key={feature.id} href={feature.path} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm text-white/80 hover:text-white hover:bg-white/10 h-auto py-2 whitespace-normal text-left ${
                            isFeatureActive ? 'bg-white/20 text-white' : ''
                          }`}
                          data-testid={`nav-${module.id}-${feature.id}`}
                        >
                          <span className="line-clamp-2">{feature.label}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Divider */}
        <div className="border-t border-white/30 my-3" />

        {/* Resources Link */}
        <Link href={resourcesLink.path} onClick={() => setIsMobileMenuOpen(false)}>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 text-white hover:bg-white/10 ${
              isActiveLink(resourcesLink.path) ? 'bg-white/20' : ''
            }`}
            data-testid="nav-resources"
          >
            <resourcesLink.icon className="w-4 h-4 text-white" />
            <span className="flex-1 text-left text-sm">{resourcesLink.label}</span>
          </Button>
        </Link>

        {/* Recycle Bin Link */}
        <Link href="/recycle-bin" onClick={() => setIsMobileMenuOpen(false)}>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 text-white hover:bg-white/10 ${
              isActiveLink('/recycle-bin') ? 'bg-white/20' : ''
            }`}
            data-testid="nav-recycle-bin"
          >
            <Trash2 className="w-4 h-4 text-white" />
            <span className="flex-1 text-left text-sm">Recycle Bin</span>
          </Button>
        </Link>
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar - Visible on lg and above */}
      {isDesktop && (
        <aside className="w-64 h-screen flex-shrink-0">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </aside>
      )}

      {/* Mobile Menu Button - Only visible on mobile */}
      {!isDesktop && (
        <>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed bottom-6 right-6 z-[10000] p-3 rounded-lg shadow-lg bg-[#6218df] text-white hover:bg-[#4a0fb8] transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-[9998]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Mobile Sidebar */}
              <div className="fixed inset-y-0 left-0 w-64 z-[9999] flex flex-col animate-in slide-in-from-left duration-300">
                <SidebarContent />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
