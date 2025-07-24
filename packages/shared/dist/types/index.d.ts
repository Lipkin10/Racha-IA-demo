export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
    timezone: string;
    locale: string;
    lgpd_consent: boolean;
    lgpd_consent_date?: string;
}
export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    messages: ConversationMessage[];
    created_at: string;
    updated_at: string;
    status: 'active' | 'archived' | 'deleted';
    claude_model_used: ClaudeModel;
    total_cost_cents: number;
}
export interface ConversationMessage {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    claude_model?: ClaudeModel;
    cost_cents?: number;
    token_count?: number;
}
export type ClaudeModel = 'haiku' | 'sonnet' | 'opus';
export interface Group {
    id: string;
    name: string;
    description?: string;
    created_by: string;
    members: GroupMember[];
    created_at: string;
    updated_at: string;
    currency: 'BRL';
    is_active: boolean;
}
export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: 'admin' | 'member';
    joined_at: string;
    is_active: boolean;
}
export interface Expense {
    id: string;
    group_id: string;
    description: string;
    amount_cents: number;
    currency: 'BRL';
    category: ExpenseCategory;
    paid_by: string;
    split_method: SplitMethod;
    splits: ExpenseSplit[];
    receipt_url?: string;
    created_at: string;
    updated_at: string;
}
export interface ExpenseSplit {
    id: string;
    expense_id: string;
    user_id: string;
    amount_cents: number;
    percentage?: number;
    is_settled: boolean;
}
export type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'utilities' | 'other';
export type SplitMethod = 'equal' | 'percentage' | 'exact' | 'shares';
export interface BrazilianAddress {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: BrazilianState;
    country: 'BR';
}
export type BrazilianState = 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
export interface BrazilianPhone {
    country_code: '+55';
    area_code: string;
    number: string;
    formatted: string;
}
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
    status: 'success' | 'error';
}
export interface PaginatedResponse<T = unknown> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
export interface AppConfig {
    timezone: string;
    currency: string;
    locale: string;
    lgpd: {
        data_retention_days: number;
        dpo_email: string;
        privacy_policy_url: string;
    };
}
//# sourceMappingURL=index.d.ts.map