import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching policy:", error)
      return NextResponse.json({ error: "Failed to fetch policy", details: error }, { status: 500 })
    }

    // Transform the data to include the required fields
    const policyData = data?.analysis_data?.data || null

    return NextResponse.json({
      timestamp: data.created_at,
      data: policyData
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
