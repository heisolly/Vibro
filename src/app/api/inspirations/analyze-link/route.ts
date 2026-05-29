import { NextResponse } from "next/server";
import { analyzeInspirationLink } from "@/lib/inspiration-research";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = String(body.url || "");

    if (!url.startsWith("http")) {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    const analysis = await analyzeInspirationLink({
      url,
      title: body.title ? String(body.title) : undefined,
      prompt: body.prompt ? String(body.prompt) : undefined,
      activeTab: body.activeTab ? String(body.activeTab) : undefined,
      sourceText: body.sourceText ? String(body.sourceText) : undefined,
      thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl) : undefined,
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Link analysis failed." }, { status: 500 });
  }
}
