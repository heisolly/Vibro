import { NextResponse } from "next/server";

export async function GET() {
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
    },
  });
}
