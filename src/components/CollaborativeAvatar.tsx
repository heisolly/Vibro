"use client";

import { useUserPresence } from "@/hooks/useLiveblocks";

export function CollaborativeAvatar() {
  const { others } = useUserPresence();

  return (
    <div className="flex gap-2">
      {others.map((other) => (
        <div
          key={other.connectionId}
          className="flex flex-col items-center gap-1"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{
              backgroundColor: other.presence?.selectedColor || "#000000",
            }}
          >
            {other.info?.name?.charAt(0) || "?"}
          </div>
          <span className="text-xs text-gray-600">
            {other.presence?.isTyping ? "typing..." : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
