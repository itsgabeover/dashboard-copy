export interface PolicyValue {
  timePoint: string
  values: {
    deathBenefitAmount: number
    cashValue: number
    netSurrenderValue: number
  }
}

export interface PolicySection {
  title: string
  quotes: string[]
  hiddengem: string | null
  blindspot: string | null
  redflag: string | null
  clientImplications: string | null
  content?: string
  insights?: string[]
}

export interface PolicyOverview {
  productName: string
  issuer: string
  productType: string
  deathBenefit: number
  annualPremium: number
  riders: string[]
  policyStatus?: string
}

export interface ParsedPolicyData {
  timestamp: string
  data: {
    policyOverview: PolicyOverview
    sections: PolicySection[]
    values: PolicyValue[]
    finalThoughts: string
  }
}

export interface APIResponse {
  success: boolean
  data: ParsedPolicyData
}

