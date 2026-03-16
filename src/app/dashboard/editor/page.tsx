"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { 
  Monitor, Tablet, Smartphone, ExternalLink, 
  Layers, Layout, Type, Palette, Zap
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "../ThemeProvider";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const VIEWPORT_OPTIONS = [
  { id: "desktop", icon: Monitor, label: "Desktop", width: "100%" },
  { id: "tablet", icon: Tablet, label: "Tablet", width: "768px" },
  { id: "mobile", icon: Smartphone, label: "Mobile", width: "375px" },
];

const CONTROL_TABS = [
  { id: "style", icon: Palette, label: "Style" },
  { id: "layout", icon: Layout, label: "Layout" },
  { id: "typography", icon: Type, label: "Text" },
  { id: "variants", icon: Layers, label: "States" },
];

const VARIANTS = ["Default", "Hover", "Active", "Disabled"];

function Field({ label, type, value, onChange, min, max, options, isLight }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <label className={`text-[8px] font-black uppercase tracking-widest ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>{label}</label>
      {type === "text" && (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full text-[10px] font-bold px-3 py-2 border focus:outline-none transition-all ${isLight ? "bg-white border-black/5 focus:border-[#C6FF3D] text-black" : "bg-black border-[#ffffff0a] focus:border-[#C6FF3D]/40 text-white"}`} />
      )}
      {type === "range" && (
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-1 bg-[#ffffff10] rounded-lg appearance-none cursor-pointer accent-[#C6FF3D]" />
      )}
      {type === "select" && (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full text-[10px] font-bold px-3 py-2 border focus:outline-none transition-all ${isLight ? "bg-white border-black/5 focus:border-[#C6FF3D] text-black" : "bg-black border-[#ffffff0a] focus:border-[#C6FF3D]/40 text-white"}`}>
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  );
}

function DarkEditor({ styles, setStyles, viewport, setViewport, activeTab, setActiveTab, activeVariant, setActiveVariant, componentName }: any) {
  const curViewport = VIEWPORT_OPTIONS.find(v => v.id === viewport);
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <DashboardSidebar />

      <div className="flex flex-1 ml-[64px] min-h-screen">
        <div className="flex-1 flex flex-col border-r border-[#ffffff0a]">
          <DashboardHeader />

          <div className="flex items-center justify-between px-6 py-2 border-b border-[#ffffff0a]">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">
              <Link href="/dashboard" className="hover:text-zinc-400">Dashboard</Link> › <Link href="/dashboard/library" className="hover:text-zinc-400">Library</Link> › <span className="text-[#C6FF3D]">{componentName}</span>
            </p>
            <div className="flex items-center gap-2">
              {VIEWPORT_OPTIONS.map(v => (
                <button key={v.id} onClick={() => setViewport(v.id)} className={`w-8 h-8 flex items-center justify-center transition-all ${viewport === v.id ? "bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D]" : "text-zinc-600 hover:text-zinc-400"}`}><v.icon className="w-4 h-4" /></button>
              ))}
            </div>
            <Link href="/dashboard/export" className="flex items-center gap-2 h-8 px-4 bg-[#C6FF3D] text-black font-black text-[9px] uppercase tracking-widest hover:bg-white transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> Export
            </Link>
          </div>

          <div className="flex-1 bg-[#080808] flex items-center justify-center p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="transition-all duration-300 flex items-center justify-center relative z-10" style={{ width: curViewport?.width, minHeight: "200px" }}>
              <button className="font-sans tracking-wider transition-all" style={{ backgroundColor: styles.bgColor, color: styles.textColor, borderRadius: `${styles.borderRadius}px`, padding: `${parseInt(styles.padding)/2}px ${styles.padding}px`, fontSize: `${styles.fontSize}px`, fontWeight: styles.fontWeight, boxShadow: styles.shadow === "neon" ? "0 0 30px rgba(198,255,61,0.5)" : styles.shadow === "heavy" ? "0 8px 30px rgba(0,0,0,0.2)" : "none" }}>
                {componentName}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-6 py-3 border-t border-[#ffffff0a]">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mr-3">State:</p>
            {VARIANTS.map(v => (
              <button key={v} onClick={() => setActiveVariant(v)} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${activeVariant === v ? "bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30" : "border border-transparent text-zinc-600 hover:text-white hover:border-[#ffffff10]"}`}>{v}</button>
            ))}
          </div>
        </div>

        <aside className="w-[280px] shrink-0 flex flex-col border-l border-[#ffffff0a] bg-[#050506]">
          <div className="flex border-b border-[#ffffff0a]">
            {CONTROL_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all border-b-2 ${activeTab === tab.id ? "border-[#C6FF3D] text-[#C6FF3D] bg-[#C6FF3D]/5" : "border-transparent text-zinc-600 hover:text-white hover:bg-[#ffffff05]"}`}>
                <tab.icon className="w-4 h-4" />
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === "style" && (<>
              <Field label="Background Color" type="text" value={styles.bgColor} onChange={(v: string) => setStyles({...styles, bgColor: v})} />
              <Field label="Text Color" type="text" value={styles.textColor} onChange={(v: string) => setStyles({...styles, textColor: v})} />
              <Field label="Shadow" type="select" value={styles.shadow} onChange={(v: string) => setStyles({...styles, shadow: v})} options={["none","heavy","neon"]} />
            </>)}
            {activeTab === "layout" && (<>
              <Field label="Padding (px)" type="range" value={styles.padding} onChange={(v: string) => setStyles({...styles, padding: v})} min={4} max={64} />
              <Field label="Border Radius (px)" type="range" value={styles.borderRadius} onChange={(v: string) => setStyles({...styles, borderRadius: v})} min={0} max={32} />
            </>)}
            {activeTab === "typography" && (<>
              <Field label="Font Size (px)" type="range" value={styles.fontSize} onChange={(v: string) => setStyles({...styles, fontSize: v})} min={10} max={36} />
              <Field label="Font Weight" type="select" value={styles.fontWeight} onChange={(v: string) => setStyles({...styles, fontWeight: v})} options={["400","500","600","700","800","900"]} />
            </>)}
            {activeTab === "variants" && (
              <div className="space-y-3">
                {VARIANTS.map(v => (
                  <button key={v} onClick={() => setActiveVariant(v)} className={`w-full flex items-center justify-between px-4 py-3 transition-all ${activeVariant === v ? "bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D]" : "border border-[#ffffff0a] bg-black hover:border-[#ffffff20] text-zinc-400 hover:text-white"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
                    {activeVariant === v && <Zap className="w-3 h-3 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-5 border-t border-[#ffffff0a]">
            <button className="w-full h-10 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#C6FF3D] transition-all">Save Component</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LightEditor({ styles, setStyles, viewport, setViewport, activeTab, setActiveTab, activeVariant, setActiveVariant, componentName }: any) {
  const curViewport = VIEWPORT_OPTIONS.find(v => v.id === viewport);
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <DashboardSidebar />

      <div className="flex flex-1 ml-[64px] min-h-screen">
        <div className="flex-1 flex flex-col border-r border-black/5 bg-white">
          <DashboardHeader />

          <div className="flex items-center justify-between px-6 py-2 border-b border-black/5 bg-white">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              <Link href="/dashboard" className="hover:text-black">Dashboard</Link> › <Link href="/dashboard/library" className="hover:text-black">Library</Link> › <span className="text-black border-b-2 border-[#C6FF3D]">{componentName}</span>
            </p>
            <div className="flex items-center gap-2">
              {VIEWPORT_OPTIONS.map(v => (
                <button key={v.id} onClick={() => setViewport(v.id)} className={`w-8 h-8 flex items-center justify-center transition-all ${viewport === v.id ? "bg-[#C6FF3D] border border-transparent shadow-[2px_2px_0_#000] text-black" : "text-zinc-400 hover:text-black hover:bg-black/5"}`}><v.icon className="w-4 h-4" /></button>
              ))}
            </div>
            <Link href="/dashboard/export" className="flex items-center gap-2 h-8 px-4 bg-[#1a1a1a] text-white font-black text-[9px] uppercase tracking-widest hover:bg-[#C6FF3D] hover:text-black transition-all shadow-[3px_3px_0_transparent] hover:shadow-[3px_3px_0_#C6FF3D]">
              <ExternalLink className="w-3.5 h-3.5" /> Export
            </Link>
          </div>

          <div className="flex-1 bg-[#F6F7F3] flex items-center justify-center p-10 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="transition-all duration-300 flex items-center justify-center relative z-10" style={{ width: curViewport?.width, minHeight: "200px" }}>
              <button className="font-sans tracking-wider transition-all" style={{ backgroundColor: styles.bgColor, color: styles.textColor, borderRadius: `${styles.borderRadius}px`, padding: `${parseInt(styles.padding)/2}px ${styles.padding}px`, fontSize: `${styles.fontSize}px`, fontWeight: styles.fontWeight, boxShadow: styles.shadow === "neon" ? "0 0 30px rgba(198,255,61,0.5)" : styles.shadow === "heavy" ? "0 8px 30px rgba(0,0,0,0.2)" : "none" }}>
                {componentName}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-6 py-3 border-t border-black/5 bg-white">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mr-3">State:</p>
            {VARIANTS.map(v => (
              <button key={v} onClick={() => setActiveVariant(v)} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${activeVariant === v ? "bg-[#C6FF3D] text-black shadow-[2px_2px_0_#000]" : "border border-black/5 text-zinc-500 hover:text-black hover:border-black/10"}`}>{v}</button>
            ))}
          </div>
        </div>

        <aside className="w-[280px] shrink-0 flex flex-col bg-[#F6F7F3]">
          <div className="flex border-b border-black/5 bg-white">
            {CONTROL_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all border-b-2 ${activeTab === tab.id ? "border-[#C6FF3D] text-black bg-[#C6FF3D]/10 text-opacity-100 font-bold" : "border-transparent text-zinc-400 hover:text-black hover:bg-black/5"}`}>
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-black" : ""}`} />
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.02)]">
            {activeTab === "style" && (<>
              <Field label="Background Color" type="text" value={styles.bgColor} onChange={(v: string) => setStyles({...styles, bgColor: v})} isLight />
              <Field label="Text Color" type="text" value={styles.textColor} onChange={(v: string) => setStyles({...styles, textColor: v})} isLight />
              <Field label="Shadow" type="select" value={styles.shadow} onChange={(v: string) => setStyles({...styles, shadow: v})} options={["none","heavy","neon"]} isLight />
            </>)}
            {activeTab === "layout" && (<>
              <Field label="Padding (px)" type="range" value={styles.padding} onChange={(v: string) => setStyles({...styles, padding: v})} min={4} max={64} isLight />
              <Field label="Border Radius (px)" type="range" value={styles.borderRadius} onChange={(v: string) => setStyles({...styles, borderRadius: v})} min={0} max={32} isLight />
            </>)}
            {activeTab === "typography" && (<>
              <Field label="Font Size (px)" type="range" value={styles.fontSize} onChange={(v: string) => setStyles({...styles, fontSize: v})} min={10} max={36} isLight />
              <Field label="Font Weight" type="select" value={styles.fontWeight} onChange={(v: string) => setStyles({...styles, fontWeight: v})} options={["400","500","600","700","800","900"]} isLight />
            </>)}
            {activeTab === "variants" && (
              <div className="space-y-3">
                {VARIANTS.map(v => (
                  <button key={v} onClick={() => setActiveVariant(v)} className={`w-full flex items-center justify-between px-4 py-3 transition-all ${activeVariant === v ? "bg-[#C6FF3D] border border-transparent shadow-[3px_3px_0_#000] text-black font-bold" : "border border-black/5 bg-white text-zinc-500 hover:border-black/20 hover:text-black"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
                    {activeVariant === v && <Zap className="w-3 h-3 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-5 border-t border-black/5 bg-white">
            <button className="w-full h-10 bg-[#1A1A1A] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#C6FF3D] hover:text-black transition-all shadow-[0_4px_0_transparent] hover:shadow-[0_4px_0_#C6FF3D] hover:-translate-y-0.5">Save Component</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EditorPageContent() {
  const [viewport, setViewport] = useState("desktop");
  const [activeTab, setActiveTab] = useState("style");
  const [activeVariant, setActiveVariant] = useState("Default");
  const [styles, setStyles] = useState({ bgColor: "#C6FF3D", textColor: "#000000", borderRadius: "0", padding: "16", fontSize: "14", fontWeight: "800", shadow: "none" });
  const searchParams = useSearchParams();
  const componentId = searchParams.get("component") ?? "btn-primary";
  const componentName = componentId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/sign-in"); };

  const props = {
    styles, setStyles, viewport, setViewport, activeTab, setActiveTab, activeVariant, setActiveVariant, componentName, handleLogout, toggleTheme
  };

  return theme === "light" ? <LightEditor {...props} /> : <DarkEditor {...props} />;
}

export default function EditorRoute() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#050506]"><Zap className="w-8 h-8 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" /></div>}>
      <EditorPageContent />
    </Suspense>
  );
}
