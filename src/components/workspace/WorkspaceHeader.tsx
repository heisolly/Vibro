"use client";

import { useState } from "react";
import { MaterialIcon, VibroMark } from "@/components/vibro/ui";
import type { VibroBoard, VibroUser } from "@/lib/vibro";
import ActivityDropdown from "./ActivityDropdown";

const boards: { id: VibroBoard; label: string; icon: string }[] = [
  { id: "architecture", label: "Architecture", icon: "account_tree" },
  { id: "design", label: "Design System", icon: "palette" },
  { id: "inspiration", label: "Inspiration", icon: "collections" },
  { id: "progress", label: "Progress", icon: "assignment" },
];

export default function WorkspaceHeader({
  activeBoard,
  onBoardChange,
  user,
  onToggleChat,
  chatOpen,
}: {
  activeBoard: VibroBoard;
  onBoardChange: (board: VibroBoard) => void;
  user: VibroUser | null;
  onToggleChat: () => void;
  chatOpen: boolean;
}) {
  const [activityOpen, setActivityOpen] = useState(false);
  const initials = (user?.name || "VI").slice(0, 2).toUpperCase();

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-12 select-none items-center justify-between border-b border-[#dddddd] bg-white px-3 text-[13px]">
      <div className="flex min-w-0 items-center gap-3">
        <button className="flex h-8 items-center gap-2 rounded-lg border border-[#dddddd] bg-white px-2 transition hover:bg-[#f7f7f7]">
          <VibroMark size={22} />
          <MaterialIcon name="expand_more" size={16} className="text-[#555]" />
        </button>
        <button
          onClick={() => setActivityOpen((open) => !open)}
          className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium text-black transition hover:bg-[#f5f5f5] md:flex"
        >
          <MaterialIcon name="history" size={18} />
          History
        </button>
        <button className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium text-black transition hover:bg-[#f5f5f5] md:flex">
          <MaterialIcon name="grid_view" size={18} />
          Get started
        </button>
        <button className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium text-black transition hover:bg-[#f5f5f5] md:flex">
          <MaterialIcon name="help_outline" size={18} />
          Help
        </button>
        <ActivityDropdown open={activityOpen} />
      </div>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-[#dddddd] bg-[#f7f7f7] p-1">
        {boards.map((board) => {
          const active = board.id === activeBoard;
          return (
            <button
              key={board.id}
              onClick={() => onBoardChange(board.id)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 font-medium transition ${
                active
                  ? "bg-white text-[#111] shadow-sm"
                  : "text-black hover:bg-white/70"
              }`}
              title={board.label}
            >
              <MaterialIcon name={board.icon} size={17} />
              <span className="hidden sm:inline">{board.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden h-8 rounded-lg border border-[#dddddd] bg-white px-3 font-medium transition hover:bg-[#f7f7f7] sm:block">
          33%
        </button>
        <button className="hidden h-8 rounded-lg bg-[#f4f4f4] px-4 font-semibold transition hover:bg-[#ebebeb] sm:block">
          Share
        </button>
        <button className="hidden h-8 items-center gap-1 rounded-l-lg border border-[#7c5cff] bg-white px-3 font-semibold text-[#6b4eff] sm:flex">
          <MaterialIcon name="auto_awesome" size={16} />
          56
        </button>
        <button className="hidden h-8 rounded-r-lg bg-[#7c5cff] px-4 font-semibold text-white transition hover:bg-[#6946ff] sm:block">
          Upgrade
        </button>
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#d9d9d9] bg-[#f4f4f4] text-[11px] font-bold text-[#666]">
          {initials}
        </div>
        <button
          onClick={onToggleChat}
          className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
            chatOpen
              ? "border-[#7c5cff] bg-[#f1edff] text-[#6b4eff]"
              : "border-[#dddddd] bg-white text-[#444] hover:bg-[#f7f7f7]"
          }`}
          title="Toggle context panel"
        >
          <MaterialIcon name="forum" size={20} />
        </button>
      </div>
    </header>
  );
}
