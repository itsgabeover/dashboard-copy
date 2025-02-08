/*
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withRateLimit } from '@/lib/rate-limit'
import { createChatCompletionStream } from '@/lib/openai'
import type { SendMessageParams, ChatAPIResponse, OpenAIMessage } from '@/types/chat'

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = await withRateLimit(req)
  if (rateLimitResult) return rateLimitResult

  try {
    const body = (await req.json()) as SendMessageParams
    const { chat_id, content } = body

    // Verify chat and get policy data
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

    // Create response stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Save user message
          const { error: userMessageError } = await supabase
            .from('chat_messages')
            .insert({
              chat_id,
              role: 'user',
              content,
              is_complete: true
            })

          if (userMessageError) throw userMessageError

          // Get recent messages for context
          const { data: messages, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', chat_id)
            .order('created_at', { ascending: true })
            .limit(10)

          if (messagesError) throw messagesError

          // Format messages for OpenAI
          const formattedMessages: OpenAIMessage[] = messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))

          let fullResponse = ''

          // Stream AI response
          for await (const chunk of createChatCompletionStream({
            messages: formattedMessages,
            policyData: chat.policies.analysis_data
          })) {
            fullResponse += chunk
            controller.enqueue(chunk)
          }

          // Save complete AI response
          await supabase
            .from('chat_messages')
            .insert({
              chat_id,
              role: 'assistant',
              content: fullResponse,
              is_complete: true
            })

          // Update chat last_message_at
          await supabase
            .from('chats')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', chat_id)

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    console.error('Error setting up stream:', error)
    return NextResponse.json({
      success: false,
      error: { 
        message: 'Failed to set up message stream',
        code: 'STREAM_SETUP_FAILED'
      }
    } as ChatAPIResponse, { status: 500 })
  }
}
*/
