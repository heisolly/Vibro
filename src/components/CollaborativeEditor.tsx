"use client";

import { useState } from "react";
import { useDocument, useUserPresence } from "@/hooks/useLiveblocks";

export function CollaborativeEditor() {
  const { setContent, setTitle, content } = useDocument();
  const { updateCursor, setSelectionColor, setIsTyping } = useUserPresence();
  const [localTitle, setLocalTitle] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTitle(value);
    setTitle(value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateCursor({ x: e.clientX, y: e.clientY });
  };

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = () => {
    setIsTyping(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg"
    >
      <input
        type="text"
        placeholder="Document Title"
        value={localTitle}
        onChange={handleTitleChange}
        className="w-full text-3xl font-bold mb-4 p-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500"
      />

      <div className="mb-4 flex gap-2">
        {["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"].map((color) => (
          <button
            key={color}
            onClick={() => setSelectionColor(color)}
            className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-600"
            style={{ backgroundColor: color }}
            title={`Select color ${color}`}
          />
        ))}
      </div>

      <textarea
        placeholder="Start typing..."
        value={content || ""}
        onChange={handleContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full h-96 p-4 border-2 border-gray-200 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
      />
    </div>
  );
}
