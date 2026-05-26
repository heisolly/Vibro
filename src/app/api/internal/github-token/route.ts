import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const internalSecret = process.env.TRIGGER_INTERNAL_SECRET;

  if (internalSecret && authHeader !== `Bearer ${internalSecret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { user_id } = body;

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("github_connections")
    .select("access_token")
    .eq("user_id", user_id)
    .single();

  if (!data?.access_token) {
    return NextResponse.json({ error: "No token found" }, { status: 404 });
  }

  return NextResponse.json({ access_token: data.access_token });
}
