"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PromptCard from "@/components/PromptCard";
import { Prompt } from "@/lib/types";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Prompt[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => res.json())
      .then((data) => {
        setAllPrompts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allPrompts);
      return;
    }
    const q = query.toLowerCase().trim();
    setResults(
      allPrompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.categorySlug.toLowerCase().includes(q)
      )
    );
  }, [query, allPrompts]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) setQuery(q);
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-[#FAFAF8] bg-dot-pattern pt-12 pb-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-24">
           <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border-[3px] border-black bg-white px-6 py-2 shadow-[5px_5px_0_rgba(0,0,0,1)]">
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
                Query_Protocol_v2.0
              </span>
            </div>
          <h1 className="text-7xl sm:text-9xl font-[1000] tracking-[calc(-0.06em)] text-black mb-8 leading-[0.8] uppercase">
            FIND <br /><span className="text-white [-webkit-text-stroke:3px_black]">ARCHIVE.</span>
          </h1>
          <p className="text-xl font-bold text-zinc-500 italic max-w-2xl mx-auto">
            "Searching over {allPrompts.length} primary architectures in the Vibro collective. Specify your parameters below."
          </p>
        </div>

        <div className="mb-20 flex justify-center sticky top-24 z-30">
          <div className="relative w-full max-w-4xl group">
             <div className="absolute -inset-2 rounded-[2.5rem] bg-[#b8f724] opacity-0 group-focus-within:opacity-100 transition-opacity blur shadow-[0_0_40px_rgba(184,247,36,0.3)]" />
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Extract component by name, sector, or signature..."
                className="w-full rounded-[2rem] border-[4px] border-black bg-white px-10 py-6 pl-20 text-xl font-black text-black placeholder-zinc-300 outline-none transition-all shadow-[12px_12px_0_rgba(0,0,0,1)] focus:-translate-y-1 focus:shadow-[16px_16px_0_rgba(184,247,36,1)]"
              />
              <svg className="absolute left-8 top-1/2 h-8 w-8 -translate-y-1/2 text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
             <div className="h-16 w-16 border-[6px] border-black border-t-[#b8f724] rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-[4rem] border-[4.5px] border-black bg-white p-32 text-center shadow-[20px_20px_0_rgba(0,0,0,1)] max-w-4xl mx-auto">
             <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#FAFAF8] border-[3px] border-black text-5xl mx-auto mb-10 shadow-[6px_6px_0_rgba(0,0,0,1)]">
              🔍
            </div>
            <p className="text-4xl font-[1000] text-black mb-4 uppercase tracking-tighter italic">
              Null_Reference_Error
            </p>
            <p className="text-xl font-bold text-zinc-400 mb-12 italic leading-relaxed">
              We couldn't synthesize any architectures matching <span className="text-black font-[1000] underline decoration-[#b8f724] decoration-8 underline-offset-4">"{query}"</span>.
            </p>
            <button
              onClick={() => setQuery("")}
              className="brutal-btn-primary"
            >
              Clear Extraction Params
            </button>
          </div>
        ) : (
          <div className="animate-item" style={{ opacity: 1, transform: 'none' }}>
            <div className="mb-14 flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                 <div className="h-3 w-3 rounded-full bg-[#b8f724] border-2 border-black" />
                 <p className="text-xs font-[1000] text-black uppercase tracking-[0.3em]">
                   IDENTIFIED {results.length} NODES
                 </p>
              </div>
              <div className="h-1 flex-1 mx-10 bg-black/5 rounded-full" />
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((prompt, idx) => (
                <div key={prompt.id} className="animate-item" style={{ animationDelay: `${idx * 50}ms`, opacity: 1, transform: 'none' }}>
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#FAFAF8]">
           <div className="h-16 w-16 border-[6px] border-black border-t-[#b8f724] rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
