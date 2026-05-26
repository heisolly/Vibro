"use client";

import { MaterialIcon } from "@/components/vibro/ui";

const items = [
  { icon: "auto_awesome", text: "AI generated Design Tokens", sub: "Design System · 2 min ago", color: "text-purple-600" },
  { icon: "account_tree", text: "Architecture map updated", sub: "Architecture · 15 min ago", color: "text-blue-600" },
  { icon: "sync", text: "Repo sync complete — main branch", sub: "GitHub · 1 hr ago", color: "text-green-600" },
  { icon: "warning_amber", text: "Drift detected in color tokens", sub: "Drift Alert · 3 hrs ago", color: "text-amber-600" },
];

export default function ActivityDropdown({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div
      className="absolute top-[44px] z-50 w-[280px] bg-white rounded-[10px] border border-[#E5E5E5] shadow-lg py-3"
      style={{ right: "120px" }}
    >
      <div className="flex items-center justify-between px-4 pb-2 border-b border-[#F5F5F5]">
        <span className="text-[14px] font-bold text-[#333]">Activity</span>
        <button className="text-[12px] text-[#6366F1] hover:underline">Mark all read</button>
      </div>
      <div className="pt-1">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F9F9FB] transition cursor-pointer"
          >
            <span className={`shrink-0 mt-0.5 ${item.color}`}>
              <MaterialIcon name={item.icon} size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[#333] leading-snug">{item.text}</div>
              <div className="text-[11px] text-[#888] mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
