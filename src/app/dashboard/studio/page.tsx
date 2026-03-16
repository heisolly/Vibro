"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut, Palette, Type, Ruler, Component, Sun, Moon, ChevronRight,
  Zap, Hexagon, Layers, Paintbrush, Code2, CreditCard, Settings2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";

const TOKEN_CATEGORIES = [
  { id: "colors", icon: Palette, label: "Colors" },
  { id: "typography", icon: Type, label: "Typography" },
  { id: "spacing", icon: Ruler, label: "Spacing" },
  { id: "radius", icon: Component, label: "Radius & Shadows" },
  { id: "themes", icon: Sun, label: "Themes" },
];

const MOCK_COLORS = [
  { name: "Primary", value: "#C6FF3D", role: "Accent" },
  { name: "Background", value: "#050506", role: "Surface" },
  { name: "Surface", value: "#0d0d0f", role: "Card" },
  { name: "Border", value: "#ffffff15", role: "Stroke" },
  { name: "Text Primary", value: "#ffffff", role: "Text" },
  { name: "Text Secondary", value: "#71717a", role: "Muted" },
];

const MOCK_TYPE_SCALE = [
  { label: "Display", size: "48px", weight: "900", sample: "The future of design" },
  { label: "H1", size: "36px", weight: "800", sample: "Build systems fast" },
  { label: "H2", size: "28px", weight: "700", sample: "Component library" },
  { label: "H3", size: "22px", weight: "700", sample: "Visual editor" },
  { label: "Body", size: "16px", weight: "500", sample: "Describe what you want to build" },
  { label: "Caption", size: "12px", weight: "400", sample: "Design token reference" },
];

const SPACING_SCALE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

function DarkStudio({ activeCategory, setActiveCategory, activeTheme, setActiveTheme, handleLogout, toggleTheme }: any) {
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      {/* ── SIDEBAR ── */}
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-[#ffffff0a] bg-[#050506] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-black border border-[#ffffff15] rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D]/50 transition-all shadow-[0_0_20px_rgba(198,255,61,0.1)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio", active: true },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5" : "border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05]"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-[#C6FF3D]" : "text-zinc-600 group-hover:text-[#C6FF3D]"}`} />
              <span className="absolute left-[75px] bg-black border border-[#ffffff15] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] translate-x-[-10px] group-hover:translate-x-0">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <button onClick={toggleTheme} title="Switch to Light Mode" className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] transition-all text-zinc-600 hover:text-[#C6FF3D]">
            <Sun className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 ml-[64px]">
        {/* ── TOKEN CATEGORY SIDEBAR ── */}
        <aside className="w-[200px] min-h-screen border-r border-[#ffffff0a] flex flex-col pt-8 px-4 gap-1.5 shrink-0">
          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 px-3">Design Tokens</p>
          {TOKEN_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all group ${activeCategory === cat.id ? "bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-white" : "border border-transparent hover:border-[#ffffff08] text-zinc-500 hover:text-white"}`}>
              <cat.icon className={`w-4 h-4 shrink-0 ${activeCategory === cat.id ? "text-[#C6FF3D]" : "text-zinc-600 group-hover:text-zinc-400"}`} />
              <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
          <div className="mt-auto pb-8 pt-4">
            <div className="border border-[#C6FF3D]/20 bg-[#C6FF3D]/5 px-3 py-4">
              <p className="text-[9px] font-black text-[#C6FF3D] uppercase tracking-widest mb-1">System Status</p>
              <p className="text-[10px] text-zinc-500">Mock data — connect AI to generate live tokens</p>
            </div>
          </div>
        </aside>

        {/* ── TOKEN EDITOR PANEL ── */}
        <main className="flex-1 px-10 pt-10 pb-20 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link href="/dashboard" className="text-zinc-700 hover:text-zinc-400 transition-colors text-[10px] font-black uppercase tracking-widest">Dashboard</Link>
                <ChevronRight className="w-3 h-3 text-zinc-800" />
                <span className="text-[10px] font-black text-[#C6FF3D] uppercase tracking-widest">Design System Studio</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                {TOKEN_CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h1>
            </div>
          </div>

          {/* Colors Panel */}
          {activeCategory === "colors" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {MOCK_COLORS.map((color) => (
                  <div key={color.name} className="border border-[#ffffff08] bg-[#080809] p-4 group hover:border-[#ffffff15] transition-all cursor-pointer">
                    <div className="w-full h-16 mb-3 rounded-sm" style={{ backgroundColor: color.value }} />
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{color.name}</p>
                    <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{color.value}</p>
                    <p className="text-[9px] text-zinc-700 uppercase tracking-widest mt-1">{color.role}</p>
                  </div>
                ))}
              </div>
              <div className="border border-[#ffffff06] bg-[#080809] p-6">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Add Color Token</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#C6FF3D]" />
                  <input type="text" defaultValue="#C6FF3D" className="bg-transparent border border-[#ffffff10] text-white font-mono text-sm px-4 py-2 focus:outline-none focus:border-[#C6FF3D]/50 transition-all w-40" />
                  <button className="px-5 py-2 bg-[#C6FF3D] text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                    Add Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Typography Panel */}
          {activeCategory === "typography" && (
            <div className="space-y-3">
              {MOCK_TYPE_SCALE.map((type) => (
                <div key={type.label} className="border border-[#ffffff06] bg-[#080809] p-6 flex items-center justify-between group hover:border-[#ffffff12] transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-20">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{type.label}</p>
                      <p className="text-[9px] text-zinc-700 font-mono mt-0.5">{type.size} / {type.weight}</p>
                    </div>
                    <p className="text-white font-black" style={{ fontSize: Math.min(parseInt(type.size), 32) + "px" }}>{type.sample}</p>
                  </div>
                  <button className="text-[9px] font-black text-zinc-700 hover:text-[#C6FF3D] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Edit</button>
                </div>
              ))}
            </div>
          )}

          {/* Spacing Panel */}
          {activeCategory === "spacing" && (
            <div className="space-y-3">
              {SPACING_SCALE.map((size) => (
                <div key={size} className="border border-[#ffffff06] bg-[#080809] p-5 flex items-center gap-8 group hover:border-[#ffffff12] transition-all">
                  <p className="text-[10px] font-black text-zinc-600 font-mono w-16">{size}px</p>
                  <div className="bg-[#C6FF3D]/20 border border-[#C6FF3D]/30" style={{ width: `${Math.min(size * 3, 400)}px`, height: "4px" }} />
                  <p className="text-[9px] text-zinc-700 font-mono">space-{size / 4}</p>
                </div>
              ))}
            </div>
          )}

          {/* Radius & Shadows Panel */}
          {activeCategory === "radius" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Border Radius</p>
                <div className="space-y-3">
                  {[
                    { label: "None", value: "0px" },
                    { label: "Small", value: "4px" },
                    { label: "Medium", value: "8px" },
                    { label: "Large", value: "16px" },
                    { label: "Full", value: "9999px" },
                  ].map((r) => (
                    <div key={r.label} className="border border-[#ffffff06] bg-[#080809] p-4 flex items-center gap-4">
                      <div className="w-12 h-12 border border-[#C6FF3D]/30 bg-[#C6FF3D]/5" style={{ borderRadius: r.value }} />
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{r.label}</p>
                        <p className="text-[9px] text-zinc-600 font-mono">{r.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Shadow Scale</p>
                <div className="space-y-3">
                  {[
                    { label: "Subtle", shadow: "0 1px 4px rgba(0,0,0,0.4)" },
                    { label: "Medium", shadow: "0 4px 16px rgba(0,0,0,0.6)" },
                    { label: "Heavy", shadow: "0 8px 40px rgba(0,0,0,0.8)" },
                    { label: "Neon", shadow: "0 0 30px rgba(198,255,61,0.2)" },
                  ].map((s) => (
                    <div key={s.label} className="border border-[#ffffff06] bg-[#0d0d0f] p-5" style={{ boxShadow: s.shadow }}>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Themes Panel */}
          {activeCategory === "themes" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setActiveTheme("dark")} className={`flex items-center gap-2 px-5 py-2.5 font-black text-[10px] uppercase tracking-widest transition-all ${activeTheme === "dark" ? "bg-[#C6FF3D] text-black" : "border border-[#ffffff10] text-zinc-500 hover:text-white"}`}>
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button onClick={() => setActiveTheme("light")} className={`flex items-center gap-2 px-5 py-2.5 font-black text-[10px] uppercase tracking-widest transition-all ${activeTheme === "light" ? "bg-white text-black" : "border border-[#ffffff10] text-zinc-500 hover:text-white"}`}>
                  <Sun className="w-4 h-4" /> Light
                </button>
              </div>

              <div className={`border p-8 ${activeTheme === "dark" ? "bg-[#050506] border-[#ffffff10]" : "bg-white border-zinc-200"}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-4 ${activeTheme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>Theme Preview — {activeTheme}</p>
                <div className={`rounded-sm p-6 mb-4 ${activeTheme === "dark" ? "bg-[#0d0d0f] border border-[#ffffff08]" : "bg-zinc-50 border border-zinc-200"}`}>
                  <p className={`font-black text-lg mb-1 ${activeTheme === "dark" ? "text-white" : "text-zinc-900"}`}>Design System Card</p>
                  <p className={`text-sm ${activeTheme === "dark" ? "text-zinc-500" : "text-zinc-500"}`}>Token preview in {activeTheme} mode</p>
                </div>
                <button className="bg-[#C6FF3D] text-black font-black text-[10px] uppercase tracking-widest px-6 py-2.5">
                  Primary Action
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LightStudio({ activeCategory, setActiveCategory, activeTheme, setActiveTheme, handleLogout, toggleTheme }: any) {
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      {/* ── SIDEBAR ── */}
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-black/5 bg-[#F6F7F3] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-white border border-black/5 rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D] transition-all shadow-[0_0_20px_rgba(198,255,61,0.3)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain filter invert" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio", active: true },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/50 bg-[#C6FF3D]/10 text-black" : "border-transparent hover:border-black/5 hover:bg-black/5"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-zinc-400 group-hover:text-black"}`} />
              <span className="absolute left-[75px] bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] translate-x-[-10px] group-hover:translate-x-0">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <button onClick={toggleTheme} title="Switch to Dark Mode" className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-black/5 hover:bg-black/5 transition-all text-zinc-400 hover:text-black">
            <Moon className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 ml-[64px]">
        {/* ── TOKEN CATEGORY SIDEBAR ── */}
        <aside className="w-[200px] min-h-screen border-r border-black/5 flex flex-col pt-8 px-4 gap-1.5 shrink-0 bg-white shadow-sm z-10 transition-all">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 px-3">Design Tokens</p>
          {TOKEN_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all group ${activeCategory === cat.id ? "bg-[#C6FF3D] border border-transparent text-black shadow-[3px_3px_0_#000]" : "border border-transparent bg-transparent hover:border-black/10 text-zinc-500 hover:text-black hover:bg-black/5"}`}>
              <cat.icon className={`w-4 h-4 shrink-0 ${activeCategory === cat.id ? "text-black" : "text-zinc-500 group-hover:text-black"}`} />
              <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
          <div className="mt-auto pb-8 pt-4">
            <div className="border border-black/5 bg-white px-3 py-4 shadow-sm border-l-2 border-l-[#C6FF3D]">
              <p className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest mb-1">System Status</p>
              <p className="text-[10px] text-zinc-500">Mock data — connect AI to generate live tokens</p>
            </div>
          </div>
        </aside>

        {/* ── TOKEN EDITOR PANEL ── */}
        <main className="flex-1 px-10 pt-10 pb-20 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link href="/dashboard" className="text-zinc-500 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest">Dashboard</Link>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] font-black text-black uppercase tracking-widest border-b-2 border-[#C6FF3D]">Design System Studio</span>
              </div>
              <h1 className="text-2xl font-black text-black tracking-tight mt-1">
                {TOKEN_CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h1>
            </div>
          </div>

          {/* Colors Panel */}
          {activeCategory === "colors" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {MOCK_COLORS.map((color) => (
                  <div key={color.name} className="border border-black/5 bg-white shadow-sm p-4 group hover:border-[#C6FF3D] hover:shadow-[5px_5px_0_#C6FF3D] transition-all cursor-pointer">
                    <div className="w-full h-16 mb-3 rounded-sm border border-black/5 shadow-inner" style={{ backgroundColor: color.value }} />
                    <p className="text-[11px] font-black text-black uppercase tracking-widest">{color.name}</p>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{color.value}</p>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">{color.role}</p>
                  </div>
                ))}
              </div>
              <div className="border border-black/5 bg-white shadow-sm p-6">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Add Color Token</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#C6FF3D] border border-black/10 shadow-sm" />
                  <input type="text" defaultValue="#C6FF3D" className="bg-white shadow-[0_3px_0_transparent] focus:shadow-[0_3px_0_#C6FF3D] border border-black/10 text-black font-mono text-sm px-4 py-2 focus:outline-none transition-all w-40" />
                  <button className="px-5 py-2 bg-[#1A1A1A] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#C6FF3D] hover:text-black transition-all">
                    Add Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Typography Panel */}
          {activeCategory === "typography" && (
            <div className="space-y-3">
              {MOCK_TYPE_SCALE.map((type) => (
                <div key={type.label} className="border border-black/5 bg-white shadow-sm p-6 flex items-center justify-between group hover:border-black/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-20">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{type.label}</p>
                      <p className="text-[9px] text-zinc-400 font-mono mt-0.5">{type.size} / {type.weight}</p>
                    </div>
                    <p className="text-black font-black" style={{ fontSize: Math.min(parseInt(type.size), 32) + "px" }}>{type.sample}</p>
                  </div>
                  <button className="text-[9px] font-black text-zinc-500 hover:text-black border border-transparent hover:border-black hover:bg-black/5 px-2 py-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Edit</button>
                </div>
              ))}
            </div>
          )}

          {/* Spacing Panel */}
          {activeCategory === "spacing" && (
            <div className="space-y-3">
              {SPACING_SCALE.map((size) => (
                <div key={size} className="border border-black/5 bg-white shadow-sm p-5 flex items-center gap-8 group hover:border-black/10 transition-all">
                  <p className="text-[10px] font-black text-zinc-500 font-mono w-16">{size}px</p>
                  <div className="bg-[#C6FF3D]/50 border border-[#C6FF3D]" style={{ width: `${Math.min(size * 3, 400)}px`, height: "4px" }} />
                  <p className="text-[9px] text-zinc-400 font-mono">space-{size / 4}</p>
                </div>
              ))}
            </div>
          )}

          {/* Radius & Shadows Panel */}
          {activeCategory === "radius" && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Border Radius</p>
                <div className="space-y-3">
                  {[
                    { label: "None", value: "0px" },
                    { label: "Small", value: "4px" },
                    { label: "Medium", value: "8px" },
                    { label: "Large", value: "16px" },
                    { label: "Full", value: "9999px" },
                  ].map((r) => (
                    <div key={r.label} className="border border-black/5 bg-white shadow-sm p-4 flex items-center gap-4 hover:border-[#C6FF3D] hover:shadow-[3px_3px_0_#C6FF3D] transition-all">
                      <div className="w-12 h-12 border border-[#C6FF3D] bg-[#C6FF3D]/20 shadow-inner" style={{ borderRadius: r.value }} />
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest">{r.label}</p>
                        <p className="text-[9px] text-zinc-500 font-mono">{r.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Shadow Scale</p>
                <div className="space-y-3">
                  {[
                    { label: "Subtle", shadow: "0 1px 4px rgba(0,0,0,0.1)" },
                    { label: "Medium", shadow: "0 4px 16px rgba(0,0,0,0.15)" },
                    { label: "Heavy", shadow: "0 8px 30px rgba(0,0,0,0.2)" },
                    { label: "Neon", shadow: "0 0 30px rgba(198,255,61,0.5)" },
                  ].map((s) => (
                    <div key={s.label} className="border border-black/5 bg-white p-5 hover:border-black/20 transition-all" style={{ boxShadow: s.shadow }}>
                      <p className="text-[10px] font-black text-black uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Themes Panel */}
          {activeCategory === "themes" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setActiveTheme("dark")} className={`flex items-center gap-2 px-5 py-2.5 font-black text-[10px] uppercase tracking-widest transition-all ${activeTheme === "dark" ? "bg-black text-[#C6FF3D]" : "border border-black/10 text-zinc-500 hover:text-black bg-white shadow-sm hover:shadow"}`}>
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button onClick={() => setActiveTheme("light")} className={`flex items-center gap-2 px-5 py-2.5 font-black text-[10px] uppercase tracking-widest transition-all ${activeTheme === "light" ? "bg-[#C6FF3D] border border-transparent shadow-[3px_3px_0_#000] text-black" : "border border-black/10 text-zinc-500 hover:text-black bg-white shadow-sm hover:shadow"}`}>
                  <Sun className="w-4 h-4" /> Light
                </button>
              </div>

              <div className={`border p-8 shadow-sm ${activeTheme === "dark" ? "bg-[#050506] border-[#ffffff10]" : "bg-white border-black/10"}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-4 ${activeTheme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>Theme Preview — {activeTheme}</p>
                <div className={`rounded-sm p-6 mb-4 ${activeTheme === "dark" ? "bg-[#0d0d0f] border border-[#ffffff08]" : "bg-zinc-50 border border-black/10"}`}>
                  <p className={`font-black text-lg mb-1 ${activeTheme === "dark" ? "text-white" : "text-black"}`}>Design System Card</p>
                  <p className={`text-sm ${activeTheme === "dark" ? "text-zinc-500" : "text-zinc-500"}`}>Token preview in {activeTheme} mode</p>
                </div>
                <button className={`font-black text-[10px] uppercase tracking-widest px-6 py-2.5 ${activeTheme === "dark" ? "bg-[#C6FF3D] text-black" : "bg-[#1A1A1A] text-white hover:bg-[#C6FF3D] hover:text-black transition-colors"}`}>
                  Primary Action
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StudioPageContent() {
  const [activeCategory, setActiveCategory] = useState("colors");
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("dark");
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const props = {
    activeCategory, setActiveCategory,
    activeTheme, setActiveTheme,
    handleLogout, toggleTheme
  };

  return theme === "light" ? <LightStudio {...props} /> : <DarkStudio {...props} />;
}

export default function StudioRoute() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#050506]"><Zap className="w-8 h-8 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" /></div>}>
      <StudioPageContent />
    </Suspense>
  );
}
