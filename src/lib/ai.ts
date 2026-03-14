
/**
 * Generic AI utility for Vibro AI
 * Calls our internal API route which proxies to OpenRouter
 */

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export const streamAIChat = async (
  messages: { role: string; content: string }[],
  onUpdate: (text: string) => void,
  options: ChatOptions = {}
) => {
  const { 
    model = "openrouter/free",
    temperature = 0.7,
    max_tokens = 500
  } = options;

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      
      // Handle OpenRouter/OpenAI error object format: { error: { message: "..." } }
      let errorMessage = "Unknown error";
      if (typeof errorData.error === 'object' && errorData.error !== null) {
        errorMessage = errorData.error.message || JSON.stringify(errorData.error);
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    const decoder = new TextDecoder();
    let partialData = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partialData += chunk;
      
      const lines = partialData.split("\n");
      // Keep the last line if it doesn't end with a newline (partial line)
      partialData = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") continue;
        
        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.slice(6);
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices?.[0]?.delta?.content || "";
            if (content) {
              onUpdate(content);
            }
          } catch (e) {
            // If it's not valid JSON, it might be a split line we missed or just noise
            // We'll log it in dev but ignore it for the user experience
            // console.warn("AI Stream Parse Error:", e, "Line:", trimmed);
          }
        }
      }
    }
  } catch (error) {
    console.error("AI Stream Error:", error);
    throw error;
  }
};
