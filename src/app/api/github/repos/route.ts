import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getGitHubToken, listReposOnGitHub } from "@/lib/github";

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

  try {
    const repos = await listReposOnGitHub(token);

    const { data: connected } = await supabase
      .from("github_repos")
      .select("repo_github_id")
      .eq("user_id", user.id)
      .eq("connected", true);

    const connectedIds = new Set((connected || []).map((r: any) => r.repo_github_id));

    const enriched = repos.map((repo) => ({
      ...repo,
      already_connected: connectedIds.has(repo.id),
    }));

    return NextResponse.json({ repos: enriched });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch repos" },
      { status: 500 }
    );
  }
}
