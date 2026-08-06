import { GEMINI_MODEL, getGeminiModel } from "@/lib/ai-providers";
import {
  createInspirationAnalysis,
  getSourceDomain,
  type InspirationArchitecturePlan,
  type InspirationItem,
  type InspirationLinkAnalysis,
  type InspirationResearchRun,
  type InspirationResearchStep,
  type InspirationSearchMode,
  type InspirationSearchResult,
} from "@/lib/inspiration";

type TavilyResult = {
  title?: string;
  url: string;
  content?: string;
  image_url?: string;
  score?: number;
};

type ResearchInput = {
  prompt: string;
  activeTab: string;
  workspaceDescription?: string;
  mode: InspirationSearchMode;
  items?: InspirationItem[];
  maxResults?: number;
};

type AnalyzeLinkInput = {
  url: string;
  title?: string;
  prompt?: string;
  activeTab?: string;
  sourceText?: string;
  thumbnailUrl?: string;
};

const fallbackSources = [
  "https://www.awwwards.com/websites/landing-page/",
  "https://dribbble.com/search/dashboard-ui",
  "https://mobbin.com/browse/ios/apps",
  "https://www.behance.net/search/projects/ui%20dashboard",
  "https://www.lapa.ninja/",
];

export function researchSteps(): InspirationResearchStep[] {
  return [
    { id: "understand", label: "Understanding idea", status: "queued" },
    { id: "query", label: "Building search query", status: "queued" },
    { id: "search", label: "Searching web", status: "queued" },
    { id: "extract", label: "Extracting page content", status: "queued" },
    { id: "screenshot", label: "Capturing screenshots", status: "queued" },
    { id: "analyze", label: "Analyzing visuals and links", status: "queued" },
    { id: "architecture", label: "Generating architecture", status: "queued" },
  ];
}

function setStep(steps: InspirationResearchStep[], id: string, status: InspirationResearchStep["status"], detail?: string) {
  return steps.map((step) => (step.id === id ? { ...step, status, detail } : step));
}

export function buildInspirationQuery(input: ResearchInput) {
  const itemContext = (input.items || [])
    .flatMap((item) => [item.title, item.description || "", ...item.tags, ...(item.analysis?.similarityKeywords || [])])
    .filter(Boolean)
    .join(" ");
  return `${input.prompt} ${input.workspaceDescription || ""} ${input.activeTab} UI product design inspiration ${itemContext}`.replace(/\s+/g, " ").trim();
}

function fallbackResults(query: string, activeTab: string): InspirationSearchResult[] {
  return fallbackSources.map((url, index) => ({
    id: `fallback-${index}`,
    title: index === 0 ? "Landing page inspiration gallery" : index === 1 ? "Dashboard UI inspiration" : index === 2 ? "Mobile app inspiration" : index === 3 ? "Product UI case studies" : "Curated landing page examples",
    url,
    sourceDomain: getSourceDomain(url),
    reason: `Useful reference for ${activeTab} based on "${query.slice(0, 80)}".`,
    suggestedTags: [activeTab, index === 2 ? "Mobile App" : index === 1 || index === 3 ? "Dashboard UI" : "Landing Page"],
    relevanceScore: Math.max(0.58, 0.92 - index * 0.08),
  }));
}

export async function searchInspirationSources(input: ResearchInput) {
  const query = buildInspirationQuery(input);
  const maxResults = input.maxResults || 8;

  if (!process.env.TAVILY_API_KEY) {
    return {
      provider: "fallback" as const,
      warning: "TAVILY_API_KEY is missing. Showing curated fallback inspiration sources.",
      query,
      results: fallbackResults(query, input.activeTab).slice(0, maxResults),
    };
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      include_images: true,
      include_answer: false,
      max_results: maxResults,
    }),
  });

  if (!response.ok) {
    throw new Error("Web inspiration search provider did not respond.");
  }

  const data = await response.json();
  const images = Array.isArray(data.images) ? data.images : [];
  const rawResults = Array.isArray(data.results) ? (data.results as TavilyResult[]) : [];
  const results: InspirationSearchResult[] = rawResults.map((result, index) => ({
    id: result.url || `result-${index}`,
    title: result.title || getSourceDomain(result.url) || "Design inspiration",
    url: result.url,
    thumbnailUrl: images[index] || result.image_url || "",
    sourceDomain: getSourceDomain(result.url),
    reason: result.content || `Relevant ${input.activeTab} design reference.`,
    suggestedTags: [input.activeTab, "Web inspiration"],
    relevanceScore: typeof result.score === "number" ? result.score : Math.max(0.5, 0.95 - index * 0.07),
  }));

  return { provider: "tavily" as const, query, results };
}

async function extractWithFirecrawl(url: string) {
  if (!process.env.FIRECRAWL_API_KEY) return null;
  const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data?.data?.markdown || data?.markdown || null;
}

async function extractWithTavily(url: string) {
  if (!process.env.TAVILY_API_KEY) return null;
  const response = await fetch("https://api.tavily.com/extract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      urls: [url],
      extract_depth: "advanced",
      format: "markdown",
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data?.results?.[0]?.raw_content || data?.results?.[0]?.content || null;
}

async function fetchHtmlFallback(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Vibro-Context-OS" },
      signal: AbortSignal.timeout(7000),
    });
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
  } catch {
    return "";
  }
}

export async function extractLinkContent(url: string) {
  const firecrawl = await extractWithFirecrawl(url);
  if (firecrawl) return { text: firecrawl.slice(0, 12000), provider: "firecrawl" };

  const tavily = await extractWithTavily(url);
  if (tavily) return { text: tavily.slice(0, 12000), provider: "tavily-extract" };

  const fallback = await fetchHtmlFallback(url);
  return { text: fallback, provider: "fetch" };
}

export async function captureLinkScreenshot(url: string) {
  if (process.env.BROWSERBASE_API_KEY) {
    return {
      screenshotUrl: "",
      warning: "BROWSERBASE_API_KEY is configured, but hosted screenshot capture is not wired in this local v1 route yet.",
    };
  }

  try {
    const loadPlaywright = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<{
      chromium: {
        launch: (options: { headless: boolean }) => Promise<{
          newPage: (options: { viewport: { width: number; height: number } }) => Promise<{
            goto: (target: string, options: { waitUntil: "domcontentloaded"; timeout: number }) => Promise<unknown>;
            waitForTimeout: (timeout: number) => Promise<unknown>;
            screenshot: (options: { fullPage: boolean; type: "png" }) => Promise<Buffer>;
          }>;
          close: () => Promise<unknown>;
        }>;
      };
    }>;
    const playwright = await loadPlaywright("playwright");
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForTimeout(1200);
    const buffer = await page.screenshot({ fullPage: false, type: "png" });
    await browser.close();
    return { screenshotUrl: `data:image/png;base64,${buffer.toString("base64")}` };
  } catch (error) {
    return {
      screenshotUrl: "",
      warning: error instanceof Error ? `Screenshot capture skipped: ${error.message}` : "Screenshot capture skipped.",
    };
  }
}

function parseJsonObject(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

export async function analyzeInspirationLink(input: AnalyzeLinkInput): Promise<InspirationLinkAnalysis> {
  const extracted = input.sourceText ? { text: input.sourceText, provider: "provided" } : await extractLinkContent(input.url);
  const screenshot = await captureLinkScreenshot(input.url);
  let normalized = {
    summary: `Reference from ${getSourceDomain(input.url)} with UI/product patterns relevant to ${input.activeTab || "the board"}.`,
    productPatterns: ["Clear user-facing value proposition", "Reusable product surface", "Reference-worthy interaction model"],
    visualPatterns: ["Structured layout", "Card-based sections", "Strong visual hierarchy"],
    architectureSignals: ["Reusable frontend components", "Content/data model", "External integration surface"],
    suggestedTags: [input.activeTab || "Inspiration", "Analyzed link"],
    score: 0.72,
  };

  if (process.env.GEMINI_API_KEY) {
    try {
      const model = getGeminiModel();
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this inspiration link for Vibro. Return only JSON with keys summary, productPatterns, visualPatterns, architectureSignals, suggestedTags, score.
Prompt: ${input.prompt || ""}
URL: ${input.url}
Title: ${input.title || ""}
Extracted content:
${extracted.text.slice(0, 7000)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });
      const parsed = parseJsonObject(result.response.text());
      if (parsed) normalized = { ...normalized, ...parsed };
    } catch {
    }
  }

  const tags = Array.isArray(normalized.suggestedTags) ? normalized.suggestedTags : [input.activeTab || "Inspiration"];
  const analysis = createInspirationAnalysis(`${normalized.summary} ${normalized.productPatterns.join(" ")} ${normalized.visualPatterns.join(" ")}`, tags);

  return {
    id: input.url,
    url: input.url,
    title: input.title || getSourceDomain(input.url) || input.url,
    sourceDomain: getSourceDomain(input.url),
    status: "ranked",
    extractedText: extracted.text,
    screenshotUrl: screenshot.screenshotUrl || input.thumbnailUrl || "",
    summary: normalized.summary,
    productPatterns: normalized.productPatterns || [],
    visualPatterns: normalized.visualPatterns || [],
    architectureSignals: normalized.architectureSignals || [],
    suggestedTags: tags,
    score: typeof normalized.score === "number" ? normalized.score : 0.72,
    warning: screenshot.warning,
    analysis,
  };
}

export function fallbackArchitecture(prompt: string, evidence: InspirationLinkAnalysis[]): InspirationArchitecturePlan {
  return {
    productBrief: {
      idea: prompt || "AI-assisted product shaped from inspiration evidence",
      audience: ["Product teams", "Designers", "Frontend engineers"],
      coreValue: "Turn inspiration references into build-ready product and architecture context.",
      workflows: ["Search inspiration", "Analyze references", "Pin evidence", "Generate architecture", "Export context bundle"],
    },
    screens: ["Workspace dashboard", "Inspiration board", "Reference detail panel", "Architecture board", "Context bundle review"],
    modules: ["Workspace", "Inspiration Research", "Reference Analysis", "Architecture Generator", "Context Bundle"],
    frontend: ["Next.js workspace UI", "Canvas board", "Research timeline", "Architecture map renderer"],
    backend: ["Research API", "Link analysis API", "Architecture generation API", "Snapshot persistence"],
    dataEntities: ["Workspace", "InspirationItem", "InspirationAnalysis", "ResearchRun", "ArchitecturePlan", "ContextBundle"],
    apiRoutes: ["/api/inspirations/research", "/api/inspirations/analyze-link", "/api/inspirations/generate-architecture"],
    integrations: ["Tavily Search", "Firecrawl Extract", "Gemini Vision", "Supabase", "Trigger.dev"],
    designSystemInfluence: Array.from(new Set(evidence.flatMap((item) => item.visualPatterns))).slice(0, 8),
    risks: ["Search providers may omit visual context", "Some websites block scraping or screenshots", "AI output must be grounded in selected evidence"],
    implementationPhases: ["Research pipeline", "Canvas evidence cards", "Architecture generator", "Context bundle integration"],
  };
}

export async function generateArchitectureFromEvidence(prompt: string, evidence: InspirationLinkAnalysis[]) {
  if (!process.env.GEMINI_API_KEY) return fallbackArchitecture(prompt, evidence);

  try {
    const model = getGeminiModel();
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a product architecture for this idea using only the evidence below.
Return only JSON with this exact shape:
{
  "productBrief": { "idea": "string", "audience": ["string"], "coreValue": "string", "workflows": ["string"] },
  "screens": ["string"],
  "modules": ["string"],
  "frontend": ["string"],
  "backend": ["string"],
  "dataEntities": ["string"],
  "apiRoutes": ["string"],
  "integrations": ["string"],
  "designSystemInfluence": ["string"],
  "risks": ["string"],
  "implementationPhases": ["string"]
}

Idea: ${prompt}
Evidence:
${JSON.stringify(evidence.map((item) => ({
  title: item.title,
  url: item.url,
  summary: item.summary,
  productPatterns: item.productPatterns,
  visualPatterns: item.visualPatterns,
  architectureSignals: item.architectureSignals,
})), null, 2)}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });
    return { ...fallbackArchitecture(prompt, evidence), ...(parseJsonObject(result.response.text()) || {}) };
  } catch {
    return fallbackArchitecture(prompt, evidence);
  }
}

export async function runInspirationResearch(input: ResearchInput): Promise<InspirationResearchRun> {
  let steps = researchSteps();
  const id = `research-${Date.now()}`;
  steps = setStep(steps, "understand", "done", input.mode === "expand" ? "Using selected and pinned inspiration as evidence." : "Starting from the idea description.");
  steps = setStep(steps, "query", "active", "Creating a Vibro-style search query.");

  const searched = await searchInspirationSources(input);
  steps = setStep(steps, "query", "done", searched.query);
  steps = setStep(steps, "search", "done", `${searched.results.length} candidate links found via ${searched.provider}.`);
  steps = setStep(steps, "extract", "active", "Reading top candidate links.");

  const topResults = searched.results.slice(0, Math.min(4, searched.results.length));
  const analyses: InspirationLinkAnalysis[] = [];
  for (const result of topResults) {
    analyses.push(await analyzeInspirationLink({
      url: result.url,
      title: result.title,
      prompt: input.prompt,
      activeTab: input.activeTab,
      sourceText: result.reason,
      thumbnailUrl: result.thumbnailUrl,
    }));
  }

  steps = setStep(steps, "extract", "done", `${analyses.length} links extracted.`);
  steps = setStep(steps, "screenshot", "done", analyses.some((item) => item.screenshotUrl) ? "Screenshots captured for available pages." : "Screenshot capture unavailable; using provider thumbnails.");
  steps = setStep(steps, "analyze", "done", "Visual and product patterns normalized.");
  steps = setStep(steps, "architecture", "active", "Generating architecture from ranked evidence.");
  const architecture = await generateArchitectureFromEvidence(input.prompt, analyses);
  steps = setStep(steps, "architecture", "done", "Architecture plan generated from inspiration evidence.");

  return {
    id,
    prompt: input.prompt,
    activeTab: input.activeTab,
    mode: input.mode,
    query: searched.query,
    provider: searched.provider,
    steps,
    searchResults: searched.results,
    analyses,
    architecture,
    warning: searched.warning,
    createdAt: new Date().toISOString(),
  };
}

export const researchModel = GEMINI_MODEL;
