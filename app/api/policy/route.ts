// app/api/policy/route.ts
import { NextResponse } from "next/server"
import { supabase } from '@/lib/supabase'
import type { ParsedPolicyData } from "@/types/policy"

export async function POST(request: Request) {
  try {
    const policyData: ParsedPolicyData = await request.json()
    
    // Store in Supabase
    const { data, error } = await supabase
      .from('policies')
      .insert([
        { 
          analysis_data: policyData,
          status: 'complete',
          productName: policyData.data.policyOverview.productName
        }
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const policyId = searchParams.get('policyId')

  try {
    let query = supabase
      .from('policies')
      .select('*')

    if (policyId) {
      query = query.eq('id', policyId)
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data: policies, error } = await query.limit(1)

    if (error) {
      throw error
    }

    if (!policies || policies.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: "No policy data available" 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: policies[0],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error retrieving policy data:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
