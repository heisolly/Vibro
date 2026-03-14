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
      className={`fixed left-0 top-0 h-screen bg-white transition-all duration-500 z-[60] flex flex-col border-r border-[#E5E5E3] ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* ── Logo Section ── */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-6 gap-3'}`}>
        <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95">
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-zinc-900 rounded-lg shadow-sm">
             <Zap className="w-5 h-5 text-[#b8f724]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-zinc-900 leading-none">Vibro</span>
              <span className="text-[10px] font-medium text-zinc-400 mt-1 uppercase tracking-tight">AI Studio</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Dashboard Navigation ── */}
      <nav className={`flex-1 px-3 space-y-1 mt-4`}>
        {!isCollapsed && (
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Main Menu</p>
        )}
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                isCollapsed ? "justify-center w-11 h-11 mx-auto" : "justify-between px-3 py-2.5"
              } ${
                active 
                  ? "bg-zinc-100 text-zinc-900" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                <Icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                {!isCollapsed && <span className="text-[13.5px] font-medium tracking-tight">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  {item.badge && <span className="text-[9px] bg-zinc-900 text-white px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">{item.badge}</span>}
                  {item.action && <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${active ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200'}`}>{item.action}</div>}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className={`p-4 border-t border-zinc-100`}>
         <div className={`flex items-center transition-all bg-zinc-50 rounded-2xl border border-zinc-100 p-2 ${isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-3 px-3'}`}>
            <div className="relative">
               <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center overflow-hidden shadow-sm">
                  {user?.email ? (
                    <span className="text-xs font-bold text-zinc-950">{user.email.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-4 h-4 text-zinc-400" />
                  )}
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            {!isCollapsed && (
               <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-zinc-900 truncate leading-none capitalize">{user?.email?.split('@')[0] || "User Agent"}</p>
                  <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-tight mt-1">Free Tier</p>
               </div>
            )}
            {!isCollapsed && <Settings className="w-3.5 h-3.5 text-zinc-300 hover:text-zinc-900 transition-colors cursor-pointer" />}
         </div>
         
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={`mt-4 w-full flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all ${isCollapsed ? 'rotate-180' : ''}`}
         >
            <ChevronLeft className="w-4 h-4" />
         </button>
      </div>

    </aside>
  );
}
