# Requirements Document

## Introduction

This document describes the requirements for redesigning the Vibro workspace editor. The redesign establishes a canvas-first interaction model where `BoardCanvas` is the primary workspace and AI is a secondary assistant. It removes the `FloatingChat` overlay in favour of inline AI responses on the canvas, retains `AIInputBar` as the sole AI interaction surface, wires `RightPanel` to live Liveblocks Threads/Comments/Presence APIs (replacing all hardcoded mock data), and connects `SidebarTools` tool selections to actual canvas behaviour.

## Glossary

- **WorkspaceEditor**: The top-level React component (`WorkspaceEditor.tsx`) that composes the full editor layout.
- **BoardCanvas**: The primary canvas component (`BoardCanvas.tsx`) that renders the active board (Design, Architecture, Inspiration, Progress).
- **AIInputBar**: The bottom input bar component (`AIInputBar.tsx`) used to send prompts to the AI assistant.
- **FloatingChat**: The floating overlay chat component (`FloatingChat.tsx`) that is being removed in this redesign.
- **RightPanel**: The slide-in sidebar component (`RightPanel.tsx`) that displays team chat and context information.
- **SidebarTools**: The left vertical toolbar component (`SidebarTools.tsx`) containing canvas interaction tools.
- **ActiveTool**: The currently selected tool in `SidebarTools` (select, hand, shapes, frame, crop, text, upload).
- **InlineAIResponse**: An AI-generated response rendered directly on `BoardCanvas` rather than in a floating overlay.
- **LiveblocksRoom**: A Liveblocks collaborative room identified by the workspace slug.
- **Presence**: Real-time per-user state (cursor position, active status) managed by Liveblocks.
- **Thread**: A Liveblocks Threads API conversation thread attached to the workspace room.
- **Comment**: An individual message within a Liveblocks Thread.
- **PresenceAvatar**: A UI element displaying a connected user's avatar and online status derived from live Liveblocks Presence data.

---

## Requirements

### Requirement 1 — Remove FloatingChat and Consolidate AI Surface

**User Story:** As a workspace user, I want a single, unobtrusive AI input surface so that the canvas remains the primary focus and I am not distracted by a floating overlay.

#### Acceptance Criteria

1. THE `WorkspaceEditor` SHALL remove all imports, JSX references, and state variables (`chatOpen`, `setChatOpen`) that exist solely to support `FloatingChat`.
2. THE `WorkspaceEditor` SHALL remove the `FloatingChat` component file (`FloatingChat.tsx`) from the codebase.
3. THE `WorkspaceEditor` SHALL remove the "Open AI Chat" button that previously toggled `FloatingChat`.
4. WHEN a user submits a prompt via `AIInputBar`, THE `WorkspaceEditor` SHALL pass the prompt to the `onSendToAI` handler without opening any floating overlay.
5. THE `AIInputBar` SHALL remain as the sole AI interaction surface rendered within the canvas area.

---

### Requirement 2 — Inline AI Responses on BoardCanvas

**User Story:** As a workspace user, I want AI responses to appear directly on the canvas so that I can see AI output in context with the board I am working on.

#### Acceptance Criteria

1. WHEN the `WorkspaceEditor` receives a non-empty `messages` array containing at least one assistant message, THE `BoardCanvas` SHALL render an `InlineAIResponse` overlay panel within the canvas bounds.
2. THE `InlineAIResponse` panel SHALL display all messages in the `messages` array in chronological order, distinguishing user messages from assistant messages visually.
3. WHILE `isThinking` is `true`, THE `BoardCanvas` SHALL display a loading indicator within the `InlineAIResponse` panel.
4. THE `InlineAIResponse` panel SHALL be dismissible by the user, causing it to hide without clearing the `messages` state in `WorkspaceEditor`.
5. IF the `messages` array is empty and `isThinking` is `false`, THEN THE `BoardCanvas` SHALL NOT render the `InlineAIResponse` panel.

---

### Requirement 3 — WorkspaceEditor State Cleanup

**User Story:** As a developer, I want `WorkspaceEditor` state to reflect only the canvas-first model so that the component is maintainable and free of dead code.

#### Acceptance Criteria

1. THE `WorkspaceEditor` SHALL NOT contain any state variable whose sole purpose is to control the open/closed state of `FloatingChat`.
2. THE `WorkspaceEditor` SHALL pass `messages`, `isThinking`, and `onSendToAI` only to `BoardCanvas` and `AIInputBar`.
3. THE `WorkspaceEditor` SHALL retain the `rightOpen` state variable and the `onToggle` callback for `RightPanel`.
4. THE `AIInputBar` `rightOpen` prop SHALL continue to receive the `rightOpen` state value so that the input bar width adjusts correctly when the panel is open or closed.

---

### Requirement 4 — RightPanel Liveblocks Presence Integration

**User Story:** As a team member, I want to see which collaborators are currently online in the workspace so that I know who is available for real-time collaboration.

#### Acceptance Criteria

1. THE `RightPanel` SHALL use the Liveblocks `useOthers` hook to retrieve the list of currently connected users in the room.
2. THE `RightPanel` SHALL render one `PresenceAvatar` per connected user derived from `useOthers`, using each user's `userInfo.name` and `userInfo.avatar` values resolved via the `LiveblocksProvider` `resolveUsers` callback.
3. THE `RightPanel` SHALL display an online count label that reflects the exact number of users returned by `useOthers`.
4. THE `RightPanel` SHALL NOT render any hardcoded avatar or presence data.
5. IF `useOthers` returns an empty array, THEN THE `RightPanel` SHALL display a label indicating no other users are currently online.

---

### Requirement 5 — RightPanel Liveblocks Threads Integration

**User Story:** As a team member, I want to read and post real team messages in the workspace sidebar so that team communication is persistent and shared across all collaborators.

#### Acceptance Criteria

1. THE `RightPanel` SHALL use the Liveblocks `useThreads` hook from `@liveblocks/react` to retrieve all threads for the current room.
2. THE `RightPanel` SHALL render each thread returned by `useThreads` using the Liveblocks `Thread` component from `@liveblocks/react-ui`, or an equivalent custom renderer that displays thread comments in chronological order.
3. THE `RightPanel` SHALL NOT render any hardcoded message, thread label, or mock comment data.
4. WHEN a user submits a message in the `RightPanel` chat input, THE `RightPanel` SHALL create a new Liveblocks thread comment using the Liveblocks `useCreateThread` hook, persisting the message to the room.
5. IF `useThreads` returns an empty array, THEN THE `RightPanel` SHALL display an empty-state message indicating no threads exist yet.
6. WHILE Liveblocks thread data is loading, THE `RightPanel` SHALL display a loading indicator in place of the thread list.

---

### Requirement 6 — RightPanel Liveblocks Room Provider

**User Story:** As a developer, I want `RightPanel` to operate within a Liveblocks room context so that presence and thread hooks have access to the correct room data.

#### Acceptance Criteria

1. THE `WorkspaceEditor` SHALL wrap `RightPanel` (or the workspace layout) in a `LiveblocksRoomProvider` using the workspace `slug` as the `roomId`.
2. THE `LiveblocksRoomProvider` SHALL be initialised with the `Presence` shape defined in `liveblocks.config.ts` (`cursor`, `selectedColor`, `isTyping`).
3. IF the Liveblocks room connection fails, THEN THE `RightPanel` SHALL display an error state message rather than crashing the workspace.

---

### Requirement 7 — SidebarTools Canvas Integration

**User Story:** As a workspace user, I want the toolbar tools to affect the canvas so that selecting a tool changes how I interact with the board.

#### Acceptance Criteria

1. WHEN the user selects the `hand` tool in `SidebarTools`, THE `BoardCanvas` SHALL enter a pan mode where pointer drag events translate the canvas viewport.
2. WHEN the user selects the `select` tool in `SidebarTools`, THE `BoardCanvas` SHALL enter a selection mode where pointer interactions select canvas elements rather than panning.
3. WHEN the user selects the `text` tool in `SidebarTools`, THE `BoardCanvas` SHALL enter a text-insertion mode where a click on the canvas creates a new text annotation at the clicked position.
4. THE `WorkspaceEditor` SHALL maintain an `activeTool` state of type `ActiveTool` and pass it as a prop to both `SidebarTools` and `BoardCanvas`.
5. THE `SidebarTools` component SHALL accept an `activeTool` prop and an `onToolChange` callback prop, replacing its internal `useState` for the active tool.
6. THE `BoardCanvas` component SHALL accept an `activeTool` prop and apply the corresponding interaction mode to the canvas.
7. WHEN the user activates the `undo` button in `SidebarTools`, THE `BoardCanvas` SHALL revert the most recent canvas mutation.
8. WHEN the user activates the `redo` button in `SidebarTools`, THE `BoardCanvas` SHALL reapply the most recently undone canvas mutation.

---

### Requirement 8 — WorkspaceHeader Presence Avatars

**User Story:** As a workspace user, I want the header presence avatars to reflect real connected users so that the header accurately represents who is in the workspace.

#### Acceptance Criteria

1. THE `WorkspaceHeader` SHALL use the Liveblocks `useOthers` hook to retrieve connected users and render one avatar per user using `userInfo.name` and `userInfo.avatar`.
2. THE `WorkspaceHeader` SHALL NOT render the hardcoded `avatars` array.
3. IF no other users are connected, THEN THE `WorkspaceHeader` SHALL render only the current user's avatar derived from the `user` prop.
