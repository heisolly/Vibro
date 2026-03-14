import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  // Look for the preview HTML file in public/previews/
  const filePath = join(process.cwd(), "public", "previews", `${slug}.html`);

  if (!existsSync(filePath)) {
    // Return a styled "preview not available" page
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Coming Soon</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center">
  <div class="text-center p-12">
    <div class="text-6xl mb-4">🚧</div>
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Preview Coming Soon</h1>
    <p class="text-gray-500 max-w-md mx-auto">
      The interactive preview for this component is being built.
      Copy the prompt and paste it into an AI tool to generate the code!
    </p>
  </div>
</body>
</html>`;
    return new NextResponse(fallbackHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const html = readFileSync(filePath, "utf-8");
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load preview" }, { status: 500 });
  }
}
