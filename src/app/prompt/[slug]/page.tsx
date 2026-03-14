import { notFound } from "next/navigation";
import { getPromptBySlug, getCategoryBySlug, getPromptsByCategory, getAllPrompts } from "@/lib/queries";
import CopyButton from "@/components/CopyButton";
import PromptCard from "@/components/PromptCard";
import PreviewFrame from "@/components/PreviewFrame";
import PromptTabs from "@/components/PromptTabs";
import CustomizerPanel from "@/components/CustomizerPanel";
import InstallPrompt from "@/components/InstallPrompt";
import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Guard for build time
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'undefined') {
    return [];
  }

  try {
    const prompts = await getAllPrompts();
    return prompts.map((p) => ({ slug: p.slug }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return { title: "Prompt Not Found" };
  return {
    title: `${prompt.title} | Vibro_Architecture`,
    description: prompt.description,
  };
}

function hasPreview(slug: string): boolean {
  try {
    const filePath = path.join(process.cwd(), "public", "previews", `${slug}.html`);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export default async function PromptPage({ params }: PageProps) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const category = await getCategoryBySlug(prompt.categorySlug);
  const categoryPrompts = await getPromptsByCategory(prompt.categorySlug);
  const related = categoryPrompts
    .filter((p) => p.id !== prompt.id)
    .slice(0, 3);


  const previewAvailable = hasPreview(prompt.slug);

  return (
    <div className="relative min-h-screen bg-[#F3F2EE] bg-grid-pattern">
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-32 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-14 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-black">CORE</Link>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <Link href="/categories" className="transition hover:text-black">LIBRARY</Link>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <Link href={`/category/${prompt.categorySlug}`} className="transition hover:text-black">
            {category?.name || prompt.categorySlug}
          </Link>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <span className="text-black">{prompt.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
          {/* Left Column: Preview & Tabs */}
          <div className="lg:col-span-8">
            <div className="mb-16">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-xl border-[2.5px] border-black bg-black px-4 py-1 text-[10px] font-black text-[#b8f724] uppercase tracking-widest shadow-[3px_3px_0_rgba(184,247,36,1)]">
                  ARCHITECTURE
                </span>
                <span className="text-[11px] font-[1000] text-black uppercase tracking-[0.2em]">
                  NODE_STABLE_V1.0.4
                </span>
              </div>
              <h1 className="text-6xl sm:text-8xl font-[1000] tracking-[calc(-0.06em)] text-black uppercase leading-[0.85] mb-8">
                {prompt.title}<span className="text-white [-webkit-text-stroke:2px_black]">.</span>
              </h1>
              <p className="max-w-3xl text-xl font-bold leading-relaxed text-zinc-500 italic">
                "{prompt.description}"
              </p>
            </div>

            <PromptTabs
              previewAvailable={previewAvailable}
              previewSlot={
                <div className="rounded-[3rem] border-[4px] border-black bg-white overflow-hidden shadow-[20px_20px_0_rgba(0,0,0,1)]">
                  <PreviewFrame slug={prompt.slug} title={prompt.title} />
                </div>
              }
              promptSlot={
                <div className="rounded-[3rem] border-[4px] border-black bg-black overflow-hidden shadow-[20px_20px_0_rgba(184,247,36,1)]">
                  <div className="flex items-center justify-between border-b-[3px] border-white/10 px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full border-2 border-white/20 bg-red-500" />
                        <div className="h-3 w-3 rounded-full border-2 border-white/20 bg-amber-500" />
                        <div className="h-3 w-3 rounded-full border-2 border-white/20 bg-emerald-500" />
                      </div>
                      <span className="ml-3 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">extraction_manifest.ts</span>
                    </div>
                    <CopyButton text={prompt.promptText} />
                  </div>
                  <pre className="max-h-[600px] overflow-auto p-10 text-[13px] leading-relaxed text-[#b8f724]/90 font-mono custom-scrollbar">
                    <code>{prompt.promptText}</code>
                  </pre>
                </div>
              }
            />

            {/* Tags */}
            <div className="mt-20 px-4">
              <h3 className="mb-6 text-[11px] font-[1000] uppercase tracking-[0.3em] text-black">Component_Tags</h3>
              <div className="flex flex-wrap gap-4">
                {prompt.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-xl border-[2.5px] border-black bg-white px-5 py-2.5 text-xs font-black text-black transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(184,247,36,1)] uppercase tracking-tighter"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="flex flex-col gap-10 lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <InstallPrompt slug={prompt.slug} />
            <CustomizerPanel />
            
            <div className="rounded-[2rem] border-[3px] border-black/5 bg-white/50 p-8 text-center backdrop-blur-sm">
              <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-widest">
                Protocol: <code className="text-black font-black">npm i -g vibro-cli</code> 
              </p>
            </div>
          </div>
        </div>

        {/* Related Section */}
        {related.length > 0 && (
          <div className="mt-40 border-t-[4px] border-black pt-24">
            <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h2 className="text-5xl font-[1000] text-black tracking-tighter uppercase">Recommended_Synthesis</h2>
                <p className="mt-3 text-lg font-bold text-zinc-500 italic">Parallel structures from the {category?.name} archive.</p>
              </div>
              <Link href="/categories" className="brutal-btn-primary h-12 px-6">
                View All Archives
              </Link>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
