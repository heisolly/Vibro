"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Search, 
  Code2, 
  BookOpen, 
  User,
  Settings,
  ChevronLeft,
  Crown,
  LayoutGrid,
  Sparkles,
  Monitor,
  HelpCircle,
  LogOut,
  Zap
} from "lucide-react";

import Image from "next/image";

const menuItems = [
  { href: "/dashboard/projects", label: "Projects", icon: LayoutGrid },
  { href: "/dashboard/discover", label: "UI Library", icon: Search },
  { href: "/dashboard/workstation", label: "AI Architect", icon: Sparkles, badge: "v2" },
  { href: "/dashboard/editor", label: "Editor", icon: Code2 },
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[60] flex flex-col border-r bg-white/80 dark:bg-[#030303]/80 backdrop-blur-3xl border-zinc-100 dark:border-white/[0.03] shadow-[4px_0_32px_rgba(0,0,0,0.01)] ${
        isCollapsed ? "w-[96px]" : "w-[280px]"
      }`}
    >
      {/* ── Brand Section ── */}
      <div className={`h-24 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'px-8'}`}>
        <Link href="/" className="flex items-center gap-4 active:scale-95 transition-all group">
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-zinc-950 dark:bg-white rounded-[16px] shadow-2xl overflow-hidden p-2 transition-transform group-hover:scale-110 group-active:scale-90">
             <Image 
                src="/logo.png" 
                alt="Vibro" 
                width={28} 
                height={28} 
                className="object-contain invert dark:invert-0"
              />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-zinc-950 dark:text-white leading-none">Vibro</span>
              <span className="text-[10px] font-black text-[#b8f724] mt-1.5 uppercase tracking-[0.3em] italic">Architect</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Navigation Hub ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-6">
         
         <nav className="px-4 space-y-2">
            {!isCollapsed && (
               <p className="px-6 mb-5 text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.4em] leading-none">Platform</p>
            )}
            {menuItems.map((item) => {
               const active = pathname === item.href;
               const Icon = item.icon;
               return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center group transition-all duration-500 rounded-[24px] ${
                      isCollapsed ? "justify-center h-16 w-16 mx-auto" : "px-6 py-4"
                    } ${
                      active 
                        ? "bg-[#b8f724] text-zinc-950 shadow-[0_20px_40px_rgba(184,247,36,0.2)]" 
                        : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50/80 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                     <div className={`flex items-center ${isCollapsed ? '' : 'gap-5'}`}>
                        <Icon className={`w-5 h-5 transition-all duration-500 ${active ? 'stroke-[2.5px] scale-110' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`} />
                        {!isCollapsed && <span className="text-[15px] font-black tracking-tight">{item.label}</span>}
                     </div>

                     {!isCollapsed && (
                       <div className="ml-auto flex items-center gap-3">
                          {item.badge && (
                            <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${active ? 'bg-zinc-950/10 text-zinc-950' : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-600'}`}>
                              {item.badge}
                            </span>
                          )}
                          {active && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950/60 shadow-[0_0_8px_rgba(0,0,0,0.2)]" />}
                       </div>
                     )}

                     {isCollapsed && (
                        <div className="absolute left-[110%] px-4 py-2 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 translate-x-[-12px] pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all z-[100] whitespace-nowrap shadow-2xl border border-white/10">
                           {item.label}
                        </div>
                     )}
                  </Link>
               );
            })}
         </nav>

         <nav className="px-4 mt-12 space-y-2">
            {!isCollapsed && (
               <p className="px-6 mb-5 text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.4em] leading-none">Connect</p>
            )}
            {[
               { href: "/dashboard/help", label: "Help Center", icon: HelpCircle },
               { href: "/dashboard/docs", label: "Documentation", icon: BookOpen }
            ].map((item) => (
               <Link
                 key={item.href}
                 href={item.href}
                 className={`flex items-center group transition-all duration-500 rounded-[24px] ${
                   isCollapsed ? "justify-center h-16 w-16 mx-auto" : "px-6 py-4"
                 } text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50/80 dark:hover:bg-white/[0.03]`}
               >
                  <div className={`flex items-center ${isCollapsed ? '' : 'gap-5'}`}>
                     <item.icon className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                     {!isCollapsed && <span className="text-[15px] font-black tracking-tight">{item.label}</span>}
                  </div>
               </Link>
            ))}
         </nav>
      </div>

      {/* ── Advanced Utility Footer ── */}
      <div className="p-6 space-y-6">
         
         {/* User Intelligence Card */}
         <div className={`relative flex items-center transition-all bg-zinc-50/80 dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-white/[0.04] p-3 ${isCollapsed ? 'justify-center w-16 h-16 mx-auto' : 'px-5 gap-5'}`}>
            <div className="relative shrink-0">
               <div className="w-11 h-11 rounded-[16px] bg-white dark:bg-zinc-800 border border-zinc-200/50 dark:border-white/10 flex items-center justify-center text-zinc-900 dark:text-white font-black text-sm shadow-sm overflow-hidden group/avatar">
                  {user?.email ? (
                    <span className="group-hover/avatar:scale-125 transition-transform">{user.email.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-5 h-5 opacity-40" />
                  )}
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#b8f724] border-[3px] border-white dark:border-[#030303] rounded-full shadow-sm" />
            </div>
            {!isCollapsed && (
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-zinc-950 dark:text-white truncate leading-none mb-2 capitalize">{user?.email?.split('@')[0] || "Architect"}</p>
                  <div className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-[#b8f724] fill-[#b8f724]/10" />
                    <span className="text-[10px] font-black text-[#b8f724] uppercase tracking-widest opacity-80">Free Matrix</span>
                  </div>
               </div>
            )}
            {!isCollapsed && (
               <button 
                onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-zinc-300 dark:text-zinc-600 transition-all group/logout"
               >
                  <LogOut className="w-4 h-4 group-hover/logout:-translate-x-0.5 transition-transform" />
               </button>
            )}
         </div>

         {/* Core Interaction Controls */}
         <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`flex-1 flex items-center justify-center p-4 rounded-[24px] text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all active:scale-95 shadow-sm border border-transparent hover:border-zinc-200 dark:hover:border-white/5 ${isCollapsed ? 'rotate-180' : ''}`}
            >
               <ChevronLeft className="w-6 h-6" />
            </button>
            {!isCollapsed && (
               <div className="flex bg-zinc-50 dark:bg-zinc-900/80 p-1.5 rounded-[24px] border border-zinc-100 dark:border-white/5 shadow-inner">
                  <button className="w-9 h-9 rounded-[18px] bg-white dark:bg-zinc-800 flex items-center justify-center shadow-xl text-zinc-950 dark:text-white border border-zinc-100 dark:border-white/10 active:scale-90 transition-transform"><Monitor className="w-4 h-4" /></button>
                  <button className="w-9 h-9 rounded-[18px] flex items-center justify-center text-zinc-300 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-white/5 transition-all"><Zap className="w-4 h-4" /></button>
               </div>
            )}
         </div>
      </div>
    </aside>
  );
}
