import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData, APIResponse } from "@/types/policy"
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()
    
    // Store in Supabase
    const { error } = await supabase
      .from('policies')
      .insert([
        { 
          policy_name: policyData.data.policyOverview.productName,
          analysis_data: policyData,
          status: 'completed',
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
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

export async function GET() {
  try {
    const { data: policies, error } = await supabase
      .from('policies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error
    
    const latestPolicy = policies[0]
    if (!latestPolicy) {
      return NextResponse.json({ 
        success: false,
        error: "No policy data available" 
      } as APIResponse, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: latestPolicy.analysis_data as ParsedPolicyData
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
