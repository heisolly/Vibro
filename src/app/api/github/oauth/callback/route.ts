import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_code", origin));
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=auth_failed", origin));
  }

  const { session } = data;
  const providerToken = session.provider_token;

  if (!providerToken) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_provider_token", origin));
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_user", origin));
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Vibro-Context-OS",
    },
  });

  if (!githubUserResponse.ok) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=user_fetch_failed", origin));
  }

  const githubUser = await githubUserResponse.json();

  const { error: dbError } = await supabase.from("github_connections").upsert(
    {
      user_id: user.id,
      github_user_id: githubUser.id,
      github_username: githubUser.login,
      github_avatar_url: githubUser.avatar_url,
      access_token: providerToken,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (dbError) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=db_error", origin));
  }

  return NextResponse.redirect(new URL("/workspace/onboard?github=connected&step=2", origin));
}
