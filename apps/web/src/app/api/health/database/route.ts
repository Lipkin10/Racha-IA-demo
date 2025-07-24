import { NextResponse } from 'next/server'
import { testDatabaseConnection, testLGPDCompliance, testBrazilianTimezone } from '@/utils/database-test'

export async function GET() {
  try {
    // Run all database and compliance tests
    const [
      databaseTest,
      lgpdTest,
      timezoneTest
    ] = await Promise.all([
      testDatabaseConnection(),
      testLGPDCompliance(),
      testBrazilianTimezone()
    ])

    const overall = {
      healthy: databaseTest.connected && lgpdTest.compliant && timezoneTest.correct,
      timestamp: new Date().toISOString(),
      region: 'sa-east-1',
      service: 'database'
    }

    return NextResponse.json({
      status: overall.healthy ? 'success' : 'error',
      data: {
        overall,
        database: databaseTest,
        lgpd: lgpdTest,
        timezone: timezoneTest
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Database health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 