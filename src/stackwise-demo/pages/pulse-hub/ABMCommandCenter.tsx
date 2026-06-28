import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, DragOverlay, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/stackwise-demo/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/stackwise-demo/components/ui/select";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { RequestBudgetChangeDialog } from "@/stackwise-demo/components/RequestBudgetChangeDialog";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { 
  BarChart3, ArrowUpRight, ArrowDownRight, Target, Filter, 
  ChevronDown, ChevronUp, TrendingUp, Clock, DollarSign, 
  MapPin, Users, Activity, Zap, Eye, MousePointer, 
  FileText, Mail, MessageSquare, Calendar, Building2,
  Sparkles, Globe, Phone, Briefcase, Bell, Play, Pause,
  Edit, Trash2, Plus, Search, GripVertical, AlertCircle,
  Download, Share2, CheckCircle, XCircle, Lightbulb, Award
} from "lucide-react";

type StepKey = 'overview' | 'hot5' | 'engagement' | 'playbooks' | 'executive';
type NextPlayType = '1:1' | 'Cluster' | 'Awareness' | null;

interface Account {
  id: string;
  name: string;
  industry: string;
  size: string;
  hq: string;
  intent: number;
  engagement: number;
  fit: number;
  touches: number;
  uniqueVisitors: number;
  avgIntent: number;
  tier: number;
  pages: string[];
  content: string[];
  contacts: Array<{ name: string; email?: string }>;
  locations: string[];
  tech: string[];
  budget: string;
  nextPlay?: NextPlayType;
  salesDirection?: string;
}

interface Playbook {
  id: string;
  name: string;
  playType: '1:1' | 'Cluster' | 'Awareness';
  topic: string;
  pillar: string;
  industry: string;
  persona: string;
  tier: string;
  summary: string;
  duration: number;
  channels: string[];
  status?: 'Planned' | 'Active' | 'Completed';
  assignedAccounts?: string[];
  likelihoodToClose?: number;
  owner?: string;
  nextReviewDate?: string;
}

export default function ABMCommandCenter() {
  const [currentStep, setCurrentStep] = useState<StepKey>('overview');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState('nextPlays');
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);
  const [showBudgetRequestDialog, setShowBudgetRequestDialog] = useState(false);
  const { toast } = useToast();
  
  const moduleColor = '#6218df';

  // Live ABM data from CRM
  const [abmLive, setAbmLive] = useState({ contacts: 0, accounts: 0 });
  const [liveContacts, setLiveContacts] = useState<any[]>([]);
  const [liveAccounts, setLiveAccounts] = useState<any[]>([]);
  const [abmLoading, setAbmLoading] = useState(false);
  const [abmError, setAbmError] = useState<string | null>(null);
  const [engagementFilter, setEngagementFilter] = useState<'all' | 'accounts' | 'contacts'>('all');

  // Fetch live CRM data on mount
  useEffect(() => {
    const fetchLiveABMData = async () => {
      try {
        setAbmLoading(true);
        setAbmError(null);

        // Fetch using authenticated session
        const [contactsRes, accountsRes] = await Promise.all([
          fetch(`/api/abm/contacts`),
          fetch(`/api/abm/accounts`)
        ]);

        const contactsJson = await contactsRes.json().catch(() => ({ success: false, count: 0, data: [] }));
        const accountsJson = await accountsRes.json().catch(() => ({ success: false, count: 0, data: [] }));

        const contacts = contactsJson?.count ?? 0;
        const accounts = accountsJson?.count ?? 0;
        
        setAbmLive({ contacts, accounts });
        setLiveContacts(Array.isArray(contactsJson?.data) ? contactsJson.data : []);
        setLiveAccounts(Array.isArray(accountsJson?.data) ? accountsJson.data : []);

        // Show success toast
        toast({
          title: "ABM Data Loaded",
          description: `Contacts: ${contacts} • Accounts: ${accounts}`
        });
      } catch (err) {
        setAbmError(err instanceof Error ? err.message : 'Failed to load ABM data');
        console.error('Error fetching ABM data:', err);
      } finally {
        setAbmLoading(false);
      }
    };

    fetchLiveABMData();
  }, [toast]);

  const steps = [
    { id: 'overview', label: 'Account Intelligence Overview', description: 'High-level metrics and KPIs' },
    { id: 'hot5', label: 'Hot 5', description: 'Top priority accounts' },
    { id: 'engagement', label: 'Account Engagement', description: 'Real-time engagement data' },
    { id: 'playbooks', label: 'ABM Playbooks', description: 'Playbook management' },
    { id: 'executive', label: 'Executive Summary', description: 'Leadership report' }
  ];

  const [accounts, setAccounts] = useState<Account[]>(
    Array.from({ length: 8 }).map((_, i) => ({
      id: `acc-${i + 1}`,
      name: `TechCorp Solutions ${i + 1}`,
      industry: ["SaaS", "Healthcare", "FinTech", "Manufacturing", "Biotech", "SaaS", "Healthcare", "FinTech"][i],
      size: "500–1000",
      hq: ["Boston, MA", "San Francisco, CA", "Austin, TX", "New York, NY", "Seattle, WA", "Denver, CO", "Miami, FL", "Portland, OR"][i],
      intent: 82 + ((i * 3) % 9),
      engagement: 88 + ((i * 2) % 10),
      fit: 80 + (i % 7),
      touches: 35 + ((i * 5) % 20),
      uniqueVisitors: 210 + i * 14,
      avgIntent: 70 + (i % 9),
      tier: (i % 3) + 1,
      pages: ["Pricing", "Features", "Case Study", "Blog"].slice(0, 3 + (i % 2)),
      content: ["ROI Report", "Webinar", "Customer Story"].slice(0, 2 + (i % 2)),
      contacts: [
        { name: "Sarah Johnson – VP Marketing", email: "sjohnson@techcorp.com" },
        { name: "Mike Chen – Director of Growth", email: "mchen@techcorp.com" },
        { name: "David Rodriguez – CMO" },
      ],
      locations: ["Boston, MA", "New York, NY", "Chicago, IL"].slice(0, 2 + (i % 2)),
      tech: ["Salesforce", "HubSpot", "GA4", "Slack"].slice(0, 3 + (i % 2)),
      budget: "$75K–$100K",
      nextPlay: i < 5 ? (i % 3 === 0 ? '1:1' : i % 3 === 1 ? 'Cluster' : 'Awareness') as NextPlayType : null,
      salesDirection: "High Priority: Schedule personalized demo. Tailored outreach; align SDR + AE; include case study."
    }))
  );

  const [engagementAccounts, setEngagementAccounts] = useState(
    Array.from({ length: 21 }).map((_, i) => ({
      id: `eng-${i + 1}`,
      name: `Account ${i + 1}`,
      tier: (i % 3) + 1,
      intentScore: 72 + (i % 25),
      trend: i % 2 === 0 ? 'up' : 'down',
      trendValue: i % 2 === 0 ? '+12% WoW' : '-8% MoM',
      contactsInCRM: 3 + (i % 7),
      topCampaign: "LinkedIn Ads",
      keyContent: "ROI Case Study",
      nextPlay: null as NextPlayType,
      detailInfo: `Engaged with ${3 + (i % 5)} pieces of content in last 30 days. Strong signals from C-suite.`
    }))
  );

  const [playbooks, setPlaybooks] = useState<Playbook[]>([
    {
      id: 'pb-1',
      name: 'Enterprise Awareness Builder',
      playType: 'Awareness',
      topic: 'Brand Building',
      pillar: 'Brand Visibility',
      industry: 'SaaS',
      persona: 'VP Marketing',
      tier: 'Tier 1',
      summary: 'Multi-channel nurture campaign for Tier 1 accounts',
      duration: 45,
      channels: ['LinkedIn', 'Email', 'Events'],
      status: 'Active',
      assignedAccounts: [],
      likelihoodToClose: 72,
      owner: 'Sarah Johnson',
      nextReviewDate: '2025-11-15'
    },
    {
      id: 'pb-2',
      name: 'Executive 1:1 Outreach',
      playType: '1:1',
      topic: 'Executive Engagement',
      pillar: 'Exec POV',
      industry: 'Healthcare',
      persona: 'CMO',
      tier: 'Tier 1',
      summary: 'Personalized executive engagement program',
      duration: 30,
      channels: ['Email', 'Phone', 'Direct Mail'],
      status: 'Planned',
      assignedAccounts: [],
      likelihoodToClose: 85,
      owner: 'Mike Chen',
      nextReviewDate: '2025-11-20'
    },
    {
      id: 'pb-3',
      name: 'FinTech Cluster Campaign',
      playType: 'Cluster',
      topic: 'Industry-Specific',
      pillar: 'Pipeline Growth',
      industry: 'FinTech',
      persona: 'Director of Growth',
      tier: 'Tier 2',
      summary: 'Targeted campaign for FinTech segment',
      duration: 60,
      channels: ['LinkedIn', 'Webinars', 'Email'],
      status: 'Active',
      assignedAccounts: [],
      likelihoodToClose: 68,
      owner: 'David Rodriguez',
      nextReviewDate: '2025-11-18'
    }
  ]);

  const handleNextPlaySelect = (accountId: string, playType: NextPlayType) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    // Determine CRM tier based on play type
    let crmTier: number;
    let tierLabel: string;
    
    if (playType === '1:1') {
      crmTier = 1;
      tierLabel = 'Tier 1';
    } else if (playType === 'Cluster') {
      crmTier = 2;
      tierLabel = 'Tier 2';
    } else if (playType === 'Awareness') {
      crmTier = 3;
      tierLabel = 'Tier 3';
    } else {
      // New Play - needs review
      crmTier = account.tier; // Keep existing tier
      tierLabel = 'Needs Review';
    }

    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, nextPlay: playType, tier: crmTier } : acc
    ));

    // Trigger marketing alert
    if (playType) {
      toast({
        title: "Next Play Assigned",
        description: `${account.name} assigned to ${playType} play • CRM tier updated to ${tierLabel} • Marketing team alerted`,
        duration: 5000
      });
    }
  };

  const handleAlertSales = (account: Account) => {
    toast({
      title: "Sales Alert Sent",
      description: `Alert sent for ${account.name} with sales direction and context`
    });
  };

  const handleEngagementNextPlaySelect = (accountId: string, playType: NextPlayType) => {
    const account = engagementAccounts.find(a => a.id === accountId);
    if (!account) return;

    // Determine CRM tier based on play type
    let crmTier: number;
    let tierLabel: string;
    
    if (playType === '1:1') {
      crmTier = 1;
      tierLabel = 'Tier 1';
    } else if (playType === 'Cluster') {
      crmTier = 2;
      tierLabel = 'Tier 2';
    } else if (playType === 'Awareness') {
      crmTier = 3;
      tierLabel = 'Tier 3';
    } else {
      // New Play - needs review
      crmTier = account.tier; // Keep existing tier
      tierLabel = 'Needs Review';
    }

    setEngagementAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, nextPlay: playType, tier: crmTier } : acc
    ));

    // Trigger marketing alert
    if (playType) {
      toast({
        title: "Next Play Assigned",
        description: `${account.name} assigned to ${playType} play • CRM tier updated to ${tierLabel} • Marketing team alerted`,
        duration: 5000
      });
    }
  };

  const handlePlaybookAssignment = (playbookId: string, accountId: string) => {
    const playbook = playbooks.find(pb => pb.id === playbookId);
    const account = accounts.find(a => a.id === accountId);
    
    if (playbook && account) {
      // Update playbook with assigned account
      setPlaybooks(prev => prev.map(pb => 
        pb.id === playbookId 
          ? { ...pb, assignedAccounts: [...(pb.assignedAccounts || []), accountId] }
          : pb
      ));

      // Send marketing alert
      toast({
        title: "Playbook Assigned to Account",
        description: `${playbook.name} assigned to ${account.name} • Marketing team alerted for activation`,
        duration: 5000
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const playbookId = event.active.id as string;
    const playbook = playbooks.find(pb => pb.id === playbookId);
    if (playbook) {
      setActivePlaybook(playbook);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePlaybook(null);

    if (over && active.id !== over.id) {
      const playbookId = active.id as string;
      const accountId = over.id as string;
      
      // Use the new handler with marketing alert
      handlePlaybookAssignment(playbookId, accountId);
    }
  };

  const getTrend = (i: number) => (i % 2 === 0 ? "up" : "down");

  // Draggable Playbook Component
  const DraggablePlaybook = ({ playbook }: { playbook: Playbook }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: playbook.id,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.5 : 1,
    } : {};

    return (
      <Card 
        ref={setNodeRef} 
        style={style}
        {...listeners} 
        {...attributes}
        className="border border-purple-100 cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <GripVertical className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-semibold">{playbook.name}</p>
              <p className="text-xs text-gray-600 mt-1">{playbook.summary}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{playbook.pillar}</Badge>
                <Badge variant="outline" className="text-xs">{playbook.industry}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Droppable Account Zone Component
  const DroppableAccountZone = ({ account }: { account: Account }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: account.id,
    });

    return (
      <div 
        ref={setNodeRef}
        className={`border rounded-lg p-3 transition-all ${
          isOver 
            ? 'bg-purple-100 border-purple-400 border-2' 
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <p className="font-semibold text-sm">{account.name}</p>
        <p className="text-xs text-gray-600">Industry: {account.industry} • Tier {account.tier}</p>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="bg-white px-8 py-4 border-b border-purple-100 sticky top-0 z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: moduleColor }}>ABM Command Center</h1>
          <p className="text-gray-600 max-w-3xl">
            Centralize account insights, engagement signals, and market intelligence to align marketing and sales on the accounts that matter most.
          </p>
        </div>

        <div className="p-8">
          {/* ===================== Account Intelligence Overview ===================== */}
          {currentStep === 'overview' && (
            <div className="space-y-8">
              <Card className="p-6 border border-gray-200">
                <CardContent className="space-y-8">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <DollarSign className="text-purple-600 w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Total Revenue</p>
                        <p className="text-lg font-semibold" style={{ color: moduleColor }}>$3.6M</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <TrendingUp className="text-green-600 w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Active Opportunities</p>
                        <p className="text-lg font-semibold" style={{ color: moduleColor }}>43</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <Clock className="text-blue-600 w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Avg Deal Velocity</p>
                        <p className="text-lg font-semibold" style={{ color: moduleColor }}>42 Days</p>
                      </div>
                    </div>
                  </div>

                  {/* KPI cards */}
                  <h3 className="text-xl font-semibold" style={{ color: moduleColor }}>Account Intelligence Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {["Accounts Monitored", "Opportunities", "Revenue Impact", "Velocity"].map((label, i) => (
                      <Card key={i} className="p-4 border border-gray-200">
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">{label}</p>
                            <BarChart3 className="text-purple-600" />
                          </div>
                          <h3 className="text-2xl font-bold mt-2">
                            {label === "Accounts Monitored" ? "247" : label === "Opportunities" ? "32" : label === "Revenue Impact" ? "$1.2M" : "+18%"}
                          </h3>
                          <div className="flex items-center text-xs mt-1 text-green-600">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +5% MoM
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Marketing & Sales Alignment */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Marketing & Sales Alignment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
                        <MapPin className="mx-auto mb-2 text-purple-600" />
                        <h5 className="text-base font-bold">Active Opportunities</h5>
                        <p className="text-2xl font-semibold text-purple-700 mt-1">32</p>
                      </div>
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                        <TrendingUp className="mx-auto mb-2 text-blue-600" />
                        <h5 className="text-base font-bold">Marketing-Sourced Pipeline</h5>
                        <p className="text-2xl font-semibold text-blue-700 mt-1">$1.1M</p>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                        <Users className="mx-auto mb-2 text-green-600" />
                        <h5 className="text-base font-bold">Accounts in Sync</h5>
                        <p className="text-2xl font-semibold text-green-700 mt-1">89%</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* Funnel */}
                  <h4 className="font-semibold mb-3">Funnel by Stage</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: "Non-Aware", val: 60 },
                      { label: "Aware", val: 50 },
                      { label: "Engaged", val: 40 },
                      { label: "Opportunity", val: 32, amt: "$420K" },
                      { label: "Converted", val: 18, amt: "$230K" },
                      { label: "Velocity", val: 12, amt: "$150K" },
                    ].map((s, i) => (
                      <div key={i} className="text-center border border-gray-200 p-3 rounded-md">
                        <p className="text-xs sm:text-sm font-medium">{s.label}</p>
                        <p className="font-bold text-base sm:text-lg">{s.val}</p>
                        {s.amt && <p className="text-xs text-gray-600">{s.amt}</p>}
                      </div>
                    ))}
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* Opportunities Snapshot */}
                  <h4 className="font-semibold mb-2">Opportunities Pipeline Snapshot</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center"><h4 className="text-xl sm:text-2xl font-bold text-green-600">12</h4><p className="text-xs sm:text-sm">Prospecting ($420K)</p></div>
                    <div className="text-center"><h4 className="text-xl sm:text-2xl font-bold text-blue-600">9</h4><p className="text-xs sm:text-sm">Qualification ($290K)</p></div>
                    <div className="text-center"><h4 className="text-xl sm:text-2xl font-bold text-purple-600">7</h4><p className="text-xs sm:text-sm">Proposal ($320K)</p></div>
                    <div className="text-center"><h4 className="text-xl sm:text-2xl font-bold text-gray-600">5</h4><p className="text-xs sm:text-sm">Closed-Won ($230K)</p></div>
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* Industry Trends */}
                  <h4 className="font-semibold mb-2">Industry Trends by Region</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><p className="text-gray-500 text-sm">North America</p><ul className="text-sm mt-2 space-y-1"><li>Healthcare Tech ↑</li><li>FinServ SaaS ↑</li><li>Manufacturing →</li></ul></div>
                    <div><p className="text-gray-500 text-sm">Europe</p><ul className="text-sm mt-2 space-y-1"><li>Green Energy ↑</li><li>Data Privacy ↓</li><li>Automation ↑</li></ul></div>
                    <div><p className="text-gray-500 text-sm">APAC</p><ul className="text-sm mt-2 space-y-1"><li>AI Tools ↑</li><li>FinTech ↑</li><li>Cloud Security ↓</li></ul></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===================== Hot 5 ===================== */}
          {currentStep === 'hot5' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Top 5 Hot Accounts</h3>
              <div className="space-y-4">
                {accounts.map((acct, idx) => {
                  const isOpen = expanded === idx;
                  return (
                    <Card key={idx} className="border border-purple-100 shadow-sm">
                      <CardContent className="p-6">
                        {/* header */}
                        <div className="flex justify-between items-center">
                          <div className="flex-1 cursor-pointer" onClick={() => setExpanded(isOpen ? null : idx)}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-bold" style={{ color: moduleColor }}>{acct.name}</h4>
                                <p className="text-xs text-gray-500">Industry: {acct.industry} • Size: {acct.size} • HQ: {acct.hq} • Tier {acct.tier}</p>
                              </div>
                              {isOpen ? <ChevronUp style={{ color: moduleColor }} /> : <ChevronDown style={{ color: moduleColor }} />}
                            </div>
                          </div>
                          <div className="ml-4">
                            <Select value={acct.nextPlay || ''} onValueChange={(value) => handleNextPlaySelect(acct.id, value as NextPlayType)}>
                              <SelectTrigger className="w-[150px]" data-testid={`select-nextplay-${idx}`}>
                                <SelectValue placeholder="Next Play" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1:1">1:1</SelectItem>
                                <SelectItem value="Cluster">Cluster</SelectItem>
                                <SelectItem value="Awareness">Awareness</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* summary row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t pt-4 mt-4">
                          <div><h3 className="text-xl sm:text-2xl font-bold text-red-600">{acct.intent}</h3><p className="text-xs sm:text-sm">Intent</p></div>
                          <div><h3 className="text-xl sm:text-2xl font-bold text-blue-600">{acct.engagement}</h3><p className="text-xs sm:text-sm">Engagement</p></div>
                          <div><h3 className="text-xl sm:text-2xl font-bold text-green-600">{acct.fit}</h3><p className="text-xs sm:text-sm">Fit</p></div>
                          <div><h3 className="text-xl sm:text-2xl font-bold text-purple-600">{acct.touches}</h3><p className="text-xs sm:text-sm">Touches</p></div>
                        </div>

                        {/* collapsible detail */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="space-y-6 mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-purple-50 border-none">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2">Website Engagement</h4>
                                    <p>Pages Visited: {acct.pages.join(", ")}</p>
                                    <p>Unique Visitors: {acct.uniqueVisitors}</p>
                                    <p>Top Referrer: LinkedIn</p>
                                  </CardContent>
                                </Card>
                                <Card className="bg-green-50 border-none">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2">Content & Email Activity</h4>
                                    <p>Top Content: {acct.content.join(", ")}</p>
                                    <p>Avg Intent Score: {acct.avgIntent}</p>
                                    <p>Engagement Rate: {Math.min(98, Math.round((acct.engagement / 100) * 72 + 18))}%</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border border-gray-100">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2">Key Contacts</h4>
                                    {acct.contacts.map((c, i) => (
                                      <div key={i} className="flex items-center gap-2 mb-1">
                                        <p className="text-sm">{c.name}</p>
                                        {c.email && <Mail className="w-3 h-3 text-purple-600" />}
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                                <Card className="border border-gray-100">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2">Locations</h4>
                                    {acct.locations.map((l, i) => (
                                      <p key={i} className="text-sm">{l}</p>
                                    ))}
                                  </CardContent>
                                </Card>
                                <Card className="border border-gray-100">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2">Tech Stack & Budget</h4>
                                    <p className="text-sm">{acct.tech.join(", ")}</p>
                                    <p className="text-sm mt-1">Budget: {acct.budget}</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="bg-red-50 border border-red-100 rounded-md p-4 flex justify-between items-center">
                                <div>
                                  <h5 className="font-bold text-red-600">Sales Direction</h5>
                                  <p className="text-xs text-gray-700 mt-1">{acct.salesDirection}</p>
                                </div>
                                <Button 
                                  onClick={() => handleAlertSales(acct)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  data-testid={`button-alert-sales-${idx}`}
                                >
                                  <Bell className="w-4 h-4 mr-2" />
                                  Alert Sales
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== Account Engagement ===================== */}
          {currentStep === 'engagement' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Filter className="w-4 h-4" style={{ color: moduleColor }} />
                  <Select value={engagementFilter} onValueChange={(value) => setEngagementFilter(value as 'all' | 'accounts' | 'contacts')}>
                    <SelectTrigger className="w-[140px] border border-gray-300" data-testid="filter-type">
                      <SelectValue placeholder="Show All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="accounts">Accounts Only</SelectItem>
                      <SelectItem value="contacts">Contacts Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <select className="border border-gray-300 text-sm rounded-md p-1" data-testid="filter-tier">
                    <option>All Tiers</option>
                    <option>Tier 1</option>
                    <option>Tier 2</option>
                    <option>Tier 3</option>
                  </select>
                  <select className="border border-gray-300 text-sm rounded-md p-1" data-testid="filter-industry">
                    <option>All Industries</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                  </select>
                  <select className="border border-gray-300 text-sm rounded-md p-1" data-testid="filter-intent">
                    <option>All Intent Scores</option>
                    <option>Above 80</option>
                    <option>60-80</option>
                    <option>Below 60</option>
                  </select>
                </div>
              </div>

              {/* Empty State */}
              {liveAccounts.length === 0 && liveContacts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No CRM Data Available</h3>
                  <p className="text-gray-600 mb-6">Connect a CRM integration to view your accounts and contacts here.</p>
                  <button
                    onClick={() => window.location.href = '/integrations'}
                    className="px-6 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: moduleColor }}
                  >
                    Connect CRM
                  </button>
                </div>
              )}

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Render Accounts */}
                {(engagementFilter === 'all' || engagementFilter === 'accounts') && liveAccounts.length > 0 && liveAccounts.map((acct: any, i) => {
                  // Display live account from database
                  const contactsForAccount = liveContacts.filter(c => 
                    c.account_id && acct.external_id && c.account_id === acct.external_id
                    );
                    
                    return (
                      <motion.div
                        key={acct.external_id || i}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.25 }}
                        className="border-2 rounded-lg p-4 bg-white shadow-sm relative border-blue-300"
                        data-testid={`card-engagement-live-${i}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold" style={{ color: moduleColor }}>
                              {acct.account_name || acct.website || acct.domain || 'Account'}
                            </h4>
                            <p className="text-sm font-medium text-gray-700 mt-1">{acct.industry || '—'}</p>
                          </div>
                          <Select value="" onValueChange={(value) => handleEngagementNextPlaySelect(acct.external_id, value as NextPlayType)}>
                            <SelectTrigger className="w-[120px] h-8" data-testid={`select-engagement-nextplay-live-${i}`}>
                              <SelectValue placeholder="Next Play" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1:1">1:1</SelectItem>
                              <SelectItem value="Cluster">Cluster</SelectItem>
                              <SelectItem value="Awareness">Awareness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-sm text-gray-900 mt-1 font-medium">Contacts in CRM: {contactsForAccount.length}</p>
                        <hr className="border-t border-gray-200 my-2" />
                        <p className="text-xs text-gray-700">Owner: {acct.owner_name || '—'}</p>
                        <p className="text-xs text-gray-700">Website: {acct.website || '—'}</p>
                        <p className="text-xs text-gray-700">Employees: {acct.employee_count ?? '—'}</p>
                      </motion.div>
                    );
                })}

                {/* Render Contacts */}
                {(engagementFilter === 'all' || engagementFilter === 'contacts') && liveContacts.map((contact: any, i) => (
                  <motion.div
                    key={contact.contact_id || `contact-${i}`}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25 }}
                    className="border-2 rounded-lg p-4 bg-white shadow-sm relative border-green-300"
                    data-testid={`card-engagement-contact-${i}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold" style={{ color: moduleColor }}>
                          {contact.first_name && contact.last_name 
                            ? `${contact.first_name} ${contact.last_name}`
                            : contact.email || 'Contact'}
                        </h4>
                        <p className="text-sm font-medium text-gray-700 mt-1">{contact.job_title || '—'}</p>
                      </div>
                      <Select value="" onValueChange={(value) => handleEngagementNextPlaySelect(contact.contact_id, value as NextPlayType)}>
                        <SelectTrigger className="w-[120px] h-8" data-testid={`select-engagement-nextplay-contact-${i}`}>
                          <SelectValue placeholder="Next Play" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">1:1</SelectItem>
                          <SelectItem value="Cluster">Cluster</SelectItem>
                          <SelectItem value="Awareness">Awareness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-gray-900 mt-1 font-medium">
                      {contact.email || '—'}
                    </p>
                    <hr className="border-t border-gray-200 my-2" />
                    <p className="text-xs text-gray-700">Phone: {contact.phone || '—'}</p>
                    <p className="text-xs text-gray-700">Company: {contact.company || '—'}</p>
                    <p className="text-xs text-gray-700">Lifecycle Stage: {contact.lifecycle_stage || '—'}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== ABM Playbooks ===================== */}
          {currentStep === 'playbooks' && (
            <div className="space-y-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="nextPlays" data-testid="tab-nextplays">Recommended Next Play</TabsTrigger>
                  <TabsTrigger value="playbooks" data-testid="tab-playbooks">Playbooks</TabsTrigger>
                </TabsList>

                {/* Next Plays Tab */}
                <TabsContent value="nextPlays" className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">Accounts assigned to Next Plays. Drag playbooks onto accounts to activate.</p>
                    <Button variant="outline" data-testid="button-search-playbooks" className="w-full sm:w-auto">
                      <Search className="w-4 h-4 mr-2" />
                      Search Playbooks
                    </Button>
                  </div>
                  
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Side - Accounts Grouped by Play Type */}
                      <div className="lg:col-span-1 space-y-4">
                        {/* 1:1 Section */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">1:1 Plays</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {accounts.filter(a => a.nextPlay === '1:1').length > 0 ? (
                                accounts.filter(a => a.nextPlay === '1:1').map(a => (
                                  <DroppableAccountZone key={a.id} account={a} />
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">No accounts assigned yet</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Cluster Section */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Cluster Plays</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {accounts.filter(a => a.nextPlay === 'Cluster').length > 0 ? (
                                accounts.filter(a => a.nextPlay === 'Cluster').map(a => (
                                  <DroppableAccountZone key={a.id} account={a} />
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">No accounts assigned yet</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Awareness Section */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Awareness Plays</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {accounts.filter(a => a.nextPlay === 'Awareness').length > 0 ? (
                                accounts.filter(a => a.nextPlay === 'Awareness').map(a => (
                                  <DroppableAccountZone key={a.id} account={a} />
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">No accounts assigned yet</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right Side - Top Playbooks */}
                      <div className="lg:col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Top Playbooks</CardTitle>
                            <p className="text-sm text-gray-600">Drag playbooks to accounts on the left to assign</p>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* 1:1 Playbooks */}
                            <div>
                              <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Badge variant="outline">1:1</Badge>
                                Best for Individual Account Engagement
                              </h5>
                              <div className="space-y-2">
                                {playbooks.filter(p => p.playType === '1:1').map(pb => (
                                  <DraggablePlaybook key={pb.id} playbook={pb} />
                                ))}
                              </div>
                            </div>

                            {/* Cluster Playbooks */}
                            <div>
                              <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Badge variant="outline">Cluster</Badge>
                                Best for Segment Targeting
                              </h5>
                              <div className="space-y-2">
                                {playbooks.filter(p => p.playType === 'Cluster').map(pb => (
                                  <DraggablePlaybook key={pb.id} playbook={pb} />
                                ))}
                              </div>
                            </div>

                            {/* Awareness Playbooks */}
                            <div>
                              <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Badge variant="outline">Awareness</Badge>
                                Best for Broad Market Reach
                              </h5>
                              <div className="space-y-2">
                                {playbooks.filter(p => p.playType === 'Awareness').map(pb => (
                                  <DraggablePlaybook key={pb.id} playbook={pb} />
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Drag Overlay */}
                    <DragOverlay>
                      {activePlaybook ? (
                        <Card className="border border-purple-300 shadow-xl opacity-90">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-5 h-5 text-gray-400" />
                              <div className="flex-1">
                                <p className="font-semibold">{activePlaybook.name}</p>
                                <p className="text-xs text-gray-600 mt-1">{activePlaybook.summary}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">{activePlaybook.pillar}</Badge>
                                  <Badge variant="outline" className="text-xs">{activePlaybook.industry}</Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </TabsContent>

                {/* Playbooks Tab - Consolidated */}
                <TabsContent value="playbooks" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Playbooks</h3>
                      {playbooks.some(pb => pb.status === 'Planned') && (
                        <Badge variant="outline" className="mt-2 bg-yellow-50 text-yellow-700 border-yellow-300">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Needs Review
                        </Badge>
                      )}
                    </div>
                    <Button data-testid="button-create-playbook">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Playbook
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Select>
                      <SelectTrigger data-testid="filter-playtype">
                        <SelectValue placeholder="Play Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Show All</SelectItem>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="Cluster">Cluster</SelectItem>
                        <SelectItem value="Awareness">Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="filter-performance">
                        <SelectValue placeholder="Performance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="high">High (80%+)</SelectItem>
                        <SelectItem value="medium">Medium (60-79%)</SelectItem>
                        <SelectItem value="low">Low (&lt;60%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="filter-status">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Planned">Needs Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="filter-topic">
                        <SelectValue placeholder="Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand">Brand Building</SelectItem>
                        <SelectItem value="exec">Executive Engagement</SelectItem>
                        <SelectItem value="industry">Industry-Specific</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="filter-pillar">
                        <SelectValue placeholder="Pillar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand">Brand Visibility</SelectItem>
                        <SelectItem value="pipeline">Pipeline Growth</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                        <SelectItem value="exec">Exec POV</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="filter-industry-pb">
                        <SelectValue placeholder="Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="biotech">Biotech</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Playbook List - 2x2 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {playbooks.map((pb, idx) => {
                      const performanceScore = pb.likelihoodToClose || 75;
                      const scoreColor = performanceScore >= 80 ? 'text-green-600' : performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600';
                      return (
                        <Card key={pb.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-lg flex-1">{pb.name}</h4>
                              <div className="flex flex-col items-end ml-2">
                                <p className="text-xs text-gray-500">Performance</p>
                                <p className={`text-2xl font-bold ${scoreColor}`}>{performanceScore}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{pb.summary}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline">{pb.playType}</Badge>
                              <Badge variant="outline">{pb.pillar}</Badge>
                              <Badge variant="outline">{pb.industry}</Badge>
                              <Badge variant="outline">{pb.tier}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Duration: {pb.duration} days • Channels: {pb.channels.join(', ')}</p>
                            <Select onValueChange={(accountId) => handlePlaybookAssignment(pb.id, accountId)}>
                              <SelectTrigger className="w-full" data-testid={`select-assign-${idx}`}>
                                <SelectValue placeholder="Assign to Account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.filter(a => a.nextPlay).map(a => (
                                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Performance Table - From Playbook Live */}
                  <div className="mt-8">
                    <h4 className="font-semibold mb-4 text-lg">Performance Overview</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 text-sm font-semibold border-b">Play Name</th>
                            <th className="text-left p-3 text-sm font-semibold border-b">Pipeline Value</th>
                            <th className="text-left p-3 text-sm font-semibold border-b">Accounts</th>
                            <th className="text-left p-3 text-sm font-semibold border-b">Status</th>
                            <th className="text-left p-3 text-sm font-semibold border-b">Likelihood</th>
                            <th className="text-left p-3 text-sm font-semibold border-b">Next Review</th>
                            <th className="text-left p-3 text-sm font-semibold border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playbooks.map((pb, idx) => {
                            const pipelineValue = (Math.random() * 500 + 150).toFixed(0);
                            return (
                              <tr key={pb.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <button className="text-purple-700 font-semibold hover:underline">{pb.name}</button>
                                </td>
                                <td className="p-3 text-sm font-semibold">${pipelineValue}K</td>
                                <td className="p-3 text-sm">{pb.assignedAccounts?.length || 0} accounts</td>
                                <td className="p-3">
                                  <Badge variant={pb.status === 'Active' ? 'default' : pb.status === 'Planned' ? 'secondary' : 'outline'}>
                                    {pb.status}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${(pb.likelihoodToClose || 0) >= 70 ? 'bg-green-600' : 'bg-red-600'}`}
                                        style={{ width: `${pb.likelihoodToClose}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold">{pb.likelihoodToClose}%</span>
                                  </div>
                                </td>
                                <td className="p-3 text-sm">{pb.nextReviewDate}</td>
                                <td className="p-3">
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" data-testid={`button-edit-${pb.id}`}>
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" data-testid={`button-pause-${pb.id}`}>
                                      <Pause className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" data-testid={`button-delete-${pb.id}`}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-purple-800">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Reminder: Refresh playbooks routinely — quarterly at least
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ===================== Executive Summary ===================== */}
          {currentStep === 'executive' && (
            <div className="space-y-6">
              {/* Header with Export Options */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold" style={{ color: moduleColor }}>Executive Summary</h3>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive ABM performance report for leadership</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    onClick={() => setShowBudgetRequestDialog(true)}
                    variant="outline"
                    style={{ borderColor: moduleColor }}
                    data-testid="button-request-budget-change-abm"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <DollarSign className="w-4 h-4 mr-2" style={{ color: moduleColor }} />
                    <span className="hidden sm:inline">Request Budget Change</span>
                    <span className="sm:hidden">Budget Change</span>
                  </Button>
                  <Button variant="outline" data-testid="button-export-pdf" className="w-full sm:w-auto text-xs sm:text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" data-testid="button-share" className="w-full sm:w-auto text-xs sm:text-sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Report
                  </Button>
                </div>
              </div>

              {/* Executive Narrative */}
              <Card className="border-2 overflow-hidden" style={{ borderColor: moduleColor }}>
                <CardHeader className="bg-purple-50 rounded-t-none">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Executive Narrative
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-gray-800 leading-relaxed">
                    Our ABM program continues to demonstrate strong momentum across key account segments. This quarter, we've engaged <strong>247 accounts</strong> with <strong>32 active opportunities</strong> totaling <strong>$1.2M in pipeline value</strong>. Marketing and sales alignment remains strong at <strong>89%</strong>, enabling coordinated outreach to high-value targets. Our top 5 hot accounts are showing exceptional engagement scores (avg. 86%), indicating readiness for sales conversations. The program's strategic focus on Healthcare, SaaS, and FinTech verticals is paying off with increased intent signals and content engagement.
                  </p>
                </CardContent>
              </Card>

              {/* Key Metrics Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Total Pipeline</p>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-green-700">$1.2M</p>
                    <p className="text-xs text-green-600 mt-1">+22% vs last quarter</p>
                  </CardContent>
                </Card>
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Active Opps</p>
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-700">32</p>
                    <p className="text-xs text-blue-600 mt-1">+12% growth</p>
                  </CardContent>
                </Card>
                <Card className="border border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Avg Engagement</p>
                      <Activity className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-purple-700">86%</p>
                    <p className="text-xs text-purple-600 mt-1">+8% improvement</p>
                  </CardContent>
                </Card>
                <Card className="border border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Deal Velocity</p>
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-700">42 Days</p>
                    <p className="text-xs text-orange-600 mt-1">3 days faster</p>
                  </CardContent>
                </Card>
              </div>

              {/* Highlights & Lowlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlights */}
                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      Key Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Top Account Breakthrough</p>
                        <p className="text-xs text-gray-600">TechCorp Solutions 1 reached 91% engagement score with 8 key stakeholders actively engaged</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Playbook Performance</p>
                        <p className="text-xs text-gray-600">Executive 1:1 Outreach playbook achieved 85% likelihood to close, exceeding targets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Marketing-Sales Alignment</p>
                        <p className="text-xs text-gray-600">89% alignment score reflects seamless handoffs and coordinated account strategies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Pipeline Acceleration</p>
                        <p className="text-xs text-gray-600">Average deal velocity improved by 3 days, now at 42 days from first touch to close</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lowlights */}
                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <XCircle className="w-5 h-5" />
                      Areas for Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">FinTech Cluster Underperforming</p>
                        <p className="text-xs text-gray-600">FinTech Cluster Campaign showing low engagement (68% likelihood) - needs strategy refresh</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Budget Constraints</p>
                        <p className="text-xs text-gray-600">Executive 1:1 Outreach facing budget concerns that may limit scale in Q4</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Content Engagement Drop</p>
                        <p className="text-xs text-gray-600">8 accounts showing declining content downloads (-12%) - need content strategy review</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Tier 3 Account Coverage</p>
                        <p className="text-xs text-gray-600">Only 12 Tier 3 accounts actively engaged - opportunity to expand reach</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Opportunities & Recommendations */}
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Lightbulb className="w-5 h-5" />
                    Strategic Opportunities & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-sm mb-1">1. Expand Healthcare Vertical Focus</h5>
                    <p className="text-sm text-gray-700 mb-2">Healthcare accounts show 15% higher engagement than other verticals. Recommend increasing targeted plays by 30%.</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">High Impact</Badge>
                      <Badge variant="outline" className="text-xs">Q4 2025</Badge>
                      <Badge variant="outline" className="text-xs">$400K Pipeline Potential</Badge>
                    </div>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-sm mb-1">2. Launch Tier 2 Cluster Campaign</h5>
                    <p className="text-sm text-gray-700 mb-2">18 Tier 2 accounts ready for cluster engagement. Implement industry-specific playbooks for maximum efficiency.</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Medium Impact</Badge>
                      <Badge variant="outline" className="text-xs">Q4 2025</Badge>
                      <Badge variant="outline" className="text-xs">$280K Pipeline Potential</Badge>
                    </div>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-sm mb-1">3. Optimize FinTech Playbook Content</h5>
                    <p className="text-sm text-gray-700 mb-2">Refresh FinTech-specific content with updated ROI calculators and case studies to reverse engagement decline.</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Critical</Badge>
                      <Badge variant="outline" className="text-xs">Immediate</Badge>
                      <Badge variant="outline" className="text-xs">Risk Mitigation</Badge>
                    </div>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-sm mb-1">4. Strengthen C-Suite Engagement</h5>
                    <p className="text-sm text-gray-700 mb-2">Leverage executive POV content and thought leadership to engage 12+ new C-level contacts across hot accounts.</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">High Impact</Badge>
                      <Badge variant="outline" className="text-xs">30-60 Days</Badge>
                      <Badge variant="outline" className="text-xs">Sales Velocity +15%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Performance by Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Tier 1 Accounts</p>
                        <p className="text-xs text-gray-600">12 accounts • $680K pipeline • 88% avg engagement</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-700">⭐⭐⭐</p>
                        <p className="text-xs text-red-600">Excellent</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Tier 2 Accounts</p>
                        <p className="text-xs text-gray-600">18 accounts • $380K pipeline • 76% avg engagement</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-700">⭐⭐</p>
                        <p className="text-xs text-yellow-600">Good</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Tier 3 Accounts</p>
                        <p className="text-xs text-gray-600">12 accounts • $140K pipeline • 65% avg engagement</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-700">⭐</p>
                        <p className="text-xs text-green-600">Developing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps & Action Items */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle style={{ color: moduleColor }}>Next Steps & Action Items</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Immediate (Next 7 Days)</p>
                        <p className="text-xs text-gray-700">Review and optimize FinTech playbook content. Schedule strategy session with content team.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="button-eval-nextstep-1"
                        onClick={() => {
                          toast({
                            title: "Added to Eval Matrix",
                            description: "Action item pushed to Strategy Studio Eval Matrix"
                          });
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Eval
                      </Button>
                    </div>
                    <div className="flex items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Short-term (30 Days)</p>
                        <p className="text-xs text-gray-700">Launch Tier 2 cluster campaign targeting Healthcare and SaaS segments. Allocate additional budget for executive POV content.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="button-eval-nextstep-2"
                        onClick={() => {
                          toast({
                            title: "Added to Eval Matrix",
                            description: "Action item pushed to Strategy Studio Eval Matrix"
                          });
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Eval
                      </Button>
                    </div>
                    <div className="flex items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Medium-term (60-90 Days)</p>
                        <p className="text-xs text-gray-700">Scale successful Healthcare vertical plays. Implement quarterly account review cadence for all Tier 1 accounts.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="button-eval-nextstep-3"
                        onClick={() => {
                          toast({
                            title: "Added to Eval Matrix",
                            description: "Action item pushed to Strategy Studio Eval Matrix"
                          });
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Eval
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Footer */}
              <div className="border-t pt-4 text-center text-xs text-gray-500">
                <p>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="mt-1">Stackwise Strategy Studio • ABM Command Center • Confidential</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <ThreeColumnLayout
        leftNav={null}
        steps={steps}
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step as StepKey)}
        content={
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
              <QuickActions module="PulseHub" />
            </div>
            {renderContent()}
          </div>
        }
        moduleColor={moduleColor}
        completedSteps={[]}
        featureName="ABM Command Center"
      />
      <RequestBudgetChangeDialog
        open={showBudgetRequestDialog}
        onOpenChange={setShowBudgetRequestDialog}
        availableChannels={['ABM Programs', 'LinkedIn Ads', 'Display/Retargeting', 'Events & Sponsorships', 'Executive Outreach', 'Content Marketing']}
        channelBudgets={{
          'ABM Programs': 50000,
          'LinkedIn Ads': 25000,
          'Display/Retargeting': 15000,
          'Events & Sponsorships': 20000,
          'Executive Outreach': 10000,
          'Content Marketing': 12000,
        }}
        recommendationContext="Budget adjustment for ABM program optimization and account-based initiatives"
        sourceFeature="pulse-hub-abm-executive-summary"
      />
    </>
  );
}
