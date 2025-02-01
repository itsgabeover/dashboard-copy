import { NextResponse } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"

export async function POST(request: Request, { params }: { params: { policyId: string } }) {
  try {
    const policyData: ParsedPolicyData = await request.json()

    // Store the data (in a real app, this would go to a database)
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

export async function GET(request: Request, { params }: { params: { policyId: string } }) {
  try {
    // In a production environment, fetch from your database
    // For now, we'll return a mock data response
    const mockData: ParsedPolicyData = {
      policyId: params.policyId,
      timestamp: new Date().toISOString(),
      data: {
        policyOverview: {
          productName: "Sample Life Insurance",
          issuer: "ABC Insurance Co.",
          productType: "Term Life",
          deathBenefit: 500000,
          annualPremium: 1200,
          riders: ["Accidental Death Benefit", "Disability Waiver of Premium"],
        },
        sections: [
          {
            title: "Coverage Details",
            quotes: ["Provides $500,000 death benefit", "Term length: 20 years"],
            hiddengem: "Convertible to permanent policy without medical exam",
            blindspot: "Premium increases after term period",
            redflag: "No cash value accumulation",
            clientImplications: "Consider future insurability needs",
          },
          // Add more sections as needed
        ],
        values: [
          {
            timePoint: "Current",
            values: {
              deathBenefitAmount: 500000,
              cashValue: 0,
              netSurrenderValue: 0,
            },
          },
          // Add more time points as needed
        ],
        finalThoughts: "This policy provides good initial coverage but consider long-term needs.",
      },
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching policy data:", error)
    return NextResponse.json({ error: "Failed to fetch policy data" }, { status: 500 })
  }
}

