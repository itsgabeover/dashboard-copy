import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-900">404 - Page Not Found</h1>
        <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
