'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

import { Sidebar } from '../components/dashboard/SideBar'
import { VinLookup } from '../components/dashboard/VinLookup'
import { StatCards } from '../components/dashboard/StatCards'
import { VehicleCard } from '../components/dashboard/VehicleCard'
import { ChecksHistory } from '../components/dashboard/ChecksHistory'
import { incrementLookup, incrementSavedReports } from '@/lib/stats'

// vehicle data type
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
  // clerk user
  const { user } = useUser()

  // current user id
  const userId = user?.id

  // vin input
  const [vin, setVin] = useState('')

  // vehicle result
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)

  // vin lookup loading
  const [loading, setLoading] = useState(false)

  // previous checks
  const [checks, setChecks] = useState<VehicleData[]>([])

  // previous checks loading
  const [loadingChecks, setLoadingChecks] = useState(false)

  // load checks when available
  useEffect(() => {
    if (!userId) return

    fetchChecks()
  }, [userId])

  // fetch vehicle info
  const checkInfo = async () => {
    if (!vin.trim() || !userId) return

    setLoading(true)

    // clear result
    setVehicleData(null)

    try {
      const response = await fetch('/api/fetch-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vin,
          userId,
        }),
      })

      const data = await response.json()

      // error if failed
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch vehicle info')
      }

      // save data
      setVehicleData(data)

      // Determine if the vehicle was flagged as stolen
      const isStolen =
        typeof data?.stolenCheck === 'string' &&
        data.stolenCheck.toLowerCase().includes('stolen')

      // Increment stats in localStorage
      incrementLookup(isStolen)

      // refresh history
      fetchChecks()
    } catch (error) {
      console.error('[dashboard] VIN lookup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // download pdf
  const downloadPDF = async () => {
    if (!vehicleData) return

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      // error if failed
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // convert to blob
      const blob = await response.blob()

      // temp url
      const url = window.URL.createObjectURL(blob)

      // temp anchor
      const a = document.createElement('a')

      a.href = url
      a.download = `car-${vehicleData.vin}.pdf`

      document.body.appendChild(a)

      // trigger
      a.click()

      // cleanup
      a.remove()
      window.URL.revokeObjectURL(url)

      // Increment saved reports stat
      incrementSavedReports()
    } catch (error) {
      console.error('[dashboard] PDF download failed:', error)
    }
  }

  // fetch previous checks
  const fetchChecks = async () => {
    if (!userId) return

    setLoadingChecks(true)

    try {
      const response = await fetch(
        `/api/fetch-checks?userId=${userId}`
      )

      const data = await response.json()

      // error if failed
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch checks')
      }

      // save checks
      setChecks(data)
    } catch (error) {
      console.error('[dashboard] Failed to fetch checks:', error)
    } finally {
      setLoadingChecks(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <main className="flex-1 overflow-y-auto">
        {/* header */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/80 px-6 backdrop-blur-sm">
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Dashboard
            </h1>
          </div>
        </header>

        {/* dashboard content */}
        <div className="mx-auto max-w-5xl space-y-6 p-6">
          {/* statistics cards */}
          <StatCards />

          {/* VIN lookup section */}
          <VinLookup
            vin={vin}
            onVinChange={setVin}
            onSearch={checkInfo}
            loading={loading}
            disabled={loading}
          />

          {/* vehicle result card */}
          {vehicleData && (
            <VehicleCard
              data={vehicleData}
              onDownloadPDF={downloadPDF}
            />
          )}

          {/* previous checks history */}
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