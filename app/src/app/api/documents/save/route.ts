import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { unresolveAssets } from "@/lib/asset-resolver";

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

    const currentPath = path.join(process.cwd(), "current.html");
    if (!existsSync(currentPath)) {
      return NextResponse.json({ error: "No working file" }, { status: 404 });
    }

    const rawHtml = readFileSync(currentPath, "utf-8");
    const html = unresolveAssets(rawHtml);
    const destPath = path.join(process.cwd(), "..", "documents", docPath);
    mkdirSync(path.dirname(destPath), { recursive: true });
    writeFileSync(destPath, html);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
  }
}
