import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const { data } = await supabase.from("users").select("*").eq("id", id).single()

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("An unexpected error occurred:", err)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

