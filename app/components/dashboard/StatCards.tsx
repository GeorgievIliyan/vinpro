import { Search, History, ShieldCheck, FileText } from 'lucide-react'

// TODO: remove mockup data
const stats = [
  {
    label: 'Total Lookups',
    value: '—',
    icon: Search,
    description: 'VINs checked',
  },
  {
    label: 'Saved Reports',
    value: '—',
    icon: FileText,
    description: 'PDFs downloaded',
  },
  {
    label: 'Checks Today',
    value: '—',
    icon: History,
    description: 'Since midnight',
  },
  {
    label: 'Stolen Alerts',
    value: '0',
    icon: ShieldCheck,
    description: 'Vehicles flagged',
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => {
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
