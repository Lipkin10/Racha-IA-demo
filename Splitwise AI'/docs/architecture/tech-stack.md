# Tech Stack

This is the DEFINITIVE technology selection for the entire project. All development must use these exact versions.

## Technology Stack Table

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