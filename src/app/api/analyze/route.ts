import { NextResponse } from "next/server";
import { fetchAndAnalyze } from "@/lib/seo/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let url: string;
  try {
    const body = await request.json();
    url = typeof body?.url === "string" ? body.url : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!url.trim()) {
    return NextResponse.json({ error: "A 'url' field is required." }, { status: 400 });
  }

  try {
    const report = await fetchAndAnalyze(url);
    return NextResponse.json(report);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to analyze the page.";
    const isAbort = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: isAbort ? "The request timed out after 15s." : message },
      { status: 422 },
    );
  }
}
