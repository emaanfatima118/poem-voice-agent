// GTM Test Pit - Comprehensive Guidance and Coaching Content
// Provides definitions, explanations, and best practices throughout the feature

export interface GuidanceContent {
  title: string;
  definition: string;
  explanation: string;
  bestPractice?: string;
  example?: string;
  warning?: string;
}

export const GTM_GUIDANCE: Record<string, GuidanceContent> = {
  // ===== OVERALL CONCEPTS =====
  gtm_model: {
    title: 'GTM (Go-To-Market) Model',
    definition: 'A strategic framework that defines how you will reach customers, generate demand, and drive revenue.',
    explanation: 'Your GTM model is the blueprint for your marketing and sales engine. It answers: Who are you targeting? Through which channels? With what intensity? What outcomes do you expect?',
    bestPractice: 'Start with your business context (stage, goals, resources) then model your approach. Test multiple models to find the right balance for your situation.',
    example: 'A Series A startup might use "The Blitz" for rapid market entry, while an established SaaS company might use "The Marathon" for sustainable growth.'
  },

  archetype: {
    title: 'GTM Archetype',
    definition: 'Pre-built strategy template optimized for specific business scenarios and objectives.',
    explanation: 'Archetypes represent proven GTM patterns that work in specific contexts. Each balances channels, budget, and intensity differently based on goals like speed, efficiency, or market position.',
    bestPractice: 'Use archetypes as starting points, not rigid rules. Clone and customize based on your unique situation.',
    example: '"The Blitz" for fast market capture, "The Fortress" for protecting existing customers, "The Disruptor" for challenging market leaders.'
  },

  // ===== KEY METRICS =====
  system_load: {
    title: 'System Load',
    definition: 'The average intensity across all active channels, representing overall team and operational strain.',
    explanation: 'System Load measures how hard your team is working. High load (>80%) means campaigns are running at full intensity, which can lead to burnout. Low load (<40%) suggests underutilization.',
    bestPractice: 'Aim for 55-75% for sustainable execution. Spike to 80%+ only for short campaigns. Below 50% means you have capacity to do more.',
    warning: 'System Load >85% for extended periods leads to quality degradation, missed deadlines, and team turnover.'
  },

  balance_score: {
    title: 'Balance Score',
    definition: 'Measures how evenly distributed your resources are across channels, personas, and funnel stages.',
    explanation: 'High balance (>80) means your strategy is diversified and resilient. Low balance (<60) means you\'re heavily concentrated in a few areas, which increases risk.',
    bestPractice: 'Balance 75-90 is ideal for most companies. Lower balance acceptable if you\'re intentionally doubling down on what works.',
    example: 'If 80% of budget is in paid search, balance will be low. Spreading across LinkedIn, email, and content increases balance and reduces single-channel dependence.'
  },

  awareness_kpi: {
    title: 'Awareness KPI',
    definition: 'Measures your ability to reach and be remembered by your target market.',
    explanation: 'Awareness is top-of-funnel visibility. Driven by brand channels (LinkedIn, PR, events), executive visibility, and content distribution. High awareness (>75) means your brand is known; low (<50) means you\'re invisible.',
    bestPractice: 'Early-stage companies need 65%+ awareness to fill the funnel. Established brands can operate at 55-65% and focus on conversion.',
    warning: 'High awareness without velocity creates expensive brand campaigns that don\'t drive pipeline.'
  },

  velocity_kpi: {
    title: 'Velocity KPI',
    definition: 'Speed at which prospects move through your funnel from awareness to purchase.',
    explanation: 'Velocity measures how quickly you convert interest into revenue. Driven by conversion-focused channels (paid search, email), strong offers, and sales enablement.',
    bestPractice: 'Target 70-85% for demand generation motions. B2B enterprise can be lower (60-70%) due to longer sales cycles.',
    warning: 'Low velocity (<55%) with high awareness means prospects know you but aren\'t converting. Add bottom-funnel assets and retargeting.'
  },

  efficiency_kpi: {
    title: 'Efficiency KPI',
    definition: 'Return on investment - how much revenue you generate per marketing dollar spent.',
    explanation: 'Efficiency is about ROI and optimization. Improved by testing, automation, targeting precision, and focusing budget on proven channels.',
    bestPractice: 'Efficiency >75% indicates strong product-market fit and optimized execution. Below 60% suggests wasteful spending or weak positioning.',
    example: 'SEO, email, and referrals typically have high efficiency. Brand awareness campaigns are less efficient but necessary for long-term growth.'
  },

  retention_kpi: {
    title: 'Retention KPI',
    definition: 'Ability to keep customers engaged, reduce churn, and drive expansion revenue.',
    explanation: 'Retention measures customer success and lifecycle marketing effectiveness. Critical for SaaS and subscription businesses where LTV compounds over time.',
    bestPractice: 'SaaS companies should target 70%+ retention score. Low retention (<50%) means you\'re in "leaky bucket" mode - fix churn before scaling acquisition.',
    warning: 'Ignoring retention to focus only on new logos leads to expensive growth that doesn\'t compound.'
  },

  credibility_kpi: {
    title: 'Credibility KPI',
    definition: 'Market perception of your authority, trustworthiness, and expertise.',
    explanation: 'Credibility is built through thought leadership, executive visibility, customer proof, analyst relations, and PR. Essential for enterprise sales and category creation.',
    bestPractice: 'Enterprise-focused companies need 75%+ credibility. SMB/PLG motions can operate at 60-70%.',
    example: 'Publishing original research, speaking at industry events, and customer case studies all build credibility.'
  },

  // ===== CHANNELS =====
  channel_linkedin: {
    title: 'LinkedIn',
    definition: 'Professional networking platform for B2B marketing through organic content and paid advertising.',
    explanation: 'LinkedIn excels at reaching decision-makers and building thought leadership. Use for executive visibility, company page content, sponsored posts, and InMail campaigns.',
    bestPractice: 'Combine organic (executive posts, company updates) with paid (sponsored content, InMail) for maximum impact. Budget 15-25% for B2B companies.',
    example: 'CEO posts thought leadership 3x/week (organic) + sponsored content promoting webinar (paid) = awareness + credibility.'
  },

  channel_email: {
    title: 'Email Marketing',
    definition: 'Direct communication with prospects and customers through newsletters, nurture sequences, and promotional campaigns.',
    explanation: 'Email is highest-ROI channel for nurturing leads and retaining customers. Use for product updates, educational content, event invitations, and promotional offers.',
    bestPractice: 'Segment heavily. Send value-first content. Automate nurture sequences. Budget 15-20% for most B2B companies.',
    warning: 'Batch-and-blast email destroys sender reputation. Personalization and segmentation are non-negotiable.'
  },

  channel_paid_search: {
    title: 'Paid Search (Google/Bing Ads)',
    definition: 'Pay-per-click advertising on search engines targeting high-intent keywords.',
    explanation: 'Paid search captures demand from people actively searching for solutions. High intent = high conversion rates. Best for bottom-funnel conversion.',
    bestPractice: 'Start with branded keywords, expand to competitor and category terms. Budget 15-25% for demand capture strategies.',
    example: 'Someone searching "best CRM for startups" has high intent. A paid search ad can convert them immediately.'
  },

  channel_paid_social: {
    title: 'Paid Social (Facebook/Instagram/Twitter)',
    definition: 'Paid advertising on social media platforms for awareness and consideration.',
    explanation: 'Paid social builds awareness and drives consideration through targeted ads. Better for B2C and SMB B2B. Use for brand campaigns, retargeting, and lead generation.',
    bestPractice: 'Combine awareness campaigns (video, carousel) with retargeting (conversion-focused). Budget 10-20% depending on audience.',
    warning: 'Social ads require compelling creative and frequent testing. Weak creative = wasted budget.'
  },

  channel_web: {
    title: 'Website & SEO',
    definition: 'Your owned digital property optimized for organic search traffic and conversion.',
    explanation: 'Website is your hub for all campaigns. SEO drives long-term organic traffic. Critical for credibility, conversion, and customer education.',
    bestPractice: 'Invest in SEO-optimized content, fast page speed, mobile optimization, and clear CTAs. Budget 10-15% for content and technical SEO.',
    example: 'Blog posts targeting long-tail keywords drive organic traffic that converts 2-3x higher than paid traffic.'
  },

  channel_events: {
    title: 'Events & Conferences',
    definition: 'In-person and virtual gatherings including trade shows, webinars, and hosted events.',
    explanation: 'Events build relationships, generate high-quality leads, and establish industry presence. High-touch but expensive. Best for enterprise sales.',
    bestPractice: 'Focus on tier-1 industry events where your ICP gathers. Supplement with hosted webinars for broader reach. Budget 8-15% for event-led strategies.',
    warning: 'Events are expensive. Calculate cost-per-lead and ensure proper follow-up to justify investment.'
  },

  channel_pr: {
    title: 'Public Relations & Media',
    definition: 'Earned media coverage through press releases, journalist relationships, and media outreach.',
    explanation: 'PR builds credibility and awareness through third-party validation. Includes press releases, media pitches, thought leadership placements, and industry awards.',
    bestPractice: 'Hire PR agency or in-house expert. Focus on data-driven stories and executive quotes. Budget 5-10% for PR support and distribution.',
    example: 'Announcement in TechCrunch generates 10x more credibility than a paid ad because it\'s earned, not bought.'
  },

  channel_seo: {
    title: 'Search Engine Optimization',
    definition: 'Optimizing content and website structure to rank higher in organic search results.',
    explanation: 'SEO is long-term investment in organic visibility. Takes 3-6 months to see results but compounds over time. Critical for sustainable inbound.',
    bestPractice: 'Create high-quality content targeting buyer keywords. Build backlinks through partnerships and PR. Technical SEO (site speed, mobile) is table stakes.',
    warning: 'SEO is slow. Don\'t rely on it for short-term pipeline. Pair with paid channels for immediate results.'
  },

  // ===== FUNNEL STAGES =====
  stage_awareness: {
    title: 'Awareness Stage',
    definition: 'Top of funnel - making your target market aware your company and solution exist.',
    explanation: 'Awareness is about visibility and recall. Prospects learn about your category, problem, and your brand. Measured by impressions, reach, and brand searches.',
    bestPractice: 'Allocate 25-35% to awareness for growth-stage companies. Established brands can go lower (15-25%) and focus on conversion.',
    example: 'LinkedIn posts, podcast sponsorships, PR coverage, and conference speaking all build awareness.'
  },

  stage_consideration: {
    title: 'Consideration Stage',
    definition: 'Middle of funnel - prospects evaluating solutions and comparing options.',
    explanation: 'Consideration is about education and positioning. Prospects research alternatives, read comparisons, and engage with content. Your job is to influence the decision.',
    bestPractice: 'Allocate 30-40% to consideration. Provide comparison guides, case studies, webinars, and product demos.',
    example: 'Someone downloads your "CRM Buyer\'s Guide" and attends your comparison webinar - they\'re in consideration.'
  },

  stage_conversion: {
    title: 'Conversion Stage',
    definition: 'Bottom of funnel - prospects ready to purchase, requesting demos or trials.',
    explanation: 'Conversion is about closing deals. Prospects are high-intent and need sales enablement, proof points, and clear next steps. Marketing supports sales.',
    bestPractice: 'Allocate 20-30% to conversion. Focus on retargeting, sales enablement, and removing friction from the buying process.',
    warning: 'Underinvesting in conversion means leads leak out of the funnel. Always have strong bottom-funnel tactics.'
  },

  stage_retention: {
    title: 'Retention Stage',
    definition: 'Post-purchase - keeping customers engaged, reducing churn, and driving expansion.',
    explanation: 'Retention is about customer success, lifecycle marketing, and upsells. Critical for SaaS and subscription businesses where LTV compounds.',
    bestPractice: 'SaaS companies should allocate 15-25% to retention. Product-led growth can go higher (25-30%).',
    example: 'Monthly customer newsletter, quarterly business reviews, product education webinars, and expansion campaigns all drive retention.'
  },

  // ===== STRATEGIC CONCEPTS =====
  category_slider: {
    title: 'Category-Level Budget Allocation',
    definition: 'High-level slider that sets overall budget for an entire category (like "Channels" or "Stages").',
    explanation: 'Category sliders let you quickly adjust macro-level strategy. When you move a category slider, budget automatically redistributes to items within that category based on their relative weights.',
    bestPractice: 'Use category sliders for big strategic decisions (e.g., "invest more in paid channels"). Use individual item sliders for fine-tuning specific tactics.',
    example: 'If you increase the Channels category slider, all 8 channels get proportionally more budget while maintaining their relative mix.'
  },

  pillars: {
    title: 'Strategic Pillars',
    definition: 'Core themes or areas of focus that guide your content and messaging strategy.',
    explanation: 'Pillars are the 3-5 topics you\'ll own and consistently communicate about. They align marketing with business strategy and ensure consistent messaging.',
    bestPractice: 'Choose pillars that differentiate you, align with customer pain points, and leverage your unique expertise. Stick with them for at least 6-12 months.',
    example: 'A fintech might choose pillars: "Financial Innovation", "Customer Success", "Regulatory Compliance", "Product Security".'
  },

  executives: {
    title: 'Executive Visibility',
    definition: 'Leadership team members who will participate in thought leadership, speaking, and brand building.',
    explanation: 'Executive visibility builds credibility and trust, especially in enterprise sales. CEOs, CMOs, and VPs sharing insights humanizes your brand and demonstrates expertise.',
    bestPractice: 'Select 2-4 executives willing to consistently create content, speak at events, and engage on social. Provide support (ghostwriting, media training).',
    warning: 'Executive programs fail when leaders aren\'t committed. Get explicit buy-in before investing in executive visibility.'
  },

  goals: {
    title: 'Business Goals',
    definition: 'Specific, measurable objectives your GTM strategy must achieve this quarter.',
    explanation: 'Goals connect marketing tactics to business outcomes. They should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound) and board-aligned.',
    bestPractice: 'Select 2-4 goals max. More goals means diluted focus. Align goals to funnel stages (awareness goals → awareness tactics).',
    example: 'Instead of "increase awareness", use "Generate 500K brand impressions and 50 demo requests from target accounts".'
  },

  content_types: {
    title: 'Content Types',
    definition: 'Specific formats of content you\'ll produce to support your GTM strategy.',
    explanation: 'Content types should map to channels and funnel stages. Blog posts for SEO/awareness, case studies for consideration, ROI calculators for conversion.',
    bestPractice: 'Choose 4-6 content types you can consistently produce at high quality. Don\'t spread too thin. Repurpose aggressively across formats.',
    example: 'One research report → blog post → LinkedIn carousel → webinar → email series → press release.'
  },

  // ===== WARNINGS & RISKS =====
  high_load_warning: {
    title: 'High System Load',
    definition: 'Your team is operating at >80% capacity, risking burnout and quality degradation.',
    explanation: 'High load means campaigns are intense and team is stretched. Sustainable for short sprints (4-6 weeks) but dangerous long-term.',
    bestPractice: 'If load >80% for extended periods: (1) Add contractors/agencies, (2) Phase campaign launches, (3) Reduce channel count, or (4) lower intensity.',
    warning: 'Teams running >85% load for 3+ months experience 40-60% higher turnover and 30% lower campaign performance.'
  },

  low_retention_warning: {
    title: 'Low Retention Focus',
    definition: 'Retention KPI <50% indicates insufficient focus on customer success and lifecycle marketing.',
    explanation: 'The "leaky bucket" problem - you\'re acquiring customers faster than you can keep them. Churn undermines growth.',
    bestPractice: 'Add customer newsletter, product education content, and expansion campaigns. Allocate at least 15-20% of budget to retention.',
    warning: 'Scaling acquisition when churn is high leads to expensive growth that doesn\'t compound. Fix retention before scaling.'
  },

  imbalance_warning: {
    title: 'Imbalanced Resource Allocation',
    definition: 'Balance score <65% means you\'re heavily concentrated in few channels or tactics.',
    explanation: 'Low balance = high risk. If your primary channel changes (algorithm, competition, saturation), your entire strategy is vulnerable.',
    bestPractice: 'Diversify across 4-6 channels. No single channel should represent >35% of budget unless you have a specific strategic reason.',
    example: 'If 70% of pipeline comes from paid search, you\'re vulnerable to CPC increases or Google algo changes. Add email, LinkedIn, and content.'
  }
};

// Helper function to get guidance by key
export function getGuidance(key: string): GuidanceContent | null {
  return GTM_GUIDANCE[key] || null;
}

// Helper function to get all guidance for a category
export function getGuidanceByCategory(category: 'metrics' | 'channels' | 'stages' | 'concepts' | 'warnings'): Record<string, GuidanceContent> {
  const categoryMappings = {
    metrics: ['system_load', 'balance_score', 'awareness_kpi', 'velocity_kpi', 'efficiency_kpi', 'retention_kpi', 'credibility_kpi'],
    channels: ['channel_linkedin', 'channel_email', 'channel_paid_search', 'channel_paid_social', 'channel_web', 'channel_events', 'channel_pr', 'channel_seo'],
    stages: ['stage_awareness', 'stage_consideration', 'stage_conversion', 'stage_retention'],
    concepts: ['gtm_model', 'archetype', 'category_slider', 'pillars', 'executives', 'goals', 'content_types'],
    warnings: ['high_load_warning', 'low_retention_warning', 'imbalance_warning']
  };

  const keys = categoryMappings[category] || [];
  const result: Record<string, GuidanceContent> = {};
  
  keys.forEach(key => {
    if (GTM_GUIDANCE[key]) {
      result[key] = GTM_GUIDANCE[key];
    }
  });

  return result;
}
