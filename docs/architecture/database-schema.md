# Database Schema

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