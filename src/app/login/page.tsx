"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, Loader2, Sparkles, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "error" | "success">("idle");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (status === "verifying") {
      gsap.fromTo(scannerRef.current, 
        { top: "0%" }, 
        { top: "100%", duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" }
      );
    }
  }, { dependencies: [status], scope: containerRef });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("verifying");

    // Simulate verification
    setTimeout(() => {
      if (passcode === "2504") {
        document.cookie = "vibro_admin_access=true; path=/; max-age=86400";
        setStatus("success");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2000);
      }
    }, 2000);
  };

  return (
    <div ref={containerRef} className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FFFCF2] font-space-grotesk selection:bg-black selection:text-[#C6FF3D]">
      {/* Background - Homepage Style */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05] animate-grid-flow"
          style={{ 
            backgroundImage: `linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, #FFFCF2 95%)' }} />
        
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-[#C6FF3D]/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-[520px] px-6 relative z-10">
        {/* Shield Icon Node */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="relative group">
            <div className="w-24 h-24 bg-black border-[4px] border-black flex items-center justify-center shadow-[10px_10px_0_#C6FF3D] group-hover:shadow-[14px_14px_0_#C6FF3D] transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 relative z-10">
              <Shield className="w-12 h-12 text-[#C6FF3D]" />
            </div>
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#C6FF3D] border-[3px] border-black flex items-center justify-center font-black animate-bounce">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Title Block */}
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-6xl font-black tracking-tighter text-black uppercase leading-none italic">
            Shield <span className="text-white [-webkit-text-stroke:2.5px_black]">Node.</span>
          </h1>
          <p className="text-[12px] font-[900] text-zinc-400 uppercase tracking-[0.6em]">Authorized_Personnel_Only</p>
        </div>

        {/* Auth Module */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white border-[4px] border-black p-10 sm:p-14 shadow-[25px_25px_0_#000] relative overflow-hidden">
            {/* Verification Overlay */}
            <AnimatePresence>
              {status === "verifying" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#FFFCF2]/95 flex flex-col items-center justify-center"
                >
                  <div ref={scannerRef} className="absolute left-0 w-full h-1 bg-[#C6FF3D] shadow-[0_0_20px_#C6FF3D] z-10" />
                  <Loader2 className="w-16 h-16 animate-spin text-black mb-6" />
                  <p className="text-xl font-black uppercase tracking-[0.3em] text-black italic">Verifying_Key...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-10 relative z-10">
              <div className="space-y-5 text-center">
                <label className="text-[14px] font-[1000] text-black uppercase tracking-[0.3em] block">
                  # Input_Security_Key
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcode}
                  maxLength={4}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full h-24 text-center text-7xl font-black tracking-[0.5em] border-[4px] border-black bg-[#F3F3F3] focus:bg-[#C6FF3D] focus:shadow-[8px_8px_0_black] transition-all outline-none"
                  placeholder="----"
                />
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-3 h-3 border-2 border-black ${passcode.length >= i ? 'bg-black' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full h-20 bg-black text-[#C6FF3D] border-[4px] border-black font-black uppercase text-xl tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-[#C6FF3D] hover:text-black hover:shadow-[10px_10px_0_black] hover:-translate-y-1 active:translate-y-0"
              >
                EXECUTE OVERRIDE
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[4]" />
              </button>
            </form>

            <AnimatePresence>
              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 p-6 bg-red-50 border-[3px] border-black flex items-center gap-5 shadow-[8px_8px_0_#ef4444]"
                >
                  <div className="w-10 h-10 bg-red-500 border-2 border-black flex items-center justify-center font-black italic shadow-[3px_3px_0_#000]">!</div>
                  <p className="text-sm font-black text-red-600 uppercase tracking-tight italic">Access_Denied: Invalid_Sequence</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Console Meta */}
        <div className="mt-16 text-center space-y-2 opacity-40">
           <div className="inline-flex items-center gap-4 px-6 py-2 border-2 border-black bg-black text-white text-[10px] font-black uppercase tracking-[0.4em]">
             ◈ MASTER_SHIELD_ACTIVE ◈
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Encryption Level: Quantum-Standard</p>
        </div>
      </div>
    </div>
  );
}
