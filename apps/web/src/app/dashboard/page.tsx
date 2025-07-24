'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut, loading } = useAuthStore()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Redirecionando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, {user.name}!</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Idioma:</strong> {user.preferred_language}</p>
                <p><strong>Membro desde:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grupos</CardTitle>
              <CardDescription>Seus grupos de divisão</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nenhum grupo criado ainda. Funcionalidade será implementada na próxima versão.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas</CardTitle>
              <CardDescription>Suas despesas recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nenhuma despesa registrada ainda. Funcionalidade será implementada na próxima versão.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Privacidade & LGPD</CardTitle>
            <CardDescription>Configurações de privacidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Memória de grupo:</strong> {user.privacy_settings.allowGroupMemory ? 'Habilitada' : 'Desabilitada'}
              </p>
              <p>
                <strong>Retenção de dados:</strong> {user.privacy_settings.dataRetentionDays} dias
              </p>
              <p>
                <strong>Consentimento LGPD:</strong> {new Date(user.consent_timestamp).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-xs text-muted-foreground">
                Seus dados serão automaticamente removidos conforme configuração de retenção.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 