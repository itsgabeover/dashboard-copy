import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()
    
    // Add validation
    if (!policyData.data || !policyData.timestamp) {
      return NextResponse.json(
        { error: "Invalid policy data structure" }, 
        { status: 400 }
      )
    }

    // Log for debugging
    console.log("Received policy data:", JSON.stringify(policyData, null, 2))

    return NextResponse.json({
      success: true,
      data: policyData,
      // Include a message to confirm data was received
      message: "Policy data received successfully"
    })
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ error: "Failed to process policy data" }, { status: 500 })
  }
}
