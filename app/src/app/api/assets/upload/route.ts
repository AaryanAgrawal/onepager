import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
const ASSETS_DIR = path.join(process.cwd(), "..", "assets");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported format. Use: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Sanitize filename: lowercase, replace spaces with hyphens, strip weird chars
    const safeName = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "");

    if (!safeName || safeName.startsWith(".")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Ensure assets dir exists
    mkdirSync(ASSETS_DIR, { recursive: true });

    // If file exists, append a number
    let finalName = safeName;
    let counter = 1;
    while (existsSync(path.join(ASSETS_DIR, finalName))) {
      const base = safeName.replace(ext, "");
      finalName = `${base}-${counter}${ext}`;
      counter++;
    }

    const bytes = await file.arrayBuffer();
    writeFileSync(path.join(ASSETS_DIR, finalName), Buffer.from(bytes));

    const assetPath = `assets/${finalName}`;
    return NextResponse.json({
      success: true,
      path: assetPath,
      template: `{{ASSET:${assetPath}}}`,
      filename: finalName,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
