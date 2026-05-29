import { metadata, task } from "@trigger.dev/sdk/v3";
import { runInspirationResearch } from "@/lib/inspiration-research";
import type { InspirationItem, InspirationSearchMode } from "@/lib/inspiration";

export const inspirationResearchTask = task({
  id: "inspiration-research",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 15_000,
  },
  run: async (payload: {
    prompt: string;
    activeTab: string;
    workspaceDescription?: string;
    mode: InspirationSearchMode;
    items?: InspirationItem[];
  }) => {
    metadata.set("stage", "research").set("progress", 10);
    const run = await runInspirationResearch({ ...payload, maxResults: 8 });
    metadata.set("stage", "complete").set("progress", 100).set("resultCount", run.analyses.length);
    return run;
  },
});
