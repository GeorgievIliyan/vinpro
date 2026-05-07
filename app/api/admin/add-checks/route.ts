import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { isDev } from '@/lib/utils'

export async function POST(req: Request) {
  const token = req.headers.get('x-api-token')

  if (!isDev && (!token || token == "")) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 401 }
    )
  }

  const { clerkId, amount } = await req.json()

  if (!clerkId || typeof amount !== 'number') {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    )
  }

  const db = await getDb()

  await db.collection('accounts').updateOne(
    { clerkId },
    { $inc: { remaining_checks: amount } }
  )

  return NextResponse.json({ success: true })
}