"use client";

import { useState, useCallback } from "react";
import type { VibroBoard, VibroProject, VibroUser } from "@/lib/vibro";
import type { ContextBundle } from "@/lib/github-types";
import { MaterialIcon } from "@/components/vibro/ui";
import WorkspaceHeader from "./WorkspaceHeader";
import SidebarTools from "./SidebarTools";
import BoardCanvas from "./BoardCanvas";
import AIInputBar from "./AIInputBar";
import RightPanel from "./RightPanel";
import FloatingChat from "./FloatingChat";

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
  const [rightOpen, setRightOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const handleSend = useCallback(
    (text: string) => {
      onSendToAI(text);
      if (!chatOpen) setChatOpen(true);
    },
    [onSendToAI, chatOpen]
  );

  return (
    <div className="h-screen bg-white text-[#333] overflow-hidden">
      <WorkspaceHeader
        activeBoard={activeBoard}
        onBoardChange={setActiveBoard}
        user={user}
        onToggleChat={() => setRightOpen((o) => !o)}
        chatOpen={rightOpen}
      />

      <SidebarTools activeBoard={activeBoard} />

      <div
        className="absolute"
        style={{
          top: 48,
          left: 48,
          right: rightOpen ? 300 : 0,
          bottom: 0,
        }}
      >
        <BoardCanvas activeBoard={activeBoard} bundles={bundles} slug={slug} project={project} user={user} />

        {!chatOpen && messages.length === 0 && (
          <button
            onClick={() => setChatOpen(true)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-[#E0E0E0] bg-white shadow-lg px-5 py-2.5 text-sm font-medium text-[#555] hover:text-[#333] hover:bg-[#F5F5F5] transition"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#EEF2FF] text-[#6366F1]">
              <MaterialIcon name="auto_awesome" size={14} />
            </span>
            Open AI Chat
          </button>
        )}

        <FloatingChat
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          messages={messages}
          isThinking={isThinking}
          onSend={handleSend}
        />

        <AIInputBar onSend={handleSend} disabled={isThinking} rightOpen={rightOpen} activeBoard={activeBoard} />
      </div>

      <RightPanel open={rightOpen} onToggle={() => setRightOpen((o) => !o)} bundles={bundles} activeBoard={activeBoard} />
    </div>
  );
}
