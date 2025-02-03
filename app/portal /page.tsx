// app/portal/page.tsx
export default function PortalPage() {
  console.log("Basic portal page rendering")
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">My Policy Analysis Portal</h1>
        <p>Basic portal content</p>
      </main>
    </div>
  )
}
