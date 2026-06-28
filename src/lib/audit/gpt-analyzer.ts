import OpenAI from 'openai';
import { AuditResult, safeGet } from './utils';
import { gradeFromScore } from './utils';
import { computeBaselineScore, computeSectionAnchors } from './scoring';

// Lazy load OpenAI client to avoid build-time initialization
let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const USER_RULES_BLOCK = `
You are a **Marketing Intelligence Analyst**. Generate a comprehensive, factual, and professional **marketing audit** strictly in **valid JSON format** — no commentary, Markdown, or text outside JSON.
The output must reflect the *real* state of the analyzed website using STRUCTURED_FACTS provided.

================================================================================
GENERAL REQUIREMENTS
================================================================================
- Derive all insights and scores logically from STRUCTURED_FACTS and BASELINE_SCORE.
- If any data signals are missing do not include it in the report.
- Maintain a factual, analytical, and business-professional tone.
- Avoid repetition across sections — each insight should be unique.
- The JSON must be fully parseable (no trailing commas, quotes, etc.).
- All numeric values must be integers; text fields must use double quotes.

================================================================================
JSON STRUCTURE (TOP-LEVEL KEYS)
================================================================================
Your output must include **exactly these keys** at the top level:

{
  "audit_meta": {},
  "overall_score": int,
  "overall_grade": "A|B|C|D|F",
  "performance_level": "Excellent|Strong|Moderate|Poor",
  "executive_summary": "5–6 sentence analytical summary",
  "summary_cards": {},
  "sections": {},
  "competitor_snapshot": {},
  "insights_tab": [],
  "plan_30_60_90": {},
  "short_next_steps": [],
  "notes": "",
  "trendline": []
}

================================================================================
SUMMARY_CARDS
================================================================================
- Create **exactly 4 cards**:
  1. "Top Strengths" — Key strong areas proven by STRUCTURED_FACTS.
  2. "Top Priorities" — High-impact actions that need immediate attention.
  3. "Top Gaps" — Missing or weak signals.
  4. "Quick Wins" — Low-effort improvements that can yield fast results.
- Each card must be an **array of 2–5 bullet points**, phrased concisely.
- Use data-driven, non-repetitive phrasing aligned with baseline readiness.

================================================================================
SECTIONS
================================================================================
Include the following sections with detailed findings if some of the sections are missing then do not include the missing sections.

Each section must include:
{
  "score": int (0–100),
  "confidence": "Low|Medium|High",
  "findings": [
    {
      "severity": "Critical|Important|Quick Win",
      "title": "short headline of the issue or recommendation",
      "why_it_matters": "one-sentence explanation derived from STRUCTURED_FACTS"
    }
  ]
}

Rules:
- Include as many findings as relevant for each severity level (Critical, Important, Quick Win).
- You are NOT limited to one finding per severity level - include all important findings.
- Scores must correlate with BASELINE_SCORE and signal strength.
  * Low baseline → lower scores and multiple critical findings
  * Mid baseline → balanced strengths and weaknesses
  * High baseline → strong results and limited critical issues

================================================================================
COMPETITOR_SNAPSHOT
================================================================================
ONLY INCLUDE THIS SECTION IF "Competitor Comparison" IS IN THE SELECTED_TOPICS LIST.
If included, provide relative comparisons even if competitors are unnamed.
Must contain **four arrays** (each 2–4 actionable items):
{
  "gaps": [],
  "opportunities": [],
  "insights": [],
  "recommendations": []
}
Each item should be factual, specific, and based on STRUCTURED_FACTS.
If "Competitor Comparison" is NOT selected, set this to an empty object: {}

================================================================================
INSIGHTS_TAB
================================================================================
Provide concise insights derived from data signals.
Each insight **MUST** follow the below json layout but only include the categories present in SECTION_ANCHORS:
{
  "category": "Example Category",
  "impact": "qualitative or numeric impact (e.g. +5% traffic)",
  "insight": "factual observation",
  "recommendation": "actionable next step",
  "assign": "responsible role"
}

================================================================================
PLAN_30_60_90
================================================================================
Create a structured plan with **three keys**:
{
  "30_days": [],
  "60_days": [],
  "90_days": []
}
Each array must contain **≥3 actionable tasks**, each phrased specifically and measurably.
Avoid generic or repetitive items.

================================================================================
EXECUTIVE_SUMMARY
================================================================================
- Must consist of exactly **5–6 sentences**.
- Cover strengths, weaknesses, urgent issues, and opportunities.
- Avoid lists or bullet points.
- Maintain concise, professional language consistent with baseline readiness.

================================================================================
OUTPUT RULES
================================================================================
1. Output only valid JSON between <<<JSON_START>>> and <<<JSON_END>>>.
2. Do NOT include Markdown, explanations, or text outside those markers.
3. Populate all required fields; if any data is missing, insert a placeholder like "Data unavailable" inside "notes".
4. Ensure the final JSON parses successfully with no syntax errors.
`;

export async function detectJsRenderingWithGpt(url: string, model: string = 'gpt-4o', timeout: number = 10000): Promise<boolean> {
  try {
    const response = await safeGet(url);
    const html = response?.text || '';

    // Count scripts
    const scriptCount = (html.toLowerCase().match(/<script/g) || []).length;
    const textLength = html.replace(/<[^>]*>/g, '').trim().length;

    // Enhanced JS Heuristics (expanded keywords for better detection)
    const jsKeywords = [
      'react', 'next.js', 'vue', 'svelte', 'webpack', 'bundle.js', 'hydration', 'root.render',
      'angular', 'app.js', 'main.js', '__next', '_app', 'gatsby', 'nuxt', 'ember',
      'data-react', 'data-reactroot', 'ng-app', 'v-app', 'alpine', 'htmx',
      'wp-content', 'wp-includes', 'elementor', 'divi', 'avada'
    ];
    const jsSignature = jsKeywords.some((k) => html.toLowerCase().includes(k));

    // Heuristic for JS rendering (balanced thresholds)
    const jsRatio = scriptCount / Math.max(textLength, 1);
    // Balanced detection: detect JS frameworks or truly minimal content
    const heuristicJs = jsSignature || jsRatio > 0.01 || scriptCount > 20 || textLength < 8000;
    
    console.log(`[detectJsRenderingWithGpt] Debug: scriptCount=${scriptCount}, textLength=${textLength}, jsRatio=${jsRatio.toFixed(4)}, jsSignature=${jsSignature}`);

    // GPT fallback (if uncertain)
    let gptJs = false;
    if (heuristicJs && !jsSignature) {
      const prompt = `Is the website ${url} primarily JavaScript-rendered or a single-page app (SPA)? Answer only 'yes' or 'no'.`;
      const gptResponse = await getOpenAIClient().chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a senior web technology auditor.' },
          { role: 'user', content: prompt },
        ],
      });
      const answer = gptResponse.choices[0]?.message?.content?.trim().toLowerCase() || '';
      gptJs = answer.includes('yes');
    }

    const jsRendered = heuristicJs || gptJs;

    console.log(
      `[detectJsRenderingWithGpt] ${url} -> ${jsRendered ? 'JS-rendered' : 'Static'} ` +
        `(heuristic=${heuristicJs}, js_signature=${jsSignature}, GPT=${gptJs}, scripts=${scriptCount}, text=${textLength})`
    );

    return jsRendered;
  } catch (error) {
    console.error('[detectJsRenderingWithGpt] error:', error);
    return false;
  }
}

export function buildPrompt(structured: any, previousAudit: any = null, selectedTopics: string[]): string {
  // Build structured facts summary (matching Python version)
  const factsSummary = {
    title_present: !!structured.title,
    meta_description_present: !!structured.meta_description,
    canonical_present: structured.canonical || false,
    robots_meta_present: structured.robots_meta || false,
    h1_count: structured.h1_count || 0,
    forms_count: structured.forms_count || 0,
    has_email_input: structured.has_email_input || false,
    cta_count: structured.cta_count || 0,
    social_profiles_count: (structured.social_profiles || []).length,
    blog_urls_count: (structured.blog_urls || []).length,
    article_count: structured.article_count || 0,
    word_count: structured.word_count || 0,
    analytics_count: (structured.analytics_found || []).length,
    paid_ads_count: (structured.paid_found || []).length,
    email_present: structured.email_present || false,
    logo: structured.logo || false,
    favicon: structured.favicon || false,
  };

  const factsJson = JSON.stringify(factsSummary, null, 2);
  const baselineSignals = structured.baseline || {};

  // Compute baseline score and confidence (matching Python)
  const [baselineScore, baselineConfidence] = computeBaselineScore(baselineSignals, false);
  
  // Compute section anchors
  const anchors = computeSectionAnchors(baselineSignals, baselineScore, false);
  
  // Filter out sections with zero signals
  const filteredAnchors = Object.fromEntries(
    Object.entries(anchors).filter(([_, info]: [string, any]) => {
      return !((info.pre_score || 0) === 0);
    })
  );
  
  const anchorsJson = JSON.stringify(filteredAnchors, null, 2);
  const prevJson = previousAudit ? JSON.stringify(previousAudit, null, 2) : 'null';

  const prompt = `
You are a Marketing Intelligence Analyst AI model.
Your goal is to generate a complete marketing audit based on the structured facts below.

SELECTED_TOPICS: ${JSON.stringify(selectedTopics)}

Analyze ONLY the following sections: ${selectedTopics.join(', ')}.
### Strict Rules:
- Discuss and provide insights **only** for the sections listed in ${JSON.stringify(selectedTopics)}.
- If a section is **not listed**, completely ignore it — do not mention, imply, or recommend anything about it.
- IMPORTANT: If "Competitor Comparison" is NOT in the selected topics, set competitor_snapshot to an empty object {}.
- Each selected section should be analyzed **independently** and clearly, based **solely on the structured facts provided** — no assumptions beyond the data.
- You must completely ignore any data, signals, or structured facts that belong to unselected topics. If a signal is unrelated to the topics in ${JSON.stringify(selectedTopics)}, act as if it does not exist.

Follow all instructions in USER_RULES strictly.
Output ONLY JSON enclosed between <<<JSON_START>>> and <<<JSON_END>>>.
Do NOT include any explanation, markdown, or commentary.

BASELINE_SCORE: ${baselineScore}
BASELINE_CONFIDENCE: ${baselineConfidence}

SECTION_ANCHORS:
${anchorsJson}

STRUCTURED_FACTS:
${factsJson}

PREVIOUS_AUDIT:
${prevJson}

# ---------------- USER RULES BLOCK ----------------
${USER_RULES_BLOCK}
# ---------------- END USER RULES ----------------

Now produce your final, valid JSON report.

<<<JSON_START>>>
(Your JSON object begins here — must be valid)
<<<JSON_END>>>
`;

  return prompt;
}

export async function callGpt(prompt: string, model: string = 'gpt-4o', temperature: number = 0.5): Promise<string> {
  console.log('[callGpt] 🚀 Starting GPT call with model:', model);
  console.log('[callGpt] API Key present:', !!process.env.OPENAI_API_KEY);
  console.log('[callGpt] Prompt length:', prompt.length);
  
  try {
    console.log('[callGpt] 📡 Making API request to OpenAI...');
    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert marketing intelligence analyst. ' +
            'Always return the audit ONLY as JSON wrapped between <<<JSON_START>>> and <<<JSON_END>>>. ' +
            'Do NOT include any explanations or text outside these markers.',
        },
        { role: 'user', content: prompt },
      ],
      temperature,
    });

    const raw = response.choices[0]?.message?.content?.trim() || '';
    console.log('[callGpt] ✅ Received response from OpenAI');
    console.log('[callGpt] Response content length:', raw.length);

    // Check if GPT failed to include JSON markers, retry once automatically
    if (!raw.includes('<<<JSON_START>>>') || !raw.includes('<<<JSON_END>>>')) {
      console.log('[callGpt] ⚠️ Missing JSON markers, retrying once...');
      const retryResponse = await getOpenAIClient().chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You must output only JSON between <<<JSON_START>>> and <<<JSON_END>>>. ' +
              'Retry and ensure the response follows the format strictly.',
          },
          { role: 'user', content: prompt },
        ],
        temperature,
      });
      const retryRaw = retryResponse.choices[0]?.message?.content?.trim() || '';
      console.log('[callGpt] 🔁 Retry received, length:', retryRaw.length);
      return retryRaw;
    }

    return raw;
  } catch (error) {
    console.error('[callGpt] ❌ ERROR:', error);
    console.error('[callGpt] Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export function safeParse(raw: string, debug: boolean = false): any | null {
  console.log('[safeParse] 🔍 Parsing GPT response, length:', raw.length);
  console.log('[safeParse] First 200 chars:', raw.substring(0, 200));
  
  try {
    // Extract JSON between <<<JSON_START>>> and <<<JSON_END>>> markers (matching Python)
    const match = raw.match(/<<<JSON_START>>>\s*(\{[\s\S]*?\})\s*<<<JSON_END>>>/);
    if (match) {
      const jsonStr = match[1].trim();
      console.log('[safeParse] Extracted JSON from markers, length:', jsonStr.length);
      
      const parsed = JSON.parse(jsonStr);
      console.log('[safeParse] ✅ Successfully parsed JSON');
      console.log('[safeParse] Parsed keys:', Object.keys(parsed));
      
      return parsed;
    } else {
      // Fallback: try to extract from markdown code blocks
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1].trim();
        console.log('[safeParse] Extracted JSON from markdown, length:', jsonStr.length);
        
        const parsed = JSON.parse(jsonStr);
        console.log('[safeParse] ✅ Successfully parsed JSON');
        console.log('[safeParse] Parsed keys:', Object.keys(parsed));
        
        return parsed;
      } else {
        // Last resort: try parsing the whole response
        const parsed = JSON.parse(raw.trim());
        console.log('[safeParse] ✅ Parsed raw response as JSON');
        return parsed;
      }
    }
  } catch (error) {
    console.error('[safeParse] ❌ Failed to parse GPT response:', error);
    console.error('[safeParse] JSON markers found:', raw.includes('<<<JSON_START>>>'));
    console.error('[safeParse] Raw response sample (first 500 chars):', raw.substring(0, 500));
    return null;
  }
}

export function fallbackReportFromBaseline(structured: any): AuditResult {
  const baseline = structured.baseline || {};
  const score = structured.stabilized_score || structured.baseline_score || 50;

  // Generate basic sections based on baseline signals
  const sections: any = {};
  
  if (baseline.seo !== undefined) {
    const seoScore = Math.round((baseline.seo || 0) * 100);
    sections.website_seo = {
      score: seoScore,
      confidence: 'Medium',
      findings: [
        {
          severity: 'Critical',
          title: baseline.seo > 0.6 ? 'SEO fundamentals are in place' : 'Missing critical SEO elements',
          why_it_matters: 'SEO is essential for organic visibility and search rankings'
        },
        {
          severity: 'Important',
          title: 'Meta descriptions and title tags need review',
          why_it_matters: 'These elements directly impact click-through rates from search results'
        },
        {
          severity: 'Quick Win',
          title: 'Optimize heading structure',
          why_it_matters: 'Proper H1-H6 hierarchy improves both SEO and user experience'
        }
      ]
    };
  }

  if (baseline.content !== undefined) {
    const contentScore = Math.round((baseline.content || 0) * 100);
    sections.content_marketing = {
      score: contentScore,
      confidence: 'Medium',
      findings: [
        {
          severity: 'Critical',
          title: baseline.content > 0.5 ? 'Content foundation exists' : 'Limited content presence',
          why_it_matters: 'Quality content drives engagement and establishes authority'
        },
        {
          severity: 'Important',
          title: 'Increase content depth and frequency',
          why_it_matters: 'Regular, valuable content improves SEO and audience retention'
        },
        {
          severity: 'Quick Win',
          title: 'Optimize existing content for keywords',
          why_it_matters: 'Small optimizations can yield significant SEO improvements'
        }
      ]
    };
  }

  if (baseline.social !== undefined) {
    const socialScore = Math.round((baseline.social || 0) * 100);
    sections.social_media = {
      score: socialScore,
      confidence: 'Medium',
      findings: [
        {
          severity: 'Critical',
          title: baseline.social > 0.5 ? 'Social media presence detected' : 'Limited social media integration',
          why_it_matters: 'Social media extends reach and builds community engagement'
        },
        {
          severity: 'Important',
          title: 'Strengthen social media consistency',
          why_it_matters: 'Consistent branding across platforms builds trust and recognition'
        },
        {
          severity: 'Quick Win',
          title: 'Add social sharing buttons',
          why_it_matters: 'Make it easy for visitors to share your content'
        }
      ]
    };
  }

  return {
    overall_score: score,
    overall_grade: gradeFromScore(score),
    performance_level: score >= 70 ? 'Strong' : score >= 50 ? 'Moderate' : 'Poor',
    executive_summary: `This website audit reveals a baseline score of ${score} based on technical analysis. ${
      score >= 70 
        ? 'The site demonstrates solid fundamentals across key marketing areas.' 
        : score >= 50 
        ? 'The site shows moderate performance with opportunities for improvement.' 
        : 'The site requires significant improvements across multiple marketing channels.'
    } Key findings include SEO configuration, content presence, and social media integration. Immediate focus should be on addressing critical gaps while leveraging existing strengths. This analysis provides a foundation for strategic marketing improvements.`,
    summary_cards: {
      'Top Strengths': [
        baseline.seo > 0.6 ? 'Strong SEO foundation with meta tags' : 'Website is accessible and functional',
        baseline.content > 0.5 ? 'Content structure is established' : 'Basic content framework present',
        baseline.ux_score > 0.5 ? 'Good user experience design' : 'Functional website layout'
      ],
      'Top Priorities': [
        baseline.seo < 0.5 ? 'Improve SEO fundamentals immediately' : 'Enhance advanced SEO techniques',
        baseline.content < 0.5 ? 'Develop comprehensive content strategy' : 'Optimize content for conversions',
        baseline.analytics < 0.5 ? 'Implement robust analytics tracking' : 'Leverage analytics for insights'
      ],
      'Top Gaps': [
        baseline.lead_gen < 0.5 ? 'Limited lead capture mechanisms' : 'Lead generation needs optimization',
        baseline.email_marketing < 0.5 ? 'Email marketing not evident' : 'Email strategy needs enhancement',
        baseline.paid_ads < 0.5 ? 'No paid advertising detected' : 'Paid advertising needs review'
      ],
      'Quick Wins': [
        'Add clear call-to-action buttons throughout site',
        'Optimize images with alt text for better SEO',
        'Implement social sharing functionality',
        'Add email signup form to capture leads'
      ],
    },
    sections,
    competitor_snapshot: {},
    insights_tab: [
      {
        category: 'SEO',
        insight: 'Current SEO implementation shows baseline technical setup',
        recommendation: 'Conduct keyword research and optimize on-page elements',
        impact: 'High',
        assign: 'SEO Team'
      },
      {
        category: 'Content',
        insight: 'Content exists but lacks strategic depth and frequency',
        recommendation: 'Create editorial calendar with 2-3 posts per week',
        impact: 'High',
        assign: 'Content Team'
      },
      {
        category: 'Lead Generation',
        insight: 'Limited mechanisms for capturing visitor information',
        recommendation: 'Add strategic lead magnets and forms throughout site',
        impact: 'High',
        assign: 'Marketing Team'
      },
      {
        category: 'Analytics',
        insight: 'Analytics tracking needs enhancement for better insights',
        recommendation: 'Implement comprehensive event tracking and goals',
        impact: 'Medium',
        assign: 'Analytics Team'
      },
      {
        category: 'Social Media',
        insight: 'Social presence needs consistency and engagement',
        recommendation: 'Develop social media strategy with regular posting schedule',
        impact: 'Medium',
        assign: 'Social Team'
      }
    ],
    plan_30_60_90: {
      '30_days': [
        'Implement core SEO optimizations (meta tags, headers, alt text)',
        'Set up comprehensive analytics tracking with goals and events',
        'Add lead capture forms to high-traffic pages',
        'Create content calendar for next 90 days'
      ],
      '60_days': [
        'Launch content marketing program with weekly blog posts',
        'Optimize conversion paths and improve CTAs',
        'Implement email marketing automation',
        'Enhance social media presence with consistent posting'
      ],
      '90_days': [
        'Analyze performance data and refine strategy',
        'Scale successful campaigns and content types',
        'Implement advanced marketing automation',
        'Develop competitor analysis and positioning strategy'
      ],
    },
    short_next_steps: [
      'Audit and optimize all page titles and meta descriptions',
      'Install heat mapping tool to understand user behavior',
      'Create lead magnet and implement signup forms',
      'Set up weekly content creation workflow',
      'Implement comprehensive analytics event tracking'
    ],
    notes: 'This report is generated from baseline technical analysis. For more detailed insights, consider running a comprehensive audit with GPT analysis enabled.',
    baseline,
  };
}
