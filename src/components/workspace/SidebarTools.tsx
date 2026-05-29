"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/vibro/ui";
import type { VibroBoard } from "@/lib/vibro";

type Tool = "select" | "hand" | "shapes" | "frame" | "crop" | "text" | "upload" | "url" | "search" | "moodboard" | "tag" | "group" | "ungroup" | "pin" | "note" | "delete";

const topTools: { id: Tool; icon: string; label: string }[] = [
  { id: "select", icon: "nearby", label: "Select" },
  { id: "hand", icon: "back_hand", label: "Hand" },
  { id: "shapes", icon: "category", label: "Shapes" },
  { id: "frame", icon: "crop_square", label: "Frame" },
  { id: "crop", icon: "crop", label: "Crop" },
  { id: "text", icon: "text_fields", label: "Text" },
  { id: "upload", icon: "cloud_upload", label: "Upload" },
];

const inspirationTools: { id: Tool; icon: string; label: string }[] = [
  { id: "select", icon: "nearby", label: "Select" },
  { id: "upload", icon: "cloud_upload", label: "Upload screenshots" },
  { id: "url", icon: "add_link", label: "Add URL" },
  { id: "search", icon: "travel_explore", label: "Search web" },
  { id: "moodboard", icon: "dashboard_customize", label: "Create moodboard layout" },
  { id: "tag", icon: "sell", label: "Tag inspirations" },
  { id: "group", icon: "join_inner", label: "Group references" },
  { id: "ungroup", icon: "call_split", label: "Ungroup references" },
  { id: "pin", icon: "push_pin", label: "Pin to context" },
  { id: "note", icon: "sticky_note_2", label: "Add note" },
  { id: "delete", icon: "delete", label: "Delete selected cards" },
];

export default function SidebarTools({ activeBoard }: { activeBoard: VibroBoard }) {
  const [active, setActive] = useState<Tool>("select");
  const tools = activeBoard === "inspiration" ? inspirationTools : topTools;
  const isInspiration = activeBoard === "inspiration";

  function chooseTool(tool: Tool) {
    setActive(tool);
    if (isInspiration) {
      window.dispatchEvent(new CustomEvent("vibro:inspiration-tool", { detail: tool }));
    }
  }

  return (
    <aside
      className={`fixed left-0 top-12 z-90 flex h-[calc(100vh-48px)] w-12 select-none flex-col items-center pt-3 ${
        isInspiration
          ? "border-r border-white/40 bg-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur"
          : "border-r border-[#E5E5E5] bg-white"
      }`}
    >
      <div className="flex flex-col items-center gap-0.5">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => chooseTool(tool.id)}
            title={tool.label}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
              active === tool.id
                ? "bg-[#EEF2FF] text-[#6366F1]"
                : "text-[#555] hover:bg-[#F0F0F0]"
            }`}
          >
            <MaterialIcon name={tool.icon} size={18} />
          </button>
        ))}
      </div>

      <div className="w-[28px] h-px bg-[#E5E5E5] my-2" />

      {!isInspiration && <div className="flex flex-col items-center gap-0.5">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#555] hover:bg-[#F0F0F0] transition"
          title="Undo"
        >
          <MaterialIcon name="undo" size={18} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#555] hover:bg-[#F0F0F0] transition"
          title="Redo"
        >
          <MaterialIcon name="redo" size={18} />
        </button>
      </div>}

      <div className="mt-auto mb-4 flex flex-col items-center gap-0.5">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#555] hover:bg-[#F0F0F0] transition"
          title="Pages"
        >
          <MaterialIcon name="description" size={18} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#555] hover:bg-[#F0F0F0] transition"
          title="Layers"
        >
          <MaterialIcon name="layers" size={18} />
        </button>
      </div>
    </aside>
  );
}
