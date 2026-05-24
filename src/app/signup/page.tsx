"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { demoUser, userStorageKey } from "@/lib/vibro";
import { ScreenShell, VibroMark, spring } from "@/components/vibro/ui";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const continueDemo = () => {
    localStorage.setItem(userStorageKey, JSON.stringify(demoUser));
    router.push("/workspace/new");
  };

  const signIn = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) continueDemo();
    } catch {
      continueDemo();
    }
  };

  return (
    <ScreenShell>
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={spring}
        className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-6"
      >
        <div className="w-full text-center">
          <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="mb-8 flex justify-center">
            <VibroMark size={44} />
          </motion.div>
          <h1 className="text-2xl font-medium text-neutral-950">Create your workspace</h1>
          <p className="mt-2 text-sm text-neutral-500">Everything but code lives here.</p>
          <div className="mt-6 space-y-3">
            <button onClick={() => signIn("google")} className="h-11 w-full rounded-full bg-[#6f76df] text-sm font-semibold text-white shadow-sm hover:bg-[#6269d5]">
              Continue with Google
            </button>
            <button onClick={continueDemo} className="h-11 w-full rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50">
              Continue with email
            </button>
            <button onClick={() => signIn("github")} className="h-11 w-full rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50">
              Continue with GitHub
            </button>
          </div>
          <p className="mx-auto mt-9 max-w-[280px] text-sm leading-6 text-neutral-500">
            By signing up, you agree to our Terms of Service and Data Processing Agreement.
          </p>
        </div>
      </motion.main>
    </ScreenShell>
  );
}
