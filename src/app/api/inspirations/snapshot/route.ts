import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const workspaceSlug = String(body.workspaceSlug || "workspace");
    const snapshot = body.snapshot;
    const influence = body.influence || {};

    if (!snapshot) {
      return NextResponse.json({ error: "Snapshot payload is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const auth = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
    const user = auth.data.user;

    if (!user) {
      return NextResponse.json({
        success: true,
        version: 1,
        persisted: false,
        warning: "Snapshot saved locally. Sign in with Supabase configured to persist versions.",
      });
    }

    const { data: latest } = await supabase
      .from("inspiration_snapshots")
      .select("version")
      .eq("user_id", user.id)
      .eq("workspace_slug", workspaceSlug)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const version = (latest?.version || 0) + 1;
    const { error } = await supabase.from("inspiration_snapshots").insert({
      user_id: user.id,
      workspace_slug: workspaceSlug,
      version,
      snapshot,
      influence,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, persisted: true, version });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Snapshot failed." }, { status: 500 });
  }
}
