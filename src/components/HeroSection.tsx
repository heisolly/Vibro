"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Search, Zap, Layers, Sparkles, GitBranch, Box, Activity, Terminal, ArrowRight, ShieldCheck, Code2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WORDS = ["React Architecture", "Design Systems", "Production UI", "Neural Tokens", "Full-Stack Nodes"];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [promptVal, setPromptVal] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 3000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    
    tl.from(".h-glow", { opacity: 0, scale: 0.8, duration: 2 })
      .from(".h-title-part", { y: 100, opacity: 0, stagger: 0.15, duration: 1.2 }, "-=1.5")
      .from(".h-terminal", { y: 50, opacity: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.8")
      .from(".h-module", { x: (i) => i % 2 === 0 ? -40 : 40, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.5")
      .from(".h-stats-bar", { opacity: 0, y: 20, duration: 1 }, "-=0.2");

    // Continuous floating for modules
    gsap.to(".h-module", {
      y: "random(-10, 10)",
      x: "random(-5, 5)",
      rotation: "random(-1, 1)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: heroRef });

  const handleSynthesize = () => {
    if (!promptVal) return;
    setIsSynthesizing(true);
    setTimeout(() => setIsSynthesizing(false), 2000);
  };

  return (
    <section ref={heroRef} className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-white">
      
      {/* ── PERSISTENT GRID BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{
            backgroundImage: `linear-gradient(to right, #C6FF3D 1px, transparent 1px), linear-gradient(to bottom, #C6FF3D 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 90%)"
          }}
        />
        <div className="h-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[70vh] bg-[#C6FF3D]/10 blur-[150px] rounded-full" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center min-h-[calc(100vh-120px)]">
        
        {/* LEFT COMPONENT: CORE TEXT & COMMAND */}
        <div className="flex flex-col items-start text-left">
          
          <div className="h-title-part inline-flex items-center gap-2 bg-black text-[#C6FF3D] px-4 py-1.5 mb-8 border-l-[4px] border-[#C6FF3D]">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Engine_Status: Nominal</span>
          </div>

          <h1 className="h-title-part text-[clamp(50px,8vw,110px)] font-[1000] text-black leading-[0.85] uppercase tracking-[-0.05em] mb-6">
            Neural <br />
            <span className="text-white [-webkit-text-stroke:2px_black]">Synthesis.</span>
          </h1>

          <div className="h-title-part h-16 overflow-hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={wordIdx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="text-2xl sm:text-4xl font-black text-zinc-400 italic flex items-center gap-4"
              >
                <div className="w-8 h-[2px] bg-[#C6FF3D]" />
                {WORDS[wordIdx]}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="h-title-part text-lg font-bold text-zinc-500 max-w-xl mb-12 leading-relaxed">
            Stop coding from scratch. Vibro translates high-level human intent into production-grade React architectures instantly.
          </p>

          {/* ── THE SYNTHESIZER TERMINAL ── */}
          <div className="h-terminal w-full max-w-2xl group">
            <div className="relative bg-white border-[3px] border-black p-2 shadow-[12px_12px_0_#000] transition-transform group-focus-within:-translate-y-1">
              <div className="absolute -top-[3px] -right-[3px] bg-[#C6FF3D] border-[3px] border-black px-3 py-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <span className="text-[9px] font-bold text-black uppercase tracking-widest">Active_Prompt</span>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-4 px-4 py-4">
                  <Cpu className={`w-6 h-6 ${isSynthesizing ? "text-[#C6FF3D] animate-spin" : "text-black"}`} />
                  <input 
                    type="text" 
                    value={promptVal}
                    onChange={(e) => setPromptVal(e.target.value)}
                    placeholder="E.g. 'Build a high-performance sidebar with glass tiles'..."
                    className="w-full bg-transparent border-none outline-none font-black text-black placeholder:text-zinc-300 text-lg uppercase tracking-tight"
                  />
                </div>
                <button 
                  onClick={handleSynthesize}
                  className="bg-black text-[#C6FF3D] px-8 py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#C6FF3D] hover:text-black transition-colors"
                >
                  {isSynthesizing ? "Processing..." : "Synthesize"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["Glass Tile Grid", "Neo-Brutalist Auth", "Neural Dashboard"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setPromptVal(tag)}
                  className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 border-[2px] border-black/10 text-zinc-400 hover:border-[#C6FF3D] hover:text-black transition-all"
                >
                  [ {tag} ]
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: THE MODULE STACK */}
        <div className="hidden lg:flex flex-col gap-6 relative">
          
          {/* Module 1: Token Intelligence */}
          <div className="h-module bg-white border-[3px] border-black p-6 shadow-[10px_10px_0_rgba(198,255,61,0.2)] hover:shadow-[10px_10px_0_#C6FF3D] transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#C6FF3D]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Lattice_Structure</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">#04AF</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="h-10 border border-black/10 bg-[#FAFAF8] rounded flex items-center px-3 text-[10px] font-bold">RAD: 0px</div>
              <div className="h-10 border border-black/10 bg-[#C6FF3D] rounded flex items-center px-3 text-[10px] font-black underline">#C6FF3D</div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Architected for Next.js 15</span>
            </div>
          </div>

          {/* Module 2: Live Code Stream */}
          <div className="h-module bg-zinc-950 border-[3px] border-black p-6 shadow-[10px_10px_0_rgba(0,0,0,0.1)]">
             <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Engine_Output.tsx</span>
             </div>
             <div className="space-y-2 font-mono text-[11px]">
                <div className="flex gap-4"><span className="text-zinc-800">01</span><p className="text-blue-400">export default <span className="text-purple-400">function</span> <span className="text-[#C6FF3D]">Node</span>() {"{"}</p></div>
                <div className="flex gap-4"><span className="text-zinc-800">02</span><p className="text-zinc-500 ml-4">return (</p></div>
                <div className="flex gap-4"><span className="text-zinc-800">03</span><p className="text-green-300 ml-8">{"<NeuralGrid variant=\"neon\" />"}</p></div>
                <div className="flex gap-4"><span className="text-zinc-800">04</span><p className="text-zinc-500 ml-4">)</p></div>
             </div>
          </div>

          {/* Module 3: Branding / Logo Overlay */}
          <div className="h-module absolute -bottom-10 -left-10 w-32 h-32 bg-white border-[3px] border-black flex items-center justify-center p-6 shadow-[8px_8px_0_#C6FF3D] z-20">
             <img src="/logo.png" alt="Vibro Logo" className="w-full h-full object-contain" />
          </div>

          {/* Activity Glow */}
          <div className="absolute top-1/2 left-1/2 -z-10 w-64 h-64 bg-[#C6FF3D]/10 blur-[60px] rounded-full animate-pulse" />
        </div>
      </div>

      {/* ── FOOTER STATS BAR ── */}
      <div className="h-stats-bar absolute bottom-0 left-0 w-full border-t-[3px] border-black bg-white py-6 px-10 flex flex-wrap justify-between items-center gap-8 z-30">
        <div className="flex items-center gap-10">
          {[
            { label: "Throughput", val: "4.8Gb/s" },
            { label: "Neural Nodes", val: "1,240+" },
            { label: "Synthesis Rate", val: "400ms" },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-sm font-black text-black">{stat.val}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C6FF3D]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8fcc00]">Cluster_A: Active</span>
          </div>
          <div className="h-6 w-[2px] bg-black/5" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ver 4.2.0 Stable</span>
        </div>
      </div>

    </section>
  );
}
