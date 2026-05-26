"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { MaterialIcon } from "@/components/vibro/ui";

const chips = [
  { icon: "image", label: "Image" },
  { icon: "smart_toy", label: "Model" },
  { icon: "brush", label: "Style" },
  { icon: "aspect_ratio", label: "Ratio" },
  { icon: "grid_view", label: "Count" },
  { icon: "travel_explore", label: "Reference" },
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
    onSend(text);
    setInput("");
    if (textRef.current) textRef.current.style.height = "auto";
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 72) + "px";
  }

  const maxWidth = rightOpen ? "calc(100% - 96px - 320px)" : "calc(100% - 96px)";

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
      style={{ width: `min(600px, ${maxWidth})` }}
    >
      <div className="bg-white rounded-[14px] border border-[#E0E0E0] shadow-[0_4px_24px_rgba(0,0,0,0.10)] px-4 pt-3 pb-[10px]">
        <div className="flex items-start gap-2">
          <textarea
            ref={textRef}
            value={input}
            onChange={handleInput}
            onKeyDown={onKeyDown}
            placeholder="Describe what you want to generate"
            rows={1}
            className="flex-1 resize-none bg-transparent text-[14px] text-[#333] outline-none placeholder:text-[#AAA] leading-6 min-h-[24px] max-h-[72px]"
          />
          <button
            className="shrink-0 mt-0.5 text-[#AAA] hover:text-[#555] transition"
            title="Prompt history"
          >
            <MaterialIcon name="list" size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {chips.map((chip) => (
              <button
                key={chip.label}
                className="inline-flex items-center gap-1 px-[10px] py-[4px] rounded-full border border-[#E5E5E5] bg-[#F5F5F5] text-[12px] text-[#555] hover:bg-[#EBEBEB] transition"
              >
                <MaterialIcon name={chip.icon} size={13} />
                {chip.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[#AAA] hover:text-[#555] transition" title="Attach">
              <MaterialIcon name="attach_file" size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center hover:bg-[#4F46E5] transition disabled:bg-[#E5E5E5] disabled:text-[#AAA]"
            >
              <MaterialIcon name="arrow_upward" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
