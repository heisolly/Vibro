/**
 * lib/gemini.ts
 * Vibro's Gemini 2.5 Flash "Headless Designer" engine.
 * Calls the server-side /api/ai/design-system route so the API key stays secure.
 */

/** Full design system response — includes tokens AND the masterPrompt spec */
export interface VibroDesignSystem {
  /** ── Master Prompt (NEW) ─────────────────────── */
  masterPrompt?: string;      // Complete Senior Engineer pixel-perfect spec

  /** ── Project Meta ─────────────────────────────── */
  projectName?: string;
  uiStyle?: string;
  theme?: "light" | "dark";

  /** ── Color Palette ─────────────────────────────── */
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    destructive: string;
    success: string;
    warning: string;
    border: string;
  };

  /** ── Typography ─────────────────────────────── */
  fonts?: {
    heading: string;
    body: string;
    mono: string;
  };
  typography?: {
    h1: { fontSize: string; fontWeight: string; lineHeight: string; letterSpacing?: string };
    h2: { fontSize: string; fontWeight: string; lineHeight: string };
    h3: { fontSize: string; fontWeight: string; lineHeight: string };
    body: { fontSize: string; fontWeight: string; lineHeight: string };
    caption: { fontSize: string; fontWeight: string; lineHeight: string };
    code: { fontSize: string; fontWeight: string };
  };

  /** ── Geometry ─────────────────────────────── */
  spacing?: { base: number; scale: number[] };
  borderRadius?: {
    none: string; sm: string; md: string; lg: string; full: string;
    style: "sharp" | "rounded" | "pill";
  };
  shadows?: { sm: string; md: string; lg: string; xl: string };

  /** ── Component Spec ─────────────────────────── */
  componentStyle?: string;
  animationStyle?: string;
  iconLibrary?: string;
  components?: string[];

  /** ── Token Summary ─────────────────────────── */
  tokens?: {
    description: string;
    darkModeSupport: boolean;
    responsive: boolean;
    accessibilityLevel: "AA" | "AAA";
  };

  // Legacy fields (kept for backward compat)
  themeName?: string;
  colors?: Record<string, string>;
  radius?: string;
}

/**
 * generateVibroSystem
 * Sends the user's prompt + config overrides to the secure server route.
 * Returns a VibroDesignSystem including the masterPrompt.
 */
export async function generateVibroSystem(
  userPrompt: string,
  options?: {
    primaryColor?: string;
    borderRadius?: string;
    stack?: string;
  }
): Promise<VibroDesignSystem> {
  const response = await fetch("/api/ai/design-system", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: userPrompt,
      color: options?.primaryColor,
      borderRadius: options?.borderRadius,
      stack: options?.stack,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err?.error || `API error ${response.status}`);
  }

  const data = await response.json();
  return data as VibroDesignSystem;
}
