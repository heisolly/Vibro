import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { ContextBundle } from "@/lib/github-types";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ bundles: [] });
  }

  const { data } = await supabase
    .from("context_bundles")
    .select("*, github_repos!inner(repo_full_name, repo_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!data) {
    return NextResponse.json({ bundles: [] });
  }

  const bundles = (data as any[]).reduce<ContextBundle[]>((acc, b) => {
    const seen = new Set<string>();
    if (!acc.some((existing) => existing.repo_id === b.repo_id)) {
      acc.push(b);
      seen.add(b.repo_id);
    }
    return acc;
  }, []);

  return NextResponse.json({ bundles });
}
