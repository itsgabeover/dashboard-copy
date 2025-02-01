import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()

    // In a real application, you would save this data to a database
    // For now, we'll just return it
    return NextResponse.json({
      success: true,
      data: policyData,
    })
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ error: "Failed to process policy data" }, { status: 500 })
  }
}

export async function GET() {
  // This endpoint is not meant to be used for fetching data
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

