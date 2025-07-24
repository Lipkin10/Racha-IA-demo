import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Brazilian region configuration for server operations
export const SUPABASE_SERVER_CONFIG = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'racha-ai-server/1.0.0',
      'X-Timezone': 'America/Sao_Paulo',
      'X-Region': 'sa-east-1'
    }
  }
} 