import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getGitHubToken, getHeaders, GITHUB_API } from "@/lib/github";

type Collaborator = {
  login: string;
  avatar_url: string;
  id: number;
  role: string;
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getGitHubToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  const { data: repos } = await supabase
    .from("github_repos")
    .select("repo_full_name")
    .eq("user_id", user.id)
    .eq("connected", true);

  if (!repos || repos.length === 0) {
    return NextResponse.json({ collaborators: [] });
  }

  const uniqueLogins = new Set<string>();
  const allCollaborators: Collaborator[] = [];

  for (const repo of repos) {
    const url = `${GITHUB_API}/repos/${repo.repo_full_name}/collaborators?per_page=30`;
    const res = await fetch(url, { headers: getHeaders(token) });
    if (!res.ok) continue;

    const data: any[] = await res.json();
    for (const c of data) {
      if (!uniqueLogins.has(c.login) && c.login !== user.user_metadata?.user_name) {
        uniqueLogins.add(c.login);
        allCollaborators.push({
          login: c.login,
          avatar_url: c.avatar_url,
          id: c.id,
          role: c.role_name || "member",
        });
      }
    }
  }

  return NextResponse.json({ collaborators: allCollaborators });
}
