import type { ParsedPolicyData, APIResponse } from "@/types/policy";

export async function fetchPolicyData(policyId: string): Promise<ParsedPolicyData> {
  const response = await fetch(`/api/policy/${policyId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch policy data');
  }
  
  const { data }: APIResponse = await response.json();
  return data;
}
