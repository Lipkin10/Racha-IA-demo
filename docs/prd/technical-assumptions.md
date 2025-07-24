# Technical Assumptions

## Repository Structure: Monorepo

Single repository containing frontend, backend, and shared utilities to enable rapid development and deployment coordination for the MVP timeline.

## Service Architecture

**Monolithic Architecture with Microservice Readiness**: Initial monolithic application structure with clear service boundaries that can be extracted into microservices post-MVP. Core services include:
- **Conversation Processing Service**: Claude AI integration and NLP processing
- **User Management Service**: Authentication, profiles, and group management  
- **Payment Preference Service**: PIX keys, payment methods, and user preferences
- **Data Persistence Service**: Supabase integration for conversations and user data

## Testing Requirements

**Unit + Integration Testing**: Comprehensive unit tests for business logic, integration tests for Claude AI interactions, and manual testing convenience methods for conversation flows. Focus on testable acceptance criteria with CLI accessibility for backend operations.

## Additional Technical Assumptions and Requests

• **Claude API Integration**: Direct integration with Anthropic's Claude API with intelligent model routing based on conversation complexity
• **Supabase Backend**: PostgreSQL with real-time subscriptions for conversation state management  
• **Redis Caching**: Session management and conversation context caching for performance
• **Next.js Frontend**: React-based frontend with TypeScript for type safety and developer experience
• **Vercel Deployment**: Edge-optimized deployment with Brazilian region prioritization
• **LGPD Compliance Architecture**: Built-in privacy controls, data encryption, and user consent management
• **Portuguese NLP Optimization**: Specialized prompting and context management for Brazilian Portuguese processing
• **Cost Optimization Strategy**: Intelligent Claude model selection and caching to maintain sub-R$1 per conversation cost target 