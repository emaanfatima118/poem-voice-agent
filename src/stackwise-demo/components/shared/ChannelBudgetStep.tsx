import { Card, CardContent, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Label } from '@/stackwise-demo/components/ui/label';
import { Slider } from '@/stackwise-demo/components/ui/slider';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Lightbulb, Sparkles } from 'lucide-react';

interface ChannelAllocation {
  contentCreation: {
    blog: number;
    video: number;
    whitepapersEbooks: number;
    webinars: number;
  };
  paidAdvertising: {
    googleAds: number;
    linkedInAds: number;
    displayAds: number;
    retargeting: number;
  };
  seoSem: {
    organicSeo: number;
    paidSearch: number;
  };
  socialMedia: {
    linkedin: number;
    twitter: number;
    facebook: number;
    instagram: number;
  };
  eventsSponsorships: {
    conferences: number;
    webinars: number;
    sponsorships: number;
  };
  toolsSoftware: {
    marketingAutomation: number;
    analytics: number;
    contentTools: number;
    other: number;
  };
  creativePro: {
    design: number;
    videoProduction: number;
    photography: number;
  };
  contingency: {
    buffer: number;
  };
}

interface BudgetAllocation {
  contentCreation: number;
  paidAdvertising: number;
  seoSem: number;
  socialMedia: number;
  eventsSponsorships: number;
  toolsSoftware: number;
  creativePro: number;
  contingency: number;
}

interface ChannelBudgetStepProps {
  yearlyBudget: number;
  budgetAllocation: BudgetAllocation;
  channelAllocations: ChannelAllocation;
  onChannelAllocationsChange: (allocations: ChannelAllocation) => void;
  onNext?: () => void;
  onBack?: () => void;
  showNavigation?: boolean;
  title?: string;
  description?: string;
  coachingPrompt?: string;
  moduleColor?: string;
}

export function ChannelBudgetStep({
  yearlyBudget,
  budgetAllocation,
  channelAllocations,
  onChannelAllocationsChange,
  onNext,
  onBack,
  showNavigation = true,
  title = "Channel Budget Distribution",
  description = "Allocate budget within each category across specific channels",
  coachingPrompt = "Distribute your category budgets across specific channels based on performance data and strategic priorities. Each category's channels should total 100%.",
  moduleColor,
}: ChannelBudgetStepProps) {
  const monthlyBudget = yearlyBudget / 12;

  const budgetCategories = [
    {
      key: 'paidAdvertising',
      label: 'Paid Advertising',
      channels: [
        { key: 'googleAds', label: 'Google Ads' },
        { key: 'linkedInAds', label: 'LinkedIn Ads' },
        { key: 'displayAds', label: 'Display Ads' },
        { key: 'retargeting', label: 'Retargeting' }
      ]
    },
    {
      key: 'socialMedia',
      label: 'Social Media',
      channels: [
        { key: 'linkedin', label: 'LinkedIn' },
        { key: 'twitter', label: 'Twitter / X' },
        { key: 'facebook', label: 'Facebook' },
        { key: 'instagram', label: 'Instagram' }
      ]
    },
    {
      key: 'contentCreation',
      label: 'Content Creation',
      channels: [
        { key: 'blog', label: 'Blog & Articles' },
        { key: 'video', label: 'Video Content' },
        { key: 'whitepapersEbooks', label: 'Whitepapers & Ebooks' },
        { key: 'webinars', label: 'Webinars' }
      ]
    },
    {
      key: 'seoSem',
      label: 'SEO / SEM',
      channels: [
        { key: 'organicSeo', label: 'Organic SEO' },
        { key: 'paidSearch', label: 'Paid Search' }
      ]
    },
    {
      key: 'eventsSponsorships',
      label: 'Events & Sponsorships',
      channels: [
        { key: 'conferences', label: 'Conferences' },
        { key: 'webinars', label: 'Webinars' },
        { key: 'sponsorships', label: 'Sponsorships' }
      ]
    },
    {
      key: 'toolsSoftware',
      label: 'Tools & Software',
      channels: [
        { key: 'marketingAutomation', label: 'Marketing Automation' },
        { key: 'analytics', label: 'Analytics' },
        { key: 'contentTools', label: 'Content Tools' },
        { key: 'other', label: 'Other Tools' }
      ]
    },
    {
      key: 'creativePro',
      label: 'Creative & Production',
      channels: [
        { key: 'design', label: 'Design' },
        { key: 'videoProduction', label: 'Video Production' },
        { key: 'photography', label: 'Photography' }
      ]
    },
    {
      key: 'contingency',
      label: 'Contingency',
      channels: [
        { key: 'buffer', label: 'Contingency Buffer' }
      ]
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-1">{description}</p>
        <p className="text-sm text-muted-foreground">
          Distribute your category budgets to specific channels. Each category should total 100%.
        </p>
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

      {/* Channel Distribution by Category */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetCategories.map((category) => {
          const categoryValue = budgetAllocation[category.key as keyof BudgetAllocation];
          const channels = channelAllocations[category.key as keyof ChannelAllocation];
          const channelTotal = Object.values(channels).reduce((sum: number, val) => sum + (val as number), 0);
          const categoryMonthlyBudget = (monthlyBudget * categoryValue) / 100;

          return (
            <Card key={category.key} className="p-4">
              <div className="space-y-4">
                {/* Category Header */}
                <div className="pb-3 border-b">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{category.label}</h3>
                    <Badge variant="secondary">{categoryValue}%</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${categoryMonthlyBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                  </div>
                </div>

                {/* Channel Sliders */}
                <div className="space-y-3">
                  {category.channels.map((channel) => {
                    const channelValue = (channels[channel.key as keyof typeof channels] as number) || 0;
                    return (
                      <div key={channel.key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">{channel.label}</Label>
                          <span className="text-xs font-medium">{channelValue}%</span>
                        </div>
                        <Slider
                          value={[channelValue]}
                          onValueChange={(value) => {
                            onChannelAllocationsChange({
                              ...channelAllocations,
                              [category.key]: {
                                ...channels,
                                [channel.key]: value[0]
                              }
                            });
                          }}
                          max={100}
                          step={5}
                          className="h-2"
                          data-testid={`slider-channel-${category.key}-${channel.key}`}
                        />
                      </div>
                    );
                  })}
                  
                  {/* Channel Total Validation */}
                  <div className={`text-xs pt-2 border-t font-semibold ${channelTotal === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    Total: {channelTotal}% {channelTotal === 100 ? '✓' : '⚠'}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

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
