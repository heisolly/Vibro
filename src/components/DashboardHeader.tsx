"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "@/app/dashboard/ThemeProvider";

export function DashboardHeader() {
  const { theme } = useTheme();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <header className="w-full h-16 flex items-center justify-end gap-3 relative z-10 px-4">
      <div className="group relative">
        <button className={`flex items-center gap-3 px-6 py-2 border text-[11px] font-black uppercase tracking-widest transition-all ${
          isDark ? "bg-white text-black border-white" : "bg-white text-black border-black/5 shadow-sm"
        }`}>
          Browse Components
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className={`flex items-center gap-3 pr-4 border rounded-sm ${
        isDark ? "border-[#ffffff10] bg-[#0d0d0f]" : "border-black/5 bg-white shadow-sm"
      }`}>
        <div className="w-10 h-10 bg-[#C6FF3D] flex items-center justify-center">
           <span className="text-[11px] font-black text-black">
            {user?.email?.[0].toUpperCase() || "M"}
           </span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest truncate max-w-[180px]">
          {user?.email?.split('@')[0].toUpperCase() || "MICHAELOLUWAYANMI"}
        </span>
      </div>
    </header>
  );
}
