"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileCheck,
  FilePlus,
  Users,
  Shield,
  ScrollText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Lock
} from "lucide-react"

// Define menu structure per role
// Define menu structure per role
const roleMenus = {
  gov: [
    { href: "/dashboard/gov", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/gov/verify", label: "Verification Queue", icon: FileCheck },
    { href: "/dashboard/gov/issue", label: "Issue Document", icon: FilePlus },
  ],
  // Fallback
  citizen: []
}

interface GovSidebarProps {
  className?: string
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
  collapsed?: boolean
  setCollapsed?: (collapsed: boolean) => void
}

export function GovSidebar({
  className,
  mobileOpen,
  setMobileOpen,
  collapsed: propCollapsed,
  setCollapsed: propSetCollapsed
}: GovSidebarProps) {
  // Handle internal state if props aren't provided (standalone usage)
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = propCollapsed ?? internalCollapsed
  const setCollapsed = propSetCollapsed ?? setInternalCollapsed

  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<keyof typeof roleMenus>("gov") // Default safe state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get user role from local storage or API
    const fetchUserRole = () => {
      try {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          if (roleMenus[user.role as keyof typeof roleMenus]) {
            setUserRole(user.role as keyof typeof roleMenus)
          }
        }
      } catch (e) {
        console.error("Failed to parse user role", e)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  const menuItems = roleMenus[userRole] || []

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-[#0A2A43] border-r border-white/10 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-[#2DC5A0]/20 p-1.5 rounded-lg">
                <Shield className="w-5 h-5 text-[#2DC5A0]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-tight">SierraVault</span>
                <span className="text-[10px] uppercase text-[#2DC5A0] font-semibold tracking-wider">
                  {userRole.toUpperCase()}
                </span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="bg-[#2DC5A0]/20 p-2 rounded-lg mx-auto">
              <Shield className="w-6 h-6 text-[#2DC5A0]" />
            </div>
          )}

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {loading ? (
            <div className="p-4 text-white/50 text-sm">Loading menu...</div>
          ) : (
            menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                    isActive
                      ? "bg-[#2DC5A0] text-[#0A2A43] font-medium shadow-lg shadow-[#2DC5A0]/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-[#0A2A43]" : "text-gray-400 group-hover:text-white")} />

                  {!collapsed && (
                    <span className="flex-1 text-sm truncate">{item.label}</span>
                  )}

                  {collapsed && isActive && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-full" />
                  )}
                </Link>
              )
            })
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#082236]">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

