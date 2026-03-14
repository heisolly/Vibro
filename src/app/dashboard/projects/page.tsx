import Link from "next/link";
import { Plus, FolderKanban, Terminal, Trash2, Edit3, CheckCircle2, Clock } from "lucide-react";

const mockProjects = [
  { id: "proj_01", name: "Helios SaaS Admin", status: "Synced", lastEdited: "2 hours ago", type: "AI Generated" },
  { id: "proj_02", name: "Neon Landing Page", status: "Draft", lastEdited: "1 day ago", type: "Visual Synthesis" },
  { id: "proj_03", name: "Custom Auth Flow", status: "Synced", lastEdited: "3 days ago", type: "Component Logic" }
];

export default function ProjectsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-16 pb-32">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 shrink-0">
        <div className="space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b8f724]/10 border border-[#b8f724]/20 text-[10px] font-black uppercase tracking-widest text-[#b8f724]">
              <FolderKanban className="w-3.5 h-3.5" /> Workspace_Active
           </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 uppercase">
            My <span className="text-zinc-400 italic">Architectures</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg max-w-xl leading-relaxed">
            Manage your generated apps, custom component kits, and specific install configurations synced to the Vibro CLI.
          </p>
        </div>
        
        <Link 
          href="/dashboard"
          className="px-10 py-5 rounded-2xl bg-black text-[#b8f724] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
           <Plus className="w-4 h-4" /> New Synthesis
        </Link>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-4">
        {mockProjects.map((proj) => (
          <div key={proj.id} className="group relative rounded-3xl bg-white border border-zinc-100 p-8 hover:border-zinc-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 rounded-[28px] bg-zinc-50 flex items-center justify-center text-3xl group-hover:bg-[#b8f724]/10 transition-colors border border-zinc-100">
                      {proj.type === "AI Generated" ? "🤖" : proj.type === "Visual Synthesis" ? "📸" : "🧩"}
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
                         {proj.name}
                         {proj.status === 'Synced' && <CheckCircle2 className="w-4 h-4 text-[#b8f724]" />}
                      </h3>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            <Terminal className="w-3.5 h-3.5" /> {proj.type}
                         </div>
                         <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                         <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            <Clock className="w-3.5 h-3.5" /> {proj.lastEdited}
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-8">
                   <div className="text-right hidden md:block space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Sync_Status</div>
                      <div className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${proj.status === 'Synced' ? 'bg-[#b8f724]/5 text-[#b8f724] border-[#b8f724]/20' : 'bg-amber-50 text-amber-500 border-amber-200'}`}>
                         {proj.status}
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-4 rounded-2xl bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all">
                         <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-4 rounded-2xl bg-zinc-50 text-zinc-400 hover:bg-red-500 hover:text-white transition-all">
                         <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="rounded-[40px] bg-zinc-50 p-16 text-center border-2 border-dashed border-zinc-200">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Archive_System_Ready</p>
          <div className="flex flex-col items-center gap-4">
             <h3 className="text-xl font-black text-zinc-900 uppercase">Need more space?</h3>
             <button className="px-8 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all font-mono">
                Connect Cloud Storage
             </button>
          </div>
      </div>
    </div>
  );
}
