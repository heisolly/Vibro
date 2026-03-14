"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

interface InstallPromptProps {
  slug: string;
}

export default function InstallPrompt({ slug }: InstallPromptProps) {
  // Use a stable initial state to avoid hydration mismatch
  const [installLink, setInstallLink] = useState(`https://vibro.com/extract/${slug}-stable-init`);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setInstallLink(`https://vibro.com/extract/${slug}-${Math.random().toString(36).substring(7)}`);
      setIsGenerating(false);
    }, 800);
  };

  const command = `vibro pull ${installLink}`;

  return (
    <div className="flex flex-col gap-6 rounded-[2rem] border-[3.5px] border-black bg-white p-8 shadow-[8px_8px_0_rgba(184,247,36,1)]">
      <div className="flex items-center justify-between border-b-[2.5px] border-black/5 pb-4">
        <h3 className="text-xs font-[1000] text-black uppercase tracking-[0.2em]">Extraction_String</h3>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="text-[10px] font-black text-[#8fcc00] hover:text-black transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {isGenerating ? "RE-EXTRACTING..." : "REFRESH_ID"}
        </button>
      </div>

      <div className="group relative mt-2">
        <div className="relative flex items-center justify-between gap-4 rounded-xl border-[2.5px] border-black bg-[#F3F2EE] px-5 py-4 shadow-[4px_4px_0_rgba(0,0,0,1)] group-hover:bg-white transition-colors">
          <code className="text-[14px] text-black font-mono font-black line-clamp-1">
            {command}
          </code>
          <CopyButton text={command} />
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 font-bold leading-relaxed italic">
        "This dynamic hash contains your architectural overrides. Execute via the Vibro CLI to initiate local synthesis."
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 rounded-xl border-[2.5px] border-black bg-[#FAFAF8] p-4 shadow-[3px_3px_0_rgba(0,0,0,1)]">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stability</span>
          <span className="text-xs font-black text-black">V1.0.4 — PRO</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border-[2.5px] border-black bg-[#FAFAF8] p-4 shadow-[3px_3px_0_rgba(0,0,0,1)]">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payload</span>
          <span className="text-xs font-black text-black">4.2 KB (RAW)</span>
        </div>
      </div>
    </div>
  );
}
