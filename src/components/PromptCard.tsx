"use client";

import Link from "next/link";
import { Prompt } from "@/lib/types";
import LazyPreview from "@/components/LazyPreview";
import { Eye, Heart, ArrowUpRight } from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  // Use mock meta data for the premium look
  const views = Math.floor(Math.random() * 90) + 10;
  const saves = Math.floor(Math.random() * 12);

  return (
    <Link
      href={`/prompt/${prompt.slug}`}
      className="group flex flex-col space-y-4 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/11] rounded-[32px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 transition-all duration-500 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)] group-hover:-translate-y-1.5">
        <LazyPreview 
          slug={prompt.slug} 
          className="h-full w-full opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
        />
        
        {/* Overlay for Extract (Hover Only) */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
           <div className="bg-white dark:bg-zinc-100 text-black px-7 py-3 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
              Preview <ArrowUpRight className="w-4 h-4" />
           </div>
        </div>

        <div className="absolute top-5 left-5 flex gap-2">
          {prompt.featured && (
            <span className="bg-zinc-900/90 dark:bg-white/90 backdrop-blur-md text-[9px] font-black uppercase text-white dark:text-zinc-900 px-3.5 py-1.5 rounded-full tracking-widest border border-white/10 dark:border-black/5 shadow-xl">
               FEATURED
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4 px-1.5 pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-[15px] text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{prompt.title} Showcase...</h3>
          <span className="bg-zinc-100 dark:bg-white/5 text-[9px] font-black uppercase px-2 py-0.5 rounded-md text-zinc-400 dark:text-zinc-500 tracking-wider border border-zinc-200/50 dark:border-white/5">v1.1</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-[11px] text-zinc-400 font-bold shadow-sm">V</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate max-w-[80px]">Vibro Agent</span>
              <span className="text-[10px] text-zinc-400">Architect</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span className="text-[11px] font-bold">{views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              <span className="text-[11px] font-bold">{saves}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
