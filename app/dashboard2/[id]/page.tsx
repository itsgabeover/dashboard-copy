import Dashboard from "@/components/Dashboard"

export default function DashboardPage({ params }: { params: { id: string } }) {
  return <Dashboard policyId={params.id} />
}

