'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const resetSchema = z.object({
  email: z.string().email('Email inválido')
})

type ResetFormData = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const { resetPassword, loading, error, setError } = useAuthStore()
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data: ResetFormData) => {
    try {
      setError(null)
      await resetPassword(data.email)
      setEmailSent(true)
    } catch (error) {
      console.error('Reset password error:', error)
    }
  }

  const isLoading = loading || isSubmitting

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email Enviado!
            </CardTitle>
            <CardDescription>
              Enviamos um link de recuperação para <strong>{getValues('email')}</strong>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Verifique sua caixa de entrada e spam. O link é válido por 1 hora.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Enviar novamente
            </Button>
            
            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-primary hover:underline flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar ao login</span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Digite seu email para receber um link de recuperação
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-primary hover:underline flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar ao login</span>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 