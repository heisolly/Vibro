import { Terminal, Download, BookOpen, Code, Layers, Zap, ArrowRight, Copy } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-16 pb-32 selection:bg-[#b8f724] selection:text-black">
      {/* ── Header ── */}
      <div className="space-y-6">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-[#b8f724]">
            <Terminal className="w-3.5 h-3.5" /> CLI_Interface_Active
         </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 uppercase">
          Docs & <span className="text-zinc-400 italic">Deployment</span>
        </h1>
        <p className="text-zinc-500 font-medium text-lg max-w-2xl leading-relaxed">
          The Vibro ecosystem bridges the gap between AI synthesis and production code. 
          Use our CLI to install architectures directly into your codebase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* ── CLI Section ── */}
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8f724] opacity-5 blur-[80px] pointer-events-none" />
               
               <div className="space-y-6 relative z-10">
                  <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                     <Download className="w-6 h-6 text-[#b8f724]" /> Quick Install
                  </h2>
                  <p className="text-zinc-400 font-medium">Run this command in your project root to initialize the Vibro environment.</p>
                  
                  <div className="bg-black/50 border border-white/10 p-6 rounded-2xl font-mono text-xs text-[#b8f724] flex items-center justify-between group/cmd">
                     <code>npm install -g vibro-cli</code>
                     <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all opacity-0 group-hover/cmd:opacity-100">
                        <Copy className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="text-[10px] font-black text-[#b8f724] uppercase">Step_01</div>
                        <p className="text-xs font-bold text-white uppercase">vibro init</p>
                        <p className="text-[10px] text-zinc-500">Links your local repo to Vibro Cloud.</p>
                     </div>
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="text-[10px] font-black text-[#b8f724] uppercase">Step_02</div>
                        <p className="text-xs font-bold text-white uppercase">vibro install [id]</p>
                        <p className="text-[10px] text-zinc-500">Deploys architecture directly to your /components.</p>
                     </div>
                  </div>
               </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-10 bg-white border border-zinc-100 rounded-[32px] space-y-4 hover:border-zinc-200 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900">
                     <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-zinc-900 tracking-tight">API Reference</h3>
                  <p className="text-sm text-zinc-500 font-medium">Deep dive into our JSON schema and custom design token bindings.</p>
                  <button className="text-[10px] font-black uppercase text-[#8fcc00] flex items-center gap-2 hover:gap-3 transition-all">
                     View Docs <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
               <div className="p-10 bg-white border border-zinc-100 rounded-[32px] space-y-4 hover:border-zinc-200 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900">
                     <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-zinc-900 tracking-tight">Vibro Components</h3>
                  <p className="text-sm text-zinc-500 font-medium">Technical documentation for React, Vue, and Svelte implementations.</p>
                  <button className="text-[10px] font-black uppercase text-[#8fcc00] flex items-center gap-2 hover:gap-3 transition-all">
                     View Components <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </section>
         </div>

         {/* ── Status & Help ── */}
         <aside className="space-y-6">
            <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-100 space-y-8">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System_Status</h4>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-600">CLI Hub</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />
                           <span className="text-[10px] font-black text-zinc-900">Operational</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-600">Sync Engine</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />
                           <span className="text-[10px] font-black text-zinc-900">Active</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Environment</h4>
                  <div className="flex flex-wrap gap-2">
                     {["React", "Next.js", "Vite", "Vue", "Tailwind"].map(tech => (
                        <span key={tech} className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-tight">{tech}</span>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-black rounded-[32px] p-8 text-white space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[#b8f724] flex items-center justify-center text-black shadow-lg">
                   <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-lg font-black uppercase tracking-tight">Need Support?</h3>
                   <p className="text-xs text-zinc-400 leading-relaxed">Join our Discord community or contact the architecture team.</p>
                </div>
                <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#b8f724] transition-all">
                   Contact Architect
                </button>
            </div>
         </aside>
      </div>
    </div>
  );
}
