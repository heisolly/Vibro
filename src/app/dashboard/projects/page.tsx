"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  FolderKanban, 
  Terminal, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  ChevronDown,
  Layout,
  Smartphone,
  Layers
} from "lucide-react";

const mockProjects = [
  { 
    id: "proj_01", 
    name: "Architectina Framework", 
    status: "Synced", 
    lastEdited: "2 hours ago", 
    type: "Web",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&auto=format&fit=crop"
  },
  { 
    id: "proj_02", 
    name: "Engineered Neural Mycelium", 
    status: "Draft", 
    lastEdited: "1 day ago", 
    type: "Web",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&auto=format&fit=crop"
  },
  { 
    id: "proj_03", 
    name: "Synthesis Workspace v4", 
    status: "Synced", 
    lastEdited: "3 days ago", 
    type: "Mobile",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93db40?w=600&h=400&auto=format&fit=crop"
  },
  { 
    id: "proj_04", 
    name: "Nexus Infrastructure Matrix", 
    status: "Synced", 
    lastEdited: "1 week ago", 
    type: "Web",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=400&auto=format&fit=crop"
  }
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8 bg-white dark:bg-[#0A0A0A] min-h-screen text-zinc-900">
      
      {/* ── Header & Tabs ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-zinc-100 dark:border-white/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">My Architectures</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage and export your synthesized component systems.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 transition-all">
            Filter <ChevronDown className="w-4 h-4" />
          </button>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Synthesis
          </Link>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-zinc-50 dark:border-white/5">
        {["All", "Web", "Mobile", "Animation", "Paid Templates"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Projects Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {mockProjects
          .filter(p => activeTab === "All" || p.type === activeTab)
          .map((proj) => (
          <div key={proj.id} className="group flex flex-col space-y-4 cursor-pointer">
            {/* Thumbnail */}
            <div className="relative aspect-[16/11] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-zinc-200 dark:group-hover:shadow-black group-hover:-translate-y-1">
              <img src={proj.image} alt={proj.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl text-zinc-600 dark:text-zinc-400 border border-white/20 dark:border-white/5 shadow-lg hover:bg-white transition-all">
                   <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl text-red-500 border border-white/20 dark:border-white/5 shadow-lg hover:bg-white transition-all">
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4">
                 <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg text-[10px] font-black uppercase tracking-widest ${
                   proj.status === 'Synced' ? 'bg-[#b8f724]/80 text-black border-[#b8f724]/20' : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-white border-white/20'
                 }`}>
                   {proj.status === 'Synced' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                   {proj.status}
                 </div>
              </div>
            </div>

            {/* Meta */}
            <div className="space-y-3 px-1">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 transition-colors uppercase leading-none">{proj.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-medium">
                    {proj.type === "Web" ? <Layout className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                    <span>{proj.type} Project</span>
                    <span className="text-zinc-200 dark:text-zinc-800">•</span>
                    <span>{proj.lastEdited}</span>
                  </div>
                </div>
                <button className="text-zinc-300 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors p-1">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create Card */}
        <Link 
          href="/dashboard"
          className="group flex flex-col space-y-4"
        >
          <div className="aspect-[16/11] rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 group-hover:shadow-2xl group-hover:shadow-zinc-100 dark:group-hover:shadow-black group-hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
               <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">New Synthesis</span>
          </div>
        </Link>
      </div>
      
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
