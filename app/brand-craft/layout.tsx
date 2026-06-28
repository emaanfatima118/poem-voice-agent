"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import Sidebar from "@/components/pulsehub-sidebar"
import { NavBar } from "@/components/NavBar"

export default function BrandCraftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('Dashboard')

  useEffect(() => {
    // Determine selected menu item based on current route
    if (pathname) {
      if (pathname === '/brand-craft') setSelectedMenuItem('Dashboard')
      else if (pathname.includes('/messaging-house')) setSelectedMenuItem('Messaging House')
      else if (pathname.includes('/content-strategy')) setSelectedMenuItem('Content Strategy')
      else if (pathname.includes('/keyword-research')) setSelectedMenuItem('Keyword Research')
      else if (pathname.includes('/content-creation')) setSelectedMenuItem('Content Creation')
      else if (pathname.includes('/campaign-builder')) setSelectedMenuItem('Campaign Builder')
      else if (pathname.includes('/brand-tone-check')) setSelectedMenuItem('Brand Tone Check')
      else if (pathname.includes('/thought-leadership')) setSelectedMenuItem('Thought Leadership & Executive Visibility')
      else setSelectedMenuItem('Dashboard')
    }
  }, [pathname])

  const handleMenuItemClick = (menuItem: string) => {
    setSelectedMenuItem(menuItem)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden pt-16">
        <div className="flex">
          <Sidebar selectedMenuItem={selectedMenuItem} onMenuItemClick={handleMenuItemClick} />
          <div className="flex-1 min-w-0">
            <NavBar />
            <main className="flex-1 overflow-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

