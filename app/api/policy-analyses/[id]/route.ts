import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("status", "completed")
      .single()

    if (error) {
      console.error("Error fetching policies:", error)
      return NextResponse.json({ error: "Failed to fetch policies", details: error }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    // Transform the data to include the required fields from analysis_data
    const policyOverview = data.analysis_data?.data?.policyOverview || {}
    const transformedData = {
      id: data.id,
      policy_name: data.policy_name || policyOverview.productName,
      insurer: policyOverview.issuer,
      policy_type: policyOverview.productType,
      death_benefit: policyOverview.deathBenefit,
      uploaded_at: data.created_at,
      status: data.status,
      timestamp: data.created_at,
      data: data.analysis_data?.data || null,
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Unexpected error fetching policies:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
