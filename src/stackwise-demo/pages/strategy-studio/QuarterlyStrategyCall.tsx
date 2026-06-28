import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Progress } from '@/stackwise-demo/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout';
import { QuickActions } from '@/stackwise-demo/components/QuickActions';
import { getModuleById } from '@/stackwise-demo/config/modules';
import { 
  PlusCircle, 
  Trash2, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Brain,
} from 'lucide-react';
import { Textarea } from '@/stackwise-demo/components/ui/textarea';

export default function QuarterlyStrategyCall() {
  const module = getModuleById('strategy-studio');
  const feature = module?.features?.find(f => f.id === 'quarterly-strategy-call');
  const [currentStep, setCurrentStep] = useState('overview');
  const moduleColor = '#6218df';

  // State for action items
  const [actionItems, setActionItems] = useState([
    { task: 'Sync nurture campaigns with Brand Craft themes', owner: 'Jen', due: 'Nov 25', status: 'Open' },
    { task: 'Refine paid media targeting for Q1', owner: 'Emma', due: 'Dec 10', status: 'In Progress' },
  ]);

  const [callNotes, setCallNotes] = useState('');

  // Mock data
  const pulseData = [
    { metric: 'Pipeline Growth', value: 22 },
    { metric: 'SQL Volume', value: 24 },
    { metric: 'Revenue Growth', value: 18 },
  ];

  const qoqMetrics = [
    { title: 'Pipeline Velocity', value: '+12%', description: 'Lead → SQL acceleration' },
    { title: 'Win Rate', value: '31%', description: '+3 pts QoQ' },
    { title: 'Revenue / Deal', value: '$72K', description: '+6% QoQ' },
    { title: 'Marketing-Influenced Pipeline', value: '54%', description: 'Driven by ABM' },
    { title: 'Engagement Rate', value: '+19%', description: 'All digital channels' },
    { title: 'Customer Retention', value: '92%', description: 'Stable YoY' },
    { title: 'Projected Pipeline', value: '$8.7M', description: '87% to yearly goal' },
    { title: 'Projected Revenue', value: '$2.5M', description: '83% to yearly goal' },
  ];

  const insights = [
    {
      category: 'Critical',
      insight: 'Competitors outperform in thought leadership by SOV gap.',
      flag: '+35% SOV gap',
      why: 'Higher cadence of webinars/reports aligned to buyer pain.',
      reco: 'Launch biweekly leadership content + customer ROI stories; target 2 analyst mentions.',
    },
    {
      category: 'Important',
      insight: 'Organic search volume plateaued for key personas.',
      flag: 'Flat YoY traffic',
      why: 'Decline in SEO updates and competitor blog expansion.',
      reco: 'Revitalize blog strategy with fresh pillar content and guest posts.',
    },
    {
      category: 'Quick Win',
      insight: 'Video content CTR improving steadily.',
      flag: '+14% engagement',
      why: 'Increased use of product demos on LinkedIn.',
      reco: 'Expand video placements and include testimonial reels.',
    },
  ];

  const archivedCalls = [
    { quarter: 'Q3 2025', date: 'Oct 15, 2025', attendees: 5, actionItems: 8 },
    { quarter: 'Q2 2025', date: 'Jul 10, 2025', attendees: 6, actionItems: 12 },
    { quarter: 'Q1 2025', date: 'Apr 8, 2025', attendees: 5, actionItems: 10 },
  ];

  // Action item handlers
  const updateItem = (idx: number, field: string, value: string) => {
    setActionItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addNewItem = () => {
    setActionItems((p) => [...p, { task: '', owner: '', due: '', status: 'Open' }]);
  };

  const deleteItem = (idx: number) => {
    setActionItems((p) => p.filter((_, i) => i !== idx));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Important': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'Quick Win': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Critical': return 'border-red-200 bg-red-50';
      case 'Important': return 'border-orange-200 bg-orange-50';
      case 'Quick Win': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  // Module navigation (left column)
  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Strategy Studio</h2>
    </div>
  );

  // Main content
  const content = (
    <div className="p-8 space-y-6">
        {currentStep === 'overview' && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">Overview</h2>
              <p className="text-muted-foreground">
                Strategic theme & market context
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Strategic Theme & Market Shifts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">Quarterly focus: Expand reach in healthcare accounts</p>
                <div className="bg-muted p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Healthcare digital ad spend up 11% QoQ</li>
                    <li>Competitor paid budgets +8% with webinar-heavy cadence</li>
                    <li>LinkedIn engagement +6% in MedTech thought leadership</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-semibold">Business Goals (3)</h3>
            <div className="grid grid-cols-3 gap-4">
              {pulseData.map((metric) => (
                <Card key={metric.metric}>
                  <CardHeader>
                    <CardTitle className="text-base">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={metric.value} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Up {metric.value}% QoQ</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {currentStep === 'qoq-trends' && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">QoQ Trends</h2>
              <p className="text-muted-foreground">
                Quarter-over-quarter performance summary
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-900 mb-1">AI Narrative</p>
                      <p className="text-sm text-purple-800">
                        Growth remains healthy. Deal velocity, win rate, and engagement trend positively; prioritize nurture optimization for conversion lift.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {qoqMetrics.map((metric) => (
                    <Card key={metric.title} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-2xl font-bold mb-1" style={{ color: moduleColor }}>{metric.value}</h3>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {currentStep === 'notes-actions' && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">Notes + Action Items</h2>
              <p className="text-muted-foreground">
                Record key discussion points and track follow-up tasks
              </p>
            </div>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Textarea
                      className="h-48"
                      placeholder="Add meeting notes, key takeaways, or decisions made..."
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      data-testid="textarea-call-notes"
                    />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <h3 className="font-semibold">AI Summary</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Real-time summaries of themes, decisions, and next steps appear here during the call.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Items Section */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Action Items</h3>
              <Button onClick={addNewItem} className="gap-2" data-testid="button-add-action-item">
                <PlusCircle className="w-4 h-4" />
                Add Action Item
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Task</th>
                        <th className="text-left p-3 font-medium">Owner</th>
                        <th className="text-left p-3 font-medium">Due</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-right p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actionItems.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <Input
                              value={item.task}
                              onChange={(e) => updateItem(idx, 'task', e.target.value)}
                              placeholder="Enter task"
                              data-testid={`input-task-${idx}`}
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              value={item.owner}
                              onChange={(e) => updateItem(idx, 'owner', e.target.value)}
                              placeholder="Owner"
                              data-testid={`input-owner-${idx}`}
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              value={item.due}
                              onChange={(e) => updateItem(idx, 'due', e.target.value)}
                              placeholder="Due date"
                              data-testid={`input-due-${idx}`}
                            />
                          </td>
                          <td className="p-3">
                            <Select value={item.status} onValueChange={(v) => updateItem(idx, 'status', v)}>
                              <SelectTrigger className="w-full" data-testid={`select-status-${idx}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Blocked">Blocked</SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteItem(idx)}
                              data-testid={`button-delete-${idx}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {currentStep === 'insights' && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">Insights</h2>
              <p className="text-muted-foreground">
                AI-generated strategic insights and recommendations
              </p>
            </div>

            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <Card key={idx} className={`border-2 ${getCategoryColor(insight.category)}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(insight.category)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{insight.category}</Badge>
                          <Badge variant="secondary">{insight.flag}</Badge>
                        </div>
                        <CardTitle className="text-lg">{insight.insight}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Why:</p>
                      <p className="text-sm text-muted-foreground">{insight.why}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Recommendation:</p>
                      <p className="text-sm text-muted-foreground">{insight.reco}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {currentStep === 'archive' && (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-2">Archive</h2>
              <p className="text-muted-foreground">
                Historical quarterly strategy calls
              </p>
            </div>

            <div className="space-y-3">
              {archivedCalls.map((call, idx) => (
                <Card key={idx} className="hover-elevate cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{call.quarter}</h3>
                        <p className="text-sm text-muted-foreground">{call.date}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{call.attendees}</p>
                          <p>Attendees</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{call.actionItems}</p>
                          <p>Action Items</p>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-view-${call.quarter}`}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
    </div>
  );

  if (!feature || !feature.steps) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={feature.steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={
        <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b sticky top-0 z-10 bg-white">
            <QuickActions module="StrategyStudio" />
          </div>
          {content}
        </div>
      }
      moduleColor={module?.color}
      featureName="Quarterly Strategy Call"
    />
  );
}
