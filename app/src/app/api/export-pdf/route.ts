import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { html, filename, customerName } = await request.json();

    if (!html) {
      return NextResponse.json({ error: "html is required" }, { status: 400 });
    }

    const safeName = (filename || "onepager").replace(/[^a-zA-Z0-9 ._-]/g, "");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const slug = customerName
      ? customerName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : "draft";
    const outputDir = path.join(process.cwd(), "outputs", `${timestamp}-${slug}`);
    mkdirSync(outputDir, { recursive: true });

    // Save HTML snapshot
    writeFileSync(path.join(outputDir, `${safeName}.html`), html);

    // Detect Chrome executable
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
    await page.setContent(html, { waitUntil: "load" });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Inject print CSS
    await page.addStyleTag({
      content: `
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          * { break-inside: avoid; }
        }
      `,
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

    // Save PDF
    const pdfPath = path.join(outputDir, `${safeName}.pdf`);
    writeFileSync(pdfPath, pdfBuffer);

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
