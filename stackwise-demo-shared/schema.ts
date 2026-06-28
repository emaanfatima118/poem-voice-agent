import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Strategy Snapshots
export const strategySnapshots = pgTable("strategy_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  version: text("version").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  foundations: jsonb("foundations").notNull(),
  gtmMotions: jsonb("gtm_motions").notNull(),
  channels: jsonb("channels").notNull(),
  activeRecipes: jsonb("active_recipes").notNull(),
  playbook: jsonb("playbook").notNull(),
  budget: integer("budget"),
  quarterStartDate: timestamp("quarter_start_date"),
  quarterEndDate: timestamp("quarter_end_date"),
});

export const insertStrategySnapshotSchema = createInsertSchema(strategySnapshots).omit({
  id: true,
  timestamp: true,
});

export type InsertStrategySnapshot = z.infer<typeof insertStrategySnapshotSchema>;
export type StrategySnapshot = typeof strategySnapshots.$inferSelect;

// Insights Snapshots
export const insightsSnapshots = pgTable("insights_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  quarter: text("quarter").notNull(),
  wins: jsonb("wins").notNull(),
  misses: jsonb("misses").notNull(),
  nextMoves: jsonb("next_moves").notNull(),
  metricsSummary: jsonb("metrics_summary").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertInsightsSnapshotSchema = createInsertSchema(insightsSnapshots).omit({
  id: true,
  timestamp: true,
});

export type InsertInsightsSnapshot = z.infer<typeof insertInsightsSnapshotSchema>;
export type InsightsSnapshot = typeof insightsSnapshots.$inferSelect;

// Campaign Recipes
export const campaignRecipes = pgTable("campaign_recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
  lastRun: timestamp("last_run"),
  performanceTag: text("performance_tag"),
  outcomes: jsonb("outcomes"),
  kpiDefaults: jsonb("kpi_defaults"),
});

export const insertCampaignRecipeSchema = createInsertSchema(campaignRecipes).omit({
  id: true,
});

export type InsertCampaignRecipe = z.infer<typeof insertCampaignRecipeSchema>;
export type CampaignRecipe = typeof campaignRecipes.$inferSelect;

// Milestones (30/60/90)
export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  projectId: varchar("project_id"),
  title: text("title").notNull(),
  description: text("description"),
  timeframe: text("timeframe").notNull(), // "30", "60", "90"
  priority: text("priority"), // "low", "medium", "high", "critical"
  risk: text("risk"), // "low", "medium", "high"
  impact: text("impact"), // "low", "medium", "high"
  effort: text("effort"), // "low", "medium", "high"
  status: text("status").notNull().default("pending"), // "pending", "in_progress", "completed"
  assignee: text("assignee"),
  tags: text("tags").array(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  order: integer("order").notNull().default(0),
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

// Projects (shared across modules)
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  module: text("module").notNull(), // "strategy_studio", "pulse_hub", "brand_craft", "flight_deck"
  status: text("status").notNull().default("active"), // "active", "archived", "completed"
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Assistant Suggestions
export const assistantSuggestions = pgTable("assistant_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // "goal", "channel", "recipe", "motion"
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  keyInfluencers: jsonb("key_influencers").notNull(),
  sourceModule: text("source_module").notNull(),
  dataRecency: text("data_recency"),
  calculationNote: text("calculation_note"),
  action: text("action"), // "accepted", "dismissed", "simulated", "pending"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAssistantSuggestionSchema = createInsertSchema(assistantSuggestions).omit({
  id: true,
  createdAt: true,
});

export type InsertAssistantSuggestion = z.infer<typeof insertAssistantSuggestionSchema>;
export type AssistantSuggestion = typeof assistantSuggestions.$inferSelect;

// Simulations
export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  scenarioType: text("scenario_type").notNull(),
  inputs: jsonb("inputs").notNull(),
  outputs: jsonb("outputs").notNull(),
  moduleOrigin: text("module_origin").notNull(),
  saved: boolean("saved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
});

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;

// Tracking Codes (for QR codes and campaign tracking with distribution integration)
export const trackingCodes = pgTable("tracking_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  campaign: text("campaign").notNull(),
  code: text("code").notNull().unique(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  destinationUrl: text("destination_url").notNull(),
  qrCodeData: text("qr_code_data"),
  scans: integer("scans").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Distribution integration (link tracking codes to distribution cards/assets)
  distributionCardId: varchar("distribution_card_id"), // Links to distributionCards
  distributionAssetId: varchar("distribution_asset_id"), // Links to distributionAssets (for asset-level tracking)
  campaignId: varchar("campaign_id"), // Links to original campaign from Campaign Builder
  channelName: text("channel_name"), // "LinkedIn", "Email", "Google Ads", etc.
  assetName: text("asset_name"), // "Email 1", "Post 2", etc.
});

export const insertTrackingCodeSchema = createInsertSchema(trackingCodes).omit({
  id: true,
  createdAt: true,
});

export type InsertTrackingCode = z.infer<typeof insertTrackingCodeSchema>;
export type TrackingCode = typeof trackingCodes.$inferSelect;

// My Plays (strategic collection for quarterly review)
export const plays = pgTable("plays", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sourceModule: text("source_module").notNull(), // "strategy_studio", "pulse_hub", "brand_craft", "flight_deck"
  sourceType: text("source_type").notNull(), // "insight", "milestone", "recommendation", "content", "campaign"
  sourceId: varchar("source_id"), // Reference to original item if applicable
  title: text("title").notNull(),
  summary: text("summary"),
  notes: text("notes"),
  tags: text("tags").array(),
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high", "critical"
  quarterTarget: text("quarter_target").notNull(), // "Q1-2024", "Q2-2024", etc.
  status: text("status").notNull().default("captured"), // "captured", "ready_for_review", "accepted", "deferred", "archived"
  decisionLog: jsonb("decision_log"), // Audit trail of accept/modify/defer decisions
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaySchema = createInsertSchema(plays).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlay = z.infer<typeof insertPlaySchema>;
export type Play = typeof plays.$inferSelect;

// Evaluation Matrix Items
export const evalMatrixItems = pgTable("eval_matrix_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  priority: text("priority").notNull(), // "low", "medium", "high"
  risk: text("risk").notNull(), // "low", "medium", "high"
  status: text("status").notNull().default("pending"), // "pending", "in-review", "accepted", "deferred", "completed"
  impact: text("impact"), // Expected impact description
  recommendedBy: text("recommended_by"), // Source of recommendation
  sourceModule: text("source_module"), // Which module suggested this
  sourceId: varchar("source_id"), // Reference to original source if applicable
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEvalMatrixItemSchema = createInsertSchema(evalMatrixItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEvalMatrixItem = z.infer<typeof insertEvalMatrixItemSchema>;
export type EvalMatrixItem = typeof evalMatrixItems.$inferSelect;

// TypeScript interfaces for frontend use
export interface StrategyFoundations {
  goals: string[];
  focusAreas: string[];
  audiences: string[];
  brandIntent: string;
}

export interface GTMMotion {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  outcomes?: string[];
}

export interface Channel {
  id: string;
  name: string;
  role: string; // "Awareness", "Nurture", "Conversion", "Retention"
  cadence: string; // "Active", "Light", "Inactive"
  engagement?: number;
  delta?: number;
}

export interface PlaysRecipe {
  id: string;
  name: string;
  status: string; // "active", "in_library", "completed", "suggested"
  performanceTag?: string; // "high_performing", "medium", "low"
  lastRun?: string;
}

export interface InsightCard {
  type: "win" | "watchout" | "next";
  message: string;
  metric?: string;
  delta?: string;
}

export interface EvaluationMatrixItem {
  id: string;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  risk: "low" | "medium" | "high";
  timeframe?: "30" | "60" | "90";
  assignee?: string;
}

export interface AssistantInsight {
  id: string;
  title: string;
  message: string;
  type: "performance" | "suggestion" | "warning";
  confidence: number;
  module: string;
}

// Annual Business Goals
export const annualGoals = pgTable("annual_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  goalName: text("goal_name").notNull(),
  target: text("target").notNull(),
  kpiMetric: text("kpi_metric"),
  unit: text("unit"),
  dataSource: text("data_source"),
  status: text("status").notNull().default("active"), // "active", "completed", "archived"
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnnualGoalSchema = createInsertSchema(annualGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAnnualGoal = z.infer<typeof insertAnnualGoalSchema>;
export type AnnualGoal = typeof annualGoals.$inferSelect;

// Quarterly Goals
export const quarterlyGoals = pgTable("quarterly_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  annualGoalId: varchar("annual_goal_id"), // Optional link to parent annual goal
  goalName: text("goal_name").notNull(),
  target: text("target").notNull(),
  kpiMetric: text("kpi_metric"),
  owner: text("owner"),
  status: text("status").notNull().default("active"), // "active", "in_progress", "completed", "planned"
  quarter: text("quarter").notNull(), // "Q1-2025", "Q2-2025", etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQuarterlyGoalSchema = createInsertSchema(quarterlyGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQuarterlyGoal = z.infer<typeof insertQuarterlyGoalSchema>;
export type QuarterlyGoal = typeof quarterlyGoals.$inferSelect;

// GTM Models (Test Pit)
export const gtmModels = pgTable("gtm_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  code: text("code"), // Auto-generated code like "GTM-241104-001"
  description: text("description"),
  archetype: text("archetype"), // "brand-heavy", "demand-surge", "retention-focused", etc.
  tags: text("tags").array(),
  config: jsonb("config").notNull(), // Full model configuration (personas, stages, channels, recipes, execs)
  kpis: jsonb("kpis").notNull(), // Calculated KPIs (awareness, velocity, efficiency, retention, credibility)
  systemLoad: integer("system_load"),
  balance: integer("balance"),
  warnings: text("warnings").array(),
  analysis: text("analysis"), // AI-generated narrative
  isArchetype: boolean("is_archetype").default(false), // True for built-in archetypes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGtmModelSchema = createInsertSchema(gtmModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGtmModel = z.infer<typeof insertGtmModelSchema>;
export type GtmModel = typeof gtmModels.$inferSelect;

// Brand Craft - Voice Check
export type VoiceCheck = {
  id: string;
  projectId: string;
  assetName: string;
  score: number;
  insights: string[];
  recommendations: string[];
  createdAt: Date;
};

// Brand Craft - Asset Comparison
export type AssetComparison = {
  id: string;
  projectId: string;
  asset1: string;
  asset2: string;
  similarity: number;
  differences: string[];
  createdAt: Date;
};

// Brand Craft - Executives (Thought Leadership)
export const executives = pgTable("executives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  title: text("title"),
  company: text("company"),
  audience: text("audience"),
  goals: text("goals"),
  bio: text("bio"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  tiktok: text("tiktok"),
  reddit: text("reddit"),
  wechat: text("wechat"),
  website: text("website"),
  expertise: text("expertise").array(),
  followPeople: text("follow_people").array(),
  follows: text("follows").array(),
  eventsInterest: text("events_interest").array(),
  phrasesUse: text("phrases_use"),
  phrasesAvoid: text("phrases_avoid"),
  communities: text("communities").array(),
  newsSources: text("news_sources").array(),
  industry: text("industry"),
  vertical: text("vertical"),
  motivates: text("motivates"),
  personality: text("personality"),
  visibilityScore: integer("visibility_score").default(0),
  toneScore: integer("tone_score").default(0),
  engagementScore: integer("engagement_score").default(0),
  personaScore: integer("persona_score").default(0),
  toneMapping: jsonb("tone_mapping"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertExecutiveSchema = createInsertSchema(executives).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExecutive = z.infer<typeof insertExecutiveSchema>;
export type Executive = typeof executives.$inferSelect;

// Executive Visibility Content (Individual Posts/Pieces)
export const executiveContent = pgTable("executive_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  executiveId: varchar("executive_id").notNull(), // Link to executives table
  programTitle: text("program_title"), // e.g., "Poll Series", "Video Series"
  programType: text("program_type"), // e.g., "poll_series", "video_series", "keynote_repurpose"
  
  // Individual piece details
  pieceTitle: text("piece_title").notNull(), // e.g., "Poll 1: Biggest challenge"
  pieceNumber: integer("piece_number").default(1), // Order within the series
  contentType: text("content_type"), // "LinkedIn Post", "Video", "Blog", "Poll"
  channel: text("channel"), // "LinkedIn", "Twitter", "YouTube", etc.
  
  // Content
  headline: text("headline"),
  bodyContent: text("body_content"),
  notes: text("notes"),
  
  // Scheduling for individual pieces
  launchDate: timestamp("launch_date"), // When this specific piece should launch
  endDate: timestamp("end_date"), // Optional end date
  
  // Status tracking
  status: text("status").default("draft"), // "draft", "review", "approved", "scheduled", "published"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertExecutiveContentSchema = createInsertSchema(executiveContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExecutiveContent = z.infer<typeof insertExecutiveContentSchema>;
export type ExecutiveContent = typeof executiveContent.$inferSelect;

// Campaign Builder Tables

// Campaigns
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  projectId: varchar("project_id"), // Link to projects table
  name: text("name").notNull(),
  goal: text("goal"), // "Awareness", "Consideration", "Conversion", "Retention"
  primaryPersona: text("primary_persona"),
  secondaryPersonas: text("secondary_personas").array(),
  targetSegment: text("target_segment"),
  keyProblem: text("key_problem"),
  coreOffer: text("core_offer"),
  heroMessage: text("hero_message"),
  primaryCta: text("primary_cta"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  successMetrics: text("success_metrics"),
  estimatedBudget: text("estimated_budget"),
  estimatedHours: text("estimated_hours"),
  channels: text("channels").array(),
  campaignPillar: text("campaign_pillar"),
  supportingEvidence: text("supporting_evidence"),
  competitiveContext: text("competitive_context"),
  usp: text("usp"),
  keyRisks: text("key_risks"),
  stakeholders: text("stakeholders"),
  integrationNeeds: text("integration_needs"),
  initialAssets: text("initial_assets"),
  status: text("status").notNull().default("draft"), // "draft", "review", "approved", "scheduled", "live", "paused", "completed", "archived"
  
  // Budget & Priority (Flight Deck integration)
  priority: text("priority").default("medium"), // "high", "medium", "low"
  campaignType: text("campaign_type"), // "brand_awareness", "lead_gen", "engagement", "sales", "lifecycle"
  allocatedBudget: integer("allocated_budget"), // Approved budget from Flight Deck
  actualSpend: integer("actual_spend").default(0),
  budgetStatus: text("budget_status").default("pending"), // "pending", "approved", "needs_reallocation", "overspend"
  
  // Flight Deck tracking
  loadedToFlightDeck: boolean("loaded_to_flight_deck").default(false),
  flightDeckApprovedAt: timestamp("flight_deck_approved_at"),
  flightDeckApprovedBy: varchar("flight_deck_approved_by"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

// Campaign Assets
export const campaignAssets = pgTable("campaign_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  campaignId: varchar("campaign_id").notNull(),
  assetName: text("asset_name").notNull(),
  contentType: text("content_type"), // "Ad", "Email", "Blog", "Landing Page", "Video"
  channel: text("channel"), // "LinkedIn", "Google", "Email", "Web", etc.
  persona: text("persona"),
  stage: text("stage"), // "Awareness", "Consideration", "Conversion", "Retention"
  goal: text("goal"),
  notes: text("notes"),
  assetUrl: text("asset_url"),
  isFromLibrary: boolean("is_from_library").default(false),
  libraryAssetId: varchar("library_asset_id"), // If pulled from existing content
  
  // Scheduling for multi-item content (nurture series, etc.)
  launchDate: timestamp("launch_date"), // When this specific asset should launch
  endDate: timestamp("end_date"), // Optional end date for asset
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCampaignAssetSchema = createInsertSchema(campaignAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaignAsset = z.infer<typeof insertCampaignAssetSchema>;
export type CampaignAsset = typeof campaignAssets.$inferSelect;

// Campaign Channel Placements
export const campaignChannelPlacements = pgTable("campaign_channel_placements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  campaignId: varchar("campaign_id").notNull(),
  channelType: text("channel_type").notNull(), // "owned", "paid", "shared", "earned"
  channelName: text("channel_name").notNull(),
  assetCount: integer("asset_count").default(0),
  spend: text("spend"),
  purpose: text("purpose"),
  tier: text("tier"), // "primary", "secondary", "tertiary"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCampaignChannelPlacementSchema = createInsertSchema(campaignChannelPlacements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaignChannelPlacement = z.infer<typeof insertCampaignChannelPlacementSchema>;
export type CampaignChannelPlacement = typeof campaignChannelPlacements.$inferSelect;

// Campaign Creative
export const campaignCreative = pgTable("campaign_creative", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  campaignId: varchar("campaign_id").notNull(),
  channelPlacementId: varchar("channel_placement_id"), // Link to specific channel placement
  channelName: text("channel_name").notNull(),
  creativeType: text("creative_type"), // "Static Ad", "Video Ad", "Carousel", "Email Graphic", etc.
  format: text("format"),
  size: text("size"), // e.g., "1200x627", "1080x1080"
  headline: text("headline"),
  bodyContent: text("body_content"),
  ctaLink: text("cta_link"),
  assetLink: text("asset_link"), // Figma, Canva, or uploaded file URL
  assetSource: text("asset_source"), // "upload", "figma", "canva", "ai_generated", "stock"
  fileUrl: text("file_url"), // Uploaded or generated image URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCampaignCreativeSchema = createInsertSchema(campaignCreative).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaignCreative = z.infer<typeof insertCampaignCreativeSchema>;
export type CampaignCreative = typeof campaignCreative.$inferSelect;

// Budget System - Comprehensive budget management across Strategy Studio and Flight Deck

// Annual Budgets (Strategy Studio - master definition)
export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  year: integer("year").notNull(),
  fiscalYearStart: text("fiscal_year_start").notNull().default("January"), // "January", "July", etc.
  annualTotal: integer("annual_total").notNull(),
  
  // Category allocations (percentages that must sum to 100)
  paidAdvertisingPercent: integer("paid_advertising_percent").notNull(),
  ownedContentPercent: integer("owned_content_percent").notNull(),
  sharedPartnershipsPercent: integer("shared_partnerships_percent").notNull(),
  earnedPrPercent: integer("earned_pr_percent").notNull(),
  miscPercent: integer("misc_percent").notNull(),
  contingencyPercent: integer("contingency_percent").notNull(),
  
  // Dollar amounts (auto-calculated from percentages)
  paidAdvertising: integer("paid_advertising").notNull(),
  ownedContent: integer("owned_content").notNull(),
  sharedPartnerships: integer("shared_partnerships").notNull(),
  earnedPr: integer("earned_pr").notNull(),
  misc: integer("misc").notNull(),
  contingency: integer("contingency").notNull(),
  contingencyRemaining: integer("contingency_remaining").notNull(),
  
  // Monthly split toggle
  useCustomMonthly: boolean("use_custom_monthly").default(false),
  
  status: text("status").notNull().default("active"), // "active", "archived"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by"),
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

// Monthly Budget Allocations
export const budgetMonthlyAllocations = pgTable("budget_monthly_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  budgetId: varchar("budget_id").notNull(),
  month: text("month").notNull(), // "2025-01", "2025-02", etc.
  monthName: text("month_name").notNull(), // "January", "February", etc.
  
  // Category allocations for this month
  paidAdvertising: integer("paid_advertising").notNull(),
  ownedContent: integer("owned_content").notNull(),
  sharedPartnerships: integer("shared_partnerships").notNull(),
  earnedPr: integer("earned_pr").notNull(),
  misc: integer("misc").notNull(),
  contingencyAllocation: integer("contingency_allocation").notNull(),
  
  // Actual spend tracking
  paidAdvertisingSpent: integer("paid_advertising_spent").notNull().default(0),
  ownedContentSpent: integer("owned_content_spent").notNull().default(0),
  sharedPartnershipsSpent: integer("shared_partnerships_spent").notNull().default(0),
  earnedPrSpent: integer("earned_pr_spent").notNull().default(0),
  miscSpent: integer("misc_spent").notNull().default(0),
  contingencyUsed: integer("contingency_used").notNull().default(0),
  
  // Tracking
  spendUpdatedAt: timestamp("spend_updated_at"),
  spendUpdatedBy: varchar("spend_updated_by"),
  isLocked: boolean("is_locked").default(false), // Locked after quarterly review
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBudgetMonthlyAllocationSchema = createInsertSchema(budgetMonthlyAllocations).omit({
  id: true,
  createdAt: true,
});

export type InsertBudgetMonthlyAllocation = z.infer<typeof insertBudgetMonthlyAllocationSchema>;
export type BudgetMonthlyAllocation = typeof budgetMonthlyAllocations.$inferSelect;

// Channel Budget Allocations (Flight Deck - Paid Advertising breakdown)
export const budgetChannelAllocations = pgTable("budget_channel_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  monthlyAllocationId: varchar("monthly_allocation_id").notNull(),
  budgetId: varchar("budget_id").notNull(),
  month: text("month").notNull(), // "2025-01"
  
  // Channel
  channel: text("channel").notNull(), // "Google Ads", "LinkedIn Ads", "Facebook Ads", etc.
  
  // Allocations
  allocated: integer("allocated").notNull(),
  spent: integer("spent").notNull().default(0),
  committed: integer("committed").notNull().default(0), // Budget assigned to campaigns
  available: integer("available").notNull(),
  
  // Status
  status: text("status").notNull().default("on_track"), // "on_track", "under", "over", "warning"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBudgetChannelAllocationSchema = createInsertSchema(budgetChannelAllocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBudgetChannelAllocation = z.infer<typeof insertBudgetChannelAllocationSchema>;
export type BudgetChannelAllocation = typeof budgetChannelAllocations.$inferSelect;

// Budget History / Audit Trail (bidirectional sync tracking)
export const budgetHistory = pgTable("budget_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  budgetId: varchar("budget_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  
  // Change metadata
  changeSource: text("change_source").notNull(), // "strategy_studio", "flight_deck"
  changeType: text("change_type").notNull(), // "annual_setup", "reallocation", "increase", "adjustment", "contingency_use", "monthly_update"
  
  // What changed
  targetMonth: text("target_month"), // "2025-01" if month-specific
  targetChannel: text("target_channel"), // Channel name if channel-specific
  
  // Change details
  beforeState: jsonb("before_state").notNull(),
  afterState: jsonb("after_state").notNull(),
  changeAmount: integer("change_amount"),
  
  // Approval
  requiresApproval: boolean("requires_approval").default(false),
  approvalStatus: text("approval_status"), // "pending", "approved", "rejected"
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBudgetHistorySchema = createInsertSchema(budgetHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertBudgetHistory = z.infer<typeof insertBudgetHistorySchema>;
export type BudgetHistory = typeof budgetHistory.$inferSelect;

// Monthly Spend Upload Tracking
export const monthlySpendUploads = pgTable("monthly_spend_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  budgetId: varchar("budget_id").notNull(),
  month: text("month").notNull(), // "2025-01"
  
  // Upload metadata
  uploadedBy: varchar("uploaded_by"),
  uploadedByName: text("uploaded_by_name"),
  uploadMethod: text("upload_method"), // "spreadsheet", "manual", "api"
  
  // Data
  spendData: jsonb("spend_data").notNull(), // Complete spend breakdown
  
  // Status
  isComplete: boolean("is_complete").default(false),
  quarterlyReviewBlocked: boolean("quarterly_review_blocked").default(true), // Block quarterly review until updated
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMonthlySpendUploadSchema = createInsertSchema(monthlySpendUploads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMonthlySpendUpload = z.infer<typeof insertMonthlySpendUploadSchema>;
export type MonthlySpendUpload = typeof monthlySpendUploads.$inferSelect;

// Flight Deck - Multi-Channel Distribution

// Distribution Cards (loaded from BrandCraft campaigns or Exec Vis programs)
export const distributionCards = pgTable("distribution_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  // Flight tracking (new 5-step distribution system)
  flightId: varchar("flight_id"), // Links to distributionFlights table
  currentStatus: text("current_status").default("now_boarding"), // "now_boarding", "safety_checks", "taxiing", "in_flight", "landed"
  optimizationRecos: jsonb("optimization_recos"), // AI recommendations from Optimize step
  safetyChecksPassed: boolean("safety_checks_passed").default(false),
  safetyCheckResults: jsonb("safety_check_results"), // Validation results from Pre-Flight Check
  
  // Source
  sourceType: text("source_type").notNull(), // "campaign", "exec_vis"
  sourceCampaignId: varchar("source_campaign_id"), // Link to campaigns table
  sourceExecutiveId: varchar("source_executive_id"), // Link to executives table
  sourceExecutiveContentId: varchar("source_executive_content_id"), // Link to specific executive content post
  channelPlacementId: varchar("channel_placement_id"), // Link to specific channel placement
  creativeId: varchar("creative_id"), // Link to campaign creative
  
  // Card Data (auto-populated from source)
  campaignName: text("campaign_name").notNull(),
  channelName: text("channel_name").notNull(), // "LinkedIn", "Email", "X", etc.
  channelType: text("channel_type"), // "owned", "paid", "shared", "earned"
  contentName: text("content_name"),
  contentType: text("content_type"), // "Article", "Ad", "Email", etc.
  
  // Campaign details
  goal: text("goal"), // "Awareness", "Consideration", "Conversion", "Retention"
  primaryPersona: text("primary_persona"),
  funnelStage: text("funnel_stage"), // "Awareness", "Consideration", "Decision", "Retention"
  pillar: text("pillar"),
  
  // Scheduling (can be auto-populated or HITL adjusted)
  startDate: text("start_date"),
  endDate: text("end_date"),
  defaultStartDate: text("default_start_date"), // System-suggested start date
  
  // Creative & Assets
  headline: text("headline"),
  bodyContent: text("body_content"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  assetLinks: text("asset_links").array(), // Links to attached creative/assets
  assetCount: integer("asset_count").default(0),
  
  // Budget
  estimatedSpend: integer("estimated_spend"),
  allocatedBudget: integer("allocated_budget"),
  
  // Tracking
  missingFields: text("missing_fields").array(), // Flagged fields that need HITL input
  evalStatus: text("eval_status").default("pending"), // "pending", "reviewed", "needs_attention", "approved"
  budgetStatus: text("budget_status").default("pending"), // "pending", "approved", "over_budget", "needs_adjustment"
  assetStatus: text("asset_status").default("pending"), // "pending", "ready", "missing_assets"
  voiceCheckStatus: text("voice_check_status"), // "pending", "passed", "failed", "n/a"
  voiceCheckScore: integer("voice_check_score"),
  
  // Launch
  launchStatus: text("launch_status").default("not_launched"), // "not_launched", "taxiing", "in_flight", "landed", "delayed"
  launchedAt: timestamp("launched_at"),
  launchedBy: varchar("launched_by"),
  
  // HITL Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDistributionCardSchema = createInsertSchema(distributionCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDistributionCard = z.infer<typeof insertDistributionCardSchema>;
export type DistributionCard = typeof distributionCards.$inferSelect;

// Individual Assets within Distribution Cards
// (For multi-asset campaigns: track each email, post, etc. separately with its own budget and dates)
export const distributionAssets = pgTable("distribution_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  distributionCardId: varchar("distribution_card_id").notNull(), // Parent distribution card
  userId: varchar("user_id").notNull(),
  
  // Asset details
  assetName: text("asset_name").notNull(), // "Email 1", "Post 2", etc.
  assetNumber: integer("asset_number").default(1), // Order/sequence number
  assetType: text("asset_type"), // "Email", "Social Post", "Video", etc.
  assetLink: text("asset_link"), // Link to creative asset
  destinationLink: text("destination_link"), // Destination URL for tracking (where the asset links to)
  budget: integer("budget"), // Budget for this asset (replaces estimatedSpend)
  
  // Individual scheduling & budget
  launchDate: text("launch_date"), // This specific asset's launch date
  endDate: text("end_date"), // Optional end date for this asset
  estimatedSpend: integer("estimated_spend").default(0), // Budget for this specific asset (legacy)
  
  // Content preview
  headline: text("headline"),
  bodyContent: text("body_content"),
  notes: text("notes"),
  
  // Status
  status: text("status").default("pending"), // "pending", "ready", "launched"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDistributionAssetSchema = createInsertSchema(distributionAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDistributionAsset = z.infer<typeof insertDistributionAssetSchema>;
export type DistributionAsset = typeof distributionAssets.$inferSelect;

// Distribution Eval Flags (issues, risks, recommendations per card)
export const distributionEvals = pgTable("distribution_evals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  distributionCardId: varchar("distribution_card_id").notNull(),
  
  // Eval details
  evalType: text("eval_type").notNull(), // "risk", "recommendation", "issue", "warning"
  severity: text("severity").notNull(), // "critical", "high", "medium", "low"
  category: text("category"), // "budget", "assets", "voice", "targeting", "scheduling", "compliance"
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  suggestedFix: text("suggested_fix"),
  budgetAdjustment: integer("budget_adjustment"), // Dollar amount to adjust budget (+ or -)
  estimatedImpact: text("estimated_impact"), // Human-readable impact description
  confidence: integer("confidence"), // Confidence percentage (0-100)
  
  // HITL Resolution
  status: text("status").default("pending"), // "pending", "selected_for_review", "acknowledged", "resolved", "dismissed"
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
  resolutionNotes: text("resolution_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDistributionEvalSchema = createInsertSchema(distributionEvals).omit({
  id: true,
  createdAt: true,
});

export type InsertDistributionEval = z.infer<typeof insertDistributionEvalSchema>;
export type DistributionEval = typeof distributionEvals.$inferSelect;

// Distribution Launches (calendar integration and launch tracking)
export const distributionLaunches = pgTable("distribution_launches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  distributionCardId: varchar("distribution_card_id").notNull(),
  
  // Launch details
  launchType: text("launch_type").notNull(), // "immediate", "scheduled"
  scheduledDate: timestamp("scheduled_date"),
  launchedAt: timestamp("launched_at"),
  launchedBy: varchar("launched_by"),
  
  // Calendar integration
  calendarUpdated: boolean("calendar_updated").default(false),
  calendarEventId: varchar("calendar_event_id"),
  
  // Performance tracking (updated post-launch)
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  actualSpend: integer("actual_spend").default(0),
  
  // Status
  status: text("status").default("taxiing"), // "taxiing", "in_flight", "landed", "delayed", "cancelled"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDistributionLaunchSchema = createInsertSchema(distributionLaunches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDistributionLaunch = z.infer<typeof insertDistributionLaunchSchema>;
export type DistributionLaunch = typeof distributionLaunches.$inferSelect;

// Distribution Flights (tracks 5-step distribution sessions: Load → Optimize → Pre-Flight → Take Off → Flight Board)
export const distributionFlights = pgTable("distribution_flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  // Step tracking
  currentStep: text("current_step").notNull().default("load"), // "load", "optimize", "preflight", "takeoff", "flightboard"
  
  // Flight Manifest (generated during Take Off step)
  flightManifest: jsonb("flight_manifest"), // Comprehensive coverage, spend, risks, readiness per channel/campaign
  
  // Metadata
  flightName: text("flight_name"), // Optional user-defined name
  totalCampaigns: integer("total_campaigns").default(0),
  totalChannels: integer("total_channels").default(0),
  totalBudget: integer("total_budget").default(0),
  
  // Status
  status: text("status").default("draft"), // "draft", "optimizing", "ready_for_launch", "launched", "completed"
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  launchedAt: timestamp("launched_at"),
  completedAt: timestamp("completed_at"),
});

export const insertDistributionFlightSchema = createInsertSchema(distributionFlights).omit({
  id: true,
  createdAt: true,
});

export type InsertDistributionFlight = z.infer<typeof insertDistributionFlightSchema>;
export type DistributionFlight = typeof distributionFlights.$inferSelect;

// HITL Approvals (audit trail for all human-in-the-loop actions across distribution)
export const hitlApprovals = pgTable("hitl_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  // Context
  flightId: varchar("flight_id"), // Links to distributionFlights
  cardId: varchar("card_id"), // Links to distributionCards (if action on specific card)
  assetId: varchar("asset_id"), // Links to distributionAssets (if action on specific asset)
  
  // Approval details
  approvalType: text("approval_type").notNull(), // "budget_override", "safety_check_override", "asset_edit", "date_change", "campaign_removal", "optimization_accept", "optimization_reject", etc.
  action: text("action").notNull(), // Human-readable action description
  reason: text("reason"), // HITL-provided reason/notes
  
  // Before/after state (for audit trail)
  previousValue: jsonb("previous_value"),
  newValue: jsonb("new_value"),
  
  // Metadata
  approvedBy: varchar("approved_by"), // User who approved
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertHitlApprovalSchema = createInsertSchema(hitlApprovals).omit({
  id: true,
  timestamp: true,
});

export type InsertHitlApproval = z.infer<typeof insertHitlApprovalSchema>;
export type HitlApproval = typeof hitlApprovals.$inferSelect;

// Asset Management (DAM for Fully Stacked users)
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  // Basic info
  name: text("name").notNull(),
  description: text("description"),
  
  // File info
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileType: text("file_type"), // "image/png", "application/pdf", etc.
  fileSize: integer("file_size"), // bytes
  thumbnailUrl: text("thumbnail_url"),
  
  // Category filters (from screenshot)
  reportType: text("report_type"), // "Budget", "Reviews", "Packages"
  reportSubType: text("report_sub_type"), // "Quarterly", "Annual", "Strategy", "Insights & Analysis", "Manifesto"
  
  campaignName: text("campaign_name"),
  campaignPersona: text("campaign_persona").array(), // ["CFO", "CMO"]
  campaignStage: text("campaign_stage").array(), // ["Awareness", "Conversion"]
  campaignGoal: text("campaign_goal").array(), // ["Lead Gen", "Brand Awareness"]
  campaignPillar: text("campaign_pillar"), // "P1", "P2", "P3"
  campaignSubTopic: text("campaign_sub_topic"), // Sub-topic under pillar
  
  execName: text("exec_name").array(), // ["Jen", "Sarah", "Mason"]
  execPillar: text("exec_pillar"), // "P1", "P2", "P3"
  execSubTopic: text("exec_sub_topic"), // Sub-topic under pillar
  
  contentType: text("content_type").array(), // ["Display Ad", "Blog", "Email", "PDF"]
  contentChannel: text("content_channel").array(), // ["LinkedIn", "Instagram", "Programmatic"]
  
  stackCategory: text("stack_category"), // Custom stack classification
  
  module: text("module"), // "Strategy Studio", "Pulse Hub", "Brand Craft", "Flight Deck" (legacy)
  moduleFeature: text("module_feature"), // "F1", "F2", etc. (legacy)
  
  // Dynamic module/feature relationships
  moduleId: varchar("module_id"), // FK to modules table
  featureId: varchar("feature_id"), // FK to features table
  reportId: varchar("report_id"), // FK to reports table
  
  // Status
  assetStatus: text("asset_status").default("active"), // "active", "archived", "draft"
  
  // Versioning
  version: integer("version").default(1),
  parentAssetId: varchar("parent_asset_id"), // Points to original asset if this is a version
  
  // Metadata
  tags: text("tags").array(),
  viewCount: integer("view_count").default(0),
  lastViewedAt: timestamp("last_viewed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Asset Views (track recently viewed)
export const assetViews = pgTable("asset_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  assetId: varchar("asset_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const insertAssetViewSchema = createInsertSchema(assetViews).omit({
  id: true,
  viewedAt: true,
});

export type InsertAssetView = z.infer<typeof insertAssetViewSchema>;
export type AssetView = typeof assetViews.$inferSelect;

// Saved Views (custom filter combinations)
export const savedViews = pgTable("saved_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  filters: jsonb("filters").notNull(), // Store filter state as JSON
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedViewSchema = createInsertSchema(savedViews).omit({
  id: true,
  createdAt: true,
});

export type InsertSavedView = z.infer<typeof insertSavedViewSchema>;
export type SavedView = typeof savedViews.$inferSelect;

// Modules table (Parent level - e.g., Reports, BrandCraft, Pulse, Strategy)
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // "Reports", "BrandCraft", "Pulse Hub", "Strategy Studio", "Flight Deck"
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Features table (Child level - e.g., Reviews, Campaign Builder, Performance Dashboard)
export const features = pgTable("features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(), // FK to modules
  name: text("name").notNull(), // "Reviews", "Insights & Analysis", "Campaign Builder"
  description: text("description"),
  isDynamic: boolean("is_dynamic").default(false), // true if system-generated
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFeatureSchema = createInsertSchema(features).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;

// Reports table (Grandchild level - e.g., Quarterly, Annual, Q4 Channel Summary)
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(), // FK to modules
  featureId: varchar("feature_id").notNull(), // FK to features
  name: text("name").notNull(), // "Quarterly", "Annual", "Q4 Channel Summary"
  summary: text("summary"), // Tooltip/description
  reportType: text("report_type"), // "scheduled", "adhoc", "system-generated"
  author: text("author"),
  path: text("path"), // File or URL path to report
  tags: text("tags").array(),
  status: text("status").default("active"), // "active", "archived", "draft"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Asset Versions (track replacement history - Tier 1 feature)
export const assetVersions = pgTable("asset_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull(), // FK to assets
  userId: varchar("user_id").notNull(), // Who made the change
  
  version: integer("version").notNull(),
  changeType: text("change_type").notNull(), // "created", "replaced", "metadata_update", "archived"
  changeDescription: text("change_description"),
  
  // File snapshot
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Metadata snapshot
  previousMetadata: jsonb("previous_metadata"),
  newMetadata: jsonb("new_metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAssetVersionSchema = createInsertSchema(assetVersions).omit({
  id: true,
  createdAt: true,
});

export type InsertAssetVersion = z.infer<typeof insertAssetVersionSchema>;
export type AssetVersion = typeof assetVersions.$inferSelect;

// Asset Comments (annotations and feedback - Tier 2 feature)
export const assetComments = pgTable("asset_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull(), // FK to assets
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  
  commentText: text("comment_text").notNull(),
  commentType: text("comment_type").default("general"), // "general", "annotation", "approval_request"
  
  // For annotations on specific parts of asset
  annotationPosition: jsonb("annotation_position"), // {x, y, width, height} for image/PDF annotations
  
  // Thread support
  parentCommentId: varchar("parent_comment_id"), // For replies
  
  // Status
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssetCommentSchema = createInsertSchema(assetComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAssetComment = z.infer<typeof insertAssetCommentSchema>;
export type AssetComment = typeof assetComments.$inferSelect;

// Asset Downloads (usage tracking - Tier 2 feature)
export const assetDownloads = pgTable("asset_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull(), // FK to assets
  userId: varchar("user_id").notNull(),
  
  downloadFormat: text("download_format"), // "original", "compressed", "thumbnail", "pdf", "jpg", etc.
  downloadSize: integer("download_size"), // bytes
  
  // Context
  downloadedFrom: text("downloaded_from"), // "asset_management", "campaign_builder", "preview_modal", etc.
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

export const insertAssetDownloadSchema = createInsertSchema(assetDownloads).omit({
  id: true,
  downloadedAt: true,
});

export type InsertAssetDownload = z.infer<typeof insertAssetDownloadSchema>;
export type AssetDownload = typeof assetDownloads.$inferSelect;

// Asset Approvals (workflow states - Tier 2 feature)
export const assetApprovals = pgTable("asset_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull(), // FK to assets
  
  // Workflow state
  status: text("status").notNull().default("draft"), // "draft", "submitted", "in_review", "approved", "rejected", "changes_requested"
  submittedBy: varchar("submitted_by"),
  submittedAt: timestamp("submitted_at"),
  
  // Reviewer info
  assignedReviewer: varchar("assigned_reviewer"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  
  // Approval details
  approvalNotes: text("approval_notes"),
  rejectionReason: text("rejection_reason"),
  requestedChanges: text("requested_changes"),
  
  // Workflow metadata
  workflowStep: integer("workflow_step").default(1), // Multi-step approval support
  requiredApprovals: integer("required_approvals").default(1),
  currentApprovals: integer("current_approvals").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssetApprovalSchema = createInsertSchema(assetApprovals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAssetApproval = z.infer<typeof insertAssetApprovalSchema>;
export type AssetApproval = typeof assetApprovals.$inferSelect;

// Asset Favorites (bookmarks - Available to both Stacked and Fully Stacked)
export const assetFavorites = pgTable("asset_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  assetId: varchar("asset_id").notNull(), // FK to assets
  
  // Optional categorization
  category: text("category"), // "Priority", "Reference", "Inspiration", etc.
  notes: text("notes"), // Personal notes about why favorited
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAssetFavoriteSchema = createInsertSchema(assetFavorites).omit({
  id: true,
  createdAt: true,
});

export type InsertAssetFavorite = z.infer<typeof insertAssetFavoriteSchema>;
export type AssetFavorite = typeof assetFavorites.$inferSelect;

// ========================================
// COLLAB & WORKFLOWS (Flight Deck)
// ========================================

// Workflows - Template workflows (pre-built and custom)
export const workflows = pgTable("workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "budgeting", "business_goals", "operations", "creative"
  type: text("type").notNull(), // "short_term", "recurring", "long_term"
  coachingPrompt: text("coaching_prompt"),
  isTemplate: boolean("is_template").default(true), // true for pre-built, false for custom
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

// Workflow Tasks - Task templates within a workflow
export const workflowTasks = pgTable("workflow_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").notNull(), // FK to workflows
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  estimatedDuration: integer("estimated_duration"), // in days
  dependsOn: text("depends_on").array(), // Array of task IDs this task depends on
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkflowTaskSchema = createInsertSchema(workflowTasks).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkflowTask = z.infer<typeof insertWorkflowTaskSchema>;
export type WorkflowTask = typeof workflowTasks.$inferSelect;

// Project Instances - Active projects using a workflow
export const projectInstances = pgTable("project_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  workflowId: varchar("workflow_id").notNull(), // FK to workflows
  name: text("name").notNull(),
  description: text("description"),
  
  // Links to other entities
  campaignId: varchar("campaign_id"), // Optional link to campaign
  milestoneId: varchar("milestone_id"), // Optional link to milestone
  
  // Schedule
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Status
  status: text("status").notNull().default("active"), // "active", "on_hold", "completed", "cancelled"
  completionPercentage: integer("completion_percentage").default(0),
  
  // Budget tracking
  budget: integer("budget"),
  budgetSpent: integer("budget_spent").default(0),
  
  // Alerts
  alertFrequency: text("alert_frequency").default("milestone"), // "daily", "weekly", "milestone"
  lastAlertSent: timestamp("last_alert_sent"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectInstanceSchema = createInsertSchema(projectInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProjectInstance = z.infer<typeof insertProjectInstanceSchema>;
export type ProjectInstance = typeof projectInstances.$inferSelect;

// Project Tasks - Task instances within an active project
export const projectTasks = pgTable("project_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectInstanceId: varchar("project_instance_id").notNull(), // FK to projectInstances
  workflowTaskId: varchar("workflow_task_id"), // Optional FK to workflowTasks (null for ad-hoc tasks)
  
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  
  // Assignment
  assignee: text("assignee"),
  assigneeId: varchar("assignee_id"),
  
  // Dates
  dueDate: timestamp("due_date"),
  startDate: timestamp("start_date"),
  completedDate: timestamp("completed_date"),
  
  // Status
  status: text("status").notNull().default("pending"), // "pending", "in_progress", "blocked", "completed", "cancelled"
  priority: text("priority").default("medium"), // "low", "medium", "high", "critical"
  
  // Dependencies
  dependsOn: text("depends_on").array(), // Array of project task IDs
  blockedBy: text("blocked_by").array(), // Array of project task IDs blocking this one
  
  // Progress
  progressNotes: text("progress_notes"),
  completionPercentage: integer("completion_percentage").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectTaskSchema = createInsertSchema(projectTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;
export type ProjectTask = typeof projectTasks.$inferSelect;

// Task Comments - Collaboration and feedback on tasks
export const taskComments = pgTable("task_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectTaskId: varchar("project_task_id").notNull(), // FK to projectTasks
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  
  commentText: text("comment_text").notNull(),
  mentions: text("mentions").array(), // Array of @mentioned usernames
  
  // Thread support
  parentCommentId: varchar("parent_comment_id"), // For replies
  
  // Attachments
  attachmentUrl: text("attachment_url"),
  attachmentType: text("attachment_type"), // "image", "document", "link"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaskCommentSchema = createInsertSchema(taskComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTaskComment = z.infer<typeof insertTaskCommentSchema>;
export type TaskComment = typeof taskComments.$inferSelect;

// Task Reactions - Quick visual feedback
export const taskReactions = pgTable("task_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  targetId: varchar("target_id").notNull(), // Can be projectTaskId or taskCommentId
  targetType: text("target_type").notNull(), // "task" or "comment"
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  
  reactionType: text("reaction_type").notNull(), // "✅", "💬", "🕐", "👍", "❓", etc.
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskReactionSchema = createInsertSchema(taskReactions).omit({
  id: true,
  createdAt: true,
});

export type InsertTaskReaction = z.infer<typeof insertTaskReactionSchema>;
export type TaskReaction = typeof taskReactions.$inferSelect;

// ============================================================================
// PERSONALIZATION ENGINE (Flight Deck)
// ============================================================================

// Audiences - Reusable audience segments
export const audiences = pgTable("audiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  name: text("name").notNull(),
  description: text("description"),
  
  // Filters
  industries: text("industries").array(), // ["Technology", "Healthcare"]
  titles: text("titles").array(), // ["CEO", "CMO", "VP Marketing"]
  accountSizes: text("account_sizes").array(), // ["Enterprise", "Mid-Market", "SMB"]
  funnelStages: text("funnel_stages").array(), // ["Awareness", "Consideration", "Decision"]
  
  // Behavioral filters
  engagementLevel: text("engagement_level"), // "high", "medium", "low"
  contentPreferences: text("content_preferences").array(), // ["whitepapers", "webinars", "case studies"]
  
  // Insights (auto-populated from performance data)
  topTopics: text("top_topics").array(),
  painPoints: text("pain_points").array(),
  bestPerformingContent: text("best_performing_content").array(),
  
  // Metadata
  audienceSize: integer("audience_size").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAudienceSchema = createInsertSchema(audiences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdated: true,
});

export type InsertAudience = z.infer<typeof insertAudienceSchema>;
export type Audience = typeof audiences.$inferSelect;

// Content-Audience Pairings - Maps content to audiences
export const contentAudiencePairings = pgTable("content_audience_pairings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  audienceId: varchar("audience_id").notNull(), // FK to audiences
  assetId: varchar("asset_id"), // FK to assets (can be null for external content)
  campaignId: varchar("campaign_id"), // FK to campaigns (optional)
  
  // Content details (for external or non-asset content)
  contentTitle: text("content_title"),
  contentType: text("content_type"), // "whitepaper", "webinar", "case study", "blog", etc.
  contentUrl: text("content_url"),
  
  // Pairing metadata
  journeyStage: text("journey_stage"), // "awareness", "nurture", "conversion"
  relevanceScore: integer("relevance_score"), // 0-100, AI-suggested or manual
  
  // Performance
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  engagementRate: integer("engagement_rate").default(0), // Percentage
  
  // Status
  status: text("status").notNull().default("active"), // "active", "paused", "archived"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContentAudiencePairingSchema = createInsertSchema(contentAudiencePairings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContentAudiencePairing = z.infer<typeof insertContentAudiencePairingSchema>;
export type ContentAudiencePairing = typeof contentAudiencePairings.$inferSelect;

// Personalization Rules - Delivery logic and guardrails
export const personalizationRules = pgTable("personalization_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  name: text("name").notNull(),
  description: text("description"),
  
  // Rule triggers
  triggerType: text("trigger_type").notNull(), // "engagement_drop", "time_based", "intent_signal", "manual"
  triggerCondition: jsonb("trigger_condition"), // { metric: "engagement", threshold: 30, operator: "less_than" }
  
  // Actions
  action: text("action").notNull(), // "swap_content", "change_audience", "increase_frequency", "pause_delivery"
  actionParams: jsonb("action_params"), // Specific parameters for the action
  
  // Scope
  audienceIds: text("audience_ids").array(), // Which audiences this rule applies to
  pairingIds: text("pairing_ids").array(), // Which pairings this rule affects
  
  // Limits and guardrails
  maxVersions: integer("max_versions").default(3), // Max simultaneous content variations
  minEngagementThreshold: integer("min_engagement_threshold").default(20),
  deliveryFrequency: text("delivery_frequency"), // "daily", "weekly", "monthly"
  
  // Status
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1), // Higher number = higher priority
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPersonalizationRuleSchema = createInsertSchema(personalizationRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPersonalizationRule = z.infer<typeof insertPersonalizationRuleSchema>;
export type PersonalizationRule = typeof personalizationRules.$inferSelect;

// Personalization Insights - Performance tracking and recommendations
export const personalizationInsights = pgTable("personalization_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  pairingId: varchar("pairing_id"), // FK to contentAudiencePairings (optional)
  audienceId: varchar("audience_id"), // FK to audiences (optional)
  
  // Time period
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Metrics
  totalViews: integer("total_views").default(0),
  totalClicks: integer("total_clicks").default(0),
  totalConversions: integer("total_conversions").default(0),
  
  // Calculated insights
  engagementLift: integer("engagement_lift").default(0), // Percentage improvement vs baseline
  conversionRate: integer("conversion_rate").default(0),
  topPerformingAssets: text("top_performing_assets").array(),
  underPerformingAssets: text("underperforming_assets").array(),
  
  // Recommendations (AI-generated)
  recommendations: jsonb("recommendations"), // Array of {type, message, action}
  
  // Drop-off analysis
  dropOffPoints: jsonb("drop_off_points"), // Where in the journey people drop off
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPersonalizationInsightSchema = createInsertSchema(personalizationInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertPersonalizationInsight = z.infer<typeof insertPersonalizationInsightSchema>;
export type PersonalizationInsight = typeof personalizationInsights.$inferSelect;

// ============================================================================
// PLAYBOOKS - Behavior-Based Templates for Personalization
// ============================================================================

// Playbook Templates - Master templates (e.g., "Behavior-Based Nurture Playbook")
export const playbookTemplates = pgTable("playbook_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Template metadata
  name: text("name").notNull(), // "Behavior-Based Nurture Playbook"
  description: text("description").notNull(), // Goal and when to use
  category: text("category"), // "nurture", "re-engagement", "conversion", etc.
  icon: text("icon"), // Icon identifier for UI
  
  // Behavior triggers - When this playbook should be recommended
  triggerBehaviors: text("trigger_behaviors").array(), // ["visited_pricing", "opened_3_emails", "webinar_attended"]
  triggerConditions: jsonb("trigger_conditions"), // Complex logic: {type: "all|any", conditions: [...]}
  
  // Template structure
  totalSteps: integer("total_steps").default(5),
  estimatedDuration: text("estimated_duration"), // "15-20 minutes"
  
  // Status
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false), // Featured/recommended template
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaybookTemplateSchema = createInsertSchema(playbookTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlaybookTemplate = z.infer<typeof insertPlaybookTemplateSchema>;
export type PlaybookTemplate = typeof playbookTemplates.$inferSelect;

// Playbook Steps - Individual steps within each template
export const playbookSteps = pgTable("playbook_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull(), // FK to playbookTemplates
  
  stepNumber: integer("step_number").notNull(), // 1, 2, 3, 4, 5
  title: text("title").notNull(), // "Identify Behaviors That Signal Readiness"
  description: text("description"), // Detailed explanation
  icon: text("icon"), // Step icon
  
  // Coaching prompts for this step
  coachingPrompts: text("coaching_prompts").array(), // Array of questions
  
  // Fields/inputs for this step
  fieldType: text("field_type"), // "dropdown", "checkbox", "text", "multi-select"
  fieldOptions: jsonb("field_options"), // Options for dropdowns, checkboxes, etc.
  
  // Example data to help users
  exampleData: jsonb("example_data"),
  
  // Required vs optional
  isRequired: boolean("is_required").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlaybookStepSchema = createInsertSchema(playbookSteps).omit({
  id: true,
  createdAt: true,
});

export type InsertPlaybookStep = z.infer<typeof insertPlaybookStepSchema>;
export type PlaybookStep = typeof playbookSteps.$inferSelect;

// Intent Tiers - The three levels for behavior-based nurture
export const intentTiers = pgTable("intent_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull(), // FK to playbookTemplates
  
  tierName: text("tier_name").notNull(), // "Exploring", "Considering", "Evaluating"
  tierOrder: integer("tier_order").notNull(), // 1, 2, 3
  
  // Behavior examples for this tier
  exampleBehaviors: text("example_behaviors").array(),
  
  // Nurture focus and tone
  nurtureFocus: text("nurture_focus"), // "Build awareness, educate"
  tone: text("tone"), // "Light, helpful"
  
  // Recommended content types
  contentTypes: text("content_types").array(), // ["blog", "guide", "video"]
  
  // Content pairing suggestions
  suggestedContent: jsonb("suggested_content"), // Array of content recommendations
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertIntentTierSchema = createInsertSchema(intentTiers).omit({
  id: true,
  createdAt: true,
});

export type InsertIntentTier = z.infer<typeof insertIntentTierSchema>;
export type IntentTier = typeof intentTiers.$inferSelect;

// Playbook Instances - User's customized version of a template
export const playbookInstances = pgTable("playbook_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  templateId: varchar("template_id").notNull(), // FK to playbookTemplates
  audienceId: varchar("audience_id"), // FK to audiences (if linked to specific audience)
  
  // Instance metadata
  instanceName: text("instance_name").notNull(), // User's custom name
  status: text("status").default("draft"), // "draft", "active", "paused", "completed"
  
  // User's customized responses for each step
  stepResponses: jsonb("step_responses"), // {step1: {behaviors: [...], notes: "..."}, step2: {...}}
  
  // Selected intent tier settings
  selectedTiers: jsonb("selected_tiers"), // User's customized tier settings
  
  // Activation settings
  isActivated: boolean("is_activated").default(false),
  activatedAt: timestamp("activated_at"),
  
  // Performance tracking
  totalTouches: integer("total_touches").default(0),
  totalConversions: integer("total_conversions").default(0),
  activeContacts: integer("active_contacts").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaybookInstanceSchema = createInsertSchema(playbookInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlaybookInstance = z.infer<typeof insertPlaybookInstanceSchema>;
export type PlaybookInstance = typeof playbookInstances.$inferSelect;

// Budget Change Requests - For HITL budget reallocation workflow
export const budgetChangeRequests = pgTable("budget_change_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  
  // Request metadata
  requestedBy: text("requested_by").notNull(),
  requestDate: timestamp("request_date").defaultNow(),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected", "modified"
  
  // Budget changes - array of channel adjustments
  channelAdjustments: jsonb("channel_adjustments").notNull(), // [{channel: "Google Ads", currentBudget: 8000, newBudget: 7500}]
  
  // Funding source
  fundingSource: text("funding_source").notNull(), // "contingency", "reallocation", "increase"
  reallocationDetails: jsonb("reallocation_details"), // [{channel: "Google Ads", amount: 500}, ...]
  contingencyAmount: integer("contingency_amount").default(0),
  increaseAmount: integer("increase_amount").default(0),
  
  // Auto-calculated preview
  netChange: integer("net_change").default(0),
  contingencyUsed: integer("contingency_used").default(0),
  
  // Context and reasoning
  reason: text("reason"), // User-provided notes
  recommendationContext: text("recommendation_context"), // Pre-filled from recommendation
  sourceFeature: text("source_feature"), // "executive-insight", "distribution-paid-ads", "reallocation-center"
  
  // Admin review
  reviewedBy: text("reviewed_by"),
  reviewDate: timestamp("review_date"),
  reviewComments: text("review_comments"),
  reviewAction: text("review_action"), // "approve", "reject", "modify"
  
  // AI recommendation (if applicable)
  aiRecommendation: text("ai_recommendation"), // "approve", "partial", "reject"
  aiConfidence: integer("ai_confidence"), // 0-100
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBudgetChangeRequestSchema = createInsertSchema(budgetChangeRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBudgetChangeRequest = z.infer<typeof insertBudgetChangeRequestSchema>;
export type BudgetChangeRequest = typeof budgetChangeRequests.$inferSelect;
