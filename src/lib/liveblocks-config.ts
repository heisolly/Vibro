/**
 * Liveblocks Configuration Presets
 * Common configurations for different use cases
 */

export const ROOM_CONFIG = {
  // Throttle settings (milliseconds)
  PRESENCE_THROTTLE: 16, // ~60fps
  STORAGE_THROTTLE: 100,
  CURSOR_THROTTLE: 50,

  // Connection settings
  RECONNECT_TIMEOUT: 5000,
  MAX_RETRIES: 10,

  // Default colors for users
  COLORS: [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Coral
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky
  ],

  // Default presence
  DEFAULT_PRESENCE: {
    cursor: null,
    selectedColor: "#000000",
    isTyping: false,
  },

  // Default storage
  DEFAULT_STORAGE: {
    title: "",
    content: "",
    tags: [],
  },
};

export const AUTH_CONFIG = {
  // Authorization endpoint
  AUTH_ENDPOINT: "/api/liveblocks-auth",

  // Token expiry (seconds)
  TOKEN_TTL: 60 * 60, // 1 hour

  // Room access levels
  ACCESS_LEVELS: {
    NONE: "none",
    READ: "read",
    WRITE: "write",
    ADMIN: "admin",
  },
};

export const STORAGE_CONFIG = {
  // Auto-save interval (milliseconds)
  AUTO_SAVE_INTERVAL: 5000,

  // Max document size (characters)
  MAX_DOCUMENT_SIZE: 1000000,

  // Max tags per document
  MAX_TAGS: 50,

  // Max tag length
  MAX_TAG_LENGTH: 50,
};

export const PRESENCE_CONFIG = {
  // Show presence indicators after delay (milliseconds)
  SHOW_DELAY: 100,

  // Hide presence after inactivity (milliseconds)
  HIDE_DELAY: 10000,

  // Update cursor position throttle (milliseconds)
  CURSOR_UPDATE_THROTTLE: 50,

  // Typing indicator timeout (milliseconds)
  TYPING_TIMEOUT: 3000,
};

export const UI_CONFIG = {
  // Animation speeds (milliseconds)
  FADE_DURATION: 200,
  SLIDE_DURATION: 300,

  // Tooltip delays
  TOOLTIP_DELAY: 500,

  // Popup z-index
  POPUP_Z_INDEX: 1000,

  // Toast notification duration
  TOAST_DURATION: 3000,
};

/**
 * Room configuration for specific use cases
 */
export const ROOM_PRESETS = {
  // Real-time collaborative document editing
  DOCUMENT: {
    ...ROOM_CONFIG,
    PRESENCE_THROTTLE: 100,
    STORAGE_THROTTLE: 200,
  },

  // Whiteboard/design collaboration
  DESIGN: {
    ...ROOM_CONFIG,
    PRESENCE_THROTTLE: 16, // Smooth cursor tracking
    CURSOR_THROTTLE: 16,
  },

  // Code collaboration
  CODE: {
    ...ROOM_CONFIG,
    PRESENCE_THROTTLE: 50,
    STORAGE_THROTTLE: 100,
    MAX_DOCUMENT_SIZE: 5000000, // 5MB
  },

  // Presentation/slide sharing
  PRESENTATION: {
    ...ROOM_CONFIG,
    PRESENCE_THROTTLE: 200,
    STORAGE_THROTTLE: 500,
  },

  // Lightweight chat/messaging
  CHAT: {
    ...ROOM_CONFIG,
    PRESENCE_THROTTLE: 500,
    STORAGE_THROTTLE: 1000,
  },
};

/**
 * Get room preset by type
 */
export function getRoomPreset(
  type: keyof typeof ROOM_PRESETS = "DOCUMENT"
) {
  return ROOM_PRESETS[type];
}

/**
 * Merge configurations
 */
export function mergeConfig(
  base: typeof ROOM_CONFIG,
  override: Partial<typeof ROOM_CONFIG>
) {
  return { ...base, ...override };
}

/**
 * Validate configuration
 */
export function validateConfig(config: any): boolean {
  try {
    if (!config.PRESENCE_THROTTLE || typeof config.PRESENCE_THROTTLE !== "number") {
      return false;
    }
    if (!config.STORAGE_THROTTLE || typeof config.STORAGE_THROTTLE !== "number") {
      return false;
    }
    if (!Array.isArray(config.COLORS)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
