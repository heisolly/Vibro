/**
 * lib/theme.ts
 * Vibro Theme Injector
 * Takes a VibroDesignSystem JSON and applies it to the document
 * as CSS custom properties — updating the entire UI atomically.
 *
 * Uses shadcn/ui-compatible CSS variable naming so any component
 * using bg-primary, text-foreground, rounded-[var(--radius)] etc.
 * updates automatically without a page refresh.
 */

import type { VibroDesignSystem } from "./gemini";

/**
 * applyVibroTheme
 * Injects all design tokens from a VibroDesignSystem into :root CSS variables.
 * Loads Google Fonts dynamically if needed.
 */
export function applyVibroTheme(system: VibroDesignSystem): void {
  const root = document.documentElement;
  const { colors, radius, typography, spacing, shadows } = system;

  // ── COLORS (shadcn/ui CSS variable names) ─────────────────────────
  root.style.setProperty("--background",            colors.background);
  root.style.setProperty("--foreground",            colors.foreground);
  root.style.setProperty("--card",                  colors.card ?? colors.background);
  root.style.setProperty("--card-foreground",       colors.cardForeground ?? colors.foreground);
  root.style.setProperty("--primary",               colors.primary);
  root.style.setProperty("--primary-foreground",    colors.primaryForeground);
  root.style.setProperty("--secondary",             colors.secondary);
  root.style.setProperty("--secondary-foreground",  colors.secondaryForeground ?? colors.foreground);
  root.style.setProperty("--accent",                colors.accent);
  root.style.setProperty("--accent-foreground",     colors.accentForeground ?? colors.foreground);
  root.style.setProperty("--muted",                 colors.muted);
  root.style.setProperty("--muted-foreground",      colors.mutedForeground);
  root.style.setProperty("--border",                colors.border);
  root.style.setProperty("--input",                 colors.input ?? colors.border);
  root.style.setProperty("--ring",                  colors.ring ?? colors.primary);
  root.style.setProperty("--destructive",           colors.destructive);

  // ── RADIUS ─────────────────────────────────────────────────────────
  root.style.setProperty("--radius", radius);

  // ── SHADOWS ────────────────────────────────────────────────────────
  if (shadows) {
    root.style.setProperty("--shadow-sm", shadows.sm);
    root.style.setProperty("--shadow-md", shadows.md);
    root.style.setProperty("--shadow-lg", shadows.lg);
    root.style.setProperty("--shadow-xl", shadows.xl);
  }

  // ── SPACING ────────────────────────────────────────────────────────
  if (spacing) {
    root.style.setProperty("--spacing-base", `${spacing.base}px`);
  }

  // ── FONTS ──────────────────────────────────────────────────────────
  if (typography) {
    loadGoogleFont(typography.headingFont);
    loadGoogleFont(typography.bodyFont);

    root.style.setProperty("--font-heading", `"${typography.headingFont}", sans-serif`);
    root.style.setProperty("--font-body",    `"${typography.bodyFont}", sans-serif`);
    if (typography.monoFont) {
      loadGoogleFont(typography.monoFont);
      root.style.setProperty("--font-mono", `"${typography.monoFont}", monospace`);
    }
  }

  // ── LIGHT / DARK MODE ──────────────────────────────────────────────
  root.setAttribute("data-theme", system.theme);
  root.setAttribute("data-vibro-system", system.themeName);

  console.log(`✓ Vibro Protocol: "${system.themeName}" applied — ${system.uiStyle}`);
}

/**
 * clearVibroTheme
 * Removes all injected CSS variables, restoring the default design system.
 */
export function clearVibroTheme(): void {
  const root = document.documentElement;
  const vibroVars = [
    "--background", "--foreground", "--card", "--card-foreground",
    "--primary", "--primary-foreground", "--secondary", "--secondary-foreground",
    "--accent", "--accent-foreground", "--muted", "--muted-foreground",
    "--border", "--input", "--ring", "--destructive",
    "--radius", "--shadow-sm", "--shadow-md", "--shadow-lg", "--shadow-xl",
    "--spacing-base", "--font-heading", "--font-body", "--font-mono",
  ];
  vibroVars.forEach(v => root.style.removeProperty(v));
  root.removeAttribute("data-vibro-system");
  console.log("✓ Vibro Protocol: system cleared.");
}

/**
 * serializeToJSON
 * Exports the current design system as a portable JSON string.
 */
export function serializeToJSON(system: VibroDesignSystem): string {
  return JSON.stringify(system, null, 2);
}

/**
 * serializeToCSSVars
 * Exports the design system as a CSS :root block string.
 */
export function serializeToCSSVars(system: VibroDesignSystem): string {
  const { colors, radius } = system;
  return `:root {
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
  --border: ${colors.border};
  --radius: ${radius};
}`;
}

/* ── Internal: Dynamic Google Font loader ─────────────── */
const loadedFonts = new Set<string>();

function loadGoogleFont(fontName: string): void {
  if (!fontName || loadedFonts.has(fontName)) return;
  const encoded = encodeURIComponent(fontName);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontName);
}
