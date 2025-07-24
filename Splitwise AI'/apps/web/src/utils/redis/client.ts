import { createClient } from 'redis'
import { config } from '../../config/environment'

// Redis client singleton
let redis: ReturnType<typeof createClient> | null = null

export function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: config.redis.url,
      password: process.env.REDIS_PASSWORD,
      socket: {
        connectTimeout: 10000,
        lazyConnect: true,
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
      }
    })

    redis.on('error', (err) => {
      console.error('Redis connection error:', err)
    })

    redis.on('connect', () => {
      console.log('Redis connected successfully')
    })

    redis.on('ready', () => {
      console.log('Redis ready for commands')
    })
  }

  return redis
}

export async function connectRedis() {
  const client = getRedisClient()
  
  if (!client.isOpen && !client.isReady) {
    await client.connect()
  }
  
  return client
}

export async function disconnectRedis() {
  if (redis && redis.isOpen) {
    await redis.quit()
    redis = null
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