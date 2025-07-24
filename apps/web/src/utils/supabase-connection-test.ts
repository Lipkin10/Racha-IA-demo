import { createClient } from './supabase/server'

export interface SupabaseConnectionTest {
  status: 'success' | 'error'
  message: string
  details?: any
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionTest> {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    const supabase = createClient()
    
    // Test 1: Basic connection with a simple query
    console.log('📋 Testing basic connection...')
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database query failed:', error)
      return {
        status: 'error',
        message: `Database query failed: ${error.message}`,
        details: {
          error: error.message,
          hint: error.hint,
          details: error.details
        }
      }
    }
    
    console.log('✅ Database connection successful!')
    return {
      status: 'success',
      message: 'Supabase database connection successful',
      details: {
        response: data,
        timestamp: new Date().toISOString()
      }
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return {
      status: 'error',
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    }
  }
}

export async function checkEnvironmentVariables(): Promise<{
  status: 'success' | 'error'
  message: string
  missing: string[]
}> {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  const missing: string[] = []
  
  required.forEach(envVar => {
    const value = process.env[envVar]
    if (!value || value.trim() === '') {
      missing.push(envVar)
    } else {
      console.log(`✅ ${envVar}: Set (${value.substring(0, 20)}...)`)
    }
  })
  
  if (missing.length > 0) {
    return {
      status: 'error',
      message: `Missing environment variables: ${missing.join(', ')}`,
      missing
    }
  }
  
  return {
    status: 'success',
    message: 'All required environment variables are set',
    missing: []
  }
} 