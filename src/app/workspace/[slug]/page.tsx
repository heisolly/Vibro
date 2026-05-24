"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { demoUser, projectStorageKey, userStorageKey, type VibroBoard, type VibroProject, type VibroUser } from "@/lib/vibro";
import type { ContextWorkspace } from "@/lib/context-workspace";
import { MaterialIcon, VibroMark, WorkspaceRail, spring } from "@/components/vibro/ui";

type WorkspaceMode = "brief" | "agent" | "boards";
type Provider = "gemini" | "mistral";
type Theme = "light" | "dark";

type RunState = {
  status: "idle" | "running" | "done" | "error";
  message?: string;
  trigger?: { queued: boolean; id: string; status: string; error?: string };
};

const starterPrompt =
  "Build a modern Context OS workspace that captures product intent, design system, architecture board, inspiration references, context bundle, and MCP handoff. Use a clean Gemini-like canvas, Linear-level structure, and subtle micro animations.";

const boardLabels: Record<VibroBoard, string> = {
  home: "Overview",
  design: "Design",
  architecture: "Architecture",
  inspiration: "Inspiration",
  bundle: "Bundle",
  handoff: "Handoff",
};

export default function WorkspacePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [user, setUser] = useState<VibroUser>(demoUser);
  const [project, setProject] = useState<VibroProject | null>(null);
  const [mode, setMode] = useState<WorkspaceMode>("brief");
  const [activeBoard, setActiveBoard] = useState<VibroBoard>("home");
  const [brief, setBrief] = useState("");
  const [provider, setProvider] = useState<Provider>("gemini");
  const [theme, setTheme] = useState<Theme>("light");
  const [workspace, setWorkspace] = useState<ContextWorkspace | null>(null);
  const [run, setRun] = useState<RunState>({ status: "idle" });
  const [integrationStatus, setIntegrationStatus] = useState<string>("checking");

  useEffect(() => {
    const storedTheme = localStorage.getItem("vibro-theme") as Theme | null;
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);

    const storedUser = localStorage.getItem(userStorageKey);
    const parsedUser = storedUser ? JSON.parse(storedUser) as VibroUser : demoUser;
    setUser(parsedUser);

    const storedProjects = localStorage.getItem(projectStorageKey(parsedUser.id));
    const projects = storedProjects ? JSON.parse(storedProjects) as VibroProject[] : [];
    const found = projects.find((item) => item.slug === slug);
    const fallback = {
      id: slug,
      name: slug.replace(/-/g, " "),
      slug,
      region: "European Union",
      description: "Context OS workspace for project planning and AI handoff.",
      createdAt: new Date().toISOString(),
    };
    setProject(found || fallback);

    const storedWorkspace = localStorage.getItem(`vibro-context-${slug}`);
    if (storedWorkspace) {
      setWorkspace(JSON.parse(storedWorkspace));
      setMode("boards");
    }
  }, [slug]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vibro-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("/api/integrations/status")
      .then((response) => response.json())
      .then((status) => {
        const connected = [
          status.liveblocks?.connected && "Liveblocks",
          status.trigger?.connected && "Trigger",
          status.ai?.gemini && "Gemini",
          status.ai?.mistral && "Mistral",
        ].filter(Boolean);
        setIntegrationStatus(connected.length ? connected.join(" + ") : "local mode");
      })
      .catch(() => setIntegrationStatus("local mode"));
  }, []);

  const projectName = useMemo(() => {
    const raw = project?.name || slug || "Vibro";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [project?.name, slug]);

  const agentSteps = useMemo(() => {
    const source = workspace;
    return [
      ["Project brief captured", source?.productBrief.goals[0] || "Extracting product goals", "lightbulb"],
      ["Design system composed", source?.designSystem.mood || "Choosing visual language", "palette"],
      ["Architecture board mapped", source?.architecture.modules[0] || "Mapping core modules", "schema"],
      ["Inspiration board arranged", source?.inspiration.references[0] || "Sorting reference systems", "auto_stories"],
      ["Context bundle prepared", source?.contextBundle.version || "Versioning project memory", "inventory_2"],
      ["MCP handoff ready", source?.contextBundle.mcpHandoff[0] || "Preparing agent handoff", "hub"],
    ];
  }, [workspace]);

  async function generateWorkspace() {
    const prompt = brief.trim() || starterPrompt;
    setBrief(prompt);
    setRun({ status: "running", message: "Queuing Trigger.dev run and asking the model..." });
    setMode("agent");

    try {
      const response = await fetch("/api/vibro/context-workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, prompt, provider }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");

      setWorkspace(data.workspace);
      localStorage.setItem(`vibro-context-${slug}`, JSON.stringify(data.workspace));
      setRun({
        status: "done",
        message: data.recovered ? "AI provider recovered with a local context bundle." : "Context workspace generated.",
        trigger: data.trigger,
      });
    } catch (error) {
      setRun({ status: "error", message: error instanceof Error ? error.message : "Generation failed" });
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#080b12] text-white" : "bg-[#fbfaf7] text-[#101418]"}`}>
      <WorkspaceRail activeBoard={activeBoard} user={user} />
      <div className="min-h-screen pl-[52px]">
        <TopBar
          projectName={projectName}
          mode={mode}
          setMode={setMode}
          theme={theme}
          setTheme={setTheme}
          integrationStatus={integrationStatus}
        />
        <AnimatePresence mode="wait">
          {mode === "brief" && (
            <BriefCanvas
              key="brief"
              projectName={projectName}
              brief={brief}
              setBrief={setBrief}
              provider={provider}
              setProvider={setProvider}
              onGenerate={generateWorkspace}
              isRunning={run.status === "running"}
              theme={theme}
            />
          )}
          {mode === "agent" && (
            <AgentRun
              key="agent"
              projectName={projectName}
              brief={brief}
              run={run}
              steps={agentSteps}
              workspace={workspace}
              onOpenBoards={() => setMode("boards")}
              onRetry={generateWorkspace}
              theme={theme}
            />
          )}
          {mode === "boards" && (
            <Boards
              key="boards"
              project={project}
              workspace={workspace}
              activeBoard={activeBoard}
              setActiveBoard={setActiveBoard}
              theme={theme}
              onGenerateAgain={() => setMode("brief")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TopBar({
  projectName,
  mode,
  setMode,
  theme,
  setTheme,
  integrationStatus,
}: {
  projectName: string;
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  integrationStatus: string;
}) {
  return (
    <header className={`sticky top-0 z-30 flex h-14 items-center justify-between border-b px-5 backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-[#080b12]/78" : "border-black/8 bg-[#fbfaf7]/78"}`}>
      <div className="flex items-center gap-3 text-sm">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#0c111d] shadow-lg shadow-blue-500/15">
          <VibroMark dark size={18} />
        </div>
        <button className="inline-flex items-center gap-1 font-semibold">
          {projectName}
          <MaterialIcon name="keyboard_arrow_down" size={16} />
        </button>
        <span className={`hidden rounded-full px-2.5 py-1 text-xs md:inline-flex ${theme === "dark" ? "bg-white/8 text-white/60" : "bg-white text-slate-500 shadow-sm"}`}>
          {integrationStatus}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <SegmentedButton
          items={[
            ["brief", "Describe"],
            ["agent", "Agent"],
            ["boards", "Boards"],
          ]}
          active={mode}
          onSelect={(value) => setMode(value as WorkspaceMode)}
          theme={theme}
        />
        <IconButton label="Toggle theme" icon={theme === "dark" ? "light_mode" : "dark_mode"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} theme={theme} />
        <button className={`rounded-lg border px-3 py-2 text-sm font-semibold ${theme === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>Share</button>
        <button className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500">Launch</button>
      </div>
    </header>
  );
}

function BriefCanvas({
  projectName,
  brief,
  setBrief,
  provider,
  setProvider,
  onGenerate,
  isRunning,
  theme,
}: {
  projectName: string;
  brief: string;
  setBrief: (value: string) => void;
  provider: Provider;
  setProvider: (value: Provider) => void;
  onGenerate: () => void;
  isRunning: boolean;
  theme: Theme;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={spring}
      className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_50%_52%,rgba(157,215,255,0.62),rgba(214,236,255,0.24)_48%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(26,115,232,0.08),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.10),transparent_28%)] animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mb-4 text-sm ${theme === "dark" ? "text-white/55" : "text-slate-500"}`}>
          {projectName} workspace
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.05 }} className="text-4xl font-light md:text-5xl">
          Describe {projectName}?
        </motion.h1>

        <motion.div layout className={`mx-auto mt-9 overflow-hidden rounded-[26px] border text-left shadow-[0_28px_90px_-28px_rgba(59,130,246,0.45)] ${theme === "dark" ? "border-white/10 bg-[#111722]/90" : "border-slate-200 bg-white/96"}`}>
          <textarea
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            placeholder="Describe the product, users, pages, data, integrations, visual style, and what Vibro should prepare..."
            rows={5}
            className={`w-full resize-none bg-transparent px-6 py-5 text-sm leading-6 outline-none ${theme === "dark" ? "placeholder:text-white/35" : "placeholder:text-slate-400"}`}
          />
          <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 ${theme === "dark" ? "border-white/10" : "border-slate-100"}`}>
            <div className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-white/60" : "text-slate-600"}`}>
              <IconButton label="Add reference" icon="add" theme={theme} />
              <SoftPill icon="attach_file" label="References" theme={theme} />
              <SoftPill icon="palette" label="Design style" theme={theme} />
              <select value={provider} onChange={(event) => setProvider(event.target.value as Provider)} className={`h-9 rounded-full border px-3 text-sm outline-none ${theme === "dark" ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                <option value="gemini">Gemini Flash</option>
                <option value="mistral">Mistral</option>
              </select>
            </div>
            <button onClick={onGenerate} disabled={isRunning} className="grid h-11 w-11 place-items-center rounded-full bg-[#101418] text-white shadow-lg shadow-blue-500/20 hover:scale-105 disabled:opacity-60">
              <MaterialIcon name={isRunning ? "hourglass_top" : "arrow_upward"} size={19} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}

function AgentRun({
  projectName,
  brief,
  run,
  steps,
  workspace,
  onOpenBoards,
  onRetry,
  theme,
}: {
  projectName: string;
  brief: string;
  run: RunState;
  steps: string[][];
  workspace: ContextWorkspace | null;
  onOpenBoards: () => void;
  onRetry: () => void;
  theme: Theme;
}) {
  const activeIndex = run.status === "done" ? steps.length : Math.min(steps.length - 1, 2);

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={spring}
      className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-4xl flex-col px-6 pb-28 pt-12"
    >
      <div className={`mx-auto max-w-3xl rounded-xl px-5 py-4 text-sm leading-6 ${theme === "dark" ? "bg-white/8 text-white/80" : "bg-[#dedbd4] text-neutral-900"}`}>
        <span className="font-semibold">Title: {projectName} Context Workspace.</span>
        <span className="ml-2">Instruction: {brief || starterPrompt}</span>
        <button className="mt-2 block w-full text-center text-xs opacity-55">Show more</button>
      </div>

      <div className="mt-9 space-y-9">
        <AgentMessage
          title="Vibro"
          subtitle={`Agent detected prompt score: ${workspace?.score || 88}%`}
          body={workspace?.summary || `Preparing ${projectName} as a Context OS. I am creating the product brief, design system, architecture board, inspiration map, and MCP handoff.`}
          theme={theme}
        />

        <div className="flex gap-3">
          <AvatarDot theme={theme} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">Vibro</div>
            <div className="mt-4 space-y-3">
              {steps.map(([label, detail, icon], index) => {
                const done = run.status === "done" || index < activeIndex;
                const active = run.status === "running" && index === activeIndex;
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: done || active ? 1 : 0.36, x: 0 }}
                    transition={{ ...spring, delay: index * 0.04 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <MaterialIcon name={done ? "check_circle" : icon} size={18} className={done ? "text-emerald-600" : active ? "animate-pulse text-blue-500" : "opacity-45"} />
                    <span>{label}</span>
                    {(active || run.status === "done") && <span className="opacity-50">{detail}</span>}
                  </motion.div>
                );
              })}
            </div>

            <RunResult run={run} workspace={workspace} onOpenBoards={onOpenBoards} onRetry={onRetry} theme={theme} />
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function RunResult({ run, workspace, onOpenBoards, onRetry, theme }: { run: RunState; workspace: ContextWorkspace | null; onOpenBoards: () => void; onRetry: () => void; theme: Theme }) {
  if (run.status === "running") {
    return <div className="mt-6 text-sm opacity-60">{run.message}</div>;
  }

  if (run.status === "error") {
    return (
      <div className={`mt-6 rounded-xl border p-4 ${theme === "dark" ? "border-red-400/20 bg-red-400/10" : "border-red-100 bg-red-50"}`}>
        <div className="font-semibold text-red-600">{run.message}</div>
        <button onClick={onRetry} className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Try again</button>
      </div>
    );
  }

  if (run.status !== "done" || !workspace) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 rounded-xl border p-4 ${theme === "dark" ? "border-white/10 bg-white/6" : "border-slate-200 bg-white"}`}>
      <div className={`flex items-center justify-between border-b pb-3 ${theme === "dark" ? "border-white/10" : "border-slate-100"}`}>
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <MaterialIcon name="check_circle" size={18} className="text-emerald-600" />
            Built {workspace.projectName} context workspace
          </div>
          <div className="mt-1 text-xs opacity-55">
            Trigger: {run.trigger?.status || "queued"} {run.trigger?.id ? `(${run.trigger.id})` : ""}
          </div>
        </div>
        <button onClick={onOpenBoards} className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white">
          Open boards
        </button>
      </div>
      <div className="mt-4 text-xs font-semibold uppercase opacity-50">What Vibro prepared</div>
      <ul className="mt-3 space-y-3 text-sm leading-6 opacity-75">
        {workspace.productBrief.goals.slice(0, 3).map((goal) => <li key={goal}>- {goal}</li>)}
      </ul>
    </motion.div>
  );
}

function Boards({
  project,
  workspace,
  activeBoard,
  setActiveBoard,
  theme,
  onGenerateAgain,
}: {
  project: VibroProject | null;
  workspace: ContextWorkspace | null;
  activeBoard: VibroBoard;
  setActiveBoard: (board: VibroBoard) => void;
  theme: Theme;
  onGenerateAgain: () => void;
}) {
  const fallbackName = project?.name || "Workspace";

  return (
    <main className="mx-auto max-w-6xl px-8 py-8 pb-32">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm opacity-55">{workspace?.tagline || `Describe ${fallbackName}`}</p>
          <h1 className="mt-1 text-3xl font-semibold">{workspace?.projectName || fallbackName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(boardLabels) as VibroBoard[]).map((board) => (
            <button key={board} onClick={() => setActiveBoard(board)} className={`rounded-full px-3 py-1.5 text-sm transition ${activeBoard === board ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : theme === "dark" ? "bg-white/7 text-white/70 hover:bg-white/12" : "bg-white text-slate-600 shadow-sm hover:text-slate-950"}`}>
              {boardLabels[board]}
            </button>
          ))}
          <button onClick={onGenerateAgain} className={`rounded-full px-3 py-1.5 text-sm ${theme === "dark" ? "bg-white/7" : "bg-slate-100"}`}>Regenerate</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeBoard} initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={spring}>
          {activeBoard === "home" && <HomeBoard workspace={workspace} theme={theme} />}
          {activeBoard === "design" && <DesignBoard workspace={workspace} theme={theme} />}
          {activeBoard === "architecture" && <ArchitectureBoard workspace={workspace} theme={theme} />}
          {activeBoard === "inspiration" && <ListBoard title="Inspiration board" subtitle="References, moods, and UX patterns." icon="auto_stories" items={[...(workspace?.inspiration.references || []), ...(workspace?.inspiration.notes || [])]} theme={theme} />}
          {activeBoard === "bundle" && <BundleBoard workspace={workspace} theme={theme} />}
          {activeBoard === "handoff" && <ListBoard title="MCP handoff" subtitle="The context bridge into AI tools." icon="hub" items={workspace?.contextBundle.mcpHandoff || []} theme={theme} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function HomeBoard({ workspace, theme }: { workspace: ContextWorkspace | null; theme: Theme }) {
  const cards = [
    ["Prompt score", `${workspace?.score || 0}%`, "target"],
    ["Design system", workspace?.designSystem.mood || "Ready", "palette"],
    ["Context bundle", workspace?.contextBundle.version || "v1.0", "inventory_2"],
    ["Model", workspace?.model || "Gemini Flash", "psychology"],
  ];

  return (
    <BoardShell title="Project dashboard" subtitle={workspace?.summary || "Generate a context workspace to fill this dashboard."}>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(([title, value, icon]) => (
          <MetricCard key={title} title={title} value={value} icon={icon} theme={theme} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ListPanel title="Goals" items={workspace?.productBrief.goals || []} theme={theme} />
        <ListPanel title="Workflows" items={workspace?.productBrief.workflows || []} theme={theme} />
      </div>
    </BoardShell>
  );
}

function DesignBoard({ workspace, theme }: { workspace: ContextWorkspace | null; theme: Theme }) {
  return (
    <BoardShell title="Design system" subtitle={workspace?.designSystem.mood || "Visual language for the product."}>
      <div className="grid gap-4 md:grid-cols-5">
        {(workspace?.designSystem.colors || ["#F8FCFF", "#D8EEFF", "#1A73E8", "#111827", "#64748B"]).map((color) => (
          <div key={color} className={`rounded-xl border p-3 ${theme === "dark" ? "border-white/10 bg-white/6" : "border-slate-200 bg-white"}`}>
            <div className="h-24 rounded-lg border border-black/5" style={{ backgroundColor: color }} />
            <div className="mt-3 font-mono text-xs opacity-65">{color}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <ListPanel title="Typography" items={workspace?.designSystem.typography || []} theme={theme} />
        <ListPanel title="Components" items={workspace?.designSystem.components || []} theme={theme} />
        <ListPanel title="Motion" items={workspace?.designSystem.motion || []} theme={theme} />
      </div>
    </BoardShell>
  );
}

function ArchitectureBoard({ workspace, theme }: { workspace: ContextWorkspace | null; theme: Theme }) {
  return (
    <BoardShell title="Architecture board" subtitle="Modules, data, integrations, and risks before code.">
      <div className="grid gap-4 md:grid-cols-2">
        <ListPanel title="Modules" items={workspace?.architecture.modules || []} theme={theme} />
        <ListPanel title="Data" items={workspace?.architecture.data || []} theme={theme} />
        <ListPanel title="Integrations" items={workspace?.architecture.integrations || []} theme={theme} />
        <ListPanel title="Risks" items={workspace?.architecture.risks || []} theme={theme} />
      </div>
    </BoardShell>
  );
}

function BundleBoard({ workspace, theme }: { workspace: ContextWorkspace | null; theme: Theme }) {
  const files = workspace?.contextBundle.files || [];
  return (
    <BoardShell title="Context bundle" subtitle="Versioned project memory for coding agents and MCP tools.">
      <div className={`rounded-xl border p-5 font-mono text-xs leading-7 ${theme === "dark" ? "border-white/10 bg-black/40 text-emerald-300" : "border-slate-200 bg-neutral-950 text-emerald-300"}`}>
        <div>{">"} bundle: {workspace?.contextBundle.version || "v1.0"}</div>
        {files.map((file) => <div key={file}>{">"} {file}: ready</div>)}
      </div>
    </BoardShell>
  );
}

function ListBoard({ title, subtitle, icon, items, theme }: { title: string; subtitle: string; icon: string; items: string[]; theme: Theme }) {
  return (
    <BoardShell title={title} subtitle={subtitle}>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <motion.div key={item} whileHover={{ y: -4 }} className={`rounded-xl border p-5 ${theme === "dark" ? "border-white/10 bg-white/6" : "border-slate-200 bg-white"}`}>
            <MaterialIcon name={icon} size={20} className="text-blue-500" />
            <div className="mt-5 text-sm font-semibold leading-6">{item}</div>
          </motion.div>
        ))}
      </div>
    </BoardShell>
  );
}

function BoardShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="max-w-3xl text-sm leading-6 opacity-55">{subtitle}</p>
        <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function MetricCard({ title, value, icon, theme }: { title: string; value: string; icon: string; theme: Theme }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`rounded-xl border p-4 shadow-sm ${theme === "dark" ? "border-white/10 bg-white/6" : "border-slate-200 bg-white"}`}>
      <MaterialIcon name={icon} size={20} className="text-blue-500" />
      <div className="mt-5 text-sm opacity-55">{title}</div>
      <div className="mt-1 line-clamp-2 text-lg font-semibold">{value}</div>
    </motion.div>
  );
}

function ListPanel({ title, items, theme }: { title: string; items: string[]; theme: Theme }) {
  return (
    <div className={`rounded-xl border p-5 ${theme === "dark" ? "border-white/10 bg-white/6" : "border-slate-200 bg-white"}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 space-y-3 text-sm leading-6 opacity-70">
        {(items.length ? items : ["Generate this board from the prompt."]).map((item) => <div key={item}>- {item}</div>)}
      </div>
    </div>
  );
}

function AgentMessage({ title, subtitle, body, theme }: { title: string; subtitle: string; body: string; theme: Theme }) {
  return (
    <div className="flex gap-3">
      <AvatarDot theme={theme} />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-2 text-sm font-medium text-emerald-600">{subtitle}</div>
        <p className="mt-3 max-w-3xl text-sm leading-6 opacity-85">{body}</p>
      </div>
    </div>
  );
}

function AvatarDot({ theme }: { theme: Theme }) {
  return (
    <div className={`grid h-6 w-6 place-items-center rounded-full border ${theme === "dark" ? "border-white/10 bg-white/8" : "border-slate-200 bg-white"}`}>
      <VibroMark size={14} />
    </div>
  );
}

function IconButton({ label, icon, onClick, theme }: { label: string; icon: string; onClick?: () => void; theme: Theme }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className={`grid h-9 w-9 place-items-center rounded-full transition hover:scale-105 ${theme === "dark" ? "bg-white/7 text-white/75 hover:bg-white/12" : "bg-white text-slate-600 shadow-sm hover:text-slate-950"}`}>
      <MaterialIcon name={icon} size={18} />
    </button>
  );
}

function SoftPill({ icon, label, theme }: { icon: string; label: string; theme: Theme }) {
  return (
    <button className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm ${theme === "dark" ? "bg-white/7 text-white/70" : "bg-slate-50 text-slate-600"}`}>
      <MaterialIcon name={icon} size={16} />
      {label}
    </button>
  );
}

function SegmentedButton({ items, active, onSelect, theme }: { items: string[][]; active: string; onSelect: (value: string) => void; theme: Theme }) {
  return (
    <div className={`hidden rounded-full p-1 md:flex ${theme === "dark" ? "bg-white/7" : "bg-slate-100"}`}>
      {items.map(([value, label]) => (
        <button key={value} onClick={() => onSelect(value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active === value ? "bg-white text-slate-950 shadow-sm" : theme === "dark" ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-950"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
