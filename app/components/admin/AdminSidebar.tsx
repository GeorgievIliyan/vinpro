"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  Search,
} from "lucide-react"

type NavItem = {
  label: string
  icon: LucideIcon
  href: string
  badge?: string
}

type NavGroup = {
  section: string
  items: NavItem[]
}

const navItems: NavGroup[] = [
  {
    section: "General",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Check", icon: Search, href: "/dashboard" },
    ],
  },
]

interface AdminSidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const handleToggle = () => {
    if (open) {
      onOpenChange?.(false)
      return
    }
    setCollapsed((value) => !value)
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange?.(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-200 lg:static lg:shadow-none",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none lg:translate-x-0",
          collapsed ? "lg:w-14 w-72" : "lg:w-56 w-72"
        )}
      >
        {/* лого */}
        <div className={cn("flex items-center gap-2.5 px-4 h-14 border-b border-border", collapsed && "justify-center px-0")}>
          <div className="size-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-tight text-foreground">AdminPanel</span>
          )}
        </div>

        {/* навигация */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-5">
          {navItems.map((group) => (
            <div key={group.section} className="flex flex-col gap-0.5">
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.label}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2.5 h-8 text-sm font-medium",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 rounded-sm font-mono">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </Button>
                )
              })}
            </div>
          ))}
        </nav>

        <Separator />

        {/* бутон свиване */}
        <div className="p-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={handleToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
          </Button>
        </div>
      </aside>
    </>
  )
}