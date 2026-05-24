"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { demoUser, projectStorageKey, userStorageKey, type VibroProject, type VibroUser } from "@/lib/vibro";
import { MaterialIcon, VibroMark, spring } from "@/components/vibro/ui";

type Provider = "gemini" | "mistral";
type Theme = "light" | "dark";
type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
};

type IntegrationState = {
  liveblocks: boolean;
  trigger: boolean;
  gemini: boolean;
  mistral: boolean;
  supabase: boolean;
};

const defaultPrompt =
  "Describe the product, users, pages, data, integrations, visual style, and what Vibro should prepare...";

const systemPrompt =
  "You are Vibro, a Context OS for AI-assisted development. Do not write application code. Reason clearly and help the user shape product intent, design systems, architecture boards, inspiration maps, context bundles, and MCP handoff material. Keep replies practical, fast, and structured.";

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
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<VibroUser>(demoUser);
  const [project, setProject] = useState<VibroProject | null>(null);
  const [provider, setProvider] = useState<Provider>("gemini");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [status, setStatus] = useState<IntegrationState>({
    liveblocks: false,
    trigger: false,
    gemini: false,
    mistral: false,
    supabase: false,
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("vibro-theme") as Theme | null;
    const nextTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");

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

    fetch("/api/integrations/status")
      .then((response) => response.json())
      .then((data) => {
        setStatus((current) => ({
          ...current,
          liveblocks: Boolean(data.liveblocks?.connected),
          trigger: Boolean(data.trigger?.connected),
          gemini: Boolean(data.ai?.gemini),
          mistral: Boolean(data.ai?.mistral),
        }));
      })
      .catch(() => undefined);

    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        const authed = Boolean(data.user);
        setStatus((current) => ({ ...current, supabase: authed }));
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
      .catch(() => setStatus((current) => ({ ...current, supabase: false })));
  }, [chatKey, slug]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vibro-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt || isThinking) return;

    const nextMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: prompt },
    ];
    const assistantId = crypto.randomUUID();
    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsThinking(true);
    void queueContextWorkspace(prompt);

    try {
      await streamAssistantReply(provider, nextMessages, assistantId);
    } catch (error) {
      if (provider === "gemini" && status.mistral) {
        setProvider("mistral");
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: "Gemini is busy right now. Switching to Mistral..." }
              : message
          )
        );
        try {
          await streamAssistantReply("mistral", nextMessages, assistantId);
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

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  const isDark = theme === "dark";

  return (
    <main className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#07111f] text-white" : "bg-background text-foreground"}`}>
      <div className="pointer-events-none absolute inset-0 aurora-bg animate-pulse-slow" />
      <div className="pointer-events-none absolute inset-0 vibro-grain opacity-[0.08]" />

      <header className="relative z-20 flex items-center justify-between px-6 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2">
          <VibroMark dark={isDark} size={30} />
          <span className="font-display text-xl">Vibro</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusDot label="Supabase" active={status.supabase} />
          <StatusDot label="Liveblocks" active={status.liveblocks} />
          <StatusDot label="Trigger" active={status.trigger} />
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/75 text-foreground shadow-soft backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            <MaterialIcon name={isDark ? "light_mode" : "dark_mode"} size={18} />
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-5xl flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="text-center"
          >
            <p className="font-ai text-sm text-muted-foreground dark:text-white/55">
              Describe {projectName}
            </p>
            <h1 className="mx-auto mt-3 max-w-4xl font-display text-5xl leading-[1.02] text-foreground sm:text-6xl md:text-[68px] dark:text-white">
              Your Context OS for{" "}
              <span className="italic text-primary">AI-Assisted Development</span>
            </h1>
          </motion.div>

          <AnimatePresence initial={false}>
            {messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-auto mt-9 max-h-[34vh] w-full max-w-3xl overflow-y-auto pr-1"
              >
                <div className="space-y-3">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                  {isThinking && <TypingIndicator />}
                  <div ref={scrollRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            layout
            className="mx-auto mt-10 w-full max-w-3xl"
            transition={spring}
          >
            <div className="group relative">
              <div className="absolute -inset-2 rounded-[30px] bg-gradient-to-r from-primary/25 via-primary-glow/35 to-primary/20 opacity-80 blur-2xl transition group-focus-within:opacity-100" />
              <div className="relative overflow-hidden rounded-[28px] border border-border bg-card/95 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/10">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={onKeyDown}
                  rows={4}
                  placeholder={defaultPrompt}
                  className="min-h-28 w-full resize-none bg-transparent px-6 py-5 font-ai text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground/75 dark:text-white dark:placeholder:text-white/45"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 px-4 py-3 dark:border-white/10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/60">
                    <button aria-label="Add reference" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-secondary dark:hover:bg-white/10">
                      <MaterialIcon name="add" size={19} />
                    </button>
                    <button className="hidden h-9 items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 transition hover:bg-secondary sm:inline-flex dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
                      <MaterialIcon name="attach_file" size={16} />
                      References
                    </button>
                    <select
                      value={provider}
                      onChange={(event) => setProvider(event.target.value as Provider)}
                      className="h-9 rounded-full border border-border bg-secondary/70 px-3 text-sm text-foreground outline-none transition hover:bg-secondary dark:border-white/10 dark:bg-white/10 dark:text-white"
                    >
                      <option value="gemini">Gemini Flash</option>
                      <option value="mistral">Mistral</option>
                    </select>
                    <span className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-2 text-xs sm:inline-flex dark:border-white/10 dark:bg-white/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {provider === "gemini" ? (status.gemini ? "ready" : "local fallback") : status.mistral ? "ready" : "local fallback"}
                    </span>
                  </div>
                  <button
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || isThinking}
                    className="grid h-11 w-11 place-items-center rounded-full bg-[#101418] text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white dark:text-[#07111f]"
                  >
                    <MaterialIcon name={isThinking ? "hourglass_top" : "arrow_upward"} size={19} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-ai text-xs text-muted-foreground dark:text-white/50">
              <span className="rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur dark:border-white/10 dark:bg-white/10">Design system</span>
              <span className="rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur dark:border-white/10 dark:bg-white/10">Architecture board</span>
              <span className="rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur dark:border-white/10 dark:bg-white/10">Inspiration map</span>
              <span className="rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur dark:border-white/10 dark:bg-white/10">MCP handoff</span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function StatusDot({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      title={`${label}: ${active ? "connected" : "not connected"}`}
      className="hidden items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-2 text-xs text-muted-foreground backdrop-blur md:inline-flex dark:border-white/10 dark:bg-white/10 dark:text-white/60"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/25"}`} />
      {label}
    </span>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[86%] rounded-2xl px-4 py-3 font-ai text-sm leading-6 shadow-soft ${
          isUser
            ? "bg-[#101418] text-white dark:bg-white dark:text-[#07111f]"
            : "border border-border bg-card/85 text-foreground backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white"
        }`}
      >
        {message.content || <span className="text-muted-foreground">Thinking...</span>}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/75 px-3 py-2 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: index * 0.12 }}
          />
        ))}
      </div>
    </div>
  );
}
