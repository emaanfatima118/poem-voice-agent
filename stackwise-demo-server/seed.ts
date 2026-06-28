/**
 * Database Seeding Script
 * 
 * Seeds the PostgreSQL database with initial campaign recipes
 * and sample data for demonstration purposes
 */

import { db } from "./db";
import { eq } from "drizzle-orm";
import { campaignRecipes, evalMatrixItems, milestones, plays, strategySnapshots, executives, executiveContent, campaigns, campaignChannelPlacements, campaignCreative, distributionCards, distributionEvals, distributionLaunches, distributionAssets, assets, modules, features, reports, workflows, workflowTasks, audiences, contentAudiencePairings, personalizationRules, personalizationInsights, playbookTemplates, playbookSteps, intentTiers, playbookInstances } from "@shared/schema";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    const DEMO_USER_ID = "user-demo";
    
    // Check if recipes already exist
    const existingRecipes = await db.select().from(campaignRecipes);
    let seedRecipes = existingRecipes.length === 0;

    // Seed campaign recipes
    const recipes = [
      {
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

    if (seedRecipes) {
      await db.insert(campaignRecipes).values(recipes);
      console.log(`✓ Seeded ${recipes.length} campaign recipes`);
    } else {
      console.log(`⊘ Skipping campaign recipes (already exist)`);
    }

    // Seed eval matrix items
    const evalItems = [
      // High Priority + Low Risk = Quick Wins
      {
        userId: DEMO_USER_ID,
        title: 'Launch LinkedIn POV Series',
        priority: 'high',
        risk: 'low',
        status: 'pending',
        impact: '+15% reach, +9% conversions',
        recommendedBy: 'Stackwise Sage',
        sourceModule: 'strategy_studio',
      },
      {
        userId: DEMO_USER_ID,
        title: 'Add Newsletter Signup Forms',
        priority: 'high',
        risk: 'low',
        status: 'pending',
        impact: '+20% list growth',
        recommendedBy: 'Pulse Hub Audit',
        sourceModule: 'pulse_hub',
      },
      {
        userId: DEMO_USER_ID,
        title: 'Fix Critical SEO Issues',
        priority: 'high',
        risk: 'low',
        status: 'approved',
        impact: '+25% organic traffic',
        recommendedBy: 'GTM Test Pit',
        sourceModule: 'pulse_hub',
      },
      
      // High Priority + Medium Risk = Calculated Moves
      {
        userId: DEMO_USER_ID,
        title: 'Email Nurture on HITL',
        priority: 'high',
        risk: 'medium',
        status: 'in-review',
        impact: '+22% engagement',
        recommendedBy: 'Quarterly Review',
        sourceModule: 'strategy_studio',
      },
      {
        userId: DEMO_USER_ID,
        title: 'Launch Executive Visibility Program',
        priority: 'high',
        risk: 'medium',
        status: 'pending',
        impact: '+30% brand authority',
        recommendedBy: 'Brand Craft',
        sourceModule: 'brand_craft',
      },
      
      // High Priority + High Risk = Strategic Bets
      {
        userId: DEMO_USER_ID,
        title: 'Rebuild Content Strategy',
        priority: 'high',
        risk: 'high',
        status: 'pending',
        impact: '+40% content velocity',
        recommendedBy: 'Stackwise Sage',
        sourceModule: 'brand_craft',
      },
      
      // Medium Priority + Low Risk = Fill-in Work
      {
        userId: DEMO_USER_ID,
        title: 'Expand ABM Account List',
        priority: 'medium',
        risk: 'low',
        status: 'pending',
        impact: '+12% pipeline',
        recommendedBy: 'My Plays',
        sourceModule: 'strategy_studio',
      },
      {
        userId: DEMO_USER_ID,
        title: 'Optimize Email Subject Lines',
        priority: 'medium',
        risk: 'low',
        status: 'pending',
        impact: '+8% open rate',
        recommendedBy: 'Flight Deck',
        sourceModule: 'flight_deck',
      },
      
      // Medium Priority + Medium Risk = Monitor
      {
        userId: DEMO_USER_ID,
        title: 'Test Video Content Format',
        priority: 'medium',
        risk: 'medium',
        status: 'pending',
        impact: '+15% engagement',
        recommendedBy: 'Brand Craft',
        sourceModule: 'brand_craft',
      },
      
      // Medium Priority + High Risk = Review
      {
        userId: DEMO_USER_ID,
        title: 'Pulse-to-Flight Sync Experiment',
        priority: 'medium',
        risk: 'high',
        status: 'pending',
        impact: '+18% efficiency',
        recommendedBy: 'Stackwise Sage',
        sourceModule: 'pulse_hub',
      },
      
      // Low Priority + Low Risk = Backlog
      {
        userId: DEMO_USER_ID,
        title: 'Test New Email Template Design',
        priority: 'low',
        risk: 'low',
        status: 'pending',
        impact: '+5% click rate',
        recommendedBy: 'BrandCraft',
        sourceModule: 'brand_craft',
      },
      {
        userId: DEMO_USER_ID,
        title: 'Update Social Media Bios',
        priority: 'low',
        risk: 'low',
        status: 'pending',
        impact: '+2% consistency',
        recommendedBy: 'My Plays',
        sourceModule: 'brand_craft',
      },
      
      // Low Priority + Medium Risk = Defer
      {
        userId: DEMO_USER_ID,
        title: 'Experiment with TikTok',
        priority: 'low',
        risk: 'medium',
        status: 'pending',
        impact: '+10% reach (uncertain)',
        recommendedBy: 'My Plays',
        sourceModule: 'strategy_studio',
      },
      
      // Low Priority + High Risk = Avoid
      {
        userId: DEMO_USER_ID,
        title: 'Complete Platform Rebrand',
        priority: 'low',
        risk: 'high',
        status: 'rejected',
        impact: 'Unknown brand impact',
        recommendedBy: 'External Consultant',
        sourceModule: 'brand_craft',
      },
    ];

    await db.insert(evalMatrixItems).values(evalItems);
    console.log(`✓ Seeded ${evalItems.length} eval matrix items`);

    // Seed 30/60/90 milestones
    const milestonesData = [
      // Completed milestones (with timestamps)
      {
        userId: DEMO_USER_ID,
        title: 'Complete Q4 Strategy Review',
        description: 'Review all Q4 performance metrics, wins/misses, and prepare Q1 strategy. Include budget review and team alignment.',
        timeframe: '30',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'medium',
        status: 'completed',
        assignee: 'Sarah Chen',
        tags: null,
        completedAt: new Date('2024-11-01'),
        createdAt: new Date('2024-10-01'),
        order: 1,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Setup Analytics Dashboard',
        description: 'Configure PulseHub dashboard to track key marketing metrics across all channels.',
        timeframe: '30',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'medium',
        status: 'completed',
        assignee: 'Dev Team',
        tags: null,
        completedAt: new Date('2024-10-28'),
        createdAt: new Date('2024-09-28'),
        order: 1,
      },
      
      // Missed milestones (past due, with older createdAt dates)
      {
        userId: DEMO_USER_ID,
        title: 'Launch September Newsletter',
        description: 'Deploy monthly newsletter with Q3 highlights and upcoming events. Expected 8k+ sends.',
        timeframe: '30',
        priority: 'high',
        risk: 'low',
        impact: 'medium',
        effort: 'low',
        status: 'missed',
        assignee: 'Marcus Johnson',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-09-01'), // 60+ days ago = missed
        order: 1,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Update Website Case Studies',
        description: 'Refresh 3 existing case studies with updated metrics and testimonials from clients.',
        timeframe: '60',
        priority: 'medium',
        risk: 'low',
        impact: 'medium',
        effort: 'medium',
        status: 'missed',
        assignee: 'Creative Team',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-08-15'), // 80+ days ago = missed
        order: 1,
      },
      
      // Active/Pending milestones (30-day)
      {
        userId: DEMO_USER_ID,
        title: 'Launch HITL Email Series Part 1',
        description: 'Deploy first 2 emails in the Human-in-the-Loop nurture sequence. Target enterprise CMOs with personalized content.',
        timeframe: '30',
        priority: 'high',
        risk: 'medium',
        impact: 'high',
        effort: 'high',
        status: 'in-progress',
        assignee: 'Marcus Johnson',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-25'),
        order: 2,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Set up Pulse-Flight Integration',
        description: 'Configure data sync between PulseHub analytics and Flight Deck campaign execution. Enable real-time performance tracking.',
        timeframe: '30',
        priority: 'medium',
        risk: 'medium',
        impact: 'medium',
        effort: 'high',
        status: 'pending',
        assignee: 'Dev Team',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-28'),
        order: 3,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Finalize Q4 Budget Reallocation',
        description: 'Shift 15% from paid social to LinkedIn Ads based on Q3 performance data. Get CFO approval by end of month.',
        timeframe: '30',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'low',
        status: 'pending',
        assignee: 'Sarah Chen',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-20'),
        order: 4,
      },
      
      // 60-day milestones
      {
        userId: DEMO_USER_ID,
        title: 'Launch LinkedIn POV Series (Posts 1-2)',
        description: 'Publish first 2 CEO-authored LinkedIn posts on AI & marketing strategy. Target 15k impressions per post with 5% engagement.',
        timeframe: '60',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
        assignee: 'Marcus Johnson',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-15'),
        order: 1,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Complete HITL Email Series',
        description: 'Deploy remaining 2 emails in the 4-part sequence. Measure open rates, CTR, and demo requests from target accounts.',
        timeframe: '60',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
        assignee: 'Marcus Johnson',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-18'),
        order: 2,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Measure Pulse-Flight Efficiency',
        description: 'Analyze data sync performance between PulseHub and Flight Deck. Track latency, accuracy, and team productivity gains.',
        timeframe: '60',
        priority: 'medium',
        risk: 'medium',
        impact: 'medium',
        effort: 'low',
        status: 'pending',
        assignee: 'Dev Team',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-22'),
        order: 3,
      },
      {
        userId: DEMO_USER_ID,
        title: 'A/B Test LinkedIn Ad Creative',
        description: 'Test 3 ad creative variants targeting enterprise CMOs. Budget: $5k per variant. Goal: <$80 CPL.',
        timeframe: '60',
        priority: 'medium',
        risk: 'low',
        impact: 'medium',
        effort: 'medium',
        status: 'pending',
        assignee: 'Paid Team',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-25'),
        order: 4,
      },
      
      // 90-day milestones
      {
        userId: DEMO_USER_ID,
        title: 'Complete LinkedIn POV Series (Posts 3-4)',
        description: 'Publish final 2 posts completing the 4-post thought leadership series. Analyze total campaign impact on brand awareness.',
        timeframe: '90',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
        assignee: 'Marcus Johnson',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-10'),
        order: 1,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Quarterly Performance Review',
        description: 'Complete Q4 review cycle including wins/misses analysis, SWOT, budget performance, and team retrospective.',
        timeframe: '90',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
        assignee: 'Sarah Chen',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-12'),
        order: 2,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Finalize Q1 2026 Strategy',
        description: 'Lock down Q1 strategic plan including goals, motions, channels, budget allocation, and key milestones.',
        timeframe: '90',
        priority: 'high',
        risk: 'low',
        impact: 'high',
        effort: 'high',
        status: 'pending',
        assignee: 'Sarah Chen',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-14'),
        order: 3,
      },
      {
        userId: DEMO_USER_ID,
        title: 'Launch Video Content Series',
        description: 'Produce and launch 3 short-form video pieces for LinkedIn and website. Repurpose from POV series content.',
        timeframe: '90',
        priority: 'medium',
        risk: 'medium',
        impact: 'medium',
        effort: 'high',
        status: 'pending',
        assignee: 'Creative Team',
        tags: null,
        completedAt: null,
        createdAt: new Date('2024-10-16'),
        order: 4,
      },
    ];

    await db.insert(milestones).values(milestonesData);
    console.log(`✓ Seeded ${milestonesData.length} milestones`);

    // Seed plays
    const playsData = [
      {
        userId: DEMO_USER_ID,
        sourceModule: 'strategy_studio',
        sourceType: 'milestone',
        title: 'HITL Email Series',
        summary: 'Launch 4-part email campaign on Human-in-the-Loop strategy',
        notes: 'Target C-suite and marketing leaders',
        tags: ['email', 'awareness', 'exec-pov'],
        priority: 'high',
        quarterTarget: 'Q4-2025',
        status: 'active',
        decisionLog: null,
        completedAt: null,
      },
      {
        userId: DEMO_USER_ID,
        sourceModule: 'brand_craft',
        sourceType: 'content',
        title: 'LinkedIn POV Series',
        summary: 'Executive thought leadership posts on AI strategy',
        notes: 'Posts authored by CEO, targeting decision-makers',
        tags: ['linkedin', 'awareness', 'exec-pov'],
        priority: 'high',
        quarterTarget: 'Q4-2025',
        status: 'active',
        decisionLog: null,
        completedAt: null,
      },
      {
        userId: DEMO_USER_ID,
        sourceModule: 'pulse_hub',
        sourceType: 'insight',
        title: 'Retention Motion Experiment',
        summary: 'Test new nurture sequence for existing customers',
        notes: 'Focus on increasing product adoption',
        tags: ['retention', 'experiment'],
        priority: 'medium',
        quarterTarget: 'Q4-2025',
        status: 'active',
        decisionLog: null,
        completedAt: null,
      },
      {
        userId: DEMO_USER_ID,
        sourceModule: 'flight_deck',
        sourceType: 'campaign',
        title: 'Video Ad Scaling',
        summary: 'Scale video content across paid channels',
        notes: 'Paused pending budget approval',
        tags: ['paid', 'video', 'awareness'],
        priority: 'medium',
        quarterTarget: 'Q4-2025',
        status: 'paused',
        decisionLog: null,
        completedAt: null,
      },
      {
        userId: DEMO_USER_ID,
        sourceModule: 'strategy_studio',
        sourceType: 'recommendation',
        title: 'ABM Account Expansion',
        summary: 'Expand target account list from 50 to 100',
        notes: 'Completed in October',
        tags: ['abm', 'targeting'],
        priority: 'high',
        quarterTarget: 'Q4-2025',
        status: 'complete',
        decisionLog: null,
        completedAt: new Date('2025-10-15'),
      },
    ];

    await db.insert(plays).values(playsData);
    console.log(`✓ Seeded ${playsData.length} plays`);

    // Seed strategy snapshot for Q4 2025
    const quarterStart = new Date('2025-10-01');
    const quarterEnd = new Date('2025-12-31');
    
    const strategyData = {
      userId: DEMO_USER_ID,
      version: 'Q4-2025',
      foundations: {
        goals: ['Increase brand awareness', 'Drive pipeline growth', 'Establish thought leadership'],
        focusAreas: ['Retention', 'Brand Consistency', 'Exec POV Launch'],
        audiences: ['Enterprise CMOs', 'Marketing Directors', 'B2B Marketers'],
        brandIntent: 'Position as the leading Human-in-the-Loop marketing intelligence platform'
      },
      gtmMotions: [
        { id: 'awareness', name: 'Awareness', selected: true },
        { id: 'nurture', name: 'Nurture', selected: true },
        { id: 'conversion', name: 'Conversion', selected: false },
        { id: 'retention', name: 'Retention', selected: true }
      ],
      channels: [
        { id: 'linkedin', name: 'LinkedIn', role: 'Awareness', cadence: 'Active', engagement: 85 },
        { id: 'email', name: 'Email', role: 'Nurture', cadence: 'Active', engagement: 78 },
        { id: 'paid-social', name: 'Paid Social', role: 'Awareness', cadence: 'Light', engagement: 65 },
        { id: 'content', name: 'Content Hub', role: 'Nurture', cadence: 'Active', engagement: 82 }
      ],
      activeRecipes: [
        { id: '1', name: 'Executive POV Sprint', status: 'active' },
        { id: '2', name: 'Advocacy Loop', status: 'active' }
      ],
      playbook: {},
      budget: 150000,
      quarterStartDate: quarterStart,
      quarterEndDate: quarterEnd,
    };

    await db.insert(strategySnapshots).values(strategyData);
    console.log(`✓ Seeded Q4-2025 strategy snapshot`);

    // Check if executives already exist
    const existingExecutives = await db.select().from(executives).where(eq(executives.userId, DEMO_USER_ID));
    
    // Seed executives for Brand Craft - Thought Leadership
    const executivesData = [
      {
        userId: DEMO_USER_ID,
        name: 'Sarah Chen',
        title: 'CEO',
        company: 'Stackwise',
        audience: 'Enterprise CMOs, Marketing Leaders, B2B Decision Makers',
        goals: 'Establish thought leadership in AI-powered marketing, Build personal brand as marketing innovation leader, Drive brand awareness for Stackwise',
        bio: 'Former VP of Marketing at Fortune 500 SaaS company. 15+ years leading marketing teams through digital transformation. Passionate about AI, data-driven decision making, and building high-performing teams.',
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/sarahchen',
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        reddit: '',
        wechat: '',
        website: 'https://stackwise.com/team/sarah-chen',
        expertise: ['AI & Marketing', 'B2B Strategy', 'Team Building', 'Marketing Operations', 'Customer Success'],
        followPeople: ['Seth Godin', 'Ann Handley', 'Neil Patel'],
        follows: ['@hubspot', '@salesforce', '@gartner_inc'],
        eventsInterest: ['MarTech Conference', 'SaaStr Annual', 'Dreamforce'],
        phrasesUse: 'Human-in-the-loop, AI-augmented, Data-informed, Customer-first, Strategic clarity',
        phrasesAvoid: 'Synergy, Disruptive (overused), Leverage (overused), Bleeding-edge',
        communities: ['CMO Council', 'MarTech Alliance', 'SaaS Marketing Slack'],
        newsSources: ['TechCrunch', 'Marketing Dive', 'AdWeek', 'The Information'],
        industry: 'Marketing Technology',
        vertical: 'B2B SaaS',
        motivates: 'Helping marketers make better decisions with AI',
        personality: 'Thoughtful, data-driven, optimistic, practical',
        visibilityScore: 87,
        toneScore: 92,
        engagementScore: 85,
        personaScore: 90,
        toneMapping: {
          emotional: {
            reflective: 70,
            inspirational: 80,
            optimistic: 85,
            compassionate: 75,
            humor: 55
          },
          persuasive: {
            assertive: 75,
            persuasive: 80,
            authoritative: 70
          },
          communication: {
            serious: 65,
            conversational: 80,
            informative: 85,
            curious: 75,
            matterOfFact: 60
          }
        }
      },
      {
        userId: DEMO_USER_ID,
        name: 'Marcus Johnson',
        title: 'VP of Marketing',
        company: 'Stackwise',
        audience: 'Marketing Directors, Demand Gen Leaders, Content Marketers',
        goals: 'Share tactical marketing insights, Build community of marketing practitioners, Demonstrate ROI of modern marketing stack',
        bio: 'Demand generation expert with deep expertise in marketing automation, ABM, and content strategy. Previously led growth marketing at two successful startups through acquisition.',
        linkedin: 'https://linkedin.com/in/marcusjohnson',
        twitter: 'https://twitter.com/marcusmarketing',
        facebook: '',
        instagram: '',
        youtube: 'https://youtube.com/@marcusmarketing',
        tiktok: '',
        reddit: 'u/marcusmarketing',
        wechat: '',
        website: '',
        expertise: ['Demand Generation', 'ABM Strategy', 'Marketing Automation', 'Content Marketing', 'Analytics'],
        followPeople: ['Dave Gerhardt', 'Sangram Vajre', 'Chris Walker'],
        follows: ['@drift', '@demandbase', '@6sense'],
        eventsInterest: ['B2B Marketing Summit', 'Demand Gen Summit', 'Content Marketing World'],
        phrasesUse: 'Pipeline impact, Engagement metrics, Multi-touch attribution, Account-based, Personalization at scale',
        phrasesAvoid: 'Growth hacking, Viral marketing, Spray and pray',
        communities: ['Demand Gen Report', 'Revenue Collective', 'Pavilion'],
        newsSources: ['MarketingProfs', 'Demand Gen Report', 'Content Marketing Institute'],
        industry: 'Marketing Technology',
        vertical: 'B2B SaaS',
        motivates: 'Proving marketing ROI and impact on revenue',
        personality: 'Analytical, results-focused, collaborative, detail-oriented',
        visibilityScore: 82,
        toneScore: 88,
        engagementScore: 90,
        personaScore: 85,
        toneMapping: {
          emotional: {
            reflective: 60,
            inspirational: 70,
            optimistic: 75,
            compassionate: 65,
            humor: 65
          },
          persuasive: {
            assertive: 85,
            persuasive: 80,
            authoritative: 75
          },
          communication: {
            serious: 70,
            conversational: 75,
            informative: 90,
            curious: 70,
            matterOfFact: 80
          }
        }
      },
      {
        userId: DEMO_USER_ID,
        name: 'Lisa Park',
        title: 'CMO',
        company: 'Stackwise',
        audience: 'C-Suite Executives, Board Members, Enterprise Decision Makers',
        goals: 'Position Stackwise as market leader, Share strategic marketing vision, Build executive network',
        bio: 'Marketing executive with 20+ years experience scaling B2B SaaS companies from Series A to IPO. Former CMO at two public companies. Passionate about brand building and customer advocacy.',
        linkedin: 'https://linkedin.com/in/lisapark',
        twitter: 'https://twitter.com/lisaparkCMO',
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        reddit: '',
        wechat: '',
        website: 'https://stackwise.com/team/lisa-park',
        expertise: ['Brand Strategy', 'Customer Marketing', 'Product Marketing', 'Executive Leadership', 'Board Relations'],
        followPeople: ['April Dunford', 'Andy Raskin', 'Mark Roberge'],
        follows: ['@gong', '@gainsight', '@pendo'],
        eventsInterest: ['SaaStr Annual', 'CMO Summit', 'Forrester B2B Summit'],
        phrasesUse: 'Customer-centric, Brand equity, Market positioning, Strategic narrative, Executive alignment',
        phrasesAvoid: 'Hacks, Silver bullet, Magic formula',
        communities: ['CMO Council', 'Chief', 'Pavilion CMO Circle'],
        newsSources: ['Harvard Business Review', 'WSJ', 'Forbes', 'Fortune'],
        industry: 'Marketing Technology',
        vertical: 'B2B SaaS',
        motivates: 'Building brands that customers love and trust',
        personality: 'Strategic, visionary, customer-focused, empathetic',
        visibilityScore: 90,
        toneScore: 94,
        engagementScore: 88,
        personaScore: 92,
        toneMapping: {
          emotional: {
            reflective: 75,
            inspirational: 90,
            optimistic: 80,
            compassionate: 85,
            humor: 50
          },
          persuasive: {
            assertive: 70,
            persuasive: 85,
            authoritative: 80
          },
          communication: {
            serious: 75,
            conversational: 70,
            informative: 85,
            curious: 80,
            matterOfFact: 65
          }
        }
      }
    ];

    let insertedExecutives;
    if (existingExecutives.length === 0) {
      await db.insert(executives).values(executivesData);
      insertedExecutives = await db.select().from(executives).where(eq(executives.userId, DEMO_USER_ID));
      console.log(`✓ Seeded ${executivesData.length} executives`);
    } else {
      insertedExecutives = existingExecutives;
      console.log(`⊘ Skipping executives (already exist)`);
    }

    // Seed executive visibility content
    const execContentData = [
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[0].id, // Sarah Chen
        programTitle: 'CEO Insights Series',
        programType: 'thought_leadership',
        pieceTitle: 'The Future of Marketing Intelligence',
        pieceNumber: 1,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Why AI Needs Humans: The Future of Marketing',
        bodyContent: 'After 15 years in tech, I\'ve seen countless "revolution" promises. But here\'s what\'s different about AI in marketing: it amplifies human judgment rather than replacing it...',
        launchDate: new Date('2025-11-05'),
        endDate: new Date('2025-11-12'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[0].id, // Sarah Chen
        programTitle: 'CEO Insights Series',
        programType: 'thought_leadership',
        pieceTitle: 'Building Trust in an AI World',
        pieceNumber: 2,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Trust is the New Currency in Marketing',
        bodyContent: 'Customers don\'t trust algorithms. They trust people who use algorithms wisely. Here\'s how we\'re thinking about trust at Stackwise...',
        launchDate: new Date('2025-11-19'),
        endDate: new Date('2025-11-26'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[1].id, // Marcus Johnson
        programTitle: 'VP Marketing POV Series',
        programType: 'tactical_insights',
        pieceTitle: 'ROI Metrics That Actually Matter',
        pieceNumber: 1,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Stop Measuring Vanity Metrics',
        bodyContent: 'Impressions look great in reports, but here\'s what actually drives pipeline: Attribution quality, MQL velocity, Opportunity acceleration...',
        launchDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-08'),
        status: 'scheduled',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[1].id, // Marcus Johnson
        programTitle: 'VP Marketing POV Series',
        programType: 'tactical_insights',
        pieceTitle: 'Content Strategy for AI Era',
        pieceNumber: 2,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Content Strategy in the AI Era',
        bodyContent: 'AI can write content, but it can\'t feel your customer\'s pain. Here\'s how we balance scale with authenticity at Stackwise...',
        launchDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-22'),
        status: 'draft',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[2].id, // Lisa Park
        programTitle: 'CMO Leadership Series',
        programType: 'thought_leadership',
        pieceTitle: 'Brand Building in the AI Age',
        pieceNumber: 1,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Why Brand Still Matters in an AI World',
        bodyContent: 'Technology changes fast, but trust is timeless. Here\'s why brand equity is your most valuable AI-resistant asset...',
        launchDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-17'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[2].id, // Lisa Park
        programTitle: 'CMO Leadership Series',
        programType: 'thought_leadership',
        pieceTitle: 'Customer-Led Growth Strategy',
        pieceNumber: 2,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Your Customers Are Your Best Growth Engine',
        bodyContent: 'After scaling two companies to IPO, I\'ve learned that sustainable growth comes from customers, not campaigns. Here\'s how we think about customer-led growth...',
        launchDate: new Date('2025-11-24'),
        endDate: new Date('2025-12-01'),
        status: 'approved',
      },
      // Additional exec programs
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[0].id, // Sarah Chen
        programTitle: 'Innovation Spotlight',
        programType: 'industry_trends',
        pieceTitle: 'AI Trends Shaping Marketing in 2026',
        pieceNumber: 1,
        contentType: 'LinkedIn Article',
        channel: 'LinkedIn',
        headline: '5 AI Trends Every Marketer Should Watch',
        bodyContent: 'The AI landscape is evolving rapidly. Here are the trends that will define marketing success in 2026...',
        launchDate: new Date('2025-12-05'),
        endDate: new Date('2025-12-12'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[0].id, // Sarah Chen
        programTitle: 'Innovation Spotlight',
        programType: 'industry_trends',
        pieceTitle: 'The Evolution of MarTech Stacks',
        pieceNumber: 2,
        contentType: 'LinkedIn Article',
        channel: 'LinkedIn',
        headline: 'Why Your MarTech Stack Needs a Rethink',
        bodyContent: 'Most marketing stacks are bloated and inefficient. Here\'s how to build one that actually drives results...',
        launchDate: new Date('2025-12-12'),
        endDate: new Date('2025-12-19'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[1].id, // Marcus Johnson
        programTitle: 'Demand Gen Playbook',
        programType: 'tactical_insights',
        pieceTitle: 'ABM Best Practices for 2026',
        pieceNumber: 1,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'Account-Based Marketing: What Actually Works',
        bodyContent: 'After running ABM programs at 3 companies, here\'s what I\'ve learned about what drives pipeline...',
        launchDate: new Date('2025-11-28'),
        endDate: new Date('2025-12-05'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[1].id, // Marcus Johnson
        programTitle: 'Demand Gen Playbook',
        programType: 'tactical_insights',
        pieceTitle: 'Email Marketing in the AI Era',
        pieceNumber: 2,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'How AI is Transforming Email Campaigns',
        bodyContent: 'Email isn\'t dead - it\'s evolving. Here\'s how AI is making email marketing more effective than ever...',
        launchDate: new Date('2025-12-06'),
        endDate: new Date('2025-12-13'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[2].id, // Lisa Park
        programTitle: 'Brand Strategy Insights',
        programType: 'thought_leadership',
        pieceTitle: 'Building Brand in a Noisy Market',
        pieceNumber: 1,
        contentType: 'LinkedIn Article',
        channel: 'LinkedIn',
        headline: 'Brand Differentiation: Standing Out When Everyone Looks the Same',
        bodyContent: 'In a sea of similar messaging, brand differentiation is more critical than ever. Here\'s how to build a brand that truly stands apart...',
        launchDate: new Date('2025-12-08'),
        endDate: new Date('2025-12-15'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[2].id, // Lisa Park
        programTitle: 'Brand Strategy Insights',
        programType: 'thought_leadership',
        pieceTitle: 'The ROI of Brand Investment',
        pieceNumber: 2,
        contentType: 'LinkedIn Article',
        channel: 'LinkedIn',
        headline: 'Why Brand Building is Your Best Long-Term Investment',
        bodyContent: 'Performance marketing gets the glory, but brand building drives sustainable growth. Here\'s the data that proves it...',
        launchDate: new Date('2025-12-16'),
        endDate: new Date('2025-12-23'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[0].id, // Sarah Chen
        programTitle: 'Leadership Lessons',
        programType: 'thought_leadership',
        pieceTitle: 'Building High-Performance Marketing Teams',
        pieceNumber: 1,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'What I\'ve Learned About Building Great Teams',
        bodyContent: 'After 15 years leading marketing teams, here are the patterns I\'ve seen in high-performing organizations...',
        launchDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-27'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[0].id, // Sarah Chen
        programTitle: 'Leadership Lessons',
        programType: 'thought_leadership',
        pieceTitle: 'The Future of Marketing Leadership',
        pieceNumber: 2,
        contentType: 'LinkedIn Post',
        channel: 'LinkedIn',
        headline: 'What CMOs Need to Know About Leading in the AI Age',
        bodyContent: 'The role of the CMO is evolving. Here\'s what future marketing leaders need to master...',
        launchDate: new Date('2025-12-28'),
        endDate: new Date('2026-01-04'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[1].id, // Marcus Johnson
        programTitle: 'Marketing Analytics Deep Dive',
        programType: 'tactical_insights',
        pieceTitle: 'Attribution Modeling Explained',
        pieceNumber: 1,
        contentType: 'LinkedIn Article',
        channel: 'LinkedIn',
        headline: 'Multi-Touch Attribution: A Practical Guide',
        bodyContent: 'Attribution is complex, but it doesn\'t have to be confusing. Here\'s how to think about it...',
        launchDate: new Date('2025-12-10'),
        endDate: new Date('2025-12-17'),
        status: 'approved',
      },
      {
        userId: DEMO_USER_ID,
        executiveId: insertedExecutives[1].id, // Marcus Johnson
        programTitle: 'Marketing Analytics Deep Dive',
        programType: 'tactical_insights',
        pieceTitle: 'Dashboard Design for Marketers',
        pieceNumber: 2,
        contentType: 'LinkedIn Article',
        channel: 'LinkedIn',
        headline: 'Building Dashboards That Actually Drive Decisions',
        bodyContent: 'Most marketing dashboards are information overload. Here\'s how to build ones that actually help your team make better decisions...',
        launchDate: new Date('2025-12-18'),
        endDate: new Date('2025-12-25'),
        status: 'approved',
      },
    ];

    await db.insert(executiveContent).values(execContentData);
    const insertedExecContent = await db.select().from(executiveContent).where(eq(executiveContent.userId, DEMO_USER_ID));
    console.log(`✓ Seeded ${execContentData.length} executive visibility pieces`);

    // Check if campaigns already exist
    const existingCampaigns = await db.select().from(campaigns);
    const seedCampaigns = existingCampaigns.length === 0;

    if (seedCampaigns) {
      // Seed campaigns (BrandCraft)
      const campaignsData = [
      {
        userId: DEMO_USER_ID,
        name: 'Q4 LinkedIn Thought Leadership',
        goal: 'Awareness',
        primaryPersona: 'Enterprise CMOs',
        secondaryPersona: 'Marketing Directors',
        campaignPillar: 'AI & Marketing Strategy',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        estimatedBudget: '25000',
        objectives: 'Drive 50k impressions, 2.5k engagements, establish CEO as thought leader',
        keyMessage: 'Human-in-the-Loop AI transforms marketing decision-making',
        successMetrics: 'Impressions, Engagement Rate, Profile Views, Content Downloads',
        stakeholders: 'Sarah Chen (CEO), Marcus Johnson (VP Marketing)',
        keyRisks: 'Low - established audience',
        integrationNeeds: 'LinkedIn, Email',
      },
      {
        userId: DEMO_USER_ID,
        name: 'HITL Email Nurture Campaign',
        goal: 'Conversion',
        primaryPersona: 'Marketing Directors',
        secondaryPersona: 'Demand Gen Managers',
        campaignPillar: 'Product Education',
        startDate: '2025-11-15',
        endDate: '2026-01-15',
        estimatedBudget: '15000',
        objectives: 'Nurture 500 leads, drive 50 demo requests',
        keyMessage: 'Stackwise puts humans at the center of marketing intelligence',
        successMetrics: 'Open Rate, CTR, Demo Requests, Pipeline Generated',
        stakeholders: 'Marcus Johnson',
        keyRisks: 'Medium - new messaging framework',
        integrationNeeds: 'Email, Website',
      },
      {
        userId: DEMO_USER_ID,
        name: 'Holiday Webinar Series',
        goal: 'Awareness',
        primaryPersona: 'B2B Marketers',
        secondaryPersona: 'Marketing Operations',
        campaignPillar: 'Community Building',
        startDate: '2025-12-01',
        endDate: '2025-12-20',
        estimatedBudget: '12000',
        objectives: '300 registrations, 150 attendees, build community engagement',
        keyMessage: 'Learn from marketing leaders navigating AI transformation',
        successMetrics: 'Registrations, Attendance, Post-event Engagement',
        stakeholders: 'Marcus Johnson, Sarah Chen',
        keyRisks: 'Medium - holiday timing',
        integrationNeeds: 'Zoom, Email, LinkedIn',
      },
      {
        userId: DEMO_USER_ID,
        name: 'Product Launch Campaign',
        goal: 'Conversion',
        primaryPersona: 'Marketing Directors',
        secondaryPersona: 'Product Marketers',
        campaignPillar: 'Product Innovation',
        startDate: '2025-11-20',
        endDate: '2026-01-20',
        estimatedBudget: '35000',
        objectives: 'Drive 100 product sign-ups, generate buzz in marketing community',
        keyMessage: 'Stackwise 2.0 - The future of marketing intelligence is here',
        successMetrics: 'Sign-ups, Social Mentions, Press Coverage, Demo Requests',
        stakeholders: 'Lisa Park (CMO), Sarah Chen (CEO)',
        keyRisks: 'High - competitive market',
        integrationNeeds: 'LinkedIn, Twitter, Email, Website',
      },
      {
        userId: DEMO_USER_ID,
        name: 'Customer Success Stories',
        goal: 'Nurture',
        primaryPersona: 'Enterprise CMOs',
        secondaryPersona: 'VP Marketing',
        campaignPillar: 'Social Proof',
        startDate: '2025-11-10',
        endDate: '2025-12-15',
        estimatedBudget: '18000',
        objectives: 'Publish 5 case studies, drive 1000 page views',
        keyMessage: 'See how leading brands achieve ROI with Stackwise',
        successMetrics: 'Case Study Downloads, Page Views, Share Rate',
        stakeholders: 'Marcus Johnson',
        keyRisks: 'Low - existing customer relationships',
        integrationNeeds: 'Website, LinkedIn, Email',
      },
      {
        userId: DEMO_USER_ID,
        name: 'Paid Search Campaign',
        goal: 'Conversion',
        primaryPersona: 'Demand Gen Managers',
        secondaryPersona: 'Marketing Directors',
        campaignPillar: 'Performance Marketing',
        startDate: '2025-11-05',
        endDate: '2026-01-05',
        estimatedBudget: '40000',
        objectives: 'Generate 200 MQLs, 50 SQLs, $500k pipeline',
        keyMessage: 'Transform your marketing with AI-powered intelligence',
        successMetrics: 'CTR, Conversion Rate, Cost per Lead, Pipeline',
        stakeholders: 'Marcus Johnson',
        keyRisks: 'Medium - CPC volatility',
        integrationNeeds: 'Google Ads, LinkedIn Ads, Landing Pages',
      },
      {
        userId: DEMO_USER_ID,
        name: 'Brand Awareness Campaign',
        goal: 'Awareness',
        primaryPersona: 'B2B Marketers',
        secondaryPersona: 'Marketing Leaders',
        campaignPillar: 'Brand Building',
        startDate: '2025-12-01',
        endDate: '2026-02-28',
        estimatedBudget: '50000',
        objectives: 'Increase brand awareness by 30%, reach 500k impressions',
        keyMessage: 'Stackwise - Marketing intelligence that puts humans first',
        successMetrics: 'Impressions, Reach, Brand Lift, Share of Voice',
        stakeholders: 'Lisa Park (CMO)',
        keyRisks: 'Medium - long campaign duration',
        integrationNeeds: 'Display Ads, Social Media, Content Syndication',
      },
      {
        userId: DEMO_USER_ID,
        name: 'Partner Co-Marketing',
        goal: 'Awareness',
        primaryPersona: 'Enterprise Buyers',
        secondaryPersona: 'Technology Leaders',
        campaignPillar: 'Strategic Partnerships',
        startDate: '2025-11-15',
        endDate: '2025-12-31',
        estimatedBudget: '22000',
        objectives: 'Co-host 2 webinars, publish joint content, expand reach by 40%',
        keyMessage: 'Better together - Stackwise + leading martech platforms',
        successMetrics: 'Webinar Attendance, Content Engagement, Partner Leads',
        stakeholders: 'Sarah Chen, Marcus Johnson',
        keyRisks: 'Medium - partner coordination',
        integrationNeeds: 'Zoom, Email, LinkedIn, Partner Platforms',
      },
    ];

    await db.insert(campaigns).values(campaignsData);
    const insertedCampaigns = await db.select().from(campaigns).where(eq(campaigns.userId, DEMO_USER_ID));
    console.log(`✓ Seeded ${campaignsData.length} campaigns`);

    // Seed campaign channel placements
    const placementsData = [
      // Q4 LinkedIn Campaign
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[0].id, channelName: 'LinkedIn', channelType: 'Social Post', spend: '8000', assetCount: 4 },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[0].id, channelName: 'Email', channelType: 'Newsletter', spend: '5000', assetCount: 2 },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[0].id, channelName: 'LinkedIn', channelType: 'Sponsored Content', spend: '12000', assetCount: 3 },
      
      // HITL Email Campaign
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[1].id, channelName: 'Email', channelType: 'Drip Campaign', spend: '10000', assetCount: 4 },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[1].id, channelName: 'Landing Page', channelType: 'Conversion Page', spend: '3000', assetCount: 1 },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[1].id, channelName: 'LinkedIn', channelType: 'Retargeting', spend: '2000', assetCount: 2 },
      
      // Webinar Campaign
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[2].id, channelName: 'Email', channelType: 'Event Promotion', spend: '4000', assetCount: 3 },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[2].id, channelName: 'LinkedIn', channelType: 'Event Post', spend: '5000', assetCount: 2 },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[2].id, channelName: 'Website', channelType: 'Landing Page', spend: '3000', assetCount: 1 },
    ];

    await db.insert(campaignChannelPlacements).values(placementsData);
    console.log(`✓ Seeded ${placementsData.length} channel placements`);

    // Seed campaign creative
    const creativeData = [
      // Q4 LinkedIn Campaign
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[0].id, channelName: 'LinkedIn', creativeType: 'Social Post', headline: 'The AI Marketing Revolution Needs Humans', bodyContent: 'AI promises efficiency, but the best results come from human-AI collaboration...', ctaLink: 'https://stackwise.com/blog/hitl-ai', assetLink: '' },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[0].id, channelName: 'Email', creativeType: 'Newsletter', headline: 'Your Monthly Marketing Intelligence Brief', bodyContent: 'Insights on AI-powered marketing from the Stackwise team...', ctaLink: 'https://stackwise.com/newsletter', assetLink: '' },
      
      // HITL Email Campaign  
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[1].id, channelName: 'Email', creativeType: 'Email Series', headline: 'Discover Human-in-the-Loop Marketing', bodyContent: 'Welcome to the future of marketing intelligence...', ctaLink: 'https://stackwise.com/demo', assetLink: '' },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[1].id, channelName: 'Landing Page', creativeType: 'Landing Page', headline: 'Request Your Stackwise Demo', bodyContent: 'See how leading marketers use HITL to make better decisions...', ctaLink: '', assetLink: '' },
      
      // Webinar Campaign
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[2].id, channelName: 'Email', creativeType: 'Event Invitation', headline: 'Join Our Holiday Marketing Webinar', bodyContent: 'Learn from CMOs navigating AI transformation...', ctaLink: 'https://stackwise.com/webinar', assetLink: '' },
      { userId: DEMO_USER_ID, campaignId: insertedCampaigns[2].id, channelName: 'LinkedIn', creativeType: 'Event Announcement', headline: '🎄 Holiday Webinar: AI & Marketing in 2026', bodyContent: 'Join top marketing leaders for insights on AI transformation...', ctaLink: 'https://stackwise.com/webinar', assetLink: '' },
    ];

    await db.insert(campaignCreative).values(creativeData);
    console.log(`✓ Seeded ${creativeData.length} creative assets`);

    // Get the inserted channel placements for distribution cards
    const insertedPlacements = await db.select().from(campaignChannelPlacements);

    // Seed distribution cards
    const distributionCardsData = [
      // Launched campaigns
      {
        userId: DEMO_USER_ID,
        sourceType: 'campaign',
        sourceCampaignId: insertedCampaigns[0].id,
        channelPlacementId: insertedPlacements[0].id,
        campaignName: 'Q4 LinkedIn Thought Leadership',
        channelName: 'LinkedIn',
        channelType: 'Social Post',
        contentName: 'The AI Marketing Revolution Needs Humans',
        contentType: 'Article',
        goal: 'Awareness',
        primaryPersona: 'Enterprise CMOs',
        pillar: 'AI & Marketing Strategy',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        defaultStartDate: '2025-11-01',
        headline: 'The AI Marketing Revolution Needs Humans',
        bodyContent: 'AI promises efficiency, but the best results come from human-AI collaboration...',
        ctaText: 'Read More',
        ctaLink: 'https://stackwise.com/blog/hitl-ai',
        assetCount: 4,
        estimatedSpend: 8000,
        allocatedBudget: 25000,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'in_flight',
      },
      {
        userId: DEMO_USER_ID,
        sourceType: 'campaign',
        sourceCampaignId: insertedCampaigns[0].id,
        channelPlacementId: insertedPlacements[2].id,
        campaignName: 'Q4 LinkedIn Thought Leadership',
        channelName: 'LinkedIn',
        channelType: 'Sponsored Content',
        contentName: 'LinkedIn Sponsored Post Series',
        contentType: 'Sponsored Content',
        goal: 'Awareness',
        primaryPersona: 'Enterprise CMOs',
        pillar: 'AI & Marketing Strategy',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        defaultStartDate: '2025-11-05',
        headline: 'Transform Your Marketing with HITL AI',
        bodyContent: 'Discover how human-in-the-loop AI helps marketers make better decisions...',
        ctaText: 'Learn More',
        ctaLink: 'https://stackwise.com',
        assetCount: 3,
        estimatedSpend: 12000,
        allocatedBudget: 25000,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'in_flight',
      },
      
      // Ready to launch
      {
        userId: DEMO_USER_ID,
        sourceType: 'campaign',
        sourceCampaignId: insertedCampaigns[1].id,
        channelPlacementId: insertedPlacements[3].id,
        campaignName: 'HITL Email Nurture Campaign',
        channelName: 'Email',
        channelType: 'Drip Campaign',
        contentName: 'Discover Human-in-the-Loop Marketing',
        contentType: 'Email Series',
        goal: 'Conversion',
        primaryPersona: 'Marketing Directors',
        pillar: 'Product Education',
        startDate: '2025-11-15',
        endDate: '2026-01-15',
        defaultStartDate: '2025-11-15',
        headline: 'Discover Human-in-the-Loop Marketing',
        bodyContent: 'Welcome to the future of marketing intelligence...',
        ctaText: 'Request Demo',
        ctaLink: 'https://stackwise.com/demo',
        assetCount: 4,
        estimatedSpend: 10000,
        allocatedBudget: 15000,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'taxiing',
      },
      {
        userId: DEMO_USER_ID,
        sourceType: 'campaign',
        sourceCampaignId: insertedCampaigns[2].id,
        channelPlacementId: insertedPlacements[6].id,
        campaignName: 'Holiday Webinar Series',
        channelName: 'Email',
        channelType: 'Event Promotion',
        contentName: 'Join Our Holiday Marketing Webinar',
        contentType: 'Event Invitation',
        goal: 'Awareness',
        primaryPersona: 'B2B Marketers',
        pillar: 'Community Building',
        startDate: '2025-12-01',
        endDate: '2025-12-20',
        defaultStartDate: '2025-12-01',
        headline: 'Join Our Holiday Marketing Webinar',
        bodyContent: 'Learn from CMOs navigating AI transformation...',
        ctaText: 'Register Now',
        ctaLink: 'https://stackwise.com/webinar',
        assetCount: 3,
        estimatedSpend: 4000,
        allocatedBudget: 12000,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'taxiing',
      },
      
      // Pending evaluation - needs fixes
      {
        userId: DEMO_USER_ID,
        sourceType: 'campaign',
        sourceCampaignId: insertedCampaigns[1].id,
        channelPlacementId: insertedPlacements[5].id,
        campaignName: 'HITL Email Nurture Campaign',
        channelName: 'LinkedIn',
        channelType: 'Retargeting',
        contentName: 'LinkedIn Retargeting Ads',
        contentType: 'Sponsored Content',
        goal: 'Conversion',
        primaryPersona: 'Marketing Directors',
        pillar: 'Product Education',
        startDate: '2025-11-20',
        defaultStartDate: '2025-11-20',
        headline: '',
        ctaText: '',
        assetCount: 0,
        estimatedSpend: 2000,
        allocatedBudget: 15000,
        missingFields: ['headline', 'ctaText', 'assetCount'],
        evalStatus: 'flagged',
        budgetStatus: 'pending',
        assetStatus: 'pending',
        launchStatus: 'not_launched',
      },
      {
        userId: DEMO_USER_ID,
        sourceType: 'campaign',
        sourceCampaignId: insertedCampaigns[2].id,
        channelPlacementId: insertedPlacements[8].id,
        campaignName: 'Holiday Webinar Series',
        channelName: 'Website',
        channelType: 'Landing Page',
        contentName: 'Webinar Registration Page',
        contentType: 'Landing Page',
        goal: 'Awareness',
        primaryPersona: 'B2B Marketers',
        pillar: 'Community Building',
        startDate: '2025-12-01',
        defaultStartDate: '2025-12-01',
        headline: 'Register for Our Marketing Webinar',
        bodyContent: 'Secure your spot for this exclusive event...',
        ctaText: 'Register',
        ctaLink: 'https://stackwise.com/webinar/register',
        assetCount: 1,
        estimatedSpend: 3000,
        allocatedBudget: 12000,
        evalStatus: 'pending',
        budgetStatus: 'pending',
        assetStatus: 'ready',
        launchStatus: 'not_launched',
      },
      
      // Executive Visibility - part of Q4 LinkedIn campaign
      {
        userId: DEMO_USER_ID,
        sourceType: 'exec_vis',
        sourceCampaignId: insertedCampaigns[0].id, // Linked to Q4 LinkedIn campaign
        sourceExecutiveId: insertedExecutives[0].id,
        sourceExecutiveContentId: insertedExecContent[0].id,
        campaignName: 'CEO Insights Series - Future of Marketing',
        channelName: 'LinkedIn',
        channelType: 'Executive Post',
        contentName: 'Why AI Needs Humans: The Future of Marketing',
        contentType: 'LinkedIn Post',
        goal: 'Awareness',
        primaryPersona: 'Enterprise CMOs',
        pillar: 'AI & Marketing Strategy',
        startDate: '2025-11-05',
        endDate: '2025-11-12',
        defaultStartDate: '2025-11-05',
        headline: 'Why AI Needs Humans: The Future of Marketing',
        bodyContent: 'After 15 years in tech, I\'ve seen countless "revolution" promises. But here\'s what\'s different about AI in marketing: it amplifies human judgment rather than replacing it...',
        ctaText: 'Read More',
        assetCount: 1,
        estimatedSpend: 500,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'in_flight',
      },
      {
        userId: DEMO_USER_ID,
        sourceType: 'exec_vis',
        sourceCampaignId: insertedCampaigns[0].id, // Linked to Q4 LinkedIn campaign
        sourceExecutiveId: insertedExecutives[0].id,
        sourceExecutiveContentId: insertedExecContent[1].id,
        campaignName: 'CEO Insights Series - Trust in AI',
        channelName: 'LinkedIn',
        channelType: 'Executive Post',
        contentName: 'Trust is the New Currency in Marketing',
        contentType: 'LinkedIn Post',
        goal: 'Awareness',
        primaryPersona: 'Enterprise CMOs',
        pillar: 'AI & Marketing Strategy',
        startDate: '2025-11-19',
        endDate: '2025-11-26',
        defaultStartDate: '2025-11-19',
        headline: 'Trust is the New Currency in Marketing',
        bodyContent: 'Customers don\'t trust algorithms. They trust people who use algorithms wisely. Here\'s how we\'re thinking about trust at Stackwise...',
        ctaText: 'Learn More',
        assetCount: 1,
        estimatedSpend: 500,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'in_flight',
      },
      
      // Standalone Executive Visibility (not part of campaign)
      {
        userId: DEMO_USER_ID,
        sourceType: 'exec_vis',
        sourceExecutiveId: insertedExecutives[1].id,
        sourceExecutiveContentId: insertedExecContent[2].id,
        campaignName: 'VP Marketing POV - ROI Metrics',
        channelName: 'LinkedIn',
        channelType: 'Executive Post',
        contentName: 'Stop Measuring Vanity Metrics',
        contentType: 'LinkedIn Post',
        goal: 'Thought Leadership',
        primaryPersona: 'Marketing Directors',
        pillar: 'Marketing Analytics',
        startDate: '2025-12-01',
        endDate: '2025-12-08',
        defaultStartDate: '2025-12-01',
        headline: 'Stop Measuring Vanity Metrics',
        bodyContent: 'Impressions look great in reports, but here\'s what actually drives pipeline: Attribution quality, MQL velocity, Opportunity acceleration...',
        ctaText: 'Read More',
        assetCount: 1,
        estimatedSpend: 300,
        evalStatus: 'approved',
        budgetStatus: 'approved',
        assetStatus: 'ready',
        voiceCheckStatus: 'passed',
        launchStatus: 'scheduled',
      },
    ];

    await db.insert(distributionCards).values(distributionCardsData);
    const insertedCards = await db.select().from(distributionCards).where(eq(distributionCards.userId, DEMO_USER_ID));
    console.log(`✓ Seeded ${distributionCardsData.length} distribution cards`);

    // Seed distribution evals (recommendations & risks)
    const evalsData = [
      // High priority recommendation
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[3].id,
        evalType: 'recommendation',
        severity: 'high',
        category: 'optimization',
        title: 'Increase Email Budget for A/B Testing',
        description: 'Event emails historically perform 25% better with question-based subject lines. A/B testing requires additional sends to reach statistical significance.',
        suggestedFix: 'Increase email budget by $1,500 to enable comprehensive A/B testing across 2,000 additional sends.',
        budgetAdjustment: 1500,
        status: 'pending',
      },
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[2].id,
        evalType: 'recommendation',
        severity: 'medium',
        category: 'budget',
        title: 'Increase LinkedIn Spend for Better Reach',
        description: 'LinkedIn campaigns with budgets under $4k typically underperform. Current allocation: $2.5k.',
        suggestedFix: 'Increase budget to $5,000 to reach minimum effective threshold for B2B audience targeting.',
        budgetAdjustment: 2500,
        status: 'pending',
      },
      
      // Medium risk flag
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[4].id,
        evalType: 'risk',
        severity: 'high',
        category: 'content',
        title: 'Missing Creative Assets',
        description: 'LinkedIn retargeting campaign has 0 approved creative assets. Cannot launch without ad creative.',
        suggestedFix: 'Upload and approve minimum 2 ad variants before proceeding to launch.',
        status: 'pending',
      },
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[4].id,
        evalType: 'risk',
        severity: 'medium',
        category: 'budget',
        title: 'Spend Allocation Mismatch',
        description: 'Retargeting typically requires $5k minimum for meaningful results. Current allocation: $2k.',
        suggestedFix: 'Increase budget to $5k or reallocate to higher-impact channels.',
        budgetAdjustment: 3000,
        status: 'pending',
      },
      
      // Low severity recommendation
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[5].id,
        evalType: 'recommendation',
        severity: 'low',
        category: 'content',
        title: 'Enhance CTA Copy',
        description: 'Generic "Register" CTA could be more compelling. Data shows benefit-driven CTAs perform 15% better.',
        suggestedFix: 'Test "Save My Seat" or "Join 300+ Marketers" as CTA variants.',
        budgetAdjustment: 500,
        status: 'pending',
      },
    ];

    await db.insert(distributionEvals).values(evalsData);
    console.log(`✓ Seeded ${evalsData.length} distribution evals`);

    // Seed distribution launches
    const launchesData = [
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[0].id,
        launchType: 'immediate',
        launchedAt: new Date('2025-11-01'),
        calendarUpdated: true,
        actualSpend: 6420,
        impressions: 42300,
        clicks: 1890,
        conversions: 127,
        notes: 'Strong early performance, exceeding CTR benchmarks by 32%',
      },
      {
        userId: DEMO_USER_ID,
        distributionCardId: insertedCards[1].id,
        launchType: 'immediate',
        launchedAt: new Date('2025-11-05'),
        calendarUpdated: true,
        actualSpend: 9850,
        impressions: 68500,
        clicks: 2740,
        conversions: 186,
        notes: 'Sponsored content performing well in target enterprise segment',
      },
    ];

      await db.insert(distributionLaunches).values(launchesData);
      console.log(`✓ Seeded ${launchesData.length} distribution launches`);
    } else {
      console.log(`⊘ Skipping campaign seeding (campaigns already exist)`);
      
      // Check if distribution cards exist separately
      const existingDistCards = await db.select().from(distributionCards);
      
      if (existingDistCards.length === 0) {
        console.log(`ℹ Creating distribution data for existing campaigns...`);
        
        // Get existing campaigns and executives
        const insertedCampaigns = await db.select().from(campaigns).where(eq(campaigns.userId, DEMO_USER_ID));
        const insertedExecutives = await db.select().from(executives).where(eq(executives.userId, DEMO_USER_ID));
        
        if (insertedCampaigns.length > 0) {
          // Get the inserted channel placements for distribution cards
          const insertedPlacements = await db.select().from(campaignChannelPlacements);
          
          // Seed distribution cards using existing campaign data
          const distributionCardsData = [
            // Launched campaigns
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[0]?.id || null,
              campaignName: 'Q4 LinkedIn Thought Leadership',
              channelName: 'LinkedIn',
              channelType: 'Social Post',
              contentName: 'The AI Marketing Revolution Needs Humans',
              contentType: 'Article',
              goal: 'Awareness',
              primaryPersona: 'Enterprise CMOs',
              pillar: 'AI & Marketing Strategy',
              startDate: '2025-11-01',
              endDate: '2025-12-31',
              defaultStartDate: '2025-11-01',
              headline: 'The AI Marketing Revolution Needs Humans',
              bodyContent: 'AI promises efficiency, but the best results come from human-AI collaboration...',
              ctaText: 'Read More',
              ctaLink: 'https://stackwise.com/blog/hitl-ai',
              assetCount: 4,
              estimatedSpend: 8000,
              allocatedBudget: 25000,
              evalStatus: 'approved',
              budgetStatus: 'approved',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'in_flight',
            },
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[2]?.id || null,
              campaignName: 'Q4 LinkedIn Thought Leadership',
              channelName: 'LinkedIn',
              channelType: 'Sponsored Content',
              contentName: 'LinkedIn Sponsored Post Series',
              contentType: 'Sponsored Content',
              goal: 'Awareness',
              primaryPersona: 'Enterprise CMOs',
              pillar: 'AI & Marketing Strategy',
              startDate: '2025-11-01',
              endDate: '2025-12-31',
              defaultStartDate: '2025-11-05',
              headline: 'Transform Your Marketing with HITL AI',
              bodyContent: 'Discover how human-in-the-loop AI helps marketers make better decisions...',
              ctaText: 'Learn More',
              ctaLink: 'https://stackwise.com',
              assetCount: 3,
              estimatedSpend: 12000,
              allocatedBudget: 25000,
              evalStatus: 'approved',
              budgetStatus: 'approved',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'in_flight',
            },
            
            // Ready to launch
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[1]?.id || insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[3]?.id || null,
              campaignName: 'HITL Email Nurture Campaign',
              channelName: 'Email',
              channelType: 'Drip Campaign',
              contentName: 'Discover Human-in-the-Loop Marketing',
              contentType: 'Email Series',
              goal: 'Conversion',
              primaryPersona: 'Marketing Directors',
              pillar: 'Product Education',
              startDate: '2025-11-15',
              endDate: '2026-01-15',
              defaultStartDate: '2025-11-15',
              headline: 'Discover Human-in-the-Loop Marketing',
              bodyContent: 'Welcome to the future of marketing intelligence...',
              ctaText: 'Request Demo',
              ctaLink: 'https://stackwise.com/demo',
              assetCount: 4,
              estimatedSpend: 10000,
              allocatedBudget: 15000,
              evalStatus: 'approved',
              budgetStatus: 'approved',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'taxiing',
            },
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[2]?.id || insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[6]?.id || null,
              campaignName: 'Holiday Webinar Series',
              channelName: 'Email',
              channelType: 'Event Promotion',
              contentName: 'Join Our Holiday Marketing Webinar',
              contentType: 'Event Invitation',
              goal: 'Awareness',
              primaryPersona: 'B2B Marketers',
              pillar: 'Community Building',
              startDate: '2025-12-01',
              endDate: '2025-12-20',
              defaultStartDate: '2025-12-01',
              headline: 'Join Our Holiday Marketing Webinar',
              bodyContent: 'Learn from CMOs navigating AI transformation...',
              ctaText: 'Register Now',
              ctaLink: 'https://stackwise.com/webinar',
              assetCount: 3,
              estimatedSpend: 4000,
              allocatedBudget: 12000,
              evalStatus: 'approved',
              budgetStatus: 'approved',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'taxiing',
            },
            
            // Pending evaluation - needs fixes
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[1]?.id || insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[5]?.id || null,
              campaignName: 'HITL Email Nurture Campaign',
              channelName: 'LinkedIn',
              channelType: 'Retargeting',
              contentName: 'LinkedIn Retargeting Ads',
              contentType: 'Sponsored Content',
              goal: 'Conversion',
              primaryPersona: 'Marketing Directors',
              pillar: 'Product Education',
              startDate: '2025-11-20',
              defaultStartDate: '2025-11-20',
              headline: '',
              ctaText: '',
              assetCount: 0,
              estimatedSpend: 2000,
              allocatedBudget: 15000,
              missingFields: ['headline', 'ctaText', 'assetCount'],
              evalStatus: 'flagged',
              budgetStatus: 'pending',
              assetStatus: 'pending',
              launchStatus: 'not_launched',
            },
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[2]?.id || insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[8]?.id || null,
              campaignName: 'Holiday Webinar Series',
              channelName: 'Website',
              channelType: 'Landing Page',
              contentName: 'Webinar Registration Page',
              contentType: 'Landing Page',
              goal: 'Awareness',
              primaryPersona: 'B2B Marketers',
              pillar: 'Community Building',
              startDate: '2025-12-01',
              defaultStartDate: '2025-12-01',
              headline: 'Register for Our Marketing Webinar',
              bodyContent: 'Secure your spot for this exclusive event...',
              ctaText: 'Register',
              ctaLink: 'https://stackwise.com/webinar/register',
              assetCount: 1,
              estimatedSpend: 3000,
              allocatedBudget: 12000,
              evalStatus: 'pending',
              budgetStatus: 'pending',
              assetStatus: 'ready',
              launchStatus: 'not_launched',
            },
            
            // Twitter/X Campaign - Budget issue flagged
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[1]?.id || null,
              campaignName: 'Q4 LinkedIn Thought Leadership',
              channelName: 'X (Twitter)',
              channelType: 'Promoted Posts',
              contentName: 'Twitter Thought Leadership Thread',
              contentType: 'Social Post',
              goal: 'Awareness',
              primaryPersona: 'Enterprise CMOs',
              pillar: 'AI & Marketing Strategy',
              startDate: '2025-11-22',
              defaultStartDate: '2025-11-22',
              headline: 'Why HITL AI is transforming B2B marketing',
              bodyContent: 'Thread: 1/5 Traditional marketing automation falls short...',
              ctaText: 'Learn More',
              ctaLink: 'https://stackwise.com/hitl',
              assetCount: 5,
              estimatedSpend: 2800,
              allocatedBudget: 8000,
              evalStatus: 'flagged',
              budgetStatus: 'flagged',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'not_launched',
            },
            
            // Google Ads - High risk, low budget
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[1]?.id || insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[4]?.id || null,
              campaignName: 'HITL Email Nurture Campaign',
              channelName: 'Google Ads',
              channelType: 'Search Ads',
              contentName: 'Marketing Intelligence SEM Campaign',
              contentType: 'Search Ads',
              goal: 'Conversion',
              primaryPersona: 'Marketing Directors',
              pillar: 'Product Education',
              startDate: '2025-11-25',
              defaultStartDate: '2025-11-25',
              headline: 'AI-Powered Marketing Intelligence | Stackwise',
              bodyContent: 'Make better marketing decisions with HITL AI. Try Stackwise free for 14 days.',
              ctaText: 'Start Free Trial',
              ctaLink: 'https://stackwise.com/trial',
              assetCount: 3,
              estimatedSpend: 1500,
              allocatedBudget: 6000,
              evalStatus: 'flagged',
              budgetStatus: 'flagged',
              assetStatus: 'ready',
              launchStatus: 'not_launched',
            },
            
            // Instagram - Approved and ready
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[2]?.id || insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[7]?.id || null,
              campaignName: 'Holiday Webinar Series',
              channelName: 'Instagram',
              channelType: 'Sponsored Posts',
              contentName: 'Holiday Webinar Promotion',
              contentType: 'Social Post',
              goal: 'Awareness',
              primaryPersona: 'B2B Marketers',
              pillar: 'Community Building',
              startDate: '2025-11-28',
              defaultStartDate: '2025-11-28',
              headline: 'Join 300+ marketers at our holiday webinar',
              bodyContent: 'Learn AI strategies from top CMOs. Register now!',
              ctaText: 'Save My Spot',
              ctaLink: 'https://stackwise.com/webinar',
              assetCount: 6,
              estimatedSpend: 5500,
              allocatedBudget: 10000,
              evalStatus: 'approved',
              budgetStatus: 'approved',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'taxiing',
            },
            
            // Facebook Ads - Missing content
            {
              userId: DEMO_USER_ID,
              sourceType: 'campaign',
              sourceCampaignId: insertedCampaigns[0].id,
              channelPlacementId: insertedPlacements[9]?.id || null,
              campaignName: 'Q4 LinkedIn Thought Leadership',
              channelName: 'Facebook',
              channelType: 'Sponsored Posts',
              contentName: '',
              contentType: 'Social Post',
              goal: 'Awareness',
              primaryPersona: 'Enterprise CMOs',
              pillar: 'AI & Marketing Strategy',
              startDate: '2025-12-05',
              defaultStartDate: '2025-12-05',
              headline: '',
              bodyContent: '',
              ctaText: '',
              ctaLink: '',
              assetCount: 0,
              estimatedSpend: 0,
              allocatedBudget: 8000,
              missingFields: ['contentName', 'headline', 'bodyContent', 'ctaText', 'ctaLink', 'estimatedSpend', 'assetCount'],
              evalStatus: 'flagged',
              budgetStatus: 'pending',
              assetStatus: 'pending',
              launchStatus: 'not_launched',
            },
            
            // YouTube - Budget approved, ready to launch
            {
              userId: DEMO_USER_ID,
              sourceType: 'executive',
              sourceExecutiveId: insertedExecutives[0]?.id || null,
              channelPlacementId: null,
              campaignName: 'Sarah Chen Thought Leadership',
              channelName: 'YouTube',
              channelType: 'Video Ads',
              contentName: 'CMO Insights: AI in Marketing',
              contentType: 'Video',
              goal: 'Awareness',
              primaryPersona: 'Enterprise CMOs',
              pillar: 'AI & Marketing Strategy',
              startDate: '2025-12-10',
              defaultStartDate: '2025-12-10',
              headline: 'The Future of Marketing Intelligence',
              bodyContent: '3-minute video featuring CEO Sarah Chen discussing HITL AI transformation',
              ctaText: 'Watch Now',
              ctaLink: 'https://youtube.com/stackwise',
              assetCount: 1,
              estimatedSpend: 8000,
              allocatedBudget: 15000,
              evalStatus: 'approved',
              budgetStatus: 'approved',
              assetStatus: 'ready',
              voiceCheckStatus: 'passed',
              launchStatus: 'taxiing',
            },
          ];

          await db.insert(distributionCards).values(distributionCardsData);
          const insertedCards = await db.select().from(distributionCards).where(eq(distributionCards.userId, DEMO_USER_ID));
          console.log(`✓ Seeded ${distributionCardsData.length} distribution cards`);

          // Seed distribution evals (recommendations & risks)
          const evalsData = [
            // High priority recommendation
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[3]?.id || insertedCards[0].id,
              evalType: 'recommendation',
              severity: 'high',
              category: 'budget',
              title: 'Increase Email Budget for A/B Testing',
              description: 'Event emails historically perform 25% better with question-based subject lines. A/B testing requires additional sends to reach statistical significance.',
              suggestedFix: 'Increase email budget by $1,500 to enable comprehensive A/B testing across 2,000 additional sends.',
              budgetAdjustment: 1500,
              estimatedImpact: '+18% conversion rate',
              confidence: 87,
              status: 'pending',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[2]?.id || insertedCards[0].id,
              evalType: 'recommendation',
              severity: 'medium',
              category: 'budget',
              title: 'Increase LinkedIn Spend for Better Reach',
              description: 'LinkedIn campaigns with budgets under $4k typically underperform. Current allocation: $2.5k.',
              suggestedFix: 'Increase budget to $5,000 to reach minimum effective threshold for B2B audience targeting.',
              budgetAdjustment: 2500,
              estimatedImpact: '+40% reach in target segment',
              confidence: 82,
              status: 'pending',
            },
            
            // Twitter/X Budget Recommendation
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[6]?.id || insertedCards[0].id,
              evalType: 'recommendation',
              severity: 'high',
              category: 'budget',
              title: 'Twitter Budget Below Recommended Threshold',
              description: 'Current budget of $2,800 is below the $4,000 minimum needed for effective promoted post campaigns. Historical data shows campaigns under $4k have 65% lower engagement.',
              suggestedFix: 'Increase budget to $5,200 to achieve minimum effective scale and reach decision-makers.',
              budgetAdjustment: 2400,
              estimatedImpact: '+55% engagement rate',
              confidence: 79,
              status: 'pending',
            },
            
            // Google Ads Critical Risk
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[7]?.id || insertedCards[0].id,
              evalType: 'risk',
              severity: 'high',
              category: 'budget',
              title: 'Google Ads Budget Critically Low',
              description: 'Search ads require minimum $3,500/month for B2B SaaS in this competitive space. Current allocation of $1,500 will result in limited impressions and poor ad position.',
              suggestedFix: 'Increase budget to $5,000 or consider pausing until adequate budget is available.',
              budgetAdjustment: 3500,
              estimatedImpact: 'Avoid wasted spend on low-position ads',
              confidence: 91,
              status: 'pending',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[7]?.id || insertedCards[0].id,
              evalType: 'risk',
              severity: 'medium',
              category: 'timing',
              title: 'Launch Timing Suboptimal',
              description: 'Launching Google Ads on Nov 25 (day before Thanksgiving) will result in 40% lower click-through rates due to holiday impact.',
              suggestedFix: 'Delay launch to Dec 2 to avoid holiday traffic decline.',
              estimatedImpact: 'Avoid -40% CTR during holidays',
              confidence: 85,
              status: 'pending',
            },
            
            // LinkedIn Retargeting Risk
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[4]?.id || insertedCards[0].id,
              evalType: 'risk',
              severity: 'high',
              category: 'content',
              title: 'Missing Creative Assets',
              description: 'LinkedIn retargeting campaign has 0 approved creative assets. Cannot launch without ad creative.',
              suggestedFix: 'Upload and approve minimum 2 ad variants before proceeding to launch.',
              estimatedImpact: 'Blocker - cannot launch',
              confidence: 100,
              status: 'pending',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[4]?.id || insertedCards[0].id,
              evalType: 'risk',
              severity: 'medium',
              category: 'budget',
              title: 'Spend Allocation Mismatch',
              description: 'Retargeting typically requires $5k minimum for meaningful results. Current allocation: $2k.',
              suggestedFix: 'Increase budget to $5k or reallocate to higher-impact channels.',
              budgetAdjustment: 3000,
              estimatedImpact: 'Insufficient scale for retargeting',
              confidence: 78,
              status: 'pending',
            },
            
            // Facebook Missing Content Risk
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[9]?.id || insertedCards[0].id,
              evalType: 'risk',
              severity: 'high',
              category: 'content',
              title: 'Critical Fields Missing',
              description: 'Facebook campaign is missing all required content: headline, body, CTA text, CTA link, and creative assets. This is a launch blocker.',
              suggestedFix: 'Complete all required fields in the Edit Details dialog before proceeding to Final Check.',
              estimatedImpact: 'Blocker - cannot launch',
              confidence: 100,
              status: 'pending',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[9]?.id || insertedCards[0].id,
              evalType: 'risk',
              severity: 'medium',
              category: 'budget',
              title: 'No Spend Estimate Provided',
              description: 'Campaign has $0 estimated spend with $8,000 allocated budget. Need spend estimate for proper budget tracking.',
              suggestedFix: 'Provide estimated spend based on campaign objectives and audience size.',
              estimatedImpact: 'Budget tracking inaccuracy',
              confidence: 95,
              status: 'pending',
            },
            
            // Website Landing Page Recommendation
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[5]?.id || insertedCards[0].id,
              evalType: 'recommendation',
              severity: 'low',
              category: 'content',
              title: 'Enhance CTA Copy',
              description: 'Generic "Register" CTA could be more compelling. Data shows benefit-driven CTAs perform 15% better.',
              suggestedFix: 'Test "Save My Seat" or "Join 300+ Marketers" as CTA variants.',
              budgetAdjustment: 500,
              estimatedImpact: '+15% conversion rate',
              confidence: 72,
              status: 'pending',
            },
            
            // Instagram Optimization Recommendation
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[8]?.id || insertedCards[0].id,
              evalType: 'recommendation',
              severity: 'medium',
              category: 'budget',
              title: 'Optimize Instagram Ad Spend',
              description: 'Current $5,500 budget is solid, but increasing to $7,000 would unlock carousel ad formats and broader targeting options.',
              suggestedFix: 'Increase budget by $1,500 to enable advanced Instagram ad formats and reach.',
              budgetAdjustment: 1500,
              estimatedImpact: '+25% reach with carousel ads',
              confidence: 76,
              status: 'pending',
            },
            
            // YouTube Video Recommendation
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[10]?.id || insertedCards[0].id,
              evalType: 'recommendation',
              severity: 'low',
              category: 'timing',
              title: 'Consider Holiday Timing',
              description: 'YouTube video ads during Dec 10-20 benefit from increased engagement as viewers research year-end purchases.',
              suggestedFix: 'Current timing is optimal. No changes needed.',
              estimatedImpact: '+12% view-through rate',
              confidence: 68,
              status: 'pending',
            },
          ];

          await db.insert(distributionEvals).values(evalsData);
          console.log(`✓ Seeded ${evalsData.length} distribution evals`);

          // Seed distribution launches
          const launchesData = [
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[0].id,
              launchType: 'immediate',
              status: 'live',
              launchedAt: new Date('2025-11-01'),
              calendarUpdated: true,
              actualSpend: 6420,
              impressions: 42300,
              clicks: 1890,
              conversions: 127,
              notes: 'Strong early performance, exceeding CTR benchmarks by 32%',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[1].id,
              launchType: 'immediate',
              status: 'live',
              launchedAt: new Date('2025-11-05'),
              calendarUpdated: true,
              actualSpend: 9850,
              impressions: 68500,
              clicks: 2740,
              conversions: 186,
              notes: 'Sponsored content performing well in target enterprise segment',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[8]?.id || insertedCards[0].id,
              launchType: 'scheduled',
              status: 'live',
              launchedAt: new Date('2025-11-06'),
              scheduledFor: new Date('2025-11-28'),
              calendarUpdated: true,
              actualSpend: 3250,
              impressions: 28400,
              clicks: 1140,
              conversions: 68,
              notes: 'Instagram sponsored posts generating strong visual engagement',
            },
            {
              userId: DEMO_USER_ID,
              distributionCardId: insertedCards[10]?.id || insertedCards[0].id,
              launchType: 'scheduled',
              status: 'live',
              launchedAt: new Date('2025-11-07'),
              scheduledFor: new Date('2025-12-10'),
              calendarUpdated: true,
              actualSpend: 5200,
              impressions: 94600,
              clicks: 3780,
              conversions: 203,
              notes: 'YouTube video ads showing excellent view-through rates with executive content',
            },
          ];

          await db.insert(distributionLaunches).values(launchesData);
          console.log(`✓ Seeded ${launchesData.length} distribution launches`);
        }
      } else {
        console.log(`⊘ Skipping distribution cards and evals (already exist)`);
        
        // Check if launches exist separately
        const existingLaunches = await db.select().from(distributionLaunches);
        
        if (existingLaunches.length === 0) {
          console.log(`ℹ Creating distribution launches for existing cards...`);
          
          // Get existing distribution cards
          const insertedCards = await db.select().from(distributionCards).where(eq(distributionCards.userId, DEMO_USER_ID));
          
          if (insertedCards.length >= 2) {
            // Seed distribution launches for the first two cards
            const launchesData = [
              {
                userId: DEMO_USER_ID,
                distributionCardId: insertedCards[0].id,
                launchType: 'immediate',
                status: 'live',
                launchedAt: new Date('2025-11-01'),
                calendarUpdated: true,
                actualSpend: 6420,
                impressions: 42300,
                clicks: 1890,
                conversions: 127,
                notes: 'Strong early performance, exceeding CTR benchmarks by 32%',
              },
              {
                userId: DEMO_USER_ID,
                distributionCardId: insertedCards[1].id,
                launchType: 'immediate',
                status: 'live',
                launchedAt: new Date('2025-11-05'),
                calendarUpdated: true,
                actualSpend: 9850,
                impressions: 68500,
                clicks: 2740,
                conversions: 186,
                notes: 'Sponsored content performing well in target enterprise segment',
              },
            ];

            await db.insert(distributionLaunches).values(launchesData);
            console.log(`✓ Seeded ${launchesData.length} distribution launches`);
          }
        } else {
          console.log(`⊘ Skipping distribution launches (already exist)`);
        }
      }
    }

    // Seed Assets for Asset Management
    const existingAssets = await db.select().from(assets).where(eq(assets.userId, DEMO_USER_ID));
    if (existingAssets.length === 0) {
      const assetsData = [
        {
          userId: DEMO_USER_ID,
          name: 'Q4 Budget Report 2025',
          description: 'Comprehensive quarterly budget analysis and forecasting for Q4',
          reportType: 'Budget',
          assetStatus: 'active',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/q4-budget-2025.pdf',
          fileName: 'q4-budget-2025.pdf',
          fileType: 'application/pdf',
          fileSize: 2450000,
          thumbnailUrl: null,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Brand Awareness Campaign - CFO Persona',
          description: 'Display ads and content targeting CFO audience for brand awareness',
          campaignName: 'CFO Brand Awareness Sprint',
          campaignPersona: ['CFO'],
          campaignStage: ['Awareness'],
          campaignGoal: ['Brand Awareness'],
          contentType: ['Display Ad', 'Blog'],
          contentChannel: ['LinkedIn'],
          execName: null,
          assetStatus: 'active',
          fileUrl: 'https://example.com/assets/cfo-brand-campaign.zip',
          fileName: 'cfo-brand-campaign.zip',
          fileType: 'application/zip',
          fileSize: 8900000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Sarah Executive LinkedIn Post Series',
          description: 'Thought leadership content series for Sarah on P1 strategic themes',
          execName: ['Sarah'],
          execPillar: 'P1',
          contentType: ['Blog'],
          contentChannel: ['LinkedIn'],
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          assetStatus: 'active',
          fileUrl: 'https://example.com/assets/sarah-linkedin-series.pdf',
          fileName: 'sarah-linkedin-series.pdf',
          fileType: 'application/pdf',
          fileSize: 1200000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Annual Strategy Review Template',
          description: 'Reusable template for annual strategic planning review sessions',
          reportType: 'Reviews',
          reportSubType: 'Annual',
          module: 'Strategy Studio',
          assetStatus: 'active',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/strategy-review-template.pdf',
          fileName: 'strategy-review-template.pdf',
          fileType: 'application/pdf',
          fileSize: 890000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Lead Gen Email Campaign Assets',
          description: 'Email templates and graphics for lead generation campaign',
          campaignName: 'Enterprise Lead Gen 2025',
          campaignGoal: ['Lead Gen'],
          campaignStage: ['Conversion'],
          campaignPersona: ['CFO', 'CMO'],
          contentType: ['Email'],
          contentChannel: ['LinkedIn', 'Programmatic'],
          execName: null,
          assetStatus: 'active',
          fileUrl: 'https://example.com/assets/lead-gen-emails.zip',
          fileName: 'lead-gen-emails.zip',
          fileType: 'application/zip',
          fileSize: 3400000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Manifesto Package Draft',
          description: 'Draft version of company manifesto and positioning package',
          reportType: 'Packages',
          reportSubType: 'Manifesto',
          assetStatus: 'draft',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/manifesto-draft.pdf',
          fileName: 'manifesto-draft.pdf',
          fileType: 'application/pdf',
          fileSize: 1560000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Instagram Campaign Graphics',
          description: 'Social media graphics for Instagram brand awareness campaign',
          campaignName: 'Social Awareness Q4',
          campaignGoal: ['Brand Awareness'],
          campaignStage: ['Awareness'],
          campaignPersona: null,
          contentType: ['Display Ad'],
          contentChannel: ['Instagram'],
          execName: null,
          assetStatus: 'active',
          fileUrl: 'https://example.com/assets/instagram-graphics.zip',
          fileName: 'instagram-graphics.zip',
          fileType: 'application/zip',
          fileSize: 12300000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Pulse Hub Analytics Dashboard',
          description: 'Performance analytics dashboard templates for Pulse Hub module',
          module: 'Pulse HubSpot',
          assetStatus: 'active',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/pulse-dashboard.pdf',
          fileName: 'pulse-dashboard.pdf',
          fileType: 'application/pdf',
          fileSize: 2100000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Jen Executive Video Content',
          description: 'Recorded video content from Jen for P2 pillar thought leadership',
          execName: ['Jen'],
          execPillar: 'P2',
          contentType: ['Blog', 'Email'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          assetStatus: 'active',
          fileUrl: 'https://example.com/assets/jen-video-p2.mp4',
          fileName: 'jen-video-p2.mp4',
          fileType: 'video/mp4',
          fileSize: 45600000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Flight Deck Campaign Builder Guide',
          description: 'Comprehensive guide for using Flight Deck campaign builder features',
          module: 'Flight Deck',
          assetStatus: 'active',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/flight-deck-guide.pdf',
          fileName: 'flight-deck-guide.pdf',
          fileType: 'application/pdf',
          fileSize: 3200000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'CMO Conversion Campaign Package',
          description: 'Complete campaign package targeting CMO persona for conversion stage',
          campaignName: 'CMO Conversion Sprint',
          campaignPersona: ['CMO'],
          campaignStage: ['Conversion'],
          campaignGoal: ['Lead Gen'],
          contentType: ['Display Ad', 'Email', 'Blog'],
          contentChannel: ['LinkedIn', 'Programmatic'],
          execName: null,
          assetStatus: 'active',
          fileUrl: 'https://example.com/assets/cmo-conversion.zip',
          fileName: 'cmo-conversion.zip',
          fileType: 'application/zip',
          fileSize: 15700000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Brand Craft Content Templates',
          description: 'Standardized content templates for Brand Craft module workflows',
          module: 'Brand Craft',
          assetStatus: 'active',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/brand-craft-templates.pdf',
          fileName: 'brand-craft-templates.pdf',
          fileType: 'application/pdf',
          fileSize: 1800000,
        },
        {
          userId: DEMO_USER_ID,
          name: 'Quarterly Strategy Insights',
          description: 'Strategic insights and analysis package for quarterly review',
          reportType: 'Packages',
          reportSubType: 'Insights & Analysis',
          assetStatus: 'archived',
          contentType: ['PDF'],
          contentChannel: null,
          campaignPersona: null,
          campaignStage: null,
          campaignGoal: null,
          execName: null,
          fileUrl: 'https://example.com/assets/q3-insights.pdf',
          fileName: 'q3-insights.pdf',
          fileType: 'application/pdf',
          fileSize: 2900000,
        },
      ];

      await db.insert(assets).values(assetsData);
      console.log(`✓ Seeded ${assetsData.length} assets for Asset Management`);
    } else {
      console.log(`⊘ Skipping assets (already exist)`);
    }

    // Seed Modules, Features, and Reports
    const existingModules = await db.select().from(modules).limit(1);
    if (existingModules.length === 0) {
      // Create Modules
      const modulesData = [
        { name: 'Reports', description: 'Financial and strategic reports', displayOrder: 1 },
        { name: 'BrandCraft', description: 'Brand building and content tools', displayOrder: 2 },
        { name: 'Pulse Hub', description: 'Performance monitoring and analytics', displayOrder: 3 },
        { name: 'Strategy Studio', description: 'Strategic planning and frameworks', displayOrder: 4 },
        { name: 'Flight Deck', description: 'Campaign management and execution', displayOrder: 5 },
      ];
      const createdModules = await db.insert(modules).values(modulesData).returning();
      console.log(`✓ Seeded ${createdModules.length} modules`);

      // Create Features for each module
      const reportsModule = createdModules.find(m => m.name === 'Reports');
      const brandCraftModule = createdModules.find(m => m.name === 'BrandCraft');
      const pulseModule = createdModules.find(m => m.name === 'Pulse Hub');
      const strategyModule = createdModules.find(m => m.name === 'Strategy Studio');
      const flightDeckModule = createdModules.find(m => m.name === 'Flight Deck');

      const featuresData = [
        // Reports features
        { moduleId: reportsModule!.id, name: 'Reviews', description: 'Quarterly and annual reviews', displayOrder: 1, isDynamic: false },
        { moduleId: reportsModule!.id, name: 'Insights & Analysis', description: 'Strategic insights and analysis', displayOrder: 2, isDynamic: true },
        { moduleId: reportsModule!.id, name: 'Budget Reports', description: 'Financial budget tracking', displayOrder: 3, isDynamic: false },
        
        // Strategy Studio features (from actual modules.ts)
        { moduleId: strategyModule!.id, name: 'Onboarding', description: '5-step strategy foundation', displayOrder: 1, isDynamic: false },
        { moduleId: strategyModule!.id, name: 'Stack Navigator', description: 'Evaluation Matrix + 30/60/90 Milestones', displayOrder: 2, isDynamic: false },
        { moduleId: strategyModule!.id, name: 'Quarterly Review & Refresh', description: 'Quarterly performance review', displayOrder: 3, isDynamic: false },
        { moduleId: strategyModule!.id, name: 'Quarterly Strategy Call', description: 'Fully Stacked only', displayOrder: 4, isDynamic: false },
        { moduleId: strategyModule!.id, name: 'Annual Setup', description: 'Annual business goals and planning', displayOrder: 5, isDynamic: false },
        
        // Pulse Hub features (from actual modules.ts)
        { moduleId: pulseModule!.id, name: 'Audit', description: 'Baseline health audit', displayOrder: 1, isDynamic: false },
        { moduleId: pulseModule!.id, name: 'Analytics and Intelligence', description: 'Data insights and AI recommendations', displayOrder: 2, isDynamic: false },
        { moduleId: pulseModule!.id, name: 'Roadmaps & Connections', description: 'Strategic Thread & Impact Horizon', displayOrder: 3, isDynamic: false },
        { moduleId: pulseModule!.id, name: 'ABM Command Center', description: 'Account-based marketing control', displayOrder: 4, isDynamic: false },
        { moduleId: pulseModule!.id, name: 'Competitor Analysis & Benchmarking', description: '5-step competitive intelligence', displayOrder: 5, isDynamic: false },
        { moduleId: pulseModule!.id, name: 'Leadership + Sales Reports', description: '5-step HITL report generation', displayOrder: 6, isDynamic: false },
        { moduleId: pulseModule!.id, name: 'GTM Test Pit', description: 'Model, compare, optimize GTM strategy', displayOrder: 7, isDynamic: false },
        
        // BrandCraft features (from actual modules.ts)
        { moduleId: brandCraftModule!.id, name: 'Messaging House', description: 'Brand positioning and messaging', displayOrder: 1, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Content Strategy', description: '8-step content planning workflow', displayOrder: 2, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Keyword Research', description: '7-step SEO keyword workflow', displayOrder: 3, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Content Creation', description: 'HITL content creation workflow', displayOrder: 4, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Campaign Builder', description: '4-step campaign development', displayOrder: 5, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Content Audit & Gap Analysis', description: 'Brand & Competitors analysis', displayOrder: 6, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Brand Voice Enforcement', description: 'Voice consistency analysis', displayOrder: 7, isDynamic: false },
        { moduleId: brandCraftModule!.id, name: 'Thought Leadership & Executive Visibility', description: 'Executive content programs', displayOrder: 8, isDynamic: false },
        
        // Flight Deck features (from actual modules.ts)
        { moduleId: flightDeckModule!.id, name: 'Content & Campaign Calendar', description: 'Unified calendar system', displayOrder: 1, isDynamic: false },
        { moduleId: flightDeckModule!.id, name: 'Distribution', description: 'Multi-channel deployment', displayOrder: 2, isDynamic: false },
        { moduleId: flightDeckModule!.id, name: 'Budget', description: 'Set in Strategy Studio, managed here', displayOrder: 3, isDynamic: false },
        { moduleId: flightDeckModule!.id, name: 'Asset Management', description: 'Digital asset management', displayOrder: 4, isDynamic: false },
        { moduleId: flightDeckModule!.id, name: 'Collaboration Tools & Workflows', description: 'Team collaboration', displayOrder: 5, isDynamic: false },
        { moduleId: flightDeckModule!.id, name: 'Campaign Insights', description: 'Campaign analytics', displayOrder: 6, isDynamic: false },
        { moduleId: flightDeckModule!.id, name: 'Personalization Engine', description: 'Adaptive intelligence layer', displayOrder: 7, isDynamic: false },
      ];
      const createdFeatures = await db.insert(features).values(featuresData).returning();
      console.log(`✓ Seeded ${createdFeatures.length} features`);

      // Create Reports (Grandchild level - actual reports under features)
      const reviewsFeature = createdFeatures.find(f => f.name === 'Reviews');
      const insightsFeature = createdFeatures.find(f => f.name === 'Insights & Analysis');
      const budgetFeature = createdFeatures.find(f => f.name === 'Budget Reports');

      const reportsData = [
        // Reviews feature reports
        { moduleId: reportsModule!.id, featureId: reviewsFeature!.id, name: 'Quarterly Review', summary: 'Q4 2024 quarterly business review', reportType: 'scheduled', author: 'System', status: 'active' },
        { moduleId: reportsModule!.id, featureId: reviewsFeature!.id, name: 'Annual Review', summary: 'FY 2024 annual performance review', reportType: 'scheduled', author: 'System', status: 'active' },
        { moduleId: reportsModule!.id, featureId: reviewsFeature!.id, name: 'Strategy Call', summary: 'Monthly strategy alignment call notes', reportType: 'adhoc', author: 'System', status: 'active' },
        // Insights & Analysis feature reports (dynamic)
        { moduleId: reportsModule!.id, featureId: insightsFeature!.id, name: 'Manifesto', summary: 'Brand manifesto and positioning document', reportType: 'system-generated', author: 'AI Assistant', status: 'active' },
        { moduleId: reportsModule!.id, featureId: insightsFeature!.id, name: 'Q4 Channel Summary', summary: 'Q4 channel performance summary and insights', reportType: 'system-generated', author: 'AI Assistant', status: 'active' },
        { moduleId: reportsModule!.id, featureId: insightsFeature!.id, name: 'Campaign Effectiveness Overview', summary: 'Campaign ROI and effectiveness analysis', reportType: 'system-generated', author: 'AI Assistant', status: 'active' },
        { moduleId: reportsModule!.id, featureId: insightsFeature!.id, name: 'Audience Trend Report', summary: 'Audience behavior and trend analysis', reportType: 'system-generated', author: 'AI Assistant', status: 'active' },
        { moduleId: reportsModule!.id, featureId: insightsFeature!.id, name: 'Spend Optimization Review', summary: 'Budget spend optimization recommendations', reportType: 'system-generated', author: 'AI Assistant', status: 'active' },
        // Budget feature reports
        { moduleId: reportsModule!.id, featureId: budgetFeature!.id, name: 'Monthly Budget Snapshot', summary: 'Monthly budget utilization snapshot', reportType: 'scheduled', author: 'System', status: 'active' },
        { moduleId: reportsModule!.id, featureId: budgetFeature!.id, name: 'Budget vs Actuals', summary: 'Budget variance analysis', reportType: 'scheduled', author: 'System', status: 'active' },
      ];
      await db.insert(reports).values(reportsData);
      console.log(`✓ Seeded ${reportsData.length} reports`);
    } else {
      console.log(`⊘ Skipping modules, features, and reports (already exist)`);
    }

    // Seed Workflows (Collab & Workflows)
    const existingWorkflows = await db.select().from(workflows).limit(1);
    if (existingWorkflows.length === 0) {
      const workflowsData = [
        // BUDGETING
        {
          name: 'Additional Budget Request Flow',
          description: 'Formalize incremental funding requests',
          category: 'budgeting',
          type: 'short_term',
          coachingPrompt: 'Will this investment directly impact top-line or efficiency?',
          isTemplate: true,
          createdBy: null,
        },
        {
          name: 'Contingency Funds Request Flow',
          description: 'Access backup funds for unexpected needs',
          category: 'budgeting',
          type: 'short_term',
          coachingPrompt: 'What can we learn to prevent this next quarter?',
          isTemplate: true,
          createdBy: null,
        },
        // BUSINESS GOALS
        {
          name: 'GTM Test Pit Sims & Goal Alignment Flow',
          description: 'Align team experiments and goals across GTM motion',
          category: 'business_goals',
          type: 'recurring',
          coachingPrompt: 'Is this test designed to inform action, or just activity? Will this directly impact a business goal?',
          isTemplate: true,
          createdBy: null,
        },
        // OPERATIONS
        {
          name: 'Build Custom Templates Flow',
          description: 'Enable other teams to standardize uploads into Stackwise',
          category: 'operations',
          type: 'short_term',
          coachingPrompt: 'Will this save others clicks and reduce errors?',
          isTemplate: true,
          createdBy: null,
        },
        {
          name: 'Event Checklist Flow',
          description: 'Keep event logistics predictable and visible',
          category: 'operations',
          type: 'short_term',
          coachingPrompt: 'What does success look like beyond attendance?',
          isTemplate: true,
          createdBy: null,
        },
        {
          name: 'Webinar Planning Flow',
          description: 'Streamline pre-through-post webinar steps',
          category: 'operations',
          type: 'short_term',
          coachingPrompt: 'What do you want your audience to do after the webinar?',
          isTemplate: true,
          createdBy: null,
        },
        // CREATIVE
        {
          name: 'Asset Development Intake & Briefing Flow',
          description: 'Gather inputs and brief creative efficiently',
          category: 'creative',
          type: 'short_term',
          coachingPrompt: 'Does this creative clearly express the message and offer?',
          isTemplate: true,
          createdBy: null,
        },
        {
          name: 'Creative QA & Review Checklist Flow',
          description: 'Catch errors before launch and maintain standards',
          category: 'creative',
          type: 'short_term',
          coachingPrompt: 'Would you sign your name to this ad?',
          isTemplate: true,
          createdBy: null,
        },
      ];

      const createdWorkflows = await db.insert(workflows).values(workflowsData).returning();
      console.log(`✓ Seeded ${createdWorkflows.length} workflow templates`);

      // Seed Workflow Tasks
      const tasksData: any[] = [];

      // Additional Budget Request Flow tasks
      const budgetRequestFlow = createdWorkflows.find(w => w.name === 'Additional Budget Request Flow');
      if (budgetRequestFlow) {
        tasksData.push(
          { workflowId: budgetRequestFlow.id, title: 'Identify reason for request (scope expansion, new channel, underfunded initiative)', order: 1, estimatedDuration: 1 },
          { workflowId: budgetRequestFlow.id, title: 'Outline projected ROI or expected lift', order: 2, estimatedDuration: 2 },
          { workflowId: budgetRequestFlow.id, title: 'Attach supporting data or campaign plan', order: 3, estimatedDuration: 1 },
          { workflowId: budgetRequestFlow.id, title: 'Route for approval to Marketing Lead/Finance', order: 4, estimatedDuration: 3, dependsOn: [] },
          { workflowId: budgetRequestFlow.id, title: 'Update approved budget in system', order: 5, estimatedDuration: 1 }
        );
      }

      // Contingency Funds Request Flow tasks
      const contingencyFlow = createdWorkflows.find(w => w.name === 'Contingency Funds Request Flow');
      if (contingencyFlow) {
        tasksData.push(
          { workflowId: contingencyFlow.id, title: 'Document trigger event (delay, cost increase, missed dependency)', order: 1, estimatedDuration: 1 },
          { workflowId: contingencyFlow.id, title: 'Estimate incremental cost and duration', order: 2, estimatedDuration: 1 },
          { workflowId: contingencyFlow.id, title: 'Submit justification with impact if denied', order: 3, estimatedDuration: 1 },
          { workflowId: contingencyFlow.id, title: 'Approval routing + update finance notes', order: 4, estimatedDuration: 2 },
          { workflowId: contingencyFlow.id, title: 'Flag for post-mortem during review', order: 5, estimatedDuration: 1 }
        );
      }

      // GTM Test Pit Sims & Goal Alignment Flow tasks
      const gtmFlow = createdWorkflows.find(w => w.name === 'GTM Test Pit Sims & Goal Alignment Flow');
      if (gtmFlow) {
        tasksData.push(
          { workflowId: gtmFlow.id, title: 'Define test hypothesis (what you\'re proving or improving)', order: 1, estimatedDuration: 2 },
          { workflowId: gtmFlow.id, title: 'Develop 2-3 models for testing', order: 2, estimatedDuration: 3 },
          { workflowId: gtmFlow.id, title: 'Set the KPIs for success', order: 3, estimatedDuration: 1 },
          { workflowId: gtmFlow.id, title: 'Build your models', order: 4, estimatedDuration: 5 },
          { workflowId: gtmFlow.id, title: 'Analyze & Compare', order: 5, estimatedDuration: 3 },
          { workflowId: gtmFlow.id, title: 'Make recommendations, with reasoning and expected impact', order: 6, estimatedDuration: 2 },
          { workflowId: gtmFlow.id, title: 'Review alignment → feed insights into next quarter\'s roadmap', order: 7, estimatedDuration: 2 }
        );
      }

      // Build Custom Templates Flow tasks
      const templatesFlow = createdWorkflows.find(w => w.name === 'Build Custom Templates Flow');
      if (templatesFlow) {
        tasksData.push(
          { workflowId: templatesFlow.id, title: 'Identify common use cases (e.g., content intake, creative briefs)', order: 1, estimatedDuration: 2 },
          { workflowId: templatesFlow.id, title: 'Define required fields and naming conventions per Stackwise features', order: 2, estimatedDuration: 2 },
          { workflowId: templatesFlow.id, title: 'Create and format base template', order: 3, estimatedDuration: 3 },
          { workflowId: templatesFlow.id, title: 'Test template upload and mapping', order: 4, estimatedDuration: 1 },
          { workflowId: templatesFlow.id, title: 'Publish approved version to shared workspace', order: 5, estimatedDuration: 1 },
          { workflowId: templatesFlow.id, title: 'Promote use / refer people to submit', order: 6, estimatedDuration: 1 }
        );
      }

      // Event Checklist Flow tasks
      const eventFlow = createdWorkflows.find(w => w.name === 'Event Checklist Flow');
      if (eventFlow) {
        tasksData.push(
          { workflowId: eventFlow.id, title: 'Confirm event details (date, audience, owner)', order: 1, estimatedDuration: 1 },
          { workflowId: eventFlow.id, title: 'Assign core responsibilities (logistics, content, promotion)', order: 2, estimatedDuration: 1 },
          { workflowId: eventFlow.id, title: 'Track creative deliverables and deadlines', order: 3, estimatedDuration: 5 },
          { workflowId: eventFlow.id, title: 'Confirm budget and contracts', order: 4, estimatedDuration: 2 },
          { workflowId: eventFlow.id, title: 'Post-event review and ROI summary', order: 5, estimatedDuration: 2 }
        );
      }

      // Webinar Planning Flow tasks
      const webinarFlow = createdWorkflows.find(w => w.name === 'Webinar Planning Flow');
      if (webinarFlow) {
        tasksData.push(
          { workflowId: webinarFlow.id, title: 'Define topic, speakers, and target audience', order: 1, estimatedDuration: 2 },
          { workflowId: webinarFlow.id, title: 'Develop abstract and critical learnings', order: 2, estimatedDuration: 2 },
          { workflowId: webinarFlow.id, title: 'Gather speaker bio and headshot', order: 3, estimatedDuration: 1 },
          { workflowId: webinarFlow.id, title: 'Create registration page', order: 4, estimatedDuration: 2 },
          { workflowId: webinarFlow.id, title: 'Create Invites (social, email, Paid ads)', order: 5, estimatedDuration: 3 },
          { workflowId: webinarFlow.id, title: 'Set up Platform logistics', order: 6, estimatedDuration: 1 },
          { workflowId: webinarFlow.id, title: 'Schedule practice/planning session (explain process, house rules, show system)', order: 7, estimatedDuration: 1 },
          { workflowId: webinarFlow.id, title: 'Utilizing polls or other collateral to include in the webinar', order: 8, estimatedDuration: 2 },
          { workflowId: webinarFlow.id, title: 'Gather final slides for use after webinar', order: 9, estimatedDuration: 1 },
          { workflowId: webinarFlow.id, title: 'Schedule / Email Speakers', order: 10, estimatedDuration: 1 },
          { workflowId: webinarFlow.id, title: 'Execute live or recorded session', order: 11, estimatedDuration: 1 },
          { workflowId: webinarFlow.id, title: 'Follow-up email and performance recap', order: 12, estimatedDuration: 2 }
        );
      }

      // Asset Development Intake & Briefing Flow tasks
      const assetIntakeFlow = createdWorkflows.find(w => w.name === 'Asset Development Intake & Briefing Flow');
      if (assetIntakeFlow) {
        tasksData.push(
          { workflowId: assetIntakeFlow.id, title: 'Capture asset type, purpose, and audience', order: 1, estimatedDuration: 1 },
          { workflowId: assetIntakeFlow.id, title: 'Attach reference examples and copy points', order: 2, estimatedDuration: 1 },
          { workflowId: assetIntakeFlow.id, title: 'Assign designer/writer and due date', order: 3, estimatedDuration: 1 },
          { workflowId: assetIntakeFlow.id, title: 'Review draft → feedback loop', order: 4, estimatedDuration: 3 },
          { workflowId: assetIntakeFlow.id, title: 'Final approval and upload to DAM', order: 5, estimatedDuration: 1 }
        );
      }

      // Creative QA & Review Checklist Flow tasks
      const creativeQAFlow = createdWorkflows.find(w => w.name === 'Creative QA & Review Checklist Flow');
      if (creativeQAFlow) {
        tasksData.push(
          { workflowId: creativeQAFlow.id, title: 'Confirm specs (size, format, platform)', order: 1, estimatedDuration: 1 },
          { workflowId: creativeQAFlow.id, title: 'Review copy and design consistency', order: 2, estimatedDuration: 2 },
          { workflowId: creativeQAFlow.id, title: 'Check links, UTM, CTAs, and legal disclaimers', order: 3, estimatedDuration: 1 },
          { workflowId: creativeQAFlow.id, title: 'Peer or lead review sign-off', order: 4, estimatedDuration: 2 },
          { workflowId: creativeQAFlow.id, title: 'Mark approved → push to distribution queue', order: 5, estimatedDuration: 1 }
        );
      }

      await db.insert(workflowTasks).values(tasksData);
      console.log(`✓ Seeded ${tasksData.length} workflow tasks`);
    } else {
      console.log(`⊘ Skipping workflows (already exist)`);
    }

    // ============================================================================
    // PERSONALIZATION ENGINE
    // ============================================================================
    
    const existingAudiences = await db.select().from(audiences).limit(1);
    if (existingAudiences.length === 0) {
      const audienceData = [
        {
          userId: 'user-1',
          name: 'Enterprise Decision Makers',
          description: 'C-level executives at enterprise companies evaluating marketing technology',
          industries: ['Technology', 'Financial Services', 'Healthcare'],
          titles: ['CEO', 'CMO', 'VP Marketing', 'Chief Digital Officer'],
          accountSizes: ['Enterprise'],
          funnelStages: ['Awareness', 'Consideration'],
          engagementLevel: 'high',
          contentPreferences: ['whitepapers', 'case studies', 'webinars'],
          topTopics: ['ROI measurement', 'Marketing automation', 'AI-powered insights'],
          painPoints: ['Proving marketing ROI', 'Team efficiency', 'Data fragmentation'],
          bestPerformingContent: ['ROI calculator', 'Enterprise case study', 'CMO playbook'],
          audienceSize: 1250
        },
        {
          userId: 'user-1',
          name: 'Mid-Market Growth Teams',
          description: 'Marketing leaders at fast-growing mid-market companies looking to scale',
          industries: ['Technology', 'E-commerce', 'SaaS'],
          titles: ['Director of Marketing', 'Head of Growth', 'Marketing Manager'],
          accountSizes: ['Mid-Market'],
          funnelStages: ['Consideration', 'Decision'],
          engagementLevel: 'medium',
          contentPreferences: ['blog posts', 'templates', 'webinars', 'video tutorials'],
          topTopics: ['Scaling marketing operations', 'Budget optimization', 'Team collaboration'],
          painPoints: ['Limited budget', 'Small team', 'Tool sprawl'],
          bestPerformingContent: ['Quick-start template', 'Budget planning guide', 'Scale webinar'],
          audienceSize: 3400
        },
        {
          userId: 'user-1',
          name: 'Content Marketing Specialists',
          description: 'Practitioners focused on content creation and distribution',
          industries: ['Technology', 'Media', 'Education', 'Healthcare'],
          titles: ['Content Marketing Manager', 'Content Strategist', 'Marketing Specialist'],
          accountSizes: ['SMB', 'Mid-Market', 'Enterprise'],
          funnelStages: ['Awareness', 'Nurture'],
          engagementLevel: 'high',
          contentPreferences: ['blog posts', 'templates', 'checklists', 'case studies'],
          topTopics: ['Content strategy', 'SEO optimization', 'Content calendar management'],
          painPoints: ['Content ideation', 'Consistency', 'Measuring content ROI'],
          bestPerformingContent: ['Content calendar template', 'SEO checklist', 'Distribution guide'],
          audienceSize: 2800
        },
        {
          userId: 'user-1',
          name: 'Early-Stage Founders',
          description: 'Startup founders wearing marketing hats alongside other roles',
          industries: ['Technology', 'SaaS', 'Consumer'],
          titles: ['Founder', 'CEO', 'Co-founder'],
          accountSizes: ['SMB'],
          funnelStages: ['Awareness', 'Decision'],
          engagementLevel: 'medium',
          contentPreferences: ['blog posts', 'quick guides', 'video tutorials'],
          topTopics: ['Go-to-market strategy', 'Lean marketing', 'Growth hacking'],
          painPoints: ['Time constraints', 'No marketing experience', 'Limited budget'],
          bestPerformingContent: ['GTM playbook', '30-day launch plan', 'Bootstrap guide'],
          audienceSize: 890
        }
      ];

      const createdAudiences = await db.insert(audiences).values(audienceData).returning();
      console.log(`✓ Seeded ${createdAudiences.length} audiences`);

      // Seed Content-Audience Pairings
      const pairingsData = [
        // Enterprise Decision Makers pairings
        {
          userId: 'user-1',
          audienceId: createdAudiences[0].id,
          contentTitle: 'Enterprise Marketing ROI Calculator',
          contentType: 'interactive tool',
          contentUrl: '/tools/roi-calculator',
          journeyStage: 'consideration',
          relevanceScore: 95,
          views: 1240,
          clicks: 620,
          conversions: 85,
          engagementRate: 50,
          status: 'active' as const
        },
        {
          userId: 'user-1',
          audienceId: createdAudiences[0].id,
          contentTitle: 'Fortune 500 Success Stories',
          contentType: 'case study',
          contentUrl: '/resources/enterprise-case-studies',
          journeyStage: 'decision',
          relevanceScore: 92,
          views: 890,
          clicks: 445,
          conversions: 72,
          engagementRate: 50,
          status: 'active' as const
        },
        {
          userId: 'user-1',
          audienceId: createdAudiences[0].id,
          contentTitle: 'The CMO\'s Guide to Modern Marketing Intelligence',
          contentType: 'whitepaper',
          contentUrl: '/whitepapers/cmo-guide',
          journeyStage: 'awareness',
          relevanceScore: 88,
          views: 2100,
          clicks: 735,
          conversions: 42,
          engagementRate: 35,
          status: 'active' as const
        },
        // Mid-Market Growth Teams pairings
        {
          userId: 'user-1',
          audienceId: createdAudiences[1].id,
          contentTitle: 'Scaling Marketing on a Budget',
          contentType: 'webinar',
          contentUrl: '/webinars/scale-on-budget',
          journeyStage: 'awareness',
          relevanceScore: 90,
          views: 1580,
          clicks: 790,
          conversions: 95,
          engagementRate: 50,
          status: 'active' as const
        },
        {
          userId: 'user-1',
          audienceId: createdAudiences[1].id,
          contentTitle: 'Marketing Efficiency Template Pack',
          contentType: 'template',
          contentUrl: '/templates/efficiency-pack',
          journeyStage: 'consideration',
          relevanceScore: 93,
          views: 2300,
          clicks: 1380,
          conversions: 210,
          engagementRate: 60,
          status: 'active' as const
        },
        // Content Marketing Specialists pairings
        {
          userId: 'user-1',
          audienceId: createdAudiences[2].id,
          contentTitle: 'The Ultimate Content Calendar Template',
          contentType: 'template',
          contentUrl: '/templates/content-calendar',
          journeyStage: 'awareness',
          relevanceScore: 96,
          views: 3200,
          clicks: 2240,
          conversions: 450,
          engagementRate: 70,
          status: 'active' as const
        },
        {
          userId: 'user-1',
          audienceId: createdAudiences[2].id,
          contentTitle: 'SEO Optimization Checklist',
          contentType: 'checklist',
          contentUrl: '/checklists/seo',
          journeyStage: 'nurture',
          relevanceScore: 91,
          views: 2890,
          clicks: 1734,
          conversions: 320,
          engagementRate: 60,
          status: 'active' as const
        },
        // Early-Stage Founders pairings
        {
          userId: 'user-1',
          audienceId: createdAudiences[3].id,
          contentTitle: '30-Day Go-to-Market Launch Plan',
          contentType: 'guide',
          contentUrl: '/guides/30-day-gtm',
          journeyStage: 'decision',
          relevanceScore: 94,
          views: 980,
          clicks: 686,
          conversions: 120,
          engagementRate: 70,
          status: 'active' as const
        },
        {
          userId: 'user-1',
          audienceId: createdAudiences[3].id,
          contentTitle: 'Bootstrap Marketing Playbook',
          contentType: 'playbook',
          contentUrl: '/playbooks/bootstrap',
          journeyStage: 'awareness',
          relevanceScore: 89,
          views: 1450,
          clicks: 580,
          conversions: 78,
          engagementRate: 40,
          status: 'active' as const
        }
      ];

      const createdPairings = await db.insert(contentAudiencePairings).values(pairingsData).returning();
      console.log(`✓ Seeded ${createdPairings.length} content-audience pairings`);

      // Seed Personalization Rules
      const rulesData = [
        {
          userId: 'user-1',
          name: 'Low Engagement Auto-Swap',
          description: 'Automatically swap to nurture content when engagement drops below 30%',
          triggerType: 'engagement_drop',
          triggerCondition: { metric: 'engagement_rate', threshold: 30, operator: 'less_than' },
          action: 'swap_content',
          actionParams: { swapTo: 'nurture', notifyUser: true },
          audienceIds: [createdAudiences[1].id, createdAudiences[3].id],
          pairingIds: [],
          maxVersions: 3,
          minEngagementThreshold: 20,
          deliveryFrequency: 'daily',
          isActive: true,
          priority: 2
        },
        {
          userId: 'user-1',
          name: 'High-Value Audience Priority',
          description: 'Prioritize delivering top-performing content to enterprise decision makers',
          triggerType: 'manual',
          triggerCondition: {},
          action: 'increase_frequency',
          actionParams: { increaseBy: '50%', channels: ['email', 'LinkedIn'] },
          audienceIds: [createdAudiences[0].id],
          pairingIds: [createdPairings[0].id, createdPairings[1].id],
          maxVersions: 2,
          minEngagementThreshold: 40,
          deliveryFrequency: 'weekly',
          isActive: true,
          priority: 3
        }
      ];

      await db.insert(personalizationRules).values(rulesData);
      console.log(`✓ Seeded ${rulesData.length} personalization rules`);

      // Seed Personalization Insights
      const now = new Date();
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);

      const insightsData = [
        {
          userId: 'user-1',
          audienceId: createdAudiences[0].id,
          periodStart: lastMonth,
          periodEnd: now,
          totalViews: 4230,
          totalClicks: 1800,
          totalConversions: 199,
          engagementLift: 45,
          conversionRate: 11,
          topPerformingAssets: ['ROI calculator', 'Enterprise case studies'],
          underPerformingAssets: ['Generic whitepaper'],
          recommendations: [
            { type: 'content', message: 'Double down on interactive tools - 50% higher conversion', action: 'create_calculator' },
            { type: 'audience', message: 'Consider segmenting by industry for better relevance', action: 'refine_audience' }
          ],
          dropOffPoints: { awareness: 15, consideration: 25, decision: 8 }
        },
        {
          userId: 'user-1',
          audienceId: createdAudiences[2].id,
          periodStart: lastMonth,
          periodEnd: now,
          totalViews: 6090,
          totalClicks: 3974,
          totalConversions: 770,
          engagementLift: 62,
          conversionRate: 19,
          topPerformingAssets: ['Content calendar template', 'SEO checklist'],
          underPerformingAssets: ['Long-form webinar'],
          recommendations: [
            { type: 'content', message: 'Templates and checklists perform 3x better than long-form', action: 'shift_format' },
            { type: 'delivery', message: 'This audience engages most on Tuesday-Thursday mornings', action: 'optimize_timing' }
          ],
          dropOffPoints: { awareness: 8, nurture: 12, conversion: 15 }
        }
      ];

      await db.insert(personalizationInsights).values(insightsData);
      console.log(`✓ Seeded ${insightsData.length} personalization insights`);
    } else {
      console.log(`⊘ Skipping personalization engine (already seeded)`);
    }

    // Seed Playbooks
    const existingPlaybooks = await db.select().from(playbookTemplates).limit(1);
    if (existingPlaybooks.length === 0) {
      // Create Behavior-Based Nurture Playbook Template
      const [playbookTemplate] = await db.insert(playbookTemplates).values({
        name: 'Behavior-Based Nurture Playbook',
        description: 'Move prospects from passive engagement to active consideration by responding to their actual behaviors — not fixed timelines.',
        category: 'nurture',
        icon: 'activity',
        triggerBehaviors: ['inconsistent_engagement', 'mid_funnel_stall', 'opened_no_click'],
        triggerConditions: {
          type: 'any',
          conditions: [
            { behavior: 'visited_pricing', frequency: 'multiple', days: 10 },
            { behavior: 'opened_email', frequency: 3, action: 'no_click' },
            { behavior: 'webinar_attended', followUp: 'no_meeting' }
          ]
        },
        totalSteps: 5,
        estimatedDuration: '15-20 minutes',
        isActive: true,
        isDefault: true
      }).returning();

      // Create Steps for the playbook
      const stepsData = [
        {
          templateId: playbookTemplate.id,
          stepNumber: 1,
          title: 'Identify Behaviors That Signal Readiness',
          description: 'Define what "readiness" looks like for your business by identifying key behavior triggers.',
          icon: 'compass',
          coachingPrompts: [
            'Which behaviors usually precede a buying conversation?',
            'What content actions predict intent — not just curiosity?',
            'Are your signals too broad (any click) or too specific (one-time demo page)?'
          ],
          fieldType: 'multi-select',
          fieldOptions: {
            behaviors: [
              { value: 'visited_pricing', label: 'Visited pricing page multiple times' },
              { value: 'engaged_content', label: 'Engaged with 2+ content assets within 10 days' },
              { value: 'opened_no_click', label: 'Opened but didn\'t click key emails' },
              { value: 'event_no_meeting', label: 'Attended event/webinar but didn\'t book meeting' },
              { value: 'revisited_content', label: 'Revisited old content after quiet period' }
            ]
          },
          exampleData: { selectedBehaviors: ['visited_pricing', 'engaged_content'] },
          isRequired: true
        },
        {
          templateId: playbookTemplate.id,
          stepNumber: 2,
          title: 'Match Behavior to Intent Tier',
          description: 'Group behaviors into three intent levels that determine message style and cadence.',
          icon: 'target',
          coachingPrompts: [
            'What do they need to believe before saying yes?',
            'Does your nurture speak to their mindset or your funnel stage?'
          ],
          fieldType: 'tier-mapping',
          fieldOptions: {
            tiers: ['Exploring', 'Considering', 'Evaluating']
          },
          exampleData: {
            tierMapping: {
              Exploring: ['blog_views', 'guide_downloads'],
              Considering: ['webinar_attendance', 'repeat_visits'],
              Evaluating: ['pricing_page', 'proposal_request']
            }
          },
          isRequired: true
        },
        {
          templateId: playbookTemplate.id,
          stepNumber: 3,
          title: 'Pair Content With Each Behavior Group',
          description: 'Use audience insights to surface content that aligns with each intent tier.',
          icon: 'layers',
          coachingPrompts: [
            'Is your early content inspiring curiosity or confusion?',
            'Do you have one strong follow-up asset for each behavior cluster?'
          ],
          fieldType: 'content-pairing',
          fieldOptions: {
            contentTypes: {
              Exploring: ['blog', 'video', 'thought_leadership'],
              Considering: ['case_study', 'roi_calculator', 'customer_story'],
              Evaluating: ['comparison_sheet', 'demo', 'testimonial']
            }
          },
          exampleData: {
            pairings: [
              { tier: 'Exploring', content: ['Product Overview Blog', 'Industry Trends Video'] },
              { tier: 'Considering', content: ['Enterprise ROI Calculator', 'Customer Success Story'] }
            ]
          },
          isRequired: true
        },
        {
          templateId: playbookTemplate.id,
          stepNumber: 4,
          title: 'Set Nurture Logic',
          description: 'Create automation rules that respond to user behavior intelligently.',
          icon: 'settings',
          coachingPrompts: [
            'When do you stop automating and start personalizing?',
            'How can you keep it human while using system logic?'
          ],
          fieldType: 'automation-rules',
          fieldOptions: {
            rules: [
              { trigger: 'no_engagement_14_days', action: 'send_new_topic' },
              { trigger: 'opened_no_click', action: 'send_case_study' },
              { trigger: 'three_touches_complete', action: 'escalate_to_sales' }
            ]
          },
          exampleData: {
            selectedRules: ['no_engagement_14_days', 'opened_no_click']
          },
          isRequired: true
        },
        {
          templateId: playbookTemplate.id,
          stepNumber: 5,
          title: 'Review & Optimize',
          description: 'Monitor performance and adjust based on what\'s working.',
          icon: 'bar-chart',
          coachingPrompts: [
            'Which nurture paths are too long?',
            'Are certain behaviors producing false positives?'
          ],
          fieldType: 'metrics-review',
          fieldOptions: {
            metrics: ['content_completion_rate', 're_entry_rate', 'time_to_conversion']
          },
          exampleData: {
            trackingMetrics: ['content_completion_rate', 'time_to_conversion']
          },
          isRequired: false
        }
      ];

      await db.insert(playbookSteps).values(stepsData);

      // Create Intent Tiers
      const tiersData = [
        {
          templateId: playbookTemplate.id,
          tierName: 'Exploring',
          tierOrder: 1,
          exampleBehaviors: ['Blog views', 'Guide downloads', 'Social media engagement'],
          nurtureFocus: 'Build awareness, educate',
          tone: 'Light, helpful',
          contentTypes: ['blog', 'guide', 'video', 'thought_leadership'],
          suggestedContent: [
            { type: 'blog', title: 'Industry Trends & Insights' },
            { type: 'guide', title: 'Getting Started Guide' }
          ]
        },
        {
          templateId: playbookTemplate.id,
          tierName: 'Considering',
          tierOrder: 2,
          exampleBehaviors: ['Webinar attendance', 'Repeat website visits', 'Multiple content downloads'],
          nurtureFocus: 'Build confidence, show ROI',
          tone: 'Balanced, consultative',
          contentTypes: ['case_study', 'roi_calculator', 'customer_story', 'webinar'],
          suggestedContent: [
            { type: 'case_study', title: 'Enterprise Success Stories' },
            { type: 'calculator', title: 'ROI Calculator' }
          ]
        },
        {
          templateId: playbookTemplate.id,
          tierName: 'Evaluating',
          tierOrder: 3,
          exampleBehaviors: ['Pricing page visits', 'Proposal requests', 'Demo scheduling'],
          nurtureFocus: 'Drive action, remove risk',
          tone: 'Direct, value-driven',
          contentTypes: ['comparison_sheet', 'demo', 'testimonial', 'pricing_guide'],
          suggestedContent: [
            { type: 'comparison', title: 'Product Comparison Sheet' },
            { type: 'testimonial', title: 'Customer Testimonials' }
          ]
        }
      ];

      await db.insert(intentTiers).values(tiersData);

      console.log(`✓ Seeded Behavior-Based Nurture Playbook with ${stepsData.length} steps and ${tiersData.length} intent tiers`);
    } else {
      console.log(`⊘ Skipping playbooks (already seeded)`);
    }
    
    console.log("🌱 Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
