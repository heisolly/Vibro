import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug param" }, { status: 400 });
  }

  let query = supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_slug", slug)
    .order("created_at", { ascending: false });

  if (user) {
    const { data: connection } = await supabase
      .from("github_connections")
      .select("github_username")
      .eq("user_id", user.id)
      .single();

    if (connection) {
      query = query.or(
        `and(invited_by_user_id.eq.${user.id}),and(invited_github_login.eq.${connection.github_username})`
      );
    } else {
      query = query.eq("invited_by_user_id", user.id);
    }
  }

  const { data } = await query;

  return NextResponse.json({ invites: data || [] });
}
