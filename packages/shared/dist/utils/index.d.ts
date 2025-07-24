export declare function formatBrazilianCurrency(amountCents: number): string;
export declare function parseBrazilianCurrency(value: string): number;
export declare function formatBrazilianDate(date: string | Date, formatStr?: string): string;
export declare function formatBrazilianDateTime(date: string | Date): string;
export declare function getBrazilianTimestamp(): string;
export declare function formatBrazilianPhone(phone: string): string;
export declare function validateBrazilianPhone(phone: string): boolean;
export declare function formatBrazilianCEP(cep: string): string;
export declare function validateBrazilianCEP(cep: string): boolean;
export declare function isLGPDCompliant(user: {
    lgpd_consent: boolean;
    lgpd_consent_date?: string;
}): boolean;
export declare function calculateDataRetentionDate(createdAt: string, retentionDays?: number): Date;
export declare function isDataExpired(createdAt: string, retentionDays?: number): boolean;
export declare function calculateClaudeCost(model: 'haiku' | 'sonnet' | 'opus', inputTokens: number, outputTokens: number): number;
export declare function truncateText(text: string, maxLength: number): string;
export declare function generateId(): string;
export declare function isValidEmail(email: string): boolean;
export declare function sanitizeInput(input: string): string;
export declare function chunk<T>(array: T[], size: number): T[][];
export declare function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]>;
//# sourceMappingURL=index.d.ts.map