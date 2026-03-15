"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Draggable } from "gsap/dist/Draggable";
import { useGSAP } from "@gsap/react";
import CategoryCard from "@/components/CategoryCard";
import PromptCard from "@/components/PromptCard";
import type { Category, Prompt } from "@/lib/types";
import {
  ArrowUpRight,
  Cpu,
  Search,
  Layers,
  Sparkles,
  Code2,
  Zap,
  Globe,
  Github,
  Twitter,
  Linkedin,
  ShieldCheck,
  Terminal,
  Activity,
  Box
} from "lucide-react";
import GridBackground from "@/components/GridBackground";
import HeroLayout from "@/components/HeroLayout";
import Subheadline from "@/components/Subheadline";
import OverlayCard from "@/components/OverlayCard";
import CompilingBadge from "@/components/CompilingBadge";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const PixelBlast = dynamic(() => import("@/components/PixelBlast"), { ssr: false });
const DesignBot = dynamic(() => import("@/components/DesignBot"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Frontend Engineer",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&auto=format&fit=crop",
    text: "Vibro completely changed how we build UI. The visual tweaking combined with instant CLI access is a game-changer for speed.",
  },
  {
    name: "Sarah Chen",
    role: "Design Technologist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
    text: "No more manually copying and pasting messy CSS. You design it in the browser, generate a key, and pull the exact code you need.",
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop",
    text: "The glassmorphic components offered out-of-the-box are premium. It instantly elevated our MVP to look like a high-budget app.",
  },
];

const DUMMY_CATEGORIES: Category[] = [
  { id: "1", name: "Interfaces", slug: "interfaces", icon: "📊", description: "Analytical interfaces", count: 12 },
  { id: "2", name: "Marketing", slug: "marketing", icon: "🚀", description: "Landing pages", count: 8 },
  { id: "3", name: "Components", slug: "components", icon: "🧩", description: "Modular UI bits", count: 24 },
  { id: "4", name: "Mobile", slug: "mobile", icon: "📱", description: "Handheld logic", count: 15 },
  { id: "5", name: "Protocols", slug: "protocols", icon: "🔐", description: "System logic", count: 9 },
];

const DUMMY_FEATURED: Prompt[] = [
  { id: "1", title: "Glassmorphic Pro", slug: "glass", categoryId: "1", categorySlug: "interfaces", description: "Premium glass interface", promptText: "Create a glassmorphic interface with neural activity charts", previewImage: "https://images.unsplash.com/photo-1551288049-bbbda536639a?w=600&h=400&auto=format&fit=crop", tags: ["glass", "ui"], featured: true, createdAt: new Date().toISOString() },
  { id: "2", title: "Cyber Terminal", slug: "cyber", categoryId: "3", categorySlug: "components", description: "Neo-brutalist shell", promptText: "Build a neo-brutalist terminal interface for git operations", previewImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&auto=format&fit=crop", tags: ["terminal", "system"], featured: true, createdAt: new Date().toISOString() },
  { id: "3", title: "Liquid Motion", slug: "motion", categoryId: "2", categorySlug: "marketing", description: "Organic web flow", promptText: "Design an organic landing page with liquid transition effects", previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&auto=format&fit=crop", tags: ["web", "animation"], featured: true, createdAt: new Date().toISOString() },
  { id: "4", title: "Vanguard Auth", slug: "auth", categoryId: "5", categorySlug: "protocols", description: "Secure entry node", promptText: "Implement a secure biometric-style authentication protocol UI", previewImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&auto=format&fit=crop", tags: ["security", "ux"], featured: true, createdAt: new Date().toISOString() },
];

export default function HomeClient({ categories: initialCategories, featured: initialFeatured }: { categories: Category[], featured: Prompt[] }) {
  const categories = initialCategories.length > 0 ? initialCategories : DUMMY_CATEGORIES;
  const featured = initialFeatured.length > 0 ? initialFeatured : DUMMY_FEATURED;
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useGSAP(() => {
    // Hero Entrance
    const tl = gsap.timeline();
    tl.from(".hero-title", { y: 60, opacity: 0, duration: 0.9, ease: "power4.out" })
      .from(".hero-desc", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-btn", { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(2)" }, "-=0.4")
      .from(".hero-draggable", { scale: 0, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.5");

    // Draggable Elements logic
    if (typeof window !== "undefined") {
      const dragTargets = gsap.utils.toArray(".hero-draggable") as HTMLElement[];
      Draggable.create(dragTargets, {
        bounds: heroRef.current || undefined,
        inertia: true,
        type: "x,y",
        dragClickables: true,
        onDragStart: function () {
          gsap.to(this.target, { scale: 1.05, boxShadow: "15px 15px 40px rgba(0,0,0,0.15)", zIndex: 200, duration: 0.2 });
        },
        onDragEnd: function () {
          gsap.to(this.target, { scale: 1, boxShadow: "10px 10px 0 rgba(0,0,0,1)", zIndex: 100, duration: 0.2 });
        }
      });
    }

    // Floating animation
    gsap.to(".hero-draggable", {
      y: "random(-10, 10)",
      x: "random(-8, 8)",
      duration: "random(4, 6)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Scroll Staggers
    const animContainers = gsap.utils.toArray<HTMLElement>(".animate-container");
    animContainers.forEach((container) => {
      const children = container.querySelectorAll(".animate-item");
      if (children.length > 0) {
        gsap.fromTo(children,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // Individual Item Reveals
    const individualItems = gsap.utils.toArray<HTMLElement>(".animate-item:not(.animate-container .animate-item)");
    individualItems.forEach((item) => {
      const type = item.getAttribute("data-animation") || "fade-up";
      let fromVars: gsap.TweenVars = { opacity: 0 };

      switch (type) {
        case "fade-left": fromVars = { ...fromVars, x: -60 }; break;
        case "fade-right": fromVars = { ...fromVars, x: 60 }; break;
        case "scale-in": fromVars = { ...fromVars, scale: 0.8 }; break;
        case "fade-up":
        default: fromVars = { ...fromVars, y: 40 }; break;
      }

      gsap.fromTo(item,
        fromVars,
        {
          x: 0, y: 0, scale: 1, opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Counters
    const counters = gsap.utils.toArray<HTMLElement>(".counter-item");
    counters.forEach(counter => {
      const targetVal = parseFloat(counter.getAttribute("data-target") || "0");
      const suffix = counter.getAttribute("data-suffix") || "";
      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: { trigger: counter, start: "top 95%" },
        onUpdate: () => { counter.innerText = Math.ceil(obj.val).toLocaleString() + suffix; }
      });
    });

    // Parallax
    const parallaxEl = gsap.utils.toArray<HTMLElement>(".parallax-element");
    parallaxEl.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-speed") || "0.1");
      gsap.to(el, {
        y: speed * 300,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    setTimeout(() => ScrollTrigger.refresh(), 1000);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-[var(--color-dash-bg)] text-gray-900 selection:bg-[var(--color-dash-neon)]/40 overflow-x-hidden">

      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative z-10 min-h-screen pt-[180px] pb-[120px] flex flex-col items-center justify-center overflow-visible">

        <Navbar />
        <GridBackground />

        {/* ── Central AI Feed / Generator Engine ── */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl pointer-events-none">
          <svg className="absolute inset-0 w-full h-[600px] opacity-10" viewBox="0 0 1000 600">
            <path d="M500 300 L200 100" stroke="black" strokeWidth="2" strokeDasharray="8 8" />
            <path d="M500 300 L800 150" stroke="black" strokeWidth="2" strokeDasharray="8 8" />
            <path d="M500 300 L850 450" stroke="black" strokeWidth="2" strokeDasharray="8 8" />
          </svg>
        </div>

        {/* ── Floating Engine Assets (Draggables) ── */}
        <OverlayCard initialX={-620} initialY={-220} className="hero-draggable w-[320px] bg-white border-[4px] border-black rounded-[32px] shadow-[12px_12px_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-6 border-b-[2px] border-[#F3F3F3] pb-4">
            <div className="w-5 h-5 rounded-full bg-[#C6FF3D] border-[3px] border-black" />
            <span className="text-[16px] font-[900] font-poppins text-black uppercase tracking-[1.5px]">TOKEN_EXPLORER</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-[#F3F3F3] rounded-xl border-2 border-black flex items-center justify-center font-black text-[10px]">RAD: 32px</div>
            <div className="h-10 bg-[#C6FF3D] rounded-xl border-2 border-black flex items-center justify-center font-black text-[10px]">HEX: #C6FF3D</div>
          </div>
        </OverlayCard>

        <OverlayCard initialX={580} initialY={-300} rotation={2} className="hero-draggable w-[400px] bg-black border-[4px] border-[#3B5FFF] rounded-[32px] shadow-[12px_12px_0_rgba(59,95,255,0.3)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="ml-4 text-[12px] font-[800] font-poppins text-[#3B5FFF] uppercase tracking-widest">GENERATING_BUILD...</span>
          </div>
          <div className="font-mono text-[14px] leading-relaxed text-[#3B5FFF] opacity-80">
            <div className="flex gap-2"><span className="text-gray-600">1</span> <span>export default function <span className="text-white">Hero</span>() {"{"}</span></div>
            <div className="flex gap-2"><span className="text-gray-600">2</span> <span className="ml-4">return (</span></div>
            <div className="flex gap-2"><span className="text-gray-600">3</span> <span className="ml-8 text-[#C6FF3D]">&lt;div className="neon-glow" /&gt;</span></div>
            <div className="flex gap-2"><span className="text-gray-600">4</span> <span className="ml-4">)</span></div>
          </div>
        </OverlayCard>

        <OverlayCard initialX={560} initialY={320} className="hero-draggable w-[240px] rounded-3xl p-0 overflow-hidden bg-white border-[4px] border-black shadow-[12px_12px_0_rgba(0,0,0,1)]">
          <div className="bg-[#F3F3F3] border-b-[4px] border-black px-4 py-2 flex items-center justify-between font-black text-[10px] uppercase">Preview</div>
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="w-full h-12 bg-[#C6FF3D] border-[3px] border-black rounded-full flex items-center justify-center font-black text-sm">Button.tsx</div>
          </div>
        </OverlayCard>

        <CompilingBadge />
        <HeroLayout />

        {/* ── Central Prompt Input (The AI Brain) ── */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative mt-20 z-50 group"
        >
          <div className="flex items-center gap-4 bg-white border-[4px] border-black rounded-[2.5rem] px-8 py-5 shadow-[12px_12px_0_#000000] w-[700px] transition-all focus-within:shadow-[16px_16px_0_#C6FF3D]">
            <div className="w-12 h-12 bg-[#C6FF3D] rounded-2xl border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0_#000000]">
              <Cpu className="w-6 h-6 text-black" />
            </div>
            <input
              type="text"
              placeholder="Describe: 'Minimalist dashboard with dark glass cards'..."
              className="bg-transparent border-none outline-none text-[18px] font-poppins font-[700] w-full text-black placeholder:text-gray-400"
            />
            <button className="bg-black text-[#C6FF3D] p-3 rounded-2xl hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-6">
            <span className="text-[11px] font-black uppercase text-black/30 tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B5FFF]" /> CLI_READY
            </span>
            <span className="text-[11px] font-black uppercase text-black/30 tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C6FF3D]" /> REACT_NODE
            </span>
          </div>
        </motion.div>

        <div className="mt-20">
          <Subheadline />
        </div>
      </section>

      {/* ── 2. The Marquee Registry ─────────────────────────────────────── */}
      <section className="scroll-section border-y-[3px] border-black bg-white py-0 relative z-10 overflow-hidden">
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap py-12 items-center">
          {[1, 2, 3].map((group) => (
            <div key={group} className="flex items-center gap-14 px-7">
              <span className="text-[12px] font-black text-black/10 uppercase tracking-[0.8em] font-poppins">System_Sync_Protocol</span>
              <div className="flex items-center gap-4 bg-[#FAFAF8] border-[2.5px] border-black px-7 py-3 rounded-2xl shadow-[6px_6px_0_#000]">
                <Zap className="w-5 h-5 text-black" /> <span className="text-lg font-black font-poppins text-black uppercase tracking-tighter">NEXT.JS 15</span>
              </div>
              <div className="flex items-center gap-4 bg-[#C6FF3D] border-[2.5px] border-black px-7 py-3 rounded-2xl shadow-[6px_6px_0_#000]">
                <span className="text-lg font-black font-poppins text-black uppercase tracking-tighter">TAILWIND V4</span>
              </div>
              <div className="flex items-center gap-4 bg-white border-[2.5px] border-black px-7 py-3 rounded-2xl shadow-[6px_6px_0_#000]">
                <Sparkles className="w-5 h-5 text-black" /> <span className="text-lg font-black font-poppins text-black uppercase tracking-tighter">AI AGENTIC</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. The Architecture Gap (Comparison Section) ─────────────────── */}
      <section className="scroll-section py-32 sm:py-56 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-item text-center mb-24">
            <div className="inline-flex items-center gap-3 bg-red-50 text-red-600 px-6 py-2 rounded-full border-[2px] border-red-100 font-black text-[11px] uppercase tracking-widest mb-6 shadow-[4px_4px_0_#fee2e2]">
              Efficiency Analysis
            </div>
            <h2 className="text-6xl sm:text-8xl font-[1000] text-black tracking-[-0.05em] leading-[0.85] uppercase mb-10">The Death of <br /> <span className="text-white [-webkit-text-stroke:2x_black]">Static Design.</span></h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            {/* Legacy Way */}
            <div className="animate-item bg-[#FBFBFA] border-[3.5px] border-black rounded-[3rem] p-12 relative overflow-hidden group shadow-[15px_15px_0_rgba(0,0,0,0.03)]" data-animation="fade-left">
              <div className="absolute top-0 right-0 p-6 opacity-10 font-black text-6xl">01</div>
              <div className="mb-12">
                <h3 className="text-3xl font-black text-black uppercase mb-4 tracking-tighter">Legacy workflow</h3>
                <p className="text-zinc-400 font-bold italic leading-relaxed">"Manual translation from Figma to Code is a high-latency bottleneck."</p>
              </div>
              <div className="space-y-6 opacity-40 blur-[1px]">
                <div className="h-14 w-full bg-white border-[2px] border-black/10 rounded-2xl flex items-center px-6 text-xs font-bold text-zinc-400">Copy-pasting Hex Codes...</div>
                <div className="h-14 w-full bg-white border-[2px] border-black/10 rounded-2xl flex items-center px-6 text-xs font-bold text-zinc-400">Fixing responsive bugs...</div>
                <div className="h-14 w-full bg-white border-[2px] border-black/10 rounded-2xl flex items-center px-6 text-xs font-bold text-zinc-400">Adjusting padding values...</div>
              </div>
              <div className="mt-16 pt-8 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-black text-red-500 uppercase">Process: ~12 Hours</span>
                <ShieldCheck className="w-6 h-6 text-red-200" />
              </div>
            </div>

            {/* Vibro Way */}
            <div className="animate-item bg-white border-[4px] border-black rounded-[3rem] p-12 relative overflow-hidden group shadow-[20px_20px_0_#C6FF3D]" data-animation="fade-right">
              <div className="absolute top-0 right-0 p-6 opacity-20 font-black text-6xl">02</div>
              <div className="mb-12">
                <h3 className="text-3xl font-black text-black uppercase mb-4 tracking-tighter">Neural Synthesis</h3>
                <p className="text-[#8fcc00] font-bold italic leading-relaxed">"Direct architectural extraction from human intent to React nodes."</p>
              </div>
              <div className="space-y-6">
                <div className="h-14 w-full bg-[#FAFAF8] border-[3px] border-black rounded-2xl flex items-center px-6 text-xs font-black text-black">
                  <Zap className="w-4 h-4 mr-3 text-[#C6FF3D]" /> Instant Token Mapping
                </div>
                <div className="h-14 w-full bg-[#FAFAF8] border-[3px] border-black rounded-2xl flex items-center px-6 text-xs font-black text-black">
                  <Zap className="w-4 h-4 mr-3 text-[#C6FF3D]" /> Algorithmic Layout Synthesis
                </div>
                <div className="h-14 w-full bg-black text-white border-[3px] border-black rounded-2xl flex items-center px-6 text-xs font-black">
                  <Code2 className="w-4 h-4 mr-3 text-[#C6FF3D]" /> Direct Terminal Pull
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-black text-[#8fcc00] uppercase">Process: ~400ms</span>
                <Zap className="w-6 h-6 text-[#C6FF3D] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Feature: Ask & Analyze (DesignBot) ───────────────────────── */}
      <section className="scroll-section py-32 sm:py-56 relative z-10 overflow-hidden bg-[#FAFAF8] border-y-[3.5px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-item" data-animation="fade-left">
              <div className="mb-10 inline-flex items-center gap-4 bg-black px-6 py-2 rounded-2xl shadow-[6px_6px_0_#C6FF3D]">
                <Activity className="w-5 h-5 text-[#C6FF3D]" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C6FF3D]">Engine_Core_v2.4</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-[1000] mb-10 text-black tracking-[-0.04em] uppercase leading-none">Imagine. <br /><span className="text-white [-webkit-text-stroke:2px_black]">Synthesized.</span></h2>
              <p className="text-xl font-bold text-zinc-500 leading-relaxed mb-14 italic max-w-xl">"Vibro translates abstract logic into production-grade React architectures through deep neural mapping."</p>

              <div className="animate-container grid gap-6">
                {[
                  { title: "Neuro-Mapping", text: "Translating words into precise UI components.", color: "bg-blue-50/50" },
                  { title: "Sovereign Build", text: "Zero dependencies. Pure, high-performance React.", color: "bg-zinc-50" },
                  { title: "Instant Hydration", text: "Ready for deployment on any modern stack.", color: "bg-[#C6FF3D]/5" }
                ].map((item, i) => (
                  <div key={i} className={`animate-item flex items-center justify-between p-7 rounded-[2.5rem] border-[3px] border-black ${item.color} shadow-[8px_8px_0_#000] hover:-translate-y-1 transition-all group`}>
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-black uppercase tracking-tighter mb-1.5">{item.title}</h4>
                      <p className="text-sm font-bold text-zinc-400 italic">" {item.text} "</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-item relative" data-animation="fade-right">
              <div className="relative z-10 rounded-[4rem] border-[4px] border-black bg-white p-6 shadow-[30px_30px_0_rgba(198,255,61,0.2)]">
                <DesignBot />
              </div>
              <div className="parallax-element absolute -top-16 -right-16 w-56 h-56 bg-[#C6FF3D]/10 blur-[120px] rounded-full -z-10" data-speed="0.15" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. High-Velocity Grid (Universal Library) ────────────────────── */}
      <section className="scroll-section py-32 sm:py-56 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 animate-item">
            <div className="max-w-3xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-xl border-[2.5px] border-black bg-black px-6 py-2 shadow-[6px_6px_0_#C6FF3D]">
                <Box className="w-4 h-4 text-[#C6FF3D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6FF3D]">Central_Lattice</span>
              </div>
              <h2 className="text-6xl sm:text-8xl font-[1000] tracking-[-0.05em] text-black leading-[0.85] uppercase mb-10">Verified <br /><span className="text-white [-webkit-text-stroke:2px_black]">Nodes.</span></h2>
            </div>
            <Link href="/dashboard" className="group relative flex items-center gap-5 rounded-3xl border-[3.5px] border-black bg-[#C6FF3D] px-10 py-5 text-lg font-black text-black shadow-[10px_10px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[14px_14px_0_#000] uppercase tracking-widest">
              Explore The Library
            </Link>
          </div>

          <div className="animate-container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((prompt, idx) => (
              <div key={prompt.id} className="animate-item" data-animation="zoom-out">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Global Ecosystem (Integrations) ─────────────────────────── */}
      <section className="scroll-section py-32 bg-black relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-item text-center mb-24">
            <h2 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter mb-8 italic">Universal <br /> <span className="text-[#C6FF3D] [-webkit-text-stroke:2px_white]">Protocol.</span></h2>
            <p className="text-zinc-500 font-bold max-w-xl mx-auto text-lg italic">"Vibro connects natively to any modern IDE and deployment target."</p>
          </div>

          <div className="animate-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: 'Cursor', icon: '🤖', color: 'bg-zinc-900 border-white/5' },
              { name: 'VS Code', icon: '💻', color: 'bg-zinc-900 border-white/5' },
              { name: 'Vercel', icon: '▲', color: 'bg-zinc-900 border-white/5' },
              { name: 'GitHub', icon: '🐙', color: 'bg-zinc-900 border-white/5' },
              { name: 'Next.js', icon: 'N', color: 'bg-zinc-900 border-white/5' },
              { name: 'CLI', icon: '❯', color: 'bg-white border-black shadow-[6px_6px_0_#C6FF3D]' }
            ].map((item, i) => (
              <div key={i} className={`animate-item flex flex-col items-center justify-center p-8 rounded-[2rem] border-[2px] ${item.color} group hover:-translate-y-2 transition-all`}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${item.name === 'CLI' ? 'text-black' : 'text-zinc-500'}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Pricing Matrix ───────────────────────────────────────────── */}
      <section className="scroll-section py-40 sm:py-56 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            <div className="animate-item" data-animation="fade-left">
              <h2 className="text-6xl sm:text-8xl font-[1000] text-black tracking-[-0.05em] leading-[0.85] uppercase mb-10">Ship the <br /> <span className="text-white [-webkit-text-stroke:2px_black]">Unfair.</span></h2>
              <p className="text-xl font-bold text-zinc-400 italic max-w-lg leading-relaxed mb-12">"Unlock the entire ecosystem of premium components. Pay once, architect forever."</p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-[3px] border-white bg-zinc-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-black text-black uppercase tracking-widest">+12k SHIPPING NOW</span>
              </div>
            </div>

            <div className="animate-container grid gap-8">
              {/* Pro Plan */}
              <div className="animate-item bg-white text-black border-[4px] border-black rounded-[3rem] p-12 shadow-[15px_15px_0_#C6FF3D] relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-black text-[#C6FF3D] px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">Lifetime Deal</div>
                <div className="flex items-end gap-3 mb-10">
                  <div className="text-6xl font-black tracking-tighter">$149</div>
                  <div className="text-xl text-zinc-300 font-bold line-through italic mb-2">$499</div>
                </div>
                <ul className="space-y-4 mb-12 font-black text-sm uppercase italic">
                  <li className="flex items-center gap-4"><Zap className="w-5 h-5 text-[#C6FF3D] fill-[#C6FF3D]" /> All Premium Components</li>
                  <li className="flex items-center gap-4"><Zap className="w-5 h-5 text-[#C6FF3D] fill-[#C6FF3D]" /> Priority Neural Synthesis</li>
                  <li className="flex items-center gap-4"><Zap className="w-5 h-5 text-[#C6FF3D] fill-[#C6FF3D]" /> Private Discord Hub</li>
                </ul>
                <button className="w-full py-6 rounded-2xl bg-black text-[#C6FF3D] font-black text-lg transition-all hover:scale-[1.02] shadow-[8px_8px_0_#C6FF3D]">GET THE VAULT</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Final Synthesis CTA ────────────────────────────────────────── */}
      <section className="scroll-section py-32 bg-black relative z-10 overflow-hidden border-t-4 border-black">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="parallax-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#C6FF3D]/10 blur-[200px] rounded-full" data-speed="-0.1" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center z-10">
          <div className="animate-item mb-12" data-animation="fade-up">
            <h2 className="text-6xl sm:text-9xl font-[1000] text-white uppercase tracking-tighter leading-none mb-10 italic">
              Ship <br /> <span className="text-[#C6FF3D] [-webkit-text-stroke:2px_white]">Beyond.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <button className="bg-[#C6FF3D] border-[4px] border-black text-black font-[900] text-xl px-14 py-7 rounded-[2rem] shadow-[10px_10px_0_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest">Enter Synthesis</button>
              <button className="border-[4px] border-white bg-transparent text-white font-[900] text-xl px-14 py-7 rounded-[2rem] hover:bg-white hover:text-black transition-all uppercase tracking-widest">Explore Archive</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. The Ultra-Footer ───────────────────────────────────────────── */}
      <footer className="relative bg-white border-t-[5px] border-black pt-24 pb-12 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            {/* Brand Slot */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0_#C6FF3D]">
                  <Activity className="w-5 h-5 text-[#C6FF3D]" />
                </div>
                <span className="text-3xl font-[1000] text-black tracking-tighter uppercase">Vibro</span>
              </div>
              <p className="text-zinc-400 font-bold leading-relaxed italic mb-10 max-w-xs">
                "The unified protocol for architectural synthesis. Design once, ship instantly to any modern stack."
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 rounded-xl bg-[#FBFBFA] border-[2.5px] border-black flex items-center justify-center hover:bg-[#C6FF3D] transition-colors shadow-[4px_4px_0_#000]">
                    <Icon className="w-5 h-5 text-black" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link Groups */}
            {[
              { title: 'Engine', links: ['Synthesis', 'Archive', 'Workstation', 'Components'] },
              { title: 'Ecosystem', links: ['Documentation', 'CLI Tools', 'Integrations', 'GitHub Hub'] },
              { title: 'Identity', links: ['Privacy Protocol', 'Service TOS', 'Security', 'Company'] }
            ].map((group, i) => (
              <div key={i}>
                <h4 className="text-[12px] font-black uppercase text-black tracking-[0.3em] mb-10 italic"># {group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-zinc-500 font-bold hover:text-black transition-colors text-[15px] italic">" {link} "</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* System Status / Meta */}
          <div className="pt-12 border-t-[3px] border-black flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8fcc00] animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8fcc00]">System: Nominal</span>
              </div>
              <div className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Ver: 4.2.0-stable</div>
            </div>

            <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
              © 2026 VIBRO_SYNTHESIS_CORP. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
