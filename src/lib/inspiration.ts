export type InspirationItemType = "image" | "url" | "note" | "web";

export type InspirationSearchMode = "fresh" | "expand";

export type InspirationAnalysis = {
  colors: string[];
  typography: string[];
  layoutPatterns: string[];
  componentPatterns: string[];
  mood: string;
  audience: string;
  similarityKeywords: string[];
  designSystemInfluence: string;
  architectureInfluence: string;
};

export type InspirationItem = {
  id: string;
  type: InspirationItemType;
  title: string;
  description?: string;
  url?: string;
  sourceDomain?: string;
  thumbnailUrl?: string;
  storagePath?: string;
  tags: string[];
  tab: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pinned: boolean;
  groupId?: string | null;
  votes: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  analysis?: InspirationAnalysis;
};

export type InspirationGroup = {
  id: string;
  title: string;
  itemIds: string[];
  x: number;
  y: number;
  width: number;
  height: number;
};

export type InspirationTab = {
  id: string;
  label: string;
  order: number;
};

export type InspirationSearchRequest = {
  prompt: string;
  workspaceDescription?: string;
  activeTab: string;
  selectedItemIds?: string[];
  mode: InspirationSearchMode;
  items?: InspirationItem[];
};

export type InspirationSearchResult = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  sourceDomain: string;
  reason: string;
  suggestedTags: string[];
  relevanceScore: number;
};

export type InspirationLinkAnalysisStatus = "queued" | "extracting" | "screenshotting" | "analyzing" | "ranked" | "failed";

export type InspirationLinkAnalysis = {
  id: string;
  url: string;
  title: string;
  sourceDomain: string;
  status: InspirationLinkAnalysisStatus;
  extractedText?: string;
  screenshotUrl?: string;
  summary: string;
  productPatterns: string[];
  visualPatterns: string[];
  architectureSignals: string[];
  suggestedTags: string[];
  score: number;
  warning?: string;
  analysis: InspirationAnalysis;
};

export type InspirationSearchResponse = {
  success: boolean;
  provider: "tavily" | "fallback";
  warning?: string;
  query: string;
  mode: InspirationSearchMode;
  contextSummary: string;
  results: InspirationSearchResult[];
};

export type InspirationArchitecturePlan = {
  productBrief: {
    idea: string;
    audience: string[];
    coreValue: string;
    workflows: string[];
  };
  screens: string[];
  modules: string[];
  frontend: string[];
  backend: string[];
  dataEntities: string[];
  apiRoutes: string[];
  integrations: string[];
  designSystemInfluence: string[];
  risks: string[];
  implementationPhases: string[];
};

export type InspirationResearchStep = {
  id: string;
  label: string;
  status: "queued" | "active" | "done" | "error";
  detail?: string;
};

export type InspirationResearchRun = {
  id: string;
  prompt: string;
  activeTab: string;
  mode: InspirationSearchMode;
  query: string;
  provider: string;
  steps: InspirationResearchStep[];
  searchResults: InspirationSearchResult[];
  analyses: InspirationLinkAnalysis[];
  architecture?: InspirationArchitecturePlan;
  warning?: string;
  createdAt: string;
};

export type InspirationSnapshot = {
  items: InspirationItem[];
  groups: InspirationGroup[];
  tabs: InspirationTab[];
  activeTab: string;
  selectedItemIds: string[];
  savedAt: string;
};

export const defaultInspirationTabs: InspirationTab[] = [
  { id: "landing", label: "Landing Page", order: 0 },
  { id: "dashboard", label: "Dashboard", order: 1 },
  { id: "mobile", label: "Mobile App", order: 2 },
];

export function getSourceDomain(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getInspirationItemKey(item: Pick<InspirationItem, "id" | "type" | "title" | "url" | "tab">) {
  if (item.url) return `url:${item.url.trim().toLowerCase()}`;
  if (item.id) return `id:${item.id}`;
  return `shape:${item.type}:${item.tab}:${item.title.trim().toLowerCase()}`;
}

export function dedupeInspirationItems(items: InspirationItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getInspirationItemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function createInspirationAnalysis(seed: string, tags: string[] = []): InspirationAnalysis {
  const lowered = `${seed} ${tags.join(" ")}`.toLowerCase();
  const dashboard = lowered.includes("dashboard") || lowered.includes("analytics");
  const mobile = lowered.includes("mobile") || lowered.includes("app");
  const landing = lowered.includes("landing") || lowered.includes("marketing");

  return {
    colors: dashboard ? ["#111827", "#6366F1", "#14B8A6"] : landing ? ["#FFFFFF", "#101418", "#C6FF3D"] : ["#F8FAFC", "#6366F1", "#F43F5E"],
    typography: ["High-contrast headings", "Compact UI labels", "Readable body rhythm"],
    layoutPatterns: dashboard
      ? ["Dense dashboard grid", "Persistent navigation", "Metric cards"]
      : mobile
        ? ["Stacked mobile sections", "Thumb-friendly actions", "Bottom navigation"]
        : ["Hero-first composition", "Social proof row", "Feature bands"],
    componentPatterns: dashboard ? ["Stat cards", "Charts", "Filters"] : mobile ? ["App bars", "Cards", "Segmented controls"] : ["Hero", "CTA", "Feature cards"],
    mood: dashboard ? "Operational and focused" : mobile ? "Fast, tactile, and personal" : "Clear, polished, and conversion-oriented",
    audience: dashboard ? "Teams reviewing product or business data" : mobile ? "Mobile-first product users" : "Prospects evaluating a product quickly",
    similarityKeywords: Array.from(new Set([...tags, dashboard ? "dashboard" : landing ? "landing page" : mobile ? "mobile app" : "product UI", "modern UI", "design inspiration"])),
    designSystemInfluence: "Use pinned references to tune color contrast, spacing density, type scale, and component tone.",
    architectureInfluence: "Translate repeated UI patterns into reusable app surfaces and shared components.",
  };
}

export function createInspirationItem(input: Partial<InspirationItem> & Pick<InspirationItem, "type" | "title" | "tab">): InspirationItem {
  const now = new Date().toISOString();
  const tags = input.tags?.length ? input.tags : [input.tab];

  return {
    id: input.id || crypto.randomUUID(),
    type: input.type,
    title: input.title,
    description: input.description || "",
    url: input.url,
    sourceDomain: input.sourceDomain || getSourceDomain(input.url),
    thumbnailUrl: input.thumbnailUrl,
    storagePath: input.storagePath,
    tags,
    tab: input.tab,
    x: input.x ?? 96,
    y: input.y ?? 96,
    width: input.width ?? 260,
    height: input.height ?? 260,
    pinned: input.pinned ?? false,
    groupId: input.groupId ?? null,
    votes: input.votes ?? 0,
    createdBy: input.createdBy || "demo-user",
    createdAt: input.createdAt || now,
    updatedAt: now,
    analysis: input.analysis || createInspirationAnalysis(`${input.title} ${input.description || ""}`, tags),
  };
}
