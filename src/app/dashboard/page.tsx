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
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Link as LinkIcon,
  Palette,
  ChevronLeft,
  Check
} from "lucide-react";

type SynthesisStep = 'initial' | 'device' | 'method' | 'style';

export default function DashboardPage() {
  const [step, setStep] = useState<SynthesisStep>('initial');
  const [prompt, setPrompt] = useState("");
  const [stylePrompt, setStylePrompt] = useState("");
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [method, setMethod] = useState<"prompt" | "screenshot" | "url" | "brand">("prompt");
  const [category, setCategory] = useState<"app" | "website">("app");
  
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

  const handleFinalGenerate = () => {
    const finalPrompt = `${prompt} | Style: ${stylePrompt}`;
    router.push(`/dashboard/workstation?q=${encodeURIComponent(finalPrompt)}&type=${category}&device=${device}`);
  };

  const tags = ["Light", "Dark", "Modern", "Artsy", "Techy", "Young", "Corporate", "Formal", "Elegant", "Hand-drawn"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0A0A0A]">
      
      {/* ── Background Branding Gradient ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-[#b8f724]/5 dark:bg-[#b8f724]/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-[#b8f724]/5 dark:bg-[#b8f724]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-6 lg:px-12 space-y-12 pb-32">
        
        {/* ── Page Header (Sticky-ish) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-white/5 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#b8f724]/10 dark:bg-[#b8f724]/5 rounded-full w-fit border border-[#b8f724]/20 dark:border-[#b8f724]/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#b8f724] animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-400">Architect Online</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                 Building for <span className="text-[#b8f724] drop-shadow-sm">{user?.email?.split('@')[0] || "Designer"}...</span>
              </h1>
           </div>

           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-loose">Core Engine</p>
                 <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Vibro-Flux 4.2 L</p>
              </div>
               <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#b8f724] dark:text-[#b8f724] shadow-2xl shadow-[#b8f724]/10 border border-white/10 overflow-hidden p-2">
                  <Image 
                    src="/logo.png" 
                    alt="Vibro Logo" 
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
               </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           
           {/* ── Main Wizard Area ── */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Animated Step Container */}
              <div className="bg-white dark:bg-[#0E0E0E] border border-zinc-200 dark:border-white/5 rounded-[48px] shadow-[0_24px_80px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-500 min-h-[520px] flex flex-col relative group">
                 
                 {/* Progress Indicator */}
                 <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-50">
                    <div 
                      className="h-full bg-[#b8f724] transition-all duration-700 ease-out" 
                      style={{ width: step === 'initial' ? '10%' : step === 'device' ? '33%' : step === 'method' ? '66%' : '100%' }}
                    />
                 </div>

                 {/* Step Content */}
                 <div className="flex-1 p-8 md:p-12 flex flex-col">
                    
                    {/* Header for steps */}
                    {step !== 'initial' && (
                        <button 
                          onClick={() => setStep(step === 'device' ? 'initial' : step === 'method' ? 'device' : 'method')}
                          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-800 transition-colors mb-8 group/back"
                        >
                           <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                        </button>
                    )}
                     {step === 'initial' && (
                       <div className="space-y-10 animate-fade-in">
                          <div className="space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">What do you want to build today?</h2>
                             <p className="text-zinc-500 dark:text-zinc-400 text-sm">Start your architectural journey with a simple description.</p>
                          </div>
                          
                          <div className="space-y-6">
                             <div className="relative group/input">
                                <div className="absolute top-5 left-5 text-zinc-400 dark:text-zinc-600 group-focus-within/input:text-[#b8f724] transition-colors">
                                   <Search className="w-5 h-5" />
                                </div>
                                <textarea 
                                   rows={4}
                                   value={prompt}
                                   onChange={(e) => setPrompt(e.target.value)}
                                   placeholder="Describe your project... e.g., 'A professional portfolio for a digital artist with a dark aesthetic and interactive gallery'"
                                   className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[32px] pl-14 pr-6 pt-5 pb-5 text-zinc-900 dark:text-white font-medium text-lg placeholder:text-zinc-300 dark:placeholder:text-zinc-800 outline-none focus:ring-4 focus:ring-[#b8f724]/10 dark:focus:ring-[#b8f724]/5 focus:border-[#b8f724]/50 transition-all resize-none shadow-inner"
                                />
                             </div>
                             
                             <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[24px] border border-zinc-200 dark:border-white/5">
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Architecture</p>
                                   <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">{category} Build</p>
                                </div>
                                <div className="flex p-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm">
                                   <button 
                                      onClick={() => setCategory("app")}
                                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${category === 'app' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900'}`}
                                   >
                                      App
                                   </button>
                                   <button 
                                      onClick={() => setCategory("website")}
                                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${category === 'website' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900'}`}
                                   >
                                      Web
                                   </button>
                                </div>
                             </div>

                             <button 
                                disabled={!prompt.trim()}
                                onClick={() => setStep('device')}
                                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-6 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.01] transition-all shadow-2xl shadow-zinc-200 dark:shadow-none disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 active:scale-[0.98]"
                             >
                                Continue Synthesis <ArrowRight className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    )}

                    {step === 'device' && (
                       <div className="space-y-10 animate-fade-in flex-1 flex flex-col justify-center">
                          <div className="text-center space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Which device are you designing for?</h2>
                             <p className="text-zinc-500 dark:text-zinc-400 text-sm">We'll optimize the spatial layout accordingly.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto w-full">
                             {[
                                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                                { id: 'desktop', icon: Monitor, label: 'Desktop' }
                             ].map((item) => (
                                <button 
                                   key={item.id}
                                   onClick={() => setDevice(item.id as any)}
                                   className={`p-8 rounded-[36px] border-2 flex flex-col items-center gap-4 transition-all group/item ${
                                      device === item.id 
                                      ? 'border-[#b8f724] bg-[#b8f724]/5 dark:bg-[#b8f724]/10 shadow-2xl shadow-[#b8f724]/10 scale-105' 
                                      : 'border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-white/10'
                                   }`}
                                >
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${device === item.id ? 'bg-[#b8f724] text-black shadow-lg shadow-[#b8f724]/20' : 'bg-white dark:bg-zinc-800 text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-white'}`}>
                                      <item.icon className="w-6 h-6" />
                                   </div>
                                   <span className={`text-[10px] font-black uppercase tracking-widest ${device === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>{item.label}</span>
                                </button>
                             ))}
                          </div>

                          <button 
                             onClick={() => setStep('method')}
                             className="w-full max-w-sm mx-auto bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-6 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.01] transition-all shadow-xl mt-8 active:scale-[0.98]"
                          >
                             Next Step
                          </button>
                       </div>
                    )}

                    {step === 'method' && (
                       <div className="space-y-10 animate-fade-in flex-1 flex flex-col justify-center">
                          <div className="text-center space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Choose a synthesis method</h2>
                             <p className="text-zinc-500 dark:text-zinc-400 text-sm">How should the AI generate the initial style?</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full">
                             {[
                                { id: 'screenshot', icon: ImageIcon, label: 'Screenshot' },
                                { id: 'prompt', icon: Sparkles, label: 'Prompt' },
                                { id: 'url', icon: LinkIcon, label: 'URL Clone' },
                                { id: 'brand', icon: Palette, label: 'Brand Kit', badge: 'Pro' }
                             ].map((item) => (
                                <button 
                                   key={item.id}
                                   onClick={() => setMethod(item.id as any)}
                                   className={`p-6 rounded-[32px] border-2 flex flex-col items-center gap-3 transition-all relative ${
                                      method === item.id 
                                      ? 'border-[#b8f724] bg-[#b8f724]/5 dark:bg-[#b8f724]/10 shadow-lg' 
                                      : 'border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-white/10'
                                   }`}
                                >
                                   {item.badge && <span className="absolute top-4 right-4 text-[8px] font-black bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.badge}</span>}
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${method === item.id ? 'bg-[#b8f724] text-black shadow-lg shadow-[#b8f724]/20' : 'bg-white dark:bg-zinc-800 text-zinc-400 transition-colors'}`}>
                                      <item.icon className="w-5 h-5" />
                                   </div>
                                   <span className={`text-[10px] font-black uppercase tracking-widest ${method === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>{item.label}</span>
                                </button>
                             ))}
                          </div>

                          <button 
                             onClick={() => setStep('style')}
                             className="w-full max-w-sm mx-auto bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-6 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.01] transition-all shadow-xl mt-8 active:scale-[0.98]"
                          >
                             Set Preferences
                          </button>
                       </div>
                    )}

                    {step === 'style' && (
                       <div className="space-y-10 animate-fade-in flex-1 flex flex-col justify-center">
                          <div className="space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight px-1">Describe the preferred style</h2>
                             <p className="text-zinc-500 dark:text-zinc-400 text-sm px-1">Fine-tune the vibe, aesthetic, and mood of your build.</p>
                          </div>

                          <div className="space-y-6">
                             <textarea 
                                value={stylePrompt}
                                onChange={(e) => setStylePrompt(e.target.value)}
                                placeholder="e.g., 'Minimalist startup aesthetic with soft gradients, glassmorphism, and bold headings...'"
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[32px] p-8 text-zinc-900 dark:text-white font-medium text-base placeholder:text-zinc-300 dark:placeholder:text-zinc-800 outline-none focus:ring-4 focus:ring-[#b8f724]/10 dark:focus:ring-[#b8f724]/5 focus:border-[#b8f724]/50 transition-all resize-none h-40 shadow-inner"
                             />

                             <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                   <button 
                                     key={tag} 
                                     onClick={() => setStylePrompt(prev => prev ? `${prev} ${tag}` : tag)}
                                     className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-[9px] font-black text-zinc-500 dark:text-zinc-400 transition-colors uppercase tracking-widest border border-zinc-200 dark:border-white/10"
                                   >
                                      {tag}
                                   </button>
                                ))}
                             </div>

                             <button 
                                onClick={handleFinalGenerate}
                                className="w-full bg-[#b8f724] text-zinc-900 py-7 rounded-[32px] font-black text-[13px] tracking-[0.25em] uppercase hover:scale-[1.01] transition-all shadow-2xl shadow-[#b8f724]/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                             >
                                <Sparkles className="w-5 h-5" /> Generate Architecture
                             </button>
                          </div>
                       </div>
                    )}

                 </div>
              </div>

              {/* Quick History Log */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                       <History className="w-4 h-4 text-[#b8f724]" /> Synthesis Feed
                    </h3>
                    <button className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Manage All</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-[40px] bg-white/50 dark:bg-zinc-900/50 space-y-3 flex flex-col items-center justify-center text-center group hover:border-[#b8f724] transition-colors cursor-pointer">
                       <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300 dark:text-zinc-700 group-hover:bg-[#b8f724]/10 group-hover:text-[#b8f724] transition-colors">
                          <Plus className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Empty Log</p>
                          <p className="text-[10px] text-zinc-300 dark:text-zinc-700 uppercase font-black tracking-widest">Your builds appear here</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* ── Secondary Info Sidebar ── */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Stats Card */}
              <div className="bg-zinc-950 dark:bg-[#111111] rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden group border border-white/5">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-[#b8f724]/10 blur-3xl -mr-20 -mt-20 group-hover:bg-[#b8f724]/20 transition-colors" />
                 
                 <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2 text-[#b8f724]">
                       <Activity className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Engine Load</span>
                    </div>
                    <h4 className="text-3xl font-bold tracking-tighter">Peak Stable</h4>
                 </div>

                 <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sync Latency</p>
                       <p className="text-2xl font-black font-mono tracking-tighter">1.2s</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Uptime</p>
                       <p className="text-2xl font-black font-mono tracking-tighter text-[#b8f724]">99.9%</p>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/10 space-y-5">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400">
                       <span>Quota Usage</span>
                       <span className="text-[#b8f724]">12 / 50</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                       <div className="h-full bg-[#b8f724] w-[24%] rounded-full shadow-[0_0_15px_rgba(184,247,36,0.5)]" />
                    </div>
                 </div>
              </div>

              {/* Exploration Cards */}
              <div className="space-y-4">
                 <Link href="/dashboard/discover" className="group">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[40px] p-7 flex items-center justify-between hover:border-[#b8f724] hover:shadow-2xl hover:shadow-[#b8f724]/5 transition-all">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[#b8f724] group-hover:text-black transition-all">
                             <Layers className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">Library</p>
                             <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 uppercase font-black tracking-widest leading-none">400+ Blocks</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-zinc-300 pointer-events-none group-hover:translate-x-1 transition-transform" />
                    </div>
                 </Link>

                 <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[40px] p-7 flex items-center justify-between hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ImageIcon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">Snap2Code</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 uppercase font-black tracking-widest leading-none">Image Synthesis</p>
                       </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 pointer-events-none group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
