import type { ParsedPolicyData, APIResponse } from "@/types/policy"

export async function fetchPolicyData(): Promise<ParsedPolicyData | null> {
  try {
    const response = await fetch("/api/policy")
    if (!response.ok) {
      throw new Error("Failed to fetch policy data")
    }
    const result: APIResponse = await response.json()
    if (result.success && result.data) {
      return result.data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching policy data:", error)
    throw error
  }
}

