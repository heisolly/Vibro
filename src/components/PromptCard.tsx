"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Prompt } from "@/lib/types";
import LazyPreview from "@/components/LazyPreview";
import { Eye, Heart, ArrowUpRight } from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
}

/**
 * PromptCard - Brutalist Edition
 * High contrast, sharp edges, hard shadows.
 */
export default function PromptCard({ prompt }: PromptCardProps) {
  const [stats, setStats] = useState({ views: 0, saves: 0 });

  useEffect(() => {
    setStats({
      views: Math.floor(Math.random() * 90) + 10,
      saves: Math.floor(Math.random() * 12)
    });
  }, []);

  const { views, saves } = stats;

  return (
    <Link
      href={`/prompt/${prompt.slug}`}
      className="group flex flex-col space-y-0 cursor-pointer font-space-grotesk bg-white border-[3px] border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_#C6FF3D] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none"
    >
      {/* Image Container (Sharp) */}
      <div className="relative aspect-[16/11] border-b-[3px] border-black overflow-hidden bg-white">
        <LazyPreview 
          slug={prompt.slug} 
          className="h-full w-full opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0" 
        />
        
        {/* Overlay for Extract (Hover Only) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
           <div className="bg-[#C6FF3D] text-black px-6 py-2.5 border-[2px] border-black font-[900] text-[12px] uppercase tracking-widest flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-[4px_4px_0_rgba(0,0,0,1)]">
              Preview <ArrowUpRight className="w-4 h-4" />
           </div>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          {prompt.featured && (
            <span className="bg-black text-[#C6FF3D] text-[10px] font-black uppercase px-3 py-1 border-[2px] border-black tracking-widest shadow-[4px_4px_0_rgba(0,0,0,1)]">
               FEATURED
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-[900] text-[17px] text-black tracking-tighter leading-tight uppercase">
            {prompt.title} Showcase
          </h3>
          <span className="bg-zinc-100 text-[10px] font-black uppercase px-2 py-0.5 border border-black/10 tracking-wider">v1.1</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-black border-[2px] border-black flex items-center justify-center text-[12px] text-[#C6FF3D] font-black shadow-[2px_2px_0_rgba(0,0,0,0.1)]">V</div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-black uppercase tracking-tight">Vibro Agent</span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase italic -mt-0.5">Architect</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-black">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[12px] font-black">{views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[12px] font-black">{saves}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
