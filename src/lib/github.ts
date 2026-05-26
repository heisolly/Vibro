import { createClient } from "@/utils/supabase/server";
import type { GitHubConnection, GitHubRepoListItem } from "./github-types";

export const GITHUB_API = "https://api.github.com";

export function getHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "Vibro-Context-OS",
  };
}

export async function getGitHubConnection(userId: string): Promise<GitHubConnection | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("github_connections")
    .select("id, github_user_id, github_username, github_avatar_url, created_at")
    .eq("user_id", userId)
    .single();

  return data;
}

export async function getGitHubToken(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("github_connections")
    .select("access_token")
    .eq("user_id", userId)
    .single();

  return data?.access_token ?? null;
}

export async function listReposOnGitHub(token: string): Promise<GitHubRepoListItem[]> {
  const repos: GitHubRepoListItem[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${GITHUB_API}/user/repos?per_page=100&page=${page}&sort=updated&type=all`,
      { headers: getHeaders(token) }
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);

    const batch: GitHubRepoListItem[] = await response.json();
    repos.push(...batch);
    hasMore = batch.length === 100;
    page++;
  }

  return repos;
}

export async function getRepoContents(
  token: string,
  repoFullName: string,
  path: string = "",
  branch: string = "main"
): Promise<any[]> {
  const response = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/contents/${path}?ref=${branch}`,
    { headers: getHeaders(token) }
  );

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getFileContent(
  token: string,
  repoFullName: string,
  path: string,
  branch: string = "main"
): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/contents/${path}?ref=${branch}`,
    { headers: getHeaders(token) }
  );

  if (!response.ok) return null;

  const data = await response.json();
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }

  return null;
}

export async function getRepoTree(
  token: string,
  repoFullName: string,
  branch: string = "main"
): Promise<{ path: string; type: "blob" | "tree"; sha: string }[]> {
  const response = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/git/trees/${branch}?recursive=1`,
    { headers: getHeaders(token) }
  );

  if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);

  const data = await response.json();
  return data.tree || [];
}

export async function getLatestCommitSha(
  token: string,
  repoFullName: string,
  branch: string = "main"
): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/commits/${branch}?per_page=1`,
    { headers: getHeaders(token) }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.sha || null;
}

export async function compareCommits(
  token: string,
  repoFullName: string,
  baseSha: string,
  headSha: string
): Promise<{ files: { filename: string; status: string }[] } | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/compare/${baseSha}...${headSha}`,
    { headers: getHeaders(token) }
  );

  if (!response.ok) return null;

  return response.json();
}

export function inferFramework(fileTree: { path: string }[]): string[] {
  const frameworks: string[] = [];
  const allPaths = fileTree.map((f) => f.path);

  const patterns: Record<string, RegExp[]> = {
    "Next.js": [/^next\.config/, /^app\//, /^pages\//, /package\.json.*"next"/],
    React: [/.jsx$/, /.tsx$/, /package\.json.*"react"/],
    "Node.js": [/package\.json/, /\bserver\.(js|ts)$/, /\bindex\.(js|ts)$/],
    Express: [/package\.json.*"express"/, /\broutes?\//, /\bmiddleware\//],
    Django: [/manage\.py$/, /\bsettings\.py$/, /\burls\.py$/, /\bwsgi\.py$/],
    Rails: [/Gemfile.*"rails"/, /\bconfig\/routes\.rb$/, /\bapp\/controllers\//],
    "Vue.js": [/.vue$/, /nuxt\.config/],
    Angular: [/angular\.json$/, /\bmodule\.ts$/, /\bcomponent\.ts$/],
    Svelte: [/.svelte$/, /svelte\.config/],
    Tailwind: [/tailwind\.config/, /postcss\.config.*"tailwind"/, /\btailwind\.css$/],
    SCSS: [/.scss$/, /\bvariables\.scss$/],
    Prisma: [/prisma\/schema\.prisma$/],
    "Supabase": [/supabase\//, /supabase\.(js|ts)$/, /createClient.*supabase/],
    PostgreSQL: [/.sql$/, /prisma\/schema\.prisma/, /migrations\//],
    Redis: [/redis/, /ioredis/],
    Docker: [/Dockerfile/, /docker-compose/],
    Python: [/.py$/],
    TypeScript: [/.ts$/, /.tsx$/, /tsconfig\.json/],
  };

  for (const [framework, regexps] of Object.entries(patterns)) {
    if (regexps.some((r) => allPaths.some((p) => r.test(p)))) {
      frameworks.push(framework);
    }
  }

  return [...new Set(frameworks)];
}

export function inferEndpoints(files: { path: string; content: string }[]): { method: string; path: string; source: string }[] {
  const endpoints: { method: string; path: string; source: string }[] = [];

  const routePatterns = [
    /(?:router|route)\.(get|post|put|patch|delete|options)\s*\(\s*['"]([^'"]+)['"]/gi,
    /@(?:Get|Post|Put|Patch|Delete|Options)\(\s*['"]([^'"]+)['"]\s*\)/g,
    /app\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/gi,
    /\.addRoute\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"](get|post|put|patch|delete)['"]/gi,
  ];

  for (const file of files) {
    const content = file.content;
    if (!content) continue;

    for (const pattern of routePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match.length >= 3) {
          const method = match[1]?.toUpperCase() || "GET";
          const path = match[2] || match[1] || "/";
          endpoints.push({ method, path, source: file.path });
        }
      }
    }
  }

  return endpoints;
}

export function extractDesignTokens(files: { path: string; content: string }[]): Record<string, Record<string, string>> {
  const tokens: Record<string, Record<string, string>> = {
    colors: {},
    typography: {},
    spacing: {},
    borderRadius: {},
    shadows: {},
  };

  const cssVarPattern = /--([\w-]+)\s*:\s*([^;]+)/g;
  const twConfigPattern = /([\w]+):\s*['"]([^'"]+)['"]/g;

  for (const file of files) {
    const ext = file.path.split(".").pop()?.toLowerCase();
    const content = file.content;
    if (!content) continue;

    if (ext === "css" || ext === "scss" || ext === "less") {
      let match;
      while ((match = cssVarPattern.exec(content)) !== null) {
        const name = match[1];
        const value = match[2].trim();
        if (/color/i.test(name) || /^#/.test(value) || /^rgb/.test(value) || /^oklch/.test(value)) {
          tokens.colors[name] = value;
        } else if (/font/i.test(name) || /^[0-9.]+(px|rem|em)$/.test(value)) {
          tokens.typography[name] = value;
        } else if (/spacing|margin|padding|gap/i.test(name) || /^[0-9.]+(px|rem|em)$/.test(value)) {
          tokens.spacing[name] = value;
        } else if (/radius|rounded/i.test(name)) {
          tokens.borderRadius[name] = value;
        } else if (/shadow/i.test(name)) {
          tokens.shadows[name] = value;
        }
      }
    }
  }

  return tokens;
}
