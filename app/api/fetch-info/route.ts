import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const vin = body.vin;

  try {
    const response = await fetch(`https://db.vin/api/v1/vin/${vin}`);
    const data = await response.json();

    return Response.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}