import axios from 'axios';
import { URL } from 'url';

export interface AuditResult {
  url?: string;
  overall_score?: number;
  overall_grade?: string;
  performance_level?: string;
  executive_summary?: string;
  audit_meta?: {
    url: string;
    timestamp: number;
    render_mode: string;
    baseline_confidence: string;
    runtime_sec: number;
    selected_topics: string[];
  };
  sections?: Record<string, any>;
  summary_cards?: Record<string, string[]>;
  competitor_snapshot?: any;
  insights_tab?: any[];
  plan_30_60_90?: any;
  short_next_steps?: string[];
  notes?: string;
  baseline?: any;
  stabilized_score?: number;
  trendline?: any[];
  
  // Fields for performance_audit_log table (historical tracking)
  date?: string;
  confidence?: string;
  baseline_signals?: Record<string, any>;
  render_mode?: string;
  topics_audited?: string[];
  
  // Database fields (added after saving to DB)
  audit_id?: number;
  document_id?: number;
}

export function truncateText(s: string, n: number): string {
  if (!s) return '';
  return s.length <= n ? s : s.slice(0, n) + '\n...[TRUNCATED]...';
}

export function domainFilenamePrefix(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/:/g, '_');
    const ts = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
    return `audit_${host}_${ts}`;
  } catch {
    return `audit_${Date.now()}`;
  }
}

export function gradeFromScore(s: number): string {
  if (s >= 90) return 'A+';
  if (s >= 85) return 'A';
  if (s >= 80) return 'B+';
  if (s >= 70) return 'B';
  if (s >= 60) return 'C';
  return 'D';
}

export function getFilenameBase(url: string, auditName?: string): string {
  if (auditName) {
    return auditName.replace(/[\s/\\]/g, '_');
  }
  return domainFilenamePrefix(url);
}

export function getLatestAuditResult(
  url: string,
  auditLog: Record<string, AuditResult[]>,
  selectedTopics?: string[],
  debug: boolean = false
): AuditResult | null {
  if (!url || !auditLog) return null;

  const entries = auditLog[url];
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    if (debug) console.log(`[getLatestAuditResult] No entries found for ${url}`);
    return null;
  }

  if (selectedTopics && selectedTopics.length > 0) {
    if (debug) {
      console.log(`[getLatestAuditResult] Looking for audits with topics: ${JSON.stringify(selectedTopics.sort())}`);
      console.log(`[getLatestAuditResult] Found ${entries.length} total entries for ${url}`);
      entries.forEach((a, i) => {
        const topics = a.audit_meta?.selected_topics || [];
        console.log(`[getLatestAuditResult] Entry ${i}: topics=${JSON.stringify(topics)} meta=${JSON.stringify(a.audit_meta || {})}`);
      });
    }

    const matchingAudits = entries.filter((a) => {
      const topics = a.audit_meta?.selected_topics || [];
      const match = JSON.stringify(topics.sort()) === JSON.stringify(selectedTopics.sort());
      if (debug && match) {
        console.log(`[getLatestAuditResult] ✓ Match found: ${JSON.stringify(topics)} === ${JSON.stringify(selectedTopics)}`);
      }
      return match;
    });

    if (matchingAudits.length > 0) {
      const latest = matchingAudits[matchingAudits.length - 1];
      if (debug) {
        const ts = latest.audit_meta?.timestamp;
        console.log(`[getLatestAuditResult] ✓ Latest matching audit loaded (timestamp=${ts})`);
      }
      return latest;
    } else {
      if (debug) console.log('[getLatestAuditResult] ✗ No previous audits with matching selections found.');
      return null;
    }
  }

  return entries[entries.length - 1];
}

export async function safeGet(
  url: string,
  timeout: number = 15000,
  allowRedirects: boolean = true
): Promise<{ status: number; text: string; statusCode: number } | null> {
  try {
    const response = await axios.get(url, {
      timeout,
      maxRedirects: allowRedirects ? 5 : 0,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: url,
      },
      validateStatus: () => true, // Accept all status codes, we'll handle them
    });

    return {
      status: response.status,
      statusCode: response.status,
      text: response.data,
    };
  } catch (error: any) {
    // Only log actual network errors, not HTTP status codes
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || !error.response) {
      console.error(`[safeGet] Network error fetching ${url}: ${error.code || error.message}`);
    }
    // For HTTP errors (404, 500, etc.), return null silently
    return null;
  }
}
