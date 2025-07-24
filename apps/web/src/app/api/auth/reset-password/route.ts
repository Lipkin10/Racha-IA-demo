import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

// Password reset request validation schema
const resetRequestSchema = z.object({
  email: z.string().email('Email inválido')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = resetRequestSchema.parse(body)
    
    const supabase = createClient()

    // Check if user exists (for security, we don't reveal if email exists)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', validatedData.email)
      .single()

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (existingUser) {
      const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`
      })

      if (error) {
        console.error('Password reset email error:', error)
        // Still return success to prevent enumeration
      } else {
        // Create audit log for password reset request
        try {
          await supabase
            .from('lgpd_audit_log')
            .insert({
              user_id: existingUser.id,
              action: 'password_reset_requested',
              details: {
                email: validatedData.email,
                ip_address: request.ip || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown',
                request_timestamp: new Date().toISOString()
              }
            })
        } catch (error) {
          console.error('LGPD audit log error:', error)
          // Don't fail reset for audit log issues
        }
      }
    }

    // Always return the same response regardless of whether user exists
    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('Password reset request error:', error)
    
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message
        return acc
      }, {} as Record<string, string>)
      
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          field_errors: fieldErrors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 