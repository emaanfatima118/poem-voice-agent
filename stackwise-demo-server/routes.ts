import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./ai-service";
import { generateCompleteTrackingCode } from "./utils/trackingCodeGenerator";
import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  insertStrategySnapshotSchema,
  insertInsightsSnapshotSchema,
  insertCampaignRecipeSchema,
  insertMilestoneSchema,
  insertProjectSchema,
  insertAssistantSuggestionSchema,
  insertSimulationSchema,
  insertTrackingCodeSchema,
  insertPlaySchema,
  insertEvalMatrixItemSchema,
  insertExecutiveSchema,
  insertDistributionCardSchema,
  insertDistributionEvalSchema,
  insertDistributionLaunchSchema,
  executiveContent,
} from "@shared/schema";

export function registerRoutes(app: Express): Server {
  const MOCK_USER_ID = "user-demo";

  // Strategy Snapshots
  app.get("/api/strategy-snapshots", async (req, res) => {
    try {
      const snapshots = await storage.getAllStrategySnapshots(MOCK_USER_ID);
      res.json(snapshots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/strategy-snapshots/latest", async (req, res) => {
    try {
      const snapshot = await storage.getLatestStrategySnapshot(MOCK_USER_ID);
      res.json(snapshot);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/strategy-snapshots/:id", async (req, res) => {
    try {
      const snapshot = await storage.getStrategySnapshot(req.params.id);
      if (!snapshot) {
        return res.status(404).json({ error: "Strategy snapshot not found" });
      }
      res.json(snapshot);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/strategy-snapshots", async (req, res) => {
    try {
      const validatedData = insertStrategySnapshotSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const snapshot = await storage.createStrategySnapshot(validatedData);
      res.status(201).json(snapshot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/strategy-snapshots/:id", async (req, res) => {
    try {
      const snapshot = await storage.updateStrategySnapshot(req.params.id, req.body);
      res.json(snapshot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Insights Snapshots
  app.get("/api/insights-snapshots", async (req, res) => {
    try {
      const snapshots = await storage.getAllInsightsSnapshots(MOCK_USER_ID);
      res.json(snapshots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/insights-snapshots/quarter/:quarter", async (req, res) => {
    try {
      const snapshots = await storage.getInsightsSnapshotsByQuarter(
        MOCK_USER_ID,
        req.params.quarter
      );
      res.json(snapshots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/insights-snapshots", async (req, res) => {
    try {
      const validatedData = insertInsightsSnapshotSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const snapshot = await storage.createInsightsSnapshot(validatedData);
      res.status(201).json(snapshot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Campaign Recipes
  app.get("/api/campaign-recipes", async (req, res) => {
    try {
      const recipes = await storage.getAllCampaignRecipes();
      res.json(recipes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/campaign-recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getCampaignRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ error: "Campaign recipe not found" });
      }
      res.json(recipe);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/campaign-recipes", async (req, res) => {
    try {
      const validatedData = insertCampaignRecipeSchema.parse(req.body);
      const recipe = await storage.createCampaignRecipe(validatedData);
      res.status(201).json(recipe);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/campaign-recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.updateCampaignRecipe(req.params.id, req.body);
      res.json(recipe);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/campaign-recipes/:id", async (req, res) => {
    try {
      await storage.deleteCampaignRecipe(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Milestones
  app.get("/api/milestones", async (req, res) => {
    try {
      const { timeframe, userId } = req.query;
      // For demo purposes, always use MOCK_USER_ID to show seed data
      // This ensures milestones are visible regardless of authentication
      const effectiveUserId = userId || MOCK_USER_ID;
      let milestones;
      if (timeframe) {
        milestones = await storage.getMilestonesByTimeframe(
          effectiveUserId as string,
          timeframe as string
        );
      } else {
        milestones = await storage.getMilestonesByUser(effectiveUserId as string);
      }
      res.json(milestones);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/milestones/:id", async (req, res) => {
    try {
      const milestone = await storage.getMilestone(req.params.id);
      if (!milestone) {
        return res.status(404).json({ error: "Milestone not found" });
      }
      res.json(milestone);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/milestones", async (req, res) => {
    try {
      const validatedData = insertMilestoneSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const milestone = await storage.createMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/milestones/:id", async (req, res) => {
    try {
      const milestone = await storage.updateMilestone(req.params.id, req.body);
      res.json(milestone);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/milestones/:id", async (req, res) => {
    try {
      await storage.deleteMilestone(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Evaluation Matrix Items
  app.get("/api/eval-matrix-items", async (req, res) => {
    try {
      const items = await storage.getEvalMatrixItemsByUser(MOCK_USER_ID);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/eval-matrix-items/:id", async (req, res) => {
    try {
      const item = await storage.getEvalMatrixItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Eval matrix item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/eval-matrix-items", async (req, res) => {
    try {
      const validatedData = insertEvalMatrixItemSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const item = await storage.createEvalMatrixItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/eval-matrix-items/:id", async (req, res) => {
    try {
      const item = await storage.updateEvalMatrixItem(req.params.id, req.body);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/eval-matrix-items/:id", async (req, res) => {
    try {
      await storage.deleteEvalMatrixItem(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const { module } = req.query;
      let projects;
      if (module) {
        projects = await storage.getProjectsByModule(MOCK_USER_ID, module as string);
      } else {
        projects = await storage.getProjectsByUser(MOCK_USER_ID);
      }
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Assistant Suggestions
  app.get("/api/assistant-suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getAssistantSuggestionsByUser(MOCK_USER_ID);
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assistant-suggestions", async (req, res) => {
    try {
      const validatedData = insertAssistantSuggestionSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const suggestion = await storage.createAssistantSuggestion(validatedData);
      res.status(201).json(suggestion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/assistant-suggestions/:id", async (req, res) => {
    try {
      const suggestion = await storage.updateAssistantSuggestion(
        req.params.id,
        req.body
      );
      res.json(suggestion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/assistant-suggestions/:id", async (req, res) => {
    try {
      await storage.deleteAssistantSuggestion(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Simulations
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getSimulationsByUser(MOCK_USER_ID);
      res.json(simulations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/simulations", async (req, res) => {
    try {
      const validatedData = insertSimulationSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const simulation = await storage.createSimulation(validatedData);
      res.status(201).json(simulation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/simulations/:id", async (req, res) => {
    try {
      const simulation = await storage.updateSimulation(req.params.id, req.body);
      res.json(simulation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/simulations/:id", async (req, res) => {
    try {
      await storage.deleteSimulation(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Assistant Routes
  // NOTE: These integrate with OpenAI/Anthropic when API keys are provided
  // Currently returns intelligent mock data until keys are configured
  
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { userId, strategySnapshotId } = req.body;
      
      let strategySnapshot = null;
      if (strategySnapshotId) {
        strategySnapshot = await storage.getStrategySnapshot(strategySnapshotId);
      } else {
        strategySnapshot = await storage.getLatestStrategySnapshot(userId || MOCK_USER_ID);
      }

      const recommendations = await aiService.generateRecommendations({
        userId: userId || MOCK_USER_ID,
        strategySnapshot: strategySnapshot || undefined,
      });

      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/simulate-budget", async (req, res) => {
    try {
      const { budget, allocation } = req.body;
      
      const simulation = await aiService.simulateBudgetScenario(budget, allocation);
      res.json(simulation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/analyze-milestone", async (req, res) => {
    try {
      const { milestone, userId } = req.body;
      
      const latestStrategy = await storage.getLatestStrategySnapshot(userId || MOCK_USER_ID);
      
      const analysis = await aiService.analyzeMilestonePriority(milestone, {
        userId: userId || MOCK_USER_ID,
        strategySnapshot: latestStrategy || undefined,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/quarterly-insights", async (req, res) => {
    try {
      const { performanceData } = req.body;
      
      const insights = await aiService.generateQuarterlyInsights(performanceData);
      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }
      
      const latestStrategy = await storage.getLatestStrategySnapshot(userId || MOCK_USER_ID);
      
      // Set up SSE for streaming response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Handle client disconnect to stop streaming
      let clientDisconnected = false;
      req.on('close', () => {
        clientDisconnected = true;
      });

      for await (const chunk of aiService.streamResponse(message, {
        userId: userId || MOCK_USER_ID,
        strategySnapshot: latestStrategy || undefined,
      })) {
        if (clientDisconnected) break;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      if (!clientDisconnected) {
        res.write("data: [DONE]\n\n");
      }
      res.end();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Tracking Codes
  app.get("/api/tracking-codes", async (req, res) => {
    try {
      const codes = await storage.getTrackingCodesByUser(MOCK_USER_ID);
      res.json(codes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tracking-codes/:id", async (req, res) => {
    try {
      const code = await storage.getTrackingCode(req.params.id);
      if (!code) {
        return res.status(404).json({ error: "Tracking code not found" });
      }
      res.json(code);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tracking-codes", async (req, res) => {
    try {
      const validatedData = insertTrackingCodeSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const code = await storage.createTrackingCode(validatedData);
      res.status(201).json(code);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tracking-codes/:id", async (req, res) => {
    try {
      const code = await storage.updateTrackingCode(req.params.id, req.body);
      res.json(code);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/tracking-codes/:id", async (req, res) => {
    try {
      await storage.deleteTrackingCode(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // My Plays
  app.get("/api/plays", async (req, res) => {
    try {
      const { status, quarter } = req.query;
      let plays;
      
      if (status && typeof status === "string") {
        plays = await storage.getPlaysByStatus(MOCK_USER_ID, status);
      } else if (quarter && typeof quarter === "string") {
        plays = await storage.getPlaysByQuarter(MOCK_USER_ID, quarter);
      } else {
        plays = await storage.getPlaysByUser(MOCK_USER_ID);
      }
      
      res.json(plays);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/plays/:id", async (req, res) => {
    try {
      const play = await storage.getPlay(req.params.id);
      if (!play) {
        return res.status(404).json({ error: "Play not found" });
      }
      res.json(play);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/plays", async (req, res) => {
    try {
      const validatedData = insertPlaySchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const play = await storage.createPlay(validatedData);
      res.status(201).json(play);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/plays/:id", async (req, res) => {
    try {
      const play = await storage.updatePlay(req.params.id, req.body);
      res.json(play);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/plays/:id", async (req, res) => {
    try {
      await storage.deletePlay(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/plays/:id/promote", async (req, res) => {
    try {
      const validatedMilestone = insertMilestoneSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const result = await storage.promotePlayToMilestone(req.params.id, validatedMilestone);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Executives (Brand Craft - Thought Leadership)
  app.get("/api/executives", async (req, res) => {
    try {
      const executives = await storage.getAllExecutives(MOCK_USER_ID);
      res.json(executives);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/executives/:id", async (req, res) => {
    try {
      const executive = await storage.getExecutive(req.params.id);
      if (!executive) {
        return res.status(404).json({ error: "Executive not found" });
      }
      res.json(executive);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/executives", async (req, res) => {
    try {
      const validatedData = insertExecutiveSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const executive = await storage.createExecutive(validatedData);
      res.status(201).json(executive);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/executives/:id", async (req, res) => {
    try {
      const executive = await storage.updateExecutive(req.params.id, req.body);
      res.json(executive);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/executives/:id", async (req, res) => {
    try {
      await storage.deleteExecutive(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Executive Content (Brand Craft - Thought Leadership)
  app.get("/api/executive-content", async (req, res) => {
    try {
      const content = await db.select().from(executiveContent).where(eq(executiveContent.userId, MOCK_USER_ID));
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Distribution Cards (Flight Deck - Multi-Channel Distribution)
  app.get("/api/distribution/cards", async (req, res) => {
    try {
      const { status } = req.query;
      let cards;
      if (status) {
        cards = await storage.getDistributionCardsByStatus(MOCK_USER_ID, status as string);
      } else {
        cards = await storage.getDistributionCardsByUser(MOCK_USER_ID);
      }
      res.json(cards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/distribution/cards/:id", async (req, res) => {
    try {
      const card = await storage.getDistributionCard(req.params.id);
      if (!card) {
        return res.status(404).json({ error: "Distribution card not found" });
      }
      res.json(card);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/distribution/load-campaigns", async (req, res) => {
    try {
      const { campaignIds } = req.body;
      if (!Array.isArray(campaignIds)) {
        return res.status(400).json({ error: "campaignIds must be an array" });
      }
      const cards = await storage.loadCampaignsToDistribution(MOCK_USER_ID, campaignIds);
      
      // Return immediately - tracking codes can be generated separately via the UI
      res.status(201).json(cards);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Separate endpoint to generate tracking codes for a distribution card
  app.post("/api/distribution/cards/:cardId/generate-tracking", async (req, res) => {
    try {
      const { cardId } = req.params;
      const card = await storage.getDistributionCard(cardId);
      if (!card) {
        return res.status(404).json({ error: "Distribution card not found" });
      }

      const assets = await storage.getDistributionAssetsByCard(cardId);
      const trackingCodes = [];

      for (const asset of assets) {
        const trackingCodeData = await generateCompleteTrackingCode({
          campaignName: card.campaignName || '',
          channelName: card.channelName,
          assetName: asset.assetName,
          destinationUrl: 'https://example.com',
        });

        const trackingCode = await storage.createTrackingCode({
          userId: MOCK_USER_ID,
          campaign: card.campaignName,
          code: trackingCodeData.code,
          utmSource: trackingCodeData.utmSource,
          utmMedium: trackingCodeData.utmMedium,
          utmCampaign: trackingCodeData.utmCampaign,
          utmContent: trackingCodeData.utmContent,
          destinationUrl: trackingCodeData.trackingUrl,
          qrCodeData: trackingCodeData.qrCodeData,
          distributionCardId: card.id,
          distributionAssetId: asset.id,
          campaignId: card.sourceCampaignId || null,
          channelName: card.channelName,
          assetName: asset.assetName,
        });
        trackingCodes.push(trackingCode);
      }

      res.status(201).json(trackingCodes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/distribution/load-executives", async (req, res) => {
    try {
      const { executiveIds } = req.body;
      if (!Array.isArray(executiveIds)) {
        return res.status(400).json({ error: "executiveIds must be an array" });
      }
      const cards = await storage.loadExecutiveProgramsToDistribution(MOCK_USER_ID, executiveIds);
      res.status(201).json(cards);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/distribution/cards", async (req, res) => {
    try {
      const cardData = {
        ...req.body,
        userId: MOCK_USER_ID,
      };
      const card = await storage.createDistributionCard(cardData);
      res.status(201).json(card);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/distribution/cards/:id", async (req, res) => {
    try {
      const card = await storage.updateDistributionCard(req.params.id, req.body);
      res.json(card);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/distribution/cards/:id", async (req, res) => {
    try {
      await storage.deleteDistributionCard(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Distribution Evals
  app.get("/api/distribution/evals", async (req, res) => {
    try {
      const { pending } = req.query;
      let evals;
      if (pending === 'true') {
        evals = await storage.getPendingDistributionEvals(MOCK_USER_ID);
      } else {
        evals = await storage.getDistributionEvalsByUser(MOCK_USER_ID);
      }
      res.json(evals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/distribution/cards/:cardId/evals", async (req, res) => {
    try {
      const evals = await storage.getDistributionEvalsByCard(req.params.cardId);
      res.json(evals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/distribution/evals", async (req, res) => {
    try {
      const validatedData = insertDistributionEvalSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const evalItem = await storage.createDistributionEval(validatedData);
      res.status(201).json(evalItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/distribution/evals/:id", async (req, res) => {
    try {
      const evalItem = await storage.updateDistributionEval(req.params.id, req.body);
      res.json(evalItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Distribution Launches
  app.get("/api/distribution/launches", async (req, res) => {
    try {
      const { live } = req.query;
      let launches;
      if (live === 'true') {
        launches = await storage.getLiveDistributionLaunches(MOCK_USER_ID);
      } else {
        launches = await storage.getDistributionLaunchesByUser(MOCK_USER_ID);
      }
      res.json(launches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/distribution/launches", async (req, res) => {
    try {
      const validatedData = insertDistributionLaunchSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      const launch = await storage.createDistributionLaunch(validatedData);
      res.status(201).json(launch);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/distribution/launches/:id", async (req, res) => {
    try {
      const launch = await storage.updateDistributionLaunch(req.params.id, req.body);
      res.json(launch);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Distribution Assets (individual pieces within distribution cards)
  app.get("/api/distribution/cards/:cardId/assets", async (req, res) => {
    try {
      const assets = await storage.getDistributionAssetsByCard(req.params.cardId);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/distribution/assets", async (req, res) => {
    try {
      const asset = await storage.createDistributionAsset({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      res.status(201).json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/distribution/assets/:id", async (req, res) => {
    try {
      const asset = await storage.updateDistributionAsset(req.params.id, req.body);
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/distribution/assets/:id", async (req, res) => {
    try {
      await storage.deleteDistributionAsset(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Tracking Codes (Auto-generated UTM tracking for distribution campaigns)
  app.get("/api/tracking-codes", async (req, res) => {
    try {
      const trackingCodes = await storage.getTrackingCodesByUser(MOCK_USER_ID);
      res.json(trackingCodes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tracking-codes/:id", async (req, res) => {
    try {
      const trackingCode = await storage.getTrackingCode(req.params.id);
      if (!trackingCode) {
        return res.status(404).json({ error: "Tracking code not found" });
      }
      res.json(trackingCode);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/distribution/cards/:cardId/tracking-codes", async (req, res) => {
    try {
      const trackingCodes = await storage.getTrackingCodesByCard(req.params.cardId);
      res.json(trackingCodes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tracking-codes", async (req, res) => {
    try {
      const trackingCode = await storage.createTrackingCode({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      res.status(201).json(trackingCode);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tracking-codes/:id", async (req, res) => {
    try {
      const trackingCode = await storage.updateTrackingCode(req.params.id, req.body);
      res.json(trackingCode);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tracking-codes/:id/scans", async (req, res) => {
    try {
      const trackingCode = await storage.incrementTrackingCodeScans(req.params.id);
      res.json(trackingCode);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Distribution Flights (5-step distribution workflow sessions)
  app.post("/api/distribution/flights", async (req, res) => {
    try {
      const flight = await storage.createDistributionFlight({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      res.status(201).json(flight);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/distribution/flights", async (req, res) => {
    try {
      const flights = await storage.getDistributionFlightsByUser(MOCK_USER_ID);
      res.json(flights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/distribution/flights/:id", async (req, res) => {
    try {
      const flight = await storage.getDistributionFlight(req.params.id);
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }
      res.json(flight);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/distribution/flights/:id", async (req, res) => {
    try {
      const flight = await storage.updateDistributionFlight(req.params.id, req.body);
      res.json(flight);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/distribution/flights/:id", async (req, res) => {
    try {
      await storage.deleteDistributionFlight(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Launch campaigns with Flight Manifest
  app.post("/api/distribution/launch", async (req, res) => {
    try {
      const { manifest } = req.body;
      
      // Create a new flight with the manifest
      const flight = await storage.createDistributionFlight({
        userId: MOCK_USER_ID,
        flightName: `Flight-${new Date().toISOString().split('T')[0]}`,
        flightManifest: manifest,
        status: 'launched',
        totalCampaigns: manifest.totalCampaigns || 0,
        totalChannels: manifest.totalChannels || 0,
        totalBudget: manifest.totalBudget || 0,
      });

      // Get all distribution cards for this user to create launch records
      const distributionCards = await storage.getDistributionCardsByUser(MOCK_USER_ID);
      
      // Create launch records for each distribution card
      const launches = await Promise.all(
        distributionCards.map(async (card) => {
          return await storage.createDistributionLaunch({
            userId: MOCK_USER_ID,
            distributionCardId: card.id,
            launchType: 'immediate',
            launchedAt: new Date(),
            status: 'preparing',
          });
        })
      );

      res.status(201).json({ flight, launches, manifest });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HITL Approvals (audit logging for human-in-the-loop actions)
  app.post("/api/hitl-approvals", async (req, res) => {
    try {
      const approval = await storage.createHitlApproval({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      res.status(201).json(approval);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/hitl-approvals/flight/:flightId", async (req, res) => {
    try {
      const approvals = await storage.getHitlApprovalsByFlight(req.params.flightId);
      res.json(approvals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hitl-approvals/card/:cardId", async (req, res) => {
    try {
      const approvals = await storage.getHitlApprovalsByCard(req.params.cardId);
      res.json(approvals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hitl-approvals", async (req, res) => {
    try {
      const approvals = await storage.getHitlApprovalsByUser(MOCK_USER_ID);
      res.json(approvals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Campaigns (BrandCraft integration for loading)
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaignsByUser(MOCK_USER_ID);
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Calendar API - Unified view of campaigns, exec visibility, and milestones
  app.get("/api/calendar/entries", async (req, res) => {
    try {
      const entries: any[] = [];

      // Fetch campaigns
      const campaigns = await storage.getCampaignsByUser(MOCK_USER_ID);
      for (const campaign of campaigns) {
        if (campaign.startDate || campaign.endDate) {
          entries.push({
            id: campaign.id,
            type: 'campaign',
            title: campaign.name,
            owner: campaign.stakeholders || 'Unassigned',
            startDate: campaign.startDate || undefined,
            endDate: campaign.endDate || undefined,
            status: campaign.status || 'draft',
            priority: campaign.priority || 'medium',
            description: campaign.goal || '',
            goal: campaign.goal,
            persona: campaign.primaryPersona,
            budget: campaign.estimatedBudget,
          });
        }
      }

      // Fetch executive visibility programs from distribution cards
      const distCards = await storage.getDistributionCardsByUser(MOCK_USER_ID);
      const execVisCards = distCards.filter(card => card.sourceType === 'exec_vis');
      for (const card of execVisCards) {
        if (card.startDate || card.endDate) {
          entries.push({
            id: card.id,
            type: 'exec_visibility',
            title: card.campaignName,
            owner: 'Executive Team',
            startDate: card.startDate || undefined,
            endDate: card.endDate || undefined,
            status: card.launchStatus || 'draft',
            priority: 'high',
            description: card.contentType || '',
            channel: card.channelName,
            parentCampaignId: card.sourceCampaignId || undefined, // Track if part of campaign
          });
        }
      }

      // Fetch milestones (limit to top 10 by priority)
      const milestones = await storage.getMilestonesByUser(MOCK_USER_ID);
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const sortedMilestones = milestones
        .sort((a, b) => (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0))
        .slice(0, 10);
      
      for (const milestone of sortedMilestones) {
        // Estimate dates based on timeframe and priority
        const now = new Date();
        const daysMap: Record<string, number> = {
          '30': 30,
          '60': 60,
          '90': 90,
        };
        const days = daysMap[milestone.timeframe] || 30;
        const estimatedDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        
        entries.push({
          id: milestone.id,
          type: '30_60_90',
          title: milestone.title,
          owner: milestone.assignee || 'Unassigned',
          startDate: undefined,
          endDate: estimatedDate.toISOString().split('T')[0],
          status: milestone.status,
          priority: milestone.priority || 'medium',
          description: milestone.description || '',
          timeframe: milestone.timeframe,
          milestone: true,
        });
      }

      // Add review events (monthly budget updates, quarterly reviews, quarterly calls, annual reset)
      const reviewEvents = [
        // Monthly budget updates (green $ symbol)
        {
          id: 'review-budget-dec',
          type: 'review_budget',
          reviewType: 'budget',
          title: 'December Budget Update',
          owner: 'Finance Team',
          startDate: '2025-12-01',
          endDate: '2025-12-01',
          status: 'pending',
          priority: 'high',
          description: 'Monthly budget review and reallocation',
        },
        {
          id: 'review-budget-jan',
          type: 'review_budget',
          reviewType: 'budget',
          title: 'January Budget Update',
          owner: 'Finance Team',
          startDate: '2026-01-01',
          endDate: '2026-01-01',
          status: 'pending',
          priority: 'high',
          description: 'Monthly budget review and reallocation',
        },
        // Quarterly reviews (red triangle)
        {
          id: 'review-q4-2025',
          type: 'review_quarterly',
          reviewType: 'quarterly',
          title: 'Q4 2025 Quarterly Review',
          owner: 'Leadership Team',
          startDate: '2025-12-15',
          endDate: '2025-12-20',
          status: 'pending',
          priority: 'high',
          description: 'Comprehensive Q4 performance review, wins/misses analysis, and Q1 2026 planning',
        },
        {
          id: 'review-q1-2026',
          type: 'review_quarterly',
          reviewType: 'quarterly',
          title: 'Q1 2026 Quarterly Review',
          owner: 'Leadership Team',
          startDate: '2026-03-15',
          endDate: '2026-03-20',
          status: 'pending',
          priority: 'high',
          description: 'Q1 2026 performance review and strategy adjustment',
        },
        // Quarterly strategy calls (Fully Stacked users - phone icon)
        {
          id: 'review-call-q4',
          type: 'review_call',
          reviewType: 'strategy_call',
          title: 'Q4 Strategy Call - Fully Stacked',
          owner: 'Stackwise Team',
          startDate: '2025-12-10',
          endDate: '2025-12-10',
          status: 'pending',
          priority: 'high',
          description: 'Quarterly strategy consultation for Fully Stacked users',
        },
        {
          id: 'review-call-q1',
          type: 'review_call',
          reviewType: 'strategy_call',
          title: 'Q1 2026 Strategy Call - Fully Stacked',
          owner: 'Stackwise Team',
          startDate: '2026-03-10',
          endDate: '2026-03-10',
          status: 'pending',
          priority: 'high',
          description: 'Quarterly strategy consultation for Fully Stacked users',
        },
        // Annual reset (compass icon)
        {
          id: 'review-annual-2026',
          type: 'review_annual',
          reviewType: 'annual',
          title: '2026 Annual Planning & Reset',
          owner: 'Leadership Team',
          startDate: '2025-12-28',
          endDate: '2026-01-10',
          status: 'pending',
          priority: 'high',
          description: 'Annual strategy reset, goal setting, and comprehensive planning for 2026',
        },
      ];

      entries.push(...reviewEvents);

      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Asset Management
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAllAssets(MOCK_USER_ID);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assets/recent", async (req, res) => {
    try {
      const assets = await storage.getRecentlyViewedAssets(MOCK_USER_ID);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = {
        ...req.body,
        userId: MOCK_USER_ID,
      };
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.updateAsset(req.params.id, req.body);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const success = await storage.deleteAsset(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Saved Views
  app.get("/api/saved-views", async (req, res) => {
    try {
      const views = await storage.getAllSavedViews(MOCK_USER_ID);
      res.json(views);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/saved-views", async (req, res) => {
    try {
      const validatedData = {
        ...req.body,
        userId: MOCK_USER_ID,
      };
      const view = await storage.createSavedView(validatedData);
      res.status(201).json(view);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/saved-views/:id", async (req, res) => {
    try {
      const success = await storage.deleteSavedView(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Saved view not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Asset Favorites
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getAllFavorites(MOCK_USER_ID);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = {
        ...req.body,
        userId: MOCK_USER_ID,
      };
      const favorite = await storage.createFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/favorites/:assetId", async (req, res) => {
    try {
      const success = await storage.deleteFavorite(MOCK_USER_ID, req.params.assetId);
      if (!success) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Modules Management
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const module = await storage.createModule(req.body);
      res.status(201).json(module);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Features Management
  app.get("/api/features", async (req, res) => {
    try {
      const features = await storage.getAllFeatures();
      res.json(features);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/features/by-module/:moduleId", async (req, res) => {
    try {
      const features = await storage.getFeaturesByModule(req.params.moduleId);
      res.json(features);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/features/:id", async (req, res) => {
    try {
      const feature = await storage.getFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ error: "Feature not found" });
      }
      res.json(feature);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/features", async (req, res) => {
    try {
      const feature = await storage.createFeature(req.body);
      res.status(201).json(feature);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reports Management
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reports/by-module/:moduleId", async (req, res) => {
    try {
      const reports = await storage.getReportsByModule(req.params.moduleId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reports/by-feature/:featureId", async (req, res) => {
    try {
      const reports = await storage.getReportsByFeature(req.params.featureId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const report = await storage.createReport(req.body);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ========================================
  // COLLAB & WORKFLOWS ROUTES
  // ========================================

  // Workflows (Templates)
  app.get("/api/workflows", async (req, res) => {
    try {
      const { category, type } = req.query;
      const workflows = await storage.getWorkflows(
        category as string,
        type as string
      );
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workflows/:id", async (req, res) => {
    try {
      const workflow = await storage.getWorkflow(req.params.id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workflows/:id/tasks", async (req, res) => {
    try {
      const tasks = await storage.getWorkflowTasks(req.params.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const workflow = await storage.createWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Project Instances
  app.get("/api/project-instances", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const status = req.query.status as string;
      const instances = await storage.getProjectInstances(userId, status);
      res.json(instances);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/project-instances/:id", async (req, res) => {
    try {
      const instance = await storage.getProjectInstance(req.params.id);
      if (!instance) {
        return res.status(404).json({ error: "Project instance not found" });
      }
      res.json(instance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/project-instances", async (req, res) => {
    try {
      const instance = await storage.createProjectInstance(req.body);
      res.status(201).json(instance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/project-instances/:id", async (req, res) => {
    try {
      const instance = await storage.updateProjectInstance(req.params.id, req.body);
      if (!instance) {
        return res.status(404).json({ error: "Project instance not found" });
      }
      res.json(instance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Project Tasks
  app.get("/api/project-instances/:projectId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getProjectTasks(req.params.projectId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/project-tasks/:id", async (req, res) => {
    try {
      const task = await storage.getProjectTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/project-tasks", async (req, res) => {
    try {
      const task = await storage.createProjectTask(req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/project-tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateProjectTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/project-tasks/:id", async (req, res) => {
    try {
      await storage.deleteProjectTask(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Task Comments
  app.get("/api/project-tasks/:taskId/comments", async (req, res) => {
    try {
      const comments = await storage.getTaskComments(req.params.taskId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/task-comments", async (req, res) => {
    try {
      const comment = await storage.createTaskComment(req.body);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/task-comments/:id", async (req, res) => {
    try {
      await storage.deleteTaskComment(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Task Reactions
  app.get("/api/reactions/:targetType/:targetId", async (req, res) => {
    try {
      const reactions = await storage.getTaskReactions(
        req.params.targetId,
        req.params.targetType as "task" | "comment"
      );
      res.json(reactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/task-reactions", async (req, res) => {
    try {
      const reaction = await storage.createTaskReaction(req.body);
      res.status(201).json(reaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/task-reactions/:id", async (req, res) => {
    try {
      await storage.deleteTaskReaction(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // PERSONALIZATION ENGINE
  // ============================================================================

  // Audiences
  app.get("/api/personalization/audiences", async (req, res) => {
    try {
      const audiences = await storage.getAudiences();
      res.json(audiences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/personalization/audiences/:id", async (req, res) => {
    try {
      const audience = await storage.getAudience(req.params.id);
      if (!audience) {
        return res.status(404).json({ error: "Audience not found" });
      }
      res.json(audience);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/personalization/audiences", async (req, res) => {
    try {
      const audience = await storage.createAudience(req.body);
      res.status(201).json(audience);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/personalization/audiences/:id", async (req, res) => {
    try {
      const audience = await storage.updateAudience(req.params.id, req.body);
      res.json(audience);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Content-Audience Pairings
  app.get("/api/personalization/pairings/:audienceId", async (req, res) => {
    try {
      const pairings = await storage.getContentPairingsByAudience(req.params.audienceId);
      res.json(pairings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/personalization/pairings", async (req, res) => {
    try {
      const pairing = await storage.createContentPairing(req.body);
      res.status(201).json(pairing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/personalization/pairings/:id", async (req, res) => {
    try {
      const pairing = await storage.updateContentPairing(req.params.id, req.body);
      res.json(pairing);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Personalization Rules
  app.get("/api/personalization/rules", async (req, res) => {
    try {
      const rules = await storage.getPersonalizationRules();
      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/personalization/rules", async (req, res) => {
    try {
      const rule = await storage.createPersonalizationRule(req.body);
      res.status(201).json(rule);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Personalization Insights
  app.get("/api/personalization/insights/:audienceId", async (req, res) => {
    try {
      const insights = await storage.getPersonalizationInsights(req.params.audienceId);
      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Playbook Templates
  app.get("/api/playbooks/templates", async (req, res) => {
    try {
      const templates = await storage.getPlaybookTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/playbooks/templates/:id", async (req, res) => {
    try {
      const template = await storage.getPlaybookTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Playbook template not found" });
      }
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Intent Tiers
  app.get("/api/playbooks/intent-tiers", async (req, res) => {
    try {
      const tiers = await storage.getIntentTiers();
      res.json(tiers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/playbooks/intent-tiers/:templateId", async (req, res) => {
    try {
      const tiers = await storage.getIntentTiersByTemplate(req.params.templateId);
      res.json(tiers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Playbook Steps
  app.get("/api/playbooks/steps/:templateId", async (req, res) => {
    try {
      const steps = await storage.getPlaybookSteps(req.params.templateId);
      res.json(steps);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
