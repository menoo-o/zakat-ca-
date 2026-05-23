// "use client";

// /**
//  * NavigationProgressBar
//  * ─────────────────────
//  * Drop this once into your root layout (app/layout.tsx).
//  * It listens to Next.js App Router navigation events via the
//  * unofficial useRouter + window history patching approach,
//  * and drives the TopProgressBar automatically.
//  *
//  * Usage:
//  *   import NavigationProgressBar from "@/components/NavigationProgressBar";
//  *
//  *   export default function RootLayout({ children }) {
//  *     return (
//  *       <html>
//  *         <body>
//  *           <NavigationProgressBar />
//  *           {children}
//  *         </body>
//  *       </html>
//  *     );
//  *   }
//  */

// import { useEffect } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
// // import TopProgressBar from "./TopProgressBar";
// // import { useProgressBar } from "../hooks/useProgressBar";

// interface NavigationProgressBarProps {
//   /** See TopProgressBar variant prop */
//   variant?: "default" | "glow" | "gradient";
//   height?: number;
// }

// export default function NavigationProgressBar({
//   variant = "glow",
//   height = 3,
// }: NavigationProgressBarProps) {
//   const { progress, state, start, complete } = useProgressBar({
//     ceiling: 85,
//     tickInterval: 180,
//     completeDuration: 350,
//   });

//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // ── Intercept <Link> clicks ──────────────────────────────────────────────
//   useEffect(() => {
//     const handleClick = (e: MouseEvent) => {
//       const target = (e.target as HTMLElement).closest("a");
//       if (!target) return;

//       const href = target.getAttribute("href");
//       if (!href) return;

//       // Ignore: external links, hash-only, mailto, tel, download
//       const isExternal =
//         target.hostname !== window.location.hostname;
//       const isHashOnly = href.startsWith("#");
//       const isSpecialScheme =
//         href.startsWith("mailto:") ||
//         href.startsWith("tel:") ||
//         href.startsWith("javascript:");
//       const isDownload = target.hasAttribute("download");

//       if (isExternal || isHashOnly || isSpecialScheme || isDownload) return;

//       // Don't double-fire if already loading to the same destination
//       const targetUrl = new URL(href, window.location.href);
//       const isSameRoute =
//         targetUrl.pathname === window.location.pathname &&
//         targetUrl.search === window.location.search;
//       if (isSameRoute) return;

//       start();
//     };

//     document.addEventListener("click", handleClick);
//     return () => document.removeEventListener("click", handleClick);
//   }, [start]);

//   // ── Detect route change completion (pathname / search params change) ─────
//   useEffect(() => {
//     // This effect fires after Next.js has committed the new route.
//     // If the bar is loading, mark it done.
//     if (state === "loading") {
//       complete();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname, searchParams]);

//   return <TopProgressBar progress={progress} state={state} variant={variant} height={height} />;
// }
