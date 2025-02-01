import { type NextRequest, NextResponse } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json()
    return NextResponse.json({
      success: true,
      data: policyData,
    })
  } catch (error) {
    console.error("Error processing policy data:", error)
    return NextResponse.json({ error: "Failed to process policy data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { policyId: string } }) {
  try {
    const policyId = params.policyId === "unknown" ? "unknown" : params.policyId
    console.log(`Fetching policy data for ID: ${policyId}`)

    if (policyId === "unknown") {
      return NextResponse.json({ message: "Received request for unknown policy ID", policyId }, { status: 200 })
    }

    // In a real application, you would fetch the policy data from a database using the policyId
    // For this example, we'll return a "not found" response
    return NextResponse.json({ error: "Policy not found", policyId }, { status: 404 })
  } catch (error) {
    console.error("Error fetching policy data:", error)
    return NextResponse.json({ error: "Failed to fetch policy data" }, { status: 500 })
  }
}

