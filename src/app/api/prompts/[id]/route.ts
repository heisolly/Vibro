import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function verifyPasscode() {
  const cookieStore = await cookies();
  return cookieStore.get("vibro_admin_access")?.value === "true";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyPasscode())) {
    return NextResponse.json({ error: "Unauthorized access protocol" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();
  
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('prompts')
      .update({
        title: body.title,
        slug: body.slug,
        category_slug: body.categorySlug,
        description: body.description,
        prompt_text: body.promptText,
        tags: body.tags,
        featured: body.featured,
        preview_image: body.previewImage,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyPasscode())) {
    return NextResponse.json({ error: "Unauthorized access protocol" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from('prompts').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Prompt deleted" });
}
