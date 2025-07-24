# RachaAI Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for **RachaAI**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**Decision**: Next.js + Supabase starter template with Brazilian-specific optimizations

**Rationale**: Leverages proven patterns for authentication, database integration, and deployment while allowing customization for Claude AI integration and LGPD compliance requirements.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| Dec 2024 | 1.0 | Initial fullstack architecture for RachaAI | Winston (Architect) |

## High Level Architecture

### Technical Summary

RachaAI employs a modern **Jamstack architecture** with serverless backend functions, combining Next.js frontend with Supabase services and intelligent Claude AI integration. The system uses **Vercel Edge Functions** for API endpoints with Brazilian region optimization, **Supabase PostgreSQL** for structured data persistence, and **Redis** for high-performance conversation caching. The architecture prioritizes **conversation-first UX** with real-time chat interfaces, **cost-optimized Claude AI routing** (70% Haiku, 25% Sonnet, 5% Opus), and **LGPD-compliant data residency** in Brazilian AWS regions. This design achieves the PRD's target of <1.5s response times while supporting 200+ concurrent users through intelligent caching and edge deployment.

### Platform and Infrastructure Choice

**Platform**: Vercel + Supabase + AWS (Brazilian Regions)

**Key Services**:
- **Frontend Hosting**: Vercel Edge Network with São Paulo edge optimization
- **Backend Functions**: Vercel Edge Functions for API routes
- **Database**: Supabase PostgreSQL (AWS sa-east-1 São Paulo)
- **Cache**: Redis (AWS ElastiCache sa-east-1 for LGPD compliance)
- **AI Processing**: Claude API via Anthropic with cost optimization routing
- **File Storage**: Supabase Storage (S3-compatible, Brazilian regions)
- **Authentication**: Supabase Auth with custom LGPD consent flows

**Deployment Host and Regions**: Primary deployment in Brazilian regions (AWS sa-east-1) with Vercel global edge for frontend optimization

**Rationale**: This combination provides optimal Brazilian performance, LGPD compliance through data residency, rapid development velocity, and cost-effective scaling for AI-heavy workloads.

### Repository Structure

**Structure**: Monorepo with Turborepo
**Monorepo Tool**: Turborepo for build optimization and caching
**Package Organization**: Apps (web frontend, API edge functions) + Packages (shared types, UI components, utilities)

### High Level Architecture Diagram

```mermaid
graph TB
    User[Brazilian Users] --> Edge[Vercel Edge Network]
    Edge --> Frontend[Next.js Frontend<br/>São Paulo Edge]
    Frontend --> API[Edge Functions API<br/>Vercel Runtime]
    
    API --> Claude[Claude AI API<br/>Haiku/Sonnet/Opus]
    API --> Supabase[Supabase<br/>PostgreSQL + Auth]
    API --> Redis[Redis Cache<br/>AWS ElastiCache SP]
    
    subgraph "Brazilian Region (AWS sa-east-1)"
        Supabase
        Redis
        Storage[Supabase Storage<br/>S3-compatible]
    end
    
    API --> Storage
    Frontend --> Auth[Supabase Auth<br/>LGPD Compliant]
    
    subgraph "External Integrations"
        PIX[PIX APIs<br/>Future Integration]
        Analytics[Brazilian Analytics<br/>LGPD Compliant]
    end
    
    API --> PIX
    Frontend --> Analytics
```

### Architectural Patterns

- **Jamstack Architecture**: Static site generation with serverless APIs - _Rationale:_ Optimal performance and cost efficiency for conversational applications with edge deployment
- **Component-Based UI**: Reusable React components with TypeScript - _Rationale:_ Maintainability and type safety across conversational interface components
- **Service Layer Pattern**: Abstracted business logic from API routes - _Rationale:_ Enables testing and maintains separation between Claude AI integration and application logic
- **Repository Pattern**: Abstract data access for Supabase interactions - _Rationale:_ Enables testing and potential future database changes while maintaining LGPD compliance
- **Conversation State Management**: Immutable state with optimistic updates - _Rationale:_ Ensures responsive chat UX while maintaining data consistency
- **Intelligent Caching**: Multi-layer caching with Redis and Vercel edge - _Rationale:_ Achieves <1.5s response time targets while optimizing Claude AI costs
- **Cost-Aware AI Routing**: Dynamic model selection based on complexity - _Rationale:_ Balances response quality with cost optimization (70/25/5 distribution)

## Tech Stack

This is the DEFINITIVE technology selection for the entire project. All development must use these exact versions.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3.3 | Type-safe development | Essential for AI integration complexity and shared interfaces |
| **Frontend Framework** | Next.js | 14.0.4 | React framework with SSG/SSR | App Router, edge optimization, Brazilian region support |
| **UI Component Library** | Shadcn/ui | 0.8.0 | Modern component system | Customizable, accessible, works with Tailwind CSS |
| **State Management** | Zustand | 4.4.7 | Lightweight state management | Simple conversation state, optimal for real-time chat |
| **Backend Language** | TypeScript | 5.3.3 | Unified language across stack | Shared types between frontend/backend, AI integration |
| **Backend Framework** | Next.js API Routes | 14.0.4 | Serverless edge functions | Vercel optimization, Brazilian edge deployment |
| **API Style** | REST API | - | HTTP-based communication | Simple, cacheable, works well with Claude AI integration |
| **Database** | PostgreSQL (Supabase) | 15.1 | Relational database with real-time | Brazilian regions, LGPD compliance, real-time subscriptions |
| **Cache** | Redis (AWS ElastiCache) | 7.0 | High-performance caching | Conversation context, Claude cost optimization |
| **File Storage** | Supabase Storage | - | S3-compatible storage | Brazilian regions, LGPD compliant file handling |
| **Authentication** | Supabase Auth | 2.64.4 | Authentication with LGPD support | Built-in user management, customizable consent flows |
| **Frontend Testing** | Jest + React Testing Library | 29.7.0 + 14.1.2 | Component and integration testing | Conversation interface testing, accessibility validation |
| **Backend Testing** | Jest + Supertest | 29.7.0 + 6.3.3 | API and service testing | Claude integration testing, cost validation |
| **E2E Testing** | Playwright | 1.40.1 | End-to-end conversation testing | Cross-browser Brazilian user flows |
| **Build Tool** | Turbo | 1.11.2 | Monorepo build optimization | Fast builds, intelligent caching |
| **Bundler** | Webpack (Next.js) | 5.89.0 | Module bundling | Built into Next.js, optimized for edge deployment |
| **IaC Tool** | Terraform | 1.6.6 | Infrastructure as Code | AWS resource management for Brazilian compliance |
| **CI/CD** | GitHub Actions | - | Automated deployment | Vercel integration, Brazilian region deployment |
| **Monitoring** | Vercel Analytics + Sentry | 4.81.0 | Performance and error tracking | LGPD-compliant analytics, AI cost monitoring |
| **Logging** | Pino | 8.16.2 | Structured logging | Fast JSON logging, Brazilian timestamp format |
| **CSS Framework** | Tailwind CSS | 3.3.6 | Utility-first styling | Rapid UI development, Brazilian design customization |
| **Claude AI Integration** | @anthropic-ai/sdk | 0.9.1 | Claude API client | Official SDK for model routing and cost optimization |
| **Form Handling** | React Hook Form | 7.48.2 | Form management | Conversation input validation, Brazilian format support |
| **Date/Time** | date-fns | 3.0.6 | Date manipulation | Brazilian timezone support, Portuguese formatting |
| **Validation** | Zod | 3.22.4 | TypeScript-first validation | Shared validation between frontend/backend |

## Data Models

### User Model

**Purpose**: Represents Brazilian users with LGPD-compliant profile management and conversation preferences.

**Key Attributes**:
- id: string (UUID) - Unique identifier
- email: string - Authentication email
- name: string - Display name for conversations
- preferredLanguage: 'pt-BR' | 'en' - Language preference
- paymentPreferences: PaymentPrefs - PIX keys and payment methods
- privacySettings: PrivacySettings - LGPD consent and data retention preferences
- createdAt: timestamp - Account creation (Brazilian timezone)
- lastActiveAt: timestamp - Last activity for retention policies

#### TypeScript Interface

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  preferredLanguage: 'pt-BR' | 'en';
  paymentPreferences: PaymentPreferences;
  privacySettings: PrivacySettings;
  createdAt: Date;
  lastActiveAt: Date;
}

interface PaymentPreferences {
  pixKey?: string;
  preferredMethod: 'pix' | 'transfer' | 'cash' | 'later';
  comfortableOwingLimit: number; // Brazilian Real cents
  notes?: string; // "Só tenho PIX", "Prefiro dinheiro"
}

interface PrivacySettings {
  allowGroupMemory: boolean;
  allowPatternLearning: boolean;
  dataRetentionDays: number; // Default 90, user configurable
  consentTimestamp: Date;
}
```

#### Relationships
- Has many Groups (through GroupMembership)
- Has many Conversations
- Has many DivisionCalculations (as payer or participant)

### Group Model

**Purpose**: Represents recurring bill-splitting groups with member preferences and historical patterns.

**Key Attributes**:
- id: string (UUID) - Unique identifier
- name: string - Group display name ("Turma do Trabalho", "Família")
- description: string - Optional group description
- defaultSplitMethod: string - Preferred division approach
- culturalContext: string - Brazilian context tags
- isActive: boolean - Active status for privacy controls
- createdBy: string - User ID of creator

#### TypeScript Interface

```typescript
interface Group {
  id: string;
  name: string;
  description?: string;
  defaultSplitMethod: 'equal' | 'proportional' | 'custom';
  culturalContext: string[]; // ['restaurante', 'churrasco', 'happy-hour']
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  members: GroupMember[];
}

interface GroupMember {
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  nickname?: string;
  defaultAdjustment?: number; // Regular discount/premium
  joinedAt: Date;
}
```

#### Relationships
- Belongs to User (creator)
- Has many GroupMembers
- Has many Conversations
- Has many DivisionCalculations

### Conversation Model

**Purpose**: Stores conversational interactions with Claude AI for bill splitting, with LGPD-compliant retention.

**Key Attributes**:
- id: string (UUID) - Unique identifier
- userId: string - Conversation owner
- groupId: string - Associated group (optional)
- messages: Message[] - Conversation history
- contextSummary: string - Compressed context for Claude
- status: string - Conversation state
- retentionDate: Date - Automatic deletion date (LGPD)

#### TypeScript Interface

```typescript
interface Conversation {
  id: string;
  userId: string;
  groupId?: string;
  messages: ConversationMessage[];
  contextSummary?: string;
  status: 'active' | 'completed' | 'abandoned';
  retentionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  claudeModel?: 'haiku' | 'sonnet' | 'opus';
  processingTime?: number;
  cost?: number; // Brazilian Real cents
  timestamp: Date;
}
```

#### Relationships
- Belongs to User
- Belongs to Group (optional)
- Has many DivisionCalculations

### DivisionCalculation Model

**Purpose**: Stores calculated bill divisions with participant details and Brazilian payment information.

**Key Attributes**:
- id: string (UUID) - Unique identifier
- conversationId: string - Source conversation
- totalAmount: number - Total bill in Brazilian Real cents
- participants: Participant[] - Who owes what
- culturalContext: string - Brazilian scenario context
- calculationMethod: string - How division was calculated
- isConfirmed: boolean - User confirmation status

#### TypeScript Interface

```typescript
interface DivisionCalculation {
  id: string;
  conversationId: string;
  groupId?: string;
  totalAmount: number; // Brazilian Real cents
  participants: DivisionParticipant[];
  culturalContext?: string; // 'restaurante', 'churrasco', etc.
  calculationMethod: string;
  specialRules: string[]; // Applied adjustments
  isConfirmed: boolean;
  confirmedAt?: Date;
  createdAt: Date;
}

interface DivisionParticipant {
  userId?: string; // Null for non-users
  name: string;
  amount: number; // Brazilian Real cents
  paymentMethod?: 'pix' | 'transfer' | 'cash' | 'later';
  pixKey?: string;
  notes?: string;
}
```

#### Relationships
- Belongs to Conversation
- Belongs to Group (optional)
- References Users (for participants who are users)

## API Specification

### REST API Specification

```yaml
openapi: 3.0.0
info:
  title: RachaAI API
  version: 1.0.0
  description: Brazilian AI-powered bill splitting conversational API
servers:
  - url: https://racha-ai.vercel.app/api
    description: Production API (Brazilian edge optimized)

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        preferredLanguage:
          type: string
          enum: ['pt-BR', 'en']
        paymentPreferences:
          $ref: '#/components/schemas/PaymentPreferences'
    
    ConversationMessage:
      type: object
      properties:
        id:
          type: string
          format: uuid
        role:
          type: string
          enum: ['user', 'assistant']
        content:
          type: string
        claudeModel:
          type: string
          enum: ['haiku', 'sonnet', 'opus']
        timestamp:
          type: string
          format: date-time

paths:
  /auth/session:
    get:
      summary: Get current user session
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Current user session
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /conversations:
    post:
      summary: Create new conversation
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                groupId:
                  type: string
                  format: uuid
                  required: false
                initialMessage:
                  type: string
                  required: true
      responses:
        '201':
          description: Conversation created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                  messages:
                    type: array
                    items:
                      $ref: '#/components/schemas/ConversationMessage'

  /conversations/{id}/messages:
    post:
      summary: Send message to conversation
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                content:
                  type: string
                  required: true
      responses:
        '200':
          description: Claude AI response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ConversationMessage'

  /groups:
    get:
      summary: List user groups
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User groups list
    
    post:
      summary: Create new group
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  required: true
                members:
                  type: array
                  items:
                    type: string

  /divisions/{id}/confirm:
    post:
      summary: Confirm division calculation
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Division confirmed
```

## Components

### Claude AI Service

**Responsibility**: Intelligent conversation processing with cost-optimized model routing for Brazilian Portuguese bill splitting scenarios.

**Key Interfaces**:
- `processMessage(content: string, context: ConversationContext): Promise<ClaudeResponse>`
- `selectOptimalModel(complexity: MessageComplexity): ClaudeModel`
- `estimateCost(model: ClaudeModel, tokens: number): number`

**Dependencies**: Anthropic SDK, Redis (context caching), conversation history service

**Technology Stack**: TypeScript, @anthropic-ai/sdk, custom model routing algorithm

### Conversation Management Service

**Responsibility**: Manages conversation state, context compression, and LGPD-compliant message retention.

**Key Interfaces**:
- `createConversation(userId: string, groupId?: string): Promise<Conversation>`
- `addMessage(conversationId: string, message: ConversationMessage): Promise<void>`
- `getConversationContext(conversationId: string): Promise<ConversationContext>`
- `cleanupExpiredConversations(): Promise<number>`

**Dependencies**: Supabase database, Redis cache, Claude AI service

**Technology Stack**: TypeScript, Supabase client, Redis client, LGPD retention policies

### Group Management Service

**Responsibility**: Handles recurring groups, member management, and pattern learning for improved suggestions.

**Key Interfaces**:
- `createGroup(name: string, creatorId: string, members: string[]): Promise<Group>`
- `addGroupMember(groupId: string, userId: string): Promise<void>`
- `getGroupPatterns(groupId: string): Promise<GroupPattern[]>`
- `updateGroupPreferences(groupId: string, preferences: GroupPreferences): Promise<void>`

**Dependencies**: Supabase database, user service, conversation service

**Technology Stack**: TypeScript, Supabase client, pattern analysis algorithms

### Division Calculation Service

**Responsibility**: Processes Claude AI outputs into structured division calculations with Brazilian payment method integration.

**Key Interfaces**:
- `calculateDivision(description: string, context: GroupContext): Promise<DivisionCalculation>`
- `applyBrazilianRules(division: DivisionCalculation): Promise<DivisionCalculation>`
- `generatePaymentInstructions(division: DivisionCalculation): Promise<PaymentInstruction[]>`
- `exportDivision(divisionId: string, format: ExportFormat): Promise<string>`

**Dependencies**: Claude AI service, group service, payment preferences service

**Technology Stack**: TypeScript, Brazilian currency formatting, PIX integration preparation

### Authentication & LGPD Service

**Responsibility**: Manages user authentication with Brazilian LGPD compliance including consent management and data retention.

**Key Interfaces**:
- `authenticateUser(credentials: UserCredentials): Promise<AuthResult>`
- `recordConsent(userId: string, consentType: ConsentType): Promise<void>`
- `processDataDeletion(userId: string): Promise<DeletionReport>`
- `exportUserData(userId: string): Promise<UserDataExport>`

**Dependencies**: Supabase Auth, database service, conversation service

**Technology Stack**: TypeScript, Supabase Auth, LGPD compliance utilities

### Component Diagrams

```mermaid
graph TD
    Frontend[Next.js Frontend] --> AuthService[Auth & LGPD Service]
    Frontend --> ConversationUI[Conversation UI]
    
    ConversationUI --> ConversationService[Conversation Management]
    ConversationService --> ClaudeService[Claude AI Service]
    ConversationService --> Redis[Redis Cache]
    
    ClaudeService --> DivisionService[Division Calculation]
    DivisionService --> GroupService[Group Management]
    
    AuthService --> Supabase[Supabase Database]
    ConversationService --> Supabase
    GroupService --> Supabase
    DivisionService --> Supabase
    
    ClaudeService --> Claude[Claude API]
    
    subgraph "Brazilian Compliance"
        LGPD[LGPD Controls]
        DataRetention[Data Retention]
        ConsentMgmt[Consent Management]
    end
    
    AuthService --> LGPD
    ConversationService --> DataRetention
    AuthService --> ConsentMgmt
```

## External APIs

### Claude AI API

- **Purpose**: Natural language processing for Portuguese bill splitting conversations
- **Documentation**: https://docs.anthropic.com/claude/reference/
- **Base URL(s)**: https://api.anthropic.com/v1/
- **Authentication**: Bearer token (API key)
- **Rate Limits**: 5,000 requests/minute (paid tier)

**Key Endpoints Used**:
- `POST /messages` - Send conversation messages for processing
- `GET /models` - List available models for routing decisions

**Integration Notes**: Implement intelligent model routing (70% Haiku, 25% Sonnet, 5% Opus) with cost tracking and Brazilian Portuguese optimization prompts.

### Supabase API

- **Purpose**: Database operations, authentication, and real-time subscriptions
- **Documentation**: https://supabase.com/docs/reference/javascript/
- **Base URL(s)**: https://[project-id].supabase.co/rest/v1/
- **Authentication**: Bearer token (anon key for client, service key for server)
- **Rate Limits**: Varies by plan, 100,000 requests/month on free tier

**Key Endpoints Used**:
- `POST /auth/v1/token` - User authentication
- `GET/POST /rest/v1/conversations` - Conversation CRUD operations
- `GET/POST /rest/v1/groups` - Group management
- `POST /rest/v1/rpc/cleanup_expired_conversations` - LGPD cleanup

**Integration Notes**: Configure Brazilian region (AWS sa-east-1), implement Row Level Security for LGPD compliance, use real-time subscriptions for conversation updates.

### PIX API (Future Integration)

- **Purpose**: Brazilian instant payment integration for completing bill splits
- **Documentation**: TBD (Banco Central do Brasil specifications)
- **Base URL(s)**: TBD (bank-specific endpoints)
- **Authentication**: Bank-specific OAuth or certificate-based
- **Rate Limits**: Bank-specific limitations

**Key Endpoints Used**:
- `POST /pix/instant-payment` - Create PIX payment
- `GET /pix/qr-code` - Generate PIX QR codes
- `POST /pix/payment-status` - Check payment status

**Integration Notes**: Future Epic 5 implementation, requires bank partnerships and regulatory compliance, prepare data structures for PIX key validation.

## Core Workflows

### Conversation Flow with Claude AI Integration

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Claude
    participant Redis
    participant Supabase
    
    User->>Frontend: Types expense description
    Frontend->>API: POST /conversations/{id}/messages
    
    API->>Redis: Check conversation context
    Redis-->>API: Return cached context
    
    API->>Claude: Send message with context
    Note over Claude: Model routing: Haiku (70%), Sonnet (25%), Opus (5%)
    Claude-->>API: AI response with division calculation
    
    API->>Supabase: Save message + calculation
    API->>Redis: Update conversation context
    
    API-->>Frontend: Return Claude response
    Frontend-->>User: Display division summary
    
    User->>Frontend: Confirms division
    Frontend->>API: POST /divisions/{id}/confirm
    API->>Supabase: Mark division as confirmed
    API-->>Frontend: Confirmation success
    Frontend-->>User: Show payment instructions
```

### Group Memory and Pattern Learning

```mermaid
sequenceDiagram
    participant User
    participant API
    participant GroupService
    participant Claude
    participant Supabase
    
    User->>API: Start conversation with group context
    API->>GroupService: Get group patterns
    GroupService->>Supabase: Query group history
    Supabase-->>GroupService: Return patterns
    
    GroupService-->>API: Group context + patterns
    API->>Claude: Send message with group intelligence
    Note over Claude: "This group usually splits equally, João often pays extra"
    
    Claude-->>API: Intelligent response using patterns
    API->>GroupService: Update group patterns
    GroupService->>Supabase: Save new pattern data
```

### LGPD Data Retention and Cleanup

```mermaid
sequenceDiagram
    participant Scheduler
    participant API
    participant ConversationService
    participant Supabase
    
    Scheduler->>API: Daily cleanup job
    API->>ConversationService: cleanupExpiredConversations()
    
    ConversationService->>Supabase: Query expired conversations
    Supabase-->>ConversationService: Return conversations to delete
    
    ConversationService->>Supabase: Delete messages (90+ days)
    ConversationService->>Supabase: Anonymize division calculations
    ConversationService->>Supabase: Update retention logs
    
    ConversationService-->>API: Cleanup report
    Note over API: Log for LGPD compliance audit
```

## Database Schema

```sql
-- Users table with LGPD compliance
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'pt-BR',
    payment_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{"allowGroupMemory": true, "dataRetentionDays": 90}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- LGPD compliance
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_retention_date TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (created_at + (privacy_settings->>'dataRetentionDays')::integer * interval '1 day') STORED
);

-- Groups for recurring bill splitting
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_split_method VARCHAR(50) DEFAULT 'equal',
    cultural_context TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group membership with roles
CREATE TABLE group_members (
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    nickname VARCHAR(100),
    default_adjustment INTEGER DEFAULT 0, -- Brazilian Real cents
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (group_id, user_id)
);

-- Conversations with Claude AI
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    context_summary TEXT,
    status VARCHAR(20) DEFAULT 'active',
    retention_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual messages in conversations
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    claude_model VARCHAR(20), -- 'haiku', 'sonnet', 'opus'
    processing_time_ms INTEGER,
    cost_cents INTEGER, -- Brazilian Real cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_conversation_messages_conversation_id (conversation_id),
    INDEX idx_conversation_messages_created_at (created_at)
);

-- Division calculations with Brazilian context
CREATE TABLE division_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    total_amount_cents INTEGER NOT NULL, -- Brazilian Real cents
    calculation_method VARCHAR(100) NOT NULL,
    cultural_context VARCHAR(100),
    special_rules TEXT[] DEFAULT '{}',
    is_confirmed BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants in division calculations
CREATE TABLE division_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID REFERENCES division_calculations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    amount_cents INTEGER NOT NULL, -- Brazilian Real cents
    payment_method VARCHAR(50),
    pix_key VARCHAR(255),
    notes TEXT,
    
    INDEX idx_division_participants_division_id (division_id)
);

-- Group patterns for AI learning (anonymized after retention)
CREATE TABLE group_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    pattern_type VARCHAR(100) NOT NULL, -- 'default_split', 'member_adjustment', 'cultural_context'
    pattern_data JSONB NOT NULL,
    frequency INTEGER DEFAULT 1,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_group_patterns_group_id (group_id),
    INDEX idx_group_patterns_type (pattern_type)
);

-- LGPD audit log
CREATE TABLE lgpd_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'consent_given', 'data_exported', 'data_deleted'
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for LGPD compliance
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can access own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can access own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own messages" ON conversation_messages FOR ALL USING (
    auth.uid() = (SELECT user_id FROM conversations WHERE id = conversation_id)
);
```

## Frontend Architecture

### Component Architecture

#### Component Organization

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (shadcn/ui)
│   ├── conversation/    # Chat-specific components
│   ├── division/        # Bill division components
│   ├── group/           # Group management components
│   ├── auth/            # Authentication components
│   └── common/          # Shared components
├── pages/               # Next.js pages (App Router)
├── hooks/               # Custom React hooks
├── services/            # API client services
├── stores/              # Zustand state management
├── utils/               # Frontend utilities
└── types/               # TypeScript type definitions
```

#### Component Template

```typescript
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ConversationMessageProps {
  message: ConversationMessage;
  isUser: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ConversationMessage({ 
  message, 
  isUser, 
  onRetry,
  className 
}: ConversationMessageProps) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isUser && message.content) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message.content, isUser]);

  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-blue-500 text-white" 
          : "bg-gray-100 text-gray-900"
      )}>
        {isTyping ? (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        
        {!isUser && message.claudeModel && (
          <span className="text-xs text-gray-500 mt-1 block">
            Claude {message.claudeModel}
          </span>
        )}
      </div>
    </div>
  );
}
```

### State Management Architecture

#### State Structure

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Conversation state
interface ConversationState {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createConversation: (groupId?: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => void;
  clearError: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      currentConversation: null,
      conversations: [],
      isLoading: false,
      error: null,

      createConversation: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await conversationService.create({ groupId });
          set((state) => ({
            currentConversation: response.data,
            conversations: [response.data, ...state.conversations],
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      sendMessage: async (content) => {
        const { currentConversation } = get();
        if (!currentConversation) return;

        set({ isLoading: true, error: null });
        try {
          const response = await conversationService.sendMessage(
            currentConversation.id,
            content
          );
          
          set((state) => ({
            currentConversation: {
              ...state.currentConversation!,
              messages: [...state.currentConversation!.messages, response.data]
            },
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // ... other actions
    }),
    {
      name: 'conversation-store',
      partialize: (state) => ({
        conversations: state.conversations.slice(0, 10) // Keep only recent conversations
      })
    }
  )
);

// User state with LGPD considerations
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  privacySettings: PrivacySettings | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  requestDataExport: () => Promise<void>;
  requestDataDeletion: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  privacySettings: null,
  
  // ... actions implementation
}));
```

#### State Management Patterns
- Immutable updates with Zustand's set function
- Persistent conversation history (limited for privacy)
- Optimistic updates for chat messages
- Error boundaries with user-friendly messages in Portuguese
- LGPD-compliant data management with automatic cleanup

### Routing Architecture

#### Route Organization

```
app/                     # Next.js App Router
├── (auth)/             # Authentication routes
│   ├── login/
│   └── register/
├── (dashboard)/        # Main application
│   ├── conversations/
│   ├── groups/
│   ├── profile/
│   └── privacy/        # LGPD controls
├── api/                # API routes
│   ├── auth/
│   ├── conversations/
│   ├── groups/
│   └── claude/
└── globals.css
```

#### Protected Route Pattern

```typescript
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        {/* Navigation */}
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### Frontend Services Layer

#### API Client Setup

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// API client with authentication
class ApiClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        'Authorization': `Bearer ${session.access_token}`
      })
    };
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // ... other HTTP methods
}

export const apiClient = new ApiClient();
```

#### Service Example

```typescript
import { apiClient } from './api-client';
import type { Conversation, ConversationMessage } from '@/types';

export const conversationService = {
  async create(data: { groupId?: string; initialMessage?: string }): Promise<{ data: Conversation }> {
    return apiClient.post('/conversations', data);
  },

  async sendMessage(conversationId: string, content: string): Promise<{ data: ConversationMessage }> {
    return apiClient.post(`/conversations/${conversationId}/messages`, { content });
  },

  async getConversations(): Promise<{ data: Conversation[] }> {
    return apiClient.get('/conversations');
  },

  async getConversation(id: string): Promise<{ data: Conversation }> {
    return apiClient.get(`/conversations/${id}`);
  },

  // Real-time subscription for conversation updates
  subscribeToConversation(conversationId: string, callback: (message: ConversationMessage) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => callback(payload.new as ConversationMessage)
      )
      .subscribe();
  }
};
```

## Backend Architecture

### Service Architecture

#### API Route Organization

```
pages/api/              # Next.js API routes
├── auth/               # Authentication endpoints
│   ├── session.ts
│   └── logout.ts
├── conversations/      # Conversation management
│   ├── index.ts        # List/create conversations
│   ├── [id].ts         # Get/update conversation
│   └── [id]/messages.ts # Send messages
├── groups/             # Group management
│   ├── index.ts
│   ├── [id].ts
│   └── [id]/members.ts
├── divisions/          # Division calculations
│   ├── [id]/confirm.ts
│   └── [id]/export.ts
├── claude/             # Claude AI integration
│   ├── process.ts
│   └── cost-analytics.ts
└── lgpd/               # LGPD compliance
    ├── export-data.ts
    └── delete-data.ts
```

#### API Route Template

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { conversationService } from '@/services/conversation';
import { withAuth } from '@/middleware/auth';
import { withErrorHandler } from '@/middleware/error-handler';
import { withCors } from '@/middleware/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  
  if (req.method === 'POST') {
    const { groupId, initialMessage } = req.body;
    
    try {
      const conversation = await conversationService.create({
        userId: req.user.id,
        groupId,
        initialMessage
      });
      
      res.status(201).json({ data: conversation });
    } catch (error) {
      throw error; // Will be handled by error middleware
    }
  } else if (req.method === 'GET') {
    const conversations = await conversationService.getByUserId(req.user.id);
    res.status(200).json({ data: conversations });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end('Method Not Allowed');
  }
}

export default withCors(withAuth(withErrorHandler(handler)));
```

### Database Architecture

#### Data Access Layer

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Repository pattern for conversations
export class ConversationRepository {
  async create(data: {
    userId: string;
    groupId?: string;
    initialMessage?: string;
  }): Promise<Conversation> {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: data.userId,
        group_id: data.groupId,
        status: 'active',
        retention_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create conversation: ${error.message}`);

    // Add initial message if provided
    if (data.initialMessage) {
      await this.addMessage(conversation.id, {
        role: 'user',
        content: data.initialMessage
      });
    }

    return this.mapToConversation(conversation);
  }

  async addMessage(conversationId: string, message: {
    role: 'user' | 'assistant';
    content: string;
    claudeModel?: string;
    processingTime?: number;
    cost?: number;
  }): Promise<ConversationMessage> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        claude_model: message.claudeModel,
        processing_time_ms: message.processingTime,
        cost_cents: message.cost
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add message: ${error.message}`);
    
    return this.mapToMessage(data);
  }

  async getByUserId(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_messages (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get conversations: ${error.message}`);
    
    return data.map(this.mapToConversation);
  }

  // LGPD compliance methods
  async cleanupExpired(): Promise<number> {
    const { data, error } = await supabase
      .from('conversations')
      .delete()
      .lt('retention_date', new Date().toISOString())
      .select('id');

    if (error) throw new Error(`Failed to cleanup conversations: ${error.message}`);
    
    return data.length;
  }

  private mapToConversation(data: any): Conversation {
    return {
      id: data.id,
      userId: data.user_id,
      groupId: data.group_id,
      messages: data.conversation_messages?.map(this.mapToMessage) || [],
      contextSummary: data.context_summary,
      status: data.status,
      retentionDate: new Date(data.retention_date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapToMessage(data: any): ConversationMessage {
    return {
      id: data.id,
      role: data.role,
      content: data.content,
      claudeModel: data.claude_model,
      processingTime: data.processing_time_ms,
      cost: data.cost_cents,
      timestamp: new Date(data.created_at)
    };
  }
}

export const conversationRepository = new ConversationRepository();
```

### Authentication and Authorization

#### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase
    participant API
    participant Database
    
    User->>Frontend: Login with email/password
    Frontend->>Supabase: Auth request
    Supabase-->>Frontend: JWT + Refresh Token
    
    Frontend->>API: Request with Bearer token
    API->>Supabase: Validate JWT
    Supabase-->>API: User session
    
    API->>Database: Query with RLS policies
    Note over Database: Row Level Security filters by user_id
    Database-->>API: User's data only
    
    API-->>Frontend: Authorized response
    Frontend-->>User: Display data
```

#### Authentication Middleware

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export function withAuth<T extends AuthenticatedRequest>(
  handler: (req: T, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res });
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || 'unknown'
        }
      });
    }

    // Add user info to request
    (req as T).user = {
      id: session.user.id,
      email: session.user.email!,
      role: session.user.user_metadata?.role || 'user'
    };

    return handler(req as T, res);
  };
}

// LGPD consent verification middleware
export function withLGPDConsent<T extends AuthenticatedRequest>(
  handler: (req: T, res: NextApiResponse) => Promise<void>
) {
  return async (req: T, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res });
    
    const { data: user, error } = await supabase
      .from('users')
      .select('privacy_settings')
      .eq('id', req.user.id)
      .single();

    if (error || !user?.privacy_settings?.consentTimestamp) {
      return res.status(403).json({
        error: {
          code: 'CONSENT_REQUIRED',
          message: 'LGPD consent required for this operation',
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || 'unknown'
        }
      });
    }

    return handler(req, res);
  };
}
```

## Unified Project Structure

```
racha-ai/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yml              # Test and build
│       ├── deploy-staging.yml  # Staging deployment
│       └── deploy-prod.yml     # Production deployment
├── apps/                       # Application packages
│   └── web/                    # Next.js frontend + API
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (auth)/     # Auth pages
│       │   │   ├── (dashboard)/ # Main app pages
│       │   │   ├── api/        # API routes
│       │   │   ├── globals.css
│       │   │   └── layout.tsx
│       │   ├── components/     # React components
│       │   │   ├── ui/         # Basic UI (shadcn/ui)
│       │   │   ├── conversation/
│       │   │   ├── division/
│       │   │   ├── group/
│       │   │   └── auth/
│       │   ├── hooks/          # Custom React hooks
│       │   ├── services/       # API client services
│       │   ├── stores/         # Zustand state management
│       │   ├── middleware/     # API middleware
│       │   ├── utils/          # Utilities
│       │   └── types/          # TypeScript types
│       ├── public/             # Static assets
│       ├── tests/              # Frontend tests
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── package.json
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types/utilities
│   │   ├── src/
│   │   │   ├── types/          # Shared TypeScript interfaces
│   │   │   ├── constants/      # Brazilian constants (currencies, etc.)
│   │   │   ├── utils/          # Shared utility functions
│   │   │   └── validation/     # Zod schemas
│   │   └── package.json
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   └── styles/         # Shared styles
│   │   └── package.json
│   └── config/                 # Shared configuration
│       ├── eslint/             # ESLint config
│       ├── typescript/         # TypeScript config
│       ├── tailwind/           # Tailwind config
│       └── jest/               # Jest config
├── infrastructure/             # Infrastructure as Code
│   ├── terraform/              # AWS resources for Brazilian regions
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── scripts/                # Deployment scripts
├── scripts/                    # Monorepo management scripts
│   ├── build.sh
│   ├── test.sh
│   └── deploy.sh
├── docs/                       # Documentation
│   ├── prd.md
│   ├── architecture.md
│   ├── api-documentation.md
│   └── lgpd-compliance.md
├── .env.example                # Environment template
├── .gitignore
├── package.json                # Root package.json with workspaces
├── turbo.json                  # Turborepo configuration
├── README.md                   # Project README with Brazilian setup
└── LICENSE
```

## Development Workflow

### Local Development Setup

#### Prerequisites

```bash
# Install Node.js (LTS version)
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 20.10.0
fnm use 20.10.0

# Install pnpm for monorepo management
npm install -g pnpm

# Install Turborepo globally
npm install -g turbo
```

#### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/racha-ai.git
cd racha-ai

# Install all dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Set up Supabase (Brazilian region)
pnpm supabase:setup

# Run database migrations
pnpm db:migrate

# Seed with Brazilian test data
pnpm db:seed
```

#### Development Commands

```bash
# Start all services (frontend + API)
pnpm dev

# Start frontend only
pnpm dev:web

# Start API development server only
pnpm dev:api

# Run tests
pnpm test          # All tests
pnpm test:unit     # Unit tests only
pnpm test:e2e      # E2E tests only
pnpm test:watch    # Watch mode

# Build for production
pnpm build

# Lint and format
pnpm lint
pnpm format

# Type checking
pnpm type-check

# Clean build artifacts
pnpm clean
```

### Environment Configuration

#### Required Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://racha-ai.vercel.app

# Backend (.env)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-claude-api-key
REDIS_URL=redis://localhost:6379

# Shared
DATABASE_URL=postgresql://user:pass@localhost:5432/racha_ai
ENVIRONMENT=development
LOG_LEVEL=debug

# Brazilian-specific
TIMEZONE=America/Sao_Paulo
CURRENCY=BRL
LOCALE=pt-BR

# LGPD Compliance
DATA_RETENTION_DAYS=90
DPO_EMAIL=dpo@racha-ai.com.br
PRIVACY_POLICY_URL=https://racha-ai.com.br/privacy
```

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform**: Vercel with Brazilian edge optimization
- **Build Command**: `turbo build --filter=web`
- **Output Directory**: `apps/web/.next`
- **CDN/Edge**: Vercel Edge Network with São Paulo priority

**Backend Deployment:**
- **Platform**: Vercel Edge Functions (serverless)
- **Build Command**: Next.js API routes compilation
- **Deployment Method**: Git-based deployment with Brazilian region configuration

### CI/CD Pipeline

```yaml
name: Deploy to Production (Brazilian Regions)

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Type check
        run: pnpm type-check
      
      - name: Lint
        run: pnpm lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
        env:
          VERCEL_ENV: production
          VERCEL_REGIONS: gru1,sao1  # Brazilian regions
          
      - name: Update Supabase (Brazilian region)
        run: |
          pnpm supabase db push --db-url ${{ secrets.PROD_DATABASE_URL }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          
      - name: Clear Redis cache
        run: |
          redis-cli -u ${{ secrets.PROD_REDIS_URL }} FLUSHDB
```

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3000/api | Local development |
| Staging | https://staging.racha-ai.vercel.app | https://staging.racha-ai.vercel.app/api | Pre-production testing |
| Production | https://racha-ai.com.br | https://api.racha-ai.com.br | Live environment |

## Security and Performance

### Security Requirements

**Frontend Security:**
- CSP Headers: `default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://api.anthropic.com`
- XSS Prevention: Automatic escaping with React, input sanitization
- Secure Storage: HTTP-only cookies for sessions, encrypted localStorage for preferences

**Backend Security:**
- Input Validation: Zod schemas for all API inputs, SQL injection prevention
- Rate Limiting: 100 requests/minute per user, 10 Claude calls/minute
- CORS Policy: Brazilian domains only, credentials allowed for authentication

**Authentication Security:**
- Token Storage: HTTP-only cookies with secure flag, Brazilian timezone expiration
- Session Management: Supabase Auth with custom LGPD consent flows
- Password Policy: Minimum 8 characters, complexity requirements, Brazilian LGPD compliance

### Performance Optimization

**Frontend Performance:**
- Bundle Size Target: <300KB initial bundle, code splitting by route
- Loading Strategy: Incremental static regeneration, optimistic updates for chat
- Caching Strategy: Service worker for offline support, Vercel edge caching

**Backend Performance:**
- Response Time Target: <1.5s average (PRD requirement), <500ms for cached responses
- Database Optimization: Proper indexing, connection pooling, read replicas in São Paulo
- Caching Strategy: Redis for conversation context (15min TTL), Claude response caching (1h TTL)

## Testing Strategy

### Testing Pyramid

```
              E2E Tests (5%)
             /              \
        Integration Tests (25%)
           /                    \
    Frontend Unit (35%)  Backend Unit (35%)
```

### Test Organization

#### Frontend Tests

```
apps/web/tests/
├── __tests__/              # Unit tests
│   ├── components/         # Component tests
│   ├── hooks/              # Custom hook tests
│   ├── utils/              # Utility function tests
│   └── stores/             # State management tests
├── integration/            # Integration tests
│   ├── api/                # API integration tests
│   ├── auth/               # Authentication flow tests
│   └── conversation/       # Conversation flow tests
└── e2e/                    # End-to-end tests
    ├── conversation.spec.ts # Complete conversation flows
    ├── group.spec.ts       # Group management
    └── lgpd.spec.ts        # LGPD compliance flows
```

#### Backend Tests

```
apps/web/tests/api/
├── __tests__/              # Unit tests
│   ├── services/           # Service layer tests
│   ├── repositories/       # Database tests
│   ├── middleware/         # Middleware tests
│   └── utils/              # Utility tests
├── integration/            # Integration tests
│   ├── claude/             # Claude AI integration
│   ├── supabase/           # Database integration
│   └── redis/              # Cache integration
└── fixtures/               # Test data
    ├── conversations.json
    ├── groups.json
    └── users.json
```

### Test Examples

#### Frontend Component Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConversationMessage } from '@/components/conversation/ConversationMessage';
import type { ConversationMessage as MessageType } from '@/types';

const mockMessage: MessageType = {
  id: '123',
  role: 'assistant',
  content: 'Entendi! Dividindo R$ 180 entre 4 pessoas...',
  claudeModel: 'haiku',
  processingTime: 1200,
  timestamp: new Date()
};

describe('ConversationMessage', () => {
  it('displays Claude AI response with model info', () => {
    render(
      <ConversationMessage 
        message={mockMessage} 
        isUser={false} 
      />
    );
    
    expect(screen.getByText(/Dividindo R\$ 180/)).toBeInTheDocument();
    expect(screen.getByText('Claude haiku')).toBeInTheDocument();
  });

  it('shows typing animation for new AI messages', async () => {
    render(
      <ConversationMessage 
        message={{ ...mockMessage, content: '' }} 
        isUser={false} 
      />
    );
    
    expect(screen.getByText(/•{3}/)).toBeInTheDocument(); // Typing dots
    
    // Update with content
    render(
      <ConversationMessage 
        message={mockMessage} 
        isUser={false} 
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByText(/•{3}/)).not.toBeInTheDocument();
    });
  });

  it('formats Brazilian currency correctly', () => {
    const message = {
      ...mockMessage,
      content: 'Total: R$ 1.234,56 para dividir'
    };
    
    render(<ConversationMessage message={message} isUser={false} />);
    expect(screen.getByText(/R\$ 1\.234,56/)).toBeInTheDocument();
  });
});
```

#### Backend API Test

```typescript
import request from 'supertest';
import { createTestApp } from '@/test-utils/app';
import { createTestUser, createTestConversation } from '@/test-utils/fixtures';

describe('/api/conversations', () => {
  let app: any;
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    app = await createTestApp();
    testUser = await createTestUser();
    authToken = testUser.accessToken;
  });

  describe('POST /api/conversations', () => {
    it('creates new conversation with Brazilian user', async () => {
      const response = await request(app)
        .post('/api/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          initialMessage: 'Acabei de pagar R$ 180 no jantar'
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: 'Acabei de pagar R$ 180 no jantar'
          })
        ])
      });
    });

    it('enforces LGPD data retention policy', async () => {
      const response = await request(app)
        .post('/api/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ initialMessage: 'Test message' });

      const conversation = response.body.data;
      const retentionDate = new Date(conversation.retentionDate);
      const expectedDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      
      expect(retentionDate.getTime()).toBeCloseTo(expectedDate.getTime(), -1000);
    });
  });

  describe('POST /api/conversations/:id/messages', () => {
    it('processes Portuguese message with Claude AI', async () => {
      const conversation = await createTestConversation(testUser.id);
      
      const response = await request(app)
        .post(`/api/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Fomos em 4 pessoas no restaurante'
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        role: 'assistant',
        content: expect.stringContaining('4 pessoas'),
        claudeModel: expect.oneOf(['haiku', 'sonnet', 'opus'])
      });
    });

    it('tracks Claude AI costs in Brazilian currency', async () => {
      const conversation = await createTestConversation(testUser.id);
      
      const response = await request(app)
        .post(`/api/conversations/${conversation.id}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Complex bill splitting scenario...'
        });

      expect(response.body.data.cost).toBeGreaterThan(0);
      expect(typeof response.body.data.cost).toBe('number'); // Brazilian Real cents
    });
  });
});
```

#### E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('RachaAI Conversation Flow', () => {
  test('complete bill splitting conversation in Portuguese', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');

    // Start new conversation
    await page.click('[data-testid=new-conversation]');
    
    // Send expense description in Portuguese
    const messageInput = page.locator('[data-testid=message-input]');
    await messageInput.fill('Acabei de pagar R$ 180 no jantar do restaurante. Éramos 4 pessoas: eu, Maria, João e Ana. A Maria só bebeu água, então ela paga R$ 20 a menos.');
    await messageInput.press('Enter');

    // Wait for Claude AI response
    await expect(page.locator('[data-testid=ai-message]')).toContainText('Entendi!', { timeout: 5000 });
    await expect(page.locator('[data-testid=ai-message]')).toContainText('R$ 180');
    await expect(page.locator('[data-testid=ai-message]')).toContainText('4 pessoas');

    // Verify division calculation display
    await expect(page.locator('[data-testid=division-summary]')).toBeVisible();
    await expect(page.locator('[data-testid=participant-amount]')).toContainText('Maria');
    
    // Confirm division
    await page.click('[data-testid=confirm-division]');
    await expect(page.locator('[data-testid=confirmation-success]')).toBeVisible();

    // Check payment instructions
    await expect(page.locator('[data-testid=payment-instructions]')).toContainText('PIX');
  });

  test('LGPD privacy controls work correctly', async ({ page, context }) => {
    await page.goto('/privacy');
    
    // Test data export
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid=export-data]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('racha-ai-data');

    // Test data deletion
    await page.click('[data-testid=delete-account]');
    await page.fill('[data-testid=delete-confirmation]', 'EXCLUIR');
    await page.click('[data-testid=confirm-deletion]');
    
    // Verify logout and data deletion
    await expect(page).toHaveURL('/login');
  });
});
```

## Coding Standards

### Critical Fullstack Rules

- **Type Sharing**: Always define shared types in `packages/shared/src/types` and import from `@racha-ai/shared/types` - never duplicate interfaces between frontend and backend
- **API Calls**: Never make direct fetch calls - always use the service layer (`@/services/*`) for consistent error handling and authentication
- **Environment Variables**: Access only through config objects (`@/config/*`), never `process.env` directly in components or business logic
- **Error Handling**: All API routes must use the standard error handler middleware with Brazilian Portuguese error messages for user-facing errors
- **State Updates**: Never mutate Zustand state directly - use proper actions and immutable updates for conversation and group state
- **Claude AI Integration**: Always use the intelligent model routing service, never call Claude API directly from components
- **LGPD Compliance**: All user data operations must include retention date checks and consent validation
- **Brazilian Formatting**: Use shared utilities for currency (R$), dates (Brazilian timezone), and phone numbers (Brazilian format)
- **Conversation Context**: Implement conversation context compression for Claude API calls to manage token costs
- **Database Queries**: Use repository pattern with Supabase client, never raw SQL in API routes

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `ConversationMessage.tsx` |
| Hooks | camelCase with 'use' | - | `useConversation.ts` |
| Services | camelCase | camelCase | `conversationService.ts` |
| API Routes | - | kebab-case | `/api/conversation-messages` |
| Database Tables | - | snake_case | `conversation_messages` |
| Database Columns | - | snake_case | `claude_model`, `cost_cents` |
| Environment Variables | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `ANTHROPIC_API_KEY` |
| Constants | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `CLAUDE_MODELS`, `BRAZILIAN_CURRENCY` |

## Error Handling Strategy

### Error Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant API
    participant Service
    participant Claude
    participant Database
    
    Frontend->>API: Request with invalid data
    API->>Service: Process request
    Service->>Claude: API call fails
    Claude-->>Service: HTTP 429 Rate Limited
    
    Service->>Service: Log error with request ID
    Service-->>API: Throw ServiceError
    
    API->>API: Error middleware catches
    API->>API: Format Brazilian Portuguese error
    API-->>Frontend: Standard error response
    
    Frontend->>Frontend: Display user-friendly message
    Frontend->>Frontend: Log technical details
```

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;                    // Machine-readable error code
    message: string;                 // User-friendly message in Portuguese
    details?: Record<string, any>;   // Additional error context
    timestamp: string;               // Brazilian timezone timestamp
    requestId: string;               // For error tracking
    retryAfter?: number;            // For rate limiting errors
  };
}

// Example error responses
{
  "error": {
    "code": "CLAUDE_RATE_LIMITED",
    "message": "Muitas conversas ativas. Tente novamente em alguns minutos.",
    "details": {
      "retryAfter": 60,
      "model": "sonnet"
    },
    "timestamp": "2024-12-19T21:30:00-03:00",
    "requestId": "req_abc123"
  }
}
```

### Frontend Error Handling

```typescript
import { toast } from '@/components/ui/toast';
import { logger } from '@/utils/logger';

export class ApiErrorHandler {
  static handle(error: ApiError, context?: string) {
    const { code, message, details, requestId } = error.error;
    
    // Log technical details
    logger.error('API Error', {
      code,
      message,
      details,
      requestId,
      context,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // Show user-friendly message
    switch (code) {
      case 'CLAUDE_RATE_LIMITED':
        toast.error(`${message} (ID: ${requestId})`);
        break;
        
      case 'LGPD_CONSENT_REQUIRED':
        toast.warning(message, {
          action: {
            label: 'Configurar Privacidade',
            onClick: () => router.push('/privacy')
          }
        });
        break;
        
      case 'CONVERSATION_EXPIRED':
        toast.info(message, {
          action: {
            label: 'Nova Conversa',
            onClick: () => conversationStore.createConversation()
          }
        });
        break;
        
      default:
        toast.error(`Erro inesperado: ${message} (ID: ${requestId})`);
    }
  }
}

// Usage in services
export const conversationService = {
  async sendMessage(id: string, content: string) {
    try {
      return await apiClient.post(`/conversations/${id}/messages`, { content });
    } catch (error) {
      ApiErrorHandler.handle(error, 'conversation.sendMessage');
      throw error; // Re-throw for component handling
    }
  }
};
```

### Backend Error Handling

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/utils/logger';

export class ServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
    
    try {
      await handler(req, res);
    } catch (error) {
      logger.error('API Error', {
        error: error.message,
        stack: error.stack,
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });

      if (error instanceof ServiceError) {
        return res.status(error.statusCode).json({
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            timestamp: new Date().toLocaleString('pt-BR', { 
              timeZone: 'America/Sao_Paulo' 
            }),
            requestId
          }
        });
      }

      // Claude API specific errors
      if (error.status === 429) {
        return res.status(429).json({
          error: {
            code: 'CLAUDE_RATE_LIMITED',
            message: 'Muitas conversas ativas. Tente novamente em alguns minutos.',
            details: { retryAfter: 60 },
            timestamp: new Date().toLocaleString('pt-BR', { 
              timeZone: 'America/Sao_Paulo' 
            }),
            requestId
          }
        });
      }

      // Generic server error
      return res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro interno do servidor. Nossa equipe foi notificada.',
          timestamp: new Date().toLocaleString('pt-BR', { 
            timeZone: 'America/Sao_Paulo' 
          }),
          requestId
        }
      });
    }
  };
}

// Claude service with error handling
export class ClaudeService {
  async processMessage(content: string, context: ConversationContext): Promise<ClaudeResponse> {
    try {
      const model = this.selectOptimalModel(content);
      const response = await this.claudeClient.messages.create({
        model,
        max_tokens: 1000,
        messages: [{ role: 'user', content }]
      });
      
      return {
        content: response.content[0].text,
        model,
        cost: this.calculateCost(model, response.usage.input_tokens + response.usage.output_tokens)
      };
    } catch (error) {
      if (error.status === 429) {
        throw new ServiceError(
          'CLAUDE_RATE_LIMITED',
          'Muitas conversas ativas. Tente novamente em alguns minutos.',
          429,
          { retryAfter: 60, model }
        );
      }
      
      throw new ServiceError(
        'CLAUDE_API_ERROR',
        'Erro ao processar mensagem com IA.',
        500,
        { originalError: error.message }
      );
    }
  }
}
```

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring**: Vercel Analytics + Web Vitals tracking for Brazilian users
- **Backend Monitoring**: Vercel Functions monitoring + custom API metrics
- **Error Tracking**: Sentry with Brazilian data residency compliance
- **Performance Monitoring**: Claude AI cost tracking, conversation response times, database query performance

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS) optimized for Brazilian mobile networks
- JavaScript errors with Portuguese error messages
- API response times from Brazilian users
- Conversation completion rates and user engagement
- Claude AI model usage distribution (target: 70% Haiku, 25% Sonnet, 5% Opus)

**Backend Metrics:**
- Request rate and error rate per API endpoint
- Claude AI response times and costs per conversation
- Database query performance and connection pool usage
- Redis cache hit rates for conversation context
- LGPD compliance metrics (data retention, deletion requests)

**Business Metrics:**
- Monthly active users and conversation volume
- Average conversations per user and retention rates
- Claude AI cost per conversation and cost optimization effectiveness
- Brazilian user distribution by region
- Group creation and usage patterns

---

## 🏗️ **Architecture Complete!**

This comprehensive fullstack architecture document provides the complete technical blueprint for RachaAI, covering:

✅ **Unified Technology Stack** - Next.js + Supabase + Claude AI with Brazilian optimization
✅ **Data Models** - Complete TypeScript interfaces with LGPD compliance  
✅ **API Specification** - REST endpoints with Brazilian context
✅ **Component Architecture** - Frontend and backend service organization
✅ **Database Schema** - PostgreSQL with Brazilian data residency
✅ **Security & Performance** - LGPD compliance and <1.5s response targets
✅ **Testing Strategy** - Comprehensive test pyramid with Brazilian scenarios
✅ **Deployment Pipeline** - Brazilian region optimization with Vercel
✅ **Monitoring & Observability** - Cost tracking and performance metrics

The architecture is now ready to guide AI-driven development using the BMad methodology, with story-by-story implementation following this unified technical foundation. 