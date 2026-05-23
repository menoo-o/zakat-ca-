"use client";
// components/SidebarNav.tsx
import './side.css'
import Link from 'next/link';

export default function SidebarNav() {
  return (
    <nav className="sideNav">
      <div className="sideNavSection">
        <div className="sideNavHeading">
          <span className="sideNavTitle">Summary</span>
          <span className="sideNavSubtitle">Real-time ledger</span>
        </div>
        <div className="sideNavLinks">
          <Link href="/" className="sideNavLink sideNavLinkActive">
            <span
              className="material-symbols-outlined sideNavLinkIcon"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
            Wealth Details
          </Link>
          <Link href="https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-rules" target='_blank' className="sideNavLink">
            <span className="material-symbols-outlined sideNavLinkIcon">menu_book</span>
            Guidelines
          </Link>
          <Link href="/fx-rates" className="sideNavLink">
            <span className="material-symbols-outlined sideNavLinkIcon">currency_exchange</span>
            FX Rates
          </Link>
        </div>
      </div>
    </nav>
  );
}
