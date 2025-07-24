#!/usr/bin/env node

const fetch = require('node-fetch')
const chalk = require('chalk')

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testClaude() {
  console.log(chalk.bold.blue('\n🇧🇷 RachaAI - Teste de Integração Claude AI\n'))
  
  try {
    const response = await fetch(`${BASE_URL}/api/health/claude`)
    const data = await response.json()
    
    if (response.ok && data.status === 'success') {
      const overall = data.data.overall
      const connection = data.data.connection
      const routing = data.data.model_routing
      const localization = data.data.brazilian_localization
      const optimization = data.data.cost_optimization
      
      console.log(chalk.green('✅ Integração Claude AI funcionando!'))
      console.log(chalk.gray('─'.repeat(50)))
      
      // Status geral
      console.log(chalk.blue('📊 Status Geral:'))
      console.log(chalk.gray(`   Saudável: ${overall.healthy ? 'Sim' : 'Não'}`))
      console.log(chalk.gray(`   Otimização: ${overall.optimization}`))
      console.log(chalk.gray(`   Distribuição de modelos:`))
      console.log(chalk.gray(`     • Haiku: ${overall.models.haiku}`))
      console.log(chalk.gray(`     • Sonnet: ${overall.models.sonnet}`))
      console.log(chalk.gray(`     • Opus: ${overall.models.opus}`))
      
      // Conexão
      console.log(chalk.blue('\n🔗 Conexão:'))
      console.log(chalk.gray(`   Conectado: ${connection.connected ? 'Sim' : 'Não'}`))
      console.log(chalk.gray(`   Latência: ${connection.latency}ms`))
      console.log(chalk.gray(`   Otimização brasileira: ${connection.brazilianOptimization ? 'Ativa' : 'Inativa'}`))
      console.log(chalk.gray(`   Rastreamento de custos: ${connection.costTracking ? 'Ativo' : 'Inativo'}`))
      
      // Roteamento de modelos
      if (routing && routing.success) {
        console.log(chalk.blue('\n🤖 Roteamento de Modelos:'))
        console.log(chalk.gray(`   Consulta simples: ${routing.results.simple}`))
        console.log(chalk.gray(`   Consulta média: ${routing.results.medium}`))
        console.log(chalk.gray(`   Consulta complexa: ${routing.results.complex}`))
      }
      
      // Localização brasileira
      if (localization && localization.success) {
        console.log(chalk.blue('\n🇧🇷 Localização Brasileira:'))
        console.log(chalk.gray(`   Resposta em português: ${localization.checks.portugueseResponse ? 'Sim' : 'Não'}`))
        console.log(chalk.gray(`   Moeda brasileira: ${localization.checks.brazilianCurrency ? 'Sim' : 'Não'}`))
        console.log(chalk.gray(`   Formato de data BR: ${localization.checks.brazilianDateFormat ? 'Sim' : 'Não'}`))
        console.log(chalk.gray(`   Contexto cultural: ${localization.checks.culturalContext ? 'Sim' : 'Não'}`))
      }
      
      // Otimização de custos
      if (optimization && optimization.success) {
        console.log(chalk.blue('\n💰 Otimização de Custos:'))
        console.log(chalk.gray(`   Rastreamento ativo: ${optimization.optimization.costTracked ? 'Sim' : 'Não'}`))
        console.log(chalk.gray(`   Modelos utilizados: ${optimization.optimization.modelsUsed.join(', ')}`))
        console.log(chalk.gray(`   Custo mensal estimado: R$ ${(optimization.optimization.estimatedMonthlyCost / 100).toFixed(2)}`))
      }
      
    } else {
      console.log(chalk.red('❌ Falha na integração Claude AI'))
      console.log(chalk.gray(`   Erro: ${data.error || 'Desconhecido'}`))
    }
    
  } catch (error) {
    console.log(chalk.red('❌ Erro ao testar Claude AI'))
    console.log(chalk.gray(`   Erro: ${error.message}`))
  }
}

testClaude() 