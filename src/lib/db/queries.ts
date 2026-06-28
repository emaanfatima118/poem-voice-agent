/**
 * Type-safe database query helpers for Stackwise Platform
 * 
 * This module provides convenient, type-safe functions for common database operations
 * across all tables in the new schema
 */

import { db } from '../db';
import type {
  // Core types
  User, CreateUserInput,
  UserDetail, CreateUserDetailInput,
  UserRole, CreateUserRoleInput, RoleName,
  Connector, CreateConnectorInput,
  ConnectorDetail, CreateConnectorDetailInput,
  UserSubscription, CreateUserSubscriptionInput,
  CardDetail, CreateCardDetailInput,
  KeyFeature, CreateKeyFeatureInput,
  SubFeature, CreateSubFeatureInput,
  SubFeatureAttribute, CreateSubFeatureAttributeInput,
  UserDocument, CreateUserDocumentInput,
  AuditLog, CreateAuditLogInput,
  // Module-specific
  PulseHubAudit, CreatePulseHubAuditInput,
  BrandCraftProject, CreateBrandCraftProjectInput,
  FlightDeckOperation, CreateFlightDeckOperationInput,
  StrategyStudioPlan, CreateStrategyStudioPlanInput,
  GTMModel, CreateGTMModelInput, UpdateGTMModelInput,
  // Access control
  ResourcePermission, CreateResourcePermissionInput,
  // Views
  UserAccessView,
  UserDocumentsView,
  Timestamp
} from './types';

// =====================================================================
// USER OPERATIONS
// =====================================================================

export const users = {
  /**
   * Create a new user
   */
  create: async (data: CreateUserInput): Promise<User> => {
    const password = data.password_hash || data.password; // Support both raw and pre-hashed
    return db.insert<User>(`
      INSERT INTO users (username, email, password, user_type, connector_id, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.username || data.email.split('@')[0], // Default username from email
      data.email,
      password, // Should already be hashed
      data.user_type || 'standard',
      data.connector_id || null,
      data.email_verified || false
    ]);
  },

  /**
   * Find user by ID
   */
  findById: async (userid: number): Promise<User | null> => {
    return db.selectOne<User>('SELECT * FROM users WHERE userid = $1', [userid]);
  },

  /**
   * Find user by email
   */
  findByEmail: async (email: string): Promise<User | null> => {
    return db.selectOne<User>('SELECT * FROM users WHERE email = $1', [email]);
  },

  /**
   * Find user by username
   */
  findByUsername: async (username: string): Promise<User | null> => {
    return db.selectOne<User>('SELECT * FROM users WHERE username = $1', [username]);
  },

  /**
   * Update user
   */
  update: async (userid: number, data: Partial<User>): Promise<User | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Filter out fields that shouldn't be updated
    const allowedFields = ['username', 'email', 'password', 'user_type', 'connector_id', 'is_active', 'email_verified', 'updated_by'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(userid);
    const result = await db.update<User>(`
      UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE userid = $${paramIndex} RETURNING *
    `, values);

    return result[0] || null;
  },

  /**
   * Update last login
   */
  updateLastLogin: async (userid: number): Promise<void> => {
    await db.raw('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE userid = $1', [userid]);
  },

  /**
   * Get all users (with pagination)
   */
  list: async (limit: number = 50, offset: number = 0): Promise<User[]> => {
    return db.select<User>('SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
  },

  /**
   * Get user with full access info (from view)
   */
  getAccessInfo: async (userid: number): Promise<UserAccessView | null> => {
    return db.selectOne<UserAccessView>('SELECT * FROM user_access_view WHERE userid = $1', [userid]);
  }
};

// =====================================================================
// USER DETAILS OPERATIONS
// =====================================================================

export const userDetails = {
  /**
   * Create user details
   */
  create: async (data: CreateUserDetailInput): Promise<UserDetail> => {
    return db.insert<UserDetail>(`
      INSERT INTO user_details (userid, first_name, last_name, ssn, phone, address, company_name, job_title, profile_picture_url, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      data.userid,
      data.first_name || null,
      data.last_name || null,
      data.ssn || null, // Should be encrypted before passing here
      data.phone || null,
      data.address || null,
      data.company_name || null,
      data.job_title || null,
      data.profile_picture_url || null,
      JSON.stringify(data.metadata || {})
    ]);
  },

  /**
   * Find by user ID
   */
  findByUserId: async (userid: number): Promise<UserDetail | null> => {
    return db.selectOne<UserDetail>('SELECT * FROM user_details WHERE userid = $1', [userid]);
  },

  /**
   * Update user details
   */
  update: async (userid: number, data: Partial<UserDetail>): Promise<UserDetail | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['first_name', 'last_name', 'ssn', 'phone', 'address', 'company_name', 'job_title', 'profile_picture_url', 'metadata'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(key === 'metadata' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(userid);
    const result = await db.update<UserDetail>(`
      UPDATE user_details SET ${fields.join(', ')} WHERE userid = $${paramIndex} RETURNING *
    `, values);

    return result[0] || null;
  }
};

// =====================================================================
// USER ROLES OPERATIONS
// =====================================================================

export const userRoles = {
  /**
   * Assign role to user
   */
  assign: async (data: CreateUserRoleInput): Promise<UserRole> => {
    return db.insert<UserRole>(`
      INSERT INTO user_roles (userid, role_name, description, assigned_by, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      data.userid,
      data.role_name,
      data.description || null,
      data.assigned_by || null,
      data.expires_at || null
    ]);
  },

  /**
   * Get roles for user
   */
  getByUserId: async (userid: number): Promise<UserRole[]> => {
    return db.select<UserRole>('SELECT * FROM user_roles WHERE userid = $1 AND is_active = true', [userid]);
  },

  /**
   * Check if user has role
   */
  hasRole: async (userid: number, roleName: RoleName): Promise<boolean> => {
    return db.exists(
      'SELECT 1 FROM user_roles WHERE userid = $1 AND role_name = $2 AND is_active = true',
      [userid, roleName]
    );
  },

  /**
   * Revoke role
   */
  revoke: async (roleId: number): Promise<void> => {
    await db.raw('UPDATE user_roles SET is_active = false WHERE role_id = $1', [roleId]);
  }
};

// =====================================================================
// CONNECTOR OPERATIONS
// =====================================================================

export const connectors = {
  /**
   * Get all connectors
   */
  list: async (): Promise<Connector[]> => {
    return db.select<Connector>('SELECT * FROM connectors WHERE is_active = true ORDER BY connector_name');
  },

  /**
   * Find by ID
   */
  findById: async (connectorId: number): Promise<Connector | null> => {
    return db.selectOne<Connector>('SELECT * FROM connectors WHERE connector_id = $1', [connectorId]);
  },

  /**
   * Find by name
   */
  findByName: async (name: string): Promise<Connector | null> => {
    return db.selectOne<Connector>('SELECT * FROM connectors WHERE connector_name = $1', [name]);
  }
};

export const connectorDetails = {
  /**
   * Create or update connector details (user OAuth tokens)
   */
  upsert: async (data: {
    user_id: number;
    connector_id: number;
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expiry?: Date;
    scope?: string;
    instance_url?: string;
    account_id?: string;
    account_name?: string;
    account_email?: string;
    metadata?: any;
    created_by?: string;
  }): Promise<any> => {
    return db.insert(`
      INSERT INTO connector_details (
        userid, connector_id, access_token, refresh_token, token_type,
        expiry, scope, instance_url, account_id, account_name, account_email, metadata, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (userid, connector_id) 
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expiry = EXCLUDED.expiry,
        instance_url = EXCLUDED.instance_url,
        account_id = EXCLUDED.account_id,
        account_name = EXCLUDED.account_name,
        account_email = EXCLUDED.account_email,
        metadata = EXCLUDED.metadata,
        is_active = true,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.user_id,
      data.connector_id,
      data.access_token,
      data.refresh_token || null,
      data.token_type || 'Bearer',
      data.expiry || null,
      data.scope || null,
      data.instance_url || null,
      data.account_id || null,
      data.account_name || null,
      data.account_email || null,
      JSON.stringify(data.metadata || {}),
      data.created_by || null
    ]);
  },

  /**
   * Find active connector details for user
   */
  findByUser: async (userId: number): Promise<any[]> => {
    return db.select(`
      SELECT cd.*, c.connector_name, c.display_name, c.description
      FROM connector_details cd
      JOIN connectors c ON cd.connector_id = c.connector_id
      WHERE cd.userid = $1 AND cd.is_active = true
      ORDER BY cd.created_at DESC
    `, [userId]);
  },

  /**
   * Find specific connector detail
   */
  findOne: async (userId: number, connectorId: number, accountId?: string): Promise<any | null> => {
    const query = accountId 
      ? `SELECT * FROM connector_details WHERE userid = $1 AND connector_id = $2 AND account_id = $3 AND is_active = true`
      : `SELECT * FROM connector_details WHERE userid = $1 AND connector_id = $2 AND is_active = true LIMIT 1`;
    const params = accountId ? [userId, connectorId, accountId] : [userId, connectorId];
    return db.selectOne(query, params);
  },

  /**
   * Find connectors expiring soon (for token refresh)
   */
  findExpiring: async (hoursAhead: number = 1): Promise<any[]> => {
    return db.select(`
      SELECT cd.*, c.connector_name
      FROM connector_details cd
      JOIN connectors c ON cd.connector_id = c.connector_id
      WHERE cd.is_active = true 
      AND cd.expiry IS NOT NULL
      AND cd.expiry < NOW() + INTERVAL '${hoursAhead} hours'
      AND cd.refresh_token IS NOT NULL
    `);
  },

  /**
   * Disconnect connector
   */
  disconnect: async (id: number): Promise<void> => {
    await db.update(`
      UPDATE connector_details 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `, [id]);
  },

  /**
   * Update sync status
   */
  updateSyncStatus: async (id: number, status: string, errorMessage?: string): Promise<void> => {
    await db.update(`
      UPDATE connector_details 
      SET sync_status = $2, 
          error_message = $3,
          last_sync_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [id, status, errorMessage || null]);
  },

  /**
   * Update tokens
   */
  updateTokens: async (id: number, data: {
    access_token: string;
    refresh_token?: string;
    expires_at?: Date;
  }): Promise<void> => {
    await db.update(`
      UPDATE connector_details 
      SET access_token = $2,
          refresh_token = COALESCE($3, refresh_token),
          expiry = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [id, data.access_token, data.refresh_token || null, data.expires_at || null]);
  },

  /**
   * Legacy methods for backward compatibility
   */
  save: async (data: CreateConnectorDetailInput): Promise<ConnectorDetail> => {
    return db.insert<ConnectorDetail>(`
      INSERT INTO connector_details (connector_id, access_token, refresh_token, instance_url, expiry, created_by, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      data.connector_id,
      data.access_token || null,
      data.refresh_token || null,
      data.instance_url || null,
      data.expiry || null,
      data.created_by || null,
      JSON.stringify(data.metadata || {})
    ]);
  },

  getByConnectorId: async (connectorId: number): Promise<ConnectorDetail[]> => {
    return db.select<ConnectorDetail>(
      'SELECT * FROM connector_details WHERE connector_id = $1 ORDER BY created_at DESC',
      [connectorId]
    );
  },

  getLatest: async (connectorId: number): Promise<ConnectorDetail | null> => {
    return db.selectOne<ConnectorDetail>(
      'SELECT * FROM connector_details WHERE connector_id = $1 ORDER BY created_at DESC LIMIT 1',
      [connectorId]
    );
  }
};

// =====================================================================
// SUBSCRIPTION & PAYMENT OPERATIONS
// =====================================================================

export const subscriptions = {
  /**
   * Create subscription
   */
  create: async (data: CreateUserSubscriptionInput): Promise<UserSubscription> => {
    return db.insert<UserSubscription>(`
      INSERT INTO user_subscription (userid, subscription_type, subscription_key, stripe_subscription_id, stripe_customer_id, status, current_period_start, current_period_end)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      data.userid,
      data.subscription_type,
      data.subscription_key || null,
      data.stripe_subscription_id || null,
      data.stripe_customer_id || null,
      data.status || 'active',
      data.current_period_start || null,
      data.current_period_end || null
    ]);
  },

  /**
   * Get by user ID
   */
  getByUserId: async (userid: number): Promise<UserSubscription | null> => {
    return db.selectOne<UserSubscription>(
      'SELECT * FROM user_subscription WHERE userid = $1 ORDER BY created_at DESC LIMIT 1',
      [userid]
    );
  },

  /**
   * Update subscription
   */
  update: async (paymentId: number, data: Partial<UserSubscription>): Promise<UserSubscription | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['subscription_type', 'status', 'current_period_start', 'current_period_end', 'cancel_at_period_end'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(paymentId);
    const result = await db.update<UserSubscription>(`
      UPDATE user_subscription SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE payment_id = $${paramIndex} RETURNING *
    `, values);

    return result[0] || null;
  }
};

export const cardDetails = {
  /**
   * Add card
   */
  add: async (data: CreateCardDetailInput): Promise<CardDetail> => {
    return db.insert<CardDetail>(`
      INSERT INTO card_details (userid, card_number_last4, card_brand, expiry, cardholder_name, is_default, stripe_payment_method_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      data.userid,
      data.card_number_last4 || null,
      data.card_brand || null,
      data.expiry || null,
      data.cardholder_name || null,
      data.is_default || false,
      data.stripe_payment_method_id || null
    ]);
  },

  /**
   * Get cards for user
   */
  getByUserId: async (userid: number): Promise<CardDetail[]> => {
    return db.select<CardDetail>(
      'SELECT * FROM card_details WHERE userid = $1 ORDER BY is_default DESC, created_at DESC',
      [userid]
    );
  },

  /**
   * Set default card
   */
  setDefault: async (cardId: number, userid: number): Promise<void> => {
    await db.transaction(async (client) => {
      // Unset all defaults for user
      await client.query('UPDATE card_details SET is_default = false WHERE userid = $1', [userid]);
      // Set this one as default
      await client.query('UPDATE card_details SET is_default = true WHERE card_id = $1', [cardId]);
    });
  }
};

// =====================================================================
// FEATURES OPERATIONS
// =====================================================================

export const keyFeatures = {
  /**
   * List all active features
   */
  list: async (): Promise<KeyFeature[]> => {
    return db.select<KeyFeature>(
      'SELECT * FROM key_features WHERE is_active = true ORDER BY display_order, feature_name'
    );
  },

  /**
   * Get features by module
   */
  getByModule: async (module: 'pulse_hub' | 'brand_craft' | 'flight_deck' | 'strategy_studio'): Promise<KeyFeature[]> => {
    return db.select<KeyFeature>(
      `SELECT * FROM key_features WHERE ${module} = true AND is_active = true ORDER BY display_order`,
      []
    );
  },

  /**
   * Find by ID
   */
  findById: async (featureId: number): Promise<KeyFeature | null> => {
    return db.selectOne<KeyFeature>('SELECT * FROM key_features WHERE feature_id = $1', [featureId]);
  }
};

export const subFeatures = {
  /**
   * Get by feature ID
   */
  getByFeatureId: async (featureId: number): Promise<SubFeature[]> => {
    return db.select<SubFeature>(
      'SELECT * FROM sub_features WHERE feature_id = $1 AND is_active = true ORDER BY display_order',
      [featureId]
    );
  },

  /**
   * Get sub-feature with attributes
   */
  getWithAttributes: async (subId: number): Promise<SubFeature & { attributes?: SubFeatureAttribute[] } | null> => {
    const subFeature = await db.selectOne<SubFeature>('SELECT * FROM sub_features WHERE sub_id = $1', [subId]);
    if (!subFeature) return null;

    const attributes = await db.select<SubFeatureAttribute>(
      'SELECT * FROM sub_feature_attributes WHERE sub_id = $1 ORDER BY display_order',
      [subId]
    );

    return { ...subFeature, attributes };
  }
};

// =====================================================================
// DOCUMENTS OPERATIONS
// =====================================================================

export const documents = {
  /**
   * Upload document (save metadata)
   */
  upload: async (data: CreateUserDocumentInput): Promise<UserDocument> => {
    return db.insert<UserDocument>(`
      INSERT INTO user_documents (user_id, feature_id, sub_id, document_name, document_type, url, gcs_bucket, gcs_path, file_size, mime_type, uploaded_by, is_public, access_roles, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      data.user_id,
      data.feature_id || null,
      data.sub_id || null,
      data.document_name,
      data.document_type || null,
      data.url,
      data.gcs_bucket || null,
      data.gcs_path || null,
      data.file_size || null,
      data.mime_type || null,
      data.uploaded_by || null,
      data.is_public || false,
      data.access_roles || null,
      JSON.stringify(data.metadata || {})
    ]);
  },

  /**
   * Get documents for user
   */
  getByUserId: async (userId: number, limit: number = 50): Promise<UserDocument[]> => {
    return db.select<UserDocument>(
      'SELECT * FROM user_documents WHERE user_id = $1 AND deleted_at IS NULL ORDER BY uploaded_at DESC LIMIT $2',
      [userId, limit]
    );
  },

  /**
   * Get document with feature info (from view)
   */
  getWithFeatureInfo: async (userId: number): Promise<UserDocumentsView[]> => {
    return db.select<UserDocumentsView>(
      'SELECT * FROM user_documents_view WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );
  },

  /**
   * Soft delete document
   */
  softDelete: async (docId: number): Promise<void> => {
    await db.raw('UPDATE user_documents SET deleted_at = CURRENT_TIMESTAMP WHERE doc_id = $1', [docId]);
  },

  /**
   * Permanently delete document
   */
  permanentDelete: async (docId: number): Promise<void> => {
    await db.delete('DELETE FROM user_documents WHERE doc_id = $1', [docId]);
  },

  /**
   * Alias for upload (for consistency with other modules)
   */
  create: async (data: CreateUserDocumentInput): Promise<UserDocument> => {
    return documents.upload(data);
  },

  /**
   * Find document by name and user
   */
  findByNameAndUser: async (documentName: string, userId: number): Promise<UserDocument | null> => {
    const results = await db.select<UserDocument>(
      'SELECT * FROM user_documents WHERE document_name = $1 AND user_id = $2 AND deleted_at IS NULL',
      [documentName, userId]
    );
    return results[0] || null;
  }
};

// =====================================================================
// AUDIT LOGS OPERATIONS
// =====================================================================

export const auditLogs = {
  /**
   * Create audit log
   */
  log: async (data: CreateAuditLogInput): Promise<AuditLog> => {
    return db.insert<AuditLog>(`
      INSERT INTO audit_logs (user_id, action, module, resource_type, resource_id, audit_data, ip_address, user_agent, session_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.user_id || null,
      data.action,
      data.module || null,
      data.resource_type || null,
      data.resource_id || null,
      JSON.stringify(data.audit_data || {}),
      data.ip_address || null,
      data.user_agent || null,
      data.session_id || null
    ]);
  },

  /**
   * Get logs for user
   */
  findByUser: async (userId: number, limit: number = 100): Promise<AuditLog[]> => {
    return db.select<AuditLog>(
      'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
  },

  /**
   * Get logs for user (alias)
   */
  getByUserId: async (userId: number, limit: number = 100): Promise<AuditLog[]> => {
    return db.select<AuditLog>(
      'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
  },

  /**
   * Get logs by action
   */
  getByAction: async (action: string, limit: number = 100): Promise<AuditLog[]> => {
    return db.select<AuditLog>(
      'SELECT * FROM audit_logs WHERE action = $1 ORDER BY created_at DESC LIMIT $2',
      [action, limit]
    );
  },

  /**
   * Get logs by module
   */
  getByModule: async (module: string, limit: number = 100): Promise<AuditLog[]> => {
    return db.select<AuditLog>(
      'SELECT * FROM audit_logs WHERE module = $1 ORDER BY created_at DESC LIMIT $2',
      [module, limit]
    );
  }
};

// =====================================================================
// MODULE-SPECIFIC OPERATIONS
// =====================================================================

// PulseHub Audits
// =====================================================================
// PERFORMANCE AUDIT LOG (One JSON per user with audit history)
// =====================================================================

export interface PerformanceAuditLog {
  log_id?: number;
  user_id: number;
  audit_history: Record<string, any[]>; // { "url1": [audit1, audit2], "url2": [...] }
  created_at?: Date;
  updated_at?: Date;
}

export const performanceAuditLog = {
  /**
   * Get audit history for a user (returns the entire JSON)
   */
  findByUser: async (userId: number): Promise<Record<string, any[]>> => {
    const result = await db.selectOne<PerformanceAuditLog>(
      'SELECT audit_history FROM performance_audit_log WHERE user_id = $1',
      [userId]
    );
    return result?.audit_history || {};
  },

  /**
   * Update audit history for a user
   * Automatically keeps only last 5 audits per URL
   */
  upsert: async (userId: number, auditHistory: Record<string, any[]>): Promise<void> => {
    // Ensure each URL has max 5 audits
    const trimmedHistory: Record<string, any[]> = {};
    for (const [url, audits] of Object.entries(auditHistory)) {
      trimmedHistory[url] = audits.slice(-5); // Keep last 5
    }

    await db.raw(`
      INSERT INTO performance_audit_log (user_id, audit_history, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        audit_history = $2,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, JSON.stringify(trimmedHistory)]);
  },

  /**
   * Add a single audit to a user's history
   */
  addAudit: async (userId: number, url: string, audit: any): Promise<void> => {
    // Get current history
    const history = await performanceAuditLog.findByUser(userId);
    
    // Add new audit to URL's array
    if (!history[url]) {
      history[url] = [];
    }
    history[url].push(audit);
    
    // Keep only last 5 per URL
    history[url] = history[url].slice(-5);
    
    // Save back
    await performanceAuditLog.upsert(userId, history);
  },

  /**
   * Delete audit history for a user
   */
  deleteByUser: async (userId: number): Promise<void> => {
    await db.delete('DELETE FROM performance_audit_log WHERE user_id = $1', [userId]);
  }
};

// =====================================================================
// PULSEHUB AUDITS (Complete audit records with full data)
// =====================================================================

export const pulseHubAudits = {
  /**
   * Create audit
   */
  create: async (data: CreatePulseHubAuditInput): Promise<PulseHubAudit> => {
    return db.insert<PulseHubAudit>(`
      INSERT INTO pulse_hub_audits (
        user_id, audit_name, website_url, overall_score, performance_level, 
        grade, audit_data, topics_audited, status, result_document_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      data.user_id,
      data.audit_name,
      data.website_url,
      data.overall_score || null,
      data.performance_level || null,
      data.grade || null,
      JSON.stringify(data.audit_data || {}),
      JSON.stringify(data.topics_audited || []),
      data.status || 'pending',
      data.result_document_id || null
    ]);
  },

  /**
   * Get audit by ID
   */
  findById: async (auditId: number): Promise<PulseHubAudit | null> => {
    const results = await db.select<PulseHubAudit>(
      'SELECT * FROM pulse_hub_audits WHERE audit_id = $1',
      [auditId]
    );
    return results[0] || null;
  },

  /**
   * Get audits by user ID
   */
  findByUser: async (userId: number, limit: number = 20): Promise<PulseHubAudit[]> => {
    return db.select<PulseHubAudit>(
      'SELECT * FROM pulse_hub_audits WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
  },

  /**
   * Get audits by website URL
   */
  findByWebsite: async (websiteUrl: string, limit: number = 20): Promise<PulseHubAudit[]> => {
    return db.select<PulseHubAudit>(
      'SELECT * FROM pulse_hub_audits WHERE website_url = $1 ORDER BY created_at DESC LIMIT $2',
      [websiteUrl, limit]
    );
  },

  /**
   * Get by user ID (alias)
   */
  getByUserId: async (userId: number, limit: number = 20): Promise<PulseHubAudit[]> => {
    return db.select<PulseHubAudit>(
      'SELECT * FROM pulse_hub_audits WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
  },

  /**
   * Update audit
   */
  update: async (auditId: number, data: Partial<CreatePulseHubAuditInput>): Promise<PulseHubAudit | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = [
      'audit_name', 'website_url', 'overall_score', 'performance_level',
      'grade', 'audit_data', 'topics_audited', 'status', 'result_document_id'
    ];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        if (key === 'audit_data' || key === 'topics_audited') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(auditId);
    const result = await db.update<PulseHubAudit>(`
      UPDATE pulse_hub_audits 
      SET ${fields.join(', ')} 
      WHERE audit_id = $${paramIndex} 
      RETURNING *
    `, values);

    return result[0] || null;
  },

  /**
   * Update status
   */
  updateStatus: async (auditId: number, status: 'pending' | 'processing' | 'completed' | 'failed'): Promise<PulseHubAudit | null> => {
    const result = await db.update<PulseHubAudit>(`
      UPDATE pulse_hub_audits 
      SET status = $1, completed_at = ${status === 'completed' ? 'CURRENT_TIMESTAMP' : 'completed_at'}
      WHERE audit_id = $2 
      RETURNING *
    `, [status, auditId]);

    return result[0] || null;
  },

  /**
   * Delete audit
   */
  delete: async (auditId: number): Promise<void> => {
    await db.delete('DELETE FROM pulse_hub_audits WHERE audit_id = $1', [auditId]);
  }
};

// BrandCraft Projects
export const brandCraftProjects = {
  /**
   * Create project
   */
  create: async (data: CreateBrandCraftProjectInput): Promise<BrandCraftProject> => {
    return db.insert<BrandCraftProject>(`
      INSERT INTO brand_craft_projects (user_id, project_name, status, project_data)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      data.user_id,
      data.project_name,
      data.status || 'draft',
      JSON.stringify(data.project_data || {})
    ]);
  },

  /**
   * Get by user ID
   */
  getByUserId: async (userId: number): Promise<BrandCraftProject[]> => {
    return db.select<BrandCraftProject>(
      'SELECT * FROM brand_craft_projects WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
  },

  /**
   * Update project
   */
  update: async (projectId: number, data: Partial<BrandCraftProject>): Promise<BrandCraftProject | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['project_name', 'status', 'project_data'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(key === 'project_data' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(projectId);
    const result = await db.update<BrandCraftProject>(`
      UPDATE brand_craft_projects SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE project_id = $${paramIndex} RETURNING *
    `, values);

    return result[0] || null;
  }
};

// FlightDeck Operations
export const flightDeckOperations = {
  /**
   * Create operation
   */
  create: async (data: CreateFlightDeckOperationInput): Promise<FlightDeckOperation> => {
    return db.insert<FlightDeckOperation>(`
      INSERT INTO flight_deck_operations (user_id, operation_name, status, operation_data)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      data.user_id,
      data.operation_name,
      data.status || 'active',
      JSON.stringify(data.operation_data || {})
    ]);
  },

  /**
   * Get by user ID
   */
  getByUserId: async (userId: number): Promise<FlightDeckOperation[]> => {
    return db.select<FlightDeckOperation>(
      'SELECT * FROM flight_deck_operations WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
  },

  /**
   * Update operation
   */
  update: async (operationId: number, data: Partial<FlightDeckOperation>): Promise<FlightDeckOperation | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['operation_name', 'status', 'operation_data'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(key === 'operation_data' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(operationId);
    const result = await db.update<FlightDeckOperation>(`
      UPDATE flight_deck_operations SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE operation_id = $${paramIndex} RETURNING *
    `, values);

    return result[0] || null;
  }
};

// Strategy Studio Plans
export const strategyStudioPlans = {
  /**
   * Create plan
   */
  create: async (data: CreateStrategyStudioPlanInput): Promise<StrategyStudioPlan> => {
    return db.insert<StrategyStudioPlan>(`
      INSERT INTO strategy_studio_plans (user_id, plan_name, status, plan_data, target_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      data.user_id,
      data.plan_name,
      data.status || 'draft',
      JSON.stringify(data.plan_data || {}),
      data.target_date || null
    ]);
  },

  /**
   * Get by user ID
   */
  getByUserId: async (userId: number): Promise<StrategyStudioPlan[]> => {
    return db.select<StrategyStudioPlan>(
      'SELECT * FROM strategy_studio_plans WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
  },

  /**
   * Update plan
   */
  update: async (planId: number, data: Partial<StrategyStudioPlan>): Promise<StrategyStudioPlan | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['plan_name', 'status', 'plan_data', 'target_date'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(key === 'plan_data' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(planId);
    const result = await db.update<StrategyStudioPlan>(`
      UPDATE strategy_studio_plans SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE plan_id = $${paramIndex} RETURNING *
    `, values);

    return result[0] || null;
  }
};

// =====================================================================
// ACCESS CONTROL OPERATIONS
// =====================================================================

export const permissions = {
  /**
   * Grant permission
   */
  grant: async (data: CreateResourcePermissionInput): Promise<ResourcePermission> => {
    return db.insert<ResourcePermission>(`
      INSERT INTO resource_permissions (resource_type, resource_id, user_id, role_id, permission_level, granted_by, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      data.resource_type,
      data.resource_id,
      data.user_id || null,
      data.role_id || null,
      data.permission_level || 'read',
      data.granted_by || null,
      data.expires_at || null
    ]);
  },

  /**
   * Check user permission
   */
  hasPermission: async (
    userId: number,
    resourceType: string,
    resourceId: number,
    requiredLevel: 'read' | 'write' | 'admin'
  ): Promise<boolean> => {
    const levelHierarchy = { read: 1, write: 2, admin: 3 };
    const required = levelHierarchy[requiredLevel];

    // Check direct user permission
    const directPermission = await db.selectOne<{ permission_level: string }>(
      `SELECT permission_level FROM resource_permissions 
       WHERE resource_type = $1 AND resource_id = $2 AND user_id = $3 
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
      [resourceType, resourceId, userId]
    );

    if (directPermission) {
      const userLevel = levelHierarchy[directPermission.permission_level as keyof typeof levelHierarchy];
      if (userLevel >= required) return true;
    }

    // Check role-based permission
    const rolePermission = await db.selectOne<{ permission_level: string }>(
      `SELECT rp.permission_level FROM resource_permissions rp
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE rp.resource_type = $1 AND rp.resource_id = $2 AND ur.userid = $3 
       AND ur.is_active = true
       AND (rp.expires_at IS NULL OR rp.expires_at > CURRENT_TIMESTAMP)`,
      [resourceType, resourceId, userId]
    );

    if (rolePermission) {
      const roleLevel = levelHierarchy[rolePermission.permission_level as keyof typeof levelHierarchy];
      return roleLevel >= required;
    }

    return false;
  },

  /**
   * Revoke permission
   */
  revoke: async (permissionId: number): Promise<void> => {
    await db.delete('DELETE FROM resource_permissions WHERE permission_id = $1', [permissionId]);
  }
};

// =====================================================================
// USER CONNECTORS (OAuth Integrations)
// Alias for backward compatibility - actual definition is earlier in file
// =====================================================================

export const userConnectors = connectorDetails;

// =====================================================================
// CRM CONTACTS
// =====================================================================

export const crmContacts = {
  /**
   * Upsert contact from CRM sync
   */
  upsert: async (data: {
    user_id: number;
    connector_id: number;
    external_id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    company?: string;
    job_title?: string;
    phone?: string;
    mobile_phone?: string;
    department?: string;
    lead_status?: string;
    lifecycle_stage?: string;
    owner_name?: string;
    owner_email?: string;
    account_id?: string;
    created_date?: Date;
    modified_date?: Date;
    last_activity_date?: Date;
    raw_data?: any;
  }): Promise<any> => {
    return db.insert(`
      INSERT INTO crm_contacts (
        user_id, connector_id, external_id, email, first_name, last_name, full_name,
        company, job_title, phone, mobile_phone, department, lead_status, lifecycle_stage,
        owner_name, owner_email, account_id, created_date, modified_date, last_activity_date,
        raw_data, last_synced_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, connector_id, external_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        full_name = EXCLUDED.full_name,
        company = EXCLUDED.company,
        job_title = EXCLUDED.job_title,
        phone = EXCLUDED.phone,
        mobile_phone = EXCLUDED.mobile_phone,
        department = EXCLUDED.department,
        lead_status = EXCLUDED.lead_status,
        lifecycle_stage = EXCLUDED.lifecycle_stage,
        owner_name = EXCLUDED.owner_name,
        owner_email = EXCLUDED.owner_email,
        account_id = EXCLUDED.account_id,
        modified_date = EXCLUDED.modified_date,
        last_activity_date = EXCLUDED.last_activity_date,
        raw_data = EXCLUDED.raw_data,
        last_synced_at = CURRENT_TIMESTAMP,
        is_deleted = false,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.user_id, data.connector_id, data.external_id, data.email || null,
      data.first_name || null, data.last_name || null, data.full_name || null,
      data.company || null, data.job_title || null, data.phone || null,
      data.mobile_phone || null, data.department || null, data.lead_status || null,
      data.lifecycle_stage || null, data.owner_name || null, data.owner_email || null,
      data.account_id || null, data.created_date || null, data.modified_date || null,
      data.last_activity_date || null, JSON.stringify(data.raw_data || {})
    ]);
  },

  /**
   * Mark contacts as deleted if not in sync batch
   */
  markDeleted: async (userId: number, connectorId: number, activeExternalIds: string[]): Promise<void> => {
    const placeholders = activeExternalIds.map((_, i) => `$${i + 3}`).join(', ');
    await db.update(`
      UPDATE crm_contacts
      SET is_deleted = true, is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND connector_id = $2 
      AND external_id NOT IN (${placeholders})
      AND is_deleted = false
    `, [userId, connectorId, ...activeExternalIds]);
  },

  /**
   * Find active contacts for user
   */
  findActive: async (userId: number, connectorId?: number): Promise<any[]> => {
    const query = connectorId
      ? `SELECT * FROM crm_contacts WHERE user_id = $1 AND connector_id = $2 AND is_deleted = false ORDER BY created_at DESC`
      : `SELECT * FROM crm_contacts WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC`;
    const params = connectorId ? [userId, connectorId] : [userId];
    return db.select(query, params);
  }
};

// =====================================================================
// CRM ACCOUNTS
// =====================================================================

export const crmAccounts = {
  /**
   * Upsert account from CRM sync
   */
  upsert: async (data: {
    user_id: number;
    connector_id: number;
    external_id: string;
    account_name: string;
    domain?: string;
    industry?: string;
    employee_count?: number;
    annual_revenue?: number;
    account_type?: string;
    account_status?: string;
    owner_name?: string;
    owner_email?: string;
    billing_city?: string;
    billing_state?: string;
    billing_country?: string;
    website?: string;
    description?: string;
    created_date?: Date;
    modified_date?: Date;
    raw_data?: any;
  }): Promise<any> => {
    return db.insert(`
      INSERT INTO crm_accounts (
        user_id, connector_id, external_id, account_name, domain, industry,
        employee_count, annual_revenue, account_type, account_status,
        owner_name, owner_email, billing_city, billing_state, billing_country,
        website, description, created_date, modified_date, raw_data, last_synced_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, connector_id, external_id)
      DO UPDATE SET
        account_name = EXCLUDED.account_name,
        domain = EXCLUDED.domain,
        industry = EXCLUDED.industry,
        employee_count = EXCLUDED.employee_count,
        annual_revenue = EXCLUDED.annual_revenue,
        account_type = EXCLUDED.account_type,
        account_status = EXCLUDED.account_status,
        owner_name = EXCLUDED.owner_name,
        owner_email = EXCLUDED.owner_email,
        billing_city = EXCLUDED.billing_city,
        billing_state = EXCLUDED.billing_state,
        billing_country = EXCLUDED.billing_country,
        website = EXCLUDED.website,
        description = EXCLUDED.description,
        modified_date = EXCLUDED.modified_date,
        raw_data = EXCLUDED.raw_data,
        last_synced_at = CURRENT_TIMESTAMP,
        is_deleted = false,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.user_id, data.connector_id, data.external_id, data.account_name,
      data.domain || null, data.industry || null, data.employee_count || null,
      data.annual_revenue || null, data.account_type || null, data.account_status || null,
      data.owner_name || null, data.owner_email || null, data.billing_city || null,
      data.billing_state || null, data.billing_country || null, data.website || null,
      data.description || null, data.created_date || null, data.modified_date || null,
      JSON.stringify(data.raw_data || {})
    ]);
  },

  /**
   * Mark accounts as deleted if not in sync batch
   */
  markDeleted: async (userId: number, connectorId: number, activeExternalIds: string[]): Promise<void> => {
    const placeholders = activeExternalIds.map((_, i) => `$${i + 3}`).join(', ');
    await db.update(`
      UPDATE crm_accounts
      SET is_deleted = true, is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND connector_id = $2 
      AND external_id NOT IN (${placeholders})
      AND is_deleted = false
    `, [userId, connectorId, ...activeExternalIds]);
  },

  /**
   * Find active accounts for user
   */
  findActive: async (userId: number, connectorId?: number): Promise<any[]> => {
    const query = connectorId
      ? `SELECT * FROM crm_accounts WHERE user_id = $1 AND connector_id = $2 AND is_deleted = false ORDER BY created_at DESC`
      : `SELECT * FROM crm_accounts WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC`;
    const params = connectorId ? [userId, connectorId] : [userId];
    return db.select(query, params);
  }
};

// =====================================================================
// CRM OPPORTUNITIES
// =====================================================================

export const crmOpportunities = {
  /**
   * Upsert opportunity from CRM sync
   */
  upsert: async (data: {
    user_id: number;
    connector_id: number;
    external_id: string;
    name: string;
    account_id?: string;
    account_name?: string;
    stage?: string;
    amount?: number;
    probability?: number;
    close_date?: Date;
    owner_id?: string;
    owner_name?: string;
    opportunity_type?: string;
    lead_source?: string;
    description?: string;
    is_closed?: boolean;
    is_won?: boolean;
  }): Promise<any> => {
    return db.insert(`
      INSERT INTO crm_opportunities (
        user_id, connector_id, external_id, name, account_id, account_name, stage,
        amount, probability, close_date, type, lead_source, is_closed, is_won,
        owner_id, owner_name, description, synced_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, connector_id, external_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        account_id = EXCLUDED.account_id,
        account_name = EXCLUDED.account_name,
        stage = EXCLUDED.stage,
        amount = EXCLUDED.amount,
        probability = EXCLUDED.probability,
        close_date = EXCLUDED.close_date,
        type = EXCLUDED.type,
        lead_source = EXCLUDED.lead_source,
        is_closed = EXCLUDED.is_closed,
        is_won = EXCLUDED.is_won,
        owner_id = EXCLUDED.owner_id,
        owner_name = EXCLUDED.owner_name,
        description = EXCLUDED.description,
        synced_at = CURRENT_TIMESTAMP,
        is_deleted = false,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.user_id, data.connector_id, data.external_id, data.name,
      data.account_id || null, data.account_name || null, data.stage || null,
      data.amount || null, data.probability || null, data.close_date || null,
      data.opportunity_type || null, data.lead_source || null,
      data.is_closed || false, data.is_won || false,
      data.owner_id || null, data.owner_name || null, data.description || null
    ]);
  },

  /**
   * Mark opportunities as deleted if not in sync batch
   */
  markDeleted: async (userId: number, connectorId: number, activeExternalIds: string[]): Promise<void> => {
    const placeholders = activeExternalIds.map((_, i) => `$${i + 3}`).join(', ');
    await db.update(`
      UPDATE crm_opportunities
      SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND connector_id = $2 
      AND external_id NOT IN (${placeholders})
      AND is_deleted = false
    `, [userId, connectorId, ...activeExternalIds]);
  },

  /**
   * Find active opportunities for user
   */
  findActive: async (userId: number, connectorId?: number): Promise<any[]> => {
    const query = connectorId
      ? `SELECT * FROM crm_opportunities WHERE user_id = $1 AND connector_id = $2 AND is_deleted = false ORDER BY created_at DESC`
      : `SELECT * FROM crm_opportunities WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC`;
    const params = connectorId ? [userId, connectorId] : [userId];
    return db.select(query, params);
  }
};

// =====================================================================
// GTM MODELS OPERATIONS (PulseHub)
// =====================================================================

export const gtmModels = {
  /**
   * Create a new GTM model
   */
  create: async (data: CreateGTMModelInput): Promise<GTMModel> => {
    return db.insert<GTMModel>(`
      INSERT INTO pulse_hub_gtm_model (user_id, model_name, details)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [
      data.user_id,
      data.model_name,
      JSON.stringify(data.details),
    ]);
  },

  /**
   * Get all models for a user
   */
  findByUser: async (userId: number): Promise<GTMModel[]> => {
    return db.select<GTMModel>(`
      SELECT * FROM pulse_hub_gtm_model 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);
  },

  /**
   * Get a single model by ID
   */
  findById: async (modelId: number, userId?: number): Promise<GTMModel | null> => {
    const query = userId
      ? `SELECT * FROM pulse_hub_gtm_model WHERE model_id = $1 AND user_id = $2`
      : `SELECT * FROM pulse_hub_gtm_model WHERE model_id = $1`;
    const params = userId ? [modelId, userId] : [modelId];
    const results = await db.select<GTMModel>(query, params);
    return results[0] || null;
  },

  /**
   * Update a model
   */
  update: async (modelId: number, userId: number, data: UpdateGTMModelInput): Promise<GTMModel> => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.model_name !== undefined) {
      updates.push(`model_name = $${paramCount++}`);
      values.push(data.model_name);
    }
    if (data.details !== undefined) {
      // If details provided, merge with existing details for partial updates
      const existing = await gtmModels.findById(modelId, userId);
      if (existing && typeof existing.details === 'object') {
        const mergedDetails = { ...existing.details, ...data.details };
        updates.push(`details = $${paramCount++}::jsonb`);
        values.push(JSON.stringify(mergedDetails));
      } else {
        updates.push(`details = $${paramCount++}::jsonb`);
        values.push(JSON.stringify(data.details));
      }
    }

    if (updates.length === 0) {
      // No updates, just return the existing model
      const existing = await gtmModels.findById(modelId, userId);
      if (!existing) {
        throw new Error('Model not found');
      }
      return existing;
    }

    values.push(modelId, userId);
    const query = `
      UPDATE pulse_hub_gtm_model
      SET ${updates.join(', ')}
      WHERE model_id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;
    const results = await db.update<GTMModel>(query, values);
    return results[0];
  },

  /**
   * Delete a model (hard delete)
   */
  delete: async (modelId: number, userId: number): Promise<void> => {
    await db.delete(`
      DELETE FROM pulse_hub_gtm_model
      WHERE model_id = $1 AND user_id = $2
    `, [modelId, userId]);
  }
};

// Export all query helpers
export default {
  users,
  userDetails,
  userRoles,
  connectors,
  connectorDetails,
  subscriptions,
  cardDetails,
  keyFeatures,
  subFeatures,
  documents,
  auditLogs,
  pulseHubAudits,
  performanceAuditLog,
  brandCraftProjects,
  flightDeckOperations,
  strategyStudioPlans,
  gtmModels,
  permissions,
  userConnectors,
  crmContacts,
  crmAccounts,
  crmOpportunities
};
