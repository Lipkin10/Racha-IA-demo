'use client'

import { useState, useEffect } from 'react'

interface HealthStatus {
  healthy: boolean
  services: Array<{
    service: string
    healthy: boolean
  }>
  brazilian_optimization: {
    timezone: string
    currency: string
    locale: string
    lgpd_compliant: boolean
  }
}

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          const data = await response.json()
          setHealthStatus(data.data)
        }
      } catch (error) {
        console.error('Health check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            RachaAI
          </h1>
          <p className="text-xl text-gray-600">
            Divisão inteligente de contas em grupo
          </p>
          <div className="text-sm text-gray-500">
            🇧🇷 Plataforma brasileira com IA otimizada para custos
          </div>
        </div>

        {/* Health Status Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Status do Sistema</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Verificando serviços...</span>
            </div>
          ) : healthStatus ? (
            <div className="space-y-4">
              <div className={`flex items-center justify-center p-3 rounded-lg ${
                healthStatus.healthy 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <span className="text-lg">
                  {healthStatus.healthy ? '✅' : '❌'} Sistema {healthStatus.healthy ? 'Operacional' : 'com Problemas'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {healthStatus.services.map((service) => (
                  <div key={service.service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium capitalize">
                      {service.service.replace('-', ' ')}
                    </span>
                    <span className={service.healthy ? 'text-green-600' : 'text-red-600'}>
                      {service.healthy ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Otimização Brasileira</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>Timezone: {healthStatus.brazilian_optimization.timezone}</div>
                  <div>Moeda: {healthStatus.brazilian_optimization.currency}</div>
                  <div>Locale: {healthStatus.brazilian_optimization.locale}</div>
                  <div>LGPD: {healthStatus.brazilian_optimization.lgpd_compliant ? 'Conforme' : 'Pendente'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">
              ❌ Não foi possível verificar o status do sistema
            </div>
          )}
        </div>

        {/* Development Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Informações de Desenvolvimento</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Frontend:</strong> Next.js 14 + TypeScript + Tailwind CSS
            </div>
            <div>
              <strong>Backend:</strong> Next.js API Routes + Supabase
            </div>
            <div>
              <strong>Cache:</strong> Redis (otimização de custos Claude)
            </div>
            <div>
              <strong>IA:</strong> Claude AI (70% Haiku, 25% Sonnet, 5% Opus)
            </div>
            <div>
              <strong>Região:</strong> AWS sa-east-1 (Brasil)
            </div>
            <div>
              <strong>Conformidade:</strong> LGPD + Timezone BR
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Endpoints de Health Check</h2>
          <div className="space-y-2 text-sm text-left">
            <div><code className="bg-gray-100 px-2 py-1 rounded">/api/health</code> - Status geral do sistema</div>
            <div><code className="bg-gray-100 px-2 py-1 rounded">/api/health/database</code> - Status do banco (Supabase)</div>
            <div><code className="bg-gray-100 px-2 py-1 rounded">/api/health/redis</code> - Status do cache (Redis)</div>
            <div><code className="bg-gray-100 px-2 py-1 rounded">/api/health/claude</code> - Status da IA (Claude)</div>
            <div><code className="bg-gray-100 px-2 py-1 rounded">/api/health/environment</code> - Configuração de ambiente</div>
          </div>
        </div>
      </div>
    </main>
  )
}
