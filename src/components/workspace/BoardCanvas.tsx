"use client";

import type { VibroBoard } from "@/lib/vibro";
import { MaterialIcon } from "@/components/vibro/ui";

function PlaceholderBoard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-8">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/60 text-[#6366F1] shadow-sm border border-[#E5E5E5]">
        <MaterialIcon name={icon} size={32} />
      </span>
      <h2 className="font-display text-2xl text-[#333]">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-[#888]">{description}</p>
    </div>
  );
}

function DesignBoard() {
  return (
    <PlaceholderBoard
      icon="palette"
      title="Design System"
      description="Tokens, styles, and components. Drag in screenshots or describe your visual language — Vibro will extract colors, typography, spacing, and shadows."
    />
  );
}

function ArchitectureBoard() {
  return (
    <PlaceholderBoard
      icon="account_tree"
      title="Architecture"
      description="System map of services, APIs, data flow, and integrations. Add nodes, draw connections, and track drift over time."
    />
  );
}

function InspirationBoard() {
  return (
    <PlaceholderBoard
      icon="collections"
      title="Inspiration"
      description="Screenshots, URLs, moodboards. Collect references and Vibro will extract patterns, color palettes, and layout ideas."
    />
  );
}

function ProgressBoard() {
  return (
    <PlaceholderBoard
      icon="assignment"
      title="Progress"
      description="Kanban-style tracking with drift alerts. Monitor what changed, what's blocked, and what's ready for handoff."
    />
  );
}

export default function BoardCanvas({ activeBoard }: { activeBoard: VibroBoard }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "#F0F0F0",
        backgroundImage: "radial-gradient(circle, #CCCCCC 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="relative h-full w-full p-6">
        {activeBoard === "design" && <DesignBoard />}
        {activeBoard === "architecture" && <ArchitectureBoard />}
        {activeBoard === "inspiration" && <InspirationBoard />}
        {activeBoard === "progress" && <ProgressBoard />}
      </div>
    </div>
  );
}
