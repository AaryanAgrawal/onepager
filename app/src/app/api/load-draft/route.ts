import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, htmlFile } = body;

    if (!id || !htmlFile) {
      return NextResponse.json({ error: "Missing id or htmlFile" }, { status: 400 });
    }

    const safeName = htmlFile.replace(/[^a-zA-Z0-9 ._-]/g, "");
    const sourcePath = path.join(process.cwd(), "outputs", id, safeName);

    if (!existsSync(sourcePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const html = readFileSync(sourcePath, "utf-8");
    const currentPath = path.join(process.cwd(), "current.html");
    writeFileSync(currentPath, html);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Load draft error:", error);
    return NextResponse.json({ error: "Failed to load draft" }, { status: 500 });
  }
}
