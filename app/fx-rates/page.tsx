"use client";

import { useState, useEffect, useMemo } from "react";
import s from "./fxRates.module.css";
import type { MarketSnapshot } from "@/lib/getMarketData";

// ─── Types ────────────────────────────────────────────────────────────────────

type Metal   = "gold" | "silver";
type Currency = "USD" | "GBP" | "EUR" | "SAR" | "AED" | "PKR" | "JPY";

// ─── Constants ────────────────────────────────────────────────────────────────

const TROY_OZ_TO_GRAM   = 31.1035;
const GRAM_TO_TOLA      = 0.08573;
const GRAM_TO_KG        = 0.001;

const CURRENCY_LABELS: Record<Currency, string> = {
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
  SAR: "Saudi Riyal",
  AED: "UAE Dirham",
  PKR: "Pakistani Rupee",
  JPY: "Japanese Yen",
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  SAR: "﷼",
  AED: "د.إ",
  PKR: "₨",
  JPY: "¥",
};

const FOREX_PAIRS: {
  base: Currency;
  quote: Currency;
  label: string;
  flag: string;
}[] = [
  { base: "EUR", quote: "USD", label: "EURO",    flag: "EU" },
  { base: "GBP", quote: "USD", label: "STERLING", flag: "GB" },
  { base: "USD", quote: "JPY", label: "YEN",      flag: "JP" },
  { base: "USD", quote: "PKR", label: "RUPEE",    flag: "PK" },
  { base: "USD", quote: "SAR", label: "RIYAL",    flag: "SA" },
  { base: "USD", quote: "AED", label: "DIRHAM",   flag: "AE" },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ width = "100%", height = "20px" }: { width?: string; height?: string }) {
  return <div className={s.skeleton} style={{ width, height }} />;
}

// ─── Metal Header Card ────────────────────────────────────────────────────────

function MetalCard({
  metal,
  pricePerGram,
  symbol,
  timestamp,
  isLoading,
}: {
  metal: "gold" | "silver";
  pricePerGram: number;
  symbol: string;
  timestamp: string;
  isLoading: boolean;
}) {
  const fmt = (n: number, decimals = 2) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n);

  const pricePerOz = pricePerGram * TROY_OZ_TO_GRAM;
  const pricePerTola = pricePerGram / GRAM_TO_TOLA;

  return (
    <div className={s.metalCard}>
      <div className={s.metalCardTop}>
        <span className={s.metalPurity}>
          {metal === "gold" ? "AU 999.9" : "AG 999.0"}
        </span>
      </div>
      <div className={s.metalPair}>
        {metal === "gold" ? "XAU" : "XAG"} / USD
      </div>

      <div className={s.metalPrice}>
        {isLoading ? (
          <Skeleton width="200px" height="44px" />
        ) : (
          <>
            <span className={s.metalPriceValue}>
              {symbol}{fmt(pricePerOz)}
            </span>
            <span className={s.metalPriceUnit}>/oz</span>
          </>
        )}
      </div>

      <div className={s.metalMeta}>
        <div className={s.metalMetaItem}>
          <span className={s.metalMetaLabel}>PER GRAM</span>
          {isLoading ? (
            <Skeleton width="60px" height="14px" />
          ) : (
            <span className={s.metalMetaValue}>{symbol}{fmt(pricePerGram)}</span>
          )}
        </div>
        <div className={s.metalMetaItem}>
          <span className={s.metalMetaLabel}>PER TOLA</span>
          {isLoading ? (
            <Skeleton width="60px" height="14px" />
          ) : (
            <span className={s.metalMetaValue}>{symbol}{fmt(pricePerTola)}</span>
          )}
        </div>
        <div className={s.metalMetaItem}>
          <span className={s.metalMetaLabel}>LAST UPDATED</span>
          {isLoading ? (
            <Skeleton width="60px" height="14px" />
          ) : (
            <span className={s.metalMetaValue}>
              {new Date(timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Forex Pair Row ───────────────────────────────────────────────────────────

function ForexRow({
  pair,
  exchangeRates,
  isLoading,
}: {
  pair: (typeof FOREX_PAIRS)[number];
  exchangeRates: Record<Currency, number> | null;
  isLoading: boolean;
}) {
  const rate = useMemo(() => {
    if (!exchangeRates) return null;
    // All rates are stored as USD per unit (inverse of exchange rate from API)
    // API stores how many foreign units = 1 USD
    // e.g. exchangeRates.EUR = 0.92 means 1 USD = 0.92 EUR
    // So EUR/USD = 1 / exchangeRates.EUR
    if (pair.base === "USD") {
      // USD/JPY, USD/PKR, etc. — direct rate
      return exchangeRates[pair.quote];
    } else {
      // EUR/USD, GBP/USD — inverse
      return 1 / exchangeRates[pair.base];
    }
  }, [exchangeRates, pair]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(n);

  // Simulated 24h change (static placeholder — real impl would compare cached snapshots)
  const PLACEHOLDER_CHANGES: Record<string, number> = {
    "EUR/USD": 0.12,
    "GBP/USD": -0.05,
    "USD/JPY": 0.34,
    "USD/PKR": 0.0,
    "USD/SAR": 0.0,
    "USD/AED": 0.0,
  };
  const pairKey = `${pair.base}/${pair.quote}`;
  const change = PLACEHOLDER_CHANGES[pairKey] ?? 0;

  return (
    <div className={s.forexRow}>
      <div className={s.forexLeft}>
        <div className={s.forexFlag}>
          <span className={s.forexFlagCode}>{pair.flag}</span>
        </div>
        <div className={s.forexInfo}>
          <span className={s.forexPairLabel}>
            {pair.base} / {pair.quote}
          </span>
          <span className={s.forexPairSub}>{pair.label}</span>
        </div>
      </div>
      <div className={s.forexRight}>
        {isLoading ? (
          <Skeleton width="70px" height="16px" />
        ) : (
          <>
            <span className={s.forexRate}>{rate !== null ? fmt(rate) : "—"}</span>
            {change !== 0 && (
              <span
                className={`${s.forexChange} ${
                  change > 0 ? s.forexChangePos : s.forexChangeNeg
                }`}
              >
                {change > 0 ? "+" : ""}{change.toFixed(3)}%
              </span>
            )}
            {change === 0 && (
              <span className={s.forexChangeFlat}>0.00%</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Live Unit Comparison ─────────────────────────────────────────────────────

function UnitComparison({
  market,
  isLoading,
}: {
  market: MarketSnapshot | null;
  isLoading: boolean;
}) {
  const [metal, setMetal]       = useState<Metal>("gold");
  const [currency, setCurrency] = useState<Currency>("USD");

  const pricePerGram = useMemo(() => {
    if (!market) return 0;
    const { rates, exchangeRates } = market;
    const base = metal === "gold" ? rates.goldPricePerGram : rates.silverPricePerGram;
    const fxRate = exchangeRates[currency] > 0 ? 1 / exchangeRates[currency] : 1;
    // USD is already the base; for others multiply
    return currency === "USD" ? base : base * fxRate;
  }, [market, metal, currency]);

  const symbol = CURRENCY_SYMBOLS[currency];

  const fmt = (n: number, d = 2) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(n);

  const units = [
    { label: "Ounce (oz)",    value: pricePerGram * TROY_OZ_TO_GRAM },
    { label: "Gram (g)",      value: pricePerGram },
    { label: "Tola",          value: pricePerGram / GRAM_TO_TOLA },
    { label: "Kilogram (kg)", value: pricePerGram / GRAM_TO_KG },
  ];

  return (
    <div className={s.unitCard}>
      {/* Header row */}
      <div className={s.unitHeader}>
        <div className={s.unitTitleRow}>
          <span className={`material-symbols-outlined ${s.unitIcon}`}>bar_chart</span>
          <h2 className={s.unitTitle}>Live Unit Comparison</h2>
        </div>

        <div className={s.unitControls}>
          {/* Metal toggle */}
          <div className={s.unitToggle}>
            {(["gold", "silver"] as Metal[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetal(m)}
                className={`${s.unitToggleBtn} ${metal === m ? s.unitToggleBtnActive : ""}`}
              >
                {m === "gold" ? "Gold (24K)" : "Silver"}
              </button>
            ))}
          </div>

          {/* Currency select */}
          <div className={s.unitSelectWrapper}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={s.unitSelect}
            >
              {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
                <option key={c} value={c} style={{ background: "#1c1b1b" }}>
                  {c}
                </option>
              ))}
            </select>
            <span className={s.unitSelectArrow}>▾</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={s.unitTable}>
        <div className={s.unitTableHead}>
          <span>UNIT</span>
          <span>PRICE / UNIT</span>
        </div>
        {units.map((row) => (
          <div className={s.unitTableRow} key={row.label}>
            <span className={s.unitTableLabel}>{row.label}</span>
            <span className={s.unitTableValue}>
              {isLoading ? (
                <Skeleton width="100px" height="16px" />
              ) : (
                `${symbol}${fmt(row.value)}`
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FxRates() {
  const [market, setMarket] = useState<MarketSnapshot | null>(null);
  const isLoading = !market;

  useEffect(() => {
    fetch("/api/metal-data")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setMarket(data);
      })
      .catch((err) => console.error("Failed to load market data:", err));
  }, []);

  const goldPerGram   = market?.rates.goldPricePerGram   ?? 0;
  const silverPerGram = market?.rates.silverPricePerGram ?? 0;
  const timestamp     = market?.metalTimestamp           ?? "";

  return (
    <main className={s.page}>

      {/* ── Top: two metal header cards ── */}
      <div className={s.metalGrid}>
        <MetalCard
          metal="gold"
          pricePerGram={goldPerGram}
          symbol="$"
          timestamp={timestamp}
          isLoading={isLoading}
        />
        <MetalCard
          metal="silver"
          pricePerGram={silverPerGram}
          symbol="$"
          timestamp={timestamp}
          isLoading={isLoading}
        />
      </div>

      {/* ── Bottom: unit comparison + forex pairs ── */}
      <div className={s.bottomGrid}>

        {/* Left: Unit Comparison */}
        <UnitComparison market={market} isLoading={isLoading} />

        {/* Right: Forex Core Pairs */}
        <div className={s.forexCard}>
          <span className={s.forexCardTitle}>FOREX CORE PAIRS</span>
          <div className={s.forexList}>
            {FOREX_PAIRS.map((pair) => (
              <ForexRow
                key={`${pair.base}/${pair.quote}`}
                pair={pair}
                exchangeRates={
                  market
                    ? (market.exchangeRates as unknown as Record<Currency, number>)
                    : null
                }
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}