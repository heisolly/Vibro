"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
        className={`flex-1 transition-all duration-500 min-h-screen flex flex-col ${
          isCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        {/* Dynamic Page Content */}
        <div className="flex-1 relative">
          <div className="noise-overlay" />
          {children}
        </div>
        
        {/* Simple Dashboard Footer */}
        <footer className="p-10 border-t border-zinc-100 text-center bg-white">
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
             Vibro Studio v4.2.0 • Production Build
           </p>
        </footer>
      </main>
    </div>
  );
}
