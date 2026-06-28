# SSO Implementation - Quick Reference

## What Was Implemented

✅ **Google OAuth 2.0** - Full implementation with profile data
✅ **Microsoft OAuth 2.0** - Azure AD integration (personal + work accounts)  
✅ **Apple Sign In** - Complete flow with JWT client secret generation

## Files Created

### Database
- `scripts/2025-12-05_add-sso-support.sql` - Migration to add SSO columns

### Configuration
- `src/lib/auth/sso-config.ts` - OAuth provider configurations
- `src/lib/auth/sso-helpers.ts` - Helper functions for SSO operations
- `.env.sso.example` - Environment variables template

### API Routes (Google)
- `app/api/auth/google/authorize/route.ts` - Initiates Google OAuth
- `app/api/auth/google/callback/route.ts` - Handles Google callback

### API Routes (Microsoft)
- `app/api/auth/microsoft/authorize/route.ts` - Initiates Microsoft OAuth
- `app/api/auth/microsoft/callback/route.ts` - Handles Microsoft callback

### API Routes (Apple)
- `app/api/auth/apple/authorize/route.ts` - Initiates Apple OAuth
- `app/api/auth/apple/callback/route.ts` - Handles Apple callback (POST)

### Documentation & Scripts
- `docs/SSO_SETUP_GUIDE.md` - Complete setup guide
- `scripts/setup-sso.sh` - Bash setup script
- `scripts/setup-sso.ps1` - PowerShell setup script

### Updated Files
- `src/Login.jsx` - Added SSO button handlers
- `src/SignUp.jsx` - Added SSO button handlers
- `src/lib/db/schema.sql` - Schema updated (for reference)

## Quick Start

### 1. Install Dependencies
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### 2. Run Database Migration
```bash
# Windows PowerShell
$env:PGPASSWORD="postgres"; psql -U postgres -d stackwise -f scripts/2025-12-05_add-sso-support.sql

# Linux/Mac
PGPASSWORD=postgres psql -U postgres -d stackwise -f scripts/2025-12-05_add-sso-support.sql
```

### 3. Configure Environment Variables

Add to your `.env` file:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=your-random-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-secret
MICROSOFT_TENANT_ID=common

# Apple OAuth (Optional - most complex)
APPLE_CLIENT_ID=com.yourcompany.stackwise
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### 4. Set Up OAuth Applications

#### Google
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/google/callback`

#### Microsoft  
1. Go to https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps
2. Register new application
3. Add redirect URI: `http://localhost:3000/api/auth/microsoft/callback`

#### Apple (Optional)
1. Go to https://developer.apple.com/account/resources/identifiers
2. Create Service ID and enable Sign In with Apple
3. Generate .p8 private key

### 5. Test

```bash
npm run dev
```

Navigate to `http://localhost:3000/login` and click any SSO button!

## How It Works

1. User clicks SSO button (Google/Microsoft/Apple)
2. Redirects to provider's OAuth page
3. User authenticates with provider
4. Provider redirects back with authorization code
5. Server exchanges code for access token
6. Server fetches user profile from provider
7. Server creates or links user account in database
8. User is logged in and redirected to dashboard

## Database Schema Changes

### `users` table - New columns (authentication):
- `auth_provider` - 'email', 'google', 'apple', 'microsoft'
- `provider_user_id` - Unique ID from OAuth provider (OAuth 'sub' claim)
- `password` - Now nullable (NULL for SSO users)

### `user_details` table - Existing columns utilized (profile):
- `profile_picture_url` - Used for SSO avatars from Google/Microsoft/Apple
- `metadata` - Stores SSO provider info and timestamps in JSONB format

## Security Features

✅ CSRF protection with state tokens  
✅ Secure HttpOnly cookies  
✅ Email verification from providers  
✅ Account linking by email  
✅ Unique constraints on provider IDs  

## Production Deployment

Before going live:

1. Update all OAuth redirect URIs to production domain
2. Change `NEXT_PUBLIC_APP_URL` to production URL
3. Generate strong `SESSION_SECRET`
4. Enable HTTPS (required for Apple)
5. Test all three providers in production environment

## Troubleshooting

**"Invalid redirect URI"**
- Ensure URIs match exactly in provider console

**"Token exchange failed"**  
- Check client secrets are correct
- Verify network connectivity to OAuth endpoints

**"User not created"**
- Ensure migration ran successfully
- Check database connection
- Review server logs for SQL errors

## Support

For detailed instructions, see `docs/SSO_SETUP_GUIDE.md`

For issues, check the console logs in:
- Browser DevTools (client-side errors)
- Terminal running `npm run dev` (server-side errors)
