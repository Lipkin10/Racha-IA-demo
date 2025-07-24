import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config/environment'
import { cacheService } from './cache'
import { CLAUDE_MODELS } from '@racha-ai/shared/constants'
import { calculateClaudeCost } from '@racha-ai/shared/utils'

export interface ClaudeRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  userId: string
  conversationId?: string
  context?: string
  forceModel?: 'haiku' | 'sonnet' | 'opus'
}

export interface ClaudeResponse {
  content: string
  model: 'haiku' | 'sonnet' | 'opus'
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  cost: {
    cents: number
    formatted: string
  }
  requestId: string
  timestamp: string
}

export class ClaudeService {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ai.anthropicApiKey,
      defaultHeaders: {
        'X-Client-Info': 'racha-ai/1.0.0',
        'X-Region': 'br',
        'X-Locale': 'pt-BR'
      }
    })
  }

  // Intelligent model routing based on Brazilian cost optimization
  private selectOptimalModel(
    messageLength: number,
    complexity: 'simple' | 'medium' | 'complex',
    forceModel?: 'haiku' | 'sonnet' | 'opus'
  ): 'haiku' | 'sonnet' | 'opus' {
    if (forceModel) return forceModel

    // Brazilian market optimization: 70% Haiku, 25% Sonnet, 5% Opus
    const random = Math.random() * 100

    // Simple queries (< 500 chars) -> Always Haiku
    if (messageLength < 500 && complexity === 'simple') {
      return 'haiku'
    }

    // Complex queries or long messages might need better models
    if (complexity === 'complex' || messageLength > 2000) {
      if (random < 15) return 'opus'  // 15% for complex
      if (random < 50) return 'sonnet' // 35% for complex
      return 'haiku' // 50% still Haiku for cost optimization
    }

    // Default distribution for medium complexity
    if (random < 70) return 'haiku'   // 70%
    if (random < 95) return 'sonnet'  // 25%
    return 'opus'                     // 5%
  }

  // Detect query complexity for better model routing
  private analyzeQueryComplexity(content: string): 'simple' | 'medium' | 'complex' {
    const complexityIndicators = {
      simple: [
        'olá', 'oi', 'obrigado', 'tchau', 'sim', 'não',
        'quanto', 'quando', 'onde', 'como está'
      ],
      complex: [
        'analisar', 'calcular', 'explicar detalhadamente', 'comparar',
        'estratégia', 'implementar', 'desenvolver', 'planejar',
        'otimizar', 'resolver problema', 'arquitetura'
      ]
    }

    const lowerContent = content.toLowerCase()
    
    // Check for simple patterns
    if (complexityIndicators.simple.some(word => lowerContent.includes(word)) &&
        content.length < 200) {
      return 'simple'
    }

    // Check for complex patterns
    if (complexityIndicators.complex.some(word => lowerContent.includes(word)) ||
        content.length > 1000 ||
        (content.match(/\?/g) || []).length > 2) {
      return 'complex'
    }

    return 'medium'
  }

  // Brazilian Portuguese system prompt
  private getBrazilianSystemPrompt(): string {
    return `Você é um assistente de IA especializado em gestão de despesas em grupo para o mercado brasileiro. 

Características importantes:
- Responda sempre em português brasileiro
- Use valores em Real (R$) 
- Considere o contexto cultural brasileiro
- Seja direto e prático nas respostas
- Use formatação brasileira para datas (dd/mm/aaaa)
- Considere feriados e horários brasileiros
- Mantenha conformidade com a LGPD

Para divisão de contas, sempre:
- Sugira métodos justos de divisão
- Considere diferentes situações financeiras
- Explique cálculos de forma clara
- Ofereça alternativas práticas

Seja útil, amigável e eficiente.`
  }

  async chat(request: ClaudeRequest): Promise<ClaudeResponse> {
    const requestId = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    try {
      // Check rate limiting
      const rateLimitCheck = await cacheService.checkRateLimit(
        request.userId,
        'claude-request',
        60, // 60 requests per minute
        60
      )

      if (!rateLimitCheck.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)} seconds.`)
      }

      // Analyze query and select optimal model
      const userMessage = request.messages[request.messages.length - 1]?.content || ''
      const complexity = this.analyzeQueryComplexity(userMessage)
      const selectedModel = this.selectOptimalModel(
        userMessage.length,
        complexity,
        request.forceModel
      )

      // Prepare messages with Brazilian system prompt
      const messages: Anthropic.Messages.MessageParam[] = [
        ...request.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      // Add context if provided
      if (request.context) {
        messages.unshift({
          role: 'assistant',
          content: `Contexto da conversa: ${request.context}`
        })
      }

      // Make request to Claude
      const response = await this.client.messages.create({
        model: this.getAnthropicModelName(selectedModel),
        max_tokens: 4000,
        temperature: 0.7,
        system: this.getBrazilianSystemPrompt(),
        messages
      })

      // Extract usage information
      const usage = {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      }

      // Calculate cost in cents
      const costCents = calculateClaudeCost(
        selectedModel,
        usage.inputTokens,
        usage.outputTokens
      )

      // Track costs in Redis
      await cacheService.trackClaudeCost(
        request.userId,
        selectedModel,
        costCents,
        usage.totalTokens
      )

      // Update conversation context if provided
      if (request.conversationId) {
        const context = await cacheService.getConversationContext(
          request.userId,
          request.conversationId
        )

        const newMessage = {
          id: crypto.randomUUID(),
          conversation_id: request.conversationId,
          role: 'assistant' as const,
          content: response.content[0].type === 'text' ? response.content[0].text : '',
          timestamp,
          claude_model: selectedModel,
          cost_cents: costCents,
          token_count: usage.outputTokens
        }

        if (context) {
          context.messages.push(newMessage)
          context.totalTokens += usage.totalTokens
          context.totalCostCents += costCents
          context.lastModelUsed = selectedModel

          // Compress context if it's getting too large
          const updatedContext = context.messages.length > 30 
            ? await cacheService.compressConversationContext(context, 20)
            : context

          await cacheService.setConversationContext(
            request.userId,
            request.conversationId,
            updatedContext
          )
        }
      }

      return {
        content: response.content[0].type === 'text' ? response.content[0].text : '',
        model: selectedModel,
        usage,
        cost: {
          cents: costCents,
          formatted: `R$ ${(costCents / 100).toFixed(4)}`
        },
        requestId,
        timestamp
      }
    } catch (error) {
      console.error('Claude API error:', error)
      throw new Error(
        error instanceof Error 
          ? `Erro na comunicação com IA: ${error.message}`
          : 'Erro interno do serviço de IA'
      )
    }
  }

  private getAnthropicModelName(model: 'haiku' | 'sonnet' | 'opus'): string {
    const modelMap = {
      haiku: 'claude-3-haiku-20240307',
      sonnet: 'claude-3-5-sonnet-20241022',
      opus: 'claude-3-opus-20240229'
    }
    return modelMap[model]
  }

  // Get user's daily cost summary
  async getUserDailyCosts(userId: string, date?: string): Promise<any> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    return await cacheService.getClaudeCosts(userId, targetDate)
  }

  // Cost optimization suggestions
  async getCostOptimizationSuggestions(userId: string): Promise<{
    currentUsage: any
    suggestions: string[]
    estimatedSavings: number
  }> {
    const today = new Date().toISOString().split('T')[0]
    const currentUsage = await this.getUserDailyCosts(userId, today)

    const suggestions: string[] = []
    let estimatedSavings = 0

    if (currentUsage) {
      // Suggest using simpler models
      if (currentUsage.modelBreakdown.opus.requests > 2) {
        suggestions.push('Considere usar perguntas mais diretas para reduzir o uso do modelo Opus')
        estimatedSavings += currentUsage.modelBreakdown.opus.cost * 0.6
      }

      if (currentUsage.modelBreakdown.sonnet.requests > 10) {
        suggestions.push('Muitas consultas complexas hoje. Tente simplificar suas perguntas.')
        estimatedSavings += currentUsage.modelBreakdown.sonnet.cost * 0.3
      }

      if (currentUsage.requestCount > 50) {
        suggestions.push('Uso intenso detectado. Considere aguardar algumas respostas antes de fazer novas perguntas.')
      }
    }

    if (suggestions.length === 0) {
      suggestions.push('Seu uso está otimizado! Continue fazendo perguntas diretas e específicas.')
    }

    return {
      currentUsage,
      suggestions,
      estimatedSavings
    }
  }
}

export const claudeService = new ClaudeService() 