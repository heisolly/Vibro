"use client";

import { useState, type ReactNode } from "react";

interface PromptTabsProps {
  previewAvailable: boolean;
  previewSlot: ReactNode;
  promptSlot: ReactNode;
}

type Tab = "preview" | "prompt";

export default function PromptTabs({ previewAvailable, previewSlot, promptSlot }: PromptTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(previewAvailable ? "preview" : "prompt");

  return (
    <div className="w-full">
      {/* Brutalist Segmented Control */}
      <div className="mb-10 inline-flex items-center rounded-2xl border-[3px] border-black bg-white p-2 shadow-[6px_6px_0_rgba(0,0,0,1)]">
        {previewAvailable && (
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-3 rounded-xl px-6 py-3 text-xs font-[1000] transition-all uppercase tracking-widest ${
              activeTab === "preview"
                ? "bg-black text-[#b8f724]"
                : "text-zinc-400 hover:text-black hover:bg-zinc-50"
            }`}
            aria-selected={activeTab === "preview"}
            role="tab"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Live_Rendering
          </button>
        )}
        <button
          onClick={() => setActiveTab("prompt")}
          className={`flex items-center gap-3 rounded-xl px-6 py-3 text-xs font-[1000] transition-all uppercase tracking-widest ${
            activeTab === "prompt"
              ? "bg-black text-[#b8f724]"
              : "text-zinc-400 hover:text-black hover:bg-zinc-50"
          }`}
          aria-selected={activeTab === "prompt"}
          role="tab"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Prompt_Matrix
        </button>
      </div>

      {/* Tab content */}
      <div role="tabpanel" className="animate-item" style={{ opacity: 1, transform: 'none' }}>
        {activeTab === "preview" && previewAvailable && previewSlot}
        {activeTab === "prompt" && promptSlot}
      </div>
    </div>
  );
}
