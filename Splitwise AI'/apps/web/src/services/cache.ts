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
    
    await client.setEx(
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
    return data ? JSON.parse(data) : null
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
    const summary: ClaudeCostSummary = existing ? JSON.parse(existing) : {
      totalCostCents: 0,
      requestCount: 0,
      tokensUsed: 0,
      modelBreakdown: {
        haiku: { requests: 0, cost: 0, tokens: 0 },
        sonnet: { requests: 0, cost: 0, tokens: 0 },
        opus: { requests: 0, cost: 0, tokens: 0 }
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
    
    await client.setEx(key, RedisTTL.claudeCosts, JSON.stringify(summary))
  }

  async getClaudeCosts(
    userId: string,
    period: string
  ): Promise<ClaudeCostSummary | null> {
    const client = await this.redis
    const key = RedisKeys.claudeCosts(userId, period)
    
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
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
    const count = current ? parseInt(current) : 0
    
    if (count >= limit) {
      const ttl = await client.ttl(key)
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (ttl * 1000)
      }
    }
    
    // Increment counter
    await client.multi()
      .incr(key)
      .expire(key, windowSeconds)
      .exec()
    
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
    
    await client.setEx(
      key,
      RedisTTL.userPreferences,
      JSON.stringify(preferences)
    )
  }

  async getUserPreferences(userId: string): Promise<any | null> {
    const client = await this.redis
    const key = RedisKeys.userPreferences(userId)
    
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  }

  // Group Members Cache
  async setGroupMembers(
    groupId: string,
    members: Array<{ id: string; name: string; role: string }>
  ): Promise<void> {
    const client = await this.redis
    const key = RedisKeys.groupMembers(groupId)
    
    await client.setEx(
      key,
      RedisTTL.groupMembers,
      JSON.stringify(members)
    )
  }

  async getGroupMembers(groupId: string): Promise<any[] | null> {
    const client = await this.redis
    const key = RedisKeys.groupMembers(groupId)
    
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
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
    const pattern = `*:${userId}:*`
    
    // Get all keys matching the user pattern
    const keys = await client.keys(pattern)
    
    if (keys.length > 0) {
      await client.del(keys)
    }
  }
}

export const cacheService = new CacheService() 