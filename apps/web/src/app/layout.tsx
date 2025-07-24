import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RachaAI - Divisão Inteligente de Contas',
  description: 'Plataforma brasileira de divisão de despesas em grupo com IA',
  keywords: ['divisão de contas', 'despesas', 'grupo', 'IA', 'brasil'],
  authors: [{ name: 'RachaAI Team' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rachaai.com.br'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
