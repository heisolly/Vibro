"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { demoUser, projectStorageKey, userStorageKey, type VibroProject, type VibroUser } from "@/lib/vibro";
import { MaterialIcon, ScreenShell, VibroMark, spring } from "@/components/vibro/ui";

export default function DashboardPage() {
  const [user, setUser] = useState<VibroUser>(demoUser);
  const [projects, setProjects] = useState<VibroProject[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem(userStorageKey);
    const parsedUser = storedUser ? JSON.parse(storedUser) as VibroUser : demoUser;
    setUser(parsedUser);
    const storedProjects = localStorage.getItem(projectStorageKey(parsedUser.id));
    setProjects(storedProjects ? JSON.parse(storedProjects) : []);
  }, []);

  return (
    <ScreenShell>
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-3">
            <VibroMark size={34} />
            <div>
              <h1 className="text-xl font-semibold">Vibro Console</h1>
              <p className="text-xs text-neutral-500">Context OS for AI development</p>
            </div>
          </div>
          <Link href="/workspace/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white">
            <MaterialIcon name="add" size={17} />
            New workspace
          </Link>
        </header>

        <section className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
              Choose a workspace or create a new one. Each workspace gets its own brief, design system, architecture board, inspiration board, context bundle, and MCP handoff.
            </p>
          </div>
          <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
            Vibro engine active
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <motion.div key={project.id} whileHover={{ y: -4 }} transition={spring} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-neutral-950 text-white">
                  <MaterialIcon name="auto_awesome" size={20} />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ready</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{project.name}</h3>
              <p className="mt-2 text-sm text-neutral-500">vibro.app/{project.slug}</p>
              <p className="mt-4 text-sm leading-6 text-neutral-600">{project.description}</p>
              <Link href={`/workspace/${project.slug}`} className="mt-5 inline-flex text-sm font-semibold text-neutral-950">
                Open workspace
              </Link>
            </motion.div>
          ))}

          <Link href="/workspace/new" className="grid min-h-56 place-items-center rounded-lg border border-dashed border-neutral-300 bg-white/50 p-5 text-center hover:bg-white">
            <div>
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
                <MaterialIcon name="add" size={20} />
              </div>
              <div className="mt-4 text-sm font-semibold">Create another workspace</div>
            </div>
          </Link>
        </section>
      </main>
    </ScreenShell>
  );
}
