import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withRateLimit } from '@/lib/rate-limit'
import { createChatCompletion } from '@/lib/openai'
import type { SendMessageParams, ChatAPIResponse, OpenAIMessage } from '@/types/chat'
import type { ChatCompletion } from 'openai/resources/chat'

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = await withRateLimit(req)
  if (rateLimitResult) return rateLimitResult

  try {
    const body = (await req.json()) as SendMessageParams
    const { chat_id, content } = body

    // Get chat and policy data
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select(`
        *,
        policies (
          analysis_data
        )
      `)
      .eq('id', chat_id)
      .single()

    if (chatError || !chat) {
      return NextResponse.json({
        success: false,
        error: { message: 'Chat not found', code: 'CHAT_NOT_FOUND' }
      } as ChatAPIResponse, { status: 404 })
    }

    // Save user message
    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id,
        role: 'user',
        content,
        is_complete: true
      })

    if (userMessageError) {
      throw userMessageError
    }

    // Get chat history
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: true })
      .limit(10) // Get last 10 messages for context

    if (messagesError) {
      throw messagesError
    }

    // Format messages for OpenAI
    const formattedMessages: OpenAIMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Get AI response
    const completion = await createChatCompletion({
      messages: formattedMessages,
      policyData: chat.policies.analysis_data,
      stream: false
    }) as ChatCompletion

    const aiResponse = completion.choices[0]?.message?.content || ''

    // Save AI response
    const { data: aiMessage, error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id,
        role: 'assistant',
        content: aiResponse,
        is_complete: true
      })
      .select()
      .single()

    if (aiMessageError) {
      throw aiMessageError
    }

    // Update chat last_message_at
    await supabase
      .from('chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chat_id)

    return NextResponse.json({
      success: true,
      data: { message: aiMessage }
    } as ChatAPIResponse)

  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json({
      success: false,
      error: { 
        message: 'Failed to process message',
        code: 'MESSAGE_PROCESSING_FAILED'
      }
    } as ChatAPIResponse, { status: 500 })
  }
}
