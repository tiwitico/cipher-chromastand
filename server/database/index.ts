import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'
import { DEFAULT_HAIR_STYLES, DEFAULT_COLOR_PRESETS } from './seedData'
import { sql } from 'drizzle-orm'

const { Pool } = pg

let pool: pg.Pool | null = null
let drizzleDb: ReturnType<typeof drizzle> | null = null
let isInitialized = false

export function getDatabase() {
  if (drizzleDb) return drizzleDb

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.warn('[Database] ⚠️ DATABASE_URL is not set in environment. Running in mock/fallback mode.')
    return null
  }

  // Cloud SQL & Cloud Run ready SSL configuration
  // Cloud SQL with public IP requires SSL; Cloud SQL with auth proxy/unix sockets uses standard connection
  const isCloudRun = Boolean(process.env.K_SERVICE || process.env.CLOUD_RUN_JOB)
  const isSslDisabled = connectionString.includes('sslmode=disable')

  const sslConfig = isSslDisabled
    ? false
    : connectionString.includes('sslmode=require') || isCloudRun || connectionString.includes('neon.tech') || connectionString.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined

  pool = new Pool({
    connectionString,
    ssl: sslConfig,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  pool.on('error', (err) => {
    console.error('[Database] Unexpected error on idle PostgreSQL client', err)
  })

  drizzleDb = drizzle(pool, { schema })
  return drizzleDb
}

export async function ensureDatabaseReady() {
  if (isInitialized) return
  const db = getDatabase()
  if (!db || !pool) return

  try {
    // 1. Create tables if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS simulations (
        id VARCHAR(64) PRIMARY KEY,
        title TEXT NOT NULL,
        client_name VARCHAR(128) DEFAULT 'Guest Client',
        user_photo TEXT,
        hair_style_id VARCHAR(64) NOT NULL,
        hair_style_name VARCHAR(128) NOT NULL,
        hair_category VARCHAR(64),
        color_hex VARCHAR(16) NOT NULL,
        color_name VARCHAR(128) NOT NULL,
        color_family VARCHAR(64) DEFAULT 'natural',
        secondary_color_hex VARCHAR(16),
        base_hair_level INTEGER DEFAULT 3,
        target_hair_level INTEGER DEFAULT 7,
        hair_length VARCHAR(32) DEFAULT 'medium',
        hair_texture VARCHAR(32) DEFAULT 'medium',
        gray_percentage INTEGER DEFAULT 0,
        formula_json JSONB NOT NULL,
        front_image TEXT,
        side_image TEXT,
        back_image TEXT,
        ai_analysis_json JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS color_presets (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        category VARCHAR(64) NOT NULL,
        hex VARCHAR(16) NOT NULL,
        level INTEGER NOT NULL,
        family VARCHAR(64) NOT NULL,
        description TEXT,
        undertone VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS hair_styles (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        gender VARCHAR(32) NOT NULL,
        category VARCHAR(64) NOT NULL,
        length VARCHAR(32) NOT NULL,
        description TEXT,
        texture VARCHAR(64) DEFAULT 'wavy',
        trending INTEGER DEFAULT 0
      );
    `)

    // 2. Seed hair_styles if empty
    const styleCountRes = await pool.query('SELECT COUNT(*) FROM hair_styles')
    if (parseInt(styleCountRes.rows[0].count, 10) === 0) {
      console.log('[Database] 🌱 Seeding initial hair styles into PostgreSQL...')
      for (const style of DEFAULT_HAIR_STYLES) {
        await pool.query(
          `INSERT INTO hair_styles (id, name, gender, category, length, description, texture, trending)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
          [style.id, style.name, style.gender, style.category, style.length, style.description, style.texture, style.trending]
        )
      }
    }

    // 3. Seed color_presets if empty
    const colorCountRes = await pool.query('SELECT COUNT(*) FROM color_presets')
    if (parseInt(colorCountRes.rows[0].count, 10) === 0) {
      console.log('[Database] 🌱 Seeding initial color presets into PostgreSQL...')
      for (const color of DEFAULT_COLOR_PRESETS) {
        await pool.query(
          `INSERT INTO color_presets (id, name, category, hex, level, family, description, undertone)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
          [color.id, color.name, color.category, color.hex, color.level, color.family, color.description, color.undertone]
        )
      }
    }

    isInitialized = true
    console.log('[Database] ✅ PostgreSQL schema & seeds verified successfully')
  } catch (err) {
    console.error('[Database] Failed to initialize PostgreSQL tables/seeds:', err)
  }
}

// In-memory fallback repository when DATABASE_URL is not provided (for instant local zero-setup preview)
export const inMemorySimulations: any[] = []
