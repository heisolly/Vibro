export type ContextWorkspace = {
  projectName: string;
  tagline: string;
  summary: string;
  score: number;
  model: string;
  generatedAt: string;
  productBrief: {
    audience: string[];
    goals: string[];
    workflows: string[];
    assumptions: string[];
  };
  designSystem: {
    mood: string;
    colors: string[];
    typography: string[];
    components: string[];
    motion: string[];
  };
  architecture: {
    modules: string[];
    data: string[];
    integrations: string[];
    risks: string[];
  };
  inspiration: {
    references: string[];
    notes: string[];
  };
  contextBundle: {
    version: string;
    files: string[];
    mcpHandoff: string[];
  };
};

export function fallbackContextWorkspace(projectName: string, prompt: string, model = "local-fallback"): ContextWorkspace {
  const cleanName = projectName.trim() || "Vibro";
  const cleanPrompt = prompt.trim() || "A Context OS workspace for AI-assisted development.";

  return {
    projectName: cleanName,
    tagline: `Describe ${cleanName}`,
    summary: cleanPrompt,
    score: 82,
    model,
    generatedAt: new Date().toISOString(),
    productBrief: {
      audience: ["Founders", "designers", "product teams", "AI-assisted builders"],
      goals: [
        "Capture the project intent before code is written",
        "Turn rough ideas into clear boards and reusable context",
        "Prepare a reliable handoff for coding agents",
      ],
      workflows: ["Describe project", "Generate boards", "Review context bundle", "Launch handoff"],
      assumptions: ["User needs planning artifacts, not generated application code"],
    },
    designSystem: {
      mood: "Clean, calm, Gemini-like canvas with Linear-grade structure",
      colors: ["#F8FCFF", "#D8EEFF", "#1A73E8", "#111827", "#64748B"],
      typography: ["Instrument Serif style display", "Geist/Inter system body", "Compact mono labels"],
      components: ["Prompt composer", "board cards", "agent run log", "context bundle footer"],
      motion: ["soft scale-in", "progressive checklist reveal", "hover lift", "aurora drift"],
    },
    architecture: {
      modules: ["Auth", "Workspace", "Prompt engine", "Board generator", "Context bundle", "MCP handoff"],
      data: ["users", "workspaces", "project_briefs", "design_tokens", "context_versions"],
      integrations: ["Liveblocks", "Trigger.dev", "Gemini", "Mistral", "Supabase"],
      risks: ["Workspace isolation", "prompt quality", "long-running generation status"],
    },
    inspiration: {
      references: ["Gemini start canvas", "Linear onboarding", "Rocket/Codex agent stream", "n8n workspace model"],
      notes: ["Keep the first screen useful", "Make boards scannable", "Keep blue gradient subtle"],
    },
    contextBundle: {
      version: "v1.0",
      files: ["brief.md", "design-system.json", "architecture-map.json", "inspiration-board.json", "mcp-handoff.md"],
      mcpHandoff: ["Project identity", "UX rules", "technical assumptions", "agent constraints"],
    },
  };
}

export function parseContextWorkspace(raw: string, projectName: string, prompt: string, model: string) {
  try {
    const parsed = JSON.parse(raw) as Partial<ContextWorkspace>;
    const fallback = fallbackContextWorkspace(projectName, prompt, model);
    return {
      ...fallback,
      ...parsed,
      projectName: parsed.projectName || fallback.projectName,
      tagline: parsed.tagline || fallback.tagline,
      generatedAt: new Date().toISOString(),
      model,
    };
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return fallbackContextWorkspace(projectName, prompt, model);
    return parseContextWorkspace(match[0], projectName, prompt, model);
  }
}
