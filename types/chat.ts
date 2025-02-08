import type { ParsedPolicyData as PolicyParsedPolicyData } from "./policy"

export type Role = "user" | "assistant" | "system"

export interface ChatMessage {
  id: string
  chat_id: string
  role: Role
  content: string
  created_at: string
  is_complete: boolean
}

export interface Chat {
  id: string
  user_email: string
  policy_id: string
  created_at: string
  last_message_at: string
  is_active: boolean
}

export interface CreateChatParams {
  user_email: string
  policy_id: string
}

export interface SendMessageParams {
  chat_id: string
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

export interface OpenAIMessage {
  role: Role
  content: string
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  activeChat: Chat | null
}

export interface StreamingChatResponse {
  id: string
  role: Role
  content: string
  created_at: string
  done: boolean
}

// Use the ParsedPolicyData from the policy types
export type ParsedPolicyData = PolicyParsedPolicyData

