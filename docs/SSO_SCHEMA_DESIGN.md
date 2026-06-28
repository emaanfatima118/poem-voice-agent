# SSO Schema Design - Optimized Structure

## Overview

This document explains the optimized database schema design for SSO implementation in Stackwise, following best practices for separation of concerns and leveraging existing database structure.

## Design Principles

### 1. Separation of Concerns
- **Authentication data** → `users` table
- **Profile data** → `user_details` table

### 2. Minimize Redundancy
- Reuse existing `profile_picture_url` column instead of creating `avatar_url`
- Use existing `metadata` JSONB column for SSO-specific data

### 3. Backward Compatibility
- All changes are additive (no breaking changes)
- Existing email/password authentication continues to work
- Nullable password allows SSO-only accounts

## Schema Changes

### `users` Table (Authentication)

The `users` table stores **authentication-related data** - how users prove their identity.

#### New Columns:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `auth_provider` | VARCHAR(50) | 'email' | Authentication method: 'email', 'google', 'apple', 'microsoft' |
| `provider_user_id` | VARCHAR(255) | NULL | Unique ID from OAuth provider (the 'sub' claim) |

#### Modified Columns:

| Column | Change | Reason |
|--------|--------|--------|
| `password` | Made nullable | SSO users authenticate via provider, don't need password |

#### Indexes:

```sql
-- Ensure one provider account = one Stackwise account
CREATE UNIQUE INDEX idx_users_provider_userid 
ON users(auth_provider, provider_user_id) 
WHERE provider_user_id IS NOT NULL;

-- Fast lookups by authentication method
CREATE INDEX idx_users_auth_provider 
ON users(auth_provider);

-- Fast email lookups for account linking
CREATE INDEX idx_users_email_lower 
ON users(LOWER(email));
```

### `user_details` Table (Profile)

The `user_details` table stores **profile information** - user's personal and professional details.

#### Existing Columns Used:

| Column | Usage for SSO |
|--------|---------------|
| `profile_picture_url` | Stores avatar URL from Google/Microsoft/Apple |
| `metadata` | Stores SSO metadata: `{ sso_provider, sso_created_at, sso_avatar: true }` |
| `first_name` | Populated from OAuth profile |
| `last_name` | Populated from OAuth profile |

**No new columns needed!** The existing schema already supports everything we need.

## Data Flow

### SSO User Creation

```sql
-- 1. Create user with auth data
INSERT INTO users (
    username, 
    email, 
    password,              -- NULL for SSO
    auth_provider,         -- NEW: 'google', 'microsoft', or 'apple'
    provider_user_id,      -- NEW: OAuth 'sub' claim
    email_verified,
    last_login
) VALUES ($1, $2, NULL, $3, $4, $5, CURRENT_TIMESTAMP);

-- 2. Create profile with OAuth data
INSERT INTO user_details (
    userid,
    first_name,            -- From OAuth
    last_name,             -- From OAuth
    profile_picture_url,   -- EXISTING: Avatar from OAuth
    metadata               -- EXISTING: SSO metadata
) VALUES ($1, $2, $3, $4, $5);
```

### Account Linking

When an SSO user's email matches an existing email/password account:

```sql
-- 1. Update authentication method
UPDATE users 
SET auth_provider = 'google',
    provider_user_id = '12345',
    email_verified = true,
    last_login = CURRENT_TIMESTAMP
WHERE email = 'user@example.com';

-- 2. Update profile picture
UPDATE user_details 
SET profile_picture_url = 'https://google.com/avatar.jpg',
    metadata = metadata || '{"sso_avatar": true, "sso_provider": "google"}'::jsonb
WHERE userid = $1;
```

## Why This Design?

### ✅ Advantages

1. **Clean Separation**: Authentication vs Profile data clearly separated
2. **No Redundancy**: Uses existing columns (`profile_picture_url`, `metadata`)
3. **Extensible**: `metadata` JSONB can store provider-specific data
4. **Efficient**: Minimal schema changes, optimal indexing
5. **Backward Compatible**: Existing code continues to work
6. **Standard Practice**: Follows PostgreSQL and OAuth best practices

### ❌ Previous Design (Not Used)

The initial design had `avatar_url` in the `users` table:

**Problems:**
- Redundant with `profile_picture_url` in `user_details`
- Mixed profile data into authentication table
- Required changes to existing profile code
- Potential data inconsistency between two avatar columns

## SSO Connectors

Added to `connectors` table for integration tracking:

```sql
INSERT INTO connectors (connector_name, description, is_active) 
VALUES 
    ('Google OAuth', 'Google Single Sign-On for authentication', TRUE),
    ('Apple OAuth', 'Apple Single Sign-On for authentication', TRUE),
    ('Microsoft OAuth', 'Microsoft Single Sign-On for authentication', TRUE);
```

This allows tracking SSO usage in `user_connectors` table if needed.

## Example Queries

### Find SSO User by Provider

```sql
SELECT u.*, ud.first_name, ud.last_name, ud.profile_picture_url
FROM users u
LEFT JOIN user_details ud ON u.userid = ud.userid
WHERE u.auth_provider = 'google' 
  AND u.provider_user_id = '12345';
```

### List All SSO Users

```sql
SELECT 
    u.userid,
    u.email,
    u.auth_provider,
    u.email_verified,
    ud.first_name,
    ud.last_name,
    ud.profile_picture_url
FROM users u
JOIN user_details ud ON u.userid = ud.userid
WHERE u.auth_provider != 'email'
ORDER BY u.created_at DESC;
```

### Get User's SSO Metadata

```sql
SELECT 
    u.auth_provider,
    u.provider_user_id,
    u.email_verified,
    ud.metadata->>'sso_provider' as sso_provider,
    ud.metadata->>'sso_created_at' as sso_created_at
FROM users u
JOIN user_details ud ON u.userid = ud.userid
WHERE u.userid = $1;
```

## Migration Script

The optimized migration script:
- Adds only necessary columns to `users` table
- Makes password nullable
- Creates optimal indexes
- Includes validation checks
- Documents all changes

Location: `scripts/2025-12-05_add-sso-support.sql`

## Future Considerations

### Multi-Provider Support

Users can link multiple providers to one account:

```sql
-- Option 1: Store in metadata
UPDATE user_details 
SET metadata = metadata || '{
  "linked_providers": ["google", "microsoft"],
  "google_id": "12345",
  "microsoft_id": "67890"
}'::jsonb;

-- Option 2: Use separate table
CREATE TABLE user_linked_providers (
    id SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid),
    provider VARCHAR(50),
    provider_user_id VARCHAR(255),
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userid, provider)
);
```

### Provider-Specific Data

Store provider-specific tokens/data in `metadata`:

```json
{
  "sso_provider": "google",
  "sso_created_at": "2025-12-05T10:00:00Z",
  "sso_avatar": true,
  "google_refresh_token": "encrypted_token",
  "google_scopes": ["email", "profile"]
}
```

## Summary

The optimized schema:
- **2 new columns** in `users` (authentication)
- **0 new columns** in `user_details` (reuses existing)
- **3 new indexes** for performance
- **Backward compatible** with existing code
- **Follows best practices** for data modeling

This design provides a clean, efficient, and maintainable foundation for SSO authentication in Stackwise.
