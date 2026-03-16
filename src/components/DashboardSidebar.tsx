"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Hexagon, Layers, Paintbrush, Code2, 
  CreditCard, Settings2, Sun, Moon, LogOut 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "@/app/dashboard/ThemeProvider";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const navItems = [
    { icon: Hexagon, label: "New Project", href: "/dashboard" },
    { icon: Layers, label: "Library", href: "/dashboard/library" },
    { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
    { icon: Code2, label: "Export", href: "/dashboard/export" },
    { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing" },
    { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r w-[64px] items-center py-8 transition-colors duration-300 ${
      isDark ? "border-[#ffffff0a] bg-[#050506]" : "border-black/5 bg-[#F6F7F3]"
    }`}>
      {/* Logo */}
      <Link href="/dashboard" className="mb-12 group">
        <div className={`w-10 h-10 border rounded-sm flex items-center justify-center p-2 transition-all ${
          isDark 
            ? "bg-black border-[#ffffff15] group-hover:border-[#C6FF3D]/50 shadow-[0_0_20px_rgba(198,255,61,0.1)]" 
            : "bg-white border-black/5 group-hover:border-[#C6FF3D] shadow-[0_0_20px_rgba(198,255,61,0.3)]"
        }`}>
          <Image 
            src="/logo.png" 
            alt="Vibro" 
            width={24} 
            height={24} 
            className={`object-contain ${!isDark && "filter invert"}`} 
          />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-6">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={i} 
              href={item.href} 
              className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${
                isActive 
                  ? isDark ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5" : "border-[#C6FF3D]/50 bg-[#C6FF3D]/10 text-black" 
                  : "border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05]"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                isActive 
                  ? "text-[#C6FF3D]" 
                  : isDark ? "text-zinc-600 group-hover:text-[#C6FF3D]" : "text-zinc-400 group-hover:text-black"
              }`} />
              
              {/* Tooltip */}
              <span className={`absolute left-[75px] border text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] translate-x-[-10px] group-hover:translate-x-0 ${
                isDark ? "bg-black border-[#ffffff15] text-white" : "bg-white border-black/5 text-black"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pb-4 flex flex-col items-center gap-3 w-full px-2">
        <button 
          onClick={toggleTheme} 
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`w-11 h-11 flex items-center justify-center border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] transition-all ${
            isDark ? "text-zinc-600 hover:text-[#C6FF3D]" : "text-zinc-400 hover:text-black"
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <button 
          onClick={handleLogout} 
          className={`w-11 h-11 flex items-center justify-center transition-all ${
            isDark ? "text-zinc-700 hover:text-red-500" : "text-zinc-400 hover:text-red-500"
          }`}
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* User Badge / "N" Circle */}
        <div className={`mt-2 w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-black cursor-pointer transition-all ${
          isDark 
            ? "bg-black border-[#ffffff15] text-[#ffffff40] hover:text-[#C6FF3D] hover:border-[#C6FF3D]/40" 
            : "bg-white border-black/5 text-zinc-300 hover:text-black hover:border-black/20"
        }`}>
          N
        </div>
      </div>
    </aside>
  );
}
