/**
 * POST /api/render-diagram
 * Takes Mermaid syntax, renders to SVG server-side, returns the SVG string.
 *
 * Body: { mermaid: string, theme?: "default" | "dark" | "neutral" }
 * Returns: { svg: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import os from "os";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mermaid: mermaidSyntax, theme = "neutral" } = body;

    if (!mermaidSyntax) {
      return NextResponse.json({ error: "Missing 'mermaid' field" }, { status: 400 });
    }

    // Create temp files
    const tmpDir = path.join(os.tmpdir(), "onepager-mermaid");
    if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });

    const inputFile = path.join(tmpDir, `diagram-${Date.now()}.mmd`);
    const outputFile = path.join(tmpDir, `diagram-${Date.now()}.svg`);
    const configFile = path.join(tmpDir, `config-${Date.now()}.json`);

    // Write mermaid config for styling
    const config = {
      theme,
      themeVariables: {
        primaryColor: "#f5f5f5",
        primaryTextColor: "#10100d",
        primaryBorderColor: "#009F4A",
        lineColor: "#009F4A",
        secondaryColor: "#fff7ed",
        tertiaryColor: "#f5f5f5",
        fontFamily: "DM Sans, Inter, sans-serif",
        fontSize: "13px",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 16,
        nodeSpacing: 40,
        rankSpacing: 40,
      },
    };

    writeFileSync(inputFile, mermaidSyntax);
    writeFileSync(configFile, JSON.stringify(config));

    // Run mermaid CLI
    const mmdc = path.join(process.cwd(), "node_modules", ".bin", "mmdc");
    execSync(
      `"${mmdc}" -i "${inputFile}" -o "${outputFile}" -c "${configFile}" -b transparent --quiet`,
      { timeout: 15000 }
    );

    if (!existsSync(outputFile)) {
      throw new Error("SVG output not generated");
    }

    let svg = readFileSync(outputFile, "utf-8");

    // Clean up temp files
    try { unlinkSync(inputFile); } catch {}
    try { unlinkSync(outputFile); } catch {}
    try { unlinkSync(configFile); } catch {}

    return NextResponse.json({ svg });
  } catch (error) {
    console.error("Diagram render error:", error);
    return NextResponse.json(
      { error: "Failed to render diagram", details: String(error) },
      { status: 500 }
    );
  }
}
