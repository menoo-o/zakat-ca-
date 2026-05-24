
export type Currency = "USD" | "GBP" | "JPY" | "SAR" | "AED" | "EUR" | "PKR";

export const CURRENCY_LABELS: Record<Currency, string> = {
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
  SAR: "Saudi Riyal",
  AED: "UAE Dirham",
  PKR: "Pakistani Rupee",
  JPY: "Japanese Yen",
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  SAR: "﷼",
  AED: "د.إ",
  PKR: "Rs",
  JPY: "¥",
};


export type Metal = "gold" | "silver";










// Fx-Rates Page: app/fx-rates/page.tsx
export const FOREX_PAIRS: {
  base: Currency;
  quote: Currency;
  label: string;
  flag: string;
}[] = [
  { base: "USD", quote: "EUR", label: "EURO",    flag: "EU" },
  { base: "USD", quote: "GBP", label: "STERLING", flag: "GB" },
  { base: "USD", quote: "JPY", label: "YEN",      flag: "JP" },
  { base: "USD", quote: "PKR", label: "RUPEE",    flag: "PK" },
  { base: "USD", quote: "SAR", label: "RIYAL",    flag: "SA" },
  { base: "USD", quote: "AED", label: "DIRHAM",   flag: "AE" },
];



//zake cal page

export interface Assets {
  cashAndBank: number;
  goldSilver:  number;
  investments: number;
  business:    number;
  receivables: number;
}

export interface Liabilities {
  loans: number;
  bills: number;
  wages: number;
}

export interface CalcResult {
  totalAssets:      number;
  totalLiabilities: number;
  netAssets:        number;
  nisabValue:       number;
  isNisabMet:       boolean;
  zakatDue:         number;
  goldPerGram:      number;
  silverPerGram:    number;
}
