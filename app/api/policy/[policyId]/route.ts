import { NextRequest, NextResponse } from "next/server";
import type { ParsedPolicyData } from "@/types/policy";

export async function POST(request: NextRequest) {
  try {
    const policyData: ParsedPolicyData = await request.json();

    // In a real application, you would save this data to a database
    // For now, we'll just return it
    return NextResponse.json({
      success: true,
      data: policyData,
    });
  } catch (error) {
    console.error("Error processing policy data:", error);
    return NextResponse.json({ error: "Failed to process policy data" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { policyId: string } }
) {
  try {
    const { policyId } = context.params;
    console.log(`Fetching policy data for ID: ${policyId}`);

    // In a real application, you would fetch the policy data from a database using the policyId
    // For now, we'll return an error as we don't have a database connected
    return NextResponse.json(
      { error: "Policy not found", policyId },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching policy data:", error);
    return NextResponse.json(
      { error: "Failed to fetch policy data" },
      { status: 500 }
    );
  }
}
