import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { subscription_id, repo_id, new_sha, changed_files } = body;

  if (!subscription_id && !repo_id) {
    return NextResponse.json({ error: "Missing subscription_id or repo_id" }, { status: 400 });
  }

  if (subscription_id) {
    await supabase
      .from("sync_subscriptions")
      .update({
        last_known_commit_sha: new_sha,
        drift_detected: true,
        drift_approved: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription_id);
  }

  const changeSummary = (changed_files || []).map(
    (f: any) => `${f.status}: ${f.filename}`
  );

  return NextResponse.json({
    success: true,
    drift_detected: true,
    new_sha,
    changes: changeSummary,
    needs_approval: true,
  });
}
