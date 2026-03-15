"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, Code2, Layers } from "lucide-react";

export default function HeroLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
      });

      // Subtle float for the "Generated" tag
      gsap.to(".badge-float", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 w-full flex flex-col items-center">
      {/* Editor Context Flourish */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none w-full max-w-4xl h-[400px]">
        {/* Rulers/Grid lines visually reinforcing the "Generator" feel */}
        <div className="absolute top-0 left-[10%] w-[1px] h-full bg-black/20" />
        <div className="absolute top-0 right-[10%] w-[1px] h-full bg-black/20" />
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-black/20" />
        <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-black/20" />
      </div>

      <div className="hero-content flex flex-col items-center text-center">
        {/* Top Badge: AI Identity */}
        <div className="badge-float flex items-center gap-2 bg-black text-[#C6FF3D] px-4 py-1.5 rounded-full mb-8 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <Sparkles className="w-4 h-4" />
          <span className="text-[12px] font-[900] uppercase tracking-widest">Neural_Architecture_v1.0</span>
        </div>

        {/* Main Heading */}
        <div className="relative group">
          <h1 className="text-[110px] font-[900] font-poppins text-black leading-[0.95] tracking-[-0.04em] italic uppercase">
            Flawless
          </h1>
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
             <div className="w-1.5 h-1.5 bg-black rounded-full" />
             <div className="w-[1px] h-12 bg-black/20" />
             <div className="text-[10px] font-black text-black/30 rotate-90 origin-left ml-2">WIDTH: 100%</div>
          </div>
        </div>

        <div className="relative mt-2 inline-block">
          {/* Neon Generator Highlight */}
          <div 
            className="highlight-box absolute inset-0 bg-[#C6FF3D] border-[6px] border-black rounded-xl shadow-[12px_12px_0_#000000]"
            style={{ width: "calc(100% + 80px)", height: "calc(100% + 40px)", left: "-40px", top: "-20px" }}
          />
          
          <h1 className="relative text-[110px] font-[900] font-poppins text-black leading-[0.95] tracking-[-0.04em] px-6 italic uppercase">
            Designs.
          </h1>

          {/* Floating Property Labels */}
          <div className="absolute -right-24 -top-8 bg-black text-white px-3 py-1 rounded-md text-[10px] font-black border-[2px] border-black">
            FONT: POPPINS_EB
          </div>
          <div className="absolute -left-32 -bottom-4 bg-white border-[2px] border-black text-black px-3 py-1 rounded-md text-[10px] font-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
            FILL: #C6FF3D
          </div>
        </div>

        <div className="mt-12 group flex items-center gap-3">
          <h1 className="text-[110px] font-[900] font-poppins text-black leading-[0.8] tracking-[-0.04em] italic uppercase">
            Effortless Ship.
          </h1>
          {/* Tooltip-style icon */}
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border-4 border-black shadow-[6px_6px_0_#C6FF3D] -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
             <Code2 className="w-8 h-8 text-[#C6FF3D]" />
          </div>
        </div>
      </div>

      {/* Capabilities Pills */}
      <div className="flex items-center gap-6 mt-20 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
         <div className="flex items-center gap-2 border-[2.5px] border-black px-5 py-2 rounded-2xl font-black text-sm uppercase">
            <Layers className="w-4 h-4" /> Scalable_Libraries
         </div>
         <div className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-2xl font-black text-sm uppercase">
            <div className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-pulse" /> Live_Editor
         </div>
      </div>
    </div>
  );
}
