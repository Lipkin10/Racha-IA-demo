import { createClient } from '@/utils/supabase/client'
import { SUPABASE_CONFIG, LGPD_SESSION_CONFIG } from '@/utils/supabase/client'
import type { User, UserRegistration, UserLogin, UserProfileUpdate } from '@/types/auth'

/**
 * Authentication service providing secure user management with LGPD compliance
 * Handles user registration, login, profile management, and account deletion
 */
export class AuthService {
  private supabase = createClient()

  // Configure Supabase Auth with LGPD compliance settings
  private getAuthConfig() {
    return {
      ...SUPABASE_CONFIG,
      ...LGPD_SESSION_CONFIG,
      auth: {
        ...SUPABASE_CONFIG.auth,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        debug: process.env.NODE_ENV === 'development'
      }
    }
  }

  /**
   * Register a new user with LGPD compliance
   */
  async signUp(userData: UserRegistration) {
    try {
      // First, create auth user
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          data: {
            name: userData.name,
            preferred_language: userData.preferred_language || 'pt-BR'
          }
        }
      })

      if (authError) {
        throw this.createAuthError(authError.message, 'signup')
      }

      // If auth user created successfully, create profile in users table
      if (authData.user) {
        const { error: profileError } = await this.supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            preferred_language: userData.preferred_language || 'pt-BR',
            payment_preferences: {},
            privacy_settings: userData.privacy_settings || {
              allowGroupMemory: true,
              dataRetentionDays: 90
            },
            consent_timestamp: new Date().toISOString()
          })

        if (profileError) {
          // Clean up auth user if profile creation failed
          try {
            await this.supabase.auth.admin.deleteUser(authData.user.id)
          } catch (cleanupError) {
            console.error('Failed to cleanup auth user after profile error:', cleanupError)
          }
          throw this.createAuthError(profileError.message, 'profile_creation')
        }

        // Create LGPD audit log entry
        await this.createAuditLogEntry(authData.user.id, 'consent_given', {
          ip_address: 'client-side',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
          consent_version: '1.0'
        })
      }

      return authData
    } catch (error) {
      console.error('Signup error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao criar conta. Tente novamente.')
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(credentials: UserLogin) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        throw this.createAuthError(error.message, 'signin')
      }

      // Update last_active_at
      if (data.user) {
        try {
        await this.supabase
          .from('users')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', data.user.id)
        } catch (updateError) {
          console.warn('Failed to update last_active_at:', updateError)
          // Don't fail login for this
        }
      }

      return data
    } catch (error) {
      console.error('Signin error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao fazer login. Verifique suas credenciais.')
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Signout error:', error)
      throw new Error('Erro ao sair da conta.')
    }
  }

  /**
   * Request password reset via email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      })

      if (error) {
        throw this.createAuthError(error.message, 'password_reset')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao enviar email de recuperação.')
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw this.createAuthError(error.message, 'password_update')
      }
    } catch (error) {
      console.error('Password update error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao atualizar senha.')
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(profileData: UserProfileUpdate) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('AUTH_ERROR:signin:Usuário não autenticado')

      const { error } = await this.supabase
        .from('users')
        .update({
          ...profileData,
          last_active_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        throw this.createAuthError(error.message, 'profile_update')
      }

      // Create audit log for profile update
      await this.createAuditLogEntry(user.id, 'profile_updated', {
        updated_fields: Object.keys(profileData),
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Profile update error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao atualizar perfil.')
    }
  }

  /**
   * Delete user account with LGPD compliance
   */
  async deleteAccount() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('AUTH_ERROR:signin:Usuário não autenticado')

      // Create LGPD audit log entry before deletion
      await this.createAuditLogEntry(user.id, 'data_deleted', {
        deletion_reason: 'user_request',
        deletion_timestamp: new Date().toISOString()
      })

      // Delete user data (RLS policies will handle user access)
      const { error: deleteError } = await this.supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (deleteError) {
        throw this.createAuthError(deleteError.message, 'account_deletion')
      }

      // Sign out user
      await this.signOut()
    } catch (error) {
      console.error('Account deletion error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao deletar conta.')
    }
  }

  /**
   * Get current authenticated user with profile data
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await this.supabase.auth.getUser()
      if (!authUser) return null

      const { data: userData, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Get current user error:', error)
        return null
      }

      return {
        ...userData,
        privacy_settings: userData.privacy_settings as { allowGroupMemory: boolean; dataRetentionDays: number }
      } as User
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  }

  /**
   * Refresh JWT session (handled automatically by Supabase)
   */
  async refreshSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.refreshSession()
      if (error) {
        throw this.createAuthError(error.message, 'session_refresh')
      }
      return session
    } catch (error) {
      console.error('Refresh session error:', error)
      if (error instanceof Error && error.message.startsWith('AUTH_ERROR:')) {
        throw error
      }
      throw new Error('Erro ao renovar sessão.')
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Create standardized auth errors with Brazilian Portuguese messages
   */
  private createAuthError(message: string, context: string): Error {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Email já está em uso',
      'Password should be at least 6 characters': 'Senha deve ter pelo menos 6 caracteres',
      'signup.password_too_short': 'Senha muito curta',
      'signup.email_address_invalid': 'Email inválido',
      'signup.email_address_not_authorized': 'Email não autorizado',
      'too_many_requests': 'Muitas tentativas. Tente novamente em alguns minutos.'
    }

    const userMessage = errorMap[message] || message
    return new Error(`AUTH_ERROR:${context}:${userMessage}`)
  }

  /**
   * Create LGPD audit log entries
   */
  private async createAuditLogEntry(
    userId: string, 
    action: 'consent_given' | 'consent_withdrawn' | 'data_exported' | 'data_deleted' | 'access_requested' | 'email_confirmed' | 'deletion_failed' | 'profile_updated' | 'password_reset_completed' | 'password_reset_requested', 
    details: any
  ) {
    try {
      await this.supabase
        .from('lgpd_audit_log')
        .insert({
          user_id: userId,
          action,
          metadata: details
        })
    } catch (error) {
      console.error('Audit log error:', error)
      // Don't throw here as this shouldn't block user operations
    }
  }
}

// Export singleton instance
export const authService = new AuthService() 