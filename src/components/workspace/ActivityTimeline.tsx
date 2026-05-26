"use client";

import { MaterialIcon } from "@/components/vibro/ui";

const events = [
  { icon: "sync", text: "Repo synced — 3 new commits", time: "5m ago", color: "text-blue-600" },
  { icon: "auto_awesome", text: "AI generated design tokens", time: "12m ago", color: "text-purple-600" },
  { icon: "warning_amber", text: "Architecture drift in api/routes", time: "45m ago", color: "text-amber-600" },
  { icon: "inventory_2", text: "Context bundle v2 created", time: "1h ago", color: "text-emerald-600" },
  { icon: "palette", text: "Inspiration board updated", time: "2h ago", color: "text-rose-600" },
  { icon: "push_pin", text: "Design tokens pinned to board", time: "3h ago", color: "text-sky-600" },
];

export default function ActivityTimeline() {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-3">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        What just happened
      </div>
      <div className="space-y-0">
        {events.map((event, i) => (
          <div key={i} className="flex gap-3 pb-4 relative">
            {i < events.length - 1 && (
              <div className="absolute left-[11px] top-5 bottom-0 w-px bg-border" />
            )}
            <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary ${event.color}`}>
              <MaterialIcon name={event.icon} size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm leading-snug">{event.text}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
