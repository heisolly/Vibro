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
  {
    name: "Priya Patel",
    role: "Fullstack Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop",
    text: "I was skeptical, but the Next.js integration is flawless. It drops the component right where I need it, with zero friction.",
  },
  {
    name: "David Kim",
    role: "UI/UX Lead",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop",
    text: "As a designer who codes, this bridges the gap perfectly. I can hand off a Vibro ID instead of a static Figma file.",
  },
  {
    name: "Emily Carter",
    role: "Freelance Dev",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop",
    text: "Clients constantly ask for 'modern' vibes. Vibro delivers exactly that. It's my secret weapon for rapid, beautiful prototyping.",
  },
];

const DUMMY_CATEGORIES: Category[] = [
  { id: "1", name: "Dashboards", slug: "dashboards", icon: "📊", description: "Analytical interfaces", count: 12 },
  { id: "2", name: "Marketing", slug: "marketing", icon: "🚀", description: "Lending pages", count: 8 },
  { id: "3", name: "Components", slug: "components", icon: "🧩", description: "Modular UI bits", count: 24 },
  { id: "4", name: "Mobile", slug: "mobile", icon: "📱", description: "Handheld logic", count: 15 },
  { id: "5", name: "Protocols", slug: "protocols", icon: "🔐", description: "System logic", count: 9 },
];

const DUMMY_FEATURED: Prompt[] = [
  { id: "1", title: "Glassmorphic Pro", slug: "glass", categoryId: "1", categorySlug: "dashboards", description: "Premium glass dashboard", promptText: "Create a glassmorphic dashboard with neural activity charts", previewImage: "https://images.unsplash.com/photo-1551288049-bbbda536639a?w=600&h=400&auto=format&fit=crop", tags: ["glass", "ui"], featured: true, createdAt: new Date().toISOString() },
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

    // Draggable Elements
    if (typeof window !== "undefined") {
      const dragTargets = gsap.utils.toArray(".hero-draggable") as HTMLElement[];
      Draggable.create(dragTargets, {
        bounds: heroRef.current || undefined,
        inertia: true,
        type: "x,y",
        dragClickables: true, // Ensures text and spans don't block dragging
        onDragStart: function() {
          gsap.to(this.target, { 
            scale: 1.05, 
            boxShadow: "15px 15px 40px rgba(0,0,0,0.15)", 
            zIndex: 200, // Bring to front while dragging
            duration: 0.2 
          });
        },
        onDragEnd: function() {
          gsap.to(this.target, { 
            scale: 1, 
            boxShadow: "10px 10px 0 rgba(0,0,0,1)", // Snap back to neo-brutalist shadow
            zIndex: 100, 
            duration: 0.2 
          });
        }
      });
    }

    // Initial subtle float for elements
    gsap.to(".hero-draggable", {
      y: "random(-10, 10)",
      x: "random(-8, 8)",
      duration: "random(4, 6)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // ── Global Advanced Scroll Animations ─────────

    // 1. Container-based staggered reveals
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

    // 2. Individual Item Animations with direction support
    const individualItems = gsap.utils.toArray<HTMLElement>(".animate-item:not(.animate-container .animate-item)");
    individualItems.forEach((item) => {
      const type = item.getAttribute("data-animation") || "fade-up";
      let fromVars: gsap.TweenVars = { opacity: 0 };
      
      switch(type) {
        case "fade-left": fromVars = { ...fromVars, x: -60 }; break;
        case "fade-right": fromVars = { ...fromVars, x: 60 }; break;
        case "scale-in": fromVars = { ...fromVars, scale: 0.8 }; break;
        case "fade-up": 
        default: fromVars = { ...fromVars, y: 40 }; break;
      }

      gsap.fromTo(item, 
        fromVars,
        {
          x: 0, y: 0, scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // 3. Counter Animation for Metrics
    const counters = gsap.utils.toArray<HTMLElement>(".counter-item");
    counters.forEach(counter => {
      const targetValueStr = counter.getAttribute("data-target") || "0";
      const targetVal = parseFloat(targetValueStr);
      const isDecimal = targetValueStr.includes(".");
      const suffix = counter.getAttribute("data-suffix") || "";
      const prefix = counter.getAttribute("data-prefix") || "";
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: targetVal,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          counter.innerText = prefix + (isDecimal ? obj.val.toFixed(1) : Math.ceil(obj.val).toLocaleString()) + suffix;
        }
      });
    });

    // 4. Parallax Background Elements
    const parallaxEl = gsap.utils.toArray<HTMLElement>(".parallax-element");
    parallaxEl.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-speed") || "0.1");
      gsap.to(el, {
        y: speed * 300,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Delayed refresh to handle layout stability
    setTimeout(() => ScrollTrigger.refresh(), 1000);
  }, { scope: containerRef });

  // Separate effect for dynamic grid blocks to avoid hydration/hook issues
  useEffect(() => {
    if (!hasMounted) return;
    
    const blocks = gsap.utils.toArray<HTMLElement>(".grid-reveal-block");
    const ctx = gsap.context(() => {
      blocks.forEach((block) => {
        const pulse = () => {
          gsap.to(block, {
            opacity: gsap.utils.random(0.1, 0.4),
            duration: gsap.utils.random(1.5, 3),
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(block, {
                opacity: 0,
                duration: gsap.utils.random(2, 4),
                ease: "power2.inOut",
                delay: gsap.utils.random(0.5, 2),
                onComplete: pulse
              });
            }
          });
        };
        setTimeout(pulse, gsap.utils.random(0, 3000));
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasMounted]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#F3F2EE] text-gray-900 selection:bg-[#b8f724]/40">

      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-[#0A0A0A]">
        
        {/* PixelBlast + Grid Hybrid Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           {/* Reintroduced Lime Green PixelBlast */}
           <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.15]">
            <PixelBlast
              color="#b8f724"
              variant="square"
              pixelSize={4} 
              patternScale={12}
              patternDensity={0.25}
              enableRipples={true}
              rippleSpeed={0.08}
              rippleThickness={0.15}
              rippleIntensityScale={0.6}
              edgeFade={0.3}
              speed={0.12}
              transparent={true}
            />
          </div>

          {/* Static Grid Layer with Elegant Animated Blocks */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
            style={{ 
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "64px 64px"
            }} 
          >
            {[...Array(24)].map((_, i) => (
              <div 
                key={i}
                className="grid-reveal-block absolute bg-[#b8f724] opacity-0"
                style={{
                  width: "63px", 
                  height: "63px",
                  left: `${((i * 7) % 25) * 64 + 1}px`,
                  top: `${((i * 3) % 15) * 64 + 1}px`,
                  boxShadow: "0 0 20px rgba(184, 247, 36, 0.4)" 
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtle Light Fade */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white dark:from-black via-transparent to-white/40 dark:to-transparent pointer-events-none" />

        {/* ── Center Content ────────────────────────────────────────────── */}
        <div className="relative z-[10] flex flex-col items-center text-center max-w-6xl mx-auto px-4">
          
          <div className="hero-draggable mb-12 flex items-center gap-2 px-4 py-2 bg-[#b8f724]/10 dark:bg-[#b8f724]/5 rounded-full border border-[#b8f724]/20 dark:border-[#b8f724]/10 animate-fade-in cursor-grab active:cursor-grabbing">
             <div className="w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-400">Release v4.2 Protocol</span>
          </div>

          <h1 className="hero-title text-5xl sm:text-8xl lg:text-[110px] font-bold text-zinc-900 dark:text-white tracking-tight leading-[0.9] mb-12">
            Build for <span className="text-[#b8f724]">Speed.</span><br />
            <span className="text-zinc-400 dark:text-zinc-600">Styled by AI.</span>
          </h1>

          <p className="hero-desc max-w-2xl text-lg sm:text-2xl font-medium text-zinc-500/80 dark:text-zinc-400 leading-relaxed mb-16 px-4">
            Transform your <span className="text-zinc-900 dark:text-white">visual intent</span> into <span className="text-[#8fcc00] italic font-semibold">production-grade</span> React architectures instantly. Optimized for performance and high-velocity teams.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/sign-in"
              className="hero-btn group relative flex items-center gap-6 rounded-[2rem] bg-zinc-900 dark:bg-white px-10 py-6 text-[20px] font-bold text-white dark:text-zinc-900 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Synthesis
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#b8f724] text-black transition-all group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg shadow-[#b8f724]/20">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </Link>
          </div>
        </div>

        {/* Floating Accent Elements (Refined) */}
        <div className="hero-draggable absolute left-[10%] top-[25%] hidden xl:block animate-float">
           <div className="p-8 rounded-[40px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-2xl space-y-4 cursor-grab">
              <div className="flex gap-2">
                 <div className="h-2 w-2 rounded-full bg-red-400" />
                 <div className="h-2 w-2 rounded-full bg-yellow-400" />
                 <div className="h-2 w-2 rounded-full bg-green-400" />
              </div>
              <div className="h-1 w-32 bg-zinc-100 dark:bg-white/5 rounded-full" />
              <div className="h-1 w-24 bg-zinc-100 dark:bg-white/5 rounded-full" />
           </div>
        </div>

        <div className="hero-draggable absolute right-[12%] bottom-[30%] hidden xl:block animate-float-delayed">
           <div className="p-6 rounded-3xl bg-zinc-900 dark:bg-white border border-white/10 dark:border-black/5 shadow-2xl flex items-center gap-4 cursor-grab">
              <div className="w-10 h-10 rounded-xl bg-[#b8f724] flex items-center justify-center text-black">
                 <Cpu className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#b8f724] dark:text-[#8fcc00]">Engine_Stable</span>
                 <span className="text-sm font-bold text-white dark:text-black">99.9% Uptime</span>
              </div>
           </div>
        </div>

      </section>

      {/* ── 2. Logo Cloud / Social Proof ────────────────────────────────────── */}
      <section className="scroll-section border-y-[3px] border-black bg-white py-0 relative z-0 overflow-hidden">
        {/* Edge masks for the marquee */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex">
          {/* Marquee Track 1 */}
          <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap py-10 items-center">
            {[1, 2, 3].map((group) => (
              <div key={group} className="flex items-center gap-12 px-6">
                <span className="text-[10px] font-black text-black/15 uppercase tracking-[0.6em] px-10">Neural_Synthesis_v4.2</span>
                <div className="flex items-center gap-4 bg-[#FAFAF8] border-[2.5px] border-black px-6 py-3 rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,1)] group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-black" />
                  <span className="text-lg font-[1000] text-black">NEXT.JS</span>
                </div>
                <div className="flex items-center gap-4 bg-[#b8f724] border-[2.5px] border-black px-6 py-3 rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,1)] group hover:-translate-y-1 transition-all duration-300">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z" /></svg>
                  <span className="text-lg font-[1000] text-black">TAILWIND</span>
                </div>
                <div className="flex items-center gap-4 bg-white border-[2.5px] border-black px-6 py-3 rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,1)] group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm border-2 border-black" />
                  <span className="text-lg font-[1000] text-black">TYPESCRIPT</span>
                </div>
                <div className="flex items-center gap-4 bg-black border-[2.5px] border-black px-6 py-3 rounded-2xl shadow-[5px_5px_0_rgba(184,247,36,0.3)] group hover:-translate-y-1 transition-all duration-300">
                  <span className="text-lg font-[1000] text-[#b8f724] italic tracking-tight">framer-motion</span>
                </div>
                <div className="flex items-center gap-4 bg-white border-[2.5px] border-black px-6 py-3 rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,1)] group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black" />
                  <span className="text-lg font-[1000] text-black">GSAP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2.2. Trust Ecosystem ──────── */}
      <section className="scroll-section py-20 bg-[#FBFBFA] relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="animate-item text-center mb-16">
              <span className="text-[11px] font-[1000] text-black/30 uppercase tracking-[0.5em] block mb-2 underline decoration-[#b8f724] decoration-4 underline-offset-4">Identity_Verification</span>
           </div>
           <div className="animate-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-8 items-center opacity-60">
              {['VORTEX', 'SYNTH', 'QUANTUM', 'NEURAL', 'MATRIX', 'ORACLE'].map((brand, i) => (
                <div key={i} className="animate-item flex justify-center transform hover:scale-110 transition-transform duration-500 cursor-default grayscale hover:grayscale-0 group">
                   <div className="text-2xl font-[1000] text-black tracking-[-0.08em] transition-colors group-hover:text-black">{brand}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── 3. Feature: Ask & Analyze ──────── */}
      <section className="scroll-section py-32 sm:py-56 relative z-10 overflow-hidden bg-white">
        {/* Subtle grid pattern for the whole section */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#000 1.2px, transparent 1.2px), linear-gradient(90deg, #000 1.2px, transparent 1.2px)`,
            backgroundSize: "80px 80px"
          }} 
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <div className="animate-item" data-animation="fade-left">
              <div className="mb-10 inline-flex items-center gap-3 rounded-2xl border-[2.5px] border-black bg-black px-6 py-2 shadow-[5px_5px_0_rgba(184,247,36,1)]">
                <div className="flex gap-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-white/20" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white/20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b8f724]">System_Oracle_v2.0</span>
              </div>
              
              <h2 className="text-6xl sm:text-8xl font-[1000] mb-10 text-black tracking-[-0.04em] leading-[0.85] uppercase">
                Imagine. <br/>
                <span className="text-white [-webkit-text-stroke:2px_black]">Synthesized.</span>
              </h2>
              
              <p className="text-xl sm:text-2xl text-zinc-500 leading-relaxed mb-14 font-black italic max-w-xl">
                "Vibro translates human intent into architectural reality. A dialogue between your imagination and production-ready code."
              </p>
              
              <div className="animate-container grid gap-5">
                {[
                  { title: "Neuro-Mapping", text: "Transforming abstract logic into structured UI tokens.", color: "bg-blue-50/50" },
                  { title: "Sovereign Build", text: "Zero dependencies. Pure, optimized React architectures.", color: "bg-zinc-50" },
                  { title: "Instant Hydration", text: "Deploy as static assets or dynamic server nodes.", color: "bg-[#b8f724]/5" }
                ].map((item, i) => (
                  <div key={i} className={`animate-item flex items-center justify-between p-7 rounded-[2.5rem] border-[3px] border-black ${item.color} shadow-[8px_8px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all group`}>
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-black uppercase tracking-tighter mb-1.5">{item.title}</h4>
                      <p className="text-sm font-bold text-zinc-400 italic">" {item.text} "</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-[#b8f724] transform group-hover:rotate-12 transition-transform shadow-[4px_4px_0_rgba(184,247,36,1)]">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-item relative" data-animation="fade-right">
               <div className="relative z-10">
                 <DesignBot />
               </div>
               {/* Premium background accents */}
               <div className="parallax-element absolute -top-16 -right-16 w-48 h-48 bg-[#b8f724]/10 blur-[120px] rounded-full z-0" data-speed="0.15" />
               <div className="parallax-element absolute -bottom-20 -left-20 w-64 h-64 bg-zinc-200/40 blur-[100px] rounded-full z-0" data-speed="-0.1" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.2. Feature: Visual Debugger ──────── */}
      <section className="scroll-section py-32 bg-[#FBFBFA] border-y-[3.5px] border-black relative z-10 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
            backgroundSize: "40px 40px"
          }} 
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-item text-center mb-24">
             <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full border-[2.5px] border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] mb-8">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[ping_2s_infinite]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">Anomaly_Scan_Active</span>
             </div>
             <h2 className="text-5xl sm:text-7xl font-[1000] text-black uppercase tracking-tight leading-none mb-8">Refactor. <br/><span className="text-white [-webkit-text-stroke:2px_black]">Optimize.</span> Deliver.</h2>
             <p className="text-xl font-bold text-zinc-400 max-w-2xl mx-auto italic leading-relaxed">
               "Architectural debt is the silent killer of scale. Our engine identifies logic overlaps and prunes redundant nodes automatically."
             </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Problem Node */}
            <div className="animate-item group relative rounded-[3rem] border-[3.5px] border-black bg-zinc-100/50 p-10 sm:p-14 shadow-[15px_15px_0_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all overflow-hidden" data-animation="fade-left">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/5 blur-[50px] rounded-full" />
               <div className="flex items-center justify-between mb-12 relative z-10">
                  <div className="flex flex-col">
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">State: Critical</div>
                    <div className="text-lg font-black text-black uppercase tracking-tighter italic">Legacy_Structure</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-red-100 border-2 border-red-200 text-red-600 text-[10px] font-black uppercase">! Bloated_IO</div>
               </div>
               
               <div className="space-y-6 opacity-30 blur-[2px] pointer-events-none group-hover:blur-[1px] group-hover:opacity-40 transition-all duration-700">
                  <div className="h-4 w-full bg-zinc-300 rounded-full" />
                  <div className="h-4 w-5/6 bg-zinc-300 rounded-full" />
                  <div className="h-48 w-full border-[3px] border-dashed border-zinc-300 rounded-[2rem] flex flex-col items-center justify-center text-zinc-300">
                     <div className="text-6xl mb-4">⚙️</div>
                     <div className="text-xs font-black uppercase tracking-widest">Manual_Redundancy</div>
                  </div>
               </div>
               
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-black text-white px-8 py-4 rounded-[2rem] border-[4px] border-white shadow-2xl flex items-center gap-4">
                     <div className="w-5 h-5 rounded-full border-2 border-white/20 bg-red-500" />
                     <span className="text-sm font-black uppercase tracking-widest">Identify Bottleneck</span>
                  </div>
               </div>
            </div>

            {/* Right: Synthesis Node */}
            <div className="animate-item relative rounded-[3rem] border-[3.5px] border-black bg-white p-10 sm:p-14 shadow-[20px_20px_0_rgba(184,247,36,1)] hover:-translate-y-2 transition-all" data-animation="fade-right">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8f724]/10 blur-[100px] rounded-full pointer-events-none" />
               
               <div className="flex items-center justify-between mb-12 relative z-10">
                  <div className="flex flex-col">
                    <div className="text-[10px] font-black text-[#8fcc00] uppercase tracking-widest leading-none mb-1">State: Optimal</div>
                    <div className="text-lg font-black text-black uppercase tracking-tighter italic">Vibro_Engine</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#b8f724] border-2 border-black text-black text-[10px] font-black uppercase shadow-[3px_3px_0_rgba(0,0,0,1)]">✓ Synthesized</div>
               </div>
               
               <div className="space-y-6 relative z-10">
                  <div className="p-6 rounded-[2rem] border-[2.5px] border-black bg-[#FAFAF8] shadow-[6px_6px_0_rgba(0,0,0,1)] group/item transition-all hover:bg-white hover:shadow-[10px_10px_0_rgba(184,247,36,1)]">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-[#b8f724] font-black">AI</div>
                        <div className="text-xs font-black uppercase text-black tracking-tight">Refined_Composition</div>
                     </div>
                     <p className="text-[13px] font-bold text-zinc-400 italic">"Detected 14 nodes of dead CSS. Pruning initiated."</p>
                  </div>
                  
                  <div className="relative rounded-[2rem] border-[2.5px] border-black bg-black p-8 overflow-hidden group/code shadow-[6px_6px_0_rgba(184,247,36,0.3)]">
                     <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                     <div className="relative font-mono text-[11px] leading-relaxed">
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                           <div className="w-2 h-2 rounded-full bg-green-500" />
                           <span className="text-zinc-600 font-bold tracking-widest uppercase text-[9px]">Synthesizer_IO</span>
                        </div>
                        <div className="text-[#b8f724]"><span className="text-blue-400">export</span> <span className="text-purple-400">const</span> <span className="text-white">NeuralCard</span> = () ={">"} (</div>
                        <div className="text-white ml-4">{"<Vibro.Node scale={1.2} />"}</div>
                        <div className="text-[#b8f724]">);</div>
                     </div>
                     <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#b8f724] text-[9px] font-black uppercase">
                        98.4% Efficiency
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5. Architectural Synthesis (Workflow) ──────── */}
      <section className="scroll-section py-32 sm:py-56 bg-black relative z-10 overflow-hidden border-b-4 border-black">
        {/* Animated background lines */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="absolute h-px bg-[#b8f724] transition-all" 
               style={{ 
                 width: '100%', 
                 top: `${i * 20}%`, 
                 left: 0, 
                 opacity: 0.1,
                 animation: `marquee ${20 + i * 10}s linear infinite` 
               }} 
             />
           ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-item text-center mb-24" data-animation="fade-up">
            <div className="inline-block px-4 py-1.5 rounded-full border-2 border-white/20 text-[#b8f724] text-[10px] font-black uppercase tracking-[0.4em] mb-6">Workflow_Matrix</div>
            <h2 className="text-6xl sm:text-8xl font-black text-white tracking-[-0.04em] mb-10 leading-[0.85] uppercase">The Synthesis <br/> <span className="text-white [-webkit-text-stroke:2px_#b8f724]">Protocol.</span></h2>
            <p className="text-zinc-500 font-black max-w-xl mx-auto text-lg italic">
              "Three distinct operational layers between concept and deployment."
            </p>
          </div>

          <div className="animate-container grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Ingestion", text: "Submit your architectural vision via prompt or system graph.", color: "bg-white", icon: "📥" },
              { step: "02", title: "Synthesis", text: "Our agents process tokens and assemble the component lattice.", color: "bg-[#b8f724]", icon: "⚙️" },
              { step: "03", title: "Extraction", text: "Pull refined architectures directly into your local Git repo.", color: "bg-white", icon: "🚀" }
            ].map((s, i) => (
              <div key={i} className="animate-item group relative">
                <div className={`p-10 sm:p-14 rounded-[3rem] border-[4px] border-black ${s.color} shadow-[10px_10px_0_rgba(184,247,36,0.3)] transition-all hover:shadow-[15px_15px_0_rgba(184,247,36,0.4)] hover:-translate-y-2 relative overflow-hidden`}>
                   <div className="absolute -top-10 -right-10 text-9xl text-black/5 font-black group-hover:text-black/10 transition-colors pointer-events-none">{s.step}</div>
                   <div className="text-4xl mb-8 transform group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
                   <h3 className="text-2xl font-[1000] text-black mb-6 uppercase tracking-[-0.05em]">{s.title}</h3>
                   <p className="text-[15px] font-bold text-zinc-500 leading-relaxed italic">" {s.text} "</p>
                   
                   <div className="mt-10 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      <div className="h-0.5 flex-1 bg-black/10" />
                      <div className="text-[10px] font-black uppercase tracking-widest text-black/20">Protocol_Gate</div>
                   </div>
                </div>
                {i < 2 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-14 h-14 rounded-full bg-black border-[4px] border-[#b8f724] flex items-center justify-center text-[#b8f724] font-black shadow-xl transform group-hover:scale-120 group-hover:rotate-[360deg] transition-all duration-1000">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Feature: Instant Ship (CLI) ─────── */}
      <section className="scroll-section py-32 sm:py-56 bg-white relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <div className="animate-item order-2 lg:order-1 relative" data-animation="fade-left">
               <div className="relative z-10 rounded-[3rem] border-[3.5px] border-black bg-black p-5 shadow-[25px_25px_0_rgba(184,247,36,0.2)]">
                  <div className="flex items-center gap-2 mb-6 px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-white/20" />
                    <div className="ml-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Module_Extraction_v0.2</div>
                  </div>
                  <div className="p-6 sm:p-10 bg-[#0A0A0A] rounded-[2rem] border-2 border-white/5 font-mono text-sm sm:text-base leading-relaxed overflow-hidden shadow-inner">
                    <div className="flex gap-3 mb-6">
                      <span className="text-[#b8f724] font-black">❯</span>
                      <span className="text-white font-bold">vibro pull <span className="text-blue-400">auth-v4.node</span></span>
                    </div>
                    <div className="space-y-3 text-[13px] text-zinc-500">
                      <div className="flex items-center gap-3"><span className="text-[#b8f724] opacity-50">⟳</span> Resolving Lattice...</div>
                      <div className="flex items-center gap-3"><span className="text-[#b8f724] opacity-50">⟳</span> Injecting Next.js Bindings...</div>
                      <div className="flex items-center gap-3 text-white"><span className="text-[#b8f724]">✓</span> Extraction Complete. <span className="text-[#b8f724] ml-2">12ms</span></div>
                    </div>
                  </div>
               </div>
               {/* Background Glow */}
               <div className="parallax-element absolute -top-20 -left-20 w-64 h-64 bg-[#b8f724]/10 blur-[150px] rounded-full" data-speed="0.1" />
            </div>
            
            <div className="animate-item order-1 lg:order-2" data-animation="fade-right">
              <div className="mb-10 inline-flex items-center gap-4 px-6 py-2 rounded-2xl border-[2.5px] border-black bg-[#b8f724] shadow-[6px_6px_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
                   <svg className="h-5 w-5 text-[#b8f724]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest text-black">Terminal_Native</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-black mb-10 text-black tracking-[-0.04em] leading-[0.9] uppercase">Terminal-First. <br/><span className="text-zinc-300">Bot-Sync.</span></h2>
              <p className="text-xl text-zinc-500 leading-relaxed mb-12 font-black italic max-w-lg">
                "We built the CLI for the speed of thought. Your refined components live wherever your terminal points."
              </p>
              <div className="flex flex-wrap gap-5">
                 <div className="px-8 py-5 rounded-[1.5rem] border-[3px] border-black bg-black text-[#b8f724] font-black font-mono text-sm shadow-[8px_8px_0_rgba(184,247,36,1)] transition-transform hover:-translate-y-1 cursor-default">
                   npm install -g vibro
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4.5. Vanguard Systems (Metrics) ──────── */}
      <section className="scroll-section py-24 bg-[#b8f724] border-y-[3px] border-black relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-container grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: 2.4, suffix: "M+", label: "Synthesized_Nodes" },
              { val: 180, suffix: "K", label: "Global_Architects" },
              { val: 12, suffix: "ms", label: "Latency_Protocol" },
              { val: 99.9, suffix: "%", label: "Reliability_Score" }
            ].map((m, i) => (
              <div key={i} className="animate-item text-center">
                <div 
                  className="counter-item text-5xl sm:text-6xl font-[1000] text-black tracking-tighter mb-2"
                  data-target={m.val}
                  data-suffix={m.suffix}
                >
                  0{m.suffix}
                </div>
                <div className="text-[10px] font-black text-black/50 uppercase tracking-[0.4em]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4.7. Integration Ecosystem ──────── */}
      <section className="scroll-section py-32 sm:py-56 bg-[#FAFAF8] relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <div className="animate-item" data-animation="fade-left">
              <div className="mb-10 inline-flex items-center gap-3 rounded-2xl border-[2.5px] border-black bg-white px-5 py-2 shadow-[5px_5px_0_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Connection_Mesh</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-[1000] text-black mb-10 tracking-tight leading-[0.9] uppercase">Flows. <br/>Syncs. <span className="text-white [-webkit-text-stroke:2px_black]">Executes.</span></h2>
              <p className="text-xl font-bold text-zinc-500 leading-relaxed mb-12 max-w-md italic">
                "Vibro integrates natively into your preferred environment. No walled gardens, just pure architectural liquidity."
              </p>
              <div className="animate-container grid grid-cols-2 gap-5">
                 {[
                   { name: 'Cursor', desc: 'Native AI Sync' },
                   { name: 'VS Code', desc: 'Direct Protocol' },
                   { name: 'Neovim', desc: 'Terminal Flow' },
                   { name: 'IntelliJ', desc: 'Enterprise Logic' }
                 ].map(app => (
                   <div key={app.name} className="animate-item p-7 rounded-[2rem] border-[3px] border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_rgba(184,247,36,1)] transition-all hover:-translate-y-1 group">
                      <div className="text-sm font-black uppercase tracking-widest text-black mb-1 group-hover:text-[#8fcc00] transition-colors">{app.name}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter italic">" {app.desc} "</div>
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="animate-item relative" data-animation="fade-right">
               <div className="rounded-[4rem] border-[4px] border-black bg-white p-5 sm:p-8 shadow-[40px_40px_0_rgba(184,247,36,0.1)] overflow-hidden">
                  <div className="relative aspect-video rounded-[3rem] overflow-hidden border-[3.5px] border-black bg-zinc-900 group">
                    <img 
                      src="/vibro_ux_flow_1773419987459.png" 
                      alt="Vibro UX Protocol" 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="h-24 w-24 rounded-full bg-[#b8f724] border-4 border-black flex items-center justify-center shadow-3xl hover:scale-110 transition-transform cursor-pointer group/play">
                          <svg className="w-10 h-10 text-black fill-current transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          <div className="absolute inset-0 rounded-full border-4 border-black animate-ping opacity-20" />
                       </div>
                    </div>
                  </div>
               </div>
               
               {/* Decorative Terminal Overlay */}
                <div className="parallax-element absolute -bottom-16 -right-10 bg-black text-[#b8f724] p-8 rounded-[2.5rem] border-[4px] border-white shadow-2xl w-64 rotate-3 z-20" data-speed="0.2">
                  <div className="text-[10px] font-mono mb-3 opacity-30 tracking-[0.2em] font-black uppercase">Live_Node_Watcher</div>
                  <div className="text-[13px] font-black font-mono leading-relaxed">
                    $ vibro sync <span className="text-white">--watch</span> <br/> 
                    <span className="text-zinc-600">{" >> "}</span> Listening... <br/>
                    <span className="text-[#8fcc00]">{" >> "}</span> Update_Pushed
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. High-Velocity Grid (Bento) ──────────────────────────────────────── */}
      <section className="scroll-section py-32 sm:py-56 bg-white border-t-[3.5px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-item text-center mb-28">
            <div className="inline-block px-4 py-1.5 rounded-full border-2 border-black bg-zinc-50 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Architecture_Vault</div>
            <h2 className="text-6xl sm:text-8xl font-[1000] tracking-[-0.04em] text-black mb-8 uppercase leading-[0.85]">High_Velocity. <br/><span className="text-white [-webkit-text-stroke:2px_black]">Low_Entropy.</span></h2>
            <p className="text-zinc-500 font-black max-w-2xl mx-auto text-xl italic leading-relaxed">
              "Every component in the Vibro ecosystem is pre-optimized for performance, accessibility, and modern aesthetics."
            </p>
          </div>

          <div className="animate-container grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Main Bento Piece */}
            <div className="animate-item col-span-1 md:col-span-2 row-span-2 rounded-[3.5rem] bg-[#FAFAF8] border-[3.5px] border-black p-12 sm:p-16 relative overflow-hidden shadow-[12px_12px_0_rgba(0,0,0,1)] group" data-animation="scale-in">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#b8f724]/20 blur-[150px] rounded-full group-hover:blur-[180px] transition-all duration-700" />
              <h3 className="text-4xl font-[1000] text-black mb-6 relative z-10 tracking-tight uppercase">Visual<br/>Tuning.</h3>
              <p className="text-zinc-400 max-w-sm mb-16 relative z-10 font-black italic text-lg leading-relaxed">"Direct manipulation of architectural tokens via our high-fidelity GUI."</p>
              
              <div className="space-y-5 relative z-10">
                 <div className="flex h-16 w-full items-center justify-between rounded-[1.5rem] border-[3px] border-black bg-white px-8 shadow-[6px_6px_0_rgba(0,0,0,1)] group/bar hover:-translate-y-1 transition-all">
                    <span className="text-[11px] font-[1000] uppercase tracking-widest">Border_Radius</span>
                    <div className="flex gap-2">
                       <div className="w-2.5 h-2.5 rounded-md bg-black/5" />
                       <div className="w-2.5 h-2.5 rounded-md bg-black/10" />
                       <div className="w-2.5 h-2.5 rounded-md bg-[#b8f724] border border-black shadow-[2px_2px_0_rgba(0,0,0,1)]" />
                    </div>
                 </div>
                 <div className="flex h-16 w-full items-center justify-between rounded-[1.5rem] border-[3px] border-black bg-[#b8f724] px-8 shadow-[6px_6px_0_rgba(0,0,0,1)] group/bar hover:-translate-y-1 transition-all">
                    <span className="text-[11px] font-[1000] uppercase tracking-widest text-black">Glassmorphism</span>
                    <div className="w-12 h-7 bg-black rounded-full p-1.5 transition-all"><div className="w-4 h-4 bg-[#b8f724] rounded-full translate-x-5 shadow-sm" /></div>
                 </div>
              </div>
            </div>

            {/* Metrics Piece */}
            <div className="animate-item rounded-[3.5rem] bg-black border-[3.5px] border-black p-12 relative overflow-hidden shadow-[12px_12px_0_rgba(184,247,36,0.3)] flex flex-col justify-between min-h-[350px]" data-animation="scale-in">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#b8f724]/10 blur-[60px] rounded-full" />
              <div 
                className="counter-item text-6xl font-[1000] text-[#b8f724] tracking-tighter mb-4 italic"
                data-target="25"
                data-target-suffix="K+"
              >
                0K+
              </div>
              <p className="text-[11px] font-[1000] text-white/50 leading-relaxed uppercase tracking-[0.4em]">Verified_Nodes</p>
            </div>

            {/* Utility Piece */}
            <div className="animate-item rounded-[3.5rem] bg-white border-[3.5px] border-black p-12 flex flex-col justify-between shadow-[12px_12px_0_rgba(0,0,0,1)] min-h-[350px] group transition-all hover:bg-[#b8f724]" data-animation="scale-in">
               <div className="w-16 h-16 bg-black rounded-[1.5rem] flex items-center justify-center mb-8 shadow-[6px_6px_0_rgba(184,247,36,1)] group-hover:bg-white group-hover:shadow-[6px_6px_0_rgba(0,0,0,1)]">
                  <svg className="w-8 h-8 text-[#b8f724] group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                 <h3 className="text-2xl font-[1000] text-black uppercase tracking-tight mb-3">Sync_IO</h3>
                 <p className="text-[12px] font-black text-black/30 group-hover:text-black/60 italic uppercase tracking-tighter">Zero duplicate effort.</p>
               </div>
            </div>

            {/* Tech Stack Piece */}
            <div className="animate-item col-span-1 md:col-span-2 rounded-[3.5rem] bg-white border-[3.5px] border-black p-12 sm:p-14 relative overflow-hidden shadow-[12px_12px_0_rgba(0,0,0,1)] flex flex-col justify-center" data-animation="scale-in">
              <h3 className="text-3xl font-[1000] text-black mb-6 uppercase tracking-tight italic">Universal Protocol.</h3>
              <p className="text-zinc-400 font-black mb-10 text-lg italic leading-relaxed max-w-md">"Target any modern framework with a single synthesis. Agnostic by design."</p>
              <div className="flex flex-wrap gap-3">
                 {['React.js', 'Next.js 15', 'Vite 6', 'Remix', 'Bun'].map(tag => (
                   <span key={tag} className="px-5 py-2.5 rounded-[1.2rem] border-[2.5px] border-black bg-[#FAFAF8] text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all hover:bg-[#b8f724] cursor-default">{tag}</span>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.5. Library Showcase Section ──────────────────────────────────────── */}
      <section className="scroll-section py-32 sm:py-48 bg-white relative z-10 overflow-hidden border-b-[3.5px] border-black">
        <div className="absolute inset-0 z-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(#000 1.2px, transparent 1.2px)`,
            backgroundSize: "32px 32px"
          }} 
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 animate-item">
            <div data-animation="fade-left" className="max-w-3xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-xl border-[2.5px] border-black bg-black px-5 py-2 shadow-[4px_4px_0_rgba(184,247,36,1)]">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b8f724]">Central_Lattice</span>
              </div>
              <h2 className="text-6xl sm:text-8xl font-[1000] tracking-[-0.05em] text-black leading-[0.85] uppercase mb-10">
                Verified <br/> <span className="text-white [-webkit-text-stroke:2px_black]">Components.</span>
              </h2>
              <p className="max-w-xl text-zinc-500 font-bold text-xl italic leading-relaxed">
                "Every node is hand-vetted for architectural integrity, ensuring your synthesis remains pure and performant."
              </p>
            </div>
            
            <Link
              href="/categories"
              className="group relative flex items-center gap-4 rounded-2xl border-[3px] border-black bg-[#b8f724] px-8 py-4 text-sm font-[1000] text-black shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(0,0,0,1)] mt-12 lg:mt-0 uppercase tracking-widest"
              data-animation="fade-right"
            >
              Access the Engine
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[#b8f724] transition-transform group-hover:rotate-12">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="animate-container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((prompt, idx) => (
              <div key={prompt.id} className="animate-item group" data-animation="zoom-out">
                <div className="relative transform transition-all duration-500 group-hover:-translate-y-3 group-hover:rotate-1">
                  <div className="absolute inset-0 bg-[#b8f724] rounded-[2.5rem] -rotate-3 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <PromptCard prompt={prompt} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32">
            <div className="flex items-center gap-4 mb-12 animate-item">
               <div className="h-0.5 w-12 bg-black" />
               <span className="text-xs font-black uppercase tracking-[0.5em] text-black/20">Protocol_Classifications</span>
               <div className="h-0.5 flex-1 bg-black/5" />
            </div>
            <div className="animate-container grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat.id} className="animate-item" data-animation="zoom-out">
                   <div className="hover:-translate-y-1 transition-transform">
                      <CategoryCard category={cat} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ──────────────────────── */}
      <section className="scroll-section py-32 bg-[#FAFAF8] border-t-[3px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-item text-center mb-24" data-animation="fade-up">
             <div className="inline-flex items-center gap-3 bg-black text-[#b8f724] px-6 py-2 rounded-full mb-8 shadow-[4px_4px_0_rgba(184,247,36,1)]">
                <div className="w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Feedback</span>
             </div>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-black mb-6 italic underline decoration-black/5 decoration-4">Trusted by <span className="text-[#8fcc00]">Architects.</span></h2>
            <p className="text-zinc-500 font-bold max-w-md mx-auto text-lg leading-relaxed">Join 15,000+ developers shipping beautiful interfaces with algorithmic precision.</p>
          </div>

          {/* Featured Pull Quote (Spectra Style) */}
          <div className="animate-item mb-20" data-animation="zoom-out">
             <div className="relative rounded-[3rem] border-[4px] border-black bg-white p-8 sm:p-20 shadow-[20px_20px_0_rgba(184,247,36,1)] overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#b8f724]/10 blur-[100px] rounded-full group-hover:bg-[#b8f724]/20 transition-all duration-700" />
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                   <div className="text-4xl sm:text-6xl font-black text-black leading-[1.1] mb-12 italic tracking-tighter">
                      "Vibro isn't just a tool; it's a <span className="text-[#8fcc00]">paradigm shift</span> in how we conceptualize and deliver digital products at scale."
                   </div>
                   <div className="flex flex-col items-center">
                      <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&auto=format&fit=crop" alt="Founder" className="w-20 h-20 rounded-full border-[4px] border-black shadow-[6px_6px_0_rgba(0,0,0,1)] mb-6 object-cover" />
                      <div className="text-2xl font-[1000] text-black tracking-tight">Jonathan Vance</div>
                      <div className="text-sm font-black text-zinc-400 uppercase tracking-widest mt-2">Director of Engineering @ VANGUARD_SYSTEMS</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="animate-container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="animate-item group bg-white border-[3.5px] border-black rounded-[2.5rem] p-10 shadow-[10px_10px_0_rgba(184,247,36,1)] transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0_rgba(184,247,36,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#b8f724]/5 blur-[40px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="relative">
                    <img src={t.image} alt={t.name} className="w-16 h-16 rounded-2xl border-[3.5px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] object-cover grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-lg bg-[#b8f724] border-[2px] border-black flex items-center justify-center">
                       <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-[1000] text-black tracking-tighter leading-none mb-1.5">{t.name}</div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded-md inline-block">{t.role}</div>
                  </div>
                </div>
                <p className="text-[15px] text-zinc-700 leading-relaxed font-bold italic relative z-10">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Pre-Footer Pricing Block ─────────────────────────── */}
      <section className="scroll-section py-20 sm:py-32 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="animate-item relative rounded-[2.5rem] sm:rounded-[4rem] bg-black border-[4px] border-black overflow-hidden flex flex-col items-center justify-center text-center py-20 sm:py-32 px-4 shadow-[12px_12px_0_rgba(184,247,36,0.3)] sm:shadow-[30px_30px_0_rgba(184,247,36,0.3)]" data-animation="zoom-out">
          {/* Abstract background inside card */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            <div className="parallax-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b8f724]/5 blur-[200px] rounded-full pointer-events-none" data-speed="0.05" />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="h-16 w-16 sm:h-20 sm:w-20 mb-10 rounded-3xl bg-[#b8f724] border-[3.5px] border-black flex items-center justify-center text-2xl sm:text-3xl shadow-[4px_4px_0_rgba(255,255,255,1)] sm:shadow-[6px_6px_0_rgba(255,255,255,1)] rotate-[-6deg] animate-bounce">💎</div>
            <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">Architect the <br /> <span className="text-[#8fcc00]">Future.</span></h2>
            <p className="text-zinc-500 font-bold mb-16 max-w-xl mx-auto text-base sm:text-lg">Unlock the entire ecosystem of premium components. Pay once, architect forever.</p>

            <div className="animate-container grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl text-left">
              {/* Free Plan */}
              <div className="animate-item bg-zinc-900/50 rounded-[2.5rem] p-8 sm:p-12 border-[3.5px] border-white/5 transition-colors hover:border-[#b8f724]/20 group">
                <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4">Core Ecosystem</div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-10">$0<span className="text-lg text-zinc-700 ml-2 italic">/forever</span></div>
                <ul className="space-y-4 mb-12 text-sm sm:text-[15px] font-bold text-zinc-400">
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">✔</div> Access to basic patterns</li>
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">✔</div> CLI terminal access</li>
                </ul>
                <button className="w-full py-5 rounded-2xl bg-zinc-800 border-[3px] border-zinc-700 text-white font-black text-sm transition-all hover:bg-zinc-700">Start Planning</button>
              </div>

              {/* Pro Plan */}
              <div className="animate-item bg-white rounded-[2.5rem] border-[4px] border-black p-8 sm:p-12 relative overflow-hidden shadow-[8px_8px_0_rgba(184,247,36,1)] sm:shadow-[12px_12px_0_rgba(184,247,36,1)] transition-transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 bg-black text-[#b8f724] px-4 py-2 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest">Most Popular</div>
                <div className="text-[10px] text-[#8fcc00] font-black uppercase tracking-[0.3em] mb-4">Architect Pro</div>
                <div className="flex items-end gap-2 mb-10">
                  <div className="text-5xl sm:text-6xl font-black text-black">$149</div>
                  <div className="text-base sm:text-lg text-zinc-400 font-bold line-through mb-1.5">$299</div>
                </div>
                <ul className="space-y-4 mb-12 text-sm sm:text-[15px] font-bold text-black">
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-[#b8f724] border-2 border-black flex items-center justify-center text-[10px] text-black font-black">✔</div> Full premium library</li>
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-[#b8f724] border-2 border-black flex items-center justify-center text-[10px] text-black font-black">✔</div> Advanced Visual AI Agent</li>
                  <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-[#b8f724] border-2 border-black flex items-center justify-center text-[10px] text-black font-black">✔</div> Private Architect Discord</li>
                </ul>
                <button className="w-full py-5 rounded-2xl bg-[#b8f724] border-[3.5px] border-black text-black font-black text-lg transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(184,247,36,0.4)]">Unlock The Vault</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7.5. Architectural Archives (Resources) ──────── */}
      <section className="scroll-section py-24 sm:py-40 bg-white border-y-4 border-black relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: "32px 32px" }} 
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 animate-item" data-animation="fade-up">
            <div className="max-w-2xl text-left">
              <div className="inline-block px-4 py-1.5 rounded-full border-2 border-black bg-[#b8f724] text-black text-[10px] font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0_rgba(0,0,0,1)]">The_Vault_v2</div>
              <h2 className="text-5xl sm:text-7xl font-[1000] text-black uppercase tracking-tighter leading-none mb-6">Deep <br/><span className="text-[#8fcc00]">Intelligence.</span></h2>
              <p className="text-xl font-bold text-zinc-500 italic max-w-sm">"Go beyond the surface. Master the protocols of modern architectural synthesis."</p>
            </div>
            <Link href="/blog" className="mt-8 lg:mt-0 px-8 py-4 rounded-2xl border-[3px] border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] font-black uppercase tracking-widest text-xs hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(184,247,36,1)] transition-all">Explore Archive →</Link>
          </div>

          <div className="animate-container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "The Neo-Brutalist Manifesto", cat: "Design philosophy", icon: "🏛️", color: "bg-blue-50" },
              { title: "High-Velocity Extraction", cat: "Technical protocol", icon: "🚀", color: "bg-orange-50" },
              { title: "Neural Synthesis Guide", cat: "AI optimization", icon: "🧠", color: "bg-purple-50" }
            ].map((item, i) => (
              <div key={i} className="animate-item group relative rounded-[2.5rem] border-[4px] border-black bg-white p-10 shadow-[10px_10px_0_rgba(0,0,0,1)] hover:shadow-[16px_16px_0_rgba(184,247,36,1)] transition-all hover:-translate-y-2 overflow-hidden text-left" data-animation="zoom-out">
                 <div className={`absolute top-0 right-0 w-40 h-40 ${item.color} blur-[60px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity`} />
                 <div className="relative z-10">
                    <div className="text-5xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">{item.icon}</div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{item.cat}</div>
                    <h3 className="text-2xl font-black text-black group-hover:text-[#8fcc00] transition-colors leading-tight mb-8 underline decoration-black/5 decoration-4">{item.title}</h3>
                    <div className="flex items-center gap-4">
                       <span className="h-0.5 w-12 bg-black" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-black">Read Protocol</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ Protocol ────────────────────────────────── */}
      <section className="scroll-section py-24 sm:py-32 bg-[#F3F2EE] border-t-4 border-black relative z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-item text-center mb-16" data-animation="fade-up">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Synthetic <span className="text-[#8fcc00]">FAQ.</span></h2>
          </div>
          <div className="animate-container space-y-4">
            {[
              { q: "How does the 'Extraction' process work?", a: "Once you refine a design, we generate a unique hash. execute 'vibro pull [hash]' in your terminal to instantly merge the component into your local project." },
              { q: "Can I use Vibro with Tailwind v4?", a: "Absolutely. Every component in our library is natively compatible with Tailwind v4's high-performance engine." },
              { q: "Is the generated code production-ready?", a: "Yes. Our agents follow strict accessibility, performance, and best-practice guidelines for high-scale applications." }
            ].map((item, i) => (
              <div key={i} className="animate-item group p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-[3px] border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(184,247,36,1)] transition-all">
                <div className="text-lg font-black text-black mb-3">{item.q}</div>
                <div className="text-sm font-bold text-zinc-500 leading-relaxed italic">"{item.a}"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Final CTA: Global Expansion ──────────────────── */}
      <section className="scroll-section py-32 bg-black relative z-10 overflow-hidden border-t-4 border-black">
        <div className="absolute inset-0 opacity-20">
          <div className="parallax-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#b8f724]/10 blur-[250px] rounded-full" data-speed="-0.1" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="animate-item mb-12" data-animation="fade-up">
            <h2 className="text-6xl sm:text-9xl font-[1000] text-white uppercase tracking-tighter leading-none mb-10">
              Ship <br/> <span className="text-[#8fcc00]">Beyond.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="brutal-btn-primary text-xl px-12 py-6">Enter Synthesis</button>
              <button className="brutal-btn border-white bg-transparent text-white hover:bg-white hover:text-black text-xl px-12 py-6">Explore Archive</button>
            </div>
          </div>
          <div className="animate-item" data-animation="fade-up">
            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4">Architecting the next billion interfaces</div>
            <div className="flex justify-center gap-10 opacity-30 grayscale contrast-125">
               {['SaaS', 'Fintech', 'Crypto', 'E-comm', 'Personal'].map(industry => (
                 <span key={industry} className="text-white font-black text-xs">{industry}</span>
               ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
