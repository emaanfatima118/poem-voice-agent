-- OAuth Migration Script
-- Adds new columns and tables for OAuth integration
-- Compatible with existing connectors and connector_details tables

-- Step 1: Add missing columns to connectors table
ALTER TABLE connectors 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update display_name for existing records
UPDATE connectors SET display_name = connector_name WHERE display_name IS NULL;

-- Step 2: Clear and restructure connector_details table
-- This table has wrong structure - it should store OAuth config, not user tokens
DROP TABLE IF EXISTS connector_details CASCADE;

CREATE TABLE connector_details (
    id SERIAL PRIMARY KEY,
    connector_id INTEGER NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    auth_url TEXT NOT NULL,
    token_url TEXT NOT NULL,
    scopes TEXT[] NOT NULL,
    required_fields TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Update connectors data for OAuth platforms
TRUNCATE connectors CASCADE;

INSERT INTO connectors (connector_name, display_name, description, is_active) VALUES
('hubspot', 'HubSpot', 'CRM and marketing automation platform', true),
('salesforce', 'Salesforce', 'Customer relationship management system', true),
('google_ads', 'Google Ads', 'Online advertising platform', true),
('linkedin', 'LinkedIn Ads', 'Professional social media advertising', true),
('meta', 'Meta (Facebook) Ads', 'Facebook and Instagram advertising', true),
('tiktok', 'TikTok Ads', 'Short-form video advertising', true);

-- Insert connector OAuth details
INSERT INTO connector_details (connector_id, auth_url, token_url, scopes) VALUES
(
    (SELECT connector_id FROM connectors WHERE connector_name = 'hubspot'),
    'https://app.hubspot.com/oauth/authorize',
    'https://api.hubapi.com/oauth/v1/token',
    ARRAY['crm.objects.contacts.read', 'crm.objects.companies.read', 'crm.objects.deals.read', 'crm.lists.read', 'oauth']
),
(
    (SELECT connector_id FROM connectors WHERE connector_name = 'salesforce'),
    'https://login.salesforce.com/services/oauth2/authorize',
    'https://login.salesforce.com/services/oauth2/token',
    ARRAY['api', 'refresh_token', 'full']
),
(
    (SELECT connector_id FROM connectors WHERE connector_name = 'google_ads'),
    'https://accounts.google.com/o/oauth2/v2/auth',
    'https://oauth2.googleapis.com/token',
    ARRAY['https://www.googleapis.com/auth/adwords']
),
(
    (SELECT connector_id FROM connectors WHERE connector_name = 'linkedin'),
    'https://www.linkedin.com/oauth/v2/authorization',
    'https://www.linkedin.com/oauth/v2/accessToken',
    ARRAY['r_ads', 'r_organization_social', 'r_ads_reporting', 'rw_ads']
),
(
    (SELECT connector_id FROM connectors WHERE connector_name = 'meta'),
    'https://www.facebook.com/v18.0/dialog/oauth',
    'https://graph.facebook.com/v18.0/oauth/access_token',
    ARRAY['ads_read', 'ads_management', 'business_management', 'pages_read_engagement']
),
(
    (SELECT connector_id FROM connectors WHERE connector_name = 'tiktok'),
    'https://business-api.tiktok.com/portal/auth',
    'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
    ARRAY['ad_account.read', 'campaign.read', 'ad_group.read', 'creative.read']
);

-- Step 4: Create user_connectors table (stores user OAuth connections)
CREATE TABLE IF NOT EXISTS user_connectors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INTEGER NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP,
    scope TEXT,
    instance_url VARCHAR(500),
    account_id VARCHAR(255),
    account_name VARCHAR(255),
    account_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    sync_status VARCHAR(50) DEFAULT 'idle',
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connector_id, account_id)
);

CREATE INDEX IF NOT EXISTS idx_user_connectors_user ON user_connectors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connectors_expires ON user_connectors(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_connectors_sync ON user_connectors(sync_status);

-- Step 5: Create abm_contacts table
CREATE TABLE IF NOT EXISTS abm_contacts (
    id SERIAL PRIMARY KEY,
    user_connector_id INTEGER NOT NULL REFERENCES user_connectors(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255),
    company VARCHAR(255),
    job_title VARCHAR(255),
    phone VARCHAR(50),
    mobile_phone VARCHAR(50),
    department VARCHAR(100),
    lead_status VARCHAR(100),
    lifecycle_stage VARCHAR(100),
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    account_id VARCHAR(255),
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    last_activity_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_connector_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_abm_contacts_connector ON abm_contacts(user_connector_id);
CREATE INDEX IF NOT EXISTS idx_abm_contacts_email ON abm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_abm_contacts_deleted ON abm_contacts(is_deleted);
CREATE INDEX IF NOT EXISTS idx_abm_contacts_external ON abm_contacts(external_id);

-- Step 6: Create abm_accounts table
CREATE TABLE IF NOT EXISTS abm_accounts (
    id SERIAL PRIMARY KEY,
    user_connector_id INTEGER NOT NULL REFERENCES user_connectors(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    employee_count INTEGER,
    annual_revenue NUMERIC(15, 2),
    account_owner VARCHAR(255),
    account_status VARCHAR(100),
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_connector_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_abm_accounts_connector ON abm_accounts(user_connector_id);
CREATE INDEX IF NOT EXISTS idx_abm_accounts_deleted ON abm_accounts(is_deleted);
CREATE INDEX IF NOT EXISTS idx_abm_accounts_external ON abm_accounts(external_id);

-- Step 7: Create abm_activities table
CREATE TABLE IF NOT EXISTS abm_activities (
    id SERIAL PRIMARY KEY,
    user_connector_id INTEGER NOT NULL REFERENCES user_connectors(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES abm_contacts(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES abm_accounts(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    subject VARCHAR(500),
    description TEXT,
    activity_date TIMESTAMP,
    owner_name VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_connector_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_abm_activities_connector ON abm_activities(user_connector_id);
CREATE INDEX IF NOT EXISTS idx_abm_activities_contact ON abm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_abm_activities_account ON abm_activities(account_id);
CREATE INDEX IF NOT EXISTS idx_abm_activities_date ON abm_activities(activity_date);

-- Step 8: Create or replace update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 9: Add update triggers
DROP TRIGGER IF EXISTS update_connectors_updated_at ON connectors;
CREATE TRIGGER update_connectors_updated_at
    BEFORE UPDATE ON connectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connector_details_updated_at ON connector_details;
CREATE TRIGGER update_connector_details_updated_at
    BEFORE UPDATE ON connector_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_connectors_updated_at ON user_connectors;
CREATE TRIGGER update_user_connectors_updated_at
    BEFORE UPDATE ON user_connectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_abm_contacts_updated_at ON abm_contacts;
CREATE TRIGGER update_abm_contacts_updated_at
    BEFORE UPDATE ON abm_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_abm_accounts_updated_at ON abm_accounts;
CREATE TRIGGER update_abm_accounts_updated_at
    BEFORE UPDATE ON abm_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables created
SELECT 
    'Connectors count: ' || COUNT(*) as result
FROM connectors;

SELECT 
    'User connectors table exists' as result
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_connectors');

SELECT 
    'ABM contacts table exists' as result
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'abm_contacts');

-- Done!
