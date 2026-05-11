'use client'

import { useState, useEffect } from 'react'
import { Search, History, ShieldCheck, FileText } from 'lucide-react'
import { getStats, type VinStats } from '@/lib/stats'

export function StatCards() {
  const [stats, setStats] = useState<VinStats | null>(null)

  const load = () => setStats(getStats())

  useEffect(() => {
    load()
    window.addEventListener('vin-stats-updated', load)
    return () => window.removeEventListener('vin-stats-updated', load)
  }, [])

  const cards = [
    {
      label: 'Total Lookups',
      value: stats ? String(stats.totalLookups) : '—',
      icon: Search,
      description: 'VINs checked',
    },
    {
      label: 'Saved Reports',
      value: stats ? String(stats.savedReports) : '—',
      icon: FileText,
      description: 'PDFs downloaded',
    },
    {
      label: 'Checks Today',
      value: stats ? String(stats.checksToday) : '—',
      icon: History,
      description: 'Since midnight',
    },
    {
      label: 'Stolen Alerts',
      value: stats ? String(stats.stolenAlerts) : '0',
      icon: ShieldCheck,
      description: 'Vehicles flagged',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((s) => {
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
          </div>
        )
      })}
    </div>
  )
}