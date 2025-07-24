import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export const createClient = () => createClientComponentClient<Database>()

// Brazilian timezone configuration
export const SUPABASE_CONFIG = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'racha-ai/1.0.0',
      'X-Timezone': 'America/Sao_Paulo',
      'X-Locale': 'pt-BR'
    }
  }
}

// LGPD-compliant session configuration
export const LGPD_SESSION_CONFIG = {
  cookieOptions: {
    name: 'sb-auth-token',
    lifetime: 60 * 60 * 24 * 7, // 7 days
    domain: process.env.NODE_ENV === 'production' ? '.rachaai.com.br' : undefined,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }
} 