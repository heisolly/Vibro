"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStorageKey, type VibroUser } from "@/lib/vibro";
import { MaterialIcon, StepDots, spring } from "@/components/vibro/ui";

export default function WorkspaceOnboardPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("vibro");
  const [step, setStep] = useState(0);
  const [profileName, setProfileName] = useState("Micheal Oluwayanmi");
  const [profileTitle, setProfileTitle] = useState("Software engineer");
  const [inviteEmails, setInviteEmails] = useState("");

  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("slug") || "vibro");
    const stored = localStorage.getItem(userStorageKey);
    if (!stored) return;
    const parsed = JSON.parse(stored) as VibroUser;
    setProfileName(parsed.name);
  }, []);

  const finish = () => router.push(`/workspace/${slug}`);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-black text-white lg:grid-cols-2">
      <main className="relative flex min-h-screen items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -22, filter: "blur(8px)" }}
            transition={spring}
            className="w-full max-w-[400px]"
          >
            {step === 0 && (
              <div>
                <h1 className="text-2xl font-semibold">Set up your profile</h1>
                <p className="mt-2 text-sm text-neutral-400">Choose how you will appear in Vibro</p>
                <div className="mt-9 space-y-6">
                  <label className="block">
                    <span className="mb-3 block text-xs text-neutral-500">Name and picture</span>
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full border border-neutral-800 bg-neutral-950">
                        <MaterialIcon name="person" size={20} />
                      </div>
                      <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="h-11 flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-4 text-sm outline-none focus:border-indigo-500" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-3 block text-xs text-neutral-500">Title</span>
                    <input value={profileTitle} onChange={(event) => setProfileTitle(event.target.value)} className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 text-sm outline-none focus:border-indigo-500" />
                  </label>
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h1 className="text-2xl font-semibold">Invite teammates</h1>
                <p className="mt-2 text-sm text-neutral-400">Bring the people who shape the project context</p>
                <div className="mt-9">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Invitations</span>
                    <button className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300">
                      <MaterialIcon name="link" size={14} />
                      Copy invite link
                    </button>
                  </div>
                  <textarea value={inviteEmails} onChange={(event) => setInviteEmails(event.target.value)} placeholder="email@gmail.com, email2@gmail.com" rows={4} className="w-full resize-none rounded-lg border border-indigo-500 bg-neutral-950 px-4 py-4 text-sm outline-none" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h1 className="text-2xl font-semibold">Connect sources</h1>
                <p className="mt-2 text-sm text-neutral-400">Optional references Vibro can use for context</p>
                <div className="mt-9 divide-y divide-neutral-900 border-y border-neutral-900">
                  {["GitHub repository", "Product docs", "Design references"].map((item) => (
                    <div key={item} className="flex items-center justify-between py-5">
                      <div>
                        <div className="text-sm font-semibold">{item}</div>
                        <div className="mt-1 text-sm text-neutral-500">Add signal to the project memory</div>
                      </div>
                      <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-800">Add</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h1 className="text-2xl font-semibold">Subscribe to updates</h1>
                <p className="mt-2 text-sm text-neutral-400">Stay in the loop as Vibro evolves</p>
                <div className="mt-9 divide-y divide-neutral-900 border-y border-neutral-900">
                  {["Changelog", "Onboarding emails", "Follow @vibro"].map((item) => (
                    <div key={item} className="flex items-center justify-between py-5">
                      <div>
                        <div className="text-sm font-semibold">{item}</div>
                        <div className="mt-1 text-sm text-neutral-500">Helpful product notes for new workspaces</div>
                      </div>
                      <span className="h-5 w-9 rounded-full bg-neutral-700 p-0.5">
                        <span className="block h-4 w-4 rounded-full bg-white" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-7 flex items-center gap-10">
          <StepDots current={step} total={4} />
          <div className="flex items-center gap-4 text-sm">
            <button className="text-neutral-500 hover:text-white" onClick={() => (step === 0 ? finish() : setStep(step - 1))}>Skip</button>
            <button onClick={() => (step === 3 ? finish() : setStep(step + 1))} className="rounded-full bg-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-800">
              {step === 3 ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      </main>
      <aside className="relative hidden overflow-hidden border-l border-neutral-900 bg-[#050505] lg:block">
        <motion.div animate={{ y: [0, -16, 0], rotate: [0, 1, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-20 rounded-[48px] border border-neutral-800 bg-neutral-950/60 shadow-2xl blur-[1px]">
          <div className="absolute left-24 top-20 text-5xl font-semibold text-white/10">Vibro</div>
          <div className="absolute left-44 top-52 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-400/30">Context ready</div>
          <div className="absolute right-28 top-72 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-indigo-300/30">Architecture</div>
          <div className="absolute bottom-36 left-36 rounded-full border border-amber-500/20 bg-amber-500/10 px-5 py-3 text-amber-300/30">Design system</div>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,transparent,rgba(0,0,0,0.75)_52%,#050505_82%)]" />
      </aside>
    </div>
  );
}
