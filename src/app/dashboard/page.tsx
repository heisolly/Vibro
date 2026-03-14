"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { 
  Plus, 
  Sparkles, 
  Layout, 
  Image as ImageIcon, 
  Search, 
  ArrowRight, 
  Layers, 
  History, 
  Globe, 
  AppWindow,
  Cpu,
  Activity,
  Check,
  ChevronRight,
  Zap,
  Terminal,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState<'app' | 'website'>('website');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  const handleInitiateSynthesis = () => {
    if (!prompt.trim()) return;
    router.push(`/dashboard/workstation?q=${encodeURIComponent(prompt)}&type=${category}&device=${device}`);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto py-12 px-6 lg:px-12 space-y-12 pb-32">
      
      {/* ── Top Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-zinc-100 dark:border-white/5 pb-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#b8f724]/10 dark:bg-[#b8f724]/5 rounded-full w-fit border border-[#b8f724]/20 dark:border-[#b8f724]/10">
            <div className="w-2 h-2 rounded-full bg-[#b8f724] shadow-[0_0_10px_rgba(184,247,36,1)] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-[#b8f724]">Architect Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-950 dark:text-white leading-[0.9]">
            Building for <span className="text-[#b8f724] drop-shadow-xl inline-block hover:scale-[1.02] transition-transform cursor-default">
              {user?.email?.split('@')[0] || 'Vibro User'}...
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-8 translate-y-[-10px]">
          <div className="text-right hidden lg:block">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] leading-loose">Core Engine Status</p>
            <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-end gap-2">
              Vibro-Flux 4.2 L <Check className="w-5 h-5 text-[#b8f724]" />
            </p>
          </div>
          <div className="w-20 h-20 rounded-[28px] bg-zinc-950 flex items-center justify-center shadow-2xl shadow-[#b8f724]/10 border border-white/10 overflow-hidden p-3 group/logo cursor-pointer active:scale-95 transition-all">
            <Image 
              src="/logo.png" 
              alt="Vibro Logo" 
              width={48} 
              height={48} 
              className="object-contain group-hover:rotate-12 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ── Left Column: Interaction ── */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Architect Card */}
          <div className="bg-white dark:bg-[#0C0C0C] border border-zinc-200/50 dark:border-white/[0.03] rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-all duration-700 relative group min-h-[580px] flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-50 dark:bg-zinc-900/50">
              <div 
                className="h-full bg-[#b8f724] transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(184,247,36,0.6)]" 
                style={{ width: prompt.length > 0 ? Math.min(100, (prompt.length / 50) * 100) : '2%' }}
              />
            </div>
            
            <div className="flex-1 p-10 md:p-14 flex flex-col space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-zinc-950 dark:text-white tracking-tight italic leading-none">
                  What do you want <br /> to build today?
                </h2>
                <p className="text-zinc-500 text-base font-medium max-w-sm">
                  The architect is listening. Provide a high-level description of your digital intent.
                </p>
              </div>

              <div className="space-y-8 flex-1 flex flex-col justify-between">
                <div className="relative group/input flex-1">
                  <div className="absolute top-7 left-7 text-zinc-400 dark:text-zinc-700 group-focus-within/input:text-[#b8f724] transition-colors">
                    <Search className="w-6 h-6" />
                  </div>
                  <textarea 
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your project... e.g., 'A modern SaaS landing page with a hero section and pricing cards.'"
                    className="w-full h-full bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200/50 dark:border-white/[0.05] rounded-[32px] pl-16 pr-8 pt-7 pb-7 text-zinc-950 dark:text-white font-bold text-xl placeholder:text-zinc-300 dark:placeholder:text-zinc-800 outline-none focus:ring-[12px] focus:ring-[#b8f724]/5 focus:border-[#b8f724]/30 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10 p-6 rounded-[32px] border border-zinc-100 dark:border-white/[0.02] gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">Module Config</p>
                    <p className="text-base font-black text-zinc-950 dark:text-white capitalize">{category} Architecture</p>
                  </div>
                  <div className="flex p-1.5 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100/50 dark:border-white/5 shadow-sm">
                    <button 
                      onClick={() => setCategory('app')}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${category === 'app' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl' : 'text-zinc-400 hover:text-zinc-900'}`}
                    >
                      App
                    </button>
                    <button 
                      onClick={() => setCategory('website')}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${category === 'website' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl' : 'text-zinc-400 hover:text-zinc-900'}`}
                    >
                      Web
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleInitiateSynthesis}
                  disabled={!prompt.trim()}
                  className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-7 rounded-[32px] font-black text-[13px] tracking-[0.3em] uppercase hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_25px_50px_rgba(0,0,0,0.1)] dark:shadow-none disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-4 group/btn"
                >
                  Initiate Synthesis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Synthesis Feed Area */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-6">
              <h3 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b8f724]" /> Synthesis Feed
              </h3>
              <button className="text-[11px] font-black text-zinc-400 hover:text-zinc-950 dark:hover:text-white uppercase tracking-widest transition-colors">
                Manage Protocol Log
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 border-4 border-dashed border-zinc-100 dark:border-white/5 rounded-[48px] bg-zinc-50/20 dark:bg-zinc-900/10 space-y-6 flex flex-col items-center justify-center text-center group hover:border-[#b8f724]/30 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-[24px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 flex items-center justify-center text-zinc-300 group-hover:bg-[#b8f724] group-hover:text-zinc-950 group-hover:rotate-6 transition-all shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-black text-zinc-400 dark:text-zinc-700 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">Empty Log</p>
                  <p className="text-[11px] text-zinc-300 dark:text-zinc-800 uppercase font-black tracking-[0.25em]">Initiate synthesis to start log</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Stats & Meta ── */}
        <div className="lg:col-span-4 space-y-10 sticky top-12">
          
          {/* Engine Load Stats */}
          <div className="bg-zinc-950 dark:bg-[#080808] rounded-[48px] p-10 text-white space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.2)] dark:shadow-none relative overflow-hidden group border border-white/[0.03]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8f724]/10 blur-[80px] -mr-32 -mt-32 group-hover:bg-[#b8f724]/15 transition-all duration-1000" />
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 text-[#b8f724]">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Engine Load</span>
              </div>
              <h4 className="text-4xl font-black tracking-tighter italic">Peak Stable</h4>
            </div>

            <div className="grid grid-cols-2 gap-8 relative z-10">
              <div className="space-y-2">
                <p className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.2em]">Sync Latency</p>
                <p className="text-3xl font-black font-mono tracking-tighter italic">1.2<span className="text-sm font-bold text-zinc-700 ml-1">ms</span></p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.2em]">Live Uptime</p>
                <p className="text-3xl font-black font-mono tracking-tighter text-[#b8f724] italic">99.9<span className="text-sm font-bold text-[#b8f724]/50 ml-1">%</span></p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6 relative z-10">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">
                <span>Quota Usage</span>
                <span className="text-[#b8f724]">12 / 50</span>
              </div>
              <div className="h-2.5 w-full bg-white/[0.03] rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-[#b8f724] w-[24%] rounded-full shadow-[0_0_20px_rgba(184,247,36,0.8)]" />
              </div>
            </div>

            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/5">
              Upgrade Protocol
            </button>
          </div>

          {/* Discover Cards */}
          <div className="space-y-4">
            <Link href="/dashboard/discover" className="group block">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/[0.03] rounded-[40px] p-8 flex items-center justify-between hover:border-[#b8f724]/50 hover:shadow-2xl hover:shadow-[#b8f724]/5 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[20px] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-[#b8f724] group-hover:text-zinc-950 group-hover:rotate-3 transition-all shadow-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-zinc-950 dark:text-white leading-none">Library</p>
                    <p className="text-[10px] text-zinc-400 mt-2.5 uppercase font-black tracking-[0.25em] leading-none">400+ Components</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#b8f724] group-hover:border-[#b8f724]/20 transition-all">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/[0.03] rounded-[40px] p-8 flex items-center justify-between hover:border-[#b8f724]/50 hover:shadow-2xl hover:shadow-[#b8f724]/5 transition-all cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-[20px] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-[#b8f724] group-hover:text-zinc-950 group-hover:-rotate-3 transition-all shadow-sm">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-black text-zinc-950 dark:text-white leading-none">Vision Clone</p>
                  <p className="text-[10px] text-zinc-400 mt-2.5 uppercase font-black tracking-[0.25em] leading-none">Snap2Code Protocol</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#b8f724] group-hover:border-[#b8f724]/20 transition-all">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
