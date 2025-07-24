export interface User {
  id: string
  email: string
  name: string
  preferred_language: string
  payment_preferences: Record<string, any>
  privacy_settings: {
    allowGroupMemory: boolean
    dataRetentionDays: number
  }
  created_at: string
  last_active_at: string
  consent_timestamp: string
  data_retention_date: string
}

export interface UserRegistration {
  email: string
  password: string
  name: string
  preferred_language?: string
  privacy_settings?: {
    allowGroupMemory: boolean
    dataRetentionDays: number
  }
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserProfileUpdate {
  name?: string
  preferred_language?: string
  privacy_settings?: {
    allowGroupMemory: boolean
    dataRetentionDays: number
  }
}

export interface PasswordReset {
  email: string
}

export interface PasswordResetConfirm {
  password: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
}

export interface AuthActions {
  signUp: (data: UserRegistration) => Promise<void>
  signIn: (data: UserLogin) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: UserProfileUpdate) => Promise<void>
  deleteAccount: () => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type AuthStore = AuthState & AuthActions 