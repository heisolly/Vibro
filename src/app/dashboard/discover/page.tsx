"use client";

import { useState, useMemo } from "react";
import { marketplaceComponents, type MarketplaceComponent } from "@/lib/marketplace";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Flame, 
  Compass, 
  Clock, 
  ChevronDown, 
  Eye, 
  Heart,
  User,
  ArrowUpRight,
  Layout,
  Boxes,
  Calendar,
  Shuffle,
  Menu,
  PanelsTopLeft
} from "lucide-react";

const categories = ["Web", "Mobile", "Animation", "Login", "Sidebar", "Onboarding", "Grid", "Payment", "3D"];

const atomicComponents = [
  "Accordion", "Alert", "Alert Dialog", "Aspect Ratio", "Avatar", "Badge", "Breadcrumb", "Button", 
  "Button Group", "Calendar", "Card", "Carousel", "Chart", "Checkbox", "Collapsible", "Combobox", 
  "Command", "Context Menu", "Data Table", "Date Picker", "Dialog", "Direction", "Drawer", 
  "Dropdown Menu", "Empty", "Field", "Hover Card", "Input", "Input Group", "Input OTP", "Item", 
  "Kbd", "Label", "Menubar", "Native Select", "Navigation Menu", "Pagination", "Popover", 
  "Progress", "Radio Group", "Resizable", "Scroll Area", "Select", "Separator", "Sheet", 
  "Sidebar", "Skeleton", "Slider", "Sonner", "Spinner", "Switch", "Table", "Tabs", 
  "Textarea", "Toast", "Toggle", "Toggle Group", "Tooltip", "Typography"
];

// Mock authors for the premium look
const authors = [
  { name: "Meng To", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
  { name: "Sourany Phomhome", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "Vannarot Roeung", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
  { name: "Aksonvady Phomhome", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
];

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("Templates"); // Templates or Components
  const [activeCategory, setActiveCategory] = useState("Web");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("Recent"); // Popular, Recent

  const filteredTemplates = useMemo(() => {
    return marketplaceComponents.filter((comp) => {
      const matchesCategory = activeCategory === "All" || comp.category.toLowerCase().includes(activeCategory.toLowerCase());
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8 bg-white dark:bg-[#0A0A0A] min-h-screen">
      
      {/* ── Subtitle Actions ── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
               {activeTab === "Templates" ? "UI Templates" : "Atomic Components"}
             </h1>
             <p className="text-sm font-medium text-zinc-500">
               {activeTab === "Templates" 
                 ? "Premade production-ready architectures and page layouts." 
                 : "Low-cost, high-flexibility foundational blocks for your next UI."}
             </p>
           </div>
           <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
             <button 
               onClick={() => setActiveTab("Templates")}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "Templates" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
             >
               Templates
             </button>
             <button 
               onClick={() => setActiveTab("Components")}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "Components" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
             >
               Components
             </button>
           </div>
        </div>

        {/* ── Search Bar Interface ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-100 dark:border-white/5">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'Templates' ? '2832 templates' : 'atomic components'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setViewMode("Popular")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex-1 sm:flex-initial justify-center ${
                viewMode === "Popular" 
                  ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border-transparent" 
                  : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-white/5 hover:bg-zinc-50"
              }`}
            >
              <Menu className="h-3 w-3" /> Popular
            </button>
            <button 
              onClick={() => setViewMode("Recent")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex-1 sm:flex-initial justify-center ${
                viewMode === "Recent" 
                  ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border-transparent" 
                  : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-white/5 hover:bg-zinc-50"
              }`}
            >
              <Calendar className="h-3 w-3" /> Recent
            </button>
          </div>
        </div>

        {/* ── Filter Pills ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => setActiveCategory("All")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                activeCategory === "All" 
                  ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/20" 
                  : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 border-transparent"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  activeCategory === cat 
                    ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/20" 
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
            <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 transition-all whitespace-nowrap">
               Paid Templates
            </button>
          </div>

          <div className="flex items-center gap-3">
             <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Mine</button>
             <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-500 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-50 transition-all">
                <PanelsTopLeft className="w-3.5 h-3.5 text-zinc-400" /> All Types <ChevronDown className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>

      {/* ── Main Growth Grid ── */}
      {activeTab === "Templates" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-4 gap-y-8">
          {filteredTemplates.map((comp, idx) => {
             const author = authors[idx % authors.length];
             return (
              <div key={comp.id} className="group flex flex-col space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-100 dark:border-white/10 transition-all group-hover:border-zinc-200 dark:group-hover:border-white/20 shadow-sm bg-white dark:bg-zinc-900">
                  <img src={comp.image} alt={comp.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                     <Link 
                       href={`/dashboard/editor?id=${comp.id}`}
                       className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-xl"
                     >
                        Extract <ArrowUpRight className="w-4 h-4" />
                     </Link>
                  </div>
                </div>

                <div className="px-1.5 space-y-2">
                   <div className="flex items-center gap-2">
                     <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate flex-1 group-hover:text-blue-600 transition-colors">{comp.name}</h3>
                     <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">PRO</span>
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                       <img src={author.avatar} alt={author.name} className="w-4.5 h-4.5 rounded-full ring-1 ring-zinc-100" />
                       <span className="text-[10px] font-semibold text-zinc-400 truncate max-w-[80px]">{author.name}</span>
                     </div>
                     <div className="flex items-center gap-3 text-zinc-400">
                        <div className="flex items-center gap-1">
                          <Shuffle className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Remix</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="text-[10px] font-medium">{Math.floor(Math.random() * 500) + 100}</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
             );
          })}
        </div>
      ) : (
        <div className="max-w-[1000px] space-y-12">
           <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Foundational Components</h2>
                <div className="flex items-center gap-2">
                   <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-bold border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 transition-all">
                      <Layout className="w-3.5 h-3.5" /> Copy Page
                   </button>
                   <button className="flex items-center justify-center p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 dark:border-white/5">
                      <ArrowUpRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <p className="text-[1.05rem] text-zinc-500 max-w-2xl leading-relaxed">
                Browse our curated list of atomic components. Each element is pre-configured with the Vibro design system for immediate architectural synthesis.
              </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 lg:gap-x-16 xl:gap-x-20">
              {atomicComponents.map((name) => (
                <Link 
                  key={name}
                  href={`/dashboard/discover?component=${name.toLowerCase()}`}
                  className="text-[1.05rem] font-medium text-zinc-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-8 decoration-2 transition-all"
                >
                  {name}
                </Link>
              ))}
           </div>
           
           <div className="py-12 border-t border-zinc-100 dark:border-white/10">
             <p className="text-zinc-500 text-sm">
               Can't find what you need? Try the <Link href="/docs/directory" className="font-bold text-zinc-950 dark:text-white underline underline-offset-4">registry directory</Link> for community-maintained components.
             </p>
           </div>
        </div>
      )}

      {/* Styled JSX for no-scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
