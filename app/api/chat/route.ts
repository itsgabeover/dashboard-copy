import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withRateLimit } from '@/lib/rate-limit'
import type { CreateChatParams, ChatAPIResponse } from '@/types/chat'

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = await withRateLimit(req)
  if (rateLimitResult) return rateLimitResult

  try {
    const body = (await req.json()) as CreateChatParams
    const { user_email, policy_id } = body

    // Verify policy exists and belongs to user
    const { data: policy, error: policyError } = await supabase
      .from('policies')
      .select('*')
      .eq('id', policy_id)
      .eq('email', user_email)
      .single()

    if (policyError || !policy) {
      return NextResponse.json({
        success: false,
        error: { message: 'Policy not found', code: 'POLICY_NOT_FOUND' }
      } as ChatAPIResponse, { status: 404 })
    }

    // Create new chat session
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        user_email,
        policy_id,
        is_active: true
      })
      .select()
      .single()

    if (chatError) {
      throw chatError
    }

    // Create initial system message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chat.id,
        role: 'system',
        content: `Chat session initialized for ${policy.policy_name} analysis.`,
        is_complete: true
      })

    if (messageError) {
      throw messageError
    }

    return NextResponse.json({
      success: true,
      data: { chat }
    } as ChatAPIResponse)

  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json({
      success: false,
      error: { 
        message: 'Failed to create chat session',
        code: 'CHAT_CREATION_FAILED'
      }
    } as ChatAPIResponse, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = await withRateLimit(req)
  if (rateLimitResult) return rateLimitResult

  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: { message: 'Email is required', code: 'EMAIL_REQUIRED' }
      } as ChatAPIResponse, { status: 400 })
    }

    // Get user's active chats
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select(`
        *,
        policies (
          policy_name,
          analysis_data
        )
      `)
      .eq('user_email', email)
      .eq('is_active', true)
      .order('last_message_at', { ascending: false })

    if (chatsError) {
      throw chatsError
    }

    return NextResponse.json({
      success: true,
      data: { chats }
    } as ChatAPIResponse)

  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json({
      success: false,
      error: { 
        message: 'Failed to fetch chat sessions',
        code: 'CHAT_FETCH_FAILED'
      }
    } as ChatAPIResponse, { status: 500 })
  }
}
