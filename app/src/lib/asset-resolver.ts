/**
 * Asset resolver for {{ASSET:path}} and {{LOGO}} template variables.
 *
 * On LOAD: resolves templates to base64 data URIs
 * On SAVE: converts known asset data URIs back to templates
 */
import { readFileSync, existsSync } from "fs";
import path from "path";

const ONEPAGER_ROOT = path.join(process.cwd(), "..");

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

// Search directories for assets (relative to onepager/)
const SEARCH_DIRS = ["", "assets", "brand", "references/assets"];

function findAsset(assetPath: string): string | null {
  // Try exact path first
  const exact = path.join(ONEPAGER_ROOT, assetPath);
  if (existsSync(exact)) return exact;

  // Try search directories
  const basename = path.basename(assetPath);
  for (const dir of SEARCH_DIRS) {
    const candidate = path.join(ONEPAGER_ROOT, dir, basename);
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function fileToDataUri(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  // .txt files contain raw base64 already
  if (ext === ".txt") {
    const b64 = readFileSync(filePath, "utf-8").trim();
    return `data:image/png;base64,${b64}`;
  }

  const mime = MIME_TYPES[ext];
  if (!mime) return "";

  const bytes = readFileSync(filePath);
  const b64 = bytes.toString("base64");
  return `data:${mime};base64,${b64}`;
}

/**
 * Resolve all {{ASSET:path}} and {{LOGO}} templates to base64 data URIs.
 * Used when loading a document from documents/ into current.html.
 */
export function resolveAssets(html: string): string {
  // Resolve {{LOGO}} shorthand
  let resolved = html.replace(/\{\{LOGO\}\}/g, () => {
    const logoPath = findAsset("brand/logo-w-type-light-base64.txt");
    if (!logoPath) return "{{LOGO}}";
    return fileToDataUri(logoPath);
  });

  // Resolve {{ASSET:path}} templates
  resolved = resolved.replace(/\{\{ASSET:([^}]+)\}\}/g, (_match, assetPath: string) => {
    const filePath = findAsset(assetPath.trim());
    if (!filePath) {
      console.warn(`[asset-resolver] Asset not found: ${assetPath}`);
      return _match; // Leave template in place if not found
    }
    return fileToDataUri(filePath);
  });

  return resolved;
}

/**
 * Build a map of known asset data URIs for reverse-resolution.
 * Scans assets/, brand/, and references/assets/ for image files.
 */
function buildAssetMap(): Map<string, string> {
  const map = new Map<string, string>();
  const fs = require("fs");

  for (const dir of SEARCH_DIRS) {
    const dirPath = path.join(ONEPAGER_ROOT, dir);
    if (!existsSync(dirPath)) continue;

    try {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(file).toLowerCase();

        if (!MIME_TYPES[ext] && ext !== ".txt") continue;

        try {
          const stat = fs.statSync(filePath);
          if (!stat.isFile() || stat.size > 10_000_000) continue; // Skip files > 10MB

          const dataUri = fileToDataUri(filePath);
          if (dataUri) {
            const relativePath = path.relative(ONEPAGER_ROOT, filePath).replace(/\\/g, "/");
            map.set(dataUri, `{{ASSET:${relativePath}}}`);
          }
        } catch {
          // Skip unreadable files
        }
      }
    } catch {
      // Skip unreadable directories
    }
  }

  return map;
}

/**
 * Convert base64 data URIs back to {{ASSET:path}} templates.
 * Used when saving current.html back to documents/.
 */
export function unresolveAssets(html: string): string {
  const assetMap = buildAssetMap();

  let result = html;
  assetMap.forEach((template, dataUri) => {
    if (result.includes(dataUri)) {
      result = result.split(dataUri).join(template);
    }
  });

  return result;
}
