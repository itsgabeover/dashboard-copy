import { supabase } from './supabase'
import type { APIResponse, ParsedPolicyData } from '@/types/policy'

export async function fetchPolicyData(policyId?: string): Promise<APIResponse> {
  try {
    let query = supabase
      .from('policies')
      .select('*')
    
    // If policyId is provided, fetch specific policy
    if (policyId) {
      query = query.eq('id', policyId)
    } else {
      // Otherwise, get the latest policy
      query = query.order('created_at', { ascending: false })
    }
    
    query = query.limit(1)

    const { data: policies, error } = await query.single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    if (!policies) {
      return {
        success: false,
        data: {} as ParsedPolicyData
      }
    }

    return {
      success: true,
      data: policies.analysis_data as ParsedPolicyData
    }
  } catch (error) {
    console.error("Error fetching policy data:", error)
    throw error
  }
}

// Add other API functions as needed...
