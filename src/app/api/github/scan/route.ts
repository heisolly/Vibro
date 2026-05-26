import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getGitHubToken, getRepoTree, getFileContent, inferFramework, inferEndpoints, extractDesignTokens, getLatestCommitSha } from "@/lib/github";
import type { FileNode, ScanResult, FrameworkInfo, EndpointInfo, DecisionInfo } from "@/lib/github-types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getGitHubToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  const body = await req.json();
  const { repo_id, repo_full_name, branch } = body;

  if (!repo_id || !repo_full_name) {
    return NextResponse.json({ error: "Missing repo_id and repo_full_name" }, { status: 400 });
  }

  const scanBranch = branch || "main";

  const { data: scan, error: insertError } = await supabase
    .from("code_scans")
    .insert({
      repo_id,
      user_id: user.id,
      branch: scanBranch,
      status: "scanning",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  try {
    const commitSha = await getLatestCommitSha(token, repo_full_name, scanBranch);
    const tree = await getRepoTree(token, repo_full_name, scanBranch);

    const fileTree = buildFileTree(tree);
    const textFiles = tree.filter((entry) => entry.type === "blob" && isTextFile(entry.path));

    const fileContents: { path: string; content: string }[] = [];
    for (const file of textFiles.slice(0, 200)) {
      const content = await getFileContent(token, repo_full_name, file.path, scanBranch);
      if (content) fileContents.push({ path: file.path, content });
    }

    const frameworks = inferFramework(tree);
    const frameworkDetails: FrameworkInfo[] = frameworks.map((name) => ({
      name,
      type: categorizeFramework(name),
      detected: [name],
    }));

    const endpoints = inferEndpoints(fileContents);
    const designTokens = extractDesignTokens(fileContents);

    const deps = extractDependencies(fileContents);
    const decisions = extractDecisions(fileContents, frameworks);

    const result: ScanResult = {
      frameworks: frameworkDetails,
      fileTree,
      endpoints,
      dependencies: deps.dependencies,
      devDependencies: deps.devDependencies,
      designTokens: Object.keys(designTokens.colors).length > 0 ? {
        colors: designTokens.colors,
        typography: designTokens.typography,
        spacing: designTokens.spacing,
        borderRadius: designTokens.borderRadius,
        shadows: designTokens.shadows,
        source: fileContents.filter((f) => /\.(css|scss)$/.test(f.path)).map((f) => f.path),
      } : null,
      database: null,
      configs: [],
      decisions,
    };

    await supabase
      .from("code_scans")
      .update({
        status: "complete",
        commit_sha: commitSha,
        scan_data: result as any,
        frameworks: frameworkDetails as any,
        endpoints: endpoints as any,
        dependencies: deps.dependencies as any,
        file_tree: fileTree as any,
        design_tokens: designTokens as any,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id);

    return NextResponse.json({
      success: true,
      scan_id: scan.id,
      result,
    });
  } catch (error) {
    await supabase
      .from("code_scans")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Scan failed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scan failed" },
      { status: 500 }
    );
  }
}

function buildFileTree(tree: { path: string; type: string }[]): FileNode[] {
  const root: FileNode[] = [];
  const map = new Map<string, FileNode>();

  for (const entry of tree.sort((a, b) => a.path.localeCompare(b.path))) {
    const parts = entry.path.split("/");
    let current = root;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      let node = map.get(currentPath);
      if (!node) {
        node = {
          path: currentPath,
          name: part,
          type: i === parts.length - 1 ? (entry.type === "tree" ? "dir" : "file") : "dir",
          children: i < parts.length - 1 ? [] : undefined,
        };
        map.set(currentPath, node);
        current.push(node);
      }
      if (node.children) current = node.children;
    }
  }

  return root;
}

function isTextFile(path: string): boolean {
  const ext = path.split(".").pop()?.toLowerCase();
  const textExts = new Set([
    "js", "ts", "jsx", "tsx", "json", "md", "css", "scss", "less", "html", "py", "rb",
    "yml", "yaml", "toml", "env", "gitignore", "dockerfile", "config", "prisma", "sql",
    "graphql", "vue", "svelte", "astro", "mjs", "cjs", "mts", "cts", "xml", "svg",
  ]);
  const skipDirs = ["node_modules", ".git", "dist", "build", ".next", "coverage", ".cache"];
  if (skipDirs.some((d) => path.includes(`/${d}/`) || path.startsWith(`${d}/`))) return false;
  return textExts.has(ext || "");
}

function categorizeFramework(name: string): FrameworkInfo["type"] {
  if (["Next.js", "React", "Vue.js", "Angular", "Svelte", "Tailwind", "SCSS"].includes(name)) return "frontend";
  if (["Node.js", "Express", "Django", "Rails", "Python"].includes(name)) return "backend";
  if (["PostgreSQL", "Prisma", "Redis", "Supabase"].includes(name)) return "database";
  if (["Docker"].includes(name)) return "infra";
  if (["TypeScript"].includes(name)) return "frontend";
  return "frontend";
}

function extractDependencies(files: { path: string; content: string }[]): { dependencies: Record<string, string>; devDependencies: Record<string, string> } {
  const deps: Record<string, string> = {};
  const devDeps: Record<string, string> = {};

  for (const file of files) {
    if (file.path === "package.json") {
      try {
        const pkg = JSON.parse(file.content);
        Object.assign(deps, pkg.dependencies || {});
        Object.assign(devDeps, pkg.devDependencies || {});
      } catch {}
    }
  }

  return { dependencies: deps, devDependencies: devDeps };
}

function extractDecisions(files: { path: string; content: string }[], frameworks: string[]): DecisionInfo[] {
  const decisions: DecisionInfo[] = [];

  if (frameworks.includes("Next.js")) {
    decisions.push({
      category: "Framework",
      decision: "Next.js (React)",
      rationale: "SSR/SSG with file-based routing and API routes.",
      file: "next.config.*",
    });
  }
  if (frameworks.includes("Tailwind")) {
    decisions.push({
      category: "Styling",
      decision: "Tailwind CSS",
      rationale: "Utility-first CSS with design token customization via tailwind.config.",
      file: "tailwind.config.*",
    });
  }
  if (frameworks.includes("TypeScript")) {
    decisions.push({
      category: "Language",
      decision: "TypeScript",
      rationale: "Static typing for maintainability and developer experience.",
      file: "tsconfig.json",
    });
  }
  if (frameworks.includes("Prisma")) {
    decisions.push({
      category: "Database ORM",
      decision: "Prisma",
      rationale: "Type-safe database client with schema migrations.",
      file: "prisma/schema.prisma",
    });
  }
  if (frameworks.includes("Supabase")) {
    decisions.push({
      category: "Backend",
      decision: "Supabase",
      rationale: "Managed Postgres, auth, and realtime subscriptions.",
      file: "supabase/*",
    });
  }

  return decisions;
}
