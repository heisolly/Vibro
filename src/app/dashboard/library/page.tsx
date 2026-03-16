"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut, Search, ExternalLink, Zap, ArrowRight, Sun, Moon,
  Hexagon, Layers, Paintbrush, Code2, CreditCard, Settings2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const CATEGORIES = [
  "All", "Buttons", "Cards", "Navbars", "Sidebars", "Forms", "Tables", "Heroes", "Pricing", "Dashboard"
];

const COMPONENTS = [
  { id: "btn-primary", name: "Primary Button", category: "Buttons", tags: ["cta", "action"], preview: "bg-[#C6FF3D]" },
  { id: "btn-outline", name: "Outline Button", category: "Buttons", tags: ["secondary", "ghost"], preview: "border border-current" },
  { id: "btn-ghost", name: "Ghost Button", category: "Buttons", tags: ["minimal", "text"], preview: "bg-black/5 dark:bg-white/10" },
  { id: "card-stat", name: "Stat Card", category: "Cards", tags: ["metric", "dashboard"], preview: "bg-zinc-100 dark:bg-zinc-900" },
  { id: "card-project", name: "Project Card", category: "Cards", tags: ["project", "list"], preview: "bg-zinc-100 dark:bg-zinc-900" },
  { id: "card-pricing", name: "Pricing Card", category: "Cards", tags: ["plan", "tier"], preview: "bg-zinc-200 dark:bg-zinc-800" },
  { id: "nav-top", name: "Top Navigation", category: "Navbars", tags: ["nav", "header"], preview: "bg-white dark:bg-black" },
  { id: "nav-side", name: "Sidebar Nav", category: "Sidebars", tags: ["nav", "aside"], preview: "bg-zinc-50 dark:bg-zinc-950" },
  { id: "form-login", name: "Login Form", category: "Forms", tags: ["auth", "input"], preview: "bg-zinc-100 dark:bg-zinc-900" },
  { id: "form-contact", name: "Contact Form", category: "Forms", tags: ["input", "fields"], preview: "bg-zinc-100 dark:bg-zinc-900" },
  { id: "table-data", name: "Data Table", category: "Tables", tags: ["list", "grid"], preview: "bg-zinc-50 dark:bg-zinc-950" },
  { id: "hero-dark", name: "Dark Hero", category: "Heroes", tags: ["landing", "hero"], preview: "bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-900 dark:to-black" },
  { id: "hero-split", name: "Split Hero", category: "Heroes", tags: ["landing", "split"], preview: "bg-zinc-100 dark:bg-zinc-900" },
  { id: "pricing-grid", name: "Pricing Grid", category: "Pricing", tags: ["plans", "tiers"], preview: "bg-zinc-50 dark:bg-zinc-950" },
  { id: "dash-overview", name: "Dashboard Overview", category: "Dashboard", tags: ["metrics", "home"], preview: "bg-white dark:bg-black" },
  { id: "dash-analytics", name: "Analytics Block", category: "Dashboard", tags: ["charts", "data"], preview: "bg-zinc-100 dark:bg-zinc-900" },
];

function DarkLibrary({ activeCategory, setActiveCategory, searchQuery, setSearchQuery, handleLogout, toggleTheme, filtered }: any) {
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <DashboardSidebar />

      <main className="flex-1 ml-[64px] relative">
        <DashboardHeader />
        
        <div className="px-10 pt-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-1">
                <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
                <span className="mx-2">›</span>
                <span className="text-[#C6FF3D]">Component Library</span>
              </p>
              <h1 className="text-2xl font-black text-white tracking-tight">Component Library</h1>
            </div>
            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
              {filtered.length} Components
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080809] border border-[#ffffff0a] text-white placeholder:text-zinc-700 text-sm pl-11 pr-4 py-3 focus:outline-none focus:border-[#C6FF3D]/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-[#C6FF3D] text-black" : "border border-[#ffffff0a] text-zinc-600 hover:text-white hover:border-[#ffffff15]"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((comp: any) => (
              <div key={comp.id} className="border border-[#ffffff06] bg-[#080809] group hover:border-[#ffffff15] transition-all flex flex-col">
                <div className={`h-32 ${comp.preview} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest z-10">{comp.name}</p>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{comp.name}</p>
                    <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mt-0.5">{comp.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {comp.tags.map((tag: string) => (
                      <span key={tag} className="text-[8px] font-black text-zinc-700 uppercase tracking-widest border border-[#ffffff06] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/dashboard/editor?component=${comp.id}`} className="mt-auto flex items-center justify-between h-8 px-4 bg-transparent border border-[#ffffff08] text-zinc-600 hover:bg-[#C6FF3D] hover:text-black hover:border-[#C6FF3D] transition-all group/btn">
                    <span className="text-[9px] font-black uppercase tracking-widest">Open in Editor</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">No components found</p>
              <p className="text-zinc-800 text-sm mt-2">Try a different category or search term</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function LightLibrary({ activeCategory, setActiveCategory, searchQuery, setSearchQuery, handleLogout, toggleTheme, filtered }: any) {
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <DashboardSidebar />

      <main className="flex-1 ml-[64px] relative">
        <DashboardHeader />
        
        <div className="px-10 pt-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">
                <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                <span className="mx-2">›</span>
                <span className="text-black font-bold border-b-2 border-[#C6FF3D]">Component Library</span>
              </p>
              <h1 className="text-2xl font-black text-black tracking-tight">Component Library</h1>
            </div>
            <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              {filtered.length} Components
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/5 text-black placeholder:text-zinc-400 text-sm pl-11 pr-4 py-3 focus:outline-none focus:border-[#C6FF3D] shadow-sm transition-all shadow-[0_5px_0_rgba(198,255,61,0)] focus:shadow-[5px_5px_0_#C6FF3D]"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-[#C6FF3D] text-black shadow-[3px_3px_0_#000]" : "border border-black/5 bg-white text-zinc-500 hover:text-black hover:border-black/10 hover:shadow-sm"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((comp: any) => (
              <div key={comp.id} className="border border-black/5 bg-white shadow-sm group hover:border-black/10 hover:shadow-md transition-all flex flex-col">
                <div className={`h-32 ${comp.preview} flex items-center justify-center relative overflow-hidden bg-opacity-10 border-b border-black/5`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <p className="text-[9px] font-black text-black/20 uppercase tracking-widest z-10">{comp.name}</p>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-black uppercase tracking-widest">{comp.name}</p>
                    <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">{comp.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {comp.tags.map((tag: string) => (
                      <span key={tag} className="text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-black/5 bg-black/[0.02] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/dashboard/editor?component=${comp.id}`} className="mt-auto flex items-center justify-between h-8 px-4 bg-transparent border border-black/5 text-zinc-600 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all group/btn shadow-[0_0_0_transparent] hover:shadow-[3px_3px_0_#C6FF3D]">
                    <span className="text-[9px] font-black uppercase tracking-widest">Open in Editor</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">No components found</p>
              <p className="text-zinc-500 text-sm mt-2">Try a different category or search term</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function LibraryPageContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const filtered = COMPONENTS.filter((c) => {
    const matchCategory = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const props = {
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    handleLogout, toggleTheme, filtered
  };

  return theme === "light" ? <LightLibrary {...props} /> : <DarkLibrary {...props} />;
}

export default function LibraryRoute() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#050506]"><Zap className="w-8 h-8 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" /></div>}>
      <LibraryPageContent />
    </Suspense>
  );
}
