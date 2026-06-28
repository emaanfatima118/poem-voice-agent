"use client"

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight, Filter, Search, Bell, X, Circle, Diamond, Square, Triangle, DollarSign, Phone, Compass, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendarEntry {
  id: string;
  type: 'campaign' | 'exec_visibility' | '30_60_90' | 'review_budget' | 'review_quarterly' | 'review_call' | 'review_annual';
  reviewType?: 'budget' | 'quarterly' | 'strategy_call' | 'annual';
  title: string;
  owner: string;
  startDate?: string;
  endDate?: string;
  status: string;
  priority: string;
  description: string;
  milestone?: boolean;
  timeframe?: string;
  channel?: string;
  goal?: string;
  persona?: string;
  budget?: string;
  parentCampaignId?: string;
}

type TimeframeView = 'weekly' | 'monthly' | 'quarterly' | 'annual';
type ViewMode = 'grid' | 'timeline';

export default function ContentCalendar() {
  const [timeframeView, setTimeframeView] = useState<TimeframeView>('monthly');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);

  const { data: entries = [], isLoading } = useQuery<CalendarEntry[]>({
    queryKey: ['/api/calendar/entries'],
  });

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    if (selectedType !== 'all' && entry.type !== selectedType) return false;
    if (selectedStatus !== 'all' && entry.status !== selectedStatus) return false;
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate summary metrics
  const totalEntries = filteredEntries.length;
  const campaignCount = filteredEntries.filter(e => e.type === 'campaign').length;
  const execVisCount = filteredEntries.filter(e => e.type === 'exec_visibility').length;
  const milestoneCount = filteredEntries.filter(e => e.type === '30_60_90').length;
  const reviewCount = filteredEntries.filter(e => e.type.startsWith('review_')).length;
  const completedCount = filteredEntries.filter(e => e.status === 'completed' || e.status === 'published' || e.status === 'landed').length;
  const completionRate = totalEntries > 0 ? Math.round((completedCount / totalEntries) * 100) : 0;

  // Calculate upcoming and overdue items
  const upcomingDeadlines = useMemo(() => {
    return filteredEntries
      .filter(e => e.endDate && new Date(e.endDate) > new Date())
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
      .slice(0, 5);
  }, [filteredEntries]);

  const overdueItems = useMemo(() => {
    return filteredEntries.filter(
      e => e.endDate && new Date(e.endDate) < new Date() && !['completed', 'published', 'landed', 'canceled'].includes(e.status)
    );
  }, [filteredEntries]);

  // Check if any deadline is within 3 days
  const hasApproachingDeadline = useMemo(() => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return upcomingDeadlines.some(e => e.endDate && new Date(e.endDate) <= threeDaysFromNow);
  }, [upcomingDeadlines]);

  // Get color for entry type
  const getEntryColor = (type: CalendarEntry['type']) => {
    switch (type) {
      case '30_60_90':
        return 'hsl(200, 95%, 50%)'; // Bright cyan/blue
      case 'exec_visibility':
        return 'hsl(330, 81%, 60%)'; // Bright pink
      case 'campaign':
        return 'hsl(262, 85%, 48%)'; // Purple
      case 'review_budget':
        return 'hsl(142, 71%, 45%)'; // Green
      case 'review_quarterly':
        return 'hsl(0, 72%, 51%)'; // Red
      case 'review_call':
        return 'hsl(200, 95%, 50%)'; // Blue
      case 'review_annual':
        return 'hsl(39, 100%, 50%)'; // Gold/Orange
      default:
        return 'hsl(var(--muted))';
    }
  };

  const getTypeBadgeVariant = (type: CalendarEntry['type']) => {
    if (type.startsWith('review_')) return 'outline';
    switch (type) {
      case '30_60_90':
        return 'default';
      case 'exec_visibility':
        return 'destructive';
      case 'campaign':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Check if entry is late (past end date and not completed)
  const isEntryLate = (entry: CalendarEntry) => {
    if (!entry.endDate) return false;
    const now = new Date();
    const endDate = new Date(entry.endDate);
    return endDate < now && !['completed', 'published', 'landed', 'canceled'].includes(entry.status);
  };

  // Check if entry is very late (2+ weeks)
  const isEntryVeryLate = (entry: CalendarEntry) => {
    if (!entry.endDate) return false;
    const now = new Date();
    const endDate = new Date(entry.endDate);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    return endDate < twoWeeksAgo && !['completed', 'published', 'landed', 'canceled'].includes(entry.status);
  };

  // Check if entry is missing/incomplete
  const isEntryMissing = (entry: CalendarEntry) => {
    return entry.status === 'missing' || entry.status === 'incomplete';
  };

  const getStatusIcon = (entry: CalendarEntry) => {
    if (entry.status === 'completed' || entry.status === 'published' || entry.status === 'landed') return '✅';
    if (entry.status === 'canceled' || entry.status === 'archived') return '❌';
    if (isEntryMissing(entry)) return '⚠️';
    return '';
  };

  const getAviationStatus = (status: string) => {
    const aviationMap: Record<string, string> = {
      'draft': 'Not Launched',
      'not_launched': 'Not Launched',
      'pending': 'Not Launched',
      'taxiing': 'Taxiing',
      'in_progress': 'In Flight',
      'in_flight': 'In Flight',
      'completed': 'Landed',
      'published': 'Landed',
      'landed': 'Landed',
      'delayed': 'Delayed',
      'canceled': 'Canceled',
      'missing': 'Missing',
      'incomplete': 'Missing',
    };
    return aviationMap[status] || status;
  };

  // Navigation for current period
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (timeframeView) {
      case 'weekly':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'quarterly':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 3 : -3));
        break;
      case 'annual':
        newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const getCurrentPeriodLabel = () => {
    switch (timeframeView) {
      case 'weekly':
        return `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'quarterly':
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        return `Q${quarter} ${currentDate.getFullYear()}`;
      case 'annual':
        return currentDate.getFullYear().toString();
    }
  };

  // Sort entries chronologically for timeline view
  const sortedTimelineEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const dateA = new Date(a.startDate || a.endDate || '2099-12-31');
      const dateB = new Date(b.startDate || b.endDate || '2099-12-31');
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredEntries]);

  const daysUntil = (dateString: string) => {
    const target = new Date(dateString);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex h-full overflow-hidden overflow-x-hidden">
      {/* Left Sidebar - Summary and Legend - Hidden on mobile */}
      <div className="hidden md:block w-72 border-r overflow-y-auto overflow-x-hidden bg-muted/30 p-6">
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div>
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Entries</span>
                <span className="font-medium">{totalEntries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaigns</span>
                <span className="font-medium">{campaignCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exec Visibility</span>
                <span className="font-medium">{execVisCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">30/60/90</span>
                <span className="font-medium">{milestoneCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{reviewCount}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Legend - Always Visible */}
          <div>
            <h3 className="font-semibold mb-3">Visual Legend</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Content Types</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 shrink-0" style={{ fill: getEntryColor('30_60_90'), color: getEntryColor('30_60_90') }} />
                    <span>30/60/90 Milestones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Diamond className="w-4 h-4 shrink-0" style={{ fill: getEntryColor('campaign'), color: getEntryColor('campaign') }} />
                    <span>Campaigns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4 shrink-0" style={{ fill: getEntryColor('exec_visibility'), color: getEntryColor('exec_visibility') }} />
                    <span>Exec Visibility</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Review Events</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 shrink-0" style={{ color: getEntryColor('review_budget') }} />
                    <span>Monthly Budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Triangle className="w-4 h-4 shrink-0" style={{ fill: getEntryColor('review_quarterly'), color: getEntryColor('review_quarterly') }} />
                    <span>Quarterly Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" style={{ color: getEntryColor('review_call') }} />
                    <span>Strategy Call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 shrink-0" style={{ color: getEntryColor('review_annual') }} />
                    <span>Annual Reset</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Status Indicators</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/20 border border-green-500 rounded flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Completed/Landed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-transparent to-red-500 opacity-30" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, hsl(0, 72%, 51%) 4px, hsl(0, 72%, 51%) 8px)'
                      }}></div>
                    </div>
                    <span>Missing/Incomplete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500/10 rounded"></div>
                    <span>Late (light red shade)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-4 border-2 rounded" style={{ borderColor: getEntryColor('campaign') }}></div>
                    <span className="text-xs">Campaign duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-4 border-2 rounded relative" style={{ borderColor: getEntryColor('campaign') }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 rounded" style={{ backgroundColor: getEntryColor('exec_visibility') }}></div>
                    </div>
                    <span className="text-xs">Exec vis inside</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden overflow-x-hidden min-w-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <div className="max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="border-b p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">Content & Campaign Calendar</h1>
                  <p className="text-muted-foreground mt-1">
                    Unified view of campaigns, exec visibility, and strategic milestones
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Yellow Caution Alert Button - Non-Modal */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`relative border-yellow-500 bg-yellow-50 hover:bg-yellow-100 ${hasApproachingDeadline ? 'animate-pulse' : ''}`}
                      onClick={() => setDrawerOpen(!drawerOpen)}
                      data-testid="button-toggle-alerts"
                    >
                      <Bell className={`w-4 h-4 text-yellow-700`} />
                      {(upcomingDeadlines.length + overdueItems.length) > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-yellow-600"
                        >
                          {upcomingDeadlines.length + overdueItems.length}
                        </Badge>
                      )}
                    </Button>

                    {/* Slide-out Alerts Panel (Non-Modal) */}
                    {drawerOpen && (
                      <Card 
                        className="absolute right-0 top-12 w-96 shadow-2xl z-50 border-yellow-500 max-h-[600px] overflow-y-auto"
                      >
                        <CardHeader className="border-b bg-yellow-50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-700" />
                              Alerts & Deadlines
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 space-y-4">
                          {/* Upcoming Deadlines */}
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              Upcoming Deadlines
                            </h3>
                            {upcomingDeadlines.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                            ) : (
                              <div className="space-y-2">
                                {upcomingDeadlines.map(entry => {
                                  const days = daysUntil(entry.endDate!);
                                  const isApproaching = days <= 3;
                                  return (
                                    <Card key={entry.id} className={isApproaching ? 'border-orange-500 shadow-sm' : ''}>
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{entry.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {new Date(entry.endDate!).toLocaleDateString()}
                                            </p>
                                          </div>
                                          <Badge variant={isApproaching ? 'destructive' : 'outline'} className="shrink-0 text-xs">
                                            {days}d
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Overdue Items */}
                          {overdueItems.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h3 className="font-semibold mb-3 text-destructive flex items-center gap-2 text-sm">
                                  <X className="w-4 h-4" />
                                  Overdue ({overdueItems.length})
                                </h3>
                                <div className="space-y-2">
                                  {overdueItems.map(entry => (
                                    <Card key={entry.id} className="border-destructive">
                                      <CardContent className="p-3">
                                        <p className="font-medium text-sm">{entry.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Due: {new Date(entry.endDate!).toLocaleDateString()}
                                        </p>
                                        {isEntryVeryLate(entry) && (
                                          <Badge variant="destructive" className="mt-2 text-xs">
                                            HITL: Cancel or Reschedule?
                                          </Badge>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* View Tabs with Filters Below */}
            <div className="space-y-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="grid" data-testid="tab-calendar-grid">
                    Calendar Grid
                  </TabsTrigger>
                  <TabsTrigger value="timeline" data-testid="tab-timeline-journey">
                    Timeline Journey
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters Row - Below Tabs */}
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger data-testid="select-type-filter">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="campaign">Campaigns</SelectItem>
                      <SelectItem value="exec_visibility">Exec Visibility</SelectItem>
                      <SelectItem value="30_60_90">30/60/90 Plans</SelectItem>
                      <SelectItem value="review_budget">Budget Reviews</SelectItem>
                      <SelectItem value="review_quarterly">Quarterly Reviews</SelectItem>
                      <SelectItem value="review_call">Strategy Calls</SelectItem>
                      <SelectItem value="review_annual">Annual Resets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 max-w-xs">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="not_launched">Not Launched</SelectItem>
                      <SelectItem value="taxiing">Taxiing</SelectItem>
                      <SelectItem value="in_flight">In Flight</SelectItem>
                      <SelectItem value="landed">Landed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden p-6">
          {viewMode === 'grid' ? (
            <CalendarGridView
              entries={filteredEntries}
              isLoading={isLoading}
              timeframeView={timeframeView}
              setTimeframeView={setTimeframeView}
              currentDate={currentDate}
              navigatePeriod={navigatePeriod}
              getCurrentPeriodLabel={getCurrentPeriodLabel}
              getEntryColor={getEntryColor}
              getTypeBadgeVariant={getTypeBadgeVariant}
              getStatusIcon={getStatusIcon}
              getAviationStatus={getAviationStatus}
              isEntryLate={isEntryLate}
              isEntryMissing={isEntryMissing}
              onEntryClick={setSelectedEntry}
            />
          ) : (
            <TimelineView
              entries={sortedTimelineEntries}
              isLoading={isLoading}
              timeframeView={timeframeView}
              setTimeframeView={setTimeframeView}
              getEntryColor={getEntryColor}
              isEntryLate={isEntryLate}
              isEntryMissing={isEntryMissing}
            />
          )}
        </div>
      </div>

      {/* Entry Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEntry?.title}</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Status</p>
                  <p className="text-lg font-medium">{getAviationStatus(selectedEntry.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Owner</p>
                  <p className="text-lg">{selectedEntry.owner}</p>
                </div>
                {selectedEntry.startDate && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Start Date</p>
                    <p>{new Date(selectedEntry.startDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedEntry.endDate && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">End Date</p>
                    <p>{new Date(selectedEntry.endDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedEntry.channel && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Channel</p>
                    <p>{selectedEntry.channel}</p>
                  </div>
                )}
                {selectedEntry.goal && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Goal</p>
                    <p>{selectedEntry.goal}</p>
                  </div>
                )}
              </div>
              {selectedEntry.description && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedEntry.description}</p>
                </div>
              )}
              {(selectedEntry.status === 'landed' || selectedEntry.status === 'completed') && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold text-green-800 mb-2">✅ Successfully Completed</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-medium">24,567</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-medium">4.2%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="font-medium">142</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Calendar Grid View Component
function CalendarGridView({
  entries,
  isLoading,
  timeframeView,
  setTimeframeView,
  currentDate,
  navigatePeriod,
  getCurrentPeriodLabel,
  getEntryColor,
  getTypeBadgeVariant,
  getStatusIcon,
  getAviationStatus,
  isEntryLate,
  isEntryMissing,
  onEntryClick,
}: any) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading calendar entries...
      </div>
    );
  }

  const renderEntryIcon = (entry: CalendarEntry) => {
    const color = getEntryColor(entry.type);
    const baseClasses = "w-5 h-5 shrink-0";
    const missing = isEntryMissing(entry);
    const iconColor = missing ? 'hsl(0, 72%, 51%)' : color;
    
    if (entry.type.startsWith('review_')) {
      if (entry.reviewType === 'budget') {
        return <DollarSign className={baseClasses} style={{ color: iconColor }} />;
      } else if (entry.reviewType === 'quarterly') {
        return <Triangle className={baseClasses} style={{ fill: iconColor, color: iconColor }} />;
      } else if (entry.reviewType === 'strategy_call') {
        return <Phone className={baseClasses} style={{ color: iconColor }} />;
      } else if (entry.reviewType === 'annual') {
        return <Compass className={baseClasses} style={{ color: iconColor }} />;
      }
    }
    
    switch (entry.type) {
      case '30_60_90':
        return <Circle className={baseClasses} style={{ fill: iconColor, color: iconColor }} />;
      case 'exec_visibility':
        return <Square className={baseClasses} style={{ fill: iconColor, color: iconColor }} />;
      case 'campaign':
        return <Diamond className={baseClasses} style={{ fill: iconColor, color: iconColor }} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Timeframe Selector and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigatePeriod('prev')} data-testid="button-prev-period">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold min-w-[180px] text-center">{getCurrentPeriodLabel()}</span>
          <Button variant="outline" size="icon" onClick={() => navigatePeriod('next')} data-testid="button-next-period">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Select value={timeframeView} onValueChange={(v) => setTimeframeView(v as any)}>
          <SelectTrigger className="w-[140px]" data-testid="select-timeframe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entries List */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-400px)]">
        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No entries found for this period
          </div>
        ) : (
          entries.map((entry: CalendarEntry) => {
            const late = isEntryLate(entry);
            const missing = isEntryMissing(entry);
            
            return (
              <Card 
                key={entry.id} 
                className={`hover-elevate cursor-pointer relative overflow-hidden ${late ? 'bg-red-500/5' : ''} ${missing ? 'border-red-500' : ''}`}
                onClick={() => onEntryClick(entry)}
                data-testid={`card-entry-${entry.id}`}
              >
                {/* Red diagonal stripes for missing entries */}
                {missing && (
                  <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, hsl(0, 72%, 51%) 8px, hsl(0, 72%, 51%) 16px)'
                  }}></div>
                )}
                
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start gap-4">
                    {renderEntryIcon(entry)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold flex items-center gap-2">
                            {getStatusIcon(entry)} {entry.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{entry.owner}</p>
                        </div>
                        <Badge variant={getTypeBadgeVariant(entry.type)} className="shrink-0">
                          {entry.type.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        {entry.startDate && (
                          <span>Start: {new Date(entry.startDate).toLocaleDateString()}</span>
                        )}
                        {entry.endDate && (
                          <span>End: {new Date(entry.endDate).toLocaleDateString()}</span>
                        )}
                        {entry.status && (
                          <Badge variant="outline" className="capitalize">
                            {getAviationStatus(entry.status)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// Timeline View Component (same structure as before, with missing/late styling added)
function TimelineView({ 
  entries, 
  isLoading,
  timeframeView,
  setTimeframeView,
  getEntryColor,
  isEntryLate,
  isEntryMissing,
}: { 
  entries: CalendarEntry[], 
  isLoading: boolean,
  timeframeView: TimeframeView,
  setTimeframeView: (v: TimeframeView) => void,
  getEntryColor: (type: CalendarEntry['type']) => string,
  isEntryLate: (entry: CalendarEntry) => boolean,
  isEntryMissing: (entry: CalendarEntry) => boolean,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading timeline...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No entries to display on timeline
      </div>
    );
  }

  // Calculate timeline scale
  const allDates = entries.flatMap(e => [e.startDate, e.endDate].filter(Boolean) as string[]);
  const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
  const daySpan = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) || 365;
  
  const pixelsPerDayMap: Record<TimeframeView, number> = {
    weekly: 60,
    monthly: 15,
    quarterly: 5,
    annual: 2,
  };
  const pixelsPerDay = pixelsPerDayMap[timeframeView];

  const getPositionX = (date: string) => {
    const d = new Date(date);
    const dayOffset = Math.ceil((d.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return dayOffset * pixelsPerDay;
  };

  const execVisWithinCampaigns = entries.filter(e => e.type === 'exec_visibility' && e.parentCampaignId);
  const campaignExecVisMap = new Map<string, CalendarEntry[]>();
  execVisWithinCampaigns.forEach(execVis => {
    const list = campaignExecVisMap.get(execVis.parentCampaignId!) || [];
    list.push(execVis);
    campaignExecVisMap.set(execVis.parentCampaignId!, list);
  });

  const getTimeMarkers = () => {
    const markers: Array<{ date: Date; label: string; left: number }> = [];
    const current = new Date(minDate);
    
    while (current <= maxDate) {
      let label = '';
      switch (timeframeView) {
        case 'weekly':
          label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          current.setDate(current.getDate() + 7);
          break;
        case 'monthly':
          label = current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          current.setMonth(current.getMonth() + 1);
          break;
        case 'quarterly':
          const quarter = Math.floor(current.getMonth() / 3) + 1;
          label = `Q${quarter} '${current.getFullYear().toString().slice(-2)}`;
          current.setMonth(current.getMonth() + 3);
          break;
        case 'annual':
          label = current.getFullYear().toString();
          current.setFullYear(current.getFullYear() + 1);
          break;
      }
      markers.push({
        date: new Date(current),
        label,
        left: getPositionX(current.toISOString())
      });
    }
    
    return markers;
  };

  const timeMarkers = getTimeMarkers();

  const renderTimelineIcon = (entry: CalendarEntry, missing: boolean) => {
    const color = missing ? 'hsl(0, 72%, 51%)' : getEntryColor(entry.type);
    const baseClasses = "w-4 h-4 drop-shadow-md";
    
    if (entry.type.startsWith('review_')) {
      if (entry.reviewType === 'budget') {
        return <DollarSign className={baseClasses} style={{ color }} />;
      } else if (entry.reviewType === 'quarterly') {
        return <Triangle className={baseClasses} style={{ fill: color, color }} />;
      } else if (entry.reviewType === 'strategy_call') {
        return <Phone className={baseClasses} style={{ color }} />;
      } else if (entry.reviewType === 'annual') {
        return <Compass className={baseClasses} style={{ color }} />;
      }
    }
    
    switch (entry.type) {
      case '30_60_90':
        return <Circle className={baseClasses} style={{ fill: color, color }} />;
      case 'exec_visibility':
        return <Square className={baseClasses} style={{ fill: color, color }} />;
      case 'campaign':
        return <Diamond className={baseClasses} style={{ fill: color, color }} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">Horizontal Timeline Journey</h2>
          <p className="text-sm text-muted-foreground">
            Scroll to explore your marketing execution timeline. Hover over items for details.
          </p>
        </div>
        
        <Select value={timeframeView} onValueChange={(v) => setTimeframeView(v as TimeframeView)}>
          <SelectTrigger className="w-[140px]" data-testid="select-timeline-timeframe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative overflow-x-auto overflow-y-hidden pb-4 border rounded-md bg-background/50 p-4">
        <div style={{ width: `${Math.max(daySpan * pixelsPerDay + 200, 1200)}px`, minWidth: '100%' }} className="relative h-80">
          <div className="absolute bottom-8 left-0 right-0 h-px bg-border" />
          
          {timeMarkers.map((marker, i) => (
            <div 
              key={i} 
              className="absolute flex flex-col items-center"
              style={{ left: `${marker.left}px`, bottom: '0' }}
            >
              <div className="w-px h-3 bg-border mb-1" />
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {marker.label}
              </div>
            </div>
          ))}

          {entries.map((entry, idx) => {
            const startX = entry.startDate ? getPositionX(entry.startDate) : getPositionX(entry.endDate || new Date().toISOString());
            const endX = entry.endDate ? getPositionX(entry.endDate) : startX;
            const width = Math.max(endX - startX, 0);
            const color = getEntryColor(entry.type);
            const yPos = 60 + (idx % 4) * 70;
            const execVisInCampaign = entry.type === 'campaign' ? (campaignExecVisMap.get(entry.id) || []) : [];
            const late = isEntryLate(entry);
            const missing = isEntryMissing(entry);

            return (
              <div key={entry.id}>
                {entry.type === 'campaign' && width > 0 && (
                  <>
                    <div
                      className={`absolute h-10 border-2 rounded transition-all hover:border-4 ${late ? 'bg-red-500/10' : ''} ${missing ? 'bg-red-500/20' : ''}`}
                      style={{
                        left: `${startX}px`,
                        width: `${width}px`,
                        top: `${yPos - 5}px`,
                        borderColor: missing ? 'hsl(0, 72%, 51%)' : color,
                        backgroundColor: late && !missing ? 'hsla(0, 72%, 51%, 0.1)' : 'transparent',
                        backgroundImage: missing ? 'repeating-linear-gradient(45deg, transparent, transparent 6px, hsla(0, 72%, 51%, 0.3) 6px, hsla(0, 72%, 51%, 0.3) 12px)' : 'none',
                      }}
                    />
                    
                    {execVisInCampaign.map((execVis, evIdx) => {
                      const execStartX = execVis.startDate ? getPositionX(execVis.startDate) : startX;
                      const execEndX = execVis.endDate ? getPositionX(execVis.endDate) : execStartX;
                      const execWidth = Math.max(execEndX - execStartX, 4);
                      return (
                        <div
                          key={`${entry.id}-execvis-${evIdx}`}
                          className="absolute h-3 rounded shadow-sm"
                          style={{
                            left: `${execStartX}px`,
                            width: `${execWidth}px`,
                            top: `${yPos + 4}px`,
                            backgroundColor: getEntryColor('exec_visibility'),
                          }}
                        />
                      );
                    })}
                  </>
                )}

                <div
                  className="absolute group cursor-pointer transition-transform hover:scale-150"
                  style={{
                    left: `${startX - 8}px`,
                    top: `${yPos}px`,
                  }}
                >
                  {renderTimelineIcon(entry, missing)}
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-50">
                    <Card className="w-64 shadow-lg border-2">
                      <CardContent className="p-3">
                        <div className="font-semibold text-sm mb-2">{entry.title}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {entry.startDate && (
                            <div>Start: {new Date(entry.startDate).toLocaleDateString()}</div>
                          )}
                          {entry.endDate && (
                            <div>End: {new Date(entry.endDate).toLocaleDateString()}</div>
                          )}
                          {entry.description && (
                            <div className="mt-2 pt-2 border-t break-words whitespace-normal">
                              {entry.description}
                            </div>
                          )}
                          {execVisInCampaign.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <div className="font-semibold mb-1">Exec Visibility:</div>
                              {execVisInCampaign.map(ev => (
                                <div key={ev.id} className="ml-2">• {ev.title}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
