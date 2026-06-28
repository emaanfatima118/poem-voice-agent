import { useState, useEffect } from 'react'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Save, Download, Lightbulb, Layers } from 'lucide-react'
import { Link } from 'wouter'

interface TopActionsProps {
  module?: string
}

export function TopActions({ module = 'BrandCraft' }: TopActionsProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const interval = setInterval(() => handleSave(), 180000) // Auto-save every 3 minutes
    return () => clearInterval(interval)
  }, [])

  const handleSave = () => setLastSaved(new Date())

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleSave} className="px-4 py-2 text-sm border-gray-300" data-testid="button-save">
        <Save className="w-4 h-4 mr-2" /> Save
      </Button>
      <Button variant="outline" className="px-4 py-2 text-sm border-gray-300" data-testid="button-export">
        <Download className="w-4 h-4 mr-2" /> Export
      </Button>
      <Link href="/strategy-studio/my-plays">
        <Button variant="outline" className="px-4 py-2 text-sm border-pink-300 text-pink-700 hover:bg-pink-50" data-testid="button-my-plays-quick">
          <Lightbulb className="w-4 h-4 mr-2" /> My Plays
        </Button>
      </Link>
      <Button variant="outline" className="px-4 py-2 text-sm border-blue-300 text-blue-700 hover:bg-blue-50" data-testid="button-stacks">
        <Layers className="w-4 h-4 mr-2" /> Stacks
      </Button>
      <Button className="px-4 py-2 text-sm text-white font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90" data-testid="button-stackwise-sage-quick">
        <img src="/stackwise-emblem-white.png" alt="Stackwise" className="w-4 h-4 mr-2" /> Stackwise Sage
      </Button>
      {lastSaved && (
        <span className="text-xs text-gray-500 ml-2">Last saved {lastSaved.toLocaleTimeString()}</span>
      )}
    </div>
  )
}
