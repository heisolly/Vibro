"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Palette, 
  Layers, 
  Settings, 
  ChevronDown, 
  Save, 
  Share2, 
  Download,
  Search,
  Plus,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Layout,
  Box,
  Activity,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Command,
  ArrowRight,
  ChevronLeft,
  Cpu,
  SlidersHorizontal,
  Cloud,
  Terminal,
  Package,
  Eye,
  Undo2,
  Redo2,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

// ── Types ──
type Archetype = 'app' | 'website';
type SynthesisStage = 'Analyzing' | 'Structuring' | 'Generating' | 'Styling' | 'Finalizing' | 'Complete';

function WorkstationContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Professional SaaS Platform";
  const type = (searchParams.get("type") as Archetype) || "app";
  const initialDevice = searchParams.get("device") || "desktop";

  const [activeTab, setActiveTab] = useState<'design' | 'code'>('design');
  const [viewport, setViewport] = useState(initialDevice);
  const [stage, setStage] = useState<SynthesisStage>('Analyzing');
  const [progress, setProgress] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState(12);
  const [accentColor, setAccentColor] = useState("#b8f724");
  const [revision, setRevision] = useState("");

  const synthesisStages: SynthesisStage[] = ['Analyzing', 'Structuring', 'Generating', 'Styling', 'Finalizing', 'Complete'];

  // Professionalized component data
  const components = useMemo(() => {
    if (type === 'app') {
       return [
          { id: 'h1', name: 'Global Navbar', type: 'navbar', content: { title: 'Vibro Studio', items: ['Dash', 'Assets', 'Logs'] } },
          { id: 's1', name: 'Metric Overview', type: 'stats', content: { stats: [{ label: 'Total Users', val: '2.4k' }, { label: 'Revenue', val: '$42k' }, { label: 'Growth', val: '+12%' }] } },
          { id: 'c1', name: 'Activity Feed', type: 'list', content: { items: ['User signed up', 'Payment processed', 'Feedback received'] } },
          { id: 'f1', name: 'System Console', type: 'terminal', content: { status: 'Connected', region: 'us-east-1' } }
       ];
    }
    return [
       { id: 'n1', name: 'Main Navigation', type: 'navbar', content: { links: ['Features', 'Pricing', 'Docs', 'Login'] } },
       { id: 'he1', name: 'Hero Section', type: 'hero', content: { title: query.split('|')[0].trim(), sub: 'The industrial standard for interface synthesis.' } },
       { id: 'g1', name: 'Feature Matrix', type: 'grid', content: { items: ['AI Optimized', 'Global CDN', 'Real-time Sync'] } },
       { id: 'p1', name: 'Pricing Tiers', type: 'pricing', content: { plans: ['Starter', 'Pro', 'Enterprise'] } }
    ];
  }, [type, query]);

  const mockCode = `
import React from 'react';
import { DashboardLayout, MetricCard, UserTable } from '@/components/vibro-ui';

/**
 * Objective: ${query}
 * Architecture: ${type}
 * Device Target: ${viewport}
 */
export default function SynthesizedPage() {
  return (
    <DashboardLayout variant="modern">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-end">
           <h1 className="text-3xl font-bold tracking-tight text-zinc-900">${query.split('|')[0]}</h1>
           <p className="text-zinc-500 font-medium">Last synced: ${new Date().toLocaleTimeString()}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <MetricCard label="Efficiency" value="98%" trend="up" />
           <MetricCard label="Resources" value="Low" trend="stable" />
           <MetricCard label="Uptime" value="100%" trend="up" />
        </section>

        <main className="bg-white border rounded-2xl p-6 shadow-sm min-h-[400px]">
           {/* Primary Content Grid */}
        </main>
      </div>
    </DashboardLayout>
  );
}`;

  useEffect(() => {
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < synthesisStages.length - 1) {
        currentStage++;
        setStage(synthesisStages[currentStage]);
        setProgress((currentStage / (synthesisStages.length - 1)) * 100);
      } else {
        clearInterval(interval);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const isComplete = stage === 'Complete';

  return (
    <div className="h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans selection:bg-[#b8f724]/30 selection:text-zinc-900 overflow-hidden">
      
      {/* ── Top Editor Header ── */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0 z-50">
         <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#b8f724]">
                  <Zap className="w-4 h-4" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-zinc-900 leading-none">Architect</span>
                  <span className="text-[10px] text-zinc-400 font-medium mt-0.5 truncate max-w-[140px] uppercase tracking-tighter">{type} synthesis</span>
               </div>
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 shadow-sm">
               <button onClick={() => setActiveTab('design')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === 'design' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>Canvas</button>
               <button onClick={() => setActiveTab('code')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === 'code' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>Source</button>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
               <button onClick={() => setViewport('desktop')} title="Desktop View" className={`px-2.5 py-1.5 rounded-md transition-all ${viewport === 'desktop' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}><Monitor className="w-3.5 h-3.5" /></button>
               <button onClick={() => setViewport('tablet')} title="Tablet View" className={`px-2.5 py-1.5 rounded-md transition-all ${viewport === 'tablet' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}><Tablet className="w-3.5 h-3.5" /></button>
               <button onClick={() => setViewport('mobile')} title="Mobile View" className={`px-2.5 py-1.5 rounded-md transition-all ${viewport === 'mobile' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}><Smartphone className="w-3.5 h-3.5" /></button>
            </div>
            <div className="h-6 w-px bg-zinc-200" />
            <button className="flex items-center gap-2 px-5 py-2 bg-[#b8f724] text-zinc-900 rounded-lg text-xs font-bold hover:bg-[#a3dd1c] transition-all shadow-lg shadow-[#b8f724]/20 border border-[#b8f724]/50">
               Export Bundle <Download className="w-3.5 h-3.5" />
            </button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Tree Sidebar */}
         <aside className="w-[280px] bg-white border-r border-zinc-200 flex flex-col shrink-0">
            <div className="p-5 border-b border-zinc-100 pb-3 flex items-center justify-between">
               <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Architecture Tree</h3>
               <Layers className="w-3 h-3 text-zinc-300" />
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
               {components.map(comp => (
                  <button 
                    key={comp.id} 
                    onClick={() => setSelectedId(comp.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${selectedId === comp.id ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${selectedId === comp.id ? 'bg-[#b8f724] border-[#b8f724]/50 text-zinc-900 shadow-sm' : 'bg-transparent border-transparent text-zinc-400'}`}>
                        <Package className="w-4 h-4" />
                     </div>
                     <div className="flex flex-col items-start leading-none">
                        <span className="text-[12.5px] font-semibold">{comp.name}</span>
                        <span className="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">{comp.type}</span>
                     </div>
                  </button>
               ))}
               <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 border border-dashed border-zinc-200 hover:border-[#b8f724] hover:text-zinc-900 transition-all mt-4">
                  <Plus className="w-4 h-4" />
                  <span className="text-[12.5px] font-semibold">Add Segment</span>
               </button>
            </nav>
            <div className="p-4 border-t border-zinc-100">
               <div className="p-4 bg-zinc-950 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#b8f724]/20 blur-2xl" />
                  <div className="flex items-center gap-3 relative z-10">
                     <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-[#b8f724]">LLM</div>
                     <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-white">Engine Active</span>
                        <span className="text-[9px] font-medium text-[#b8f724] uppercase tracking-wider">Syncing Nodes...</span>
                     </div>
                  </div>
               </div>
            </div>
         </aside>

         {/* Monitor Area */}
         <main className="flex-1 relative flex flex-col items-center bg-[#F9F9F8] overflow-hidden">
            <div className="flex-1 w-full overflow-auto p-12 lg:p-16 flex flex-col items-center animate-fade-in relative transition-all duration-500">
               
               <div 
                 className={`bg-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700 relative border border-zinc-100
                   ${!isComplete ? 'blur-2xl opacity-50 scale-[0.98]' : 'blur-0 opacity-100 scale-100'}
                 `}
                 style={{ 
                    width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '390px',
                    maxWidth: '100%',
                    minHeight: '1200px',
                    borderRadius: `${borderRadius}px`
                 }}
               >
                  {!isComplete && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl z-[60]">
                        <div className="w-20 h-20 bg-zinc-900 rounded-[24px] flex items-center justify-center text-[#b8f724] mb-8 animate-pulse shadow-2xl shadow-[#b8f724]/10">
                           <Zap className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-4">
                           <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-none">Architecting UI...</h2>
                           <p className="text-xs text-zinc-400 font-medium uppercase tracking-[0.2em]">{stage} level synthesis</p>
                           <div className="w-56 h-1 w-full bg-zinc-100 rounded-full overflow-hidden mx-auto">
                              <div className="h-full bg-[#b8f724] transition-all duration-700" style={{ width: `${progress}%` }} />
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'code' ? (
                     <div className="flex-1 p-16 bg-[#09090B] text-zinc-400 font-mono text-[14px] leading-relaxed selection:bg-[#b8f724]/30">
                        <pre className="custom-scrollbar overflow-auto">{mockCode}</pre>
                     </div>
                  ) : (
                     <div className="flex-1 bg-white flex flex-col min-h-full">
                        {components.map(comp => (
                           <div key={comp.id} className={`p-10 border-b border-zinc-50 group/comp transition-all ${selectedId === comp.id ? 'bg-[#b8f724]/5 ring-1 ring-inset ring-[#b8f724]/20' : 'hover:bg-zinc-50/50'}`} onClick={() => setSelectedId(comp.id)}>
                              {comp.type === 'navbar' && (
                                 <div className="flex items-center justify-between px-8 py-5 rounded-2xl border border-zinc-100 bg-white shadow-sm">
                                    <h4 className="font-bold text-zinc-900 flex items-center gap-2"><Zap className="w-4 h-4 text-[#b8f724]" /> {(comp.content as any).title || 'Brand'}</h4>
                                    <div className="flex gap-8">
                                       {((comp.content as any).items || (comp.content as any).links || []).map((l: any) => <span key={l} className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">{l}</span>)}
                                    </div>
                                    <button className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">Action</button>
                                 </div>
                              )}
                              
                              {comp.type === 'hero' && (
                                 <div className={`py-32 space-y-10 text-center max-w-2xl mx-auto ${viewport === 'mobile' ? 'scale-90 origin-top' : ''}`}>
                                    <div className="inline-block px-4 py-1.5 bg-[#b8f724]/10 text-zinc-900 border border-[#b8f724]/30 rounded-full text-[10px] font-bold uppercase tracking-widest">Interface Synthesis v2.4</div>
                                    <h1 className="text-6xl font-black tracking-tighter text-zinc-900 leading-[1] uppercase italic">
                                       {((comp.content as any).title || '').split(' ').map((w: string, i: number) => (
                                          <span key={i} className={i % 2 === 1 ? 'text-zinc-400' : ''}>{w} </span>
                                       ))}
                                    </h1>
                                    <p className="text-lg text-zinc-500 font-medium leading-relaxed px-6">{(comp.content as any).sub}</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                       <button className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white rounded-[20px] font-bold text-sm shadow-2xl hover:bg-black transition-all">Get Synthesis</button>
                                       <button className="w-full sm:w-auto px-10 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-[20px] font-bold text-sm hover:bg-zinc-50 transition-all">Browse Docs</button>
                                    </div>
                                 </div>
                              )}

                              {comp.type === 'stats' && (
                                 <div className={`grid ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-6 py-12`}>
                                    {((comp.content as any).stats || []).map((s: any) => (
                                       <div key={s.label} className="p-10 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-2 group/stat hover:border-[#b8f724] transition-all">
                                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.label}</p>
                                          <p className="text-4xl font-black text-zinc-950 tracking-tighter italic">{s.val}</p>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {comp.type === 'pricing' && (
                                 <div className={`grid ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-8 py-20`}>
                                    {((comp.content as any).plans || []).map((p: any, i: number) => (
                                       <div key={p} className={`p-10 rounded-[40px] border border-zinc-100 flex flex-col justify-between h-[500px] transition-all ${i === 1 ? 'shadow-[0_40px_100px_rgba(0,0,0,0.1)] bg-white border-[#b8f724]/30 scale-105 z-10' : 'bg-zinc-50/30'}`}>
                                          <div className="space-y-8">
                                             <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">{p}</h4>
                                                {i === 1 && <Sparkles className="w-5 h-5 text-[#b8f724]" />}
                                             </div>
                                             <p className="text-6xl font-black tracking-tighter text-zinc-950 italic">${i * 49}<span className="text-sm font-medium text-zinc-300 ml-1">/mo</span></p>
                                             <div className="space-y-5 pt-4">
                                                {['Synthesized UI', 'Vibro Engine Access', 'Pro Cloud Sync'].map(f => (
                                                   <div key={f} className="flex items-center gap-3 text-xs font-semibold text-zinc-500">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-[#b8f724]" /> {f}
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                          <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${i === 1 ? 'bg-zinc-900 text-white shadow-xl hover:bg-black' : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'}`}>Start Build</button>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Prompt Bar (Subtle Revision) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-12 z-[60]">
               <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-[32px] p-2.5 shadow-[0_30px_70px_rgba(0,0,0,0.12)] flex items-center gap-4 transition-all focus-within:ring-4 focus-within:ring-[#b8f724]/10">
                  <div className="w-11 h-11 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#b8f724] shrink-0 shadow-lg">
                     <Sparkles className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={revision}
                    onChange={(e) => setRevision(e.target.value)}
                    placeholder="Refine synthesis architecture..."
                    className="flex-1 bg-transparent border-none outline-none font-semibold text-sm text-zinc-900 placeholder:text-zinc-300"
                  />
                  <button className="px-8 py-3 bg-[#b8f724] text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-lg active:scale-95">
                     Finalize UI
                  </button>
               </div>
            </div>
         </main>

         {/* Property Panel */}
         <aside className="w-[340px] bg-white border-l border-zinc-200 flex flex-col shrink-0">
            <div className="h-16 flex items-center justify-between px-8 border-b border-zinc-100 pb-1">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Configurator</h3>
               <SlidersHorizontal className="w-4 h-4 text-zinc-300" />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
               <section className="space-y-10">
                  <div className="space-y-6">
                     <div className="flex justify-between items-end">
                        <label className="text-[11px] font-black text-zinc-900 uppercase tracking-widest leading-none">Radius</label>
                        <span className="text-[10px] font-bold text-[#b8f724] bg-zinc-900 px-2 py-0.5 rounded-md">{borderRadius}px</span>
                     </div>
                     <input type="range" min="0" max="48" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full accent-zinc-900 cursor-pointer h-1.5 bg-zinc-100 rounded-full appearance-none" />
                  </div>

                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-zinc-900 uppercase tracking-widest block">Spectral Theme</label>
                     <div className="grid grid-cols-4 gap-3">
                        {['#121212', '#b8f724', '#00e5ff', '#ff3d00'].map(c => (
                           <button 
                             key={c} 
                             onClick={() => setAccentColor(c)}
                             className={`h-11 rounded-2xl border-2 transition-all active:scale-90 ${accentColor === c ? 'border-zinc-900 p-0.5' : 'border-transparent opacity-60 hover:opacity-100'}`}
                           >
                              <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: c }} />
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 border-t border-zinc-50 space-y-6">
                     <label className="text-[11px] font-black text-zinc-900 uppercase tracking-widest block">Architecture Logic</label>
                     <div className="space-y-3">
                        {['Reactive State', 'SSR Pre-rendering', 'Neural Optimization'].map(item => (
                           <div key={item} className="flex items-center justify-between p-5 bg-zinc-50/50 border border-zinc-100 rounded-2xl hover:bg-white hover:border-[#b8f724]/30 hover:shadow-lg hover:shadow-[#b8f724]/5 transition-all cursor-pointer group">
                              <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors">{item}</span>
                              <div className="w-9 h-5 bg-zinc-200 rounded-full flex items-center px-0.5 transition-colors group-hover:bg-[#b8f724]">
                                 <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-4" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </section>
            </div>

            <div className="p-8 border-t border-zinc-100 bg-zinc-50/30">
               <button className="w-full py-5 bg-zinc-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl shadow-zinc-400/20 hover:bg-black transition-all flex items-center justify-center gap-4 group">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Sync to Cloud
               </button>
            </div>
         </aside>
      </div>
    </div>
  );
}

export default function WorkstationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <div className="w-12 h-12 bg-zinc-100 rounded-2xl animate-spin border-4 border-t-[#b8f724] border-zinc-50" />
       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Initializing Architect Interface...</p>
    </div>}>
      <WorkstationContent />
    </Suspense>
  )
}
