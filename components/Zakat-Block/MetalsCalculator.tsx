"use client";
import { useEffect, useState } from "react";
import s from "./zakat.module.css";
import type { Metal } from "@/lib/definitions";
import { PURITY, UNIT_LABELS, UNIT_ORDER, WeightUnit, metalValue, zakatWeight } from "@/lib/metalCalc";

type Row = { weight: string; unit: WeightUnit; purity: number };

type Props = {
  goldPerGram: number;
  silverPerGram: number;
  symbol: string;
  onChange: (total: number) => void; // must be stable (useCallback)
};

const METALS: Metal[] = ["gold", "silver"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const fmtW = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(n);

const UNIT_SHORT: Record<WeightUnit, string> = { gram: "g", oz: "oz", tola: "tola", kg: "kg" };

export default function MetalsCalculator({ goldPerGram, silverPerGram, symbol, onChange }: Props) {
  const [rows, setRows] = useState<Record<Metal, Row>>({
    gold:   { weight: "", unit: "gram", purity: PURITY.gold[0].value },
    silver: { weight: "", unit: "gram", purity: PURITY.silver[0].value },
  });

  const price: Record<Metal, number> = { gold: goldPerGram, silver: silverPerGram };

  const value = (m: Metal) =>
    metalValue(parseFloat(rows[m].weight) || 0, rows[m].unit, rows[m].purity, price[m]);

  const total = value("gold") + value("silver");

  const zakat: Record<Metal, { inUnit: number; grams: number }> = {
  gold:   zakatWeight(parseFloat(rows.gold.weight)   || 0, rows.gold.unit),
  silver: zakatWeight(parseFloat(rows.silver.weight) || 0, rows.silver.unit),
};

  useEffect(() => { onChange(total); }, [total, onChange]);

  const update = (m: Metal, patch: Partial<Row>) =>
    setRows((r) => ({ ...r, [m]: { ...r[m], ...patch } }));

  return (
    <div className={s.metalsBlock}>
      <div className={s.inputRowLeft}>
        <span className={`material-symbols-outlined ${s.inputRowIcon}`}>monetization_on</span>
        <span className={s.inputRowLabel}>Gold & Silver (By Weight)</span>
      </div>

      <div className={s.metalsList}>
        {METALS.map((m) => (
          <div key={m} className={s.metalsCard}>
            <div className={s.metalsCardTop}>
              <span className={`${s.metalsTag} ${m === "gold" ? s.metalsTagGold : s.metalsTagSilver}`}>
                {m}
              </span>
             <div className={s.metalsResult}>
            <span className={s.metalsValue}>{symbol}{fmt(value(m))}</span>
              <span className={s.metalsZakat}>
                Zakat (2.5%): {fmtW(zakat[m].inUnit)} {UNIT_SHORT[rows[m].unit]}
                {rows[m].unit !== "gram" && ` (${fmtW(zakat[m].grams)} g)`}
              </span>
            </div>
            </div>

            <div className={s.metalsFields}>
              <label className={`${s.metalsField} ${s.metalsFieldWeight}`}>
                <span className={s.metalsFieldLabel}>Weight</span>
                <input
                  type="number" inputMode="decimal" min={0} step="any" placeholder="0"
                  value={rows[m].weight}
                  onChange={(e) => update(m, { weight: e.target.value })}
                  className={s.metalsInput}
                />
              </label>

              <label className={s.metalsField}>
                <span className={s.metalsFieldLabel}>Unit</span>
                <span className={s.metalsSelectWrap}>
                  <select
                    value={rows[m].unit}
                    onChange={(e) => update(m, { unit: e.target.value as WeightUnit })}
                    className={s.metalsSelect}
                  >
                    {UNIT_ORDER.map((u) => (
                      <option key={u} value={u} style={{ background: "#1c1b1b" }}>{UNIT_LABELS[u]}</option>
                    ))}
                  </select>
                </span>
              </label>

              <label className={s.metalsField}>
                <span className={s.metalsFieldLabel}>Purity</span>
                <span className={s.metalsSelectWrap}>
                  <select
                    value={rows[m].purity}
                    onChange={(e) => update(m, { purity: parseFloat(e.target.value) })}
                    className={s.metalsSelect}
                  >
                    {PURITY[m].map((p) => (
                      <option key={p.label} value={p.value} style={{ background: "#1c1b1b" }}>{p.label}</option>
                    ))}
                  </select>
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className={s.metalsTotal}>
        <span className={s.metalsTotalLabel}>Total Metals Value</span>
        <span className={s.metalsTotalValue}>{symbol}{fmt(total)}</span>
      </div>
    </div>
  );
}