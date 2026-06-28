import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Progress } from '@/stackwise-demo/components/ui/progress'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/stackwise-demo/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/stackwise-demo/components/ui/dialog'
import { Link } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, AlertCircle, Search, ArrowUp, ArrowDown, Minus, Zap, CheckCircle2, AlertTriangle, StickyNote, Target, Trophy, XCircle, Circle } from 'lucide-react'
import type { StrategySnapshot, Play, Milestone } from '@shared/schema'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'

export default function StrategyStudioDashboard() {
  const { data: latestStrategy, isLoading: strategyLoading } = useQuery<StrategySnapshot>({
    queryKey: ['/api/strategy-snapshots/latest'],
  });

  const { data: plays = [], isLoading: playsLoading } = useQuery<Play[]>({
    queryKey: ['/api/plays'],
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ['/api/milestones'],
  });

  const isLoading = strategyLoading || playsLoading || milestonesLoading;

  // State for modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [reviewItems, setReviewItems] = useState([
    { id: 1, title: 'Complete Q4 Brand Voice Audit', source: 'BrandCraft', status: 'open', priority: 'high', completed: false },
    { id: 2, title: 'LinkedIn POV Series — Draft 3 posts', source: 'Strategy Studio', status: 'open', priority: 'medium', completed: false },
    { id: 3, title: 'Retention Play Milestone — Day 60', source: '30/60/90', status: 'critical', priority: 'high', completed: false },
    { id: 4, title: 'Tag top 3 wins for review', source: 'Eval Matrix', status: 'complete', priority: 'low', completed: true },
    { id: 5, title: 'Update Paid Social budget allocation', source: 'Flight Deck', status: 'open', priority: 'medium', completed: false },
  ]);

  // Calculate current quarter progress
  const calculateQuarterProgress = () => {
    if (!latestStrategy?.quarterStartDate || !latestStrategy?.quarterEndDate) {
      return { daysElapsed: 42, totalDays: 90, percentage: 47 };
    }

    const start = new Date(latestStrategy.quarterStartDate);
    const end = new Date(latestStrategy.quarterEndDate);
    const now = new Date();

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const percentage = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

    return { daysElapsed, totalDays, percentage };
  };

  // Calculate days until next review
  const daysUntilReview = () => {
    if (!latestStrategy?.quarterEndDate) return 57;
    
    const end = new Date(latestStrategy.quarterEndDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  // Calculate review readiness
  const calculateReadiness = () => {
    const total = reviewItems.length;
    const completed = reviewItems.filter(item => item.completed).length;
    return Math.round((completed / total) * 100);
  };

  const toggleItemCompletion = (id: number) => {
    setReviewItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed, status: !item.completed ? 'complete' : 'open' } : item
      )
    );
  };

  const handleSaveNote = () => {
    // Mock note save
    console.log('Saving note:', noteText);
    setNoteText('');
    setIsNoteModalOpen(false);
  };

  const progress = calculateQuarterProgress();
  const focusAreas = (latestStrategy?.foundations as any)?.focusAreas || ['Retention', 'Brand Consistency', 'Exec POV Launch'];
  
  // Filter plays by status
  const activePlays = plays.filter(p => p.status === 'active');
  const pausedPlays = plays.filter(p => p.status === 'paused');
  const completePlays = plays.filter(p => p.status === 'complete');

  // Sample insights data
  const insights = [
    { type: 'highlight', icon: TrendingUp, color: 'text-green-600', message: 'Top Performing Motion: Paid Social +13%', trend: 'up' },
    { type: 'risk', icon: TrendingDown, color: 'text-red-600', message: 'Content Volume down 8% since last month', trend: 'down' },
    { type: 'trend', icon: TrendingUp, color: 'text-blue-600', message: 'Exec POV engagement climbing on LinkedIn', trend: 'up' },
  ];

  // Items for Review (auto-feed into next review)
  const itemsForReview = [
    { title: 'Revisit Awareness content strategy', source: 'Engagement down 7%', icon: AlertCircle, color: 'text-red-600' },
    { title: 'Add a Retention play for returning customers', source: 'Site visits up from existing users', icon: Zap, color: 'text-purple-600' },
    { title: 'Review brand voice consistency', source: 'Last 3 posts scored below 85', icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Optimize LinkedIn posting schedule', source: 'Engagement peaks Wed-Thu', icon: TrendingUp, color: 'text-green-600' },
  ];

  // QoQ Comparison data
  const qoqComparison = [
    { metric: 'Active Plays', lastQ: 8, currentQ: 12, change: '+50%', trend: 'up' },
    { metric: 'Goal Alignment', lastQ: 68, currentQ: 76, change: '+8pts', trend: 'up' },
    { metric: 'Channel Performance', lastQ: 74, currentQ: 72, change: '-2pts', trend: 'down' },
    { metric: 'Content Volume', lastQ: 45, currentQ: 52, change: '+15%', trend: 'up' },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'complete':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'complete') return 'Complete';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'open':
        return <Circle className="h-4 w-4 text-orange-600" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden bg-background">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="h-32 bg-muted animate-pulse rounded-md" />
          <div className="h-64 bg-muted animate-pulse rounded-md" />
          <div className="h-64 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6">
          {/* Left: Greeting */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="heading-strategy-studio">
              Hey there, Brian Ford!
            </h1>
            <p className="text-sm text-muted-foreground">
              Your next move starts here.
            </p>
          </div>

          {/* Center: Search */}
          <div className="w-full lg:flex-1 lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or ID"
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Right: Customize Button + User Profile */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full lg:w-auto justify-between lg:justify-start">
            <div className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] p-[2px] rounded-md">
              <Button
                className="bg-white hover:bg-gray-50 rounded-md"
                style={{ color: '#6218df' }}
                data-testid="button-customize"
              >
                Customize
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Cristopher Calzoni" />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                  CC
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold" data-testid="text-user-name">
                  Cristopher Calzoni
                </span>
                <span className="text-xs text-muted-foreground" data-testid="text-user-role">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions module="StrategyStudio" />

        {/* Top Row: Current Cycle Snapshot (Full Width) */}
        <Card data-testid="card-cycle-snapshot">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">Current Cycle Snapshot</CardTitle>
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] text-white border-0"
                  data-testid="badge-momentum"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Cycle Trending Up
                </Badge>
              </div>
              <div className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] p-[2px] rounded-md">
                <Button
                  className="bg-white hover:bg-gray-50 rounded-md"
                  style={{ color: '#6218df' }}
                  data-testid="button-new-play"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Play
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cycle Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" data-testid="text-cycle-label">
                  Q4 Strategy Cycle — Day {progress.daysElapsed} of {progress.totalDays}
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress.percentage}%
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" data-testid="progress-quarter" />
              
              {/* Cycle Health Indicator */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-medium text-muted-foreground">Cycle Health:</span>
                <span className="text-xs font-semibold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">
                  76% — strong alignment, retention lagging
                </span>
              </div>
            </div>

            {/* Contextual Data Points Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Next Milestone */}
              <div className="p-3 rounded-md border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-semibold text-muted-foreground">Next Milestone</span>
                </div>
                <p className="text-sm font-medium">Day 60 Review Checkpoint</p>
                <p className="text-xs text-muted-foreground">18 days away</p>
              </div>

              {/* Recent Wins */}
              <div className="p-3 rounded-md border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-muted-foreground">Recent Wins</span>
                </div>
                <p className="text-sm font-medium text-green-600">
                  Top Goal: Retention +8% vs last cycle
                </p>
              </div>

              {/* Open Risks */}
              <div className="p-3 rounded-md border bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-semibold text-muted-foreground">Open Risks</span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    ⚠️ 2
                  </Badge>
                </div>
                <p className="text-sm font-medium text-orange-600">
                  Exec POV lagging
                </p>
                <p className="text-xs text-muted-foreground">Engagement 15% below target</p>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area: string, idx: number) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    data-testid={`badge-focus-${idx}`}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Row: Reflection & Review + What's Happening Now */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Reflection & Review - 2/3 width */}
          <Card data-testid="card-reflection-review" className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Reflection & Review</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track how your strategic priorities align across Goals, Plays, and Channels
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last reviewed 5 days ago
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Narrative Summary */}
              <div className="p-4 rounded-md bg-muted/50">
                <p className="text-sm leading-relaxed">
                  <strong>Overall, you're making solid progress.</strong> Your Awareness and Exec POV goals are well-aligned with active plays and performing channels like LinkedIn and Paid Social. However, Retention is showing signs of drift — the HITL Email Series and LinkedIn POV plays aren't gaining the traction you need, and Email as a channel is underperforming. Consider refocusing effort on nurture content or pausing lower-impact plays to double down on what's working.
                </p>
              </div>

              {/* 3-Column Alignment Grid */}
              <div className="grid grid-cols-3 divide-x">
                {/* Goals Column */}
                <div className="pr-6 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Goals</h3>
                  <div className="space-y-3">
                    {/* Awareness - 90% aligned */}
                    <div className="space-y-1" data-testid="goal-awareness">
                      <div className="relative h-16 w-16 mx-auto">
                        <svg className="transform -rotate-90 h-16 w-16">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="175.93" strokeDashoffset="17.59" className="text-green-500" />
                        </svg>
                        <ArrowUp className="absolute top-0 right-0 h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs font-medium text-center">Awareness</p>
                      <p className="text-xs text-muted-foreground text-center">90%</p>
                    </div>
                    
                    {/* Retention - 55% aligned */}
                    <div className="space-y-1" data-testid="goal-retention">
                      <div className="relative h-16 w-16 mx-auto">
                        <svg className="transform -rotate-90 h-16 w-16">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="175.93" strokeDashoffset="79.17" className="text-orange-500" />
                        </svg>
                        <ArrowDown className="absolute top-0 right-0 h-4 w-4 text-red-600" />
                      </div>
                      <p className="text-xs font-medium text-center">Retention</p>
                      <p className="text-xs text-muted-foreground text-center">55%</p>
                    </div>
                    
                    {/* Exec POV - 85% aligned */}
                    <div className="space-y-1" data-testid="goal-exec-pov">
                      <div className="relative h-16 w-16 mx-auto">
                        <svg className="transform -rotate-90 h-16 w-16">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="175.93" strokeDashoffset="26.39" className="text-green-500" />
                        </svg>
                        <Minus className="absolute top-0 right-0 h-4 w-4 text-gray-500" />
                      </div>
                      <p className="text-xs font-medium text-center">Exec POV Launch</p>
                      <p className="text-xs text-muted-foreground text-center">85%</p>
                    </div>
                  </div>
                </div>

                {/* Plays Column */}
                <div className="px-6 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Plays</h3>
                  <div className="space-y-3">
                    {/* HITL Email - 50% */}
                    <div className="space-y-1" data-testid="play-alignment-0">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="62.83" className="text-orange-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center truncate">HITL Email</p>
                    </div>
                    
                    {/* LinkedIn POV - 88% */}
                    <div className="space-y-1" data-testid="play-alignment-1">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="15.08" className="text-green-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center truncate">LinkedIn POV</p>
                    </div>
                    
                    {/* Retention Experiment - 45% */}
                    <div className="space-y-1" data-testid="play-alignment-2">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="69.11" className="text-orange-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center truncate">Retention Exp</p>
                    </div>
                    
                    {/* Video Ad Scaling - 92% */}
                    <div className="space-y-1" data-testid="play-alignment-3">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="10.05" className="text-green-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center truncate">Video Ad Scale</p>
                    </div>
                    
                    {/* ABM Expansion - 78% */}
                    <div className="space-y-1" data-testid="play-alignment-4">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="27.64" className="text-green-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center truncate">ABM Expansion</p>
                    </div>
                  </div>
                </div>

                {/* Channels Column */}
                <div className="pl-6 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Channels</h3>
                  <div className="space-y-3">
                    {/* LinkedIn - 88% */}
                    <div className="space-y-1" data-testid="channel-linkedin">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="15.08" className="text-green-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center">LinkedIn</p>
                    </div>
                    
                    {/* Email - 35% */}
                    <div className="space-y-1" data-testid="channel-email">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="81.68" className="text-red-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center">Email</p>
                    </div>
                    
                    {/* Paid Social - 92% */}
                    <div className="space-y-1" data-testid="channel-paid-social">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="10.05" className="text-green-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center">Paid Social</p>
                    </div>
                    
                    {/* Content/SEO - 72% */}
                    <div className="space-y-1" data-testid="channel-content">
                      <div className="relative h-12 w-12 mx-auto">
                        <svg className="transform -rotate-90 h-12 w-12">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125.66" strokeDashoffset="35.18" className="text-green-500" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center">Content/SEO</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alignment Legend */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Alignment</strong> measures how well your execution matches your strategic intent — whether your active plays and channel performance are driving progress toward your quarterly goals. Green indicates strong alignment (70%+), orange shows areas needing attention (40-69%), and red signals significant drift requiring course correction (&lt;40%).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" size="sm" data-testid="button-view-pulsehub">
                  View Details in PulseHub
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-add-notes">
                  <StickyNote className="h-4 w-4 mr-1" />
                  Add Notes for Q1 Review
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* What's Happening Now - 1/3 width */}
          <Card data-testid="card-insights-trends">
            <CardHeader>
              <CardTitle className="text-xl">What's Happening Now</CardTitle>
              <p className="text-xs text-purple-600 font-medium">
                3 new insights tagged for review
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Insights */}
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2 p-3 rounded-md border bg-card hover-elevate"
                    data-testid={`insight-${idx}`}
                  >
                    <insight.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${insight.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">{insight.message}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="h-6 w-6 rounded-full flex-shrink-0"
                      data-testid={`button-tag-insight-${idx}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Pipeline Comparison */}
              <div className="pt-3 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Pipeline Comparison</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last Q</span>
                    <span className="text-xs font-medium">$2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Current Q</span>
                    <span className="text-xs font-medium text-green-600">$3.1M</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t">
                    <span className="text-xs font-semibold">Growth</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      +29%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Yearly Goal Progress */}
              <div className="pt-3 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Yearly Goal Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Annual Target</span>
                    <span className="text-xs font-medium">$12M</span>
                  </div>
                  <Progress value={68} className="h-1.5" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">
                      68% Complete
                    </span>
                    <span className="text-xs text-muted-foreground">$8.2M</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                Click <Plus className="inline h-3 w-3" /> to add notes or save to Review Deck
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Review Prep Row */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Review Prep</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Next Review */}
            <Card data-testid="card-next-review">
              <CardHeader>
                <CardTitle className="text-lg">Next Review — {daysUntilReview()} days</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Readiness Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Readiness:</span>
                    <span className="text-muted-foreground">{calculateReadiness()}%</span>
                  </div>
                  <Progress value={calculateReadiness()} className="h-2" />
                </div>

                {/* Review Items Table */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground border-b pb-1">
                    Pending Items
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {reviewItems.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-md border bg-card text-xs hover-elevate"
                        data-testid={`review-item-${item.id}`}
                      >
                        <button 
                          onClick={() => toggleItemCompletion(item.id)}
                          className="flex-shrink-0"
                          data-testid={`button-toggle-${item.id}`}
                        >
                          {getStatusIcon(item.status)}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {item.title}
                          </p>
                          <p className="text-muted-foreground truncate">{item.source}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        data-testid="button-add-note"
                      >
                        <StickyNote className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="dialog-add-note">
                      <DialogHeader>
                        <DialogTitle>Add Review Note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Enter your note for the quarterly review..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          rows={4}
                          data-testid="textarea-note"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveNote}
                            className="flex-1"
                            data-testid="button-save-note"
                          >
                            Save Note
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setIsNoteModalOpen(false)}
                            data-testid="button-cancel-note"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    className="w-full bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] text-white hover:opacity-90" 
                    size="sm"
                    data-testid="button-review-prep"
                  >
                    Open Review Prep Workspace
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Items for Review */}
            <Card data-testid="card-items-for-review">
              <CardHeader>
                <CardTitle className="text-lg">Items for Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {itemsForReview.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-md border bg-card hover-elevate"
                    data-testid={`review-item-${idx}`}
                  >
                    <item.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${item.color}`} />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium leading-relaxed">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.source}</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-3 border-t">
                  These items automatically populate to your next quarterly review
                </p>
              </CardContent>
            </Card>

            {/* Card 3: QoQ Comparison */}
            <Card data-testid="card-qoq-comparison">
              <CardHeader>
                <CardTitle className="text-lg">QoQ Comparison</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Last cycle vs current cycle
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {qoqComparison.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-md border bg-card"
                    data-testid={`qoq-item-${idx}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">{item.metric}</span>
                      {item.trend === 'up' ? (
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Last Q: {item.lastQ}</span>
                      <span className="text-muted-foreground">Now: {item.currentQ}</span>
                    </div>
                    <div className="mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
