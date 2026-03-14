"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="relative min-h-screen overflow-hidden bg-white">
      
      {/* ── Background Branding Gradient ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-[#b8f724]/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-[#b8f724]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-6 lg:px-12 space-y-12 pb-32">
        
        {/* ── Page Header (Sticky-ish) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 pb-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#b8f724]/10 rounded-full w-fit border border-[#b8f724]/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#b8f724] animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Architect Online</span>
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
                 Welcome back, <span className="text-[#b8f724] drop-shadow-sm font-bold">{user?.email?.split('@')[0] || "Designer"}</span>
              </h1>
           </div>

           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Model</p>
                 <p className="text-sm font-semibold text-zinc-900">Vibro-Flux 4.2 L</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#b8f724] shadow-lg shadow-[#b8f724]/10">
                 <Cpu className="w-6 h-6" />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           
           {/* ── Main Wizard Area ── */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Animated Step Container */}
              <div className="bg-white border border-zinc-200 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 min-h-[500px] flex flex-col relative group">
                 
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
                             <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">What do you want to build today?</h2>
                             <p className="text-zinc-500 text-sm">Start your architectural journey with a simple description.</p>
                          </div>
                          
                          <div className="space-y-6">
                             <div className="relative group/input">
                                <div className="absolute top-5 left-5 text-zinc-400 group-focus-within/input:text-[#b8f724] transition-colors">
                                   <Search className="w-5 h-5" />
                                </div>
                                <textarea 
                                   rows={4}
                                   value={prompt}
                                   onChange={(e) => setPrompt(e.target.value)}
                                   placeholder="Describe your project... e.g., 'A professional portfolio for a digital artist with a dark aesthetic and interactive gallery'"
                                   className="w-full bg-zinc-50 border border-zinc-200 rounded-[24px] pl-14 pr-6 pt-5 pb-5 text-zinc-900 font-medium text-lg placeholder:text-zinc-300 outline-none focus:ring-4 focus:ring-[#b8f724]/10 focus:border-[#b8f724]/50 transition-all resize-none shadow-inner"
                                />
                             </div>
                             
                             <div className="flex justify-between items-center bg-zinc-50 p-6 rounded-[24px] border border-zinc-200">
                                <div className="space-y-1">
                                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Architecture</p>
                                   <p className="text-sm font-semibold text-zinc-900 capitalize">{category} Build</p>
                                </div>
                                <div className="flex p-1 bg-white rounded-xl border border-zinc-100 shadow-sm">
                                   <button 
                                      onClick={() => setCategory("app")}
                                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${category === 'app' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
                                   >
                                      App
                                   </button>
                                   <button 
                                      onClick={() => setCategory("website")}
                                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${category === 'website' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
                                   >
                                      Web
                                   </button>
                                </div>
                             </div>

                             <button 
                                disabled={!prompt.trim()}
                                onClick={() => setStep('device')}
                                className="w-full bg-zinc-900 text-white py-5 rounded-[24px] font-display font-bold text-sm tracking-widest uppercase hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 active:scale-[0.98]"
                             >
                                Continue Synthesis <ArrowRight className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    )}

                    {step === 'device' && (
                       <div className="space-y-10 animate-fade-in flex-1 flex flex-col justify-center">
                          <div className="text-center space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Which device are you designing for?</h2>
                             <p className="text-zinc-500 text-sm">We'll optimize the spatial layout accordingly.</p>
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
                                   className={`p-8 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all group/item ${
                                      device === item.id 
                                      ? 'border-[#b8f724] bg-[#b8f724]/5 bg-white shadow-xl scale-105' 
                                      : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'
                                   }`}
                                >
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${device === item.id ? 'bg-[#b8f724] text-black' : 'bg-white text-zinc-400 group-hover/item:text-zinc-900'}`}>
                                      <item.icon className="w-6 h-6" />
                                   </div>
                                   <span className={`text-xs font-bold uppercase tracking-widest ${device === item.id ? 'text-zinc-900' : 'text-zinc-400'}`}>{item.label}</span>
                                </button>
                             ))}
                          </div>

                          <button 
                             onClick={() => setStep('method')}
                             className="w-full max-w-sm mx-auto bg-zinc-900 text-white py-5 rounded-[24px] font-display font-bold text-sm tracking-widest uppercase hover:bg-black transition-all shadow-xl mt-8 active:scale-[0.98]"
                          >
                             Next Step
                          </button>
                       </div>
                    )}

                    {step === 'method' && (
                       <div className="space-y-10 animate-fade-in flex-1 flex flex-col justify-center">
                          <div className="text-center space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Choose a synthesis method</h2>
                             <p className="text-zinc-500 text-sm">How should the AI generate the initial style?</p>
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
                                   className={`p-6 rounded-[28px] border-2 flex flex-col items-center gap-3 transition-all relative ${
                                      method === item.id 
                                      ? 'border-[#b8f724] bg-[#b8f724]/5 shadow-lg' 
                                      : 'border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200'
                                   }`}
                                >
                                   {item.badge && <span className="absolute top-3 right-3 text-[8px] font-black bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">{item.badge}</span>}
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === item.id ? 'bg-[#b8f724] text-black shadow-lg shadow-[#b8f724]/20' : 'bg-white text-zinc-400'}`}>
                                      <item.icon className="w-5 h-5" />
                                   </div>
                                   <span className={`text-[11px] font-bold uppercase tracking-wider ${method === item.id ? 'text-zinc-900' : 'text-zinc-400'}`}>{item.label}</span>
                                </button>
                             ))}
                          </div>

                          <button 
                             onClick={() => setStep('style')}
                             className="w-full max-w-sm mx-auto bg-zinc-900 text-white py-5 rounded-[24px] font-display font-bold text-sm tracking-widest uppercase hover:bg-black transition-all shadow-xl mt-8 active:scale-[0.98]"
                          >
                             Set Preferences
                          </button>
                       </div>
                    )}

                    {step === 'style' && (
                       <div className="space-y-10 animate-fade-in flex-1 flex flex-col justify-center">
                          <div className="space-y-3">
                             <h2 className="text-2xl font-bold text-zinc-900 tracking-tight px-1">Describe the preferred style</h2>
                             <p className="text-zinc-500 text-sm px-1">Fine-tune the vibe, aesthetic, and mood of your build.</p>
                          </div>

                          <div className="space-y-6">
                             <textarea 
                                value={stylePrompt}
                                onChange={(e) => setStylePrompt(e.target.value)}
                                placeholder="e.g., 'Minimalist startup aesthetic with soft gradients, glassmorphism, and bold headings...'"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[24px] p-6 text-zinc-900 font-medium text-base placeholder:text-zinc-300 outline-none focus:ring-4 focus:ring-[#b8f724]/10 focus:border-[#b8f724]/50 transition-all resize-none h-32"
                             />

                             <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                   <button 
                                     key={tag} 
                                     onClick={() => setStylePrompt(prev => prev ? `${prev} ${tag}` : tag)}
                                     className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-[10px] font-bold text-zinc-500 transition-colors uppercase tracking-widest border border-zinc-200"
                                   >
                                      {tag}
                                   </button>
                                ))}
                             </div>

                             <button 
                                onClick={handleFinalGenerate}
                                className="w-full bg-[#b8f724] text-zinc-900 py-6 rounded-[28px] font-display font-black text-xs tracking-[0.2em] uppercase hover:bg-zinc-900 hover:text-white transition-all shadow-2xl shadow-[#b8f724]/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                             >
                                <Sparkles className="w-5 h-5" /> Generate My Project
                             </button>
                          </div>
                       </div>
                    )}

                 </div>
              </div>

              {/* Quick History Log */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                       <History className="w-4 h-4 text-[#b8f724]" /> Synthesis Feed
                    </h3>
                    <button className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">Manage All</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-dashed border-zinc-100 rounded-[32px] bg-white/50 space-y-3 flex flex-col items-center justify-center text-center group hover:border-[#b8f724] transition-colors cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-[#b8f724]/10 group-hover:text-[#b8f724] transition-colors">
                          <Plus className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">Empty Log</p>
                          <p className="text-[10px] text-zinc-300 uppercase font-bold tracking-tight">Your builds appear here</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* ── Secondary Info Sidebar ── */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Stats Card */}
              <div className="bg-zinc-900 rounded-[40px] p-8 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#b8f724]/10 blur-3xl -mr-16 -mt-16 group-hover:bg-[#b8f724]/20 transition-colors" />
                 
                 <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2 text-[#b8f724]">
                       <Activity className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Neural Load</span>
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight">Peak Optimized</h4>
                 </div>

                 <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sync Speed</p>
                       <p className="text-xl font-bold font-mono tracking-tighter">1.2s</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Reliability</p>
                       <p className="text-xl font-bold font-mono tracking-tighter text-emerald-400">99.9%</p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                       <span>Quota Usage</span>
                       <span className="text-[#b8f724]">12 / 50</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-[#b8f724] w-[24%]" />
                    </div>
                 </div>
              </div>

              {/* Exploration Cards */}
              <div className="space-y-4">
                 <Link href="/dashboard/discover" className="group">
                    <div className="bg-white border border-zinc-200 rounded-[32px] p-6 flex items-center justify-between hover:border-[#b8f724] hover:shadow-xl hover:shadow-[#b8f724]/5 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#b8f724] group-hover:text-black transition-all">
                             <Layers className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-zinc-900 leading-none">Discovery</p>
                             <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">400+ Components</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-zinc-300 pointer-events-none" />
                    </div>
                 </Link>

                 <div className="bg-white border border-zinc-200 rounded-[32px] p-6 flex items-center justify-between hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <ImageIcon className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-zinc-900 leading-none">Snap2Code</p>
                          <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">Synthesize Images</p>
                       </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 pointer-events-none" />
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
