import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BRAZILIAN_CURRENCY, BRAZILIAN_TIMEZONE, BRAZILIAN_PHONE_PATTERNS, BRAZILIAN_CEP_PATTERN } from '../constants';
// Brazilian Currency Formatting
export function formatBrazilianCurrency(amountCents) {
    const amount = amountCents / 100;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: BRAZILIAN_CURRENCY.code,
        minimumFractionDigits: BRAZILIAN_CURRENCY.decimal_places,
        maximumFractionDigits: BRAZILIAN_CURRENCY.decimal_places
    }).format(amount);
}
export function parseBrazilianCurrency(value) {
    // Remove currency symbol and convert to cents
    const cleanValue = value
        .replace(/[^\d,]/g, '')
        .replace(',', '.');
    return Math.round(parseFloat(cleanValue || '0') * 100);
}
// Brazilian Date Formatting
export function formatBrazilianDate(date, formatStr = 'dd/MM/yyyy') {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ptBR });
}
export function formatBrazilianDateTime(date) {
    return formatBrazilianDate(date, 'dd/MM/yyyy HH:mm');
}
export function getBrazilianTimestamp() {
    return new Date().toLocaleString('pt-BR', {
        timeZone: BRAZILIAN_TIMEZONE.timezone
    });
}
// Brazilian Phone Formatting
export function formatBrazilianPhone(phone) {
    // Remove all non-numeric characters
    const numbers = phone.replace(/\D/g, '');
    // Handle different phone number lengths
    if (numbers.length === 11) {
        // Mobile: (XX) 9XXXX-XXXX
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    else if (numbers.length === 10) {
        // Landline: (XX) XXXX-XXXX
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone; // Return original if invalid length
}
export function validateBrazilianPhone(phone) {
    return BRAZILIAN_PHONE_PATTERNS.mobile.test(phone) ||
        BRAZILIAN_PHONE_PATTERNS.landline.test(phone);
}
// Brazilian CEP Formatting
export function formatBrazilianCEP(cep) {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length === 8) {
        return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return cep;
}
export function validateBrazilianCEP(cep) {
    return BRAZILIAN_CEP_PATTERN.test(cep);
}
// LGPD Compliance Utilities
export function isLGPDCompliant(user) {
    return user.lgpd_consent && Boolean(user.lgpd_consent_date);
}
export function calculateDataRetentionDate(createdAt, retentionDays = 90) {
    const createdDate = new Date(createdAt);
    const retentionDate = new Date(createdDate);
    retentionDate.setDate(retentionDate.getDate() + retentionDays);
    return retentionDate;
}
export function isDataExpired(createdAt, retentionDays = 90) {
    const retentionDate = calculateDataRetentionDate(createdAt, retentionDays);
    return new Date() > retentionDate;
}
// Conversation Cost Utilities
export function calculateClaudeCost(model, inputTokens, outputTokens) {
    const modelCosts = {
        haiku: { input: 0.25, output: 1.25 },
        sonnet: { input: 3.0, output: 15.0 },
        opus: { input: 15.0, output: 75.0 }
    };
    const costs = modelCosts[model];
    const inputCost = (inputTokens / 1000) * costs.input;
    const outputCost = (outputTokens / 1000) * costs.output;
    // Return cost in cents
    return Math.round((inputCost + outputCost) * 100);
}
// Text Utilities
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trim() + '...';
}
export function generateId() {
    return crypto.randomUUID();
}
// Validation Helpers
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}
// Array Utilities
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
export function groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}
//# sourceMappingURL=index.js.map