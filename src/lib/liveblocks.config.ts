import { LiveList, LiveObject } from "@liveblocks/client";
import type { InspirationAnalysis } from "@/lib/inspiration";

type LiveInspirationItem = LiveObject<{
  id: string;
  type: "image" | "url" | "note" | "web";
  title: string;
  description: string;
  url: string;
  sourceDomain: string;
  thumbnailUrl: string;
  storagePath: string;
  tags: string[];
  tab: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pinned: boolean;
  groupId: string | null;
  votes: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  analysis: InspirationAnalysis | null;
}>;

type LiveInspirationGroup = LiveObject<{
  id: string;
  title: string;
  itemIds: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type LiveInspirationTab = LiveObject<{
  id: string;
  label: string;
  order: number;
}>;

declare global {
  interface Liveblocks {
    // Each user's Presence
    Presence: {
      cursor: { x: number; y: number } | null;
      selectedColor: string;
      isTyping: boolean;
      selectedInspirationItemIds: string[];
      activeInspirationTool: string;
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
      inspirationItems: LiveList<LiveInspirationItem>;
      inspirationGroups: LiveList<LiveInspirationGroup>;
      inspirationTabs: LiveList<LiveInspirationTab>;
      activeInspirationTab: string;
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
    ThreadMetadata: {
      cardId?: string;
      boardTab?: string;
      workspaceSlug?: string;
      board?: string;
      x?: number;
      y?: number;
      resolved?: boolean;
    };

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
