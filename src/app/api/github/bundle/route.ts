import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { CodeScan, ContextBundle, ArchitectureMap, EndpointRegistry } from "@/lib/github-types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { repo_id, scan_id } = body;

  if (!repo_id) {
    return NextResponse.json({ error: "Missing repo_id" }, { status: 400 });
  }

  let scanData: CodeScan | null = null;

  if (scan_id) {
    const { data } = await supabase
      .from("code_scans")
      .select("*")
      .eq("id", scan_id)
      .eq("user_id", user.id)
      .single();
    scanData = data;
  } else {
    const { data } = await supabase
      .from("code_scans")
      .select("*")
      .eq("repo_id", repo_id)
      .eq("user_id", user.id)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    scanData = data;
  }

  if (!scanData?.scan_data) {
    return NextResponse.json({ error: "No completed scan found. Run a scan first." }, { status: 400 });
  }

  const s = scanData.scan_data;
  const repoFullName = s.fileTree?.[0]?.path?.split("/")[0] || "unknown";

  const architecture: ArchitectureMap = {
    frontend: (s.frameworks || []).filter((f: any) => f.type === "frontend").map((f: any) => f.name),
    backend: (s.frameworks || []).filter((f: any) => f.type === "backend").map((f: any) => f.name),
    apis: (s.endpoints || []).map((e: any) => `${e.method} ${e.path}`),
    database: (s.frameworks || []).filter((f: any) => f.type === "database").map((f: any) => f.name),
    infrastructure: (s.frameworks || []).filter((f: any) => f.type === "infra").map((f: any) => f.name),
    integrations: (s.frameworks || []).filter((f: any) => f.type === "testing").map((f: any) => f.name),
  };

  const registry: EndpointRegistry = {
    total: (s.endpoints || []).length,
    routes: s.endpoints || [],
  };

  const { data: existing } = await supabase
    .from("context_bundles")
    .select("version")
    .eq("repo_id", repo_id)
    .eq("user_id", user.id)
    .order("version", { ascending: false })
    .limit(1);

  const nextVersion = (existing?.[0]?.version || 0) + 1;

  const bundleData = {
    projectName: repoFullName.split("/").pop() || repoFullName,
    tagline: `Full codebase context for ${repoFullName}`,
    summary: `Auto-generated context bundle from GitHub scan of ${repoFullName}. Detected ${(s.frameworks || []).length} frameworks, ${(s.endpoints || []).length} endpoints, and ${Object.keys(s.dependencies || {}).length} dependencies.`,
    architecture,
    designSystem: s.designTokens,
    endpoints: registry,
    decisionLog: s.decisions || [],
  };

  const { data: bundle, error } = await supabase
    .from("context_bundles")
    .insert({
      repo_id,
      user_id: user.id,
      scan_id: scanData.id,
      version: nextVersion,
      bundle_data: bundleData as any,
      architecture_map: architecture as any,
      endpoint_registry: registry as any,
      decision_log: (s.decisions || []) as any,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, bundle });
}
