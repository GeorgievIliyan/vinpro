'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Car
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SignOutButton } from '@clerk/nextjs'

const navItems = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin' },
  { icon: Car, label: 'VIN Lookup', href: '/dashboard' },
]

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (val: boolean) => void
  onLogout?: () => void
}

export function AdminSidebar({ collapsed, onCollapsedChange, onLogout }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen z-50 flex-col border-r border-border bg-AdminSidebar transition-all duration-300 ease-in-out',
          'hidden md:flex',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center gap-2.5 px-4 py-5 border-b border-border',
            collapsed && 'justify-center px-0'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-foreground">
              VinPro
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-2 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            const link = (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )

            return collapsed ? (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              link
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-2">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <SignOutButton>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                <span>Logout</span>
              </button>
            </SignOutButton>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="absolute -right-3 top-6 z-999 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-sidebar shadow-sm hover:bg-muted transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      </aside>

      {/* ── Mobile bottom nav (visible on mobile only) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-AdminSidebar">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <SignOutButton>
          <button
            onClick={onLogout}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </SignOutButton>
      </nav>
    </TooltipProvider>
  )
}