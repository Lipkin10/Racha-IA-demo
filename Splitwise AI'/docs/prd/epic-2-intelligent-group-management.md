# Epic 2: Intelligent Group Management

**Epic Goal**: Enable users to create and manage recurring groups with intelligent memory of preferences, patterns, and payment methods, making subsequent divisions faster and more personalized.

## Story 2.1: Group Creation and Member Management

As a **user**,  
I want **to create groups with my friends and manage member information**,  
so that **I don't have to re-enter the same people for recurring expenses**.

### Acceptance Criteria

1. Group creation with name, description, and initial member list
2. Member addition with names and optional contact information
3. Group editing capabilities (add/remove members, change group details)
4. Group deletion with conversation history preservation options
5. Member role management (admin, member) for group modifications
6. Invitation system for new members to join existing groups
7. Group privacy settings and access control
8. CLI interface for group management testing and data verification

## Story 2.2: Payment Preferences and PIX Integration

As a **user**,  
I want **to set my payment preferences including PIX keys**,  
so that **RachaAI can suggest appropriate payment methods for my group**.

### Acceptance Criteria

1. User profile payment preferences (PIX, bank transfer, cash, "pay later")
2. PIX key storage and management (email, phone, random key)
3. Payment limits and comfort zones ("accept owing up to R$50")
4. Payment method suggestions in division results
5. Privacy controls for payment information sharing within groups
6. Payment preference inheritance for group contexts
7. Validation and formatting for Brazilian payment data (CPF, phone numbers)
8. Secure storage of payment information with encryption

## Story 2.3: Conversation Memory and Context

As a **user**,  
I want **RachaAI to remember my groups and past interactions**,  
so that **subsequent conversations are faster and more intelligent**.

### Acceptance Criteria

1. Conversation history storage with group and user associations
2. Pattern recognition for recurring scenarios (same restaurant, regular group meetups)
3. Smart suggestions based on historical data and group patterns
4. Context switching between different groups within conversations
5. Memory management with user-controlled data retention settings
6. Intelligent context loading without overwhelming conversation flow
7. Performance optimization for context retrieval and pattern matching
8. User controls for memory reset and data deletion

## Story 2.4: Group-Aware Expense Processing

As a **user**,  
I want **RachaAI to automatically recognize my group members and suggest appropriate divisions**,  
so that **I can quickly process expenses for recurring groups**.

### Acceptance Criteria

1. Automatic group member recognition from conversation context
2. Smart division suggestions based on group history and patterns
3. Member-specific adjustments (regular discounts, different consumption patterns)
4. Group preference application (default split methods, payment arrangements)
5. Conflict resolution for ambiguous member references
6. Group context validation before applying historical patterns
7. Override capabilities for one-time adjustments to group patterns
8. Integration with payment preferences for complete division recommendations 