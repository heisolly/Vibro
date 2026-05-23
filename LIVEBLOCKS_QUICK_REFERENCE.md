# Liveblocks Quick Reference & Usage Guide

## 🎯 Quick Start

### 1. Wrap Your App
```tsx
import { LiveblocksWrapperProvider, LiveblocksRoomProvider } from "@/components/LiveblocksProvider";

export default function App() {
  return (
    <LiveblocksWrapperProvider>
      <LiveblocksRoomProvider roomId="my-first-room">
        <YourApp />
      </LiveblocksRoomProvider>
    </LiveblocksWrapperProvider>
  );
}
```

### 2. Use Hooks in Components
```tsx
"use client";
import { useDocument, useUserPresence } from "@/hooks/useLiveblocks";

export function Editor() {
  const { content, setContent } = useDocument();
  const { others, updateCursor } = useUserPresence();

  return (
    <textarea
      value={content || ""}
      onChange={(e) => setContent(e.target.value)}
      onMouseMove={(e) => updateCursor({ x: e.clientX, y: e.clientY })}
    />
  );
}
```

## 📚 Core Features

### Real-time Document Editing
```tsx
const { title, content, tags, setTitle, setContent, addTag, removeTag } = useDocument();

setTitle("My Document");
setContent("Document content");
addTag("important");
```

### Presence & Cursors
```tsx
const { presence, others, updateCursor, setSelectionColor, setIsTyping } = useUserPresence();

// Track cursor
updateCursor({ x: 100, y: 200 });

// Change color
setSelectionColor("#FF6B6B");

// Typing status
setIsTyping(true);

// See other users
others.forEach((user) => {
  console.log(`${user.info?.name} at ${user.presence?.cursor}`);
});
```

### Room Information
```tsx
const { roomId, connectionState } = useCurrentRoom();
// connectionState: "open" | "connecting" | "reconnecting" | "closed"
```

## 🛠️ Utilities

### Generate Room IDs
```tsx
import { generateRoomId, parseRoomId, isValidRoomId } from "@/lib/liveblocks-utils";

const roomId = generateRoomId("project"); // "project-1234567890-abc123"
const parsed = parseRoomId(roomId);
if (isValidRoomId(roomId)) { /* ok */ }
```

### Debounce & Throttle
```tsx
import { debounce, throttle } from "@/lib/liveblocks-utils";

const debouncedSave = debounce(() => saveToDatabase(), 2000);
const throttledCursorUpdate = throttle((pos) => updateCursor(pos), 50);
```

### Create Default Objects
```tsx
import { createPresence, createDocument, parsePresence } from "@/lib/liveblocks-utils";

const presence = createPresence({ selectedColor: "#FF0000" });
const doc = createDocument({ title: "New Doc" });
```

## 💾 Persistence with Supabase

### Save to Supabase
```tsx
import { saveDocumentToSupabase, loadDocumentFromSupabase } from "@/lib/liveblocks-supabase";

// Save collaborative changes to database
await saveDocumentToSupabase("room-id", "user-id");

// Load document into Liveblocks
const data = await loadDocumentFromSupabase("room-id");
```

### Activity Logging
```tsx
import { logCollaborativeActivity } from "@/lib/liveblocks-supabase";

await logCollaborativeActivity("room-id", "user-123", "edited", {
  field: "title",
  timestamp: Date.now(),
});
```

## ⚙️ Configuration

### Use Presets
```tsx
import { ROOM_PRESETS, getRoomPreset } from "@/lib/liveblocks-config";

// For document editing
const docConfig = getRoomPreset("DOCUMENT");

// For design/whiteboard
const designConfig = getRoomPreset("DESIGN");

// For code collaboration
const codeConfig = getRoomPreset("CODE");
```

### Customize Configuration
```tsx
import { mergeConfig, ROOM_CONFIG } from "@/lib/liveblocks-config";

const customConfig = mergeConfig(ROOM_CONFIG, {
  PRESENCE_THROTTLE: 50,
  COLORS: ["#FF0000", "#00FF00", "#0000FF"],
});
```

## 🎨 Components

### Show Online Users
```tsx
import { CollaborativeAvatar } from "@/components/CollaborativeAvatar";

export default function App() {
  return (
    <div>
      <CollaborativeAvatar />
    </div>
  );
}
```

### Live Cursor Tracking
```tsx
import { RealtimeCursors } from "@/components/RealtimeCursors";

export default function App() {
  return (
    <div>
      <RealtimeCursors />
      {/* Your content */}
    </div>
  );
}
```

### Room Status Display
```tsx
import { RoomStatus } from "@/components/RoomStatus";

export default function App() {
  return (
    <div>
      <RoomStatus />
    </div>
  );
}
```

### Collaborative Editor
```tsx
import { CollaborativeEditor } from "@/components/CollaborativeEditor";

export default function App() {
  return <CollaborativeEditor />;
}
```

## 📡 API Integration

### Authorization Endpoint
```typescript
// POST /api/liveblocks-auth
// Headers:
// - x-user-id: "user-123"
// - x-user-name: "John Doe"
// - x-user-avatar: "https://example.com/avatar.jpg"
// Query:
// - room: "room-id" (optional)
```

### Custom User Data
```tsx
// In your app, send user info in auth requests
fetch("/api/liveblocks-auth", {
  method: "POST",
  headers: {
    "x-user-id": userId,
    "x-user-name": userName,
    "x-user-avatar": userAvatar,
  },
});
```

## 🚀 Advanced Patterns

### Multiple Rooms
```tsx
const [currentRoom, setCurrentRoom] = useState("room-1");

return (
  <LiveblocksRoomProvider roomId={currentRoom}>
    {/* Content */}
  </LiveblocksRoomProvider>
);
```

### Selective Presence Updates
```tsx
const { updateCursor } = useUserPresence();

const handleMouseMove = throttle((e) => {
  updateCursor({ x: e.clientX, y: e.clientY });
}, 50);

return <div onMouseMove={handleMouseMove}>...</div>;
```

### Conditional Rendering Based on Connection
```tsx
const { connectionState } = useCurrentRoom();

return (
  <div>
    {connectionState === "open" && <div>Connected ✓</div>}
    {connectionState === "connecting" && <div>Connecting...</div>}
    {connectionState === "closed" && <div>Disconnected ✗</div>}
  </div>
);
```

### Watch for Changes
```tsx
import { useEffect } from "react";
import { useStorage } from "@liveblocks/react";

export function AutoSaver() {
  const { content } = useStorage();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-save when content changes
      saveToDatabase(content);
    }, 5000);

    return () => clearTimeout(timer);
  }, [content]);

  return null;
}
```

## 🧪 Testing

### Demo Page
Visit `/liveblocks-demo` to see all features in action.

### Test Multi-User Collaboration
1. Open `/liveblocks-demo` in multiple tabs/browsers
2. Edit the document - changes sync in real-time
3. Move cursor - see live cursor positions
4. Change colors - presence updates automatically

## 📊 Performance Tips

1. **Throttle Updates**: Use appropriate throttle delays
   ```tsx
   PRESENCE_THROTTLE: 50,    // For smooth interactions
   STORAGE_THROTTLE: 200,    // For frequent updates
   ```

2. **Memoize Components**: Prevent unnecessary re-renders
   ```tsx
   export const Editor = memo(() => { /* ... */ });
   ```

3. **Optimize Hooks**: Only subscribe to needed data
   ```tsx
   // Good: Get only what you need
   const { content } = useStorage();
   
   // Avoid: Subscribing to everything
   const { content, title, tags, metadata } = useStorage();
   ```

## 🐛 Debugging

### Enable Console Logs
```tsx
// Check Liveblocks client
console.log(liveblocks);

// Monitor connection state
const { connectionState } = useCurrentRoom();
console.log("Connection:", connectionState);

// Track presence updates
const { presence } = useUserPresence();
console.log("Current presence:", presence);
```

### Verify Environment Variables
```bash
echo $NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
echo $LIVEBLOCKS_SECRET_KEY
```

## 📞 Support

- [Liveblocks Docs](https://liveblocks.io/docs)
- [GitHub Issues](https://github.com/liveblocks/liveblocks)
- [Discord Community](https://liveblocks.io/discord)
