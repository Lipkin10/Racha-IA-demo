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
      profiles: {
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
        }
        Relationships: []
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
            referencedRelation: "profiles"
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
            referencedRelation: "profiles"
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
            referencedRelation: "profiles"
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
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 