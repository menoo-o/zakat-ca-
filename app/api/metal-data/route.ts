

// app/api/metal-data/route.ts
import { NextResponse } from "next/server";
import { getMarketData } from "@/lib/getMarketData";

export async function GET() {
  const data = await getMarketData(); // ✅ server-side, env vars available
  if (!data) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
  return NextResponse.json(data);
}