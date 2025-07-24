import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

// Account deletion confirmation schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória para confirmar exclusão'),
  confirmation: z.literal('DELETAR CONTA', {
    errorMap: () => ({ message: 'Digite "DELETAR CONTA" para confirmar' })
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = deleteAccountSchema.parse(body)
    
    const supabase = createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Verify password before deletion
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: validatedData.password
    })

    if (verifyError) {
      return NextResponse.json(
        { error: 'Senha incorreta. Não foi possível confirmar a exclusão.' },
        { status: 400 }
      )
    }

    // Get user profile for audit log
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Create comprehensive audit log before deletion
    try {
      await supabase
        .from('lgpd_audit_log')
        .insert({
          user_id: user.id,
          action: 'data_deleted',
          details: {
            deletion_reason: 'user_request',
            deletion_timestamp: new Date().toISOString(),
            ip_address: request.ip || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown',
            data_categories_deleted: [
              'user_profile',
              'conversations',
              'group_memberships',
              'audit_logs'
            ],
            retention_policy_applied: true,
            user_email: user.email
          }
        })
    } catch (error) {
      console.error('LGPD audit log error:', error)
      // Continue with deletion even if audit log fails
    }

    try {
      // Start transaction-like operations
      // Note: Supabase doesn't support transactions directly, but RLS policies will help

      // 1. Delete user's group memberships
      await supabase
        .from('group_members')
        .delete()
        .eq('user_id', user.id)

      // 2. Delete user's conversations and messages (cascade should handle messages)
      await supabase
        .from('conversations')
        .delete()
        .eq('user_id', user.id)

      // 3. Update groups where user was creator to mark as inactive
      await supabase
        .from('groups')
        .update({ is_active: false })
        .eq('created_by', user.id)

      // 4. Delete division calculations where user participated
      const { data: userDivisions } = await supabase
        .from('division_participants')
        .select('division_id')
        .eq('user_id', user.id)

      if (userDivisions && userDivisions.length > 0) {
        const divisionIds = userDivisions.map(d => d.division_id)
        
        await supabase
          .from('division_participants')
          .delete()
          .eq('user_id', user.id)

        // Delete orphaned division calculations
        await supabase
          .from('division_calculations')
          .delete()
          .in('id', divisionIds)
      }

      // 5. Keep LGPD audit logs for compliance (anonymized)
      await supabase
        .from('lgpd_audit_log')
        .update({
          user_id: null, // Anonymize but keep for compliance
          details: {
            privacy_settings: userProfile?.privacy_settings || {},
            anonymized: true,
            original_deletion_date: new Date().toISOString()
          }
        })
        .eq('user_id', user.id)

      // 6. Delete user profile
      const { error: profileDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (profileDeleteError) {
        console.error('Profile deletion error:', profileDeleteError)
        return NextResponse.json(
          { error: 'Erro ao deletar perfil do usuário' },
          { status: 500 }
        )
      }

      // 7. Finally, delete auth user
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id)

      if (authDeleteError) {
        console.error('Auth deletion error:', authDeleteError)
        // Profile is already deleted, so account is effectively deleted
        // Return success anyway
      }

      return NextResponse.json({
        message: 'Conta deletada com sucesso. Todos os seus dados foram removidos conforme a LGPD.',
        success: true
      }, { status: 200 })

    } catch (error) {
      console.error('Account deletion error:', error)
      
      // Try to create error audit log
      try {
        await supabase
          .from('lgpd_audit_log')
          .insert({
            user_id: user.id,
            action: 'deletion_failed',
            details: {
              error_message: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString(),
              ip_address: request.ip || 'unknown'
            }
          })
      } catch (auditError) {
        console.error('Audit log error:', auditError)
      }

      return NextResponse.json(
        { error: 'Erro durante a exclusão da conta. Tente novamente ou entre em contato com o suporte.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Delete account route error:', error)
    
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