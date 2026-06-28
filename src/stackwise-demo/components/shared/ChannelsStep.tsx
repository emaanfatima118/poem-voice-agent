import { Card, CardContent } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Label } from '@/stackwise-demo/components/ui/label';
import { Textarea } from '@/stackwise-demo/components/ui/textarea';
import { Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';

export const channelOptions = [
  "LinkedIn",
  "X (Twitter)",
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube",
  "Blog / SEO",
  "Email Nurture",
  "Webinars",
  "Events / Conferences",
  "Podcasts",
  "Paid Search (Google Ads)",
  "Display Ads",
  "PR / Media",
  "Partnerships",
  "Community Building",
];

interface ChannelDetails {
  [key: string]: {
    goal: string;
    audience: string;
    contentType: string;
    successMetric: string;
  };
}

interface ChannelsStepProps {
  selectedChannels: string[];
  customChannel: string;
  channelDetails: ChannelDetails;
  onChannelsChange: (channels: string[]) => void;
  onCustomChannelChange: (customChannel: string) => void;
  onChannelDetailsChange: (details: ChannelDetails) => void;
  onNext?: () => void;
  onBack?: () => void;
  showNavigation?: boolean;
  title?: string;
  description?: string;
  subtitle?: string;
  coachingPrompt?: string;
  moduleColor?: string;
}

export function ChannelsStep({
  selectedChannels,
  customChannel,
  channelDetails,
  onChannelsChange,
  onCustomChannelChange,
  onChannelDetailsChange,
  onNext,
  onBack,
  showNavigation = true,
  title = "Channels",
  description = "Identify where and how you'll show up.",
  subtitle = "Every brand has channels that work harder than others. This step helps you find focus — where to lean in, where to test, and where to pause. You'll start light, with room to evolve each quarter.",
  coachingPrompt = "Start where you can sustain, not where you can be everywhere. Focus wins more often than volume — especially when it's consistent.",
  moduleColor,
}: ChannelsStepProps) {
  const toggleArrayItem = (arr: string[], item: string) => {
    if (arr.includes(item)) {
      return arr.filter((i) => i !== item);
    } else {
      return [...arr, item];
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-1">{description}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Coaching Prompt */}
      <Card 
        className="border-l-4" 
        style={{ borderLeftColor: moduleColor || 'purple' }}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            {moduleColor ? (
              <Lightbulb className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: moduleColor }} />
            ) : (
              <Sparkles className="w-4 h-4 inline flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">
              <strong>Coaching Prompt:</strong> {coachingPrompt}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Channel Selection */}
      <div className="space-y-4">
        <div>
          <Label>Pick your primary channels for this cycle (choose up to 5)</Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {channelOptions.map((channel) => (
            <Button
              key={channel}
              variant={selectedChannels.includes(channel) ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() =>
                onChannelsChange(toggleArrayItem(selectedChannels, channel))
              }
              disabled={selectedChannels.length >= 5 && !selectedChannels.includes(channel)}
              data-testid={`channel-${channel.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-").replace(/\(/g, "").replace(/\)/g, "")}`}
            >
              {selectedChannels.includes(channel) && (
                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="text-left">{channel}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-channel">Add your own →</Label>
          <Textarea
            id="custom-channel"
            placeholder="Describe your custom channel..."
            value={customChannel}
            onChange={(e) => onCustomChannelChange(e.target.value)}
            rows={2}
            data-testid="input-custom-channel"
          />
        </div>
      </div>

      {/* Channel Focus Prompts */}
      {selectedChannels.length > 0 && (
        <div className="space-y-4">
          <div>
            <Label>Channel Focus Prompts</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Define your direction for each selected channel
            </p>
          </div>

          {selectedChannels.map((channel) => {
            const channelKey = channel.toLowerCase().replace(/\s+/g, "_");
            const details = channelDetails[channelKey] || {
              goal: "",
              audience: "",
              contentType: "",
              successMetric: "",
            };

            return (
              <Card key={channel} className="p-4">
                <h4 className="font-medium mb-3">{channel}</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`${channelKey}-goal`} className="text-xs">
                      What's the main goal for this channel?
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                      e.g., awareness, engagement, conversion
                    </p>
                    <Textarea
                      id={`${channelKey}-goal`}
                      placeholder="Main goal..."
                      value={details.goal}
                      onChange={(e) =>
                        onChannelDetailsChange({
                          ...channelDetails,
                          [channelKey]: { ...details, goal: e.target.value },
                        })
                      }
                      rows={1}
                      data-testid={`${channelKey}-goal`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${channelKey}-audience`} className="text-xs">
                      Who are you trying to reach here?
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                      e.g., decision-makers, early adopters, existing customers
                    </p>
                    <Textarea
                      id={`${channelKey}-audience`}
                      placeholder="Target audience..."
                      value={details.audience}
                      onChange={(e) =>
                        onChannelDetailsChange({
                          ...channelDetails,
                          [channelKey]: { ...details, audience: e.target.value },
                        })
                      }
                      rows={1}
                      data-testid={`${channelKey}-audience`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${channelKey}-content`} className="text-xs">
                      What kind of content will you share?
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                      e.g., thought leadership, product updates, case studies
                    </p>
                    <Textarea
                      id={`${channelKey}-content`}
                      placeholder="Content type..."
                      value={details.contentType}
                      onChange={(e) =>
                        onChannelDetailsChange({
                          ...channelDetails,
                          [channelKey]: { ...details, contentType: e.target.value },
                        })
                      }
                      rows={1}
                      data-testid={`${channelKey}-content`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${channelKey}-metric`} className="text-xs">
                      How will you measure success?
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1">
                      e.g., clicks, engagement rate, leads generated
                    </p>
                    <Textarea
                      id={`${channelKey}-metric`}
                      placeholder="Success metric..."
                      value={details.successMetric}
                      onChange={(e) =>
                        onChannelDetailsChange({
                          ...channelDetails,
                          [channelKey]: { ...details, successMetric: e.target.value },
                        })
                      }
                      rows={1}
                      data-testid={`${channelKey}-metric`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showNavigation && (
        <div className="flex justify-between pt-4">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              data-testid="button-back"
            >
              Back
            </Button>
          )}
          {onNext && (
            <Button
              onClick={onNext}
              data-testid="button-next"
              className="ml-auto"
            >
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
