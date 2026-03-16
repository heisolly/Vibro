"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Upload, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
    tl.from(".hero-text-content > *", { y: 24, opacity: 0, stagger: 0.12 }, 0.4)
      .from(".hero-ui-preview", { x: 48, opacity: 0, duration: 1.3 }, 0.6);
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#FFFCF2] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 border-b-[4px] border-black">
      
      {/* Motion grid behind all content */}
      <GridBackground forceTheme="light" />

      <Navbar />

      <div className="relative z-10 w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-20 items-center">

          {/* LEFT: TEXT */}
          <div className="hero-text-content flex flex-col justify-center font-space-grotesk">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-12">
              <div className="flex items-center gap-2 bg-black px-5 py-2 border-[2px] border-black shadow-[4px_4px_0_#C6FF3D]">
                <div className="w-2.5 h-2.5 bg-[#C6FF3D] animate-pulse" />
                <span className="text-[11px] font-[900] text-[#C6FF3D] uppercase tracking-[0.4em]">AI Design System Engine</span>
              </div>
            </div>

            {/* Primary Headline */}
            <h1 className="text-[3.8rem] sm:text-[4.8rem] font-[1000] text-[#0D0D0D] tracking-[-0.03em] leading-[0.88] mb-8 uppercase">
              Turn Ideas<br />Into Full<br />
              <span className="text-black bg-[#C6FF3D] inline-block px-4 border-[3px] border-black shadow-[10px_10px_0_rgba(0,0,0,1)] mt-2">
                Design Systems.
              </span>
            </h1>

            <p className="text-[1.2rem] text-zinc-700 max-w-lg mb-6 leading-relaxed font-bold">
              Describe what you want to build or upload a UI reference. Vibro extracts colors, typography, spacing, and components — then lets you edit and export everything.
            </p>

            {/* Workflow Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-12">
              {["Prompt or Upload", "→", "Generate System", "→", "Edit Visually", "→", "Export Anywhere"].map((step, i) => (
                step === "→" 
                  ? <span key={i} className="text-zinc-400 font-black text-lg">→</span>
                  : <span key={i} className="text-[11px] font-[900] text-black bg-white border-[2px] border-black px-4 py-2 shadow-[3px_3px_0_rgba(0,0,0,0.1)] uppercase tracking-widest">{step}</span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-5 font-space-grotesk">
              <Link
                href="/dashboard"
                className="bg-[#0D0D0D] text-white px-10 py-5 text-[15px] font-[900] flex items-center gap-3 border-[3px] border-black shadow-[8px_8px_0_#C6FF3D] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_#C6FF3D] uppercase tracking-widest group"
              >
                Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#features"
                className="flex items-center gap-3 px-10 py-5 border-[3px] border-black bg-white text-black font-[900] text-[15px] shadow-[8px_8px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(0,0,0,1)] uppercase tracking-widest"
              >
                <Upload className="w-5 h-5" /> Upload Reference
              </Link>
            </div>
          </div>

          {/* RIGHT: UI PREVIEW — The core workflow visualized */}
          <div className="hero-ui-preview relative w-full">
            <div className="relative border-[4px] border-black shadow-[20px_20px_0_#C6FF3D] bg-[#0D0D0D] overflow-hidden">
              
              {/* Mock browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3 border-b-[3px] border-black/40 bg-[#1a1a1a]">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black/30" />
                <div className="w-3 h-3 rounded-full bg-[#C6FF3D] border border-black/30" />
                <div className="flex-1 mx-4 bg-black/40 px-4 py-1 text-[10px] font-mono text-zinc-600">vibro.ai/synthesis</div>
              </div>

              {/* Inside app view */}
              <div className="p-6 min-h-[340px]">
                {/* Prompt input mock */}
                <div className="mb-5 border border-[#C6FF3D]/20 bg-black/60 p-4">
                  <p className="text-[12px] text-zinc-400 font-mono mb-2 opacity-60">PROMPT INPUT</p>
                  <p className="text-[14px] font-bold text-white">"Dark FinTech dashboard with stat cards, sidebar nav, and data charts"</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-1.5 h-1.5 bg-[#C6FF3D] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#C6FF3D]">PROTOCOL INFERENCE — Synthesizing Dark Mode FinTech system with React · r=4px</span>
                  </div>
                </div>

                {/* Design system preview tiles */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 border border-[#C6FF3D]/20 bg-black/40">
                    <p className="text-[9px] font-[900] text-zinc-700 uppercase tracking-widest mb-2">Color System</p>
                    <div className="flex gap-1">
                      {["#C6FF3D", "#0D0D0D", "#1a1a1a", "#3a3a3a", "#fafafa"].map(c => (
                        <div key={c} className="h-5 flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-3 border border-[#C6FF3D]/20 bg-black/40">
                    <p className="text-[9px] font-[900] text-zinc-700 uppercase tracking-widest mb-2">Typography</p>
                    <div className="space-y-0.5">
                      <div className="h-2 bg-white/80 w-3/4" />
                      <div className="h-1.5 bg-white/40 w-1/2" />
                      <div className="h-1 bg-white/20 w-5/6" />
                    </div>
                  </div>
                  <div className="p-3 border border-[#C6FF3D]/20 bg-black/40">
                    <p className="text-[9px] font-[900] text-zinc-700 uppercase tracking-widest mb-2">Spacing</p>
                    <div className="flex flex-col gap-1">
                      {[4, 8, 16, 24].map(s => (
                        <div key={s} className="flex items-center gap-1">
                          <div className="h-1 bg-[#C6FF3D]/60" style={{ width: `${(s / 24) * 100}%` }} />
                          <span className="text-[8px] font-mono text-zinc-700">{s}px</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Component chips */}
                <div className="flex flex-wrap gap-2">
                  {["Button", "Card", "Navbar", "Sidebar", "Form", "Table", "+ 24 more"].map(c => (
                    <span key={c} className="px-3 py-1 text-[10px] font-[900] uppercase border border-[#C6FF3D]/30 text-[#C6FF3D] bg-[#C6FF3D]/5">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom output bar */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-[#C6FF3D]/10 bg-black">
                <span className="text-[10px] font-mono text-[#C6FF3D]">■ SYNTHESIS COMPLETE — 31 tokens · 8 components · 2 themes</span>
                <div className="flex gap-3">
                  <span className="px-3 py-1 text-[10px] font-[900] bg-white text-black uppercase tracking-widest">EXPORT</span>
                  <span className="px-3 py-1 text-[10px] font-[900] bg-[#C6FF3D] text-black uppercase tracking-widest">CLI PULL</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="mt-6 px-6 py-3 bg-white border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] inline-block">
              <p className="text-[11px] font-[900] text-black tracking-tight uppercase font-space-grotesk">
                Prompt <span className="text-[#C6FF3D] bg-black px-1 mx-1">→</span> Full Design System <span className="text-[#C6FF3D] bg-black px-1 mx-1">→</span> Export-Ready
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
