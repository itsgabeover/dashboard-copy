import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function HomeButton() {
  return (
    <Link href="/" className="absolute top-4 left-4">
      <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-[#4B6FEE]">
        <Home className="h-4 w-4" />
        Return to Home
      </Button>
    </Link>
  )
}

