-- =====================================================================
-- Stackwise Platform Database Schema
-- =====================================================================
-- Access-based architecture for multi-module platform:
-- - PulseHub: Performance audits, analytics, competitor analysis
-- - BrandCraft: Brand strategy and messaging
-- - FlightDeck: Operations and planning
-- - Strategy Studio: Strategic planning and roadmaps
--
-- Documents stored in GCP, URLs saved in database
-- Everything is access-controlled through user roles and subscriptions
-- =====================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- CONNECTORS (OAuth/Integration Systems)
-- =====================================================================

CREATE TABLE IF NOT EXISTS connectors (
    connector_id SERIAL PRIMARY KEY,
    connector_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_connectors (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INT NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    instance_url VARCHAR(500),
    account_id VARCHAR(255), -- External account/org ID
    account_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'pending', -- pending, syncing, completed, failed
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connector_id, account_id)
);

CREATE INDEX idx_user_connectors_user_id ON user_connectors(user_id);
CREATE INDEX idx_user_connectors_connector_id ON user_connectors(connector_id);
CREATE INDEX idx_user_connectors_expires_at ON user_connectors(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_user_connectors_active ON user_connectors(is_active) WHERE is_active = TRUE;

-- Legacy table for backward compatibility
CREATE TABLE IF NOT EXISTS connector_details (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INT NOT NULL REFERENCES connectors(connector_id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    instance_url VARCHAR(500),
    scope TEXT,
    account_id VARCHAR(255),
    account_name VARCHAR(255),
    account_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE (userid, connector_id, account_id)
);

CREATE INDEX idx_connector_details_userid ON connector_details(userid);
CREATE INDEX idx_connector_details_connector_id ON connector_details(connector_id);
CREATE INDEX idx_connector_details_expiry ON connector_details(expiry) WHERE expiry IS NOT NULL;
CREATE INDEX idx_connector_details_active ON connector_details(is_active) WHERE is_active = true;

-- =====================================================================
-- ABM COMMAND CENTER DATA SYNC
-- =====================================================================

-- ABM Command Center: CRM Contacts
CREATE TABLE IF NOT EXISTS crm_contacts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INT NOT NULL REFERENCES connectors(connector_id),
    external_id VARCHAR(255) NOT NULL, -- ID from source CRM
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255),
    company VARCHAR(255),
    job_title VARCHAR(100),
    phone VARCHAR(50),
    mobile_phone VARCHAR(50),
    department VARCHAR(100),
    lead_status VARCHAR(100),
    lifecycle_stage VARCHAR(100),
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    account_id VARCHAR(255), -- Link to CRM account
    is_deleted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE,
    modified_date TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connector_id, external_id)
);

CREATE INDEX idx_crm_contacts_user_id ON crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_connector_id ON crm_contacts(connector_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_active ON crm_contacts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_crm_contacts_deleted ON crm_contacts(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_crm_contacts_external_id ON crm_contacts(external_id);

-- ABM Command Center: CRM Accounts/Companies
CREATE TABLE IF NOT EXISTS crm_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INT NOT NULL REFERENCES connectors(connector_id),
    external_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    employee_count INT,
    annual_revenue DECIMAL(15, 2),
    account_type VARCHAR(100),
    account_status VARCHAR(100),
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_country VARCHAR(100),
    website VARCHAR(500),
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP WITH TIME ZONE,
    modified_date TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connector_id, external_id)
);

CREATE INDEX idx_crm_accounts_user_id ON crm_accounts(user_id);
CREATE INDEX idx_crm_accounts_connector_id ON crm_accounts(connector_id);
CREATE INDEX idx_crm_accounts_domain ON crm_accounts(domain);
CREATE INDEX idx_crm_accounts_active ON crm_accounts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_crm_accounts_deleted ON crm_accounts(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_crm_accounts_external_id ON crm_accounts(external_id);

-- ABM Command Center: Ad Campaigns
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INT NOT NULL REFERENCES connectors(connector_id),
    external_id VARCHAR(255) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(100),
    status VARCHAR(50),
    objective VARCHAR(100),
    budget DECIMAL(15, 2),
    spend DECIMAL(15, 2),
    impressions BIGINT,
    clicks BIGINT,
    conversions INT,
    ctr DECIMAL(5, 4),
    cpc DECIMAL(10, 2),
    cpm DECIMAL(10, 2),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connector_id, external_id)
);

CREATE INDEX idx_ad_campaigns_user_id ON ad_campaigns(user_id);
CREATE INDEX idx_ad_campaigns_connector_id ON ad_campaigns(connector_id);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_ad_campaigns_active ON ad_campaigns(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_ad_campaigns_deleted ON ad_campaigns(is_deleted) WHERE is_deleted = FALSE;

-- ABM Command Center: Opportunities
CREATE TABLE IF NOT EXISTS crm_opportunities (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    connector_id INT NOT NULL REFERENCES connectors(connector_id),
    external_id VARCHAR(255) NOT NULL,
    opportunity_name VARCHAR(255) NOT NULL,
    account_id VARCHAR(255),
    stage VARCHAR(100),
    amount DECIMAL(15, 2),
    probability DECIMAL(5, 2),
    close_date DATE,
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    opportunity_type VARCHAR(100),
    lead_source VARCHAR(100),
    is_closed BOOLEAN DEFAULT FALSE,
    is_won BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP WITH TIME ZONE,
    modified_date TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, connector_id, external_id)
);

CREATE INDEX idx_crm_opportunities_user_id ON crm_opportunities(user_id);
CREATE INDEX idx_crm_opportunities_connector_id ON crm_opportunities(connector_id);
CREATE INDEX idx_crm_opportunities_stage ON crm_opportunities(stage);
CREATE INDEX idx_crm_opportunities_active ON crm_opportunities(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_crm_opportunities_deleted ON crm_opportunities(is_deleted) WHERE is_deleted = FALSE;

-- =====================================================================
-- USERS & AUTHENTICATION
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store bcrypt/argon2 hash
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    user_type VARCHAR(50) DEFAULT 'standard', -- standard, admin, enterprise
    connector_id INT REFERENCES connectors(connector_id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_details (
    detail_id SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    ssn VARCHAR(20), -- Encrypted in application layer before storing
    phone VARCHAR(20),
    address TEXT,
    company_name VARCHAR(255),
    job_title VARCHAR(100),
    profile_picture_url VARCHAR(500), -- GCP storage URL
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX idx_user_details_userid ON user_details(userid);
CREATE INDEX idx_user_details_name ON user_details(first_name, last_name);

-- =====================================================================
-- ROLES & ACCESS CONTROL
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_roles (
    role_id SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL, -- admin, viewer, editor, contributor
    description TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT REFERENCES users(userid) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_user_roles_userid ON user_roles(userid);
CREATE INDEX idx_user_roles_role_name ON user_roles(role_name);
CREATE INDEX idx_user_roles_active ON user_roles(is_active) WHERE is_active = TRUE;

-- =====================================================================
-- SUBSCRIPTION & PAYMENT
-- =====================================================================

CREATE TABLE IF NOT EXISTS card_details (
    card_id SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    card_number_last4 VARCHAR(4), -- Only store last 4 digits
    card_brand VARCHAR(20), -- visa, mastercard, amex, etc.
    expiry DATE,
    cardholder_name VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    stripe_payment_method_id VARCHAR(255), -- Stripe payment method ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_card_details_userid ON card_details(userid);

CREATE TABLE IF NOT EXISTS user_subscription (
    payment_id SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    subscription_type VARCHAR(50) NOT NULL, -- free, starter, professional, enterprise
    subscription_key VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, cancelled, past_due, trialing
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscription_userid ON user_subscription(userid);
CREATE INDEX idx_user_subscription_status ON user_subscription(status);
CREATE INDEX idx_user_subscription_stripe ON user_subscription(stripe_subscription_id);

-- =====================================================================
-- FEATURES & MODULES
-- =====================================================================

CREATE TABLE IF NOT EXISTS key_features (
    feature_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Main app name: Pulse Hub, Brand Craft, Flight Deck, Strategy Studio
    pricing DECIMAL(10,2), -- Price for this feature/app
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_key_features_name ON key_features(name);
CREATE INDEX idx_key_features_active ON key_features(is_active) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS sub_features (
    sub_id SERIAL PRIMARY KEY,
    feature_id INT NOT NULL REFERENCES key_features(feature_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    required_role VARCHAR(50), -- Minimum role required
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sub_features_feature_id ON sub_features(feature_id);
CREATE INDEX idx_sub_features_active ON sub_features(is_active) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS sub_feature_attributes (
    id SERIAL PRIMARY KEY,
    sub_id INT NOT NULL REFERENCES sub_features(sub_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    value TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0
);

CREATE INDEX idx_sub_feature_attributes_sub_id ON sub_feature_attributes(sub_id);

-- =====================================================================
-- USER DOCUMENTS (GCP Storage)
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_documents (
    doc_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    feature_id INT REFERENCES key_features(feature_id) ON DELETE SET NULL,
    sub_id INT REFERENCES sub_features(sub_id) ON DELETE SET NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50), -- pdf, docx, image, video, etc.
    url VARCHAR(1000) NOT NULL, -- GCP Storage URL
    gcs_bucket VARCHAR(255), -- GCP bucket name
    gcs_path VARCHAR(500), -- Path within bucket
    file_size BIGINT, -- Size in bytes
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT REFERENCES users(userid) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT FALSE,
    access_roles TEXT[], -- Array of roles that can access this document
    metadata JSONB DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

CREATE INDEX idx_user_documents_user_id ON user_documents(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_documents_feature ON user_documents(feature_id, sub_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_documents_uploaded_at ON user_documents(uploaded_at DESC);
CREATE INDEX idx_user_documents_type ON user_documents(document_type);

-- =====================================================================
-- AUDIT LOGS (Complete Activity Tracking)
-- =====================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(userid) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- login, logout, create_audit, upload_document, etc.
    module VARCHAR(50), -- pulsehub, brandcraft, flightdeck, strategystudio
    resource_type VARCHAR(50), -- document, audit, strategy, etc.
    resource_id INT,
    audit_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Full context of the action
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255)
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_module ON audit_logs(module);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_session ON audit_logs(session_id);

-- =====================================================================
-- MODULE-SPECIFIC TABLES
-- =====================================================================

-- PulseHub: Performance Audits
CREATE TABLE IF NOT EXISTS pulse_hub_audits (
    audit_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    audit_name VARCHAR(255) NOT NULL,
    website_url VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    audit_data JSONB DEFAULT '{}'::jsonb, -- Complete audit results
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    result_document_id INT REFERENCES user_documents(doc_id) ON DELETE SET NULL
);

CREATE INDEX idx_pulse_hub_audits_user_id ON pulse_hub_audits(user_id);
CREATE INDEX idx_pulse_hub_audits_status ON pulse_hub_audits(status);
CREATE INDEX idx_pulse_hub_audits_created_at ON pulse_hub_audits(created_at DESC);
CREATE INDEX idx_pulse_hub_audits_website ON pulse_hub_audits(website_url);

-- Performance Audit Log: One JSON per user storing audit history (replaces audit_log.json)
-- Structure: { "url1": [audit1, audit2, ...], "url2": [...] } with max 5 audits per URL
CREATE TABLE IF NOT EXISTS performance_audit_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(userid) ON DELETE CASCADE,
    audit_history JSONB NOT NULL DEFAULT '{}'::jsonb, -- Full audit history for all URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performance_audit_log_user_id ON performance_audit_log(user_id);

-- PulseHub: GTM Models
CREATE TABLE IF NOT EXISTS pulse_hub_gtm_model (
    model_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb, -- All model data: config, kpis, metrics, analysis, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_model_name UNIQUE (user_id, model_name)
);

CREATE INDEX idx_pulse_hub_gtm_model_user_id ON pulse_hub_gtm_model(user_id);
CREATE INDEX idx_pulse_hub_gtm_model_created_at ON pulse_hub_gtm_model(created_at DESC);
CREATE INDEX idx_pulse_hub_gtm_model_name ON pulse_hub_gtm_model(model_name);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pulse_hub_gtm_model_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pulse_hub_gtm_model_updated_at
    BEFORE UPDATE ON pulse_hub_gtm_model
    FOR EACH ROW
    EXECUTE FUNCTION update_pulse_hub_gtm_model_updated_at();

-- BrandCraft: Brand Strategy
CREATE TABLE IF NOT EXISTS brand_craft_projects (
    project_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, in_progress, completed
    project_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brand_craft_projects_user_id ON brand_craft_projects(user_id);
CREATE INDEX idx_brand_craft_projects_status ON brand_craft_projects(status);

-- FlightDeck: Operations
CREATE TABLE IF NOT EXISTS flight_deck_operations (
    operation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    operation_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    operation_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flight_deck_operations_user_id ON flight_deck_operations(user_id);
CREATE INDEX idx_flight_deck_operations_status ON flight_deck_operations(status);

-- Strategy Studio: Strategic Planning
CREATE TABLE IF NOT EXISTS strategy_studio_plans (
    plan_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    plan_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    plan_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    target_date DATE
);

CREATE INDEX idx_strategy_studio_plans_user_id ON strategy_studio_plans(user_id);
CREATE INDEX idx_strategy_studio_plans_status ON strategy_studio_plans(status);

-- =====================================================================
-- ACCESS CONTROL TABLE (Who can access what)
-- =====================================================================

CREATE TABLE IF NOT EXISTS resource_permissions (
    permission_id SERIAL PRIMARY KEY,
    resource_type VARCHAR(50) NOT NULL, -- document, audit, project, etc.
    resource_id INT NOT NULL,
    user_id INT REFERENCES users(userid) ON DELETE CASCADE,
    role_id INT REFERENCES user_roles(role_id) ON DELETE CASCADE,
    permission_level VARCHAR(20) DEFAULT 'read', -- read, write, admin
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by INT REFERENCES users(userid) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_resource_permissions_resource ON resource_permissions(resource_type, resource_id);
CREATE INDEX idx_resource_permissions_user ON resource_permissions(user_id);
CREATE INDEX idx_resource_permissions_role ON resource_permissions(role_id);

-- =====================================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_details_updated_at BEFORE UPDATE ON connector_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_card_details_updated_at BEFORE UPDATE ON card_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscription_updated_at BEFORE UPDATE ON user_subscription FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_craft_projects_updated_at BEFORE UPDATE ON brand_craft_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flight_deck_operations_updated_at BEFORE UPDATE ON flight_deck_operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategy_studio_plans_updated_at BEFORE UPDATE ON strategy_studio_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================================

-- User with subscription and role information
CREATE OR REPLACE VIEW user_access_view AS
SELECT 
    u.userid,
    u.username,
    u.email,
    u.user_type,
    u.is_active,
    ud.first_name,
    ud.last_name,
    ud.company_name,
    us.subscription_type,
    us.status as subscription_status,
    json_agg(DISTINCT jsonb_build_object('role', ur.role_name, 'expires_at', ur.expires_at)) as roles
FROM users u
LEFT JOIN user_details ud ON u.userid = ud.userid
LEFT JOIN user_subscription us ON u.userid = us.userid
LEFT JOIN user_roles ur ON u.userid = ur.userid AND ur.is_active = TRUE
GROUP BY u.userid, ud.first_name, ud.last_name, ud.company_name, us.subscription_type, us.status;

-- User documents with feature information
CREATE OR REPLACE VIEW user_documents_view AS
SELECT 
    doc_id,
    user_id,
    document_name,
    document_type,
    url,
    file_size,
    uploaded_at,
    kf.feature_name,
    sf.name as sub_feature_name,
    CASE 
        WHEN kf.pulse_hub THEN 'PulseHub'
        WHEN kf.brand_craft THEN 'BrandCraft'
        WHEN kf.flight_deck THEN 'FlightDeck'
        WHEN kf.strategy_studio THEN 'Strategy Studio'
    END as module
FROM user_documents ud
LEFT JOIN key_features kf ON ud.feature_id = kf.feature_id
LEFT JOIN sub_features sf ON ud.sub_id = sf.sub_id
WHERE ud.deleted_at IS NULL;

-- =====================================================================
-- SEED DATA (Default connectors and features)
-- =====================================================================

-- Insert default connectors
INSERT INTO connectors (connector_name, description) VALUES
('Google', 'Google OAuth 2.0'),
('Salesforce', 'Salesforce OAuth'),
('HubSpot', 'HubSpot OAuth'),
('Microsoft', 'Microsoft Azure AD')
ON CONFLICT (connector_name) DO NOTHING;

-- Clear existing data and insert main features (apps)
TRUNCATE TABLE key_features CASCADE;

INSERT INTO key_features (feature_id, name, pricing, display_order) VALUES
(1, 'Pulse Hub', NULL, 1),
(2, 'Brand Craft', NULL, 2),
(3, 'Flight Deck', NULL, 3),
(4, 'Strategy Studio', NULL, 4);

-- Reset sequence to continue from 5
SELECT setval('key_features_feature_id_seq', 4, true);

-- Insert Pulse Hub sub-features
INSERT INTO sub_features (feature_id, name, display_order, is_active) VALUES
(1, 'Audit Performance', 1, TRUE),
(1, 'Analytics & Intelligence', 2, TRUE),
(1, 'Roadmaps & Connections', 3, TRUE),
(1, 'ABM Command Center', 4, TRUE),
(1, 'Competitor Analysis & Benchmarking', 5, TRUE),
(1, 'Leadership & Sales Reports', 6, TRUE),
(1, 'GTM Test Pit', 7, TRUE)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- COMMENTS
-- =====================================================================

COMMENT ON TABLE users IS 'User accounts with authentication and subscription info';
COMMENT ON TABLE user_details IS 'Extended user profile information';
COMMENT ON TABLE user_roles IS 'Role-based access control for users';
COMMENT ON TABLE connectors IS 'OAuth and integration connectors';
COMMENT ON TABLE connector_details IS 'OAuth tokens and connection details';
COMMENT ON TABLE user_subscription IS 'User subscription and payment status';
COMMENT ON TABLE card_details IS 'Encrypted payment card information';
COMMENT ON TABLE key_features IS 'Main features available across modules';
COMMENT ON TABLE sub_features IS 'Sub-features within main features';
COMMENT ON TABLE sub_feature_attributes IS 'Configurable attributes for sub-features';
COMMENT ON TABLE user_documents IS 'User documents stored in GCP with URLs';
COMMENT ON TABLE audit_logs IS 'Complete audit trail of all user actions';
COMMENT ON TABLE pulse_hub_audits IS 'PulseHub performance audit records';
COMMENT ON TABLE pulse_hub_gtm_model IS 'PulseHub GTM (Go-To-Market) models - all data stored in details JSONB column';
COMMENT ON TABLE brand_craft_projects IS 'BrandCraft brand strategy projects';
COMMENT ON TABLE flight_deck_operations IS 'FlightDeck operations and campaigns';
COMMENT ON TABLE strategy_studio_plans IS 'Strategy Studio strategic plans';
COMMENT ON TABLE resource_permissions IS 'Granular access control for resources';
