"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple passcode check
    if (passcode === "242424") {
      // Set a cookie manually
      document.cookie = `vibro_admin_access=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push("/admin");
    } else {
      setError("Invalid Access Protocol. Passcode Reject.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] bg-dot-pattern px-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border-[4px] border-black bg-white text-3xl shadow-[6px_6px_0_rgba(184,247,36,1)]">
              🛡️
            </div>
          <h1 className="text-4xl font-[1000] tracking-tighter text-black uppercase">Admin_Shield</h1>
          <p className="mt-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">Enter Master Passcode</p>
        </div>

        <div className="rounded-[2.5rem] border-[4px] border-black bg-white p-10 shadow-[20px_20px_0_rgba(0,0,0,1)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Master Code</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-center tracking-[0.5em] rounded-2xl border-[3px] border-black bg-white px-5 py-4 text-xl font-black text-black outline-none transition-all placeholder:text-zinc-200 focus:-translate-y-1 focus:shadow-[5px_5px_0_rgba(184,247,36,1)]"
                placeholder="••••••"
                maxLength={6}
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
              {loading ? "Decrypting..." : "Access Terminal"}
            </button>
          </form>
        </div>
        
        <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">
          Vibro Security Override v1.0
        </p>
      </div>
    </div>
  );
}
