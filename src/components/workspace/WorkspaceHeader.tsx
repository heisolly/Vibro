"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/vibro/ui";
import type { VibroBoard, VibroUser } from "@/lib/vibro";
import ActivityDropdown from "./ActivityDropdown";

const boards: { id: VibroBoard; label: string; icon: string }[] = [
  { id: "design", label: "Design System", icon: "palette" },
  { id: "architecture", label: "Architecture", icon: "account_tree" },
  { id: "inspiration", label: "Inspiration", icon: "collections" },
  { id: "progress", label: "Progress", icon: "assignment" },
];

const avatars = [
  { initials: "MO", color: "#14B8A6" },
  { initials: "TK", color: "#F43F5E" },
  { initials: "SA", color: "#8B5CF6" },
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  const notifications = [
    { text: "Drift Alert: spacing-md changed", dot: "bg-red-500" },
    { text: "AI generation complete", dot: "bg-green-500" },
    { text: "3 new comments on Architecture", dot: "bg-blue-500" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-100 h-12 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-3 select-none">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#6366F1] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">V</span>
        </div>
        <span className="material-symbols-rounded text-[#555] text-[16px]">expand_more</span>
        <span className="text-sm text-[#555] font-medium">Untitled</span>
        <span className="material-symbols-rounded text-[#555] text-[16px]">chevron_right</span>
        <button className="flex items-center gap-1 px-[10px] py-[4px] rounded-[6px] text-[13px] text-[#555] hover:bg-[#F5F5F5] transition">
          <MaterialIcon name="history" size={15} />
          History
        </button>
        <button className="flex items-center gap-1 px-[10px] py-[4px] rounded-[6px] text-[13px] text-[#555] hover:bg-[#F5F5F5] transition">
          <MaterialIcon name="grid_view" size={15} />
          Get started
        </button>
        <button className="flex items-center gap-1 px-[10px] py-[4px] rounded-[6px] text-[13px] text-[#555] hover:bg-[#F5F5F5] transition">
          <MaterialIcon name="help_outline" size={15} />
          Help
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {boards.map((b) => {
          const active = activeBoard === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onBoardChange(b.id)}
              className={`flex items-center gap-1.5 px-[14px] py-[6px] text-[13px] font-medium rounded-[6px] transition ${
                active
                  ? "text-[#6366F1] border-b-2 border-[#6366F1] rounded-none"
                  : "text-[#888] hover:bg-[#F5F5F5] hover:rounded-[6px]"
              }`}
            >
              <MaterialIcon name={b.icon} size={16} />
              {b.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {avatars.map((a, i) => (
            <div
              key={i}
              className="relative w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-white -mr-2"
              style={{ backgroundColor: a.color, zIndex: 10 - i }}
              title={a.initials}
            >
              {a.initials}
              <span className="absolute -bottom-0.5 -right-0.5 w-[6px] h-[6px] rounded-full bg-green-500 border border-white" />
            </div>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-8 h-8 flex items-center justify-center rounded-md text-[#555] hover:bg-[#F5F5F5] transition"
          >
            <MaterialIcon name="notifications" size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-[10px] border border-[#E5E5E5] shadow-lg z-50 py-3">
              {notifications.map((n) => (
                <div key={n.text} className="flex items-center gap-3 px-4 py-2 text-[13px] text-[#333] hover:bg-[#F5F5F5]">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                  {n.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setActivityOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0E0E0] text-[13px] text-[#555] hover:bg-[#F5F5F5] transition"
        >
          <MaterialIcon name="schedule" size={15} />
          Activity
        </button>
        <ActivityDropdown open={activityOpen} />

        <span className="text-[12px] text-[#888]">50%</span>

        <button className="px-[14px] py-[5px] rounded-[20px] border border-[#E0E0E0] text-[13px] text-[#333] hover:bg-[#F5F5F5] transition">
          Share
        </button>

        <button className="flex items-center gap-1 px-[10px] py-[4px] rounded-[6px] bg-[#EEF2FF] text-[#6366F1] text-[13px] font-medium">
          <span className="material-symbols-rounded text-[14px]">diamond</span>
          60
        </button>

        <button className="px-[14px] py-[5px] rounded-[6px] bg-[#6366F1] text-white text-[13px] font-medium hover:bg-[#4F46E5] transition">
          Upgrade
        </button>

        <div className="w-7 h-7 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[11px] font-bold text-[#555]">
          {(user?.name || "VI").slice(0, 2).toUpperCase()}
        </div>

        <button
          onClick={onToggleChat}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
            chatOpen ? "bg-[#EEF2FF] text-[#6366F1]" : "text-[#555] hover:bg-[#F5F5F5]"
          }`}
          title="Toggle chat"
        >
          <MaterialIcon name="chat" size={20} />
        </button>
      </div>
    </header>
  );
}
