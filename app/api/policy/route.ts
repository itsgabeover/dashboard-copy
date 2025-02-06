import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData, APIResponse } from "@/types/policy"
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Parse incoming policy data from n8n
    const policyData: ParsedPolicyData = await request.json()
    console.log("Received policy data:", policyData)
    
    // Get sessionId from the policy data
    const sessionId = policyData.sessionId || policyData.data?.sessionId
    if (!sessionId) {
      console.error("No sessionId provided in policy data")
      return NextResponse.json({ 
        success: false,
        error: "No sessionId provided" 
      } as APIResponse, { status: 400 })
    }

    console.log("Processing policy for sessionId:", sessionId)

    // Find existing record
    const { data: existingPolicy } = await supabase
      .from('policies')
      .select('*')
      .match({ session_id: sessionId })
      .single()

    if (existingPolicy) {
      // Update existing record
      console.log("Updating existing policy record")
      const { error: updateError } = await supabase
        .from('policies')
        .update({ 
          policy_name: policyData.data.policyOverview.productName,
          analysis_data: policyData,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .match({ session_id: sessionId })

      if (updateError) {
        console.error("Supabase update error:", updateError)
        throw updateError
      }
    } else {
      // Insert new record
      console.log("Creating new policy record")
      const { error: insertError } = await supabase
        .from('policies')
        .insert({
          policy_name: policyData.data.policyOverview.productName,
          analysis_data: policyData,
          status: 'completed',
          updated_at: new Date().toISOString(),
          session_id: sessionId,
          email: policyData.data?.email
        })

      if (insertError) {
        console.error("Supabase insert error:", insertError)
        throw insertError
      }
    }

    return NextResponse.json({
      success: true,
      data: policyData
    } as APIResponse)
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ 
      success: false,
      error: "Failed to process policy data",
      details: error instanceof Error ? error.message : "Unknown error"
    } as APIResponse, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get sessionId from query params if provided
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    let query = supabase
      .from('policies')
      .select('*')
    
    if (sessionId) {
      // If sessionId provided, get specific policy
      query = query.match({ session_id: sessionId })
    } else {
      // Otherwise get latest policy
      query = query.order('created_at', { ascending: false }).limit(1)
    }

    const { data: policies, error } = await query

    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }
    
    const policy = sessionId ? policies[0] : policies[0]
    if (!policy) {
      return NextResponse.json({ 
        success: false,
        error: "No policy data available" 
      } as APIResponse, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: policy.analysis_data as ParsedPolicyData
    } as APIResponse)
  } catch (error) {
    console.error("Error retrieving policy data:", error)
    return NextResponse.json({ 
      success: false,
      error: "Failed to retrieve policy data",
      details: error instanceof Error ? error.message : "Unknown error"
    } as APIResponse, { status: 500 })
  }
}

// Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
