"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/vibro/ui";

type Tool = "select" | "hand" | "shapes" | "frame" | "crop" | "text" | "upload";

const topTools: { id: Tool; icon: string; label: string }[] = [
  { id: "select", icon: "nearby", label: "Select" },
  { id: "hand", icon: "back_hand", label: "Hand" },
  { id: "shapes", icon: "category", label: "Shapes" },
  { id: "frame", icon: "crop_square", label: "Frame" },
  { id: "crop", icon: "crop", label: "Crop" },
  { id: "text", icon: "text_fields", label: "Text" },
  { id: "upload", icon: "cloud_upload", label: "Upload" },
];

export default function SidebarTools() {
  const [active, setActive] = useState<Tool>("select");

  return (
    <aside className="fixed left-0 top-12 w-12 h-[calc(100vh-48px)] bg-white border-r border-[#E5E5E5] z-90 flex flex-col items-center pt-3 select-none">
      <div className="flex flex-col items-center gap-0.5">
        {topTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActive(tool.id)}
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

      <div className="flex flex-col items-center gap-0.5">
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
      </div>

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
