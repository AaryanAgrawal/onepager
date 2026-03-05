# Design Preferences & Corrections

Learned patterns from user feedback. Apply ALL of these to every new document.

## Layout

- Workforce and AI Platform sections MUST be in bordered cards (border:1.5px solid #e5e5e5; border-radius:12px)
- Value prop cards use bordered cards, NOT gray background cards
- Segment pills use green BORDER (not filled green background)
- Cards need breathing room — 14-16px gap minimum between card sections
- CTA footer pills get Phosphor Icons (Phone, EnvelopeSimple, GlobeSimple)

## Icons

- **ONLY use Phosphor Icons** — never generate custom SVGs or hand-draw icon paths
- **ONLY use existing images and logos** — never try to create images programmatically
- Phosphor Icons are embedded as inline SVGs from https://phosphoricons.com (Regular weight)
- Fetch actual SVG paths from `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/regular/{name}.svg`
- Never use emojis as icon substitutes

## Logo

- Always use `brand/logo-w-type-light-base64.txt` — the FULL logo with "Farhand Robotics" text
- Never use `brand/logo-250-base64.txt` (square icon only) for documents
- Logo height: 48px on page 1 header, 28px on subsequent page headers

## Typography

- Hard minimum: 12px for any text. Body minimum: 13px.
- Inter is the default font for all Farhand documents

## Data Integrity (STRICT)

- **NEVER fabricate numbers, stats, or claims** — only use what's in Approved Copy or sourced from partner websites (e.g., Field Nation)
- If a number isn't approved, don't put it on the page. Leave it blank or use approved numbers only.
- Workforce stats come from: Approved Copy (page 1) + Field Nation website (page 2 coverage)
- If you need a stat and don't have it, ASK — don't invent.

## General

- Match reference images exactly — study AMR.png before building page 1
- Every correction from the user gets added here AND to CLAUDE.md anti-patterns
