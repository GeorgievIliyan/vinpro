"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import {
  MoreHorizontal,
  PlusCircle,
  Trash2,
  KeyRound,
  Search,
  ArrowUpDown,
  Filter,
  Users,
} from "lucide-react"

type Account = {
  _id: string
  clerkId: string
  username?: string
  remaining_checks: number
}

interface AccountsTableProps {
  accounts: Account[]
  loading: boolean
  onAddChecks: (clerkId: string, amount: number) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onResetPassword: (clerkId: string) => Promise<void>
}

type SortField = "username" | "remaining_checks"
type SortDir = "asc" | "desc"

export function AccountsTable({
  accounts,
  loading,
  onAddChecks,
  onDelete,
  onResetPassword,
}: AccountsTableProps) {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("username")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const filtered = accounts
    .filter((a) => {
      const q = search.toLowerCase()
      return (
        (a.username ?? "").toLowerCase().includes(q) ||
        a.clerkId.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortField === "username") {
        comparison = (a.username ?? "").localeCompare(b.username ?? "")
      } else {
        comparison = a.remaining_checks - b.remaining_checks
      }
      return sortDir === "asc" ? comparison : -comparison
    })

  const handleAction = async (key: string, fn: () => Promise<void>) => {
    setActionLoading(key)
    try {
      await fn()
    } finally {
      setActionLoading(null)
    }
  }

  const initials = (username?: string) =>
    username ? username.slice(0, 2).toUpperCase() : "??"

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* табл. тулбар */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Filter className="size-3" />
            Filter
          </Button>
        </div>

        {/* таблица */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[200px]">
                  <button
                    onClick={() => handleSort("username")}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Account
                    <ArrowUpDown className={cn("size-3", sortField === "username" && "text-foreground")} />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-xs text-muted-foreground">
                  Clerk ID
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("remaining_checks")}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Checks
                    <ArrowUpDown className={cn("size-3", sortField === "remaining_checks" && "text-foreground")} />
                  </button>
                </TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="size-7 rounded-full" />
                        <Skeleton className="h-3.5 w-24 rounded" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-3 w-44 rounded" />
                    </TableCell>
                    <TableCell><Skeleton className="h-3.5 w-8 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Empty className="py-12 border-0">
                      <EmptyMedia variant="icon">
                        <Users />
                      </EmptyMedia>
                      <EmptyHeader>
                        <EmptyTitle>No accounts found</EmptyTitle>
                        <EmptyDescription>
                          {search ? "Try a different search term." : "Create the first account to get started."}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((acc) => (
                  <TableRow key={acc._id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                            {initials(acc.username)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {acc.username || <span className="text-muted-foreground italic">No username</span>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px] block cursor-default">
                            {acc.clerkId}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="font-mono text-xs">{acc.clerkId}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {acc.remaining_checks}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={acc.remaining_checks === 0 ? "destructive" : acc.remaining_checks < 3 ? "outline" : "secondary"}
                        className="text-[10px] h-5 px-1.5 rounded-sm font-medium"
                      >
                        {acc.remaining_checks === 0 ? "Empty" : acc.remaining_checks < 3 ? "Low" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="size-3.5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="text-sm gap-2"
                              disabled={actionLoading === `checks-${acc._id}`}
                              onSelect={() =>
                                handleAction(`checks-${acc._id}`, () => onAddChecks(acc.clerkId, 1))
                              }
                            >
                              <PlusCircle className="size-3.5" />
                              Add 1 check
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-sm gap-2"
                              disabled={actionLoading === `checks5-${acc._id}`}
                              onSelect={() =>
                                handleAction(`checks5-${acc._id}`, () => onAddChecks(acc.clerkId, 5))
                              }
                            >
                              <PlusCircle className="size-3.5" />
                              Add 5 checks
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-sm gap-2"
                              disabled={actionLoading === `reset-${acc._id}`}
                              onSelect={() =>
                                handleAction(`reset-${acc._id}`, () => onResetPassword(acc.clerkId))
                              }
                            >
                              <KeyRound className="size-3.5" />
                              Reset password
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-sm gap-2 text-destructive focus:text-destructive"
                            onSelect={() => setDeleteTarget(acc)}
                          >
                            <Trash2 className="size-3.5" />
                            Delete account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {accounts.length} accounts
          </p>
        )}
      </div>

      {/* потвърждение изтриване */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{deleteTarget?.username || "this account"}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteTarget) {
                  await onDelete(deleteTarget._id)
                  setDeleteTarget(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
