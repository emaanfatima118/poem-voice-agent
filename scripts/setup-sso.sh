#!/bin/bash

# SSO Setup Script
# This script helps you set up SSO for Stackwise

echo "🔐 Stackwise SSO Setup"
echo "====================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from .env.sso.example..."
    cp .env.sso.example .env
    echo "✅ Created .env file. Please fill in your OAuth credentials."
    exit 1
fi

# Check for required environment variables
echo "📋 Checking environment variables..."
missing_vars=()

required_vars=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "MICROSOFT_CLIENT_ID"
    "MICROSOFT_CLIENT_SECRET"
    "NEXT_PUBLIC_APP_URL"
)

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "⚠️  Missing environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please add these to your .env file. See .env.sso.example for details."
    exit 1
fi

echo "✅ Environment variables configured"

# Check if database is accessible
echo ""
echo "🗄️  Checking database connection..."
if ! psql -U postgres -d stackwise -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database. Make sure PostgreSQL is running."
    exit 1
fi

echo "✅ Database connection successful"

# Run migration
echo ""
echo "🔄 Running SSO migration..."
if psql -U postgres -d stackwise -f scripts/2025-12-05_add-sso-support.sql > /dev/null 2>&1; then
    echo "✅ Migration completed successfully"
else
    echo "❌ Migration failed. Check the error above."
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing required packages..."
npm install jsonwebtoken @types/jsonwebtoken

echo ""
echo "✅ SSO setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure OAuth applications in provider consoles:"
echo "   - Google: https://console.cloud.google.com/apis/credentials"
echo "   - Microsoft: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps"
echo "   - Apple: https://developer.apple.com/account/resources/identifiers"
echo ""
echo "2. Add credentials to .env file"
echo ""
echo "3. Start the development server: npm run dev"
echo ""
echo "4. Test SSO by clicking the provider buttons on /login page"
echo ""
echo "📖 Full documentation: docs/SSO_SETUP_GUIDE.md"
