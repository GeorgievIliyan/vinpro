import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/mongodb'


export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { vin } = await req.json()

    const db = await getDb()

    const account = await db.collection('accounts').findOne({
      clerkId: userId,
    })

    if (!account) {
      return Response.json({ error: "Account not found" }, { status: 404 })
    }

    if (account.remaining_checks <= 0) {
      return Response.json({ error: "No checks left" }, { status: 403 })
    }

    const vinResponse = await fetch(`https://db.vin/api/v1/vin/${vin}`)

    if (!vinResponse.ok) {
      return Response.json({ error: "Vehicle not found or API error" }, { status: vinResponse.status })
    }

    const vinData = await vinResponse.json()

    if (!vinData || Object.keys(vinData).length === 0 || vinData.error) {
      return Response.json({ error: "Vehicle not found. You didn't use a check token." }, { status: 404 })
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

    await db.collection('accounts').updateOne(
      { clerkId: userId },
      { $inc: { remaining_checks: -1 } }
    )

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