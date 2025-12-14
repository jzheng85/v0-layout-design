"use client"

import { Home, BarChart3, FileText, Settings, Users, FolderOpen, ChevronLeft, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { getAuthUser, clearAuth } from "@/lib/auth"

const navigation = [
  { name: "Overview", icon: Home, href: "/" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Projects", icon: FolderOpen, href: "/projects" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Team", icon: Users, href: "/team" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(getAuthUser())

  useEffect(() => {
    const mainElement = document.querySelector("main")
    if (mainElement) {
      mainElement.style.marginLeft = isCollapsed ? "5rem" : "16rem"
    }
  }, [isCollapsed])

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col border-r border-border bg-sidebar transition-all duration-300 h-[calc(100vh-4rem)] fixed top-16 left-0 z-30",
        isCollapsed ? "md:w-20" : "md:w-64",
      )}
    >
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isCurrent = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isCurrent
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && item.name}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 mt-auto pt-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && "Logout"}
          </button>

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
        <div className="flex items-center gap-3 w-full">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-sidebar-accent-foreground">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "User"}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || "user@example.com"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
