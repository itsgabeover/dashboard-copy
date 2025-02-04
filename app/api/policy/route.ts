import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { APIResponse, ParsedPolicyData } from "@/types/policy"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Keep existing GET method for retrieving policies
export async function GET(request: Request) {
  // ... existing GET implementation ...
}

// Add POST method for storing new policies
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const policyData = await request.json()
    
    // Transform the data to match your Supabase table structure
    const supabaseData = {
      product_name: policyData.data.policyOverview.productName,
      issuer: policyData.data.policyOverview.issuer,
      product_type: policyData.data.policyOverview.productType,
      death_benefit: policyData.data.policyOverview.deathBenefit,
      annual_premium: policyData.data.policyOverview.annualPremium,
      riders: policyData.data.policyOverview.riders,
      sections: policyData.data.sections,
      values: policyData.data.values,
      final_thoughts: policyData.data.finalThoughts,
      created_at: new Date().toISOString()
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('policies')
      .insert(supabaseData)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to store policy data" }, { status: 500 })
    }

    // Return success response with the stored data
    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ 
      success: false,
      error: "An unexpected error occurred" 
    }, { status: 500 })
  }
}
