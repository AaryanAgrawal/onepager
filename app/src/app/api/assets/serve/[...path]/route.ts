/**
 * Serves image assets from disk via URL.
 * GET /api/assets/serve/brand/logo.png → serves the file from onepager/brand/logo.png
 *
 * Search order: exact path → assets/ → brand/ → references/assets/
 * This replaces base64 embedding in current.html with simple <img src="/api/assets/serve/...">
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

const ONEPAGER_ROOT = path.join(process.cwd(), "..");

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const SEARCH_DIRS = ["", "assets", "brand", "references/assets"];

function findAsset(assetPath: string): string | null {
  // Try exact path first
  const exact = path.join(ONEPAGER_ROOT, assetPath);
  if (existsSync(exact)) return exact;

  // Try search directories
  const basename = path.basename(assetPath);
  for (const dir of SEARCH_DIRS) {
    const candidate = path.join(ONEPAGER_ROOT, dir, basename);
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const assetPath = pathSegments.join("/");

  // Security: block path traversal
  if (assetPath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const filePath = findAsset(assetPath);
  if (!filePath) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();

  // Handle .txt files (contain raw base64 — serve as the decoded image)
  if (ext === ".txt") {
    const b64 = readFileSync(filePath, "utf-8").trim();
    const buffer = Buffer.from(b64, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const mime = MIME_TYPES[ext];
  if (!mime) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const buffer = readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
