#!/usr/bin/env node

const fetch = require('node-fetch')
const chalk = require('chalk')

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testDatabase() {
  console.log(chalk.bold.blue('\n🇧🇷 RachaAI - Teste de Conexão com Banco de Dados\n'))
  
  try {
    const response = await fetch(`${BASE_URL}/api/health/database`)
    const data = await response.json()
    
    if (response.ok && data.status === 'success') {
      const dbData = data.data.database
      const lgpdData = data.data.lgpd
      const timezoneData = data.data.timezone
      
      console.log(chalk.green('✅ Conexão com banco de dados bem-sucedida!'))
      console.log(chalk.gray('─'.repeat(50)))
      
      // Informações da conexão
      console.log(chalk.blue('📊 Informações da Conexão:'))
      console.log(chalk.gray(`   Status: ${dbData.connected ? 'Conectado' : 'Desconectado'}`))
      console.log(chalk.gray(`   Latência: ${dbData.latency}ms`))
      console.log(chalk.gray(`   Região: ${dbData.region}`))
      console.log(chalk.gray(`   Versão: ${dbData.version}`))
      
      // LGPD Compliance
      console.log(chalk.blue('\n🔒 Conformidade LGPD:'))
      console.log(chalk.gray(`   Status: ${lgpdData.compliant ? 'Conforme' : 'Não conforme'}`))
      console.log(chalk.gray(`   Retenção de dados: ${lgpdData.checks.dataRetentionConfigured ? 'Configurada' : 'Não configurada'}`))
      console.log(chalk.gray(`   Email do DPO: ${lgpdData.checks.dpoEmailSet ? 'Configurado' : 'Não configurado'}`))
      console.log(chalk.gray(`   Região brasileira: ${lgpdData.checks.brazilianRegion ? 'Sim (sa-east-1)' : 'Não'}`))
      
      // Timezone brasileiro
      console.log(chalk.blue('\n🕐 Configuração de Timezone:'))
      console.log(chalk.gray(`   Status: ${timezoneData.correct ? 'Correto' : 'Incorreto'}`))
      console.log(chalk.gray(`   Configurado: ${timezoneData.configured}`))
      console.log(chalk.gray(`   Esperado: ${timezoneData.expected}`))
      console.log(chalk.gray(`   Timestamp atual: ${timezoneData.timestamp}`))
      
      if (lgpdData.errors.length > 0) {
        console.log(chalk.yellow('\n⚠️  Avisos LGPD:'))
        lgpdData.errors.forEach(error => {
          console.log(chalk.gray(`   • ${error}`))
        })
      }
      
    } else {
      console.log(chalk.red('❌ Falha na conexão com banco de dados'))
      console.log(chalk.gray(`   Erro: ${data.error || 'Desconhecido'}`))
    }
    
  } catch (error) {
    console.log(chalk.red('❌ Erro ao testar banco de dados'))
    console.log(chalk.gray(`   Erro: ${error.message}`))
  }
}

testDatabase() 