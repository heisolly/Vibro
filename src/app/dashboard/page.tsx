"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Blocks, 
  Image as ImageIcon, 
  Layout, 
  ArrowRight, 
  Plus, 
  MoreVertical, 
  Play, 
  Copy, 
  Trash2, 
  Search,
  Zap,
  ChevronRight,
  Monitor
} from "lucide-react";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/design-system", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const designSystem = await response.json();
      
      const params = new URLSearchParams({
        prompt,
        theme: designSystem.theme,
        style: designSystem.componentStyle,
        font: designSystem.fonts.heading.toLowerCase().replace(' ', '-'),
        radius: designSystem.radius
      });
      
      router.push(`/dashboard/workstation?${params.toString()}`);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const examples = [
    "SaaS dashboard layout",
    "Pricing section with modern cards",
    "Fintech analytics component",
    "Landing page hero section"
  ];

  const ideas = [
    "Admin analytics dashboard",
    "Crypto trading UI",
    "AI SaaS landing page",
    "Mobile onboarding flow"
  ];

  const recentProjects = [
    { id: 1, name: "Fintech Dashboard", framework: "Next.js", edited: "2h ago", thumbColor: "bg-indigo-600/10" },
    { id: 2, name: "Vibro Landing", framework: "React", edited: "5h ago", thumbColor: "bg-emerald-600/10" },
    { id: 3, name: "Admin Portal", framework: "Tailwind", edited: "Yesterday", thumbColor: "bg-orange-600/10" },
    { id: 4, name: "Auth Components", framework: "React", edited: "2 days ago", thumbColor: "bg-blue-600/10" }
  ];

  const trendingComponents = [
    { id: 1, name: "Modern Navbar", tag: "Navbar" },
    { id: 2, name: "Hero Section", tag: "Hero" },
    { id: 3, name: "Pricing Table", tag: "Pricing" },
    { id: 4, name: "Sidebar Layout", tag: "Dashboard" }
  ];

  return (
    <div className="w-full h-full pb-24 animate-in fade-in duration-700">
      
      {/* ── Section 1: Hero Creation ── */}
      <section className="px-10 py-20 flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-[#b8f724]/10 to-transparent pointer-events-none opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tighter text-zinc-950 leading-[0.9]">
            What do you want to <br /> build today?
          </h1>
        </div>

        <div className="w-full max-w-3xl space-y-6 relative z-10">
          <div className="relative group">
             <div className="absolute -inset-1 bg-[#b8f724] rounded-[24px] blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
             <div className="relative bg-white border border-zinc-200 rounded-[22px] p-2 flex items-center shadow-xl shadow-zinc-100 focus-within:border-zinc-300 focus-within:shadow-2xl focus-within:shadow-zinc-200 transition-all duration-300">
               <div className="px-5 text-zinc-400">
                 <Sparkles className="w-5 h-5 transition-colors group-focus-within:text-[#b8f724]" />
               </div>
               <input 
                 type="text" 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                 placeholder="Describe the UI or component you want to create..."
                 className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 py-4"
               />
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating || !prompt}
                 className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8f724] hover:text-black transition-all active:scale-95 flex items-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isGenerating ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     Generate Design System
                     <Zap className="w-4 h-4 text-[#b8f724] group-hover/btn:text-black transition-colors" />
                   </>
                 )}
               </button>
             </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
             <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mr-2">Try:</span>
             {examples.map((ex) => (
                <button 
                  key={ex} 
                  onClick={() => setPrompt(ex)}
                  className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-semibold text-zinc-600 transition-colors border border-zinc-200/50"
                >
                  {ex}
                </button>
             ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Quick Start Cards ── */}
      <section className="px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="group relative bg-white border border-zinc-100 p-8 rounded-[28px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#4f46e5]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
             <div className="w-12 h-12 rounded-2xl bg-[#4f46e5]/10 flex items-center justify-center text-[#4f46e5] mb-6 shadow-inner ring-1 ring-[#4f46e5]/20">
               <Sparkles className="w-6 h-6" />
             </div>
             <h4 className="text-[17px] font-bold text-zinc-950 mb-2">Create with AI</h4>
             <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">Generate components and layouts with AI</p>
          </div>

          <Link href="/dashboard/components" className="group relative bg-white border border-zinc-100 p-8 rounded-[28px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-zinc-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
             <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-600 mb-6 shadow-inner ring-1 ring-zinc-200">
               <Blocks className="w-6 h-6" />
             </div>
             <h4 className="text-[17px] font-bold text-zinc-950 mb-2">Component Library</h4>
             <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">Browse and customize UI components</p>
          </Link>

          <div className="group relative bg-white border border-zinc-100 p-8 rounded-[28px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
             <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 shadow-inner ring-1 ring-blue-100">
               <ImageIcon className="w-6 h-6" />
             </div>
             <h4 className="text-[17px] font-bold text-zinc-950 mb-2">Start from Screenshot</h4>
             <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">Convert screenshots into components</p>
          </div>

          <div className="group relative bg-white border border-zinc-100 p-8 rounded-[28px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
             <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6 shadow-inner ring-1 ring-orange-100">
               <Layout className="w-6 h-6" />
             </div>
             <h4 className="text-[17px] font-bold text-zinc-950 mb-2">Templates</h4>
             <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">Start from curated UI templates</p>
          </div>

        </div>
      </section>

      {/* ── Section 3: Recent Projects ── */}
      <section className="px-10 py-16 space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-[20px] font-bold text-zinc-950 tracking-tight">Recent Projects</h3>
           <Link href="/dashboard/projects" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1">
             View all projects <ChevronRight className="w-3.5 h-3.5" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {recentProjects.map((project) => (
             <div key={project.id} className="group bg-white rounded-[24px] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`aspect-[4/3] ${project.thumbColor} relative flex items-center justify-center`}>
                   <Monitor className="w-10 h-10 text-zinc-300" />
                   {/* Hover Quick Actions */}
                   <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2.5 bg-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all text-zinc-900"><Play className="w-4.5 h-4.5 fill-current" /></button>
                      <button className="p-2.5 bg-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all text-zinc-900"><Copy className="w-4.5 h-4.5" /></button>
                      <button className="p-2.5 bg-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all text-red-500"><Trash2 className="w-4.5 h-4.5" /></button>
                   </div>
                </div>
                <div className="p-5 flex items-center justify-between bg-white border-t border-zinc-50">
                   <div className="space-y-1">
                     <p className="text-[14px] font-bold text-zinc-900">{project.name}</p>
                     <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{project.framework} • {project.edited}</p>
                   </div>
                   <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* ── Section 4: Explore Components ── */}
      <section className="px-10 py-10 space-y-8">
        <h3 className="text-[20px] font-bold text-zinc-950 tracking-tight">Trending Components</h3>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4">
           {trendingComponents.map((comp) => (
             <div key={comp.id} className="min-w-[280px] bg-white rounded-[24px] border border-zinc-100 p-6 space-y-4 shadow-sm hover:shadow-lg transition-all border-b-2 hover:border-[#b8f724] border-transparent">
                <div className="aspect-video bg-zinc-50 rounded-xl relative overflow-hidden flex items-center justify-center">
                   <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-white" />
                   <span className="absolute px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest border border-zinc-100 shadow-sm">{comp.tag}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[14px] font-bold text-zinc-900">{comp.name}</span>
                   <button className="px-4 py-1.5 bg-zinc-950 text-white rounded-lg text-xs font-bold hover:bg-[#b8f724] hover:text-black transition-all">Install</button>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* ── Section 5: AI Suggestions ── */}
      <section className="px-10 py-10">
        <div className="bg-[#b8f724]/5 border border-[#b8f724]/20 rounded-[32px] p-10 space-y-8 relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#b8f724] blur-[120px] opacity-20" />
           
           <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-zinc-950" />
              <h3 className="text-[20px] font-bold text-zinc-950 tracking-tight">Ideas to build today</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ideas.map((idea) => (
                <button 
                  key={idea}
                  onClick={() => setPrompt(idea)}
                  className="group p-5 bg-white border border-zinc-200/50 rounded-2xl text-left hover:border-[#b8f724] hover:shadow-xl transition-all relative overflow-hidden"
                >
                  <p className="text-[14px] font-bold text-zinc-900 relative z-10">{idea}</p>
                  <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors relative z-10 flex items-center gap-1 mt-3">
                    Try this <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ))}
           </div>
        </div>
      </section>

    </div>
  );
}
