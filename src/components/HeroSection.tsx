"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Zap, Layers, Terminal, ArrowRight, 
  Code2, Activity, Box, Database, Network,
  Maximize2, Orbit, ChevronRight, Play, UploadCloud,
  FileText, ImageIcon, Globe, FileCode2, Binary
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TABS = [
  { id: "text", label: "Text Prompt", icon: FileText },
  { id: "image", label: "Image Scan", icon: ImageIcon },
  { id: "url", label: "URL Extract", icon: Globe },
];

const STREAMING_TOKENS = [
  "primary: #BAFF29",
  "radius: 24px",
  "font: 'Monologue'",
  "gap: 40px",
  "shadow: brutalist",
  "grid: true",
  "npx vibro pull",
  "react: 19.x",
  "export: json",
  "layer: synthesis"
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [promptVal, setPromptVal] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);

  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    
    tl.from(".h-grid-main", { opacity: 0, scale: 1.05, duration: 2 })
      .from(".h-headline h1 span", { y: 150, opacity: 0, stagger: 0.2, duration: 1.5 }, "-=1.5")
      .from(".h-subheadline", { opacity: 0, y: 30, duration: 1.2 }, "-=1")
      .from(".h-protocol-box", { scale: 0.95, opacity: 0, y: 40, duration: 1.2 }, "-=0.8")
      .from(".h-cta", { opacity: 0, y: 20, stagger: 0.1, duration: 1.2 }, "-=0.6");

    // Streaming animation
    const streamTl = gsap.timeline({ repeat: -1 });
    STREAMING_TOKENS.forEach((token, i) => {
      streamTl.fromTo(`.stream-token-${i}`, 
        { y: 0, opacity: 0, x: -20 },
        { y: -100, opacity: 1, x: 20, duration: 4, ease: "none", delay: i * 0.4 },
        0
      );
    });

    // Pulse effect for hovering drop zone
    gsap.to(".h-grid-main", {
      opacity: isHoveringDrop ? 0.25 : 0.08,
      duration: 0.4,
      ease: "power2.out"
    });

  }, { scope: heroRef, dependencies: [isHoveringDrop] });

  const handleStartSynthesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptVal.trim() || isSynthesizing) return;
    setIsSynthesizing(true);
    setTimeout(() => setIsSynthesizing(false), 2400);
  };

  return (
    <section ref={heroRef} className="relative min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">
      
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Living Grid */}
        <div 
          className="h-grid-main absolute inset-0 transition-opacity duration-500" 
          style={{
            backgroundImage: `linear-gradient(to right, ${isHoveringDrop ? '#BAFF29' : 'rgba(255,255,255,0.1)'} 1px, transparent 1px), linear-gradient(to bottom, ${isHoveringDrop ? '#BAFF29' : 'rgba(255,255,255,0.1)'} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: 0.08
          }}
        />
        
        {/* Streaming Tokens (Blueprint Animation) */}
        <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center opacity-40">
           {STREAMING_TOKENS.map((token, i) => (
             <span 
               key={i} 
               className={`stream-token-${i} absolute font-mono text-[10px] uppercase tracking-widest text-[#BAFF29]/20 whitespace-nowrap`}
               style={{ 
                 left: `${15 + (i * 8)}%`, 
                 bottom: '10%',
                 transformOrigin: 'center'
               }}
             >
               {token}
             </span>
           ))}
        </div>

        {/* Ambient Radials */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] bg-[#BAFF29]/5 blur-[180px] rounded-full" />
      </div>

      <Navbar />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 w-full max-w-[1440px] px-8 flex flex-col items-center text-center">
        
        {/* Meta Badge */}
        <div className="h-cta mb-12 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] font-black uppercase tracking-[0.4em] text-[#BAFF29] shadow-[0_0_20px_rgba(186,255,41,0.1)]">
          <Binary className="w-4 h-4 animate-pulse" />
          Neural_Synthesis_Protocol::Active
        </div>

        {/* Headline */}
        <div className="h-headline mb-8 max-w-[1200px]">
          <h1 className="text-[clamp(50px,9vw,140px)] font-[1000] text-white leading-[0.82] uppercase tracking-[-0.07em]">
            <span className="block">Synthesize Design</span>
            <span className="block text-[#0a0a0b]" style={{ WebkitTextStroke: "2.5px white" }}>Systems. Not Just UI.</span>
          </h1>
        </div>

        {/* Sub-headline */}
        <p className="h-subheadline text-xl sm:text-2xl font-bold text-zinc-500 max-w-4xl mb-16 leading-relaxed">
          Stop building from scratch. Use the <span className="text-white">Visual Synthesis Protocol</span> to extract deep design intelligence from raw prompts or references and deploy them directly via CLI.
        </p>

        {/* ── THE CENTRALIZED PROTOCOL BOX ── */}
        <div className="h-protocol-box w-full max-w-4xl mb-16 relative">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
             {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-t-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                    ? "bg-[#BAFF29] text-[#0a0a0b] shadow-[0_-8px_20px_rgba(186,255,41,0.2)]" 
                    : "bg-white/5 text-zinc-500 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
             ))}
          </div>

          <div className="bg-[#0a0a0b] border-[4px] border-white/10 rounded-[2.5rem] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="bg-zinc-900/50 rounded-[2.2rem] grid lg:grid-cols-[1fr_0.6fr]">
              
              {/* Left: Input Area */}
              <div className="p-10 flex flex-col gap-8 border-r border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center">
                    <Terminal className="w-6 h-6 text-[#BAFF29]" />
                  </div>
                  <div className="flex flex-col items-start">
                     <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol::Vibro_Core</span>
                     <span className="text-[11px] font-bold text-white uppercase tracking-tighter italic">Waiting for instructions...</span>
                  </div>
                </div>

                <textarea 
                  value={promptVal}
                  onChange={(e) => setPromptVal(e.target.value)}
                  placeholder="EX: 'Create a brutalist dashboard for a healthcare startup with neon accents and high-density data grids'..."
                  className="w-full bg-transparent border-none outline-none font-black text-white placeholder:text-zinc-800 text-3xl tracking-[ -0.04em] uppercase resize-none h-32"
                />

                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-8">
                     <div className="flex flex-col items-start">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Synthesis_Mode</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#BAFF29]" />
                           <span className="text-[11px] font-bold text-white uppercase tracking-widest">Production</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-start">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Extracted_DNA</span>
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">None_Detected</span>
                     </div>
                   </div>
                </div>
              </div>

              {/* Right: Drop Zone */}
              <div 
                onMouseEnter={() => setIsHoveringDrop(true)}
                onMouseLeave={() => setIsHoveringDrop(false)}
                className={`relative flex flex-col items-center justify-center p-10 bg-black/40 transition-all cursor-pointer ${isHoveringDrop ? 'bg-[#BAFF29]/5' : ''}`}
              >
                 <div className={`w-full h-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 transition-all ${isHoveringDrop ? 'border-[#BAFF29] bg-[#BAFF29]/10' : 'border-white/10'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isHoveringDrop ? 'bg-[#BAFF29] rotate-180' : 'bg-white/5'}`}>
                       <UploadCloud className={`w-10 h-10 ${isHoveringDrop ? 'text-black' : 'text-zinc-600'}`} />
                    </div>
                    <div className="text-center">
                       <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-2 ${isHoveringDrop ? 'text-[#BAFF29]' : 'text-zinc-400'}`}>Visual_Reference</p>
                       <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic max-w-[120px]">Drop UI screenshot to extract DNA</p>
                    </div>
                 </div>
                 
                 {/* Visual Inference Glow */}
                 {isHoveringDrop && (
                    <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="absolute inset-x-0 -bottom-1 h-1 bg-[#BAFF29] shadow-[0_0_20px_#BAFF29]"
                    />
                 )}
              </div>

            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link 
            href="/dashboard"
            className="h-cta group bg-[#BAFF29] px-12 py-6 rounded-2xl font-black text-[#0a0a0b] uppercase tracking-widest text-sm flex items-center gap-4 transition-all hover:scale-[1.05] hover:shadow-[0_20px_40px_rgba(186,255,41,0.3)] active:scale-[0.98]"
          >
            Launch Synthesis Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button 
            className="h-cta group bg-transparent border-[3px] border-white px-12 py-6 rounded-2xl font-black text-white uppercase tracking-widest text-sm flex items-center gap-4 transition-all hover:bg-white hover:text-black"
          >
            View Protocol Docs
            <FileCode2 className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* ── METRIC BAR ── */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-black/60 backdrop-blur-xl py-6 px-12 hidden md:flex items-center justify-between">
         <div className="flex items-center gap-16">
            {[
               { label: "Active_Inference", val: "4.2ms" },
               { label: "System_Entropy", val: "0.0001%" },
               { label: "Design_Tokens_Synced", val: "1.2M+" }
            ].map(m => (
               <div key={m.label} className="flex flex-col items-start">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{m.label}</span>
                  <span className="text-lg font-[1000] text-white tracking-widest">{m.val}</span>
               </div>
            ))}
         </div>
         <div className="flex items-center gap-3 text-[#BAFF29]">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol_Pulse::Nominal</span>
         </div>
      </div>

    </section>
  );
}

function CheckIcon() {
   return (
      <svg className="w-4 h-4 text-[#BAFF29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
      </svg>
   );
}
