import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/stackwise-demo/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/stackwise-demo/components/ui/dialog";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/stackwise-demo/components/ui/select";
import { Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/stackwise-demo/lib/queryClient";
import { useToast } from "@/stackwise-demo/hooks/use-toast";

interface AddToMyPlaysButtonProps {
  sourceModule: string;
  sourceType: string;
  sourceId?: string;
  defaultTitle?: string;
  defaultSummary?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToMyPlaysButton({
  sourceModule,
  sourceType,
  sourceId,
  defaultTitle = "",
  defaultSummary = "",
  variant = "outline",
  size = "sm",
  className = "",
}: AddToMyPlaysButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [summary, setSummary] = useState(defaultSummary);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("medium");
  const [quarterTarget, setQuarterTarget] = useState("Q1-2025");

  const createPlayMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/plays", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plays"] });
      toast({
        title: "Added to My Plays",
        description: "This item has been saved for your next quarterly review",
      });
      setOpen(false);
      // Reset form
      setTitle(defaultTitle);
      setSummary(defaultSummary);
      setNotes("");
      setPriority("medium");
      setQuarterTarget("Q1-2025");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to My Plays. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for this play",
        variant: "destructive",
      });
      return;
    }

    createPlayMutation.mutate({
      sourceModule,
      sourceType,
      sourceId,
      title,
      summary,
      notes,
      priority,
      quarterTarget,
      status: "captured",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className} data-testid="button-add-to-my-plays">
          <Sparkles className="w-4 h-4 mr-2" />
          Add to My Plays
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add to My Plays</DialogTitle>
          <DialogDescription>
            Capture this item for review during your next quarterly check-in
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="play-title">Title *</Label>
            <Input
              id="play-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this play a descriptive title"
              data-testid="input-play-title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="play-summary">Summary</Label>
            <Textarea
              id="play-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of what this is about"
              rows={2}
              data-testid="textarea-play-summary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="play-notes">Notes</Label>
            <Textarea
              id="play-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context, action items, or thoughts..."
              rows={3}
              data-testid="textarea-play-notes"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger data-testid="select-play-priority">
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
              <Label>Target Quarter</Label>
              <Select value={quarterTarget} onValueChange={setQuarterTarget}>
                <SelectTrigger data-testid="select-play-quarter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1-2025">Q1 2025</SelectItem>
                  <SelectItem value="Q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="Q3-2025">Q3 2025</SelectItem>
                  <SelectItem value="Q4-2025">Q4 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={createPlayMutation.isPending}
            data-testid="button-save-play"
          >
            {createPlayMutation.isPending ? "Saving..." : "Save to My Plays"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
