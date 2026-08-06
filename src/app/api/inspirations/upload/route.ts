import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createInspirationItem } from "@/lib/inspiration";

const supportedTypes = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const workspaceSlug = String(formData.get("workspaceSlug") || "workspace");
    const tab = String(formData.get("tab") || "landing");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!supportedTypes.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    const supabase = await createClient();
    const auth = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
    const user = auth.data.user;

    const bytes = Buffer.from(await file.arrayBuffer());
    const storagePath = `${workspaceSlug}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    let thumbnailUrl = "";

    if (user) {
      const upload = await supabase.storage.from("inspiration-assets").upload(storagePath, bytes, {
        contentType: file.type,
        upsert: true,
      });

      if (!upload.error) {
        const publicUrl = supabase.storage.from("inspiration-assets").getPublicUrl(storagePath);
        thumbnailUrl = publicUrl.data.publicUrl;
      }
    }

    if (!thumbnailUrl) {
      thumbnailUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
    }

    const item = createInspirationItem({
      type: "image",
      title: file.name,
      description: "Uploaded screenshot reference.",
      thumbnailUrl,
      storagePath,
      tags: [tab, "Screenshot"],
      tab,
      createdBy: user?.id || "demo-user",
    });

    if (user) {
      await supabase.from("inspiration_assets").insert({
        user_id: user.id,
        workspace_slug: workspaceSlug,
        source_type: "image",
        title: item.title,
        source_url: item.url || null,
        thumbnail_url: item.thumbnailUrl || null,
        storage_path: item.storagePath || null,
        tags: item.tags,
        analysis: item.analysis,
      });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}
