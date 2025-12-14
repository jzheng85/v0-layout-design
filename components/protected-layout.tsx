"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show header and sidebar on login page
  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 md:ml-64">{children}</main>
      </div>
    </div>
  )
}
