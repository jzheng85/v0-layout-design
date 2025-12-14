import { MergedTableDemo } from "@/components/merged-table-demo"

export default function AnalyticsPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Analytics</h1>
          <p className="text-muted-foreground mt-1">View and analyze your team performance data</p>
        </div>
        <MergedTableDemo />
      </div>
    </main>
  )
}
