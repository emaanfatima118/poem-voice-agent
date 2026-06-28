# SSO Implementation Checklist

Use this checklist to ensure everything is set up correctly.

## ☑️ Pre-Setup

- [ ] Node.js and npm installed
- [ ] PostgreSQL running and accessible
- [ ] Stackwise database exists
- [ ] Can connect to database: `psql -U postgres -d stackwise`

## ☑️ Installation

- [ ] Install jsonwebtoken: `npm install jsonwebtoken`
- [ ] Install types: `npm install --save-dev @types/jsonwebtoken`
- [ ] Verify package.json has both dependencies

## ☑️ Database Migration

- [ ] Run migration script:
  ```powershell
  $env:PGPASSWORD="postgres"
  psql -U postgres -d stackwise -f scripts/2025-12-05_add-sso-support.sql
  ```
- [ ] Verify new columns exist:
  ```sql
  \d users
  -- Should show: auth_provider, provider_user_id
  -- Password should be nullable
  ```
- [ ] Verify connectors inserted:
  ```sql
  SELECT * FROM connectors WHERE connector_name LIKE '%OAuth%';
  -- Should show 3 rows
  ```

## ☑️ Google OAuth Setup

- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create OAuth 2.0 Client ID
- [ ] Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
- [ ] Copy Client ID to .env as `GOOGLE_CLIENT_ID`
- [ ] Copy Client Secret to .env as `GOOGLE_CLIENT_SECRET`
- [ ] Test configuration: http://localhost:3000/api/auth/sso/test

## ☑️ Microsoft OAuth Setup

- [ ] Go to https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps
- [ ] Register new application
- [ ] Add redirect URI: `http://localhost:3000/api/auth/microsoft/callback`
- [ ] Copy Application ID to .env as `MICROSOFT_CLIENT_ID`
- [ ] Create client secret and copy to .env as `MICROSOFT_CLIENT_SECRET`
- [ ] Set `MICROSOFT_TENANT_ID=common` in .env
- [ ] Test configuration: http://localhost:3000/api/auth/sso/test

## ☑️ Apple OAuth Setup (Optional)

- [ ] Go to https://developer.apple.com/account/resources/identifiers
- [ ] Create Services ID
- [ ] Configure Sign In with Apple
- [ ] Add domain and return URL
- [ ] Generate .p8 private key
- [ ] Add all Apple credentials to .env
- [ ] Test configuration: http://localhost:3000/api/auth/sso/test

## ☑️ Environment Configuration

- [ ] Set `NEXT_PUBLIC_APP_URL=http://localhost:3000` in .env
- [ ] Set `SESSION_SECRET` to random string in .env
- [ ] All Google variables set
- [ ] All Microsoft variables set
- [ ] (Optional) All Apple variables set
- [ ] Verify with: http://localhost:3000/api/auth/sso/test

## ☑️ Testing

### Google SSO
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:3000/login
- [ ] Click Google button
- [ ] Redirects to Google login
- [ ] Sign in with Google account
- [ ] Redirects back to Stackwise dashboard
- [ ] Check database for new user:
  ```sql
  SELECT * FROM users WHERE auth_provider = 'google';
  ```

### Microsoft SSO
- [ ] Click Microsoft button on login page
- [ ] Redirects to Microsoft login
- [ ] Sign in with Microsoft account
- [ ] Redirects back to dashboard
- [ ] Check database:
  ```sql
  SELECT * FROM users WHERE auth_provider = 'microsoft';
  ```

### Apple SSO (Optional)
- [ ] Click Apple button on login page
- [ ] Redirects to Apple login
- [ ] Sign in with Apple ID
- [ ] Redirects back to dashboard
- [ ] Check database:
  ```sql
  SELECT * FROM users WHERE auth_provider = 'apple';
  ```

## ☑️ Verification

- [ ] Session cookie created after login (check DevTools → Application → Cookies)
- [ ] User data in `users` table
- [ ] User details in `user_details` table
- [ ] Can logout and login again
- [ ] Multiple providers work independently
- [ ] Existing email links to SSO account correctly

## ☑️ Production Preparation

- [ ] Update OAuth redirect URIs to production domain
- [ ] Change `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Generate strong `SESSION_SECRET` (32+ random characters)
- [ ] Enable HTTPS (required for Apple, recommended for all)
- [ ] Test all providers in production environment
- [ ] Monitor error logs for issues
- [ ] Set up alerting for auth failures

## 🎯 Quick Test Command

After setup, verify configuration:
```powershell
npm run dev
```

Then visit:
- Configuration test: http://localhost:3000/api/auth/sso/test
- Login page: http://localhost:3000/login

## 📊 Success Metrics

You've successfully completed setup when:
- ✅ All checkboxes above are checked
- ✅ Configuration test shows "ready" status
- ✅ Can login with at least one SSO provider
- ✅ User data appears in database correctly
- ✅ Session persists across page refreshes

## 🐛 Troubleshooting

If something doesn't work:

1. **Check configuration test**: http://localhost:3000/api/auth/sso/test
2. **Review browser console** for client-side errors
3. **Check terminal logs** for server-side errors
4. **Verify database migration** ran successfully
5. **Confirm redirect URIs** match exactly in provider consoles

## 📚 Resources

- Quick Start: `docs/SSO_QUICK_START.md`
- Full Guide: `docs/SSO_SETUP_GUIDE.md`
- Implementation Summary: `docs/SSO_IMPLEMENTATION_COMPLETE.md`

---

**Current Status**: _____ / _____ items completed

**Last Updated**: _____________

**Notes**:
