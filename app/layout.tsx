// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav-Block/Nav-Block";
import SidebarNav from "@/components/Sidebar-Block/SidebarNav";

export const metadata: Metadata = {
  title: "ZakatCalc — Live Zakat Calculator",
  description: "Calculate your Zakat with live gold & silver prices. Sharia-compliant calculation following AAOIFI guidelines.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
      <Nav />

        <div className="pageWrapper">
          <SidebarNav />

          <main className="pageMain">
            {children}
          </main>
        </div>
        
        </body>
    </html>
  );
}
