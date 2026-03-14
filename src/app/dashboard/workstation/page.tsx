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
  MousePointer2,
  X,
  Globe,
  ExternalLink,
  Copy
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  
  // Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('next');
  const [packageManager, setPackageManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [exportOptions, setExportOptions] = useState({ monorepo: false, rtl: false });
  const [isCopied, setIsCopied] = useState(false);
  const [exportType, setExportType] = useState<'cli' | 'prompt' | 'builders'>('cli');

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
      
      {/* ── Top Editor Hea      <header className="h-16 bg-white/80 dark:bg-black/50 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 z-[100]">
         <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 group">
               <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center p-1.5 shadow-lg group-hover:rotate-6 transition-transform overflow-hidden">
                  <Image src="/logo.png" alt="Vibro Logo" width={24} height={24} className="object-contain invert dark:invert-0" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[13px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">Vibro Architect</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Protocol v4.2</span>
                    <div className="w-1 h-1 rounded-full bg-[#b8f724]" />
                    <span className="text-[9px] text-[#b8f724] font-bold uppercase tracking-widest">Sync Active</span>
                  </div>
               </div>
            </Link>
            <div className="h-6 w-px bg-zinc-200 dark:bg-white/10" />
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm">
               <button onClick={() => setActiveTab('design')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'design' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-400'}`}>Canvas</button>
               <button onClick={() => setActiveTab('code')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'code' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-400'}`}>Source</button>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200 dark:border-white/5">
               <button onClick={() => setViewport('desktop')} title="Desktop View" className={`px-3 py-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 dark:text-zinc-600'}`}><Monitor className="w-4 h-4" /></button>
               <button onClick={() => setViewport('tablet')} title="Tablet View" className={`px-3 py-2 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 dark:text-zinc-600'}`}><Tablet className="w-4 h-4" /></button>
               <button onClick={() => setViewport('mobile')} title="Mobile View" className={`px-3 py-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 dark:text-zinc-600'}`}><Smartphone className="w-4 h-4" /></button>
            </div>
            <div className="h-6 w-px bg-zinc-200 dark:bg-white/10" />
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-3 px-6 py-2.5 bg-[#b8f724] text-zinc-900 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#b8f724]/10 border border-[#b8f724]/20 group"
            >
               Deploy Architecture <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
         </div>
      </header>

      {/* ── Main Workstation Area ── */}
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-6 pt-2 md:flex-row-reverse bg-[#F9F9F8] dark:bg-[#050505]">
         
         {/* ── Right Panel: Configurator Card ── */}
         <div className="group/card flex flex-col gap-5 overflow-hidden py-6 text-sm isolate z-10 max-h-full min-h-0 w-full self-start rounded-[32px] bg-white/90 dark:bg-zinc-900/90 shadow-[0_32px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.3)] backdrop-blur-3xl md:w-[420px] border border-zinc-200/50 dark:border-white/5 ring-1 ring-black/5 dark:ring-white/5">
            
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-zinc-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#b8f724] uppercase tracking-[0.3em]">Module_Config</span>
                  <h3 className="text-zinc-900 dark:text-white font-bold tracking-tight">Interface Variables</h3>
                </div>
                <button className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
                  <Settings className="w-4 h-4" />
                </button>
            </div>

            {/* Config Content */}
            <div className="flex-1 overflow-y-auto px-6 no-scrollbar space-y-8">
               
               {/* Search/Filter or Selection Info */}
               <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-white/5 flex items-center justify-between group/sel cursor-pointer hover:bg-white dark:hover:bg-zinc-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-[#b8f724] dark:text-zinc-950">
                       <Layout className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Base Library</p>
                       <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">Vibro-Flux Blocks</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-300 group-hover/sel:translate-y-0.5 transition-transform" />
               </div>

               {/* Design Axis Pickers */}
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'Style Pattern', value: 'Maia Minimal', icon: Palette, color: 'text-purple-500' },
                    { label: 'Color System', value: 'Neutral Oxide', icon: Activity, color: 'text-[#b8f724]' },
                    { label: 'Theme Matrix', value: 'Vibro Lime', icon: Zap, color: 'text-[#b8f724]' },
                    { label: 'Typography', value: 'Inter / Space', icon: Terminal, color: 'text-blue-500' },
                    { label: 'Icon Engine', value: 'Lucide Native', icon: Sparkles, color: 'text-orange-500' }
                  ].map((axis) => (
                    <div key={axis.label} className="group/axis relative flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-[#b8f724]/30 hover:shadow-lg hover:shadow-[#b8f724]/5 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center ${axis.color}`}>
                             <axis.icon className="w-4.5 h-4.5 shadow-sm" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{axis.label}</p>
                             <p className="text-[13px] font-bold text-zinc-900 dark:text-white mt-1">{axis.value}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 group-hover/axis:bg-[#b8f724] transition-colors" />
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-300" />
                       </div>
                    </div>
                  ))}
               </div>

               {/* Radius Control */}
               <div className="space-y-4 pt-4 border-t border-zinc-50 dark:border-white/5">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-500 uppercase tracking-[0.2em]">Architecture Radius</label>
                    <span className="text-[10px] font-black text-[#b8f724] bg-zinc-900 dark:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5">{borderRadius}px</span>
                  </div>
                  <div className="relative h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="absolute top-0 left-0 h-full bg-[#b8f724] shadow-[0_0_10px_rgba(184,247,36,0.5)]" style={{ width: `${(borderRadius / 48) * 100}%` }} />
                     <input 
                        type="range" 
                        min="0" 
                        max="48" 
                        value={borderRadius} 
                        onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
                        className="absolute inset-0 w-full opacity-0 cursor-pointer" 
                     />
                  </div>
               </div>

               {/* Composition Refinement */}
               <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-500 uppercase tracking-[0.2em]">Live Revision</label>
                  <div className="relative group/rev">
                     <textarea 
                        value={revision}
                        onChange={(e) => setRevision(e.target.value)}
                        placeholder="Refine the synthesis..."
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-xs font-medium text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none focus:ring-2 focus:ring-[#b8f724]/20 transition-all resize-none h-24 shadow-inner"
                     />
                     <button className="absolute bottom-3 right-3 p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:bg-[#b8f724] transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>

            </div>

            {/* Card Footer */}
            <div className="px-6 py-5 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-3">
               <button className="flex-1 py-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Save State
               </button>
               <button className="flex-1 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg dark:shadow-none">
                  <Command className="w-3.5 h-3.5" /> Extraction
               </button>
            </div>
         </div>

         {/* ── Left Panel: Designer Canvas / Preview ── */}
         <div className="relative flex-1 flex flex-col justify-center overflow-hidden rounded-[32px] border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950 shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:shadow-none min-h-0">
            
            {/* Toolbar for Canvas */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full z-50 shadow-2xl">
                <button className="p-2 rounded-full bg-zinc-900 dark:bg-white text-[#b8f724] dark:text-zinc-900 shadow-lg"><MousePointer2 className="w-4 h-4" /></button>
                <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"><Plus className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
                <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"><Undo2 className="w-4 h-4" /></button>
                <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"><Redo2 className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
                <button className="p-2 rounded-full text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"><Eye className="w-4 h-4" /></button>
            </div>

            {/* Canvas Area */}
            <div className="relative z-0 flex rounded-2xl w-full flex-1 flex-col overflow-auto bg-zinc-100/30 dark:bg-zinc-900/20 p-8 sm:p-12 lg:p-20 custom-scrollbar">
               
               <div 
                  className={`bg-white dark:bg-[#0A0A0A] shadow-[0_60px_120px_rgba(0,0,0,0.1)] transition-all duration-700 relative border border-zinc-200 dark:border-white/5 mx-auto flex flex-col items-center
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
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl z-[60]">
                        <div className="w-24 h-24 bg-zinc-950 dark:bg-white rounded-[40px] flex items-center justify-center text-[#b8f724] mb-10 animate-spin-slow shadow-2xl shadow-[#b8f724]/20 border-[6px] border-[#b8f724]/10">
                           <Zap className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-6">
                           <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight leading-none uppercase italic">Synthesizing Architecture...</h2>
                           <div className="flex items-center justify-center gap-3">
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.4em]">{stage} Protocol</span>
                              <div className="w-1 h-1 rounded-full bg-[#b8f724]" />
                              <span className="text-[10px] text-zinc-900 dark:text-zinc-100 font-bold">{Math.round(progress)}%</span>
                           </div>
                           <div className="w-72 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mx-auto p-0.5 border border-zinc-200 dark:border-white/5">
                              <div className="h-full bg-[#b8f724] rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(184,247,36,0.5)]" style={{ width: `${progress}%` }} />
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'code' ? (
                     <div className="flex-1 w-full p-16 bg-[#09090B] text-zinc-400 font-mono text-[14px] leading-relaxed selection:bg-[#b8f724]/30 overflow-auto">
                        <pre className="custom-scrollbar">{mockCode}</pre>
                     </div>
                  ) : (
                     <div className="flex-1 w-full bg-white dark:bg-transparent flex flex-col min-h-full">
                        {/* Rendered Preview Components */}
                        {components.map(comp => (
                           <div key={comp.id} className={`p-12 border-b border-zinc-50 dark:border-white/5 group/comp transition-all ${selectedId === comp.id ? 'bg-[#b8f724]/5 dark:bg-[#b8f724]/5 ring-1 ring-inset ring-[#b8f724]/20' : 'hover:bg-zinc-50/50 dark:hover:bg-white/5'}`} onClick={() => setSelectedId(comp.id)}>
                              {comp.type === 'navbar' && (
                                 <div className="flex items-center justify-between px-10 py-6 rounded-3xl border border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none">
                                    <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-[#b8f724]"><Zap className="w-4 h-4" /></div>
                                       {(comp.content as any).title || 'Brand'}
                                    </h4>
                                    <div className="flex gap-10">
                                       {((comp.content as any).items || (comp.content as any).links || []).map((l: any) => <span key={l} className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">{l}</span>)}
                                    </div>
                                    <button className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all">Action</button>
                                 </div>
                              )}
                              
                              {comp.type === 'hero' && (
                                 <div className={`py-40 space-y-12 text-center max-w-3xl mx-auto ${viewport === 'mobile' ? 'scale-90 origin-top' : ''}`}>
                                    <div className="inline-block px-5 py-2 bg-[#b8f724]/10 dark:bg-[#b8f724]/5 text-[#8fcc00] border border-[#b8f724]/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Architectural Synthesis v4.2</div>
                                    <h1 className="text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9] uppercase italic drop-shadow-sm">
                                       {((comp.content as any).title || '').split(' ').map((w: string, i: number) => (
                                          <span key={i} className={i % 2 === 1 ? 'text-zinc-400 dark:text-zinc-600' : ''}>{w} </span>
                                       ))}
                                    </h1>
                                    <p className="text-xl text-zinc-500 dark:text-zinc-400 font-bold italic leading-relaxed px-12">" {(comp.content as any).sub} "</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                       <button className="w-full sm:w-auto px-12 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[24px] font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-black dark:hover:bg-zinc-200 transition-all">Start Synthesis</button>
                                       <button className="w-full sm:w-auto px-12 py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 rounded-[24px] font-black text-[12px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Browse Stack</button>
                                    </div>
                                 </div>
                              )}

                              {comp.type === 'stats' && (
                                 <div className={`grid ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-8 py-20`}>
                                    {((comp.content as any).stats || []).map((s: any) => (
                                       <div key={s.label} className="p-12 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.03)] dark:shadow-none space-y-4 group/stat hover:border-[#b8f724] transition-all relative overflow-hidden">
                                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#b8f724]/5 blur-2xl" />
                                          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] relative z-10">{s.label}</p>
                                          <p className="text-5xl font-black text-zinc-950 dark:text-white tracking-tighter italic relative z-10">{s.val}</p>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {comp.type === 'pricing' && (
                                 <div className={`grid ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-10 py-32`}>
                                    {((comp.content as any).plans || []).map((p: any, i: number) => (
                                       <div key={p} className={`p-12 rounded-[48px] border border-zinc-100 dark:border-white/5 flex flex-col justify-between h-[560px] transition-all ${i === 1 ? 'shadow-[0_60px_120px_rgba(0,0,0,0.1)] dark:shadow-none bg-white dark:bg-zinc-900 border-[#b8f724]/30 dark:border-[#b8f724]/20 scale-105 z-10' : 'bg-zinc-50/40 dark:bg-zinc-900/40'}`}>
                                          <div className="space-y-10 text-center sm:text-left">
                                             <div className="flex justify-between items-start">
                                                <h4 className="text-[10px] font-black text-[#b8f724] uppercase tracking-[0.4em]">{p} Build</h4>
                                                {i === 1 && <Sparkles className="w-6 h-6 text-[#b8f724]" />}
                                             </div>
                                             <div className="space-y-2">
                                                <p className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Pricing Matrix</p>
                                                <p className="text-6xl font-black tracking-tighter text-zinc-950 dark:text-white italic">${i * 49}<span className="text-[15px] font-bold text-zinc-300 dark:text-zinc-700 ml-2 tracking-normal not-italic">/mo</span></p>
                                             </div>
                                             <div className="space-y-6 pt-6">
                                                {['Synthesized UI Node', 'Vibro Engine Sync', 'Pro Extraction'].map(f => (
                                                   <div key={f} className="flex items-center gap-4 text-[12px] font-bold text-zinc-500 dark:text-zinc-400 italic">
                                                      <div className="w-2 h-2 rounded-full bg-[#b8f724] shadow-[0_0_10px_rgba(184,247,36,0.5)]" /> {f}
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                          <button className={`w-full py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] transition-all ${i === 1 ? 'bg-zinc-900 dark:bg-[#b8f724] text-white dark:text-zinc-950 shadow-2xl hover:bg-black dark:hover:bg-white' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}>Select Architecture</button>
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
         </div>

      </main>

      {/* ── Export Modal ── */}
      {showExportModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 isolate">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowExportModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-[32px] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.5)] border border-zinc-200 dark:border-white/10 animate-in zoom-in-95 fade-in duration-300 slide-in-from-bottom-8">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Create Project</h2>
                  <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Select architecture & delivery protocol</p>
                </div>
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 dark:text-zinc-500 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/5">
              {(['cli', 'prompt', 'builders'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setExportType(type)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${exportType === type ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  {type} {type === 'cli' && 'Protocol'}
                </button>
              ))}
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              {exportType === 'cli' && (
                <>
                  {/* Template Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['next', 'vite', 'tanstack', 'laravel', 'router', 'astro'].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTemplate(t)}
                        className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border transition-all ${selectedTemplate === t ? 'border-[#b8f724] bg-[#b8f724]/10 shadow-[0_0_20px_rgba(184,247,36,0.1)]' : 'border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/20'}`}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center ${selectedTemplate === t ? 'text-[#b8f724]' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                           {/* Using placeholders for icons to save space, but keeping the vibe */}
                           {t === 'next' && <Box className="w-5 h-5" />}
                           {t === 'vite' && <Zap className="w-5 h-5" />}
                           {t === 'tanstack' && <Layers className="w-5 h-5" />}
                           {t === 'laravel' && <Package className="w-5 h-5" />}
                           {t === 'router' && <Share2 className="w-5 h-5" />}
                           {t === 'astro' && <Sparkles className="w-5 h-5" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedTemplate === t ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 group-hover:text-zinc-600'}`}>{t === 'tanstack' ? 'TanStack' : t === 'router' ? 'React Router' : t.charAt(0).toUpperCase() + t.slice(1)}</span>
                        {selectedTemplate === t && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-[#b8f724]" />}
                      </button>
                    ))}
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.01]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Package className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Create a monorepo</span>
                      </div>
                      <button 
                        onClick={() => setExportOptions(prev => ({ ...prev, monorepo: !prev.monorepo }))}
                        className={`w-10 h-5 rounded-full transition-all relative ${exportOptions.monorepo ? 'bg-[#b8f724]' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${exportOptions.monorepo ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.01]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500"><Globe className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Enable RTL support</span>
                      </div>
                      <button 
                        onClick={() => setExportOptions(prev => ({ ...prev, rtl: !prev.rtl }))}
                        className={`w-10 h-5 rounded-full transition-all relative ${exportOptions.rtl ? 'bg-[#b8f724]' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${exportOptions.rtl ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Package Manager Selection */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
                           {(['pnpm', 'npm', 'yarn', 'bun'] as const).map(pm => (
                             <button
                               key={pm}
                               onClick={() => setPackageManager(pm)}
                               className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${packageManager === pm ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                             >
                               {pm}
                             </button>
                           ))}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${packageManager} dlx shadcn@latest init --preset vibro-${selectedTemplate}`);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          }}
                          className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                        >
                           {isCopied ? <CheckCircle2 className="w-4 h-4 text-[#b8f724]" /> : <Copy className="w-4 h-4" />}
                        </button>
                     </div>
                     <div className="p-5 rounded-2xl bg-zinc-950 border border-white/5 font-mono text-zinc-400 text-xs overflow-x-auto selection:bg-[#b8f724]/30 selection:text-white">
                        <span className="text-[#b8f724]">{packageManager}</span> dlx shadcn@latest init --preset <span className="text-white">vibro-{selectedTemplate}</span>
                     </div>
                  </div>
                </>
              )}

              {exportType === 'prompt' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 space-y-4">
                     <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-[#b8f724]" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Synthesis Prompt</span>
                     </div>
                     <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        I need a modern {type} interface styled with a {borderRadius}px border radius. The design should follow a "Vibro-Flux" dark obsidian aesthetic with {accentColor} primary accents. Include a responsive navbar, a high-density metric section, and a professional {type === 'app' ? 'activity stream' : 'pricing matrix'}. Focus on high-contrast surfaces and premium micro-interactions.
                     </p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`I need a modern ${type} interface styled with a ${borderRadius}px border radius...`);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-3"
                  >
                    {isCopied ? 'Copied to Clipboard' : 'Copy Synthesis Prompt'} {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {exportType === 'builders' && (
                <div className="grid grid-cols-1 gap-4">
                   {['V0.dev', 'Bolt.new', 'Lovable.dev'].map(b => (
                     <button key={b} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] hover:border-[#b8f724]/30 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-[#b8f724] dark:text-zinc-950 font-black italic">V</div>
                           <div className="text-left">
                              <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{b}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Direct Synthesis Link</p>
                           </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-300 group-hover:text-[#b8f724] group-hover:translate-x-0.5 transition-all" />
                     </button>
                   ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-white/5">
              <button 
                className="w-full py-4 bg-[#b8f724] text-zinc-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#b8f724]/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                onClick={() => setShowExportModal(false)}
              >
                Execute Project Generation
              </button>
            </div>
          </div>
        </div>
      )}
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
