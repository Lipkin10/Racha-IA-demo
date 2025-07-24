import type { BrazilianState } from '../types';
export declare const BRAZILIAN_CURRENCY: {
    readonly code: "BRL";
    readonly symbol: "R$";
    readonly name: "Real Brasileiro";
    readonly decimal_places: 2;
    readonly decimal_separator: ",";
    readonly thousands_separator: ".";
};
export declare const BRAZILIAN_TIMEZONE: {
    readonly timezone: "America/Sao_Paulo";
    readonly offset: "-03:00";
    readonly name: "Horário de Brasília";
};
export declare const BRAZILIAN_LOCALE: {
    readonly locale: "pt-BR";
    readonly language: "pt";
    readonly country: "BR";
};
export declare const BRAZILIAN_STATES: Record<BrazilianState, string>;
export declare const EXPENSE_CATEGORIES: {
    readonly food: "Alimentação";
    readonly transport: "Transporte";
    readonly accommodation: "Hospedagem";
    readonly entertainment: "Entretenimento";
    readonly shopping: "Compras";
    readonly utilities: "Utilidades";
    readonly other: "Outros";
};
export declare const SPLIT_METHODS: {
    readonly equal: "Divisão igual";
    readonly percentage: "Por porcentagem";
    readonly exact: "Valor exato";
    readonly shares: "Por cotas";
};
export declare const CLAUDE_MODELS: {
    readonly haiku: {
        readonly name: "Claude Haiku";
        readonly max_tokens: 200000;
        readonly cost_per_1k_tokens_input: 0.25;
        readonly cost_per_1k_tokens_output: 1.25;
        readonly use_percentage: 70;
    };
    readonly sonnet: {
        readonly name: "Claude Sonnet";
        readonly max_tokens: 200000;
        readonly cost_per_1k_tokens_input: 3;
        readonly cost_per_1k_tokens_output: 15;
        readonly use_percentage: 25;
    };
    readonly opus: {
        readonly name: "Claude Opus";
        readonly max_tokens: 200000;
        readonly cost_per_1k_tokens_input: 15;
        readonly cost_per_1k_tokens_output: 75;
        readonly use_percentage: 5;
    };
};
export declare const LGPD_CONSTANTS: {
    readonly data_retention_days: 90;
    readonly consent_required_fields: readonly ["email", "phone", "name"];
    readonly data_categories: readonly ["identification", "contact", "financial", "usage", "preferences"];
    readonly user_rights: readonly ["access", "rectification", "erasure", "portability", "objection"];
};
export declare const BRAZILIAN_PHONE_PATTERNS: {
    readonly mobile: RegExp;
    readonly landline: RegExp;
    readonly area_codes: readonly ["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "64", "63", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "87", "82", "83", "84", "85", "88", "86", "89", "91", "93", "94", "92", "97", "95", "96", "98", "99"];
};
export declare const BRAZILIAN_CEP_PATTERN: RegExp;
export declare const API_RATE_LIMITS: {
    readonly claude_requests_per_minute: 60;
    readonly api_requests_per_minute: 1000;
    readonly conversation_context_max_messages: 50;
};
//# sourceMappingURL=index.d.ts.map