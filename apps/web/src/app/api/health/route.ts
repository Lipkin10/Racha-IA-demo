import { NextResponse } from 'next/server'
import { testDatabaseConnection, testLGPDCompliance, testBrazilianTimezone } from '@/utils/database-test'
import { testRedisConnection, testConversationCaching } from '@/utils/redis-test'
import { testClaudeConnection, testModelRouting } from '@/utils/claude-test'
import { validateEnvironment } from '@/config/environment'

export interface HealthCheckResult {
  service: string
  healthy: boolean
  latency?: number
  details?: any
  error?: string
}

export interface OverallHealth {
  healthy: boolean
  timestamp: string
  version: string
  environment: string
  region: string
  services: HealthCheckResult[]
  brazilian_optimization: {
    timezone: string
    currency: string
    locale: string
    lgpd_compliant: boolean
  }
}

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Validate environment first
    const envValid = validateEnvironment()
    if (!envValid) {
      return NextResponse.json({
        status: 'error',
        error: 'Environment configuration invalid',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Run all health checks in parallel for Brazilian performance optimization
    const [
      databaseResult,
      redisResult,
      claudeResult,
      lgpdResult,
      timezoneResult
    ] = await Promise.allSettled([
      // Database health
      testDatabaseConnection().then(result => ({
        service: 'database',
        healthy: result.connected,
        latency: result.latency,
        details: {
          region: result.region,
          version: result.version
        },
        error: result.error
      })),
      
      // Redis health
      testRedisConnection().then(result => ({
        service: 'redis',
        healthy: result.connected,
        latency: result.latency,
        details: {
          operations: result.operations
        },
        error: result.error
      })),
      
      // Claude AI health
      testClaudeConnection().then(result => ({
        service: 'claude-ai',
        healthy: result.connected,
        latency: result.latency,
        details: {
          model_routing: result.modelRouting,
          brazilian_optimization: result.brazilianOptimization,
          cost_tracking: result.costTracking
        },
        error: result.error
      })),
      
      // LGPD compliance check
      testLGPDCompliance().then(result => ({
        service: 'lgpd-compliance',
        healthy: result.compliant,
        details: {
          checks: result.checks,
          errors: result.errors
        }
      })),
      
      // Brazilian timezone check
      testBrazilianTimezone().then(result => ({
        service: 'brazilian-timezone',
        healthy: result.correct,
        details: {
          configured: result.configured,
          expected: result.expected,
          timestamp: result.timestamp
        }
      }))
    ])

    // Extract results from settled promises
    const services: HealthCheckResult[] = [
      databaseResult.status === 'fulfilled' ? databaseResult.value : {
        service: 'database',
        healthy: false,
        error: databaseResult.status === 'rejected' ? databaseResult.reason.message : 'Unknown error'
      },
      redisResult.status === 'fulfilled' ? redisResult.value : {
        service: 'redis',
        healthy: false,
        error: redisResult.status === 'rejected' ? redisResult.reason.message : 'Unknown error'
      },
      claudeResult.status === 'fulfilled' ? claudeResult.value : {
        service: 'claude-ai',
        healthy: false,
        error: claudeResult.status === 'rejected' ? claudeResult.reason.message : 'Unknown error'
      },
      lgpdResult.status === 'fulfilled' ? lgpdResult.value : {
        service: 'lgpd-compliance',
        healthy: false,
        error: lgpdResult.status === 'rejected' ? lgpdResult.reason.message : 'Unknown error'
      },
      timezoneResult.status === 'fulfilled' ? timezoneResult.value : {
        service: 'brazilian-timezone',
        healthy: false,
        error: timezoneResult.status === 'rejected' ? timezoneResult.reason.message : 'Unknown error'
      }
    ]

    // Calculate overall health
    const overallHealthy = services.every(service => service.healthy)
    const totalLatency = Date.now() - startTime

    const healthResponse: OverallHealth = {
      healthy: overallHealthy,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      region: 'sa-east-1', // Brazilian region
      services,
      brazilian_optimization: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        locale: 'pt-BR',
        lgpd_compliant: services.find(s => s.service === 'lgpd-compliance')?.healthy || false
      }
    }

    // Return appropriate status code
    const statusCode = overallHealthy ? 200 : 503

    return NextResponse.json({
      status: overallHealthy ? 'success' : 'degraded',
      data: healthResponse,
      latency_ms: totalLatency
    }, { status: statusCode })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - startTime
    }, { status: 500 })
  }
} 