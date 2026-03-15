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
  Toolbox,
  Paperclip,
  ArrowUp,
  Folder,
  Cloud,
  LogOut,
  User,
  Zap,
  LayoutGrid
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Vibro Command Center
 * The high-performance entry point for Design Synthesis.
 */

function CommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      router.push(`/dashboard/workstation?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "55px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }
  };

  // Dummy recent projects for the UI
  const recentProjects = [
    { id: 1, title: "Modern E-commerce Dashboard with biometric authentication and GSAP transitions", type: "Cloud" },
    { id: 2, title: "Fintech App Interface - Dark Mode Protocol", type: "Local" },
    { id: 3, title: "Portfolio Synthesis Engine - Architectural Layout", type: "Cloud" }
  ];

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
            { icon: LayoutGrid, label: "Projects" },
            { icon: Sparkles, label: "Synthesis" },
            { icon: CreditCard, label: "Billing" },
            { icon: SettingsIcon, label: "Settings" }
          ].map((item, i) => (
            <button key={i} className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] transition-all group relative">
              <item.icon className="w-5 h-5 text-zinc-600 group-hover:text-[#C6FF3D]" />
              <span className="absolute left-[75px] bg-black border border-[#ffffff15] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D]">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pb-4">
          <div className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 opacity-20">
             <div className="w-full h-[1px] bg-[#C6FF3D]" />
             <div className="w-full h-[1px] bg-[#C6FF3D]" />
          </div>
          <button onClick={handleLogout} className="mt-8 w-11 h-11 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── HEADER ── */}
      <header className="fixed top-0 right-0 left-[64px] z-20 flex items-center justify-end p-8">
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-stretch shadow-2xl">
            <Link 
              href="/dashboard/workstation"
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
                {user?.email?.split('@')[0] || "Guest"}
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
          {/* Logo Brand - Enhanced Sophistication */}
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
          <div className="w-full relative group">
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-[#C6FF3D] z-10" />
            
            <div className="relative flex flex-col bg-[#050506]/80 backdrop-blur-xl border border-[#ffffff10] px-8 py-8 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Ask Vibro to build a mobile app..."
                className="w-full min-h-[50px] max-h-[300px] resize-none bg-transparent border-none outline-none text-white placeholder:text-zinc-600 text-2xl font-bold tracking-tight z-20"
                rows={1}
              />
              
              <div className="flex items-center justify-between mt-8 z-20">
                <div className="flex items-center gap-1">
                  {[
                    { icon: Atom, label: "MOD" },
                    { icon: Sparkles, label: "ENH" },
                    { icon: Toolbox, label: "UTIL" }
                  ].map((btn, i) => (
                    <button key={i} className="px-3 h-7 flex items-center justify-center bg-black/40 border border-[#ffffff10] text-[9px] font-black text-zinc-500 hover:text-[#C6FF3D] hover:border-[#C6FF3D]/30 transition-all uppercase tracking-widest">
                       {btn.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="text-zinc-600 hover:text-white transition-all flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSearch}
                    disabled={!prompt.trim()}
                    className="h-10 px-6 bg-[#C6FF3D] text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-10"
                  >
                    GENERATE
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
                  {recentProjects.map((proj) => (
                    <button key={proj.id} className="w-full flex items-center justify-between p-4 bg-[#080809]/40 border border-[#ffffff05] hover:border-[#ffffff10] transition-all group">
                       <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors text-left truncate mr-8">
                          {proj.title}
                       </span>
                       <div className="flex items-center gap-4 shrink-0">
                          <Cloud className="w-3.5 h-3.5 text-zinc-800 group-hover:text-zinc-600" />
                       </div>
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

export default function WorkstationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#09090B]"><Zap className="w-12 h-12 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" /></div>}>
      <CommandCenter />
    </Suspense>
  )
}
