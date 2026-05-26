"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialIcon } from "@/components/vibro/ui";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function FloatingChat({
  open,
  onClose,
  messages,
  isThinking,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  isThinking: boolean;
  onSend: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const val = inputRef.current?.value.trim();
      if (!val || isThinking) return;
      onSend(val);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-6 z-50 flex w-[440px] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          style={{ maxHeight: "min(580px, calc(100vh - 180px))" }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                <MaterialIcon name="auto_awesome" size={15} />
              </span>
              <span className="text-sm font-semibold">Vibro AI</span>
              {isThinking && (
                <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Thinking
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              <MaterialIcon name="close" size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isThinking && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/5 text-primary">
                  <MaterialIcon name="auto_awesome" size={28} />
                </span>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Ask me anything — generate design tokens, map architecture, summarize changes, or check progress.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white mt-0.5 ${
                    msg.role === "assistant" ? "bg-purple-600" : "bg-primary"
                  }`}
                >
                  {msg.role === "assistant" ? "AI" : "U"}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-[#101418] text-white"
                      : "border border-border bg-secondary/60 text-foreground"
                  }`}
                >
                  {msg.content || (msg.role === "assistant" ? <span className="text-muted-foreground italic">Thinking...</span> : "")}
                </div>
              </div>
            ))}
            {isThinking && messages.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-purple-600 text-[10px] font-bold text-white mt-0.5">
                  AI
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-secondary/60 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-purple-400"
                      style={{ animation: `pulse 0.7s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition">
              <input
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder="Message Vibro AI..."
                className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => {
                  const val = inputRef.current?.value.trim();
                  if (!val || isThinking) return;
                  onSend(val);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                disabled={isThinking}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#101418] text-white disabled:opacity-40"
              >
                <MaterialIcon name="arrow_upward" size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
