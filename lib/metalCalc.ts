import type { Currency, Metal } from "./definitions";

// ─── Units ───────────────────────────────────────────────

export type WeightUnit = "oz" | "gram" | "tola" | "kg";

export const GRAMS_PER_UNIT: Record<WeightUnit, number> = {
  oz: 31.1034768, // troy ounce
  gram: 1,
  tola: 11.6638038,
  kg: 1000,
};

// display order, so the page table and the dropdown always match
export const UNIT_ORDER: WeightUnit[] = ["oz", "gram", "tola", "kg"];

export const UNIT_LABELS: Record<WeightUnit, string> = {
  oz: "Ounce (oz)",
  gram: "Gram (g)",
  tola: "Tola",
  kg: "Kilogram (kg)",
};

// ─── Purity (fraction of pure metal) ─────────────────────

export const PURITY: Record<Metal, { label: string; value: number }[]> = {
  gold: [
    { label: "24K", value: 1 },
    { label: "22K", value: 22 / 24 },
    { label: "21K", value: 21 / 24 },
    { label: "18K", value: 18 / 24 },
  ],
  silver: [
    { label: "Pure (999)", value: 1 },
    { label: "Sterling (925)", value: 0.925 },
    { label: "900", value: 0.9 },
  ],
};

// ─── Helpers ─────────────────────────────────────────────

/** Price of ONE unit (1 tola, 1 oz, ...) from a per-gram price */
export const pricePerUnit = (pricePerGram: number, unit: WeightUnit) =>
  pricePerGram * GRAMS_PER_UNIT[unit];

/** API `exchangeRates[X]` = USD per 1 unit of X, so divide to go USD -> X */
export const usdToCurrency = (
  usd: number,
  currency: Currency,
  exchangeRates: Record<string, number>
) => {
  const raw = exchangeRates[currency];
  return raw > 0 ? usd / raw : usd;
};

/** Value of a weight of metal in the same currency as pricePerGram */
export const metalValue = (
  weight: number,
  unit: WeightUnit,
  purity: number,
  pricePerGram: number
) => weight * GRAMS_PER_UNIT[unit] * purity * pricePerGram;