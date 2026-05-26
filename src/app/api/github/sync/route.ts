import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { repo_id } = body;

  if (!repo_id) {
    return NextResponse.json({ error: "Missing repo_id" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("sync_subscriptions")
    .select("id")
    .eq("repo_id", repo_id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase
      .from("sync_subscriptions")
      .update({ active: true, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    return NextResponse.json({ success: true, subscribed: true });
  }

  const { error } = await supabase.from("sync_subscriptions").insert({
    repo_id,
    user_id: user.id,
    active: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, subscribed: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { repo_id } = body;

  if (!repo_id) {
    return NextResponse.json({ error: "Missing repo_id" }, { status: 400 });
  }

  await supabase
    .from("sync_subscriptions")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("repo_id", repo_id)
    .eq("user_id", user.id);

  return NextResponse.json({ success: true, subscribed: false });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subs } = await supabase
    .from("sync_subscriptions")
    .select("*, github_repos(repo_full_name, repo_name)")
    .eq("user_id", user.id)
    .eq("active", true);

  return NextResponse.json({ subscriptions: subs || [] });
}
