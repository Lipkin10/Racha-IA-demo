-- RachaAI Database Schema Setup
-- Brazilian LGPD Compliant User Management System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with LGPD compliance
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'pt-BR',
    payment_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{"allowGroupMemory": true, "dataRetentionDays": 90}',
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to calculate retention date
CREATE OR REPLACE FUNCTION calculate_retention_date(
    created_timestamp TIMESTAMP WITH TIME ZONE, 
    settings JSONB
) RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN created_timestamp + INTERVAL '1 day' * COALESCE(
        (settings->>'dataRetentionDays')::int, 
        90
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add computed data_retention_date column using the function
ALTER TABLE users 
ADD COLUMN data_retention_date TIMESTAMP WITH TIME ZONE 
GENERATED ALWAYS AS (
    calculate_retention_date(created_at, privacy_settings)
) STORED;

-- LGPD Audit Log for compliance tracking
CREATE TABLE IF NOT EXISTS lgpd_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'consent_given', 'data_exported', 'data_deleted', etc.
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table for expense sharing
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- 'admin', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, user_id)
);

-- Conversations table for Claude AI chat history
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'deleted'
    claude_model_used VARCHAR(20) DEFAULT 'haiku', -- 'haiku', 'sonnet', 'opus'
    total_cost_cents INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    claude_model VARCHAR(20), -- Only for assistant messages
    cost_cents INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table for group expense tracking
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    description VARCHAR(200) NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    category VARCHAR(50) DEFAULT 'other', -- 'food', 'transport', 'accommodation', etc.
    paid_by UUID REFERENCES users(id) ON DELETE SET NULL,
    split_method VARCHAR(20) DEFAULT 'equal', -- 'equal', 'percentage', 'exact', 'shares'
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense splits table
CREATE TABLE IF NOT EXISTS expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    is_settled BOOLEAN DEFAULT FALSE,
    UNIQUE(expense_id, user_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lgpd_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

-- Users can access their own data
CREATE POLICY "Users can access own data" ON users
    FOR ALL USING (auth.uid() = id);

-- LGPD audit log access
CREATE POLICY "Users can view own audit log" ON lgpd_audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- Group access policies
CREATE POLICY "Group members can view group" ON groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Group creators can manage groups" ON groups
    FOR ALL USING (auth.uid() = created_by);

-- Group members policies
CREATE POLICY "Group members can view members" ON group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Conversation policies
CREATE POLICY "Users can manage own conversations" ON conversations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON conversation_messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM conversations WHERE user_id = auth.uid()
        )
    );

-- Expense policies
CREATE POLICY "Group members can view expenses" ON expenses
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Group members can create expenses" ON expenses
    FOR INSERT WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Expense splits policies
CREATE POLICY "Group members can view splits" ON expense_splits
    FOR SELECT USING (
        expense_id IN (
            SELECT e.id FROM expenses e
            JOIN group_members gm ON e.group_id = gm.group_id
            WHERE gm.user_id = auth.uid() AND gm.is_active = TRUE
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_data_retention ON users(data_retention_date);

CREATE INDEX IF NOT EXISTS idx_lgpd_audit_user_id ON lgpd_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_lgpd_audit_timestamp ON lgpd_audit_log(timestamp);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON conversation_messages(timestamp);

CREATE INDEX IF NOT EXISTS idx_expenses_group_id ON expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

CREATE INDEX IF NOT EXISTS idx_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_splits_user_id ON expense_splits(user_id);

-- Functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 