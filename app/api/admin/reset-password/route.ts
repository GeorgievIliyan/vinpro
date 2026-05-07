import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { nanoid } from 'nanoid'
import { isDev } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-api-token')

  if (!isDev && (!token || token == "")) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 401 }
    )
  }

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