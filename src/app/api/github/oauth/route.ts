import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import * as crypto from "crypto";

const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_user", origin));
  }

  const state = crypto.randomUUID();
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/workspace/onboard?error=no_client_id", origin));
  }

  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${origin}/api/github/oauth/callback`;
  const scope = "repo,user";
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

  const response = NextResponse.redirect(githubUrl);
  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return response;
}
