# SSO Setup Script (PowerShell)
# This script helps you set up SSO for Stackwise

Write-Host "🔐 Stackwise SSO Setup" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found. Creating from .env.sso.example..." -ForegroundColor Red
    Copy-Item .env.sso.example .env
    Write-Host "✅ Created .env file. Please fill in your OAuth credentials." -ForegroundColor Green
    exit 1
}

# Check for required environment variables
Write-Host "📋 Checking environment variables..." -ForegroundColor Yellow
$missing_vars = @()

$required_vars = @(
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "MICROSOFT_CLIENT_ID",
    "MICROSOFT_CLIENT_SECRET",
    "NEXT_PUBLIC_APP_URL"
)

$envContent = Get-Content .env

foreach ($var in $required_vars) {
    if (-not ($envContent -match "^$var=")) {
        $missing_vars += $var
    }
}

if ($missing_vars.Count -gt 0) {
    Write-Host "⚠️  Missing environment variables:" -ForegroundColor Yellow
    foreach ($var in $missing_vars) {
        Write-Host "   - $var" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Please add these to your .env file. See .env.sso.example for details." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Run migration
Write-Host ""
Write-Host "🔄 Running SSO migration..." -ForegroundColor Yellow

try {
    $env:PGPASSWORD = "postgres"
    psql -U postgres -d stackwise -f scripts/2025-12-05_add-sso-support.sql
    Write-Host "✅ Migration completed successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Migration failed. Make sure PostgreSQL is running and accessible." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing required packages..." -ForegroundColor Yellow
npm install jsonwebtoken @types/jsonwebtoken

Write-Host ""
Write-Host "✅ SSO setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure OAuth applications in provider consoles:" -ForegroundColor White
Write-Host "   - Google: https://console.cloud.google.com/apis/credentials" -ForegroundColor Gray
Write-Host "   - Microsoft: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps" -ForegroundColor Gray
Write-Host "   - Apple: https://developer.apple.com/account/resources/identifiers" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add credentials to .env file" -ForegroundColor White
Write-Host ""
Write-Host "3. Start the development server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. Test SSO by clicking the provider buttons on /login page" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full documentation: docs/SSO_SETUP_GUIDE.md" -ForegroundColor Cyan
