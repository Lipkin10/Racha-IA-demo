import { NextResponse } from 'next/server'
import { testSupabaseConnection, checkEnvironmentVariables } from '@/utils/supabase-connection-test'

export async function GET() {
  try {
    console.log('🚀 Starting Supabase connection diagnostic...')
    
    // Step 1: Check environment variables
    const envCheck = await checkEnvironmentVariables()
    console.log('📋 Environment check:', envCheck.message)
    
    // Step 2: Test database connection
    const connectionTest = await testSupabaseConnection()
    console.log('🔗 Connection test:', connectionTest.message)
    
    const overall = {
      healthy: envCheck.status === 'success' && connectionTest.status === 'success',
      timestamp: new Date().toISOString(),
      service: 'supabase'
    }
    
    return NextResponse.json({
      status: overall.healthy ? 'success' : 'error',
      data: {
        overall,
        environment: envCheck,
        connection: connectionTest
      }
    })
  } catch (error) {
    console.error('❌ Supabase diagnostic failed:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Supabase diagnostic failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 