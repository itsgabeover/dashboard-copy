import type { ParsedPolicyData } from "@/types/policy"

export async function fetchPolicyData(policyId: string): Promise<ParsedPolicyData | null> {
  try {
    const response = await fetch(`/api/policy/${policyId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch policy data")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching policy data:", error)
    return null
  }
}

