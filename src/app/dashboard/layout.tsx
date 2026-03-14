"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="flex min-h-screen bg-white selection:bg-[#b8f724]/30 selection:text-zinc-900">
      {/* Sidebar */}
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-500 min-h-screen flex flex-col relative ${
          isCollapsed ? "pl-[88px]" : "pl-[280px]"
        }`}
      >
        {/* Production-Ready Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 architect-grid opacity-60 dark:opacity-40" />
           <div className="absolute inset-0 bg-gradient-to-tr from-[#b8f724]/5 via-transparent to-transparent opacity-30 dark:opacity-20" />
           <div className="absolute inset-0 dashboard-mask" />
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 relative z-10">
          <div className="noise-overlay" />
          {children}
        </div>
        
        {/* Simple Dashboard Footer */}
        <footer className="p-10 border-t border-zinc-100 flex flex-col items-center gap-4 bg-white">
           <Image 
             src="/logo.png" 
             alt="Vibro Logo" 
             width={24} 
             height={24} 
             className="opacity-40"
           />
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
             Vibro Studio v4.2.0 • Production Build
           </p>
        </footer>
      </main>
    </div>
  );
}
