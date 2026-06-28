# Scripts and Reports Folder Guidelines

**Last Updated:** November 26, 2025

---

## Overview

This document provides guidelines for managing the `scripts/` and `reports/` folders in the Stackwise project.

---

## 📁 `/scripts` Folder

### Purpose
Contains database migration scripts and one-time setup SQL files.

### Current Status
⚠️ **WARNING:** All SQL files in this folder are **OUTDATED** and should **NOT** be used.

### Files Present (All Outdated)
- `oauth-schema.sql` - Incorrect schema with `user_connectors` table
- `oauth-schema-fixed.sql` - Attempted fix but still incompatible
- `oauth-migration.sql` - Another incompatible migration approach

### Issues
These scripts conflict with the current production schema:
- Production uses: `connector_details` table with `userid` column
- Scripts try to create: `user_connectors` table with `user_id` column
- Running these scripts will break the database

### Guidelines

#### ✅ DO:
- Keep this folder for future migration scripts
- Document any new scripts in this file
- Test scripts on development database first
- Name files with timestamps: `YYYY-MM-DD_description.sql`
- Add comments explaining what each script does

#### ❌ DON'T:
- Run any existing SQL scripts without review
- Commit generated/temporary scripts
- Store production credentials in scripts

#### When Adding New Scripts:
1. Create a new file with descriptive name
2. Add comments at the top explaining purpose
3. Include rollback instructions
4. Test on development environment
5. Document in this file

---

## 📁 `/reports` Folder

### Purpose
Stores generated audit reports (PDF, JSON, Markdown formats).

### Current Status
✅ Correctly configured in `.gitignore` - files are not tracked by Git.

### File Types
- **PDF Reports**: Visual audit reports for clients
- **JSON Reports**: Raw audit data for API consumption
- **Markdown Reports**: Human-readable audit summaries

### Storage Location
All reports are generated at runtime and stored in:
```
d:\Stackwise\stackwise\reports\
```

### Guidelines

#### ✅ DO:
- Let the application generate reports automatically
- Clean up old reports periodically to save disk space
- Use consistent naming: `audit_{domain}_{timestamp}.{format}`

#### ❌ DON'T:
- Commit reports to Git (already in `.gitignore`)
- Manually edit generated reports
- Store sensitive client data in report filenames

#### Report Lifecycle:
1. User runs performance audit
2. System generates reports in all formats
3. Reports saved to `reports/` folder
4. User downloads via UI
5. Reports can be deleted after download

### Cleanup Strategy
Consider implementing automated cleanup:
- Delete reports older than 30 days
- Archive important reports to cloud storage
- Set up cron job or scheduled task

---

## 🔒 Security Notes

### Both Folders:
- Added to `.gitignore` to prevent accidental commits
- Should not contain sensitive credentials
- Review contents before sharing

### Reports Folder Specifically:
- May contain client URLs and performance data
- Should be treated as confidential
- Consider encryption for archived reports

---

## 🗂️ Current Database Schema

### OAuth Tables (Production)
```
connectors
├── connector_id (PK)
├── connector_name (hubspot, salesforce, etc.)
├── display_name
├── description
└── is_active

connector_details
├── id (PK)
├── userid (FK -> users.userid)
├── connector_id (FK -> connectors.connector_id)
├── access_token
├── refresh_token
├── instance_url
├── account_id
├── account_name
├── account_email
├── is_active
└── metadata

abm_contacts (Future)
├── id (PK)
├── connector_detail_id (FK -> connector_details.id)
├── external_id
├── email
└── ...

abm_accounts (Future)
├── id (PK)
├── connector_detail_id (FK -> connector_details.id)
├── external_id
└── ...
```

**Note**: ABM tables are planned but not yet implemented in codebase.

---

## 🚀 Future Improvements

### Scripts Folder:
- [ ] Create proper migration from current state
- [ ] Add database backup scripts
- [ ] Include rollback procedures
- [ ] Add seed data scripts for development

### Reports Folder:
- [ ] Implement automated cleanup
- [ ] Add cloud storage integration (Google Cloud Storage)
- [ ] Create report archiving system
- [ ] Add download history tracking

---

## 📝 Maintenance

### Weekly Tasks:
- Review disk space in `/reports` folder
- Check for failed report generations

### Monthly Tasks:
- Clean up reports older than 30 days
- Review and update outdated scripts

### Before Database Changes:
1. Backup production database
2. Test migration on development
3. Create new script in `/scripts` with timestamp
4. Document changes in this file
5. Plan rollback strategy

---

## 🆘 Troubleshooting

### Issue: "Table already exists" error
**Solution**: Check if script was already run. Review current database schema.

### Issue: Reports folder taking too much space
**Solution**: Clean up old reports or implement automated cleanup.

### Issue: Script conflicts with current schema
**Solution**: Do NOT run the script. Review current production schema first.

---

## 📞 Contact

For questions about database migrations or report generation:
- Check `lib/db/queries.ts` for current schema
- Review `lib/audit/exports.ts` for report generation logic
- Consult this document before running any scripts

---

*This document should be updated whenever changes are made to the scripts or reports handling.*
