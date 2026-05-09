'use client'

import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface VinLookupProps {
  vin: string
  onVinChange: (v: string) => void
  onSearch: () => void
  loading: boolean
  disabled: boolean
}

export function VinLookup({ vin, onVinChange, onSearch, loading, disabled }: VinLookupProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4 text-balance">
        Check VIN
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={vin}
            onChange={(e) => onVinChange(e.target.value.trim())}
            placeholder="e.g. WAUZZZF44HA007970"
            className="pl-9 font-mono text-sm tracking-wide h-10"
            onKeyDown={(e) => e.key === 'Enter' && !disabled && onSearch()}
          />
        </div>
        <Button
          onClick={onSearch}
          disabled={disabled || !vin}
          className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Checking…
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Check
            </>
          )}
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        A VIN is a unique 17-character vehicle identifier found on the dashboard, door frame, or registration
      </p>
    </div>
  )
}
