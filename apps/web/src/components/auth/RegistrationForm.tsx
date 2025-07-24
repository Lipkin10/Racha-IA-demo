'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react'
import Link from 'next/link'

// Brazilian registration validation schema
const registrationSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z.string(),
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/, 'Nome contém caracteres inválidos'),
  preferred_language: z.string().default('pt-BR'),
  dataRetentionDays: z.number().int().min(30).max(365).default(90),
  allowGroupMemory: z.boolean().default(true),
  lgpd_consent: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de privacidade para continuar'
  }),
  terms_consent: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso para continuar'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface RegistrationFormProps {
  onSuccess?: () => void
}

const languageOptions = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' }
]

const retentionOptions = [
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias (recomendado)' },
  { value: 180, label: '180 dias' },
  { value: 365, label: '1 ano' }
]

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp, loading, error, setError } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      preferred_language: 'pt-BR',
      dataRetentionDays: 90,
      allowGroupMemory: true,
      lgpd_consent: false,
      terms_consent: false
    },
    mode: 'onBlur'
  })

  const watchedLanguage = watch('preferred_language')
  const watchedRetention = watch('dataRetentionDays')
  const watchedGroupMemory = watch('allowGroupMemory')
  const watchedLgpdConsent = watch('lgpd_consent')
  const watchedTermsConsent = watch('terms_consent')

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setError(null)
      
      const registrationData = {
        email: data.email,
        password: data.password,
        name: data.name,
        preferred_language: data.preferred_language,
        privacy_settings: {
          allowGroupMemory: data.allowGroupMemory,
          dataRetentionDays: data.dataRetentionDays
        },
        lgpd_consent: data.lgpd_consent
      }

      await signUp(registrationData)
      onSuccess?.()
      
    } catch (error) {
      // Error is already set in the store
      console.error('Registration form error:', error)
    }
  }

  const isLoading = loading || isSubmitting

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Criar sua conta
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Junte-se ao RachaAI e divida contas de forma inteligente
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                disabled={isLoading}
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha forte"
                className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                disabled={isLoading}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Digite a senha novamente"
                className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                disabled={isLoading}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Language Preference */}
          <div className="space-y-2">
            <Label htmlFor="preferred_language">Idioma preferido</Label>
            <Select
              value={watchedLanguage}
              onValueChange={(value) => setValue('preferred_language', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu idioma" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Configurações de Privacidade</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRetentionDays">Retenção de dados</Label>
              <Select
                value={watchedRetention.toString()}
                onValueChange={(value) => setValue('dataRetentionDays', parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  {retentionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Seus dados serão automaticamente excluídos após este período
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowGroupMemory"
                checked={watchedGroupMemory}
                onCheckedChange={(checked) => setValue('allowGroupMemory', checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="allowGroupMemory" className="text-sm">
                Permitir que a IA lembre das preferências do grupo para melhorar sugestões
              </Label>
            </div>
          </div>

          {/* LGPD Consent */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="lgpd_consent"
                checked={watchedLgpdConsent}
                onCheckedChange={(checked) => setValue('lgpd_consent', checked as boolean)}
                disabled={isLoading}
                className={errors.lgpd_consent ? 'border-destructive' : ''}
              />
              <Label htmlFor="lgpd_consent" className="text-sm leading-5">
                Eu aceito a{' '}
                <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                  Política de Privacidade
                </Link>{' '}
                e autorizo o tratamento dos meus dados pessoais conforme a LGPD
              </Label>
            </div>
            {errors.lgpd_consent && (
              <p className="text-sm text-destructive">{errors.lgpd_consent.message}</p>
            )}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms_consent"
                checked={watchedTermsConsent}
                onCheckedChange={(checked) => setValue('terms_consent', checked as boolean)}
                disabled={isLoading}
                className={errors.terms_consent ? 'border-destructive' : ''}
              />
              <Label htmlFor="terms_consent" className="text-sm leading-5">
                Eu aceito os{' '}
                <Link href="/terms" className="text-primary hover:underline" target="_blank">
                  Termos de Uso
                </Link>{' '}
                do RachaAI
              </Label>
            </div>
            {errors.terms_consent && (
              <p className="text-sm text-destructive">{errors.terms_consent.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !watchedLgpdConsent || !watchedTermsConsent}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta gratuita'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link 
              href="/auth/login" 
              className="text-primary hover:underline font-medium"
            >
              Fazer login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 