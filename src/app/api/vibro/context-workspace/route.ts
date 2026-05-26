import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { GEMINI_MODEL, getGeminiModel, getMistralConfig, getGroqConfig } from "@/lib/ai-providers";
import { fallbackContextWorkspace, parseContextWorkspace } from "@/lib/context-workspace";
import type { generateContextWorkspaceTask } from "@/trigger/context-workspace";

export const runtime = "nodejs";

type Provider = "gemini" | "mistral" | "groq";

const SYSTEM_PROMPT = `You are Vibro, a Context OS for AI-assisted development.
You do not write application code. You convert a user's project description into planning artifacts:
product brief, design system, architecture board, inspiration board, context bundle, and MCP handoff.
Return only valid JSON matching this shape:
{
  "projectName": "string",
  "tagline": "Describe {projectName}",
  "summary": "one concise paragraph",
  "score": 0-100,
  "productBrief": { "audience": ["string"], "goals": ["string"], "workflows": ["string"], "assumptions": ["string"] },
  "designSystem": { "mood": "string", "colors": ["#hex"], "typography": ["string"], "components": ["string"], "motion": ["string"] },
  "architecture": { "modules": ["string"], "data": ["string"], "integrations": ["string"], "risks": ["string"] },
  "inspiration": { "references": ["string"], "notes": ["string"] },
  "contextBundle": { "version": "v1.0", "files": ["string"], "mcpHandoff": ["string"] }
}`;

async function runGemini(projectName: string, prompt: string) {
  const model = getGeminiModel();
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\nProject name: ${projectName}\nUser description: ${prompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  return parseContextWorkspace(result.response.text(), projectName, prompt, GEMINI_MODEL);
}

async function runMistral(projectName: string, prompt: string) {
  const config = getMistralConfig();
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Project name: ${projectName}\nUser description: ${prompt}` },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "{}";
  return parseContextWorkspace(text, projectName, prompt, config.model);
}

async function runGroq(projectName: string, prompt: string) {
  const config = getGroqConfig();
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Project name: ${projectName}\nUser description: ${prompt}` },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "{}";
  return parseContextWorkspace(text, projectName, prompt, config.model);
}

async function triggerGeneration(projectName: string, prompt: string, provider: Provider) {
  try {
    const handle = await tasks.trigger<typeof generateContextWorkspaceTask>(
      "generate-context-workspace",
      { projectName, prompt, provider },
      { tags: ["vibro", `provider_${provider}`] }
    );

    return { queued: true, id: handle.id, status: "QUEUED" };
  } catch (error) {
    return {
      queued: false,
      id: `local-${Date.now()}`,
      status: "LOCAL_FALLBACK",
      error: error instanceof Error ? error.message : "Trigger task unavailable",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const projectName = String(body.projectName || "Vibro").trim();
    const prompt = String(body.prompt || "").trim();
    const provider: Provider = body.provider === "groq" ? "groq" : body.provider === "mistral" ? "mistral" : "gemini";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const trigger = await triggerGeneration(projectName, prompt, provider);

    try {
      const workspace = provider === "groq"
        ? await runGroq(projectName, prompt)
        : provider === "mistral"
        ? await runMistral(projectName, prompt)
        : await runGemini(projectName, prompt);

      return NextResponse.json({ success: true, provider, trigger, workspace });
    } catch (error) {
      console.error("Context workspace AI generation failed:", error);
      return NextResponse.json({
        success: true,
        provider,
        trigger,
        recovered: true,
        workspace: fallbackContextWorkspace(projectName, prompt, `${provider}:fallback`),
        warning: error instanceof Error ? error.message : "AI provider failed; local fallback returned.",
      });
    }
  } catch (error) {
    console.error("Context workspace route failed:", error);
    return NextResponse.json({ error: "Failed to generate context workspace" }, { status: 500 });
  }
}
