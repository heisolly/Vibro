# Liveblocks Full Setup Guide

## 📦 Installed Packages

- `@liveblocks/client` - Core Liveblocks client
- `@liveblocks/react` - React integration
- `@liveblocks/node` - Server-side functionality
- `@liveblocks/react-comments` - Comments UI (deprecated, use react-ui)
- `@liveblocks/react-ui` - Modern UI components

## 📝 Environment Variables

Your `.env.local` contains:

```
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_tzB5MvPsfUTILNk87iCJueVdpsKfx8mxGAznadOqeWlPBZTxLDMEWK-BKINWuHN5
LIVEBLOCKS_SECRET_KEY=sk_dev_lVeF2u-rIDlePtxzTORYLZ4kMomT1PNqVVNZW52xM-m850hQ3VDBLklTytgR4z8m
```

## 🗂️ Project Structure

```
src/
├── lib/
│   ├── liveblocks.ts           # Client configuration
│   └── liveblocks-server.ts    # Server configuration
├── hooks/
│   └── useLiveblocks.ts        # Custom hooks
├── components/
│   ├── LiveblocksProvider.tsx  # Provider components
│   ├── CollaborativeEditor.tsx # Editor example
│   ├── CollaborativeAvatar.tsx # User avatars
│   ├── RealtimeCursors.tsx     # Cursor tracking
│   └── RoomStatus.tsx          # Room info display
├── app/
│   ├── api/
│   │   └── liveblocks-auth/    # Authorization endpoint
│   └── liveblocks-demo/        # Demo page
```

## 🚀 Key Features Implemented

### 1. **Real-time Collaboration**
- Multiple users can edit the same document simultaneously
- Changes are synchronized in real-time across all connected clients

### 2. **Presence Tracking**
- See which users are currently in the room
- Display user presence indicators and typing status
- Track cursor positions in real-time

### 3. **Persistent Storage**
- Document title, content, and tags stored in Liveblocks
- Automatic synchronization and persistence
- Conflict-free collaborative data types

### 4. **User Management**
- Automatic user identification via authorization endpoint
- User info (name, avatar) managed server-side
- Support for custom user data

### 5. **Room-based Organization**
- Multiple independent rooms for different documents
- Join/leave room functionality
- Connection state management

### 6. **Authorization**
- Server-side authorization endpoint at `/api/liveblocks-auth`
- Room-level access control
- Secure token generation

## 📚 Custom Hooks

### `useDocument()`
Manage collaborative document content:
```typescript
const { title, content, tags, setTitle, setContent, addTag, removeTag } = useDocument();
```

### `useUserPresence()`
Manage user presence and interactions:
```typescript
const { presence, others, updateCursor, setSelectionColor, setIsTyping } = useUserPresence();
```

### `useCurrentRoom()`
Get current room information:
```typescript
const { roomId, connectionState } = useCurrentRoom();
```

## 🎯 Components

### `LiveblocksWrapperProvider`
Top-level provider for Liveblocks functionality. Wrap your app with this.

### `LiveblocksRoomProvider`
Room-specific provider. Use this for features that need a specific room context.

### `CollaborativeEditor`
Full editor component with:
- Document title input
- Content textarea with real-time sync
- Color picker for presence
- Cursor tracking
- Typing status

### `CollaborativeAvatar`
Displays avatars and presence for all connected users.

### `RealtimeCursors`
Shows live cursor positions and names for all users.

### `RoomStatus`
Displays current room ID, connection status, and online user count.

## 🔗 API Endpoints

### POST `/api/liveblocks-auth`
Authorization endpoint for Liveblocks users.

**Headers:**
- `x-user-id` - User ID (optional, auto-generated if not provided)
- `x-user-name` - User display name
- `x-user-avatar` - User avatar URL

**Query Parameters:**
- `room` - Specific room ID (optional, grants access to all rooms if not provided)

## 🧪 Demo Page

Access the full demo at `/liveblocks-demo`

Features demonstrated:
- Real-time collaborative editing
- Live presence indicators
- Cursor tracking
- Room switching
- User status display
- Connection state monitoring

## 🎮 Usage Examples

### Basic Setup
```typescript
import { LiveblocksWrapperProvider, LiveblocksRoomProvider } from "@/components/LiveblocksProvider";

export default function App() {
  return (
    <LiveblocksWrapperProvider>
      <LiveblocksRoomProvider roomId="my-room">
        {/* Your app content */}
      </LiveblocksRoomProvider>
    </LiveblocksWrapperProvider>
  );
}
```

### Using Hooks
```typescript
"use client";
import { useDocument, useUserPresence } from "@/hooks/useLiveblocks";

export function MyComponent() {
  const { title, setTitle, content, setContent } = useDocument();
  const { others, updateCursor, setSelectionColor } = useUserPresence();

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

## 🔐 Security Considerations

1. **Authorization Endpoint**: Validates requests server-side using `LIVEBLOCKS_SECRET_KEY`
2. **Public Key**: Safe to expose in client-side code
3. **Secret Key**: Keep secret and never expose to client
4. **Room Access**: Control via authorization endpoint

## 🌐 Production Deployment

Before deploying to production:

1. Update environment variables in your hosting platform
2. Implement proper user authentication integration
3. Customize authorization logic in `/api/liveblocks-auth`
4. Add proper error handling and logging
5. Test multi-user scenarios thoroughly
6. Configure CORS if needed for API calls

## 📖 Additional Resources

- [Liveblocks Documentation](https://liveblocks.io/docs)
- [React Integration Guide](https://liveblocks.io/docs/products/react)
- [Storage Documentation](https://liveblocks.io/docs/products/storage)
- [Presence Documentation](https://liveblocks.io/docs/products/presence)
- [Comments & Notifications](https://liveblocks.io/docs/products/comments)

## 🚨 Troubleshooting

### Connection Issues
- Verify API keys are correct
- Check network connectivity
- Ensure authorization endpoint is accessible

### Data Not Syncing
- Check browser console for errors
- Verify room IDs match across clients
- Ensure proper provider wrapping

### Performance Issues
- Adjust `throttleDelay` in client configuration
- Optimize storage updates
- Use React.memo for components receiving frequent updates
