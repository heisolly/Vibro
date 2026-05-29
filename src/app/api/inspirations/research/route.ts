import { NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { runInspirationResearch } from "@/lib/inspiration-research";
import type { InspirationItem, InspirationSearchMode } from "@/lib/inspiration";
import type { inspirationResearchTask } from "@/trigger/inspiration-research";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = String(body.prompt || "");
    const activeTab = String(body.activeTab || "landing");
    const workspaceSlug = String(body.workspaceSlug || "workspace");
    const workspaceDescription = String(body.workspaceDescription || "");
    const mode = (body.mode === "expand" ? "expand" : "fresh") as InspirationSearchMode;
    const items = (body.items || []) as InspirationItem[];

    if (!prompt.trim() && !workspaceDescription.trim()) {
      return NextResponse.json({ error: "Research prompt is required." }, { status: 400 });
    }

    let trigger: { queued: boolean; id?: string; error?: string } = { queued: false };
    try {
      const handle = await tasks.trigger<typeof inspirationResearchTask>(
        "inspiration-research",
        { prompt, activeTab, workspaceDescription, mode, items },
        { tags: ["vibro", "inspiration", `mode_${mode}`] }
      );
      trigger = { queued: true, id: handle.id };
    } catch (error) {
      trigger = { queued: false, error: error instanceof Error ? error.message : "Trigger unavailable" };
    }

    const run = await runInspirationResearch({
      prompt,
      activeTab,
      workspaceDescription,
      mode,
      items,
      maxResults: 8,
    });

    try {
      const supabase = await createClient();
      const auth = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
      if (auth.data.user) {
        await supabase.from("inspiration_research_runs").insert({
          user_id: auth.data.user.id,
          workspace_slug: workspaceSlug,
          prompt,
          active_tab: activeTab,
          mode,
          provider: run.provider,
          query: run.query,
          search_results: run.searchResults,
          analyses: run.analyses,
          architecture: run.architecture || null,
          warning: run.warning || null,
        });
      }
    } catch {
    }

    return NextResponse.json({ success: true, trigger, run });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Research failed." }, { status: 500 });
  }
}
