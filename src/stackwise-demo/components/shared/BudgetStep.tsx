import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Label } from '@/stackwise-demo/components/ui/label';
import { Slider } from '@/stackwise-demo/components/ui/slider';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Sparkles, Lightbulb, Upload, Download } from 'lucide-react';
import { useToast } from '@/stackwise-demo/hooks/use-toast';

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

interface BudgetStepProps {
  yearlyBudget: number;
  budgetAllocation: BudgetAllocation;
  channelAllocations: ChannelAllocation;
  onYearlyBudgetChange: (value: number) => void;
  onBudgetAllocationChange: (allocation: BudgetAllocation) => void;
  onChannelAllocationsChange: (allocations: ChannelAllocation) => void;
  onNext?: () => void;
  onBack?: () => void;
  showNavigation?: boolean;
  title?: string;
  description?: string;
  coachingPrompt?: string;
  moduleColor?: string;
  previousBudget?: number;
}

export function BudgetStep({
  yearlyBudget,
  budgetAllocation,
  channelAllocations,
  onYearlyBudgetChange,
  onBudgetAllocationChange,
  onChannelAllocationsChange,
  onNext,
  onBack,
  showNavigation = true,
  title = "Budget & Resource Planning",
  description = "Build a budget that flexes with your strategy.",
  coachingPrompt = "Budgets don't predict performance — they make decisions visible. Let Flight Deck flag the risks before they become problems.",
  moduleColor,
  previousBudget,
}: BudgetStepProps) {
  const { toast } = useToast();
  const totalBudget = Object.values(budgetAllocation).reduce((sum, val) => sum + val, 0);
  const isBudgetValid = totalBudget === 100;
  const monthlyBudget = yearlyBudget / 12;

  const handleDownloadTemplate = () => {
    const csvContent = `Budget Category,Percentage,Channel,Channel Percentage
Content Creation,25,Blog & Articles,40
Content Creation,25,Video Content,30
Content Creation,25,Whitepapers & Ebooks,20
Content Creation,25,Webinars,10
Paid Advertising,20,Google Ads,35
Paid Advertising,20,LinkedIn Ads,30
Paid Advertising,20,Display Ads,20
Paid Advertising,20,Retargeting,15
SEO / SEM,15,Organic SEO,60
SEO / SEM,15,Paid Search,40
Social Media,12,LinkedIn,40
Social Media,12,Twitter / X,25
Social Media,12,Facebook,20
Social Media,12,Instagram,15
Events & Sponsorships,10,Conferences,50
Events & Sponsorships,10,Webinars,30
Events & Sponsorships,10,Sponsorships,20
Tools & Software,8,Marketing Automation,40
Tools & Software,8,Analytics,30
Tools & Software,8,Content Tools,20
Tools & Software,8,Other Tools,10
Creative & Production,7,Design,50
Creative & Production,7,Video Production,30
Creative & Production,7,Photography,20
Contingency,3,Contingency Buffer,100`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stackwise_budget_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "Budget template has been downloaded. Fill it out and upload to import your budget.",
    });
  };

  const handleUploadBudget = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        
        const newBudgetAllocation: any = {};
        const newChannelAllocations: any = {};

        lines.forEach(line => {
          const [category, categoryPct, channel, channelPct] = line.split(',').map(s => s.trim());
          if (!category) return;

          const categoryKey = category.toLowerCase().replace(/\s+&\s+/g, '').replace(/\s+/g, '');
          const channelKey = channel?.toLowerCase().replace(/\s+\/\s+/g, '').replace(/\s+/g, '').replace(/&/g, '') || '';

          if (!newBudgetAllocation[categoryKey]) {
            newBudgetAllocation[categoryKey] = parseFloat(categoryPct) || 0;
            newChannelAllocations[categoryKey] = {};
          }

          if (channelKey) {
            newChannelAllocations[categoryKey][channelKey] = parseFloat(channelPct) || 0;
          }
        });

        onBudgetAllocationChange(newBudgetAllocation as BudgetAllocation);
        onChannelAllocationsChange(newChannelAllocations as ChannelAllocation);

        toast({
          title: "Budget Uploaded",
          description: "Your budget allocations have been imported successfully.",
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

  const budgetCategories = [
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
      key: 'seoSem',
      label: 'SEO / SEM',
      channels: [
        { key: 'organicSeo', label: 'Organic SEO' },
        { key: 'paidSearch', label: 'Paid Search' }
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
          Set your annual budget and distribute it across channels. Stackwise automatically calculates monthly targets and tracks spend alignment.
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

      {/* Upload/Download Budget */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Import Budget</h4>
              <p className="text-xs text-muted-foreground">
                Download our template, fill it with your budget data, and upload to quickly populate allocations.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                data-testid="button-download-template"
              >
                <Download className="w-3 h-3 mr-2" />
                Download Template
              </Button>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleUploadBudget}
                  className="hidden"
                  data-testid="input-upload-budget"
                />
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                  data-testid="button-upload-budget"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  Upload Budget
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annual Budget Input */}
      <div className="space-y-2">
        <Label htmlFor="yearly-budget">Annual Marketing Budget</Label>
        <p className="text-xs text-muted-foreground">
          Your total spend for the year. We'll calculate monthly allocations automatically.
        </p>
        {previousBudget && (
          <p className="text-sm text-muted-foreground">Last year: ${previousBudget.toLocaleString()}</p>
        )}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="yearly-budget"
            type="number"
            placeholder="500000"
            value={yearlyBudget || ""}
            onChange={(e) => onYearlyBudgetChange(parseFloat(e.target.value) || 0)}
            className="pl-8"
            data-testid="input-yearly-budget"
          />
        </div>
        {yearlyBudget > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Budget:</span>
                <span className="text-lg font-bold text-blue-600">
                  ${monthlyBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically calculated from annual budget
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Allocation with Sliders */}
      {yearlyBudget > 0 && (
        <>
          <Card className={`p-4 ${isBudgetValid ? 'border-green-500' : 'border-orange-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Total Allocation</span>
              <span className={`text-xl font-bold ${isBudgetValid ? 'text-green-600' : 'text-orange-600'}`}>
                {totalBudget}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isBudgetValid ? '✓ Budget is balanced' : '⚠ Budget must total 100%'}
            </p>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetCategories.map((category) => {
              const categoryValue = budgetAllocation[category.key as keyof BudgetAllocation];
              const channels = channelAllocations[category.key as keyof ChannelAllocation];
              const channelTotal = Object.values(channels).reduce((sum: number, val) => sum + (val as number), 0);
              const monthlyAmount = (monthlyBudget * categoryValue) / 100;

              return (
                <Card key={category.key} className="p-4">
                  <div className="space-y-4">
                    {/* Category Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{category.label}</h3>
                        <Badge variant="secondary">{categoryValue || 0}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        ${monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                      </div>
                      <Slider
                        value={[categoryValue || 0]}
                        onValueChange={(value) => {
                          onBudgetAllocationChange({
                            ...budgetAllocation,
                            [category.key]: value[0]
                          });
                        }}
                        max={100}
                        step={1}
                        className="mb-2"
                        data-testid={`slider-budget-${category.key}`}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
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
              disabled={yearlyBudget === 0 || !isBudgetValid}
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
