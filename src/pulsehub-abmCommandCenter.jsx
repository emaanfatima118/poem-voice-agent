"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { NavBar } from './components/NavBar';
import Sidebar from './components/pulsehub-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui-replit/card";
import { Badge } from "./components/ui-replit/badge";
import { Button } from "./components/ui-replit/button";
import Input from "./components/ui/inputField";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { ThreeColumnLayout } from "./components/ui-replit/three-column-layout";
import { QuickActions } from "./components/ui-replit/quick-actions";
import { useToast } from "./hooks/use-toast";
import { 
  BarChart3, ArrowUpRight, ArrowDownRight, Target, Filter, 
  ChevronDown, ChevronUp, TrendingUp, Clock, DollarSign, 
  MapPin, Users, Activity, Zap, Eye, MousePointer, 
  FileText, Mail, MessageSquare, Calendar, Building2,
  Sparkles, Globe, Phone, Briefcase, Bell, Play, Pause,
  Edit, Trash2, Plus, Search, GripVertical, AlertCircle,
  Download, Share2, CheckCircle, XCircle, Lightbulb, Award
} from "lucide-react";

export default function ABMCommandCenter() {
  const router = useRouter();
  const [selectedMenuItem, setSelectedMenuItem] = useState('ABM Command Center');
  const [currentStep, setCurrentStep] = useState('overview');
  const [expanded, setExpanded] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTab, setCurrentTab] = useState('nextPlays');
  const [activePlaybook, setActivePlaybook] = useState(null);
  const { toast } = useToast();
  
  const moduleColor = '#6218df';

  // Live ABM data signal (contacts/accounts) fetched from API
  const [abmLive, setAbmLive] = useState({ contacts: 0, accounts: 0 });
  const [liveContacts, setLiveContacts] = useState([]);
  const [liveAccounts, setLiveAccounts] = useState([]);
  const [abmLoading, setAbmLoading] = useState(false);
  const [abmError, setAbmError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [connectorsList, setConnectorsList] = useState([]);
  const [selectedConnectorId, setSelectedConnectorId] = useState('all');
  const [reloadKey, setReloadKey] = useState(0);
  const [accountsSearch, setAccountsSearch] = useState('');
  const [contactsSearch, setContactsSearch] = useState('');
  const [accountsPage, setAccountsPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    // Get authenticated user from localStorage (like other components)
    let uid = null;
    
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          uid = user.userid?.toString();
          
          if (!uid) {
            // User data exists but no userid - redirect to login
            console.warn('Invalid user data in localStorage, redirecting to login');
            router.push('/login');
            return;
          }
        } else {
          // No user data - redirect to login
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Error reading user data:', error);
        router.push('/login');
        return;
      }
      
      // Allow URL override for testing/admin purposes
      const params = new URLSearchParams(window.location.search);
      const urlUserId = params.get('user_id');
      if (urlUserId) {
        uid = urlUserId;
        console.log('Using URL override user_id:', uid);
      }
    }
    
    if (!uid) return;
    setUserId(uid);

    let cancelled = false;
    const fetchConnectors = async () => {
      try {
        const res = await fetch(`/api/connectors?user_id=${encodeURIComponent(uid)}`);
        const json = await res.json().catch(() => ({ connectors: [] }));
        if (!cancelled && Array.isArray(json?.connectors)) {
          // Only include connected connectors for filtering convenience
          const connected = json.connectors.filter((c) => c.is_connected);
          setConnectorsList(connected);
        }
      } catch (_) {
        // Non-blocking; ignore
      }
    };

    const fetchLive = async (connectorId) => {
      try {
        setAbmLoading(true);
        setAbmError(null);

        const connectorQuery = connectorId ? `&connector_id=${encodeURIComponent(connectorId)}` : '';
        const base = `user_id=${encodeURIComponent(uid)}`;
        const [contactsRes, accountsRes] = await Promise.all([
          fetch(`/api/abm/contacts?${base}${connectorQuery}`),
          fetch(`/api/abm/accounts?${base}${connectorQuery}`)
        ]);

        const contactsJson = await contactsRes.json().catch(() => ({ success: false, count: 0, data: [] }));
        const accountsJson = await accountsRes.json().catch(() => ({ success: false, count: 0, data: [] }));

        if (cancelled) return;

        const contacts = contactsJson?.count ?? 0;
        const accounts = accountsJson?.count ?? 0;
        setAbmLive({ contacts, accounts });
        setLiveContacts(Array.isArray(contactsJson?.data) ? contactsJson.data : []);
        setLiveAccounts(Array.isArray(accountsJson?.data) ? accountsJson.data : []);

        // Surface a quick toast so users see live data is wired
        toast({
          title: "ABM Data Loaded",
          description: `Contacts: ${contacts} • Accounts: ${accounts}`
        });
      } catch (err) {
        if (!cancelled) {
          setAbmError(err instanceof Error ? err.message : 'Failed to load ABM data');
        }
      } finally {
        if (!cancelled) setAbmLoading(false);
      }
    };

    fetchConnectors();
    fetchLive((selectedConnectorId && selectedConnectorId !== 'all') ? selectedConnectorId : undefined);
    return () => { cancelled = true; };
  }, [toast, router]);

  // Refetch when connector filter changes
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const run = async () => {
      try {
        setAbmLoading(true);
        const connectorQuery = (selectedConnectorId && selectedConnectorId !== 'all') ? `&connector_id=${encodeURIComponent(selectedConnectorId)}` : '';
        const [contactsRes, accountsRes] = await Promise.all([
          fetch(`/api/abm/contacts?user_id=${encodeURIComponent(userId)}${connectorQuery}`),
          fetch(`/api/abm/accounts?user_id=${encodeURIComponent(userId)}${connectorQuery}`)
        ]);
        const contactsJson = await contactsRes.json().catch(() => ({ success: false, count: 0, data: [] }));
        const accountsJson = await accountsRes.json().catch(() => ({ success: false, count: 0, data: [] }));
        if (cancelled) return;
        setAbmLive({ contacts: contactsJson?.count ?? 0, accounts: accountsJson?.count ?? 0 });
        setLiveContacts(Array.isArray(contactsJson?.data) ? contactsJson.data : []);
        setLiveAccounts(Array.isArray(accountsJson?.data) ? accountsJson.data : []);
      } catch (err) {
        if (!cancelled) setAbmError(err instanceof Error ? err.message : 'Failed to load ABM data');
      } finally {
        if (!cancelled) setAbmLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [userId, selectedConnectorId, reloadKey]);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const steps = [
    { id: 'overview', label: 'Account Intelligence Overview', description: 'High-level metrics and KPIs' },
    { id: 'hot5', label: 'Hot 5', description: 'Top priority accounts' },
    { id: 'engagement', label: 'Account Engagement', description: 'Real-time engagement data' },
    { id: 'playbooks', label: 'ABM Playbooks', description: 'Playbook management' },
    { id: 'executive', label: 'Executive Summary', description: 'Leadership report' }
  ];

  const [accounts, setAccounts] = useState(
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
      nextPlay: i < 5 ? (i % 3 === 0 ? '1:1' : i % 3 === 1 ? 'Cluster' : 'Awareness') : null,
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
      nextPlay: null,
      detailInfo: `Engaged with ${3 + (i % 5)} pieces of content in last 30 days. Strong signals from C-suite.`
    }))
  );

  // Map of next play selections for live accounts keyed by external_id
  const [nextPlayMap, setNextPlayMap] = useState({});
  const hasLiveAccounts = (liveAccounts || []).length > 0;
  const hasLiveContacts = (liveContacts || []).length > 0;

  const setLiveNextPlay = (externalId, value) => {
    setNextPlayMap(prev => ({ ...prev, [externalId]: value }));
    toast({
      title: "Next Play Assigned",
      description: `Account assigned to ${value} play`
    });
  };

  const getConnectorName = (id) => {
    const match = connectorsList.find((c) => c.connector_id === id);
    return match?.display_name || (id ? `#${id}` : '—');
  };

  // Derived filtered/paged lists for Overview tables
  const accountsFiltered = (liveAccounts || []).filter((a) => {
    if (!accountsSearch) return true;
    const q = accountsSearch.toLowerCase();
    const hay = [a.account_name, a.domain, a.website, a.industry, a.owner_name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
  const accountsTotalPages = Math.max(1, Math.ceil(accountsFiltered.length / PAGE_SIZE));
  const accountsPageSafe = Math.min(accountsPage, accountsTotalPages);
  const accountsPaged = accountsFiltered.slice((accountsPageSafe - 1) * PAGE_SIZE, accountsPageSafe * PAGE_SIZE);

  const contactsFiltered = (liveContacts || []).filter((c) => {
    if (!contactsSearch) return true;
    const q = contactsSearch.toLowerCase();
    const name = (c.full_name || [c.first_name, c.last_name].filter(Boolean).join(' ')).toLowerCase();
    const hay = [name, c.email, c.company, c.job_title].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  });
  const contactsTotalPages = Math.max(1, Math.ceil(contactsFiltered.length / PAGE_SIZE));
  const contactsPageSafe = Math.min(contactsPage, contactsTotalPages);
  const contactsPaged = contactsFiltered.slice((contactsPageSafe - 1) * PAGE_SIZE, contactsPageSafe * PAGE_SIZE);

  const [playbooks, setPlaybooks] = useState([
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

  const handleNextPlaySelect = (accountId, playType) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, nextPlay: playType } : acc
    ));
    toast({
      title: "Next Play Assigned",
      description: `Account assigned to ${playType} play`
    });
  };

  const handleEngagementNextPlaySelect = (accountId, playType) => {
    setEngagementAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, nextPlay: playType } : acc
    ));
    toast({
      title: "Next Play Assigned",
      description: `Account assigned to ${playType} play`
    });
  };

  const handleAlertSales = (account) => {
    toast({
      title: "Sales Alert Sent",
      description: `Alert sent for ${account.name} with sales direction and context`
    });
  };

  const handleDragStart = (event) => {
    const playbookId = event.active.id;
    const playbook = playbooks.find(pb => pb.id === playbookId);
    if (playbook) {
      setActivePlaybook(playbook);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActivePlaybook(null);

    if (over && active.id !== over.id) {
      const playbookId = active.id;
      const accountId = over.id;
      
      const account = accounts.find(a => a.id === accountId);
      if (account) {
        toast({
          title: "Playbook Assigned",
          description: `Playbook assigned to ${account.name}`
        });
      }
    }
  };

  const getTrend = (i) => (i % 2 === 0 ? "up" : "down");

  // Draggable Playbook Component
  const DraggablePlaybook = ({ playbook }) => {
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
  const DroppableAccountZone = ({ account }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: account.id,
    });

    return (
      <div 
        ref={setNodeRef}
        className={`border rounded-lg p-3 transition-all ${
          isOver 
            ? 'bg-purple-100 border-purple-400 border-2' 
            : 'bg-purple-50 border-purple-200'
        }`}
      >
        <p className="font-semibold text-sm text-gray-900">{account.name}</p>
        <p className="text-xs text-gray-600">Industry: {account.industry} • Tier {account.tier}</p>
      </div>
    );
  };

  const leftNav = (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-bold" style={{ color: moduleColor }}>
        Pulse Hub
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground mt-1">ABM Command Center</p>
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

  const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="bg-white px-4 md:px-8 py-4 border-b border-purple-100 sticky top-0 z-10">
          <h1 className="text-xl md:text-3xl font-bold mb-2" style={{ color: moduleColor }}>ABM Command Center</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl">
            Centralize account insights, engagement signals, and market intelligence to align marketing and sales on the accounts that matter most.
          </p>
        </div>

        <div className="p-4 md:p-8">
          {/* ===================== Account Intelligence Overview ===================== */}
          {currentStep === 'overview' && (
            <div className="space-y-8">
              <Card className="p-6 border border-gray-200">
                <CardContent className="space-y-8">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2">
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

                  {/* Live CRM Data from connectors */}
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Live CRM Data</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <div className="text-xs md:text-sm text-gray-600">
                          {abmLoading ? 'Loading…' : abmError ? `Error: ${abmError}` : `Contacts: ${abmLive.contacts} • Accounts: ${abmLive.accounts}`}
                        </div>
                        {userId && connectorsList.length > 0 && (
                          <>
                            <Select value={selectedConnectorId} onValueChange={(v) => setSelectedConnectorId(v)}>
                              <SelectTrigger className="w-[180px]" data-testid="filter-connector">
                                <SelectValue placeholder="All Connectors" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Connectors</SelectItem>
                                {connectorsList.map((c) => (
                                  <SelectItem key={c.connector_id} value={String(c.connector_id)}>
                                    {c.display_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReloadKey((k) => k + 1)}
                              data-testid="button-refresh-live"
                            >
                              Refresh
                            </Button>
                          </>
                        )}
                        {userId && connectorsList.length === 0 && !abmLoading && (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-gray-700">No CRM connectors active.</span>
                            <Link href="/integrations" className="text-purple-600 hover:text-purple-700 underline">
                              Connect your CRM
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Live Accounts */}
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <CardTitle className="text-sm md:text-base text-gray-900">Live Accounts</CardTitle>
                            <div className="flex items-center gap-2">
                              <Input
                                value={accountsSearch}
                                onChange={(e) => { setAccountsSearch(e.target.value); setAccountsPage(1); }}
                                placeholder="Search accounts…"
                                className="h-8 w-[200px]"
                                data-testid="search-accounts"
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs md:text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-2 md:p-3">Account</th>
                                  <th className="p-2 md:p-3">Industry</th>
                                  <th className="p-2 md:p-3">Domain</th>
                                  <th className="p-2 md:p-3">Owner</th>
                                  <th className="p-2 md:p-3">Source</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(accountsPaged || []).map((a, i) => (
                                  <tr key={`${a.external_id || i}-${i}`} className="border-b hover:bg-gray-50">
                                    <td className="p-2 md:p-3 font-medium text-gray-900">{a.account_name || a.website || a.external_id}</td>
                                    <td className="p-2 md:p-3 text-gray-700">{a.industry || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">{a.domain || a.website || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">{a.owner_name || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">
                                      <Badge variant="outline">{getConnectorName(a.connector_id)}</Badge>
                                    </td>
                                  </tr>
                                ))}
                                {(!abmLoading && (accountsFiltered || []).length === 0) && (
                                  <tr>
                                    <td colSpan={4} className="p-3 text-gray-500 italic">No accounts yet.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2">
                            <p className="text-xs text-gray-600">Page {accountsPageSafe} of {accountsTotalPages} • {accountsFiltered.length} results</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" disabled={accountsPageSafe <= 1} onClick={() => setAccountsPage((p) => Math.max(1, p - 1))}>Prev</Button>
                              <Button size="sm" variant="outline" disabled={accountsPageSafe >= accountsTotalPages} onClick={() => setAccountsPage((p) => Math.min(accountsTotalPages, p + 1))}>Next</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Live Contacts */}
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <CardTitle className="text-sm md:text-base text-gray-900">Live Contacts</CardTitle>
                            <div className="flex items-center gap-2">
                              <Input
                                value={contactsSearch}
                                onChange={(e) => { setContactsSearch(e.target.value); setContactsPage(1); }}
                                placeholder="Search contacts…"
                                className="h-8 w-[200px]"
                                data-testid="search-contacts"
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs md:text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-2 md:p-3">Name</th>
                                  <th className="p-2 md:p-3">Email</th>
                                  <th className="p-2 md:p-3">Company</th>
                                  <th className="p-2 md:p-3">Title</th>
                                  <th className="p-2 md:p-3">Source</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(contactsPaged || []).map((c, i) => (
                                  <tr key={`${c.external_id || i}-${i}`} className="border-b hover:bg-gray-50">
                                    <td className="p-2 md:p-3 font-medium text-gray-900">{c.full_name || [c.first_name, c.last_name].filter(Boolean).join(' ') || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">{c.email || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">{c.company || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">{c.job_title || '—'}</td>
                                    <td className="p-2 md:p-3 text-gray-700">
                                      <Badge variant="outline">{getConnectorName(c.connector_id)}</Badge>
                                    </td>
                                  </tr>
                                ))}
                                {(!abmLoading && (contactsFiltered || []).length === 0) && (
                                  <tr>
                                    <td colSpan={4} className="p-3 text-gray-500 italic">No contacts yet.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2">
                            <p className="text-xs text-gray-600">Page {contactsPageSafe} of {contactsTotalPages} • {contactsFiltered.length} results</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" disabled={contactsPageSafe <= 1} onClick={() => setContactsPage((p) => Math.max(1, p - 1))}>Prev</Button>
                              <Button size="sm" variant="outline" disabled={contactsPageSafe >= contactsTotalPages} onClick={() => setContactsPage((p) => Math.min(contactsTotalPages, p + 1))}>Next</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
                            <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          </div>
                          <h3 className="text-2xl font-bold mt-2 text-gray-900">
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
                    <h4 className="font-semibold text-gray-900">Marketing & Sales Alignment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
                        <MapPin className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                        <h5 className="text-base font-bold text-gray-900">Active Opportunities</h5>
                        <p className="text-2xl font-semibold text-purple-700 mt-1">32</p>
                      </div>
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                        <TrendingUp className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                        <h5 className="text-base font-bold text-gray-900">Marketing-Sourced Pipeline</h5>
                        <p className="text-2xl font-semibold text-blue-700 mt-1">$1.1M</p>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                        <Users className="w-5 h-5 mx-auto mb-2 text-green-600" />
                        <h5 className="text-base font-bold text-gray-900">Accounts in Sync</h5>
                        <p className="text-2xl font-semibold text-green-700 mt-1">89%</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* Funnel */}
                  <h4 className="font-semibold mb-3 text-gray-900">Funnel by Stage</h4>
                  <div className="flex flex-wrap justify-between gap-2 md:gap-3">
                    {[
                      { label: "Non-Aware", val: 60 },
                      { label: "Aware", val: 50 },
                      { label: "Engaged", val: 40 },
                      { label: "Opportunity", val: 32, amt: "$420K" },
                      { label: "Converted", val: 18, amt: "$230K" },
                      { label: "Velocity", val: 12, amt: "$150K" },
                    ].map((s, i) => (
                      <div key={i} className="flex-1 min-w-[80px] text-center border border-gray-200 p-2 md:p-3 rounded-md">
                        <p className="text-xs md:text-sm font-medium text-gray-700">{s.label}</p>
                        <p className="font-bold text-base md:text-lg text-gray-900">{s.val}</p>
                        {s.amt && <p className="text-xs text-gray-700">{s.amt}</p>}
                      </div>
                    ))}
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* Opportunities Snapshot */}
                  <h4 className="font-semibold mb-2 text-gray-900">Opportunities Pipeline Snapshot</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center"><h4 className="text-2xl font-bold text-green-600">12</h4><p className="text-sm text-gray-700">Prospecting ($420K)</p></div>
                    <div className="text-center"><h4 className="text-2xl font-bold text-blue-600">9</h4><p className="text-sm text-gray-700">Qualification ($290K)</p></div>
                    <div className="text-center"><h4 className="text-2xl font-bold text-purple-600">7</h4><p className="text-sm text-gray-700">Proposal ($320K)</p></div>
                    <div className="text-center"><h4 className="text-2xl font-bold text-gray-700">5</h4><p className="text-sm text-gray-700">Closed-Won ($230K)</p></div>
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* Industry Trends */}
                  <h4 className="font-semibold mb-2 text-gray-900">Industry Trends by Region</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><p className="text-gray-700 font-semibold text-sm">North America</p><ul className="text-sm mt-2 space-y-1"><li className="text-gray-700">Healthcare Tech ↑</li><li className="text-gray-700">FinServ SaaS ↑</li><li className="text-gray-700">Manufacturing →</li></ul></div>
                    <div><p className="text-gray-700 font-semibold text-sm">Europe</p><ul className="text-sm mt-2 space-y-1"><li className="text-gray-700">Green Energy ↑</li><li className="text-gray-700">Data Privacy ↓</li><li className="text-gray-700">Automation ↑</li></ul></div>
                    <div><p className="text-gray-700 font-semibold text-sm">APAC</p><ul className="text-sm mt-2 space-y-1"><li className="text-gray-700">AI Tools ↑</li><li className="text-gray-700">FinTech ↑</li><li className="text-gray-700">Cloud Security ↓</li></ul></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===================== Hot 5 ===================== */}
          {currentStep === 'hot5' && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Top 5 Hot Accounts</h3>
              <div className="space-y-4">
                {hasLiveAccounts ? (
                  [...liveAccounts]
                    .sort((a, b) => new Date(b.modified_date || b.last_synced_at || b.created_at || 0) - new Date(a.modified_date || a.last_synced_at || a.created_at || 0))
                    .slice(0, 5)
                    .map((acct, idx) => {
                      const isOpen = expanded === idx;
                      const contactsForAccount = hasLiveContacts ? liveContacts.filter(c => c.account_id && acct.external_id && c.account_id === acct.external_id).slice(0, 3) : [];
                      return (
                        <Card key={acct.external_id || idx} className="border border-purple-100 shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div className="flex-1 cursor-pointer" onClick={() => setExpanded(isOpen ? null : idx)}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-lg font-bold" style={{ color: moduleColor }}>{acct.account_name || acct.website || acct.domain || 'Account'}</h4>
                                    <p className="text-xs text-gray-700">{acct.industry || 'Industry —'} {acct.domain ? `• ${acct.domain}` : ''} {acct.billing_country ? `• ${acct.billing_country}` : ''}</p>
                                  </div>
                                  {isOpen ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: moduleColor }} /> : <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: moduleColor }} />}
                                </div>
                              </div>
                              <div className="ml-2 md:ml-4">
                                <Select value={nextPlayMap[acct.external_id] || ''} onValueChange={(value) => setLiveNextPlay(acct.external_id, value)}>
                                  <SelectTrigger className="w-[120px] md:w-[150px]" borderColor={moduleColor} data-testid={`select-nextplay-live-${idx}`}>
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

                            {/* Compact summary using real fields */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center border-t pt-4 mt-4">
                              <div><h3 className="text-sm md:text-base font-semibold text-gray-900">{acct.industry || '—'}</h3><p className="text-xs md:text-sm text-gray-700">Industry</p></div>
                              <div><h3 className="text-sm md:text-base font-semibold text-gray-900">{acct.owner_name || '—'}</h3><p className="text-xs md:text-sm text-gray-700">Owner</p></div>
                              <div><h3 className="text-sm md:text-base font-semibold text-gray-900">{acct.employee_count ?? '—'}</h3><p className="text-xs md:text-sm text-gray-700">Employees</p></div>
                              <div><h3 className="text-sm md:text-base font-semibold text-gray-900">{contactsForAccount.length}</h3><p className="text-xs md:text-sm text-gray-700">Contacts</p></div>
                            </div>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="space-y-6 mt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-purple-50 border-none">
                                      <CardContent>
                                        <h4 className="font-semibold mb-2 text-gray-900">Company Details</h4>
                                        <p className="text-sm text-gray-700">Website: {acct.website || '—'}</p>
                                        <p className="text-sm text-gray-700">Domain: {acct.domain || '—'}</p>
                                        <p className="text-sm text-gray-700">Location: {[acct.billing_city, acct.billing_state, acct.billing_country].filter(Boolean).join(', ') || '—'}</p>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-green-50 border-none">
                                      <CardContent>
                                        <h4 className="font-semibold mb-2 text-gray-900">Owner & Revenue</h4>
                                        <p className="text-sm text-gray-700">Owner: {acct.owner_name || '—'}</p>
                                        <p className="text-sm text-gray-700">Revenue: {acct.annual_revenue != null ? `$${acct.annual_revenue}` : '—'}</p>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="border border-gray-100">
                                      <CardContent>
                                        <h4 className="font-semibold mb-2 text-gray-900">Key Contacts</h4>
                                        {contactsForAccount.length > 0 ? contactsForAccount.map((c, i) => (
                                          <div key={i} className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-gray-700">{c.full_name || [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email || '—'}</p>
                                            {c.email && <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                                          </div>
                                        )) : <p className="text-sm text-gray-700">No linked contacts</p>}
                                      </CardContent>
                                    </Card>
                                    <Card className="border border-gray-100">
                                      <CardContent>
                                        <h4 className="font-semibold mb-2 text-gray-900">Notes</h4>
                                        <p className="text-sm text-gray-700">Last synced: {new Date(acct.last_synced_at || acct.modified_date || acct.created_at || Date.now()).toLocaleString()}</p>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className="bg-red-50 border border-red-100 rounded-md p-4 flex justify-between items-center">
                                    <div>
                                      <h5 className="font-bold text-red-600">Sales Direction</h5>
                                      <p className="text-xs text-gray-700 mt-1">Prioritize outreach for this account. Align SDR + AE with relevant case study.</p>
                                    </div>
                                    <Button 
                                      onClick={() => handleAlertSales({ name: acct.account_name || acct.domain || 'Account' })}
                                      style={{ backgroundColor: '#16a34a', color: 'white' }}
                                      className="hover:opacity-90"
                                      data-testid={`button-alert-sales-live-${idx}`}
                                    >
                                      <Bell className="w-4 h-4 mr-2 flex-shrink-0" />
                                      Alert Sales
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardContent>
                        </Card>
                      );
                    })
                ) : (
                  accounts.map((acct, idx) => {
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
                                <p className="text-xs text-gray-700">Industry: {acct.industry} • Size: {acct.size} • HQ: {acct.hq} • Tier {acct.tier}</p>
                              </div>
                              {isOpen ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: moduleColor }} /> : <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: moduleColor }} />}
                            </div>
                          </div>
                          <div className="ml-2 md:ml-4">
                            <Select value={acct.nextPlay || ''} onValueChange={(value) => handleNextPlaySelect(acct.id, value)}>
                              <SelectTrigger 
                                className="w-[120px] md:w-[150px]" 
                                borderColor={moduleColor}
                                data-testid={`select-nextplay-${idx}`}
                              >
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center border-t pt-4 mt-4">
                          <div><h3 className="text-xl md:text-2xl font-bold text-red-600">{acct.intent}</h3><p className="text-xs md:text-sm text-gray-700">Intent</p></div>
                          <div><h3 className="text-xl md:text-2xl font-bold text-blue-600">{acct.engagement}</h3><p className="text-xs md:text-sm text-gray-700">Engagement</p></div>
                          <div><h3 className="text-xl md:text-2xl font-bold text-green-600">{acct.fit}</h3><p className="text-xs md:text-sm text-gray-700">Fit</p></div>
                          <div><h3 className="text-xl md:text-2xl font-bold text-purple-600">{acct.touches}</h3><p className="text-xs md:text-sm text-gray-700">Touches</p></div>
                        </div>

                        {/* collapsible detail */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="space-y-6 mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-purple-50 border-none">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2 text-gray-900">Website Engagement</h4>
                                    <p className="text-sm text-gray-700">Pages Visited: {acct.pages.join(", ")}</p>
                                    <p className="text-sm text-gray-700">Unique Visitors: {acct.uniqueVisitors}</p>
                                    <p className="text-sm text-gray-700">Top Referrer: LinkedIn</p>
                                  </CardContent>
                                </Card>
                                <Card className="bg-green-50 border-none">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2 text-gray-900">Content & Email Activity</h4>
                                    <p className="text-sm text-gray-700">Top Content: {acct.content.join(", ")}</p>
                                    <p className="text-sm text-gray-700">Avg Intent Score: {acct.avgIntent}</p>
                                    <p className="text-sm text-gray-700">Engagement Rate: {Math.min(98, Math.round((acct.engagement / 100) * 72 + 18))}%</p>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border border-gray-100">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2 text-gray-900">Key Contacts</h4>
                                    {acct.contacts.map((c, i) => (
                                      <div key={i} className="flex items-center gap-2 mb-1">
                                        <p className="text-sm text-gray-700">{c.name}</p>
                                        {c.email && <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                                <Card className="border border-gray-100">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2 text-gray-900">Locations</h4>
                                    {acct.locations.map((l, i) => (
                                      <p key={i} className="text-sm text-gray-700">{l}</p>
                                    ))}
                                  </CardContent>
                                </Card>
                                <Card className="border border-gray-100">
                                  <CardContent>
                                    <h4 className="font-semibold mb-2 text-gray-900">Tech Stack & Budget</h4>
                                    <p className="text-sm text-gray-700">{acct.tech.join(", ")}</p>
                                    <p className="text-sm mt-1 text-gray-700">Budget: {acct.budget}</p>
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
                                  style={{ backgroundColor: '#16a34a', color: 'white' }}
                                  className="hover:opacity-90"
                                  data-testid={`button-alert-sales-${idx}`}
                                >
                                  <Bell className="w-4 h-4 mr-2 flex-shrink-0" />
                                  Alert Sales
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  );
                })
                )}
              </div>
            </div>
          )}

          {/* ===================== Account Engagement ===================== */}
          {currentStep === 'engagement' && (
            <div className="space-y-4 md:space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <Filter className="w-4 h-4 flex-shrink-0" style={{ color: moduleColor }} />
                  <select className="border border-gray-300 text-xs md:text-sm rounded-md p-1.5 md:p-1" data-testid="filter-tier">
                    <option>All Tiers</option>
                    <option>Tier 1</option>
                    <option>Tier 2</option>
                    <option>Tier 3</option>
                  </select>
                  <select className="border border-gray-300 text-xs md:text-sm rounded-md p-1.5 md:p-1" data-testid="filter-industry">
                    <option>All Industries</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                  </select>
                  <select className="border border-gray-300 text-xs md:text-sm rounded-md p-1.5 md:p-1" data-testid="filter-intent">
                    <option>All Intent Scores</option>
                    <option>Above 80</option>
                    <option>60-80</option>
                    <option>Below 60</option>
                  </select>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(hasLiveAccounts ? liveAccounts : engagementAccounts).map((acct, i) => {
                  if (hasLiveAccounts) {
                    const contactsForAccount = hasLiveContacts ? liveContacts.filter(c => c.account_id && acct.external_id && c.account_id === acct.external_id) : [];
                    const nextPlayVal = nextPlayMap[acct.external_id] || '';
                    return (
                      <motion.div
                        key={acct.external_id || i}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.25 }}
                        className={`border-2 rounded-lg p-4 bg-white shadow-sm relative border-blue-300`}
                        data-testid={`card-engagement-live-${i}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold" style={{ color: moduleColor }}>{acct.account_name || acct.website || acct.domain || 'Account'}</h4>
                            <p className="text-sm font-medium text-gray-700 mt-1">{acct.industry || '—'}</p>
                          </div>
                          <Select value={nextPlayVal} onValueChange={(value) => setLiveNextPlay(acct.external_id, value)}>
                            <SelectTrigger 
                              className="w-[120px] md:w-[150px]" 
                              borderColor={moduleColor}
                              data-testid={`select-engagement-nextplay-live-${i}`}
                            >
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
                      </motion.div>
                    );
                  }
                  const isUp = acct.trend === "up";
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className={`border-2 rounded-lg p-4 bg-white shadow-sm relative ${isUp ? 'border-green-400' : 'border-red-400'}`}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                      data-testid={`card-engagement-${i}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold" style={{ color: moduleColor }}>{acct.name}</h4>
                          <p className="text-sm font-medium text-gray-700 mt-1">Tier: Tier {acct.tier}</p>
                        </div>
                        <Select value={acct.nextPlay || ''} onValueChange={(value) => handleEngagementNextPlaySelect(acct.id, value)}>
                          <SelectTrigger 
                            className="w-[120px] md:w-[150px]" 
                            borderColor={moduleColor}
                            data-testid={`select-engagement-nextplay-${i}`}
                          >
                            <SelectValue placeholder="Next Play" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1:1">1:1</SelectItem>
                            <SelectItem value="Cluster">Cluster</SelectItem>
                            <SelectItem value="Awareness">Awareness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-gray-900 mt-1 font-medium">Intent Score: {acct.intentScore}</p>
                      <hr className="border-t border-gray-200 my-2" />
                      <p className="text-xs text-gray-700">Contacts in CRM: {acct.contactsInCRM}</p>
                      <p className="text-xs text-gray-700">Top Campaign: {acct.topCampaign}</p>
                      <p className="text-xs text-gray-700">Key Content: {acct.keyContent}</p>
                      <hr className="border-t border-gray-200 my-2" />
                      <div className={`flex items-center text-xs mt-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                        {isUp ? <ArrowUpRight className='w-3 h-3 mr-1'/> : <ArrowDownRight className='w-3 h-3 mr-1'/>}
                        {acct.trendValue}
                      </div>

                      {/* Hover popup */}
                      <AnimatePresence>
                        {hoveredCard === i && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border-2 border-purple-200 rounded-lg shadow-lg z-50"
                          >
                            <p className="text-xs font-semibold mb-1" style={{ color: moduleColor }}>More Context</p>
                            <p className="text-xs text-gray-700">{acct.detailInfo}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== ABM Playbooks ===================== */}
          {currentStep === 'playbooks' && (
            <div className="space-y-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="nextPlays" data-testid="tab-nextplays">Next Plays</TabsTrigger>
                  <TabsTrigger value="playbooks" data-testid="tab-playbooks">Playbooks</TabsTrigger>
                  <TabsTrigger value="playbookLive" data-testid="tab-playbook-live">Playbook Live</TabsTrigger>
                </TabsList>

                {/* Next Plays Tab */}
                <TabsContent value="nextPlays" className="space-y-6">
                  <p className="text-sm text-gray-700">Accounts assigned to Next Plays. Drag playbooks onto accounts to activate.</p>
                  
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                      {/* Left Side (1/3) - Accounts Grouped by Play Type */}
                      <div className="w-full lg:w-1/3 space-y-4">
                        {/* 1:1 Section */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base text-gray-900">1:1 Plays</CardTitle>
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
                            <CardTitle className="text-base text-gray-900">Cluster Plays</CardTitle>
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
                            <CardTitle className="text-base text-gray-900">Awareness Plays</CardTitle>
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

                      {/* Right Side (2/3) - Top Playbooks */}
                      <div className="w-full lg:w-2/3">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-gray-900">Top Playbooks</CardTitle>
                            <p className="text-sm text-gray-700">Drag playbooks to accounts on the left to assign</p>
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

                {/* Playbooks Tab */}
                <TabsContent value="playbooks" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="text-base md:text-lg font-semibold">Search Playbooks</h3>
                    <Button data-testid="button-create-playbook" style={{ backgroundColor: moduleColor, color: 'white' }} className="hover:opacity-90">
                      <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                      Create Playbook
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Select>
                      <SelectTrigger data-testid="filter-playtype">
                        <SelectValue placeholder="Play Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="Cluster">Cluster</SelectItem>
                        <SelectItem value="Awareness">Awareness</SelectItem>
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
                    <Select>
                      <SelectTrigger data-testid="filter-persona">
                        <SelectValue placeholder="Persona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vp">VP Marketing</SelectItem>
                        <SelectItem value="cmo">CMO</SelectItem>
                        <SelectItem value="director">Director of Growth</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger data-testid="filter-tiers">
                        <SelectValue placeholder="Tiers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tier1">Tier 1</SelectItem>
                        <SelectItem value="tier2">Tier 2</SelectItem>
                        <SelectItem value="tier3">Tier 3</SelectItem>
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
                            <p className="text-sm text-gray-700 mb-3">{pb.summary}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline">{pb.playType}</Badge>
                              <Badge variant="outline">{pb.pillar}</Badge>
                              <Badge variant="outline">{pb.industry}</Badge>
                              <Badge variant="outline">{pb.tier}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Duration: {pb.duration} days • Channels: {pb.channels.join(', ')}</p>
                            <Select>
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

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
                      <p className="text-sm text-purple-800">
                        <Sparkles className="w-4 h-4 inline mr-2 flex-shrink-0" />
                        Reminder: Refresh playbooks routinely — quarterly at least
                      </p>
                  </div>
                </TabsContent>

                {/* Playbook Live Tab */}
                <TabsContent value="playbookLive" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="text-base md:text-lg font-semibold">Operations & Momentum Dashboard</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" data-testid="filter-active">Active</Button>
                      <Button variant="outline" size="sm" data-testid="filter-paused">Paused</Button>
                      <Button variant="outline" size="sm" data-testid="filter-atrisk">At Risk</Button>
                    </div>
                  </div>

                  {/* At Risk Section - Moved to Top */}
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-yellow-800">At Risk Playbooks</h5>
                          <p className="text-sm text-yellow-700 mt-1">2 playbooks flagged: Low engagement detected in "FinTech Cluster Campaign" and budget concerns in "Executive 1:1 Outreach"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Split View: Best Performing (Left) vs At Risk (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Best Performing */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Best Performing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {playbooks
                          .filter(pb => (pb.likelihoodToClose || 0) >= 70)
                          .sort((a, b) => (b.likelihoodToClose || 0) - (a.likelihoodToClose || 0))
                          .map(pb => (
                            <Card key={pb.id} className="border border-green-200 bg-green-50">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-sm">{pb.name}</h5>
                                  <Badge className="bg-green-600">{pb.likelihoodToClose}%</Badge>
                                </div>
                                <p className="text-xs text-gray-600">Pipeline: ${(Math.random() * 500 + 200).toFixed(0)}K</p>
                                <p className="text-xs text-gray-600">Status: {pb.status} • Owner: {pb.owner}</p>
                                <div className="flex gap-1 mt-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </CardContent>
                    </Card>

                    {/* Right Side - At Risk */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          At Risk
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {playbooks
                          .filter(pb => (pb.likelihoodToClose || 0) < 70)
                          .map(pb => (
                            <Card key={pb.id} className="border border-red-200 bg-red-50">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-sm">{pb.name}</h5>
                                  <Badge variant="destructive">{pb.likelihoodToClose}%</Badge>
                                </div>
                                <p className="text-xs text-gray-600">Pipeline: ${(Math.random() * 300 + 100).toFixed(0)}K</p>
                                <p className="text-xs text-gray-600">Status: {pb.status} • Owner: {pb.owner}</p>
                                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ Low engagement detected</p>
                                <div className="flex gap-1 mt-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Full Table View */}
                  <div className="overflow-x-auto">
                    <h4 className="font-semibold mb-3 text-sm md:text-base">All Playbooks</h4>
                    <table className="w-full border border-gray-200 min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Play Name</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Pipeline Value</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Accounts</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Status</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Likelihood</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Next Review</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Owner</th>
                          <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playbooks.map((pb, idx) => {
                          const pipelineValue = (Math.random() * 500 + 150).toFixed(0);
                          return (
                            <tr key={pb.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 md:p-3">
                                <button className="text-purple-700 font-semibold hover:underline text-xs md:text-sm">{pb.name}</button>
                              </td>
                              <td className="p-2 md:p-3 text-xs md:text-sm font-semibold">${pipelineValue}K</td>
                              <td className="p-2 md:p-3 text-xs md:text-sm">{pb.assignedAccounts?.length || 0} accounts</td>
                              <td className="p-2 md:p-3">
                                <Badge variant={pb.status === 'Active' ? 'default' : pb.status === 'Planned' ? 'secondary' : 'outline'}>
                                  {pb.status}
                                </Badge>
                              </td>
                              <td className="p-2 md:p-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${(pb.likelihoodToClose || 0) >= 70 ? 'bg-green-600' : 'bg-red-600'}`}
                                      style={{ width: `${pb.likelihoodToClose}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold">{pb.likelihoodToClose}%</span>
                                </div>
                              </td>
                              <td className="p-2 md:p-3 text-xs md:text-sm">{pb.nextReviewDate}</td>
                              <td className="p-2 md:p-3 text-xs md:text-sm">{pb.owner}</td>
                              <td className="p-2 md:p-3">
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" data-testid={`button-edit-${pb.id}`}>
                                    <Edit className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                  <Button variant="ghost" size="sm" data-testid={`button-pause-${pb.id}`}>
                                    <Pause className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                  <Button variant="ghost" size="sm" data-testid={`button-delete-${pb.id}`}>
                                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ===================== Executive Summary ===================== */}
          {currentStep === 'executive' && (
            <div className="space-y-6">
              {/* Header with Export Options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold" style={{ color: moduleColor }}>Executive Summary</h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">Comprehensive ABM performance report for leadership</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" data-testid="button-export-pdf" className="text-xs md:text-sm">
                    <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                    Export PDF
                  </Button>
                  <Button variant="outline" data-testid="button-share" className="text-xs md:text-sm">
                    <Share2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    Share Report
                  </Button>
                </div>
              </div>

              {/* Executive Narrative */}
              <Card className="border-2" style={{ borderColor: moduleColor }}>
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    Executive Narrative
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
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
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-2xl font-bold text-green-700">$1.2M</p>
                    <p className="text-xs text-green-600 mt-1">+22% vs last quarter</p>
                  </CardContent>
                </Card>
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Active Opps</p>
                      <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700">32</p>
                    <p className="text-xs text-blue-600 mt-1">+12% growth</p>
                  </CardContent>
                </Card>
                <Card className="border border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Avg Engagement</p>
                      <Activity className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700">86%</p>
                    <p className="text-xs text-purple-600 mt-1">+8% improvement</p>
                  </CardContent>
                </Card>
                <Card className="border border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Deal Velocity</p>
                      <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
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
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
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
                      <XCircle className="w-5 h-5 flex-shrink-0" />
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
                    <Lightbulb className="w-5 h-5 flex-shrink-0" />
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
                  <CardTitle className="text-gray-900">Account Performance by Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm md:text-base">Tier 1 Accounts</p>
                        <p className="text-xs text-gray-600">12 accounts • $680K pipeline • 88% avg engagement</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl md:text-2xl font-bold text-red-700">⭐⭐⭐</p>
                        <p className="text-xs text-red-600">Excellent</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm md:text-base">Tier 2 Accounts</p>
                        <p className="text-xs text-gray-600">18 accounts • $380K pipeline • 76% avg engagement</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl md:text-2xl font-bold text-yellow-700">⭐⭐</p>
                        <p className="text-xs text-yellow-600">Good</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 border border-green-200 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm md:text-base">Tier 3 Accounts</p>
                        <p className="text-xs text-gray-600">12 accounts • $140K pipeline • 65% avg engagement</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl md:text-2xl font-bold text-green-700">⭐</p>
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
                    <div className="flex flex-col sm:flex-row items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
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
                        <Plus className="w-4 h-4 mr-1 flex-shrink-0" />
                        Eval
                      </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
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
                        <Plus className="w-4 h-4 mr-1 flex-shrink-0" />
                        Eval
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
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
                        <Plus className="w-4 h-4 mr-1 flex-shrink-0" />
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
            onStepChange={(step) => setCurrentStep(step)}
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
            featureName="ABM Command Center"
          />
        </div>
      </div>
    </div>
  );
}