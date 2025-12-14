import { Card } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { MergedTableDemo } from "@/components/merged-table-demo"

export function MainContent() {
  const stats = [
    { name: "Total Users", value: "2,345", change: "+12.5%", trend: "up" },
    { name: "Revenue", value: "$45,234", change: "+8.2%", trend: "up" },
    { name: "Active Projects", value: "28", change: "+3", trend: "up" },
    { name: "Completion Rate", value: "94.2%", change: "+2.1%", trend: "up" },
  ]

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back, John</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">{stat.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <MergedTableDemo />
        </div>

        {/* Content Area */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">New project created</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {i} hour{i > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-3">
              {["Create New Project", "Invite Team Member", "Generate Report", "View Documentation"].map((action) => (
                <button
                  key={action}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <span className="text-sm font-medium">{action}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
