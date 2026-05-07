import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  totalAccounts: number
  totalChecks: number
  lowChecksCount: number
}

export function StatsCards({ totalAccounts, totalChecks, lowChecksCount }: StatsCardsProps) {
  const avgChecks = totalAccounts > 0 ? (totalChecks / totalAccounts).toFixed(1) : "0"

  const stats = [
    {
      label: "Total Accounts",
      value: totalAccounts,
      icon: Users,
      description: "Registered in system",
      iconClass: "text-primary bg-primary/10",
    },
    {
      label: "Total Checks",
      value: totalChecks,
      icon: CheckCircle,
      description: "Across all accounts",
      iconClass: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Avg. Checks",
      value: avgChecks,
      icon: TrendingUp,
      description: "Per account",
      iconClass: "text-sky-600 bg-sky-500/10",
    },
    {
      label: "Low Balance",
      value: lowChecksCount,
      icon: AlertTriangle,
      description: "Accounts with 0 checks",
      iconClass: "text-amber-600 bg-amber-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-none border-border/60">
          <CardContent className="px-4 py-0 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <div className={`size-8 rounded-md flex items-center justify-center shrink-0 ${stat.iconClass}`}>
                <stat.icon className="size-3.5" />
              </div>
            </div>
            <div>
              <p className={cn(
                "font-semibold text-foreground leading-none",
                String(stat.value).length > 9 ? "text-lg" : "text-2xl"
              )}>
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
