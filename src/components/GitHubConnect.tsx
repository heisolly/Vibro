"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/vibro/ui";
import type { GitHubConnection, GitHubRepoListItem, CodeScan, ContextBundle } from "@/lib/github-types";

type Collaborator = {
  login: string;
  avatar_url: string;
  id: number;
  role: string;
};

type Step = "idle" | "selecting" | "scanning" | "bundling" | "done" | "collaborators";

const errorMessages: Record<string, string> = {
  no_code: "GitHub did not return an authorization code.",
  auth_failed: "Authentication with GitHub failed.",
  no_provider_token: "Could not get GitHub access token from Supabase.",
  no_user: "Session expired. Please sign in again.",
  user_fetch_failed: "Failed to fetch GitHub user info.",
  db_error: "Failed to save connection. Try again.",
};

export default function GitHubConnect() {
  const [step, setStep] = useState<Step>("idle");
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [repos, setRepos] = useState<GitHubRepoListItem[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  const [scanningRepo, setScanningRepo] = useState<string | null>(null);
  const [bundle, setBundle] = useState<ContextBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      setError(errorMessages[err] || `Connection error: ${err}`);
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (params.get("github") === "connected") {
      window.history.replaceState({}, "", window.location.pathname);
      verifyAndLoadRepos();
    }
  }, []);

  async function verifyAndLoadRepos() {
    setLoading(true);
    try {
      const statusRes = await fetch("/api/github/connection/status");
      const status = await statusRes.json();
      if (!status.connected) {
        setError("GitHub connection not found. Try connecting again.");
        return;
      }
      setConnection(status.connection);

      const reposRes = await fetch("/api/github/repos");
      if (!reposRes.ok) throw new Error((await reposRes.json()).error || "Failed to load repos");
      const reposData = await reposRes.json();
      setRepos(reposData.repos || []);
      setStep("selecting");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to verify connection");
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    setError(null);
    setLoading(true);
    try {
      const statusRes = await fetch("/api/github/connection/status");
      if (statusRes.ok) {
        const status = await statusRes.json();
        if (status.connected) {
          setConnection(status.connection);
          setStep("selecting");
          const reposRes = await fetch("/api/github/repos");
          if (reposRes.ok) setRepos((await reposRes.json()).repos || []);
          return;
        }
      }
      window.location.href = "/api/github/oauth";
    } catch {
      window.location.href = "/api/github/oauth";
    } finally {
      setLoading(false);
    }
  }

  function toggleRepo(id: number) {
    setSelectedRepos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleConnectRepos() {
    setError(null);
    setLoading(true);
    try {
      for (const repoId of selectedRepos) {
        const repo = repos.find((r) => r.id === repoId);
        if (!repo) continue;
        await fetch("/api/github/repos/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repo_github_id: repo.id,
            repo_name: repo.name,
            repo_full_name: repo.full_name,
            repo_url: repo.html_url,
            default_branch: repo.default_branch,
            description: repo.description,
            is_private: repo.private,
            connect: true,
          }),
        });
      }

      setStep("scanning");
      await scanAndBundle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect repos");
      setStep("selecting");
    } finally {
      setLoading(false);
    }
  }

  async function scanAndBundle() {
    const firstSelected = repos.find((r) => selectedRepos.has(r.id));
    if (!firstSelected) { setStep("done"); return; }

    setScanningRepo(firstSelected.full_name);
    setLoading(true);

    try {
      const listRes = await fetch("/api/github/repos/connect/list");
      const { connectedRepos } = await listRes.json();
      const repo = connectedRepos?.[0];
      if (!repo) throw new Error("Connected repo not found");

      const scanRes = await fetch("/api/github/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_id: repo.id,
          repo_full_name: repo.repo_full_name,
          branch: repo.default_branch || "main",
        }),
      });

      if (!scanRes.ok) throw new Error((await scanRes.json()).error || "Scan failed");
      const scanData = await scanRes.json();

      setStep("bundling");

      const bundleRes = await fetch("/api/github/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_id: repo.id, scan_id: scanData.scan_id }),
      });

      if (!bundleRes.ok) throw new Error((await bundleRes.json()).error || "Bundle generation failed");
      const bundleData = await bundleRes.json();

      setBundle(bundleData.bundle);
      setStep("collaborators");

      await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_id: repo.id }),
      });

      const collabRes = await fetch("/api/github/collaborators");
      if (collabRes.ok) {
        const collabData = await collabRes.json();
        if (collabData.collaborators?.length > 0) {
          setCollaborators(collabData.collaborators);
          return;
        }
      }
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
      setStep("selecting");
    } finally {
      setLoading(false);
      setScanningRepo(null);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await fetch("/api/github/disconnect", { method: "POST" });
      setConnection(null);
      setRepos([]);
      setSelectedRepos(new Set());
      setBundle(null);
      setStep("idle");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Disconnect failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "idle") {
    return (
      <div className="space-y-4">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-black bg-white p-4 text-left shadow-[4px_4px_0_rgba(0,0,0,1)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(0,0,0,1)] disabled:opacity-50"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-white">
            <MaterialIcon name="code" size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">GitHub Repository</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {loading ? "Connecting..." : "Connect code signals without turning Vibro into a code editor."}
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#101418] px-4 py-2 text-xs font-semibold text-white">
            {loading ? "..." : "Connect"}
          </span>
        </button>
      </div>
    );
  }

  if (step === "selecting") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <MaterialIcon name="code" size={16} />
            </span>
            <span className="text-sm font-semibold">GitHub</span>
            {connection && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {connection.github_username}
              </span>
            )}
          </div>
          <button onClick={handleDisconnect} className="text-xs text-muted-foreground underline transition hover:text-foreground">
            Disconnect
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="max-h-52 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="py-4 text-center text-sm text-muted-foreground">Loading repos...</div>
          ) : repos.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">No repos found.</div>
          ) : (
            repos.map((repo) => {
              const selected = selectedRepos.has(repo.id);
              return (
                <button
                  key={repo.id}
                  onClick={() => toggleRepo(repo.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selected ? "border-black bg-secondary/80 shadow-sm" : "border-border bg-secondary/45 hover:bg-secondary/70"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded border-2 text-xs font-bold transition ${
                      selected ? "border-black bg-black text-white" : "border-muted-foreground/30 text-transparent"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{repo.full_name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {repo.description || repo.language || repo.default_branch}
                    </div>
                  </div>
                  {repo.already_connected && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Connected
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <button
          onClick={handleConnectRepos}
          disabled={selectedRepos.size === 0 || loading}
          className="w-full rounded-full bg-[#101418] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] disabled:opacity-40"
        >
          {loading ? "Processing..." : `Connect ${selectedRepos.size} repo${selectedRepos.size !== 1 ? "s" : ""}`}
        </button>
      </div>
    );
  }

  if (step === "collaborators") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
            <MaterialIcon name="check" size={16} />
          </span>
          <div>
            <div className="text-sm font-semibold">GitHub Repository Connected</div>
            <div className="text-xs text-muted-foreground">
              {bundle?.bundle_data?.projectName} — Context bundle v{bundle?.version || 1}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#F9F9FB] p-4">
          <div className="mb-3 flex items-center gap-2">
            <MaterialIcon name="people" size={18} />
            <span className="text-sm font-semibold">Found {collaborators.length} collaborator{collaborators.length > 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-2">
            {collaborators.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2">
                <img src={c.avatar_url} alt={c.login} className="h-7 w-7 rounded-full" />
                <span className="text-sm font-medium">{c.login}</span>
                <span className="ml-auto rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#6366F1]">{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#EEF2FF] bg-[#F5F5FF] p-4">
          <p className="text-sm leading-6 text-[#444]">
            Add these collaborators to your Vibro workspace so they can see boards, context bundles, and sync status?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("done")}
            className="flex-1 rounded-full border border-[#E5E5E5] bg-white px-5 py-3 text-sm font-medium text-[#555] transition hover:bg-[#F5F5F5]"
          >
            Skip
          </button>
          <button
            onClick={() => setStep("done")}
            className="flex-1 rounded-full bg-[#101418] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
          >
            Add {collaborators.length} collaborator{collaborators.length > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    );
  }

  if (step === "scanning" || step === "bundling") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-black text-white">
            <MaterialIcon name="code" size={16} />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
            </span>
          </span>
          <div>
            <div className="text-sm font-semibold">
              {step === "scanning" ? "Scanning repository..." : "Generating context bundle..."}
            </div>
            {scanningRepo && <div className="text-xs text-muted-foreground">{scanningRepo}</div>}
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <ProgressBar />
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <StepLine step={step === "bundling"} label="Fetching file tree" />
          <StepLine step={step === "bundling"} label="Detecting frameworks & endpoints" />
          <StepLine step={step === "bundling"} label="Extracting design tokens" />
          <StepLine step={false} label={step === "bundling" ? "Assembling context bundle" : "Analyzing code structure"} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
          <MaterialIcon name="check" size={16} />
        </span>
        <div>
          <div className="text-sm font-semibold">GitHub Repository Connected</div>
          <div className="text-xs text-muted-foreground">
            {bundle?.bundle_data?.projectName || repos.find((r) => selectedRepos.has(r.id))?.full_name} — Context bundle v{bundle?.version || 1}
          </div>
        </div>
      </div>

      {bundle && (
        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bundle Summary</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Frameworks: </span>{bundle.bundle_data?.architecture?.frontend?.length || 0} frontend, {bundle.bundle_data?.architecture?.backend?.length || 0} backend</div>
            <div><span className="text-muted-foreground">Endpoints: </span>{bundle.bundle_data?.endpoints?.total || 0}</div>
            <div><span className="text-muted-foreground">Design tokens: </span>{bundle.bundle_data?.designSystem?.source?.length || 0} sources</div>
            <div><span className="text-muted-foreground">Sync: </span>Auto-sync active</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepLine({ step, label }: { step: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[8px] font-bold ${step ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"}`}>
        {step ? "✓" : "·"}
      </span>
      <span className={step ? "text-foreground" : ""}>{label}</span>
    </div>
  );
}

function ProgressBar() {
  return <div className="h-full w-1/2 animate-pulse rounded-full bg-black" />;
}
