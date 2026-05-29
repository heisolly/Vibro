"use client";

import React, { useState, useRef } from "react";
import type { VibroBoard } from "@/lib/vibro";
import type { ActiveTool } from "./types";
import { useReactFlow } from "@xyflow/react";

interface SidebarToolsProps {
  activeBoard: VibroBoard;
  activeTool: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitToScreen?: () => void;
}

// Keyboard shortcut labels shown in tooltip
const SHORTCUT: Partial<Record<ActiveTool, string>> = {
  select: "V",
  hand: "H",
  rectangle: "R",
  circle: "O",
  diamond: "D",
  database: "B",
  hexagon: "X",
};

const boardTools: Record<VibroBoard, { id: ActiveTool; label: string; shortcut?: string; renderIcon: () => React.ReactNode }[]> = {
  architecture: [
    {
      id: "select",
      label: "Move",
      shortcut: "V",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 3.5 L20.5 9.5 L13.5 13.5 L9.5 20.5 Z" />
        </svg>
      ),
    },
    {
      id: "hand",
      label: "Hand",
      shortcut: "H",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
          <path d="M14 10V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
          <path d="M10 10.5V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5.5" />
          <path d="M6 13a2 2 0 0 0-2-2v5c0 4 3 7 7 7h2c4 0 7-3 7-7v-5.5a2 2 0 0 0-2-2v3.5" />
        </svg>
      ),
    },
    {
      id: "rectangle",
      label: "Rectangle",
      shortcut: "R",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="14" rx="2" />
        </svg>
      ),
    },
    {
      id: "circle",
      label: "Circle",
      shortcut: "O",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
    {
      id: "diamond",
      label: "Diamond",
      shortcut: "D",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      ),
    },
    {
      id: "database",
      label: "Database",
      shortcut: "B",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      ),
    },
    {
      id: "hexagon",
      label: "Hexagon",
      shortcut: "X",
      renderIcon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 20.5,7 20.5,17 12,22 3.5,17 3.5,7" />
        </svg>
      ),
    },
  ],
  design: [
    { id: "select", label: "Select", shortcut: "V", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 3.5 L20.5 9.5 L13.5 13.5 L9.5 20.5 Z" />
      </svg>
    )},
    { id: "hand", label: "Hand", shortcut: "H", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
        <path d="M14 10V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
        <path d="M10 10.5V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5.5" />
        <path d="M6 13a2 2 0 0 0-2-2v5c0 4 3 7 7 7h2c4 0 7-3 7-7v-5.5a2 2 0 0 0-2-2v3.5" />
      </svg>
    )},
    { id: "shapes", label: "Add Card", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
    )},
    { id: "text", label: "Add note", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M3 12h14M3 18h9"/></svg>
    )},
  ],
  inspiration: [
    { id: "select", label: "Select", shortcut: "V", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 3.5 L20.5 9.5 L13.5 13.5 L9.5 20.5 Z" />
      </svg>
    )},
    { id: "hand", label: "Hand", shortcut: "H", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
        <path d="M14 10V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
        <path d="M10 10.5V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5.5" />
        <path d="M6 13a2 2 0 0 0-2-2v5c0 4 3 7 7 7h2c4 0 7-3 7-7v-5.5a2 2 0 0 0-2-2v3.5" />
      </svg>
    )},
    { id: "upload", label: "Upload screenshots", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
    )},
    { id: "url", label: "Add URL", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    )},
    { id: "search", label: "Search web", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6M8 11h6"/></svg>
    )},
    { id: "moodboard", label: "Create moodboard", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    )},
    { id: "tag", label: "Tag inspiration", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 10 14 4H5v9l6 6 9-9Z"/><circle cx="8" cy="8" r="1"/></svg>
    )},
    { id: "group", label: "Group", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><path d="M11 7h3a3 3 0 0 1 3 3v3"/></svg>
    )},
    { id: "ungroup", label: "Ungroup", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><path d="M14 7h3M17 7v3M7 14v3M7 17h3"/></svg>
    )},
    { id: "pin", label: "Pin", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m14 4 6 6-4 1-5 5-1 4-6-6 4-1 5-5 1-4Z"/><path d="m9 15-5 5"/></svg>
    )},
    { id: "note", label: "Add note", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h14v12l-5 5H5z"/><path d="M14 21v-5h5"/></svg>
    )},
    { id: "delete", label: "Delete selected", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7l1-3h4l1 3"/></svg>
    )},
  ],
  progress: [
    { id: "select", label: "Select", shortcut: "V", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 3.5 L20.5 9.5 L13.5 13.5 L9.5 20.5 Z" />
      </svg>
    )},
    { id: "hand", label: "Hand", shortcut: "H", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 11V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
        <path d="M14 10V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
        <path d="M10 10.5V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5.5" />
        <path d="M6 13a2 2 0 0 0-2-2v5c0 4 3 7 7 7h2c4 0 7-3 7-7v-5.5a2 2 0 0 0-2-2v3.5" />
      </svg>
    )},
    { id: "shapes", label: "Add Task", renderIcon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>
    )},
  ],
};

function Tooltip({ label, shortcut }: { label: string; shortcut?: string }) {
  return (
    <div className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[200] -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#1a1a1a] px-2.5 py-1.5 shadow-xl">
      <span className="text-[12px] font-medium text-white">{label}</span>
      {shortcut && (
        <span className="rounded bg-white/20 px-1 py-0.5 text-[11px] font-bold text-white/80">
          {shortcut}
        </span>
      )}
      {/* Arrow pointing left toward button */}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
    </div>
  );
}

function ToolButton({
  active,
  label,
  shortcut,
  onClick,
  renderIcon,
  draggable,
  onDragStart,
}: {
  active?: boolean;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  renderIcon: () => React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        className={`grid h-9 w-9 place-items-center rounded-xl transition-all duration-100 select-none ${
          active
            ? "bg-[#111] text-white shadow-sm"
            : "text-[#333] hover:bg-[#f0f0f0]"
        }`}
      >
        {renderIcon()}
      </button>
      {hovered && <Tooltip label={label} shortcut={shortcut} />}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  renderIcon,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  renderIcon: () => React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="grid h-9 w-9 place-items-center rounded-xl text-[#333] transition hover:bg-[#f0f0f0] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {renderIcon()}
      </button>
      {hovered && <Tooltip label={label} />}
    </div>
  );
}

const SHAPE_DRAG_DATA: Partial<Record<ActiveTool, { shape: string; label: string; color: string; width: number; height: number }>> = {
  rectangle: { shape: "rectangle", label: "Rectangle", color: "#2563eb", width: 180, height: 80 },
  circle: { shape: "circle", label: "Circle", color: "#dc2626", width: 140, height: 140 },
  diamond: { shape: "diamond", label: "Diamond", color: "#d97706", width: 140, height: 140 },
  database: { shape: "database", label: "Database", color: "#059669", width: 140, height: 160 },
  hexagon: { shape: "hexagon", label: "Hexagon", color: "#7c3aed", width: 160, height: 140 },
};

export default function SidebarTools({
  activeBoard,
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
}: SidebarToolsProps) {
  const tools = boardTools[activeBoard];

  const handleDragStart = (e: React.DragEvent, toolId: ActiveTool) => {
    const dragData = SHAPE_DRAG_DATA[toolId];
    if (!dragData) return;
    e.dataTransfer.setData("application/reactflow", JSON.stringify({ type: "shape", ...dragData }));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="fixed left-2 top-1/2 z-[90] flex -translate-y-1/2 flex-col items-center gap-2 select-none">
      {/* Main tools */}
      <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/80 bg-white/90 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        {tools.map((tool) => {
          const isShape = !!SHAPE_DRAG_DATA[tool.id];
          return (
            <ToolButton
              key={tool.id}
              active={activeTool === tool.id}
              label={tool.label}
              shortcut={tool.shortcut}
              onClick={() => {
                onToolChange(tool.id);
                if (activeBoard === "inspiration") {
                  window.dispatchEvent(new CustomEvent("vibro:inspiration-tool", { detail: tool.id }));
                }
              }}
              renderIcon={tool.renderIcon}
              draggable={isShape}
              onDragStart={isShape ? (e) => handleDragStart(e, tool.id) : undefined}
            />
          );
        })}
      </div>

      {/* Undo / Redo + Zoom controls – combined into one pill */}
      <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/80 bg-white/90 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <ActionButton
          label="Undo"
          onClick={onUndo}
          renderIcon={() => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 10h10a5 5 0 0 1 0 10H9" />
              <polyline points="3 10 7 6 3 2" />
            </svg>
          )}
        />
        <ActionButton
          label="Redo"
          onClick={onRedo}
          renderIcon={() => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10H11a5 5 0 0 0 0 10h4" />
              <polyline points="21 10 17 6 21 2" />
            </svg>
          )}
        />

        {/* Divider */}
        <div className="my-0.5 h-px w-6 rounded-full bg-[#e5e5e5]" />

        {/* Zoom In */}
        <ActionButton
          label="Zoom in"
          renderIcon={() => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          )}
          onClick={() => {
            if (activeBoard === "architecture") {
              const btn = document.querySelector(".react-flow__controls-zoomin") as HTMLButtonElement | null;
              btn?.click();
            } else {
              onZoomIn?.();
            }
          }}
        />

        {/* Zoom Out */}
        <ActionButton
          label="Zoom out"
          renderIcon={() => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          )}
          onClick={() => {
            if (activeBoard === "architecture") {
              const btn = document.querySelector(".react-flow__controls-zoomout") as HTMLButtonElement | null;
              btn?.click();
            } else {
              onZoomOut?.();
            }
          }}
        />

        {/* Fit to screen */}
        <ActionButton
          label="Fit to screen"
          renderIcon={() => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          )}
          onClick={() => {
            if (activeBoard === "architecture") {
              const btn = document.querySelector(".react-flow__controls-fitview") as HTMLButtonElement | null;
              btn?.click();
            } else {
              onFitToScreen?.();
            }
          }}
        />
      </div>
    </aside>
  );
}
