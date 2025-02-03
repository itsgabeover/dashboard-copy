import Link from "next/link" // Import Link component from Next.js

// ... (other imports)

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      {/* ... (other nav items) */}
      <Link href="/portal2" className="text-sm font-medium hover:text-primary">
        My Portal
      </Link>
      {/* ... (other nav items) */}
    </nav>
  )
}

