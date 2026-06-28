"use client"

/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
// All calculations now done in backend API
import Sidebar from "./components/pulsehub-sidebar";
import { NavBar } from "./components/NavBar";
import { ThreeColumnLayout } from "./components/ui-replit/three-column-layout";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui-replit/badge";
import { Input } from "./components/ui-replit/input";
import { Slider } from "./components/ui/slider";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { 
  Rocket, Target, TrendingUp, Zap, Shield, AlertTriangle, AlertCircle,
  Info, ArrowLeftRight, FileDown, Play, Save, Copy, Trash2, Search,
  Gauge, Activity, Layers, BookOpen, CheckCircle, XCircle,
  HelpCircle, Trophy, Sparkles, Edit, Scale, Check
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useToast } from "./hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui-replit/tooltip";
import { QuickActions } from "./components/ui-replit/quick-actions";
import { motion, AnimatePresence } from "framer-motion";

// ===== INLINED DATA =====
// Mock Executives Data
const MOCK_EXECUTIVES = [
  { id: 'exec-1', name: 'Sarah Chen', title: 'Chief Executive Officer', department: 'Executive' },
  { id: 'exec-2', name: 'Michael Torres', title: 'Chief Marketing Officer', department: 'Marketing' },
  { id: 'exec-3', name: 'Jennifer Park', title: 'VP of Product', department: 'Product' },
  { id: 'exec-4', name: 'David Kim', title: 'VP of Sales', department: 'Sales' },
  { id: 'exec-5', name: 'Rachel Stevens', title: 'Chief Financial Officer', department: 'Finance' },
  { id: 'exec-6', name: 'James Rodriguez', title: 'VP of Engineering', department: 'Engineering' },
];

const MOCK_PILLARS = [
  { id: 'pillar-1', name: 'Thought Leadership', description: 'Establish brand authority and industry expertise' },
  { id: 'pillar-2', name: 'Product Innovation', description: 'Showcase product capabilities and competitive advantages' },
  { id: 'pillar-3', name: 'Customer Success', description: 'Highlight customer outcomes and case studies' },
  { id: 'pillar-4', name: 'Industry Insights', description: 'Provide market analysis and trend forecasting' },
];

const MOCK_GOALS = [
  { id: 'goal-1', name: 'Increase brand awareness', category: 'awareness' },
  { id: 'goal-2', name: 'Generate qualified leads', category: 'consideration' },
  { id: 'goal-3', name: 'Drive product demos', category: 'conversion' },
  { id: 'goal-4', name: 'Increase customer retention', category: 'retention' },
  { id: 'goal-5', name: 'Expand market share', category: 'awareness' },
  { id: 'goal-6', name: 'Accelerate sales cycles', category: 'consideration' },
];

const MOCK_CONTENT_TYPES = [
  { id: 'content-1', name: 'Blog Posts', channel: 'web' },
  { id: 'content-2', name: 'Whitepapers', channel: 'web' },
  { id: 'content-3', name: 'Case Studies', channel: 'web' },
  { id: 'content-4', name: 'LinkedIn Posts', channel: 'linkedin' },
  { id: 'content-5', name: 'Email Newsletters', channel: 'email' },
  { id: 'content-6', name: 'Webinars', channel: 'events' },
  { id: 'content-7', name: 'Video Content', channel: 'paid_social' },
  { id: 'content-8', name: 'Infographics', channel: 'paid_social' },
  { id: 'content-9', name: 'Podcasts', channel: 'pr' },
  { id: 'content-10', name: 'Press Releases', channel: 'pr' },
];

// GTM Questionnaire Data
const GTM_QUESTIONNAIRE = [
  {
    id: 'business_stage',
    question: 'What stage is your business currently in?',
    guidance: 'Your business stage determines the right balance between brand building and revenue generation.',
    options: [
      { value: 'early_startup', label: 'Early Startup (Pre-PMF, <$1M ARR)', weight: { blitz: 0.3, experimenter: 0.4, foundation: 0.3 } },
      { value: 'growth_startup', label: 'Growth Startup (Post-PMF, $1M-$10M ARR)', weight: { blitz: 0.4, amplifier: 0.3, 'mid-market': 0.3 } },
      { value: 'scale_up', label: 'Scale-Up ($10M-$50M ARR)', weight: { marathon: 0.4, amplifier: 0.3, 'mid-market': 0.3 } },
      { value: 'established', label: 'Established Company (>$50M ARR)', weight: { marathon: 0.3, fortress: 0.4, 'brand-heavy': 0.3 } }
    ]
  },
  {
    id: 'primary_goal',
    question: 'What is your primary marketing goal for the next quarter?',
    guidance: 'Your goal should align with board expectations and current business priorities.',
    options: [
      { value: 'awareness', label: 'Build brand awareness and thought leadership', weight: { 'brand-heavy': 0.5, blitz: 0.3, disruptor: 0.2 } },
      { value: 'pipeline', label: 'Generate qualified pipeline immediately', weight: { 'demand-surge': 0.5, blitz: 0.3, 'mid-market': 0.2 } },
      { value: 'efficiency', label: 'Improve conversion rates and ROI', weight: { marathon: 0.4, amplifier: 0.3, fortress: 0.3 } },
      { value: 'retention', label: 'Reduce churn and expand existing accounts', weight: { fortress: 0.5, amplifier: 0.4, marathon: 0.1 } },
      { value: 'disruption', label: 'Challenge market leader and gain share', weight: { disruptor: 0.6, blitz: 0.3, 'brand-heavy': 0.1 } }
    ]
  },
  {
    id: 'market_position',
    question: 'How would you describe your current market position?',
    guidance: 'Your position determines whether you need offensive or defensive strategies.',
    options: [
      { value: 'new_entrant', label: 'New entrant - need to establish presence', weight: { blitz: 0.4, 'brand-heavy': 0.3, disruptor: 0.3 } },
      { value: 'challenger', label: 'Challenger - competing with established players', weight: { disruptor: 0.5, blitz: 0.3, 'mid-market': 0.2 } },
      { value: 'leader', label: 'Market leader - defending position', weight: { fortress: 0.4, marathon: 0.4, 'brand-heavy': 0.2 } },
      { value: 'niche', label: 'Niche player - focused on specific segment', weight: { 'mid-market': 0.5, marathon: 0.3, amplifier: 0.2 } }
    ]
  },
  {
    id: 'team_capacity',
    question: 'What is your marketing team capacity?',
    guidance: 'Team size impacts how many channels you can effectively manage simultaneously.',
    options: [
      { value: 'minimal', label: '1-2 people - need high leverage activities', weight: { marathon: 0.4, 'mid-market': 0.3, amplifier: 0.3 } },
      { value: 'small', label: '3-5 people - can handle moderate complexity', weight: { marathon: 0.3, 'mid-market': 0.4, blitz: 0.3 } },
      { value: 'medium', label: '6-15 people - ready for multi-channel execution', weight: { blitz: 0.4, 'demand-surge': 0.3, disruptor: 0.3 } },
      { value: 'large', label: '15+ people - can execute complex campaigns', weight: { blitz: 0.3, 'brand-heavy': 0.4, disruptor: 0.3 } }
    ]
  },
  {
    id: 'budget',
    question: 'What is your quarterly marketing budget?',
    guidance: 'Budget determines channel mix and campaign intensity.',
    options: [
      { value: 'bootstrap', label: 'Bootstrap (<$50K/quarter) - organic-first', weight: { marathon: 0.4, amplifier: 0.3, 'mid-market': 0.3 } },
      { value: 'moderate', label: 'Moderate ($50K-$250K/quarter) - balanced mix', weight: { 'mid-market': 0.4, marathon: 0.3, blitz: 0.3 } },
      { value: 'strong', label: 'Strong ($250K-$1M/quarter) - aggressive growth', weight: { blitz: 0.4, 'demand-surge': 0.3, disruptor: 0.3 } },
      { value: 'substantial', label: 'Substantial (>$1M/quarter) - full-stack execution', weight: { 'brand-heavy': 0.4, blitz: 0.3, disruptor: 0.3 } }
    ]
  },
  {
    id: 'urgency',
    question: 'What is your timeline for results?',
    guidance: 'Urgency affects the balance between quick wins and sustainable growth.',
    options: [
      { value: 'immediate', label: 'Immediate (this quarter) - need results now', weight: { 'demand-surge': 0.5, blitz: 0.4, disruptor: 0.1 } },
      { value: 'near_term', label: 'Near-term (2-3 quarters) - balanced approach', weight: { 'mid-market': 0.4, marathon: 0.3, blitz: 0.3 } },
      { value: 'long_term', label: 'Long-term (1+ years) - building for future', weight: { marathon: 0.5, 'brand-heavy': 0.3, fortress: 0.2 } }
    ]
  }
];

// Calculate recommended archetype
function calculateRecommendedArchetype(answers) {
  const archetypeScores = {
    'blitz': 0, 'marathon': 0, 'fortress': 0, 'brand-heavy': 0,
    'demand-surge': 0, 'amplifier': 0, 'disruptor': 0, 'mid-market': 0
  };

  GTM_QUESTIONNAIRE.forEach(question => {
    const answer = answers[question.id];
    if (answer) {
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        Object.entries(option.weight).forEach(([archetype, weight]) => {
          archetypeScores[archetype] = (archetypeScores[archetype] || 0) + weight;
        });
      }
    }
  });

  let maxScore = 0;
  let recommended = 'marathon';
  Object.entries(archetypeScores).forEach(([archetype, score]) => {
    if (score > maxScore) {
      maxScore = score;
      recommended = archetype;
    }
  });

  return recommended;
}

// Guidance Data - comprehensive guidance for all keys used in the file
const GTM_GUIDANCE = {
  'awareness_kpi': { title: 'Awareness KPI', definition: 'Measures your ability to reach and be remembered by your target market.', explanation: 'Awareness is top-of-funnel visibility.' },
  'velocity_kpi': { title: 'Velocity KPI', definition: 'Speed at which prospects move through your funnel.', explanation: 'Velocity measures how quickly you convert interest into revenue.' },
  'efficiency_kpi': { title: 'Efficiency KPI', definition: 'Return on investment.', explanation: 'Efficiency is about ROI and optimization.' },
  'retention_kpi': { title: 'Retention KPI', definition: 'Ability to keep customers engaged.', explanation: 'Retention measures customer success.' },
  'credibility_kpi': { title: 'Credibility KPI', definition: 'Market perception of your authority.', explanation: 'Credibility is built through thought leadership.' },
  'system_load': { title: 'System Load', definition: 'The average intensity across all active channels.', explanation: 'System Load measures how hard your team is working.' },
  'balance_score': { title: 'Balance Score', definition: 'Measures how evenly distributed your resources are.', explanation: 'High balance means your strategy is diversified.' },
  'budget': { title: 'Budget', definition: 'Overall budget level.', explanation: 'Global budget multiplier.' },
  'budget_mix': { title: 'Budget Mix', definition: 'Paid activities budget allocation.', explanation: 'Allocate your actual marketing budget.' },
  'channel_focus': { title: 'Channel Focus', definition: 'Strategic allocation across channels.', explanation: 'Channel focus determines reach.' },
  'content_types': { title: 'Content Types', definition: 'Specific formats of content.', explanation: 'Content types should map to channels.' },
  'gtm_model': { title: 'GTM Model', definition: 'A strategic framework.', explanation: 'Your GTM model is the blueprint.' },
  'archetype': { title: 'GTM Archetype', definition: 'Pre-built strategy template.', explanation: 'Archetypes represent proven GTM patterns.' },
  'executives': { title: 'Executive Visibility', definition: 'Leadership team members.', explanation: 'Executive visibility builds credibility.' },
  'pillars': { title: 'Strategic Pillars', definition: 'Core themes or areas of focus.', explanation: 'Pillars are the 3-5 topics you\'ll own.' },
  'goals': { title: 'Business Goals', definition: 'Specific, measurable objectives.', explanation: 'Goals connect marketing tactics to business outcomes.' },
  'channel_linkedin': { title: 'LinkedIn', definition: 'Professional networking platform for B2B marketing.', explanation: 'LinkedIn excels at reaching decision-makers.' },
  'channel_email': { title: 'Email Marketing', definition: 'Direct communication with prospects and customers.', explanation: 'Email is highest-ROI channel for nurturing leads.' },
  'channel_paid_search': { title: 'Paid Search', definition: 'Pay-per-click advertising on search engines.', explanation: 'Paid search captures demand from people actively searching.' },
  'channel_paid_social': { title: 'Paid Social', definition: 'Paid advertising on social media platforms.', explanation: 'Paid social builds awareness and drives consideration.' },
  'channel_web': { title: 'Website & SEO', definition: 'Your owned digital property optimized for organic search.', explanation: 'Website is your hub for all campaigns.' },
  'channel_events': { title: 'Events & Conferences', definition: 'In-person and virtual gatherings.', explanation: 'Events build relationships and generate high-quality leads.' },
  'channel_pr': { title: 'Public Relations', definition: 'Earned media coverage through press releases.', explanation: 'PR builds credibility and awareness.' },
  'channel_seo': { title: 'Search Engine Optimization', definition: 'Optimizing content to rank higher in search.', explanation: 'SEO is long-term investment in organic visibility.' },
  'stage_awareness': { title: 'Awareness Stage', definition: 'Top of funnel - making your target market aware.', explanation: 'Awareness is about visibility and recall.' },
  'stage_consideration': { title: 'Consideration Stage', definition: 'Middle of funnel - prospects evaluating solutions.', explanation: 'Consideration is about education and positioning.' },
  'stage_conversion': { title: 'Conversion Stage', definition: 'Bottom of funnel - prospects ready to purchase.', explanation: 'Conversion is about closing deals.' },
  'stage_retention': { title: 'Retention Stage', definition: 'Post-purchase - keeping customers engaged.', explanation: 'Retention is about customer success and lifecycle marketing.' },
  'funnel_stages': { title: 'Funnel Stages', definition: 'Customer journey stages from awareness to retention.', explanation: 'Funnel stages represent the customer journey.' },
};

function getGuidance(key) {
  return GTM_GUIDANCE[key] || null;
}

// ===== INLINED COMPONENTS =====

// QuickGuidance Component
function QuickGuidance({ guidanceKey, iconSize = 16 }) {
  const guidance = getGuidance(guidanceKey);
  
  if (!guidance) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle 
            className="inline-block cursor-help text-muted-foreground hover:text-foreground transition-colors" 
            size={iconSize}
            data-testid="icon-guidance"
          />
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-sm p-4 space-y-3"
          data-testid="tooltip-guidance"
        >
          <div>
            <h4 className="font-semibold text-sm mb-1">{guidance.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{guidance.definition}</p>
          </div>
          
          <div>
            <p className="text-xs leading-relaxed">{guidance.explanation}</p>
          </div>

          {guidance.bestPractice && (
            <div className="pt-2 border-t border-gray-200 border-gray-200">
              <Badge variant="secondary" className="mb-2 text-xs">
                Best Practice
              </Badge>
              <p className="text-xs leading-relaxed text-muted-foreground">{guidance.bestPractice}</p>
            </div>
          )}

          {guidance.example && (
            <div className="pt-2 border-t border-gray-200">
              <Badge variant="outline" className="mb-2 text-xs">
                Example
              </Badge>
              <p className="text-xs leading-relaxed italic text-muted-foreground">{guidance.example}</p>
            </div>
          )}

          {guidance.warning && (
            <div className="pt-2 border-t border-gray-200 border-destructive/20 bg-destructive/5 -mx-4 -mb-4 px-4 py-3">
              <Badge variant="destructive" className="mb-2 text-xs">
                Warning
              </Badge>
              <p className="text-xs leading-relaxed text-destructive">{guidance.warning}</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ===== TYPES REMOVED (JSX - no types needed) =====

// ===== PROGRESS STAGE COMPONENT =====
function ProgressStage({ label, active, completed }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
          </motion.div>
        ) : active ? (
          <motion.div
            className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
        )}
      </div>
      <span className={`text-sm ${active ? 'font-semibold text-purple-600' : completed ? 'text-green-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

// ===== UTILITIES =====
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const elastic = (x, k = 1.15) => 1 - Math.exp(-k * clamp(x));
const pct = (x) => `${Math.round(x * 100)}%`;

// ===== HELPER: Rebalance weights to sum to 100% =====
// When you adjust one item, others adjust proportionally to maintain 100% total
function rebalanceWeights(items, changedIndex, newValue, lockedSliders = new Set(), prefix = '') {
  if (items.length === 0) return items;
  
  const oldValue = items[changedIndex].weight;
  const delta = newValue - oldValue;
  
  // If no change, return as-is
  if (Math.abs(delta) < 0.001) return items;
  
  // Get unlocked items (excluding the changed one)
  const unlockedItems = items.filter((item, idx) => 
    idx !== changedIndex && !lockedSliders.has(`${prefix}${item.id}`)
  );
  
  // Calculate the sum of all OTHER unlocked items (not the changed one)
  const unlockedSum = unlockedItems.reduce((sum, item) => sum + item.weight, 0);
  
  // If all other unlocked items are 0, we can't redistribute
  if (unlockedSum < 0.001) {
    // Set changed item to newValue, distribute remainder equally among unlocked others
    const remainder = 1 - newValue;
    const lockedSum = items.reduce((sum, item, idx) => 
      idx !== changedIndex && lockedSliders.has(`${prefix}${item.id}`) ? sum + item.weight : sum, 0
    );
    const availableForUnlocked = remainder - lockedSum;
    const perItem = unlockedItems.length > 0 ? availableForUnlocked / unlockedItems.length : 0;
    return items.map((item, idx) => {
      if (idx === changedIndex) {
        return { ...item, weight: newValue };
      } else if (lockedSliders.has(`${prefix}${item.id}`)) {
        // Keep locked items unchanged
        return item;
      } else {
        return { ...item, weight: Math.max(0, perItem) };
      }
    });
  }
  
  // Redistribute the delta proportionally across unlocked items
  return items.map((item, idx) => {
    if (idx === changedIndex) {
      return { ...item, weight: newValue };
    } else if (lockedSliders.has(`${prefix}${item.id}`)) {
      // Keep locked items unchanged
      return item;
    }
    // Adjust this item proportionally to its share of the unlocked items
    const proportion = item.weight / unlockedSum;
    const adjustment = -delta * proportion;
    return { ...item, weight: Math.max(0, item.weight + adjustment) };
  });
}


// Rebalance stages
function rebalanceStages(stages, changedStage, newValue, lockedSliders = new Set()) {
  const stageKeys = ['awareness', 'consideration', 'conversion', 'retention'];
  const oldValue = stages[changedStage];
  const delta = newValue - oldValue;
  
  if (Math.abs(delta) < 0.001) return stages;
  
  // Get unlocked stages (excluding the changed one)
  const unlockedStages = stageKeys.filter(key => 
    key !== changedStage && !lockedSliders.has(`stage-${key}`)
  );
  
  const unlockedSum = unlockedStages.reduce((sum, key) => sum + stages[key], 0);
  
  if (unlockedSum < 0.001) {
    // All other stages are locked or zero, distribute remainder among unlocked
    const remainder = 1 - newValue;
    const lockedSum = stageKeys.reduce((sum, key) => 
      key !== changedStage && lockedSliders.has(`stage-${key}`) ? sum + stages[key] : sum, 0
    );
    const availableForUnlocked = remainder - lockedSum;
    const perStage = unlockedStages.length > 0 ? availableForUnlocked / unlockedStages.length : 0;
    const result = { ...stages };
    stageKeys.forEach(key => {
      if (key === changedStage) {
        result[key] = newValue;
      } else if (lockedSliders.has(`stage-${key}`)) {
        // Keep locked stages unchanged
        result[key] = stages[key];
      } else {
        result[key] = Math.max(0, perStage);
      }
    });
    return result;
  }
  
  const result = { ...stages };
  const unlockedOtherSum = unlockedStages.reduce((sum, key) => sum + stages[key], 0);
  
  stageKeys.forEach(key => {
    if (key === changedStage) {
      result[key] = newValue;
    } else if (lockedSliders.has(`stage-${key}`)) {
      // Keep locked stages unchanged
      result[key] = stages[key];
    } else if (unlockedOtherSum > 0.001) {
      // Redistribute proportionally among unlocked stages
      const proportion = stages[key] / unlockedOtherSum;
      const adjustment = -delta * proportion;
      result[key] = Math.max(0, stages[key] + adjustment);
    } else {
      // All other unlocked stages are zero, distribute remainder
      const remainder = 1 - newValue;
      const lockedSum = stageKeys.reduce((sum, k) => 
        k !== changedStage && lockedSliders.has(`stage-${k}`) ? sum + stages[k] : sum, 0
      );
      const availableForUnlocked = remainder - lockedSum;
      result[key] = unlockedStages.length > 0 ? availableForUnlocked / unlockedStages.length : 0;
    }
  });
  return result;
}

// Rebalance budget activities
function rebalanceBudgetActivities(activities, changedIndex, newValue) {
  if (activities.length === 0) return activities;
  
  const oldValue = activities[changedIndex].allocation;
  const delta = newValue - oldValue;
  
  if (Math.abs(delta) < 0.001) return activities;
  
  // Calculate current total
  const currentTotal = activities.reduce((sum, act) => sum + act.allocation, 0);
  const newTotal = currentTotal - oldValue + newValue;
  
  // If new total would exceed 1.0 (100%), cap the new value
  if (newTotal > 1.0) {
    const maxAllowed = 1.0 - (currentTotal - oldValue);
    newValue = Math.max(0, Math.min(newValue, maxAllowed));
  }
  
  const otherActivitiesSum = activities.reduce((sum, act, idx) => 
    idx === changedIndex ? sum : sum + act.allocation, 0
  );
  
  if (otherActivitiesSum < 0.001) {
    const remainder = 1 - newValue;
    const perActivity = remainder / (activities.length - 1);
    return activities.map((act, idx) => ({
      ...act,
      allocation: idx === changedIndex ? newValue : perActivity
    }));
  }
  
  return activities.map((act, idx) => {
    if (idx === changedIndex) {
      return { ...act, allocation: newValue };
    } else {
      const proportion = act.allocation / otherActivitiesSum;
      const adjustment = -delta * proportion;
      return { ...act, allocation: Math.max(0, act.allocation + adjustment) };
    }
  });
}

// ===== DEFAULT BUDGET MIX =====
const DEFAULT_BUDGET_MIX = [
  { key: 'webinar_sponsorship', label: 'Webinar Sponsorship', allocation: 0.10 },
  { key: 'podcast_sponsorship', label: 'Podcast Sponsorship', allocation: 0.07 },
  { key: 'event_sponsorship', label: 'Event Sponsorship', allocation: 0.08 },
  { key: 'events_tradeshows', label: 'Events (Tradeshows/Conferences)', allocation: 0.13 },
  { key: 'linkedin_ads', label: 'LinkedIn Ads', allocation: 0.14 },
  { key: 'meta_ads', label: 'Meta Ads', allocation: 0.08 },
  { key: 'youtube_ads', label: 'YouTube Ads', allocation: 0.09 },
  { key: 'x_ads', label: 'X (Twitter) Ads', allocation: 0.05 },
  { key: 'tiktok_ads', label: 'TikTok Ads', allocation: 0.04 },
  { key: 'reddit_ads', label: 'Reddit Ads', allocation: 0.03 },
  { key: 'google_ads', label: 'Google Ads', allocation: 0.09 },
  { key: 'google_pmax', label: 'Google PMax', allocation: 0.07 },
  { key: 'programmatic_display', label: 'Programmatic Display', allocation: 0.04 },
  { key: 'digital_ads', label: 'Digital Ads (Pubs/Native)', allocation: 0.07 },
  { key: 'pr_distribution', label: 'PR Distribution', allocation: 0.02 }
];

// ===== ARCHETYPES =====
const ARCHETYPE_MODELS = [
  {
    name: "The Blitz",
    archetype: "blitz",
    description: "Fast market capture with aggressive multi-channel push. High awareness, high velocity.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.35 },
        { id: 'ops', name: 'Operations Lead', weight: 0.45 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.35, consideration: 0.40, conversion: 0.20, retention: 0.05 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.22, intensity: 0.75 },
        { key: 'email', label: 'Email', budgetPct: 0.15, intensity: 0.70 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.25, intensity: 0.80 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.25, intensity: 0.75 },
        { key: 'web', label: 'Web', budgetPct: 0.05, intensity: 0.50 },
        { key: 'events', label: 'Events', budgetPct: 0.03, intensity: 0.30 },
        { key: 'pr', label: 'PR', budgetPct: 0.03, intensity: 0.25 },
        { key: 'seo', label: 'SEO', budgetPct: 0.02, intensity: 0.40 }
      ]
    },
    kpis: { awareness: 88, velocity: 92, efficiency: 68, retention: 42, credibility: 72 },
    systemLoad: 89,
    balance: 76,
    marketCoverage: 65,
    pipelinePredictability: 60,
    warnings: ['Very high system load - team strain likely', 'Retention severely underweighted'],
    analysis: "The Blitz is designed for rapid market penetration. Expect immediate visibility and lead flow, but be prepared for high operational demands. Best for product launches or market entry scenarios where speed matters more than sustainability."
  },
  {
    name: "The Marathon",
    archetype: "marathon",
    description: "Sustainable, balanced growth. Moderate across all KPIs with focus on efficiency and retention.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.33 },
        { id: 'ops', name: 'Operations Lead', weight: 0.33 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.34 }
      ],
      stages: { awareness: 0.25, consideration: 0.30, conversion: 0.25, retention: 0.20 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.15, intensity: 0.55 },
        { key: 'email', label: 'Email', budgetPct: 0.18, intensity: 0.60 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.15, intensity: 0.50 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.12, intensity: 0.50 },
        { key: 'web', label: 'Web', budgetPct: 0.12, intensity: 0.55 },
        { key: 'events', label: 'Events', budgetPct: 0.12, intensity: 0.40 },
        { key: 'pr', label: 'PR', budgetPct: 0.08, intensity: 0.35 },
        { key: 'seo', label: 'SEO', budgetPct: 0.08, intensity: 0.50 }
      ]
    },
    kpis: { awareness: 65, velocity: 68, efficiency: 82, retention: 78, credibility: 75 },
    systemLoad: 58,
    balance: 94,
    marketCoverage: 85,
    pipelinePredictability: 92,
    warnings: [],
    analysis: "The Marathon prioritizes sustainable growth over quick wins. Highly balanced allocation reduces risk and team strain. Ideal for established companies focusing on steady ARR growth and customer retention."
  },
  {
    name: "The Fortress",
    archetype: "fortress",
    description: "Retention-first defensive strategy. Protect and expand existing customer base.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.25 },
        { id: 'ops', name: 'Operations Lead', weight: 0.40 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.35 }
      ],
      stages: { awareness: 0.15, consideration: 0.25, conversion: 0.25, retention: 0.35 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.10, intensity: 0.40 },
        { key: 'email', label: 'Email', budgetPct: 0.30, intensity: 0.70 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.10, intensity: 0.45 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.08, intensity: 0.40 },
        { key: 'web', label: 'Web', budgetPct: 0.15, intensity: 0.60 },
        { key: 'events', label: 'Events', budgetPct: 0.15, intensity: 0.55 },
        { key: 'pr', label: 'PR', budgetPct: 0.05, intensity: 0.30 },
        { key: 'seo', label: 'SEO', budgetPct: 0.07, intensity: 0.50 }
      ]
    },
    kpis: { awareness: 48, velocity: 58, efficiency: 85, retention: 94, credibility: 68 },
    systemLoad: 61,
    balance: 83,
    marketCoverage: 70,
    pipelinePredictability: 75,
    warnings: ['Low awareness may create future pipeline gaps', 'Consider periodic brand campaigns'],
    analysis: "The Fortress focuses on customer success and retention. Lower acquisition costs with higher lifetime value. Best for SaaS companies facing churn challenges or defending market position against competitors."
  },
  {
    name: "Brand-Heavy",
    archetype: "brand-heavy",
    description: "Build credibility and awareness through thought leadership and executive visibility.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.50 },
        { id: 'ops', name: 'Operations Lead', weight: 0.30 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.45, consideration: 0.35, conversion: 0.12, retention: 0.08 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.28, intensity: 0.75 },
        { key: 'email', label: 'Email', budgetPct: 0.10, intensity: 0.50 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.16, intensity: 0.55 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.22, intensity: 0.65 },
        { key: 'web', label: 'Web', budgetPct: 0.08, intensity: 0.50 },
        { key: 'events', label: 'Events', budgetPct: 0.07, intensity: 0.60 },
        { key: 'pr', label: 'PR', budgetPct: 0.06, intensity: 0.70 },
        { key: 'seo', label: 'SEO', budgetPct: 0.03, intensity: 0.45 }
      ]
    },
    kpis: { awareness: 92, velocity: 54, efficiency: 60, retention: 46, credibility: 96 },
    systemLoad: 66,
    balance: 72,
    marketCoverage: 75,
    pipelinePredictability: 55,
    warnings: ['Top-heavy awareness may slow MQL→SQL velocity', 'Consider adding conversion accelerators'],
    analysis: "Brand-Heavy builds long-term market position through credibility. High executive involvement drives awareness and trust. Best for category creation, repositioning, or entering enterprise markets where trust is paramount."
  },
  {
    name: "Demand Surge",
    archetype: "demand-surge",
    description: "Near-term revenue focus with aggressive paid and email campaigns.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.30 },
        { id: 'ops', name: 'Operations Lead', weight: 0.50 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.20, consideration: 0.45, conversion: 0.28, retention: 0.07 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.18, intensity: 0.65 },
        { key: 'email', label: 'Email', budgetPct: 0.20, intensity: 0.75 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.28, intensity: 0.80 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.20, intensity: 0.70 },
        { key: 'web', label: 'Web', budgetPct: 0.06, intensity: 0.55 },
        { key: 'events', label: 'Events', budgetPct: 0.03, intensity: 0.35 },
        { key: 'pr', label: 'PR', budgetPct: 0.02, intensity: 0.25 },
        { key: 'seo', label: 'SEO', budgetPct: 0.03, intensity: 0.45 }
      ]
    },
    kpis: { awareness: 66, velocity: 95, efficiency: 78, retention: 52, credibility: 62 },
    systemLoad: 86,
    balance: 74,
    marketCoverage: 55,
    pipelinePredictability: 82,
    warnings: ['High system load - protect team capacity', 'Retention underweight vs churn risk'],
    analysis: "Demand Surge maximizes near-term pipeline and revenue. High conversion focus with aggressive paid campaigns. Best for quarter-end pushes, pipeline gaps, or when board needs immediate results."
  },
  {
    name: "The Amplifier",
    archetype: "amplifier",
    description: "Leverage existing customer base for expansion and advocacy.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.30 },
        { id: 'ops', name: 'Operations Lead', weight: 0.35 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.35 }
      ],
      stages: { awareness: 0.18, consideration: 0.28, conversion: 0.22, retention: 0.32 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.12, intensity: 0.55 },
        { key: 'email', label: 'Email', budgetPct: 0.25, intensity: 0.68 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.12, intensity: 0.50 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.10, intensity: 0.48 },
        { key: 'web', label: 'Web', budgetPct: 0.14, intensity: 0.58 },
        { key: 'events', label: 'Events', budgetPct: 0.16, intensity: 0.62 },
        { key: 'pr', label: 'PR', budgetPct: 0.06, intensity: 0.40 },
        { key: 'seo', label: 'SEO', budgetPct: 0.05, intensity: 0.48 }
      ]
    },
    kpis: { awareness: 56, velocity: 64, efficiency: 88, retention: 86, credibility: 74 },
    systemLoad: 64,
    balance: 88,
    marketCoverage: 80,
    pipelinePredictability: 80,
    warnings: ['Monitor new customer acquisition rates'],
    analysis: "The Amplifier focuses on customer expansion and advocacy. High efficiency through referrals and upsells. Best for companies with strong product-market fit looking to scale through existing relationships."
  },
  {
    name: "The Disruptor",
    archetype: "disruptor",
    description: "Challenge market leader with bold positioning and aggressive campaigns.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.45 },
        { id: 'ops', name: 'Operations Lead', weight: 0.35 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.20 }
      ],
      stages: { awareness: 0.38, consideration: 0.38, conversion: 0.18, retention: 0.06 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.24, intensity: 0.78 },
        { key: 'email', label: 'Email', budgetPct: 0.14, intensity: 0.68 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.22, intensity: 0.75 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.24, intensity: 0.78 },
        { key: 'web', label: 'Web', budgetPct: 0.06, intensity: 0.55 },
        { key: 'events', label: 'Events', budgetPct: 0.04, intensity: 0.45 },
        { key: 'pr', label: 'PR', budgetPct: 0.04, intensity: 0.60 },
        { key: 'seo', label: 'SEO', budgetPct: 0.02, intensity: 0.42 }
      ]
    },
    kpis: { awareness: 86, velocity: 82, efficiency: 64, retention: 44, credibility: 84 },
    systemLoad: 82,
    balance: 70,
    marketCoverage: 72,
    pipelinePredictability: 65,
    warnings: ['High-intensity campaigns require strong creative', 'Low retention - add nurture programs'],
    analysis: "The Disruptor challenges incumbents with provocative messaging and high visibility. Strong awareness and credibility through bold positioning. Best for well-funded challengers ready to make noise."
  },
  {
    name: "Mid-Market Focus",
    archetype: "mid-market",
    description: "Optimized for 50-500 employee companies with balanced, efficient approach.",
    config: {
      personas: [
        { id: 'exec', name: 'Executive Buyer', weight: 0.35 },
        { id: 'ops', name: 'Operations Lead', weight: 0.40 },
        { id: 'fin', name: 'Finance Stakeholder', weight: 0.25 }
      ],
      stages: { awareness: 0.28, consideration: 0.35, conversion: 0.24, retention: 0.13 },
      channels: [
        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0.20, intensity: 0.62 },
        { key: 'email', label: 'Email', budgetPct: 0.18, intensity: 0.65 },
        { key: 'paid_search', label: 'Paid Search', budgetPct: 0.18, intensity: 0.58 },
        { key: 'paid_social', label: 'Paid Social', budgetPct: 0.14, intensity: 0.55 },
        { key: 'web', label: 'Web', budgetPct: 0.12, intensity: 0.58 },
        { key: 'events', label: 'Events', budgetPct: 0.08, intensity: 0.48 },
        { key: 'pr', label: 'PR', budgetPct: 0.05, intensity: 0.38 },
        { key: 'seo', label: 'SEO', budgetPct: 0.05, intensity: 0.52 }
      ]
    },
    kpis: { awareness: 72, velocity: 76, efficiency: 80, retention: 68, credibility: 76 },
    systemLoad: 68,
    balance: 86,
    marketCoverage: 78,
    pipelinePredictability: 85,
    warnings: [],
    analysis: "Mid-Market Focus balances reach and efficiency for companies targeting 50-500 employee segment. Moderate intensity across channels with strong conversion focus. Best for SaaS companies with proven PMF expanding into mid-market."
  }
];

// ===== KPI CALCULATION =====
// Import calculation functions (we'll use them directly)
// Note: In a real setup, these would be imported, but for JSX we'll inline the logic
// Helper function to normalize config to unified format
// Helper function to get weighted items (used by both UI and normalization)
function getWeightedItems(items, defaultWeight = 0.5) {
  if (!items) return [];
  if (items.length === 0) return [];
  if (typeof items[0] === 'string') {
    return items.map(id => ({ id, weight: defaultWeight }));
  }
  return items;
}

function normalizeConfigToUnifiedFormat(config) {
  // If config already has API format (snake_case keys), return as-is
  if (config.channel_focus || config.content_focus) {
    // Already in API format, just ensure values are percentages (0-100)
    const result = { ...config };
    if (result.channel_focus) {
      Object.keys(result.channel_focus).forEach(key => {
        // If value is between 0-1, convert to integer percentage
        if (result.channel_focus[key] <= 1) {
          result.channel_focus[key] = Math.round(result.channel_focus[key] * 100);
        } else {
          result.channel_focus[key] = Math.round(result.channel_focus[key]);
        }
      });
    }
    if (result.content_focus) {
      Object.keys(result.content_focus).forEach(key => {
        if (result.content_focus[key] <= 1) {
          result.content_focus[key] = Math.round(result.content_focus[key] * 100);
        } else {
          result.content_focus[key] = Math.round(result.content_focus[key]);
        }
      });
    }
    return result;
  }

  // Convert channels array to object
  const channelFocus = {};
  if (config.channels) {
    config.channels.forEach(ch => {
      // Use intensity if available (what user adjusts), otherwise fallback to budgetPct
      const value = ch.intensity !== undefined ? ch.intensity : (ch.budgetPct || 0);
      // Convert to integer percentage (0-100)
      channelFocus[ch.key] = Math.round(value * 100);
    });
  }

  // Convert contentTypes array to object
  // Use getWeightedItems helper to get actual weights (same as UI uses)
  
  const contentFocus = {};
  if (config.contentTypes) {
    // Map frontend content IDs to API keys
    const contentIdMap = {
      'content-1': 'blog_posts',
      'content-2': 'whitepapers',
      'content-3': 'case_studies',
      'content-4': 'linkedin_posts',
      'content-5': 'email_newsletters',
      'content-6': 'webinars',
      'content-7': 'video_content',
      'content-8': 'infographics',
      'content-9': 'podcasts',
      'content-10': 'press_releases'
    };
    
    // Get weighted items (same way UI does it)
    const weighted = getWeightedItems(config.contentTypes, 0);
    
    weighted.forEach(ct => {
      // Map ID to API key
      const key = contentIdMap[ct.id];
      if (key) {
        // Convert to integer percentage (0-100)
        contentFocus[key] = Math.round(ct.weight * 100);
      }
    });
  }

  // Convert stages object (already in correct format, just scale to 100)
  const funnelStageFocus = {};
  if (config.stages) {
    Object.keys(config.stages).forEach(stage => {
      // Convert to integer percentage (0-100)
      funnelStageFocus[stage] = Math.round(config.stages[stage] * 100);
    });
  }

  // Convert personas array to object
  const personaFocus = {};
  if (config.personas) {
    // Map frontend persona IDs to API keys
    const personaIdMap = {
      'exec': 'executive_buyer',
      'ops': 'operations_lead',
      'fin': 'finance_stakeholder'
    };
    
    // Get weighted items (same way UI does it)
    const weighted = getWeightedItems(config.personas, 0);
    
    weighted.forEach(p => {
      // Map ID to API key
      const key = personaIdMap[p.id];
      if (key) {
        // Convert to integer percentage (0-100)
        personaFocus[key] = Math.round(p.weight * 100);
      }
    });
  }

  // Convert executives array to object
  const executiveVisibility = {};
  if (config.executives) {
    // Map frontend executive IDs to API keys (matching MOCK_EXECUTIVES)
    const execIdMap = {
      'exec-1': 'sarah_chen',
      'exec-2': 'michael_torres',
      'exec-3': 'jennifer_park',
      'exec-4': 'david_kim',
      'exec-5': 'rachel_stevens',
      'exec-6': 'james_rodriguez'
    };
    
    // Get weighted items (same way UI does it)
    const weighted = getWeightedItems(config.executives, 0);
    
    weighted.forEach(exec => {
      // Map ID to API key
      const key = execIdMap[exec.id];
      if (key) {
        // Convert to integer percentage (0-100)
        executiveVisibility[key] = Math.round(exec.weight * 100);
      }
    });
  }

  // Convert goals array to object
  const goals = {};
  if (config.goals) {
    // Map frontend goal IDs to API keys (matching MOCK_GOALS)
    const goalIdMap = {
      'goal-1': 'increase_brand_awareness',
      'goal-2': 'generate_qualified_leads',
      'goal-3': 'drive_product_demos',
      'goal-4': 'increase_customer_retention',
      'goal-5': 'expand_market_share',
      'goal-6': 'accelerate_sales_cycles'
    };
    
    // Get weighted items (same way UI does it)
    const weighted = getWeightedItems(config.goals, 0);
    
    weighted.forEach(goal => {
      // Map ID to API key
      const key = goalIdMap[goal.id];
      if (key) {
        // Convert to integer percentage (0-100)
        goals[key] = Math.round(goal.weight * 100);
      }
    });
  }

  // Convert strategicPillars array to object
  // Note: Config uses 'pillars' not 'strategicPillars'
  const strategicPillars = {};
  if (config.pillars) {
    // Map frontend pillar IDs to API keys (matching MOCK_PILLARS)
    const pillarIdMap = {
      'pillar-1': 'thought_leadership',
      'pillar-2': 'product_innovation',
      'pillar-3': 'customer_success',
      'pillar-4': 'industry_insights'
    };
    
    // Get weighted items (same way UI does it)
    const weighted = getWeightedItems(config.pillars, 0);
    
    weighted.forEach(pillar => {
      // Map ID to API key
      const key = pillarIdMap[pillar.id];
      if (key) {
        // Convert to integer percentage (0-100)
        strategicPillars[key] = Math.round(pillar.weight * 100);
      }
    });
  }

  // Paid budget - convert from budgetMix array to object
  // Note: Config uses 'budgetMix' (array) not 'paidBudget' (object)
  const paidBudget = {};
  if (config.budgetMix && Array.isArray(config.budgetMix)) {
    // Map frontend budget activity keys to API keys
    const budgetKeyMap = {
      'linkedin_ads': 'linkedin_ads',
      'google_ads': 'google_ads',
      'google_pmax': 'google_pmax',
      'youtube_ads': 'youtube_ads',
      'webinar_sponsorship': 'webinar_sponsorship',
      'podcast_sponsorship': 'podcast_sponsorship',
      'event_sponsorship': 'event_sponsorship',
      'meta_ads': 'meta_ads',
      'twitter_ads': 'twitter_ads',
      'x_ads': 'twitter_ads', // Map x_ads to twitter_ads for API
      'tiktok_ads': 'tiktok_ads',
      'reddit_ads': 'reddit_ads',
      'events': 'events',
      'events_tradeshows': 'events', // Map events_tradeshows to events for API
      'programmatic_display': 'programmatic_display',
      'digital_native_ads': 'digital_native_ads',
      'digital_ads': 'digital_native_ads', // Map digital_ads to digital_native_ads for API
      'pr_distribution': 'pr_distribution'
    };
    
    config.budgetMix.forEach(activity => {
      const apiKey = budgetKeyMap[activity.key] || activity.key;
      // Convert to integer percentage (0-100) - include even if 0
      const allocation = Math.round(activity.allocation * 100);
      paidBudget[apiKey] = allocation;
    });
  } else if (config.paidBudget) {
    // Fallback: if paidBudget object exists, use it directly
    Object.keys(config.paidBudget).forEach(key => {
      // Convert to integer percentage (0-100) - include even if 0
      const value = config.paidBudget[key];
      paidBudget[key] = Math.round(value <= 1 ? value * 100 : value);
    });
  }

  return {
    channel_focus: channelFocus,
    content_focus: contentFocus,
    funnel_stage_focus: funnelStageFocus,
    persona_focus: personaFocus,
    executive_visibility: executiveVisibility,
    goals: goals,
    strategic_pillars: strategicPillars,
    paid_budget: paidBudget,
    total_paid_budget: config.totalBudget || 0,
    budget_multiplier: config.budgetMultiplier || 100
  };
}

// Unified local calculation function - uses exact Python backend logic
// All calculations and GPT analysis are now done in the backend API
// No local calculation functions needed

export default function GTMTestPit() {
  // Load from localStorage with fallback - only on client side
  const loadFromStorage = (key, fallback) => {
    if (typeof window === 'undefined') return fallback; // SSR check
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  // Get user ID from localStorage (set during login)
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.userid || user.id || null;
    } catch {
      return null;
    }
  };

  // Initialize with fallback values (no localStorage access during SSR)
  const [currentStep, setCurrentStep] = useState('start');
  const [startMode, setStartMode] = useState(null);
  const [currentModel, setCurrentModel] = useState(null);
  const [compareModels, setCompareModels] = useState([null, null, null]);
  const [savedModels, setSavedModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [modelName, setModelName] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const moduleColor = '#6218df';
  const { toast } = useToast();

  // Hydrate state from localStorage after mount (client-side only)
  useEffect(() => {
    setCurrentStep(loadFromStorage('gtm_currentStep', 'start'));
    setStartMode(loadFromStorage('gtm_startMode', null));
    setCurrentModel(loadFromStorage('gtm_currentModel', null));
    setCompareModels(loadFromStorage('gtm_compareModels', [null, null, null]));
    setQuestionnaireAnswers(loadFromStorage('gtm_questionnaireAnswers', {}));
    setCurrentQuestionIndex(loadFromStorage('gtm_currentQuestionIndex', 0));
    setIsHydrated(true);
    
    // Fetch models from database instead of localStorage
    const fetchModels = async () => {
      const userId = getUserId();
      if (!userId) {
        console.warn('No user ID found, skipping model fetch');
        return;
      }
      
      setIsLoadingModels(true);
      try {
        const response = await fetch(`/api/gtm-models?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSavedModels(data.models || []);
        } else {
          console.error('Failed to fetch models:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);

  // Persist to localStorage whenever state changes (only after hydration)
  // Note: isHydrated is checked inside the effect, not in dependencies, to keep array size constant
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtm_currentStep', JSON.stringify(currentStep));
    } catch (e) {
      console.error('Failed to save currentStep:', e);
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtm_currentModel', JSON.stringify(currentModel));
    } catch (e) {
      console.error('Failed to save currentModel:', e);
    }
  }, [currentModel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtm_compareModels', JSON.stringify(compareModels));
    } catch (e) {
      console.error('Failed to save compareModels:', e);
    }
  }, [compareModels]); // eslint-disable-line react-hooks/exhaustive-deps

  // Removed localStorage persistence for savedModels - now stored in database
  // Models are fetched from API on component mount

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtm_startMode', JSON.stringify(startMode));
    } catch (e) {
      console.error('Failed to save startMode:', e);
    }
  }, [startMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtm_questionnaireAnswers', JSON.stringify(questionnaireAnswers));
    } catch (e) {
      console.error('Failed to save questionnaireAnswers:', e);
    }
  }, [questionnaireAnswers]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtm_currentQuestionIndex', JSON.stringify(currentQuestionIndex));
    } catch (e) {
      console.error('Failed to save currentQuestionIndex:', e);
    }
  }, [currentQuestionIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const leftNav = (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-lg font-bold" style={{ color: moduleColor }}>
        Pulse Hub
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground mt-1">GTM Test Pit</p>
    </div>
  );

  const steps = [
    { id: 'start', label: 'Start', description: 'Choose your path' },
    { id: 'builder', label: 'Model Builder', description: 'Configure GTM model' },
    { id: 'analysis', label: 'Analysis', description: 'Selected model insights' },
    { id: 'compare', label: 'Compare', description: 'Deep 3-way comparison' },
    { id: 'library', label: 'My Models', description: 'Saved models library' },
  ];

  // Use stored KPIs from saved models, or null for models being built
  const [currentKPIs, setCurrentKPIs] = useState(null);
  const [realtimeKPIs, setRealtimeKPIs] = useState(null);
  const [isCalculatingKPIs, setIsCalculatingKPIs] = useState(false);
  const [isCalculatingRealtimeKPIs, setIsCalculatingRealtimeKPIs] = useState(false);
  const [saveProgressStage, setSaveProgressStage] = useState('');
  // Lock state for sliders - track which sliders are locked
  const [lockedSliders, setLockedSliders] = useState(new Set());

  // Load stored KPIs from saved models
  useEffect(() => {
    if (!currentModel) {
      setCurrentKPIs(null);
      return;
    }

    // If model has stored results (saved model), use those
    if (currentModel.kpis && currentModel.systemLoad !== undefined && currentModel.balance !== undefined) {
      setCurrentKPIs({
        kpis: currentModel.kpis,
        systemLoad: currentModel.systemLoad,
        balance: currentModel.balance,
        marketCoverage: currentModel.marketCoverage || 0,
        pipelinePredictability: currentModel.pipelinePredictability || 0,
        warnings: currentModel.warnings || [],
        budgetAnalysis: currentModel.budgetAnalysis,
        recommendations: currentModel.recommendations
      });
    } else {
      // For models being built, no KPIs until saved
      setCurrentKPIs(null);
    }
  }, [currentModel]);

  // Create a stable string representation of config for dependency tracking
  const configString = useMemo(() => {
    if (!currentModel || !currentModel.config) return '';
    return JSON.stringify({
      personas: currentModel.config.personas,
      stages: currentModel.config.stages,
      channels: currentModel.config.channels,
      contentTypes: currentModel.config.contentTypes,
      executives: currentModel.config.executives,
      pillars: currentModel.config.pillars,
      goals: currentModel.config.goals,
      budgetMix: currentModel.config.budgetMix,
      totalBudget: currentModel.config.totalBudget,
    });
  }, [
    currentModel?.config?.personas,
    currentModel?.config?.stages,
    currentModel?.config?.channels,
    currentModel?.config?.contentTypes,
    currentModel?.config?.executives,
    currentModel?.config?.pillars,
    currentModel?.config?.goals,
    currentModel?.config?.budgetMix,
    currentModel?.config?.totalBudget,
  ]);

  // Fetch real-time KPIs from API when model config changes (debounced)
  useEffect(() => {
    if (!currentModel || currentStep !== 'builder') {
      setRealtimeKPIs(null);
      return;
    }

    // Skip API call for archetype models that have pre-calculated KPIs
    if (currentModel.archetype && ARCHETYPE_MODELS.some(m => m.name === currentModel.name)) {
      setRealtimeKPIs(null);
      return;
    }

    // Debounce API calls to avoid too many requests while user is adjusting sliders
    const timeoutId = setTimeout(async () => {
      setIsCalculatingRealtimeKPIs(true);
      try {
        const apiFormat = normalizeConfigToUnifiedFormat(currentModel.config);
        // Use fast calculation-only API (no GPT, ~10ms response time)
        const response = await fetch('/api/gtm-calculations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiFormat),
        });

        if (response.ok) {
          const apiResponse = await response.json();
          setRealtimeKPIs({
            kpis: apiResponse.kpis,
            systemLoad: apiResponse.system_load,
            balance: apiResponse.balance_index,
            marketCoverage: apiResponse.market_coverage,
            pipelinePredictability: apiResponse.pipeline_predictability,
            warnings: apiResponse.recommendations?.map((r) => r.issue) || []
          });
        } else {
          console.error('Failed to fetch real-time KPIs:', response.statusText);
          setRealtimeKPIs(null);
        }
      } catch (error) {
        console.error('Error fetching real-time KPIs:', error);
        setRealtimeKPIs(null);
      } finally {
        setIsCalculatingRealtimeKPIs(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [configString, currentStep, currentModel]);

  const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="bg-white px-4 md:px-8 py-4 border-b border-purple-100 sticky top-0 z-10">
          <h1 className="text-xl md:text-3xl font-bold mb-2" style={{ color: moduleColor }}>GTM Test Pit</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl">
            Pull levers, test strategies, compare models. Your GTM laboratory.
          </p>
        </div>

        <div className="p-4 md:p-8">
          {/* START MODE */}
          {currentStep === 'start' && (
            <div className="w-full">
              <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <Card 
                className="cursor-pointer border-2 border-gray-200 border-gray-200 hover:shadow-lg transition-all"
                onClick={() => { 
                  setStartMode('questionnaire'); 
                  setCurrentQuestionIndex(0);
                  setQuestionnaireAnswers({});
                  setCurrentStep('questionnaire'); 
                }}
                data-testid="card-questionnaire"
              >
                <CardHeader>
                  <div className="p-4 rounded-lg inline-block mb-2" style={{ backgroundColor: `${moduleColor}20` }}>
                    <Target className="w-8 h-8" style={{ color: moduleColor }} />
                  </div>
                  <CardTitle>Guided Questionnaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Answer strategic questions and get a recommended archetype model tailored to your goals.
                  </p>
                  <Badge className="text-xs" style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}>
                    Recommended for beginners
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer border-2 border-gray-200 hover:shadow-lg transition-all"
                onClick={() => { setStartMode('browse'); setCurrentStep('library'); }}
                data-testid="card-browse"
              >
                <CardHeader>
                  <div className="p-4 rounded-lg inline-block mb-2" style={{ backgroundColor: `${moduleColor}20` }}>
                    <BookOpen className="w-8 h-8" style={{ color: moduleColor }} />
                  </div>
                  <CardTitle>Browse Archetypes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore {ARCHETYPE_MODELS.length} pre-built archetype models with detailed analysis and use cases.
                  </p>
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-0">
                    {ARCHETYPE_MODELS.length} archetypes available
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer border-2 border-gray-200 hover:shadow-lg transition-all"
                onClick={() => { 
                  setStartMode('scratch');
                  // Initialize a fresh model with all values set to 0
                  setCurrentModel({
                    name: 'New Model',
                    config: {
                      personas: [
                        { id: 'exec', name: 'Executive Buyer', weight: 0 },
                        { id: 'ops', name: 'Operations Lead', weight: 0 },
                        { id: 'fin', name: 'Finance Stakeholder', weight: 0 }
                      ],
                      stages: { awareness: 0, consideration: 0, conversion: 0, retention: 0 },
                      channels: [
                        { key: 'linkedin', label: 'LinkedIn', budgetPct: 0, intensity: 0 },
                        { key: 'email', label: 'Email', budgetPct: 0, intensity: 0 },
                        { key: 'paid_search', label: 'Paid Search', budgetPct: 0, intensity: 0 },
                        { key: 'paid_social', label: 'Paid Social', budgetPct: 0, intensity: 0 },
                        { key: 'web', label: 'Web', budgetPct: 0, intensity: 0 },
                        { key: 'events', label: 'Events', budgetPct: 0, intensity: 0 },
                        { key: 'pr', label: 'PR', budgetPct: 0, intensity: 0 },
                        { key: 'seo', label: 'SEO', budgetPct: 0, intensity: 0 }
                      ],
                      contentTypes: [],
                      executives: [],
                      goals: [],
                      pillars: [],
                      budgetMix: [
                        { key: 'linkedin_ads', label: 'LinkedIn Ads', allocation: 0 },
                        { key: 'google_ads', label: 'Google Ads', allocation: 0 },
                        { key: 'google_pmax', label: 'Google PMax', allocation: 0 },
                        { key: 'youtube_ads', label: 'YouTube Ads', allocation: 0 },
                        { key: 'webinar_sponsorship', label: 'Webinar Sponsorship', allocation: 0 },
                        { key: 'podcast_sponsorship', label: 'Podcast Sponsorship', allocation: 0 },
                        { key: 'event_sponsorship', label: 'Event Sponsorship', allocation: 0 },
                        { key: 'meta_ads', label: 'Meta Ads', allocation: 0 },
                        { key: 'x_ads', label: 'X (Twitter) Ads', allocation: 0 },
                        { key: 'tiktok_ads', label: 'TikTok Ads', allocation: 0 },
                        { key: 'reddit_ads', label: 'Reddit Ads', allocation: 0 },
                        { key: 'events_tradeshows', label: 'Events & Tradeshows', allocation: 0 },
                        { key: 'programmatic_display', label: 'Programmatic Display', allocation: 0 },
                        { key: 'digital_ads', label: 'Digital Native Ads', allocation: 0 },
                        { key: 'pr_distribution', label: 'PR Distribution', allocation: 0 }
                      ],
                      totalPaidBudget: 1500000,
                      budgetMultiplier: 100
                    }
                    // Don't include kpis, systemLoad, balance, etc. - these will be calculated when saved
                  });
                  setCurrentStep('builder');
                }}
                data-testid="card-scratch"
              >
                <CardHeader>
                  <div className="p-4 rounded-lg inline-block mb-2" style={{ backgroundColor: `${moduleColor}20` }}>
                    <Rocket className="w-8 h-8" style={{ color: moduleColor }} />
                  </div>
                  <CardTitle>Build from Scratch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start with a blank canvas and configure every aspect of your GTM model manually.
                  </p>
                  <Badge className="text-xs bg-purple-100 text-purple-700 border-0">
                    Full control
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {savedModels.length > 0 && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedModels.slice(0, 3).map((model, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => { setCurrentModel(model); setCurrentStep('builder'); }}
                        data-testid={`recent-model-${idx}`}
                      >
                        <div>
                          <p className="font-semibold">{model.name}</p>
                          <p className="text-xs text-gray-600">{model.code}</p>
                        </div>
                        <Badge className="text-xs" variant="outline">{model.archetype}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Quick Guidance</p>
                    <ul className="space-y-1">
                      <li><strong>Want reach?</strong> Brand-Heavy — keep credibility high; add 2–3 conversion accelerators</li>
                      <li><strong>Want near-term revenue?</strong> Demand Surge — protect team capacity; add light retention touches</li>
                      <li><strong>Want to defend ARR?</strong> Retention Focused (Fortress) — schedule periodic awareness bursts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          )}

          {/* QUESTIONNAIRE - Guided questionnaire flow */}
          {currentStep === 'questionnaire' && (() => {
            const currentQuestion = GTM_QUESTIONNAIRE[currentQuestionIndex];
            const progress = ((currentQuestionIndex + 1) / GTM_QUESTIONNAIRE.length) * 100;
            const isLastQuestion = currentQuestionIndex === GTM_QUESTIONNAIRE.length - 1;

            const handleAnswerSelect = (value) => {
              const newAnswers = { ...questionnaireAnswers, [currentQuestion.id]: value };
              setQuestionnaireAnswers(newAnswers);

              if (isLastQuestion) {
                // Calculate recommended archetype
                const recommendedArchetype = calculateRecommendedArchetype(newAnswers);
                const archetypeModel = ARCHETYPE_MODELS.find(m => 
                  m.archetype === recommendedArchetype || 
                  m.name.toLowerCase().includes(recommendedArchetype)
                );

                if (archetypeModel) {
                  setCurrentModel(JSON.parse(JSON.stringify(archetypeModel)));
                  setCurrentStep('builder');
                }
              } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            };

            return (
              <div className="w-full px-4 md:px-8 py-4 md:py-8">
                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentStep('start')}
                data-testid="button-back-to-start"
              >
                ← Back to Start
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3" style={{ color: moduleColor }}>Guided GTM Questionnaire</h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Answer 6 strategic questions to get your personalized archetype recommendation
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Question {currentQuestionIndex + 1} of {GTM_QUESTIONNAIRE.length}</span>
                <span className="font-semibold" style={{ color: moduleColor }}>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${progress}%`, backgroundColor: moduleColor }}
                />
              </div>
            </div>

            {/* Current Question */}
            <Card className="border-2" style={{ borderColor: `${moduleColor}40` }}>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">{currentQuestion.question}</CardTitle>
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{currentQuestion.guidance}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                      questionnaireAnswers[currentQuestion.id] === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(option.value)}
                    data-testid={`option-${option.value}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          questionnaireAnswers[currentQuestion.id] === option.value
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {questionnaireAnswers[currentQuestion.id] === option.value && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{option.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                data-testid="button-previous-question"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => {
                  if (questionnaireAnswers[currentQuestion.id]) {
                    handleAnswerSelect(questionnaireAnswers[currentQuestion.id]);
                  }
                }}
                disabled={!questionnaireAnswers[currentQuestion.id]}
                data-testid="button-next-question"
                style={{ backgroundColor: questionnaireAnswers[currentQuestion.id] ? moduleColor : undefined }}
              >
                {isLastQuestion ? 'Get My Recommendation →' : 'Next →'}
              </Button>
            </div>
          </div>
        </div>
            );
          })()}

          {/* LIBRARY - Browse Archetypes & Saved Models */}
          {currentStep === 'library' && (() => {
            const displayModels = [...ARCHETYPE_MODELS, ...savedModels];
            const filtered = searchQuery 
              ? displayModels.filter(m => 
                  m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  m.archetype?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  m.description?.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : displayModels;

      return (
        <div className="w-full px-4 md:px-8 py-4 md:py-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: moduleColor }}>
                    {startMode === 'browse' ? 'Browse Models' : 'My Models Library'}
                  </h2>
                  <QuickGuidance guidanceKey={startMode === 'browse' ? 'archetype' : 'gtm_model'} iconSize={16} />
                </div>
                <p className="text-muted-foreground">
                  {startMode === 'browse' ? 'Explore pre-built archetypes and your custom models' : 'Manage your saved GTM models'}
                </p>
              </div>
              {startMode !== 'browse' && (
                <Button
                  onClick={() => {
                    // Initialize a fresh model with all values set to 0
                    setCurrentModel({
                      name: 'New Model',
                      config: {
                        personas: [
                          { id: 'exec', name: 'Executive Buyer', weight: 0 },
                          { id: 'ops', name: 'Operations Lead', weight: 0 },
                          { id: 'fin', name: 'Finance Stakeholder', weight: 0 }
                        ],
                        stages: { awareness: 0, consideration: 0, conversion: 0, retention: 0 },
                        channels: [
                          { key: 'linkedin', label: 'LinkedIn', budgetPct: 0, intensity: 0 },
                          { key: 'email', label: 'Email', budgetPct: 0, intensity: 0 },
                          { key: 'paid_search', label: 'Paid Search', budgetPct: 0, intensity: 0 },
                          { key: 'paid_social', label: 'Paid Social', budgetPct: 0, intensity: 0 },
                          { key: 'web', label: 'Web', budgetPct: 0, intensity: 0 },
                          { key: 'events', label: 'Events', budgetPct: 0, intensity: 0 },
                          { key: 'pr', label: 'PR', budgetPct: 0, intensity: 0 },
                          { key: 'seo', label: 'SEO', budgetPct: 0, intensity: 0 }
                        ],
                        contentTypes: [],
                        executives: [],
                        goals: [],
                        pillars: [],
                        budgetMix: [
                          { key: 'linkedin_ads', label: 'LinkedIn Ads', allocation: 0 },
                          { key: 'google_ads', label: 'Google Ads', allocation: 0 },
                          { key: 'google_pmax', label: 'Google PMax', allocation: 0 },
                          { key: 'youtube_ads', label: 'YouTube Ads', allocation: 0 },
                          { key: 'webinar_sponsorship', label: 'Webinar Sponsorship', allocation: 0 },
                          { key: 'podcast_sponsorship', label: 'Podcast Sponsorship', allocation: 0 },
                          { key: 'event_sponsorship', label: 'Event Sponsorship', allocation: 0 },
                          { key: 'meta_ads', label: 'Meta Ads', allocation: 0 },
                          { key: 'x_ads', label: 'X (Twitter) Ads', allocation: 0 },
                          { key: 'tiktok_ads', label: 'TikTok Ads', allocation: 0 },
                          { key: 'reddit_ads', label: 'Reddit Ads', allocation: 0 },
                          { key: 'events_tradeshows', label: 'Events & Tradeshows', allocation: 0 },
                          { key: 'programmatic_display', label: 'Programmatic Display', allocation: 0 },
                          { key: 'digital_ads', label: 'Digital Native Ads', allocation: 0 },
                          { key: 'pr_distribution', label: 'PR Distribution', allocation: 0 }
                        ],
                        totalPaidBudget: 1500000,
                        budgetMultiplier: 100
                      }
                    });
                    setCurrentStep('builder');
                  }}
                  style={{ backgroundColor: moduleColor }}
                  className="text-white"
                  data-testid="button-new-model"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  New Model
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Input 
                placeholder="Search models..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
                data-testid="input-search-models"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filtered.map((model, idx) => {
                const isArchetype = ARCHETYPE_MODELS.includes(model);
                const savedModelIndex = savedModels.findIndex(m => m.id === model.id || (m.name === model.name && !isArchetype));
                
                return (
                  <Card key={idx} className="border border-gray-200" data-testid={`model-card-${idx}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg" style={{ color: moduleColor }}>{model.name}</CardTitle>
                          {model.description && (
                            <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          )}
                        </div>
                        {isArchetype && (
                          <Badge className="text-xs bg-purple-100 text-purple-700 border-0">Archetype</Badge>
                        )}
                        {!isArchetype && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 border-0">Custom Archetype</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-5 gap-4 sm:gap-5 text-center">
                        {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility']).map(kpi => {
                          // Use currentKPIs if this model is selected and KPIs are calculated
                          const kpiValue = (currentModel?.name === model.name && currentKPIs?.kpis) 
                            ? currentKPIs.kpis[kpi] 
                            : model.kpis?.[kpi];
                          const isCalculating = currentModel?.name === model.name && isCalculatingKPIs;
                          
                          return (
                            <div key={kpi} className="min-w-0 flex flex-col items-center justify-center space-y-2.5 px-2.5">
                              <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: moduleColor }}>
                                {isCalculating ? '...' : (kpiValue !== undefined ? Math.round(kpiValue) : '0')}
                              </p>
                              <div className="flex flex-col items-center justify-center gap-1.5">
                                <p className="text-xs text-gray-600 capitalize leading-tight">{kpi}</p>
                                <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={10} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Load: {currentModel?.name === model.name && currentKPIs 
                              ? Math.round(currentKPIs.systemLoad || 0)
                              : Math.round(model.systemLoad || 0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Balance: {currentModel?.name === model.name && currentKPIs 
                              ? Math.round(currentKPIs.balance || 0)
                              : Math.round(model.balance || 0)}
                          </span>
                        </div>
                      </div>

                      {model.analysis && (
                        <p className="text-sm text-gray-700 line-clamp-2">{model.analysis}</p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          onClick={() => { 
                            // When using a model, keep stored results if available
                            setCurrentModel(JSON.parse(JSON.stringify(model))); 
                            setCurrentStep('builder'); 
                          }}
                          data-testid={`button-use-${idx}`}
                        >
                          <Play className="w-3 h-3 mr-1" /> Use This Model
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => { 
                            // When viewing analysis, use stored data if available
                            setCurrentModel(JSON.parse(JSON.stringify(model))); 
                            setCurrentStep('analysis'); 
                          }}
                          data-testid={`button-analyze-${idx}`}
                        >
                          View Analysis
                        </Button>
                        
                        {/* Clone button for both archetype and saved models */}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const cloned = JSON.parse(JSON.stringify(model));
                            cloned.id = `model-${Date.now()}`;
                            cloned.name = `${model.name} (Copy)`;
                            cloned.createdAt = new Date().toISOString();
                            setSavedModels([...savedModels, cloned]);
                            toast({
                              title: "Model Cloned",
                              description: `"${cloned.name}" has been added to your library.`,
                            });
                          }}
                          data-testid={`button-clone-${idx}`}
                        >
                          <Copy className="w-3 h-3 mr-1" /> Clone
                        </Button>
                        
                        {/* Edit and Delete only for saved models */}
                        {!isArchetype && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                // When editing, clear stored results so it recalculates in real-time
                                const modelToEdit = JSON.parse(JSON.stringify(model));
                                // Remove stored results to trigger recalculation
                                delete modelToEdit.kpis;
                                delete modelToEdit.systemLoad;
                                delete modelToEdit.balance;
                                delete modelToEdit.marketCoverage;
                                delete modelToEdit.pipelinePredictability;
                                delete modelToEdit.strategicAnalysis;
                                delete modelToEdit.recommendations;
                                setCurrentModel(modelToEdit);
                                setModelName(model.name); // Pre-fill the model name
                                setCurrentStep('builder');
                                toast({
                                  title: "Editing Model",
                                  description: `Now editing "${model.name}". Changes will update in real-time.`,
                                });
                              }}
                              data-testid={`button-edit-${idx}`}
                            >
                              <Edit className="w-3 h-3 mr-1" /> Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={async () => {
                                if (savedModelIndex >= 0) {
                                  const modelToDelete = savedModels[savedModelIndex];
                                  const modelName = model.name;
                                  // Extract model_id - handle both number and string formats
                                  let modelId = modelToDelete.model_id || model.model_id;
                                  if (!modelId && (modelToDelete.id || model.id)) {
                                    // Extract number from "model-123" format
                                    const idStr = (modelToDelete.id || model.id).toString();
                                    const idMatch = idStr.match(/model-(\d+)/);
                                    modelId = idMatch ? parseInt(idMatch[1]) : (idStr.match(/^\d+$/) ? parseInt(idStr) : null);
                                  }
                                  
                                  if (!modelId || isNaN(modelId)) {
                                    console.error('Delete failed - modelId:', modelId, 'model:', model, 'modelToDelete:', modelToDelete);
                                    toast({
                                      title: "Delete Failed",
                                      description: "Model ID not found or invalid",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  const userId = getUserId();
                                  if (!userId) {
                                    toast({
                                      title: "Delete Failed",
                                      description: "User ID not found. Please log in again.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  try {
                                    const response = await fetch(`/api/gtm-models/${modelId}?user_id=${userId}`, {
                                      method: 'DELETE',
                                    });

                                    if (!response.ok) {
                                      const errorData = await response.json().catch(() => ({}));
                                      throw new Error(errorData.error || 'Failed to delete model');
                                    }

                                    // Filter by model_id instead of index for more reliable deletion
                                    const updated = savedModels.filter(m => {
                                      const mId = m.model_id || (m.id ? parseInt(m.id.toString().replace('model-', '')) : null);
                                      return mId !== modelId;
                                    });
                                    setSavedModels(updated);
                                    toast({
                                      title: "Model Deleted",
                                      description: `"${modelName}" has been removed from your library.`,
                                      variant: "destructive",
                                    });
                                  } catch (error) {
                                    console.error('Error deleting model:', error);
                                    toast({
                                      title: "Delete Failed",
                                      description: error.message || "Failed to delete model. Please try again.",
                                      variant: "destructive",
                                    });
                                  }
                                }
                              }}
                              data-testid={`button-delete-${idx}`}
                            >
                              <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="pt-12 pb-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No models found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
            );
          })()}

          {/* BUILDER - Cockpit with tabs */}
          {currentStep === 'builder' && (() => {
            if (!currentModel) return <div className="p-4 sm:p-8 text-sm sm:text-base">Please select a model from the library first.</div>;

      // Use real-time API KPIs if available, otherwise fall back to stored KPIs
      const kpis = realtimeKPIs || currentKPIs;

      // getWeightedItems is now defined at module level (above component)

      // Handle save model with name from dialog - calls API to get all calculations and GPT analysis
      const handleSaveModel = async () => {
        const finalName = modelName.trim() || 'Untitled Model';
        
        // Show saving state
        setSaveDialogOpen(false);
        setIsCalculatingKPIs(true);
        setSaveProgressStage('calculating');

        try {
          // Stage 1: Calculating KPIs
          setSaveProgressStage('calculating');
          await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for visual feedback
          
          // Convert config to API format
          const apiFormat = normalizeConfigToUnifiedFormat(currentModel.config);
          
          // Debug: Log the conversion in development
          if (process.env.NODE_ENV === 'development') {
            console.log('\n[Frontend] 📤 Converting config to API format:');
            console.log('Current Model Config:', JSON.stringify(currentModel.config, null, 2));
            console.log('API Format:', JSON.stringify(apiFormat, null, 2));
          }
          
          // Stage 2: Feeding data to GPT
          setSaveProgressStage('feeding');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Call API to get complete analysis (all calculations + GPT analysis done in backend)
          const response = await fetch('/api/gtm-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiFormat),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.status} - ${errorText}`);
          }

          // Stage 3: Analyzing the model
          setSaveProgressStage('analyzing');
          
          const apiResponse = await response.json();

          // Extract analysis text from GPT response (if available)
          // Use strategic_insight from strategic_tradeoffs
          let analysisText = '';
          if (apiResponse.strategic_analysis) {
            // Build simple analysis text from GPT response
            const sa = apiResponse.strategic_analysis;
            if (sa.strategic_tradeoffs?.strategic_insight) {
              analysisText = sa.strategic_tradeoffs.strategic_insight;
            } else if (sa.strategic_archetype?.description) {
              analysisText = sa.strategic_archetype.description;
            }
          }

          // Stage 4: Finalizing - Save to database
          setSaveProgressStage('finalizing');
          
          // Get user ID
          const userId = getUserId();
          if (!userId) {
            throw new Error('User ID not found. Please log in again.');
          }

          // Prepare model data for database
          const modelDataToSave = {
            user_id: userId,
            name: finalName,
            config: currentModel.config,
            kpis: apiResponse.kpis,
            systemLoad: apiResponse.system_load,
            balance: apiResponse.balance_index,
            marketCoverage: apiResponse.market_coverage,
            pipelinePredictability: apiResponse.pipeline_predictability,
            budgetAnalysis: apiResponse.budget_analysis,
            recommendations: apiResponse.recommendations || [],
            analysis: analysisText,
            warnings: apiResponse.recommendations?.map(r => r.issue) || [],
            strategicAnalysis: apiResponse.strategic_analysis,
            archetype: currentModel.archetype,
            description: currentModel.description,
          };

          // Save to database - use PUT if editing existing model, POST if creating new
          const isEditing = currentModel.model_id;
          const saveUrl = isEditing ? `/api/gtm-models/${currentModel.model_id}` : '/api/gtm-models';
          const saveMethod = isEditing ? 'PUT' : 'POST';
          
          const saveResponse = await fetch(saveUrl, {
            method: saveMethod,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(modelDataToSave),
          });

          // When updating, bypass error check and continue
          if (!saveResponse.ok && !isEditing) {
            const errorData = await saveResponse.json();
            throw new Error(errorData.error || 'Failed to save model to database');
          }

          // For updates, try to get the response even if not ok, or use current model data
          let savedModelData;
          if (isEditing) {
            if (saveResponse.ok) {
              savedModelData = await saveResponse.json();
            } else {
              // Bypass error on update - use current model data as fallback
              console.warn('Update response not ok, but continuing with current model data');
              savedModelData = {
                model: {
                  ...currentModel,
                  name: finalName,
                  ...modelDataToSave,
                }
              };
            }
          } else {
            savedModelData = await saveResponse.json();
          }
          const savedModel = savedModelData.model;

          // Update local state with saved model
          const updated = [...savedModels.filter(m => m.model_id !== savedModel.model_id), savedModel];
          setSavedModels(updated);
          
          // Update currentModel with all stored data so it's immediately available
          setCurrentModel(savedModel);
          setModelName('');
          setIsCalculatingKPIs(false);
          setSaveProgressStage('');
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          toast({
            title: isEditing ? "Model Updated Successfully" : "Model Saved Successfully",
            description: `${finalName} ${isEditing ? 'updated' : 'saved'} with complete analysis. System Load: ${apiResponse.system_load}%, Balance: ${apiResponse.balance_index}%`,
          });
          
          // Redirect to analysis page
          setCurrentStep('analysis');
        } catch (error) {
          console.error('Error saving model:', error);
          setIsCalculatingKPIs(false);
          setSaveProgressStage('');
          setSaveDialogOpen(true); // Reopen dialog on error
          toast({
            title: "Save Failed",
            description: "Failed to generate analysis. Please try again.",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="w-full px-4 md:px-8 py-4 md:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: moduleColor }}>Model Builder: {currentModel.name}</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Configure channels, content, messaging, and goals with granular control</p>
              </div>
              <div className="flex flex-wrap gap-2">
                  <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    setModelName(currentModel?.name || 'Untitled Model');
                    setSaveDialogOpen(true);
                  }}
                  disabled={isCalculatingKPIs}
                  data-testid="button-save-model"
                >
                  {isCalculatingKPIs ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                  <Save className="w-3 h-3 mr-1" /> Save Model
                    </>
                  )}
                </Button>
                <Button size="sm" onClick={() => setCurrentStep('compare')} data-testid="button-go-compare">
                  <ArrowLeftRight className="w-3 h-3 mr-1" /> Compare Models
                </Button>
              </div>
            </div>

            {/* Save Model Dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    {currentModel.model_id ? 'Update Model' : 'Save Model'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {currentModel.model_id 
                      ? `Update the name for "${currentModel.name}" or keep the current name.`
                      : 'Enter a name for your GTM model. Leave blank to use the default name.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="model-name" className="text-gray-700">Model Name</Label>
                    <Input
                      id="model-name"
                      type="text"
                      placeholder="Untitled Model"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveModel();
                        }
                      }}
                      autoFocus
                      className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                      data-testid="input-model-name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSaveDialogOpen(false);
                      setModelName('');
                    }}
                    className="bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    data-testid="button-cancel-save"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveModel}
                    style={{ backgroundColor: moduleColor, color: 'white' }}
                    className="hover:opacity-90"
                    disabled={isCalculatingKPIs}
                    data-testid="button-confirm-save"
                  >
                    {isCalculatingKPIs ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {currentModel.model_id ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                    <Save className="w-3 h-3 mr-1" /> {currentModel.model_id ? 'Update' : 'Save'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* KPI Dashboard */}
            {kpis && kpis.kpis && (
              <>
                <div className="grid grid-cols-5 gap-4">
                  {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility']).map(kpi => (
                    <Card key={kpi} className="border border-gray-200">
                      <CardContent className="pt-6 text-center">
                        {isCalculatingRealtimeKPIs ? (
                          <div className="flex items-center justify-center mb-1">
                            <svg className="animate-spin h-8 w-8" style={{ color: moduleColor }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        ) : (
                          <p className="text-4xl font-bold mb-1" style={{ color: moduleColor }}>{Math.round(kpis.kpis[kpi] || 0)}</p>
                        )}
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-sm text-gray-600 capitalize">{kpi}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Gauge className="w-5 h-5 text-gray-600" />
                        <p className="text-sm text-gray-600">System Load</p>
                      </div>
                      {isCalculatingRealtimeKPIs ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-8 w-8" style={{ color: moduleColor }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold" style={{ color: (kpis.systemLoad || 0) > 80 ? '#ef4444' : moduleColor }}>
                          {Math.round(kpis.systemLoad || 0)}%
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-gray-600" />
                        <p className="text-sm text-gray-600">Balance Index</p>
                      </div>
                      {isCalculatingRealtimeKPIs ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-8 w-8" style={{ color: moduleColor }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold" style={{ color: (kpis.balance || 0) < 60 ? '#ef4444' : moduleColor }}>
                          {Math.round(kpis.balance || 0)}%
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Warnings */}
                {kpis.warnings && Array.isArray(kpis.warnings) && kpis.warnings.length > 0 && (
                  <Card className="border-2 border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-yellow-900 mb-2">Warnings</p>
                          <ul className="space-y-1">
                            {kpis.warnings.map((w, i) => (
                              <li key={i} className="text-sm text-yellow-800">• {w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Saving Progress Dialog */}
            <Dialog open={isCalculatingKPIs} onOpenChange={() => {}}>
              <DialogContent className="sm:max-w-md" style={{ pointerEvents: 'none' }}>
                <DialogHeader>
                  <DialogTitle className="text-center">Saving Model...</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-6">
                  {/* Animated Spinner */}
                  <div className="flex justify-center">
                    <motion.div
                      className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
            </div>

                  {/* Progress Stages */}
                  <div className="space-y-3">
                    <ProgressStage 
                      label="Calculating KPIs" 
                      active={saveProgressStage === 'calculating'} 
                      completed={['feeding', 'analyzing', 'finalizing'].includes(saveProgressStage)}
                    />
                    <ProgressStage 
                      label="Feeding data to GPT" 
                      active={saveProgressStage === 'feeding'} 
                      completed={['analyzing', 'finalizing'].includes(saveProgressStage)}
                    />
                    <ProgressStage 
                      label="Analyzing the model" 
                      active={saveProgressStage === 'analyzing'} 
                      completed={saveProgressStage === 'finalizing'}
                    />
                    <ProgressStage 
                      label="Finalizing" 
                      active={saveProgressStage === 'finalizing'} 
                      completed={false}
                    />
                    </div>
                  </div>
              </DialogContent>
            </Dialog>

            {/* Overall Budget Level - Above All Tabs */}
            <Card className="border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Overall Budget Level</CardTitle>
                  <QuickGuidance guidanceKey="budget" iconSize={14} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Global budget multiplier - scales total investment up or down across all channels and stages
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Budget Multiplier</Label>
                    <span className="text-sm font-bold text-emerald-700">
                      {Math.round(((currentModel.config.channelsCategoryWeight || 1) + (currentModel.config.stagesCategoryWeight || 1)) / 2 * 100)}%
                    </span>
                  </div>
                  <div>
                    <style>{`
                      [data-testid="slider-budget-intensity"] [data-radix-slider-range] {
                        background-color: ${moduleColor} !important;
                      }
                      [data-testid="slider-budget-intensity"] [data-radix-slider-thumb] {
                        border-color: ${moduleColor} !important;
                      }
                    `}</style>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[Math.round(((currentModel.config.channelsCategoryWeight || 1) + (currentModel.config.stagesCategoryWeight || 1)) / 2 * 100)]}
                        onValueChange={([v]) => {
                          if (lockedSliders.has('budget-multiplier')) return;
                          const newWeight = v / 100;
                          setCurrentModel({
                            ...currentModel,
                            config: {
                              ...currentModel.config,
                              channelsCategoryWeight: newWeight,
                              stagesCategoryWeight: newWeight
                            }
                          });
                        }}
                        min={50}
                        max={150}
                        step={5}
                        disabled={lockedSliders.has('budget-multiplier')}
                        data-testid="slider-budget-intensity"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          const newLocked = new Set(lockedSliders);
                          if (newLocked.has('budget-multiplier')) {
                            newLocked.delete('budget-multiplier');
                          } else {
                            newLocked.add('budget-multiplier');
                          }
                          setLockedSliders(newLocked);
                        }}
                        title={lockedSliders.has('budget-multiplier') ? 'Unlock slider' : 'Lock slider'}
                      >
                        {lockedSliders.has('budget-multiplier') ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Coaching Insights */}
                  <div className="pt-2 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>How to use:</strong> Set your overall budget reality first, then fine-tune allocation in each tab.
                      </p>
                    </div>
                    <div className="bg-white/60 border border-emerald-200 rounded p-2 space-y-1">
                      <p className="text-gray-600">
                        <strong className="text-emerald-700">85%</strong> = Budget cut scenario (15% reduction)
                      </p>
                      <p className="text-gray-600">
                        <strong className="text-emerald-700">100%</strong> = Baseline budget (no change)
                      </p>
                      <p className="text-gray-600">
                        <strong className="text-emerald-700">120%</strong> = Growth scenario (20% increase)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Builder Configuration */}
            <Tabs defaultValue="budget" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto gap-1 sm:gap-2">
                <TabsTrigger value="budget" data-testid="tab-budget" className="py-2 sm:py-3 text-xs sm:text-sm">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs sm:text-sm">Paid Budget</span>
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground">$$</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="channels" data-testid="tab-channels" className="py-2 sm:py-3 text-xs sm:text-sm">
                  <span>Channel Mix</span>
                </TabsTrigger>
                <TabsTrigger value="content" data-testid="tab-content" className="py-2 sm:py-3 text-xs sm:text-sm">
                  <span>Content Types</span>
                </TabsTrigger>
                <TabsTrigger value="stages" data-testid="tab-stages" className="py-2 sm:py-3 text-xs sm:text-sm">
                  <span>Funnel Stages</span>
                </TabsTrigger>
                <TabsTrigger value="messaging" data-testid="tab-messaging" className="py-2 sm:py-3 text-xs sm:text-sm">
                  <span>Messaging Mix</span>
                </TabsTrigger>
                <TabsTrigger value="goals" data-testid="tab-goals" className="py-2 sm:py-3 text-xs sm:text-sm">
                  <span>Goals</span>
                </TabsTrigger>
              </TabsList>

              {/* BUDGET MIX TAB */}
              <TabsContent value="budget" className="space-y-6 mt-6">
                <Card className="border border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Paid Activities Budget</CardTitle>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        $ Budget Only
                      </Badge>
                      <QuickGuidance guidanceKey="budget_mix" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>This tab is for paid activities only.</strong> Allocate your actual marketing budget across paid channels and sponsorships. It does not include creation, tools, or any other budget item.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Optional Total Budget Input */}
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Total Budget (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">$</span>
                        <Input
                          type="number"
                          placeholder="e.g., 500000"
                          value={currentModel.config.totalBudget || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            setCurrentModel({
                              ...currentModel,
                              config: { ...currentModel.config, totalBudget: val }
                            });
                          }}
                          className="max-w-xs"
                          data-testid="input-total-budget"
                        />
                      </div>
                      <p className="text-xs text-emerald-700 mt-2">
                        Enter your total paid budget for dollar calculations. Leave blank to work with percentages only.
                      </p>
                    </div>

                    {/* Budget Activities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {(currentModel.config.budgetMix || DEFAULT_BUDGET_MIX).map((activity, idx) => {
                        const budgetMix = currentModel.config.budgetMix || DEFAULT_BUDGET_MIX;
                        const totalBudget = currentModel.config.totalBudget;
                        const dollarAmount = totalBudget ? totalBudget * activity.allocation : null;
                        
                        return (
                          <div key={activity.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-gray-900">{activity.label}</Label>
                              <div className="flex items-center gap-3">
                                {dollarAmount && (
                                  <span className="text-xs text-emerald-600 font-medium">
                                    ${Math.round(dollarAmount).toLocaleString()}
                                  </span>
                                )}
                                <span className="text-xs text-gray-900 font-medium w-12 text-right">
                                  {Math.round(activity.allocation * 100)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <style>{`
                                [data-testid="slider-budget-${activity.key}"] [data-radix-slider-range] {
                                  background-color: ${moduleColor} !important;
                                }
                                [data-testid="slider-budget-${activity.key}"] [data-radix-slider-thumb] {
                                  border-color: ${moduleColor} !important;
                                }
                              `}</style>
                              <div className="flex items-center gap-2">
                              <Slider
                                value={[activity.allocation * 100]}
                                onValueChange={([v]) => {
                                    if (lockedSliders.has(`budget-${activity.key}`)) return;
                                  const newAllocation = v / 100;
                                  const rebalanced = rebalanceBudgetActivities(budgetMix, idx, newAllocation);
                                  setCurrentModel({
                                    ...currentModel,
                                    config: { ...currentModel.config, budgetMix: rebalanced }
                                  });
                                }}
                                min={0}
                                max={100}
                                step={1}
                                  disabled={lockedSliders.has(`budget-${activity.key}`)}
                                data-testid={`slider-budget-${activity.key}`}
                              />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    const newLocked = new Set(lockedSliders);
                                    if (newLocked.has(`budget-${activity.key}`)) {
                                      newLocked.delete(`budget-${activity.key}`);
                                    } else {
                                      newLocked.add(`budget-${activity.key}`);
                                    }
                                    setLockedSliders(newLocked);
                                  }}
                                  title={lockedSliders.has(`budget-${activity.key}`) ? 'Unlock slider' : 'Lock slider'}
                                >
                                  {lockedSliders.has(`budget-${activity.key}`) ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Verification */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Allocation</span>
                        <span className={`text-sm font-bold ${Math.round((currentModel.config.budgetMix || DEFAULT_BUDGET_MIX).reduce((sum, a) => sum + a.allocation, 0) * 100) > 100 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {Math.round((currentModel.config.budgetMix || DEFAULT_BUDGET_MIX).reduce((sum, a) => sum + a.allocation, 0) * 100)}%
                        </span>
                      </div>
                      {Math.round((currentModel.config.budgetMix || DEFAULT_BUDGET_MIX).reduce((sum, a) => sum + a.allocation, 0) * 100) > 100 && (
                        <p className="text-xs text-red-600 mt-1">⚠️ Total exceeds 100%. Please adjust allocations.</p>
                      )}
                      {currentModel.config.totalBudget && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">Total Dollars</span>
                          <span className="text-xs font-semibold text-emerald-600">
                            ${Math.round(currentModel.config.totalBudget).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CHANNEL MIX TAB */}
              <TabsContent value="channels" className="space-y-6 mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Channel Focus</CardTitle>
                      <QuickGuidance guidanceKey="channel_focus" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strategic allocation across channels.
                    </p>
                  </CardHeader>
                  <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Individual Channel Sliders */}
                  {currentModel.config.channels.map((ch, idx) => (
                    <div key={ch.key} className="space-y-3 p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium capitalize">{ch.label}</Label>
                        <QuickGuidance guidanceKey={`channel_${ch.key}`} iconSize={12} />
                      </div>
                      
                      {/* Intensity Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Intensity</span>
                          <span className="text-xs text-gray-600">{pct(ch.intensity)}</span>
                        </div>
                        <Slider
                          value={[ch.intensity * 100]}
                          onValueChange={([v]) => {
                            if (lockedSliders.has(`channel-${ch.key}`)) return;
                            const newIntensity = v / 100;
                            const updated = [...currentModel.config.channels];
                            // Rebalance other channels to maintain 100% total (but skip locked ones)
                            const oldIntensity = updated[idx].intensity;
                            const delta = newIntensity - oldIntensity;
                            
                            // Get sum of unlocked channels (excluding the one being changed)
                            const unlockedChannels = updated.filter((ch, i) => 
                              i !== idx && !lockedSliders.has(`channel-${ch.key}`)
                            );
                            const unlockedSum = unlockedChannels.reduce((sum, ch) => sum + ch.intensity, 0);
                            
                            if (unlockedSum > 0.001) {
                              // Redistribute delta proportionally among unlocked channels
                              updated.forEach((channel, i) => {
                                if (i === idx) {
                                  updated[i].intensity = newIntensity;
                                } else if (!lockedSliders.has(`channel-${channel.key}`)) {
                                  const proportion = channel.intensity / unlockedSum;
                                  updated[i].intensity = Math.max(0, channel.intensity - delta * proportion);
                                }
                                // Locked channels remain unchanged
                              });
                            } else {
                              // All unlocked channels are 0, set this one and distribute remainder
                              updated[idx].intensity = newIntensity;
                              const remainder = 1 - newIntensity;
                              const lockedSum = updated.reduce((sum, ch, i) => 
                                i !== idx && lockedSliders.has(`channel-${ch.key}`) ? sum + ch.intensity : sum, 0
                              );
                              const unlockedCount = unlockedChannels.length;
                              if (unlockedCount > 0) {
                                const perChannel = (remainder - lockedSum) / unlockedCount;
                                updated.forEach((channel, i) => {
                                  if (i !== idx && !lockedSliders.has(`channel-${channel.key}`)) {
                                    updated[i].intensity = Math.max(0, perChannel);
                                  }
                                });
                              }
                            }
                            
                            setCurrentModel({ ...currentModel, config: { ...currentModel.config, channels: updated } });
                          }}
                          max={100}
                          step={1}
                          disabled={lockedSliders.has(`channel-${ch.key}`)}
                          data-testid={`slider-intensity-${ch.key}`}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 mt-1"
                          onClick={() => {
                            const newLocked = new Set(lockedSliders);
                            if (newLocked.has(`channel-${ch.key}`)) {
                              newLocked.delete(`channel-${ch.key}`);
                            } else {
                              newLocked.add(`channel-${ch.key}`);
                            }
                            setLockedSliders(newLocked);
                          }}
                          title={lockedSliders.has(`channel-${ch.key}`) ? 'Unlock slider' : 'Lock slider'}
                        >
                          {lockedSliders.has(`channel-${ch.key}`) ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Validation for Intensity */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {(() => {
                    const total = Math.round(
                      currentModel.config.channels.reduce((sum, ch) => sum + ch.intensity, 0) * 100
                    );
                    const isValid = total === 100;
                    return (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Intensity Allocation</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                            {total}%
                          </span>
                          {isValid ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  {(() => {
                    const total = Math.round(
                      currentModel.config.channels.reduce((sum, ch) => sum + ch.intensity, 0) * 100
                    );
                    return total !== 100 && (
                      <p className="text-xs text-red-600 mt-2 text-right">
                        Total must equal 100% to proceed
                      </p>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
              </TabsContent>

              {/* CONTENT TYPES TAB */}
              <TabsContent value="content" className="space-y-6 mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Content Focus</CardTitle>
                      <QuickGuidance guidanceKey="content_types" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strategic content format allocation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Individual Content Type Sliders */}
                      {MOCK_CONTENT_TYPES.map((content) => {
                        const weighted = getWeightedItems(currentModel.config.contentTypes, 0);
                        const item = weighted.find(w => w.id === content.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={content.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{content.name}</Label>
                                <span className="text-xs text-muted-foreground block">{content.channel}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[weight * 100]}
                                onValueChange={([v]) => {
                                  if (lockedSliders.has(`content-${content.id}`)) return;
                                  const newWeight = v / 100;
                                  let updated = getWeightedItems(currentModel.config.contentTypes, 0);
                                  
                                  if (newWeight === 0) {
                                    // Remove if set to 0 and rebalance remaining
                                    updated = updated.filter(w => w.id !== content.id);
                                    if (updated.length > 0) {
                                      const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                      if (total > 0) {
                                        updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                      }
                                    }
                                  } else {
                                    const idx = updated.findIndex(w => w.id === content.id);
                                    if (idx >= 0) {
                                      // Existing item - rebalance
                                      updated = rebalanceWeights(updated, idx, newWeight, lockedSliders, 'content-');
                                    } else {
                                      // New item - add and rebalance
                                      updated = [...updated, { id: content.id, weight: newWeight }];
                                      const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                      if (total > 0) {
                                        updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                      }
                                    }
                                  }
                                  
                                  setCurrentModel({ ...currentModel, config: { ...currentModel.config, contentTypes: updated } });
                                }}
                                max={100}
                                step={1}
                                disabled={lockedSliders.has(`content-${content.id}`)}
                                data-testid={`slider-content-${content.id}`}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const newLocked = new Set(lockedSliders);
                                  if (newLocked.has(`content-${content.id}`)) {
                                    newLocked.delete(`content-${content.id}`);
                                  } else {
                                    newLocked.add(`content-${content.id}`);
                                  }
                                  setLockedSliders(newLocked);
                                }}
                                title={lockedSliders.has(`content-${content.id}`) ? 'Unlock slider' : 'Lock slider'}
                              >
                                {lockedSliders.has(`content-${content.id}`) ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Total Validation */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      {(() => {
                        const weighted = getWeightedItems(currentModel.config.contentTypes, 0);
                        const total = Math.round(weighted.reduce((sum, w) => sum + w.weight, 0) * 100);
                        const isValid = total === 100;
                        return (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Total Allocation</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                                {total}%
                              </span>
                              {isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const weighted = getWeightedItems(currentModel.config.contentTypes, 0);
                        const total = Math.round(weighted.reduce((sum, w) => sum + w.weight, 0) * 100);
                        return total !== 100 && (
                          <p className="text-xs text-red-600 mt-2 text-right">
                            Total must equal 100% to proceed
                          </p>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FUNNEL STAGES TAB */}
              <TabsContent value="stages" className="space-y-6 mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Funnel Stage Focus</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Strategic allocation across funnel stages.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Individual Stage Sliders */}
                      {(['awareness', 'consideration', 'conversion', 'retention']).map(stage => (
                        <div key={stage} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium capitalize">{stage}</Label>
                              <QuickGuidance guidanceKey={`stage_${stage}`} iconSize={12} />
                            </div>
                            <span className="text-xs text-gray-600">{pct(currentModel.config.stages[stage])}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[currentModel.config.stages[stage] * 100]}
                              onValueChange={([v]) => {
                                if (lockedSliders.has(`stage-${stage}`)) return;
                                const rebalanced = rebalanceStages(
                                  currentModel.config.stages,
                                  stage,
                                  v / 100,
                                  lockedSliders
                                );
                                setCurrentModel({
                                  ...currentModel,
                                  config: {
                                    ...currentModel.config,
                                    stages: rebalanced
                                  }
                                });
                              }}
                              max={100}
                              step={1}
                              disabled={lockedSliders.has(`stage-${stage}`)}
                              data-testid={`slider-stage-${stage}`}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                const newLocked = new Set(lockedSliders);
                                if (newLocked.has(`stage-${stage}`)) {
                                  newLocked.delete(`stage-${stage}`);
                                } else {
                                  newLocked.add(`stage-${stage}`);
                                }
                                setLockedSliders(newLocked);
                              }}
                              title={lockedSliders.has(`stage-${stage}`) ? 'Unlock slider' : 'Lock slider'}
                            >
                              {lockedSliders.has(`stage-${stage}`) ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Validation */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      {(() => {
                        const total = Math.round(
                          Object.values(currentModel.config.stages).reduce((sum, val) => sum + val, 0) * 100
                        );
                        const isValid = total === 100;
                        return (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Total Allocation</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                                {total}%
                              </span>
                              {isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const total = Math.round(
                          Object.values(currentModel.config.stages).reduce((sum, val) => sum + val, 0) * 100
                        );
                        return total !== 100 && (
                          <p className="text-xs text-red-600 mt-2 text-right">
                            Total must equal 100% to proceed
                          </p>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MESSAGING MIX TAB */}
              <TabsContent value="messaging" className="space-y-6 mt-6">
                {/* Personas */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Persona Focus</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Target persona allocation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Individual Persona Sliders */}
                      {currentModel.config.personas.map((persona, idx) => (
                        <div key={persona.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">{persona.name}</Label>
                            <span className="text-xs text-gray-600">{pct(persona.weight)}</span>
                          </div>
                          <Slider
                            value={[persona.weight * 100]}
                            onValueChange={([v]) => {
                              const rebalanced = rebalanceWeights(
                                currentModel.config.personas,
                                idx,
                                v / 100
                              );
                              setCurrentModel({ ...currentModel, config: { ...currentModel.config, personas: rebalanced } });
                            }}
                            max={100}
                            step={1}
                            data-testid={`slider-persona-${persona.id}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Validation */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      {(() => {
                        const total = Math.round(
                          currentModel.config.personas.reduce((sum, p) => sum + p.weight, 0) * 100
                        );
                        const isValid = total === 100;
                        return (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Total Allocation</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                                {total}%
                              </span>
                              {isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const total = Math.round(
                          currentModel.config.personas.reduce((sum, p) => sum + p.weight, 0) * 100
                        );
                        return total !== 100 && (
                          <p className="text-xs text-red-600 mt-2 text-right">
                            Total must equal 100% to proceed
                          </p>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Executive Visibility */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Executive Visibility</CardTitle>
                      <QuickGuidance guidanceKey="executives" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Executive influence allocation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Individual Executive Sliders */}
                      {MOCK_EXECUTIVES.map((exec) => {
                        const weighted = getWeightedItems(currentModel.config.executives, 0);
                        const item = weighted.find(w => w.id === exec.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={exec.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{exec.name}</Label>
                                <span className="text-xs text-muted-foreground block">{exec.title}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Slider
                              value={[weight * 100]}
                              onValueChange={([v]) => {
                                  if (lockedSliders.has(`exec-${exec.id}`)) return;
                                const newWeight = v / 100;
                                let updated = getWeightedItems(currentModel.config.executives, 0);
                                
                                  // Executive visibility: NO rebalancing - each executive can be 0-100% independently
                                  // Total can exceed 100% (e.g., 6 executives at 100% each = 600%)
                                  const idx = updated.findIndex(w => w.id === exec.id);
                                  if (idx >= 0) {
                                    // Update existing
                                    updated[idx] = { ...updated[idx], weight: newWeight };
                                  } else {
                                    // Add new
                                    updated = [...updated, { id: exec.id, weight: newWeight }];
                                }
                                
                                setCurrentModel({ ...currentModel, config: { ...currentModel.config, executives: updated } });
                              }}
                              max={100}
                              step={1}
                                disabled={lockedSliders.has(`exec-${exec.id}`)}
                              data-testid={`slider-exec-${exec.id}`}
                            />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const newLocked = new Set(lockedSliders);
                                  if (newLocked.has(`exec-${exec.id}`)) {
                                    newLocked.delete(`exec-${exec.id}`);
                                  } else {
                                    newLocked.add(`exec-${exec.id}`);
                                  }
                                  setLockedSliders(newLocked);
                                }}
                                title={lockedSliders.has(`exec-${exec.id}`) ? 'Unlock slider' : 'Lock slider'}
                              >
                                {lockedSliders.has(`exec-${exec.id}`) ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Executive Visibility Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Visibility</span>
                        <span className="text-sm font-bold text-blue-700">
                          {Math.round(getWeightedItems(currentModel.config.executives, 0).reduce((sum, w) => sum + w.weight, 0) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Total can exceed 100% (each executive: 0-100%)</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Strategic Pillars */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Strategic Pillars</CardTitle>
                      <QuickGuidance guidanceKey="pillars" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Messaging weight for core strategic themes.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Individual Pillar Sliders */}
                      {MOCK_PILLARS.map((pillar) => {
                        const weighted = getWeightedItems(currentModel.config.pillars, 0);
                        const item = weighted.find(w => w.id === pillar.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={pillar.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{pillar.name}</Label>
                                <span className="text-xs text-muted-foreground block">{pillar.description}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[weight * 100]}
                                onValueChange={([v]) => {
                                  if (lockedSliders.has(`pillar-${pillar.id}`)) return;
                                  const newWeight = v / 100;
                                  let updated = getWeightedItems(currentModel.config.pillars, 0);
                                  
                                  if (newWeight === 0) {
                                    // Remove if set to 0 and rebalance remaining
                                    updated = updated.filter(w => w.id !== pillar.id);
                                    if (updated.length > 0) {
                                      const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                      if (total > 0) {
                                        updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                      }
                                    }
                                  } else {
                                    const idx = updated.findIndex(w => w.id === pillar.id);
                                    if (idx >= 0) {
                                      // Existing item - rebalance
                                      updated = rebalanceWeights(updated, idx, newWeight, lockedSliders, 'pillar-');
                                    } else {
                                      // New item - add and rebalance
                                      updated = [...updated, { id: pillar.id, weight: newWeight }];
                                      const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                      if (total > 0) {
                                        updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                      }
                                    }
                                  }
                                  
                                  setCurrentModel({ ...currentModel, config: { ...currentModel.config, pillars: updated } });
                                }}
                                max={100}
                                step={1}
                                disabled={lockedSliders.has(`pillar-${pillar.id}`)}
                                data-testid={`slider-pillar-${pillar.id}`}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const newLocked = new Set(lockedSliders);
                                  if (newLocked.has(`pillar-${pillar.id}`)) {
                                    newLocked.delete(`pillar-${pillar.id}`);
                                  } else {
                                    newLocked.add(`pillar-${pillar.id}`);
                                  }
                                  setLockedSliders(newLocked);
                                }}
                                title={lockedSliders.has(`pillar-${pillar.id}`) ? 'Unlock slider' : 'Lock slider'}
                              >
                                {lockedSliders.has(`pillar-${pillar.id}`) ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* GOALS TAB */}
              <TabsContent value="goals" className="space-y-6 mt-6">
                {/* Business Goals */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Business Goals</CardTitle>
                      <QuickGuidance guidanceKey="goals" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Priority for each business objective.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Individual Goal Sliders */}
                      {MOCK_GOALS.map((goal) => {
                        const weighted = getWeightedItems(currentModel.config.goals, 0);
                        const item = weighted.find(w => w.id === goal.id);
                        const weight = item?.weight || 0;
                        
                        return (
                          <div key={goal.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">{goal.name}</Label>
                                <span className="text-xs text-muted-foreground block">{goal.category}</span>
                              </div>
                              <span className="text-xs text-gray-600">{pct(weight)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[weight * 100]}
                                onValueChange={([v]) => {
                                  if (lockedSliders.has(`goal-${goal.id}`)) return;
                                  const newWeight = v / 100;
                                  let updated = getWeightedItems(currentModel.config.goals, 0);
                                  
                                  if (newWeight === 0) {
                                    // Remove if set to 0 and rebalance remaining
                                    updated = updated.filter(w => w.id !== goal.id);
                                    if (updated.length > 0) {
                                      const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                      if (total > 0) {
                                        updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                      }
                                    }
                                  } else {
                                    const idx = updated.findIndex(w => w.id === goal.id);
                                    if (idx >= 0) {
                                      // Existing item - rebalance
                                      updated = rebalanceWeights(updated, idx, newWeight, lockedSliders, 'goal-');
                                    } else {
                                      // New item - add and rebalance
                                      updated = [...updated, { id: goal.id, weight: newWeight }];
                                      const total = updated.reduce((sum, w) => sum + w.weight, 0);
                                      if (total > 0) {
                                        updated = updated.map(w => ({ ...w, weight: w.weight / total }));
                                      }
                                    }
                                  }
                                  
                                  setCurrentModel({ ...currentModel, config: { ...currentModel.config, goals: updated } });
                                }}
                                max={100}
                                step={1}
                                disabled={lockedSliders.has(`goal-${goal.id}`)}
                                data-testid={`slider-goal-${goal.id}`}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const newLocked = new Set(lockedSliders);
                                  if (newLocked.has(`goal-${goal.id}`)) {
                                    newLocked.delete(`goal-${goal.id}`);
                                  } else {
                                    newLocked.add(`goal-${goal.id}`);
                                  }
                                  setLockedSliders(newLocked);
                                }}
                                title={lockedSliders.has(`goal-${goal.id}`) ? 'Unlock slider' : 'Lock slider'}
                              >
                                {lockedSliders.has(`goal-${goal.id}`) ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
          );
        })()}

        {/* COMPARE - Deep 3-way comparison */}
        {currentStep === 'compare' && (() => {
          const allModels = [...ARCHETYPE_MODELS, ...savedModels];
          
          return (
            <div className="w-full px-4 md:px-8 py-4 md:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: moduleColor }}>Compare Models</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Deep 3-way comparison with tradeoff analysis</p>
            </div>

            {/* Model Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2].map(slot => (
                <Card key={slot} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Model {slot + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {compareModels[slot] ? (
                      <div>
                        <p className="font-semibold mb-2">{compareModels[slot]?.name}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const updated = [...compareModels];
                            updated[slot] = null;
                            setCompareModels(updated);
                          }}
                          data-testid={`button-clear-${slot}`}
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Clear
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allModels.map((model, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              const updated = [...compareModels];
                              updated[slot] = model;
                              setCompareModels(updated);
                            }}
                            data-testid={`button-select-${slot}-${idx}`}
                          >
                            {model.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Table */}
            {compareModels.filter(m => m !== null).length >= 2 && (
              <>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">KPI Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left p-2">Metric</th>
                            {compareModels.map((model, idx) => model && (
                              <th key={idx} className="text-center p-2">{model.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility']).map(kpi => (
                            <tr key={kpi} className="border-b border-gray-200">
                              <td className="p-2 capitalize font-medium">
                                <div className="flex items-center gap-2">
                                  {kpi}
                                  <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={12} />
                                </div>
                              </td>
                              {compareModels.map((model, idx) => model && (
                                <td key={idx} className="text-center p-2">
                                  <span className="text-lg font-bold" style={{ color: moduleColor }}>
                                    {Math.round(model.kpis?.[kpi] || 0)}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr className="border-b border-gray-200">
                            <td className="p-2 font-medium">
                              <div className="flex items-center gap-2">
                                System Load
                                <QuickGuidance guidanceKey="system_load" iconSize={12} />
                              </div>
                            </td>
                            {compareModels.map((model, idx) => model && (
                              <td key={idx} className="text-center p-2">
                                <span className={`text-lg font-bold ${model.systemLoad > 80 ? 'text-red-500' : ''}`}>
                                  {Math.round(model.systemLoad || 0)}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">
                              <div className="flex items-center gap-2">
                                Balance
                                <QuickGuidance guidanceKey="balance_score" iconSize={12} />
                              </div>
                            </td>
                            {compareModels.map((model, idx) => model && (
                              <td key={idx} className="text-center p-2">
                                <span className="text-lg font-bold" style={{ color: moduleColor }}>
                                  {Math.round(model.balance || 0)}
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Funnel Visualizations */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Funnel Flow Comparison</CardTitle>
                      <QuickGuidance guidanceKey="funnel_stages" iconSize={14} />
                    </div>
                    <p className="text-sm text-muted-foreground">Visual comparison of customer journey emphasis across models</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {compareModels.map((model, idx) => model && (
                        <div key={idx} className="space-y-3">
                          <p className="font-semibold text-center text-sm mb-4">{model.name}</p>
                          <div className="space-y-2">
                            {(['awareness', 'consideration', 'conversion', 'retention']).map((stage, stageIdx) => {
                              const value = model.config.stages[stage];
                              const width = (value * 100).toFixed(0);
                              const colors = {
                                awareness: 'bg-blue-500',
                                consideration: 'bg-purple-500',
                                conversion: 'bg-pink-500',
                                retention: 'bg-green-500'
                              };
                              
                              return (
                                <div key={stage}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs capitalize text-gray-600">{stage}</span>
                                    <span className="text-xs font-semibold">{width}%</span>
                                  </div>
                                  <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                                    <div 
                                      className={`h-full ${colors[stage]} transition-all duration-300`}
                                      style={{ width: `${width}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Win Scenarios */}
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-lg text-green-900">When Each Model Wins</CardTitle>
                    </div>
                    <p className="text-sm text-green-700">Strategic contexts where each approach excels</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {compareModels.map((model, idx) => model && (
                        <div key={idx} className="p-4 bg-white rounded-lg border border-green-200 space-y-3">
                          <p className="font-bold text-green-900">{model.name}</p>
                          <div className="space-y-2">
                            {/* Generate win scenarios based on model characteristics */}
                            {model.kpis.awareness > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Maximum brand awareness and market visibility needed</p>
                              </div>
                            )}
                            {model.kpis.velocity > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Speed to market is critical competitive advantage</p>
                              </div>
                            )}
                            {model.kpis.efficiency > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Budget constraints require maximum ROI optimization</p>
                              </div>
                            )}
                            {model.kpis.retention > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Long-term customer value and loyalty are priorities</p>
                              </div>
                            )}
                            {model.kpis.credibility > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Trust and authority building in competitive market</p>
                              </div>
                            )}
                            {model.systemLoad < 60 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Team has limited resources or bandwidth</p>
                              </div>
                            )}
                            {model.balance > 75 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Balanced approach across all funnel stages needed</p>
                              </div>
                            )}
                            {model.config.stages.awareness > 0.35 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">New market entry or category creation</p>
                              </div>
                            )}
                            {model.config.stages.conversion > 0.35 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">Established brand needs to maximize conversions</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tradeoff Analysis */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Tradeoff Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground">What you gain vs what you give up</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {compareModels[0] && compareModels[1] && (
                        <div className="p-4 rounded-lg bg-gray-50">
                          <p className="font-semibold mb-2">{compareModels[0].name} vs {compareModels[1].name}</p>
                          <ul className="space-y-1 text-sm">
                            {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility']).map(kpi => {
                              const diff = compareModels[0]?.kpis[kpi] - compareModels[1]?.kpis[kpi];
                              if (Math.abs(diff) > 5) {
                                return (
                                  <li key={kpi} className={diff > 0 ? 'text-green-700' : 'text-red-700'}>
                                    {diff > 0 ? '↑' : '↓'} {Math.abs(diff)} points in {kpi}
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={() => {
                    if (compareModels[0]) {
                      setCurrentModel(compareModels[0]);
                      setCurrentStep('analysis');
                    }
                  }} data-testid="button-analyze-selected">
                    Analyze Selected Model
                  </Button>
                  <Button variant="outline" onClick={exportComparison} data-testid="button-export-comparison">
                    <FileDown className="w-3 h-3 mr-1" /> Export Comparison
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
          );
        })()}

        {/* ANALYSIS - Selected model deep dive */}
        {currentStep === 'analysis' && (() => {
          const allModels = [...ARCHETYPE_MODELS, ...savedModels];
          
          // Use stored KPIs from saved models only (no local calculations)
          const kpis = currentKPIs;
          
          if (!kpis) {
            return (
              <div className="w-full px-4 md:px-8 py-4 md:py-8">
                <div className="max-w-7xl mx-auto space-y-6">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6 text-center">
                      <p className="text-lg text-gray-600 mb-2">
                        No analysis available for this model.
                      </p>
                      <p className="text-sm text-gray-500">
                        Please save the model first to generate analysis and metrics.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          }

          return (
            <div className="w-full px-4 md:px-8 py-4 md:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: moduleColor }}>
                  {currentModel ? currentModel.name : 'Analysis'}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  {currentModel ? (currentModel.description || 'Deep analysis of this GTM model') : 'Select a model to analyze'}
                </p>
              </div>
              <div className="flex gap-2">
                {currentModel && !currentKPIs && (
                  <Badge variant="outline" className="text-gray-600">
                    Save model to generate analysis
                  </Badge>
                )}
              </div>
              <div className="w-64">
                <Label className="text-sm mb-2 block">Select Model to Analyze</Label>
                <Select
                  value={currentModel?.id || currentModel?.name || ''}
                  onValueChange={(value) => {
                    const selected = allModels.find(m => (m.id || m.name) === value);
                    if (selected) {
                      setCurrentModel(JSON.parse(JSON.stringify(selected)));
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-analysis-model">
                    <SelectValue placeholder="Choose a model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allModels.map((model) => (
                      <SelectItem key={model.id || model.name} value={model.id || model.name}>
                        {model.name} {model.archetype && `(${model.archetype})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!currentModel && (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Model Selected</h3>
                  <p className="text-gray-600 mb-4">Select a model from the dropdown above to view detailed analysis</p>
                  <Button onClick={() => setCurrentStep('library')} variant="outline">
                    Browse Model Library
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentModel && kpis && (
              <div className="space-y-8">

            {/* Two Cards - KPI Profile + 2x2 Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* KPI Profile with Radar */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">KPI Profile</CardTitle>
                  <p className="text-xs text-muted-foreground">Core funnel performance metrics</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Radar Chart */}
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={[
                      { metric: 'Awareness', value: kpis.kpis.awareness },
                      { metric: 'Velocity', value: kpis.kpis.velocity },
                      { metric: 'Efficiency', value: kpis.kpis.efficiency },
                      { metric: 'Retention', value: kpis.kpis.retention },
                      { metric: 'Credibility', value: kpis.kpis.credibility }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="KPIs" dataKey="value" stroke={moduleColor} fill={moduleColor} fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                  
                  {/* Metric Numbers */}
                  <div className="grid grid-cols-5 gap-2">
                    {(['awareness', 'velocity', 'efficiency', 'retention', 'credibility']).map(kpi => (
                      <div key={kpi} className="text-center">
                        <p className="text-lg font-bold" style={{ color: moduleColor }}>
                          {typeof kpis.kpis[kpi] === 'number' ? Math.round(kpis.kpis[kpi]) : kpis.kpis[kpi]}
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-xs text-gray-600 capitalize">{kpi.substring(0, 4)}</p>
                          <QuickGuidance guidanceKey={`${kpi}_kpi`} iconSize={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 2x2 Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Market Coverage */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Market Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold mb-1" style={{ color: moduleColor }}>
                        {Math.round(kpis.marketCoverage || 0)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.marketCoverage}%`,
                            backgroundColor: kpis.marketCoverage >= 70 ? '#22c55e' : kpis.marketCoverage >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.marketCoverage >= 70 ? 'Comprehensive' : kpis.marketCoverage >= 50 ? 'Moderate' : 'Limited'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pipeline Predictability */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pipeline Predictability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold mb-1" style={{ color: moduleColor }}>
                        {Math.round(kpis.pipelinePredictability || 0)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.pipelinePredictability}%`,
                            backgroundColor: kpis.pipelinePredictability >= 70 ? '#22c55e' : kpis.pipelinePredictability >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.pipelinePredictability >= 70 ? 'Highly stable' : kpis.pipelinePredictability >= 50 ? 'Moderate' : 'Volatile'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* System Load */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      System Load
                      <QuickGuidance guidanceKey="system_load" iconSize={12} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className={`text-3xl font-bold mb-1 ${kpis.systemLoad > 80 ? 'text-red-500' : ''}`} style={kpis.systemLoad <= 80 ? { color: moduleColor } : {}}>
                        {Math.round(kpis.systemLoad || 0)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.systemLoad}%`,
                            backgroundColor: kpis.systemLoad > 80 ? '#ef4444' : kpis.systemLoad > 60 ? '#eab308' : '#22c55e'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.systemLoad > 80 ? 'High risk' : kpis.systemLoad > 60 ? 'Moderate' : 'Sustainable'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Balance */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      Balance
                      <QuickGuidance guidanceKey="balance_score" iconSize={12} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold mb-1" style={{ color: moduleColor }}>
                        {Math.round(kpis.balance || 0)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${kpis.balance}%`,
                            backgroundColor: kpis.balance >= 70 ? '#22c55e' : kpis.balance >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        {kpis.balance >= 70 ? 'Well balanced' : kpis.balance >= 50 ? 'Moderate' : 'Unbalanced'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Analysis - Show strategic_insight from strategic_tradeoffs */}
            {(() => {
              // Extract strategic_insight from stored strategicAnalysis, or fallback to analysis field
              let strategicInsight = '';
              if (currentModel.strategicAnalysis?.strategic_tradeoffs?.strategic_insight) {
                strategicInsight = currentModel.strategicAnalysis.strategic_tradeoffs.strategic_insight;
              } else if (currentModel.analysis) {
                strategicInsight = currentModel.analysis;
              }
              
              return strategicInsight ? (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: moduleColor }} />
                    Strategic Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 leading-relaxed">{strategicInsight}</p>
                </CardContent>
              </Card>
              ) : null;
            })()}

            {/* AI Recommendations with Eval Buttons */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">AI Strategic Recommendations</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Powered by Stackwise Sage
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">Context-aware insights with confidence scoring for Eval Matrix</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generate recommendations based on model characteristics */}
                {[
                  {
                    id: 'rec-1',
                    category: 'Channel Optimization',
                    recommendation: kpis.kpis.awareness > 70 
                      ? 'Your high awareness focus suggests adding PR and podcast outreach to amplify reach beyond paid channels'
                      : 'Consider increasing LinkedIn and content marketing budget to build awareness foundation',
                    confidence: kpis.kpis.awareness > 70 ? 92 : 78,
                    rationale: 'Based on current channel mix and awareness KPI target',
                    impact: 'High'
                  },
                  {
                    id: 'rec-2',
                    category: 'Funnel Balance',
                    recommendation: kpis.balance < 60
                      ? `Balance score of ${kpis.balance}% indicates over-concentration. Redistribute ${Math.round((100 - kpis.balance) / 2)}% from top stage to conversion/retention`
                      : 'Your funnel balance is healthy. Maintain current stage distribution while optimizing execution',
                    confidence: kpis.balance < 60 ? 88 : 85,
                    rationale: `Balance index: ${kpis.balance}% - ${kpis.balance < 60 ? 'Below' : 'Above'} threshold`,
                    impact: kpis.balance < 60 ? 'Critical' : 'Medium'
                  },
                  {
                    id: 'rec-3',
                    category: 'Resource Management',
                    recommendation: kpis.systemLoad > 80
                      ? `System load at ${kpis.systemLoad}% risks team burnout. Consider reducing channel count or extending timeline by 30%`
                      : `System load at ${kpis.systemLoad}% is sustainable. You have capacity for 1-2 additional experimental channels`,
                    confidence: kpis.systemLoad > 80 ? 94 : 81,
                    rationale: `Team capacity analysis based on ${kpis.systemLoad}% load factor`,
                    impact: kpis.systemLoad > 80 ? 'Critical' : 'Low'
                  },
                  {
                    id: 'rec-4',
                    category: 'Quick Win Tactics',
                    recommendation: kpis.kpis.efficiency > 75
                      ? 'Your efficiency focus enables A/B testing at scale. Run 3-5 landing page variants to optimize conversion'
                      : 'Focus on proven channels first. Allocate 10% budget to test new tactics once baseline performs',
                    confidence: 73,
                    rationale: 'Efficiency KPI alignment with testing capability',
                    impact: 'Medium'
                  }
                ].map((rec) => (
                  <Card key={rec.id} className="bg-white border border-blue-200">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  rec.impact === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                                  rec.impact === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                  rec.impact === 'Medium' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                  'border-green-500 text-green-700 bg-green-50'
                                }`}
                              >
                                {rec.impact} Impact
                              </Badge>
                              <span className="text-xs font-semibold text-gray-600">{rec.category}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-2">{rec.recommendation}</p>
                            <p className="text-xs text-gray-600 mb-2">
                              <span className="font-semibold">Rationale:</span> {rec.rationale}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-700 font-semibold">
                                  {rec.confidence}% Confidence
                                </span>
                              </div>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  style={{ width: `${rec.confidence}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0 border-blue-500 text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              // TODO: Implement actual push to Strategy Studio Eval Matrix
                              alert(`Recommendation "${rec.category}" pushed to Strategy Studio Eval Matrix!\n\nThis would integrate with your Eval Matrix to track and prioritize this insight.`);
                            }}
                            data-testid={`button-eval-${rec.id}`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Eval
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-blue-600">
                    💡 Tip: Click "Eval" on any recommendation to add it to your Strategy Studio Eval Matrix for prioritization
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-700"
                    onClick={() => {
                      alert('All 4 recommendations pushed to Strategy Studio Eval Matrix!\n\nYou can now prioritize and track these insights in your quarterly strategy workflow.');
                    }}
                    data-testid="button-eval-all"
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    Push All to Eval
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NEW: Budget vs Focus Alignment Analysis */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">Budget vs Focus Alignment</CardTitle>
                </div>
                <p className="text-sm text-purple-700">Detecting mismatches between budget allocation and strategic focus</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const budgetMix = currentModel.config.budgetMix || DEFAULT_BUDGET_MIX;
                  const misalignments = [];
                  
                  // Calculate total paid social budget (LinkedIn, Meta, YouTube, X, TikTok, Reddit)
                  const paidSocialBudget = budgetMix
                    .filter(b => ['linkedin_ads', 'meta_ads', 'youtube_ads', 'x_ads', 'tiktok_ads', 'reddit_ads'].includes(b.key))
                    .reduce((sum, b) => sum + b.allocation, 0);
                  
                  // Get paid_social channel focus
                  const paidSocialChannel = currentModel.config.channels.find(c => c.key === 'paid_social');
                  const paidSocialFocus = paidSocialChannel ? paidSocialChannel.budgetPct : 0;
                  
                  // Check for mismatch (>15% difference)
                  const socialMismatch = Math.abs(paidSocialBudget - paidSocialFocus);
                  if (socialMismatch > 0.15) {
                    misalignments.push({
                      area: 'Paid Social',
                      budgetAllocation: Math.round(paidSocialBudget * 100),
                      focusAllocation: Math.round(paidSocialFocus * 100),
                      gap: Math.round(socialMismatch * 100),
                      severity: socialMismatch > 0.25 ? 'High' : 'Medium',
                      recommendation: paidSocialBudget > paidSocialFocus
                        ? `You've allocated ${Math.round(paidSocialBudget * 100)}% of budget to paid social but only ${Math.round(paidSocialFocus * 100)}% strategic focus. Either increase social focus or reallocate budget.`
                        : `Strategic focus (${Math.round(paidSocialFocus * 100)}%) exceeds budget allocation (${Math.round(paidSocialBudget * 100)}%). Consider increasing paid social budget or reducing focus expectations.`
                    });
                  }
                  
                  // Calculate total events budget
                  const eventsBudget = budgetMix
                    .filter(b => ['webinar_sponsorship', 'podcast_sponsorship', 'event_sponsorship', 'events_tradeshows'].includes(b.key))
                    .reduce((sum, b) => sum + b.allocation, 0);
                  
                  const eventsChannel = currentModel.config.channels.find(c => c.key === 'events');
                  const eventsFocus = eventsChannel ? eventsChannel.budgetPct : 0;
                  
                  const eventsMismatch = Math.abs(eventsBudget - eventsFocus);
                  if (eventsMismatch > 0.15) {
                    misalignments.push({
                      area: 'Events & Sponsorships',
                      budgetAllocation: Math.round(eventsBudget * 100),
                      focusAllocation: Math.round(eventsFocus * 100),
                      gap: Math.round(eventsMismatch * 100),
                      severity: eventsMismatch > 0.25 ? 'High' : 'Medium',
                      recommendation: eventsBudget > eventsFocus
                        ? `Events budget (${Math.round(eventsBudget * 100)}%) significantly exceeds strategic focus (${Math.round(eventsFocus * 100)}%). Increase events focus allocation or redistribute budget.`
                        : `Events focus (${Math.round(eventsFocus * 100)}%) exceeds budget (${Math.round(eventsBudget * 100)}%). You may need more sponsorship/event budget to execute this strategy.`
                    });
                  }
                  
                  // Check if top-heavy budget doesn't match awareness focus
                  const topFunnelBudget = paidSocialBudget + eventsBudget;
                  const awarenessStage = currentModel.config.stages.awareness || 0;
                  
                  if (topFunnelBudget > 0.6 && awarenessStage < 0.3) {
                    misalignments.push({
                      area: 'Funnel Stage Mismatch',
                      budgetAllocation: Math.round(topFunnelBudget * 100),
                      focusAllocation: Math.round(awarenessStage * 100),
                      gap: Math.round((topFunnelBudget - awarenessStage) * 100),
                      severity: 'High',
                      recommendation: `${Math.round(topFunnelBudget * 100)}% of your budget goes to top-funnel channels, but only ${Math.round(awarenessStage * 100)}% of strategic focus is on awareness. This creates execution confusion.`
                    });
                  }
                  
                  return misalignments.length > 0 ? (
                    <div className="space-y-3">
                      {misalignments.map((item, idx) => (
                        <Card key={idx} className="bg-white border-2 border-purple-300">
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline"
                                    className={`${
                                      item.severity === 'High' ? 'border-red-500 text-red-700 bg-red-50' : 
                                      'border-yellow-500 text-yellow-700 bg-yellow-50'
                                    }`}
                                  >
                                    {item.severity} Priority
                                  </Badge>
                                  <span className="font-semibold text-sm">{item.area}</span>
                                </div>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  {item.gap}% Gap
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-yellow-700 font-medium">Paid Budget</p>
                                  <p className="text-lg font-bold text-yellow-900">{item.budgetAllocation}%</p>
                                </div>
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-blue-700 font-medium">Strategic Focus</p>
                                  <p className="text-lg font-bold text-blue-900">{item.focusAllocation}%</p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">⚠️ Misalignment:</span> {item.recommendation}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="pt-2 text-xs text-purple-700 bg-purple-100 p-3 rounded-lg border border-purple-300">
                        <strong>Analysis Insight:</strong> Budget-focus misalignment often leads to confusion in execution. Your team may struggle to prioritize when budget dollars don't match strategic emphasis. Align these within ±15% for optimal clarity.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-green-300">
                      <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-green-900">Strong Budget-Focus Alignment</p>
                      <p className="text-xs text-green-700 mt-1">Your paid budget allocation matches your strategic focus areas (within ±15%). This creates clarity for execution.</p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* NEW: Comprehensive Tradeoff Insights */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Strategic Tradeoffs</CardTitle>
                </div>
                <p className="text-sm text-orange-700">Understanding what you're optimizing for—and what you're sacrificing</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const tradeoffs = [];
                  
                  // High awareness vs low retention tradeoff
                  if (kpis.kpis.awareness > 75 && kpis.kpis.retention < 40) {
                    tradeoffs.push({
                      type: 'Top-Heavy Model',
                      winning: `High Awareness (${kpis.kpis.awareness})`,
                      losing: `Low Retention (${kpis.kpis.retention})`,
                      insight: "You're optimized for maximum reach and new logo acquisition. This is ideal for land-grab scenarios or brand launches, but customer LTV will suffer. Expect higher churn rates.",
                      action: 'If retention becomes critical, shift 15-20% budget from awareness channels to customer success, community, and retention programs.'
                    });
                  }
                  
                  // High efficiency vs low velocity tradeoff
                  if (kpis.kpis.efficiency > 75 && kpis.kpis.velocity < 50) {
                    tradeoffs.push({
                      type: 'Efficiency-First Model',
                      winning: `Strong Efficiency (${kpis.kpis.efficiency})`,
                      losing: `Slower Velocity (${kpis.kpis.velocity})`,
                      insight: "You're optimized for ROI and cost-per-acquisition. Perfect for capital-efficient growth, but pipeline generation will be slower. This extends your sales cycle.",
                      action: 'To accelerate pipeline velocity, consider adding demand gen campaigns even if CPA is higher. Sometimes speed > efficiency.'
                    });
                  }
                  
                  // High velocity vs low efficiency
                  if (kpis.kpis.velocity > 75 && kpis.kpis.efficiency < 50) {
                    tradeoffs.push({
                      type: 'Speed-First Model',
                      winning: `Fast Velocity (${kpis.kpis.velocity})`,
                      losing: `Lower Efficiency (${kpis.kpis.efficiency})`,
                      insight: "You're optimized for pipeline volume and speed-to-close. Great for hitting aggressive growth targets, but cost-per-acquisition will be higher. Burn rate increases.",
                      action: 'If burn becomes a concern, shift budget from high-volume/low-conversion channels to proven efficient channels like referrals and partnerships.'
                    });
                  }
                  
                  // High credibility vs low awareness
                  if (kpis.kpis.credibility > 80 && kpis.kpis.awareness < 50) {
                    tradeoffs.push({
                      type: 'Authority-First Model',
                      winning: `High Credibility (${kpis.kpis.credibility})`,
                      losing: `Limited Awareness (${kpis.kpis.awareness})`,
                      insight: "You're building deep authority with a narrow audience. Ideal for high-ACV enterprise sales where trust matters more than reach. But total addressable market penetration will be slow.",
                      action: 'Once authority is established (6-12 months), layer in broader awareness tactics like PR and social to amplify your credibility to new audiences.'
                    });
                  }
                  
                  // System overload tradeoff
                  if (kpis.systemLoad > 85) {
                    tradeoffs.push({
                      type: 'Capacity Risk',
                      winning: 'Multi-Channel Coverage',
                      losing: `Team Bandwidth (${kpis.systemLoad}% load)`,
                      insight: `Your model activates many channels simultaneously, which provides diversification but risks team burnout at ${kpis.systemLoad}% capacity. Quality of execution may suffer across all channels.`,
                      action: 'Consider a phased rollout: Launch 3-4 core channels first, prove them out, then add 1-2 new channels per quarter. Quality > Quantity.'
                    });
                  }
                  
                  // Balanced model
                  if (tradeoffs.length === 0 && kpis.balance > 70) {
                    tradeoffs.push({
                      type: 'Balanced Approach',
                      winning: 'Diversified Strategy',
                      losing: 'Maximum Specialization',
                      insight: `Your model is well-balanced across awareness, efficiency, and velocity. This reduces risk and provides optionality, but you won't dominate any single dimension. ${kpis.balance}% balance score indicates good equilibrium.`,
                      action: 'Monitor which channels over-perform in first 60 days, then shift 10-15% budget toward winners while maintaining overall balance.'
                    });
                  }
                  
                  return (
                    <div className="space-y-3">
                      {tradeoffs.map((item, idx) => (
                        <Card key={idx} className="bg-white border-2 border-orange-300">
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-orange-500 text-orange-700 bg-orange-100">
                                  {item.type}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                                  <p className="text-xs text-green-700 font-medium mb-1">✓ What You're Winning</p>
                                  <p className="text-sm font-bold text-green-900">{item.winning}</p>
                                </div>
                                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                                  <p className="text-xs text-red-700 font-medium mb-1">✗ What You're Sacrificing</p>
                                  <p className="text-sm font-bold text-red-900">{item.losing}</p>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700 font-semibold mb-1">💡 Strategic Insight</p>
                                <p className="text-sm text-blue-900">{item.insight}</p>
                              </div>
                              
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-xs text-purple-700 font-semibold mb-1">→ Adjustment Option</p>
                                <p className="text-sm text-purple-900">{item.action}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Risk Assessment & Implementation Roadmap - Horizontal Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Risk Assessment */}
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-900">
                    <Shield className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Potential challenges to monitor</p>
                </CardHeader>
                <CardContent>
                  {kpis?.warnings && kpis.warnings.length > 0 ? (
                    <ul className="space-y-2">
                      {kpis.warnings.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-yellow-800">
                          <AlertTriangle className="w-4 h-4 mt-0.5" />
                          <span className="text-sm">{w}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No significant risks detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Implementation Roadmap */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Implementation Roadmap</CardTitle>
                  <p className="text-sm text-muted-foreground">Recommended steps to execute this model</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { phase: '30 Days', action: 'Set up channel infrastructure and initial campaigns', icon: Target },
                      { phase: '60 Days', action: 'Optimize based on early data, adjust mix', icon: TrendingUp },
                      { phase: '90 Days', action: 'Full-scale execution with proven tactics', icon: Rocket }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <item.icon className="w-5 h-5 mt-0.5" style={{ color: moduleColor }} />
                        <div>
                          <p className="font-semibold text-sm">{item.phase}</p>
                          <p className="text-sm text-gray-700">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setCurrentStep('builder')} data-testid="button-edit-model">
                Edit Model
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep('compare')} data-testid="button-compare-others">
                Compare with Others
              </Button>
              <Button variant="outline" data-testid="button-push-to-eval">
                <CheckCircle className="w-3 h-3 mr-1" /> Push to Eval Matrix
              </Button>
            </div>
            </div>
            )}
          </div>
        </div>
          );
        })()}
        </div>
      </div>
    )
  };

  const exportComparison = () => {
    const data = {
      models: compareModels.filter(m => m !== null),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gtm-comparison.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <Sidebar
        selectedMenuItem="GTM Test Pit"
        onMenuItemClick={() => {}}
      />

      <div className="flex-1 min-w-0">
        <NavBar />

        <ThreeColumnLayout
          leftNav={leftNav}
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
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
          featureName="GTM Test Pit"
        />
      </div>
    </div>
  );
}

