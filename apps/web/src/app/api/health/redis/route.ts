import { NextResponse } from 'next/server'
import { testRedisConnection, testConversationCaching, testClaudeCostTracking, testBrazilianRateLimit } from '@/utils/redis-test'

export async function GET() {
  try {
    // Run all Redis tests
    const [
      connectionTest,
      cachingTest,
      costTrackingTest,
      rateLimitTest
    ] = await Promise.all([
      testRedisConnection(),
      testConversationCaching(),
      testClaudeCostTracking(),
      testBrazilianRateLimit()
    ])

    const overall = {
      healthy: connectionTest.connected && 
               cachingTest.success && 
               costTrackingTest.success && 
               rateLimitTest.success,
      timestamp: new Date().toISOString(),
      service: 'redis',
      optimization: 'claude-cost-reduction'
    }

    return NextResponse.json({
      status: overall.healthy ? 'success' : 'error',
      data: {
        overall,
        connection: connectionTest,
        conversation_caching: cachingTest,
        cost_tracking: costTrackingTest,
        rate_limiting: rateLimitTest
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Redis health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 