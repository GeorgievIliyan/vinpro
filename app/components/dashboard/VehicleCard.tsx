'use client'

import {
  Car,
  Fuel,
  Palette,
  MapPin,
  Gauge,
  Calendar,
  Tag,
  FileText,
  ShieldCheck,
  Link2,
  Download,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface VehicleData {
  vin: string
  brand?: string
  model?: string
  year?: string | number
  mileage?: string
  price?: string | number
  currency?: string
  registrationCountry?: string
  fuelType?: string
  color?: string
  bodyType?: string
  version?: string
  vehicleHistory?: string
  stolenCheck?: string
  vinDecoder?: string
}

interface VehicleCardProps {
  data: VehicleData
  onDownloadPDF: () => void
  pdfLoading?: boolean
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string | number | null
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">
          {value || 'N/A'}
        </p>
      </div>
    </div>
  )
}

export function VehicleCard({ data, onDownloadPDF, pdfLoading }: VehicleCardProps) {
  const title = [data.brand, data.model, data.year].filter(Boolean).join(' ')

  const links = [
    { label: 'Vehicle History', href: data.vehicleHistory, icon: FileText },
    { label: 'Stolen Check', href: data.stolenCheck, icon: ShieldCheck },
    { label: 'VIN Decoder', href: data.vinDecoder, icon: Link2 },
  ]

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground text-balance">
              {title || 'Vehicle Details'}
            </h3>
            <p className="text-xs text-muted-foreground font-mono tracking-widest">{data.vin}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data.bodyType && (
            <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
              {data.bodyType}
            </Badge>
          )}
          <Button
            onClick={onDownloadPDF}
            size="sm"
            variant="outline"
            disabled={pdfLoading}
            className="h-8 text-xs gap-1.5"
          >
            {pdfLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            PDF
          </Button>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
        <Field icon={Car} label="Brand" value={data.brand} />
        <Field icon={Car} label="Model" value={data.model} />
        <Field icon={Calendar} label="Year" value={data.year} />
        <Field
          icon={Tag}
          label="Price"
          value={
            data.price != null
              ? data.currency === "BGN"
                ? typeof data.price === 'number'
                  ? `${(data.price * 0.51).toFixed(2)} EUR`
                  : Number.isFinite(Number(data.price))
                  ? `${(Number(data.price) * 0.51).toFixed(2)} EUR`
                  : `${data.price} ${data.currency ?? ""}`.trim()
                : `${data.price} ${data.currency ?? ""}`.trim()
              : undefined
          }
        />
        <Field icon={Gauge} label="Mileage" value={data.mileage} />
        <Field icon={MapPin} label="Country" value={data.registrationCountry} />
        <Field icon={Fuel} label="Fuel" value={data.fuelType} />
        <Field icon={Palette} label="Color" value={data.color} />
        <Field icon={Car} label="Version" value={data.version} />
      </div>

      {/* External links */}
      {links.some((l) => l.href) && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2 px-6 py-4">
            {links.map(({ label, href, icon: Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </a>
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  )
}
