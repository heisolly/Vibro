"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Zap, Paperclip, Sparkles, Cpu, Sliders,
  ArrowRight, CheckCircle2, Loader2, Globe, Shield, Activity, Plus,
  Image as ImageIcon, Upload, FolderOpen, Layers, Layout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "./ThemeProvider";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import GridBackground from "@/components/GridBackground";
import { generateVibroSystem } from "@/lib/gemini";
import UploadReference from "@/components/UploadReference";
import ImportFolder from "@/components/ImportFolder";

/* ── SYNTHESIS PROTOCOL LOG ─────────────────────── */
const SYNTH_STEPS = [
  "> INITIALIZING QUANTUM DESIGN CORE...",
  "> PARSING ARCHITECTURAL PRINTS...",
  "> ANALYZING USER INTENT VECTORS...",
  "> MAPPING COLOR TOKEN HIERARCHY...",
  "> RESOLVING TYPOGRAPHY RHYTHM...",
  "> COMPILING COMPONENT MANIFEST...",
  "> SYNTHESIS COMPLETE — READY TO DEPLOY.",
];

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#FFFCF2]">
        <div className="relative">
          <Zap className="w-12 h-12 text-[#C6FF3D] animate-pulse" />
          <div className="absolute inset-0 bg-[#C6FF3D] blur-xl opacity-20 animate-pulse" />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#C6FF3D");
  const [borderRadius, setBorderRadius] = useState("0");
  const [stack, setStack] = useState("React");
  const [inference, setInference] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImportFolder, setShowImportFolder] = useState(false);
  const [referenceApplied, setReferenceApplied] = useState(false);
  const [folderApplied, setFolderApplied] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [pastProjects, setPastProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  const router = useRouter(); 

  const { theme } = useTheme();
  const supabase = createClient();

  // Fetch past projects
  useEffect(() => {
    async function fetchProjects() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*, design_systems(ui_style, theme_mode)")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setPastProjects(data);
      setLoadingProjects(false);
    }
    fetchProjects();
  }, [supabase]);

  /* Auto-scroll log */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, []);

  /* Live inference preview */
  useEffect(() => {
    if (prompt.length > 4) {
      const lower = prompt.toLowerCase();
      const mode  = lower.includes("dark") ? "Dark Mode" : lower.includes("light") ? "Light Mode" : "Adaptive";
      const genre = lower.includes("fin") || lower.includes("bank") ? "FinTech" 
                  : lower.includes("dash") ? "Dashboard" 
                  : lower.includes("mobile") || lower.includes("app") ? "Mobile App"
                  : lower.includes("landing") || lower.includes("market") ? "Marketing" : "SaaS Platform";
      setInference(`PROTOTYPE: ${mode} ${genre} System · [r=${borderRadius}px]`);
    } else {
      setInference("");
    }
  }, [prompt, stack, borderRadius]);

  /* Handle reference upload analysis complete */
  const handleReferenceAnalyzed = (result: any) => {
    // Prefer masterPrompt (new Optical Auditor output) over generatedPrompt
    const prompt = result.masterPrompt || result.generatedPrompt || "";
    if (prompt) setPrompt(prompt);
    if (result.colorPalette?.primary) setPrimaryColor(result.colorPalette.primary);
    setReferenceApplied(true);
    setShowUploadModal(false);
  };

  /* Handle folder import analysis complete */
  const handleFolderAnalyzed = (result: any) => {
    // Prefer masterPrompt (new chain-of-thought output) over generatedPrompt
    const detectedPrompt = result.masterPrompt || result.generatedPrompt || "";
    if (detectedPrompt) setPrompt(detectedPrompt);
    if (result.colorPalette?.primary) setPrimaryColor(result.colorPalette.primary);
    if (result.borderRadius?.style === "sharp") setBorderRadius("0");
    else if (result.borderRadius?.sm) {
      const val = parseInt(result.borderRadius.sm);
      if (!isNaN(val)) setBorderRadius(String(Math.min(val, 24)));
    }
    setFolderApplied(true);
    setReferenceApplied(true);
    setShowImportFolder(false);
    
    // Auto-synthesize for folders since we have the full spec
    if (detectedPrompt) {
      handleGenerate(detectedPrompt);
    }
  };

  /* Synthesis sequence — Now redirects to Workstation for processing */
  const handleGenerate = async (overridePrompt?: string | React.FormEvent) => {
    const activePrompt = typeof overridePrompt === 'string' ? overridePrompt : prompt;
    if (!activePrompt || typeof activePrompt !== 'string' || !activePrompt.trim()) return;
    
    // Save configuration for Workstation initialization
    const config = {
      prompt: activePrompt,
      primaryColor,
      borderRadius,
      stack,
      referenceApplied,
      folderApplied
    };
    
    localStorage.setItem("vibro_creation_config", JSON.stringify(config));
    
    // Redirect to the "New Project" Laboratory
    router.push("/project/new");
  };

  const handleReset = () => {
    setPrompt("");
    setReferenceApplied(false);
    setFolderApplied(false);
  };

  return (
    <>
      {/* Upload Reference Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadReference
            onAnalysisComplete={handleReferenceAnalyzed}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Import Folder Modal */}
      <AnimatePresence>
        {showImportFolder && (
          <ImportFolder
            onAnalysisComplete={handleFolderAnalyzed}
            onClose={() => setShowImportFolder(false)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#FFFCF2] text-black font-space-grotesk flex selection:bg-black selection:text-[#C6FF3D] overflow-hidden">
        
        {/* Sidebar - DO NOT TOUCH */}
        <DashboardSidebar />

        <main className="flex-1 ml-[64px] relative flex flex-col min-h-screen overflow-y-auto overflow-x-hidden pb-12">
          
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
            <GridBackground />
          </div>

          {/* Header */}
          <div className="w-full flex justify-end px-12 py-6 relative z-30">
            <DashboardHeader />
          </div>

          {/* Core Content */}
          <div className="flex-1 w-full max-w-[1200px] mx-auto px-12 pt-4 relative z-10 flex flex-col">
            
            {/* Page Title */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mb-12"
            >
              <div className="w-16 h-16 bg-black flex items-center justify-center shadow-[6px_6px_0_#C6FF3D]">
                <Cpu className="text-[#C6FF3D] w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter">
                  New <span className="text-white [-webkit-text-stroke:2px_black]">Project_</span>
                </h1>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#C6FF3D] rounded-full animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                    {folderApplied ? "Folder_Import_Active — Design_Tokens_Extracted" : referenceApplied ? "Vision_Reference_Loaded — Ready_To_Synthesize" : "Status: Interface_Ready"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <AnimatePresence>
                {(referenceApplied || folderApplied) && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={`ml-auto flex items-center gap-3 px-5 py-2 border-2 border-black shadow-[4px_4px_0_#000] ${
                      folderApplied ? "bg-black text-[#C6FF3D]" : "bg-[#C6FF3D] text-black"
                    }`}
                  >
                    {folderApplied ? <FolderOpen className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {folderApplied ? "Folder_Imported" : "Vision_Reference_Applied"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-12 gap-10">
              {/* ── LEFT: Command Entry ── */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group relative h-[420px] bg-white border-[4px] border-black transition-all duration-300 ${
                    isFocused ? 'shadow-[20px_20px_0_#C6FF3D]' : 'shadow-[15px_15px_0_#000]'
                  }`}
                >
                  {/* Console Header Bar */}
                  <div className="absolute top-0 left-0 w-full h-12 bg-black flex items-center justify-between px-6 z-10">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-[#C6FF3D]" />
                      <div className="w-2 h-2 bg-white/20" />
                      <div className="w-2 h-2 bg-white/20" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Module::Designer_v1.5</span>
                    {referenceApplied && (
                      <div className="flex items-center gap-2 text-[#C6FF3D]">
                        <div className="w-1.5 h-1.5 bg-[#C6FF3D] rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Vision_Active</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-12 h-full flex flex-col">
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={referenceApplied 
                        ? "Reference analyzed — prompt auto-filled. Edit or refine below..."
                        : "Describe your design system vision... or upload a reference above."}
                      className="flex-1 w-full bg-transparent border-none p-8 text-xl font-bold tracking-tight leading-relaxed focus:ring-0 resize-none placeholder:text-zinc-200 focus:outline-none"
                    />

                    {/* Meta Bar */}
                    <div className="h-16 border-t-[3px] border-black flex items-center justify-between px-8 bg-zinc-50/50">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-black animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate max-w-[280px]">
                          {inference || "Awaiting_Input_Vectors..."}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 border border-transparent hover:border-black hover:shadow-[2px_2px_0_#C6FF3D] transition-all" title="Attach file">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        {/* Upload Reference Quick Button */}
                        <button 
                          onClick={() => setShowUploadModal(true)}
                          className="p-2 border border-transparent hover:border-black hover:bg-[#C6FF3D] hover:shadow-[2px_2px_0_#000] transition-all group/img"
                          title="Upload reference design"
                        >
                          <ImageIcon className="w-5 h-5 group-hover/img:text-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Upload Reference */}
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="p-5 bg-white border-2 border-black shadow-[6px_6px_0_#C6FF3D] hover:-translate-y-1 hover:shadow-[8px_8px_0_#C6FF3D] transition-all cursor-pointer group text-left"
                  >
                    <Upload className="w-6 h-6 mb-4 group-hover:text-[#C6FF3D] transition-colors" />
                    <h4 className="text-[12px] font-black uppercase mb-1">Upload Reference</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Image / Video</p>
                  </button>

                  {/* Import Website Folder */}
                  <button
                    onClick={() => setShowImportFolder(true)}
                    className="p-5 bg-white border-2 border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#C6FF3D] transition-all cursor-pointer group text-left relative overflow-hidden"
                  >
                    {folderApplied && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#C6FF3D] rounded-full animate-pulse" />
                    )}
                    <FolderOpen className="w-6 h-6 mb-4 group-hover:text-[#C6FF3D] transition-colors" />
                    <h4 className="text-[12px] font-black uppercase mb-1">Import Folder</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">HTML / CSS / JS</p>
                  </button>

                  <button
                    className="p-5 bg-white border-2 border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] transition-all cursor-pointer group text-left"
                  >
                    <Globe className="w-6 h-6 mb-4 group-hover:text-[#C6FF3D] transition-colors" />
                    <h4 className="text-[12px] font-black uppercase mb-1">Browse Gallery</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Explore systems</p>
                  </button>
                </div>
              </div>

              {/* ── RIGHT: Parameters ── */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white border-[4px] border-black p-8 shadow-[20px_20px_0_#000] space-y-8">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5" />
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Overrides</h3>
                  </div>

                  {/* Primary Color */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Primary_Hex</label>
                      <span className="text-[12px] font-black font-mono uppercase">{primaryColor}</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-14 h-14 border-4 border-black relative overflow-hidden cursor-pointer shrink-0">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={e => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-4 gap-1.5">
                        {["#C6FF3D", "#FF3D3D", "#3D82FF", "#FFB23D"].map(c => (
                          <button 
                            key={c} 
                            onClick={() => setPrimaryColor(c)}
                            className={`h-full border-2 border-black transition-all active:scale-95 ${primaryColor === c ? 'scale-110 shadow-[4px_4px_0_#000] z-10' : 'hover:scale-105'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Edge_Curvature</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["0", "4", "8", "24"].map(r => (
                        <button 
                          key={r}
                          onClick={() => setBorderRadius(r)}
                          className={`h-12 border-2 border-black flex items-center justify-center font-black text-xs transition-all ${
                            borderRadius === r ? 'bg-black text-[#C6FF3D] shadow-[3px_3px_0_#C6FF3D]' : 'bg-transparent text-black hover:bg-zinc-50'
                          }`}
                        >
                          {r}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Execution_Stack</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["React", "Next.js", "Vue", "Flutter"].map(s => (
                        <button 
                          key={s}
                          onClick={() => setStack(s)}
                          className={`h-11 border-2 border-black flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all ${
                            stack === s 
                              ? 'bg-[#C6FF3D] text-black shadow-[4px_4px_0_#000] translate-x-[-2px] translate-y-[-2px]' 
                              : 'bg-transparent text-zinc-400 hover:text-black hover:bg-zinc-50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Synthesize Button */}
                  <button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="w-full group relative"
                  >
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-active:translate-x-0 group-active:translate-y-0 transition-transform" />
                    <div className={`relative h-20 border-[4px] border-black flex items-center justify-center gap-4 transition-all ${
                      prompt.trim()
                        ? "bg-[#C6FF3D] text-black hover:brightness-105"
                        : "bg-zinc-200 text-zinc-400"
                    }`}>
                      <span className="text-2xl font-black italic uppercase tracking-tighter">Synthesize_</span>
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                  </button>
                </div>

                {/* Create Blank Card */}
                <button className="w-full border-[3px] border-black p-6 flex items-center gap-5 bg-white hover:bg-zinc-50 hover:shadow-[6px_6px_0_#000] transition-all group">
                  <div className="w-12 h-12 bg-zinc-100 border-2 border-black flex items-center justify-center group-hover:bg-[#C6FF3D] transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-[13px] font-black uppercase">Create Blank</h5>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Manual Configuration</p>
                  </div>
                </button>

                {/* Past Projects Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 font-mono">Archive_History</h4>
                      <Link href="/projects" className="text-[10px] font-black uppercase text-[#C6FF3D] hover:underline transition-all underline-offset-4 decoration-[#C6FF3D]/30">View_All</Link>
                   </div>
                   
                   <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {loadingProjects ? (
                        <div className="p-6 border-2 border-dashed border-black flex flex-col items-center gap-3 bg-zinc-50">
                           <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                           <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Querying_Database...</span>
                        </div>
                      ) : pastProjects.length === 0 ? (
                        <div className="p-8 border-2 border-dashed border-black flex flex-col items-center gap-2 bg-zinc-50 grayscale opacity-40">
                           <Layers className="w-6 h-6 text-zinc-400" />
                           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">No_Previous_Records</span>
                        </div>
                      ) : pastProjects.map((p) => (
                        <Link 
                          href={`/project/${p.id}`} 
                          key={p.id}
                          className="flex items-center gap-4 p-4 bg-white border-2 border-black hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 transition-all group"
                        >
                           <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0 group-hover:bg-[#C6FF3D] transition-colors">
                              <Layout className="w-4 h-4 text-white group-hover:text-black" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h5 className="text-[11px] font-black uppercase truncate leading-none mb-1">{p.name || "Untitled_Project"}</h5>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight truncate">
                                 {p.design_systems?.[0]?.ui_style || "Extracted_Style"} · {new Date(p.created_at).toLocaleDateString()}
                              </p>
                           </div>
                           <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(420px); opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>

      {/* MODALS */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadReference 
            onClose={() => setShowUploadModal(false)}
            onAnalysisComplete={handleReferenceAnalyzed}
          />
        )}
        {showImportFolder && (
          <ImportFolder 
            onClose={() => setShowImportFolder(false)}
            onAnalysisComplete={handleFolderAnalyzed}
          />
        )}
      </AnimatePresence>
    </>
  );
}
