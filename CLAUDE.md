# Claude Code Instructions — OnePager

<!-- STRUCTURE NOTE: Operational discipline rules are at the TOP (highest retrieval accuracy).
     Design reference and section library are in the MIDDLE.
     Anti-patterns are at the BOTTOM (second highest retrieval). -->

## WHAT THIS IS

A local tool for creating branded multi-page documents and one-pager PDFs. **You write the HTML directly.** The web app at localhost:3001 is a document workspace — it polls `app/current.html` every 500ms and shows a live preview. Documents are organized in `documents/` with a folder sidebar.

---

## OPERATIONAL DISCIPLINE — Read This First

### 0. Auto-Start — Run Everything on Session Start (STRICT)

The user should NEVER run terminal commands themselves. Claude handles everything.

When a user starts Claude, you MUST immediately:

1. If `onepager/` doesn't exist yet, clone it:
```bash
git clone https://github.com/AaryanAgrawal/onepager.git
```

2. Pull latest:
```bash
cd onepager && git pull origin main
```

3. **Kill any existing dev server** before starting a new one. Only ONE instance should run at a time:
```bash
# Kill any existing Next.js dev servers to avoid port conflicts
pkill -f "next dev" 2>/dev/null || true
sleep 1
cd app && npm install && npm run dev &
cd ..
```

4. Tell the user: "Preview is live at http://localhost:3001 — what would you like to create?"

**IMPORTANT: Never run multiple dev servers.** Always kill existing ones first. If ports 3000-3001 are occupied, kill the old process — don't let Next.js auto-increment to 3002, 3003, etc.

### 1. Git Sync — Push and Pull at EVERY Step (STRICT)

This project MUST stay synced with GitHub at all times. No exceptions. Every meaningful change gets committed AND pushed immediately — not batched, not deferred.

**On session start:** (handled by Auto-Start above — includes `git pull`)

**After EVERY change (document, code, config, CLAUDE.md, memory):**
```bash
git add documents/ references/ brand/ assets/ memory/ app/src/ CLAUDE.md
git commit -m "descriptive message in imperative mood"
git push origin main
```

This means: write HTML → commit + push. Edit CLAUDE.md → commit + push. Fix spacing → commit + push. **Every step, not just at the end.**

**Before EVERY edit session (if time has passed or context was reset):**
```bash
git pull origin main
```

**Rules:**
- NEVER leave uncommitted changes. If you wrote HTML, commit it immediately.
- NEVER leave unpushed commits. Every commit gets pushed right away. Not later, not at session end — NOW.
- NEVER start editing without pulling first. Another session may have pushed changes.
- Commit messages must describe WHAT changed: "Update Farhand page 2 spacing to fix overflow" not "fix stuff"
- If git pull has conflicts, resolve them before doing anything else.
- Only push to `main` branch. Most changes will be in: `documents/`, `references/`, `brand/`, `assets/`, `memory/`, `app/src/`
- The cadence is: **pull → edit → check spacing → fix → commit → push → repeat**

### 2. Self-Improvement — Learn From Every Session (STRICT)

This system gets better with every interaction. Preferences and corrections are tracked in `onepager/memory/`.

**After EVERY user correction or preference expressed:**
1. Update `memory/preferences.md` with the pattern (what they corrected + what they wanted instead)
2. If it's a design rule, add it to the ANTI-PATTERNS section of this CLAUDE.md
3. If it's a "do this always" preference, add it to the relevant section of this CLAUDE.md

**Before EVERY new document:**
1. Read `memory/preferences.md` — apply ALL recorded preferences
2. Read `memory/feature-radar.md` — check if any tracked features are relevant
3. If the user previously corrected something similar, apply the correction preemptively

**Memory files:**
```
onepager/memory/
├── preferences.md    # Design likes/dislikes, corrections, patterns
└── feature-radar.md  # Tracked feature requests + build status
```

**Self-improvement is not optional.** If the user says "don't do X" or "always do Y", that goes into `memory/preferences.md` AND into the relevant CLAUDE.md section within the same session. Don't wait. Don't forget. The next session must be better than this one.

### 3. Feature Radar — Track and Build Proactively

Track what gets requested. If a pattern shows up 2+ times, it's a feature worth building.

**In `memory/feature-radar.md`:**
```markdown
## Tracked Requests
| Request | Count | Status | Notes |
|---------|-------|--------|-------|
| Easier image embedding | 3 | BUILT | {{ASSET:path}} template system |
| Drag-and-drop images | 1 | WATCHING | Would need UI work |
```

**Rules:**
- After each session, scan what the user asked for and log patterns
- At count=2: propose the feature to the user
- At count=3: build it without asking (if scope is reasonable)
- Mark features as WATCHING → PROPOSED → BUILDING → BUILT
- When a feature is BUILT, document it in CLAUDE.md and remove from radar

---

## WORKFLOW

1. User asks you to create or edit a document
2. You read `references/` for style examples (7 Farhand reference images + any HTML files)
3. You read `brand/logo-w-type-light-base64.txt` for the Farhand logo
4. You write complete HTML to `app/current.html`
5. **Run spacing check** (see below) — fix any overflow or whitespace issues before showing to user
6. Web app auto-refreshes the preview within 500ms
7. User reviews in browser, comes back with feedback
8. You edit `app/current.html` based on their feedback
9. **Run spacing check again** — every edit must pass before moving on
10. Repeat until happy, then save to `documents/` folder via sidebar or API
11. Export as PDF via "Export PDF" button
12. **Commit and push** — every saved document change gets committed immediately

### Spacing Check — Mandatory After Every HTML Write (STRICT)

After EVERY write or edit to `app/current.html`, you MUST call:

```bash
curl -s http://localhost:3001/api/check-spacing
```

This endpoint uses Puppeteer to measure the actual rendered content height of each `.page` div and returns a JSON report.

**Response format:**
```json
{
  "pages": [
    { "page": 1, "status": "OK", "overflow": 0, "whitespace": 0, "advice": "Page 1 fits well." },
    { "page": 2, "status": "OVERFLOW", "overflow": 94, "advice": "Page 2 overflows by 94px (~5 lines). Cut content or reduce font/spacing." }
  ],
  "summary": "1 page(s) OVERFLOW..."
}
```

**Rules:**
- If ANY page has `status: "OVERFLOW"` — you MUST fix it before showing the result to the user. Reduce padding, font sizes, margins, or cut content until all pages pass.
- If ANY page has `status: "EXCESS_WHITESPACE"` — consider increasing spacing or adding content to fill the page.
- If ALL pages have `status: "OK"` — proceed.
- **Never skip this step.** Overflow = content the user can't see. This is a hard blocker.
- If the dev server is not running, start it first, then run the check.

### Documents Directory Workflow

Documents are stored in `documents/` and organized by folder. The sidebar shows a tree view from `documents/_tree.json`.

- **Load**: Click a document in the sidebar → loads from `documents/{path}` into `app/current.html`. Asset templates (`{{ASSET:path}}`) are resolved to base64 data URIs at load time.
- **Edit**: Modify `app/current.html` directly (live preview updates instantly)
- **Save**: Click "Save" → writes `app/current.html` back to `documents/{path}`. Base64 data URIs from known assets are converted back to `{{ASSET:path}}` templates.
- **New document**: Write HTML to `app/current.html`, then save via API to a document path

When adding a new document, update `documents/_tree.json` to include it in the tree.

## AGENT DELEGATION

When performing document work, delegate to specialized agents (`.claude/agents/`) instead of doing everything in the main context.

| Task | Agent | When to Use |
|------|-------|-------------|
| Create/edit wireframe | `wireframer` | User describes content, wants to structure a document |
| Render one page of HTML | `page-renderer` | Wireframe approved, ready to build HTML |
| Check & fix spacing | `spacing-fixer` | After ANY write to current.html |
| Audit wireframe compliance | `wireframe-auditor` | After HTML edits to wireframed documents |

### Parallel Page Rendering

For multi-page documents, launch one `page-renderer` agent per page:

1. Read the wireframe and split by page sections
2. Launch N agents in parallel, each with:
   - Page number and wireframe section text (copy-paste the content, not file path)
   - Output path: `app/_page-{N}.html` (just the inner `.page` div content)
   - Shared assets: logo base64 string, partner logo base64, color palette hex values
   - Any SVG diagram content needed for that page
3. Wait for all agents to complete
4. Assemble: read all `_page-{N}.html` files, wrap in `<!DOCTYPE>` + `<head>` + `<style>` + `<body>`
5. Write assembled HTML to `app/current.html`
6. Launch `spacing-fixer` agent
7. If wireframe exists, launch `wireframe-auditor` agent

### Small Edits (Non-Parallel)

For small edits (change text, adjust spacing, swap icon), edit `app/current.html` directly without agents. Only use agents for full page renders, spacing fix loops, or wireframe compliance audits.

## WORKING FILE

**Always write to: `app/current.html`**

This is the single active document. The web app polls this file and displays it in an iframe preview. When the user clicks "Export PDF", the server reads this file and runs it through Puppeteer.

## HTML RULES

Every document must be a complete, standalone HTML document:

- `<!DOCTYPE html>` with `<html>`, `<head>`, `<body>`
- **US Letter dimensions**: width 8.5in (816px), height 11in (1056px) per page
- All CSS must be inline or in a `<style>` tag — no external stylesheets
- **No JavaScript** — pure HTML + CSS only
- Google Fonts via CDN link is OK (Inter is the default font)
- Images must be base64 data URLs embedded in the HTML
- Print-safe CSS is mandatory

### Single-Page Documents

```css
@page { size: 8.5in 11in; margin: 0; }
body {
  width: 8.5in;
  height: 11in;
  overflow: hidden;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

### Multi-Page Documents

For documents with 2+ pages, use `.page` divs instead of constraining the body:

```css
@page { size: 8.5in 11in; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 8.5in; margin: 0 auto; font-family: 'Inter', sans-serif;
  -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
.page { width: 8.5in; height: 11in; overflow: hidden; position: relative;
  box-sizing: border-box; page-break-after: always; display: flex; flex-direction: column; }
.page:last-child { page-break-after: auto; }
@media screen {
  body { background: #e8e8e8; padding: 32px 0; }
  .page { margin: 0 auto 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    border-radius: 4px; background: #fff; }
  .page:last-child { margin-bottom: 0; }
}
@media print {
  .page { margin: 0; box-shadow: none; border-radius: 0; }
}
```

Each `.page` div is one US Letter page. The preview panel auto-detects `.page` divs and shows them stacked with gaps. PDF export uses `page-break-after: always` for proper page breaks.

**Key rules for multi-page:**
- Each `.page` div must be exactly `8.5in × 11in` with `overflow: hidden`
- Content must NOT overflow individual pages
- Use `margin-top: auto` on footer/CTA divs to push them to bottom of each page
- The body is a flowing container — NOT constrained to one page height
- Logos must be base64-embedded (no `{{LOGO}}` placeholders in documents/ files — embed directly)

## DATA-FIELD ATTRIBUTES

Add `data-field="name"` to **every text element** that a user might want to quick-edit in the sidebar:

```html
<h1 data-field="headline">Your Headline Here</h1>
<p data-field="hero-text">Your description here.</p>
<span data-field="vp1-badge">Badge Text</span>
```

The web app extracts these and shows them as editable text fields in the left sidebar. **Be generous** — every piece of text content should have a `data-field`. Common field names:

- `subtitle` — company tagline below logo
- `hero-text` — intro paragraph
- `segment-1`, `segment-2`, `segment-3` — "Solution made for" target pills
- `vp1-title`, `vp1-desc`, `vp1-badge`, `vp2-title`, `vp2-desc`, `vp2-badge`, `vp3-title`, `vp3-desc`, `vp3-badge` — value prop cards
- `workforce-1` through `workforce-4` — workforce column items
- `platform-1` through `platform-4` — AI platform column items
- `cta-text` — CTA headline
- `phone`, `email`, `website` — contact details

---

## DESIGN SYSTEM (delegated to `page-renderer` agent)

All design rules, HTML component patterns, typography tables, spacing rules, section library, and sizing/density rules live in the **`page-renderer`** agent (`.claude/agents/page-renderer.md`). When rendering HTML pages, delegate to that agent.

**Quick reference (kept here for convenience):**

### Default Contact Info

| Field | Value |
|-------|-------|
| Phone | 857-498-9778 |
| Email | aaryan@farhand.live |
| Website | www.farhand.live |

### Logo

Read `brand/logo-w-type-light-base64.txt` and embed as `data:image/png;base64,{contents}`. Use the full logo with text, NOT the square icon (`logo-250-base64.txt`).



---

## ASSET EMBEDDING — `{{ASSET:path}}` Template System

Images are embedded via template variables that the server resolves automatically. No more manual base64 encoding or Python scripts.

### How It Works

1. Drop image files into `assets/`, `brand/`, or `references/assets/`
2. In your HTML document, reference them with `{{ASSET:path}}`:
   ```html
   <img src="{{ASSET:brand/logo-w-type-light.png}}" style="height:40px;" alt="Farhand">
   <img src="{{ASSET:assets/us-map.png}}" style="width:100%;" alt="Coverage map">
   <img src="{{ASSET:references/assets/product-photo.jpg}}" style="width:200px;" alt="Product">
   ```
3. When the document is **loaded** from `documents/` → `current.html`, the server resolves all `{{ASSET:path}}` to `data:image/{ext};base64,...` data URIs
4. When the document is **saved** from `current.html` → `documents/`, the server converts known asset data URIs back to `{{ASSET:path}}` templates
5. Documents in `documents/` stay **small and git-friendly** (just path references)
6. `current.html` has **full base64** for live preview and PDF export

### Shorthand: `{{LOGO}}`

`{{LOGO}}` is an alias for `{{ASSET:brand/logo-w-type-light-base64.txt}}` — the full Farhand logo with text. Use this for quick access:
```html
<img src="{{LOGO}}" style="height:40px;" alt="Farhand">
```

### Supported Formats

PNG, JPG, JPEG, GIF, SVG, WebP. The server detects MIME type from the file extension.

### Asset Search Order

The server searches for the asset in this order:
1. Exact path relative to `onepager/` (e.g., `assets/map.png` → `onepager/assets/map.png`)
2. `assets/` directory (e.g., `map.png` → `onepager/assets/map.png`)
3. `brand/` directory (e.g., `logo.png` → `onepager/brand/logo.png`)
4. `references/assets/` directory

### Image Rules

- Always set explicit `width`, `height`, or `max-width` — never let images overflow the page
- Max recommended widths: 600px for full-width, 200px for cards, 120px for heroes, 64px for avatars
- Use `object-fit: cover` for thumbnails and avatars to prevent distortion
- Always include meaningful `alt` text
- For `.txt` files containing raw base64 (like `logo-w-type-light-base64.txt`), the server reads the text content directly as base64
- For binary image files (PNG, JPG, etc.), the server reads and base64-encodes them

### Adding a New Image (Workflow)

1. Save the image file to `assets/` (or `brand/` for logos, `references/assets/` for reference material)
2. In your HTML: `<img src="{{ASSET:assets/filename.png}}" ...>`
3. Load the document — server resolves automatically
4. Done. No scripts, no manual encoding, no 1MB base64 strings in your HTML.

---

## REFERENCES

Before generating a new one-pager, **always check** `references/` for style examples:
- **Images (PNG, JPG)**: 7 Farhand reference one-pagers — match their visual style
- **HTML files**: read them and replicate their style
- **Text files**: content sources — use the `wireframer` agent for content extraction
- `urls.txt`: list of URLs to reference (read the file, fetch URLs if needed)

The reference images show the canonical Farhand one-pager style. Study them for layout, spacing, and visual weight before creating new documents.

## EDITING AN EXISTING ONE-PAGER

When the user asks to edit:
1. Read `app/current.html`
2. Make the requested changes
3. Write the modified HTML back to `app/current.html`

Preserve the overall structure. Don't rewrite sections the user didn't ask to change.

## BUILD & RUN

```bash
cd app
npm install
npm run dev    # http://localhost:3001
```

## SAVING AND EXPORTING

The web app handles saving and PDF export through buttons in the UI:
- **Save**: copies `current.html` to `outputs/{timestamp}/`
- **Export PDF**: reads `current.html`, runs through Puppeteer, saves PDF + HTML to `outputs/`

The sidebar in the web app shows all saved files with clickable links to open them.

## FILE STRUCTURE

```
onepager/
├── app/
│   ├── current.html              # THE WORKING FILE (you write here)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Document workspace + sidebar + polling
│   │   │   └── api/
│   │   │       ├── current-html/ # GET — returns current.html contents
│   │   │       ├── export-pdf/   # POST — Puppeteer PDF export
│   │   │       ├── documents/
│   │   │       │   ├── tree/     # GET — returns _tree.json
│   │   │       │   ├── load/     # POST — loads doc, resolves {{ASSET:path}} → base64
│   │   │       │   └── save/     # POST — saves doc, un-resolves base64 → {{ASSET:path}}
│   │   │       └── ...
│   │   ├── components/
│   │   │   ├── PreviewPanel.tsx   # iframe preview with zoom + multi-page support
│   │   │   ├── DocumentTree.tsx   # Folder tree sidebar (recursive)
│   │   │   ├── FileBrowser.tsx    # Saved exports list (collapsible)
│   │   │   └── TextFields.tsx     # Inline text editor
│   │   └── lib/
│   │       ├── types.ts           # SavedFile, EditableField, TreeNode
│   │       ├── asset-resolver.ts  # {{ASSET:path}} resolve/unresolve engine
│   │       └── utils.ts           # Helpers
│   ├── outputs/                   # Saved versions (gitignored)
│   └── package.json
├── assets/                        # Embeddable images (auto-resolved via {{ASSET:path}})
├── documents/                     # Organized document library (git-tracked)
│   ├── _tree.json                # Folder structure metadata
│   ├── Client Communication/     # Client-facing docs
│   └── Company Materials/        # Internal company docs
│       ├── Field/
│       │   ├── Farhand.html      # 3-page sales document
│       │   └── Approved Copy.html # Approved marketing copy reference
│       ├── Data/
│       └── Teleop/
├── memory/                        # Self-improvement state (git-tracked)
│   ├── preferences.md            # Design likes/dislikes, corrections
│   └── feature-radar.md          # Tracked feature requests + status
├── brand/                         # Farhand logo + colors
│   ├── logo-w-type-light-base64.txt  # Base64 full logo ({{LOGO}} shorthand)
│   ├── logo-w-type-light.png     # Full logo with text (light bg)
│   ├── logo-w-type-dark.png      # Full logo with text (dark bg)
│   ├── logo-500x500.png          # Square symbol logo
│   ├── logo-250-base64.txt       # Base64 square icon (legacy — do not use)
│   ├── favicon.svg               # Browser tab icon
│   └── colors.css                # CSS custom properties
├── references/                    # Style examples for Claude to match
│   ├── AMR.png                   # AMR support one-pager (PAGE 1 REFERENCE)
│   ├── assets/                   # Embeddable reference images
│   │   └── us-map-farhand.png    # US coverage map for page 2
│   ├── Farhand Teleoperation.png # Teleoperation one-pager
│   ├── Generic Support Partner.png
│   ├── Research Labs.png
│   ├── variant-pricing-focus.png # Pricing-focused variant
│   ├── pilot-engagement-template.png # Pilot engagement summary
│   ├── farhand-logo-icon.png     # Logo on green background
│   ├── README.md
│   └── urls.txt
├── CLAUDE.md                      # This file — the system prompt
├── README.md
└── PRD.md
```

## WIREFRAME COMPLIANCE — ZERO DEVIATION (STRICT)

When a `.md` wireframe file exists for a document (e.g., `documents/Marketing Materials/Farhand-wireframe.md`), the wireframe is the **single source of truth**. The HTML output MUST match it exactly. No creative liberty. No "improvements". No deviations.

**Before ANY write or edit to a wireframed document:**
1. Read the wireframe file
2. Verify every section, title, stat, description, and layout instruction matches
3. If you're unsure whether a change breaks compliance — re-read the wireframe

**Rules — non-negotiable:**
- **Do NOT deviate from the wireframe** — section order, content, layout structure, and copy must match what the wireframe specifies. This includes section titles, body text, stats, descriptions, card content, CTA copy — everything.
- **Do NOT add sections, cards, stats, or content** that aren't in the wireframe. If the wireframe doesn't mention it, it doesn't go on the page.
- **Do NOT remove or rearrange sections** unless the wireframe is updated first.
- **Do NOT paraphrase or reword** wireframe copy. Use the exact wording. "field technician rapidly" stays "field technician rapidly", not "quick field tech dispatch".
- **Icons specified in the wireframe** — use exactly those Phosphor icon names. Don't substitute.
- **Layout directions** (e.g., "2 columns", "3-column cards", "full-width bar") — follow precisely.
- **If the user asks for changes that conflict with the wireframe** — update the wireframe FIRST, then update the HTML to match. Both files must always agree.
- **If you notice the HTML has drifted from the wireframe** — fix the HTML to match the wireframe, not the other way around (unless the user explicitly says to update the wireframe).

**This rule exists because:** Claude tends to "improve" copy, rearrange sections, or add content that wasn't asked for. For sales documents, every word matters. The wireframe is approved copy. Don't touch it.

## ANTI-PATTERNS

- NEVER use JavaScript in the HTML output
- NEVER use external CSS files in templates
- NEVER skip `print-color-adjust: exact` — PDFs will lose backgrounds
- NEVER let content overflow the page boundary
- NEVER use SVG for layout (Puppeteer rendering issues) — pure HTML/CSS only
- NEVER hardcode Farhand branding when creating for a different company
- NEVER forget `data-field` attributes on editable text elements
- NEVER use emojis — use Phosphor Icons as inline SVGs
- NEVER use text smaller than 12px — not for stat labels, subtitles, captions, or ANY element. Body text minimum is 13px.
- NEVER use 9-10px text for anything — this was a recurring violation. Stat labels, header subtitles, and attribution lines were all shrinking to 9-10px. The hard floor is 12px.
- NEVER leave 25%+ of the page as empty whitespace — if content is sparse, scale UP text/spacing/icons to fill the page
- NEVER use `brand/logo-250-base64.txt` — use `brand/logo-w-type-light-base64.txt`
- NEVER nest `data-field` attributes (e.g., `<div data-field="a"><span data-field="b">`) — the update-text regex breaks on nested fields. Each `data-field` element must contain ONLY text, no child elements with their own `data-field`.
- NEVER produce a page that looks like a plain letterhead — even minimalist layouts need visual structure (cards, borders, stats, rules). Every page should read as a designed sales document.
- NEVER fabricate numbers, stats, claims, or data — only use what's in Approved Copy or sourced from verified partner websites (e.g., fieldnation.com). If a stat doesn't exist in an approved source, don't put it on the page. Ask the user instead.
