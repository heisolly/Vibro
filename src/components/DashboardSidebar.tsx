"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Layers, 
  Box, 
  Layout, 
  Palette, 
  Users, 
  Settings,
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function DashboardSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  };

  const menuSections = [
    { href: "/dashboard", label: "Projects", icon: Layers },
    { href: "/dashboard/components", label: "Components", icon: Box },
    { href: "/dashboard/templates", label: "Templates", icon: Layout },
    { href: "/dashboard/brand", label: "Brand Kit", icon: Palette },
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white flex flex-col z-[60] border-r border-[#EEEEEE] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* ── Brand Section ── */}
      <div className="h-20 flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all">
          <div className="w-8 h-8 flex-shrink-0">
            <Image src="/logo.png" alt="Vibro" width={32} height={32} className="object-contain" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold tracking-tight text-zinc-900">Vibro Studio</span>
          )}
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuSections.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                active 
                  ? "bg-zinc-100 text-zinc-950 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-900'}`} />
              {!isCollapsed && <span>{item.label}</span>}
              {!isCollapsed && active && <div className="ml-auto w-1 h-1 rounded-full bg-zinc-950" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="p-4 space-y-4">
        
        {/* Usage Stats (Simplified) */}
        {!isCollapsed && (
          <div className="px-2 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              <span>Usage</span>
              <span>12%</span>
            </div>
            <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-900 w-[12%] rounded-full" />
            </div>
          </div>
        )}

        {/* User Account */}
        <div className={`p-2 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center gap-3 ${isCollapsed ? 'justify-center px-0' : ''}`}>
           <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-xs ring-4 ring-white shadow-sm shrink-0">
              {user?.email?.[0].toUpperCase() || "V"}
           </div>
           {!isCollapsed && (
             <div className="flex-1 min-w-0 pr-1">
               <p className="text-[12px] font-bold text-zinc-900 truncate">
                 {user?.email?.split('@')[0] || "Architect"}
               </p>
               <button onClick={handleLogout} className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium">
                 Sign out
               </button>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
}
