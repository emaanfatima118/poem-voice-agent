# SSO Implementation Guide

## Overview
This implementation adds Google, Apple, and Microsoft Single Sign-On (SSO) to your Stackwise platform.

## Database Changes

### 1. Run the Migration
```bash
psql -U postgres -d stackwise -f scripts/2025-12-05_add-sso-support.sql
```

This migration:
- Adds `auth_provider`, `provider_user_id`, and `avatar_url` columns to `users` table
- Makes `password` nullable for SSO users
- Adds unique constraints and indexes
- Inserts SSO connectors

## Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback` (and production URL)
5. Copy Client ID and Client Secret to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps)
2. Click "New registration"
3. Configure:
   - Name: Stackwise SSO
   - Supported account types: Accounts in any organizational directory and personal Microsoft accounts
   - Redirect URI: Web - `http://localhost:3000/api/auth/microsoft/callback`
4. After creation:
   - Copy Application (client) ID
   - Go to "Certificates & secrets" → Create new client secret
   - Copy the secret value immediately
5. Add to `.env`:
   ```
   MICROSOFT_CLIENT_ID=your-client-id
   MICROSOFT_CLIENT_SECRET=your-client-secret
   MICROSOFT_TENANT_ID=common
   ```

### Apple OAuth Setup (Most Complex)

1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list)
2. Create an App ID:
   - Register an App ID
   - Enable "Sign In with Apple" capability
3. Create a Services ID:
   - Register a Services ID (this will be your CLIENT_ID)
   - Enable "Sign In with Apple"
   - Configure Web Authentication:
     - Domain: `localhost` (for dev) or your production domain
     - Return URLs: `http://localhost:3000/api/auth/apple/callback`
4. Create a Private Key:
   - Go to Keys section
   - Create new key with "Sign In with Apple" enabled
   - Download the .p8 file (keep it secure!)
   - Note the Key ID
5. Add to `.env`:
   ```
   APPLE_CLIENT_ID=com.yourcompany.stackwise.service
   APPLE_TEAM_ID=YOUR_TEAM_ID
   APPLE_KEY_ID=YOUR_KEY_ID
   APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKey\n-----END PRIVATE KEY-----"
   ```

## Install Dependencies

```bash
npm install jsonwebtoken
npm install @types/jsonwebtoken --save-dev
```

## Testing

### 1. Test Google SSO
- Click "Google" button on login page
- Should redirect to Google login
- After authentication, should create user and redirect to dashboard

### 2. Test Microsoft SSO
- Click "Microsoft" button
- Should redirect to Microsoft login
- Works with both personal and work accounts

### 3. Test Apple SSO
- Click "Apple" button
- Should redirect to Apple login
- Note: Apple only sends user details (name) on first login

## How It Works

### Flow Diagram
```
User clicks SSO button
  ↓
Redirects to /api/auth/{provider}/authorize
  ↓
Generates state token (CSRF protection)
  ↓
Redirects to provider's OAuth page
  ↓
User logs in at provider
  ↓
Provider redirects to /api/auth/{provider}/callback
  ↓
Exchanges code for access token
  ↓
Fetches user profile from provider
  ↓
Creates or finds user in database:
  - Checks by provider_user_id
  - If not found, checks by email
  - Links or creates new user
  ↓
Creates session token
  ↓
Redirects to dashboard
```

### Database Schema

```sql
users table:
  - auth_provider: 'email', 'google', 'apple', 'microsoft'
  - provider_user_id: Unique ID from OAuth provider
  - password: NULL for SSO users
  - avatar_url: Profile picture from SSO
  - email_verified: TRUE for SSO users

user_details table:
  - ssn column repurposed/documented for SSO metadata
  - metadata JSONB stores SSO provider info
```

## Security Features

1. **CSRF Protection**: State parameter prevents cross-site request forgery
2. **Secure Cookies**: HttpOnly, Secure, SameSite cookies
3. **Email Verification**: SSO users are auto-verified
4. **Account Linking**: If email exists, links SSO to existing account

## Error Handling

Users will be redirected to `/login?error=<code>` if:
- `invalid_state`: CSRF token mismatch
- `token_exchange_failed`: Failed to exchange authorization code
- `user_info_failed`: Failed to get user profile
- `authentication_failed`: General auth failure

## Production Checklist

- [ ] Update all redirect URIs to production URLs
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Generate strong `SESSION_SECRET`
- [ ] Enable HTTPS (required for Apple)
- [ ] Test all three providers in production
- [ ] Set up proper error logging/monitoring
- [ ] Add rate limiting to OAuth endpoints
- [ ] Review security settings in provider consoles

## Troubleshooting

### "Invalid redirect URI"
- Ensure URIs in provider console match exactly (including trailing slash)
- Check both development and production URIs are configured

### "Invalid client secret" (Apple)
- Verify .p8 key is correctly formatted with \n for newlines
- Check Key ID and Team ID are correct
- Regenerate JWT if expired

### "User not created"
- Check database connection
- Verify migration ran successfully
- Check logs for SQL errors

## API Endpoints

| Provider | Authorize | Callback |
|----------|-----------|----------|
| Google | GET `/api/auth/google/authorize` | GET `/api/auth/google/callback` |
| Microsoft | GET `/api/auth/microsoft/authorize` | GET `/api/auth/microsoft/callback` |
| Apple | GET `/api/auth/apple/authorize` | POST `/api/auth/apple/callback` |

Note: Apple uses POST for callback, others use GET.
