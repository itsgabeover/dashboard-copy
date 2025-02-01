import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // In a real application, you would check the status of the analysis in your database or external service
  // For this example, we'll simulate a random completion time
  const isComplete = Math.random() < 0.2 // 20% chance of being complete each time we check

  return NextResponse.json({ status: isComplete ? "complete" : "inProgress" })
}

