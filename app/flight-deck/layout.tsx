"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import Sidebar from "@/components/pulsehub-sidebar"
import { NavBar } from "@/components/NavBar"

export default function FlightDeckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('Dashboard')

  useEffect(() => {
    // Determine selected menu item based on current route
    if (pathname) {
      if (pathname === '/flight-deck') setSelectedMenuItem('Dashboard')
      else if (pathname.includes('/distribution')) setSelectedMenuItem('Flight Board')
      else if (pathname.includes('/campaign-insights')) setSelectedMenuItem('Campaign Insights')
      else if (pathname.includes('/content-calendar')) setSelectedMenuItem('Content & Campaign Calendar')
      else if (pathname.includes('/budget')) setSelectedMenuItem('Spend Tracking')
      else if (pathname.includes('/personalization-engine')) setSelectedMenuItem('Audience Engine')
      else if (pathname.includes('/collaboration-tools')) setSelectedMenuItem('Collaboration + Workflows')
      else if (pathname.includes('/asset-management')) setSelectedMenuItem('Asset Management')
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
          <Sidebar 
            selectedMenuItem={selectedMenuItem} 
            onMenuItemClick={handleMenuItemClick}
          />
          <div className="flex-1 min-w-0">
            <NavBar />
            <main className="flex-1 overflow-auto overflow-x-hidden pt-12 lg:pt-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

