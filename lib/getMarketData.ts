import { redis } from "@/lib/redis";

// import type { Currency } from "./zakat";

export interface NisabRates {
  goldPricePerGram: number; // in USD
  silverPricePerGram: number; // in USD
  lastUpdated: string;
}


export interface MetalsApiResponse {
  status: string;
  currency: string;
  unit: string;
  metals: {
    gold: number;
    silver: number;
    [key: string]: number;
  };
  currencies: {
    AED: number;
    GBP: number;
    PKR: number;
    EUR: number;
    SAR: number;
    USD: number;
    JPY: number;

    [key: string]: number;
  };
  timestamps: {
    metal: string;
    currency: string;
  };
}

export type Currency = "USD" | "PKR" | "GBP" | "EUR" | "JPY" | "SAR" | "AED";


export interface MarketSnapshot {
  rates: NisabRates;
  exchangeRates: Record<Currency, number>;
  metalTimestamp: string;
  currencyTimestamp: string;
}

// Moved in from file_1.ts — transforms raw API shape into the MarketSnapshot
// your app actually consumes. Kept as a named export so other modules can
// reuse it if needed (e.g. the QStash cron handler).
export function parseMarketData(data: MetalsApiResponse): MarketSnapshot {
  return {
    rates: {
      goldPricePerGram: data.metals.gold,
      silverPricePerGram: data.metals.silver,
      // lastUpdated reflects the metal price timestamp from the API.
      // When served from Redis cache this will be the timestamp of when
      // the data was originally fetched — not the current time. That is
      // correct behaviour: it tells the UI how fresh the prices actually are.
      lastUpdated: data.timestamps.metal,
    },
    exchangeRates: {
      USD: data.currencies.USD,
      GBP: data.currencies.GBP,
      PKR: data.currencies.PKR,
      EUR: data.currencies.EUR,
      SAR: data.currencies.SAR,
      AED: data.currencies.AED,
      JPY: data.currencies.JPY,
    },
    metalTimestamp: data.timestamps.metal,
    currencyTimestamp: data.timestamps.currency,
  };
}

export async function getMarketData(): Promise<MarketSnapshot | null> {
  try {
    // 1. Check Redis cache
    const cachedData = await redis.get<MetalsApiResponse>("market-data");

    // 2. Cache hit — parse and return immediately, no API call needed
    if (cachedData) {
      console.log("CACHE HIT");
      return parseMarketData(cachedData);
    }

    console.log("CACHE MISS");

    // 3. Fetch from external API
    const response = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${process.env.METALS_API_KEY}&currency=USD&unit=g`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: MetalsApiResponse = await response.json();

    // 4. Store raw API response in Redis (8hr TTL to stay ahead of QStash cron)
    // Raw data is stored — not the parsed snapshot — so the cache stays
    // generic and parseMarketData can evolve without invalidating cached entries.
    await redis.set("market-data", data, {
      ex: 60 * 60 * 8,
    });

    // 5. Parse and return fresh data
    return parseMarketData(data);

  } catch (error: unknown) {
    if (isErrnoException(error)) {
      if (error.code === "EAI_AGAIN") {
        console.error("DNS/Network Error: Could not reach Upstash or the API. Check your connection.");
      } else {
        console.error("Failed to fetch market data:", error.message);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }

    // Return null so the UI can handle the empty state gracefully
    return null;
  }
}

function isErrnoException(error: unknown): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}