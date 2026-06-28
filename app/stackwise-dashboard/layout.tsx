import '@/stackwise-demo/index.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stackwise Dashboard',
  description: 'Complete Stackwise marketing operations platform with Strategy Studio, Pulse Hub, Brand Craft, and Flight Deck modules',
}

export default function StackwiseDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

