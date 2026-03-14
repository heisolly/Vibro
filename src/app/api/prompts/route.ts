import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function verifyPasscode() {
  const cookieStore = await cookies();
  return cookieStore.get("vibro_admin_access")?.value === "true";
}

// GET /api/prompts — return all prompts (Public)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const prompts = data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  }));

  return NextResponse.json(prompts);
}

// POST /api/prompts — create a new prompt (Admin Only)
export async function POST(request: Request) {
  if (!(await verifyPasscode())) {
    return NextResponse.json({ error: "Unauthorized access protocol" }, { status: 401 });
  }

  const supabase = await createClient();
  
  try {
    const body = await request.json();

    // Get category ID from slug
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', body.categorySlug)
      .single();

    const categoryId = category?.id || "1";

    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          id: body.id || `custom-${Date.now()}`,
          title: body.title,
          slug: body.slug,
          category_id: categoryId,
          category_slug: body.categorySlug,
          description: body.description,
          prompt_text: body.promptText,
          preview_image: body.previewImage || "/previews/custom.svg",
          tags: body.tags || [],
          featured: body.featured || false,
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 });
  }
}
