import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { nanoid } from 'nanoid'
import { validateApiToken } from '@/lib/apiAuth'

export async function POST(req: NextRequest) {
  const authError = validateApiToken(req)
  if (authError) return authError

  try {
    const { clerkId } = await req.json()

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Missing clerkId' },
        { status: 400 }
      )
    }

    const newPassword = nanoid(6)

    const client = await clerkClient()

    await client.users.updateUser(clerkId, {
      password: newPassword,
    })

    return NextResponse.json({
      password: newPassword,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}