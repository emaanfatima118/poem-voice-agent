# Scripts Folder

This folder is reserved for database migration scripts and maintenance SQL files.

## Current Status

✅ **Clean** - No scripts currently present. Outdated files have been removed.

## Guidelines for Adding Scripts

### Before Creating a Script
1. Check `docs/SCRIPTS_AND_REPORTS.md` for guidelines
2. Review current database schema in `lib/db/schema.sql`
3. Review queries in `lib/db/queries.ts` to understand current structure
4. Create backup of production database

### Naming Convention
Use timestamp format: `YYYY-MM-DD_description.sql`

**Examples:**
- `2025-11-26_add_user_preferences.sql`
- `2025-11-27_update_connector_scopes.sql`

### Script Template
```sql
-- Script: [Name]
-- Purpose: [What this script does]
-- Author: [Your name]
-- Date: [YYYY-MM-DD]
-- IMPORTANT: Test on development database first!

-- Rollback instructions:
-- [How to undo these changes]

BEGIN;

-- Your SQL here

COMMIT;
```

### Checklist
- [ ] Tested on development database
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Updated `docs/SCRIPTS_AND_REPORTS.md`
- [ ] Added comments explaining changes

### Current Production Schema

**OAuth Tables:**
- `connectors` - Available OAuth platforms
- `connector_details` - User OAuth connections with `userid` column

**See:** `lib/db/schema.sql` for complete schema

---

For detailed guidelines, see: [`docs/SCRIPTS_AND_REPORTS.md`](../docs/SCRIPTS_AND_REPORTS.md)
