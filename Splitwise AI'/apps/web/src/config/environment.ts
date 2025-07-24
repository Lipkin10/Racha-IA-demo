import { envConfigSchema } from '@racha-ai/shared/validation'

// Validate environment variables on startup
const env = envConfigSchema.parse(process.env)

export const config = {
  // Brazilian Configuration
  timezone: env.TIMEZONE,
  currency: env.CURRENCY,
  locale: env.LOCALE,
  
  // LGPD Compliance
  lgpd: {
    dataRetentionDays: env.DATA_RETENTION_DAYS,
    dpoEmail: env.DPO_EMAIL,
    privacyPolicyUrl: env.PRIVACY_POLICY_URL
  },
  
  // Database Configuration
  database: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    region: 'sa-east-1' // Brazilian region
  },
  
  // Redis Configuration
  redis: {
    url: env.REDIS_URL,
    keyPrefix: 'racha-ai:',
    defaultTtl: 60 * 60 // 1 hour
  },
  
  // Claude AI Configuration
  ai: {
    anthropicApiKey: env.ANTHROPIC_API_KEY,
    modelRouting: {
      enabled: true,
      defaultModel: 'haiku' as const,
      costOptimization: true
    }
  },
  
  // Application Configuration
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    name: 'RachaAI',
    version: '1.0.0',
    environment: env.NODE_ENV
  }
} as const

// Type-safe configuration access
export type AppConfig = typeof config

// Environment validation helper
export function validateEnvironment(): boolean {
  try {
    envConfigSchema.parse(process.env)
    return true
  } catch (error) {
    console.error('Environment validation failed:', error)
    return false
  }
}

// Brazilian-specific defaults
export const BRAZILIAN_DEFAULTS = {
  timezone: 'America/Sao_Paulo',
  locale: 'pt-BR',
  currency: 'BRL',
  country: 'BR'
} as const 