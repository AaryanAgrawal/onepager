import { NextResponse } from "next/server";
import { readdirSync, existsSync, readFileSync } from "fs";
import path from "path";

export async function GET() {
  try {
    const outputsDir = path.join(process.cwd(), "outputs");
    if (!existsSync(outputsDir)) {
      return NextResponse.json([]);
    }

    const dirs = readdirSync(outputsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .sort((a, b) => b.name.localeCompare(a.name));

    const versions = dirs.map((dir) => {
      const dirPath = path.join(outputsDir, dir.name);
      const files = readdirSync(dirPath);
      let customerName = "Draft";
      let template = "general";

      const metaPath = path.join(dirPath, "metadata.json");
      if (existsSync(metaPath)) {
        try {
          const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
          customerName = meta.customerName || "Draft";
          template = meta.template || "general";
        } catch {}
      }

      return {
        id: dir.name,
        createdAt: dir.name.slice(0, 19).replace(/T/, " ").replace(/-/g, ":"),
        customerName,
        template,
        hasPDF: files.some((f) => f.endsWith(".pdf")),
        hasHTML: files.some((f) => f.endsWith(".html")),
      };
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("List versions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
