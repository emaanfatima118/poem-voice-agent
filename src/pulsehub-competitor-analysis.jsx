"use client"

import { useState } from 'react';
import { NavBar } from './components/NavBar';
import Sidebar from './components/pulsehub-sidebar';
import { ThreeColumnLayout } from './components/ui-replit/three-column-layout';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui-replit/card';
import { Button } from './components/ui-replit/button';
import { Input } from './components/ui-replit/input';
import { Badge } from './components/ui-replit/badge';
import { QuickActions } from './components/ui-replit/quick-actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui-replit/collapsible';
import { 
  TrendingUp, TrendingDown, Minus, Plus, Target, BarChart3, 
  Users, Building2, ArrowRight, AlertCircle, Lightbulb,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { useToast } from './hooks/use-toast';

const CompetitorAnalysis = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Competitor Analysis');
  const [currentStep, setCurrentStep] = useState('overview');
  const [competitors, setCompetitors] = useState([
    { id: '1', name: '', website: '', linkedin: '', facebook: '', tiktok: '', instagram: '', twitter: '' },
    { id: '2', name: '', website: '', linkedin: '', facebook: '', tiktok: '', instagram: '', twitter: '' },
    { id: '3', name: '', website: '', linkedin: '', facebook: '', tiktok: '', instagram: '', twitter: '' }
  ]);
  // eslint-disable-next-line no-unused-vars
  const [clientData, setClientData] = useState({
    name: '',
    website: '',
    linkedin: '',
    facebook: '',
    tiktok: '',
    instagram: '',
    twitter: ''
  });
  const [competitorSectionOpen, setCompetitorSectionOpen] = useState(true);
  const { toast } = useToast();

  const moduleColor = '#6218df';

  const steps = [
    { id: 'overview', label: 'Overview', description: 'Client & competitor data collection' },
    { id: 'benchmarks', label: 'Benchmarks', description: 'Metric comparison & trends' },
    { id: 'swot', label: 'SWOT', description: 'AI-assisted analysis' },
    { id: 'insights', label: 'Insights', description: 'Simulations & recommendations' },
    { id: 'strategies', label: 'Strategies', description: 'Action plans' }
  ];

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const handleAddCompetitor = () => {
    const newId = (competitors.length + 1).toString();
    setCompetitors([
      ...competitors,
      { id: newId, name: '', website: '', linkedin: '', facebook: '', tiktok: '', instagram: '', twitter: '' }
    ]);
  };

  const handleSaveAndAnalyze = () => {
    toast({
      title: "Analysis Started",
      description: "✅ Client and competitor data saved. AI analysis started."
    });
  };

  const leftNav = (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-bold" style={{ color: moduleColor }}>
        Pulse Hub
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground mt-1">Competitor Analysis</p>
    </div>
  );

  const mobileStepsNav = (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              currentStep === step.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={currentStep === step.id ? { backgroundColor: moduleColor } : {}}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Client Info */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm flex items-center gap-2">
            <Building2 className="w-3 h-3 md:w-4 md:h-4" />
            Client Info
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 space-y-3 md:space-y-4">
          {[
            {
              title: 'Video-First Content Surge',
              priority: 'High',
              timeline: '30 days',
              description: 'Launch weekly video series targeting key pain points identified in competitor gap analysis',
              kpis: ['Engagement +12%', 'Watch Time +25%', 'Shares +18%']
            },
            {
              title: 'Multi-Channel Retargeting Campaign',
              priority: 'High',
              timeline: '60 days',
              description: 'Deploy cross-platform retargeting to capture high-intent audiences currently engaging with competitors',
              kpis: ['Conversion Rate +8%', 'CPA -15%', 'ROAS +22%']
            },
            {
              title: 'Influencer Partnership Program',
              priority: 'Medium',
              timeline: '90 days',
              description: 'Build partnerships with micro-influencers in underserved niches where competitors are weak',
              kpis: ['Reach +30%', 'Trust Score +12%', 'New Audience +20K']
            }
          ].map((strategy, idx) => (
            <Card key={idx} className="shadow-sm">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                  <h4 className="font-semibold text-sm md:text-base text-gray-900">{strategy.title}</h4>
                  <div className="flex gap-2">
                    <Badge variant={strategy.priority === 'High' ? 'default' : 'secondary'} className="text-[10px] md:text-xs">
                      {strategy.priority} Priority
                    </Badge>
                    <Badge variant="outline" className="text-[10px] md:text-xs">{strategy.timeline}</Badge>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-3">{strategy.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {strategy.kpis.map((kpi, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] md:text-xs bg-green-50 text-green-700">
                      {kpi}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" data-testid={`button-strategy-${idx}-eval`} className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add to Eval
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
 const renderStrategies = () => (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2" style={{ color: moduleColor }}>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            Recommended Action Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 space-y-2">
          <Input placeholder="Client Name" data-testid="input-client-name" className="text-xs md:text-sm" />
          <Input placeholder="Website URL" data-testid="input-client-website" className="text-xs md:text-sm" />
          <Input placeholder="LinkedIn URL" data-testid="input-client-linkedin" className="text-xs md:text-sm" />
          <Input placeholder="Facebook URL" data-testid="input-client-facebook" className="text-xs md:text-sm" />
          <Input placeholder="TikTok URL" data-testid="input-client-tiktok" className="text-xs md:text-sm" />
          <Input placeholder="Instagram URL" data-testid="input-client-instagram" className="text-xs md:text-sm" />
          <Input placeholder="X (Twitter) URL" data-testid="input-client-twitter" className="text-xs md:text-sm" />
        </CardContent>
      </Card>

      {/* Competitor Section - Collapsible */}
      <Collapsible open={competitorSectionOpen} onOpenChange={setCompetitorSectionOpen}>
        <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover-elevate rounded p-2">
            <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              Competitors
            </h3>
            {competitorSectionOpen ? <ChevronDown className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {/* Competitor Columns */}
              {competitors.map((comp, idx) => (
                <Card key={comp.id} className="shadow-sm">
                  <CardHeader className="bg-gray-50 p-3 md:p-4">
                    <CardTitle className="text-xs md:text-sm flex items-center gap-2">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      Competitor {idx + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 space-y-2">
                    <Input placeholder="Company Name" data-testid={`input-comp${idx + 1}-name`} className="text-xs md:text-sm" />
                    <Input placeholder="Website URL" data-testid={`input-comp${idx + 1}-website`} className="text-xs md:text-sm" />
                    <Input placeholder="LinkedIn URL" data-testid={`input-comp${idx + 1}-linkedin`} className="text-xs md:text-sm" />
                    <Input placeholder="Facebook URL" data-testid={`input-comp${idx + 1}-facebook`} className="text-xs md:text-sm" />
                    <Input placeholder="TikTok URL" data-testid={`input-comp${idx + 1}-tiktok`} className="text-xs md:text-sm" />
                    <Input placeholder="Instagram URL" data-testid={`input-comp${idx + 1}-instagram`} className="text-xs md:text-sm" />
                    <Input placeholder="X (Twitter) URL" data-testid={`input-comp${idx + 1}-twitter`} className="text-xs md:text-sm" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 mt-4">
              <Button variant="outline" onClick={handleAddCompetitor} data-testid="button-add-competitor" className="text-xs md:text-sm w-full sm:w-auto">
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Add Competitor
              </Button>
              <Button onClick={handleSaveAndAnalyze} data-testid="button-save-analyze" style={{ backgroundColor: moduleColor }} className="text-xs md:text-sm w-full sm:w-auto">
                <BarChart3 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Save & Run AI Analysis
              </Button>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs md:text-sm font-semibold text-gray-600">Visibility Index</h3>
              <Badge variant="secondary" className="text-[10px] md:text-xs">AI Data</Badge>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <p className="text-xl md:text-2xl font-bold text-green-600">↑ 12%</p>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-2">Comparing Client vs. Avg Competitor visibility</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs md:text-sm font-semibold text-gray-600">Market Share</h3>
              <Badge variant="secondary" className="text-[10px] md:text-xs">AI Data</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              <p className="text-xl md:text-2xl font-bold text-gray-600">— Stable</p>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-2">Share of online and paid presence</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 md:p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs md:text-sm font-semibold text-gray-600">Engagement Delta</h3>
              <Badge variant="secondary" className="text-[10px] md:text-xs">AI Data</Badge>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              <p className="text-xl md:text-2xl font-bold text-red-600">↓ 5%</p>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-2">Engagement variance from benchmark</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Narrative */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2" style={{ color: moduleColor }}>
            <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />
            Competitor Narrative
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-gray-700">
            <strong>AI Summary:</strong> Client currently leads in organic reach and trust perception. Competitor 2 outperforms in engagement growth due to video campaigns, while Competitor 3 holds the highest paid search visibility. Opportunities exist to improve retargeting and multi-platform consistency.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderBenchmarks = () => (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2" style={{ color: moduleColor }}>
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
            Benchmark Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 md:p-3 text-left font-semibold">Metric</th>
                  <th className="p-2 md:p-3 text-left font-semibold">Client</th>
                  {competitors.slice(0, 3).map((_, idx) => (
                    <th key={idx} className="p-2 md:p-3 text-left font-semibold">Comp {idx + 1}</th>
                  ))}
                  <th className="p-2 md:p-3 text-left font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { metric: 'Traffic Growth', client: '8.2%', c1: '7.5%', c2: '9.1%', c3: '6.8%', trend: '↑ 10%', isUp: true },
                  { metric: 'Conversion Rate', client: '3.4%', c1: '3.1%', c2: '3.8%', c3: '3.2%', trend: '↓ 2%', isUp: false },
                  { metric: 'Social Engagement', client: '12.5K', c1: '10.2K', c2: '15.3K', c3: '11.1K', trend: '↑ 8%', isUp: true },
                  { metric: 'Ad Efficiency (CPC)', client: '$2.40', c1: '$2.80', c2: '$2.20', c3: '$2.65', trend: '↓ 4%', isUp: false }
                ].map((row) => (
                  <tr key={row.metric} className="hover:bg-gray-50">
                    <td className="p-2 md:p-3 font-medium">{row.metric}</td>
                    <td className="p-2 md:p-3 font-semibold text-purple-600">{row.client}</td>
                    <td className="p-2 md:p-3">{row.c1}</td>
                    <td className="p-2 md:p-3">{row.c2}</td>
                    <td className="p-2 md:p-3">{row.c3}</td>
                    <td className={`p-2 md:p-3 font-semibold ${row.isUp ? 'text-green-600' : 'text-red-600'}`}>
                      {row.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {[
              { metric: 'Traffic Growth', client: '8.2%', c1: '7.5%', c2: '9.1%', c3: '6.8%', trend: '↑ 10%', isUp: true },
              { metric: 'Conversion Rate', client: '3.4%', c1: '3.1%', c2: '3.8%', c3: '3.2%', trend: '↓ 2%', isUp: false },
              { metric: 'Social Engagement', client: '12.5K', c1: '10.2K', c2: '15.3K', c3: '11.1K', trend: '↑ 8%', isUp: true },
              { metric: 'Ad Efficiency (CPC)', client: '$2.40', c1: '$2.80', c2: '$2.20', c3: '$2.65', trend: '↓ 4%', isUp: false }
            ].map((row) => (
              <div key={row.metric} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">{row.metric}</h4>
                  <span className={`text-xs font-semibold ${row.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {row.trend}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Client</p>
                    <p className="font-semibold text-purple-600">{row.client}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">C1</p>
                    <p className="font-medium">{row.c1}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">C2</p>
                    <p className="font-medium">{row.c2}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">C3</p>
                    <p className="font-medium">{row.c3}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg" style={{ color: moduleColor }}>Client vs. Competitor Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 space-y-4">
          <p className="text-xs md:text-sm text-gray-600">AI-generated comparative narrative showing how the client stacks up against each competitor across key areas.</p>
          {competitors.slice(0, 3).map((_, idx) => (
            <div key={idx} className="border-t border-gray-200 pt-4">
              <h4 className="text-xs md:text-sm font-semibold mb-2" style={{ color: moduleColor }}>
                Competitor {idx + 1}
              </h4>
              <p className="text-xs md:text-sm text-gray-700">
                Compared to Competitor {idx + 1}, the client shows stronger brand trust, higher engagement per post, and slightly lower ad frequency. This competitor has been investing in video-first ads, resulting in short-term reach gains, but client retains a steadier conversion rate.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderSWOT = () => (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2" style={{ color: moduleColor }}>
            <Target className="w-4 h-4 md:w-5 md:h-5" />
            AI-Assisted SWOT Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                  Strengths
                </h4>
                <ul className="text-xs md:text-sm text-gray-700 list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                  <li>High brand trust and retention rate</li>
                  <li>Strong social media engagement among loyal audience</li>
                  <li>Consistent organic visibility growth</li>
                  <li>Superior customer service reputation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
                  Weaknesses
                </h4>
                <ul className="text-xs md:text-sm text-gray-700 list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                  <li>Limited paid reach compared to competitors</li>
                  <li>Slow response to emerging content trends</li>
                  <li>Low CTR on email campaigns</li>
                  <li>Underdeveloped video content strategy</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                  Opportunities
                </h4>
                <ul className="text-xs md:text-sm text-gray-700 list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                  <li>Expand video-first content strategy</li>
                  <li>Leverage influencer marketing partnerships</li>
                  <li>Enhance SEO around new product launches</li>
                  <li>Capitalize on competitor ad fatigue</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Threats
                </h4>
                <ul className="text-xs md:text-sm text-gray-700 list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                  <li>Competitor 3 increasing ad spend aggressively</li>
                  <li>Platform algorithm shifts reducing organic reach</li>
                  <li>Audience fragmentation across new social channels</li>
                  <li>Rising customer acquisition costs industry-wide</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2" style={{ color: moduleColor }}>
            <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />
            Insights, Simulations & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 space-y-3 md:space-y-4 text-xs md:text-sm text-gray-700">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded">
            <p className="flex items-start gap-2">
              <span className="text-base md:text-lg">📊</span>
              <span>Competitor 1 shows steady traffic but declining engagement — they may be over-reliant on paid campaigns. Client can capitalize by enhancing content depth and community interaction.</span>
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 rounded">
            <p className="flex items-start gap-2">
              <span className="text-base md:text-lg">📈</span>
              <span><strong>Simulation:</strong> Increasing video content frequency by 20% could lift total engagement <span className="text-green-600 font-semibold">+12%</span> and clickthroughs <span className="text-green-600 font-semibold">+8%</span>.</span>
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-3 md:p-4 rounded">
            <p className="flex items-start gap-2">
              <span className="text-base md:text-lg">💬</span>
              <span><strong>AI Recommendation:</strong> Implement an awareness surge campaign with multi-channel retargeting for 60 days.</span>
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 md:p-4 rounded">
            <p className="flex items-start gap-2">
              <span className="text-base md:text-lg">📉</span>
              <span>Competitor 3's ad fatigue is showing; average CTR dropped 6% MoM — an opening for client advantage.</span>
            </p>
          </div>

          <Card className="border-2 border-purple-300" style={{ backgroundColor: '#f3f0ff' }}>
            <CardContent className="p-3 md:p-4">
              <h4 className="text-sm md:text-base font-semibold mb-2" style={{ color: moduleColor }}>AI Prediction (90-Day Forecast)</h4>
              <p className="text-xs md:text-sm">If recommended actions are executed, projected uplift:</p>
              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3">
                <div className="bg-white rounded p-2 md:p-3 text-center">
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1">Engagement</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">+15%</p>
                </div>
                <div className="bg-white rounded p-2 md:p-3 text-center">
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1">Visibility</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">+11%</p>
                </div>
                <div className="bg-white rounded p-2 md:p-3 text-center">
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1">CTR</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">+9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
  const renderContent = () => (
    <div className="h-full overflow-y-auto bg-white">
      <div className="bg-white px-4 md:px-8 py-4 border-b border-purple-100 sticky top-0 z-10">
        <h1 className="text-xl md:text-3xl font-bold mb-2" style={{ color: moduleColor }}>
          Competitor Analysis & Benchmarking
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          AI-powered competitive intelligence to identify gaps, opportunities, and winning strategies.
        </p>
      </div>

      <div className="p-4 md:p-8">
        {currentStep === 'overview' && renderOverview()}
        {currentStep === 'benchmarks' && renderBenchmarks()}
        {currentStep === 'swot' && renderSWOT()}
        {currentStep === 'insights' && renderInsights()}
        {currentStep === 'strategies' && renderStrategies()}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16">
        <Sidebar selectedMenuItem={selectedMenuItem} onMenuItemClick={handleMenuItemClick} />

        <div className="flex-1 min-w-0">
          <NavBar />

          {mobileStepsNav}

          <ThreeColumnLayout
            leftNav={leftNav}
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            content={
              <div className="h-full overflow-y-auto bg-white">
                <div className="px-4 md:px-8 py-4 border-b sticky top-0 z-10 bg-white">
                  <QuickActions module="PulseHub" />
                </div>
                {renderContent()}
              </div>
            }
            moduleColor={moduleColor}
            completedSteps={[]}
            featureName="Competitor Analysis & Benchmarking"
          />
        </div>
      </div>
    </div>
  );
}

export default CompetitorAnalysis;



 