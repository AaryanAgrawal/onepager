# Claude Code Instructions — OnePager

## WHAT THIS IS

A local web tool for startups to create branded one-pager PDFs. Split-panel editor: form inputs on left, live HTML preview on right, one-click PDF export via Puppeteer. No databases, no auth, no backend complexity — just a Next.js app that runs locally.

**Read `PRD.md` for the full spec.** It contains everything: architecture, tech stack, UI layout, templates, TypeScript interfaces, test cases, and implementation priority. Follow it as your blueprint.

## CORE PRINCIPLES

- **One-shot buildable**: This repo is designed so Claude Code can implement the full app in a single session by reading the PRD
- **Simplicity first**: No databases, no auth, no server state. React state + local filesystem only
- **WYSIWYG**: The live preview must match the exported PDF exactly
- **Standalone outputs**: Exported HTML files must work in any browser with zero external dependencies (inline CSS, base64 images, Google Fonts CDN links only)
- **Brand-agnostic**: All brand values are configurable. No hardcoded company names, colors, or logos

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| PDF Generation | Puppeteer (headless Chrome → PDF) |
| Live Preview | iframe with `srcdoc` |
| State | React useState/useReducer |
| Storage | Local filesystem (`./outputs/`) |
| Icons | Lucide React (ships with shadcn) |

## BUILD & RUN

```bash
npm install
npm run dev          # http://localhost:3000
```

PDF export requires Chrome/Chromium installed locally. Puppeteer auto-detects it.

## FILE STRUCTURE

```
onepager/
├── src/app/                    # Next.js App Router pages + API routes
│   ├── page.tsx                # Main editor page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Tailwind + brand variables
│   └── api/
│       ├── export-pdf/route.ts # Puppeteer PDF generation
│       ├── save-draft/route.ts # Save HTML + metadata to outputs/
│       └── list-versions/route.ts
├── src/components/
│   ├── ui/                     # shadcn components
│   └── editor/                 # App-specific components
│       ├── InputPanel.tsx
│       ├── PreviewPanel.tsx
│       ├── TemplateSelector.tsx
│       ├── BrandSection.tsx
│       ├── HeroSection.tsx
│       ├── ValuePropsSection.tsx
│       ├── PricingSection.tsx
│       ├── TeamSection.tsx
│       ├── SecuritySection.tsx
│       ├── CTASection.tsx
│       └── ExportBar.tsx
├── src/lib/
│   ├── templates/              # HTML template strings
│   ├── renderTemplate.ts       # Data → HTML string
│   ├── defaultData.ts          # Default form values
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Helpers (debounce, color)
├── src/hooks/
│   ├── useDebouncedValue.ts
│   └── useAutoSave.ts
├── brand/                      # Example brand assets (replace with your own)
├── outputs/                    # Saved versions (gitignored)
├── PRD.md                      # Full product spec
└── CLAUDE.md                   # This file
```

## IMPLEMENTATION RULES

### Templates
- Templates are HTML strings with `{{placeholder}}` interpolation
- All CSS is inline in `<style>` tags within the template
- CSS custom properties (`--primary`, `--accent`, `--bg`) for dynamic theming
- Templates render at exact US Letter dimensions (816px × 1056px at 96dpi)
- Content must never overflow the single page — use `overflow: hidden`, `-webkit-line-clamp`, `clamp()`

### Preview
- Use iframe `srcdoc` for live preview
- Debounce form updates (150ms) before re-rendering preview
- Zoom controls: 50%, 75%, 100%, Fit

### PDF Export
- Puppeteer with `printBackground: true` (critical — backgrounds disappear without it)
- Zero margins (template handles its own padding)
- `preferCSSPageSize: true`
- Wait for fonts: `document.fonts.ready`
- Save both PDF + HTML snapshot + metadata.json to `./outputs/{timestamp}-{slug}/`

### Images
- Convert uploaded logos to base64 data URLs immediately
- Embed in HTML directly — ensures standalone HTML works everywhere
- Accept PNG, SVG, JPG

### Design Quality
- Templates should NOT look generic. Use colored sidebars, rounded cards, gradient headers, pill badges, icon circles, proper whitespace
- Typography hierarchy: big bold headline → medium subtitles → small body → tiny labels
- Consistent border-radius: 8px cards, 4px tags, 24px pills

## TESTING

- Run `npm run dev` and verify the editor loads with defaults
- Type in form fields → preview should update within 200ms
- Upload a logo → should appear in preview
- Change colors → preview accent elements should update
- Click Export PDF → PDF should download and match preview exactly
- Open saved HTML file in browser → should render identically

## ENV VARS

```env
# .env.local (create this)
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_DEFAULT_EMAIL=hello@yourcompany.com
NEXT_PUBLIC_DEFAULT_PHONE=(555) 123-4567
NEXT_PUBLIC_DEFAULT_WEBSITE=yourcompany.com
```

## ANTI-PATTERNS

- NEVER hardcode company-specific names, colors, or contact info — use env vars or form state
- NEVER use external CSS files in templates — everything inline
- NEVER skip `printBackground: true` in Puppeteer — PDFs will be blank white
- NEVER rely on JavaScript in exported HTML — it must be pure HTML+CSS
- NEVER let template content overflow the page boundary
