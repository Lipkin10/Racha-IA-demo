import { Redis } from '@upstash/redis'
import { config } from '../../config/environment'

// Upstash Redis client singleton
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      url: config.redis.url,
      token: config.redis.token,
    })
  }
  
  return redis
}

export async function connectRedis(): Promise<Redis> {
  const client = getRedisClient()
  
  // Upstash Redis is automatically connected, test the connection
  try {
    await client.ping()
    console.log('Upstash Redis connected successfully')
    return client
  } catch (error) {
    console.error('Upstash Redis connection error:', error)
    throw error
  }
}

export async function disconnectRedis(): Promise<void> {
  // Upstash Redis doesn't require explicit disconnection
  // Just reset the client for potential reconnection
  redis = null
  console.log('Upstash Redis client reset')
}

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient()
    const result = await client.ping()
    return result === 'PONG'
  } catch (error) {
    console.error('Redis connection test failed:', error)
    return false
  }
}

// Brazilian-specific Redis key helpers
export const RedisKeys = {
  // Conversation context keys
  conversationContext: (userId: string, conversationId: string) => 
    `${config.redis.keyPrefix}conversation:${userId}:${conversationId}:context`,
  
  // Claude cost tracking keys
  claudeCosts: (userId: string, period: string) => 
    `${config.redis.keyPrefix}claude:costs:${userId}:${period}`,
  
  // User session keys (LGPD compliant)
  userSession: (userId: string) => 
    `${config.redis.keyPrefix}session:${userId}`,
  
  // Rate limiting keys
  rateLimiting: (userId: string, action: string) => 
    `${config.redis.keyPrefix}rate_limit:${userId}:${action}`,
  
  // Brazilian user preferences cache
  userPreferences: (userId: string) => 
    `${config.redis.keyPrefix}prefs:${userId}:br`,
  
  // Group member cache
  groupMembers: (groupId: string) => 
    `${config.redis.keyPrefix}group:${groupId}:members`
} as const

// Default TTL values in seconds
export const RedisTTL = {
  conversationContext: 60 * 60 * 2, // 2 hours
  claudeCosts: 60 * 60 * 24, // 24 hours
  userSession: 60 * 60 * 24 * 7, // 7 days (LGPD compliant)
  rateLimiting: 60, // 1 minute
  userPreferences: 60 * 60 * 24, // 24 hours
  groupMembers: 60 * 30 // 30 minutes
} as const 