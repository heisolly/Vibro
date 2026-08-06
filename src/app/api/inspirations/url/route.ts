import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createInspirationItem, getSourceDomain } from "@/lib/inspiration";

function extractMeta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"));
  return match?.[1] || "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = String(body.url || "");
    const workspaceSlug = String(body.workspaceSlug || "workspace");
    const tab = String(body.tab || "landing");

    if (!url.startsWith("http")) {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    let title = getSourceDomain(url) || url;
    let description = "External UI reference.";
    let thumbnailUrl = "";

    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Vibro-Context-OS" },
        signal: AbortSignal.timeout(6000),
      });
      const html = await response.text();
      title = extractMeta(html, "og:title") || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || title;
      description = extractMeta(html, "og:description") || extractMeta(html, "description") || description;
      thumbnailUrl = extractMeta(html, "og:image");
    } catch {
    }

    const supabase = await createClient();
    const auth = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
    const user = auth.data.user;

    const item = createInspirationItem({
      type: "url",
      title,
      description,
      url,
      sourceDomain: getSourceDomain(url),
      thumbnailUrl,
      tags: [tab],
      tab,
      createdBy: user?.id || "demo-user",
    });

    if (user) {
      await supabase.from("inspiration_assets").insert({
        user_id: user.id,
        workspace_slug: workspaceSlug,
        source_type: "url",
        title: item.title,
        description: item.description,
        source_url: item.url,
        thumbnail_url: item.thumbnailUrl || null,
        tags: item.tags,
        analysis: item.analysis,
      });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not add URL." }, { status: 500 });
  }
}
