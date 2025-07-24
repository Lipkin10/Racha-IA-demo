import { NextResponse } from 'next/server'
import { 
  testClaudeConnection, 
  testModelRouting, 
  testBrazilianLocalization, 
  testCostOptimization,
  testRateLimiting 
} from '@/utils/claude-test'

export async function GET() {
  try {
    // Run all Claude tests
    const [
      connectionTest,
      routingTest,
      localizationTest,
      optimizationTest,
      rateLimitTest
    ] = await Promise.all([
      testClaudeConnection(),
      testModelRouting(),
      testBrazilianLocalization(),
      testCostOptimization(),
      testRateLimiting()
    ])

    const overall = {
      healthy: connectionTest.connected && 
               routingTest.success && 
               localizationTest.success && 
               optimizationTest.success,
      timestamp: new Date().toISOString(),
      service: 'claude-ai',
      optimization: 'brazilian-cost-optimized',
      models: {
        haiku: '70% usage target',
        sonnet: '25% usage target', 
        opus: '5% usage target'
      }
    }

    return NextResponse.json({
      status: overall.healthy ? 'success' : 'error',
      data: {
        overall,
        connection: connectionTest,
        model_routing: routingTest,
        brazilian_localization: localizationTest,
        cost_optimization: optimizationTest,
        rate_limiting: rateLimitTest
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Claude AI health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 