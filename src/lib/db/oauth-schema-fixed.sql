-- Fixed OAuth Schema Migration
-- Uses existing connector_details table to store user tokens
-- Links: users.userid -> connector_details.userid -> connectors.connector_id

-- Step 1: Drop the incorrectly created user_connectors table
DROP TABLE IF EXISTS abm_activities CASCADE;
DROP TABLE IF EXISTS abm_accounts CASCADE;
DROP TABLE IF EXISTS abm_contacts CASCADE;
DROP TABLE IF EXISTS user_connectors CASCADE;

-- Step 2: Recreate connector_details with proper structure
DROP TABLE IF EXISTS connector_details CASCADE;

CREATE TABLE connector_details (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INTEGER NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    instance_url VARCHAR(500),
    account_id VARCHAR(255),
    account_name VARCHAR(255),
    account_email VARCHAR(255),
    token_type VARCHAR(50) DEFAULT 'Bearer',
    scope TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    sync_status VARCHAR(50) DEFAULT 'idle',
    error_message TEXT,
    metadata JSONB,
    expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    UNIQUE(userid, connector_id, account_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_details_user ON connector_details(userid);
CREATE INDEX IF NOT EXISTS idx_connector_details_connector ON connector_details(connector_id);
CREATE INDEX IF NOT EXISTS idx_connector_details_expiry ON connector_details(expiry);
CREATE INDEX IF NOT EXISTS idx_connector_details_active ON connector_details(is_active);

-- Step 3: Create abm_contacts table (references connector_details)
CREATE TABLE abm_contacts (
    id SERIAL PRIMARY KEY,
    connector_detail_id INTEGER NOT NULL REFERENCES connector_details(id) ON DELETE CASCADE,
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
    UNIQUE(connector_detail_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_abm_contacts_connector ON abm_contacts(connector_detail_id);
CREATE INDEX IF NOT EXISTS idx_abm_contacts_email ON abm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_abm_contacts_deleted ON abm_contacts(is_deleted);
CREATE INDEX IF NOT EXISTS idx_abm_contacts_external ON abm_contacts(external_id);

-- Step 4: Create abm_accounts table
CREATE TABLE abm_accounts (
    id SERIAL PRIMARY KEY,
    connector_detail_id INTEGER NOT NULL REFERENCES connector_details(id) ON DELETE CASCADE,
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
    UNIQUE(connector_detail_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_abm_accounts_connector ON abm_accounts(connector_detail_id);
CREATE INDEX IF NOT EXISTS idx_abm_accounts_deleted ON abm_accounts(is_deleted);
CREATE INDEX IF NOT EXISTS idx_abm_accounts_external ON abm_accounts(external_id);

-- Step 5: Create abm_activities table
CREATE TABLE abm_activities (
    id SERIAL PRIMARY KEY,
    connector_detail_id INTEGER NOT NULL REFERENCES connector_details(id) ON DELETE CASCADE,
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
    UNIQUE(connector_detail_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_abm_activities_connector ON abm_activities(connector_detail_id);
CREATE INDEX IF NOT EXISTS idx_abm_activities_contact ON abm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_abm_activities_account ON abm_activities(account_id);
CREATE INDEX IF NOT EXISTS idx_abm_activities_date ON abm_activities(activity_date);

-- Step 6: Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 7: Add triggers
DROP TRIGGER IF EXISTS update_connector_details_updated_at ON connector_details;
CREATE TRIGGER update_connector_details_updated_at
    BEFORE UPDATE ON connector_details
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

-- Verification
SELECT 'connector_details table created' as status
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'connector_details');

SELECT 'abm_contacts table created' as status
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'abm_contacts');

SELECT 'abm_accounts table created' as status
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'abm_accounts');

SELECT 'abm_activities table created' as status
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'abm_activities');
