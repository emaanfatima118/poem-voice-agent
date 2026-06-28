/**
 * Database Migration Utilities
 * 
 * This module handles:
 * - Initial schema creation
 * - Schema version management
 * - Data migration from legacy systems (audit_log.json)
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import fs from 'fs';
import path from 'path';
import { getPool, query, transaction } from '../db';
import type { PoolClient } from 'pg';

// Migration status tracking
interface MigrationStatus {
  version: string;
  name: string;
  applied_at: Date;
}

/**
 * Create migrations table if it doesn't exist
 */
async function ensureMigrationsTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Migrations table ready');
}

/**
 * Check if a migration has been applied
 */
async function isMigrationApplied(version: string): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    'SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1) as exists',
    [version]
  );
  return result.rows[0]?.exists || false;
}

/**
 * Record a migration as applied
 */
async function recordMigration(version: string, name: string, client?: PoolClient): Promise<void> {
  const queryFn = client ? client.query.bind(client) : query;
  await queryFn(
    'INSERT INTO schema_migrations (version, name) VALUES ($1, $2)',
    [version, name]
  );
}

/**
 * Initialize database schema from schema.sql
 */
export async function initializeSchema(): Promise<void> {
  console.log('🚀 Initializing database schema...');
  
  try {
    await ensureMigrationsTable();
    
    // Check if initial migration has been applied
    const version = '001';
    const migrationName = 'initial_schema';
    
    if (await isMigrationApplied(version)) {
      console.log('✅ Schema already initialized');
      return;
    }
    
    // Read schema.sql file
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute schema in a transaction
    await transaction(async (client) => {
      console.log('📝 Executing schema.sql...');
      await client.query(schemaSQL);
      await recordMigration(version, migrationName, client);
      console.log('✅ Schema created successfully');
    });
    
    console.log('🎉 Database initialization complete!');
  } catch (error: any) {
    console.error('❌ Failed to initialize schema:', error);
    throw error;
  }
}

/**
 * Migrate data from legacy audit_log.json to PostgreSQL
 */
export async function migrateAuditLogs(
  auditLogPath?: string,
  userId?: string
): Promise<void> {
  console.log('🔄 Migrating audit logs from JSON to PostgreSQL...');
  
  try {
    // Default path if not provided
    const logPath = auditLogPath || path.join(process.cwd(), 'audit_log.json');
    
    if (!fs.existsSync(logPath)) {
      console.log('⚠️ No audit_log.json found, skipping migration');
      return;
    }
    
    // Read and parse audit log
    const logContent = fs.readFileSync(logPath, 'utf-8');
    const auditLog = JSON.parse(logContent);
    
    if (typeof auditLog !== 'object' || auditLog === null) {
      console.error('❌ Invalid audit log format');
      return;
    }
    
    let migratedCount = 0;
    let errorCount = 0;
    
    // Process each URL's audit history
    for (const [url, audits] of Object.entries(auditLog)) {
      if (!Array.isArray(audits)) {
        console.warn(`⚠️ Invalid audit data for ${url}, skipping`);
        continue;
      }
      
      for (const auditData of audits) {
        try {
          await transaction(async (client) => {
            // Create audit record
            const auditResult = await client.query(`
              INSERT INTO audits (
                user_id,
                audit_name,
                website_url,
                status,
                topics,
                created_at,
                completed_at,
                module,
                metadata
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              RETURNING id
            `, [
              userId || null,
              auditData.audit_name || `Audit for ${url}`,
              url,
              'completed',
              JSON.stringify(auditData.topics || []),
              auditData.timestamp || new Date(),
              auditData.timestamp || new Date(),
              'pulsehub',
              JSON.stringify({ migrated_from_json: true })
            ]);
            
            const auditId = auditResult.rows[0].id;
            
            // Create audit result record
            await client.query(`
              INSERT INTO audit_results (
                audit_id,
                overall_score,
                overall_grade,
                performance_level,
                executive_summary,
                summary_cards,
                findings,
                insights,
                action_plans,
                seo_data,
                performance_data,
                content_data,
                social_data,
                created_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            `, [
              auditId,
              auditData.overall_score || null,
              auditData.overall_grade || null,
              auditData.performance_level || null,
              auditData.executive_summary || null,
              JSON.stringify(auditData.summary_cards || {}),
              JSON.stringify(auditData.findings || []),
              JSON.stringify(auditData.insights || []),
              JSON.stringify(auditData.action_plans || {}),
              JSON.stringify(auditData.seo_data || {}),
              JSON.stringify(auditData.performance_data || {}),
              JSON.stringify(auditData.content_data || {}),
              JSON.stringify(auditData.social_data || {}),
              auditData.timestamp || new Date()
            ]);
            
            migratedCount++;
          });
        } catch (error: any) {
          console.error(`❌ Failed to migrate audit for ${url}:`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log(`✅ Migration complete: ${migratedCount} audits migrated, ${errorCount} errors`);
    
    // Optionally backup the old file
    const backupPath = logPath + '.backup';
    fs.copyFileSync(logPath, backupPath);
    console.log(`📦 Original file backed up to: ${backupPath}`);
    
  } catch (error: any) {
    console.error('❌ Failed to migrate audit logs:', error);
    throw error;
  }
}

/**
 * Run a specific migration
 */
export async function runMigration(
  version: string,
  name: string,
  migrationFn: (client: PoolClient) => Promise<void>
): Promise<void> {
  console.log(`🔄 Running migration ${version}: ${name}...`);
  
  try {
    await ensureMigrationsTable();
    
    if (await isMigrationApplied(version)) {
      console.log(`✅ Migration ${version} already applied, skipping`);
      return;
    }
    
    await transaction(async (client) => {
      await migrationFn(client);
      await recordMigration(version, name, client);
      console.log(`✅ Migration ${version} completed successfully`);
    });
  } catch (error: any) {
    console.error(`❌ Migration ${version} failed:`, error);
    throw error;
  }
}

/**
 * Get all applied migrations
 */
export async function getAppliedMigrations(): Promise<MigrationStatus[]> {
  try {
    await ensureMigrationsTable();
    const result = await query<MigrationStatus>(
      'SELECT version, name, applied_at FROM schema_migrations ORDER BY version'
    );
    return result.rows;
  } catch (error: any) {
    console.error('❌ Failed to get migrations:', error);
    return [];
  }
}

/**
 * Rollback last migration (use with extreme caution!)
 */
export async function rollbackMigration(version: string): Promise<void> {
  console.warn(`⚠️ Rolling back migration ${version}...`);
  
  try {
    await query('DELETE FROM schema_migrations WHERE version = $1', [version]);
    console.log(`✅ Migration ${version} rolled back`);
  } catch (error: any) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Check database health and connectivity
 */
export async function healthCheck(): Promise<{
  connected: boolean;
  schemaInitialized: boolean;
  migrations: MigrationStatus[];
  tableCount: number;
}> {
  try {
    // Test connection
    const pool = getPool();
    await pool.query('SELECT 1');
    
    // Check if migrations table exists
    const tablesResult = await query<{ count: string }>(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableCount = parseInt(tablesResult.rows[0]?.count || '0');
    
    // Check if schema is initialized
    const migrationsExist = await query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      ) as exists
    `);
    
    const schemaInitialized = migrationsExist.rows[0]?.exists || false;
    
    // Get applied migrations
    let migrations: MigrationStatus[] = [];
    if (schemaInitialized) {
      migrations = await getAppliedMigrations();
    }
    
    return {
      connected: true,
      schemaInitialized,
      migrations,
      tableCount
    };
  } catch (error: any) {
    console.error('❌ Health check failed:', error);
    return {
      connected: false,
      schemaInitialized: false,
      migrations: [],
      tableCount: 0
    };
  }
}

/**
 * Setup database (convenience function)
 * Runs all necessary setup steps
 */
export async function setupDatabase(options?: {
  migrateAuditLogs?: boolean;
  auditLogPath?: string;
  userId?: string;
}): Promise<void> {
  console.log('🚀 Setting up database...');
  
  try {
    // Initialize schema
    await initializeSchema();
    
    // Optionally migrate audit logs
    if (options?.migrateAuditLogs) {
      await migrateAuditLogs(options.auditLogPath, options.userId);
    }
    
    // Run health check
    const health = await healthCheck();
    console.log('📊 Database status:', {
      connected: health.connected,
      schemaInitialized: health.schemaInitialized,
      migrationsApplied: health.migrations.length,
      tablesCreated: health.tableCount
    });
    
    console.log('🎉 Database setup complete!');
  } catch (error: any) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Export a CLI runner for migrations
if (require.main === module) {
  const command = process.argv[2];
  
  (async () => {
    try {
      switch (command) {
        case 'init':
          await initializeSchema();
          break;
        
        case 'migrate-audits':
          const auditLogPath = process.argv[3];
          const userId = process.argv[4];
          await migrateAuditLogs(auditLogPath, userId);
          break;
        
        case 'health':
          const health = await healthCheck();
          console.log('Database Health:', JSON.stringify(health, null, 2));
          break;
        
        case 'setup':
          await setupDatabase({
            migrateAuditLogs: process.argv.includes('--migrate-audits'),
            auditLogPath: process.argv[3],
            userId: process.argv[4]
          });
          break;
        
        default:
          console.log('Usage:');
          console.log('  npm run db:init           - Initialize schema');
          console.log('  npm run db:migrate-audits - Migrate audit_log.json');
          console.log('  npm run db:health         - Check database health');
          console.log('  npm run db:setup          - Run full setup');
      }
      process.exit(0);
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  })();
}
