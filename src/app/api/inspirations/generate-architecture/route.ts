import { NextResponse } from "next/server";
import { generateArchitectureFromEvidence } from "@/lib/inspiration-research";
import type { InspirationLinkAnalysis } from "@/lib/inspiration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = String(body.prompt || "");
    const evidence = (body.evidence || []) as InspirationLinkAnalysis[];

    if (!prompt.trim() && evidence.length === 0) {
      return NextResponse.json({ error: "Prompt or evidence is required." }, { status: 400 });
    }

    const architecture = await generateArchitectureFromEvidence(prompt, evidence);

    return NextResponse.json({
      success: true,
      architecture,
      evidenceCount: evidence.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Architecture generation failed." }, { status: 500 });
  }
}
