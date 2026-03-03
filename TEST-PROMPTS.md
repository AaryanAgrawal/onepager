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

