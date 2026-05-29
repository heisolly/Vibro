"use client";

import { useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/vibro/ui";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface InlineAIResponseProps {
  messages: Message[];
  isThinking: boolean;
  onDismiss: () => void;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

export default function InlineAIResponse({
  messages,
  isThinking,
  onDismiss,
}: InlineAIResponseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or thinking state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const lastMessage = messages[messages.length - 1];
  const showLoadingDots =
    isThinking &&
    lastMessage?.role === "assistant" &&
    !lastMessage?.content;

  return (
    <div
      className="absolute bottom-6 left-6 z-20 flex flex-col rounded-2xl border border-[#E0E0E0] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)] overflow-hidden"
      style={{ width: "420px", maxWidth: "420px", maxHeight: "min(480px, 60vh)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0] shrink-0">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#111] text-white">
            <MaterialIcon name="auto_awesome" size={15} />
          </span>
          <span className="text-[13px] font-semibold text-[#333]">Vibro AI</span>
          {isThinking && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-medium text-[#6366F1]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-pulse"
              />
              Thinking
            </span>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#AAA] hover:bg-[#F5F5F5] hover:text-[#555] transition text-[16px] leading-none"
          aria-label="Dismiss"
        >
          <MaterialIcon name="close" size={15} />
        </button>
      </div>

      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 overflow-y-auto p-3"
        style={{ minHeight: 0 }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#333] px-3 py-2 text-[13px] leading-relaxed text-white">
                {message.content}
              </div>
            ) : (
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] leading-relaxed text-[#333]">
                {message.content}
              </div>
            )}
          </div>
        ))}

        {/* Loading dots for thinking state */}
        {showLoadingDots && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm border border-[#E5E5E5] bg-white">
              <LoadingDots />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
