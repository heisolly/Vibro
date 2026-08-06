import { NextResponse } from "next/server";
import { createInspirationAnalysis, type InspirationItem } from "@/lib/inspiration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = (body.items || []) as InspirationItem[];
    const prompt = String(body.prompt || "");
    const seed = `${prompt} ${items.map((item) => `${item.title} ${item.description || ""} ${item.tags.join(" ")}`).join(" ")}`;
    const analysis = createInspirationAnalysis(seed, items.flatMap((item) => item.tags));

    return NextResponse.json({
      success: true,
      analysis,
      summary: {
        referenceCount: items.length,
        extractedPatterns: analysis.layoutPatterns,
        designSystemInfluence: analysis.designSystemInfluence,
        architectureInfluence: analysis.architectureInfluence,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed." }, { status: 500 });
  }
}
