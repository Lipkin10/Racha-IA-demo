// Brazilian Currency and Formatting
export const BRAZILIAN_CURRENCY = {
    code: 'BRL',
    symbol: 'R$',
    name: 'Real Brasileiro',
    decimal_places: 2,
    decimal_separator: ',',
    thousands_separator: '.'
};
// Brazilian Timezone
export const BRAZILIAN_TIMEZONE = {
    timezone: 'America/Sao_Paulo',
    offset: '-03:00',
    name: 'Horário de Brasília'
};
// Brazilian Locale
export const BRAZILIAN_LOCALE = {
    locale: 'pt-BR',
    language: 'pt',
    country: 'BR'
};
// Brazilian States with Names
export const BRAZILIAN_STATES = {
    AC: 'Acre',
    AL: 'Alagoas',
    AP: 'Amapá',
    AM: 'Amazonas',
    BA: 'Bahia',
    CE: 'Ceará',
    DF: 'Distrito Federal',
    ES: 'Espírito Santo',
    GO: 'Goiás',
    MA: 'Maranhão',
    MT: 'Mato Grosso',
    MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais',
    PA: 'Pará',
    PB: 'Paraíba',
    PR: 'Paraná',
    PE: 'Pernambuco',
    PI: 'Piauí',
    RJ: 'Rio de Janeiro',
    RN: 'Rio Grande do Norte',
    RS: 'Rio Grande do Sul',
    RO: 'Rondônia',
    RR: 'Roraima',
    SC: 'Santa Catarina',
    SP: 'São Paulo',
    SE: 'Sergipe',
    TO: 'Tocantins'
};
// Expense Categories in Portuguese
export const EXPENSE_CATEGORIES = {
    food: 'Alimentação',
    transport: 'Transporte',
    accommodation: 'Hospedagem',
    entertainment: 'Entretenimento',
    shopping: 'Compras',
    utilities: 'Utilidades',
    other: 'Outros'
};
// Split Methods in Portuguese
export const SPLIT_METHODS = {
    equal: 'Divisão igual',
    percentage: 'Por porcentagem',
    exact: 'Valor exato',
    shares: 'Por cotas'
};
// Claude AI Models Configuration
export const CLAUDE_MODELS = {
    haiku: {
        name: 'Claude Haiku',
        max_tokens: 200000,
        cost_per_1k_tokens_input: 0.25,
        cost_per_1k_tokens_output: 1.25,
        use_percentage: 70
    },
    sonnet: {
        name: 'Claude Sonnet',
        max_tokens: 200000,
        cost_per_1k_tokens_input: 3.0,
        cost_per_1k_tokens_output: 15.0,
        use_percentage: 25
    },
    opus: {
        name: 'Claude Opus',
        max_tokens: 200000,
        cost_per_1k_tokens_input: 15.0,
        cost_per_1k_tokens_output: 75.0,
        use_percentage: 5
    }
};
// LGPD Compliance Constants
export const LGPD_CONSTANTS = {
    data_retention_days: 90,
    consent_required_fields: ['email', 'phone', 'name'],
    data_categories: [
        'identification',
        'contact',
        'financial',
        'usage',
        'preferences'
    ],
    user_rights: [
        'access',
        'rectification',
        'erasure',
        'portability',
        'objection'
    ]
};
// Brazilian Phone Patterns
export const BRAZILIAN_PHONE_PATTERNS = {
    mobile: /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)9\d{4}[\s-]?\d{4}$/,
    landline: /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)[2-5]\d{3}[\s-]?\d{4}$/,
    area_codes: [
        '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
        '21', '22', '24', // RJ
        '27', '28', // ES
        '31', '32', '33', '34', '35', '37', '38', // MG
        '41', '42', '43', '44', '45', '46', // PR
        '47', '48', '49', // SC
        '51', '53', '54', '55', // RS
        '61', // DF
        '62', '64', // GO
        '63', // TO
        '65', '66', // MT
        '67', // MS
        '68', // AC
        '69', // RO/RR
        '71', '73', '74', '75', '77', // BA
        '79', // SE
        '81', '87', // PE
        '82', // AL
        '83', // PB
        '84', // RN
        '85', '88', // CE
        '86', '89', // PI
        '91', '93', '94', // PA
        '92', '97', // AM
        '95', // RR
        '96', // AP
        '98', '99' // MA
    ]
};
// Brazilian CEP Pattern
export const BRAZILIAN_CEP_PATTERN = /^\d{5}-?\d{3}$/;
// API Rate Limits
export const API_RATE_LIMITS = {
    claude_requests_per_minute: 60,
    api_requests_per_minute: 1000,
    conversation_context_max_messages: 50
};
//# sourceMappingURL=index.js.map