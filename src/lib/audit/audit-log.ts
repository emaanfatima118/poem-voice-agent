import { db } from '../db';
import { performanceAuditLog } from '../db/queries';
import { AuditResult } from './utils';

/**
 * Load audit log from performance_audit_log table for a specific user
 * Returns a mapping of website URLs to their audit history (for trendlines)
 * Now reads from a single JSON per user
 */
export async function loadAuditLog(userId?: number): Promise<Record<string, AuditResult[]>> {
  try {
    if (!userId) {
      console.warn('[loadAuditLog] No userId provided, returning empty log');
      return {};
    }

    console.log(`[loadAuditLog] 🔍 Fetching audit history for user ${userId} from performance_audit_log table`);

    // Fetch audit history JSON for this user
    const auditHistory = await performanceAuditLog.findByUser(userId);
    
    // Debug: Log what was retrieved
    const urlCount = Object.keys(auditHistory).length;
    console.log(`[loadAuditLog] ✓ Retrieved ${urlCount} URLs with audit history`);
    
    if (urlCount > 0) {
      Object.entries(auditHistory).forEach(([url, audits]) => {
        console.log(`[loadAuditLog]   - ${url}: ${audits.length} audit(s)`);
        audits.forEach((audit: any, i: number) => {
          const topics = audit.audit_meta?.selected_topics || [];
          console.log(`[loadAuditLog]     [${i}] topics=${JSON.stringify(topics)}, score=${audit.overall_score}, date=${audit.date}`);
        });
      });
    } else {
      console.log(`[loadAuditLog] ⚠️ No audit history found for user ${userId}`);
    }
    
    // The JSON is already in the format we need: { url: [audits...] }
    return auditHistory;
  } catch (error) {
    console.error('[loadAuditLog] ❌ Failed to load from database:', error);
    return {};
  }
}

/**
 * Save audit log is now handled by database inserts
 * This function is kept for backward compatibility but does nothing
 */
export async function saveAuditLog(log: Record<string, AuditResult[]>): Promise<void> {
  // No-op: Audits are now saved directly to database via pulseHubAudits.insert()
  console.log('[saveAuditLog] Deprecated: Audits are now saved directly to database');
}

/**
 * Update audit log for a specific URL and user
 * Stores historical tracking data in performance_audit_log table (one JSON per user)
 * This is lightweight data used for trendline graphs and history
 */
export async function updateAuditLog(
  url: string, 
  newAudit: AuditResult, 
  keepLast: number = 5,
  userId?: number,
  auditName?: string
): Promise<void> {
  try {
    if (!userId) {
      console.error('[updateAuditLog] No userId provided, cannot save to database');
      return;
    }

    // Create lightweight entry for history (only essential trendline data)
    const auditEntry = {
      overall_score: newAudit.overall_score || 0,
      overall_grade: newAudit.overall_grade || 'N/A',
      performance_level: newAudit.performance_level || 'Unknown',
      date: new Date().toISOString(),
      confidence: newAudit.confidence || 'High',
      sections: newAudit.sections || {},
      baseline_signals: newAudit.baseline_signals || {},
      stabilized_score: newAudit.stabilized_score || newAudit.overall_score || 0,
      render_mode: newAudit.render_mode || 'Unknown',
      audit_meta: {
        selected_topics: newAudit.audit_meta?.selected_topics || [],
        timestamp: newAudit.audit_meta?.timestamp || Math.floor(Date.now() / 1000),
        url: url
      }
    };

    // Add to user's audit history (automatically keeps last 5 per URL)
    await performanceAuditLog.addAudit(userId, url, auditEntry);

    console.log(`[updateAuditLog] Added audit history for ${url} (keeping last ${keepLast} per URL)`);
  } catch (error) {
    console.error(`[updateAuditLog] Failed to update log for ${url}:`, error);
  }
}
