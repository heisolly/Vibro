"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push("/sign-in");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check synthesis failed:", err);
        // Fallback: redirects to sign-in on fatal network error
        router.push("/sign-in");
      }
    }
    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ffffff10] border-t-[#C6FF3D] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

