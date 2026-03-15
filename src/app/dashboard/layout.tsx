"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-[#b8f724]/30">
      {/* Sidebar */}
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 min-h-screen relative flex flex-col ${
          isCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        {/* Top Bar */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-4 bg-zinc-100/50 px-3 py-1.5 rounded-lg border border-zinc-200/50 w-72 transition-all focus-within:w-96 focus-within:bg-zinc-100 focus-within:border-zinc-300 group">
              <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-transparent border-none outline-none text-xs font-medium text-zinc-900 placeholder:text-zinc-400 w-full"
              />
           </div>

           <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-zinc-50 border border-white">
                 {user?.email?.[0].toUpperCase() || "V"}
              </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
