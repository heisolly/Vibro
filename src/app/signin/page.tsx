"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, Divider, FieldLabel, OAuthButton, TextField } from "@/components/AuthShell";
import { createClient } from "@/utils/supabase/client";
import { demoUser, userStorageKey } from "@/lib/vibro";
import { MaterialIcon } from "@/components/vibro/ui";

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const continueDemo = () => {
    localStorage.setItem(userStorageKey, JSON.stringify({
      ...demoUser,
      email: email.trim() || demoUser.email,
    }));
    router.push("/workspace/new");
  };

  const signIn = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) continueDemo();
    } catch {
      continueDemo();
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) continueDemo();
    } catch {
      continueDemo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Vibro workspace."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <OAuthButton provider="GitHub" label="Continue with GitHub" onClick={() => signIn("github")} />
      <OAuthButton provider="Google" label="Continue with Google" onClick={() => signIn("google")} />

      <Divider>or with email</Divider>

      <form className="space-y-3" onSubmit={submit}>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <TextField id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@studio.dev" autoComplete="email" />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-primary to-[oklch(0.48_0.18_258)] px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          Send sign-in link
          <MaterialIcon name="arrow_forward" size={16} />
        </button>
      </form>
    </AuthShell>
  );
}
