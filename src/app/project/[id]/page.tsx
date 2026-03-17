"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  CheckCircle2, Loader2, Sparkles, MousePointer2, 
  Frame, Component, Type as TypeIcon, Hash, 
  Eye, Command, Menu, MoreHorizontal, Grid,
  Maximize, Minimize, Plus, Zap, FolderOpen, 
  Layout, Code, Copy, Download, Settings, 
  ChevronLeft, Sun, Moon, Maximize2, Terminal, 
  Palette, Type, Box, Layers, Share2, RefreshCcw, 
  Monitor, Tablet, Smartphone, Search, AlertTriangle
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { VibroDesignSystem, generateVibroSystem } from "@/lib/gemini";
import { createClient } from "@/utils/supabase/client";
const SYNTH_STEPS = [
  "> INITIALIZING QUANTUM DESIGN CORE...",
  "> PARSING ARCHITECTURAL PRINTS...",
  "> ANALYZING USER INTENT VECTORS...",
  "> MAPPING COLOR TOKEN HIERARCHY...",
  "> RESOLVING TYPOGRAPHY RHYTHM...",
  "> COMPILING COMPONENT MANIFEST...",
  "> SYNTHESIS COMPLETE — READY TO DEPLOY.",
];

/* ── UI Components ── */

const GlassPanel = ({ children, className = "", title = "" }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={`bg-black/40 backdrop-blur-xl border border-white/5 flex flex-col ${className}`}>
    {title && (
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6FF3D]">{title}</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
    )}
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {children}
    </div>
  </div>
);

const TokenRow = ({ label, value, color }: { label: string, value: string, color?: string }) => (
  <div className="group flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
    <div className="flex items-center gap-2">
      {color && <div className="w-3 h-3 border border-white/10" style={{ backgroundColor: color }} />}
      <span className="text-[11px] font-mono text-zinc-300 group-hover:text-[#C6FF3D] transition-colors truncate max-w-[120px] text-right">{value}</span>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, action }: { icon: any, title: string, action?: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-2 mb-4 mt-6 first:mt-0 px-2">
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-[#C6FF3D]" />
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{title}</h3>
    </div>
    {action}
  </div>
);

const ToolbarButton = ({ icon: Icon, active = false, onClick, label }: { icon: any, active?: boolean, onClick?: () => void, label?: string }) => (
  <button 
    onClick={onClick}
    className={`p-2 transition-all flex items-center gap-2 rounded-md ${active ? 'bg-[#C6FF3D] text-black shadow-[0_0_15px_rgba(198,255,61,0.2)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
    title={label}
  >
    <Icon className="w-4 h-4" />
    {label && <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{label}</span>}
  </button>
);

/* ── Workstation Page ── */

export default function WorkstationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [design, setDesign] = useState<VibroDesignSystem | null>(null);
  const [activeViewport, setActiveViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Design System State
  const [tokens, setTokens] = useState<VibroDesignSystem | null>(null);
  
  // Synthesis States
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthSteps, setSynthSteps] = useState<string[]>([]);
  const [synthDone, setSynthDone] = useState(false);

  const supabase = createClient();

  // ── Sync Tokens to CSS Variables ──
  useEffect(() => {
    if (!tokens) return;
    const root = document.documentElement;
    
    // Inject Colors
    if (tokens.colorPalette) {
      Object.entries(tokens.colorPalette).forEach(([key, val]) => {
        root.style.setProperty(`--vb-${key}`, String(val));
      });
    }
    
    // Inject Fonts
    if (tokens.fonts) {
      root.style.setProperty('--vb-font-heading', tokens.fonts.heading);
      root.style.setProperty('--vb-font-body', tokens.fonts.body);
      root.style.setProperty('--vb-font-mono', tokens.fonts.mono);
    }

    // Inject Radius
    if (tokens.borderRadius) {
      root.style.setProperty('--vb-radius-sm', tokens.borderRadius.sm);
      root.style.setProperty('--vb-radius-md', tokens.borderRadius.md);
      root.style.setProperty('--vb-radius-lg', tokens.borderRadius.lg);
    }
  }, [tokens]);

  const updateToken = (category: keyof VibroDesignSystem, key: string, value: any) => {
    setTokens(prev => {
      if (!prev) return prev;
      const categoryData = prev[category] as any;
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [key]: value
        }
      };
    });
  };

  useEffect(() => {
    async function hydrate() {
      setLoading(true);
      
      // A. Handle "New Project" Synthesis Flow
      if (id === "new") {
        const configRaw = localStorage.getItem("vibro_creation_config");
        if (!configRaw) {
          setLoadError("No project configuration found.");
          setLoading(false);
          return;
        }

        const config = JSON.parse(configRaw);
        setIsSynthesizing(true);
        setLoading(false); // We show the Lab UI instead
        
        // Start animation sequence
        const runAnims = async () => {
          for (let i = 0; i < SYNTH_STEPS.length - 1; i++) {
            await new Promise(r => setTimeout(r, 700));
            setSynthSteps(prev => [...prev, SYNTH_STEPS[i]]);
          }
        };
        runAnims();

        try {
          const result = await generateVibroSystem(config.prompt, {
            primaryColor: config.primaryColor,
            borderRadius: config.borderRadius,
            stack: config.stack,
          });
          
          setDesign(result);
          setTokens(result);
          localStorage.setItem("vibro_active_synthesis", JSON.stringify(result));

          // Persist to Supabase immediately
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: project } = await supabase
              .from("projects")
              .insert({
                name: result.projectName || "New_Vibro_Project",
                user_id: session.user.id,
                description: `Created in Workstation: ${config.prompt.slice(0, 50)}...`,
                metadata: { stack: config.stack, borderRadius: config.borderRadius, primaryColor: config.primaryColor }
              })
              .select().single();

            if (project) {
              await supabase.from("design_systems").insert({
                project_id: project.id,
                name: result.projectName || "Default_System",
                master_prompt: result.masterPrompt,
                ui_style: result.uiStyle,
                theme_mode: result.theme || "dark",
                tokens: result
              });
              
              // Redirect to the permanent project URL
              window.history.replaceState(null, "", `/project/${project.id}`);
            }
          }

          setSynthSteps(prev => [...prev, SYNTH_STEPS[SYNTH_STEPS.length - 1]]);
          await new Promise(r => setTimeout(r, 800));
          setSynthDone(true);
          setIsSynthesizing(false);
        } catch (err) {
          console.error("Lab Synthesis Failed:", err);
          setLoadError("Synthesis protocol failed.");
        }
        return;
      }

      // B. Try Supabase Fetch (Existing Project)
      if (id && id.length > 20) { 
         try {
           const { data: sys, error } = await supabase
             .from("design_systems")
             .select("*, projects(*)")
             .eq("project_id", id)
             .single();

           if (sys && sys.tokens) {
              setDesign({
                ...sys.tokens as any,
                masterPrompt: sys.master_prompt || (sys.tokens as any).masterPrompt,
                projectName: sys.projects?.name || sys.name
              });
              setTokens(sys.tokens as any);
              setLoading(false);
              return;
           }
         } catch (e) {
           console.error("Supabase hydration failed:", e);
         }
      }

      // C. Fallback to localStorage
      const saved = localStorage.getItem("vibro_active_synthesis");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDesign(parsed);
          setTokens(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Local hydration failed");
        }
      }
      
      setLoadError("Project manifest not found.");
      setLoading(false);
    }

    hydrate();
  }, [id, supabase]);

  const copyPrompt = () => {
    if (!design?.masterPrompt) return;
    navigator.clipboard.writeText(design.masterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#C6FF3D]/20 border-t-[#C6FF3D] rounded-full animate-spin" />
      <p className="text-[#C6FF3D] font-black uppercase tracking-[0.4em] text-xs animate-pulse">Initializing_Workstation...</p>
    </div>
  );

  if (loadError) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <p className="text-white font-black uppercase tracking-widest text-xs">{loadError}</p>
      <Link href="/dashboard" className="mt-4 px-6 py-2 bg-white text-black font-black uppercase text-[10px] tracking-widest">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className={`flex h-screen w-full ${theme === "dark" ? "bg-[#0A0A0B] text-white" : "bg-[#F3F4F6] text-black"} font-sans overflow-hidden`}>
      {/* ── LEFT BAR: THE EXPLORER (Full Height) ── */}
      <aside className="w-[240px] shrink-0 border-r border-white/5 bg-black/20 flex flex-col overflow-hidden h-full z-20">
        <div className="h-10 border-b border-white/5 flex items-center px-4 bg-black/40">
           <Link href="/dashboard" className="p-1.5 hover:bg-white/5 rounded-md transition-all mr-2">
              <Menu className="w-4 h-4 text-zinc-400" />
           </Link>
           <span className="text-[10px] font-black uppercase tracking-widest text-[#C6FF3D]">Explorer</span>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
           {/* Pages Section */}
           <div>
              <SectionHeader icon={Layers} title="Pages" action={<Plus className="w-3 h-3 text-zinc-600 hover:text-white transition-colors cursor-pointer" />} />
              <div className="space-y-0.5">
                 {["System_Overview", "Tokens", "UI_Components", "Prototypes"].map((page: string, i: number) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer group transition-all ${i===0 ? 'bg-[#C6FF3D]/10' : 'hover:bg-white/5'}`}>
                       <Grid className={`w-3.5 h-3.5 ${i===0 ? 'text-[#C6FF3D]' : 'text-zinc-500'}`} />
                       <span className={`text-[11px] font-bold uppercase tracking-wider ${i===0 ? 'text-[#C6FF3D]' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{page}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="h-px bg-white/5 mx-2 my-4" />

           {/* Layers Section */}
           <div>
              <SectionHeader icon={Command} title="Layers" />
              <div className="space-y-0.5 pl-2">
                 {design?.components?.map((c: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 group border-l border-white/5 ml-1">
                       <Component className="w-3 h-3 text-zinc-600 group-hover:text-[#C6FF3D]" />
                       <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-tight">{c}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
        
        {/* Theme Toggle Footer */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between">
           <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-500 hover:text-white transition-all"
           >
             {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
             Theme: {theme}
           </button>
           <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" title="Cloud Synced" />
        </div>
      </aside>

      {/* ── CENTRAL WORKSPACE COLUMN ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* ── Figma style Toolbar (Now integrated in center) ── */}
        <header className="h-10 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-3 shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 p-1 rounded-lg gap-1 border border-white/5">
              <ToolbarButton icon={MousePointer2} active label="Move" />
              <ToolbarButton icon={Frame} label="Region" />
              <ToolbarButton icon={Component} label="Library" />
              <ToolbarButton icon={TypeIcon} label="Text" />
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] opacity-40">{id.slice(0, 8)} /</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#C6FF3D] transition-colors cursor-pointer">
              {design?.projectName || "System_Untitled"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/5">
              <ToolbarButton icon={Monitor} active={activeViewport === "desktop"} onClick={() => setActiveViewport("desktop")} />
              <ToolbarButton icon={Tablet} active={activeViewport === "tablet"} onClick={() => setActiveViewport("tablet")} />
              <ToolbarButton icon={Smartphone} active={activeViewport === "mobile"} onClick={() => setActiveViewport("mobile")} />
            </div>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <ToolbarButton icon={Share2} onClick={() => setCopied(true)} />
            <button className="px-4 h-7 bg-[#C6FF3D] text-black text-[10px] font-black uppercase rounded-[4px] hover:brightness-105 active:scale-95 transition-all">
              Publish
            </button>
          </div>
        </header>

        {/* ── THE CANVAS ── */}
        <section className={`flex-1 overflow-auto relative ${theme === "dark" ? "bg-[#18181B]" : "bg-[#F3F4F6]"} custom-scrollbar flex items-center justify-center p-20`}>
          {/* Infinite Dot Grid */}
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(${theme==='dark' ? '#000' : '#CCC'} 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          
          <AnimatePresence mode="wait">
            {isSynthesizing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full max-w-xl mx-auto p-12 bg-black/80 border-2 border-black backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-10"
              >
                  <div className="flex items-center gap-4 mb-8">
                      <Loader2 className="w-10 h-10 text-[#C6FF3D] animate-spin" />
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#C6FF3D]">Laboratory_Sequence</h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">AI Synthesis Cluster Online</p>
                      </div>
                  </div>
                  <div className="space-y-4 text-left border-l-2 border-white/5 pl-6">
                      {synthSteps.map((step: string, i: number) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={i} 
                          className="flex items-center gap-3"
                        >
                          <span className="text-[9px] font-bold text-zinc-600 font-mono">[{String(i+1).padStart(2, '0')}]</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${i === synthSteps.length - 1 ? 'text-[#C6FF3D]' : 'text-zinc-400'}`}>
                              {step}
                          </span>
                        </motion.div>
                      ))}
                  </div>
                  <div className="mt-12 h-0.5 bg-white/5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#C6FF3D] shadow-[0_0_15px_#C6FF3D]" 
                        initial={{ width: "0%" }}
                        animate={{ width: `${(synthSteps.length / SYNTH_STEPS.length) * 100}%` }}
                      />
                  </div>
              </motion.div>
            ) : (
              /* THE DESIGN CANVAS INTERFACE */
              <motion.div
                key="canvas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-20 p-20"
              >
                {/* Desktop Frame: The Lab Mirror */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                     <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3" />
                        <span>Desktop_Lab_Mirror</span>
                     </div>
                     <span>1440 x 1024</span>
                  </div>
                  
                  <div className={`shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-8 border-black overflow-hidden transition-all duration-500 bg-[#000] relative group ${activeViewport !== 'desktop' ? 'opacity-30 scale-95 grayscale' : ''}`}
                       style={{ width: 1024, height: 720 }}>
                     
                     <div className="w-full h-full relative overflow-y-auto custom-scrollbar p-16"
                          style={{ 
                             backgroundColor: 'var(--vb-background)',
                             color: 'var(--vb-foreground)'
                          }}>
                        {/* Dot Grid Layer inside frame */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                             style={{ backgroundImage: `radial-gradient(var(--vb-foreground) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

                        {/* Top Hero Section */}
                        <div className="relative z-10 mb-20 text-left">
                           <h2 className="text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-6" 
                               style={{ fontFamily: 'var(--vb-font-heading)' }}>
                              Synthesized_ <br/>
                              <span style={{ color: 'var(--vb-primary)' }}>Architecture.</span>
                           </h2>
                           <p className="text-xl opacity-50 font-medium max-w-xl" style={{ fontFamily: 'var(--vb-font-body)' }}>
                              This high-fidelity mirror captures every token mutation in real-time. Components below are dynamically linked to your Technical Manifest.
                           </p>
                        </div>

                        {/* Component Grid */}
                        <div className="grid grid-cols-2 gap-12 relative z-10">
                           
                           {/* ── Dashboard Card (Component Preview) ── */}
                           <div className="p-8 border border-white/5 bg-white/[0.02] shadow-2xl space-y-6"
                                style={{ borderRadius: 'var(--vb-radius-lg)', borderColor: 'var(--vb-border)' }}>
                              <div className="flex items-center justify-between">
                                 <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full">
                                    <Zap className="w-5 h-5 text-[#C6FF3D]" style={{ color: 'var(--vb-primary)' }} />
                                 </div>
                                 <div className="px-3 py-1 bg-[#C6FF3D]/10 text-[#C6FF3D] text-[10px] font-black uppercase rounded-full" 
                                      style={{ backgroundColor: 'var(--vb-primary)', opacity: 0.15, color: 'var(--vb-primary)' }}>
                                    System_Active
                                 </div>
                              </div>
                              <div>
                                 <h4 className="text-2xl font-black uppercase" style={{ fontFamily: 'var(--vb-font-heading)' }}>Usage_Summary</h4>
                                 <p className="text-sm opacity-50">Monthly compute clusters utilized.</p>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#C6FF3D]" style={{ width: '70%', backgroundColor: 'var(--vb-primary)' }} />
                              </div>
                              <button className="w-full h-12 font-black uppercase text-xs"
                                      style={{ backgroundColor: 'var(--vb-primary)', borderRadius: 'var(--vb-radius-md)', color: '#000' }}>
                                 Scale_Cluster
                              </button>
                           </div>

                           {/* ── Login Form (Component Preview) ── */}
                           <div className="p-8 border border-white/5 bg-white/[0.02] shadow-2xl space-y-6"
                                style={{ borderRadius: 'var(--vb-radius-lg)', borderColor: 'var(--vb-border)' }}>
                              <div className="text-center space-y-2">
                                 <h4 className="text-2xl font-black uppercase" style={{ fontFamily: 'var(--vb-font-heading)' }}>Access_Point</h4>
                                 <p className="text-[10px] opacity-40 uppercase tracking-[0.2em]">Authorized_Personnel_Only</p>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-1.5 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">System_ID</label>
                                    <div className="w-full h-11 bg-white/5 border border-white/10 rounded px-4" style={{ borderRadius: 'var(--vb-radius-sm)', borderColor: 'var(--vb-border)' }} />
                                 </div>
                                 <div className="space-y-1.5 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Security_Key</label>
                                    <div className="w-full h-11 bg-white/5 border border-white/10 rounded px-4" style={{ borderRadius: 'var(--vb-radius-sm)', borderColor: 'var(--vb-border)' }} />
                                 </div>
                              </div>
                              <button className="w-full h-12 font-black uppercase text-xs border-2"
                                      style={{ borderColor: 'var(--vb-primary)', color: 'var(--vb-primary)', borderRadius: 'var(--vb-radius-md)' }}>
                                 Authenticate_
                              </button>
                           </div>

                        </div>
                     </div>
                  </div>
                </div>

                {/* Mobile Frame */}
                <div className="space-y-4 mt-20">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                     <span>Mobile_View</span>
                     <span>390 x 844</span>
                  </div>
                  <div className={`shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-[12px] border-black rounded-[40px] overflow-hidden transition-all duration-500 ${activeViewport !== 'mobile' ? 'opacity-30 scale-95 grayscale' : ''}`}
                       style={{ width: 280, height: 560 }}>
                     <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                          style={{ backgroundColor: 'var(--vb-background)' }}>
                        <div className="w-12 h-12 rounded-full mb-6" style={{ backgroundColor: 'var(--vb-primary)' }} />
                        <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: 'var(--vb-font-heading)', color: 'var(--vb-foreground)' }}>Responsive_DNA</h3>
                        <div className="w-full space-y-2">
                           <div className="h-4 rounded" style={{ width: '100%', backgroundColor: 'var(--vb-border)', opacity: 0.1 }} />
                           <div className="h-4 rounded" style={{ width: '80%', backgroundColor: 'var(--vb-border)', opacity: 0.1 }} />
                           <div className="h-4 rounded" style={{ width: '60%', backgroundColor: 'var(--vb-border)', opacity: 0.1 }} />
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* ── RIGHT SIDEBAR: THE INSPECTOR (Full Height) ── */}
      <aside className="w-[300px] shrink-0 border-l border-white/5 bg-black/40 flex flex-col overflow-hidden h-full z-20">
        {/* Tabs */}
        <div className="flex border-b border-white/5 h-10 px-2 shrink-0 bg-black/60">
           {["Design", "Prototype", "Inspect"].map(tab => (
              <button key={tab} className={`flex-1 text-[9px] font-black uppercase tracking-widest transition-all ${tab === 'Design' ? 'text-[#C6FF3D] border-b border-[#C6FF3D]' : 'text-zinc-500 hover:text-white'}`}>
                 {tab}
              </button>
           ))}
        </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-8">
             {/* DESIGN TOKENS (Figma Style) */}
             <div>
                <SectionHeader icon={Palette} title="Document Colors" />
                <div className="grid grid-cols-2 gap-3 px-2">
                   {tokens?.colorPalette && Object.entries(tokens.colorPalette).map(([key, val]) => (
                      <div key={key} className="flex flex-col gap-1.5 group">
                         <div className="relative">
                            <input 
                              type="color" 
                              value={String(val)} 
                              onChange={(e) => updateToken('colorPalette', key, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            <div className="w-full aspect-square border border-white/10 relative group-hover:border-[#C6FF3D]/50 transition-all shadow-sm" style={{ backgroundColor: String(val) }} />
                         </div>
                         <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter truncate">{key}</span>
                         <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">{String(val)}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="h-px bg-white/5 mx-2" />

             <div>
                <SectionHeader icon={TypeIcon} title="Typography" />
                <div className="space-y-4 px-2">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Heading_Family</span>
                      <input 
                        type="text"
                        value={tokens?.fonts?.heading || ""}
                        onChange={(e) => updateToken('fonts', 'heading', e.target.value)}
                        className="w-full h-9 px-3 bg-white/5 border border-white/10 text-[11px] font-bold text-zinc-300 rounded focus:border-[#C6FF3D] focus:outline-none transition-all"
                      />
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Body_Family</span>
                      <input 
                        type="text"
                        value={tokens?.fonts?.body || ""}
                        onChange={(e) => updateToken('fonts', 'body', e.target.value)}
                        className="w-full h-9 px-3 bg-white/5 border border-white/10 text-[11px] font-bold text-zinc-300 rounded focus:border-[#C6FF3D] focus:outline-none transition-all"
                      />
                   </div>
                </div>
             </div>

             <div className="h-px bg-white/5 mx-2" />

             <div>
                <SectionHeader icon={Grid} title="Geometry & Radius" />
                <div className="space-y-4 px-2">
                   <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Radius_MD</span>
                        <span className="text-[9px] font-mono text-white tracking-widest">{tokens?.borderRadius?.md || "4px"}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="32"
                        step="1"
                        value={parseInt(tokens?.borderRadius?.md || "4")}
                        onChange={(e) => updateToken('borderRadius', 'md', `${e.target.value}px`)}
                        className="w-full accent-[#C6FF3D] h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                      />
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Columns</span>
                      <span className="text-[10px] font-bold text-white">12</span>
                   </div>
                </div>
             </div>

             <div className="h-px bg-white/5 mx-2" />

             {/* SEMANTIC MAPPING */}
             <div>
                <SectionHeader icon={Sparkles} title="Semantic Roles" />
                <div className="space-y-1 px-2">
                   {[
                      { role: "Surface_Base", value: "background" },
                      { role: "Brand_Core", value: "primary" },
                      { role: "Stroke_UI", value: "border" }
                   ].map(s => (
                      <div key={s.role} className="flex items-center justify-between py-1.5 border-b border-white/[0.02]">
                         <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{s.role}</span>
                         <span className="text-[9px] font-mono text-[#C6FF3D]" style={{ color: 'var(--vb-primary)' }}>var(--vb-{s.value})</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* CODE EXPORT (Manifest) */}
             <div className="pt-8">
                <div className="p-4 bg-black/60 border border-white/5 rounded-lg space-y-4">
                   <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#C6FF3D]" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Master_Prompt.Spec</span>
                   </div>
                   <p className="text-[10px] text-zinc-500 font-mono leading-relaxed line-clamp-4">
                      {design?.masterPrompt || "Awaiting manifest..."}
                   </p>
                   <button 
                     onClick={copyPrompt}
                     className="w-full flex items-center justify-center gap-2 h-8 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-zinc-300 hover:bg-[#C6FF3D] hover:text-black hover:border-transparent transition-all"
                   >
                      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied_DNA" : "Copy_A.I_Manifest"}
                   </button>
                </div>
             </div>
          </div>
        </aside>

      {/* Global CSS for Canvas Grid */}
      <style jsx global>{`
        .bg-dot-grid {
          background-image: radial-gradient(#C6FF3D 0.5px, transparent 0);
          background-size: 12px 12px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(198, 255, 97, 0.2);
        }
      `}</style>
    </div>
  );
}


