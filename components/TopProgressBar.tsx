// "use client";

// import React, { useRef } from "react";

// type ProgressState = "idle" | "loading" | "complete" | "error";

// interface TopProgressBarProps {
//   /** Current progress value 0–100 */
//   progress: number;
//   /** Bar state controls visibility and color */
//   state: ProgressState;
//   /**
//    * Visual variant
//    * - "default"  — single solid line (clean, minimal)
//    * - "glow"     — neon glow + shimmer
//    * - "gradient" — animated gradient sweep
//    */
//   variant?: "default" | "glow" | "gradient";
//   /** Bar height in px (default: 3) */
//   height?: number;
//   /** Easing for the CSS width transition (default: "cubic-bezier(0.4, 0, 0.2, 1)") */
//   easing?: string;
// }

// const COLORS = {
//   default: {
//     bar: "#3b82f6",
//     error: "#ef4444",
//     shadow: "none",
//   },
//   glow: {
//     bar: "#a78bfa",
//     error: "#f87171",
//     shadow: "0 0 10px #a78bfa, 0 0 20px #a78bfa80",
//   },
//   gradient: {
//     bar: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)",
//     error: "#f43f5e",
//     shadow: "none",
//   },
// };

// export default function TopProgressBar({
//   progress,
//   state,
//   variant = "glow",
//   height = 3,
//   easing = "cubic-bezier(0.4, 0, 0.2, 1)",
// }: TopProgressBarProps) {
//   const barRef = useRef<HTMLDivElement>(null);
//   const isVisible = state === "loading" || state === "complete" || state === "error";
//   const colors = COLORS[variant];

//   const barColor =
//     state === "error"
//       ? colors.error
//       : variant === "gradient"
//       ? colors.bar
//       : colors.bar;

//   const shimmerVisible = variant === "glow" && state === "loading";
//   const gradientAnimated = variant === "gradient" && state === "loading";
  

//   return (
//     <>
//       <style>{`
//         @keyframes nprogress-shimmer {
//           0%   { transform: translateX(-100%); }
//           100% { transform: translateX(400%); }
//         }
//         @keyframes nprogress-gradient-shift {
//           0%   { background-position: 0% 50%; }
//           100% { background-position: 200% 50%; }
//         }
//         @keyframes nprogress-fadeout {
//           0%   { opacity: 1; }
//           100% { opacity: 0; }
//         }
//         .nprogress-bar-wrap {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           z-index: 9999;
//           pointer-events: none;
//         }
//         .nprogress-bar {
//           height: ${height}px;
//           transition: width 0.25s ${easing}, opacity 0.3s ease;
//           transform-origin: left center;
//           position: relative;
//           overflow: visible;
//         }
//         .nprogress-bar.is-gradient {
//           background-size: 200% 100%;
//         }
//         .nprogress-bar.is-gradient.is-animating {
//           animation: nprogress-gradient-shift 1.4s linear infinite;
//         }
//         .nprogress-shimmer {
//           position: absolute;
//           top: 0;
//           left: 0;
//           bottom: 0;
//           width: 40%;
//           background: linear-gradient(
//             90deg,
//             transparent 0%,
//             rgba(255,255,255,0.6) 50%,
//             transparent 100%
//           );
//           animation: nprogress-shimmer 1.6s ease-in-out infinite;
//         }
//         .nprogress-bar-wrap.is-complete .nprogress-bar {
//           animation: nprogress-fadeout 0.3s ease 0.1s forwards;
//         }
//         .nprogress-bar-wrap.is-error .nprogress-bar {
//           animation: nprogress-fadeout 0.5s ease 0.2s forwards;
//         }
//         .nprogress-bar-wrap.is-idle {
//           display: none;
//         }
//         /* Drip dot at the leading edge */
//         .nprogress-peg {
//           position: absolute;
//           right: -1px;
//           top: -2px;
//           width: 120px;
//           height: calc(${height}px + 4px);
//           pointer-events: none;
//         }
//       `}</style>

//       <div
//         className={`nprogress-bar-wrap${
//           state === "idle"
//             ? " is-idle"
//             : state === "complete"
//             ? " is-complete"
//             : state === "error"
//             ? " is-error"
//             : ""
//         }`}
//         role="progressbar"
//         aria-valuenow={progress}
//         aria-valuemin={0}
//         aria-valuemax={100}
//         aria-label="Page loading"
//         aria-hidden={!isVisible}
//       >
//         <div
//           ref={barRef}
//           className={[
//             "nprogress-bar",
//             variant === "gradient" ? "is-gradient" : "",
//             gradientAnimated ? "is-animating" : "",
//           ]
//             .filter(Boolean)
//             .join(" ")}
//           style={{
//             width: `${progress}%`,
//             background: barColor as string,
//             boxShadow:
//               state !== "error"
//                 ? (colors.shadow as string)
//                 : "none",
//           }}
//         >
//           {/* Shimmer overlay for glow variant */}
//           {shimmerVisible && <div className="nprogress-shimmer" />}

//           {/* Leading-edge peg / glow dot */}
//           {state === "loading" && variant !== "gradient" && (
//             <svg
//               className="nprogress-peg"
//               viewBox="0 0 120 7"
//               preserveAspectRatio="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <defs>
//                 <radialGradient id="peg-glow" cx="100%" cy="50%" r="100%">
//                   <stop
//                     offset="0%"
//                     // stopColor={state === "error" ? colors.error : colors.bar as string}
//                     stopOpacity="0.9"
//                   />
//                   <stop offset="100%" stopColor="transparent" stopOpacity="0" />
//                 </radialGradient>
//               </defs>
//               <rect
//                 x="0"
//                 y="0"
//                 width="120"
//                 height="7"
//                 fill="url(#peg-glow)"
//               />
//             </svg>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
