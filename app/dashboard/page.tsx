'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import LogoutButton from '../components/LogoutButton'

const DashboardPage = () => {
  const { user, isLoaded, isSignedIn } = useUser()

  const [vin, setVin] = useState<string>('')
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [checks, setChecks] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingChecks, setLoadingChecks] = useState<boolean>(false)

  // зареждам проверени коли
  useEffect(() => {
    if (!user?.id) return

    const saved = localStorage.getItem(`checks_${user.id}`)

    if (saved) {
      setChecks(JSON.parse(saved))
    } else {
      fetchChecks()
    }
  }, [user?.id])

  // вадя данни за колата
  const checkInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/fetch-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Something went wrong')
        setVehicleData(null)
      } else {
        setVehicleData(data)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to fetch vehicle information.')
    } finally {
      setLoading(false)
    }
  }

  // експорт pdf
  const downloadPDF = async () => {
    if (!vehicleData) return

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      if (!res.ok) {
        alert('Failed to generate PDF')
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `car-${vehicleData.vin}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Download failed')
    }
  }
  // взимам предишни проверки
  const fetchChecks = async () => {
    if (!user?.id) return

    setLoadingChecks(true)

    try {
      const response = await fetch(`/api/fetch-checks?userId=${user.id}`)
      const data = await response.json()

      if (response.ok) {
        setChecks(data)
        localStorage.setItem('checks', JSON.stringify(data))
      } else {
        alert('Failed to load previous checks')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingChecks(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="mt-4">
        <LogoutButton />
      </div>

      {/* поле vin */}
      <div className="mt-6 flex gap-2">
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value.trim())}
          placeholder="Enter VIN"
          className="border px-3 py-2 w-80"
        />

        <button
          onClick={checkInfo}
          disabled={!isLoaded || !isSignedIn || loading}
          className="border px-4 py-2"
        >
          {loading ? 'Checking...' : 'Check Info'}
        </button>

        <button
          onClick={fetchChecks}
          disabled={!isLoaded || !isSignedIn || loadingChecks}
          className="border px-4 py-2"
        >
          {loadingChecks ? 'Loading...' : 'Previous Checks'}
        </button>
      </div>

      {/* данни за колата */}
      {vehicleData && (
        <div className="mt-6 p-4 border">
          <h2 className="font-semibold">Vehicle Information</h2>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <strong>VIN:</strong> <span>{vehicleData.vin}</span>
            <strong>Brand:</strong> <span>{vehicleData.brand || 'N/A'}</span>
            <strong>Model:</strong> <span>{vehicleData.model || 'N/A'}</span>
            <strong>Year:</strong> <span>{vehicleData.year || 'N/A'}</span>
            <strong>Mileage:</strong> <span>{vehicleData.mileage || 'N/A'}</span>
            <strong>Price:</strong>
            <span>
              {vehicleData.price
                ? `${vehicleData.price} ${vehicleData.currency}`
                : 'N/A'}
            </span>
            <strong>Country:</strong>
            <span>{vehicleData.registrationCountry || 'N/A'}</span>
            <strong>Fuel:</strong> <span>{vehicleData.fuelType || 'N/A'}</span>
            <strong>Color:</strong> <span>{vehicleData.color || 'N/A'}</span>
            <strong>Body:</strong> <span>{vehicleData.bodyType || 'N/A'}</span>
            <strong>Version:</strong> <span>{vehicleData.version || 'N/A'}</span>
          </div>

          <div className="mt-4">
            <button onClick={downloadPDF} className="border px-4 py-2">
              Download PDF
            </button>
          </div>

          <div className="mt-4">
            <strong>Vehicle History:</strong>{' '}
            {vehicleData.vehicleHistory ? (
              <a href={vehicleData.vehicleHistory} className="underline">
                View
              </a>
            ) : (
              'N/A'
            )}
          </div>

          <div className="mt-2">
            <strong>Stolen Check:</strong>{' '}
            {vehicleData.stolenCheck ? (
              <a href={vehicleData.stolenCheck} className="underline">
                View
              </a>
            ) : (
              'N/A'
            )}
          </div>

          <div className="mt-2">
            <strong>VIN Decoder:</strong>{' '}
            {vehicleData.vinDecoder ? (
              <a href={vehicleData.vinDecoder} className="underline">
                View
              </a>
            ) : (
              'N/A'
            )}
          </div>
        </div>
      )}

      <div className="border p-3">
        <div>VIN: WAUZZZF44HA007970</div>
        <div>Brand: Audi</div>
        <div>Model: A4</div>
        <div>Year: 2016</div>
        <div>Mileage: 150000-200000</div>
        <div>Price: 33900.00 BGN</div>
        <div>Registration Country: N/A</div>
        <div>Fuel Type: diesel</div>
        <div>Color: N/A</div>
        <div>Body Type: Wagon</div>
        <div>Version: N/A</div>

        <div>
          Vehicle History:{" "}
          <a className="underline" href="https://www.automoli.com/en/page/partnerid=80001322/vin=WAUZZZF44HA007970/" target="_blank">
            link
          </a>
        </div>

        <div>
          Stolen Check:{" "}
          <a className="underline" href="http://www.stolencars.eu/vin/WAUZZZF44HA007970" target="_blank">
            link
          </a>
        </div>

        <div>
          VIN Decoder:{" "}
          <a className="underline" href="https://vindecoder.pl/en/decode/WAUZZZF44HA007970" target="_blank">
            link
          </a>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage