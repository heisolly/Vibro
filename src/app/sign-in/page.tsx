"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

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
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] bg-dot-pattern px-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <Link href="/" className="inline-block mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-white text-2xl shadow-[4px_4px_0_rgba(184,247,36,1)] hover:translate-y-1 hover:shadow-none transition-all">
            ⚡
          </Link>
          <h1 className="text-4xl font-[1000] tracking-tighter text-black uppercase">Welcome Back</h1>
          <p className="mt-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">Sign in to Vibro</p>
        </div>

        <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-10 shadow-[20px_20px_0_rgba(0,0,0,1)]">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border-[3px] border-black bg-white px-5 py-4 font-bold text-black outline-none transition-all placeholder:text-zinc-300 focus:-translate-y-1 focus:shadow-[5px_5px_0_rgba(184,247,36,1)]"
                placeholder="developer@vibro.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Password</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border-[3px] border-black bg-white px-5 py-4 font-bold text-black outline-none transition-all placeholder:text-zinc-300 focus:-translate-y-1 focus:shadow-[5px_5px_0_rgba(184,247,36,1)]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl border-[2px] border-red-500 bg-red-50 p-4 text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full brutal-btn-primary py-5 text-sm font-black uppercase tracking-[0.1em]"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs font-bold text-zinc-400">
            DON'T HAVE AN ACCOUNT?{" "}
            <Link href="/sign-up" className="text-black underline decoration-2 underline-offset-4 hover:text-[rgba(184,247,36,1)] transition-colors">
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
