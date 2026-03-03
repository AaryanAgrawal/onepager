import { NextResponse } from "next/server";
import { readFileSync, statSync, existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(process.cwd(), "current.html");

  if (!existsSync(filePath)) {
    return NextResponse.json({ html: null, lastModified: 0 });
  }

  const html = readFileSync(filePath, "utf-8");
  const lastModified = statSync(filePath).mtimeMs;

  return NextResponse.json({ html, lastModified });
}
