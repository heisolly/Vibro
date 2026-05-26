import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_user", origin));
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/api/github/oauth/callback`,
      scopes: "repo,user",
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=auth_failed", origin));
  }

  return NextResponse.redirect(data.url);
}
