
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      messages, 
      model = "google/gemini-2.0-flash-001",
      temperature = 0.7,
      max_tokens = 2000,
      stream = true
    } = body;

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API Key is missing in environment variables" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://vibro.com", 
        "X-Title": "Vibro AI Architect", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API Error (${response.status}):`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    if (stream) {
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("OpenRouter API Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
