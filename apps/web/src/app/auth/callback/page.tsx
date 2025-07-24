'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const supabase = createClient()
        
        // Get the code from URL params
        const code = searchParams?.get('code')
        const error = searchParams?.get('error')
        const errorDescription = searchParams?.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(errorDescription || 'Erro na autenticação')
          return
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setStatus('error')
            setMessage('Erro ao confirmar autenticação')
            return
          }

          if (data.session) {
            setStatus('success')
            setMessage('Autenticação confirmada com sucesso!')
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
        } else {
          // No code, redirect to login
          router.push('/auth/login')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Erro inesperado na autenticação')
        console.error('Auth callback error:', error)
      }
    }

    handleAuth()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
            <span>
              {status === 'loading' && 'Processando...'}
              {status === 'success' && 'Sucesso!'}
              {status === 'error' && 'Erro'}
            </span>
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        {status === 'error' && (
          <CardContent>
            <Button 
              onClick={() => router.push('/auth/login')} 
              className="w-full"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
} 