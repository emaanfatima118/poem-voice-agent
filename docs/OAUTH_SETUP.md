# OAuth Integrations Setup Guide

This guide explains how to set up OAuth integrations for HubSpot, Salesforce, Google Ads, LinkedIn, Meta, and TikTok.

## Overview

The OAuth integration system provides:
- ✅ Per-user authentication for multiple platforms
- ✅ Automatic token refresh (runs hourly via cron)
- ✅ Data synchronization to ABM Command Center
- ✅ Soft-delete tracking for CRM contacts/accounts
- ✅ Secure token storage in PostgreSQL

## Architecture

```
User → Authorization URL → Platform OAuth → Callback → Store Tokens → Sync Data
                                                         ↓
                                              Refresh Job (Hourly)
                                                         ↓
                                              ABM Command Center Tables
```

## Database Tables

### user_connectors
Stores OAuth tokens and connection metadata per user:
- `user_id` - Links to users table
- `connector_id` - Links to connectors table (1=HubSpot, 2=Salesforce, etc.)
- `access_token`, `refresh_token` - OAuth tokens
- `expires_at` - Token expiry timestamp
- `is_active` - Connection status
- `sync_status` - Last sync status (pending, syncing, completed, failed)
- `last_sync_at` - Last successful sync timestamp

### crm_contacts
Stores synced CRM contacts:
- `user_id`, `connector_id`, `external_id` - Composite unique key
- `is_deleted` - Soft-delete flag (true when contact deleted in source CRM)
- `is_active` - Active status
- `raw_data` - Full JSON from source platform

### crm_accounts
Stores synced CRM accounts/companies with similar structure

### ad_campaigns
Stores advertising campaign data from Google Ads, LinkedIn, Meta, TikTok

## Setup Instructions

### 1. HubSpot Integration

**Create HubSpot App:**
1. Go to https://developers.hubspot.com/
2. Click "Create app"
3. Navigate to "Auth" tab
4. Set Redirect URL: `https://your-domain.com/api/oauth/hubspot/callback`
5. Select scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.companies.read`
   - `crm.objects.deals.read`
   - `crm.lists.read`
6. Copy Client ID and Client Secret to `.env`:
   ```
   HUBSPOT_CLIENT_ID=your-client-id
   HUBSPOT_CLIENT_SECRET=your-client-secret
   ```

**Usage:**
```javascript
// Initiate OAuth flow
window.location.href = `/api/oauth/hubspot/authorize?user_id=${userId}`;

// Sync contacts after connection
await fetch('/api/sync/hubspot/contacts', {
  method: 'POST',
  body: JSON.stringify({ user_id: userId, connector_id: 1 })
});
```

### 2. Salesforce Integration

**Create Salesforce Connected App:**
1. Go to Salesforce Setup
2. Navigate to Apps > App Manager
3. Click "New Connected App"
4. Enable OAuth Settings
5. Set Callback URL: `https://your-domain.com/api/oauth/salesforce/callback`
6. Select OAuth Scopes: `Full access (full)`, `Perform requests at any time (refresh_token, offline_access)`
7. Copy Consumer Key and Consumer Secret to `.env`:
   ```
   SALESFORCE_CLIENT_ID=your-consumer-key
   SALESFORCE_CLIENT_SECRET=your-consumer-secret
   ```

**Usage:**
```javascript
// Initiate OAuth flow
window.location.href = `/api/oauth/salesforce/authorize?user_id=${userId}`;

// Sync contacts
await fetch('/api/sync/salesforce/contacts', {
  method: 'POST',
  body: JSON.stringify({ user_id: userId, connector_id: 2 })
});
```

### 3. Google Ads Integration

**Create Google Cloud OAuth Credentials:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Set Authorized redirect URIs: `https://your-domain.com/api/oauth/google-ads/callback`
4. Enable Google Ads API
5. Copy Client ID and Client Secret to `.env`:
   ```
   GOOGLE_ADS_CLIENT_ID=your-client-id
   GOOGLE_ADS_CLIENT_SECRET=your-client-secret
   ```

### 4. LinkedIn Integration

**Create LinkedIn App:**
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Add redirect URL: `https://your-domain.com/api/oauth/linkedin/callback`
4. Request access to Marketing Developer Platform
5. Select products: "Advertising API"
6. Copy Client ID and Client Secret to `.env`:
   ```
   LINKEDIN_CLIENT_ID=your-client-id
   LINKEDIN_CLIENT_SECRET=your-client-secret
   ```

### 5. Meta (Facebook/Instagram) Integration

**Create Meta App:**
1. Go to https://developers.facebook.com/apps
2. Create new app (Business type)
3. Add "Facebook Login" product
4. Set Valid OAuth Redirect URIs: `https://your-domain.com/api/oauth/meta/callback`
5. Add required permissions: `ads_read`, `ads_management`, `business_management`
6. Copy App ID and App Secret to `.env`:
   ```
   META_APP_ID=your-app-id
   META_APP_SECRET=your-app-secret
   ```

### 6. TikTok Integration

**Create TikTok Marketing App:**
1. Go to https://ads.tiktok.com/marketing_api/apps
2. Register new app
3. Set Redirect URL: `https://your-domain.com/api/oauth/tiktok/callback`
4. Request permissions: `ad_account.read`, `campaign.read`, etc.
5. Copy App ID and Secret to `.env`:
   ```
   TIKTOK_APP_ID=your-app-id
   TIKTOK_APP_SECRET=your-app-secret
   ```

## API Endpoints

### Authorization Endpoints
- `GET /api/oauth/{platform}/authorize?user_id={id}` - Start OAuth flow
- `GET /api/oauth/{platform}/callback` - OAuth callback handler

Where `{platform}` is: `hubspot`, `salesforce`, `google-ads`, `linkedin`, `meta`, `tiktok`

### Connector Management
- `GET /api/connectors?user_id={id}` - List all connectors and connection status
- `DELETE /api/connectors` - Disconnect a connector (body: `{connection_id}`)

### Data Sync
- `POST /api/sync/hubspot/contacts` - Sync HubSpot contacts
- `POST /api/sync/salesforce/contacts` - Sync Salesforce contacts

### Token Refresh
- `POST /api/oauth/refresh-tokens` - Refresh expiring tokens (called by cron)

## Automatic Token Refresh

The system automatically refreshes tokens hourly via Vercel Cron:

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/oauth/refresh-tokens",
      "schedule": "0 */1 * * *"
    }
  ]
}
```

Set `CRON_SECRET` in `.env` to secure the endpoint:
```bash
openssl rand -hex 32
```

## Soft-Delete Tracking

When contacts are deleted in the source CRM:
1. Sync endpoint fetches current contacts
2. Marks contacts not in sync batch as deleted: `is_deleted = true`, `is_active = false`
3. ABM Command Center filters by `is_deleted = false` to show only active contacts

**Query active contacts:**
```sql
SELECT * FROM crm_contacts 
WHERE user_id = $1 AND is_deleted = false 
ORDER BY created_at DESC;
```

## Testing OAuth Flows

**1. Start local server:**
```bash
npm run dev
```

**2. Test HubSpot connection:**
```
http://localhost:3000/api/oauth/hubspot/authorize?user_id=1
```

**3. Check database:**
```sql
SELECT * FROM user_connectors WHERE user_id = 1;
SELECT * FROM crm_contacts WHERE user_id = 1;
```

**4. Test token refresh:**
```
http://localhost:3000/api/oauth/refresh-tokens?secret=your-cron-secret
```

## Error Handling

**Common OAuth errors:**
- `missing_parameters` - Missing code or state in callback
- `invalid_state` - State parameter validation failed
- `state_expired` - State older than 10 minutes
- `token_exchange_failed` - Failed to exchange code for token

**Connection errors:**
- Check `user_connectors.error_message` for sync errors
- Check `user_connectors.sync_status` for sync state
- Review server logs for API errors

## Security Best Practices

1. **Never commit secrets** - Use `.env` file (gitignored)
2. **Rotate secrets regularly** - Update OAuth credentials periodically
3. **Use HTTPS in production** - Required for OAuth callbacks
4. **Validate state parameter** - Prevents CSRF attacks
5. **Set CRON_SECRET** - Protects refresh endpoint
6. **Token encryption** - Consider encrypting tokens at rest (future enhancement)

## Monitoring

**Check connection status:**
```javascript
const response = await fetch(`/api/connectors?user_id=${userId}`);
const { connectors } = await response.json();

connectors.forEach(c => {
  if (c.is_connected) {
    console.log(`${c.connector_name}: ${c.connection_status.sync_status}`);
  }
});
```

**Monitor token expiry:**
```sql
SELECT connector_name, account_name, expires_at,
       EXTRACT(EPOCH FROM (expires_at - NOW()))/3600 AS hours_until_expiry
FROM user_connectors uc
JOIN connectors c ON uc.connector_id = c.connector_id
WHERE uc.is_active = true
ORDER BY expires_at ASC;
```

## Troubleshooting

**Token refresh failing:**
- Check refresh token is not expired
- Verify OAuth credentials in `.env`
- Review platform-specific token lifetimes

**Sync failing:**
- Check access token expiry
- Verify required scopes/permissions
- Review API rate limits

**Callback errors:**
- Ensure redirect URLs match exactly
- Check app is approved/published
- Verify environment variables loaded

## Next Steps

1. ✅ Set up database tables (run `schema.sql`)
2. ✅ Configure OAuth apps for each platform
3. ✅ Add credentials to `.env`
4. ✅ Test OAuth flows locally
5. ✅ Deploy to production
6. ✅ Configure Vercel Cron for token refresh
7. 🔲 Build connector management UI
8. 🔲 Implement ABM Command Center dashboard
9. 🔲 Add campaign sync for ad platforms
10. 🔲 Build data visualization components

## Support

For issues or questions:
- Review server logs: `npm run dev`
- Check database state: `psql -h 34.30.5.132 -U postgres -d stackwise`
- Test endpoints with Postman/Insomnia
- Review platform OAuth documentation
