# Stackwise Documentation

This folder contains technical documentation for the Stackwise project.

---

## 📚 Documentation Index

### 🔧 Project Management
- **[SCRIPTS_AND_REPORTS.md](SCRIPTS_AND_REPORTS.md)** - Guidelines for managing scripts and reports folders ⭐ **NEW**

### 🗄️ Database & Schema
- [DATABASE.md](DATABASE.md) - Database configuration and setup
- [DATABASE_SETUP_COMPLETE.md](DATABASE_SETUP_COMPLETE.md) - Database setup completion notes
- [AUDIT_DATABASE_INTEGRATION.md](AUDIT_DATABASE_INTEGRATION.md) - Audit system database integration
- [SCHEMA_FIXED.md](SCHEMA_FIXED.md) - Schema fixes and migrations

### 🔐 OAuth Integration
- [OAUTH_SETUP.md](OAUTH_SETUP.md) - OAuth configuration guide
- [OAUTH_FIXES.md](OAUTH_FIXES.md) - OAuth implementation fixes
- [OAUTH_TESTING_GUIDE.md](OAUTH_TESTING_GUIDE.md) - Testing OAuth flows
- [QUICK_START_OAUTH.md](QUICK_START_OAUTH.md) - Quick start for OAuth setup

### 🎨 UI & Features
- [INTEGRATIONS_PAGE.md](INTEGRATIONS_PAGE.md) - Integrations page documentation
- [ROUTING_MIGRATION_COMPLETE.md](ROUTING_MIGRATION_COMPLETE.md) - Routing migration notes

### 🚀 API Documentation
- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Available API endpoints
- [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Complete setup guide

---

## 🗂️ Project Structure

```
stackwise/
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes
│   │   ├── connectors/     # Connector management endpoints
│   │   ├── oauth/          # OAuth flow endpoints (HubSpot, Salesforce, etc.)
│   │   └── sync/           # Data sync endpoints
│   ├── integrations/       # OAuth integrations UI page
│   └── layout.tsx          # Root layout
├── lib/                     # Core business logic
│   ├── audit/              # Performance audit system
│   │   └── exports.ts      # Report generation (PDF, JSON, MD)
│   ├── db/                 # Database queries and schema
│   │   ├── schema.sql      # PostgreSQL schema
│   │   └── queries.ts      # Database operations
│   └── oauth/              # OAuth configuration
│       └── config.ts       # OAuth platform configs
├── src/                     # React components
│   └── components/         # Reusable UI components
├── docs/                    # Documentation (this folder)
├── scripts/                 # Database migration scripts ⚠️
├── reports/                 # Generated audit reports (not in Git)
└── public/                  # Static assets
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file with required variables:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
HUBSPOT_CLIENT_ID=...
HUBSPOT_CLIENT_SECRET=...
SALESFORCE_CLIENT_ID=...
SALESFORCE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```

### 3. Run Development Server
```bash
npm run dev
```

Access at: `http://localhost:3000`

---

## 🗄️ Database Schema Overview

### OAuth Tables
| Table | Purpose |
|-------|---------|
| `connectors` | Available OAuth platforms (HubSpot, Salesforce, Google Ads, LinkedIn) |
| `connector_details` | User OAuth connections, access tokens, refresh tokens |

### Audit Tables
| Table | Purpose |
|-------|---------|
| `performance_audit_log` | Audit history and performance results |

### ABM Tables (Planned)
| Table | Purpose |
|-------|---------|
| `abm_contacts` | Synced CRM contacts |
| `abm_accounts` | Synced CRM accounts/companies |
| `abm_activities` | CRM activities and interactions |

**Schema Reference**: See `lib/db/schema.sql` for complete table definitions.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL 15 |
| **Styling** | Tailwind CSS |
| **PDF Generation** | Playwright |
| **Charts** | SVG (native, no canvas) |
| **Authentication** | OAuth 2.0 |
| **Deployment** | Docker, Cloud Run |

---

## 📝 Key Features

### 1. Performance Audits
- Website performance analysis
- Multi-format reports (PDF, JSON, Markdown)
- Trend tracking with SVG charts
- Located in: `lib/audit/exports.ts`

### 2. OAuth Integrations
- HubSpot, Salesforce, Google Ads, LinkedIn
- Automatic token refresh
- Popup-based OAuth flow with auto-close
- Located in: `app/api/oauth/*/`

### 3. CRM Data Sync (In Progress)
- ABM contact and account management
- Activity tracking
- Sync status monitoring

---

## ⚠️ Important Notes

### Scripts Folder
- **DO NOT** run existing SQL files without review
- All current scripts are **OUTDATED** and incompatible with production
- See [`scripts/README.md`](../scripts/README.md) for details

### Reports Folder
- Auto-generated audit reports
- Not tracked in Git (`.gitignore`)
- Clean up periodically to save disk space
- See [`reports/README.md`](../reports/README.md) for details

---

## 📖 Development Guidelines

### Adding New Features
1. Create feature branch from `master`
2. Implement changes with TypeScript strict mode
3. Add documentation in this folder
4. Test locally before committing
5. Update relevant docs

### Database Changes
1. **NEVER** run scripts without backup
2. Test on development database first
3. Document changes in `docs/DATABASE.md`
4. Create dated migration script
5. Update `lib/db/schema.sql`

### Code Style
- Use TypeScript strict mode
- Follow existing patterns in `lib/` folder
- Add JSDoc comments for complex functions
- Keep components small and focused

---

## 🔍 Troubleshooting

### OAuth Issues
- Check environment variables in `.env`
- Review [OAUTH_FIXES.md](OAUTH_FIXES.md)
- Test with [OAUTH_TESTING_GUIDE.md](OAUTH_TESTING_GUIDE.md)

### Database Errors
- Verify connection string in `.env`
- Check schema in `lib/db/schema.sql`
- Review queries in `lib/db/queries.ts`

### Docker Build Issues
- Ensure no native dependencies (canvas removed)
- Check Dockerfile configuration
- Verify all environment variables set

---

## 📞 Support

For questions or issues:
1. Check relevant documentation in this folder
2. Review code comments in `lib/` directory  
3. Consult specific guides (OAuth, Database, API)
4. Check `scripts/README.md` before running database scripts

---

**Last Updated**: November 26, 2025  
*Keep this documentation updated as the project evolves.*
