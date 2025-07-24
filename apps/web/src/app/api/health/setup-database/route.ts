import { NextResponse } from 'next/server'
import { setupDatabaseDirect } from '@/utils/database-setup'

export async function POST() {
  try {
    console.log('🔧 Health Check: Database setup requested')
    
    // Set up the database schema
    const result = await setupDatabaseDirect()
    
    if (!result.success) {
      return NextResponse.json({
        status: 'error',
        error: result.message,
        details: result.details,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'success',
      message: result.message,
      data: result.details,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Database setup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Also allow GET for easy browser testing
export async function GET() {
  return NextResponse.json({
    message: 'Database setup endpoint. Use POST to execute setup.',
    endpoints: {
      'POST /api/health/setup-database': 'Execute database schema setup'
    }
  })
} 