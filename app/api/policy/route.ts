import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { APIResponse, ParsedPolicyData } from "@/types/policy"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    // Extract the policy ID from the request, assuming it's passed as a query parameter
    const { searchParams } = new URL(request.url)
    const policyId = searchParams.get("id")

    if (!policyId) {
      return NextResponse.json({ error: "Policy ID is required" }, { status: 400 })
    }

    // Fetch policy data from Supabase
    const { data, error } = await supabase.from("policies").select("*").eq("id", policyId).single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch policy data" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    // Transform the data to match our ParsedPolicyData structure
    const parsedPolicyData: ParsedPolicyData = {
      timestamp: new Date().toISOString(),
      data: {
        policyOverview: {
          productName: data.product_name,
          issuer: data.issuer,
          productType: data.product_type,
          deathBenefit: data.death_benefit,
          annualPremium: data.annual_premium,
          riders: data.riders || [],
          policyStatus: data.policy_status,
        },
        sections: data.sections || [],
        values: data.values || [],
        finalThoughts: data.final_thoughts || "",
      },
    }

    // Construct the API response
    const apiResponse: APIResponse = {
      success: true,
      data: parsedPolicyData,
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

