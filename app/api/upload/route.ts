import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "redis"
import { supabase } from "@/lib/supabase"

type TokenData = {
  token: string
  customerEmail?: string
  expires: string
  created: string
  used: string
  sessionId: string
}

export async function POST(req: NextRequest) {
  let client
  try {
    // Debug log the request headers
    console.log("Request headers:", Object.fromEntries(req.headers.entries()))

    // Validate authorization token
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      console.error("No authorization token provided")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Check if it's a mock token (pi_*_mock)
    const isMockToken = token.includes("_mock")
    console.log(`Processing ${isMockToken ? "mock" : "real"} token:`, token)

    if (!isMockToken) {
      // Initialize Redis client for real tokens
      client = createClient({
        url: process.env.REDIS_URL || "",
      })
      await client.connect()

      // Check if token exists and is valid
      const existingToken = await client.get(`upload_token:${token}`)
      if (!existingToken) {
        return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
      }

      // Parse and validate token data
      const tokenData = JSON.parse(existingToken) as TokenData

      // Check if token is already used
      if (tokenData.used === "true") {
        return NextResponse.json({ success: false, error: "Token has already been used" }, { status: 400 })
      }
    }

    // Log the content type
    console.log("Content-Type:", req.headers.get("content-type"))

     // Get form data with enhanced debug logging
    const formData = await req.formData()
    console.log("Raw FormData keys:", Array.from(formData.keys()))
    console.log("Attempting to get 'data':", formData.get("data"))
    console.log("Attempting to get 'file':", formData.get("file"))

    // Keep your existing logging
    console.log(
      "FormData entries:",
      Array.from(formData.entries()).map(([key, value]) => {
        if (value instanceof File) {
          return [key, { name: value.name, type: value.type, size: value.size }]
        }
        return [key, value]
      }),
    )

    const file = formData.get("data") as File | null
    const email = formData.get("email") as string | null
    const sessionId = formData.get("sessionId") as string | null

    // Validate file
    if (!file) {
      console.error("No file found in request")
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate email
    if (!email) {
      console.error("No email found in request")
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Validate sessionId
    if (!sessionId) {
      console.error("No sessionId found in request")
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Update Supabase status
    const { error: supabaseError } = await supabase
      .from("policies")
      .update({ status: "processing" })
      .match({ session_id: sessionId })

    if (supabaseError) {
      console.error("Supabase update error:", supabaseError)
    }

    // Validate upload endpoint
    if (!process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT) {
      throw new Error("Upload endpoint not configured")
    }

    // Prepare data for n8n
    const n8nFormData = new FormData()
    n8nFormData.append("data", file)
    n8nFormData.append("email", email)
    n8nFormData.append("filename", file.name)
    n8nFormData.append("timestamp", new Date().toISOString())
    n8nFormData.append("token", token)
    n8nFormData.append("sessionId", sessionId)

    // Send to n8n webhook with debug logging
    console.log("Sending to n8n:", process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT)
    const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT, {
      method: "POST",
      body: n8nFormData,
    })

    if (!response.ok) {
      const responseText = await response.text()
      console.error("n8n processing error:", responseText)
      throw new Error("Failed to process file with n8n")
    }

    // Only update Redis if it's not a mock token
    if (!isMockToken && client) {
      const tokenData = {
        token,
        used: "true",
        created: new Date().toISOString(),
        expires: new Date(Date.now() + 1800000).toISOString(),
        sessionId,
      }

      try {
        const redisPromises = [
          client.set(`upload_token:${token}`, JSON.stringify(tokenData), { EX: 1800 }),
          client.set(`payment:${token}`, JSON.stringify(tokenData), { EX: 1800 }),
        ] as const
        await Promise.all(redisPromises)
      } catch (redisError) {
        console.error("Redis update error:", redisError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      sessionId,
    })
  } catch (error) {
    console.error("Upload processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process upload",
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      try {
        await client.disconnect()
      } catch (disconnectError) {
        console.error("Redis disconnect error:", disconnectError)
      }
    }
  }
}

// Add OPTIONS handler to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

