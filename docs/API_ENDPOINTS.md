# 🔌 Stackwise OAuth API Endpoints

## Base URL
`http://localhost:3000` (Development)

---

## 🔐 OAuth Authorization Endpoints

### Start OAuth Flow
Get authorization URL to begin OAuth process for each platform.

#### HubSpot
```
GET /api/oauth/hubspot/authorize?user_id=1
```

#### Salesforce
```
GET /api/oauth/salesforce/authorize?user_id=1
```
**Note:** Instance URL automatically fetched and stored

#### Google Ads
```
GET /api/oauth/google-ads/authorize?user_id=1
```

#### LinkedIn
```
GET /api/oauth/linkedin/authorize?user_id=1
```

**Response Format:**
```json
{
  "authorization_url": "https://platform.com/oauth/authorize?client_id=...&state=...",
  "connector": "platform_name",
  "user_id": "1"
}
```

**Usage:**
1. Call endpoint to get `authorization_url`
2. Open URL in browser
3. User authorizes app
4. Redirects to callback (automatic)
5. Token saved to database

---

## 📊 Check Connection Status

### Get All Connectors
```
GET /api/connectors?user_id=1
```

**Response:**
```json
{
  "success": true,
  "connectors": [
    {
      "connector_id": 1,
      "connector_name": "hubspot",
      "display_name": "HubSpot",
      "description": "CRM and marketing automation platform",
      "is_available": true,
      "is_connected": true,
      "connection_status": {
        "id": 1,
        "is_active": true,
        "account_name": "company-hub",
        "account_id": "12345678",
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
      "display_name": "Salesforce",
      "is_connected": true,
      "connection_status": {
        "account_name": "Your Company",
        "account_id": "00D5g000000abcd",
        "metadata": {
          "instance_url": "https://yourinstance.salesforce.com",
          "username": "user@company.com"
        }
      }
    }
  ]
}
```

**Shows:**
- Which connectors are available
- Which are currently connected
- Connection details (account name, ID, expiry)
- **Salesforce instance URL** (auto-fetched)

---

## 🔄 Data Synchronization

### Sync HubSpot Contacts
```
POST /api/sync/hubspot/contacts
Content-Type: application/json

{
  "user_id": 1
}
```

**Response:**
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

### Sync Salesforce Contacts
```
POST /api/sync/salesforce/contacts
Content-Type: application/json

{
  "user_id": 1
}
```

**Response:**
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

**Note:** Uses `instance_url` from database automatically

---

## 🔑 Token Management

### Refresh Expired Tokens
```
GET /api/oauth/refresh-tokens?secret=your-cron-secret
```

**Response:**
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

**Purpose:** Automatically refresh tokens before they expire

**Schedule:** Run every hour via cron job

---

## 🔌 Disconnect Connector

### Remove Connection
```
DELETE /api/connectors
Content-Type: application/json

{
  "connection_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connector disconnected successfully"
}
```

**Effect:** Sets `is_active = false` in database

---

## 📝 Complete OAuth Flow Example

### 1. Start Authorization
```bash
curl "http://localhost:3000/api/oauth/hubspot/authorize?user_id=1"
```

**Response:**
```json
{
  "authorization_url": "https://app.hubspot.com/oauth/authorize?client_id=bdc69703...&state=eyJ1c2VyX2lkIjoi...",
  "connector": "hubspot",
  "user_id": "1"
}
```

### 2. User Authorizes (Browser)
Open `authorization_url` in browser → User clicks "Authorize"

### 3. Callback (Automatic)
Browser redirects to:
```
http://localhost:3000/api/oauth/hubspot/callback?code=abc123&state=eyJ1c2VyX2lk...
```

Backend:
- Exchanges code for access token
- Fetches account details
- **For Salesforce: Automatically extracts instance URL**
- Stores in `user_connectors` table
- Redirects to `/settings/integrations?success=hubspot_connected`

### 4. Verify Connection
```bash
curl "http://localhost:3000/api/connectors?user_id=1"
```

**Response shows:**
```json
{
  "connector_name": "hubspot",
  "is_connected": true
}
```

### 5. Sync Data
```bash
curl -X POST "http://localhost:3000/api/sync/hubspot/contacts" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'
```

**Contacts synced to `abm_contacts` table**

---

## 🎯 Testing Checklist for Postman

### HubSpot
- [ ] GET `/api/oauth/hubspot/authorize?user_id=1`
- [ ] Authorize in browser
- [ ] GET `/api/connectors?user_id=1` (verify connected)
- [ ] POST `/api/sync/hubspot/contacts` (sync data)

### Salesforce
- [ ] GET `/api/oauth/salesforce/authorize?user_id=1`
- [ ] Authorize in browser
- [ ] GET `/api/connectors?user_id=1` (verify instance_url in metadata)
- [ ] Check database for `instance_url` column value
- [ ] POST `/api/sync/salesforce/contacts`

### Google Ads
- [ ] GET `/api/oauth/google-ads/authorize?user_id=1`
- [ ] Authorize in browser
- [ ] GET `/api/connectors?user_id=1`

### LinkedIn
- [ ] GET `/api/oauth/linkedin/authorize?user_id=1`
- [ ] Authorize in browser
- [ ] GET `/api/connectors?user_id=1`

### Token Refresh
- [ ] GET `/api/oauth/refresh-tokens?secret=your-cron-secret`
- [ ] Verify tokens refreshed in database

---

## 🔧 Database Tables

### user_connectors
Stores OAuth connections:
- `user_id` - User who connected
- `connector_id` - Platform (1=HubSpot, 2=Salesforce, etc.)
- `access_token` - OAuth access token
- `refresh_token` - Refresh token for auto-refresh
- `expires_at` - When token expires
- `instance_url` - **Salesforce instance URL (auto-fetched)**
- `account_name` - Connected account name
- `account_id` - Platform account ID
- `metadata` - Additional platform-specific data
- `is_active` - Connection status

### abm_contacts
Stores synced CRM contacts:
- `user_connector_id` - Link to connection
- `external_id` - CRM contact ID
- `email`, `first_name`, `last_name`
- `company`, `job_title`, `phone`
- `is_deleted` - Soft-delete flag
- Timestamps for sync tracking

---

## 📌 Key Features

### ✅ Salesforce Instance URL
- Automatically extracted from OAuth token response
- Stored in `instance_url` column
- No manual configuration needed
- Used automatically for all Salesforce API calls

### ✅ Token Auto-Refresh
- Tokens automatically refreshed before expiry
- Cron job checks every hour
- Refreshes tokens expiring in next 24 hours
- No user intervention required

### ✅ Soft-Delete Tracking
- When CRM contact is deleted, marked `is_deleted = true`
- Not shown in ABM Command Center
- Historical data preserved

---

## 🚀 Postman Collection

Import: `Stackwise_OAuth_Testing.postman_collection.json`

Includes all endpoints ready to test!

---

## 📚 Documentation Files

- **OAUTH_TESTING_GUIDE.md** - Comprehensive testing guide
- **QUICK_START_OAUTH.md** - Quick setup and testing (5 min)
- **Stackwise_OAuth_Testing.postman_collection.json** - Postman collection

---

## 🔒 Security Notes

- All OAuth flows use state parameter to prevent CSRF
- State includes user_id and timestamp (10 min expiry)
- Tokens stored encrypted in database
- Refresh tokens securely stored
- CRON_SECRET required for token refresh endpoint
- HTTPS required in production

---

## 🎉 Ready to Test!

1. Import Postman collection
2. Start with HubSpot (easiest)
3. Test Salesforce (verify instance_url)
4. Move to Google Ads and LinkedIn
5. Test data sync
6. Verify in database

**All endpoints are ready for testing!**
