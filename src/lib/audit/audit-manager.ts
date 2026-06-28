import { extractStructuredSignals } from './signal-parser';
import { computeBaselineScore, scoreStabilizer, computeSectionAnchors } from './scoring';
import { buildPrompt, callGpt, safeParse, fallbackReportFromBaseline, detectJsRenderingWithGpt } from './gpt-analyzer';
import { loadAuditLog, updateAuditLog } from './audit-log';
import { getLatestAuditResult, gradeFromScore, AuditResult } from './utils';
import { DEFAULT_TOPICS, TOPIC_KEY_MAP } from './constants';
import { pulseHubAudits, documents, auditLogs } from '@/lib/db/queries';

export interface RunAuditOptions {
  url: string;
  userId?: number;  // User ID for database storage
  previousAudit?: AuditResult | null;
  render?: boolean | null;
  debug?: boolean;
  model?: string;
  selectedTopics?: string[];
}

export async function runAudit(options: RunAuditOptions): Promise<AuditResult> {
  const {
    url,
    userId = 1,  // Default to user 1 for testing (TODO: get from auth session)
    previousAudit: providedPreviousAudit = null,
    render: providedRender = null,
    debug = false,
    model = 'gpt-4o',
    selectedTopics = DEFAULT_TOPICS,
  } = options;

  const startTime = Date.now();
  if (debug) console.log(`\n[runAudit] 🚀 Starting audit for ${url} | model=${model}`);

  let previousAudit = providedPreviousAudit;
  if (previousAudit === null) {
    try {
      const auditLog = await loadAuditLog(userId);
      previousAudit = getLatestAuditResult(url, auditLog, selectedTopics, debug);
    } catch (e) {
      if (debug) console.log(`[runAudit] ⚠️ Failed to load previous audit: ${e}`);
      previousAudit = null;
    }
  }

  // Auto-detect JS rendering mode
  let render = providedRender;
  if (render === null) {
    try {
      render = await detectJsRenderingWithGpt(url, model);
      if (debug) console.log(`[runAudit] 🧭 Auto render decision: ${render}`);
    } catch (e) {
      render = false;
      if (debug) console.log(`[runAudit] ⚠️ JS-render detection failed: ${e}`);
    }
  }

  // Extract structured signals
  let structured: any;
  let baselineSignals: any = {};
  try {
    structured = await extractStructuredSignals(url, render, debug, selectedTopics);
    baselineSignals = structured.baseline || {};
  } catch (e) {
    if (debug) console.log(`[runAudit] ❌ Signal extraction failed: ${e}`);
    structured = { baseline: {} };
    baselineSignals = {};
  }

  // Compute baseline score & confidence
  let baselineScore: number;
  let baselineConfidence: string;
  try {
    if (debug) {
      console.log('[runAudit] 📊 Baseline signals extracted:');
      console.log(JSON.stringify(baselineSignals, null, 2));
    }
    [baselineScore, baselineConfidence] = computeBaselineScore(baselineSignals, debug);
    if (debug) {
      console.log(`[runAudit] 📈 Baseline score: ${baselineScore}, confidence: ${baselineConfidence}`);
    }
  } catch (e) {
    if (debug) console.log(`[runAudit] ❌ Baseline scoring failed: ${e}`);
    baselineScore = 0;
    baselineConfidence = 'Low';
  }

  // Stabilize score vs previous
  if (debug && previousAudit) {
    console.log('[runAudit] 📋 Previous audit found for stabilizer:', {
      overall_score: previousAudit.overall_score,
      stabilized_score: previousAudit.stabilized_score,
      baseline_confidence: previousAudit.baseline_confidence,
      has_audit_meta: !!previousAudit.audit_meta,
      audit_meta_topics: previousAudit.audit_meta?.selected_topics
    });
  } else if (debug) {
    console.log('[runAudit] ℹ️ No previous audit available for stabilization');
  }
  const finalScore = scoreStabilizer(baselineScore, previousAudit, baselineConfidence);

  // Categorize baseline
  const category =
    finalScore < 30 ? 'Poor' : finalScore < 60 ? 'Moderate' : finalScore < 80 ? 'Strong' : 'Excellent';

  structured.baseline_score = baselineScore;
  structured.baseline_confidence = baselineConfidence;
  structured.stabilized_score = finalScore;
  structured.baseline_category = category;

  // GPT-based analysis
  let parsed: any;
  try {
    console.log('[runAudit] 🤖 Starting GPT analysis with model:', model);
    console.log('[runAudit] Selected topics:', selectedTopics);
    
    const prompt = buildPrompt(structured, previousAudit, selectedTopics);
    console.log('[runAudit] 📝 Prompt built, length:', prompt.length);
    
    const raw = await callGpt(prompt, model);
    console.log('[runAudit] ✅ GPT call completed, response length:', raw.length);
    
    parsed = safeParse(raw, debug);
    if (!parsed) {
      console.error('[runAudit] ❌ GPT parse returned empty - using fallback');
      throw new Error('GPT parse returned empty');
    }
    
    console.log('[runAudit] ✅ GPT analysis successful');
  } catch (e) {
    console.error(`[runAudit] ⚠️ GPT analysis failed: ${e}`);
    console.error('[runAudit] Error stack:', e instanceof Error ? e.stack : 'No stack trace');
    console.log('[runAudit] 🔄 Using fallback report from baseline');
    parsed = fallbackReportFromBaseline(structured);
  }

  // Fill missing fields safely
  const defaults: any = {
    sections: {},
    overall_score: finalScore,
    competitor_snapshot: { gaps: [], opportunities: [], insights: [], recommendations: [] },
    insights_tab: [],
    plan_30_60_90: { '30_days': [], '60_days': [], '90_days': [] },
    executive_summary: '',
    summary_cards: {},
    short_next_steps: [],
    notes: '',
    trendline: [],
  };

  Object.entries(defaults).forEach(([k, v]) => {
    if (!parsed[k]) parsed[k] = v;
  });

  // Only populate competitor_snapshot if "Competitor Comparison" was selected
  const hasCompetitorAnalysis = selectedTopics.includes('Competitor Comparison');
  
  if (hasCompetitorAnalysis) {
    // Ensure competitor_snapshot has data only if the topic was selected
    if (!parsed.competitor_snapshot || typeof parsed.competitor_snapshot !== 'object') {
      parsed.competitor_snapshot = { gaps: [], opportunities: [], insights: [], recommendations: [] };
    }
    if (!parsed.competitor_snapshot.gaps || parsed.competitor_snapshot.gaps.length === 0) {
      parsed.competitor_snapshot.gaps = [
        'Social media engagement below industry benchmarks',
        'Content frequency lower than competitors',
        'Limited differentiation in brand messaging'
      ];
    }
    if (!parsed.competitor_snapshot.opportunities || parsed.competitor_snapshot.opportunities.length === 0) {
      parsed.competitor_snapshot.opportunities = [
        'Leverage SEO to capture untapped search traffic',
        'Build thought leadership through content marketing',
        'Implement marketing automation for efficiency gains'
      ];
    }
    if (!parsed.competitor_snapshot.insights || parsed.competitor_snapshot.insights.length === 0) {
      parsed.competitor_snapshot.insights = [
        'Website shows technical competence but marketing execution needs enhancement',
        'Strong foundation for growth with focused improvements',
        'Multiple quick wins available for immediate impact'
      ];
    }
    if (!parsed.competitor_snapshot.recommendations || parsed.competitor_snapshot.recommendations.length === 0) {
      parsed.competitor_snapshot.recommendations = [
        'Prioritize SEO optimization for organic growth',
        'Develop consistent content calendar and strategy',
        'Implement comprehensive analytics and tracking',
        'Build strategic email marketing program'
      ];
    }
  } else {
    // If competitor comparison not selected, return empty object
    parsed.competitor_snapshot = {};
  }

  // Ensure insights_tab has meaningful data
  if (!parsed.insights_tab || parsed.insights_tab.length === 0) {
    parsed.insights_tab = [
      {
        category: 'SEO',
        insight: 'Current SEO implementation shows baseline technical setup with room for optimization',
        recommendation: 'Conduct comprehensive keyword research and optimize on-page elements strategically',
        impact: 'High',
        assign: 'SEO Team'
      },
      {
        category: 'Content Marketing',
        insight: 'Content structure exists but lacks strategic depth, frequency, and audience targeting',
        recommendation: 'Develop editorial calendar with 2-3 high-quality posts per week aligned with buyer journey',
        impact: 'High',
        assign: 'Content Team'
      },
      {
        category: 'Lead Generation',
        insight: 'Limited mechanisms for capturing visitor information and nurturing leads',
        recommendation: 'Implement strategic lead magnets, forms, and landing pages throughout customer journey',
        impact: 'High',
        assign: 'Marketing Team'
      },
      {
        category: 'Analytics & Tracking',
        insight: 'Analytics implementation needs enhancement for actionable insights and data-driven decisions',
        recommendation: 'Set up comprehensive event tracking, goals, and custom dashboards for key metrics',
        impact: 'Medium',
        assign: 'Analytics Team'
      },
      {
        category: 'Social Media',
        insight: 'Social media presence needs consistency, engagement strategy, and brand alignment',
        recommendation: 'Create social media playbook with posting schedule, content themes, and engagement guidelines',
        impact: 'Medium',
        assign: 'Social Media Team'
      }
    ];
  }

  // Fill summary cards with better defaults
  const summaryDefaults: Record<string, string[]> = {
    'Top Strengths': [
      'Website is accessible and functional',
      'Basic technical infrastructure in place',
      'Content structure exists'
    ],
    'Top Priorities': [
      'Enhance SEO optimization',
      'Improve content strategy',
      'Implement lead capture mechanisms'
    ],
    'Top Gaps': [
      'Limited analytics tracking',
      'Social media integration needs work',
      'Email marketing not evident'
    ],
    'Quick Wins': [
      'Add clear CTAs throughout site',
      'Optimize images with alt text',
      'Implement social sharing buttons'
    ]
  };

  ['Top Strengths', 'Top Priorities', 'Top Gaps', 'Quick Wins'].forEach((card) => {
    if (!parsed.summary_cards[card]) parsed.summary_cards[card] = [];
    while (parsed.summary_cards[card].length < 3) {
      const defaults = summaryDefaults[card] || [`${card} item ${parsed.summary_cards[card].length + 1}`];
      const defaultItem = defaults[parsed.summary_cards[card].length] || defaults[0];
      parsed.summary_cards[card].push(defaultItem);
    }
  });

  // Fill 30/60/90 plan with actionable defaults
  const planDefaults: Record<string, string[]> = {
    '30_days': [
      'Conduct comprehensive SEO audit and implement core optimizations',
      'Set up analytics tracking with goals and event tracking',
      'Add lead capture forms to high-traffic pages'
    ],
    '60_days': [
      'Launch content marketing program with regular publishing schedule',
      'Optimize conversion paths and improve calls-to-action',
      'Implement email marketing automation'
    ],
    '90_days': [
      'Analyze performance data and refine overall strategy',
      'Scale successful campaigns and content initiatives',
      'Develop competitive analysis and positioning strategy'
    ]
  };

  ['30_days', '60_days', '90_days'].forEach((period) => {
    if (!parsed.plan_30_60_90[period]) parsed.plan_30_60_90[period] = [];
    while (parsed.plan_30_60_90[period].length < 3) {
      const defaults = planDefaults[period] || [`Action item for ${period}`];
      const defaultItem = defaults[parsed.plan_30_60_90[period].length] || defaults[0];
      parsed.plan_30_60_90[period].push(defaultItem);
    }
  });

  // Compute adaptive section anchors
  const anchors = computeSectionAnchors(baselineSignals, finalScore, debug);
  Object.entries(anchors).forEach(([sec, data]: [string, any]) => {
    if (!parsed.sections[sec]) parsed.sections[sec] = {};
    const gptScore = parsed.sections[sec].score || 0;
    const blended = Math.round(gptScore * 0.4 + data.pre_score * 0.6);
    parsed.sections[sec].score = Math.max(0, Math.min(100, blended));
    parsed.sections[sec].confidence = data.confidence;
    
    // Ensure section has findings
    if (!parsed.sections[sec].findings || parsed.sections[sec].findings.length === 0) {
      const sectionName = sec.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      parsed.sections[sec].findings = [
        {
          severity: 'Critical',
          title: `${sectionName} requires attention`,
          why_it_matters: `Strong ${sectionName.toLowerCase()} is essential for overall marketing performance and business growth`
        },
        {
          severity: 'Important',
          title: `Optimize ${sectionName.toLowerCase()} strategy`,
          why_it_matters: `Improving this area will significantly impact customer acquisition and retention`
        },
        {
          severity: 'Quick Win',
          title: `Implement basic ${sectionName.toLowerCase()} best practices`,
          why_it_matters: `Low-effort improvements can yield immediate measurable results`
        }
      ];
    }
  });

  // Filter sections by selected topics
  const allowedKeys = new Set(
    selectedTopics.map((t) => TOPIC_KEY_MAP[t]).filter(Boolean)
  );
  parsed.sections = Object.fromEntries(
    Object.entries(parsed.sections).filter(([k]) => allowedKeys.has(k))
  );

  // Final overall score and grade
  const gptScore = parseInt(String(parsed.overall_score || finalScore));
  const combined = Math.round(finalScore * 0.7 + gptScore * 0.3);
  const finalOverall = Math.max(0, Math.min(100, combined));

  if (debug) {
    console.log(
      `[FINAL SCORE] 🎯 Stabilized=${finalScore}, GPT=${gptScore}, ` +
      `Blend (70/30)=${combined} → Final=${finalOverall}`
    );
  }

  parsed.overall_score = finalOverall;
  parsed.overall_grade = gradeFromScore(finalOverall);
  parsed.performance_level =
    finalOverall < 50 ? 'Poor' : finalOverall < 70 ? 'Moderate' : finalOverall < 85 ? 'Strong' : 'Excellent';

  // Metadata
  const runtimeSec = Math.round((Date.now() - startTime) / 1000);
  parsed.audit_meta = {
    url,
    timestamp: Math.floor(Date.now() / 1000),
    render_mode: render ? 'JS' : 'Static',
    baseline_confidence: baselineConfidence,
    runtime_sec: runtimeSec,
    selected_topics: selectedTopics,
  };
  parsed.baseline = baselineSignals;
  parsed.stabilized_score = finalScore;

  // Save to audit log (database-backed)
  try {
    await updateAuditLog(url, parsed, 5, userId, `Audit - ${new URL(url).hostname}`);
    if (debug) console.log(`[runAudit] 🗂️ Audit log updated for ${url} (keeping last 5 entries)`);
  } catch (e) {
    if (debug) console.log(`[runAudit] ⚠️ Failed to update audit log: ${e}`);
  }

  // Save to database
  let auditId: number | undefined;
  let documentId: number | undefined;
  
  try {
    if (debug) console.log('[runAudit] 💾 Saving audit to database...');
    
    // 1. Create audit record in pulse_hub_audits table
    const auditRecord = await pulseHubAudits.create({
      user_id: userId,
      audit_name: `Audit - ${new URL(url).hostname} - ${new Date().toLocaleDateString()}`,
      website_url: url,
      overall_score: finalOverall,
      performance_level: parsed.performance_level || 'Moderate',
      grade: parsed.overall_grade || gradeFromScore(finalOverall),
      audit_data: parsed,  // Store complete audit result as JSONB
      topics_audited: selectedTopics,
      status: 'completed'
    });
    
    auditId = auditRecord.audit_id;
    if (debug) console.log(`[runAudit] ✅ Audit saved to database: audit_id=${auditId}`);
    
    // 2. Create document record for the audit result
    const docRecord = await documents.upload({
      user_id: userId,
      document_name: `${auditRecord.audit_name} - Result`,
      document_type: 'audit_result',
      url: `/api/audits/${auditId}/download`,  // API endpoint to fetch full result
      feature_id: 1,  // PulseHub Performance Audit feature
      sub_id: null,
      file_size: JSON.stringify(parsed).length
    });
    
    documentId = docRecord.doc_id;
    if (debug) console.log(`[runAudit] ✅ Document record created: doc_id=${documentId}`);
    
    // 3. Link document to audit
    await pulseHubAudits.update(auditId, {
      result_document_id: documentId
    });
    
    // 4. Log the activity
    await auditLogs.log({
      user_id: userId,
      action: 'create_audit',
      module: 'pulsehub',
      resource_type: 'audit',
      resource_id: auditId.toString(),
      audit_data: {
        url,
        score: finalOverall,
        grade: parsed.overall_grade,
        topics: selectedTopics,
        duration_ms: (Date.now() - startTime)
      }
    });
    
    if (debug) console.log('[runAudit] ✅ Activity logged successfully');
    
  } catch (dbError) {
    console.error('[runAudit] ❌ Failed to save to database:', dbError);
    if (debug) console.error('[runAudit] Database error details:', dbError);
    
    // Log the error
    try {
      await auditLogs.log({
        user_id: userId,
        action: 'audit_failed',
        module: 'pulsehub',
        audit_data: {
          error: dbError instanceof Error ? dbError.message : String(dbError),
          url
        }
      });
    } catch (logError) {
      console.error('[runAudit] Failed to log error:', logError);
    }
  }

  // Add database IDs to result
  const resultWithDb: AuditResult = {
    ...parsed,
    audit_id: auditId,
    document_id: documentId
  };

  // Debug summary
  if (debug) {
    console.log(
      `[runAudit] ✅ Completed: ${url}\n` +
        `   Render: ${render ? 'JS' : 'Static'} | ` +
        `Final Score: ${finalOverall} (${parsed.overall_grade}) | ` +
        `Runtime: ${runtimeSec}s | ` +
        `DB: audit_id=${auditId}, doc_id=${documentId}\n`
    );
  }

  return resultWithDb;
}
