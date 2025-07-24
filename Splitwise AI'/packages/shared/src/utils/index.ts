import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { BRAZILIAN_CURRENCY, BRAZILIAN_TIMEZONE, BRAZILIAN_PHONE_PATTERNS, BRAZILIAN_CEP_PATTERN } from '../constants'

// Brazilian Currency Formatting
export function formatBrazilianCurrency(amountCents: number): string {
  const amount = amountCents / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: BRAZILIAN_CURRENCY.code,
    minimumFractionDigits: BRAZILIAN_CURRENCY.decimal_places,
    maximumFractionDigits: BRAZILIAN_CURRENCY.decimal_places
  }).format(amount)
}

export function parseBrazilianCurrency(value: string): number {
  // Remove currency symbol and convert to cents
  const cleanValue = value
    .replace(/[^\d,]/g, '')
    .replace(',', '.')
  return Math.round(parseFloat(cleanValue || '0') * 100)
}

// Brazilian Date Formatting
export function formatBrazilianDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: ptBR })
}

export function formatBrazilianDateTime(date: string | Date): string {
  return formatBrazilianDate(date, 'dd/MM/yyyy HH:mm')
}

export function getBrazilianTimestamp(): string {
  return new Date().toLocaleString('pt-BR', {
    timeZone: BRAZILIAN_TIMEZONE.timezone
  })
}

// Brazilian Phone Formatting
export function formatBrazilianPhone(phone: string): string {
  // Remove all non-numeric characters
  const numbers = phone.replace(/\D/g, '')
  
  // Handle different phone number lengths
  if (numbers.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  } else if (numbers.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }
  
  return phone // Return original if invalid length
}

export function validateBrazilianPhone(phone: string): boolean {
  return BRAZILIAN_PHONE_PATTERNS.mobile.test(phone) || 
         BRAZILIAN_PHONE_PATTERNS.landline.test(phone)
}

// Brazilian CEP Formatting
export function formatBrazilianCEP(cep: string): string {
  const numbers = cep.replace(/\D/g, '')
  if (numbers.length === 8) {
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
  }
  return cep
}

export function validateBrazilianCEP(cep: string): boolean {
  return BRAZILIAN_CEP_PATTERN.test(cep)
}

// LGPD Compliance Utilities
export function isLGPDCompliant(user: { lgpd_consent: boolean; lgpd_consent_date?: string }): boolean {
  return user.lgpd_consent && Boolean(user.lgpd_consent_date)
}

export function calculateDataRetentionDate(createdAt: string, retentionDays: number = 90): Date {
  const createdDate = new Date(createdAt)
  const retentionDate = new Date(createdDate)
  retentionDate.setDate(retentionDate.getDate() + retentionDays)
  return retentionDate
}

export function isDataExpired(createdAt: string, retentionDays: number = 90): boolean {
  const retentionDate = calculateDataRetentionDate(createdAt, retentionDays)
  return new Date() > retentionDate
}

// Conversation Cost Utilities
export function calculateClaudeCost(model: 'haiku' | 'sonnet' | 'opus', inputTokens: number, outputTokens: number): number {
  const modelCosts = {
    haiku: { input: 0.25, output: 1.25 },
    sonnet: { input: 3.0, output: 15.0 },
    opus: { input: 15.0, output: 75.0 }
  }
  
  const costs = modelCosts[model]
  const inputCost = (inputTokens / 1000) * costs.input
  const outputCost = (outputTokens / 1000) * costs.output
  
  // Return cost in cents
  return Math.round((inputCost + outputCost) * 100)
}

// Text Utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function generateId(): string {
  return crypto.randomUUID()
}

// Validation Helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// Array Utilities
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key]!.push(item)
    return groups
  }, {} as Record<string, T[]>)
} 