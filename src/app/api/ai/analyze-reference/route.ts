import { NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

/* ─────────────────────────────────────────────────────────────────
   SYSTEM INSTRUCTION — Optical Design Auditor
   Forces Gemini to act as a strict frontend architect with
   no hallucination and layer-by-layer visual chain-of-thought.
───────────────────────────────────────────────────────────────── */
const VISION_SYSTEM_INSTRUCTION = `You are an expert Frontend Architect and Optical Design Auditor. Your SOLE task is to analyze a UI reference (screenshot or video frame) and produce a PIXEL-PERFECT IMPLEMENTATION SPECIFICATION.

STRICT RULES:
1. ZERO HALLUCINATIONS — Only describe what is EXPLICITLY visible. Do not guess or invent elements.
2. TECHNICAL PRECISION — Use CSS terms: HSL values, px/rem units, flexbox/grid vocabulary, absolute/relative positioning.
3. ROLE ACCURACY — Write as a command for a pixel-perfect coding bot. The tone must be that of a Senior Frontend Engineer demanding exact reproduction.
4. MEASURE EVERYTHING — Estimate sizes using a 4px grid system. E.g., not "small padding" but "padding: 8px 16px (2/4 grid units)".
5. NAMED COLORS FORBIDDEN — Always convert to hex or hsl().
6. DO NOT SIMPLIFY — If you see 32 specific elements, document all 32.

OUTPUT: A single JSON object with NO markdown, NO explanation. Just raw JSON.
CRITICAL JSON RULE: You MUST correctly escape all double quotes (\") and newlines (\\n) inside string values to ensure JSON.parse works perfectly. Do NOT output invalid JSON or trailing commas.`;

/* ─────────────────────────────────────────────────────────────────
   MULTI-STEP CHAIN-OF-THOUGHT ANALYSIS PROMPT
───────────────────────────────────────────────────────────────── */
const buildVisionAnalysisPrompt = (fileCount: number) => `
You are analyzing ${fileCount} uploaded UI reference file${fileCount > 1 ? "s" : ""}. Follow these 4 steps EXACTLY before generating the output:

STEP 1: [TECHNICAL AUDIT]
- Extract ALL exact Hex/HSL colors visible (background, text, borders, shadows, accents, gradients).
- Identify ALL typography: font family, weight, size in px, line-height, letter-spacing, text-transform.
- Measure ALL spacing using a 4px grid system (margins, padding, gaps).
- Note all border-radius values in px.
- Catalog all shadow definitions.

STEP 2: [LAYOUT MAPPING]
- Define the complete DOM hierarchy (outer wrapper → sections → cards → elements).
- Identify all positioning logic: Flexbox (direction, alignment, justify), Grid (columns, rows, gaps), or Absolute/Fixed positioning.
- Note all breakpoints or responsive adaptations visible.

STEP 3: [CONSTRAINTS DEFINITION]
- Define what is explicitly NOT present (e.g., "No scrollbars visible", "No hover states shown", "No images, only icons").
- List every element that must NOT be added or assumed.

STEP 4: [GENERATE MASTER PROMPT]
Now generate the final output JSON with a field called "masterPrompt" that reads like a strict technical brief for a senior engineer. The tone: professional, commanding, zero ambiguity.

The masterPrompt MUST use these exact headers:
- Role & Goal
- Typography
- Color Palette  
- Layout Structure
- Section Details (one subsection per major UI region)
- Animations & Interactions
- Responsive Behavior
- Performance Rules
- Visual Accuracy Rules
- Implementation Instructions

The JSON schema must be:
{
  "masterPrompt": "string — The complete pixel-perfect specification for a senior engineer. Minimum 500 words. Must be comprehensive and self-contained so another AI can fully recreate the UI without seeing the original.",
  "projectName": "string",
  "uiStyle": "string",
  "theme": "light | dark",
  "fonts": { "heading": "string", "body": "string", "mono": "string" },
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "foreground": "#hex",
    "muted": "#hex",
    "destructive": "#hex",
    "success": "#hex",
    "warning": "#hex",
    "border": "#hex"
  },
  "cssVariables": { "detected": [], "extracted": {} },
  "spacing": { "base": 4, "scale": [4,8,12,16,24,32,48,64,96,128], "detectedUnit": "px" },
  "borderRadius": { "none": "0px", "sm": "Xpx", "md": "Xpx", "lg": "Xpx", "full": "9999px", "style": "sharp | rounded | pill" },
  "shadows": { "sm": "css", "md": "css", "lg": "css", "xl": "css" },
  "typography": {
    "h1": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX", "letterSpacing": "Xem" },
    "h2": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX" },
    "h3": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX" },
    "body": { "fontSize": "Xpx", "fontWeight": "400", "lineHeight": "1.6" },
    "caption": { "fontSize": "Xpx", "fontWeight": "500", "lineHeight": "1.4" },
    "code": { "fontSize": "Xpx", "fontWeight": "400" }
  },
  "detectedComponents": ["array of every UI component/section visible"],
  "componentStyle": "string",
  "animationStyle": "string",
  "tokens": {
    "description": "string",
    "darkModeSupport": true,
    "responsive": true,
    "accessibilityLevel": "AA"
  }
}`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }
    if (files.length > 5) {
      return NextResponse.json({ error: "Maximum 5 files allowed." }, { status: 400 });
    }

    const SUPPORTED = new Set([
      "image/png","image/jpeg","image/jpg","image/webp","image/gif",
      "video/mp4","video/webm","video/quicktime",
    ]);

    // Convert files to Gemini vision parts
    const imageParts: { inline_data: { mime_type: string; data: string } }[] = [];
    for (const file of files) {
      if (!SUPPORTED.has(file.type)) {
        return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 400 });
      }
      const ab = await file.arrayBuffer();
      const b64 = Buffer.from(ab).toString("base64");
      const mime = file.type === "video/quicktime" ? "video/mp4" : file.type;
      imageParts.push({ inline_data: { mime_type: mime, data: b64 } });
    }

    const geminiBody = {
      contents: [{
        role: "user",
        parts: [
          ...imageParts,
          { text: buildVisionAnalysisPrompt(files.length) },
        ],
      }],
      systemInstruction: { parts: [{ text: VISION_SYSTEM_INSTRUCTION }] },
      generationConfig: {
        temperature: 0.1,      // Very low — precision over creativity
        maxOutputTokens: 16384, // Allow long masterPrompt
        responseMimeType: "application/json",
      },
    };

    const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini Vision Error:", err);
      return NextResponse.json({ error: `Gemini API error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let result: any;
    try {
      result = JSON.parse(rawText);
    } catch (_) {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        console.error("Could not parse Gemini vision response:", rawText.slice(0, 500));
        return NextResponse.json({ error: "AI returned malformed analysis." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, filesAnalyzed: files.length, ...result });

  } catch (error: any) {
    console.error("Reference Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed." }, { status: 500 });
  }
}
