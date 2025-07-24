# Epic 1: Foundation & Conversational Core

**Epic Goal**: Establish the foundational infrastructure and core conversational bill-splitting functionality that allows users to describe expenses in natural language and receive accurate division calculations through Claude AI processing.

## Story 1.1: Project Setup and Development Environment

As a **developer**,  
I want **a complete development environment with all necessary dependencies and tools**,  
so that **I can begin building RachaAI features immediately without configuration delays**.

### Acceptance Criteria

1. Next.js 14 project initialized with TypeScript and Tailwind CSS
2. Supabase project configured with environment variables and connection testing
3. Redis setup with local development configuration  
4. Claude API integration configured with environment variables and test endpoint
5. ESLint, Prettier, and Git hooks configured for code quality
6. Development server runs successfully on localhost with health check endpoint
7. Basic project structure created with organized folders for components, services, and utilities
8. CLI testing utilities available for backend service verification

## Story 1.2: User Authentication and Profile Management  

As a **user**,  
I want **to create an account and manage my profile securely**,  
so that **RachaAI can remember my preferences and groups across sessions**.

### Acceptance Criteria

1. Supabase Auth integration with email/password registration and login
2. User profile creation with basic information (name, preferred language)
3. Secure session management with JWT tokens and refresh capabilities
4. Password reset functionality via email
5. Profile update functionality for name and preferences
6. Account deletion with data cleanup (LGPD compliance foundation)
7. CLI commands available for user management testing
8. Responsive authentication UI optimized for mobile devices

## Story 1.3: Basic Conversation Interface

As a **user**,  
I want **a chat-like interface where I can type my expense descriptions**,  
so that **I can interact with RachaAI naturally instead of filling forms**.

### Acceptance Criteria

1. Clean chat interface with message input and conversation history
2. Real-time message display with user and AI message differentiation
3. Message persistence across browser sessions for authenticated users
4. Typing indicators and loading states during AI processing
5. Mobile-optimized input with proper keyboard handling
6. Message timestamps and basic conversation metadata
7. Conversation history accessible through UI navigation
8. Local storage fallback for unauthenticated demo usage

## Story 1.4: Claude AI Integration for Expense Processing

As a **user**,  
I want **RachaAI to understand my expense descriptions and calculate divisions accurately**,  
so that **I can get split calculations without manual input or complex forms**.

### Acceptance Criteria

1. Claude API integration with intelligent model routing (Haiku/Sonnet/Opus)
2. Expense parsing from natural language descriptions in Portuguese and English
3. Basic division calculations (equal splits, custom amounts, simple discounts)
4. Conversation context maintained across multiple exchanges
5. Error handling for Claude API failures with graceful degradation
6. Response time monitoring and optimization for model selection
7. Cost tracking and logging for Claude API usage
8. CLI testing interface for expense processing verification

## Story 1.5: Division Results and Confirmation

As a **user**,  
I want **clear visual summaries of calculated divisions with confirmation options**,  
so that **I can verify the splits are correct before sharing with my group**.

### Acceptance Criteria

1. Visual division summary showing each person's amount in Brazilian Reais
2. One-click confirmation system for accepting calculated divisions
3. Edit capabilities for manual adjustments to calculated amounts
4. Conversation integration showing division results inline with chat
5. Export functionality for division results (text format for sharing)
6. Calculation verification with totals and balance checking
7. Clear error messages for invalid or unbalanced divisions
8. Responsive design optimized for mobile review and confirmation 