"use client";

import React, { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  animated,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return { ...edge, label: event.target.value };
        }
        return edge;
      })
    );
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: animated ? "#2563eb" : "#8a8a8a",
        }}
        className={animated ? "react-flow__edge-path animated" : ""}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <input
              autoFocus
              value={label as string || ""}
              onChange={onLabelChange}
              onKeyDown={onKeyDown}
              onBlur={() => setIsEditing(false)}
              className="rounded-md border border-blue-500 bg-white px-2 py-0.5 text-xs font-semibold text-[#333] shadow-sm outline-none"
              style={{ width: Math.max(60, (label as string || "").length * 8 + 20) }}
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="cursor-text rounded-full border border-[#e5e5e5] bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#555] shadow-sm transition hover:border-[#cfcfcf] hover:text-[#222]"
            >
              {label || "flow"}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
