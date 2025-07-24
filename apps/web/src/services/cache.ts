import { connectRedis, RedisKeys, RedisTTL } from '../utils/redis/client'
import type { ConversationMessage } from '@racha-ai/shared/types'

export interface ConversationContext {
  messages: ConversationMessage[]
  totalTokens: number
  totalCostCents: number
  lastModelUsed: 'haiku' | 'sonnet' | 'opus'
  compressionLevel: number
}

export interface ClaudeCostSummary {
  totalCostCents: number
  requestCount: number
  tokensUsed: number
  modelBreakdown: Record<'haiku' | 'sonnet' | 'opus', {
    requests: number
    cost: number
    tokens: number
  }>
}

export class CacheService {
  private redis = connectRedis()

  // Conversation Context Caching
  async setConversationContext(
    userId: string,
    conversationId: string,
    context: ConversationContext
  ): Promise<void> {
    const client = await this.redis
    const key = RedisKeys.conversationContext(userId, conversationId)
    
    await client.setex(
      key,
      RedisTTL.conversationContext,
      JSON.stringify(context)
    )
  }

  async getConversationContext(
    userId: string,
    conversationId: string
  ): Promise<ConversationContext | null> {
    const client = await this.redis
    const key = RedisKeys.conversationContext(userId, conversationId)
    
    const data = await client.get(key)
    if (!data) return null
    
    // Handle case where Upstash Redis already parsed JSON
    return typeof data === 'string' ? JSON.parse(data) : data
  }

  async deleteConversationContext(
    userId: string,
    conversationId: string
  ): Promise<void> {
    const client = await this.redis
    const key = RedisKeys.conversationContext(userId, conversationId)
    
    await client.del(key)
  }

  // Claude Cost Tracking
  async trackClaudeCost(
    userId: string,
    model: 'haiku' | 'sonnet' | 'opus',
    costCents: number,
    tokens: number
  ): Promise<void> {
    const client = await this.redis
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const key = RedisKeys.claudeCosts(userId, today)
    
    // Get existing data or create new
    const existing = await client.get(key)
    let summary: ClaudeCostSummary
    
    if (existing) {
      // Handle case where Upstash Redis already parsed JSON
      summary = typeof existing === 'string' ? JSON.parse(existing) : existing
    } else {
      summary = {
        totalCostCents: 0,
        requestCount: 0,
        tokensUsed: 0,
        modelBreakdown: {
          haiku: { requests: 0, cost: 0, tokens: 0 },
          sonnet: { requests: 0, cost: 0, tokens: 0 },
          opus: { requests: 0, cost: 0, tokens: 0 }
        }
      }
    }
    
    // Update totals
    summary.totalCostCents += costCents
    summary.requestCount += 1
    summary.tokensUsed += tokens
    
    // Update model-specific breakdown
    summary.modelBreakdown[model].requests += 1
    summary.modelBreakdown[model].cost += costCents
    summary.modelBreakdown[model].tokens += tokens
    
    await client.setex(key, RedisTTL.claudeCosts, JSON.stringify(summary))
  }

  async getClaudeCosts(
    userId: string,
    period: string
  ): Promise<ClaudeCostSummary | null> {
    const client = await this.redis
    const key = RedisKeys.claudeCosts(userId, period)
    
    const data = await client.get(key)
    if (!data) return null
    
    // Handle case where Upstash Redis already parsed JSON
    return typeof data === 'string' ? JSON.parse(data) : data
  }

  // Rate Limiting
  async checkRateLimit(
    userId: string,
    action: string,
    limit: number,
    windowSeconds: number = 60
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const client = await this.redis
    const key = RedisKeys.rateLimiting(userId, action)
    
    const current = await client.get(key)
    const count = current ? parseInt(current as string) : 0
    
    if (count >= limit) {
      const ttl = await client.ttl(key)
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (ttl * 1000)
      }
    }
    
    // Increment counter
    const pipeline = client.pipeline()
    pipeline.incr(key)
    pipeline.expire(key, windowSeconds)
    await pipeline.exec()
    
    return {
      allowed: true,
      remaining: limit - count - 1,
      resetTime: Date.now() + (windowSeconds * 1000)
    }
  }

  // Brazilian User Preferences
  async setUserPreferences(
    userId: string,
    preferences: {
      timezone: string
      locale: string
      currency: string
      lgpdConsent: boolean
      lgpdConsentDate?: string
    }
  ): Promise<void> {
    const client = await this.redis
    const key = RedisKeys.userPreferences(userId)
    
    await client.setex(
      key,
      RedisTTL.userPreferences,
      JSON.stringify(preferences)
    )
  }

  async getUserPreferences(userId: string): Promise<any | null> {
    const client = await this.redis
    const key = RedisKeys.userPreferences(userId)
    
    const data = await client.get(key)
    if (!data) return null
    
    // Handle case where Upstash Redis already parsed JSON
    return typeof data === 'string' ? JSON.parse(data) : data
  }

  // Group Members Cache
  async setGroupMembers(
    groupId: string,
    members: Array<{ id: string; name: string; role: string }>
  ): Promise<void> {
    const client = await this.redis
    const key = RedisKeys.groupMembers(groupId)
    
    await client.setex(
      key,
      RedisTTL.groupMembers,
      JSON.stringify(members)
    )
  }

  async getGroupMembers(groupId: string): Promise<any[] | null> {
    const client = await this.redis
    const key = RedisKeys.groupMembers(groupId)
    
    const data = await client.get(key)
    if (!data) return null
    
    // Handle case where Upstash Redis already parsed JSON
    return typeof data === 'string' ? JSON.parse(data) : data
  }

  // Conversation Context Compression for Claude Cost Optimization
  async compressConversationContext(
    context: ConversationContext,
    maxMessages: number = 20
  ): Promise<ConversationContext> {
    // Keep only recent messages and system-important messages
    let compressedMessages = context.messages

    if (compressedMessages.length > maxMessages) {
      // Keep first message (usually system prompt) and recent messages
      const systemMessages = compressedMessages.filter(m => m.role === 'assistant' && m.content.includes('sistema'))
      const recentMessages = compressedMessages.slice(-maxMessages)
      
      compressedMessages = [...systemMessages.slice(0, 1), ...recentMessages]
    }

    return {
      ...context,
      messages: compressedMessages,
      compressionLevel: context.compressionLevel + 1,
      totalTokens: compressedMessages.reduce((sum, msg) => sum + (msg.token_count || 0), 0)
    }
  }

  // LGPD Compliant Cache Cleanup
  async cleanupUserData(userId: string): Promise<void> {
    const client = await this.redis
    
    // Clean up specific user-related keys since Upstash has limitations on KEYS command
    const keysToDelete = [
      RedisKeys.userSession(userId),
      RedisKeys.userPreferences(userId),
      RedisKeys.rateLimiting(userId, 'api'),
      RedisKeys.rateLimiting(userId, 'claude'),
      // Add more specific keys as needed
    ]
    
    // Also try to clean conversation contexts (we'll need conversation IDs for this)
    for (const key of keysToDelete) {
      try {
        await client.del(key)
      } catch (error) {
        console.warn(`Failed to delete key ${key}:`, error)
      }
    }
  }
}

export const cacheService = new CacheService() 