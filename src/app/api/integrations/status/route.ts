import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  let githubConnected = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("github_connections")
        .select("id")
        .eq("user_id", user.id)
        .single();
      githubConnected = Boolean(data);
    }
  } catch {
    // Not authenticated — that's fine
  }

  return NextResponse.json({
    liveblocks: {
      connected: Boolean(process.env.LIVEBLOCKS_SECRET_KEY && process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY),
      authEndpoint: "/api/liveblocks-auth",
    },
    trigger: {
      connected: Boolean(process.env.TRIGGER_SECRET_KEY || process.env.TRIGGER_API_KEY),
      projectId: process.env.TRIGGER_PROJECT_ID || "proj_etubdjhavymculizpbxm",
      config: "trigger.config.ts",
    },
    ai: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      mistral: Boolean(process.env.MISTRAL_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
    },
    github: {
      connected: githubConnected,
      configured: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  });
}
