import { getAllCategories, getAllPrompts } from "@/lib/queries";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vibro_Library_v2",
  description: "Browse the Vibro component library. Sidebars, Buttons, Cards, Footers, and more.",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  const allPrompts = await getAllPrompts();
  const totalPrompts = allPrompts.length;
  const totalCategories = categories.length;

  const promptsByCategory = new Map<string, string[]>();
  for (const p of allPrompts) {
    const existing = promptsByCategory.get(p.categorySlug) || [];
    existing.push(p.slug);
    promptsByCategory.set(p.categorySlug, existing);
  }

  return (
    <div className="relative min-h-screen bg-[#F3F2EE] bg-grid-pattern transition-colors">
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-32 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-32 relative">
          <div className="animate-item mb-10 inline-flex items-center gap-3 rounded-2xl border-[3px] border-black bg-white px-6 py-2 shadow-[5px_5px_0_rgba(0,0,0,1)]">
            <div className="w-2 h-2 rounded-full bg-[#b8f724] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
              Global_Collection_Access
            </span>
          </div>
          <h1 className="text-7xl sm:text-9xl font-black tracking-[calc(-0.06em)] text-black mb-8 leading-[0.8]">
            THE <br /><span className="text-white [-webkit-text-stroke:3px_black]">LIBRARY.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-bold leading-relaxed text-zinc-500 italic">
            Synthesizing {totalPrompts} production-grade architectures across {totalCategories} sectors. 
            Select a node to begin the extraction process.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 animate-item">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="transition-all" style={{ transitionDelay: `${idx * 100}ms` }}>
              <CategoryCard
                category={cat}
                expanded
                previewSlugs={(promptsByCategory.get(cat.slug) || []).slice(0, 3)}
              />
            </div>
          ))}
        </div>

        {/* Custom Request CTA */}
        <div className="mt-32 relative rounded-[4rem] border-[4.5px] border-black bg-black p-16 text-center overflow-hidden shadow-[30px_30px_0_rgba(184,247,36,0.3)]">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#b8f724]/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
           <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Missing a <span className="text-[#8fcc00]">Component?</span></h2>
              <p className="text-zinc-500 mb-12 max-w-xl mx-auto font-bold text-lg">
                Our AI agents are constantly synthesizing new patterns. If you need a specific architecture, let us know and we'll add it to the next batch.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Link 
                  href="/generator" 
                  className="inline-flex h-16 items-center justify-center rounded-2xl bg-[#b8f724] border-[3.5px] border-black px-10 text-sm font-black text-black transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(0,0,0,1)]"
                >
                  Start Building Custom
                </Link>
                <Link 
                  href="/" 
                  className="inline-flex h-16 items-center justify-center rounded-2xl bg-black border-[3.5px] border-[#333] px-10 text-sm font-black text-white transition-all hover:bg-zinc-900"
                >
                  Return to Matrix
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
