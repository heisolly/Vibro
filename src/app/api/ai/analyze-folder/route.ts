import { NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

/* ─────────────────────────────────────────────────────────────────
   SYSTEM INSTRUCTION
───────────────────────────────────────────────────────────────── */
const FOLDER_SYSTEM_INSTRUCTION = `You are an expert Frontend Architect and Web Design Reverse-Engineer. Your task is to analyze an extracted website's clean source code and design DNA, then produce a PIXEL-PERFECT IMPLEMENTATION SPECIFICATION that reads like a strict technical brief.

STRICT RULES:
1. ZERO HALLUCINATIONS — Only describe what is EXPLICITLY present in the code. Do not guess or invent.
2. TECHNICAL PRECISION — Use exact CSS terms, measured values, hex/hsl colors. No vague descriptions.
3. CODE-FIRST — Your specifications must be so precise that an engineer who never saw the website could rebuild it exactly.
4. EXTRACT CSS VARIABLES — Treat :root CSS variables as the ground truth for design tokens. Always reference them.
5. FRAMEWORK AWARENESS — If Tailwind/Bootstrap/custom tokens are detected, map them to actual computed values.
6. COMPONENT INVENTORY — Document every UI pattern visible in the HTML structure.
7. DO NOT SIMPLIFY — A comprehensive spec is always better than a short one.

OUTPUT: A single valid JSON object. No markdown. No explanation. Just raw JSON.
CRITICAL JSON RULE: You MUST correctly escape all double quotes (\") and newlines (\\n) inside string values to ensure JSON.parse works perfectly. Do NOT output invalid JSON or trailing commas.`;

/* ─────────────────────────────────────────────────────────────────
   HTML CLEANING — Strips noise before sending to Gemini
   Removes: <script>, <svg>, <noscript>, inline event handlers,
   base64 images, comments, and minified class strings.
───────────────────────────────────────────────────────────────── */
function cleanHTML(raw: string): string {
  return raw
    // Remove script blocks entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove inline SVG blobs (preserve structure, kills path data)
    .replace(/<svg[\s\S]*?<\/svg>/gi, "[SVG_ICON]")
    // Remove noscript tags
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove base64 src attributes (huge)
    .replace(/src="data:[^"]+"/g, 'src="[base64_asset]"')
    // Remove style attributes (we get styles from CSS files)
    .replace(/ style="[^"]*"/g, "")
    // Collapse whitespace
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ─────────────────────────────────────────────────────────────────
   CSS DNA EXTRACTION — Pulls only the design token layer
   Extracts: :root vars, class definitions, media queries
   Drops: Base64 fonts, animation keyframes bloat, vendor prefixes
───────────────────────────────────────────────────────────────── */
function extractCSSdna(rawCSS: string): {
  variables: string;
  classes: string;
  mediaQueries: string;
  variableMap: Record<string, string>;
} {
  // Extract all CSS custom properties (--variable-name: value)
  const varMatches = rawCSS.match(/--[\w-]+\s*:\s*[^;]+;/g) ?? [];

  // Build variable value map
  const variableMap: Record<string, string> = {};
  varMatches.forEach(v => {
    const [key, ...rest] = v.replace(";", "").split(":");
    variableMap[key.trim()] = rest.join(":").trim();
  });

  // Clean and extract class definitions (drop keyframes, base64, vendor prefixes)
  const cleanCSS = rawCSS
    .replace(/@keyframes[\s\S]*?\}/g, "")
    .replace(/src:\s*url\(data:[^)]+\)[^;]*;/g, "/* [base64_font] */")
    .replace(/-webkit-[^:]+:[^;]+;/g, "")
    .replace(/-moz-[^:]+:[^;]+;/g, "")
    .replace(/-ms-[^:]+:[^;]+;/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ");

  // Extract :root block (critical DNA)
  const rootBlock = cleanCSS.match(/:root\s*\{[\s\S]*?\}/g)?.join("\n") ?? "";

  // Extract @media queries
  const mediaBlocks = (cleanCSS.match(/@media[\s\S]*?\{[\s\S]*?\}\s*\}/g) ?? [])
    .slice(0, 5).join("\n");

  // Extract class definitions (up to 8000 chars)
  const classSection = cleanCSS
    .replace(/:root\s*\{[\s\S]*?\}/g, "")
    .replace(/@media[\s\S]*?\{[\s\S]*?\}\s*\}/g, "")
    .slice(0, 8000);

  return {
    variables: rootBlock || varMatches.join("\n"),
    classes: classSection,
    mediaQueries: mediaBlocks,
    variableMap,
  };
}

/* ─────────────────────────────────────────────────────────────────
   MASTER PROMPT BUILDER
───────────────────────────────────────────────────────────────── */
function buildFolderAnalysisPrompt(params: {
  folderName: string;
  htmlContent: string;
  cssDNA: { variables: string; classes: string; mediaQueries: string; variableMap: Record<string, string> };
  jsContent: string;
  hasImages: boolean;
  metadata: Record<string, any>;
}): string {
  const { folderName, htmlContent, cssDNA, jsContent, hasImages, metadata } = params;
  const varCount = Object.keys(cssDNA.variableMap).length;

  return `
You are reverse-engineering a real website saved as an HTML folder. Follow the 4-step chain-of-thought analysis below before generating output.

PROJECT METADATA:
- Folder Name: ${folderName}
- Total Files: ${metadata.totalFiles ?? "?"}
- HTML: ${metadata.htmlCount ?? 1} file(s) | CSS: ${metadata.cssCount ?? 0} file(s) | JS: ${metadata.jsCount ?? 0} file(s) | Images: ${metadata.imageCount ?? 0}
- CSS Variables Found: ${varCount}
- Visual Screenshots Provided: ${hasImages ? "YES — use for visual ground truth" : "NO — rely on code only"}

═══════════════════════════════
STEP 1: [TECHNICAL AUDIT]
Extract from the CSS below:
- All color values (hex, hsl, rgb) — map them to semantic roles (background, text, accent, border, etc.)
- All typography rules (font-family, font-size, font-weight, line-height, letter-spacing)
- Spacing rhythm (what px values repeat? Is it a 4px, 8px, or 12px grid?)
- Border-radius values
- Box-shadow definitions
═══════════════════════════════

CSS VARIABLE DNA (${varCount} variables extracted):
\`\`\`css
${cssDNA.variables || "/* No CSS variables found */"}
\`\`\`

CSS CLASS DEFINITIONS (design token layer):
\`\`\`css
${cssDNA.classes.slice(0, 6000)}${cssDNA.classes.length > 6000 ? "\n/* ... truncated */" : ""}
\`\`\`

RESPONSIVE BREAKPOINTS:
\`\`\`css
${cssDNA.mediaQueries || "/* None detected */"}
\`\`\`

═══════════════════════════════
STEP 2: [LAYOUT MAPPING]
From the HTML structure below, identify:
- The top-level layout containers and their roles (navbar, hero, sidebar, content, footer)
- The DOM nesting depth and component pattern (card, list item, grid cell, etc.)
- Flexbox or Grid usage patterns
═══════════════════════════════

CLEANED HTML STRUCTURE (scripts, SVGs, base64 assets removed):
\`\`\`html
${htmlContent.slice(0, 12000)}${htmlContent.length > 12000 ? "\n<!-- ... truncated -->" : ""}
\`\`\`

${jsContent ? `═══════════════════════════════
STEP 2.5: [JAVASCRIPT SIGNALS]
From JS configuration files, extract any theme definitions, color maps, or design token exports.
═══════════════════════════════

THEME / CONFIG JAVASCRIPT:
\`\`\`js
${jsContent.slice(0, 3000)}
\`\`\`` : ""}

═══════════════════════════════
STEP 3: [CONSTRAINTS]
Based on the code, explicitly list what is NOT present:
- e.g., "No dark mode toggle detected", "No CSS animations found", "No custom scroll behavior"
═══════════════════════════════

═══════════════════════════════
STEP 4: [GENERATE MASTER PROMPT]
Now produce the final JSON output. The "masterPrompt" field is the primary deliverable.
It must be a complete, self-contained specification document that a senior engineer could use
to rebuild this website from scratch WITHOUT seeing the original. Minimum 600 words.
═══════════════════════════════

Required JSON schema:
{
  "masterPrompt": "string — Complete pixel-perfect spec starting with: 'Act as a senior frontend engineer. Prioritize accuracy over creativity. Do not introduce ideas that aren't in the reference.' — Then cover: Role & Goal, Typography, Color Palette, Layout Structure, Section Details (one per major UI region), Animations & Interactions, Responsive Behavior, Performance Rules, Visual Accuracy Rules, Implementation Instructions.",
  "projectName": "string — from <title> or domain",
  "detectedFramework": "string — e.g. Tailwind CSS v3, Bootstrap 5, Custom CSS, SCSS",
  "uiStyle": "string — e.g. SaaS Dashboard, Marketing Landing Page, E-commerce, Blog, Portfolio, FinTech",
  "theme": "light | dark | system",
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
  "cssVariables": {
    "detected": ["array of CSS custom property names"],
    "extracted": { "--variable": "value" }
  },
  "spacing": { "base": 4, "scale": [4,8,12,16,24,32,48,64,96,128], "detectedUnit": "px | rem" },
  "borderRadius": { "none": "0px", "sm": "Xpx", "md": "Xpx", "lg": "Xpx", "full": "9999px", "style": "sharp | rounded | pill" },
  "shadows": { "sm": "css string", "md": "css string", "lg": "css string", "xl": "css string" },
  "typography": {
    "h1": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX", "letterSpacing": "Xem" },
    "h2": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX" },
    "h3": { "fontSize": "Xpx", "fontWeight": "X00", "lineHeight": "X.XX" },
    "body": { "fontSize": "Xpx", "fontWeight": "400", "lineHeight": "1.6" },
    "caption": { "fontSize": "Xpx", "fontWeight": "500", "lineHeight": "1.4" },
    "code": { "fontSize": "Xpx", "fontWeight": "400" }
  },
  "detectedComponents": ["every UI component found in HTML — e.g. Navbar, HeroSection, FeatureGrid, PricingTable, TestimonialCarousel, Footer, CookieBanner"],
  "componentStyle": "string",
  "animationStyle": "string",
  "tokens": {
    "description": "string — one-line technical summary",
    "darkModeSupport": false,
    "responsive": true,
    "accessibilityLevel": "AA | AAA | A | Unknown",
    "tailwindDetected": false,
    "cssVariablesDetected": false
  }
}
  `.trim();
}

/* ─────────────────────────────────────────────────────────────────
   POST /api/ai/analyze-folder
───────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const formData = await req.formData();
    const rawHTML    = (formData.get("htmlContent") as string) ?? "";
    const rawCSS     = (formData.get("cssContent") as string) ?? "";
    const jsContent  = (formData.get("jsContent") as string) ?? "";
    const metaRaw    = (formData.get("metadata") as string) ?? "{}";
    const imageFiles = formData.getAll("images") as File[];

    if (!rawHTML && !rawCSS) {
      return NextResponse.json({ error: "No HTML or CSS content provided." }, { status: 400 });
    }

    let metadata: Record<string, any> = {};
    try { metadata = JSON.parse(metaRaw); } catch (_) {}

    // ── CLEAN & EXTRACT ──────────────────────────────────────────
    const cleanedHTML = cleanHTML(rawHTML);
    const cssDNA = extractCSSdna(rawCSS);

    // ── IMAGE VISION PARTS (up to 3) ─────────────────────────────
    const imageParts: { inline_data: { mime_type: string; data: string } }[] = [];
    for (const imgFile of imageFiles.slice(0, 3)) {
      try {
        const ab = await imgFile.arrayBuffer();
        const b64 = Buffer.from(ab).toString("base64");
        const mime = imgFile.type || "image/png";
        imageParts.push({ inline_data: { mime_type: mime, data: b64 } });
      } catch (_) {}
    }

    const analysisPrompt = buildFolderAnalysisPrompt({
      folderName: metadata.folderName ?? "website",
      htmlContent: cleanedHTML,
      cssDNA,
      jsContent,
      hasImages: imageParts.length > 0,
      metadata,
    });

    // Log what we're sending for debugging
    console.log(`[analyze-folder] Sending: ${cleanedHTML.length} chars HTML, ${rawCSS.length} chars CSS → ${Object.keys(cssDNA.variableMap).length} CSS vars, ${imageParts.length} images`);

    const geminiBody = {
      contents: [{
        role: "user",
        parts: [
          ...imageParts,
          { text: analysisPrompt },
        ],
      }],
      systemInstruction: { parts: [{ text: FOLDER_SYSTEM_INSTRUCTION }] },
      generationConfig: {
        temperature: 0.15,       // Near deterministic for code analysis
        maxOutputTokens: 16384,  // Long output for detailed masterPrompt
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
      console.error("Gemini Folder Analysis Error:", err);
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
        console.error("Could not parse Gemini folder response:", rawText.slice(0, 500));
        return NextResponse.json({ error: "AI returned malformed analysis." }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      metadata: {
        ...metadata,
        cssVariablesFound: Object.keys(cssDNA.variableMap).length,
        htmlSizeAfterClean: cleanedHTML.length,
        rawCSSSize: rawCSS.length,
      },
      ...result,
    });

  } catch (error: any) {
    console.error("Folder Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze folder." }, { status: 500 });
  }
}
