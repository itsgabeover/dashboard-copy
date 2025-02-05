import type { APIResponse } from "@/types/policy"

async function fetchPolicyDataFromAPI(): Promise<APIResponse> {
  const res = await fetch("/api/policy-data")
  if (!res.ok) {
    throw new Error(`Error! status: ${res.status}`)
  }
  return res.json()
}

export const fetchPolicyData = async (): Promise<APIResponse["data"] | null> => {
  try {
    const data = await fetchPolicyDataFromAPI()
    return data.success ? data.data : null
  } catch (error) {
    console.error("Error fetching policy data:", error)
    return null
  }
}

