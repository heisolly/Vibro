"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Layers, Paintbrush, Code2, FileText, ArrowRight, Zap, Check, Search, Monitor, Tablet, Smartphone } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TABS = [
  { id: "library", label: "Library", icon: Layers },
  { id: "studio", label: "Studio", icon: Paintbrush },
  { id: "editor", label: "Editor", icon: Code2 },
  { id: "export", label: "Export", icon: FileText },
];

const MOCK_COMPONENTS = [
  { name: "Primary Button", category: "Buttons", color: "bg-[#BAFF29]" },
  { name: "Stat Card",      category: "Cards",   color: "bg-zinc-800" },
  { name: "Top Navigation", category: "Navbars", color: "bg-black" },
  { name: "Dark Hero",      category: "Heroes",  color: "bg-gradient-to-br from-zinc-900 to-black" },
  { name: "Login Form",     category: "Forms",   color: "bg-zinc-900" },
  { name: "Pricing Grid",   category: "Pricing", color: "bg-zinc-800" },
];

const MOCK_COLORS = [
  { name: "Primary", value: "#BAFF29" },
  { name: "Background", value: "#0a0a0b" },
  { name: "Surface", value: "#0e0e0f" },
  { name: "Text", value: "#ffffff" },
  { name: "Muted", value: "#71717a" },
];

const EXPORT_MODES = [
  { id: "prompt", title: "AI Prompt", tag: "AI-Ready", accent: "#BAFF29" },
  { id: "json",   title: "JSON Context", tag: "JSON Export", accent: "#ffffff" },
  { id: "cli",    title: "CLI Install",  tag: "Direct Deploy", accent: "#BAFF29" },
];

function LibraryTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="relative flex-1 max-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
          <div className="w-full bg-[#0a0a0b] border border-white/10 pl-8 pr-3 py-2 text-[10px] text-zinc-600 rounded-lg">Search architecture...</div>
        </div>
        <div className="flex gap-1">
          {["All","Atomic","Molecule"].map(c => (
            <div key={c} className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${c === "All" ? "bg-[#BAFF29] text-black" : "border border-white/10 text-zinc-600"}`}>{c}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 grid grid-cols-3 gap-3 overflow-hidden">
        {MOCK_COMPONENTS.map((c, i) => (
          <div key={i} className="border border-white/5 bg-[#0a0a0b] group hover:border-[#BAFF29]/40 transition-all cursor-pointer rounded-xl overflow-hidden">
            <div className={`h-16 ${c.color} flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity`}>
              <span className="text-[8px] font-black text-black/30 uppercase tracking-widest">{c.name}</span>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{c.name}</p>
              <p className="text-[7px] text-zinc-700 uppercase tracking-widest mt-1">{c.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioTab() {
  return (
    <div className="h-full flex">
      <div className="w-[120px] border-r border-white/5 p-4">
        <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4">Design Tokens</p>
        {["Colors","Typography","Spacing","Radius"].map((cat, i) => (
          <div key={cat} className={`flex items-center gap-2 px-3 py-2 mb-2 text-[8px] font-black uppercase tracking-widest cursor-pointer rounded-lg ${i === 0 ? "bg-[#BAFF29] text-black" : "text-zinc-600 hover:text-white"}`}>
            {cat}
          </div>
        ))}
      </div>
      <div className="flex-1 p-6">
        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Core Palette</p>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_COLORS.map((col) => (
            <div key={col.name} className="border border-white/5 bg-[#0a0a0b] p-3 cursor-pointer hover:border-white/20 transition-all rounded-xl">
              <div className="w-full h-10 mb-2 rounded-lg" style={{ backgroundColor: col.value }} />
              <p className="text-[9px] font-black text-white uppercase tracking-widest">{col.name}</p>
              <p className="text-[7px] text-zinc-700 font-mono mt-1">{col.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditorTab() {
  return (
    <div className="h-full flex">
      <div className="flex-1 border-r border-white/5 flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Workspace</p>
          <div className="flex items-center gap-2">
            {[Monitor, Tablet, Smartphone].map((Icon, i) => (
              <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg ${i === 0 ? "bg-[#BAFF29]/10 text-[#BAFF29]" : "text-zinc-700"}`}>
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#0a0a0b] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />
          <button className="bg-[#BAFF29] text-black font-black px-8 py-4 text-sm uppercase tracking-widest z-10 rounded-2xl shadow-[0_20px_40px_rgba(186,255,41,0.2)]">
            Primary_Call_Action
          </button>
        </div>
      </div>
      <div className="w-[160px] p-4 bg-[#0e0e0f]">
        <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4">Style Parameters</p>
        <div className="space-y-4">
          <div>
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-2">Accent_Hex</p>
            <div className="flex items-center gap-3 bg-[#0a0a0b] border border-white/10 px-3 py-2 rounded-lg">
              <div className="w-4 h-4 bg-[#BAFF29] rounded-sm" />
              <span className="text-[9px] font-mono text-zinc-400">#BAFF29</span>
            </div>
          </div>
          <div>
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-2">Structural_Radius</p>
            <div className="w-full bg-[#0a0a0b] border border-white/10 h-2 rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-[60%] bg-[#BAFF29] rounded-full" />
            </div>
          </div>
        </div>
        <button className="mt-8 w-full py-3 bg-white text-black font-black text-[8px] uppercase tracking-widest rounded-xl hover:bg-[#BAFF29] transition-colors">Commit_Changes</button>
      </div>
    </div>
  );
}

function ExportTab() {
  return (
    <div className="h-full p-6">
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Ship Protocol</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {EXPORT_MODES.map((m) => (
          <div key={m.id} className="border border-white/5 bg-[#0e0e0f] p-4 hover:border-[#BAFF29]/40 transition-all cursor-pointer group rounded-2xl">
            <div className="w-8 h-8 mb-3 border rounded-lg flex items-center justify-center" style={{ borderColor: m.accent + "40", backgroundColor: m.accent + "10" }}>
              <Zap className="w-4 h-4" style={{ color: m.accent }} />
            </div>
            <p className="text-[9px] font-black text-white uppercase tracking-widest mb-1">{m.title}</p>
            <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-full" style={{ color: m.accent, borderColor: m.accent + "30" }}>{m.tag}</span>
          </div>
        ))}
      </div>
      <div className="border border-white/5 bg-[#0a0a0b] p-6 font-mono text-[9px] text-zinc-500 rounded-2xl leading-relaxed">
        <div className="text-[#BAFF29] mb-2 font-black">// PROTOCOL_SYNTHESIS_EXPORT</div>
        <div>system.brand.primary: <span className="text-white">#BAFF29</span></div>
        <div>system.layout.grid: <span className="text-white">8px atomic</span></div>
        <div>system.vibe: <span className="text-white">brutalist_dark</span></div>
      </div>
      <button className="mt-6 w-full py-4 bg-[#BAFF29] text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 rounded-2xl shadow-[0_20px_40px_rgba(186,255,41,0.1)]">
        <Check className="w-4 h-4" /> Copy_Ship_Protocol
      </button>
    </div>
  );
}

export default function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState("library");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".dash-preview-heading",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".dash-preview-heading", start: "top 85%" } }
    );
    gsap.fromTo(".dash-preview-window",
      { y: 80, opacity: 0, rotateX: 10 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".dash-preview-window", start: "top 85%" } }
    );
    gsap.fromTo(".dash-feature-item",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".dash-feature-list", start: "top 85%" } }
    );
  }, { scope: sectionRef });

  const tabContent: Record<string, JSX.Element> = {
    library: <LibraryTab />,
    studio:  <StudioTab />,
    editor:  <EditorTab />,
    export:  <ExportTab />,
  };

  return (
    <section ref={sectionRef} className="py-40 bg-[#0a0a0b] relative z-10 overflow-hidden border-y border-white/5">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BAFF29]/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">

          {/* Left: Text */}
          <div className="dash-preview-heading">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 mb-10">
              <Code2 className="w-4 h-4 text-[#BAFF29]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Full_Stack_Node</span>
            </div>
            <h2 className="text-6xl sm:text-[8rem] font-[1000] text-white tracking-[-0.06em] uppercase leading-[0.85] mb-12 italic">
              Unified <br /><span className="text-[#0a0a0b]" style={{ WebkitTextStroke: "2px white" }}>Orchestration.</span>
            </h2>
            <p className="text-zinc-500 font-bold italic text-xl leading-relaxed mb-16 max-w-lg">
               Automate your architectural decisions. The entire design engineering loop from extraction to deployment, contained in one engine.
            </p>

            <ul className="dash-feature-list space-y-6">
              {[
                { icon: Layers,    label: "Component Engine",    desc: "Autonomous component generation with verified patterns." },
                { icon: Paintbrush,label: "Token Orchestrator",  desc: "Real-time design token synthesis and global mapping." },
                { icon: Code2,     label: "Protocal Editor",    desc: "Live workspace for architectural fine-tuning." },
              ].map((f, i) => (
                <li key={i} className="dash-feature-item flex items-start gap-6 p-6 border border-white/5 bg-[#0e0e0f] hover:border-[#BAFF29]/40 transition-all group cursor-pointer rounded-2xl">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#BAFF29] transition-all duration-500 rounded-xl">
                    <f.icon className="w-5 h-5 text-[#BAFF29] group-hover:text-black transition-all" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-white text-sm uppercase tracking-widest">{f.label}</p>
                    <p className="text-zinc-500 text-xs font-bold mt-1 italic">{f.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-700 mt-1 group-hover:text-[#BAFF29] group-hover:translate-x-1 transition-all" />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Dashboard Window */}
          <div className="dash-preview-window" style={{ perspective: "1500px" }}>
            <div className="border-[3px] border-white/10 bg-[#0a0a0b] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden rounded-[3rem]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-[#0e0e0f]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 mx-6 bg-white/5 px-4 py-1.5 text-[9px] font-mono text-zinc-600 rounded-lg">app.vibro.engine/synthesis</div>
                <div className="w-2 h-2 rounded-full bg-[#BAFF29] animate-pulse" />
              </div>

              {/* Sidebar + Content */}
              <div className="flex" style={{ height: "450px" }}>
                {/* Mini sidebar */}
                <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 shrink-0 bg-[#0e0e0f]">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === tab.id ? "bg-[#BAFF29] text-black shadow-[0_0_20px_rgba(186,255,41,0.2)]" : "text-zinc-600 hover:text-white"}`}
                    >
                      <tab.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>

                {/* Tab content area */}
                <div className="flex-1 overflow-hidden">
                  {/* Content */}
                  <div className="h-full overflow-hidden">
                    {tabContent[activeTab]}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating indicator */}
            <div className="absolute -bottom-6 right-10 bg-[#BAFF29] text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(186,255,41,0.3)] border-2 border-black">
              LIVE_ENGINE_STREAM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
