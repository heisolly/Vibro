"use client";

import { ReactNode } from "react";
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
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selectedColor: "#000000",
        isTyping: false,
      }}
      initialStorage={{
        title: "",
        content: "",
        tags: [],
      }}
    >
      <ClientSideSuspense fallback={<div>Joining room...</div>}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
