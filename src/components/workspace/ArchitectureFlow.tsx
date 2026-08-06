"use client";

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import CustomEdge from "./CustomEdge";
import ArchitectureContextMenu from "./ArchitectureContextMenu";
import ShapeNode, { ShapeNodeData } from "./ShapeNode";
import { useWorkspaceState } from "@/hooks/useWorkspaceState";
import { type ActiveTool } from "./types";
import { mergeArchitectureFlows } from "@/lib/architecture-flow-mapper";

export type ArchitectureNode = Node<ShapeNodeData, "shape">;
export type ArchitectureEdge = Edge<{ label?: string }>;

export type FlowState = {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};

export interface ArchitectureFlowHandle {
  undo: () => void;
  redo: () => void;
}

interface ArchitectureFlowProps {
  activeTool: ActiveTool;
  detected: string[];
  slug: string;
}

const initialNodes: ArchitectureNode[] = [
  { id: "user", type: "shape", position: { x: 200, y: 250 }, data: { label: "User", shape: "circle", color: "#2563eb" }, style: { width: 140, height: 140 } },
  { id: "frontend", type: "shape", position: { x: 450, y: 250 }, data: { label: "Client App", shape: "rectangle", color: "#111827" }, style: { width: 180, height: 80 } },
  { id: "gateway", type: "shape", position: { x: 750, y: 250 }, data: { label: "API Gateway", shape: "diamond", color: "#d97706" }, style: { width: 140, height: 140 } },
  { id: "database", type: "shape", position: { x: 1050, y: 150 }, data: { label: "Database", shape: "database", color: "#059669" }, style: { width: 140, height: 160 } },
];

const initialEdges: ArchitectureEdge[] = [
  { id: "e-user-frontend", source: "user", target: "frontend", label: "intent" },
  { id: "e-frontend-gateway", source: "frontend", target: "gateway", label: "request" },
  { id: "e-gateway-db", source: "gateway", target: "database", label: "query" },
].map((edge) => ({
  ...edge,
  type: "custom",
  animated: false,
  markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
  style: { stroke: "#8a8a8a", strokeWidth: 1.8 },
}));

export const defaultArchitectureFlow: FlowState = {
  nodes: initialNodes,
  edges: initialEdges,
};

const nodeTypes = {
  shape: ShapeNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const defaultEdgeOptions = {
  type: "custom",
  markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
  style: { stroke: "#8a8a8a", strokeWidth: 1.8 },
};

const SHAPE_COLORS: Record<string, string> = {
  rectangle: "#2563eb",
  circle: "#dc2626",
  diamond: "#d97706",
  database: "#059669",
  hexagon: "#7c3aed",
};

const SHAPE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  rectangle: { width: 180, height: 80 },
  circle: { width: 140, height: 140 },
  diamond: { width: 140, height: 140 },
  database: { width: 140, height: 160 },
  hexagon: { width: 160, height: 140 },
};

const shapeTypes = ["rectangle", "circle", "diamond", "database", "hexagon"] as const;
type ShapeType = typeof shapeTypes[number];
const isShapeTool = (tool: ActiveTool): tool is ShapeType => shapeTypes.includes(tool as any);

type ArchitectureApplyPayload = {
  id: string;
  mode: "replace" | "merge";
  flow: FlowState;
};

const ArchitectureFlow = forwardRef<ArchitectureFlowHandle, ArchitectureFlowProps>(
  function ArchitectureFlow({ activeTool, detected, slug }, ref) {
    const [instance, setInstance] = useState<ReactFlowInstance<ArchitectureNode, ArchitectureEdge> | null>(null);
    const [showMiniMap, setShowMiniMap] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ id: string; top: number; left: number } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { data: flow, update: saveFlow } = useWorkspaceState<FlowState>(slug, "architecture", defaultArchitectureFlow);
    const nodes = flow.nodes;
    const edges = flow.edges;

    const [past, setPast] = useState<FlowState[]>([]);
    const [future, setFuture] = useState<FlowState[]>([]);
    const appliedPayloadIdsRef = useRef(new Set<string>());

    const takeSnapshot = useCallback((currentNodes: ArchitectureNode[], currentEdges: ArchitectureEdge[]) => {
      setPast((prev) => {
        const last = prev[prev.length - 1];
        if (last && JSON.stringify(last.nodes) === JSON.stringify(currentNodes) && JSON.stringify(last.edges) === JSON.stringify(currentEdges)) return prev;
        return [...prev, { nodes: currentNodes, edges: currentEdges }];
      });
      setFuture([]);
    }, []);

    const undo = () => {
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      setPast((prev) => prev.slice(0, -1));
      setFuture((prev) => [{ nodes, edges }, ...prev]);
      saveFlow(previous);
    };

    const redo = () => {
      if (future.length === 0) return;
      const next = future[0];
      setPast((prev) => [...prev, { nodes, edges }]);
      setFuture((prev) => prev.slice(1));
      saveFlow(next);
    };

    useImperativeHandle(ref, () => ({ undo, redo }));

    const applyGeneratedFlow = useCallback((payload: ArchitectureApplyPayload) => {
      if (!payload?.id || appliedPayloadIdsRef.current.has(payload.id)) return;
      appliedPayloadIdsRef.current.add(payload.id);
      sessionStorage.removeItem(`vibro-pending-architecture:${slug}`);
      setPast((prev) => [...prev, { nodes, edges }]);
      setFuture([]);
      saveFlow((prev) => (payload.mode === "replace" ? payload.flow : mergeArchitectureFlows(prev || defaultArchitectureFlow, payload.flow)));
    }, [edges, nodes, saveFlow, slug]);

    useEffect(() => {
      function onApply(event: Event) {
        applyGeneratedFlow((event as CustomEvent<ArchitectureApplyPayload>).detail);
      }

      window.addEventListener("vibro:apply-architecture-flow", onApply);

      const stored = sessionStorage.getItem(`vibro-pending-architecture:${slug}`);
      if (stored) {
        try {
          applyGeneratedFlow(JSON.parse(stored) as ArchitectureApplyPayload);
        } catch {
          sessionStorage.removeItem(`vibro-pending-architecture:${slug}`);
        }
      }

      return () => window.removeEventListener("vibro:apply-architecture-flow", onApply);
    }, [applyGeneratedFlow, slug]);

    const dragStartStateRef = useRef<FlowState | null>(null);
    const resizeStartStateRef = useRef<FlowState | null>(null);

    const onNodeDragStart = useCallback(() => {
      dragStartStateRef.current = { nodes, edges };
    }, [nodes, edges]);

    const onNodeDragStop = useCallback(() => {
      if (dragStartStateRef.current) {
        const start = dragStartStateRef.current;
        const moved = JSON.stringify(start.nodes) !== JSON.stringify(nodes);
        if (moved) {
          setPast((prev) => [...prev, start]);
          setFuture([]);
        }
        dragStartStateRef.current = null;
      }
    }, [nodes]);

    const onResizeStart = useCallback(() => {
      resizeStartStateRef.current = { nodes, edges };
    }, [nodes, edges]);

    const onResizeEnd = useCallback(() => {
      if (resizeStartStateRef.current) {
        const start = resizeStartStateRef.current;
        const resized = JSON.stringify(start.nodes) !== JSON.stringify(nodes);
        if (resized) {
          setPast((prev) => [...prev, start]);
          setFuture([]);
        }
        resizeStartStateRef.current = null;
      }
    }, [nodes]);

    const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
      saveFlow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n)),
      }));
    }, [saveFlow]);

    const updateNodeData = useCallback((nodeId: string, newData: Partial<ShapeNodeData>) => {
      saveFlow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.id !== nodeId) return n;
          return { ...n, data: { ...n.data, ...newData } };
        }),
      }));
    }, [saveFlow]);

    const onNodesChange = useCallback((changes: NodeChange<ArchitectureNode>[]) => {
      saveFlow((prev) => {
        const hasRemove = changes.some((c) => c.type === "remove");
        if (hasRemove) takeSnapshot(prev.nodes, prev.edges);
        return { ...prev, nodes: applyNodeChanges(changes, prev.nodes) };
      });
    }, [saveFlow, takeSnapshot]);

    const onEdgesChange = useCallback((changes: EdgeChange<ArchitectureEdge>[]) => {
      saveFlow((prev) => {
        const hasRemove = changes.some((c) => c.type === "remove");
        if (hasRemove) takeSnapshot(prev.nodes, prev.edges);
        return { ...prev, edges: applyEdgeChanges(changes, prev.edges) };
      });
    }, [saveFlow, takeSnapshot]);

    const onConnect = useCallback((connection: Connection) => {
      saveFlow((prev) => {
        takeSnapshot(prev.nodes, prev.edges);
        return { ...prev, edges: addEdge({ ...connection, ...defaultEdgeOptions }, prev.edges) };
      });
    }, [saveFlow, takeSnapshot]);

    const onAddNode = useCallback((type: ActiveTool, position: { x: number; y: number }) => {
      if (!isShapeTool(type)) return;
      saveFlow((prev) => {
        takeSnapshot(prev.nodes, prev.edges);
        const dims = SHAPE_DIMENSIONS[type] || { width: 140, height: 140 };
        const newNode: ArchitectureNode = {
          id: crypto.randomUUID(),
          type: "shape",
          position: { x: position.x - dims.width / 2, y: position.y - dims.height / 2 },
          data: { label: "New Node", shape: type, color: SHAPE_COLORS[type] || "#2563eb" },
          style: dims,
        };
        return { ...prev, nodes: [...prev.nodes, newNode] };
      });
    }, [saveFlow, takeSnapshot]);

    const handlePaneClick = useCallback(() => {
      setContextMenu(null);
    }, []);

    const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: ArchitectureNode) => {
      event.preventDefault();
      setContextMenu({ id: node.id, top: event.clientY, left: event.clientX });
    }, []);

    const onPaneClick = useCallback((event: React.MouseEvent) => {
      handlePaneClick();
      if (!isShapeTool(activeTool) || !instance) return;
      onAddNode(activeTool, instance.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    }, [activeTool, instance, handlePaneClick, onAddNode]);

    const duplicateNode = useCallback((id: string) => {
      saveFlow((prev) => {
        takeSnapshot(prev.nodes, prev.edges);
        const node = prev.nodes.find((n) => n.id === id);
        if (!node) return prev;
        const newNode = { ...node, id: crypto.randomUUID(), position: { x: node.position.x + 40, y: node.position.y + 40 }, selected: false };
        return { ...prev, nodes: [...prev.nodes, newNode] };
      });
    }, [saveFlow, takeSnapshot]);

    const handleDelete = useCallback((id: string) => {
      saveFlow((prev) => {
        takeSnapshot(prev.nodes, prev.edges);
        return {
          ...prev,
          nodes: prev.nodes.filter((n) => n.id !== id),
          edges: prev.edges.filter((e) => e.source !== id && e.target !== id),
        };
      });
      setContextMenu(null);
    }, [saveFlow, takeSnapshot]);

    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      if (!instance || !wrapperRef.current) return;
      const dataStr = event.dataTransfer.getData("application/reactflow");
      if (!dataStr) return;
      try {
        const nodeData = JSON.parse(dataStr);
        const bounds = wrapperRef.current.getBoundingClientRect();
        const position = instance.screenToFlowPosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
        const shape: ShapeType = nodeData.shape || "rectangle";
        saveFlow((prev) => {
          takeSnapshot(prev.nodes, prev.edges);
          const newNode: ArchitectureNode = {
            id: crypto.randomUUID(),
            type: "shape",
            position,
            style: { width: nodeData.width, height: nodeData.height },
            data: { label: nodeData.label, shape, color: nodeData.color },
          };
          return { ...prev, nodes: [...prev.nodes, newNode] };
        });
      } catch {}
    }, [instance, saveFlow, takeSnapshot]);

    const cursorClass = useMemo(() => {
      if (activeTool === "hand") return "cursor-grab active:cursor-grabbing";
      if (isShapeTool(activeTool)) return "cursor-crosshair";
      if (activeTool === "frame") return "cursor-pointer";
      return "";
    }, [activeTool]);

    const memoEdgeUpdater = useMemo(() => ({
      updateNodeData,
      onResizeStart,
      onResizeEnd,
    }), [updateNodeData, onResizeStart, onResizeEnd]);

    return (
      <div ref={wrapperRef} className={`absolute inset-0 z-10 ${cursorClass}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setInstance}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          deleteKeyCode={["Backspace", "Delete"]}
          multiSelectionKeyCode="Shift"
          panOnDrag={activeTool === "hand"}
          panOnScroll
          zoomOnDoubleClick={false}
          fitView={false}
          minZoom={0.25}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#c8c8c8" />
          <Controls showInteractive={false} />
          {showMiniMap && <MiniMap />}
          <Panel position="top-right">
            <button
              onClick={() => setShowMiniMap((v) => !v)}
              className="rounded-lg border border-[#d7d7d7] bg-white px-3 py-1.5 text-xs font-medium text-[#555] shadow-sm hover:bg-[#f5f5f5]"
            >
              {showMiniMap ? "Hide" : "Show"} minimap
            </button>
          </Panel>
        </ReactFlow>
        {contextMenu && (
          <ArchitectureContextMenu
            id={contextMenu.id}
            top={contextMenu.top}
            left={contextMenu.left}
            onClose={() => setContextMenu(null)}
            onDuplicate={() => { duplicateNode(contextMenu.id); setContextMenu(null); }}
            onDelete={() => handleDelete(contextMenu.id)}
          />
        )}
      </div>
    );
  }
);

export default ArchitectureFlow;
