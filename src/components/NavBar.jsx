"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Save, Download, Lightbulb, Layers, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { StackwiseSageDrawer } from './StackwiseSageDrawer'

export function NavBar({ exportOptions, onExport }) {
  const router = useRouter()
  const [lastSaved, setLastSaved] = useState(null)
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false)
  const [currentModule, setCurrentModule] = useState('Strategy')
  const exportDropdownRef = useRef(null)

  // Determine current module based on route
  const getCurrentModule = () => {
    if (typeof window === 'undefined') return 'Strategy';
    const location = window.location.pathname
    if (location.startsWith('/strategy-studio')) return 'Strategy'
    if (location.startsWith('/pulse-hub')) return 'PulseHub'
    if (location.startsWith('/brand-craft')) return 'BrandCraft'
    if (location.startsWith('/flight-deck')) return 'FlightDeck'
    return 'Strategy' // Default for home/overview
  }

  useEffect(() => {
    setCurrentModule(getCurrentModule())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => handleSave(), 180000) // Auto-save every 3 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportDropdownOpen(false)
      }
    }

    if (isExportDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExportDropdownOpen])

  const handleSave = () => setLastSaved(new Date())

  const handleExportClick = (format) => {
    setIsExportDropdownOpen(false)
    if (onExport) {
      onExport(format)
    }
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    router.push('/')
  }

  const handleMyPlaysClick = (e) => {
    e.preventDefault()
    router.push('/strategy-studio/my-plays')
  }

  return (
    <>
      <nav className="h-16 border-b border-gray-200 bg-white flex items-center justify-between fixed top-0 left-0 right-0 z-[9999] px-2 sm:px-4 lg:px-6">
        {/* Logo - visible on desktop when sidebar is present, always visible on mobile */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 flex items-center pl-4 mt-3" style={{ width: '256px', zIndex: 100 }}>
          <Link href="/" onClick={handleLogoClick}>
            <div className="cursor-pointer flex items-center" data-testid="link-logo">
              <img src="/full-logo.svg" alt="Stackwise" className="h-8 sm:h-10 w-auto" />
            </div>
          </Link>
        </div>
        
        {/* Mobile Logo - shown when sidebar is hidden */}
        <div className="lg:hidden flex items-center h-full">
          <Link href="/" onClick={handleLogoClick}>
            <div className="cursor-pointer flex items-center" data-testid="link-logo-mobile">
              <img src="/full-logo.svg" alt="Stackwise" className="h-8 w-auto" />
            </div>
          </Link>
        </div>

        {/* Right-side navigation - Action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
          {/* Timestamp - hidden on small screens */}
          {lastSaved && (
            <span className="hidden sm:inline-block text-xs text-gray-500 mr-1">Last saved {lastSaved.toLocaleTimeString()}</span>
          )}
          
          {/* Action buttons group */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Save button - icon only on mobile */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave} 
              data-testid="button-save"
              className="px-2 sm:px-3"
              style={{ color: '#12122B', borderColor: '#12122B' }}
            >
              <Save className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            
            {/* Export button */}
            {exportOptions && exportOptions.length > 0 ? (
              <div className="relative" ref={exportDropdownRef}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  data-testid="button-export"
                  className="px-2 sm:px-3"
                  style={{ color: '#12122B', borderColor: '#12122B' }}
                >
                  <Download className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="w-3 h-3 ml-1 hidden sm:inline" />
                </Button>
                {isExportDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {exportOptions.map((format) => (
                      <button
                        key={format}
                        onClick={() => handleExportClick(format)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors uppercase"
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                data-testid="button-export"
                className="px-2 sm:px-3"
                style={{ color: '#12122B', borderColor: '#12122B' }}
              >
                <Download className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}
            
            {/* My Plays - hidden on mobile, icon only on tablet */}
            <Link href="/strategy-studio/my-plays" onClick={handleMyPlaysClick} className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-pink-300 text-pink-700 hover:bg-pink-50 px-2 sm:px-3" 
                data-testid="button-my-plays-quick"
              >
                <Lightbulb className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden lg:inline">My Plays</span>
              </Button>
            </Link>
          </div>

          {/* Separator - hidden on mobile */}
          <div className="hidden md:block h-6 w-px bg-gray-300 mx-1" />

          {/* Stacks button - hidden on mobile, icon only on tablet */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex border-blue-300 text-blue-700 hover:bg-blue-50 px-2 sm:px-3" 
            data-testid="button-stacks"
          >
            <Layers className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden lg:inline">Stacks</span>
          </Button>

          {/* Stackwise Sage - always visible */}
          <div className="ml-1 sm:ml-2">
            <StackwiseSageDrawer module={currentModule} />
          </div>
        </div>
      </nav>
    </>
  )
}

