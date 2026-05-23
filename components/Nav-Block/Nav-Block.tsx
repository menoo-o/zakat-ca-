"use client";
// components/Nav.tsx
// Uses global CSS classes from nav.css (imported in app/page.tsx)
import Link from 'next/link';
import './nav.css'

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="navLogo">
        <div className="navLogoMark">Z</div>
        <span className="navLogoText">ZakatCalc</span>
      </Link>

      <div className="navLinks">
        <Link href="/" className="navLink navLinkActive">
          Calculator
        </Link>
        <Link href="/history" className="navLink">
          History
        </Link>
        <Link href="/charity" className="navLink">
          Charity
        </Link>
      </div>

      <div className="navRight">
        <button className="navGiveBtn">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}
          >
            volunteer_activism
          </span>
          Give Zakat
        </button>
        <button className="navIconBtn" aria-label="Account">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_circle</span>
        </button>
      </div>
    </nav>
  );
}
