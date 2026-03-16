"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Category, Prompt } from "@/lib/types";
import {
  Code2, Zap, Github, Twitter, Linkedin,
  Cpu, Layout, Terminal, Download, Sliders, ArrowUpRight, Check, ArrowRight,
  Upload, Palette, FileJson, Box
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DashboardPreviewSection from "@/components/DashboardPreviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GridBackground from "@/components/GridBackground";

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

  useGSAP(() => {
    // Reveal all elements with sc-reveal class as they scroll into view
    const items = gsap.utils.toArray<HTMLElement>(".sc-reveal");
    items.forEach((el) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        duration: 0.8, ease: "power3.out",
        scrollTrigger: { 
          trigger: el, 
          start: "top 90%", 
          toggleActions: "play none none none" 
        },
      });
    });

    // Stagger groupings for list items
    const groups = gsap.utils.toArray<HTMLElement>(".sc-stagger-group");
    groups.forEach((group) => {
      const children = group.querySelectorAll(".sc-stagger-item");
      if (!children.length) return;
      gsap.fromTo(children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-[#FFFCF2] font-space-grotesk min-h-screen">
      
      {/* ── GLOBAL BACKGROUND ── */}
      <GridBackground forceTheme="light" />

      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. SYSTEM PROTOCOL MARQUEE ────────────────────────────────── */}
      <section className="border-y-[4px] border-black bg-white py-0 relative z-10 overflow-hidden">
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap py-10 items-center">
          {[1, 2, 3].map((g) => (
            <div key={g} className="flex items-center gap-12 px-8">
              <span className="text-[12px] font-[900] text-black/10 uppercase tracking-[1em]">SYSTEM_PROTOCOL</span>
              {[
                { label: "NEXT.JS 15",  icon: "⚡",   bg: "bg-[#F3F3F3]"        },
                { label: "TAILWIND V4", icon: null,   bg: "bg-[#C6FF3D]"        },
                { label: "AI AGENTIC", icon: "❆",     bg: "bg-white"            },
                { label: "REACT 19",   icon: "⚛",     bg: "bg-[#F3F3F3]"        },
                { label: "GSAP PRO",   icon: "▶",     bg: "bg-black", dark: true },
                { label: "SUPABASE",   icon: "🪄",     bg: "bg-white"            },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 ${item.bg} border-[2px] border-black px-6 py-3 shadow-[4px_4px_0_rgba(0,0,0,1)]`}>
                  {item.icon && <span>{item.icon}</span>}
                  <span className={`text-[13px] font-[900] uppercase tracking-widest ${
                    item.dark ? "text-[#C6FF3D]" : "text-black"
                  }`}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── 4. FEATURE 1: AI DESIGN SYSTEM GENERATOR ─────────────────────── */}
      <section className="py-40 relative z-10 border-b-[4px] border-black overflow-hidden bg-[#FFFCF2]">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sc-reveal mb-24">
            <div className="inline-flex items-center gap-3 bg-black text-[#C6FF3D] px-6 py-2 border-[2px] border-black font-[900] text-[11px] uppercase tracking-[0.4em] mb-10 shadow-[6px_6px_0_#C6FF3D]">
              <Cpu className="w-4 h-4" /> Feature 01 — AI Design System Generator
            </div>
            <h2 className="text-7xl sm:text-9xl font-[1000] text-black tracking-[-0.05em] leading-[0.82] uppercase mb-8">
              A System,<br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[4px] border-black shadow-[15px_15px_0_rgba(0,0,0,1)] mt-4">Not Just UI.</span>
            </h2>
            <p className="text-xl font-bold text-zinc-600 max-w-2xl leading-relaxed italic">
              Describe what you want to build, or upload any UI screenshot. Vibro generates a complete, fully editable design system — not random UI output.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Token output cards */}
            <div className="sc-stagger-group grid grid-cols-2 gap-6">
              {[
                { icon: Palette, label: "Color System", desc: "Primary, secondary, neutral, semantic — all extracted and tokenized", items: ["#C6FF3D", "#0D0D0D", "#1a1a1a", "#fafafa", "#ef4444", "#3b82f6"] },
                { icon: Layout, label: "Typography", desc: "Font families, sizes, weights, line heights, letter-spacing", textSizes: ["H1: 72px/1000", "H2: 48px/900", "Body: 16px/700", "Caption: 11px/900"] },
                { icon: Sliders, label: "Spacing Scale", desc: "8-point grid system with tokens for all spacing values", spacings: [4, 8, 16, 24, 32, 48] },
                { icon: FileJson, label: "Export Tokens", desc: "Export as CSS variables, Tailwind config, or JSON for any AI tool", exports: ["CSS Vars", "Tailwind", "JSON", "CLI"] },
              ].map((card, i) => (
                <div key={i} className="sc-stagger-item p-8 border-[3px] border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_#C6FF3D] hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 bg-black border-[2px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0_#C6FF3D] group-hover:bg-[#C6FF3D] transition-colors">
                    <card.icon className="w-6 h-6 text-[#C6FF3D] group-hover:text-black" />
                  </div>
                  <h3 className="text-[14px] font-[900] uppercase tracking-widest mb-2">{card.label}</h3>
                  <p className="text-[12px] font-bold text-zinc-500 italic leading-relaxed mb-4">{card.desc}</p>
                  {card.items && (
                    <div className="flex gap-2 flex-wrap">
                      {card.items.map(c => <div key={c} className="w-7 h-7 border border-black/10" style={{ backgroundColor: c }} />)}
                    </div>
                  )}
                  {card.textSizes && (
                    <div className="space-y-2">
                      {card.textSizes.map(t => <div key={t} className="text-[10px] font-mono text-zinc-500 border-l-2 border-[#C6FF3D] pl-2">{t}</div>)}
                    </div>
                  )}
                  {card.spacings && (
                    <div className="flex flex-col gap-1">
                      {card.spacings.map(s => (
                        <div key={s} className="flex items-center gap-2">
                          <div className="h-1.5 bg-[#C6FF3D]" style={{ width: `${(s / 48) * 100}%` }} />
                          <span className="text-[9px] font-mono text-zinc-500">{s}px</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {card.exports && (
                    <div className="flex flex-wrap gap-2">
                      {card.exports.map(e => <span key={e} className="px-3 py-1 bg-black text-[#C6FF3D] text-[10px] font-[900] uppercase tracking-widest">{e}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feature detail right */}
            <div className="sc-reveal">
              <div className="bg-black border-[4px] border-black p-10 shadow-[15px_15px_0_#C6FF3D] mb-8">
                <p className="text-[10px] font-[900] text-[#C6FF3D] uppercase tracking-[0.4em] mb-6">What gets generated:</p>
                <div className="space-y-4">
                  {[
                    "Color tokens — primary, secondary, neutral, semantic",
                    "Typography system — sizes, weights, families, spacing",
                    "Spacing scale — 8-point grid, all token values",
                    "Border radius — from sharp to pill, all variants",
                    "Shadow system — elevation levels 1–5",
                    "Component styles — buttons, cards, inputs, badges",
                    "Light + Dark theme logic — auto-generated",
                    "Reusable design tokens — ready for production",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-5 h-5 bg-[#C6FF3D] border-[2px] border-black flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      </div>
                      <span className="text-[13px] font-bold text-white uppercase tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/dashboard" className="flex items-center gap-4 bg-[#C6FF3D] border-[3px] border-black px-10 py-5 font-[900] uppercase tracking-widest shadow-[10px_10px_0_rgba(0,0,0,1)] hover:shadow-[14px_14px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all group text-lg">
                Generate My System <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. MANIFESTO ─────────────────────────────────────────────────── */}
      <ManifestoSection />

      {/* ── 6. FEATURE 2: COMPONENT LIBRARY + VISUAL EDITOR ──────────────── */}
      <section className="py-40 relative z-10 overflow-hidden bg-[#F3F3F3] border-b-[4px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sc-reveal mb-20">
            <div className="inline-flex items-center gap-3 bg-black px-6 py-2 mb-10 shadow-[6px_6px_0_#C6FF3D] border-[2px] border-black">
              <Layout className="w-5 h-5 text-[#C6FF3D]" />
              <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#C6FF3D]">Feature 02 — Component Library + Visual Editor</span>
            </div>
            <h2 className="text-6xl sm:text-8xl font-[1000] mb-6 text-black tracking-[-0.04em] uppercase leading-[0.9]">
              Browse. Edit. <br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[3px] border-black shadow-[10px_10px_0_rgba(0,0,0,1)] mt-3">Ship.</span>
            </h2>
            <p className="text-xl font-bold text-zinc-600 leading-relaxed max-w-2xl italic">
              A full component library where every UI part is theme-aware. Open any component in the visual editor, customize it to your design system, and export.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 mb-16">
            {/* Library */}
            <div className="sc-reveal p-10 border-[4px] border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_#C6FF3D] hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-[#C6FF3D] border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <Box className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-[22px] font-[900] uppercase tracking-tighter mb-4">Component Library</h3>
              <p className="text-zinc-600 font-bold leading-relaxed mb-8 italic">Browse, filter, and preview reusable UI parts — all theme-aware.</p>
              <div className="flex flex-wrap gap-2">
                {["Buttons", "Cards", "Navbars", "Sidebars", "Forms", "Tables", "Hero Sections", "Dashboards", "+ more"].map(c => (
                  <span key={c} className="px-3 py-1.5 bg-[#F3F3F3] border-[2px] border-black text-[10px] font-[900] uppercase tracking-widest hover:bg-[#C6FF3D] transition-colors cursor-pointer">{c}</span>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="sc-reveal p-10 border-[4px] border-black bg-black shadow-[10px_10px_0_#C6FF3D] hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-[#C6FF3D] border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <Sliders className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-[22px] font-[900] uppercase tracking-tighter mb-4 text-white">Visual Component Editor</h3>
              <p className="text-zinc-400 font-bold leading-relaxed mb-8 italic">Customize any component without writing code. Change text, colors, spacing, variants.</p>
              <div className="space-y-3">
                {["Change text content", "Swap colors from your system", "Edit spacing and sizing", "Switch variants + states", "Preview responsive layouts"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#C6FF3D] border-[2px] border-black flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span className="text-[12px] font-bold text-zinc-300 uppercase tracking-tight">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flow */}
            <div className="sc-reveal p-10 border-[4px] border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_#C6FF3D] hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-black border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0_#C6FF3D]">
                <ArrowRight className="w-7 h-7 text-[#C6FF3D]" />
              </div>
              <h3 className="text-[22px] font-[900] uppercase tracking-tighter mb-4">The Library Flow</h3>
              <p className="text-zinc-600 font-bold leading-relaxed mb-8 italic">Every step is intentional. Find, customize, prepare, export.</p>
              <div className="space-y-3">
                {["Library — browse all components", "Editor — customize selected", "Preview — check responsiveness", "Save — store your versions", "Export — prompt / AI / code"].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border-[2px] border-black bg-[#F3F3F3]">
                    <span className="text-[11px] font-[900] font-mono text-zinc-500">0{i+1}</span>
                    <span className="text-[12px] font-[900] uppercase tracking-tight">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard/library" className="inline-flex items-center gap-4 bg-black text-[#C6FF3D] font-[900] text-xl uppercase tracking-widest px-12 py-5 border-[3px] border-black shadow-[10px_10px_0_#C6FF3D] hover:shadow-[14px_14px_0_#C6FF3D] hover:-translate-y-1 transition-all group">
              Browse Component Library <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform stroke-[3]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. DASHBOARD PREVIEW ─────────────────────────────────────────── */}
      <DashboardPreviewSection />

      {/* ── 8. FEATURE 3: REFERENCE-TO-SYSTEM + EXPORT ENGINE ────────────── */}
      <section className="py-40 bg-[#FFFCF2] relative z-10 border-b-[4px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sc-reveal mb-20">
            <div className="inline-flex items-center gap-4 bg-black px-6 py-2 mb-8 shadow-[6px_6px_0_#C6FF3D] border-[2px] border-black">
              <Upload className="w-5 h-5 text-[#C6FF3D]" />
              <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#C6FF3D]">Feature 03 — Reference-to-System + Export Engine</span>
            </div>
            <h2 className="text-7xl sm:text-9xl font-[1000] tracking-[-0.05em] text-black leading-[0.82] uppercase mb-6">
              Upload. Extract. <br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[4px] border-black shadow-[15px_15px_0_rgba(0,0,0,1)] mt-4">Build.</span>
            </h2>
            <p className="text-xl font-bold text-zinc-600 max-w-2xl leading-relaxed italic">
              Upload any UI reference — a screenshot, dashboard, or homepage. Vibro analyzes the layout, extracts the design system, and rebuilds it into a fully editable system you can export anywhere.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left: What Vibro detects */}
            <div className="sc-reveal space-y-6">
              <p className="text-[11px] font-[900] uppercase tracking-[0.5em] text-zinc-400 mb-8">What Vibro Detects from a Reference:</p>
              {[
                { num: "01", label: "Layout Analysis", desc: "Detects grid systems, section hierarchy, whitespace rhythm, and page structure.", code: "↳ 12-column grid · 24px gutter · 80px section padding" },
                { num: "02", label: "Component Detection", desc: "Identifies navbars, cards, buttons, forms, tables, and hero sections.", code: "↳ Nav · HeroCard × 3 · CTA Button · Stat Row · Footer" },
                { num: "03", label: "Color Extraction", desc: "Builds a full named color palette from the visual reference including semantic values.", code: "↳ #0D0D0D · #C6FF3D · #F3F3F3 · #ef4444 + 12 more" },
                { num: "04", label: "Typography Style", desc: "Extracts font candidates, size scale, weight distribution, and line height.", code: "↳ Inter Bold 48/1000 · Medium 16/700 · Light 12/400" },
                { num: "05", label: "Spacing Rhythm", desc: "Reconstructs the spacing scale used throughout the layout.", code: "↳ 4 · 8 · 16 · 24 · 32 · 48 · 64 · 96px" },
              ].map((item, i) => (
                <div key={i} className="sc-stagger-item flex gap-6 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,0.08)] hover:shadow-[8px_8px_0_#C6FF3D] hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 bg-[#C6FF3D] border-[2px] border-black flex items-center justify-center font-[900] text-[12px] shrink-0">{item.num}</div>
                  <div>
                    <h4 className="text-[14px] font-[900] uppercase tracking-widest mb-1">{item.label}</h4>
                    <p className="text-[12px] font-bold text-zinc-500 italic leading-relaxed mb-3">{item.desc}</p>
                    <code className="text-[10px] font-mono text-zinc-500 bg-[#F3F3F3] border border-black/10 px-3 py-1.5 block">{item.code}</code>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Export options */}
            <div className="sc-reveal space-y-8">
              <div className="bg-black border-[4px] border-black p-10 shadow-[15px_15px_0_#C6FF3D]">
                <p className="text-[10px] font-[900] text-[#C6FF3D] uppercase tracking-[0.5em] mb-8">Then Export As:</p>
                <div className="space-y-5">
                  {[
                    { icon: Zap, label: "Detailed Build Prompt", desc: "A structured, AI-ready prompt with all design system specs for Cursor, ChatGPT, or any other tool." },
                    { icon: Code2, label: "AI Context Package", desc: "Export your system as structured context to inject into any AI coding workflow." },
                    { icon: Terminal, label: "CLI Install", desc: "Install components directly into your Next.js, React, or Vite project with one command." },
                    { icon: Download, label: "JSON Tokens", desc: "Standard design token JSON (W3C format) compatible with Style Dictionary, Theo, and more." },
                  ].map(({ icon: Icon, label, desc }, i) => (
                    <div key={i} className="flex items-start gap-5 p-6 border-[2px] border-zinc-800 bg-zinc-900 hover:border-[#C6FF3D]/40 hover:bg-zinc-800 transition-all group cursor-pointer">
                      <div className="w-10 h-10 bg-[#C6FF3D] border-[2px] border-black flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-[900] text-white uppercase tracking-widest mb-1">{label}</h4>
                        <p className="text-[12px] font-bold text-zinc-500 italic leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#C6FF3D] border-[4px] border-black p-8 shadow-[10px_10px_0_rgba(0,0,0,1)]">
                <p className="text-[11px] font-[900] uppercase tracking-[0.4em] mb-3">CLI Example</p>
                <code className="font-mono text-[13px] block">
                  npx vibro-cli install \
                </code>
                <code className="font-mono text-[13px] block">
                  &nbsp;&nbsp;--system fintech-dark \
                </code>
                <code className="font-mono text-[13px] block">
                  &nbsp;&nbsp;--format css-vars,tailwind
                </code>
              </div>

              <Link href="/dashboard" className="flex items-center justify-center gap-4 bg-black border-[3px] border-black px-10 py-5 font-[900] uppercase tracking-widest shadow-[10px_10px_0_rgba(0,0,0,1)] hover:shadow-[14px_14px_0_#C6FF3D] hover:-translate-y-1 transition-all group text-[#C6FF3D] text-lg">
                Try Reference Upload <Upload className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 10. INTEGRATIONS ────────────────────────────────────────────── */}
      <section className="py-40 bg-black relative z-10 overflow-hidden border-b-[4px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sc-reveal text-center mb-24">
            <h2 className="text-7xl sm:text-9xl font-[1000] text-white uppercase tracking-[-0.04em] leading-none italic mb-8">
              Universal <br /><span className="text-black bg-[#C6FF3D] inline-block px-6 border-[3px] border-black shadow-[12px_12px_0_rgba(255,255,255,0.1)] not-italic mt-3">Protocol.</span>
            </h2>
            <p className="text-zinc-500 font-[700] max-w-lg mx-auto text-xl italic uppercase tracking-tighter">
              &ldquo;Vibro connects natively to any modern IDE and deployment target.&rdquo;
            </p>
          </div>

          <div className="sc-stagger-group grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: "Cursor", icon: "🤖", desc: "AI IDE" },
              { name: "VS Code", icon: "💻", desc: "Editor" },
              { name: "Vercel", icon: "▲", desc: "Deploy" },
              { name: "GitHub", icon: "🐙", desc: "Version" },
              { name: "Next.js", icon: "N", desc: "Framework" },
              { name: "CLI", icon: "❯_", desc: "Terminal", accent: true },
            ].map((item) => (
              <div key={item.name} className={`sc-stagger-item flex flex-col items-center justify-center p-10 border-[3px] group hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0_rgba(255,255,255,0.05)] ${item.accent ? "bg-[#C6FF3D] border-black shadow-[10px_10px_0_#fff]" : "bg-[#0d0d0f] border-zinc-900 shadow-none hover:border-[#C6FF3D] hover:shadow-[10px_10px_0_rgba(198,255,61,0.2)]"}`}>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className={`text-[13px] font-[900] uppercase tracking-widest ${item.accent ? "text-black" : "text-zinc-500 group-hover:text-white"}`}>{item.name}</span>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-2 ${item.accent ? "text-black/60" : "text-zinc-800"}`}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. PRICING ─────────────────────────────────────────────────── */}
      <section className="py-40 bg-[#FFFCF2] relative z-10 border-b-[4px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sc-reveal text-center mb-28">
            <div className="inline-flex items-center gap-3 bg-black text-[#C6FF3D] px-6 py-2 mb-10 shadow-[6px_6px_0_rgba(0,0,0,1)] border-[2px] border-black">
              <Zap className="w-5 h-5 text-[#C6FF3D] fill-[#C6FF3D]" />
              <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#C6FF3D]">Pricing_Matrix</span>
            </div>
            <h2 className="text-7xl sm:text-9xl font-[1000] text-black tracking-[-0.05em] leading-[0.82] uppercase mb-4">
              Ship the <br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[4px] border-black shadow-[15px_15px_0_rgba(0,0,0,1)] mt-4">Unfair.</span>
            </h2>
          </div>

          <div className="sc-stagger-group grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`sc-stagger-item relative flex flex-col border-[4px] border-black transition-all rounded-none ${tier.highlight ? "bg-white shadow-[20px_20px_0_#C6FF3D] z-10 scale-[1.04]" : "bg-white shadow-[12px_12px_0_rgba(0,0,0,1)] hover:shadow-[16px_16px_0_rgba(0,0,0,1)] hover:-translate-y-1"}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C6FF3D] border-[3px] border-black px-6 py-1.5 text-[10px] font-[1000] uppercase tracking-[0.3em] flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] z-20">
                    <Zap className="w-4 h-4 fill-black" /> Signal: Optimal
                  </div>
                )}
                <div className="p-10 border-b-[3px] border-black">
                  <h3 className="text-2xl font-[1000] text-black uppercase tracking-tighter mb-4">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-[1000] tracking-tighter">{tier.price}</span>
                    {tier.period && <span className="text-zinc-400 font-black text-xl">{tier.period}</span>}
                  </div>
                  <p className="text-zinc-500 text-sm font-bold italic uppercase tracking-tight">{tier.desc}</p>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <ul className="space-y-5 mb-12 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-4 text-[13px] font-[900] text-black uppercase tracking-tight">
                        <div className={`w-6 h-6 border-[2px] border-black flex items-center justify-center shrink-0 ${tier.highlight ? "bg-[#C6FF3D]" : "bg-[#F3F3F3]"}`}>
                          <Check className="w-3.5 h-3.5 text-black stroke-[4]" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className={`block w-full py-5 text-center font-[900] text-[15px] uppercase tracking-widest border-[3px] border-black transition-all ${tier.highlight ? "bg-black text-[#C6FF3D] shadow-[6px_6px_0_#C6FF3D] hover:shadow-[10px_10px_0_#C6FF3D] hover:-translate-y-1" : "bg-white text-black hover:bg-[#C6FF3D] hover:shadow-[6px_6px_0_rgba(0,0,0,1)]"}`}
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
      <section className="py-56 bg-black relative z-10 border-b-[8px] border-black overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative text-center z-10">
          <div className="sc-reveal mb-20">
            <div className="inline-flex items-center gap-3 border-[2px] border-[#ffffff20] text-zinc-500 px-6 py-2 text-[11px] font-[900] uppercase tracking-[0.5em] mb-14 bg-white/5">
              ◈ FINAL_SYNTHESIS_REQUEST
            </div>
            <h2 className="text-7xl sm:text-[11rem] font-[1000] text-white uppercase tracking-[-0.05em] leading-[0.8] italic mb-14">
              Ship <br /><span className="text-black bg-[#C6FF3D] inline-block px-8 border-[4px] border-black shadow-[20px_20px_0_rgba(255,255,255,0.1)] not-italic mt-4">Beyond.</span>
            </h2>
            <p className="text-zinc-500 font-[700] italic text-2xl max-w-xl mx-auto leading-relaxed uppercase tracking-tighter">
              &ldquo;Join 12,000+ engineers building the future of interfaces with Vibro.&rdquo;
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <Link
              href="/dashboard"
              className="bg-[#C6FF3D] border-[4px] border-black text-black font-[1000] text-2xl px-16 py-6 shadow-[12px_12px_0_#fff] hover:shadow-[18px_18px_0_#fff] hover:-translate-y-2 transition-all uppercase tracking-[0.1em]"
            >
              Enter Synthesis
            </Link>
          </div>
        </div>
      </section>

      {/* ── 13. FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-white pt-32 pb-16 relative z-20 font-space-grotesk">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-12 h-12 bg-black border-[3px] border-black flex items-center justify-center shadow-[5px_5px_0_#C6FF3D] p-2">
                  <img src="/logo.png" alt="Vibro Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-4xl font-[1000] text-black uppercase tracking-tighter">Vibro</span>
              </div>
              <p className="text-zinc-500 font-bold italic leading-relaxed mb-10 max-w-xs uppercase tracking-tight opacity-70">
                &ldquo;The unified protocol for architectural synthesis. Design once, ship instantly.&rdquo;
              </p>
              <div className="flex gap-5">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center hover:bg-[#C6FF3D] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    <Icon className="w-5 h-5 text-black" />
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
                <h4 className="text-[12px] font-[1000] uppercase tracking-[0.5em] text-black mb-10"># {group.title}</h4>
                <ul className="space-y-5">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-zinc-600 font-[800] hover:text-black transition-all text-[15px] uppercase tracking-tight flex items-center gap-2 group">
                        <div className="w-2 h-2 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-16 border-t-[4px] border-black flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#C6FF3D] border-[2px] border-black animate-pulse" />
                <span className="text-[11px] font-[1000] uppercase tracking-widest text-[#8fcc00]">System: Nominal</span>
              </div>
              <span className="text-[11px] font-[1000] uppercase tracking-widest text-zinc-400">Ver: 4.2.0-stable</span>
            </div>
            <span className="text-[11px] font-[1000] text-zinc-400 uppercase tracking-widest bg-black text-white px-4 py-1 border-[2px] border-black">
              © 2026 VIBRO_SYNTHESIS_CORP.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
