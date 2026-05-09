import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { isDev } from '@/lib/utils'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.headers.get('x-api-token')

  if (!isDev && (!token || token == "")) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 401 }
    )
  }
  const db = await getDb()
  const { id } = await params

  await db.collection('accounts').deleteOne({
    _id: new ObjectId(id),
  })

  return NextResponse.json({ success: true })
}