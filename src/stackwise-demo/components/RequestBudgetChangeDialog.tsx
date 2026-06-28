import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/stackwise-demo/components/ui/dialog";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Textarea } from "@/stackwise-demo/components/ui/textarea";
import { Checkbox } from "@/stackwise-demo/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/stackwise-demo/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/stackwise-demo/components/ui/select";
import { Plus, Trash2, DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/stackwise-demo/lib/queryClient";

interface ChannelAdjustment {
  channel: string;
  currentBudget: number;
  newBudget: number;
}

interface ReallocationSource {
  channel: string;
  amount: number;
}

interface RequestBudgetChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableChannels: string[]; // All channels with budgets
  channelBudgets: Record<string, number>; // Current budget by channel
  recommendationContext?: string; // Pre-fill from recommendation
  suggestedAdjustments?: ChannelAdjustment[]; // Pre-filled adjustments
  sourceFeature?: string; // Where the request originated
}

export function RequestBudgetChangeDialog({
  open,
  onOpenChange,
  availableChannels,
  channelBudgets,
  recommendationContext,
  suggestedAdjustments,
  sourceFeature = "manual",
}: RequestBudgetChangeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [adjustments, setAdjustments] = useState<ChannelAdjustment[]>([]);
  const [fundingSource, setFundingSource] = useState<'contingency' | 'reallocation' | 'increase'>('contingency');
  const [reallocationSources, setReallocationSources] = useState<ReallocationSource[]>([]);
  const [notes, setNotes] = useState('');

  // Initialize with suggested adjustments if provided
  useEffect(() => {
    if (suggestedAdjustments && suggestedAdjustments.length > 0) {
      const channels = suggestedAdjustments.map(a => a.channel);
      setSelectedChannels(channels);
      setAdjustments(suggestedAdjustments);
    }
  }, [suggestedAdjustments]);

  // Calculate preview
  const calculatePreview = () => {
    const totalIncrease = adjustments.reduce((sum, adj) => {
      const diff = adj.newBudget - adj.currentBudget;
      return sum + (diff > 0 ? diff : 0);
    }, 0);

    const totalDecrease = adjustments.reduce((sum, adj) => {
      const diff = adj.currentBudget - adj.newBudget;
      return sum + (diff > 0 ? diff : 0);
    }, 0);

    const reallocationTotal = reallocationSources.reduce((sum, source) => sum + source.amount, 0);

    let contingencyUsed = 0;
    let netChange = 0;

    if (fundingSource === 'contingency') {
      contingencyUsed = totalIncrease - totalDecrease;
      netChange = 0;
    } else if (fundingSource === 'reallocation') {
      contingencyUsed = 0;
      netChange = totalIncrease - totalDecrease - reallocationTotal;
    } else {
      // increase
      contingencyUsed = 0;
      netChange = totalIncrease - totalDecrease;
    }

    return {
      totalIncrease,
      totalDecrease,
      netChange,
      contingencyUsed,
      reallocationTotal,
    };
  };

  const preview = calculatePreview();

  // Handle channel selection
  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
      setAdjustments(adjustments.filter(a => a.channel !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
      setAdjustments([
        ...adjustments,
        {
          channel,
          currentBudget: channelBudgets[channel] || 0,
          newBudget: channelBudgets[channel] || 0,
        },
      ]);
    }
  };

  // Update adjustment
  const updateAdjustment = (channel: string, newBudget: number) => {
    setAdjustments(
      adjustments.map(adj =>
        adj.channel === channel ? { ...adj, newBudget } : adj
      )
    );
  };

  // Add reallocation source
  const addReallocationSource = () => {
    const availableSources = availableChannels.filter(
      ch => !reallocationSources.find(rs => rs.channel === ch) && !selectedChannels.includes(ch)
    );
    if (availableSources.length > 0) {
      setReallocationSources([
        ...reallocationSources,
        { channel: availableSources[0], amount: 0 },
      ]);
    }
  };

  // Remove reallocation source
  const removeReallocationSource = (index: number) => {
    setReallocationSources(reallocationSources.filter((_, i) => i !== index));
  };

  // Update reallocation source
  const updateReallocationSource = (index: number, field: 'channel' | 'amount', value: string | number) => {
    setReallocationSources(
      reallocationSources.map((source, i) =>
        i === index ? { ...source, [field]: value } : source
      )
    );
  };

  // Submit mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/budget-change-requests', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/budget-change-requests'] });
      toast({
        title: 'Budget Change Request Submitted',
        description: 'Your request has been sent to the Reallocation Center for review.',
      });
      onOpenChange(false);
      // Reset form
      setSelectedChannels([]);
      setAdjustments([]);
      setFundingSource('contingency');
      setReallocationSources([]);
      setNotes('');
    },
  });

  const handleSubmit = () => {
    if (adjustments.length === 0) {
      toast({
        title: 'No Changes',
        description: 'Please select at least one channel to adjust.',
        variant: 'destructive',
      });
      return;
    }

    const requestData = {
      userId: 'current-user', // TODO: Get from auth
      requestedBy: 'Current User', // TODO: Get from auth
      channelAdjustments: adjustments,
      fundingSource,
      reallocationDetails: fundingSource === 'reallocation' ? reallocationSources : null,
      contingencyAmount: fundingSource === 'contingency' ? preview.contingencyUsed : 0,
      increaseAmount: fundingSource === 'increase' ? preview.netChange : 0,
      netChange: preview.netChange,
      contingencyUsed: preview.contingencyUsed,
      reason: notes,
      recommendationContext,
      sourceFeature,
    };

    createRequestMutation.mutate(requestData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Budget Change</DialogTitle>
          <DialogDescription>
            Submit a budget reallocation request for admin review and approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recommendation Context */}
          {recommendationContext && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Recommendation Context</p>
                    <p className="text-sm text-blue-700 mt-1">{recommendationContext}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Channels with Budgets */}
          <div>
            <Label className="text-base font-semibold">Channels with Budgets</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the channels you want to adjust
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableChannels.map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${channel}`}
                    checked={selectedChannels.includes(channel)}
                    onCheckedChange={() => toggleChannel(channel)}
                    data-testid={`checkbox-channel-${channel}`}
                  />
                  <label
                    htmlFor={`channel-${channel}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {channel} (${channelBudgets[channel]?.toLocaleString()})
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Adjust Budgets */}
          {adjustments.length > 0 && (
            <div>
              <Label className="text-base font-semibold">Adjust Budgets</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Set new budget amounts for selected channels
              </p>
              <div className="space-y-3">
                {adjustments.map((adj) => (
                  <div key={adj.channel} className="flex items-center gap-4 p-3 border rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{adj.channel}</p>
                      <p className="text-xs text-muted-foreground">
                        Current: ${adj.currentBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`new-${adj.channel}`} className="text-sm whitespace-nowrap">
                        New:
                      </Label>
                      <Input
                        id={`new-${adj.channel}`}
                        type="number"
                        value={adj.newBudget}
                        onChange={(e) => updateAdjustment(adj.channel, parseInt(e.target.value) || 0)}
                        className="w-32"
                        data-testid={`input-new-budget-${adj.channel}`}
                      />
                    </div>
                    <Badge
                      variant={adj.newBudget > adj.currentBudget ? 'default' : 'secondary'}
                      className="whitespace-nowrap"
                    >
                      {adj.newBudget > adj.currentBudget ? '+' : ''}
                      ${(adj.newBudget - adj.currentBudget).toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funding Source */}
          {adjustments.length > 0 && (
            <div>
              <Label className="text-base font-semibold">Funding Source</Label>
              <p className="text-sm text-muted-foreground mb-3">
                How will this budget change be funded?
              </p>
              <RadioGroup value={fundingSource} onValueChange={(value: any) => setFundingSource(value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contingency" id="contingency" data-testid="radio-contingency" />
                    <Label htmlFor="contingency" className="cursor-pointer">Contingency Fund</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reallocation" id="reallocation" data-testid="radio-reallocation" />
                    <Label htmlFor="reallocation" className="cursor-pointer">Reallocate From</Label>
                  </div>

                  {fundingSource === 'reallocation' && (
                    <div className="ml-6 space-y-2">
                      {reallocationSources.map((source, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select
                            value={source.channel}
                            onValueChange={(value) => updateReallocationSource(index, 'channel', value)}
                          >
                            <SelectTrigger className="w-48" data-testid={`select-realloc-channel-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableChannels
                                .filter(ch => !selectedChannels.includes(ch))
                                .map((channel) => (
                                  <SelectItem key={channel} value={channel}>
                                    {channel}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={source.amount}
                            onChange={(e) => updateReallocationSource(index, 'amount', parseInt(e.target.value) || 0)}
                            className="w-32"
                            placeholder="Amount"
                            data-testid={`input-realloc-amount-${index}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeReallocationSource(index)}
                            data-testid={`button-remove-realloc-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addReallocationSource}
                        data-testid="button-add-realloc-source"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Source
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="increase" id="increase" data-testid="radio-increase" />
                    <Label htmlFor="increase" className="cursor-pointer">Increase Monthly Budget</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Preview of Changes */}
          {adjustments.length > 0 && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Preview of Changes (Auto)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Increase:</span>
                  <span className="font-semibold text-green-600">
                    +${preview.totalIncrease.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Decrease:</span>
                  <span className="font-semibold text-red-600">
                    -${preview.totalDecrease.toLocaleString()}
                  </span>
                </div>
                {fundingSource === 'reallocation' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reallocation Total:</span>
                    <span className="font-semibold">${preview.reallocationTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="font-medium">Net Change:</span>
                  <span className={`font-bold ${preview.netChange === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    ${preview.netChange.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Contingency Used:</span>
                  <span className="font-bold">${preview.contingencyUsed.toLocaleString()}</span>
                </div>
                {preview.netChange === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Budget balanced - no net increase required</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-md mt-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Net budget increase of ${preview.netChange.toLocaleString()} required</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-semibold">
              Additional Notes <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Provide context or reasoning for this budget change
            </p>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain why this budget change is needed..."
              rows={3}
              data-testid="textarea-notes"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={adjustments.length === 0 || createRequestMutation.isPending}
            data-testid="button-submit-request"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
