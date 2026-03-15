"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".line-1", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    })
    .from(".line-2-container", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .from(".highlight-box", {
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.6,
      ease: "expo.out"
    }, "-=0.2");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative z-10 pt-48 pb-12 flex flex-col items-center">
      <div className="text-center">
        <h1 className="line-1 text-[120px] font-[900] font-poppins text-black leading-[1.0] tracking-[-0.04em]">
          Flawless Design.
        </h1>
        
        <div className="line-2-container relative mt-4 inline-block">
          {/* Neon Box */}
          <div 
            className="highlight-box absolute inset-0 bg-[var(--color-dash-neon)] border-[4px] border-black rounded-sm -skew-x-2 -rotate-1 shadow-[10px_10px_0_rgba(0,0,0,1)]"
            style={{ width: "105%", height: "100%", left: "-2.5%" }}
          />
          
          <h1 className="relative text-[120px] font-[900] font-poppins text-black leading-[1.0] tracking-[-0.04em] px-12">
            Effortless Ship.
          </h1>
        </div>
      </div>
    </div>
  );
}
