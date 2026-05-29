"use client";

import { ReactNode } from "react";
import { LiveList } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";


export function LiveblocksWrapperProvider({
  children,
}: {
  children: ReactNode;
}) {
  const liveblocksConfigured = Boolean(process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY);

  if (!liveblocksConfigured) {
    return <>{children}</>;
  }

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
      resolveUsers={({ userIds }) =>
        userIds.map((id) => ({
          id,
          name: `User ${id}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
        }))
      }
    >
      <ClientSideSuspense fallback={<div>Loading Liveblocks...</div>}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
}

export function LiveblocksRoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  const liveblocksConfigured = Boolean(process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY);

  if (!liveblocksConfigured) {
    return <>{children}</>;
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selectedColor: "#000000",
        isTyping: false,
        selectedInspirationItemIds: [],
        activeInspirationTool: "select",
      }}
      initialStorage={{
        title: "",
        content: "",
        tags: [],
        inspirationItems: new LiveList([]),
        inspirationGroups: new LiveList([]),
        inspirationTabs: new LiveList([]),
        activeInspirationTab: "landing",
      }}
    >
      <ClientSideSuspense fallback={<div>Joining room...</div>}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
