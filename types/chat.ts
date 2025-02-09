import type { Message } from 'ai'
import type { ParsedPolicyData } from "./policy"

export type Role = "user" | "assistant" | "system"

// Matches Supabase chat_messages table
export interface ChatMessage {
  id: string
  chat_id: string
  role: Role
  content: string
  created_at: string
  is_complete: boolean
}

// Matches Supabase chats table with RLS
export interface Chat {
  id: string
  user_email: string
  session_id: string
  created_at: string
  last_message_at: string
  is_active: boolean
}

// API Request Types
export interface SendMessageParams {
  chat_id: string
  session_id: string
  content: string
  context?: {
    current_tab: string
    current_section?: string
  }
}

export interface ChatAPIResponse {
  success: boolean
  data?: {
    message?: ChatMessage
    messages?: ChatMessage[]
    chat?: Chat
  }
  error?: {
    message: string
    code: string
  }
}

// Re-export types used by AI components
export type { Message, ParsedPolicyData }

// Database query helper types
export interface ChatQueryResponse {
  data: Chat[] | null
  error: Error | null
}

export interface MessageQueryResponse {
  data: ChatMessage[] | null
  error: Error | null
}
