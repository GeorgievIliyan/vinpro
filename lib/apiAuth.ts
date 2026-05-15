import { NextRequest, NextResponse } from "next/server"
import { isDev } from "./utils"

export function validateApiToken(req: Request | NextRequest) {
  if (isDev) {
    return null
  }

  const token = req.headers.get("x-api-token")

  if (!token || token.trim() === "" || token == null) {
    return NextResponse.json(
      { error: "Missing or invalid x-api-token header" },
      { status: 401 }
    )
  }

  return null
}
