#!/bin/bash

# Cloud Run Deployment Script for Stackwise with Playwright
# This script builds and deploys the application to Google Cloud Run

set -e  # Exit on error

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-stackwise-prod}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-stackwise-app}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
MEMORY="${MEMORY:-2Gi}"
CPU="${CPU:-2}"
TIMEOUT="${TIMEOUT:-300}"
MAX_INSTANCES="${MAX_INSTANCES:-10}"
MIN_INSTANCES="${MIN_INSTANCES:-0}"

echo "🚀 Starting deployment to Cloud Run..."
echo "   Project: ${PROJECT_ID}"
echo "   Region: ${REGION}"
echo "   Service: ${SERVICE_NAME}"
echo "   Memory: ${MEMORY}"
echo "   CPU: ${CPU}"
echo ""

# Step 1: Build Docker image
echo "📦 Building Docker image..."
docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:$(git rev-parse --short HEAD) .

# Step 2: Push to Google Container Registry
echo "⬆️  Pushing image to GCR..."
docker push ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:$(git rev-parse --short HEAD)

# Step 3: Deploy to Cloud Run
echo "🌩️  Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --memory ${MEMORY} \
  --cpu ${CPU} \
  --timeout ${TIMEOUT} \
  --max-instances ${MAX_INSTANCES} \
  --min-instances ${MIN_INSTANCES} \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PLAYWRIGHT_BROWSERS_PATH=/ms-playwright,PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1,NODE_OPTIONS=--max-old-space-size=2048,MALLOC_ARENA_MAX=2,NEXT_TELEMETRY_DISABLED=1" \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,GCS_BUCKET=GCS_BUCKET:latest,GOOGLE_ADS_CLIENT_ID=GOOGLE_ADS_CLIENT_ID:latest,GOOGLE_ADS_CLIENT_SECRET=GOOGLE_ADS_CLIENT_SECRET:latest"

# Step 4: Get service URL
echo "✅ Deployment complete!"
echo ""
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform managed --region ${REGION} --format 'value(status.url)')
echo "🌐 Service URL: ${SERVICE_URL}"
echo ""

# Step 5: Run health check
echo "🏥 Running health check..."
sleep 5
curl -f ${SERVICE_URL}/api/health | jq .

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Useful commands:"
echo "  View logs:     gcloud run logs read --service ${SERVICE_NAME} --region ${REGION}"
echo "  Monitor:       gcloud run services describe ${SERVICE_NAME} --region ${REGION}"
echo "  Health check:  curl ${SERVICE_URL}/api/health"
