import { createClient } from "@supabase/supabase-js"
import Dashboard from "@/components/Dashboard"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function getPolicyData(id: string) {
  const { data, error } = await supabase.from("policies").select("*").eq("id", id).single()

  if (error) throw new Error(error.message)
  return data
}

export default async function DashboardPage({ params }: { params: { id: string } }) {
  const policyData = await getPolicyData(params.id)
  return <Dashboard policyData={policyData} />
}

