"use client";

import { useState, useMemo } from "react";
import { marketplaceComponents, type MarketplaceComponent } from "@/lib/marketplace";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight, Zap, Filter, Star } from "lucide-react";

const categories = ["All", "Buttons", "Cards", "Navbars", "Footers", "Hero Sections", "Dashboards", "Pricing Table", "Login Page"];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = useMemo(() => {
    return marketplaceComponents.filter((comp) => {
      const matchesCategory = activeCategory === "All" || comp.category === activeCategory;
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            comp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-16 pb-32">
      {/* ── Marketplace Hero & Search ── */}
      <section className="relative overflow-hidden rounded-[40px] bg-zinc-900 p-12 lg:p-20 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b8f724] opacity-[0.07] blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-white opacity-[0.03] blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
           <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#b8f724]/10 border border-[#b8f724]/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#b8f724]">
                 <Zap className="w-3 h-3 animate-pulse" /> Synthesis_Market
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                High-fidelity <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 italic">Components</span>
              </h1>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                Discover architectural building blocks tailored for production synthesis. 
                Everything you need to build high-conversion apps and websites.
              </p>
           </div>
           
           <div className="w-full lg:w-[450px] space-y-4">
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#b8f724] transition-colors">
                    <Search className="w-5 h-5" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search by name, tag, or category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-16 pr-6 py-4 font-bold text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-white/10 focus:border-[#b8f724]/30 focus:ring-4 focus:ring-[#b8f724]/5" 
                 />
              </div>
           </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex flex-wrap items-center gap-2 animate-item">
            {categories.map((cat) => (
               <button 
                 key={cat} 
                 onClick={() => setActiveCategory(cat)}
                 className={`rounded-xl py-2.5 px-6 text-[11px] font-black uppercase tracking-widest transition-all ${
                   activeCategory === cat 
                   ? "bg-black text-[#b8f724] shadow-xl shadow-black/10 scale-105" 
                   : "bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300"
                 }`}
               >
                  {cat}
               </button>
            ))}
         </div>
         
         <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold text-xs hover:bg-zinc-200 transition-all">
            <SlidersHorizontal className="w-4 h-4" /> Filters
         </button>
      </div>

      {/* ── Component Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredComponents.length > 0 ? (
          filteredComponents.map((comp) => (
            <div key={comp.id} className="group relative rounded-[32px] bg-white border border-zinc-100 overflow-hidden transition-all duration-500 hover:border-zinc-200 hover:shadow-[0_32px_64px_-20px_rgba(0,0,0,0.08)]">
              {/* Image Preview */}
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
                <img src={comp.image} alt={comp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <Link 
                     href={`/dashboard/editor?id=${comp.id}`}
                     className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-[#b8f724]"
                   >
                      Synthesize <ArrowUpRight className="w-4 h-4" />
                   </Link>
                </div>
                
                <div className="absolute top-4 left-4">
                   <div className="rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white border border-white/10 shadow-lg">
                     {comp.category}
                   </div>
                </div>

                <div className="absolute top-4 right-4">
                   <div className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border shadow-lg ${
                     comp.price === "Free" ? "bg-[#b8f724]/90 text-black border-[#b8f724]" : "bg-white text-black border-zinc-200"
                   }`}>
                     {comp.price === "Free" ? "Free" : `$${comp.price}`}
                   </div>
                </div>
              </div>
              
              <div className="p-8 space-y-5">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-none truncate pr-4">{comp.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 rounded-lg shrink-0">
                       <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                       <span className="text-xs font-black text-zinc-900 leading-none">{comp.rating}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                       {comp.frameworks.map(fw => (
                         <div key={fw} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs shadow-sm" title={fw}>
                            {fw === 'react' && '⚛️'}
                            {fw === 'nextjs' && '▲'}
                            {fw === 'vue' && '💚'}
                            {fw === 'svelte' && '🔥'}
                            {fw === 'html' && '🌊'}
                         </div>
                       ))}
                    </div>
                    <div className="h-4 w-px bg-zinc-100" />
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                       {comp.tags.slice(0, 2).map(tag => (
                         <span key={tag} className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">#{tag}</span>
                       ))}
                    </div>
                 </div>

                 <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">{comp.reviews} Installs</span>
                    <Link href={`/dashboard/editor?id=${comp.id}`} className="text-[10px] font-black uppercase text-zinc-900 border-b border-black/10 hover:border-black transition-all">Details_View</Link>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner border border-zinc-100">📡</div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">No Components Found</h3>
                <p className="text-zinc-400 font-medium text-sm">Our sensors couldn't find anything matching your search query.</p>
             </div>
             <button 
               onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
               className="px-8 py-3 bg-black text-[#b8f724] rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
             >
                Reset Sensors
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
