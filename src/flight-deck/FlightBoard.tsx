"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuickActions } from '@/components/QuickActions'
import { 
  Calendar, 
  Rocket, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  TrendingDown,
  Zap
} from 'lucide-react'

const FLIGHT_DECK_COLOR = '#1e40f2'

export default function FlightBoard() {
  const [intelligenceOpen, setIntelligenceOpen] = useState(false)

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white min-w-0">
      <div className="p-4 md:p-8 space-y-6 overflow-x-hidden max-w-full">
        {/* Top Section: Quick Actions and Intelligence Button */}
        <div className="flex items-start justify-between">
          <QuickActions module="FlightDeck" inline />
          
          <Button
            onClick={() => setIntelligenceOpen(!intelligenceOpen)}
            className="text-white font-semibold px-6 py-2 rounded-lg shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #c009ba 0%, #e879f9 100%)'
            }}
            data-testid="button-intelligence"
          >
            <Zap className="w-4 h-4 mr-2" />
            Intelligence
          </Button>
        </div>

        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Board</h1>
          <p className="text-sm text-gray-600">Real-time campaign monitoring and intelligence</p>
        </div>

        {/* TODAY Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">TODAY</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Scheduled Today</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Launching This Week</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Delayed</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Audience Spikes</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-xs text-gray-500">Fully Stacked</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">At-Risk</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Over Budget</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Underperforming Campaigns */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Underperforming Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

