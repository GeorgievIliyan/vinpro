import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/mongodb'
import { validateApiToken } from '@/lib/apiAuth'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  const authError = validateApiToken(req)
  if (authError) return authError

  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { vin } = await req.json()

    if (!vin) {
      return Response.json({ error: "Missing VIN in request body" }, { status: 400 })
    }

    const db = await getDb()

    const account = await db.collection('accounts').findOne({
      clerkId: userId,
    })

    if (!account) {
      return Response.json({ error: "Account not found" }, { status: 404 })
    }

    const remainingChecks = Number(account.remaining_checks || 0)

    if (remainingChecks <= 0) {
      return Response.json(
        { error: "No checks left" },
        { status: 403 }
      )
    }

    const vinResponse = await fetch(`https://db.vin/api/v1/vin/${vin}`)

    if (!vinResponse.ok) {
      return Response.json({ error: "Vehicle not found or API error" }, { status: vinResponse.status })
    }

    const vinData = await vinResponse.json()

    if (!vinData || Object.keys(vinData).length === 0 || vinData.error) {
      return Response.json({ error: "Vehicle not found or VIN lookup failed." }, { status: 404 })
    }

    const result = {
      vin: vinData.vin || vin,
      brand: vinData.brand || "",
      model: vinData.model || "",
      year: vinData.year || 0,
      mileage: vinData.mileage || "",
      price: vinData.price || "",
      currency: vinData.currency || "",
      registrationCountry: vinData.registrationCountry || "",
      fuelType: vinData.fuelType || "",
      color: vinData.color || "",
      bodyType: vinData.bodyType || "",
      version: vinData.version || "",
      vehicleHistory: vinData.vehicleHistory || "",
      stolenCheck: vinData.stolenCheck || "",
      vinDecoder: vinData.vinDecoder || ""
    }

    const updatedAccount = await db.collection('accounts').findOneAndUpdate(
      {
        clerkId: userId,
        remaining_checks: { $gt: 0 },
      },
      {
        $inc: { remaining_checks: -1 },
      },
      {
        returnDocument: 'after',
      }
    )

    if (!updatedAccount) {
      return Response.json(
        { error: 'No checks left' },
        { status: 403 }
      )
    }

    await db.collection('checks').insertOne(
      {
        clerkId: userId,
        createdOn: new Date(),
        ...vinData,
      }
    )

    return Response.json(result)

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}