import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { BRAZILIAN_DEFAULTS } from '@/config/environment'

// Brazilian registration validation schema
const registrationSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número'),
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/, 'Nome contém caracteres inválidos'),
  preferred_language: z.string().default('pt-BR'),
  privacy_settings: z.object({
    allowGroupMemory: z.boolean().default(true),
    dataRetentionDays: z.number().int().min(30).max(365).default(90)
  }).default({
    allowGroupMemory: true,
    dataRetentionDays: 90
  }),
  lgpd_consent: z.boolean().refine(val => val === true, {
    message: 'Consentimento LGPD é obrigatório'
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = registrationSchema.parse(body)
    
    const supabase = createClient()

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso', field: 'email' },
        { status: 400 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name: validatedData.name,
          preferred_language: validatedData.preferred_language
        }
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json(
        { 
          error: authError.message === 'User already registered' 
            ? 'Email já está em uso' 
            : 'Erro ao criar conta de autenticação',
          field: 'email'
        },
        { status: 400 }
      )
    }

    // Create user profile if auth user created successfully
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: validatedData.email,
          name: validatedData.name,
          preferred_language: validatedData.preferred_language,
          payment_preferences: {},
          privacy_settings: validatedData.privacy_settings,
          consent_timestamp: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        
        // Try to clean up auth user if profile creation failed
        await supabase.auth.admin.deleteUser(authData.user.id)
        
        return NextResponse.json(
          { error: 'Erro ao criar perfil do usuário' },
          { status: 500 }
        )
      }

      // Create LGPD audit log entry
      try {
        await supabase
          .from('lgpd_audit_log')
          .insert({
            user_id: authData.user.id,
            action: 'consent_given',
            details: {
              ip_address: request.ip || 'unknown',
              user_agent: request.headers.get('user-agent') || 'unknown',
              consent_version: '1.0',
              privacy_settings: validatedData.privacy_settings
            }
          })
      } catch (error) {
        console.error('LGPD audit log error:', error)
        // Don't fail registration for audit log issues
      }
    }

    return NextResponse.json({
      message: 'Conta criada com sucesso! Verifique seu email para confirmar a conta.',
      user: {
        id: authData.user?.id,
        email: validatedData.email,
        name: validatedData.name
      },
      requires_verification: !authData.session // true if email confirmation required
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
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