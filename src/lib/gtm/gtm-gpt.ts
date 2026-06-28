/**
 * GTM GPT Analysis Integration
 * Converted from Django backend gtm_gpt.py
 */

import OpenAI from 'openai';

// Lazy initialization - only check API key when actually needed
// Match audit pattern: don't validate key until API is called
let client: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Will be undefined if not set, OpenAI will throw when API is called
    });
  }
  return client;
}

// ===================================
// SYSTEM PROMPT (Defines AI's Role)
// ===================================

const SYSTEM_PROMPT = `You are Stackwise Sage, an elite GTM strategy analyst.

Your role: Analyze GTM performance data and produce strategic insights that help marketing leaders make data-driven decisions.

CRITICAL OUTPUT RULES:
1. Output ONLY valid JSON between <<<JSON_START>>> and <<<JSON_END>>>
2. All numeric values must be integers (0-100), NOT decimals
3. Base all analysis strictly on provided data - never invent numbers
4. Be direct and actionable - avoid marketing jargon
5. Reference specific numbers from input data in rationale
6. Strategic insight must be 2-3 paragraphs, NO bullets or lists

OUTPUT FORMAT:
Your response must be valid JSON that can be parsed by JavaScript's JSON.parse().
No markdown, no explanations outside the JSON, no trailing commas.`;

// ===================================
// UI CONTEXT (Critical for Output Formatting)
// ===================================

const UI_CONTEXT = `
================================================================================
UI DISPLAY REQUIREMENTS - CRITICAL FOR OUTPUT FORMATTING
================================================================================
Your analysis will be displayed in the following UI sections:

1. **KPI Profile Cards** (Analysis Page):
   - Display: Score (integer 0-100) + Rating (Critical/Weak/Fair/Good/Excellent)
   - Format: Large number with color coding (red <30, yellow 30-60, green >60)
   - Users see: "Awareness: 65 (Good)"
   - IMPORTANT: All KPI scores must be integers, not decimals

2. **Strategic Analysis Card**:
   - Title: "Strategic Analysis" (NOT model name)
   - Content: Display ONLY "strategic_insight" from strategic_tradeoffs
   - Format: 2-3 paragraph text, NO bullets, NO lists
   - Users see: Strategic insight text only (this is the main content)
   - Length: 150-250 words, executive-friendly

3. **Recommendations/Warnings Card**:
   - Display: Priority badges + Issue + Recommendation + Expected Impact
   - Format: List with color-coded priority (Critical=red, High=orange, Medium=yellow, Low=gray)
   - Users see: "🔴 Critical: [Issue] → [Recommendation] → [Impact]"
   - Max 6 recommendations, prioritized by impact

4. **Market Metrics Dashboard**:
   - Display: System Load %, Balance Index %, Market Coverage %, Pipeline Predictability %
   - Format: Percentage with progress bars (integers 0-100)
   - Users see: "System Load: 78%" with visual bar
   - IMPORTANT: All metrics must be integers

5. **KPI Comparison (Compare Models)**:
   - Display: Side-by-side comparison of all 5 KPIs
   - Format: Bar charts with integer values
   - Users see: Visual comparison bars

6. **My Models Section**:
   - Display: All 5 KPIs as integers in a grid
   - Format: Large numbers with labels below
   - Users see: "65 Awareness", "72 Velocity", etc.

CRITICAL OUTPUT RULES:
- All numeric values must be integers (0-100), NOT decimals
- Strategic insight must be 2-3 paragraphs, NO bullets
- Reference specific numbers from input data in all rationale
- Be actionable, not theoretical
`;

// ===================================
// RESPONSE EXAMPLES
// ===================================

const RESPONSE_EXAMPLES = `
================================================================================
EXAMPLE RESPONSES - FOLLOW THESE FORMATS
================================================================================

GOOD Example - Strategic Insight (2-3 paragraphs, NO bullets):
"Your GTM model prioritizes velocity (68) and efficiency (72) over awareness (42), 
indicating a conversion-focused strategy optimized for rapid revenue generation. This 
approach works well for companies with established brand recognition and existing 
pipeline, but limits organic pipeline growth over time. With only 28% funnel 
allocation to awareness and 3 active awareness channels, you're likely relying 
heavily on paid acquisition, which increases CAC over time and creates dependency 
on advertising spend.

The high system load (78%) with 8 active channels suggests operational complexity 
that may impact execution quality. While the balance index (65) shows moderate 
alignment, the low awareness score combined with high velocity suggests you're 
converting existing demand rather than creating new demand. This is sustainable 
short-term but may limit long-term growth potential.

To optimize this model, consider rebalancing funnel allocation to 40-50% awareness 
while maintaining velocity through improved conversion content. This would reduce 
paid dependency and create more sustainable growth."

BAD Example - Strategic Insight (too short, uses bullets):
"This model focuses on conversion, which is good. However, awareness could be 
improved. Consider:
- Increasing awareness allocation
- Adding more channels
- Improving content"

GOOD Example - Recommendation:
{
  "impact_level": "High",
  "category": "awareness",
  "title": "Increase Top-of-Funnel Investment",
  "recommendation": "Allocate 50-60% of funnel focus to awareness stage. Add SEO 
  and content marketing channels to reduce paid dependency and build organic pipeline.",
  "rationale": "Awareness at 42 with only 28% funnel allocation (vs industry 
  standard 50-60%) limits organic pipeline growth. Current paid budget of $1.5M 
  suggests high CAC dependency that will increase over time.",
  "expected_impact": "+20-30 points awareness, -15% CAC reduction over 6 months",
  "confidence": 85,
  "priority": "High"
}

BAD Example - Recommendation (too vague):
{
  "impact_level": "Medium",
  "category": "awareness",
  "title": "Improve Awareness",
  "recommendation": "Try to increase awareness",
  "rationale": "Awareness could be better",
  "expected_impact": "Better awareness",
  "confidence": 60,
  "priority": "Medium"
}
`;

// ===================================
// USER RULES (Defines Expected Output Structure)
// ===================================

const USER_RULES = `
================================================================================
OUTPUT STRUCTURE
================================================================================
You must produce a JSON object with EXACTLY these top-level keys:

<<<JSON_START>>>
{
  "strategic_archetype": {
    "name": "string (e.g., 'The Blitz', 'The Sniper')",
    "tagline": "One sentence",
    "description": "2-3 sentences explaining when to use this model"
  },
  "kpi_analysis": {
    "awareness": { "score": integer (0-100), "rating": "Critical|Weak|Fair|Good|Excellent" },
    "velocity": { "score": integer, "rating": "..." },
    "efficiency": { "score": integer, "rating": "..." },
    "retention": { "score": integer, "rating": "..." },
    "credibility": { "score": integer, "rating": "..." }
  },
  "market_metrics": {
    "market_coverage": { "score": integer, "label": "Narrow|Moderate|Broad|Comprehensive" },
    "pipeline_predictability": { "score": integer, "label": "Volatile|Moderate|Stable|Highly Predictable" },
    "system_load": { "score": integer, "label": "Underutilized|Sustainable|Stretched|Overloaded" },
    "balance_index": { "score": integer, "label": "Misaligned|Moderate|Well-aligned|Perfectly Balanced" }
  },
  "strategic_recommendations": [
    {
      "impact_level": "High|Medium|Low",
      "category": "awareness|velocity|efficiency|retention|credibility|operations|budget",
      "title": "Short headline (5-8 words)",
      "recommendation": "1-2 sentences, actionable and specific",
      "rationale": "Why this matters with specific data points (e.g., 'System load at 78% with 8 active channels...')",
      "expected_impact": "Quantified impact (e.g., '-15 points system load, +10-15% content quality')",
      "confidence": integer (60-95),
      "priority": "Critical|High|Medium|Low"
    }
  ],
  "budget_alignment": [...],
  "strategic_tradeoffs": {
    "winning": ["Strength 1 with specific data point", "Strength 2 with data"],
    "sacrificing": ["Tradeoff 1 with data", "Tradeoff 2 with data"],
    "strategic_insight": "2-3 paragraphs explaining fundamental tradeoff. THIS IS DISPLAYED IN UI AS MAIN CONTENT. NO BULLETS. Executive-friendly language. 150-250 words.",
    "adjustment_option": "Specific tactical suggestion for rebalancing"
  },
  "risk_assessment": [...],
  "implementation_roadmap": {
    "30_days": { "focus": "string", "actions": ["Specific action 1", "Specific action 2", "Specific action 3"] },
    "60_days": { "focus": "string", "actions": ["Specific action 1", "Specific action 2"] },
    "90_days": { "focus": "string", "actions": ["Specific action 1", "Specific action 2"] }
  },
  "executive_summary": "4-5 sentences, data-driven, actionable, no bullets"
}

================================================================================
SECTION 1: STRATEGIC ARCHETYPE
================================================================================
Identify which GTM archetype this model represents based on KPI patterns:

**Archetype Detection Logic:**
- High awareness (>60) + High velocity (>60) + Low retention (<40) = "The Blitz"
- High efficiency (>65) + Moderate awareness (40-60) + High credibility (>50) = "The Sniper"
- High retention (>55) + High credibility (>55) + Moderate velocity (40-60) = "The Builder"
- Moderate across all (40-60) + High system_load (>65) + Lower balance (<60) = "The Experimenter"
- High efficiency (>65) + High velocity (>60) + Balanced retention (40-60) = "The Scale Machine"
- High velocity (>55) + Low awareness (<40) + Mid-funnel focus (>60%) = "The Velocity Hunter"
- Low velocity (<35) + High awareness (>55) + Low conversion focus (<20%) = "The Brand Builder"

If no archetype fits perfectly, choose the closest match or create a hybrid name.

Output format:
{
  "name": "The [Archetype Name]",
  "tagline": "One sentence describing the strategic approach",
  "description": "2-3 sentences explaining what this model optimizes for and when to use it and what it is best for and what to watch out for"
}

================================================================================
SECTION 2: KPI ANALYSIS
================================================================================
For EACH of the 5 KPIs, provide detailed analysis:

Rating Scale:
- 0-10: Critical
- 11-30: Weak
- 31-60: Fair/Moderate
- 61-80: Good/Strong
- 81-100: Excellent

Required fields per KPI:
{
  "score": float,
  "rating": "Critical|Weak|Fair|Good|Excellent"
}

Analysis Rules:
- Always reference specific numbers from channel_focus, content_focus, funnel_stage_focus
- For awareness: focus on top-of-funnel channels (LinkedIn, SEO, PR, web) and awareness content (blogs, PR)
- For velocity: focus on mid/bottom funnel (consideration, conversion) and conversion content (case studies, demos)
- For efficiency: focus on resource concentration and budget alignment
- For retention: focus on retention funnel % and retention content (newsletters, customer content)
- For credibility: heavily weight executive_visibility and thought leadership content

================================================================================
SECTION 3: MARKET METRICS
================================================================================
Analyze the 4 market health indicators:

For each metric, provide:
{
  "score": float,
  "label": "string from the input"
}

Interpretation Guidelines:
**Market Coverage:**
- 0-20 = Very narrow, niche focus
- 21-40 = Focused approach, limited reach
- 41-60 = Moderate coverage, balanced
- 61-80 = Broad reach across multiple channels
- 81-100 = Comprehensive market presence

**Pipeline Predictability:**
- 0-20 = Highly volatile, difficult to forecast
- 21-40 = Unstable, frequent surprises
- 41-60 = Somewhat stable, moderate confidence
- 61-80 = Stable and forecastable
- 81-100 = Highly predictable revenue machine

**System Load:**
- 0-30 = Underutilized, opportunity for more
- 31-60 = Sustainable, manageable complexity
- 61-80 = Stretched, execution challenges likely
- 81-100 = Critically overloaded, quality at risk

**Balance Index:**
- 0-20 = Chaotic, no strategic coherence
- 21-40 = Inconsistent alignment
- 41-70 = Mixed, some misalignments
- 71-90 = Well-aligned strategy
- 91-100 = Perfectly balanced execution

================================================================================
SECTION 4: STRATEGIC RECOMMENDATIONS
================================================================================
Generate 4-6 recommendations prioritized by impact.

Each recommendation must include:
{
  "impact_level": "High|Medium|Low",
  "category": "awareness|velocity|efficiency|retention|credibility|operations|budget",
  "title": "Short headline (e.g., 'Consolidate Channel Execution', 'Channel Optimization', 'Funnel Balance')",
  "recommendation": "Specific, actionable recommendation in 1-2 sentences",
  "rationale": "Why this matters, with specific data points (e.g., 'System load at 78.35 with 8 active channels suggests...')",
  "expected_impact": "Quantified impact (e.g., '-15 points system load, +10-15% content quality')",
  "confidence": integer,
  "priority": "Critical|High|Medium|Low"
}

Impact Level Guidelines:
- **High Impact**: Will move primary KPIs by 15+ points or significantly affect business outcomes
- **Medium Impact**: Will improve 1-2 KPIs by 5-15 points
- **Low Impact**: Incremental improvements or experimental

Priority Guidelines:
- **Critical**: Immediate action required (system load >75, KPI <20, major misalignment)
- **High**: Important within 30 days (KPI 20-35, moderate misalignment)
- **Medium**: Should address within 60 days (KPI 35-50, minor issues)
- **Low**: Nice-to-have improvements (KPI >50, optimization opportunities)

Confidence Scoring:
- 85-95%: Strong data signal, clear action, proven approach
- 75-84%: Good data, reasonable action, likely effective
- 65-74%: Moderate data, logical action, uncertain outcome
- 60-64%: Weak signal, experimental, low confidence

Rules:
- Always include at least one recommendation for the weakest KPI
- If system_load >70, make it a critical priority
- If any KPI <25, include a high-priority recommendation
- Reference specific numbers from the input data in rationale

================================================================================
SECTION 5: BUDGET ALIGNMENT
================================================================================
Analyze misalignments between budget allocation and strategic focus.

For each category with >15% gap, create an entry:
{
  "category": "Paid Social|Search|Events|Content|etc.",
  "priority": "High|Medium",
  "gap_percent": float,
  "paid_budget_percent": float,
  "strategic_focus_percent": float,
  "analysis": "Why this misalignment is problematic (1-2 sentences)",
  "recommendation": "Either increase focus to match budget OR reduce budget to match focus"
}

Priority Rules:
- Gap >30% = High Priority
- Gap 15-30% = Medium Priority
- Gap <15% = Don't include

Analysis Logic:
- Compare paid_budget percentages to channel_focus percentages
- Compare paid channel spend to funnel_stage_focus
- Look for patterns like "High paid search spend (25%) but low paid_search channel focus (10%)"

If no major misalignments exist, include one entry:
{
  "category": "Overall",
  "priority": "Low",
  "gap_percent": 0,
  "analysis": "Budget allocation is well-aligned with strategic priorities",
  "recommendation": "Continue current allocation strategy"
}

================================================================================
SECTION 6: STRATEGIC TRADEOFFS
================================================================================
Explain what the model is optimizing for and what it sacrifices.

Output format:
{
  "winning": [
    "Strength 1 with data point",
    "Strength 2 with data point",
    "Strength 3 with data point"
  ],
  "sacrificing": [
    "Tradeoff 1 with data point",
    "Tradeoff 2 with data point",
    "Tradeoff 3 with data point"
  ],
  "strategic_insight": "2-3 paragraphs explaining fundamental tradeoff. THIS IS DISPLAYED IN UI AS MAIN CONTENT. NO BULLETS. Executive-friendly language. 150-250 words. Explain what the model is optimizing for, what it sacrifices, and whether this tradeoff is appropriate for the stated goals.",
  "adjustment_option": "Specific tactical suggestion for rebalancing if needed"
}

Tradeoff Logic:
- High velocity + Low awareness = Converting existing demand but not creating new demand
- High awareness + Low velocity = Building brand but not converting efficiently
- High efficiency + Low coverage = Focused execution but limited market reach
- High coverage + High system_load = Broad reach but execution challenges
- High balance_index = Diversified but not specialized

================================================================================
SECTION 7: RISK ASSESSMENT
================================================================================
Identify 3-6 specific risks based on the data.

Format each risk as:
{
  "severity": "Critical|High|Medium",
  "category": "Pipeline|Execution|Budget|Market|Credibility",
  "risk": "Specific risk with data point (e.g., 'Awareness at 34.85 limits organic pipeline growth')",
  "likelihood": "High|Medium|Low",
  "mitigation": "Actionable step to reduce this risk"
}

Risk Identification Logic:
- KPI <25 = Critical severity
- KPI 25-35 = High severity
- KPI 35-45 = Medium severity
- System load >75 = Critical execution risk
- Balance <50 = High strategic coherence risk
- Major budget misalignment = High budget efficiency risk
- Low executive visibility + PR focus = High credibility risk

================================================================================
SECTION 8: IMPLEMENTATION ROADMAP
================================================================================
Provide a phased implementation plan:

{
  "30_days": {
    "focus": "Foundation and stabilization",
    "actions": [
      "Specific action 1",
      "Specific action 2",
      "Specific action 3"
    ]
  },
  "60_days": {
    "focus": "Optimization and adjustment",
    "actions": [
      "Specific action 1",
      "Specific action 2",
      "Specific action 3"
    ]
  },
  "90_days": {
    "focus": "Scale and expand",
    "actions": [
      "Specific action 1",
      "Specific action 2",
      "Specific action 3"
    ]
  }
}

Rules:
- 30-day actions should address critical issues and stabilize execution
- 60-day actions should optimize based on early data
- 90-day actions should scale what's working
- Each action must be specific and measurable
- Reference the top recommendations in the phased actions

================================================================================
SECTION 9: EXECUTIVE SUMMARY
================================================================================
A single string with 4-5 sentences covering:
1. Strategic archetype and primary strength (1 sentence)
2. Biggest weakness or risk (1 sentence)
3. Key opportunity or recommendation (1 sentence)
4. Expected outcome if recommendations are implemented (1-2 sentences)

Must be:
- Concise and executive-friendly
- Data-driven with specific numbers
- Actionable with clear next steps
- No bullet points or lists

================================================================================
CRITICAL OUTPUT RULES
================================================================================
1. Output ONLY valid JSON between <<<JSON_START>>> and <<<JSON_END>>>
2. Do NOT include any markdown, explanations, or text outside those markers
3. Ensure all JSON is properly escaped (double quotes, no trailing commas)
4. All numeric fields must be numbers (not strings)
5. All text fields must use double quotes
6. If any data is missing, use null or empty arrays/objects, never omit keys
7. The JSON must parse successfully with JavaScript's JSON.parse()
8. Always have the <<<JSON_START>>> before and <<<JSON_END>>> at the end of your response!!!
`;

// ===================================
// PROMPT BUILDER
// ===================================

export interface KPIMetrics {
  kpis: {
    awareness: number;
    velocity: number;
    efficiency: number;
    retention: number;
    credibility: number;
  };
  system_load: number;
  balance_index: number;
  market_coverage: number;
  pipeline_predictability: number;
  budget_analysis?: {
    effective_paid_budget: number;
    budget_multiplier_effective: number;
    calculated_roi_factor: number;
  };
}

export interface GTMInput {
  channel_focus: Record<string, number>;
  content_focus: Record<string, number>;
  funnel_stage_focus: Record<string, number>;
  goals: Record<string, number>;
  persona_focus: Record<string, number>;
  executive_visibility: Record<string, number>;
  strategic_pillars: Record<string, number>;
  paid_budget: Record<string, number>;
  total_paid_budget: number;
  budget_multiplier: number;
}

function buildGTMAnalysisPrompt(
  kpiResponse: KPIMetrics,
  requestBody: GTMInput
): string {
  const kpis = kpiResponse.kpis;
  const systemLoad = kpiResponse.system_load;
  const balanceIndex = kpiResponse.balance_index;
  const marketCoverage = kpiResponse.market_coverage;
  const pipelinePred = kpiResponse.pipeline_predictability;
  const budgetAnalysis = kpiResponse.budget_analysis || {
    effective_paid_budget: 0,
    budget_multiplier_effective: 100,
    calculated_roi_factor: 0,
  };

  const channelFocus = requestBody.channel_focus || {};
  const contentFocus = requestBody.content_focus || {};
  const funnelFocus = requestBody.funnel_stage_focus || {};
  const goals = requestBody.goals || {};
  const personaFocus = requestBody.persona_focus || {};
  const execVisibility = requestBody.executive_visibility || {};
  const pillars = requestBody.strategic_pillars || {};
  const paidBudget = requestBody.paid_budget || {};
  const totalBudget = requestBody.total_paid_budget || 0;
  const budgetMultiplier = requestBody.budget_multiplier || 100;

  const activeChannels = Object.values(channelFocus).filter(v => v > 5).length;
  const activeContent = Object.values(contentFocus).filter(v => v > 5).length;
  const activePaid = Object.values(paidBudget).filter(v => v > 5).length;

  const topChannels = Object.entries(channelFocus)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const topContent = Object.entries(contentFocus)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const topGoals = Object.entries(goals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const execValues = Object.values(execVisibility);
  const avgExecVisibility = execValues.length > 0
    ? execValues.reduce((sum, v) => sum + v, 0) / execValues.length
    : 0;

  return `
${SYSTEM_PROMPT}

${UI_CONTEXT}

${RESPONSE_EXAMPLES}

================================================================================
CALCULATED PERFORMANCE METRICS (INTEGERS ONLY)
================================================================================
KPIs (0-100 scale, integers):
- Awareness: ${Math.round(kpis.awareness)} (${getKPIRating(kpis.awareness)})
- Velocity: ${Math.round(kpis.velocity)} (${getKPIRating(kpis.velocity)})
- Efficiency: ${Math.round(kpis.efficiency)} (${getKPIRating(kpis.efficiency)})
- Retention: ${Math.round(kpis.retention)} (${getKPIRating(kpis.retention)})
- Credibility: ${Math.round(kpis.credibility)} (${getKPIRating(kpis.credibility)})

Market Health Indicators (0-100 scale, integers):
- System Load: ${Math.round(systemLoad)}% (${systemLoad > 70 ? 'CRITICAL - Overloaded' : systemLoad > 55 ? 'HIGH - Stretched' : 'NORMAL - Sustainable'})
- Balance Index: ${Math.round(balanceIndex)}% (${balanceIndex > 70 ? 'Well-aligned' : balanceIndex > 50 ? 'Moderate alignment' : 'Misaligned'})
- Market Coverage: ${Math.round(marketCoverage)}% (${marketCoverage > 60 ? 'Broad reach' : marketCoverage > 40 ? 'Moderate coverage' : 'Narrow focus'})
- Pipeline Predictability: ${Math.round(pipelinePred)}% (${pipelinePred > 70 ? 'Stable and predictable' : pipelinePred > 50 ? 'Moderate stability' : 'Volatile'})

================================================================================
STRATEGIC INPUTS
================================================================================
Channel Focus (${activeChannels} active channels):
${topChannels.map(([k, v]) => `- ${k}: ${v}%`).join('\n')}

Content Focus (${activeContent} active content types):
${topContent.map(([k, v]) => `- ${k}: ${v}%`).join('\n')}

Funnel Stage Allocation:
- Awareness: ${Math.round((funnelFocus.awareness || 0))}%
- Consideration: ${Math.round((funnelFocus.consideration || 0))}%
- Conversion: ${Math.round((funnelFocus.conversion || 0))}%
- Retention: ${Math.round((funnelFocus.retention || 0))}%

Top Business Goals:
${topGoals.map(([k, v]) => `- ${k}: ${v}%`).join('\n')}

Paid Budget: $${totalBudget.toLocaleString()} (${budgetMultiplier}% multiplier = $${(budgetAnalysis.effective_paid_budget || 0).toLocaleString()} effective)
Active Paid Channels: ${activePaid}

Executive Visibility: ${Math.round(avgExecVisibility)}/100 average
Active Executives (>10%): ${Object.values(execVisibility).filter(v => v > 10).length}

Strategic Pillars:
${Object.entries(pillars).map(([k, v]) => `- ${k}: ${v}%`).join('\n') || 'None specified'}

================================================================================
ANALYSIS INSTRUCTIONS
================================================================================
${USER_RULES}

CRITICAL REMINDERS: 
- All scores must be integers (0-100), NOT decimals
- Strategic insight must be 2-3 paragraphs, NO bullets, 150-250 words
- Reference specific numbers from input data in all rationale
- Be actionable, not theoretical
- Strategic insight is the MAIN CONTENT displayed in UI

Now generate your complete strategic analysis as valid JSON.
`;
}

// ===================================
// GPT CALLER WITH RETRY LOGIC
// ===================================

async function callGPTForAnalysis(
  prompt: string,
  model: string = 'gpt-4o',
  temperature: number = 0.7,
  maxRetries: number = 2
): Promise<string> {
  try {
    const openaiClient = getOpenAIClient(); // Use lazy initialization
    const response = await openaiClient.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: temperature,
    });

    const raw = response.choices[0]?.message?.content?.trim() || '';
    return raw;
  } catch (error: any) {
    console.error('[GTM Analysis] GPT call error:', error);
    throw error;
  }
}

// ===================================
// JSON EXTRACTOR & VALIDATOR
// ===================================

export interface StrategicAnalysis {
  strategic_archetype: {
    name: string;
    tagline: string;
    description: string;
  };
  kpi_analysis: {
    awareness: { score: number; rating: string };
    velocity: { score: number; rating: string };
    efficiency: { score: number; rating: string };
    retention: { score: number; rating: string };
    credibility: { score: number; rating: string };
  };
  market_metrics: {
    market_coverage: { score: number; label: string };
    pipeline_predictability: { score: number; label: string };
    system_load: { score: number; label: string };
    balance_index: { score: number; label: string };
  };
  strategic_recommendations: Array<{
    impact_level: string;
    category: string;
    title: string;
    recommendation: string;
    rationale: string;
    expected_impact: string;
    confidence: number;
    priority: string;
  }>;
  budget_alignment: Array<{
    category: string;
    priority: string;
    gap_percent: number;
    paid_budget_percent?: number;
    strategic_focus_percent?: number;
    analysis: string;
    recommendation: string;
  }>;
  strategic_tradeoffs: {
    winning: string[];
    sacrificing: string[];
    strategic_insight: string;
    adjustment_option: string;
  };
  risk_assessment: Array<{
    severity: string;
    category: string;
    risk: string;
    likelihood: string;
    mitigation: string;
  }>;
  implementation_roadmap: {
    '30_days': { focus: string; actions: string[] };
    '60_days': { focus: string; actions: string[] };
    '90_days': { focus: string; actions: string[] };
  };
  executive_summary: string;
}

function extractAndValidateJSON(rawResponse: string): StrategicAnalysis | null {
  try {
    const startMarker = '<<<JSON_START>>>';
    const endMarker = '<<<JSON_END>>>';

    if (!rawResponse.includes(startMarker) || !rawResponse.includes(endMarker)) {
      console.error('[GTM Analysis] JSON markers not found');
      return null;
    }

    const startIdx = rawResponse.indexOf(startMarker) + startMarker.length;
    const endIdx = rawResponse.indexOf(endMarker);
    let jsonStr = rawResponse.substring(startIdx, endIdx).trim();

    // Remove any markdown code blocks if GPT added them
    jsonStr = jsonStr.replace(/^```json\s*/g, '').replace(/\s*```$/g, '');

    // Parse JSON
    const parsed = JSON.parse(jsonStr) as StrategicAnalysis;

    // Validate required top-level keys
    const requiredKeys = [
      'strategic_archetype',
      'kpi_analysis',
      'market_metrics',
      'strategic_recommendations',
      'executive_summary',
    ];

    const missingKeys = requiredKeys.filter(key => !(key in parsed));
    if (missingKeys.length > 0) {
      console.warn(`[GTM Analysis] Missing required keys: ${missingKeys.join(', ')}`);
    }

    return parsed;
  } catch (error: any) {
    console.error(`[GTM Analysis] JSON decode error: ${error.message}`);
    return null;
  }
}

// ===================================
// MAIN GENERATOR FUNCTION
// ===================================

// Helper function to get KPI rating
function getKPIRating(score: number): string {
  if (score <= 10) return 'Critical';
  if (score <= 30) return 'Weak';
  if (score <= 60) return 'Fair';
  if (score <= 80) return 'Good';
  return 'Excellent';
}

export async function generateGTMStrategicAnalysis(
  kpiResponse: KPIMetrics,
  requestBody: GTMInput,
  model: string = 'gpt-4o',
  temperature: number = 0.7
): Promise<StrategicAnalysis | null> {
  try {
    // Build prompt
    const prompt = buildGTMAnalysisPrompt(kpiResponse, requestBody);

    // Call GPT
    const rawResponse = await callGPTForAnalysis(prompt, model, temperature);

    if (!rawResponse) {
      console.error('[GTM Analysis] GPT call returned empty response');
      return null;
    }

    const analysis = extractAndValidateJSON(rawResponse);

    if (!analysis) {
      console.error('[GTM Analysis] JSON extraction/validation failed');
      return null;
    }

    return analysis;
  } catch (error: any) {
    console.error('[GTM Analysis] Error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

