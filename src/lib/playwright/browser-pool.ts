/**
 * Browser Pool Manager for Playwright
 * Manages browser instances to prevent memory leaks and optimize performance
 */

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { CLOUD_RUN_LAUNCH_OPTIONS, OPTIMIZED_CONTEXT_OPTIONS, MEMORY_LIMITS } from './config';

class BrowserPool {
  private browser: Browser | null = null;
  private lastUsed: number = 0;
  private isLaunching: boolean = false;
  private activePages: Set<Page> = new Set();

  /**
   * Get or create a browser instance
   */
  async getBrowser(): Promise<Browser> {
    // If browser exists and is connected, return it
    if (this.browser && this.browser.isConnected()) {
      this.lastUsed = Date.now();
      return this.browser;
    }

    // If another request is launching, wait
    if (this.isLaunching) {
      await this.waitForLaunch();
      if (this.browser && this.browser.isConnected()) {
        return this.browser;
      }
    }

    // Launch new browser
    this.isLaunching = true;
    try {
      console.log('[BrowserPool] Launching new Chromium instance...');
      this.browser = await chromium.launch(CLOUD_RUN_LAUNCH_OPTIONS);
      this.lastUsed = Date.now();
      console.log('[BrowserPool] Browser launched successfully');
      return this.browser;
    } finally {
      this.isLaunching = false;
    }
  }

  /**
   * Create a new browser context with optimized settings and random user agent
   */
  async createContext(): Promise<BrowserContext> {
    const browser = await this.getBrowser();
    
    // Random real user agents (recent Chrome versions)
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.199 Safari/537.36',
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    // Merge context options with random user agent
    const contextOptions = {
      ...OPTIMIZED_CONTEXT_OPTIONS,
      userAgent: randomUA,
      viewport: { width: 1920, height: 1080 },
    };
    
    return await browser.newContext(contextOptions);
  }

  /**
   * Create a new page and track it with enhanced stealth
   */
  async createPage(): Promise<Page> {
    const context = await this.createContext();
    const page = await context.newPage();
    this.activePages.add(page);

    // Enhanced stealth mode - remove all automation traces
    await page.addInitScript(() => {
      // Remove navigator.webdriver flag
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // Remove automation indicators
      delete (window as any).__nightmare;
      delete (window as any)._Selenium_IDE_Recorder;
      delete (window as any).__webdriver_script_fn;
      delete (window as any).__driver_evaluate;
      delete (window as any).__webdriver_evaluate;
      delete (window as any).__selenium_evaluate;
      delete (window as any).__fxdriver_evaluate;
      delete (window as any).__driver_unwrapped;
      delete (window as any).__webdriver_unwrapped;
      delete (window as any).__selenium_unwrapped;
      delete (window as any).__fxdriver_unwrapped;
      
      // Mock chrome object with realistic properties
      (window as any).chrome = {
        runtime: {
          connect: () => {},
          sendMessage: () => {},
        },
        loadTimes: () => {},
        csi: () => {},
        app: {},
      };
      
      // Mock realistic plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
          { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
        ],
      });
      
      // Mock languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      
      // Mock hardware concurrency
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8,
      });
      
      // Mock device memory
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8,
      });
      
      // Mock permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters: any) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: 'denied' } as PermissionStatus) :
          originalQuery(parameters)
      );
      
      // Override toString to hide proxy
      const originalToString = Function.prototype.toString;
      Function.prototype.toString = function() {
        if (this === window.navigator.permissions.query) {
          return 'function query() { [native code] }';
        }
        return originalToString.call(this);
      };
    });

    // Set extra headers to avoid bot detection
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Referer': 'https://www.google.com/',
      'DNT': '1',
      'Upgrade-Insecure-Requests': '1'
    });

    // Auto-cleanup after timeout
    setTimeout(() => {
      if (!page.isClosed()) {
        console.warn('[BrowserPool] Force closing page after timeout');
        this.closePage(page).catch(console.error);
      }
    }, MEMORY_LIMITS.pageTimeout);

    return page;
  }

  /**
   * Close a page and its context
   */
  async closePage(page: Page): Promise<void> {
    try {
      this.activePages.delete(page);
      const context = page.context();
      if (!page.isClosed()) {
        await page.close();
      }
      await context.close();
    } catch (error) {
      console.error('[BrowserPool] Error closing page:', error);
    }
  }

  /**
   * Close browser if idle
   */
  async cleanup(): Promise<void> {
    const now = Date.now();
    const idleTime = now - this.lastUsed;

    if (idleTime > MEMORY_LIMITS.browserIdleTimeout && this.activePages.size === 0) {
      await this.closeBrowser();
    }
  }

  /**
   * Force close browser
   */
  async closeBrowser(): Promise<void> {
    if (this.browser && this.browser.isConnected()) {
      console.log('[BrowserPool] Closing browser...');
      try {
        // Close all active pages first
        for (const page of this.activePages) {
          await this.closePage(page);
        }
        await this.browser.close();
        this.browser = null;
      } catch (error) {
        console.error('[BrowserPool] Error closing browser:', error);
      }
    }
  }

  /**
   * Wait for browser launch to complete
   */
  private async waitForLaunch(): Promise<void> {
    let attempts = 0;
    while (this.isLaunching && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      hasBrowser: !!this.browser,
      isConnected: this.browser?.isConnected() || false,
      activePages: this.activePages.size,
      idleTime: Date.now() - this.lastUsed,
      isLaunching: this.isLaunching,
    };
  }
}

// Singleton instance
export const browserPool = new BrowserPool();

// Cleanup interval
setInterval(() => {
  browserPool.cleanup().catch(console.error);
}, 10000); // Check every 10 seconds

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[BrowserPool] SIGTERM received, closing browser...');
  await browserPool.closeBrowser();
});

process.on('SIGINT', async () => {
  console.log('[BrowserPool] SIGINT received, closing browser...');
  await browserPool.closeBrowser();
});
