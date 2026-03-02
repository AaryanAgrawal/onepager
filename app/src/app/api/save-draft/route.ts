import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { html, formData, customerName } = await request.json();

    if (!html) {
      return NextResponse.json({ error: "html is required" }, { status: 400 });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const slug = customerName
      ? customerName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : "draft";
    const outputDir = path.join(process.cwd(), "outputs", `${timestamp}-${slug}`);
    mkdirSync(outputDir, { recursive: true });

    writeFileSync(path.join(outputDir, "one-pager.html"), html);
    writeFileSync(
      path.join(outputDir, "metadata.json"),
      JSON.stringify(
        {
          version: "1.0",
          createdAt: new Date().toISOString(),
          customerName: customerName || "Draft",
          template: formData?.template || "general",
          formData,
        },
        null,
        2
      )
    );

    return NextResponse.json({ success: true, path: outputDir });
  } catch (error) {
    console.error("Save draft error:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}
