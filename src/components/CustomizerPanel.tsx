"use client";

import { useState } from "react";

export default function CustomizerPanel() {
  const [accent, setAccent] = useState("vibro-primary");
  const [rounded, setRounded] = useState("xl");

  const colors = [
    { id: "vibro-primary", class: "bg-[#b8f724]" },
    { id: "cyan", class: "bg-cyan-400" },
    { id: "indigo", class: "bg-indigo-500" },
    { id: "emerald", class: "bg-emerald-500" },
    { id: "amber", class: "bg-amber-500" },
  ];

  return (
    <div className="flex flex-col gap-8 rounded-[2rem] border-[3.5px] border-black bg-white p-8 shadow-[8px_8px_0_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3">
         <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-black bg-[#F3F2EE] shadow-[3px_3px_0_rgba(0,0,0,1)]">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
           </svg>
         </div>
         <h3 className="text-xs font-[1000] text-black uppercase tracking-[0.2em]">Global_Overrides</h3>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black text-zinc-400 subtitle-caps uppercase tracking-widest">Architectural_Hue</span>
          <div className="flex gap-4">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setAccent(c.id)}
                className={`h-10 w-10 rounded-xl border-[2.5px] border-black transition-all ${c.class} ${
                  accent === c.id ? "scale-110 shadow-[4px_4px_0_rgba(0,0,0,1)]" : "opacity-40 hover:opacity-100 hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black text-zinc-400 subtitle-caps uppercase tracking-widest">Radius_Profile</span>
          <div className="grid grid-cols-3 gap-3">
            {["none", "xl", "3xl"].map((r) => (
              <button
                key={r}
                onClick={() => setRounded(r)}
                className={`rounded-xl border-[2.5px] px-3 py-3 text-[10px] font-black transition-all uppercase tracking-tighter ${
                  rounded === r 
                    ? "border-black bg-black text-[#b8f724] shadow-[4px_4px_0_rgba(184,247,36,1)]" 
                    : "border-black/10 bg-[#FAFAF8] text-zinc-400 hover:border-black hover:text-black"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black text-zinc-400 subtitle-caps uppercase tracking-widest">Motion_Protocol</span>
          <label className="flex items-center justify-between cursor-pointer group rounded-xl border-[2.5px] border-black bg-[#FAFAF8] p-4 transition-all hover:bg-white">
            <span className="text-[11px] text-black font-black uppercase tracking-tight">Kinetic_Feedback</span>
            <div className="relative h-6 w-12 rounded-full border-[2.5px] border-black bg-zinc-200 transition-colors group-hover:bg-zinc-300">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-black transition-all peer-checked:translate-x-6 peer-checked:bg-[#b8f724]" />
              <div className="absolute inset-0 rounded-full peer-checked:bg-black transition-colors" />
              <div className="absolute left-1 top-1 h-2.5 w-2.5 rounded-full bg-black transition-all peer-checked:translate-x-6 peer-checked:bg-[#b8f724]" />
            </div>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t-[2.5px] border-black/5 text-[10px] text-zinc-500 font-bold italic text-center leading-relaxed">
        Real-time synthesis active. Changes are automatically encoded into the extraction string.
      </div>
    </div>
  );
}
