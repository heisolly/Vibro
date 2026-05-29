"use client";

import React, { useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/vibro/ui";

interface ArchitectureContextMenuProps {
  id: string;
  top: number;
  left: number;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function ArchitectureContextMenu({
  id,
  top,
  left,
  onDuplicate,
  onDelete,
  onClose,
}: ArchitectureContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-48 overflow-hidden rounded-xl border border-[#d9d9d9] bg-white/95 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur"
      style={{ top, left }}
    >
      <div className="flex flex-col py-1.5">
        <button
          onClick={() => {
            onDuplicate(id);
            onClose();
          }}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[#333] hover:bg-[#f1f1f1]"
        >
          <MaterialIcon name="content_copy" size={16} />
          Duplicate
        </button>
        <div className="my-1 h-[1px] w-full bg-[#eee]" />
        <button
          onClick={() => {
            onDelete(id);
            onClose();
          }}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
        >
          <MaterialIcon name="delete" size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
