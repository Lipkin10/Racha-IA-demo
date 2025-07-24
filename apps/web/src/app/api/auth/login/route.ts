import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = loginSchema.parse(body)
    
    const supabase = createClient()

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    })

    if (error) {
      console.error('Login error:', error)
      
      // Provide user-friendly error messages
      let errorMessage = 'Erro ao fazer login'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas de login. Tente novamente em alguns minutos.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Falha na autenticação' },
        { status: 400 }
      )
    }

    // Get user profile data
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Erro ao carregar perfil do usuário' },
        { status: 500 }
      )
    }

    // Update last active timestamp
    try {
      await supabase
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', data.user.id)
    } catch (error) {
      console.error('Last active update error:', error)
      // Don't fail login for this
    }

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: userProfile,
      session: data.session
    }, { status: 200 })

  } catch (error) {
    console.error('Login route error:', error)
    
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