import { NextResponse } from 'next/server'
import { config, validateEnvironment, BRAZILIAN_DEFAULTS } from '@/config/environment'

export async function GET() {
  try {
    const isValid = validateEnvironment()
    
    const environmentInfo = {
      valid: isValid,
      timestamp: new Date().toISOString(),
      config: {
        timezone: config.timezone,
        currency: config.currency,
        locale: config.locale,
        environment: config.app.environment,
        region: config.database.region
      },
      brazilian_defaults: BRAZILIAN_DEFAULTS,
      lgpd: {
        data_retention_days: config.lgpd.dataRetentionDays,
        dpo_email_configured: Boolean(config.lgpd.dpoEmail),
        privacy_policy_configured: Boolean(config.lgpd.privacyPolicyUrl)
      },
      services: {
        database_configured: Boolean(config.database.url && config.database.anonKey),
        redis_configured: Boolean(config.redis.url),
        claude_configured: Boolean(config.ai.anthropicApiKey),
        app_url_configured: Boolean(config.app.url)
      },
      development: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        memory_usage: process.memoryUsage(),
        uptime: process.uptime()
      }
    }

    return NextResponse.json({
      status: isValid ? 'success' : 'error',
      data: environmentInfo
    }, { 
      status: isValid ? 200 : 400 
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Environment check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 