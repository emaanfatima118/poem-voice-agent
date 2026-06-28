import { ReactNode } from 'react'

interface TwoColumnLayoutProps {
  leftNav: ReactNode
  content: ReactNode
  moduleColor?: string
}

export function TwoColumnLayout({ leftNav, content, moduleColor }: TwoColumnLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left navigation column */}
      <div 
        className="w-64 border-r overflow-y-auto"
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

