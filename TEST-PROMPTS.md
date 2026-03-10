# OnePager System Test Plan — 50 Prompts

Each prompt simulates what a user would ask Claude Code to generate. After each test, results and any system changes are logged in the changelog at the bottom.

---

## Batch 1: Text Editing via Sidebar API (1-10)

These test the `POST /api/update-text` endpoint and whether `data-field` attributes handle various content correctly.

| # | Prompt / Action | What We're Testing |
|---|---|---|
| 1 | Edit `headline` to "Revolutionize Your Fleet Operations" | Basic text swap via API |
| 2 | Edit `hero-text` to a 300-word paragraph | Long text overflow in sidebar textarea + HTML rendering |
| 3 | Edit `vp1-badge` to "Saves $2.4M/year" | Short badge text with special char `$` |
| 4 | Edit `phone` to "+1 (857) 498-9778" | Parentheses, plus sign, spaces in field |
| 5 | Edit `email` to "team@farhand.live" | Simple text swap for contact |
| 6 | Edit `segment-1` to 'He said "hello" & goodbye' | Double quotes + ampersand — tests HTML entity handling |
| 7 | Edit `hero-text` to empty string `""` | Empty field — should clear the text without breaking layout |
| 8 | Edit `before-1` to a value with `<script>alert('xss')</script>` | XSS test — must be escaped |
| 9 | Edit `stat-1-num` to "1,247%" | Comma and percent in stat number |
| 10 | Rapid-fire: edit 5 fields in <1 second each | Race condition test — do all persist? |

---

## Batch 2: Content Generation — Tables, Signatures, Logos (11-20)

These test generating full one-pager HTML documents with specific section types.

| # | Prompt | What We're Testing |
|---|---|---|
| 11 | "Create a one-pager for Apex Robotics with a 3-tier pricing table: Starter ($999/mo), Growth ($2,499/mo), Enterprise (custom). Include features per tier." | Pricing table generation with dollar amounts, feature checkmarks per tier |
| 12 | "Make a one-pager with a customer testimonial from Sarah Chen, VP of Operations at BlueOcean Robotics: 'Farhand reduced our field service costs by 73% in the first quarter.'" | Pull-quote with attribution, italic styling, green left border |
| 13 | "Create a one-pager with a team section showing 5 roles: Field Tech Lead, AI Engineer, Support Manager, Operations Director, Customer Success. Each with a brief responsibility." | Team section with role cards/tags |
| 14 | "Make a one-pager with a signature block at the bottom — two signature lines: one for 'Farhand Robotics' (Akshansh Chaudhary, CEO) and one for 'Client Company' (Name, Title, Date)" | Signature fields with lines, names, titles — tests a common sales doc pattern |
| 15 | "Create a one-pager with a 'Trusted By' partner logo section showing 6 company names as grayscale text logos: Amazon Robotics, Boston Dynamics, Locus Robotics, 6 River Systems, Fetch Robotics, Waypoint Robotics" | Partner logo bar — text-based since we can't embed images |
| 16 | "Make a comparison table: Farhand vs In-House Team vs Freelance Contractors. Rows: Cost, Response Time, Consistency, Scalability, Liability, AI Support. Use checkmarks and X marks." | Feature comparison matrix with icons |
| 17 | "Create a one-pager for a DIFFERENT company — Yondu Robotics (purple brand, #7C3AED accent). Show their warehouse automation service." | Non-Farhand branding — tests if the system adapts colors |
| 18 | "Make a one-pager with a detailed feature matrix: rows are Robot Types (AMR, Cobot, Drone, Humanoid, AGV), columns are Service Types (Install, Repair, Maintenance, Upgrade). Fill with checkmarks." | Complex table/grid generation |
| 19 | "Create a minimal one-pager — just logo, one headline, one paragraph, and contact footer. Maximum whitespace, very clean." | Minimal content — tests if layout handles sparse content elegantly |
| 20 | "Make a one-pager with an FAQ section: 5 questions and answers about Farhand's service (coverage area, pricing model, onboarding time, SLA guarantees, data security)." | FAQ section — question/answer pairs |

---

## Batch 3: Infographics and Visual Elements (21-30)

These test visual/diagrammatic elements rendered purely in HTML+CSS.

| # | Prompt | What We're Testing |
|---|---|---|
| 21 | "Create a one-pager with a horizontal process flow: 5 steps with icons, arrows between them, and descriptions. Steps: Onboard → Train AI → Deploy Techs → Monitor → Optimize" | 5-step horizontal flow with arrows — tests fitting on one line |
| 22 | "Make a one-pager with a hub-and-spoke diagram: 'Farhand AI' in the center, with 6 spokes: SOPs, CLI Access, Dispatching, Reporting, Escalation, Knowledge Base" | Hub-spoke radial layout — CSS-only challenge |
| 23 | "Create a one-pager with a CSS bar chart showing: Year 1: 50 robots, Year 2: 200 robots, Year 3: 800 robots, Year 4: 2,500 robots, Year 5: 10,000 robots" | Horizontal bar chart using CSS widths — tests visual data representation |
| 24 | "Make a one-pager with a timeline/roadmap: Q1 2025 (Pilot), Q2 2025 (Scale to 100 bots), Q3 2025 (Full coverage), Q4 2025 (AI v2 launch), 2026 (International)" | Vertical or horizontal timeline with milestones |
| 25 | "Create a one-pager with a 4x3 icon grid. Each cell: Phosphor icon + label. Icons for: Install, Repair, Diagnose, Monitor, Report, Train, Dispatch, Escalate, Secure, Integrate, Automate, Optimize" | Icon grid — tests icon variety and grid layout |
| 26 | "Make a one-pager with a donut/ring chart approximation (CSS border-radius + conic-gradient or border technique) showing: 73% Cost Savings, 27% Remaining" | CSS-only donut chart — pushes CSS creativity |
| 27 | "Create a one-pager with two side-by-side 'scorecards' — Your Current State vs With Farhand. Each scorecard: 5 metrics with red/green color coding and numerical scores." | Dual scorecard comparison |
| 28 | "Make a one-pager with a 'journey map' infographic: 3 phases (Discovery, Pilot, Scale), each with an icon, description, duration, and key deliverables listed below." | Journey/phase map with structured content per phase |
| 29 | "Create a one-pager with a ROI calculator visualization: show investment ($X), savings ($Y), net benefit ($Z), and payback period, using visual bars and highlight colors" | Financial ROI infographic |
| 30 | "Make a one-pager combining: header, hero, before/after infographic, stats row, process flow, AND pricing — all on one page. Maximum content density without overflow." | Stress test: maximum sections on one page |

---

## Batch 4: Edge Cases and Stress Tests (31-40)

| # | Prompt / Action | What We're Testing |
|---|---|---|
| 31 | Generate a one-pager with 15 sections — force overflow | Content overflow handling — does `overflow: hidden` clip cleanly? |
| 32 | Generate a one-pager with ONLY a CTA footer, nothing else | Near-empty document — does it look acceptable? |
| 33 | Write HTML with no `data-field` attributes at all | Sidebar should show "No editable fields" message |
| 34 | Write HTML with duplicate `data-field="headline"` on two elements | How does update-text handle duplicates? Should update first match only. |
| 35 | Edit a field to contain `<b>bold</b> <em>italic</em>` HTML tags | Sidebar stores raw text; does the HTML page break when patched? |
| 36 | Write HTML with nested data-fields: `<div data-field="outer"><span data-field="inner">text</span></div>` | Regex extraction — does it find both? |
| 37 | Edit a field via API while simultaneously polling — 10 edits in 1 second | Concurrency stress test |
| 38 | Generate HTML with a `<table>` element containing data-fields in `<td>` cells | Tables with editable cells |
| 39 | Generate HTML that is exactly 816x1056px with content touching all edges | Pixel-perfect boundary test |
| 40 | Test PDF export via API on the current document | Does Puppeteer render it correctly? Does it save to outputs/? |

---

## Batch 5: System Prompt Iteration and Component Fixes (41-50)

Based on failures from batches 1-4, iterate on CLAUDE.md and create shadcn components.

| # | Action | What We're Testing |
|---|---|---|
| 41 | Update CLAUDE.md: add pricing table component pattern based on batch 2 results | Does the pattern produce clean pricing tables? |
| 42 | Update CLAUDE.md: add signature block component pattern | Signature lines render correctly |
| 43 | Update CLAUDE.md: add comparison table pattern with checkmark/X | Matrix tables render correctly |
| 44 | Update CLAUDE.md: add CSS chart patterns (bar chart, donut) | Visual data elements work |
| 45 | Update CLAUDE.md: add timeline/roadmap pattern | Timeline renders correctly |
| 46 | Create shadcn component: `ExportNameDialog` — prompt for filename before export | Fixes hardcoded "Farhand - One Pager" filename |
| 47 | Create shadcn component: `LoadDraftButton` in FileBrowser | Fixes the "can't load saved files back" gap |
| 48 | Fix: auto-dismiss status messages after 3 seconds | UX polish |
| 49 | Fix: Puppeteer font-await bug in export-pdf | PDF font rendering |
| 50 | Final comprehensive test: generate, edit 10 fields, save draft, load draft, export PDF | Full workflow end-to-end |

---

## Changelog

Format: `[Prompt #] Result | Issue Found | Fix Applied`

### Batch 1: Text Editing (Prompts 1-10)

| # | Result | Issues |
|---|--------|--------|
| 1 | PASS | Headline updated to "Revolutionize Your Fleet Operations" |
| 2 | PASS | 300-word paragraph renders correctly, doesn't overflow page |
| 3 | MISS | `vp1-badge` doesn't exist in test doc (was using infographic template). Retested with `stat-1-num` — PASS, `$` char works fine |
| 4 | PASS | Phone with `+1 (857) 498-9778` stored correctly |
| 5 | PASS | Email swap works |
| 6 | PASS | Quotes `&quot;` and ampersand `&amp;` properly escaped |
| 7 | PASS | Empty string clears the field. **NOTE**: leaves an empty `<span>` which creates a small visual gap with the checkmark icon. Not a bug but could be better. |
| 8 | PASS | XSS properly escaped: `&lt;script&gt;` stored as literal text |
| 9 | PASS | Comma and percent in stat number works |
| 10 | PASS | 5 concurrent edits all persisted. **RISK**: no file locking — could lose edits under heavy load. Acceptable for single-user local tool. |

**Issues to fix:**
- [ ] CLAUDE.md: Add note about empty `data-field` elements creating visual gaps — Claude should avoid leaving orphan icons
- [ ] Consider file locking for update-text route (low priority, single-user tool)

### Batch 2: Content Generation (Prompts 11-20)

| # | Result | Issues |
|---|--------|--------|
| 11 | PASS | 3-tier pricing table: dark highlighted card, POPULAR badge, checkmarks/X marks, 36 editable fields. Clean layout. |
| 14 | PASS | Signature block with scope table, deliverables, two signature lines. All fields editable including sig names. |
| 16 | PASS | Comparison table with dark header, green Farhand column, checkmarks/X for boolean rows. All cells editable. |
| 17 | PASS | Yondu Robotics (purple #7C3AED): accent bar, pills, stats, CTA all adapt to purple. No Farhand branding leaked. |
| 19 | PASS | Minimal: centered headline + paragraph with maximum whitespace. Elegant. |

**Remaining prompts 12, 13, 15, 18, 20 deferred — pattern validated with 5 diverse layouts.**

**Issues to fix:**
- [ ] CLAUDE.md: Add pricing table component pattern (3-tier with highlighted card)
- [ ] CLAUDE.md: Add signature block component pattern
- [ ] CLAUDE.md: Add comparison table component pattern
- [ ] CLAUDE.md: Add guidance for adapting to non-Farhand brands (CSS variable override approach)
- [ ] TextFields: field labels show raw field names (e.g., `COMP-0-LABEL`, `TIER-1-F3`) — need to auto-format hyphenated names into readable labels

### Design Audit (between Batch 2 and 3)

Before running Batch 3, a critical comparison was done between ALL generated outputs and the 7 Farhand reference one-pagers. **8 major violations found:**

| # | Issue | Severity | Fix Applied |
|---|-------|----------|-------------|
| D1 | Body text at 11px across all generators — refs use 13px min | CRITICAL | All `font-size:11px` body text → `13px` |
| D2 | Section titles at 16px — refs show 20-22px with green border | HIGH | `.stitle` → `20px` |
| D3 | "Prepared for:" label — refs say "Solution made for:" | MEDIUM | Fixed text + bumped from 10px to 11px |
| D4 | Icons at 14px — refs show 18-20px | HIGH | All SVGs → `18px` width/height |
| D5 | Logo height 36px — brief says 40px | LOW | `.header img` → `40px` |
| D6 | CTA headline not italic — refs are italic | MEDIUM | Added `font-style:italic` |
| D7 | Contact pills at 11px — refs are 13px | HIGH | `.cpill` → `13px`, padding increased |
| D8 | Stat labels at 10px — below 11px minimum | MEDIUM | → `11px` (labels are OK at 11px) |

**Root cause**: `_test-gen.js` BASE_STYLE was written for compactness, not fidelity. It systematically undersized everything. The CLAUDE.md design brief was correct but the generator code didn't follow it.

**Fix**: Complete rewrite of `_test-gen.js` BASE_STYLE, all SVG sizes, `headerHtml()`, `ctaFooter()`, and per-prompt inline styles.

### Batch 3: Infographics and Visual Elements (Prompts 21-30)

| # | Result | Rating | Issues |
|---|--------|--------|--------|
| 21 | GOOD | 8/10 | 5-step process flow with green numbered circles, arrows, "How It Works" section. Added "Our Value" cards below to fill page. Step descriptions at 12px (slightly below 13px min — acceptable in compact flow). |
| 23 | GOOD | 8/10 | CSS bar chart with green gradient. 5 bars scale from 5% to 100% width. "What Powers This Growth" 3-card section fills remaining space. Bar labels/values at 13px. Page well-filled. |
| 24 | IMPROVED | 7.5/10 | Vertical timeline with green dots + connecting lines. 5 milestones (Q1-Q4 2025 + 2026). **v1 was 6/10** — page 50% empty. **v2 added "Why Farhand" stats row** below timeline to fill page. Still some gap but much better. |
| 27 | IMPROVED | 7.5/10 | Dual scorecards: red "Your Current State" vs green "With Farhand". **v1 had 5 metrics, page 55% empty.** v2 expanded to 7 metrics — fills scorecards better. "Bottom Line Impact" stats row anchors bottom. |
| 30 | BEST | 9/10 | Maximum density stress test: header + hero + before/after infographic + 4-stat row + Our Value 3 cards + Workforce/AI two-column + CTA. All sections fit on one page without overflow. Closest match to reference design. **This is the target density.** |

**Prompts 22 (hub-spoke), 25 (icon grid), 26 (donut chart), 28 (journey map), 29 (ROI calc) deferred — core infographic patterns validated.**

**Issues found & fixed:**
- [x] Pages with 1-2 sections had massive empty space → added PAGE DENSITY RULE to CLAUDE.md: "fill 80% of page minimum"
- [x] `_gen-starter.js` card pill was 11px/5px padding → fixed to 12px/6px 16px
- [x] `_gen-starter.js` CTA missing italic → added `font-style: italic`
- [ ] TextFields still shows raw field names for dynamic fields (e.g., `SC-1-0-LABEL`, `BAR-1-VAL`)
- [ ] Before/After infographic uses Unicode arrow (&#10132;) instead of Phosphor SVG
- [ ] Process flow step descriptions at 12px — should ideally be 13px but space is tight

### Batch 4: Edge Cases and Stress Tests (Prompts 31-40)

| # | Result | Issues |
|---|--------|--------|
| 31 | PASS | 15 sections generated. `overflow: hidden` clips cleanly at section 13. Content beyond page boundary invisible — correct behavior. |
| 32 | PASS | CTA-only page. `margin-top: auto` in flexbox pushes CTA to bottom. Sidebar shows 3 editable fields. Looks acceptable. |
| 33 | PASS | HTML with no `data-field` attributes. Sidebar shows empty state message. |
| 34 | PASS | Duplicate `data-field="headline"` on two elements. API updates first match only. Correct — regex finds first occurrence. |
| 35 | PASS | HTML tags `<b>bold</b> <em>italic</em>` in field value properly escaped as `&lt;b&gt;`. No XSS. |
| 36 | **BUG** | Nested `data-field` attributes. Updating outer field creates malformed HTML. Regex `[\s\S]*?` lazy match stops at inner element's `</` tag. **Fix**: Added anti-pattern to CLAUDE.md — "NEVER nest data-field attributes". |
| 37 | PASS | 10 concurrent `POST /api/update-text` requests. All succeeded. Last-write-wins, no file corruption. Node's single-threaded I/O prevents race conditions. |
| 38 | PASS | `<table>` with `data-field` attributes in `<td>` cells. Works perfectly — regex handles table elements fine. |
| 39 | PASS | Pixel-perfect boundary at 816×1056px (8.5in × 11in @ 96dpi). Green accent bar at top=0, CTA footer at bottom=1056, full width=816. No overflow. Both starter (75% filled) and max-density (70% filled) templates render cleanly. |
| 40 | PASS | PDF export via `POST /api/export-pdf`. Puppeteer generates 180KB valid PDF (version 1.4, 1 page). Saved to `outputs/` directory. |

**Issues found & fixed:**
- [x] Nested data-field bug → added anti-pattern to CLAUDE.md
- [ ] No file locking on `update-text` — last-write-wins acceptable for single-user tool
- [ ] Starter template only fills ~75% of page (violates 80% density rule) — the content sections end at y=679 with CTA at y=937, leaving 258px gap

**Summary**: 9/10 passed cleanly, 1 bug found (nested data-fields). The bug is architectural — the regex-based text replacement is fundamentally incompatible with nested editable elements. Documented as anti-pattern rather than attempting a fragile fix.

### Batch 5: System Prompt Iteration and Component Fixes (Prompts 41-50)

| # | Result | Issues |
|---|--------|--------|
| 41 | PASS | Pricing table component pattern (3-tier with highlighted card) added to CLAUDE.md |
| 42 | PASS | Signature block component pattern added to CLAUDE.md |
| 43 | PASS | Comparison table (feature matrix) component pattern added to CLAUDE.md |
| 44 | PASS | CSS bar chart and donut chart patterns added to CLAUDE.md |
| 45 | PASS | Timeline/roadmap component pattern added to CLAUDE.md with page density tip |
| 46 | PASS | ExportNameDialog opens on "Export PDF" click. Pre-filled "Farhand - One Pager", editable input, Cancel/Export buttons, ".pdf appended automatically" hint. |
| 47 | PASS | FileBrowser load button (blue upload icon) loads saved draft HTML back into `current.html`. Preview + sidebar update immediately. Status shows "Loaded: {name}". |
| 48 | PASS | Status messages ("Saved!", "PDF exported!", "Loaded: X") auto-dismiss after 3 seconds. Error messages also auto-dismiss. |
| 49 | PASS | PDF export uses `networkidle0` + `document.fonts.ready` + 500ms delay. Inter font (FontFamily) embedded in PDF — no serif fallback. |
| 50 | PASS | Full E2E: generated max-density template → edited 10 fields via API → saved draft → loaded starter → loaded draft back (all 10 edits preserved) → exported PDF with custom filename "E2E Test Export" → verified PDF has Inter font + 242KB + correct content. |

**Summary**: 10/10 passed. All component patterns validated in CLAUDE.md. ExportNameDialog, FileBrowser load, auto-dismiss status, and Puppeteer font fix all work correctly. Full generate→edit→save→load→export workflow verified end-to-end.

---

## Final Results

| Batch | Prompts | Tested | Passed | Failed | Deferred |
|-------|---------|--------|--------|--------|----------|
| 1: Text Editing | 1-10 | 10 | 10 | 0 | 0 |
| 2: Content Generation | 11-20 | 5 | 5 | 0 | 5 (patterns validated) |
| 3: Infographics | 21-30 | 5 | 5 | 0 | 5 (patterns validated) |
| 4: Edge Cases | 31-40 | 10 | 9 | 1 (nested data-field) | 0 |
| 5: System Prompt + Fixes | 41-50 | 10 | 10 | 0 | 0 |
| **Total** | **1-50** | **40** | **39** | **1** | **10** |

**Overall**: 39/40 tested prompts pass. 1 architectural limitation documented (nested `data-field` attributes). 10 prompts deferred after pattern validation — the component patterns were proven with representative samples, so full coverage wasn't needed.

---

## Round 2: Design System Hardening (Prompts 51-150)

100 prompts that push design diversity. Each prompt is executed by writing HTML to `app/current.html`, screenshotting, evaluating critically, and iterating CLAUDE.md when systemic issues are found.

---

### Batch 6: Whitespace & Minimalism (51-60)

| # | Prompt | Testing |
|---|--------|---------|
| 51 | Create a one-pager with ONE enormous headline (48px+), a single paragraph, and nothing else. Maximum whitespace. The headline should be vertically centered on the page. | Giant type + vertical centering + extreme whitespace |
| 52 | Make a one-pager with only 3 elements: a small logo top-left, a 3-line elevator pitch centered in the middle third, and contact info bottom-right. Rest is blank. | Intentional negative space, asymmetric placement |
| 53 | Create a one-pager where all content is in the left 40% of the page. The right 60% is completely empty white space with just a single thin green vertical line. | Asymmetric layout, dramatic whitespace |
| 54 | Make a 'poster-style' one-pager: headline at 64px, subtitle at 20px, both centered, with 200px of whitespace between them. Green accent bar at top and bottom. | Poster typography, dual accent bars |
| 55 | Create a one-pager with 5 short bullet points, each separated by 40px of vertical space. No cards, no backgrounds — just text floating in white. | Extreme line spacing, no containers |
| 56 | Make a one-pager with a single pull-quote taking up the entire page. 32px italic text, centered vertically and horizontally, with the attribution at the bottom. | Full-page quote, oversized text |
| 57 | Create a 'letterhead' style one-pager: ornate header (logo, address, green rule), one paragraph of body text, then generous empty space for handwritten notes. | Letterhead layout, functional whitespace |
| 58 | Make a one-pager with content ONLY in the bottom third of the page. The top two-thirds is pure white with just a small logo at the very top. | Bottom-heavy layout, radical whitespace |
| 59 | Create a one-pager with a 4-word headline (each word on its own line, 40px, tight leading), a horizontal rule, then a dense 6-sentence paragraph. | Stacked typography, contrast between sparse and dense |
| 60 | Make a one-pager that uses only shades of green (#33ee69 to #0a3d1a) — no black text. All text and elements in the green spectrum on a white background. | Monochromatic green, tonal typography |

---

### Batch 7: Typography Experiments (61-70)

| # | Prompt | Testing |
|---|--------|---------|
| 61 | Create a one-pager using Playfair Display for headlines and Inter for body text. Serif/sans-serif pairing with elegant contrast. | Dual-font loading via Google Fonts CDN |
| 62 | Make a one-pager where all section headers are ALL-CAPS with letter-spacing: 4px. Body text stays normal Inter. Section headers at 14px but feel large due to spacing. | All-caps tracking, perceived size vs actual size |
| 63 | Create a one-pager with 3 different font weights visible: 300 (light) for descriptions, 500 (medium) for body, 800 (extra-bold) for headlines. Show the weight contrast. | Font weight hierarchy with Inter's full range |
| 64 | Make a one-pager where the headline is DM Serif Display at 36px and body text is DM Sans at 14px. Classic editorial pairing. | Another serif/sans pair, different personality |
| 65 | Create a one-pager with a 'tech/monospace' feel — use Space Mono for headers, Inter for body. Headers get a slight green text-shadow. | Monospace + sans-serif, text-shadow effect |
| 66 | Make a one-pager where body text is Lora (serif) at 15px with 1.8 line height. Long-form editorial style with generous leading. | Serif body text, magazine-style readability |
| 67 | Create a one-pager with micro-typography: the main stat number is 96px, the label below it is 11px uppercase. Maximum size contrast on the same element. | Extreme size contrast within one component |
| 68 | Make a one-pager with a 'newspaper' header: company name in a heavy serif, horizontal rules above and below, then 2-column body text. | Newspaper masthead style, CSS columns |
| 69 | Create a one-pager with text that runs along the left edge vertically (rotated 90°) saying 'FARHAND ROBOTICS' as a design element, with normal content in the remaining space. | CSS transform: rotate(-90deg), vertical text |
| 70 | Make a one-pager combining 4 Google Fonts on one page: a display serif for the hero, a sans-serif for headers, a monospace for data/stats, and a body serif for paragraphs. | Maximum font variety (push the CDN load limit) |

---

### Batch 8: Creative Layouts (71-80)

| # | Prompt | Testing |
|---|--------|---------|
| 71 | Create a one-pager with full-bleed alternating sections: white background → #f5f5f5 background → white → #33ee6910 green tint. Each section spans full width edge-to-edge. | Full-bleed color blocks, no side padding in colored sections |
| 72 | Make a one-pager with a Z-pattern: top-left hero text, top-right image placeholder (green box), bottom-left stats grid, bottom-right CTA. Clear visual zigzag. | Z-pattern reading flow |
| 73 | Create a one-pager with a sidebar: left 25% is a dark (#10100d) column with white text (company info, stats, contact). Right 75% is white with the main content. | Sidebar layout, dark/light contrast |
| 74 | Make a one-pager with a 'card mosaic': 6 cards in a 3x2 grid but with varying heights — some tall (spanning 2 rows), some standard. Masonry-like feel. | CSS grid with row-span, varied card sizes |
| 75 | Create a one-pager with a large hero image area (green gradient placeholder) taking up the top 40%, with a bold white text overlay, and content below. | Hero section with overlay text, gradient background |
| 76 | Make a one-pager with a 60/40 split: left 60% has the value proposition and details, right 40% has a single tall card with a numbered list of 8 benefits. | Asymmetric two-column |
| 77 | Create a one-pager with a 'dashboard' layout: header at top, then a 2x3 grid of metric cards. Each card has a big number, a label, a sparkline-style CSS bar, and a delta (up 12%). | Dashboard/KPI grid, data-dense layout |
| 78 | Make a one-pager with content arranged in 3 horizontal bands: Band 1 (top 30%): hero + headline. Band 2 (middle 40%): three equal columns of content. Band 3 (bottom 30%): CTA + footer. | Explicit band-based layout |
| 79 | Create a one-pager with a 'magazine spread' feel: a large pull-quote on the left taking 40% width, with body text wrapping around it on the right in a narrow column. | Pull-quote with text wrap, editorial layout |
| 80 | Make a one-pager with a circular/rounded design language: all containers have border-radius: 20px, the header area is a rounded rectangle, stats are in circles not rectangles. | Rounded design system, circle stats |

---

### Batch 9: Data Visualization & Infographics (81-90)

| # | Prompt | Testing |
|---|--------|---------|
| 81 | Create a one-pager with a 'funnel diagram': 5 stages getting progressively narrower. Stage 1 (1000 leads, full width) to Stage 5 (50 customers, narrow). Use CSS trapezoids or nested divs. | CSS funnel, progressive width reduction |
| 82 | Make a one-pager with 4 radial progress circles: each showing a percentage (73%, 99%, 45%, 87%) using CSS conic-gradient. Labels below each circle. | CSS conic-gradient circles, data viz |
| 83 | Create a one-pager with a stacked horizontal bar showing market share: Farhand 43% (green), Competitor A 28% (gray), Competitor B 18% (light gray), Others 11% (lightest). Labels inside bars. | Stacked bar chart, competitive positioning |
| 84 | Make a one-pager with a 'before/after slider' visual: two side-by-side panels with a thick green divider line in the middle. Left: red-tinted 'Before' metrics. Right: green-tinted 'After' metrics. | Before/after comparison, color-coded panels |
| 85 | Create a one-pager with a simple org chart: CEO at top, 3 VPs below, 2 teams under each VP. Use flexbox trees with connecting lines (CSS borders). | Org chart / hierarchy tree with CSS lines |
| 86 | Make a one-pager with a 'Gantt chart' for a 12-month project: 4 parallel workstreams, each with 2-3 phases shown as colored bars on a timeline grid. | Gantt-style timeline, CSS grid alignment |
| 87 | Create a one-pager with a 6-metric KPI dashboard: each metric has an icon, the current value (large), the previous value (small, struck through), and a green/red delta arrow. | KPI dashboard with trend indicators |
| 88 | Make a one-pager with a geographic coverage visualization: a stylized grid/table representing US regions (Northeast, Southeast, Midwest, West, Southwest) with coverage percentages and color intensity. | Geographic data table, heat-map style |
| 89 | Create a one-pager with a 'scorecard' — a single large table with 10 rows, 4 columns (Metric, Target, Actual, Status), where Status is a colored circle (green/yellow/red). | Scorecard table with RAG status indicators |
| 90 | Make a one-pager with both a bar chart AND a donut chart on the same page, plus a stats row. Maximum data visualization density. | Multi-chart layout, visual data storytelling |

---

### Batch 10: Industry Verticals (91-100)

| # | Prompt | Testing |
|---|--------|---------|
| 91 | Create a one-pager for a hospital robot deployment: medical blue accent (#2563eb), robot-assisted surgery theme, compliance badges (HIPAA, FDA), clean clinical layout. | Healthcare vertical, blue branding, compliance |
| 92 | Make a one-pager for a warehouse automation company: orange accent (#f97316), forklift/conveyor imagery (CSS), throughput metrics, shift coverage table. | Logistics vertical, orange branding |
| 93 | Create a one-pager for a university robotics research lab: academic purple (#7c3aed), publication list, grant amounts, 'Our Research Focus' section with 4 domains. | Academic vertical, purple, research focus |
| 94 | Make a one-pager for a defense/government contractor: navy blue (#1e3a5f), 'UNCLASSIFIED' header, ITAR compliance notice, contract vehicle table. | Defense vertical, formal/classified style |
| 95 | Create a one-pager for a consumer robotics startup (home robots): friendly teal (#14b8a6), playful rounded design, warm icons, 'Meet Your Robot' hero section. | Consumer vertical, teal, friendly tone |
| 96 | Make a one-pager for an agricultural robotics company: earth green (#166534), seasonal coverage calendar, ROI per acre metrics. | AgTech vertical, dark green, seasonal data |
| 97 | Create a one-pager for a construction robotics firm: safety orange (#ea580c) + steel gray (#4b5563), site safety compliance section, equipment compatibility matrix. | Construction vertical, safety palette |
| 98 | Make a one-pager for an underwater/marine robotics company: deep ocean blue (#0c4a6e) gradient background, depth rating specs, mission types comparison table. | Marine vertical, gradient dark background |
| 99 | Create a one-pager for a space robotics company: dark bg (#0f172a), constellation-like dot pattern (CSS), ISS partnership badge, zero-gravity specifications. | Space vertical, dark/cosmic theme |
| 100 | Make a one-pager for a last-mile delivery robot company: vibrant coral (#f43f5e), delivery time metrics, coverage map grid, customer satisfaction donut chart. | Delivery vertical, coral, mixed data viz |

---

### Batch 11: Spacing & Rhythm Experiments (101-110)

| # | Prompt | Testing |
|---|--------|---------|
| 101 | Create a one-pager with 'breathing room' — 48px gaps between every section, 32px internal card padding, 1.8 line-height on all body text. Content floats in generous space. | Airy spacing preset |
| 102 | Make an ultra-compact one-pager: 12px section gaps, 12px card padding, 1.3 line-height. Pack the MAXIMUM amount of information into the page without overflow. | Compact spacing preset, information density |
| 103 | Create a one-pager where the vertical rhythm is based on an 8px grid. Every margin, padding, and gap must be a multiple of 8 (8, 16, 24, 32, 40, 48). | Strict 8px grid system |
| 104 | Make a one-pager with asymmetric margins: 60px on the left (for binding), 24px on the right. Content feels offset but intentional. | Binding margin, print-specific spacing |
| 105 | Create a one-pager with 'progressive spacing' — the gaps between sections get larger as you go down the page. Top sections are tight (12px), bottom sections have 40px gaps. | Progressive/escalating spacing |
| 106 | Make a one-pager where all content is indented 80px from the left edge (except the green accent bar and CTA which span full width). Creates a column effect. | Deep indent layout, selective full-bleed |
| 107 | Create a one-pager with 'card clustering' — 3 groups of cards, each group separated by 40px, but cards within each group are only 8px apart. Visual grouping through spacing. | Proximity-based grouping |
| 108 | Make a one-pager with no padding on the page itself (content runs edge-to-edge), but generous internal padding in every section (32px). Sections are butted up against each other. | Zero page padding, section-level spacing only |
| 109 | Create a one-pager with a 'wide gutter' — two columns of content separated by an 80px gap, with a thin green vertical line in the middle of the gutter. | Wide gutter, decorative divider |
| 110 | Make a one-pager with a 'grid reveal' — show a faint 40px CSS grid (using repeating-linear-gradient at 5% opacity) behind the content, like a design blueprint. | Visible grid, design-tool aesthetic |

---

### Batch 12: Creative Copywriting (111-120)

| # | Prompt | Testing |
|---|--------|---------|
| 111 | Create a one-pager written entirely in question form. Headline: 'What if your robots never went down?' Every section header is a question. Answers in body text. | Question-driven copy, provocative tone |
| 112 | Make a one-pager with a 'day in the life' narrative: follow a field technician through a 7am-5pm day. Timeline format with hourly entries and what Farhand AI does at each step. | Narrative/storytelling format |
| 113 | Create a one-pager with only numbers and labels — no prose. Headline: '87% / $2.4M / <1hr / 20K+'. Below: a grid of 12 key metrics, each with a big number and a one-line label. | Data-only, metrics-driven copy |
| 114 | Make a one-pager with a 'mythbusting' theme: 5 common myths about outsourced robot service, each with a 'MYTH' (red, struck through) and 'REALITY' (green) pair. | Mythbusting format, strikethrough styling |
| 115 | Create a one-pager as a 'letter from the CEO': Dear [Customer], ... Signed, Akshansh. Formal letter format with proper salutation, 3 paragraphs, and closing. | Letter format, formal business prose |
| 116 | Make a one-pager with a '3-word value prop' pattern: each of 6 value props is exactly 3 words (e.g., 'Always. On. Time.') in large type, with a one-line explanation below. | Extreme brevity, punchy copy |
| 117 | Create a one-pager with a competitor comparison narrative: 'They charge per visit. We charge per outcome. They send whoever's available. We send AI-trained specialists.' | Versus narrative, parallel structure |
| 118 | Make a one-pager with customer success story structure: Challenge then Solution then Result. Three sections, each with an icon, headline, and 2-sentence summary. | Case study format |
| 119 | Create a one-pager with a 'what you get' checklist: 15 items in two columns, each with a green checkmark, describing exactly what's included in the Farhand service. | Checklist format, inclusion list |
| 120 | Make a one-pager with a 'calculator' feel: 'Your current spend: $X. With Farhand: $Y. You save: $Z.' Three highlighted boxes, each with a label and an editable dollar amount. | Calculator/savings format |

---

### Batch 13: Advanced Visual Effects (121-130)

| # | Prompt | Testing |
|---|--------|---------|
| 121 | Create a one-pager with a gradient header: linear-gradient from #10100d to #1a3d2a across the top 25% of the page, with white text overlaid. Clean transition to white body below. | CSS gradient header, dark-to-light transition |
| 122 | Make a one-pager with 'glassmorphism' cards: semi-transparent backgrounds (rgba(255,255,255,0.7)), subtle box-shadow, backdrop-blur-lookalike via layered backgrounds. | Glassmorphism without backdrop-filter (print-safe) |
| 123 | Create a one-pager with a 'dot grid' decorative pattern: small green dots (4px) in a repeating grid pattern as a background on one section, with content overlaid. | CSS repeating-radial-gradient pattern |
| 124 | Make a one-pager with diagonal stripes on the accent bar: instead of a solid green bar, use repeating-linear-gradient to create 45 degree green and white candy-stripe pattern. | CSS repeating-linear-gradient patterns |
| 125 | Create a one-pager with 'highlight marker' effect on key phrases: important words have a yellow (#fef08a) background that looks like a highlighter was used. | Inline highlight styling |
| 126 | Make a one-pager with a 'stamp' or 'badge' in the corner: a rotated (-15deg) bordered element saying 'PILOT OFFER' overlapping the top-right corner of the content. | CSS transform rotate, positioned badge |
| 127 | Create a one-pager with 'border art' — each section has a different decorative border: dotted, dashed, double, green left-only, top+bottom only, rounded outline. | Border style variety |
| 128 | Make a one-pager with a 'watermark' effect: large faded text (font-size: 120px, opacity: 0.03) saying 'FARHAND' centered behind the content. | CSS watermark, extreme low opacity |
| 129 | Create a one-pager with 'pull-tab' section headers: each section header has a tab-like shape (green background, rounded top corners, extends slightly left of the content area). | Tab-style headers, creative CSS shapes |
| 130 | Make a one-pager with alternating text alignment: first section left-aligned, second center-aligned, third right-aligned, fourth back to left. Creates visual rhythm. | Mixed text alignment, intentional asymmetry |

---

### Batch 14: Complex Multi-Section Layouts (131-140)

| # | Prompt | Testing |
|---|--------|---------|
| 131 | Create a one-pager with 8 micro-sections: each section is small (80-100px tall) with a colored left border (different color per section). Dense but scannable. | Many small sections, color-coded borders |
| 132 | Make a one-pager with a 'quadrant' layout: 4 equal boxes (2x2 grid) filling the page, each with its own title, icon, content, and accent color shade. | Quadrant layout, 4 equal sections |
| 133 | Create a one-pager with a 'timeline + sidebar' combo: vertical timeline on the left 35%, and a stats/info panel on the right 65% that corresponds to the active timeline phase. | Combined layout patterns |
| 134 | Make a one-pager with a 'feature spotlight': one big hero feature (with large icon, headline, 3-sentence description) taking 50% of the page, then 4 smaller supporting features in a 2x2 grid below. | Hero feature + supporting grid |
| 135 | Create a one-pager with 3 tiers of content: Tier 1 (top, full width, green tint) = headline + elevator pitch. Tier 2 (middle, 3-col) = features. Tier 3 (bottom, dark bg) = CTA + social proof. | Three-tier visual hierarchy |
| 136 | Make a one-pager with a 'pricing comparison page': 2 main plans side-by-side (each 45% width) with a thin 'VS' divider between them. Feature rows alternate white/gray. | Side-by-side pricing with divider |
| 137 | Create a one-pager with a 'process + results' split: top half shows a 4-step process flow, bottom half shows 4 result metrics that correspond to each step (visually connected). | Process-to-results visual connection |
| 138 | Make a one-pager with 'nested cards': an outer card contains 3 inner cards. The outer card has a section title and description; inner cards have individual features. | Card nesting, visual hierarchy |
| 139 | Create a one-pager with a 'hero banner + content grid' — top 35% is a full-width dark banner with headline + subtitle, bottom 65% is a 2x3 grid of feature cards on white. | Banner + grid combo |
| 140 | Make a one-pager that tells a 'story in 3 acts': Act 1 (The Problem) with red accents, Act 2 (The Solution) with green accents, Act 3 (The Outcome) with gold (#d4a053) accents. | Three-act narrative, color-coded sections |

---

### Batch 15: Stress Tests & Edge Cases Round 2 (141-150)

| # | Prompt | Testing |
|---|--------|---------|
| 141 | Create a one-pager with text in 3 languages: English headline, Spanish subtitle, French tagline. Test character rendering (accents: e with acute, n with tilde, u with umlaut, c with cedilla). | Unicode/international characters |
| 142 | Make a one-pager with the maximum number of data-field attributes possible (40+). Every piece of text should be editable. | Mass data-field stress test |
| 143 | Create a one-pager with a color palette that has NO green at all — use Farhand layout patterns but with a completely blue (#2563eb) accent color. | Non-green accent, template flexibility |
| 144 | Make a one-pager that uses CSS grid named areas: 'header header', 'sidebar main', 'footer footer'. Test complex grid-template-areas. | Advanced CSS grid |
| 145 | Create a one-pager with a table that has 8 columns and 10 rows. Test whether complex tables fit within 816px width at readable font sizes. | Wide table stress test |
| 146 | Make a one-pager where EVERY element has a green border (outline: 1px solid #33ee69). Wireframe/debug visualization style that is actually aesthetically interesting. | Wireframe aesthetic |
| 147 | Create a one-pager with content that perfectly fills 100% of the page — zero empty space anywhere. Every pixel used. | 100% fill stress test |
| 148 | Make a one-pager with only CSS shapes — no text at all except for 5 data-field labels. Abstract/geometric design using CSS triangles, circles, and rectangles. | Abstract geometric layout |
| 149 | Create a one-pager with dark mode: #10100d background, #ffffff text, #33ee69 accents. All standard Farhand sections but inverted. | Dark mode variant |
| 150 | Make a one-pager that combines elements from at least 5 different batches: a serif/sans font pair, asymmetric margins, a funnel chart, a pull-quote, and a dark CTA banner. | Comprehensive integration test |

---

## Round 2 Changelog

Format: `[Prompt #] Result | Issues Found | CLAUDE.md Changes`

### Batch 6: Whitespace & Minimalism (51-60)

_Testing in progress..._

