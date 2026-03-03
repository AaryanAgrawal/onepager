# Claude Code Instructions — OnePager

## WHAT THIS IS

A local tool for creating branded one-pager PDFs. **You write the HTML directly.** The web app at localhost:3000 is just a viewer — it polls `app/current.html` every 500ms and shows a live preview.

## WORKFLOW

1. User asks you to create or edit a one-pager
2. You read `references/` for style examples (7 Farhand reference images + any HTML files)
3. You read `brand/logo-w-type-light-base64.txt` for the Farhand logo
4. You write complete HTML to `app/current.html`
5. Web app auto-refreshes the preview within 500ms
6. User reviews in browser, comes back with feedback
7. You edit `app/current.html` based on their feedback
8. Repeat until happy, then user clicks "Export PDF" in the web app

## WORKING FILE

**Always write to: `app/current.html`**

This is the single active document. The web app polls this file and displays it in an iframe preview. When the user clicks "Export PDF", the server reads this file and runs it through Puppeteer.

## HTML RULES

Every one-pager must be a complete, standalone HTML document:

- `<!DOCTYPE html>` with `<html>`, `<head>`, `<body>`
- **US Letter dimensions**: width 8.5in (816px), height 11in (1056px)
- All CSS must be inline or in a `<style>` tag — no external stylesheets
- **No JavaScript** — pure HTML + CSS only
- Google Fonts via CDN link is OK (Inter is the default font)
- Images must be base64 data URLs embedded in the HTML
- Content must never overflow one page — use `overflow: hidden` on body
- Print-safe CSS is mandatory:

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

## DESIGN BRIEF — FARHAND VISUAL LANGUAGE

This section defines the exact Farhand one-pager style. Based on 7 reference designs in `references/`. **Follow this strictly for all Farhand documents.**

### Color Palette

Store these as CSS custom properties in every document:

```css
:root {
  --accent: #33ee69;          /* Farhand green */
  --accent-light: #33ee6920;  /* Green at 12% opacity */
  --primary: #10100d;         /* Near-black — all body text */
  --bg: #ffffff;              /* White page background */
  --gray-light: #f5f5f5;     /* Card/section backgrounds */
  --gray-border: #e0e0e0;    /* Subtle borders */
  --text-secondary: #666666; /* Secondary/description text */
}
```

### Logo

Read `brand/logo-w-type-light-base64.txt` and embed as:
```html
<img src="data:image/png;base64,{contents}" style="height:40px;" alt="Farhand">
```

This is the full logo with the circuit icon + "Farhand" text. Use this for all Farhand documents, NOT the square icon.

### Default Contact Info

| Field | Value |
|-------|-------|
| Phone | 213-522-6220 |
| Email | akshansh@farhand.live |
| Website | www.farhand.live |

When the user specifies a different company, adapt colors, logo, and contact info accordingly.

### Layout Structure (Standard Farhand One-Pager)

```
┌──────────────────────────────────────────────┐
│ ██████████ 5px green accent bar █████████████ │
│                                              │
│ [Logo + Farhand]     Solution made for:      │
│  Your ___ partner    [Pill 1] [Pill 2]       │
│                      [Pill 3]                │
│                                              │
│ Intro paragraph describing the service...    │
│                                              │
│ ─── Our Value ───────────────────────────    │
│                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │ Title    │ │ Title    │ │ Title    │      │
│ │ Desc     │ │ Desc     │ │ Desc     │      │
│ │ [Badge]  │ │ [Badge]  │ │ [Badge]  │      │
│ └──────────┘ └──────────┘ └──────────┘      │
│                                              │
│ Workforce ⚙      AI Platform 🤖             │
│ ① Item 1          • Creates SOPs            │
│ ② Item 2          • CLI troubleshooting     │
│ ③ Item 3          • Live escalation          │
│ ④ Item 4          • Service reports          │
│                    • Integrations            │
│                                              │
│ Let's talk about a free pilot                │
│ [📞 Phone] [📧 Email] [🌐 Website]          │
└──────────────────────────────────────────────┘
```

### Typography

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Company name (in logo area) | Handled by logo image | — | Part of the logo PNG |
| Subtitle ("Your __ partner") | 13-14px | 400 | Gray text below logo |
| Section title ("Our Value") | 20-22px | 700 | With green left border accent |
| Card title | 15-16px | 700 | Inside value prop cards |
| Body text / descriptions | 13-14px | 400 | **Never smaller than 13px** |
| Pill badge text | 12-13px | 600 | Inside green-bordered pills |
| Labels ("Solution made for:") | 11-12px | 500 | Uppercase, muted gray |
| CTA headline | 20-22px | 700 | Bold, dark |
| Contact text | 13px | 500 | Inside footer pills |

**MINIMUM TEXT SIZE: 11px.** No text on the page should ever be smaller. Body text minimum is 13px.

### Spacing

| Element | Value |
|---------|-------|
| Top accent bar | 5px height, full width, `#33ee69` |
| Page padding | 40px horizontal, 32px top (below accent bar), 24px bottom |
| Section gap | 20-24px between major sections |
| Card grid gap | 16-20px between cards |
| Card internal padding | 20-24px |
| Pill padding | 6px 16px |
| Border radius | 10px for cards, 20px for pills |
| Line height | 1.5 for body text, 1.3 for headings |

### Icons — Phosphor Icons as Inline SVGs

**NEVER use emojis.** Use Phosphor Icons embedded as inline `<svg>` elements. Since one-pagers are pure HTML+CSS (no JS), icons must be pasted as raw SVG markup.

Get SVG paths from https://phosphoricons.com — use the "Regular" weight (1.5px stroke).

Common icon mappings:

| Concept | Phosphor Icon Name |
|---------|-------------------|
| Support / Wrench | `Wrench` |
| AI / Robot | `Robot` |
| Growth / Chart | `ChartLineUp` |
| Security / Shield | `ShieldCheck` |
| Team / Users | `Users` |
| Checkmark | `CheckCircle` |
| Phone | `Phone` |
| Email | `EnvelopeSimple` |
| Website / Globe | `Globe` |
| Fleet / Truck | `Truck` |
| Money / Pricing | `CurrencyDollar` |
| Time / Clock | `Clock` |
| Location | `MapPin` |
| Document | `FileText` |
| Tools / Gear | `GearSix` |
| Network | `Graph` |

**SVG embed pattern** (example — Phone icon at 20px):
```html
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#33ee69" viewBox="0 0 256 256">
  <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.17-1.4,8.12,8.12,0,0,0,.75-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/>
</svg>
```

Color the SVG `fill` attribute: `#33ee69` for accent/decorative contexts, `#10100d` for text-adjacent contexts.

Size: 20px for inline with text, 24px for standalone/section headers.

### Component Patterns

**Green accent bar (top of page)**:
```html
<div style="width:100%; height:5px; background:#33ee69;"></div>
```

**Header with "Solution made for" pills**:
```html
<div style="display:flex; justify-content:space-between; align-items:flex-start; padding:24px 40px 16px;">
  <div>
    <img src="data:image/png;base64,..." style="height:40px;" alt="Farhand">
    <p data-field="subtitle" style="font-size:13px; color:#666; margin:4px 0 0;">Your field support partner</p>
  </div>
  <div style="text-align:right;">
    <p style="font-size:11px; font-weight:500; color:#999; text-transform:uppercase; margin:0 0 8px;">Solution made for:</p>
    <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
      <span data-field="segment-1" style="...pill...">Robotics Companies</span>
      <span data-field="segment-2" style="...pill...">Research Labs</span>
    </div>
  </div>
</div>
```

**Green pill badge**:
```html
<span style="display:inline-block; padding:6px 16px; border:1.5px solid #33ee69; border-radius:20px; font-size:12px; font-weight:600; color:#10100d;">
  Badge Text
</span>
```

**Section title with green left border**:
```html
<h2 style="font-size:20px; font-weight:700; color:#10100d; margin:0; padding-left:12px; border-left:3px solid #33ee69;">
  Our Value
</h2>
```

**Value prop card (3-column grid)**:
```html
<div style="background:#f5f5f5; border-radius:10px; padding:20px; display:flex; flex-direction:column; gap:12px;">
  <h3 data-field="vp1-title" style="font-size:16px; font-weight:700; margin:0; color:#10100d;">Card Title</h3>
  <p data-field="vp1-desc" style="font-size:13px; color:#666; margin:0; line-height:1.5;">Description text goes here.</p>
  <span data-field="vp1-badge" style="display:inline-block; padding:6px 16px; border:1.5px solid #33ee69; border-radius:20px; font-size:12px; font-weight:600; color:#10100d; align-self:flex-start;">
    Summary Badge
  </span>
</div>
```

**Green numbered bullet (for Workforce / AI Platform sections)**:
```html
<div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:10px;">
  <span style="display:flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:50%; background:#33ee69; color:#10100d; font-size:12px; font-weight:700; flex-shrink:0;">1</span>
  <span data-field="workforce-1" style="font-size:13px; color:#10100d; line-height:1.5;">20k+ trained field techs</span>
</div>
```

**Bullet with green checkmark (for AI Platform)**:
```html
<div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px;">
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#33ee69" viewBox="0 0 256 256" style="flex-shrink:0; margin-top:2px;">
    <path d="...CheckCircle path..."/>
  </svg>
  <span data-field="platform-1" style="font-size:13px; color:#10100d;">Creates interactive SOPs from your docs</span>
</div>
```

**CTA footer with contact pills**:
```html
<div style="margin-top:auto; padding:20px 40px;">
  <h2 data-field="cta-text" style="font-size:20px; font-weight:700; color:#10100d; margin:0 0 16px;">Let's talk about a free pilot</h2>
  <div style="display:flex; gap:12px; flex-wrap:wrap;">
    <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border:1.5px solid #33ee69; border-radius:24px; font-size:13px; font-weight:500; color:#10100d;">
      <svg ...phone icon.../> <span data-field="phone">213-522-6220</span>
    </span>
    <span style="...same pill style...">
      <svg ...email icon.../> <span data-field="email">akshansh@farhand.live</span>
    </span>
    <span style="...same pill style...">
      <svg ...globe icon.../> <span data-field="website">www.farhand.live</span>
    </span>
  </div>
</div>
```

---

## PAGE DENSITY RULE — FILL THE PAGE

**Every one-pager must fill at least 80% of the page vertically.** The Farhand reference designs ALWAYS fill the page — no huge empty gaps between content and footer.

When your primary content (e.g., a timeline, pricing table, or comparison chart) doesn't fill the page:
1. Add a **stats row** (4 metrics in green accent text)
2. Add a **"Our Value" 3-card section** with pill badges
3. Add a **Workforce / AI Platform two-column** section
4. Add a **process flow** or additional info section

Combine sections until the page feels complete. The CTA footer should sit near the bottom with minimal gap above it. Use `margin-top: auto` on the CTA to push it down, but the content above should fill the space naturally.

---

## SECTION LIBRARY

Pick sections based on the content. You don't need all of them — choose what fits. The patterns above show the standard Farhand layout, but adapt freely for different content types.

### Header
Logo on left + subtitle. Optional "Solution made for:" pills on right. Green accent bar at very top of page.

### Hero / Intro
2-3 sentence paragraph describing the company/service. Full width. Regular weight body text (13-14px).

### Value Propositions ("Our Value")
Section title with green left border. 3-column card grid. Each card: bold title, description paragraph, green pill badge at bottom. Cards on `#f5f5f5` background with 10px radius.

### Two-Column Feature Split
Left: "Workforce" with Phosphor icon, green numbered bullets (1, 2, 3, 4).
Right: "AI Platform" with Phosphor icon, green checkmark bullets.
Separated by a light border or gap.

### Pricing Table (3-Tier)

Three side-by-side cards. Middle card is "POPULAR" with dark background. Each tier: name, price, feature list with checkmarks/X marks.

```html
<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
  <!-- Standard tier -->
  <div style="background:#f5f5f5; border-radius:10px; padding:24px; display:flex; flex-direction:column;">
    <h3 data-field="tier-1-name" style="font-size:16px; font-weight:700; margin:0 0 4px;">Starter</h3>
    <div data-field="tier-1-price" style="font-size:24px; font-weight:800; color:var(--accent); margin-bottom:16px;">$999/mo</div>
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
      <!-- CheckCircle SVG 18px fill=#33ee69 --> <span data-field="tier-1-f1" style="font-size:13px;">Feature included</span>
    </div>
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
      <!-- X SVG 18px fill=#ef4444 --> <span data-field="tier-1-f2" style="font-size:13px; color:#999;">Feature not included</span>
    </div>
  </div>
  <!-- Highlighted tier (POPULAR) -->
  <div style="background:#10100d; border-radius:10px; padding:24px; display:flex; flex-direction:column; color:#fff; position:relative;">
    <span style="position:absolute; top:-10px; right:16px; background:var(--accent); color:#10100d; font-size:11px; font-weight:700; padding:4px 12px; border-radius:10px;">POPULAR</span>
    <h3 data-field="tier-2-name" style="font-size:16px; font-weight:700; margin:0 0 4px; color:#fff;">Growth</h3>
    <div data-field="tier-2-price" style="font-size:24px; font-weight:800; color:var(--accent); margin-bottom:16px;">$2,499/mo</div>
    <!-- features with white text -->
  </div>
  <!-- Enterprise tier -->
  <div style="background:#f5f5f5; border-radius:10px; padding:24px; display:flex; flex-direction:column;">
    <!-- same structure as Starter -->
  </div>
</div>
```

### Signature Block

For proposals and agreements. Scope table + deliverables + two signature lines.

```html
<div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:24px;">
  <!-- Left: scope/deliverables -->
  <div>
    <h3 style="font-size:15px; font-weight:700; margin-bottom:12px;">Scope</h3>
    <table style="width:100%; font-size:13px; border-collapse:collapse;">
      <tr><td style="padding:8px 0; border-bottom:1px solid #e0e0e0; font-weight:600;" data-field="scope-1-label">Duration</td>
          <td style="padding:8px 0; border-bottom:1px solid #e0e0e0;" data-field="scope-1-val">30 days</td></tr>
      <!-- more rows -->
    </table>
  </div>
  <!-- Right: deliverables list -->
  <div>
    <h3 style="font-size:15px; font-weight:700; margin-bottom:12px;">Deliverables</h3>
    <!-- green checkmark bullets -->
  </div>
</div>
<!-- Signature lines -->
<div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:32px;">
  <div>
    <div style="border-bottom:1px solid #10100d; margin-bottom:8px; height:40px;"></div>
    <div data-field="sig-1-name" style="font-size:13px; font-weight:700;">Akshansh Chaudhary, CEO</div>
    <div data-field="sig-1-company" style="font-size:12px; color:#666;">Farhand Robotics</div>
  </div>
  <div>
    <div style="border-bottom:1px solid #10100d; margin-bottom:8px; height:40px;"></div>
    <div data-field="sig-2-name" style="font-size:13px; font-weight:700;">Name, Title</div>
    <div data-field="sig-2-company" style="font-size:12px; color:#666;">Client Company</div>
  </div>
</div>
```

### Comparison Table (Feature Matrix)

Column-based comparison with checkmarks and X marks. Farhand column highlighted in green.

```html
<table style="width:100%; border-collapse:collapse; font-size:13px;">
  <thead>
    <tr style="background:#10100d; color:#fff;">
      <th style="padding:12px 16px; text-align:left; font-weight:600; border-radius:8px 0 0 0;">Feature</th>
      <th style="padding:12px 16px; text-align:center; font-weight:600; background:#166534; color:#fff;">Farhand</th>
      <th style="padding:12px 16px; text-align:center; font-weight:600;">In-House</th>
      <th style="padding:12px 16px; text-align:center; font-weight:600; border-radius:0 8px 0 0;">Freelance</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e0e0e0;">
      <td style="padding:10px 16px; font-weight:500;" data-field="comp-0-label">Cost</td>
      <td style="padding:10px 16px; text-align:center; background:#f0fdf4;" data-field="comp-0-farhand">$850/visit</td>
      <td style="padding:10px 16px; text-align:center;" data-field="comp-0-inhouse">$2,400/visit</td>
      <td style="padding:10px 16px; text-align:center;" data-field="comp-0-freelance">$1,800/visit</td>
    </tr>
    <!-- For boolean rows, use CheckCircle SVG (green) or X SVG (red) instead of text -->
  </tbody>
</table>
```

### CSS Bar Chart

Horizontal bars using CSS widths. Green gradient fill. Labels on left, values inside bars.

```html
<div style="padding:24px; background:#f5f5f5; border-radius:10px;">
  <div style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
    <div style="width:60px; font-size:13px; font-weight:600; flex-shrink:0;" data-field="bar-1-label">Year 1</div>
    <div style="flex:1; height:32px; background:#e0e0e0; border-radius:6px; overflow:hidden;">
      <div style="width:20%; height:100%; background:linear-gradient(90deg, #33ee69, #2bc857); border-radius:6px; display:flex; align-items:center; justify-content:flex-end; padding-right:10px; min-width:50px;">
        <span style="font-size:13px; font-weight:700;" data-field="bar-1-val">200</span>
      </div>
    </div>
    <div style="width:60px; font-size:12px; color:#666; text-align:right;">robots</div>
  </div>
  <!-- repeat for each bar, increasing width % -->
</div>
```

### Timeline / Roadmap

Vertical timeline with green dots and connecting lines. Milestone labels, titles, descriptions.

```html
<div style="padding:20px 24px; background:#f5f5f5; border-radius:10px;">
  <div style="display:flex; gap:16px; align-items:flex-start;">
    <div style="display:flex; flex-direction:column; align-items:center; flex-shrink:0; width:20px;">
      <div style="width:16px; height:16px; border-radius:50%; background:#33ee69; flex-shrink:0;"></div>
      <div style="width:2px; flex:1; background:#33ee6950; min-height:40px;"></div>
    </div>
    <div style="padding-bottom:16px; flex:1;">
      <div style="font-size:11px; font-weight:600; color:#33ee69; text-transform:uppercase; margin-bottom:2px;" data-field="ms-1-label">Q1 2025</div>
      <div style="font-size:15px; font-weight:700; margin-bottom:4px;" data-field="ms-1-title">Pilot Launch</div>
      <div style="font-size:13px; color:#666; line-height:1.5;" data-field="ms-1-desc">Free 30-day pilot with up to 50 robots across 3 sites.</div>
    </div>
  </div>
  <!-- repeat for each milestone; omit connecting line on last item -->
</div>
```

**Tip**: Timelines alone don't fill a page. Always add a stats row or "Why Farhand" section below.

### Process Flow (Horizontal)

5 steps with numbered circles and arrows between them.

```html
<div style="display:flex; align-items:flex-start; gap:8px; padding:20px; background:#f5f5f5; border-radius:10px;">
  <div style="text-align:center; flex:1;">
    <div style="width:40px; height:40px; border-radius:50%; background:#33ee69; color:#10100d; font-size:16px; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">1</div>
    <div style="font-size:14px; font-weight:700; margin-bottom:4px;" data-field="step-1-title">Onboard</div>
    <div style="font-size:13px; color:#666; line-height:1.4;" data-field="step-1-desc">Sign up and share docs.</div>
  </div>
  <!-- ArrowRight SVG between steps -->
  <div style="display:flex; align-items:center; flex-shrink:0; padding-top:8px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#666" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69l-58.35-58.34a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>
  </div>
  <!-- repeat step + arrow pattern; no arrow after last step -->
</div>
```

### Testimonial / Quote
Pull-quote with attribution. Green left border accent. Italic text.

### Partner/Client Logos
"Trusted By" bar: horizontal row of grayscale logos (28px height).

### CTA Footer
Bold headline ("Let's talk about a free pilot"). Contact details in green-bordered pills with Phosphor icons. Anchored to bottom with `margin-top: auto`.

---

## REFERENCES

Before generating a new one-pager, **always check** `references/` for style examples:
- **Images (PNG, JPG)**: 7 Farhand reference one-pagers — match their visual style
- **HTML files**: read them and replicate their style
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
npm run dev    # http://localhost:3000
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
│   │   │   ├── page.tsx          # Viewer + sidebar + polling
│   │   │   └── api/              # API routes (current-html, export-pdf, etc.)
│   │   ├── components/
│   │   │   ├── PreviewPanel.tsx   # iframe preview with zoom
│   │   │   ├── FileBrowser.tsx    # Saved files list
│   │   │   └── TextFields.tsx     # Inline text editor
│   │   └── lib/
│   │       ├── types.ts           # SavedFile, EditableField
│   │       └── utils.ts           # Helpers
│   ├── outputs/                   # Saved versions (gitignored)
│   └── package.json
├── brand/                         # Farhand logo + colors
│   ├── logo-w-type-light-base64.txt  # Base64 full logo for embedding
│   ├── logo-w-type-light.png     # Full logo with text (light bg)
│   ├── logo-w-type-dark.png      # Full logo with text (dark bg)
│   ├── logo-500x500.png          # Square symbol logo
│   ├── logo-250-base64.txt       # Base64 square icon (legacy)
│   ├── favicon.svg               # Browser tab icon
│   └── colors.css                # CSS custom properties
├── references/                    # Style examples for Claude to match
│   ├── AMR.png                   # AMR support one-pager
│   ├── Farhand Teleoperation.png # Teleoperation one-pager
│   ├── Generic Support Partner.png
│   ├── Research Labs.png
│   ├── variant-pricing-focus.png # Pricing-focused variant
│   ├── pilot-engagement-template.png # Pilot engagement summary
│   ├── farhand-logo-icon.png     # Logo on green background
│   ├── README.md
│   └── urls.txt
├── CLAUDE.md                      # This file
├── README.md
└── PRD.md
```

## ANTI-PATTERNS

- NEVER use JavaScript in the HTML output
- NEVER use external CSS files in templates
- NEVER skip `print-color-adjust: exact` — PDFs will lose backgrounds
- NEVER let content overflow the page boundary
- NEVER use SVG for layout (Puppeteer rendering issues) — pure HTML/CSS only
- NEVER hardcode Farhand branding when creating for a different company
- NEVER forget `data-field` attributes on editable text elements
- NEVER use emojis — use Phosphor Icons as inline SVGs
- NEVER use text smaller than 11px — body text minimum is 13px
- NEVER use `brand/logo-250-base64.txt` — use `brand/logo-w-type-light-base64.txt`
- NEVER nest `data-field` attributes (e.g., `<div data-field="a"><span data-field="b">`) — the update-text regex breaks on nested fields. Each `data-field` element must contain ONLY text, no child elements with their own `data-field`.
