"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoUser, projectStorageKey, slugify, userStorageKey, type VibroProject, type VibroUser } from "@/lib/vibro";
import { MaterialIcon, VibroMark, spring } from "@/components/vibro/ui";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<VibroUser>(demoUser);
  const [name, setName] = useState("Vibro");
  const [slug, setSlug] = useState("vibro");
  const [region, setRegion] = useState("European Union");

  useEffect(() => {
    const stored = localStorage.getItem(userStorageKey);
    if (stored) setUser(JSON.parse(stored));
    else localStorage.setItem(userStorageKey, JSON.stringify(demoUser));
  }, []);

  const createWorkspace = () => {
    const finalSlug = slugify(slug || name || "vibro");
    const project: VibroProject = {
      id: `${finalSlug}-${Date.now()}`,
      name: name || "Vibro",
      slug: finalSlug,
      region,
      description: "Context OS workspace for project planning and AI handoff.",
      createdAt: new Date().toISOString(),
    };

    const key = projectStorageKey(user.id);
    const existing = localStorage.getItem(key);
    const projects = existing ? (JSON.parse(existing) as VibroProject[]) : [];
    localStorage.setItem(key, JSON.stringify([project, ...projects.filter((item) => item.slug !== project.slug)]));
    router.push(`/workspace/onboard?slug=${project.slug}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 aurora-bg animate-pulse-slow" />
      <div className="pointer-events-none absolute inset-0 vibro-grain" />

      <header className="relative z-20 flex items-center justify-between px-6 py-5">
        <div className="inline-flex items-center gap-2">
          <VibroMark size={30} />
          <span className="font-display text-xl">Vibro</span>
        </div>
        <button className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-soft backdrop-blur transition hover:text-foreground">
          Use a different email
        </button>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-84px)] items-center justify-center px-6 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={spring}
          className="w-full max-w-[430px]"
        >
          <div className="mb-9 text-center">
            <p className="font-ai text-sm text-muted-foreground">Workspace setup</p>
            <h1 className="mt-2 font-display text-5xl leading-[1.02]">
              Create your <span className="italic text-primary">workspace</span>
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Set the project home where Vibro keeps decisions, design, architecture, and AI handoff context.
            </p>
          </div>

          <div className="rounded-[28px] border border-border bg-card/90 p-4 shadow-glow backdrop-blur">
            <div className="space-y-4">
              <OnboardField
                label="Workspace name"
                value={name}
                onChange={(value) => {
                  setName(value);
                  setSlug(slugify(value));
                }}
                placeholder="Vibro Studio"
              />
              <OnboardField label="Workspace URL" value={slug} onChange={setSlug} prefix="vibro.app/" placeholder="studio" />
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-muted-foreground">Region</span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-500/10"
                >
                  <option>European Union</option>
                  <option>United States</option>
                  <option>Africa, Lagos</option>
                </select>
              </label>
              <button
                onClick={createWorkspace}
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#101418] text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:bg-[#182232]"
              >
                Continue
                <MaterialIcon name="arrow_forward" size={17} />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Using <span className="text-foreground">{user.email}</span>
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function OnboardField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex overflow-hidden rounded-2xl border border-border bg-secondary/60 shadow-sm transition focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-500/10">
        {prefix && <span className="border-r border-border px-4 py-3 text-sm text-muted-foreground">{prefix}</span>}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </label>
  );
}
