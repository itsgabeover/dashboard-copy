import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  console.log("Received ID:", id)

  try {
    const { data, error } = await supabase
      .from("policies")
      .select("id, policy_name, analysis_data, status, created_at")
      .eq("id", id)
      .single()

    console.log("Supabase response:", data)

    if (error) {
      console.error("Error fetching policy:", error)
      return NextResponse.json({ error: "Failed to fetch policy" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    console.log("Sending response:", data.analysis_data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error fetching policy:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

