import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

// Password reset confirmation validation schema
const resetConfirmSchema = z.object({
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = resetConfirmSchema.parse(body)
    
    const supabase = createClient()

    // Get current user from session (should be authenticated via reset token)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada. Solicite um novo link de redefinição.' },
        { status: 401 }
      )
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.password
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      
      let errorMessage = 'Erro ao atualizar senha'
      
      if (updateError.message.includes('same as the old password')) {
        errorMessage = 'A nova senha deve ser diferente da senha atual'
      } else if (updateError.message.includes('Password should be')) {
        errorMessage = 'Senha não atende aos requisitos de segurança'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Update last active timestamp
    try {
      await supabase
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', user.id)
    } catch (error) {
      console.error('Last active update error:', error)
      // Don't fail password reset for this
    }

    // Create audit log for successful password reset
    try {
      await supabase
        .from('lgpd_audit_log')
        .insert({
          user_id: user.id,
          action: 'password_reset_completed',
          details: {
            completion_timestamp: new Date().toISOString(),
            ip_address: request.ip || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown'
          }
        })
    } catch (error) {
      console.error('LGPD audit log error:', error)
      // Don't fail password reset for audit log issues
    }

    return NextResponse.json({
      message: 'Senha redefinida com sucesso! Você pode fazer login com sua nova senha.',
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('Password reset confirmation error:', error)
    
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