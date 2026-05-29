"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { motion } from "framer-motion";
import type { VibroBoard, VibroProject, VibroUser } from "@/lib/vibro";
import type { ContextBundle } from "@/lib/github-types";
import { MaterialIcon, spring } from "@/components/vibro/ui";
import InlineAIResponse from "./InlineAIResponse";
import ArchitectureFlow, { type ArchitectureFlowHandle } from "./ArchitectureFlow";
import { type ActiveTool } from "./types";
import { useWorkspaceState } from "@/hooks/useWorkspaceState";
import FullInspirationBoard from "./InspirationBoard";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type TextAnnotation = {
  id: string;
  x: number;
  y: number;
  text: string;
};

type ArchNode = {
  id: string;
  label: string;
  caption: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type ArchEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
};

type InspirationItem = {
  id: string;
  title: string;
  url: string;
  tags: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  pinned?: boolean;
};

type TodoItem = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  owner: string;
  x: number;
  y: number;
};

type CanvasState = {
  offset: { x: number; y: number };
  zoom: number;
  annotations: TextAnnotation[];
  nodes: ArchNode[];
  edges: ArchEdge[];
  inspiration: InspirationItem[];
  todos: TodoItem[];
};

type CanvasAction =
  | { type: "PAN"; dx: number; dy: number }
  | { type: "MOVE_NODE"; id: string; x: number; y: number }
  | { type: "MOVE_INSPIRATION"; id: string; x: number; y: number }
  | { type: "MOVE_TODO"; id: string; x: number; y: number }
  | { type: "ADD_NODE"; node: ArchNode }
  | { type: "ADD_EDGE"; edge: ArchEdge }
  | { type: "ADD_INSPIRATION"; item: InspirationItem }
  | { type: "ADD_TODO"; item: TodoItem }
  | { type: "ADD_ANNOTATION"; annotation: TextAnnotation }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "UNDO" }
  | { type: "REDO" };

type HistoryState = {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
};

export interface BoardCanvasHandle {
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
}

interface BoardCanvasProps {
  activeBoard: VibroBoard;
  bundles: ContextBundle[];
  activeTool: ActiveTool;
  messages: Message[];
  isThinking: boolean;
  slug: string;
  project: VibroProject | null;
  user: VibroUser | null;
}

const initialNodes: ArchNode[] = [
  { id: "user", label: "User", caption: "Product actor", icon: "person", color: "#111827", x: 80, y: 320, w: 154, h: 80 },
  { id: "frontend", label: "Frontend", caption: "Web / mobile UI", icon: "web_asset", color: "#2563eb", x: 330, y: 320, w: 174, h: 80 },
  { id: "gateway", label: "API Gateway", caption: "Routing and auth", icon: "hub", color: "#7c3aed", x: 600, y: 320, w: 184, h: 80 },
  { id: "ai", label: "AI Service", caption: "Reasoning and context", icon: "auto_awesome", color: "#0891b2", x: 880, y: 170, w: 184, h: 80 },
  { id: "workflow", label: "Workflow Service", caption: "Trigger jobs and sync", icon: "bolt", color: "#ea580c", x: 880, y: 470, w: 198, h: 80 },
  { id: "database", label: "Database", caption: "Supabase records", icon: "database", color: "#059669", x: 1180, y: 210, w: 174, h: 80 },
  { id: "storage", label: "Storage", caption: "Assets and references", icon: "folder", color: "#4f46e5", x: 1180, y: 430, w: 174, h: 80 },
  { id: "external", label: "External APIs", caption: "GitHub, models, MCP", icon: "extension", color: "#db2777", x: 1460, y: 320, w: 184, h: 80 },
  { id: "monitoring", label: "Monitoring", caption: "Logs and health", icon: "monitoring", color: "#64748b", x: 880, y: 680, w: 184, h: 80 },
];

const initialEdges: ArchEdge[] = [
  { id: "e1", from: "user", to: "frontend", label: "intent" },
  { id: "e2", from: "frontend", to: "gateway", label: "request" },
  { id: "e3", from: "gateway", to: "ai", label: "prompt" },
  { id: "e4", from: "gateway", to: "workflow", label: "job" },
  { id: "e5", from: "ai", to: "database", label: "context" },
  { id: "e6", from: "workflow", to: "storage", label: "assets" },
  { id: "e7", from: "database", to: "external", label: "sync" },
  { id: "e8", from: "storage", to: "external", label: "handoff" },
  { id: "e9", from: "workflow", to: "monitoring", label: "events" },
  { id: "e10", from: "monitoring", to: "gateway", label: "alerts" },
];

const initialInspiration: InspirationItem[] = [
  { id: "i1", title: "Gemini prompt surface", url: "gemini.google.com", tags: ["AI Input", "Landing Page"], x: 130, y: 220, w: 260, h: 190, color: "#dbeafe", pinned: true },
  { id: "i2", title: "Linear onboarding", url: "linear.app", tags: ["Onboarding", "Dashboard"], x: 450, y: 160, w: 260, h: 210, color: "#e5e7eb" },
  { id: "i3", title: "Cursor command bar", url: "cursor.com", tags: ["Workspace", "AI UX"], x: 760, y: 250, w: 260, h: 190, color: "#dcfce7" },
  { id: "i4", title: "Recraft canvas", url: "recraft.ai", tags: ["Canvas", "Toolbar"], x: 350, y: 470, w: 300, h: 205, color: "#fef3c7" },
];

const initialTodos: TodoItem[] = [
  { id: "t1", title: "Define project brief", status: "done", owner: "MO", x: 170, y: 250 },
  { id: "t2", title: "Map architecture flows", status: "doing", owner: "AI", x: 520, y: 250 },
  { id: "t3", title: "Extract design tokens", status: "todo", owner: "DS", x: 870, y: 250 },
  { id: "t4", title: "Prepare MCP handoff", status: "todo", owner: "AI", x: 520, y: 480 },
];

const initialCanvas: CanvasState = {
  offset: { x: 72, y: 70 },
  zoom: 0.78,
  annotations: [],
  nodes: initialNodes,
  edges: initialEdges,
  inspiration: initialInspiration,
  todos: initialTodos,
};

function withHistory(state: HistoryState, present: CanvasState): HistoryState {
  return { past: [...state.past, state.present], present, future: [] };
}

function historyReducer(state: HistoryState, action: CanvasAction): HistoryState {
  switch (action.type) {
    case "PAN":
      return {
        ...state,
        present: {
          ...state.present,
          offset: { x: state.present.offset.x + action.dx, y: state.present.offset.y + action.dy },
        },
      };
    case "MOVE_NODE":
      return withHistory(state, {
        ...state.present,
        nodes: state.present.nodes.map((node) => node.id === action.id ? { ...node, x: action.x, y: action.y } : node),
      });
    case "MOVE_INSPIRATION":
      return withHistory(state, {
        ...state.present,
        inspiration: state.present.inspiration.map((item) => item.id === action.id ? { ...item, x: action.x, y: action.y } : item),
      });
    case "MOVE_TODO":
      return withHistory(state, {
        ...state.present,
        todos: state.present.todos.map((item) => item.id === action.id ? { ...item, x: action.x, y: action.y } : item),
      });
    case "ADD_NODE":
      return withHistory(state, { ...state.present, nodes: [...state.present.nodes, action.node] });
    case "ADD_EDGE":
      return withHistory(state, { ...state.present, edges: [...state.present.edges, action.edge] });
    case "ADD_INSPIRATION":
      return withHistory(state, { ...state.present, inspiration: [...state.present.inspiration, action.item] });
    case "ADD_TODO":
      return withHistory(state, { ...state.present, todos: [...state.present.todos, action.item] });
    case "ADD_ANNOTATION":
      return withHistory(state, { ...state.present, annotations: [...state.present.annotations, action.annotation] });
    case "SET_ZOOM":
      return { ...state, present: { ...state.present, zoom: Math.max(0.35, Math.min(1.6, action.zoom)) } };
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

function nodeCenter(node: ArchNode) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

function edgePath(from: ArchNode, to: ArchNode) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const dx = Math.max(70, Math.abs(b.x - a.x) / 2);
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

function bundleArchitectureText(bundle?: ContextBundle) {
  const arch = bundle?.bundle_data?.architecture;
  if (!arch) return ["Next.js", "Supabase", "Liveblocks", "Trigger.dev", "Groq/Gemini/Mistral", "GitHub sync"];
  return [
    ...arch.frontend,
    ...arch.backend,
    ...arch.apis,
    ...arch.database,
    ...arch.infrastructure,
    ...arch.integrations,
  ].slice(0, 8);
}

const BoardCanvas = forwardRef<BoardCanvasHandle, BoardCanvasProps>(
  function BoardCanvas({ activeBoard, bundles, activeTool, messages, isThinking, slug, project, user }, ref) {
    const { data: canvasState, update: saveCanvas } = useWorkspaceState<CanvasState>(slug, "canvas", initialCanvas);

    const [inlineVisible, setInlineVisible] = useState(messages.length > 0);
    const [selectedTab, setSelectedTab] = useState("Landing Page");
    const dragRef = useRef<
      | null
      | { type: "pan"; x: number; y: number }
      | { type: "inspiration"; id: string; dx: number; dy: number }
      | { type: "todo"; id: string; dx: number; dy: number }
    >(null);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const bundle = bundles[0];

    const architectureFlowRef = useRef<ArchitectureFlowHandle>(null);

    const setZoom = useCallback((zoom: number) => {
      saveCanvas((prev) => ({ ...prev, zoom: Math.max(0.35, Math.min(1.6, zoom)) }));
    }, [saveCanvas]);

    const pan = useCallback((dx: number, dy: number) => {
      saveCanvas((prev) => ({ ...prev, offset: { x: prev.offset.x + dx, y: prev.offset.y + dy } }));
    }, [saveCanvas]);

    const moveInspiration = useCallback((id: string, x: number, y: number) => {
      saveCanvas((prev) => ({
        ...prev,
        inspiration: prev.inspiration.map((item) => item.id === id ? { ...item, x, y } : item),
      }));
    }, [saveCanvas]);

    const moveTodo = useCallback((id: string, x: number, y: number) => {
      saveCanvas((prev) => ({
        ...prev,
        todos: prev.todos.map((item) => item.id === id ? { ...item, x, y } : item),
      }));
    }, [saveCanvas]);

    const addAnnotation = useCallback((annotation: TextAnnotation) => {
      saveCanvas((prev) => ({ ...prev, annotations: [...prev.annotations, annotation] }));
    }, [saveCanvas]);

    const addInspiration = useCallback((item: InspirationItem) => {
      saveCanvas((prev) => ({ ...prev, inspiration: [...prev.inspiration, item] }));
    }, [saveCanvas]);

    const addTodo = useCallback((item: TodoItem) => {
      saveCanvas((prev) => ({ ...prev, todos: [...prev.todos, item] }));
    }, [saveCanvas]);

    useEffect(() => {
      if (messages.length > 0 || isThinking) setInlineVisible(true);
    }, [messages.length, isThinking]);

    const canvasUndoStack = useRef<CanvasState[]>([]);
    const canvasRedoStack = useRef<CanvasState[]>([]);

    useImperativeHandle(ref, () => ({
      undo: () => {
        if (activeBoard === "architecture") { architectureFlowRef.current?.undo(); return; }
        if (canvasUndoStack.current.length === 0) return;
        const prev = canvasUndoStack.current.pop()!;
        canvasRedoStack.current.push(canvasState);
        saveCanvas(prev);
      },
      redo: () => {
        if (activeBoard === "architecture") { architectureFlowRef.current?.redo(); return; }
        if (canvasRedoStack.current.length === 0) return;
        const next = canvasRedoStack.current.pop()!;
        canvasUndoStack.current.push(canvasState);
        saveCanvas(next);
      },
      zoomIn: () => { if (canvasState) setZoom(canvasState.zoom + 0.1); },
      zoomOut: () => { if (canvasState) setZoom(canvasState.zoom - 0.1); },
      fitToScreen: () => {
        if (!canvasState) return;
        setZoom(0.78);
        pan(72 - canvasState.offset.x, 70 - canvasState.offset.y);
      },
    }));

    const detectedArchitecture = useMemo(() => bundleArchitectureText(bundle), [bundle]);

    function toCanvasPoint(event: PointerEvent<HTMLElement>) {
      const rect = canvasRef.current?.getBoundingClientRect();
      const left = rect?.left || 0;
      const top = rect?.top || 0;
      const offset = canvasState?.offset || { x: 72, y: 70 };
      const zoom = canvasState?.zoom || 0.78;
      return {
        x: (event.clientX - left - offset.x) / zoom,
        y: (event.clientY - top - offset.y) / zoom,
      };
    }

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
      if (activeTool !== "hand") return;
      dragRef.current = { type: "pan", x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
      const drag = dragRef.current;
      if (!drag) return;

      if (drag.type === "pan") {
        pan(event.clientX - drag.x, event.clientY - drag.y);
        dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
        return;
      }

      const point = toCanvasPoint(event);
      if (drag.type === "inspiration") moveInspiration(drag.id, point.x - drag.dx, point.y - drag.dy);
      if (drag.type === "todo") moveTodo(drag.id, point.x - drag.dx, point.y - drag.dy);
    }

    function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
      dragRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }

    function handleCanvasClick(event: PointerEvent<HTMLDivElement>) {
      if (event.target !== event.currentTarget) return;
      
      const point = toCanvasPoint(event);
      if (activeTool === "text") {
        addAnnotation({ id: crypto.randomUUID(), x: point.x, y: point.y, text: "New note" });
      }
      if (activeTool === "shapes" && activeBoard === "inspiration") {
        addInspiration({ id: crypto.randomUUID(), title: "New reference", url: "https://example.com", tags: [selectedTab], x: point.x, y: point.y, w: 260, h: 190, color: "#dbeafe" });
      }
      if (activeTool === "shapes" && activeBoard === "progress") {
        addTodo({ id: crypto.randomUUID(), title: "New task", status: "todo", owner: "AI", x: point.x, y: point.y });
      }
    }

    function startItemDrag(event: PointerEvent<HTMLButtonElement>, item: InspirationItem) {
      event.stopPropagation();
      const point = toCanvasPoint(event);
      dragRef.current = { type: "inspiration", id: item.id, dx: point.x - item.x, dy: point.y - item.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    function startTodoDrag(event: PointerEvent<HTMLButtonElement>, item: TodoItem) {
      event.stopPropagation();
      const point = toCanvasPoint(event);
      dragRef.current = { type: "todo", id: item.id, dx: point.x - item.x, dy: point.y - item.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    // Use local dummy state for instant visual feedback on initial load
    const displayState = canvasState?.offset ? canvasState : initialCanvas;

    return (
      <div
        ref={canvasRef}
        className={`absolute inset-0 overflow-hidden bg-[#f1f1f1] ${
          activeTool === "hand" ? "cursor-grab active:cursor-grabbing" : activeTool === "text" ? "cursor-text" : "cursor-default"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleCanvasClick}
      >
        <div className="absolute inset-0 opacity-75 [background-image:radial-gradient(circle,#cecece_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(186,220,255,0.25),transparent_45%)]" />

        {activeBoard === "architecture" && (
          <ArchitectureFlow ref={architectureFlowRef} activeTool={activeTool} detected={detectedArchitecture} slug={slug} />
        )}

        {activeBoard === "inspiration" && <FullInspirationBoard slug={slug} project={project} user={user} />}

        <div
          className="absolute left-0 top-0 h-[4200px] w-[6200px] origin-top-left"
          style={{ transform: `translate(${displayState.offset.x}px, ${displayState.offset.y}px) scale(${displayState.zoom})` }}
        >
          {activeBoard === "design" && <DesignSystemBoard bundle={bundle} />}
          {false && activeBoard === "inspiration" && (
            <InspirationBoard
              items={displayState.inspiration}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              onItemPointerDown={startItemDrag}
            />
          )}
          {activeBoard === "progress" && (
            <ProgressBoard
              items={displayState.todos}
              bundle={bundle}
              detected={detectedArchitecture}
              onTodoPointerDown={startTodoDrag}
            />
          )}
          {displayState.annotations.map((annotation: TextAnnotation) => (
            <div
              key={annotation.id}
              className="absolute rounded-xl border border-[#d8d8d8] bg-white px-3 py-2 text-sm shadow-sm"
              style={{ left: annotation.x, top: annotation.y }}
              contentEditable
              suppressContentEditableWarning
            >
              {annotation.text}
            </div>
          ))}
        </div>

        {inlineVisible && (messages.length > 0 || isThinking) && (
          <InlineAIResponse messages={messages} isThinking={isThinking} onDismiss={() => setInlineVisible(false)} />
        )}
      </div>
    );
  }
);

function ArchitectureCanvas({
  nodes,
  edges,
  detected,
  connectingFrom,
  onNodePointerDown,
  activeTool,
}: {
  nodes: ArchNode[];
  edges: ArchEdge[];
  detected: string[];
  connectingFrom: string | null;
  onNodePointerDown: (event: PointerEvent<HTMLButtonElement>, node: ArchNode) => void;
  activeTool: ActiveTool;
}) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <marker id="arrow-head" markerHeight="10" markerWidth="10" orient="auto" refX="9" refY="3">
            <path d="M0,0 L0,6 L9,3 z" fill="#7f7f7f" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const a = nodeCenter(from);
          const b = nodeCenter(to);
          return (
            <g key={edge.id}>
              <path d={edgePath(from, to)} fill="none" stroke="#9a9a9a" strokeWidth="2" markerEnd="url(#arrow-head)" />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 8} textAnchor="middle" className="fill-[#666] text-[12px]">
                {edge.label}
              </text>
            </g>
          );
        })}
      </svg>

      <BoardIntro
        eyebrow="Visual Mapping"
        title="Architecture canvas"
        body={activeTool === "frame" ? "Connection mode active. Click a source node, then click the target node to create a flow." : "Drag nodes, pan the infinite canvas, create services, connect flows, and annotate decisions."}
      />

      {nodes.map((node) => (
        <motion.button
          key={node.id}
          layout
          transition={spring}
          onPointerDown={(event) => onNodePointerDown(event, node)}
          className={`absolute rounded-2xl border bg-white p-4 text-left shadow-[0_10px_28px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 ${
            connectingFrom === node.id ? "border-[#2563eb] ring-4 ring-blue-500/15" : "border-[#d7d7d7]"
          } ${activeTool === "hand" || activeTool === "select" || activeTool === "frame" ? "cursor-pointer" : ""}`}
          style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ backgroundColor: node.color }}>
              <MaterialIcon name={node.icon} size={22} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#181818]">{node.label}</span>
              <span className="mt-1 block truncate text-xs text-[#777]">{node.caption}</span>
            </span>
          </div>
        </motion.button>
      ))}

      <div className="absolute left-[1120px] top-[560px] w-[470px] rounded-2xl border border-[#d9d9d9] bg-white/92 p-5 shadow-sm backdrop-blur">
        <div className="text-xs font-semibold uppercase text-[#777]">Detected context</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {detected.map((item) => (
            <span key={item} className="rounded-full border border-[#dfdfdf] bg-[#f8f8f8] px-3 py-1.5 text-xs font-medium text-[#444]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignSystemBoard({ bundle }: { bundle?: ContextBundle }) {
  const ds = bundle?.bundle_data?.designSystem;
  const colors = Object.entries(ds?.colors || {
    background: "#ffffff",
    foreground: "#111827",
    primary: "#2563eb",
    secondary: "#f4f4f5",
    border: "#e4e4e7",
    accent: "#dbeafe",
  });
  const typography = Object.entries(ds?.typography || {
    display: "Instrument Serif",
    sans: "Inter",
    ai: "Average Sans",
    mono: "Geist Mono",
  });
  const radius = Object.entries(ds?.borderRadius || { sm: "6px", md: "8px", lg: "12px", xl: "16px" });

  return (
    <div className="absolute left-[120px] top-[80px] w-[1220px] rounded-3xl border border-[#dedede] bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#777]">shadcn-style system</p>
          <h2 className="mt-2 font-display text-5xl text-[#111]">Foundations and components</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666]">
            Tokens, reusable primitives, states, and motion rules that Vibro can hand to agents.
          </p>
        </div>
        <button className="rounded-lg bg-[#111] px-4 py-2 text-sm font-semibold text-white">Export tokens</button>
      </div>
      <div className="mt-8 grid grid-cols-[1.1fr_0.9fr] gap-6">
        <section className="rounded-2xl border border-[#e3e3e3] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Colors</h3>
            <span className="text-xs text-[#888]">{colors.length} tokens</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {colors.map(([name, value]) => (
              <div key={name} className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
                <div className="h-24" style={{ backgroundColor: value }} />
                <div className="p-3">
                  <div className="text-sm font-semibold text-[#222]">{name}</div>
                  <div className="mt-1 font-mono text-xs text-[#777]">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-6 rounded-2xl border border-[#e3e3e3] p-5">
          <TokenList title="Typography" items={typography} />
          <div>
            <h3 className="text-sm font-semibold">Radius</h3>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {radius.map(([name, value]) => (
                <div key={name} className="border border-[#e5e5e5] bg-[#f7f7f7] p-3 text-center text-xs text-[#666]" style={{ borderRadius: value }}>
                  <div className="font-semibold">{name}</div>
                  <div className="mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-2xl border border-[#e3e3e3] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Component previews</h3>
          <span className="text-xs text-[#888]">Button, input, card, tabs</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-5">
          <ComponentPreview title="Buttons">
            <button className="rounded-lg bg-[#111] px-4 py-2 text-sm font-semibold text-white">Primary</button>
            <button className="rounded-lg border border-[#dedede] px-4 py-2 text-sm font-semibold">Secondary</button>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold text-[#2563eb]">Ghost</button>
          </ComponentPreview>
          <ComponentPreview title="Inputs">
            <input className="h-10 w-full rounded-lg border border-[#dedede] px-3 text-sm outline-none focus:border-[#2563eb]" placeholder="Project name" />
          </ComponentPreview>
          <ComponentPreview title="Cards">
            <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
              <div className="text-sm font-semibold">Context bundle</div>
              <p className="mt-1 text-xs leading-5 text-[#666]">Versioned and ready for AI handoff.</p>
            </div>
          </ComponentPreview>
        </div>
      </section>
    </div>
  );
}

function InspirationBoard({
  items,
  selectedTab,
  onTabChange,
  onItemPointerDown,
}: {
  items: InspirationItem[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onItemPointerDown: (event: PointerEvent<HTMLButtonElement>, item: InspirationItem) => void;
}) {
  const tabs = ["Landing Page", "Dashboard", "Mobile App", "Components"];
  const filtered = items.filter((item) => item.tags.includes(selectedTab) || selectedTab === "Components");

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[120px] top-[70px] w-[880px] rounded-3xl border border-[#dedede] bg-white/92 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-medium text-[#777]">Inspiration Board</p>
        <h2 className="mt-2 font-display text-5xl text-[#111]">References and moodboards</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedTab === tab ? "bg-[#111] text-white" : "bg-[#f3f3f3] text-[#555] hover:bg-[#e9e9e9]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {filtered.map((item) => (
        <motion.button
          key={item.id}
          layout
          transition={spring}
          onPointerDown={(event) => onItemPointerDown(event, item)}
          className="absolute overflow-hidden rounded-2xl border border-[#dcdcdc] bg-white text-left shadow-[0_10px_28px_rgba(0,0,0,0.09)] transition hover:-translate-y-0.5"
          style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
        >
          <div className="h-[52%] border-b border-[#e5e5e5]" style={{ background: `linear-gradient(135deg, ${item.color}, #ffffff)` }}>
            <div className="flex h-full items-center justify-center text-[#111]/45">
              <MaterialIcon name={item.pinned ? "push_pin" : "image"} size={32} />
            </div>
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold text-[#202020]">{item.title}</div>
            <div className="mt-1 truncate text-xs text-[#777]">{item.url}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#f1f1f1] px-2 py-1 text-[10px] font-semibold text-[#555]">{tag}</span>
              ))}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function ProgressBoard({
  items,
  bundle,
  detected,
  onTodoPointerDown,
}: {
  items: TodoItem[];
  bundle?: ContextBundle;
  detected: string[];
  onTodoPointerDown: (event: PointerEvent<HTMLButtonElement>, item: TodoItem) => void;
}) {
  const decisions = bundle?.bundle_data?.decisionLog || [];

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[140px] top-[80px] w-[980px] rounded-3xl border border-[#dedede] bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-[#777]">Progress OS</p>
        <h2 className="mt-2 font-display text-5xl text-[#111]">Tasks, runs, and decisions</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666]">
          Track planning work, AI execution, context changes, and delivery health before code begins.
        </p>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {["Brief", "Architecture", "Design", "Handoff"].map((label, index) => (
            <div key={label} className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] p-4">
              <div className="text-xs font-semibold text-[#777]">{label}</div>
              <div className="mt-3 h-2 rounded-full bg-[#ececec]">
                <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: `${index === 0 ? 100 : index === 1 ? 72 : index === 2 ? 46 : 22}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {items.map((item) => (
        <motion.button
          key={item.id}
          layout
          transition={spring}
          onPointerDown={(event) => onTodoPointerDown(event, item)}
          className="absolute w-[280px] rounded-2xl border border-[#dedede] bg-white p-4 text-left shadow-[0_10px_28px_rgba(0,0,0,0.09)]"
          style={{ left: item.x, top: item.y }}
        >
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.status === "done" ? "bg-emerald-100 text-emerald-700" : item.status === "doing" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>
              {item.status}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#111] text-[10px] font-bold text-white">{item.owner}</span>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#222]">{item.title}</div>
        </motion.button>
      ))}
      <div className="absolute left-[1160px] top-[170px] w-[430px] rounded-2xl border border-[#dedede] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">System inventory</div>
          <span className="rounded-full bg-[#111] px-2 py-1 text-[10px] font-bold text-white">{detected.length} items</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {detected.map((item) => (
            <span key={item} className="rounded-full border border-[#dfdfdf] bg-[#f8f8f8] px-3 py-1.5 text-xs font-medium text-[#444]">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6 text-sm font-semibold">Decision log</div>
        <div className="mt-4 space-y-3">
          {(decisions.length ? decisions : [
            { category: "Architecture", decision: "Separate AI and workflow services", rationale: "Keeps realtime chat fast while Trigger handles long jobs.", file: "workspace" },
            { category: "Design", decision: "Canvas-first workspace", rationale: "Planning artifacts need spatial memory and direct manipulation.", file: "design" },
          ]).map((decision, index) => (
            <div key={`${decision.decision}-${index}`} className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-3">
              <span className="rounded-full bg-[#eef2ff] px-2 py-1 text-[10px] font-semibold text-[#4f46e5]">{decision.category}</span>
              <div className="mt-2 text-xs font-semibold text-[#222]">{decision.decision}</div>
              <p className="mt-1 text-xs leading-5 text-[#666]">{decision.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BoardIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="absolute left-[80px] top-[70px] w-[460px] rounded-2xl border border-[#d9d9d9] bg-white/92 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#777]">
        <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-3xl text-[#111]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#666]">{body}</p>
    </div>
  );
}

function TokenList({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map(([name, value]) => (
          <div key={name} className="flex items-center justify-between rounded-xl border border-[#e5e5e5] px-4 py-3">
            <span className="text-sm font-medium capitalize text-[#333]">{name}</span>
            <span className="text-sm text-[#777]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentPreview({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default BoardCanvas;
