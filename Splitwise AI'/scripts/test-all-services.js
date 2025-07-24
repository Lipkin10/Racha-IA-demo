#!/usr/bin/env node

const fetch = require('node-fetch')
const chalk = require('chalk')

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const ENDPOINTS = {
  'Sistema Geral': '/api/health',
  'Banco de Dados (Supabase)': '/api/health/database', 
  'Cache (Redis)': '/api/health/redis',
  'IA (Claude)': '/api/health/claude',
  'Configuração de Ambiente': '/api/health/environment'
}

async function testEndpoint(name, endpoint) {
  try {
    const startTime = Date.now()
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const latency = Date.now() - startTime
    const data = await response.json()
    
    if (response.ok && data.status === 'success') {
      console.log(chalk.green(`✅ ${name}: OK (${latency}ms)`))
      return { success: true, latency, data }
    } else {
      console.log(chalk.red(`❌ ${name}: ERRO`))
      console.log(chalk.gray(`   Status: ${response.status}`))
      console.log(chalk.gray(`   Erro: ${data.error || 'Desconhecido'}`))
      return { success: false, latency, error: data.error }
    }
  } catch (error) {
    console.log(chalk.red(`❌ ${name}: FALHA DE CONEXÃO`))
    console.log(chalk.gray(`   Erro: ${error.message}`))
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log(chalk.bold.blue('\n🇧🇷 RachaAI - Teste de Saúde dos Serviços\n'))
  console.log(chalk.gray(`Base URL: ${BASE_URL}\n`))

  const results = {}
  let totalLatency = 0
  let successCount = 0

  for (const [name, endpoint] of Object.entries(ENDPOINTS)) {
    const result = await testEndpoint(name, endpoint)
    results[name] = result
    
    if (result.success) {
      successCount++
      totalLatency += result.latency || 0
    }
    
    // Pequena pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const totalTests = Object.keys(ENDPOINTS).length
  const averageLatency = successCount > 0 ? Math.round(totalLatency / successCount) : 0

  console.log(chalk.bold('\n📊 Resumo dos Testes:'))
  console.log(chalk.gray('─'.repeat(50)))
  
  if (successCount === totalTests) {
    console.log(chalk.green(`✅ Todos os ${totalTests} serviços estão funcionando!`))
    console.log(chalk.gray(`📈 Latência média: ${averageLatency}ms`))
    
    // Mostrar informações específicas do Brasil
    const healthData = results['Sistema Geral']?.data?.data
    if (healthData?.brazilian_optimization) {
      console.log(chalk.blue('\n🇧🇷 Otimização Brasileira:'))
      console.log(chalk.gray(`   Timezone: ${healthData.brazilian_optimization.timezone}`))
      console.log(chalk.gray(`   Moeda: ${healthData.brazilian_optimization.currency}`))
      console.log(chalk.gray(`   Locale: ${healthData.brazilian_optimization.locale}`))
      console.log(chalk.gray(`   LGPD: ${healthData.brazilian_optimization.lgpd_compliant ? 'Conforme' : 'Pendente'}`))
    }
    
    process.exit(0)
  } else {
    console.log(chalk.red(`❌ ${totalTests - successCount} de ${totalTests} serviços com problemas`))
    console.log(chalk.yellow('🔧 Verifique as configurações e tente novamente'))
    process.exit(1)
  }
}

// Verificar se o servidor está rodando
async function checkServerRunning() {
  try {
    await fetch(BASE_URL)
    return true
  } catch (error) {
    console.log(chalk.red('❌ Servidor não está rodando!'))
    console.log(chalk.yellow('💡 Execute: npm run dev'))
    return false
  }
}

// Executar os testes
checkServerRunning().then(running => {
  if (running) {
    main()
  } else {
    process.exit(1)
  }
}) 