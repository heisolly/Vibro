import { useCallback } from "react";
import {
  useStorage,
  useMyPresence,
  useOthers,
  useRoom,
  useMutation,
} from "@liveblocks/react";

/**
 * Hook to manage document content and collaboration
 */
export function useDocument() {
  // Use selectors to get individual storage values
  const title = useStorage((root) => root.title);
  const content = useStorage((root) => root.content);
  const tags = useStorage((root) => root.tags);
  const room = useRoom();

  // Use mutations to update storage
  const setTitle = useMutation(({ storage }, newTitle: string) => {
    // @ts-ignore - storage.get returns LiveObject but type says string
    storage.get("title").set(newTitle);
  }, []);

  const setContent = useMutation(({ storage }, newContent: string) => {
    // @ts-ignore - storage.get returns LiveObject but type says string
    storage.get("content").set(newContent);
  }, []);

  const addTag = useMutation(({ storage }, tag: string) => {
    // @ts-ignore - storage.get returns LiveList but type says string[]
    storage.get("tags").push(tag);
  }, []);

  const removeTag = useMutation(({ storage }, index: number) => {
    // @ts-ignore - storage.get returns LiveList but type says string[]
    storage.get("tags").delete(index);
  }, []);

  return {
    title,
    content,
    tags,
    setTitle,
    setContent,
    addTag,
    removeTag,
  };
}

/**
 * Hook to manage user presence (cursor, selection, etc.)
 */
export function useUserPresence() {
  const [presence, updatePresence] = useMyPresence();
  const others = useOthers();
  const room = useRoom();

  const updateCursor = useCallback(
    (cursor: { x: number; y: number } | null) => {
      updatePresence({ cursor });
    },
    [updatePresence]
  );

  const setSelectionColor = useCallback(
    (color: string) => {
      updatePresence({ selectedColor: color });
    },
    [updatePresence]
  );

  const setIsTyping = useCallback(
    (isTyping: boolean) => {
      updatePresence({ isTyping });
    },
    [updatePresence]
  );

  return {
    presence,
    others, // useOthers() already returns an array
    updateCursor,
    setSelectionColor,
    setIsTyping,
    roomId: room.id,
  };
}

/**
 * Hook to get current room info
 */
export function useCurrentRoom() {
  const room = useRoom();

  return {
    roomId: room.id,
    // Use getStatus() instead of connectionState
    connectionStatus: room.getStatus(),
  };
}
