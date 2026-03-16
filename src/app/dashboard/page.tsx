"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { 
  Zap, Paperclip, Folder, Settings, CreditCard, Sparkles, Command,
  ChevronRight, Cpu, Layout, Terminal, Palette, Sliders, Code2, 
  ArrowRight, CheckCircle2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "./ThemeProvider";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import GridBackground from "@/components/GridBackground";

/* ── TYPES ──────────────────────────────────────── */
type SynthesisStep = { label: string; done: boolean };

/* ── SYNTHESIS PROTOCOL LOG ─────────────────────── */
const SYNTH_STEPS = [
  "> PARSING NATURAL LANGUAGE INPUT...",
  "> DETECTING COMPONENT ARCHITECTURE...",
  "> MAPPING COLOR TOKEN HIERARCHY...",
  "> EXTRACTING TYPOGRAPHY RHYTHM...",
  "> RESOLVING SPACING SCALE...",
  "> BUILDING COMPONENT DEFINITIONS...",
  "> COMPILING DESIGN SYSTEM MANIFEST...",
  "> SYNTHESIS COMPLETE — RENDERING OUTPUT.",
];

/* ── PROTOCOL CARDS ─────────────────────────────── */
const PROTOCOLS = [
  {
    id: "studio",
    tag: "01",
    title: "Configure Studio",
    sub: "Edit Design Tokens",
    desc: "Jump directly into design token editing. Customize color, type, spacing, shadows, and radius for your system.",
    icon: Sliders,
    href: "/dashboard/studio",
    accent: "bg-[#C6FF3D]",
    textAccent: "text-[#C6FF3D]",
  },
  {
    id: "library",
    tag: "02",
    title: "Browse Library",
    sub: "Scalable Components",
    desc: "Search and preview pre-built, theme-aware UI components. Buttons, cards, navbars, forms, tables, and more.",
    icon: Layout,
    href: "/dashboard/library",
    accent: "bg-white",
    textAccent: "text-white",
  },
  {
    id: "cli",
    tag: "03",
    title: "CLI Onboarding",
    sub: "Install Into Codebase",
    desc: "Get your API key and install components directly into your local project. Zero copy-paste friction.",
    icon: Terminal,
    href: "/dashboard/export",
    accent: "bg-zinc-400",
    textAccent: "text-zinc-400",
  },
];

/* ── COMPONENT STACK OPTIONS ─────────────────────── */
const STACKS = ["React", "Vue", "Svelte", "Next.js"];

/* ─────────────────────────────────────────────────── */
function DashboardContent() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#C6FF3D");
  const [borderRadius, setBorderRadius] = useState("4");
  const [stack, setStack] = useState("React");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthSteps, setSynthSteps] = useState<string[]>([]);
  const [synthDone, setSynthDone] = useState(false);
  const [inference, setInference] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const supabase = createClient();
  const isDark = theme === "dark";

  /* Auto-scroll log */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [synthSteps]);

  /* Live inference preview */
  useEffect(() => {
    if (prompt.length > 4) {
      const lower = prompt.toLowerCase();
      const mode  = lower.includes("dark") ? "Dark Mode" : lower.includes("light") ? "Light Mode" : "Adaptive";
      const genre = lower.includes("fin") || lower.includes("bank") ? "FinTech" 
                  : lower.includes("dash") ? "Dashboard" 
                  : lower.includes("mobile") || lower.includes("app") ? "Mobile App"
                  : lower.includes("landing") || lower.includes("market") ? "Marketing" : "SaaS Platform";
      setInference(`> Synthesizing ${mode} ${genre} system with ${stack} · r=${borderRadius}px`);
    } else {
      setInference("");
    }
  }, [prompt, stack, borderRadius]);

  /* Synthesis sequence */
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsSynthesizing(true);
    setSynthSteps([]);
    setSynthDone(false);
    SYNTH_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setSynthSteps(prev => [...prev, step]);
        if (i === SYNTH_STEPS.length - 1) {
          setTimeout(() => setSynthDone(true), 600);
        }
      }, i * 480);
    });
  };

  const handleReset = () => {
    setIsSynthesizing(false);
    setSynthSteps([]);
    setSynthDone(false);
    setPrompt("");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#050506] text-white" : "bg-[#F6F7F3] text-black"} font-sans flex transition-colors duration-500 selection:bg-[#C6FF3D] selection:text-black overflow-x-hidden`}>
      
      <DashboardSidebar />

      <main className="flex-1 ml-[64px] relative flex flex-col items-center min-h-screen pt-4 overflow-hidden">
        
        <GridBackground />

        {/* Header */}
        <div className="w-full flex justify-end px-8 py-2 relative z-20">
          <DashboardHeader />
        </div>

        <div className="w-full max-w-[920px] flex flex-col items-center justify-center flex-1 -mt-12 relative z-10 px-6">

          {/* ── BRANDING ── */}
          <div className="flex items-center gap-3 mb-8 animate-vi-in pointer-events-none">
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-[#C6FF3D] -rotate-12">
              <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className={`text-[52px] font-serif font-medium tracking-tight select-none leading-none ${isDark ? "text-white" : "text-black"}`}>
              vibro<span className="text-[#C6FF3D] font-sans">.</span>
            </h1>
          </div>

          {/* ═══════════════════════════════
              SMART CONFIGURATION HUB
          ═══════════════════════════════ */}
          {!isSynthesizing ? (
            <div className={`w-full transition-all duration-700 border ${
              isFocused
                ? "border-[#C6FF3D] shadow-[0_0_80px_rgba(198,255,61,0.06)] -translate-y-0.5"
                : isDark ? "border-white/8 bg-[#0A0A0B]/70 backdrop-blur-xl" : "border-black/6 bg-white shadow-sm"
            }`}>
              {/* Top glow stripe */}
              <div className={`h-[2px] w-full bg-[#C6FF3D] origin-left transition-transform duration-700 ${isFocused ? "scale-x-100" : "scale-x-0"}`} />

              {/* DUAL-INPUT ROW */}
              <div className="flex min-h-[180px]">
                {/* LEFT — Prompt */}
                <div className="flex-1 p-8 pr-0">
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Describe what you want to build..."
                    className={`w-full h-full bg-transparent border-none resize-none text-[20px] font-medium leading-relaxed focus:outline-none focus:ring-0 placeholder:font-normal min-h-[150px] ${
                      isDark ? "text-zinc-100 placeholder:text-zinc-800/30" : "text-zinc-900 placeholder:text-zinc-300"
                    }`}
                  />
                </div>

                {/* ── DIVIDER ── */}
                <div className={`w-[1px] my-6 mx-6 ${isDark ? "bg-white/5" : "bg-black/5"}`} />

                {/* RIGHT — Config Panel */}
                <div className="w-[200px] py-6 pr-6 flex flex-col gap-5 shrink-0">
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-white/10 shrink-0 overflow-hidden">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={e => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 -translate-x-1 -translate-y-1 cursor-pointer border-none outline-none bg-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className={`flex-1 bg-transparent border-b text-[11px] font-mono focus:outline-none uppercase ${
                          isDark ? "border-white/5 text-zinc-400 focus:border-[#C6FF3D]" : "border-black/5 text-zinc-600 focus:border-black"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>
                      Border Radius
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={24}
                        value={borderRadius}
                        onChange={e => setBorderRadius(e.target.value)}
                        className="flex-1 h-[2px] accent-[#C6FF3D] cursor-pointer"
                      />
                      <span className={`text-[11px] font-mono w-8 text-right ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>{borderRadius}px</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>
                      Stack
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {STACKS.map(s => (
                        <button key={s} onClick={() => setStack(s)} className={`py-1 text-[9px] font-black uppercase tracking-wider border transition-all ${
                          stack === s
                            ? "border-[#C6FF3D] text-[#C6FF3D] bg-[#C6FF3D]/5"
                            : isDark ? "border-white/5 text-zinc-800 hover:text-white hover:border-white/10" : "border-black/5 text-zinc-300 hover:text-black"
                        }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── PROTOCOL INFERENCE TAB ── */}
              {inference && (
                <div className={`px-8 py-3 border-t flex items-center gap-3 ${isDark ? "border-white/5 bg-[#C6FF3D]/3" : "border-black/5 bg-[#C6FF3D]/5"}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-pulse shrink-0" />
                  <span className={`text-[10px] font-mono ${isDark ? "text-[#C6FF3D]/70" : "text-[#5a8a00]"}`}>
                    PROTOCOL INFERENCE — {inference}
                  </span>
                </div>
              )}

              {/* ── ACTION BAR ── */}
              <div className={`flex items-center justify-between px-8 py-5 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>
                <div className="flex items-center gap-2">
                  {["MOD", "ENH", "UTIL"].map(btn => (
                    <button key={btn} className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest transition-all ${
                      isDark ? "border-white/5 text-zinc-800 hover:text-[#C6FF3D] hover:border-[#C6FF3D]/20" : "border-black/5 text-zinc-300 hover:text-black"
                    }`}>{btn}</button>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  <button className={`p-1.5 transition-colors ${isDark ? "text-zinc-800 hover:text-[#C6FF3D]" : "text-zinc-300 hover:text-black"}`}>
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className={`flex items-center gap-3 px-10 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                      prompt.trim()
                        ? "bg-[#C6FF3D] text-black hover:brightness-110 active:scale-[0.98] shadow-[0_8px_30px_rgba(198,255,61,0.15)]"
                        : isDark ? "bg-white/5 text-zinc-700 cursor-not-allowed" : "bg-black/5 text-zinc-300 cursor-not-allowed"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    GENERATE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════
               VISUAL SYNTHESIS PROTOCOL
            ═══════════════════════════════ */
            <div className={`w-full border ${isDark ? "border-[#C6FF3D]/20 bg-[#0A0A0B]/80 backdrop-blur-xl" : "border-[#C6FF3D]/30 bg-white shadow-sm"}`}>
              {/* Status strip */}
              <div className="h-[2px] w-full bg-[#C6FF3D]">
                <div className="h-full bg-[#C6FF3D] animate-[synthesisBar_4s_linear]" style={{ width: synthDone ? "100%" : "0%" }} />
              </div>

              <div className="flex min-h-[280px]">
                {/* LEFT — Stream Log */}
                <div ref={logRef} className="flex-1 p-8 font-mono text-[12px] overflow-y-auto space-y-2 max-h-[280px]">
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-4 ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>
                    VIBRO SYNTHESIS ENGINE v0.1
                  </p>
                  {synthSteps.map((step, i) => (
                    <div key={i} className={`flex items-start gap-3 animate-vi-in ${
                      i === synthSteps.length - 1 ? "text-[#C6FF3D]" : isDark ? "text-zinc-500" : "text-zinc-500"
                    }`}>
                      {i === synthSteps.length - 1 && !synthDone
                        ? <span className="w-2 h-2 mt-1 bg-[#C6FF3D] animate-pulse rounded-full shrink-0" />
                        : <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-[#C6FF3D]/40" />
                      }
                      <span>{step}</span>
                    </div>
                  ))}
                  {synthDone && (
                    <div className="pt-4 animate-vi-in">
                      <span className="text-[#C6FF3D] font-black text-[11px] uppercase tracking-widest">■ READY — SYSTEM MANIFEST GENERATED</span>
                    </div>
                  )}
                </div>

                {/* RIGHT — Live Data Visualizations */}
                <div className={`w-[200px] p-6 border-l flex flex-col gap-5 shrink-0 ${isDark ? "border-white/5" : "border-black/5"}`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>
                    Token Preview
                  </p>

                  {/* Palette Spinner */}
                  <div className="flex flex-col gap-1.5">
                    <p className={`text-[8px] uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-500"}`}>Color Scale</p>
                    <div className="flex gap-1">
                      {["#C6FF3D", "#9acc30", "#637f1e", "#3a4c12", "#1a2208"].map((c, i) => (
                        <div
                          key={c}
                          className="h-6 flex-1 transition-all"
                          style={{ 
                            backgroundColor: c, 
                            animationDelay: `${i * 200}ms`,
                            opacity: synthSteps.length > i + 2 ? 1 : 0.15,
                            transitionDuration: "0.4s"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Spacing scale */}
                  <div className="flex flex-col gap-1.5">
                    <p className={`text-[8px] uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-500"}`}>Spacing Scale</p>
                    <div className="flex flex-col gap-1">
                      {[4, 8, 16, 24, 32].map((s, i) => (
                        <div key={s} className="flex items-center gap-1.5">
                          <div
                            className="h-1.5 bg-[#C6FF3D] transition-all duration-500"
                            style={{ 
                              width: synthSteps.length > i + 3 ? `${(s / 32) * 100}%` : '0%',
                              transitionDelay: `${i * 100}ms`
                            }}
                          />
                          <span className={`text-[8px] font-mono ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>{s}px</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Border radius preview */}
                  <div className="flex flex-col gap-1.5">
                    <p className={`text-[8px] uppercase tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-500"}`}>Radius · {borderRadius}px</p>
                    <div
                      className="w-full h-10 border-2 border-[#C6FF3D]/40 bg-[#C6FF3D]/5 transition-all duration-500"
                      style={{ borderRadius: `${borderRadius}px` }}
                    />
                  </div>
                </div>
              </div>

              {/* Synthesis action bar */}
              <div className={`flex items-center justify-between px-8 py-5 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>
                <div className={`flex items-center gap-3 text-[10px] font-mono ${isDark ? "text-zinc-700" : "text-zinc-400"}`}>
                  <div className="w-1.5 h-1.5 bg-[#C6FF3D] animate-pulse" />
                  {synthDone ? "SYNTHESIS_COMPLETE" : "SYNTHESIS_RUNNING..."}
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleReset} className={`px-6 py-2.5 border text-[10px] font-black uppercase tracking-wider transition-all ${
                    isDark ? "border-white/8 text-zinc-700 hover:text-white hover:border-white/15" : "border-black/8 text-zinc-400 hover:text-black"
                  }`}>
                    RESET
                  </button>
                  {synthDone && (
                    <button className="flex items-center gap-3 px-10 py-2.5 bg-[#C6FF3D] text-black text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 animate-vi-in">
                      VIEW SYSTEM <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CREATE BLANK ── */}
          {!isSynthesizing && (
            <div className="mt-6 animate-vi-in" style={{ animationDelay: "0.1s" }}>
              <button className={`px-10 py-3 border text-[10px] font-black uppercase tracking-[0.3em] transition-all group flex items-center gap-3 ${
                isDark ? "border-white/8 bg-black/40 text-zinc-700 hover:text-white hover:border-white/15" : "border-black/5 bg-white text-zinc-400 hover:text-black hover:shadow-md"
              }`}>
                CREATE BLANK PROJECT <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════
              GETTING STARTED PROTOCOLS
          ═══════════════════════════════════════ */}
          {!isSynthesizing && (
            <div className="w-full mt-10 animate-vi-in" style={{ animationDelay: "0.2s" }}>
              <p className={`text-[9px] font-black uppercase tracking-[0.5em] mb-4 ${isDark ? "text-zinc-800" : "text-zinc-400"}`}>
                Getting Started Protocols
              </p>
              <div className="grid grid-cols-3 gap-4">
                {PROTOCOLS.map(p => (
                  <Link key={p.id} href={p.href} className={`group p-6 border transition-all hover:shadow-lg ${
                    isDark 
                      ? "border-white/5 bg-white/0 hover:border-[#C6FF3D]/25 hover:bg-white/2" 
                      : "border-black/5 bg-white hover:border-black/15 hover:shadow-sm"
                  }`}>
                    <div className="flex items-start justify-between mb-5">
                      <span className={`text-[9px] font-black tracking-widest ${isDark ? "text-zinc-800" : "text-zinc-300"}`}>{p.tag}</span>
                      <p.icon className={`w-5 h-5 transition-all ${isDark ? "text-zinc-800 group-hover:text-[#C6FF3D]" : "text-zinc-300 group-hover:text-black"}`} />
                    </div>
                    <h3 className="text-[14px] font-black uppercase tracking-tight mb-1">{p.title}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-zinc-700" : "text-zinc-400"}`}>{p.sub}</p>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-zinc-700 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-600"}`}>
                      {p.desc}
                    </p>
                    <div className={`mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                      isDark ? "text-zinc-800 group-hover:text-[#C6FF3D]" : "text-zinc-300 group-hover:text-black"
                    }`}>
                      ENTER <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="w-full max-w-[1200px] mt-auto px-10 pb-10 animate-vi-in" style={{ animationDelay: "0.4s" }}>
          <div className={`w-full h-[1px] ${isDark ? "bg-white/5" : "bg-black/5"} mb-8`} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button className={`flex items-center gap-3 py-2.5 px-6 border transition-all text-[11px] uppercase tracking-[0.2em] font-black ${
                isDark ? "bg-white text-black border-transparent hover:bg-[#C6FF3D]" : "bg-black text-white border-transparent hover:bg-[#C6FF3D] hover:text-black"
              }`}>
                <Folder className="w-4 h-4 fill-current" /> IMPORT
              </button>
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 border ${isDark ? "border-white/5 text-zinc-800" : "border-black/5 text-zinc-400"}`}>
                <Command className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">K Search</span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors group ${isDark ? "text-zinc-800 hover:text-white" : "text-zinc-400 hover:text-black"}`}>
                <CreditCard className="w-3.5 h-3.5 group-hover:text-[#C6FF3D]" /> SUBSCRIPTIONS
              </button>
              <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors group ${isDark ? "text-zinc-800 hover:text-white" : "text-zinc-400 hover:text-black"}`}>
                <Settings className="w-3.5 h-3.5 group-hover:text-[#C6FF3D]" /> SETTINGS
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes vi-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-vi-in {
          opacity: 0;
          animation: vi-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes synthesisBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#050506]">
        <Zap className="w-8 h-8 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
