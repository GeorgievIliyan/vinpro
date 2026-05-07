"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Copy, User, KeyRound } from "lucide-react"
import { toast } from "sonner"

interface Credentials {
  username: string
  password: string
}

interface CreateAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<Credentials | null>
}

export function CreateAccountDialog({ open, onOpenChange, onConfirm }: CreateAccountDialogProps) {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  const handleCreate = async () => {
    setLoading(true)
    try {
      const result = await onConfirm()
      if (result) setCredentials(result)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const handleClose = (val: boolean) => {
    onOpenChange(val)
    if (!val) setTimeout(() => setCredentials(null), 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            {credentials ? "Account created" : "Create new account"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {credentials
              ? "The account was created successfully. Save these credentials now."
              : "A new account will be created with auto-generated credentials."}
          </DialogDescription>
        </DialogHeader>

        {credentials ? (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              <CheckCircle2 className="size-4" />
              Account created successfully
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              {/* потребител */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="size-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Username</p>
                    <p className="text-sm font-mono font-medium text-foreground truncate">{credentials.username}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => copyToClipboard(credentials.username, "Username")}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>

              {/* парола */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <KeyRound className="size-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Password</p>
                    <p className="text-sm font-mono font-medium text-foreground truncate">{credentials.password}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => copyToClipboard(credentials.password, "Password")}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
                Store credentials securely
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => copyToClipboard(`Username: ${credentials.username}\nPassword: ${credentials.password}`, "Credentials")}
                >
                  <Copy className="size-3" />
                  Copy all
                </Button>
                <Button size="sm" className="h-8 text-xs" onClick={() => handleClose(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" className="h-8" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 gap-1.5" onClick={handleCreate} disabled={loading}>
              {loading && <Spinner className="size-3" />}
              {loading ? "Creating..." : "Create account"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
