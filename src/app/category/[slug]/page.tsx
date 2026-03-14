import { notFound } from "next/navigation";
import { getCategoryBySlug, getPromptsByCategory, getAllCategories } from "@/lib/queries";
import PromptCard from "@/components/PromptCard";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | Vibro_Architectures`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryPrompts = await getPromptsByCategory(slug);


  return (
    <div className="relative min-h-screen bg-[#FAFAF8] bg-dot-pattern">
      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-black">CORE</Link>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <Link href="/categories" className="transition hover:text-black">LIBRARY</Link>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <span className="text-black">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-24 flex flex-col items-start gap-10 md:flex-row md:items-end">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border-[4px] border-black bg-white text-5xl shadow-[8px_8px_0_rgba(184,247,36,1)] transition-transform hover:-rotate-3">
            {category.icon}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-4">
               <h1 className="text-6xl font-[1000] tracking-tighter text-black uppercase leading-none">{category.name}</h1>
               <div className="rounded-full bg-black px-4 py-1.5 text-[10px] font-black text-[#b8f724] uppercase tracking-widest shadow-[3px_3px_0_rgba(184,247,36,1)]">
                 {categoryPrompts.length} ARCHIVES
               </div>
            </div>
            <p className="text-xl font-bold text-zinc-500 italic max-w-3xl leading-relaxed">
              "{category.description}"
            </p>
          </div>
        </div>

        {/* Results */}
        {categoryPrompts.length === 0 ? (
          <div className="rounded-[4rem] border-[4.5px] border-black bg-white p-32 text-center shadow-[20px_20px_0_rgba(0,0,0,1)]">
            <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 border-[3px] border-black text-4xl">
              📂
            </div>
            <p className="text-3xl font-[1000] text-black mb-4 uppercase tracking-tighter">Empty_Archive</p>
            <p className="text-lg font-bold text-zinc-400 mb-12 italic">The AI agents have not yet synthesized components for this sector.</p>
            <Link href="/categories" className="brutal-btn-primary">
              ← Return to Library
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryPrompts.map((prompt, idx) => (
              <div key={prompt.id} className="animate-item" style={{ animationDelay: `${idx * 50}ms`, opacity: 1, transform: 'none' }}>
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
