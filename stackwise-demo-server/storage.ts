/**
 * Storage Layer
 * 
 * NOTE: Migrated from MemStorage to DatabaseStorage (PostgreSQL via Drizzle ORM)
 * - All data now persists across server restarts
 * - Database seeded with initial campaign recipes on first run
 */

import type {
  InsertStrategySnapshot,
  StrategySnapshot,
  InsertInsightsSnapshot,
  InsightsSnapshot,
  InsertCampaignRecipe,
  CampaignRecipe,
  InsertMilestone,
  Milestone,
  InsertProject,
  Project,
  InsertAssistantSuggestion,
  AssistantSuggestion,
  InsertSimulation,
  Simulation,
  InsertTrackingCode,
  TrackingCode,
  InsertPlay,
  Play,
  InsertEvalMatrixItem,
  EvalMatrixItem,
  InsertExecutive,
  Executive,
  InsertBudget,
  Budget,
  InsertBudgetMonthlyAllocation,
  BudgetMonthlyAllocation,
  InsertBudgetChannelAllocation,
  BudgetChannelAllocation,
  InsertBudgetHistory,
  BudgetHistory,
  InsertMonthlySpendUpload,
  MonthlySpendUpload,
  InsertDistributionCard,
  DistributionCard,
  InsertDistributionEval,
  DistributionEval,
  InsertDistributionLaunch,
  DistributionLaunch,
  InsertDistributionAsset,
  DistributionAsset,
  InsertDistributionFlight,
  DistributionFlight,
  InsertHitlApproval,
  HitlApproval,
  Campaign,
  CampaignChannelPlacement,
  CampaignCreative,
  InsertAsset,
  Asset,
  InsertAssetView,
  AssetView,
  InsertSavedView,
  SavedView,
  InsertAssetFavorite,
  AssetFavorite,
  InsertWorkflow,
  Workflow,
  InsertWorkflowTask,
  WorkflowTask,
  InsertProjectInstance,
  ProjectInstance,
  InsertProjectTask,
  ProjectTask,
  InsertTaskComment,
  TaskComment,
  InsertTaskReaction,
  TaskReaction,
  InsertAudience,
  Audience,
  InsertContentAudiencePairing,
  ContentAudiencePairing,
  InsertPersonalizationRule,
  PersonalizationRule,
  InsertPersonalizationInsight,
  PersonalizationInsight,
  PlaybookTemplate,
  PlaybookStep,
  IntentTier,
  PlaybookInstance,
} from "@shared/schema";
import { DatabaseStorage } from "./storage-db";

export interface IStorage {
  // Strategy Snapshots
  createStrategySnapshot(snapshot: InsertStrategySnapshot): Promise<StrategySnapshot>;
  getStrategySnapshot(id: string): Promise<StrategySnapshot | null>;
  getLatestStrategySnapshot(userId: string): Promise<StrategySnapshot | null>;
  getAllStrategySnapshots(userId: string): Promise<StrategySnapshot[]>;
  updateStrategySnapshot(id: string, snapshot: Partial<InsertStrategySnapshot>): Promise<StrategySnapshot>;

  // Insights Snapshots
  createInsightsSnapshot(snapshot: InsertInsightsSnapshot): Promise<InsightsSnapshot>;
  getInsightsSnapshot(id: string): Promise<InsightsSnapshot | null>;
  getInsightsSnapshotsByQuarter(userId: string, quarter: string): Promise<InsightsSnapshot[]>;
  getAllInsightsSnapshots(userId: string): Promise<InsightsSnapshot[]>;

  // Campaign Recipes
  createCampaignRecipe(recipe: InsertCampaignRecipe): Promise<CampaignRecipe>;
  getCampaignRecipe(id: string): Promise<CampaignRecipe | null>;
  getAllCampaignRecipes(): Promise<CampaignRecipe[]>;
  updateCampaignRecipe(id: string, recipe: Partial<InsertCampaignRecipe>): Promise<CampaignRecipe>;
  deleteCampaignRecipe(id: string): Promise<void>;

  // Milestones
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  getMilestone(id: string): Promise<Milestone | null>;
  getMilestonesByUser(userId: string): Promise<Milestone[]>;
  getMilestonesByTimeframe(userId: string, timeframe: string): Promise<Milestone[]>;
  updateMilestone(id: string, milestone: Partial<InsertMilestone>): Promise<Milestone>;
  deleteMilestone(id: string): Promise<void>;

  // Projects
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | null>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  getProjectsByModule(userId: string, module: string): Promise<Project[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Assistant Suggestions
  createAssistantSuggestion(suggestion: InsertAssistantSuggestion): Promise<AssistantSuggestion>;
  getAssistantSuggestion(id: string): Promise<AssistantSuggestion | null>;
  getAssistantSuggestionsByUser(userId: string): Promise<AssistantSuggestion[]>;
  updateAssistantSuggestion(id: string, suggestion: Partial<InsertAssistantSuggestion>): Promise<AssistantSuggestion>;
  deleteAssistantSuggestion(id: string): Promise<void>;

  // Simulations
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulation(id: string): Promise<Simulation | null>;
  getSimulationsByUser(userId: string): Promise<Simulation[]>;
  updateSimulation(id: string, simulation: Partial<InsertSimulation>): Promise<Simulation>;
  deleteSimulation(id: string): Promise<void>;

  // Tracking Codes
  createTrackingCode(trackingCode: InsertTrackingCode): Promise<TrackingCode>;
  getTrackingCode(id: string): Promise<TrackingCode | null>;
  getTrackingCodesByUser(userId: string): Promise<TrackingCode[]>;
  updateTrackingCode(id: string, trackingCode: Partial<InsertTrackingCode>): Promise<TrackingCode>;
  deleteTrackingCode(id: string): Promise<void>;

  // Eval Matrix Items
  createEvalMatrixItem(item: InsertEvalMatrixItem): Promise<EvalMatrixItem>;
  getEvalMatrixItem(id: string): Promise<EvalMatrixItem | null>;
  getEvalMatrixItemsByUser(userId: string): Promise<EvalMatrixItem[]>;
  updateEvalMatrixItem(id: string, item: Partial<InsertEvalMatrixItem>): Promise<EvalMatrixItem>;
  deleteEvalMatrixItem(id: string): Promise<void>;

  // My Plays
  createPlay(play: InsertPlay): Promise<Play>;
  getPlay(id: string): Promise<Play | null>;
  getPlaysByUser(userId: string): Promise<Play[]>;
  getPlaysByStatus(userId: string, status: string): Promise<Play[]>;
  getPlaysByQuarter(userId: string, quarter: string): Promise<Play[]>;
  updatePlay(id: string, play: Partial<InsertPlay>): Promise<Play>;
  deletePlay(id: string): Promise<void>;
  promotePlayToMilestone(playId: string, milestoneData: InsertMilestone): Promise<{play: Play, milestone: Milestone}>;

  // Executives (Brand Craft - Thought Leadership)
  createExecutive(executive: InsertExecutive): Promise<Executive>;
  getExecutive(id: string): Promise<Executive | null>;
  getAllExecutives(userId: string): Promise<Executive[]>;
  updateExecutive(id: string, executive: Partial<InsertExecutive>): Promise<Executive>;
  deleteExecutive(id: string): Promise<void>;

  // Budgets (Strategy Studio & Flight Deck integration)
  createBudget(budget: InsertBudget): Promise<Budget>;
  getBudget(id: string): Promise<Budget | null>;
  getBudgetsByUser(userId: string): Promise<Budget[]>;
  getActiveBudget(userId: string, year: number): Promise<Budget | null>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;

  // Monthly Budget Allocations
  createMonthlyAllocation(allocation: InsertBudgetMonthlyAllocation): Promise<BudgetMonthlyAllocation>;
  getMonthlyAllocation(id: string): Promise<BudgetMonthlyAllocation | null>;
  getMonthlyAllocationsByBudget(budgetId: string): Promise<BudgetMonthlyAllocation[]>;
  getMonthlyAllocationByMonth(budgetId: string, month: string): Promise<BudgetMonthlyAllocation | null>;
  updateMonthlyAllocation(id: string, allocation: Partial<InsertBudgetMonthlyAllocation>): Promise<BudgetMonthlyAllocation>;
  deleteMonthlyAllocation(id: string): Promise<void>;

  // Channel Budget Allocations
  createChannelAllocation(allocation: InsertBudgetChannelAllocation): Promise<BudgetChannelAllocation>;
  getChannelAllocation(id: string): Promise<BudgetChannelAllocation | null>;
  getChannelAllocationsByMonth(monthlyAllocationId: string): Promise<BudgetChannelAllocation[]>;
  getChannelAllocationByChannel(monthlyAllocationId: string, channel: string): Promise<BudgetChannelAllocation | null>;
  updateChannelAllocation(id: string, allocation: Partial<InsertBudgetChannelAllocation>): Promise<BudgetChannelAllocation>;
  deleteChannelAllocation(id: string): Promise<void>;

  // Budget History / Audit Trail
  createBudgetHistory(history: InsertBudgetHistory): Promise<BudgetHistory>;
  getBudgetHistory(id: string): Promise<BudgetHistory | null>;
  getBudgetHistoryByBudget(budgetId: string): Promise<BudgetHistory[]>;
  getBudgetHistoryByMonth(budgetId: string, month: string): Promise<BudgetHistory[]>;
  getPendingApprovals(budgetId: string): Promise<BudgetHistory[]>;
  updateBudgetHistory(id: string, history: Partial<InsertBudgetHistory>): Promise<BudgetHistory>;

  // Monthly Spend Uploads
  createMonthlySpendUpload(upload: InsertMonthlySpendUpload): Promise<MonthlySpendUpload>;
  getMonthlySpendUpload(id: string): Promise<MonthlySpendUpload | null>;
  getMonthlySpendUploadsByBudget(budgetId: string): Promise<MonthlySpendUpload[]>;
  getMonthlySpendUploadByMonth(budgetId: string, month: string): Promise<MonthlySpendUpload | null>;
  updateMonthlySpendUpload(id: string, upload: Partial<InsertMonthlySpendUpload>): Promise<MonthlySpendUpload>;
  deleteMonthlySpendUpload(id: string): Promise<void>;

  // Distribution Cards (Flight Deck - Multi-Channel Distribution)
  createDistributionCard(card: InsertDistributionCard): Promise<DistributionCard>;
  getDistributionCard(id: string): Promise<DistributionCard | null>;
  getDistributionCardsByUser(userId: string): Promise<DistributionCard[]>;
  getDistributionCardsByCampaign(sourceCampaignId: string): Promise<DistributionCard[]>;
  getDistributionCardsByStatus(userId: string, launchStatus: string): Promise<DistributionCard[]>;
  updateDistributionCard(id: string, card: Partial<InsertDistributionCard>): Promise<DistributionCard>;
  deleteDistributionCard(id: string): Promise<void>;
  loadCampaignsToDistribution(userId: string, campaignIds: string[]): Promise<DistributionCard[]>;
  loadExecutiveProgramsToDistribution(userId: string, executiveIds: string[]): Promise<DistributionCard[]>;
  
  // Distribution Assets (individual pieces within cards)
  createDistributionAsset(asset: InsertDistributionAsset): Promise<DistributionAsset>;
  getDistributionAsset(id: string): Promise<DistributionAsset | null>;
  getDistributionAssetsByCard(distributionCardId: string): Promise<DistributionAsset[]>;
  updateDistributionAsset(id: string, asset: Partial<InsertDistributionAsset>): Promise<DistributionAsset>;
  deleteDistributionAsset(id: string): Promise<void>;

  // Distribution Evals (eval flags, risks, recommendations)
  createDistributionEval(eval: InsertDistributionEval): Promise<DistributionEval>;
  getDistributionEval(id: string): Promise<DistributionEval | null>;
  getDistributionEvalsByCard(distributionCardId: string): Promise<DistributionEval[]>;
  getDistributionEvalsByUser(userId: string): Promise<DistributionEval[]>;
  getPendingDistributionEvals(userId: string): Promise<DistributionEval[]>;
  updateDistributionEval(id: string, eval: Partial<InsertDistributionEval>): Promise<DistributionEval>;
  deleteDistributionEval(id: string): Promise<void>;

  // Distribution Launches (launch tracking & calendar integration)
  createDistributionLaunch(launch: InsertDistributionLaunch): Promise<DistributionLaunch>;
  getDistributionLaunch(id: string): Promise<DistributionLaunch | null>;
  getDistributionLaunchesByCard(distributionCardId: string): Promise<DistributionLaunch[]>;
  getDistributionLaunchesByUser(userId: string): Promise<DistributionLaunch[]>;
  getLiveDistributionLaunches(userId: string): Promise<DistributionLaunch[]>;
  updateDistributionLaunch(id: string, launch: Partial<InsertDistributionLaunch>): Promise<DistributionLaunch>;
  deleteDistributionLaunch(id: string): Promise<void>;

  // Distribution Flights (5-step distribution sessions)
  createDistributionFlight(flight: InsertDistributionFlight): Promise<DistributionFlight>;
  getDistributionFlight(id: string): Promise<DistributionFlight | null>;
  getDistributionFlightsByUser(userId: string): Promise<DistributionFlight[]>;
  updateDistributionFlight(id: string, flight: Partial<InsertDistributionFlight>): Promise<DistributionFlight>;
  deleteDistributionFlight(id: string): Promise<void>;

  // HITL Approvals (audit trail for human-in-the-loop actions)
  createHitlApproval(approval: InsertHitlApproval): Promise<HitlApproval>;
  getHitlApproval(id: string): Promise<HitlApproval | null>;
  getHitlApprovalsByFlight(flightId: string): Promise<HitlApproval[]>;
  getHitlApprovalsByCard(cardId: string): Promise<HitlApproval[]>;
  getHitlApprovalsByUser(userId: string): Promise<HitlApproval[]>;

  // Campaigns (BrandCraft integration - read-only for Distribution loading)
  getCampaign(id: string): Promise<Campaign | null>;
  getCampaignsByUser(userId: string): Promise<Campaign[]>;
  getCampaignChannelPlacements(campaignId: string): Promise<CampaignChannelPlacement[]>;
  getCampaignCreative(campaignId: string): Promise<CampaignCreative[]>;

  // Tracking Codes (auto-generated UTM parameters and QR codes)
  createTrackingCode(code: InsertTrackingCode): Promise<TrackingCode>;
  getTrackingCode(id: string): Promise<TrackingCode | null>;
  getTrackingCodesByUser(userId: string): Promise<TrackingCode[]>;
  getTrackingCodesByCard(distributionCardId: string): Promise<TrackingCode[]>;
  getTrackingCodesByAsset(distributionAssetId: string): Promise<TrackingCode[]>;
  getTrackingCodesByCampaign(campaignId: string): Promise<TrackingCode[]>;
  updateTrackingCode(id: string, code: Partial<InsertTrackingCode>): Promise<TrackingCode>;
  deleteTrackingCode(id: string): Promise<void>;
  incrementTrackingCodeScans(code: string): Promise<void>;

  // Asset Management (DAM for Fully Stacked users)
  createAsset(asset: InsertAsset): Promise<Asset>;
  getAsset(id: string): Promise<Asset | null>;
  getAllAssets(userId: string): Promise<Asset[]>;
  getRecentlyViewedAssets(userId: string): Promise<Asset[]>;
  updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | null>;
  deleteAsset(id: string): Promise<boolean>;
  
  // Asset Views (recently viewed tracking)
  recordAssetView(view: InsertAssetView): Promise<AssetView>;
  
  // Saved Views (custom filter combinations)
  createSavedView(view: InsertSavedView): Promise<SavedView>;
  getSavedView(id: string): Promise<SavedView | null>;
  getAllSavedViews(userId: string): Promise<SavedView[]>;
  updateSavedView(id: string, view: Partial<InsertSavedView>): Promise<SavedView | null>;
  deleteSavedView(id: string): Promise<boolean>;
  
  // Asset Favorites (bookmarks)
  createFavorite(favorite: InsertAssetFavorite): Promise<AssetFavorite>;
  getAllFavorites(userId: string): Promise<AssetFavorite[]>;
  deleteFavorite(userId: string, assetId: string): Promise<boolean>;

  // Collab & Workflows
  getWorkflows(category?: string, type?: string): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<Workflow | null>;
  getWorkflowTasks(workflowId: string): Promise<WorkflowTask[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;

  // Project Instances
  getProjectInstances(userId: string, status?: string): Promise<ProjectInstance[]>;
  getProjectInstance(id: string): Promise<ProjectInstance | null>;
  createProjectInstance(instance: InsertProjectInstance): Promise<ProjectInstance>;
  updateProjectInstance(id: string, instance: Partial<InsertProjectInstance>): Promise<ProjectInstance | null>;

  // Project Tasks
  getProjectTasks(projectInstanceId: string): Promise<ProjectTask[]>;
  getProjectTask(id: string): Promise<ProjectTask | null>;
  createProjectTask(task: InsertProjectTask): Promise<ProjectTask>;
  updateProjectTask(id: string, task: Partial<InsertProjectTask>): Promise<ProjectTask | null>;
  deleteProjectTask(id: string): Promise<boolean>;

  // Task Comments
  getTaskComments(projectTaskId: string): Promise<TaskComment[]>;
  createTaskComment(comment: InsertTaskComment): Promise<TaskComment>;
  deleteTaskComment(id: string): Promise<boolean>;

  // Task Reactions
  getTaskReactions(targetId: string, targetType: "task" | "comment"): Promise<TaskReaction[]>;
  createTaskReaction(reaction: InsertTaskReaction): Promise<TaskReaction>;
  deleteTaskReaction(id: string): Promise<boolean>;

  // Personalization Engine - Audiences
  getAudiences(): Promise<Audience[]>;
  getAudience(id: string): Promise<Audience | null>;
  createAudience(audience: InsertAudience): Promise<Audience>;
  updateAudience(id: string, audience: Partial<InsertAudience>): Promise<Audience>;

  // Personalization Engine - Content Pairings
  getContentPairingsByAudience(audienceId: string): Promise<ContentAudiencePairing[]>;
  createContentPairing(pairing: InsertContentAudiencePairing): Promise<ContentAudiencePairing>;
  updateContentPairing(id: string, pairing: Partial<InsertContentAudiencePairing>): Promise<ContentAudiencePairing>;

  // Personalization Engine - Rules
  getPersonalizationRules(): Promise<PersonalizationRule[]>;
  createPersonalizationRule(rule: InsertPersonalizationRule): Promise<PersonalizationRule>;

  // Personalization Engine - Insights
  getPersonalizationInsights(audienceId: string): Promise<PersonalizationInsight[]>;

  // Playbooks
  getPlaybookTemplates(): Promise<PlaybookTemplate[]>;
  getPlaybookTemplate(id: string): Promise<PlaybookTemplate | null>;
  getIntentTiers(): Promise<IntentTier[]>;
  getIntentTiersByTemplate(templateId: string): Promise<IntentTier[]>;
  getPlaybookSteps(templateId: string): Promise<PlaybookStep[]>;
}

export class MemStorage implements IStorage {
  private strategySnapshots: Map<string, StrategySnapshot> = new Map();
  private insightsSnapshots: Map<string, InsightsSnapshot> = new Map();
  private campaignRecipes: Map<string, CampaignRecipe> = new Map();
  private milestones: Map<string, Milestone> = new Map();
  private projects: Map<string, Project> = new Map();
  private assistantSuggestions: Map<string, AssistantSuggestion> = new Map();
  private simulations: Map<string, Simulation> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some campaign recipes
    const recipes: CampaignRecipe[] = [
      {
        id: "recipe-1",
        name: "Executive POV Sprint",
        description: "Build thought leadership content from executive perspectives",
        category: "Awareness",
        status: "in_library",
        lastRun: null,
        performanceTag: null,
        outcomes: null,
        kpiDefaults: null,
      },
      {
        id: "recipe-2",
        name: "Optimization Sprint",
        description: "Improve consistency and performance of existing content",
        category: "Efficiency",
        status: "in_library",
        lastRun: null,
        performanceTag: null,
        outcomes: null,
        kpiDefaults: null,
      },
      {
        id: "recipe-3",
        name: "Advocacy Loop",
        description: "Turn customers into advocates and referral sources",
        category: "Retention",
        status: "in_library",
        lastRun: null,
        performanceTag: null,
        outcomes: null,
        kpiDefaults: null,
      },
      {
        id: "recipe-4",
        name: "Pipeline Revival",
        description: "Re-engage stale opportunities with targeted campaigns",
        category: "Conversion",
        status: "in_library",
        lastRun: null,
        performanceTag: null,
        outcomes: null,
        kpiDefaults: null,
      },
      {
        id: "recipe-5",
        name: "Launch Loop",
        description: "Coordinated multi-channel product/feature launches",
        category: "Awareness",
        status: "in_library",
        lastRun: null,
        performanceTag: null,
        outcomes: null,
        kpiDefaults: null,
      },
    ];

    recipes.forEach((recipe) => {
      this.campaignRecipes.set(recipe.id, recipe);
    });
  }

  // Strategy Snapshots
  async createStrategySnapshot(snapshot: InsertStrategySnapshot): Promise<StrategySnapshot> {
    const id = `snapshot-${Date.now()}`;
    const newSnapshot: StrategySnapshot = {
      ...snapshot,
      id,
      timestamp: new Date(),
      budget: snapshot.budget ?? null,
      quarterStartDate: snapshot.quarterStartDate ?? null,
      quarterEndDate: snapshot.quarterEndDate ?? null,
    };
    this.strategySnapshots.set(id, newSnapshot);
    return newSnapshot;
  }

  async getStrategySnapshot(id: string): Promise<StrategySnapshot | null> {
    return this.strategySnapshots.get(id) || null;
  }

  async getLatestStrategySnapshot(userId: string): Promise<StrategySnapshot | null> {
    const snapshots = Array.from(this.strategySnapshots.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime());
    return snapshots[0] || null;
  }

  async getAllStrategySnapshots(userId: string): Promise<StrategySnapshot[]> {
    return Array.from(this.strategySnapshots.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime());
  }

  async updateStrategySnapshot(id: string, snapshot: Partial<InsertStrategySnapshot>): Promise<StrategySnapshot> {
    const existing = this.strategySnapshots.get(id);
    if (!existing) {
      throw new Error("Strategy snapshot not found");
    }
    const updated = { ...existing, ...snapshot };
    this.strategySnapshots.set(id, updated);
    return updated;
  }

  // Insights Snapshots
  async createInsightsSnapshot(snapshot: InsertInsightsSnapshot): Promise<InsightsSnapshot> {
    const id = `insight-${Date.now()}`;
    const newSnapshot: InsightsSnapshot = {
      ...snapshot,
      id,
      timestamp: new Date(),
    };
    this.insightsSnapshots.set(id, newSnapshot);
    return newSnapshot;
  }

  async getInsightsSnapshot(id: string): Promise<InsightsSnapshot | null> {
    return this.insightsSnapshots.get(id) || null;
  }

  async getInsightsSnapshotsByQuarter(userId: string, quarter: string): Promise<InsightsSnapshot[]> {
    return Array.from(this.insightsSnapshots.values())
      .filter((s) => s.userId === userId && s.quarter === quarter);
  }

  async getAllInsightsSnapshots(userId: string): Promise<InsightsSnapshot[]> {
    return Array.from(this.insightsSnapshots.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime());
  }

  // Campaign Recipes
  async createCampaignRecipe(recipe: InsertCampaignRecipe): Promise<CampaignRecipe> {
    const id = `recipe-${Date.now()}`;
    const newRecipe: CampaignRecipe = { ...recipe, id };
    this.campaignRecipes.set(id, newRecipe);
    return newRecipe;
  }

  async getCampaignRecipe(id: string): Promise<CampaignRecipe | null> {
    return this.campaignRecipes.get(id) || null;
  }

  async getAllCampaignRecipes(): Promise<CampaignRecipe[]> {
    return Array.from(this.campaignRecipes.values());
  }

  async updateCampaignRecipe(id: string, recipe: Partial<InsertCampaignRecipe>): Promise<CampaignRecipe> {
    const existing = this.campaignRecipes.get(id);
    if (!existing) {
      throw new Error("Campaign recipe not found");
    }
    const updated = { ...existing, ...recipe };
    this.campaignRecipes.set(id, updated);
    return updated;
  }

  async deleteCampaignRecipe(id: string): Promise<void> {
    this.campaignRecipes.delete(id);
  }

  // Milestones
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const id = `milestone-${Date.now()}`;
    const newMilestone: Milestone = {
      ...milestone,
      id,
      createdAt: new Date(),
    };
    this.milestones.set(id, newMilestone);
    return newMilestone;
  }

  async getMilestone(id: string): Promise<Milestone | null> {
    return this.milestones.get(id) || null;
  }

  async getMilestonesByUser(userId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values())
      .filter((m) => m.userId === userId)
      .sort((a, b) => a.order - b.order);
  }

  async getMilestonesByTimeframe(userId: string, timeframe: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values())
      .filter((m) => m.userId === userId && m.timeframe === timeframe)
      .sort((a, b) => a.order - b.order);
  }

  async updateMilestone(id: string, milestone: Partial<InsertMilestone>): Promise<Milestone> {
    const existing = this.milestones.get(id);
    if (!existing) {
      throw new Error("Milestone not found");
    }
    const updated = { ...existing, ...milestone };
    this.milestones.set(id, updated);
    return updated;
  }

  async deleteMilestone(id: string): Promise<void> {
    this.milestones.delete(id);
  }

  // Projects
  async createProject(project: InsertProject): Promise<Project> {
    const id = `project-${Date.now()}`;
    const newProject: Project = {
      ...project,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getProjectsByModule(userId: string, module: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter((p) => p.userId === userId && p.module === module)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error("Project not found");
    }
    const updated = { ...existing, ...project, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // Assistant Suggestions
  async createAssistantSuggestion(suggestion: InsertAssistantSuggestion): Promise<AssistantSuggestion> {
    const id = `suggestion-${Date.now()}`;
    const newSuggestion: AssistantSuggestion = {
      ...suggestion,
      id,
      createdAt: new Date(),
    };
    this.assistantSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }

  async getAssistantSuggestion(id: string): Promise<AssistantSuggestion | null> {
    return this.assistantSuggestions.get(id) || null;
  }

  async getAssistantSuggestionsByUser(userId: string): Promise<AssistantSuggestion[]> {
    return Array.from(this.assistantSuggestions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateAssistantSuggestion(id: string, suggestion: Partial<InsertAssistantSuggestion>): Promise<AssistantSuggestion> {
    const existing = this.assistantSuggestions.get(id);
    if (!existing) {
      throw new Error("Assistant suggestion not found");
    }
    const updated = { ...existing, ...suggestion };
    this.assistantSuggestions.set(id, updated);
    return updated;
  }

  async deleteAssistantSuggestion(id: string): Promise<void> {
    this.assistantSuggestions.delete(id);
  }

  // Simulations
  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const id = `simulation-${Date.now()}`;
    const newSimulation: Simulation = {
      ...simulation,
      id,
      createdAt: new Date(),
    };
    this.simulations.set(id, newSimulation);
    return newSimulation;
  }

  async getSimulation(id: string): Promise<Simulation | null> {
    return this.simulations.get(id) || null;
  }

  async getSimulationsByUser(userId: string): Promise<Simulation[]> {
    return Array.from(this.simulations.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateSimulation(id: string, simulation: Partial<InsertSimulation>): Promise<Simulation> {
    const existing = this.simulations.get(id);
    if (!existing) {
      throw new Error("Simulation not found");
    }
    const updated = { ...existing, ...simulation };
    this.simulations.set(id, updated);
    return updated;
  }

  async deleteSimulation(id: string): Promise<void> {
    this.simulations.delete(id);
  }
}

// Use DatabaseStorage for persistent data across restarts
export const storage = new DatabaseStorage();
