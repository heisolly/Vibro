import { createClient } from "@liveblocks/client";

const publicKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

if (!publicKey) {
  console.error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not defined in environment variables");
}

export const liveblocks = createClient({
  publicApiKey: publicKey!,
  // Throttle client updates for performance (16ms = 60 FPS)
  throttle: 16,
  // Resolve user info for presence UI
  resolveUsers: async ({ userIds }) =>
    userIds.map((id) => ({
      id,
      name: `User ${id}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    })),
});

export type User = {
  id: string;
  name: string;
  avatar: string;
};

// Types for collaborative storage
export type DocumentShape = {
  title: string;
  content: string;
  tags: string[];
};

export type PresenceShape = {
  cursor: { x: number; y: number } | null;
  selectedColor: string;
  isTyping: boolean;
};
