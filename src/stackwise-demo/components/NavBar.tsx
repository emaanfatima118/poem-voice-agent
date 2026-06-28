import { Link, useLocation } from 'wouter'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Save, Download, Lightbulb, Layers, User, LogOut, Settings, ChevronDown, FileText, FileJson, FileCode } from 'lucide-react'
import { useState, useEffect } from 'react'
import { StackwiseSageDrawer } from '@/stackwise-demo/components/StackwiseSageDrawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/stackwise-demo/components/ui/dropdown-menu'
import { useUser } from '@/stackwise-demo/contexts/UserContext'
import { useToast } from '@/stackwise-demo/hooks/use-toast'

export function NavBar() {
  const [location] = useLocation()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  // Determine current module based on route
  const getCurrentModule = (): 'Strategy' | 'PulseHub' | 'BrandCraft' | 'FlightDeck' => {
    if (location.startsWith('/strategy-studio')) return 'Strategy'
    if (location.startsWith('/pulse-hub')) return 'PulseHub'
    if (location.startsWith('/brand-craft')) return 'BrandCraft'
    if (location.startsWith('/flight-deck')) return 'FlightDeck'
    return 'Strategy' // Default for home/overview
  }



  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  const handleSave = async () => {
    setLastSaved(new Date())
    
    // Special handling for Pulse Hub audit results - save report to Google Storage
    if (location.includes('/pulse-hub/audit-results')) {
      // Extract audit ID from query parameter ?id=123
      const urlParams = new URLSearchParams(window.location.search)
      const auditId = urlParams.get('id')
      
      if (auditId) {
        try {
          toast({
            title: "Saving audit report...",
            description: "Generating and uploading report to storage.",
          })
          
          const response = await fetch(`/api/audits/${auditId}/save-report`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to save audit report')
          }
          
          const data = await response.json()
          
          toast({
            title: "✓ Audit report saved",
            description: `Report saved to storage: ${data.filename || 'audit-report.pdf'}`,
          })
        } catch (error: any) {
          console.error('Error saving audit report:', error)
          toast({
            title: "Failed to save report",
            description: error.message || "Please try again.",
            variant: "destructive",
          })
        }
        return
      }
    }
    
    // Default save behavior for other pages
    toast({
      title: "Saved successfully",
      description: "Your work has been saved.",
    })
  }

  const handleExport = async (format: 'pdf' | 'json' | 'md') => {
    // Special handling for Pulse Hub audit results
    if (location.includes('/pulse-hub/audit-results')) {
      // Extract audit ID from query parameter ?id=123
      const urlParams = new URLSearchParams(window.location.search)
      const auditId = urlParams.get('id')
      
      if (auditId) {
        try {
          toast({
            title: "Exporting...",
            description: `Generating ${format.toUpperCase()} export...`,
          })
          
          console.log(`[Export] Fetching audit ${auditId} as ${format}`)
          const response = await fetch(`/api/audits/${auditId}/export?format=${format}`)
          
          console.log(`[Export] Response status: ${response.status}, content-type: ${response.headers.get('content-type')}`)
          
          if (!response.ok) {
            let errorMessage = `Export failed with status ${response.status}`
            try {
              const errorData = await response.json()
              console.error('Export API error:', errorData)
              errorMessage = errorData.error || errorData.message || errorMessage
            } catch (e) {
              const textError = await response.text().catch(() => '')
              console.error('Export API error (non-JSON):', textError)
              if (textError) errorMessage = textError
            }
            throw new Error(errorMessage)
          }
          
          // Check if response is a file download (has Content-Disposition header)
          const contentDisposition = response.headers.get('content-disposition')
          if (!contentDisposition || !contentDisposition.includes('attachment')) {
            // This is likely an error response, not a file
            const errorData = await response.json()
            console.error('Export returned error:', errorData)
            throw new Error(errorData.error || errorData.message || 'Failed to export audit')
          }
          
          console.log(`[Export] Downloading file...`)
          const blob = await response.blob()
          console.log(`[Export] Blob size: ${blob.size} bytes`)
          
          // Extract filename from Content-Disposition header or use fallback
          let filename = `audit-${auditId}.${format}`
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/)
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1]
            }
          }
          
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          toast({
            title: "✓ Export complete",
            description: `Audit exported as ${format.toUpperCase()}`,
          })
        } catch (error: any) {
          console.error('Error exporting audit:', error)
          toast({
            title: "Export failed",
            description: error.message || "Please try again.",
            variant: "destructive",
          })
        }
        return
      }
    }
    
    // Default export behavior for other pages
    toast({
      title: "Export started",
      description: `Exporting as ${format.toUpperCase()}...`,
    })
    console.log(`Exporting as ${format} from ${location}`)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <>
      <nav className="h-16 border-b bg-white flex items-center justify-between sticky top-0 z-50 relative px-3 md:px-0 overflow-x-hidden min-w-0">
        {/* Logo positioned over the leftmost AppSidebar column - Desktop only */}
        <div className="hidden lg:!absolute top-0 lg:!flex items-center h-16 pl-4" style={{ left: '-256px', width: '256px', zIndex: 100 }}>
          <Link href="/">
            <div className="cursor-pointer" data-testid="link-logo">
              <img src="/stackwise-demo/stackwise-logo-full.png" alt="Stackwise" className="h-10" />
            </div>
          </Link>
        </div>

        {/* Mobile logo - visible on small screens */}
        <div className="lg:!hidden flex items-center">
          <Link href="/">
            <img src="/stackwise-demo/stackwise-emblem-white.png" alt="Stackwise" className="h-8" />
          </Link>
        </div>

        {/* Right-side navigation - Action buttons */}
        <div className="flex items-center gap-1.5 md:gap-3 ml-auto">
          {/* Timestamp - Hidden on mobile */}
          {lastSaved && (
            <span className="hidden md:!inline text-xs text-gray-500 mr-1">Last saved {lastSaved.toLocaleTimeString()}</span>
          )}
          
          {/* Action buttons group */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Save button - Icon only on mobile */}
            <Button variant="outline" size="sm" onClick={handleSave} data-testid="button-save" className="px-2 md:px-3">
              <Save className="w-4 h-4 md:mr-1.5" />
              <span className="hidden md:!inline">Save</span>
            </Button>
            
            {/* Export dropdown - Icon only on mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-export" className="px-2 md:px-3">
                  <Download className="w-4 h-4 md:mr-1.5" />
                  <span className="hidden md:!inline">Export</span>
                  <ChevronDown className="w-3 h-3 ml-1 hidden md:!inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')} data-testid="export-pdf">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')} data-testid="export-json">
                  <FileJson className="mr-2 h-4 w-4" />
                  <span>Export as JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('md')} data-testid="export-md">
                  <FileCode className="mr-2 h-4 w-4" />
                  <span>Export as Markdown</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* My Plays - Hidden on mobile, visible on tablet+ */}
            <Link href="/strategy-studio/my-plays" className="hidden sm:!inline-block">
              <Button variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-50 px-2 md:px-3" data-testid="button-my-plays-quick">
                <Lightbulb className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:!inline">My Plays</span>
              </Button>
            </Link>
          </div>

          {/* Separator - Hidden on mobile */}
          <div className="hidden md:!block h-6 w-px bg-gray-300" />

          {/* Stacks button - Hidden on mobile */}
          <Button variant="outline" size="sm" className="hidden md:!flex border-blue-300 text-blue-700 hover:bg-blue-50" data-testid="button-stacks">
            <Layers className="w-4 h-4 mr-1.5" /> Stacks
          </Button>

          {/* Stackwise Sage */}
          <StackwiseSageDrawer module={getCurrentModule()} />

          {/* User Profile Dropdown */}
          <UserProfileMenu />
        </div>
      </nav>
    </>
  )
}

function UserProfileMenu() {
  const { user, loading, logout } = useUser();

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  // Get initials for avatar fallback
  const getInitials = (name: string | undefined | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 h-auto py-2 px-3 rounded-lg hover:bg-gray-100" 
          data-testid="user-menu-trigger"
        >
          {/* Avatar */}
          {user.photo ? (
            <img 
              src={user.photo} 
              alt={user.name} 
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {getInitials(user.name)}
            </div>
          )}
          
          {/* User Info - Hidden on mobile */}
          <div className="hidden md:flex flex-col items-start">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {user.auth_provider === 'email' ? 'Admin' : 'Admin'}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email || ''}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/integrations'}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Integrations</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
