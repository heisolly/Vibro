"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoUser, projectStorageKey, slugify, userStorageKey, type VibroProject, type VibroUser } from "@/lib/vibro";
import { Field, ScreenShell } from "@/components/vibro/ui";

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
    const projects = existing ? JSON.parse(existing) as VibroProject[] : [];
    localStorage.setItem(key, JSON.stringify([project, ...projects.filter((item) => item.slug !== project.slug)]));
    router.push(`/workspace/onboard?slug=${project.slug}`);
  };

  return (
    <ScreenShell>
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          <div className="mb-9 text-center">
            <h1 className="text-2xl font-medium text-neutral-950">Create a workspace</h1>
            <p className="mt-2 text-sm text-neutral-500">Move work forward across teams and agents</p>
          </div>
          <div className="space-y-5">
            <Field
              label="Name"
              value={name}
              onChange={(value) => {
                setName(value);
                setSlug(slugify(value));
              }}
              placeholder="Vibro Studio"
            />
            <Field label="URL" value={slug} onChange={setSlug} prefix="vibro.app/" placeholder="studio" />
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-neutral-500">Region</span>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-950 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option>European Union</option>
                <option>United States</option>
                <option>Africa, Lagos</option>
              </select>
            </label>
            <button onClick={createWorkspace} className="mt-5 h-11 w-full rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50">
              Create workspace
            </button>
          </div>
          <div className="fixed inset-x-0 bottom-6 text-center text-sm text-neutral-500">
            <p>Using {user.email}</p>
            <button className="mt-2 text-neutral-400 hover:text-neutral-800">Use a different email</button>
          </div>
        </div>
      </main>
    </ScreenShell>
  );
}
