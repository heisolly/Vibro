"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GridBackgroundProps {
  forceTheme?: "light" | "dark";
}

/**
 * GridBackground - Universal Edition
 * - Works both inside and outside the dashboard ThemeProvider
 * - Clean vertical motion with GSAP
 * - Vibro green grid lines
 * - Smooth downward transparency fade
 */
export default function GridBackground({ forceTheme }: GridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Safely attempt to read theme from context – falls back cleanly if not in ThemeProvider
  let contextTheme: "light" | "dark" = "dark";
  try {
    // Dynamic require to avoid crashes outside ThemeProvider
    const { useTheme } = require("@/app/dashboard/ThemeProvider");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contextTheme = useTheme().theme;
  } catch (_) {
    contextTheme = "dark";
  }

  const theme = forceTheme || contextTheme;
  const isDark = theme === "dark";

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          backgroundPositionY: "24px",
          duration: 1.5,
          ease: "none",
          repeat: -1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isDark]);

  // Light mode uses slightly more visible green lines on the cream background
  const lineColor = isDark ? "#C6FF3D44" : "#C6FF3D88";

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700">
      
      {/* ── MOTION GRID ── */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 15%, rgba(0,0,0,0) 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 15%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* ── TOP-CENTER GLOW ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[280px] bg-[#C6FF3D] pointer-events-none transition-opacity duration-1000"
        style={{ 
          opacity: isDark ? 0.04 : 0.06, 
          filter: "blur(100px)" 
        }}
      />

      {/* ── CORNER ACCENT MARKS ── */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-[#C6FF3D33]" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-[#C6FF3D33]" />
    </div>
  );
}
