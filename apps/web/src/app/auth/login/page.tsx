'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  
  const redirectTo = searchParams?.get('redirectTo') || '/dashboard'

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  const handleLoginSuccess = () => {
    router.push(redirectTo)
  }

  if (user) {
    return <div>Redirecionando...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm 
        redirectTo={redirectTo}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
} 