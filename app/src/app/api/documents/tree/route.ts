import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const treePath = path.join(process.cwd(), "..", "documents", "_tree.json");
    if (!existsSync(treePath)) {
      return NextResponse.json({ version: 1, root: [] });
    }
    const tree = JSON.parse(readFileSync(treePath, "utf-8"));
    return NextResponse.json(tree);
  } catch (error) {
    return NextResponse.json({ version: 1, root: [] });
  }
}
