"use client";

import { useState, useMemo, useEffect } from "react";
import s from "./zakat.module.css";
import { Currency } from "@/lib/definitions";
import type { MarketSnapshot } from "@/lib/getMarketData";
import { CURRENCY_SYMBOLS, Metal , Assets, Liabilities, CalcResult, CURRENCY_LABELS } from "@/lib/definitions";
import { handleGiveZakat } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD_NISAB_GRAMS   = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

const DEFAULT_ASSETS: Assets = {
  cashAndBank: 0, goldSilver: 0, investments: 0, business: 0, receivables: 0,
};

const DEFAULT_LIABILITIES: Liabilities = {
  loans: 0, bills: 0, wages: 0,
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// width/height stay as inline style — they're dynamic per-instance values,
// not design decisions. Everything else (colour, animation) is in the CSS.

function Skeleton({ width = "100%", height = "20px" }: { width?: string; height?: string }) {
  return <div className={s.skeleton} style={{ width, height }} />;
}



// ─── Input Row ────────────────────────────────────────────────────────────────

function InputRow({
  icon, label, symbol, value, onChange,
}: {
  icon: string; label: string; symbol: string;
  value: number; onChange: (v: number) => void;
}) {
  return (
    <div className={s.inputRow}>
      <div className={s.inputRowLeft}>
        <span className={`material-symbols-outlined ${s.inputRowIcon}`}>{icon}</span>
        <span className={s.inputRowLabel}>{label}</span>
      </div>
      <div className={s.inputBox}>
        <span className={s.inputSymbol}>{symbol}</span>
        <input
          type="number"
          min={0}
          placeholder="0.00"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={s.inputField}
        />
      </div>
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={s.summaryRow}>
      <span className={bold ? s.summaryLabelBold : s.summaryLabel}>{label}</span>
      <span className={bold ? s.summaryValueBold : s.summaryValue}>{value}</span>
    </div>
  );
}

// ─── Sidebar Summary ──────────────────────────────────────────────────────────
// Isolated component — renders skeletons while market/calc is null,
// then fills in with real data. The rest of the page is unaffected.

function SidebarSummary({
  calc, market, currency, symbol, fmt, onReset,
}: {
  calc:     CalcResult | null;
  market:   MarketSnapshot | null;
  currency: Currency;
  symbol:   string;
  fmt:      (n: number) => string;
  onReset:  () => void;
}) {
  const isLoading = !calc || !market;
 
  return (
    <div className={s.sidebar}>

      {/* ── Main summary card ── */}
      <div className={s.summaryCard}>
        <h3 className={s.summaryCardTitle}>Calculation Summary</h3>

        {/* Summary rows — skeleton until loaded */}
        <div className={s.summaryRows}>
          {isLoading ? (
            <>
              <Skeleton height="18px" width="100%" />
              <Skeleton height="18px" width="85%"  />
              <div className={s.summaryDivider} />
              <Skeleton height="20px" width="90%"  />
            </>
          ) : (
            <>
              <SummaryRow label="Total Assets"      value={`${symbol}${fmt(calc!.totalAssets)}`} />
              <SummaryRow label="Total Liabilities" value={`(${symbol}${fmt(calc!.totalLiabilities)})`} />
              <div className={s.summaryDivider} />
              <SummaryRow label="Net Assets" value={`${symbol}${fmt(calc!.netAssets)}`} bold />
            </>
          )}
        </div>

        {/* Zakat block — transitions from grey to white when data arrives */}
        <div className={`${s.zakatBlock} ${isLoading ? s.zakatBlockLoading : s.zakatBlockLoaded}`}>
          {isLoading ? (
            <div className={s.zakatSkeletonInner}>
              <Skeleton height="12px" width="60%" />
              <Skeleton height="44px" width="80%" />
            </div>
          ) : (
            <>
              <span className={s.zakatLabel}>Zakat Amount Due (2.5%)</span>
              <div className={s.zakatAmountRow}>
              <span className={s.zakatAmount}>
  {symbol}{'\u00A0'}{fmt(calc!.zakatDue)}
</span>
                <span className={s.zakatCurrency}>{currency}</span>
              </div>
            </>
          )}
        </div>

        {/* Action buttons — always visible, no market data dependency */}
        <div className={s.actionButtons}>
          <button className={s.btnPrimary} onClick={handleGiveZakat}>
            <span className={`material-symbols-outlined ${s.btnIconFilled}`}>volunteer_activism</span>
            Give Zakat
          </button>
          <button onClick={onReset} className={s.btnSecondary}>
            <span className={`material-symbols-outlined ${s.btnIconOutlined}`}>restart_alt</span>
            Reset Calculator
          </button>
        </div>

        <p className={s.disclaimer}>
          Values are calculated based on current market rates.
          Please consult a financial advisor for complex business cases.
        </p>
      </div>

      {/* ── Sharia compliant — static, always visible ── */}
      <div className={s.shariaCard}>
        <span className={`material-symbols-outlined ${s.shariaIcon}`}>verified_user</span>
        <div>
          <h4 className={s.shariaTitle}>Sharia Compliant</h4>
          <p className={s.shariaText}>Audited calculation logic following standard AAOIFI guidelines.</p>
        </div>
      </div>

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ZakatCalculator() {
  const [market, setMarket]           = useState<MarketSnapshot | null>(null);
  const [currency, setCurrency]       = useState<Currency>("USD");
  const [basis, setBasis]             = useState<Metal>("gold");
  const [assets, setAssets]           = useState<Assets>(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState<Liabilities>(DEFAULT_LIABILITIES);

  // Fetch via API route — never call Redis from the client
  useEffect(() => {
    fetch("/api/metal-data")
      .then((res) => res.json())
      .then((data) => { if (data && !data.error) setMarket(data); })
      .catch((err) => console.error("Failed to load market data:", err));
  }, []);

  // Calculation — returns null until market loads; form still renders immediately
  const calc = useMemo<CalcResult | null>(() => {
    if (!market) return null;
    const { rates, exchangeRates } = market;
    const fxRate        = exchangeRates[currency] > 0 ? 1 / exchangeRates[currency] : 1;
    const goldPerGram   = rates.goldPricePerGram   * fxRate;
    const silverPerGram = rates.silverPricePerGram * fxRate;
    const nisabValue    = basis === "gold"
      ? GOLD_NISAB_GRAMS   * goldPerGram
      : SILVER_NISAB_GRAMS * silverPerGram;
    const totalAssets      = assets.cashAndBank + assets.goldSilver + assets.investments + assets.business + assets.receivables;
    const totalLiabilities = liabilities.loans + liabilities.bills + liabilities.wages;
    const netAssets        = Math.max(0, totalAssets - totalLiabilities);
    const isNisabMet       = netAssets >= nisabValue;
    const zakatDue         = isNisabMet ? netAssets * 0.025 : 0;
    return { totalAssets, totalLiabilities, netAssets, nisabValue, isNisabMet, zakatDue, goldPerGram, silverPerGram };
  }, [market, currency, basis, assets, liabilities]);

  const symbol = CURRENCY_SYMBOLS[currency];
  const fmt    = (n: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const setAsset     = (k: keyof Assets)      => (v: number) => setAssets((p)       => ({ ...p, [k]: v }));
  const setLiability = (k: keyof Liabilities) => (v: number) => setLiabilities((p) => ({ ...p, [k]: v }));

  const handleReset = () => {
    setAssets(DEFAULT_ASSETS);
    setLiabilities(DEFAULT_LIABILITIES);
    setCurrency("USD");
    setBasis("gold");
  };

  // No top-level loading guard — page renders immediately
  return (
    <main id="calculator" className={s.calculator}>

      {/* ══ LEFT COLUMN — always interactive ══ */}
      <div className={s.leftColumn}>

        {/* 1. Setup */}
        <section className={s.section}>
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>1. Setup</h2>
            <span className={s.setupTimestamp}>
              {market ? (
                <>
                  <span className={`material-symbols-outlined ${s.setupTimestampIcon}`}>sync</span>
                  Updated Last: {new Date(market.metalTimestamp).toLocaleTimeString()}
                </>
              ) : (
                <Skeleton width="180px" height="14px" />
              )}
            </span>
          </div>

          <div className={s.setupGrid}>

            {/* Currency */}
            <div>
              <label className={s.controlLabel}>Currency</label>
              <div className={s.selectWrapper}>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className={s.select}
                >
                  {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
                    <option key={c} value={c} style={{ background: "#1c1b1b" }}>
                      {CURRENCY_LABELS[c]}
                    </option>
                  ))}
                </select>
                <span className={s.selectArrow}>▾</span>
              </div>
            </div>

            {/* Basis/Metal toggle */}
            <div>
              <label className={s.controlLabel}>Calculation Basis</label>
              <div className={s.basisToggle}>
                {(["gold", "silver"] as Metal[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasis(b)}
                    className={`${s.basisBtn} ${basis === b ? s.basisBtnActive : ""}`}
                  >
                    {b === "gold" ? "Gold Basis" : "Silver Basis"}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Nisab — skeleton until calc is ready */}
            <div>
              <label className={s.controlLabel}>Live Nisab Rate</label>
              <div className={s.nisabDisplay}>
                {calc ? (
                  <>
                    <span className={s.nisabValue}>{symbol}{fmt(calc.nisabValue)}</span>
                    <span className={s.nisabBadge}>{basis === "gold" ? "Gold" : "Silver"}</span>
                  </>
                ) : (
                  <Skeleton width="120px" height="16px" />
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 2. Assets */}
        <section className={s.section}>
          <h2 className={`${s.sectionTitle} ${s.sectionTitleSpaced}`}>2. Assets</h2>
          <InputRow icon="savings"           label="Cash on Hand & Bank Accounts"     symbol={symbol} value={assets.cashAndBank}  onChange={setAsset("cashAndBank")} />
          <InputRow icon="monetization_on"   label="Gold & Silver (Market Value)"     symbol={symbol} value={assets.goldSilver}   onChange={setAsset("goldSilver")} />
          <InputRow icon="trending_up"       label="Investments, Stocks & Shares"     symbol={symbol} value={assets.investments}  onChange={setAsset("investments")} />
          <InputRow icon="business_center"   label="Business Assets (Stock for Sale)" symbol={symbol} value={assets.business}     onChange={setAsset("business")} />
          <InputRow icon="real_estate_agent" label="Money Owed to You (Receivables)"  symbol={symbol} value={assets.receivables}  onChange={setAsset("receivables")} />
        </section>

        {/* 3. Liabilities */}
        <section className={s.section}>
          <h2 className={`${s.sectionTitle} ${s.sectionTitleSpaced}`}>3. Liabilities & Debts</h2>
          <InputRow icon="receipt_long" label="Borrowed Money / Personal Loans"     symbol={symbol} value={liabilities.loans} onChange={setLiability("loans")} />
          <InputRow icon="payments"     label="Outstanding Bills & Rent"            symbol={symbol} value={liabilities.bills} onChange={setLiability("bills")} />
          <InputRow icon="work_history" label="Unpaid Wages / Employee Obligations" symbol={symbol} value={liabilities.wages} onChange={setLiability("wages")} />
        </section>

      </div>

      {/* ══ RIGHT COLUMN — SidebarSummary owns its loading state ══ */}
      <aside>
        <SidebarSummary
          calc={calc}
          market={market}
          currency={currency}
          symbol={symbol}
          fmt={fmt}
          onReset={handleReset}
        />
      </aside>

    </main>
  );
}