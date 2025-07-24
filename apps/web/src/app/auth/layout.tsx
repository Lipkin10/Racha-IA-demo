import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticação | RachaAI',
  description: 'Entre ou crie sua conta no RachaAI para dividir contas de forma inteligente'
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {children}
    </div>
  )
} 