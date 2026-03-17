"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

export default function StudioRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if we have an active synthesis to redirect to
    const saved = localStorage.getItem("vibro_active_synthesis");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const name = data?.projectName?.toLowerCase().replace(/\s+/g, '-') || 'new-system';
        const id = `${name}-${Math.random().toString(36).slice(2, 7)}`;
        router.replace(`/project/${id}`);
        return;
      } catch (e) {}
    }
    
    // Fallback to dashboard if no project found
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050506] gap-4">
      <Zap className="w-8 h-8 animate-pulse text-[#C6FF3D] fill-[#C6FF3D]" />
      <p className="text-[#C6FF3D] font-black uppercase tracking-[0.4em] text-[10px]">Opening_Laboratory...</p>
    </div>
  );
}
