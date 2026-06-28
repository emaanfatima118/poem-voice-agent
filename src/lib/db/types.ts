/**
 * TypeScript type definitions for Stackwise database schema
 * Generated from schema.sql
 * 
 * These types provide compile-time safety when working with database records
 */

// =====================================================================
// BASE TYPES
// =====================================================================

export type Timestamp = Date | string;

// =====================================================================
// CONNECTORS (OAuth/Integration Systems)
// =====================================================================

export interface Connector {
  connector_id: number;
  connector_name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Timestamp;
}

export interface ConnectorDetail {
  id: number;
  connector_id: number;
  access_token?: string | null;
  refresh_token?: string | null;
  instance_url?: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  expiry?: Timestamp | null;
  created_by?: string | null;
  metadata: Record<string, any>;
}

export interface CreateConnectorInput {
  connector_name: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateConnectorDetailInput {
  connector_id: number;
  access_token?: string;
  refresh_token?: string;
  instance_url?: string;
  expiry?: Timestamp;
  created_by?: string;
  metadata?: Record<string, any>;
}

// =====================================================================
// USERS & AUTHENTICATION
// =====================================================================

export type UserType = 'standard' | 'admin' | 'enterprise';

export interface User {
  userid: number;
  username: string;
  email: string;
  password: string; // bcrypt/argon2 hash
  last_login?: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  updated_by?: string | null;
  user_type: UserType;
  connector_id?: number | null;
  is_active: boolean;
  email_verified: boolean;
}

export interface UserDetail {
  detail_id: number;
  userid: number;
  first_name?: string | null;
  last_name?: string | null;
  ssn?: string | null; // Encrypted in application layer
  phone?: string | null;
  address?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_picture_url?: string | null; // GCP storage URL
  metadata: Record<string, any>;
}

export interface CreateUserInput {
  username?: string;
  email: string;
  password?: string; // Should be hashed before storing
  password_hash?: string; // For pre-hashed passwords
  user_type?: UserType;
  connector_id?: number;
  email_verified?: boolean;
}

export interface CreateUserDetailInput {
  userid: number;
  first_name?: string;
  last_name?: string;
  ssn?: string; // Should be encrypted before storing
  phone?: string;
  address?: string;
  company_name?: string;
  job_title?: string;
  profile_picture_url?: string;
  metadata?: Record<string, any>;
}

// =====================================================================
// ROLES & ACCESS CONTROL
// =====================================================================

export type RoleName = 'admin' | 'viewer' | 'editor' | 'contributor';

export interface UserRole {
  role_id: number;
  userid: number;
  role_name: RoleName;
  description?: string | null;
  assigned_at: Timestamp;
  assigned_by?: number | null;
  expires_at?: Timestamp | null;
  is_active: boolean;
}

export interface CreateUserRoleInput {
  userid: number;
  role_name: RoleName;
  description?: string;
  assigned_by?: number;
  expires_at?: Timestamp;
}

// =====================================================================
// SUBSCRIPTION & PAYMENT
// =====================================================================

export type SubscriptionType = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

export interface CardDetail {
  card_id: number;
  userid: number;
  card_number_last4?: string | null; // Only last 4 digits
  card_brand?: CardBrand | null;
  expiry?: Date | null;
  cardholder_name?: string | null;
  is_default: boolean;
  stripe_payment_method_id?: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserSubscription {
  payment_id: number;
  userid: number;
  subscription_type: SubscriptionType;
  subscription_key?: string | null;
  stripe_subscription_id?: string | null;
  stripe_customer_id?: string | null;
  status: SubscriptionStatus;
  current_period_start?: Timestamp | null;
  current_period_end?: Timestamp | null;
  cancel_at_period_end: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateCardDetailInput {
  userid: number;
  card_number_last4?: string;
  card_brand?: CardBrand;
  expiry?: Date;
  cardholder_name?: string;
  is_default?: boolean;
  stripe_payment_method_id?: string;
}

export interface CreateUserSubscriptionInput {
  userid: number;
  subscription_type: SubscriptionType;
  subscription_key?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status?: SubscriptionStatus;
  current_period_start?: Timestamp;
  current_period_end?: Timestamp;
}

// =====================================================================
// FEATURES & MODULES
// =====================================================================

export interface KeyFeature {
  feature_id: number;
  feature_name: string;
  pulse_hub: boolean; // Available in PulseHub
  brand_craft: boolean; // Available in BrandCraft
  flight_deck: boolean; // Available in FlightDeck
  strategy_studio: boolean; // Available in Strategy Studio
  pricing?: number | null;
  features?: string | null; // Description
  display_order: number;
  is_active: boolean;
  created_at: Timestamp;
}

export interface SubFeature {
  sub_id: number;
  feature_id: number;
  name: string;
  description?: string | null;
  icon_url?: string | null;
  display_order: number;
  is_active: boolean;
  required_role?: string | null;
  created_at: Timestamp;
}

export interface SubFeatureAttribute {
  id: number;
  sub_id: number;
  name: string;
  value?: string | null;
  data_type: 'string' | 'number' | 'boolean' | 'json';
  is_required: boolean;
  display_order: number;
}

export interface CreateKeyFeatureInput {
  feature_name: string;
  pulse_hub?: boolean;
  brand_craft?: boolean;
  flight_deck?: boolean;
  strategy_studio?: boolean;
  pricing?: number;
  features?: string;
  display_order?: number;
}

export interface CreateSubFeatureInput {
  feature_id: number;
  name: string;
  description?: string;
  icon_url?: string;
  display_order?: number;
  required_role?: string;
}

export interface CreateSubFeatureAttributeInput {
  sub_id: number;
  name: string;
  value?: string;
  data_type?: 'string' | 'number' | 'boolean' | 'json';
  is_required?: boolean;
  display_order?: number;
}

// =====================================================================
// USER DOCUMENTS (GCP Storage)
// =====================================================================

export interface UserDocument {
  doc_id: number;
  user_id: number;
  feature_id?: number | null;
  sub_id?: number | null;
  document_name: string;
  document_type?: string | null; // pdf, docx, image, video, etc.
  url: string; // GCP Storage URL
  gcs_bucket?: string | null;
  gcs_path?: string | null;
  file_size?: number | null; // bytes
  mime_type?: string | null;
  uploaded_at: Timestamp;
  uploaded_by?: number | null;
  is_public: boolean;
  access_roles?: string[] | null; // Array of roles
  metadata: Record<string, any>;
  deleted_at?: Timestamp | null; // Soft delete
}

export interface CreateUserDocumentInput {
  user_id: number;
  feature_id?: number;
  sub_id?: number;
  document_name: string;
  document_type?: string;
  url: string;
  gcs_bucket?: string;
  gcs_path?: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: number;
  is_public?: boolean;
  access_roles?: string[];
  metadata?: Record<string, any>;
}

// =====================================================================
// AUDIT LOGS (Complete Activity Tracking)
// =====================================================================

export type AuditAction = 'login' | 'logout' | 'create_audit' | 'upload_document' | 'create_project' | 'update_subscription' | string;
export type Module = 'pulsehub' | 'brandcraft' | 'flightdeck' | 'strategystudio';

export interface AuditLog {
  audit_id: number;
  user_id?: number | null;
  action: AuditAction;
  module?: Module | null;
  resource_type?: string | null; // document, audit, strategy, etc.
  resource_id?: number | null;
  audit_data: Record<string, any>; // Full context
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Timestamp;
  session_id?: string | null;
}

export interface CreateAuditLogInput {
  user_id?: number;
  action: AuditAction;
  module?: Module;
  resource_type?: string;
  resource_id?: number;
  audit_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
}

// =====================================================================
// MODULE-SPECIFIC TABLES
// =====================================================================

// PulseHub: Performance Audits
export type AuditStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PulseHubAudit {
  audit_id: number;
  user_id: number;
  audit_name: string;
  website_url: string;
  overall_score?: number | null;
  performance_level?: string | null;
  grade?: string | null;
  audit_data: Record<string, any>; // Complete audit results
  topics_audited: string[];
  status: AuditStatus;
  created_at: Timestamp;
  completed_at?: Timestamp | null;
  result_document_id?: number | null;
}

export interface CreatePulseHubAuditInput {
  user_id: number;
  audit_name: string;
  website_url: string;
  overall_score?: number | null;
  performance_level?: string | null;
  grade?: string | null;
  audit_data?: Record<string, any>;
  topics_audited?: string[];
  status?: AuditStatus;
  result_document_id?: number | null;
}

// BrandCraft: Brand Strategy
export type ProjectStatus = 'draft' | 'in_progress' | 'completed';

export interface BrandCraftProject {
  project_id: number;
  user_id: number;
  project_name: string;
  status: ProjectStatus;
  project_data: Record<string, any>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateBrandCraftProjectInput {
  user_id: number;
  project_name: string;
  status?: ProjectStatus;
  project_data?: Record<string, any>;
}

// FlightDeck: Operations
export type OperationStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export interface FlightDeckOperation {
  operation_id: number;
  user_id: number;
  operation_name: string;
  status: OperationStatus;
  operation_data: Record<string, any>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateFlightDeckOperationInput {
  user_id: number;
  operation_name: string;
  status?: OperationStatus;
  operation_data?: Record<string, any>;
}

// Strategy Studio: Strategic Planning
export type PlanStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface StrategyStudioPlan {
  plan_id: number;
  user_id: number;
  plan_name: string;
  status: PlanStatus;
  plan_data: Record<string, any>;
  created_at: Timestamp;
  updated_at: Timestamp;
  target_date?: Date | null;
}

export interface CreateStrategyStudioPlanInput {
  user_id: number;
  plan_name: string;
  status?: PlanStatus;
  plan_data?: Record<string, any>;
  target_date?: Date;
}

// GTM Models: Go-To-Market Strategy Models (PulseHub)
export interface GTMModel {
  model_id: number;
  user_id: number;
  model_name: string;
  details: Record<string, any>; // All model data stored as JSONB
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateGTMModelInput {
  user_id: number;
  model_name: string;
  details: Record<string, any>; // All model data: config, kpis, metrics, analysis, etc.
}

export interface UpdateGTMModelInput {
  model_name?: string;
  details?: Record<string, any>; // Partial update of details
}

// =====================================================================
// ACCESS CONTROL
// =====================================================================

export type PermissionLevel = 'read' | 'write' | 'admin';

export interface ResourcePermission {
  permission_id: number;
  resource_type: string; // document, audit, project, etc.
  resource_id: number;
  user_id?: number | null;
  role_id?: number | null;
  permission_level: PermissionLevel;
  granted_at: Timestamp;
  granted_by?: number | null;
  expires_at?: Timestamp | null;
}

export interface CreateResourcePermissionInput {
  resource_type: string;
  resource_id: number;
  user_id?: number;
  role_id?: number;
  permission_level?: PermissionLevel;
  granted_by?: number;
  expires_at?: Timestamp;
}

// =====================================================================
// VIEW TYPES
// =====================================================================

export interface UserAccessView {
  userid: number;
  username: string;
  email: string;
  user_type: UserType;
  is_active: boolean;
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  subscription_type?: SubscriptionType | null;
  subscription_status?: SubscriptionStatus | null;
  roles: Array<{ role: RoleName; expires_at?: Timestamp | null }>;
}

export interface UserDocumentsView {
  doc_id: number;
  user_id: number;
  document_name: string;
  document_type?: string | null;
  url: string;
  file_size?: number | null;
  uploaded_at: Timestamp;
  feature_name?: string | null;
  sub_feature_name?: string | null;
  module?: 'PulseHub' | 'BrandCraft' | 'FlightDeck' | 'Strategy Studio' | null;
}

// =====================================================================
// DEPRECATED TYPES (from old schema - remove after migration)
// =====================================================================

export interface PerformanceMetric {
  id: number;
  user_id?: number | null;
  audit_id?: number | null;
  metric_name: string;
  metric_category?: string | null;
  metric_value?: number | null;
  metric_unit?: string | null;
  website_url?: string | null;
  page_path?: string | null;
  measured_at: Timestamp;
  metadata: Record<string, any>;
}

export interface CreateMetricInput {
  user_id?: number;
  audit_id?: number;
  metric_name: string;
  metric_category?: string;
  metric_value?: number;
  metric_unit?: string;
  website_url?: string;
  page_path?: string;
  metadata?: Record<string, any>;
}

// =====================================================================
// COMPETITOR ANALYSIS (DEPRECATED - kept for backward compatibility)
// =====================================================================

export type CompetitorAnalysisStatus = 'draft' | 'analyzing' | 'completed';

export interface CompetitorAnalysis {
  id: number;
  user_id?: number | null;
  
  // Client information
  client_name: string;
  client_website?: string | null;
  client_social_profiles: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  
  // Status
  status: CompetitorAnalysisStatus;
  
  // Competitors
  competitors: CompetitorData[];
  
  // Analysis results
  benchmarks: Record<string, any>;
  swot_analysis: {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };
  insights: CompetitorInsight[];
  strategies: CompetitorStrategy[];
  
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CompetitorData {
  id?: number;
  name: string;
  website: string;
  social_profiles?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  metrics?: Record<string, any>;
}

export interface CompetitorInsight {
  type: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface CompetitorStrategy {
  id?: string;
  title: string;
  description: string;
  tactics: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Competitor {
  id: number;
  analysis_id: number;
  name: string;
  website?: string | null;
  social_profiles: Record<string, string>;
  metrics: Record<string, any>;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  created_at: Timestamp;
}

// =====================================================================
// MODULE SESSIONS & WORKFLOWS
// =====================================================================

export interface ModuleSession {
  id: number;
  user_id?: number | null;
  module_name: 'pulsehub' | 'brandcraft' | 'flightdeck' | 'strategystudio';
  session_type?: string | null;
  session_data: Record<string, any>;
  is_active: boolean;
  completed: boolean;
  started_at: Timestamp;
  last_activity_at: Timestamp;
  completed_at?: Timestamp | null;
}

export interface CreateSessionInput {
  user_id?: number;
  module_name: 'pulsehub' | 'brandcraft' | 'flightdeck' | 'strategystudio';
  session_type?: string;
  session_data?: Record<string, any>;
}

// =====================================================================
// AI INSIGHTS & RECOMMENDATIONS
// =====================================================================

export interface AIInsight {
  id: number;
  user_id?: number | null;
  source_module: string;
  source_id?: number | null;
  insight_type?: string | null;
  title?: string | null;
  description?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'critical' | null;
  action_items: Array<{
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
  }>;
  context_data: Record<string, any>;
  is_read: boolean;
  is_archived: boolean;
  created_at: Timestamp;
  expires_at?: Timestamp | null;
}

export interface CreateInsightInput {
  user_id?: number;
  source_module: string;
  source_id?: number;
  insight_type?: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  action_items?: Array<Record<string, any>>;
  context_data?: Record<string, any>;
  expires_at?: Timestamp;
}

// =====================================================================
// STRATEGIES & ROADMAPS
// =====================================================================

export type StrategyStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface Strategy {
  id: number;
  user_id?: number | null;
  title: string;
  description?: string | null;
  module?: string | null;
  goals: StrategyGoal[];
  tactics: StrategyTactic[];
  timeline: {
    '30_days'?: string[];
    '60_days'?: string[];
    '90_days'?: string[];
  };
  budget_estimate?: number | null;
  team_requirements: TeamRequirement[];
  status: StrategyStatus;
  progress: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  start_date?: string | null;
  target_date?: string | null;
}

export interface StrategyGoal {
  id?: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
}

export interface StrategyTactic {
  id?: string;
  title: string;
  description?: string;
  status?: 'planned' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

export interface TeamRequirement {
  role: string;
  count: number;
  skills?: string[];
}

export interface CreateStrategyInput {
  user_id?: number;
  title: string;
  description?: string;
  module?: string;
  goals?: StrategyGoal[];
  tactics?: StrategyTactic[];
  timeline?: Record<string, any>;
  budget_estimate?: number;
  team_requirements?: TeamRequirement[];
  start_date?: string;
  target_date?: string;
}

// =====================================================================
// DASHBOARD & KPI DATA
// =====================================================================

export interface DashboardKPI {
  id: number;
  user_id?: number | null;
  kpi_name: string;
  kpi_category?: string | null;
  current_value?: number | null;
  previous_value?: number | null;
  target_value?: number | null;
  value_unit?: string | null;
  display_format?: string | null;
  trend_direction?: 'up' | 'down' | 'neutral' | null;
  trend_percentage?: number | null;
  period_start?: string | null;
  period_end?: string | null;
  historical_data: Array<{
    date: string;
    value: number;
  }>;
  updated_at: Timestamp;
}

export interface CreateKPIInput {
  user_id?: number;
  kpi_name: string;
  kpi_category?: string;
  current_value?: number;
  previous_value?: number;
  target_value?: number;
  value_unit?: string;
  display_format?: string;
  trend_direction?: 'up' | 'down' | 'neutral';
  trend_percentage?: number;
  period_start?: string;
  period_end?: string;
  historical_data?: Array<Record<string, any>>;
}

// =====================================================================
// BUSINESS GOALS
// =====================================================================

export type BusinessGoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface BusinessGoal {
  id: number;
  user_id?: number | null;
  goal_name: string;
  description?: string | null;
  category?: string | null;
  target_value?: number | null;
  current_value?: number | null;
  unit?: string | null;
  progress_percentage: number;
  start_date?: string | null;
  target_date?: string | null;
  status: BusinessGoalStatus;
  milestones: GoalMilestone[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface GoalMilestone {
  id?: string;
  title: string;
  target_date: string;
  completed: boolean;
  completed_date?: string;
}

export interface CreateGoalInput {
  user_id?: number;
  goal_name: string;
  description?: string;
  category?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  start_date?: string;
  target_date?: string;
  milestones?: GoalMilestone[];
}

// =====================================================================
// ACTIVITY LOGS
// =====================================================================

export interface ActivityLog {
  id: number;
  user_id?: number | null;
  action: string;
  resource_type?: string | null;
  resource_id?: number | null;
  description?: string | null;
  metadata: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Timestamp;
}

export interface CreateActivityLogInput {
  user_id?: number;
  action: string;
  resource_type?: string;
  resource_id?: number;
  description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// =====================================================================
// GTM TEST PIT
// =====================================================================

export type GTMTestStatus = 'draft' | 'running' | 'completed' | 'paused';

export interface GTMTest {
  id: number;
  user_id?: number | null;
  test_name: string;
  hypothesis?: string | null;
  test_type?: string | null;
  variants: TestVariant[];
  audience_criteria: Record<string, any>;
  results: Record<string, any>;
  winner?: string | null;
  confidence_level?: number | null;
  status: GTMTestStatus;
  started_at?: Timestamp | null;
  ended_at?: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TestVariant {
  id: string;
  name: string;
  description?: string;
  traffic_percentage: number;
  conversions?: number;
  conversion_rate?: number;
}

export interface CreateGTMTestInput {
  user_id?: number;
  test_name: string;
  hypothesis?: string;
  test_type?: string;
  variants?: TestVariant[];
  audience_criteria?: Record<string, any>;
}

// =====================================================================
// INTEGRATIONS
// =====================================================================

export interface Integration {
  id: number;
  user_id?: number | null;
  integration_type: string;
  integration_name?: string | null;
  credentials: Record<string, any>; // Should be encrypted
  is_active: boolean;
  last_sync?: Timestamp | null;
  sync_status?: string | null;
  config: Record<string, any>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateIntegrationInput {
  user_id?: number;
  integration_type: string;
  integration_name?: string;
  credentials?: Record<string, any>;
  config?: Record<string, any>;
}

// =====================================================================
// VIEW TYPES
// =====================================================================

export interface RecentAuditWithResult {
  id: number;
  user_id?: number | null;
  audit_name: string;
  website_url: string;
  status: AuditStatus;
  created_at: Timestamp;
  completed_at?: Timestamp | null;
  overall_score?: number | null;
  overall_grade?: string | null;
  performance_level?: string | null;
}

export interface UserActivitySummary {
  user_id: number;
  email: string;
  company_name?: string | null;
  total_audits: number;
  total_competitor_analyses: number;
  total_strategies: number;
  last_audit_date?: Timestamp | null;
  user_since: Timestamp;
}
