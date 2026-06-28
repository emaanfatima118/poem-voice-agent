import { Linkedin, Mail, Target, TrendingUp, Users } from "lucide-react";

export const TOTAL_STEPS = 5;

export const stepLabels = [
  "Welcome",
  "Foundations",
  "GTM Motions",
  "Channels",
  "Finalize",
];

export const onboardingSteps = [
  {
    number: 1,
    title: "Welcome",
    label: "Welcome",
    description: "Introduction to Strategy Studio and what to expect",
    duration: "2 min",
  },
  {
    number: 2,
    title: "Foundations",
    label: "Foundations",
    description: "Define goals, audiences, and focus areas",
    duration: "8 min",
    inputs: ["Goals", "Audiences", "Focus Areas"],
  },
  {
    number: 3,
    title: "GTM Motions",
    label: "GTM Motions",
    description: "Select your go-to-market strategies",
    duration: "5 min",
    inputs: ["GTM Approach"],
  },
  {
    number: 4,
    title: "Channels",
    label: "Channels",
    description: "Choose marketing channels and allocate budget",
    duration: "6 min",
    inputs: ["Channel Mix", "Budget Allocation"],
  },
  {
    number: 5,
    title: "Finalize",
    label: "Finalize",
    description: "Review and activate your strategy",
    duration: "2 min",
  },
];

export const goalOptions = [
  "Grow Revenue",
  "Increase Brand Awareness",
  "Generate More Leads",
  "Improve Customer Retention",
  "Expand Market Share",
  "Launch New Product",
];

export const motionOptions = [
  {
    id: "inbound_outbound",
    name: "Inbound/Outbound",
    description: "Combined content marketing and active prospecting",
  },
  {
    id: "abm",
    name: "Account-Based Marketing",
    description: "Targeted campaigns for high-value accounts",
  },
  {
    id: "partner_channel",
    name: "Partner & Channel",
    description: "Leverage partnerships and distribution channels",
  },
  {
    id: "demand_gen",
    name: "Demand Generation",
    description: "Create and nurture demand through content",
  },
  {
    id: "community",
    name: "Community-Led Growth",
    description: "Build and engage your community",
  },
];

export const channelOptions = [
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "email", name: "Email", icon: Mail },
  { id: "paid", name: "Paid Ads", icon: TrendingUp },
  { id: "content", name: "Content/Blog", icon: Target },
  { id: "events", name: "Events", icon: Users },
];

export const recipeOptions = [
  {
    id: "exec_pov",
    name: "Executive POV Sprint",
    description: "Build thought leadership content from exec perspectives",
    category: "Awareness",
  },
  {
    id: "optimization",
    name: "Optimization Sprint",
    description: "Improve consistency and performance of existing content",
    category: "Efficiency",
  },
  {
    id: "advocacy_loop",
    name: "Advocacy Loop",
    description: "Turn customers into advocates and referral sources",
    category: "Retention",
  },
  {
    id: "pipeline_revival",
    name: "Pipeline Revival",
    description: "Re-engage stale opportunities with targeted campaigns",
    category: "Conversion",
  },
  {
    id: "launch_loop",
    name: "Launch Loop",
    description: "Coordinated multi-channel product/feature launches",
    category: "Awareness",
  },
];

export const sampleInputs = [
  {
    label: "Primary Goals",
    examples: ["Grow Revenue", "Increase Brand Awareness", "Generate More Leads"],
  },
  {
    label: "Target Audiences",
    examples: ["Executives", "Practitioners", "Developers"],
  },
  {
    label: "GTM Motion",
    examples: ["Account-Based Marketing", "Demand Generation"],
  },
  {
    label: "Channel Mix",
    examples: ["LinkedIn", "Email", "Paid Ads"],
  },
];
