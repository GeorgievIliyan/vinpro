'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

import { Sidebar } from '../components/dashboard/SideBar'
import { VinLookup } from '../components/dashboard/VinLookup'
import { StatCards } from '../components/dashboard/StatCards'
import { VehicleCard } from '../components/dashboard/VehicleCard'
import { ChecksHistory } from '../components/dashboard/ChecksHistory'
import { incrementLookup, incrementSavedReports } from '@/lib/stats'

interface VehicleData {
  [key: string]: any;
  vin: string
  brand?: string
  model?: string
  year?: string | number
  mileage?: string
  price?: string
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

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const userId = user?.id

  const [vin, setVin] = useState('')
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [checks, setChecks] = useState<VehicleData[]>([])
  const [loadingChecks, setLoadingChecks] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!userId || !isLoaded) return
    fetchChecks()
  }, [isLoaded, userId])

  const checkInfo = async () => {
    if (!vin.trim() || !userId) return
    setLoading(true)
    setVehicleData(null)
    try {
      const response = await fetch('/api/fetch-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin, userId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Failed to fetch vehicle info')
      setVehicleData(data)
      const isStolen =
        typeof data?.stolenCheck === 'string' &&
        data.stolenCheck.toLowerCase().includes('stolen')
      incrementLookup(isStolen)
      fetchChecks()
    } catch (error) {
      console.error('[dashboard] VIN lookup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    if (!vehicleData) return
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      })
      if (!response.ok) throw new Error('Failed to generate PDF')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `car-${vehicleData.vin}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      incrementSavedReports()
    } catch (error) {
      console.error('[dashboard] PDF download failed:', error)
    }
  }

  const fetchChecks = async () => {
    if (!userId) return
    setLoadingChecks(true)
    try {
      const response = await fetch(`/api/fetch-checks?userId=${userId}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Failed to fetch checks')
      setChecks(data)
    } catch (error) {
      console.error('[dashboard] Failed to fetch checks:', error)
    } finally {
      setLoadingChecks(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />

      {/* Main content — offset by sidebar on desktop, bottom-padded on mobile */}
      <main
        className={cn(
          'flex-1 overflow-y-auto transition-all duration-300',
          'md:pl-60',
          collapsed && 'md:pl-16'
        )}
      >
        <header className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/80 px-6 backdrop-blur-sm">
          <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
        </header>

        <div className="mx-auto max-w-5xl space-y-6 p-6 pb-20 md:pb-6">
          <StatCards />
          <VinLookup
            vin={vin}
            onVinChange={setVin}
            onSearch={checkInfo}
            loading={loading}
            disabled={loading}
          />
          {vehicleData && (
            <VehicleCard data={vehicleData} onDownloadPDF={downloadPDF} />
          )}
          <ChecksHistory
            checks={checks}
            loading={loadingChecks}
            onRefresh={fetchChecks}
            disabled={loadingChecks}
          />
        </div>
      </main>
    </div>
  )
}