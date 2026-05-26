import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: repos } = await supabase
    .from("github_repos")
    .select("*")
    .eq("user_id", user.id)
    .eq("connected", true);

  return NextResponse.json({ connectedRepos: repos || [] });
}
