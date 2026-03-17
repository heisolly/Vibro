"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck, Cpu, Target } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FFFCF2] font-space-grotesk selection:bg-black selection:text-[#C6FF3D]">
      {/* Background Grid System - Matching Homepage */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05] animate-grid-flow"
          style={{ 
            backgroundImage: `linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div 
          className="absolute inset-0" 
          style={{ background: 'radial-gradient(circle at center, transparent 0%, #FFFCF2 90%)' }}
        />
        
        {/* Large Decorative Accent Circles */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C6FF3D]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] px-6 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-12"
        >
          <Link href="/" className="group mb-8 relative">
             <div className="w-16 h-16 bg-white border-[3.5px] border-black flex items-center justify-center p-3 shadow-[8px_8px_0_#000] group-hover:shadow-[12px_12px_0_#C6FF3D] transition-all group-hover:-translate-x-1 group-hover:-translate-y-1">
                <Image 
                  src="/logo.png" 
                  alt="Vibro" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
             </div>
          </Link>
          
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tight text-black uppercase italic leading-none">
              Join <span className="text-white [-webkit-text-stroke:2px_black]">Vibro.</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-[#C6FF3D] border border-black animate-pulse" />
              <p className="text-[11px] font-[900] text-zinc-400 uppercase tracking-[0.4em]">Node: Provision_Access</p>
            </div>
          </div>
        </motion.div>

        {/* Auth Module - Neo-Brutalist Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Main Card */}
          <div className="bg-white border-[4px] border-black p-8 sm:p-12 shadow-[20px_20px_0_rgba(0,0,0,1)] overflow-hidden relative">
            <form onSubmit={handleSignUp} className="space-y-8 relative z-10">
              <div className="space-y-4">
                <label className="text-[12px] font-[900] text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2" htmlFor="email">
                  <Target className="w-4 h-4 text-[#C6FF3D]" />
                  Operator_ID
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 px-6 border-[3px] border-black bg-[#F3F3F3] font-[800] text-black outline-none transition-all focus:bg-white focus:shadow-[6px_6px_0_#C6FF3D] placeholder:text-zinc-400 uppercase text-xs tracking-wider"
                    placeholder="architect@vibro.io"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[12px] font-[900] text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2" htmlFor="password">
                  <Lock className="w-4 h-4 text-[#C6FF3D]" />
                  Access_Key
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 px-6 border-[3px] border-black bg-[#F3F3F3] font-[800] text-black outline-none transition-all focus:bg-white focus:shadow-[6px_6px_0_#C6FF3D] placeholder:text-zinc-400 uppercase text-xs tracking-wider"
                    placeholder="Create access key"
                  />
                </div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Min_Entropy: 6_Characters</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-[3px] border-black bg-red-50 flex items-center gap-4 shadow-[6px_6px_0_#ef4444]">
                      <div className="w-6 h-6 bg-red-500 text-white border-[2px] border-black flex items-center justify-center text-[10px] shrink-0 font-[1000] italic">ERR</div>
                      <p className="text-[11px] font-[1000] text-red-600 uppercase tracking-tight leading-tight italic">Status: {error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-20 bg-black text-[#C6FF3D] border-[4px] border-black font-[1000] uppercase text-lg tracking-[0.1em] flex items-center justify-center gap-3 transition-all hover:bg-[#C6FF3D] hover:text-black hover:shadow-[10px_10px_0_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    ALLOCATING...
                  </>
                ) : (
                  <>
                    INITIALIZE IDENTITY
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t-[3px] border-black text-center space-y-4">
              <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest italic">
                Already Provisioned?
              </p>
              <Link href="/sign-in" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 font-[900] text-xs uppercase tracking-widest border-[3px] border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_#C6FF3D] hover:-translate-y-0.5 transition-all">
                Return_to_Core
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer Meta */}
        <div className="mt-14 flex items-center justify-between px-2 opacity-50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
            <span className="text-black text-[9px] font-[1000] uppercase tracking-[0.2em]">SLA_99.9%_ACTIVE</span>
          </div>
          <p className="text-black text-[9px] font-[1000] uppercase tracking-[0.4em] italic text-center">
            Vibro_Systems_v4.2
          </p>
          <div className="flex items-center gap-2">
            <span className="text-black text-[9px] font-[1000] uppercase tracking-[0.2em]">NODE: P-02</span>
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}


