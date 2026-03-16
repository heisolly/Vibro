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
  { id: "json",   title: "JSON Context", tag: "JSON Export", accent: "#818cf8" },
  { id: "cli",    title: "CLI Install",  tag: "Direct Deploy", accent: "#34d399" },
];

function LibraryTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-[#ffffff08]">
        <div className="relative flex-1 max-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
          <div className="w-full bg-[#080809] border border-[#ffffff0a] pl-8 pr-3 py-2 text-[10px] text-zinc-600">Search components...</div>
        </div>
        <div className="flex gap-1">
          {["All","Buttons","Cards"].map(c => (
            <div key={c} className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest ${c === "All" ? "bg-[#C6FF3D] text-black" : "border border-[#ffffff0a] text-zinc-600"}`}>{c}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 grid grid-cols-3 gap-2 overflow-hidden">
        {MOCK_COMPONENTS.map((c, i) => (
          <div key={i} className="border border-[#ffffff06] bg-[#080809] group hover:border-[#ffffff15] transition-all cursor-pointer">
            <div className={`h-16 ${c.color} flex items-center justify-center`}>
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{c.name}</span>
            </div>
            <div className="p-2">
              <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{c.name}</p>
              <p className="text-[7px] text-zinc-700 uppercase tracking-widest">{c.category}</p>
              <div className="mt-1 flex items-center justify-between h-5 px-2 bg-transparent border border-[#ffffff06] text-zinc-700 group-hover:bg-[#C6FF3D] group-hover:text-black group-hover:border-[#C6FF3D] transition-all">
                <span className="text-[7px] font-black uppercase tracking-widest">Open</span>
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
    <div className="h-full flex">
      <div className="w-[120px] border-r border-[#ffffff08] p-3">
        <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-3">Design Tokens</p>
        {["Colors","Typography","Spacing","Radius"].map((cat, i) => (
          <div key={cat} className={`flex items-center gap-2 px-2 py-1.5 mb-1 text-[8px] font-black uppercase tracking-widest cursor-pointer ${i === 0 ? "bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-white" : "text-zinc-600 hover:text-white"}`}>
            {cat}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4">
        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">Color Tokens</p>
        <div className="grid grid-cols-3 gap-2">
          {MOCK_COLORS.map((col) => (
            <div key={col.name} className="border border-[#ffffff08] bg-[#080809] p-2 cursor-pointer hover:border-[#ffffff15] transition-all">
              <div className="w-full h-8 mb-1.5 rounded-sm" style={{ backgroundColor: col.value }} />
              <p className="text-[8px] font-black text-white uppercase tracking-widest">{col.name}</p>
              <p className="text-[7px] text-zinc-700 font-mono">{col.value}</p>
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
      <div className="flex-1 border-r border-[#ffffff08] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#ffffff08]">
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Canvas</p>
          <div className="flex items-center gap-1">
            {[Monitor, Tablet, Smartphone].map((Icon, i) => (
              <div key={i} className={`w-6 h-6 flex items-center justify-center ${i === 0 ? "bg-[#C6FF3D]/10 text-[#C6FF3D]" : "text-zinc-700"}`}>
                <Icon className="w-3 h-3" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#080808] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:20px_20px]" />
          <button className="bg-[#C6FF3D] text-black font-black px-6 py-3 text-sm uppercase tracking-widest z-10">
            Primary Button
          </button>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 border-t border-[#ffffff08]">
          <p className="text-[7px] font-black text-zinc-700 uppercase tracking-widest mr-2">State:</p>
          {["Default","Hover","Active"].map((v, i) => (
            <div key={v} className={`px-2 py-1 text-[7px] font-black uppercase tracking-widest ${i === 0 ? "bg-[#C6FF3D] text-black" : "border border-[#ffffff08] text-zinc-700"}`}>{v}</div>
          ))}
        </div>
      </div>
      <div className="w-[140px] p-3">
        <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-3">Style Controls</p>
        <div className="space-y-3">
          <div>
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">BG Color</p>
            <div className="flex items-center gap-2 bg-[#080809] border border-[#ffffff0a] px-2 py-1">
              <div className="w-3 h-3 bg-[#C6FF3D]" />
              <span className="text-[8px] font-mono text-zinc-400">#C6FF3D</span>
            </div>
          </div>
          <div>
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Radius</p>
            <div className="w-full bg-[#090909] border border-[#ffffff0a] h-1.5 relative">
              <div className="absolute left-0 top-0 h-full w-[40%] bg-[#C6FF3D]" />
            </div>
          </div>
          <div>
            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Font Weight</p>
            <div className="bg-[#080809] border border-[#ffffff0a] px-2 py-1 text-[8px] font-mono text-zinc-400">800</div>
          </div>
        </div>
        <button className="mt-4 w-full py-2 bg-[#C6FF3D] text-black font-black text-[7px] uppercase tracking-widest">Save</button>
      </div>
    </div>
  );
}

function ExportTab() {
  return (
    <div className="h-full p-4">
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Export Mode</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {EXPORT_MODES.map((m) => (
          <div key={m.id} className="border border-[#ffffff08] bg-[#080809] p-3 hover:border-[#ffffff15] transition-all cursor-pointer group">
            <div className="w-6 h-6 mb-2 border flex items-center justify-center" style={{ borderColor: m.accent + "40", backgroundColor: m.accent + "10" }}>
              <Zap className="w-3 h-3" style={{ color: m.accent }} />
            </div>
            <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">{m.title}</p>
            <span className="text-[7px] font-black uppercase tracking-widest px-1 py-0.5 border" style={{ color: m.accent, borderColor: m.accent + "30" }}>{m.tag}</span>
          </div>
        ))}
      </div>
      <div className="border border-[#ffffff06] bg-[#080809] p-3 font-mono text-[8px] text-zinc-600">
        <div className="text-[#C6FF3D] mb-1"># VIBRO DESIGN SYSTEM</div>
        <div>colors.primary: #C6FF3D</div>
        <div>colors.bg: #050506</div>
        <div>typography.display: 48px/900</div>
        <div>spacing.base: 4px...</div>
      </div>
      <button className="mt-3 w-full py-2.5 bg-[#C6FF3D] text-black font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
        <Check className="w-3 h-3" /> Copy Export
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
    <section ref={sectionRef} className="scroll-section py-32 sm:py-48 bg-[#FAFAF8] border-y-[3.5px] border-black relative z-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left: Text */}
          <div className="dash-preview-heading">
            <div className="inline-flex items-center gap-3 bg-black px-5 py-2 mb-8 shadow-[6px_6px_0_#C6FF3D]">
              <Code2 className="w-4 h-4 text-[#C6FF3D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C6FF3D]">Full_Stack_Engine</span>
            </div>
            <h2 className="text-5xl sm:text-7xl font-[1000] text-black tracking-[-0.04em] uppercase leading-none mb-8">
              One Platform. <br /><span className="text-white [-webkit-text-stroke:2px_black]">Total Control.</span>
            </h2>
            <p className="text-zinc-500 font-bold italic text-xl leading-relaxed mb-14 max-w-lg">
              &ldquo;From component library to AI synthesis, token studio, live editor, and instant export — the entire design engineering workflow lives inside Vibro.&rdquo;
            </p>

            <ul className="dash-feature-list space-y-5">
              {[
                { icon: Layers,    label: "Component Library",    desc: "Browse, search and deploy pre-built UI nodes instantly." },
                { icon: Paintbrush,label: "Design System Studio", desc: "Customize colors, type, spacing, and radius tokens live." },
                { icon: Code2,     label: "Live Component Editor",desc: "Edit any component with real-time canvas and state controls." },
                { icon: FileText,  label: "Export Center",        desc: "One-click prompt, JSON, or CLI export for any stack." },
              ].map((f, i) => (
                <li key={i} className="dash-feature-item flex items-start gap-5 p-5 border border-black/5 bg-white hover:border-black hover:shadow-[5px_5px_0_#C6FF3D] transition-all group cursor-pointer">
                  <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0 group-hover:bg-[#C6FF3D] transition-colors">
                    <f.icon className="w-5 h-5 text-[#C6FF3D] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-black text-sm uppercase tracking-widest">{f.label}</p>
                    <p className="text-zinc-500 text-sm font-bold mt-1 italic">{f.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 ml-auto self-center group-hover:text-black group-hover:translate-x-1 transition-all" />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Dashboard Window */}
          <div className="dash-preview-window" style={{ perspective: "1200px" }}>
            <div className="border-[4px] border-black bg-[#050506] shadow-[20px_20px_0_#C6FF3D] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#ffffff08] bg-[#080809]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <div className="flex-1 mx-4 bg-[#ffffff08] px-3 py-1 text-[9px] font-mono text-zinc-600">app.vibro.dev/dashboard</div>
                <div className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-pulse" />
              </div>

              {/* Sidebar + Content */}
              <div className="flex" style={{ height: "400px" }}>
                {/* Mini sidebar */}
                <div className="w-12 border-r border-[#ffffff08] flex flex-col items-center py-4 gap-4 shrink-0">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-8 h-8 flex items-center justify-center border transition-all ${activeTab === tab.id ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5 text-[#C6FF3D]" : "border-transparent text-zinc-700 hover:text-zinc-400"}`}
                    >
                      <tab.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Tab content area */}
                <div className="flex-1 overflow-hidden text-white">
                  {/* Tab bar */}
                  <div className="flex border-b border-[#ffffff08]">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? "border-[#C6FF3D] text-[#C6FF3D] bg-[#C6FF3D]/5" : "border-transparent text-zinc-700 hover:text-zinc-400"}`}
                      >
                        <tab.icon className="w-3 h-3" />
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
            <div className="absolute -bottom-4 -right-4 bg-[#C6FF3D] border-[3px] border-black px-4 py-2 shadow-[5px_5px_0_#000]">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">LIVE PREVIEW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
