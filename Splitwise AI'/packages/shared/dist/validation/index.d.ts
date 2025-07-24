import { z } from 'zod';
export declare const brazilianPhoneSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const brazilianCEPSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const brazilianStateSchema: z.ZodEnum<["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    avatar_url: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    timezone: z.ZodDefault<z.ZodString>;
    locale: z.ZodDefault<z.ZodString>;
    lgpd_consent: z.ZodBoolean;
    lgpd_consent_date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    locale: string;
    id: string;
    created_at: string;
    updated_at: string;
    timezone: string;
    lgpd_consent: boolean;
    phone?: string | undefined;
    avatar_url?: string | undefined;
    lgpd_consent_date?: string | undefined;
}, {
    email: string;
    name: string;
    id: string;
    created_at: string;
    updated_at: string;
    lgpd_consent: boolean;
    phone?: string | undefined;
    avatar_url?: string | undefined;
    timezone?: string | undefined;
    locale?: string | undefined;
    lgpd_consent_date?: string | undefined;
}>;
export declare const conversationSchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodString;
    title: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        conversation_id: z.ZodString;
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodString;
        timestamp: z.ZodString;
        claude_model: z.ZodOptional<z.ZodEnum<["haiku", "sonnet", "opus"]>>;
        cost_cents: z.ZodOptional<z.ZodNumber>;
        token_count: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        conversation_id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
        claude_model?: "haiku" | "sonnet" | "opus" | undefined;
        cost_cents?: number | undefined;
        token_count?: number | undefined;
    }, {
        id: string;
        conversation_id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
        claude_model?: "haiku" | "sonnet" | "opus" | undefined;
        cost_cents?: number | undefined;
        token_count?: number | undefined;
    }>, "many">;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    status: z.ZodEnum<["active", "archived", "deleted"]>;
    claude_model_used: z.ZodEnum<["haiku", "sonnet", "opus"]>;
    total_cost_cents: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "active" | "archived" | "deleted";
    user_id: string;
    title: string;
    messages: {
        id: string;
        conversation_id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
        claude_model?: "haiku" | "sonnet" | "opus" | undefined;
        cost_cents?: number | undefined;
        token_count?: number | undefined;
    }[];
    claude_model_used: "haiku" | "sonnet" | "opus";
    total_cost_cents: number;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    status: "active" | "archived" | "deleted";
    user_id: string;
    title: string;
    messages: {
        id: string;
        conversation_id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
        claude_model?: "haiku" | "sonnet" | "opus" | undefined;
        cost_cents?: number | undefined;
        token_count?: number | undefined;
    }[];
    claude_model_used: "haiku" | "sonnet" | "opus";
    total_cost_cents: number;
}>;
export declare const groupSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    created_by: z.ZodString;
    members: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        group_id: z.ZodString;
        user_id: z.ZodString;
        role: z.ZodEnum<["admin", "member"]>;
        joined_at: z.ZodString;
        is_active: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        user_id: string;
        role: "admin" | "member";
        group_id: string;
        joined_at: string;
        is_active: boolean;
    }, {
        id: string;
        user_id: string;
        role: "admin" | "member";
        group_id: string;
        joined_at: string;
        is_active: boolean;
    }>, "many">;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    currency: z.ZodLiteral<"BRL">;
    is_active: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    currency: "BRL";
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    members: {
        id: string;
        user_id: string;
        role: "admin" | "member";
        group_id: string;
        joined_at: string;
        is_active: boolean;
    }[];
    is_active: boolean;
    description?: string | undefined;
}, {
    name: string;
    currency: "BRL";
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    members: {
        id: string;
        user_id: string;
        role: "admin" | "member";
        group_id: string;
        joined_at: string;
        is_active: boolean;
    }[];
    is_active: boolean;
    description?: string | undefined;
}>;
export declare const expenseSchema: z.ZodObject<{
    id: z.ZodString;
    group_id: z.ZodString;
    description: z.ZodString;
    amount_cents: z.ZodNumber;
    currency: z.ZodLiteral<"BRL">;
    category: z.ZodEnum<["food", "transport", "accommodation", "entertainment", "shopping", "utilities", "other"]>;
    paid_by: z.ZodString;
    split_method: z.ZodEnum<["equal", "percentage", "exact", "shares"]>;
    splits: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expense_id: z.ZodString;
        user_id: z.ZodString;
        amount_cents: z.ZodNumber;
        percentage: z.ZodOptional<z.ZodNumber>;
        is_settled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        user_id: string;
        amount_cents: number;
        expense_id: string;
        is_settled: boolean;
        percentage?: number | undefined;
    }, {
        id: string;
        user_id: string;
        amount_cents: number;
        expense_id: string;
        is_settled: boolean;
        percentage?: number | undefined;
    }>, "many">;
    receipt_url: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: "BRL";
    id: string;
    created_at: string;
    updated_at: string;
    description: string;
    group_id: string;
    amount_cents: number;
    category: "food" | "transport" | "accommodation" | "entertainment" | "shopping" | "utilities" | "other";
    paid_by: string;
    split_method: "equal" | "percentage" | "exact" | "shares";
    splits: {
        id: string;
        user_id: string;
        amount_cents: number;
        expense_id: string;
        is_settled: boolean;
        percentage?: number | undefined;
    }[];
    receipt_url?: string | undefined;
}, {
    currency: "BRL";
    id: string;
    created_at: string;
    updated_at: string;
    description: string;
    group_id: string;
    amount_cents: number;
    category: "food" | "transport" | "accommodation" | "entertainment" | "shopping" | "utilities" | "other";
    paid_by: string;
    split_method: "equal" | "percentage" | "exact" | "shares";
    splits: {
        id: string;
        user_id: string;
        amount_cents: number;
        expense_id: string;
        is_settled: boolean;
        percentage?: number | undefined;
    }[];
    receipt_url?: string | undefined;
}>;
export declare const brazilianAddressSchema: z.ZodObject<{
    cep: z.ZodEffects<z.ZodString, string, string>;
    street: z.ZodString;
    number: z.ZodString;
    complement: z.ZodOptional<z.ZodString>;
    neighborhood: z.ZodString;
    city: z.ZodString;
    state: z.ZodEnum<["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]>;
    country: z.ZodLiteral<"BR">;
}, "strip", z.ZodTypeAny, {
    number: string;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";
    country: "BR";
    complement?: string | undefined;
}, {
    number: string;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";
    country: "BR";
    complement?: string | undefined;
}>;
export declare const apiResponseSchema: z.ZodObject<{
    data: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["success", "error"]>;
}, "strip", z.ZodTypeAny, {
    status: "success" | "error";
    data?: unknown;
    error?: string | undefined;
    message?: string | undefined;
}, {
    status: "success" | "error";
    data?: unknown;
    error?: string | undefined;
    message?: string | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    total_pages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}, {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}>;
export declare const envConfigSchema: z.ZodObject<{
    NODE_ENV: z.ZodEnum<["development", "production", "test"]>;
    TIMEZONE: z.ZodDefault<z.ZodString>;
    CURRENCY: z.ZodDefault<z.ZodString>;
    LOCALE: z.ZodDefault<z.ZodString>;
    DATA_RETENTION_DAYS: z.ZodDefault<z.ZodNumber>;
    DPO_EMAIL: z.ZodString;
    PRIVACY_POLICY_URL: z.ZodString;
    NEXT_PUBLIC_SUPABASE_URL: z.ZodString;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.ZodString;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodString;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    ANTHROPIC_API_KEY: z.ZodString;
    NEXT_PUBLIC_APP_URL: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    TIMEZONE: string;
    CURRENCY: string;
    LOCALE: string;
    DATA_RETENTION_DAYS: number;
    DPO_EMAIL: string;
    PRIVACY_POLICY_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    ANTHROPIC_API_KEY: string;
    NEXT_PUBLIC_APP_URL: string;
}, {
    NODE_ENV: "development" | "production" | "test";
    DPO_EMAIL: string;
    PRIVACY_POLICY_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    ANTHROPIC_API_KEY: string;
    NEXT_PUBLIC_APP_URL: string;
    TIMEZONE?: string | undefined;
    CURRENCY?: string | undefined;
    LOCALE?: string | undefined;
    DATA_RETENTION_DAYS?: number | undefined;
}>;
//# sourceMappingURL=index.d.ts.map