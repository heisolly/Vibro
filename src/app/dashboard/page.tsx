"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Command, Sparkles, Layout, Image as ImageIcon, Search, ArrowRight, Layers, History, Globe, AppWindow } from "lucide-react";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const [category, setCategory] = useState<"app" | "website">("app");

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/dashboard/workstation?q=${encodeURIComponent(prompt.trim())}&type=${category}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-12 space-y-20 min-h-screen relative pb-32">
      
      {/* ── Header Status ── */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#b8f724] shadow-xl">
               <Command className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 leading-tight">System_Status</h2>
               <p className="text-[13px] font-bold text-zinc-900">Vibro_Engine_v4.2 <span className="text-[#b8f724] ml-2 font-black">● Live</span></p>
            </div>
         </div>
         <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
               <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total_Syntheses</h2>
               <p className="text-[14px] font-black text-zinc-900 tracking-tighter">1,284_Units</p>
            </div>
            <div className="h-8 w-[1px] bg-zinc-100" />
            <div className="text-right">
               <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Average_Speed</h2>
               <p className="text-[14px] font-black text-zinc-900 tracking-tighter">1.4_Seconds</p>
            </div>
         </div>
      </div>

      {/* ── Main Command Center ── */}
      <section className="relative space-y-12">
         <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 uppercase italic">
               Design <span className="text-zinc-300">without</span><br />
               <span className="text-[#b8f724] bg-black px-6 py-2 rounded-[32px] inline-block mt-4 shadow-2xl skew-x-[-4deg]">Limits_</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-2xl">
               What would you like to build today? Select your architecture and describe your vision below to start the synthesis.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ── AI Prompt Path (Main) ── */}
            <div className="lg:col-span-8 flex flex-col gap-6">
               <div className="bg-white border-2 border-zinc-900 rounded-[48px] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-zinc-100 -mr-4 -mt-4 opacity-50">
                     <Sparkles className="w-24 h-24 stroke-[1]" />
                  </div>
                  
                  <div className="relative space-y-10">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                           <h3 className="text-xl font-black uppercase tracking-tighter">1. Architecture_Type</h3>
                           <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest leading-none">Determine the core logic of your build</p>
                        </div>
                        <div className="flex p-1.5 bg-zinc-100 rounded-[20px] shadow-inner">
                           <button 
                              onClick={() => setCategory("app")}
                              className={`flex items-center gap-3 px-8 py-3 rounded-[16px] text-[11px] font-black uppercase tracking-widest transition-all ${
                                 category === "app" ? "bg-black text-[#b8f724] shadow-xl scale-105" : "text-zinc-400 hover:text-zinc-600"
                              }`}
                           >
                              <AppWindow className="w-4 h-4" /> App
                           </button>
                           <button 
                              onClick={() => setCategory("website")}
                              className={`flex items-center gap-3 px-8 py-3 rounded-[16px] text-[11px] font-black uppercase tracking-widest transition-all ${
                                 category === "website" ? "bg-black text-[#b8f724] shadow-xl scale-105" : "text-zinc-400 hover:text-zinc-600"
                              }`}
                           >
                              <Globe className="w-4 h-4" /> Website
                           </button>
                        </div>
                     </div>

                     <div className="h-[1px] bg-zinc-100 w-full" />

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <h3 className="text-xl font-black uppercase tracking-tighter">2. Objective_Prompt</h3>
                           <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest leading-none">Describe the features and vibe in detail</p>
                        </div>
                        <form onSubmit={handleSynthesize} className="relative group/form">
                           <div className="absolute -inset-1 bg-[#b8f724] rounded-[28px] blur opacity-10 group-focus-within/form:opacity-20 transition-opacity" />
                           <div className="relative bg-zinc-50 border border-zinc-200 rounded-[24px] overflow-hidden focus-within:bg-white focus-within:border-zinc-900 transition-all p-2 flex items-center gap-4">
                              <div className="flex-1 px-4 py-2">
                                 <textarea 
                                    rows={1}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={category === "app" ? "A high-performance trading dashboard with live charts..." : "A luxury fashion landing page with immersive video sections..."}
                                    className="w-full bg-transparent border-none outline-none text-zinc-900 font-bold text-base placeholder:text-zinc-300 resize-none py-2"
                                 />
                              </div>
                              <button 
                                 type="submit"
                                 className="bg-black text-[#b8f724] px-8 py-4 rounded-[20px] font-black uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl group/btn"
                              >
                                 Start_Synthesis <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Alternative Paths ── */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <Link href="/dashboard/discover" className="block group">
                  <div className="bg-zinc-50 border border-zinc-100 rounded-[48px] p-8 space-y-6 hover:bg-white hover:border-zinc-900 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all h-full relative overflow-hidden">
                     <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm group-hover:bg-zinc-900 group-hover:text-[#b8f724] transition-all">
                        <Layers className="w-6 h-6" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-tighter">Browse_Library</h4>
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">Access 400+ hand-crafted UI components across all major categories.</p>
                     </div>
                     <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#b8f724] bg-black w-fit px-4 py-2 rounded-full shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        Open_Marketplace <ArrowRight className="w-3 h-3" />
                     </div>
                  </div>
               </Link>

               <div className="bg-zinc-50 border border-zinc-100 rounded-[48px] p-8 space-y-6 hover:bg-white hover:border-zinc-900 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all h-full relative group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm group-hover:bg-zinc-900 group-hover:text-blue-400 transition-all">
                     <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-black uppercase tracking-tighter">Image_to_Code</h4>
                     <p className="text-sm text-zinc-400 font-medium leading-relaxed">Upload a screenshot or design file to synthesize into functional components.</p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 bg-black w-fit px-4 py-2 rounded-full shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                     Upload_Asset <ArrowRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── Recent History ── */}
      <section className="space-y-8">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <History className="w-4 h-4 text-[#b8f724]" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Synthesis_Log</h3>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Clear_History</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aspect-[4/3] rounded-[40px] border border-zinc-100 border-dashed bg-zinc-50/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
               <div className="w-16 h-16 rounded-[24px] bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-8 h-8 text-zinc-200" />
               </div>
               <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-tight text-zinc-400">Archive_Empty</h4>
                  <p className="text-[11px] text-zinc-400 font-medium">Your generated architectures will appear here for quick access.</p>
               </div>
            </div>
         </div>
      </section>

      {/* ── System Command Hub (Bottom Indicator) ── */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-[100]">
         <div className="bg-black/95 backdrop-blur-xl border border-zinc-800 px-8 py-4 rounded-[100px] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center gap-3 pr-8 border-r border-zinc-700">
               <div className="w-2.5 h-2.5 rounded-full bg-[#b8f724] animate-pulse shadow-[0_0_15px_#b8f724]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#b8f724]">Core_Socket_Active</span>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Latency</span>
                  <span className="text-[11px] font-black text-white italic">24ms</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">GPU_Load</span>
                  <span className="text-[11px] font-black text-white italic">12%</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Queue</span>
                  <span className="text-[11px] font-black text-white italic">None</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
