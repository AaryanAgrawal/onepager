/**
 * POST /api/render-graphviz
 * Takes DOT syntax, renders to SVG using @viz-js/viz (Graphviz WASM).
 *
 * Body: { dot: string }
 * Returns: { svg: string }
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dot } = body;

    if (!dot) {
      return NextResponse.json({ error: "Missing 'dot' field" }, { status: 400 });
    }

    const { instance } = await import("@viz-js/viz");
    const viz = await instance();
    const svg = viz.renderString(dot, { format: "svg", engine: "dot" });

    return NextResponse.json({ svg });
  } catch (error) {
    console.error("Graphviz render error:", error);
    return NextResponse.json(
      { error: "Failed to render diagram", details: String(error) },
      { status: 500 }
    );
  }
}
