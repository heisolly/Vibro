import { NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

/* ─────────────────────────────────────────────────────────────────
   SYSTEM PROMPT — Vibro Design System Engine
───────────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are Vibro's AI Design System Engine — a Senior Frontend Architect AI. Your job is to analyze a user's description and generate TWO things:

1. A complete, production-ready design system JSON (tokens, colors, typography, spacing, etc.)
2. A MASTER PROMPT — a pixel-perfect specification that a senior engineer could use to rebuild this exact design from scratch.

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no code fences. Just raw JSON.
CRITICAL JSON RULE: You MUST correctly escape all double quotes (\") and newlines (\\n) inside string values to ensure JSON.parse works perfectly. Do NOT output invalid JSON or trailing commas.

The masterPrompt field must:
- Open with: "Act as a senior frontend engineer. Prioritize accuracy over creativity. Do not introduce ideas that aren't in the reference."
- Cover ALL of these sections with technical precision: Role & Goal, Typography (font family, weights, sizes in px, line-height), Color Palette (all semantic roles with exact hex values), Layout Structure (DOM hierarchy, flexbox/grid specs), Section Details (one subsection per major UI region), Animations & Interactions, Responsive Behavior, Performance Rules, Visual Accuracy Rules, Implementation Instructions.
- Use CSS terms only: px values, hex/hsl colors, flex/grid vocabulary. Never vague descriptions.
- Minimum 400 words.

Full JSON schema:
{
  "masterPrompt": "string — the complete Senior Engineer implementation spec",
  "projectName": "string — derived from the prompt",
  "uiStyle": "string — e.g. 'FinTech Dashboard', 'Brutalist SaaS', 'Minimal Creative', 'Productivity App'",
  "theme": "light | dark",
  "fonts": {
    "heading": "Google Font name",
    "body": "Google Font name",
    "mono": "Google Font name for code"
  },
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
  "spacing": {
    "base": 4,
    "scale": [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  },
  "borderRadius": {
    "none": "0px",
    "sm": "Xpx",
    "md": "Xpx",
    "lg": "Xpx",
    "full": "9999px",
    "style": "sharp | rounded | pill"
  },
  "shadows": {
    "sm": "CSS shadow string",
    "md": "CSS shadow string",
    "lg": "CSS shadow string",
    "xl": "CSS shadow string"
  },
  "typography": {
    "h1": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX", "letterSpacing": "Xem" },
    "h2": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX" },
    "h3": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX" },
    "body": { "fontSize": "Xpx", "fontWeight": "400", "lineHeight": "1.6" },
    "caption": { "fontSize": "Xpx", "fontWeight": "500", "lineHeight": "1.4" },
    "code": { "fontSize": "Xpx", "fontWeight": "400" }
  },
  "componentStyle": "string — e.g. 'glassmorphism', 'brutalist', 'minimal', 'neumorphism', 'flat'",
  "animationStyle": "string — e.g. 'smooth', 'snappy', 'none', 'spring'",
  "iconLibrary": "lucide | phosphor | heroicons | tabler",
  "components": ["array of recommended primary UI components specific to this project type"],
  "tokens": {
    "description": "string — one-line technical summary of the design system",
    "darkModeSupport": false,
    "responsive": true,
    "accessibilityLevel": "AA | AAA"
  }
}

Rules:
- Derive ALL values from the user's prompt intelligently
- Use real, aesthetically appropriate production color palettes — never generic placeholder colors
- Font choices must be available on Google Fonts
- Component list must be specific to the project type
- masterPrompt must be technical, precise, and complete enough to code from
- Return ONLY the JSON — nothing else`;

/**
 * POST /api/ai/design-system
 */
export async function POST(req: Request) {
  try {
    const { prompt, color, borderRadius, stack } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from environment variables." },
        { status: 500 }
      );
    }

    // Build enriched user prompt with overrides
    let userPrompt = `Generate a complete design system for: "${prompt}"`;
    if (color) userPrompt += `\n- Primary color override: ${color}`;
    if (borderRadius !== undefined) userPrompt += `\n- Border radius base: ${borderRadius}px`;
    if (stack) userPrompt += `\n- Target component stack: ${stack}`;
    userPrompt += `\n\nIMPORTANT: The masterPrompt field is critical. Make it a detailed, technical implementation specification — minimum 400 words — that a senior engineer could use to build this design system from scratch without seeing the prompt.`;

    const geminiBody = {
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    };

    const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      console.error("Gemini Design System Error:", err);
      return NextResponse.json({ error: err }, { status: geminiResponse.status });
    }

    const data = await geminiResponse.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let designSystem: any;
    try {
      designSystem = JSON.parse(rawText);
    } catch (_) {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        designSystem = JSON.parse(match[0]);
      } else {
        console.error("Could not parse Gemini response:", rawText.slice(0, 500));
        return NextResponse.json(
          { error: "AI returned malformed design system." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("Design System Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate design system" }, { status: 500 });
  }
}
