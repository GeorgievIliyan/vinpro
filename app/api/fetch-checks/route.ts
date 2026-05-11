import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { validateApiToken } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const authError = validateApiToken(req)
  if (authError) return authError

  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const db = await getDb();

  const checks = await db
    .collection("checks")
    .find({ clerkId: userId })
    .toArray();

  return NextResponse.json(checks);
}