import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const db = await getDb()

  const accounts = await db.collection('accounts').find({}).toArray()

  return NextResponse.json(accounts)
}