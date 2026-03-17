import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * POST /api/ai/chat
 * Proxies chat requests to Google Gemini Flash 1.5
 * Supports streaming via Server-Sent Events
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      temperature = 0.7,
      max_tokens = 4096,
      stream = true,
      system,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from environment variables." },
        { status: 500 }
      );
    }

    // Map OpenAI-style messages → Gemini format
    const geminiContents = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Extract system message if present (first system role or explicit system param)
    const systemMsg =
      system ||
      messages.find((m: any) => m.role === "system")?.content ||
      undefined;

    const geminiBody: any = {
      contents: geminiContents,
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens,
      },
    };

    if (systemMsg) {
      geminiBody.systemInstruction = {
        parts: [{ text: systemMsg }],
      };
    }

    if (stream) {
      // Streaming endpoint
      const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;
      const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      });

      if (!geminiResponse.ok) {
        const err = await geminiResponse.text();
        console.error("Gemini stream error:", err);
        return NextResponse.json({ error: err }, { status: geminiResponse.status });
      }

      // Transform Gemini SSE → OpenAI-compatible SSE for client compatibility
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      (async () => {
        const reader = geminiResponse.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              await writer.write(encoder.encode("data: [DONE]\n\n"));
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            // Gemini SSE lines look like: data: {...}
            for (const line of chunk.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const json = line.slice(6).trim();
              if (!json || json === "[DONE]") continue;
              try {
                const parsed = JSON.parse(json);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
                if (text) {
                  // Emit in OpenAI delta format so existing clients work unchanged
                  const delta = JSON.stringify({
                    choices: [{ delta: { content: text }, finish_reason: null }],
                  });
                  await writer.write(encoder.encode(`data: ${delta}\n\n`));
                }
                // Handle finish
                const finishReason = parsed?.candidates?.[0]?.finishReason;
                if (finishReason && finishReason !== "STOP") {
                  await writer.write(encoder.encode("data: [DONE]\n\n"));
                }
              } catch (_) {
                // Skip malformed chunks
              }
            }
          }
        } finally {
          writer.releaseLock();
        }
      })();

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // Non-streaming endpoint
      const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      });

      if (!geminiResponse.ok) {
        const err = await geminiResponse.text();
        console.error("Gemini error:", err);
        return NextResponse.json({ error: err }, { status: geminiResponse.status });
      }

      const data = await geminiResponse.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // Return in OpenAI-compatible shape so existing clients need no changes
      return NextResponse.json({
        choices: [{ message: { role: "assistant", content }, finish_reason: "stop" }],
        model: GEMINI_MODEL,
      });
    }
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
