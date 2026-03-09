import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const PAGE_HEIGHT_PX = 1056; // 11in at 96dpi
const MIN_PADDING = 12;
const MAX_PADDING = 48;

/**
 * Extract inline style property value from a style string.
 */
function getStyleValue(style: string, prop: string): string | null {
  // Match property: value patterns, handling multi-value properties
  const regex = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "i");
  const match = style.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Parse a CSS size value to pixels. Supports px, in, and bare numbers.
 */
function parseToPx(value: string): number {
  const trimmed = value.trim();
  if (trimmed.endsWith("in")) {
    return parseFloat(trimmed) * 96;
  }
  if (trimmed.endsWith("px")) {
    return parseFloat(trimmed);
  }
  const num = parseFloat(trimmed);
  return isNaN(num) ? 0 : num;
}

/**
 * Extract the padding-top from a shorthand or longhand padding declaration.
 * Returns the pixel value or 0 if not found.
 */
function getPaddingTop(style: string): number {
  // Check padding-top first (longhand takes priority)
  const paddingTop = getStyleValue(style, "padding-top");
  if (paddingTop) return parseToPx(paddingTop);

  // Check shorthand padding
  const padding = getStyleValue(style, "padding");
  if (!padding) return 0;

  const parts = padding.split(/\s+/);
  // padding: top | padding: top right | padding: top right bottom | padding: top right bottom left
  return parseToPx(parts[0]);
}

/**
 * Extract the padding-bottom from a shorthand or longhand padding declaration.
 */
function getPaddingBottom(style: string): number {
  const paddingBottom = getStyleValue(style, "padding-bottom");
  if (paddingBottom) return parseToPx(paddingBottom);

  const padding = getStyleValue(style, "padding");
  if (!padding) return 0;

  const parts = padding.split(/\s+/);
  if (parts.length === 1) return parseToPx(parts[0]);
  if (parts.length === 2) return parseToPx(parts[0]);
  if (parts.length === 3) return parseToPx(parts[2]);
  return parseToPx(parts[2]); // 4-value: top right bottom left
}

/**
 * Set padding-top in a style string. If padding-top exists as longhand, update it.
 * If only shorthand padding exists, convert to individual properties.
 * If neither exists, add padding-top.
 */
function setPaddingTop(style: string, newPx: number): string {
  const value = `${Math.round(newPx)}px`;

  // Try longhand padding-top first
  if (/padding-top\s*:/i.test(style)) {
    return style.replace(
      /padding-top\s*:\s*[^;]+/i,
      `padding-top: ${value}`
    );
  }

  // If shorthand padding exists, expand it
  const paddingMatch = style.match(/(^|;)\s*padding\s*:\s*([^;]+)/i);
  if (paddingMatch) {
    const parts = paddingMatch[2].trim().split(/\s+/);
    let top: string, right: string, bottom: string, left: string;

    if (parts.length === 1) {
      top = right = bottom = left = parts[0];
    } else if (parts.length === 2) {
      top = bottom = parts[0];
      right = left = parts[1];
    } else if (parts.length === 3) {
      top = parts[0];
      right = left = parts[1];
      bottom = parts[2];
    } else {
      top = parts[0];
      right = parts[1];
      bottom = parts[2];
      left = parts[3];
    }

    // Replace shorthand with the new top value
    const newPadding = `${value} ${right} ${bottom} ${left}`;
    return style.replace(
      /padding\s*:\s*[^;]+/i,
      `padding: ${newPadding}`
    );
  }

  // No padding at all — add padding-top
  return style + `; padding-top: ${value}`;
}

/**
 * Estimate the rendered height of an HTML section by looking at its content.
 * This is a rough heuristic since we can't render in Node.
 */
function estimateSectionHeight(sectionHtml: string): number {
  let height = 0;

  // Get this section's own padding
  const styleMatch = sectionHtml.match(/^<div[^>]*style="([^"]*)"/i);
  const style = styleMatch ? styleMatch[1] : "";
  height += getPaddingTop(style) + getPaddingBottom(style);

  // Count text lines (rough: each <p>, <h1>-<h6>, <div>, <span> with text)
  const textElements = sectionHtml.match(/<(p|h[1-6]|li)[\s>]/gi) || [];
  height += textElements.length * 24; // ~24px per text line

  // Count cards / grid items
  const innerDivs = sectionHtml.match(/<div[^>]*style="[^"]*background[^"]*"/gi) || [];
  height += innerDivs.length * 80; // ~80px per card

  // Count images
  const imgs = sectionHtml.match(/<img[^>]*>/gi) || [];
  for (const img of imgs) {
    const heightAttr = img.match(/height\s*[:=]\s*["']?(\d+)/i);
    height += heightAttr ? parseInt(heightAttr[1]) : 60;
  }

  // Count SVGs (icons)
  const svgs = sectionHtml.match(/<svg[^>]*>/gi) || [];
  height += svgs.length * 24;

  // Count tables
  const tableRows = sectionHtml.match(/<tr[\s>]/gi) || [];
  height += tableRows.length * 36;

  // Minimum section height
  return Math.max(height, 20);
}

/**
 * Check if a section is the accent bar (very small height div with background color).
 */
function isAccentBar(sectionHtml: string): boolean {
  const styleMatch = sectionHtml.match(/^<div[^>]*style="([^"]*)"/i);
  if (!styleMatch) return false;
  const style = styleMatch[1];
  const height = getStyleValue(style, "height");
  if (!height) return false;
  const px = parseToPx(height);
  return px <= 8 && /background\s*:/i.test(style);
}

/**
 * Check if a section has margin-top: auto (footer/CTA pushed to bottom).
 */
function hasMarginTopAuto(sectionHtml: string): boolean {
  const styleMatch = sectionHtml.match(/^<div[^>]*style="([^"]*)"/i);
  if (!styleMatch) return false;
  return /margin-top\s*:\s*auto/i.test(styleMatch[1]);
}

/**
 * Find top-level child divs within a page div.
 * Returns array of { fullMatch, style, startIndex, endIndex, html }
 */
function findTopLevelChildDivs(
  pageContent: string
): Array<{
  fullMatch: string;
  style: string;
  index: number;
}> {
  const children: Array<{ fullMatch: string; style: string; index: number }> =
    [];

  // Find all top-level <div> elements within the page
  // We need to track nesting depth
  let i = 0;
  while (i < pageContent.length) {
    // Look for opening <div
    const divStart = pageContent.indexOf("<div", i);
    if (divStart === -1) break;

    // Make sure this is a top-level div (no other unclosed divs before it at this level)
    // We track by finding the matching close tag
    const tagEnd = pageContent.indexOf(">", divStart);
    if (tagEnd === -1) break;

    const openTag = pageContent.substring(divStart, tagEnd + 1);
    const styleMatch = openTag.match(/style="([^"]*)"/i);
    const style = styleMatch ? styleMatch[1] : "";

    // Self-closing div (rare but possible)
    if (openTag.endsWith("/>")) {
      children.push({ fullMatch: openTag, style, index: divStart });
      i = tagEnd + 1;
      continue;
    }

    // Find matching close tag by tracking depth
    let depth = 1;
    let j = tagEnd + 1;
    while (j < pageContent.length && depth > 0) {
      const nextOpen = pageContent.indexOf("<div", j);
      const nextClose = pageContent.indexOf("</div>", j);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        // Check if it's actually a tag (not inside an attribute)
        const nextTagEnd = pageContent.indexOf(">", nextOpen);
        if (nextTagEnd !== -1 && nextTagEnd < nextClose) {
          depth++;
          j = nextTagEnd + 1;
        } else {
          depth--;
          j = nextClose + 6;
        }
      } else {
        depth--;
        if (depth === 0) {
          const fullMatch = pageContent.substring(divStart, nextClose + 6);
          children.push({ fullMatch, style, index: divStart });
        }
        j = nextClose + 6;
      }
    }

    i = j;
  }

  return children;
}

export async function POST() {
  const filePath = path.join(process.cwd(), "current.html");

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { success: false, error: "No current.html found" },
      { status: 404 }
    );
  }

  let html = readFileSync(filePath, "utf-8");

  // Find all .page divs by matching class="page" and tracking nesting depth
  const pageMatches: Array<{
    fullMatch: string;
    content: string;
    startIndex: number;
  }> = [];

  let searchFrom = 0;
  while (searchFrom < html.length) {
    const pageStart = html.indexOf('class="page"', searchFrom);
    if (pageStart === -1) break;

    // Find the opening <div of this page
    const divStart = html.lastIndexOf("<div", pageStart);
    if (divStart === -1) break;

    const tagEnd = html.indexOf(">", pageStart);
    if (tagEnd === -1) break;

    // Find matching </div> by tracking depth
    let depth = 1;
    let j = tagEnd + 1;
    while (j < html.length && depth > 0) {
      const nextOpen = html.indexOf("<div", j);
      const nextClose = html.indexOf("</div>", j);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        const nextTagEnd = html.indexOf(">", nextOpen);
        if (nextTagEnd !== -1 && nextTagEnd < nextClose) {
          depth++;
          j = nextTagEnd + 1;
        } else {
          depth--;
          j = nextClose + 6;
        }
      } else {
        depth--;
        if (depth === 0) {
          const fullMatch = html.substring(divStart, nextClose + 6);
          const content = html.substring(tagEnd + 1, nextClose);
          pageMatches.push({ fullMatch, content, startIndex: divStart });
        }
        j = nextClose + 6;
      }
    }

    searchFrom = j;
  }

  // If no .page divs found, treat the body as a single page
  if (pageMatches.length === 0) {
    return NextResponse.json({
      success: true,
      pages: 0,
      adjustments: ["No .page divs found — single-page document, no auto-spacing applied"],
    });
  }

  const adjustments: string[] = [];

  for (let pageIdx = 0; pageIdx < pageMatches.length; pageIdx++) {
    const page = pageMatches[pageIdx];
    const children = findTopLevelChildDivs(page.content);

    if (children.length < 2) {
      adjustments.push(`Page ${pageIdx + 1}: Only ${children.length} section(s), skipped`);
      continue;
    }

    // Classify children
    const adjustable: Array<{
      fullMatch: string;
      style: string;
      index: number;
      estimatedHeight: number;
    }> = [];
    let fixedHeight = 0;

    for (const child of children) {
      if (isAccentBar(child.fullMatch)) {
        fixedHeight += 5;
        continue;
      }
      if (hasMarginTopAuto(child.fullMatch)) {
        // Footer section — estimate its height but don't adjust its spacing
        fixedHeight += estimateSectionHeight(child.fullMatch);
        continue;
      }

      const estimated = estimateSectionHeight(child.fullMatch);
      adjustable.push({ ...child, estimatedHeight: estimated });
    }

    if (adjustable.length < 2) {
      adjustments.push(`Page ${pageIdx + 1}: Only ${adjustable.length} adjustable section(s), skipped`);
      continue;
    }

    // Calculate total estimated content height (without padding-top adjustments)
    const totalContentHeight = adjustable.reduce(
      (sum, s) => sum + s.estimatedHeight,
      0
    );
    const availableSpace = PAGE_HEIGHT_PX - fixedHeight - totalContentHeight;

    // Distribute available space as padding-top across adjustable sections
    // First section keeps its original padding (it's right below the header)
    // Remaining sections get evenly distributed padding-top
    const gaps = adjustable.length - 1; // spaces between sections
    if (gaps <= 0 || availableSpace <= 0) {
      adjustments.push(
        `Page ${pageIdx + 1}: Content fills page (${Math.round(totalContentHeight + fixedHeight)}px used of ${PAGE_HEIGHT_PX}px), no adjustment needed`
      );
      continue;
    }

    const paddingPerGap = Math.max(
      MIN_PADDING,
      Math.min(MAX_PADDING, Math.round(availableSpace / gaps))
    );

    let pageHtml = page.fullMatch;
    let changesOnPage = 0;

    // Skip the first adjustable section (index 0), adjust sections 1..N
    for (let si = 1; si < adjustable.length; si++) {
      const section = adjustable[si];
      const currentPaddingTop = getPaddingTop(section.style);

      // Only adjust if the difference is meaningful (> 4px)
      if (Math.abs(currentPaddingTop - paddingPerGap) < 4) continue;

      const oldTag = section.fullMatch.match(/^<div[^>]*>/i)?.[0];
      if (!oldTag) continue;

      const oldStyle = section.style;
      const newStyle = setPaddingTop(oldStyle, paddingPerGap);
      const newTag = oldTag.replace(oldStyle, newStyle);

      pageHtml = pageHtml.replace(oldTag, newTag);
      changesOnPage++;
    }

    if (changesOnPage > 0) {
      html = html.replace(page.fullMatch, pageHtml);
      adjustments.push(
        `Page ${pageIdx + 1}: Set ${changesOnPage} section(s) to ${paddingPerGap}px padding-top (${gaps} gaps, ${Math.round(availableSpace)}px available)`
      );
    } else {
      adjustments.push(`Page ${pageIdx + 1}: Spacing already balanced`);
    }
  }

  writeFileSync(filePath, html, "utf-8");

  return NextResponse.json({
    success: true,
    pages: pageMatches.length,
    adjustments,
  });
}
