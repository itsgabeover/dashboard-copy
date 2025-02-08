import type { ParsedPolicyData } from './policy'

export type Role = 'user' | 'assistant' | 'system'

// Matches chat_messages table
export interface ChatMessage {
    id: string
    chat_id: string
    role: Role
    content: string
    created_at: string
    is_complete: boolean
}

// Matches chats table
export interface Chat {
    id: string
    user_email: string
    policy_id: string
    created_at: string
    last_message_at: string
    is_active: boolean
}

// For creating new chats
export interface CreateChatParams {
    user_email: string
    policy_id: string
}

// For sending messages
export interface SendMessageParams {
    chat_id: string
    content: string
    context?: {
        current_tab: string
        current_section?: string
    }
}

// For API responses
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

// For OpenAI messages
export interface OpenAIMessage {
    role: Role
    content: string
}

// For managing chat state in frontend
export interface ChatState {
    messages: ChatMessage[]
    isLoading: boolean
    error: string | null
    activeChat: Chat | null
}

// For streaming responses
export interface StreamingChatResponse {
    id: string
    role: Role
    content: string
    created_at: string
    done: boolean
}
