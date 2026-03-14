"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { marketplaceComponents, type MarketplaceComponent } from "@/lib/marketplace";
import Link from "next/link";
import { Zap, Terminal, Copy, Check, ChevronLeft, Sliders, Box, Monitor, Smartphone, Tablet } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const componentId = searchParams.get("id");
  
  const [component, setComponent] = useState<MarketplaceComponent | null>(null);
  const [selectedColor, setSelectedColor] = useState("#b8f724");
  const [borderRadius, setBorderRadius] = useState("24px");
  const [isGenerating, setIsGenerating] = useState(false);
  const [installLink, setInstallLink] = useState("");
  const [viewport, setViewport] = useState("desktop");

  useEffect(() => {
    if (componentId) {
      const found = marketplaceComponents.find(c => c.id === componentId);
      if (found) {
        setComponent(found);
      }
    } else {
      setComponent(marketplaceComponents[0]);
    }
  }, [componentId]);

  const handleGenerateLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const link = `vibro install ${component?.id || 'component'} --color ${selectedColor.replace('#', '')} --radius ${borderRadius}`;
      setInstallLink(link);
      setIsGenerating(false);
    }, 1500);
  };

  if (!component) return null;

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 min-h-[calc(100vh-6rem)] selection:bg-[#b8f724] selection:text-black">
      {/* ── Editor Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <Link href="/dashboard/discover" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-widest mb-2">
              <ChevronLeft className="w-4 h-4" /> Back to Library
           </Link>
           <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
                {component.name}
              </h1>
              <div className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200">
                 config_active
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={handleGenerateLink}
             disabled={isGenerating}
             className="px-8 py-4 rounded-2xl bg-black text-[#b8f724] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
           >
              {isGenerating ? (
                <>
                   <div className="w-4 h-4 border-2 border-[#b8f724] border-t-transparent rounded-full animate-spin" />
                   Synthesizing...
                </>
              ) : (
                <>
                   <Terminal className="w-4 h-4" /> Generate Install Command
                </>
              )}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* ── Preview Environment ── */}
         <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-white border border-zinc-200 p-2 rounded-2xl shadow-sm">
               <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
                  <button onClick={() => setViewport("desktop")} className={`p-2 rounded-lg transition-all ${viewport === "desktop" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}><Monitor className="w-4 h-4" /></button>
                  <button onClick={() => setViewport("tablet")} className={`p-2 rounded-lg transition-all ${viewport === "tablet" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}><Tablet className="w-4 h-4" /></button>
                  <button onClick={() => setViewport("mobile")} className={`p-2 rounded-lg transition-all ${viewport === "mobile" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}><Smartphone className="w-4 h-4" /></button>
               </div>
               <div className="flex items-center gap-4 px-4">
                  <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#b8f724]" />
                     <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Live Viewport</span>
                  </div>
                  <div className="h-4 w-px bg-zinc-200" />
                  <span className="text-[10px] font-black text-zinc-900 uppercase">{viewport.toUpperCase()}_MODE</span>
               </div>
            </div>

            <div className="flex-1 min-h-[600px] bg-zinc-100 rounded-[40px] border border-zinc-200 p-12 lg:p-20 flex items-center justify-center relative overflow-hidden group/canvas">
               <div className="absolute inset-0 opacity-10 blur-3xl bg-gradient-to-br from-[#b8f724] to-transparent pointer-events-none" />
               
               <div className="relative w-full transition-all duration-700 ease-in-out" style={{ maxWidth: viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "390px" }}>
                  <div className="bg-white rounded-[32px] border border-zinc-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(184,247,36,0.1)]">
                     <div className="h-10 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0">
                        <div className="flex gap-1.5">
                           <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                           <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                        </div>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{component.name} / Preview</span>
                        <div className="w-10" />
                     </div>
                     
                     <div className="p-10 md:p-16 flex flex-col gap-10">
                        <img 
                          src={component.image} 
                          alt={component.name}
                          className="w-full object-cover transition-all duration-500 shadow-inner"
                          style={{
                            borderRadius,
                            filter: `hue-rotate(${selectedColor === '#b8f724' ? '0deg' : selectedColor === '#3b82f6' ? '-90deg' : '90deg'})`
                          }}
                        />
                        <div className="space-y-6 pt-10 border-t border-zinc-50">
                           <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{component.name}</h3>
                              <button 
                                className="px-8 py-3.5 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
                                style={{ backgroundColor: selectedColor, borderRadius, color: selectedColor === '#FAFAF8' ? 'black' : 'white' }}
                              >
                                {component.category.split(' ')[0]} Action
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Command Success Overlay */}
               {installLink && (
                 <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                    <div className="max-w-2xl w-full text-center space-y-10">
                       <div className="w-24 h-24 rounded-full bg-[#b8f724] mx-auto flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(184,247,36,0.2)]">
                          ✨
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Architecture Ready</h2>
                          <p className="text-zinc-500 font-bold text-lg uppercase tracking-widest">command line bridge active</p>
                       </div>
                       
                       <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-left relative group">
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-zinc-600" />
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Install Command</span>
                             </div>
                             <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                             </div>
                          </div>
                          <code className="text-[#b8f724] font-mono text-sm break-all leading-relaxed">{installLink}</code>
                          <button 
                            onClick={() => navigator.clipboard.writeText(installLink)}
                            className="absolute top-6 right-6 p-3 rounded-2xl bg-zinc-800 text-white hover:bg-white hover:text-black transition-all group/copy"
                          >
                             <Copy className="w-4 h-4" />
                          </button>
                       </div>

                       <div className="pt-6">
                          <button 
                            onClick={() => setInstallLink("")}
                            className="text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest border-b border-zinc-800 hover:border-white transition-all"
                          >
                             Close & Continue Fine-Tuning
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
         </div>

         {/* ── Settings Sidebar ── */}
         <aside className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm space-y-10">
               <section className="space-y-6">
                  <div className="flex items-center justify-between uppercase">
                     <span className="text-[10px] font-black tracking-widest text-zinc-400">Visual_Tokens</span>
                     <Sliders className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                  
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Primary Color</label>
                        <div className="grid grid-cols-5 gap-3">
                           {["#b8f724", "#3b82f6", "#ef4444", "#18181b", "#ffffff"].map(color => (
                              <button 
                                 key={color}
                                 className={`aspect-square rounded-xl border-2 transition-all ${selectedColor === color ? 'border-zinc-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                 style={{ backgroundColor: color }}
                                 onClick={() => setSelectedColor(color)}
                              />
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Edge Radius</label>
                        <div className="grid grid-cols-2 gap-2">
                           {[
                             { label: "Sharp", value: "0px" },
                             { label: "Soft", value: "16px" },
                             { label: "Rounded", value: "32px" },
                             { label: "Pill", value: "9999px" }
                           ].map(radius => (
                              <button 
                                 key={radius.label}
                                 className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${borderRadius === radius.value ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-300 hover:text-zinc-900'}`}
                                 onClick={() => setBorderRadius(radius.value)}
                              >
                                 {radius.label}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </section>

               <section className="space-y-4 pt-8 border-t border-zinc-100">
                  <div className="uppercase">
                     <span className="text-[10px] font-black tracking-widest text-zinc-400">Architecture</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-4 text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Box className="w-3.5 h-3.5" /> Framework</div>
                        <span className="text-zinc-900">{component.frameworks[0]}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Styling</div>
                        <span className="text-zinc-900">Tailwind v4</span>
                     </div>
                  </div>
               </section>
            </div>

            <div className="bg-zinc-900 rounded-[32px] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#b8f724] opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
               <h4 className="text-[11px] font-black uppercase tracking-widest text-[#b8f724]">CLI_Ready</h4>
               <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                  Every change you make updates the installation metadata in real-time.
               </p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all">Documentation</button>
            </div>
         </aside>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
