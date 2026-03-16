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

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$0",
    desc: "For individuals exploring AI design generation.",
    features: ["5 AI Syntheses/month", "Public component library", "Basic token export", "Community support"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For professionals building scalable design systems.",
    features: ["Unlimited AI Syntheses", "Private component library", "Advanced JSON/CLI export", "Theme customization", "Priority API access"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For teams requiring advanced control and security.",
    features: ["Custom model training", "SSO integration", "Dedicated success manager", "White-label exports", "24/7 Support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function HomeClient({ categories: _categories, featured: initialFeatured }: { categories: Category[], featured: Prompt[] }) {
  const featured = initialFeatured.length > 0 ? initialFeatured : DUMMY_FEATURED;
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug Environment Variables
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      console.warn("⚠️ [Vibro Debug] Client-side environment variables missing!");
      console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
    } else {
      console.log("✅ [Vibro Debug] Client-side environment variables loaded.");
    }
  }, []);

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

    // Stagger groups
    const groups = gsap.utils.toArray<HTMLElement>(".sc-stagger-group");
    groups.forEach((group) => {
      const children = group.querySelectorAll(".sc-stagger-item");
      if (!children.length) return;
      gsap.fromTo(children,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "back.out(1.2)",
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );
    });

    setTimeout(() => ScrollTrigger.refresh(), 800);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-white">

      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. SYSTEM PROTOCOL MARQUEE ────────────────────────────────── */}
      <section className="border-y border-black/10 bg-white py-0 relative z-10 overflow-hidden">
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap py-8 items-center">
          {[1, 2, 3].map((g) => (
            <div key={g} className="flex items-center gap-10 px-6">
              <span className="text-[10px] font-black text-black/10 uppercase tracking-[0.8em]">System_Protocol</span>
              {[
                { label: "NEXT.JS 15",  icon: "⚡",   bg: "bg-[#FAFAF8]"        },
                { label: "TAILWIND V4", icon: null,   bg: "bg-[#e8ff8a]"        },
                { label: "AI AGENTIC", icon: "❆",     bg: "bg-white"            },
                { label: "REACT 19",   icon: "⚛",     bg: "bg-[#FAFAF8]"        },
                { label: "GSAP PRO",   icon: "▶",     bg: "bg-zinc-900"         },
                { label: "SUPABASE",   icon: "🪄",     bg: "bg-[#FAFAF8]"        },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 ${item.bg} border border-black/15 px-5 py-2 shadow-[2px_2px_0_rgba(0,0,0,0.07)]`}>
                  {item.icon && <span>{item.icon}</span>}
                  <span className={`text-sm font-bold uppercase tracking-widest ${
                    item.label === "GSAP PRO" ? "text-[#C6FF3D]" : "text-black/65"
                  }`}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── 4. ARCHITECTURE GAP ─────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="sc-reveal text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-5 py-2 border border-red-100 font-black text-[10px] uppercase tracking-[0.4em] mb-8 shadow-[4px_4px_0_#fee2e2]">
              ⚠ Efficiency Analysis
            </div>
            <h2 className="text-6xl sm:text-8xl font-[1000] text-black tracking-[-0.05em] leading-[0.85] uppercase">
              The Death of <br /><span className="text-white" style={{ WebkitTextStroke: "2px black" }}>Static Design.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Legacy */}
            <div className="sc-reveal bg-[#FBFBFA] border border-black/10 rounded-[2rem] p-10 relative overflow-hidden" data-dir="left">
              <div className="absolute top-6 right-6 text-[60px] font-black text-black/5 leading-none">01</div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-3">Legacy Workflow</h3>
              <p className="text-zinc-400 italic font-bold mb-8">&ldquo;Manual Figma-to-code translation is a high-latency bottleneck.&rdquo;</p>
              <div className="space-y-4 opacity-40">
                {["Copy-pasting hex codes...", "Fixing responsive bugs...", "Adjusting padding manually...", "Re-implementing Figma specs..."].map(s => (
                  <div key={s} className="h-12 bg-white border-2 border-black/10 flex items-center px-5 text-xs font-bold text-zinc-400 line-through">{s}</div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">⏱ Process: ~12 Hours</span>
                <ShieldCheck className="w-5 h-5 text-red-200" />
              </div>
            </div>

            {/* Vibro */}
            <div className="sc-reveal bg-white border-[2px] border-black/70 rounded-[2rem] p-10 relative overflow-hidden shadow-[14px_14px_0_rgba(198,255,61,0.2)]" data-dir="right">
              <div className="absolute top-6 right-6 text-[60px] font-black text-black/5 leading-none">02</div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-3">Neural Synthesis</h3>
              <p className="text-[#8fcc00] italic font-bold mb-8">&ldquo;Direct architectural extraction from human intent to React nodes.&rdquo;</p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Instant Token Mapping", accent: true },
                  { icon: Zap, text: "Algorithmic Layout Synthesis", accent: false },
                  { icon: Code2, text: "Direct Terminal Pull", dark: true },
                ].map(({ icon: Icon, text, accent, dark }) => (
                  <div key={text} className={`h-12 border-[3px] border-black flex items-center px-5 text-xs font-black gap-3 ${dark ? "bg-black text-white" : "bg-[#FAFAF8] text-black"}`}>
                    <Icon className={`w-4 h-4 ${accent ? "text-[#C6FF3D]" : dark ? "text-[#C6FF3D]" : "text-[#C6FF3D]"}`} />
                    {text}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-black text-[#8fcc00] uppercase tracking-widest">⚡ Process: ~400ms</span>
                <Zap className="w-5 h-5 text-[#C6FF3D] animate-pulse fill-[#C6FF3D]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. MANIFESTO + COUNTERS ─────────────────────────────────────── */}
      <ManifestoSection />

      {/* ── 6. DESIGN BOT ───────────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 relative z-10 overflow-hidden bg-[#FAFAF8] border-y-[3.5px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="sc-reveal" data-dir="left">
              <div className="inline-flex items-center gap-3 bg-black px-5 py-2 mb-8 shadow-[6px_6px_0_#C6FF3D]">
                <Activity className="w-4 h-4 text-[#C6FF3D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C6FF3D]">Engine_Core_v2.4</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-[1000] mb-8 text-black tracking-[-0.04em] uppercase leading-none">
                Imagine. <br /><span className="text-white" style={{ WebkitTextStroke: "2px black" }}>Synthesized.</span>
              </h2>
              <p className="text-xl font-bold text-zinc-500 leading-relaxed mb-12 italic max-w-xl">
                &ldquo;Vibro translates abstract intent into production-grade React architectures through deep neural mapping.&rdquo;
              </p>
              <div className="sc-stagger-group space-y-4">
                {[
                  { title: "Neuro-Mapping", text: "Translating words into precise UI components." },
                  { title: "Sovereign Build", text: "Zero dependencies. Pure, high-performance React." },
                  { title: "Instant Hydration", text: "Ready for deployment on any modern stack." },
                ].map((item, i) => (
                  <div key={i} className="sc-stagger-item flex items-center gap-5 p-6 border-[3px] border-black bg-white shadow-[6px_6px_0_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#C6FF3D] transition-all group cursor-pointer">
                    <div className="w-10 h-10 bg-[#C6FF3D] border-[2px] border-black flex items-center justify-center shrink-0 font-black text-sm">0{i + 1}</div>
                    <div>
                      <h4 className="text-sm font-black text-black uppercase tracking-widest">{item.title}</h4>
                      <p className="text-zinc-500 text-sm font-bold italic mt-0.5">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sc-reveal relative" data-dir="right">
              <div className="border-[4px] border-black bg-white p-5 shadow-[20px_20px_0_rgba(198,255,61,0.25)] rounded-[2.5rem] overflow-hidden">
                <DesignBot />
              </div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#C6FF3D]/10 blur-[80px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. DASHBOARD PREVIEW ────────────────────────────────────────── */}
      <DashboardPreviewSection />

      {/* ── 8. COMPONENT LIBRARY ────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 sc-reveal">
            <div>
              <div className="inline-flex items-center gap-3 bg-black px-5 py-2 mb-6 shadow-[5px_5px_0_#C6FF3D]">
                <Box className="w-4 h-4 text-[#C6FF3D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6FF3D]">Central_Lattice</span>
              </div>
              <h2 className="text-6xl sm:text-8xl font-[1000] tracking-[-0.05em] text-black leading-[0.85] uppercase">
                Verified <br /><span className="text-white" style={{ WebkitTextStroke: "2px black" }}>Nodes.</span>
              </h2>
            </div>
            <Link href="/dashboard/library" className="mt-8 lg:mt-0 flex items-center gap-4 bg-[#C6FF3D] border-[3px] border-black px-8 py-4 font-black uppercase tracking-widest shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#000] hover:-translate-y-0.5 transition-all group">
              Explore Library <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="sc-stagger-group grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((prompt) => (
              <div key={prompt.id} className="sc-stagger-item">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 10. INTEGRATIONS ────────────────────────────────────────────── */}
      <section className="py-32 bg-black relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#C6FF3D]/3 blur-[200px] rounded-full" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sc-reveal text-center mb-20">
            <h2 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter mb-6 italic">
              Universal <br /><span className="text-[#C6FF3D]" style={{ WebkitTextStroke: "2px white" }}>Protocol.</span>
            </h2>
            <p className="text-zinc-500 font-bold max-w-lg mx-auto text-lg italic">
              &ldquo;Vibro connects natively to any modern IDE and deployment target.&rdquo;
            </p>
          </div>

          <div className="sc-stagger-group grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { name: "Cursor", icon: "🤖", desc: "AI IDE" },
              { name: "VS Code", icon: "💻", desc: "Editor" },
              { name: "Vercel", icon: "▲", desc: "Deploy" },
              { name: "GitHub", icon: "🐙", desc: "Version" },
              { name: "Next.js", icon: "N", desc: "Framework" },
              { name: "CLI", icon: "❯_", desc: "Terminal", accent: true },
            ].map((item) => (
              <div key={item.name} className={`sc-stagger-item flex flex-col items-center justify-center p-8 border-[2px] group hover:-translate-y-2 transition-all duration-300 ${item.accent ? "bg-[#C6FF3D] border-black shadow-[6px_6px_0_#fff]" : "bg-[#0d0d0f] border-[#ffffff08] hover:border-[#C6FF3D]/30"}`}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${item.accent ? "text-black" : "text-zinc-500 group-hover:text-white"}`}>{item.name}</span>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${item.accent ? "text-black/60" : "text-zinc-700"}`}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. PRICING ─────────────────────────────────────────────────── */}
      <section className="py-32 sm:py-48 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sc-reveal text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-black px-5 py-2 mb-8 shadow-[5px_5px_0_#C6FF3D]">
              <Zap className="w-4 h-4 text-[#C6FF3D] fill-[#C6FF3D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6FF3D]">Pricing_Matrix</span>
            </div>
            <h2 className="text-6xl sm:text-8xl font-[1000] text-black tracking-[-0.05em] leading-[0.85] uppercase">
              Ship the <br /><span className="text-white" style={{ WebkitTextStroke: "2px black" }}>Unfair.</span>
            </h2>
          </div>

          <div className="sc-stagger-group grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`sc-stagger-item relative flex flex-col border-[3px] border-black transition-all ${tier.highlight ? "bg-white shadow-[12px_12px_0_#C6FF3D] scale-[1.02] z-10" : "bg-[#FAFAF8] hover:shadow-[8px_8px_0_#000] hover:-translate-y-1"}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C6FF3D] border-[2px] border-black px-4 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[3px_3px_0_#000]">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className="p-8 border-b border-black/5">
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-3">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-5xl font-[1000] tracking-tighter">{tier.price}</span>
                    {tier.period && <span className="text-zinc-400 font-bold">{tier.period}</span>}
                  </div>
                  <p className="text-zinc-500 text-sm font-bold italic">{tier.desc}</p>
                </div>
                <div className="p-8 flex-1">
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                        <div className={`w-5 h-5 rounded-sm flex items-center justify-center shrink-0 ${tier.highlight ? "bg-[#C6FF3D] border border-black" : "bg-black/5 border border-black/10"}`}>
                          <Check className="w-3 h-3 text-black" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className={`block w-full py-4 text-center font-black text-sm uppercase tracking-widest border-[2px] border-black transition-all ${tier.highlight ? "bg-black text-[#C6FF3D] shadow-[4px_4px_0_#C6FF3D] hover:shadow-[6px_6px_0_#C6FF3D] hover:-translate-y-0.5" : "bg-white text-black hover:bg-[#C6FF3D] hover:shadow-[4px_4px_0_#000]"}`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FINAL CTA ───────────────────────────────────────────────── */}
      <section className="py-40 bg-black relative z-10 overflow-hidden border-t-4 border-black">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#C6FF3D]/5 blur-[200px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative text-center z-10">
          <div className="sc-reveal mb-14">
            <div className="inline-flex items-center gap-2 border border-[#ffffff10] text-zinc-600 px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              ◈ FINAL_SYNTHESIS
            </div>
            <h2 className="text-7xl sm:text-[10rem] font-[1000] text-white uppercase tracking-[-0.06em] leading-[0.82] italic mb-10">
              Ship <br /><span className="text-[#C6FF3D]" style={{ WebkitTextStroke: "2px white" }}>Beyond.</span>
            </h2>
            <p className="text-zinc-500 font-bold italic text-xl max-w-xl mx-auto leading-relaxed">
              &ldquo;Join 12,000+ engineers building the future of interfaces with Vibro.&rdquo;
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/dashboard"
              className="bg-[#C6FF3D] border-[3px] border-black text-black font-black text-lg px-12 py-5 shadow-[8px_8px_0_#fff] hover:shadow-[12px_12px_0_#fff] hover:-translate-y-1 transition-all uppercase tracking-widest"
            >
              Enter Synthesis
            </Link>
            <Link
              href="/dashboard/library"
              className="border-[3px] border-white bg-transparent text-white font-black text-lg px-12 py-5 hover:bg-white hover:text-black transition-all uppercase tracking-widest"
            >
              Explore Archive
            </Link>
          </div>
        </div>
      </section>

      {/* ── 13. FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-white border-t-[4px] border-black pt-24 pb-12 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-black border-[2px] border-black flex items-center justify-center shadow-[4px_4px_0_#C6FF3D] overflow-hidden p-1.5">
                  <img src="/logo.png" alt="Vibro Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-[1000] text-black uppercase tracking-tighter">Vibro</span>
              </div>
              <p className="text-zinc-400 font-bold italic leading-relaxed mb-8 max-w-xs">
                &ldquo;The unified protocol for architectural synthesis. Design once, ship instantly to any modern stack.&rdquo;
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 bg-[#FAFAF8] border-[2px] border-black flex items-center justify-center hover:bg-[#C6FF3D] transition-colors shadow-[3px_3px_0_#000]">
                    <Icon className="w-4 h-4 text-black" />
                  </Link>
                ))}
              </div>
            </div>

            {[
              { title: "Engine", links: [["Synthesis", "/dashboard"], ["Library", "/dashboard/library"], ["Studio", "/dashboard/studio"], ["Editor", "/dashboard/editor"]] },
              { title: "Ecosystem", links: [["Export Center", "/dashboard/export"], ["CLI Tools", "#"], ["Integrations", "#"], ["GitHub Hub", "#"]] },
              { title: "Company", links: [["Pricing", "/dashboard/pricing"], ["Settings", "/dashboard/settings"], ["Privacy", "#"], ["Terms", "#"]] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-black mb-8"># {group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-zinc-500 font-bold hover:text-black transition-colors text-sm italic hover:underline decoration-[#C6FF3D] underline-offset-4">&ldquo;{label}&rdquo;</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t-[3px] border-black flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8fcc00]">System: Nominal</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ver: 4.2.0-stable</span>
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              © 2026 VIBRO_SYNTHESIS_CORP. ALL RIGHTS RESERVED.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
