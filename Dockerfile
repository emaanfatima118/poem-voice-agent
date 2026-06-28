# ---------------------------------------------------------
# BASE IMAGE WITH PLAYWRIGHT + CHROMIUM INSTALLED
# ---------------------------------------------------------
FROM mcr.microsoft.com/playwright:v1.56.0-jammy AS base

# Install system certificates
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------
# BUILD STAGE
# ---------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Strongly recommended: use deterministic CI install
# Retry config prevents npm E500 failures in GCP
RUN npm config set fetch-retries 6 \
 && npm config set fetch-retry-factor 3 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Install deps deterministically
RUN npm ci --legacy-peer-deps

# Copy full source
COPY . .

# Build Next.js
RUN npm run build

# ---------------------------------------------------------
# PRODUCTION STAGE
# ---------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV MALLOC_ARENA_MAX=2

# Copy built app + node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/node_modules ./node_modules

# Install Chromium (matching Playwright version)
RUN npx playwright install chromium --with-deps

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs \
 && chown -R nodejs:nodejs /app /ms-playwright || true

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["npm", "run", "start"]
