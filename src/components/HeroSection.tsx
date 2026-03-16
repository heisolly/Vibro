"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Zap, Layers, Terminal, ArrowRight, 
  Code2, Activity, Box, Database, Network,
  Maximize2, Orbit, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MATRIX_WORDS = [
  "NEURAL_LATTICE", 
  "REACT_NODES", 
  "DESIGN_SYSTEMS", 
  "TOKEN_SYNTHESIS", 
  "ARCHITECTURE_GEN"
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [promptVal, setPromptVal] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % MATRIX_WORDS.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    
    tl.from(".h-ambient-glow", { opacity: 0, duration: 2 })
      .from(".h-grid-main", { opacity: 0, scale: 1.1, duration: 1.5 }, "-=1.5")
      .from(".h-headline span", { y: 80, opacity: 0, stagger: 0.1, duration: 1.2 }, "-=1.2")
      .from(".h-synth-console", { y: 40, opacity: 0, duration: 1, ease: "back.out(1.4)" }, "-=0.8")
      .from(".h-entity", { 
        x: (i) => i % 2 === 0 ? -50 : 50, 
        opacity: 0, 
        stagger: 0.15, 
        duration: 0.8 
      }, "-=0.5");

    // Parallax logic for entities
    gsap.to(".h-entity-parallax", {
      x: (i) => (mousePos.x / window.innerWidth - 0.5) * (i + 1) * 30,
      y: (i) => (mousePos.y / window.innerHeight - 0.5) * (i + 1) * 30,
      duration: 1,
      ease: "power2.out"
    });

    // Decorative "Scanline" loop
    gsap.fromTo(".h-scanline", 
      { y: "-100%" }, 
      { y: "200%", duration: 8, repeat: -1, ease: "none" }
    );
  }, { scope: heroRef, dependencies: [mousePos] });

  const handleStartSynthesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptVal.trim() || isSynthesizing) return;
    setIsSynthesizing(true);
    // Simulate high-level synthesis
    setTimeout(() => setIsSynthesizing(false), 2400);
  };

  return (
    <section ref={heroRef} className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden pt-20">
      
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main Technical Grid */}
        <div 
          className="h-grid-main absolute inset-0 opacity-[0.08]" 
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />
        {/* Micro Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: "15px 15px"
          }}
        />
        {/* Animated Scanline */}
        <div className="h-scanline absolute left-0 right-0 h-[30vh] bg-gradient-to-b from-transparent via-[#C6FF3D]/5 to-transparent pointer-events-none" />
        
        {/* Dynamic Glows */}
        <div className="h-ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-[#C6FF3D]/10 blur-[140px] rounded-full opacity-60" />
      </div>

      <Navbar />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 w-full max-w-[1440px] px-8 grid lg:grid-cols-[1fr_0.8fr] gap-20 items-center">
        
        {/* LEFT: PRIMARY MESSAGING & CONSOLE */}
        <div className="flex flex-col items-start gap-8">
          
          <div className="h-entity flex items-center gap-4 px-5 py-2 rounded-full border border-black/10 bg-[#FAFAF8] shadow-[4px_4px_0_rgba(0,0,0,0.05)]">
            <span className="flex h-2 w-2 rounded-full bg-[#C6FF3D] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              VIBRO_NEURAL_CORE::SYNTHESIS_ACTIVE
            </span>
          </div>

          <div className="h-headline flex flex-col items-start">
            <h1 className="text-[clamp(60px,9vw,130px)] font-[1000] text-black leading-[0.82] uppercase tracking-[-0.06em]">
              <span className="block italic">Precision</span>
              <span className="block text-white" style={{ WebkitTextStroke: "2.5px black" }}>Architecture.</span>
            </h1>
          </div>

          <div className="flex flex-col gap-6 max-w-xl">
            <div className="h-entity h-14 overflow-hidden border-l-[4px] border-[#C6FF3D] pl-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={wordIdx}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="text-2xl font-black text-zinc-400 font-mono tracking-tight"
                >
                  {`>_ ${MATRIX_WORDS[wordIdx]}`}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <p className="h-entity text-xl font-bold text-zinc-500 leading-relaxed italic">
              "We synthesize human design intent into production-grade React nodes through 
              autonomous neural mapping protocols."
            </p>
          </div>

          {/* ── THE HARDWARE-STYLE CONSOLE ── */}
          <form 
            onSubmit={handleStartSynthesis}
            className="h-synth-console w-full max-w-2xl bg-black border-[4px] border-black rounded-[2rem] p-1.5 shadow-[24px_24px_0_rgba(198,255,61,0.2)] overflow-hidden"
          >
            <div className="bg-zinc-900 rounded-[1.8rem] p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-[#C6FF3D]" />
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Synthesis_Terminal_v4.2</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D]" />
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-center">
                  <Cpu className={`w-8 h-8 ${isSynthesizing ? "text-[#C6FF3D] animate-spin" : "text-white/20"}`} />
                </div>
                <input 
                  type="text" 
                  value={promptVal}
                  onChange={(e) => setPromptVal(e.target.value)}
                  placeholder="ID_DESC: 'Build a glassmorphic sidebar protocol'..."
                  className="flex-1 bg-transparent border-none outline-none font-black text-white placeholder:text-zinc-700 text-xl tracking-tighter uppercase"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">C0_Link</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className={`h-1 w-3 ${i < 3 ? "bg-[#C6FF3D]" : "bg-white/5"}`} />)}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Mesh_Rate</span>
                    <span className="text-[10px] font-bold text-white tracking-widest">0.4s</span>
                  </div>
                </div>

                <button 
                  disabled={isSynthesizing}
                  className="group bg-[#C6FF3D] border-[2px] border-black px-10 py-4 rounded-xl font-black text-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSynthesizing ? "SYNTHESIZING..." : "EXECUTE_PROTOCOL"}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: THE KINETIC ARCHITECTURE FIELD */}
        <div className="hidden lg:flex flex-col gap-8 relative items-center justify-center h-[700px]">
          
          {/* Entity 1: Code Matrix */}
          <div className="h-entity h-entity-parallax absolute top-0 -right-4 w-[380px] bg-white border-[3px] border-black p-6 shadow-[12px_12px_0_#000] z-20">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-[#C6FF3D]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Node_Stream</span>
                </div>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
             </div>
             <div className="space-y-2 font-mono text-[10px] text-zinc-400">
                <p className="text-zinc-800"><span className="text-[#C6FF3D]">import</span> {"{ Lattice }"} from <span className="text-[#C6FF3D]">"@vibro/core"</span></p>
                <p className="pl-4 italic">// Initializing neural bridge...</p>
                <div className="w-full h-2 bg-[#FAFAF8] rounded-full overflow-hidden">
                   <div className="h-full bg-black w-[65%] animate-[shimmer_2s_infinite]" />
                </div>
                <p className="text-zinc-800">const <span className="text-black font-black">DesignNode</span> = Lattice.synthesize()</p>
             </div>
          </div>

          {/* Entity 2: Abstract Mesh Figure (Logo Focus) */}
          <div className="h-entity h-entity-parallax flex flex-col items-center justify-center gap-10">
             <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 border-[2px] border-dashed border-black/10 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 border border-black/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="relative w-32 h-32 bg-white border-[4px] border-black shadow-[12px_12px_0_#C6FF3D] p-6 flex items-center justify-center group hover:scale-110 transition-transform cursor-pointer">
                   <img src="/logo.png" alt="Vibro Logo" className="w-full h-full object-contain" />
                </div>
             </div>
             
             <div className="flex gap-6">
                {[Database, Network, Orbit].map((Icon, i) => (
                   <div key={i} className="w-12 h-12 rounded-2xl border-[3px] border-black bg-white flex items-center justify-center shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-all">
                      <Icon className="w-5 h-5 text-black" />
                   </div>
                ))}
             </div>
          </div>

          {/* Entity 3: Manifest Preview */}
          <div className="h-entity h-entity-parallax absolute bottom-0 -left-10 w-[300px] bg-zinc-950 border-[3px] border-black p-6 shadow-[12px_12px_0_rgba(198,255,61,0.4)] z-10">
             <div className="flex items-center gap-3 mb-6">
                <Box className="w-4 h-4 text-[#C6FF3D]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Architectural_Manifest</span>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map(i => (
                   <div key={i} className={`h-8 border border-white/10 rounded flex items-center justify-center text-[8px] font-black ${i === 2 ? "bg-[#C6FF3D] text-black border-[#C6FF3D]" : "text-white/30"}`}>
                      {i === 2 ? "PRO" : `N_0${i}`}
                   </div>
                ))}
             </div>
             <div className="mt-6 flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest underline underline-offset-4">Synthesis complete</span>
                <CheckIcon />
             </div>
          </div>

        </div>
      </div>

      {/* ── LOWER MATRIX BAR ── */}
      <div className="h-stats-bar absolute bottom-0 left-0 w-full border-t-[4px] border-black bg-white py-8 px-12 flex flex-wrap justify-between items-center z-30">
        <div className="flex items-center gap-12">
          {[
            { label: "Neural_Throughput", val: "12.4 TB/S" },
            { label: "Active_Clusters", val: "102 Nodes" },
            { label: "Lattice_Version", val: "BETA_0.4" },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className="text-lg font-black text-black tracking-tight">{stat.val}</span>
            </div>
          ))}
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#C6FF3D] stroke-[3px]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#8fcc00]">System: Nominal</span>
           </div>
           <div className="h-10 w-[3px] bg-black" />
           <Link href="/dashboard" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-[#C6FF3D] transition-colors">
              Access_Dashboard <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>

    </section>
  );
}

function CheckIcon() {
   return (
      <svg className="w-4 h-4 text-[#C6FF3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
      </svg>
   );
}
