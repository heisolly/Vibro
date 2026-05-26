"use client";

import { MaterialIcon } from "@/components/vibro/ui";

export default function ContextSnapshot() {
  return (
    <div className="border-t border-border p-3">
      <div className="rounded-xl border border-border bg-secondary/40 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Context Bundle</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            v3
          </span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Frameworks</span>
            <span className="font-medium text-foreground">Next.js, Tailwind</span>
          </div>
          <div className="flex justify-between">
            <span>Endpoints</span>
            <span className="font-medium text-foreground">14</span>
          </div>
          <div className="flex justify-between">
            <span>Design tokens</span>
            <span className="font-medium text-foreground">23</span>
          </div>
          <div className="flex justify-between">
            <span>MCP sync</span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition">
          <MaterialIcon name="undo" size={14} />
          Rollback to v2
        </button>
      </div>
    </div>
  );
}
