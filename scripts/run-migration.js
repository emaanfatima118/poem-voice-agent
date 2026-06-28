/**
 * Run database migration script
 * Usage: node scripts/run-migration.js scripts/migration-file.sql
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const migrationFile = process.argv[2];
  
  if (!migrationFile) {
    console.error('Usage: node scripts/run-migration.js <migration-file.sql>');
    process.exit(1);
  }

  const sqlPath = path.resolve(migrationFile);
  
  if (!fs.existsSync(sqlPath)) {
    console.error(`Migration file not found: ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log(`Running migration: ${path.basename(sqlPath)}`);
  console.log('=' .repeat(60));
  
  // Support both DATABASE_URL and individual connection parameters
  let poolConfig;
  if (process.env.DATABASE_URL) {
    poolConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    };
  } else if (process.env.DB_HOST && process.env.DB_NAME) {
    poolConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_HOST === 'localhost' ? false : { rejectUnauthorized: false }
    };
  } else {
    console.error('❌ Database connection not configured');
    console.error('Set either DATABASE_URL or DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  }

  const pool = new Pool(poolConfig);

  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    
    // Verify the views were created
    const result = await pool.query(`
      SELECT schemaname, viewname, definition
      FROM pg_views
      WHERE viewname IN ('abm_contacts', 'abm_accounts')
      ORDER BY viewname;
    `);
    
    console.log('\n📋 Created ABM Views:');
    console.log('=' .repeat(60));
    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        console.log(`  ✅ ${row.viewname} (schema: ${row.schemaname})`);
      });
    } else {
      console.log('  ⚠️  No ABM views found - check migration SQL');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
