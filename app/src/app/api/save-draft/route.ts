import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = body.name || "Draft";

    const currentPath = path.join(process.cwd(), "current.html");
    if (!existsSync(currentPath)) {
      return NextResponse.json({ error: "No working file (current.html)" }, { status: 404 });
    }

    const html = readFileSync(currentPath, "utf-8");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "draft";
    const outputDir = path.join(process.cwd(), "outputs", `${timestamp}-${slug}`);
    mkdirSync(outputDir, { recursive: true });

    writeFileSync(path.join(outputDir, "one-pager.html"), html);
    writeFileSync(
      path.join(outputDir, "metadata.json"),
      JSON.stringify({ version: "1.0", createdAt: new Date().toISOString(), name, source: "claude-code" }, null, 2)
    );

    return NextResponse.json({ success: true, path: outputDir });
  } catch (error) {
    console.error("Save draft error:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}
