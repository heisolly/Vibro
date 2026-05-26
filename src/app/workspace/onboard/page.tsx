"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStorageKey, type VibroUser } from "@/lib/vibro";
import { MaterialIcon, VibroMark, spring } from "@/components/vibro/ui";
import GitHubConnect from "@/components/GitHubConnect";

const updateItems = [
  ["Context digest", "Weekly summary of decisions and handoff changes."],
  ["Onboarding emails", "Short guidance while the workspace is getting shaped."],
  ["Product updates", "New Vibro features for context, boards, and AI handoff."],
];

const steps = [
  { eyebrow: "01", title: "Set up your profile", subtitle: "Choose how you appear when shaping context with your team." },
  { eyebrow: "02", title: "Invite teammates", subtitle: "Bring in the people who own the product, design, architecture, and decisions." },
  { eyebrow: "03", title: "Connect sources", subtitle: "Optional references Vibro can use when it prepares the project memory." },
  { eyebrow: "04", title: "Subscribe to updates", subtitle: "Pick what Vibro should send while your context workspace evolves." },
];

export default function WorkspaceOnboardPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("vibro");
  const [step, setStep] = useState(0);
  const [profileName, setProfileName] = useState("Micheal Oluwayanmi");
  const [profileTitle, setProfileTitle] = useState("Software engineer");
  const [inviteEmails, setInviteEmails] = useState("");
  const [toggles, setToggles] = useState([true, true, false]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("slug") || "vibro");
    const stepParam = params.get("step");
    if (stepParam) setStep(Number(stepParam));
    const stored = localStorage.getItem(userStorageKey);
    if (!stored) return;
    const parsed = JSON.parse(stored) as VibroUser;
    setProfileName(parsed.name);
  }, []);

  const finish = () => router.push(`/workspace/${slug}`);
  const projectName = slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 aurora-bg animate-pulse-slow" />
      <div className="pointer-events-none absolute inset-0 vibro-grain" />

      <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
        <button onClick={finish} className="inline-flex items-center gap-3">
          <VibroMark size={32} />
          <span className="font-display text-xl">Vibro</span>
        </button>
        <button onClick={finish} className="rounded-full border border-border bg-card/80 px-5 py-2 text-sm font-medium text-muted-foreground shadow-soft backdrop-blur transition hover:text-foreground">
          Skip setup
        </button>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-3xl items-center px-8 pb-16">
        <div className="w-full">
          <div className="mb-12 flex items-center gap-3 font-ai text-sm text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-semibold">{steps[step].eyebrow}</span>
            <span>Setting up <span className="font-semibold text-foreground">{projectName}</span></span>
            <span className="text-muted-foreground/40">—</span>
            <span className="text-muted-foreground/60">Step {step + 1} of 4</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={spring}
            >
              {step === 0 && (
                <div>
                  <h1 className="font-display text-6xl leading-[1.04] sm:text-7xl md:text-[80px]">{steps[0].title}</h1>
                  <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-xl">{steps[0].subtitle}</p>
                  <div className="mt-10 space-y-8">
                    <div>
                      <span className="mb-3 block text-sm font-medium text-muted-foreground">Name and picture</span>
                      <div className="flex items-center gap-5">
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.48_0.18_258)] text-white shadow-lg">
                          <MaterialIcon name="person" size={28} />
                        </div>
                        <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="h-14 w-full rounded-2xl border border-border bg-secondary/60 px-5 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
                      </div>
                    </div>
                    <div>
                      <span className="mb-3 block text-sm font-medium text-muted-foreground">Title</span>
                      <input value={profileTitle} onChange={(event) => setProfileTitle(event.target.value)} placeholder="Software engineer" className="h-14 w-full rounded-2xl border border-border bg-secondary/60 px-5 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10" />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h1 className="font-display text-6xl leading-[1.04] sm:text-7xl md:text-[80px]">{steps[1].title}</h1>
                  <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-xl">{steps[1].subtitle}</p>
                  <div className="mt-10 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Invitations</span>
                      <button className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-secondary hover:text-foreground">
                        <MaterialIcon name="link" size={16} />
                        Copy invite link
                      </button>
                    </div>
                    <textarea
                      value={inviteEmails}
                      onChange={(event) => setInviteEmails(event.target.value)}
                      placeholder="email@gmail.com, email2@gmail.com"
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-border bg-secondary/60 px-5 py-5 text-base leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="font-display text-6xl leading-[1.04] sm:text-7xl md:text-[80px]">{steps[2].title}</h1>
                  <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-xl">{steps[2].subtitle}</p>
                  <div className="mt-10">
                    <GitHubConnect />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="font-display text-6xl leading-[1.04] sm:text-7xl md:text-[80px]">{steps[3].title}</h1>
                  <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-xl">{steps[3].subtitle}</p>
                  <div className="mt-10 space-y-4">
                    {updateItems.map(([title, description], index) => (
                      <button
                        key={title}
                        onClick={() => setToggles((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/45 p-5 text-left transition hover:bg-secondary/75"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-base font-semibold">{title}</div>
                          <div className="mt-1 text-sm leading-5 text-muted-foreground">{description}</div>
                        </div>
                        <span className={`flex h-8 w-14 shrink-0 rounded-full p-1 transition ${toggles[index] ? "bg-primary" : "bg-border"}`}>
                          <motion.span layout className="h-6 w-6 rounded-full bg-white shadow-md" animate={{ x: toggles[index] ? 26 : 0 }} transition={spring} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <motion.button
                  key={index}
                  onClick={() => setStep(index)}
                  animate={{
                    width: index === step ? 40 : 10,
                    backgroundColor: index === step ? "var(--primary, #3b82f6)" : "var(--border, oklch(92% .012 250))",
                  }}
                  className="h-2.5 rounded-full"
                  transition={spring}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-muted-foreground transition hover:text-foreground" onClick={() => (step === 0 ? finish() : setStep(step - 1))}>
                {step === 0 ? "Skip" : "Back"}
              </button>
              <button
                onClick={() => (step === 3 ? finish() : setStep(step + 1))}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#101418] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {step === 3 ? "Finish setup" : "Continue"}
                <MaterialIcon name={step === 3 ? "check" : "arrow_forward"} size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
