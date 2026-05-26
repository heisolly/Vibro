"use client";

import { MaterialIcon } from "@/components/vibro/ui";
import type { ContextBundle } from "@/lib/github-types";

export default function ContextSnapshot({ bundle }: { bundle?: ContextBundle }) {
  if (!bundle) {
    return (
      <div className="border-t border-[#E5E5E5] p-3">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#F9F9FB] p-3 space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#888]">Context Bundle</span>
          <p className="text-xs text-[#AAA]">No bundle yet. Connect a GitHub repo to generate one.</p>
        </div>
      </div>
    );
  }

  const bd = bundle.bundle_data;
  const arch = bd?.architecture;
  const frontendCount = arch?.frontend?.length || 0;
  const backendCount = arch?.backend?.length || 0;
  const totalFrameworks = frontendCount + backendCount + (arch?.database?.length || 0)
    + (arch?.infrastructure?.length || 0) + (arch?.integrations?.length || 0);
  const totalEndpoints = bd?.endpoints?.total || 0;
  const tokenSources = bd?.designSystem?.source?.length || 0;

  return (
    <div className="border-t border-[#E5E5E5] p-3">
      <div className="rounded-xl border border-[#E5E5E5] bg-[#F9F9FB] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#888]">Context Bundle</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            v{bundle.version}
          </span>
        </div>
        <div className="space-y-1 text-xs text-[#888]">
          <div className="flex justify-between">
            <span>Frameworks</span>
            <span className="font-medium text-[#333]">{totalFrameworks} ({frontendCount} frontend, {backendCount} backend)</span>
          </div>
          <div className="flex justify-between">
            <span>Endpoints</span>
            <span className="font-medium text-[#333]">{totalEndpoints}</span>
          </div>
          <div className="flex justify-between">
            <span>Design tokens</span>
            <span className="font-medium text-[#333]">{tokenSources} sources</span>
          </div>
          <div className="flex justify-between">
            <span>Sync</span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Auto-sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
