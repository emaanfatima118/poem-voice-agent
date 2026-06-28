import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/stackwise-demo/components/ui/button'

interface TwoColumnLayoutProps {
  leftNav: ReactNode
  content: ReactNode
  moduleColor?: string
}

export function TwoColumnLayout({ leftNav, content, moduleColor }: TwoColumnLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useState(false)
  
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left navigation column - DESKTOP: Side, MOBILE: Top collapsible */}
      
      {/* Mobile: Collapsible navigation at top */}
      <div className="lg:hidden border-b bg-white">
        <Button
          variant="ghost"
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="w-full justify-between p-4 text-gray-900 hover:bg-gray-50"
        >
          <span className="font-semibold">Navigation</span>
          {isNavOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
        
        {isNavOpen && (
          <div 
            className="max-h-[50vh] overflow-y-auto border-t"
            style={{
              background: moduleColor ? `linear-gradient(180deg, ${moduleColor}15 0%, ${moduleColor}05 100%)` : undefined
            }}
          >
            {leftNav}
          </div>
        )}
      </div>
      
      {/* Desktop: Fixed side navigation */}
      <div 
        className="hidden lg:block w-64 border-r overflow-y-auto"
        style={{
          background: moduleColor ? `linear-gradient(180deg, ${moduleColor}15 0%, ${moduleColor}05 100%)` : undefined
        }}
      >
        {leftNav}
      </div>
      
      {/* Right content column */}
      <div className="flex-1 overflow-y-auto">
        {content}
      </div>
    </div>
  )
}
