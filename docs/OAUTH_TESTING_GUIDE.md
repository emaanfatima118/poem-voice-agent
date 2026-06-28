# OAuth Integration Testing Guide

## Setup Instructions

### 1. Database Setup
Run the OAuth schema to create all necessary tables:

```bash
# Connect to PostgreSQL
psql -h 34.30.5.132 -U postgres -d stackwise -f lib/db/oauth-schema.sql
```

### 2. Start Development Server
```bash
npm run dev
```

Server should be running at: `http://localhost:3000`

---

## Testing Endpoints

### ✅ Available Connectors (4 configured)
1. **HubSpot** - connector_id: 1
2. **Salesforce** - connector_id: 2
3. **Google Ads** - connector_id: 3
4. **LinkedIn** - connector_id: 4

---

## Postman Testing Collection

### 1. Test HubSpot OAuth Flow

#### Step 1: Get Authorization URL
**GET** `http://localhost:3000/api/oauth/hubspot/authorize?user_id=1`

**Expected Response:**
```json
{
  "authorization_url": "https://app.hubspot.com/oauth/authorize?client_id=...&redirect_uri=...&scope=...&response_type=code&state=..."
}
```

**Action:** Copy the `authorization_url` and open it in your browser to authorize.

#### Step 2: After Authorization
- Browser will redirect to: `http://localhost:3000/api/oauth/hubspot/callback?code=...&state=...`
- You should be redirected to: `/settings/integrations?success=hubspot_connected`

#### Step 3: Verify Stored Connection
**GET** `http://localhost:3000/api/connectors?user_id=1`

**Expected Response:**
```json
{
  "success": true,
  "connectors": [
    {
      "connector_id": 1,
      "connector_name": "hubspot",
      "description": "CRM and marketing automation platform",
      "is_available": true,
      "is_connected": true,
      "connection_status": {
        "id": 1,
        "is_active": true,
        "account_name": "your-hub-domain",
        "account_id": "12345678",
        "expires_at": "2025-11-26T12:00:00.000Z",
        "last_sync_at": null,
        "sync_status": "idle",
        "error_message": null,
        "connected_at": "2025-11-26T06:00:00.000Z"
      }
    }
  ]
}
```

---

### 2. Test Salesforce OAuth Flow

#### Step 1: Get Authorization URL
**GET** `http://localhost:3000/api/oauth/salesforce/authorize?user_id=1`

**Expected Response:**
```json
{
  "authorization_url": "https://login.salesforce.com/services/oauth2/authorize?client_id=...&redirect_uri=...&scope=api%20refresh_token%20full&response_type=code&state=..."
}
```

**Action:** Copy the URL and authorize in browser.

#### Step 2: Verify Instance URL Stored
After authorization completes, check the database:

```sql
SELECT 
  id,
  user_id,
  connector_id,
  account_name,
  account_id,
  instance_url,
  metadata->>'user_id' as sf_user_id,
  metadata->>'username' as sf_username,
  expires_at,
  is_active
FROM user_connectors 
WHERE connector_id = 2;
```

**Expected Result:**
- `instance_url` should contain: `https://your-instance.salesforce.com`
- `metadata` should contain Salesforce user details
- `account_id` should be organization ID

---

### 3. Test Google Ads OAuth Flow

#### Step 1: Get Authorization URL
**GET** `http://localhost:3000/api/oauth/google-ads/authorize?user_id=1`

**Expected Response:**
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&scope=https://www.googleapis.com/auth/adwords&response_type=code&state=..."
}
```

**Note:** Make sure you have Google Ads API access enabled in your Google Cloud Console.

---

### 4. Test LinkedIn OAuth Flow

#### Step 1: Get Authorization URL
**GET** `http://localhost:3000/api/oauth/linkedin/authorize?user_id=1`

**Expected Response:**
```json
{
  "authorization_url": "https://www.linkedin.com/oauth/v2/authorization?client_id=...&redirect_uri=...&scope=r_ads%20r_organization_social%20r_ads_reporting%20rw_ads&response_type=code&state=..."
}
```

---

### 5. Get All Connectors Status

**GET** `http://localhost:3000/api/connectors?user_id=1`

**Response Format:**
```json
{
  "success": true,
  "connectors": [
    {
      "connector_id": 1,
      "connector_name": "hubspot",
      "description": "CRM and marketing automation platform",
      "is_available": true,
      "is_connected": true,
      "connection_status": {
        "id": 1,
        "is_active": true,
        "account_name": "company-domain",
        "account_id": "12345",
        "expires_at": "2025-11-26T12:00:00Z",
        "last_sync_at": null,
        "sync_status": "idle",
        "error_message": null,
        "connected_at": "2025-11-26T06:00:00Z"
      }
    },
    {
      "connector_id": 2,
      "connector_name": "salesforce",
      "is_connected": true,
      "connection_status": {
        "account_name": "Your Company",
        "metadata": {
          "instance_url": "https://yourinstance.salesforce.com"
        }
      }
    },
    {
      "connector_id": 3,
      "connector_name": "google_ads",
      "is_connected": false,
      "connection_status": null
    },
    {
      "connector_id": 4,
      "connector_name": "linkedin",
      "is_connected": false,
      "connection_status": null
    }
  ]
}
```

---

### 6. Test HubSpot Contact Sync

**POST** `http://localhost:3000/api/sync/hubspot/contacts`

**Request Body:**
```json
{
  "user_id": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Synced 150 contacts from HubSpot",
  "synced": 150,
  "new": 120,
  "updated": 30,
  "errors": 0
}
```

**Verify in Database:**
```sql
SELECT 
  COUNT(*) as total_contacts,
  COUNT(CASE WHEN is_deleted = false THEN 1 END) as active_contacts,
  COUNT(CASE WHEN is_deleted = true THEN 1 END) as deleted_contacts
FROM abm_contacts
WHERE user_connector_id IN (
  SELECT id FROM user_connectors WHERE user_id = 1 AND connector_id = 1
);
```

---

### 7. Test Salesforce Contact Sync

**POST** `http://localhost:3000/api/sync/salesforce/contacts`

**Request Body:**
```json
{
  "user_id": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Synced 200 contacts from Salesforce",
  "synced": 200,
  "new": 180,
  "updated": 20,
  "errors": 0
}
```

---

### 8. Test Token Refresh (Manual)

**GET** `http://localhost:3000/api/oauth/refresh-tokens?secret=your-cron-secret`

**Expected Response:**
```json
{
  "message": "Token refresh completed: 2 succeeded, 0 failed",
  "success": 2,
  "failed": 0,
  "total": 2,
  "refreshed": [
    {
      "connector": "hubspot",
      "account_id": "12345"
    },
    {
      "connector": "salesforce",
      "account_id": "00D5g000000abcd"
    }
  ],
  "success": true
}
```

---

### 9. Disconnect a Connector

**DELETE** `http://localhost:3000/api/connectors`

**Request Body:**
```json
{
  "connection_id": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Connector disconnected successfully"
}
```

---

## Database Verification Queries

### Check All User Connections
```sql
SELECT 
  uc.id,
  uc.user_id,
  c.connector_name,
  c.display_name,
  uc.account_name,
  uc.account_id,
  uc.is_active,
  uc.expires_at,
  uc.sync_status,
  uc.last_sync_at,
  uc.created_at,
  uc.instance_url,
  uc.metadata
FROM user_connectors uc
JOIN connectors c ON uc.connector_id = c.connector_id
WHERE uc.user_id = 1
ORDER BY uc.created_at DESC;
```

### Check Salesforce Instance URL
```sql
SELECT 
  account_name,
  account_id,
  instance_url as stored_instance_url,
  metadata->>'username' as sf_username,
  metadata->>'email' as sf_email,
  expires_at,
  created_at
FROM user_connectors
WHERE connector_id = 2 AND user_id = 1;
```

### Check Synced Contacts
```sql
SELECT 
  c.connector_name,
  COUNT(ac.*) as total_contacts,
  COUNT(CASE WHEN ac.is_deleted = false THEN 1 END) as active,
  COUNT(CASE WHEN ac.is_deleted = true THEN 1 END) as deleted,
  MAX(ac.updated_at) as last_sync
FROM abm_contacts ac
JOIN user_connectors uc ON ac.user_connector_id = uc.id
JOIN connectors c ON uc.connector_id = c.connector_id
WHERE uc.user_id = 1
GROUP BY c.connector_name;
```

### Check Tokens Expiring Soon
```sql
SELECT 
  c.connector_name,
  uc.account_name,
  uc.expires_at,
  EXTRACT(EPOCH FROM (uc.expires_at - NOW()))/3600 as hours_until_expiry
FROM user_connectors uc
JOIN connectors c ON uc.connector_id = c.connector_id
WHERE uc.is_active = true 
AND uc.expires_at < NOW() + INTERVAL '24 hours'
ORDER BY uc.expires_at;
```

---

## Testing Checklist

### HubSpot
- [ ] Authorization URL generates correctly
- [ ] Browser redirect to HubSpot login works
- [ ] Callback receives code and state
- [ ] Token exchange succeeds
- [ ] Connection saved to `user_connectors` table
- [ ] `account_id` and `account_name` populated
- [ ] `expires_at` is set correctly
- [ ] Contact sync retrieves contacts
- [ ] Contacts saved to `abm_contacts` table

### Salesforce
- [ ] Authorization URL generates correctly
- [ ] Browser redirect to Salesforce login works
- [ ] Callback receives code and state
- [ ] Token exchange succeeds
- [ ] **Instance URL automatically fetched from token response**
- [ ] Instance URL stored in `instance_url` column
- [ ] Organization details in `metadata`
- [ ] Contact sync uses correct instance URL
- [ ] SOQL queries work properly

### Google Ads
- [ ] Authorization URL generates correctly
- [ ] OAuth flow completes
- [ ] Developer token stored in metadata

### LinkedIn
- [ ] Authorization URL generates correctly
- [ ] OAuth flow completes
- [ ] Organization access granted

---

## Common Issues & Solutions

### Issue: "Redirect URI mismatch"
**Solution:** Ensure `.env` has exact match with OAuth app settings:
```
NEXT_PUBLIC_HUBSPOT_REDIRECT_URI=http://localhost:3000/api/oauth/hubspot/callback
```

### Issue: Salesforce "invalid_grant"
**Solution:** 
1. Check that authorization code hasn't expired (use within 15 seconds)
2. Verify CLIENT_ID and CLIENT_SECRET are correct
3. Instance URL should be auto-fetched (not from env)

### Issue: Token expires too quickly
**Solution:** Check `expires_at` calculation in callbacks:
```typescript
const expiresAt = calculateExpiry(tokenData.expires_in);
```

### Issue: Contacts not syncing
**Solution:**
1. Check connector is active: `is_active = true`
2. Verify access token hasn't expired
3. Check sync endpoint logs for API errors

---

## Production Deployment Notes

### 1. Update Redirect URIs in .env
```env
NEXT_PUBLIC_HUBSPOT_REDIRECT_URI=https://yourdomain.com/api/oauth/hubspot/callback
NEXT_PUBLIC_SALESFORCE_REDIRECT_URI=https://yourdomain.com/api/oauth/salesforce/callback
# ... etc
```

### 2. Update OAuth App Settings
Update redirect URIs in each platform's developer console:
- HubSpot: App Settings → Auth
- Salesforce: Connected App → Callback URL
- Google Cloud: OAuth 2.0 Client → Authorized redirect URIs
- LinkedIn: App Settings → OAuth 2.0 settings

### 3. Set Up Cron Job
Configure Vercel Cron or external service to call:
```
POST https://yourdomain.com/api/oauth/refresh-tokens
Authorization: Bearer YOUR_CRON_SECRET
```

Schedule: Every 1 hour

### 4. Enable HTTPS
All OAuth providers require HTTPS in production.

---

## Support

For issues or questions:
1. Check database logs: `SELECT * FROM user_connectors WHERE error_message IS NOT NULL`
2. Check API response errors in Network tab
3. Verify credentials in `.env` file
4. Ensure database schema is up to date

**Instance URL Note:** Salesforce instance URL is now automatically fetched from the token response and stored in the `instance_url` column. No need to configure it manually in .env!
