import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await supabase.from("github_connections").delete().eq("user_id", user.id);
  await supabase.from("github_repos").delete().eq("user_id", user.id);
  await supabase.from("sync_subscriptions").delete().eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
