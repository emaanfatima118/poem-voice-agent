# ✅ Schema Fixed - Using connector_details Table

## Problem Solved

The original schema created a separate `user_connectors` table, but you already had a `connector_details` table that should store user OAuth tokens. 

## Schema Structure (Fixed)

### Table Relationships:
```
users (userid) 
  ↓
connector_details (userid, connector_id)
  ↓                    ↓
connectors      abm_contacts, abm_accounts, abm_activities
```

### connector_details Table Structure:
```sql
- id (PK)
- userid (FK → users.userid)
- connector_id (FK → connectors.connector_id)
- access_token (OAuth token)
- refresh_token (for auto-refresh)
- instance_url (for Salesforce, null for others)
- account_id (platform account ID)
- account_name
- account_email
- token_type (Bearer)
- scope
- is_active
- last_sync_at
- sync_status (idle/syncing/completed/failed)
- error_message
- metadata (JSONB)
- expiry (token expiration)
- created_at
- updated_at
- created_by

UNIQUE(userid, connector_id, account_id)
```

### connectors Table:
```sql
- connector_id (PK)
- connector_name (hubspot, salesforce, google_ads, linkedin, meta, tiktok)
- display_name
- description
- is_active
- created_at
- updated_at
```

### ABM Tables:
- **abm_contacts**: Links to `connector_detail_id`
- **abm_accounts**: Links to `connector_detail_id`
- **abm_activities**: Links to `connector_detail_id`

---

## Changes Made

### 1. Database Schema (`oauth-schema-fixed.sql`)
✅ Dropped incorrect `user_connectors` table
✅ Recreated `connector_details` with proper structure
✅ Links to `users.userid` (not `user_id`)
✅ ABM tables reference `connector_detail_id`

### 2. Updated Code (`lib/db/queries.ts`)
✅ Enhanced `connectorDetails` object with OAuth methods:
   - `upsert()` - Create/update OAuth tokens
   - `findByUser()` - Get user's connectors
   - `findOne()` - Get specific connector
   - `findExpiring()` - For token refresh
   - `disconnect()` - Deactivate connection
   - `updateSyncStatus()` - Update sync state
   - `updateTokens()` - Refresh tokens
✅ Added backward compatibility alias (`userConnectors`)

### 3. Updated OAuth Callbacks
✅ All callbacks now use `connectorDetails.upsert()`
✅ HubSpot, Salesforce, Google Ads, LinkedIn - all updated

### 4. Updated API Routes
✅ `/api/connectors` - uses `connectorDetails.findByUser()`
✅ `/api/oauth/refresh-tokens` - uses `connectorDetails.findExpiring()`

---

## Database Verification

```sql
-- Check table structure
\d connector_details

-- Check connectors
SELECT connector_id, connector_name, display_name 
FROM connectors 
ORDER BY connector_id;

-- Check user connections (after OAuth)
SELECT 
  cd.id,
  u.username,
  c.connector_name,
  cd.account_name,
  cd.instance_url,
  cd.is_active,
  cd.expiry
FROM connector_details cd
JOIN users u ON cd.userid = u.userid
JOIN connectors c ON cd.connector_id = c.connector_id
WHERE cd.userid = 6;
```

---

## Testing Endpoints (Updated)

Use **user_id=6** for testing:

### 1. HubSpot OAuth
```
GET http://localhost:3000/api/oauth/hubspot/authorize?user_id=6
```

### 2. Salesforce OAuth (Instance URL Auto-Stored)
```
GET http://localhost:3000/api/oauth/salesforce/authorize?user_id=6
```
**Instance URL will be stored in `connector_details.instance_url`**

### 3. Check Connections
```
GET http://localhost:3000/api/connectors?user_id=6
```

---

## Key Features

### ✅ Single Source of Truth
- One table (`connector_details`) stores all OAuth tokens
- No duplicate `user_connectors` table
- Clean foreign key relationships

### ✅ Instance URL Handling
- Salesforce: Automatically fetched and stored in `instance_url`
- Other platforms: `instance_url` is NULL
- No manual configuration needed

### ✅ Flexible Metadata
- Platform-specific data stored in `metadata` JSONB column
- Token type, scopes, user info all preserved

### ✅ Token Management
- Auto-refresh before expiry
- Tracks expiration in `expiry` column
- `findExpiring()` method for cron jobs

### ✅ Soft Disconnect
- `is_active` flag for disconnection
- Preserves historical data
- Can reactivate connections

---

## Table Links

```
users.userid
  ↓
connector_details.userid ← connector_details.connector_id → connectors.connector_id
  ↓
abm_contacts.connector_detail_id
abm_accounts.connector_detail_id
abm_activities.connector_detail_id
```

---

## Migration Complete

✅ All tables created
✅ All foreign keys properly linked
✅ Code updated to use correct table
✅ No TypeScript errors
✅ Ready for testing

---

## Next Steps

1. **Start server**: `npm run dev`
2. **Test OAuth flows** with user_id=6
3. **Verify in database**: Check `connector_details` table after OAuth
4. **Confirm instance_url**: Salesforce should auto-populate this field
5. **Test data sync**: Run contact sync endpoints

**Schema is now correctly structured! 🎉**
