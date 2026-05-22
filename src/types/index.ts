/**
 * Centralized type definitions for SafeGuard Proxy
 * Ensures type safety across components and eliminates 'any' type usage
 */

/**
 * Statistics from a single PII redaction run
 */
export interface RunStats {
  emailsCount: number;
  phonesCount: number;
  creditCardsCount: number;
  ipsCount: number;
  namesCount: number;
  totalRedacted: number;
}

/**
 * Performance metrics from a single proxy request
 */
export interface RunMetrics {
  latencyMs: number;
  rawTokens?: number;
  redactedTokens?: number;
  tokenSavingsPercent?: number;
  complianceSavingsDollars: number;
}

/**
 * API response from the /api/proxy endpoint
 * Contains redaction results, vault mappings, stats, and metrics
 */
export interface ProxyResponse {
  originalText: string;
  redactedText: string;
  vault: Record<string, string>;
  mockLlmResponseRedacted: string;
  mockLlmResponseRestored: string;
  stats: RunStats;
  metrics: RunMetrics;
}

/**
 * Log item for the audit stream
 * Represents a single event in the gateway logs
 */
export interface LogItem {
  id: string;
  timestamp: string;
  type: 'info' | 'redact' | 'warn' | 'danger';
  message: string;
  details: string;
}
