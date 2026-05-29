"use client";

import type { VibroBoard } from "@/lib/vibro";
import type { VibroProject, VibroUser } from "@/lib/vibro";
import type { ContextBundle } from "@/lib/github-types";
import { MaterialIcon } from "@/components/vibro/ui";
import InspirationBoard from "./InspirationBoard";

function DesignBoard({ bundle }: { bundle?: ContextBundle }) {
  const ds = bundle?.bundle_data?.designSystem;

  if (!ds) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#888]">
        No design tokens extracted yet. Connect a GitHub repo to populate this board.
      </div>
    );
  }

  const sections: { label: string; data: Record<string, string> | undefined }[] = [
    { label: "Colors", data: ds.colors },
    { label: "Typography", data: ds.typography },
    { label: "Spacing", data: ds.spacing },
    { label: "Border Radius", data: ds.borderRadius },
    { label: "Shadows", data: ds.shadows },
  ];

  const hasData = sections.some((s) => s.data && Object.keys(s.data).length > 0);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 text-[#6366F1] shadow-sm border border-[#E5E5E5]">
          <MaterialIcon name="palette" size={22} />
        </span>
        <h2 className="font-display text-xl text-[#333]">Design System</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sections.map((section) => {
          if (!section.data || Object.keys(section.data).length === 0) return null;
          const isColors = section.label === "Colors";
          return (
            <div key={section.label} className="rounded-xl bg-white/80 border border-[#E5E5E5] p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">{section.label}</span>
              <div className={`mt-3 ${isColors ? "flex flex-wrap gap-2" : "space-y-2"}`}>
                {Object.entries(section.data).map(([name, value]) => (
                  isColors ? (
                    <div key={name} className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1.5 text-xs text-[#555] shadow-sm">
                      <span className="h-4 w-4 shrink-0 rounded-full border border-[#E0E0E0]" style={{ backgroundColor: value }} />
                      <span>{name}</span>
                    </div>
                  ) : (
                    <div key={name} className="flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-xs">
                      <span className="font-medium text-[#555]">{name}</span>
                      <span className="text-[#888]">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!hasData && (
        <div className="flex flex-1 items-center justify-center text-sm text-[#888]">
          No design tokens extracted yet. Connect a GitHub repo to populate this board.
        </div>
      )}
    </div>
  );
}

function ArchitectureBoard({ bundle }: { bundle?: ContextBundle }) {
  const arch = bundle?.bundle_data?.architecture;

  if (!arch) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#888]">
        No architecture data yet. Connect a GitHub repo to populate this board.
      </div>
    );
  }

  const sections: { label: string; icon: string; color: string; items: string[] }[] = [
    { label: "Frontend", icon: "web", color: "#6366F1", items: arch.frontend },
    { label: "Backend", icon: "dns", color: "#14B8A6", items: arch.backend },
    { label: "APIs", icon: "api", color: "#F43F5E", items: arch.apis },
    { label: "Database", icon: "storage", color: "#8B5CF6", items: arch.database },
    { label: "Infrastructure", icon: "cloud", color: "#F59E0B", items: arch.infrastructure },
    { label: "Integrations", icon: "extension", color: "#10B981", items: arch.integrations },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 text-[#6366F1] shadow-sm border border-[#E5E5E5]">
          <MaterialIcon name="account_tree" size={22} />
        </span>
        <h2 className="font-display text-xl text-[#333]">Architecture</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sections.map((section) => (
          <div key={section.label} className="rounded-xl bg-white/80 border border-[#E5E5E5] p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg text-white text-xs" style={{ backgroundColor: section.color }}>
                <MaterialIcon name={section.icon} size={16} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">{section.label}</span>
              <span className="ml-auto text-[11px] text-[#AAA]">{section.items.length}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {section.items.length > 0 ? section.items.map((item) => (
                <div key={item} className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-xs font-medium text-[#555] shadow-sm">
                  {item}
                </div>
              )) : (
                <div className="text-xs text-[#CCC] italic">None detected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBoard({ bundle }: { bundle?: ContextBundle }) {
  const decisions = bundle?.bundle_data?.decisionLog;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 text-[#6366F1] shadow-sm border border-[#E5E5E5]">
          <MaterialIcon name="assignment" size={22} />
        </span>
        <h2 className="font-display text-xl text-[#333]">Progress</h2>
      </div>

      {decisions && decisions.length > 0 && (
        <div className="rounded-xl bg-white/80 border border-[#E5E5E5] p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">Architectural Decisions</span>
          <div className="mt-3 space-y-2">
            {decisions.map((d, i) => (
              <div key={i} className="rounded-lg border border-[#E5E5E5] bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#6366F1]">{d.category}</span>
                  <span className="text-xs font-medium text-[#333]">{d.decision}</span>
                </div>
                <p className="mt-1.5 text-xs text-[#666]">{d.rationale}</p>
                <span className="mt-1 block text-[10px] text-[#AAA]">{d.file}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!decisions || decisions.length === 0) && (
        <div className="flex flex-1 items-center justify-center text-sm text-[#888]">
          No decisions recorded yet. Connect a GitHub repo to populate this board.
        </div>
      )}
    </div>
  );
}

export default function BoardCanvas({
  activeBoard,
  bundles,
  slug,
  project,
  user,
}: {
  activeBoard: VibroBoard;
  bundles: ContextBundle[];
  slug: string;
  project: VibroProject | null;
  user: VibroUser | null;
}) {
  const bundle = bundles[0];

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
        {activeBoard === "design" && <DesignBoard bundle={bundle} />}
        {activeBoard === "architecture" && <ArchitectureBoard bundle={bundle} />}
        {activeBoard === "inspiration" && <InspirationBoard slug={slug} project={project} user={user} />}
        {activeBoard === "progress" && <ProgressBoard bundle={bundle} />}
      </div>
    </div>
  );
}
