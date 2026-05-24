"use client";

import Link from "next/link";
import type { InputHTMLAttributes, ReactNode } from "react";
import { VibroMark } from "@/components/vibro/ui";

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 aurora-bg animate-pulse-slow" />
      <div className="vibro-grain" />
      <section className="relative w-full max-w-[420px] animate-float-in">
        <Link href="/" className="mb-8 flex justify-center">
          <VibroMark size={42} />
        </Link>

        <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Vibro</p>
            <h1 className="mt-2 font-display text-3xl text-foreground">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-6 space-y-3">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </section>
    </main>
  );
}

export function OAuthButton({
  provider,
  label,
  onClick,
}: {
  provider: "GitHub" | "Google";
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/90 px-4 text-sm font-medium text-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-card"
    >
      {provider === "GitHub" ? <GitHubIcon /> : <GoogleIcon />}
      {label}
    </button>
  );
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-muted-foreground">
      {children}
    </label>
  );
}

export function TextField({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10 ${className}`}
    />
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.38-3.9-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.72 0-1.26.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.18 1.19A11.03 11.03 0 0 1 12 6.05c.98 0 1.96.13 2.88.39 2.2-1.5 3.17-1.19 3.17-1.19.64 1.6.24 2.78.12 3.07.75.82 1.2 1.85 1.2 3.11 0 4.45-2.71 5.42-5.29 5.71.42.37.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.43Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.89a6 6 0 0 1 0-3.78v-2.6H3.07a10 10 0 0 0 0 8.98l3.34-2.6Z" />
      <path fill="#EA4335" d="M12 5.99c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.34 2.6C7.2 7.75 9.4 5.99 12 5.99Z" />
    </svg>
  );
}
