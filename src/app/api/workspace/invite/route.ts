import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workspace_slug, collaborators } = await req.json();

  if (!workspace_slug || !collaborators?.length) {
    return NextResponse.json({ error: "Missing workspace_slug or collaborators" }, { status: 400 });
  }

  const created: { login: string; email?: string }[] = [];

  for (const c of collaborators) {
    const { data: existing } = await supabase
      .from("workspace_invites")
      .select("id")
      .eq("workspace_slug", workspace_slug)
      .eq("invited_github_login", c.login)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) continue;

    const { error } = await supabase.from("workspace_invites").insert({
      workspace_slug,
      invited_by_user_id: user.id,
      invited_github_login: c.login,
      invited_github_avatar_url: c.avatar_url,
      invited_email: c.email || null,
      status: "pending",
    });

    if (!error) {
      created.push({ login: c.login, email: c.email });

      if (c.email && resend) {
        try {
          await resend.emails.send({
            from: "Vibro <invites@vibro.context>",
            to: c.email,
            subject: `You've been invited to ${workspace_slug} on Vibro`,
            text: `Hi @${c.login},\n\nYou've been invited to collaborate on the "${workspace_slug}" workspace in Vibro.\n\nVibro is a Context OS for AI-assisted development — boards, context bundles, and sync for your team.\n\nJoin here: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/workspace/${workspace_slug}\n\nSee you there!`,
          });
        } catch {
          // Email send failure doesn't block invite creation
        }
      }
    }
  }

  return NextResponse.json({ success: true, created });
}
