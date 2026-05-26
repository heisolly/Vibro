import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=github_denied", origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_code", origin));
  }

  const storedState = req.cookies.get("github_oauth_state")?.value;
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=state_mismatch", origin));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${origin}/api/github/oauth/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_client_config", origin));
  }

  let accessToken: string;
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error) {
      return NextResponse.redirect(new URL("/workspace/onboard?error=token_exchange_failed", origin));
    }
    accessToken = tokenData.access_token;
  } catch {
    return NextResponse.redirect(new URL("/workspace/onboard?error=token_exchange_failed", origin));
  }

  let githubUser: { id: number; login: string; avatar_url: string };
  try {
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Vibro-Context-OS",
      },
    });
    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/workspace/onboard?error=user_fetch_failed", origin));
    }
    githubUser = await userRes.json();
  } catch {
    return NextResponse.redirect(new URL("/workspace/onboard?error=user_fetch_failed", origin));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_user", origin));
  }

  const { error: dbError } = await supabase.from("github_connections").upsert(
    {
      user_id: user.id,
      github_user_id: githubUser.id,
      github_username: githubUser.login,
      github_avatar_url: githubUser.avatar_url,
      access_token: accessToken,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (dbError) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=db_error", origin));
  }

  const response = NextResponse.redirect(new URL("/workspace/onboard?github=connected", origin));
  response.cookies.set("github_oauth_state", "", { maxAge: 0, path: "/" });
  return response;
}
