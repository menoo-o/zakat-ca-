"use client";
// components/SidebarNav.tsx
import './side.css'
import Link from 'next/link';
import { usePathname } from "next/navigation";


export default function SidebarNav() {
  const pathname = usePathname();
  
  return (
    <nav className="sideNav">
      <div className="sideNavSection">
        <div className="sideNavHeading">
          <span className="sideNavTitle">Overview</span>
         
        </div>
        <div className="sideNavLinks">
          <Link
        href="/zakat-cal"
        className={`sideNavLink ${
          pathname === "/zakat-cal" ? "sideNavLinkActive" : ""
        }`}
      >
        <span
          className="material-symbols-outlined sideNavLinkIcon"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          account_balance_wallet
        </span>
        Zakat Calculator
      </Link>

      <Link
        href="/fx-rates"
        className={`sideNavLink ${
          pathname === "/fx-rates" ? "sideNavLinkActive" : ""
        }`}
      >
        <span className="material-symbols-outlined sideNavLinkIcon">
          currency_exchange
        </span>
        Metals & Forex
      </Link>
        </div>
      </div>
    </nav>
  );
}
