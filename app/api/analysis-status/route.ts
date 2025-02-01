import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const uploadId = request.nextUrl.searchParams.get("uploadId")

  if (!uploadId) {
    return NextResponse.json({ error: "Missing uploadId" }, { status: 400 })
  }

  // Here, you would typically check the status of the analysis in your database or with n8n
  // For this example, we'll simulate a random completion time
  const isCompleted = Math.random() < 0.3 // 30% chance of completion each check

  if (isCompleted) {
    // In a real scenario, you'd fetch the actual policyId from your database
    const policyId = `policy_${Date.now()}`
    return NextResponse.json({ status: "completed", policyId })
  } else {
    return NextResponse.json({ status: "processing" })
  }
}

