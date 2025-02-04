import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("policies") // Use the correct table name
      .select("*")
      .eq("status", "completed")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching policies:", error)
      return NextResponse.json({ error: "Failed to fetch policies", details: error }, { status: 500 })
    }

    // Transform the data to include the required fields from analysis_data
    const transformedData =
      data?.map((policy) => {
        const policyOverview = policy.analysis_data?.data?.policyOverview || {}
        return {
          id: policy.id,
          policy_name: policy.policy_name || policyOverview.productName,
          insurer: policyOverview.issuer,
          policy_type: policyOverview.productType,
          death_benefit: policyOverview.deathBenefit,
          uploaded_at: policy.created_at,
          status: policy.status,
        }
      }) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Unexpected error fetching policies:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
