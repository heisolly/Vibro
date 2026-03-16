"use client";

import React from "react";

/**
 * RedDotScreen Component
 * Recreated with pixel-perfect accuracy according to specifications.
 * - Solid Black Background (#000000)
 * - Vibro Green Dot (#C6FF3D) at 80vw, 30vh
 * - Structural Motion Grid (Cloned from Dashboard)
 */
export default function RedDotScreen() {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none touch-none">
      {/* ── BACKGROUND GRID (Motion Grid from Dashboard) ── */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          animation: 'gridFlow 4s linear infinite'
        }}
      />

      <style jsx global>{`
        @keyframes gridFlow {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
      `}</style>

      {/* ── THE ACCENT DOT ── */}
      <div 
        className="absolute rounded-full"
        style={{ 
          left: '80vw', 
          top: '30vh', 
          width: '8px', 
          height: '8px', 
          backgroundColor: '#C6FF3D',
          boxShadow: '0 0 10px rgba(198, 255, 61, 0.3)'
        }} 
      />
    </div>
  );
}
