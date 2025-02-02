import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const { status, analysis_data } = await request.json()

    const { data, error } = await supabase.from("policies").insert({ status, analysis_data }).select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/policy:", error)
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("policies").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/policy:", error)
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

