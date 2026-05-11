import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { validateApiToken } from '@/lib/apiAuth'

export async function POST(req: Request) {
  const authError = validateApiToken(req)
  if (authError) return authError

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