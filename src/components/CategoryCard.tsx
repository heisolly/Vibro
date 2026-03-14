import Link from "next/link";
import { Category } from "@/lib/types";
import LazyPreview from "@/components/LazyPreview";

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
        className="group relative flex items-center gap-5 rounded-[2rem] border-[3.5px] border-black bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(184,247,36,1)] active:translate-y-0 active:shadow-none"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F3F2EE] border-[2.5px] border-black text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          {category.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-[1000] text-black tracking-tighter uppercase leading-none mb-1">
            {category.name}
          </h3>
          <p className="text-[10px] font-black text-[#8fcc00] uppercase tracking-[0.2em]">
            {category.count} Architectures
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-black bg-black text-[#b8f724] transition-all group-hover:rotate-12">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border-[3.5px] border-black bg-white transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0_rgba(0,0,0,1)]"
    >
      {previewSlugs.length > 0 && (
        <div className="relative h-56 w-full overflow-hidden border-b-[3.5px] border-black bg-[#F3F2EE]">
          <div className="flex h-full w-full">
            {previewSlugs.map((slug, i) => (
              <div key={slug} className="relative flex-1 overflow-hidden border-r-[2.5px] border-black/10 last:border-0">
                <LazyPreview slug={slug} className="h-full w-full opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[3px_3px_0_rgba(184,247,36,1)]">
             <div className="w-1.5 h-1.5 rounded-full bg-[#b8f724] animate-pulse" />
             Live_Preview
          </div>
        </div>
      )}

      <div className="flex flex-col p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#FAFAF8] border-[3px] border-black text-4xl shadow-[5px_5px_0_rgba(0,0,0,1)] transition-transform group-hover:scale-110 group-hover:-rotate-3">
            {category.icon}
          </div>
          <div className="text-right">
             <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Density</div>
             <span className="rounded-xl border-[2.5px] border-black bg-[#b8f724] px-4 py-1.5 text-[11px] font-[1000] text-black uppercase tracking-tighter shadow-[3px_3px_0_rgba(0,0,0,1)]">
               {category.count} SETS
             </span>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-[1000] text-black tracking-[calc(-0.04em)] uppercase leading-none transition-colors group-hover:text-[#8fcc00]">
            {category.name}
          </h3>
          <p className="mt-5 text-[15px] font-bold leading-relaxed text-zinc-500 italic">
            "{category.description}"
          </p>
        </div>

        <div className="mt-12 flex items-center justify-between border-t-[3px] border-black/5 pt-10">
          <div className="flex gap-1.5">
             {[1,2,3].map(i => <div key={i} className={`h-2.5 w-2.5 rounded-full border-2 border-black ${i===1? 'bg-[#b8f724]' : 'bg-black/5'}`} />)}
          </div>
          <span className="flex items-center gap-3 text-xs font-black text-black uppercase tracking-[0.2em] transition-all group-hover:tracking-[0.3em]">
            EXPLORE
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-[#b8f724]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
}
