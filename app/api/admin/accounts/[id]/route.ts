import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { validateApiToken } from '@/lib/apiAuth'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiToken(req)
  if (authError) return authError
  const db = await getDb()
  const { id } = await params

  await db.collection('accounts').deleteOne({
    _id: new ObjectId(id),
  })

  return NextResponse.json({ success: true })
}