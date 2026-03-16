"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PromptCard from "@/components/PromptCard";
import type { Category, Prompt } from "@/lib/types";
import {
  Code2, Zap, Github, Twitter, Linkedin,
  ShieldCheck, Activity, Box, ArrowUpRight, Check,
  Terminal, Globe, Cpu, Network, ArrowRight,
  TrendingUp, Layers, Command
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DashboardPreviewSection from "@/components/DashboardPreviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const DesignBot = dynamic(() => import("@/components/DesignBot"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DUMMY_FEATURED: Prompt[] = [
  { id: "1", title: "Glassmorphic Pro", slug: "glass", categoryId: "1", categorySlug: "interfaces", description: "Premium glass interface", promptText: "Create a glassmorphic interface with neural activity charts", previewImage: "https://images.unsplash.com/photo-1551288049-bbbda536639a?w=600&h=400&auto=format&fit=crop", tags: ["glass", "ui"], featured: true, createdAt: new Date().toISOString() },
  { id: "2", title: "Cyber Terminal", slug: "cyber", categoryId: "3", categorySlug: "components", description: "Neo-brutalist shell", promptText: "Build a neo-brutalist terminal interface for git operations", previewImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&auto=format&fit=crop", tags: ["terminal", "system"], featured: true, createdAt: new Date().toISOString() },
  { id: "3", title: "Liquid Motion", slug: "motion", categoryId: "2", categorySlug: "marketing", description: "Organic web flow", promptText: "Design an organic landing page with liquid transition effects", previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&auto=format&fit=crop", tags: ["web", "animation"], featured: true, createdAt: new Date().toISOString() },
  { id: "4", title: "Vanguard Auth", slug: "auth", categoryId: "5", categorySlug: "protocols", description: "Secure entry node", promptText: "Implement a secure biometric-style authentication protocol UI", previewImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&auto=format&fit=crop", tags: ["security", "ux"], featured: true, createdAt: new Date().toISOString() },
];

export default function HomeClient({ categories: _categories, featured: initialFeatured }: { categories: Category[], featured: Prompt[] }) {
  const featured = initialFeatured.length > 0 ? initialFeatured : DUMMY_FEATURED;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Generic scroll reveals
    const items = gsap.utils.toArray<HTMLElement>(".sc-reveal");
    items.forEach((el) => {
      const dir = el.getAttribute("data-dir") || "up";
      const fromVars: gsap.TweenVars =
        dir === "left" ? { x: -60, opacity: 0 }
        : dir === "right" ? { x: 60, opacity: 0 }
        : dir === "scale" ? { scale: 0.88, opacity: 0 }
        : { y: 50, opacity: 0 };

      gsap.fromTo(el, fromVars, {
        x: 0, y: 0, scale: 1, opacity: 1,
        duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    });

    gsap.to(".sc-grid-fade", {
       opacity: 0,
       scrollTrigger: {
          trigger: ".sc-grid-fade",
          start: "top top",
          end: "bottom top",
          scrub: true
       }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-[#0a0a0b]">

      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. SYSTEM PROTOCOL MARQUEE ────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#0a0a0b] py-0 relative z-10 overflow-hidden">
        <div className="flex animate-[marquee_50s_linear_infinite] whitespace-nowrap py-10 items-center">
          {[1, 2, 3].map((g) => (
            <div key={g} className="flex items-center gap-16 px-8">
              <span className="text-[9px] font-black text-white/5 uppercase tracking-[1em]">Architecture_Sync</span>
              {[
                { label: "React 19.x",  icon: <Cpu className="w-4 h-4" /> },
                { label: "Design Tokens", icon: <Layers className="w-4 h-4" /> },
                { label: "CLI-Powered", icon: <Terminal className="w-4 h-4" /> },
                { label: "Tailwind v4", icon: <Code2 className="w-4 h-4" /> },
                { label: "AI Inference", icon: <Activity className="w-4 h-4" /> },
                { label: "Multimodal", icon: <Globe className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3 border border-white/10 bg-white/5 rounded-full">
                  <span className="text-[#BAFF29]">{item.icon}</span>
                  <span className="text-sm font-black text-white uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── 3.5 DASHBOARD PREVIEW ────────────────────────────────────────── */}
      <DashboardPreviewSection />

      {/* ── 4. DEEP INFERENCE (Section 3 Redesign) ─────────────────────────── */}
      <section className="py-40 bg-[#0a0a0b] relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="sc-reveal text-center mb-32">
            <div className="inline-flex items-center gap-3 bg-[#BAFF29] text-[#0a0a0b] px-6 py-2 font-black text-[10px] uppercase tracking-[0.4em] mb-10 shadow-[0_0_40px_rgba(186,255,41,0.2)]">
              ◈ Deep Inference Node
            </div>
            <h2 className="text-6xl sm:text-[10rem] font-[1000] text-white tracking-[-0.07em] leading-[0.8] uppercase mb-12 italic">
              Atomic <br /><span className="text-[#0a0a0b]" style={{ WebkitTextStroke: "3px white" }}>Consistency.</span>
            </h2>
            <p className="text-xl font-bold text-zinc-500 max-w-2xl mx-auto italic">
               Vibro synthesizes fragmented components into a unified structural DNA, ensuring perfect implementation across every platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            {/* Legacy (Left) */}
            <div className="sc-reveal bg-[#0a0a0b] p-16 relative" data-dir="left">
               <div className="flex flex-col gap-10">
                  <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black text-zinc-500 uppercase tracking-tighter">Fragmented UI</h3>
                     <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest">Legacy_Mode</span>
                  </div>
                  
                  {/* Basic Wireframe UI */}
                  <div className="flex flex-col gap-6 opacity-30 grayscale pointer-events-none">
                     <div className="h-12 w-full bg-white/5 rounded-lg border border-white/10" />
                     <div className="flex gap-4">
                        <div className="h-40 flex-1 bg-white/5 rounded-lg border border-white/10" />
                        <div className="h-40 flex-1 bg-white/5 rounded-lg border border-white/10" />
                     </div>
                     <div className="h-32 w-full bg-white/5 rounded-lg border border-white/10" />
                  </div>

                  <div className="pt-10 border-t border-white/5">
                     <p className="text-red-500/60 font-mono text-[9px] uppercase leading-relaxed font-black">
                        [ERROR] TOKEN_DRIFT DETECTED <br />
                        [ERROR] ARCHITECTURAL_ORPHANS: 124 <br />
                        [ERROR] SYNC_LATENCY: HIGH
                     </p>
                  </div>
               </div>
            </div>

            {/* Vibro (Right) */}
            <div className="sc-reveal bg-[#0e0e0f] p-16 relative group" data-dir="right">
               {/* Interconnected glowing lines decoration */}
               <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                     <path d="M50,100 L350,100 M200,100 L200,300" stroke="#BAFF29" strokeWidth="0.5" fill="none" className="animate-[pulse_4s_infinite]" />
                     <circle cx="200" cy="100" r="3" fill="#BAFF29" />
                  </svg>
               </div>

               <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Vibro System</h3>
                     <span className="bg-[#BAFF29] text-black px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest">Atomic_Consistency</span>
                  </div>
                  
                  {/* Intelligent Grid UI */}
                  <div className="flex flex-col gap-6 scale-105">
                     <div className="h-12 w-full bg-white/5 rounded-xl border-2 border-[#BAFF29]/40 shadow-[0_0_30px_rgba(186,255,41,0.1)] relative">
                        <div className="absolute -top-2 -left-2 w-4 h-4 border border-[#BAFF29] bg-[#0a0a0b]" />
                     </div>
                     <div className="flex gap-4">
                        <div className="h-40 flex-1 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
                           <div className="absolute top-4 left-4 flex gap-1">
                              {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-[#BAFF29]" />)}
                           </div>
                        </div>
                        <div className="h-40 flex-1 bg-white/5 rounded-xl border border-white/10" />
                     </div>
                     <div className="h-32 w-full bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col justify-end">
                         <div className="h-1.5 w-1/2 bg-[#BAFF29] rounded-full" />
                     </div>
                  </div>

                  <div className="pt-10 border-t border-[#BAFF29]/20">
                     <p className="text-[#BAFF29] font-mono text-[9px] uppercase leading-relaxed font-black">
                        [SUCCESS] STRUCTURAL_BONDING::COMPLETE <br />
                        [SUCCESS] AGENTIC_SYNTHESIS::VERIFIED <br />
                        [SUCCESS] SYSTEM_LATENCY: 4.2ms
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. MANIFESTO & SOCIAL PROOF (Section 4 Redesign) ────────────────── */}
      <ManifestoSection />

      {/* ── 6. DESIGN BOT ───────────────────────────────────────────────── */}
      <section className="py-40 relative z-10 overflow-hidden bg-black border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="sc-reveal" data-dir="left">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 mb-10">
                <Activity className="w-4 h-4 text-[#BAFF29]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Neural_Extraction_v0.8</span>
              </div>
              <h2 className="text-5xl sm:text-[8rem] font-[1000] mb-12 text-white tracking-[-0.06em] uppercase leading-[0.85]">
                DNA <br /><span className="text-[#BAFF29]">Synthesized.</span>
              </h2>
              <p className="text-xl font-bold text-zinc-500 leading-relaxed mb-16 italic max-w-xl">
                 Vibro isolates the core visual DNA of your product, translating raw intent into high-performance structural code.
              </p>
              <div className="sc-stagger-group space-y-6">
                {[
                  { title: "Neuro-Mapping", text: "Autonomous translation of intent to tokenized UI architectures." },
                  { title: "Universal Ship", text: "Single protocol deployment to React, Next.js, and CSS-in-JS." },
                ].map((item, i) => (
                  <div key={i} className="sc-stagger-item flex items-center gap-8 p-10 border border-white/10 bg-[#0e0e0f] group cursor-pointer hover:border-[#BAFF29] transition-all">
                    <div className="w-14 h-14 bg-[#BAFF29]/5 border border-[#BAFF29]/20 flex items-center justify-center shrink-0 font-black text-lg text-[#BAFF29]">0{i + 1}</div>
                    <div>
                      <h4 className="text-md font-black text-white uppercase tracking-widest">{item.title}</h4>
                      <p className="text-zinc-500 text-sm font-bold italic mt-1">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sc-reveal relative" data-dir="right">
              <div className="border-[4px] border-white/10 bg-[#0a0a0b] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden">
                <DesignBot />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. COMPONENT MASONRY (Section 4 Continued) ─────────────────────────── */}
      <section className="py-40 bg-[#0a0a0b] relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-32 sc-reveal">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 mb-8">
                <Box className="w-4 h-4 text-[#BAFF29]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Central_Lattice</span>
              </div>
              <h2 className="text-6xl sm:text-[10rem] font-[1000] tracking-[-0.07em] text-white leading-[0.82] uppercase italic">
                Verified <br /><span className="text-[#0a0a0b]" style={{ WebkitTextStroke: "2.5px white" }}>Syntheses.</span>
              </h2>
            </div>
            <Link href="/dashboard/library" className="mt-12 lg:mt-0 flex items-center gap-6 bg-[#BAFF29] px-12 py-6 font-black text-[#0a0a0b] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(186,255,41,0.2)] hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(186,255,41,0.3)] transition-all group">
              Explore Library <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <div className="sc-stagger-group grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((prompt) => (
              <div key={prompt.id} className="sc-stagger-item group cursor-pointer">
                 <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/10 group-hover:border-[#BAFF29]/40 transition-all rounded-[1.5rem]">
                    <img src={prompt.previewImage} alt={prompt.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BAFF29] block mb-2">{prompt.categorySlug}</span>
                       <h4 className="text-xl font-black text-white uppercase tracking-tighter">{prompt.title}</h4>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA & SHIP ACTION (Section 5 Redesign) ───────────────────── */}
      <section className="py-40 bg-black relative z-10 overflow-hidden border-t-2 border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#BAFF29]/5 blur-[250px] rounded-full pointer-events-none animate-[pulse_8s_infinite]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative text-center z-10">
          <div className="sc-reveal mb-20 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-3 border border-[#ffffff10] text-zinc-500 px-6 py-2 text-[10px] font-black uppercase tracking-[0.5em] mb-14">
              ◈ INITIALIZE_SHIPMENT
            </div>
            <h2 className="text-7xl sm:text-[12rem] font-[1000] text-white uppercase tracking-[-0.08em] leading-[0.78] italic mb-16 px-4">
              Deploy <br /><span className="text-[#0a0a0b]" style={{ WebkitTextStroke: "4px white" }}>Instantly.</span>
            </h2>
          </div>

          <div className="sc-reveal flex flex-col lg:flex-row items-stretch justify-center gap-8 mb-20">
             {/* Terminal block */}
             <div className="flex-1 bg-black border-[3px] border-white/10 p-10 rounded-[2.5rem] text-left relative overflow-hidden group hover:border-[#BAFF29]/40 transition-all">
                <div className="flex items-center gap-2 mb-8">
                   <Terminal className="w-5 h-5 text-[#BAFF29]" />
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol::CLI_Pull</span>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 font-mono text-sm sm:text-lg flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <span className="text-[#BAFF29]">❯</span>
                      <code className="text-white">npx vibro-cli pull --protocol_id=sync_core</code>
                   </div>
                   <Command className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                {/* Micro decorative pulse */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#BAFF29]/5 blur-[60px] rounded-full -z-10" />
             </div>

             {/* Main Button */}
             <Link 
               href="/dashboard"
               className="lg:w-72 bg-[#BAFF29] rounded-[2.5rem] flex flex-col items-center justify-center p-10 shadow-[0_20px_50px_rgba(186,255,41,0.2)] hover:scale-[1.02] hover:shadow-[0_30px_70px_rgba(186,255,41,0.3)] transition-all group"
             >
                <Cpu className="w-12 h-12 text-black mb-6 animate-spin-slow" />
                <span className="text-2xl font-black text-black uppercase tracking-tighter">Synthesize</span>
             </Link>
          </div>

          <p className="sc-reveal text-zinc-600 font-bold italic text-lg max-w-2xl mx-auto">
             &ldquo;Unified architectural synthesis for technical stakeholders. Zero dependencies. Total control.&rdquo;
          </p>
        </div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-[#0a0a0b] border-t border-white/5 pt-32 pb-16 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-2">
                  <img src="/logo.png" alt="Vibro Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-4xl font-[1000] text-white uppercase tracking-tighter">Vibro</span>
              </div>
              <p className="text-zinc-650 font-bold italic leading-relaxed mb-10 max-w-xs text-sm">
                 The world's first agentic architecture engine. Design once, ship instantly to any technical destination.
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#BAFF29] hover:text-black transition-all group">
                    <Icon className="w-5 h-5 text-white group-hover:text-black" />
                  </Link>
                ))}
              </div>
            </div>

            {[
              { title: "Protocol", links: [["Synthesis", "/dashboard"], ["Library", "/dashboard/library"], ["Studio", "/dashboard/studio"]] },
              { title: "Ecosystem", links: [["CLI Tools", "#"], ["Integrations", "#"], ["GitHub Hub", "#"]] },
              { title: "Corporation", links: [["Pricing", "#"], ["Settings", "/dashboard/settings"], ["Privacy", "#"]] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10"># {group.title}</h4>
                <ul className="space-y-6">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-zinc-500 font-bold hover:text-[#BAFF29] transition-all text-sm italic hover:pl-2">
                         &ldquo;{label}&rdquo;
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-12">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#BAFF29] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#BAFF29]/60">Protocol::Live</span>
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 VIBRO_SYNTHESIS_CORP</span>
            </div>
            <div className="flex items-center gap-8">
               <Network className="w-5 h-5 text-white/10" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">V4.2.0-STABLE</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
