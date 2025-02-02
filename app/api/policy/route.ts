import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"

// POST endpoint for receiving data from n8n
export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()
    
    // Validate the data structure
    if (!policyData.data || !policyData.timestamp) {
      return NextResponse.json(
        { error: "Invalid policy data structure" }, 
        { status: 400 }
      )
    }
    
    // Log for debugging
    console.log("Received policy data in API:", JSON.stringify(policyData, null, 2))

    return NextResponse.json({
      success: true,
      data: policyData,
      message: "Policy data received and stored successfully"
    })
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ 
      error: "Failed to process policy data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// GET endpoint for retrieving data (in case you need it)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const policyId = searchParams.get('policyId')

  if (!policyId) {
    return NextResponse.json({ error: "Policy ID is required" }, { status: 400 })
  }

  try {
    return NextResponse.json({
      success: true,
      message: "This endpoint is ready to be integrated with storage"
    })
  } catch (error) {
    console.error("Error retrieving policy data:", error)
    return NextResponse.json({ error: "Failed to retrieve policy data" }, { status: 500 })
  }
}
