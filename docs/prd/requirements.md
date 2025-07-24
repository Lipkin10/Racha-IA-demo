# Requirements

## Functional

**FR1**: The system shall process natural language descriptions of expenses in Portuguese Brazilian and English, including code-switching between languages.

**FR2**: The system shall automatically calculate bill divisions based on described scenarios, handling equal splits, custom amounts, discounts, and proportional divisions.

**FR3**: The system shall maintain conversational memory of groups, preferences, and patterns to provide intelligent suggestions for recurring users.

**FR4**: The system shall support Brazilian payment preferences including PIX keys, transfer preferences, and cash handling patterns.

**FR5**: The system shall categorize expenses automatically (restaurante, transporte, hospedagem) based on context clues in conversations.

**FR6**: The system shall provide confirmation dialogs before finalizing any division calculations, showing clear breakdown of who pays what.

**FR7**: The system shall handle complex scenarios including partial participation, different consumption levels, and custom split rules.

**FR8**: The system shall maintain group profiles with member preferences, payment methods, and historical patterns.

**FR9**: The system shall process cultural contexts specific to Brazilian scenarios (churrasco, happy hour, rodízio, vaquinha).

**FR10**: The system shall provide export functionality for division results in multiple formats for external payment processing.

**FR11**: The system shall support user authentication and secure session management for personalized experiences.

**FR12**: The system shall allow users to create, modify, and delete group configurations and member profiles.

## Non Functional

**NFR1**: The system shall respond to user inputs within 2.5 seconds for 90% of Sonnet operations and 1 second for 70% of Haiku operations.

**NFR2**: The system shall maintain 99.9% uptime during Brazilian peak hours (19h-23h) with graceful degradation capabilities.

**NFR3**: The system shall comply with LGPD requirements including explicit consent, data minimization, and user control over personal data.

**NFR4**: The system shall support concurrent usage by 200+ users simultaneously without performance degradation.

**NFR5**: The system shall maintain data residency in Brazil (AWS sa-east-1) for LGPD compliance.

**NFR6**: The system shall implement intelligent Claude model routing (70% Haiku, 25% Sonnet, 5% Opus) to optimize costs while maintaining quality.

**NFR7**: The system shall provide local testability for all backend operations via CLI interfaces and API endpoints.

**NFR8**: The system shall maintain conversation data retention of 90 days with automatic cleanup and user-controlled deletion.

**NFR9**: The system shall support mobile-first responsive design optimized for Brazilian 4G/5G networks.

**NFR10**: The system shall implement comprehensive error handling with fallback mechanisms when Claude services are unavailable. 