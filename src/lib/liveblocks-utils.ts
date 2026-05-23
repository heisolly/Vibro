/**
 * Liveblocks Utilities
 * Helper functions and type-safe wrappers for Liveblocks
 */

import { DocumentShape, PresenceShape } from "@/lib/liveblocks";

/**
 * Generate a unique room ID
 */
export function generateRoomId(prefix: string = "room"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse room ID components
 */
export function parseRoomId(roomId: string) {
  const parts = roomId.split("-");
  return {
    prefix: parts[0],
    timestamp: parts[1],
    random: parts[2],
  };
}

/**
 * Validate room ID format
 */
export function isValidRoomId(roomId: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(roomId) && roomId.length > 0 && roomId.length <= 255;
}

/**
 * Utility for managing collaborative lists
 */
export class CollaborativeList<T> {
  constructor(private liveList: any) {}

  push(item: T): void {
    this.liveList.push(item);
  }

  pop(): T | undefined {
    return this.liveList.pop();
  }

  insert(index: number, item: T): void {
    this.liveList.insert(item, index);
  }

  delete(index: number): void {
    this.liveList.delete(index);
  }

  toArray(): T[] {
    return this.liveList.toArray();
  }

  clear(): void {
    this.liveList.clear();
  }

  map<U>(callback: (item: T, index: number) => U): U[] {
    return this.toArray().map(callback);
  }

  filter(callback: (item: T) => boolean): T[] {
    return this.toArray().filter(callback);
  }
}

/**
 * Utility for managing collaborative maps/objects
 */
export class CollaborativeMap<T extends Record<string, any>> {
  constructor(private liveMap: any) {}

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.liveMap.set(key, value);
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.liveMap.get(key);
  }

  delete<K extends keyof T>(key: K): void {
    this.liveMap.delete(key);
  }

  has<K extends keyof T>(key: K): boolean {
    return this.liveMap.has(key);
  }

  toObject(): T {
    return this.liveMap.toObject();
  }

  keys(): Array<keyof T> {
    return Object.keys(this.toObject()) as Array<keyof T>;
  }

  values(): T[keyof T][] {
    return Object.values(this.toObject());
  }

  entries(): Array<[keyof T, T[keyof T]]> {
    return Object.entries(this.toObject()) as Array<[keyof T, T[keyof T]]>;
  }

  clear(): void {
    this.keys().forEach((key) => this.delete(key));
  }
}

/**
 * Debounce helper for reducing storage updates
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Throttle helper for presence updates
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false;

  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

/**
 * Create a presence object with defaults
 */
export function createPresence(overrides?: Partial<PresenceShape>): PresenceShape {
  return {
    cursor: null,
    selectedColor: "#000000",
    isTyping: false,
    ...overrides,
  };
}

/**
 * Create a document object with defaults
 */
export function createDocument(overrides?: Partial<DocumentShape>): DocumentShape {
  return {
    title: "",
    content: "",
    tags: [],
    ...overrides,
  };
}

/**
 * Safely parse presence data
 */
export function parsePresence(data: unknown): PresenceShape {
  try {
    if (typeof data === "object" && data !== null) {
      return createPresence(data as Partial<PresenceShape>);
    }
  } catch (error) {
    console.error("Error parsing presence:", error);
  }
  return createPresence();
}

/**
 * Format room activity for display
 */
export function formatRoomActivity(
  roomId: string,
  usersOnline: number,
  isConnected: boolean
): string {
  const status = isConnected ? "🟢 Connected" : "🔴 Disconnected";
  return `${status} • ${roomId} • ${usersOnline} user${usersOnline !== 1 ? "s" : ""}`;
}

/**
 * Generate collaborative document URL
 */
export function generateDocumentUrl(roomId: string, baseUrl: string = ""): string {
  const url = baseUrl || typeof window !== "undefined" ? window.location.origin : "";
  return `${url}/document/${roomId}`;
}

/**
 * Validate document state
 */
export function isValidDocumentState(data: unknown): data is DocumentShape {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as any;
  return (
    typeof obj.title === "string" &&
    typeof obj.content === "string" &&
    Array.isArray(obj.tags)
  );
}
