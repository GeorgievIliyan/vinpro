"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, LogOut, User, Settings, Menu } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"

interface AdminHeaderProps {
  onRefresh?: () => void
  totalAccounts: number
  onMenuToggle?: () => void
}

export function AdminHeader({ onRefresh, totalAccounts, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
      {onMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground lg:hidden"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Menu className="size-3.5" />
        </Button>
      )}

      {/* контекст */}
      <div className="flex items-center gap-2 mr-2">
        <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex-1" />

      {/* бързи действия */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RefreshCw className="size-3.5" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        <Badge variant="secondary" className="text-xs h-6 px-2 rounded-md gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
          {totalAccounts} accounts
        </Badge>

        {/* профил */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 rounded-full p-0 hover:ring-2 hover:ring-border">
              <Avatar className="size-7">
                <AvatarFallback className="text-[10px] font-semibold bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-sm gap-2">
                <User className="size-3.5" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm gap-2">
                <Settings className="size-3.5" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem className="text-sm gap-2 text-destructive focus:text-destructive">
                <LogOut className="size-3.5" />
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
