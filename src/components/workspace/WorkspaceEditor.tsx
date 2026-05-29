"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VibroBoard, VibroProject, VibroUser } from "@/lib/vibro";
import type { ContextBundle } from "@/lib/github-types";
import WorkspaceHeader from "./WorkspaceHeader";
import SidebarTools from "./SidebarTools";
import BoardCanvas, { type BoardCanvasHandle } from "./BoardCanvas";
import AIInputBar from "./AIInputBar";
import RightPanel from "./RightPanel";
import { type ActiveTool } from "./types";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function WorkspaceEditor({
  slug,
  project,
  user,
  messages,
  isThinking,
  onSendToAI,
  bundles,
}: {
  slug: string;
  project: VibroProject | null;
  user: VibroUser | null;
  messages: Message[];
  isThinking: boolean;
  onSendToAI: (text: string) => void;
  bundles: ContextBundle[];
}) {
  const [activeBoard, setActiveBoard] = useState<VibroBoard>("architecture");
  const [rightOpen, setRightOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const boardCanvasRef = useRef<BoardCanvasHandle>(null);

  const handleUndo = useCallback(() => {
    boardCanvasRef.current?.undo();
  }, []);

  const handleRedo = useCallback(() => {
    boardCanvasRef.current?.redo();
  }, []);

  const handleZoomIn = useCallback(() => {
    if (activeBoard === "architecture") {
      const btn = document.querySelector(".react-flow__controls-zoomin") as HTMLButtonElement | null;
      btn?.click();
    } else {
      boardCanvasRef.current?.zoomIn();
    }
  }, [activeBoard]);

  const handleZoomOut = useCallback(() => {
    if (activeBoard === "architecture") {
      const btn = document.querySelector(".react-flow__controls-zoomout") as HTMLButtonElement | null;
      btn?.click();
    } else {
      boardCanvasRef.current?.zoomOut();
    }
  }, [activeBoard]);

  const handleFitToScreen = useCallback(() => {
    if (activeBoard === "architecture") {
      const btn = document.querySelector(".react-flow__controls-fitview") as HTMLButtonElement | null;
      btn?.click();
    } else {
      boardCanvasRef.current?.fitToScreen();
    }
  }, [activeBoard]);

  const handleSend = useCallback(
    (text: string) => {
      onSendToAI(text);
    },
    [onSendToAI]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to blur active text inputs
      if (e.key === "Escape") {
        const activeEl = document.activeElement as HTMLElement;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.isContentEditable ||
            activeEl.hasAttribute("contenteditable"))
        ) {
          activeEl.blur();
        }
        return;
      }

      // Detect if user is currently typing in an input, textarea, or contentEditable element
      const activeEl = document.activeElement;
      const isEditing =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.hasAttribute("contenteditable") ||
          (activeEl as HTMLElement).isContentEditable);

      // Handle Modifier Keys (Ctrl/Cmd) first
      if ((e.ctrlKey || e.metaKey) && !isEditing) {
        const key = e.key.toLowerCase();
        if (key === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          return;
        }
        if (key === "y") {
          e.preventDefault();
          handleRedo();
          return;
        }
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          handleZoomIn();
          return;
        }
        if (e.key === "-") {
          e.preventDefault();
          handleZoomOut();
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          handleFitToScreen();
          return;
        }
      }

      // If user is typing in a text field, do not trigger single-letter canvas/tool shortcuts
      if (isEditing) return;

      // Tool selection shortcuts
      const key = e.key.toLowerCase();
      if (activeBoard === "architecture") {
        switch (key) {
          case "v":
            e.preventDefault();
            setActiveTool("select");
            break;
          case "h":
            e.preventDefault();
            setActiveTool("hand");
            break;
          case "r":
            e.preventDefault();
            setActiveTool("rectangle");
            break;
          case "o":
            e.preventDefault();
            setActiveTool("circle");
            break;
          case "d":
            e.preventDefault();
            setActiveTool("diamond");
            break;
          case "b":
            e.preventDefault();
            setActiveTool("database");
            break;
          case "x":
            e.preventDefault();
            setActiveTool("hexagon");
            break;
        }
      } else {
        // Fallback or generic shortcuts for other boards
        switch (key) {
          case "v":
            e.preventDefault();
            setActiveTool("select");
            break;
          case "h":
            e.preventDefault();
            setActiveTool("hand");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBoard, handleUndo, handleRedo, handleZoomIn, handleZoomOut, handleFitToScreen]);

  return (
    <div className="h-screen overflow-hidden bg-[#f1f1f1] text-[#1f1f1f]">
      <WorkspaceHeader
        activeBoard={activeBoard}
        onBoardChange={setActiveBoard}
        user={user}
        onToggleChat={() => setRightOpen((o) => !o)}
        chatOpen={rightOpen}
      />

      <SidebarTools
        activeBoard={activeBoard}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
      />

      <div
        className="absolute"
        style={{
          top: 48,
          left: 48,
          right: rightOpen ? 300 : 0,
          bottom: 0,
        }}
      >
        <BoardCanvas
          ref={boardCanvasRef}
          activeBoard={activeBoard}
          bundles={bundles}
          activeTool={activeTool}
          messages={messages}
          isThinking={isThinking}
          slug={slug}
          project={project}
          user={user}
        />

        <AIInputBar onSend={handleSend} disabled={isThinking} rightOpen={rightOpen} activeBoard={activeBoard} />
      </div>

      <RightPanel open={rightOpen} onToggle={() => setRightOpen((o) => !o)} bundles={bundles} activeBoard={activeBoard} />
    </div>
  );
}
