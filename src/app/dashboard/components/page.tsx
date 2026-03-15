"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  Blocks, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Zap,
  Play,
  Monitor,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import componentsData from "@/data/library.json";

const CATEGORIES = [
  "All",
  "Navigation",
  "Hero Sections",
  "Cards",
  "Pricing Tables",
  "Forms",
  "Buttons",
  "Inputs",
  "Footers",
  "Sidebars",
  "Dashboards",
  "Charts",
  "Modals"
];

export default function ComponentsLibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  const filteredComponents = useMemo(() => {
    return componentsData.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           comp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || comp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenInWorkstation = (comp: any) => {
    // In a real app, this would pass the component code/ID to the state 
    // or URL so the workstation can load it.
    router.push(`/dashboard/workstation?componentId=${comp.id}&name=${encodeURIComponent(comp.name)}`);
  };

  return (
    <div className="w-full h-full p-10 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* ── Header & Search ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full w-fit">
            <Blocks className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Component Library</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-950">Discover Vibro Components</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            A curated collection of production-ready components. Add them to your workspace and they'll automatically adapt to your project's design system.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-zinc-200 px-6 py-3 rounded-2xl w-full max-w-md shadow-sm focus-within:shadow-xl focus-within:border-zinc-300 transition-all duration-300 group">
          <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, tag, or function..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 w-full"
          />
        </div>
      </div>

      <div className="flex gap-10 items-start">
        
        {/* ── Category Sidebar ── */}
        <div className="w-56 shrink-0 space-y-8 sticky top-24">
           <div className="space-y-2">
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 px-4 mb-4">Categories</h3>
             <div className="flex flex-col gap-1">
               {CATEGORIES.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`flex items-center justify-between px-4 py-2 rounded-xl text-left transition-all ${
                     selectedCategory === cat 
                       ? "bg-black text-white shadow-lg" 
                       : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                   }`}
                 >
                   <span className="text-[13px] font-bold">{cat}</span>
                   {selectedCategory === cat && <ChevronRight className="w-3.5 h-3.5" />}
                 </button>
               ))}
             </div>
           </div>

           {/* Recommendation Sidebar Widget */}
           <div className="p-6 bg-[#b8f724]/10 rounded-[32px] border border-[#b8f724]/20 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-zinc-950" />
                <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-900">Recommended</h4>
              </div>
              <p className="text-[11px] text-zinc-600 font-medium leading-relaxed">
                Based on your recent projects, you might need a <strong>Fintech Dashboard</strong> kit.
              </p>
              <button className="text-[11px] font-bold text-zinc-900 underline underline-offset-4 flex items-center gap-1 group">
                Browse Collection <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        {/* ── Component Grid ── */}
        <div className="flex-1 space-y-8">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">{filteredComponents.length} components found</span>
              <div className="flex items-center gap-2">
                 <button className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-400 hover:text-black transition-colors"><Filter className="w-4 h-4" /></button>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredComponents.map(comp => (
               <div 
                 key={comp.id} 
                 onClick={() => setSelectedComponent(comp)}
                 className="group bg-white rounded-[32px] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
               >
                 <div className={`aspect-[4/3] ${comp.previewColor} relative flex items-center justify-center`}>
                    <div className="w-1/2 h-4 bg-white/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button className="bg-white text-black px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                         Preview <Play className="w-3 h-3 fill-current" />
                       </button>
                    </div>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-100">{comp.category}</span>
                       <div className="flex items-center gap-1">
                         {comp.framework.map(fw => (
                           <div key={fw} className="w-1.5 h-1.5 rounded-full bg-emerald-500" title={fw} />
                         ))}
                       </div>
                    </div>
                    <div>
                       <h4 className="text-[16px] font-black text-zinc-950 mb-1">{comp.name}</h4>
                       <div className="flex gap-2 text-[11px] text-zinc-400 font-medium">
                          {comp.tags.slice(0, 2).map(tag => (
                            <span key={tag}>#{tag}</span>
                          ))}
                       </div>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* ── Component Detail Modal ── */}
      {selectedComponent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md" onClick={() => setSelectedComponent(null)} />
           <div className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] animate-in zoom-in-95 duration-500 shadow-black/20 ring-1 ring-white/20">
              
              {/* Left Side: Preview */}
              <div className={`flex-1 ${selectedComponent.previewColor} relative flex items-center justify-center p-12`}>
                 <div className="w-full h-full bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-2xl flex flex-col items-center justify-center gap-6 overflow-hidden group">
                    <div className="w-1/2 h-1/2 bg-white/20 rounded-3xl blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <Monitor className="absolute w-24 h-24 text-white/50" />
                    <span className="absolute bottom-10 px-6 py-2 bg-black/10 backdrop-blur text-white/50 text-xs font-bold rounded-full border border-white/10 uppercase tracking-widest">Interactive Preview</span>
                 </div>
                 <button onClick={() => setSelectedComponent(null)} className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur text-white rounded-full hover:bg-white/20 hover:scale-110 active:scale-90 transition-all lg:hidden">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Right Side: Details & Actions */}
              <div className="w-full md:w-[420px] bg-white p-12 flex flex-col justify-between border-l border-zinc-100">
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <div className="px-3 py-1 bg-zinc-100 rounded-md text-[9px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200">{selectedComponent.category}</div>
                       <button onClick={() => setSelectedComponent(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hidden lg:block"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-4">
                       <h2 className="text-3xl font-black tracking-tight text-zinc-950">{selectedComponent.name}</h2>
                       <div className="flex flex-wrap gap-2">
                          {selectedComponent.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-zinc-50 rounded-lg text-[11px] font-bold text-zinc-500 border border-zinc-100">#{tag}</span>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Tech Stack</h5>
                       <div className="flex gap-4">
                          {selectedComponent.framework.map((fw: string) => (
                            <div key={fw} className="flex items-center gap-2">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               <span className="text-[13px] font-bold">{fw}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#b8f724] shadow-lg">
                          <Zap className="w-5 h-5 fill-current" />
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-zinc-950 leading-tight">Smart Inheritance</p>
                          <p className="text-[11px] text-zinc-500 font-medium">This component will adopt your project's design system automatically.</p>
                       </div>
                    </div>

                    <button 
                       onClick={() => handleOpenInWorkstation(selectedComponent)}
                       className="w-full py-5 bg-black text-[#b8f724] rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
                    >
                       Open in Workstation
                       <ExternalLink className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Custom Styles for no-scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
