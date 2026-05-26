import { logger, metadata, task } from "@trigger.dev/sdk/v3";

export const scanGitHubRepoTask = task({
  id: "scan-github-repo",
  description: "Scan a GitHub repository and generate a context bundle",
  retry: {
    maxAttempts: 2,
    factor: 1.5,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: {
    repo_id: string;
    repo_full_name: string;
    branch: string;
    user_id: string;
  }) => {
    logger.info("Starting GitHub repo scan", {
      repo: payload.repo_full_name,
      branch: payload.branch,
    });

    metadata.set("progress", 5).set("stage", "fetching_tree");

    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/github/scan`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_id: payload.repo_id,
          repo_full_name: payload.repo_full_name,
          branch: payload.branch,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      throw new Error(`Scan failed: ${err}`);
    }

    const scanResult = await tokenResponse.json();
    const scanId = scanResult.scan_id;

    metadata.set("progress", 60).set("stage", "scanning_code");

    await new Promise((resolve) => setTimeout(resolve, 500));

    metadata.set("progress", 80).set("stage", "generating_bundle");

    const bundleResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/github/bundle`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_id: payload.repo_id,
          scan_id: scanId,
        }),
      }
    );

    if (!bundleResponse.ok) {
      const err = await bundleResponse.text();
      throw new Error(`Bundle generation failed: ${err}`);
    }

    const bundleResult = await bundleResponse.json();

    metadata.set("progress", 100).set("stage", "complete");

    return {
      scan_id: scanId,
      bundle_id: bundleResult.bundle?.id,
      framework_count: scanResult.result?.frameworks?.length || 0,
      endpoint_count: scanResult.result?.endpoints?.length || 0,
    };
  },
});
