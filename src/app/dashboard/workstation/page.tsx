"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Zap, 
  Shuffle, 
  ChevronDown, 
  Lock, 
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  ExternalLink,
  Github,
  Palette,
  Sparkles,
  RefreshCcw,
  ArrowLeft,
  Layers,
  Box,
  FileText,
  Image as ImageIcon,
  Settings,
  Copy,
  Code,
  Download,
  Terminal,
  Grid,
  Type,
  Maximize,
  Layout as LayoutIcon,
  Check,
  X
} from "lucide-react";

/**
 * Vibro Component Workstation v4
 * The ultimate design-to-code environment.
 */

interface DesignConfig {
  projectName: string;
  fonts: { heading: string; body: string; };
  colorPalette: { primary: string; secondary: string; background: string; foreground: string; };
  radius: string;
  theme: string;
  iconLibrary: string;
}

interface ComponentState {
  id: string;
  type: string;
  layout: { padding: string; gap: string; alignment: string; };
  styles: { background: string; border: string; shadow: string; radius: string; };
  typography: { fontSize: string; fontWeight: string; color: string; };
  animation: { duration: string; type: string; };
}

const DEFAULT_DESIGN: DesignConfig = {
  projectName: "AI Studio Project",
  fonts: { heading: "Inter", body: "Inter" },
  colorPalette: { primary: "#000000", secondary: "#71717A", background: "#FFFFFF", foreground: "#09090B" },
  radius: "12px",
  theme: "light",
  iconLibrary: "phosphor"
};

const INITIAL_COMPONENT: ComponentState = {
  id: "comp-preview",
  type: "card",
  layout: { padding: "24px", gap: "16px", alignment: "center" },
  styles: { background: "#FFFFFF", border: "1px solid #E4E4E7", shadow: "0 10px 15px -3px rgba(0,0,0,0.1)", radius: "24px" },
  typography: { fontSize: "16px", fontWeight: "600", color: "#09090B" },
  animation: { duration: "300ms", type: "fade" }
};

function WorkstationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ── State ──
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);
  const [component, setComponent] = useState<ComponentState>(INITIAL_COMPONENT);
  const [activeTab, setActiveTab] = useState('Design System');
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showExport, setShowExport] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const prompt = searchParams.get('prompt');
    const compName = searchParams.get('name');
    if (prompt) {
      setDesign(prev => ({ ...prev, projectName: prompt }));
    }
    if (compName) {
      setComponent(prev => ({ ...prev, type: compName }));
    }
  }, [searchParams]);

  // Derived Preview URL
  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      preset: "abXtF8U",
      font: design.fonts.heading.toLowerCase().replace(' ', '-'),
      primary: design.colorPalette.primary,
      radius: component.styles.radius.replace('px', ''),
      shadow: "large",
      theme: design.theme
    });
    return `/preview/radix/preview?${params.toString()}`;
  }, [design, component]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-zinc-900 font-sans">
      
      {/* ── 1. LEFT SIDEBAR (Navigation) ── */}
      <aside className="w-[72px] flex flex-col items-center py-6 bg-white border-r border-zinc-100 z-50">
        <Link href="/dashboard" className="mb-10 hover:scale-110 transition-transform">
           <Image src="/logo.png" alt="Vibro" width={32} height={32} />
        </Link>
        <div className="flex-1 flex flex-col gap-4">
           {[
             { icon: Layers, label: 'Projects' },
             { icon: Box, label: 'Components' },
             { icon: FileText, label: 'Pages' },
             { icon: ImageIcon, label: 'Assets' },
             { icon: Palette, label: 'Design System' }
           ].map((item) => (
             <button 
               key={item.label}
               onClick={() => setActiveTab(item.label)}
               className={`group relative p-3 rounded-2xl transition-all ${activeTab === item.label ? 'bg-black text-[#b8f724] shadow-xl shadow-black/10' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}
             >
                <item.icon className="w-5 h-5" />
                <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                  {item.label}
                </span>
             </button>
           ))}
        </div>
        <button className="p-3 text-zinc-400 hover:text-zinc-900 transition-colors">
           <Settings className="w-5 h-5" />
        </button>
      </aside>

      {/* ── 2. CENTER CANVAS (Live Preview) ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="h-14 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-zinc-100 z-40">
           <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Preview Mode</span>
              <div className="flex p-1 bg-zinc-100 rounded-xl">
                 <button onClick={() => setViewport('desktop')} className={`px-4 py-1 rounded-lg text-[11px] font-bold transition-all ${viewport === 'desktop' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><Monitor className="w-4 h-4" /></button>
                 <button onClick={() => setViewport('tablet')} className={`px-4 py-1 rounded-lg text-[11px] font-bold transition-all ${viewport === 'tablet' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><Tablet className="w-4 h-4" /></button>
                 <button onClick={() => setViewport('mobile')} className={`px-4 py-1 rounded-lg text-[11px] font-bold transition-all ${viewport === 'mobile' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><Smartphone className="w-4 h-4" /></button>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button onClick={() => setShowExport(true)} className="px-6 py-2 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#b8f724] hover:text-black transition-all">
                Export
              </button>
           </div>
        </div>

        {/* The Actual Canvas */}
        <div className="flex-1 p-12 flex items-center justify-center bg-[#F1F3F5] relative">
           {/* Grid Pattern */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
           
           <div 
             className={`transition-all duration-500 shadow-2xl ring-1 ring-black/5 rounded-[40px] bg-white overflow-hidden ${
               viewport === 'desktop' ? 'w-full h-full' : 
               viewport === 'tablet' ? 'w-[768px] h-[90%]' : 
               'w-[375px] h-[90%]'
             }`}
           >
              <iframe 
                src={previewUrl}
                className="w-full h-full border-none"
              />
           </div>
        </div>
      </main>

      {/* ── 3. RIGHT SIDEBAR (Component Editor) ── */}
      <aside className="w-80 bg-white border-l border-zinc-100 flex flex-col z-50">
         <div className="p-6 border-b border-zinc-50">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <Grid className="w-4 h-4 text-zinc-400" />
               Component Editor
            </h2>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Layout Panel */}
            <div className="p-6 space-y-4 border-b border-zinc-50">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Layout & Spacing</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-500">Padding</label>
                     <input type="text" value={component.layout.padding} onChange={e => setComponent({...component, layout: {...component.layout, padding: e.target.value}})} className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-black" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-500">Gap</label>
                     <input type="text" value={component.layout.gap} onChange={e => setComponent({...component, layout: {...component.layout, gap: e.target.value}})} className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-black" />
                  </div>
               </div>
            </div>

            {/* Styles Panel */}
            <div className="p-6 space-y-6 border-b border-zinc-50">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Visual Style</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[11px] font-bold text-zinc-500">Background</label>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400">{component.styles.background}</span>
                        <div className="w-6 h-6 rounded-md border border-zinc-200" style={{ backgroundColor: component.styles.background }} />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-500">Shadow Level</label>
                     <div className="flex gap-2">
                        {['none', 'sm', 'lg'].map(s => (
                           <button 
                             key={s} 
                             onClick={() => setComponent({...component, styles: {...component.styles, shadow: s}})}
                             className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${component.styles.shadow === s ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                           >{s}</button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-500">Border Radius ({component.styles.radius})</label>
                     <input 
                       type="range" 
                       min="0" max="48" 
                       value={parseInt(component.styles.radius)} 
                       onChange={e => setComponent({...component, styles: {...component.styles, radius: `${e.target.value}px`}})}
                       className="w-full accent-black" 
                     />
                  </div>
               </div>
            </div>

            {/* Typography Panel */}
            <div className="p-6 space-y-6 border-b border-zinc-50">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Typography</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-500">Font Size</label>
                     <select 
                       value={component.typography.fontSize}
                       onChange={e => setComponent({...component, typography: {...component.typography, fontSize: e.target.value}})}
                       className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs font-semibold outline-none"
                     >
                        <option>12px</option><option>14px</option><option>16px</option><option>18px</option><option>24px</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-zinc-500">Weight</label>
                     <div className="flex gap-2">
                        {['400', '600', '900'].map(w => (
                           <button 
                             key={w}
                             onClick={() => setComponent({...component, typography: {...component.typography, fontWeight: w}})}
                             className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${component.typography.fontWeight === w ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100'}`}
                           >{w === '900' ? 'Black' : w === '600' ? 'Bold' : 'Base'}</button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Animation Panel */}
            <div className="p-6 space-y-6">
               <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Animations</h3>
               <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:border-black/10 transition-all">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Entry Type</span>
                     <span className="text-xs font-bold">Fade & Slide-up</span>
                  </div>
                  <Zap className="w-4 h-4 text-[#b8f724] fill-current" />
               </div>
            </div>
         </div>

         {/* Bottom Control Actions */}
         <div className="p-6 bg-zinc-50/50 border-t border-zinc-50 space-y-3">
            <button className="w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-zinc-200 transition-all">
               Save as Project Component
            </button>
         </div>
      </aside>

      {/* ── EXPORT OVERLAY ── */}
      {showExport && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md" onClick={() => setShowExport(false)} />
            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden p-10 space-y-10 animate-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h2 className="text-3xl font-black tracking-tight text-zinc-950">Export Component</h2>
                     <p className="text-sm font-medium text-zinc-500">Choose how you want to integrate this masterpiece.</p>
                  </div>
                  <button onClick={() => setShowExport(false)} className="p-3 hover:bg-zinc-100 rounded-full text-zinc-400"><X className="w-6 h-6" /></button>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {/* Option 1: Code */}
                  <div className="group p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-black transition-all flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Code className="w-6 h-6" /></div>
                        <div>
                           <p className="text-base font-bold text-zinc-950">React Code</p>
                           <p className="text-xs font-medium text-zinc-500">Copy the full component source code</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => copyToClipboard('<Component /> code...')}
                        className="px-6 py-2.5 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#b8f724] hover:text-black transition-all flex items-center gap-2"
                     >
                        {isCopied ? <Check className="w-4 h-4" /> : 'Copy Code'}
                     </button>
                  </div>

                  {/* Option 2: CLI */}
                  <div className="group p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-black transition-all space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Terminal className="w-6 h-6" /></div>
                        <div>
                           <p className="text-base font-bold text-zinc-950">Vibro CLI</p>
                           <p className="text-xs font-medium text-zinc-500">Install directly into your project via terminal</p>
                        </div>
                     </div>
                     <div className="bg-zinc-950 rounded-2xl p-4 flex items-center justify-between">
                        <code className="text-[#b8f724] font-mono text-sm leading-none tracking-tight">vibro install {component.type.toLowerCase().replace(' ', '-')}</code>
                        <button onClick={() => copyToClipboard(`vibro install ${component.type.toLowerCase().replace(' ', '-')}`)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors"><Copy className="w-4 h-4" /></button>
                     </div>
                  </div>
               </div>

               <div className="pt-4 flex justify-end gap-4">
                  <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-black transition-colors">
                     View Documentation <ExternalLink className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Global Utilities */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
}

export default function WorkstationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Zap className="w-8 h-8 animate-pulse text-[#b8f724]" /></div>}>
      <WorkstationContent />
    </Suspense>
  )
}
