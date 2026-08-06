import { NextResponse } from "next/server";
import { searchInspirationSources } from "@/lib/inspiration-research";
import type { InspirationItem, InspirationSearchMode } from "@/lib/inspiration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = String(body.prompt || "");
    const activeTab = String(body.activeTab || "landing");
    const workspaceDescription = String(body.workspaceDescription || "");
    const items = (body.items || []) as InspirationItem[];
    const mode = (body.mode === "expand" ? "expand" : "fresh") as InspirationSearchMode;

    if (!prompt.trim() && !workspaceDescription.trim()) {
      return NextResponse.json({ error: "Search prompt is required." }, { status: 400 });
    }

    const result = await searchInspirationSources({
      prompt,
      activeTab,
      workspaceDescription,
      mode,
      items,
      maxResults: 8,
    });

    const tags = Array.from(new Set(items.flatMap((item) => item.tags))).slice(0, 6);
    const contextSummary =
      mode === "expand" && items.length
        ? `Expanding from ${items.length} selected or pinned reference${items.length === 1 ? "" : "s"}${tags.length ? `: ${tags.join(", ")}` : ""}.`
        : `Searching from the description for ${activeTab} inspiration.`;

    return NextResponse.json({
      success: true,
      provider: result.provider,
      warning: result.warning,
      query: result.query,
      mode,
      contextSummary,
      results: result.results,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Web inspiration search failed." }, { status: 500 });
  }
}
