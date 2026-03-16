"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { LogOut, Monitor, Tablet, Smartphone, Palette, Type, Ruler, Component, Zap, ExternalLink, Sun, Moon, Hexagon, Layers, Paintbrush, Code2, CreditCard, Settings2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";

const VIEWPORT_OPTIONS = [
  { id: "desktop", icon: Monitor, label: "Desktop", width: "100%" },
  { id: "tablet", icon: Tablet, label: "Tablet", width: "768px" },
  { id: "mobile", icon: Smartphone, label: "Mobile", width: "375px" },
];
const CONTROL_TABS = [
  { id: "style", icon: Palette, label: "Style" },
  { id: "layout", icon: Ruler, label: "Layout" },
  { id: "typography", icon: Type, label: "Typography" },
  { id: "variants", icon: Component, label: "Variants" },
];
const VARIANTS = ["Default", "Hover", "Active", "Disabled", "Focus"];

function Field({ label, type, value, onChange, min, max, options, isLight }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-[9px] font-black uppercase tracking-widest ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>{label}</p>
        <span className={`text-[9px] font-mono ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{value}</span>
      </div>
      {type === "text" && <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full text-sm font-mono px-3 py-2 focus:outline-none transition-all ${isLight ? "bg-white border border-black/5 text-black focus:border-[#C6FF3D] focus:shadow-[0_2px_0_#C6FF3D]" : "bg-[#080809] border border-[#ffffff0a] text-white focus:border-[#C6FF3D]/40"}`} />}
      {type === "range" && <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} className="w-full accent-[#C6FF3D]" />}
      {type === "select" && <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full text-sm px-3 py-2 focus:outline-none transition-all ${isLight ? "bg-white border border-black/5 text-black focus:border-black/20" : "bg-[#080809] border border-[#ffffff0a] text-white"}`}>{options.map((o: string) => <option key={o} value={o}>{o}</option>)}</select>}
    </div>
  );
}

function DarkEditor({ styles, setStyles, viewport, setViewport, activeTab, setActiveTab, activeVariant, setActiveVariant, componentName, handleLogout, toggleTheme }: any) {
  const curViewport = VIEWPORT_OPTIONS.find(v => v.id === viewport);
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-[#ffffff0a] bg-[#050506] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-black border border-[#ffffff15] rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D]/50 transition-all shadow-[0_0_20px_rgba(198,255,61,0.1)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard", active: false },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item: any, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5" : "border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05]"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-[#C6FF3D]" : "text-zinc-600 group-hover:text-[#C6FF3D]"}`} />
              <span className="absolute left-[75px] bg-black border border-[#ffffff15] text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] translate-x-[-10px] group-hover:translate-x-0 transition-all">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <button onClick={toggleTheme} title="Switch to Light Mode" className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] transition-all text-zinc-600 hover:text-[#C6FF3D]">
            <Sun className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <div className="flex flex-1 ml-[64px] min-h-screen">
        <div className="flex-1 flex flex-col border-r border-[#ffffff0a]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff0a]">
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
              <button className="font-sans tracking-wider transition-all" style={{ backgroundColor: styles.bgColor, color: styles.textColor, borderRadius: `${styles.borderRadius}px`, padding: `${parseInt(styles.padding)/2}px ${styles.padding}px`, fontSize: `${styles.fontSize}px`, fontWeight: styles.fontWeight, boxShadow: styles.shadow === "neon" ? "0 0 30px rgba(198,255,61,0.3)" : styles.shadow === "heavy" ? "0 8px 40px rgba(0,0,0,0.8)" : "none" }}>
                {componentName}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-6 py-3 border-t border-[#ffffff0a]">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mr-3">State:</p>
            {VARIANTS.map(v => (
              <button key={v} onClick={() => setActiveVariant(v)} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${activeVariant === v ? "bg-[#C6FF3D] text-black" : "border border-[#ffffff08] text-zinc-600 hover:text-white"}`}>{v}</button>
            ))}
          </div>
        </div>

        <aside className="w-[280px] shrink-0 flex flex-col">
          <div className="flex border-b border-[#ffffff0a]">
            {CONTROL_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all border-b-2 ${activeTab === tab.id ? "border-[#C6FF3D] text-[#C6FF3D]" : "border-transparent text-zinc-600 hover:text-zinc-400"}`}>
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
                  <button key={v} onClick={() => setActiveVariant(v)} className={`w-full flex items-center justify-between px-4 py-3 transition-all ${activeVariant === v ? "bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-[#C6FF3D]" : "border border-[#ffffff06] text-zinc-500 hover:border-[#ffffff12]"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
                    {activeVariant === v && <Zap className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-5 border-t border-[#ffffff0a]">
            <button className="w-full h-10 bg-[#C6FF3D] text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Save Component</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LightEditor({ styles, setStyles, viewport, setViewport, activeTab, setActiveTab, activeVariant, setActiveVariant, componentName, handleLogout, toggleTheme }: any) {
  const curViewport = VIEWPORT_OPTIONS.find(v => v.id === viewport);
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-black/5 bg-[#F6F7F3] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-white border border-black/5 rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D] transition-all shadow-[0_0_20px_rgba(198,255,61,0.3)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain filter invert" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard", active: false },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item: any, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/50 bg-[#C6FF3D]/10 text-black" : "border-transparent hover:border-black/5 hover:bg-black/5"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-zinc-400 group-hover:text-black"}`} />
              <span className="absolute left-[75px] bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] translate-x-[-10px] group-hover:translate-x-0 transition-all">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <button onClick={toggleTheme} title="Switch to Dark Mode" className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-black/5 hover:bg-black/5 transition-all text-zinc-400 hover:text-black">
            <Moon className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <div className="flex flex-1 ml-[64px] min-h-screen">
        <div className="flex-1 flex flex-col border-r border-black/5 bg-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
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
