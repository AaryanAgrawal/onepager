import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { field, value } = await request.json();

    if (!field || typeof value !== "string") {
      return NextResponse.json({ error: "field and value are required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "current.html");
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "No working file" }, { status: 404 });
    }

    let html = readFileSync(filePath, "utf-8");

    // Replace content inside the element with matching data-field attribute
    // Matches: data-field="headline">...old content...</ClosingTag>
    const regex = new RegExp(
      `(data-field="${field}"[^>]*>)([\\s\\S]*?)(</)`,
      "i"
    );

    if (!regex.test(html)) {
      return NextResponse.json({ error: `Field "${field}" not found` }, { status: 404 });
    }

    html = html.replace(regex, `$1${escapeHtml(value)}$3`);
    writeFileSync(filePath, html);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update text error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
