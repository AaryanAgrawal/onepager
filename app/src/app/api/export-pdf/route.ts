import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { resolveAssetsBase64 } from "@/lib/asset-resolver";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const filename = body.filename || "onepager";

    const currentPath = path.join(process.cwd(), "current.html");
    if (!existsSync(currentPath)) {
      return NextResponse.json({ error: "No working file (current.html)" }, { status: 404 });
    }

    // Resolve /api/assets/serve/ URLs to base64 for self-contained PDF
    const rawHtml = readFileSync(currentPath, "utf-8");
    const html = resolveAssetsBase64(rawHtml);

    const safeName = filename.replace(/[^a-zA-Z0-9 ._-]/g, "");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const slug = safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "draft";
    const outputDir = path.join(process.cwd(), "outputs", `${timestamp}-${slug}`);
    mkdirSync(outputDir, { recursive: true });

    writeFileSync(path.join(outputDir, `${safeName}.html`), html);

    const executablePath =
      process.env.CHROME_PATH ||
      (process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : "/usr/bin/google-chrome");

    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    // Extra wait for Google Fonts to fully render after load
    await new Promise((r) => setTimeout(r, 500));
    await page.addStyleTag({
      content: `@media print {
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 0; background: white; }
        * { break-inside: avoid; }
        .page { margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; page-break-after: always; }
        .page:last-child { page-break-after: auto; }
      }`,
    });

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      displayHeaderFooter: false,
      scale: 1,
    });

    await browser.close();

    const pdfPath = path.join(outputDir, `${safeName}.pdf`);
    writeFileSync(pdfPath, pdfBuffer);
    writeFileSync(
      path.join(outputDir, "metadata.json"),
      JSON.stringify({ createdAt: new Date().toISOString(), name: safeName, source: "claude-code" }, null, 2)
    );

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 }
    );
  }
}
