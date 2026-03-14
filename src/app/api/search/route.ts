import { NextResponse } from "next/server";
import { searchPrompts } from "@/lib/queries";

// GET /api/search?q=navbar
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const results = searchPrompts(query);
  return NextResponse.json(results);
}
