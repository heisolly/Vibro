# Implementation Plan: Workspace Editor Redesign

## Overview

Shift the Vibro workspace editor to a canvas-first interaction model. The plan proceeds in dependency order: remove dead code first, lift shared state, build the new `InlineAIResponse` component, wire `BoardCanvas` to the new props and interaction modes, connect `RightPanel` and `WorkspaceHeader` to live Liveblocks hooks, and finally add the `LiveblocksRoomProvider` to the workspace page.

---

## Tasks

- [x] 1. Remove FloatingChat and clean up WorkspaceEditor
  - [x] 1.1 Delete `FloatingChat.tsx` and remove all references from `WorkspaceEditor`
    - Delete `src/components/workspace/FloatingChat.tsx`
    - Remove the `import FloatingChat` statement from `WorkspaceEditor.tsx`
    - Remove the `<FloatingChat …/>` JSX element
    - Remove the `chatOpen` / `setChatOpen` state variable and all references to it
    - Remove the "Open AI Chat" button that toggled `FloatingChat`
    - Update `handleSend` to call `onSendToAI` directly without toggling any overlay
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1_

  - [x] 1.2 Lift `activeTool` state into `WorkspaceEditor` and make `SidebarTools` controlled
    - Add `activeTool` state (`useState<ActiveTool>("select")`) to `WorkspaceEditor`
    - Pass `activeTool` and `onToolChange={setActiveTool}` to `SidebarTools`
    - Pass `activeTool` to `BoardCanvas` (prop wiring only — full implementation in task 3)
    - Update `SidebarTools` to accept `activeTool: ActiveTool` and `onToolChange: (tool: ActiveTool) => void` props
    - Remove the internal `useState<Tool>` from `SidebarTools`
    - _Requirements: 7.4, 7.5, 3.2_

- [x] 2. Create `InlineAIResponse` component
  - [x] 2.1 Implement `InlineAIResponse.tsx`
    - Create `src/components/workspace/InlineAIResponse.tsx`
    - Accept props: `messages: Message[]`, `isThinking: boolean`, `onDismiss: () => void`
    - Position absolutely at `bottom-6 left-6`, max-width `420px`, max-height `min(480px, 60vh)`
    - Render a header with "Vibro AI" label and a dismiss (`×`) button that calls `onDismiss`
    - Render a scrollable message list in chronological order; user messages right-aligned with dark background, assistant messages left-aligned with light border
    - Show a loading dots indicator when `isThinking` is `true` and the last message has no content
    - No input field — `AIInputBar` is the sole input surface
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ]* 2.2 Write property test for `InlineAIResponse` message rendering (Property 3)
    - **Property 3: InlineAIResponse displays all messages in order with visual distinction**
    - **Validates: Requirements 2.2**
    - Use `fast-check` to generate arbitrary `Message[]` arrays
    - Assert every message is rendered in chronological order
    - Assert user messages and assistant messages are visually distinguishable (different class or data attribute)

  - [ ]* 2.3 Write property test for dismiss behaviour (Property 4)
    - **Property 4: Dismiss hides panel without mutating messages**
    - **Validates: Requirements 2.4**
    - Generate arbitrary non-empty `Message[]` arrays
    - Render `InlineAIResponse`, click dismiss, assert panel is no longer visible
    - Assert the `messages` array reference passed in is unchanged after dismiss

- [ ] 3. Update `BoardCanvas` with new props, interaction modes, and undo/redo
  - [x] 3.1 Add new props and internal state to `BoardCanvas`
    - Extend `BoardCanvasProps` to include `activeTool: ActiveTool`, `messages: Message[]`, `isThinking: boolean`
    - Add `inlineVisible` boolean state (defaults `true` when messages become non-empty)
    - Add `canvasOffset` state `{ x: number; y: number }` for pan mode
    - Add `textAnnotations` state `TextAnnotation[]` for text-insertion mode
    - Define `TextAnnotation` type: `{ id: string; x: number; y: number; text: string }`
    - _Requirements: 7.6, 2.1, 2.5_

  - [x] 3.2 Implement undo/redo with `useReducer`
    - Define `CanvasState`, `CanvasAction`, and `HistoryState` types as specified in the design
    - Implement `historyReducer` handling `PAN`, `ADD_ANNOTATION`, `UNDO`, `REDO` actions
    - Initialise `useReducer` with `historyReducer` and an empty initial `HistoryState`
    - Wire the undo/redo buttons in `SidebarTools` to dispatch `UNDO` / `REDO` — pass `onUndo` and `onRedo` callbacks from `WorkspaceEditor` down to `SidebarTools`
    - _Requirements: 7.7, 7.8_

  - [ ]* 3.3 Write property test for undo reverts any mutation (Property 9)
    - **Property 9: Undo reverts any canvas mutation**
    - **Validates: Requirements 7.7**
    - Generate arbitrary sequences of `PAN` and `ADD_ANNOTATION` actions
    - Apply sequence, then dispatch `UNDO`, assert resulting state equals state before last mutation

  - [ ]* 3.4 Write property test for undo-then-redo identity (Property 10)
    - **Property 10: Undo then redo is identity**
    - **Validates: Requirements 7.8**
    - Generate arbitrary single mutations
    - Apply mutation, dispatch `UNDO`, dispatch `REDO`, assert state equals state after original mutation

  - [-] 3.5 Implement pan, select, and text interaction modes
    - Attach `onPointerDown/Move/Up` handlers to the canvas container; when `activeTool === "hand"`, translate `canvasOffset` on drag
    - When `activeTool === "select"`, pointer events use default selection behaviour (no-op for current boards, extensible)
    - When `activeTool === "text"`, an `onClick` handler creates a `TextAnnotation` at the click coordinates and dispatches `ADD_ANNOTATION`
    - Render `textAnnotations` as absolutely-positioned `<span>` elements on the canvas
    - Apply `canvasOffset` as a CSS `transform: translate(x, y)` on the inner canvas content div
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 3.6 Write property test for activeTool driving interaction mode (Property 8)
    - **Property 8: activeTool drives BoardCanvas interaction mode**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.6**
    - For each value in `{ "select", "hand", "text" }`, simulate the corresponding pointer/click event
    - Assert `hand` changes `canvasOffset`, `text` creates a `TextAnnotation`, `select` does not mutate canvas state

  - [~] 3.7 Mount `InlineAIResponse` inside `BoardCanvas`
    - Import `InlineAIResponse` into `BoardCanvas`
    - Render `<InlineAIResponse messages={messages} isThinking={isThinking} onDismiss={() => setInlineVisible(false)} />` when `inlineVisible && (messages.length > 0 || isThinking)`
    - Reset `inlineVisible` to `true` whenever `messages` transitions from empty to non-empty (use `useEffect`)
    - _Requirements: 2.1, 2.3, 2.5_

  - [ ]* 3.8 Write property test for `InlineAIResponse` rendered for any assistant message (Property 2)
    - **Property 2: InlineAIResponse rendered for any assistant message**
    - **Validates: Requirements 2.1**
    - Generate arbitrary `Message[]` arrays containing at least one `role === "assistant"` entry
    - Assert `InlineAIResponse` is present in the rendered `BoardCanvas` DOM

- [~] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Wire `RightPanel` to Liveblocks
  - [~] 5.1 Replace hardcoded presence data with `useOthers`
    - Import `useOthers` from `@liveblocks/react`
    - Remove the hardcoded `avatars` and `messages` arrays
    - Render one `PresenceAvatar` per entry in `others`, using `other.info.name` and `other.info.avatar`
    - Display online count label equal to `others.length`
    - Show "No one else is online right now." when `others.length === 0`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.2 Write property test for presence avatars matching `useOthers` output (Property 5)
    - **Property 5: RightPanel presence avatars match useOthers output**
    - **Validates: Requirements 4.2, 4.3**
    - Mock `useOthers` with arbitrary user arrays (0–20 users)
    - Assert rendered avatar count equals `others.length`
    - Assert online count label equals `others.length`

  - [~] 5.3 Replace hardcoded threads with `useThreads` and `useCreateThread`
    - Import `useThreads`, `useCreateThread` from `@liveblocks/react` and `Thread` from `@liveblocks/react-ui`
    - Remove hardcoded `threadLabels` and mock message data
    - Render `threads.map(thread => <Thread key={thread.id} thread={thread} />)`
    - Show a loading spinner while `isLoading` is `true`
    - Show "No threads yet. Start the conversation." when `!isLoading && threads.length === 0`
    - Show an error message when `error` is truthy (e.g., "Could not connect to room. Retrying…")
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 6.3_

  - [~] 5.4 Wire chat input to `useCreateThread`
    - In `handleSend`, call `createThread` with a body containing the input text as a paragraph node
    - Clear `chatInput` after successful thread creation
    - Catch `createThread` errors and show an inline error toast (non-blocking)
    - _Requirements: 5.4_

  - [ ]* 5.5 Write property test for threads matching `useThreads` output (Property 6)
    - **Property 6: RightPanel threads match useThreads output**
    - **Validates: Requirements 5.2**
    - Mock `useThreads` with arbitrary thread arrays
    - Assert rendered thread count equals the mocked thread count with no extra hardcoded entries

  - [ ]* 5.6 Write property test for thread creation from any non-empty message (Property 7)
    - **Property 7: Thread creation from any non-empty message**
    - **Validates: Requirements 5.4**
    - Generate arbitrary non-empty strings
    - Submit each via the chat input, assert `useCreateThread` is called with a body containing that exact string

- [ ] 6. Wire `WorkspaceHeader` to Liveblocks presence
  - [~] 6.1 Replace hardcoded avatars with `useOthers` in `WorkspaceHeader`
    - Import `useOthers` from `@liveblocks/react`
    - Remove the hardcoded `avatars` array
    - Render `others.map(other => …)` for live avatars using `other.info.name` and `other.info.avatar`
    - When `others` is empty, render only the current user's avatar derived from the `user` prop
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 6.2 Write property test for header avatars matching `useOthers` output (Property 11)
    - **Property 11: WorkspaceHeader avatars match useOthers output**
    - **Validates: Requirements 8.1**
    - Mock `useOthers` with arbitrary user arrays (0–10 users)
    - Assert rendered live avatar count equals `others.length`
    - Assert no hardcoded avatar entries are rendered alongside live ones

- [ ] 7. Add `LiveblocksRoomProvider` to workspace page
  - [~] 7.1 Wrap `WorkspaceEditor` in `LiveblocksRoomProvider` in `page.tsx`
    - Import `LiveblocksRoomProvider` from `@/components/LiveblocksProvider`
    - Wrap the `<WorkspaceEditor …/>` return value with `<LiveblocksRoomProvider roomId={slug}>`
    - Verify `initialPresence` in `LiveblocksRoomProvider` matches the `Presence` shape in `liveblocks.config.ts` (`cursor`, `selectedColor`, `isTyping`)
    - _Requirements: 6.1, 6.2_

- [ ] 8. Property tests for AIInputBar forwarding and end-to-end wiring
  - [ ]* 8.1 Write property test for AIInputBar prompt forwarding (Property 1)
    - **Property 1: AIInputBar prompt forwarding**
    - **Validates: Requirements 1.4**
    - Generate arbitrary non-empty strings
    - Render `WorkspaceEditor` with a mocked `onSendToAI`, submit each string via `AIInputBar`
    - Assert `onSendToAI` is called with the exact string
    - Assert no floating overlay component becomes visible as a result

- [~] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at natural integration boundaries
- Property tests validate universal correctness properties using `fast-check` (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- The `LiveblocksWrapperProvider` (app-level) already provides the `LiveblocksProvider` context; task 7.1 only adds the `RoomProvider` layer
- `UserMeta.info` in `liveblocks.config.ts` uses `info.name` and `info.avatar` — use `other.info.name` / `other.info.avatar` in components

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "3.1", "3.2"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.3", "3.4", "3.5"] },
    { "id": 4, "tasks": ["3.6", "3.7"] },
    { "id": 5, "tasks": ["3.8", "5.1", "5.3", "6.1", "7.1"] },
    { "id": 6, "tasks": ["5.2", "5.4", "5.5", "6.2"] },
    { "id": 7, "tasks": ["5.6", "8.1"] }
  ]
}
```
