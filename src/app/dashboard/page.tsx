"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  CreditCard,
  Building2,
  Briefcase,
  ChevronDown,
  Menu,
  Atom,
  Sparkles,
  Paperclip,
  ArrowUp,
  Folder,
  Cloud,
  LogOut,
  User,
  Zap,
  LayoutGrid,
  Sun,
  Moon,
  Hexagon,
  Layers,
  Paintbrush,
  Code2,
  Settings2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export const SYSTEM_INSTRUCTION = `Role: You are the Vibro Design Engine, a specialized AI for high-end UI Engineering.

Task: Your goal is to analyze either a TEXT prompt or an UPLOADED IMAGE and generate a production-ready Design System.

Constraints:

Output Format: You must respond ONLY with a single JSON object. No prose, no "Here is your design."

Reasoning Logic:

If an image is provided: Extract the exact hex codes, detect if corners are sharp or rounded, and identify the layout density (tight vs. airy).

If text is provided: Map the "mood" to logical design tokens (e.g., "Luxury" = Serif fonts, gold/black palette, large spacing).

The Schema: Your JSON must follow this exact structure:

JSON
{
  "metadata": { "name": "System Name", "version": "1.0" },
  "tokens": {
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "background": "#hex",
      "surface": "#hex",
      "text": "#hex"
    },
    "geometry": {
      "borderRadius": "px value",
      "borderWidth": "px value",
      "containerMaxWidth": "px value"
    },
    "typography": {
      "headingFont": "Google Font Name",
      "bodyFont": "Google Font Name",
      "baseFontSize": "16px"
    },
    "spacing": { "unit": "4px", "scale": [0, 4, 8, 16, 24, 32, 64] }
  },
  "logic": "Brief explanation of why these choices were made."
}
Tone: If you must provide text, be technical and "protocol-oriented." Use terms like 'Atomic Design', 'Semantic Tokens', and 'Spatial Systems'.`;

/**
 * Vibro Command Center
 * The high-performance entry point for Design Synthesis.
 */

// ─────────────────────────────────────────────────────────────
// DARK DASHBOARD — DO NOT TOUCH — original dark mode preserved
// ─────────────────────────────────────────────────────────────
function DarkDashboard({
  user,
  showUserMenu,
  setShowUserMenu,
  prompt,
  setPrompt,
  textareaRef,
  adjustHeight,
  handleLogout,
  handleSearch,
  recentProjects,
  placeholders,
  placeholderIndex,
  toggleTheme,
  isSynthesizing,
  currentLogIndex,
  isDragging,
  setIsDragging,
  SYSTEM_LOGS
}: any) {
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans selection:bg-[#C6FF3D] selection:text-black overflow-hidden relative">
      <style jsx global>{`
        @keyframes bgFlow {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
        .animate-grid-flow {
          animation: bgFlow 4s linear infinite;
        }
      `}</style>
      {/* ── BACKGROUND GRID (Flowing) ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none animate-grid-flow" />

      {/* ── SIDEBAR (Technical Slim) ── */}
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-[#ffffff0a] bg-[#050506] w-[64px] items-center py-8">
        <Link href="/" className="mb-12 group">
          <div className="w-10 h-10 bg-black border border-[#ffffff15] rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D]/50 transition-all shadow-[0_0_20px_rgba(198,255,61,0.1)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain" />
          </div>
        </Link>

        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard", active: true },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5" : "border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05]"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-[#C6FF3D]" : "text-zinc-600 group-hover:text-[#C6FF3D]"}`} />
              <span className="absolute left-[75px] bg-black border border-[#ffffff15] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title="Switch to Light Mode"
            className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] transition-all text-zinc-600 hover:text-[#C6FF3D]"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── HEADER ── */}
      <header className="fixed top-0 right-0 left-[64px] z-20 flex items-center justify-end p-8 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link
            href="/dashboard/pricing"
            className="hidden md:flex items-center gap-2 h-10 px-5 bg-black text-[#C6FF3D] border border-[#C6FF3D]/30 shadow-[0_0_15px_rgba(198,255,61,0.15)] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#C6FF3D] hover:text-black transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
          </Link>

          <div className="hidden md:flex items-stretch shadow-2xl">
            <Link
              href="/dashboard/library"
              className="h-10 px-6 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center hover:bg-[#C6FF3D] transition-all"
            >
              Browse Components
            </Link>
            <button className="h-10 px-3 bg-white text-black border-l border-zinc-100 hover:bg-[#C6FF3D] transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-5 h-10 bg-black border border-[#ffffff15] hover:border-[#C6FF3D]/40 transition-all group"
            >
              <div className="w-6 h-6 bg-[#C6FF3D] flex items-center justify-center shadow-[0_0_15px_rgba(198,255,61,0.2)]">
                {user?.email ? (
                  <span className="text-[10px] font-black text-black">{user.email[0].toUpperCase()}</span>
                ) : (
                  <User className="w-3.5 h-3.5 text-black" />
                )}
              </div>
              <span className="text-[11px] font-black text-zinc-400 group-hover:text-white transition-colors hidden sm:block uppercase tracking-widest">
                {user?.email?.split("@")[0] || "Guest"}
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: 20 }}
                  className="absolute top-14 right-0 w-64 bg-black border border-[#ffffff15] shadow-[15px_15px_0_rgba(198,255,61,0.05)] p-1 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-[#ffffff0a] mb-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Security Clearance</p>
                    <p className="text-xs font-bold text-white truncate mt-1.5">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-zinc-400 hover:text-white hover:bg-[#C6FF3D]/10 transition-all"
                    >
                      <Sun className="w-4 h-4" /> Switch to Light
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-zinc-400 hover:text-white hover:bg-[#C6FF3D]/10 transition-all">
                      <CreditCard className="w-4 h-4" />
                      Manage Billing
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 hover:bg-red-500/10 text-red-500 transition-all group">
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex flex-col items-center min-h-screen px-6 pt-20 pb-20 ml-[64px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[760px] flex flex-col items-center gap-8"
        >
          {/* Logo Brand */}
          <div className="flex items-center gap-6 py-4">
            <Image
              src="/logo.png"
              alt="Vibro"
              width={72}
              height={72}
              className="object-contain filter drop-shadow-[0_0_30px_rgba(198,255,61,0.15)]"
            />
            <h1 className="text-6xl font-medium text-white tracking-tight select-none font-serif">
              vibro<span className="text-[#C6FF3D] font-sans">.</span>
            </h1>
          </div>

          {/* Central Input Module */}
          <div 
            className="w-full relative group"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* handle drop logic future */ }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-[#C6FF3D] z-10" />

            <div className={`relative flex flex-col backdrop-blur-xl border px-8 py-8 overflow-visible shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all ${isDragging ? "bg-[#C6FF3D]/10 border-[#C6FF3D]/50" : "bg-[#050506]/80 border-[#ffffff10]"}`}>
              {/* Animated placeholder */}
              <div className="relative w-full min-h-[55px]">
                {isSynthesizing ? (
                  <div className="absolute inset-0 z-20 flex flex-col gap-2 py-1 pointer-events-none">
                    {SYSTEM_LOGS.slice(0, currentLogIndex + 1).map((log: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#C6FF3D] font-mono text-xs md:text-sm font-bold tracking-tight drop-shadow-[0_0_8px_rgba(198,255,61,0.5)]"
                      >
                        {log}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <>
                    {!prompt && (
                      <div className="absolute inset-0 pointer-events-none z-10 py-1">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={placeholderIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.5 }}
                            className="text-lg font-medium tracking-tight block text-zinc-700"
                          >
                            {placeholders[placeholderIndex]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => { setPrompt(e.target.value); adjustHeight(); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSearch(); }
                      }}
                      className="w-full min-h-[55px] max-h-[300px] resize-none bg-transparent border-none outline-none text-white text-lg font-medium tracking-tight z-20 relative"
                      rows={1}
                    />
                  </>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 z-20 font-medium tracking-wide">Supports .png, .jpg, and Figma URLs for visual extraction.</p>

              <div className="flex items-center justify-between mt-8 z-20">
                {/* Visual Synthesis Protocol */}
                <div className="flex-1 max-w-[480px]">
                  <div className="group/synth relative">
                    <button className="h-10 px-5 flex items-center justify-between bg-[#C6FF3D] font-black hover:bg-white transition-all relative overflow-hidden group/btn w-full max-w-[300px]">
                      <div className="flex items-center gap-3 z-10">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span className="text-[10px] uppercase tracking-[0.15em] text-black">Visual Synthesis Protocol</span>
                      </div>
                      <div className="flex items-center gap-3 z-10 border-l border-black/10 pl-3 h-full">
                        <span className="text-[7px] uppercase tracking-widest opacity-60 text-black">v.01</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    </button>

                    <div className="flex items-center gap-4 mt-3 px-1">
                      {["Upload", "Analyze", "Extract", "Export"].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">{step}</span>
                          {i < 3 && <div className="w-1 h-1 rounded-full bg-zinc-800" />}
                        </div>
                      ))}
                    </div>

                    <div className="absolute top-12 left-0 w-64 p-3 bg-black border border-[#ffffff15] shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/synth:opacity-100 group-hover/synth:translate-y-0 transition-all z-50 backdrop-blur-md">
                      <h4 className="text-[8px] font-black text-[#C6FF3D] uppercase tracking-[0.2em] mb-2">SYSTEM_EXTRACTION_PROTOCOL</h4>
                      <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                        Upload UI references to analyze layout, identify components, detect patterns, and generate a detailed prompt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-8">
                  <button className="text-zinc-600 hover:text-white transition-all">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={!prompt.trim() || isSynthesizing}
                    className={`h-10 px-6 font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-20 ${isSynthesizing ? "bg-white text-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-[#C6FF3D] text-black hover:bg-white drop-shadow-[0_0_15px_rgba(198,255,61,0.2)]"}`}
                  >
                    {isSynthesizing ? "PROCESSING..." : "SYNTHESIZE"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-[#C6FF3D] border border-white/5 bg-white/5 px-8 py-3 transition-all hover:bg-white/[0.08]">
              Create Blank Project
            </button>

            {/* DASHBOARD GRID */}
            <div className="w-full space-y-8">
              <div className="flex items-center gap-4">
                <button className="bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#C6FF3D] transition-colors">
                  <Folder className="w-3.5 h-3.5" />
                  Import
                </button>
                <div className="flex-1 h-px bg-[#ffffff0a]" />
                <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  <span className="hover:text-white cursor-pointer">Subscriptions</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="hover:text-white cursor-pointer">Settings</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Recent Syntheses</h3>
                  <button className="text-[9px] font-black text-zinc-700 hover:text-[#C6FF3D] uppercase tracking-widest flex items-center gap-2">
                    View All <span className="opacity-20">Ctrl+K</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {recentProjects.map((proj: any) => (
                    <button key={proj.id} className="w-full flex items-center justify-between p-4 bg-[#080809]/40 border border-[#ffffff05] hover:border-[#ffffff10] transition-all group">
                      <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors text-left truncate mr-8">
                        {proj.title}
                      </span>
                      <Cloud className="w-3.5 h-3.5 text-zinc-800 group-hover:text-zinc-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── AMBIENT DECOR ── */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C6FF3D]/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C6FF3D]/5 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIGHT DASHBOARD — matches dark mode structure identically
// ─────────────────────────────────────────────────────────────
function LightDashboard({
  user,
  showUserMenu,
  setShowUserMenu,
  prompt,
  setPrompt,
  textareaRef,
  adjustHeight,
  handleLogout,
  handleSearch,
  recentProjects,
  placeholders,
  placeholderIndex,
  toggleTheme,
  isSynthesizing,
  currentLogIndex,
  isDragging,
  setIsDragging,
  SYSTEM_LOGS
}: any) {
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans selection:bg-[#C6FF3D] selection:text-black overflow-hidden relative">
      <style jsx global>{`
        @keyframes bgFlowLight {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
        .animate-grid-flow-light {
          animation: bgFlowLight 4s linear infinite;
        }
      `}</style>
      {/* ── BACKGROUND GRID (Flowing - Green) ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C6FF3D60_1px,transparent_1px),linear-gradient(to_bottom,#C6FF3D60_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none animate-grid-flow-light" />

      {/* ── SIDEBAR (Technical Slim) ── */}
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-black/5 bg-[#F6F7F3] w-[64px] items-center py-8">
        <Link href="/" className="mb-12 group">
          <div className="w-10 h-10 bg-white border border-black/5 rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D] transition-all shadow-[0_0_20px_rgba(198,255,61,0.3)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain filter invert" />
          </div>
        </Link>

        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard", active: true },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/50 bg-[#C6FF3D]/10 text-black" : "border-transparent hover:border-black/5 hover:bg-black/5"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-zinc-400 group-hover:text-black"}`} />
              <span className="absolute left-[75px] bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title="Switch to Dark Mode"
            className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-black/5 hover:bg-black/5 transition-all text-zinc-400 hover:text-black"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── HEADER ── */}
      <header className="fixed top-0 right-0 left-[64px] z-20 flex items-center justify-end p-8 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link
            href="/dashboard/pricing"
            className="hidden md:flex items-center gap-2 h-10 px-5 bg-white text-black border border-black shadow-[3px_3px_0_#000000] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#C6FF3D] hover:shadow-[3px_3px_0_#C6FF3D] transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
          </Link>

          <div className="hidden md:flex items-stretch shadow-md">
            <Link
              href="/dashboard/library"
              className="h-10 px-6 bg-[#0a0a0a] text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center hover:bg-[#C6FF3D] hover:text-black transition-all"
            >
              Browse Components
            </Link>
            <button className="h-10 px-3 bg-[#0a0a0a] text-white border-l border-white/20 hover:bg-[#C6FF3D] hover:text-black transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-5 h-10 bg-white border border-black/5 hover:border-[#C6FF3D] transition-all group shadow-sm"
            >
              <div className="w-6 h-6 bg-[#C6FF3D] flex items-center justify-center shadow-[0_0_15px_rgba(198,255,61,0.4)]">
                {user?.email ? (
                  <span className="text-[10px] font-black text-black">{user.email[0].toUpperCase()}</span>
                ) : (
                  <User className="w-3.5 h-3.5 text-black" />
                )}
              </div>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-black transition-colors hidden sm:block uppercase tracking-widest">
                {user?.email?.split("@")[0] || "Guest"}
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: 20 }}
                  className="absolute top-14 right-0 w-64 bg-white border border-black/5 shadow-[15px_15px_0_rgba(198,255,61,0.15)] p-1 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-black/5 mb-2">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Security Clearance</p>
                    <p className="text-xs font-bold text-black truncate mt-1.5">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-zinc-600 hover:text-black hover:bg-black/5 transition-all"
                    >
                      <Moon className="w-4 h-4" /> Switch to Dark
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase text-zinc-600 hover:text-black hover:bg-black/5 transition-all">
                      <CreditCard className="w-4 h-4" />
                      Manage Billing
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 hover:bg-red-50 text-red-500 transition-all group">
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex flex-col items-center min-h-screen px-6 pt-20 pb-20 ml-[64px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[760px] flex flex-col items-center gap-8"
        >
          {/* Logo Brand */}
          <div className="flex items-center gap-6 py-4">
            <Image
              src="/logo.png"
              alt="Vibro"
              width={72}
              height={72}
              className="object-contain filter invert drop-shadow-[0_0_20px_rgba(198,255,61,0.5)]"
            />
            <h1 className="text-6xl font-medium text-black tracking-tight select-none font-serif">
              vibro<span className="text-[#C6FF3D] font-sans">.</span>
            </h1>
          </div>

          {/* Central Input Module */}
          <div 
            className="w-full relative group"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* handle drop logic future */ }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-[#C6FF3D] z-10" />

            <div className={`relative flex flex-col backdrop-blur-xl border px-8 py-8 overflow-visible shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all ${isDragging ? "bg-[rgba(186,255,41,0.1)] border-[#C6FF3D]" : "bg-white/80 border-black/5"}`}>
              {/* Animated placeholder */}
              <div className="relative w-full min-h-[55px]">
                {isSynthesizing ? (
                  <div className="absolute inset-0 z-20 flex flex-col gap-2 py-1 pointer-events-none">
                    {SYSTEM_LOGS.slice(0, currentLogIndex + 1).map((log: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-black font-mono text-xs md:text-sm font-bold tracking-tight bg-[#C6FF3D] inline-flex w-max px-1"
                      >
                        {log}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <>
                    {!prompt && (
                      <div className="absolute inset-0 pointer-events-none z-10 py-1">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={placeholderIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.5 }}
                            className="text-lg font-medium tracking-tight block text-zinc-400"
                          >
                            {placeholders[placeholderIndex]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => { setPrompt(e.target.value); adjustHeight(); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSearch(); }
                      }}
                      className="w-full min-h-[55px] max-h-[300px] resize-none bg-transparent border-none outline-none text-black text-lg font-medium tracking-tight z-20 relative"
                      rows={1}
                    />
                  </>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 z-20 font-medium tracking-wide">Supports .png, .jpg, and Figma URLs for visual extraction.</p>

              <div className="flex items-center justify-between mt-8 z-20">
                {/* Visual Synthesis Protocol */}
                <div className="flex-1 max-w-[480px]">
                  <div className="group/synth relative">
                    <button className="h-10 px-5 flex items-center justify-between bg-[#C6FF3D] font-black hover:bg-[#0a0a0a] hover:text-white transition-all relative overflow-hidden group/btn w-full max-w-[300px] text-black">
                      <div className="flex items-center gap-3 z-10">
                        <Sparkles className="w-3.5 h-3.5 text-current" />
                        <span className="text-[10px] uppercase tracking-[0.15em] text-current">Visual Synthesis Protocol</span>
                      </div>
                      <div className="flex items-center gap-3 z-10 border-l border-current/20 pl-3 h-full">
                        <span className="text-[7px] uppercase tracking-widest opacity-60 text-current">v.01</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    </button>

                    <div className="flex items-center gap-4 mt-3 px-1">
                      {["Upload", "Analyze", "Extract", "Export"].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{step}</span>
                          {i < 3 && <div className="w-1 h-1 rounded-full bg-zinc-300" />}
                        </div>
                      ))}
                    </div>

                    <div className="absolute top-12 left-0 w-64 p-3 bg-white border border-black/5 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/synth:opacity-100 group-hover/synth:translate-y-0 transition-all z-50 backdrop-blur-md">
                      <h4 className="text-[8px] font-black text-[#C6FF3D] uppercase tracking-[0.2em] mb-2">SYSTEM_EXTRACTION_PROTOCOL</h4>
                      <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                        Upload UI references to analyze layout, identify components, detect patterns, and generate a detailed prompt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-8">
                  <button className="text-zinc-400 hover:text-black transition-all">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={!prompt.trim() || isSynthesizing}
                    className={`h-10 px-6 font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-20 ${isSynthesizing ? "bg-black text-[#C6FF3D] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" : "bg-[#C6FF3D] text-black hover:bg-[#0a0a0a] hover:text-white drop-shadow-[0_0_10px_rgba(198,255,61,0.2)]"}`}
                  >
                    {isSynthesizing ? "PROCESSING..." : "SYNTHESIZE"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black border border-black/5 bg-black/[0.03] px-8 py-3 transition-all hover:bg-black/[0.06]">
              Create Blank Project
            </button>

            {/* DASHBOARD GRID */}
            <div className="w-full space-y-8">
              <div className="flex items-center gap-4">
                <button className="bg-[#0a0a0a] text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#C6FF3D] hover:text-black transition-colors">
                  <Folder className="w-3.5 h-3.5" />
                  Import
                </button>
                <div className="flex-1 h-px bg-black/5" />
                <div className="flex items-center gap-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  <span className="hover:text-black cursor-pointer">Subscriptions</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span className="hover:text-black cursor-pointer">Settings</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Syntheses</h3>
                  <button className="text-[9px] font-black text-zinc-500 hover:text-black uppercase tracking-widest flex items-center gap-2">
                    View All <span className="opacity-40">Ctrl+K</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {recentProjects.map((proj: any) => (
                    <button key={proj.id} className="w-full flex items-center justify-between p-4 bg-white/60 border border-black/5 hover:border-black/10 hover:bg-white transition-all group">
                      <span className="text-xs font-bold text-zinc-600 group-hover:text-black transition-colors text-left truncate mr-8">
                        {proj.title}
                      </span>
                      <Cloud className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── AMBIENT DECOR ── */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C6FF3D]/10 blur-[200px] rounded-full pointer-events-none" />
      <div className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C6FF3D]/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMMAND CENTER — orchestrates shared state, picks which dashboard
// ─────────────────────────────────────────────────────────────
function CommandCenter() {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const SYSTEM_LOGS = [
    "> INITIALIZING VISUAL SCAN...",
    "> DETECTING COLOR HARMONICS AND SEMANTIC TOKENS...",
    "> EXTRACTING SPACING RHYTHM AND BORDER RADIUS...",
    "> MAPPING ATOMIC COMPONENTS TO SYSTEM Blueprints...",
    "> PROTOCOL COMPLETE. GENERATING STUDIO VIEW."
  ];

  const placeholders = [
    "Vibe a design system from a prompt or drop a UI screenshot_",
    "Describe a layout or paste a Figma URL for extraction_",
    "Generate a cybernetic E-commerce brand with neon accents_",
    "Vibe a professional healthcare interface with clean spacing_",
    "Design a brutalist web3 dashboard with custom tokens_",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleSearch = () => {
    if (prompt.trim()) {
      setIsSynthesizing(true);
      setCurrentLogIndex(0);

      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        if (idx < SYSTEM_LOGS.length) {
          setCurrentLogIndex(idx);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/dashboard/workstation?prompt=${encodeURIComponent(prompt)}`);
          }, 600);
        }
      }, 500);
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "55px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }
  };

  const recentProjects = [
    { id: 1, title: "Modern E-commerce Dashboard with biometric authentication and GSAP transitions", type: "Cloud" },
    { id: 2, title: "Fintech App Interface - Dark Mode Protocol", type: "Local" },
    { id: 3, title: "Portfolio Synthesis Engine - Architectural Layout", type: "Cloud" },
  ];

  const shared = {
    user, showUserMenu, setShowUserMenu,
    prompt, setPrompt, textareaRef, adjustHeight,
    handleLogout, handleSearch,
    recentProjects, placeholders, placeholderIndex,
    toggleTheme,
    isSynthesizing, currentLogIndex, isDragging, setIsDragging, SYSTEM_LOGS
  };

  return theme === "light" ? <LightDashboard {...shared} /> : <DarkDashboard {...shared} />;
}

export default function WorkstationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#050506]"><Zap className="w-12 h-12 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" /></div>}>
      <CommandCenter />
    </Suspense>
  );
}
