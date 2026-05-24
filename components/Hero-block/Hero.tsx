import Link from "next/link";
import s from "./hero.module.css";

export default function HeroSection() {
  return (
    <main className={s.page}>

      <div className={s.badge}>
        <span className={s.liveDot} />
        Live Metal Prices
      </div>

      <h1 className={s.heading}>
        Calculate Your<br />
        <span className={s.headingAccent}>Zakat</span>
      </h1>

      <p className={s.sub}>
        Live gold &amp; silver prices. Sharia-compliant
        calculation following AAOIFI guidelines.
      </p>

      <div className={s.ctas}>
        <Link href="/zakat-cal" className={s.ctaPrimary}>
          <span className="material-symbols-outlined">calculate</span>
          Zakat Calculator
        </Link>
        <Link href="/fx-rates" className={s.ctaSecondary}>
          <span className="material-symbols-outlined">currency_exchange</span>
          FX &amp; Metal Rates
        </Link>
      </div>

      <p className={s.footnote}>
        Audited logic · No data stored · Free to use
      </p>

    </main>
  );
}