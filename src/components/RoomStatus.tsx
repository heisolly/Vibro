"use client";

import { useCurrentRoom, useUserPresence } from "@/hooks/useLiveblocks";

export function RoomStatus() {
  const { roomId, connectionStatus } = useCurrentRoom();
  const { others } = useUserPresence();

  const statusColors: Record<string, string> = {
    connected: "bg-green-500",
    connecting: "bg-yellow-500",
    reconnecting: "bg-orange-500",
    disconnected: "bg-red-500",
    initial: "bg-gray-500",
  };

  const status = connectionStatus || "initial";
  const statusColor = statusColors[status] || "bg-gray-500";

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${statusColor}`} />
        <div>
          <p className="font-semibold text-sm">
            Room: <code className="bg-gray-200 px-2 py-1 rounded">{roomId}</code>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Status: <span className="font-medium capitalize">{status}</span>
          </p>
          <p className="text-xs text-gray-600">
            Users Online: <span className="font-medium">{others.length + 1}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
