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
  Crown,
  LayoutGrid,
  Sparkles
} from "lucide-react";

import Image from "next/image";

const menuItems = [
  { 
    href: "/dashboard/projects", 
    label: "Projects", 
    icon: LayoutGrid, 
    action: <Plus className="w-3.5 h-3.5" /> 
  },
  { 
    href: "/dashboard/discover", 
    label: "UI Library", 
    icon: Search 
  },
  { 
    href: "/dashboard/workstation", 
    label: "AI Architect", 
    icon: Sparkles, 
    badge: "v2" 
  },
  { 
    href: "/dashboard/editor", 
    label: "Editor", 
    icon: Code2 
  },
  { 
    href: "/dashboard/docs", 
    label: "Documentation", 
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
      className={`fixed left-0 top-0 h-screen transition-all duration-500 z-[60] flex flex-col border-r shadow-sm ${
        isCollapsed ? "w-[76px]" : "w-64"
      } ${
        "bg-white dark:bg-[#0A0A0A] border-[#E5E5E3] dark:border-white/5"
      }`}
    >
      {/* ── Logo Section ── */}
      <div className={`h-24 flex items-center ${isCollapsed ? 'justify-center' : 'px-7 gap-3'}`}>
        <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-zinc-900 border border-white/5 rounded-xl shadow-lg group-hover:rotate-6 transition-transform overflow-hidden p-1.5">
             <Image 
                src="/logo.png" 
                alt="Vibro Logo" 
                width={28} 
                height={28} 
                className="object-contain"
              />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[16px] font-bold tracking-tight text-zinc-900 dark:text-white leading-none">Vibro</span>
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 mt-1.5 uppercase tracking-widest">Architect</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Dashboard Navigation ── */}
      <nav className={`flex-1 px-4 space-y-1.5 mt-2`}>
        {!isCollapsed && (
          <p className="px-3 mb-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Platform</p>
        )}
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl transition-all duration-300 group relative ${
                isCollapsed ? "justify-center w-12 h-12 mx-auto" : "justify-between px-3.5 py-3"
              } ${
                active 
                  ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'gap-3.5'}`}>
                <Icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
                {!isCollapsed && <span className="text-[14px] font-semibold tracking-tight">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  {item.badge && <span className="text-[9px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">{item.badge}</span>}
                  {item.action && <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800'}`}>{item.action}</div>}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className={`p-5 border-t border-zinc-100 dark:border-white/5`}>
         <div className={`flex items-center transition-all bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-white/5 p-2 ${isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-3 px-3'}`}>
            <div className="relative">
               <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm">
                  {user?.email ? (
                    <span className="text-sm font-black text-zinc-950 dark:text-white">{user.email.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-4 h-4 text-zinc-400" />
                  )}
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0A0A0A] rounded-full shadow-sm" />
            </div>
            {!isCollapsed && (
               <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-900 dark:text-white truncate leading-none capitalize">{user?.email?.split('@')[0] || "Architect"}</p>
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Free Plan</p>
               </div>
            )}
            {!isCollapsed && <Settings className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" />}
         </div>
         
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={`mt-5 w-full flex items-center justify-center p-2.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all order-first ${isCollapsed ? 'rotate-180' : ''}`}
         >
            <ChevronLeft className="w-4 h-4" />
         </button>
      </div>

    </aside>
  );
}
