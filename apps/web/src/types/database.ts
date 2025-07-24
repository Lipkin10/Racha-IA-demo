export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          timezone: string
          locale: string
          lgpd_consent: boolean
          lgpd_consent_date: string | null
          preferred_language: string
          payment_preferences: Json
          privacy_settings: Json
          consent_timestamp: string
          data_retention_date: string
          last_active_at: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          timezone?: string
          locale?: string
          lgpd_consent?: boolean
          lgpd_consent_date?: string | null
          preferred_language?: string
          payment_preferences?: Json
          privacy_settings?: Json
          consent_timestamp?: string
          data_retention_date?: string
          last_active_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          timezone?: string
          locale?: string
          lgpd_consent?: boolean
          lgpd_consent_date?: string | null
          preferred_language?: string
          payment_preferences?: Json
          privacy_settings?: Json
          consent_timestamp?: string
          data_retention_date?: string
          last_active_at?: string | null
        }
        Relationships: []
      }
      lgpd_audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: 'consent_given' | 'consent_withdrawn' | 'data_exported' | 'data_deleted' | 'access_requested' | 'email_confirmed' | 'deletion_failed' | 'profile_updated' | 'password_reset_completed' | 'password_reset_requested'
          timestamp: string
          ip_address: string | null
          user_agent: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string | null
          action: 'consent_given' | 'consent_withdrawn' | 'data_exported' | 'data_deleted' | 'access_requested' | 'email_confirmed' | 'deletion_failed' | 'profile_updated' | 'password_reset_completed' | 'password_reset_requested'
          timestamp?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: 'consent_given' | 'consent_withdrawn' | 'data_exported' | 'data_deleted' | 'access_requested' | 'email_confirmed' | 'deletion_failed' | 'profile_updated' | 'password_reset_completed' | 'password_reset_requested'
          timestamp?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lgpd_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          status: 'active' | 'archived' | 'deleted'
          claude_model_used: 'haiku' | 'sonnet' | 'opus'
          total_cost_cents: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'archived' | 'deleted'
          claude_model_used: 'haiku' | 'sonnet' | 'opus'
          total_cost_cents?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'archived' | 'deleted'
          claude_model_used?: 'haiku' | 'sonnet' | 'opus'
          total_cost_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversation_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          timestamp: string
          claude_model: 'haiku' | 'sonnet' | 'opus' | null
          cost_cents: number | null
          token_count: number | null
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          timestamp?: string
          claude_model?: 'haiku' | 'sonnet' | 'opus' | null
          cost_cents?: number | null
          token_count?: number | null
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          timestamp?: string
          claude_model?: 'haiku' | 'sonnet' | 'opus' | null
          cost_cents?: number | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
          currency: 'BRL'
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          currency?: 'BRL'
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          currency?: 'BRL'
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      division_participants: {
        Row: {
          id: string
          division_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          division_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          division_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "division_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      division_calculations: {
        Row: {
          id: string
          division_id: string
          user_id: string
          amount_cents: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          division_id: string
          user_id: string
          amount_cents: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          division_id?: string
          user_id?: string
          amount_cents?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "division_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      claude_model: 'haiku' | 'sonnet' | 'opus'
      conversation_status: 'active' | 'archived' | 'deleted'
      group_role: 'admin' | 'member'
      lgpd_action: 'consent_given' | 'consent_withdrawn' | 'data_exported' | 'data_deleted' | 'access_requested' | 'email_confirmed' | 'deletion_failed' | 'profile_updated' | 'password_reset_completed' | 'password_reset_requested'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 