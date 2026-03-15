"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus, ArrowRight, Loader2, Sparkles, Target } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFA] p-6 font-poppins selection:bg-[#C1FF00] selection:text-black">
      {/* Background decoration - Vibro Grain & Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-0 w-[40%] h-[40%] bg-[#C1FF00]/10 blur-[150px] rounded-full opacity-50" />
        <div className="absolute bottom-10 right-10 w-64 h-64 border-[40px] border-black/[0.03] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-8 block group">
            <div className="w-16 h-16 bg-white border-[3.5px] border-black rounded-[2rem] flex items-center justify-center p-3 shadow-[10px_10px_0_#000] group-hover:shadow-[14px_14px_0_#C1FF00] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all">
              <Image 
                src="/logo.png" 
                alt="Vibro" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-black text-center leading-none uppercase italic mb-4">
            Join <span className="text-white [-webkit-text-stroke:1.8px_black]">Vibro.</span>
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-4 h-[2px] bg-black/10" />
            Deployment_Access_Node
            <span className="w-4 h-[2px] bg-black/10" />
          </p>
        </div>

        {/* Main Interface Module */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border-[3.5px] border-black rounded-[3.5rem] p-10 sm:p-12 shadow-[24px_24px_0_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Internal Metadata */}
          <div className="absolute top-8 right-10 opacity-10 flex flex-col items-end">
            <Sparkles className="w-8 h-8 text-black" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2" htmlFor="email">
                <Target className="w-3.5 h-3.5 text-[#C1FF00] fill-current" />
                # Identity_Allocation
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-16 px-8 rounded-2xl border-[2.5px] border-zinc-100 bg-[#F8F9FA] font-bold text-black outline-none transition-all focus:bg-white focus:border-black focus:shadow-[8px_8px_0_#F8F9FA] placeholder:text-zinc-300"
                placeholder="architect@vibro.io"
              />
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2" htmlFor="password">
                  <Lock className="w-3.5 h-3.5 text-[#C1FF00] fill-current" />
                  # Access_Seal
                </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-16 px-8 rounded-2xl border-[2.5px] border-zinc-100 bg-[#F8F9FA] font-bold text-black outline-none transition-all focus:bg-white focus:border-black focus:shadow-[8px_8px_0_#F8F9FA] placeholder:text-zinc-300"
                placeholder="Create access key"
              />
              <div className="flex items-center gap-2 ml-1 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Min_Entropy: 6_Chars</span>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border-[2px] border-red-500 bg-red-50 flex items-center gap-4 shadow-[6px_6px_0_#EF4444]"
              >
                <div className="w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center text-[10px] shrink-0 font-black italic">ERR</div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-tight leading-tight italic">Fault: {error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-20 bg-black text-white rounded-[2rem] font-[1000] uppercase text-base tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-[#C1FF00] hover:text-black hover:shadow-[10px_10px_0_#000] active:scale-[0.97] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Allocating...
                </>
              ) : (
                <>
                  Generate_Access
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t-[3px] border-zinc-50 flex flex-col items-center gap-4">
            <p className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest italic">
              Access_Already_Provisioned?
            </p>
            <Link href="/sign-in" className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border-[2.5px] border-black bg-white font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[6px_6px_0_#000]">
              Return_to_Core
            </Link>
          </div>
        </motion.div>

        {/* System Meta */}
        <div className="mt-12 text-center flex flex-col items-center gap-3">
           <div className="h-px w-32 bg-black/5" />
           <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">
             VIBRO_SYSTEMS_SLA_99.9%
           </p>
        </div>
      </div>
    </div>
  );
}
