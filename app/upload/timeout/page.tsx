"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TimeoutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Processing Timeout</h2>
        <p className="text-gray-600">
          We were unable to process your policy in the expected time.
          This could be due to high system load or temporary issues.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Link href="/upload">
            <Button variant="outline">Try Again</Button>
          </Link>
          <Link href="/support">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
