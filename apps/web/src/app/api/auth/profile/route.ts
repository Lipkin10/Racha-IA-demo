import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/, 'Nome contém caracteres inválidos')
    .optional(),
  preferred_language: z.enum(['pt-BR', 'en-US', 'es-ES']).optional(),
  privacy_settings: z.object({
    allowGroupMemory: z.boolean(),
    dataRetentionDays: z.number().int().min(30).max(365)
  }).optional()
})

// GET - Fetch current user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Erro ao carregar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: profile
    }, { status: 200 })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = profileUpdateSchema.parse(body)
    
    // Check if there's actually data to update
    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum dado fornecido para atualização' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Prepare update data
    const updateData = {
      ...validatedData,
      last_active_at: new Date().toISOString()
    }

    // Update user profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      
      let errorMessage = 'Erro ao atualizar perfil'
      
      if (updateError.message.includes('duplicate key')) {
        errorMessage = 'Dados já existem no sistema'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Create audit log for profile update
    try {
      await supabase
        .from('lgpd_audit_log')
        .insert({
          user_id: user.id,
          action: 'profile_updated',
          details: {
            updated_fields: Object.keys(validatedData),
            update_timestamp: new Date().toISOString(),
            ip_address: request.ip || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown'
          }
        })
    } catch (error) {
      console.error('LGPD audit log error:', error)
      // Don't fail profile update for audit log issues
    }

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedProfile
    }, { status: 200 })

  } catch (error) {
    console.error('Profile update error:', error)
    
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path.join('.')] = curr.message
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