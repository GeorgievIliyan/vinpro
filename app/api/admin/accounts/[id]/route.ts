import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { isDev } from '@/lib/utils'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get('x-api-token')

  if (!isDev && (!token || token == "")) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 401 }
    )
  }
  const db = await getDb()

  await db.collection('accounts').deleteOne({
    _id: new ObjectId(params.id),
  })

  return NextResponse.json({ success: true })
}