'use client'

import { useState } from 'react'
import { History, RefreshCw, Loader2, Car, ChevronDown } from 'lucide-react'
import Spec from './Spec'
import { Button } from '@/components/ui/button'

interface Check {
  vin?: string
  brand?: string
  model?: string
  year?: string | number

  mileage?: string
  fuelType?: string
  bodyType?: string
  color?: string | null
  registrationCountry?: string | null
  version?: string | null

  price?: string
  currency?: string

  vehicleHistory?: string
  stolenCheck?: string
  vinDecoder?: string

  createdOn?: string | number | Date | { $date: string }
}

interface ChecksHistoryProps {
  checks: Check[]
  loading: boolean
  onRefresh: () => void
  disabled: boolean
}

export function ChecksHistory({
  checks,
  loading,
  onRefresh,
  disabled,
}: ChecksHistoryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Previous Checks
          </h3>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={disabled || loading}
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>

      {checks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Car className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No checks yet</p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Your VIN lookup history will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {checks.map((check, i) => {
            const isOpen = openIndex === i
            const label = [check.brand, check.model, check.year]
              .filter(Boolean)
              .join(' ')

            return (
              <li key={i} className="px-6 py-3">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center gap-3 hover:bg-muted/50 transition-colors rounded-lg p-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-medium text-foreground truncate">
                      {label || 'Unknown vehicle'}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono tracking-wide">
                      {check.vin}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 ml-11 rounded-xl bg-muted/20 p-4 space-y-4">

                    {/* specs grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                      <Spec label="Mileage" value={check.mileage} />
                      <Spec label="Fuel" value={check.fuelType} />
                      <Spec label="Body" value={check.bodyType} />
                      <Spec label="Color" value={check.color} />
                      <Spec label="Country" value={check.registrationCountry} />
                      <Spec label="Version" value={check.version} />
                      <Spec label="Price" value={
                        check.price ? `${check.price} ${check.currency ?? ''}` : undefined
                      } />
                    </div>

                    <div className="h-px bg-border" />

                    {/* links section */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {check.vehicleHistory && (
                        <a
                          href={check.vehicleHistory}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition"
                        >
                          History report
                        </a>
                      )}

                      {check.stolenCheck && (
                        <a
                          href={check.stolenCheck}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition"
                        >
                          Stolen check
                        </a>
                      )}

                      {check.vinDecoder && (
                        <a
                          href={check.vinDecoder}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition"
                        >
                          VIN decoder
                        </a>
                      )}
                    </div>

                    {/* footer date */}
                    {check.createdOn && (
                      <p className="text-[11px] text-muted-foreground pt-1">
                        Checked on{" "}
                        {new Date(
                          typeof check.createdOn === "object" && "$date" in check.createdOn
                            ? (check.createdOn as any).$date
                            : (check.createdOn as any)
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}