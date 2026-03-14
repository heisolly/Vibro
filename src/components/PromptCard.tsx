import Link from "next/link";
import { Prompt } from "@/lib/types";
import LazyPreview from "@/components/LazyPreview";

interface PromptCardProps {
  prompt: Prompt;
}

// Hardcoded stable version to fix hydration mismatch
export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link
      href={`/prompt/${prompt.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border-[3.5px] border-black bg-white transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0_rgba(184,247,36,1)] active:translate-y-0 active:shadow-none"
    >
      {/* Preview area */}
      <div className="relative h-56 overflow-hidden bg-[#F3F2EE] border-b-[3.5px] border-black">
        <LazyPreview slug={prompt.slug} className="h-full w-full opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110" />
        
        {/* Overlay on hover — Brutalist Centered Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-3 rounded-2xl bg-black border-[3px] border-white px-8 py-3 text-[11px] font-black text-[#b8f724] shadow-[6px_6px_0_rgba(255,255,255,1)] transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 uppercase tracking-widest">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            EXTRACT
          </div>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          {prompt.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#b8f724] border-[2.5px] border-black px-3 py-1 text-[10px] font-black text-black shadow-[3px_3px_0_rgba(0,0,0,1)]">
              PREMIUM
            </span>
          )}
          <span 
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border-[2.5px] border-black px-3 py-1 text-[10px] font-black text-black shadow-[3px_3px_0_rgba(0,0,0,1)] uppercase tracking-tighter"
            suppressHydrationWarning
          >
            v1.0
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-[1000] text-black group-hover:text-[#8fcc00] transition-colors tracking-[calc(-0.04em)] uppercase leading-[1.1]">
            {prompt.title}
          </h3>
        </div>
        
        <p className="mt-4 line-clamp-2 text-[14px] font-bold text-zinc-500 leading-relaxed italic">
          "{prompt.description}"
        </p>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-xl border-[2.5px] border-black bg-[#FAFAF8] px-3.5 py-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-[3px_3px_0_rgba(0,0,0,1)]"
            >
              #{tag}
            </span>
          ))}
          <div className="ml-auto flex h-3 w-3 rounded-full bg-[#b8f724] border-2 border-black animate-pulse" />
        </div>
      </div>
    </Link>
  );
}
