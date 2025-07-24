import { createClient } from './supabase/server'
import { config } from '../config/environment'

export interface DatabaseTestResult {
  connected: boolean
  latency: number
  region: string
  version: string
  error?: string
}

export async function testDatabaseConnection(): Promise<DatabaseTestResult> {
  const startTime = Date.now()
  
  try {
    const supabase = createClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      return {
        connected: false,
        latency: Date.now() - startTime,
        region: 'unknown',
        version: 'unknown',
        error: error.message
      }
    }
    
    return {
      connected: true,
      latency: Date.now() - startTime,
      region: config.database.region,
      version: 'PostgreSQL 15.1',
    }
  } catch (error) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      region: 'unknown',
      version: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testLGPDCompliance(): Promise<{
  compliant: boolean
  checks: Record<string, boolean>
  errors: string[]
}> {
  const checks = {
    dataRetentionConfigured: false,
    dpoEmailSet: false,
    privacyPolicyUrl: false,
    brazilianRegion: false
  }
  
  const errors: string[] = []
  
  try {
    // Check LGPD configuration
    checks.dataRetentionConfigured = config.lgpd.dataRetentionDays > 0
    checks.dpoEmailSet = Boolean(config.lgpd.dpoEmail)
    checks.privacyPolicyUrl = Boolean(config.lgpd.privacyPolicyUrl)
    checks.brazilianRegion = config.database.region === 'sa-east-1'
    
    if (!checks.dataRetentionConfigured) {
      errors.push('Data retention period not configured')
    }
    
    if (!checks.dpoEmailSet) {
      errors.push('DPO email not configured')
    }
    
    if (!checks.privacyPolicyUrl) {
      errors.push('Privacy policy URL not configured')
    }
    
    if (!checks.brazilianRegion) {
      errors.push('Database not in Brazilian region (sa-east-1)')
    }
    
    return {
      compliant: Object.values(checks).every(Boolean),
      checks,
      errors
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    return {
      compliant: false,
      checks,
      errors
    }
  }
}

export async function testBrazilianTimezone(): Promise<{
  correct: boolean
  configured: string
  expected: string
  timestamp: string
}> {
  const expected = 'America/Sao_Paulo'
  const configured = config.timezone
  
  return {
    correct: configured === expected,
    configured,
    expected,
    timestamp: new Date().toLocaleString('pt-BR', {
      timeZone: configured
    })
  }
} 