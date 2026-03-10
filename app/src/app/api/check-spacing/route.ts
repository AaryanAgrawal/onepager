/**
 * GET /api/check-spacing
 *
 * Uses Puppeteer to measure actual rendered content height of each .page div.
 * Returns per-page report: overflow amount, whitespace amount, and actionable advice.
 *
 * Response: {
 *   pages: [
 *     {
 *       page: 1,
 *       containerHeight: 1056,
 *       contentHeight: 1120,
 *       overflow: 64,
 *       whitespace: 0,
 *       gaps: [12, 18, 94],
 *       maxGap: 94,
 *       avgGap: 41,
 *       status: "OVERFLOW",
 *       advice: "Page 1 overflows by 64px (~3 lines). Cut content or reduce font sizes."
 *     },
 *     ...
 *   ],
 *   summary: "2 pages overflow, 1 page has excess whitespace."
 * }
 */
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { resolveAssetsBase64 } from "@/lib/asset-resolver";

const PAGE_HEIGHT_PX = 1056; // 11in at 96dpi
const OVERFLOW_THRESHOLD = 5; // px — ignore sub-5px rounding
const WHITESPACE_WARN = 150; // px — ~14% of page, warn if more empty space than this
const GAP_THRESHOLD = 60; // px — flag if any inter-section gap exceeds this
const GAP_RATIO = 2.5; // flag if max gap > GAP_RATIO × average gap

interface PageMeasurement {
  page: number;
  containerHeight: number;
  contentHeight: number;
  overflow: number;
  whitespace: number;
  gaps: number[];
  maxGap: number;
  avgGap: number;
  status: "OK" | "OVERFLOW" | "EXCESS_WHITESPACE" | "UNEVEN_SPACING";
  advice: string;
}

export async function GET() {
  try {
    const currentPath = path.join(process.cwd(), "current.html");
    if (!existsSync(currentPath)) {
      return NextResponse.json(
        { error: "No working file (current.html)" },
        { status: 404 }
      );
    }

    const rawHtml = readFileSync(currentPath, "utf-8");
    const html = resolveAssetsBase64(rawHtml);

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
    await page.setViewport({ width: 816, height: 1056 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 500));

    // Measure each .page div
    const measurements = await page.evaluate(() => {
      const pages = document.querySelectorAll(".page");
      return Array.from(pages).map((pageEl, i) => {
        const container = pageEl as HTMLElement;
        const containerHeight = container.clientHeight;

        // scrollHeight = full content height including overflow
        const scrollHeight = container.scrollHeight;

        // Also measure the bounding rect of the last child to find where content ends
        const children = container.children;
        let lastChildBottom = 0;
        if (children.length > 0) {
          const containerRect = container.getBoundingClientRect();
          for (let j = 0; j < children.length; j++) {
            const child = children[j] as HTMLElement;
            const childRect = child.getBoundingClientRect();
            const childBottom = childRect.bottom - containerRect.top;
            if (childBottom > lastChildBottom) {
              lastChildBottom = childBottom;
            }
          }
        }

        // Use the larger of scrollHeight and lastChildBottom for accuracy
        const contentHeight = Math.max(scrollHeight, Math.ceil(lastChildBottom));

        // Measure visual spacing between sections
        // Sections use padding-top for spacing (not margin), so bounding box gaps are 0.
        // We measure each child's paddingTop as the visual gap above it.
        // We also measure margin-top + bounding box gap to catch both patterns.
        const gaps: number[] = [];
        if (children.length > 0) {
          for (let j = 0; j < children.length; j++) {
            const child = children[j] as HTMLElement;
            const style = window.getComputedStyle(child);
            const paddingTop = parseFloat(style.paddingTop) || 0;
            const marginTop = parseFloat(style.marginTop) || 0;
            // For the first child, report its padding-top as-is
            // For subsequent children, also add any bounding box gap
            let visualGap = paddingTop + marginTop;
            if (j > 0) {
              const prevRect = (children[j - 1] as HTMLElement).getBoundingClientRect();
              const currRect = child.getBoundingClientRect();
              const boxGap = Math.round(currRect.top - prevRect.bottom);
              if (boxGap > 0) visualGap += boxGap;
            }
            gaps.push(Math.round(visualGap));
          }
        }
        const maxGap = gaps.length > 0 ? Math.max(...gaps) : 0;
        const avgGap = gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0;

        return {
          page: i + 1,
          containerHeight,
          contentHeight,
          scrollHeight,
          lastChildBottom: Math.ceil(lastChildBottom),
          gaps,
          maxGap,
          avgGap,
        };
      });
    });

    await browser.close();

    // Build report
    const pages: PageMeasurement[] = measurements.map((m) => {
      const overflow = Math.max(0, m.contentHeight - m.containerHeight);
      const whitespace = Math.max(0, m.containerHeight - m.contentHeight);

      let status: PageMeasurement["status"] = "OK";
      let advice = "";

      if (overflow > OVERFLOW_THRESHOLD) {
        status = "OVERFLOW";
        const lines = Math.ceil(overflow / 20); // ~20px per line
        advice = `Page ${m.page} overflows by ${overflow}px (~${lines} lines). Cut content or reduce font/spacing.`;
      } else if (m.maxGap > GAP_THRESHOLD && m.avgGap > 0 && m.maxGap > m.avgGap * GAP_RATIO) {
        status = "UNEVEN_SPACING";
        const maxGapIndex = m.gaps.indexOf(m.maxGap);
        advice = `Page ${m.page} has uneven section spacing (max gap: ${m.maxGap}px between sections ${maxGapIndex + 1} and ${maxGapIndex + 2}, avg: ${m.avgGap}px). Redistribute padding to equalize.`;
      } else if (whitespace > WHITESPACE_WARN) {
        status = "EXCESS_WHITESPACE";
        const pct = Math.round((whitespace / m.containerHeight) * 100);
        advice = `Page ${m.page} has ${whitespace}px (${pct}%) unused space at bottom. Consider increasing spacing or adding content.`;
      } else {
        advice = `Page ${m.page} fits well.`;
      }

      return {
        page: m.page,
        containerHeight: m.containerHeight,
        contentHeight: m.contentHeight,
        overflow,
        whitespace,
        gaps: m.gaps,
        maxGap: m.maxGap,
        avgGap: m.avgGap,
        status,
        advice,
      };
    });

    const overflowCount = pages.filter((p) => p.status === "OVERFLOW").length;
    const unevenCount = pages.filter((p) => p.status === "UNEVEN_SPACING").length;
    const whitespaceCount = pages.filter(
      (p) => p.status === "EXCESS_WHITESPACE"
    ).length;
    const okCount = pages.filter((p) => p.status === "OK").length;

    let summary = "";
    const parts: string[] = [];
    if (overflowCount > 0)
      parts.push(`${overflowCount} page(s) OVERFLOW — content needs to be cut or downsized`);
    if (unevenCount > 0)
      parts.push(`${unevenCount} page(s) have UNEVEN_SPACING — redistribute section gaps`);
    if (whitespaceCount > 0)
      parts.push(`${whitespaceCount} page(s) have excess whitespace`);
    if (okCount > 0) parts.push(`${okCount} page(s) fit well`);
    summary = parts.join(". ") + ".";

    return NextResponse.json({ pages, summary });
  } catch (error) {
    console.error("Check spacing error:", error);
    return NextResponse.json(
      { error: "Failed to check spacing", details: String(error) },
      { status: 500 }
    );
  }
}
