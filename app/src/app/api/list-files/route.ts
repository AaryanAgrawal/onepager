import { NextResponse } from "next/server";
import { readdirSync, existsSync, readFileSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const outputsDir = path.join(process.cwd(), "outputs");
    if (!existsSync(outputsDir)) {
      return NextResponse.json([]);
    }

    const dirs = readdirSync(outputsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .sort((a, b) => b.name.localeCompare(a.name));

    const files = dirs.map((dir) => {
      const dirPath = path.join(outputsDir, dir.name);
      const dirFiles = readdirSync(dirPath);
      let name = "Draft";

      const metaPath = path.join(dirPath, "metadata.json");
      if (existsSync(metaPath)) {
        try {
          const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
          name = meta.customerName || meta.name || "Draft";
        } catch {}
      }

      const datePart = dir.name.slice(0, 19);
      const createdAt = datePart
        .replace(/T/, " ")
        .replace(/^(\d{4}-\d{2}-\d{2}) (.*)$/, (_, date, time) => `${date} ${time.replace(/-/g, ":")}`);

      return {
        id: dir.name,
        name,
        createdAt,
        hasPDF: dirFiles.some((f) => f.endsWith(".pdf")),
        hasHTML: dirFiles.some((f) => f.endsWith(".html")),
        htmlFile: dirFiles.find((f) => f.endsWith(".html")) || null,
      };
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
