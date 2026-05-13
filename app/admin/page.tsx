"use client"

import { useEffect, useState, useCallback } from "react"
import { AdminSidebar } from "../components/admin/AdminSidebar"
import { AdminHeader } from "../components/admin/AdminHeader"
import { StatsCards } from "../components/admin/StatsCard"
import { AccountsTable } from "../components/admin/AccountsTable"
import { CreateAccountDialog } from "../components/admin/CreateAccountDialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Account = {
  _id: string
  clerkId: string
  username?: string
  remaining_checks: number
}

export default function AdminPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/accounts")
      const data = await res.json()
      if (res.ok) {
        setAccounts(data)
      } else {
        toast.error(data.error || "Failed to load accounts")
      }
    } catch {
      toast.error("Network error — could not fetch accounts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/create-account", { method: "POST" })
      const data = await response.json()
      if (response.ok) {
        toast.success("Account created")
        fetchAccounts()
        return { username: data.username, password: data.password }
      } else {
        toast.error(data.error ?? "Failed to create account")
        return null
      }
    } catch {
      toast.error("Network error")
      return null
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" })
      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a._id !== id))
        toast.success("Account deleted")
      } else {
        toast.error("Failed to delete account")
      }
    } catch {
      toast.error("Network error")
    }
  }

  const handleAddChecks = async (clerkId: string, amount: number) => {
    try {
      const res = await fetch("/api/admin/add-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId, amount }),
      })
      if (res.ok) {
        toast.success(`Added ${amount} check${amount > 1 ? "s" : ""}`)
        fetchAccounts()
      } else {
        toast.error("Failed to add checks")
      }
    } catch {
      toast.error("Network error")
    }
  }

  const handleResetPassword = async (clerkId: string) => {
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to reset password")
        return
      }
      toast.success(`New password: ${data.password}`, {
        duration: 8000,
        description: "Copy this before dismissing.",
      })
    } catch {
      toast.error("Network error")
    }
  }

  const totalChecks = accounts.reduce((sum, a) => sum + a.remaining_checks, 0)
  const lowChecksCount = accounts.filter((a) => a.remaining_checks === 0).length

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />

      {/* Main content — offset by sidebar on desktop, bottom-padded on mobile */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300',
          'md:pl-60',
          collapsed && 'md:pl-16'
        )}
      >
        <AdminHeader
          onRefresh={fetchAccounts}
          totalAccounts={accounts.length}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Account Management</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Create, manage, and monitor all user accounts.
                </p>
              </div>
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs shrink-0"
                onClick={() => setCreateOpen(true)}
              >
                <PlusCircle className="size-3.5" />
                New account
              </Button>
            </div>

            <StatsCards
              totalAccounts={accounts.length}
              totalChecks={totalChecks}
              lowChecksCount={lowChecksCount}
            />

            <Separator />

            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">All accounts</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage individual accounts, adjust checks, or reset credentials.
                </p>
              </div>
              <AccountsTable
                accounts={accounts}
                loading={loading}
                onAddChecks={handleAddChecks}
                onDelete={handleDelete}
                onResetPassword={handleResetPassword}
              />
            </div>
          </div>
        </main>
      </div>

      <CreateAccountDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onConfirm={handleCreate}
      />

      <Toaster />
    </div>
  )
}