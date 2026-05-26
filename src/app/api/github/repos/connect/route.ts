import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getGitHubToken } from "@/lib/github";

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
  const { repo_github_id, repo_name, repo_full_name, repo_url, default_branch, description, is_private, connect } = body;

  if (!repo_github_id || !repo_full_name) {
    return NextResponse.json({ error: "Missing repo info" }, { status: 400 });
  }

  if (connect === false) {
    await supabase
      .from("github_repos")
      .update({ connected: false, updated_at: new Date().toISOString() })
      .eq("repo_github_id", repo_github_id)
      .eq("user_id", user.id);

    return NextResponse.json({ success: true, connected: false });
  }

  const { error } = await supabase.from("github_repos").upsert(
    {
      user_id: user.id,
      repo_github_id,
      repo_name: repo_name || repo_full_name.split("/")[1],
      repo_full_name,
      repo_url: repo_url || `https://github.com/${repo_full_name}`,
      default_branch: default_branch || "main",
      description: description || null,
      is_private: is_private || false,
      connected: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, repo_github_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, connected: true });
}
