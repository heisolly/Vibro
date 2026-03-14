"use client";

import Link from "next/link";
import { Category } from "@/lib/types";
import LazyPreview from "@/components/LazyPreview";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  expanded?: boolean;
  previewSlugs?: string[];
}

export default function CategoryCard({ category, expanded, previewSlugs = [] }: CategoryCardProps) {
  if (!expanded) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className="group relative flex items-center gap-5 rounded-3xl border border-zinc-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-100 active:translate-y-0 active:shadow-none"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-blue-500/10">
          {category.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-white tracking-tight leading-none mb-1.5 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
            {category.count} Sets
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 text-zinc-400 transition-all duration-300 group-hover:rotate-12 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-600/20">
          <ArrowUpRight className="h-4.5 w-4.5" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_32px_80px_rgba(0,0,0,0.3)]"
    >
      {previewSlugs.length > 0 && (
        <div className="relative h-60 w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-white/5">
          <div className="flex h-full w-full">
            {previewSlugs.map((slug, i) => (
              <div key={slug} className="relative flex-1 overflow-hidden border-r border-zinc-100/50 dark:border-white/5 last:border-0">
                <LazyPreview slug={slug} className="h-full w-full opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 dark:from-black/40 to-transparent pointer-events-none" />
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-white/90 dark:bg-black/80 backdrop-blur-md text-zinc-900 dark:text-white px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 dark:border-white/10 shadow-xl">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
             Live Preview
          </div>
        </div>
      )}

      <div className="flex flex-col p-9 space-y-7">
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 text-3xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-xl group-hover:shadow-blue-500/10">
            {category.icon}
          </div>
          <span className="bg-blue-50 dark:bg-blue-500/10 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20 tracking-widest">
            {category.count} ARCHITECTURES
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-[13px] font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {category.description}
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between group-hover:border-blue-500/20 transition-colors">
          <div className="flex gap-1.5">
             {[1,2,3].map(i => <div key={i} className={`h-1.5 w-1.5 rounded-full ${i===1? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800'}`} />)}
          </div>
          <span className="flex items-center gap-2 text-[11px] font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em] transition-all group-hover:text-blue-600 group-hover:translate-x-1">
            Explore
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
