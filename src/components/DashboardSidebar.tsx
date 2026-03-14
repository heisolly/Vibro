"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Plus, 
  Search, 
  Zap, 
  Layout, 
  Code2, 
  BookOpen, 
  ChevronDown, 
  Layers, 
  Activity,
  User,
  Settings,
  ChevronLeft,
  Crown
} from "lucide-react";

const menuItems = [
  { 
    href: "/dashboard/projects", 
    label: "My Projects", 
    icon: Layout, 
    action: <Plus className="w-3.5 h-3.5" /> 
  },
  { 
    href: "/dashboard/discover", 
    label: "Marketplace", 
    icon: Search 
  },
  { 
    href: "/dashboard/workstation", 
    label: "AI Architect", 
    icon: Zap, 
    badge: "Beta" 
  },
  { 
    href: "/dashboard/editor", 
    label: "Live Editor", 
    icon: Code2 
  },
  { 
    href: "/dashboard/docs", 
    label: "CLI & Docs", 
    icon: BookOpen 
  },
];

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

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white transition-all duration-500 z-[60] flex flex-col border-r border-[#E5E5E3] ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ── Logo Section ── */}
      <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black rounded-xl group-hover:scale-110 transition-transform shadow-xl">
             <Zap className="w-5 h-5 text-[#b8f724]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[14px] font-black italic tracking-tighter text-zinc-900">VIBRO_AI</span>
              <span className="text-[9px] font-black text-[#b8f724] bg-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-widest w-fit">v4.0</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Workspace Selector ── */}
      <div className={`px-4 pb-6 flex ${isCollapsed ? 'justify-center' : ''}`}>
        <button className={`flex items-center transition-all group border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-900 ${
          isCollapsed 
            ? "w-12 h-12 rounded-2xl justify-center" 
            : "w-full justify-between p-3 rounded-2xl shadow-sm"
        }`}>
           <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'} overflow-hidden`}>
              <div className={`rounded-xl bg-[#b8f724] border-2 border-black flex-shrink-0 flex items-center justify-center text-black font-black text-xs ${
                isCollapsed ? "w-9 h-9" : "w-10 h-10"
              }`}>
                 {user?.email?.charAt(0).toUpperCase() || "V"}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col items-start min-w-0">
                   <p className="text-[12px] font-black text-zinc-900 truncate leading-none uppercase tracking-tighter">Main_Space</p>
                   <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Personal_ID</p>
                </div>
              )}
           </div>
           {!isCollapsed && (
             <ChevronDown className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
           )}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className={`flex-1 px-4 space-y-1.5 mt-4`}>
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-2xl transition-all duration-300 group relative ${
                isCollapsed ? "justify-center w-12 h-12 mx-auto" : "justify-between px-4 py-3.5"
              } ${
                active 
                  ? "bg-zinc-900 text-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] scale-[1.02]" 
                  : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'gap-4'}`}>
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-[#b8f724]' : 'group-hover:text-zinc-900'}`} />
                {!isCollapsed && <span className="text-[13px] font-black uppercase tracking-tight">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  {item.badge && <span className="text-[9px] bg-[#b8f724] text-black px-1.5 py-0.5 rounded font-black uppercase tracking-tighter shadow-sm">{item.badge}</span>}
                  {item.action && <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-white/10 text-[#b8f724]' : 'bg-zinc-100 group-hover:bg-zinc-200 text-zinc-400'}`}>{item.action}</div>}
                </div>
              )}
              {isCollapsed && active && (
                <div className="absolute -left-1 w-2 h-6 bg-[#b8f724] rounded-full shadow-[0_0_15px_#b8f724]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Upgrade Card ── */}
      {!isCollapsed && (
        <div className="p-6">
          <div className="p-6 rounded-[32px] bg-zinc-50 border border-zinc-100 text-center space-y-4 relative overflow-hidden group hover:border-[#b8f724] transition-all">
             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Crown className="w-12 h-12 text-[#b8f724]" />
             </div>
             <div className="space-y-1 relative z-10">
                <p className="text-[12px] font-black text-zinc-900 uppercase tracking-tight">Expand_Capacity</p>
                <p className="text-[10px] text-zinc-400 leading-tight font-medium uppercase tracking-widest">Upgrade to Cloud +</p>
             </div>
             <button className="w-full py-3 bg-white border border-zinc-200 text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-[#b8f724] transition-all shadow-sm">
                Get_Pro
             </button>
          </div>
        </div>
      )}

      {/* ── Bottom Section: User / Settings ── */}
      <div className={`p-4 border-t border-zinc-100`}>
         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`}>
            <div className="relative">
               <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-zinc-400" />
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#b8f724] border-2 border-white rounded-full" />
            </div>
            {!isCollapsed && (
               <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-zinc-900 truncate uppercase tracking-tighter">{user?.email?.split('@')[0] || "User_Agent"}</p>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Online</p>
               </div>
            )}
            {!isCollapsed && <Settings className="w-4 h-4 text-zinc-300 hover:text-zinc-900 transition-colors cursor-pointer" />}
         </div>
      </div>

      {/* ── Toggle Handle ── */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-[1px] top-0 bottom-0 w-[2px] bg-zinc-50 hover:bg-[#b8f724] transition-colors cursor-col-resize group flex items-start pt-[200px]"
      >
         <div className="w-5 h-12 -ml-2.5 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 opacity-0 group-hover:opacity-100 transition-all translate-x-1 shadow-lg">
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
         </div>
      </button>

    </aside>
  );
}
