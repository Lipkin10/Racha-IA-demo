# Coding Standards

## Critical Fullstack Rules

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

## Naming Conventions

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