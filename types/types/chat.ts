export interface Chat {
  id: string;
  user_email: string;
  policy_id: string;
  created_at: string;
  last_message_at: string;
  is_active: boolean;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  is_complete: boolean;
}

export interface CreateChatParams {
  user_email: string;
  policy_id: string;
}

export interface SendMessageParams {
  chat_id: string;
  content: string;
  policy_context?: {
    current_tab: string;
    current_section?: string;
  };
}
