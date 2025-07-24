import { NextResponse } from 'next/server'
import { setupDatabase } from '@/utils/database-setup'

export async function POST() {
  try {
    console.log('🔧 Admin: Database setup requested')
    
    // Run database schema setup
    await setupDatabase()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database schema setup completed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Admin database setup error:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Database setup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 