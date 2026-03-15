"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFA] p-6 font-poppins selection:bg-[#C6FF3D] selection:text-black">
      {/* Background decoration - Vibro Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#C6FF3D]/10 blur-[140px] rounded-full opacity-60" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-black/[0.02] blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[460px] relative z-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-8 block transition-all hover:scale-105 active:scale-95 group">
            <div className="w-16 h-16 bg-black rounded-[1.5rem] border-[3px] border-black flex items-center justify-center p-3 shadow-[8px_8px_0_#C6FF3D] group-hover:shadow-[12px_12px_0_#C6FF3D] transition-all">
              <Image 
                src="/logo.png" 
                alt="Vibro" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-black mb-3 uppercase italic">
            User <span className="text-white [-webkit-text-stroke:1.5px_black]">Auth.</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-pulse" />
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Protocol: Synthesis_Login</p>
          </div>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border-[3px] border-black rounded-[3rem] p-10 shadow-[16px_16px_0_rgba(0,0,0,1)] overflow-hidden relative"
        >
          {/* Subtle line decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 -mr-12 -mt-12 rounded-full border border-zinc-100" />
          
          <form onSubmit={handleSignIn} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2" htmlFor="email">
                <Mail className="w-3.5 h-3.5" />
                Email_Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 px-6 rounded-2xl border-[2.5px] border-zinc-100 bg-zinc-50/50 font-bold text-black outline-none transition-all focus:bg-white focus:border-black placeholder:text-zinc-300"
                  placeholder="agent@vibro.io"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2" htmlFor="password">
                  <Lock className="w-3.5 h-3.5" />
                  Access_Key
                </label>
                <Link href="#" className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors">Forgot_Pass?</Link>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 px-6 rounded-2xl border-[2.5px] border-zinc-100 bg-zinc-50/50 font-bold text-black outline-none transition-all focus:bg-white focus:border-black placeholder:text-zinc-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 rounded-2xl border-[2px] border-red-100 bg-red-50/50 flex items-center gap-4"
              >
                <div className="w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center text-xs shrink-0 font-black">!</div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-tight leading-tight">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-16 bg-[#C1FF00] text-black border-[3px] border-black rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Authorize
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t-[2.5px] border-zinc-50 text-center">
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
              New to the engine?{" "}
              <Link href="/sign-up" className="text-black font-black hover:text-[#C1FF00] transition-colors decoration-[3px] decoration-[#C1FF00] underline underline-offset-[6px]">
                Create_Account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer Meta */}
        <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
          <Sparkles className="w-4 h-4 text-black" />
          <p className="text-black text-[9px] font-black uppercase tracking-[0.4em]">
            Vibro_Security_Core_v5.0
          </p>
          <Sparkles className="w-4 h-4 text-black" />
        </div>
      </div>
    </div>
  );
}
