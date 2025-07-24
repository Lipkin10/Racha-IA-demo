'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, initializeAuth } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, Calculator, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    // Initialize auth on app start
    initializeAuth()
  }, [])

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Redirecionando para o dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RachaAI</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Criar Conta</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Divida contas de forma{' '}
            <span className="text-primary">inteligente</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            RachaAI usa inteligência artificial para dividir despesas em grupo de forma justa e transparente. 
            Criado especialmente para o mercado brasileiro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Grupos Inteligentes</CardTitle>
              <CardDescription>
                Crie grupos e adicione despesas com divisão automática baseada em IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Divisão automática por IA</li>
                <li>• Múltiplos métodos de divisão</li>
                <li>• Histórico completo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Cálculos Precisos</CardTitle>
              <CardDescription>
                Algoritmos avançados garantem divisões justas e precisas em Real (R$)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Suporte nativo ao Real (R$)</li>
                <li>• Arredondamentos inteligentes</li>
                <li>• Relatórios detalhados</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Privacidade LGPD</CardTitle>
              <CardDescription>
                100% compatível com a Lei Geral de Proteção de Dados brasileira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dados hospedados no Brasil</li>
                <li>• Consentimento explícito</li>
                <li>• Exclusão automática</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24 p-8 bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para dividir contas de forma inteligente?
          </h2>
          <p className="text-muted-foreground mb-6">
            Junte-se a milhares de brasileiros que já usam o RachaAI
          </p>
          <Link href="/auth/register">
            <Button size="lg">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="font-semibold">RachaAI</span>
              <span className="text-sm text-muted-foreground">
                © 2024 - Feito no Brasil 🇧🇷
              </span>
            </div>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacidade
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
