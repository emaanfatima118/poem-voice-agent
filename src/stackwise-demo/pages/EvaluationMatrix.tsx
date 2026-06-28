import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Label } from "@/stackwise-demo/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/stackwise-demo/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/stackwise-demo/components/ui/dialog";
import { NavBar } from "@/stackwise-demo/components/NavBar";
import { Plus, ArrowRight, Sparkles, GripVertical, TrendingUp, Target, AlertTriangle } from "lucide-react";

interface MatrixItem {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  risk: "low" | "medium" | "high";
  timeframe?: "30" | "60" | "90" | "completed";
  assignee?: string;
  completedDate?: string;
}

export default function EvaluationMatrix() {
  const [items, setItems] = useState<MatrixItem[]>([
    {
      id: "1",
      title: "Launch Q2 content campaign",
      priority: "high",
      risk: "medium",
      description: "Coordinate multi-channel content launch for new product feature",
      timeframe: "30",
    },
    {
      id: "2",
      title: "Optimize email workflows",
      priority: "medium",
      risk: "low",
      description: "Improve email automation sequences to increase engagement",
      timeframe: "60",
    },
    {
      id: "3",
      title: "Experiment with LinkedIn ads",
      priority: "low",
      risk: "high",
      description: "Test new ad formats and targeting strategies",
    },
    {
      id: "4",
      title: "Revamp product messaging",
      priority: "critical",
      risk: "medium",
      description: "Align all marketing materials with new positioning",
      timeframe: "30",
    },
    {
      id: "5",
      title: "Build customer community",
      priority: "medium",
      risk: "medium",
      description: "Launch community forum and engagement programs",
      timeframe: "90",
    },
    {
      id: "6",
      title: "Influencer partnership program",
      priority: "high",
      risk: "high",
      description: "Partner with industry thought leaders for brand awareness",
    },
    {
      id: "7",
      title: "SEO content overhaul",
      priority: "high",
      risk: "low",
      description: "Optimize existing content for search rankings",
      timeframe: "60",
    },
    {
      id: "8",
      title: "Event sponsorship strategy",
      priority: "low",
      risk: "medium",
      description: "Evaluate ROI on industry events and conferences",
      timeframe: "90",
    },
    {
      id: "9",
      title: "Website redesign project",
      priority: "high",
      risk: "medium",
      description: "Complete overhaul of corporate website",
      timeframe: "completed",
      completedDate: "Oct 15, 2025",
    },
    {
      id: "10",
      title: "Sales enablement materials",
      priority: "medium",
      risk: "low",
      description: "Create pitch decks and one-pagers for sales team",
      timeframe: "completed",
      completedDate: "Oct 28, 2025",
    },
    {
      id: "11",
      title: "Competitor analysis report",
      priority: "high",
      risk: "low",
      description: "Comprehensive analysis of top 5 competitors",
      timeframe: "completed",
      completedDate: "Nov 2, 2025",
    },
  ]);

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    risk: "medium" as const,
  });

  const [showDialog, setShowDialog] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-blue-500 text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-950/20";
      case "medium":
        return "border-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case "low":
        return "border-green-500 bg-green-50 dark:bg-green-950/20";
      default:
        return "";
    }
  };

  const handleAddItem = () => {
    if (newItem.title.trim()) {
      const item: MatrixItem = {
        id: Date.now().toString(),
        ...newItem,
      };
      setItems([...items, item]);
      setNewItem({
        title: "",
        description: "",
        priority: "medium",
        risk: "medium",
      });
      setShowDialog(false);
    }
  };

  const handleRoute = (itemId: string, timeframe: "30" | "60" | "90") => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, timeframe } : item
    ));
  };

  const getRecommendedTimeframe = (priority: string, risk: string) => {
    if (priority === "critical" || priority === "high") {
      return risk === "high" ? "60" : "30";
    }
    if (priority === "medium") {
      return "60";
    }
    return "90";
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Evaluation Matrix</h1>
            <p className="text-muted-foreground">
              Prioritize and route milestones strategically using priority and risk
            </p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-item">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>
                  Define a new milestone or initiative to evaluate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter milestone title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    data-testid="input-item-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add details about this milestone"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    rows={3}
                    data-testid="input-item-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newItem.priority}
                      onValueChange={(value: any) => setNewItem({ ...newItem, priority: value })}
                    >
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Risk</Label>
                    <Select
                      value={newItem.risk}
                      onValueChange={(value: any) => setNewItem({ ...newItem, risk: value })}
                    >
                      <SelectTrigger data-testid="select-risk">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} data-testid="button-save-item">
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-2xl font-bold">{items.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-2xl font-bold">{items.filter(i => i.timeframe).length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Routed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-2xl font-bold">{items.filter(i => i.priority === 'critical' || i.priority === 'high').length}</span>
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-2xl font-bold">{items.filter(i => i.risk === 'high').length}</span>
              </div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </CardContent>
          </Card>
        </div>

        {/* Matrix Grid Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Priority × Risk Matrix</CardTitle>
            <p className="text-sm text-muted-foreground">Visual distribution of items across priority and risk dimensions</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {/* Headers */}
              <div></div>
              <div className="text-center text-sm font-medium text-muted-foreground">Low Risk</div>
              <div className="text-center text-sm font-medium text-muted-foreground">Medium Risk</div>
              <div className="text-center text-sm font-medium text-muted-foreground">High Risk</div>

              {/* Critical Priority Row */}
              <div className="text-sm font-medium text-muted-foreground flex items-center">Critical</div>
              <div className="border-2 border-green-200 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">
                  {items.filter(i => i.priority === 'critical' && i.risk === 'low').length}
                </span>
              </div>
              <div className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">
                  {items.filter(i => i.priority === 'critical' && i.risk === 'medium').length}
                </span>
              </div>
              <div className="border-2 border-red-200 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">
                  {items.filter(i => i.priority === 'critical' && i.risk === 'high').length}
                </span>
              </div>

              {/* High Priority Row */}
              <div className="text-sm font-medium text-muted-foreground flex items-center">High</div>
              <div className="border-2 border-green-200 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">
                  {items.filter(i => i.priority === 'high' && i.risk === 'low').length}
                </span>
              </div>
              <div className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">
                  {items.filter(i => i.priority === 'high' && i.risk === 'medium').length}
                </span>
              </div>
              <div className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">
                  {items.filter(i => i.priority === 'high' && i.risk === 'high').length}
                </span>
              </div>

              {/* Medium Priority Row */}
              <div className="text-sm font-medium text-muted-foreground flex items-center">Medium</div>
              <div className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {items.filter(i => i.priority === 'medium' && i.risk === 'low').length}
                </span>
              </div>
              <div className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {items.filter(i => i.priority === 'medium' && i.risk === 'medium').length}
                </span>
              </div>
              <div className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">
                  {items.filter(i => i.priority === 'medium' && i.risk === 'high').length}
                </span>
              </div>

              {/* Low Priority Row */}
              <div className="text-sm font-medium text-muted-foreground flex items-center">Low</div>
              <div className="border-2 border-gray-200 bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {items.filter(i => i.priority === 'low' && i.risk === 'low').length}
                </span>
              </div>
              <div className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {items.filter(i => i.priority === 'low' && i.risk === 'medium').length}
                </span>
              </div>
              <div className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg min-h-[80px] flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">
                  {items.filter(i => i.priority === 'low' && i.risk === 'high').length}
                </span>
              </div>
            </div>

            {/* Timeline Distribution */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold mb-4">Timeline Distribution</h4>
              <div className="grid grid-cols-4 gap-4">
                {/* 30-Day */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {items.filter(i => i.timeframe === '30').length}
                  </div>
                  <div className="text-sm text-muted-foreground">30-Day</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(items.filter(i => i.timeframe === '30').length / items.filter(i => i.timeframe && i.timeframe !== 'completed').length) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* 60-Day */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {items.filter(i => i.timeframe === '60').length}
                  </div>
                  <div className="text-sm text-muted-foreground">60-Day</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${(items.filter(i => i.timeframe === '60').length / items.filter(i => i.timeframe && i.timeframe !== 'completed').length) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* 90-Day */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {items.filter(i => i.timeframe === '90').length}
                  </div>
                  <div className="text-sm text-muted-foreground">90-Day</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(items.filter(i => i.timeframe === '90').length / items.filter(i => i.timeframe && i.timeframe !== 'completed').length) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Completed */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-1">
                    {items.filter(i => i.timeframe === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-600 rounded-full"
                      style={{ width: `100%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Completed Items with Date Stamps */}
              {items.filter(i => i.timeframe === 'completed').length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Recently Completed</h4>
                  <div className="space-y-2">
                    {items
                      .filter(i => i.timeframe === 'completed')
                      .map(item => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.completedDate}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Matrix */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Drag items to reorder. Use priority and risk to route to 30/60/90 milestones.
                </p>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className={`p-4 border-l-4 ${getRiskColor(item.risk)}`}
                    data-testid={`matrix-item-${item.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Route to:</span>
                          {item.timeframe ? (
                            <Badge variant="secondary">
                              {item.timeframe}-day milestone
                            </Badge>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => handleRoute(item.id, "30")}
                                data-testid={`button-route-30-${item.id}`}
                              >
                                30 days
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => handleRoute(item.id, "60")}
                                data-testid={`button-route-60-${item.id}`}
                              >
                                60 days
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => handleRoute(item.id, "90")}
                                data-testid={`button-route-90-${item.id}`}
                              >
                                90 days
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                Suggested:{" "}
                                <span className="font-medium">
                                  {getRecommendedTimeframe(item.priority, item.risk)} days
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {items.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No items in the matrix yet
                  </p>
                  <Button variant="outline" onClick={() => setShowDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Item
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Guide */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">How It Works</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">1. Add Items</h4>
                  <p className="text-muted-foreground">
                    Capture milestones, initiatives, or decisions
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">2. Assess Priority & Risk</h4>
                  <p className="text-muted-foreground">
                    Evaluate importance and uncertainty
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">3. Route to Timeline</h4>
                  <p className="text-muted-foreground">
                    Assign to 30, 60, or 90-day milestones
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Priority Levels</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-600 text-white">Critical</Badge>
                  <span className="text-xs text-muted-foreground">Urgent & essential</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white">High</Badge>
                  <span className="text-xs text-muted-foreground">Important soon</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 text-white">Medium</Badge>
                  <span className="text-xs text-muted-foreground">Standard timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-500 text-white">Low</Badge>
                  <span className="text-xs text-muted-foreground">Future consideration</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">AI Suggestion</h4>
                  <p className="text-sm text-muted-foreground">
                    High-priority, medium-risk items typically fit best in the 30-day timeline
                    for quick wins with manageable uncertainty.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button size="lg" data-testid="button-view-milestones">
            View 30/60/90 Milestones
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
