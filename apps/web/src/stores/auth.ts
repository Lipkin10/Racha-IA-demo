import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth'
import type { AuthStore, User, UserRegistration, UserLogin, UserProfileUpdate } from '@/types/auth'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      loading: false,
      error: null,

      // Actions
      signUp: async (data: UserRegistration) => {
        set({ loading: true, error: null })
        try {
          const result = await authService.signUp(data)
          // Don't set user immediately for email confirmation flow
          set({ loading: false })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao criar conta' 
          })
          throw error
        }
      },

      signIn: async (data: UserLogin) => {
        set({ loading: true, error: null })
        try {
          const result = await authService.signIn(data)
          const user = await authService.getCurrentUser()
          
          set({ 
            user, 
            session: result.session, 
            loading: false, 
            error: null 
          })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao fazer login' 
          })
          throw error
        }
      },

      signOut: async () => {
        set({ loading: true, error: null })
        try {
          await authService.signOut()
          set({ 
            user: null, 
            session: null, 
            loading: false, 
            error: null 
          })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao sair' 
          })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true, error: null })
        try {
          await authService.resetPassword(email)
          set({ loading: false, error: null })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao enviar email' 
          })
          throw error
        }
      },

      updateProfile: async (data: UserProfileUpdate) => {
        set({ loading: true, error: null })
        try {
          await authService.updateProfile(data)
          
          // Optimistic update
          const currentUser = get().user
          if (currentUser) {
            set({ 
              user: { ...currentUser, ...data },
              loading: false,
              error: null
            })
          }
          
          // Fetch latest user data
          const updatedUser = await authService.getCurrentUser()
          set({ user: updatedUser })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao atualizar perfil' 
          })
          throw error
        }
      },

      deleteAccount: async () => {
        set({ loading: true, error: null })
        try {
          await authService.deleteAccount()
          set({ 
            user: null, 
            session: null, 
            loading: false, 
            error: null 
          })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao deletar conta' 
          })
          throw error
        }
      },

      // Direct state setters
      setUser: (user: User | null) => set({ user }),
      setSession: (session: any | null) => set({ session }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      }),
      version: 1,
    }
  )
)

// Authentication initialization hook
export const initializeAuth = async () => {
  const { setUser, setSession, setLoading } = useAuthStore.getState()
  
  setLoading(true)
  
  try {
    // Get current session
    const session = await authService.getSession()
    
    if (session) {
      // Get user profile data
      const user = await authService.getCurrentUser()
      setUser(user)
      setSession(session)
    } else {
      setUser(null)
      setSession(null)
    }
  } catch (error) {
    console.error('Auth initialization error:', error)
    setUser(null)
    setSession(null)
  } finally {
    setLoading(false)
  }
}

// Auth state change listener
export const setupAuthListener = () => {
  const { setUser, setSession } = useAuthStore.getState()
  
  return authService.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const user = await authService.getCurrentUser()
      setUser(user)
      setSession(session)
    } else if (event === 'SIGNED_OUT') {
      setUser(null)
      setSession(null)
    } else if (event === 'TOKEN_REFRESHED' && session) {
      setSession(session)
    }
  })
} 