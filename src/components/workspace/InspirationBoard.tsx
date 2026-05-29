"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/vibro/ui";
import type { VibroProject, VibroUser } from "@/lib/vibro";
import {
  createInspirationItem,
  dedupeInspirationItems,
  defaultInspirationTabs,
  getInspirationItemKey,
  getSourceDomain,
  type InspirationArchitecturePlan,
  type InspirationGroup,
  type InspirationItem,
  type InspirationLinkAnalysis,
  type InspirationResearchRun,
  type InspirationSearchResponse,
  type InspirationSearchResult,
  type InspirationTab,
} from "@/lib/inspiration";

type DragState = {
  id: string;
  startX: number;
  startY: number;
  itemX: number;
  itemY: number;
};

type ResizeState = {
  id: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

type FloatingPanelState = {
  x: number;
  y: number;
  z: number;
};

type FloatingPanelDragState = {
  panel: "search" | "research";
  startX: number;
  startY: number;
  panelX: number;
  panelY: number;
};

type SearchStep = {
  id: "context" | "query" | "provider" | "rank" | "done";
  label: string;
  status: "waiting" | "active" | "done" | "error";
  detail?: string;
};

const tagOptions = ["Typography", "Dashboard UI", "Landing Page", "Mobile App", "Color", "Navigation", "Cards", "Motion"];

function storageKey(slug: string) {
  return `vibro-inspiration-board:${slug}`;
}

function seedItems(user?: VibroUser | null): InspirationItem[] {
  return [
    createInspirationItem({
      id: "seed-dashboard",
      type: "web",
      title: "Analytics dashboard reference",
      description: "Dense KPI cards, split analytics panes, and calm collaboration surfaces.",
      url: "https://dribbble.com/search/dashboard-ui",
      thumbnailUrl: "",
      sourceDomain: "dribbble.com",
      tags: ["Dashboard UI", "Cards"],
      tab: "dashboard",
      x: 100,
      y: 116,
      width: 282,
      height: 270,
      pinned: true,
      votes: 4,
      createdBy: user?.id || "demo-user",
    }),
    createInspirationItem({
      id: "seed-landing",
      type: "web",
      title: "Product landing inspiration",
      description: "Hero-first product story with crisp proof points and strong visual hierarchy.",
      url: "https://www.awwwards.com/websites/landing-page/",
      thumbnailUrl: "",
      sourceDomain: "awwwards.com",
      tags: ["Landing Page", "Typography"],
      tab: "landing",
      x: 420,
      y: 170,
      width: 280,
      height: 276,
      pinned: false,
      votes: 2,
      createdBy: user?.id || "demo-user",
    }),
  ];
}

function buildSnapshot(items: InspirationItem[], groups: InspirationGroup[], tabs: InspirationTab[], activeTab: string, selectedItemIds: string[]) {
  return {
    items,
    groups,
    tabs,
    activeTab,
    selectedItemIds,
    savedAt: new Date().toISOString(),
  };
}

function initialSearchSteps(): SearchStep[] {
  return [
    { id: "context", label: "Reading board context", status: "waiting" },
    { id: "query", label: "Generating search query", status: "waiting" },
    { id: "provider", label: "Searching the web", status: "waiting" },
    { id: "rank", label: "Ranking references", status: "waiting" },
    { id: "done", label: "Ready to add", status: "waiting" },
  ];
}

function updateSearchStep(steps: SearchStep[], id: SearchStep["id"], status: SearchStep["status"], detail?: string) {
  return steps.map((step) => (step.id === id ? { ...step, status, detail } : step));
}

function getCardOpenTarget(item: InspirationItem) {
  if (item.url) return item.url;
  if (item.thumbnailUrl?.startsWith("blob:") || item.thumbnailUrl?.startsWith("http") || item.thumbnailUrl?.startsWith("data:")) return item.thumbnailUrl;
  if (item.storagePath?.startsWith("http")) return item.storagePath;
  return "";
}

export default function InspirationBoard({
  slug,
  project,
  user,
}: {
  slug: string;
  project: VibroProject | null;
  user: VibroUser | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialUserRef = useRef(user);
  const itemKeysRef = useRef(new Set<string>());
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchRunIdRef = useRef(0);
  const lastExplicitSearchRef = useRef("");
  const cardPointerRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [tabs, setTabs] = useState<InspirationTab[]>(defaultInspirationTabs);
  const [activeTab, setActiveTab] = useState(defaultInspirationTabs[0].id);
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [groups, setGroups] = useState<InspirationGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [floatingPanelDrag, setFloatingPanelDrag] = useState<FloatingPanelDragState | null>(null);
  const [searchPanel, setSearchPanel] = useState<FloatingPanelState>({ x: 24, y: 430, z: 24 });
  const [researchPanel, setResearchPanel] = useState<FloatingPanelState>({ x: 760, y: 340, z: 28 });
  const [urlInput, setUrlInput] = useState("");
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchResults, setSearchResults] = useState<InspirationSearchResult[]>([]);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>(initialSearchSteps);
  const [searchRunning, setSearchRunning] = useState(false);
  const [liveSearch, setLiveSearch] = useState(true);
  const [lastSearch, setLastSearch] = useState<InspirationSearchResponse | null>(null);
  const [researchRun, setResearchRun] = useState<InspirationResearchRun | null>(null);
  const [researchRunning, setResearchRunning] = useState(false);
  const [architecturePlan, setArchitecturePlan] = useState<InspirationArchitecturePlan | null>(null);
  const [architectureRunning, setArchitectureRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const deleteItems = useCallback((ids: string[]) => {
    if (!ids.length) return;
    const deleted = new Set(ids);
    setItems((current) => current.filter((item) => !deleted.has(item.id)));
    setGroups((current) =>
      current
        .map((group) => ({ ...group, itemIds: group.itemIds.filter((id) => !deleted.has(id)) }))
        .filter((group) => group.itemIds.length > 0)
    );
    setSelectedIds((current) => current.filter((id) => !deleted.has(id)));
    setStatus(ids.length === 1 ? "Card deleted." : `${ids.length} cards deleted.`);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(slug));
    if (stored) {
      try {
        const snapshot = JSON.parse(stored);
        setItems(dedupeInspirationItems(snapshot.items || []));
        setGroups(snapshot.groups || []);
        setTabs(snapshot.tabs?.length ? snapshot.tabs : defaultInspirationTabs);
        setActiveTab(snapshot.activeTab || defaultInspirationTabs[0].id);
        setSelectedIds(snapshot.selectedItemIds || []);
        setHydrated(true);
        return;
      } catch {
      }
    }
    setItems(dedupeInspirationItems(seedItems(initialUserRef.current)));
    setHydrated(true);
  }, [slug]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey(slug), JSON.stringify(buildSnapshot(dedupeInspirationItems(items), groups, tabs, activeTab, selectedIds)));
  }, [activeTab, groups, hydrated, items, selectedIds, slug, tabs]);

  useEffect(() => {
    itemKeysRef.current = new Set(dedupeInspirationItems(items).map(getInspirationItemKey));
  }, [items]);

  const visibleItems = useMemo(() => dedupeInspirationItems(items).filter((item) => item.tab === activeTab), [activeTab, items]);
  const pinnedItems = useMemo(() => items.filter((item) => item.pinned), [items]);
  const selectedItems = useMemo(() => items.filter((item) => selectedIds.includes(item.id)), [items, selectedIds]);
  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Inspiration";

  useEffect(() => {
    function onTool(event: Event) {
      const tool = (event as CustomEvent<string>).detail;
      if (tool === "upload") fileInputRef.current?.click();
      if (tool === "url") setStatus("Paste a URL below, then press Add URL.");
      if (tool === "search") setStatus("Describe the inspiration Vibro should find on the web.");
      if (tool === "moodboard") arrangeMoodboard();
      if (tool === "tag") applyNextTag();
      if (tool === "group") groupSelection();
      if (tool === "ungroup") ungroupSelection();
      if (tool === "pin") togglePinSelection();
      if (tool === "note") addNote();
      if (tool === "delete") deleteItems(selectedIds);
    }

    function onPrompt(event: Event) {
      const prompt = (event as CustomEvent<string>).detail;
      setSearchPrompt(prompt);
      void searchWeb(prompt, "ai");
    }

    window.addEventListener("vibro:inspiration-tool", onTool);
    window.addEventListener("vibro:inspiration-prompt", onPrompt);
    return () => {
      window.removeEventListener("vibro:inspiration-tool", onTool);
      window.removeEventListener("vibro:inspiration-prompt", onPrompt);
    };
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      if ((event.key === "Delete" || event.key === "Backspace") && selectedIds.length) {
        event.preventDefault();
        deleteItems(selectedIds);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteItems, selectedIds]);

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      if (dragState) {
        const dx = event.clientX - dragState.startX;
        const dy = event.clientY - dragState.startY;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          cardPointerRef.current = cardPointerRef.current?.id === dragState.id ? { ...cardPointerRef.current, moved: true } : cardPointerRef.current;
        }
        setItems((current) =>
          current.map((item) =>
            item.id === dragState.id
              ? { ...item, x: Math.max(24, dragState.itemX + dx), y: Math.max(72, dragState.itemY + dy), updatedAt: new Date().toISOString() }
              : item
          )
        );
      }
      if (resizeState) {
        const dx = event.clientX - resizeState.startX;
        const dy = event.clientY - resizeState.startY;
        setItems((current) =>
          current.map((item) =>
            item.id === resizeState.id
              ? { ...item, width: Math.max(220, resizeState.width + dx), height: Math.max(210, resizeState.height + dy), updatedAt: new Date().toISOString() }
              : item
          )
        );
      }
      if (floatingPanelDrag) {
        const dx = event.clientX - floatingPanelDrag.startX;
        const dy = event.clientY - floatingPanelDrag.startY;
        const next = {
          x: Math.max(8, floatingPanelDrag.panelX + dx),
          y: Math.max(64, floatingPanelDrag.panelY + dy),
        };
        if (floatingPanelDrag.panel === "search") {
          setSearchPanel((current) => ({ ...current, ...next }));
        } else {
          setResearchPanel((current) => ({ ...current, ...next }));
        }
      }
    }

    function onPointerUp() {
      setDragState(null);
      setResizeState(null);
      setFloatingPanelDrag(null);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState, floatingPanelDrag, resizeState]);

  function updateItem(id: string, updater: (item: InspirationItem) => InspirationItem) {
    setItems((current) => current.map((item) => (item.id === id ? updater(item) : item)));
  }

  function selectItem(id: string, multi: boolean) {
    setSelectedIds((current) => {
      if (multi) return current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id];
      return [id];
    });
  }

  function openCardSource(item: InspirationItem) {
    const target = getCardOpenTarget(item);
    if (!target) {
      setStatus("This card does not have an external source or screenshot to open.");
      return;
    }
    window.open(target, "_blank", "noopener,noreferrer");
  }

  function movePanelLayer(panel: "search" | "research", direction: "front" | "back") {
    const z = direction === "front" ? 48 : 8;
    if (panel === "search") {
      setSearchPanel((current) => ({ ...current, z }));
    } else {
      setResearchPanel((current) => ({ ...current, z }));
    }
  }

  function addItem(item: InspirationItem) {
    const itemKey = getInspirationItemKey(item);
    if (itemKeysRef.current.has(itemKey)) {
      const existing = items.find((candidate) => getInspirationItemKey(candidate) === itemKey);
      if (existing) setSelectedIds([existing.id]);
      setStatus("That inspiration is already on the board.");
      return;
    }

    itemKeysRef.current.add(itemKey);
    setItems((current) => {
      const existing = current.find((candidate) => getInspirationItemKey(candidate) === itemKey);
      if (existing) {
        setSelectedIds([existing.id]);
        setStatus("That inspiration is already on the board.");
        return current;
      }

      setSelectedIds([item.id]);
      return dedupeInspirationItems([...current, item]);
    });
  }

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setStatus("Uploading and analyzing screenshots...");

    for (const [index, file] of list.entries()) {
      const preview = URL.createObjectURL(file);
      let uploaded: Partial<InspirationItem> = {};
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("workspaceSlug", slug);
        formData.append("tab", activeTab);
        const response = await fetch("/api/inspirations/upload", { method: "POST", body: formData });
        if (response.ok) uploaded = (await response.json()).item || {};
      } catch {
      }

      addItem(createInspirationItem({
        ...uploaded,
        type: "image",
        title: uploaded.title || file.name,
        thumbnailUrl: uploaded.thumbnailUrl || preview,
        storagePath: uploaded.storagePath,
        tags: uploaded.tags || [activeLabel, "Screenshot"],
        tab: activeTab,
        x: 90 + index * 34,
        y: 116 + index * 28,
        createdBy: user?.id || "demo-user",
      }));
    }
    setStatus("Screenshots added to the board.");
  }

  async function addUrl() {
    const rawUrl = urlInput.trim();
    if (!rawUrl) return;
    const normalizedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    setStatus("Creating URL reference...");
    let payload: Partial<InspirationItem> = {};
    try {
      const response = await fetch("/api/inspirations/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, workspaceSlug: slug, tab: activeTab }),
      });
      if (response.ok) payload = (await response.json()).item || {};
    } catch {
    }
    addItem(createInspirationItem({
      ...payload,
      type: "url",
      title: payload.title || getSourceDomain(normalizedUrl) || normalizedUrl,
      url: normalizedUrl,
      sourceDomain: payload.sourceDomain || getSourceDomain(normalizedUrl),
      tags: payload.tags || [activeLabel],
      tab: activeTab,
      x: 150 + visibleItems.length * 28,
      y: 140 + visibleItems.length * 24,
      createdBy: user?.id || "demo-user",
    }));
    setUrlInput("");
    setStatus("URL added and ready for analysis.");
  }

  const searchWeb = useCallback(async (prompt = searchPrompt, trigger: "manual" | "live" | "ai" = "manual") => {
    const cleanPrompt = prompt.trim() || project?.description || `Find ${activeLabel} UI inspiration`;
    if (!cleanPrompt) return;
    if (trigger !== "live") {
      lastExplicitSearchRef.current = cleanPrompt;
    }
    const runId = searchRunIdRef.current + 1;
    searchRunIdRef.current = runId;
    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const mode = items.length ? "expand" : "fresh";
    const contextItems = selectedItems.length ? selectedItems : pinnedItems;

    setStatus(trigger === "live" ? "Live searching as you type..." : "Vibro is searching the web for inspiration...");
    setSearchRunning(true);
    setLastSearch(null);
    setSearchResults([]);
    setSearchSteps(updateSearchStep(initialSearchSteps(), "context", "active", mode === "expand" ? "Using selected or pinned cards as context." : "Using the project description and prompt."));

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 160));
      if (controller.signal.aborted || searchRunIdRef.current !== runId) return;
      setSearchSteps((steps) => updateSearchStep(updateSearchStep(steps, "context", "done", `${contextItems.length} reference${contextItems.length === 1 ? "" : "s"} considered.`), "query", "active", cleanPrompt));

      await new Promise((resolve) => window.setTimeout(resolve, 160));
      if (controller.signal.aborted || searchRunIdRef.current !== runId) return;
      setSearchSteps((steps) => updateSearchStep(updateSearchStep(steps, "query", "done", "Query assembled from prompt, board tab, and reference tags."), "provider", "active", "Contacting inspiration search provider."));

      const response = await fetch("/api/inspirations/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: cleanPrompt,
          workspaceDescription: project?.description,
          activeTab,
          selectedItemIds: selectedIds,
          mode,
          items: contextItems,
        }),
      });
      if (controller.signal.aborted || searchRunIdRef.current !== runId) return;
      const data = (await response.json()) as InspirationSearchResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Search failed");
      setSearchSteps((steps) => updateSearchStep(updateSearchStep(steps, "provider", "done", `${data.provider} returned ${(data.results || []).length} references.`), "rank", "active", "Sorting matches by relevance and source quality."));

      await new Promise((resolve) => window.setTimeout(resolve, 180));
      if (controller.signal.aborted || searchRunIdRef.current !== runId) return;
      const rankedResults = [...(data.results || [])].sort((a, b) => b.relevanceScore - a.relevanceScore);
      setSearchResults(rankedResults);
      setLastSearch({ ...data, results: rankedResults });
      setSearchSteps((steps) =>
        updateSearchStep(
          updateSearchStep(
            updateSearchStep(steps, "provider", "done", data.warning || `${data.provider} search complete.`),
            "rank",
            "done",
            `${rankedResults.length} references ranked.`
          ),
          "done",
          "done",
          rankedResults.length ? "Results are ready to add to the canvas." : "No results were found."
        )
      );
      setStatus(rankedResults.length ? "Search complete. Add any result to the board." : "No web results returned.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setSearchSteps((steps) => updateSearchStep(steps, "provider", "error", error instanceof Error ? error.message : "Search failed."));
      setStatus(error instanceof Error ? error.message : "Web inspiration search failed.");
    } finally {
      if (searchRunIdRef.current === runId) {
        setSearchRunning(false);
      }
    }
  }, [activeLabel, activeTab, items.length, pinnedItems, project?.description, searchPrompt, selectedIds, selectedItems]);

  useEffect(() => {
    const cleanPrompt = searchPrompt.trim();
    if (!liveSearch || cleanPrompt.length < 4) return;
    if (lastExplicitSearchRef.current === cleanPrompt) return;

    const timer = window.setTimeout(() => {
      void searchWeb(cleanPrompt, "live");
    }, 850);

    return () => window.clearTimeout(timer);
  }, [liveSearch, searchPrompt, activeTab, selectedIds, searchWeb]);

  function addSearchResult(result: InspirationSearchResult, index: number) {
    addItem(createInspirationItem({
      type: "web",
      title: result.title,
      description: result.reason,
      url: result.url,
      sourceDomain: result.sourceDomain,
      thumbnailUrl: result.thumbnailUrl,
      tags: result.suggestedTags.length ? result.suggestedTags : [activeLabel],
      tab: activeTab,
      x: 180 + index * 38,
      y: 126 + index * 34,
      votes: Math.round(result.relevanceScore * 5),
      createdBy: "vibro-ai",
    }));
  }

  function addAnalysisCard(analysis: InspirationLinkAnalysis, index: number) {
    addItem(createInspirationItem({
      type: "web",
      title: analysis.title,
      description: analysis.summary,
      url: analysis.url,
      sourceDomain: analysis.sourceDomain,
      thumbnailUrl: analysis.screenshotUrl,
      tags: analysis.suggestedTags.length ? analysis.suggestedTags : [activeLabel, "Analyzed"],
      tab: activeTab,
      x: 220 + index * 42,
      y: 150 + index * 34,
      votes: Math.round(analysis.score * 5),
      pinned: true,
      createdBy: "vibro-research",
      analysis: analysis.analysis,
    }));
  }

  async function startResearchRun() {
    const prompt = searchPrompt.trim() || project?.description || `Find and analyze ${activeLabel} inspiration`;
    if (!prompt) return;
    const mode = items.length ? "expand" : "fresh";
    const contextItems = selectedItems.length ? selectedItems : pinnedItems;
    setResearchRunning(true);
    setArchitecturePlan(null);
    setStatus("Vibro is researching links, screenshots, visual patterns, and architecture...");

    try {
      const response = await fetch("/api/inspirations/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          workspaceSlug: slug,
          activeTab,
          workspaceDescription: project?.description,
          mode,
          items: contextItems,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Research failed");
      setResearchRun(data.run);
      setArchitecturePlan(data.run?.architecture || null);
      setSearchResults(data.run?.searchResults || []);
      setStatus(`Research complete: ${data.run?.analyses?.length || 0} links analyzed and architecture generated.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Research failed.");
    } finally {
      setResearchRunning(false);
    }
  }

  async function generateArchitectureFromBoard() {
    const prompt = searchPrompt.trim() || project?.description || "Generate architecture from selected inspiration";
    const source = researchRun?.analyses?.length
      ? researchRun.analyses
      : selectedItems.concat(pinnedItems).map((item) => ({
          id: item.id,
          url: item.url || item.id,
          title: item.title,
          sourceDomain: item.sourceDomain || getSourceDomain(item.url),
          status: "ranked" as const,
          summary: item.description || item.analysis?.mood || item.title,
          productPatterns: item.analysis?.componentPatterns || [],
          visualPatterns: item.analysis?.layoutPatterns || [],
          architectureSignals: [item.analysis?.architectureInfluence || "Reusable UI pattern"].filter(Boolean),
          suggestedTags: item.tags,
          score: item.pinned ? 0.9 : 0.72,
          analysis: item.analysis || createInspirationItem({ type: "note", title: item.title, tab: item.tab }).analysis!,
        }));

    setArchitectureRunning(true);
    setStatus("Generating architecture from inspiration evidence...");

    try {
      const response = await fetch("/api/inspirations/generate-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, evidence: source }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Architecture generation failed");
      setArchitecturePlan(data.architecture);
      setStatus("Architecture generated from selected inspiration.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Architecture generation failed.");
    } finally {
      setArchitectureRunning(false);
    }
  }

  function addNote() {
    addItem(createInspirationItem({
      type: "note",
      title: "Pattern note",
      description: "Capture why this reference matters, then connect it to design tokens or UI patterns.",
      tags: [activeLabel, "Note"],
      tab: activeTab,
      x: 180 + visibleItems.length * 20,
      y: 180 + visibleItems.length * 18,
      width: 250,
      height: 220,
      createdBy: user?.id || "demo-user",
    }));
  }

  function arrangeMoodboard() {
    setItems((current) => {
      let index = 0;
      return current.map((item) => {
        if (item.tab !== activeTab) return item;
        const col = index % 3;
        const row = Math.floor(index / 3);
        index += 1;
        return { ...item, x: 92 + col * 310, y: 112 + row * 318, width: 278, height: 278, updatedAt: new Date().toISOString() };
      });
    });
    setStatus("Moodboard layout applied.");
  }

  function applyNextTag() {
    if (!selectedIds.length) return setStatus("Select a card before tagging.");
    setItems((current) =>
      current.map((item) => {
        if (!selectedIds.includes(item.id)) return item;
        const next = tagOptions.find((tag) => !item.tags.includes(tag)) || tagOptions[0];
        return { ...item, tags: Array.from(new Set([...item.tags, next])), updatedAt: new Date().toISOString() };
      })
    );
  }

  function togglePinSelection() {
    if (!selectedIds.length) return setStatus("Select cards to pin.");
    setItems((current) => current.map((item) => selectedIds.includes(item.id) ? { ...item, pinned: !item.pinned, updatedAt: new Date().toISOString() } : item));
  }

  function groupSelection() {
    if (selectedIds.length < 2) return setStatus("Select at least two cards to group.");
    const groupId = crypto.randomUUID();
    const selection = items.filter((item) => selectedIds.includes(item.id));
    const minX = Math.min(...selection.map((item) => item.x));
    const minY = Math.min(...selection.map((item) => item.y));
    const maxX = Math.max(...selection.map((item) => item.x + item.width));
    const maxY = Math.max(...selection.map((item) => item.y + item.height));
    setGroups((current) => [...current, { id: groupId, title: `${activeLabel} group`, itemIds: selectedIds, x: minX - 16, y: minY - 48, width: maxX - minX + 32, height: maxY - minY + 72 }]);
    setItems((current) => current.map((item) => selectedIds.includes(item.id) ? { ...item, groupId, updatedAt: new Date().toISOString() } : item));
  }

  function ungroupSelection() {
    const groupIds = new Set(selectedItems.map((item) => item.groupId).filter(Boolean));
    setGroups((current) => current.filter((group) => !groupIds.has(group.id)));
    setItems((current) => current.map((item) => groupIds.has(item.groupId || "") ? { ...item, groupId: null, updatedAt: new Date().toISOString() } : item));
  }

  async function saveSnapshot() {
    setSaving(true);
    setStatus("Saving inspiration snapshot...");
    try {
      const response = await fetch("/api/inspirations/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug: slug,
          snapshot: buildSnapshot(items, groups, tabs, activeTab, selectedIds),
          influence: buildInfluence(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Snapshot failed");
      setStatus(`Snapshot v${data.version || 1} saved into the context bundle.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save snapshot.");
    } finally {
      setSaving(false);
    }
  }

  function buildInfluence() {
    const source = pinnedItems.length ? pinnedItems : selectedItems.length ? selectedItems : visibleItems;
    return {
      selectedReferences: source.slice(0, 8).map((item) => ({ title: item.title, url: item.url, tags: item.tags, reason: item.analysis?.mood })),
      extractedPatterns: Array.from(new Set(source.flatMap((item) => item.analysis?.layoutPatterns || []))).slice(0, 12),
      designSystemInfluence: Array.from(new Set(source.map((item) => item.analysis?.designSystemInfluence).filter(Boolean))) as string[],
      architectureInfluence: Array.from(new Set(source.map((item) => item.analysis?.architectureInfluence).filter(Boolean))) as string[],
    };
  }

  return (
    <div
      className="relative h-full overflow-hidden"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        if (event.dataTransfer.files.length) void uploadFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) void uploadFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      <div className="absolute left-6 right-6 top-0 z-20 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white/88 p-1 shadow-sm backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedIds([]);
              }}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition ${
                activeTab === tab.id ? "bg-[#101418] text-white" : "text-[#666] hover:bg-[#F5F5F5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            title="Add tab"
            onClick={() => {
              const label = `Board ${tabs.length + 1}`;
              const id = `custom-${Date.now()}`;
              setTabs((current) => [...current, { id, label, order: current.length }]);
              setActiveTab(id);
            }}
            className="grid h-7 w-7 place-items-center rounded-md text-[#666] hover:bg-[#F5F5F5]"
          >
            <MaterialIcon name="add" size={16} />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white/88 px-3 py-2 text-xs text-[#666] shadow-sm backdrop-blur">
          <MaterialIcon name="auto_awesome" size={16} />
          <span className="truncate">{status || "Drop screenshots, paste URLs, or ask Vibro to find more inspiration from the web."}</span>
        </div>

        <button
          onClick={saveSnapshot}
          disabled={saving}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#101418] px-3 text-xs font-medium text-white shadow-sm disabled:opacity-50"
        >
          <MaterialIcon name="inventory_2" size={15} />
          Snapshot
        </button>
      </div>

      <div className="absolute left-6 top-14 z-20 flex w-[360px] flex-col gap-2 rounded-lg border border-[#E5E5E5] bg-white/88 p-3 shadow-sm backdrop-blur">
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void addUrl();
            }}
            placeholder="Paste a URL"
            className="h-9 min-w-0 flex-1 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs outline-none focus:border-[#6366F1]"
          />
          <button onClick={addUrl} className="grid h-9 w-9 place-items-center rounded-md bg-[#EEF2FF] text-[#6366F1]" title="Add URL">
            <MaterialIcon name="add_link" size={17} />
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={searchPrompt}
            onChange={(event) => setSearchPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void searchWeb(searchPrompt, "manual");
            }}
            placeholder={items.length ? "Find more like selected or pinned inspo" : "Describe what Vibro should find"}
            className="h-9 min-w-0 flex-1 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs outline-none focus:border-[#6366F1]"
          />
          <button
            onClick={() => setLiveSearch((current) => !current)}
            className={`grid h-9 w-9 place-items-center rounded-md ${liveSearch ? "bg-[#EEF2FF] text-[#6366F1]" : "bg-white text-[#777] border border-[#E5E5E5]"}`}
            title={liveSearch ? "Live search is on" : "Live search is off"}
          >
            <MaterialIcon name="bolt" size={17} fill={liveSearch} />
          </button>
          <button
            onClick={() => searchRunning ? searchAbortRef.current?.abort() : void searchWeb(searchPrompt, "manual")}
            className="grid h-9 w-9 place-items-center rounded-md bg-[#101418] text-white"
            title={searchRunning ? "Cancel search" : "Search web"}
          >
            <MaterialIcon name={searchRunning ? "stop" : "travel_explore"} size={17} />
          </button>
          <button
            onClick={() => void startResearchRun()}
            disabled={researchRunning}
            className="inline-flex h-9 items-center gap-1 rounded-md bg-[#6366F1] px-3 text-[11px] font-semibold text-white disabled:opacity-60"
            title="Research links and generate architecture"
          >
            <MaterialIcon name={researchRunning ? "progress_activity" : "psychology"} size={15} />
            Research
          </button>
        </div>
      </div>

      {groups.filter((group) => group.itemIds.some((id) => visibleItems.some((item) => item.id === id))).map((group) => (
        <div
          key={group.id}
          className="absolute rounded-xl border border-dashed border-[#A5B4FC] bg-[#EEF2FF]/35"
          style={{ left: group.x, top: group.y, width: group.width, height: group.height }}
        >
          <span className="absolute left-3 top-2 text-[11px] font-semibold text-[#6366F1]">{group.title}</span>
        </div>
      ))}

      {visibleItems.length === 0 && (
        <div className="absolute inset-0 grid place-items-center px-8 text-center">
          <div className="max-w-md rounded-xl border border-[#E5E5E5] bg-white/90 p-6 shadow-sm">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#EEF2FF] text-[#6366F1]">
              <MaterialIcon name="collections" size={26} />
            </span>
            <h2 className="mt-4 font-display text-2xl text-[#333]">Start the {activeLabel} board</h2>
            <p className="mt-2 text-sm leading-6 text-[#777]">Upload screenshots, add links, or describe what Vibro should search for when you do not have inspiration yet.</p>
          </div>
        </div>
      )}

      {visibleItems.map((item) => {
        const selected = selectedIds.includes(item.id);
        return (
          <article
            key={item.id}
            className={`absolute flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition ${
              selected ? "border-[#6366F1] ring-2 ring-[#6366F1]/20" : "border-[#E5E5E5] hover:border-[#C7D2FE]"
            }`}
            style={{ left: item.x, top: item.y, width: item.width, height: item.height, zIndex: selected ? 14 : 12 }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              selectItem(item.id, event.shiftKey || event.metaKey);
              cardPointerRef.current = { id: item.id, startX: event.clientX, startY: event.clientY, moved: false };
              setDragState({ id: item.id, startX: event.clientX, startY: event.clientY, itemX: item.x, itemY: item.y });
            }}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              const pointer = cardPointerRef.current;
              cardPointerRef.current = null;
              if (!pointer || pointer.id !== item.id || pointer.moved) return;
              openCardSource(item);
            }}
          >
            <div className="relative h-[46%] min-h-[96px] bg-[#F5F5F5]">
              {item.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#F8FAFC,#EEF2FF)] text-[#6366F1]">
                  <MaterialIcon name={item.type === "note" ? "sticky_note_2" : item.type === "image" ? "image" : "travel_explore"} size={34} />
                </div>
              )}
              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#555] shadow-sm">{item.type}</div>
              {item.pinned && (
                <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[#101418] text-white shadow-sm">
                  <MaterialIcon name="push_pin" size={13} fill />
                </span>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-[#333]">{item.title}</h3>
                  <p className="mt-0.5 truncate text-[11px] text-[#888]">{item.sourceDomain || item.url || "Board note"}</p>
                </div>
                <button title="Vote" onClick={() => updateItem(item.id, (current) => ({ ...current, votes: current.votes + 1 }))} className="flex items-center gap-1 rounded-md bg-[#F5F5F5] px-1.5 py-1 text-[11px] text-[#555]">
                  <MaterialIcon name="keyboard_arrow_up" size={14} />
                  {item.votes}
                </button>
              </div>

              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#666]">{item.description || item.analysis?.mood}</p>

              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#6366F1]">{tag}</span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-[11px] text-[#999]">
                  <MaterialIcon name="forum" size={13} />
                  Thread
                </div>
                <div className="flex items-center gap-1">
                  <button title="Pin" onClick={() => updateItem(item.id, (current) => ({ ...current, pinned: !current.pinned }))} className="grid h-7 w-7 place-items-center rounded-md text-[#666] hover:bg-[#F5F5F5]">
                    <MaterialIcon name="push_pin" size={15} fill={item.pinned} />
                  </button>
                  <button title="Open source" onClick={() => openCardSource(item)} className="grid h-7 w-7 place-items-center rounded-md text-[#666] hover:bg-[#F5F5F5]" disabled={!getCardOpenTarget(item)}>
                    <MaterialIcon name="open_in_new" size={15} />
                  </button>
                  <button title="Delete card" onClick={() => deleteItems([item.id])} className="grid h-7 w-7 place-items-center rounded-md text-[#B42318] hover:bg-[#FEF3F2]">
                    <MaterialIcon name="delete" size={15} />
                  </button>
                </div>
              </div>
            </div>

            <button
              title="Resize"
              className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded text-[#AAA] hover:bg-[#F5F5F5] hover:text-[#555]"
              onPointerDown={(event) => {
                event.stopPropagation();
                selectItem(item.id, false);
                setResizeState({ id: item.id, startX: event.clientX, startY: event.clientY, width: item.width, height: item.height });
              }}
            >
              <MaterialIcon name="open_in_full" size={12} />
            </button>
          </article>
        );
      })}

      {(researchRunning || researchRun || architecturePlan) && (
        <section
          className="absolute flex max-h-[calc(100vh-220px)] w-[390px] flex-col rounded-xl border border-[#E5E5E5] bg-white/95 shadow-lg backdrop-blur"
          style={{ left: researchPanel.x, top: researchPanel.y, zIndex: researchPanel.z }}
        >
          <div
            className="flex cursor-move items-center justify-between border-b border-[#E5E5E5] px-3 py-2"
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              setFloatingPanelDrag({ panel: "research", startX: event.clientX, startY: event.clientY, panelX: researchPanel.x, panelY: researchPanel.y });
            }}
          >
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-[#333]">Vibro research pipeline</h3>
              <p className="truncate text-[10px] text-[#888]">{researchRun?.query || searchPrompt || "Search, analyze links, generate architecture"}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => movePanelLayer("research", "front")} className="grid h-7 w-7 place-items-center rounded-md text-[#888] hover:bg-[#F5F5F5] hover:text-[#333]" title="Bring to front">
                <MaterialIcon name="flip_to_front" size={15} />
              </button>
              <button onClick={() => movePanelLayer("research", "back")} className="grid h-7 w-7 place-items-center rounded-md text-[#888] hover:bg-[#F5F5F5] hover:text-[#333]" title="Send behind cards">
                <MaterialIcon name="flip_to_back" size={15} />
              </button>
              <button
                onClick={() => {
                  setResearchRun(null);
                  setArchitecturePlan(null);
                  setResearchRunning(false);
                }}
                className="grid h-7 w-7 place-items-center rounded-md text-[#888] hover:bg-[#F5F5F5] hover:text-[#333]"
                title="Close"
              >
                <MaterialIcon name="close" size={16} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="space-y-1.5">
              {(researchRun?.steps || [
                { id: "understand", label: "Understanding idea", status: researchRunning ? "active" : "queued", detail: "Preparing research run." },
                { id: "search", label: "Searching web", status: "queued" },
                { id: "extract", label: "Extracting links", status: "queued" },
                { id: "analyze", label: "Analyzing evidence", status: "queued" },
              ]).map((step) => (
                <div key={step.id} className="flex items-start gap-2 rounded-lg bg-[#F8FAFC] px-2 py-1.5">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      step.status === "done" ? "bg-[#12B76A]" : step.status === "active" ? "bg-[#6366F1] animate-pulse" : step.status === "error" ? "bg-[#F04438]" : "bg-[#D0D5DD]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#444]">{step.label}</p>
                    {step.detail && <p className="line-clamp-2 text-[10px] leading-4 text-[#888]">{step.detail}</p>}
                  </div>
                </div>
              ))}
            </div>

            {researchRun?.warning && <p className="mt-3 rounded-lg bg-[#FFFAEB] p-2 text-[10px] leading-4 text-[#B54708]">{researchRun.warning}</p>}

            {researchRun?.analyses?.length ? (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#333]">Analyzed references</span>
                  <button
                    onClick={() => researchRun.analyses.forEach((analysis, index) => addAnalysisCard(analysis, index))}
                    className="rounded-md bg-[#101418] px-2 py-1 text-[10px] font-semibold text-white"
                  >
                    Add all
                  </button>
                </div>
                <div className="space-y-2">
                  {researchRun.analyses.map((analysis, index) => (
                    <div key={analysis.url} className="rounded-lg border border-[#E5E5E5] bg-white p-2">
                      <div className="flex items-start gap-2">
                        {analysis.screenshotUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={analysis.screenshotUrl} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
                        ) : (
                          <span className="grid h-12 w-16 shrink-0 place-items-center rounded-md bg-[#EEF2FF] text-[#6366F1]">
                            <MaterialIcon name="image_search" size={18} />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[11px] font-semibold text-[#333]">{analysis.title}</p>
                            <span className="rounded-full bg-[#ECFDF3] px-1.5 py-0.5 text-[9px] font-semibold text-[#027A48]">{Math.round(analysis.score * 100)}%</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#777]">{analysis.summary}</p>
                        </div>
                        <button onClick={() => addAnalysisCard(analysis, index)} className="grid h-7 w-7 place-items-center rounded-md bg-[#101418] text-white" title="Add analyzed card">
                          <MaterialIcon name="add" size={14} />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {analysis.architectureSignals.slice(0, 3).map((signal) => (
                          <span key={signal} className="rounded-full bg-[#F2F4F7] px-2 py-0.5 text-[9px] font-medium text-[#667085]">{signal}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {architecturePlan && (
              <div className="mt-3 rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#333]">Generated architecture</span>
                  <button
                    onClick={() => void generateArchitectureFromBoard()}
                    disabled={architectureRunning}
                    className="rounded-md bg-[#EEF2FF] px-2 py-1 text-[10px] font-semibold text-[#6366F1] disabled:opacity-60"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="text-[10px] leading-4 text-[#666]">{architecturePlan.productBrief.coreValue}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    ["Screens", architecturePlan.screens],
                    ["Modules", architecturePlan.modules],
                    ["Data", architecturePlan.dataEntities],
                    ["APIs", architecturePlan.apiRoutes],
                  ].map(([label, values]) => (
                    <div key={label as string} className="rounded-md bg-white p-2">
                      <p className="text-[9px] font-bold uppercase text-[#888]">{label as string}</p>
                      <p className="mt-1 line-clamp-3 text-[10px] leading-4 text-[#555]">{(values as string[]).slice(0, 4).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-[#E5E5E5] p-3">
            <button
              onClick={() => void generateArchitectureFromBoard()}
              disabled={architectureRunning}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-[#101418] text-[11px] font-semibold text-white disabled:opacity-60"
            >
              <MaterialIcon name="account_tree" size={14} />
              Generate architecture
            </button>
          </div>
        </section>
      )}

      {(searchRunning || searchResults.length > 0 || lastSearch) && (
        <div
          className="absolute w-[460px] rounded-xl border border-[#E5E5E5] bg-white/95 p-3 shadow-lg backdrop-blur"
          style={{ left: searchPanel.x, top: searchPanel.y, zIndex: searchPanel.z }}
        >
          <div
            className="mb-2 flex cursor-move items-center justify-between"
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              setFloatingPanelDrag({ panel: "search", startX: event.clientX, startY: event.clientY, panelX: searchPanel.x, panelY: searchPanel.y });
            }}
          >
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#333]">Live web inspiration search</span>
              {lastSearch?.query && <p className="mt-0.5 truncate text-[10px] text-[#888]">{lastSearch.query}</p>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => movePanelLayer("search", "front")} className="grid h-7 w-7 place-items-center rounded-md text-[#888] hover:bg-[#F5F5F5] hover:text-[#333]" title="Bring to front">
                <MaterialIcon name="flip_to_front" size={15} />
              </button>
              <button onClick={() => movePanelLayer("search", "back")} className="grid h-7 w-7 place-items-center rounded-md text-[#888] hover:bg-[#F5F5F5] hover:text-[#333]" title="Send behind cards">
                <MaterialIcon name="flip_to_back" size={15} />
              </button>
              <button
                onClick={() => {
                  searchAbortRef.current?.abort();
                  setSearchResults([]);
                  setLastSearch(null);
                  setSearchRunning(false);
                  setSearchSteps(initialSearchSteps());
                }}
                className="grid h-7 w-7 place-items-center rounded-md text-[#888] hover:bg-[#F5F5F5] hover:text-[#333]"
                title="Close"
              >
                <MaterialIcon name="close" size={16} />
              </button>
            </div>
          </div>

          <div className="mb-3 rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#333]">{lastSearch?.contextSummary || (items.length ? "Expanding from selected and pinned inspiration." : "Searching from your description.")}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${searchRunning ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#EEF2FF] text-[#6366F1]"}`}>
                {searchRunning ? "Searching live" : lastSearch?.provider || "Ready"}
              </span>
            </div>
            {lastSearch?.warning && <p className="mt-1 text-[10px] leading-4 text-[#B54708]">{lastSearch.warning}</p>}
            <div className="mt-2 grid grid-cols-5 gap-1">
              {searchSteps.map((step) => (
                <div key={step.id} className="min-w-0 rounded-md bg-white px-2 py-1.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        step.status === "done" ? "bg-[#12B76A]" : step.status === "active" ? "bg-[#6366F1] animate-pulse" : step.status === "error" ? "bg-[#F04438]" : "bg-[#D0D5DD]"
                      }`}
                    />
                    <span className="truncate text-[9px] font-semibold text-[#555]">{step.label}</span>
                  </div>
                  {step.detail && <p className="mt-1 line-clamp-2 text-[9px] leading-3 text-[#888]">{step.detail}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {searchRunning && searchResults.length === 0 && (
              <div className="grid h-24 place-items-center rounded-lg border border-dashed border-[#D0D5DD] bg-white text-center">
                <div>
                  <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-[#EEF2FF] text-[#6366F1]">
                    <MaterialIcon name="travel_explore" size={17} />
                  </span>
                  <p className="mt-2 text-[11px] text-[#777]">Searching live sources and ranking references...</p>
                </div>
              </div>
            )}

            {searchResults.map((result, index) => (
              <div key={result.id} className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-2">
                {result.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.thumbnailUrl} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
                ) : (
                  <div className="grid h-12 w-16 shrink-0 place-items-center rounded-md bg-[#EEF2FF] text-[#6366F1]">
                    <MaterialIcon name="travel_explore" size={18} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-[#333]">{result.title}</p>
                    <span className="shrink-0 rounded-full bg-[#F2F4F7] px-1.5 py-0.5 text-[9px] font-semibold text-[#667085]">{Math.round(result.relevanceScore * 100)}%</span>
                  </div>
                  <p className="truncate text-[11px] text-[#888]">{result.reason}</p>
                </div>
                <button onClick={() => addSearchResult(result, index)} className="grid h-8 w-8 place-items-center rounded-md bg-[#101418] text-white" title="Add to board">
                  <MaterialIcon name="add" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
