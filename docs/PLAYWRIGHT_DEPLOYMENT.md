# Playwright Cloud Run Deployment Guide

## Overview

This project uses Playwright for PDF generation and web scraping, optimized for Google Cloud Run deployment.

## Key Features

✅ **Cloud Run Optimized Flags** - Prevents Chromium crashes in containerized environments
✅ **Browser Pool Management** - Efficient resource management and memory optimization
✅ **Automatic Cleanup** - Prevents memory leaks with timeout-based cleanup
✅ **Health Checks** - Docker and Cloud Run health monitoring
✅ **Production Ready** - Non-root user, security best practices

## Architecture

### Browser Pool (`lib/playwright/browser-pool.ts`)

- **Singleton Pattern**: Single browser instance shared across requests
- **Auto Cleanup**: Closes idle browsers after 30 seconds
- **Page Tracking**: Monitors active pages and force-closes after timeout
- **Graceful Shutdown**: Handles SIGTERM/SIGINT signals properly

### Configuration (`lib/playwright/config.ts`)

All Playwright settings centralized for easy maintenance:

```typescript
export const CLOUD_RUN_LAUNCH_OPTIONS: LaunchOptions = {
  headless: true,
  args: [
    '--no-sandbox',                    // Required for Cloud Run
    '--disable-gpu',                   // GPU not available
    '--disable-dev-shm-usage',         // Use /tmp instead of /dev/shm
    '--single-process',                // Reduce memory overhead
    '--no-zygote',                     // Don't use zygote process
  ],
  timeout: 60000,
};
```

## Usage

### PDF Generation (exports.ts)

```typescript
import { browserPool } from '@/lib/playwright/browser-pool';
import { PDF_OPTIONS } from '@/lib/playwright/config';

const page = await browserPool.createPage();
try {
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf(PDF_OPTIONS);
  return pdfBuffer;
} finally {
  await browserPool.closePage(page);
}
```

### Web Scraping (signal-parser.ts)

```typescript
import { browserPool } from '@/lib/playwright/browser-pool';
import { NAVIGATION_OPTIONS } from '@/lib/playwright/config';

const page = await browserPool.createPage();
try {
  await page.goto(url, NAVIGATION_OPTIONS.primary);
  await page.waitForTimeout(NAVIGATION_OPTIONS.waitAfterLoad);
  const html = await page.content();
  return html;
} finally {
  await browserPool.closePage(page);
}
```

## Deployment

### Docker Build

```bash
docker build -t stackwise-app .
```

### Local Test

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="your_db_url" \
  -e GCS_BUCKET="your_bucket" \
  stackwise-app
```

### Cloud Run Deployment

```bash
gcloud run deploy stackwise-app \
  --image gcr.io/YOUR_PROJECT/stackwise-app \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars DATABASE_URL="..." \
  --allow-unauthenticated
```

### Important Memory Settings

⚠️ **Cloud Run defaults (256MB-512MB) are TOO LOW for Playwright**

**Recommended minimum:**
- **Memory**: 2Gi (2048 MB)
- **CPU**: 2 vCPU
- **Timeout**: 300 seconds (for long-running audits)

## Health Monitoring

### Health Check Endpoint

`GET /api/health`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-27T...",
  "playwright": {
    "hasBrowser": true,
    "isConnected": true,
    "activePages": 0,
    "idleTime": 5432
  },
  "uptime": 1234.56,
  "memory": {
    "rss": 123456789,
    "heapTotal": 98765432,
    "heapUsed": 87654321
  }
}
```

## Troubleshooting

### Chromium Crashes

**Symptom**: `Error: Browser closed` or `Target closed`

**Solution**: Verify Docker launch flags are applied:
```typescript
const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
```

### Out of Memory

**Symptom**: Container killed, exit code 137

**Solution**: 
1. Increase Cloud Run memory to 2Gi or higher
2. Reduce concurrent requests
3. Check browser cleanup with `/api/health`

### Timeout Errors

**Symptom**: `Navigation timeout of 60000ms exceeded`

**Solution**:
1. Increase Cloud Run timeout: `--timeout 300`
2. Use fallback navigation: `waitUntil: 'domcontentloaded'`
3. Check network connectivity from Cloud Run

### Browser Not Closing

**Symptom**: Memory usage increases over time

**Solution**:
- Browser pool automatically cleans up after 30s idle
- Check active pages: `GET /api/health`
- Verify `finally` blocks always call `closePage()`

## Performance Optimization

### 1. Browser Reuse
✅ Browser instance is reused across requests
✅ Reduces cold start time from ~5s to ~500ms

### 2. Memory Management
✅ Automatic cleanup of idle browsers
✅ Force-close pages after 60s timeout
✅ Limit to 1 concurrent page per browser

### 3. Caching
✅ Browser executable cached in Docker layer
✅ `PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`
✅ No download needed at runtime

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
GCS_BUCKET=your-bucket-name
PORT=8080

# Playwright
PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Performance
NODE_OPTIONS=--max-old-space-size=2048
MALLOC_ARENA_MAX=2

# Optional
NEXT_TELEMETRY_DISABLED=1
```

## Best Practices

### ✅ DO

- Always use `browserPool.createPage()` instead of launching new browsers
- Always close pages in `finally` blocks
- Monitor `/api/health` for browser pool stats
- Set Cloud Run memory to at least 2Gi
- Use non-root user in Docker (already configured)

### ❌ DON'T

- Don't call `chromium.launch()` directly
- Don't forget to close pages
- Don't set Cloud Run memory below 1Gi
- Don't run without `--no-sandbox` flag
- Don't use `/dev/shm` (use `--disable-dev-shm-usage`)

## Monitoring

### Cloud Run Metrics to Watch

1. **Memory Usage**: Should stay below 80% of allocated memory
2. **Request Latency**: PDF generation ~3-5s, scraping ~5-10s
3. **Error Rate**: Should be < 1%
4. **Instance Count**: Auto-scales based on load

### Custom Metrics

Check Playwright health:
```bash
curl https://your-app.run.app/api/health
```

## Local Development

### Prerequisites

```bash
npm install playwright
npx playwright install chromium
```

### Run Locally

```bash
npm run dev
```

Browser pool works identically in development and production.

## File Structure

```
lib/
├── playwright/
│   ├── config.ts          # Centralized Playwright configuration
│   └── browser-pool.ts    # Browser instance management
├── audit/
│   ├── exports.ts         # PDF generation (uses browser pool)
│   └── signal-parser.ts   # Web scraping (uses browser pool)
app/
└── api/
    └── health/
        └── route.ts       # Health check endpoint
Dockerfile                 # Optimized for Playwright + Cloud Run
```

## Version Info

- **Playwright**: v1.48.0
- **Node.js**: v20.x
- **Next.js**: v16.0.3
- **Base Image**: `mcr.microsoft.com/playwright:v1.48.0-jammy`

## Support

For issues, check:
1. `/api/health` endpoint
2. Cloud Run logs: `gcloud run logs read`
3. Browser pool stats in health response
4. Memory usage in Cloud Run console

## License

MIT
