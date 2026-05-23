import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Handles the exchange of code for OAuth session at http://localhost:3000/auth/callback
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Once signed in, redirect directly to the workspaces project management screen
  return NextResponse.redirect(`${origin}/?screen=projects`);
}
