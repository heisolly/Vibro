"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaterialIcon, VibroMark } from "@/components/vibro/ui";

const features = [
  {
    icon: "menu_book",
    title: "Living specs",
    body: "PRDs, decisions, design notes, and context that stay ready for agents and teammates.",
  },
  {
    icon: "hub",
    title: "Linked context",
    body: "Connect prompts, references, decisions, boards, and architecture into one project memory.",
  },
  {
    icon: "auto_awesome",
    title: "Agent-ready",
    body: "Prepare clean context bundles for Codex, Cursor, Gemini, GitHub, and your MCP tools.",
  },
  {
    icon: "forum",
    title: "Persistent chats",
    body: "Every important prompt and reply becomes searchable project knowledge.",
  },
  {
    icon: "schema",
    title: "Boards as data",
    body: "Design systems, architecture maps, and inspiration boards are generated as structured context.",
  },
  {
    icon: "lock",
    title: "Workspace first",
    body: "Each project keeps its own context, decisions, and generated memory separate.",
  },
];

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vibro-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    setDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("vibro-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 aurora-bg animate-pulse-slow" />
      <div className="vibro-grain" />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <VibroMark dark={dark} size={32} />
          <span className="font-display text-lg">Vibro</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#context" className="hover:text-foreground">Context</a>
          <a href="#start" className="hover:text-foreground">Start</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/80 text-foreground/80 backdrop-blur transition hover:bg-card hover:text-foreground"
          >
            <MaterialIcon name={dark ? "light_mode" : "dark_mode"} size={18} />
          </button>
          <Link href="/signin" className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex">
            Sign in
          </Link>
          <Link href="/signup" className="inline-flex items-center rounded-full bg-gradient-to-b from-primary to-[oklch(0.48_0.18_258)] px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:brightness-110">
            Sign up
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6">
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <div className="w-full max-w-3xl text-center animate-float-in">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Now in private beta - connect your project context
            </div>

            <h1 className="font-display text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-[68px]">
              Your Context OS for{" "}
              <span className="italic text-primary">AI-Assisted Development</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
              Everything but code lives here.
            </p>

            <div className="mx-auto mt-10 max-w-2xl">
              <div className="group relative">
                <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-primary/30 via-primary-glow/40 to-primary/20 opacity-70 blur-2xl" />
                <div className="relative flex items-center gap-2 rounded-full border border-border bg-card/95 py-2.5 pl-3 pr-2 shadow-glow backdrop-blur">
                  <button className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                    <MaterialIcon name="add" size={20} />
                  </button>
                  <input
                    placeholder="Ask Vibro"
                    className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none"
                  />
                  <button className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs text-foreground/80 transition hover:bg-secondary sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Flash
                    <MaterialIcon name="expand_more" size={14} className="opacity-60" />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                    <MaterialIcon name="mic" size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl py-24">
          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl sm:text-5xl">
              The brain behind your <span className="italic text-primary">project</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Specs, decisions, prompts, threads, diagrams - captured, linked, and ready for any AI agent or teammate.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition hover:bg-card hover:shadow-glow">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <MaterialIcon name={feature.icon} size={22} className="group-hover:msr-fill" />
                </div>
                <h3 className="font-display text-xl">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>



        <footer className="mx-auto max-w-6xl border-t border-border py-8 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <VibroMark dark={dark} size={24} />
              <span className="font-display text-base text-foreground">Vibro</span>
              <span className="opacity-60">- Context OS for AI-assisted development</span>
            </div>
            <div className="flex gap-5">
              <a className="hover:text-foreground" href="#features">Features</a>
              <a className="hover:text-foreground" href="#start">Start</a>
              <a className="hover:text-foreground" href="/signin">Sign in</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
