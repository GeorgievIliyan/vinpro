import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { isDev } from "@/lib/utils";

export async function GET(req: NextRequest) {

  const token = req.headers.get('x-api-token')

  if (!isDev && (!token || token == "")) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 401 }
    )
  }

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