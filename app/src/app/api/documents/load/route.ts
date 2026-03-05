import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { resolveAssets } from "@/lib/asset-resolver";

function isValidPath(p: string): boolean {
  if (!p || p.includes("..") || p.includes("~") || path.isAbsolute(p)) return false;
  if (!p.endsWith(".html")) return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const docPath = body.path;

    if (!isValidPath(docPath)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const sourcePath = path.join(process.cwd(), "..", "documents", docPath);
    if (!existsSync(sourcePath)) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const rawHtml = readFileSync(sourcePath, "utf-8");
    const html = resolveAssets(rawHtml);
    writeFileSync(path.join(process.cwd(), "current.html"), html);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}
