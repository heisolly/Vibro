"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ShieldAlert, Cpu, Lock, Activity, ArrowLeft, KeyRound, Boxes } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".shield-node", {
      scale: 0.9,
      opacity: 0,
      duration: 1.4,
      ease: "expo.out"
    });
    
    gsap.to(".scanner-line", {
      y: "350%",
      duration: 2.5,
      repeat: -1,
      ease: "power2.inOut",
      yoyo: true
    });
  }, { scope: containerRef });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple passcode check
    if (passcode === "242424") {
      document.cookie = `vibro_admin_access=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push("/admin");
    } else {
      setTimeout(() => {
        setError("AUTH_FAILURE: ACCESS_KEY_REJECTED");
        setLoading(false);
        
        // Shake feedback
        gsap.to(".auth-card", {
          x: 12,
          yoyo: true,
          repeat: 7,
          duration: 0.04,
          onComplete: () => { gsap.set(".auth-card", { x: 0 }); }
        });
      }, 600);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center p-6 bg-[#09090B] font-poppins selection:bg-[#C1FF00] selection:text-black overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C1FF00]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="relative w-full max-w-[440px] z-10 space-y-12">
        <div className="shield-node flex flex-col items-center text-center">
           <Link href="/" className="group mb-10 flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 hover:border-[#C1FF00] transition-all text-zinc-500 hover:text-[#C1FF00]">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit_Security_Zone</span>
           </Link>

           <div className="relative w-28 h-28 rounded-[2.5rem] border-[4px] border-[#C1FF00] bg-black flex items-center justify-center shadow-[15px_15px_0_rgba(193,255,0,0.15)] overflow-hidden">
              <ShieldAlert className="w-12 h-12 text-[#C1FF00] animate-pulse" />
              <div className="scanner-line absolute top-[-100%] left-0 w-full h-[8px] bg-[#C1FF00]/50 blur-md pointer-events-none" />
           </div>

           <div className="mt-8 space-y-3">
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                Admin <span className="text-black [-webkit-text-stroke:1.5px_#fff]">Shield.</span>
              </h1>
              <div className="flex items-center justify-center gap-3">
                 <Boxes className="w-3.5 h-3.5 text-[#C1FF00]" />
                 <p className="text-[11px] font-black text-[#C1FF00] uppercase tracking-[0.5em] italic">Authorized_Access_Only</p>
              </div>
           </div>
        </div>

        <motion.div 
          className="auth-card relative bg-white border-[4px] border-black rounded-[3.5rem] p-12 shadow-[30px_30px_0_rgba(0,0,0,1)]"
        >
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-[0.3em] ml-1" htmlFor="passcode">
                <KeyRound className="w-4 h-4 text-zinc-400 font-bold" />
                Master_Protocol_Code
              </label>
              <input
                id="passcode"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-center tracking-[1.2em] rounded-[1.5rem] border-[3px] border-zinc-100 bg-[#F8F9FA] px-6 py-6 text-3xl font-black text-black outline-none transition-all focus:bg-white focus:border-black focus:shadow-[10px_10px_0_#F8F9FA]"
                placeholder="••••••"
                maxLength={6}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-[3px] border-red-500 p-5 rounded-3xl flex items-center gap-4 shadow-[8px_8px_0_#EF4444]"
              >
                <Activity className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 leading-tight italic">{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-20 bg-black text-white rounded-[2rem] border-[4px] border-black font-black text-base uppercase tracking-[0.3em] hover:bg-[#C1FF00] hover:text-black hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden"
            >
              <Cpu className="w-6 h-6 rotate-180" />
              Authorize_Master
              {/* Internal glow effect */}
              <div className="absolute inset-x-0 h-1/2 bottom-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>
        </motion.div>
        
        <div className="flex flex-col items-center gap-5 opacity-40">
           <div className="h-[2px] w-20 bg-white/20" />
           <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white text-center">
             ENCRYPTION_V5.0_OVERRIDE
           </p>
        </div>
      </div>
    </div>
  );
}
