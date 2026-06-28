/**
 * Playwright Configuration for Cloud Run
 * Optimized for GCP Cloud Run with proper memory management and caching
 */

import { LaunchOptions } from 'playwright';

/**
 * Cloud Run-optimized Playwright launch configuration
 * These flags prevent Chromium crashes in containerized environments
 */
export const CLOUD_RUN_LAUNCH_OPTIONS: LaunchOptions = {
  headless: true,
  args: [
    '--no-sandbox',                    // Required for Cloud Run (no user namespaces)
    '--disable-gpu',                   // GPU not available in Cloud Run
    '--disable-dev-shm-usage',         // Use /tmp instead of /dev/shm (limited to 64MB)
    '--no-zygote',                     // Don't use zygote process
    '--disable-setuid-sandbox',        // Additional sandbox disable
    '--no-first-run',                  // Faster startup
    '--no-default-browser-check',      // Skip checks
    '--disable-background-networking', // Stability
    '--disable-background-timer-throttling',
    '--disable-breakpad',
    '--metrics-recording-only',
    '--password-store=basic',
    '--disable-blink-features=AutomationControlled', // Hide automation
    '--disable-features=IsolateOrigins,site-per-process', // Better compatibility
    '--window-size=1920,1080',         // Standard desktop size
    '--disable-web-security',          // Allow cross-origin requests
    '--disable-features=VizDisplayCompositor', // Rendering optimization
    '--disable-ipc-flooding-protection', // Stability
    '--disable-renderer-backgrounding', // Keep renderer active
    '--enable-features=NetworkService,NetworkServiceInProcess', // Network optimization
    '--force-color-profile=srgb',      // Color consistency
    '--hide-scrollbars',               // Clean viewport
    '--mute-audio',                    // No audio
  ],
  timeout: 120000, // 120 second timeout (matches Python crawler)
};

/**
 * Performance-optimized browser context options
 */
export const OPTIMIZED_CONTEXT_OPTIONS = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 },
  ignoreHTTPSErrors: true,
  javaScriptEnabled: true,
};

/**
 * PDF generation options
 */
export const PDF_OPTIONS = {
  format: 'A4' as const,
  margin: { 
    top: '40px', 
    right: '40px', 
    bottom: '40px', 
    left: '40px' 
  },
  printBackground: true,
  preferCSSPageSize: false,
};

/**
 * Page navigation options - WordPress-optimized (matches Python crawler)
 * Uses domcontentloaded for faster, more reliable loading
 */
export const NAVIGATION_OPTIONS = {
  primary: { 
    waitUntil: 'domcontentloaded' as const, 
    timeout: 120000  // 120 seconds like Python script
  },
  fallback: { 
    waitUntil: 'load' as const, 
    timeout: 120000 
  },
  waitAfterLoad: 1500, // 1.5 seconds for JS execution (matches Python)
};

/**
 * Memory management settings
 */
export const MEMORY_LIMITS = {
  maxConcurrentPages: 1,           // Limit concurrent pages per browser
  pageTimeout: 60000,              // Force close pages after 60s
  browserIdleTimeout: 30000,       // Close browser after 30s idle
  maxBrowserInstances: 1,          // Only one browser at a time
};

/**
 * Caching configuration
 */
export const CACHE_CONFIG = {
  enabled: true,
  ttl: 300000,                     // 5 minutes cache TTL
  maxSize: 100,                    // Max cached items
};
