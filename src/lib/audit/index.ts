// Main audit functionality exports
export { runAudit } from './audit-manager';
export type { RunAuditOptions } from './audit-manager';

// Audit log management
export { loadAuditLog, saveAuditLog, updateAuditLog } from './audit-log';

// Export functionality
export { exportAudit, exportMarkdown, exportJson } from './exports';
export type { ExportAuditOptions } from './exports';

// Utility functions
export {
  getLatestAuditResult,
  gradeFromScore,
  getFilenameBase,
  domainFilenamePrefix,
  truncateText,
  safeGet,
} from './utils';
export type { AuditResult } from './utils';

// Constants
export {
  ANALYTICS_PATTERNS,
  PAID_PATTERNS,
  SOCIAL_DOMAINS,
  CTA_PHRASES,
  COMMON_PROBES,
  DEFAULT_TOPICS,
  TOPIC_KEY_MAP,
} from './constants';

// Scoring functions
export { computeBaselineScore, scoreStabilizer, computeSectionAnchors } from './scoring';
export type { BaselineSignals } from './scoring';

// Signal extraction
export { extractStructuredSignals } from './signal-parser';
export type { StructuredSignals } from './signal-parser';

// GPT analysis
export { detectJsRenderingWithGpt, buildPrompt, callGpt, safeParse, fallbackReportFromBaseline } from './gpt-analyzer';
