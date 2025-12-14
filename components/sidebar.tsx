"use client"

import { Home, BarChart3, FileText, Settings, Users, FolderOpen, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigation = [
  { name: "Overview", icon: Home, current: true },
  { name: "Analytics", icon: BarChart3, current: false },
  { name: "Projects", icon: FolderOpen, current: false },
  { name: "Documents", icon: FileText, current: false },
  { name: "Team", icon: Users, current: false },
  { name: "Settings", icon: Settings, current: false },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "md:w-20" : "md:w-64",
      )}
    >
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.name}
                href="#"
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  item.current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && item.name}
              </a>
            )
          })}
        </nav>

        <div className="px-3 mt-auto pt-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
            {!isCollapsed && "Collapse"}
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 flex border-t border-sidebar-border p-4">
        <a href="#" className="flex items-center gap-3 w-full group">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-sidebar-accent-foreground">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">john@example.com</p>
            </div>
          )}
        </a>
      </div>
    </aside>
  )
}
