"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { demoUser, projectStorageKey, userStorageKey, type VibroProject, type VibroUser } from "@/lib/vibro";
import type { ContextBundle } from "@/lib/github-types";
import WorkspaceEditor from "@/components/workspace/WorkspaceEditor";
import { LiveblocksRoomProvider, LiveblocksWrapperProvider } from "@/components/LiveblocksProvider";

type Provider = "gemini" | "mistral" | "groq";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const systemPrompt =
  "You are Vibro, a Context OS for AI-assisted development. Do not write application code. Reason clearly and help the user shape product intent, design systems, architecture boards, inspiration maps, context bundles, and MCP handoff material. Keep replies practical, fast, and structured. Never mention your model name, provider, or internal details. Do not use markdown formatting — plain text only.";

function parseStreamChunk(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data: "))
    .map((line) => line.slice(6));
}

export default function WorkspacePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const chatKey = `vibro-chat:${slug}`;
  const contextKey = `vibro-context-${slug}`;
  const [user, setUser] = useState<VibroUser>(demoUser);
  const [project, setProject] = useState<VibroProject | null>(null);
  const [provider, setProvider] = useState<Provider>("groq");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [bundles, setBundles] = useState<ContextBundle[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem(userStorageKey);
    const parsedUser = storedUser ? (JSON.parse(storedUser) as VibroUser) : demoUser;
    setUser(parsedUser);

    const storedProjects = localStorage.getItem(projectStorageKey(parsedUser.id));
    const projects = storedProjects ? (JSON.parse(storedProjects) as VibroProject[]) : [];
    const found = projects.find((item) => item.slug === slug);
    setProject(
      found || {
        id: slug,
        name: slug.replace(/-/g, " "),
        slug,
        region: "Global",
        description: "Context OS workspace for project planning and AI handoff.",
        createdAt: new Date().toISOString(),
      }
    );

    const storedMessages = localStorage.getItem(chatKey);
    if (storedMessages) setMessages(JSON.parse(storedMessages));

    const supabase = createClient();

    fetch("/api/github/bundle/latest")
      .then((res) => res.json())
      .then((data) => {
        if (data.bundles) setBundles(data.bundles);
      })
      .catch(() => {});

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data.user) {
          const displayName =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            parsedUser.name;
          setUser({
            id: data.user.id,
            email: data.user.email || parsedUser.email,
            name: displayName,
          });
        }
      })
      .catch(() => undefined);
  }, [chatKey, slug]);

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [chatKey, messages]);

  const projectName = useMemo(() => {
    const raw = project?.name || slug || "Vibro";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [project?.name, slug]);

  async function queueContextWorkspace(prompt: string) {
    try {
      const response = await fetch("/api/vibro/context-workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, prompt, provider }),
      });
      const data = await response.json();
      if (data.workspace) {
        localStorage.setItem(contextKey, JSON.stringify(data.workspace));
      }
    } catch {
      // Chat still works if the durable context task is unavailable locally.
    }
  }

  async function streamAssistantReply(activeProvider: Provider, nextMessages: Message[], assistantId: string) {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: activeProvider,
        stream: true,
        temperature: 0.45,
        max_tokens: 1400,
        system: `${systemPrompt}\nProject: ${projectName}`,
        messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
      }),
    });

    if (!response.ok || !response.body) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "The AI provider did not respond.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const payload of parseStreamChunk(chunk)) {
        if (payload === "[DONE]") continue;
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content || "";
          assistantText += delta;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, content: assistantText } : message
            )
          );
        } catch {
          assistantText += payload;
        }
      }
    }
  }

  async function sendMessage(prompt: string) {
    if (!prompt.trim() || isThinking) return;

    const nextMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: prompt },
    ];
    const assistantId = crypto.randomUUID();
    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setIsThinking(true);
    void queueContextWorkspace(prompt);

    try {
      await streamAssistantReply(provider, nextMessages, assistantId);
    } catch (error) {
      if (provider === "gemini") {
        setProvider("groq");
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: "Gemini is busy. Switching to Groq..." }
              : message
          )
        );
        try {
          await streamAssistantReply("groq", nextMessages, assistantId);
          return;
        } catch {
          // Fall through to the visible error below.
        }
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  error instanceof Error
                    ? `I could not reach ${provider}. ${error.message}`
                    : "I could not reach the AI provider.",
              }
            : message
        )
      );
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <LiveblocksWrapperProvider>
      <LiveblocksRoomProvider roomId={`workspace:${slug}`}>
        <WorkspaceEditor
          slug={slug}
          project={project}
          user={user}
          messages={messages}
          isThinking={isThinking}
          onSendToAI={sendMessage}
          bundles={bundles}
        />
      </LiveblocksRoomProvider>
    </LiveblocksWrapperProvider>
  );
}
