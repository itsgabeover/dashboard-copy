// app/api/policy-dashboard/route.ts
import { type NextRequest, NextResponse } from "next/server"
import type { ParsedDashboardData, APIResponse } from "@/types/policy-dashboard"
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Parse incoming dashboard data from n8n
    const rawBody = await request.text()
    console.log("Raw request body:", rawBody)
    
    const dashboardData: ParsedDashboardData = JSON.parse(rawBody)
    console.log("Successfully parsed dashboard data:", dashboardData)
    
    // Get sessionId from the dashboard data
    const sessionId = dashboardData.sessionId
    if (!sessionId) {
      console.error("No sessionId provided in dashboard data")
      return NextResponse.json({ 
        success: false,
        error: "No sessionId provided" 
      } as APIResponse, { status: 400 })
    }

    console.log("Processing dashboard for sessionId:", sessionId)

    // Find existing record
    const { data: existingDashboard } = await supabase
      .from('policy_dashboards')
      .select('*')
      .match({ session_id: sessionId })
      .single()

    if (existingDashboard) {
      // Update existing record
      console.log("Updating existing dashboard record")
      const { error: updateError } = await supabase
        .from('policy_dashboards')
        .update({ 
          policy_name: dashboardData.data.policyOverview.productName,
          analysis_data: dashboardData,
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
      console.log("Creating new dashboard record")
      const { error: insertError } = await supabase
        .from('policy_dashboards')
        .insert({
          policy_name: dashboardData.data.policyOverview.productName,
          analysis_data: dashboardData,
          status: 'completed',
          updated_at: new Date().toISOString(),
          session_id: sessionId,
          email: dashboardData.data.email
        })

      if (insertError) {
        console.error("Supabase insert error:", insertError)
        throw insertError
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    } as APIResponse)

  } catch (error) {
    console.error("Error processing dashboard data:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      rawError: error
    })

    return NextResponse.json({ 
      success: false,
      error: "Failed to process dashboard data",
      details: error instanceof Error ? error.message : "Unknown error"
    } as APIResponse, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    let query = supabase
      .from('policy_dashboards')
      .select('*')
    
    if (sessionId) {
      query = query.match({ session_id: sessionId })
    } else {
      query = query.order('created_at', { ascending: false }).limit(1)
    }

    const { data: dashboards, error } = await query
    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }
    
    const dashboard = sessionId ? dashboards[0] : dashboards[0]
    if (!dashboard) {
      return NextResponse.json({ 
        success: false,
        error: "No dashboard data available" 
      } as APIResponse, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: dashboard.analysis_data as ParsedDashboardData
    } as APIResponse)

  } catch (error) {
    console.error("Error retrieving dashboard data:", error)
    return NextResponse.json({ 
      success: false,
      error: "Failed to retrieve dashboard data",
      details: error instanceof Error ? error.message : "Unknown error"
    } as APIResponse, { status: 500 })
  }
}
