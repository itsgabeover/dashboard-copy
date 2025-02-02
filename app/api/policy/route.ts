import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData, APIResponse } from "@/types/policy"

// Store data in server memory (temporary, resets on deploy)
let latestPolicyData: ParsedPolicyData | null = null

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()
    
    // Store in server memory
    latestPolicyData = policyData
    
    console.log("Stored policy data:", JSON.stringify(policyData, null, 2))

    const response: APIResponse = {
      success: true,
      data: policyData
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process policy data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET() {
  if (!latestPolicyData) {
    return NextResponse.json({ 
      success: false,
      message: "No policy data available" 
    }, { status: 404 })
  }

  const response: APIResponse = {
    success: true,
    data: latestPolicyData
  }

  return NextResponse.json(response)
}
