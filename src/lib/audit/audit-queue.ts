/**
 * Audit Queue Manager
 * Handles queuing and processing of audits to prevent concurrent execution
 */

import { pulseHubAudits, documents, auditLogs } from '@/lib/db/queries';
import { extractStructuredSignals } from './signal-parser';
import { computeBaselineScore, scoreStabilizer, computeSectionAnchors } from './scoring';
import { buildPrompt, callGpt, safeParse, fallbackReportFromBaseline, detectJsRenderingWithGpt } from './gpt-analyzer';
import { loadAuditLog, updateAuditLog } from './audit-log';
import { getLatestAuditResult, gradeFromScore, AuditResult } from './utils';
import { DEFAULT_TOPICS, TOPIC_KEY_MAP } from './constants';

interface QueuedAudit {
  auditId: number;
  options: RunAuditOptions;
  retries: number;
}

interface RunAuditOptions {
  url: string;
  userId?: number;
  previousAudit?: AuditResult | null;
  render?: boolean | null;
  debug?: boolean;
  model?: string;
  selectedTopics?: string[];
  auditName?: string;
}

class AuditQueueManager {
  private queue: QueuedAudit[] = [];
  private isProcessing: boolean = false;
  private currentAuditId: number | null = null;

  /**
   * Add audit to queue and create database entry with processing/pending status
   */
  async enqueueAudit(options: RunAuditOptions): Promise<number> {
    const { url, userId = 1, selectedTopics = [] } = options;

    // Determine status: processing if queue is empty, pending otherwise
    const status = this.queue.length === 0 && !this.isProcessing ? 'processing' : 'pending';

    console.log(`[AuditQueue] Creating audit with name: "${options.auditName}"`);

    // Create audit record in database with initial status
    const auditRecord = await pulseHubAudits.create({
      user_id: userId,
      audit_name: options.auditName || `Audit - ${new URL(url).hostname} - ${new Date().toLocaleDateString()}`,
      website_url: url,
      overall_score: 0,
      performance_level: 'Pending',
      grade: 'N/A',
      audit_data: {},
      topics_audited: selectedTopics,
      status: status
    });

    const auditId = auditRecord.audit_id;

    // Add to queue
    this.queue.push({
      auditId,
      options,
      retries: 0
    });

    console.log(`[AuditQueue] Enqueued audit ${auditId} with status: ${status}`);

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }

    return auditId;
  }

  /**
   * Process audits in queue one by one
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const queuedAudit = this.queue.shift();
      if (!queuedAudit) break;

      this.currentAuditId = queuedAudit.auditId;

      try {
        console.log(`[AuditQueue] Processing audit ${queuedAudit.auditId}...`);

        // Update status to processing
        await pulseHubAudits.update(queuedAudit.auditId, {
          status: 'processing'
        });

        // Run the audit inline (modified version of runAudit)
        const result = await this.executeAudit(queuedAudit.auditId, queuedAudit.options);

        console.log(`[AuditQueue] Completed audit ${queuedAudit.auditId}`);

      } catch (error: any) {
        console.error(`[AuditQueue] Failed audit ${queuedAudit.auditId}:`, error);

        // Retry logic (max 2 retries)
        if (queuedAudit.retries < 2) {
          queuedAudit.retries++;
          this.queue.push(queuedAudit);
          console.log(`[AuditQueue] Retrying audit ${queuedAudit.auditId} (attempt ${queuedAudit.retries + 1}/3)`);
        } else {
          // Mark as failed after max retries
          await pulseHubAudits.update(queuedAudit.auditId, {
            status: 'failed',
            audit_data: {
              error: error.message,
              stack: error.stack
            }
          });
          console.log(`[AuditQueue] Marked audit ${queuedAudit.auditId} as failed after 3 attempts`);
        }
      }

      this.currentAuditId = null;
    }

    this.isProcessing = false;
    console.log('[AuditQueue] Queue processing completed');
  }

  /**
   * Get current queue status
   */
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      currentAuditId: this.currentAuditId,
      queueLength: this.queue.length,
      pendingAudits: this.queue.map(q => ({
        auditId: q.auditId,
        url: q.options.url,
        retries: q.retries
      }))
    };
  }

  /**
   * Execute audit - runs the full audit process inline
   */
  private async executeAudit(auditId: number, options: RunAuditOptions): Promise<AuditResult> {
    const {
      url,
      userId = 1,
      previousAudit: providedPreviousAudit = null,
      render: providedRender = null,
      debug: userDebug = false,
      model = 'gpt-4o',
      selectedTopics = DEFAULT_TOPICS,
    } = options;

    // Force debug mode to see all signals and processing
    const debug = true;

    const startTime = Date.now();
    console.log(`\n[AuditQueue.executeAudit] 🚀 Starting audit ${auditId} for ${url}`);
    console.log(`[AuditQueue] Configuration:`, {
      url,
      userId,
      model,
      selectedTopics,
      render: providedRender
    });

    // Load previous audit
    let previousAudit = providedPreviousAudit;
    if (previousAudit === null) {
      try {
        if (debug) console.log(`[AuditQueue] 📋 Loading previous audit history...`);
        const auditLog = await loadAuditLog(userId);
        previousAudit = getLatestAuditResult(url, auditLog, selectedTopics, debug);
        if (debug && previousAudit) {
          console.log('[AuditQueue] 📋 Previous audit found for stabilizer:', {
            overall_score: previousAudit.overall_score,
            stabilized_score: previousAudit.stabilized_score,
            baseline_confidence: previousAudit.audit_meta?.baseline_confidence
          });
        } else if (debug) {
          console.log('[AuditQueue] ℹ️ No previous audit available for stabilization');
        }
      } catch (e) {
        if (debug) console.log(`[AuditQueue] ⚠️ Failed to load previous audit: ${e}`);
        previousAudit = null;
      }
    }

    // Auto-detect JS rendering mode
    let render = providedRender;
    if (render === null) {
      try {
        render = await detectJsRenderingWithGpt(url, model);
        if (debug) console.log(`[AuditQueue] 🧭 Auto render decision: ${render}`);
      } catch (e) {
        render = false;
        if (debug) console.log(`[AuditQueue] ⚠️ JS-render detection failed: ${e}`);
      }
    }

    // Extract structured signals
    let structured: any;
    let baselineSignals: any = {};
    try {
      if (debug) console.log(`[AuditQueue] 🔍 Extracting structured signals for ${url}...`);
      structured = await extractStructuredSignals(url, render, debug, selectedTopics);
      baselineSignals = structured.baseline || {};
      if (debug) {
        console.log('[AuditQueue] ✅ Signal extraction complete');
        console.log('[AuditQueue] 📊 Baseline signals:', JSON.stringify(baselineSignals, null, 2));
      }
    } catch (e) {
      if (debug) console.log(`[AuditQueue] ❌ Signal extraction failed: ${e}`);
      structured = { baseline: {} };
      baselineSignals = {};
    }

    // Compute baseline score & confidence
    let baselineScore: number;
    let baselineConfidence: string;
    try {
      if (debug) console.log(`[AuditQueue] 📈 Computing baseline score...`);
      [baselineScore, baselineConfidence] = computeBaselineScore(baselineSignals, debug);
      if (debug) {
        console.log(`[AuditQueue] 📈 Baseline score: ${baselineScore}, confidence: ${baselineConfidence}`);
      }
    } catch (e) {
      if (debug) console.log(`[AuditQueue] ❌ Baseline scoring failed: ${e}`);
      baselineScore = 0;
      baselineConfidence = 'Low';
    }

    // Stabilize score
    if (debug) console.log(`[AuditQueue] ⚖️ Stabilizing score...`);
    const finalScore = scoreStabilizer(baselineScore, previousAudit, baselineConfidence);
    if (debug) console.log(`[AuditQueue] ⚖️ Stabilized score: ${finalScore}`);

    // Build prompt and call GPT
    const prompt = buildPrompt(structured, previousAudit, selectedTopics);

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
      console.log('[AuditQueue] 🤖 Starting GPT analysis with model:', model);
      console.log('[AuditQueue] 📝 Selected topics:', selectedTopics);
      console.log('[AuditQueue] 📝 Prompt built, length:', prompt.length);
      
      const rawGptResponse = await callGpt(prompt, model);
      console.log('[AuditQueue] ✅ GPT call completed, response length:', rawGptResponse.length);
      
      parsed = safeParse(rawGptResponse, debug);
      if (!parsed) {
        console.error('[AuditQueue] ❌ GPT parse returned empty - using fallback');
        throw new Error('GPT parse returned empty');
      }
      console.log('[AuditQueue] ✅ GPT analysis successful');
    } catch (e: any) {
      console.error(`[AuditQueue] ⚠️ GPT analysis failed: ${e.message}`);
      if (e.stack) console.error('[AuditQueue] Error stack:', e.stack);
      console.log('[AuditQueue] 🔄 Using fallback report from baseline');
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

    // Compute adaptive section anchors and blend with GPT scores
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

    // Final overall score - blend stabilized baseline with GPT score
    const gptScore = parseInt(String(parsed.overall_score || finalScore));
    const combined = Math.round(finalScore * 0.7 + gptScore * 0.3);
    const finalOverall = Math.max(0, Math.min(100, combined));

    if (debug) {
      console.log(
        `[AuditQueue] 🎯 FINAL SCORE: Stabilized=${finalScore}, GPT=${gptScore}, ` +
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

    // Update audit log
    try {
      if (debug) console.log(`[AuditQueue] 🗂️ Updating audit log for ${url}...`);
      await updateAuditLog(url, parsed, 5, userId, `Audit - ${new URL(url).hostname}`);
      if (debug) console.log(`[AuditQueue] 🗂️ Audit log updated (keeping last 5 entries)`);
    } catch (e) {
      if (debug) console.log(`[AuditQueue] ⚠️ Failed to update audit log: ${e}`);
    }

    // Update database record
    let documentId: number | undefined;
    try {
      if (debug) console.log('[AuditQueue] 💾 Updating audit record in database...');
      
      // Update audit with results (don't overwrite audit_name - keep original)
      await pulseHubAudits.update(auditId, {
        overall_score: finalOverall,
        performance_level: parsed.performance_level || 'Moderate',
        grade: parsed.overall_grade || gradeFromScore(finalOverall),
        audit_data: parsed,
        status: 'completed'
      });
      
      if (debug) console.log(`[AuditQueue] ✅ Audit ${auditId} updated in database`);

      // Create document record
      if (debug) console.log('[AuditQueue] 📄 Creating document record...');
      const docRecord = await documents.upload({
        user_id: userId,
        document_name: `Audit - ${new URL(url).hostname} - Result`,
        document_type: 'audit_result',
        url: `/api/audits/${auditId}/download`,
        feature_id: 1,
        file_size: JSON.stringify(parsed).length
      });

      documentId = docRecord.doc_id;
      if (debug) console.log(`[AuditQueue] ✅ Document record created: doc_id=${documentId}`);

      // Link document to audit
      await pulseHubAudits.update(auditId, {
        result_document_id: documentId
      });
      if (debug) console.log(`[AuditQueue] 🔗 Document linked to audit`);

      // Log activity
      if (debug) console.log('[AuditQueue] 📝 Logging activity...');
      await auditLogs.log({
        user_id: userId,
        action: 'create_audit',
        module: 'pulsehub',
        resource_type: 'audit',
        resource_id: auditId,
        audit_data: {
          url,
          score: finalOverall,
          grade: parsed.overall_grade,
          topics: selectedTopics,
          duration_ms: (Date.now() - startTime)
        }
      });
      if (debug) console.log('[AuditQueue] ✅ Activity logged successfully');

    } catch (dbError) {
      console.error('[AuditQueue] ❌ Failed to update database:', dbError);
      if (debug) console.error('[AuditQueue] Database error details:', dbError);
      throw dbError;
    }

    const resultWithDb: AuditResult = {
      ...parsed,
      audit_id: auditId,
      document_id: documentId
    };

    // Log comprehensive summary
    console.log(`\n[AuditQueue] ========== AUDIT COMPLETED ==========`);
    console.log(`[AuditQueue] ✅ Audit ID: ${auditId}`);
    console.log(`[AuditQueue] 🌐 URL: ${url}`);
    console.log(`[AuditQueue] 🎯 Final Score: ${finalOverall} (${parsed.overall_grade})`);
    console.log(`[AuditQueue] ⚖️ Score Breakdown: Stabilized=${finalScore}, GPT=${gptScore}, Blended=${finalOverall}`);
    console.log(`[AuditQueue] 📊 Sections: ${Object.keys(parsed.sections || {}).length}`);
    console.log(`[AuditQueue] 💡 Insights: ${parsed.insights_tab?.length || 0}`);
    console.log(`[AuditQueue] 📋 Summary Cards: ${Object.keys(parsed.summary_cards || {}).length}`);
    console.log(`[AuditQueue] 📅 30/60/90 Plan Items: ${(parsed.plan_30_60_90?.['30_days']?.length || 0) + (parsed.plan_30_60_90?.['60_days']?.length || 0) + (parsed.plan_30_60_90?.['90_days']?.length || 0)}`);
    console.log(`[AuditQueue] ⏱️ Runtime: ${runtimeSec}s`);
    console.log(`[AuditQueue] 💾 Document ID: ${documentId}`);
    console.log(`[AuditQueue] ========================================\n`);

    return resultWithDb;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Check if processing
   */
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

// Singleton instance
export const auditQueue = new AuditQueueManager();
