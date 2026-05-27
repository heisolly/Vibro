import { LiveList, LiveObject, LiveMap } from "@liveblocks/client";

declare global {
  interface Liveblocks {
    // Each user's Presence
    Presence: {
      cursor: { x: number; y: number } | null;
      selectedColor: string;
      isTyping: boolean;
    };

    // The Storage tree for the room
    Storage: {
      title: string;
      content: string;
      tags: string[];
      architectureFlow?: {
        nodes: any[];
        edges: any[];
      };
      canvasState?: {
        offset: { x: number; y: number };
        zoom: number;
        annotations: any[];
        inspiration: any[];
        todos: any[];
      };
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
      };
    };

    // Custom events
    RoomEvent: { type: "REACTION"; emoji: string };

    // Custom metadata set on threads
    ThreadMetadata: Record<string, string | number | boolean>;

    // Custom metadata set on comments
    CommentMetadata: Record<string, string | number | boolean>;

    // Custom room info set with resolveRoomsInfo
    RoomInfo: {
      title: string;
      url: string;
    };

    // Custom group info set with resolveGroupsInfo
    GroupInfo: {
      name: string;
      badge: string;
    };
  }
}

// Necessary if you have no imports/exports
export {};