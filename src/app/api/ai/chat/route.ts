import { NextRequest, NextResponse } from "next/server";
import { GEMINI_MODEL, getGeminiModel, getMistralConfig } from "@/lib/ai-providers";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type Provider = "gemini" | "mistral";

export const runtime = "nodejs";

function buildPrompt(messages: ChatMessage[], system?: string) {
  const systemPrompt =
    system ||
    messages.find((message) => message.role === "system")?.content ||
    "You are Vibro, a Context OS assistant. You do not write application code. You prepare product briefs, design systems, architecture boards, inspiration maps, context bundles, and AI handoff material.";

  const conversation = messages
    .filter((message) => message.role !== "system")
    .map((message) => `${message.role === "assistant" ? "Vibro" : "User"}: ${message.content}`)
    .join("\n\n");

  return `${systemPrompt}\n\n${conversation}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      temperature = 0.7,
      max_tokens = 4096,
      stream = true,
      system,
      provider = "gemini",
    }: {
      messages?: ChatMessage[];
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
      system?: string;
      provider?: Provider;
    } = body;

    const prompt = buildPrompt(messages, system);

    if (provider === "mistral") {
      const config = getMistralConfig();
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens,
          stream,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Mistral request failed");
      }

      if (stream && response.body) {
        return new Response(response.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      return NextResponse.json(await response.json());
    }

    const model = getGeminiModel();

    if (stream) {
      const result = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: max_tokens,
        },
      });

      const encoder = new TextEncoder();
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      (async () => {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (!text) continue;
            const delta = JSON.stringify({
              choices: [{ delta: { content: text }, finish_reason: null }],
            });
            await writer.write(encoder.encode(`data: ${delta}\n\n`));
          }
          await writer.write(encoder.encode("data: [DONE]\n\n"));
        } catch (error) {
          const delta = JSON.stringify({
            choices: [{ delta: { content: "" }, finish_reason: "error" }],
            error: error instanceof Error ? error.message : "Gemini stream failed",
          });
          await writer.write(encoder.encode(`data: ${delta}\n\n`));
        } finally {
          await writer.close();
        }
      })();

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens,
      },
    });

    return NextResponse.json({
      choices: [{ message: { role: "assistant", content: result.response.text() }, finish_reason: "stop" }],
      model: GEMINI_MODEL,
    });
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
