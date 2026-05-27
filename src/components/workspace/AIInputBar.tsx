"use client";

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { MaterialIcon } from "@/components/vibro/ui";

const chips = [
  { icon: "account_tree", label: "Architecture", prompt: "Map the architecture and suggest the next service to add" },
  { icon: "auto_fix_high", label: "Refine", prompt: "Refine this workspace and improve the current board" },
  { icon: "schema", label: "Auto layout", prompt: "Auto layout the architecture canvas and explain the flow" },
  { icon: "palette", label: "Design system", prompt: "Generate editable design system tokens for this project" },
  { icon: "inventory_2", label: "Bundle", prompt: "Prepare the context bundle for AI handoff" },
];

export default function AIInputBar({
  onSend,
  disabled = false,
  rightOpen,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  rightOpen?: boolean;
}) {
  const [input, setInput] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const text = input.trim();
    if (!text || disabled) return;
    window.dispatchEvent(new CustomEvent("vibro:architecture-command", { detail: { text } }));
    onSend(text);
    setInput("");
    if (textRef.current) textRef.current.style.height = "auto";
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 84)}px`;
  }

  function insertPrompt(prompt: string) {
    setInput((current) => (current ? `${current}\n${prompt}` : prompt));
    requestAnimationFrame(() => {
      textRef.current?.focus();
      if (textRef.current) {
        textRef.current.style.height = "auto";
        textRef.current.style.height = `${Math.min(textRef.current.scrollHeight, 96)}px`;
      }
    });
  }

  const maxWidth = rightOpen ? "calc(100% - 96px - 320px)" : "calc(100% - 96px)";

  return (
    <div
      className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
      style={{ width: `min(720px, ${maxWidth})` }}
    >
      <div className="overflow-hidden rounded-[22px] border border-[#dcdcdc] bg-white/95 shadow-[0_18px_55px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-[#eeeeee] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#111] text-white">
              <MaterialIcon name="auto_awesome" size={15} />
            </span>
            <div>
              <div className="text-xs font-semibold text-[#222]">Vibro command</div>
              <div className="text-[11px] text-[#888]">Ask it to edit boards, generate context, or plan next steps</div>
            </div>
          </div>
          {disabled && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Thinking
            </span>
          )}
        </div>
        <div className="flex items-start gap-2 px-4 py-3">
          <textarea
            ref={textRef}
            value={input}
            onChange={handleInput}
            onKeyDown={onKeyDown}
            placeholder="Tell Vibro what to build: add a database node, connect gateway to AI, auto layout, create design tokens..."
            rows={1}
            className="font-ai min-h-7 flex-1 resize-none bg-transparent text-[14px] leading-7 text-[#222] outline-none placeholder:text-[#8a8a8a]"
          />
          <button className="mt-1 grid h-7 w-7 place-items-center rounded-md text-[#999] transition hover:bg-[#f4f4f4] hover:text-[#444]" title="Prompt options">
            <MaterialIcon name="tune" size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between border-t border-[#eeeeee] px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {chips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => insertPrompt(chip.prompt)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium text-[#555] transition hover:bg-[#f5f5f5] hover:text-[#222]"
              >
                <MaterialIcon name={chip.icon} size={14} />
                {chip.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-full text-[#777] transition hover:bg-[#f5f5f5] hover:text-[#222]" title="Attach">
              <MaterialIcon name="attach_file" size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#111] text-white transition hover:scale-105 disabled:bg-[#e5e5e5] disabled:text-[#aaa]"
            >
              <MaterialIcon name={disabled ? "hourglass_top" : "arrow_upward"} size={17} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center text-[12px] text-[#8a8a8a]">
        Vibro can make mistakes. Check important context before handoff.
      </div>
    </div>
  );
}
