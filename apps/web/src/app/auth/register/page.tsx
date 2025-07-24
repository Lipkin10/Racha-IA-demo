'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { RegistrationForm } from '@/components/auth/RegistrationForm'

export default function RegisterPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleRegistrationSuccess = () => {
    // After successful registration, redirect to login with success message
    router.push('/auth/login?message=registration-success')
  }

  if (user) {
    return <div>Redirecionando...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <RegistrationForm onSuccess={handleRegistrationSuccess} />
    </div>
  )
} 