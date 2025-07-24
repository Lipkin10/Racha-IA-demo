import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/auth/login?error=callback_error&message=${encodeURIComponent('Erro na confirmação. Tente fazer login novamente.')}`)
      }

      if (data.user) {
        // Update last active timestamp after successful confirmation
        try {
          await supabase
            .from('users')
            .update({ last_active_at: new Date().toISOString() })
            .eq('id', data.user.id)
        } catch (error) {
          console.error('Last active update error:', error)
          // Don't fail callback for this
        }

        // Create audit log for successful email confirmation
        try {
          await supabase
            .from('lgpd_audit_log')
            .insert({
              user_id: data.user.id,
              action: 'email_confirmed',
              details: {
                confirmation_timestamp: new Date().toISOString(),
                ip_address: request.ip || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown'
              }
            })
        } catch (error) {
          console.error('LGPD audit log error:', error)
          // Don't fail callback for audit log issues
        }
      }

      // Redirect to dashboard or specified next page
      return NextResponse.redirect(`${origin}${next}`)
      
    } catch (error) {
      console.error('Callback processing error:', error)
      return NextResponse.redirect(`${origin}/auth/login?error=callback_error&message=${encodeURIComponent('Erro inesperado na confirmação.')}`)
    }
  }

  // No code parameter - might be a direct access
  return NextResponse.redirect(`${origin}/auth/login?error=missing_code&message=${encodeURIComponent('Link de confirmação inválido.')}`)
} 