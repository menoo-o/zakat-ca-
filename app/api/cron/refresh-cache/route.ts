import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";


// app/api/cron/refresh-cache/route.ts
async function handler() {
  try {
    // Fetch latest market data from the external API 
    const apiKey = process.env.METALS_API_KEY;

    // Safety check: Make sure your environment variable is loaded properly
    if (!apiKey) {
      throw new Error("METALS_API_KEY is not defined in environment variables.");
    }

    const response = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=g`
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();

    // 8hr TTL — QStash fires every 8hrs, cache always warm
    await redis.set("market-data", data, { ex: 60 * 60 * 8 });

    console.log("QStash cron: refreshed at", new Date().toISOString());
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("QStash cron failed:", error);
    // Returning 500 tells QStash to RETRY automatically — built in!
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}

// This wrapper does all the signature verification for you
export const POST = verifySignatureAppRouter(handler);

