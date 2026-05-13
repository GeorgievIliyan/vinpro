import { Card, CardContent } from "@/components/ui/card"
import { Users, ShieldAlert, Activity, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  totalAccounts: number
  totalChecks: number
  lowChecksCount: number
}

export function StatsCards({ totalAccounts, totalChecks, lowChecksCount }: StatsCardsProps) {
  const activeAccounts = totalAccounts - lowChecksCount

  const depletedPct =
    totalAccounts > 0 ? Math.round((lowChecksCount / totalAccounts) * 100) : 0

  const depletedColor =
    depletedPct === 0
      ? "text-emerald-600 bg-emerald-500/10"
      : depletedPct < 20
      ? "text-sky-600 bg-sky-500/10"
      : depletedPct < 50
      ? "text-amber-600 bg-amber-500/10"
      : "text-red-600 bg-red-500/10"

  const stats = [
    {
      label: "Total Accounts",
      value: totalAccounts,
      icon: Users,
      description: "Registered in system",
      iconClass: "text-primary bg-primary/10",
      sub: null,
    },
    {
      label: "Active Accounts",
      value: activeAccounts,
      icon: Activity,
      description: "Have at least 1 check left",
      iconClass: "text-emerald-600 bg-emerald-500/10",
      sub:
        totalAccounts > 0
          ? `${Math.round((activeAccounts / totalAccounts) * 100)}% of total`
          : null,
    },
    {
      label: "Checks in Pool",
      value: totalChecks,
      icon: Layers,
      description: "Remaining across all accounts",
      iconClass: "text-sky-600 bg-sky-500/10",
      sub:
        activeAccounts > 0
          ? `~${(totalChecks / activeAccounts).toFixed(1)} per active account`
          : "No active accounts",
    },
    {
      label: "Depleted",
      value: lowChecksCount,
      icon: ShieldAlert,
      description: "Accounts with 0 checks",
      iconClass: depletedColor,
      sub: totalAccounts > 0 ? `${depletedPct}% of accounts` : null,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-none border-border/60">
          <CardContent className="px-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <div
                className={`size-8 rounded-md flex items-center justify-center shrink-0 ${stat.iconClass}`}
              >
                <stat.icon className="size-3.5" />
              </div>
            </div>
            <div>
              <p
                className={cn(
                  "font-semibold text-foreground leading-none tabular-nums",
                  String(stat.value).length > 9 ? "text-lg" : "text-2xl"
                )}
              >
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{stat.description}</p>
              {stat.sub && (
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 font-medium">
                  {stat.sub}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}