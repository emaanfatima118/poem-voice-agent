# Stackwise Database Documentation

## Database Overview

The Stackwise platform uses PostgreSQL with a comprehensive schema supporting four main modules:
- **PulseHub**: Performance audits and analytics
- **BrandCraft**: Brand strategy and messaging
- **FlightDeck**: Operations and campaign management
- **Strategy Studio**: Strategic planning and roadmaps

## Architecture

- **Access-based design**: Role-based permissions with granular access control
- **GCP document storage**: Document URLs stored in database, files in Google Cloud Storage
- **SERIAL IDs**: Integer-based primary keys (not UUIDs)
- **Audit logging**: Complete activity tracking with JSONB data
- **Soft deletes**: Documents support soft delete for recovery

## Database Schema (18 Tables)

### Core Tables

#### 1. `users`
Main user accounts with authentication
- Primary Key: `userid` (SERIAL)
- Fields: username, email, password (hashed), user_type, connector_id
- Indexes: email, username

#### 2. `user_details`
Extended user profile information
- Primary Key: `detail_id` (SERIAL)
- Foreign Key: `userid` → users
- Fields: first_name, last_name, ssn (encrypted), phone, company_name, job_title, profile_picture_url

#### 3. `user_roles`
Role-based access control
- Primary Key: `role_id` (SERIAL)
- Foreign Key: `userid` → users
- Roles: admin, viewer, editor, contributor
- Supports role expiration and assignment tracking

### Authentication & Integration

#### 4. `connectors`
OAuth and integration connectors
- Primary Key: `connector_id` (SERIAL)
- Default connectors: Google, Salesforce, HubSpot, Microsoft

#### 5. `connector_details`
OAuth tokens and credentials
- Primary Key: `id` (SERIAL)
- Foreign Key: `connector_id` → connectors
- Stores: access_token, refresh_token, instance_url, expiry

### Subscription & Payment

#### 6. `user_subscription`
User subscription and payment status
- Primary Key: `payment_id` (SERIAL)
- Foreign Key: `userid` → users
- Types: free, starter, professional, enterprise
- Stripe integration ready

#### 7. `card_details`
Payment card information
- Primary Key: `card_id` (SERIAL)
- Foreign Key: `userid` → users
- Stores: last 4 digits only, Stripe payment method ID

### Features & Modules

#### 8. `key_features`
Main features available across modules
- Primary Key: `feature_id` (SERIAL)
- Boolean flags: pulse_hub, brand_craft, flight_deck, strategy_studio
- Default features for each module pre-seeded

#### 9. `sub_features`
Sub-features within main features
- Primary Key: `sub_id` (SERIAL)
- Foreign Key: `feature_id` → key_features

#### 10. `sub_feature_attributes`
Configurable attributes for sub-features
- Primary Key: `id` (SERIAL)
- Foreign Key: `sub_id` → sub_features
- Data types: string, number, boolean, json

### Document Management

#### 11. `user_documents`
Document metadata (files stored in GCP)
- Primary Key: `doc_id` (SERIAL)
- Foreign Keys: user_id, feature_id, sub_id
- Fields: url (GCP), gcs_bucket, gcs_path, file_size, mime_type
- Supports soft delete

### Audit & Logging

#### 12. `audit_logs`
Complete activity tracking
- Primary Key: `audit_id` (SERIAL)
- Foreign Key: `user_id` → users
- Fields: action, module, resource_type, audit_data (JSONB)
- Tracks: IP address, user agent, session ID

### Module-Specific Tables

#### 13. `pulse_hub_audits`
PulseHub performance audits
- Primary Key: `audit_id` (SERIAL)
- Foreign Key: `user_id` → users
- Status: pending, processing, completed, failed

#### 14. `brand_craft_projects`
BrandCraft brand strategy projects
- Primary Key: `project_id` (SERIAL)
- Foreign Key: `user_id` → users
- Status: draft, in_progress, completed

#### 15. `flight_deck_operations`
FlightDeck operations and campaigns
- Primary Key: `operation_id` (SERIAL)
- Foreign Key: `user_id` → users

#### 16. `strategy_studio_plans`
Strategy Studio strategic plans
- Primary Key: `plan_id` (SERIAL)
- Foreign Key: `user_id` → users
- Includes target_date for planning

### Access Control

#### 17. `resource_permissions`
Granular resource-level permissions
- Primary Key: `permission_id` (SERIAL)
- Foreign Keys: user_id, role_id
- Permission levels: read, write, admin
- Supports expiration

#### 18. `schema_migrations`
Migration tracking
- Primary Key: `version`
- Tracks applied migrations

## Database Views

### `user_access_view`
Consolidated user information with roles and subscription
```sql
SELECT userid, username, email, user_type, subscription_type, roles
```

### `user_documents_view`
Documents with feature and module information
```sql
SELECT doc_id, document_name, url, feature_name, module
```

## Usage Examples

### TypeScript Query Helpers

```typescript
import { users, documents, auditLogs, pulseHubAudits } from '@/lib/db/queries';

// Create user
const user = await users.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: hashedPassword,
  user_type: 'standard'
});

// Upload document
const doc = await documents.upload({
  user_id: user.userid,
  document_name: 'audit-report.pdf',
  url: 'https://storage.googleapis.com/bucket/path/file.pdf',
  gcs_bucket: 'stackwise-prod',
  gcs_path: 'users/1/documents/audit-report.pdf',
  file_size: 1024000,
  mime_type: 'application/pdf'
});

// Create audit log
await auditLogs.log({
  user_id: user.userid,
  action: 'document_upload',
  module: 'pulsehub',
  resource_type: 'document',
  resource_id: doc.doc_id,
  audit_data: { filename: doc.document_name },
  ip_address: req.ip
});

// Create PulseHub audit
const audit = await pulseHubAudits.create({
  user_id: user.userid,
  audit_name: 'Website Performance Audit',
  website_url: 'https://example.com',
  status: 'pending'
});
```

## NPM Scripts

```bash
# Initialize database schema
npm run db:init

# Check database health
npm run db:health

# Test database (comprehensive tests)
npm run db:test

# Full setup with migrations
npm run db:setup
```

## Database Connection

Configuration via environment variables:
```env
DB_HOST=34.30.5.132
DB_PORT=5432
DB_NAME=stackwise
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

## Foreign Key Relationships

All relationships verified:
- `user_details.userid` → `users.userid` (CASCADE)
- `user_roles.userid` → `users.userid` (CASCADE)
- `users.connector_id` → `connectors.connector_id` (SET NULL)
- `connector_details.connector_id` → `connectors.connector_id` (CASCADE)
- `user_subscription.userid` → `users.userid` (CASCADE)
- `sub_features.feature_id` → `key_features.feature_id` (CASCADE)
- `sub_feature_attributes.sub_id` → `sub_features.sub_id` (CASCADE)
- `user_documents.user_id` → `users.userid` (CASCADE)
- `user_documents.feature_id` → `key_features.feature_id` (SET NULL)
- `user_documents.sub_id` → `sub_features.sub_id` (SET NULL)
- `audit_logs.user_id` → `users.userid` (SET NULL)

## Security Features

1. **Password Hashing**: Store bcrypt/argon2 hashes only
2. **Encrypted Fields**: SSN should be encrypted at application layer
3. **Secure Tokens**: OAuth tokens stored securely in connector_details
4. **Audit Trail**: Complete logging of all user actions
5. **Role-Based Access**: Granular permissions per resource
6. **Soft Deletes**: Document recovery capability

## Performance Optimizations

- Indexes on frequently queried columns
- Automatic timestamp updates via triggers
- Connection pooling (max 20 connections)
- Query result caching capability
- Slow query logging (>1s)

## Testing

Comprehensive test suite covers:
- ✅ Database connection
- ✅ Schema structure (18 tables, 2 views)
- ✅ Seed data (4 connectors, 8 features)
- ✅ Query functions (all CRUD operations)
- ✅ Foreign key relationships (22 constraints)
- ✅ Module operations (all 4 modules)
- ✅ Access control and permissions

Run tests: `npm run db:test`

## Seed Data

### Connectors
- Google OAuth 2.0
- Salesforce OAuth
- HubSpot OAuth
- Microsoft Azure AD

### Key Features
- Performance Audit (PulseHub)
- Competitor Analysis (PulseHub)
- Brand Strategy (BrandCraft)
- Brand Identity (BrandCraft)
- Campaign Planning (FlightDeck)
- Team Collaboration (FlightDeck)
- Strategic Roadmap (Strategy Studio)
- Goal Tracking (Strategy Studio)

## Migration History

- `001_initial_schema`: Complete schema with 18 tables, views, triggers, and seed data

## Next Steps

1. Implement authentication middleware
2. Add GCP Storage integration for document uploads
3. Create API routes for each module
4. Set up Stripe webhook handlers
5. Implement rate limiting per subscription tier
6. Add email verification workflow
7. Create admin dashboard for user management

## Support

For issues or questions:
- Check database health: `npm run db:health`
- Run tests: `npm run db:test`
- Review logs in terminal output
- Check foreign key constraints
- Verify environment variables
