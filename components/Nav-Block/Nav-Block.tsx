"use client";

import Link from "next/link";
import './nav.css'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname();
  return (
    <header className="nav-header">
     <div className="nav-inner">
        {/* ── Left ── */}
        <div className="nav-left">
          <Link href="/" className="logo-link">
            <span className="nav-logo">ZakatPro</span>
          </Link>
          
          <nav className="nav-links">
            <Link 
              href="/metalrates" 
              className={`nav-link ${pathname === '/metalrates' ? 'active' : 'idle'}`}
            >
              Metals Rates
            </Link>
          </nav>
        </div>

        {/* ── Right ── */}
        <div className="nav-right">
          <button className="nav-icon-btn" aria-label="Notifications">
            notifications
          </button>
          <button className="nav-icon-btn" aria-label="Settings">
            settings
          </button>
          <button className="nav-btn nav-btn-secondary">Support</button>
          <button className="nav-btn nav-btn-primary">Account</button>
        </div>
      </div>
    </header>
  );
}