import { logger, metadata, task, wait } from "@trigger.dev/sdk/v3";
import { fallbackContextWorkspace } from "@/lib/context-workspace";

export const generateContextWorkspaceTask = task({
  id: "generate-context-workspace",
  description: "Prepare Vibro planning artifacts for a project workspace",
  retry: {
    maxAttempts: 3,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 10_000,
  },
  run: async (payload: { projectName: string; prompt: string; provider?: string }) => {
    logger.info("Generating context workspace", {
      projectName: payload.projectName,
      provider: payload.provider || "gemini",
    });

    metadata.set("progress", 10).set("stage", "brief");
    await wait.for({ seconds: 1 });
    metadata.set("progress", 38).set("stage", "design-system");
    await wait.for({ seconds: 1 });
    metadata.set("progress", 68).set("stage", "architecture");
    await wait.for({ seconds: 1 });
    metadata.set("progress", 100).set("stage", "context-bundle");

    return fallbackContextWorkspace(payload.projectName, payload.prompt, `trigger:${payload.provider || "gemini"}`);
  },
});
