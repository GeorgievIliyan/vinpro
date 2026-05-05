'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import LogoutButton from '../components/LogoutButton'

const DashboardPage = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const [vin, setVin] = useState<string>('')
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // fetch car info
  const checkInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/fetch-info', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vin }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Something went wrong")
        setVehicleData(null)
      } else {
        setVehicleData(data)
      }

    } catch (err) {
      console.error('An error has occurred: ', err)
      alert("Failed to fetch vehicle information. You have not been charged a check token. ")
    } finally {
      setLoading(false)
    }
  }

  // save as pdf
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <LogoutButton />

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value.trim())}
          placeholder="Enter VIN"
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />

        <button
          onClick={checkInfo}
          disabled={!isLoaded || !isSignedIn || loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Checking..." : "Check Info"}
        </button>
      </div>

      {vehicleData && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}>
          <h2>Vehicle Information</h2>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "10px", marginTop: "15px" }}>
            <strong>VIN:</strong>
            <span>{vehicleData.vin}</span>

            <strong>Brand:</strong>
            <span>{vehicleData.brand || "N/A"}</span>

            <strong>Model:</strong>
            <span>{vehicleData.model || "N/A"}</span>

            <strong>Year:</strong>
            <span>{vehicleData.year || "N/A"}</span>

            <strong>Mileage:</strong>
            <span>{vehicleData.mileage || "N/A"}</span>

            <strong>Price:</strong>
            <span>{vehicleData.price ? `${vehicleData.price} ${vehicleData.currency}` : "N/A"}</span>

            <strong>Registration Country:</strong>
            <span>{vehicleData.registrationCountry || "N/A"}</span>

            <strong>Fuel Type:</strong>
            <span>{vehicleData.fuelType || "N/A"}</span>

            <strong>Color:</strong>
            <span>{vehicleData.color || "N/A"}</span>

            <strong>Body Type:</strong>
            <span>{vehicleData.bodyType || "N/A"}</span>

            <strong>Version:</strong>
            <span>{vehicleData.version || "N/A"}</span>
          </div>

          <button onClick={() => downloadPDF()}>
            Download as pdf
          </button>

          <div style={{ marginTop: "20px" }}>
            <strong>Vehicle History:</strong>
            {vehicleData.vehicleHistory ? (
              <a href={vehicleData.vehicleHistory} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px" }}>
                View History
              </a>
            ) : (
              <span style={{ marginLeft: "10px" }}>N/A</span>
            )}
          </div>

          <div style={{ marginTop: "10px" }}>
            <strong>Stolen Check:</strong>
            {vehicleData.stolenCheck ? (
              <a href={vehicleData.stolenCheck} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px" }}>
                Check Report
              </a>
            ) : (
              <span style={{ marginLeft: "10px" }}>N/A</span>
            )}
          </div>

          <div style={{ marginTop: "10px" }}>
            <strong>VIN Decoder:</strong>
            {vehicleData.vinDecoder ? (
              <a href={vehicleData.vinDecoder} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px" }}>
                Decode Full Info
              </a>
            ) : (
              <span style={{ marginLeft: "10px" }}>N/A</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage