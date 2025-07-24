import { createClient } from './supabase/server'
import fs from 'fs'
import path from 'path'

export interface DatabaseSetupResult {
  success: boolean
  message: string
  details?: any
}

export async function setupDatabase(): Promise<DatabaseSetupResult> {
  try {
    console.log('🚀 Starting database schema setup...')
    
    const supabase = createClient()
    
    // Read the SQL setup file
    const sqlPath = path.join(process.cwd(), 'src/utils/database-setup.sql')
    const setupSQL = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📄 Loaded database schema SQL')
    
    // Split SQL into individual statements (rough split by semicolon)
    const statements = setupSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    const errors: string[] = []
    
    // Execute each statement
    for (let index = 0; index < statements.length; index++) {
      const statement = statements[index]
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${index + 1}/${statements.length}`)
          
          const { error } = await (supabase as any).rpc('exec_sql', {
            sql: statement + ';'
          })
          
          if (error) {
            console.warn(`⚠️ Statement ${index + 1} warning:`, error.message)
            // Some errors are expected (like "already exists" errors)
            if (!error.message.includes('already exists') && 
                !error.message.includes('does not exist')) {
              errors.push(`Statement ${index + 1}: ${error.message}`)
            }
          } else {
            successCount++
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error'
          console.error(`❌ Statement ${index + 1} failed:`, errorMsg)
          errors.push(`Statement ${index + 1}: ${errorMsg}`)
        }
      }
    }
    
    console.log(`✅ Database setup completed: ${successCount}/${statements.length} statements executed`)
    
    // Test the setup by checking if users table exists
    const { data: tableCheck, error: checkError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (checkError) {
      return {
        success: false,
        message: `Database setup appeared to run but users table is not accessible: ${checkError.message}`,
        details: { errors, successCount, totalStatements: statements.length }
      }
    }
    
    console.log('🎉 Database schema setup successful!')
    
    return {
      success: true,
      message: 'Database schema setup completed successfully',
      details: { 
        errors: errors.length > 0 ? errors : undefined,
        successCount, 
        totalStatements: statements.length,
        tableCheck: 'Users table accessible'
      }
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return {
      success: false,
      message: `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    }
  }
}

// Alternative method using raw SQL if RPC is not available
export async function setupDatabaseDirect(): Promise<DatabaseSetupResult> {
  try {
    console.log('🚀 Setting up database with direct connection...')
    
    // First, create the essential tables that we know we need
    const supabase = createClient()
    
    // Create users table first
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        preferred_language VARCHAR(10) DEFAULT 'pt-BR',
        payment_preferences JSONB DEFAULT '{}',
        privacy_settings JSONB DEFAULT '{"allowGroupMemory": true, "dataRetentionDays": 90}',
        consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    console.log('📋 Creating users table...')
    
    // Use a simple INSERT to execute SQL (this is a workaround)
    try {
      // Test if we can create a function to execute raw SQL
      const { error } = await (supabase as any).rpc('exec_raw_sql', {
        query: createUsersTable
      })
      
      if (error && !error.message.includes('already exists')) {
        throw error
      }
    } catch (err) {
      // If RPC doesn't work, try using supabase SQL editor approach
      console.log('📝 RPC not available, checking if table exists with SELECT...')
      
      const { data, error: selectError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (selectError && selectError.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Users table does not exist and cannot be created automatically. Please create it manually in Supabase dashboard.',
          details: {
            manualSetupRequired: true,
            sqlToExecute: createUsersTable
          }
        }
      }
    }
    
    // Test the connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      return {
        success: false,
        message: `Database connection test failed: ${error.message}`,
        details: error
      }
    }
    
    return {
      success: true,
      message: 'Database basic setup verified',
      details: { tableCheck: 'Users table accessible' }
    }
    
  } catch (error) {
    return {
      success: false,
      message: `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    }
  }
} 