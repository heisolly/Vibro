"use client";

import { useRef, useState, ReactNode } from "react";
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
  { name: "Primary Button", category: "Buttons", color: "bg-[#C6FF3D]" },
  { name: "Stat Card",      category: "Cards",   color: "bg-zinc-800" },
  { name: "Top Navigation", category: "Navbars", color: "bg-black" },
  { name: "Dark Hero",      category: "Heroes",  color: "bg-gradient-to-br from-zinc-900 to-black" },
  { name: "Login Form",     category: "Forms",   color: "bg-zinc-900" },
  { name: "Pricing Grid",   category: "Pricing", color: "bg-zinc-800" },
];

const MOCK_COLORS = [
  { name: "Primary", value: "#C6FF3D" },
  { name: "Background", value: "#050506" },
  { name: "Surface", value: "#0d0d0f" },
  { name: "Text", value: "#ffffff" },
  { name: "Muted", value: "#71717a" },
];

const EXPORT_MODES = [
  { id: "prompt", title: "AI Prompt", tag: "AI-Ready", accent: "#C6FF3D" },
  { id: "json",   title: "JSON Context", tag: "JSON Export", accent: "#C6FF3D" },
  { id: "cli",    title: "CLI Install",  tag: "Direct Deploy", accent: "#C6FF3D" },
];

function LibraryTab() {
  return (
    <div className="h-full flex flex-col font-space-grotesk">
      <div className="flex items-center gap-3 p-4 border-b-[2px] border-black/10">
        <div className="relative flex-1 max-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
          <div className="w-full bg-[#080809] border-[2px] border-black pl-8 pr-3 py-2 text-[10px] text-zinc-600 font-bold">Search components...</div>
        </div>
        <div className="flex gap-1">
          {["All","Buttons","Cards"].map(c => (
            <div key={c} className={`px-2 py-1 text-[8px] font-[900] uppercase tracking-widest border-[2px] border-black ${c === "All" ? "bg-[#C6FF3D] text-black shadow-[2px_2px_0_rgba(0,0,0,1)]" : "text-zinc-600"}`}>{c}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 grid grid-cols-3 gap-3 overflow-hidden">
        {MOCK_COMPONENTS.map((c, i) => (
          <div key={i} className="border-[2px] border-black bg-white group hover:border-[#C6FF3D] transition-all cursor-pointer shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_#C6FF3D]">
            <div className={`h-16 ${c.color} flex items-center justify-center border-b-[2px] border-black`}>
              <span className="text-[8px] font-[900] text-black/30 uppercase tracking-[0.2em]">{c.name}</span>
            </div>
            <div className="p-2">
              <p className="text-[10px] font-[900] text-black uppercase tracking-tight truncate">{c.name}</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase italic">{c.category}</p>
              <div className="mt-2 flex items-center justify-between h-5 px-2 bg-black text-[#C6FF3D] border-[1px] border-black group-hover:bg-[#C6FF3D] group-hover:text-black transition-all">
                <span className="text-[8px] font-black uppercase tracking-widest">Open</span>
                <ArrowRight className="w-2 h-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioTab() {
  return (
    <div className="h-full flex font-space-grotesk">
      <div className="w-[130px] border-r-[2px] border-black/10 p-4">
        <p className="text-[8px] font-[900] text-zinc-400 uppercase tracking-[0.4em] mb-4"># Design_Tokens</p>
        {["Colors","Typography","Spacing","Radius"].map((cat, i) => (
          <div key={cat} className={`flex items-center gap-2 px-3 py-2 mb-2 text-[9px] font-[900] uppercase tracking-widest cursor-pointer border-[2px] ${i === 0 ? "bg-[#C6FF3D] border-black text-black shadow-[4px_4px_0_rgba(0,0,0,1)]" : "text-zinc-500 border-transparent hover:border-black/10"}`}>
            {cat}
          </div>
        ))}
      </div>
      <div className="flex-1 p-5">
        <p className="text-[9px] font-[900] text-zinc-500 uppercase tracking-[0.4em] mb-4">◈ Active_Palette</p>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_COLORS.map((col) => (
            <div key={col.name} className="border-[2px] border-black bg-white p-3 cursor-pointer shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_#C6FF3D] transition-all">
              <div className="w-full h-10 mb-2 border-[2px] border-black" style={{ backgroundColor: col.value }} />
              <p className="text-[10px] font-[900] text-black uppercase tracking-tight">{col.name}</p>
              <p className="text-[8px] text-zinc-500 font-mono font-bold">{col.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditorTab() {
  return (
    <div className="h-full flex font-space-grotesk">
      <div className="flex-1 border-r-[2px] border-black/10 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b-[2px] border-black/10">
          <p className="text-[9px] font-[900] text-black uppercase tracking-widest">Canvas_Viewer</p>
          <div className="flex items-center gap-2">
            {[Monitor, Tablet, Smartphone].map((Icon, i) => (
              <div key={i} className={`w-8 h-8 flex items-center justify-center border-[2px] ${i === 0 ? "bg-black border-black text-[#C6FF3D] shadow-[2px_2px_0_rgba(0,0,0,1)]" : "border-black/10 text-zinc-400"}`}>
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#FBFBFA] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <button className="bg-black text-[#C6FF3D] font-[900] px-8 py-4 text-sm uppercase tracking-widest z-10 border-[3px] border-black shadow-[8px_8px_0_#C6FF3D]">
            Synthesized Node
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 border-t-[2px] border-black/10">
          <p className="text-[8px] font-[900] text-black uppercase tracking-widest mr-2">STATE_MAPPING:</p>
          {["Default","Hover","Active"].map((v, i) => (
            <div key={v} className={`px-3 py-1 text-[8px] font-[900] uppercase tracking-widest border-[2px] ${i === 0 ? "bg-[#C6FF3D] border-black text-black shadow-[2px_2px_0_rgba(0,0,0,1)]" : "border-black/10 text-zinc-400"}`}>{v}</div>
          ))}
        </div>
      </div>
      <div className="w-[160px] p-4 bg-white">
        <p className="text-[9px] font-[900] text-zinc-400 uppercase tracking-[0.4em] mb-4"># Style_Controls</p>
        <div className="space-y-4">
          <div>
            <p className="text-[8px] font-[900] text-black uppercase tracking-widest mb-2">BG_COLOR</p>
            <div className="flex items-center gap-2 bg-white border-[2px] border-black px-3 py-2 shadow-[3px_3px_0_rgba(0,0,0,1)]">
              <div className="w-4 h-4 bg-[#C6FF3D] border border-black" />
              <span className="text-[9px] font-mono font-bold text-black">#C6FF3D</span>
            </div>
          </div>
          <div>
            <p className="text-[8px] font-[900] text-black uppercase tracking-widest mb-2">RADIUS_OFFSET</p>
            <div className="w-full bg-[#F3F3F3] border-[2px] border-black h-2 relative">
              <div className="absolute left-0 top-0 h-full w-[40%] bg-black" />
            </div>
          </div>
          <div>
            <p className="text-[8px] font-[900] text-black uppercase tracking-widest mb-2">WEIGHT_INDEX</p>
            <div className="bg-white border-[2px] border-black px-3 py-2 text-[10px] font-mono font-black shadow-[3px_3px_0_rgba(0,0,0,1)]">800_BOLD</div>
          </div>
        </div>
        <button className="mt-8 w-full py-3 bg-[#C6FF3D] border-[2px] border-black text-black font-[900] text-[10px] uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all">SAVE_CHANGES</button>
      </div>
    </div>
  );
}

function ExportTab() {
  return (
    <div className="h-full p-5 font-space-grotesk">
      <p className="text-[9px] font-[900] text-zinc-400 uppercase tracking-[0.4em] mb-4"># Export_Mapping</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {EXPORT_MODES.map((m) => (
          <div key={m.id} className="border-[2px] border-black bg-white p-4 hover:border-[#C6FF3D] transition-all cursor-pointer group shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_#C6FF3D]">
            <div className="w-8 h-8 mb-3 border-[2px] border-black flex items-center justify-center bg-black group-hover:bg-[#C6FF3D] transition-colors">
              <Zap className="w-4 h-4 text-[#C6FF3D] group-hover:text-black transition-colors" />
            </div>
            <p className="text-[10px] font-[900] text-black uppercase tracking-tight mb-2">{m.title}</p>
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-[1.5px] border-black bg-[#F3F3F3]">{m.tag}</span>
          </div>
        ))}
      </div>
      <div className="border-[2px] border-black bg-white p-4 font-mono text-[10px] text-black font-bold shadow-[6px_6px_0_rgba(0,0,0,1)]">
        <div className="text-[#8fcc00] mb-2 font-black"># VIBRO_SYSTEM_MANIFEST</div>
        <div className="opacity-60">colors.primary: #C6FF3D</div>
        <div className="opacity-60">colors.bg: #0D0D0D</div>
        <div className="opacity-40 mt-1">...</div>
      </div>
      <button className="mt-8 w-full py-4 bg-black text-[#C6FF3D] font-[900] text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 border-[3px] border-black shadow-[8px_8px_0_#C6FF3D] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_#C6FF3D] transition-all">
        <Check className="w-4 h-4 stroke-[3]" /> COPY_SYSTEM_SNAPSHOT
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
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".dash-preview-window", start: "top 85%" } }
    );
  }, { scope: sectionRef });

  const tabContent: Record<string, ReactNode> = {
    library: <LibraryTab />,
    studio:  <StudioTab />,
    editor:  <EditorTab />,
    export:  <ExportTab />,
  };

  return (
    <section ref={sectionRef} className="scroll-section py-32 sm:py-48 bg-[#FFFCF2] border-y-[4px] border-black relative z-10 overflow-hidden font-space-grotesk">
      
      {/* ── GHOST GRID ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, black 1px, transparent 1px),
              linear-gradient(to bottom, black 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">

          {/* Left: Text */}
          <div className="dash-preview-heading">
            <div className="inline-flex items-center gap-3 bg-black px-6 py-2 mb-10 shadow-[6px_6px_0_#C6FF3D] border-[2px] border-black">
              <Code2 className="w-5 h-5 text-[#C6FF3D]" />
              <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#C6FF3D]">Integrated_Engine</span>
            </div>
            <h2 className="text-6xl sm:text-7xl font-[1000] text-black tracking-[-0.05em] uppercase leading-none mb-10">
              One Platform. <br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[3px] border-black shadow-[10px_10px_0_rgba(0,0,0,1)] mt-3">Total Control.</span>
            </h2>
            <p className="text-zinc-600 font-[700] italic text-xl leading-relaxed mb-16 max-w-lg uppercase tracking-tight">
              &ldquo;Design once, ship instantly. The design engineering workflow is now a single linear process.&rdquo;
            </p>

            <ul className="dash-feature-list space-y-6">
              {[
                { icon: Layers,    label: "Inventory Map",    desc: "Browse and deploy verified UI nodes instantly." },
                { icon: Paintbrush,label: "Token Foundry",    desc: "Scale colors, weight, and spacing tokens live." },
                { icon: Code2,     label: "Synthesis View",   desc: "Live editor with real-time architectural mapping." },
                { icon: FileText,  label: "Protocol Export",  desc: "One-click prompt or CLI export for any stack." },
              ].map((f, i) => (
                <li key={i} className="dash-feature-item flex items-start gap-6 p-6 border-[3px] border-black bg-white hover:shadow-[8px_8px_0_#C6FF3D] hover:-translate-y-1 transition-all group cursor-pointer shadow-[6px_6px_0_rgba(0,0,0,1)]">
                  <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0 group-hover:bg-[#C6FF3D] transition-colors border-[2px] border-black">
                    <f.icon className="w-6 h-6 text-[#C6FF3D] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="font-[900] text-black text-[15px] uppercase tracking-widest">{f.label}</p>
                    <p className="text-zinc-500 text-sm font-bold mt-1 italic leading-tight">{f.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-300 ml-auto self-center group-hover:text-black group-hover:translate-x-2 transition-all" />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Dashboard Window */}
          <div className="dash-preview-window">
            <div className="border-[4px] border-black bg-white shadow-[25px_25px_0_#0D0D0D] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-4 border-b-[3px] border-black bg-[#C6FF3D]">
                <div className="w-3.5 h-3.5 border-[2px] border-black bg-black" />
                <div className="w-3.5 h-3.5 border-[2px] border-black bg-black" />
                <div className="w-3.5 h-3.5 border-[2px] border-black bg-black" />
                <div className="flex-1 mx-6 bg-white border-[2px] border-black px-4 py-1.5 text-[10px] font-black text-black">VIBRO_SYNTHESIS_ENGINE // v4.0</div>
                <div className="w-2.5 h-2.5 bg-black animate-pulse" />
              </div>

              {/* Sidebar + Content */}
              <div className="flex h-[480px]">
                {/* Mini sidebar */}
                <div className="w-16 border-r-[3px] border-black flex flex-col items-center py-6 gap-6 shrink-0 bg-[#F3F3F3]">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-10 h-10 flex items-center justify-center border-[2px] transition-all shadow-[3px_3px_0_rgba(0,0,0,1)] ${activeTab === tab.id ? "bg-[#C6FF3D] border-black translate-y-[-2px] shadow-[5px_5px_0_rgba(0,0,0,1)]" : "bg-white border-black hover:translate-y-[-1px]"}`}
                    >
                      <tab.icon className="w-5 h-5 text-black" />
                    </button>
                  ))}
                </div>

                {/* Tab content area */}
                <div className="flex-1 overflow-hidden bg-white">
                  {/* Tab bar */}
                  <div className="flex border-b-[2px] border-black">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-3 text-[10px] font-[900] uppercase tracking-widest transition-all border-r-[2px] border-black ${activeTab === tab.id ? "bg-[#C6FF3D] text-black" : "bg-white text-zinc-400 hover:text-black"}`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {/* Content */}
                  <div className="h-full overflow-hidden">
                    {tabContent[activeTab]}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-black text-[#C6FF3D] border-[3px] border-black px-6 py-3 shadow-[8px_8px_0_rgba(0,0,0,0.1)] font-black text-xs tracking-[0.3em]">
              LIVE_PROCESS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
