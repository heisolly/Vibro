"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Generate dots once on mount (client-side only)
    const generatedDots = [...Array(30)].map(() => ({
      x: Math.floor(Math.random() * 30) * 80,
      y: Math.floor(Math.random() * 20) * 80,
    }));
    setDots(generatedDots);

    const ctx = gsap.context(() => {
      gsap.to(".dot-cluster", {
        opacity: "random(0.3, 0.6)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.3,
          from: "random"
        },
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 bg-white overflow-hidden">
      {/* Faint Gray Grid Lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F3F3F3 1.5px, transparent 1.5px),
            linear-gradient(to bottom, #F3F3F3 1.5px, transparent 1.5px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Subtle Yellow-Green Dots */}
      <div className="absolute inset-0">
        {dots.map((dot, i) => (
          <div 
            key={i} 
            className="dot-cluster absolute" 
            style={{ 
              left: `${dot.x}px`, 
              top: `${dot.y}px`,
              transform: 'translate(-50%, -50%)',
              opacity: 0.8
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#E6FFB3]" />
          </div>
        ))}
      </div>

    </div>
  );
}
