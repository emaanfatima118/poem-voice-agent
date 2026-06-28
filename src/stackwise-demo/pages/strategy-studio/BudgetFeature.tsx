import { useState } from "react";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { getModuleById } from "@/stackwise-demo/config/modules";
import { BudgetStep } from "@/stackwise-demo/components/shared/BudgetStep";
import { ChannelBudgetStep } from "@/stackwise-demo/components/shared/ChannelBudgetStep";
import { RequestBudgetChangeDialog } from "@/stackwise-demo/components/RequestBudgetChangeDialog";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Progress } from "@/stackwise-demo/components/ui/progress";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/stackwise-demo/components/ui/tabs";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Upload, Download, AlertTriangle, CheckCircle2, Lightbulb, Zap, TrendingUp, TrendingDown, DollarSign, Calendar, Info, ChevronDown, ChevronUp } from "lucide-react";

const steps = [
  { id: "budget", label: "Budget Allocation", description: "Set annual budget & categories" },
  { id: "channel-budget", label: "Channel Budget", description: "Distribute budget across channels" },
  { id: "spend-tracking", label: "Spend Tracking", description: "Track actual spend vs. budget" },
  { id: "reallocation-center", label: "Reallocation Center", description: "Manage budget reallocation requests" },
  { id: "executive-insight", label: "Executive Insight", description: "Strategic budget insights" },
];

export default function BudgetFeature() {
  const [currentStep, setCurrentStep] = useState("budget");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'ytd'>('month');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestContext, setRequestContext] = useState<string>('');
  const [suggestedAdjustments, setSuggestedAdjustments] = useState<any[]>([]);
  const { toast } = useToast();

  // Budget state (loaded from Orientation or Annual Setup)
  const [yearlyBudget, setYearlyBudget] = useState<number>(250000);
  const [budgetAllocation, setBudgetAllocation] = useState({
    contentCreation: 20,
    paidAdvertising: 25,
    seoSem: 10,
    socialMedia: 15,
    eventsSponsorships: 10,
    toolsSoftware: 10,
    creativePro: 5,
    contingency: 5,
  });
  const [channelAllocations, setChannelAllocations] = useState({
    contentCreation: { blog: 30, video: 30, whitepapersEbooks: 20, webinars: 20 },
    paidAdvertising: { googleAds: 40, linkedInAds: 30, displayAds: 20, retargeting: 10 },
    seoSem: { organicSeo: 60, paidSearch: 40 },
    socialMedia: { linkedin: 30, twitter: 25, facebook: 25, instagram: 20 },
    eventsSponsorships: { conferences: 50, webinars: 30, sponsorships: 20 },
    toolsSoftware: { marketingAutomation: 40, analytics: 30, contentTools: 20, other: 10 },
    creativePro: { design: 50, videoProduction: 30, photography: 20 },
    contingency: { buffer: 100 },
  });

  // Channels state (loaded from Orientation or Annual Setup)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'LinkedIn',
    'Blog / SEO',
    'Email Nurture',
  ]);
  const [customChannel, setCustomChannel] = useState<string>('');
  const [channelDetails, setChannelDetails] = useState<Record<string, any>>({
    linkedin: {
      goal: 'Thought leadership and lead generation',
      audience: 'B2B decision makers',
      contentType: 'Industry insights and company updates',
      successMetric: 'Engagement rate and leads generated'
    }
  });

  // Monthly spend tracking state
  const [monthlySpend, setMonthlySpend] = useState<Record<string, number>>({
    contentCreation: 3500,
    paidAdvertising: 4200,
    seoSem: 1800,
    socialMedia: 2500,
    eventsSponsorships: 1500,
    toolsSoftware: 1200,
    creativePro: 800,
    contingency: 500,
  });

  // Channel-based monthly spend state (for new template format)
  const [channelMonthlySpend, setChannelMonthlySpend] = useState<Record<string, number>>({
    'Google Search': 0,
    'Meta Facebook': 0,
    'Meta Instagram': 0,
    'Retargeting': 0,
    'Programmatic / Display': 0,
    'ABM Platform': 0,
    'Content Production': 0,
    'Tools / Subscriptions': 0,
    'Events / Field': 0,
    'PR / Comms': 0,
    'Email / CRM': 0,
    'Contingency': 0,
  });

  // Reallocation requests state
  const [reallocationRequests, setReallocationRequests] = useState([
    {
      id: 1,
      requestedBy: 'Sarah Chen',
      date: '2025-01-15',
      amount: 15000,
      sourceChannel: 'Social Media',
      targetChannel: 'Paid Advertising',
      reason: 'LinkedIn Ads campaign showing 3x ROI - need to scale',
      aiRecommendation: 'approve',
      aiConfidence: 92,
      businessImpact: 'High - Accelerates pipeline generation by 24%',
      status: 'pending',
      campaignImpact: 'Q1 Lead Gen Campaign (+$45K pipeline)'
    },
    {
      id: 2,
      requestedBy: 'Mike Rodriguez',
      date: '2025-01-18',
      amount: 8000,
      sourceChannel: 'Contingency',
      targetChannel: 'Events & Field',
      reason: 'Unexpected conference opportunity with target accounts',
      aiRecommendation: 'partial',
      aiConfidence: 78,
      businessImpact: 'Medium - 12 target accounts confirmed attendance',
      status: 'pending',
      campaignImpact: 'ABM Field Event (+$96K pipeline potential)'
    },
  ]);

  // Audit trail state
  const [auditTrail, setAuditTrail] = useState<Array<{
    id: number;
    date: string;
    action: string;
    user: string;
    details: string;
    amount?: number;
    source?: string;
    target?: string;
  }>>([
    {
      id: 1,
      date: '2025-01-10',
      action: 'Approved Reallocation',
      user: 'System Admin',
      details: 'Moved $10K from SEO/SEM to Paid Advertising',
      amount: 10000,
      source: 'SEO/SEM',
      target: 'Paid Advertising'
    },
  ]);

  const module = getModuleById('strategy-studio');
  const moduleColor = '#6218df';

  // Baseline values (set from Orientation or Annual Setup)
  const baselineBudget = 250000;
  const budgetChange = yearlyBudget - baselineBudget;
  const budgetChangePercent = ((budgetChange / baselineBudget) * 100).toFixed(1);

  const handleBudgetNext = () => {
    if (!completedSteps.includes("budget")) {
      setCompletedSteps([...completedSteps, "budget"]);
    }
    setCurrentStep("channel-budget");
  };

  const handleChannelBudgetNext = () => {
    if (!completedSteps.includes("channel-budget")) {
      setCompletedSteps([...completedSteps, "channel-budget"]);
    }
    setCurrentStep("spend-tracking");
  };

  const handleSpendTrackingSave = () => {
    if (!completedSteps.includes("spend-tracking")) {
      setCompletedSteps([...completedSteps, "spend-tracking"]);
    }
    toast({
      title: "Spend Tracking Updated",
      description: "Your spend tracking has been saved. Flight Deck will show spend vs. budget performance.",
    });
    // In real app, this would save to database
  };

  const handleReallocationAction = (requestId: number, action: 'approve' | 'deny' | 'modify', modifiedAmount?: number) => {
    const request = reallocationRequests.find(r => r.id === requestId);
    if (!request) return;

    const finalAmount = modifiedAmount || request.amount;

    // Update request status
    setReallocationRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: action } : r
    ));

    // Add to audit trail
    const newAuditEntry = {
      id: auditTrail.length + 1,
      date: new Date().toISOString().split('T')[0],
      action: action === 'approve' ? 'Approved Reallocation' : action === 'deny' ? 'Denied Reallocation' : 'Modified Reallocation',
      user: 'Current User',
      details: `${action === 'approve' ? 'Approved' : action === 'deny' ? 'Denied' : 'Modified'} $${finalAmount.toLocaleString()} from ${request.sourceChannel} to ${request.targetChannel}`,
      amount: finalAmount,
      source: request.sourceChannel,
      target: request.targetChannel
    };

    setAuditTrail(prev => [newAuditEntry, ...prev]);

    // Update budget allocations if approved
    if (action === 'approve') {
      // In real app, this would update the actual budget allocations
      toast({
        title: "Reallocation Approved",
        description: `$${finalAmount.toLocaleString()} moved from ${request.sourceChannel} to ${request.targetChannel}. Changes synced to Flight Deck.`,
      });
    } else if (action === 'deny') {
      toast({
        title: "Reallocation Denied",
        description: "Request has been denied and requester will be notified.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reallocation Modified",
        description: `Modified to $${finalAmount.toLocaleString()}. Awaiting approval.`,
      });
    }
  };

  const handleDownloadSpendTemplate = () => {
    const monthlyBudget = yearlyBudget / 12;
    const csvContent = `Budget Category,Monthly Budget,Actual Spend
Content Creation,${((monthlyBudget * budgetAllocation.contentCreation) / 100).toFixed(2)},${monthlySpend.contentCreation}
Paid Advertising,${((monthlyBudget * budgetAllocation.paidAdvertising) / 100).toFixed(2)},${monthlySpend.paidAdvertising}
SEO / SEM,${((monthlyBudget * budgetAllocation.seoSem) / 100).toFixed(2)},${monthlySpend.seoSem}
Social Media,${((monthlyBudget * budgetAllocation.socialMedia) / 100).toFixed(2)},${monthlySpend.socialMedia}
Events & Sponsorships,${((monthlyBudget * budgetAllocation.eventsSponsorships) / 100).toFixed(2)},${monthlySpend.eventsSponsorships}
Tools & Software,${((monthlyBudget * budgetAllocation.toolsSoftware) / 100).toFixed(2)},${monthlySpend.toolsSoftware}
Creative & Production,${((monthlyBudget * budgetAllocation.creativePro) / 100).toFixed(2)},${monthlySpend.creativePro}
Contingency,${((monthlyBudget * budgetAllocation.contingency) / 100).toFixed(2)},${monthlySpend.contingency}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stackwise_monthly_spend.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "Monthly spend template downloaded. Update Actual Spend column and upload.",
    });
  };

  const handleUploadSpend = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        
        const newSpend: Record<string, number> = {};

        lines.forEach(line => {
          const [category, , actualSpend] = line.split(',').map(s => s.trim());
          if (!category) return;

          const categoryKey = category.toLowerCase().replace(/\s+&\s+/g, '').replace(/\s+/g, '').replace(/\//g, '');
          newSpend[categoryKey] = parseFloat(actualSpend) || 0;
        });

        setMonthlySpend(newSpend);

        toast({
          title: "Spend Data Uploaded",
          description: "Your monthly spend has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to parse spend file. Please use the provided template format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleDownloadChannelBudgetTemplate = () => {
    // Download the actual template file from public folder
    const link = document.createElement('a');
    link.href = '/stackwise_channel_budget_template.csv';
    link.download = 'stackwise_channel_budget_template.csv';
    link.click();
    
    toast({
      title: "Template Downloaded",
      description: "Channel budget template downloaded. Fill in Month and Actual Spend columns, then upload.",
    });
  };

  const handleUploadChannelBudget = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        
        const newChannelSpend: Record<string, number> = {};

        lines.forEach(line => {
          const parts = line.split(',').map(s => s.trim());
          if (parts.length < 3 || !parts[0]) return;
          
          const channel = parts[0];
          const actualSpend = parts[2];
          
          if (channel && actualSpend) {
            newChannelSpend[channel] = parseFloat(actualSpend) || 0;
          }
        });

        setChannelMonthlySpend(prev => ({
          ...prev,
          ...newChannelSpend
        }));

        toast({
          title: "Channel Budget Uploaded",
          description: "Your channel budget data has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to parse budget file. Please use the provided template format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "budget":
        return (
          <BudgetStep
            yearlyBudget={yearlyBudget}
            budgetAllocation={budgetAllocation}
            channelAllocations={channelAllocations}
            onYearlyBudgetChange={setYearlyBudget}
            onBudgetAllocationChange={setBudgetAllocation}
            onChannelAllocationsChange={setChannelAllocations}
            onNext={handleBudgetNext}
            showNavigation={true}
            title="Budget Allocation"
            description="Adjust your marketing budget and allocation across categories"
            coachingPrompt="Review your budget regularly and adjust allocations based on performance. Flight Deck tracks spending against these targets and alerts you to variances."
            moduleColor={moduleColor}
            previousBudget={baselineBudget}
          />
        );

      case "channel-budget":
        return (
          <ChannelBudgetStep
            yearlyBudget={yearlyBudget}
            budgetAllocation={budgetAllocation}
            channelAllocations={channelAllocations}
            onChannelAllocationsChange={setChannelAllocations}
            onNext={handleChannelBudgetNext}
            onBack={() => setCurrentStep("budget")}
            showNavigation={true}
            title="Channel Budget Distribution"
            description="Distribute your category budgets across specific channels"
            coachingPrompt="Allocate budget within each category to specific channels based on performance and strategic priorities. Each category should total 100%."
            moduleColor={moduleColor}
          />
        );

      case "spend-tracking":
      case "monthly-tracking": // Keep for backwards compatibility
        const monthlyBudget = yearlyBudget / 12;
        const budgetCategories = [
          { key: 'contentCreation', label: 'Content Creation' },
          { key: 'paidAdvertising', label: 'Paid Advertising' },
          { key: 'seoSem', label: 'SEO / SEM' },
          { key: 'socialMedia', label: 'Social Media' },
          { key: 'eventsSponsorships', label: 'Events & Sponsorships' },
          { key: 'toolsSoftware', label: 'Tools & Software' },
          { key: 'creativePro', label: 'Creative & Production' },
          { key: 'contingency', label: 'Contingency' },
        ];

        const totalBudgetedMonthly = budgetCategories.reduce((sum, cat) => {
          const allocation = budgetAllocation[cat.key as keyof typeof budgetAllocation];
          return sum + ((monthlyBudget * allocation) / 100);
        }, 0);

        const totalSpent = Object.values(monthlySpend).reduce((sum, val) => sum + val, 0);
        const overallProgress = (totalSpent / totalBudgetedMonthly) * 100;

        // Pie chart data
        const pieChartData = budgetCategories.map(cat => ({
          name: cat.label,
          value: budgetAllocation[cat.key as keyof typeof budgetAllocation],
        }));

        const COLORS = ['#6218df', '#c009ba', '#1e40f2', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

        // Seasonality curve data (mock data for now)
        const seasonalityData = [
          { month: 'Jan', planned: 20833, actual: 16500 },
          { month: 'Feb', planned: 20833, actual: 19200 },
          { month: 'Mar', planned: 20833, actual: 21100 },
          { month: 'Apr', planned: 20833, actual: 18900 },
          { month: 'May', planned: 20833, actual: 20500 },
          { month: 'Jun', planned: 20833, actual: totalSpent },
        ];

        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 relative">
            {/* Header with Timeframe Filter */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">Spend Tracking</h2>
                <p className="text-muted-foreground mb-1">Track actual spend against budget to identify variances early.</p>
                <p className="text-sm text-muted-foreground">
                  Monitor budget performance across all categories with real-time insights and recommendations.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <Button
                  variant="default"
                  onClick={() => {
                    setRequestContext('Budget reallocation request from Spend Tracking');
                    setSuggestedAdjustments([]);
                    setShowRequestDialog(true);
                  }}
                  data-testid="button-request-budget-change-main"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Request Budget Change
                </Button>
                <Tabs value={timeframe} onValueChange={(val) => setTimeframe(val as 'month' | 'quarter' | 'ytd')}>
                  <TabsList>
                    <TabsTrigger value="month" data-testid="filter-month">Month</TabsTrigger>
                    <TabsTrigger value="quarter" data-testid="filter-quarter">Quarter</TabsTrigger>
                    <TabsTrigger value="ytd" data-testid="filter-ytd">YTD</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Coaching Prompt */}
            <Card 
              className="border-l-4" 
              style={{ borderLeftColor: moduleColor }}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                  <p className="text-sm">
                    <strong>Coaching Prompt:</strong> Regularly update your spend to catch budget overruns early. This helps you reallocate funds and avoid surprises at quarter-end.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upload/Download Spend - Category Based */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Import Category-Based Monthly Spend</h4>
                    <p className="text-xs text-muted-foreground">
                      Download template with your budget categories, update actual spend, and upload to quickly update all categories.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadSpendTemplate}
                      data-testid="button-download-spend-template"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download Template
                    </Button>
                    <label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleUploadSpend}
                        className="hidden"
                        data-testid="input-upload-spend"
                      />
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector<HTMLInputElement>('input[data-testid="input-upload-spend"]');
                          input?.click();
                        }}
                        data-testid="button-upload-spend"
                      >
                        <Upload className="w-3 h-3 mr-2" />
                        Upload Spend
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload/Download Spend - Channel Based */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Import Channel Budget</h4>
                    <p className="text-xs text-muted-foreground">
                      Download the Stackwise channel budget template, fill in Month and Actual Spend for each channel, then upload.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadChannelBudgetTemplate}
                      data-testid="button-download-channel-template"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download Template
                    </Button>
                    <label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleUploadChannelBudget}
                        className="hidden"
                        data-testid="input-upload-channel-budget"
                      />
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector<HTMLInputElement>('input[data-testid="input-upload-channel-budget"]');
                          input?.click();
                        }}
                        data-testid="button-upload-channel-budget"
                      >
                        <Upload className="w-3 h-3 mr-2" />
                        Upload Budget
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Allocation Breakdown Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Budget Allocation Breakdown</CardTitle>
                  <CardDescription>Current {timeframe === 'month' ? 'monthly' : timeframe === 'quarter' ? 'quarterly' : 'YTD'} distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Seasonality Curve */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Spend Pacing Curve</CardTitle>
                  <CardDescription>Planned vs. actual monthly spend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={seasonalityData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="planned" stroke={moduleColor} strokeWidth={2} name="Planned" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="actual" stroke="#00C49F" strokeWidth={2} name="Actual" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Overall Summary */}
            <Card className={`border-2 ${overallProgress > 100 ? 'border-red-500' : overallProgress > 90 ? 'border-yellow-500' : 'border-green-500'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall Budget Performance</span>
                  <Badge variant={overallProgress > 100 ? 'destructive' : overallProgress > 90 ? 'secondary' : 'default'}>
                    {overallProgress.toFixed(1)}% Used
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">
                      ${totalBudgetedMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-muted-foreground">Monthly Budget</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${totalSpent > totalBudgetedMonthly ? 'text-red-600' : 'text-green-600'}`}>
                      ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-muted-foreground">Actual Spend</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${totalSpent > totalBudgetedMonthly ? 'text-red-600' : 'text-green-600'}`}>
                      ${(totalBudgetedMonthly - totalSpent).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>
                <Progress value={Math.min(overallProgress, 100)} className="h-3" />
              </CardContent>
            </Card>

            {/* Category-by-Category Tracking */}
            <div className="grid md:grid-cols-2 gap-4">
              {budgetCategories.map(category => {
                const allocation = budgetAllocation[category.key as keyof typeof budgetAllocation];
                const budgeted = (monthlyBudget * allocation) / 100;
                const spent = monthlySpend[category.key] || 0;
                const progress = (spent / budgeted) * 100;
                const remaining = budgeted - spent;

                // Mock optimization recommendations based on category
                const recommendations: Record<string, string> = {
                  'contentCreation': 'Consider shifting 5% to video content - higher engagement',
                  'paidAdvertising': 'LinkedIn Ads showing 3x ROI - recommend +15% allocation',
                  'seoSem': 'Organic SEO performing well - maintain current spend',
                  'socialMedia': 'Under-pacing - increase activity or reallocate',
                  'eventsSponsorships': 'Q2 conference confirmed - reserve $8K',
                  'toolsSoftware': 'Annual renewals in Q4 - plan for spike',
                  'creativePro': 'On track - no optimization needed',
                  'contingency': 'Available for reallocation if needed',
                };

                const campaignImpacts: Record<string, string> = {
                  'contentCreation': 'Q1 Content Series launches Feb 15 (+$2.5K)',
                  'paidAdvertising': 'Lead Gen Campaign active (+$12K in Jan)',
                  'seoSem': 'No major campaigns planned',
                  'socialMedia': 'Thought Leadership push (+$3K)',
                  'eventsSponsorships': 'Industry Summit Q2 (+$8K)',
                  'toolsSoftware': 'No upcoming impact',
                  'creativePro': 'Video production Q1 (+$1.5K)',
                  'contingency': 'Reserved for ad-hoc needs',
                };

                return (
                  <Card key={category.key} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{category.label}</h3>
                          <div className="text-xs text-muted-foreground mt-1">
                            Budget: ${budgeted.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                          </div>
                        </div>
                        {progress > 100 ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : progress > 90 ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Actual Spend ($)</Label>
                        <Input
                          type="number"
                          value={spent}
                          onChange={(e) => setMonthlySpend({
                            ...monthlySpend,
                            [category.key]: parseFloat(e.target.value) || 0
                          })}
                          placeholder="0"
                          data-testid={`input-spend-${category.key}`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{progress.toFixed(1)}% used</span>
                          <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(remaining).toLocaleString(undefined, { maximumFractionDigits: 0 })} {remaining < 0 ? 'over' : 'left'}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(progress, 100)} 
                          className={`h-2 ${progress > 100 ? 'bg-red-100' : progress > 90 ? 'bg-yellow-100' : ''}`}
                        />
                      </div>

                      {/* Strategic Insights */}
                      <div className="pt-2 border-t">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                          <div>
                            <div className="text-xs font-semibold mb-1">Strategic Insights</div>
                            <div className="text-xs text-muted-foreground">
                              {progress > 95 ? 'Nearing budget limit - monitor closely' : 
                               progress > 80 ? 'On track for this period' :
                               progress < 50 ? 'Low utilization - review planned activities' :
                               'Healthy pacing for current month'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Campaign Impact */}
                      <div className="pt-2 border-t">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                          <div>
                            <div className="text-xs font-semibold mb-1">Upcoming Campaign Impact</div>
                            <div className="text-xs text-muted-foreground">{campaignImpacts[category.key]}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Request Budget Change Dialog */}
            <RequestBudgetChangeDialog
              open={showRequestDialog}
              onOpenChange={setShowRequestDialog}
              availableChannels={['Google Ads', 'Facebook', 'Instagram', 'LinkedIn Ads', 'Display Ads', 'Retargeting', 'Email Nurture', 'Content Marketing', 'SEO/SEM']}
              channelBudgets={{
                'Google Ads': 8000,
                'Facebook': 4000,
                'Instagram': 3000,
                'LinkedIn Ads': 6000,
                'Display Ads': 3500,
                'Retargeting': 2500,
                'Email Nurture': 4500,
                'Content Marketing': 5000,
                'SEO/SEM': 3500,
              }}
              recommendationContext={requestContext}
              suggestedAdjustments={suggestedAdjustments}
              sourceFeature="spend-tracking"
            />

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("channels")}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button 
                onClick={handleSpendTrackingSave}
                data-testid="button-save"
              >
                Save & Complete
              </Button>
            </div>
          </div>
        );

      case "reallocation-center":
        const pendingRequests = reallocationRequests.filter(r => r.status === 'pending');
        
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Reallocation Center</h2>
              <p className="text-muted-foreground">
                Review and manage budget reallocation requests with AI-powered recommendations
              </p>
            </div>

            {/* Coaching Prompt */}
            <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                  <p className="text-sm">
                    <strong>Coaching Prompt:</strong> Budget reallocations should be based on performance data and strategic priorities. AI recommendations consider historical performance, campaign impact, and business goals.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setRequestContext('User-initiated budget reallocation request');
                  setSuggestedAdjustments([]);
                  setShowRequestDialog(true);
                }}
                data-testid="button-request-budget-change"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Request Budget Change
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRequestContext('Admin direct budget adjustment');
                  setSuggestedAdjustments([]);
                  setShowRequestDialog(true);
                }}
                data-testid="button-make-adjustment"
              >
                <Zap className="w-4 h-4 mr-2" />
                Make Direct Adjustment
              </Button>
            </div>

            {/* Budget Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Optimization Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions for budget adjustments based on performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-md border hover-elevate">
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1">Content Creation</div>
                      <p className="text-xs text-muted-foreground">Consider shifting 5% to video content - higher engagement rates detected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-md border hover-elevate">
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1">Paid Advertising</div>
                      <p className="text-xs text-muted-foreground">LinkedIn Ads showing 3x ROI - recommend +15% allocation from underperforming channels</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-md border hover-elevate">
                    <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1">Social Media</div>
                      <p className="text-xs text-muted-foreground">Under-pacing - increase activity or reallocate to higher-performing channels</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-md border hover-elevate">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1">Events & Sponsorships</div>
                      <p className="text-xs text-muted-foreground">Q2 conference confirmed - reserve $8K for industry summit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Incoming Reallocation Requests ({pendingRequests.length})</h3>
              
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending reallocation requests</p>
                  </CardContent>
                </Card>
              ) : (
                pendingRequests.map(request => (
                  <Card key={request.id} className="p-6">
                    <div className="space-y-4">
                      {/* Request Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">
                              ${request.amount.toLocaleString()} Reallocation Request
                            </h4>
                            <Badge 
                              variant={request.aiRecommendation === 'approve' ? 'default' : request.aiRecommendation === 'deny' ? 'destructive' : 'secondary'}
                            >
                              AI: {request.aiRecommendation.charAt(0).toUpperCase() + request.aiRecommendation.slice(1)} ({request.aiConfidence}% confidence)
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requested by {request.requestedBy} on {request.date}
                          </div>
                        </div>
                      </div>

                      {/* Channel Flow */}
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                        <div className="flex-1 text-center">
                          <div className="text-xs text-muted-foreground mb-1">From</div>
                          <div className="font-semibold">{request.sourceChannel}</div>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="flex-1 text-center">
                          <div className="text-xs text-muted-foreground mb-1">To</div>
                          <div className="font-semibold">{request.targetChannel}</div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Amount</div>
                          <div className="font-semibold text-lg" style={{ color: moduleColor }}>
                            ${request.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-semibold mb-2 block">Reason</Label>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-2 block">Business Impact</Label>
                          <p className="text-sm text-muted-foreground">{request.businessImpact}</p>
                        </div>
                      </div>

                      {/* Campaign Impact */}
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 mt-0.5 text-blue-600" />
                          <div>
                            <div className="text-xs font-semibold mb-1">Campaign Impact</div>
                            <div className="text-xs text-muted-foreground">{request.campaignImpact}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="default"
                          onClick={() => handleReallocationAction(request.id, 'approve')}
                          data-testid={`button-approve-${request.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReallocationAction(request.id, 'deny')}
                          data-testid={`button-deny-${request.id}`}
                        >
                          Deny
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const amount = prompt('Enter modified amount:', request.amount.toString());
                            if (amount) handleReallocationAction(request.id, 'modify', parseInt(amount));
                          }}
                          data-testid={`button-modify-${request.id}`}
                        >
                          Modify Amount
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Audit Trail */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Audit Trail</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {auditTrail.map(entry => (
                      <div key={entry.id} className="p-4 hover-elevate">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{entry.action}</Badge>
                            <span className="text-sm text-muted-foreground">{entry.date}</span>
                          </div>
                          {entry.amount && (
                            <span className="font-semibold">${entry.amount.toLocaleString()}</span>
                          )}
                        </div>
                        <p className="text-sm">{entry.details}</p>
                        <div className="text-xs text-muted-foreground mt-1">By {entry.user}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Request Budget Change Dialog */}
            <RequestBudgetChangeDialog
              open={showRequestDialog}
              onOpenChange={setShowRequestDialog}
              availableChannels={['Google Ads', 'Facebook', 'Instagram', 'LinkedIn Ads', 'Display Ads', 'Retargeting', 'Email Nurture', 'Content Marketing', 'SEO/SEM']}
              channelBudgets={{
                'Google Ads': 8000,
                'Facebook': 4000,
                'Instagram': 3000,
                'LinkedIn Ads': 6000,
                'Display Ads': 3500,
                'Retargeting': 2500,
                'Email Nurture': 4500,
                'Content Marketing': 5000,
                'SEO/SEM': 3500,
              }}
              recommendationContext={requestContext}
              suggestedAdjustments={suggestedAdjustments}
              sourceFeature="reallocation-center"
            />

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("spend-tracking")}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep("executive-insight")}
                data-testid="button-next"
              >
                Next: Executive Insight
              </Button>
            </div>
          </div>
        );
      
      case "executive-insight":
        const criticalInsights = [
          {
            id: 1,
            type: 'critical',
            icon: AlertTriangle,
            title: 'Budget-Goal Alignment Gap',
            message: 'Your top priority channels have 18% less budget than goal alignment suggests.',
            recommendation: 'Reallocate $12K from Social Media to Paid Advertising for better goal alignment',
            impact: 'high'
          },
          {
            id: 2,
            type: 'warning',
            icon: TrendingDown,
            title: 'Underfunded Conversion Channel',
            message: 'Retargeting is underfunded considering last year\'s conversion rates.',
            recommendation: 'Increase retargeting budget by $5K to capitalize on warm leads',
            impact: 'medium'
          },
          {
            id: 3,
            type: 'critical',
            icon: DollarSign,
            title: 'Spend Smoothing Needed',
            message: 'Execution-heavy months (Q2/Q4) spike past tolerance. Consider smoothing spend.',
            recommendation: 'Distribute $18K across Q1 and Q3 to avoid budget spikes',
            impact: 'high'
          },
          {
            id: 4,
            type: 'info',
            icon: Info,
            title: 'Campaign Concentration Risk',
            message: 'Campaign reliance: 42% of your budget is tied to 3 campaigns.',
            recommendation: 'Diversify budget across 2-3 additional campaigns to reduce risk',
            impact: 'medium'
          },
        ];

        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 relative">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Executive Insight</h2>
              <p className="text-muted-foreground">
                Strategic budget recommendations powered by AI analysis
              </p>
            </div>

            {/* Coaching Prompt */}
            <Card className="border-l-4" style={{ borderLeftColor: moduleColor }}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
                  <p className="text-sm">
                    <strong>Coaching Prompt:</strong> Use these insights to inform quarterly budget reviews and strategic planning. AI analyzes historical performance, conversion data, and business goals to identify optimization opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Critical Insights */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Critical Insights ({criticalInsights.filter(i => i.type === 'critical').length})</h3>
                <Badge variant="destructive" className="animate-pulse">
                  {criticalInsights.filter(i => i.type === 'critical').length} Require Attention
                </Badge>
              </div>

              {criticalInsights.map(insight => {
                const Icon = insight.icon;
                return (
                  <Card 
                    key={insight.id} 
                    className={`p-5 ${insight.type === 'critical' ? 'border-l-4 border-l-red-500' : insight.type === 'warning' ? 'border-l-4 border-l-yellow-500' : ''}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${insight.type === 'critical' ? 'text-red-500' : insight.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{insight.message}</p>
                          
                          <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-md mb-3">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 mt-0.5" style={{ color: moduleColor }} />
                              <div className="flex-1">
                                <div className="text-xs font-semibold mb-1">Recommendation</div>
                                <div className="text-xs">{insight.recommendation}</div>
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRequestContext(`${insight.title}: ${insight.recommendation}`);
                              setSuggestedAdjustments([]);
                              setShowRequestDialog(true);
                            }}
                            data-testid={`button-request-change-${insight.id}`}
                          >
                            <DollarSign className="w-3 h-3 mr-1.5" />
                            Request Budget Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Channel Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Channel Performance & Recommendations</CardTitle>
                <CardDescription>What drives lift, over-reliance risks, and reallocation opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-sm">Top Performing Channels</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Paid Advertising</span>
                        <Badge variant="default">3.2x ROI</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>SEO / SEM</span>
                        <Badge variant="default">2.8x ROI</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Content Creation</span>
                        <Badge variant="default">2.1x ROI</Badge>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-semibold text-sm">Over-Reliance Risks</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Social Media</span>
                        <Badge variant="secondary">Single tactic</Badge>
                      </li>
                      <li className="text-xs text-muted-foreground">
                        72% of social budget on LinkedIn alone
                      </li>
                      <li className="text-xs text-muted-foreground">
                        Recommend diversifying across platforms
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border border-purple-200/60 rounded-lg">
                  <h4 className="font-semibold text-sm sm:text-base mb-2 text-purple-900">Stage-Based Optimization</h4>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3 leading-relaxed">
                    You've invested heavily in awareness but underfunded the channels that actually convert. 
                  </p>
                  <div className="flex items-start gap-2 sm:gap-3 p-3 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-200/60 rounded-lg">
                    <div className="p-1.5 rounded-md bg-blue-100 flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed min-w-0 flex-1">
                      <strong className="text-blue-900">Recommendation:</strong> Consider shifting 12–18% of spend toward lower-funnel channels like retargeting and email nurture to improve conversion rates.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Budget Change Dialog */}
            <RequestBudgetChangeDialog
              open={showRequestDialog}
              onOpenChange={setShowRequestDialog}
              availableChannels={['Google Ads', 'Facebook', 'Instagram', 'LinkedIn Ads', 'Display Ads', 'Retargeting', 'Email Nurture', 'Content Marketing', 'SEO/SEM']}
              channelBudgets={{
                'Google Ads': 8000,
                'Facebook': 4000,
                'Instagram': 3000,
                'LinkedIn Ads': 6000,
                'Display Ads': 3500,
                'Retargeting': 2500,
                'Email Nurture': 4500,
                'Content Marketing': 5000,
                'SEO/SEM': 3500,
              }}
              recommendationContext={requestContext}
              suggestedAdjustments={suggestedAdjustments}
              sourceFeature="executive-insight"
            />

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("reallocation-center")}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button 
                onClick={handleSpendTrackingSave}
                data-testid="button-complete"
              >
                Complete Review
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderStepContent()}
      moduleColor={moduleColor}
      completedSteps={completedSteps}
      featureName="Budget Management"
    />
  );
}
