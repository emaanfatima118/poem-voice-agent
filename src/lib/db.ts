/**
 * Secure PostgreSQL Database Connector
 * 
 * ⚠️ SERVER-SIDE ONLY - This file must NEVER be imported in client components
 * Use only in API routes, server components, and server actions
 * 
 * Features:
 * - Connection pooling for optimal performance
 * - Automatic retry logic with exponential backoff
 * - Comprehensive error handling
 * - Type-safe query interface
 * - Environment-based configuration
 */

// Load environment variables
import { config } from 'dotenv';
config();

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

// Ensure this runs server-side only
if (typeof window !== 'undefined') {
  throw new Error('❌ Database connector cannot be used in browser! Use API routes instead.');
}

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PORT || '5432'),
  database: process.env.DB_NAME || 'stackwise',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 10000, // Timeout connection attempts after 10s
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // Use schema from env or default to 'stackwise_app' to avoid conflicts with Django tables
  options: `-c search_path=${process.env.DB_SCHEMA || 'stackwise_app'},public`,
};

// Singleton pool instance
let pool: Pool | null = null;

/**
 * Get or create the database connection pool
 * Implements singleton pattern to prevent multiple pools
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(DB_CONFIG);
    
    // Handle pool errors
    pool.on('error', (err: Error) => {
      console.error('💥 Unexpected database pool error:', err);
      // Don't exit the process, just log the error
    });

    // Log successful connection (only once)
    pool.on('connect', () => {
      console.log('✅ Database pool connected successfully');
    });

    console.log(`🔌 PostgreSQL pool initialized: ${DB_CONFIG.user}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
  }
  
  return pool;
}

/**
 * Test database connectivity
 * Useful for health checks and startup validation
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Database connection test successful:', {
      time: result.rows[0].current_time,
      version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
    });
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

/**
 * Execute a query with automatic retry logic
 * 
 * @param text - SQL query string
 * @param params - Query parameters (prevents SQL injection)
 * @param retries - Number of retry attempts (default: 3)
 * @returns Query result
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[],
  retries: number = 3
): Promise<QueryResult<T>> {
  const pool = getPool();
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const start = Date.now();
      const result = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries (>1s)
      if (duration > 1000) {
        console.warn(`⚠️ Slow query detected (${duration}ms):`, text.substring(0, 100));
      }
      
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Query failed (attempt ${attempt}/${retries}):`, {
        error: error.message,
        query: text.substring(0, 100),
        code: error.code
      });
      
      // Don't retry on syntax errors or constraint violations
      if (error.code === '42601' || error.code === '23505' || error.code === '23503') {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }
  
  throw lastError || new Error('Query failed after retries');
}

/**
 * Get a client from the pool for transaction support
 * Remember to release the client when done!
 * 
 * @example
 * const client = await getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query('INSERT ...');
 *   await client.query('UPDATE ...');
 *   await client.query('COMMIT');
 * } catch (error) {
 *   await client.query('ROLLBACK');
 *   throw error;
 * } finally {
 *   client.release();
 * }
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return await pool.connect();
}

/**
 * Execute a function within a database transaction
 * Automatically handles commit/rollback and client release
 * 
 * @param callback - Function to execute within transaction
 * @returns Result of the callback
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction rolled back:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close the database pool
 * Should be called when shutting down the application
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔌 Database pool closed');
  }
}

/**
 * Type-safe query builder helpers
 */
export const db = {
  /**
   * Execute a SELECT query
   */
  select: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<T[]> => {
    const result = await query<T>(text, params);
    return result.rows;
  },

  /**
   * Execute a SELECT query and return first row
   */
  selectOne: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<T | null> => {
    const result = await query<T>(text, params);
    return result.rows[0] || null;
  },

  /**
   * Execute an INSERT query
   */
  insert: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<T> => {
    const result = await query<T>(text, params);
    return result.rows[0];
  },

  /**
   * Execute an UPDATE query
   */
  update: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<T[]> => {
    const result = await query<T>(text, params);
    return result.rows;
  },

  /**
   * Execute a DELETE query
   */
  delete: async (text: string, params?: any[]): Promise<number> => {
    const result = await query(text, params);
    return result.rowCount || 0;
  },

  /**
   * Check if a record exists
   */
  exists: async (text: string, params?: any[]): Promise<boolean> => {
    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(${text}) as exists`,
      params
    );
    return result.rows[0]?.exists || false;
  },

  /**
   * Get count of records
   */
  count: async (table: string, where?: string, params?: any[]): Promise<number> => {
    const whereClause = where ? `WHERE ${where}` : '';
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM ${table} ${whereClause}`,
      params
    );
    return parseInt(result.rows[0]?.count || '0');
  },

  /**
   * Execute raw SQL (use with caution)
   */
  raw: query,

  /**
   * Transaction helper
   */
  transaction,

  /**
   * Get client for manual transaction handling
   */
  getClient,
};

// Export default instance
export default db;
