import { claudeService } from '../services/claude'
import type { ClaudeRequest } from '../services/claude'

export interface ClaudeTestResult {
  connected: boolean
  latency: number
  modelRouting: {
    haiku: boolean
    sonnet: boolean
    opus: boolean
  }
  brazilianOptimization: boolean
  costTracking: boolean
  error?: string
}

export async function testClaudeConnection(): Promise<ClaudeTestResult> {
  const startTime = Date.now()
  const modelRouting = {
    haiku: false,
    sonnet: false,
    opus: false
  }

  try {
    // Test basic connection with simple Brazilian query
    const testUserId = 'test-user-claude-' + Date.now()
    const simpleRequest: ClaudeRequest = {
      messages: [{
        role: 'user',
        content: 'Olá! Como você pode me ajudar com divisão de contas?'
      }],
      userId: testUserId
    }

    const response = await claudeService.chat(simpleRequest)
    
    // Verify response is in Portuguese
    const brazilianOptimization = response.content.includes('divisão') || 
                                 response.content.includes('contas') ||
                                 response.content.includes('ajudar')

    // Verify cost tracking
    const costTracking = response.cost.cents > 0 && 
                        response.cost.formatted.includes('R$')

    // Test model routing with different complexities
    modelRouting.haiku = response.model === 'haiku'

    return {
      connected: true,
      latency: Date.now() - startTime,
      modelRouting,
      brazilianOptimization,
      costTracking
    }
  } catch (error) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      modelRouting,
      brazilianOptimization: false,
      costTracking: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testModelRouting(): Promise<{
  success: boolean
  results: {
    simple: string
    medium: string
    complex: string
  }
  error?: string
}> {
  try {
    const testUserId = 'test-routing-' + Date.now()

    // Test simple query (should use Haiku)
    const simpleRequest: ClaudeRequest = {
      messages: [{
        role: 'user',
        content: 'Oi'
      }],
      userId: testUserId
    }

    // Test medium query
    const mediumRequest: ClaudeRequest = {
      messages: [{
        role: 'user',
        content: 'Como posso dividir uma conta de R$ 150,00 entre 3 pessoas de forma justa?'
      }],
      userId: testUserId
    }

    // Test complex query (might use Sonnet/Opus)
    const complexRequest: ClaudeRequest = {
      messages: [{
        role: 'user',
        content: 'Preciso de uma análise detalhada sobre como implementar um sistema de divisão de despesas que considere diferentes cenários: pessoas com rendas diferentes, gastos compartilhados vs individuais, e como calcular de forma justa quando alguém não participou de determinada atividade. Também quero entender as melhores práticas para lidar com situações onde alguém sempre esquece de pagar sua parte.'
      }],
      userId: testUserId
    }

    const [simpleResponse, mediumResponse, complexResponse] = await Promise.all([
      claudeService.chat(simpleRequest),
      claudeService.chat(mediumRequest),
      claudeService.chat(complexRequest)
    ])

    return {
      success: true,
      results: {
        simple: simpleResponse.model,
        medium: mediumResponse.model,
        complex: complexResponse.model
      }
    }
  } catch (error) {
    return {
      success: false,
      results: {
        simple: 'error',
        medium: 'error',
        complex: 'error'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testBrazilianLocalization(): Promise<{
  success: boolean
  checks: {
    portugueseResponse: boolean
    brazilianCurrency: boolean
    brazilianDateFormat: boolean
    culturalContext: boolean
  }
  error?: string
}> {
  const checks = {
    portugueseResponse: false,
    brazilianCurrency: false,
    brazilianDateFormat: false,
    culturalContext: false
  }

  try {
    const testUserId = 'test-localization-' + Date.now()
    const request: ClaudeRequest = {
      messages: [{
        role: 'user',
        content: 'Explique como dividir uma conta de restaurante de R$ 89,50 entre 4 amigos, considerando que o almoço foi no dia 15/03/2024.'
      }],
      userId: testUserId
    }

    const response = await claudeService.chat(request)
    const content = response.content.toLowerCase()

    // Check Portuguese response
    checks.portugueseResponse = content.includes('dividir') || 
                               content.includes('cada') || 
                               content.includes('pessoa')

    // Check Brazilian currency formatting
    checks.brazilianCurrency = content.includes('r$') || 
                              response.cost.formatted.includes('R$')

    // Check Brazilian date format understanding
    checks.brazilianDateFormat = content.includes('15/03') || 
                                content.includes('março') ||
                                content.includes('15 de março')

    // Check cultural context
    checks.culturalContext = content.includes('amigos') || 
                            content.includes('restaurante') ||
                            content.includes('almoço')

    return {
      success: Object.values(checks).every(Boolean),
      checks
    }
  } catch (error) {
    return {
      success: false,
      checks,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testCostOptimization(): Promise<{
  success: boolean
  optimization: {
    costTracked: boolean
    modelsUsed: string[]
    estimatedMonthlyCost: number
  }
  error?: string
}> {
  try {
    const testUserId = 'test-cost-opt-' + Date.now()
    
    // Make several requests to track costs
    const requests = [
      'Oi',
      'Como dividir R$ 50 entre 2 pessoas?',
      'Análise completa de gestão financeira para grupos'
    ]

    const responses = await Promise.all(
      requests.map(content => 
        claudeService.chat({
          messages: [{ role: 'user', content }],
          userId: testUserId
        })
      )
    )

    const modelsUsed = [...new Set(responses.map(r => r.model))]
    const totalCost = responses.reduce((sum, r) => sum + r.cost.cents, 0)
    
    // Get optimization suggestions
    const suggestions = await claudeService.getCostOptimizationSuggestions(testUserId)

    return {
      success: true,
      optimization: {
        costTracked: totalCost > 0,
        modelsUsed,
        estimatedMonthlyCost: totalCost * 30 // Rough monthly estimate
      }
    }
  } catch (error) {
    return {
      success: false,
      optimization: {
        costTracked: false,
        modelsUsed: [],
        estimatedMonthlyCost: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testRateLimiting(): Promise<{
  success: boolean
  rateLimitEnforced: boolean
  error?: string
}> {
  try {
    const testUserId = 'test-rate-limit-' + Date.now()
    
    // Make multiple rapid requests to test rate limiting
    const rapidRequests = Array(5).fill(null).map(() => 
      claudeService.chat({
        messages: [{ role: 'user', content: 'teste' }],
        userId: testUserId
      })
    )

    try {
      await Promise.all(rapidRequests)
      // If all succeeded, rate limiting might not be working
      return {
        success: true,
        rateLimitEnforced: false
      }
    } catch (error) {
      // If some failed due to rate limiting, that's expected
      const isRateLimitError = error instanceof Error && 
                              error.message.includes('Rate limit exceeded')
      
      return {
        success: true,
        rateLimitEnforced: isRateLimitError
      }
    }
  } catch (error) {
    return {
      success: false,
      rateLimitEnforced: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 