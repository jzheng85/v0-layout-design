import Link from "next/link"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <FileQuestion className="h-24 w-24 text-muted-foreground/40" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-destructive">404</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground text-balance">
            Sorry, the page you are looking for doesn't exist or hasn't been implemented yet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  )
}
