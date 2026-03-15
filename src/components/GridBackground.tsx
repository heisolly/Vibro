"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [dots, setDots] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Generate dots once on mount (client-side only)
    const generatedDots = [...Array(40)].map(() => ({
      x: Math.floor(Math.random() * 30) * 48,
      y: Math.floor(Math.random() * 20) * 48,
    }));
    setDots(generatedDots);

    // Optional: Animate grid lines or dots subtly
    const ctx = gsap.context(() => {
      gsap.to(".dot-cluster", {
        opacity: "random(0.2, 0.4)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.2,
          from: "random"
        },
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 bg-[var(--color-dash-bg)] overflow-hidden">
      {/* Grid Lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-dash-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-dash-grid) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Dot Clusters at Intersections */}
      <div className="absolute inset-0">
        {dots.map((dot, i) => (
          <div 
            key={i} 
            className="dot-cluster absolute" 
            style={{ 
              left: `${dot.x}px`, 
              top: `${dot.y}px`,
              transform: 'translate(-50%, -50%)',
              opacity: 0.25
            }}
          >
            {/* 3x3 or 4x4 Grid of small dots */}
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, j) => (
                <div key={j} className="w-1 h-1 rounded-full bg-[var(--color-dash-neon)]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

