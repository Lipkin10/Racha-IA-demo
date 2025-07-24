import { connectRedis, disconnectRedis } from './redis/client'
import { cacheService } from '../services/cache'

export interface RedisTestResult {
  connected: boolean
  latency: number
  error?: string
  operations: {
    set: boolean
    get: boolean
    delete: boolean
    expire: boolean
  }
}

export async function testRedisConnection(): Promise<RedisTestResult> {
  const startTime = Date.now()
  const operations = {
    set: false,
    get: false,
    delete: false,
    expire: false
  }

  try {
    const client = await connectRedis()
    
    // Test basic ping
    const pingResult = await client.ping()
    if (pingResult !== 'PONG') {
      throw new Error('Redis ping failed')
    }

    // Test set operation
    const testKey = 'racha-ai:health-check:' + Date.now()
    const testValue = 'test-value-' + Math.random()
    
    await client.set(testKey, testValue)
    operations.set = true

    // Test get operation
    const retrievedValue = await client.get(testKey)
    operations.get = retrievedValue === testValue

    // Test expire operation
    await client.expire(testKey, 1)
    operations.expire = true

    // Test delete operation
    await client.del(testKey)
    operations.delete = true

    return {
      connected: true,
      latency: Date.now() - startTime,
      operations
    }
  } catch (error) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      operations
    }
  }
}

export async function testConversationCaching(): Promise<{
  success: boolean
  operations: {
    setContext: boolean
    getContext: boolean
    deleteContext: boolean
  }
  error?: string
}> {
  const operations = {
    setContext: false,
    getContext: false,
    deleteContext: false
  }

  try {
    const testUserId = 'test-user-' + Date.now()
    const testConversationId = 'test-conversation-' + Date.now()
    
    const testContext = {
      messages: [{
        id: 'test-msg-1',
        conversation_id: testConversationId,
        role: 'user' as const,
        content: 'Teste de contexto de conversa',
        timestamp: new Date().toISOString(),
        claude_model: 'haiku' as const,
        cost_cents: 10,
        token_count: 50
      }],
      totalTokens: 50,
      totalCostCents: 10,
      lastModelUsed: 'haiku' as const,
      compressionLevel: 0
    }

    // Test set context
    await cacheService.setConversationContext(testUserId, testConversationId, testContext)
    operations.setContext = true

    // Test get context
    const retrievedContext = await cacheService.getConversationContext(testUserId, testConversationId)
    operations.getContext = retrievedContext !== null && 
                            retrievedContext.messages.length === 1 &&
                            retrievedContext.totalTokens === 50

    // Test delete context
    await cacheService.deleteConversationContext(testUserId, testConversationId)
    const deletedContext = await cacheService.getConversationContext(testUserId, testConversationId)
    operations.deleteContext = deletedContext === null

    return {
      success: Object.values(operations).every(Boolean),
      operations
    }
  } catch (error) {
    return {
      success: false,
      operations,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testClaudeCostTracking(): Promise<{
  success: boolean
  costTracked: boolean
  costRetrieved: boolean
  error?: string
}> {
  try {
    const testUserId = 'test-user-' + Date.now()
    const today = new Date().toISOString().split('T')[0]

    // Test tracking cost
    await cacheService.trackClaudeCost(testUserId, 'haiku', 25, 100)
    
    // Test retrieving cost
    const costs = await cacheService.getClaudeCosts(testUserId, today)
    
    const costTracked = costs !== null
    const costRetrieved = costs?.totalCostCents === 25 && 
                         costs?.tokensUsed === 100 &&
                         costs?.modelBreakdown.haiku.requests === 1

    return {
      success: costTracked && costRetrieved,
      costTracked,
      costRetrieved
    }
  } catch (error) {
    return {
      success: false,
      costTracked: false,
      costRetrieved: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testBrazilianRateLimit(): Promise<{
  success: boolean
  firstAllowed: boolean
  limitEnforced: boolean
  error?: string
}> {
  try {
    const testUserId = 'test-user-' + Date.now()
    const testAction = 'claude-request'
    const limit = 2

    // First request should be allowed
    const first = await cacheService.checkRateLimit(testUserId, testAction, limit, 60)
    const firstAllowed = first.allowed && first.remaining === 1

    // Second request should be allowed
    await cacheService.checkRateLimit(testUserId, testAction, limit, 60)

    // Third request should be denied
    const third = await cacheService.checkRateLimit(testUserId, testAction, limit, 60)
    const limitEnforced = !third.allowed && third.remaining === 0

    return {
      success: firstAllowed && limitEnforced,
      firstAllowed,
      limitEnforced
    }
  } catch (error) {
    return {
      success: false,
      firstAllowed: false,
      limitEnforced: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 