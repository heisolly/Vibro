"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Sun, Moon, Hexagon, Layers, Paintbrush, Code2, CreditCard, Settings2, Shield, User, Bell } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";

function DarkSettings({ handleLogout, toggleTheme }: any) {
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
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings", active: true },
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

      <main className="flex-1 ml-[64px] px-10 pt-10 pb-20">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-12">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-1">
              <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-[#C6FF3D]">Settings</span>
            </p>
            <h1 className="text-3xl font-black text-white tracking-tight mt-2 mb-2">Account Settings</h1>
            <p className="text-zinc-500 text-sm font-medium">Manage your personal details, preferences, and workspace configuration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
            {/* Setting Tabs (Visual Only for now) */}
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 px-4 py-3 bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/20 text-xs font-black uppercase tracking-widest">
                <User className="w-4 h-4" /> Profile Info
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] text-xs font-black uppercase tracking-widest transition-all">
                <Shield className="w-4 h-4" /> Security
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] text-xs font-black uppercase tracking-widest transition-all">
                <Bell className="w-4 h-4" /> Notifications
              </button>
            </div>

            <div className="space-y-8">
              {/* Profile Block */}
              <div className="border border-[#ffffff10] bg-[#080809] p-8">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-[#ffffff10] pb-4">Personal Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-[#050506] border border-[#ffffff15] p-3 text-sm text-white focus:outline-none focus:border-[#C6FF3D]/50 transition-colors placeholder:text-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Email Address</label>
                    <input type="email" placeholder="john@example.com" disabled className="w-full bg-[#ffffff05] border border-[#ffffff10] p-3 text-sm text-zinc-500 cursor-not-allowed" />
                    <p className="text-[10px] text-zinc-600 mt-2">Email changes must be performed through the security tab.</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-[#C6FF3D] text-black font-black uppercase tracking-widest text-[10px] px-6 py-3 hover:bg-white transition-colors shadow-[0_0_15px_rgba(198,255,61,0.2)]">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Preferences Block */}
              <div className="border border-[#ffffff10] bg-[#080809] p-8">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-[#ffffff10] pb-4">Display Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white">App Theme</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Switch between Light and Dark mode globally.</p>
                    </div>
                    <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 border border-[#ffffff20] bg-black text-xs font-black uppercase tracking-widest hover:border-[#C6FF3D]/50 hover:text-[#C6FF3D] transition-all">
                      <Sun className="w-3.5 h-3.5" /> Toggle Theme
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function LightSettings({ handleLogout, toggleTheme }: any) {
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
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings", active: true },
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

      <main className="flex-1 ml-[64px] px-10 pt-10 pb-20">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-12">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">
              <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-black font-bold border-b-2 border-[#C6FF3D]">Settings</span>
            </p>
            <h1 className="text-3xl font-black text-black tracking-tight mt-2 mb-2">Account Settings</h1>
            <p className="text-zinc-600 text-sm font-medium">Manage your personal details, preferences, and workspace configuration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
            {/* Setting Tabs */}
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 px-4 py-3 bg-[#C6FF3D] text-black border border-black shadow-[3px_3px_0_#000] text-xs font-black uppercase tracking-widest transition-all">
                <User className="w-4 h-4" /> Profile Info
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 border border-transparent hover:border-black/5 hover:bg-black/5 text-xs font-black uppercase tracking-widest transition-all">
                <Shield className="w-4 h-4" /> Security
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 border border-transparent hover:border-black/5 hover:bg-black/5 text-xs font-black uppercase tracking-widest transition-all">
                <Bell className="w-4 h-4" /> Notifications
              </button>
            </div>

            <div className="space-y-8">
              {/* Profile Block */}
              <div className="border border-black/10 bg-white p-8 shadow-sm">
                <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 border-b border-black/5 pb-4">Personal Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-[#fbfbfb] border border-black/10 p-3 text-sm text-black focus:outline-none focus:border-black focus:shadow-[3px_3px_0_#C6FF3D] transition-all placeholder:text-zinc-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Email Address</label>
                    <input type="email" placeholder="john@example.com" disabled className="w-full bg-black/5 border border-black/5 p-3 text-sm text-zinc-500 cursor-not-allowed" />
                    <p className="text-[10px] text-zinc-500 mt-2">Email changes must be performed through the security tab.</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-black text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 hover:bg-[#C6FF3D] hover:text-black border border-black shadow-[3px_3px_0_transparent] hover:shadow-[3px_3px_0_#000] transition-all active:translate-y-1 active:shadow-none">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Preferences Block */}
              <div className="border border-black/10 bg-white p-8 shadow-sm">
                <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 border-b border-black/5 pb-4">Display Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-black">App Theme</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Switch between Light and Dark mode globally.</p>
                    </div>
                    <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 border border-black/10 bg-[#fbfbfb] text-xs font-black uppercase tracking-widest hover:border-black hover:bg-[#C6FF3D] transition-all shadow-sm">
                      <Moon className="w-3.5 h-3.5" /> Toggle Theme
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsPageContent() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  if (theme === "light") {
    return <LightSettings handleLogout={handleLogout} toggleTheme={toggleTheme} />;
  }

  return <DarkSettings handleLogout={handleLogout} toggleTheme={toggleTheme} />;
}

export default function SettingsRoute() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#050506]">
        <div className="w-8 h-8 rounded-full border-t border-[#C6FF3D] animate-spin" />
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}
