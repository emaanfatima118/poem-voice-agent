import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  strategySnapshots,
  insightsSnapshots,
  campaignRecipes,
  milestones,
  projects,
  assistantSuggestions,
  simulations,
  trackingCodes,
  plays,
  evalMatrixItems,
  executives,
  executiveContent,
  type InsertStrategySnapshot,
  type StrategySnapshot,
  type InsertInsightsSnapshot,
  type InsightsSnapshot,
  type InsertCampaignRecipe,
  type CampaignRecipe,
  type InsertMilestone,
  type Milestone,
  type InsertProject,
  type Project,
  type InsertAssistantSuggestion,
  type AssistantSuggestion,
  type InsertSimulation,
  type Simulation,
  type InsertTrackingCode,
  type TrackingCode,
  type InsertPlay,
  type Play,
  type InsertEvalMatrixItem,
  type EvalMatrixItem,
  type InsertExecutive,
  type Executive,
  type ExecutiveContent,
  distributionCards,
  distributionEvals,
  distributionLaunches,
  distributionAssets,
  distributionFlights,
  hitlApprovals,
  campaigns,
  campaignChannelPlacements,
  campaignCreative,
  type InsertDistributionCard,
  type DistributionCard,
  type InsertDistributionEval,
  type DistributionEval,
  type InsertDistributionLaunch,
  type DistributionLaunch,
  type InsertDistributionAsset,
  type DistributionAsset,
  type InsertDistributionFlight,
  type DistributionFlight,
  type InsertHitlApproval,
  type HitlApproval,
  type Campaign,
  type CampaignChannelPlacement,
  type CampaignCreative,
  assets,
  assetViews,
  savedViews,
  assetFavorites,
  type InsertAsset,
  type Asset,
  type InsertAssetView,
  type AssetView,
  type InsertSavedView,
  type SavedView,
  type InsertAssetFavorite,
  type AssetFavorite,
  modules,
  features,
  reports,
  type InsertModule,
  type Module,
  type InsertFeature,
  type Feature,
  type InsertReport,
  type Report,
  workflows,
  workflowTasks,
  projectInstances,
  projectTasks,
  taskComments,
  taskReactions,
  type InsertWorkflow,
  type Workflow,
  type InsertWorkflowTask,
  type WorkflowTask,
  type InsertProjectInstance,
  type ProjectInstance,
  type InsertProjectTask,
  type ProjectTask,
  type InsertTaskComment,
  type TaskComment,
  type InsertTaskReaction,
  type TaskReaction,
  audiences,
  contentAudiencePairings,
  personalizationRules,
  personalizationInsights,
  type InsertAudience,
  type Audience,
  type InsertContentAudiencePairing,
  type ContentAudiencePairing,
  type InsertPersonalizationRule,
  type PersonalizationRule,
  type InsertPersonalizationInsight,
  type PersonalizationInsight,
  playbookTemplates,
  playbookSteps,
  intentTiers,
  playbookInstances,
  type PlaybookTemplate,
  type PlaybookStep,
  type IntentTier,
  type PlaybookInstance,
} from "@shared/schema";
import type { IStorage } from "./storage";

/**
 * DatabaseStorage implementation using PostgreSQL via Drizzle ORM
 * NOTE: This replaces MemStorage for persistent data across restarts
 */
export class DatabaseStorage implements IStorage {
  // Strategy Snapshots
  async createStrategySnapshot(snapshot: InsertStrategySnapshot): Promise<StrategySnapshot> {
    const [created] = await db.insert(strategySnapshots).values(snapshot).returning();
    return created;
  }

  async getStrategySnapshot(id: string): Promise<StrategySnapshot | null> {
    const [snapshot] = await db
      .select()
      .from(strategySnapshots)
      .where(eq(strategySnapshots.id, id));
    return snapshot || null;
  }

  async getLatestStrategySnapshot(userId: string): Promise<StrategySnapshot | null> {
    const [snapshot] = await db
      .select()
      .from(strategySnapshots)
      .where(eq(strategySnapshots.userId, userId))
      .orderBy(desc(strategySnapshots.timestamp))
      .limit(1);
    return snapshot || null;
  }

  async getAllStrategySnapshots(userId: string): Promise<StrategySnapshot[]> {
    return db
      .select()
      .from(strategySnapshots)
      .where(eq(strategySnapshots.userId, userId))
      .orderBy(desc(strategySnapshots.timestamp));
  }

  async updateStrategySnapshot(
    id: string,
    snapshot: Partial<InsertStrategySnapshot>
  ): Promise<StrategySnapshot> {
    const [updated] = await db
      .update(strategySnapshots)
      .set(snapshot)
      .where(eq(strategySnapshots.id, id))
      .returning();
    return updated;
  }

  // Insights Snapshots
  async createInsightsSnapshot(snapshot: InsertInsightsSnapshot): Promise<InsightsSnapshot> {
    const [created] = await db.insert(insightsSnapshots).values(snapshot).returning();
    return created;
  }

  async getInsightsSnapshot(id: string): Promise<InsightsSnapshot | null> {
    const [snapshot] = await db
      .select()
      .from(insightsSnapshots)
      .where(eq(insightsSnapshots.id, id));
    return snapshot || null;
  }

  async getInsightsSnapshotsByQuarter(userId: string, quarter: string): Promise<InsightsSnapshot[]> {
    return db
      .select()
      .from(insightsSnapshots)
      .where(
        and(
          eq(insightsSnapshots.userId, userId),
          eq(insightsSnapshots.quarter, quarter)
        )
      )
      .orderBy(desc(insightsSnapshots.timestamp));
  }

  async getAllInsightsSnapshots(userId: string): Promise<InsightsSnapshot[]> {
    return db
      .select()
      .from(insightsSnapshots)
      .where(eq(insightsSnapshots.userId, userId))
      .orderBy(desc(insightsSnapshots.timestamp));
  }

  // Campaign Recipes
  async createCampaignRecipe(recipe: InsertCampaignRecipe): Promise<CampaignRecipe> {
    const [created] = await db.insert(campaignRecipes).values(recipe).returning();
    return created;
  }

  async getCampaignRecipe(id: string): Promise<CampaignRecipe | null> {
    const [recipe] = await db
      .select()
      .from(campaignRecipes)
      .where(eq(campaignRecipes.id, id));
    return recipe || null;
  }

  async getAllCampaignRecipes(): Promise<CampaignRecipe[]> {
    return db.select().from(campaignRecipes);
  }

  async updateCampaignRecipe(
    id: string,
    recipe: Partial<InsertCampaignRecipe>
  ): Promise<CampaignRecipe> {
    const [updated] = await db
      .update(campaignRecipes)
      .set(recipe)
      .where(eq(campaignRecipes.id, id))
      .returning();
    return updated;
  }

  async deleteCampaignRecipe(id: string): Promise<void> {
    await db.delete(campaignRecipes).where(eq(campaignRecipes.id, id));
  }

  // Milestones
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const [created] = await db.insert(milestones).values(milestone).returning();
    return created;
  }

  async getMilestone(id: string): Promise<Milestone | null> {
    const [milestone] = await db
      .select()
      .from(milestones)
      .where(eq(milestones.id, id));
    return milestone || null;
  }

  async getMilestonesByUser(userId: string): Promise<Milestone[]> {
    return db
      .select()
      .from(milestones)
      .where(eq(milestones.userId, userId))
      .orderBy(milestones.order);
  }

  async getMilestonesByTimeframe(userId: string, timeframe: string): Promise<Milestone[]> {
    return db
      .select()
      .from(milestones)
      .where(
        and(
          eq(milestones.userId, userId),
          eq(milestones.timeframe, timeframe)
        )
      )
      .orderBy(milestones.order);
  }

  async updateMilestone(
    id: string,
    milestone: Partial<InsertMilestone>
  ): Promise<Milestone> {
    const [updated] = await db
      .update(milestones)
      .set(milestone)
      .where(eq(milestones.id, id))
      .returning();
    return updated;
  }

  async deleteMilestone(id: string): Promise<void> {
    await db.delete(milestones).where(eq(milestones.id, id));
  }

  // Projects
  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async getProject(id: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project || null;
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectsByModule(userId: string, module: string): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.userId, userId),
          eq(projects.module, module)
        )
      )
      .orderBy(desc(projects.createdAt));
  }

  async updateProject(
    id: string,
    project: Partial<InsertProject>
  ): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Assistant Suggestions
  async createAssistantSuggestion(suggestion: InsertAssistantSuggestion): Promise<AssistantSuggestion> {
    const [created] = await db.insert(assistantSuggestions).values(suggestion).returning();
    return created;
  }

  async getAssistantSuggestion(id: string): Promise<AssistantSuggestion | null> {
    const [suggestion] = await db
      .select()
      .from(assistantSuggestions)
      .where(eq(assistantSuggestions.id, id));
    return suggestion || null;
  }

  async getAssistantSuggestionsByUser(userId: string): Promise<AssistantSuggestion[]> {
    return db
      .select()
      .from(assistantSuggestions)
      .where(eq(assistantSuggestions.userId, userId))
      .orderBy(desc(assistantSuggestions.createdAt));
  }

  async updateAssistantSuggestion(
    id: string,
    suggestion: Partial<InsertAssistantSuggestion>
  ): Promise<AssistantSuggestion> {
    const [updated] = await db
      .update(assistantSuggestions)
      .set(suggestion)
      .where(eq(assistantSuggestions.id, id))
      .returning();
    return updated;
  }

  async deleteAssistantSuggestion(id: string): Promise<void> {
    await db.delete(assistantSuggestions).where(eq(assistantSuggestions.id, id));
  }

  // Simulations
  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const [created] = await db.insert(simulations).values(simulation).returning();
    return created;
  }

  async getSimulation(id: string): Promise<Simulation | null> {
    const [simulation] = await db
      .select()
      .from(simulations)
      .where(eq(simulations.id, id));
    return simulation || null;
  }

  async getSimulationsByUser(userId: string): Promise<Simulation[]> {
    return db
      .select()
      .from(simulations)
      .where(eq(simulations.userId, userId))
      .orderBy(desc(simulations.createdAt));
  }

  async updateSimulation(
    id: string,
    simulation: Partial<InsertSimulation>
  ): Promise<Simulation> {
    const [updated] = await db
      .update(simulations)
      .set(simulation)
      .where(eq(simulations.id, id))
      .returning();
    return updated;
  }

  async deleteSimulation(id: string): Promise<void> {
    await db.delete(simulations).where(eq(simulations.id, id));
  }

  // Eval Matrix Items
  async createEvalMatrixItem(item: InsertEvalMatrixItem): Promise<EvalMatrixItem> {
    const [created] = await db.insert(evalMatrixItems).values(item).returning();
    return created;
  }

  async getEvalMatrixItem(id: string): Promise<EvalMatrixItem | null> {
    const [item] = await db
      .select()
      .from(evalMatrixItems)
      .where(eq(evalMatrixItems.id, id));
    return item || null;
  }

  async getEvalMatrixItemsByUser(userId: string): Promise<EvalMatrixItem[]> {
    return db
      .select()
      .from(evalMatrixItems)
      .where(eq(evalMatrixItems.userId, userId))
      .orderBy(desc(evalMatrixItems.createdAt));
  }

  async updateEvalMatrixItem(
    id: string,
    item: Partial<InsertEvalMatrixItem>
  ): Promise<EvalMatrixItem> {
    const [updated] = await db
      .update(evalMatrixItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(evalMatrixItems.id, id))
      .returning();
    return updated;
  }

  async deleteEvalMatrixItem(id: string): Promise<void> {
    await db.delete(evalMatrixItems).where(eq(evalMatrixItems.id, id));
  }

  // My Plays
  async createPlay(play: InsertPlay): Promise<Play> {
    const [created] = await db.insert(plays).values(play).returning();
    return created;
  }

  async getPlay(id: string): Promise<Play | null> {
    const [play] = await db
      .select()
      .from(plays)
      .where(eq(plays.id, id));
    return play || null;
  }

  async getPlaysByUser(userId: string): Promise<Play[]> {
    return db
      .select()
      .from(plays)
      .where(eq(plays.userId, userId))
      .orderBy(desc(plays.createdAt));
  }

  async getPlaysByStatus(userId: string, status: string): Promise<Play[]> {
    return db
      .select()
      .from(plays)
      .where(
        and(
          eq(plays.userId, userId),
          eq(plays.status, status)
        )
      )
      .orderBy(desc(plays.createdAt));
  }

  async getPlaysByQuarter(userId: string, quarter: string): Promise<Play[]> {
    return db
      .select()
      .from(plays)
      .where(
        and(
          eq(plays.userId, userId),
          eq(plays.quarterTarget, quarter)
        )
      )
      .orderBy(desc(plays.createdAt));
  }

  async updatePlay(id: string, play: Partial<InsertPlay>): Promise<Play> {
    const [updated] = await db
      .update(plays)
      .set({ ...play, updatedAt: new Date() })
      .where(eq(plays.id, id))
      .returning();
    return updated;
  }

  async deletePlay(id: string): Promise<void> {
    await db.delete(plays).where(eq(plays.id, id));
  }

  async promotePlayToMilestone(playId: string, milestoneData: InsertMilestone): Promise<{play: Play, milestone: Milestone}> {
    // Create the milestone
    const milestone = await this.createMilestone(milestoneData);
    
    // Update the play status
    const play = await this.updatePlay(playId, {
      status: "accepted",
      completedAt: new Date(),
    });
    
    return { play, milestone };
  }

  // Executives (Brand Craft - Thought Leadership)
  async createExecutive(executive: InsertExecutive): Promise<Executive> {
    const [created] = await db.insert(executives).values(executive).returning();
    return created;
  }

  async getExecutive(id: string): Promise<Executive | null> {
    const [executive] = await db
      .select()
      .from(executives)
      .where(eq(executives.id, id))
      .limit(1);
    return executive || null;
  }

  async getAllExecutives(userId: string): Promise<Executive[]> {
    return db
      .select()
      .from(executives)
      .where(eq(executives.userId, userId))
      .orderBy(desc(executives.createdAt));
  }

  async updateExecutive(id: string, executive: Partial<InsertExecutive>): Promise<Executive> {
    const [updated] = await db
      .update(executives)
      .set({ ...executive, updatedAt: new Date() })
      .where(eq(executives.id, id))
      .returning();
    return updated;
  }

  async deleteExecutive(id: string): Promise<void> {
    await db.delete(executives).where(eq(executives.id, id));
  }

  // Distribution Cards (Flight Deck - Multi-Channel Distribution)
  async createDistributionCard(card: InsertDistributionCard): Promise<DistributionCard> {
    const [created] = await db.insert(distributionCards).values(card).returning();
    return created;
  }

  async getDistributionCard(id: string): Promise<DistributionCard | null> {
    const [card] = await db
      .select()
      .from(distributionCards)
      .where(eq(distributionCards.id, id))
      .limit(1);
    return card || null;
  }

  async getDistributionCardsByUser(userId: string): Promise<DistributionCard[]> {
    return db
      .select()
      .from(distributionCards)
      .where(eq(distributionCards.userId, userId))
      .orderBy(desc(distributionCards.createdAt));
  }

  async getDistributionCardsByCampaign(sourceCampaignId: string): Promise<DistributionCard[]> {
    return db
      .select()
      .from(distributionCards)
      .where(eq(distributionCards.sourceCampaignId, sourceCampaignId))
      .orderBy(desc(distributionCards.createdAt));
  }

  async getDistributionCardsByStatus(userId: string, launchStatus: string): Promise<DistributionCard[]> {
    return db
      .select()
      .from(distributionCards)
      .where(
        and(
          eq(distributionCards.userId, userId),
          eq(distributionCards.launchStatus, launchStatus)
        )
      )
      .orderBy(desc(distributionCards.createdAt));
  }

  async updateDistributionCard(id: string, card: Partial<InsertDistributionCard>): Promise<DistributionCard> {
    const [updated] = await db
      .update(distributionCards)
      .set({ ...card, updatedAt: new Date() })
      .where(eq(distributionCards.id, id))
      .returning();
    return updated;
  }

  async deleteDistributionCard(id: string): Promise<void> {
    await db.delete(distributionCards).where(eq(distributionCards.id, id));
  }

  async loadCampaignsToDistribution(userId: string, campaignIds: string[]): Promise<DistributionCard[]> {
    const loadedCards: DistributionCard[] = [];
    
    for (const campaignId of campaignIds) {
      // Get campaign details
      const campaign = await this.getCampaign(campaignId);
      if (!campaign) continue;
      
      // Get channel placements for this campaign
      const placements = await this.getCampaignChannelPlacements(campaignId);
      
      // Get creative assets
      const creatives = await this.getCampaignCreative(campaignId);
      
      // Create one distribution card per channel placement
      for (const placement of placements) {
        // Find matching creative for this channel
        const creative = creatives.find(c => c.channelName === placement.channelName);
        
        // Auto-populate default start date (e.g., campaign start date or 7 days from now)
        const defaultStartDate = campaign.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Check for missing fields
        const missingFields: string[] = [];
        if (!campaign.goal) missingFields.push('goal');
        if (!campaign.primaryPersona) missingFields.push('primaryPersona');
        if (!campaign.campaignPillar) missingFields.push('pillar');
        if (!placement.channelName) missingFields.push('channelName');
        
        const card = await this.createDistributionCard({
          userId,
          sourceType: 'campaign',
          sourceCampaignId: campaignId,
          channelPlacementId: placement.id,
          creativeId: creative?.id,
          campaignName: campaign.name,
          channelName: placement.channelName,
          channelType: placement.channelType || undefined,
          contentName: creative?.headline || placement.channelName + ' content',
          contentType: creative?.creativeType || undefined,
          goal: campaign.goal || undefined,
          primaryPersona: campaign.primaryPersona || undefined,
          funnelStage: undefined, // Could be derived from campaign stage
          pillar: campaign.campaignPillar || undefined,
          startDate: campaign.startDate || undefined,
          endDate: campaign.endDate || undefined,
          defaultStartDate,
          headline: creative?.headline || undefined,
          bodyContent: creative?.bodyContent || undefined,
          ctaText: creative?.ctaLink ? 'Learn More' : undefined,
          ctaLink: creative?.ctaLink || undefined,
          assetLinks: creative?.assetLink ? [creative.assetLink] : [],
          assetCount: placement.assetCount || 0,
          estimatedSpend: parseInt(placement.spend || '0'),
          allocatedBudget: parseInt(campaign.estimatedBudget || '0'),
          missingFields: missingFields.length > 0 ? missingFields : undefined,
          evalStatus: 'pending',
          budgetStatus: 'pending',
          assetStatus: placement.assetCount > 0 ? 'ready' : 'pending',
          voiceCheckStatus: undefined,
          launchStatus: 'not_launched',
          notes: undefined,
        });
        
        // Create distribution assets for this placement
        const assetCount = placement.assetCount ?? 1;
        const spendPerAsset = Math.floor((parseInt(placement.spend || '0')) / Math.max(1, assetCount));
        
        for (let i = 0; i < assetCount; i++) {
          await this.createDistributionAsset({
            userId,
            distributionCardId: card.id,
            assetName: assetCount > 1 
              ? `${creative?.headline || campaign.name || 'Asset'} #${i + 1}`
              : (creative?.headline || campaign.name || 'Asset'),
            assetNumber: i + 1,
            launchDate: defaultStartDate,
            endDate: campaign.endDate || null,
            estimatedSpend: spendPerAsset,
          });
        }
        
        loadedCards.push(card);
      }
    }
    
    return loadedCards;
  }

  async loadExecutiveProgramsToDistribution(userId: string, executiveIds: string[]): Promise<DistributionCard[]> {
    const loadedCards: DistributionCard[] = [];
    
    for (const executiveId of executiveIds) {
      const executive = await this.getExecutive(executiveId);
      if (!executive) continue;
      
      // Get all executiveContent posts for this executive
      const execPosts = await db
        .select()
        .from(executiveContent)
        .where(
          and(
            eq(executiveContent.executiveId, executiveId),
            eq(executiveContent.userId, userId)
          )
        )
        .orderBy(executiveContent.pieceNumber);
      
      // If no posts exist, create a placeholder card
      if (execPosts.length === 0) {
        const card = await this.createDistributionCard({
          userId,
          sourceType: 'exec_vis',
          sourceExecutiveId: executiveId,
          campaignName: `${executive.name} - Thought Leadership`,
          channelName: 'LinkedIn',
          contentName: `${executive.name} Executive Content (No posts yet)`,
          goal: 'Awareness',
          primaryPersona: executive.audience || 'Executives',
          defaultStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          evalStatus: 'pending',
          budgetStatus: 'pending',
          assetStatus: 'pending',
          launchStatus: 'not_launched',
        });
        loadedCards.push(card);
        continue;
      }
      
      // Create a distribution card for EACH individual post
      for (const post of execPosts) {
        const programPrefix = post.programTitle ? `${post.programTitle} - ` : '';
        const defaultStartDate = post.launchDate 
          ? new Date(post.launchDate).toISOString().split('T')[0]
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDateStr = post.endDate 
          ? new Date(post.endDate).toISOString().split('T')[0]
          : undefined;
        
        const card = await this.createDistributionCard({
          userId,
          sourceType: 'exec_vis',
          sourceExecutiveId: executiveId,
          sourceExecutiveContentId: post.id,
          campaignName: post.programTitle || `${executive.name} - Thought Leadership`,
          channelName: post.channel || 'LinkedIn',
          contentType: post.contentType || 'LinkedIn Post',
          contentName: post.pieceTitle,
          goal: 'Awareness',
          primaryPersona: executive.audience || 'Executives',
          headline: post.headline || undefined,
          bodyContent: post.bodyContent || undefined,
          defaultStartDate,
          startDate: defaultStartDate,
          endDate: endDateStr,
          assetCount: 1,
          evalStatus: 'pending',
          budgetStatus: 'pending',
          assetStatus: post.status === 'approved' ? 'ready' : 'pending',
          launchStatus: 'not_launched',
          notes: post.notes || undefined,
        });
        
        // Create the corresponding distribution asset for this post
        await this.createDistributionAsset({
          userId,
          distributionCardId: card.id,
          assetName: post.pieceTitle,
          assetNumber: 1,
          launchDate: defaultStartDate,
          endDate: endDateStr || null,
          estimatedSpend: 0,
        });
        
        loadedCards.push(card);
      }
    }
    
    return loadedCards;
  }

  // Distribution Evals
  async createDistributionEval(evalData: InsertDistributionEval): Promise<DistributionEval> {
    const [created] = await db.insert(distributionEvals).values(evalData).returning();
    return created;
  }

  async getDistributionEval(id: string): Promise<DistributionEval | null> {
    const [evalItem] = await db
      .select()
      .from(distributionEvals)
      .where(eq(distributionEvals.id, id))
      .limit(1);
    return evalItem || null;
  }

  async getDistributionEvalsByCard(distributionCardId: string): Promise<DistributionEval[]> {
    return db
      .select()
      .from(distributionEvals)
      .where(eq(distributionEvals.distributionCardId, distributionCardId))
      .orderBy(desc(distributionEvals.createdAt));
  }

  async getDistributionEvalsByUser(userId: string): Promise<DistributionEval[]> {
    return db
      .select()
      .from(distributionEvals)
      .where(eq(distributionEvals.userId, userId))
      .orderBy(desc(distributionEvals.createdAt));
  }

  async getPendingDistributionEvals(userId: string): Promise<DistributionEval[]> {
    return db
      .select()
      .from(distributionEvals)
      .where(
        and(
          eq(distributionEvals.userId, userId),
          eq(distributionEvals.status, 'pending')
        )
      )
      .orderBy(desc(distributionEvals.createdAt));
  }

  async updateDistributionEval(id: string, evalData: Partial<InsertDistributionEval>): Promise<DistributionEval> {
    const [updated] = await db
      .update(distributionEvals)
      .set(evalData)
      .where(eq(distributionEvals.id, id))
      .returning();
    return updated;
  }

  async deleteDistributionEval(id: string): Promise<void> {
    await db.delete(distributionEvals).where(eq(distributionEvals.id, id));
  }

  // Distribution Launches
  async createDistributionLaunch(launch: InsertDistributionLaunch): Promise<DistributionLaunch> {
    const [created] = await db.insert(distributionLaunches).values(launch).returning();
    return created;
  }

  async getDistributionLaunch(id: string): Promise<DistributionLaunch | null> {
    const [launch] = await db
      .select()
      .from(distributionLaunches)
      .where(eq(distributionLaunches.id, id))
      .limit(1);
    return launch || null;
  }

  async getDistributionLaunchesByCard(distributionCardId: string): Promise<DistributionLaunch[]> {
    return db
      .select()
      .from(distributionLaunches)
      .where(eq(distributionLaunches.distributionCardId, distributionCardId))
      .orderBy(desc(distributionLaunches.createdAt));
  }

  async getDistributionLaunchesByUser(userId: string): Promise<DistributionLaunch[]> {
    return db
      .select()
      .from(distributionLaunches)
      .where(eq(distributionLaunches.userId, userId))
      .orderBy(desc(distributionLaunches.createdAt));
  }

  async getLiveDistributionLaunches(userId: string): Promise<DistributionLaunch[]> {
    return db
      .select()
      .from(distributionLaunches)
      .where(
        and(
          eq(distributionLaunches.userId, userId),
          eq(distributionLaunches.status, 'live')
        )
      )
      .orderBy(desc(distributionLaunches.createdAt));
  }

  async updateDistributionLaunch(id: string, launch: Partial<InsertDistributionLaunch>): Promise<DistributionLaunch> {
    const [updated] = await db
      .update(distributionLaunches)
      .set({ ...launch, updatedAt: new Date() })
      .where(eq(distributionLaunches.id, id))
      .returning();
    return updated;
  }

  async deleteDistributionLaunch(id: string): Promise<void> {
    await db.delete(distributionLaunches).where(eq(distributionLaunches.id, id));
  }

  // Campaigns (BrandCraft integration - read-only)
  async getCampaign(id: string): Promise<Campaign | null> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);
    return campaign || null;
  }

  async getCampaignsByUser(userId: string): Promise<Campaign[]> {
    return db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaignChannelPlacements(campaignId: string): Promise<CampaignChannelPlacement[]> {
    return db
      .select()
      .from(campaignChannelPlacements)
      .where(eq(campaignChannelPlacements.campaignId, campaignId))
      .orderBy(desc(campaignChannelPlacements.createdAt));
  }

  async getCampaignCreative(campaignId: string): Promise<CampaignCreative[]> {
    return db
      .select()
      .from(campaignCreative)
      .where(eq(campaignCreative.campaignId, campaignId))
      .orderBy(desc(campaignCreative.createdAt));
  }

  // Tracking Codes (auto-generated UTM parameters and QR codes)
  async createTrackingCode(code: InsertTrackingCode): Promise<TrackingCode> {
    const [created] = await db.insert(trackingCodes).values(code).returning();
    return created;
  }

  async getTrackingCode(id: string): Promise<TrackingCode | null> {
    const [code] = await db
      .select()
      .from(trackingCodes)
      .where(eq(trackingCodes.id, id))
      .limit(1);
    return code || null;
  }

  async getTrackingCodesByUser(userId: string): Promise<TrackingCode[]> {
    return db
      .select()
      .from(trackingCodes)
      .where(eq(trackingCodes.userId, userId))
      .orderBy(desc(trackingCodes.createdAt));
  }

  async getTrackingCodesByCard(distributionCardId: string): Promise<TrackingCode[]> {
    return db
      .select()
      .from(trackingCodes)
      .where(eq(trackingCodes.distributionCardId, distributionCardId))
      .orderBy(trackingCodes.assetName);
  }

  async getTrackingCodesByAsset(distributionAssetId: string): Promise<TrackingCode[]> {
    return db
      .select()
      .from(trackingCodes)
      .where(eq(trackingCodes.distributionAssetId, distributionAssetId));
  }

  async getTrackingCodesByCampaign(campaignId: string): Promise<TrackingCode[]> {
    return db
      .select()
      .from(trackingCodes)
      .where(eq(trackingCodes.campaignId, campaignId))
      .orderBy(trackingCodes.channelName, trackingCodes.assetName);
  }

  async updateTrackingCode(id: string, code: Partial<InsertTrackingCode>): Promise<TrackingCode> {
    const [updated] = await db
      .update(trackingCodes)
      .set(code)
      .where(eq(trackingCodes.id, id))
      .returning();
    return updated;
  }

  async deleteTrackingCode(id: string): Promise<void> {
    await db.delete(trackingCodes).where(eq(trackingCodes.id, id));
  }

  async incrementTrackingCodeScans(code: string): Promise<void> {
    await db
      .update(trackingCodes)
      .set({ scans: sql`${trackingCodes.scans} + 1` })
      .where(eq(trackingCodes.code, code));
  }

  // Distribution Assets (Individual asset tracking)
  async createDistributionAsset(asset: InsertDistributionAsset): Promise<DistributionAsset> {
    const [created] = await db.insert(distributionAssets).values(asset).returning();
    return created;
  }

  async getDistributionAsset(id: string): Promise<DistributionAsset | null> {
    const [asset] = await db
      .select()
      .from(distributionAssets)
      .where(eq(distributionAssets.id, id))
      .limit(1);
    return asset || null;
  }

  async getDistributionAssetsByCard(distributionCardId: string): Promise<DistributionAsset[]> {
    return db
      .select()
      .from(distributionAssets)
      .where(eq(distributionAssets.distributionCardId, distributionCardId))
      .orderBy(distributionAssets.assetNumber);
  }

  async updateDistributionAsset(id: string, asset: Partial<InsertDistributionAsset>): Promise<DistributionAsset> {
    const [updated] = await db
      .update(distributionAssets)
      .set({ ...asset, updatedAt: new Date() })
      .where(eq(distributionAssets.id, id))
      .returning();
    return updated;
  }

  async deleteDistributionAsset(id: string): Promise<void> {
    await db.delete(distributionAssets).where(eq(distributionAssets.id, id));
  }

  // Distribution Flights (5-step distribution sessions)
  async createDistributionFlight(flight: InsertDistributionFlight): Promise<DistributionFlight> {
    const [created] = await db.insert(distributionFlights).values(flight).returning();
    return created;
  }

  async getDistributionFlight(id: string): Promise<DistributionFlight | null> {
    const [flight] = await db
      .select()
      .from(distributionFlights)
      .where(eq(distributionFlights.id, id))
      .limit(1);
    return flight || null;
  }

  async getDistributionFlightsByUser(userId: string): Promise<DistributionFlight[]> {
    return db
      .select()
      .from(distributionFlights)
      .where(eq(distributionFlights.userId, userId))
      .orderBy(desc(distributionFlights.createdAt));
  }

  async updateDistributionFlight(id: string, flight: Partial<InsertDistributionFlight>): Promise<DistributionFlight> {
    const [updated] = await db
      .update(distributionFlights)
      .set(flight)
      .where(eq(distributionFlights.id, id))
      .returning();
    return updated;
  }

  async deleteDistributionFlight(id: string): Promise<void> {
    await db.delete(distributionFlights).where(eq(distributionFlights.id, id));
  }

  // HITL Approvals (audit trail for all human-in-the-loop actions)
  async createHitlApproval(approval: InsertHitlApproval): Promise<HitlApproval> {
    const [created] = await db.insert(hitlApprovals).values(approval).returning();
    return created;
  }

  async getHitlApproval(id: string): Promise<HitlApproval | null> {
    const [approval] = await db
      .select()
      .from(hitlApprovals)
      .where(eq(hitlApprovals.id, id))
      .limit(1);
    return approval || null;
  }

  async getHitlApprovalsByFlight(flightId: string): Promise<HitlApproval[]> {
    return db
      .select()
      .from(hitlApprovals)
      .where(eq(hitlApprovals.flightId, flightId))
      .orderBy(desc(hitlApprovals.timestamp));
  }

  async getHitlApprovalsByCard(cardId: string): Promise<HitlApproval[]> {
    return db
      .select()
      .from(hitlApprovals)
      .where(eq(hitlApprovals.cardId, cardId))
      .orderBy(desc(hitlApprovals.timestamp));
  }

  async getHitlApprovalsByUser(userId: string): Promise<HitlApproval[]> {
    return db
      .select()
      .from(hitlApprovals)
      .where(eq(hitlApprovals.userId, userId))
      .orderBy(desc(hitlApprovals.timestamp));
  }

  // Asset Management
  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [created] = await db.insert(assets).values(asset).returning();
    return created;
  }

  async getAsset(id: string): Promise<Asset | null> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset || null;
  }

  async getAllAssets(userId: string): Promise<Asset[]> {
    return await db.select().from(assets)
      .where(eq(assets.userId, userId))
      .orderBy(desc(assets.createdAt));
  }

  async getRecentlyViewedAssets(userId: string): Promise<Asset[]> {
    const views = await db.select().from(assetViews)
      .where(eq(assetViews.userId, userId))
      .orderBy(desc(assetViews.viewedAt))
      .limit(10);
    
    if (views.length === 0) return [];
    
    const assetIds = views.map(v => v.assetId);
    const results = await db.select().from(assets)
      .where(sql`${assets.id} = ANY(${assetIds})`);
    
    return results;
  }

  async updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | null> {
    const [updated] = await db
      .update(assets)
      .set({ ...asset, updatedAt: new Date() })
      .where(eq(assets.id, id))
      .returning();
    return updated || null;
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id)).returning();
    return result.length > 0;
  }

  async recordAssetView(view: InsertAssetView): Promise<AssetView> {
    const [created] = await db.insert(assetViews).values(view).returning();
    return created;
  }

  async createSavedView(view: InsertSavedView): Promise<SavedView> {
    const [created] = await db.insert(savedViews).values(view).returning();
    return created;
  }

  async getSavedView(id: string): Promise<SavedView | null> {
    const [view] = await db.select().from(savedViews).where(eq(savedViews.id, id));
    return view || null;
  }

  async getAllSavedViews(userId: string): Promise<SavedView[]> {
    return await db.select().from(savedViews)
      .where(eq(savedViews.userId, userId))
      .orderBy(desc(savedViews.createdAt));
  }

  async updateSavedView(id: string, view: Partial<InsertSavedView>): Promise<SavedView | null> {
    const [updated] = await db
      .update(savedViews)
      .set(view)
      .where(eq(savedViews.id, id))
      .returning();
    return updated || null;
  }

  async deleteSavedView(id: string): Promise<boolean> {
    const result = await db.delete(savedViews).where(eq(savedViews.id, id)).returning();
    return result.length > 0;
  }

  // Asset Favorites (bookmarks)
  async createFavorite(favorite: InsertAssetFavorite): Promise<AssetFavorite> {
    const [created] = await db.insert(assetFavorites).values(favorite).returning();
    return created;
  }

  async getAllFavorites(userId: string): Promise<AssetFavorite[]> {
    return await db.select().from(assetFavorites)
      .where(eq(assetFavorites.userId, userId))
      .orderBy(desc(assetFavorites.createdAt));
  }

  async deleteFavorite(userId: string, assetId: string): Promise<boolean> {
    const result = await db.delete(assetFavorites)
      .where(and(
        eq(assetFavorites.userId, userId),
        eq(assetFavorites.assetId, assetId)
      ))
      .returning();
    return result.length > 0;
  }

  // Modules Management
  async getAllModules(): Promise<Module[]> {
    return await db.select().from(modules).orderBy(modules.displayOrder, modules.name);
  }

  async getModule(id: string): Promise<Module | null> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || null;
  }

  async createModule(module: InsertModule): Promise<Module> {
    const [created] = await db.insert(modules).values(module).returning();
    return created;
  }

  async updateModule(id: string, module: Partial<InsertModule>): Promise<Module | null> {
    const [updated] = await db
      .update(modules)
      .set({ ...module, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return updated || null;
  }

  // Features Management
  async getAllFeatures(): Promise<Feature[]> {
    return await db.select().from(features).orderBy(features.moduleId, features.displayOrder, features.name);
  }

  async getFeaturesByModule(moduleId: string): Promise<Feature[]> {
    return await db.select().from(features)
      .where(eq(features.moduleId, moduleId))
      .orderBy(features.displayOrder, features.name);
  }

  async getFeature(id: string): Promise<Feature | null> {
    const [feature] = await db.select().from(features).where(eq(features.id, id));
    return feature || null;
  }

  async createFeature(feature: InsertFeature): Promise<Feature> {
    const [created] = await db.insert(features).values(feature).returning();
    return created;
  }

  async updateFeature(id: string, feature: Partial<InsertFeature>): Promise<Feature | null> {
    const [updated] = await db
      .update(features)
      .set({ ...feature, updatedAt: new Date() })
      .where(eq(features.id, id))
      .returning();
    return updated || null;
  }

  // Reports Management
  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReportsByModule(moduleId: string): Promise<Report[]> {
    return await db.select().from(reports)
      .where(eq(reports.moduleId, moduleId))
      .orderBy(desc(reports.createdAt));
  }

  async getReportsByFeature(featureId: string): Promise<Report[]> {
    return await db.select().from(reports)
      .where(eq(reports.featureId, featureId))
      .orderBy(desc(reports.createdAt));
  }

  async getReport(id: string): Promise<Report | null> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || null;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [created] = await db.insert(reports).values(report).returning();
    return created;
  }

  async updateReport(id: string, report: Partial<InsertReport>): Promise<Report | null> {
    const [updated] = await db
      .update(reports)
      .set({ ...report, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();
    return updated || null;
  }

  async deleteReport(id: string): Promise<boolean> {
    const result = await db.delete(reports).where(eq(reports.id, id)).returning();
    return result.length > 0;
  }

  // ========================================
  // COLLAB & WORKFLOWS METHODS
  // ========================================

  // Workflows
  async getWorkflows(category?: string, type?: string): Promise<Workflow[]> {
    let query = db.select().from(workflows);
    
    const conditions = [];
    if (category) conditions.push(eq(workflows.category, category));
    if (type) conditions.push(eq(workflows.type, type));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(workflows.category, workflows.name);
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || null;
  }

  async getWorkflowTasks(workflowId: string): Promise<WorkflowTask[]> {
    return await db.select().from(workflowTasks)
      .where(eq(workflowTasks.workflowId, workflowId))
      .orderBy(workflowTasks.order);
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [created] = await db.insert(workflows).values(workflow).returning();
    return created;
  }

  // Project Instances
  async getProjectInstances(userId: string, status?: string): Promise<ProjectInstance[]> {
    const conditions = [eq(projectInstances.userId, userId)];
    if (status) {
      conditions.push(eq(projectInstances.status, status));
    }
    
    return await db.select().from(projectInstances)
      .where(and(...conditions))
      .orderBy(desc(projectInstances.createdAt));
  }

  async getProjectInstance(id: string): Promise<ProjectInstance | null> {
    const [instance] = await db.select().from(projectInstances).where(eq(projectInstances.id, id));
    return instance || null;
  }

  async createProjectInstance(instance: InsertProjectInstance): Promise<ProjectInstance> {
    const [created] = await db.insert(projectInstances).values(instance).returning();
    return created;
  }

  async updateProjectInstance(id: string, instance: Partial<InsertProjectInstance>): Promise<ProjectInstance | null> {
    const [updated] = await db
      .update(projectInstances)
      .set({ ...instance, updatedAt: new Date() })
      .where(eq(projectInstances.id, id))
      .returning();
    return updated || null;
  }

  // Project Tasks
  async getProjectTasks(projectInstanceId: string): Promise<ProjectTask[]> {
    return await db.select().from(projectTasks)
      .where(eq(projectTasks.projectInstanceId, projectInstanceId))
      .orderBy(projectTasks.order);
  }

  async getProjectTask(id: string): Promise<ProjectTask | null> {
    const [task] = await db.select().from(projectTasks).where(eq(projectTasks.id, id));
    return task || null;
  }

  async createProjectTask(task: InsertProjectTask): Promise<ProjectTask> {
    const [created] = await db.insert(projectTasks).values(task).returning();
    return created;
  }

  async updateProjectTask(id: string, task: Partial<InsertProjectTask>): Promise<ProjectTask | null> {
    const [updated] = await db
      .update(projectTasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(projectTasks.id, id))
      .returning();
    return updated || null;
  }

  async deleteProjectTask(id: string): Promise<boolean> {
    const result = await db.delete(projectTasks).where(eq(projectTasks.id, id)).returning();
    return result.length > 0;
  }

  // Task Comments
  async getTaskComments(projectTaskId: string): Promise<TaskComment[]> {
    return await db.select().from(taskComments)
      .where(eq(taskComments.projectTaskId, projectTaskId))
      .orderBy(taskComments.createdAt);
  }

  async createTaskComment(comment: InsertTaskComment): Promise<TaskComment> {
    const [created] = await db.insert(taskComments).values(comment).returning();
    return created;
  }

  async deleteTaskComment(id: string): Promise<boolean> {
    const result = await db.delete(taskComments).where(eq(taskComments.id, id)).returning();
    return result.length > 0;
  }

  // Task Reactions
  async getTaskReactions(targetId: string, targetType: "task" | "comment"): Promise<TaskReaction[]> {
    return await db.select().from(taskReactions)
      .where(and(
        eq(taskReactions.targetId, targetId),
        eq(taskReactions.targetType, targetType)
      ))
      .orderBy(taskReactions.createdAt);
  }

  async createTaskReaction(reaction: InsertTaskReaction): Promise<TaskReaction> {
    const [created] = await db.insert(taskReactions).values(reaction).returning();
    return created;
  }

  async deleteTaskReaction(id: string): Promise<boolean> {
    const result = await db.delete(taskReactions).where(eq(taskReactions.id, id)).returning();
    return result.length > 0;
  }

  // ============================================================================
  // PERSONALIZATION ENGINE
  // ============================================================================

  // Audiences
  async getAudiences(): Promise<Audience[]> {
    return await db.select().from(audiences).orderBy(desc(audiences.createdAt));
  }

  async getAudience(id: string): Promise<Audience | null> {
    const [audience] = await db.select().from(audiences).where(eq(audiences.id, id));
    return audience || null;
  }

  async createAudience(audience: InsertAudience): Promise<Audience> {
    const [created] = await db.insert(audiences).values(audience).returning();
    return created;
  }

  async updateAudience(id: string, audience: Partial<InsertAudience>): Promise<Audience> {
    const [updated] = await db
      .update(audiences)
      .set({ ...audience, updatedAt: new Date() })
      .where(eq(audiences.id, id))
      .returning();
    return updated;
  }

  // Content-Audience Pairings
  async getContentPairingsByAudience(audienceId: string): Promise<ContentAudiencePairing[]> {
    return await db
      .select()
      .from(contentAudiencePairings)
      .where(eq(contentAudiencePairings.audienceId, audienceId))
      .orderBy(desc(contentAudiencePairings.relevanceScore));
  }

  async createContentPairing(pairing: InsertContentAudiencePairing): Promise<ContentAudiencePairing> {
    const [created] = await db.insert(contentAudiencePairings).values(pairing).returning();
    return created;
  }

  async updateContentPairing(id: string, pairing: Partial<InsertContentAudiencePairing>): Promise<ContentAudiencePairing> {
    const [updated] = await db
      .update(contentAudiencePairings)
      .set({ ...pairing, updatedAt: new Date() })
      .where(eq(contentAudiencePairings.id, id))
      .returning();
    return updated;
  }

  // Personalization Rules
  async getPersonalizationRules(): Promise<PersonalizationRule[]> {
    return await db
      .select()
      .from(personalizationRules)
      .orderBy(desc(personalizationRules.priority), desc(personalizationRules.createdAt));
  }

  async createPersonalizationRule(rule: InsertPersonalizationRule): Promise<PersonalizationRule> {
    const [created] = await db.insert(personalizationRules).values(rule).returning();
    return created;
  }

  // Personalization Insights
  async getPersonalizationInsights(audienceId: string): Promise<PersonalizationInsight[]> {
    return await db
      .select()
      .from(personalizationInsights)
      .where(eq(personalizationInsights.audienceId, audienceId))
      .orderBy(desc(personalizationInsights.periodEnd));
  }

  // Playbook Templates
  async getPlaybookTemplates(): Promise<PlaybookTemplate[]> {
    return await db
      .select()
      .from(playbookTemplates)
      .where(eq(playbookTemplates.isActive, true))
      .orderBy(desc(playbookTemplates.isDefault), desc(playbookTemplates.createdAt));
  }

  async getPlaybookTemplate(id: string): Promise<PlaybookTemplate | null> {
    const [template] = await db
      .select()
      .from(playbookTemplates)
      .where(eq(playbookTemplates.id, id));
    return template || null;
  }

  // Intent Tiers
  async getIntentTiers(): Promise<IntentTier[]> {
    return await db
      .select()
      .from(intentTiers)
      .orderBy(intentTiers.tierOrder);
  }

  async getIntentTiersByTemplate(templateId: string): Promise<IntentTier[]> {
    return await db
      .select()
      .from(intentTiers)
      .where(eq(intentTiers.templateId, templateId))
      .orderBy(intentTiers.tierOrder);
  }

  // Playbook Steps
  async getPlaybookSteps(templateId: string): Promise<PlaybookStep[]> {
    return await db
      .select()
      .from(playbookSteps)
      .where(eq(playbookSteps.templateId, templateId))
      .orderBy(playbookSteps.stepNumber);
  }
}
