"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/vibro/ui";

const threadLabels = ["Design System feedback", "Architecture review"];

const messages = [
  { name: "Micheal", text: "Pushed new auth tokens to the design system branch", time: "2m ago", color: "#14B8A6", thread: 0 },
  { name: "Vibro AI", text: "Generated color palette from the uploaded screenshot. 6 new tokens added.", time: "8m ago", color: "#6366F1", ai: true, thread: 0 },
  { name: "Tunde", text: "Let me review and merge before the standup", time: "12m ago", color: "#F43F5E", thread: 0 },
  { name: "Sade", text: "Architecture map needs updating — the auth service was split", time: "20m ago", color: "#8B5CF6", thread: 1 },
  { name: "Vibro AI", text: "Drift detected in API routes. Suggested merge path in the Architecture board.", time: "28m ago", color: "#6366F1", ai: true, thread: 1 },
];

const avatars = [
  { initials: "MO", color: "#14B8A6" },
  { initials: "TK", color: "#F43F5E" },
  { initials: "SA", color: "#8B5CF6" },
];

export default function RightPanel({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const [chatInput, setChatInput] = useState("");

  return (
    <aside
      className="fixed top-12 right-0 h-[calc(100vh-48px)] w-[300px] bg-white border-l border-[#E5E5E5] z-90 flex flex-col transition-transform duration-250 ease-out"
      style={{ transform: open ? "translateX(0)" : "translateX(300px)" }}
    >
      <div className="flex items-center justify-between h-12 px-4 border-b border-[#E5E5E5] shrink-0">
        <span className="text-[14px] font-medium text-[#333]">Team Chat</span>
        <button onClick={onToggle} className="text-[#888] hover:text-[#333] transition">
          <MaterialIcon name="close" size={18} />
        </button>
      </div>

      <div className="mx-3 mt-3 p-[10px_12px] bg-[#F9F9FB] rounded-[8px] border border-[#EBEBEB] shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-[#333]">Bundle v2.4.1</span>
          <span className="flex items-center gap-1 text-[11px] text-[#888]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Synced 2m ago
          </span>
        </div>
        <button className="text-[11px] text-[#6366F1] underline">Rollback</button>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#E5E5E5] shrink-0">
        {avatars.map((a, i) => (
          <div key={i} className="relative" title={a.initials}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: a.color }}
            >
              {a.initials}
            </div>
            <span className="absolute -bottom-[1px] -right-[1px] w-[6px] h-[6px] rounded-full bg-green-500 border border-white" />
          </div>
        ))}
        <span className="text-[11px] text-[#888] ml-1">3 online</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {[0, 1].map((threadIdx) => (
          <div key={threadIdx}>
            <span className="inline-block bg-[#EEF2FF] text-[#6366F1] text-[11px] rounded-full px-[10px] py-[2px] mb-2">
              {threadLabels[threadIdx]}
            </span>
            <div className="space-y-3">
              {messages
                .filter((m) => m.thread === threadIdx)
                .map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12px] font-bold text-[#333]">{m.name}</span>
                        <span className="text-[11px] text-[#AAA]">{m.time}</span>
                      </div>
                      {m.ai ? (
                        <div className="text-[13px] text-[#444] leading-5 border-l-2 border-[#6366F1] bg-[#F5F5FF] rounded-r-[6px] px-[10px] py-2 mt-0.5">
                          {m.text}
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#444] leading-5 mt-0.5">{m.text}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="h-12 shrink-0 border-t border-[#E5E5E5] bg-white flex items-center px-3">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Message the team…"
          className="flex-1 h-full border-none outline-none text-[13px] placeholder:text-[#AAA] bg-transparent"
        />
        <button
          disabled={!chatInput.trim()}
          className="w-8 h-8 flex items-center justify-center text-[#6366F1] disabled:text-[#CCC] transition"
        >
          <MaterialIcon name="arrow_upward" size={20} />
        </button>
      </div>
    </aside>
  );
}
