"use client";

import { useUserPresence } from "@/hooks/useLiveblocks";

export function RealtimeCursors() {
  const { others } = useUserPresence();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {others.map((other) => (
        <div
          key={other.connectionId}
          style={{
            position: "absolute",
            left: `${other.presence?.cursor?.x ?? 0}px`,
            top: `${other.presence?.cursor?.y ?? 0}px`,
            pointerEvents: "none",
          }}
          className="flex flex-col gap-1"
        >
          {/* Cursor */}
          <div
            className="w-4 h-6"
            style={{
              backgroundColor: other.presence?.selectedColor || "#000000",
              clipPath:
                "polygon(0 0, 0 100%, 80% 70%, 100% 60%, 100% 0, 80% 10%)",
            }}
          />
          {/* Name label */}
          <div
            className="px-2 py-1 rounded text-xs text-white font-semibold whitespace-nowrap"
            style={{
              backgroundColor: other.presence?.selectedColor || "#000000",
            }}
          >
            {other.info?.name || "Anonymous"}
          </div>
        </div>
      ))}
    </div>
  );
}
