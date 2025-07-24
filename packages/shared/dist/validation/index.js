import { z } from 'zod';
import { validateBrazilianPhone, validateBrazilianCEP } from '../utils';
// Brazilian Phone Validation
export const brazilianPhoneSchema = z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 caracteres')
    .refine(validateBrazilianPhone, 'Formato de telefone brasileiro inválido');
// Brazilian CEP Validation
export const brazilianCEPSchema = z.string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP deve ter no máximo 9 caracteres')
    .refine(validateBrazilianCEP, 'Formato de CEP brasileiro inválido');
// Brazilian States
export const brazilianStateSchema = z.enum([
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]);
// User Validation
export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email('Email inválido'),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
    phone: brazilianPhoneSchema.optional(),
    avatar_url: z.string().url().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    timezone: z.string().default('America/Sao_Paulo'),
    locale: z.string().default('pt-BR'),
    lgpd_consent: z.boolean(),
    lgpd_consent_date: z.string().datetime().optional()
});
// Conversation Validation
export const conversationSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
    messages: z.array(z.object({
        id: z.string().uuid(),
        conversation_id: z.string().uuid(),
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1, 'Conteúdo é obrigatório'),
        timestamp: z.string().datetime(),
        claude_model: z.enum(['haiku', 'sonnet', 'opus']).optional(),
        cost_cents: z.number().int().min(0).optional(),
        token_count: z.number().int().min(0).optional()
    })),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    status: z.enum(['active', 'archived', 'deleted']),
    claude_model_used: z.enum(['haiku', 'sonnet', 'opus']),
    total_cost_cents: z.number().int().min(0)
});
// Group Validation
export const groupSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, 'Nome do grupo deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
    description: z.string().max(500, 'Descrição muito longa').optional(),
    created_by: z.string().uuid(),
    members: z.array(z.object({
        id: z.string().uuid(),
        group_id: z.string().uuid(),
        user_id: z.string().uuid(),
        role: z.enum(['admin', 'member']),
        joined_at: z.string().datetime(),
        is_active: z.boolean()
    })),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    currency: z.literal('BRL'),
    is_active: z.boolean()
});
// Expense Validation
export const expenseSchema = z.object({
    id: z.string().uuid(),
    group_id: z.string().uuid(),
    description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição muito longa'),
    amount_cents: z.number().int().min(1, 'Valor deve ser maior que zero'),
    currency: z.literal('BRL'),
    category: z.enum(['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'utilities', 'other']),
    paid_by: z.string().uuid(),
    split_method: z.enum(['equal', 'percentage', 'exact', 'shares']),
    splits: z.array(z.object({
        id: z.string().uuid(),
        expense_id: z.string().uuid(),
        user_id: z.string().uuid(),
        amount_cents: z.number().int().min(0),
        percentage: z.number().min(0).max(100).optional(),
        is_settled: z.boolean()
    })),
    receipt_url: z.string().url().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
// Brazilian Address Validation
export const brazilianAddressSchema = z.object({
    cep: brazilianCEPSchema,
    street: z.string().min(1, 'Rua é obrigatória').max(200, 'Rua muito longa'),
    number: z.string().min(1, 'Número é obrigatório').max(20, 'Número muito longo'),
    complement: z.string().max(100, 'Complemento muito longo').optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório').max(100, 'Bairro muito longo'),
    city: z.string().min(1, 'Cidade é obrigatória').max(100, 'Cidade muito longa'),
    state: brazilianStateSchema,
    country: z.literal('BR')
});
// API Response Validation
export const apiResponseSchema = z.object({
    data: z.unknown().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    status: z.enum(['success', 'error'])
});
// Pagination Validation
export const paginationSchema = z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    total_pages: z.number().int().min(0)
});
// Environment Configuration Validation
export const envConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    TIMEZONE: z.string().default('America/Sao_Paulo'),
    CURRENCY: z.string().default('BRL'),
    LOCALE: z.string().default('pt-BR'),
    DATA_RETENTION_DAYS: z.coerce.number().int().min(1).default(90),
    DPO_EMAIL: z.string().email(),
    PRIVACY_POLICY_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    DATABASE_URL: z.string().min(1).refine((val) => val.startsWith('postgresql://') || val.startsWith('postgres://'), 'DATABASE_URL must be a valid PostgreSQL connection string'),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url()
});
//# sourceMappingURL=index.js.map