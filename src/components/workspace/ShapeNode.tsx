"use client";

import React, { useEffect, useRef, useState } from "react";
import { Handle, type Node, type NodeProps, NodeResizer, NodeToolbar, Position } from "@xyflow/react";

export type ShapeNodeData = {
  label: string;
  shape: "rectangle" | "circle" | "diamond" | "database" | "hexagon";
  color: string;
  width?: number;
  height?: number;
  onChange?: (newData: ShapeNodeData) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
};

const COLORS = ["#111827", "#2563eb", "#7c3aed", "#0891b2", "#059669", "#ea580c", "#dc2626"];

function getShapeSVG(shape: ShapeNodeData["shape"], color: string) {
  const stroke = color;
  const fill = `${color}15`;
  const strokeWidth = 3;

  switch (shape) {
    case "rectangle":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="96" height="96" rx="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "circle":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="50" rx="48" ry="48" fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "diamond":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,2 98,50 50,98 2,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "hexagon":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="25,2 75,2 98,50 75,98 25,98 2,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "database":
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2,20 C2,0 98,0 98,20 L98,80 C98,100 2,100 2,80 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
          <path d="M2,20 C2,40 98,40 98,20" fill="none" stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
  }
}

export default function ShapeNode({ id, data, selected }: NodeProps<Node<ShapeNodeData, "shape">>) {
  const [isEditing, setIsEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(data.label);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync state if label changes externally and we are not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalLabel(data.label);
    }
  }, [data.label, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const onColorChange = (color: string) => {
    data.onChange?.({ ...data, color });
  };

  const commitLabelChange = () => {
    setIsEditing(false);
    if (localLabel !== data.label) {
      data.onChange?.({ ...data, label: localLabel });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitLabelChange();
    }
    if (e.key === "Escape") {
      setLocalLabel(data.label); // Revert changes
      setIsEditing(false);
    }
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center group"
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-2 !border-[#111] !bg-white opacity-0 transition-opacity group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-2 !border-[#111] !bg-white opacity-0 transition-opacity group-hover:opacity-100" />
      <Handle type="target" position={Position.Bottom} className="!h-2 !w-2 !border-2 !border-[#111] !bg-white opacity-0 transition-opacity group-hover:opacity-100" />
      <Handle type="source" position={Position.Left} className="!h-2 !w-2 !border-2 !border-[#111] !bg-white opacity-0 transition-opacity group-hover:opacity-100" />

      <NodeResizer
        color={data.color}
        isVisible={selected}
        minWidth={60}
        minHeight={60}
        lineStyle={{ borderWidth: 2 }}
        handleStyle={{ width: 10, height: 10, borderRadius: 2, border: "2px solid #fff", backgroundColor: data.color }}
        onResizeStart={data.onResizeStart}
        onResizeEnd={data.onResizeEnd}
      />
      
      <NodeToolbar isVisible={selected} position={selected ? undefined : undefined} className="flex gap-2 rounded-xl border border-[#d9d9d9] bg-white/95 p-2 shadow-lg backdrop-blur">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${data.color === color ? "scale-110 border-[#111] shadow-md" : "border-white"}`}
            style={{ backgroundColor: color, boxShadow: data.color === color ? "0 0 0 1px #d4d4d4" : "0 1px 3px rgba(0,0,0,0.1)" }}
          />
        ))}
      </NodeToolbar>

      <div className="absolute inset-0 pointer-events-none">
        {getShapeSVG(data.shape, data.color)}
      </div>

      <div className="relative z-10 w-full px-4 text-center">
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={commitLabelChange}
            className="w-full resize-none bg-transparent text-center text-sm font-bold outline-none"
            style={{ color: data.color }}
            rows={localLabel.split("\n").length || 1}
          />
        ) : (
          <div
            className="cursor-text whitespace-pre-wrap text-sm font-bold"
            style={{ color: data.color }}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {data.label || "Double click to edit"}
          </div>
        )}
      </div>
    </div>
  );
}
