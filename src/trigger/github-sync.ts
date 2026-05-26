import { logger, metadata, task } from "@trigger.dev/sdk/v3";

export const checkGitHubDriftTask = task({
  id: "check-github-drift",
  description: "Check a GitHub repo for new commits and detect drift from last scan",
  retry: {
    maxAttempts: 3,
    factor: 1.5,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async (payload: {
    subscription_id: string;
    repo_id: string;
    repo_full_name: string;
    branch: string;
    user_id: string;
    last_known_commit: string | null;
  }) => {
    logger.info("Checking for drift", {
      repo: payload.repo_full_name,
      lastCommit: payload.last_known_commit,
    });

    metadata.set("progress", 10).set("stage", "fetching_latest_commit");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const token = await fetch(`${appUrl}/api/internal/github-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: payload.user_id }),
    });

    if (!token.ok) {
      throw new Error("Failed to get GitHub token");
    }

    const { access_token } = await token.json();
    if (!access_token) {
      throw new Error("No GitHub token available");
    }

    const commitResponse = await fetch(
      `https://api.github.com/repos/${payload.repo_full_name}/commits/${payload.branch}?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "Vibro-Context-OS",
        },
      }
    );

    if (!commitResponse.ok) {
      throw new Error(`GitHub API error: ${commitResponse.statusText}`);
    }

    const [latestCommit] = await commitResponse.json();
    const latestSha = latestCommit?.sha;

    if (!latestSha) {
      throw new Error("Could not fetch latest commit SHA");
    }

    metadata.set("progress", 40).set("stage", "comparing_commits");

    if (payload.last_known_commit && latestSha !== payload.last_known_commit) {
      const compareResponse = await fetch(
        `https://api.github.com/repos/${payload.repo_full_name}/compare/${payload.last_known_commit}...${latestSha}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "Vibro-Context-OS",
          },
        }
      );

      const compareData = compareResponse.ok ? await compareResponse.json() : null;
      const changedFiles = compareData?.files?.map((f: any) => ({
        filename: f.filename,
        status: f.status,
      })) || [];

      metadata.set("progress", 70).set("stage", "drift_detected");

      const driftResponse = await fetch(`${appUrl}/api/github/sync/drift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription_id: payload.subscription_id,
          repo_id: payload.repo_id,
          old_sha: payload.last_known_commit,
          new_sha: latestSha,
          changed_files: changedFiles,
        }),
      });

      if (!driftResponse.ok) {
        throw new Error("Failed to record drift");
      }

      metadata.set("progress", 100).set("stage", "drift_recorded");

      return {
        drift_detected: true,
        old_sha: payload.last_known_commit,
        new_sha: latestSha,
        changed_files: changedFiles.length,
        message: `${changedFiles.length} files changed since last scan`,
      };
    }

    metadata.set("progress", 100).set("stage", "up_to_date");

    return {
      drift_detected: false,
      sha: latestSha,
      message: "Repository is up to date",
    };
  },
});
