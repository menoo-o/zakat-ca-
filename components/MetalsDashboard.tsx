"use client";

import { useMemo, useState } from "react";
import type { MarketSnapshot } from "@/lib/getMarketData";


type Metal = "gold" | "silver";
type Currency = "USD" | "GBP" | "SAR" | "AED" | "EUR" | "PKR";

interface Props {
  market: MarketSnapshot;
  currency: Currency;
}

const TROY_OZ_PER_GRAM = 0.0321507;
const DWT_PER_GRAM = 0.0643015;
const TOLA_PER_GRAM = 0.0857333;
const GRAMS_PER_KG = 1000;

const GOLD_PURITY: Record<string, number> = {
  "24K": 1,
  "22K": 22 / 24,
  "18K": 18 / 24,
};

interface RateRow {
  label: string;
  multiplier: number;
}

const GOLD_ROWS: RateRow[] = [
  { label: "1 Gram 24K", multiplier: 1 * GOLD_PURITY["24K"] },
  { label: "1 Gram 22K", multiplier: 1 * GOLD_PURITY["22K"] },
  { label: "1 Gram 18K", multiplier: 1 * GOLD_PURITY["18K"] },
  { label: "1 Tola", multiplier: 1 / TOLA_PER_GRAM },
  { label: "Gold / oz", multiplier: 1 / TROY_OZ_PER_GRAM },
];

const SILVER_ROWS: RateRow[] = [
  { label: "1 Gram", multiplier: 1 },
  { label: "1 dwt", multiplier: 1 / DWT_PER_GRAM },
  { label: "1 Tola", multiplier: 1 / TOLA_PER_GRAM },
  { label: "1 KG", multiplier: GRAMS_PER_KG },
  { label: "Silver / oz", multiplier: 1 / TROY_OZ_PER_GRAM },
];

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$", GBP: "£", SAR: "﷼", AED: "د.إ", EUR: "€", PKR: "₨",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtWithSymbol = (n: number, currency: Currency) =>
  `${CURRENCY_SYMBOLS[currency]}${fmt(n)}`;

export default function MetalsDashboard({ market, currency }: Props) {
  const [activeMetal, setActiveMetal] = useState<Metal>("gold");

  const { goldPerGram, silverPerGram, goldPerOz, silverPerOz } = useMemo(() => {
    const { rates, exchangeRates } = market;
    const fxRate = exchangeRates[currency] > 0 ? 1 / exchangeRates[currency] : 1;
    const gpg = rates.goldPricePerGram * fxRate;
    const spg = rates.silverPricePerGram * fxRate;
    return {
      goldPerGram: gpg,
      silverPerGram: spg,
      goldPerOz: gpg / TROY_OZ_PER_GRAM,
      silverPerOz: spg / TROY_OZ_PER_GRAM,
    };
  }, [market, currency]);

  const tableRows = useMemo(() => {
    const pricePerGram = activeMetal === "gold" ? goldPerGram : silverPerGram;
    const rows = activeMetal === "gold" ? GOLD_ROWS : SILVER_ROWS;
    return rows.map(({ label, multiplier }) => ({
      label,
      value: pricePerGram * multiplier,
    }));
  }, [activeMetal, goldPerGram, silverPerGram]);

  const sym = CURRENCY_SYMBOLS[currency];
  const timestamp = new Date(market.metalTimestamp).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: "UTC", timeZoneName: "short",
  });

  return (
    <section id="metals-dashboard" className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <div className="status-indicator-container">
            <span className="status-dot" />
            <span className="status-text">Live Market Data</span>
          </div>
          <h2 className="dashboard-title">Precious Metals Dashboard</h2>
          <p className="update-timestamp">Last updated: FIX THIS -timeSTAMP</p>
        </div>
      </div>

      <div className="price-cards-grid">
        <div 
          className={`price-card ${activeMetal === "gold" ? "active" : ""}`}
          onClick={() => setActiveMetal("gold")}
        >
          <div className="card-info">
            <div className="metal-icon">🥇</div>
            <div>
              <p className="metal-label">Gold / oz</p>
              <p className="currency-code">XAU / {currency}</p>
            </div>
          </div>
          <div className="card-values">
            <p className="price-main">{fmtWithSymbol(goldPerOz, currency)}</p>
            <p className="price-sub">{sym}{fmt(goldPerGram)} / g</p>
          </div>
        </div>

        <div 
          className={`price-card ${activeMetal === "silver" ? "active" : ""}`}
          onClick={() => setActiveMetal("silver")}
        >
          <div className="card-info">
            <div className="metal-icon">🥈</div>
            <div>
              <p className="metal-label">Silver / oz</p>
              <p className="currency-code">XAG / {currency}</p>
            </div>
          </div>
          <div className="card-values">
            <p className="price-main">{fmtWithSymbol(silverPerOz, currency)}</p>
            <p className="price-sub">{sym}{fmt(silverPerGram)} / g</p>
          </div>
        </div>
      </div>

      <div className="rates-table-container">
        <div className="table-header">
          <div className="metal-toggle-group">
            {(["gold", "silver"] as Metal[]).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetal(m)}
                className={`toggle-button ${activeMetal === m ? "active" : ""}`}
              >
                {m}
                {activeMetal === m && <span className="toggle-arrow">▾</span>}
              </button>
            ))}
          </div>
          <div className="column-label">
            <span>Rate / {currency}</span>
          </div>
        </div>

        <div className="table-body">
          {tableRows.map((row) => (
            <div key={row.label} className="table-row">
              <span className="row-label">{row.label}</span>
              <span className="row-value">{fmtWithSymbol(row.value, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}