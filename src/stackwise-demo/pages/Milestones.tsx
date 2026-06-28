import { useState } from "react";
import { Card } from "@/stackwise-demo/components/ui/card";
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
import { Plus, CheckCircle2, Circle, GripVertical, X, Edit } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  timeframe: "30" | "60" | "90";
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed";
  assignee?: string;
}

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Launch Q2 content campaign",
      description: "Coordinate multi-channel content launch",
      timeframe: "30",
      priority: "high",
      status: "in_progress",
      assignee: "Marketing Team",
    },
    {
      id: "2",
      title: "Optimize email workflows",
      timeframe: "30",
      priority: "medium",
      status: "pending",
    },
    {
      id: "3",
      title: "Review analytics dashboard",
      timeframe: "60",
      priority: "medium",
      status: "pending",
    },
    {
      id: "4",
      title: "Plan Q3 strategy refresh",
      timeframe: "90",
      priority: "high",
      status: "pending",
    },
  ]);

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    timeframe: "30" as "30" | "60" | "90",
    priority: "medium" as const,
    status: "pending" as const,
    assignee: "",
  });

  const [showDialog, setShowDialog] = useState(false);

  const getMilestonesByTimeframe = (timeframe: "30" | "60" | "90") => {
    return milestones.filter((m) => m.timeframe === timeframe);
  };

  const handleAddMilestone = () => {
    if (newMilestone.title.trim()) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        ...newMilestone,
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({
        title: "",
        description: "",
        timeframe: "30",
        priority: "medium",
        status: "pending",
        assignee: "",
      });
      setShowDialog(false);
    }
  };

  const toggleStatus = (id: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              status:
                m.status === "completed"
                  ? "pending"
                  : m.status === "pending"
                  ? "in_progress"
                  : "completed",
            }
          : m
      )
    );
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

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

  const getStatusIcon = (status: string) => {
    if (status === "completed") {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === "in_progress") {
      return <Circle className="w-5 h-5 text-blue-600 fill-blue-200" />;
    }
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  const renderColumn = (timeframe: "30" | "60" | "90", title: string, color: string) => {
    const columnMilestones = getMilestonesByTimeframe(timeframe);
    const completedCount = columnMilestones.filter((m) => m.status === "completed").length;

    return (
      <div className="flex-1 min-w-[300px]">
        <Card className={`p-4 border-t-4 ${color} mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Badge variant="secondary">
              {completedCount}/{columnMilestones.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {timeframe === "30" && "Quick wins and immediate actions"}
            {timeframe === "60" && "Medium-term strategic moves"}
            {timeframe === "90" && "Long-term planning and preparation"}
          </p>
        </Card>

        <div className="space-y-3">
          {columnMilestones.map((milestone) => (
            <Card
              key={milestone.id}
              className={`p-4 hover-elevate cursor-pointer ${
                milestone.status === "completed" ? "opacity-60" : ""
              }`}
              data-testid={`milestone-${milestone.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing mt-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
                <div
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => toggleStatus(milestone.id)}
                  data-testid={`checkbox-${milestone.id}`}
                >
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4
                      className={`font-medium text-sm ${
                        milestone.status === "completed" ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {milestone.title}
                    </h4>
                    <Badge className={`${getPriorityColor(milestone.priority)} flex-shrink-0 text-xs`}>
                      {milestone.priority}
                    </Badge>
                  </div>
                  {milestone.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {milestone.description}
                    </p>
                  )}
                  {milestone.assignee && (
                    <p className="text-xs text-muted-foreground">
                      Assignee: {milestone.assignee}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    data-testid={`button-delete-${milestone.id}`}
                    onClick={() => deleteMilestone(milestone.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {columnMilestones.length === 0 && (
            <Card className="p-6 text-center border-dashed">
              <p className="text-sm text-muted-foreground">
                No milestones in this timeframe
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">30/60/90 Milestones</h1>
            <p className="text-muted-foreground">
              Drag to reorder, click to update status, manually add or delete milestones
            </p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-milestone">
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Milestone</DialogTitle>
                <DialogDescription>
                  Create a new milestone for your strategic timeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter milestone title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    data-testid="input-milestone-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add details about this milestone"
                    value={newMilestone.description}
                    onChange={(e) =>
                      setNewMilestone({ ...newMilestone, description: e.target.value })
                    }
                    rows={3}
                    data-testid="input-milestone-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timeframe</Label>
                    <Select
                      value={newMilestone.timeframe}
                      onValueChange={(value: any) =>
                        setNewMilestone({ ...newMilestone, timeframe: value })
                      }
                    >
                      <SelectTrigger data-testid="select-timeframe">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                        <SelectItem value="90">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newMilestone.priority}
                      onValueChange={(value: any) =>
                        setNewMilestone({ ...newMilestone, priority: value })
                      }
                    >
                      <SelectTrigger data-testid="select-milestone-priority">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee (Optional)</Label>
                  <Input
                    id="assignee"
                    placeholder="Who's responsible?"
                    value={newMilestone.assignee}
                    onChange={(e) =>
                      setNewMilestone({ ...newMilestone, assignee: e.target.value })
                    }
                    data-testid="input-milestone-assignee"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMilestone} data-testid="button-save-milestone">
                  Add Milestone
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {renderColumn("30", "30-Day Milestones", "border-t-green-500")}
          {renderColumn("60", "60-Day Milestones", "border-t-blue-500")}
          {renderColumn("90", "90-Day Milestones", "border-t-purple-500")}
        </div>
      </div>
    </div>
  );
}
