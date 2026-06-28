# Quick Start: Testing OAuth Connectors

## 🚀 Setup (5 minutes)

### 1. Run Database Schema
```bash
psql -h 34.30.5.132 -U postgres -d stackwise -f lib/db/oauth-schema.sql
```

### 2. Start Server
```bash
npm run dev
```

Server runs at: **http://localhost:3000**

---

## 🧪 Testing in Postman

### Import Collection
1. Import `Stackwise_OAuth_Testing.postman_collection.json` into Postman
2. Collection includes all endpoints ready to test

---

## ✅ Test Each Connector (2-3 minutes each)

### HubSpot

**Step 1:** GET `http://localhost:3000/api/oauth/hubspot/authorize?user_id=1`

**Step 2:** Copy `authorization_url` from response → Open in browser → Authorize

**Step 3:** Verify connection:
```
GET http://localhost:3000/api/connectors?user_id=1
```

**Expected:** `"is_connected": true` for HubSpot

---

### Salesforce (Instance URL Auto-Fetched ✨)

**Step 1:** GET `http://localhost:3000/api/oauth/salesforce/authorize?user_id=1`

**Step 2:** Authorize in browser

**Step 3:** Verify instance URL stored:
```
GET http://localhost:3000/api/connectors?user_id=1
```

**Expected Response:**
```json
{
  "connector_name": "salesforce",
  "is_connected": true,
  "connection_status": {
    "metadata": {
      "instance_url": "https://yourinstance.salesforce.com"
    }
  }
}
```

**✅ Instance URL is automatically fetched from Salesforce token response!**

---

### Google Ads

**Step 1:** GET `http://localhost:3000/api/oauth/google-ads/authorize?user_id=1`

**Step 2:** Authorize in browser

**Step 3:** Verify connection

---

### LinkedIn

**Step 1:** GET `http://localhost:3000/api/oauth/linkedin/authorize?user_id=1`

**Step 2:** Authorize in browser

**Step 3:** Verify connection

---

## 📊 Verify in Database

### Check Salesforce Instance URL
```sql
SELECT 
  account_name,
  account_id,
  instance_url,
  metadata->>'username' as sf_username,
  expires_at,
  is_active
FROM user_connectors
WHERE connector_id = 2 AND user_id = 1;
```

**Expected:**
- `instance_url` column populated: ✅
- `metadata` contains user details: ✅
- No manual configuration needed: ✅

### Check All Connections
```sql
SELECT 
  c.connector_name,
  c.display_name,
  uc.account_name,
  uc.account_id,
  uc.is_active,
  uc.expires_at,
  uc.instance_url
FROM user_connectors uc
JOIN connectors c ON uc.connector_id = c.connector_id
WHERE uc.user_id = 1;
```

---

## 🔄 Test Data Sync

### HubSpot Contacts
```
POST http://localhost:3000/api/sync/hubspot/contacts
Body: { "user_id": 1 }
```

**Expected:** Contacts synced to `abm_contacts` table

### Salesforce Contacts
```
POST http://localhost:3000/api/sync/salesforce/contacts
Body: { "user_id": 1 }
```

**Uses instance_url from database automatically!**

---

## 📋 Quick Checklist

- [ ] Database schema created
- [ ] Server running on localhost:3000
- [ ] HubSpot connected and verified
- [ ] Salesforce connected (instance URL auto-stored)
- [ ] Google Ads connected
- [ ] LinkedIn connected
- [ ] All connectors show `is_connected: true`
- [ ] Salesforce `instance_url` column populated
- [ ] Contact sync works for HubSpot
- [ ] Contact sync works for Salesforce

---

## 🎯 Key Testing Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/oauth/{platform}/authorize?user_id=1` | GET | Start OAuth flow |
| `/api/connectors?user_id=1` | GET | Check all connections |
| `/api/sync/{platform}/contacts` | POST | Sync CRM contacts |
| `/api/oauth/refresh-tokens` | GET | Refresh expired tokens |
| `/api/connectors` | DELETE | Disconnect connector |

---

## 💡 Important Notes

### Salesforce Instance URL
- ✅ **Automatically fetched** from OAuth token response
- ✅ **Stored in database** `instance_url` column
- ✅ **No manual configuration** needed in .env
- ✅ **Used automatically** for all Salesforce API calls

### Redirect URIs
Make sure these match in OAuth app settings:
- HubSpot: `http://localhost:3000/api/oauth/hubspot/callback`
- Salesforce: `http://localhost:3000/api/oauth/salesforce/callback`
- Google Ads: `http://localhost:3000/api/oauth/google-ads/callback`
- LinkedIn: `http://localhost:3000/api/oauth/linkedin/callback`

---

## 📞 Support

**Issue:** Redirect URI mismatch  
**Fix:** Update OAuth app settings in platform developer console

**Issue:** Salesforce "invalid_grant"  
**Fix:** Use auth code within 15 seconds, verify CLIENT_ID/SECRET

**Issue:** Token expired  
**Fix:** Call `/api/oauth/refresh-tokens` to refresh all tokens

---

## 🎉 Success Criteria

All connectors should:
1. ✅ Generate valid authorization URLs
2. ✅ Complete OAuth flow without errors
3. ✅ Store tokens in `user_connectors` table
4. ✅ Show `is_active: true` and `is_connected: true`
5. ✅ Salesforce instance URL auto-populated
6. ✅ Sync contacts to ABM database

**For detailed testing steps, see: `OAUTH_TESTING_GUIDE.md`**
