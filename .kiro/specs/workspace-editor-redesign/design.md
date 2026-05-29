# Design Document — Workspace Editor Redesign

## Overview

This redesign shifts the Vibro workspace editor to a **canvas-first** interaction model. The primary changes are:

1. Remove `FloatingChat` entirely — AI responses move inline onto `BoardCanvas` via a new `InlineAIResponse` component.
2. Lift `activeTool` state from `SidebarTools` up to `WorkspaceEditor` so `BoardCanvas` can respond to tool changes.
3. Replace all hardcoded mock data in `RightPanel` and `WorkspaceHeader` with live Liveblocks Presence and Threads hooks.
4. Wrap the workspace layout in a `LiveblocksRoomProvider` keyed to the workspace `slug`.

The stack is Next.js 15 App Router, TypeScript, Tailwind CSS, and Liveblocks (`@liveblocks/react`, `@liveblocks/react-ui`, `@liveblocks/client`).

---

## Architecture

### Component Tree (after redesign)

```
WorkspacePage (app/workspace/[slug]/page.tsx)
└── LiveblocksRoomProvider (roomId = slug)
    └── WorkspaceEditor
        ├── WorkspaceHeader          ← useOthers for live avatars
        ├── SidebarTools             ← activeTool + onToolChange props (no internal state)
        ├── [canvas area div]
        │   ├── BoardCanvas          ← activeTool prop, InlineAIResponse inside
        │   │   └── InlineAIResponse ← new component, rendered inside canvas bounds
        │   └── AIInputBar           ← sole AI input surface
        └── RightPanel               ← useOthers + useThreads + useCreateThread
```

### State ownership

| State | Owner | Passed to |
|---|---|---|
| `activeBoard` | `WorkspaceEditor` | `WorkspaceHeader`, `BoardCanvas` |
| `rightOpen` | `WorkspaceEditor` | `WorkspaceHeader`, `RightPanel`, `AIInputBar` |
| `activeTool` | `WorkspaceEditor` | `SidebarTools`, `BoardCanvas` |
| `messages` | `WorkspacePage` (via props) | `BoardCanvas` → `InlineAIResponse` |
| `isThinking` | `WorkspacePage` (via props) | `BoardCanvas` → `InlineAIResponse` |
| canvas history (undo/redo) | `BoardCanvas` (internal `useReducer`) | — |
| `inlineVisible` | `BoardCanvas` (internal) | `InlineAIResponse` |

---

## Components and Interfaces

### WorkspaceEditor

```typescript
// Removes: chatOpen, setChatOpen, FloatingChat import
// Adds: activeTool state, passes it to SidebarTools and BoardCanvas

type ActiveTool = "select" | "hand" | "shapes" | "frame" | "crop" | "text" | "upload";

interface WorkspaceEditorProps {
  slug: string;
  user: VibroUser | null;
  messages: Message[];
  isThinking: boolean;
  onSendToAI: (text: string) => void;
  bundles: ContextBundle[];
}

// Internal state
const [activeBoard, setActiveBoard] = useState<VibroBoard>("architecture");
const [rightOpen, setRightOpen] = useState(true);
const [activeTool, setActiveTool] = useState<ActiveTool>("select");
```

`WorkspaceEditor` no longer imports or renders `FloatingChat`. The `handleSend` callback calls `onSendToAI` directly without toggling any overlay.

### SidebarTools

```typescript
// Before: internal useState<Tool>
// After: controlled via props

interface SidebarToolsProps {
  activeTool: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
}
```

The component removes its internal `useState` and reads `activeTool` from props. `onToolChange` is called on button click.

### BoardCanvas

```typescript
interface BoardCanvasProps {
  activeBoard: VibroBoard;
  bundles: ContextBundle[];
  activeTool: ActiveTool;
  messages: Message[];
  isThinking: boolean;
}
```

`BoardCanvas` manages:
- A `canvasOffset` state `{ x: number; y: number }` for pan mode.
- A `textAnnotations` state `TextAnnotation[]` for text-insertion mode.
- A `history` reducer for undo/redo.
- An `inlineVisible` boolean (defaults `true` when messages become non-empty, set to `false` on dismiss).

Pointer event handlers are selected based on `activeTool`:
- `hand` → `onPointerDown/Move/Up` translate `canvasOffset`.
- `select` → standard element selection (no-op in current boards, extensible).
- `text` → `onClick` creates a `TextAnnotation` at the click coordinates.

### InlineAIResponse (new component)

```typescript
interface InlineAIResponseProps {
  messages: Message[];
  isThinking: boolean;
  onDismiss: () => void;
}
```

Rendered inside `BoardCanvas` as an absolutely-positioned panel in the bottom-left of the canvas area. It is only mounted when `inlineVisible && (messages.length > 0 || isThinking)`.

```typescript
// Placement within BoardCanvas
{inlineVisible && (messages.length > 0 || isThinking) && (
  <InlineAIResponse
    messages={messages}
    isThinking={isThinking}
    onDismiss={() => setInlineVisible(false)}
  />
)}
```

Dismiss sets `inlineVisible` to `false` locally — it does not mutate `messages` in `WorkspacePage`.

### RightPanel

```typescript
// Removes: hardcoded messages, threadLabels, avatars arrays
// Adds: useOthers, useThreads, useCreateThread

import { useOthers, useThreads, useCreateThread } from "@liveblocks/react";
import { Thread } from "@liveblocks/react-ui";
```

```typescript
interface RightPanelProps {
  open: boolean;
  onToggle: () => void;
  bundles: ContextBundle[];
}
```

Internal logic:

```typescript
const others = useOthers();
const { threads, isLoading, error } = useThreads();
const createThread = useCreateThread();

function handleSend() {
  if (!chatInput.trim()) return;
  createThread({
    body: { version: 1, content: [{ type: "paragraph", children: [{ text: chatInput }] }] },
  });
  setChatInput("");
}
```

Presence section renders `others.map(...)` — one `PresenceAvatar` per entry. Online count is `others.length`. Empty state shown when `others.length === 0`.

Thread section renders `threads.map(thread => <Thread key={thread.id} thread={thread} />)`. Loading state shown while `isLoading`. Empty state shown when `!isLoading && threads.length === 0`. Error state shown when `error` is truthy.

### WorkspaceHeader

```typescript
// Removes: hardcoded avatars array
// Adds: useOthers hook

import { useOthers } from "@liveblocks/react";
```

```typescript
const others = useOthers();
// Render others.map(...) for live avatars
// Render current user avatar from user prop when others is empty
```

### LiveblocksRoomProvider placement

The `LiveblocksRoomProvider` (already defined in `src/components/LiveblocksProvider.tsx`) is added in `WorkspacePage` wrapping `WorkspaceEditor`:

```typescript
// app/workspace/[slug]/page.tsx
return (
  <LiveblocksRoomProvider roomId={slug}>
    <WorkspaceEditor
      slug={slug}
      user={user}
      messages={messages}
      isThinking={isThinking}
      onSendToAI={sendMessage}
      bundles={bundles}
    />
  </LiveblocksRoomProvider>
);
```

The `LiveblocksWrapperProvider` (which wraps the whole app) already provides the `LiveblocksProvider` context with `authEndpoint` and `resolveUsers`. `LiveblocksRoomProvider` only adds the `RoomProvider` layer.

---

## Data Models

### Message (unchanged)

```typescript
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
```

### ActiveTool

```typescript
type ActiveTool = "select" | "hand" | "shapes" | "frame" | "crop" | "text" | "upload";
```

### TextAnnotation (new, internal to BoardCanvas)

```typescript
type TextAnnotation = {
  id: string;
  x: number;
  y: number;
  text: string;
};
```

### CanvasState (internal to BoardCanvas)

```typescript
type CanvasState = {
  offset: { x: number; y: number };
  annotations: TextAnnotation[];
};

type CanvasAction =
  | { type: "PAN"; dx: number; dy: number }
  | { type: "ADD_ANNOTATION"; annotation: TextAnnotation }
  | { type: "UNDO" }
  | { type: "REDO" };
```

Undo/redo is implemented with a history stack:

```typescript
type HistoryState = {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
};
```

---

## Undo / Redo Implementation

`BoardCanvas` uses a `useReducer` with `HistoryState`. Every mutating action (`PAN`, `ADD_ANNOTATION`) pushes the current `present` onto `past` and clears `future`. `UNDO` pops from `past` and pushes `present` onto `future`. `REDO` pops from `future` and pushes `present` onto `past`.

```typescript
function historyReducer(state: HistoryState, action: CanvasAction): HistoryState {
  switch (action.type) {
    case "PAN": {
      const next = { ...state.present, offset: { x: state.present.offset.x + action.dx, y: state.present.offset.y + action.dy } };
      return { past: [...state.past, state.present], present: next, future: [] };
    }
    case "ADD_ANNOTATION": {
      const next = { ...state.present, annotations: [...state.present.annotations, action.annotation] };
      return { past: [...state.past, state.present], present: next, future: [] };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return { past: [...state.past, state.present], present: next, future: state.future.slice(1) };
    }
    default:
      return state;
  }
}
```

---

## InlineAIResponse UI Design

The panel is positioned `absolute bottom-6 left-6` within the canvas container, with a max-width of `420px` and max-height of `min(480px, 60vh)`. It uses the same visual language as the removed `FloatingChat`:

- Header: "Vibro AI" label + thinking badge + dismiss (`×`) button.
- Body: scrollable message list, user messages right-aligned with dark background, assistant messages left-aligned with light border.
- Loading dots shown when `isThinking && messages[messages.length-1]?.role === "assistant" && !messages[messages.length-1]?.content`.
- No input field — `AIInputBar` at the bottom of the canvas area is the sole input surface.

---

## Error Handling

| Scenario | Handling |
|---|---|
| Liveblocks room connection failure | `RightPanel` catches via `error` from `useThreads`; renders `<div>Could not connect to room. Retrying…</div>` |
| `useOthers` returns empty | `RightPanel` shows "No one else is online right now." label; `WorkspaceHeader` shows only current user avatar |
| `useThreads` loading | `RightPanel` shows a spinner in place of thread list |
| `useThreads` empty | `RightPanel` shows "No threads yet. Start the conversation." |
| `createThread` failure | Caught in `handleSend`, shows inline error toast (non-blocking) |
| Canvas undo with empty history | `historyReducer` returns state unchanged (no-op) |
| Canvas redo with empty future | `historyReducer` returns state unchanged (no-op) |

---

## Files Changed

| File | Change |
|---|---|
| `src/app/workspace/[slug]/page.tsx` | Wrap `WorkspaceEditor` in `LiveblocksRoomProvider` |
| `src/components/workspace/WorkspaceEditor.tsx` | Remove `FloatingChat`, `chatOpen` state; add `activeTool` state; pass new props |
| `src/components/workspace/FloatingChat.tsx` | **Delete** |
| `src/components/workspace/SidebarTools.tsx` | Remove internal `useState`; accept `activeTool` + `onToolChange` props |
| `src/components/workspace/BoardCanvas.tsx` | Accept `activeTool`, `messages`, `isThinking`; add pan/select/text modes; add undo/redo; render `InlineAIResponse` |
| `src/components/workspace/InlineAIResponse.tsx` | **Create** — new component |
| `src/components/workspace/RightPanel.tsx` | Replace mock data with `useOthers`, `useThreads`, `useCreateThread` |
| `src/components/workspace/WorkspaceHeader.tsx` | Replace hardcoded `avatars` with `useOthers` |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: AIInputBar prompt forwarding

*For any* non-empty prompt string submitted via `AIInputBar`, the `onSendToAI` handler SHALL be called with that exact string, and no floating overlay component SHALL become visible as a result.

**Validates: Requirements 1.4**

---

### Property 2: InlineAIResponse rendered for any assistant message

*For any* `messages` array containing at least one message with `role === "assistant"`, `BoardCanvas` SHALL render the `InlineAIResponse` panel within the canvas bounds.

**Validates: Requirements 2.1**

---

### Property 3: InlineAIResponse displays all messages in order with visual distinction

*For any* `messages` array, the `InlineAIResponse` panel SHALL render every message in the array in chronological order, and each user message SHALL be visually distinguishable from each assistant message (e.g., different background color or alignment).

**Validates: Requirements 2.2**

---

### Property 4: Dismiss hides panel without mutating messages

*For any* non-empty `messages` array, after the user dismisses the `InlineAIResponse` panel, the panel SHALL no longer be visible, and the `messages` array in `WorkspaceEditor` SHALL remain unchanged (same length and same content).

**Validates: Requirements 2.4**

---

### Property 5: RightPanel presence avatars match useOthers output

*For any* array of users returned by `useOthers`, `RightPanel` SHALL render exactly that many `PresenceAvatar` elements, each displaying the corresponding user's `userInfo.name` and `userInfo.avatar`, and the online count label SHALL equal the length of that array.

**Validates: Requirements 4.2, 4.3**

---

### Property 6: RightPanel threads match useThreads output

*For any* array of threads returned by `useThreads`, `RightPanel` SHALL render exactly that many thread entries in chronological order, with no additional hardcoded entries.

**Validates: Requirements 5.2**

---

### Property 7: Thread creation from any non-empty message

*For any* non-empty string submitted via the `RightPanel` chat input, `useCreateThread` SHALL be called with a body containing that exact string as its text content.

**Validates: Requirements 5.4**

---

### Property 8: activeTool drives BoardCanvas interaction mode

*For any* value of `activeTool` in the set `{ "select", "hand", "text" }`, `BoardCanvas` SHALL apply the corresponding interaction mode: `hand` enables pan-on-drag, `select` enables element selection, `text` enables annotation creation on click.

**Validates: Requirements 7.1, 7.2, 7.3, 7.6**

---

### Property 9: Undo reverts any canvas mutation

*For any* sequence of canvas mutations (pan offsets or text annotations), applying undo SHALL revert the canvas state to the state immediately before the most recent mutation.

**Validates: Requirements 7.7**

---

### Property 10: Undo then redo is identity

*For any* canvas state S and any single mutation M, applying M then undo then redo SHALL produce a canvas state equal to the state after applying M to S (i.e., undo followed by redo is a round-trip identity).

**Validates: Requirements 7.8**

---

### Property 11: WorkspaceHeader avatars match useOthers output

*For any* array of users returned by `useOthers`, `WorkspaceHeader` SHALL render exactly that many live avatars derived from `userInfo`, with no hardcoded avatar entries rendered alongside them.

**Validates: Requirements 8.1**

---

## Testing Strategy

### Unit / Example Tests

- Render `WorkspaceEditor` and assert `FloatingChat` is absent and `AIInputBar` is present.
- Render `BoardCanvas` with `isThinking=true` and a non-empty `messages` array; assert the loading indicator is visible inside `InlineAIResponse`.
- Render `BoardCanvas` with `messages=[]` and `isThinking=false`; assert `InlineAIResponse` is not rendered.
- Render `RightPanel` with `useThreads` mocked to a loading state; assert a loading spinner is shown.
- Render `RightPanel` with a Liveblocks connection error; assert an error message is shown and no crash occurs.
- Render `BoardCanvas` with `activeTool="hand"` and simulate a pointer drag; assert `canvasOffset` changes.
- Render `BoardCanvas` with `activeTool="text"` and simulate a click; assert a `TextAnnotation` is created at the click coordinates.

### Property-Based Tests

Each property in the Correctness Properties section maps to a property-based test using a generator library (e.g., `fast-check`). Minimum 100 iterations per test.

| Property | Generator inputs | Assertion |
|---|---|---|
| P1 — AIInputBar forwarding | Arbitrary non-empty strings | `onSendToAI` called with exact string; no overlay visible |
| P2 — InlineAIResponse rendered | Arbitrary message arrays with ≥1 assistant message | `InlineAIResponse` present in DOM |
| P3 — Messages in order with distinction | Arbitrary message arrays | All messages rendered in order; user/assistant visually distinct |
| P4 — Dismiss preserves messages | Arbitrary non-empty message arrays | Panel hidden after dismiss; messages array unchanged |
| P5 — Presence avatars match useOthers | Arbitrary user arrays (0–20 users) | Avatar count = user count; online label = user count |
| P6 — Threads match useThreads | Arbitrary thread arrays | Thread count rendered = thread count returned |
| P7 — Thread creation from any message | Arbitrary non-empty strings | `useCreateThread` called with correct body content |
| P8 — activeTool drives interaction mode | Each value in `{ "select", "hand", "text" }` | Correct mode applied per tool |
| P9 — Undo reverts mutation | Arbitrary sequences of pan/annotation mutations | State after undo = state before last mutation |
| P10 — Undo then redo is identity | Arbitrary single mutations | State after undo+redo = state after mutation |
| P11 — Header avatars match useOthers | Arbitrary user arrays (0–10 users) | Avatar count = user count; no hardcoded entries |

### Integration Tests

- `RightPanel` with a real (or emulated) Liveblocks room: verify `useOthers` returns connected users and `useThreads` returns persisted threads.
- `LiveblocksRoomProvider` with `roomId=slug`: verify the room is joined and presence hooks are available to child components.
