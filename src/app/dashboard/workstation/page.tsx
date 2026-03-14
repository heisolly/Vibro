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
  History,
  MousePointer2,
  Code2,
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
  Package
} from "lucide-react";
import Link from "next/link";

// ── Types ──
type Archetype = 'app' | 'website';
type SynthesisStage = 'Analyzing' | 'Structuring' | 'Generating' | 'Styling' | 'Finalizing' | 'Complete';

interface ComponentData {
  id: string;
  name: string;
  type: string;
  content: any;
}

function WorkstationContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Premium SaaS Interface";
  const type = (searchParams.get("type") as Archetype) || "app";

  const [activeTab, setActiveTab] = useState<'design' | 'code'>('design');
  const [viewport, setViewport] = useState("desktop");
  const [stage, setStage] = useState<SynthesisStage>('Analyzing');
  const [progress, setProgress] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState(40);
  const [glassOpacity, setGlassOpacity] = useState(60);
  const [revision, setRevision] = useState("");

  const synthesisStages: SynthesisStage[] = ['Analyzing', 'Structuring', 'Generating', 'Styling', 'Finalizing', 'Complete'];

  // Realistic simulation of Vibro-branded component data
  const generatedComponents = useMemo(() => {
    if (type === 'app') {
       return [
          { 
             id: 'v_header', 
             name: 'Vibro_Flux_Header', 
             type: 'header', 
             content: { 
                title: 'Synthesis_Monitor_v4',
                user: 'Synthetix_Admin',
                alerts: 12
             } 
          },
          { 
             id: 'v_stats', 
             name: 'Spectral_Metrics_Grid', 
             type: 'grid', 
             content: { 
                stats: ['2.4k_Throughput', '140ms_Latency', '99.9%_Integrity'] 
             } 
          },
          { 
             id: 'v_canvas', 
             name: 'Neural_Data_Mesh', 
             type: 'canvas', 
             content: { 
                placeholder: 'Immersive Data Visualization Cluster' 
             } 
          },
          { 
            id: 'v_controls', 
            name: 'Architect_Command_Strip', 
            type: 'navbar', 
            content: { 
               links: ['Deploy_Logs', 'Node_Map', 'Registry'],
               cta: 'Sync_Protocol'
            } 
         }
       ];
    }
    return [
       { 
          id: 'v_nav', 
          name: 'Quantum_Glass_Nav', 
          type: 'navbar', 
          content: { 
             links: ['Capabilities', 'Architecture', 'Integrations', 'Pricing'],
             cta: 'Initialize_Sync'
          } 
       },
       { 
          id: 'v_hero', 
          name: 'Vibro_Synthesis_Hero', 
          type: 'hero', 
          content: { 
             title: query,
             subtitle: 'Universal architectural synthesis for high-consequence production environments. Zero friction. Absolute performance.',
             cta: 'Launch_Architecture'
          } 
       },
       { 
          id: 'v_matrix', 
          name: 'Component_Matrix_v1', 
          type: 'grid', 
          content: { 
             items: ['Atomic_Styling', 'Module_Generation', 'Cloud_Sync', 'CLI_Tunnel'] 
          } 
       },
       { 
          id: 'v_pricing', 
          name: 'Elastic_Tier_System', 
          type: 'pricing', 
          content: { 
             plans: ['Explorer', 'Architect', 'Enterprise'] 
          } 
       }
    ];
  }, [type, query]);

  const mockCode = `
import React from 'react';
import { Sparkles, Command, Zap } from 'lucide-react';
import { VibroProvider, FluxMesh, QuantumNav } from '@vibro/core';

/**
 * Vibro_Synthesis: ${query}
 * Generated: ${new Date().toLocaleDateString()}
 * Archetype: ${type.toUpperCase()}
 */
export const ProducedUI = () => {
  return (
    <VibroProvider theme="lux_monochrome">
      <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-[#b8f724] selection:text-black">
        
        <QuantumNav 
          logo={<Zap className="text-[#b8f724]" />}
          links={${JSON.stringify(generatedComponents[0].content.links || [])}}
          variant="glass"
        />

        <main className="max-w-7xl mx-auto px-8 pt-32 space-y-24">
           <section className="space-y-12">
              <h1 className="text-[120px] font-black tracking-tighter italic leading-none">
                 ${query.split(' ')[0]}<br />
                 <span className="text-zinc-400 opacity-50 underline decoration-[#b8f724] decoration-8 underline-offset-[20px]">
                   ${query.split(' ').slice(1).join('_') || 'SYNTHESIS'}
                 </span>
              </h1>
              <p className="text-xl text-zinc-500 max-w-2xl font-medium tracking-tight">
                High-consequence structural synthesis for real-world production systems.
              </p>
              <div className="flex gap-6">
                 <button className="bg-[#b8f724] text-black px-12 py-5 rounded-[32px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    Launch_System
                 </button>
                 <button className="bg-zinc-900 text-white border border-zinc-800 px-12 py-5 rounded-[32px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    View_Schema
                 </button>
              </div>
           </section>

           <FluxMesh intensity={0.5} color="#b8f724" />
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Component Matrix: Neural Modules */}
           </div>
        </main>

      </div>
    </VibroProvider>
  );
};
  `;

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
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const isComplete = stage === 'Complete';

  return (
    <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden text-zinc-900 font-sans selection:bg-[#b8f724] selection:text-black">
      {/* ── Top Control Bar ── */}
      <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-200 flex items-center justify-between px-8 shrink-0 z-50">
         <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#b8f724] group-hover:scale-110 transition-transform shadow-2xl">
                  <Zap className="w-6 h-6" />
               </div>
               <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8f724] bg-zinc-900 px-2 py-0.5 rounded-full leading-none">Architect_v4</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Synthesis_Lab</span>
                  </div>
                  <span className="text-[16px] font-black text-zinc-900 truncate max-w-[240px] tracking-tight mt-1">{query}</span>
               </div>
            </Link>
            
            <div className="h-10 w-[1px] bg-zinc-100" />
            
            <div className="flex p-1.5 bg-zinc-100 rounded-2xl shadow-inner border border-zinc-200/50">
               <button 
                 onClick={() => setActiveTab('design')}
                 className={`flex items-center gap-3 px-6 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'design' ? 'bg-white text-zinc-900 shadow-xl scale-105' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  <Monitor className="w-4 h-4" /> Canvas_View
               </button>
               <button 
                 onClick={() => setActiveTab('code')}
                 className={`flex items-center gap-3 px-6 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'code' ? 'bg-white text-zinc-900 shadow-xl scale-105' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                  <Terminal className="w-4 h-4" /> Logic_Source
               </button>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800">
               <div className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-[#b8f724] shadow-[0_0_15px_#b8f724]' : 'bg-white animate-pulse'}`} />
               <span className="text-[10px] font-black uppercase tracking-widest">{stage === 'Complete' ? 'SYSTEM_LOCKED' : stage}</span>
            </div>
            
            <div className="flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/50">
               <button onClick={() => setViewport('desktop')} className={`p-2.5 rounded-xl transition-all ${viewport === 'desktop' ? 'bg-white text-zinc-900 shadow-lg scale-110' : 'text-zinc-400'}`}><Monitor className="w-4 h-4" /></button>
               <button onClick={() => setViewport('tablet')} className={`p-2.5 rounded-xl transition-all ${viewport === 'tablet' ? 'bg-white text-zinc-900 shadow-lg scale-110' : 'text-zinc-400'}`}><Tablet className="w-4 h-4" /></button>
               <button onClick={() => setViewport('mobile')} className={`p-2.5 rounded-xl transition-all ${viewport === 'mobile' ? 'bg-white text-zinc-900 shadow-lg scale-110' : 'text-zinc-400'}`}><Smartphone className="w-4 h-4" /></button>
            </div>

            <button className="flex items-center gap-3 px-10 py-3.5 bg-black text-[#b8f724] rounded-2xl font-black uppercase text-[11px] tracking-widest border border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all">
               Deploy_Architecture <Cloud className="w-4 h-4" />
            </button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Side: Navigation / Tree */}
         <aside className="w-[320px] bg-white border-r border-zinc-200 flex flex-col shrink-0">
            <div className="p-8 border-b border-zinc-100 space-y-6">
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Synthesis_Tree</h2>
               <div className="p-6 rounded-[32px] bg-zinc-900 text-white space-y-4 relative overflow-hidden group border border-zinc-800 shadow-2xl">
                  <div className="absolute top-0 right-0 p-6 text-[#b8f724] opacity-10 group-hover:rotate-12 transition-transform scale-150">
                     <Command className="w-16 h-16" />
                  </div>
                  <div className="text-[11px] font-black uppercase text-zinc-500 tracking-widest">Active_Archetype</div>
                  <p className="text-2xl font-black italic uppercase tracking-tighter text-[#b8f724]">_{type}</p>
                  <div className="flex items-center gap-2 pt-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Optimized_For_Vercel</span>
                  </div>
               </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
               {generatedComponents.map((comp) => (
                  <button 
                    key={comp.id}
                    onClick={() => setSelectedComponentId(comp.id)}
                    className={`w-full flex items-center gap-5 px-5 py-4.5 rounded-[24px] transition-all group relative border
                      ${selectedComponentId === comp.id 
                        ? 'bg-zinc-950 text-white border-zinc-800 shadow-2xl scale-[1.03] z-10' 
                        : 'hover:bg-zinc-50 text-zinc-400 border-transparent'}
                    `}
                  >
                     <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${selectedComponentId === comp.id ? 'bg-[#b8f724] text-black rotate-6' : 'bg-zinc-100 group-hover:bg-zinc-200'}`}>
                        <Package className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col items-start gap-1">
                        <span className="text-[12px] font-black uppercase tracking-tight text-left leading-none">{comp.name}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">{comp.type}</span>
                     </div>
                     {selectedComponentId === comp.id && <div className="absolute right-4 w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />}
                  </button>
               ))}
            </nav>
            
            <div className="p-8 border-t border-zinc-100 bg-zinc-50/50">
               <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white border border-zinc-100 shadow-xl group hover:border-zinc-900 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-[18px] bg-zinc-950 flex items-center justify-center text-[#b8f724] font-black text-sm border-2 border-[#b8f724]/20 group-hover:border-[#b8f724] transition-all">S.A</div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System_Architect</span>
                     <span className="text-[13px] font-black text-zinc-950 uppercase tracking-tighter mt-0.5">Vibro_User_01</span>
                  </div>
               </div>
            </div>
         </aside>

         {/* Center: Canvas Workspace */}
         <main className="flex-1 relative flex flex-col bg-zinc-100 overflow-hidden">
            <div className="flex-1 flex flex-col items-center overflow-auto p-16 pt-24 custom-scrollbar">
               <div 
                 className={`bg-white shadow-[0_100px_200px_-40px_rgba(0,0,0,0.15)] transition-all duration-1000 origin-top overflow-hidden relative
                   ${!isComplete ? 'blur-3xl opacity-40 scale-95 grayscale' : 'blur-0 opacity-100 scale-100 grayscale-0'}
                 `}
                 style={{ 
                   width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '390px',
                   maxWidth: '100%',
                   minHeight: '1400px',
                   borderRadius: `${borderRadius}px` 
                 }}
               >
                  <div className="p-0 space-y-0 relative min-h-full flex flex-col">
                    {!isComplete && (
                       <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-white/40 backdrop-blur-3xl">
                          <div className="relative">
                             <div className="w-32 h-32 bg-zinc-950 rounded-[48px] flex items-center justify-center text-[#b8f724] shadow-[0_40px_80px_rgba(0,0,0,0.5)] animate-pulse relative z-10">
                                <Zap className="w-14 h-14" />
                             </div>
                             <div className="absolute -inset-8 border-4 border-dashed border-[#b8f724]/20 rounded-[64px] animate-spin-slow" />
                             <div className="absolute -inset-16 border-2 border-zinc-100 rounded-[80px] opacity-50" />
                          </div>
                          <div className="text-center space-y-4">
                             <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900 leading-none">Synthesizing_<span className="text-[#b8f724]">{stage}</span></h2>
                             <div className="w-64 h-1.5 bg-zinc-100 rounded-full overflow-hidden mx-auto border border-zinc-200 shadow-inner">
                                <div className="h-full bg-black transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                             </div>
                             <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.4em] pt-2">{progress.toFixed(0)}%_INTEGRITY</p>
                          </div>
                       </div>
                    )}

                    {activeTab === 'code' ? (
                       <div className="flex-1 bg-zinc-950 p-20 font-mono text-zinc-300 text-[15px] leading-relaxed relative overflow-hidden">
                          <div className="absolute top-12 left-20 flex flex-col gap-2">
                             <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Logic_Kernel_Source</div>
                             <div className="w-20 h-1 bg-[#b8f724] rounded-full" />
                          </div>
                          <div className="absolute top-12 right-12 flex gap-4">
                             <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Copy_Buffer</button>
                             <button className="bg-[#b8f724] text-black px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl">Export_JSX</button>
                          </div>
                          <pre className="whitespace-pre-wrap mt-20 opacity-90">{mockCode}</pre>
                       </div>
                    ) : (
                       <div className="flex-1 flex flex-col bg-white selection:bg-[#b8f724] selection:text-black">
                        {generatedComponents.map((comp) => (
                           <div 
                             key={comp.id}
                             className={`relative group/comp transition-all duration-500
                               ${selectedComponentId === comp.id ? 'bg-[#b8f724]/5 z-10' : 'hover:bg-zinc-50/30'}
                             `}
                             onClick={() => setSelectedComponentId(comp.id)}
                           >
                              {/* Component Visualization Indicator */}
                              <div className={`absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-500 ${selectedComponentId === comp.id ? 'opacity-100' : 'opacity-0 group-hover/comp:opacity-100'}`}>
                                 <div className="w-2 h-2 rounded-full bg-[#b8f724] shadow-[0_0_8px_#b8f724]" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-[#b8f724] bg-zinc-950 px-3 py-1 rounded-full shadow-2xl">{comp.name}</span>
                              </div>

                              <div className="w-full">
                                {comp.type === 'navbar' && (
                                  <div className="flex items-center justify-between px-20 py-12 border-b border-zinc-100">
                                     <div className="flex items-center gap-4 text-2xl font-black italic tracking-tighter">
                                        <Command className="w-8 h-8 text-black" /> Vibro_Flux
                                     </div>
                                     <nav className="hidden lg:flex gap-12">
                                        {comp.content.links.map((link: any) => <span key={link} className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors cursor-pointer">{link}</span>)}
                                     </nav>
                                     <button className="bg-zinc-950 text-[#b8f724] px-10 py-4.5 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                        {comp.content.cta}
                                     </button>
                                  </div>
                                )}
                                
                                {comp.type === 'hero' && (
                                  <div className="px-20 py-40 space-y-12">
                                     <div className="space-y-6">
                                        <div className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">Architecture_v4.2_Protocol</div>
                                        <h1 className="text-[100px] lg:text-[140px] font-black tracking-tighter leading-[0.8] italic uppercase">
                                           {comp.content.title.split(' ')[0]} <br />
                                           <span className="text-zinc-200 group-hover/comp:text-zinc-300 transition-colors uppercase">{comp.content.title.split(' ').slice(1).join('_') || 'SYNTHESIS_'}</span>
                                        </h1>
                                     </div>
                                     <p className="text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed tracking-tight">{comp.content.subtitle}</p>
                                     <div className="flex gap-6">
                                        <button className="bg-zinc-950 text-[#b8f724] px-12 py-6 rounded-[32px] font-black uppercase text-[12px] tracking-[0.2em] shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all">{comp.content.cta} →</button>
                                        <button className="bg-zinc-100 text-zinc-500 border border-zinc-200 px-12 py-6 rounded-[32px] font-black uppercase text-[12px] tracking-[0.2em] hover:bg-zinc-950 hover:text-white transition-all">Doc_Matrix</button>
                                     </div>
                                  </div>
                                )}

                                {comp.type === 'grid' && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-20 py-32 bg-zinc-50/50">
                                     {(comp.content.items || comp.content.stats).map((item: any, i: number) => (
                                        <div key={i} className="p-10 rounded-[48px] bg-white border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all space-y-8 group/card">
                                           <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center text-[#b8f724] transition-all group-hover/card:rotate-12">
                                              {comp.content.stats ? <Activity className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                                           </div>
                                           <div className="space-y-2">
                                              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Module_0{i+1}</p>
                                              <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-900 leading-tight">{item}</h4>
                                           </div>
                                           <p className="text-sm text-zinc-400 font-medium leading-relaxed">High-consequence structural module synthesized for production execution.</p>
                                        </div>
                                     ))}
                                  </div>
                                )}

                                {comp.type === 'header' && (
                                  <div className="flex justify-between items-center px-20 py-16 bg-white border-b border-zinc-100">
                                     <div className="space-y-1">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">{comp.content.title}</h2>
                                        <div className="flex items-center gap-2">
                                           <div className="w-2 h-2 rounded-full bg-[#b8f724]" />
                                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Node_Active_In_Cloud_Region_East_1</span>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-6 p-4 bg-zinc-50 rounded-[32px] border border-zinc-100 shadow-sm">
                                        <div className="w-12 h-12 rounded-full bg-zinc-950 border-4 border-[#b8f724] shadow-xl flex items-center justify-center text-[#b8f724] font-black text-sm">SA</div>
                                        <div className="flex flex-col pr-4">
                                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none">Architect</span>
                                           <span className="text-[14px] font-black text-zinc-950 uppercase tracking-tighter mt-1">{comp.content.user}</span>
                                        </div>
                                     </div>
                                  </div>
                                )}

                                {comp.type === 'pricing' && (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-20 py-40">
                                     {comp.content.plans.map((plan: any, i: number) => (
                                        <div key={plan} className={`p-12 rounded-[64px] border border-zinc-100 shadow-sm transition-all flex flex-col justify-between min-h-[500px] ${i === 1 ? 'bg-zinc-950 text-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] scale-110 z-10' : 'bg-white hover:bg-zinc-50'}`}>
                                           <div className="space-y-8">
                                              <div className="space-y-2">
                                                 <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-[#b8f724]">{plan}_v4</h4>
                                                 <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                                              </div>
                                              <div className="text-7xl font-black italic tracking-tighter uppercase leading-none">
                                                 ${i * 99}<span className="text-[12px] tracking-widest opacity-30 ml-2">/MO</span>
                                              </div>
                                              <div className="space-y-4 pt-10">
                                                 {['Architecture_Sync', 'Neural_Styling', 'CLI_Tunnel_Access', 'Team_Protocol'].map(feat => (
                                                    <div key={feat} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                                       <div className="w-1.5 h-1.5 rounded-full bg-[#b8f724]" /> {feat}
                                                    </div>
                                                 ))}
                                              </div>
                                           </div>
                                           <button className={`w-full py-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest transition-all ${i === 1 ? 'bg-[#b8f724] text-black hover:bg-white shadow-2xl' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-950 hover:text-white'}`}>Activate_Symmetry_v1</button>
                                        </div>
                                     ))}
                                  </div>
                                )}

                                {comp.type === 'canvas' && (
                                  <div className="px-20 py-24">
                                     <div className="aspect-[21/9] rounded-[64px] border border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-6 relative overflow-hidden group/mesh shadow-inner">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                                        <div className="w-20 h-20 rounded-[32px] bg-white shadow-2xl flex items-center justify-center text-zinc-100 group-hover/mesh:scale-110 group-hover/mesh:rotate-12 transition-all">
                                           <Zap className="w-10 h-10 text-zinc-200" />
                                        </div>
                                        <div className="text-center space-y-2 relative z-10">
                                           <span className="font-black uppercase tracking-[0.5em] text-[12px] text-zinc-300">{comp.content.placeholder}</span>
                                           <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Waiting_For_Input_Cluster...</p>
                                        </div>
                                     </div>
                                  </div>
                                )}
                              </div>
                           </div>
                        ))}
                       </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Floating Refinement Input */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-12 z-[60]">
               <div className="bg-zinc-950/95 backdrop-blur-3xl px-5 py-4 rounded-[42px] border border-zinc-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex items-center gap-6 group focus-within:ring-8 focus-within:ring-[#b8f724]/10 transition-all">
                  <div className="w-14 h-14 rounded-[28px] bg-[#b8f724] flex items-center justify-center shrink-0 shadow-2xl text-black group-focus-within:rotate-180 transition-all duration-700">
                     <Plus className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    value={revision}
                    onChange={(e) => setRevision(e.target.value)}
                    placeholder="Describe a targeted refinement... (e.g. 'Synthesize a dark mode version' or 'Add a high-throughput chart')"
                    className="flex-1 bg-transparent border-none outline-none px-2 text-white font-black text-base placeholder:text-zinc-600 placeholder:font-black placeholder:uppercase placeholder:tracking-tighter transition-all"
                  />
                  <button className="px-10 py-5 rounded-[28px] bg-[#b8f724] text-black font-black uppercase text-[12px] tracking-[0.2em] hover:scale-[1.05] active:scale-95 transition-all shadow-2xl flex items-center gap-3">
                     Synthesize_Update <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </main>

         {/* Right Side: Properties */}
         <aside className="w-[400px] bg-white border-l border-zinc-200 flex flex-col shrink-0">
            <div className="p-10 border-b border-zinc-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-[#b8f724] shadow-xl">
                     <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-950">System_Vars</h3>
               </div>
               <Settings className="w-5 h-5 text-zinc-300 hover:rotate-90 transition-transform cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
               <section className="space-y-12">
                  <div className="space-y-6">
                     <div className="flex justify-between items-center px-2">
                        <label className="text-[11px] font-black uppercase text-zinc-950 tracking-[0.2em]">Corner_Curvature</label>
                        <span className="text-[12px] font-black text-[#b8f724] bg-zinc-950 px-3 py-1.5 rounded-xl shadow-xl">{borderRadius}px</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max="100"
                       value={borderRadius}
                       onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                       className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-zinc-950" 
                     />
                     <div className="flex justify-between text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                        <span>Lethal_Sharp</span>
                        <span>Full_Organic</span>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex justify-between items-center px-2">
                        <label className="text-[11px] font-black uppercase text-zinc-950 tracking-[0.2em]">Optical_Density</label>
                        <span className="text-[12px] font-black text-[#b8f724] bg-zinc-950 px-3 py-1.5 rounded-xl shadow-xl">{glassOpacity}%</span>
                     </div>
                     <input 
                       type="range" 
                       min="0"
                       max="100"
                       value={glassOpacity}
                       onChange={(e) => setGlassOpacity(parseInt(e.target.value))}
                       className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-zinc-950" 
                     />
                  </div>

                  <div className="space-y-6 pt-12 border-t border-zinc-100">
                     <label className="text-[11px] font-black uppercase text-zinc-950 tracking-[0.2em] px-2 block">Visual_Atmosphere</label>
                     <div className="grid grid-cols-2 gap-4">
                        {['Monochrome', 'Spectral', 'Minimalist', 'High_End'].map(tone => (
                           <button 
                             key={tone} 
                             className="py-5 rounded-[24px] border-2 border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:border-zinc-950 hover:text-zinc-950 hover:bg-zinc-50 transition-all shadow-sm"
                           >
                              {tone}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6 pt-12 border-t border-zinc-100">
                     <label className="text-[11px] font-black uppercase text-zinc-950 tracking-[0.2em] px-2 block">Symmetry_Locks</label>
                     <div className="space-y-4">
                        {['Auto_Layout_v4', 'Responsive_Mesh', 'Context_Aware_Scaling'].map(item => (
                           <div key={item} className="flex items-center justify-between p-5 rounded-[24px] bg-zinc-50 border border-zinc-100 group hover:border-zinc-950 transition-all cursor-pointer">
                              <span className="text-[11px] font-black uppercase tracking-tight text-zinc-500 group-hover:text-zinc-950 transition-colors uppercase">{item}</span>
                              <div className="w-10 h-6 bg-zinc-950 rounded-full relative p-1 shadow-inner">
                                 <div className="absolute right-1 w-4 h-4 bg-[#b8f724] rounded-full shadow-[0_0_10px_#b8f724]" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </section>
            </div>

            <div className="p-12 border-t border-zinc-200 bg-zinc-50/50 space-y-6">
               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] text-center leading-relaxed">
                  Encryption Key Secured <br /> 
                  <span className="text-zinc-900">VIBRO_SYNTH_PRO_X</span>
               </div>
               <button className="w-full py-6 rounded-[32px] bg-zinc-950 text-[#b8f724] font-black uppercase text-[12px] tracking-[0.3em] shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4">
                  <Download className="w-5 h-5" /> Export_Production_Asset
               </button>
            </div>
         </aside>
      </div>
    </div>
  );
}

export default function WorkstationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-zinc-950 text-[#b8f724] font-black tracking-[0.5em] uppercase text-xs animate-pulse italic">Initalizing_Symmetry_Matrix...</div>}>
      <WorkstationContent />
    </Suspense>
  )
}
