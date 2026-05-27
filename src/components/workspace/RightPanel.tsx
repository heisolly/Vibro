"use client";

import { useMemo, useState } from "react";
import { useOthers } from "@liveblocks/react";
import { MaterialIcon } from "@/components/vibro/ui";
import type { ContextBundle } from "@/lib/github-types";
import ContextSnapshot from "./ContextSnapshot";

type PanelTab = "activity" | "chat" | "context";

const aiSteps = [
  { label: "Reading project intent", status: "done" },
  { label: "Mapping architecture graph", status: "active" },
  { label: "Preparing context bundle", status: "queued" },
];

export default function RightPanel({
  open,
  onToggle,
  bundles,
}: {
  open: boolean;
  onToggle: () => void;
  bundles: ContextBundle[];
}) {
  const [tab, setTab] = useState<PanelTab>("activity");
  const [chatInput, setChatInput] = useState("");
  const others = useOthers();

  const online = useMemo(() => others.map((other) => ({
    id: other.connectionId,
    name: other.info?.name || "Collaborator",
    avatar: other.info?.avatar,
  })), [others]);

  return (
    <aside
      className="fixed right-0 top-12 z-[90] flex h-[calc(100vh-48px)] w-[320px] flex-col border-l border-[#dddddd] bg-white transition-transform duration-300 ease-out"
      style={{ transform: open ? "translateX(0)" : "translateX(320px)" }}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#eeeeee] px-4">
        <div>
          <div className="text-sm font-semibold text-[#111]">Workspace feed</div>
          <div className="text-[11px] text-[#888]">Live context, people, and runs</div>
        </div>
        <button onClick={onToggle} className="grid h-8 w-8 place-items-center rounded-lg text-black transition hover:bg-[#f5f5f5]">
          <MaterialIcon name="close" size={19} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 border-b border-[#eeeeee] p-2">
        {(["activity", "chat", "context"] as PanelTab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`h-8 rounded-lg text-xs font-semibold capitalize transition ${tab === item ? "bg-[#111] text-white" : "text-[#555] hover:bg-[#f5f5f5]"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "activity" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <PresenceSection online={online} />
          <div className="border-t border-[#eeeeee] p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#111]">
                <img src="/light_logo.png" alt="Vibro" className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">Vibro is building</div>
                <div className="text-[11px] text-[#888]">Trigger.dev execution activity</div>
              </div>
            </div>
            <div className="space-y-3">
              {aiSteps.map((step) => (
                <div key={step.label} className="flex items-center gap-3 rounded-xl border border-[#eeeeee] bg-[#fafafa] p-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${step.status === "done" ? "bg-emerald-500" : step.status === "active" ? "animate-pulse bg-blue-500" : "bg-[#cccccc]"}`} />
                  <span className="text-xs font-medium text-[#444]">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
              <div className="h-2 animate-pulse bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-500" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-3/4 rounded-full bg-[#eeeeee]" />
                <div className="h-3 w-1/2 rounded-full bg-[#eeeeee]" />
                <div className="h-3 w-2/3 rounded-full bg-[#eeeeee]" />
              </div>
            </div>
          </div>
          <Timeline />
        </div>
      )}

      {tab === "chat" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <ChatMessage author="Vibro AI" text="I mapped the workspace into architecture, design, inspiration, and progress surfaces." ai />
            <ChatMessage author="Micheal" text="Make the architecture board editable and easy to understand." />
            <ChatMessage author="Vibro AI" text="Done. Nodes can be moved, new services added, and connection mode creates new flows." ai />
          </div>
          <div className="border-t border-[#eeeeee] p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[#dddddd] bg-[#fafafa] px-3 py-2">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Message the team or Vibro..."
                className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#999]"
              />
              <button disabled={!chatInput.trim()} className="grid h-8 w-8 place-items-center rounded-full bg-[#111] text-white disabled:bg-[#dddddd] disabled:text-[#999]">
                <MaterialIcon name="arrow_upward" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "context" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ContextSnapshot bundle={bundles[0]} />
          <div className="p-4">
            <div className="rounded-2xl border border-[#eeeeee] bg-[#fafafa] p-4">
              <div className="text-sm font-semibold">MCP handoff</div>
              <p className="mt-2 text-xs leading-5 text-[#666]">
                Context bundle, architecture map, design tokens, and inspiration tags are staged for external AI tools.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function PresenceSection({ online }: { online: { id: number; name: string; avatar?: string }[] }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-[#777]">Liveblocks presence</span>
        <span className="text-xs text-[#888]">{online.length} online</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {online.length === 0 ? (
          <span className="text-xs text-[#999]">No one else is online right now.</span>
        ) : (
          online.map((user) => (
            <div key={user.id} className="grid h-9 w-9 place-items-center rounded-full bg-[#111] text-xs font-bold text-white" title={user.name}>
              {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" /> : user.name.slice(0, 2).toUpperCase()}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Timeline() {
  const items = [
    ["sync", "Repo context synced", "5m ago"],
    ["auto_awesome", "AI architecture draft updated", "12m ago"],
    ["inventory_2", "Context bundle checkpoint saved", "24m ago"],
  ];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#eeeeee] p-4">
      <div className="mb-3 text-xs font-semibold uppercase text-[#777]">Activity</div>
      <div className="space-y-3">
        {items.map(([icon, text, time]) => (
          <div key={text} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f1f1f1] text-black">
              <MaterialIcon name={icon} size={16} />
            </span>
            <div>
              <div className="text-sm font-medium text-[#333]">{text}</div>
              <div className="text-[11px] text-[#999]">{time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ author, text, ai = false }: { author: string; text: string; ai?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${ai ? "bg-[#111] text-white" : "bg-[#e5e5e5] text-[#555]"}`}>
        {ai ? <img src="/light_logo.png" alt="Vibro" className="h-5 w-5" /> : author.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <div className="text-xs font-semibold text-[#777]">{author}</div>
        <p className={`mt-1 rounded-2xl px-3 py-2 text-sm leading-6 ${ai ? "bg-[#f5f7ff] text-[#333]" : "bg-[#f5f5f5] text-[#333]"}`}>{text}</p>
      </div>
    </div>
  );
}
