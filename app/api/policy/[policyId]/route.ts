import { NextResponse } from "next/server";
import type { ParsedPolicyData } from "@/types/policy";

export async function POST(request: Request) {
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
  request: Request,
  { params }: { params: { policyId: string } }
) {
  try {
    // Use the policyId in your logic (e.g., database query)
    console.log(`Fetching policy data for ID: ${params.policyId}`);

    // In a real application, you would fetch the policy data from a database using the policyId
    // For now, we'll return an error as we don't have a database connected
    return NextResponse.json(
      { error: "Policy not found", policyId: params.policyId },
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
