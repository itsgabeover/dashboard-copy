import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function MyPortalButton() {
  return (
    <Link href="/portal" passHref>
      <Button variant="ghost" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        My Portal
      </Button>
    </Link>
  )
}

