import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()

    // Store in Supabase
    const { error } = await supabase
      .from("policies")
      .insert([
        {
          policy_name: policyData.data.policyOverview.productName,
          analysis_data: policyData,
          status: "completed",
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    console.log("Stored policy data:", JSON.stringify(policyData, null, 2))

    return NextResponse.json({
      success: true,
      data: policyData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json(
      {
        error: "Failed to process policy data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Get latest policies from Supabase
    const { data: policies, error } = await supabase
      .from("policies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) throw error

    const latestPolicy = policies[0]

    if (!latestPolicy) {
      return NextResponse.json(
        {
          success: false,
          message: "No policy data available",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: latestPolicy.analysis_data,
    })
  } catch (error) {
    console.error("Error retrieving policy data:", error)
    return NextResponse.json(
      {
        error: "Failed to retrieve policy data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

