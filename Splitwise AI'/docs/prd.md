# RachaAI Product Requirements Document (PRD)

## Goals and Background Context

### Goals

• Transform traditional bill-splitting into natural Portuguese/English conversation
• Achieve 80% reduction in interaction time vs traditional apps like Splitwise  
• Deliver LGPD-compliant AI processing with full user control and transparency
• Support Brazilian cultural contexts (PIX, regional expressions, social patterns)
• Enable intelligent group memory and pattern recognition for recurring users
• Provide reliable Claude-powered expense processing with smart model distribution
• Launch MVP within 6-8 weeks targeting 50-200 simultaneous users

### Background Context

RachaAI addresses the friction of traditional bill-splitting apps by replacing complex forms and buttons with natural conversation in Portuguese Brazilian. Unlike existing solutions that require users to learn app-specific workflows, RachaAI lets users simply describe their situation: "Acabei de pagar R$ 180 no jantar. Éramos 4 pessoas: eu, Maria, João e Ana. Mas a Maria só bebeu água, então ela paga menos 20 reais." The Claude AI processes this naturally, understanding Brazilian cultural contexts, payment preferences, and group dynamics while maintaining full LGPD compliance and user privacy control.

The current bill-splitting market relies on traditional form-based interfaces that require multiple taps, selections, and manual calculations. Brazilian users particularly struggle with apps designed for international markets that don't understand local payment methods (PIX), cultural contexts (rodízio, happy hour), or regional expressions. RachaAI eliminates this friction by making expense division as natural as describing it to a friend.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| Dec 2024 | 1.0 | Initial PRD creation from project brief | John (PM Agent) |

## Requirements

### Functional

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

### Non Functional

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

## User Interface Design Goals

### Overall UX Vision

Create an intuitive conversational interface that feels like chatting with a knowledgeable Brazilian friend who understands local culture and payment habits. The experience should be so natural that users focus on describing their situation rather than learning the app. Prioritize conversation flow over traditional app navigation, with minimal UI chrome and maximum focus on the chat interface.

### Key Interaction Paradigms

- **Conversation-First**: Primary interaction through natural language input with smart suggestions
- **Contextual Confirmations**: Visual summaries of divisions with one-tap approval workflows  
- **Adaptive Intelligence**: Interface learns and adapts to user patterns and preferences
- **Cultural Sensitivity**: UI elements and language that reflect Brazilian communication styles
- **Payment Integration**: Seamless integration with PIX and other Brazilian payment preferences

### Core Screens and Views

- **Main Chat Interface**: Primary conversation view with expense processing
- **Division Summary**: Visual breakdown of calculated splits with payment details
- **Group Management**: Create and manage recurring groups and member preferences  
- **Profile Settings**: Personal preferences, payment methods, and privacy controls
- **History View**: Past divisions and group interactions for reference
- **Onboarding Flow**: Welcome experience explaining conversational approach

### Accessibility: WCAG AA

Ensure accessibility compliance with screen readers, keyboard navigation, and high contrast support for users with disabilities.

### Branding

Clean, modern Brazilian aesthetic with warm colors reflecting friendship and trust. Use typography and visual elements that feel approachable and culturally relevant to Brazilian users. Incorporate subtle references to Brazilian design traditions without being cliché.

### Target Device and Platforms: Web Responsive

Mobile-first responsive web application optimized for Brazilian mobile usage patterns, with progressive web app capabilities for native-like experience.

## Technical Assumptions

### Repository Structure: Monorepo

Single repository containing frontend, backend, and shared utilities to enable rapid development and deployment coordination for the MVP timeline.

### Service Architecture

**Monolithic Architecture with Microservice Readiness**: Initial monolithic application structure with clear service boundaries that can be extracted into microservices post-MVP. Core services include:
- **Conversation Processing Service**: Claude AI integration and NLP processing
- **User Management Service**: Authentication, profiles, and group management  
- **Payment Preference Service**: PIX keys, payment methods, and user preferences
- **Data Persistence Service**: Supabase integration for conversations and user data

### Testing Requirements

**Unit + Integration Testing**: Comprehensive unit tests for business logic, integration tests for Claude AI interactions, and manual testing convenience methods for conversation flows. Focus on testable acceptance criteria with CLI accessibility for backend operations.

### Additional Technical Assumptions and Requests

• **Claude API Integration**: Direct integration with Anthropic's Claude API with intelligent model routing based on conversation complexity
• **Supabase Backend**: PostgreSQL with real-time subscriptions for conversation state management  
• **Redis Caching**: Session management and conversation context caching for performance
• **Next.js Frontend**: React-based frontend with TypeScript for type safety and developer experience
• **Vercel Deployment**: Edge-optimized deployment with Brazilian region prioritization
• **LGPD Compliance Architecture**: Built-in privacy controls, data encryption, and user consent management
• **Portuguese NLP Optimization**: Specialized prompting and context management for Brazilian Portuguese processing
• **Cost Optimization Strategy**: Intelligent Claude model selection and caching to maintain sub-R$1 per conversation cost target

## Epic List

**Epic 1: Foundation & Conversational Core**
Establish project infrastructure, user authentication, and basic conversational expense processing with Claude AI integration.

**Epic 2: Intelligent Group Management** 
Implement group creation, member management, and memory system for recurring users and preferences.

**Epic 3: Brazilian Market Integration**
Add LGPD compliance, PIX payment preferences, cultural context processing, and Portuguese language optimization.

**Epic 4: Production Readiness & Optimization**
Performance optimization, error handling, analytics, and deployment pipeline for production launch.

## Epic 1: Foundation & Conversational Core

**Epic Goal**: Establish the foundational infrastructure and core conversational bill-splitting functionality that allows users to describe expenses in natural language and receive accurate division calculations through Claude AI processing.

### Story 1.1: Project Setup and Development Environment

As a **developer**,  
I want **a complete development environment with all necessary dependencies and tools**,  
so that **I can begin building RachaAI features immediately without configuration delays**.

#### Acceptance Criteria

1. Next.js 14 project initialized with TypeScript and Tailwind CSS
2. Supabase project configured with environment variables and connection testing
3. Redis setup with local development configuration  
4. Claude API integration configured with environment variables and test endpoint
5. ESLint, Prettier, and Git hooks configured for code quality
6. Development server runs successfully on localhost with health check endpoint
7. Basic project structure created with organized folders for components, services, and utilities
8. CLI testing utilities available for backend service verification

### Story 1.2: User Authentication and Profile Management  

As a **user**,  
I want **to create an account and manage my profile securely**,  
so that **RachaAI can remember my preferences and groups across sessions**.

#### Acceptance Criteria

1. Supabase Auth integration with email/password registration and login
2. User profile creation with basic information (name, preferred language)
3. Secure session management with JWT tokens and refresh capabilities
4. Password reset functionality via email
5. Profile update functionality for name and preferences
6. Account deletion with data cleanup (LGPD compliance foundation)
7. CLI commands available for user management testing
8. Responsive authentication UI optimized for mobile devices

### Story 1.3: Basic Conversation Interface

As a **user**,  
I want **a chat-like interface where I can type my expense descriptions**,  
so that **I can interact with RachaAI naturally instead of filling forms**.

#### Acceptance Criteria

1. Clean chat interface with message input and conversation history
2. Real-time message display with user and AI message differentiation
3. Message persistence across browser sessions for authenticated users
4. Typing indicators and loading states during AI processing
5. Mobile-optimized input with proper keyboard handling
6. Message timestamps and basic conversation metadata
7. Conversation history accessible through UI navigation
8. Local storage fallback for unauthenticated demo usage

### Story 1.4: Claude AI Integration for Expense Processing

As a **user**,  
I want **RachaAI to understand my expense descriptions and calculate divisions accurately**,  
so that **I can get split calculations without manual input or complex forms**.

#### Acceptance Criteria

1. Claude API integration with intelligent model routing (Haiku/Sonnet/Opus)
2. Expense parsing from natural language descriptions in Portuguese and English
3. Basic division calculations (equal splits, custom amounts, simple discounts)
4. Conversation context maintained across multiple exchanges
5. Error handling for Claude API failures with graceful degradation
6. Response time monitoring and optimization for model selection
7. Cost tracking and logging for Claude API usage
8. CLI testing interface for expense processing verification

### Story 1.5: Division Results and Confirmation

As a **user**,  
I want **clear visual summaries of calculated divisions with confirmation options**,  
so that **I can verify the splits are correct before sharing with my group**.

#### Acceptance Criteria

1. Visual division summary showing each person's amount in Brazilian Reais
2. One-click confirmation system for accepting calculated divisions
3. Edit capabilities for manual adjustments to calculated amounts
4. Conversation integration showing division results inline with chat
5. Export functionality for division results (text format for sharing)
6. Calculation verification with totals and balance checking
7. Clear error messages for invalid or unbalanced divisions
8. Responsive design optimized for mobile review and confirmation

## Epic 2: Intelligent Group Management

**Epic Goal**: Enable users to create and manage recurring groups with intelligent memory of preferences, patterns, and payment methods, making subsequent divisions faster and more personalized.

### Story 2.1: Group Creation and Member Management

As a **user**,  
I want **to create groups with my friends and manage member information**,  
so that **I don't have to re-enter the same people for recurring expenses**.

#### Acceptance Criteria

1. Group creation with name, description, and initial member list
2. Member addition with names and optional contact information
3. Group editing capabilities (add/remove members, change group details)
4. Group deletion with conversation history preservation options
5. Member role management (admin, member) for group modifications
6. Invitation system for new members to join existing groups
7. Group privacy settings and access control
8. CLI interface for group management testing and data verification

### Story 2.2: Payment Preferences and PIX Integration

As a **user**,  
I want **to set my payment preferences including PIX keys**,  
so that **RachaAI can suggest appropriate payment methods for my group**.

#### Acceptance Criteria

1. User profile payment preferences (PIX, bank transfer, cash, "pay later")
2. PIX key storage and management (email, phone, random key)
3. Payment limits and comfort zones ("accept owing up to R$50")
4. Payment method suggestions in division results
5. Privacy controls for payment information sharing within groups
6. Payment preference inheritance for group contexts
7. Validation and formatting for Brazilian payment data (CPF, phone numbers)
8. Secure storage of payment information with encryption

### Story 2.3: Conversation Memory and Context

As a **user**,  
I want **RachaAI to remember my groups and past interactions**,  
so that **subsequent conversations are faster and more intelligent**.

#### Acceptance Criteria

1. Conversation history storage with group and user associations
2. Pattern recognition for recurring scenarios (same restaurant, regular group meetups)
3. Smart suggestions based on historical data and group patterns
4. Context switching between different groups within conversations
5. Memory management with user-controlled data retention settings
6. Intelligent context loading without overwhelming conversation flow
7. Performance optimization for context retrieval and pattern matching
8. User controls for memory reset and data deletion

### Story 2.4: Group-Aware Expense Processing

As a **user**,  
I want **RachaAI to automatically recognize my group members and suggest appropriate divisions**,  
so that **I can quickly process expenses for recurring groups**.

#### Acceptance Criteria

1. Automatic group member recognition from conversation context
2. Smart division suggestions based on group history and patterns
3. Member-specific adjustments (regular discounts, different consumption patterns)
4. Group preference application (default split methods, payment arrangements)
5. Conflict resolution for ambiguous member references
6. Group context validation before applying historical patterns
7. Override capabilities for one-time adjustments to group patterns
8. Integration with payment preferences for complete division recommendations

## Epic 3: Brazilian Market Integration

**Epic Goal**: Implement Brazilian-specific features including LGPD compliance, cultural context processing, Portuguese language optimization, and local payment ecosystem integration.

### Story 3.1: LGPD Compliance and Privacy Controls

As a **Brazilian user**,  
I want **full control over my personal data with LGPD compliance**,  
so that **I can use RachaAI confidently knowing my privacy rights are respected**.

#### Acceptance Criteria

1. Explicit consent flows for data processing with granular permissions
2. Data portability features allowing export of all user data
3. Right to deletion with complete data removal and anonymization
4. Privacy dashboard showing data usage, retention, and processing activities
5. DPO contact information and data processing transparency
6. Consent withdrawal mechanisms with immediate effect
7. Data minimization implementation with automatic cleanup policies
8. Brazilian data residency validation and compliance reporting

### Story 3.2: Portuguese Language Optimization

As a **Brazilian user**,  
I want **RachaAI to understand Brazilian Portuguese expressions and cultural contexts perfectly**,  
so that **I can communicate naturally without worrying about translation or misunderstanding**.

#### Acceptance Criteria

1. Brazilian Portuguese-optimized prompting for Claude AI interactions
2. Regional expression recognition (SP, RJ, NE variations)
3. Currency parsing for Brazilian formats (R$, reais, pila)
4. Quantity interpretation for colloquial expressions ("uma galera", "nós quatro")
5. Code-switching support for Portuguese/English mixed conversations
6. Cultural scenario recognition (rodízio, happy hour, vaquinha, churrasco)
7. Contextual understanding of Brazilian social payment patterns
8. Error handling and clarification requests in appropriate language

### Story 3.3: Cultural Context and Social Patterns

As a **Brazilian user**,  
I want **RachaAI to understand Brazilian social dynamics and payment customs**,  
so that **divisions reflect realistic expectations and cultural norms**.

#### Acceptance Criteria

1. Recognition of cultural scenarios (birthday person doesn't pay, host covers drinks)
2. Understanding of Brazilian event types and their payment implications
3. Social hierarchy awareness (who typically pays, who splits)
4. Regional customs recognition and adaptation
5. Time-context awareness (jantar às 20h+, balada após 23h)
6. Gender and social dynamics sensitivity in payment suggestions
7. Corporate vs. friends context differentiation
8. Cultural education features for non-Brazilian users in mixed groups

### Story 3.4: PIX and Brazilian Payment Ecosystem

As a **user**,  
I want **seamless integration with PIX and Brazilian payment methods**,  
so that **I can easily execute the divisions RachaAI calculates**.

#### Acceptance Criteria

1. PIX key validation and formatting for all key types
2. Brazilian bank integration information and transfer instructions
3. QR code generation for PIX payments (future integration preparation)
4. Payment timing recommendations based on Brazilian banking hours
5. Regional bank and payment preference recognition
6. Payment confirmation workflows and tracking
7. Integration with popular Brazilian payment apps (preparation for future APIs)
8. Alternative payment method support (TED, DOC, cash logistics)

## Epic 4: Production Readiness & Optimization

**Epic Goal**: Optimize performance, implement comprehensive error handling, add analytics and monitoring, and establish robust deployment pipeline for production launch with 200+ concurrent users.

### Story 4.1: Performance Optimization and Caching

As a **user**,  
I want **fast responses from RachaAI even during peak usage times**,  
so that **my conversations flow naturally without frustrating delays**.

#### Acceptance Criteria

1. Redis caching implementation for active sessions and group context
2. Claude model routing optimization based on conversation complexity
3. Database query optimization with proper indexing and connection pooling
4. Frontend performance optimization with code splitting and lazy loading
5. CDN configuration for static assets with Brazilian edge locations
6. Response time monitoring with alerting for performance degradation
7. Conversation context compression and efficient storage
8. Load testing validation for 200+ concurrent users

### Story 4.2: Error Handling and Resilience

As a **user**,  
I want **RachaAI to handle errors gracefully and provide helpful feedback**,  
so that **I can continue using the service even when technical issues occur**.

#### Acceptance Criteria

1. Comprehensive error handling for Claude API failures with fallback responses
2. User-friendly error messages in Portuguese with recovery suggestions
3. Automatic retry mechanisms for transient failures
4. Graceful degradation when external services are unavailable
5. Connection loss handling with conversation state preservation
6. Data validation and sanitization for all user inputs
7. Error logging and monitoring with appropriate alerting
8. Recovery workflows for corrupted conversation state

### Story 4.3: Analytics and Monitoring

As a **product owner**,  
I want **comprehensive analytics on user behavior and system performance**,  
so that **I can optimize RachaAI based on real usage patterns and technical metrics**.

#### Acceptance Criteria

1. User interaction analytics (conversation patterns, feature usage, success rates)
2. Performance monitoring with response time tracking and error rate measurement
3. Claude API usage analytics with cost tracking and model effectiveness
4. Conversion funnel analysis (registration, first use, retention)
5. Brazilian market-specific metrics (regional usage, language preferences)
6. Privacy-compliant analytics with user consent and data anonymization
7. Real-time monitoring dashboard for system health
8. Business metrics tracking (user growth, engagement, retention)

### Story 4.4: Production Deployment and Operations

As a **system administrator**,  
I want **reliable deployment pipeline and operational monitoring**,  
so that **RachaAI runs consistently for Brazilian users with minimal downtime**.

#### Acceptance Criteria

1. Automated deployment pipeline with Brazilian region prioritization
2. Environment configuration management with secrets handling
3. Database migration system with rollback capabilities
4. Health check endpoints and uptime monitoring
5. Backup and disaster recovery procedures for Brazilian data residency
6. SSL certificate management and security headers configuration
7. Rate limiting and DDoS protection for API endpoints
8. Operational runbooks and incident response procedures

## Checklist Results Report

### PM Checklist Validation Summary

**Overall Assessment**: 92% Complete - Ready for Architecture Phase

| Category | Status | Pass Rate |
|----------|---------|-----------|
| Problem Definition & Context | ✅ PASS | 95% |
| MVP Scope Definition | ✅ PASS | 93% |
| User Experience Requirements | ✅ PASS | 90% |
| Functional Requirements | ✅ PASS | 94% |
| Non-Functional Requirements | ✅ PASS | 91% |
| Epic & Story Structure | ✅ PASS | 96% |
| Technical Guidance | ✅ PASS | 88% |
| Cross-Functional Requirements | ⚠️ PARTIAL | 78% |
| Clarity & Communication | ✅ PASS | 94% |

**Key Findings**:
- Excellent Brazilian market focus with LGPD compliance thoroughly addressed
- Well-sequenced epic structure following BMad methodology  
- Realistic MVP scope achievable in 6-8 week timeline
- Strong cost optimization strategy for Claude AI usage
- Minor enhancement needed: detailed data model specifications

**Recommendation**: Proceed to Architecture phase. Data model details can be refined during technical design.

## Next Steps

### UX Expert Prompt

"Please create a comprehensive UI/UX design specification for RachaAI based on this PRD. Focus on the conversational interface design, Brazilian cultural elements, and mobile-first responsive experience. Pay special attention to the chat interface UX, division result visualization, and group management workflows."

### Architect Prompt

"Please create a detailed technical architecture document for RachaAI based on this PRD. Focus on the Claude AI integration strategy, Brazilian compliance requirements (LGPD), performance optimization for 200+ concurrent users, and the monolithic-to-microservice evolution path. Include specific attention to conversation state management, caching strategy, and cost optimization for AI operations." 