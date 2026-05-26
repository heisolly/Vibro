import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
export const MISTRAL_MODEL = "mistral-large-latest";
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: GEMINI_MODEL,
  });
}

export function getMistralConfig() {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is missing.");
  }

  return {
    apiKey,
    model: MISTRAL_MODEL,
    endpoint: "https://api.mistral.ai/v1/chat/completions",
  };
}

export function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing.");
  }

  return {
    apiKey,
    model: GROQ_MODEL,
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
  };
}
