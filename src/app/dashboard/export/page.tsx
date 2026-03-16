"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, FileText, Brain, Terminal, ArrowRight, Copy, CheckCircle2, Zap, Sun, Moon, Hexagon, Layers, Paintbrush, Code2, CreditCard, Settings2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";

const EXPORT_MODES = [
  {
    id: "prompt",
    icon: FileText,
    title: "Prompt Export",
    tag: "AI-Ready",
    description: "Copy a structured, detailed design system prompt optimized for ChatGPT, Claude, Gemini, or any AI tool to recreate your system from scratch.",
    features: ["Full color token map", "Typography scale", "Component descriptions", "Spacing system"],
    cta: "Copy Prompt",
    accent: "#C6FF3D",
    sampleOutput: `VIBRO DESIGN SYSTEM PROMPT\n\nColors:\n- Primary: #C6FF3D (Neon Accent)\n- Background: #050506 (Deep Dark)\n- Surface: #0d0d0f (Elevated)\n- Text: #ffffff / #71717a\n\nTypography:\n- Display: 48px / Black 900\n- H1: 36px / ExtraBold 800\n- Body: 16px / Medium 500\n\nSpacing Base: 4px scale...`
  },
  {
    id: "ai-context",
    icon: Brain,
    title: "AI Context File",
    tag: "JSON Export",
    description: "Export a structured JSON context file with all design tokens, component metadata, and system rules, ready to feed into other AI-powered tools.",
    features: ["Design token JSON", "Component manifest", "Theme definitions", "Responsive breakpoints"],
    cta: "Export JSON",
    accent: "#818cf8",
    sampleOutput: `{\n  "system": "vibro",\n  "tokens": {\n    "colors": {\n      "primary": "#C6FF3D",\n      "background": "#050506"\n    },\n    "typography": {\n      "fontFamily": "Inter",\n      "scale": [12,14,16,20,24,32,48]\n    }\n  }\n}`
  },
  {
    id: "cli",
    icon: Terminal,
    title: "CLI Install",
    tag: "Direct Deploy",
    description: "Install the generated design system directly into your project using the Vibro CLI. Outputs tokens as CSS variables, Tailwind config, or design token JSON.",
    features: ["CSS variables output", "Tailwind config gen", "Token file structure", "Auto-import setup"],
    cta: "Copy CLI Command",
    accent: "#34d399",
    sampleOutput: `npx vibro-cli install --system "my-system" \\\n  --output ./src/design-system \\\n  --format css-vars,tailwind \\\n  --theme dark`
  }
];

function DarkExport({ copied, handleCopy, handleLogout, toggleTheme }: any) {
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-[#ffffff0a] bg-[#050506] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-black border border-[#ffffff15] rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D]/50 transition-all shadow-[0_0_20px_rgba(198,255,61,0.1)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export", active: true },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5" : "border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05]"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-[#C6FF3D]" : "text-zinc-600 group-hover:text-[#C6FF3D]"}`} />
              <span className="absolute left-[75px] bg-black border border-[#ffffff15] text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] rounded-sm group-hover:translate-x-0 translate-x-[-10px] transition-all">
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

      {/* Main */}
      <main className="flex-1 ml-[64px] px-10 pt-10 pb-20">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-1">
              <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-[#C6FF3D]">Export Center</span>
            </p>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 mb-3">Export Center</h1>
            <p className="text-zinc-600 text-sm font-medium max-w-md">Choose how to take your Vibro design system into the world — as a prompt, context file, or direct project install.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {EXPORT_MODES.map((mode) => (
              <div key={mode.id} className="border border-[#ffffff08] bg-[#080809] flex flex-col group hover:border-[#ffffff15] transition-all">
                <div className="p-6 border-b border-[#ffffff06]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 border flex items-center justify-center bg-opacity-10" style={{ borderColor: mode.accent + "30", backgroundColor: mode.accent + "10" }}>
                      <mode.icon className="w-5 h-5" style={{ color: mode.accent }} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 border bg-transparent" style={{ color: mode.accent, borderColor: mode.accent + "30" }}>{mode.tag}</span>
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">{mode.title}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{mode.description}</p>
                </div>
                <div className="p-6 border-b border-[#ffffff06] flex-1">
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-3">Includes</p>
                  <ul className="space-y-2">
                    {mode.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[10px] font-medium text-zinc-500">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: mode.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-b border-[#ffffff06] bg-black/30">
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Preview</p>
                  <pre className="text-[9px] font-mono text-zinc-600 whitespace-pre-wrap leading-relaxed line-clamp-4">{mode.sampleOutput}</pre>
                </div>
                <div className="p-4">
                  <button onClick={() => handleCopy(mode.id, mode.sampleOutput)} className="w-full h-10 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all" style={{ backgroundColor: copied === mode.id ? "#22c55e" : mode.accent, color: "#000" }}>
                    {copied === mode.id ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> {mode.cta}</>}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-[#ffffff06] bg-[#080809] p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Continue Building</p>
              <p className="text-[11px] text-zinc-600">Go back to the editor to refine your components before export.</p>
            </div>
            <Link href="/dashboard/editor" className="flex items-center gap-2 h-10 px-6 border border-[#ffffff10] text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:border-[#C6FF3D]/40 hover:text-white transition-all">
              Open Editor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function LightExport({ copied, handleCopy, handleLogout, toggleTheme }: any) {
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-black/5 bg-[#F6F7F3] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-white border border-black/5 rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D] transition-all shadow-[0_0_20px_rgba(198,255,61,0.3)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain filter invert" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export", active: true },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/50 bg-[#C6FF3D]/10 text-black" : "border-transparent hover:border-black/5 hover:bg-black/5"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-zinc-400 group-hover:text-black"}`} />
              <span className="absolute left-[75px] bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] rounded-sm group-hover:translate-x-0 translate-x-[-10px] transition-all">
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

      {/* Main */}
      <main className="flex-1 ml-[64px] px-10 pt-10 pb-20">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">
              <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-black border-b-2 border-[#C6FF3D]">Export Center</span>
            </p>
            <h1 className="text-2xl font-black text-black tracking-tight mt-1 mb-3">Export Center</h1>
            <p className="text-zinc-500 text-sm font-medium max-w-md">Choose how to take your Vibro design system into the world — as a prompt, context file, or direct project install.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {EXPORT_MODES.map((mode) => (
              <div key={mode.id} className="border border-black/5 bg-white flex flex-col group hover:border-[#1A1A1A] hover:shadow-[5px_5px_0_#1A1A1A] transition-all shadow-sm">
                <div className="p-6 border-b border-black/5 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 border flex items-center justify-center shadow-inner" style={{ borderColor: mode.accent === '#C6FF3D' ? '#00000020' : mode.accent + "50", backgroundColor: mode.accent === '#C6FF3D' ? mode.accent + "50" : mode.accent + "10" }}>
                      <mode.icon className="w-5 h-5" style={{ color: mode.accent === '#C6FF3D' ? '#000' : mode.accent }} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 border shadow-sm" style={{ color: mode.accent === '#C6FF3D' ? '#000' : mode.accent, borderColor: mode.accent === '#C6FF3D' ? '#1a1a1a' : mode.accent + "30", backgroundColor: mode.accent === '#C6FF3D' ? mode.accent : 'transparent' }}>{mode.tag}</span>
                  </div>
                  <h3 className="text-sm font-black text-black uppercase tracking-widest mb-2">{mode.title}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{mode.description}</p>
                </div>
                <div className="p-6 border-b border-black/5 bg-white flex-1">
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Includes</p>
                  <ul className="space-y-2">
                    {mode.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[10px] font-medium text-zinc-500">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: mode.accent === '#C6FF3D' ? '#000' : mode.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-b border-black/5 bg-zinc-50 border-t border-black/5 shadow-inner">
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">Preview</p>
                  <pre className="text-[9px] font-mono text-zinc-500 whitespace-pre-wrap leading-relaxed line-clamp-4">{mode.sampleOutput}</pre>
                </div>
                <div className="p-4 bg-white">
                  <button onClick={() => handleCopy(mode.id, mode.sampleOutput)} className="w-full h-10 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_4px_0_transparent] hover:-translate-y-0.5" style={{ backgroundColor: copied === mode.id ? "#22c55e" : (mode.accent === '#C6FF3D' ? '#000' : mode.accent), color: copied === mode.id ? '#000' : '#fff' }}>
                    {copied === mode.id ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> {mode.cta}</>}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-black/5 bg-white shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Continue Building</p>
              <p className="text-[11px] text-zinc-500">Go back to the editor to refine your components before export.</p>
            </div>
            <Link href="/dashboard/editor" className="flex items-center gap-2 h-10 px-6 border border-black/10 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all shadow-[3px_3px_0_transparent] hover:shadow-[3px_3px_0_#C6FF3D]">
              Open Editor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ExportPageContent() {
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const props = {
    copied, handleCopy, handleLogout, toggleTheme
  };

  return theme === "light" ? <LightExport {...props} /> : <DarkExport {...props} />;
}

export default function ExportRoute() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#050506]"><Zap className="w-8 h-8 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" /></div>}>
      <ExportPageContent />
    </Suspense>
  );
}
